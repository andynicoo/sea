<template>
  <div class="mainContent">
    <Modal
      v-model="modalShow"
      :mask-closable="false"
      footer-hide
      :width="608"
      title="网银支付"
      @on-visible-change="changeState"
    >
      <div class="content">
        <div class="count-info">
          <p>
            应付费用：
            <span style="color: #ed3e3e">
              ¥
              <span class="red">{{ totalPrice }}</span>
            </span>
          </p>
          <div class="accountInfo">
            <p>
              收款账户：
              <span class="gray3">8110301012200515461</span>
            </p>
            <p>
              收款公司：
              <span class="gray3">跨税云（深圳）科技有限公司</span>
            </p>
            <p>
              收款银行：
              <span class="gray3">中信银行股份有限公司深圳龙华支行</span>
            </p>
            <div
              class="fuzhi cobyOrderSn"
              data-clipboard-action="copy"
              data-clipboard-text="收款公司：跨税云（深圳）科技有限公司     收款账户：8110301012200515461     收款银行：中信银行股份有限公司深圳龙华支行"
              @click="copyLink"
            >
              一键复制
            </div>
          </div>

          <p>
            打款说明：
            <span class="gray9">上传完打款凭证后，我们会在后台进行审核，如等待时间较长，可联系客服；</span>
          </p>
          <p style="text-align: center; margin: 20px 0px">
            <Upload
              :action="fileUpload"
              class="uploadBox"
              :format="['jpg', 'jpeg', 'png', 'pdf']"
              :on-success="
                (res, file, fileList) => {
                  handleSuccess(res, file, fileList);
                }
              "
              :on-remove="
                (file, fileList) => {
                  handleRemoveFile(file, fileList);
                }
              "
              :before-upload="handleBeforeUpload"
              :on-format-error="handleFormatError"
            >
              <Button type="primary" icon="ios-cloud-upload-outline">已支付，上传打款凭证</Button>
            </Upload>
          </p>
          <div style="text-align: center">
            <Button
              v-if="from && from == 'renewal'"
              style="margin-top: 15px; margin-bottom: 30px"
              @click="submit"
              :loading="submitLoading"
            >
              提交
            </Button>
            <Button v-else style="margin-top: 15px; margin-bottom: 30px" @click="submit" :loading="submitLoading">提交</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { uploadPaymentFile, uploadPaymentFileMore } from "@/api/sureOrder/sureOrder";
export default {
  props: ["orderId", "orderNo", "totalPrice", "from", "marketingActivityId"],
  data() {
    return {
      modalShow: true,
      fileUpload: this.ImgUrl,
      fileList: "",
      submitLoading: false
    };
  },
  methods: {
    handleSuccess(res, file, fileList) {
      this.fileList = res.data.fileUrl;
    },
    handleRemoveFile() {
      this.fileList = "";
    },
    handleBeforeUpload() {
      const check = this.fileList.length == "";
      if (!check) {
        this.$Notice.warning({
          title: "只能上传一张图片",
        });
      }
      return check;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件类型错误",
        desc: "只支持jpg、jpeg、png、pdf",
      });
    },
    /**
     * 续费的提交付款凭证
     */
    renewalSubmit() {
      let obj = {
        orderIds: this.orderId,
        paymentFile: this.fileList,
      };
      uploadPaymentFileMore(obj).then((res) => {
        if (res.code === 0) {
          this.$Message.success("提交成功");
          window.localStorage.removeItem("productInfo");
          this.$emit("changeState", {
            state: false,
            type: true,
          });
          setTimeout(() => {
            this.$router.push({ path: "/" });
          }, 1500);
        }
      });
    },
    submit() {
      let obj = {
        orderId: this.orderId,
        paymentFile: this.fileList,
        orderNo:this.orderNo,
        acceptAccountName:'跨税云（深圳）科技有限公司',
        acceptAccountNum:'8110301012200515461',
        acceptBankName:'中信银行股份有限公司深圳龙华支行'
      };
      this.submitLoading = true;
      uploadPaymentFile(obj).then((res) => {
        if (res.code === 0) {
          this.$Message.success("提交成功");
          window.localStorage.removeItem("productInfo");
          this.$emit("changeState", {
            state: false,
            type: true,
          });
          if( this.marketingActivityId) {
            setTimeout(() => {
              this.$router.push({ path: "/orderList?from=pay" });
            }, 1500);
          } else {
            setTimeout(() => {
              this.$router.push({ path: "/" });
            }, 1500);
          }
        }
      })
      .finally(() => {
        this.submitLoading = false;
      });
    },
    changeState(val, type) {
      let obj = {
        state: val,
        type: false,
      };
      if (type) obj.type = type;
      this.$emit("changeState", obj);
      this.$router.push("/orderList");
    },
    copyLink() {
      let _this = this;
      let clipboard = new this.clipboard(".cobyOrderSn");
      clipboard.on("success", function (e) {
        _this.$Message.success("复制成功");
      });
      clipboard.on("error", function () {
        _this.$Message.info("复制失败");
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
    },
  },
};
</script>
<style lang="less" scoped>
.mainContent {
  color: #626266;
}
.content {
  padding: 0px 16px 0px 30px;
  .title {
    font-size: 18px;
    color: #16ade9;
  }
  p {
    margin: 10px 0;
    font-size: 14px;
    span {
      color: #16ade9;
    }
  }
  .count-info {
    .accountInfo {
      background: #eff9ffff;
      padding: 10px 24px;
      position: relative;
      p {
        margin: 4px 0px;
      }
      .cobyOrderSn {
        position: absolute;
        right: 24px;
        top: 10px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #16ade9;
        width: 74px;
        height: 26px;
        font-size: 12px;
        font-family: PingFangSC;
        color: #16ade9;
        text-align: center;
        line-height: 26px;
        cursor: pointer;
      }
    }
  }
}
&/deep/.ivu-modal-content {
  .ivu-modal-header {
    background: #ffffff !important;
    border-color: #f6f6f6;
    .ivu-modal-header-inner::before {
      content: "";
      border-left: 2px solid #16ade9;
      width: 2px;
      height: 14px;
      padding-left: 10px;
    }
  }
  .ivu-modal-body {
    padding: 0px;
    .content {
      p {
        color: #666666;
        font-size: 12px;
      }
      .count-info {
        .red {
          color: #ed3e3e;
          font-size: 18px;
          font-weight: bold;
        }
        .gray3 {
          color: #333333;
        }
        .gray9 {
          color: #999999;
        }
      }
      .uploadBox {
        display: initial;
        .ivu-upload-list-file {
          text-align: center;
        }
      }
    }
  }
}
</style>
