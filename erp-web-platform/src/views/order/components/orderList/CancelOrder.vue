<template>
  <div>
    <a-modal
      title="取消订单原因"
      :visible="true"
      width="685px"
      destroyOnClose
      @ok="cancelOk()"
      @cancel="$emit('cancelFalse')"
      :maskClosable="false"
    >
      <div class="me-reason">
        <span
          class="band"
          v-for="(item, index) in reasonList"
          :key="item.value"
          :class="{ active: item.active }"
          @click="reasonSelect(index)"
        >
          {{ item.value }}
          <span></span>
        </span>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Order from '@/api/order'
export default {
  props: {
    selectedOrdersn: {
      type: String
    }
  },
  data() {
    return {
      reasonId: 1, //选中原因id
      reasonList: [
        //取消原因
        {
          id: 1,
          value: '库存不足',
          active: true
        },
        {
          id: 2,
          value: '用户申请取消',
          active: false
        },
        {
          id: 3,
          value: '无法送达区域',
          active: false
        },
        {
          id: 4,
          value: '不支持COD',
          active: false
        }
      ]
    }
  },
  created() {
    console.log(this.selectedOrdersn)
  },
  mounted() {},
  methods: {
    //确定取消
    async cancelOk() {
      await Order.cancelOrder({
        ordersn: this.selectedOrdersn,
        cancelReason: this.$data.reasonId
      })
      this.$emit('getOrderList')
      this.$emit('cancelFalse')
    },
    //选中原因
    reasonSelect(index) {
      this.$data.reasonList.forEach((element) => {
        element.active = false
      })
      this.$data.reasonList[index].active = true
      this.$data.reasonId = this.$data.reasonList[index].id
    }
  }
}
</script>
<style lang="scss" scoped>
.me-reason {
  margin-left: -12px;
}
.band {
  min-width: 150px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: #f5f5f5;
  border-radius: 2px;
  border: 1px solid #f5f5f5;
  display: inline-block;
  cursor: pointer;
  margin-left: 12px;
}
.active {
  border: 1px solid #fd6b36;
  position: relative;
  background: #fff;
  i {
    color: #fd6b36;
    margin: 0 auto;
  }
  span {
    width: 16px;
    height: 16px;
    background: url('../../../../assets/images/shopeeactive.png');
    bottom: 0px;
    right: 0px;
    position: absolute;
  }
}
</style>
