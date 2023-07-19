<template>
  <div class="waper">
    <!-- 头部 -->
    <div class="header headContent">
      <div class="fill-information-title">
        <img @click="$router.push('/myVantService')" src="@/assets/images/common/dynamicForm/icon_fanhui2x.png" /><span
          v-if="$store.state.app.stepIndex != 3"
          >填写</span
        >【{{ detailObj.countryNameZh }}注册+申报】服务资料
        <span
          class="import-using-templates"
          v-if="$store.state.app.stepIndex == 2"
          @click="$refs.dynamicForm.importTemplatesModal = true"
          ><img src="@/assets/images/common/downloadIcon.png" />使用模板导入</span
        >
      </div>
      <!-- 进度条 -->
      <div class="statusIndfContent">
        <div class="statusContent" v-if="detailObj.currentNodeCode != currentCodeEnum.NODE2">
          <div class="statusItem">
            <Steps :current="orderStatus">
              <Step v-for="(item, index) in statusList" :key="index" :title="item.label"></Step>
            </Steps>
          </div>
        </div>
        <div class="rejected" v-if="detailObj.progressBar == 2">
          <div class="top-tips">
            <p class="tips-top-title">
              <img src="@/assets/images/common/yellowTip.png" alt="" />
              注册税号资料被驳回（原因：
              <span>{{ reson }}</span>
              )
            </p>
          </div>
        </div>
      </div>
      <div class="tabTitle" v-if="detailObj.currentNodeCode != currentCodeEnum.NODE2">
        <Tabs v-model="showTabs">
          <TabPane label="待授权注册" name="name1" v-if="detailObj.currentNodeCode == currentCodeEnum.NODE5"></TabPane>
          <TabPane label="税号信息" name="name2" v-if="detailObj.currentNodeCode == currentCodeEnum.NODE8"></TabPane>
          <TabPane label="注册资料" name="name3"></TabPane>
          <template v-if="GBQuestionnaireNames.includes(GBQuestionnaire)">
            <TabPane label="英国调查问卷" name="questionnaire"></TabPane>
            <TabPane label="PPOB" name="ppob"></TabPane>
          </template>
        </Tabs>
      </div>
    </div>

    <!-- 组件 -->
    <div class="container agentClass">
      <!-- 上传待授权证书 -->
      <div v-if="showTabs == 'name1'">
        <Authorized
          :isCancel="isCancel"
          :fileDataReview="fileDataReview"
          :serviceInfo="detailObj"
          :showAuthorizeFile="detailObj.currentNodeCode === currentCodeEnum.NODE5"
          @formsubmit="submitAuthorized"
        ></Authorized>
      </div>
      <div v-if="showTabs == 'name2'">
        <TaxInfo :registerWorkOrder="detailObj" :taxInfo="detailObj" />
      </div>
      <!-- 表单资料 -->
      <div v-if="showTabs == 'name3'">
        <DynamicForm
          ref="dynamicForm"
          :moduleList="dataReview"
          @formSave="formSave"
          @formsubmit="formsubmit"
          :isCancel="isCancel"
          :showSubmit="isEdit"
          :showSave="isEdit"
          :workInfo="detailObj"
          :tabsCurrent="2"
        />
      </div>
      <div v-if="showTabs === 'questionnaire'">
        <Questionnaire :serviceId="detailObj.serviceId" />
      </div>
      <div v-if="showTabs === 'ppob'">
        <Ppob />
      </div>
    </div>
  </div>
