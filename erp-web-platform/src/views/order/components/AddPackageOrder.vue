<template>
  <a-modal
    class="add-package-wrap"
    :visible="showModal"
    width="1200px"
    :maskClosable="false"
    :destroyOnClose="true"
    :closable="false"
    :title="null"
    :footer="null"
  >
    <div id="iframeId" style="height: 78vh;"></div>
  </a-modal>
</template>

<script>
import { toPage } from '@/util'
export default {
  components: {},
  props: {
    records: {},
    packageInfo: {}
  },
  watch: {
    showModal(val) {
      if (val) {
        this.$nextTick(() => {
          console.log(this.records)
          toPage(
            '/package/add-package-order',
            '&ordersn=' +
              this.records.ordersn +
              '&packageNumber=' +
              this.packageInfo?.packageNumber || ''
          )
        })
      }
    }
  },
  data() {
    return {
      showModal: false
    }
  },
  mounted() {
    const that = this
    this.$nextTick(() => {
      window.addEventListener('message', function(e) {
        // console.log(e)
        that.showModal = false
        if (e.data == 'submit') {
          that.$emit('submit')
        }
      })
    })
  }
}
</script>

<style lang="scss">
.add-package-wrap {
  .ant-modal-body {
    padding: 0;
  }
}
</style>
