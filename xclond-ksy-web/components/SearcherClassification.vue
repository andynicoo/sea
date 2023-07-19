<template>
  <div class="service" :class="{ 'searchbox-min': isMin }">
    <div id="searchboxId" class="searchbox ksy-pr">
      <a-popover v-model="visible" :title="null" trigger="click" overlayClassName="service popo" placement="bottom"
        :getPopupContainer="getDom">
        <div slot="content" class="popbox" v-if="isCountry">
          <div :class="{ cur: value === 'US' }" @click="setValue('US', '美国')">美国</div>
          <div :class="{ cur: value === 'EU' }" @click="setValue('EU', '欧盟')">欧盟</div>
          <div :class="{ cur: value === 'GB' }" @click="setValue('GB', '英国')">英国</div>
          <div :class="{ cur: value === 'JP' }" @click="setValue('JP', '日本')">日本</div>
        </div>
        <span class="tit ksy-pr">
          <span class="ksy-pr-1 hand labelwidth">
            {{ showValue }}
          </span>
          <img src="~/assets/images/searchupB.svg" v-if="visible" />
          <img src="~/assets/images/searchdownB.svg" v-else />

          <span class="border ksy-pa"></span>
        </span>
      </a-popover>
      <input ref="searchInput" type="text" placeholder="请输入商品/服务名称查询" v-model="searchVal" class="input" maxlength="40"
        @focus="isShow = true" @blur="searchBlur" v-on:keyup.enter="goSearch" />
      <ul class="recent-queries" v-if="isShow && recentQueries.length">
        <li v-for="(item, index) in recentQueries" :key="index" @click="recentQueriesHandle(item)">{{ item }}</li>
      </ul>
      <button class="searchbtn" @click="goSearch">
        <img src="~/assets/images/searchicon.svg" class="ksy-pr-1" />免费查询
      </button>
    </div>
    <div class="other-tools">其它工具：<span @click="$router.push('/trademarkquery')">商标查询</span></div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapState } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      value: "US",
      showValue: "美国",
      searchVal: "",
      visible: false,
      isLogin: false,
      recentQueries: [],
      isShow: false,
      isCountry: false
    };
  },
  computed: {
    ...mapState({
      isLogined: (state) => state.isLogined,
      carNum: (state) => state.carNum,
    }),
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
    isMin: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    searchVal: {
      handler(newVal, oldVal) {
        this.setSearchVal();
      },
    },
    "$store.state.historySearchText": {
      handler(newVal) {
        this.recentQueries = newVal;
      },
    },
  },
  mounted() {
    let searchtext = Cookies.get("searchtext");
    let searchvalue = Cookies.get("searchvalue");
    let showValue = Cookies.get("showValue");
    this.isCountry = true
    if (searchtext) {
      this.searchVal = searchtext;
      this.value = searchvalue;
      this.showValue = showValue;
      // Cookies.remove("searchtext");
      // Cookies.remove("searchvalue");
      // Cookies.remove("showValue");
    } else {
      this.searchVal = this.searchText;
    }
  },
  destroyed() {
  },
  methods: {
    goSearch() {
      let isLogin = false
      let token = Cookies.get("token");
      let sid = Cookies.get("sessionId");
      if (token && sid) {
        isLogin = true;
      }
      if (!this.searchVal) {
        this.$refs.searchInput.focus();
        return this.$message.warning("请输入查询内容！");
      }
      if (!isLogin) {
        if (localStorage.searchTime) {
          if (moment(new Date()) - moment(localStorage.searchTime) > 86400000) {
            localStorage.searchTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            localStorage.searchSum = 1;
          } else {
            if (localStorage.searchSum < 3) {
              localStorage.searchSum = 1 + parseInt(localStorage.searchSum);
              this.goSearchHandle();
            } else {
              this.$store.commit("setLoginPopData", { show: true });
              this.$nextTick(() => {
                this.$bus.$emit("loginVisiable", { type: 4 });
              })
            }
          }
        } else {
          localStorage.searchTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          localStorage.searchSum = 1;
          this.goSearchHandle();
        }
      } else {
        this.goSearchHandle();
      }
    },
    goSearchHandle() {
      if (this.page === "classificationquery") {
        Cookies.set("searchtext", this.searchVal);
        Cookies.set("searchvalue", this.value);
        Cookies.set("showValue", this.showValue);
        this.$router.push("/classificationdetails");
      } else {
        this.$emit("goSearch");
      }
    },
    setSearchVal() {
      this.$emit("setSearchVal", {
        searchText: this.searchVal,
        countryCode: this.value,
      });
    },
    setValue(val, showVal) {
      this.$data.value = val;
      this.$data.showValue = showVal;
      this.$data.visible = false;

      this.setSearchVal();
    },
    //获取dom
    getDom() {
      return document.getElementById("searchboxId");
    },
    //失去焦点
    searchBlur() {
      if (this.isShow) {
        setTimeout(() => {
          this.isShow = false;
        }, 100);
      }
    },
    //选中最近数据
    recentQueriesHandle(text) {
      console.log(text, "text");
      this.searchVal = text;
    },
  },
};
</script>

