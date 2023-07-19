<template>
  <BaseTable
    :columns="getColumns"
    :dataSource="dataSource"
    :pagination="getPagination"
    :loading="tableLoading"
    :rowSelection="rowSelection"
    :onCancel="onCancel"
    :onSave="onSave"
    :onPreview="onPreview"
    :onChange="onChange"
    :saveBtnText="$t('edit.update')"
    :saveMsg="$t('edit.updateSuccess')"
  >
    <template v-slot:before="{ record }">
      <p class="me-desc">{{ record.name }}</p>
    </template>
    <template v-slot:after="{ record }">
      <div v-if="record._change_">
        <a-form-model>
          <a-form-model-item
            :class="{ 'me-ma-0': !record._valid_ }"
            :validate-status="!!record._valid_ ? 'error' : ''"
            :help="record._valid_"
          >
            <a-textarea
              @input="onValidItem(record)"
              :rows="4"
              v-model="record._name_"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
    </template>

    <a-form-model>
      <table class="form-table">
        <tr>
          <td>
            <a-radio
              @change="editType = 1"
              :checked="editType === 1"
              :value="1"
            >
              {{ $t('nameEdit.type1') }}
            </a-radio>
          </td>
          <td>{{ $t('nameEdit.addprefix') }}</td>
          <td colspan="4">
            <a-form-model-item class="me-ma-0">
              <a-input v-model="filterForm.prefix" :disabled="editType !== 1" />
            </a-form-model-item>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>{{ $t('nameEdit.addsuffix') }}</td>
          <td colspan="4">
            <a-form-model-item class="me-ma-0">
              <a-input v-model="filterForm.suffix" :disabled="editType !== 1" />
            </a-form-model-item>
          </td>
        </tr>
        <tr v-for="(type, index) in filterForm.replaceChain" :key="index">
          <td>
            <template v-if="index === 0">
              <a-radio
                @change="editType = 2"
                :checked="editType === 2"
                :value="2"
              >
                {{ $t('nameEdit.type2') }}
              </a-radio>
            </template>
          </td>
          <td>{{ $t('nameEdit.keyword') }}</td>
          <td>
            <a-form-model-item class="me-ma-0">
              <a-input :disabled="editType !== 2" v-model="type.keyword" />
            </a-form-model-item>
          </td>
          <td>{{ $t('nameEdit.replace') }}</td>
          <td>
            <a-form-model-item class="me-ma-0">
              <a-input :disabled="editType !== 2" v-model="type.value" />
            </a-form-model-item>
          </td>
          <td style="text-align: left">
            <a-space>
              <template
                v-if="index === 0 && filterForm.replaceChain.length < 10"
              >
                <a-button
                  @click="onPushFilter"
                  :disabled="editType !== 2"
                  shape="circle"
                  icon="plus"
                />
              </template>
              <template v-if="index !== 0">
                <a-button
                  @click="onUnPushFilter(index)"
                  :disabled="editType !== 2"
                  shape="circle"
                  icon="minus"
                />
              </template>
            </a-space>
          </td>
        </tr>
        <tr>
          <td style="vertical-align: text-top; padding-top: 5px">
            <a-radio
              @change="editType = 3"
              :checked="editType === 3"
              :value="3"
            >
              {{ $t('nameEdit.type3') }}
            </a-radio>
          </td>
          <td style="vertical-align: text-top; padding-top: 5px">
            {{ $t('nameEdit.delete') }}
          </td>
          <td style="vertical-align: text-top; padding-top: 5px" colspan="4">
            <a-form-model-item class="me-ma-0">
              <a-textarea
                v-model="filterForm.rmKeyword"
                :disabled="editType !== 3"
              />
            </a-form-model-item>
          </td>
        </tr>
        <tr>
          <td style="vertical-align: text-top; padding-top: 10px">
            <a-radio
              @change="editType = 4"
              :checked="editType === 4"
              :value="4"
            >
              {{ $t('nameEdit.type4') }}
            </a-radio>
          </td>
          <td style="vertical-align: text-top; padding-top: 10px">
            {{ $t('nameEdit.filter') }}
          </td>
          <td
            style="vertical-align: text-top; padding-top: 0px; text-align: left"
            colspan="4"
          >
            <a-form-model-item class="me-ma-0">
              <a-checkbox-group
                v-model="filterForm.filter"
                :disabled="editType !== 4"
                :options="plainOptions"
              />
            </a-form-model-item>
          </td>
        </tr>
      </table>
    </a-form-model>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { EN_SIGN_CHAR } from '@/util/regex'
import Goods from '@/api/goods'
import { cloneDeep } from 'lodash'

