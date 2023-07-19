<template>
  <a-affix :offset-top="isClassificationPage ? -200 : 112" class="affix">
  <div class="servicebox">
    <div class="searchbox ksy-pr flex flex-b">
      <a-select v-if="hasSelect" :value="category" style="width: 120px" @change="handleChange">
        <i slot="suffixIcon" type="smile" class="icon-down" style="font-size: 20px" />
        <a-select-option v-for="(val, vIndex) in typeCategory" :key="vIndex" :value="val">
          {{ val }}
        </a-select-option>
      </a-select>
      <a-select
        v-if="isFuzzyMatch"
        class="select"
        allowClear
        :placeholder="placeholder"
        v-model="searchVal"
        show-search
        :filter-option="false"
        :not-found-content="fuzzyMatchLoading ? undefined : null"
        :show-arrow="false"
        @search="handleFuzzyMatch"
        @change="val => searchVal = val"
        :getPopupContainer="node => node.parentNode"
      >
        <a-spin v-if="fuzzyMatchLoading" slot="notFoundContent" size="small" />
        <a-select-option
          v-for="(item, index) in fuzzyMatchList"
          :value="item.name"
          :key="index"
        >{{ item.name}}</a-select-option>              
      </a-select>
      <template v-else>
      <a-popover
        v-model="visible"
        :title="null"
        trigger="click"
        overlayClassName="service"
        placement="bottomLeft"
        :overlayStyle="{ 'z-index': 10 }"
      >
        <div v-if="isFuzzyMatch" slot="content" class="fuzzy-match">
          <a-spin :spinning="fuzzyMatchLoading">
            <ul>
              <li v-for="(item,index) in fuzzyMatchList" :key="index" @click="setSearchVal(item.name)">{{ item.name }}</li>
            </ul>
          </a-spin>
        </div>
        <div v-else slot="content" class="historybox">
          <div v-for="(item, index) in form.historyList" :key="index" @click="setSearchVal(item)">{{ item }}</div>
        </div>        
        <input
          type="text"
          :placeholder="placeholder"
          v-model="searchVal"
          class="input"
          ref="ipt"
          :maxLength="40"
          v-on:keyup.enter="goSearch"
        />
      </a-popover>
      </template>
      <button class="searchbtn" @click="handleSearch" data-sensors-click :id="buttonId">
        <i class="icon-search"></i>
        查一下
      </button>
    </div>
    <div class="tips-wrap">
      <div v-if="form.trade.length > 1" class="flex flex-b tips-mult">
        <span>商标</span>
        <ul class="flex flex1 flex-c">
          <li
            @click="handleMutlClick(index)"
            v-for="(item, index) in form.trade"
            :key="index"
            :class="{ active: multActive === index }"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div v-else class="tips-default">
        批量查询，请用分隔号 「;」分开。例如：<span
          v-for="(exp, eIndex) in exampleList"
          :key="eIndex"
          @click="exampleSearch(exp)"
          class="textPrimary"
          >{{ exp }}；</span
        >
      </div>
    </div>
  </div>
  </a-affix>
</template>

<script>
import Cookies from "js-cookie";
import { mapState } from "vuex";
import moment from "moment";
import { cloneDeep, debounce } from "lodash";

