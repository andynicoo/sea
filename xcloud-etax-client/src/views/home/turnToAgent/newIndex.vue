<template>
  <div class="waper">
    <!-- 头部 -->
    <div class="headContent top">
      <div class="fill-information-title">
        <img @click="$router.push('/myVantService')" src="@/assets/images/common/dynamicForm/icon_fanhui2x.png" /><span
          v-if="$store.state.app.stepIndex != 3"
          >填写</span
        >【{{ detailObj.countryNameZh }}转代理+申报】服务资料
        <span
          class="import-using-templates"
          v-if="$store.state.app.stepIndex == 2"
          @click="$refs.dynamicForm.importTemplatesModal = true"
          ><img src="@/assets/images/common/downloadIcon.png" />使用模板导入</span
        >
      </div>
    </div>
    <div class="header top">
      <!-- <p class="title typeTitle">
        {{ detailObj.currentNodeCode | filterKey(currentCodeList) }}
        <span class="smallTitle">({{ detailObj.countryNameZh }}转代理+申报)</span>
      </p> -->

      <div class="top-tip" v-if="detailObj.currentNodeCode == currentCodeEnum.NODE2 && detailObj.progressBar != 2">
        <p class="wramTip">
          <img src="@/assets/images/common/Shape.png" />
          温馨提示：转代理时长根据各国政策变动，参考时效可
          <span @click="agingBox = true">查看>></span>
        </p>
      </div>
      <div
        class="statusItem"
        style="margin: 20px auto; width: 70%"
        v-if="detailObj.currentNodeCode != currentCodeEnum.NODE2"
      >
        <Steps :current="orderStatus">
          <Step v-for="(item, index) in speedList" :key="index" :title="item.label"></Step>
        </Steps>
      </div>
      <!-- 资料被驳回原因提示 -->
      <div class="top-reason" v-if="detailObj.progressBar == 2">
        <p>
          <img src="@/assets/images/common/reason.png" />
          转代理资料被驳回（原因：
          <span>{{ reson }}</span>
          ）
        </p>
      </div>
      <div class="tabTitle" v-if="detailObj.currentNodeCode == currentCodeEnum.NODE5">
        <Tabs v-model="showTabs">
          <TabPane label="待授权转代理" name="name1"></TabPane>
          <TabPane label="转代理资料" name="name2"></TabPane>
        </Tabs>
      </div>
    </div>

    <!-- 组件 -->
    <div class="container agentClass" v-if="!submitFinish">
      <!-- 上传待授权证书 -->
      <div v-if="showTabs == 'name1'">
        <Authorized
          :isCancel="isCancel"
          :fileDataReview="fileDataReview"
          :serviceInfo="detailObj"
          :showAuthorizeFile="detailObj.currentNodeCode === currentCodeEnum.NODE5"
        ></Authorized>
      </div>
      <!-- 表单资料 -->
      <div v-if="showTabs == 'name2'">
        <DynamicForm
          ref="dynamicForm"
          :moduleList="dataReview"
          @formSave="formSave"
          @formsubmit="formsubmit"
          :isCancel="isCancel"
          :showSave="isEdit"
          :showSubmit="isEdit"
          :workInfo="detailObj"
          :tabsCurrent="2"
        />
      </div>
    </div>
    <!-- 提交完成后展示 -->
    <div class="submit-finish" v-if="submitFinish">
      <div class="main">
        <img src="@/assets/images/common/chenggong.png" />
        <p class="tip-success">提交注册资料成功，已通知税务师进行审核！</p>
        <p class="submit-time">
          提交时间：
          <span>{{ submitTime }}</span>
        </p>
        <p class="caokao-time">{{ detailObj.countryNameZh }}转代理参考时效：{{ transformEfficiency }}，请耐心等待</p>
        <Button type="info" ghost style="width: 142px" @click="backToHome">返回工作台</Button>
        <div class="gongzhonghao">
          <p class="vat-jindu">关注跨税云公众号，实时查看VAT进度；</p>
          <img src="@/assets/images/common/erweima.png" width="140" />
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <Modal v-model="agingBox" footer-hide title="转代理时效说明">
      <div class="aging-box">
        <div class="aging-country">英国：</div>
        <div class="aging-container">英国转代理时效为2-4周左右，改地址时效为1-3个月；</div>
        <div class="aging-country">德国：</div>
        <div class="aging-container">转代理时效为1周左右；</div>
        <div class="remark">备注：具体以实际情况为准，以上时间仅供参考；</div>
      </div>
    </Modal>
  </div>
