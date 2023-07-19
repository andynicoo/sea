<template>
  <div class="container"
       :style="contentStyleObj">
    <div class="top-banner"></div>
    <div class="bread-router">
      <p class="bread-container">
        <Breadcrumb separator=">">
          <BreadcrumbItem to="/login"
                          target="_blank">
            <h3>首页</h3>
          </BreadcrumbItem>
          <BreadcrumbItem>新闻资讯</BreadcrumbItem>
        </Breadcrumb>
      </p>
    </div>
    <div class="container-box">
      <div class="top-tab">
        <span class="tab-item"
              v-for="(item,index) in tabList"
              :key="index"
              :class="tabIndex==index? 'tab-active' : ''"
              @click="changeTab(item.status)">{{item.name}}</span>
      </div>
      <div class="article-list">
        <a class="article-item clearfix"
           target="_blank"
           @click="toArticleDetail($event,item.id)"
           v-for="(item,index) in articleList"
           :key="index">
          <div class="main-img fl">
            <img :src="item.bulletinMainPicture"
                 alt="">
          </div>
          <div class="article-info fl">
            <div class="article-title">{{item.bulletinTitle}}</div>
            <div class="article-content">{{item.bulletinSummary}}</div>
            <div class="article-time">{{item.createTime}}</div>
          </div>
        </a>
      </div>
      <div class="page-info">
        <Page @on-change="changePageHandler"
              :current="pageInfo.page"
              :total="listTotal"
              :page-size="pageInfo.limit"
              show-total />
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
      tabList: [
        {
          status: '-1',
          name: '全部'
        },
        {
          status: '0',
          name: 'VAT资讯'
        },
        {
          status: '1',
          name: '专家解读'
        },
        {
          status: '2',
          name: '通知公告'
        }
      ],
      tabIndex: 0,
      pageInfo: {
        page: 1,
        limit: 10,
        bulletinType: '-1'
      },
      listTotal: 0,
      articleList: [],
      title: '跨税云_资讯列表'
    }
  },
  metaInfo() {
    return {
      title: '跨税云_资讯列表(' + this.pageInfo.page + ')' // set a title
    }
  },
  methods: {
    getHeight() {
      // debugger;
      this.contentStyleObj.height = window.screen.height + "px";
    },
    getListInfo() {
      let data = { ...this.pageInfo }
      API.getList(data).then(res => {
        if (res.code === 0) {
          this.articleList = res.data.records
          this.listTotal = res.data.totalCount - 0
        }
      })
    },
    changeTab(status) {
      this.tabIndex = status - 0 + 1
      this.pageInfo.bulletinType = status
      this.getListInfo()
    },
    toArticleDetail(e, id) {
      // console.log(e)
      const routeData = this.$router.resolve({ path: '/informationDetail', query: { id } })
      window.open(routeData.href, '_blank')
    },
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getListInfo()
    }
  },
  mounted() {
    this.getHeight()
    this.getListInfo()
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
  .top-banner {
    width: 100%;
    height: 350px;
    background: url("../../assets/images/information/banner.png") center center
      no-repeat;
    text-align: center;
    color: #ffffff;
    margin-top: 72px;
    padding-top: 100px;
  }
  .bread-router {
    width: 100%;
    height: 40px;
    background-color: #f6f8fb;
    line-height: 40px;
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
  .container-box {
    max-width: 1200px;
    margin: auto;
    color: #666;
    .top-tab {
      margin-top: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid #f0f0f0;
      .tab-item {
        display: inline-block;
        width: 110px;
        height: 38px;
        text-align: center;
        line-height: 38px;
        font-size: 18px;
        font-family: "Noto Sans S Chinese";
        border: 1px solid #e8e8e8;
        border-radius: 5px;
        margin-right: 20px;
        cursor: pointer;
      }
      .tab-active {
        background-color: #16ade9;
        color: #ffffff;
      }
    }
    .article-list {
      margin-top: 30px;
      .article-item {
        padding: 30px 95px 30px 0;
        border-bottom: 1px solid #f0f0f0;
        width: 100%;
        display: block;
        .main-img {
          width: 268px;
          height: 160px;
          border-radius: 4px;
          overflow: hidden;
          img {
            width: 100%;
            border: 4px;
          }
        }
        .article-info {
          margin-left: 19px;
          color: #999;
          font-size: 14px;
          width: 818px;
          position: relative;
          height: 160px;
          .article-title {
            font-size: 24px;
            &:hover {
              color: #16ade9;
            }
          }
          .article-content {
            margin-top: 16px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .article-time {
            position: absolute;
            bottom: 0;
          }
        }
      }
    }
    .page-info {
      width: 100%;
      margin: 40px;
      text-align: center;
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
/deep/ .ivu-page-total {
  color: #999;
}
</style>
