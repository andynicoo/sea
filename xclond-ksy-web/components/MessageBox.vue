<template>
  <a-modal v-model="visible" :title="null" :footer="null" width="480px" centered @ok="handleOk" destroyOnClose>
    <div class="message">
      <h2>{{ messageData.title }}</h2>
      <div class="content">
        <a v-if="messageData.url" :href="messageData.url" target="_blank">
          <img :src="messageData.files" style="max-width: 100%" />
        </a>
        <img :src="messageData.files" style="max-width: 100%" v-else />
      </div>
      <a-button type="primary" @click="visible = false">确认</a-button>
    </div>
  </a-modal>
</template>

<script>
import common from "@/apis/common";
import moment from "moment";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      visible: false,
      messageData: {},
    };
  },
  watch: {
    "$route.path": {
      handler(newVal, oldVal) {
        let pages = ["/", "/search", "/productservice", "/trademarktransfer"];
        if (pages.includes(newVal)) {
          this.getMessage(newVal);
        }
      },
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    async getMessage(val) {
      if (val === "/") val = "/index";
      val = val.replace("/", "");
      let res = await this.$axiosApi(common.getMessage.url, common.getMessage.methods, { pagePosition: val }, true);
      let cookieMsgId = Cookies.get("cookieMsgId" + val);
      let today = moment(new Date()).format("YYYY-MM-DD");
      if (res.data.id && cookieMsgId !== today + res.data.id && this.NODE_PLA === "kby") {
        let setCookieMsgId = today + res.data.id;
        this.messageData = res.data;
        this.visible = true;
        Cookies.set("cookieMsgId" + val, setCookieMsgId);
      }
    },
    handleOk(e) {
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped></style>
