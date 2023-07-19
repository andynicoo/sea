<template>
  <Modal v-model="visible" :title="title" @on-cancel="close">
    <p v-html="reason"></p>
    <div slot="footer">
      <Button type="primary" @click="edit">去修改</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    reason: String,
  },
  data() {
    return {
      title: '使用证据驳回原因',
    };
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    edit() {
      this.close();
      this.$emit('edit');
    },
  },
};
</script>
