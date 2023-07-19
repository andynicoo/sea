<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="back"><i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>返回列表</el-link>
      <div>
        <!-- 待审核 -->
        <template v-if="status === progressBarObj.WAIT_REVIEW">
          <el-button :disabled="isCancel" size="small" type="primary" @click="audit('审核通过')" v-show="hasAuthority('Y1_4')">审核</el-button>
        </template>
        <!-- 备案中 -->
        <template v-if="status === progressBarObj.FILING">
          <el-button :disabled="isCancel" size="small" type="primary" @click="rejectDialog = true" v-show="hasAuthority('Y1_5')">备案驳回</el-button>
          <el-button :disabled="isCancel" size="small" type="primary" @click="audit('备案完成')" v-show="hasAuthority('Y1_6')">备案完成</el-button>
        </template>
        <!-- 下载资料 -->
        <el-button>
          <a @click="_downloadTemp" v-show="hasAuthority('Y1_7')">下载资料</a>
        </el-button>
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container" :class="{ 'app-container-fold': fold }">
        <div class="header-container">
          <div class="header-block">
            <div class="block-title big-size">{{ productInfo.statusLabel }}</div>
            <div class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</div>
          </div>
          <div class="el-form-wrapper">
            <DynamicForm ref="dynamicForm" :moduleList="dataReview" hideProductItem />
            <FormTitle value="新增产品备案信息" />
            <ProductItems :value="productItems" showOnly />
          </div>
        </div>
      </div>
      <div class="info-block-wrapper" :class="{ 'info-block-wrapper-fold': fold }">
        <el-tabs class="el-tabs" v-model="tabNav">
          <el-tab-pane name="all" label="全部"></el-tab-pane>
          <el-tab-pane name="authAgentInfo" :label="typeName + '信息'" v-if="info.nodeCode === progressBarObj.REGISTER_COMPLETE"></el-tab-pane>
          <el-tab-pane name="serviceInfo" label="服务信息"></el-tab-pane>
          <el-tab-pane name="userInfo" label="用户信息"></el-tab-pane>
          <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
        </el-tabs>
        <div class="info-block">
          <template v-if="info.nodeCode === progressBarObj.REGISTER_COMPLETE && (tabNav === 'all' || tabNav === 'authAgentInfo')">
            <div class="block-title">{{ typeName }}信息</div>
            <div class="info-block-item">
              <span class="info-block-title">订单号：</span>
              <span>{{ orderServices.orderNo }}</span>
            </div>
            <!-- <div class="info-block-item">
              <span class="info-block-title">订单备注：</span>
              <span>{{orderServices.orderRemark}}</span>
            </div> -->
            <div class="info-block-item" v-if="orderServices.countryCode === 'EU'">
              <span class="info-block-title">国家：</span>
              <span>{{ authorizedAgentWorkOrder.supplierCountry }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ authorizedAgentWorkOrder.supplierCompanyName }}</span>
            </div>
            <div class="info-block-item" v-if="orderServices.countryCode === 'EU'">
              <span class="info-block-title">城市：</span>
              <span>{{ authorizedAgentWorkOrder.supplierCity }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">电话：</span>
              <span>{{ authorizedAgentWorkOrder.supplierTel }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">邮箱：</span>
              <span>{{ authorizedAgentWorkOrder.supplierEmail }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">邮编：</span>
              <span>{{ authorizedAgentWorkOrder.supplierPostcode }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">街道详细地址：</span>
              <span>{{ authorizedAgentWorkOrder.supplierAddr }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">协议生效日期：</span>
              <span>{{ authorizedAgentWorkOrder.agreementBeginTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">协议到期日期：</span>
              <span>{{ authorizedAgentWorkOrder.agreementEndTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">{{ typeName }}标签协议：</span>
              <el-link type="primary" :href="authorizedAgentWorkOrder.tagFile" target="_blank">{{ typeName }}标签协议</el-link>
            </div>
          </template>
          <template v-if="tabNav === 'all' || tabNav === 'serviceInfo'">
            <div class="block-title">服务信息</div>
            <div class="info-block-item">
              <span class="info-block-title">订单号：</span>
              <span>{{ authAgentInfo.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">订单备注：</span>
              <span>{{ authAgentInfo.remark }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务号：</span>
              <span>{{ orderServices.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">工单号：</span>
              <span>{{ authAgentInfo.workNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">状态：</span>
              <span>{{ authAgentInfo.status }}</span>
            </div>
            <!-- <div class="info-block-item">
              <span class="info-block-title">服务公司：</span>
              <span>{{authAgentInfo.companyNameZh}}</span>
            </div> -->
            <div class="info-block-item">
              <span class="info-block-title">服务名称：</span>
              <span
                >{{ authAgentInfo.serviceName }}<span v-if="orderServicesVO.specName">({{ orderServicesVO.specName }})</span></span
              >
            </div>
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ authAgentInfo.countryNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">创建时间：</span>
              <span>{{ authAgentInfo.createTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务商：</span>
              <span>{{ orderServices.supplierName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">审核通过时间：</span>
              <span>{{ authAgentInfo.checkPassTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">{{ typeName }}协议：</span>
              <span>
                <el-link type="primary" :href="authAgentInfo.agreement" target="_blank" v-if="authAgentInfo.agreement">{{ typeName }}协议</el-link>
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">{{ typeName }}证书：</span>
              <span>
                <el-link type="primary" :href="authAgentInfo.certificat" target="_blank" v-if="authAgentInfo.certificat">{{ typeName }}证书</el-link>
              </span>
            </div>
          </template>
          <template v-if="authAgentInfo.agentUserVO && (tabNav === 'all' || tabNav === 'userInfo')">
            <div class="block-title">用户信息</div>
            <div class="info-block-item">
              <span class="info-block-title">用户昵称：</span>
              <span>{{ authAgentInfo.agentUserVO.nickName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">手机号：</span>
              <span>{{ authAgentInfo.agentUserVO.mobile }}</span>
            </div>
            <!-- <div class="info-block-item">
              <span class="info-block-title">电子邮箱：</span>
              <span>{{authAgentInfo.agentUserVO.mobile}}</span>
            </div> -->
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ authAgentInfo.agentUserVO.email }}</span>
            </div>
            <!-- <div class="info-block-item">
              <span class="info-block-title">地址：</span>
              <span>{{authAgentInfo.agentUserVO.addr}}</span>
            </div> -->
          </template>
          <OperationLog :activities="activities" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>
      <RejectDialog :rejectDialog.sync="rejectDialog" :id="id" @refresh="getProductInfo"></RejectDialog>
    </div>
  </div>
</template>

<script>
import { progressBarObj } from './enumObj';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import * as comps from './components/index';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import ProductItems from '@/components/WorkOrderComponents/ProductItems'; // 产品信息
import { getFilingInfo, filingApproval } from '@/api/newApi/workOrder/productFiling';
import { getAuthAgentInfo } from '@/api/newApi/workOrder/authorizedRepresent';
import mixin from '@/view/module/workOrder/mixin';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { downloadTemp } from '@/api/newApi/processFields/processConfig';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
export default {
  data() {
    return {
      id: this.$route.query.id,
      serviceId: this.$route.query.serviceId,
      progressBarObj: progressBarObj,
      status: '',
      info: {},
      authAgentInfo: {},
      authorizedAgentWorkOrder: {},
      orderServices: {},
      orderServicesVO: {},
      moduleList: [],
      changeServiceProviderDialog: false,
      rejectDialog: false,
      isEdit: false,
      productInfo: {},
      productItems: [],
      tabNav: 'all',
      fold: false,
    };
  },
  components: {
    ...comps,
    DynamicForm,
    ProductItems,
    OperationLog,
    FormTitle,
  },
  mixins: [mixin, operationLog, isServiceCancel],
  computed: {
    typeName() {
      return this.orderServices.countryCode === 'EU' ? '欧代' : '英代';
    },
  },
  mounted() {
    this.getInfo();
    this.getProductInfo();
  },
  methods: {
    _downloadTemp() {
      // const params = {
      //   serviceId: this.serviceId,
      //   nodeId: this.info.nodeId
      // }
      // downloadTemp(params).then(res => {
      //   if (res.message) {
      //     this.$message.error(res.message)
      //   } else {
      //     window.open(baseUrl + '/workorder/management/vat/download/' + this.serviceId)
      //   }
      // })
      window.open(this.baseUrl + '/workorder/management/authAgent/down?no=' + this.productInfo.workNo + '&type=2');
    },
    getProductInfo() {
      getFilingInfo(this.id).then((res) => {
        this.productInfo = res.data;
        this.productItems = res.data.productItems;
        this.status = res.data.status + '';
      });
    },
    getInfo() {
      getAuthAgentInfo({
        serviceId: this.serviceId,
      }).then((res) => {
        this.info = res.data;
        try {
          res.data.authAgentInfo.remark = JSON.parse(res.data.authAgentInfo.orderRemark).creator.remark;
        } catch (error) {}
        this.authAgentInfo = res.data.authAgentInfo;
        this.authorizedAgentWorkOrder = res.data.authorizedAgentWorkOrder;
        this.orderServices = res.data.orderServices;
        this.orderServicesVO = res.data.orderServicesVO;
        this.ifCancel(res.data.orderServices.status);
        if (res.data.dataReview.length) {
          this.moduleList = res.data.dataReview;
        }
        this.getOperationLog(this.productInfo.workNo, 3);
      });
    },
    // 审核
    audit(text) {
      this.$confirm(`确认${text}？`, '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        filingApproval({
          id: this.id,
          status: 1,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('操作成功');
            this.getProductInfo();
          }
        });
      });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/productFiling/index',
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
    transition: all 0.3s ease-in-out;
    &.app-container-fold {
      width: 100%;
      flex: 100%;
      margin-right: -5px;
    }
    .header-container {
      padding-left: 30px;
      .header-block {
        display: flex;
        justify-content: space-between;
        padding-bottom: 18px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ebeef5;
        .fold {
          cursor: pointer;
          font-size: 14px;
        }
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
</style>
