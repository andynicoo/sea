<template>
  <div class="advantage-box">
    <div class="main-box center ksy-w1320">
      <div class="main-box-head">
        <template>
          <div class="main-box-head-title">{{ mainHead.title }}</div>
          <div class="main-box-head-text">{{ mainHead.text }}</div>
        </template>
      </div>
      <ul class="advantage-box-content">
        <li v-for="(item, index) in advList" :key="`p_${index}`" class="shadow-default shadow-hover">
          <div class="head" :class="`bg-${index + 1}`">{{ item.title }}</div>
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
      mainHead: {
        title: "设立海外公司的六大优势",
        text: "拓展国际贸易，提升企业形象",
      },
      advList: [
        {
          title: "全球布局",
          default: ["发展跨国业务", "提升企业形象"],
          hover: "注册成立海外公司是企业走向世界，开展跨国业务，提升<br /> 企业国际形象的捷径。",
        },
        {
          title: "避开壁垒",
          default: ["方便国际贸易", "避开关税壁垒"],
          hover: "海外公司可作为国际贸易媒介，并能有效绕开关税壁垒，<br />有利于国际间贸易往来。",
        },
        {
          title: "方便投融资",
          default: ["方便投融资", "海外上市第一步"],
          hover: "通过注册海外离岸公司进行海外融资及上市，可以极大地<br />简化海外上市的运作手续。",
        },
        {
          title: "税收优惠",
          default: ["海外税收优惠", "合理税务筹划"],
          hover:
            "通过选择与投资者本国签订税收协定的国家和地区，可以<br />享受股息和财产转让的优惠税率很多海外公司税制简单，<br />税率低，注册海外公司可以实现税务的合理筹。",
        },
        {
          title: "便捷低廉",
          default: ["注册程序便捷", "开设成本低廉"],
          hover: "注册程序简单，可由专业的注册代理机构代为完成，无须<br />注册人亲临注册地。",
        },
        {
          title: "资产保护",
          default: ["简便的公司管理", "资产有效保护"],
          hover: "大多海外地区可接受法人出任公司董事一职，无须每年召开<br />股东大会及董事会。",
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.advantage-box {
  background: #ffffff;
  padding: 0 0 50px 0;
  &-content {
    justify-content: space-between;
    font-size: 14px;
    color: #666666;
    line-height: 28px;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 358px;
      height: 236px;
      display: flex;
      border-radius: 4px;
      flex-direction: column;
      justify-content: space-between;
      background: linear-gradient(180deg, #f3f5f8 0%, #f9fbff 40%, #ffffff 100%);
      margin-bottom: 34px;
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
          width: 418px;
          height: 100%;
          display: flex;
          align-items: center;
          visibility: hidden;
        }
      }
      &:hover {
        width: 418px;
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
    background: url("./images/kqy/title-bg-default-@{i}.png") no-repeat left center / 100% 100%;
    &:hover {
      background: url("./images/kqy/title-bg-hover-@{i}.png") no-repeat left center / 100% 100%;
    }
  }
  .advantage-bg(@n, (@i + 1));
}
.advantage-bg(6);

.advantage-box-content li:hover {
  .advantage-bg(@n, @i: 1) when (@i =< @n) {
    .bg-@{i} {
      background: url("./images/kqy/title-bg-hover-@{i}.png") no-repeat left center / 100% 100%;
    }
    .advantage-bg(@n, (@i + 1));
  }
  .advantage-bg(6);
}
</style>
