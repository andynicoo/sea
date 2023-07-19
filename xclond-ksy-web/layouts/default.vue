<template>
  <a-config-provider :locale="locale">
    <nuxt />
  </a-config-provider>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import common from "@/apis/common";

export default {
  data() {
    return {
      value: "",
      userPath: false, // 如果是user路径，就是微应用，隐藏公用组件
      locale: zhCN,
      NODE_PLA: process.env.NODE_PLA,
      isShow: false,
    };
  },
  async mounted() {
    if (typeof window !== undefined && window._VV === undefined) {
      window._VV = this;
    }

    this.getModule();
  },
  methods: {
    async getModule() {
      let res = await this.$axiosApi(common.getModuleLists.url, common.getModuleLists.methods);
      this.$store.commit("setModulesData", res.data);
    },
  },
};
</script>

<style lang="less">
.message {
  text-align: center;
  h2 {
    font-size: 16px;
    text-align: left;
  }
  .content {
    min-height: 100px;
    margin-bottom: 20px;
  }
}
</style>
