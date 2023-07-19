<template>
  <div class="page-index">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />
    <!-- banner start -->
    <IndexBanner
      :list="bigBanner"
      v-if="bigBanner && bigBanner.length && getModulesStatus('homePage_topBanner')"
      :showData="NODE_PLA !== 'kby' && getModulesStatus('Home_dataShow')"
    />
    <div style="display: none">{{ NODE_PLA }}</div>
    <!-- banner end -->
    <div
      class="searcher center ksy-w1320 trademark-query-center"
      v-if="NODE_PLA === 'kby' && getModulesStatus('homePage_trademarkQuery')"
      :style="{ marginTop: getModulesStatus('homePage_topBanner') ? '-60px' : '67px' }"
    >
      <SearchBox @goSearch="goSearch" :page="'index'" />
    </div>
    <!-- 跨企云留资 start -->
    <div v-if="NODE_PLA === 'kqy'" class="searcher center ksy-w1320" style="margin-top: -60px">
      <Contact />
    </div>
    <!-- 跨企云留资 end -->

    <div class="center ksy-w1320" v-if="NODE_PLA !== 'wg'">
      <!-- 腰部广告位 start -->
      <a-carousel class="banner-mid" v-if="middleBanner && middleBanner.length">
        <div
          v-for="(mid, index) in middleBanner"
          :key="index"
          style="font-size: 0"
          v-sensorsDire="{
            type: 'BannerClick',
            event: 'click',
            getParams: () => ({
              B_banner_id: mid.adId,
              page_name: '首页',
            }),
          }"
        >
          <a :href="mid.url" target="_blank" v-if="mid.url">
            <img class="ksy-b" :src="mid.picPath" :alt="mid.name" />
          </a>
          <img class="ksy-b" v-else :src="mid.picPath" :alt="mid.name" />
        </div>
      </a-carousel>
      <!-- 腰部广告位 end -->
      <!-- 活动栏 start -->
      <ActiveTab
        :hotActiveList="hotActiveList"
        :exclusiveList="exclusiveList"
        :limitedList="limitedList"
        :showProgress="showProgress"
        v-if="getModulesStatus('homePage_marketingActivities') && NODE_PLA !== 'kqy'"
      />
      <!-- 活动栏 end -->
    </div>
    <!-- 产品服务start -->
    <GoodsType :list="productList" v-if="productList && productList && getModulesStatus('homePage_recommendation')" />
    <!-- 产品服务end -->
    <!-- 服务优势start 跨企云不显示-->
    <AdvantageTemplate
      v-if="
        getModulesStatus('homePage_serviceRecommended') &&
        (NODE_PLA === 'kby' || NODE_PLA === 'ksy' || NODE_PLA === 'wg')
      "
    />
    <!-- 服务优势end -->
    <!-- 公司介绍展示start  跨企云不显示-->
    <AboutCompaniesSpeak
      v-if="
        getModulesStatus('homePage_customerComments') && (NODE_PLA === 'kby' || NODE_PLA === 'ksy' || NODE_PLA === 'wg')
      "
    />
    <!-- 公司介绍展示end -->
    <template v-if="NODE_PLA === 'kby'">
      <!-- kby注册商标的好处start -->
      <KbyAdvantage v-if="getModulesStatus('homePage_benefits')" />
      <!-- kby注册商标的好处end -->
      <!-- kby商标购买流程start -->
      <PurchaseProcess v-if="getModulesStatus('homePage_registeredTrademark')" />
      <!-- kby商标购买流程end -->
      <!-- 世界地图start -->
      <IndexWorldMap v-if="getModulesStatus('homePage_registeredTrademark')" />

      <!-- 跨标云 合作伙伴不显示的时候，防止地图部分盖住下面的组件 -->
      <div
        style="height: 67px"
        v-if="!(partnerList && partnerList.length && getModulesStatus('homePage_partners'))"
      ></div>
      <!-- 世界地图end -->
      <!-- 品牌展示start -->
      <IndexBrand
        v-if="partnerList && partnerList.length && getModulesStatus('homePage_partners')"
        :list="partnerList"
      />
      <!-- 品牌展示end -->
      <AdvTemp v-if="getModulesStatus('homePage_marketingEntrance')" />
    </template>
    <template v-if="NODE_PLA === 'ksy'">
      <!-- 品牌展示start -->
      <IndexBrand
        v-if="partnerList && partnerList.length && getModulesStatus('homePage_partners')"
        :list="partnerList"
      />
      <!-- 品牌展示end -->
      <!-- 世界地图start -->
      <IndexWorldMap v-if="getModulesStatus('homePage_registeredTrademark')" />
      <!-- 世界地图end -->
    </template>
    <!-- 外观专利 -->
    <template v-if="NODE_PLA === 'wg'">
      <!-- kby注册商标的好处start -->
      <KbyAdvantage v-if="getModulesStatus('homePage_benefits')" />
      <!-- kby注册商标的好处end -->
      <!-- kby商标购买流程start -->
      <PurchaseProcess v-if="getModulesStatus('homePage_registeredTrademark')" />
      <!-- kby商标购买流程end -->
      <!-- 世界地图start -->
      <IndexWorldMap v-if="getModulesStatus('homePage_registeredTrademark')" />

      <!-- 跨标云 合作伙伴不显示的时候，防止地图部分盖住下面的组件 -->
      <div
        style="height: 67px"
        v-if="!(partnerList && partnerList.length && getModulesStatus('homePage_partners')) && NODE_PLA !== 'wg'"
      ></div>
      <!-- 世界地图end -->
      <!-- 品牌展示start -->
      <IndexBrand
        v-if="partnerList && partnerList.length && getModulesStatus('homePage_partners')"
        :list="partnerList"
      />
      <!-- 品牌展示end -->
      <AdvTemp v-if="getModulesStatus('homePage_marketingEntrance')" />
    </template>
    <template v-if="NODE_PLA === 'kqy'">
      <!-- kqy注册商标的好处start -->
      <KqyAdvantage v-if="getModulesStatus('homePage_benefits')" />
      <!-- kqy注册商标的好处end -->

      <!-- kqy商标购买流程start -->
      <KqyPurchaseProcess v-if="getModulesStatus('homePage_registeredTrademark')" />
      <!-- kqy商标购买流程end -->

      <!-- 世界地图start -->
      <IndexWorldMap v-if="getModulesStatus('homePage_registeredTrademark')" />

      <!-- 跨企云 合作伙伴不显示的时候，防止地图部分盖住下面的组件 -->
      <div
        style="height: 67px"
        v-if="!(partnerList && partnerList.length && getModulesStatus('homePage_partners')) && NODE_PLA !== 'wg'"
      ></div>
      <!-- 世界地图end -->
      <!-- 品牌展示start -->
      <IndexBrand
        v-if="partnerList && partnerList.length && getModulesStatus('homePage_partners')"
        :list="partnerList"
      />
      <!-- 品牌展示end -->
    </template>
    <!-- 热点资讯start -->
    <IndexMsgHot :list="hotNewsList" v-if="getModulesStatus('homePage_hotInformation')" />
    <!-- 热点资讯end -->
    <!-- v-if="footerList && footerList.length" -->
    <AdvTempKqy v-if="NODE_PLA === 'kqy'" />
    <FooterTemp :list="footerList" :webInfo="webInfo" :showBanner="NODE_PLA === 'ksy'" />
  </div>
