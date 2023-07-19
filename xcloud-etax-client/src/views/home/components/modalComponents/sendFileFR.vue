<template>
  <div>
    <Modal v-model="detailModel"
           title="上传授权书"
           :mask-closable="false"
           @on-visible-change="changeState"
           width="510">
      <div class="tips"
           v-if="serviceInfo.countryCode=='AE'">
        <p>阿联酋特别说明：根据阿联酋税局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书及flowchat；</p>
      </div>
      <div class="tips"
           v-if="serviceInfo.countryCode=='SA'">
        <p>沙特特别说明：根据沙特局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书及flowchat；</p>
      </div>
      <div class="tips"
           v-if="serviceInfo.countryCode=='NL'">
        <p>
          荷兰特别说明：根据荷兰税局要求，合规进行VAT税号注册及申报服务，需要卖家提供授权书给税务代理；</p>
      </div>
      <p class="red-tip">备注：以下资料下载打印后需要进行法人签名及盖章，再进行上传即可；</p>
      <Upload ref="declareFile"
              type="drag"
              :action="ImgUrl"
              :data="{ prefix: '' }"
              v-if="serviceInfo.countryCode !=='AE' && serviceInfo.countryCode !== 'SA'"
              :before-upload="beroreHaugeload"
              :on-success="(res,file,fileList)=>{declareUploadSuccess(res,file,fileList)}"
              :on-remove="(file,fileList)=>{removeDeclare(file,fileList)}">
        <div style="padding: 10px 0">
          <Icon type="ios-cloud-upload"
                size="30"
                style="color: #3399ff"></Icon>
          <span>点击上传授权书</span>
        </div>
      </Upload>
      <Upload ref="declareFile"
              type="drag"
              :action="ImgUrl"
              :data="{ prefix: '' }"
              v-if="serviceInfo.countryCode=='AE' || serviceInfo.countryCode=='SA'"
              :before-upload="beroreHaugeloadtaxRegisterLetter"
              :on-success="(res,file,fileList)=>{taxRegisterUploadSuccess(res,file,fileList)}"
              :on-remove="(file,fileList)=>{removeTaxRegister(file,fileList)}">
        <div style="padding: 10px 0">
          <Icon type="ios-cloud-upload"
                size="30"
                style="color: #3399ff"></Icon>
          <span>点击上传授权书</span>
        </div>
      </Upload>
      <div class="download"
           v-if="serviceInfo.countryCode=='NL'">
        <a href="https://pre-fdfs.itaxs.com/group1/M00/00/C8/rBLKLV_LXAyAfw7CAARCTLIO3po984.pdf"
           style="color:#02a7f0;"
           target="_blank">【查看示例】</a>
      </div>
      <div class="download"
           v-if="serviceInfo.countryCode=='AE' || serviceInfo.countryCode=='SA'||serviceInfo.countryCode=='NL'"
           @click="uploadAuthorizationTep">【下载授权书】</div>
      <Upload ref="declareFile"
              type="drag"
              v-if="serviceInfo.countryCode=='AE' || serviceInfo.countryCode=='SA'"
              :action="ImgUrl"
              :data="{ prefix: '' }"
              :before-upload="beroreHaugeloadFlowchartFile"
              :on-success="(res,file,fileList)=>{flowchatfileUploadSuccess(res,file,fileList)}"
              :on-remove="(file,fileList)=>{removeflowchatfile(file,fileList)}">
        <div style="padding: 10px 0">
          <Icon type="ios-cloud-upload"
                size="30"
                style="color: #3399ff"></Icon>

          <span>点击上传flowchat</span>
        </div>
      </Upload>
      <div class="download"
           v-if="serviceInfo.countryCode=='AE' || serviceInfo.countryCode=='SA'"
           @click="downLoad">【下载flowchat】</div>
      <div class="tips"
           v-if="serviceInfo.countryCode=='AE' || serviceInfo.countryCode=='SA'">
        <p v-if="serviceInfo.countryCode=='IT'">温馨提示：请确认授权书内容完整、清晰可见（您需要操作的内容如下）；</p>
        <p v-else>温馨提示：请确认授权书和flowchat内容完整、清晰可见（您需要操作的内容如下）；</p>
        <p>1、盖公司公章；</p>
        <p>2、法人签名；</p>
      </div>
      <p slot="footer"
         class="footer">
        <Button @click="changeState">取消</Button>
        <Button type="primary"
                @click="sureEnterHaugeInfo">完成</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import { sendFileRegFR, sendFileFR } from "@/api/taxModule";
