<template>
  <!-- 操作详情的弹窗 -->
  <a-modal
    v-model="visible"
    max-width="600px"
    :title="$t('packages.caozuoxiang')"
    :footer="null"
    @cancel="cancel"
  >
    <div v-for="(item, index) in detialsList" :key="index">
      <div>{{ item.optTime }}</div>
      <div>{{ item.optContent }}</div>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    dialogDetials: {
      default: false
    },
    detialsList: {
      default: []
    }
  },
  data() {
    return {
      visible: false
    }
  },
  watch: {
    dialogDetials: {
      handler(newVal) {
        this.visible = newVal
      }
    }
  },
  methods: {
    cancel() {
      this.visible = false
      this.$emit('cancel', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.details-dialog {
  .headline {
    font-size: 18px !important;
  }
}
</style>
