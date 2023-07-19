<template>
  <el-dialog title="添加备注" :visible.sync="dialogvisible" width="460px" @close="reset">
    <el-form ref="remarkRefForm" :rules="remarkRuleForm" :model="remarkObj" label-width="80px">
      <el-form-item label="备注：" prop="remarkComment">
        <el-input type="textarea" style="width: 290px" :rows="3" placeholder="请输入备注" v-model="remarkObj.remarkComment"></el-input>
      </el-form-item>
      <el-form-item label="附件：">
        <UploadFile :fileList.sync="remarkObj.annex"></UploadFile>
      </el-form-item>
    </el-form>

    <div slot="footer" style="text-align: right">
      <el-button type="default" @click="dialogvisible = false">取消</el-button>
      <el-button type="primary" @click="addServiceRemark">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import UploadFile from '@/components/UploadFile/index'; //上传图片组件
import { orderServiceRemark, saveDeclareWorkOrder } from '@/api/newApi/taxServices/serviceManage.js';
export default {
  props: {
    addRemarkDialog: Boolean,
    serviceNo: String,
    queryData: {
      type: Function,
      default: null,
    },

    apiKey: {
      type: String,
      default: 'save',
    },
  },

  data() {
    return {
      remarkObj: {
        annex: [],
        remarkComment: '',
      }, //备注
      remarkRuleForm: {
        remarkComment: [{ required: true, message: '请输入备注内容', trigger: 'blur' }],
      },
    };
  },
  components: {
    UploadFile,
  },

  computed: {
    dialogvisible: {
      get() {
        return this.addRemarkDialog;
      },
      set(val) {
        this.$emit('update:addRemarkDialog', val);
      },
    },
  },
  created() {},
  methods: {
    /** 添加备注 */
    addServiceRemark() {
      this.$refs.remarkRefForm.validate((valid) => {
        if (valid) {
          const parm = {
            ...this.remarkObj,
            serviceNo: this.serviceNo,
            annex: this.remarkObj.annex.map((item) => item.url).join(','),
          };

          this.apiKey === 'saveDeclareWorkOrder' ? this.saveDeclareWorkOrderApi(parm) : this.orderServiceRemarkApi(parm);

          this.dialogvisible = false;
          this.queryData();
        }
      });
    },

    /**declare  details Page  save remarks */
    async saveDeclareWorkOrderApi(parm) {
      let { code, message } = await saveDeclareWorkOrder(parm);
      code == 0 ? this.$message.success('添加成功') : this.$message.error(message);
    },
    /**保存备注 */
    orderServiceRemarkApi(parm) {
      orderServiceRemark(parm)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('添加成功');
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    uploadSuccess(file) {
      this.remarkObj.annex = file.url;
      this.remarkObj.annexName = file.name;
    },
    // 上传失败
    onUploadError(file) {},
    // 上传移除
    onUploadRemove(file) {
      this.remarkObj.annex = file.url;
      this.remarkObj.annexName = file.name;
    },
  },
};
</script>

<style></style>
