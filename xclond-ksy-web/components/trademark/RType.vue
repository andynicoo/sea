<template>
  <div class="rtype">
    <h2>R标有哪些优势？</h2>
    <p>海量资源、全流程服务、交易安全放心</p>
    <div class="content ksy-w1320">
      <a-row :gutter="[40, 40]">
        <a-col class="gutter-row" :span="8" v-for="item in RType" :key="item.title">
          <div class="item">
            <img :src="require(`@/assets/images/trademark/${item.img}.png`)" :alt="item.title" />
            <h3>
              {{ item.title }}
            </h3>
            <p>
              {{ item.subTit }}
            </p>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RType: [
        {
          title: "现标可用，无需等待",
          subTit: "购买商标最大优势是时间快，购买即可马上投入使用，无需像注册商标需要等待",
          img: "rbiao1",
        },
        {
          title: "成功率高，降低注册风险",
          subTit: "风险低，更安全，只要资料手续齐全就能办理转让，转让成功率高",
          img: "rbiao2",
        },
        {
          title: "商品已有价值优势",
          subTit: "如果购买的商标已初具影响力，有一定的市场曝光和知名度，则更有利于品牌推广宣传",
          img: "rbiao3",
        },
        {
          title: "减少精力消耗",
          subTit: "减少商标注册过程中的困扰，可将更多的时间和精力投入到产品研发及品牌推广",
          img: "rbiao4",
        },
        {
          title: "防跟卖",
          subTit: "保护自己的辛苦成果，有效防止不良商家跟卖产品",
          img: "rbiao5",
        },
        {
          title: "大平台保障，层层把关",
          subTit: "对商标真实性进行识别，确定安全可靠，为买家提供可信赖的交易平台",
          img: "rbiao6",
        },
      ],
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.rtype {
  height: 1008px;
  background: url("@/assets/images/rb-bg.png") no-repeat;
  background-size: cover;
  padding-top: 80px;
  padding-bottom: 86px;
  h2 {
    font-size: 28px;
    color: @textColor;
    text-align: center;
    margin: 0 !important;
  }
  p {
    font-size: 14px;
    margin-top: 12px;
    margin-bottom: 40px;
    text-align: center;
  }
  .content {
    display: grid;
    margin: 0 auto;

    .item {
      border-radius: 4px;
      height: 342px;
      background: rgba(245, 247, 250, 0.32);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.09);
      opacity: 1;
      text-align: center;
      padding: 32px 39px;
      img {
        height: 195px;
      }
      h3 {
        font-size: 20px;
        color: @textColor;
        margin-bottom: 0px;
      }
      p {
        font-size: 14px;
        color: @textColor6;
      }
    }
    .item:hover {
      height: 342px;
      background: rgba(245, 247, 250, 0.8);
      box-shadow: 0px 3px 16px -2px rgba(16, 68, 166, 0.12), 0px 6px 12px 0px rgba(0, 0, 0, 0.05),
        0px 4px 6px -3px rgba(0, 0, 0, 0.02);
      opacity: 1;
    }
  }
}
</style>
