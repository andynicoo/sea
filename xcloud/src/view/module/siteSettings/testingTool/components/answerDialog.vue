<template>
  <el-dialog title="" :visible.sync="dialogvisible" width="616px" center>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="tab.label" :name="tab.value" v-for="tab in tabs" :key="tab.value"></el-tab-pane>
    </el-tabs>
    <div class="answer-count" v-if="answerObj[activeName]">已保存答案数：{{ answerObj[activeName].total }}</div>
    <div class="answer-list-wrapper" v-if="answerObj[activeName]">
      <draggable :list="answerObj[activeName].answer" animation="300" ghost-class="ghostClass" @end="dragEnd">
        <div class="answer-list-item" v-for="(item, index) in answerObj[activeName].answer" :key="index">
          <el-input v-model="item.answer" :maxlength="10"></el-input>
          <img class="answer-icon" src="@/assets/icons/add_icon.svg" alt="" @click="addItem(index)" />
          <img class="answer-icon" src="@/assets/icons/reduce_icon.svg" alt="" v-if="answerObj[activeName].answer.length > 1" @click="reduceItem(index)" />
        </div>
      </draggable>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="submit" :loading="submitLoading">保存</el-button>
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable';
import { answerList, answerSave } from '@/api/newApi/siteSettings/testingTool';
export default {
  props: {
    answerDialog: Boolean,
    activeTab: String,
  },
  data() {
    return {
      activeName: '5',
      tabs: [
        { label: '商品类别', value: '5' },
        { label: '公司注册地', value: '1' },
        { label: '仓储地', value: '3' },
        { label: '目标市场', value: '2' },
        { label: '售卖渠道', value: '4' },
      ],
      answerObj: {},
      submitLoading: false,
    };
  },
  components: {
    draggable,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.answerDialog;
      },
      set(val) {
        this.$emit('update:answerDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(val) {
      if (val) {
        this.getAnswerList();
      }
    },
  },
  mounted() {},
  methods: {
    addItem(index) {
      this.answerObj[this.activeName].answer.splice(index + 1, 0, { answer: '' });
    },
    reduceItem(index) {
      this.answerObj[this.activeName].answer.splice(index, 1);
    },
    getAnswerList() {
      answerList().then((res) => {
        this.tabs.forEach((tab) => {
          let value = res.data.filter((item) => item.type === tab.value - 0);
          this.$set(this.answerObj, tab.value, value && value.length ? value[0] : { type: tab.value, answer: [] });
          try {
            this.answerObj[tab.value].answer = JSON.parse(this.answerObj[tab.value].answer).sort((a, b) => a - b);
            this.answerObj[tab.value].total = this.answerObj[tab.value].answer.length;
          } catch (error) {
            this.answerObj[tab.value].answer = [{ answer: '' }];
            this.answerObj[tab.value].total = 0;
          }
        });
      });
    },
    submit() {
      let values = Object.values(this.answerObj);
      for (let item of values) {
        if (item.answer.some((a) => a.answer.trim() === '')) {
          this.$message.warning('文本框不能为空');
          return;
        }
      }
      let data = values.map((item) => ({
        answer: JSON.stringify(
          item.answer.map((a, i) => ({
            type: a.type,
            answer: a.answer.trim(),
            sort: i,
          }))
        ),
        id: item.id,
        type: item.type,
      }));
      this.submitLoading = true;
      answerSave(data)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('保存成功');
            this.dialogvisible = false;
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    //排序
    dragEnd() {},
  },
};
</script>

<style lang="less" scoped>
.answer-count {
  margin-bottom: 10px;
}
.answer-list-wrapper {
  padding: 10px;
  border-radius: 4px;
  background-color: #f5f7f9;
  max-height: 300px;
  overflow-y: scroll;
  .answer-list-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .answer-icon {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
