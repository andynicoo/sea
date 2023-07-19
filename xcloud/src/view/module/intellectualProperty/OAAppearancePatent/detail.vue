<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="back">
        <i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>
        返回列表
      </el-link>
      <div v-if="designPatentWorkOrder && oaDetailWorkOrderVO && serviceInfoVo">
        <SendCustomFileModal
          btnText="发送注册资料"
          :params="{
            workId: designPatentWorkOrder.id,
            serviceId: serviceInfoVo.id,
            customerData: designPatentWorkOrder.customerRegisterData,
            smsSend: serviceInfoVo.smsSend,
            functionCode: serviceInfoVo.productFunctionCode,
            countryCode: serviceInfoVo.countryCode,
            enterpriseId: serviceInfoVo.enterpriseId,
          }"
          @submit="getInfo()"
          style="float: right"
          v-if="serviceInfoVo.cureentNodeCode === 'NODE0076' || (serviceInfoVo.cureentNodeCode === 'NODE0077' && oaDetailWorkOrderVO.cureentNodeCode === 'NODE104-006')"
          v-show="hasAuthority('OA_appearance_patent_registerInfo')"
        />
        <SendEmailModal
          btnText="客户发送邮件状态"
          :params="{
            trademarkType: 4,
            workId: designPatentWorkOrder.id,
            serviceId: serviceInfoVo.id,
            emailSend: serviceInfoVo.emailSend,
            functionCode: serviceInfoVo.productFunctionCode,
          }"
          @submit="getInfo()"
          style="float: right"
          v-if="(serviceInfoVo.cureentNodeCode === 'NODE0076' || (serviceInfoVo.cureentNodeCode === 'NODE0077' && oaDetailWorkOrderVO.cureentNodeCode === 'NODE104-006')) && serviceInfoVo.flagCustomerData"
          v-show="hasAuthority('OA_appearance_patent_emailState')"
        />
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container" :class="{ 'app-container-fold': fold }">
        <div class="header-container">
          <el-tabs v-model="activeName" ref="elTabs">
            <el-tab-pane label="文件信息" name="fileInfo"></el-tab-pane>
            <el-tab-pane label="专利信息" name="patentInfo"></el-tab-pane>
          </el-tabs>
          <div class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</div>
          <div class="el-form-wrapper">
            <div v-show="activeName === 'fileInfo'">
              <div class="table-title">官方文件：</div>
              <el-table border :data="officialInfo">
                <el-table-column align="center" min-width="200" label="文件" show-overflow-tooltip prop="files">
                  <template slot-scope="{ row }">
                    <el-link target="_blank" :href="row.officialFile" type="primary" style="margin-right: 20px">{{ row.name }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width="150" label="类型" show-overflow-tooltip prop="progressContent">
                  <template slot-scope="{ row }">{{ row.typeName || '审查意见OA' }}</template>
                </el-table-column>
                <el-table-column align="center" min-width="200" label="官方起止时间" show-overflow-tooltip prop="createTime">
                  <template slot-scope="{ row }">
                    <div>{{ row.officeStartDate }}</div>
                    <div>{{ row.officialExpirationDate }}</div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width="200" label="客户截止时间" show-overflow-tooltip prop="createTime">
                  <template slot-scope="{ row }">
                    <div>{{ row.lastDealDate }}</div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width="180" label="操作" show-overflow-tooltip prop="createName">
                  <template slot-scope="{ row }">
                    <!-- 在待翻译OA不显示 -->
                    <el-link type="primary" :underline="false" @click="infoDialog = true" v-show="hasAuthority('M2_13')" v-if="row.name !== '客户OA答复' && cureentNodeCode !== progressBarObj.WAIT_TRANSLATE">查看</el-link>
                    <!-- 在待翻译OA显示 -->
                    <template v-if="cureentNodeCode === progressBarObj.WAIT_TRANSLATE">
                      <el-link type="primary" :disabled="isCancel" :underline="false" v-show="hasAuthority('M2_14')" @click="translateDialog = true">翻译</el-link>
                      <el-link type="primary" :disabled="isCancel" :underline="false" v-show="hasAuthority('M2_15')" @click="modify(row)">修改</el-link>
                      <el-link type="primary" :disabled="isCancel" :underline="false" v-show="hasAuthority('M2_16')" @click="del">删除</el-link>
                    </template>
                    <el-link
                      type="primary"
                      :disabled="isCancel"
                      :underline="false"
                      v-if="row.name !== '客户OA答复' && [progressBarObj.WAIT_PAY, progressBarObj.WAIT_UPLOAD, progressBarObj.PLATFORM_AUDIT, progressBarObj.LAWYER_AUDIT].includes(cureentNodeCode)"
                      v-show="hasAuthority('M2_25')"
                      @click="closeOADialog = true"
                      >关闭OA</el-link
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-title">客户上传文件：</div>
              <el-table border :data="customerInfo">
                <el-table-column align="center" min-width="200" label="文件" show-overflow-tooltip prop="files">
                  <template slot-scope="{ row }">
                    <el-link target="_blank" :href="row.answerFile" type="primary" style="margin-right: 20px">{{ row.name }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width="150" label="类型" show-overflow-tooltip prop="progressContent">
                  <template>审查意见答复材料</template>
                </el-table-column>
                <el-table-column align="center" min-width="200" label="上传时间" show-overflow-tooltip prop="createTime">
                  <template slot-scope="{ row }">
                    <div>{{ (row.answerDate || '').split(' ')[0] }}</div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width="150" label="操作" show-overflow-tooltip prop="createName">
                  <template>
                    <span v-if="[progressBarObj.PLATFORM_AUDIT, progressBarObj.LAWYER_AUDIT].includes(cureentNodeCode)">
                      <el-link :disabled="isCancel" type="primary" :underline="false" v-show="hasAuthority('M2_17')" @click="auditDialog = true">{{ cureentNodeCode === progressBarObj.PLATFORM_AUDIT ? '平台' : '律师' }}审核</el-link>
                    </span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <DynamicForm v-show="activeName === 'patentInfo'" ref="dynamicForm" :moduleList="dataReview" :rowKeyNum="2" :showBtn="false" />
          </div>
        </div>
      </div>

      <div class="info-block-wrapper" :class="{ 'info-block-wrapper-fold': fold }">
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
              <span class="info-block-title">订单编号：</span>
              <span>{{ serviceInfoVo.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务编号：</span>
              <span>{{ serviceInfoVo.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务名称：</span>
              <span>{{ serviceInfoVo.serviceName }}</span>
            </div>
            <!-- <div class="info-block-item">
              <span class="info-block-title">服务项目：</span>
              <span>{{ serviceInfoVo.serviceName }}</span>
            </div> -->
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ serviceInfoVo.countryNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">注册进度：</span>
              <span>{{ cureentNodeCode | filterProgressBar }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务生成时间：</span>
              <span>{{ serviceInfoVo.createTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">律师：</span>
              <span>{{ serviceInfoVo.attorneyName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">备注：</span>
              <span>{{ serviceInfoVo.remark }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">发送注册资料：</span>
              <span>
                <template v-if="serviceInfoVo.flagCustomerData === true"> 是 </template>
                <template v-else-if="serviceInfoVo.flagCustomerData === false"> 否 </template>
                <template v-else> - </template>
              </span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">客户发送邮件状态：</span>
              <span>
                <template v-if="serviceInfoVo.emailSend === true"> 是 </template>
                <template v-else-if="serviceInfoVo.emailSend === false"> 否 </template>
                <template v-else> - </template>
              </span>
            </div>
          </template>
          <template v-if="userInfoVO && (tabNav === 'all' || tabNav === 'userInfo')">
            <div class="block-title">用户信息</div>
            <div class="info-block-item">
              <span class="info-block-title">手机号：</span>
              <span>{{ userInfoVO.userMobile }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">注册时间：</span>
              <span>{{ userInfoVO.registerTime }}</span>
            </div>
          </template>
          <OperationLog :activities="activities" type="trademark" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>
      <AuditDialog :auditDialog.sync="auditDialog" :rejectNodeName="rejectNodeName" :workOrderId="workOrderId" :cureentNodeCode="cureentNodeCode" @refresh="getInfo" />
      <TranslateDialog :translateDialog.sync="translateDialog" :workOrderId="workOrderId" :oaDetailWorkOrderVO="oaDetailWorkOrderVO" @refresh="getInfo" v-if="oaDetailWorkOrderVO" />
      <InfoDialog :infoDialog.sync="infoDialog" :oaDetailWorkOrderVO="oaDetailWorkOrderVO" v-if="oaDetailWorkOrderVO" />
      <ModifyDialog :modifyDialog.sync="modifyDialog" :checkItem="checkItem" :workOrderId="workOrderId" @refresh="getInfo" v-if="oaDetailWorkOrderVO" />
      <CloseOADialog :closeOADialog.sync="closeOADialog" :workOrderId="workOrderId" @refresh="getInfo" />
    </div>
  </div>
</template>

<script>
import { progressBarList, progressBarObj } from './enumObj';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import * as comps from './components/index';
import { OAPatentInfo, OAPatentDel } from '@/api/newApi/intellectualProperty/OAAppearancePatent';
import { getRejectCode } from '@/api/newApi/common';
import dataReviewExceptEmpty from '@/view/module/intellectualProperty/mixins/dataReviewExceptEmpty';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import SendCustomFileModal from '@/view/module/intellectualProperty/components/SendCustomFileModal.vue';
import SendEmailModal from '@/view/module/intellectualProperty/components/SendEmailModal.vue';
export default {
  data() {
    return {
      workOrderId: this.$route.query.workOrderId,
      progressBarObj: progressBarObj,
      activeName: 'fileInfo',
      isEdit: false,
      info: {},
      serviceInfoVo: {},
      userInfoVO: {},
      oaDetailWorkOrderVO: null,
      cureentNodeCode: '',
      moduleList: [],
      countrySelectList: [],
      auditDialog: false,
      translateDialog: false,
      infoDialog: false,
      modifyDialog: false,
      closeOADialog: false,
      rejectNodeName: '',
      tabNav: 'all',
      officialInfo: [],
      customerInfo: [],
      checkItem: {},
      fold: false,
      designPatentWorkOrder: {},
    };
  },
  mixins: [dataReviewExceptEmpty, operationLog, isServiceCancel],
  components: {
    ...comps,
    DynamicForm,
    OperationLog,
    SendCustomFileModal,
    SendEmailModal,
  },
  filters: {
    filterProgressBar(cureentNodeCode) {
      let result = progressBarList.find((item) => item.value === cureentNodeCode);
      return result ? result.label : '';
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.oaDetailWorkOrderVO = null;
      OAPatentInfo({
        workOrderId: this.workOrderId,
      }).then((res) => {
        this.info = res.data;
        try {
          res.data.serviceInfoVo.remark = JSON.parse(res.data.serviceInfoVo.orderRemark).creator.remark;
        } catch (error) {}
        this.serviceInfoVo = res.data.serviceInfoVo;
        this.userInfoVO = res.data.userInfoVO;
        this.oaDetailWorkOrderVO = res.data.oaDetailWorkOrderVO;
        this.cureentNodeCode = res.data.oaDetailWorkOrderVO.cureentNodeCode;
        this.designPatentWorkOrder = res.data.designPatentWorkOrder;
        this.ifCancel(res.data.serviceInfoVo.status);
        this.getFileList();
        if (res.data.designPatentVo.length) {
          this.moduleList = res.data.designPatentVo;
        }
        // this._getRejectCode();
        this.getOperationLog(this.oaDetailWorkOrderVO.workOrderNO, 3);
      });
    },
    _getRejectCode() {
      getRejectCode({
        nodeCodeName: this.info.nodeCodeName,
        nodeId: this.info.nodeId,
        workFlowId: this.serviceInfoVo.workflowId,
      }).then((res) => {
        this.rejectNodeName = res.data.nodeName;
      });
    },
    getFileList() {
      let item = this.oaDetailWorkOrderVO;
      this.officialInfo = [
        {
          name: '审查意见OA官方文件',
          officialFile: this.replaceHttps(item.officialFile),
          officeStartDate: (item.officeStartDate || '').split(' ')[0],
          officialExpirationDate: (item.officialExpirationDate || '').split(' ')[0],
          lastDealDate: (item.lastDealDate || '').split(' ')[0],
          typeName: '审查意见OA',
        },
        {
          name: '客户OA答复',
          officialFile: this.replaceHttps(this.designPatentWorkOrder.customerOaReplyData),
          officeStartDate: '-',
          officialExpirationDate: '-',
          lastDealDate: '-',
          typeName: 'OA答复材料',
        },
      ].filter((item) => item.officialFile);

      this.customerInfo = [
        {
          name: '审查意见答复材料',
          answerFile: this.replaceHttps(item.answerFile),
          answerDate: item.answerDate,
          typeName: '审查意见答复材料',
        },
      ].filter((item) => item.answerFile);
    },
    // 删除
    del() {
      this.$confirm('是否确认删除？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        OAPatentDel({
          workOrderId: this.workOrderId,
        }).then((res) => {
          if (res.code === 0) {
            this.back();
            this.$message.success('删除成功');
          }
        });
      });
    },
    modify(row) {
      this.checkItem = row;
      this.modifyDialog = true;
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/intellectualProperty/OAAppearancePatent/index',
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
      position: relative;
      .header-block {
        display: flex;
        justify-content: space-between;
        padding-bottom: 18px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ebeef5;
      }
      .fold {
        position: absolute;
        z-index: 1;
        right: 30px;
        top: 30px;
        font-size: 14px;
        cursor: pointer;
      }
      .el-form-wrapper {
        height: calc(100vh - 280px);
        overflow-y: auto;
      }
    }
  }
  .info-block {
    max-height: calc(100vh - 255px);
  }
}
.table-title {
  margin-top: 15px;
  margin-bottom: 5px;
}
</style>
