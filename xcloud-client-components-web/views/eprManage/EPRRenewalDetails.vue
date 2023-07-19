<template>
  <div>
    <div class="head">
      <div>
        <div class="epr-title">
          <span class="left">续费详情</span>
          <span class="right">（ {{ info.serviceName }}({{ info.specName }}) ）</span>
        </div>
        <!-- 顶部服务状态图 -->
        <div class="statusItem" :class="{ statusIndfContent: !isSG }" style="margin: 20px auto; width: 80%">
          <Steps :current="orderStatus">
            <Step v-for="(item, index) in forwardNodes" :title="item.nodeName" :key="index"></Step>
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
            续费资料
          </span>

          <span :class="{ 'active-tab': pageType == 3 }" @click="pageType = 3" v-if="isDEWeee"> 续费资料 </span>

          <span :class="{ 'active-tab': pageType == 2 }" @click="pageType = 2">注册资料</span>
        </div>
      </div>
    </div>
    <div v-show="pageType == 2">
      <DynamicForm
        key="dynamicForm"
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

    <div v-if="pageType === 3">
      <div
        v-if="info.currentNodeCode !== 'NODE0361'"
        style="padding: 24px 0; overflow: hidden; background-color: white"
      >
      <FormTitle v-if="isSG" value="WEEE产品信息" />
        <h2 v-else  class="module-name"><b></b>{{ 'WEEE产品信息' }}</h2>
        <div class="ivu-col-span-23" style="padding-left: 23px">
          <label class="ivu-form-item-label">
            <span style="display: inline-block; margin: 20px 0 20px"></span>
          </label>
          <a-table :class="isSG? 'sg-bg': 'vat-bg'" bordered :columns="isDEWeee ?  columnsProductDE : columnsProduct" :dataSource="productList" :pagination="false">
          </a-table>
        </div>
      </div>
      <DynamicForm
        key="dynamicForm2"
        ref="dynamicForm2"
        :moduleList="dataReview2"
        :showBtn="isEdit2"
        :isCancel="isCancel"
        @formSave="formSave2"
        @formsubmit="formsubmit2"
        @formCancel="isEdit2 = false"
        :isEdit="isEdit2"
        :showSave="isEdit2"
        :showSubmit="isEdit2"
        :workInfo="orderServices"
        :tabsCurrent="2"
        :isRemark="true"
      />
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
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import moment from 'moment';
// import TopSpeed from '../components/topSpeed.vue';
import DynamicForm from '@/components/DynamicForm/dynamicForm';
// import EprAuthorizer from '../components/eprAuthorizer.vue';
import mixin from '@/views/home/mixin';
// import { EPRTaxServicesNodeList } from './dateList';
import { columnsHisotryBuy as columnsProduct, columnsHisotryBuyDE as columnsProductDE } from './config';

import { getEprRenewalDetailAPI, getEprRenewalNodeListAPI, EPRRenewSave, EPRRenewCommit } from './../../api/eprManage';
import isServiceCancel from '@/views/home/mixin/isServiceCancel';
import cloneDeep from 'lodash/cloneDeep';

