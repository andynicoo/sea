<template>
  <div>
    <a-modal
      title="物流状态"
      :visible="logisticsStatusVisible"
      @cancel="$emit('logisticsStatusClose')"
      width="720px"
    >
      <template slot="footer">
        <a-button @click="$emit('logisticsStatusClose')">关闭</a-button>
      </template>
      <a-steps class="me-ant-steps">
        <a-step :status="status[0].value">
          <template slot="icon">
            <i slot="icon" class="iconfont iconqujian me-status-ic"></i>
            <p class="me-f14 me-status-text">{{ status[0].label }}</p>
          </template>
        </a-step>
        <a-step :status="status[1].value">
          <template slot="icon">
            <i slot="icon" class="iconfont iconpeisong me-status-ic"></i>
            <p class="me-f14 me-status-text">{{ status[1].label }}</p>
          </template>
        </a-step>
        <a-step :status="status[2].value">
          <template slot="icon">
            <i slot="icon" class="iconfont iconpeisong1 me-status-ic"></i>
            <p class="me-f14 me-status-text">{{ status[2].label }}</p>
          </template>
        </a-step>
      </a-steps>
      <a-steps progress-dot direction="vertical" class="me-ant-steps-dot">
        <a-step v-for="(item, index) in logisticsInfo" :key="index">
          <div slot="title" class="me-steps-dot-time">
            {{ moment(item.event_time).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <div slot="description" class="me-steps-dot-desc">
            <h3>{{ item.title }}</h3>
            <p v-html="item.description"></p>
          </div>
        </a-step>
      </a-steps>
    </a-modal>
  </div>
</template>

<script>
import LazadaOrder from '@/api/lazadaOrder'
import moment from 'moment'
export default {
  props: {
    logisticsStatusVisible: {
      type: Boolean
    },
    selectedOrder: {
      type: Object
    },
    selectedRows: {
      type: Object
    }
  },
  components: {},
  data() {
    return {
      moment,
      logisticsInfo: '',
      status: [
        { label: '取件', value: 'finish' },
        { label: '配送', value: 'Waiting' },
        { label: '配送', value: 'Waiting' }
      ]
    }
  },
  computed: {},
  async created() {
    let params = {
      locale: 'zh_CN',
      ofcPackageIdList: [this.selectedOrder.items[0].packageId],
      order_id: this.selectedRows.orderId
    }
    if (this.selectedOrder.items[0].status == 'shipped') {
      this.status = [
        { label: '取件', value: 'finish' },
        { label: '配送', value: 'finish' },
        { label: '配送', value: 'Waiting' }
      ]
    }
    if (this.selectedOrder.items[0].status == 'delivered') {
      this.status = [
        { label: '取件', value: 'finish' },
        { label: '配送', value: 'finish' },
        { label: '配送成功', value: 'finish' }
      ]
    }

    if (
      ['shipped_back_success', 'shipped_back'].includes(
        this.selectedOrder.items[0].status
      )
    ) {
      this.status = [
        { label: '取件', value: 'finish' },
        { label: '配送', value: 'finish' },
        { label: '配送失败', value: 'finish' }
      ]
    }
    let { data } = await LazadaOrder.logisticDetail(params)
    let logisticDetailInfoList = data.result.module[0].package_detail_info_list[0].logistic_detail_info_list.filter(
      (item) => item.title
    )
    this.logisticsInfo = logisticDetailInfoList.reverse()
  },
  beforeDestroy() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
@mixin fs12 {
  font-size: 12px;
  color: #909099;
}
.me-status-ic {
  font-size: 20px;
  background: #999;
  width: 36px;
  height: 36px;
  display: block;
  border-radius: 50%;
  text-align: center;
  line-height: 36px;
  color: #fff;
}
.me-f14 {
  font-size: 14px;
  color: #303133;
}
.ant-steps-item-finish {
  .me-status-ic {
    background: #ff6b38;
  }
}
.me-ant-steps {
  width: 360px;
  margin: 25px auto;
}
.me-ant-steps-dot {
  margin-left: 120px;
  ::v-deep .ant-steps-item:first-child .ant-steps-icon-dot {
    border: 5px solid #ffe7db;
    width: 18px;
    height: 18px;
    left: -5px;
    top: -5px;
  }
  ::v-deep .ant-steps-item-content {
    overflow: inherit;
    min-width: 300px;
    min-height: 70px;
  }

  ::v-deep .ant-steps-item-active {
    .me-steps-dot-desc {
      h3 {
        color: #ff6b38;
      }
    }
  }
}
.me-steps-dot-time {
  @include fs12;
  position: absolute;
  left: -100px;
  width: 70px;
}

.me-steps-dot-desc {
  h3 {
    font-size: 16px;
    color: #303133;
  }
  p {
    @include fs12;
    margin-left: 26px;
  }
}
.me-status-text {
  position: absolute;
  top: 35px;
  left: -40px;
  width: 80px;
}
.me-ant-steps {
  .ant-steps-item {
    padding: 0 20px 30px;
  }
}
</style>
