<template>
  <div class="inline m-10" style="display: inline">
    <el-button size="small" type="primary" @click="dialogvisible = true" v-show="hasAuthority('J2_18')">审核</el-button>
    <el-dialog title="审核" :visible.sync="dialogvisible" width="460px" center>
      <el-form>
        <el-form-item label="当前进度：">
          {{ nodeCodeName }}
        </el-form-item>
        <el-form-item label="下一进度："> 待审核回收费(已通过) </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogvisible = false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="confirm">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { progressBarObj } from '../enumObj';
import { auditRecycling } from '@/api/newApi/workOrder/EPRManage';

export default {
  props: {
    serviceId: String,
    nodeCodeName: String,
  },
  data() {
    return {
      progressBarObj: progressBarObj,
      dialogvisible: false,
    };
  },
  mounted() {
    // this.getSuppliers()
  },
  methods: {
    confirm() {
      auditRecycling({
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('审核成功');
          this.$emit('refresh');
          this.dialogvisible = false;
        }
      });
    },
  },
};
</script>

<style></style>
