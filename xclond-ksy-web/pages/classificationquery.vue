<template>
  <div class="search">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />

    <IndexBanner
      :list="bigBanner"
      v-if="bigBanner && bigBanner.length && getModulesStatus('trademarkQuery_banner')"
      class="banner"
      :showData="false"
      :height="396"
    />

    <div class="ly-page center ksy-w1320 trademark-query-center" v-if="getModulesStatus('trademarkQuery_other')">
      <div class="box-head">
        <div class="box-head-title"><img :src="titleImg" alt="" /></div>
        <div class="box-head-extend">
          <div class="box-head-extend-text">
            直连美国、欧盟、日本、英国等国家商标局 国际商标注册风险、近似商标权威查询，平均2秒获得结果
          </div>
        </div>
        <search-page ref="search-page" @search="search" placeholder="请输入产品关键词中文或者英文进行查询">
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
      <div class="classification-title">商标分类速查</div>
      <ul class="classification-list">
        <li v-for="item in trademarkCategoryAllList" :key="item.categoryNum" @click="goSearch(item.categoryNum)">
          <img :src="getImgUrl(item.categoryNum)" />
          第{{ item.categoryNum < 10 ? "0" : "" }}{{ item.categoryNum }}类 {{ item.categoryName }}
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
import { createVNode } from "vue";
import { uniq } from "lodash";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
import { mapMutations } from "vuex";

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
      let [
        { data: bigBanner },
        { data: navList },
        { data: footerList },
        { data: webInfo },
        { data: trademarkCategoryAllList },
      ] = await Promise.all([
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "classification_query_top_banner",
        }),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        context.$axiosApi(trademark.categoryOneList.url, trademark.categoryOneList.methods, {
          limit: 50,
          page: 1,
          countryCode: "US",
        }),
      ]);

      return {
        bigBanner: bigBanner, // 顶部banner
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        webInfo, // 网站信息
        urlText: "",
        trademarkCategoryAllList: Array.isArray(trademarkCategoryAllList) ? trademarkCategoryAllList : [], // 导航列表
      };
    } catch (error) {
      console.log(error);
    }
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  data() {
    return {
      searchText: "", // 搜索值
      searchedText: "", // 搜过的值
      countryCode: "US",
      NODE_PLA: process.env.NODE_PLA,
      titleImg: require("@/assets/images/trademark/v230401/title/type.png"),
      // trademarkCategoryAllList: [], //商标大类列表
      quickStr: ["computers", "bags", "shoes"],
    };
  },
  mounted() {
    // 清空搜索关键词
    Cookies.remove("trade");
    let historySearchText = [];
    if (this.$store.state.historySearchText) {
      historySearchText = this.$store.state.historySearchText;
    }
    historySearchText = uniq(historySearchText).slice(-6);
    this.$store.commit("setHistorySearchText", historySearchText);
  },
  methods: {
    ...mapMutations("trademark", ["setPagesTradeStatus"]),
    search(val) {
      //Cookies.remove("trade");
      this.setPagesTradeStatus({
        typeSearch: true,
      });
      this.$router.push({
        path: "/classificationdetails",
      });
    },
    searchQuick(val) {
      this.$refs["search-page"]._data.text = val;
      Cookies.set("trade", val);
      this.search();
    },
    //获取分类icon
    getImgUrl(i) {
      return require("~/assets/images/categoryIcon/" + i + "@2x.png");
    },
    //点击分类查询
    goSearch(id) {
      this.$router.push({ path: "/classificationdetails", query: { categoryId: id } });
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~@/assets/css/trademark.less");
.classification-title {
  font-size: 28px;
  color: rgba(0, 0, 0, 0.9);
  text-align: center;
  margin: 80px auto 40px;
}
.classification-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: 16px;
  margin-bottom: 80px;
  li {
    width: 224px;
    height: 54px;
    line-height: 54px;
    border-radius: 2px;
    margin-right: 11px;
    cursor: pointer;
    text-align: center;
    &:hover {
      background: #f5f7fa;
    }
    &:active {
      color: #3370ff;
    }
  }
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  img {
    width: 22px;
    position: relative;
    top: -3px;
    margin-right: 5px;
  }
}
</style>
