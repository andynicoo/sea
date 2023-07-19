<template>
  <!-- 修改服务截止时间 -->
  <el-dialog title="修改服务截止时间" :visible.sync="dialogvisible" width="650px" @close="closeFile">
    <el-form label-width="180px" style="max-height: 500px; overflow: auto" ref="ruleForm" :rules="rules" :model="form">
      <el-form-item label="当前服务截止时间：">
        {{ expirationTime }}
      </el-form-item>

      <el-form-item label="服务截止时间更改为：" prop="expirationTime">
        <el-date-picker v-model="form.expirationTime" type="date" placeholder="请选择服务截止时间" style="width: 300px" value-format="yyyy-MM-dd 23:59:59"></el-date-picker>
      </el-form-item>

      <!-- <el-form-item label="上一次申报区间：" prop="isChange" v-if="productFunctionCode == 2">
        <el-radio-group v-model="form.isChange">
          <el-radio label="0">不变</el-radio>
          <el-radio label="1">变更</el-radio>
        </el-radio-group>
      </el-form-item>

      <p class="tip-font" v-if="productFunctionCode == 2">客户上一次申报区间指客户转代理前最后一次申报区间， 此区间填写决定转代理开始服务时间，请慎重填写！ 例：月报，客户上一次申报区间是22年1-1月，转代理开始 服务申报区间为22年2-2月；</p> -->

      <el-form-item label="更改为：" prop="upBeginTime" v-if="form.isChange == '1'">
        <el-date-picker v-model="selectMonth" type="monthrange" value-format="yyyy-MM" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份"> </el-date-picker>
      </el-form-item>
      <el-form-item label="理由：" prop="reason">
        <el-input type="textarea" v-model="form.reason"></el-input>
      </el-form-item>
      <el-form-item label="审批截图：">
        <UploadFile :fileClass="true" :maxSize="30" :accept="'.jpg,.png,.jpge,.gif'" :fileList.sync="form.approvalFileList"></UploadFile>
      </el-form-item>
    </el-form>

    <div slot="footer" style="text-align: right">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="submit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { changeExpirationTime } from '@/api/newApi/taxServices/serviceManage.js';
import moment from 'moment';
import UploadFile from '@/components/UploadFile'; // 上传文件组件
export default {
  props: {
    modifyExpireTime: Boolean,
    serviceId: String,
    expirationTime: String,
    declarePeriod: Number,
    productFunctionCode: Number | String,
    getWorkOrderDetail: { type: Function },
  },
  components: { UploadFile },
  data() {
    return {
      form: {
        reason: '',
        expirationTime: '',
        upBeginTime: '',
        upEndTime: '',
        lastDeclarePeriodBeginTime: '',
        lastDeclarePeriodEndTime: '',
        approvalFileList: [],
        isChange: '',
      },
      selectMonth: [],
      // 税号信息校验
      rules: {
        reason: [{ required: true, message: '理由', trigger: 'blur' }],
        expirationTime: [{ required: true, message: '请选择服务截止时间', trigger: 'change' }],
        isChange: [{ required: true, message: '请选择上一次申报区间', trigger: 'change' }],
      },
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.modifyExpireTime;
      },
      set(val) {
        this.$emit('update:modifyExpireTime', val);
      },
    },
  },
  created() {},
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (this.form.isChange == '1' && !(this.selectMonth && this.selectMonth.length)) {
          return this.$message.error('请选择更改的上一次申报区间');
        }
        if (this.form.isChange == '1' && this.selectMonth && this.selectMonth.length) {
          var a = moment(this.selectMonth[0]);
          var b = moment(this.selectMonth[1]);
          var month = b.diff(a, 'month');
          console.log(month);
          if (this.declarePeriod == 0 && month != 0) {
            return this.$message.error('月报申报周期必须等于1个月！');
          }
          if (this.declarePeriod == 1 && month != 2) {
            return this.$message.error('季报申报周期必须等于3个月！');
          }
          if (this.declarePeriod == 2 && month != 11) {
            return this.$message.error('年报申报周期必须等于12个月！');
          }
        }
        if (valid) {
          this.auditConfirm();
        } else {
          return false;
        }
      });
    },
    closeFile() {
      this.form = {
        reason: '',
        expirationTime: '',
        upBeginTime: '',
        upEndTime: '',
        lastDeclarePeriodBeginTime: '',
        lastDeclarePeriodEndTime: '',
        approvalFileList: [],
        isChange: '',
      };
      this.$refs['ruleForm'].resetFields();
    },
    auditConfirm() {
      changeExpirationTime({
        reason: this.form.reason,
        expirationTime: this.form.expirationTime,
        serviceId: this.serviceId,
        lastDeclarePeriodBeginTime: this.form.isChange == '1' ? this.selectMonth[0] + '-01 00:00:00' : '',
        lastDeclarePeriodEndTime: this.form.isChange == '1' ? moment(this.selectMonth[1]).endOf('month').format('YYYY-MM-DD') + ' 00:00:00' : '',
        approvalFile: this.form.approvalFileList.length ? this.form.approvalFileList.map((v) => v.url).join(',') : '',
      }).then((res) => {
        if (res.code === 0) {
          this.dialogvisible = false;
          this.$message({
            type: 'success',
            message: '修改成功',
            duration: 2000,
          });
          this.$emit('refresh');
        } else {
          this.$message({
            type: 'fail',
            message: '修改失败',
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-textarea {
  width: 300px;
}

.tip-font {
  color: #de7c09;
  margin-left: 180px;
  margin-bottom: 10px;
}
</style>