</template>

<script>
import NewsList from "../components/NewsList.vue";
import common from "@/apis/common";
import indexApi from "@/apis/indexApi";
import news from "@/apis/news";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
import PurchaseProcess from "@/components/index/kby/purchaseProcess";
import KqyPurchaseProcess from "@/components/index/kby/purchaseProcess/KqyIndex";
import KbyAdvantage from "@/components/index/kby/advantage";
import KqyAdvantage from "@/components/index/kby/advantage/KqyIndex";
const NODE_PLA = process.env.NODE_PLA;
import config from "../static/config";
import { mapState } from "vuex";

export default {
  name: "IndexPage",
  head() {
    return {
      title: `${config[NODE_PLA].indexTitle}`,
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: `${config[NODE_PLA].indexKeywords}`,
        },
        {
          hid: "description",
          name: "description",
          content: `${config[NODE_PLA].indexDescription}`,
        },
      ],
    };
  },
  async asyncData(context) {
    try {
      let [
        { data: bigBanner },
        { data: middleBanner },
        { data: hotActiveList },
        { data: exclusiveList },
        { data: limitedList },
        { data: productList },
        { records: hotNewsList },
        { data: navList },
        { data: footerList },
        { data: partnerList },
        { data: webInfo },
      ] = await Promise.all([
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "HomePage_top_banner",
        }),
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "HomePage_middle_banner",
        }),
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "HomePage_activity1_banner",
        }),
        context.$axiosApi(indexApi.activityList.url, indexApi.activityList.methods, {
          enterpriseId: config[NODE_PLA].enterpriseId,
          type: "VIP_COUPON", // 专享礼券
        }),
        context.$axiosApi(indexApi.officialWebsiteList.url, indexApi.officialWebsiteList.methods, {
          enterpriseId: config[NODE_PLA].enterpriseId,
          type: "WEBSITE_SECOND_KILL", // 限时秒杀
        }),
        context.$axiosApi(indexApi.productList.url, indexApi.productList.methods), // 专注于一站式品牌服务
        context.$axiosApi(news.getNewsByCate.url, news.getNewsByCate.methods, {
          enabled: 0,
          limit: 3,
          page: 1,
        }),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 1 }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
      ]);
      return {
        bigBanner: bigBanner, // 首页顶部banner
        middleBanner, // 首页腰部banner
        hotActiveList: Array.isArray(hotActiveList) ? hotActiveList.slice(0, 4) : [], // 热门活动
        exclusiveList: Array.isArray(exclusiveList) ? exclusiveList.slice(0, 3) : [], // 新人专享活动
        limitedList: Array.isArray(limitedList) ? limitedList : [], // 限时秒杀活动
        // 限时秒杀是否显示进度条(跨税云)
        showProgress: Array.isArray(limitedList) && limitedList.length ? limitedList[0].showProgress : "",
        productList: Array.isArray(productList)
          ? NODE_PLA === "kby"
            ? productList.slice(0, 2)
            : productList.slice(0, 3)
          : [], // 产品服务列表
        hotNewsList: Array.isArray(hotNewsList) ? hotNewsList : [], // 热门资讯列表
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        partnerList: partnerList.slice(0, 10), // 合作伙伴
        webInfo, // 网站信息
      };
    } catch (error) {
      console.log("error", error);
    }
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      newList: [],
      bannerList: [],
      swiperOption: {
        // loop: true,
        slidesPerView: 3,
        centeredSlides: false,
        spaceBetween: 70,
        autoplay: true,
        grabCursor: true,
      },
      isShow: false,
    };
  },
  computed: {
    ...mapState({
      searchBox: (state) => state.searchBox,
    }),
  },
  mounted() {
    this.isShow = true;
  },
  destroyed() {
    this.$store.commit("setSearchBoxData", { show: false });
  },
  components: {
    NewsList,
    PurchaseProcess,
    KqyPurchaseProcess,
    KbyAdvantage,
    KqyAdvantage,
  },
  methods: {
    goSearch(data) {
      console.log("跳转到/fastResult/brandLike");
      if (data) {
        this.$router.push({
          path: "/fastResult/brandLike",
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.page-index {
  &-adv {
    margin: 56px auto 60px;
    img {
      width: 100%;
    }
  }
  .banner {
    &-big {
      margin-bottom: 60px;
      /deep/ .slick-slide {
        height: 320px;
      }
    }
    &-mid {
      margin: 50px 0 0;
    }
  }
  .searcher {
    position: relative;
    z-index: 999;
  }
}
.trademark-query-center {
  height: 128px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0px 4px 26px 0px rgba(105, 105, 105, 0.07);
  backdrop-filter: blur(15px);
  padding: 36px 60px;
  border-radius: 5px;
}
</style>
