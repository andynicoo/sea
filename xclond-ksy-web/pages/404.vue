<template>
  <div class="errpage">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="content ksy-w1320">
      <nuxt-link to="/"><img src="~/assets/images/404.png" alt="404" class="ksy-mt-4" /></nuxt-link>
      <p>很抱歉！您访问的页面不存在</p>
      <nuxt-link to="/">
        <a-button type="primary"> 去首页 </a-button>
      </nuxt-link>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>

<script>
import common from "@/apis/common";
export default {
  async asyncData(context) {
    try {
      let [{ data: navList }, { data: footerList }, { data: webInfo }] = await Promise.all([
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
      ]);
      return {
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        webInfo, // 网站信息
      };
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="less" scoped>
.errpage {
  // height: calc(100vh - 588px);
  // margin-top: 64px;
  .content {
    margin: 0 auto;
    padding: 40px 0px;
    text-align: center;
    h1 {
      margin-top: 64px;
    }
    p {
      font-size: 16px;
      color: @textColor6;
    }
  }
}
</style>
