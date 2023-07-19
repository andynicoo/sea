<template>
  <el-dialog
    title="添加备注"
    :visible.sync="dialogvisible"
    width="470px"
    @close="reset"
    center
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      style="padding: 0 35px"
    >
      <el-form-item label="备注" prop="remarkComment">
        <el-input
          v-model="form.remarkComment"
          placeholder="请输入"
          clearable
          size="small"
          type="textarea"
          style="width: 300px"
          rows="4"
        />
      </el-form-item>
      <el-form-item label="附件" prop="annex">
        <UploadFile
          :fileList.sync="form.annex"
        >
        </UploadFile>
        <!-- <div class="text-tips">注：支持JPG、JPEG、PNG、PDF</div> -->
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
import UploadFile from "@/components/UploadFile/index";
import {orderServiceRemark} from "@/api/newApi/taxServices/serviceManage.js";
export default {
  props: {
    remarkDialog: Boolean,
    serviceNo: String,
  },
  data() {
    return {
      form: {
        remarkComment: "",
        annex: [],
        // annexName: ""
      },
      rules: {
        remarkComment: [{required: true, message: '请输入备注', trigger: 'blur'}],
      }
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.remarkDialog;
      },
      set(val) {
        this.$emit("update:remarkDialog", val);
      },
    },
  },
  components: {
    UploadFile
  },
  methods: {
    reset() {
      if(this.$refs.form) {
        this.$refs.form.resetFields()
      }
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
      orderServiceRemark({
        ...this.form,
        annex: this.form.annex.map(item => item.url).join(','),
        annexName: this.form.annex.map(item => item.name).join(','),
        serviceNo: this.serviceNo
      }).then(res => {
        if (res.code == 0) {
          this.$message.success("添加成功");
          this.$emit('refresh');
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    uploadSuccess(file) {
      this.form.annex = file.url;
      this.form.annexName = file.name;
    },
  },
};
</script>

<style></style>
