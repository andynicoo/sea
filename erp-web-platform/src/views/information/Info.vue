<template>
  <div class="me-pa-2 information _info">
    <div class="infomation">
      <div class="menu" :style="{ height: menuHeight }">
        <div class="tit" v-if="$route.query.type == 1">
          {{ $t('overView.guideToUse') }}
        </div>
        <div class="tit" v-if="$route.query.type == 2">
          {{ $t('overView.productTrends') }}
        </div>
        <div>
          <ul>
            <li
              v-for="item in newTypeList"
              :key="item.name"
              :class="{ cur: item.classifyId == $route.query.listId }"
              @click="goList(item)"
            >
              <span v-show="item.classifyId == $route.query.listId"></span>
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="infolist">
        <div class="tit">
          <h2>{{ curTitle }}</h2>
          <span>{{ timeLine }}</span>
        </div>
        <div class="contents" id="ids" v-html="html"></div>
      </div>
      <ImageViewer v-if="visible" :url="imageUrl" @closeViewer="closeViewer" />
    </div>
  </div>
</template>
<script>
import Basic from '@/api/basic'
import ImageViewer from '@/components/ImageViewer'
export default {
  data() {
    return {
      searchVal: '', // 搜索项
      curTitle: '',
      timeLine: '',
      newTypeList: [],
      html: '',
      visible: false,
      imageUrl: ''
    }
  },
  components: {
    ImageViewer
  },
  mounted() {
    // console.log(this.$route.query);
    this.getNewsList()
    this.getSingleNews(this.$route.query.newsId)

    this.$nextTick(() => {
      document.getElementById('ids').addEventListener('click', (e) => {
        console.log(e.target.currentSrc)
        let nodeName = e.target.nodeName
        if (nodeName == 'IMG') {
          this.$data.imageUrl = e.target.currentSrc
          this.$data.visible = true
        }
      })
    })
  },
  computed: {
    menuHeight() {
      return 35 + this.newTypeList.length * 40 + 'px'
    }
  },
  methods: {
    closeViewer() {
      this.$data.visible = false
    },
    // 搜索
    handleSearch() {},
    // 根据分类type获取左侧列表
    getNewsList() {
      let params = {
        module: this.$route.query.type,
        classifyId: this.$route.query.listId,
        size: 10,
        current: 1
      }
      Basic.getNewsTypeList(params).then((res) => {
        if (res.code == 0) {
          // console.log(res)
          this.newTypeList = res.data
        }
      })
    },
    // 根据参数获取单篇资讯内容
    getSingleNews(id) {
      Basic.getSingleNews(id).then(({ data }) => {
        this.curTitle = data.title
        this.timeLine = data.createTime
        this.html = data.content
      })
    },
    // 前往列表
    goList(item) {
      this.$router.push({
        path: `/information/info-list?type=${item.module}&listId=${item.classifyId}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.infomation {
  display: flex;
  width: 1200px;
  margin: 0 auto;
  .menu {
    width: 200px;
    background: #fff;
    .tit {
      line-height: 35px;
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #1a1a1a;
      padding-left: 20px;
      border-bottom: 1px solid #efefef;
    }
    ul {
      padding-left: 0px;
      li {
        height: 40px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #626466;
        line-height: 40px;
        cursor: pointer;
        padding-left: 23px;
        position: relative;
        span {
          display: none;
          position: absolute;
          height: 14px;
          width: 2px;
          background: #ff720d;
          top: 14px;
          left: 0px;
        }
      }
      li:hover {
        background: #fafafa;
      }
      li.cur {
        background: #fff4ed;
        color: #ff720d;
        span {
          display: block;
        }
      }
    }
  }
  .infolist {
    flex: 1;
    max-width: 980px;
    width: 980px;
    background: #fff;
    margin-left: 20px;
    padding: 29px 40px 50px 60px;
    .tit {
      h2 {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #1a1a1a;
        line-height: 38px;
        font-size: 24px;
      }
      span {
        height: 17px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #919191;
        line-height: 17px;
      }
    }
    .contents {
      margin-bottom: 80px;
      border-top: 1px solid #e3e3e3;
      margin-top: 15px;
      padding-top: 15px;
      font-size: 14px;
      line-height: 28px;
      max-width: 880px;
      width: 880px;
      overflow: hidden;
    }
  }
}
</style>

<style lang="scss">
.information {
  &._info {
    .contents {
      p {
        img {
          max-width: 880px;
        }
      }
      img {
        max-width: 880px;
      }
    }
  }
}
</style>
