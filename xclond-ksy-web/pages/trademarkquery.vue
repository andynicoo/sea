<template>
  <div class="search">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />

    <IndexBanner
      :list="bigBanner"
      v-if="bigBanner && bigBanner.length && getModulesStatus('trademarkQuery_banner')"
      :showData="false"
      :height="396"
      class="banner"
    />

    <div class="ly-page center ksy-w1320" v-if="getModulesStatus('trademarkQuery_other')">
      <div class="box-head">
        <div class="box-head-title"><img :src="titleImg" alt="" /></div>
        <div class="box-head-extend">
          <div class="box-head-extend-text">
            直连美国、欧盟、日本、英国等国家商标局 国际商标注册风险、近似商标权威查询，平均2秒获得结果
          </div>
        </div>
        <search-page @search="search" placeholder="请输入要查询的美国商标名称">
          <template #tips
            >批量查询，请用分隔号 「;」分开。例如：<span
              @click="searchQuick(q)"
              class="quik-search"
              v-for="(q, qIndex) in quickStr"
              :key="qIndex"
              >{{ q }};</span
            ></template
          >
        </search-page>
      </div>
      <div style="margin: 60px 0">
        <QuicklyPanel></QuicklyPanel>
      </div>
      <div class="trademark-query-slogan-title center">为什么选择我们？</div>
      <ul class="trademark-query-slogan">
        <li>
          <img src="~/assets/images/trademark/t_ic1.png" />
          <h3>1000万+商标</h3>
          <p>支持多种查询，完全免费多维度整合关联信息，智能匹配搜索结果</p>
        </li>
        <li>
          <img src="~/assets/images/trademark/t_ic2.png" />
          <h3>全量数据</h3>
          <p>商标名称、图片、申请人、申请人地址、状态、公告文件等状态、公告文件等</p>
        </li>
        <li>
          <img src="~/assets/images/trademark/t_ic3.png" />
          <h3>权威来源</h3>
          <p>与官方权威网站同步，覆盖海量商标数据，核心数据每小时实现自动清洗并更新</p>
        </li>
      </ul>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>

<script>
import Cookies from "js-cookie";
import common from "@/apis/common";
import trademark from "@/apis/trademark";
import { cloneDeep } from "lodash";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
export default {
  head() {
    return {
      title: `国际商标查询-免费商标检索-跨标云商标查询系统`,
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: `${
            process.env.NODE_PLA === "kby"
              ? "美国商标查询,欧盟商标查询,日本商标查询,英国商标查询,"
              : "跨税云,跨税云官网,跨税云平台，跨税云VAT"
          }`,
        },
        {
          hid: "description",
          name: "description",
          content: `${
            process.env.NODE_PLA === "kby"
              ? "国际商标查询就上跨标云,100+美国本土律师,500+资深专业团队,免费商标检索,降低注册驳回风险!报价透明化,快速办理！"
              : "跨税云(itaxs.com)—智能税务平台，直连海外税局。itaxs代表intelligent tax system，连接多家跨境电商平台及多国税务系统，帮助卖家快速注册VAT税号，精准算税，一键申报，打造跨境人自己的VAT系统，助力跨境卖家开拓海外市场，已为50000+卖家提供服务。"
          }`,
        },
      ],
    };
  },
  async asyncData(context) {
    try {
      let [{ data: bigBanner }, { data: navList }, { data: footerList }, { data: webInfo }] = await Promise.all([
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "trademark_query_top_banner",
        }),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
      ]);

      return {
        bigBanner: bigBanner, // 顶部banner
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        webInfo, // 网站信息
        urlText: "",
      };
    } catch (error) {
      console.log(error);
    }
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      titleImg: require("@/assets/images/trademark/v230401/title/like.png"),
      searchText: "", // 搜索值
      searchedText: "", // 搜过的值
      countryCode: "US",

      form: {
        countryList: [], // 国家arr
        curKeyword: "", // 当前国家
        trade: [], // 商标arr
        cruTrade: "", // 当前商标
      },
      quickStr: ["apple", "huawei", "samsung"],
    };
  },
  created() {
    // url channel参数,记录 用于统计跳转过来的链接的注册统计
    let channel = this.$route.query.channel;
    if(channel){
      Cookies.set('channelQuery', channel, { expires: 7 })
    }
  },
  mounted() {
    // 清空搜索关键词
    Cookies.remove("trade");
  },
  methods: {
    goSearch(data) {
      let { keywords, trade } = data;
      this.form.countryList = cloneDeep(keywords);
      this.form.curKeyword = this.form.countryList[0];
      this.form.trade = trade.split(";");
      this.form.cruTrade = this.form.trade[0];

      // this.getTradeList();
    },
    setSearchVal(data) {
      this.searchText = data.searchText;
      this.countryCode = data.countryCode;
    },
    search(val) {
      this.$router.push({
        path: "/fastResult/brandLike",
      });
    },
    searchQuick(val) {
      this.$router.push({
        path: "/fastResult/brandLike",
        query: {
          name: val,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~@/assets/css/trademark.less");
.trademark-query-center {
  margin-top: -122px;
}
.trademark-query-slogan {
  margin: 0 0 80px;
  display: flex;
  justify-content: space-between;
  &-title {
    font-size: 28px;
    font-weight: 600;
    color: #000000;
    line-height: 40px;
    text-align: center;
    margin-bottom: 48px;
  }
  li {
    width: 380px;
    height: 155px;
    background: #ffffff;
    box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
    border-radius: 2px 2px 2px 2px;
    opacity: 1;
    border-top: 2px solid #3370ff;
    position: relative;
    padding-left: 95px;
    line-height: 100%;
    padding-right: 15px;
    h3 {
      font-size: 20px;
      margin: 32px 0 20px;
      font-weight: bold;
    }
    p {
      font-size: 14px;
      line-height: 22px;
    }
    img {
      width: 70px;
      position: absolute;
      top: 46px;
      left: 15px;
    }
  }
}
.other-tools {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
  position: relative;
  width: 1080px;
  margin: 16px auto 0;
  span {
    color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    &:hover {
      color: #3370ff;
    }
  }
}
</style>
