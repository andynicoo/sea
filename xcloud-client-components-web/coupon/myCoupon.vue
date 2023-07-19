<template>
  <div>
    <div class="headContent">
      <div class="receive-core">
        <div class="tabTitle">
          <span :class="{ 'active-tab': status == '' }" @click="status = ''">全部优惠券</span>
          <span :class="{ 'active-tab': status == 'UNUSED' }" @click="status = 'UNUSED'">未使用</span>
          <span :class="{ 'active-tab': status == 'USED' }" @click="status = 'USED'">已使用</span>
          <span :class="{ 'active-tab': status == 'INVALID' }" @click="status = 'INVALID'">已过期</span>
        </div>
        <div class="receiveCoupon-box">
          <router-link to="/receiveCoupon">
            <img class="itaxs-box" width="250px" src="./../images/coupon/reacateConpon.svg" style="object-fit: contain" />
            <img class="iipto-box iipto-img" width="250px" src="./../images/coupon/couponEntrance.png" style="object-fit: contain" />
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-card">
      <div class="boxList clearfix">
        <div v-if="filterCouponList.length > 0">
          <div class="unCoupon fl" v-for="(v, i) in filterCouponList" :key="i" :class="v.status != 'UNUSED' ? 'coupon' : ''">
            <div class="monetry" v-if="v.couponType == 'FULL_REDUCTION'">
              <span class="unit">￥</span>
              <span class="num">{{ v.content }}</span>
            </div>
            <div class="monetry" v-else>
              <span class="unit">{{ Number((v.content * 10).toFixed(1)) }}折</span>
            </div>
            <p class="condition" v-if="v.useThresholdType == 'NO_THRESHOLD'">无门槛</p>
            <p class="condition" v-else>满 {{ v.useThresholdValue }} {{ v.useThresholdType == 'USE_CONDITION_BY_MONEY' ? '元' : '件' }}</p>

            <div class="ellipsis">
              <div class="ellipsis-container">
                <div class="ellipsis-content">
                  <template v-if="v.applyProductType != 'SPECIFIED_PRODUCT_DISABLE'">
                    <div class="ellipsis-content-title">适用商品：</div>
                    <div class="ellipsis-content-goods">{{ v.goodsNames }}</div>
                  </template>
                  <template v-else>
                    <div class="ellipsis-content-title">不适用商品：</div>
                    <div class="ellipsis-content-goods">{{ v.goodsNames }}</div>
                  </template>
                </div>
                <div class="ellipsis-ghost">
                  <div class="ellipsis-placeholder"></div>
                  <div class="ellipsis-more">
                    <Tooltip :content="v.goodsNames" transfer placement="top">
                      更多
                      <div slot="content" style="white-space: normal">
                        {{ v.goodsNames }}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
            <p class="validity">有效期：{{ v.validStartTime.slice(0, 10) }}至{{ v.effectiveEndTime.slice(0, 10) }}</p>
            <div class="use-btn" @click="changePage(v.status, v.functionCode)">
              <span :class="v.status == 'UNUSED' ? 'use' : ''">
                {{ v.status == 'UNUSED' ? '去使用' : v.status == 'USED' ? '已使用' : v.status == 'INVALID' ? '已失效' : v.status == 'VOIDED' ? '已作废' : v.status == 'UN_TAKE_EFFECT' ? '未生效' : '' }}
              </span>
            </div>
          </div>
        </div>
        <div v-else style="text-align: center; margin-top: 100px">
          <div class="itaxs-box">
            <img class="emptyCoupon" src="./../images/coupon/emptyCoupon.svg" alt="" />
            <img class="emptyCouponOrange" src="./../images/coupon/emptyCouponOrange.svg" alt="" />
          </div>
          <button v-show="filterCouponList.length == 0" class="receive-btn itaxs-box" @click="goReceive">去领券</button>
          <div class="no-data iipto-box">
            <img src="https://fdfs.itaxs.com/group1/M00/04/9B/rBLKNV_HhkiAdyssAABP3OKB26c631.png" alt="" />
            <p>暂无优惠券</p>
            <button @click="goReceive" class="iipto-receive-btn">去领券</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { coupponList } from './../api/shoppingCar';
