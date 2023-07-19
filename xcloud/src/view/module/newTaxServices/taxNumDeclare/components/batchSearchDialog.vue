<template>
  <!-- 审核税金弹窗 -->
  <el-dialog title="批量搜索" :visible.sync="dialogvisible" width="546px" center>
    <div class="search-tips">
      <p>1.单次批量查询支持100条数据；</p>
      <p>2.仅支持单个条件批量查询，例如：不支持服务号和订单号同时查询；</p>
      <p>3.查询结果按照查询条件排序；</p>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="订单号" name="orderNo"></el-tab-pane>
      <el-tab-pane label="服务号" name="serviceNo"></el-tab-pane>
      <el-tab-pane label="工单号" name="workNo"></el-tab-pane>
      <el-tab-pane label="公司名" name="companyName"></el-tab-pane>
      <el-tab-pane label="手机号" name="userMobile"></el-tab-pane>
    </el-tabs>
    <el-form :model="form" ref="ruleForm">
      <el-form-item prop="keyword">
        <el-input type="textarea" placeholder="请输入" :rows="10" v-model="form.keyword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    batchSearchDialog: Boolean,
    keyword: String,
    activeTab: String,
  },
  data() {
    return {
      form: {
        keyword: '',
      },
      activeName: 'orderNo',
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.batchSearchDialog;
      },
      set(val) {
        this.$emit('update:batchSearchDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(val) {
      this.form.keyword = this.keyword;
    },
    activeTab: {
      handler(val) {
        if (val) {
          this.activeName = val;
        }
      },
      immediate: true,
    },
  },
  methods: {
    reset() {
      this.form.keyword = '';
      this.$emit('getBatchSearchKey', this.form.keyword, this.activeName);
      this.dialogvisible = false;
    },
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$emit('getBatchSearchKey', this.form.keyword, this.activeName);
          this.dialogvisible = false;
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.search-tips {
  background-color: #f2f5ff;
  border: 1px solid #e1eff8;
  padding: 10px;
  margin-bottom: 20px;
}
</style>
