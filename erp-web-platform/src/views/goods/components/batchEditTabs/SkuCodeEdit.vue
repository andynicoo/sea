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
    :oneClickCreateSku="oneClickCreateSku"
    @initData="initData"
  >
    <template v-slot:before="{ record }">
      <div>
        <p
          class="me-list-item"
          v-for="variants in getVariants(record, 'variants')"
          :key="variants.id"
        >
          <!-- <a-tooltip placement="topLeft">
            <template slot="title"> {{ variants._label_ }} </template>
            <span class="me-lable">{{ variants._label_ }}</span>
          </a-tooltip> -->
          <a-tooltip placement="topLeft">
            <template slot="title"> {{ variants.variationSku }} </template>
            <span>{{ variants.variationSku }}</span>
          </a-tooltip>
        </p>
        <template>
          <p
            class="me-link me-text-center"
            @click="onOpen(record)"
            v-if="record._open_ === false"
          >
            {{ $t('skuCodeEdit.openAll') }}
          </p>
          <p
            class="me-link me-text-center"
            @click="onOpen(record)"
            v-if="record._open_ === true"
          >
            {{ $t('skuCodeEdit.closeAll') }}
          </p>
        </template>
      </div>
    </template>
    <template v-slot:after="{ record }">
      <div>
        <template v-if="record._variants_">
          <p
            class="me-list-item"
            v-for="variants in getVariants(record, '_variants_')"
            :key="variants.id"
          >
            <!-- <a-tooltip placement="topLeft">
              <template slot="title"> {{ variants._label_ }} </template>
              <span class="me-lable">{{ variants._label_ }}</span>
            </a-tooltip> -->
            <a-tooltip placement="topLeft">
              <template slot="title" v-if="variants.variationSku">
                {{ variants.variationSku }}
              </template>
              <span>
                <a-form-model class="me-ib" style="width: 100%">
                  <a-form-model-item
                    class="custom-size"
                    :validateStatus="variants._valid_ && 'error'"
                    :help="variants._valid_"
                    :class="{ 'me-ma-0': !!!variants._valid_ }"
                  >
                    <a-input
                      size="small"
                      @change="onItemValid(variants)"
                      :rows="3"
                      v-model="variants.variationSku"
                    />
                  </a-form-model-item>
                </a-form-model>
              </span>
            </a-tooltip>
          </p>
          <template>
            <p
              class="me-link me-text-center"
              @click="onOpen(record)"
              v-if="record._open_ === false"
            >
              {{ $t('skuCodeEdit.openAll') }}
            </p>
            <p
              class="me-link me-text-center"
              @click="onOpen(record)"
              v-if="record._open_ === true"
            >
              {{ $t('skuCodeEdit.closeAll') }}
            </p>
          </template>
        </template>
      </div>
    </template>

    <template>
      <a-form :form="form">
        <table style="width: 600px">
          <!-- <tr class="me-text-right">
            <td>{{ $t('skuCodeEdit.formLabel1') }}：</td>
            <td colspan="3">
              <a-form-item class="me-ma-0">
                <a-input v-decorator="['newCode']" />
              </a-form-item>
            </td>
          </tr> -->
          <tr>
            <td class="me-text-right">{{ $t('skuCodeEdit.formLabel2') }}：</td>
            <td>
              <a-form-item class="me-ma-0">
                <a-input v-decorator="['before']" />
              </a-form-item>
            </td>
            <td class="me-text-right">{{ $t('skuCodeEdit.formLabel3') }}：</td>
            <td>
              <a-form-item class="me-ma-0">
                <a-input v-decorator="['after']" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="me-text-right">{{ $t('skuCodeEdit.formLabel4') }}：</td>
            <td>
              <a-form-item class="me-ma-0">
                <a-input v-decorator="['find']" />
              </a-form-item>
            </td>
            <td class="me-text-right">{{ $t('skuCodeEdit.formLabel5') }}：</td>
            <td>
              <a-form-item class="me-ma-0">
                <a-input v-decorator="['replace']" />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td class="me-text-right">{{ $t('skuCodeEdit.formLabel6') }}：</td>
            <td>
              <a-form-item class="me-ma-0">
                <a-input v-decorator="['remove']" />
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
import Goods from '@/api/goods'

