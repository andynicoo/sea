<template>
  <div class="mainContent">
    <Modal v-model="modalShow" :mask-closable="false" footer-hide :width="760" @on-visible-change="changeState">
      <div slot="header" @click="changeState(false, false)" style="cursor: pointer">
        <img src="@/assets/images/common/back.png" alt="" />
        返回上一步
      </div>
      <div class="content">
        <p class="title">银联支付</p>
        <div class="count-info">
          <div class="accountInfo">
            <p>收款账户： 8110301012200515461</p>
            <p>收款公司： 跨税云（深圳）科技有限公司</p>
            <p>收款银行： 中信银行股份有限公司深圳龙华支行</p>
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
            <span>上传完打款凭证后，我们会在后台进行审核，如等待时间较长，可联系客服；</span>
          </p>
          <div style="text-align: center">
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
            <Button style="margin-top: 15px; margin-bottom: 30px" @click="submit" :loading="loading">提交</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { uploadPaymentFile } from "@/api/sureOrder/sureOrder";
export default {
  props: {
    orderId: "",
    orderNo: "",
    orderInfo: ""
  },
  data() {
    return {
      modalShow: true,
      fileUpload: this.ImgUrl,
      fileList: "",
      loading: false,
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
    submit() {
      if (this.fileList == "" || this.fileList == undefined) {
        this.$Message.info("请先上传缴税凭证");
        return;
      }
      let obj = {
        orderId: this.orderId,
        paymentFile: this.fileList,
        orderNo: this.orderNo,
        acceptAccountName: "跨税云（深圳）科技有限公司",
        acceptAccountNum: "8110301012200515461",
        acceptBankName: "中信银行股份有限公司深圳龙华支行",
      };
      this.loading = true;
      uploadPaymentFile(obj).then((res) => {
        this.loading = false;
        if (res.code === 0) {
          this.$Message.success("提交成功");
          // window.location.reload();
          window.localStorage.removeItem("productInfo");
          this.changeState(false, true);
          if( this.orderInfo.marketingActivityId) {
            setTimeout(() => {
              this.$router.push({ path: "/orderList?from=pay" });
            }, 1500);
          } else {
            setTimeout(() => {
              this.$router.push({ path: "/" });
            }, 1500);
          }
        }
      });
    },
    changeState(val, type) {
      let obj = {
        state: val,
        type: false,
      };
      if (type) obj.type = type;
      this.$emit("changeState", obj);
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
  padding: 10px 16px 0px 30px;
  .title {
    font-size: 18px;
    color: #16ade9;
  }
  p {
    margin: 20px 0;
    font-size: 16px;
    span {
      color: #16ade9;
    }
  }
  .count-info {
    margin-top: 30px;
  }
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
</style>
