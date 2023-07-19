<template>
  <el-dialog title="添加商机" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="商机编号：" prop="opportunityNo">
        <el-select v-model="form.opportunityNo" filterable clearable>
          <el-option :label="item.opportunityNo" :value="item.opportunityNo" v-for="item in opportunityList" :key="item.opportunityNo"></el-option>
        </el-select>
        <div>请在企微上查到对应的商机编号进行填写，添加后将不能修改</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="submit">确认添加</el-button>
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <div class="add-tip">添加后在列表显示，且不能编辑</div>
    </span>
  </el-dialog>
</template>

<script>
import { getQywxOpportunity, editOpportunity } from '@/api/newApi/servicemerchant/serviceMerchant.js';
export default {
  props: {
    addOpportunityNoDialog: Boolean,
    checkItem: Object,
  },
  data() {
    return {
      form: {
        opportunityNo: '',
      },
      rules: {
        opportunityNo: [{ required: true, message: '请输入对应的商机编号', trigger: 'blur' }],
      },
      opportunityList: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.addOpportunityNoDialog;
      },
      set(val) {
        this.$emit('update:addOpportunityNoDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(val) {
      if (val) {
        this.getOpportunityList();
      }
    },
  },
  methods: {
    reset() {
      this.opportunityList = [];
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    // 获取商机列表
    getOpportunityList() {
      getQywxOpportunity({
        enterpriseId: localStorage.getItem('enterpriseId'),
        userId: this.checkItem.attributionId,
      }).then((res) => {
        if (res.code === 0) {
          this.opportunityList = res.data;
        } else {
          this.opportunityList = [];
        }
      });
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      editOpportunity({
        orderId: this.checkItem.orderId,
        opportunityNo: this.form.opportunityNo,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('添加成功');
          this.$emit('refresh');
          this.dialogvisible = false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.add-tip {
  color: red;
  margin-top: 10px;
}
</style>
