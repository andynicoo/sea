<template>
  <div>
    <div v-for="(item, index) in sync" :key="index">
      <a-progress :percent="percent(item)" />
      <p>
        总计: {{ item.count }} 成功: {{ item.success }} 失败: {{ item.fail }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sync: [],
      status: false
    }
  },
  computed: {
    percent() {
      return (item) => {
        if (item.count === 0) return 100
        return Number.parseInt(((item.success + item.fail) / item.count) * 100)
      }
    }
  },
  methods: {
    setSync(sync) {
      this.$data.sync = sync
      const unComplates = sync.filter(({ count, success, fail }) => {
        return success + fail < count
      })
      this.$data.status = unComplates.length === 0
      return unComplates.length === 0
    },
    getStatus() {
      return this.$data.status
    }
  }
}
</script>
