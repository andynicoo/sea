<template>
  <BaseTable
    ref="baseTable"
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
    <template v-slot:before="{ record, index }">
      <ul class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
        <li v-for="item in record.specs" :key="item.name">
          <p
            class="me-spec-item"
            v-for="(item2, index) in item.options"
            :key="index"
          >
            {{ item2 }}
          </p>
        </li>
      </ul>
      <a-button type="link" @click="viewAll(index)" v-if="record._specLen_ > 2">
        {{ record._viewflag_ ? $t('common.putAll') : $t('common.viewAll') }}
      </a-button>
    </template>
    <template v-slot:after="{ record, index }">
      <ul class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
        <li v-for="item in record.specs" :key="item.name">
          <p
            class="me-spec-item"
            v-for="(item2, index) in item._options_"
            :key="index"
          >
            <a-input
              v-model="item2.label"
              size="small"
              class="me-w320"
              :class="{
                'me-bred': record.merchantId
                  ? getByteLen(item2.label) > record._optionLen_
                  : item2.label.length > record._optionLen_
              }"
            />
            <span
              :class="{
                'me-cred': record.merchantId
                  ? getByteLen(item2.label) > record._optionLen_
                  : item2.label.length > record._optionLen_
              }"
            >
              <span v-if="record.merchantId">{{
                getByteLen(item2.label)
              }}</span>
              <span v-else>{{ item2.label.length }}</span>
              /{{ record._optionLen_ }}</span
            >
          </p>
        </li>
      </ul>
      <a-button
        v-if="record._specLen_ > 2 && record.specs[0]._options_"
        type="link"
        @click="viewAll(index)"
      >
        {{ record._viewflag_ ? $t('common.putAll') : $t('common.viewAll') }}
      </a-button>
    </template>

    <template>
      <a-form :form="form">
        <a-form-item>
          <a-radio-group v-decorator="['radioVal', { initialValue: 1 }]">
            <table class="me-spec-setting">
              <tr>
                <td>
                  <a-radio :value="1">{{ $t('toBeEdit.addPre') }} :</a-radio>
                </td>
                <td><a-input v-decorator="['preSpec']" /></td>
                <td>{{ $t('toBeEdit.addSuf') }} :</td>
                <td><a-input v-decorator="['sufSpec']" /></td>
              </tr>
              <tr>
                <td>
                  <a-radio :value="2">{{ $t('toBeEdit.specIn') }} :</a-radio>
                </td>
                <td><a-input v-decorator="['beforeSpec']" /></td>
                <td>{{ $t('toBeEdit.replaceWith') }} :</td>
                <td><a-input v-decorator="['afterSpec']" /></td>
              </tr>
              <tr>
                <td>
                  <a-radio :value="3">{{ $t('toBeEdit.delSpecIn') }} :</a-radio>
                </td>
                <td colspan="3">
                  <a-input
                    v-decorator="['delSpec']"
                    :placeholder="$t('toBeEdit.delTitleInTips')"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <a-checkbox
                    v-decorator="['delString', { valuePropName: 'checked' }]"
                    >{{ $t('toBeEdit.deleteDeyond') }}
                  </a-checkbox>
                </td>
                <td colspan="3">
                  （ {{ $t('toBeEdit.sku20') }}
                  ）
                </td>
              </tr>
            </table>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </template>
  </BaseTable>
</template>

