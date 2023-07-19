<template>
  <div>
    <div class="head">
      <div style="padding-left: 32px; padding-bottom: 16px">
        <span class="left">待上传备案资料</span>
        <span class="right">（ {{ countryNameZh }}授权代表 ）</span>
      </div>
      <div class="top-speed">
        <p v-if="formLeft.status == 0 && id">
          <img src="@/assets/images/compliance/audit.svg" />
          <span class="status1" v-if="formLeft.commitTime">提交时间：{{ formLeft.commitTime.slice(0, 10) }}</span>
        </p>
        <p v-if="formLeft.status == 1">
          <img src="@/assets/images/compliance/filing.svg" />
          <span class="status1" v-if="formLeft.commitTime">提交时间：{{ formLeft.commitTime.slice(0, 10) }}</span>
          <span class="status2" v-if="formLeft.approvalTime">审核时间：{{ formLeft.approvalTime.slice(0, 10) }}</span>
        </p>
        <p v-if="formLeft.status == 2">
          <img src="@/assets/images/compliance/filingcompleted.svg" />
          <span class="status1" v-if="formLeft.commitTime">提交时间：{{ formLeft.commitTime.slice(0, 10) }}</span>
          <span class="status2" v-if="formLeft.approvalTime">审核时间：{{ formLeft.approvalTime.slice(0, 10) }}</span>
          <span class="status3" v-if="formLeft.completionTime">
            完成时间：{{ formLeft.completionTime.slice(0, 10) }}
          </span>
        </p>
        <p v-if="formLeft.status == 3">
          <img src="@/assets/images/compliance/eviewrejected.svg" />
          <span class="status1" v-if="formLeft.commitTime">提交时间：{{ formLeft.commitTime.slice(0, 10) }}</span>
        </p>
      </div>
    </div>
    <div>
      <div class="finish">
        <div class="bottom">
          <div class="one">
            <div>
              <p class="left">注册主体名称：</p>
              <p class="right">{{ formLeft.companyNameZh || "暂无" }}</p>
            </div>
            <div v-if="formLeft.companyNameEn">
              <p class="left">公司英文名称：</p>
              <p class="right">{{ formLeft.companyNameEn || "暂无" }}</p>
            </div>
            <div>
              <p class="left">国家：</p>
              <p class="right">{{ formLeft.countryNameZh || "暂无" }}</p>
            </div>
          </div>
          <p class="xinxi">{{ countryNameZh == "欧盟" ? "欧代信息" : "英代信息" }}</p>
          <div class="two">
            <div>
              <p>
                <span class="left">{{ countryNameZh == "欧盟" ? "欧代标签文件：" : "英代标签文件：" }}</span>

                <a class="chakan" :href="formLeft.tagFile" target="_blank" v-if="formLeft.tagFile">
                  <img src="@/assets/images/compliance/chakan.svg" />
                  点击查看
                </a>
                <span class="right" v-else>暂无</span>
              </p>
              <p style="margin-top: 16px">
                <span class="left">协议生效日期：</span>
                <span class="right">
                  {{ (formLeft.agreementBeginTime && formLeft.agreementBeginTime.slice(0, 10)) || "暂无" }}
                </span>
              </p>
            </div>
            <div>
              <p v-if="formLeft.certificat">
                <span class="left">{{ countryNameZh == "欧盟" ? "欧代证书：" : "英代证书：" }}</span>
                <a
                  class="chakan"
                  :href="
                    formLeft.certificat.slice(0, 5) == 'http:'
                      ? formLeft.certificat.slice(0, 4) + 's' + formLeft.certificat.slice(4)
                      : formLeft.certificat
                  "
                  target="_blank"
                >
                  <img src="@/assets/images/compliance/chakan.svg" />
                  点击查看
                </a>
              </p>
              <p style="margin-top: 16px">
                <span class="left">协议到期日期：</span>
                <span class="right">
                  {{ (formLeft.agreementEndTime && formLeft.agreementEndTime.slice(0, 10)) || "暂无" }}
                </span>
              </p>
            </div>
            <div>
              <p v-if="countryNameZh == '欧盟'">
                <span class="left">上传亚马逊平台示例：</span>
                <a
                  class="chakan"
                  href="https://file.itaxs.com/dev/20210315/b3531a7c457d471eb3fb8e692013cb53.png"
                  target="_blank"
                >
                  <img src="@/assets/images/compliance/chakan.svg" />
                  点击查看
                </a>
              </p>
              <p v-if="formLeft.agreement" style="margin-top: 16px">
                <span class="left">{{ countryNameZh == "欧盟" ? "欧代协议：" : "英代协议：" }}</span>
                <a
                  class="chakan"
                  :href="
                    formLeft.agreement.slice(0, 5) == 'http:'
                      ? formLeft.agreement.slice(0, 4) + 's' + formLeft.agreement.slice(4)
                      : formLeft.agreement
                  "
                  target="_blank"
                >
                  <img src="@/assets/images/compliance/chakan.svg" />
                  点击查看
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="upload-file">
      <div class="big-row">
        <p class="title">新增产品备案信息</p>
        <!-- 产品列表 -->
        <ProductItemsTable
          :value="productList"
          :countryNameZh="countryNameZh"
          :disabled="!isEdit"
          @input="input"
          ref="table"
        ></ProductItemsTable>
      </div>
      <div class="btn-grop" v-if="!id">
        <Button type="primary" style="padding: 0 32px" @click="submit()">提交</Button>
      </div>
      <div class="btn-grop" v-if="formLeft.status == 3">
        <Button style="padding: 0 32px" @click="cancel()">取消</Button>
        <Button type="primary" style="padding: 0 32px" @click="submit()">提交</Button>
      </div>
    </div>
    <Modal v-model="refuseReasonModal">
      <div class="tipsModal-title">温馨提示</div>
      <Divider style="margin: 16px 0" />
      <div class="tipsModal-contnet">
        <p class="tip-title">您的备案审核未通过，请按照以下指引修改...</p>
        <p style="word-break: break-all">{{ remark }}</p>
      </div>
      <div slot="footer">
        <Button type="primary" @click="refuseReasonModal = false">知道了</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getFilingProductDetails, filingProductInsert } from "@/api/taxModule";