</template>
<script>
import DynamicForm from '@/components/DynamicForm/dynamicForm'; //表单配置
import Authorized from '@/components/Authorized/index'; //待授权上传证书组件
import Questionnaire from './questionnaire';
import Ppob from './ppob';
import mixin from '@/views/home/mixin';
import dataStatus from '@/views/common/dataStatus'; //状态进度
import TaxInfo from './taxInfo.vue'; //税号信息组件
import {
  getDetail,
  getNodeField,
  materialSave,
  materialSubmit,
  latestRejectByWorkNo,
  uploadAuthorization,
} from '@/api/taxRegister.js';
import { statusListYD, statusListFR } from './dateList';
import isServiceCancel from '@/views/home/mixin/isServiceCancel';
import { currentCodeList, currentCodeEnum } from '@/views/userManage/setting/staticList.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator.js';
export default {
  components: { DynamicForm, Authorized, dataStatus, TaxInfo, Questionnaire, Ppob },
  mixins: [mixin, isServiceCancel],
  data() {
    return {
      moduleList: [],
      detailObj: {},
      id: this.$route.query.id,
      countryCode: this.$route.query.countryCode,
      agingBox: false, //温馨提示
      showTabs: 'name3',
      fileDataReview: [],
      orderStatus: 0,
      flag: '',
      reson: '',
      GBQuestionnaireNames: ['questionnaire', 'ppob'],
      GBQuestionnaire: this.$route.query.GBQuestionnaire || '',
      currentCodeList,
      currentCodeEnum,
    };
  },
  filters: {
    filterKey(value, list, findKey = 'value', filterKey = 'label') {
      let temp = list.find((item) => item[findKey] === value);
      return temp ? temp[filterKey] : value;
    },
  },
  created() {
    if (this.GBQuestionnaire) {
      this.showTabs = this.GBQuestionnaire;
    }
    this.getWorkOrderDetail(); //获取详情
    this.$store.dispatch('app/setStepIndex', 1);
  },
  computed: {
    isEdit() {
      return [currentCodeEnum.NODE2, currentCodeEnum.NODE5].includes(this.detailObj.currentNodeCode);
    },
    statusList() {
      if (['GB', 'DE', 'ES', 'PL', 'CZ', 'AT', 'EU'].includes(this.countryCode)) {
        this.flag = 'YD';
        return statusListYD;
      } else {
        this.flag = 'FR';
        return statusListFR;
      }
    },
  },
  methods: {
    /**  工单详情 */
    getWorkOrderDetail() {
      workOrderCommonOperator('detail', this.id)
        .then((res) => {
          if (res.code === 0) {
            this.detailObj = res.data;
            localStorage.workflowId = this.detailObj.flowId || this.detailObj.workflowId;
            this.ifCancel(res.data.status);
            this.showStatus(res.data.currentNodeCode);
            //待授权
            if (res.data.currentNodeCode == currentCodeEnum.NODE5 && res.data.firstReview.length > 0) {
              this.fileDataReview = res.data.dataReview;
              this.moduleList = res.data.firstReview;
              this.showTabs = 'name1';
            } else {
              if ([currentCodeEnum.NODE4, currentCodeEnum.NODE6].includes(res.data.currentNodeCode)) {
                this.moduleList = res.data.firstReview;
              } else {
                if (res.data.dataReview && res.data.dataReview.length > 0) {
                  this.moduleList = res.data.dataReview;
                } else {
                  this.getData();
                }
              }
            }
            if (res.data.currentNodeCode == currentCodeEnum.NODE8) this.showTabs = 'name2';
            // 资料驳回提示
            if (res.data.progressBar == 2) {
              this.getlatestReject();
            }
          }
        })
        .catch((err) => {
          this.$Message.error(err.message);
        });
    },
    /** 初始化字段模板 */
    getData() {
      getNodeField({
        nodeCode: this.detailObj.currentNodeCode,
        nodeId: '',
        workFlowId: this.detailObj.workflowId,
      })
        .then((res) => {
          this.moduleList = res.data;
        })
        .catch((err) => {
          this.$Message.error(err.message);
        });
    },

    // 保存表单
    formSave(materialData, next) {
      workOrderCommonOperator('save', {
        material: materialData,
        workOrderId: this.id,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('保存成功');
            // this.getWorkOrderDetail(); //获取详情
            if (next) {
              this.$refs.dynamicForm.stepsIndex = 3;
              this.$store.dispatch('app/setStepIndex', 3);
            }
          }
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    // 提交表单
    formsubmit(materialData) {
      this.$Modal.confirm({
        title: '是否确认提交',
        content:
          '<p style="text-align:left">温馨提示：提交后不可修改，不同国家注册税号时效不同，请确认资料的完整性（资料不完整有可能影响时效）；</p>',
        cancelText: '我再想想',
        okText: '已确认，提交',
        onOk: () => {
          setTimeout(() => {
            this.toSubmit(materialData);
          }, 100);
        },
      });
    },
    toSubmit(material) {
      workOrderCommonOperator('commit', {
        workOrderId: this.id,
        material,
      })
        .then((res) => {
          if (res.code == 0) {
            localStorage.backPath = '/myVantService';
            this.$router.push('/submittedSucceeded');
            // this.$Message.success('提交成功');
            // this.getWorkOrderDetail(); //获取详情
          }
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    // 提交待授权
    submitAuthorized(regAuthorizationFile) {
      uploadAuthorization({
        serviceId: this.detailObj.serviceId,
        regAuthorizationFile: regAuthorizationFile,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('提交成功');
            this.backToHome(); //获取详情
          }
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    showStatus(currentNodeCode) {
      if (this.flag == 'YD') {
        switch (currentNodeCode) {
          case currentCodeEnum.NODE3: //待审核
          case currentCodeEnum.NODE4: //已审核
            return (this.orderStatus = 1);
          case currentCodeEnum.NODE6:
          case currentCodeEnum.NODE7: //待提交注册/注册中
            return (this.orderStatus = 2);
          case currentCodeEnum.NODE8:
            return (this.orderStatus = 4);
        }
      } else {
        switch (currentNodeCode) {
          case currentCodeEnum.NODE3: //待审核
          case currentCodeEnum.NODE4: //已审核
            return (this.orderStatus = 1);
          case currentCodeEnum.NODE5: //待授权
            return (this.orderStatus = 2);
          case currentCodeEnum.NODE6:
          case currentCodeEnum.NODE7: //待提交注册/注册中
            return (this.orderStatus = 3);
          case currentCodeEnum.NODE8:
            return (this.orderStatus = 5);
        }
      }
    },
    //驳回原因
    getlatestReject() {
      latestRejectByWorkNo(this.detailObj.workNo)
        .then((res) => {
          this.reson = res.data.reason;
        })
        .catch((err) => {
          this.$Message.error(err.message);
        });
    },
    //回到工作台
    backToHome() {
      this.$router.push({ path: 'work' });
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.app.stepIndex == 2) {
      this.$Modal.confirm({
        title: '是否保存内容后再离开？',
        content: '选择确定后，系统会保存本次您填写的内容，方便您下次继续提交',
        okText: '保存后离开',
        cancelText: '直接离开',
        onOk: () => {
          let materialData = this.$refs.dynamicForm.getMaterial();
          workOrderCommonOperator('save', {
            material: materialData,
            workOrderId: this.id,
          }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('保存成功');
              next();
            }
          });
        },
        onCancel: () => {
          next();
        },
      });
      next(false);
    } else {
      next();
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  // margin: 23px;
}
.headContent {
  background: #ffffff;
  padding: 1px 24px 0px;
  border-bottom: 1px solid #f0f0f0;
  .title {
    font-size: 24px;
    line-height: 24px;
    color: #303132;
    margin-top: 0;
  }
  .top {
    margin-bottom: 14px;
    .flink,
    .clink {
      font-size: 14px;

      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
    }
    .clink {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .bottom {
    font-size: 20px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      margin-left: 10px;
    }
  }
  .statusIndfContent {
    overflow: hidden;
    /deep/.ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner {
      background: #3a7fff;
      border-color: #3a7fff;
      > .ivu-steps-icon {
        color: #fff;
      }
    }
    /deep/.ivu-steps .ivu-steps-head-inner {
      background: #d9d9d9;
      border-color: #d9d9d9;
      span {
        color: #fff;
      }
    }
    /deep/.ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
      border-color: #2d8cf0;
      background-color: #2d8cf0;
    }
    .rejected {
      padding: 10px 40px;
      background: #fff1dd;
      margin-bottom: 20px;
      .tips-top-title {
        font-size: 14px;
        font-family: 'PingFangSC-Regular,PingFang SC';
        color: #333333ff;
        img {
          float: left;
          margin-right: 6px;
        }
        span {
          color: #fa5555ff;
        }
      }
      .bottom-tips {
        margin-left: 24px;
        margin-top: 4px;
        p {
          line-height: 26px;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
        }
        .last-tip {
          font-weight: 400;
          margin-top: 4px;
        }
      }
    }
  }
  .tabTitle {
    border-bottom: 1px solid #e9e9e9ff;
    margin-top: 20px;
    /deep/.ivu-tabs-bar {
      margin: 0;
      border: none;
      .ivu-tabs-ink-bar {
        background: #3a7fff !important;
      }
    }
    /deep/.ivu-tabs-nav .ivu-tabs-tab {
      &:hover {
        color: #3a7fff !important;
      }
    }
    /deep/.ivu-tabs-nav .ivu-tabs-tab-active {
      color: #3a7fff !important;
      height: 100% !important;
      font-weight: normal;
    }
    span {
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      font-family: PingFangSC;
      color: #333333;
      line-height: 40px;
      margin-right: 46px;
      cursor: pointer;
    }
    .active-tab {
      color: #1890ffff;
      border-bottom: 2px solid #1890ffff;
      font-weight: 500;
    }
  }
}
.top {
  min-width: 1024px;
  background-color: #fff;
  padding: 20px 0 0 32px;
  font-size: 14px;
  /deep/ .ivu-breadcrumb {
    font-size: 14px !important;
  }
  .top-reason {
    margin-top: 20px;
    padding: 11px 21px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    background: #fff1dd;
    span {
      color: rgba(250, 85, 85, 1);
    }
    img {
      position: relative;
      top: 3px;
    }
  }
  .tabTitle {
    border-bottom: 1px solid #e9e9e9ff;
    margin-top: 10px;
    span {
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      font-family: PingFangSC;
      color: #333333;
      line-height: 40px;
      margin-right: 46px;
      cursor: pointer;
    }
    .active-tab {
      color: #1890ffff;
      border-bottom: 2px solid #1890ffff;
      font-weight: 600;
    }
  }
}
.title {
  font-size: 20px;
  font-weight: 700;
  margin-top: 16px;
  padding-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
  span.smallTitle {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    margin-left: 10px;
    font-weight: 400;
  }
  span.line {
    display: inline-block;
    width: 2px;
    height: 14px;
    background: rgba(22, 173, 233, 1);
    margin-right: 10px;
  }
  .remark {
    margin-left: 15px;
    font-size: 14px;
    color: #515a6e;
    font-weight: 400;
  }
}
.top-tip {
  padding-bottom: 18px;
  padding-right: 32px;
  background-color: #fff;
  border-radius: 4px;
  .wramTip {
    font-size: 14px;
    padding: 10px;
    background-color: rgba(22, 173, 233, 0.19);
    color: #333;
    cursor: pointer;
    img {
      position: relative;
      top: 4px;
    }
    span {
      color: #1890ff;
    }
  }
}
.aging-box {
  margin: 0 28px;
  font-size: 18px;
  line-height: 40px;
  padding-bottom: 30px;
  .aging-country {
    color: #16ade9;
    font-weight: 700;
  }
  .remark {
    color: #aaaaaa;
  }
  .example-modal {
    img {
      width: 100%;
    }
  }
}

.import-templates {
  float: right;
  font-size: 14px;
  font-weight: normal;
  color: #3a7fff;
  cursor: pointer;
}
</style>
