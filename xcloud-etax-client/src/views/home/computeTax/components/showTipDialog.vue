<template>
  <Modal title="提示" v-model="dialogvisible" width="600px">
    <p>{{ tipMessage }}</p>
    <div slot="footer">
      <a class="a-link" target="_blank" href="https://file.itaxs.com/dev/20230529/0135e1cb85f64b159fd13fc3af7babc4.png">
        <Button type="default"> 查看示例 </Button>
      </a>
      <a class="a-link" target="_blank" href="https://file.itaxs.com/dev/20230704/0069850469d4436dbbed93b6cfd48659.jpg">
        <Button type="default"> 下载教程 </Button>
      </a>
      <Button type="primary" @click="dialogvisible = false">重新上传</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  props: {
    showTipDialog: Boolean,
    tipMessage: String,
  },
  data() {
    return {};
  },
  computed: {
    dialogvisible: {
      get() {
        return this.showTipDialog;
      },
      set(val) {
        this.$emit('update:showTipDialog', val);
      },
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.a-link {
  color: #333;
}
::v-deep .ivu-modal-body {
  padding-bottom: 16px !important;
}
</style>
