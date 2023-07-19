<template>
  <div class="container ">
    <div class="back">
      <span @click="goBack">《 返回列表</span>
    </div>
    <div class="flex-between">
      <div class="left">
        <Card style="width:100%;height: 100%;">
          <p slot="title">
            海牙认证资料
          </p>
          <div slot="extra">
            <Button type="primary" @click="download" ghost v-if="detailObj.progressBar != 39" style="margin-right:12px">下载资料</Button>
            <Button type="primary" @click="submit" v-if="detailObj.progressBar == 39">提交</Button>
            <Button type="primary" @click="detailModel = true" v-if="detailObj.progressBar == 40">审核</Button>
            <Button type="primary" @click="enterHaugeInfo = true" v-if="detailObj.progressBar == 41">录入海牙信息</Button>
            <Button type="primary" @click="authorizationHauge=true" v-if="detailObj.progressBar == 5">已发送服务商</Button>
          </div>
          <Form :model="leftForm" ref="leftForm" :label-width="135">
            <FormItem label="认证国家：">
              西班牙
            </FormItem>
            <FormItem label="公司中文名称：">
              <AutoComplete v-model="leftForm.companyNameZh" @on-change="handleSearch" :disabled="detailObj.progressBar > 39 || detailObj.progressBar == 5" placeholder="请填写需要海牙认证的公司名称" style="width:300px;">
                <Option v-for="(item,index) in companyList" :value="item.companyNameZh" :key="index">{{ item.companyNameZh }}</Option>
              </AutoComplete>
              <br />
              <span class="dingwei" v-if="errorContent">请填写正确的公司名称</span>
            </FormItem>
            <FormItem label="公司英文名称：" prop="companyNameEn">
              {{ leftForm.companyNameEn || '暂无' }}
            </FormItem>
            <FormItem label="VAT税号：" prop="vatTaxNumber">
              {{ leftForm.vatTaxNumber || '暂无' }}
            </FormItem>
            <FormItem label="海牙文件：" v-if="detailObj.progressBar == 42">
              <a :href="detailInfo.hyFile" target="_blank" v-if="detailInfo.hyFile != ''">海牙文件</a>
              <span v-else>暂无</span>
            </FormItem>
            <Divider></Divider>
            <!-- <FormItem label="授权书："
                      prop="vatNumber">
              <Upload ref="vatFile"
                      type="drag"
                      style="width:300px;"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :before-upload="beforeVatFileUpload"
                      :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatTaxNumberFile')}"
                      :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatTaxNumberFile')}">
                <div style="padding: 10px 0">
                  <Icon type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"></Icon>
                  <p>请拖拽文件到此区域上传或点击上传</p>
                </div>
              </Upload>
            </FormItem>
            <FormItem label="OtorgaApodera_es_es 中文版："
                      prop="vatNumber">
              <Upload ref="vatFile"
                      type="drag"
                      style="width:300px;"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :before-upload="beforeVatFileUpload"
                      :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatTaxNumberFile')}"
                      :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatTaxNumberFile')}">
                <div style="padding: 10px 0">
                  <Icon type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"></Icon>
                  <p>请拖拽文件到此区域上传或点击上传</p>
                </div>
              </Upload>
            </FormItem>
            <FormItem label="OtorgaApodera_es_es 西语版："
                      prop="vatNumber">
              <Upload ref="vatFile"
                      type="drag"
                      style="width:300px;"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :before-upload="beforeVatFileUpload"
                      :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatTaxNumberFile')}"
                      :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatTaxNumberFile')}">
                <div style="padding: 10px 0">
                  <Icon type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"></Icon>
                  <p>请拖拽文件到此区域上传或点击上传</p>
                </div>
              </Upload>
            </FormItem>
            <FormItem label="海牙中西语授权书："
                      prop="vatNumber">
              <Upload ref="vatFile"
                      type="drag"
                      style="width:300px;"
                      :action="fileUpload"
                      :data="{ prefix: '' }"
                      :before-upload="beforeVatFileUpload"
                      :on-success="(res,file,fileList)=>{vatFileUploadSuccess(res,file,fileList,'vatTaxNumberFile')}"
                      :on-remove="(file,fileList)=>{removeVatFile(file,fileList,'vatTaxNumberFile')}">
                <div style="padding: 10px 0">
                  <Icon type="ios-cloud-upload"
                        size="30"
                        style="color: #3399ff"></Icon>
                  <p>请拖拽文件到此区域上传或点击上传</p>
                </div>
              </Upload>
            </FormItem> -->
          </Form>
          <div class="footer">
            <p class="top">另：以下资料下载打印后需要提醒客户进行线下邮寄；</p>
            <p class="footer-title"><span>*</span>授权书</p>
            <p class="footer-content">
              <span class="content-left" @click="esDownLoad('1')">【点击下载】</span>
              <a target="_blank" href="http://file.itaxs.com/dev/20210227/1b01225f737e4793a2f1f6317cbad200.pdf">【查看示例】</a>
            </p>
            <p class="footer-title"><span>*</span>海牙中西语授权书</p>
            <p class="footer-content">
              <span class="content-left" @click="esDownLoad('2')">【点击下载】</span>
              <a target="_blank" href="http://file.itaxs.com/dev/20210227/fa2c4557c71d4a7cb05eebeb801a6d81.pdf">【查看示例】</a>
            </p>
            <p class="footer-title"><span>*</span>OtorgaApodera_es_es 中文版</p>
            <p class="footer-content">
              <span class="content-left" @click="esDownLoad('3')">【点击下载】</span>
              <a target="_blank" href="http://file.itaxs.com/dev/20210227/9cfa6293573c43eea8afb244e35436db.pdf">【查看示例】</a>
            </p>
            <p class="footer-title"><span>*</span>OtorgaApodera_es_es 西语版</p>
            <p class="footer-content">
              <span class="content-left" @click="esDownLoad('4')">【点击下载】</span>
              <a target="_blank" href="http://file.itaxs.com/dev/20210227/4ccd3425950e4063a031b04c927c01a8.pdf">【查看示例】</a>
            </p>
          </div>
        </Card>
      </div>
      <div class="right">
        <Card>
          <p slot="title">服务信息</p>
          <Form :label-width=100>
            <FormItem label="订单号：">
              <span>{{orderNo}}</span>
            </FormItem>
            <FormItem label="订单备注：">
                <span>{{orderRemark}}</span>
            </FormItem>
            <FormItem label="工单号：">
              <span>{{detailInfo.apostilleWorkNo}}</span>
            </FormItem>
            <FormItem label="状态：">
              <span>{{detailObj.progressBar == '39' ? "待上传资料 " : detailObj.progressBar == '40' ? "待审核" : detailObj.progressBar == '41' ? "海牙认证中 " : detailObj.progressBar == '42' ? "海牙认证完成": detailObj.progressBar == '43' ? "资料驳回" : detailObj.progressBar == '5'? '待海牙认证' : ''}}</span>
            </FormItem>
            <FormItem label="服务公司：">
              <span>{{detailObj.companyName}}</span>
            </FormItem>
            <FormItem label="服务名称：">
              <span>海牙认证</span>
            </FormItem>
            <FormItem label="国家：">
              <span>{{detailObj.countryNameZh}}</span>
            </FormItem>
            <FormItem label="创建时间：">
              <span>{{detailObj.createTime}}</span>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;">
          <p slot="title">用户信息</p>
          <Form :label-width=100>
            <FormItem label="用户昵称：">
              <span>{{detailInfo.userNickname}}</span>
            </FormItem>
            <FormItem label="手机号：">
              <span>{{detailInfo.userMobile}}</span>
            </FormItem>
            <FormItem label="电子邮箱：">
              <span>{{detailInfo.userEmail}}</span>
            </FormItem>
            <FormItem label="公司名称：">
              <span>{{detailInfo.userCompanyName}}</span>
            </FormItem>
            <FormItem label="地址：">
              <span>{{detailInfo.userAddress}}</span>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;" class="operationLogs">
          <p slot="title">操作记录</p>
          <div v-if="consoleOperationLogs.length > 0" class="logsContent">
            <div v-for="(row, index) in consoleOperationLogs" :key="index">
              <div>
                <p class="itemTop">{{row.instruction}}</p>
                <p v-if="row.remark">备注：{{row.remark}}</p>
                <div class="itemBottom">
                  <span style="margin-right:10px;">时间：{{row.createTime}}</span>
                  <span>操作人：{{row.adminUserNickName || row.adminUserMobile}}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
    <Modal v-model="detailModel" title="审核海牙认证资料">
      <Form ref="auditForm" :model="auditForm">
        <FormItem prop="status">
          <RadioGroup v-model="auditForm.status">
            <Radio label="1">审核通过</Radio>
            <Radio label="2">驳回，重新提交</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="remark" v-if="auditForm.status === '2'">
          <Input v-model="auditForm.remark" type="textarea" :rows="4" placeholder="请输入驳回原因（必填）" />
        </FormItem>
      </Form>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" @click="audit">确定</Button>
      </div>
    </Modal>
    <!-- 录入海牙信息 -->
    <Modal v-model="enterHaugeInfo" :mask-closable="false" title="录入海牙信息">
      <p style="font-size:14px;margin-bottom:10px">海牙文件：</p>
      <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beforeVatFileUpload" :on-success="(res,file,fileList)=>{hagueFeilFileUploadSuccess(res,file,fileList,'hyFile')}" :on-remove="(file,fileList)=>{removeHagueFeilFile(file,fileList,'hyFile')}" style="width:260px">
        <div style="padding: 10px 0">
          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
          <span>请拖拽文件到此区域上传或点击上传</span>
        </div>
      </Upload>
      <p slot="footer">
        <Button type="primary" @click="sureEnterHaugeInfo">确认</Button>
      </p>
    </Modal>
    <!-- <Spin size="large"
          fix
          v-if="spinShow">
      <Icon type="ios-loading"
            size=18
            class="demo-spin-icon-load"></Icon>
      <div>正在下载，请稍后</div>
    </Spin> -->
    <!-- 授权海牙认证 -->
    <Modal v-model="authorizationHauge" :mask-closable="false">
      <!-- <p slot="header"
          class="hauge-header">是否确认收到声明书和授权书</p>
        <div class="hauge-content">
          <p>温馨提示：收到董事声明书和授权书后，记得寄送资料到海牙哦；</p>
          <p style="color:red;">寄送资料如下：</p>
          <p style="margin-left:15px;">1、董事声明书；</p>
          <p style="margin-left:15px;">2、注册授权书；</p>
        </div> -->
      <p slot="header" class="hauge-header">是否确认发送给服务商</p>
      <div class="hauge-content">
        <p>资料清单：</p>
        <p>1、海牙授权书；</p>
        <p>2、资质证明；</p>
        <p>3、营业执照扫描件与翻译件；</p>
        <p>4、法人身份证扫描件与翻译件；</p>
      </div>
      <p slot="footer">
        <Button type="primary" ghost style="margin-right:20px;" @click="authorizationHauge=false">取消</Button>
        <Button type="primary" @click="sureReceived">确认收到</Button>
      </p>
    </Modal>
  </div>
