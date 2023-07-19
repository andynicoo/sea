<template>
  <el-dialog title="上传授权书模板" :visible.sync="dialogvisible" width="600px" center @close="reset">
    <el-form :model="form" ref="form">
      <el-row>
        <span v-for="(item, index) in form.list" :key="index">
          <el-col :span="8">
            <el-form-item :label="`授权书${index + 1}`" :prop="'list.' + index + '.templateUrl'" :rules="baseRule">
              <UploadFileUrl fileClass uploadWithName uploadText="点击上传" :fileList.sync="item.templateUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="示例文件" :prop="'list.' + index + '.exampleUrl'" :rules="baseRule">
              <UploadFileUrl fileClass uploadWithName uploadText="点击上传" :fileList.sync="item.exampleUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注释" :prop="'list.' + index + '.remarks'">
              <el-input type="textarea" :row="2" v-model="item.remarks" placeholder="请输入注释" />
            </el-form-item>
          </el-col>
        </span>
      </el-row>
    </el-form>
    <span slot="footer">
      <div class="dialog-footer">
        <div>
          <el-button type="primary" size="small" @click="addItem" v-if="this.form.list.length < 4">增加授权书</el-button>
        </div>
        <div v-show="!showSubmit">
          <el-button @click="dialogvisible = false" size="small">取消</el-button>
          <el-button type="primary" size="small" @click="submit">确认</el-button>
        </div>
      </div>
      <div v-show="showSubmit" style="text-align: center">
        <div class="tips" style="margin: 10px 0">提示：请检查授权书内容，点击提交后工单将流转到下个节点；</div>
        <el-button type="primary" size="small" @click="submitAgain">确认提交</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
import UploadFileUrl from '@/components/UploadFileUrl/index';
export default {
  components: {
    UploadFileUrl,
  },
  props: {
    uploadAuthorizationDialog: Boolean,
    functionCode: String,
    workId: [String, Number],
  },
  data() {
    return {
      form: {
        list: [],
      },
      baseRule: { required: true, message: '请上传', trigger: 'change' },
      showSubmit: false,
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.uploadAuthorizationDialog;
      },
      set(val) {
        this.$emit('update:uploadAuthorizationDialog', val);
      },
    },
  },
  watch: {
    'form.list': {
      handler() {
        if (this.showSubmit) {
          this.showSubmit = false;
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.addItem();
  },
  methods: {
    addItem() {
      this.form.list.splice(this.form.list.length, 0, {
        templateUrl: '',
        exampleUrl: '',
        remarks: '',
      });
    },
    reset() {
      this.form.list = [
        {
          templateUrl: '',
          exampleUrl: '',
          remarks: '',
        },
      ];
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.showSubmit = true;
        } else {
          return false;
        }
      });
    },
    submitAgain() {
      this.confirm();
    },
    confirm() {
      workOrderCommonOperator('uploadAuthTemplate', {
        businessId: this.workId,
        functionCode: this.functionCode,
        templateDetailList: this.form.list.map((item, index) => ({
          ...item,
          sort: index + 1,
          templateName: `授权书${index + 1}`,
          templateFileName: this.$util.getNameByUrl(item.templateUrl),
        })),
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.dialogvisible = false;
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
>
