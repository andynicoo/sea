<template>
  <span>
    <el-button type="primary" style="margin: 0 10px" @click="showModal = true"> {{ btnText }} </el-button>
    <el-dialog :visible.sync="showModal" title="客户发送邮件状态" width="400px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="formModal" ref="formModal" label-position="left" label-width="140px">
        <el-form-item label="发送邮件：" required>
          <el-radio-group v-model="formModal.emailSend">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button ghost style="margin-right: 20px" @click="closeModal()">取消</el-button>
        <el-button type="primary" @click="submitForm()">确认</el-button>
      </div>
    </el-dialog>
  </span>
</template>
<script>
import { sendEmail } from '@/api/newApi/intellectualProperty/trademark';
import UploadFileUrl from '@/components/UploadFileUrl/index';
export default {
  components: {
    UploadFileUrl,
  },
  props: ['btnText', 'params'],
  data() {
    return {
      showModal: false,
      formModal: {
        emailSend: true,
      },
    };
  },
  watch: {
    showModal(val) {
      if (val) {
        this.$nextTick(() => {
          this.formModal = {
            emailSend: true,
          };
        });
      }
    },
  },
  methods: {
    submitForm() {
      sendEmail({
        workId: this.params.workId || undefined,
        serviceId: this.params.serviceId || undefined,
        trademarkType: this.params.trademarkType || undefined,
        functionCode: this.params.functionCode,
        emailSend: this.formModal.emailSend,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.$emit('submit');
          this.showModal = false;
        }
      });
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>
<style scoped lang="less">
.form-tips {
  line-height: 24px;
}
</style>
