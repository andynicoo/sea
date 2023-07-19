<template>
  <div>
    <div class="block-title">
      <span>税号信息</span>

      <span
        @click="
          model.editorTaxNumModel = true;
          model.taxInfoModel = true;
        "
        v-if="canModify && serviceInfo.currentNodeCode == currentCodeEnum.NODE8 && hasAuthority('L1_26')"
        style="float: right; font-weight: 400; margin-top: 2px; cursor: pointer"
      >
        【修改税号信息】
      </span>
    </div>
    <div class="info-block-item" v-if="serviceInfo.taxQualityDTO && serviceInfo.taxQualityDTO.taxNumberEuQueryDisplay">
      <span class="info-block-title">欧盟税号：</span>
      <span>{{ serviceInfo.taxQualityDTO.taxNumberEu }}</span>
      <span :style="`margin: 0 10px; color: ${serviceInfo.taxQualityDTO.taxNumberEuStatus == 1 ? '#1890ff' : 'red'}`">{{ status[serviceInfo.taxQualityDTO.taxNumberEuStatus] }}</span>
      <el-button type="primary" style="margin-top: 10px" @click="viewTax" :loading="viewTaxLoading">查询税号</el-button>
    </div>
    <div class="info-block-item" v-if="canModify">
      <span class="info-block-title">税号：</span>
      <span>{{ serviceInfo.vatTaxNumber }}</span>
      <el-link icon="el-icon-edit" type="primary" @click="modifyVatTaxDialog = true" :underline="false" v-if="canModify && serviceInfo.currentNodeCode === currentCodeEnum.NODE8 && hasAuthority('L1_35') && (serviceInfo.status == 1 || serviceInfo.status == 2)"> </el-link>
      <template v-if="serviceInfo.countryCode === 'GB' && serviceInfo.taxQualityDTO && serviceInfo.taxQualityDTO.taxNumberQueryDisplay">
        <span :style="`margin: 0 10px; color: ${serviceInfo.taxQualityDTO.taxNumberStatus == 1 ? '#1890ff' : 'red'}`">{{ status[serviceInfo.taxQualityDTO.taxNumberStatus] }}</span>
        <el-button type="primary" style="margin-top: 10px" @click="viewTax" :loading="viewTaxLoading">查询税号</el-button>
      </template>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">税号文件：</span>
      <el-link type="primary" :underline="false" :href="serviceInfo.vatTaxNumberFile" target="_blank" v-if="serviceInfo.vatTaxNumberFile"> 查看 </el-link>
      <span v-else>暂无</span>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">税号生效日期：</span>
      <span>{{ (serviceInfo.taxEffectiveDate || '').split(' ')[0] }}</span>
      <el-link icon="el-icon-edit" type="primary" @click="modifyTaxEffectiveDateDialog = true" :underline="false" v-if="canModify && serviceInfo.currentNodeCode === currentCodeEnum.NODE8 && (serviceInfo.status == 1 || serviceInfo.status == 2) && hasAuthority('L1_36')"> </el-link>
    </div>
    <div class="info-block-item">
      <span class="info-block-title">税号下发日期：</span>
      <span>{{ (serviceInfo.taxIssueDate || '').split(' ')[0] }}</span>
      <el-link icon="el-icon-edit" type="primary" @click="modifyTaxIssueDateDialog = true" :underline="false" v-if="canModify && serviceInfo.currentNodeCode === currentCodeEnum.NODE8 && (serviceInfo.status == 1 || serviceInfo.status == 2) && hasAuthority('L1_37')"> </el-link>
    </div>
    <div class="info-block-item" v-if="isInternalService">
      <span class="info-block-title">转代理开始申报时间：</span>
      <span>{{ (serviceInfo.proxyPeriodBeginTime || '').split(' ')[0] }} - {{ (serviceInfo.proxyPeriodEndTime || '').split(' ')[0] }}</span>
    </div>

    <div class="info-block-item" v-if="serviceInfo.countryCode === 'GB' || isEUCountries(serviceInfo.countryCode)">
      <span class="info-block-title">EORI号：</span>
      <span>{{ serviceInfo.eoriNumber }}</span>
    </div>
    <div class="info-block-item" v-if="serviceInfo.countryCode === 'GB' || isEUCountries(serviceInfo.countryCode)">
      <span class="info-block-title">EORI文件：</span>
      <el-link type="primary" :underline="false" :href="serviceInfo.eoriNumberFile" target="_blank" v-if="serviceInfo.eoriNumberFile"> 查看 </el-link>
      <span v-else>暂无</span>
    </div>
    <div class="info-block-item" v-if="['ES', 'AT'].includes(serviceInfo.countryCode)">
      <span class="info-block-title">欧盟税号：</span>
      <span>{{ serviceInfo.vatTaxEuNumber }}</span>
    </div>
    <div class="info-block-item" v-if="['ES', 'AT'].includes(serviceInfo.countryCode)">
      <span class="info-block-title">税号证书：</span>
      <el-link type="primary" :underline="false" :href="serviceInfo.vatCertificate" target="_blank" v-if="serviceInfo.vatCertificate"> 查看 </el-link>
      <span v-else>暂无</span>
    </div>

    <div class="info-block-item" v-if="serviceInfo.countryCode === 'GB' || isEUCountries(serviceInfo.countryCode)">
      <span class="info-block-title">VAT证书：</span>
      <el-link type="primary" :underline="false" :href="serviceInfo.vatCertificate" target="_blank" v-if="serviceInfo.vatCertificate"> 查看 </el-link>
      <span v-else>暂无</span>
    </div>
    <template v-if="serviceInfo.countryCode == 'GB'">
      <div class="info-block-item">
        <span class="info-block-title">gateway 账号：</span>
        <span>{{ serviceInfo.gatewayId }}</span>
      </div>
      <div class="info-block-item">
        <span class="info-block-title">gateway 密码：</span>
        <span>{{ serviceInfo.gatewayPassword }}</span>
      </div>
      <div class="info-block-item">
        <span class="info-block-title">密钥：</span>
        <span>{{ serviceInfo.secret }}</span>
      </div>
    </template>
    <template v-if="serviceInfo.countryCode == 'DE'">
      <div class="info-block-item">
        <span class="info-block-title">DE欧盟证书：</span>
        <span v-if="serviceInfo.deEuCertificate">
          <el-link type="primary" :underline="false" :href="serviceInfo.deEuCertificate" target="_blank"> 下载 </el-link>
        </span>
        <span v-else> 暂无 </span>
        <el-link icon="el-icon-edit" v-if="canModify" @click="model.uploadDEEUCertificate = true"></el-link>
      </div>
      <div class="info-block-item">
        <span class="info-block-title">税务副本：</span>
        <!-- <el-link type="primary" :underline="false" :href="serviceInfo.vatTaxNumberCopyFile" target="_blank" v-if="serviceInfo.vatTaxNumberCopyFile"> 查看 </el-link>
        <span v-else>暂无</span> -->

        <template v-if="serviceInfo.vatTaxNumberCopyFile">
          <template v-if="serviceInfo.vatTaxNumberCopyFile.indexOf('[') != -1">
            <el-link type="primary" :underline="false" :href="item" v-for="item in JSON.parse(serviceInfo.vatTaxNumberCopyFile)" :key="item" target="_blank"> 查看 </el-link>
          </template>
          <el-link v-else type="primary" :underline="false" :href="serviceInfo.vatTaxNumberCopyFile" target="_blank"> 查看 </el-link>
        </template>
        <span v-else>暂无</span>
      </div>
    </template>
    <template v-if="['AE', 'SA'].includes(serviceInfo.countryCode)">
      <div class="info-block-item">
        <span class="info-block-title">税务账号：</span>
        <span>{{ serviceInfo.gatewayId }}</span>
      </div>
      <div class="info-block-item">
        <span class="info-block-title">税局密码：</span>
        <span>{{ serviceInfo.gatewayPassword }}</span>
      </div>
    </template>
    <div class="info-block-item" v-if="serviceInfo.countryCode == 'FR'">
      <span class="info-block-title">SIRET号：</span>
      <span>{{ serviceInfo.siretNumber }}</span>
      <el-link icon="el-icon-edit" type="primary" @click="modifySiretDialog = true" :underline="false" v-if="canModify && serviceInfo.currentNodeCode === currentCodeEnum.NODE8 && serviceInfo.countryCode == 'FR' && (serviceInfo.status == 1 || serviceInfo.status == 2) && hasAuthority('L1_38')">
      </el-link>
    </div>
    <div class="info-block-item" v-if="serviceInfo.countryCode == 'PL'">
      <span class="info-block-title">IBAN：</span>
      <span>{{ serviceInfo.iban }}</span>
      <el-link icon="el-icon-edit" v-if="canModify" @click="changeIBAN"></el-link>
    </div>
    <slot></slot>

    <Model :dialog="model" :workOrderId="serviceInfo.workId" :detailObj="serviceInfo" v-if="serviceInfo.countryCode" @closeModal="model.editorTaxNumModel = false" @refresh="refresh" />
    <ModifySiretModel :modifySiretDialog.sync="modifySiretDialog" :siretNumber="serviceInfo.siretNumber" :workId="serviceInfo.workId" @refresh="refresh" />
    <ModifyTaxIssueDateModel :modifyTaxIssueDateDialog.sync="modifyTaxIssueDateDialog" :taxIssueDate="serviceInfo.taxIssueDate" :workId="serviceInfo.workId" @refresh="refresh" />
    <ModifyVatTaxModel :modifyVatTaxDialog.sync="modifyVatTaxDialog" :vatTaxNumber="serviceInfo.vatTaxNumber" :vatTaxNumberFile="serviceInfo.vatTaxNumberFile" :workId="serviceInfo.workId" @refresh="refresh" />
    <ModifyTaxEffectiveDateModel
      :modifyTaxEffectiveDateDialog.sync="modifyTaxEffectiveDateDialog"
      :vatTaxNumberFile="serviceInfo.vatTaxNumberFile"
      :taxEffectiveDate="serviceInfo.taxEffectiveDate"
      :beginTime="serviceInfo.beginTime"
      :endTime="serviceInfo.endTime"
      :countryCode="serviceInfo.countryCode"
      :workId="serviceInfo.workId"
      @refresh="refresh"
    />
  </div>
