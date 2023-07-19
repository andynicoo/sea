<template>
  <div class="tags">
    <HeaderTemp v-if="navList && navList.length" :nav-list="navList" :webInfo="webInfo" :blackKbyHead="true" />
    <ul class="breadcrumb ksy-w1320">
      <li>
        <NuxtLink to="/">首页</NuxtLink>
        &nbsp;/&nbsp;
      </li>
      <li>
        <NuxtLink to="/tags">标签</NuxtLink>
        &nbsp;/&nbsp;
      </li>
      <li>
        <span>{{ labelName }}</span>
      </li>
    </ul>
    <div class="newcontent ksy-w1320">
      <div class="content">
        <section class="detailInfo-section">
          <h1>{{ detailInfo.labelName }}
            <em class="creattime">{{ moment(detailInfo.createTime).format("YYYY-MM-DD") }}</em>
          </h1>
          <p>{{ detailInfo.seoDescribe }}</p>
          <span @click="customerFunc">1对1立即咨询</span>
        </section>
        <section class="content-section">
          <p class="h3">【{{ labelName }}】内容精选</p>
          <ul>
            <li v-for="(item, index) in contentList" :key="index" v-show="index < 4">
              <NuxtLink :to="'/news/' + item.id">{{ item.title }}</NuxtLink>
              <div class="item-content">
                <div class="img"><img :src="item.mainPicUrl" /></div>
                <div class="content-p">
                  <p>{{ item.summary }}</p>
                  <div>
                    <NuxtLink :to="'/news/' + item.id">查看更多</NuxtLink>
                    <a-icon type="right" />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </section>
        <section class="list-section">
          <ul class="real-list">
            <li v-for="(item, index) in contentList" :key="item.id" v-show="index > 3">
              <NuxtLink :to="'/news/' + item.id">
                <i class="anticon-rise"></i>
                <span>{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </section>
        <section class="article-section">
          <p class="h3">【{{ labelName }}】相关文章</p>
          <ul>
            <li v-for="(item, index) in articleList" :key="index">
              <h5>{{ item.title }}</h5>
              <p>{{ item.summary }}</p>
              <div>
                <NuxtLink :to="'/news/' + item.id">
                  <span>查看详情</span>
                  <a-icon type="right" />
                </NuxtLink>
              </div>
            </li>
          </ul>
        </section>
      </div>
      <div class="side">
        <HotProduct :hasBorder="false" :class="NODE_PLA === 'wg' ? 'ksy-mt-3' : ''" :hotServerList="hotServerList" />
        <div class="ksy-mb-3"></div>
        <LabelList :labelList="labelList" />
      </div>
    </div>
    <FooterTemp v-if="footerList && footerList.length" :list="footerList" :webInfo="webInfo" :showBanner="false" />
  </div>
</template>

<script>
import tags from "@/apis/tags";
import common from "@/apis/common";
// 官网模块列表权限 是否显示
import modulesAuth from "@/mixins/modules-auth";
import { customerFunc } from "@/utils/index";
import moment from "moment";

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
          content: `${this.detailInfo ? this.detailInfo.seoDescribe : "资讯不存在"}`,
        },
      ],
    };
  },

  async asyncData(context) {
    try {
      let [
        { data: webInfo },
        { data: detailInfo },
        { data: content },
        { data: article },
        { data: hotServerList },
        { data: navList },
        { data: footerList },
        { data: labelList },
      ] = await Promise.all([
        context.$axiosApi(common.getWebsitInfo.url, common.getWebsitInfo.methods),
        context.$axiosApi(tags.getTagsDetails.url, tags.getTagsDetails.methods, {
          id: context.route.params.tag,
        }),
        context.$axiosApi(tags.getTagsContent.url, tags.getTagsContent.methods, {
          newsType: "INFORMATION", size: 10, current: 3, title: context.route.query.name, id: context.route.params.tag,
        }),
        context.$axiosApi(tags.getTagsContent.url, tags.getTagsContent.methods, {
          newsType: "INFORMATION", size: 10, current: 4, title: context.route.query.name, id: context.route.params.tag,
        }),
        context.$axiosApi(tags.getTagsProduct.url, tags.getTagsProduct.methods, { size: 6, current: 1, }),
        context.$axiosApi(common.newslist.url, common.newslist.methods),
        context.$axiosApi(common.getPartnerList.url, common.getPartnerList.methods, { linkType: 0 }),
        context.$axiosApi(tags.getTagsRelateList.url, tags.getTagsRelateList.methods, {
          labelName: context.route.query.name,
          notId: context.route.params.tag,
          id: context.route.params.tag,
          size: 10,
          pages: 1,
        }),
      ]);
      // ro
      return {
        webInfo,
        detailInfo,
        contentList: content.records,
        articleList: article.records,
        hotServerList: hotServerList.records, // 热门服务
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
      labelName: this.$route.query.name,
      NODE_PLA: process.env.NODE_PLA,
      customerFunc,
      moment
    };
  },
  mixins: [modulesAuth], // 官网模块列表权限 是否显示
  mounted() {
    this.query = this.$route.query;
  },
  methods: {

  },
  components: {},
};
</script>

