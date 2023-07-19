<template>
  <a-modal
    :visible="showModal"
    :title="modalTitle"
    @cancel="close"
    @ok="getWaybillNumberOne"
    :confirmLoading="getWayLoad"
  >
    <div class="OrdersId">
      <img />
      <span>订单号：{{ orderSn }}</span>
    </div>
    <div class="box">
      <div
        class=" item"
        v-for="(item, index) in content"
        @click="selectWay(index)"
        :key="index"
      >
        <span class="topRight" v-show="currentIndex == index">{{ tap }}</span>
        <div class="circle-tag" :style="{ 'background-color': item.color }">
          <img :src="item.img" />
        </div>
        <div class="content">
          <span>{{ item.title }}</span>
          <span>{{ item.content }}</span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import Order from '@/api/order'

export default {
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    // currentIndex: {
    //   type: Number,
    //   default: 0
    // },
    modalTitle: {
      type: String,
      default: ''
    },
    content: {
      type: Array,
      default: null
    },
    OrdersId: {
      type: String,
      default: ''
    },
    tap: {
      type: String,
      default: '选中'
    },
    orderSn: {
      type: String,
      default: ''
    },
    orderPackageNumber: {
      type: String,
      default: ''
    }
  },
  // watch: {
  //   showModal: {
  //     handler(newValue) {
  //       console.log(newValue)
  //       if (newValue == true) {
  //         this.getOrderSendType()
  //       }
  //     }
  //   }
  // },
  watch: {
    content(newVal, oldVal) {
      this.sendType = newVal[0]?.key
    }
  },
  computed: {},
  created() {},
  data() {
    return {
      currentIndex: 0,
      sendType: 'dropoff',
      getWayLoad: false
      // eslint-disable-next-line vue/no-dupe-keys
    }
  },

  methods: {
    close() {
      this.$emit('close', false)
    },
    selectWay(index) {
      if (this.content.length > 0) {
        this.sendType = this.content[index].key
      }
      this.currentIndex = index
    },

    /**
     * 单个获取物流号
     */
    getWaybillNumberOne() {
      // console.log(this.orderPackageNumber, this.sendType)
      const parms = {
        orderSn: this.orderSn,
        packageNumber: this.orderPackageNumber,
        sendType: this.sendType
      }
      this.getWayLoad = true
      Order.getWaybillNumberOne(parms)
        .then((res) => {
          this.getWayLoad = false
          this.$emit('close', false)
          this.$emit('submitWaybillNum', null, [this.orderSn])
        })
        .catch((reason) => {
          this.getWayLoad = false
          this.$emit('close', false)
        })
    }
  }
}
</script>

<style scoped>
.OrdersId {
  margin-left: 10px;
}

.box {
  height: 200px;
  width: 100%;
  /*margin-top: 30px;*/
  display: -webkit-flex; /* Safari */
  -webkit-justify-content: space-around; /* Safari 6.1+ */
  display: flex;
  justify-content: space-around;
}

.item {
  flex: 1;
  position: relative;
  background: #f1f1f1;
  overflow: hidden;
  display: inline;
  height: 200px;
  margin: 10px;

  flex-direction: column;
}

.topRight {
  font-size: 14px;
  line-height: 2em;
  width: 6em;
  background: orange;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
  -webkit-transform-origin: left bottom;
  -moz-transform-origin: left bottom;
  transform-origin: left bottom;
  -webkit-transform: translate(29.29%, -100%) rotate(45deg);
  -moz-transform: translate(29.29%, -100%) rotate(45deg);
  transform: translate(29.29%, -100%) rotate(45deg);
  text-indent: 0;
  text-align: center;
  color: white;
}

.content {
  padding: 20px;
  flex-direction: column;
}

.content span:first-child {
  font-weight: bold;
  font-size: 15px;
}

.content span {
  text-align: center;
}

.circle-tag {
  width: 40px;
  height: 40px;
  background-color: #409eff;
  border-radius: 20px;
}

.item,
.content,
.circle-tag {
  display: flex;
  align-items: center; /*定义body的元素垂直居中*/
  justify-content: center; /*定义body的里的元素水平居中*/
}
</style>
