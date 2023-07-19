<template>
  <div class="process-configuration-wrapper" :class="{ 'process-first': activeName == 'first' }">
    <div class="process-configuration-header">
      <img class="max-logo" src="@/assets/images/common/icon_logo.svg" />
      <el-tooltip placement="bottom" effect="light" popper-class="process-info-tip">
        <ul slot="content" class="process-info">
          <li><span>业务类型：</span>{{ processForm.flowType.split('-')[0] }}</li>
          <li><span>工单类型：</span>{{ processForm.flowType.split('-')[1] }}</li>
          <li><span>主体：</span>{{ enterpriseName && enterpriseName.join() }}</li>
          <li><span>国家：</span>{{ processForm.countryName && processForm.countryName.join() }}</li>
          <li><span>供应商：</span>{{ processDetail.supplierName }}</li>
          <li><span>备注：</span>{{ processForm.remarks }}</li>
        </ul>
        <dl class="process-name">
          <dt v-if="processForm.flowName">{{ processForm.flowName }}</dt>
        </dl>
      </el-tooltip>
    </div>
    <div class="process-config-tabs">
      <el-tabs v-model="activeName" :before-leave="handleBeforeClick">
        <el-tab-pane label="服务信息" name="first"></el-tab-pane>
        <el-tab-pane label="流程编排" name="third"></el-tab-pane>
      </el-tabs>
      <span v-show="processForm.flowId" class="process-status">{{ statusTxt[processDetail.status] }}</span>
    </div>
    <div class="process-serviceInformation" v-show="activeName == 'first'">
      <h2 class="text-align-center">{{ processForm.flowType }}</h2>
      <p class="text-align-center text-desc">请设置该业务的服务国家及供应商信息</p>
      <el-form :model="processForm" :rules="rules" ref="processForm" label-width="100px" class="serviceInformation-processForm">
        <el-form-item label="主体平台" prop="enterpriseId">
          <el-select :disabled="processDetail.status == 4" clearable class="w500" multiple v-model="processForm.enterpriseId" placeholder="请选择主体平台">
            <el-option v-for="item in enterpriseList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家" prop="countryCode">
          <el-select :disabled="processDetail.status == 4" clearable class="w500" multiple filterable v-model="processForm.countryCode" placeholder="请选择国家" @change="countryChange">
            <el-option v-for="item in countryList" :key="item.id" :label="item.countryNameZh" :value="item.countryCode"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="serviceProviderId">
          <el-select :disabled="processDetail.status == 4" clearable multiple filterable class="w500" v-model="processForm.serviceProviderId" placeholder="请选择供应商">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.shortName" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input class="w500" type="textarea" :autosize="{ minRows: 2, maxRows: 8 }" v-model="processForm.remarks" maxlength="150"></el-input>
        </el-form-item>
      </el-form>
      <div class="process-handle-btn">
        <el-button type="primary" @click="submitForm('processForm')">下一步</el-button>
      </div>
    </div>
    <ProcessChoreography :releaseData="releaseData" @handleNext="handleNext" v-show="activeName == 'third'" :processFormPrev="processForm" @updataProcessDetail="updataProcessDetail" />
  </div>
</template>

