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
      <!-- 多规格商品 -->
      <template v-if="record.hasVariation">
        <table class="content-table">
          <template v-for="(variants, index) in record.variants">
            <tr :key="variants.id" v-if="hasShow(record, index)">
              <td>
                <span class="variation-sku">
                  {{ variants.variationSku }}
                </span>
              </td>
              <td>
                <span> ：{{ variants.stock }} </span>
              </td>
            </tr>
          </template>
        </table>
        <a
          @click="onOpen(record)"
          class="me-link"
          v-if="record.variants.length > showLimit"
        >
          {{ hasOpen(record) }}
        </a>
      </template>
      <template v-else>
        <p>{{ record.stock }}</p>
      </template>
    </template>
    <template v-slot:after="{ record }">
      <!-- 多规格商品 -->
      <template v-if="record._change_">
        <template v-if="record.hasVariation">
          <table class="content-table">
            <template v-for="(variants, index) in record._variants_">
              <tr :key="variants.id" v-if="hasShow(record, index)">
                <td>
                  <span class="variation-sku">
                    {{ variants.variationSku }}
                  </span>
                </td>
                <td>
                  <a-form-item
                    class="custom-form-item"
                    :class="{ 'me-ma-0': !variants._valid_ }"
                    :validate-status="!!variants._valid_ ? 'error' : ''"
                    :help="variants._valid_"
                  >
                    <a-input
                      @input="onValidItemtAfter(variants, 'stock')"
                      size="small"
                      v-model="variants.stock"
                    />
                  </a-form-item>
                </td>
              </tr>
            </template>
          </table>
          <a
            @click="onOpen(record)"
            class="me-link"
            v-if="record.variants.length >= showLimit"
          >
            {{ hasOpen(record) }}
          </a>
        </template>
        <template v-else>
          <a-form-item
            class="custom-form-item"
            :class="{ 'me-ma-0': !record._valid_ }"
            :validate-status="!!record._valid_ ? 'error' : ''"
            :help="record._valid_"
          >
            <a-input
              @input="onValidItemtAfter(record, '_stock_')"
              size="small"
              v-model="record._stock_"
            />
          </a-form-item>
        </template>
      </template>
    </template>

    <template>
      <a-form-model
        style="max-width: 800px"
        class="custom-form-model"
        ref="edit-form"
        :model="formModel"
        :rules="formRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item :label="$t('stockEdit.tzfw')">
          <a-radio-group v-model="editScope">
            <a-radio :value="1"> {{ $t('stockEdit.allsku') }} </a-radio>
            <a-radio :value="2"> {{ $t('stockEdit.moresku') }}</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item prop="newStock">
          <template slot="label">
            <a-radio
              @change="onEditTypeChange(1)"
              :value="1"
              :checked="editType === 1"
            >
              {{ $t('stockEdit.newsku') }}
            </a-radio>
          </template>
          <a-input :disabled="editType !== 1" v-model="formModel.newStock" />
        </a-form-model-item>

        <a-form-model-item prop="addStock">
          <template slot="label">
            <a-radio
              @change="onEditTypeChange(2)"
              :value="2"
              :checked="editType === 2"
            >
              {{ $t('stockEdit.addstock') }}
            </a-radio>
          </template>
          <a-input :disabled="editType !== 2" v-model="formModel.addStock" />
        </a-form-model-item>

        <a-form-model-item>
          <template slot="label">
            <a-radio
              @change="onEditTypeChange(3)"
              :value="3"
              :checked="editType === 3"
            >
              {{ $t('stockEdit.decreasestock') }}
            </a-radio>
          </template>
          <a-form-model-item
            class="custom-form-model-item me-ib"
            prop="decStock"
            style="width: 150px;"
          >
            <a-input :disabled="editType !== 3" v-model="formModel.decStock" />
          </a-form-model-item>
          <span class="custom-form-model-item me-ib">
            {{ $t('stockEdit.centertext') }}
          </span>
          <a-form-model-item
            class="custom-form-model-item me-ib"
            prop="decBeforeStock"
            style="width: 150px;"
          >
            <a-input
              :disabled="editType !== 3"
              v-model="formModel.decBeforeStock"
            />
          </a-form-model-item>
          <span class="custom-form-model-item me-ib">
            {{ $t('stockEdit.j') }}
          </span>
        </a-form-model-item>
      </a-form-model>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { cloneDeep } from 'lodash'
import { POSITIVE_NUMBER } from '@/util/regex'
import Goods from '@/api/goods'

const showLimit = 2