import { listRejectByWorkNo } from "@/api/compliance/register";
import ProductItemsTable from "../components/ProductItemsTable.vue";
export default {
  components: {
    ProductItemsTable,
  },
  data() {
    return {
      id: this.$route.query.id,
      serviceId: this.$route.query.serviceId,
      countryNameZh: this.$route.query.countryNameZh,
      workNo: this.$route.query.workNo,
      status: this.$route.query.status,
      remark: "",
      timestamp: "",
      refuseReason: [],
      refuseReasonModal: false,
      pageType: 2,
      isEdit: false,
      formLeft: {},
      detailInfo: {},
      tipsModal: false,
      notChange: false,
      base64URI: "",
      noSub: false,
      productList: [
        {
          productName: "",
          brand: "",
          models: "",
          classification: "",
          manufacturer: "",
          ceCertificat: "",
          productTestReportCertificat: "",
          ukcaCertificat: "",
          productCertificat: "",
        },
      ],
      productItems: [],
    };
  },
  methods: {
    input(val) {
      this.productItems = val;
    },
    getReject() {
      let data = {
        workNo: this.workNo,
      };
      listRejectByWorkNo(data).then((res) => {
        if (res.code == 0) {
          this.remark = res.data[0].reason;
        }
      });
    },
    submit() {
      if (this.productItems.length == 0) {
        this.$Message.error("请完善产品信息");
        return;
      }
      this.$Modal.confirm({
        title: "温馨提示",
        content: '<p style="text-align:left">一个月仅支持提交一次新增产品备案，本次备案产品是否填写完整？</p>',
        cancelText: "继续填写",
        okText: "资料无误，提交",
        onOk: () => {
          let data = {
            id: this.id,
            productItems: this.productItems,
            serviceId: this.serviceId,
          };
          filingProductInsert(data).then((res) => {
            if (res.code == 0) {
              this.$router.push("/complianceBusiness/filingList");
            }
          });
        },
      });
    },
    cancel() {
      this.getDetail();
    },
    getDetail() {
      let data = "";
      if (this.id) {
        data = this.id;
      } else {
        data = this.serviceId;
      }
      getFilingProductDetails(data).then((res) => {
        if (res.code == 0) {
          this.formLeft = res.data;
          this.status = res.data.status;
          if (res.data.productItems.length != 0) {
            this.productList = res.data.productItems;
          }
        }
      });
    },
  },
  created() {
    this.getDetail();
  },
  mounted() {
    if (this.status == 3 || !this.id) {
      this.isEdit = true;
    }
    if (this.status == 3) {
      this.getReject();
      this.refuseReasonModal = true;
    }
  },
};
</script>

<style lang="less" scoped>
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
    padding: 24px 32px 60px;
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
    }
  }
}
.head {
  padding: 16px 0 0;
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
  .top-speed {
    text-align: center;
    margin-top: 20px;
    .top-reason {
      text-align: left;
      word-break: break-all;
      margin-top: 20px;
      margin-left: 32px;
      margin-right: 32px;
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
    p {
      margin: 0 auto;
      position: relative;
      width: 970px;
      font-size: 12px;
      font-family: PingFangSC;
      color: #666666;
      .status1 {
        position: absolute;
        top: 28px;
        left: 120px;
      }
      .status2 {
        position: absolute;
        top: 28px;
        left: 420px;
      }
      .status3 {
        position: absolute;
        top: 28px;
        left: 704px;
      }
      .status4 {
        position: absolute;
        top: 28px;
        left: 788px;
      }
    }
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
.inner {
  cursor: pointer;
  width: 100px;
  height: 32px;
  background: #16ade9;
  border-radius: 2px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  img {
    width: 20px;
    height: 20px;
    margin-top: 0px;
  }
  .uplad-word {
    color: #ffffff;
  }
}
/deep/ .ivu-upload-select {
  width: 300px;
  color: #16ade9;
  border: 1px solid #16ade9;
  line-height: 32px;
  height: 32px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
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
    font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
    font-weight: 600;
    color: #333333;
    line-height: 22px;
  }
  .country {
    font-size: 14px;
    font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
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
    font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
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
    font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
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
    font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
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
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
    font-size: 12px;
    color: #ed4014;
  }
}
// /deep/ .ivu-upload {
//   cursor: pointer;
//   .inner {
//     width: 100px;
//     height: 32px;
//     background: #16ade9;
//     border-radius: 2px;
//     display: -webkit-box;
//     display: -ms-flexbox;
//     display: flex;
//     -webkit-box-align: center;
//     -ms-flex-align: center;
//     align-items: center;
//     -webkit-box-pack: center;
//     -ms-flex-pack: center;
//     justify-content: center;
//     img {
//       width: 20px;
//       height: 20px;
//       margin-top: 0px;
//     }
//     .uplad-word {
//       color: #ffffff;
//     }
//   }
// }
.out-img-box {
  .img-box {
    position: relative;
    text-align: center;
    padding-top: 8px;
    width: 100%;
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
  font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
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
</style>
