<template>
  <div class="mainContent">
    <Modal v-model="modalShow" :mask-closable="false" footer-hide :width="608" title="银联支付" @on-visible-change="changeState">
      <div class="content">
        <div class="count-info">
          <p>应付费用：
            <span style="color: #ED3E3E;">¥
              <span class="red">{{totalPrice}}</span>
            </span>
          </p>
          <p>收款账户：
            <span class="gray3">8110301012200515461</span>
          </p>
          <p>收款公司：
            <span class="gray3">跨税云（深圳）科技有限公司</span>
          </p>
          <p>收款银行：
            <span class="gray3">中信银行股份有限公司深圳龙华支行</span>
          </p>
          <p>收款说明：
            <span class="gray9">上传完打款凭证后，我们会在后台进行审核，如等待时间较长，可联系客服；</span>
          </p>
          <Upload :action="fileUpload" class="uploadBox" :format="['jpg','jpeg','png','pdf']" :on-success="(res,file,fileList)=>{handleSuccess(res,file,fileList)}" :on-remove="(file,fileList)=>{handleRemoveFile (file,fileList)}" :before-upload="handleBeforeUpload" :on-format-error="handleFormatError">
            <Button type="primary" icon="ios-cloud-upload-outline">已支付，上传打款凭证</Button>
          </Upload>
          <div style="text-align:right;">
            <Button style="margin-top:15px;margin-bottom:30px;width: 92px;
height: 38px;background: #00A3FF;box-shadow: 0px 2px 4px 0px rgba(0, 163, 255, 0.16);color:#fff;" @click="submit" :disabled="fileList==''?true:false">提交</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { uploadPaymentFile } from '@/api/sureOrder/sureOrder'
export default {
  props: {
    orderNo: '',
    totalPrice: '',
    from: ''
  },
  data () {
    return {
      modalShow: true,
      fileUpload: this.uploadUrl,
      fileList: ''
    }
  },
  methods: {
    handleSuccess (res, file, fileList) {
      this.fileList = res.data.fileUrl
    },
    handleRemoveFile () {
      this.fileList = ''
    },
    handleBeforeUpload () {
      const check = this.fileList.length == ''
      if (!check) {
        this.$Notice.warning({
          title: '只能上传一张图片'
        })
      }
      return check
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持jpg、jpeg、png、pdf'
      })
    },
    submit () {
      let obj = {
        orderNo: this.orderNo,
        paymentFile: this.fileList,
        acceptAccountName: '跨税云（深圳）科技有限公司',
        acceptAccountNum: '8110301012200515461',
        acceptBankName: '中信银行股份有限公司深圳龙华支行'
      }
      uploadPaymentFile(obj).then(res => {
        if (res.code === 0) {
          window.localStorage.removeItem('productInfo')
          this.$emit('changeState', {
            state: false,
            type: true
          })
          this.$Modal.info({
            title: '',
            content: `<div class="submit-tip-box">
          <p class="submit-tip-title"><span class="imgs"></span><span>上传成功</span></p>
          <p class="tip-content">上传完打款凭证后，我们会在后台进行审核，如等待时间较长，可联系客服；</p></div>`,
            cancelText: '返回',
            onOk: () => {
              this.$router.push({ path: '/myOrder', query: {from: this.from}})
            },
            onCancel: () => {
              this.$router.push({ path: '/myOrder' })
            }
          })
        }
      })
    },
    changeState (val, type) {
      let obj = {
        state: val,
        type: false
      }
      if (type) obj.type = type
      this.$emit('changeState', obj)
      this.$router.push({ path: '/myOrder'})
    }

  }
}
</script>
<style lang="less" scoped>
.mainContent {
  color: #626266;
}
.content {
  padding: 30px 16px 30px 30px;
  .title {
    font-size: 18px;
    color: #00a3ff;
  }
  .count-info {
    margin-left: 20px;
    margin-top: 30px;
  }
  p {
    margin: 20px 0;
    font-size: 16px;
    span {
      color: #00a3ff;
    }
  }
}
&/deep/.ivu-modal-content {
  .ivu-modal-header {
    background: #ffffff !important;
    border-color: #f6f6f6;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
    padding: 24px;
  }
  .ivu-modal-body {
    padding: 0px;
    .content {
      padding: 20px 90px 30px 90px;
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
        margin-left: 60px;
        .ivu-upload-list-file {
          text-align: center;
        }
      }
    }
  }
}
&/deep/.ivu-modal-confirm-footer .ivu-btn.ivu-btn-text {
  border: none;
}
</style>
<style>
.submit-tip-title {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
  margin-left: -40px;
}
.submit-tip-title .imgs {
  display: inline-block;
  width: 26px;
  height: 26px;
  background-image: url("../../assets/images/infoDetail/Shape.svg");
  vertical-align: middle;
  margin-right: 14px;
}
.submit-tip-box .tip-content {
  color: #333;
}
/* .ivu-modal-confirm-footer .ivu-btn.ivu-btn-text {
  display: none;
} */
</style>
