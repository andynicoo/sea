<template>
  <div>
    <div class="guide-page" v-if="loaded">
      <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" />
      <!-- banner start -->
      <IndexBanner
        :list="bigBanner"
        v-if="bigBanner && bigBanner.length && getModulesStatus('operationGuide_banner')"
        :showData="false"
        :height="396"
      />
      <!-- banner end -->
      <div
        class="guide-page-main center ksy-w1320"
        ref="guideContent"
        v-if="sliderList && sliderList.length && getModulesStatus('operationGuide_details')"
      >
        <!-- :style="{'max-width': item.productInfoClientVo.tag?'186px':'initial'}" -->
        <!-- fixedBottomStyle, -->
        <div
          class="guide-page-main-slider"
          ref="guideSlider"
          :class="{ sliderFixed: sliderFixed }"
          :style="{
            top:
              bigBanner && bigBanner.length && getModulesStatus('operationGuide_banner') && sliderFixed
                ? '63px'
                : '0px',
          }"
        >
          <a-collapse v-model="activeKey" expandIconPosition="right" :bordered="false">
            <template #expandIcon="{}">
              <AliIcon size="12" type="a-caozuozhiyinxialaxiangxiajiantou" />
            </template>
            <a-collapse-panel v-for="(slide, index) in sliderList" :key="'d' + index" :header="slide.title">
              <AliIcon size="16" slot="extra" type="a-caozuozhiyindabiaotiicon" />
              <ul>
                <li
                  @click="getDetail(detail.id)"
                  v-for="(detail, idx) in slide.pages"
                  :class="{ active: detail.id === queryId }"
                  :key="`detail_${idx}`"
                >
                  {{ detail.title }}
                </li>
              </ul>
            </a-collapse-panel>
          </a-collapse>
        </div>
        <div class="guide-page-main-right" ref="content">
          <template v-if="detailInfo && Object.keys(detailInfo).length">
            <div class="guide-page-main-right-title">
              <h4>{{ detailInfo.title }}</h4>
            </div>
            <div class="guide-page-main-right-content" v-html="decodeDeal(detailInfo.content)"></div>
          </template>
          <GuideEmpty v-else />
        </div>
      </div>
      <GuideEmpty v-else />
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" />
  </div>
