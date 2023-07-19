<template>
  <el-dialog title="律师审核" :visible.sync="dialogvisible" width="460px" center @close="reset">
    <el-form :model="form" :rules="rules" ref="form" label-width="85px">
      <el-form-item label="审核结果" prop="isPass">
        <el-radio-group v-model="form.isPass">
          <el-radio :label="true">通过</el-radio>
          <el-radio :label="false">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <span v-if="form.isPass">
        <el-form-item label="受理号" prop="acceptanceNo">
          <el-input v-model="form.acceptanceNo" placeholder="输入受理号" clearable style="width: 300px" size="small" maxlength="200" />
        </el-form-item>
        <el-form-item label="受理日期" prop="acceptanceTime">
          <el-date-picker v-model="form.acceptanceTime" type="date" :clearable="false" placeholder="请选择受理日期" value-format="yyyy-MM-dd 00:00:00" style="width: 200px"></el-date-picker>
        </el-form-item>
        <el-form-item label="上传回执" prop="receiptUrl">
          <UploadFileUrl :fileList.sync="form.receiptUrl" fileClass uploadText="上传PDF文件" accept=".pdf" :showTip="false" />
        </el-form-item>
      </span>
      <span v-if="!form.isPass">
        <el-form-item label="驳回流程" prop="process" v-if="showModelingDrawProgress || showOaProgress">
          <el-checkbox-group v-model="form.process" size="small">
            <el-checkbox-button label="mainProcess">主服务流程</el-checkbox-button>
            <el-checkbox-button label="modeProcess" v-if="showModelingDrawProgress" :disabled="form.process.includes('drawProcess')">建模流程</el-checkbox-button>
            <el-checkbox-button label="drawProcess" v-if="showOaProgress" :disabled="form.process.includes('modeProcess')">绘图流程</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="驳回原因" prop="reason">
          <el-input v-model="form.reason" placeholder="输入驳回原因" clearable type="textarea" style="width: 300px" size="small" maxlength="200" />
          <div>注：驳回原因客户可见，请谨慎输入</div>
        </el-form-item>
        <el-form-item label="短信通知" prop="isSendMsg">
          <el-radio-group v-model="form.isSendMsg">
            <el-radio :label="true">通知用户</el-radio>
            <el-radio :label="false">不通知用户</el-radio>
          </el-radio-group>
        </el-form-item>
      </span>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { progressBarObj } from '../enumObj';
import { patentAttorneyAudit } from '@/api/newApi/intellectualProperty/appearancePatent';
import UploadFileUrl from '@/components/UploadFileUrl/index';
export default {
  props: {
    lawyerDialog: Boolean,
    rejectNodeName: String,
    serviceId: String,
    showModelingDrawProgress: Boolean,
    showOaProgress: Boolean,
  },
  data() {
    return {
      progressBarObj: progressBarObj,
      form: {
        isPass: true,
        acceptanceNo: '',
        acceptanceTime: '',
        receiptUrl: '',
        reason: '',
        mainProcess: false,
        modeProcess: false,
        drawProcess: false,
        process: ['mainProcess'],
        isSendMsg: false,
      },
      copyForm: {},
      rules: {
        acceptanceNo: [{ required: true, message: '请输入受理号', trigger: 'blur' }],
        acceptanceTime: [{ required: true, message: '请选择受理时间', trigger: 'blur' }],
        receiptUrl: [{ required: true, message: '请上传回执', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
        process: [{ required: true, message: '请选择驳回流程', trigger: 'change' }],
      },
    };
  },
  components: {
    UploadFileUrl,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.lawyerDialog;
      },
      set(val) {
        this.$emit('update:lawyerDialog', val);
      },
    },
  },
  created() {
    this.copyForm = { ...this.form };
    this.getNowDate();
  },
  methods: {
    getNowDate() {
      this.form.acceptanceTime = this.$util.getDefaultDate() + ' 00:00:00';
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
      let { process, ...params } = this.form;
      let data = {
        ...params,
      };
      process.forEach((item) => {
        data[item] = true;
      });
      patentAttorneyAudit({
        ...data,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('审核成功');
          this.$emit('refresh');
        }
      });
    },
    reset() {
      this.form = { ...this.copyForm };
    },
  },
};
</script>

<style></style>
