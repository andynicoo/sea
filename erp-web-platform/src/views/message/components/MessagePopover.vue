<template>
  <div class="message-popover">
    <a-popover placement="leftTop" @visibleChange="visibleChange">
      <template slot="title">
        <div class="title">
          <span class="text">{{ $t('common.unreadMessageList') }}</span>
          <span class="btn" @click="goPageAll()">
            {{ $t('common.viewAllMessage') }}
          </span>
          <span class="btn" @click="setRead()" v-if="total > 0">
            {{ $t('common.labelRead') }}
          </span>
        </div>
      </template>
      <template slot="content">
        <div class="list">
          <a-spin :spinning="loadding">
            <div
              class="li"
              v-for="(li, index) of newsList"
              :key="index"
              @click="detail(li)"
            >
              <div class="read-label" v-if="li.readed == 0"></div>
              <div
                v-else
                style="float: left;width: 4px;height:4px;margin-right: 8px;"
              ></div>
              <div class="title">
                <p>
                  【{{ li.noticeTypeText || '-' }}】
                  {{ li.noticeTitle || '-' }}
                </p>
              </div>
              <div class="date">{{ li.publishTime || '-' }}</div>
            </div>
            <p
              v-if="current <= allPages"
              class="loading-more"
              @click="getList()"
            >
              {{ $t('common.loadingMore') }}
            </p>
            <template v-if="newsList.length == 0">
              <div
                style="height: 200px; background: #fff; text-align: center; color: #999"
              >
                <img
                  style="margin-top: 16px"
                  src="@/assets/images/no-data.png"
                />
                <p>{{ $t('common.noneUnreadMessage') }}</p>
              </div>
            </template>
          </a-spin>
        </div>
      </template>

      <span class="message-icon" :class="{ spot: total > 0 }">
        <a-icon type="sound" />
      </span>
    </a-popover>
    <DetailModal
      ref="DetailModal"
      :showNewsList="showNewsList"
      @readSubmit="getTotal()"
    />
  </div>
</template>
<script>
import Basic from '@/api/basic'
import DetailModal from './DetailModal'
export default {
  components: {
    DetailModal
  },
  data() {
    return {
      current: 1,
      allPages: 99999,
      total: 0,
      loadding: false,
      newsList: [], // 消息列表,顶部小喇叭
      showNewsList: [] // 要弹窗的消息列表
    }
  },
  mounted() {
    this.getTotal()
    this.getMessageDetail()
  },
  methods: {
    visibleChange(visible) {
      if (visible) {
        setTimeout(() => {
          this.getList(true)
        }, 500)
      } else {
        this.newsList = []
      }
    },
    goPageAll() {
      this.$router.push('/message/list')
    },
    setRead() {
      Basic.addMessageRead({
        ids: null
      }).then(({ data }) => {
        this.getList(true)
      })
    },
    detail(li) {
      this.showNewsList = []
      this.showNewsList.push(li)
      this.$refs.DetailModal.showModal = true
    },
    // 获取详细内容 看是否有强弹消息
    getMessageDetail() {
      Basic.getNoticeDataDetail({
        id: null
      }).then(({ data }) => {
        // 每次得到的data包含只弹出一次/每次登录弹出和每次刷新弹出(noticeFrequency===1/2/3),每次登录弹出并且已经sessionStorage存储id要过滤掉，已经弹出过了
        data.map((ele) => {
          let storeId = sessionStorage.getItem(ele.id)
          if (
            ele.noticeFrequency === 1 ||
            (storeId !== 'true' && ele.noticeFrequency === 2) ||
            ele.noticeFrequency === 3
          ) {
            this.showNewsList.push(ele)
          }
        })
        if (this.showNewsList.length) {
          this.$refs.DetailModal.showModal = true
        }
      })
    },
    getTotal() {
      Basic.getMessageList({
        size: 1,
        page: 1,
        readStatus: 0
      }).then((res) => {
        const data = res.data || {}
        this.total = data.total || 0
        this.allPages = data.pages || 0
      })
    },
    //获取消息列表
    getList(resetCurrent = false) {
      if (resetCurrent) {
        this.current = 1
      }
      this.loadding = true
      Basic.getMessageList({
        size: 10,
        page: this.current,
        readStatus: 0
      })
        .then((res) => {
          const data = res.data || {}
          this.total = data.total || 0
          this.allPages = data.pages || 0
          if (this.current === 1) {
            this.newsList = []
          }
          this.newsList = this.newsList.concat(data.records || [])
          this.loadding = false
          this.current++
        })
        .catch(() => {
          this.loadding = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.message-icon {
  font-size: 16px;
  padding: 2px;
  margin: 0 10px;
  position: relative;
  cursor: pointer;
}
.spot:before {
  position: absolute;
  right: 0;
  top: 0;
  content: ' ';
  width: 6px;
  height: 6px;
  border-radius: 6px;
  background: red;
}
.title {
  line-height: 30px;
  display: flex;
  .text {
    flex: 1;
    font-weight: bold;
  }
  .btn {
    width: 90px;
    text-align: center;
    cursor: pointer;
  }
}
.list {
  width: 520px;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
  .li {
    width: 500px;
    height: 24px;
    line-height: 24px;
    margin: 3px 0;
    display: flex;
    cursor: pointer;
    .read-label {
      float: left;
      width: 4px;
      height: 4px;
      background: red;
      border-radius: 4px;
      margin-top: 10px;
      margin-right: 8px;
    }
    .title {
      float: left;
      width: 360px;
      height: 44px;
      overflow: hidden;
      p {
        display: inline-block;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .date {
      width: 150px;
      text-align: right;
    }
  }
  .loading-more {
    margin: 10px 0;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
