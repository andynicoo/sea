import common from "@/apis/common";
export default {
  methods: {
    // 通过adkey区分广告banner类型 顶部 腰部
    async getAdvBanner(adKey, prop) {
      const { data } = await this.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, { adKey });
      this[prop] = data
    }
  }
}
