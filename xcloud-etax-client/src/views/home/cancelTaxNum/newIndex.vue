<template>
  <div>
    <div class="headContent">
      <div class="fill-information-title">
        <img @click="$router.push('/myVantService')" src="@/assets/images/common/dynamicForm/icon_fanhui2x.png" /><span
          v-if="$store.state.app.stepIndex != 3"
          >填写</span
        >【{{ $route.query.countryNameZh }}税号注销】服务资料
        <span
          class="import-using-templates"
          v-if="$store.state.app.stepIndex == 2"
          @click="$refs.dynamicForm.importTemplatesModal = true"
          ><img src="@/assets/images/common/downloadIcon.png" />使用模板导入</span
        >
      </div>
    </div>
    <div class="container">
      <div>
        <p class="top-title">
          <!-- {{ info.currentNodeCode | filterKey(currentCodeList) }} -->
          <a
            v-if="info.currentNodeCode === nodeCodeObj.COMPLETE"
            :href="info.receiptFile"
            target="_blank"
            style="color: #18bdff; font-size: 14px; margin-left: 20px; cursor: pointer; font-weight: 500"
          >
            (
            <img
              src="@/assets/images/survey/receiptFile.svg"
              alt
              style="width: 14px; position: relative; top: 3px; margin-right: 2px; margin-left: 3px"
            />
            点击查看注销回执 )
          </a>
        </p>
        <div class="top-tips">
          <p class="tips-top-title">
            <img src="@/assets/images/common/yellowTip.png" alt="" />
            注销税号前提说明，请知悉：
          </p>
          <div class="bottom-tips">
            <p>1.请确保无漏申报（含年报，无年报国家请忽略）；</p>
            <p>2.请确保申报过的金额已经如数缴纳至税局；</p>
            <p>3.请确保收到过的税局信件（含罚金文件）已经全部处理完毕；</p>
            <p class="last-tip">如因以上原因导致税号注销不成功，我司不承担相应责任</p>
          </div>
        </div>
        <div class="reject-box" v-if="info.progressBar === 2">
          <img src="@/assets/images/common/yellowTip.png" alt="" />注销税号资料被驳回（原因：
          <span class="reason">{{ rejectReason }}</span
          >）
        </div>
        <div class="tabTitle" v-if="info.currentNodeCode === currentCodeEnum.NODE5">
          <Tabs v-model="showTabs">
            <TabPane label="注销资料" name="name1"></TabPane>
            <TabPane label="待授权资料" name="name2"></TabPane>
          </Tabs>
        </div>
      </div>
      <DynamicForm
        v-show="showTabs === 'name1'"
        ref="dynamicForm"
        :moduleList="dataReview"
        @formsubmit="getInfo"
        :isCancel="isCancel"
        :showSubmit="isEdit"
        :showSave="true"
        logoutTaxNum
        :logoutTaxNumCountry="info.countryNameZh"
        :workOrderId="id"
        :workInfo="info"
        :tabsCurrent="2"
      />
      <Authorized
        v-show="showTabs === 'name2'"
        :isCancel="isCancel"
        :fileDataReview="fileDataReview"
        :serviceInfo="info"
        :showAuthorizeFile="info.currentNodeCode === currentCodeEnum.NODE5"
      ></Authorized>
    </div>
  </div>
