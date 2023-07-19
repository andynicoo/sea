<template>
  <div class="me-pa-2">
    <!-- 面包屑 -->
    <a-breadcrumb class="me-tabs-warp">
      <a-breadcrumb-item>
        <router-link :to="$route.query.source" class="me-link-h">{{
          $route.query.source == '/order/page' ? '全部订单' : '待处理订单'
        }}</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>
        <router-link
          :to="{
            path: $route.query.source,
            query: { as: true, ca: $route.query.cancel }
          }"
          class="me-link-h"
          >{{ $route.query.cancel ? '取消' : '售后' }}</router-link
        >
      </a-breadcrumb-item>
      <a-breadcrumb-item>查看退款/退货详情</a-breadcrumb-item>
    </a-breadcrumb>

    <dl v-if="$route.query.cancel || operationTime" class="me-detail-block">
      <dt>
        {{ cancelType == 1 ? '卖家已取消' : '买家已提出退款' }}
        {{ $route.query.country }}
        {{ $route.query.price }}
      </dt>
      <dd v-if="orderCanelDetail">
        <template v-if="operation === false">
          <p>卖家拒绝退款</p>
          {{ orderCanelDetail.orderShopeeOrderAddres.updateTime }}
        </template>
        <template v-else>
          <p>卖家同意退款</p>
          {{ orderCanelDetail.orderShopeeOrderAddres.updateTime }}
        </template>
      </dd>
      <dd v-if="cancelType == 1">
        <p>卖家取消原因</p>
        {{ cancelReason[remarks] ? cancelReason[remarks] : remarks }}
      </dd>
      <dd v-else class="me-remarks">
        <p>卖家备注</p>
        {{ remarks }}
      </dd>
    </dl>
    <dl v-else class="me-detail-block">
      <dt>
        买家已提出退款 {{ $route.query.country }} {{ $route.query.price }}
      </dt>
      <!-- <dd>
        <i class="iconfont icondingshifabu1"></i>倒计时
        <span class="me-status-primary">{{ remainingTime }}</span
        >，超时未处理买家申请将被自动接受
      </dd> -->
      <dd>
        <a-button type="primary" class="me-mr-2" @click="handleAgree"
          >同意</a-button
        >
        <a-button @click="handleRefuse">拒绝</a-button>
      </dd>
      <dd class="me-remarks">
        <p>卖家备注</p>
        <a-textarea
          v-model="remarks"
          placeholder="在此输入备注"
          :maxLength="500"
          :auto-size="{ minRows: 4, maxRows: 8 }"
        />
      </dd>
    </dl>
    <dl
      class="me-detail-block me-application-information"
      v-if="orderCanelDetail && cancelType != 1"
    >
      <dt>买家申请信息</dt>
      <dd>
        <span>申请单号:</span>
        <div>{{ orderCanelDetail.orderShopeeOrderAddres.ordersn }}</div>
      </dd>
      <dd>
        <span>收件地址:</span>
        <div>
          {{ orderCanelDetail.orderShopeeOrderAddres.fullAddress }}
        </div>
      </dd>
      <dd>
        <span>退货/退款原因:</span>
        <div>
          <p>{{ orderCanelDetail.cancelReason }}</p>
        </div>
      </dd>
      <dd>
        <span>物流信息:</span>
        <div class="me-w50b" v-if="orderCanelDetail.trackingNo">
          Standard Express
          <a-tag color="orange">{{ orderCanelDetail.trackingNo }}</a-tag>
          <ul class="me-LogisticsInfor-list" v-if="orderCanelDetail">
            <li
              v-for="item in orderCanelDetail.orderShopeeOrderTrackingInfo
                .trackingInfo"
              :key="item.updateTime"
            >
              <p>{{ item.description }}</p>
              {{ moment(item.updateTime).format('YYYY-MM-DD hh:mm:ss') }}
            </li>
          </ul>
        </div>
      </dd>
    </dl>
  </div>
</template>

