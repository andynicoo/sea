<template>
  <div class="price-template-dialog">
    <a-tabs @change="tabsChange" :animated="false">
      <a-tab-pane
        v-for="(value, name) in dataObj"
        :key="name"
        :tab="shopeeSite[name] || ''"
      >
        <a-radio-group
          name="radioGroup"
          v-model="priceRadio"
          style="width: 100%"
        >
          <!-- <div class="price-template-item" v-if="name != 'CNSC'"> -->
          <div class="price-template-item">
            <div>
              <a-radio :value="1">
                {{ $t('goodsCollection.setPriceTem1') }}：
              </a-radio>
            </div>
            <div class="price-template-content">
              <a-select
                placeholder="请选择"
                v-model="currentTemplateId"
                style="width: 250px"
                :dropdownStyle="{ padding: '5px 15px' }"
                :disabled="priceRadio !== 1"
              >
                <div slot="dropdownRender" slot-scope="menu">
                  <div
                    style="padding: 4px 8px; cursor: pointer; color: #f7622f"
                    @mousedown="(e) => e.preventDefault()"
                    @click="createTemplate"
                  >
                    <a-icon type="plus" />
                    {{ $t('goodsCollection.createTemplate') }}
                  </div>
                  <div
                    class="me-handler-danger"
                    style="padding: 4px 8px; cursor: pointer"
                    @mousedown="(e) => e.preventDefault()"
                    @click="manageTemplate"
                  >
                    <a-icon type="unordered-list" />
                    {{ $t('goodsCollection.manageTemplate') }}
                  </div>
                  <a-divider style="margin: 4px 0" />
                  <v-nodes :vnodes="menu" />
                </div>
                <a-select-option
                  v-for="item in priceTemplateData"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="price-template-item" v-if="!isOnlyShowTem">
            <div>
              <a-radio :value="2">
                {{ $t('goodsCollection.setPriceTem2') }}：
              </a-radio>
            </div>
            <div class="price-template-content">
              <a-input
                :disabled="priceRadio !== 2"
                :addon-before="activeData.currency"
                v-model="flatPrice"
                v-positiveNumber="{ fixedNum: 2, minNum: 0.01 }"
              />
            </div>
          </div>
          <div class="price-template-item" v-if="!isOnlyShowTem">
            <div>
              <a-radio :value="3">
                {{ $t('goodsCollection.setPriceTem3') }}：
              </a-radio>
            </div>
            <div class="price-template-content">
              <div class="line">
                {{ $t('goodsCollection.setPriceTem4') }}<em>x</em>
                <a-input-number
                  @formatter="numberFormatter"
                  :disabled="priceRadio !== 3"
                  v-model="multiplyNum"
                  :min="0.01"
                  class="me-handler-wrap-hide me-w60"
                />
                <em>%</em><em>+</em>
                <a-input-number
                  @formatter="numberFormatter"
                  :disabled="priceRadio !== 3"
                  v-model="addNum"
                  class="me-handler-wrap-hide me-w60"
                />
                <em>-</em>
                <a-input-number
                  @formatter="numberFormatter"
                  :disabled="priceRadio !== 3"
                  v-model="subtractNum"
                  class="me-handler-wrap-hide me-w60"
                />
              </div>
              <div class="line">
                <span>{{ $t('goodsCollection.setPriceTem5') }}: </span>
                <a-radio-group
                  :disabled="priceRadio !== 3"
                  :options="integerTypeOptions"
                  v-model="integerType"
                  style="line-height: 32px"
                />
              </div>
              <div class="line" v-if="integerType < 4">
                <span>{{ $t('goodsCollection.setPriceTem6') }}: </span>
                <a-input
                  :disabled="priceRadio !== 3"
                  v-model="mantissaAmount"
                  v-positiveNumber="{ isInteger: 1 }"
                  class="me-handler-wrap-hide me-w120"
                />
              </div>
              <div class="line">
                <span>{{ $t('goodsCollection.setPriceTem7') }}: </span>
                <a-radio-group
                  :disabled="priceRadio !== 3"
                  :options="toFixedOptions"
                  v-model="integerType"
                  style="line-height: 32px"
                />
              </div>
            </div>
          </div>
        </a-radio-group>
      </a-tab-pane>
    </a-tabs>

    <!-- 创建模板 -->
    <a-modal
      :visible="createVisible"
      :title="$t('goodsCollection.setPriceTem8')"
      :confirm-loading="createLoading"
      :maskClosable="false"
      @ok="createTemplateOk"
      :bodyStyle="{ padding: 0 }"
      @cancel="createTemplateCancel"
      destroyOnClose
      :width="950"
    >
      <SetPriceTemplateCreate
        ref="createTemplate"
        :countryRate="activeData.rate"
        :countryCode="activeData.code"
      />
    </a-modal>
    <!-- 管理模板 -->
    <a-modal
      :visible="manageVisible"
      :title="$t('goodsCollection.setupTemplate')"
      :confirm-loading="manageLoading"
      :maskClosable="false"
      @ok="manageTemplateOk"
      @cancel="manageTemplateCancel"
      destroyOnClose
      :width="800"
    >
      <SetPriceTemplateManage
        ref="manageTemplate"
        :list="priceTemplateData"
        :countryRate="activeData.rate"
        :countryCode="activeData.code"
      />
    </a-modal>
  </div>