<style lang="less" scoped>
.service {
  height: 122px;
  // background: rgba(255, 255, 255, 0.7);
  // box-shadow: 0px 4px 26px 0px rgba(105, 105, 105, 0.07);
  // backdrop-filter: blur(15px);

  padding: 0px 60px;
  border-radius: 4px;
  position: relative;

  .searchbox {
    position: relative;
    height: 56px;
    line-height: 56px;
    border-radius: 4px 4px 4px 4px;
    opacity: 1;
    border: 1px solid @primaryColor;
    background: #fff;
  }

  .labelwidth {
    width: 71px;
    display: inline-block;
  }

  .input {
    // min-width: 810px;
    text-indent: 10px;
    width: calc(100% - 300px);
    height: 48px;
    background: none;
    border: none;
    font-size: 16px;
    font-weight: 500;
    box-sizing: border-box;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
    box-shadow: 0px 3px 12px 0px rgb(5 54 165 / 10%);
    border-radius: 5px;
    padding-left: 10px;
  }

  .input::placeholder {
    font-size: 16px;
    font-family: PingFang SC-Regular, PingFang SC;
    color: @textColor6;
    font-weight: normal;
  }

  .searchbtn {
    position: absolute;
    right: 0px;
    padding: 0 20px;
    height: 55px;
    line-height: 55px;
    background: #3370ff;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    top: 0;
    border: none;
    color: #fff;
    border-radius: 2px;
  }

  .searchbtn:disabled {
    background: #ddd;
    cursor: not-allowed;
  }
}

.recent-queries {
  position: absolute;
  top: 57px;
  left: 154px;
  width: 465px;
  background: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
  border-radius: 4px;
  z-index: 2;

  li {
    height: 34px;
    line-height: 34px;
    padding: 0 24px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.6);

    &:hover {
      background: #f5f7fa;
      color: #3370ff;
    }
  }
}

.searchbox-min {
  margin-top: 24px;
  padding: 0;
  height: 60px;

  .searchbox {
    height: 40px;
    line-height: 40px;
    width: 700px;
  }

  .labelwidth {
    width: auto;
  }

  .tit {
    font-size: 16px;
    width: 108px;

    .border {
      top: 7px;
      height: 24px;
    }
  }

  .searchbtn {
    height: 39px;
    line-height: 39px;
  }

  .input {
    height: 39px;
  }

  .recent-queries {
    top: 40px;
    left: 106px;
  }

  .other-tools {
    display: none;
  }
}
</style>

<style lang="less">
.service {
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
    color: rgba(0, 0, 0, 0.6);
    width: 138px;
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

.other-tools {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
  position: relative;
  width: 1080px;
  margin: 16px auto 0;

  span {
    color: rgba(0, 0, 0, 0.6);
    cursor: pointer;

    &:hover {
      color: #3370ff;
    }
  }
}
</style>
<style lang="less">
.popbox {
  div {
    width: 157px;
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

.searchbox-min {
  .popbox {
    div {
      width: 108px;
    }
  }
}
</style>
