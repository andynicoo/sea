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
      <p class="me-desc">{{ record.itemSku }}</p>
    </template>
    <template v-slot:after="{ record }">
      <p class="me-desc">
        <!-- {{ typeof record._itemSku_ }} -->
        <a-input
          v-if="record._itemSku_ != undefined"
          :rows="3"
          v-model="record._itemSku_"
          :class="{ 'me-bred': validLen(record) }"
        />
        <span
          class="tip"
          v-show="validLen(record)"
          :class="{ 'me-cred': validLen(record) }"
          >{{ $t('toBeEdit.bksc') }}</span
        >
      </p>
    </template>

    <template>
      <a-form-model>
        <table class="form-table">
          <tr>
            <td>
              <a-radio
                @change="editType = 1"
                :checked="editType === 1"
                :value="1"
              >
                {{ $t('toBeEdit.fangshi1a') }}
              </a-radio>
            </td>
            <td>{{ $t('toBeEdit.zengjia') }}{{ $t('toBeEdit.qianzhui') }}</td>
            <td colspan="4">
              <a-form-model-item class="me-ma-0">
                <a-input
                  v-model="form.appendBefor"
                  :disabled="editType !== 1"
                  class="input"
                  :placeholder="$t('toBeEdit.qianzhui')"
                />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>{{ $t('toBeEdit.zengjia') }}{{ $t('toBeEdit.houzhui') }}</td>
            <td colspan="4">
              <a-form-model-item class="me-ma-0">
                <a-input
                  v-model="form.appendAfter"
                  :disabled="editType !== 1"
                  :placeholder="$t('toBeEdit.houzhui')"
                />
              </a-form-model-item>
            </td>
          </tr>

          <tr v-for="(type, index) in form.replaceChain" :key="index">
            <td>
              <template v-if="index === 0">
                <a-radio
                  @change="editType = 2"
                  :checked="editType === 2"
                  :value="2"
                >
                  {{ $t('toBeEdit.fangshi2a') }}
                </a-radio>
              </template>
            </td>
            <td>{{ $t('toBeEdit.guanjianzi') }}</td>
            <td>
              <a-form-model-item class="me-ma-0">
                <a-input
                  :disabled="editType !== 2"
                  v-model="type.keyword"
                  :placeholder="$t('toBeEdit.guanjianzi')"
                />
              </a-form-model-item>
            </td>
            <td>{{ $t('toBeEdit.replaceWith') }}</td>
            <td>
              <a-form-model-item class="me-ma-0">
                <a-input
                  :disabled="editType !== 2"
                  v-model="type.value"
                  :placeholder="$t('toBeEdit.replaceWith')"
                />
              </a-form-model-item>
            </td>
            <td style="text-align: left">
              <a-space>
                <template v-if="index === 0">
                  <a-button
                    @click="onPushFilter"
                    :disabled="editType !== 2"
                    shape="circle"
                    icon="plus"
                  />
                </template>
                <template v-else>
                  <a-button
                    @click="onPushFilter"
                    :disabled="editType !== 2"
                    v-if="index === 0"
                    shape="circle"
                    icon="plus"
                  />
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
                {{ $t('toBeEdit.fangshi3a') }}
              </a-radio>
            </td>
            <td style="vertical-align: text-top; padding-top: 5px">
              {{ $t('toBeEdit.shanchukey') }}
            </td>
            <td style="vertical-align: text-top; padding-top: 5px" colspan="4">
              <a-form-model-item class="me-ma-0">
                <a-textarea
                  v-model="form.remove"
                  :disabled="editType !== 3"
                  :placeholder="$t('toBeEdit.shanchuplease')"
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
                {{ $t('toBeEdit.fangshi4a') }}
              </a-radio>
            </td>
            <td style="vertical-align: text-top; padding-top: 10px">
              {{ $t('toBeEdit.guolv') }}
            </td>
            <td
              style="vertical-align: text-top; padding-top: 0px; text-align: left"
              colspan="4"
            >
              <a-form-model-item class="me-ma-0">
                <a-checkbox-group
                  v-model="form.filter"
                  :disabled="editType !== 4"
                  :options="plainOptions"
                />
              </a-form-model-item>
            </td>
          </tr>
        </table>
      </a-form-model>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { cloneDeep } from 'lodash'
import { EN_SIGN_CHAR } from '@/util/regex'
import Goods from '@/api/goods'

