<template>
  <span>
    <el-button type="primary" style="margin: 0 10px" @click="showModal = true"> {{ btnText }} </el-button>
    <el-dialog :visible.sync="showModal" title="发送注册资料" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="formModal" ref="formModal" label-position="left" label-width="140px">
        <el-form-item label="目标邮箱："> {{ email || '-' }}</el-form-item>
        <el-form-item label="发送注册资料：" required>
          <UploadFileUrl :fileList.sync="formModal.customerData" :drag="false" :maxSize="200" :showTip="false" uploadWithName>
            <el-button>上传文件</el-button>
          </UploadFileUrl>
          <div class="form-tips">文件限制：文件大小不超过200M，文件名不能包含特殊字符如：+、%等</div>
        </el-form-item>
        <el-form-item label="发送短信：" required>
          <el-radio-group v-model="formModal.smsSend">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
          <div class="form-tips">提示：请上传压缩包文件，保存后会给客户发送短信告知用 户自行提交资料给服务商</div>
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
import { getEmailConfig, sendCustomFile } from '@/api/newApi/intellectualProperty/trademark';
import UploadFileUrl from '@/components/UploadFileUrl/index';
export default {
  components: {
    UploadFileUrl,
  },
  props: ['btnText', 'params'],
  data() {
    return {
      showModal: false,
      email: null,
      formModal: {
        customerData: '',
        smsSend: true,
      },
    };
  },
  watch: {
    showModal(val) {
      if (val) {
        this.$nextTick(() => {
          this.getEmailConfig();
          this.formModal = {
            customerData: this.params.customerData || '',
            smsSend: true,
          };
        });
      }
    },
  },
  methods: {
    submitForm() {
      sendCustomFile({
        workId: this.params.workId || undefined,
        serviceId: this.params.serviceId || undefined,
        functionCode: this.params.functionCode,
        smsSend: this.formModal.smsSend,
        customerData: this.formModal.customerData,
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
    getEmailConfig() {
      getEmailConfig({
        functionCode: this.params.functionCode,
        countryCode: this.params.countryCode,
        enterpriseId: this.params.enterpriseId,
      }).then((res) => {
        if (res.code === 0) {
          this.email = res.data.sendEmail;
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
.form-tips {
  line-height: 24px;
}
</style>
