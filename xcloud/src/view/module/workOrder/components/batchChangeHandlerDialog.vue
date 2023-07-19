<template>
  <!-- 修改处理人 -->
  <el-dialog :title="`修改${title}`" :visible.sync="dialogvisible" width="400px" @close="reset">
    <el-form ref="form" :rules="rules" :model="form" label-width="140px">
      <el-form-item :label="`修改${title}：`" prop="handlerId">
        <el-select v-model="form.handlerId" filterable>
          <el-option v-for="(item, key) in handlerList" :key="key" :value="item.userId" :label="item.nickName"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDisposelist, getUserListByRole, userList } from '@/api/newApi/common.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
export default {
  props: {
    batchChangeHandlerDialog: Boolean,
    functionCode: String,
    workOrderIds: Array,
    type: Number,
    showAllCustomer: Boolean,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.batchChangeHandlerDialog;
      },
      set(val) {
        this.$emit('update:batchChangeHandlerDialog', val);
      },
    },
    title() {
      return this.type === 1 ? '客服' : '交付专员';
    },
  },
  watch: {
    dialogvisible(newVal) {
      if (newVal) {
        this.getHandlerList();
      }
    },
  },
  data() {
    return {
      form: {
        handlerId: '',
      },
      rules: {
        handlerId: [{ required: true, message: '请选择服务商', trigger: 'change' }],
      },
      handlerList: [],
    };
  },
  methods: {
    getHandlerList() {
      if (this.type === 1) {
        this.getCustomerServiceList();
      } else {
        this.getManagerList();
      }
    },
    // 获取客服
    getCustomerServiceList() {
      if (this.showAllCustomer) {
        // 取全部人员
        userList({
          limit: -1,
        }).then((res) => {
          this.handlerList = res.data;
        });
      } else {
        getUserListByRole({
          roleCode: this.$constant.VAT_CUSTOMER_SERVICE,
        }).then((res) => {
          this.handlerList = res.data;
        });
      }
    },
    // 获取交付专员
    getManagerList() {
      let data = {};
      if (this.functionCode === this.$constant.TAXProxy_FUNCTION_CODE) {
        data = {
          functionCodes: '2,23,5',
          functionCode: this.$constant.TAXProxy_FUNCTION_CODE,
        };
      } else {
        data = {
          functionCode: this.functionCode,
        };
      }
      getDisposelist(data).then((res) => {
        this.handlerList = res.data;
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
          this.confirm();
        }
      });
    },
    confirm() {
      workOrderCommonOperator('changeHandler', {
        ...this.form,
        type: this.type,
        handlerName: this.handlerList.find((item) => item.userId === this.form.handlerId).nickName,
        workOrderIds: this.workOrderIds,
      }).then((res) => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) === '{}') {
            this.$message.success('修改成功');
          } else if (res.data) {
            this.$alert(res.data, '', {});
          }
          this.dialogvisible = false;
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
