<template>
  <el-dialog title="上传资料清单" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <div class="tips"><i class="el-icon-info" style="margin: 0 8px; color: orange"></i>上传内容显示在客户端</div>
    <el-form :model="form" :rules="rules" ref="UploadDataListingDialog">
      <el-form-item label="上传资料清单：" prop="referUrl" label-width="120px">
        <UploadFile :fileList.sync="form.referUrl" :limit="10" :maxSize="-1" :showTip="false" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.cvs,.txt,.zip,.rar">
          <div slot="content" class="text-info" style="font-size: 12px">
            <div>支持：jpg,jpeg,png,pdf,doc,docx,xls,xlsx,ppt,pptx,cvs,txt,zip,rar</div>
          </div>
        </UploadFile>
      </el-form-item>
      <el-form-item label="发短信给客户：" prop="sendMsg" label-width="120px" required>
        <el-radio-group v-model="form.sendMsg">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">上传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UploadFile from '@/components/UploadFile/index';
import { simpleWorkOrderReferApi } from '@/api/newApi/simpleWorkOrder/otherService.js';
export default {
  components: {
    UploadFile,
  },
  props: {
    UploadDataListingDialog: Boolean,
    ids: Array,
    fileList: Array,
  },
  data() {
    return {
      form: {
        referUrl: [],
        sendMsg: true,
      },
      rules: {
        referUrl: [{ required: true, message: '请上传资料清单', trigger: 'blur' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.UploadDataListingDialog;
      },
      set(val) {
        this.$emit('update:UploadDataListingDialog', val);
      },
    },
  },
  watch: {
    fileList() {
      this.form.referUrl = this.fileList;
    },
  },
  methods: {
    reset() {
      if (this.$refs.UploadDataListingDialog) {
        this.$refs.UploadDataListingDialog.resetFields();
      }
    },
    submit() {
      this.$refs['UploadDataListingDialog'].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        }
      });
    },
    confirm() {
      simpleWorkOrderReferApi({
        ...this.form,
        ids: this.ids,
        referName: this.form.referUrl.map((item) => item.name).join(','),
        referUrl: this.form.referUrl.map((item) => item.url).join(','),
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('上传成功');
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style></style>
