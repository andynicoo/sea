<template>
  <div>
    <div class="head">
      <div v-if="status == nodeEnum.WAIT_UPLOAD" class="epr-title">
        <!-- <span class="left">待上传转代理资料</span>
        <span class="right">（ {{ serviceName }} ）</span>
        <span
          v-if="isEdit && $refs.dynamicForm.stepsIndex == 2"
          class="import-templates"
          @click="$refs.dynamicForm.importTemplatesModal = true"
          >使用模版导入</span
        > -->
        <div class="fill-information-title">
          <img
            @click="$router.push('/complianceBusiness/EPRList')"
            src="@/assets/images/common/dynamicForm/icon_fanhui2x.png"
          />填写【{{ serviceName }}】服务资料
          <span
            class="import-using-templates"
            v-if="$store.state.app.stepIndex == 2"
            @click="$refs.dynamicForm.importTemplatesModal = true"
            ><img src="@/assets/images/common/downloadIcon.png" />使用模板导入</span
          >
        </div>
      </div>
      <div v-else>
        <div class="epr-title">
          <span class="left">转代理详情</span>
          <span class="right">（ {{ serviceName }} ）</span>
          <span
            v-if="isEdit && $refs.dynamicForm.stepsIndex == 2"
            class="import-templates"
            @click="$refs.dynamicForm.importTemplatesModal = true"
            >使用模版导入</span
          >
        </div>
        <!-- 顶部服务状态图 -->
        <div class="statusItem statusIndfContent">
          <Steps :current="orderStatus">
            <Step v-for="(item, index) in statusList" :title="item.label" :key="index"></Step>
          </Steps>
        </div>
        <!-- <TopSpeed
          :authorizedAgentWorkOrder="authorizedAgentWorkOrder"
          :orderServices="orderServices"
          :status="status"
          :refuseReason="refuseReason"
          :serviceName="serviceName"
        ></TopSpeed> -->
        <div class="tabTitle">
          <span
            :class="{ 'active-tab': pageType == 1 }"
            v-if="status == nodeEnum.REGISTER_COMPLETE || status == nodeEnum.REGISTERING"
            @click="pageType = 1"
          >
            申请信息
          </span>
          <span :class="{ 'active-tab': pageType == 3 }" v-if="status == nodeEnum.WAIT_AUTHORIZE" @click="pageType = 3">
            待授权转代理
          </span>
          <span :class="{ 'active-tab': pageType == 2 }" @click="pageType = 2">转代理资料</span>
        </div>
      </div>
    </div>
    <div v-if="pageType == 2">
      <DynamicForm
        ref="dynamicForm"
        :moduleList="dataReview"
        :showBtn="isEdit"
        :isCancel="isCancel"
        @formSave="formSave"
        @formsubmit="formsubmit"
        @formCancel="isEdit = false"
        :isEdit="isEdit"
        :showSave="isEdit"
        :showSubmit="isEdit"
        :workInfo="orderServices"
        :tabsCurrent="2"
      />
    </div>
    <div v-if="pageType == 1">
      <div class="finish">
        <div class="bottom eprBottom">
          <div class="one">
            <div>
              <p class="left">转代理主体名称：</p>
              <p class="right">{{ orderServices.companyNameZh || authorizedAgentWorkOrder.naturalPerson || '暂无' }}</p>
            </div>
            <div>
              <p class="left">国家：</p>
              <p class="right">{{ orderServices.countryNameZh || '暂无' }}</p>
            </div>
            <div v-if="orderServices.serviceName">
              <p class="left">服务：</p>
              <p class="right">{{ orderServices.serviceName || '暂无' }}</p>
            </div>
          </div>
          <div class="one">
            <div>
              <p class="left">服务截止日期：</p>
              <p class="right">
                {{ (eprWorkOrderInfo.expirationTime && eprWorkOrderInfo.expirationTime.slice(0, 10)) || '暂无' }}
              </p>
            </div>
            <div>
              <p class="left">授权书：</p>
              <p class="right">
                <span v-if="eprWorkOrderInfo.authCertificate">
                  <a
                    v-for="(img, i) in $util.convertImage(eprWorkOrderInfo.authCertificate)"
                    :key="i"
                    class="chakan"
                    :href="img"
                    target="_blank"
                  >
                    <img src="@/assets/images/compliance/chakan.svg" />
                    点击查看
                  </a>
                </span>
                <span v-else>暂无</span>
              </p>
            </div>
            <div>
              <p class="left">合同：</p>
              <p class="right">
                <span v-if="eprWorkOrderInfo.contract">
                  <a
                    v-for="(img, i) in $util.convertImage(eprWorkOrderInfo.contract)"
                    :key="i"
                    :href="img"
                    class="chakan"
                    target="_blank"
                  >
                    <img src="@/assets/images/compliance/chakan.svg" />
                    点击查看
                  </a>
                </span>

                <span v-else>暂无</span>
              </p>
            </div>
          </div>
          <div class="one">
            <div>
              <p class="left">证书：</p>
              <div class="right">
                <p
                  v-if="
                    eprWorkOrderInfo.registrationReceipt &&
                      $util.convertImage(eprWorkOrderInfo.registrationReceipt).length
                  "
                >
                  <a
                    v-for="(item, index) in $util.convertImage(eprWorkOrderInfo.registrationReceipt)"
                    :key="index"
                    class="chakan"
                    :href="item"
                    target="_blank"
                  >
                    <img src="@/assets/images/compliance/chakan.svg" />
                    点击查看
                  </a>
                </p>

                <span v-else>暂无</span>
              </div>
            </div>
            <div v-show="eprWorkOrderInfo.uinStr">
              <p class="left">UIN号：</p>
              <p class="right">
                {{ eprWorkOrderInfo.uinStr }}
              </p>
            </div>
            <div>
              <p class="left">账单：</p>
              <div class="right">
                <p v-if="eprWorkOrderInfo.billFiles && $util.convertImage(eprWorkOrderInfo.billFiles).length">
                  <a
                    v-for="(item, index) in $util.convertImage(eprWorkOrderInfo.billFiles)"
                    :key="index"
                    class="chakan"
                    :href="item"
                    target="_blank"
                  >
                    <img src="@/assets/images/compliance/chakan.svg" />
                    点击查看
                  </a>
                </p>

                <span v-else>暂无</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 125px"></div>
    </div>
    <div v-if="pageType == 3">
      <!-- 待授权 -->
      <EprAuthorizer
        :isCancel="isCancel"
        :authorizerData="authorizerData"
        :serviceId="serviceId"
        :productFunctionCode="orderServices.productFunctionCode"
      ></EprAuthorizer>
    </div>
    <Modal v-model="refuseReasonModal">
      <div class="tipsModal-title">温馨提示</div>
      <Divider style="margin: 16px 0" />
      <div class="tipsModal-contnet">
        <p class="tip-title">您的授权审核未通过，请按照以下指引修改...</p>
        <p style="word-break: break-all">{{ refuseReason }}</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="refuseReasonModal = false">知道了</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getDetail, getNodeField } from '@/api/taxRegister.js';
