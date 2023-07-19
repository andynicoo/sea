<template>
  <div class="quick-panel center ksy-w1320">
    <div class="mTitle">快捷查询</div>
    <div class="quick-panel-content">
      <div v-for="(item, index) in list" :key="index" @click="goLink?fastClick(item):''" class="item">
        <a :id="item.id">
          <div class="item-hd flex flex-c"><img :src="item.img" alt="" />{{ item.title }}</div>
          <div class="item-bd" v-html="item.text"></div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { customerFunc } from "@/utils/index";

export default {
  data() {
    return {
      list: [
        {
          title: "近似商标",
          text: "查询已申请/已注册商标有无近似<br />注册前先查询，降低注册风险",
          img: require("@/assets/images/trademark/v230401/quick/1.png"),
          path: "/trademarkquery",
          id: "public_module_button001",
        },
        {
          title: "精准商标",
          text: "通过商标名/受理号/注册号<br/>快速查找商标信息，申请人，宣誓等",
          img: require("@/assets/images/trademark/v230401/quick/2.png"),
          path: "/trademarkTarget",
          id: "public_module_button002",
        },
        {
          title: "商标分类",
          text: "2023新版国际商标尼斯分类表<br />快速了解商品所属分类",
          img: require("@/assets/images/trademark/v230401/quick/3.png"),
          path: "/classificationquery",
          id: "public_module_button003",
        },
        {
          title: "近似风险报告",
          text: "近似风险评估，各分类风险分布<br />注册申请建议，类目近似商标统计",
          img: require("@/assets/images/trademark/v230401/quick/4.png"),
          path: "/riskReport",
          id: "public_module_button004",
        },
        {
          title: "律师代理商标",
          text: "通过律师名<br />查询其名下代理的所有商标信息",
          img: require("@/assets/images/trademark/v230401/quick/5.png"),
          path: "/trademarkLawyer",
          id: "public_module_button005",
        },
        {
          title: "申请人持有商标",
          text: "通过商标持有人名字<br />查询该持有人名下所有商标信息",
          img: require("@/assets/images/trademark/v230401/quick/6.png"),
          path: "/trademarkHolder",
          id: "public_module_button006",
        },
        {
          title: "AI智能商标取名",
          text: "好品牌，从好名字开始<br />AI智能取名，简单3步，马上取到好名字",
          img: require("@/assets/images/trademark/v230401/quick/7.png"),
          path: "/trademarkname",
          id: "public_module_button007",
        },
        {
          title: "深度核名报告",
          text: "通过率预估，申请流程详解<br/>风险预案制定，增加通过率的实用建议",
          img: require("@/assets/images/trademark/v230401/quick/8.png"),
          path: "",
          id: "public_module_button008",
          kf: true,
        },
        {
          title: "注册商标库",
          text: "全球美标申请量分布<br/>全分类美标申请量分布，趋势分析",
          img: require("@/assets/images/trademark/v230401/quick/9.png"),
          path: "/depot/register",
          id: "public_module_button009",
        },
        {
          title: "TOP律师库",
          text: "各年受理商标案件数排名前100<br/>的律师清单，帮您更好的选择律师",
          img: require("@/assets/images/trademark/v230401/quick/10.png"),
          path: "/depot/lawyer",
          id: "public_module_button010",
        },
        {
          title: "知名品牌库",
          text: "好品牌好名字<br/>看行业知名品牌，了解市场更进一步",
          img: require("@/assets/images/trademark/v230401/quick/11.png"),
          path: "/depot/brand",
          id: "public_module_button011",
        },
        {
          title: "不建议注册词库",
          text: "城市，景点，姓氏，职业<br/>哪些不能注册，抢先规避，注册更高效",
          img: require("@/assets/images/trademark/v230401/quick/12.png"),
          path: "/depot/word",
          id: "public_module_button012",
        },
      ],
    };
  },
  props: {
    // 是否支持链接跳转
    goLink: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    fastClick(item) {
      if (item.kf) {
        // 唤起客服
        customerFunc();
      } else {
        this.$router.push(item.path);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.quick-panel {
  .mTitle {
    font-size: 20px;
    font-weight: 500;
    color: #000000;
    line-height: 28px;
    margin-bottom: 10px;
  }
  &-content {
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(4, auto);
    grid-row-gap: 16px;
  }
  .item {
    width: 258px;
    height: 132px;
    font-size: 12px;
    color: #606266;
    line-height: 22px;
    padding: 24px 24px 0;
    cursor: pointer;
    &-hd {
      font-size: 16px;
      font-weight: 500;
      color: #303132;
      margin-bottom: 8px;
      img {
        width: 34px;
        margin-right: 12px;
      }
    }
    &-bd {
      color: #606266;
    }
    &:hover {
      background: #f2f6ff;
      .item-hd {
        color: @primaryHover;
      }
    }
  }
}
</style>
