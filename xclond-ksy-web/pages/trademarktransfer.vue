<template>
  <div class="about-page">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />
    <!-- <a-carousel v-if="bigBanner && bigBanner.length && getModulesStatus('trademarkTransfer_topBanner')" class="banner">
      <div v-for="(item, index) in bigBanner" :key="`b_${index}`">
        <a :href="item.url" v-if="item.url">
          <img :src="item.picPath" :alt="item.name" />
        </a>
        <img v-else :src="item.picPath" :alt="item.name" />
      </div>
    </a-carousel> -->

    <IndexBanner
      :list="bigBanner"
      v-if="bigBanner && bigBanner.length && getModulesStatus('trademarkTransfer_topBanner')"
      :showData="false"
      :height="396"
    />

    <!-- 热门商标 -->
    <HotTrademark :productList="productList" v-if="getModulesStatus('trademarkTransfer_hotGoods')" />

    <!-- R标优势 -->
    <RType v-if="getModulesStatus('trademarkTransfer_advantages')" />

    <!-- 商标转让交易流程 -->
    <TransactionProcess v-if="getModulesStatus('trademarkTransfer_transactionProcess')" />

    <!-- 服务优势 -->
    <ServiceAdvantages v-if="getModulesStatus('trademarkTransfer_serviceAdvantages')" />

    <!-- 心仪的商标 -->
    <LikeTrade v-if="getModulesStatus('trademarkTransfer_noGoods')" />

    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" :showBanner="false" />
  </div>
</template>

<script>
import common from "@/apis/common";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
export default {
  head() {
    return {
      title: `国际海外商标专利注册-美国欧盟日日韩韩国商标查询注册驳回宣誓-跨标云`,
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: `${
            process.env.NODE_PLA === "kby"
              ? "美国商标，美国商标，韩国商标，欧盟商标，日韩商标"
              : "跨税云,跨税云官网,跨税云平台，跨税云VAT"
          }`,
        },
        {
          hid: "description",
          name: "description",
          content: `${
            process.env.NODE_PLA === "kby"
              ? "跨标云知产百科为卖家提供美国欧盟澳大利亚日本韩国英国墨西哥提供外观专利查询、注册、宣誓、授权、侵权知识等服务，助力企业出海降本增效，货通全球！"
              : "跨税云(itaxs.com)—智能税务平台，直连海外税局。itaxs代表intelligent tax system，连接多家跨境电商平台及多国税务系统，帮助卖家快速注册VAT税号，精准算税，一键申报，打造跨境人自己的VAT系统，助力跨境卖家开拓海外市场，已为50000+卖家提供服务。"
          }`,
        },
      ],
    };
  },
  data() {
    // return {
    //   list: [],
    // };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  async asyncData(context) {
    try {
      console.log(process.env.NODE_ENV);
      let [{ data: bigBanner }, { data: navList }, { data: footerList }, { data: productList }, { data: webInfo }] =
        await Promise.all([
          context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
            adKey: "trademarktransfer",
          }),
          context.$axiosApi(common.newslist.url, common.newslist.methods),
          context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
          // 差精确分类的条件
          context.$axiosApi(common.getOrderProductList.url, common.getOrderProductList.methods, {
            limit: 24,
            page: 1,
            applySit: 1,
            productCategoryId: process.env.NODE_ENV === "dev" ? 6614 : 6619,
            // 商品设计的是查询某个分类下的产品，接口不支持分类名称查询，只能分类id查询,接口也不改...
          }),
          context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        ]);
      productList = productList.records;
      return {
        bigBanner: bigBanner,
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        productList,
        webInfo, // 网站信息
      };
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