</template>
<script>
import guide from "@/apis/guide";
import common from "@/apis/common";
import { Base64 } from "js-base64";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
const arrowSvg = {
  template: `
    <svg t="1661589821861" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1904" width="200" height="200"><path d="M926.976 267.349333a40.021333 40.021333 0 0 0-56.490667 2.901334L512.170667 668.16 153.941333 270.250667a40.021333 40.021333 0 1 0-59.392 53.589333l381.013334 423.253333a39.850667 39.850667 0 0 0 36.693333 21.845334 39.850667 39.850667 0 0 0 36.522667-21.930667l381.098666-423.253333a40.021333 40.021333 0 0 0-2.901333-56.405334z" fill="#000000" fill-opacity=".6" p-id="1905"></path></svg>
  `,
};
const arrowIcon = {
  template: `
    <a-icon :component="arrowSvg" />
  `,
  data() {
    return {
      arrowSvg,
    };
  },
};
export default {
  name: "guide",
  head() {
    return {
      title: "跨标云平台操作指引",
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: "跨标云操作指引",
        },
        {
          hid: "description",
          name: "description",
          content: "跨标云操作指引页面",
        },
      ],
    };
  },
  components: {
    arrowIcon,
  },
  data() {
    return {
      activeKey: "d0",
      position: "right",
      contentTop: 0,
      contentHeight: 0,
      sliderHeight: 0,
      sliderFixed: false,
      fixedBottomStyle: {},
    };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  async asyncData(context) {
    try {
      let queryId = "";
      let [{ data: bigBanner }, { data: navList }, { data: footerList }, { data: webInfo }] = await Promise.all([
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "operationGuide_banner",
        }),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
      ]);
      let {
        data: { records: categoryList }, // 菜单模块列表
      } = await context.$axiosApi(guide.documentCategoryPage.url, guide.documentCategoryPage.methods, {
        moduleType: 1, // 操作指引
        status: 1,
        page: 1,
        limit: 100,
      });
      let {
        data: { records: pageList }, // 菜单列表
      } = await context.$axiosApi(guide.operationDocumentPage.url, guide.operationDocumentPage.methods, {
        page: 1,
        limit: 100,
        enabled: 0,
      });
      let sliderList = [];
      let detailInfo = null;
      if (categoryList.length && pageList.length) {
        // 侧边栏数据组装
        categoryList.forEach((cate) => {
          const { id, categoryName: title } = cate;
          const list = pageList.filter((page) => {
            return page.categoryId === id;
          });
          sliderList.push({
            title,
            pages: list,
          });
        });
        sliderList = sliderList.filter((v) => {
          return v.pages.length;
        });
        queryId = sliderList[0].pages[0].id;
        // 获取文章详情
        let { data: detailInfoInner } = await context.$axiosApi(
          guide.operationDocumentItem.url + queryId,
          guide.operationDocumentItem.methods
        );
        detailInfo = detailInfoInner;
      }
      return {
        sliderList,
        queryId,
        detailInfo,
        bigBanner: Array.isArray(bigBanner) ? bigBanner : [],
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        webInfo, // 网站信息
        loaded: true,
      };
    } catch (error) {
      console.log("error", error);
    }
  },
  methods: {
    // 解码处理
    decodeDeal(content) {
      return Base64.decode(content);
    },
    /**
     * 获取文章详情
     */
    getDetail(id) {
      this.queryId = id;
      this.$axiosApi(guide.operationDocumentItem.url + this.queryId, guide.operationDocumentItem.methods).then(
        (res) => {
          if (+res.code === 0) {
            this.detailInfo = res.data;
          }
        }
      );
    },
  },
  mounted() {
    this.$nextTick(() => {
      // let contentHeight = this.$refs.content.offsetHeight;
      // console.log(contentHeight);
      if (this.loaded) {
        let num = 0;
        if (this.$refs.guideContent.getBoundingClientRect()) {
          this.contentTop = this.$refs.guideContent.getBoundingClientRect().top - 70;
          this.contentHeight = this.$refs.guideContent.getBoundingClientRect().height;
          this.sliderHeight = this.$refs.guideSlider.getBoundingClientRect().height;
          num = this.contentTop + this.contentHeight - this.sliderHeight - 50;
        }

        let hasBanner = this.bigBanner && this.bigBanner.length && this.getModulesStatus("operationGuide_banner");
        window.addEventListener(
          "scroll",
          () => {
            // console.log("window.scrollY", window.scrollY, this.contentTop, num);
            if (hasBanner) {
              if (window.scrollY > 406) {
                this.sliderFixed = true;
              }
              //  else if (window.scrollY > 406 + contentHeight) {
              //   this.sliderFixed = false;
              // }
              else {
                this.sliderFixed = false;
              }
            } else {
              if (window.scrollY > this.contentTop && window.scrollY < num) {
                this.sliderFixed = true;
              } else if (window.scrollY >= num) {
                this.sliderFixed = false;
              } else {
                this.sliderFixed = false;
              }
            }
          },
          {
            passive: true,
          }
        );
        window.scrollTo({
          top: 0,
        });
      }
    });
  },
};
</script>
<style lang="less" scoped>
.guide-page {
  padding: 0 0 50px;
  .index-banner {
    margin-bottom: 80px;
  }
  &-main {
    position: relative;
    margin-top: 80px;
    &-slider {
      position: absolute;
      width: 210px;
      &.sliderFixed {
        position: fixed;
      }
      .ant-collapse-borderless {
        background: #fff;
      }
      /deep/ .ant-collapse-item {
        border: 0;
        .ant-collapse-header {
          position: relative;
          height: 40px;
          line-height: 40px;
          background: #f5f7fa;
          font-size: 14px;
          font-weight: 500;
          color: rgba(@textColor, 0.9);
          padding: 0 0 0 42px;
          .ant-collapse-arrow {
            color: rgba(#000, 0.6);
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
          }
          .ant-collapse-extra {
            position: absolute;
            left: 14px;
            top: 50%;
            line-height: initial;
            transform: translateY(-50%);
          }
        }
        .ant-collapse-content-box {
          padding: 0;
          ul {
            margin: 8px 0;
            li {
              height: 40px;
              line-height: 40px;
              text-align: center;
              font-size: 14px;
              cursor: pointer;
              color: rgba(@textColor, 0.9);
              &:hover,
              &.active {
                font-weight: 500;
                color: @primaryColor;
                border-right: 2px solid @primaryColor;
              }
            }
          }
        }
      }
      /deep/ .ant-collapse-item-active {
        .ant-collapse-header {
          .ant-collapse-arrow {
            transform: translateY(-50%) rotate(-180deg);
          }
        }
      }
    }
    &-right {
      padding-left: 80px;
      margin-left: 210px;
      border-left: 1px solid rgba(@textColor, 0.1);
      /deep/ .ql-editor {
        padding: 0;
        line-height: 2em;
      }
      &-title {
        border-left: 2px solid @primaryColor;
        padding: 0 0 0 15px;
        margin-bottom: 40px;
        h4 {
          margin: 0;
          font-size: 20px;
          font-weight: 500;
          color: @textColor;
          line-height: 28px;
        }
      }
    }
  }
}
.guide-page-main-right-content {
  /deep/ p {
    line-height: 26px;
  }
}
</style>
