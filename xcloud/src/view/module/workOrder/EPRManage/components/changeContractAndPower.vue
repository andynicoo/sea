<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
    >
      <el-form-item :label="(replace?'替换':'') + '合同：'" prop="contract" v-if="fileObj=='contract'">
        <UploadFileUrl
          :fileList.sync="form.contract"
          fileClass
          :showTip="false"
        >
        </UploadFileUrl>
      </el-form-item>
      <el-form-item :label="(replace?'替换':'') + '授权书：'" prop="authCertificate" v-if="fileObj=='authCertificate'">
        <UploadFileUrl
          :fileList.sync="form.authCertificate"
          fileClass
          :showTip="false"
        >
        </UploadFileUrl>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="submit"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import UploadFileUrl from '@/components/UploadFileUrl/index'
import {saveEpr} from '@/api/newApi/workOrder/EPRManage'
export default {
  props: {
    changeContract: Boolean,
    serviceId: String,
    fileObj: String
  },
  data() {
    return {
      form: {
        contract: '',
        authCertificate:''
      },
      replace:true,
      rules: {
        contract: [{required: true, message: '请上传合同', trigger: 'blur'}],
        authCertificate: [{required: true, message: '请上传授权书', trigger: 'blur'}]
      },
      title:'替换'
    };
  },
  components: {
    UploadFileUrl
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeContract;
      },
      set(val) {
        this.$emit("update:changeContract", val);
      },
    },
  },
  watch:{
    fileObj(val){
      if(val=='contract'){
        this.title+='合同'
      }else{
        this.title+='授权书'
      }
    }
  },
  methods: {
    reset() {
      if(this.$refs.form) {
        this.$refs.form.resetFields()
      }
      this.$emit("changeReplace");
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      let materialData={}
      if(this.fileObj=='contract'){
        materialData.contract=[this.form.contract]
      }else if(this.fileObj=='authCertificate'){
        materialData.authCertificate=[this.form.authCertificate]
      }
      
      let data = {
        materialData: JSON.stringify(materialData),
        serviceId: this.serviceId,
      }
      saveEpr(data).then((res) => {
        if (res.code === 0) {
          this.$message.success('上传成功');
          this.$emit("refresh");
        }
      })
    },
  },
};
</script>

<style></style>
