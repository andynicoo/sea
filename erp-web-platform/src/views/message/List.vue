<template>
  <div class="me-pa-2">
    <div class="infomation">
      <div class="menu">
        <div class="tit">{{ $t('common.notification') }}</div>
        <div>
          <ul>
            <li
              v-for="(li, index) of munuTypeList"
              :key="index"
              :class="{ cur: type == li.code }"
              @click="changeReadStatus(li)"
            >
              <span v-show="type == li.code"></span> {{ li.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="infolist">
        <div class="search-form">
          <div class="title">{{ listTitle }}</div>

          <div class="btn" v-if="type != 1">
            <span @click="setRead('all')">
              {{ $t('common.labelRead') }}
            </span>
          </div>
          <div class="btn" v-if="type != 1">
            <span @click="setRead('current')">
              {{ $t('common.thisPageLabelRead') }}
            </span>
          </div>
        </div>
        <div class="content">
          <template v-if="newList.length !== 0">
            <ul>
              <li
                v-for="item in newList"
                :key="item.id"
                @click="routerToNews(item)"
              >
                <div class="read-label" v-if="item.readed == 0"></div>
                <div
                  v-else
                  style="float: left;width: 4px;height:4px;margin-right: 8px;"
                ></div>
                <div class="title">
                  <p>
                    【<span v-show="item.noticeType === 1">更新通知</span>
                    <span v-show="item.noticeType === 2">活动通知</span>
                    <span v-show="item.noticeType === 3">其他通知</span>】
                    {{ item.noticeTitle || '-' }}
                  </p>
                </div>
                <div class="date">{{ item.publishTime || '-' }}</div>
              </li>
            </ul>
          </template>
          <template v-else>
            <div
              style="height: 500px; background: #fff; text-align: center; color: #999"
            >
              <img style="margin-top: 56px" src="@/assets/images/no-data.png" />
              <p>{{ $t('common.noData') }}</p>
            </div>
          </template>
          <div
            v-if="newList.length !== 0"
            class="center me-text-center me-mt-4"
          >
            <a-space>
              共有 {{ paginationData.total }} 条数据
              <a-pagination
                show-size-changer
                show-quick-jumper
                :pageSize="paginationData.size"
                v-model="paginationData.current"
                :default-current="paginationData.current"
                :total="paginationData.total"
                @showSizeChange="onShowSizeChange"
                @change="changePagination"
              />
            </a-space>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Basic from '@/api/basic'
export default {
  components: {},
  data() {
    return {
      listTitle: '所有消息',
      munuTypeList: [
        { code: null, name: '所有消息' },
        { code: 0, name: '未读消息' },
        { code: 1, name: '已读消息' }
      ],
      type: null,

      paginationData: {
        current: 1,
        size: 10,
        total: 0
      },
      searchVal: '', // 搜索项
      newList: [] // 右侧列表
    }
  },
  mounted() {
    if (this.$route.query.type == 0) {
      this.changeReadStatus(this.munuTypeList[1])
    } else if (this.$route.query.type == 1) {
      this.changeReadStatus(this.munuTypeList[2])
    } else {
      this.changeReadStatus(this.munuTypeList[0])
    }
  },
  methods: {
    setRead(type) {
      let noticeIdArr = []
      if (type == 'current') {
        for (let li of this.newList) {
          noticeIdArr.push(li.id)
        }
      }
      //console.log(noticeIdArr)
      Basic.addMessageRead({
        ids: type === 'all' ? null : noticeIdArr
      }).then(({ data }) => {
        this.paginationData.current = 1
        this.getMessageList()
      })
    },
    //切换消息类型
    changeReadStatus(li) {
      this.type = li.code
      this.listTitle = li.name
      this.getMessageList()
    },
    //获取消息列表
    getMessageList() {
      Basic.getMessageList({
        size: this.paginationData.size,
        page: this.paginationData.current,
        readStatus: this.type
      }).then((res) => {
        console.log(res)
        const data = res.data || {}
        this.newList = data.records || []
        this.paginationData.total = data.total || 0
      })
    },
    //改变当前页
    changePagination(current, size) {
      this.paginationData.current = current
      this.getMessageList()
    },
    //改变每页数量
    onShowSizeChange(current, pageSize) {
      this.paginationData.current = current
      this.paginationData.size = pageSize
      this.getMessageList()
    },
    //跳转到单个新闻
    routerToNews(item) {
      this.$router.push({
        path: `/message/detail?type=${this.type}&id=${item.id}`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.infomation {
  display: flex;
  max-width: 1200px;
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
    margin-left: 20px;
    margin: 0 auto;
    .search-form {
      display: flex;
      line-height: 32px;
      padding: 20px;
      .title {
        flex: 1;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #1a1a1a;
        padding-left: 10px;
      }
      .btn {
        width: 110px;
        font-size: 14px;
        color: #666;
        text-align: center;
        span {
          cursor: pointer;
        }
      }
    }
    .content {
      margin-bottom: 30px;
      ul {
        padding-left: 0px;
        li {
          line-height: 44px;
          height: 44px;
          background: #ffffff;
          border-bottom: 1px solid #ebebeb;
          padding-left: 24px;
          font-size: 14px;
          cursor: pointer;
          overflow: hidden;
          .read-label {
            float: left;
            width: 4px;
            height: 4px;
            background: red;
            border-radius: 4px;
            margin-top: 20px;
            margin-right: 8px;
          }
          .title {
            float: left;
            width: 760px;
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
            float: right;
            width: 160px;
            color: #9a9ca1;
            text-align: right;
            padding-right: 16px;
          }
        }
        li:hover {
          background: #fafafa;
        }
      }
    }
  }
}
</style>
