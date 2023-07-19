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
        <!-- <v-progress-linear
          rounded
          height="10"
          color="#3E90F1"
          :value="getAsyncProgress(key)"
        ></v-progress-linear> -->
      </div>
    </div>
    <div v-else>
      <div v-for="item in selectedStore" :key="item.storeId">
        <div class="async-text">
          {{ item.storeName }} (<span>{{ 0 }}</span
          >/<span class="async-error">0</span>/<span>0</span>)
        </div>
        <a-progress strokeColor="#3E90F1" :percent="100" :show-info="false" />
      </div>
    </div>
  </a-spin>
</template>

<script>
import Order from '@/api/order'
import Store from '@/api/store'
import Goods from '@/api/goods'

export default {
  props: {
    storeIds: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: 2
    },
    title: {
      type: String,
      default: '同步商品'
    },
    selectedStore: {
      type: Array,
      default: () => []
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
        // if (num === 0) {
        //   clearInterval(this.progress)
        //   this.$emit('ok')
        // }
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
      this.progress = setInterval(async () => {
        let { data } = await Order.orderShopeeSyncProgress({
          storeIds: this.$props.storeIds,
          type: this.$props.type
        })

        this.$data.visible = true

        if (!data) {
          clearInterval(this.progress)
          this.$data.visible = false
          console.log('emit ok')
          this.$emit('ok')
        }
        if (data) {
          data.forEach(
            ({ storeId, count, success, fail, storeName, isSyncFinish }) => {
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
      const { storeIds } = this.$props
      var obj = {}
      Goods.handleSyncProduct({ storeId: storeIds })
        .then(async () => {})
        .catch(() => {
          clearInterval(this.progress)
          this.$emit('resetAsyncStatus')
        })

      setTimeout(async () => {
        const { data } = await Store.getAllStore()
        data.forEach(({ storeId, storeName }) => {
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
      }, 100)
    },
    asyncDone() {
      this.$data.visible = false
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

<style lang="scss">
.async {
  .v-progress-linear--rounded {
    border-radius: 5px;
  }
}
</style>