export default {
  props: ['type', 'serviceId', 'serviceInfo'],
  data() {
    return {
      detailModel: true,
      regAuthorizationFile: '',
      flowchartFile: '',
      taxRegisterLetter: '',
      nowFile: ''
    }
  },
  methods: {
    changeState(val) {
      this.$emit("changeSendStateFR", false);
    },
    beroreHaugeload(item) {
      let self = this;
      const check = self.regAuthorizationFile == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    beroreHaugeloadFlowchartFile(item) {
      let self = this;
      const check = self.flowchartFile == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    beroreHaugeloadtaxRegisterLetter(item) {
      let self = this;
      const check = self.taxRegisterLetter == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    //申报回执上传成功
    declareUploadSuccess(res, file, fileList, type) {
      this.regAuthorizationFile = file.response.data.fileUrl;
    },
    //移除申报回执
    removeDeclare(file, fileList, type) {
      this.regAuthorizationFile = ''
    },
    //申报回执上传成功
    flowchatfileUploadSuccess(res, file, fileList, type) {
      this.flowchartFile = file.response.data.fileUrl;
    },
    //移除申报回执
    removeflowchatfile(file, fileList, type) {
      this.flowchartFile = ''
    },
    //申报申请涵
    taxRegisterUploadSuccess(res, file, fileList, type) {
      this.taxRegisterLetter = file.response.data.fileUrl;
    },
    //移除申请涵
    removeTaxRegister(file, fileList, type) {
      this.taxRegisterLetter = ''
    },
    sureEnterHaugeInfo() {
      if (this.serviceInfo.countryCode == 'AE' || this.serviceInfo.countryCode == 'SA') {
        if (this.taxRegisterLetter == '') {
          this.$Message.info('请先上传申请函')
          return
        }
        if (this.flowchartFile == '') {
          this.$Message.info('请先上传flowchat文件')
          return
        }
      } else {
        if (this.regAuthorizationFile == '') {
          this.$Message.info('请先上传授权书')
          return
        }
      }

      if (this.type == 1) {
        this.RegSenfile()
      } else if (this.type == 2) {
        this.Senfile()
      }
    },
    //注册上传
    RegSenfile() {
      let data = {
        regAuthorizationFile: this.regAuthorizationFile,
        flowchartFile: this.flowchartFile,
        taxRegisterLetter: this.taxRegisterLetter,
        serviceId: this.serviceId
      }
      sendFileRegFR(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('操作成功')
          this.$emit("changeSendStateFR", false);
        }
      })
    },
    //转代理上传
    Senfile() {
      let data = {
        regAuthorizationFile: this.regAuthorizationFile,
        serviceId: this.serviceId
      }
      sendFileFR(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('操作成功')
          this.$emit("changeSendStateFR", false);
        }
      })
    },
    // 下载授权模板  根据服务ID获取授权书/申请函
    uploadAuthorizationTep() {
      let formData = new FormData()
      formData.append('servicesId', this.serviceId)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/derive/client/download/authorization', true)
      // 设置请求token
      xmlResquest.setRequestHeader('token', localStorage.getItem('token'))
      xmlResquest.setRequestHeader('sessionId', localStorage.getItem('sessionId'))
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        let fileName = ''
        if (xmlResquest.getResponseHeader('content-disposition')) {
          fileName = decodeURI(xmlResquest.getResponseHeader('content-disposition').split(";")[1].split("=")[1]);
        } else {
          self.$Message.warning('下载出错！');
          return;
        }
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = fileName
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    },
    // 根据服务ID获取董事声明书/flowchart
    downLoad() {
      let formData = new FormData()
      formData.append('servicesId', this.serviceId)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/derive/client/download/statement', true)
      // 设置请求token
      xmlResquest.setRequestHeader('token', localStorage.getItem('token'))
      xmlResquest.setRequestHeader('sessionId', localStorage.getItem('sessionId'))
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        let fileName = ''
        if (xmlResquest.getResponseHeader('content-disposition')) {
          fileName = decodeURI(xmlResquest.getResponseHeader('content-disposition').split(";")[1].split("=")[1]);
        } else {
          self.$Message.warning('下载出错！');
          return;
        }
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = fileName
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    }
  },
}
</script>
<style lang="less" scoped>
.tips {
  background-color: #f0fbff;
  padding: 10px;
  margin-top: 20px;
  p {
    color: #333;
    line-height: 24px;
  }
}
.red-tip {
  margin: 20px 0;
  font-size: 18px;
  color: red;
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

