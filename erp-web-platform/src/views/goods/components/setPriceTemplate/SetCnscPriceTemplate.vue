<template>
  <!-- <a-tabs :active-key="1">
    <a-tab-pane :key="1" tab="CNSC"> -->
  <a-radio-group name="radioGroup" v-model="priceRadio" style="width: 100%">
    <div class="price-template-item">
      <div>
        <a-radio :value="2">
          {{ $t('goodsCollection.setPriceTem2') }}：
        </a-radio>
      </div>
      <div class="price-template-content">
        <!-- addon-before="RMB" -->
        <a-input
          :disabled="priceRadio !== 2"
          v-model="flatPrice"
          v-positiveNumber="{ fixedNum: 2, minNum: 0.01 }"
        />
      </div>
    </div>
    <div class="price-template-item">
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
            v-model="fixed"
            style="line-height: 32px"
          />
        </div>
      </div>
    </div>
  </a-radio-group>
  <!-- </a-tab-pane>
  </a-tabs> -->
</template>

<script>
import { positiveNumber } from '@/directive/number'
import { mcl, division, isEmpty, floatSub, add } from '@/util'

export default {
  directives: {
    positiveNumber
  },
  props: {
    list: {
      type: [Array, Object],
      defalut: () => []
    }
  },
  data() {
    return {
      priceRadio: 2,
      flatPrice: 0,
      multiplyNum: 100,
      addNum: null,
      subtractNum: null,
      integerType: 1,
      fixed: 2,
      mantissaAmount: null,
      integerTypeOptions: [
        { label: this.$t('goodsCollection.setPriceTem9'), value: 1 },
        { label: this.$t('goodsCollection.setPriceTem10'), value: 2 },
        { label: this.$t('goodsCollection.setPriceTem11'), value: 3 }
      ],
      toFixedOptions: [
        { label: this.$t('goodsCollection.setPriceTem12'), value: 1 },
        { label: this.$t('goodsCollection.setPriceTem13'), value: 2 }
      ]
    }
  },
  async mounted() {},
  methods: {
    /**
     * 字符串转数字类型
     */
    numberFormatter(value) {
      return Number(value)
    },
    /**
     * 提交(列表)
     */
    submit() {
      const list = this.$props.list
      switch (this.priceRadio) {
        case 1:
          break
        case 2:
          // 使用统一价
          return this.flatPriceData(list)
        case 3:
          // 使用公式
          return this.equationData(list)
        default:
          break
      }
    },
    /**
     * 使用统一价
     */
    flatPriceData(items) {
      if (!items.hasVariation) {
        // 单品
        items.price = this.tf(this.flatPrice)
        items.rmbPrice = this.tf(this.flatPrice)
      } else if (Array.isArray(items.variants)) {
        // 多规格
        items.variants = items.variants.map((item) => {
          item.price = this.tf(this.flatPrice)
          item.rmbPrice = this.tf(this.flatPrice)
          return item
        })
      }
      return items
    },
    /**
     * 使用公式
     */
    equationData(items) {
      /**单品 */
      if (!items.hasVariation) {
        items.price = this.equationItem(items.price)
        items.rmbPrice = this.equationItem(items.rmbPrice)
      } else if (items.hasVariation && Array.isArray(items.variants)) {
        /**多规格 */
        items.variants = items.variants.map((item) => {
          item.price = this.equationItem(item.price)
          item.rmbPrice = this.equationItem(item.rmbPrice)
          return item
        })
      }
      return items
    },
    // 处理公式
    equationItem(price) {
      price = Number(price)
      const {
        integerType,
        multiplyNum,
        addNum,
        subtractNum,
        fixed,
        mantissaAmount
      } = this.$data

      /**当前售价 */
      if (multiplyNum) price = price * (multiplyNum / 100)
      if (addNum) price = price + addNum
      if (subtractNum) price = price - subtractNum

      /**价格取整 */
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
      }

      /**尾数金额 */
      if (mantissaAmount) {
        price = Number(`${parseInt(price)}.${mantissaAmount}`)
      }

      /**保留小数 */
      switch (fixed) {
        case 1:
          // 保留1位小数
          price = Number(price).toFixed(1)
          break
        case 2:
          // 保留2位小数
          price = Number(price).toFixed(2)
          break
      }

      return this.tf(price)
    },
    tf(value) {
      return Number(Number(value).toFixed(2))
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
