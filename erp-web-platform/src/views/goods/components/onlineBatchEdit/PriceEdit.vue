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
                <span> ：{{ variants.price }} </span>
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
        <p>{{ record.price }}</p>
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
                      @input="onValidItemtAfter(variants, 'price')"
                      size="small"
                      v-model="variants.price"
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
              @input="onValidItemtAfter(record, '_price_')"
              size="small"
              v-model="record._price_"
            />
          </a-form-item>
        </template>
      </template>
    </template>

    <template>
      <a-form-model ref="edit-form" :model="formModel" :rules="formRules">
        <table class="form-table">
          <tr>
            <td>
              <span>
                <a-radio
                  @change="onChangeEditType(1)"
                  :checked="editType === 1"
                  :value="1"
                >
                  {{ $t('priceEdit.type1') }}
                </a-radio>
              </span>
            </td>
            <td>
              <span>{{ $t('priceEdit.newprice') }}</span>
            </td>
            <td>
              <a-form-model-item class="me-ma-0" prop="newPrice">
                <a-input
                  v-model="formModel.newPrice"
                  :disabled="editType !== 1"
                />
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td>
              <a-radio
                @change="onChangeEditType(2)"
                :checked="editType === 2"
                :value="2"
              >
                {{ $t('priceEdit.type2') }}
              </a-radio>
            </td>
            <td>
              <span>{{ $t('priceEdit.currentprice') }}</span>
            </td>
            <td>
              <a-space>
                <span>X</span>
                <a-form-model-item
                  style="width: 200px"
                  class="me-ib me-ma-0"
                  prop="multiplyNum"
                >
                  <a-input
                    v-model="formModel.multiplyNum"
                    :disabled="editType !== 2"
                    :placeholder="$t('priceEdit.ceng')"
                    suffix="%"
                  />
                </a-form-model-item>
                <span>+</span>
                <a-form-model-item
                  style="width: 200px"
                  class="me-ib me-ma-0"
                  prop="addNum"
                >
                  <a-input
                    v-model="formModel.addNum"
                    :disabled="editType !== 2"
                    :placeholder="$t('priceEdit.jia')"
                  />
                </a-form-model-item>
                <span>-</span>
                <a-form-model-item
                  style="width: 200px"
                  class="me-ib me-ma-0"
                  prop="subtractNum"
                >
                  <a-input
                    v-model="formModel.subtractNum"
                    :disabled="editType !== 2"
                    :placeholder="$t('priceEdit.jian')"
                  />
                </a-form-model-item>
              </a-space>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <span>{{ $t('priceEdit.jgqz') }}</span>
            </td>
            <td>
              <a-form-model-item class="me-ma-0" prop="integerType">
                <a-radio-group
                  v-model="formModel.integerType"
                  :disabled="editType !== 2"
                >
                  <a-radio :value="1"> {{ $t('priceEdit.sswr') }} </a-radio>
                  <a-radio :value="2"> {{ $t('priceEdit.xsqz') }} </a-radio>
                  <a-radio :value="3"> {{ $t('priceEdit.xxqz') }} </a-radio>
                  <a-radio :value="0"> {{ $t('priceEdit.bcl') }} </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <span>{{ $t('priceEdit.jgws') }}</span>
            </td>
            <td>
              <a-tooltip placement="topLeft">
                <template slot="title" v-if="!formModel.integerType">
                  <span>{{ $t('priceEdit.wsmsg') }}</span>
                </template>
                <a-form-model-item class="me-ma-0" prop="afterNum">
                  <a-input
                    v-model="formModel.afterNum"
                    :disabled="editType !== 2 || !formModel.integerType"
                    :placeholder="$t('priceEdit.ws')"
                  />
                </a-form-model-item>
              </a-tooltip>
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
import { cloneDeep, round, ceil, floor } from 'lodash'
import { PRICE } from '@/util/regex'
import Goods from '@/api/goods'

const showLimit = 2

const getRmbPrice = (price, rate) => Number(Number(price * rate).toFixed(2))