export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    return {
      btnStyle: {
        top: 10,
        left: 113
      },
      form: this.$form.createForm(this),
      isOneClick: false, //是否触发一键生成sku
      basicColumns: [
        {
          title: this.$t('batchEditOption.productInfo'),
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: '400px'
        },
        {
          title: this.$t('batchEditOption.site'),
          dataIndex: 'sourceName',
          scopedSlots: { customRender: 'source' }
        },
        {
          title: this.$t('common.goodsCode'),
          dataIndex: 'itemSku',
          scopedSlots: { customRender: 'itemSku' }
        },
        {
          title: this.$t('batchEditOption.before'),
          dataIndex: 'before',
          scopedSlots: { customRender: 'before' }
        },
        {
          title: this.$t('batchEditOption.after'),
          dataIndex: 'after',
          scopedSlots: { customRender: 'after' }
        }
      ]
    }
  },
  computed: {
    getVariants() {
      return (product, field) => {
        if (!product[field]) return []
        if (product._open_) {
          return product[field]
        } else {
          return product[field].slice(0, 3)
        }
      }
    }
  },
  methods: {
    getTableDataAfter() {
      const { dataSource } = this.$data
      const find = (specs, index) => specs.map((c, i) => c.options[index[i]])
      dataSource.forEach((product) => {
        if (product.variants) {
          if (product.variants.length > 3) this.$set(product, '_open_', false)
          product.variants.forEach((variants) => {
            const label = find(product.specs, variants.index)
            this.$set(variants, '_label_', label.join(''))
          })
        }
      })
    },
    /**设置初始值 */
    setDefaultValue() {
      const { dataSource } = this.$data
      dataSource.forEach((product) => {
        if (!product._change_) {
          this.$set(product, '_change_', true)
          this.$set(product, '_variants_', cloneDeep(product.variants))
        }
      })
    },
    /**展开收起 */
    onOpen(product) {
      this.$set(product, '_open_', !product._open_)
    },
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    /**校验 */
    onValids() {
      const { dataSource, size } = this.$data
      let valids = dataSource.map((product, index) => {
        const subValid = product._variants_.map((variants) => {
          return this.onItemValid(variants)
        })
        const v = subValid.every(Boolean)
        if (!v) {
          const current = Number.parseInt(index / size) + 1
          this.$data.current = current
        }
        return v
      })
      return valids.every(Boolean)
    },
    /**保存 */
    async onSave() {
      const { selectedRowKeys, dataSource } = this.$data
      this.setDefaultValue()
      if (!this.onValids()) {
        this.$message.error(this.$t('skuCodeEdit.validMsg3'))
        return Promise.reject()
      }
      let _data = dataSource.filter(({ id }) => selectedRowKeys.includes(id))
      _data = cloneDeep(_data).map((ele) => {
        ele.variants = ele._variants_
        return ele
      })
      await Goods.handleEditBatch(_data)
    },
    /**预览 */
    onPreview() {
      const { form, dataSource, isOneClick } = this.$data
      if (!isOneClick) this.setDefaultValue()
      const data = form.getFieldsValue()
      const { newCode, before, after, find, replace = '', remove } = data
      dataSource.forEach((product) => {
        let { itemSku } = product
        this.$set(product, '_change_', true)
        product._variants_.forEach((variants, index) => {
          const oldValue = isOneClick
            ? `${itemSku}-${index + 1}`
            : product.variants[index].variationSku
          let code = oldValue
          if (newCode) code = newCode
          if (before) code = before + code
          if (after) code = code + after
          if (find) {
            const reg = new RegExp(find, 'g')
            code = code.replace(reg, replace)
          }
          if (remove) {
            const reg = new RegExp(remove, 'g')
            code = code.replace(reg, '')
          }
          code = code.slice(0, 20) // 自动截取到前20个字符
          if (!code) {
            this.$set(variants, '_valid_', this.$t('skuCodeEdit.validEmpty'))
          }
          if (code.length > 20) {
            this.$set(variants, '_valid_', this.$t('skuCodeEdit.validMsg4'))
          }
          this.$set(variants, 'variationSku', code)
        })
      })
    },
    /**输入事件 */
    onItemValid(variants) {
      const { variationSku } = variants
      if (!variationSku) {
        this.$set(variants, '_valid_', this.$t('skuCodeEdit.validEmpty'))
        return false
      }
      if (variationSku.length > 20) {
        this.$set(variants, '_valid_', this.$t('skuCodeEdit.validMsg4'))
        return false
      }
      this.$set(variants, '_valid_', null)
      return true
    },
    //一键生成sku
    oneClickCreateSku() {
      this.$data.isOneClick = true
      const { dataSource } = this.$data
      dataSource.forEach((product) => {
        let { itemSku } = product
        let _variants_ = cloneDeep(product.variants)
        _variants_.forEach((item, index) => {
          item.variationSku = `${itemSku}-${index + 1}`
        })
        this.$set(product, '_variants_', _variants_)
      })
    },
    initData() {
      this.$data.isOneClick = false
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.me-list-item {
  display: flex;
  align-items: center;
  min-height: 25px;

  .me-lable {
    position: relative;
    &::after {
      content: ':';
      display: inline-block;
      margin: 0 5px;
      position: absolute;
      right: 0;
    }
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 160px;
    display: inline-block;
  }
}

td {
  &.me-text-right {
    min-width: 10px;
  }

  &:not(.me-text-right) {
    min-width: 100px;
  }
}
</style>

<style lang="scss">
.custom-size {
  .ant-form-item-control {
    line-height: 23px !important;
  }
}
</style>
