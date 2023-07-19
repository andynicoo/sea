<template>
  <div class="goods-type" :class="{ fffbg: NODE_PLA === 'kqy' || NODE_PLA === 'ksy'}">
    <div class="goods-type-head">
      <h2>{{ mainHead.title }}</h2>
      <p>{{ mainHead.text }}</p>
    </div>
    <div
      class="goods-type-wrap ksy-w1320 center flex"
      v-if="list && list.length"
      :class="{ 'goods-type-wrap-kby': NODE_PLA === 'kby', 'goods-type-wrap-kqy': NODE_PLA === 'kqy' }"
    >
      <div class="goods-type-slide">
        <div
          class="goods-type-slide-item"
          :class="{
            active: index === +slideActive,
            wgdiv: NODE_PLA === 'wg',
            ksyindex0: NODE_PLA === 'ksy' && index === 0,
            ksyindex1: NODE_PLA === 'ksy' && index === 1,
            ksyindex2: NODE_PLA === 'ksy' && index === 2,
          }"
          v-for="(s, index) in list"
          :key="index"
          :data-index="index"
          @mouseenter="handleHover($event)"
        >
          <div class="default-wrap">
            <span>{{ s.categoryTitle }}</span>
          </div>
          <div class="active-wrap">
            <img v-lazy="s.backgroundImg" :alt="s.categoryTitle" />
            <div class="active-wrap-text">
              <h4>
                {{ s.categoryTitle }}
                <template v-if="NODE_PLA === 'wg'">
                  <a :href="s.moreLinks" v-if="s.moreLinks" target="_blank" class="ksy-fr ksy-pr-4">查看更多></a>
                  <a v-else class="ksy-fr ksy-pr-2">查看更多></a>
                </template>
              </h4>
              <template v-if="NODE_PLA !== 'wg'">
                <a :href="s.moreLinks" v-if="s.moreLinks" target="_blank">查看更多></a>
                <a v-else>查看更多></a>
              </template>
            </div>
          </div>
        </div>
      </div>
      <IndexProductServiceTemplate :list="currentList" v-if="currentList && currentList.length" />
    </div>
  </div>
