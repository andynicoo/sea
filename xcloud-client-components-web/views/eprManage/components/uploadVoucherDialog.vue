<!-- 发票详情页 -->
<template>
  <div>
    <Modal v-model="dialog" :width="850" class="online-pay-modal">
      <div slot="header">
        <span class="modal-title">上传缴费凭证</span>
      </div>

      <div class="modal-tip h-40">
        <p class="modal-foot-title">
          <Icon class="tip-icon" type="ios-alert" />
          温馨提示：在线支付平台将在缴纳时间3-7天内完成缴费，支付完成后请到对应平台下载回执凭证。
        </p>
      </div>
      <div class="info-wrap">
        <p class="info-title">官方回收费信息</p>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">服务号：</span>
            <span class="tax-info-value">{{ detailData.serviceNo }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">服务名称：</span>
            <span class="tax-info-value">{{ detailData.serviceName }}</span>
          </Col>
        </Row>
        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">官费金额：</span>
            <span class="tax-info-value">€{{ detailData.bankPayInfosObj.officialFee }}EUR</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">备注：</span>
            <span class="tax-info-value"
              >{{ detailData.uinStr }} &nbsp;&nbsp; {{ detailData.bankPayInfosObj.invoiceNo }}</span
            >
          </Col>
        </Row>
        <p class="info-title">官方回收费信息</p>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">国际银行账号 IBAN：</span>
            <span class="tax-info-value">{{ detailData.bankPayInfosObj.ban }} </span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">银行识别码 BIC：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.bankIdentifierCode }}</span>
          </Col>
        </Row>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">银行名称 Dank Name：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.bankName }} </span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">账户名称 Account Name：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.accountName }}</span>
          </Col>
        </Row>

        <Upload
          :action="fileUpload"
          class="uploadBox"
          :format="['jpg', 'jpeg', 'png', 'pdf', '.rar', '.zip', '.doc', '.docx']"
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
          <div style="padding: 34px 0">
            <img src="@/assets/images/common/upload1.png" alt="" />
            <p style="color: #666">点击或将文件拖拽到这里上传</p>
            <p class="fileType-tip">支持扩展名：.rar .zip .doc .docx. jpeg .png .pdf .jpg...</p>
          </div>
        </Upload>
      </div>

      <div slot="footer">
        <Button class="mr-15" type="primary" @click="uploadFileFn">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'uploadVoucherDialog',
  props: {
    showUpload: Boolean,
    detailData: Object,
  },

  data() {
    return {
      fileList: [],
      fileUpload: this.ImgUrl,
    };
  },

  computed: {
    dialog: {
      get(val) {
        if (val) {
          this.fileList = [];
        }
        return this.showUpload;
      },
      set(val) {
        this.$emit('update:showUpload', val);
      },
    },
  },

  mounted() {},
  methods: {
    handleSuccess(res, file, fileList) {
      this.fileList = fileList;
    },
    handleRemoveFile(file, fileList) {
      this.fileList = fileList;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持.rar .zip .doc .docx. jpeg .png .pdf .jpg',
      });
    },
    handleBeforeUpload() {
      const check = this.fileList.length == 0;
      // console.log(this.AmzFileList)
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
    },
    uploadFileFn() {
      if (!this.fileList.length) {
        this.$Message.error('请上传文件');
        return;
      }
      const voucherFiles = this.fileList.map((v) => v.response.data.fileUrl);
      this.$emit('uploadFile', voucherFiles);

      // uploadPaymentVoucher({
      //   serviceId: this.detailData.serviceId,
      //   voucherFiles,
      // }).then((res) => {
      //   if (res.code === 0) {
      //     this.$Message.success('上传成功');
      //     this.getList();
      //     this.showUpload = false;
      //     this.fileList = [];
      //   }
      // });
    },
  },
};
</script>
<style lang="less" scoped>
.online-pay-modal {
  /deep/ .ivu-modal-header {
    border-radius: 4px;
    padding: 0 16px;
    background: #fff !important;
    height: 64px;
    .modal-title {
      color: #333;
      font-size: 16px;
      font-weight: 800;
      line-height: 64px;
    }
  }
  .modal-tip {
    width: 769px;
    height: 120px;
    background: #fff5e6;
    border-radius: 4px 4px 0px 0px;
    margin: 8px 0 16px 24px;
    .modal-foot-title {
      line-height: 38px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      padding-left: 24px;
    }
  }

  .h-40 {
    height: 40px;
  }
  .tax-info-name[data-v-0a48ba9f] {
    display: inline-block;
    width: 100px;
    text-align: right;
    color: #666;
    font-size: 14px;
  }
  .tax-info-value {
    color: #333;
    font-size: 14px;
  }
  .pay-wrap-title {
    color: #333;
    font-size: 18px;
    margin: 20px 0 20px 24px;
    font-weight: 800;
    font-family: PingFangSC-Medium, PingFang SC;
    span {
      font-size: 14px;
      cursor: pointer;
      color: #57a3f3;
      font-weight: 200;
      margin-left: 5px;
    }
  }
  .tip-icon {
    color: #fe9a39;
    font-size: 16px;
    vertical-align: middle;
    margin-right: 5px;
  }
}
.uploadBox /deep/ .ivu-upload.ivu-upload-select {
  border: 1px dashed #dcdee2;
  text-align: center;
  margin-bottom: 10px;
  width: 380px;
  height: 195px;
  margin-left: 202px;
}
.mb-15 {
  margin-bottom: 15px;
}

.info-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin-bottom: 20px;
}
/deep/ .ivu-upload-list {
  width: 380px;
  margin-left: 102px;
}
</style>
