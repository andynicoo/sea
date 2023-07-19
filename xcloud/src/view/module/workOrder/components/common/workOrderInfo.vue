<template>
  <div>
    <div class="block-title">工单信息</div>
    <div class="info-block-item">
      <span class="info-block-title">客户：</span>
      <span>{{ serviceInfo.customer }}</span>
      <el-link icon="el-icon-edit" type="primary" v-show="hasAuthority('L1_34')" @click="modifyCompanyDialog = true" :underline="false" v-if="serviceInfo.currentNodeCode === currentCodeEnum.NODE8 && (serviceInfo.status == 1 || serviceInfo.status == 2)"> </el-link>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">手机号：</span>
      <span>{{ serviceInfo.userMobile }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">订单号：</span>
      <span>{{ serviceInfo.orderNo }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">订单归属人：</span>
      <span>{{ serviceInfo.attributionName }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">订单备注：</span>
      <span>{{ serviceInfo.orderRemark }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">服务号：</span>
      <span>{{ serviceInfo.serviceNo }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">工单号：</span>
      <span>{{ serviceInfo.workNo }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">国家：</span>
      <span>{{ serviceInfo.countryNameZh }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">商品名称：</span>
      <span>{{ serviceInfo.serviceName }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">工单状态：</span>
      <span>{{ serviceInfo.workStatus | filterWorkStatus }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">工单进度：</span>
      <span>{{ serviceInfo.currentNodeCode | filterKey(currentCodeList) }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">驳回原因：</span>
      <el-link type="primary" :underline="false" @click="checkRejectInfoDialog = true" v-show="hasAuthority('L1_25')"> 查看 </el-link>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">服务商：</span>
      <span>{{ serviceInfo.supplierName }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">服务商分配编码：</span>
      <span>{{ serviceInfo.supplierAssignsCode }}</span>
      <el-link icon="el-icon-edit" @click="model.ServiceModel = true" v-show="hasAuthority('L1_24')"></el-link>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">服务截止时间：</span>
      <span>{{ serviceInfo.expirationTime }}</span>
      <el-link icon="el-icon-edit" v-show="hasAuthority('L1_33')" type="primary" @click="modifyExpireTime = true" :underline="false" v-if="(serviceInfo.status == 1 || serviceInfo.status == 2) && serviceInfo.currentNodeCode === currentCodeEnum.NODE8"> 修改服务截止时间 </el-link>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">工单创建时间：</span>
      <span>{{ serviceInfo.createTime }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">上传资料时间：</span>
      <span>{{ serviceInfo.saveMaterialTime }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">资料审核通过时间：</span>
      <span>{{ serviceInfo.auditPassTime }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">获取授权时间：</span>
      <span>{{ serviceInfo.authTime }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">授权审核通过时间：</span>
      <span>{{ serviceInfo.authPassTime }}</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">工单完成时间：</span>
      <span>{{ serviceInfo.completeTime }}</span>
    </div>
    <slot></slot>
    <Model :dialog="model" :workOrderId="serviceInfo.workId" :detailObj="serviceInfo" v-if="serviceInfo.countryCode" @refresh="refresh" />
    <CheckRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :workNo="serviceInfo.workNo" />
    <ModifyExpirationTime :modifyExpireTime.sync="modifyExpireTime" :serviceId="serviceInfo.serviceId" :expirationTime="serviceInfo.expirationTime" :productFunctionCode="serviceInfo.functionCode" :declarePeriod="serviceInfo.declarePeriod" @refresh="refresh" />
    <ModifyCompanyModel :modifyCompanyDialog.sync="modifyCompanyDialog" :companyNameEn="serviceInfo.companyNameEn" :companyNameZh="serviceInfo.companyNameZh" :serviceId="serviceInfo.serviceId" :workId="serviceInfo.workId" @refresh="refresh" />
  </div>
</template>

<script>
import Model from '@/view/module/newTaxServices/taxRegister/deatilModel';
import CheckRejectInfoDialog from '@/view/module/workOrder/components/checkRejectInfoDialog';
import ModifyExpirationTime from '@/view/module/newTaxServices/components/modifyExpirationTime';
import ModifyCompanyModel from '@/view/module/newTaxServices/components/modifyCompanyModel';
import { currentCodeList, currentCodeEnum } from '@/view/module/workOrder/map.js';
export default {
  props: {
    serviceInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    Model,
    CheckRejectInfoDialog,
    ModifyExpirationTime,
    ModifyCompanyModel,
  },
  filters: {
    filterWorkStatus(workStatus) {
      switch (workStatus) {
        case 1:
          return '正常';
        case 2:
          return '取消';
        default:
          return workStatus;
      }
    },
  },
  data() {
    return {
      currentCodeList,
      currentCodeEnum,
      checkRejectInfoDialog: false,
      modifyExpireTime: false,
      modifyCompanyDialog: false,
      model: {
        ServiceModel: false,
      },
    };
  },
  methods: {
    refresh() {
      this.$emit('refresh');
    },
  },
};
</script>

<style></style>
