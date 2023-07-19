<template>
  <div>
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <!-- banner start -->
    <div class="banner">
      <IndexBanner
        :list="bigBanner"
        v-if="bigBanner && bigBanner.length && getModulesStatus('homePage_topBanner')"
        :showData="NODE_PLA !== 'kby' && getModulesStatus('Home_dataShow')"
        style="height: 396px"
      />
    </div>
    <div class="ly-page center ksy-w1320">
      <div class="box-head">
        <div class="box-head-title"><img :src="titleImg" alt="" /></div>
        <div class="box-head-extend">
          <ul class="flex flex-c-c">
            <li
              class="flex flex-c-c"
              v-for="(item, index) in ['代理商标量统计', '律师代理商标地区分布', '分类分布', '代理商案例详情']"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </div>
        <search-page @search="search" placeholder="请输入您要查询的律师名称">
          <template #tips
            >批量查询，请用分隔号 「;」分开。例如：<span
              @click="search(q)"
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
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>
<script>
import Cookies from "js-cookie";
import common from "@/apis/common";
import trademark from "@/apis/trademark";
import { cloneDeep } from "lodash";
import modulesAuth from "@/mixins/modules-auth";
import IndexMixins from "@/mixins";
const NODE_PLA = process.env.NODE_PLA;

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
          adKey: "Attorney's_trademark_top_banner",
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
  mixins: [modulesAuth, IndexMixins], // 官网模块列表权限 是否显示
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      titleImg: require("@/assets/images/trademark/v230401/title/lawyer.png"),
      quickStr: ["Charles T. J. Weigell", "Ben Natter"],
    };
  },
  methods: {
    async search(val) {
      await this.handleSearchFree();
      this.$router.push({
        path: "/fastResult/brandLawyer",
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
</style>