export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    const newStockValidator = (rule, value, callback) => {
      const { editType } = this.$data
      if (editType !== 1) {
        callback()
        return
      }
      if (!value === 0 || value === '0') {
        callback()
        return
      }
      if (!POSITIVE_NUMBER.test(value)) {
        callback(new Error(this.$t('stockEdit.valid2')))
      }
      callback()
    }
    return {
      showLimit,
      editType: 1,
      editScope: 1,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      formModel: {
        newStock: null,
        addStock: null,
        decStock: null,
        decBeforeStock: null
      },
      formRules: {
        newStock: [{ validator: newStockValidator }],
        addStock: [
          { pattern: POSITIVE_NUMBER, message: this.$t('stockEdit.valid1') }
        ],
        decStock: [
          { pattern: POSITIVE_NUMBER, message: this.$t('stockEdit.valid1') }
        ],
        decBeforeStock: [
          { pattern: POSITIVE_NUMBER, message: this.$t('stockEdit.valid1') }
        ]
      }
    }
  },
  computed: {
    hasShow() {
      return (source, index) => {
        const { showLimit } = this.$data
        if (index >= showLimit) {
          if (source._open_) {
            return true
          }
          return false
        }
        return true
      }
    },
    hasOpen() {
      return (source) => {
        return source._open_
          ? this.$t('stockEdit.close')
          : this.$t('stockEdit.open')
      }
    }
  },
  methods: {
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
        dataSource = dataSource.map((element) => {
          element.stock = element._stock_
          element.variants = cloneDeep(element._variants_)
          return element
        })

        const loading = this.$Loading()
        let step = 0
        const progress = () => parseInt((++step / dataSource.length) * 100)
        const reqQueue = dataSource.map(async (element) => {
          let res = await Goods.stockBatchUpdatePrice(element)
          loading.progress(progress())
          return res
        })
        Promise.all(reqQueue)
          .then(() => {
            this.$message.warning({
              content: (h) => (
                <p style="color: red">
                  {this.$t('batchEditOption.resolveMessage1')}
                </p>
              ),
              duration: 10
            })
            resolve()
          })
          .catch(reject)
          .finally(async () => {
            await loading.clear()
          })
      })
    },
    /**预览 */
    async onPreview() {
      const valid = await this.$refs['edit-form'].validate()
      if (!valid) return
      const { dataSource, editType, formModel, editScope } = this.$data
      const { newStock, addStock, decStock, decBeforeStock } = formModel
      this.$data.dataSource = dataSource.map((element) => {
        element._change_ = true
        element._stock_ = element.stock
        element._variants_ = cloneDeep(element.variants)

        const r = () => {
          if (editType === 1 && newStock) {
            element._stock_ = newStock
          }
          if (editType === 2 && addStock) {
            element._stock_ = Number(addStock) + Number(element._stock_)
          }
          if (editType === 3 && decStock) {
            let stock = Number(element._stock_) - Number(decStock)
            if (decBeforeStock && stock <= decBeforeStock) {
              stock = decBeforeStock
            }
            element._stock_ = stock
          }
        }

        if (editScope === 1) {
          r()
        }
        if (editScope === 2 && element._stock_ > 0) {
          r()
        }

        if (element._stock_ < 0) element._stock_ = 0

        if (element.hasVariation) {
          element._variants_ = element._variants_.map((variants) => {
            const r = () => {
              if (editType === 1 && newStock) {
                variants.stock = newStock
              }
              if (editType === 2 && addStock) {
                variants.stock = Number(addStock) + Number(variants.stock)
              }
              if (editType === 3 && decStock) {
                let stock = Number(variants.stock) - Number(decStock)
                if (decBeforeStock && stock <= decBeforeStock) {
                  stock = decBeforeStock
                }
                variants.stock = stock
              }
            }
            if (editScope === 1) {
              r()
            }
            if (editScope === 2 && variants.stock > 0) {
              r()
            }

            if (variants.stock < 0) variants.stock = 0
            return variants
          })
        }

        return element
      })
    },
    /**打开收起 */
    onOpen(source) {
      this.$set(source, '_open_', !source._open_)
    },
    /**校验 */
    onValidItemtAfter(source, field) {
      this.onValidItemt(source, field)
      this.$data.dataSource = [...this.$data.dataSource]
    },
    /**类型改变事件 */
    onEditTypeChange(type) {
      this.$data.editType = type
      this.$refs['edit-form'].resetFields()
    },
    onValidItemt(source, field) {
      this.$set(source, '_valid_', null)
      let target = false
      if (source[field] != 0 && !POSITIVE_NUMBER.test(source[field])) {
        console.log('1')
        this.$set(source, '_valid_', this.$t('stockEdit.valid2'))
        target = true
      } else if (source[field] === null || source[field] === '') {
        console.log('2')
        this.$set(source, '_valid_', this.$t('stockEdit.valid2'))
        target = true
      }
      return target
    },
    /**设置默认值 */
    setDefaultValue() {
      this.$data.dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          this.$set(element, '_stock_', element.stock)
          if (element.hasVariation) {
            this.$set(element, '_variants_', element.variants)
          }
        }
      })
    },
    onValidDataSource() {
      const { dataSource } = this.$data
      return dataSource
        .map((element, index) => {
          let valid
          if (element.hasVariation) {
            valid = element._variants_
              .map((variant) => this.onValidItemt(variant, 'stock'))
              .some(Boolean)
          } else {
            valid = this.onValidItemt(element, '_stock_')
          }
          if (valid) {
            const current = Number.parseInt(index / this.$data.size) + 1
            this.$data.current = current
          }
          return valid
        })
        .every((status) => !status)
    }
  }
}
</script>

<style lang="scss" scoped>
.variation-sku {
  display: block;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}

.form-table {
  tr {
    td {
      padding: 0 10px;
      height: 40px;
    }
  }
}
</style>
<style lang="scss">
.content-table {
  tr {
    td {
      span {
        display: block;
        min-height: 25px;
      }
    }
  }
}
.custom-form-item {
  .ant-form-item-control {
    line-height: 25px;
  }
}

.custom-form-model-item {
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }
}
</style>

<style lang="scss">
.custom-form-model {
  .ant-form-item-label {
    .ant-radio-wrapper {
      margin: 0;

      span {
        &:not(.ant-radio) {
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }
}
</style>
