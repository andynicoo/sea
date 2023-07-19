<template>
  <div class="mainContent" :style="contentStyleObj">
    <div class="my-card">
      <!-- {{ rejectInfo }} 显示固定的驳回原因 -->
      <!-- <div class="rejectinfo" v-if="rejectInfo.progressBar === 2 && rejectInfo.rejectReason">
        <h2><Icon type="md-alert" style="color:#E34D59;" />驳回原因</h2>
        <p>{{ rejectInfo.rejectReason }}</p>
      </div> -->
      <div class="title">
        <img @click="goMyBread" src="@/assets/images/common/dynamicForm/icon_fanhui2x.png" />填写【{{
          $route.query.countryNameZh || '美国'
        }}外观专利】服务资料
        <span
          class="import-using-templates"
          v-if="$store.state.app.stepIndex == 2"
          @click.stop="$refs.dynamicForm.importTemplatesModal = true"
          >使用模板导入</span
        >
      </div>
      <DynamicForm
        ref="dynamicForm"
        :moduleList="dataReview"
        @formsubmit="formsubmit"
        @formSave="formSave"
        :showSubmit="true"
        :showSave="true"
        :serviceNo="serviceInfo.serviceNo"
        :rejectInfo="rejectInfo.rejectReason"
        :serviceInfo="serviceInfo"
        formValueLabel="reView"
      />
    </div>
  </div>
</template>

<script>
import '@/assets/style/common.less';
import { getPatentDetail, submitInfo, saveInfo } from '@/api/myPatent';
import DynamicForm from '@/components/DynamicForm/dynamicForm'; // 表单配置
export default {
  components: {
    DynamicForm,
  },
  data() {
    return {
      moduleList: [],
      serviceId: this.$route.params.id,
      serviceInfo: {},
      isEdit: true,
      rejectInfo: {
        // 判定是否被驳回
        rejectReason: '',
        progressBar: 0,
      },
      contentStyleObj: {
        'min-height': '',
      },
    };
  },
  mounted() {
    this.$store.dispatch('app/setStepIndex', 1);
    this.getDetail();
  },
  computed: {
    dataReview() {
      this.moduleList.forEach((pro) => {
        pro.columns.forEach((item, i) => {
          if (!item.hasOwnProperty('disabled')) {
            this.$set(item, 'disabled', !this.isEdit);
          } else {
            item.disabled = !this.isEdit;
          }
          let hiddenList = [];
          switch (this.serviceInfo.modelingDrawType) {
            // 1仅建模，隐藏建模，是建模后再绘图，包含建模绘图
            // 3建模绘图，隐藏建模和绘图
            case 1:
            case 3:
              hiddenList = ['modelingFile', 'drawingFile'];
              break;
            case 2:
              // 仅绘图，隐藏绘图
              hiddenList = ['drawingFile'];
              break;
            default:
              hiddenList = ['productProtection', 'modelingFile'];
              // 0:无建模绘图，隐藏
              break;
          }
          if (hiddenList.includes(item.keyName)) {
            item.inputType = 'hidden';
          }
        });
      });
      return this.moduleList;
    },
  },
  methods: {
    getHeight() {
      this.contentStyleObj['min-height'] = window.screen.height - 240 + 'px';
    },
    //返回我的商标
    goMyBread() {
      this.$router.push({
        name: '我的专利',
      });
    },
    // 详情
    getDetail() {
      getPatentDetail(this.serviceId).then((res) => {
        if (res.code === 0) {
          console.log(res.data);
          this.serviceInfo = res.data.serviceInfo;
          localStorage.workflowId = this.serviceInfo.workflowId;
          this.rejectInfo.progressBar = res.data.serviceInfo.progressBar;
          this.rejectInfo.rejectReason = res.data.designPatentWorkOrder.rejectReason;
        }
        if (res.data.dataReview.length) {
          this.moduleList = res.data.dataReview;
        }
      });
    },
    // 提交信息
    formsubmit(info) {
      submitInfo({
        materialData: info,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          localStorage.backPath = '/myPatent';
          this.$router.push('/submittedSucceeded');
          // this.$router.push({
          //   path: `/myPatent/succeed/${this.serviceId}`,
          // });
        }
      });
    },
    // 保存信息
    formSave(info, next) {
      saveInfo({
        materialData: info,
        serviceId: this.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$Message.success('保存成功');
          if (next) {
            this.$refs.dynamicForm.stepsIndex = 3;
            this.$store.dispatch('app/setStepIndex', 3);
          }
        }
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
          saveInfo({
            materialData: materialData,
            serviceId: this.serviceId,
          }).then((res) => {
            if (res.code === 0) {
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
.mainContent {
  display: inline-block;
  width: 946px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  .my-card {
    padding: 0;
    .title {
      margin: 20px;
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      border-bottom: 1px solid #ebebeb;
      padding-bottom: 16px;
      img {
        vertical-align: middle;
        margin-top: -6px;
        cursor: pointer;
        width: 24px;
        margin-right: 16px;
      }
    }
  }
}
.import-using-templates {
  float: right;
  cursor: pointer;
  font-size: 14px;
  color: #016eff;
  margin-left: 12px;
}
</style>
