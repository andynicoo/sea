<template>
  <a-row :gutter="36" class="tab-list" v-if="list && list.length">
    <a-col :span="8" v-for="(item, index) in list" :key="`col_${index}`">
      <a
        class="tab-list-item"
        :href="`${$store.state.host.coupon_url}`"
        target="_blank"
        v-sensorsDire="{
          type: 'ClickCoupon',
          event: 'click',
          getParams: () => ({
            coupon_id: item.marketingCouponActivityId,
          }),
        }"
      >
        <i class="tag" v-if="item.label == 'EXCLUSIVE_FOR_NEWCOMERS'">新人专享</i>
        <div class="tab-list-item-content">
          <div class="tab-list-item-title">{{ item.couponName }}</div>
          <div class="tab-list-item-price">
            ￥<b>{{ item.content }}</b>
          </div>
          <div class="tab-list-item-rules">{{ getTypeLabel(item.useThresholdType, item.useThresholdValue) }}</div>
          <a-button type="primary">立即领取</a-button>
        </div>
      </a>
    </a-col>
  </a-row>
</template>
<script>
export default {
  name: "ActiveExclusive",
  data() {
    return {};
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    getTypeLabel(type, value) {
      switch (type) {
        case 'NO_THRESHOLD':
          return "无门槛";
          break;
        case 'USE_CONDITION_BY_MONEY':
          return `订单满${value}元可用`;
          break;
        default:
          return `订单满${value}件可用`;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.tab-list {
  &-item {
    display: block;
    position: relative;
    overflow: hidden;
    background: url("@/assets/images/index/active-ex-01.png") no-repeat 0 0 / cover;
    .tag {
      position: absolute;
      width: 102px;
      text-align: center;
      top: 16px;
      right: -22px;
      font-size: 14px;
      color: #fff;
      line-height: 22px;
      background: @errorColor;
      transform: rotate(45deg);
    }
    &-content {
      height: 260px;
      color: rgba(@textColor, 0.6);
      font-size: 14px;
      line-height: 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    &-title {
      color: rgba(@textColor, 0.9);
      font-size: 24px;
      line-height: 32px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    &-price {
      color: @priceColor;
      font-size: 21px;
      font-weight: 600;
      line-height: 56px;
      b {
        font-weight: 600;
        font-size: 40px;
      }
    }
    /deep/ .ant-btn {
      width: 128px;
      height: 44px;
      background: linear-gradient(313deg, #3a7fff 0%, #65b1ff 100%);
      border-radius: 2px 2px 2px 2px;
      margin-top: 26px;
      border: 0;
    }
  }
}
</style>
