<template>
  <a-tabs :active-key="activeKey" class="index-tabs" @change="handleTabChange">
    <a-tab-pane :key="0" tab="限时秒杀" v-if="limitedShowList.length">
      <!-- 限时秒杀活动start -->
      <ActiveLimited :list="limitedShowList" :showProgress="showProgress" />
      <!-- 限时秒杀活动end -->
    </a-tab-pane>
    <a-tab-pane :key="1" tab="专享礼券" v-if="exclusiveList.length">
      <!-- 新人专享活动start -->
      <ActiveExclusive :list="exclusiveList" />
      <!-- 新人专享活动end -->
    </a-tab-pane>
    <a-tab-pane :key="2" tab="热门活动" v-if="hotActiveList.length">
      <!-- 热门活动start -->
      <ActiveHot :list="hotActiveList" />
      <!-- 热门活动end -->
    </a-tab-pane>
  </a-tabs>
</template>
<script>
import indexApi from "@/apis/indexApi";
import aboutAdvMix from "@/mixins/about-adv";
export default {
  name: "ActiveTab",
  mixins: [aboutAdvMix],
  data() {
    return {
      activeKey: 0,
    };
  },
  props: {
    // 限时秒杀
    limitedList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 新人专享
    exclusiveList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 热门活动
    hotActiveList: {
      type: Array,
      default() {
        return []
      }
    },
    showProgress:{
      type:String,
      default:''
    }
  },
  computed: {
    limitedShowList() {
      const { limitedList } = this;
      if (limitedList?.length) {
        limitedList[0]["activityProductList"].map((v) => {
          v.parentInfo = limitedList[0];
          return v;
        });
        return limitedList?.[0]?.["activityProductList"].slice(0, 4) || [];
      } else {
        return [];
      }
    },
  },
  mounted() {
    this.activeKey = [this.limitedList, this.exclusiveList, this.hotActiveList].findIndex((item) => item.length) || 0;
  },
  methods: {
    /**
     * tab 切换
     * @param key
     */
    handleTabChange(key) {
      this.activeKey = key;
    },
  },
};
</script>
<style lang="less" scoped>
.index-tabs {
  overflow: initial;
  margin-bottom: 80px;
  margin-top: 68px;
  /deep/ .ant-tabs-bar {
    border: 0;
    text-align: center;
    color: rgba(@textColor, 0.6);
    font-size: 28px;
    margin-bottom: 40px;
    font-weight: 400;
  }
  /deep/ .ant-tabs-nav .ant-tabs-tab {
    font-size: 28px;
    &:only-child {
      &:before {
        display: none;
      }
    }
    &-active {
      color: @textColor;
      position: relative;
      font-weight: 600;
      &:before {
        position: absolute;
        content: "";
        width: 80px;
        height: 4px;
        background: #3a7fff;
        border-radius: 4px 4px 4px 4px;
        bottom: 2px;
        top: inherit;
        left: 50%;
        border: 0;
        transform: translateX(-50%);
      }
    }
    &:hover {
      color: @textColor;
      font-weight: 600;
    }
  }
  /deep/ .ant-tabs-ink-bar {
    display: none !important;
  }
}
</style>
