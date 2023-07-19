<!-- 申报回执 -->
<template>
  <div>
    <Modal v-model="dialog" title="申报回执">
      <p style="margin-bottom: 5px">申报回执</p>
      <p v-for="(item, index) in declareReceiptList" :key="index" style="margin-bottom: 5px; margin-left: 32px">
        <a :href="replaceHttp(item)" target="_blank" style="color: #16ade9">
          <img style="position: relative; top: 3px" src="@/assets/images/survey/uploadBlue.png" alt />
          查看回执
        </a>
      </p>
      <p slot="footer">
        <Button type="primary" @click="dialog = false">确认</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'declareReceiptDialog',
  props: {
    declareReceiptList: Array,
    showDeclareReceipt: Boolean,
  },

  data() {
    return {};
  },

  computed: {
    dialog: {
      get() {
        return this.showDeclareReceipt;
      },
      set(val) {
        // this.$emit('input', val);
        this.$emit('update:showDeclareReceipt', val);
      },
    },
  },

  mounted() {},
  methods: {
    changeStatePay(val) {
      this.$emit('update:showDeclareReceipt', val);
    },
    replaceHttp(str) {
      return str.replace('http://', 'https://');
    },
  },
};
</script>
<style lang="less" scoped>
.year-history-diag {
  /deep/ .ivu-table-body {
    height: auto !important;
  }

  /deep/ .ivu-modal-body {
    max-height: 500px;
    overflow: auto;
  }

  .ivu-table td,
  .ivu-table th {
    min-width: 0;
    height: 48px;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .ivu-table-border td,
  .ivu-table-border th {
    border-right: 1px solid #e8eaec;
  }

  .ivu-table-column-center {
    text-align: center;
  }

  .first-cell {
    border-left: 1px solid #e8eaec;
  }

  .ivu-table-column-center .ivu-table-cell {
    text-align: center;
  }

  .time-tip {
    width: 100%;
    text-align: center;
    padding: 8px 0;
    background: rgba(22, 173, 233, 0.2);
    border: 1px solid #e8eaec;
    border-bottom: 0;
  }

  .w-123 {
    width: 123px;
  }

  .w-124 {
    width: 124px;
  }
}
</style>
