<template>
  <div class="mainContent" :style="contentStyleObj">
    <div class="title">
      <img @click="goMyBread" src="@/assets/images/common/dynamicForm/icon_fanhui2x.png" />填写【{{ rejectInfo.serviceName}}】服务资料
      <!-- <img src="@/assets/images/infoDetail/jiantou-zuo.png" alt="" />填写商标信息
      <span
        >注意：标 * 的为必填项
        <span v-if="countryCode != 'JP'">，除标注用中文的选项外其他选项都用英文填写。</span>
      </span> -->
      <span
        class="import-using-templates"
        v-if="$store.state.app.stepIndex == 2"
        @click.stop="$refs.detailsUs.templateImport()"
        >使用模板导入</span
      >
    </div>
    <detailsUs ref="detailsUs" @sendRejectInfo="sendRejectInfo"></detailsUs>
  </div>
</template>
<script>
import '@/assets/style/common.less';
import detailsUs from '@/views/common/breadInfoDetailsUS.vue';
import { updateNodeAPI } from '@/api/trademarkRegister/myBread';
export default {
  components: {
    detailsUs,
  },
  data() {
    return {
      contentStyleObj: {
        'min-height': '',
      },
      tipsModal: false,
      remark: '',
      countryCode: this.$route.query.code,
      rejectInfo: {},
    };
  },
  methods: {
    getHeight() {
      this.contentStyleObj['min-height'] = window.screen.height - 240 + 'px';
    },
    //返回我的商标
    goMyBread() {
      if (this.$route.query.form == 'work') {
        this.$router.push('/work');
      } else {
        this.$router.push({
          name: '我的商标',
        });
      }
    },
    sendRejectInfo(data) {
      this.rejectInfo = data;
    },
  },
  mounted() {
    this.getHeight();
    localStorage.setItem('orderStatus', 1);
    this.$store.dispatch('app/setStepIndex', 1);
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.app.stepIndex == 2) {
      this.$Modal.confirm({
        title: '是否保存内容后再离开？',
        content: '选择确定后，系统会保存本次您填写的内容，方便您下次继续提交',
        okText: '保存后离开',
        cancelText: '直接离开',
        onOk: () => {
          let materialData = this.$refs.detailsUs.getFormInfo();
          if (this.$refs.detailsUs.riskflag) {
            return this.$Message.warning('请填写风险小类关键词!');
          }
          updateNodeAPI(materialData).then((res) => {
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
.mainContent {
  display: inline-block;
  width: 946px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  background: #fff;
  padding: 24px;
  margin-bottom: 44px;
  .title {
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

/deep/ .upload-logo .ivu-upload {
  width: 156px;
  height: 156px;
  display: inline-block;
  cursor: pointer;
}

/deep/ .ivu-form-item-content {
  // width: 398px;
}
/deep/ .ivu-date-picker {
  width: 398px;
}
/deep/ .first-date {
  position: relative;
  .first-tip {
    position: absolute;
    padding: 12px;
    background-color: #eff9ff;
    right: -506px;
    top: 0;
    font-size: 14px;
    color: #999999;
    .orange {
      color: #ff6600;
    }
  }
}
/deep/ .ivu-form .ivu-form-item-label {
  color: #000;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
}
.width100 /deep/ .ivu-form-item-content {
  width: 100%;
}
.width156 {
  width: 156px;
  margin-right: 12px;
  display: inline-block;
}
.width156 /deep/ .ivu-form-item-content {
  width: 156px;
}

/deep/ .ivu-upload-list {
  // margin-top: 62px;
  // text-align: left;
}
/deep/ .ivu-modal-header {
  padding: 24px;
  background-color: #fff !important;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  border-radius: 4px;
}

.logo-example-modal /deep/ .ivu-modal {
  width: 360px !important;
}
/deep/ .ivu-modal-body {
  padding: 24px;
}

.inline-box /deep/ .ivu-form-item-content {
  display: inline-block;
  vertical-align: bottom;
  margin-left: 20px;
}
.tipsModal-contnet {
  font-size: 18px;
  .tip-title {
    color: #d9001b;
    margin-bottom: 18px;
  }
}
/deep/ .ivu-table-overflowX {
  overflow-x: hidden;
}
/deep/ .ivu-table-wrapper-with-border {
  border: none;
}
/deep/ .ivu-table:before {
  height: 0;
}
/deep/ .ivu-table-border:after {
  width: 0;
}
.import-using-templates {
  float: right;
  cursor: pointer;
  font-size: 14px;
  color: #016eff;
  margin-left: 12px;
}
</style>
