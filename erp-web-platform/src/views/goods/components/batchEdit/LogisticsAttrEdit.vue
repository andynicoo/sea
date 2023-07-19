<template>
  <LogisticsAttr @initData="loading = false" ref="logistics" />
</template>

<script>
import LogisticsAttr from './LogisticsAttr'
export default {
  data() {
    return {
      loading: true
    }
  },
  components: {
    LogisticsAttr
  },
  methods: {
    onSubmit() {
      const attr = this.$refs.logistics.getAttr()
      const __attr = attr.map(({ enabled }) => enabled).filter(Boolean)
      if (!__attr.length) {
        this.$message.error(this.$t('batchEdit.logisticsValid'))
        return
      }
      this.$emit('submit', attr)
    }
  }
}
</script>