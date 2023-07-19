<template>
  <div class="errpage">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />
    <div class="content ksy-w1320">
      <nuxt-link to="/"><img src="~/assets/images/500.png" alt="500" class="ksy-mt-4" /></nuxt-link>
      <p>很抱歉！系统出错了</p>
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
  data() {
    return {
      navList: [],
      footerList: [],
      webInfo:{}
    };
  },
  mounted() {
    this.getWebsitInfo();
    this.getHeader();
    this.getFooter();
  },
  methods: {
    async getHeader() {
      let data = await this.$axiosApi(common.newslist.url, common.newslist.methods);
      this.navList = data.data;
    },
    async getFooter() {
      let data = await this.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 });
      console.log(data);
      this.footerList = data.data;
    },
    async getWebsitInfo() {
      let res = await this.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods);
      console.log(res);
      this.webInfo=res.data
    },
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
