<template>
  <div class="content">
    <div class="my-card">
      <a :href="advertisement.url" v-if="advertisement.url">
        <img v-if="advertisement" :src="advertisement.picPath" width="100%" height="90" />
      </a>
      <img v-else :src="advertisement.picPath" width="100%" height="90" />
      <div v-if="orderList.length > 0">
        <div class="myVATFilter itemList">
          <ul>
            <li class="item" v-for="(item, index) in orderList" :key="index">
              <div class="item-content">
                <div class="userSeceive-btn" @click="userSeceive(item)"></div>
                <div class="item-price">
                  <div class="money" v-if="item.couponType == 'FULL_REDUCTION'">
                    ¥
                    <span>{{ item.content }}</span>
                  </div>
                  <div class="money" v-else>
                    <span>{{ item.content * 10 }}</span>
                    折
                  </div>
                </div>
                <div class="item-name">{{ item.couponName }}</div>
                <div class="item-circular">
                  <span class="circular">
                    {{ useThresholdTag(item) }}
                  </span>
                  <span class="circular">
                    {{ applyProductTag(item.applyProductType) }}
                  </span>
                </div>
                <div class="item-bottom">{{ time(item) }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="page-box">
          <Page
            show-total
            show-elevator
            :total="total"
            :current="formData.page"
            :page-size="formData.limit"
            @on-change="handlePage"
            @on-page-size-change="handlePageSize"
          ></Page>
        </div>
      </div>
      <div v-else style="text-align: center; padding: 100px">
        <img src="@/assets/images/common/emptyCoupon.svg" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import { selectCoupon, reactiveCoupon, advertisementGetById } from './../api/user';
import moment from 'moment';
export default {
  props: {
    showTit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      contentStyleObj: {
        'min-height': '',
      },
      loading: false,
      paymentBox: false,
      orderList: [],

      formData: {
        page: 1,
        limit: 12,
      },
      total: 0,
      orderInfo: {},
      ticker: null,
      // 抽奖活动
      winningModal: false,
      advertisement: '',
    };
  },
  watch: {},

  methods: {
    /**获取广告 */
    async advertisementGetByIdAPi() {
      let { code, data } = await advertisementGetById({ adKey: 'Coupon_top_banne' });
      if (code == 0) {
        this.advertisement = data[0] || {};
      }
    },
    /**领取优惠券 */
    async userSeceive(item) {
      let { code } = await reactiveCoupon({
        couponId: item.marketingCouponActivityId,
        enterpriseId: JSON.parse(localStorage.getItem('objInfo')).enterpriseId,
        userId: JSON.parse(localStorage.getItem('objInfo')).userId,
        mobile: JSON.parse(localStorage.getItem('objInfo')).userMobile,
      });
      if (code == 0) {
        this.$Message.success('领取成功,快去使用吧,可在我的优惠券中查看');
        this.getList();
      }
    },

    async getList() {
      let {
        code,
        data: { records, total },
      } = await selectCoupon({
        ...this.formData,
        enterpriseId: JSON.parse(localStorage.getItem('objInfo')).enterpriseId,
        type: 'VOUCHER_CENTER_PC',
      });
      console.log(code, records);
      if (code == 0) {
        this.orderList = records;
        this.total = Number(total);
      }
    },
    handlePage(val) {
      this.formData.page = val;
      this.getList();
    },
    handlePageSize(pageSize) {
      this.formData.limit = pageSize;
      this.getList();
    },

    changeShowBox(obj) {
      this.paymentBox = obj.state;
    },
  },
  computed: {
    useThresholdTag() {
      return function(param) {
        let { useThresholdType, useThresholdValue } = param;
        if (useThresholdType == 'NO_THRESHOLD') {
          return '无金额门槛';
        } else {
          return `订单满${useThresholdValue}${useThresholdType === 'USE_CONDITION_BY_MONEY' ? '元' : '件'}可用 `;
        }
      };
    },

    applyProductTag() {
      return function(param) {
        return param == 'ALL_PRODUCT'
          ? '所有商品可用'
          : param == 'SPECIFIED_PRODUCT_ENABLE'
          ? '指定商品可用'
          : '指定商品不可用';
      };
    },
    time() {
      function rTime(date) {
        var json_date = new Date(date).toJSON();
        return new Date(new Date(json_date) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '');
      }

      return function(param) {
        console.log('param', param);
        let { useTimeConfig, useTimeType } = param;
        let { validStartDate, effectiveEndDate, day, afterDayEnd, afterDayStart } = JSON.parse(useTimeConfig);
        if (useTimeType == 'FIXED_TIME') {
          return `有效期：${moment(validStartDate).format('YYYY-MM-DD')} 至 ${moment(effectiveEndDate).format(
            'YYYY-MM-DD'
          )}`;
        } else if (useTimeType == 'TERM_EFFECTIVE') {
          return '领券后' + day + '天内可用';
        } else {
          return '领券后' + afterDayStart + '天后生效' + afterDayEnd + '天内可用';
        }
      };
    },
  },

  created() {
    this.advertisementGetByIdAPi();
    this.getList();
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-table-cell {
  text-overflow: clip !important;
}
/deep/ .ivu-table td,
.ivu-table th {
  text-align: center !important;
}
.my-card {
  border-radius: 10px;
  margin: 24px;
  margin-bottom: 0px;
  background: #ffffff;
  .myVATFilter {
    background: #ffffff;
    margin-bottom: 24px;
    padding: 24px;
    margin-top: 36px;
    /deep/ .ivu-form-item {
      margin-bottom: 0px;
    }
  }

  .itemList {
    display: flex;
    grid-template-columns: repeat(4, 22.78%);
    justify-content: space-between;
    grid-column-gap: 2.22%;
    grid-row-gap: 20px;
    font-family: PingFang SC-Semibold, PingFang SC;
    .item {
      height: 166px;
      display: inline-block;
      width: 380px;
      margin-left: 30px;
      padding-top: 24px;
      padding-left: 24px;
      margin-bottom: 20px;

      background: url('./../assets/images/coupon/coupon_bg.svg') no-repeat center;
      background-size: 100%;
      height: 166px;
    }
  }
}
.title {
  font-size: 24px;
  font-weight: 500;
  margin-left: 8px;
  color: #333;
  margin-bottom: 24px;
}
.content {
  min-height: calc(100vh - 60px);
  min-width: 1400px;
  /deep/ .ivu-table-wrapper-with-border {
    border: none;
  }
  /deep/ .ivu-table:before,
  /deep/ .ivu-table-border:after {
    width: 0px;
  }
  /deep/ .ivu-table-header thead tr th {
    font-size: 14px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 14px;
  }
  /deep/ .ivu-table td {
    height: 114px;
    font-size: 12px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .headContent {
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px 0px;
    .top {
      margin-bottom: 14px;
    }
    .bottom {
      font-size: 20px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
    }
    .tabTitle {
      border-bottom: 1px solid #e9e9e9ff;
      margin-top: 10px;
    }
  }
}
.page-box {
  text-align: center;
  padding-bottom: 40px;
}
.operation button {
  width: 92px;
  font-size: 12px;
  height: 28px;
}

.circular {
  background: rgba(254, 122, 9, 0.3);
  box-shadow: inset 0px 1px 4px 0px #ffb657;
  border-radius: 33px 33px 33px 33px;
  opacity: 1;
  width: fit-content;
  padding: 4px 17px;
  margin-right: 7px;
}

.item .item-content {
  display: grid;
  grid-template-rows: 32% 20% 35px 39px;
  position: relative;
  align-item: center;
  .userSeceive-btn {
    position: absolute;
    top: 0;
    right: 20px;
    width: 113px;
    height: 32px;
    cursor: pointer;
  }
  .item-bottom {
    width: 100%;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: #c56a3e;
    line-height: 39px;
    padding-right: 24px;
  }
  .item-name {
    color: #c56a3e;
    font-weight: 500;
    font-size: 16px;
  }
  .item-price {
    display: grid;
    grid-template-columns: 62% 38%;
    .money {
      font-size: 20px;
      color: #fe4c29;
      line-height: 30px;
      span {
        font-size: 32px;
        font-weight: 600;
      }
    }
  }
  .item-circular {
    color: #ffffff;
    // opacity: 0.3;
    line-height: 35px;
  }
}
</style>
