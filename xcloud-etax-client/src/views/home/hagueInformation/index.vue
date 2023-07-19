<template>
  <div>
    <div>
      <div class="title" style="padding-bottom: 16px">
        <!-- {{ info.currentNodeCode | filterKey(currentCodeList) }}
        <span class="line">（西班牙海牙认证）</span> -->
        <div class="fill-information-title">
          <img
            @click="$router.push('/myVantService')"
            src="@/assets/images/common/dynamicForm/icon_fanhui2x.png"
          /><span v-if="$store.state.app.stepIndex != 3">填写</span>【西班牙海牙认证】服务资料
          <span
            class="import-using-templates"
            v-if="$store.state.app.stepIndex == 2"
            @click="$refs.dynamicForm.importTemplatesModal = true"
            ><img src="@/assets/images/common/downloadIcon.png" />使用模板导入</span
          >
        </div>
        <div class="ziliao" v-if="info.progressBar === 2">
          <p style="width: 892px; margin: 0 auto; position: relative">
            <img src="@/assets/images/hague/bohui1.svg" />
            <span class="guding1" style="top: 28px">提交时间：{{ info.saveMaterialTime }}</span>
          </p>
          <div class="top-reason">
            <p>
              <img src="@/assets/images/common/reason.png" />
              西班牙海牙认证资料被驳回（原因：
              <span>{{ rejectReason }}</span>
              ）
            </p>
          </div>
        </div>
      </div>
      <div class="container1" v-if="info.currentNodeCode === nodeCodeObj.WAIT_UPLOAD && info.progressBar === 1">
        <div class="liucheng">
          <p class="shuoming">海牙认证流程说明：</p>
          <img src="@/assets/images/hague/liucheng1.svg" style="margin-left: 117px" />
        </div>
      </div>
    </div>

    <div v-if="info.currentNodeCode !== nodeCodeObj.WAIT_UPLOAD">
      <div class="title" style="border: none">
        <!-- <span>详情</span>
        <span class="line">（西班牙海牙认证）</span> -->
        <div class="ziliao">
          <p style="width: 892px; margin: 0 auto; position: relative">
            <img src="@/assets/images/hague/daishenhe1.svg" v-if="info.currentNodeCode === nodeCodeObj.WAIT_REVIEW" />
            <img
              src="@/assets/images/hague/dairenzheng.svg"
              v-if="info.currentNodeCode === nodeCodeObj.WAIT_AUTHORIZE"
            />
            <img
              src="@/assets/images/hague/renzhengzhong1.svg"
              v-if="info.currentNodeCode === nodeCodeObj.PROCESSING"
            />
            <img
              src="@/assets/images/hague/renzhengwancheng1.svg"
              v-if="info.currentNodeCode === nodeCodeObj.COMPLETE"
            />
            <!-- <span class="guding1">提交时间：{{ info.submitMaterialTime | filterDate }}</span> -->
            <span class="guding2" v-if="info.currentNodeCode !== nodeCodeObj.WAIT_REVIEW && info.auditPassTime"
              >审核时间：{{ info.auditPassTime | filterDate }}</span
            >
            <!-- <span class="guding3" v-if="info.currentNodeCode === nodeCodeObj.PROCESSING || info.currentNodeCode === nodeCodeObj.COMPLETE">提交时间：{{ info.sendProviderTime | filterDate }}</span> -->
            <span class="guding4" v-if="info.currentNodeCode === nodeCodeObj.COMPLETE && info.completeTime"
              >完成时间：{{ info.completeTime | filterDate }}</span
            >
          </p>
        </div>
      </div>
    </div>

    <Modal v-model="tipsModal">
      <div class="tipsModal-title">温馨提示</div>
      <Divider style="margin: 16px 0" />
      <div class="tipsModal-contnet">
        <p class="tip-title">您的资料审核未通过，请按照以下指引修改...</p>
        <p>{{ rejectReason }}</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="tipsModal = false">知道了</Button>
      </div>
    </Modal>

    <div class="tabTitle" v-if="info.currentNodeCode !== nodeCodeObj.WAIT_UPLOAD">
      <Tabs v-model="showTabs">
        <TabPane label="待授权" name="name1" v-if="info.currentNodeCode === nodeCodeObj.WAIT_AUTHORIZE"></TabPane>
        <TabPane label="认证资料" name="name2"></TabPane>
        <TabPane label="基础信息" name="name3" v-if="info.currentNodeCode === nodeCodeObj.COMPLETE"></TabPane>
      </Tabs>
    </div>

    <!-- 组件 -->
    <div class="container agentClass">
      <!-- 上传待授权证书 -->
      <div v-if="showTabs == 'name1'">
        <Authorized
          :isCancel="isCancel"
          :fileDataReview="fileDataReview"
          :serviceInfo="info"
          :showSubmit="false"
          hyAuthorized
          :showAuthorizeFile="info.currentNodeCode === nodeCodeObj.WAIT_AUTHORIZE"
        ></Authorized>
        <div class="address-wrapper">
          <p class="add-title">寄送地址：</p>
          <div class="address-box">
            <p class="info">
              <span class="info-title">收件人：</span>
              <span class="info-content">跨税云注册组</span>
            </p>
            <p class="info">
              <span class="info-title">联系电话：</span>
              <span class="info-content">15323756779</span>
            </p>
            <p class="info">
              <span class="info-title">寄送地址：</span>
              <span class="info-content">广东省深圳市龙岗区天安云谷2期4栋34楼</span>
            </p>
            <p class="info-remark">
              备注：1、寄送费用由寄方承担； 2、收到资料后即可递交税局，建议3天内邮寄哦；<span style="color: red"
                >3、寄送资料后即可，平台收到后会立即处理</span
              >
            </p>
          </div>
        </div>
      </div>
      <!-- 表单资料 -->
      <div v-if="showTabs == 'name2'">
        <DynamicForm
          ref="dynamicForm"
          :moduleList="dataReview"
          @formSave="getInfo"
          @formsubmit="getInfo"
          hyAuthorized
          :isCancel="isCancel"
          :showSubmit="isEdit"
          :showSave="isEdit"
          :workOrderId="id"
          :workInfo="info"
          :tabsCurrent="2"
        />
      </div>
      <div class="main" v-if="showTabs == 'name3'">
        <p class="base">基础信息</p>
        <p class="mt24">
          <span class="left">认证国家：</span>
          <span class="right">西班牙</span>
        </p>
        <p class="mt24">
          <span class="left">公司名称：</span>
          <span class="right">{{ info.companyNameZh }}</span>
        </p>
        <p class="mt24">
          <span class="left">公司英文名称：</span>
          <span class="right">{{ info.companyNameEn }}</span>
        </p>
        <p class="mt24">
          <span class="left">VAT税号：</span>
          <span class="right">{{ info.vatTaxNumber }}</span>
        </p>
        <p class="mt24">
          <span class="left">海牙认证：</span>
          <a :href="info.hyFile" target="_blank" class="file" style="color: #fa5555">海牙文件</a>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import DynamicForm from '@/components/DynamicForm/dynamicForm'; //表单配置
