<template>
  <div>
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />
    <!-- banner start -->
    <IndexBanner
      :list="bigBanner"
      v-if="bigBanner && bigBanner.length && getModulesStatus('productService_banner')"
      :showData="false"
      :height="396"
    />
    <!-- banner end -->
    <ProductService
      :loaded="loaded"
      :baseData="baseData"
      v-if="baseData && baseData.length && getModulesStatus('productService_show')"
      @handleServiceBuy="handleServiceBuy"
    />
    <FooterTemp
      v-if="footerList && footerList.length"
      :list="footerList"
      :webInfo="webInfo"
      :showBanner="NODE_PLA === 'ksy' || NODE_PLA === 'kby' || NODE_PLA === 'wg'"
    />
  </div>
</template>

<script>
import country from "@/utils/country.json";
import common from "@/apis/common";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
const NODE_PLA = process.env.NODE_PLA;
import config from "../static/config";
export default {
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  head() {
    return {
      title: `${config[NODE_PLA].productTitle}`,
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: `${config[NODE_PLA].productKeywords}`,
        },
        {
          hid: "description",
          name: "description",
          content: `${config[NODE_PLA].productDescription}`,
        },
      ],
    };
  },
  data() {
    return {
      country,
      NODE_PLA: NODE_PLA
    };
  },
  async asyncData(context) {
    try {
      let [{ data: webInfo }, { data: bigBanner }, { data: baseData }, { data: navList }, { data: footerList }] =
        await Promise.all([
          context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
          context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
            adKey: "ProductService_top_banner",
          }),
          context.$axiosApi(common.getNavServiceData.url, common.getNavServiceData.methods, { type: 1 }),
          context.$axiosApi(common.newslist.url, common.newslist.methods),
          context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        ]);
      console.log(baseData);
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
      this.$sensors.track("ClickVATServeNowBuy", {
        module_id: "",
        activity_kind: "",
        activity_label: "",
        serve_kind: item.parentInfo.name,
        VAT_serve_country: item.country,
        VAT_serve_name: item.productInfoClientVo.productName,
        VAT_current_price: item.productInfoClientVo.basePrice,
        page_name: "产品服务",
      });
      const host = this.$store.state.host.detail_url + "?id=" + item.productId;
      window.open(host);
    },
  },
};
</script>