<script>
import Order from '@/api/order'
import moment from 'moment'
export default {
  data() {
    return {
      moment,
      // url: 'https://s-cf-tw.shopeesz.com/file/e7b7031ea45d9795426ca2fc33850301',
      remarks: '', //备注
      operation: '', //售后操作状态同意或拒绝
      operationTime: '', //操作时间
      orderCanelDetail: '', //取消订单详情
      remainingTime: '',
      cancelType: 1, //取消类型 1卖家主动取消 2卖家审批取消
      cancelReason: {
        OUT_OF_STOCK: '库存不足',
        CUSTOMER_REQUEST: '用户申请取消',
        UNDELIVERABLE_AREA: '无法送达区域',
        COD_NOT_SUPPORTED: '不支持COD'
      }
    }
  },
  created() {
    this.getLog()
    // if (!this.$route.query.cancel) {
    //   clearInterval(this.timeInterAfterSale) //售后倒计时
    //   this.countDown()
    //   this.timeInterAfterSale = setInterval(() => this.countDown(), 1000)
    // }
  },
  mounted() {},
  methods: {
    //获取售后状态和详情
    async getLog() {
      let { data } = await Order.OrderCancelLog({
        ordersn: this.$route.query.sn
      })
      if (data.length) {
        let lastData = data[data.length - 1]
        this.operation = lastData.operation
        this.operationTime = lastData.operationTime
        this.remarks = lastData.remarks
        this.cancelType = lastData.cancelType
      }
      let res = await Order.getOrderShopOrderCanelDetail({
        ordersn: this.$route.query.sn
      })
      this.$data.orderCanelDetail = res.data
    },
    //同意
    handleAgree() {
      this.$confirm({
        title: this.$t('common.warn'),
        content: '您确定同意退款/退货吗？',
        onOk: async () => {
          await Order.handleBuyerCancellation({
            operation: 1,
            ordersn: this.$route.query.sn,
            remarks: this.$data.remarks
          })
          this.getLog()
          this.syncOrder(this.$route.query.sn)
          this.$message.success(this.$t('common.handlerSuccess'))
        }
      })
    },
    //拒绝
    handleRefuse() {
      this.$confirm({
        title: this.$t('common.warn'),
        content: '您确定拒绝退款/退货吗？',
        onOk: async () => {
          await Order.handleBuyerCancellation({
            operation: 2,
            ordersn: this.$route.query.sn,
            remarks: this.$data.remarks
          })
          this.getLog()
          this.syncOrder(this.$route.query.sn)
          this.$message.success(this.$t('common.handlerSuccess'))
        }
      })
    },
    //倒计时
    // countDown() {
    //   let orderCreateTime = this.$route.query.cancelTime
    //   let country = this.$route.query.country
    //   if (orderCreateTime) {
    //     let addTime = 172800000
    //     let today = moment(orderCreateTime).format('YYYY-MM-DD') + ' 23:59:59'
    //     today = moment(today).format('x') - moment(orderCreateTime).format('x')
    //     if (country == 'VN') {
    //       addTime = today
    //     } else if (country == 'ID') {
    //       addTime = 86400000
    //     }
    //     let d = 0
    //     let nowTime = parseInt(moment(new Date()).format('x'))
    //     let lastTime = parseInt(moment(orderCreateTime).format('x')) + addTime
    //     if (lastTime - nowTime > 0) {
    //       d = moment.duration((lastTime - nowTime) / 1000, 'seconds')
    //       this.$data.remainingTime = `${Math.floor(
    //         d.asDays()
    //       )}天${d.hours()}时${d.minutes()}分${d.seconds()}秒`
    //     } else {
    //       this.$data.remainingTime = `0天0时0分0秒`
    //     }
    //   }
    // },
    // 同步订单 按订单同步
    syncOrder(ids) {
      let params = {
        ordersn: [ids]
      }
      Order.syncOrder(params)
    }
  },
  beforeDestroy() {
    clearInterval(this.timeInterAfterSale)
  }
}
</script>
<style lang="scss" scoped>
.me-tabs-warp {
  padding: 15px 0;
}
.me-detail-block {
  background: #fff;
  padding: 24px 20px;
  margin-bottom: 16px;
  dt {
    color: #ff6b38;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  dd {
    margin-bottom: 30px;
    margin-top: 30px;
  }

  .me-remarks {
    p {
      margin-bottom: 5px;
    }
    textarea {
      width: 500px;
    }
  }
}
.me-application-information {
  dt {
    color: #303133;
    margin-bottom: 26px;
  }
  dd {
    margin-bottom: 12px;
    display: flex;
    span {
      min-width: 110px;
      padding-right: 12px;
      color: #909099;
      text-align: right;
    }
    .ant-tag-orange {
      color: #ff6b38;
    }
  }
}
.me-min-img {
  width: 60px;
  height: 60px;
  border: 1px solid #ddd;
  margin: 10px 16px 0 0;
}
.me-max-img {
  width: 220px;
  height: 220px;
}
.me-LogisticsInfor-list {
  margin-top: 10px;
  width: 100%;
  background: #fafafa;
  padding: 16px 34px;
  color: #909099;
  li {
    margin-bottom: 20px;
  }
  p {
    color: #303133;
    font-weight: 400;
    position: relative;
    margin-bottom: 9px;
    &:before {
      content: '';
      position: absolute;
      top: 4px;
      display: block;
      left: -24px;
      width: 14px;
      height: 14px;
      background: #ccc;
      border: 3px solid #eee;
      border-radius: 50%;
    }
  }
  li:first-child {
    p:before {
      background: #ff6b38;
      border: 3px solid #ffeae3;
    }
  }
}
.me-w50b {
  width: 50%;
}
</style>
