<template>
  <div class="servicebox">
    <div class="types">
      <div class="type" :class="{ cur: type === 1 }" @click="type = 1">商标取名</div>
      <div class="type" :class="{ cur: type === 2 }" @click="type = 2">商标名调整</div>
    </div>
    <div class="searchbox ksy-pr" :style="boxStyle">
      <input
        type="text"
        :placeholder="type == 1 ? '请输入原有商标名' : '请输入与您创意或业务相关的关键词'"
        v-model="searchVal"
        class="input"
        ref="ipt"
        :maxLength="30"
        @keyup.enter="goSearch"
      />
      <button class="searchbtn" @click="goSearch" data-sensors-click id="trademarkname_button001">
        <i class="icon-search"></i>
        免费取名
      </button>
    </div>
    <div class="other">
      其他工具:
      <nuxt-link to="/classificationquery"> 查分类 </nuxt-link>
      <nuxt-link to="/trademarkquery"> 查商标 </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import IndexMixins from "@/mixins";

export default {
  mixins: [IndexMixins],
  data() {
    return {
      type: 1,
      searchVal: "",
    };
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth,
    }),
    boxStyle() {
      return {
        "border-radius": this.type == 1 ? "0 4px 4px 4px" : "4px",
      };
    },
  },
  props: {
    searchText: {
      type: String,
      default: "",
    },
  },
  mounted() {},
  methods: {
    async goSearch() {
      if (this.searchVal === "") {
        this.$message.warning("请输入商标名称！");
        this.inputFocus();
        return;
      }
      await this.searchTest(this.searchVal);
      if (this.type === 1) {
        this.$bus.$emit("changeNamePre", { show: true, name: this.searchVal });
      } else {
        this.$bus.$emit("changeAdjustStyle", { show: true, name: this.searchVal });
      }
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
  padding: 0px 45px;

  .searchbox {
    border-radius: 0px 4px 4px 4px;
    opacity: 1;
    height: 56px;
    line-height: 56px;
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

  .input {
    // min-width: 810px;
    text-indent: 10px;
    width: calc(100% - 128px);
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
    color: @textColor6;
    font-weight: normal;
  }

  .searchbtn {
    position: absolute;
    right: -1px;
    line-height: 54px;
    width: 129px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #faad14;
    border-radius: 4px 4px 4px 4px;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    top: 0;
    border: none;
    color: #fff;
    border-radius: 4px;
    i {
      margin-right: 6px;
      font-size: 22px;
    }
  }

  .searchbtn:disabled {
    background: #ddd;
    cursor: not-allowed;
  }

  .types {
    font-size: 0;

    .type {
      width: 112px;
      font-size: 16px;
      display: inline-block;
      height: 38px;
      line-height: 38px;
      color: #ffffff;
      text-align: center;
      cursor: pointer;

      &:hover {
        color: #ffffff;
      }
    }

    .cur {
      background: #d9e4ff;
      border-radius: 4px 4px 0px 0px;
      color: @primaryColor;

      &:hover {
        color: @primaryHover;
      }
    }
  }

  .other {
    color: #fff;
    height: 36px;
    line-height: 36px;
    margin-top: 5px;

    a {
      color: #fff;
      margin-left: 15px;

      &:hover {
        color: #fff !important;
      }
    }
  }
}
</style>
