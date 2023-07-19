<template>
  <el-dialog
    :title="'录入' + typeName + '信息'"
    :visible.sync="dialogvisible"
    width="460px"
    center
    @close="reset"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="国家：" prop="countryNameZh">
        <el-input
          v-model="form.countryNameZh"
          placeholder="/"
          clearable
          size="small"
          style="width: 300px"
          disabled
        />
      </el-form-item>
      <el-form-item label="公司名称：" prop="supplierCompanyName">
        <el-input
          v-model="form.supplierCompanyName"
          placeholder="/"
          clearable
          size="small"
          style="width: 300px"
          disabled
        />
      </el-form-item>
      <el-form-item label="州：" prop="province">
        <el-input
          v-model="form.province"
          placeholder="/"
          clearable
          size="small"
          style="width: 300px"
          disabled
        />
      </el-form-item>
      <el-form-item label="城市：" prop="city">
        <el-input
          v-model="form.city"
          placeholder="/"
          clearable
          size="small"
          style="width: 300px"
          disabled
        />
      </el-form-item>
      <el-form-item label="街道地址：" prop="supplierAddr">
        <el-input
          v-model="form.supplierAddr"
          placeholder="/"
          clearable
          size="small"
          style="width: 300px"
          disabled
        />
      </el-form-item>
      <el-form-item label="邮编：" prop="supplierPostcode">
        <el-input
          v-model="form.supplierPostcode"
          placeholder="/"
          clearable
          size="small"
          style="width: 300px"
          disabled
        />
      </el-form-item>
      <el-form-item label="邮箱：" prop="supplierEmail">
        <el-input
          v-model="form.supplierEmail"
          placeholder="/"
          clearable
          size="small"
          style="width: 300px"
          disabled
        />
      </el-form-item>
      <el-form-item label="联系电话：" prop="supplierTel">
        <el-input
          v-model="form.supplierTel"
          placeholder="/"
          clearable
          size="small"
          style="width: 300px"
          disabled
        />
      </el-form-item>
      <el-form-item label="协议生效日期：" prop="agreementBeginTime">
        <el-date-picker
          v-model="form.agreementBeginTime"
          type="date"
          align="right"
          size="small"
          clearable
          unlink-panels
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          style="width: 200px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="协议到期日期：" prop="agreementEndTime">
        <el-date-picker
          v-model="form.agreementEndTime"
          type="date"
          align="right"
          size="small"
          clearable
          unlink-panels
          :picker-options="pickerOptions"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          style="width: 200px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="typeName + '标签文件：'" prop="tagFile">
        <UploadFile
          :fileList.sync="form.tagFile"
          :showTip="false"
          fileClass
        >
        </UploadFile>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      
      <el-button @click="dialogvisible = false" size="small"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="submit"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import UploadFile from '@/components/UploadFile/index'
import {authAgentDefInformation, authAgentInputInformation} from '@/api/newApi/workOrder/authorizedRepresent'
export default {
  props: {
    recordDialog: Boolean,
    serviceId: String,
    typeName: String,
    countryCode: String
  },
  data() {
    const that = this
    return {
      form: {
        countryNameZh: '',
        supplierCompanyName: '',
        province: '',
        city: '',
        supplierAddr: '',
        supplierTel: '',
        supplierEmail: '',
        supplierPostcode: '',
        agreementBeginTime: '',
        agreementEndTime: '',
        tagFile: [],
      },
      pickerOptions: {
        disabledDate(time) {
          if (that.form.agreementBeginTime) {
            let date = new Date(that.form.agreementBeginTime);
            date.setFullYear(date.getFullYear() + 1);
            date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
            return time.getTime() < date;
          }
          return null;
        },
      },
      rules: {
        // countryNameZh: [{required: true, message: '请输入国家', trigger: 'blur'}],
        // supplierCompanyName: [{required: true, message: '请输入公司名称', trigger: 'blur'}],
        // city: [{required: true, message: '请输入城市', trigger: 'blur'}],
        // supplierAddr: [{required: true, message: '请输入地址', trigger: 'blur'}],
        // supplierTel: [{required: true, message: '请输入电话', trigger: 'blur'}],
        // supplierEmail: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
        // supplierPostcode: [{required: true, message: '请输入邮编', trigger: 'blur'}],
        agreementBeginTime: [{required: true, message: '请选择协议生效日期', trigger: 'blur'}],
        agreementEndTime: [{required: true, message: '请选择协议到期日期', trigger: 'blur'}],
        tagFile: [{type: 'array', required: true, message: '请上传英代标签文件', trigger: 'blur'}],
      }
    };
  },
  components: {
    UploadFile
  },
  computed: {
    dialogvisible: {
      get() {
        return this.recordDialog;
      },
      set(val) {
        this.$emit("update:recordDialog", val);
      },
    },
  },
  watch: {
    dialogvisible(newVal) {
      if(newVal) {
        this.getInfo()
      }
    },
    'form.agreementBeginTime'(newVal) {
      if(newVal) {
        let date = new Date(newVal)
        date.setFullYear(date.getFullYear() + 1)
        date.setTime(date.getTime() - 24*60*60*1000)
        this.form.agreementEndTime = this.$util.formatDateToStr(date)
      }
    }
  },
  methods: {
    reset() {
      if(this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    getInfo() {
      authAgentDefInformation(this.serviceId).then(res => {
        res.data.tagFile = [{
          url: res.data.tagFile,
          name: `${this.typeName}标签文件`
        }]
        this.form = res.data
      })
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      authAgentInputInformation({
        ...this.form,
        agreementBeginTime: this.form.agreementBeginTime + ' 00:00:00',
        agreementEndTime: this.form.agreementEndTime + ' 23:59:59',
        tagFile: this.form.tagFile.map(item => item.url).join(','),
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('录入成功');
          this.$emit("refresh");
        }
      });
    },
  },
};
</script>

<style></style>
