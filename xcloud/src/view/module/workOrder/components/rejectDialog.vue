<template>
  <el-dialog title="驳回进度" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="当前进度：">
        {{ nodeCodeName }}
      </el-form-item>
      <el-form-item label="驳回到：">
        {{ rejectNodeName }}
      </el-form-item>
      <el-form-item label="驳回原因：" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入" clearable type="textarea" style="width: 300px" size="small" />
      </el-form-item>
      <el-form-item label="发短信给客户：" prop="isSend">
        <el-radio-group v-model="form.isSend">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
        <div style="margin-left: 100px; color: #dd0707">如果选择发短信给客户，系统将会一并发送更改原因，请详细填写</div>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="checked"> 通知销售人员 ({{ detail.attributionName }})</el-checkbox>
        <P class="rg-tips"> 选择后系统会向该订单的销售发起待办通知</P>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="handlerChecked" :disabled="handlerDisabled"> 通知客户成功 ({{ form.customerUserName }})</el-checkbox>
        <P class="rg-tips"> 选择后系统会向该客服发起待办通知</P>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
import { serviceWorkOrderDetail } from '../../../../api/newApi/workOrder/commonOperator';
export default {
  props: {
    rejectDialog: Boolean,
    workOrderId: [String, Number],
    nodeCodeName: String,
    rejectNodeName: String,
  },
  data() {
    return {
      form: {
        remark: '',
        isSend: false,
        customerUserId: '',
        customerUserName: '',
      },
      rules: {
        remark: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
      },
      handlerChecked: true,
      handlerDisabled: false,
      checked: false,
      detail: {},
    };
  },
  async created() {
    let { data: detail } = await serviceWorkOrderDetail(this.workOrderId);
    this.detail = detail;
    this.checked = true;
    const handlerIdArr = detail.handlerUserId?.split('\n') || [];
    const handlerArr = detail.handler?.split('\n') || [];
    const handlerIndex = handlerArr.findIndex((item) => item.includes('客服'));
    if (handlerIndex === -1) {
      this.handlerChecked = false;
      this.handlerDisabled = true;
    } else {
      this.form.customerUserName = handlerArr[handlerIndex];
      this.form.customerUserId = handlerIdArr[handlerIndex];
    }
  },
  computed: {
    dialogvisible: {
      get() {
        return this.rejectDialog;
      },
      set(val) {
        this.$emit('update:rejectDialog', val);
      },
    },
  },
  watch: {
    checked: function (val) {
      if (val) {
        let { attributionName: saleUserName, attributionId: saleUserId } = this.detail;
        this.form = { ...this.form, saleUserName, saleUserId };
      } else {
        const { saleUserName, saleUserId } = this.form;
        saleUserId && delete this.form.saleUserId;
        saleUserName && delete this.form.saleUserName;
      }
    },
    handlerChecked: function (v) {
      const handlerIdArr = this.detail.handlerUserId?.split('\n') || [];
      const handlerArr = this.detail.handler?.split('\n') || [];
      const handlerIndex = handlerArr.findIndex((item) => item.includes('客服'));
      if (handlerIndex === -1) {
        this.handlerChecked = false;
        this.handlerDisabled = true;
      } else {
        this.form.customerUserName = handlerArr[handlerIndex];
        this.form.customerUserId = handlerIdArr[handlerIndex];
      }
    },
  },
  methods: {
    reset() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      const params = {
        isPass: false,
        ...this.form,
        workOrderId: this.workOrderId,
      };
      workOrderCommonOperator('audit', params).then((res) => {
        if (res.code === 0) {
          this.$message.success('驳回成功');
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.rg-tips {
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 22px;
  /* -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
}
</style>
