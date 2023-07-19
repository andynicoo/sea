<template>
  <div class="advantage-box">
    <div class="main-box center ksy-w1320">
      <div class="main-box-head">
        <template v-if="NODE_PLA === 'kby'">
          <div class="main-box-head-title">{{ kbymainHead.title }}</div>
          <div class="main-box-head-text">{{ kbymainHead.text }}</div>
        </template>
        <template v-if="NODE_PLA === 'wg'">
          <div class="main-box-head-title">{{ wgmainHead.title }}</div>
          <div class="main-box-head-text">{{ wgmainHead.text }}</div>
        </template>
      </div>
      <ul class="advantage-box-content flex" :class="{ wgbox: NODE_PLA === 'wg' }">
        <li v-for="(item, index) in advList" :key="`p_${index}`" class="shadow-default shadow-hover">
          <div class="head" :class="`bg-${index + 1}`" v-if="NODE_PLA === 'kby'">{{ item.title }}</div>
          <div class="head" :class="`wg-bg-${index + 1}`" v-if="NODE_PLA === 'wg'">{{ item.title }}</div>
          <div class="content">
            <div class="default">
              <p v-for="(child, idx) in item.default" :key="`c_${idx}`">
                <AliIcon type="a-shangbiaoyoushixuanze" size="20" />{{ child }}
              </p>
            </div>
            <div class="hover" v-html="item.hover"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "kbyAdvantage",
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      kbymainHead: {
        title: "注册商标的好处",
        text: "更专业的商标服务流程,更优质的商标服务体验",
      },
      kbyadvList: [
        {
          title: "入驻电商平台",
          default: ["入驻跨境电商必备的门票", "提高开店通过率"],
          hover: "入驻Amazon、ebay等跨境电商平台必备门<br />票，提高开店通过率，让企业认可度更高",
        },
        {
          title: "保护自有品牌",
          default: ["防止品牌被恶意抢注或盗用", "保护企业合法权益"],
          hover: "防止品牌被恶意抢注或盗用，有效避免产品被<br />跟卖、侵权等恶意竞争，保护企业合法权益",
        },
        {
          title: "助力跨境出海",
          default: ["经济全球化必经之路", "享受经济全球化红利"],
          hover: "经济全球化必经之路，占领海外市场；增加销<br />售额，享受经济全球化红利",
        },
        {
          title: "塑造品牌效应",
          default: ["打造国际品牌", "提升品牌竞争力"],
          hover: "打造国际品牌、树立品牌形象，提升品牌竞争<br />力，塑造国际品牌效应",
        },
      ],
      wgmainHead: {
        title: "注册专利的好处",
        text: "更专业的商标服务流程,更优质的商标服务体验",
      },
      wgadvList: [
        {
          title: "防止侵权",
          default: ["保护核心技术", "防止专利诉讼"],
          hover: "保护核心技术，确保自身生产和销售市场的安<br />全性，防止对手的专利诉讼",
        },
        {
          title: "垄断市场",
          default: ["防止专利诉讼", "投诉效果好"],
          hover: "独占专利权覆盖范围内的市场，电商广泛应<br />用，投诉效果好",
        },
        {
          title: "助力跨境出海",
          default: ["避免申请同类专利", "提升品牌影响力"],
          hover: "避免其他公司申请同类专利，保护自有品牌，<br />提升品牌影响力",
        },
        {
          title: "企业融资",
          default: ["打造国际品牌", "提升品牌竞争力"],
          hover: "可有偿授权他人使用，或作为无形资产进行<br />融资交易",
        },
      ],
    };
  },
  computed: {
    advList() {
      const { NODE_PLA } = this;
      if (NODE_PLA === "kby") {
        return this.kbyadvList;
      } else if (NODE_PLA === "wg") {
        return this.wgadvList;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.advantage-box {
  background: #f5f7fa;
  padding: 0 0 80px 0;
  &-content {
    justify-content: space-between;
    font-size: 14px;
    color: #666666;
    line-height: 28px;
    li {
      width: 260px;
      height: 236px;
      display: flex;
      border-radius: 4px;
      flex-direction: column;
      justify-content: space-between;
      background: linear-gradient(180deg, #f3f5f8 0%, #f9fbff 40%, #ffffff 100%);
      .head {
        height: 97px;
        display: flex;
        align-items: center;
        padding: 0 0 0 22px;
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        border-radius: 4px 4px 0 0;
        overflow: hidden;
      }
      .content {
        height: 0;
        flex: 1;
        padding: 0 24px;
        overflow: hidden;
        .default {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          p {
            margin: 0;
            display: flex;
            align-items: center;
            .aliicon {
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 12px 0 0;
            }
          }
        }
        .hover {
          width: 336px;
          height: 100%;
          display: flex;
          align-items: center;
          visibility: hidden;
        }
      }
      &:hover {
        width: 336px;
        .transition();
        .head {
          color: #fff;
        }
        .default {
          display: none;
        }
        .hover {
          visibility: visible;
        }
      }
    }
  }
}
.advantage-bg(@n, @i: 1) when (@i =< @n) {
  .bg-@{i} {
    background: url("./images/title-bg-default-@{i}.png") no-repeat left center / 100% 100%;
    &:hover {
      background: url("./images/title-bg-hover-@{i}.png") no-repeat left center / 100% 100%;
    }
  }
  .advantage-bg(@n, (@i + 1));
}
.advantage-bg(4);

.advantage-box-content li:hover {
  .advantage-bg(@n, @i: 1) when (@i =< @n) {
    .bg-@{i} {
      background: url("./images/title-bg-hover-@{i}.png") no-repeat left center / 100% 100%;
    }
    .advantage-bg(@n, (@i + 1));
  }
  .advantage-bg(4);
}
// 外观专利css
.advantage-bg(@n, @i: 1) when (@i =< @n) {
  .wg-bg-@{i} {
    background: url("./images/wg/title-bg-default-@{i}.png") no-repeat left center / 100% 100%;
    &:hover {
      background: url("./images/wg/title-bg-hover-@{i}.png") no-repeat left center / 100% 100%;
    }
  }
  .advantage-bg(@n, (@i + 1));
}
.advantage-bg(4);

.wgbox li:hover {
  .advantage-bg(@n, @i: 1) when (@i =< @n) {
    .wg-bg-@{i} {
      background: url("./images/wg/title-bg-hover-@{i}.png") no-repeat left center / 100% 100%;
    }
    .advantage-bg(@n, (@i + 1));
  }
  .advantage-bg(4);
}
</style>