export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    return {
      // value: 1,
      plainOptions: [
        { label: this.$t('toBeEdit.quyinwen'), value: 1 },
        { label: this.$t('toBeEdit.qushuzi'), value: 2 },
        { label: this.$t('toBeEdit.qukongge'), value: 3 },
        { label: this.$t('toBeEdit.qufuhao'), value: 4 },
        { label: this.$t('toBeEdit.quhuohao'), value: 5 }
      ],
      editType: 1,
      form: {
        appendBefor: '',
        appendAfter: '',
        replaceChain: [{ keyword: '', value: '' }],
        remove: '',
        filter: null
      },
      whetherSave: true,
      validFlag: false
    }
  },
  methods: {
    inputChange(record) {
      console.log(record)
      const { dataSource, selectedRowKeys } = this.$data
      let data = cloneDeep(
        dataSource.filter(({ id }) => selectedRowKeys.includes(id))
      )
      this.$data.validFlag = false
      for (let i = 0; i < data.length; i++) {
        if (this.validLen(data[i])) {
          this.$data.validFlag = true
          break
        }
      }
    },
    //校验字符
    validLen(row) {
      if (row._itemSku_ == '') {
        return true
      } else {
        return false
      }
    },
    addReplactItem() {
      console.log(this.$data.form.replaceCode.length)
      if (this.$data.form.replaceCode.length > 9) {
        this.$Message({ type: 'error', content: this.$t('toBeEdit.zuiduo10') })
        return false
      }
      this.$data.form.replaceCode.push({ before: '', after: '' })
    },
    delReplactItem(index) {
      this.$data.form.replaceCode.splice(index, 1)
    },
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    /**设置默认值 */
    setDefaultValu() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (element._itemSku_ == undefined) {
          this.$set(element, '_itemSku_', element.itemSku)
        }
      })
    },
    onSave() {
      this.setDefaultValu()

      return new Promise((resolve, reject) => {
        const { dataSource, selectedRowKeys } = this.$data
        console.log(!selectedRowKeys.length)
        if (!selectedRowKeys.length) {
          reject('请选择要更新的商品')
          return
        }
        let data = cloneDeep(
          dataSource.filter(({ id }) => selectedRowKeys.includes(id))
        )
        data = data.map((element) => {
          // element.itemSku = element._itemSku_
          this.$set(element, 'itemSku', element._itemSku_)
          return element
        })
        this.$data.validFlag = false
        for (let i = 0; i < data.length; i++) {
          if (this.validLen(data[i])) {
            this.$data.validFlag = true
            break
          }
        }
        if (this.$data.validFlag) {
          this.$Message({
            type: 'error',
            content: this.$t('toBeEdit.bksc')
          })
          // return Promise.reject()
        }

        const loading = this.$Loading()
        let step = 0
        const progress = () => parseInt((++step / data.length) * 100)
        const reqQueue = data
          // .filter(({ id }) => selectedRowKeys.includes(id))
          .map(async (element) => {
            let res = await Goods.goodsBatchUpdate(element)
            loading.progress(progress())
            return res
          })
        Promise.all(reqQueue).finally(async () => {
          await loading.clear()
          resolve()
        })
      })
    },
    /**添加关键字替换规则 */
    onPushFilter() {
      let { replaceChain } = this.$data.form
      if (replaceChain.length < 10) {
        replaceChain.push({ keyword: '', value: '' })
        this.$set(this.$data.form, 'replaceChain', replaceChain)
      } else {
        this.$Message({ type: 'error', content: this.$t('toBeEdit.zuiduo10') })
      }
    },
    /**删除关键字替换规则 */
    onUnPushFilter(index) {
      this.$delete(this.$data.form.replaceChain, index)
    },
    /**预览 */
    onPreview() {
      const { form, dataSource, editType, selectedRowKeys } = this.$data
      const {
        appendAfter,
        appendBefor,
        itemSku,
        replaceChain,
        remove,
        filter
      } = form
      if (
        editType === 1 &&
        appendBefor === '' &&
        editType === 1 &&
        appendAfter === ''
      ) {
        this.$message.error(this.$t('toBeEdit.qihouzhuiselect'))
        return false
      }
      if (editType === 3 && remove === '') {
        this.$message.error(this.$t('toBeEdit.shanchukenot'))
        return false
      }
      this.$data.dataSource = dataSource.map((ele) => {
        // if (selectedRowKeys.includes(ele.id)) {
        // ele._itemSku_ = ele.itemSku
        this.$set(ele, '_itemSku_', ele.itemSku)
        if (editType === 1) {
          ele._itemSku_ = appendBefor + ele._itemSku_
          ele._itemSku_ = ele._itemSku_ + appendAfter
        }
        if (editType === 2) {
          replaceChain.forEach(({ keyword, value }) => {
            const reg = new RegExp(keyword, 'g')
            ele._itemSku_ = ele._itemSku_.replace(reg, value)
          })
        }
        if (editType === 3) {
          var removeArr = remove.split(',')
          removeArr.forEach((element) => {
            const reg = new RegExp(element, 'g')
            ele._itemSku_ = ele._itemSku_.replace(reg, '')
          })
        }
        if (editType === 4 && filter && Array.isArray(filter)) {
          /**去除英文 */
          if (filter.includes(1)) {
            ele._itemSku_ = ele._itemSku_.replace(/[a-zA-Z]+/g, '')
          }
          /**去除数字 */
          if (filter.includes(2)) {
            ele._itemSku_ = ele._itemSku_.replace(/\d+/g, '')
          }
          /**去除空格 */
          if (filter.includes(3)) {
            ele._itemSku_ = ele._itemSku_.replace(/\s+/g, '')
          }
          /**去除英文符号 */
          if (filter.includes(4)) {
            ele._itemSku_ = ele._itemSku_.replace(EN_SIGN_CHAR, '')
          }
          /**去除货号 */
          if (filter.includes(5)) {
            const reg = new RegExp(ele.itemSku, 'g')
            ele._itemSku_ = ele._itemSku_.replace(reg, '')
          }
        }
        // }
        return ele
      })
    },
    whetherChange() {
      const { dataSource } = this.$data
      const changes = dataSource.map(({ itemSku, _itemSku_ }) => {
        if (_itemSku_ && itemSku != _itemSku_) {
          return true
        } else {
          return false
        }
      })
      return changes.some(Boolean)
    }
  }
}
</script>

<style lang="scss" scoped>
.me-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-width: 250px;
  max-width: 350px;
}

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
      .input {
        width: 500px;
      }
    }
  }
}
.me-cred {
  color: red;
}
.me-bred {
  border: 1px solid red;
}
</style>
