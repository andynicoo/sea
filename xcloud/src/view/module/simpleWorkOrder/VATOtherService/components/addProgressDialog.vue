<template>
  <!-- 添加进度弹窗 -->
  <el-dialog title="添加备注" :visible.sync="dialogvisible" width="470px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="addProgressDialog" style="padding: 0 35px">
      <el-form-item label="备注" prop="progressContent" label-width="60px">
        <el-input
          v-model="form.progressContent"
          placeholder="请输入内容"
          clearable
          size="small"
          type="textarea"
          style="width: 290px"
          rows="4"
        />
      </el-form-item>
      <el-form-item label="附件" prop="annexUrl" label-width="60px">
        <UploadFile :fileList.sync="form.annexUrl" :limit="6" :maxSize="-1" :showTip="false">
          <div slot="content" class="text-info" style="font-size: 12px">
            <div>支持：JPG、JPEG、PNG、PDF、zip、xls、xlsx</div>
            <!-- <div>温馨提示：可以上传多个文件</div> -->
          </div>
        </UploadFile>
      </el-form-item>
      <!-- <el-form-item label="是否在客户端显示" prop="isDisplay" label-width="145px">
        <el-radio-group v-model="form.isDisplay">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UploadFile from "@/components/UploadFile/index";
import { addSimpleWorkProgress } from "@/api/newApi/simpleWorkOrder/otherService.js";
export default {
  props: {
    addProgressDialog: Boolean,
    id: String
  },
  data() {
    return {
      form: {
        annexUrl: [],
        isDisplay: false,
        progressContent: ""
      },
      rules: {
        progressContent: [{ required: true, message: "请输入内容", trigger: "blur" }]
      }
    };
  },
  components: {
    UploadFile
  },
  computed: {
    dialogvisible: {
      get() {
        return this.addProgressDialog;
      },
      set(val) {
        this.$emit("update:addProgressDialog", val);
      }
    }
  },
  created() {},
  methods: {
    reset() {
      if (this.$refs.addProgressDialog) {
        this.$refs.addProgressDialog.resetFields();
      }
    },
    submit() {
      this.$refs["addProgressDialog"].validate(valid => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      let data = {
        ...this.form,
        serviceId: this.id,
        annexName: this.form.annexUrl.map(item => item.name).join(","),
        annexUrl: this.form.annexUrl.map(item => item.url).join(",")
      };
      addSimpleWorkProgress(data).then(res => {
        if (res.code === 0) {
          this.$message.success("添加成功");
          this.$emit("refresh");
        }
      });
    }
  }
};
</script>

<style></style>
