<template>
  <div>
    <i class="el-icon-chat-dot-square message-icon" @click="openMessage()">
      <span class="num" v-if="total.ALL > 0"> {{ total.ALL < 100 ? total.ALL : '99+' }} </span>
    </i>

    <el-drawer :visible.sync="showDrawer" direction="rtl" :withHeader="false" size="571px" custom-class="drawer-wrap">
      <div class="drawer-title">
        <span class="text">消息</span>
        <span class="close-btn" @click="showDrawer = false">
          <i class="el-icon-close"></i>
        </span>
      </div>
      <div class="content">
        <div class="nav-list">
          <div class="nav-li" v-for="(item, index) in navList" :key="index" :class="{ active: messageType === item.messageType }" @click="changeType(item.messageType)">
            <img class="icon-svg" :src="item.icon" />
            <span class="name">{{ item.label }}</span>
            <span class="num" v-show="total[item.messageType] > 0">{{ total[item.messageType] > 99 ? '99+' : total[item.messageType] }}</span>
          </div>
        </div>
        <div class="list-wrap">
          <div class="title-set">
            <span class="text" @click="allRead()">全部设为已读</span>
          </div>
          <div class="list-msg" v-infinite-scroll="getList" :infinite-scroll-disabled="loading || noMore">
            <div class="list-li" v-for="(li, index) of list" :key="index">
              <div class="bd">
                <div class="title-text">
                  <span class="text">{{ li.title || '-' }}</span>
                  <span class="details" @click="detail(li)">详情 > </span>
                </div>
                <div class="cell-text" v-for="(cell, key) of li.content.split('\n')" :key="key">{{ cell || '-' }}</div>
                <!-- <template v-if="messageType === 'ORDER'">
                  <div class="cell-text">订单：{{ li.orderNo || '-' }}</div>
                  <div class="cell-text">商品：{{ li.xxxxx || '-' }}</div>
                  <div class="cell-text">凭证金额：￥{{ li.xxxxx || '-' }}</div>
                </template>
                <template v-else-if="messageType === 'SERVICE'">
                  <div class="cell-text">服务号：{{ li.serviceNo || '-' }}</div>
                  <div class="cell-text">商品：{{ li.xxxxx || '-' }}</div>
                  <div class="cell-text">驳回原因：{{ li.xxxxx || '-' }}</div>
                </template>
                <template v-else-if="messageType === 'RENEWAL'">
                  <div class="cell-text">服务号：{{ li.serviceNo || '-' }}</div>
                  <div class="cell-text">公司名称：{{ li.xxxxx || '-' }}</div>
                  <div class="cell-text">服务到期日：{{ li.xxxxx || '-' }}</div>
                </template> -->
              </div>
              <div class="fd">
                <span class="date">{{ dateFormat(li.createTime) }}</span>
                <span class="read-state" v-if="!li.isRead"></span>
              </div>
            </div>
            <p v-if="loading" class="text-tip">加载中...</p>
            <p v-if="noMore && list.length > 0" class="text-tip">没有更多了</p>
            <div class="none-list" v-if="!loading && list.length === 0">
              <img class="icon-svg" src="@/assets/icons/message-empty-basic.svg" />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { getMessageTotal, getBaseMessageList, setMessageRead } from '@/api/newApi/messageCenter/message';
