<template>
  <div class="clearfix container">
    <div class="headContent">
      <div class="bottom" style="padding-bottom: 16px" v-if="status == 80">
        待上传资料<span>({{ countryNameZh }} VAT退税)</span>
      </div>
      <div class="bottom" style="padding-bottom: 32px" v-else>
        退税 <span>({{ countryNameZh }} VAT退税)</span>
      </div>
      <div class="statusIndfContent">
        <!-- 详情下的状态显示 -->
        <div class="statusContent">
          <div class="statusItem">
            <process-info v-if="status != 80" :processInfo="processInfo"></process-info>
          </div>
        </div>
        <!-- 详情下的提示错误 -->
        <div class="rejected" v-if="status == 83">
          <div class="top-tips">
            <!-- 资料被驳回的原因 -->
            <p class="tips-top-title" v-if="processInfo.status == 83 && processInfo.rejectReason">
              <img src="@/assets/images/common/yellowTip.png" alt="" />
              注册税号资料被驳回（原因：<span>{{ processInfo.rejectReason }}</span> )
            </p>
          </div>
        </div>
      </div>
      <!-- 多个标签切换 -->
      <div class="tabTitle" v-if="status != 80">
        <span class="active-tab" @click="pageType = 1">税号信息</span>
      </div>
    </div>

    <!-- 不同国家的退税页面组件 -->
    <div class="contentContainer">
      <!-- 英国VAT退税 -->
      <GbRefund
        v-if="countryCode == 'GB'"
        :status="status"
        :servicesId="servicesId"
        :supplierId="supplierId"
        :countryCode="countryCode"
        :countryNameZh="countryNameZh"
        :productFunctionCode="productFunctionCode"
      />
    </div>

    <!-- 温馨提示 -->
    <Modal v-model="tipsModal">
      <div class="tipsModal-title">温馨提示</div>
      <Divider style="margin: 16px 0" />
      <div class="tipsModal-contnet">
        <p class="tip-title">您的资料审核未通过，请按照以下指引修改...</p>
        <p>{{ processInfo.rejectReason }}</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="tipsModal = false">知道了</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import GbRefund from "./components/GbRefund.vue";
