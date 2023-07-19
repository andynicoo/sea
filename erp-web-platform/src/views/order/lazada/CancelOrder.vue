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
import LazadaOrder from '@/api/lazadaOrder'
export default {
  props: {
    selectedOrder: {
      type: Object
    },
    selectedRows: {
      type: Object
    }
  },
  data() {
    return {
      reasonId: 10, //选中原因id
      reasonList: [
        //取消原因
        {
          id: 10,
          value: '采购延迟',
          active: true
        },
        {
          id: 15,
          value: '无库存',
          active: false
        },
        {
          id: 21,
          value: '错误的价格或定价错误',
          active: false
        }
      ],
      reasonTxt: '' //取消原因
    }
  },
  created() {
    console.log(this.selectedOrder)
  },
  mounted() {},
  methods: {
    //确定取消
    async cancelOk() {
      let items = []
      this.selectedOrder.items.forEach((item) => {
        items.push(item.orderItemId)
      })
      await LazadaOrder.cancelLazadaOrder({
        orderItemIdsStr: items.join(),
        storeId: this.selectedRows.storeId,
        reasonId: this.$data.reasonId,
        reasonDetail: this.reasonTxt
      })
      this.$message.success('操作成功')
      this.$emit('loadData')
      this.$emit('cancelFalse')
    },
    //选中原因
    reasonSelect(index) {
      this.$data.reasonList.forEach((element) => {
        element.active = false
      })
      this.$data.reasonList[index].active = true
      this.$data.reasonId = this.$data.reasonList[index].id
      this.$data.reasonTxt = this.$data.reasonList[index].value
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
  padding: 0 10px;
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
    background: url('../../../assets/images/shopeeactive.png');
    bottom: 0px;
    right: 0px;
    position: absolute;
  }
}
</style>
