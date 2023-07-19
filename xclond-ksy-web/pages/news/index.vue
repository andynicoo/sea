<template>
  <div class="news">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="banner" v-if="getModulesStatus('wikipedia_recommended')">
      <div class="bancontent ksy-w1320">
        <div class="swipe">
          <div class="lswipe" :class="{
            lswipeksy: NODE_PLA === 'ksy'
          }">
            <Swiper :list="bigBanner" v-if="bigBanner && bigBanner" />
          </div>
          <div class="rswipe">
            <CardNews key="top" :list="smallUpBanner" v-if="smallUpBanner && smallUpBanner.length"
              style="margin-bottom: 14px" />
            <CardNews key="bottom" :list="smallDownBanner" v-if="smallDownBanner && smallDownBanner.length" />
          </div>
        </div>
        <div class="rightswipe">
          <HotNews style="height: 100%" v-if="hotNewsList && hotNewsList.length" :hotNewsList="hotNewsList" />
        </div>
      </div>
    </div>
    <div class="ksy-clear"></div>
    <div class="content ksy-w1320">
      <!-- style="max-width: 884px" -->
      <div class="newlist w884" :class="{ w1000: NODE_PLA === 'ksy' }" v-if="newCateList && newCateList.length">
        <a-tabs v-model="newsid" :tab-position="'top'" :style="{ height: '60px' }" @prevClick="callback"
          @nextClick="callback" @change="tabsChange">
          <a-tab-pane v-for="cate in newCateList" :key="cate.id" :tab="`${cate.categoryName}`">
            <!-- Content of tab {{ cate }} -->
          </a-tab-pane>
        </a-tabs>
        <TagNewsList ref="tagnewslist" :id="newsid"
          v-if="newsList && newsList.length && getModulesStatus('wikipedia_InformationList')" :newsList="newsList" />
        <div class="pagination ksy-text-center ksy-mt-4" v-show="newsList.length">
          <a-pagination :current="Number(newsListPage.current) || 1" :total="Number(newsListPage.total) || 0"
            :pageSize="10" :itemRender="itemRenderFun" />
        </div>
      </div>
      <div class="rightnews">
        <WechatCode title="关注公众号" desc="快速获取最新行业资讯" :webInfo="webInfo"
          v-if="getModulesStatus('wikipedia_Advertisingentrance') && (NODE_PLA === 'ksy' || NODE_PLA === 'kby')" />

        <WechatCode :codeType="2" title="关注社群" desc="请注明：姓名-运营平台-运营站点-运营品类" class="ksy-mt-3" :webInfo="webInfo"
          v-if="getModulesStatus('wikipedia_Advertisingentrance') && (NODE_PLA === 'ksy' || NODE_PLA === 'kby')" />
        <HotServer class="ksy-mt-3" :hotServerList="hotServerList"
          v-if="hotServerList && getModulesStatus('wikipedia_popularServices')" />
      </div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo"
      :showBanner="NODE_PLA === 'ksy' || NODE_PLA === 'kby'" />
  </div>
</template>

