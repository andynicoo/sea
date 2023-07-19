<template>
  <el-dialog title="添加备注" :visible.sync="dialogvisible" width="460px" @close="reset">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="备注：" prop="remarkComment">
        <el-input type="textarea" style="width: 290px" :rows="3" placeholder="请输入备注" v-model="form.remarkComment"></el-input>
      </el-form-item>
      <el-form-item label="附件：">
        <UploadFileUrl :fileList.sync="form.annex" uploadWithName />
      </el-form-item>
    </el-form>

    <div slot="footer" style="text-align: right">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
import UploadFileUrl from '@/components/UploadFileUrl/index';
export default {
  props: {
    addRemarkDialog: Boolean,
    workNo: String,
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
  components: {
    UploadFileUrl,
  },
  data() {
    return {
      form: {
        annex: '',
        annexName: '',
        remarkComment: '',
      },
      rules: {
        remarkComment: [{ required: true, message: '请输入备注内容', trigger: 'blur' }],
      },
    };
  },
  methods: {
    save() {
      workOrderCommonOperator('saveRemark', {
        ...this.form,
        annexName: this.$util.getNameByUrl(this.form.annex),
        workNo: this.workNo,
      }).then((res) => {
        if (res.code == 0) {
          this.$message.success('添加成功');
          this.dialogvisible = false;
          this.$emit('refresh');
        }
      });
    },
    reset() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  max-height: 500px;
  overflow-y: auto;
  padding: 0 35px;
  .content-block {
    padding: 20px;
    border: 1px solid #eeeeee;
    margin-bottom: 20px;
    .block-item {
      display: flex;
      margin-bottom: 10px;
      .block-item-title {
        color: #999;
        width: 60px;
        flex: 0 0 60px;
        white-space: nowrap;
      }
    }
  }
}
</style>
