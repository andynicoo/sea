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
    :onTranslate="onTranslate"
    :onChange="onChange"
    :saveBtnText="$t('batchEditOption.save')"
    :saveMsg="$t('common.batchEditSuccess')"
    :btnStyle="btnStyle"
    @initData="initData"
  >
    <template v-slot:before="{ record }">
      <p class="me-desc">{{ record.name }}</p>
    </template>
    <template v-slot:after="{ record }">
      <div v-if="record._name_">
        <a-textarea
          class="me-w400"
          :rows="4"
          v-model="record._name_"
          :class="{ 'me-bred': validLen(record) }"
        />
        <p class="me-str-num" :class="{ 'me-cred': validLen(record) }">
          {{ record._name_ ? record._name_.length : 0 }}/{{ getMaxLen(record) }}
        </p>
      </div>
    </template>

    <template>
      <table class="me-title-setting">
        <tr>
          <td>{{ $t('toBeEdit.userNewTit') }} :</td>
          <td colspan="3">
            <!-- <a-input v-model="formTitle.newTitle" /> -->
            <Emoji v-model="formTitle.newTitle" ids="newTitle"></Emoji>
          </td>
          <td></td>
        </tr>

        <tr>
          <td>{{ $t('toBeEdit.addPre') }} :</td>
          <td>
            <!-- <a-input v-model="formTitle.preTitle" /> -->
            <Emoji v-model="formTitle.preTitle" ids="preTitle"></Emoji>
          </td>
          <td>{{ $t('toBeEdit.addSuf') }} :</td>
          <td>
            <!-- <a-input v-model="formTitle.sufTitle" /> -->
            <Emoji v-model="formTitle.sufTitle" ids="sufTitle"></Emoji>
          </td>
          <td></td>
        </tr>
        <tr v-for="(item, index) in formTitle.replaceTitle" :key="index">
          <td>{{ $t('toBeEdit.titleIn') }} :</td>
          <td><a-input v-model="item.before" /></td>
          <td>{{ $t('toBeEdit.replaceWith') }} :</td>
          <td><a-input v-model="item.after" /></td>
          <td>
            <a-icon
              v-if="index == 0"
              type="plus"
              @click="addReplactItem"
            /><a-icon
              v-if="index > 0"
              type="minus"
              @click="delReplactItem(index)"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t('toBeEdit.delTitleIn') }} :</td>
          <td colspan="3">
            <a-input
              v-model="formTitle.delTitle"
              :placeholder="$t('toBeEdit.delTitleInTips')"
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>{{ $t('toBeEdit.optimizeSettings') }} :</td>
          <td colspan="3">
            <a-checkbox v-model="formTitle.caseTitle"
              >{{ $t('toBeEdit.capitalizeWord') }} </a-checkbox
            ><a-checkbox v-model="formTitle.maxTitle"
              >{{ $t('toBeEdit.maximumCharacter') }}
            </a-checkbox>
            <a-select
              default-value="1"
              style="width: 120px"
              v-model="formTitle.positionTitle"
            >
              <a-select-option value="1">
                {{ $t('toBeEdit.titleBefore') }}
              </a-select-option>
              <a-select-option value="2">
                {{ $t('toBeEdit.titleAfter') }}
              </a-select-option>
            </a-select>
            {{ $t('toBeEdit.deleteDeyond') }}
          </td>
          <td></td>
        </tr>
      </table>
    </template>
  </BaseTable>
</template>

<script>
import { firstUpperCase } from '@/util'
import Goods from '@/api/goods'
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { cloneDeep } from 'lodash'
import Emoji from '@/components/Emoji'
export default {
  mixins: [batchEditMixins],
  components: { BaseTable, Emoji },
  props: {
    rowKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      btnStyle: {
        top: 5,
        left: 108
      },
      form: this.$form.createForm(this),
      formTitle: {
        newTitle: '',
        preTitle: '',
        sufTitle: '',
        replaceTitle: [{ before: '', after: '' }],
        delTitle: '',
        caseTitle: false,
        maxTitle: false,
        positionTitle: '1'
      },
      isValid: true,
      validFlag: false
    }
  },
  methods: {
    //校验字符
    validLen(row) {
      if (row._name_.length > row._titLen_) {
        return true
      } else {
        return false
      }
    },
    //获取最大字符
    getMaxLen(row) {
      const { countryCode, storeType, _name_ } = row
      const { validData, validField } = this.$data
      if (_name_) {
        let valid = validData.find(({ type }) => type === countryCode)
        valid = valid[validField[storeType]]['title']
        this.$set(row, '_titLen_', valid)
        return valid
      }
    },
    //添加替换文字
    addReplactItem() {
      if (this.$data.formTitle.replaceTitle.length < 10) {
        this.$data.formTitle.replaceTitle.push({ before: '', after: '' })
      }
    },
    //删除替换文字
    delReplactItem(index) {
      this.$data.formTitle.replaceTitle.splice(index, 1)
    },
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    /**设置默认值 */
    setDefaultValu() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          this.$set(element, '_name_', element.name)
        }
      })
    },
    /**保存 */
    async onSave() {
      this.setDefaultValu()
      const { dataSource, selectedRowKeys } = this.$data
      let data = cloneDeep(dataSource).filter(({ id }) => {
        return selectedRowKeys.includes(id)
      })
      this.$data.validFlag = false
      for (let i = 0; i < data.length; i++) {
        if (this.validLen(data[i])) {
          this.$data.validFlag = true
          break
        }
      }
      if (this.$data.validFlag) {
        this.$Message({ type: 'error', content: this.$t('toBeEdit.saveTips') })
        return Promise.reject()
      }
      data = data.map((ele) => {
        ele.name = ele._name_
        return ele
      })
      await Goods.handleEditBatch(data)
    },
    /**预览 */
    onPreview() {
      this.setDefaultValu()
      const { formTitle, dataSource, selectedRowKeys } = this.$data
      const {
        newTitle,
        preTitle,
        sufTitle,
        replaceTitle,
        delTitle,
        caseTitle,
        maxTitle,
        positionTitle
      } = formTitle
      this.$data.dataSource = dataSource.map((ele) => {
        this.$set(ele, '_name_', ele.name)
        if (newTitle) ele._name_ = newTitle
        if (preTitle) ele._name_ = preTitle + ele._name_
        if (sufTitle) ele._name_ = ele._name_ + sufTitle
        replaceTitle.forEach((item) => {
          if (item.before)
            ele._name_ = ele._name_.replace(
              new RegExp(item.before, 'g'),
              item.after
            )
        })
        delTitle.split(',').forEach((item) => {
          if (item) ele._name_ = ele._name_.replace(new RegExp(item, 'g'), '')
        })
        if (caseTitle) ele._name_ = firstUpperCase(ele._name_)
        if (maxTitle) {
          if (positionTitle == 2) {
            ele._name_ = ele._name_.slice(0, ele._titLen_)
          } else {
            ele._name_ = ele._name_.slice(-ele._titLen_)
          }
        }
        return ele
      })
    },
    /**翻译 */
    async onTranslate({ lang }) {
      return await this.handlerTranslate('_name_', lang)
    },
    initData() {
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.me-title-setting {
  td {
    padding: 5px 0 5px 15px;
  }
  tr {
    & td:nth-child(odd) {
      text-align: right;
    }
  }
}
.me-w400 {
  width: 400px;
}
.me-str-num {
  text-align: right;
  width: 100%;
}
.me-cred {
  color: red;
}
.me-bred {
  border: 1px solid red;
}
</style>
