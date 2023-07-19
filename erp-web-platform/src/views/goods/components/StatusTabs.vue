<template>
  <div>
    <a-tabs :activeKey="componentsType" @change="onTabsChange" type="card">
      <a-tab-pane
        v-for="item in tabArr"
        :key="item.key"
        :tab="
          item.name +
            (true ||
            productCount[item.count] == 0 ||
            productCount[item.count] == undefined
              ? ''
              : '(' + productCount[item.count] + ')')
        "
      >
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Goods from '@/api/goods'
import productTableMixins from '@/mixins/productTableMixins'
import bus from '@/bus'
import { mapState } from 'vuex'

export default {
  components: {},
  mixins: [productTableMixins],
  data() {
    return {
      componentsType: 6,
      counts: {
        cancelPublishCount: 0, // 商品已取消发布数
        pushCount: 0, // 商品发布中数
        pushFailCount: 0, // 商品发布失败数
        pushSuccessCount: 0, // 商品发布成功数
        stayPublishCount: 0, // 商品待发布数
        timingPublishCount: 0 // 商品定时发布数
      },
      timer: null,
      requestIng: false,
      tabArr: [
        {
          name: this.$t('edit.goodstobeedit'),
          path: '/goods/to-be-edit',
          count: 'stayPublishCount',
          key: 0
        },
        {
          name: this.$t('edit.goodsrelease'),
          path: '/goods/release',
          count: 'pushCount',
          key: 1
        },
        {
          name: this.$t('edit.goodssuccess'),
          path: '/goods/success',
          count: 'pushSuccessCount',
          key: 2
        },
        {
          name: this.$t('edit.goodsfaild'),
          path: '/goods/faild',
          count: 'pushFailCount',
          key: 3
        },
        {
          name: this.$t('edit.goodstask'),
          path: '/goods/task',
          count: 'timingPublishCount',
          key: 4
        },
        {
          name: this.$t('edit.goodscancel'),
          path: '/goods/cancel',
          count: 'cancelPublishCount',
          key: 5
        }
      ]
    }
  },
  computed: {
    ...mapState({
      productCount: (state) => state.product.productCount
    })
  },
  mounted() {
    const tabArr = this.$data.tabArr
    const path = location.pathname
    const hash = location.hash
    tabArr.map((item) => {
      if (path === item.path || hash.indexOf(item.path) > -1) {
        this.$data.componentsType = item.key
      }
    })
    console.log('tab init')
    this.clearTimer()

    this.startGetNum()
    bus.$on('updateCount', this.getCountNum)
    bus.$on('clearTimer', this.clearTimer)
  },
  watch: {
    '$route.path': {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    }
  },
  beforeDestroy() {
    this.clearTimer()
  },
  destroyed() {
    bus.$off('updateCount')
    bus.$off('clearTimer')
  },
  methods: {
    clearTimer() {
      console.log('stop timer beforeDestroy')
      clearInterval(this.$data.timer)
      this.$data.timer = null
    },
    startGetNum() {
      this.$data.timer = setInterval(() => {
        this.getCountNum()
      }, 2000)

      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.$data.timer)
      })
    },
    onTabsChange(key) {
      this.clearTimer()
      this.$data.componentsType = key
      const tabArr = this.$data.tabArr
      tabArr.map((item) => {
        if (key == item.key) {
          this.$router.push({ path: item.path })
        }
      })
    },
    // 各个状态统计数
    getCountNum() {
      // if (this.requestIng) return
      // this.requestIng = true
      // Goods.getPublishCount()
      //   .then(({ data }) => {
      //     // this.$data.counts = data
      //     // 放入vuex中，防止切换tab 数字闪烁
      //     this.$store.commit('setProductCount', data)
      //     // pushCount 发布中，不是0,实时请求
      //     if (data.pushCount != 0) {
      //       this.getCountNum()
      //     } else {
      //       clearInterval(this.$data.timer)
      //       this.$data.timer = null
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //     this.requestIng = false
      //   })
      //   .finally(() => {
      //     this.requestIng = false
      //   })
    }
  }
}
</script>

<style lang="scss" scope>
.ant-tabs-nav-scroll {
  .ant-tabs-tab {
    // width: 120px !important;
  }
}
</style>
