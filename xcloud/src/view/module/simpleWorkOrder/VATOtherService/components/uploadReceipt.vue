<template>
  <!-- 上传回执文件弹窗 -->
  <el-dialog title="上传回执文件" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="uploadReceipt">
      <el-form-item label="上传资料：" prop="annexUrl" label-width="120px">
        <UploadFile
          :fileList.sync="form.annexUrl"
          :limit="20"
          :maxSize="-1"
          :showTip="false"
          accept=".jpg,.jpeg,.png,.pdf,.zip,.xls,.xlsx,. word,.excel,.zip,.rar"
        >
          <div slot="content" class="text-info" style="font-size: 12px">
            <div>支持：JPG、JPEG、PNG、PDF、zip、xls、xlsx、 word、Excel；压缩包</div>
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
import UploadFile from "@/components/UploadFile/index";
import { upLoadReceiptApi } from "@/api/newApi/simpleWorkOrder/otherService.js";
export default {
  components: {
    UploadFile,
  },
  props: {
    uploadReceipt: Boolean,
    id: String,
    fileList: Array,
  },
  data() {
    return {
      form: {
        annexUrl: [],
        sendMsg: true,
      },
      rules: {
        annexUrl: [{ required: true, message: "请上传回执文件", trigger: "blur" }],
      },
    };
  },
  watch: {
    fileList: {
      handler() {
        this.form.annexUrl = this.fileList;
      },
      immediate: true,
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadReceipt;
      },
      set(val) {
        this.$emit("update:uploadReceipt", val);
      },
    },
  },
  created() {},
  methods: {
    reset() {
      if (this.$refs.uploadReceipt) {
        this.$refs.uploadReceipt.resetFields();
      }
    },
    submit() {
      this.$refs["uploadReceipt"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        }
      });
    },
    confirm() {
      upLoadReceiptApi({
        ...this.form,
        id: this.id,
        receiptName: this.form.annexUrl.map((item) => item.name).join(","),
        receiptUrl: this.form.annexUrl.map((item) => item.url).join(","),
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("上传成功");
          this.$emit("refresh");
        }
      });
    },
  },
};
</script>

<style></style>