<script>
import { findNodes, getProcessDetail } from '@/api/newApi/processFields/processConfig';
import { supplierList, newSupplierList, getServiceFunction, supplierFunctionCode } from '@/api/newApi/workOrder/processConfiguration';
import ProcessChoreography from './components/processChoreography.vue';
export default {
  name: 'processConfiguration',
  components: {
    ProcessChoreography,
  },
  data() {
    return {
      statusTxt: ['草稿', '未审核', '已审核', '审核失败', '已发布', '已停用'],
      processDetail: {},
      activeName: 'first',
      enterpriseList: [],
      enterpriseName: [],
      supplierName: [],
      countryList: [],
      supplierList: [
        {
          erpSupplierId: '120925',
          supplierName: 'ASIN SERVICE',
        },
        {
          erpSupplierId: '208883',
          supplierName: '深圳市中凯检测技术有限公司',
        },
      ],
      releaseData: {},
      processForm: {
        flowId: '',
        flowName: '',
        flowType: '',
        enterpriseId: '',
        countryCode: '',
        countryName: '',
        serviceProviderId: '',
        remarks: '',
        functionCode: '',
      },
      rules: {
        enterpriseId: [{ required: true, message: '请选择主体平台', trigger: 'change' }],
        countryCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
        serviceProviderId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
      },
    };
  },
  created() {
    this.enterpriseList = JSON.parse(localStorage.enterpriseList);
    this.countryList = JSON.parse(localStorage.countryList);
    if (this.$route.query.fid) {
      this.processForm.flowId = this.$route.query.fid;
      this.queryProcessDetail();
    }
    if (this.$route.query.code) {
      this.processForm.functionCode = this.$route.query.code;
      this.processForm.flowType = `${this.$route.query.bType} - ${this.$route.query.wType}`;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.processForm.clearValidate();
    });
  },
  methods: {
    //更新详情
    updataProcessDetail(detail) {
      this.processDetail = detail;
    },
    //tabs切换
    handleBeforeClick(activeName) {
      let flag = true;
      if (activeName == 'third') {
        this.$refs['processForm'].validate((valid) => {
          if (!valid) {
            flag = false;
          }
        });
      }

      return flag;
    },
    //下一步
    handleNext(val) {
      this.activeName = val;
    },

    /**
     * 查询服务商列表
     */
    querySupplierList(countryCodeList) {
      supplierFunctionCode({ functionCode: this.$route.query.code, countryCodeList }).then((res) => {
        if (res.code == 0) {
          this.supplierList = res.data;
        }
      });
    },
    //选择国家
    countryChange(val) {
      console.log(val);
      this.processForm.serviceProviderId = '';
      let currentCountry = this.countryList.filter((item) => {
        return val.includes(item.countryCode);
      });
      this.querySupplierList(val);
      this.processForm.countryName = currentCountry.map((item) => item.countryNameZh);
      this.$set(this.releaseData, 'countryNameCH', this.processForm.countryName.join());
    },
    /**
     * 查询流程详情
     */
    queryProcessDetail() {
      getProcessDetail({ flowId: this.processForm.flowId }).then((res) => {
        if (res.code == 0) {
          this.processDetail = res.data;
          this.releaseData = res.data;
          this.processForm.flowName = res.data.flowName;
          this.processForm.countryCode = res.data.countryCode;
          this.querySupplierList(res.data.countryCode);
          this.countryChange(res.data.countryCode);
          this.processForm.serviceProviderId = res.data.serviceProviderId;
          this.processForm.enterpriseId = res.data.enterpriseId;
          this.processForm.remarks = res.data.remarks;
          this.supplierList.forEach((item) => {
            if (this.processDetail.serviceProviderId.includes(item.erpSupplierId)) {
              this.supplierName.push(item.supplierName);
            }
          });
          this.enterpriseList.forEach((item) => {
            if (this.processDetail.enterpriseId.includes(item.id)) {
              this.enterpriseName.push(item.name);
              this.processForm.enterpriseName = this.enterpriseName;
            }
          });

          this.$set(this.releaseData, 'enterpriseName', this.processForm.enterpriseName.join());
        }
      });
    },
    //保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // localStorage.processConfigurationInfo = JSON.stringify({ ...this.processForm })
          this.handleNext('third');
          console.log(this.processForm);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
};
</script>
<style>
.process-info-tip {
  border-color: #fff !important;
  box-shadow: 0 0 5px #ddd;
}
.process-info-tip .popper__arrow {
  display: none;
}
</style>
<style lang="scss" scoped>
.process-status {
  padding: 0 10px;
  line-height: 24px;
  height: 24px;
  background: #52c41a;
  border-radius: 2px 2px 2px 2px;
  color: #fff;
  font-size: 12px;
  display: inline-block;
  position: relative;
  top: -24px;
  right: -7px;
}

.process-configuration-wrapper {
  background-color: #f4f7f9;
  height: 100%;
  overflow-x: auto;
}
.process-first {
  background: #fff;
}
.process-configuration-header {
  width: 100%;
  background: #fff;
  padding: 0 10px;
  height: 64px;
  position: absolute;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.04);

  .max-logo {
    float: left;
    margin-top: 14px;
    margin-left: 22px;
  }

  .process-name {
    float: left;
    height: 30px;
    margin-top: 15px;
    color: #1890ff;
    cursor: pointer;
    
    dt,
    dd {
      float: left;
    }
    dt {
      margin-top: 5px;
      font-size: 14px;
      margin-left: 20px;
      text-decoration: underline;
    }

    dd {
      padding: 0 10px 0 20px;
      margin-left: 30px;

      img {
        border: 1px solid #1890ff;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-left: -15px;
      }
    }
  }
}

.process-info {
  list-style: none;

  li {
    margin: 10px 5px;
    max-width: 500px;
  }

  span {
    display: inline-block;
    min-width: 60px;
    color: #999;
  }
}

/* .process-handle-btn {
    float: right;
    margin-top: 12px;
} */

.process-config-tabs {
  text-align: center;
  padding-top: 9px;

  .el-tabs {
    display: inline-block;
    margin-top: 5px;
    ::v-deep .el-tabs__header {
      margin-bottom: 0 !important;
    }
    ::v-deep .el-tabs__item {
      font-weight: bold;
      height: 50px;
    }
  }

  ::v-deep .el-tabs__nav-wrap::after {
    display: none;
  }

  ::v-deep .el-tabs__item {
    font-size: 16px;
  }
}

.process-serviceInformation {
  width: 700px;
  margin: 100px auto;

  h2 {
    margin-bottom: 16px;
    font-size: 14px;
    color: #000;
  }

  .serviceInformation-processForm {
    margin-top: 50px;

    .el-form-item {
      margin-bottom: 32px;
    }
  }

  .w500 {
    width: 500px;
  }
}

.process-handle-btn {
  position: absolute;
  top: 16px;
  right: 32px;
}
</style>