</template>

<script>
import { mcl, division, isEmpty, floatSub, add } from '@/util'
import SetPriceTemplateManage from './SetPriceTemplateManage'
import SetPriceTemplateCreate from './SetPriceTemplateCreate'
import Goods from '@/api/goods'
import Basic from '@/api/basic'
import { cloneDeep } from 'lodash'
import { positiveNumber } from '@/directive/number'

export default {
  components: {
    SetPriceTemplateCreate,
    SetPriceTemplateManage,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  directives: {
    positiveNumber
  },
  props: {
    list: {
      type: [Array, Object],
      defalut: () => []
    },
    isOnlyShowTem: {
      type: Boolean,
      defalut: false
    }
  },
  data() {
    return {
      dataObj: {},
      shopeeSite: this.$store.getters.site,
      activeData: {
        code: null,
        currency: null
      }, // 当前的站点参数
      priceRadio: 1,
      currentTemplateId: undefined,
      value: null,
      flatPrice: null,
      multiplyNum: 100,
      addNum: null,
      subtractNum: null,
      integerType: 1,
      mantissaAmount: null,
      createLoading: false,
      createVisible: false,
      manageLoading: false,
      manageVisible: false,
      integerTypeOptions: [
        { label: this.$t('goodsCollection.setPriceTem9'), value: 1 },
        { label: this.$t('goodsCollection.setPriceTem10'), value: 2 },
        { label: this.$t('goodsCollection.setPriceTem11'), value: 3 }
      ],
      toFixedOptions: [
        { label: this.$t('goodsCollection.setPriceTem12'), value: 4 },
        { label: this.$t('goodsCollection.setPriceTem13'), value: 5 }
      ],
      priceTemplateData: []
    }
  },
  async mounted() {
    await this.processData()

    // 商品采集--认领配置
    const path = this.$route.path
    if (['/goods/goods-collection', '/goods/collect'].includes(path)) {
      this.assignData(this.list[0])
    }
  },
  methods: {
    // 初始化tabs页头数据d
    processData() {
      let obj = {}
      let list = this.list
      if (!Array.isArray(this.list)) {
        list = [list]
      }
      list.forEach(async (item, index) => {
        item.countryCode = item.countryCode ? item.countryCode : 'CNSC'
        if (!obj[item.countryCode]) {
          obj[item.countryCode] = []
          // 判断商品信息有无汇率
          if (isEmpty(item.rate) && item.currency) {
            const { data } = await Basic.getCurrencyRate(item.currency)
            item.rate = data
          }
          if (index === 0) {
            this.activeData = {
              code: item.countryCode,
              rate: item.rate,
              currency: item.currency
            }
            this.getPriductPriceTemplateList()
          }

          obj[item.countryCode].push(item)
          obj[item.countryCode]['rate'] = item.rate
          obj[item.countryCode]['currency'] = item.currency
        } else {
          obj[item.countryCode].push(item)
        }
      })
      this.dataObj = obj
      // if (Object.keys(this.dataObj)[0] == 'CNSC') {
      //   this.priceRadio = 2
      // }
    },
    tabsChange(event) {
      // if (event == 'CNSC') this.$data.priceRadio = 2
      const data = this.dataObj[event]
      this.activeData = {
        code: event,
        rate: data.rate,
        currency: data.currency
      }
      this.currentTemplateId = undefined
      this.getPriductPriceTemplateList()
    },
    assignData(data) {
      this.priceRadio = !isEmpty(data.type) ? data.type : this.priceRadio
      this.addNum = !isEmpty(data.formulaAdd) ? data.formulaAdd : this.addNum
      this.mantissaAmount = !isEmpty(data.formulaMantissa)
        ? data.formulaMantissa
        : this.mantissaAmount
      this.multiplyNum = !isEmpty(data.formulaMultiply)
        ? data.formulaMultiply
        : this.multiplyNum
      this.integerType = !isEmpty(data.formulaRounding)
        ? data.formulaRounding
        : this.integerType
      this.subtractNum = !isEmpty(data.formulaSubtract)
        ? data.formulaSubtract
        : this.subtractNum
      this.currentTemplateId = !isEmpty(data.priceTemplateId)
        ? data.priceTemplateId
        : this.currentTemplateId
      this.flatPrice = !isEmpty(data.unifyPrice)
        ? data.unifyPrice
        : this.flatPrice
    },
    // 字符串转数字类型
    numberFormatter(value) {
      return Number(value)
    },
    //创建定价模板
    createTemplate() {
      this.$router.push('./create-pricing-template')
      // this.createVisible = true
    },
    //管理定价模板
    manageTemplate() {
      this.$router.push('./pricing-template')
      // this.manageVisible = true
    },
    getPriductPriceTemplateList() {
      return new Promise((resolve) => {
        Goods.getPriductPriceTemplateList(this.activeData.code).then(
          ({ data }) => {
            this.priceTemplateData = data || []
            resolve(data)
          }
        )
      })
    },
    createTemplateOk() {
      this.createLoading = true
      this.$refs.createTemplate
        .submit()
        .then((name) => {
          this.$message.success(this.$t('common.handlerSuccess'))
          this.createVisible = false
          this.createLoading = false
          this.getPriductPriceTemplateList().then((arr) => {
            let newTemplate = arr.filter((item) => item.name === name)
            this.currentTemplateId = newTemplate[0].id
          })
        })
        .catch(() => {})
        .finally(() => {
          this.createLoading = false
        })
    },
    createTemplateCancel() {
      this.createVisible = false
      this.createLoading = false
    },
    manageTemplateOk() {
      this.manageVisible = false
      this.getPriductPriceTemplateList().then((arr) => {
        let newTemplate = arr.filter(
          (item) => item.id === this.currentTemplateId
        )
        if (newTemplate.length === 0) {
          this.currentTemplateId = undefined
        }
      })
    },
    manageTemplateCancel() {
      this.manageVisible = false
      this.getPriductPriceTemplateList().then((arr) => {
        let newTemplate = arr.filter(
          (item) => item.id === this.currentTemplateId
        )
        if (newTemplate.length === 0) {
          this.currentTemplateId = undefined
        }
      })
    },
    // 校验数据不能为空
    verifyData() {
      let error = ''
      switch (this.priceRadio) {
        case 1:
          // 使用模板
          error = isEmpty(this.currentTemplateId)
            ? this.$t('goodsCollection.setPriceTem60')
            : ''
          break
        case 2:
          // 使用统一价
          error = isEmpty(this.flatPrice)
            ? this.$t('goodsCollection.setPriceTem61')
            : ''
          break
        case 3:
          // 使用公式
          error = isEmpty(this.multiplyNum)
            ? this.$t('goodsCollection.setPriceTem62')
            : ''
          break
        default:
          break
      }
      return error
    },
    // 校验价格不能小于0.01
    async verifyList(list) {
      let errorSkuArr = []
      await Promise.all(
        list.map(async (items) => {
          // 单品
          if (!items.hasVariation && items.price < 0.01) {
            errorSkuArr.push(items.itemSku)
          } else if (
            items.hasVariation &&
            Array.isArray(items.variants) &&
            items.variants.length > 0
          ) {
            // 多规格
            let isError = false
            await Promise.all(
              items.variants.map((item) => {
                if (item.price < 0.01) {
                  isError = true
                }
              })
            )
            if (isError) {
              errorSkuArr.push(items.itemSku)
            }
          }
        })
      )
      let error = ''
      if (!isEmpty(errorSkuArr)) {
        error = this.$t('goodsCollection.errorText1')
      }
      return error
    },
    // 更新数据的采购价格和RMB价格
    async updateList() {
      this.flatPrice = Number(this.flatPrice)
      let priceData = {}
      return new Promise((resolve) => {
        ;(async () => {
          let list = cloneDeep(this.dataObj[this.activeData.code])
          switch (this.priceRadio) {
            case 1:
              // 使用模板
              priceData = await this.usePriceTemplate(list)
              if (!isEmpty(priceData.data)) {
                await Promise.all(
                  list.map((item) => {
                    item = this.equationTemplateData(item, priceData.data)
                  })
                )
              }
              resolve(list)
              break
            case 2:
              // 使用统一价
              await Promise.all(
                list.map((item) => {
                  item = this.flatPriceData(item)
                })
              )
              resolve(list)
              break
            case 3:
              // 使用公式
              await Promise.all(
                list.map((item) => {
                  item = this.equationData(item)
                })
              )
              resolve(list)
              break
            default:
              break
          }
          return list
        })()
      })
    },
    // 提交(列表)
    submit() {
      this.flatPrice = Number(this.flatPrice)
      return new Promise((resolve, reject) => {
        ;(async () => {
          let list = await this.updateList()
          let error = await this.verifyList(list)
          if (!isEmpty(error)) {
            reject(error)
            return
          }
          let res = await Goods.handleEditBatch(list)
          resolve(res)
        })()
      })
    },
    // 使用定价模板(获取价格)
    async usePriceTemplate(list) {
      return new Promise((resolve) => {
        ;(async () => {
          let params = []
          await Promise.all(
            list.map(async (items) => {
              let obj = {
                currency: this.activeData.currency,
                id: this.currentTemplateId,
                goodId: items.id,
                weight: items.weight
              }
              if (
                items.hasVariation &&
                Array.isArray(items.variants) &&
                items.variants.length > 0
              ) {
                await Promise.all(
                  items.variants.map((item) => {
                    if (!isEmpty(item.price)) {
                      params.push(
                        Object.assign({ purchaseCost: Number(item.price) }, obj)
                      )
                    }
                  })
                )
              } else {
                if (!isEmpty(items.price)) {
                  params.push(
                    Object.assign({ purchaseCost: Number(items.price) }, obj)
                  )
                }
              }
            })
          )
          let res = await Goods.usePriductPriceTemplate(params)
          resolve(res)
          return res
        })()
      })
    },
    async equationTemplateData(items, data) {
      const itemsArr = data.filter((val) => {
        return val.goodId === items.id && val.purchaseCost == items.price
      })
      if (!items.hasVariation && itemsArr.length !== 0) {
        // 单品
        items.price = Number(itemsArr[0].originalPriceLocal)
        items.rmbPrice = Number(itemsArr[0].originalPriceCNY).toFixed(2)
      } else if (
        items.hasVariation &&
        Array.isArray(items.variants) &&
        items.variants.length > 0
      ) {
        // 多规格
        await Promise.all(
          items.variants.map((item) => {
            const itemArr = data.filter(
              (val) =>
                val.goodId == items.id && val.purchaseCost == Number(item.price)
            )
            if (itemArr.length > 0) {
              item.price = Number(itemArr[0].originalPriceLocal)
              item.rmbPrice = Number(itemArr[0].originalPriceCNY).toFixed(2)
            }
          })
        )
      }
      return items
    },
    // 使用统一价
    async flatPriceData(items) {
      if (!items.hasVariation) {
        // 单品
        items.price = Number(this.flatPrice)
        items.rmbPrice = Number(
          division(this.flatPrice, this.activeData.rate)
        ).toFixed(2)
      } else if (
        items.hasVariation &&
        Array.isArray(items.variants) &&
        items.variants.length > 0
      ) {
        // 多规格
        await Promise.all(
          items.variants.map((item) => {
            item.price = Number(this.flatPrice)
            item.rmbPrice = Number(
              division(this.flatPrice, this.activeData.rate)
            ).toFixed(2)
          })
        )
      }
      return items
    },
    // 使用公式
    async equationData(items) {
      let itemsObj = await this.equationItem(Number(items.price))
      // 单品
      if (!items.hasVariation) {
        items.price = Number(itemsObj.price)
        items.rmbPrice = Number(itemsObj.rmbPrice).toFixed(2)
      } else if (
        items.hasVariation &&
        Array.isArray(items.variants) &&
        items.variants.length > 0
      ) {
        // 多规格
        await Promise.all(
          items.variants.map(async (item) => {
            let itemObj = await this.equationItem(Number(item.price))
            item.price = Number(itemObj.price)
            item.rmbPrice = Number(itemObj.rmbPrice).toFixed(2)
          })
        )
      }
      return items
    },
    // 处理公式
    async equationItem(num) {
      const {
        multiplyNum = 1,
        addNum = 0,
        subtractNum = 0,
        integerType,
        mantissaAmount
      } = this.$data
      let price = await floatSub(
        add(mcl(num, division(multiplyNum, 100)), addNum),
        subtractNum
      )
      switch (integerType) {
        case 1:
          // 四舍五入
          price = Math.round(price)
          break
        case 2:
          // 向上取整
          price = Math.ceil(price)
          break
        case 3:
          // 向下取整
          price = Math.floor(price)
          break
        case 4:
          // 保留1位小数
          price = Number(price).toFixed(1)
          break
        case 5:
          // 保留2位小数
          price = Number(price).toFixed(2)
          break
      }
      let priceStr = price.toString()
      if (
        integerType < 4 &&
        !isEmpty(mantissaAmount) &&
        mantissaAmount.length < priceStr.length
      ) {
        price = await Number(
          priceStr
            .substring(0, priceStr.length - mantissaAmount.length)
            .padEnd(priceStr.length, mantissaAmount)
        )
      }
      let rmbPrice = Number(division(price, this.activeData.rate))
      return { price: price, rmbPrice: rmbPrice }
    },
    // 自动认领的定价模板参数作用域传参
    getData() {
      return this.$data
    }
  }
}
</script>

<style lang="scss" scoped>
.price-template-item {
  display: flex;
  > div:first-child {
    min-width: 150px;
    min-height: 28px;
    line-height: 28px;
  }
}
.price-template-item + .price-template-item {
  margin-top: 10px;
}
.price-template-content {
  .line {
    display: flex;
    line-height: 32px;
    em {
      margin: 0 6px;
    }
    em + em {
      margin-left: 0;
    }
    > span {
      min-width: 65px;
      margin-right: 10px;
    }
  }
  .line + .line {
    margin-top: 10px;
  }
}
</style>