</template>
<script>
import DynamicForm from '@/components/DynamicForm/dynamicForm'; //表单配置
import Authorized from '@/components/Authorized/index'; //待授权上传证书组件
import {
  getDetail,
  getNodeField,
  materialSave,
  materialSubmit,
  latestRejectByWorkNo,
  uploadAuthorization,
} from '@/api/taxRegister.js';
import mixin from '@/views/home/mixin';
import { statusList, otherStatusList } from './dateList';
import isServiceCancel from '@/views/home/mixin/isServiceCancel';
import { currentCodeList, currentCodeEnum } from '@/views/userManage/setting/staticList.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator.js';
export default {
  components: { DynamicForm, Authorized },
  mixins: [mixin, isServiceCancel],
  data() {
    return {
      statusList: statusList,
      moduleList: [],
      detailObj: {},
      id: this.$route.query.id,
      agingBox: false, //温馨提示
      submitFinish: false,
      submitTime: '', //当前时间
      transformEfficiency: '',
      showTabs: 'name2',
      fileDataReview: [],
      orderStatus: 0, //工单进度条
      reson: '', //驳回原因
      flag: '',
      countryCode: this.$route.query.countryCode,
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
    this.getWorkOrderDetail(); //获取详情
    this.$store.dispatch('app/setStepIndex', 1);
  },
  computed: {
    isEdit() {
      return [currentCodeEnum.NODE2, currentCodeEnum.NODE5].includes(this.detailObj.currentNodeCode);
    },
    speedList() {
      if (['GB', 'DE', 'ES', 'PL', 'CZ', 'AT'].includes(this.countryCode)) {
        this.flag = 'noFlag'; //无授权状态
        return statusList;
      } else {
        this.flag = 'haveFlag'; //有授权状态
        return otherStatusList;
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
            if (res.data.currentNodeCode == currentCodeEnum.NODE5 && res.data.firstReview.length > 0) {
              this.fileDataReview = res.data.dataReview;
              this.moduleList = res.data.firstReview;
              this.showTabs = 'name1';
            } else {
              if ([currentCodeEnum.NODE4, currentCodeEnum.NODE6].includes(res.data.currentNodeCode)) {
                this.moduleList = res.data.firstReview;
              } else {
                if (res.data.dataReview.length > 0) {
                  this.moduleList = res.data.dataReview;
                } else {
                  this.getData();
                }
              }
            }
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
            this.getWorkOrderDetail(); //获取详情
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
          '<p style="text-align:left">温馨提示：提交后不可修改，不同国家转代理时效不同；请确认资料的完整性（资料不正确有可能影响时效及申报）</p>',
        cancelText: '取消',
        okText: '提交',
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
            // this.$Message.success('提交成功');
            // this.getWorkOrderDetail(); //获取详情
            localStorage.backPath = '/myVantService';
            this.$router.push('/submittedSucceeded');
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
      if (this.flag == 'noFlag') {
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
  padding: 20px 24px 0;
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
}
.top {
  min-width: 1024px;
  background-color: #fff;
  padding: 20px 24px 0;
  font-size: 14px;
  overflow: hidden;
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
    margin-bottom: 20px;
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
.top-speed {
  text-align: center;
  padding-bottom: 24px;
  p {
    margin: 0 auto;
    position: relative;
    width: 642px;
    font-size: 12px;
    font-family: PingFangSC;
    color: #666666;
    .status1 {
      position: absolute;
      top: 27px;
      left: 102px;
    }
    .status2 {
      position: absolute;
      top: 27px;
      left: 364px;
    }
  }
}
.submit-finish {
  margin: 24px;
  background-color: #fff;
  .main {
    text-align: center;
    padding: 50px;
    .gongzhonghao {
      width: 730px;
      background-color: rgba(22, 173, 233, 0.1);
      padding: 24px;
      margin: 32px auto;
      .vat-jindu {
        font-size: 14px;
        font-family: PingFangSC;
        color: #333333;
        line-height: 20px;
        margin-bottom: 12px;
      }
    }
    .tip-success {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 20px;
      margin-top: 25px;
    }
    .submit-time {
      font-size: 12px;
      font-family: PingFangSC;
      color: #333333;
      line-height: 17px;
      margin-top: 17px;
    }
    .caokao-time {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ed3e3e;
      margin-top: 8px;
      margin-bottom: 24px;
    }
  }
}
</style>
