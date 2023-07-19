<template>
  <div class="about-page">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />
    <!-- 顶部banner -->
    <IndexBanner
      :list="list"
      v-if="list && list.length"
      :height="596"
      :showData="getModulesStatus('aboutUs_dataShow')"
    />

    <!-- 服务介绍 -->
    <ServerIntro v-if="getModulesStatus('aboutUs_serviceIntroduced') && (NODE_PLA === 'ksy' || NODE_PLA === 'kby')" />
    <ServerIntroKqy v-if="getModulesStatus('aboutUs_serviceIntroduced') && NODE_PLA === 'kqy'" />

    <!-- 服务优势 -->
    <!-- <ServerAdvan /> -->
    <AdvantageTemplate
      :type="NODE_PLA === 'wg' ? 'index' : 'about'"
      v-if="getModulesStatus('aboutUs_serviceAdvantages') && NODE_PLA !== 'kqy'"
    />

    <!-- 合作伙伴 -->
    <CooperPartner
      :list="partnerList"
      v-if="getModulesStatus('aboutUs_partners') && (NODE_PLA === 'ksy' || NODE_PLA === 'kby')"
    />

    <!-- 权威认证 -->
    <AuthCertiKby v-if="NODE_PLA === 'kby' && getModulesStatus('aboutUs_certificate')" />
    <AuthCerti v-if="NODE_PLA === 'ksy'" />

    <!-- 外观专利案例展示 -->
    <CaseShow v-if="NODE_PLA === 'wg' || NODE_PLA === 'kqy'" />

    <!-- 办公环境 -->
    <OfficeEnvWG v-if="getModulesStatus('aboutUs_office') && (NODE_PLA === 'wg' || NODE_PLA === 'kqy')" />
    <OfficeEnv v-if="getModulesStatus('aboutUs_office') && (NODE_PLA === 'ksy' || NODE_PLA === 'kby')" />

    <!-- 联系我们 -->
    <ContactUs v-if="getModulesStatus('aboutUs_contactUs') && (NODE_PLA === 'ksy' || NODE_PLA === 'kby')" />

    <!-- 免费注册 -->
    <AdvTemp v-if="NODE_PLA === 'wg'" />
    <AdvTempKqy v-if="NODE_PLA === 'kqy'" />
    <!-- <img src="~/assets/images/wkl.jpg" style="width: 100px" alt="wkl" />
    <img v-lazy="'https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF'" style="width: 100px" alt="wkl" /> -->
    <FooterTemp
      v-if="footerList && footerList.length"
      :list="footerList"
      :webInfo="webInfo"
      :showBanner="NODE_PLA === 'ksy' || NODE_PLA === 'kby'"
    />
  </div>
</template>

<script>
import common from "@/apis/common";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
const NODE_PLA = process.env.NODE_PLA;
import config from "../static/config";
export default {
  head() {
    return {
      title: `${config[NODE_PLA].aboutTitle}`,
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: `${config[NODE_PLA].aboutKeywords}`,
        },
        {
          hid: "description",
          name: "description",
          content: `${config[NODE_PLA].aboutDescription}`,
        },
      ],
    };
  },
  data() {
    return {
      list: [],
      NODE_PLA: process.env.NODE_PLA,
    };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  async asyncData(context) {
    try {
      let [{ data: list }, { data: navList }, { data: footerList }, { data: partnerList }, { data: webInfo }] =
        await Promise.all([
          context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
            adKey: "AboutUs_top_banner",
          }),
          context.$axiosApi(common.newslist.url, common.newslist.methods),
          context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
          context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 1 }),
          context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        ]);
      return {
        list: list || [],
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        partnerList: partnerList.slice(0, 10), // 合作伙伴
        webInfo, // 网站信息
      };
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
