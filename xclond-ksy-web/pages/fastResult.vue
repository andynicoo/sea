<template>
  <div class="fast-page">
    <div class="fast-nav">
      <div class="container">
        <nuxt-link
          v-for="(item, index) in nav"
          :key="index"
          :class="{ active: route && route == item.path }"
          :to="item.path"
          :id="item.id"
          >{{ item.name }}<i v-if="item.icon" :class="item.icon"></i
        ></nuxt-link>
        <a :href="item.path" target="_blank" v-for="(item, index) in blankNav" :key="index" :id="item.id">
          {{ item.name }}<i v-if="item.icon" :class="item.icon"></i>
        </a>
      </div>
    </div>
    <nuxt-child />
  </div>
</template>
<script>
export default {
  data() {
    return {
      nav: [
        {
          name: "近似商标",
          path: "/fastResult/brandLike",
          id: "quick_query_button001",
        },
        {
          name: "精准商标",
          path: "/fastResult/brandTargeted",
          id: "quick_query_button002",
        },
        {
          name: "查律师代理商标",
          path: "/fastResult/brandLawyer",
          id: "quick_query_button003",
        },
        {
          name: "查申请人持有商标",
          path: "/fastResult/brandPersonnel",
          id: "quick_query_button004",
        },
      ],
      blankNav: [{
          name: "商标分类",
          path: "/classificationdetails",
          icon: "icon-jump",
          id: "quick_query_button005",
        },
        {
          name: "风险报告",
          path: "/riskReport",
          icon: "icon-jump",
          id: "quick_query_button006",
        },
      ],
    };
  },
  computed: {
    route() {
      return this.$route.path;
    },
  },
};
</script>
<style lang="less" scoped>
.fast-page {
  background: #f5f5f5;
  position: relative;
  padding-top: 112px;
  .fast-nav {
    position: fixed;
    top: 64px;
    width: 100%;
    height: 48px;
    z-index: 100;
    background: @primaryColor;
    .container {
      display: flex;
      height: 100%;
      width: 1200px;
      margin: 0 auto;
      a {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        color: #ffffff;
        font-size: 14px;
        margin-right: 80px;
        &:last-child {
          margin-right: 0;
        }
        &:hover,
        &.active {
          font-weight: 500;
          color: #ffffff !important;
          &::after {
            content: "";
            position: absolute;
            left: 50%;
            bottom: 8px;
            margin-left: -12px;
            width: 24px;
            height: 2px;
            background: #ffffff;
            border-radius: 10px;
          }
        }
        &.active {
          font-size: 16px;
        }
        &:first-child {
          &::before {
            content: "";
            position: absolute;
            top: 3px;
            left: calc(100% + 3px);
            width: 64px;
            height: 20px;
            background: url(@/assets/images/trademark/v230401/nav-tip.png) no-repeat left top / cover;
          }
        }
      }
    }
    .icon-jump {
      position: relative;
      width: 16px;
      height: 16px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      margin-left: 4px;
      &::before {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
