<template>
  <!-- 回复的弹窗 -->
  <a-modal
    v-model="dialogReply"
    max-width="500px"
    class="remark-dialog"
    @ok="sureRemark"
    @cancel="cancle"
  >
    <a-textarea
      outlined
      name="input-7-4"
      :placeholder="this.$t('packages.huifu')"
      :value="reply"
      v-model="reply"
    ></a-textarea>
  </a-modal>
</template>

<script>
import Package from '@/api/package'
export default {
  props: {
    dialogReply: {
      default: false
    },
    replyId: {
      default: ''
    }
  },
  data() {
    return {
      reply: ''
    }
  },
  methods: {
    cancle() {
      this.$emit('cancle')
    },
    sureRemark() {
      this.replyProblem()
    },
    // 回复问题
    replyProblem() {
      let params = {
        expressNo: this.replyId,
        sellerReply: this.reply
      }
      Package.replyProblem(params).then((res) => {
        if (res.code == 0) {
          this.$emit('cancle')
          this.$emit('update')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-content {
  margin-top: 10px;
}
</style>
