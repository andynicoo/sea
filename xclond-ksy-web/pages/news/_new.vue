<template>
  <div class="news">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <div class="newcontent ksy-w1320">
      <div class="content">
        <div class="newdesc" v-if="code === 0">
          <h1 class="title">{{ detailInfo.title }}</h1>
          <p class="desc author">
            <span class="time">{{ detailInfo.updateTime }}</span>
            <span>阅读次数:{{ detailInfo.record }} </span>
            <span>作者:{{ detailInfo.author }}</span>
          </p>
          <div class="newssummary">
            {{ detailInfo.summary }}
          </div>
          <div class="detailimg">
            <img v-lazy="detailInfo.mainPicUrl" :alt="detailInfo.title" />
          </div>
          <div class="html contentimg" v-html="detailInfo.content"></div>
          <div class="newslable">
            标签：<nuxt-link v-for="item in detailInfo.labelList" :key="item.id" :title="item.labelName"
              :to="'/tags/' + item.id + '?name=' + item.labelName">
              {{ item.labelName }}
            </nuxt-link>
          </div>
        </div>
        <div class="newdesc" v-else>
          <h3>资讯不存在</h3>
        </div>
        <LastNews :newList="newList" />
      </div>

      <div class="side">
        <!-- 跨标跨税，去掉上方的社群，只保留热门服务，热门标签 -->
        <div v-if="NODE_PLA === 'wg'">
          <WechatCode title="关注公众号" desc="快速获取最新行业资讯" :webInfo="webInfo" :hasBorder="false" />
          <WechatCode title="关注社群" desc="请注明：姓名-运营平台-运营站点-运营品类" :hasBorder="false" :webInfo="webInfo" :codeType="2"
            class="ksy-mt-3">
          </WechatCode>
          <div class="ksy-mb-3"></div>
          <AdviserBox v-if="getModulesStatus('wikipedia_details_customerService')" />
          <div class="ksy-mb-3"></div>
          <HotNews :hotNewsList="hotNewsList" :hasBorder="false" />
          <div class="ksy-mb-3"></div>
        </div>

        <HotServer :hasBorder="false" :class="NODE_PLA === 'wg' ? 'ksy-mt-3' : ''" :hotServerList="hotServerList" />
        <div class="ksy-mb-3"></div>
        <LabelList :labelList="labelList" />
      </div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo"
      :showBanner="getModulesStatus('wikipedia_details_qrCode') && (NODE_PLA === 'ksy' || NODE_PLA === 'kby')" />
  </div>
</template>

<script>
import news from "@/apis/news";
import common from "@/apis/common";
import { Base64 } from "js-base64";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
export default {
  head() {
    return {
      title: `${this.detailInfo ? this.detailInfo.seoTitle : "资讯不存在"}`,
      meta: [
        {
          name: "keywords",
          content: `${this.detailInfo ? this.detailInfo.keyword : "资讯不存在"}`,
        },
        {
          name: "description",
          content: `${this.detailInfo ? this.detailInfo.summary : "资讯不存在"}`,
        },
      ],
    };
  },

  async asyncData(context) {
    try {
      let [
        { data: webInfo },
        { code: code, data: detailInfo },
        { data: newList },
        { data: hotNewsList },
        { data: hotServerList },
        { data: navList },
        { data: footerList },
        { data: labelList },
      ] = await Promise.all([
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        context.$axiosApi(news.getNewsById.url, news.getNewsById.methods, {
          id: context.route.params.new,
        }),
        context.$axiosApi(news.getLastNewsById.url, news.getLastNewsById.methods, {
          id: context.route.params.new,
          size: 20,
          pages: 1,
        }),
        context.$axiosApi(news.getHotNews.url, news.getHotNews.methods, {}),
        context.$axiosApi(news.getHotService.url, news.getHotService.methods, {}),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(news.getLablesById.url, news.getLablesById.methods, {
          id: context.route.params.new,
          size: 20,
          pages: 1,
        }),
      ]);
      // 解码处理
      detailInfo.content = detailInfo.content ? Base64.decode(detailInfo.content) : "";
      return {
        webInfo,
        detailInfo, // 资讯详情
        code,
        newList: newList.records, // 最新资讯
        hotNewsList, // 热点资讯
        hotServerList, // 热门服务
        navList: Array.isArray(navList) ? navList : [], // 导航列表
        footerList: Array.isArray(footerList) ? footerList.slice(0, 32) : [], // 导航列表
        labelList: labelList.records, // 右侧标签列表
      };
    } catch (error) {
      console.log(context);
      context.redirect(true, `/404`, {});
      console.log(error);
    }
  },

  data() {
    return {
      query: {},
      NODE_PLA: process.env.NODE_PLA,
    };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  mounted() {
    this.query = this.$route.query;
    if (this.code === 0) {
      this.sendSensors();
    } else {
      // this.$router.push("/404");
    }
  },
  methods: {
    // 神策自定义事件，文章详情浏览
    sendSensors() {
      let { author, updateTime, id, categoryName, categoryId, documentCategory } = this.detailInfo;
      this.$sensors.track("ArticleView", {
        information_kind: documentCategory.categoryName, // 资讯分类
        article_id: Number(id), // 文章id
        A_article_time: updateTime, // 文章时间
        article_source: author, // 文章来源
      });
    },
  },
  components: {},
};
</script>

<style lang="less" scoped>
.news {
  background: #f6f7f9;
  padding-top: 20px;
  margin-top: 64px;

  .newcontent {
    display: flex;
    margin: 0 auto;
    margin-bottom: 40px;

    .content {
      flex: 1;
      margin-right: 16px;

      .newdesc {
        background: #fff;
        padding: 48px 65px;
        padding-bottom: 25px;

        h1 {
          font-size: 40px;
          font-weight: bold;
          color: @textColor;
          line-height: 56px;
          margin-bottom: 16px;
        }

        p.desc {
          color: @textColor4;
          font-size: 14px;
          margin-bottom: 28px;

          span {
            margin-right: 10px;
          }
        }

        .html {
          font-size: 16px;
          color: rgba(@textColor, 0.9);
          line-height: 26px;
          word-break: break-all;

          /deep/ .ql-editor {
            padding: 0;
            font-size: 16px;
            color: rgba(@textColor, 0.9);
            line-height: 26px;
            word-break: break-all;
          }
        }
      }
    }

    .side {
      width: 368px;
      // background: #fff;
      color: @textColor;
    }
  }
}
</style>
<style lang="less">
.detailimg {
  img {
    max-width: 685px;
    margin-bottom: 32px;
  }
}

.contentimg {
  img {
    max-width: 685px;
  }

  h2 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 32px !important;
    line-height: 28px;
  }

  h3 {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 32px !important;
    line-height: 28px;
  }

  p {
    margin-bottom: 32px !important;
    line-height: 28px;
  }
}

.newssummary {
  background: #f5f7fa;
  opacity: 1;
  margin-bottom: 32px;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  padding: 16px 24px;
  counter-reset: @textColor4;
}

.newslable {
  margin-top: 10px;
  counter-reset: @textColor4;

  a {
    height: 32px;
    background: #f5f7fa;
    border-radius: 1px 1px 1px 1px;
    opacity: 1;
    margin-right: 16px;
    display: inline-block;
    line-height: 32px;
    padding: 0px 26px;
    margin-bottom: 15px;
    cursor: pointer;
    color: @textColor6;
  }
}
</style>