export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    const numValid = (rule, value, callback) => {
      if (value === null || value === '') {
        callback()
      }
      if (!PRICE.test(value)) {
        callback(new Error(this.$t('priceEdit.valid1')))
        return
      }
      if (value <= 0) {
        callback(new Error(this.$t('priceEdit.valid1')))
        return
      }
      callback()
    }
    const multiplyNumValid = (rule, value, callback) => {
      if (value === null || value === '') {
        callback()
      }
      if (!PRICE.test(value)) {
        callback(new Error(this.$t('priceEdit.valid1')))
        return
      }
      if (!(0 < value && value <= 100)) {
        callback(new Error(this.$t('priceEdit.valid2')))
        return
      }
      callback()
    }
    const afterNumValid = (rule, value, callback) => {
      if (value === null || value === '') {
        callback()
      }
      if (!/^[0-9]+$/.test(value)) {
        callback(new Error(this.$t('priceEdit.valid3')))
        return
      }
      callback()
    }
    return {
      showLimit,
      editType: 1,
      formModel: {
        newPrice: null,
        multiplyNum: null,
        addNum: null,
        subtractNum: null,
        integerType: null,
        afterNum: null
      },
      formRules: {
        newPrice: [{ validator: numValid }],
        multiplyNum: [{ validator: multiplyNumValid }],
        addNum: [{ validator: numValid }],
        subtractNum: [{ validator: numValid }],
        integerType: [],
        afterNum: [{ validator: afterNumValid }]
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
          ? this.$t('priceEdit.close')
          : this.$t('priceEdit.open')
      }
    }
  },
  methods: {
    /**数据请求后置 */
    getTableDataAfter() {
      /**
       * 过滤调参加折扣的商品
       */
      const { dataSource } = this.$data
      this.$data.dataSource = dataSource.filter(({ discountId }) => !discountId)
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
          element.price = element._price_
          element.rmbPrice = element._rmbPrice_
          element.variants = cloneDeep(element._variants_)
          return element
        })

        const loading = this.$Loading()
        let step = 0
        const progress = () => parseInt((++step / dataSource.length) * 100)
        const reqQueue = dataSource.map(async (element) => {
          let res = await Goods.goodsBatchUpdatePrice(element)
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
      this.setDefaultValue()
      const { dataSource, editType, formModel } = this.$data
      let {
        newPrice,
        multiplyNum,
        addNum,
        subtractNum,
        integerType,
        afterNum
      } = formModel
      newPrice = Number(newPrice)
      multiplyNum = Number(multiplyNum)
      addNum = Number(addNum)
      subtractNum = Number(subtractNum)
      integerType = Number(integerType)

      this.$refs['edit-form'].validate().then(() => {
        this.$data.dataSource = dataSource.map((element) => {
          const _variants_ = cloneDeep(element.variants)
          element._variants_ = _variants_
          element._change_ = true
          element._price_ = element.price

          /**
           * 方式1
           */
          if (newPrice && editType === 1) {
            element._price_ = newPrice
            element._rmbPrice_ = getRmbPrice(newPrice, element.rate)

            if (element.hasVariation) {
              /**
               * 多规格
               */
              element._variants_ = element._variants_.map((variant) => {
                variant.price = newPrice
                variant.rmbPrice = getRmbPrice(variant.price, element.rate)
                return variant
              })
            }
          }

          /**
           * 方式2
           */
          if (editType === 2) {
            let price = Number(element._price_)
            /**
             * 乘百分比
             */
            if (multiplyNum) {
              price = price * (multiplyNum / 100)
              element._price_ = price
              element._rmbPrice_ = getRmbPrice(price, element.rate)

              if (element.hasVariation) {
                element._variants_ = element._variants_.map((variant) => {
                  let price = Number(variant.price)
                  price = price * (multiplyNum / 100)
                  variant.price = price
                  variant.rmbPrice = getRmbPrice(price, element.rate)
                  return variant
                })
              }
            }

            /**
             * 加
             */
            if (addNum) {
              price = price + addNum
              element._price_ = price
              element._rmbPrice_ = getRmbPrice(price, element.rate)

              if (element.hasVariation) {
                element._variants_ = element._variants_.map((variant) => {
                  let price = Number(variant.price)
                  price = price + addNum
                  variant.price = price
                  variant.rmbPrice = getRmbPrice(price, element.rate)
                  return variant
                })
              }
            }

            /**
             * 减
             */
            if (subtractNum) {
              price = price - subtractNum
              element._price_ = price
              element._rmbPrice_ = getRmbPrice(price, element.rate)

              if (element.hasVariation) {
                element._variants_ = element._variants_.map((variant) => {
                  let price = Number(variant.price)
                  price = price - subtractNum
                  variant.price = price
                  variant.rmbPrice = getRmbPrice(price, element.rate)
                  return variant
                })
              }
            }

            /**
             * 价格取整
             */
            /**
             * 四舍五入
             */
            if (integerType === 1) {
              element._price_ = round(element._price_)
              element._rmbPrice_ = round(element._rmbPrice_)
              if (element.hasVariation) {
                element._variants_ = element._variants_.map((variant) => {
                  variant.price = round(variant.price)
                  variant.rmbPrice = round(variant.rmbPrice)
                  return variant
                })
              }
            }
            if (integerType === 2) {
              /**
               * 向上取整
               */
              element._price_ = ceil(element._price_)
              element._rmbPrice_ = ceil(element._rmbPrice_)
              if (element.hasVariation) {
                element._variants_ = element._variants_.map((variant) => {
                  variant.price = ceil(variant.price)
                  variant.rmbPrice = ceil(variant.rmbPrice)
                  return variant
                })
              }
            }
            if (integerType === 3) {
              /**
               * 向下取整
               */
              element._price_ = floor(element._price_)
              element._rmbPrice_ = floor(element._rmbPrice_)
              if (element.hasVariation) {
                element._variants_ = element._variants_.map((variant) => {
                  variant.price = floor(variant.price)
                  variant.rmbPrice = floor(variant.rmbPrice)
                  return variant
                })
              }
            }

            /**
             * 价格尾数
             */
            if (integerType && afterNum !== null && afterNum !== '') {
              const priceArr = String(element._price_)
                .split('')
                .reverse()
              const afterArr = String(afterNum)
                .split('')
                .reverse()

              if (priceArr.length > afterArr.length) {
                afterArr.forEach((num, index) => {
                  priceArr[index] = num
                })
                const price = Number(priceArr.reverse().join(''))
                element._price_ = price
                element._rmbPrice_ = getRmbPrice(price, element.rate)
              }

              if (element.hasVariation) {
                element._variants_ = element._variants_.map((variant) => {
                  const priceArr = String(variant.price)
                    .split('')
                    .reverse()
                  const afterArr = String(afterNum)
                    .split('')
                    .reverse()
                  if (priceArr.length > afterArr.length) {
                    afterArr.forEach((num, index) => {
                      priceArr[index] = num
                    })
                    const price = Number(priceArr.reverse().join(''))
                    variant.price = price
                    variant.rmbPrice = getRmbPrice(price, element.rate)
                  }
                  return variant
                })
              }
            }
          }

          element._price_ = round(element._price_, 2)
          element._rmbPrice_ = round(element._rmbPrice_, 2)
          if (element.hasVariation) {
            element._variants_ = element._variants_.map((variant) => {
              variant.price = round(variant.price, 2)
              variant.rmbPrice = round(variant.rmbPrice, 2)
              return variant
            })
          }

          return element
        })
      })
    },
    /**打开收起 */
    onOpen(source) {
      this.$set(source, '_open_', !source._open_)
    },
    /**金额校验 */
    onValidItemtAfter(source, field) {
      this.onValidItemt(source, field)
      this.$data.dataSource = [...this.$data.dataSource]
    },
    onValidItemt(source, field) {
      this.$set(source, '_valid_', null)
      let target = false
      if (!source[field]) {
        this.$set(source, '_valid_', this.$t('priceEdit.valid4'))
        target = true
      } else if (Number(source[field]) <= 0) {
        this.$set(source, '_valid_', this.$t('priceEdit.valid5'))
        target = true
      } else if (!PRICE.test(source[field])) {
        this.$set(source, '_valid_', this.$t('priceEdit.valid5'))
        target = true
      }
      return target
    },
    onChangeEditType(type) {
      this.$data.editType = type
    },
    /**设置默认值 */
    setDefaultValue() {
      this.$data.dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          this.$set(element, '_price_', element.price)
          this.$set(element, '_rmbPrice_', element.rmbPrice)
          if (element.hasVariation) {
            const _variants_ = cloneDeep(element.variants)
            this.$set(element, '_variants_', _variants_)
          }
        }
      })
    },
    /**数据校验 */
    onValidDataSource() {
      return this.$data.dataSource
        .map((element, index) => {
          let valid
          if (element.hasVariation) {
            valid = element._variants_
              .map((variant) => this.onValidItemt(variant, 'price'))
              .some(Boolean)
          } else {
            valid = this.onValidItemt(element, '_price_')
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
</style>
