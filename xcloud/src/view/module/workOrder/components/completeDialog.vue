<template>
  <el-dialog title="提示" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <div>确认录入完成吗 ？</div>
    证书有效日期:
    <el-date-picker v-model="regTime" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期"> </el-date-picker>

    <div style="color: red" v-if="showTip">提示：如因注册时效问题，实际完成注册日期与当前日期跨年，可通过补充实际完成注册日期，进行服务年份和服务到期日期自动更新</div>
    <span slot="footer" class="dialog-footer">
      <el-button
        @click="
          dialogvisible = false;
          regTime = '';
        "
        >取 消</el-button
      >
      <el-button type="primary" @click="confirm()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { eprComplete } from '@/api/newApi/workOrder/EPRManage';
export default {
  props: {
    completeDialog: Boolean,
    serviceId: [String, Number],
    showTip: Boolean,
  },
  data() {
    return {
      regTime: '',
    };
  },

  computed: {
    dialogvisible: {
      get() {
        return this.completeDialog;
      },
      set(val) {
        this.$emit('update:completeDialog', val);
      },
    },
  },
  watch: {},
  methods: {
    reset() {},

    async confirm() {
      let { regTime } = this.$data;

      let data = {
        serviceId: this.serviceId,
        eprEffectiveDate: regTime,
      };
      let res = await eprComplete(data);
      if (res.code === 0) {
        this.$message.success('操作成功');
        this.$emit('refresh');
      }
      this.dialogvisible = false;
      this.regTime = '';
    },
  },
};
</script>

<style scoped lang="less"></style>
