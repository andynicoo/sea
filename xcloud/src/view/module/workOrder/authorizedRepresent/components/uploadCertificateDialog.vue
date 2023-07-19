<template>
  <el-dialog title="上传协议证书" :visible.sync="dialogvisible" width="600px" center @close="reset">
    <DynamicForm ref="dynamicForm" :moduleList="authorizeFileInfo" :showBtn="false" @formSave="formSave" @formCancel="isEdit = false" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="() => formSave(false)">保存</el-button>
      <el-button v-if="info && info.nodeCode === progressBarObj.WAIT_AUTHORIZE" type="primary" size="small" @click="() => formSave(true)">保存并提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import { submitAuthAgent, saveAuthAgent } from '@/api/newApi/workOrder/authorizedRepresent';
import { progressBarObj } from '../enumObj';
export default {
  props: {
    uploadCertificateDialog: Boolean,
    serviceId: String,
    authorizeFileInfo: Array,
    info: Object,
  },
  components: {
    DynamicForm,
  },
  data() {
    return {
      rules: {
        agreement: [{ type: 'array', required: true, message: '请上传协议', trigger: 'blur' }],
      },
      progressBarObj,
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadCertificateDialog;
      },
      set(val) {
        this.$emit('update:uploadCertificateDialog', val);
      },
    },
    form() {
      return this.fileObj;
    },
  },
  created() {},
  methods: {
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      // this.$emit("changeReplace");
    },
    formSave(isCommot) {
      this.$refs.dynamicForm.onSubmit().then((materialData) => {
        submitAuthAgent({
          materialData,
          serviceId: this.serviceId,
          doNext: isCommot,
        }).then((res) => {
          if (res.code === 0) {
            this.dialogvisible = false;
            this.$message.success('提交成功');
            this.$emit('refresh');
          }
        });
      });
    },

    // submit() {
    //   this.$refs["form"].validate((valid) => {
    //     if (valid) {
    //       this.dialogvisible = false;
    //       this.confirm();
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // confirm() {
    //   let data = {
    //     agreement: this.form.agreement.map(item => item.url).join(','),
    //     certificat: this.form.certificat.map(item => item.url).join(','),
    //     serviceId: this.serviceId,
    //   }
    //   if(this.replace) {
    //     data.replace = true
    //   }
    //   authAgentAttachment(data).then((res) => {
    //     if (res.code === 0) {
    //       this.$message.success('上传成功');
    //       this.$emit("refresh");
    //     }
    //   })
    // },
  },
};
</script>

<style></style>
