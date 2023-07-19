<template>
  <a-modal
    title="定价模版"
    @cancel="onCancel"
    @ok="onOk"
    :visible="visible"
    destroyOnClose
    width="600px"
    :loading="loading"
  >
    <a-tabs type="card">
      <a-tab-pane
        v-for="site in sitesData"
        :key="site.countryCode"
        :tab="shopeeSite[site.countryCode]"
      >
        <PriceTemplateTabPane
          :ref="`PriceTemplateTabPane${site.currency}`"
          :site="site"
          @destroy="destroy"
        />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import Basic from '@/api/basic'
import Goods from '@/api/goods'
import PriceTemplateTabPane from './PriceTemplateTabPane'
import store from '@/store'
import { division } from '@/util'
import { unionBy, groupBy } from 'lodash'

const transRmbPrice = (price, rate) => {
  return Number(Number(division(price, rate)).toFixed(2))
}

export default {
  components: {
    PriceTemplateTabPane
  },
  data() {
    return {
      sitesData: [],
      products: [],
      visible: false,
      loading: false
    }
  },
  computed: {
    shopeeSite() {
      return store.getters.site
    }
  },
  mounted() {
    this.initTabs()
  },
  methods: {
    async initTabs() {
      const res = this.getSites().map(async ({ currency, countryCode }) => {
        if (!countryCode) countryCode = 'CNSC'
        const { data: rate } = await Basic.getCurrencyRate(currency)
        return { countryCode, currency, rate }
      })
      this.$data.sitesData = await Promise.all(res)
      this.$data.visible = true
    },
    getSites() {
      return unionBy(
        this.products.map(({ currency, countryCode }) => ({
          currency: currency || 'CNSC',
          countryCode
        })),
        'currency'
      )
    },
    onCancel() {
      this.destroy()
    },
    onOk() {
      const products = groupBy(this.products, 'currency')
      const ps = Object.keys(this.$refs)
        .map((name) => {
          const [component] = this.$refs[name]
          const value = component.getForm()
          const site = component.$props.site
          return { ...value, ...site }
        })
        .map((value) => {
          const { currency } = value
          return this.handleProductsPrice(products[currency], value)
        })
      this.$data.loading = true
      Promise.all(ps).then((res) => {
        this.$data.loading = false
        this.resolve(res)
        this.destroy()
      })
    },
    async handleProductsPrice(products, value) {
      const res = products.map(async (product) => {
        product = await this.handleByTemplate(product, value)
        product = this.handleByPrice(product, value)
        product = this.handleByEquation(product, value)
        return product
      })
      return await Promise.all(res)
    },
    /**处理模版 */
    async handleByTemplate(product, value) {
      const { template, currency, type } = value
      const { id: goodId, weight, hasVariation, variants, price } = product
      if (type !== 1 || !template) return product
      const { id } = template
      let params = []
      const obj = { currency, id, goodId, weight }
      if (hasVariation) {
        params = variants.map(({ price: purchaseCost }) => ({
          ...obj,
          purchaseCost
        }))
      } else {
        params = [{ ...obj, purchaseCost: price }]
      }
      const { data } = await Goods.usePriductPriceTemplate(params)
      if (hasVariation) {
        product.variants = variants.map((variant, index) => ({
          ...variant,
          price: data[index].originalPriceLocal,
          rmbPrice: data[index].originalPriceCNY
        }))
      } else {
        product.price = data[0].originalPriceLocal
        product.rmbPrice = data[0].originalPriceCNY
      }

      return product
    },
    /**统一价 */
    handleByPrice(product, value) {
      const { type, price, rate } = value
      const { hasVariation, variants } = product
      if (type !== 2 || !price) return product

      if (hasVariation) {
        product.variants = variants.map((variant) => {
          variant.rmbPrice = transRmbPrice(price, rate)
          variant.price = price
          return variant
        })
      } else {
        product.rmbPrice = transRmbPrice(price, rate)
        product.price = price
      }

      return product
    },
    /**计算公式 */
    handleByEquation(product, value) {
      const { multiplyNum, addNum, subtractNum, integerType, rate } = value
      const { hasVariation, variants } = product

      if (value.type !== 3) return product

      const trans = (price) => {
        if (multiplyNum) price = price * (multiplyNum / 100)
        if (addNum) price = price + addNum
        if (subtractNum) price = price - subtractNum

        price = Number(Number(price).toFixed(2))

        switch (integerType) {
          // 四舍五入
          case 1:
            price = Math.round(price)
            break
          // 向上取整
          case 2:
            price = Math.ceil(price)
            break
          // 向下取整
          case 3:
            price = Math.floor(price)
            break
          // 保留两位小数
          case 4:
            price = Number(Number(price).toFixed(1))
            break
          // 保留一位小数
          case 5:
            price = Number(Number(price).toFixed(2))
            break
          default:
            break
        }
        const rmbPrice = transRmbPrice(price, rate)
        return { price, rmbPrice }
      }

      if (hasVariation) {
        product.variants = variants.map((variant) => {
          const { price, rmbPrice } = trans(variant.price)
          variant.price = price
          variant.rmbPrice = rmbPrice
          return variant
        })
      } else {
        const { price, rmbPrice } = trans(product.price)
        product.price = price
        product.rmbPrice = rmbPrice
      }

      return product
    },
    destroy() {
      this.$destroy()
      if (document.body.contains(this.$el)) {
        document.body.removeChild(this.$el)
      }
    }
  }
}
</script>

<style></style>
