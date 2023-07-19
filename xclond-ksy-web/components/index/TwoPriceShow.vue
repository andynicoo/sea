<template>
  <div class="price-wrap">
    <div class="price-wrap-now">
      <i>{{ currency }}</i>
      <div v-html="forMatPrice(price)"></div>
    </div>
    <div class="price-wrap-old">{{ currency }}{{ ["string", "number"].includes(typeof oldPrice) ? oldPrice : "" }}</div>
  </div>
</template>
<script>
export default {
  name: "TwoPriceShow",
  data() {
    return {};
  },
  props: {
    price: [String, Number, Object],
    oldPrice: [String, Number, Object],
    currency: {
      type: String,
      default: "￥",
    },
  },
  methods: {
    /**
     * 价格小数点高低限时
     * @param price
     */
    forMatPrice(price) {
      if (["string", "number"].includes(typeof price)) {
        const arr = parseFloat(price).toFixed(2).toString().split(".");
        return `<b>${arr[0]}</b><em>.${arr[1]}</em>`;
      } else {
        return "暂无价格";
      }
    },
  },
};
</script>
<style lang="less" scoped>
.price-wrap {
  line-height: 22px;
  display: flex;
  align-items: flex-end;
  &-now {
    display: flex;
    align-items: flex-end;
    margin-right: 14px;
    /deep/ i {
      color: @priceColor;
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
    }
    /deep/ b {
      color: @priceColor;
      font-weight: 600;
      font-size: 28px;
    }
    /deep/ em {
      color: @priceColor;
      font-weight: 600;
      font-size: 20px;
    }
  }
  &-old {
    text-decoration: line-through;
    color: rgba(@textColor, 0.4);
    font-size: 14px;
  }
}
</style>