</template>
<script>
export default {
  name: "GoodsType",
  data() {
    return {
      slideActive: 0,
      NODE_PLA: process.env.NODE_PLA,
    };
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    mainHead() {
      const { NODE_PLA } = this;
      if (NODE_PLA === "kby") {
        return {
          title: "专注于一站式品牌服务",
          text: "专注为卖家提供专业、安全的商标专利服务",
        };
      } else if (NODE_PLA === "ksy") {
        return {
          title: "专注于为卖家提供专业VAT服务",
          text: "推动跨境电商税务合规化、标准化、智能化",
        };
      } else if (NODE_PLA === "wg") {
        return {
          title: "专注于一站式品牌服务",
          text: "行业领导者，专注为卖家提供专业、安全的商标专利服务",
        };
      } else if (NODE_PLA === "kqy") {
        return {
          title: "专注国际工商服务",
          text: "为客户提供高效可靠的全球银行开户、香港/海外公司注册、代理记账、营商咨询等服务",
        };
      }
    },
    currentList() {
      const { list, slideActive } = this;
      if (list?.length) {
        let arr = list[slideActive].productVOList.map((v) => {
          v.parentInfo = list[slideActive];
          return v;
        });
        return arr.slice(0, 6);
      } else {
        return [];
      }
    },
  },
  methods: {
    handleHover(e) {
      this.slideActive = e.target.dataset.index;
    },
  },
};
</script>
<style lang="less" scoped>
.goods-type {
  background: #f5f7fa;
  padding: 80px 0;
  &-head {
    text-align: center;
    h2 {
      font-size: 28px;
      font-weight: 600;
      color: @textColor;
      line-height: 40px;
    }
    p {
      margin-bottom: 40px;
    }
  }
  &-wrap {
    align-items: flex-start;
    justify-content: space-between;
    &-kby {
      .goods-type-slide {
        width: 300px;
        &-item {
          width: 100%;
        }
      }
      /deep/ .goods-type-content-item-top {
        margin: 32px 10px 0 32px;
      }
      .active {
        height: 329px !important;
      }
      .goods-type-content {
        grid-template-columns: repeat(3, 300px);
      }
    }
    &-kqy {
      .goods-type-slide {
        width: 300px;
        &-item {
          width: 100%;
        }
      }
      /deep/ .goods-type-content-item-top {
        margin: 32px 10px 0 32px;
      }
      .active {
        height: 329px !important;
      }
      .goods-type-content {
        grid-template-columns: repeat(3, 300px);
      }
    }
  }
  &-slide {
    &-item {
      width: 320px;
      cursor: pointer;
      border-right: 0;
      .default-wrap {
        height: 110px;
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 500;
        background: #f7faff;
        color: #333333;
        padding: 0 0 0 24px;
        box-sizing: border-box;
        border: 1px solid #e7e7e7;
        margin-top: -1px;
      }
      .active-wrap {
        //display: none;
        height: 0;
        overflow: hidden;
      }
      &.active {
        height: 220px;
        // height: 329px;
        .default-wrap {
          display: none;
        }
        .active-wrap {
          display: block;
          height: 100%;
          position: relative;
          &-text {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 32px 0 20px 24px;
            color: #fff;
            font-size: 18px;
            line-height: 24px;
            h4 {
              color: #fff;
            }
            a {
              color: #ffffff;
              line-height: 22px;
              font-size: 14px;
              font-weight: 400;
              &:hover,
              &:active,
              &:link {
                color: #fff !important;
              }
            }
          }
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
      &.ksyindex0 {
        // border-bottom: 2px solid #C0C4C6;
        .default-wrap {
          background: url("@/assets/images/ksybg1.png") no-repeat center/100% 100%;
          // border: none;
          span {
            font-size: 20px;
            font-weight: 600;
            color: @primaryColor;
            border-bottom: 2px solid @primaryColor;
          }
        }
      }
      &.ksyindex1 {
        // border-bottom: 2px solid #C0C4C6;
        .default-wrap {
          background: url("@/assets/images/ksybg0.png") no-repeat center/100% 100%;
          // border: none;
          span {
            font-size: 20px;
            font-weight: 600;
            color: @primaryColor;
            border-bottom: 2px solid @primaryColor;
          }
        }
      }
      &.ksyindex2 {
        .default-wrap {
          background: url("@/assets/images/ksybg2.png") no-repeat center/100% 100% #e6ebf1;
          // border: none;
          span {
            font-size: 20px;
            font-weight: 600;
            color: @primaryColor;
            border-bottom: 2px solid @primaryColor;
          }
        }
      }
    }
  }
  &-content {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(3, 334px);
    h4 {
      margin-bottom: 0;
    }
    &-item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 220px;
      background: #fff;
      color: rgba(@textColor, 0.6);
      font-size: 14px;
      line-height: 22px;
      border: 1px solid #e7e7e7;
      margin-top: -1px;
      margin-left: -1px;
      cursor: pointer;
      &:hover {
        box-shadow: 0 3px 16px -2px rgba(16, 68, 166, 0.12), 0px 6px 12px 1px rgba(0, 0, 0, 0.05),
          0px 4px 6px -3px rgba(0, 0, 0, 0.02);
        .goods-type-content-item-center {
          margin-bottom: 0;
        }
        .goods-type-content-item-hide {
          display: block;
        }
      }
      &-top {
        margin: 32px 32px 0 32px;
        .title {
          display: flex;
          align-items: center;
          color: rgba(@textColor, 0.9);
          font-size: 20px;
          line-height: 28px;
          margin-bottom: 8px;
        }
        .content {
          p {
            margin-bottom: 4px;
          }
        }
      }
      &-center {
        margin-left: 32px;
        margin-bottom: 24px;
      }
      &-hide {
        height: 46px;
        border-radius: 0;
        border: 0;
        // margin-top: 12px;
        display: none;
        background: linear-gradient(313deg, #3a7fff 0%, #65b1ff 100%);
      }
    }
  }
}
.wgdiv {
  width: 300px !important;
  height: 438px !important;
}

.fffbg {
  background: #fff !important;
}
</style>