<script>
import Goods from '@/api/goods'
import Basic from '@/api/basic'
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { cloneDeep } from 'lodash'
import { getByteLen } from '@/util'
export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  props: {
    rowKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      btnStyle: {
        top: 10,
        left: 160
      },
      form: this.$form.createForm(this),
      isValid: true,
      validFlag: false,
      isView: false,
      getByteLen
    }
  },

  mounted() {},
  methods: {
    //获取最大字符
    getMaxLen(row) {
      const { countryCode, storeType, specs } = row
      const { validData, validField } = this.$data
      if (specs[0] && specs[0]._options_) {
        let valid = validData.find(({ type }) => type === countryCode)
        valid = valid[validField[storeType]]['options']
        this.$set(row, '_optionLen_', valid)
      }
    },
    //添加展开收起标记
    getTableDataAfter() {
      this.$data.dataSource.forEach((item) => {
        let specLen = 0
        console.log(item)
        if (item.specs) {
          item.specs.forEach((item2) => {
            specLen += item2.options.length
          })
        }

        this.$set(item, '_viewflag_', false)
        this.$set(item, '_specLen_', specLen)
      })
    },
    //显示全部
    viewAll(index, flag) {
      this.$data.dataSource[index]._viewflag_ =
        flag || !this.$data.dataSource[index]._viewflag_
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

          if (element.specs) {
            element.specs.forEach((ele2) => {
              if (!ele2._options_) {
                this.$set(ele2, '_options_', this.returnOptions(ele2.options))
              }
            })
            this.getMaxLen(element)
          }
        }
      })
    },
    /**保存 */
    async onSave() {
      this.setDefaultValu()
      const { dataSource, selectedRowKeys } = this.$data
      let data = cloneDeep(
        dataSource.filter(
          ({ id, specs }) => selectedRowKeys.includes(id) && specs
        )
      )
      console.log(data)
      this.$data.validFlag = false
      for (let i = 0; i < data.length; i++) {
        let specs = data[i].specs
        if (data[i].merchantId) {
          //CNSC字符长度校验
          for (let x = 0; x < specs.length; x++) {
            for (let y = 0; y < specs[x]._options_.length; y++) {
              let _soLen = this.getByteLen(specs[x]._options_[y].label)
              console.log(_soLen, data[i]._optionLen_)
              if (_soLen > data[i]._optionLen_) {
                this.$data.validFlag = true
                this.viewAll(i, true)
              }
            }
          }
        } else {
          for (let x = 0; x < specs.length; x++) {
            for (let y = 0; y < specs[x]._options_.length; y++) {
              let _soLen = specs[x]._options_[y].label.length
              if (_soLen > data[i]._optionLen_) {
                this.$data.validFlag = true
                this.viewAll(i, true)
              }
            }
          }
        }
      }
      if (this.$data.validFlag) {
        this.$Message({
          type: 'error',
          content: this.$t('toBeEdit.saveSpecTips')
        })
        return Promise.reject()
      }
      data.forEach((ele) => {
        ele.specs.forEach((ele3) => {
          ele3.options = []
          ele3._options_.forEach((ele4) => {
            ele3.options.push(ele4.label)
          })
          if (ele3._name_) ele3.name = ele3._name_
        })
      })
      this.$data.isView = false
      await Goods.handleEditBatch(data)
    },

    // 编辑后的项
    returnOptions(options) {
      let obj = []
      options.forEach((item) => {
        obj.push({ label: item })
      })
      return obj
    },
    //编辑后的前后缀
    returnOptionsNew(options, pre = '', suf = '') {
      let obj = []
      options.forEach((item) => {
        obj.push({ label: pre + item.label + suf })
      })
      return obj
    },
    //编辑后的替换
    returnOptionsRep(options, before = '', after = '') {
      let obj = []
      console.log(before, after)
      // if(before != ''){
      options.forEach((item) => {
        item.label = item.label.replace(new RegExp(before, 'g'), after)
        obj.push({ label: item.label })
      })
      return obj
      // }
    },
    //编辑后的删除
    returnOptionsDel(options, str = '') {
      let obj = []
      options.forEach((item) => {
        str.split(',').forEach((item2) => {
          if (item2) item.label = item.label.replace(new RegExp(item2, 'g'), '')
        })
        obj.push({ label: item.label })
      })
      return obj
    },
    //编辑后的删除超过20字符
    returnOptionsDel20(options, str) {
      let obj = []
      options.forEach((item) => {
        item.label = this.getStrByLength(item.label, str)
        obj.push({ label: item.label })
      })
      return obj
    },

    /**预览 */
    onPreview() {
      this.setDefaultValu()
      const { form, dataSource } = this.$data
      const data = form.getFieldsValue()
      this.$data.isView = true
      this.$data.dataSource = dataSource.map((ele) => {
        if (ele.specs) {
          ele.specs.forEach((item) => {
            this.$set(item, '_options_', this.returnOptions(item.options))
          })
          this.getMaxLen(ele)
        }

        if (data.radioVal == 1 && ele.specs) {
          ele.specs.forEach((item) => {
            item._options_ = this.returnOptionsNew(
              item._options_,
              data.preSpec,
              data.sufSpec
            )
          })
        }
        if (data.radioVal == 2 && ele.specs) {
          ele.specs.forEach((item) => {
            item._options_ = this.returnOptionsRep(
              item._options_,
              data.beforeSpec,
              data.afterSpec
            )
          })
        }
        if (data.radioVal == 3 && ele.specs) {
          ele.specs.forEach((item) => {
            item._options_ = this.returnOptionsDel(item._options_, data.delSpec)
          })
        }
        if (data.delString && ele.specs) {
          ele.specs.forEach((item) => {
            item._options_ = this.returnOptionsDel20(item._options_, 20)
            item._name_ = this.getStrByLength(item.name, 14)
          })
        }
        return ele
      })
    },
    // /**翻译 */
    async onTranslate({ lang }) {
      if (!this.$data.isView) {
        this.$message.error(this.$t('batchEditOption.translateErrorMsg'))
        return Promise.reject()
      }
      const _dataSource = this.$data.dataSource.map(async (ele) => {
        if (ele.specs) {
          const specs = ele.specs.map((item) => {
            if (item._options_) {
              return this.translateList(item._options_, lang, ele)
            }
          })
          return await Promise.all(specs)
        }
      })
      return await Promise.all(_dataSource)
    },
    async translateList(options, lang, row) {
      let list = options.map((ele, index) => ({
        countryCode:
          row.countryCode == 'CNSC'
            ? row.countryCode
            : lang == 'EN'
            ? ''
            : row.countryCode,
        source: ele.label,
        target: '',
        translateId: 10 + index
      }))
      const params = { list }
      if (row.countryCode == 'CNSC') {
        params.to = lang == 'EN' ? 'en' : 'zh'
      }
      // this.$refs.baseTable.translateLoading = true
      // this.$refs.baseTable.previewDisabled = true
      // this.$refs.baseTable.saveDisabled = true
      // this.$refs.baseTable.specTranslate = false
      const { data } = await Basic.batchTranslate(params)
      // 批量翻译接口返回的数据的顺序不一定前后相同,需要将拿到的数据根据translateId排个序
      data.list.sort((a, b) => a.translateId - b.translateId)
      // this.$refs.baseTable.translateLoading = false
      // this.$refs.baseTable.previewDisabled = false
      // this.$refs.baseTable.saveDisabled = false
      // this.$refs.baseTable.specTranslate = true
      data.list.forEach((item, index) => {
        if (item.target) {
          //翻译失败用原值
          options[index].label = item.target.slice(0, row._optionLen_)
        }
      })
    },
    initData() {
      this.getTableData()
    },
    getStrByLength(str, length) {
      if (getByteLen(str).length <= length) return str
      var arr = []
      var strarr = str.split('')
      for (let i of strarr) {
        var len = getByteLen([...arr, i].join(''))
        if (len > length) return arr.join('')
        arr = [...arr, i]
      }
      return arr.join('')
    }
  }
}
</script>

<style lang="scss" scoped>
.me-spec-setting {
  td {
    padding: 5px 0 5px 15px;
  }
  // tr {
  //   & td:nth-child(odd) {
  //     text-align: right;
  //   }
  // }
}
.me-w320 {
  width: 220px;
}
.me-spec-all {
  height: 81px;
  overflow: hidden;
}
.me-spec-item {
  line-height: 27px;
}
.me-show {
  height: auto;
}

.me-cred {
  color: red;
}
.me-bred {
  border: 1px solid red;
}
</style>