export default {  
  data() {
    this.handleFuzzyMatch = debounce(this.handleFuzzyMatch, 500);
    return {
      value: "US",
      showValue: "美国",
      searchVal: "",
      visible: false,
      visibleHistory: false,
      form: {
        countryList: ["美国"],
        historyList: [],
        trade: [],
        cruTrade: "",
      },
      multActive: 0,
      countryData: [
        { label: "美国", val: "US" },
        { label: "欧盟", val: "EU" },
        { label: "英国", val: "GB" },
        { label: "日本", val: "JP" },
      ],
      countryList: ["美国"], // 国家下拉勾选项
      // keywordArr: [], // ; 查分的查询关键词
      category: "",
    };
  },
  computed: {
    ...mapState({
      isLogined: (state) => state.isLogined,
      carNum: (state) => state.carNum,
      typeCategory: (state) => state.typeCategory,
      defaultLawyer: (state) => state.trademark.defaultLawyer,
      defaultOwner: (state) => state.trademark.defaultOwner,
      defaultBrandTarget: (state) => state.trademark.defaultBrandTarget,
      defaultBrandLike: (state) => state.trademark.defaultBrandLike,
    }),
    defaultTextMap() {
      return {
        "/fastResult/brandLike": this.defaultBrandLike,
        "/fastResult/brandTargeted": this.defaultBrandTarget,
        "/fastResult/brandLawyer": this.defaultLawyer,
        "/fastResult/brandPersonnel": this.defaultOwner,
      };
    },
    toastText() {
      let path = this.$route.path;
      const pathMap = {
        "/fastResult/brandLawyer": "请输入律师名称",
        "/fastResult/brandPersonnel": "请输入申请人名称",
      };
      if (pathMap[path]) {
        return pathMap[path];
      } else {
        return "请输入商标名称！";
      }
    },
    buttonId() {
      if (this.page == "index") {
        return "homepage_button001";
      } else if (this.page == "trademarkquery") {
        return "trademarksearch_button001";
      } else if (this.page == "search") {
        return "trademarksearchresult_button001";
      } else if (this.page == "brandLike") {
        return "trademarkquery_result_button001";
      } else if (this.page == "brandTargeted") {
        return "brandTargeted_result_button001";
      } else if (this.page == "brandLawyer") {
        return "brandLawyer_result_button001";
      } else if (this.page == "brandPersonnel") {
        return "brandPersonnel_result_button001";
      } else if (this.page == "classificationdetails") {
        return "classificationdetails_result_button001";
      } else {
        return "";
      }
    },
    outTrade() {
      return ["/fastResult/brandLawyer", "/fastResult/brandPersonnel"];
    },
    path() {
      return this.$route.path;
    },
    // 是否是分类页，顶部固钉处理方式不同
    isClassificationPage() {
      return this.$route.path === '/classificationdetails'
    }
  },
  props: {
    exampleList: {
      type: Array,
      default: () => ["iipto", "kuabiaoyun"],
    },
    searchText: {
      type: String,
      default: "",
    },
    // 组件在首页，页面调跳转，组件在search页，直接搜索
    page: {
      type: String,
      default: "",
    },
    // 深度查询状态
    depthStatus: {
      type: Boolean,
    },
    hasSelect: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请输入商标名/申请号/受理号查询",
    },
    // 是否支持模糊匹配
    isFuzzyMatch:{
      type: Boolean,
      default: false,
    },
    // 模糊匹配列表
    fuzzyMatchList:{
      type: Array,
      default: () => [],
    },
    fuzzyMatchLoading: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (this.outTrade.includes(this.path)) {
      Cookies.remove("trade");
    }
    const token = Cookies.get("token");
    const sid = Cookies.get("sessionId");
    if (token && sid) {
      this.isLogin = true;
    }
    this.countryList = Cookies.get("countryList") ? Cookies.get("countryList").split(",") : ["美国"];
    this.showValue = this.countryList[0];
    if (this.$route.query.name) {
      this.searchVal = this.$route.query.name;
    } else {
      // 近似 精准
      if (!this.outTrade.includes(this.path)) {
        this.searchVal = Cookies.get("trade") || "";
      }
      this.searchVal = Cookies.get("trade") || this.defaultTextMap?.[this.path]?.[0] || "";
    }
    if (this.searchVal.trim() !== "") {
      this.goSearch();
    }
    if (this.hasSelect) {
      this.category = Cookies.get("categoryType") || "查商标";
    }
  },
  destroyed() {},
  watch: {
    fuzzyMatchList:{
      handler(val){
        if(val.length){
          this.visible = true
        }
      },
      deep: true
    },
    "$store.state.isLogined":{
      handler(val){
        if(val){
          this.goSearch();
        }
      }
    }
  },
  methods: {
    handleSearch() {
      this.$emit("btnClick", true);
      this.goSearch();
    },
    handleChange(e) {
      this.category = e;
      this.$bus.$emit("changeType", this.category);
    },
    handleMutlClick(index) {
      this.multActive = index;
      this.handleSearch();
    },
    exampleSearch(val) {
      this.searchVal = val;
      this.handleSearch();
    },
    goSearch() {
      let isLogin = false;
      let token = Cookies.get("token");
      let sid = Cookies.get("sessionId");
      if (token && sid) {
        isLogin = true;
      }
      if (this.searchVal.trim() === "") {
        this.$message.warning(this.toastText);
        this.inputFocus();
        return;
      }
      const searchRegExp = /；/g;
      const replaceWith = ";";

      let searchValTemp = cloneDeep(this.searchVal).replace(searchRegExp, replaceWith);
      let historyList = searchValTemp
        .split(";")
        .concat(this.form.historyList)
        .filter((v) => v)
        .slice(0, 10);
      this.form.historyList = historyList;
      this.form.trade = searchValTemp.split(";").filter((item) => item.trim());
      this.form.cruTrade = this.form.trade[this.multActive];
      let data = { ...this.form };
      if (!isLogin) {
        if (localStorage.searchTime) {
          if (moment(new Date()) - moment(localStorage.searchTime) > 86400000) {
            localStorage.searchTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            localStorage.searchSum = 1;
            this.$emit("goSearch", data);
          } else {
            if (localStorage.searchSum < 3) {
              localStorage.searchSum = 1 + parseInt(localStorage.searchSum);
              this.$emit("goSearch", data);
            } else {
              // 温馨提示，取消时，移除搜索cookie值
              Cookies.remove("countryList");
              Cookies.remove("trade");
              Cookies.remove("category");
              this.$store.commit("setLoginPopData", { show: true });
              this.$nextTick(() => {
                this.$bus.$emit("loginVisiable", { type: 4 });
              });
            }
          }
        } else {
          localStorage.searchTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          localStorage.searchSum = 1;
          this.$emit("goSearch", data);
        }
      } else {
        console.log("这里得存入trade", searchValTemp);
        if (!this.outTrade.includes(this.path)) {
          //Cookies.set("trade", searchValTemp);
        }
        this.$emit("goSearch", data);
      }
    },
    setSearchVal(val) {
      this.searchVal = val;
      this.visible = false;
    },
    setValue(val, showVal) {
      console.log(val, showVal, this.$data.countryList.includes(showVal));
      this.$data.value = val;
      this.$data.showValue = showVal;
      this.$data.countryList.includes(showVal)
        ? this.countryList.length === 1
          ? ""
          : console.log(this.removeValue(this.$data.countryList, showVal))
        : this.$data.countryList.push(showVal);
    },
    removeValue(arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          arr.splice(i, 1);
          break;
        }
      }
      return arr;
    },
    // 输入框聚焦
    inputFocus() {
      this.$refs.ipt.focus();
    },
    handleFuzzyMatch(val){
      this.$emit('getFuzzyMatchList',val)      
    }
  },
};
</script>