import { refundDetail } from "@/api/taxRefund/gbRefund";
import ProcessInfo from "./components/ProcessInfo.vue";
export default {
  components: { ProcessInfo, GbRefund },
  data() {
    return {
      status: this.$route.query.status,
      servicesId: this.$route.query.servicesId,
      supplierId: this.$route.query.supplierId,
      countryCode: this.$route.query.countryCode,
      countryNameZh: this.$route.query.countryNameZh,
      productFunctionCode: this.$route.query.productFunctionCode,

      // 进度信息
      processInfo: {
        countryCode: this.$route.query.countryCode,
        status: this.$route.query.status,
      },
      pageType: 0,

      // 资料驳回提示
      tipsModal: false,
    };
  },
  created() {
    this.queryStatusDetail();
  },
  methods: {
    queryStatusDetail() {
      refundDetail({ serviceId: this.servicesId }).then((res) => {
        if (res.code == 0) {
          this.processInfo = { ...this.processInfo, ...res.data };

          // 资料驳回提示
          if (this.processInfo.status == 83 && this.processInfo.rejectReason) {
            this.tipsModal = true;
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
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
.container {
  min-height: calc(100vh - 60px);
  padding-bottom: 56px;
  box-sizing: border-box;
  position: relative;

  min-width: 1024px;
  margin-bottom: 0px;
  .headContent {
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px 0px;
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
      font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
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
      .statusContent {
        margin: 20px 0px;
      }
      .rejected {
        padding: 10px 40px;
        background: #fff1dd;
        .tips-top-title {
          font-size: 14px;
          font-family: "PingFangSC-Regular,PingFang SC";
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
  .contentContainer {
    margin: 24px;
  }
  .vatInfoContent {
    margin: 24px;
    .top {
      background: #d7eefa;
      padding: 16px 32px;
      display: flex;
      align-items: baseline;
      .left {
        img {
          float: left;
          margin-right: 4px;
        }
      }
      .right {
        line-height: 22px;
        span {
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          color: #1890ff;
        }
      }
    }
    .vatInfo {
      text-align: left;

      background: #ffffff;
      padding: 14px 24px 24px 24px;
      color: #333333;
      .leftName {
        width: 123px;
        display: inline-block;
        text-align: right;
        padding-right: 16px;
        position: relative;
        .tips-icon {
          img {
            width: 15px;
            height: 15px;
            cursor: pointer;
          }
        }
        /deep/ .ivu-tooltip-inner {
          width: 300px !important;
        }
      }
      .rightContent {
        font-family: PingFangSC-Medium, Microsoft YaHei, PingFang SC sans-serif;
        font-weight: 500;
      }
      .vat-file {
        color: #16ade9;
      }
      .tipred {
        color: red;
        cursor: pointer;
      }
      /deep/ .ivu-row {
        margin-left: 0px;
      }
      /deep/ .ivu-col-span-8 {
        margin-top: 10px;
      }
    }
  }

  .infoTip {
    background-color: #ffff;
    padding: 20px 32px 20px;
    // margin-bottom: 15px;
    font-size: 22px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    margin-left: -24px;
    margin-top: -24px;
    margin-bottom: 24px;
    span.smallTitle {
      font-size: 17px;
      font-family: PingFangSC;
      color: rgba(102, 102, 102, 1);
      line-height: 20px;
      margin-left: 10px;
    }
    span {
      margin-left: 15px;
      font-size: 14px;
      color: #313233;
      font-weight: 400;
    }
  }
  // .infoTip::before{
  //   content: '';
  //   display: inline-block;
  //   width:2px;
  //   height:14px;
  //   background:rgba(22,173,233,1);
  //   margin-right: 8px;
  // }
  .stepH {
    background-color: #fff;
    padding: 0 24px;

    .redTip::before {
      content: "*";
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 14px;
      color: #ed4014;
    }
    .tips-icon {
      width: 17px;
      height: 17px;
      border: 1px solid rgba(237, 62, 62, 1);
      border-radius: 50%;
      display: inline-block;
      line-height: 17px;
      text-align: center;
      color: #ed3e3e;
      cursor: pointer;
    }
  }
  .fileContainer {
    .fl {
      float: none;
    }
    .file-box {
      padding-left: 50px;
      .file-type-name {
        text-align: left !important;
      }
      .file-box-inner {
        display: flex;
        .file-wrapper {
          margin-right: 0px;
          .imgBox {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border: 1px dashed #dcdee2;
            position: relative;
            text-align: center;
            z-index: 11;
            background: #fff;
            .deletBtn {
              left: 50%;
              transform: translateX(-50%);
              width: 0px;
              padding: 0px;
              border: none;
              img {
                position: absolute;
                width: 26px;
                height: 26px;
                top: -70px;
                right: -88px;
              }
            }
          }
          .file-item {
            width: 200px;
            height: 124px;
            background: rgba(244, 245, 246, 1);
            border-radius: 2px;
            position: relative;
            margin-right: 10px;
            .ivu-upload {
              width: 100%;
              height: 100%;
              .ivu-upload-drag {
                height: 100%;
              }
              .inner {
                width: 100%;
                height: 100%;
                background: #f4f5f6;
                margin: auto;
                display: flex;
                align-items: center;
                justify-content: center;
                .main-text {
                  display: none;
                }
                img {
                  width: 50px;
                  // margin-bottom: 14px;
                }
              }
            }
            .file-wrapper-title {
              position: absolute;
              bottom: 0px;
              width: 100%;
              font-size: 14px;
              font-family: PingFangSC;
              color: rgba(153, 153, 153, 1);
              line-height: 32px;
              z-index: 1;
            }
          }
          .explame-out {
            margin-top: 10px;
            display: block;
            text-align: center;
            .uplad-symbol {
              width: 16px;
              height: 16px;
            }
          }
          .example-btn {
            margin-top: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 16px;
            }
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    /deep/ .otherFile-box-inner {
      display: flex;
      flex-wrap: wrap;
      .stepH {
        padding: 0px;
      }
      .file-name {
        text-align: left;
      }
      .other-file-box {
        .file-item {
          width: 200px;
          height: 124px;
          background: rgba(244, 245, 246, 1);
          border-radius: 2px;
          position: relative;
          margin-right: 10px;
          .file-name {
            text-align: left;
          }
          .imgBox {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border: 1px dashed #dcdee2;
            position: relative;
            text-align: center;
            z-index: 11;
            background: #fff;
            img {
              width: 100%;
              height: 100%;
            }
            .deletBtn {
              left: 50%;
              transform: translateX(-50%);
              width: 0px;
              padding: 0px;
              border: none;
              position: absolute;
              img {
                position: absolute;
                width: 26px;
                height: 26px;
                top: 5px;
                right: -92px;
                display: none;
              }
            }
            .uploadItem {
              width: 100%;
              height: 100%;
              margin-top: -14px;
            }
            .show-pdf {
              display: inline-block;
              color: #313233;
              font-size: 16px;
              margin-top: 26px;
            }
          }
          .upload-box {
            width: 100%;
            height: 100%;
            padding: 0;
            .ivu-upload-drag {
              height: 100%;
              width: 100%;
              background: #f4f5f6;
              border: none;
            }
            .inner {
              width: 100%;
              height: 100%;
              background: #f4f5f6;
              margin: auto;
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              -webkit-box-pack: center;
              -ms-flex-pack: center;
              justify-content: center;
              .main-text {
                display: none;
              }
              .uplad-symbol {
                width: 50px;
                height: 50px;
                margin-bottom: 14px;
              }
            }
          }
          .file-wrapper-title {
            position: absolute;
            bottom: 0px;
            width: 100%;
            font-size: 14px;
            font-family: PingFangSC;
            color: rgba(153, 153, 153, 1);
            line-height: 14px;
            z-index: 1;
            left: 0px;
            height: 32px;
            text-align: center;
          }
          .imgBox:hover img {
            display: block;
          }
        }
        .tips-box {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
          text-align: center;
          margin-bottom: 10px;
          img {
            width: 16px;
          }
        }
        .other-file-url-box {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: center;
          align-items: center;
          position: relative;
          text-align: center;
          a {
            font-size: 16px;
          }
          .close-img {
            position: absolute;
            width: 26px;
            height: 26px;
            top: 5px;
            right: 5px;
            z-index: 11;
          }
        }
        .other-file-url-box:hover a {
          color: #16ade9;
        }
        .other-file-url-box:hover .close-img {
          display: block;
        }
      }
    }
    .expand {
      text-align: left !important;
    }
  }
  .other-file-box {
    .file-name {
      display: inline-block;
      vertical-align: super;
      min-width: 210px;
      text-align: right;
      color: #666;
    }
    .upload-box {
      display: inline-block;
      width: 50%;
      text-align: left;
      padding: 10px 0;
      .inner {
        text-align: left;
        font-size: 12px;
        padding-left: 12px;
        img {
          width: 14px;
        }
        span {
          color: #16ade9;
        }
      }
    }
    /deep/ .ivu-upload-drag {
      padding: 6px 0;
      border: 1px solid #e6e6e6;
      font-size: 12px;
    }
    .other-file-url-box {
      display: inline-block;
      width: 50%;
      text-align: left;
      padding: 6px 0 6px 12px;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      position: relative;
      img {
        width: 12px;
      }
      a {
        color: #333;
      }
      .close-img {
        width: 9px;
        display: none;
        position: absolute;
        right: 15px;
        top: 10px;
        cursor: pointer;
      }
    }
    .other-file-url-box:hover a {
      color: #16ade9;
    }
    .other-file-url-box:hover .close-img {
      display: block;
    }
  }
  & .step-wrapper {
    box-sizing: border-box;
    width: 80%;
    position: absolute;
    left: 50%;
    transform: translate(-40%, 0);
    & /deep/ .ivu-steps-item {
      // text-align: center;
      line-height: 44px;
    }
    & /deep/ .ivu-steps-horizontal .ivu-steps-item .ivu-steps-head {
      padding-left: 18px;
    }
    & /deep/ .ivu-steps-content {
      color: #9a9ca1;
      padding-left: 0px;
      font-size: 14px;
    }
    & /deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-content,
    & /deep/ .ivu-steps-item.ivu-steps-status-finish .ivu-steps-content {
      color: #626466;
    }
    & /deep/ .ivu-steps-head-inner {
      width: 44px;
      height: 44px;
      & span {
        line-height: 44px;
      }
    }
    & /deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner,
    & /deep/ .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner {
      background: #16ade9;
      border-color: #16ade9;
    }
    & /deep/ .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner span,
    & /deep/ .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner > .ivu-steps-icon {
      color: #fff;
    }
    & /deep/ .ivu-steps-horizontal .ivu-steps-title:after {
      background: #dedfe0;
      height: 2px;
    }
    & /deep/ .ivu-steps-horizontal .ivu-steps-status-finish .ivu-steps-title:after {
      background: #16ade9;
    }
  }
  & .line {
    border: 1px solid #f5f5f5;
    margin-top: 120px;
    margin-bottom: 50px;
  }

  & .write-info {
    position: relative;
    & .wrapper {
      margin: 0 auto;
      width: 100%;
      // padding-bottom: 20px;
      background-color: #fff;

      & .title {
        color: #313233;
        font-size: 14px;
        margin-bottom: 28px;
        font-weight: 700;
        color: #333;
        height: 40px;
        background: rgba(22, 173, 233, 0.2);
        line-height: 40px;
        padding-left: 20px;
      }
      .file-title {
        text-align: left;
        margin-left: 0;
        height: 40px;
        background: rgba(22, 173, 233, 0.2);
        line-height: 40px;
        padding-left: 20px;
      }
      .inputH {
        .tips-box {
          vertical-align: super;
          color: #16ade9;
        }
      }
      /deep/ .inputHFlex {
        display: flex;
        flex-wrap: wrap;
        .form-item {
          width: 50%;
        }
      }
      /deep/ .registerClass {
        .form-item {
          input,
          .ivu-date-picker,
          .ivu-select {
            width: 340px;
          }
          .label {
            width: 147px;
            white-space: normal;
            padding-bottom: 0px;
            @media (min-width: 1920px) {
              width: 300px !important;
            }
          }
          .companyAddress {
            width: 342px;
            margin-left: 3px;
          }
          .ivu-input-wrapper {
            // width: 340px;
            textarea.ivu-input {
              margin-left: 148px;
              width: 350px;
            }
          }
          .companyEn {
            textarea.ivu-input {
              @media (min-width: 1920px) {
                margin-left: 300px !important;
              }
            }
          }
          .beizhu {
            margin-left: 143px;
            margin-top: 10px;
            font-size: 14px;
            color: #ed3e3e;
          }
          & > div {
            display: flex;
            align-items: center;
          }
          .doubleInput {
            display: block;
          }
        }
        .form-item:nth-child(2n) {
          // .label {
          //   width: 180px;
          // }
          .ivu-input-wrapper {
            textarea.ivu-input {
              // margin-left: 180px;
            }
          }
          .bank-info {
            textarea.ivu-input {
              margin-left: 0px;
            }
          }
        }
      }
      // /deep/ .shopClass {
      //   .form-item {
      //     .label {
      //       width: 195px;
      //       white-space: normal;
      //     }
      //   }
      //   .form-item:nth-child(2n) {
      //     .label {
      //       width: 210px;
      //     }
      //   }
      // }
      & .form-item {
        padding-bottom: 20px;
        position: relative;
        & .label {
          color: #666666;
          font-size: 14px;
          font-weight: 500;
          line-height: 18px;
          display: inline-block;
          // min-width: 248px;
          padding-bottom: 10px;
          white-space: nowrap;
          text-align: right;
          padding-right: 24px;
          width: 190px;
        }
        & .file {
          width: 172px;
        }
        & input {
          width: 400px;
          font-size: 14px;
          border: 1px solid #dadada;
          text-indent: 8px;
          height: 34px;
        }
        & input::-webkit-input-placeholder {
          color: #c6c8cc;
        }

        & .ivu-select {
          height: 38px;
          width: 400px;
          height: 34px;
          text-align: left;
          & /deep/ .ivu-select-selection {
            height: 38px;
            border-radius: 0px;
            border-color: #dadada;
            & .ivu-select-placeholder,
            & .ivu-select-selected-value {
              height: 38px;
              line-height: 38px;
              font-size: 14px;
            }
            & .ivu-tag {
              height: 30px;
              line-height: 30px;
            }
          }
        }

        & .ivu-radio-group {
          line-height: 20px;
          text-align: left;
          width: 402px;
        }

        & .ivu-date-picker {
          height: 34px;
          width: 400px;
          & /deep/ .ivu-date-picker-rel {
            // height: 34px;
            & .ivu-input-wrapper {
              // height: 34px;
              & input {
                height: 34px;
                line-height: 34px;
                font-size: 14px;
                border-radius: 0px;
                border-color: #dadada;
              }
            }
          }
        }
      }

      & .expand {
        margin: 20px 0;
        font-size: 16px;
        font-family: "Noto Sans S Chinese";
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        max-width: 350px;
        text-align: right;
        color: #666666;
        font-weight: bold;
      }
      & .file-box {
        margin-bottom: 26px;
        .file-type-name {
          font-size: 14px;
          color: #666;
          min-width: 248px;
          text-align: right;
          min-height: 1px;
          margin-bottom: 10px;
        }
      }
      & .subTitle {
        font-size: 14px;
        font-family: "Noto Sans S Chinese";
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 18px;
        margin-bottom: 20px;
      }
      & .file-wrapper {
        margin-right: 10px;
        .out-box {
          display: inline-block;
        }
        .explame-out {
          display: inline-block;
          margin-top: 88px;
          margin-left: 8px;
          a {
            color: #16ade9;
          }
        }
        .explame {
          color: #16ade9;
          margin-left: 8px;
          cursor: pointer;
          font-size: 12px;
          vertical-align: bottom;
        }

        & .file-wrapper-title {
          text-align: center;
          width: 100%;
          color: #333;
          font-size: 12px;
          display: block;
          margin-top: 10px;
          height: 32px;
        }
        & img {
          width: 100%;
          height: auto;
        }
        & .ivu-upload {
          width: 104px;
          & /deep/ .ivu-upload-drag {
            border: none;
            height: 100%;
            background: rgba(244, 245, 246, 1);
            &:hover {
              border: none;
            }
            & .inner {
              margin-top: 26px;
              & .uplad-symbol {
                width: 24px;
                height: auto;
              }
              & .main-text {
                color: #16ade9;
                font-size: 12px;
              }
            }
          }

          & /deep/ .ivu-upload-list {
            text-align: left;
            & .ivu-upload-list-file {
              background: #f5f5f5;
              & span {
                color: #9a9ca1;
                font-size: 12px;
              }
              & .ivu-upload-list-remove {
                opacity: 1;
                color: #444;
              }
            }
            // & .ivu-upload-list-file:hover {
            //   background: #f5f5f5;
            // }

            & .ivu-progress-success .ivu-progress-bg {
              background: #16ade9;
            }
          }
        }
        .imgBox {
          width: 104px;
          height: 104px;
          overflow: hidden;
          border: 1px dashed #dcdee2;
          position: relative;
          text-align: center;
          .deletBtn {
            position: absolute;
            bottom: 10px;
            left: 22px;
            display: none;
          }
          .pdf-name {
            margin-top: 60px;
          }
          .show-pdf {
            display: inline-block;
            color: #313233;
            font-size: 16px;
            margin-top: 26px;
          }
        }
        &:hover .deletBtn {
          display: block;
        }
        .showImg {
          width: 200px;
          height: 124px;
          border: 1px dashed #dcdee2;
          overflow: hidden;
          text-align: center;
          .show-pdf {
            display: inline-block;
            color: #313233;
            font-size: 16px;
            margin-top: 40px;
          }
          img {
            width: 100%;
            height: auto;
          }
        }
        .example-btn {
          margin-top: 88px;
          margin-left: 10px;
          color: #16ade9;
          font-size: 12px;
          cursor: pointer;
        }
      }

      & .line {
        margin-top: 30px;
        margin-bottom: 30px;
      }
    }
    .newBt {
      text-align: center;
      margin: 20px 10px;
      // position: fixed;
      // bottom: 0px;
      // width: 100%;
      // left: 0px;
      // background: #ffffff;
      // padding: 20px;
      // box-shadow: 0px -1px 4px 0px rgba(0,0,0,0.04);
      // z-index: 11;
      & .btn {
        // text-align: center;
        & .next,
        & .prev {
          display: inline-block;
          width: 98px;
          height: 32px;
          background: #16ade9;
          border: 1px solid #16ade9;
          color: #313233;
          font-size: 14px;
          line-height: 33px;
          text-align: center;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        & .prev {
          background: #fff;
          border: 1px solid #16ade9;
          color: #16ade9;
          margin-right: 20px;
        }
        & .next {
          color: #ffffff;
          margin-right: 16px;
        }
      }
    }
  }

  & .success {
    text-align: center;
    min-height: 600px;
    background: #ffffff;
    & > img {
      margin-top: 50px;
      width: 76px;
      height: 76px;
      margin-bottom: 24px;
    }
    & .success-tips {
      font-size: 20px;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      margin-bottom: 24px;
    }
    & .btn {
      margin-top: 40px;

      & span {
        display: inline-block;
        width: 140px;
        height: 36px;
        border: 1px solid #16ade9;
        line-height: 36px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
        color: #16ade9;
        margin-bottom: 32px;
      }
    }
    & .followContent {
      width: 730px;
      height: 240px;
      background: rgba(22, 173, 233, 0.1);
      margin: 0px auto;
      padding: 24px;
      .title {
        font-size: 16px;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
        margin-bottom: 17px;
      }
      img {
        width: 144px;
      }
    }
  }
}
</style>
