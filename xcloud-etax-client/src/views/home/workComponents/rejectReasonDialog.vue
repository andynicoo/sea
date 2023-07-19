<template>
  <Modal v-model="dialogvisible" :width="616">
    <div slot="header">
      <span class="modal-title">驳回原因</span>
    </div>
    <p class="modal-item">
      服务状态：
      <span v-if="checkItem.cureentNodeCode">{{ checkItem.cureentNodeCodeName }}</span>
      <span v-else>{{ checkItem.itemCode | filterStatus }}</span>
      （驳回）
    </p>
    <p class="modal-item">服务单号：{{ checkItem.serviceNo }}</p>
    <p class="modal-item">驳回时间：{{ (checkItem.reject || {}).createTime }}</p>
    <p class="modal-item">驳回原因：{{ (checkItem.reject || {}).reason }}</p>
    <div slot="footer" align="center">
      <Button @click="concat"> 联系客服 </Button>
      <Button type="primary" @click="modify"> 去修改资料 </Button>
    </div>
  </Modal>
</template>
<script>
import { currentCodeList } from '@/views/userManage/setting/staticList.js';
export default {
  props: {
    rejectReasonDialog: Boolean,
    checkItem: Object,
  },
  data() {
    return {
      currentCodeList,
    };
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 'TOBE_DECLARED_REJECT':
          return '待申报';
        case 'TOBE_TAXES_REJECT':
          return '待缴税';
      }
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.rejectReasonDialog;
      },
      set(val) {
        this.$emit('update:rejectReasonDialog', val);
      },
    },
  },
  methods: {
    concat() {
      this.dialogvisible = false;
      let el = document.querySelector('.box.box1.contact');
      el.onclick();
    },
    modify() {
      this.$emit('modify', this.checkItem);
    },
  },
};
</script>
<style lang="less" scoped>
.modal-item {
  margin: 15px 0;
}
</style>
