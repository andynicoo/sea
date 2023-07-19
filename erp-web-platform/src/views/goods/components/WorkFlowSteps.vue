<template>
  <a-page-header
    class="me-page-header work-flow-steps"
    :title="stepsArr[current].title"
  >
    <!-- <div class="title">{{ stepsArr[current].title }}</div> -->
    <a-steps :current="current" size="small" slot="extra">
      <a-step v-for="(item, index) in stepsArr" :key="index">
        <template slot="title">
          <a-tooltip
            :visible="item.visible"
            overlayClassName="me-steps-tooltip"
            v-if="item.tooltip"
            :placement="index === 3 ? 'bottomRight' : 'bottom'"
          >
            <template slot="title">
              {{ item.tooltip }}
            </template>
            <router-link :to="{ path: item.path }">{{
              item.title
            }}</router-link>
          </a-tooltip>
          <div v-else>
            <router-link :to="{ path: item.path }">{{
              item.title
            }}</router-link>
          </div>
        </template>
      </a-step>
    </a-steps>
  </a-page-header>
</template>

<script>
import bus from '@/bus'

export default {
  data() {
    return {
      current: 0,
      stepsArr: [
        {
          title: this.$t('goodsCollection.goodsCollection'),
          tooltip: '',
          visible: false,
          path: '/goods/goods-collection'
        },
        {
          title: this.$t('goodsCollection.collectingBox'),
          tooltip: this.$t('goodsCollection.tooltipTitle8'),
          visible: false,
          path: '/goods/collect'
        },
        {
          title: this.$t('edit.productEdit'),
          tooltip: this.$t('goodsCollection.tooltipTitle9'),
          visible: false,
          path: '/goods/to-be-edit'
        },
        {
          title: this.$t('goodsCollection.onlineGoods'),
          tooltip: this.$t('goodsCollection.tooltipTitle10'),
          visible: false,
          path: '/goods/on-sale'
        }
      ]
    }
  },
  mounted() {
    // 判断当前页面
    switch (this.$route.path) {
      case '/goods/goods-collection':
        this.$data.current = 0
        break
      case '/goods/collect':
        this.$data.current = 1
        break
      case '/goods/to-be-edit':
        this.$data.current = 2
        break
      case '/goods/on-sale':
        this.$data.current = 3
        break
    }
    // 监听页面操作
    bus.$on('work-flow-steps', this.showVisible)
  },
  methods: {
    showVisible(isAutoPublish = undefined) {
      let current = isAutoPublish ? 3 : this.current + 1
      this.stepsArr[current].visible = true
      setTimeout(() => {
        this.stepsArr[current].visible = false
      }, 3 * 1000)
    }
  },
  beforeDestroy() {
    bus.$off('work-flow-steps', this.showVisible)
  }
}
</script>

<style lang="scss" scoped>
.work-flow-steps {
  .ant-page-header-heading {
    display: flex;
    .ant-page-header-heading-extra {
      flex: 1;
    }
  }
  .ant-steps-horizontal {
    min-width: 500px !important;
  }
}
</style>
