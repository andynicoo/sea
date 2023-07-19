<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="back">
        <i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>
        返回列表
      </el-link>
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
              <!-- 建模中、绘图中显示 -->
              <el-button :disabled="isCancel" type="primary" v-if="[progressBarObj.MODELING, progressBarObj.DRAWING].includes(serviceInfoVo.cureentNodeCode)" v-show="hasAuthority('M2_10')" @click="uploadFileDialog = true" style="float: right; margin-bottom: 10px">
                {{ uploadText }}
              </el-button>
              <el-table border :data="fileInfo">
                <el-table-column align="center" min-width="200" label="文件" show-overflow-tooltip prop="files">
                  <template slot-scope="{ row }">
                    <el-link target="_blank" :href="row.url" type="primary" class="fileUrl" style="margin-right: 20px">{{ row.name }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width="150" label="类型" show-overflow-tooltip prop="typeName"> </el-table-column>
                <el-table-column align="center" min-width="200" label="上传时间" show-overflow-tooltip prop="time"> </el-table-column>
                <el-table-column align="center" min-width="150" label="操作" show-overflow-tooltip prop="createName">
                  <template slot-scope="{ row }">
                    <el-link :disabled="isCancel" type="primary" :underline="false" v-if="row.showNode.includes(serviceInfoVo.cureentNodeCode)" v-show="hasAuthority('M2_11')" @click="auditDialog = true"> 审核 </el-link>
                    <el-link :disabled="isCancel" type="primary" :underline="false" v-else-if="[progressBarObj.MODEL_CONFIRM].includes(serviceInfoVo.cureentNodeCode) && row.type === 'model'" v-show="hasAuthority('M2_26')" @click="insteadConfirmDialog = true">代客户确认建模</el-link>
                    <el-link :disabled="isCancel" type="primary" :underline="false" v-else-if="[progressBarObj.DRAW_CONFIRM].includes(serviceInfoVo.cureentNodeCode) && row.type === 'draw'" v-show="hasAuthority('M2_28')" @click="insteadConfirmDialog = true">代客户确认绘图</el-link>
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
              <span>{{ serviceInfoVo.parentServicesNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务名称：</span>
              <span>{{ serviceInfoVo.parentServiceName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ serviceInfoVo.countryNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">注册进度：</span>
              <span>{{ serviceInfoVo.cureentNodeCode | filterNodeCode }}</span>
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
          </template>
          <template v-if="trademarkOrderUserInfoVO && (tabNav === 'all' || tabNav === 'userInfo')">
            <div class="block-title">用户信息</div>
            <div class="info-block-item">
              <span class="info-block-title">手机号：</span>
              <span>{{ trademarkOrderUserInfoVO.userMobile }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">注册时间：</span>
              <span>{{ trademarkOrderUserInfoVO.registerTime }}</span>
            </div>
          </template>
          <OperationLog :activities="activities" type="trademark" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>
      <UploadFileDialog :uploadFileDialog.sync="uploadFileDialog" :serviceId="serviceId" :uploadText="uploadText" :cureentNodeCode="serviceInfoVo.cureentNodeCode" @refresh="getInfo" />
      <AuditDialog :auditDialog.sync="auditDialog" :rejectNodeName="rejectNodeName" :serviceId="serviceId" @refresh="getInfo" />
      <InsteadConfirmDialog :insteadConfirmDialog.sync="insteadConfirmDialog" :fileType="fileType" :workOrderId="designPatentModelingDrawWorkVO.id" @refresh="getInfo" />
    </div>
  </div>
</template>

<script>
import { progressBarObj, progressBarList } from './enumObj';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import * as comps from './components/index';
import { modelInfo } from '@/api/newApi/intellectualProperty/modelingAndDrawing';
import { getRejectCode } from '@/api/newApi/common';
import dataReviewExceptEmpty from '@/view/module/intellectualProperty/mixins/dataReviewExceptEmpty';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
export default {
  data() {
    return {
      serviceId: this.$route.query.serviceId,
      progressBarObj: progressBarObj,
      progressBarList: progressBarList,
      activeName: 'fileInfo',
      isEdit: false,
      info: {},
      serviceInfoVo: {},
      trademarkOrderUserInfoVO: {},
      designPatentModelingDrawWorkVO: {},
      fileObj: {
        agreement: [],
        certificat: [],
      },
      replace: false,
      moduleList: [],
      countrySelectList: [],
      uploadFileDialog: false,
      auditDialog: false,
      insteadConfirmDialog: false,
      rejectNodeName: '',
      tabNav: 'all',
      fileInfo: [],
      fold: false,
    };
  },
  mixins: [dataReviewExceptEmpty, operationLog, isServiceCancel],
  components: {
    ...comps,
    DynamicForm,
    OperationLog,
  },
  filters: {
    filterNodeCode(nodeCode) {
      let progress = progressBarList.find((item) => item.value === nodeCode);
      return progress ? progress.label : '';
    },
  },
  computed: {
    uploadText() {
      return this.serviceInfoVo.cureentNodeCode === progressBarObj.MODELING ? '上传建模文件' : '上传绘图文件';
    },
    fileType() {
      return this.serviceInfoVo.cureentNodeCode === progressBarObj.MODELING ? '建模' : '绘图';
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      modelInfo({
        serviceId: this.serviceId,
      }).then((res) => {
        this.info = res.data;
        try {
          res.data.serviceInfoVo.remark = JSON.parse(res.data.serviceInfoVo.orderRemark).creator.remark;
        } catch (error) {}
        this.serviceInfoVo = res.data.serviceInfoVo;
        this.trademarkOrderUserInfoVO = res.data.trademarkOrderUserInfoVO;
        this.designPatentModelingDrawWorkVO = res.data.designPatentModelingDrawWorkVO;
        this.ifCancel(res.data.serviceInfoVo.status);
        this.getFileList();
        if (res.data.designPatentVo && res.data.designPatentVo.length) {
          this.moduleList = res.data.designPatentVo;
        }
        // this._getRejectCode();
        this.getOperationLog(this.serviceInfoVo.serviceNo, 2);
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
      let item = this.designPatentModelingDrawWorkVO;
      this.fileInfo = [
        { name: '建模文件', url: this.replaceHttps(item.modelingFile), time: item.modelingFileCreateTime, typeName: '建模绘图文件', type: 'model', showNode: [progressBarObj.AUDIT_MODEL] },
        { name: '绘图文件', url: this.replaceHttps(item.drawingFile), time: item.drawingFileCreateTime, typeName: '建模绘图文件', type: 'draw', showNode: [progressBarObj.AUDIT_DRAW] },
      ].filter((item) => item.url);
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/intellectualProperty/modelingAndDrawing/index',
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
</style>