export default {
  data() {
    return {
      contentStyleObj: {
        height: '',
      },
      status: '',
      coupons: [],
      // 优惠券类型
      functionList: {
        0: '适用所有',
        2: '转代理+申报',
        5: '注册+申报',
        6: '税号注销',
        7: '税务稽查',
        13: '海牙认证',
        16: '授权代表',
        17: '补申报',
        20: '其他服务(极简工单)',
        23: 'IOSS注册+申报',
        24: 'VAT退税',
        31: 'EPR注册',
        200: '其他',
        618: '适用秒杀商品',
      },
      user: JSON.parse(localStorage.getItem('objInfo')),
    };
  },
  computed: {
    filterCouponList() {
      if (this.status === '') {
        return this.coupons;
      } else {
        return this.coupons.filter((item) => item.status == this.status);
      }
    },
  },
  methods: {
    getHeight() {
      this.contentStyleObj.height = window.screen.height - 20 + 'px';
    },
    getCouponList() {
      coupponList({
        enterpriseId: JSON.parse(localStorage.getItem('objInfo')).enterpriseId,
        userId: JSON.parse(localStorage.getItem('objInfo')).userId,
        mobile: JSON.parse(localStorage.getItem('objInfo')).userMobile,
      }).then((res) => {
        if (res.code === 0) {
          res.data.forEach((item) => {
            if (item.applyProductType === 'ALL_PRODUCT') {
              item.goodsNames = '适用所有商品';
            } else {
              let goodsNames = [];
              item.activitiesApplyDTOS.forEach((activity) => {
                if (activity.productList.length) {
                  activity.productList.forEach((p) => {
                    goodsNames.push(p.productName);
                  });
                } else {
                  goodsNames.push(activity.productCategoryName + '下的所有商品');
                }
              });
              item.goodsNames = goodsNames.join('、');
            }
          });
          this.coupons = res.data;
        }
      });
    },
    changePage(status, code) {
      if (status == 'UNUSED') {
        if (code == 618) {
          this.$router.push({
            path: '/activity618',
          });
        } else {
          if (this.user.enterpriseId == 42) {
            this.$router.replace('/serviceList');
          } else {
            if (localStorage.enterpriseId == '49') {
              let openUrl = this.wgUrl;
              openUrl = openUrl.replace('/client/', '/productservice');
              window.location.href = openUrl;
            } else {
              this.$router.push({
                path: localStorage.productListPath,
              });
            }
          }
        }
      }
    },

    goReceive() {
      this.$router.push('/receiveCoupon');
    },
  },
  mounted() {
    this.getHeight();
    this.getCouponList();
  },
};
</script>
<style lang="less" scoped>
.mainContent {
  .headContent {
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 10px 32px 0px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
    }
    .tabTitle {
      border-bottom: 1px solid #e9e9e9ff;
      margin-top: 0px;
      span {
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #333333;
        line-height: 40px;
        margin-right: 46px;
        cursor: pointer;
      }
      .active-tab {
        color: #1890ffff;
        border-bottom: 2px solid #1890ffff;
        font-weight: 500;
      }
    }
  }
  .my-card {
    margin: 24px;
    background: #ffffff;
    padding: 24px;
  }
  .title {
    font-size: 24px;
    font-weight: 500;
    color: #333;
  }
  .boxList {
    .unCoupon,
    .coupon {
      width: calc(20% - 20px);
      min-width: 250px;
      height: 260px;
      margin-right: 40px;
      color: #ffffff;
      margin-bottom: 10px;
      text-align: center;
      .monetry {
        margin-top: 16px;
        text-align: center;
        height: 35px;
        margin-bottom: 4px;
        .unit {
          font-size: 26px;
        }
        .num {
          font-size: 32px;
        }
      }
      .condition {
        font-size: 12px;
        margin-left: 4px;
        text-align: center;
      }
      .type {
        margin-top: 12px;
        text-align: center;
        font-size: 12px;
      }
      .validity {
        margin-top: 20px;
        font-size: 12px;
        text-align: left;
      }
      .use-btn {
        margin-top: 55px;
        text-align: center;
        font-size: 12px;
        color: #a2a2b3;
        span {
          width: 160px;
          height: 32px;
          line-height: 32px;
          display: inline-block;
        }
        .use {
          border: 1px solid #16ade9;
          color: #16ade9;
          cursor: pointer;
        }
      }
    }
    // .coupon:nth-child(5n) {
    //   margin-right: 0px;
    // }
    .unCoupon {
      background: url('./../images/coupon/couponbg.png');
      background-size: 100% 100%;
      padding: 0 24px;
    }
    .coupon {
      background: url('./../images/coupon/couponbg1.png');
      background-size: 100% 100%;
    }
  }
}

