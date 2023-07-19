<template>
  <div class="me-pa-2 information _info">
    <div class="infomation">
      <div class="menu">
        <div class="tit">
          {{ $t('common.notification') }}
        </div>
        <div>
          <ul>
            <li
              v-for="(li, index) of munuTypeList"
              :key="index"
              :class="{ cur: $route.query.type == li.code }"
              @click="changeReadStatus(li)"
            >
              <span v-show="$route.query.type == li.code"></span>
              {{ li.name }}
            </li>
          </ul>
        </div>
      </div>

      <div class="infolist">
        <div class="tit">
          <h2>
            【<em v-show="noticeType === 1">更新通知</em>
            <em v-show="noticeType === 2">活动通知</em>
            <em v-show="noticeType === 3">其他通知</em>】{{ curTitle || '-' }}
          </h2>
          <span>{{ timeLine || '-' }}</span>
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
      munuTypeList: [
        { code: 'null', name: '所有消息' },
        { code: 0, name: '未读消息' },
        { code: 1, name: '已读消息' }
      ],
      searchVal: '', // 搜索项
      noticeType: '',
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
    this.getMessageDetail(this.$route.query.id)
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
  methods: {
    //切换消息类型
    changeReadStatus(li) {
      this.$router.push({
        path: `/message/list?type=${li.code}`
      })
    },
    closeViewer() {
      this.$data.visible = false
    },
    // 获取详细内容
    getMessageDetail(id) {
      Basic.getNoticeDataDetailById({
        id: id
      }).then(({ data }) => {
        //是否已读 0未读 1已读
        if (data.readed == 0) {
          this.setRead(data.id)
        }
        this.noticeType = data.noticeType
        this.curTitle = data.noticeTitle
        this.timeLine = data.publishTime
        this.html = data.noticeContent
      })
    },
    //设置已读
    setRead(id) {
      Basic.addMessageRead({
        ids: [id]
      }).then(({ data }) => {
        console.log(data)
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
  justify-content: space-between;
  .menu {
    width: 200px;
    margin-right: 20px;
    .tit {
      line-height: 35px;
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #1a1a1a;
      padding-left: 20px;
      background: #fff;
      border-bottom: 1px solid #efefef;
    }
    ul {
      padding-left: 0px;
      li {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #626466;
        line-height: 40px;
        cursor: pointer;
        padding-left: 23px;
        position: relative;
        background: #fff;
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
    background: #fff;
    padding: 29px 40px 50px 40px;
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

//
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