import Authorized from '@/components/Authorized/index'; //待授权上传证书组件
import hyLink from '@/views/home/mixin/hyLink';
import { getNodeField, latestRejectByWorkNo } from '@/api/taxRegister.js';
import isServiceCancel from '@/views/home/mixin/isServiceCancel';
import { currentCodeList, currentCodeEnum } from '@/views/userManage/setting/staticList.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator.js';
export default {
  data() {
    return {
      id: this.$route.query.id,
      serviceNo: this.$route.query.serviceNo,
      info: {},
      fileDataReview: [],
      moduleList: [],
      tipsModal: false,
      rejectReason: '',
      showTabs: 'name2',
      nodeCodeObj: {
        WAIT_UPLOAD: currentCodeEnum.NODE2, //待上传
        WAIT_REVIEW: currentCodeEnum.NODE3, // 待审核
        WAIT_AUTHORIZE: currentCodeEnum.NODE5, // 待授权
        PROCESSING: currentCodeEnum.NODE7, // 海牙认证中
        COMPLETE: currentCodeEnum.NODE8, // 认证完成
      },
      currentCodeList,
      currentCodeEnum,
    };
  },
  mixins: [hyLink, isServiceCancel],
  components: {
    DynamicForm,
    Authorized,
  },
  computed: {
    isEdit() {
      return [this.nodeCodeObj.WAIT_UPLOAD, this.nodeCodeObj.WAIT_AUTHORIZE].includes(this.info.currentNodeCode);
    },
  },
  filters: {
    filterDate(date = '') {
      return date.split(' ')[0];
    },
    filterKey(value, list, findKey = 'value', filterKey = 'label') {
      let temp = list.find((item) => item[findKey] === value);
      return temp ? temp[filterKey] : value;
    },
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      workOrderCommonOperator('detail', this.id).then((res) => {
        this.info = res.data;
        localStorage.workflowId = this.info.flowId || this.info.workflowId;
        this.ifCancel(res.data.status);
        if (this.info.progressBar === 2) {
          this.getRejectReason();
          this.tipsModal = true;
        }
        // 待授权状态
        if (res.data.currentNodeCode === this.nodeCodeObj.WAIT_AUTHORIZE) {
          this.fileDataReview = res.data.dataReview;
          this.moduleList = res.data.firstReview;
          this.showTabs = 'name1';
        } else {
          if (res.data.dataReview && res.data.dataReview.length) {
            this.moduleList = res.data.dataReview;
          } else {
            this.getData();
          }
        }
      });
    },
    /** 初始化字段模板 */
    getData() {
      getNodeField({
        nodeCode: this.info.currentNodeCode,
        nodeId: '',
        workFlowId: this.info.workflowId,
      })
        .then((res) => {
          this.moduleList = res.data;
        })
        .catch((err) => {
          this.$Message.error(err.message);
        });
    },
    getRejectReason() {
      latestRejectByWorkNo(this.info.workNo).then((res) => {
        this.rejectReason = res.data.reason;
      });
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
  height: auto;
}
.address-wrapper {
  background-color: #fff;
  margin: 0px 23px 20px;
  padding: 1px 32px 20px;
  .add-title {
    margin: 30px 0 20px 0;
    font-size: 18px;
    color: #333333;
  }
  .address-box {
    // margin-left: 12px;
    padding: 24px 20px;
    background-color: #f3fbff;
    .info {
      line-height: 26px;
      font-size: 16px;
      color: #666666;
      .info-title {
        min-width: 80px;
        text-align: right;
        color: rgba(0, 0, 0, 0.85);
        display: inline-block;
      }
      .info-content {
        color: #333333;
        font-weight: 600;
      }
    }
    .info-remark {
      font-size: 14px;
      font-family: PingFangSC;
      // color: #16ade9;
      margin-top: 12px;
    }
  }
  .liucheng {
    background: #ffffff;
    border-radius: 4px;
    padding: 14px 32px 32px 32px;
    text-align: center;
    .shuoming {
      text-align: left;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 24px;
    }
  }
}
.tabTitle {
  border-bottom: 1px solid #e9e9e9ff;
  padding-top: 10px;
  background-color: #fff;
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
/deep/ .ivu-select-dropdown-list {
  max-height: 200px;
}
.title {
  background-color: rgba(255, 255, 255, 1);
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid #e8e8e8;
  padding: 16px 32px 0 32px;

  .line {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 400;
  }
  .ziliao {
    margin-top: 19px;
    text-align: center;
    font-weight: 400;
    .top-reason {
      text-align: left;
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
    .guding1 {
      font-size: 12px;
      font-family: PingFangSC;
      color: #666666;
      position: absolute;
      left: 111px;
      top: 26px;
    }
    .guding2 {
      font-size: 12px;
      font-family: PingFangSC;
      color: #666666;
      position: absolute;
      left: 292px;
      top: 26px;
    }
    .guding3 {
      font-size: 12px;
      font-family: PingFangSC;
      color: #666666;
      position: absolute;
      left: 476px;
      top: 26px;
    }
    .guding4 {
      font-size: 12px;
      font-family: PingFangSC;
      color: #666666;
      position: absolute;
      left: 657px;
      top: 26px;
    }
  }
}
.container1 {
  // height: 2000px;
  padding: 24px;
  background-color: #fff;
  font-family: Source Han Sans SC;
  color: #333;
  .sub {
    text-align: center;
    margin-top: 24px;
    margin-bottom: 24px;
  }
  .xinxi {
    background: #ffffff;
    border-radius: 4px;
    padding: 24px 0 24px 32px;
    .xuanze {
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
    }

    .commen {
      margin-bottom: 24px;
      .dingwei {
        position: absolute;
        font-size: 14px;
        color: rgb(237, 64, 20);
        left: 84px;
        top: 34px;
      }
      .content-left {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }
      .content-right {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
    }
    .tishi {
      background-color: rgba(22, 173, 233, 0.19);
      font-size: 14px;
      font-family: PingFangSC;
      line-height: 26px;
      padding: 7px;
      margin-top: 10px;
      img {
        width: 18px;
        height: 18px;
        position: relative;
        top: 4px;
      }
      span {
        color: #333333;
      }
    }
  }

  .files-example {
    background: #ffffff;
    border-radius: 4px;
    padding: 24px 0 24px 32px;
    margin-top: 24px;
    .beizhu {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #1890ff;
      margin-bottom: 24px;
    }
    .xing {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #fa5555;
    }
    .dwimg {
      margin-top: 11px;
      img {
        position: relative;
        top: 4px;
      }
      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #16ade9;
      }
    }
    .shouquan {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
    .jisong {
      background: #fff1dd;
      font-size: 14px;
      font-family: PingFangSC;
      color: #333333;
      line-height: 40px;
      padding-left: 12px;
      img {
        position: relative;
        top: 4px;
      }
    }

    span {
      cursor: pointer;
    }
  }
}

.container2 {
  min-height: 685px;
  margin: 24px;
  background-color: #ffffff;
  text-align: center;
  padding: 50px;
  .success {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    margin-top: 25px;
  }
  .time {
    margin-top: 17px;
    font-size: 12px;
    font-family: PingFangSC;
    color: #333333;
  }
  .anniu {
    margin-top: 24px;
    font-size: 14px;
    font-family: PingFangSC;
    color: #16ade9;
  }
  .erweima {
    margin: 32px auto;
    width: 730px;
    background: rgba(22, 173, 233, 0.1);
    padding: 24px;
    img {
      width: 140px;
      height: 134px;
    }
    p {
      font-size: 14px;
      font-family: PingFangSC;
      color: #333333;
      margin-bottom: 12px;
    }
  }
}
.main {
  // margin: 24px;
  border-radius: 4px;
  background: #ffffff;
  padding-bottom: 32px;
  .base {
    background: rgba(24, 144, 255, 0.19);
    border-radius: 4px 4px 0px 0px;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 55px;
    padding-left: 32px;
  }
  .mt24 {
    margin-top: 24px;
    padding-left: 32px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    .left {
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
    }
    .right {
      font-weight: 500;
      color: #333333;
    }
    .file {
      font-weight: 500;
      color: #16ade9;
      cursor: pointer;
    }
  }
}
.fill-information-title {
  padding-bottom: 0;
}
</style>
