<template>
  <el-dialog :title="isEdit ? '编辑题目' : '添加题目'" :visible.sync="dialogvisible" width="600px" center @close="reset" destroy-on-close>
    <el-form :model="form" inline ref="form" label-width="100px" :rules="rules">
      <el-form-item prop="questionTypes" label="切换题型:">
        <el-select v-model="form.questionTypes" clearable disabled>
          <el-option label="单选" value="MULTIPLE_CHOICE">单选</el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="topicName" label="题目:">
        <el-input v-model="form.topicName" maxlength="100" clearable> </el-input>
      </el-form-item>

      <el-form-item
        v-for="(item, index) in form.topicOptionList"
        :label="'选项' + (index + 1)"
        :key="item.key"
        :prop="'topicOptionList.' + index + '.optionName'"
        :rules="{
          required: true,
          message: '选项不能为空',
          trigger: 'blur',
        }"
      >
        <el-input style="width: 200px" v-model="item.optionName"></el-input>

        <el-radio v-model="radio" :label="index">正确选项</el-radio>

        <el-button @click.prevent="removeOption(index)">删除</el-button>
      </el-form-item>
      <el-button type="primary" @click="addOption">添加选项</el-button>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit" :loading="loading">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addAnswerTopicApi, updateAnswerTopicApi } from '@/api/newApi/extension/activity.js';
export default {
  props: {
    addEditDialogVisible: Boolean,
    rowData: Object,
    isEdit: Boolean,
  },
  data() {
    return {
      loading: false,
      form: {
        topicName: '',
        questionTypes: 'MULTIPLE_CHOICE',
        topicOptionList: [
          {
            optionName: '',
          },
        ],
      },
      radio: '',
      rules: {
        topicName: [{ required: true, message: '请输入题目', trigger: 'blur' }],
      },
    };
  },

  computed: {
    dialogvisible: {
      get() {
        if (this.addEditDialogVisible) {
          if (this.isEdit) {
            this.radio = this.rowData.topicOptionList.findIndex((item) => item.isAnswer == 'YES');
            this.form = JSON.parse(JSON.stringify(this.rowData));
          } else {
            this.form = {
              topicName: '',
              questionTypes: 'MULTIPLE_CHOICE',
              topicOptionList: [
                {
                  optionName: '',
                },
              ],
            };
          }
        }

        return this.addEditDialogVisible;
      },
      set(val) {
        this.$emit('update:addEditDialogVisible', val);
      },
    },
  },
  mounted() {},
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.radio === '' || this.radio === undefined) {
            return this.$message.error('请选择正确选项');
          }

          if (this.form.topicOptionList.length < 2) {
            return this.$message.error('至少保留2个选项');
          }

          let data = {
            questionTypes: this.form.questionTypes,
            topicName: this.form.topicName,
            topicOptionList: this.form.topicOptionList,
            answerTopicId: this.form.answerTopicId,
          };
          data.topicOptionList.forEach((ele, index) => {
            if (index == this.radio) {
              data.topicOptionList[index].isAnswer = 'YES';
            } else {
              data.topicOptionList[index].isAnswer = 'NO';
            }
          });
          const fnName = this.isEdit ? updateAnswerTopicApi : addAnswerTopicApi;
          fnName(data)
            .then((res) => {
              if (res.code === 0) {
                this.$message.success('操作成功');
                this.$emit('update:addEditDialogVisible', false);
                this.$emit('refresh');
              } else {
                this.$message.error(res.msg);
              }
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    addOption() {
      if (this.form.topicOptionList.length >= 10) {
        return this.$message.error('最多添加10个选项');
      }
      this.form.topicOptionList.push({
        optionName: '',
        key: Date.now(),
        isAnswer: 'NO',
      });
    },
    removeOption(index) {
      if (this.form.topicOptionList.length <= 2) {
        return this.$message.error('至少保留2个选项');
      }
      this.form.topicOptionList.splice(index, 1);
    },
    // 重置
    reset() {
      console.log('??');
      if (this.$refs.form) {
        this.form = {
          topicName: '',
          questionTypes: 'MULTIPLE_CHOICE',
          topicOptionList: [
            {
              optionName: '',
            },
          ],
        };
        this.radio = '';
        this.$refs.form.resetFields();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