<script>
import Swiper from "../../components/Swiper.vue";
import news from "@/apis/news";
import common from "@/apis/common";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
const NODE_PLA = process.env.NODE_PLA;
import config from "../../static/config";
export default {
  head() {
    return {
      title: this.setTitle,
      meta: [
        {
          hid: "keywords",
          name: "keywords",
          content: this.setKeywords,
        },
        {
          hid: "description",
          name: "description",
          content: this.setDescription,
        },
      ],
    };
  },
  watchQuery: ["id", "page"],
  async asyncData(context) {
    try {
      let data = await context.$axiosApi(news.allDocumentCategory.url, news.allDocumentCategory.methods, {});
      let addData = [
        {
          categoryName: "全部",
          id: "999999",
        },
      ];
      data = addData.concat(data);
      let newCateList = data;
      let newsid = context.query.id ? context.query.id : data.length ? data[0].id : null;
      let newsTitle = data.length ? data[0].categoryName : null;

      let [
        { data: webInfo },
        { data: hotNewsList },
        { data: hotServerList },
        { data: bigBanner },
        { data: smallUpBanner },
        { data: smallDownBanner },
        { data: navList },
        { data: footerList },
      ] = await Promise.all([
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        context.$axiosApi(news.getHotNews.url, news.getHotNews.methods, {}),
        context.$axiosApi(news.getHotService.url, news.getHotService.methods, {}),
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "Information_big_banner",
        }),
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "Information_smallUp_banner",
        }),
        context.$axiosApi(common.getAdByAdPositionKey.url, common.getAdByAdPositionKey.methods, {
          adKey: "Information_smallDown_banner",
        }),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
      ]);
      // 资讯分页查询
      let { records, current, total } = await context.$axiosApi(news.getNewsByCate.url, news.getNewsByCate.methods, {
        categoryId: context.query.id ? (context.query.id === "999999" ? null : context.query.id) : null,
        enabled: 0,
        limit: 10,
        page: context.query.page || 1
      });
      let newsList = records;
      let newsListPage = {
        total: total,
        current: current,
      };
      let itemSeo = {}
      let itemNav = navList.find(item => item.name === "税务资讯" || "知产百科")
      let id = context.route.query.id
      let itemCate = newCateList.find(item => item.id === id)
      if (id && id != "999999") {
        itemSeo = itemCate
      } else {
        itemSeo = itemNav
      }
      let setTitle = itemSeo.seoTitle;
      let setKeywords = itemSeo.keyword;
      let setDescription = itemSeo.seoDescribe;
      return {
        webInfo, // 网站信息
        newCateList, // 资讯分类tab
        newsid,
        newsTitle,
        hotNewsList, // 热门资讯
        hotServerList, // 热门服务
        bigBanner, // 广告banner大图
        smallUpBanner, // 广告banner右上小图
        smallDownBanner, // 广告banner右下小图
        newsList,
        newsListPage,
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [],
        setTitle,
        setKeywords,
        setDescription,
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      title: "VAT",
      cateList: [],
      NODE_PLA: process.env.NODE_PLA,
    };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  methods: {
    callback(val) {
      console.log(val);
    },
    tabsChange(key) {
      let selectItem = this.newCateList.find(item => item.id == key)
      this.setTitle = selectItem.seoTitle
      this.setKeywords = selectItem.keyword
      this.setDescription = selectItem.seoDescribe
      this.$router.push(`/news?page=${1}&id=${key}`);
    },
    itemRenderFun(page, type, originalElement) {
      let { total } = this.newsListPage;
      if (type === "page") {
        return (
          <nuxt-link to={`/news?page=${page}&id=${this.newsid}`}>
            <a class="ss">{page}</a>
          </nuxt-link>
        );
      } else if (type === "prev") {
        return (
          <nuxt-link to={`/news?page=${page === 0 ? 1 : page}&id=${this.newsid}`}>
            <a>{originalElement}</a>
          </nuxt-link>
        );
      } else if (type === "next") {
        return (
          <nuxt-link to={`/news?page=${page === total ? total : page}&id=${this.newsid}`}>
            <a>{originalElement}</a>
          </nuxt-link>
        );
      } else {
        return <a>{originalElement}</a>;
      }
    },
  },
  components: { Swiper },
};
</script>

<style lang="less" scoped>
.news {
  margin-top: 64px;

  .banner {
    background: #f6f7f9;
    padding-top: 36px;
    height: 400px;

    .bancontent {
      margin: 0 auto;
      display: flex;
      overflow: hidden;
      height: 368px;
      justify-content: space-between;

      .swipe {
        flex: 1;
        height: 100%;
        margin-right: 15px;
        display: flex;
        justify-content: space-between;
        overflow: hidden;

        .lswipe {
          width: 590px;
          margin-right: 16px;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
          height: 328px;
        }

        .rswipe {
          width: 278px;
          display: flex;
          justify-content: flex-start;
          flex-direction: column;
        }
      }

      .rightswipe {
        width: 320px;
        height: 96%;
      }
    }
  }

  .content {
    margin: 0 auto;
    display: flex;
    padding-top: 23px;
    margin-bottom: 40px;

    .newlist {
      flex: 1;
      padding-right: 40px;

      /deep/ .ant-tabs-nav-container {
        font-size: 16px;
        color: rgba(#000, 0.9);

        .ant-tabs-nav .ant-tabs-tab {
          padding-left: 0;
          padding-right: 0;
          margin-right: 40px;
        }
      }
    }

    .rightnews {
      width: 320px;
    }
  }
}

.lswipeksy {
  width: 687px !important;

  /deep/.slick-slide h3 {
    bottom: 56px;
  }
}

.w1000 {
  max-width: 1000px !important;
}

.w884 {
  max-width: 884px;
}
</style>