<style lang="less" scoped>
.ant-select {
  i {
    margin-top: -4px;
  }
  &-open {
    i {
      transform: rotate(180deg);
    }
  }
}
.my-popover {
  z-index: 10;
}
.service {
  z-index: 10;
}

.servicebox {
  background: #f5f5f5;
  padding: 24px 0 20px;
  .searchbox {
    border-radius: 1px;
    opacity: 1;
    border: 1px solid #faad14;
    width: 600px;
    height: 48px;
    line-height: 48px;
    background: #fff;
    .select{
      width: 460px;
    }
    .tit {
      font-size: 16px;
      padding: 8px 24px;
      padding-right: 10px;
    }
    .labelwidth {
      width: 71px;
      display: inline-block;
    }
  }
  .line {
    height: 24px;
    width: 1px;
    background: #ececec;
    position: absolute;
    top: 7px;
    left: 136px;
  }
  .input {
    // min-width: 810px;
    text-indent: 10px;
    width: calc(100% - 130px);
    height: 100%;
    background: none;
    border: none;
    font-size: 16px;
    font-weight: 500;
    box-sizing: border-box;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
    box-shadow: 0px 3px 12px 0px rgb(5 54 165 / 10%);
    border-radius: 5px;
    // padding-left: 10px;
  }
  .input::placeholder {
    font-size: 16px;
    font-family: PingFang SC-Regular, PingFang SC;
    color: @textColor6;
    font-weight: normal;
    color: #bfbfbf;
  }
  .searchbtn {
    position: absolute;
    right: -1px;
    line-height: 39px;
    width: 129px;
    height: 100%;
    background: #faad14;
    border-radius: 1px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    top: 0;
    border: none;
    color: #fff;
    border-radius: 1px;
  }
  .searchbtn:disabled {
    background: #ddd;
    cursor: not-allowed;
  }
  .textPrimary {
    color: @primaryColor;
    cursor: pointer;
  }
  .tips {
    &-wrap {
      margin-top: 4px;
    }
    &-mult {
      font-size: 12px;
      color: #919498;
      line-height: 20px;
      align-items: flex-start;
      padding: 8px 24px;
      font-size: 14px;
      color: #919498;
      line-height: 22px;
      background: #fff;
      > span {
        width: 56px;
      }
      ul {
        width: 0;
        margin: 0;
        flex-wrap: wrap;
        padding-left: 8px;
        li {
          margin-left: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 26px;
          font-size: 14px;
          color: #606266;
          padding: 0 12px;
          cursor: pointer;
          &.active {
            color: @primaryColor;
            background: #e3f1ff;
          }
        }
      }
    }
  }
  /deep/ .ant-select-focused .ant-select-selection,
  /deep/ .ant-select-selection:focus,
  /deep/ .ant-select-selection:hover,
  /deep/ .ant-select-selection:active {
    border: none;
    box-shadow: none;
  }
  /deep/ .ant-select-selection--single {
    height: 46px;
    border: 0;
    font-size: 16px;
    color: #606266;
  }
  /deep/ .ant-select-selection__rendered {
    line-height: 46px;
  }
}

