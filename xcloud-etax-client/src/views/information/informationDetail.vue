<template>
  <div class="container"
       :style="contentStyleObj">
    <div class="container-box clearfix">
      <div class="container-left fl">
        <div class="bread-router">
          <p class="bread-container">
            <Breadcrumb separator=">">
              <BreadcrumbItem to="/login"
                              target="_blank">
                <h3>首页</h3>
              </BreadcrumbItem>
              <BreadcrumbItem to="/informationList"
                              target="_blank">
                <h3>新闻资讯</h3>
              </BreadcrumbItem>
              <BreadcrumbItem>{{title}}</BreadcrumbItem>
            </Breadcrumb>
          </p>
        </div>
        <div v-if="JSON.stringify(detailsInfo)!='{}'">
          <h2 class="article-title">{{title}}</h2>
          <div class="other-info">
            <span>{{detailsInfo.createTime}}</span>
            <span>作者：{{detailsInfo.bulletinAuthorName}}</span>
          </div>
          <div class="article-coniner"
               v-html="detailsInfo.bulletinContent"></div>
          <div class="change-page clearfix">
            <span class="fl"
                  v-if="detailsInfo.upPageBulletinTitle!=''"
                  @click="jumpPage(detailsInfo.upPageBulletinId)">上一篇： {{detailsInfo.upPageBulletinTitle}}</span>
            <span class="fr"
                  v-if="detailsInfo.nextPageBulletinTitle!=''"
                  @click="jumpPage(detailsInfo.nextPageBulletinId)">下一篇： {{detailsInfo.nextPageBulletinTitle}}</span>
          </div>
        </div>

      </div>
      <div class="container-right fl">
        <div class="right-title">最新资讯</div>
        <div class="news-list">
          <div class="list-item"
               v-for="(item,index) in newList"
               :key="index"
               @click="jumpPage(item.id)">
            <span>
              <img v-if="index<3"
                   src="@/assets/images/information/primary-news.png"
                   alt="">
              <img v-else
                   src="@/assets/images/information/hover-news.png"
                   alt="">
              <span>{{index+1}}</span>
            </span>
            <span class="news-title">{{item.bulletinTitle}}</span>
          </div>
        </div>
        <a class="ad-banner"
           v-if="detailsInfo.bulletinAdPicture!=''"
           :href="detailsInfo.bulletinAdPictureUrl"
           target="_blank">
          <img :src="detailsInfo.bulletinAdPicture"
               alt="">
        </a>
      </div>
    </div>
    <OtherFooter></OtherFooter>
  </div>
</template>
<script>
import "@/styles/common.less";
import OtherFooter from '@/views/common/otherFooter'
import * as API from '@/api/information/index'
export default {
  components: {
    OtherFooter
  },
  data() {
    return {
      contentStyleObj: {
        height: ""
      },
      title: '',
      bulletinId: this.$route.query.id,
      detailsInfo: {},
      newList: []
    }
  },
  metaInfo() {
    return {
      title: this.title
    }
  },
  methods: {
    getHeight() {
      this.contentStyleObj.height = window.screen.height + "px";
    },
    getDetails() {
      API.infoDetail({ bulletinId: this.bulletinId }).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) != '{}') {
            this.detailsInfo = res.data
            this.title = res.data.bulletinTitle
            this.detailsInfo.bulletinContent = decodeURI(res.data.bulletinContent)
            this.getnewList()
          } else {
            this.$Message.info('该文章不存在')
            const routeData = this.$router.resolve({ path: '/informationList' })
            window.open(routeData.href, '_self')
          }
        }
      })
    },
    getnewList() {
      let data = {
        page: 1,
        limit: 6,
        bulletinType: '-1'
      }
      API.getList(data).then(res => {
        if (res.code === 0) {
          this.newList = res.data.records
        }
      })
    },
    jumpPage(id) {
      const routeData = this.$router.resolve({ path: '/informationDetail', query: { id } })
      window.open(routeData.href, '_blank')
    }
  },
  mounted() {
    this.getHeight()
    this.getDetails()
  },
}
</script>
<style lang="less" scoped>
.container {
  background-color: #ffffff;
  position: absolute;
  margin: 0 auto;
  width: 100%;
  top: 0;
  left: 0;
  font-family: "Noto Sans S Chinese";
  .container-box {
    max-width: 1200px;
    margin: auto;
    margin-top: 100px;
    .container-left {
      width: 860px;
      margin-bottom: 100px;
      .bread-router {
        width: 100%;
        padding-bottom: 20px;
        border-bottom: 1px solid #f0f0f0;
        .bread-container {
          max-width: 1200px;
          margin: auto;
          h3 {
            display: inline-block;
            color: #666;
            font-size: 14px;
            font-weight: 400;
          }
        }
      }
      .article-title {
        font-size: 26px;
        font-weight: 700;
        color: #333;
        margin-top: 30px;
      }
      .other-info {
        font-size: 14px;
        color: #999;
        margin-top: 16px;
        span:nth-chils(1) {
          margin-right: 18px;
        }
      }
      .article-coniner {
        margin-top: 56px;
        padding-bottom: 30px;
        border-bottom: 1px solid #f0f0f0;
        line-height: 30px;
      }
      .change-page {
        margin-top: 30px;
        color: #666;
        span {
          cursor: pointer;
        }
        span:hover {
          color: #16ade9;
        }
      }
    }
    .container-right {
      margin-left: 40px;
      width: 300px;
      .right-title {
        font-weight: 500px;
        font-size: 24px;
        color: #333;
      }
      .news-list {
        margin-top: 20px;
        .list-item {
          margin-top: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f0f0f0;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          cursor: pointer;
          span:nth-child(1) {
            color: #fff;
            position: relative;
            img {
              vertical-align: middle;
            }
            span {
              position: absolute;
              font-size: 12px;
              left: 6px;
              top: 0px;
            }
          }
          .news-title {
            color: #666;
            font-size: 14px;
            margin-left: 6px;
          }
        }
        .list-item:nth-last-child {
          border-bottom: none;
        }
        .list-item:hover .news-title {
          color: #16ade9;
        }
      }
      .ad-banner {
        margin-top: 30px;
        width: 100%;
        height: 275px;
        // background: #f8f8fa;
        display: block;
        overflow: hidden;
        img {
          width: 100%;
          height: auto;
        }
      }
    }
  }
}
/deep/ .ivu-breadcrumb-item-separator {
  color: #666;
  font-size: 14px;
}
/deep/ .ivu-breadcrumb > span:last-child {
  font-size: 14px;
  color: #666;
  font-weight: 400;
}
/deep/ .article-coniner p {
  line-height: 30px !important;
}
</style>