</template>
<script>
import DynamicForm from '@/components/DynamicForm/dynamicForm'; //表单配置
import Authorized from '@/components/Authorized/index'; //待授权上传证书组件
import { latestRejectByWorkNo } from '@/api/taxRegister.js';
import { getNodeField } from '@/api/taxRegister.js';
import mixin from '@/views/home/mixin';
import vatLink from '@/views/home/mixin/vatLink';
import isServiceCancel from '@/views/home/mixin/isServiceCancel';
import { currentCodeList, currentCodeEnum } from '@/views/userManage/setting/staticList.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator.js';
import { materialStash, getMaterialStash } from '@/api/commonOperator.js';
export default {
  data() {
    return {
      id: this.$route.query.id,
      countryCode: this.$route.query.countryCode,
      serviceNo: this.$route.query.serviceNo,
      rejectReason: '',
      info: {},
      moduleList: [],
      showTabs: 'name1',
      fileDataReview: [],
      nodeCodeObj: {
        WAIT_UPLOAD: currentCodeEnum.NODE2, //待上传
        WAIT_AUDIT: currentCodeEnum.NODE3, // 待审核
        AUDITED: currentCodeEnum.NODE4, // 已审核
        WAIT_AUTHORIZE: currentCodeEnum.NODE5, // 待授权
        WAIT_AUDIT_AUTHORIZE: currentCodeEnum.NODE6, // 待审核授权
        LOGOUT: currentCodeEnum.NODE7, // 注销中
        COMPLETE: currentCodeEnum.NODE8, // 已完成
      },
      currentCodeList,
      currentCodeEnum,
    };
  },
  components: {
    DynamicForm,
    Authorized,
  },
  mixins: [mixin, vatLink, isServiceCancel],
  computed: {
    isEdit() {
      return [this.nodeCodeObj.WAIT_UPLOAD, this.nodeCodeObj.WAIT_AUTHORIZE].includes(this.info.currentNodeCode);
    },
  },
  filters: {
    filterKey(value, list, findKey = 'value', filterKey = 'label') {
      let temp = list.find((item) => item[findKey] === value);
      return temp ? temp[filterKey] : value;
    },
  },
  mounted() {
    this.init();
    this.$store.dispatch('app/setStepIndex', 1);
  },
  methods: {
    async init() {
      await this.getCountryList();
      this.getInfo();
    },
    getInfo() {
      workOrderCommonOperator('detail', this.id).then((res) => {
        this.info = res.data;
        localStorage.workflowId = this.info.flowId || this.info.workflowId;
        console.log(res.data.currentNodeCode, currentCodeEnum.NODE5, 888);
        this.ifCancel(res.data.status);
        if (this.info.progressBar === 2) {
          this.getRejectReason();
        }
        if (res.data.currentNodeCode === currentCodeEnum.NODE5) {
          this.fileDataReview = res.data.dataReview;
          this.moduleList = res.data.firstReview;
          this.showTabs = 'name2';
        } else {
          if ([currentCodeEnum.NODE4, currentCodeEnum.NODE6].includes(res.data.currentNodeCode)) {
            this.moduleList = res.data.firstReview;
          } else {
            if (res.data.dataReview.length) {
              this.moduleList = res.data.dataReview;
            } else {
              this.getData();
            }
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
.headContent {
  background: #ffffff;
  padding: 1px 24px 0px;
  border-bottom: 1px solid #f0f0f0;
}
.formCreate {
  margin: 20px 0 0;
  padding: 0;
  ::v-deep.form-create {
    .ivu-col {
      padding-left: 0;
    }
  }
}
.container {
  background-color: #fff;
  color: rgba(51, 51, 51, 1);
  font-family: 'Microsoft Yahei', 'PingFangSC-Semibold,PingFang SC';
  padding: 24px;
  .top-title {
    font-size: 24px;
    font-weight: 600;
  }
  .top-tips {
    background-color: #d0effb;
    padding: 12px 20px;
    .tips-top-title {
      font-size: 14px;
      font-family: 'Microsoft Yahei', 'PingFangSC-Regular,PingFang SC';
      color: #16ade9;
      img {
        vertical-align: middle;
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
  .reject-box {
    margin-top: 16px;
    padding: 10px 20px;
    background-color: #fff1dd;
    img {
      vertical-align: middle;
    }
    .reason {
      color: #fa5555;
    }
  }
  .tab-box {
    margin-top: 28px;
    border-bottom: 1px solid #dddddd;
    margin-bottom: 24px;
    span {
      display: inline-block;
      font-size: 16px;
      margin-right: 36px;
      color: #333333;
      cursor: pointer;
    }
    .active-tab {
      border-radius: 10px 10px 0 0;
      background-color: #16ade9;
      color: #fff;
      padding: 8px 24px;
    }
  }
  .tab-title {
    padding: 11px 24px;
    background-color: #d0effb;
    font-size: 18px;
    font-weight: 600;
    margin: 24px 0;
    .title-tip {
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }
  }
}

.requiredItem {
  /deep/ .ivu-form-item-label::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: 'Microsoft Yahei', SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
.fl {
  margin-right: 32px;
  min-height: 172px;
  .requiredItem::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: 'Microsoft Yahei', SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
// /deep/ .ivu-upload {
//   width: 200px;
//   height: 124px;
//   background: rgba(244, 245, 246, 1);
//   border-radius: 2px;
//   margin-top: 12px;
//   text-align: center;
//   cursor: pointer;
//   .inner {
//     color: #999;
//   }
//   img {
//     width: 50px;
//     height: 50px;
//     margin: 22px 75px 0 75px;
//   }
// }
.file-box {
  padding-left: 50px;
}
.out-img-box {
  margin-top: 12px;
  width: 200px;
  .img-box {
    width: 200px;
    height: 124px;
    overflow: hidden;
    border: 1px dashed #dcdee2;
    position: relative;
    text-align: center;
    z-index: 11;
    background: #fff;
    button {
      width: 0px;
      padding: 0px;
      border: none;
      position: absolute;
      top: -13px;
      height: 0px;
      z-index: 1;
      img.closeImg {
        position: absolute;
        width: 26px;
        height: 26px;
        top: 16px;
        right: -174px;
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
    .deletBtn {
      left: auto;
      display: none;
    }
  }
  .img-box:hover .deletBtn {
    display: block;
  }
  .corres-name {
    width: 100%;
  }
  .show-pdf {
    display: inline-block;
    color: #313233;
    font-size: 16px;
    margin-top: 24px;
  }
}
</style>
