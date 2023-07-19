<template>
  <div :id="`echarts${id}`" class="echarts_dom" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    id: {
      type: [String, Number],
      required: true,
      default: ''
    }
  },
  data() {
    return {
      echarts: null
    }
  },
  watch: {
    options: {
      handler(val) {
        this.echarts && this.echarts.setOption(val)
      },
      deep: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    })
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    init() {
      this.echarts = echarts.init(document.getElementById(`echarts${this.id}`))
      this.echarts.setOption(this.options)
    },
    handleResize() {
      if (this.echarts) {
        this.echarts.resize()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.echarts_dom {
  width: 100%;
  height: 100%;
}
</style>
