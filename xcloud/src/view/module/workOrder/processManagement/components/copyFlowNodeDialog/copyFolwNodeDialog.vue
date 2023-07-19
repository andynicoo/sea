<!--  -->
<template>
  <el-dialog title="复制流程" :visible.sync="dialogvisible" width="488px" :before-close="handleClose">
    <el-form :inline="true" class="main" :model="form" label-width="100px">
      <el-row class="title"> 选择复制内容 </el-row>
      <el-row>
        <el-form-item label="复制的流程："> {{ processInfo.flowName || '-' }} </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="复制内容：">流程节点，表单信息</el-form-item>
      </el-row>
      <el-row class="title"> 填写新流程的服务信息 </el-row>
      <el-form-item label="主体平台" :rules="[{ required: true, message: '请选择主题平台', trigger: 'change' }]">
        <el-select v-model="form.enterpriseId" multiple placeholder="选择企业" @change="querySupplierList">
          <el-option :value="item.id" :label="item.name" v-for="item in firmList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="国家">
        <el-select v-model="form.countryCode" multiple placeholder="请选择国家" filterable @change="querySupplierList">
          <el-option v-for="item in countryOptions" :value="item.countryCode" :key="item.id" :label="item.countryNameZh"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" :rules="[{ required: true, message: '请选择供应商', trigger: 'change' }]">
        <el-select v-model="form.serviceProviderId" multiple placeholder="请选择供应商" filterable>
          <el-option v-for="item in supplierArr" :key="item.id" :label="item.shortName" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="form.remarks"> </el-input>
      </el-form-item>
      <el-form-item label="复制到" :rules="[{ required: true, message: '请选择复制倒目标流程', trigger: 'change' }]">
        <el-input v-model="processInfo.destination" :disabled="true"></el-input>
      </el-form-item>
      <el-row class="copy-tips" type="flex" align="right" justify="end"> 复制成功后流程将默认为草稿状态 </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">创建新流程</el-button>
      <el-button @click="dialogvisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { findCountrys, serviceWorkflowCopy } from '@/api/newApi/processFields/processConfig';
// import { newfindProcesses } from '@/api/newApi/processFields/processConfig';
import { supplierFunctionCode } from '../../../../../../api/newApi/workOrder/processConfiguration';
import { listEnableAll } from '@/api/newApi/common.js';
export default {
  name: 'CopyFolwNodeDialog',
  props: {
    visible: Boolean,
    processInfo: {
      typeof: Object,
      default: {
        label: '',
      },
    },
  },
  data() {
    return {
      form: {},
      countryOptions: [],
      supplierArr: [],
      firmList: [],
    };
  },
  created() {
    this.getCountrySelectListApi();
    this.querySupplierList();
    this.getFirmList();
  },
  computed: {
    dialogvisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },

  methods: {
    async onSubmit() {
      let { functionCode, flowId, flowName } = this.processInfo;
      let flowNameArr = flowName.split(']');
      flowName =
        JSON.stringify(
          this.form.countryCode.map((item) => {
            let country = this.countryOptions.find(({ countryCode }) => countryCode == item);
            return country.countryNameZh;
          })
        ) + flowNameArr[1];
      flowName = flowName.replaceAll('"', '');
      let params = { ...this.form, functionCode, sourceFlowId: flowId, flowName };
      let { code } = await serviceWorkflowCopy(params);
      if (code == 0) {
        this.$message.success('复制成功');
        this.dialogvisible = false;
      } else {
        this.$message.error('操作失败');
      }
    },
    handleClose(done) {
      done();
    },

    async getCountrySelectListApi() {
      let { code, data } = await findCountrys();
      if (code == 0) {
        this.countryOptions = data;
      } else {
        this.$message.error('数据异常');
      }
    },

    /**
     * 查询服务商列表-根据国家code
     */
    querySupplierList() {
      let { functionCode } = this.processInfo;
      supplierFunctionCode({
        countryCodeList: this.form.countryCode,
        flow: false,
        functionCode,
      }).then((res) => {
        if (res.code == 0) {
          this.supplierArr = res.data;
        }
      });
    },

    getFirmList() {
      listEnableAll().then((res) => {
        if (res.code === 0) {
          this.firmList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  padding: 0px 15px;
}

.copy-tips {
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
}

.title {
  font-size: 14px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 600;
  color: #333333;
  padding: 22px 0px 24px 0px;
  text-align: right;
}
</style>
