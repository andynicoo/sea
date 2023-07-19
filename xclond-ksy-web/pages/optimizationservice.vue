<template>
  <div>
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />
    <!-- banner start -->
    <!-- <a-carousel v-if="bigBanner && bigBanner.length">
      <div
        v-for="(item, index) in bigBanner"
        :key="`b_${index}`"
        v-sensorsDire="{
          type: 'BannerClick',
          event: 'click',
          getParams: () => ({
            B_banner_id: item.adId,
            page_name: '优选服务',
          }),
        }"
      >
        <a :href="item.url" v-if="item.url">
          <img :src="item.picPath" :alt="item.name" />
        </a>
        <img v-else :src="item.picPath" :alt="item.name" />
      </div>
    </a-carousel> -->
    <IndexBanner
      :list="bigBanner"
      v-if="bigBanner && bigBanner.length"
      :showData="false"
      :height="396"
    />
    <!-- banner end -->
    <ProductService
      :loaded="loaded"
      :baseData="baseData"
      v-if="baseData && baseData.length"
      @handleServiceBuy="handleServiceBuy"
    />
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>

<script>
import common from "@/apis/common";
export default {
  head() {
    return {
      title: `优选服务-跨境电商网站导航`,
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: "优选服务-跨境电商网站导航",
        },
        {
          hid: "description",
          name: "description",
          content: `${
            process.env.NODE_PLA === "kby" ? "跨标云" : "跨税云"
          }优选服务专注于为跨境卖家提供免费开店,选品推荐,ERP管理,海外物流等优质服务商网络，助力跨境卖家开拓海外市场!`,
        },
      ],
    };
  },
  async asyncData(context) {
    try {
      let [{ data: bigBanner }, { data: baseData }, { data: navList }, { data: footerList }, { data: webInfo }] =
        await Promise.all([
          context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
            adKey: "OptimizingService_top_banner",
          }),
          context.$axiosApi(common.getNavServiceData.url, common.getNavServiceData.methods, { type: 2 }),
          context.$axiosApi(common.newslist.url, common.newslist.methods),
          context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
          context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        ]);
      return {
        bigBanner: Array.isArray(bigBanner) ? bigBanner : [],
        baseData: Array.isArray(baseData) ? baseData : [],
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        webInfo, // 网站信息
        loaded: true,
      };
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    handleServiceBuy(item) {
      this.$sensors.track("OptimizationServeClick", {
        optimization_serve_kind: item.name,
        optimization_serve_name: item.platformName,
        optimization_serve_introduce: item.info,
      });
      console.log("handleServiceBuy", item);
      const host = item.url;
      host && window.open(host);
    },
  },
};
</script>