.ellipsis {
  position: relative;
  max-height: 18px;
  line-height: 18px;
  overflow: hidden;
  text-align: left;
  margin-top: 28px;
  .ellipsis-container {
    position: relative;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    font-size: 40px;
    color: transparent;
    .ellipsis-content {
      color: #fff;
      display: inline;
      vertical-align: top;
      font-size: 12px;
      display: flex;
      .ellipsis-content-title {
        white-space: nowrap;
      }
      .ellipsis-content-goods {
        word-break: break-all;
        width: calc(100% - 100px);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .ellipsis-ghost {
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      // left: 50%;
      // width: 100%;
      height: 100%;
      color: #fff;
      &::before {
        content: '';
        display: block;
        float: right;
        width: 50%;
        height: 100%;
      }
      .ellipsis-placeholder {
        content: '';
        display: block;
        float: right;
        width: 50%;
        height: 18px;
      }
      .ellipsis-more {
        color: #fff;
        background: rgba(255, 255, 255, 0.2);
        padding: 4px 6px;
        position: relative;
        float: right;
        font-size: 12px;
        margin-top: -22px;
        cursor: pointer;
      }
    }
  }
}
.receive-core {
  display: flex;
  /* grid-template-columns: 85% 20%; */
  /* align-items: center; */
  justify-content: space-between;
}

.receive-btn {
  width: 130px;
  height: 44px;
  background: linear-gradient(153deg, #ffd569 0%, #ffac0a 100%);
  border-radius: 2px 2px 2px 2px;
  opacity: 1;
  border: none;
  font-size: 16px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 19px;
  margin-top: 29px;
}
.receiveCoupon-box {
  position: relative;
  top: -9px;
}
.iipto-box {
  display: none;
}
.sg-vat-coupon {
  .receive-btn {
    display: none;
  }
}
.iipto-coupon {
  position: relative;
  .iipto-box {
    display: block;
  }
  .itaxs-box {
    display: none;
  }
  .iipto-img {
    position: absolute;
    top: -6px;
    right: 0px;
  }
  .my-card {
    margin: 0px;
    background: #ffffff;
    padding: 0px;
  }
  .boxList {
    .unCoupon,
    .coupon {
      margin-top: 28px;
      margin-bottom: 0;
    }
  }
  .headContent {
    position: absolute;
    top: 0;
    left: 127px;
    width: 839px;
    box-shadow: none;
    .tabTitle {
      border: none;
      margin-top: 13px;
      span {
        display: inline-block;
        padding: 0 30px;
        font-size: 14px;
        text-align: center;
        background: #f1f1f1;
        border-radius: 16px;
        margin-right: 10px;
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        color: #666;
      }
      .active-tab {
        background-color: #00a3ff;
        color: #fff;
        border: none;
      }
    }
  }
  .no-data {
    margin: 56px auto;
    text-align: center;
    p {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      margin-top: 10px;
    }
    button {
      width: 98px;
      height: 32px;
      background: #00a3ff;
      margin-top: 12px;
      border: none;
      color: #fff;
      cursor: pointer;
    }
  }
}

//其它主题色
.sellergrowth-vat {
  .headContent {
    box-shadow: none;
  }
}
.emptyCouponOrange {
  display: none;
}
.OrangeTheme {
  .emptyCoupon,
  .iipto-receive-btn {
    display: none;
  }
  .emptyCouponOrange {
    display: inline-block;
  }
  .headContent .tabTitle .active-tab {
    color: #f6b417ff;
    border-bottom: 2px solid #f6b417ff;
    font-weight: 500;
  }
  .boxList {
    .unCoupon {
      background: url('./../images/coupon/couponbgOrange.png');
      background-size: 100% 100%;
    }
    .coupon {
      background: url('./../images/coupon/couponbg1.png');
      background-size: 100% 100%;
    }
    .unCoupon .use-btn .use,
    .coupon .use-btn .use {
      border: 1px solid #f6b417;
      color: #f6b417;
      cursor: pointer;
    }
  }
}
</style>
