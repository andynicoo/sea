<template>
  <el-dialog :title="title" :visible.sync="visible" :destroy-on-close="true" width="30%">
    <p>使用证据保存成功</p>
    <p>本单暂未支付意向注册宣誓费用，支付后方可提交使用证据</p>
    <span slot="footer">
      <el-button @click="edit" v-if="false">修改使用证据</el-button>
      <el-button type="primary" :data-clipboard-text="payLink" @click="copyPaylnk" class="copy">复制付款链接并发送给销售</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    payLink: String,
  },
  data() {
    return {
      title: '商标使用证据',
      visible: false,
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    // 修改使用证据
    edit() {
      this.visible = false;
      this.$emit('edit');
    },
    // 复制付款链接
    copyPaylnk() {
      this.$util.copyLink('.copy', '已复制付款链接');
      this.visible = false;
    },
  },
};
</script>
