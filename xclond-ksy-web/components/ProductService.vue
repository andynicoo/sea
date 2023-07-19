<template>
  <div class="product-service" v-show="loaded && tabList && tabList.length">
    <div class="product-service-tab ksy-w1320 center" v-if="productServiceIsTer && NODE_PLA === 'ksy'">
      <div
        class="product-service-tab-item"
        @click="changeTab(index)"
        :key="`pro_${index}`"
        v-for="(tab, index) in tabList"
        :class="{ active: tabActive === index }"
      >
        <h4>{{ tab.name }}</h4>
        <span>{{ tab.info }}</span>
      </div>
    </div>
    <div
      class="product-service-wrap ksy-w1320 center clearfloat"
      :class="{ 'default-active': defaultActiveShow }"
      v-show="serviceList && serviceList.length"
      ref="box"
    >
      <a-anchor
        class="product-service-slide"
        :class="{ noFixed: !fixed }"
        wrapperClass="my-anchor"
        :offsetTop="108"
        :affix="true"
        @change="onChange"
        @click="handleAnchorClick"
        ref="slide"
      >
        <a-anchor-link v-for="(h, index) in serviceList" :key="`h_${index}`" :href="`#mao${index}`" :title="h.name" />
      </a-anchor>
      <div class="product-service-content" ref="content">
        <template v-if="productServiceIsTer">
          <div class="product-service-item" v-for="(c, index) in serviceList" :key="`c_${index}`" :id="`mao${index}`">
            <div class="product-service-item-title">{{ c.name }}</div>
            <ProductServiceTemplate v-on="$listeners" :list="c.items" :key="`pro_${index}`" />
          </div>
        </template>
        <template v-else>
          <!-- 带有swiper start -->
          <div v-for="(sw, sw_index) in serviceList" :key="`ser_${sw_index}`">
            <ProductServiceSwiperTemplate
              v-on="$listeners"
              v-bind="$attrs"
              :idx="sw_index"
              :items="sw"
              :key="`sw_${sw_index}`"
              :id="`mao${sw_index}`"
            />
          </div>
          <!-- 带有swiper end -->
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ProductService",
  data() {
    return {
      scrollToTop: 1,
      currentActiveLink: null,
      tabActive: 0,
      defaultActiveShow: true, // 默认锚点高亮
      fixedHeight: 0,
      fixed: true,
      NODE_PLA: process.env.NODE_PLA,
    };
  },
  props: {
    baseData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    loaded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tabList() {
      const { baseData } = this;
      console.log(baseData, "baseData");
      let list = baseData || [];
      if (list?.length) {
        list.forEach((item) => {
          let parentInfo = item;
          if (item?.navTertiary?.aggregates?.length) {
            item?.navTertiary?.aggregates.forEach((child) => {
              child.items.forEach((ter) => {
                ter.parentInfo = parentInfo;
              });
            });
          }
        });
      }
      return list.slice(0, 3);
    },
    // 是否有三级菜单
    productServiceIsTer() {
      return this.baseData.length > 1;
    },
    serviceList() {
      const { tabList, tabActive } = this;
      console.log(tabList, "tabList");
      let list = [];
      if (tabList?.length) {
        list = tabList?.[tabActive]?.navTertiary?.aggregates || [];
      }

      return list;
    },
    sliderList() {
      const { tabActive, tabList } = this;
      return tabList?.[tabActive]?.navTertiary?.aggregates || [];
    },
  },
  methods: {
    /**
     * tab切换操作
     * @param index
     */
    changeTab(index) {
      this.tabActive = index;
    },
    handleAnchorClick(e) {
      // 阻止 a 标签默认事件
      e.preventDefault();
    },
    onChange(link) {
      console.log(link);
      if (link === "#mao0" || link === "") {
        setTimeout(() => {
          this.defaultActiveShow = true;
        }, 200);
      } else {
        this.defaultActiveShow = false;
      }
    },
    getOffsetTop(element, container) {
      if (!element) {
        return 0;
      }
      if (!element.getClientRects().length) {
        return 0;
      }
      const rect = element.getBoundingClientRect();
      if (rect.width || rect.height) {
        if (container === window) {
          container = element.ownerDocument.documentElement;
          return rect.top - container.clientTop;
        }
        return rect.top - container.getBoundingClientRect().top;
      }
      return rect.top;
    },
  },
  mounted() {
    if (this.loaded) {
      window.addEventListener(
        "scroll",
        () => {
          if (window.scrollY > this.fixedHeight + 60) {
            this.fixed = false;
          } else {
            this.fixed = true;
          }
        },
        {
          passive: true,
        }
      );
      window.scrollTo({
        top: 0,
      });
      let that = this;
      this.$nextTick(() => {
        if (that.$refs.content) {
          let contentHeight = that.$refs.content ? that.$refs.content.offsetHeight : 0;
          let productHeight = document.querySelector(".product-service-slide")
            ? document.querySelector(".product-service-slide").offsetHeight
            : 0;
          that.fixedHeight = that.getOffsetTop(that.$refs.content, window) + contentHeight - productHeight;
        }
      });
    }
  },
};
</script>
<style lang="less" scoped>
.product-service {
  background: #fff;
  padding: 0 0 32px;
  .noFixed {
    /deep/ .ant-affix {
      position: absolute !important;
      bottom: 0 !important;
      top: initial !important;
    }
  }
  &-wrap {
    margin-top: 30px;
    position: relative;
  }
  &-tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 30px auto 60px;
    &-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 14px;
      color: rgba(@textColor, 0.9);
      line-height: 22px;
      cursor: pointer;
      position: relative;
      &:before {
        position: absolute;
        content: "";
        width: 1px;
        height: 64px;
        background: #e3e3e3;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
      &:last-child {
        &:before {
          display: none;
        }
      }
      &.active {
        h4 {
          color: @primaryColor;
        }
      }
      h4 {
        font-size: 24px;
        font-weight: 600;
        color: @textColor6;
        line-height: 32px;
        margin-bottom: 8px;
      }
    }
  }
  &-slide {
    float: left;
  }
  /deep/ .my-anchor {
    width: 240px;
    padding: 20px 0 48px;
    margin: 0;
    background: #f5f7fa;
    border-radius: 4px;
    .ant-anchor {
      padding: 0;
    }
    .ant-anchor-ink {
      &:before {
        display: none;
      }
      &-ball {
        width: 3px;
        height: 44px;
        background: @primaryColor;
        left: 0;
        top: 0;
        transform: translate(0, -17px);
        z-index: 2;
      }
    }
    .ant-anchor-link {
      height: 44px;
      font-size: 16px;
      line-height: 44px;
      padding: 0 0 0 40px;
      &-active {
        background: #fff;
        font-weight: 600;
      }
    }
  }
  .default-active {
    .ant-anchor-link:nth-child(2) {
      font-weight: 600;
      background: #fff;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        z-index: 12;
        width: 3px;
        height: 44px;
        background: @primaryColor;
        left: 0;
        top: 0;
        border: 2px solid #3a7fff;
        border-radius: 8px;
      }
      /deep/ .ant-anchor-link-title {
        color: @primaryColor;
      }
    }
  }
  &-content {
    overflow: hidden;
    padding-left: 24px;
    .goods-type-content {
      border-top: 1px solid #fff;
      border-left: 1px solid #fff;
    }
  }
  &-item {
    margin-bottom: 48px;
    &-title {
      font-size: 20px;
      font-weight: 500;
      color: @textColor;
      margin-bottom: 20px;
      line-height: 28px;
    }
  }
  &-swiper {
    &-item {
      display: flex;
      height: 376px;
      justify-content: space-between;
    }
    &-left {
      width: 282px;
      img {
        width: 90%;
      }
    }
    &-right {
      width: calc(100% - 282px);
      .swiper-slide {
        height: calc(100% / 2);
        border: 1px solid #dcdcdc;
      }
      .swiper-head {
        img {
          width: 56px;
          height: 56px;
        }
      }
      .swiper-wrapper {
        flex-wrap: wrap;
        flex-direction: column;
      }
    }
  }
}
</style>
