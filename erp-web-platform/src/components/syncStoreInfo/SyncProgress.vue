<template>
  <a-spin :spinning="spinning">
    <div v-if="visible">
      <div v-for="key in Object.keys(asyncProgressObjCopy)" :key="key">
        <div class="async-text">
          {{ asyncProgressObjCopy[key].storeName }}
          (<span>{{ asyncProgressObjCopy[key].success }}</span
          >/<span class="async-error">{{ asyncProgressObjCopy[key].fail }}</span
          >/<span>{{ asyncProgressObjCopy[key].count }}</span
          >)
        </div>
        <a-progress strokeColor="#3E90F1" :percent="getAsyncProgress(key)" />
      </div>
    </div>
    <div v-else>
      <div v-for="item in storeItems" :key="item.storeId">
        <div class="async-text">
          {{ item.merchantName }} (<span>{{ 0 }}</span
          >/<span class="async-error">0</span>/<span>0</span>)
        </div>
        <a-progress strokeColor="#3E90F1" :percent="100" :show-info="false" />
      </div>
    </div>
  </a-spin>
</template>

<script>
import Order from '@/api/order'
import Lazada from '@/api/lazada'
import LazadaOrder from '@/api/lazadaOrder'
import Goods from '@/api/goods'

export default {
  props: {
    storeIds: {
      type: Array,
      default: () => []
    },
    storeItems: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: 2
    },
    paltform: {
      type: String,
      default: 'Shopee' //选中平台
    },
    modules: {
      type: String,
      default: 'goods' //模块
    }
  },
  data() {
    return {
      asyncProgressObj: {},
      asyncProgressObjCopy: {},
      asyncProgressNum: 0,
      storeList: [],
      visible: false,
      spinning: false
    }
  },
  watch: {
    asyncProgressObj: {
      handler: function(value) {
        let num = Object.keys(value)
        var asyncStatus = []
        num = num.map((e) => {
          const { count, fail, success, isSyncFinish } = value[e]
          asyncStatus.push(isSyncFinish)
          return count - fail - success
        })
        num = num.reduce((previous, current) => previous + current)
        this.$data.asyncProgressNum = num
        if (this.paltform == 'Lazada') {
          //lazada同步完成
          if (num === 0) {
            clearInterval(this.progress)
            this.$emit('ok')
          }
        }
        // 完成条件由原来的总count==fail+success,调整为每个的isSyncFinish==true
        let asyncStatusLength = asyncStatus.filter((n) => n).length
        console.log(
          asyncStatusLength,
          Object.keys(this.asyncProgressObj).length
        )
        if (asyncStatusLength == Object.keys(this.asyncProgressObj).length) {
          clearInterval(this.progress)
          this.$emit('ok')
        }
      },
      deep: true
    }
  },
  methods: {
    getAsyncProgress(key) {
      const current = this.$data.asyncProgressObjCopy[key]
      if (current.count === 0) return 100
      return parseInt(((current.fail + current.success) / current.count) * 100)
    },
    // 同步进度
    asyncProgress() {
      const { storeIds } = this.$props
      this.progress = setInterval(async () => {
        let res
        if (this.paltform == 'Lazada') {
          console.log(this.modules)
          if (this.modules == 'goods') {
            res = await Lazada.goodsLazadaProductSyncProgress({
              storeIds: storeIds
            })
          } else {
            res = await LazadaOrder.syncProgress({
              storeIds: storeIds
            })
          }
        } else {
          res = await Order.orderShopeeSyncProgress({
            // let { data } = await Lazada.goodsLazadaProductSyncProgress({
            storeIds: storeIds,
            type: this.$props.type
          })
        }
        this.$data.spinning = false
        this.$data.visible = true

        if (!res.data) {
          clearInterval(this.progress)
          this.$emit('ok')
        }
        if (res.data) {
          res.data.forEach(
            ({
              storeId,
              count,
              success,
              fail,
              storeName,
              isSyncFinish,
              total
            }) => {
              console.log(count)
              count = count == undefined ? total : count
              var value = {
                storeId,
                count,
                success,
                fail,
                storeName,
                isSyncFinish
              }
              this.$set(this.$data.asyncProgressObj, storeId, value)
              this.$set(this.$data.asyncProgressObjCopy, storeId, value)
            }
          )
        }
      }, 1000)
    },

    async async() {
      this.$data.spinning = true
      const { storeIds } = this.$props
      var obj = {}

      if (this.paltform == 'Lazada') {
        if (this.modules == 'goods') {
          await Lazada.goodsLazadaProductSync({ storeIds: storeIds })
        }
        this.$data.spinning = false
        this.$data.visible = true
      } else {
        Goods.handleSyncProduct({ storeId: storeIds })
          .then(async () => {})
          .catch(() => {
            clearInterval(this.progress)
            this.$emit('resetAsyncStatus')
          })
      }
      this.storeItems.forEach(({ storeId, storeName }) => {
        obj[storeId] = storeName
      })

      storeIds.forEach((e) => {
        this.$set(this.$data.asyncProgressObjCopy, e, {
          storeId: e,
          count: 0,
          success: 0,
          fail: 0,
          storeName: obj[e]
        })
      })

      this.asyncProgress()
    }
  }
}
</script>

<style lang="scss" scoped>
.async-error {
  color: red;
  background-color: rgba(0, 0, 0, 0) !important;
}

.async-text {
  font-size: 12px;
  font-weight: 400;
  color: #303031;
}

.iconfont {
  &.iconclose {
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    position: absolute;
    right: 10px;
    top: 17px;
    cursor: pointer;
  }
}
</style>