import { authAgentCommit, authAgentSave, EPRSave, EPRCommit, workflowApi } from '@/api/taxModule.js';
import { listReject } from '@/api/compliance/register';
import TopSpeed from '../components/topSpeed.vue';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
import EprAuthorizer from '../components/eprAuthorizer.vue';
import mixin from '@/views/home/mixin';
import { EPRTaxServicesNodeList } from './dateList';
import isServiceCancel from '@/views/home/mixin/isServiceCancel';
export default {
  components: {
    TopSpeed,
    DynamicForm,
    EprAuthorizer,
  },
  mixins: [isServiceCancel],
  data() {
    return {
      countryCode: '',
      showSubmit: true, //表单提交按钮
      showSave: true, //表单保存按钮
      fileDataReview: [],
      status: '',
      serviceId: this.$route.query.serviceId,
      countryNameZh: this.$route.query.countryNameZh,
      serviceName: this.$route.query.serviceName,
      serviceNo: this.$route.query.serviceNo,
      timestamp: '',
      refuseReason: '',
      refuseReasonModal: false,
      pageType: 2,
      lenovoSearchList: [], //联想列表
      formLeft: {},
      detailInfo: {},
      tipsModal: false,
      notChange: false,
      base64URI: '',
      shouquanForm: {
        agreement: '',
      },
      showShouquanForm: {
        agreement: '',
      },
      noSub: false,
      authorizedAgentWorkOrder: {}, // 英代欧代工单详情
      // dataReview: [], // 表单回显数据
      info: {},
      authAgentInfo: {},
      orderServices: {},
      moduleList: [],
      detailObj: {},
      serviceInfo: {},
      nodeEnum: {
        WAIT_UPLOAD: 'NODE0060', //待上传资料
        WAIT_REVIEW: 'NODE0061', //待审核资料
        WAIT_AUTHORIZE: 'NODE0063', //待授权
        AUTHORIZE_WAIT_CONFIRM: 'NODE0064', //授权待确认
        REGISTERING: 'NODE0265', //转代理中
        REGISTER_COMPLETE: 'NODE0266', //转代理完成
      },
      // epr
      authorizerData: [],
      eprWorkOrderInfo: {},
      forwardNodes: [],
    };
  },
  computed: {
    isEdit() {
      return (
        this.status === this.nodeEnum.WAIT_UPLOAD ||
        (this.orderServices.progressBar === 2 && this.status !== this.nodeEnum.WAIT_AUTHORIZE)
      );
    },
    statusList() {
      let nodeList = this.forwardNodes.map((item) => item.nodeCode);
      return EPRTaxServicesNodeList.filter((item) => nodeList.includes(item.nodeCode));
    },
    orderStatus() {
      let index = this.statusList.findIndex((item) => item.nodeCode === this.info.nodeCode);
      return index ? index : 0;
    },
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          let disabled = !this.isEdit;
          if (
            this.info.renewOrder &&
            this.info.nodeCode === this.nodeEnum.WAIT_UPLOAD &&
            ['shopNature', 'companyNameZh', 'companyCreditCode', 'companyPostCode', 'companyNameEn'].includes(
              item.keyName
            )
          ) {
            disabled = true;
          }
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', disabled);
          } else {
            item.disabled = disabled;
          }
        });
      });
      return this.moduleList;
    },
  },
  methods: {
    getReject() {
      let data = {
        serviceNo: this.serviceNo,
      };
      listReject(data).then((res) => {
        if (res.code == 0) {
          this.refuseReason = res.data[0].reason;
        }
      });
    },
    getDetail() {
      let data = {
        serviceId: this.serviceId,
      };
      getDetail(data).then((res) => {
        if (res.code === 0) {
          this.info = res.data;
          localStorage.workflowId = this.info.flowId || this.info.workflowId;
          this.authAgentInfo = res.data.authAgentInfo;
          this.authorizedAgentWorkOrder = res.data.authorizedAgentWorkOrder;
          this.orderServices = res.data.orderServices;
          this.ifCancel(res.data.orderServices.status);
          // this.showStatus(res.data.nodeCode);
          this.detailObj = res.data;
          this.serviceInfo = res.data.orderServices;
          if (res.data.firstReview && res.data.firstReview.length > 0) {
            this.fileDataReview = res.data.firstReview;
          }
          // 待授权
          if (res.data.nodeCode !== this.nodeEnum.WAIT_UPLOAD && res.data.nodeCode !== this.nodeEnum.WAIT_REVIEW) {
            this.moduleList = res.data.firstReview;
            this.authorizerData = res.data.dataReview;
          } else if (res.data.dataReview.length > 0) {
            this.moduleList = res.data.dataReview;
          } else {
            this.getData();
          }
          this.status = res.data.nodeCode;
          if (this.status == this.nodeEnum.REGISTER_COMPLETE || this.status == this.nodeEnum.REGISTERING) {
            this.pageType = 1;
          } else if (
            this.status == this.nodeEnum.WAIT_AUTHORIZE ||
            (this.status == this.nodeEnum.AUTHORIZE_WAIT_CONFIRM && orderServices.progressBar == 2)
          ) {
            this.pageType = 3;
          }
          if (this.orderServices.progressBar === 2) {
            this.getReject();
            this.refuseReasonModal = true;
          }
          this.eprWorkOrderInfo = res.data.eprWorkOrder;
          this.workflow(this.info.flowId);
        }
      });
    },
    /** 初始化字段模板 */
    getData() {
      getNodeField({
        nodeCode: this.detailObj.nodeCode,
        nodeId: '',
        workFlowId: this.serviceInfo.workflowId,
      })
        .then((res) => {
          this.moduleList = res.data;
        })
        .catch((err) => {
          this.$Message.error(err.message);
        });
    },
    // 保存表单 next到预览需要先保存
    formSave(materialData, next) {
      EPRSave({
        serviceId: this.serviceId,
        materialData: materialData,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('保存成功');
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
      EPRCommit({
        serviceId: this.serviceId,
        materialData: materialData,
      })
        .then((res) => {
          if (res.code == 0) {
            localStorage.backPath = '/complianceBusiness/EPRList';
            this.$router.push('/submittedSucceeded');
          }
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    workflow(id) {
      workflowApi(id).then((res) => {
        this.forwardNodes = res.data.forwardNodes;
      });
    },
  },
  created() {
    this.getDetail();
    this.$store.dispatch('app/setStepIndex', 1);
  },
  mounted() {},
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.app.stepIndex == 2) {
      this.$Modal.confirm({
        title: '是否保存内容后再离开？',
        content: '选择确定后，系统会保存本次您填写的内容，方便您下次继续提交',
        okText: '保存后离开',
        cancelText: '直接离开',
        onOk: () => {
          let materialData = this.$refs.dynamicForm.getMaterial();
          EPRSave({
            serviceId: this.serviceId,
            materialData: materialData,
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
.main {
  padding: 20px;
}
.save-feil {
  margin-right: 32px;
  background: #ffffff;
  color: #16ade9;
  padding: 0 32px;
  border-color: #16ade9;
}
.save-feil:hover {
  background-color: #16ade9;
  color: #fff;
}
.tipsModal-title {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}
.tipsModal-contnet {
  font-size: 18px;
  .tip-title {
    color: #d9001b;
    margin-bottom: 18px;
  }
}
/deep/ .ivu-table-header {
  th {
    font-weight: 600;
    color: #333;
  }
}
/deep/ .ivu-table {
  td {
    padding-top: 16px;
    padding-bottom: 16px;
  }
}
.finish {
  margin: 24px;
  border-radius: 4px;
  .top {
    background-color: rgba(22, 173, 233, 0.19);
    padding: 0 32px;
    border-radius: 4px 4px 0 0;
    font-size: 14px;
    font-family: PingFangSC;
    color: #333333;
    line-height: 26px;
    img {
      position: relative;
      top: 3px;
    }
    .right {
      padding-left: 89px;
    }
  }
  .bottom {
    padding: 24px 32px 152px;
    background-color: #fff;
    border-radius: 0 0 4px 4px;
    .one {
      display: flex;
      div {
        width: 33%;
        display: flex;
        // float: left;
        .left {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
        }
        .right {
          width: 196px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          word-break: break-all;
          color: #333333;
        }
      }
    }
    .xinxi {
      margin: 20px 0;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
    .two {
      display: flex;
      div {
        width: 33%;
        line-height: 32px;
        .left {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
        }
        .right {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #333333;
        }
      }
    }
    .chakan {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #16ade9;
      cursor: pointer;
      img {
        position: relative;
        top: 3px;
      }
    }
  }
  .eprBottom {
    .one {
      margin-top: 16px;
    }
  }
}
.head {
  background-color: #fff;
  .left {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .right {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
  }
  .tabTitle {
    border-bottom: 1px solid #e9e9e9ff;
    padding-left: 32px;
    // margin-top: -18px;
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
/deep/ .ivu-form-item-label {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
  // float: none;
}
/deep/ .ivu-radio-group {
  margin-top: 4px;
}
.flex-direction {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
.upload-file {
  margin: 24px;
  .btn-grop {
    text-align: center;
    margin-top: 24px;
    padding-bottom: 24px;
  }
  .big-row {
    border-radius: 4px;
    margin-bottom: 24px;
    .beizhu {
      background: #fff1dd;
      font-size: 12px;
      font-family: PingFangSC;
      color: #333333;
      padding: 7px 12px;
      margin-bottom: 15px;
      img {
        position: relative;
        top: 3px;
      }
    }
    .title {
      padding: 16px 32px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      background: rgba(24, 144, 255, 0.19);
      border-radius: 4px 4px 0px 0px;
      // opacity: 0.19;
    }
    .main {
      background-color: #fff;
      padding: 15px 32px 20px 32px;
      overflow: hidden;
      border-radius: 0 0 4px 4px;
      .notChange {
        .inner {
          background: #9999991f;
          .uplad-word {
            color: #666666;
          }
          img {
            display: none;
          }
        }
      }
      .out-img-box {
        .img-box {
          position: relative;
          text-align: center;
          .show-pdf {
            color: #16ade9;
          }
          button {
            width: 0px;
            padding: 0px;
            border: none;
            position: absolute;
            top: 8px;
            height: 0px;
            z-index: 1;
            margin-left: 3px;
            img.closeImg {
              width: 13px;
              height: 13px;
            }
          }
        }
      }
      .upload-tip {
        font-size: 14px;
        color: #cccccc;
        vertical-align: bottom;
        margin-right: 16px;
        a {
          color: #16ade9;
        }
        img {
          width: 14px;
          height: 14px;
          margin-top: 9px;
          float: left;
        }
      }
      .row {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
.loadingText {
  font-size: 16px;
}
.container {
  height: calc(100vh - 60px);
}
.topTaxBoxContainer {
  background: #ffffff;
  padding: 31px 31px 16px 31px;
  .title {
    font-size: 24px;
    font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
  }
  .country {
    font-size: 14px;
    font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
}
.content {
  margin: 23px;
  background: #ffffff;
  padding: 24px 32px;
  .subInfo {
    // width: 1104px;
    height: 40px;
    background: #fff1dd;
    font-size: 14px;
    font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
    color: #333333ff;
    line-height: 14px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    font-weight: 500;
  }
  .title {
    font-size: 18px;
    font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
    font-weight: 600;
    color: #333333;
    line-height: 24px;
    margin-bottom: 10px;
  }
}
.flex-direction {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
/deep/ .ivu-form {
  .ivu-form-item-label {
    font-size: 16px;
    font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    // float: none;
  }
  .ivu-form-item-content {
    width: 100%;
  }
}
.requiredItem {
  /deep/ .ivu-form-item-label::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
    font-size: 12px;
    color: #ed4014;
  }
}
.out-img-box {
  .img-box {
    position: relative;
    text-align: center;
    width: 268px;
    .show-pdf {
      color: #16ade9;
    }
    button {
      width: 0px;
      padding: 0px;
      border: none;
      position: absolute;
      top: 8px;
      height: 0px;
      z-index: 1;
      margin-left: 3px;
      img.closeImg {
        width: 13px;
        height: 13px;
      }
    }
  }
}
.upload-tip {
  font-size: 14px;
  color: #cccccc;
  vertical-align: bottom;
  margin-right: 16px;
  a {
    color: #16ade9;
  }
  img {
    width: 16px;
    height: 16px;
    margin-top: 9px;
    float: left;
    margin-right: 3px;
  }
  display: inline-block;
}
.red-tip {
  margin: 20px 0;

  font-size: 14px;
  font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
  font-weight: 500;
  color: #1890ff;
  line-height: 20px;
}
.footer {
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
.download {
  color: #02a7f0;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline-block;
}

.statusIndfContent {
  padding: 0 24px;
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
}
.epr-title {
  padding: 0 24px;
  border-bottom: 1px solid #f0f0f0;
}
.import-templates {
  float: right;
  font-size: 16px;
  font-weight: normal;
  color: #3a7fff;
  cursor: pointer;
}
</style>