import dayjs from 'dayjs';
import router from '../../../../router';
export default {
  components: {},
  data() {
    return {
      showDrawer: false,
      list: [],
      loading: false,
      noMore: false,
      messageType: 'ORDER', //消息类型： ORDER 订单消息， RENEWAL 续费消息, SERVICE 服务消息, TRADEMARK_CHECK 核名消息
      total: {
        ORDER: 0,
        SERVICE: 0,
        RENEWAL: 0,
        TRADEMARK_CHECK: 0,
        ALL: 0,
      },
      page: {
        current: 1,
        size: 10,
      },
      navList: [
        {
          messageType: 'ORDER',
          icon: require('@/assets/icons/message-order.svg'),
          label: '订单消息',
        },
        {
          messageType: 'SERVICE',
          icon: require('@/assets/icons/message-server.svg'),
          label: '服务通知',
        },
        {
          messageType: 'RENEWAL',
          icon: require('@/assets/icons/message-paytips.svg'),
          label: '续费提醒',
        },
        {
          messageType: 'TRADEMARK_CHECK',
          icon: require('@/assets/icons/message-order.svg'),
          label: '核名消息',
        },
      ],
    };
  },
  watch: {
    showDrawer(newVal) {
      if (newVal) {
        this.resetList();
      }
    },
  },
  created() {
    setTimeout(() => {
      this.getTotal();
    }, 1000);
  },
  methods: {
    //改变消息类型
    changeType(type) {
      this.messageType = type;
      this.resetList();
    },
    //全部设置已读
    allRead() {
      this.setRead([]);
    },
    //详情
    detail(li) {
      if (!li.isRead) {
        this.setRead([li.id]);
      }
      if (li.messageType === 'TRADEMARK_CHECK') {
        router.push(`/adminNewApp/workOrder/intellectualProperty/trademarkNameReviewRecord/details?id=${li.otherId}&recordNo=${li.serviceNo}`);
      } else {
        if (li.businessSector == 'ENTAX') {
          router.push(`/serviceManage/taxRegisterInfo?workOrderId=${li.otherId}&serviceNo=${li.serviceNo}`);
        } else if (li.businessSector == 'ENPROXY') {
          router.push(`/serviceManage/taxInfo?workOrderId=${li.otherId}&serviceNo=${li.serviceNo}`);
        } else {
          router.push('/salesOrder/detail?id=' + li.otherId);
        }
      }

      this.showDrawer = false;
    },
    //设置已读
    setRead(idsArr) {
      setMessageRead({
        ids: idsArr,
        messageType: this.messageType,
      }).then((res) => {
        this.getTotal();
        this.resetList();
      });
    },
    // 获取消息数量
    getTotal() {
      getMessageTotal({}).then((res) => {
        this.total.ORDER = res.data.ORDER || 0;
        this.total.SERVICE = res.data.SERVICE || 0;
        this.total.RENEWAL = res.data.RENEWAL || 0;
        this.total.TRADEMARK_CHECK = res.data.TRADEMARK_CHECK || 0;
        this.total.ALL = this.total.ORDER + this.total.SERVICE + this.total.RENEWAL + this.total.TRADEMARK_CHECK;
      });
    },
    //获取消息列表
    getList() {
      this.loading = true;
      getBaseMessageList({
        messageType: this.messageType,
        current: this.page.current++,
        size: this.page.size,
      })
        .then((res) => {
          this.loading = false;
          if (res.code === 0) {
            if (res.data.records.length === 0) {
              this.noMore = true;
            }
            this.list = this.list.concat(res.data.records || []);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //重置搜索列表
    resetList() {
      this.noMore = false;
      this.list = [];
      this.page.current = 1;
      this.getList();
    },
    //时间转换
    dateFormat(date) {
      let timeStr = date;
      const pDate = new Date(date);
      const nowDate = new Date();
      if (pDate.getFullYear() === nowDate.getFullYear()) {
        timeStr = date.split(nowDate.getFullYear() + '-')[1];
        if (pDate.getMonth() === nowDate.getMonth()) {
          if (pDate.getDate() === nowDate.getDate()) {
            timeStr = '今天 ' + date.split(' ')[1];
          } else if (pDate.getDate() === dayjs().subtract(1, 'day').toDate().getDate()) {
            timeStr = '昨天 ' + date.split(' ')[1];
          }
        }
      }
      return timeStr;
    },
    //打开消息侧边弹窗
    openMessage() {
      this.showDrawer = true;
    },
  },
};
</script>

<style scoped lang="scss">
.message-icon {
  font-size: 18px;
  margin-top: 2px;
  line-height: 62px;
  margin-right: 10px;
  position: relative;
  .num {
    position: absolute;
    top: 10px;
    right: -10px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #fff;
    text-align: center;
    background-color: red;
    border-radius: 20px;
  }
}
.drawer-wrap {
  .drawer-title {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #dcdfe6;
    overflow: hidden;
    .text {
      font-size: 16px;
      color: #333333;
      font-weight: 500;
      margin-left: 28px;
    }
    .close-btn {
      float: right;
      margin-right: 20px;
      i {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
  .content {
    height: calc(100% - 48px);
    background-color: #edeef0;
    display: flex;
    .nav-list {
      width: 160px;
      background-color: #fff;
      .nav-li {
        height: 44px;
        line-height: 44px;
        padding: 0 17px;
        overflow: hidden;
        .icon-svg {
          float: left;
          font-size: 14px;
          width: 14px;
          height: 14px;
          margin: 15px 3px;
        }
        .name {
          float: left;
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          margin-left: 3px;
        }
        .num {
          float: right;
          width: 20px;
          height: 20px;
          line-height: 20px;
          border-radius: 18px;
          font-size: 12px;
          text-align: center;
          color: #fff;
          margin: 12px 0;
          background-color: #e72014;
        }
      }
      .active {
        background-color: #edeef0;
      }
    }
    .list-wrap {
      flex: 1;
      .title-set {
        height: 44px;
        line-height: 44px;
        padding: 0 20px;
        .text {
          float: right;
          color: #1890ff;
        }
      }
      .list-msg {
        padding: 0 12px;
        height: calc(100% - 44px);
        overflow-y: auto;
        .list-li {
          background-color: #fff;
          margin-bottom: 15px;
          .bd {
            padding: 20px;
            .title-text {
              height: 24px;
              line-height: 24px;
              margin-bottom: 8px;
              font-size: 14px;
              font-weight: 500;
              color: #333;
              overflow: hidden;

              .text {
                float: left;
              }
              .details {
                float: right;
                color: #1890ff;
              }
            }
            .cell-text {
              font-size: 14px;
              color: #666;
              line-height: 24px;
            }
          }
          .fd {
            border-top: 1px solid #dcdfe6;
            height: 46px;
            line-height: 46px;
            padding: 0 20px;
            overflow: hidden;
            .date {
              float: left;
              font-size: 14px;
              color: #999;
            }
            .read-state {
              float: right;
              width: 8px;
              height: 8px;
              border-radius: 8px;
              background-color: #e72014;
              margin: 19px 0;
            }
          }
        }
        .none-list {
          text-align: center;
          padding-top: 30%;
        }
        .text-tip {
          text-align: center;
          line-height: 30px;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
