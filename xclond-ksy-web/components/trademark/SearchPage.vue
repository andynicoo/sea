<template>
  <div class="search-page">
    <div class="box-input flex flex-b">
      <a-input v-model="text" @keyup.enter="handleSearch" type="text" :placeholder="placeholder"></a-input>
      <div @click="handleSearch" class="search flex flex-c-c"><em :id="buttonId">查一下</em></div>
    </div>
    <div class="tips"><slot name="tips"></slot></div>
  </div>
</template>
<script>
import IndexMixins from "@/mixins";
import { cloneDeep } from "lodash";
import Cookies from "js-cookie";

export default {
  mixins: [IndexMixins],
  props: {
    placeholder: String,
  },
  data() {
    return {
      text: "",
      form: {
        countryList: ["美国"],
        trade: [],
        cruTrade: "",
      },
      category: "",
      buttonId: null
    };
  },
  created() {
    // trademarkquery 页面，添加searchid
    if(this.$route.name==='trademarkquery') {
      this.buttonId = 'trademarkquery_button001'
    }
    if(this.$route.name==='classificationquery') {
      this.buttonId = 'classificationquery_button001'
    }
  },
  methods: {
    async handleSearch() {
      // 去掉空格
      const val = this.text.trim();
      if (val === "") {
        return this.$message.error("请输入要查询的关键字");
      } else {
        await this.handleSearchFree();
        const searchRegExp = /；/g;
        const replaceWith = ";";

        let searchValTemp = cloneDeep(this.text).replace(searchRegExp, replaceWith);
        this.form.trade = searchValTemp.split(";").filter((item) => item.trim());
        this.form.cruTrade = this.form.trade[0];
        Cookies.set("trade", searchValTemp);
        this.$emit("search", val);
      }
    },
    handleChange() {},
  },
};
</script>
<style lang="less" scoped>
.search-page {
  width: 840px;
  margin: 0 auto;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  line-height: 22px;
  .box-input {
    height: 60px;
    background: #ffffff;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;
    input {
      flex: 1;
      width: 0;
      height: 100%;
      font-size: 16px;
    }
    .search {
      width: 124px;
      height: 60px;
      background: #faad14;
      font-size: 20px;
      font-weight: 500;
      color: #ffffff;
      cursor: pointer;
    }
  }
  .tips {
    span {
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
</style>