export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    const plainOptions = [
      { label: this.$t('nameEdit.del1'), value: 1 },
      { label: this.$t('nameEdit.del2'), value: 2 },
      { label: this.$t('nameEdit.del3'), value: 3 },
      { label: this.$t('nameEdit.del4'), value: 4 },
      { label: this.$t('nameEdit.del5'), value: 5 }
    ]

    return {
      plainOptions,
      editType: 1,
      filterForm: {
        prefix: null,
        suffix: null,
        replaceChain: [{ keyword: null, value: null }],
        rmKeyword: null,
        filter: null
      }
    }
  },
  methods: {
    /**数据全部校验 */
    onValidDataSource() {
      const { dataSource, size } = this.$data
      return dataSource
        .map((element, index) => {
          const valid = this.onValidItem(element)
          if (!valid) {
            const current = Number.parseInt(index / size) + 1
            this.$data.current = current
          }
          return valid
        })
        .every(Boolean)
    },
    /**保存 */
    onSave() {
      this.setDefaultValue()
      return new Promise((resolve, reject) => {
        if (!this.onValidDataSource()) {
          reject(this.$t('batchEdit.formValidFail'))
          return
        }
        const { selectedRowKeys } = this.$data
        if (!selectedRowKeys.length) {
          reject('请选择要更新的商品')
          return
        }
        let dataSource = cloneDeep(this.$data.dataSource).filter(({ id }) => {
          return selectedRowKeys.includes(id)
        })

        // let dataSource = cloneDeep(this.$data.dataSource)
        dataSource = dataSource.map((element) => {
          element.name = element._name_
          return element
        })
        const loading = this.$Loading()
        let step = 0
        const progress = () => parseInt((++step / dataSource.length) * 100)
        const reqQueue = dataSource.map(async (element) => {
          let res = await Goods.goodsBatchUpdate(element)
          loading.progress(progress())
          return res
        })
        Promise.all(reqQueue)
          .then(resolve)
          .catch(reject)
          .finally(async () => {
            await loading.clear()
          })
      })
    },
    /**预览 */
    onPreview() {
      this.setDefaultValue()
      const { editType, filterForm, dataSource } = this.$data
      const { prefix, suffix, replaceChain, rmKeyword, filter } = filterForm

      dataSource.forEach((element) => {
        let _name_ = element.name
        /**方式1 */
        if (editType === 1) {
          if (prefix) _name_ = prefix + _name_
          if (suffix) _name_ = _name_ + suffix
        }
        /**方式2 */
        if (editType === 2) {
          replaceChain.forEach(({ keyword, value }) => {
            if (value === null) value = ''
            const reg = new RegExp(keyword, 'g')
            _name_ = _name_.replace(reg, value)
          })
        }
        /**方式3 */
        if (editType === 3) {
          const reg = new RegExp(rmKeyword, 'g')
          _name_ = _name_.replace(reg, '')
        }
        /**方式4 */
        if (editType === 4 && filter && Array.isArray(filter)) {
          /**去除英文 */
          if (filter.includes(1)) {
            _name_ = _name_.replace(/[a-zA-Z]+/g, '')
          }
          /**去除数字 */
          if (filter.includes(2)) {
            _name_ = _name_.replace(/\d+/g, '')
          }
          /**去除空格 */
          if (filter.includes(3)) {
            _name_ = _name_.replace(/\s+/g, '')
          }
          /**去除英文符号 */
          if (filter.includes(4)) {
            _name_ = _name_.replace(EN_SIGN_CHAR, '')
          }
          /**去除货号 */
          if (filter.includes(5)) {
            const reg = new RegExp(element.itemSku, 'g')
            _name_ = _name_.replace(reg, '')
          }
        }
        this.$set(element, '_name_', _name_)
      })
    },
    /**添加关键字替换规则 */
    onPushFilter() {
      let { replaceChain } = this.$data.filterForm
      replaceChain.push({ keyword: null, value: null })
      this.$set(this.$data.filterForm, 'replaceChain', replaceChain)
    },
    /**删除关键字替换规则 */
    onUnPushFilter(index) {
      this.$delete(this.$data.filterForm.replaceChain, index)
    },
    /**输入事件 */
    onValidItem(source) {
      this.$set(source, '_valid_', null)
      if (!source._name_) {
        this.$set(source, '_valid_', this.$t('nameEdit.valid1'))
        return false
      }
      return true
    },
    /**设置默认值 */
    setDefaultValue() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          this.$set(element, '_name_', element.name)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-table {
  tr {
    td {
      text-align: right;
      padding: 0 5px;

      &:nth-child(1) {
        min-width: 70px;
      }
      &:nth-child(2) {
        min-width: 100px;
      }
    }
  }
}
</style>