<style lang="less" scoped>
.tags {
  background: #f6f7f9;
  padding-top: 20px;
  margin-top: 64px;

  .breadcrumb {
    margin: 0 auto;
    font-size: 14px;
    display: flex;
    align-items: center;
    height: 50px;

    li {
      a {
        color: @textColor6;

        &:hover {
          color: @primaryColor;
        }
      }
    }
  }

  .newcontent {
    display: flex;
    margin: 0 auto;
    margin-bottom: 40px;

    .content {
      flex: 1;
      margin-right: 16px;

      p.h3 {
        font-size: 20px;
        height: 32px;
        color: @textColor;
        border-left: 4px solid @primaryColor;
        margin: 32px 0 24px;
        padding-left: 10px;
      }

      .detailInfo-section {
        background: #ffff;
        padding: 28px 32px;

        h1 {
          font-size: 28px;
          color: @textColor;
          .creattime{
            font-size: 16px;
            float: right;
            color: @textColor4;
            margin-top: 7px;
          }
        }

        p {
          font-size: 16px;
          color: @textColor6;
          line-height: 28px;
          min-height: 30px;
        }

        span {
          color: @whiteTextColor;
          display: block;
          width: 173px;
          line-height: 42px;
          background: @primaryColor;
          cursor: pointer;
          border-radius: 1px 1px 1px 1px;
          font-size: 16px;
          margin-top: 14px;
          text-align: center;

          &:hover {
            background: @primaryColor;
          }
        }
      }

      .content-section {
        ul {
          overflow: hidden;

          li {
            float: left;
            width: 49%;
            background: #fff;
            padding: 24px 20px 38px;
            margin: 0 2% 2% 0;

            >a {
              font-size: 18px;
              color: @textColor;
              margin-bottom: 16px;
              display: inline-block;
              height: 28px;
              width: 394px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              &:hover {
                color: @primaryColor;
              }
            }

            .item-content {
              display: flex;

              .img {
                flex: 1;
                height: 90px;
                overflow: hidden;

                img {
                  width: 174px;
                  height: 98px;
                }
              }

              .content-p {
                padding-left: 12px;
                flex-basis: 236px;
                width: 236px;
                font-size: 14px;
                margin-top: -2px;

                p {
                  height: 66px;
                  width: 100%;
                  line-height: 22px;
                  margin-bottom: 6px;
                  color: @textColor6;
                  word-wrap: break-word;
                  .line-clamp(3);
                }

                div {
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;
                  color: @primaryColor;
                  height: 24px;

                  >a {
                    cursor: pointer;
                    text-align: right;
                    color: @primaryColor;

                    &:hover {
                      color: @primaryColor;
                    }
                  }

                  .icon {
                    font-size: 18px;
                  }
                }
              }
            }
          }

          >li:nth-child(2n) {
            margin-right: 0 !important;
          }
        }
      }

      .list-section {
        background: @whiteTextColor;
        padding: 20px 20px 10px 20px;
        margin-top: -10px;

        .real-list {
          width: 100%;
          margin: 0;
          display: block;
          overflow: hidden;

          >li {
            width: 50%;
            float: left;
            margin: 0 0 12px 0;
            .line-clamp(1);

            &:hover {
              a {
                >span {
                  color: @primaryColor;
                }
              }
            }

            a {
              cursor: pointer;
              overflow: hidden;
              display: flex;

              >.anticon-rise {
                width: 8px;
                height: 8px;
                background: @primaryColor;
                border-radius: 4px;
                margin-top: 6px;
                margin-right: 6px;
              }

              >span {
                flex: 1;
                font-size: 15px;
                color: @textColor6;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }
        }
      }

      .article-section {
        >ul {
          overflow: hidden;

          >li {
            background: #fff;
            padding: 24px 20px;
            height: 200px;
            margin-bottom: 16px;
            float: left;
            width: 49%;
            margin: 0 2% 2% 0;

            >h5 {
              font-size: 18px;
              color: @textColor;
              margin-bottom: 16px;
              height: 28px;
              width: 392px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }

            >p {
              width: 100%;
              font-size: 12px;
              color: @textColor6;
              word-wrap: break-word;
              margin-bottom: 20px;
              height: 56px;
              line-height: 20px;
              .line-clamp(3);
            }

            >div {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              color: @primaryColor;
              height: 24px;

              >a {
                display: flex;
                align-items: center;

                >span {
                  cursor: pointer;
                  text-align: right;
                  color: @primaryColor;
                }

                >.icon {
                  font-size: 18px;
                  color: @primaryColor;
                }
              }
            }
          }

          >li:nth-child(2n) {
            margin-right: 0;
          }
        }
      }
    }

    .side {
      width: 368px;
      color: @textColor;
    }
  }
}
</style>

