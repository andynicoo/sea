<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="back"><i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>返回列表</el-link>
      <div>
        <el-button size="small" type="primary" @click="submitDeclare" v-show="hasAuthority('p2_3') && eprDeclare.status == 0">提交申报</el-button>

        <el-button @click="uploadReceiptDialog = true" v-if="eprDeclare.status == 1" type="primary" v-show="hasAuthority('p2_4')"> 上传回执 </el-button>

        <!-- 下载资料 -->
        <el-button v-if="hasAuthority('p2_5')">
          <a @click="_downloadTemp">下载资料</a>
        </el-button>
        <!-- 申报中 -->
        <template v-if="eprDeclare.status == 1">
          <el-button size="small" type="primary" @click="completeDeclare" v-show="hasAuthority('p2_6')">完成申报</el-button>
        </template>
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container">
        <div class="header-container">
          <div class="header-block">
            <div class="block-title big-size">{{ eprDeclare.status | filterStatus(progressBarList) }}</div>
          </div>

          <div class="el-form-wrapper">
            <DynamicForm ref="dynamicForm" :moduleList="dataReview" :showBtn="false" />
          </div>
        </div>
      </div>

      <div class="info-block-wrapper">
        <el-tabs class="el-tabs" v-model="tabNav">
          <el-tab-pane name="all" label="全部"></el-tab-pane>
          <el-tab-pane name="serviceInfo" label="服务信息"></el-tab-pane>
          <el-tab-pane name="userInfo" label="用户信息"></el-tab-pane>
          <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
        </el-tabs>
        <div class="info-block">
          <template v-if="tabNav === 'all' || tabNav === 'serviceInfo'">
            <div class="block-title">服务信息</div>
            <div class="info-block-item">
              <span class="info-block-title">订单号：</span>
              <span>{{ orderServices.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">订单备案：</span>
              <span>{{ orderServices.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务号：</span>
              <span>{{ orderServices.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">工单号：</span>
              <span>{{ eprDeclare.workNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务进度：</span>
              <span>{{ eprDeclare.status | filterStatus(progressBarList) }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务名称：</span>
              <span
                >{{ orderServices.serviceName }}<span v-if="orderServices.specName">({{ orderServices.specName }})</span></span
              >
            </div>
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ orderServices.countryNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务商：</span>
              <span>{{ orderServices.supplierName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">创建时间：</span>
              <span>{{ eprDeclare.createTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务完成时间：</span>
              <span>{{ eprDeclare.completeTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">合同：</span>
              <span v-if="eprBaseInfo.contract && eprBaseInfo.contract != '[]'">
                <el-link v-for="(img, i) in $util.convertImage(eprBaseInfo.contract)" :key="i" :href="img" type="primary" target="_blank"> 合同 </el-link>
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">授权书：</span>
              <span v-if="eprBaseInfo.authCertificate && eprBaseInfo.authCertificate != '[]'">
                <el-link v-for="(img, i) in $util.convertImage(eprBaseInfo.authCertificate)" :key="i" :href="img" type="primary" target="_blank"> 授权书 </el-link>
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">证书：</span>
              <span v-for="(item, i) in eprBaseInfo.registrationReceipt" :key="i" style="margin-right: 10px">
                <el-link v-if="item" type="primary" :href="replaceHttps(item)" target="_blank">证书</el-link>
              </span>
            </div>

            <div class="info-block-item">
              <span class="info-block-title">申报区间：</span>
              <span>{{ eprDeclare.beginTime }} - {{ eprDeclare.endTime }} </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">申报截止日期：</span>
              <span>{{ eprDeclare.due }}</span>
            </div>

            <div class="info-block-item">
              <span class="info-block-title">服务截止时间：</span>
              <span>{{ orderServices.expirationTime }}</span>
            </div>
          </template>
          <template v-if="tabNav === 'all' || tabNav === 'userInfo'">
            <div class="block-title">用户信息</div>
            <div class="info-block-item">
              <span class="info-block-title">手机号：</span>
              <span>{{ orderServices.userMobile }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ orderServices.companyNameZh }}</span>
            </div>
          </template>
          <OperationLog :activities="activities" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>

      <UploadReceiptDialog :uploadReceiptDialog.sync="uploadReceiptDialog" :declareReceipt="eprDeclare.declareReceipt" :getInfo="getInfo" :eprDeclare="eprDeclare" eprUploadType="preEprDeclare"> </UploadReceiptDialog>
    </div>
  </div>
</template>

<script>
import { progressBarList } from './enumObj';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import * as comps from '../EPRManage/components/index';
import { getPreDeclareDetailAPI, submitEprDecalre, submitPreDecalre } from '@/api/newApi/workOrder/preDeclare';
import { downloadTemp } from '@/api/newApi/processFields/processConfig';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import UploadReceiptDialog from '@/view/module/workOrder/EPRDeclare/components/uploadReceiptDialog';
import { getBusinessLogListByWorkNo } from '@/api/newApi/common';

export default {
  data() {
    return {
      workNo: this.$route.query.workNo,
      info: {},
      eprBaseInfo: {},
      eprDeclare: {},
      orderServices: {},
      replace: false,
      moduleList: [],
      progressBarList,
      countrySelectList: [],
      uploadReceiptDialog: false,
      tabNav: 'all',
    };
  },
  mixins: [operationLog, isServiceCancel],
  components: {
    ...comps,
    DynamicForm,
    UploadReceiptDialog,
    OperationLog,
  },
  computed: {
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          this.$set(item, 'disabled', true);
        });
      });
      return this.moduleList;
    },
  },
  mounted() {
    this.getInfo();
  },
  filters: {
    filterStatus(status, statusList) {
      let result = statusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
  },
  methods: {
    _downloadTemp() {
      downloadTemp(this.orderServices.id).then((res) => {
        if (res.message) {
          this.$message.error(res.message);
        } else {
          window.open(this.baseUrl + '/workorder/management/vat/download/' + this.orderServices.id);
        }
      });
    },
    getOperationLog(businessNo, businessType) {
      getBusinessLogListByWorkNo({
        businessNo,
        businessType,
      }).then((res) => {
        if (res.code === 0) {
          this.activities = res.data;
        }
      });
    },
    getInfo() {
      getPreDeclareDetailAPI({
        workNo: this.workNo,
      }).then((res) => {
        this.info = res.data;

        this.eprDeclare = res.data.eprDeclare;
        this.orderServices = res.data.orderServicesVO;
        this.ifCancel(res.data.orderServicesVO.status);

        this.eprBaseInfo = res.data.eprWorkOrder;

        if (res.data.dataReview.length) {
          this.moduleList = res.data.dataReview;
        }
        this.getOperationLog(res.data.eprDeclare.workNo, 3);
      });
    },
    // 提交
    submitDeclare() {
      this.$confirm('是否确认提交？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        submitPreDecalre({
          workNo: this.workNo,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('提交成功');
            this.getInfo();
          }
        });
      });
    },

    // 完成申报
    completeDeclare() {
      this.$confirm('确认完成申报吗？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        submitEprDecalre({
          workNo: this.workNo,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
            this.getInfo();
          }
        });
      });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/preDeclare/index',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  .app-container {
    width: calc(100% - 410px);
    flex: 0 0 calc(100% - 410px);
    margin-top: 10px;
    .header-container {
      padding-left: 30px;
      .header-block {
        display: flex;
        justify-content: space-between;
        padding-bottom: 18px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ebeef5;
      }
      .el-form-wrapper {
        height: calc(100vh - 312px);
        overflow-y: auto;
      }
    }
  }
  .info-block {
    max-height: calc(100vh - 272px);
  }
}

.category-table {
  .el-table__header {
    width: 100%;

    .el-table__cell {
      height: 48px;
    }
  }

  /deep/ .el-table__header th {
    background: #fff !important;
  }

  /deep/ .el-table__cell {
    background: #fff !important;
  }

  .w-300 {
    width: 300px;
  }
}
</style>
