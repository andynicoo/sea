<template>
  <a-modal
    :visible="value"
    :after-close="afterClose"
    :closable="false"
    :footer="false"
    @cancel="$emit('input', false)"
  >
    <div class="content" v-html="currentObj.content" />
  </a-modal>
</template>

<script>
export default {
  props: {
    currentObj: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    afterClose() {

    }
  }
}
</script>

<style lang="less" scoped>
.content{
    // color: #fff;
    // background-color: #000;
    padding: 16px;
    height: 500px;
    overflow: auto;
}
/deep/.ant-modal-body{
    padding: 0;
}
</style>
