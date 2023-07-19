<template>
  <div>
    <Modal v-model="isShow"
           :width="1200"
           footer-hide
           @on-visible-change="changeState">
      <ComputedPage></ComputedPage>
    </Modal>
  </div>
</template>
<script>
import ComputedPage from '@/views/home/computeTax/index.vue'
export default {
  components: {
    ComputedPage
  },
  data() {
    return {
      isShow: true
    }
  },
  methods: {
    changeState(val) {
      this.$emit('changeState', val)
    }
  }
}
</script>
<style lang="less" scoped>
.modalCount {
  height: auto !important;
  .btBox {
    text-align: right;
    margin-right: 35px;
  }
}
&/deep/ .ivu-modal-content {
  border-radius: 5px;
}
</style>