</template>

<script>
// import * as API from '@/api/taxService/letters.js';
import * as API from '@/api/taxService/hague.js';
import { getToken } from '@/libs/util';
import { Throttle } from '@/libs/throttle'
import { taxSubmit } from "@/api/taxService/taxModule.js";
export default {
  props: ['serviceId', 'detailObj'],
  data() {
    return {
      authorizationHauge: false,
      detailInfo: {},
      lenovoSearchList: [],
      companyList: [
        {
          companyNameZh: '1',
          companyNameEn: 'a',
          vatTaxNumber: '2'
        },
        {
          companyNameZh: '11',
          companyNameEn: 'aa',
          vatTaxNumber: '22'
        },
        {
          companyNameZh: '111',
          companyNameEn: 'aaa',
          vatTaxNumber: '222'
        },
        {
          companyNameZh: '1111',
          companyNameEn: 'aaaa',
          vatTaxNumber: '2222'
        },
        {
          companyNameZh: '1a11',
          companyNameEn: 'baaa',
          vatTaxNumber: '3222'
        }
      ],
      infoList: [
        {
          companyNameZh: '1',
          companyNameEn: 'a',
          vatTaxNumber: '2'
        },
        {
          companyNameZh: '11',
          companyNameEn: 'aa',
          vatTaxNumber: '22'
        },
        {
          companyNameZh: '111',
          companyNameEn: 'aaa',
          vatTaxNumber: '222'
        },
        {
          companyNameZh: '1111',
          companyNameEn: 'aaaa',
          vatTaxNumber: '2222'
        },
        {
          companyNameZh: '1a11',
          companyNameEn: 'baaa',
          vatTaxNumber: '3222'
        }
      ],
      spinShow: false,
      nowDownload: false,
      errorContent: false,
      fileUpload: this.workOrderFile,
      orderNo: '',
      orderRemark:'',
      workId: '',
      leftForm: {
        companyNameZh: '',
        vatTaxNumber: '',
        companyNameEn: '',
        transformProxyWorkOrderServiceId: '',
      },
      detailModel: false,
      auditForm: {
        status: '1',
        remark: ''
      },
      enterHaugeInfo: false,
      hagueFeil: {
        serviceId: '',
        hyFile: ''
      },
      consoleOperationLogs: [], //操作日志
    }
  },
  created() {
    // console.log(this.serviceId) 
    this.serviceInfo()
    this.getDetail()
  },
  mounted() {
    // console.log(this.serviceId)
  },
  methods: {
    //返回列表
    goBack() {
      this.$emit('back')
    },
    handleSearch(val) {
      console.log(val)
      this.companyList = this.infoList.filter(item => item.companyNameZh.indexOf(this.leftForm.companyNameZh) != -1)
      // console.log(this.companyList)
      if (this.companyList.length == 0) {
        this.leftForm.companyNameEn = ''
        this.leftForm.vatTaxNumber = ''
        this.leftForm.transformProxyWorkOrderServiceId = ''
        // console.log('请填写正确的公司名称')
        this.errorContent = true
        return
      }
      this.errorContent = false
      let item = this.infoList.find(item => item.companyNameZh == this.leftForm.companyNameZh)
      if (item != undefined) {
        this.leftForm.companyNameEn = item.companyNameEn
        this.leftForm.vatTaxNumber = item.vatTaxNumber
        this.leftForm.transformProxyWorkOrderServiceId = item.transformProxyWorkOrderServiceId
      } else {
        this.leftForm.companyNameEn = ''
        this.leftForm.vatTaxNumber = ''
        this.leftForm.transformProxyWorkOrderServiceId = ''
        if (this.leftForm.companyNameZh == '') {
          this.companyList = this.infoList
        }
      }
    },
    // 确认收到授权书
    sureReceived() {
      API.confirmReceiptES({ serverId: this.detailObj.id }).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功');
          this.$emit('back')
        }
      })
    },
    serviceInfo() {
      API.compnayname({ userId: this.detailObj.userId }).then(res => {
        if (res.code === 0) {
          this.infoList = res.data
          this.companyList = this.infoList
          // console.log(this.lenovoSearchList)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    submit() {
      if (this.leftForm.companyNameZh == '') {
        this.$Message.error("请填写公司名称")
        return
      }
      if (this.leftForm.companyNameEn == '' || this.leftForm.vatTaxNumber == '' || this.errorContent) {
        this.$Message.error("请填写正确的公司名称")
        return
      }
      this.leftForm.orderServicesId = this.serviceId
      // console.log(this.leftForm.orderServicesId)
      this.leftForm.userId = this.detailObj.userId
      this.$Modal.confirm({
        title: '提示',
        content: '是否确认提交',
        onOk: () => {
          API.subHagueFeil(this.leftForm).then(res => {
            if (res.code === 0) {
              this.$Message.success('提交成功')
              this.$emit('back')
              this.$emit('fresh')
            } else {
              this.$Message.error(res.message)
            }
          })
        },
      });
    },
    audit() {
      if (this.auditForm.status == 2 && this.auditForm.remark == '') {
        this.$Message.error('驳回原因不能为空')
        return
      }
      this.auditForm.serviceId = this.serviceId
      API.shenheHaguefeil(this.auditForm).then(res => {
        if (res.code == 0) {
          this.$Message.success('审核成功')
          this.$emit('back')
          this.$emit('refresh')
        }
      })
    },
    getDetail() {
      API.getHagueDetailInfo({
        serviceId: this.serviceId
      }).then(res => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) != '{}') {
            if (this.detailObj.progressBar != 39) {
              this.leftForm.companyNameZh = res.data.companyNameZh
              this.leftForm.companyNameEn = res.data.companyNameEn
              this.leftForm.vatTaxNumber = res.data.vatTaxNumber
              this.leftForm.transformProxyWorkOrderServiceId = res.data.transformProxyWorkOrderServiceId
            }
            this.orderNo = res.data.orderNo
            this.orderRemark = res.data.orderRemark
            this.workId = res.data.transformProxyWorkOrder.id
            this.consoleOperationLogs = res.data.consoleOperationLogs || [];
            this.detailInfo = {
              userNickname: res.data.userNickname,
              userMobile: res.data.userMobile,
              userEmail: res.data.userEmail,
              userCompanyName: res.data.userCompanyName,
              userAddress: res.data.userAddress,
              apostilleWorkNo: res.data.apostilleWorkNo,
              hyFile: res.data.hyFile
            }
          }

        }
      }).catch(error => {
        console.log(error)
      })
    },
    esDownLoad(fileType) {
      if (this.leftForm.companyNameZh == '') {
        this.$Message.error("请填写公司名称")
        return
      }
      if (this.leftForm.companyNameEn == '' || this.leftForm.vatTaxNumber == '' || this.errorContent) {
        this.$Message.error("请填写正确的公司名称")
        return
      }
      let self = this
      // if(this.spinShow){
      //     self.$Message.warning('资料已经下载，请勿重复点击');
      //     return
      // }
      // if(this.nowDownload){
      //     self.$Message.warning('资料正在下载，请稍后');
      //     return
      // }

      let formData = new FormData()
      formData.append('servicesId', this.leftForm.transformProxyWorkOrderServiceId)
      formData.append('fileType', fileType)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/derive/management/download/authorization/es/transformproxy', true)
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
          self.spinShow = false
          self.nowDownload = false
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
    download() {
      let self = this;
      if (this.spinShow) {
        self.$Message.warning('资料已经下载，请勿重复点击');
        return
      }
      if (this.nowDownload) {
        self.$Message.warning('资料正在下载，请稍后');
        return
      }
      this.nowDownload = true
      let formData = new FormData()
      formData.append('workId', this.workId)
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/tax/workorder/management/down/proxy/material', true)
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        let fileName = ''
        if (xmlResquest.getResponseHeader('content-disposition')) {
          fileName = decodeURI(xmlResquest.getResponseHeader('content-disposition').split(";")[1].split("=")[1]);
          self.spinShow = true
        } else {
          self.$Message.warning('下载出错！');
          self.spinShow = false
          self.nowDownload = false
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
    sureEnterHaugeInfo() {
      if (this.hagueFeil.hyFile == '') {
        this.$Message.error('请录入海牙文件')
        return
      }
      this.hagueFeil.serviceId = this.serviceId
      API.luruHaguefeil(this.hagueFeil).then(res => {
        if (res.code == 0) {
          this.$Message.success('录入成功')
          this.$emit('back')
          this.$emit('refresh')
        }
      })
    },
    //税号文件上传之前
    beforeVatFileUpload() { },
    //税号文件上传成功
    hagueFeilFileUploadSuccess(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.hagueFeil[item] = res.data.fileUrl
    },
    //移除税号文件
    removeHagueFeilFile(file, fileList, item) {
      this.hagueFeil[item] = ''
    },
  }
}
</script>

<style lang="less" scoped>
.dingwei {
  position: absolute;
  font-size: 14px;
  color: rgb(237, 64, 20);
  left: 84px;
  top: 34px;
}
.footer {
  font-size: 16px;
  color: #333;
  padding-left: 30px;
  .top {
    color: red;
    margin-bottom: 30px;
  }
  .footer-title {
    margin-bottom: 7px;
    font-weight: 600;
    span {
      color: red;
      margin-right: 3px;
    }
  }
  .footer-content {
    margin-bottom: 20px;
    span {
      cursor: pointer;
    }
    a {
      color: #333;
    }
    .content-left {
      color: rgb(22, 173, 233);
      margin-right: 10px;
    }
  }
}
.container {
  .back {
    margin-bottom: 10px;
    cursor: pointer;
  }
  .left {
    width: 90%;
    margin-right: 10px;
  }
  .right {
    width: 300px;
    margin-left: 10px;
    /deep/ .ivu-form-item {
      margin-bottom: 0px;
    }
    .addGetWatId {
      margin-left: 20px;
      color: #2d8cf0;
      border-bottom: 1px solid #2d8cf0;
      cursor: pointer;
    }
    .operationLogs {
      .logsContent {
        font-size: 12px;
      }
      .itemTop {
        font-weight: bold;
      }
      .itemBottom {
        margin-bottom: 10px;
        border-bottom: 1px #f2f2f2 dashed;
        padding-bottom: 5px;
      }
    }
  }
}
/deep/ .ivu-select-dropdown-list {
  max-height: 200px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: end;
}
.hauge-header {
  text-align: center;
  font-weight: 700;
  color: #333;
}
.hauge-content {
  padding: 12px;
  background-color: #f2f2f2;
  p {
    line-height: 30px;
  }
}
</style>