<!-- 新VAT注册+申报 -->
<template>
  <div class="waper">
    <!-- 头部 -->
    <a-spin tip="信息加载中，请稍等" size="large" :spinning="spinning" wrapperClassName="spinning-wrap">
      <div class="headContent">
        <a-affix :offset-top="top" :target="getAnchorContainer">
          <div class="fill-information-title" v-if="detailObj.countryNameZh">
            <img @click="$router.push('/myVantService')" src="@comp/images/dynamicForm/icon_fanhui2x.png" /><span
              v-if="$store.state.app.stepIndex !== 5"
              >填写</span
            >【{{ detailObj.countryNameZh }}{{ titleMap[detailObj.functionCode] }}】服务资料
          </div>
        </a-affix>
        <!-- 进度条 -->
        <div class="statusIndfCon">
          <div class="statusContent" v-if="detailObj.currentNodeCode !== currentCodeEnum.NODE2">
            <div class="statusItem">
              <a-steps :current="orderStatus">
                <a-step v-for="(item, index) in statusList" :key="index" :title="item.label"></a-step>
              </a-steps>
            </div>
          </div>
          <div class="rejected" v-if="reson">
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
        <div class="tabTitle" v-if="detailObj.currentNodeCode !== currentCodeEnum.NODE2">
          <Tabs v-model="showTabs">
            <TabPane label="税号信息" name="name2" v-if="detailObj.currentNodeCode === currentCodeEnum.NODE8"></TabPane>
            <TabPane label="注册资料" name="name3"></TabPane>
          </Tabs>
        </div>
      </div>

      <!-- 组件 -->
      <div class="container agentClass">
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
            @submitVerification="submitVerification"
          />
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
import DynamicForm from '../../DynamicForm/dynamicForm'; //表单配置
import TaxInfo from './taxInfo.vue'; //税号信息组件
import { getNodeField, latestRejectByWorkNo } from '@comp/api/taxRegister.js';
import { currentCodeList, currentCodeEnum } from '../../DynamicForm/staticList.js';
import { workOrderCommonOperator } from '../../DynamicForm/commonOperator.js';
import moment from 'moment';
export default {
  components: { DynamicForm, TaxInfo },
  data() {
    return {
      top: 60,
      moduleList: [],
      detailObj: {},
      id: this.$route.query.id,
      agingBox: false, //温馨提示
      showTabs: 'name3',
      fileDataReview: [],
      orderStatus: 0,
      currentCodeList,
      currentCodeEnum,
      statusList: [
        { label: '提交资料', content: '' },
        { label: '待审核', content: '' },
        { label: '注册中', content: '' },
        { label: '注册完成', content: '' },
      ],
      isCancel: false,
      titleMap: {
        2: '转代理+申报',
        5: '注册+申报',
      },
      spinning: false,

      reson: '',
    };
  },
  filters: {
    filterKey(value, list, findKey = 'value', filterKey = 'label') {
      let temp = list.find((item) => item[findKey] === value);
      return temp ? temp[filterKey] : value;
    },
  },
  created() {
    this.getWorkOrderDetail(); //获取详情
    this.$store.dispatch('app/setStepIndex', 1);
  },
  computed: {
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item) => {
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', !this.isEdit);
          } else {
            item.disabled = !this.isEdit;
          }
        });
      });
      return this.moduleList;
    },
    isEdit() {
      //待上传资料，待授权
      return [currentCodeEnum.NODE2, currentCodeEnum.NODE5].includes(this.detailObj.currentNodeCode);
    },
  },
  methods: {
    getAnchorContainer() {
      return document.querySelector('.main-container');
    },
    // 如果工单状态为取消中（11）或已取消（9），则禁用所有操作按钮，并给出提示
    ifCancel(status) {
      this.isCancel = status === 2 || status === 9 || status === 11;
      if (status === 11) {
        this.$Message.warning('此服务在取消中，暂时不能操作');
      } else if (status === 9) {
        this.$Message.warning('该服务已取消');
      } else if (status === 2) {
        this.$Message.warning('该服务待续费');
      }
    },
    /**  工单详情 */
    getWorkOrderDetail() {
      this.spinning = true;
      workOrderCommonOperator('detail', this.id)
        .then((res) => {
          this.spinning = false;
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
    //下一步提交校验
    submitVerification(steps, moduleListBlock) {
      //公司信息
      if (steps === 0) {
        let licenseBusinessPeriod = moduleListBlock[0].fApi.getValue('licenseBusinessPeriod');
        let days = moment(licenseBusinessPeriod[1]).diff(moment(new Date()), 'days');
        if (days < 90) {
          this.$refs.dynamicForm.verificationPass = false;
          this.$Message.warning('营业执照有效期需要大于90天！');
        }
      } else if (steps === 1) {
        //法人信息
        let licenseRegisteredLegalPersonZh = moduleListBlock[0].fApi.getValue('licenseRegisteredLegalPersonZh');
        let companyLegalPersonZh = moduleListBlock[1].fApi.getValue('companyLegalPersonZh');
        let idCardValidityPeriod = moduleListBlock[1].fApi.getValue('idCardValidityPeriod');
        let days = moment(idCardValidityPeriod[1]).diff(moment(new Date()), 'days');
        if (licenseRegisteredLegalPersonZh !== companyLegalPersonZh) {
          this.$refs.dynamicForm.verificationPass = false;
          this.$Message.warning('身份证中文姓名和营业执照法人中文姓名要一致！');
        }
        if (days < 90) {
          this.$refs.dynamicForm.verificationPass = false;
          this.$Message.warning('身份证有效期需要大于90天！');
        }
      }
    },
    // //OCR识别失败校验
    // OCRverification(steps, moduleListBlock) {
    //   if (steps === 0) {
    //     console.log(moduleListBlock[steps].fApi.formData());
    //     let { companyEmail, companyTel, companyBusinessLicense } = moduleListBlock[steps].fApi.formData();
    //     if (this.detailObj.functionCode === 5) {
    //       if (companyBusinessLicense && companyBusinessLicense.length && companyEmail && companyTel) {
    //         this.$refs.dynamicForm.OCRverificationPass = false;
    //       }
    //     } else if (this.detailObj.functionCode === 2) {
    //       if (companyBusinessLicense && companyBusinessLicense.length) {
    //         this.$refs.dynamicForm.OCRverificationPass = false;
    //       }
    //     }
    //   }
    // },
    // 保存表单
    formSave(materialData, preview) {
      workOrderCommonOperator('save', {
        material: materialData,
        workOrderId: this.id,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('保存成功');
            // this.getWorkOrderDetail(); //获取详情
            if (preview) {
              this.$refs.dynamicForm.stepChange(5);
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

    showStatus(currentNodeCode) {
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
    if ([2, 3, 4].includes(this.$store.state.app.stepIndex)) {
      this.$Modal.confirm({
        title: '是否保存内容后再离开？',
        content: '选择确定后，系统会保存本次您填写的内容，方便您下次继续提交',
        okText: '保存后离开',
        cancelText: '直接离开',
        onOk: () => {
          this.$refs.dynamicForm.preserveBtn();
          next();
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
.headContent {
  background: #ffffff;
  padding: 1px 24px 0px;
  border-bottom: 1px solid #f0f0f0;
  /deep/.ant-affix {
    z-index: 11;
    .fill-information-title {
      background: #fff;
      padding-top: 16px;
    }
  }

  .statusIndfCon {
    overflow: hidden;
    margin: 10px 0;
    .statusContent {
      padding-bottom: 16px;
    }
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
.spinning-wrap {
  // background: #fff;
  /deep/.ant-spin-blur::after {
    opacity: 0.8;
  }
}
</style>
