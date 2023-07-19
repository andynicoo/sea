<template>
  <div>
    <el-dialog title="新增属性词" :visible.sync="dialogVisible" width="30%" :destroy-on-close="true" :before-close="handleClose">
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="属性词" prop="attributeWordName">
            <el-input v-model="ruleForm.attributeWordName" type="textarea" :autosize="{ minRows: 6, maxRows: 10 }" placeholder="请输入属性词"></el-input>
            请使用英文逗号“,”分割，每个词将生成一条属性词
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="submitForm()" :loading="submitIng">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addAttrWord } from '@/api/newApi/consultingCenter/consultingManage';
export default {
  props:{
    method:{
      type:Function,
      default(){}
    }
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        attributeWordName: '',
      },
      rules: {
        attributeWordName: [{ required: true, message: '请输入属性词', trigger: 'blur' }],
      },
      submitIng: false,
    };
  },
  methods: {
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false;
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.submitIng = true;
          addAttrWord(this.ruleForm)
            .then((res) => {
              if (res.code == 0) {
                this.$message('提交成功');
                this.handleClose();
                this.method()
              }
              this.submitIng = false;
            })
            .catch((err) => {
              this.submitIng = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false;
    },
  },
};
</script>
