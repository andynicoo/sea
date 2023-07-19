<template>
  <div class="operate">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />
    <div class="content ksy-w1320">操作指引</div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>

<script>
import common from "@/apis/common";
export default {
  async asyncData(context) {
    try {
      let [{ data: webInfo },{ data: navList }, { data: footerList }] = await Promise.all([
          context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
      ]);
      return {
        webInfo,
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
      };
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style lang="less" scoped>
.operate {
  // height: calc(100vh - 588px);
  margin-top: 64px;
  .content {
    margin: 0 auto;
    padding: 40px 0px;
    text-align: center;
    h1 {
      margin-top: 64px;
    }
  }
}
</style>
