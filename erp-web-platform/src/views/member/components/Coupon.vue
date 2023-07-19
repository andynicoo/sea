<template>
  <div class="me-coupon" :class="`me-coupon-${type}`">
    <div class="content">
      <template v-if="coupon.couponType === 1">
        <div class="unit">
          <div>{{ coupon.fieid2 }}天</div>
          <div>限{{ getMeals(coupon.fieid1) }}会员</div>
        </div>
      </template>
      <template v-if="coupon.couponType === 2">
        <div class="unit">
          <div>{{ coupon.fieid1 }}元</div>
        </div>
      </template>
      <template v-if="coupon.couponType === 3">
        <div class="unit">
          <div>{{ coupon.fieid2 }}元</div>
          <div>
            满
            <template v-if="coupon.fieid1 == 0"> 任意金额 </template>
            <template v-else> {{ coupon.fieid1 }}元 </template>
          </div>
        </div>
      </template>
      <template v-if="coupon.couponType === 4">
        <div class="unit">
          <div>{{ Number(coupon.fieid2) * 10 }}折</div>
          <div>
            满
            <template v-if="coupon.fieid1 == 0"> 任意金额 </template>
            <template v-else> {{ coupon.fieid1 }}元 </template>
          </div>
        </div>
      </template>
      <div class="text">
        <div>
          <template v-if="coupon.couponType === 1"> 会员体验券 </template>
          <template v-if="coupon.couponType === 2"> 旺币券 </template>
          <template v-if="coupon.couponType === 3"> 满减券 </template>
          <template v-if="coupon.couponType === 4"> 折扣券 </template>
        </div>
        <div>有效期至{{ moment(coupon.expireTime).format('YYYY-MM-DD') }}</div>
      </div>
    </div>
    <div class="actions" @click="onApply">
      <div class="actions-text">
        <template v-if="type === 'unused'"> 立即使用 </template>
        <template v-if="type === 'used'"> 已使用 </template>
        <template v-if="type === 'expired'"> 已过期 </template>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Member from '@/api/member'

export default {
  props: {
    type: String,
    coupon: Object
  },
  computed: {
    meals() {
      return this.$store.getters.getMeals
    }
  },
  data() {
    return {
      moment
    }
  },
  methods: {
    onApply() {
      const { type, coupon } = this.$props
      if (type === 'used' || type === 'expired') return
      const { couponType } = coupon
      if (couponType === 3 || couponType === 4) {
        return this.$router.push('/member/Index')
      }
      this.$confirm({
        title: '确认使用',
        content: '使用后，优惠券无法撤回',
        onOk: () => {
          const { memberCouponUnusedId } = coupon
          Member.applyMemberCouponUseCoupon({
            memberCouponUnusedId: memberCouponUnusedId
          })
            .then(({ data }) => {
              // this.$emit('reload')
              this.$confirm({
                title: '使用成功',
                content: data
              })
            })
            .catch((error) => {
              this.$confirm({
                title: '使用失败',
                content: error.response.data.message
              })
            })
        }
      })
    },
    getMeals(fieid2) {
      const meal = this.meals.find(({ id }) => fieid2 === id)
      return meal?.name
    }
  }
}
</script>

<style lang="less" scoped>
.me-coupon {
  width: 100%;
  height: 128px;
  background-size: cover;
  background-position: center;
  padding: 12px;

  display: grid;
  grid-template-columns: 1fr 40px;

  &.me-coupon-unused {
    background-image: url('../../../assets/images/coupon_unused@2x.png');
  }
  &.me-coupon-used,
  &.me-coupon-expired {
    background-image: url('../../../assets/images/coupon_used@2x.png');
  }

  .content {
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;

    & > div {
      height: 56px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      &:first-child {
        border-right: 1px solid #eee;
      }

      &:last-child {
        align-items: flex-start;
      }

      &.unit {
        & > div {
          &:nth-child(1) {
            font-size: 32px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #994a12;
            line-height: 45px;
          }

          &:nth-child(2) {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #303133;
            line-height: 17px;
            text-shadow: 0px 0px 8px rgba(130, 64, 16, 0.16);
          }
        }
      }

      &.text {
        padding: 0 20px;

        & > div {
          &:nth-child(1) {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #303133;
            line-height: 22px;
            text-shadow: 0px 0px 8px rgba(130, 64, 16, 0.16);
          }
          &:nth-child(2) {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #909099;
            line-height: 24px;
            text-shadow: 0px 0px 8px rgba(130, 64, 16, 0.16);
          }
        }
      }
    }
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .actions-text {
      width: 14px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 18px;
    }
  }
}
</style>
