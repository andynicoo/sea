<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="back">
        <i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>
        返回列表
      </el-link>
      <div>
        <el-button size="small" type="primary" :disabled="isCancel" v-if="cureentNodeCode === progressBarObj.WAIT_SUBMIT" v-show="hasAuthority('M2_19')" @click="submitCertificateDialog = true"> 提交授权书 </el-button>
        <el-button size="small" type="primary" :disabled="isCancel" v-if="cureentNodeCode === progressBarObj.WAIT_UPLOAD" v-show="hasAuthority('M2_20')" @click="uploadReceiptDialog = true"> 上传授权回执 </el-button>
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
              <el-table border :data="fileInfo">
                <el-table-column align="center" min-width="200" label="文件" show-overflow-tooltip prop="officialFile">
                  <template slot-scope="{ row }">
                    <el-link target="_blank" :href="row.officialFile" type="primary" class="fileUrl" style="margin-right: 20px">{{ row.name }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width="150" label="类型" show-overflow-tooltip prop="typeName"> </el-table-column>
                <el-table-column align="center" min-width="200" label="官方日期" show-overflow-tooltip prop="lastDealDate">
                  <template slot-scope="{ row }">
                    <template v-if="row.officeDateBegin || row.officeDateEnd">
                      <p>官方开始日期：{{ row.officeDateBegin }}</p>
                      <p>官方截止日期：{{ row.officeDateEnd }}</p>
                    </template>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width="200" label="客户截止日期" show-overflow-tooltip prop="lastDealDate">
                  <template slot-scope="{ row }">{{ row.lastDealDate || '-' }}</template>
                </el-table-column>
                <el-table-column align="center" min-width="210" label="操作" show-overflow-tooltip prop="createName">
                  <template slot-scope="{ row }">
                    <template v-if="row.showOpe">
                      <el-link type="primary" :underline="false" :disabled="isCancel" v-show="hasAuthority('M2_22')" v-if="cureentNodeCode !== progressBarObj.WAIT_TRANSLATE" @click="infoDialog = true">查看</el-link>
                      <template v-if="cureentNodeCode === progressBarObj.WAIT_TRANSLATE">
                        <el-link type="primary" :underline="false" :disabled="isCancel" v-show="hasAuthority('M2_21')" @click="modifyDialog = true">修改</el-link>
                        <el-link type="primary" :underline="false" :disabled="isCancel" v-show="hasAuthority('M2_23')" @click="del">删除</el-link>
                        <el-link type="primary" :underline="false" :disabled="isCancel" v-show="hasAuthority('M2_24')" @click="translateDialog = true">翻译授权书</el-link>
                      </template>
                    </template>
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
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ serviceInfoVo.countryNameZh }}</span>
            </div>
            <div class="info-block-item" v-if="detailWorkOrderVO">
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
          </template>
          <template v-if="tabNav === 'all' || tabNav === 'userInfo'">
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
      <TranslateDialog :translateDialog.sync="translateDialog" :workOrderId="workOrderId" @refresh="getInfo" />
      <InfoDialog :infoDialog.sync="infoDialog" :detailWorkOrderVO="detailWorkOrderVO" v-if="detailWorkOrderVO" />
      <SubmitCertificateDialog :submitCertificateDialog.sync="submitCertificateDialog" :workOrderId="workOrderId" @refresh="getInfo" />
      <UploadReceiptDialog :uploadReceiptDialog.sync="uploadReceiptDialog" :workOrderId="workOrderId" @refresh="getInfo" />
      <ModifyDialog :modifyDialog.sync="modifyDialog" :serviceId="serviceInfoVo.id" @refresh="getInfo" :detailWorkOrderVO="detailWorkOrderVO" v-if="detailWorkOrderVO"></ModifyDialog>
    </div>
  </div>
</template>

<script>
import { progressBarObj, progressBarList } from './enumObj';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import * as comps from './components/index';
import { certificateInfo, authorizationDel } from '@/api/newApi/intellectualProperty/certificate';
import dataReviewExceptEmpty from '@/view/module/intellectualProperty/mixins/dataReviewExceptEmpty';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
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
      detailWorkOrderVO: null,
      cureentNodeCode: '',
      moduleList: [],
      translateDialog: false,
      infoDialog: false,
      submitCertificateDialog: false,
      uploadReceiptDialog: false,
      modifyDialog: false,
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
    filterProgressBar(progressBar) {
      let result = progressBarList.find((item) => item.value === progressBar);
      return result ? result.label : '';
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.detailWorkOrderVO = null;
      certificateInfo({
        workOrderId: this.workOrderId,
      }).then((res) => {
        this.info = res.data;
        try {
          res.data.serviceInfoVo.remark = JSON.parse(res.data.serviceInfoVo.orderRemark).creator.remark;
        } catch (error) {}
        this.serviceInfoVo = res.data.serviceInfoVo;
        this.userInfoVO = res.data.userInfoVO;
        this.detailWorkOrderVO = res.data.detailWorkOrderVO;
        this.cureentNodeCode = res.data.detailWorkOrderVO.cureentNodeCode;
        this.ifCancel(res.data.serviceInfoVo.status);
        this.getFileList();
        if (res.data.designPatentVo.length) {
          this.moduleList = res.data.designPatentVo;
        }
        this.getOperationLog(this.detailWorkOrderVO.workOrderNo, 3);
      });
    },
    getFileList() {
      let item = this.detailWorkOrderVO;
      this.fileInfo = [
        {
          name: '授权书',
          officialFile: this.replaceHttps(item.officialFile),
          // lastDealDate: (item.lastDealDate || '').split(' ')[0],
          officeDateBegin: (item.officeDateBegin || '').split(' ')[0],
          officeDateEnd: (item.officeDateEnd || '').split(' ')[0],
          typeName: '授权书',
          showOpe: true,
        },
        {
          name: '受理回执',
          officialFile: this.replaceHttps(item.receiptOfficialFile),
          typeName: '受理回执',
          showOpe: false,
        },
        {
          name: '授权书翻译文件',
          officialFile: this.replaceHttps(item.interpretFile),
          lastDealDate: (item.lastDealDate || '').split(' ')[0],
          typeName: '授权书翻译文件',
          showOpe: false,
        },
      ].filter((item) => item.officialFile);
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
        authorizationDel({
          workOrderId: this.workOrderId,
        }).then((res) => {
          if (res.code === 0) {
            this.back();
            this.$message.success('删除成功');
          }
        });
      });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/intellectualProperty/certificate/index',
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
