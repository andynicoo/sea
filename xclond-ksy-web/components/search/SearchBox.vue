<template>
  <div class="servicebox">
    <div class="searchbox ksy-pr">
      <a-popover
        v-if="false"
        v-model="visible"
        :title="null"
        trigger="click"
        overlayClassName="servicepop popo"
        placement="bottom"
      >
        <div slot="content" class="popbox2" v-if="isShow">
          <div
            class="country"
            :class="{ cur: countryList.includes(item.label) }"
            v-for="item in countryData"
            :key="item.val"
            @click="setValue(item.val, item.label)"
          >
            <a-checkbox :checked="countryList.includes(item.label)"> </a-checkbox>
            {{ item.label }}
          </div>
        </div>
        <span class="tit ksy-pr">
          <span class="ksy-pr-1 hand labelwidth">
            <template v-if="countryList.length === 1">
              {{ countryList[0] }}
            </template>
            <template v-else> 已选{{ countryList.length }}国 </template>
          </span>
          <img src="~/assets/images/searchupB.svg" v-if="visible" />
          <img src="~/assets/images/searchdownB.svg" v-else />
          <span class="border ksy-pa"></span>
        </span>
      </a-popover>
      <span class="line" v-if="false"></span>
      <a-popover
        v-model="visibleHistory"
        :title="null"
        trigger="click"
        overlayClassName="service"
        placement="bottomLeft"
      >
        <div slot="content" class="historybox">
          <div v-for="(item, index) in historyList" :key="index" @click="setSearchVal(item)">{{ item }}</div>
        </div>
        <input
          type="text"
          placeholder="请输入要查询的美国商标名称，多个用分号隔开，如: iipto; kuabiaoyun"
          v-model="searchVal"
          class="input"
          ref="ipt"
          :maxLength="40"
          v-on:keyup.enter="goSearch"
        />
      </a-popover>
      <button class="searchbtn" @click="goSearch" data-sensors-click :id="buttonId">
        <img src="~/assets/images/searchicon.svg" class="ksy-pr-1" />
        免费查询
      </button>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapState } from "vuex";
import moment from "moment";
import { cloneDeep } from "lodash";

export default {
  data() {
    return {
      value: "US",
      showValue: "美国",
      searchVal: "",
      visible: false,
      visibleHistory: false,
      historyList: [],
      countryData: [
        { label: "美国", val: "US" },
        { label: "欧盟", val: "EU" },
        { label: "英国", val: "GB" },
        { label: "日本", val: "JP" },
      ],
      countryList: ["美国"], // 国家下拉勾选项
      isShow: false,
      // keywordArr: [], // ; 查分的查询关键词
    };
  },
  computed: {
    ...mapState({
      isLogined: (state) => state.isLogined,
      carNum: (state) => state.carNum,
    }),
    buttonId() {
      if (this.page == "index") {
        return "homepage_button001";
      } else if (this.page == "trademarkquery") {
        return "trademarksearch_button001";
      } else if (this.page == "search") {
        return "trademarksearchresult_button001";
      } else {
        return "";
      }
    },
  },
  props: {
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
  },
  mounted() {
    // console.log(Cookies.get("countryList").split(","), Cookies.get("trade").split(";"));
    this.countryList = Cookies.get("countryList") ? Cookies.get("countryList").split(",") : ["美国"];
    this.showValue = this.countryList[0];
    this.searchVal = Cookies.get("trade") ? Cookies.get("trade") : "";
    this.isShow = true;
    if (this.searchVal !== "") {
      //this.goSearch();
    }
  },

  destroyed() {},
  methods: {
    goSearch() {
      let isLogin = false;
      let token = Cookies.get("token");
      let sid = Cookies.get("sessionId");
      if (token && sid) {
        isLogin = true;
      }
      if (this.searchVal === "") {
        this.$message.warning("请输入商标名称！");
        this.inputFocus();
        return;
      }
      const searchRegExp = /；/g;
      const replaceWith = ";";
      let searchValTemp = cloneDeep(this.searchVal).replace(searchRegExp, replaceWith);
      this.historyList = this.historyList.concat(searchValTemp.split(";")).reverse().slice(0, 6);
      let data = {
        keywords: this.countryList,
        trade: searchValTemp,
      };
      if (["index", "trademarkquery"].includes(this.page)) {
        Cookies.set("countryList", this.countryList);
        Cookies.set("trade", searchValTemp);
        if (data.trade) {
          this.$emit("goSearch", data);
        }
      } else {
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
          this.$emit("goSearch", data);
        }
      }
    },
    setSearchVal(val) {
      this.searchVal = val;
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
  },
};
</script>

<style lang="less" scoped>
.servicebox {
  .searchbox {
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    border: 1px solid @primaryColor;
    width: 785px;
    height: 40px;
    line-height: 40px;
    background: #fff;

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
    width: calc(100% - 300px);
    height: 40px;
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
    color: @textColor4;
    font-weight: normal;
  }

  .searchbtn {
    position: absolute;
    right: -1px;
    line-height: 39px;
    width: 129px;
    height: 39px;
    background: #3370ff;
    border-radius: 4px 4px 4px 4px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    top: 0;
    border: none;
    color: #fff;
    border-radius: 4px;
  }

  .searchbtn:disabled {
    background: #ddd;
    cursor: not-allowed;
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
</style>