.trademark-query-center {
  .servicebox {
    .searchbox {
      width: 1080px;
      height: 56px;
      line-height: 56px;
      margin: 0 auto;
      .line {
        top: 11px;
        height: 34px;
      }
    }
    .searchbtn {
      height: 55px;
      line-height: 55px;
    }
  }
}
</style>

<style lang="less">
.affix{
  position: relative;
  z-index: 5;
  margin-bottom: 0 !important;
}
.servicepop {
  .ant-select-selection {
    border: none;
    background: none;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-58%);
      width: 1px;
      height: 32px;
      background: #333333;
      opacity: 0.1;
    }
  }
  .ant-select-selection:active {
    box-shadow: none;
  }
  .ant-select-open .ant-select-selection {
    box-shadow: none;
  }
  .ant-select-focused .ant-select-selection,
  .ant-select-selection:focus,
  .ant-select-selection:active {
    box-shadow: none;
  }
  .ant-select-selection-selected-value {
    font-size: 20px;
    font-weight: 500;
    color: @textColor;
  }
  .ant-select-selection__rendered {
    margin-left: 23px;
  }
  .ant-select-arrow {
    right: 21px;
  }

  .ant-popover-inner-content {
    padding: 0px;
  }
  .ant-popover-arrow {
    display: none;
  }

  .tit {
    font-size: 16px;
    color: @textColor;
    width: 156px;
    display: inline-block;
    padding-left: 24px;
    .icon {
      font-size: 12px;
      color: #00000042;
    }
    .border {
      width: 1px;
      height: 32px;
      background: #333333;
      border-radius: 0px 0px 0px 0px;
      opacity: 0.1;
      // display: inline-block;
      top: 10px;
      right: 1px;
    }
  }
}
.popo {
  padding-top: 5px;
}
.search-login-tips {
  .ant-modal-wrap .anticon-question-circle {
    display: none;
  }
  .ant-modal-confirm-content,
  .ant-modal-confirm-title {
    margin-left: 0 !important;
    text-align: center;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
  }
  .ant-modal-confirm-title {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 24px;
  }
  .ant-modal-confirm-btns {
    width: 100%;
    text-align: center;
  }
  .ant-btn-primary {
    margin-left: 24px !important;
  }
}
</style>
<style lang="less">
.popbox2 {
  .country {
    width: 150px;
    height: 34px;
    line-height: 34px;
    background: #ffffff;
    // border-radius: 2px 2px 2px 2px;
    opacity: 1;
    font-size: 14px;
    color: @textColor;
    padding-left: 16px;
    cursor: pointer;
  }
  .country:hover {
    background: #f5f7fa;
    font-size: 14px;
    font-weight: 400;
    color: @textColor;
  }
  .country.cur {
    background: #f5f7fa;
    font-weight: 400;
    color: @textColor;
  }
  .sure {
    width: 150px;
    height: 34px;
    line-height: 34px;
    background: #ffffff;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    border-top: 1px solid #e3e3e3;
    color: @textColor;
    text-align: right;
    padding-right: 16px;
  }
}
.historybox {
  div {
    width: 470px;
    height: 34px;
    line-height: 34px;
    background: #ffffff;
    border-radius: 2px 2px 2px 2px;
    opacity: 1;
    font-size: 14px;
    color: @textColor6;
    padding-left: 24px;
    cursor: pointer;
  }
  div:hover {
    background: #f5f8ffff;
    color: #3370ffff;
  }
  div.cur {
    background: #3370ffff;
    color: #ffffff;
  }
}
.fuzzy-match{
  ul {
    width: 470px;
    padding: 10px;
    max-height: 200px;
    overflow-y: auto;
    li{
      height: 28px;
      line-height: 28px;
      cursor: pointer;
    }
  }
}
</style>
