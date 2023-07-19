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
    :saveBtnText="$t('batchEditOption.save')"
    :saveMsg="$t('common.batchEditSuccess')"
    :btnStyle="btnStyle"
    @initData="initData"
  >
    <template v-slot:before="{ record }">
      <div style="min-width: 250px">
        <p style="height: 25px; line-height: 25px">
          {{ $t('packageSizeEdit.packageLength') }}：
          {{ getFieldsValue(record, 'packageLength') }}
        </p>
        <p style="height: 25px; line-height: 25px">
          {{ $t('packageSizeEdit.packageWidth') }}：
          {{ getFieldsValue(record, 'packageWidth') }}
        </p>
        <p style="height: 25px; line-height: 25px">
          {{ $t('packageSizeEdit.packageHeight') }}：
          {{ getFieldsValue(record, 'packageHeight') }}
        </p>
      </div>
    </template>
    <template v-slot:after="{ record }">
      <div style="min-width: 250px">
        <template v-if="record._change_">
          <a-form-model>
            <a-form-model-item
              :validateStatus="record._packageLength_valid_ && 'error'"
              :help="record._packageLength_valid_"
              :class="{ 'me-ma-0': !!!record._packageLength_valid_ }"
            >
              <a-input
                @input="onItemValid(record, '_packageLength_')"
                :prefix="$t('packageSizeEdit.packageLength')"
                suffix="CM"
                v-model="record._packageLength_"
              />
            </a-form-model-item>
            <a-form-model-item
              :validateStatus="record._packageWidth_valid_ && 'error'"
              :help="record._packageWidth_valid_"
              :class="{ 'me-ma-0': !!!record._packageWidth_valid_ }"
            >
              <a-input
                @input="onItemValid(record, '_packageWidth_')"
                :prefix="$t('packageSizeEdit.packageWidth')"
                suffix="CM"
                v-model="record._packageWidth_"
              />
            </a-form-model-item>
            <a-form-model-item
              :validateStatus="record._packageHeight_valid_ && 'error'"
              :help="record._packageHeight_valid_"
              :class="{ 'me-ma-0': !!!record._packageHeight_valid_ }"
            >
              <a-input
                @input="onItemValid(record, '_packageHeight_')"
                :prefix="$t('packageSizeEdit.packageHeight')"
                suffix="CM"
                v-model="record._packageHeight_"
              />
            </a-form-model-item>
          </a-form-model>
        </template>
      </div>
    </template>

    <template>
      <a-form :form="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
        <table>
          <tr>
            <td>{{ $t('packageSizeEdit.useNewSize') }}：</td>
            <td>
              <a-form-item class="me-ma-0" style="width: 900px">
                <a-form-item class="me-ib me-mr-2 me-ma-0">
                  <a-input
                    :prefix="$t('packageSizeEdit.packageLength')"
                    suffix="CM"
                    v-decorator="['packageLength', { rules: lengthValid }]"
                  />
                </a-form-item>
                <a-form-item class="me-ib me-mr-2 me-ma-0">
                  <a-input
                    :prefix="$t('packageSizeEdit.packageWidth')"
                    suffix="CM"
                    v-decorator="['packageWidth', { rules: widthValid }]"
                  />
                </a-form-item>
                <a-form-item class="me-ib me-mr-2 me-ma-0">
                  <a-input
                    :prefix="$t('packageSizeEdit.packageHeight')"
                    suffix="CM"
                    v-decorator="['packageHeight', { rules: heightValid }]"
                  />
                </a-form-item>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { cloneDeep } from 'lodash'
import { PRICE } from '@/util/regex'
import Goods from '@/api/goods'

export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    return {
      btnStyle: {
        top: 10,
        left: 85
      },
      form: this.$form.createForm(this),
      lengthValid: [
        {
          pattern: PRICE,
          message: this.$t('packageSizeEdit.numberValid')
        }
      ],
      widthValid: [
        {
          pattern: PRICE,
          message: this.$t('packageSizeEdit.numberValid')
        }
      ],
      heightValid: [
        {
          pattern: PRICE,
          message: this.$t('packageSizeEdit.numberValid')
        }
      ]
    }
  },
  computed: {
    getFieldsValue() {
      return (product, field) => {
        if (!product[field]) return '--'
        return `${product[field]} CM`
      }
    }
  },
  methods: {
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    /**保存 */
    async onSave() {
      const { selectedRowKeys, dataSource } = this.$data
      this.setDefaultValue()
      if (!this.validForm()) {
        this.$message.error(this.$t('packageSizeEdit.validError'))
        return
      }
      let _data = dataSource.filter(({ id }) => selectedRowKeys.includes(id))
      _data = cloneDeep(_data).map((element) => {
        element.packageLength = element._packageLength_
        element.packageWidth = element._packageWidth_
        element.packageHeight = element._packageHeight_
        return element
      })
      await Goods.handleEditBatch(_data)
    },
    /**预览 */
    onPreview() {
      const { form, dataSource } = this.$data
      form.validateFields().then((data) => {
        this.setDefaultValue()
        const { packageHeight, packageLength, packageWidth } = data
        dataSource.forEach((element) => {
          this.$set(element, '_packageHeight_', packageHeight)
          this.$set(element, '_packageLength_', packageLength)
          this.$set(element, '_packageWidth_', packageWidth)
        })
      })
    },
    /**校验 */
    onItemValid(product, field) {
      if (/\d/.test(product[field])) {
        if (!PRICE.test(product[field])) {
          const valid = this.$t('packageSizeEdit.numberValid')
          this.$set(product, `${field}valid_`, valid)
          return false
        }
        this.$set(product, `${field}valid_`, null)
        return true
      } else {
        if (product[field]) {
          const valid = this.$t('packageSizeEdit.numberValid')
          this.$set(product, `${field}valid_`, valid)
          return false
        }
        this.$set(product, `${field}valid_`, null)
        return true
      }
    },
    /**整体校验 */
    validForm() {
      const { selectedRows } = this.$data
      const valids = selectedRows.map((product, index) => {
        const packageHeight = this.onItemValid(product, '_packageHeight_')
        const packageLength = this.onItemValid(product, '_packageLength_')
        const packageWidth = this.onItemValid(product, '_packageWidth_')
        if (packageHeight && packageLength && packageWidth) {
          return true
        }
        const current = Number.parseInt(index / 10) + 1
        this.$data.current = current
        return false
      })
      return valids.every(Boolean)
    },
    /**设置默认值 */
    setDefaultValue() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          if (!element._packageHeight_) {
            this.$set(element, '_packageHeight_', element.packageHeight)
          }
          if (!element._packageLength_) {
            this.$set(element, '_packageLength_', element.packageLength)
          }
          if (!element._packageWidth_) {
            this.$set(element, '_packageWidth_', element.packageWidth)
          }
        }
      })
    },
    initData() {
      this.getTableData()
    }
  }
}
</script>
