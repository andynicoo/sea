<template>
  <el-dialog :title="handlerType == 1 ? '修改交付专员' : '修改客服'" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="交付专员" prop="disposeId" v-if="handlerType == 1">
        <el-select style="width: 300px" placeholder="请选择" size="small" filterable v-model="form.disposeId">
          <el-option v-for="item in userList" :key="item.userId" :value="item.userId" :label="item.nickName"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="修改客服：" prop="customerServiceId" v-if="handlerType == 2">
        <el-select v-model="form.customerServiceId" filterable>
          <el-option v-for="(item, key) in commissionerList" :key="key" :value="item.userId" :label="item.nickName"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="submit">确 定</el-button>
      <el-button @click="cancleFunc" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDisposelist, disposeModifyBatch } from '@/api/newApi/common';

import { modifyHandle, preModifyHandle } from '@/api/newApi/taxServices/serviceManage.js';

export default {
  props: {
    changeManagerDialog: Boolean,
    serviceIdColl: Array,
    commissionerList: Array,
    userList: Array,
    handlerType: Number,
    linkFrom: {
      type: String,
      default: 'EPRDeclare',
    },
  },
  data() {
    return {
      form: {
        disposeId: '',
        customerServiceId: '',
      },
      rules: {
        disposeId: [{ required: true, message: '请选择交付专员', trigger: 'change' }],
        customerServiceId: [{ required: true, message: '请选择客服', trigger: 'change' }],
      },
      // userList: []
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeManagerDialog;
      },
      set(val) {
        this.$emit('update:changeManagerDialog', val);
      },
    },
  },
  created() {
    // this.getUserList()
  },
  methods: {
    // 获取交付专员列表
    getUserList() {
      getDisposelist({
        functionCode: this.$constant.EPR_FUNCTION_CODE,
      }).then((res) => {
        this.userList = res.data;
      });
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    cancleFunc() {
      this.dialogvisible = false;
      this.$emit('cancelFunc');
    },
    getHandlerName() {
      if (this.handlerType == 1) {
        return (this.userList.find((item) => item.userId == this.form.disposeId) || {}).nickName;
      } else {
        return (this.commissionerList.find((item) => item.userId == this.form.customerServiceId) || {}).nickName;
      }
    },
    confirm() {
      const fn = this.linkFrom == 'preDeclare' ? preModifyHandle : modifyHandle;
      fn({
        handlerId: this.handlerType == 1 ? this.form.disposeId : this.form.customerServiceId,
        handlerName: this.getHandlerName(),
        handlerType: this.handlerType,
        idColl: this.serviceIdColl,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改成功');
          this.$emit('refresh');
          this.dialogvisible = false;
        }
      });
    },
  },
};
</script>

<style></style>
