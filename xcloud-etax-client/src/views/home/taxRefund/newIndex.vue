<template>
  <div class="clearfix">
    <div class="header top headContent">
      <!-- <div class="bottom" style="padding-bottom: 16px">
        {{ info.currentNodeCode == currentCodeEnum.NODE2 ? '待上传资料' : '退税' }}
        <span>({{ info.countryNameZh }} VAT退税)</span>
      </div> -->
      <div class="fill-information-title">
        <img @click="$router.push('/myVantService')" src="@/assets/images/common/dynamicForm/icon_fanhui2x.png" /><span
          v-if="$store.state.app.stepIndex != 3"
          >填写</span
        >【{{ info.countryNameZh }}VAT退税】服务资料
        <span
          class="import-using-templates"
          v-if="$store.state.app.stepIndex == 2"
          @click="$refs.dynamicForm.importTemplatesModal = true"
          ><img src="@/assets/images/common/downloadIcon.png" />使用模板导入</span
        >
      </div>
      <div class="statusIndfContent">
        <!-- 详情下的状态显示 -->
        <div class="statusContent">
          <div class="statusItem">
            <process-info
              v-if="info.currentNodeCode != currentCodeEnum.NODE2"
              :processInfo="processInfo"
            ></process-info>
          </div>
        </div>
        <!-- 详情下的提示错误 -->
        <!-- 资料被驳回的原因 -->
        <div class="rejected" v-if="info.progressBar == 2">
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
      <!-- 多个标签切换 -->
      <div class="tabTitle" v-if="info.currentNodeCode != currentCodeEnum.NODE2">
        <span class="active-tab" @click="pageType = 1">税号信息</span>
      </div>
    </div>

    <div class="container">
      <DynamicForm
        ref="dynamicForm"
        :moduleList="dataReview"
        @formsubmit="getInfo"
        @formSave="getInfo"
        :isCancel="isCancel"
        :showSubmit="isEdit"
        :showSave="isEdit"
        taxInspection
        :taxInspectionCountry="info.countryNameZh"
        :workOrderId="id"
        :workInfo="info"
      />
    </div>

    <!-- 温馨提示 -->
    <!-- <Modal v-model="tipsModal">
      <div class="tipsModal-title">温馨提示</div>
      <Divider style="margin: 16px 0" />
      <div class="tipsModal-contnet">
        <p class="tip-title">您的资料审核未通过，请按照以下指引修改...</p>
        <p>{{ reson }}</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="tipsModal = false">知道了</Button>
      </div>
    </Modal> -->
  </div>
</template>

<script>
import DynamicForm from '@/components/DynamicForm/dynamicForm'; //表单配置
import { getTaxRefundInfo, getNodeField, submitInfo, saveInfo, latestRejectByWorkNo } from '@/api/taxRegister.js';
import ProcessInfo from './components/ProcessInfo.vue';
import mixin from '@/views/home/mixin';
import vatLink from '@/views/home/mixin/vatLink';
import isServiceCancel from '@/views/home/mixin/isServiceCancel';
import { currentCodeList, currentCodeEnum } from '@/views/userManage/setting/staticList.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator.js';
export default {
  data() {
    return {
      id: this.$route.query.id,
      countryCode: this.$route.query.countryCode,
      info: {},
      moduleList: [],
      nodeCodeObj: {
        WAIT_UPLOAD: currentCodeEnum.NODE2, //待上传
        PENDING: currentCodeEnum.NODE3, // 待审核
        PROCESSING: currentCodeEnum.NODE7, // 退税中
        COMPLETE: currentCodeEnum.NODE8, // 退税完成
      },
      pageType: 0,
      // 进度信息
      processInfo: {
        countryCode: this.$route.query.countryCode,
        status: this.$route.query.currentNodeCode,
        progressBar: this.$route.query.progressBar,
        checkPassTime: '',
      },
      // tipsModal: false,
      reson: '', //驳回原因
      currentCodeList,
      currentCodeEnum,
    };
  },
  components: {
    DynamicForm,
    ProcessInfo,
  },
  mixins: [mixin, vatLink, isServiceCancel],
  computed: {
    isEdit() {
      return this.info.currentNodeCode === this.nodeCodeObj.WAIT_UPLOAD;
    },
  },
  mounted() {
    this.init();
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
        this.ifCancel(res.data.status);
        if (this.info.auditPassTime) {
          let time = this.info.auditPassTime.split(' ')[0];
          var d = new Date(time);
          d.setMonth(d.getMonth() + 3);
          this.processInfo.checkPassTime = d.toLocaleDateString();
        }

        this.processInfo.progressBar = this.info.progressBar;
        // 资料驳回提示
        if (res.data.progressBar == 2) {
          this.getlatestReject();
          // this.tipsModal = true;
        }
        if (res.data.dataReview && res.data.dataReview.length) {
          this.moduleList = res.data.dataReview;
        } else {
          this.getData();
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
          this.$message.error(err.message);
        });
    },
    getlatestReject() {
      latestRejectByWorkNo(this.info.workNo)
        .then((res) => {
          this.reson = res.data.reason;
        })
        .catch((err) => {
          this.$Message.error(err.message);
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
}
.headContent {
  background: #ffffff;
  box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
  padding: 20px 32px 0px;
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
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
    & /deep/ .ivu-steps-content {
      text-align: center;
      padding-left: 70px;
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
</style>
