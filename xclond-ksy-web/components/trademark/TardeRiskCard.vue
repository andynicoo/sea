<template>
  <div class="riskcard">
    <div class="card">
      <div class="tradecards" v-if="collectParams.trademarkName">
        <div :class="collectParams.trademarkLogInfo" class="tradecards-card">
          <div class="text-box">
            <span>{{ collectParams.trademarkName }}</span>
          </div>
          <div class="sw-mask"></div>
          <Collect :status="+collectParams.isFavourite" size="big">收藏</Collect>
        </div>
      </div>
      <p class="size20 color9 ksy-text-center ellipsis" style="line-height: 42px; margin: 8px 0 12px">
        {{ collectParams.trademarkName }}
      </p>
      <a-button
        type="primary"
        class="btns prebtn"
        v-login="goExpert"
        data-sensors-click
        id="trademarknamed_button002"
        style="margin-bottom: 12px"
        >专家取名</a-button
      >
      <a-button @click="toSearch(collectParams.trademarkName)" class="btns borderbtn">查看近似商标</a-button>
    </div>
    <div class="class advise">
      <h2 class="color9 size14" style="margin-bottom: 12px">
        美国注册风险图
        <a-popover :title="null">
          <template slot="content">
            <UsaRiskTip />
          </template>
          <a-icon type="question-circle" class="ksy-ml-1" style="color: #0000004a; cursor: pointer" />
        </a-popover>
      </h2>
      <div class="risktips" v-if="adviseList?.level1?.length">
        <span class="yuan yuan1"></span>
        <span class="tip1">低风险</span>
      </div>
      <div class="tabsbox level1" v-if="adviseList?.level1?.length">
        <span
          v-for="tag in adviseList.level1"
          :key="tag.id"
          class="tabsbox-item"
          :class="{ active: curAdviseList.includes(tag.categoryName) }"
        >
          {{ tag.categorySort | formNum }} {{ tag.categoryName }}
        </span>
      </div>
      <div class="risktips" v-if="adviseList?.level2?.length">
        <span class="yuan yuan2"></span>
        <span class="tip1">中风险</span>
      </div>
      <div class="tabsbox level2" v-if="adviseList?.level2?.length">
        <span
          v-for="tag in adviseList.level2"
          :key="tag.id"
          class="tabsbox-item"
          :class="{ active: curAdviseList.includes(tag.categoryName) }"
        >
          {{ tag.categorySort | formNum }} {{ tag.categoryName }}
        </span>
      </div>
      <div class="risktips" v-if="adviseList?.level3?.length">
        <span class="yuan yuan3"></span>
        <span class="tip1">高风险</span>
      </div>
      <div class="tabsbox level3" v-if="adviseList?.level3?.length">
        <span
          v-for="tag in adviseList.level3"
          :key="tag.id"
          class="tabsbox-item"
          :class="{ active: curAdviseList.includes(tag.categoryName) }"
        >
          {{ tag.categorySort | formNum }} {{ tag.categoryName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import trademark from "@/apis/trademark";
import { mapState } from "vuex";

export default {
  data() {
    return {
      adviseList: {
        level1: [],
        level2: [],
        level3: [],
      },
      curAdviseList: [],
      status: 0,
    };
  },
  props: {
    inputName: {
      default: "",
      type: String,
    },
  },
  computed: {
    ...mapState(["collectParams", "isLogined"]),
  },
  filters: {
    formNum(value) {
      let num = Number(value);
      return num > 9 ? num : "0" + value;
    },
  },
  watch: {
    "collectParams.trademarkName": {
      handler() {
        this.getAdviseList();
      },
    },
  },
  mounted() {
    this.getAdviseList();
    this.$bus.$on("sendSelectClass", (data) => {
      let { classData } = data;
      this.curAdviseList = classData;
    });
  },
  destroyed() {
    this.$bus.$off("sendSelectClass");
  },
  methods: {
    toSearch(val) {
      Cookies.set("trade", val);
      this.$router.push("/fastResult/brandLike");
    },
    // 根据搜索值查询建议列表 []  分类
    async getAdviseList() {
      let params = {
        countryCode: "US",
        text: this.collectParams.trademarkName,
      };
      let res = await this.$axiosApi(trademark.trademarkAdvise.url, trademark.trademarkAdvise.methods, params, true);
      let { data } = res;
      if (data.length) {
        //low   medium  high
        this.adviseList.level1 = data.filter((item) => item.riskScore === "low");
        this.adviseList.level2 = data.filter((item) => item.riskScore === "medium");
        this.adviseList.level3 = data.filter((item) => item.riskScore === "high");
      }
    },
    goExpert() {
      this.$bus.$emit("changeExpertslVer", { show: true });
    },
  },
};
</script>

<style lang="less" scoped>
.riskcard {
  min-height: 400px;
  background: #ffffff;
  border-radius: 2px;
  opacity: 1;
  padding: 24px;
  padding-right: 23px;
  display: flex;
  margin-bottom: 44px;
  .card {
    width: 253px;
    height: 352px;
    background: url("~@/assets/images/bg-card-01.png") no-repeat left top / cover;
    border-radius: 2px;
    opacity: 1;
    margin-right: 20px;
    padding: 24px 29px;
    .btns {
      width: 195px;
      height: 44px;
    }
  }
  .class {
    width: 100%;
  }
}
.risktips {
  margin-bottom: 12px;
  line-height: 22px;
  .yuan {
    width: 8px;
    height: 8px;
    display: inline-block;
    border-radius: 50%;
    margin-right: 3px;
  }
  .yuan1 {
    background: #00a870;
  }
  .yuan2 {
    background: #ffaa0b;
  }
  .yuan3 {
    background: #e34d59;
  }
}
.tabsbox {
  color: rgba(0, 0, 0, 0.4);
  margin-bottom: 8px;
  font-size: 0;
  &-item {
    display: inline-block;
    width: 96px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    line-height: 26px;
    margin-bottom: 8px;
    margin-right: 16px;
    background: #fafafa;
    font-size: 14px;
    &:nth-child(8n) {
      margin-right: 0;
    }
  }
  &.level1 {
    .active {
      color: #00a870;
    }
  }
  &.level2 {
    .active {
      color: #ffaa0b;
    }
  }
  &.level3 {
    .active {
      color: #e34d59;
    }
  }
}
.tradecards {
  &-card {
    position: relative;
    height: 140px;
    border-radius: 4px;
    text-align: center;
    font-size: 20px;
    word-break: break-all;
    padding: 0 4px;
    .text-box {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      > span {
        .line-clamp(3);
      }
    }
    .sw-mask {
      display: none;
      position: absolute;
      width: 100%;
      height: 30px;
      bottom: 0;
      left: 0;
      z-index: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);
      opacity: 0.2;
    }
    &:hover {
      .sw-mask {
        display: block;
      }
      .collect {
        display: block;
      }
    }
  }
}
</style>