export default {
  components: {
    // TopSpeed,
    DynamicForm,
    // EprAuthorizer,
    FormTitle,
  },
  mixins: [isServiceCancel],
  data() {
    return {
      columnsProduct,
      columnsProductDE,
      productList: [],
      countryCode: '',
      showSubmit: true, //表单提交按钮
      showSave: true, //表单保存按钮
      fileDataReview: [],
      status: '',
      serviceId: this.$route.query.serviceId,
      workOrderId: this.$route.query.workOrderId,
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
      moduleList2: [],
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
    isSG: () => localStorage.getItem('enterpriseid') === '40',
    isEdit() {
      return (
        this.status === this.nodeEnum.WAIT_UPLOAD
        //  ||
        // (this.orderServices.progressBar === 2 && this.status !== this.nodeEnum.WAIT_AUTHORIZE)
      );
    },
    isEdit2() {
      return (
        this.info.currentNodeCode === 'NODE0361'
        //  ||
        // (this.orderServices.progressBar === 2 && this.status !== this.nodeEnum.WAIT_AUTHORIZE)
      );
    },
    isNodeFirst() {
      return (
        this.info.currentNodeCode === 'NODE0361'
        //  ||
        // (this.orderServices.progressBar === 2 && this.status !== this.nodeEnum.WAIT_AUTHORIZE)
      );
    },
    isWeee() {
      return this.info.functionCode === '3138';
    },
    isDEWeee() {
      return this.info.functionCode === '3138' && this.info.countryCode === 'DE';
    },

    orderStatus() {
      let index = this.forwardNodes.findIndex((item) => item.nodeCode === this.info.currentNodeCode);
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
    dataReview2() {
      this.moduleList2.forEach((pro) => {
        pro.columns.forEach((item) => {
          let disabled = pro.moduleId === 'PRODUCT_INFO' ? true : !this.isEdit2;
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
      return this.moduleList2;
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
      getEprRenewalDetailAPI(this.workOrderId).then((res) => {
        if (res.code === 0) {
          // res.data.currentNodeCode = 'NODE0361';
          this.info = res.data;
          localStorage.workflowId = this.info.flowId || this.info.workflowId;
          this.authAgentInfo = res.data.authAgentInfo;
          this.authorizedAgentWorkOrder = res.data.authorizedAgentWorkOrder;
          this.orderServices = res.data;
          this.ifCancel(res.data.status);
          // this.showStatus(res.data.nodeCode);
          this.detailObj = res.data;
          this.serviceInfo = res.data.orderServices;
          // 待授权
          if (res.data.dataReview.length > 0) {
            this.moduleList = res.data.dataReview;
          } else if (res.data.firstReview.length > 0) {
            this.moduleList = res.data.firstReview;
          }

          // 如果是德国weee产品
          if (this.isDEWeee) {
            this.pageType = 3;

            const moduleName = res.data.eprWorkOrder.eprEffectiveDate
              ? moment(res.data.eprWorkOrder.eprEffectiveDate).subtract(1, 'year').format('YYYY') + '年产品信息'
              : '上一年产品信息';

            const currentProductInfo = this.moduleList.find((item) => item.moduleCode === 'productInfo');
            const reView = Array.isArray(currentProductInfo?.columns?.[0]?.reView)
              ? [...currentProductInfo?.columns?.[0]?.reView]
              : [];
            // 处理已购买
            const productList = res.data.eprWorkOrder.productInfoList.map(({ effectDate, ...item }) => {
              // 是否已续费. 1. 续费完成. 产品类别相等 产品log相等
              const isBuy =
                this.info.currentNodeCode === 'NODE0367' &&
                !!reView.find(
                  (reViewItem) =>
                    reViewItem.productCategory === item.productCategory && reViewItem.productLogo === item.productLogo
                );
              return {
                ...item,
                isBuy,
              };
            });
            const weeeObj = {
              moduleName,
              moduleId: 'PRODUCT_INFO',
              moduleCode: 'productInfo',
              moduleDesc: '产品信息',
              columns: [
                {
                  createTime: '2023-05-06 11:22:01',
                  updateTime: '2023-05-06 11:22:01',
                  id: '1615332222',
                  workflowId: '1654687819995680768',
                  nodeId: '1452483114965683369',
                  columnId: '6672',
                  moduleId: '212',
                  columnPid: '',
                  columnOption: '',
                  inputType: 10,
                  info: '{"maxlength":"","regxtype":"","rows":4,"multiple":false,"filterable":false,"selecttype":"1","selectfixed":"","drag":false,"limit":1,"accepts":["jpg","jpeg","png","pdf"],"datetype":"","groups":[{"label":"","value":""}]}',
                  isNeed: false,
                  isDel: false,
                  isRemark: true,
                  placeHolder: '',
                  remindMessage: '',
                  fileModelUrl: 'http://file.itaxs.com/pro/20220401/236ff3e9d23443e9b538a8ebdacd1ebd.jpg',
                  sourceFileUrl: '',
                  renameText: '',
                  renamePre: 0,
                  isSys: true,
                  keyName: 'weeeInfos',
                  keyLabel: 'WEEE产品信息',
                  sort: 27,
                  selected: 1,
                  keyNameValue: {},
                  reView: productList,
                },
              ],
            };

            // 提交续费申请
            if (this.isNodeFirst) {
              this.moduleList2.push(cloneDeep(currentProductInfo));
            } else {
              this.productList = reView;
            }

            this.moduleList2.push(weeeObj);
          }

          // 不是续费通道申请的时候把产品信息去除
          if (this.isDEWeee) {
            this.moduleList = this.moduleList.filter((item) => item.moduleCode !== 'productInfo');
          }

          // this.moduleList2 = this.moduleList.filter(item=>item.moduleCode === 'productInfo')

          this.status = res.data.nodeCode;

          this.eprWorkOrderInfo = res.data.eprWorkOrder;
          this.workflow();
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
          this.$Message.error({ content: res.msg || '异常' });
        });
    },
    // 保存表单 next到预览需要先保存
    formSave2(material2, isSubmit) {
      const form1 = JSON.parse(this.$refs.dynamicForm.getMaterial());
      const form2 = JSON.parse(material2);
      const material = JSON.stringify({
        ...form1,
        ...form2,
      });
      if (isSubmit) {
        this.formsubmit2(material);
        return;
      }

      EPRRenewSave({
        workOrderId: this.info.workId,
        material,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('保存成功');
          }
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    // 提交表单
    formsubmit2(material2) {
      const form1 = JSON.parse(this.$refs.dynamicForm.getMaterial());
      const form2 = JSON.parse(material2);
      const material = JSON.stringify({
        ...form1,
        ...form2,
      });
      EPRRenewCommit({
        workOrderId: this.info.workId,
        material,
      })
        .then((res) => {
          if (res.code == 0) {
            localStorage.backPath = '/complianceBusiness/EPRRenewalList';
            this.$router.push('/submittedSucceeded');
          }
        })
        .catch((res) => {
          this.$Message.error(res.msg);
        });
    },
    workflow() {
      getEprRenewalNodeListAPI({ flowId: this.$route.query.flowId }).then((res) => {
        if (res.code === 0) {
          this.forwardNodes = res.data.filter((item) => item.nodeValue == 1);
        }
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

.module-name {
  font-size: 16px;
  color: #303132;
  margin-top: 48px;
  padding: 0 24px;
  b {
    display: inline-block;
    width: 2px;
    height: 15px;
    background: #3a7fff;
    margin-right: 8px;
    position: relative;
    top: 2px;
  }
}

::v-deep {
  .sg-bg {
    .ant-table-thead > tr > th {
      background:  #ffdc87 ;
    }
  }
  .vat-bg {
    .ant-table-thead > tr > th {
      background: rgba(#3a7fff, 0.8);
      color: #fff;
    }
  }
}




</style>
