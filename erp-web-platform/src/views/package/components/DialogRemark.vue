<template>
  <!-- 货代备注弹窗 -->
  <a-modal
    v-model="visible"
    max-width="600px"
    class="remark-dialog"
    @ok="sureRemark"
    @cancel="cancle"
    :closeIcon="null"
    title="卖家备注"
  >
    <a-textarea
      :placeholder="$t('packages.beizhu')"
      :value="remark"
      v-model="remark"
    ></a-textarea>
  </a-modal>
</template>

<script>
export default {
  props: {
    dialogRemark: {
      default: false
    }
  },
  data() {
    return {
      remark: '',
      visible: false
    }
  },
  watch: {
    dialogRemark: {
      handler(newVal) {
        this.visible = newVal
      }
    }
  },
  methods: {
    cancle() {
      this.visible = false
      this.$emit('cancle')
    },
    sureRemark() {
      this.visible = false
      this.$emit('setRemark', this.remark)
      this.remark = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-content {
  margin-top: 10px;
}
</style>