</template>

<script>
import { updateIBAN } from '@/api/newApi/taxServices/serviceManage.js';
import { viewTaxNumber } from '@/api/newApi/taxServices/taxRegister.js';
import Model from '@/view/module/newTaxServices/taxRegister/deatilModel';
import ModifySiretModel from '@/view/module/newTaxServices/components/modifySiretModel';
import ModifyTaxIssueDateModel from '@/view/module/newTaxServices/components/modifyTaxIssueDateModel';
import ModifyVatTaxModel from '@/view/module/newTaxServices/components/modifyVatTaxModel';
import ModifyTaxEffectiveDateModel from '@/view/module/newTaxServices/components/modifyTaxEffectiveDateModel';
import { currentCodeEnum } from '@/view/module/workOrder/map.js';
export default {
  props: {
    serviceInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    isInternalService: Boolean,
  },
  components: {
    Model,
    ModifySiretModel,
    ModifyTaxIssueDateModel,
    ModifyVatTaxModel,
    ModifyTaxEffectiveDateModel,
  },
  computed: {
    canModify() {
      return [this.$constant.TAXRegAnd_FUNCTION_CODE, this.$constant.TAXProxy_FUNCTION_CODE].includes(this.serviceInfo.functionCode);
    },
  },
  data() {
    return {
      modifySiretDialog: false,
      modifyTaxIssueDateDialog: false,
      modifyVatTaxDialog: false,
      modifyTaxEffectiveDateDialog: false,
      model: {
        taxInfoModel: false, // 录入税号信息弹窗
        editorTaxNumModel: false, // 修改税号信息
        uploadDEEUCertificate: false, //上传欧盟证书
      },
      currentCodeEnum,
      status: { 1: '有效', 0: '未查询', '-1': '失效' },
      viewTaxLoading: false,
    };
  },
  methods: {
    isEUCountries(val) {
      return ['AT', 'BE', 'CZ', 'DE', 'ES', 'FR', 'IT', 'NL', 'PL', 'SA', 'SE'].includes(val);
    },
    // 修改IBAN
    changeIBAN() {
      this.$prompt('', '修改IBAN', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入IBAN',
        inputValue: this.serviceInfo.iban,
      }).then(({ value }) => {
        updateIBAN({
          iban: value,
          workId: this.serviceInfo.workId,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('修改成功');
            this.refresh();
          }
        });
      });
    },
    refresh() {
      this.$emit('refresh');
    },
    viewTax() {
      this.viewTaxLoading = true;
      viewTaxNumber(this.serviceInfo.workId)
        .then((res) => {
          if (res.code === 0) {
            this.refresh();
          }
        })
        .finally(() => {
          this.viewTaxLoading = false;
        });
    },
  },
};
</script>

<style></style>
