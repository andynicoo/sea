<template>
  <div class="enter">
    <h3>快捷入口</h3>
    <div class="brand" v-if="false">
      <img src="~/assets/images/rengong.svg" alt="免费人工核名" />
      <ArtiNameBtn :type="'text'" id="trademarksearchresult_button003" />
    </div>
    <nuxt-link :to="'/productservice'">
      <div class="brand">
        <img src="~/assets/images/chanpin.svg" alt="查看产品服务" />
        查看产品服务
      </div>
    </nuxt-link>
    <div class="brand" @click="goClient">
      <img src="~/assets/images/jiance.svg" alt="我监测的商标" />
      我监测的商标
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goClient() {
      const host = `${this.$store.state.host.server_url}/trademarkMonitoring`;
      window.location = host;
    },
  },
};
</script>
<style lang="less" scoped>
.enter {
  background: #ffffff;
  border-radius: 0px 0px 0px 0px;
  // height: 230px;
  height: 174px;
  padding: 16px 26px;
  h3 {
    font-size: 14px;
    font-weight: 400;
    color: @textColor;
  }
  .brand {
    // width: 154px;
    height: 32px;
    background: rgba(178, 201, 255, 0.2);
    border-radius: 2px 2px 2px 2px;
    font-size: 14px;
    line-height: 32px;
    color: @textColor6;
    cursor: pointer;
    margin-top: 24px;
    &:hover {
      color: rgba(51, 112, 255, 1);
    }
    img {
      padding-left: 10px;
      padding-right: 6px;
      vertical-align: middle;
      padding-bottom: 2px;
    }
  }
}
</style>
