<template>
  <div class="mainContent"
       :style="contentStyleObj">
    <div class="content">
      <Card class="content-l">
        <Card>
          <span @click="goBack()"
                class="back">
            <Icon type="md-arrow-back" />返回列表</span>
          <Button type="primary"
                  style="float:right;"
                  @click="uploadInfo"
                  v-show="hasAuthority('task_list05')"
                  v-if="(progressBar==3||progressBar==5)&&countryCode!='JP'&&serviceTemplatetype==1">下载商标资料</Button>
          <Button type="primary"
                  style="float:right;"
                  @click="uploadInfoExcel"
                  v-show="hasAuthority('task_list05')"
                  v-if="(progressBar==3||progressBar==5)&&serviceTemplatetype==2">下载商标资料</Button>
          <Button type="primary"
                  style="float:right;margin-right:8px;"
                  @click="sendMessage"
                  v-if="progressBar==1">短信提醒</Button>
          <Button type="primary"
                  style="float:right;margin-right:8px;"
                  @click="auditModal=true"
                  v-show="hasAuthority('task_list04')"
                  v-if="progressBar==2">初审驳回</Button>
          <Button type="primary"
                  style="float:right;margin-right:8px;"
                  @click="auditModal=true"
                  v-show="hasAuthority('task_list06')"
                  v-if="progressBar==5">律师驳回</Button>
          <Button type="primary"
                  style="float:right;margin:0 8px;"
                  v-show="hasAuthority('task_list04')"
                  @click="firstAuditFunc"
                  v-if="progressBar==2">审核通过</Button>
          <Button type="primary"
                  style="float:right;margin-right:8px;"
                  @click="acceptInfoModal=true"
                  v-show="hasAuthority('task_list06')"
                  v-if="(progressBar==3||progressBar==5)">{{progressBar==5?'律师通过':progressBar==3?'录入受理信息':''}}</Button>
        </Card>
        <div v-if="!isEditor">
          <BreadInfoDetailsUS v-if="countryCode=='US' &&requestEnd&&productFunctionCode==1"
                              :formInfo="formInfo"
                              :countryCode="countryCode"
                              :servicesId="servicesId"
                              :isEditor="isEditor"></BreadInfoDetailsUS>
          <BreadInfoDetailsUSNo v-else-if="countryCode=='US' &&requestEnd&&productFunctionCode==3"
                                :formInfo="formInfo"
                                :countryCode="countryCode"
                                :servicesId="servicesId"
                                :isEditor="isEditor"></BreadInfoDetailsUSNo>
          <BreadInfoDetailsEU v-else-if="countryCode=='EU' &&requestEnd"
                              :formInfo="formInfo"
                              :countryCode="countryCode"
                              :servicesId="servicesId"
                              :isEditor="isEditor"
                              :categoryCount="categoryCount"></BreadInfoDetailsEU>
          <BreadInfoDetailsGB v-else-if="countryCode=='GB' &&requestEnd"
                              :formInfo="formInfo"
                              :countryCode="countryCode"
                              :servicesId="servicesId"
                              :isEditor="isEditor"
                              :categoryCount="categoryCount"></BreadInfoDetailsGB>
          <BreadInfoDetailsJP v-else-if="countryCode=='JP' &&requestEnd"
                              :formInfo="formInfo"
                              :countryCode="countryCode"
                              :servicesId="servicesId"
                              :isEditor="isEditor"
                              :categoryCount="categoryCount"></BreadInfoDetailsJP>
          <BreadInfoDetailsOther v-if="serviceTemplatetype==2&&requestEnd"
                                 :formInfo="formInfo"
                                 :countryCode="countryCode"
                                 :servicesId="servicesId"
                                 :isEditor="isEditor"
                                 :categoryCount="categoryCount"></BreadInfoDetailsOther>
        </div>
        <BrandDetail v-if="isEditor"
                     :orderId="servicesId"
                     @backPage="goBack()"
                     @changeInfo="changeInfo"></BrandDetail>
      </Card>
      <div class="content-r">
        <Card v-if="orderInfo.length>0">
          <p slot="title">
            <span>服务信息</span>
          </p>
          <Form>
            <FormItem label="订单编号：">
              <span>{{orderAndServicesDetail.orderNo}}</span>
            </FormItem>
            <FormItem label="服务编号：">
              <span>{{orderInfo[0].serverNo}}</span>
            </FormItem>
            <FormItem label="服务名称：">
              <span>{{orderInfo[0].productName}}</span>
            </FormItem>
            <FormItem label="服务项目：">
              <span>{{categoryCount==1?'一标一类':categoryCount==2?'一标二类':categoryCount==3?'一标三类':categoryCount==4?'一标四类':categoryCount==5?'一标五类':categoryCount==6?'一标六类':categoryCount==7?'一标七类':'一标多类'}}</span>
            </FormItem>
            <FormItem label="国家：">
              <span>{{orderInfo[0].countryNameZh}}</span>
            </FormItem>
            <FormItem label="状态：">
              <span>{{$iiptoProgressBar(servicesInfo.progressBar)}}</span>
            </FormItem>
            <FormItem label="创建时间：">
              <span>{{servicesInfo.createTime}}</span>
            </FormItem>
            <FormItem label="受理号：">
              <span>{{servicesInfo.acceptNum}}</span>
            </FormItem>
            <FormItem label="受理号日期：">
              <span v-if="servicesInfo.acceptTime!=''">{{servicesInfo.acceptTime.slice(0,10)}}</span>
            </FormItem>
            <FormItem label="律师：">
              <span v-if="attorneyInfo.attorneyName!=''">{{attorneyInfo.attorneyName}}</span>
            </FormItem>
            <FormItem label="订单备注：">
              <span>{{orderAndServicesDetail.remark||'无'}}</span>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;"
              v-if="JSON.stringify(userInfo)!='{}'">
          <p slot="title">用户信息</p>
          <Form>
            <FormItem label="用户昵称：">
              <span>{{userInfo.nickname}}</span>
            </FormItem>
            <FormItem label="手机号：">
              <span>{{userInfo.mobile}}</span>
            </FormItem>
            <FormItem label="企业名称：">
              <span>{{userInfo.companyName}}</span>
            </FormItem>
            <FormItem label="所在地：">
              <span>{{userInfo.province}}{{userInfo.city}}</span>
            </FormItem>
            <FormItem label="注册时间：">
              <span>{{userInfo.createTime}}</span>
            </FormItem>
          </Form>
        </Card>
        <!-- <Card style="margin-top: 6px;">
          <p slot="title">
            <span>驳回记录</span>
          </p>
          <Form :label-width=100
                v-for="(item,index) in operationLog"
                :key="index">
            <div class="log-box"
                 v-if="item.behavior==3||item.behavior==4">
              <p class="log-title">{{item.behavior==3?'初审驳回':'律师驳回'}}</p>
              <FormItem label="原因：">
                <span>{{item.remark}}</span>
              </FormItem>
              <FormItem label="时间：">
                <span>{{item.operateDate}}</span>
              </FormItem>
              <FormItem label="操作人：">
                <span>{{item.adminUserNickName}}</span>
              </FormItem>
            </div>
          </Form>
        </Card> -->
        <Card style="margin-top: 6px;"
              class="operation-box">
          <p slot="title">
            <span>操作记录</span>
          </p>
          <Form v-for="(item,index) in operationLog"
                :key="index">
            <div class="log-box"
                 v-if="index<operationLogLen">
              <p class="log-title">{{item.behavior==1?'后台提交资料':item.behavior==2?'后台重新提交资料':item.behavior==3?'初审驳回':item.behavior==4?'律师驳回':item.behavior==5?'录入受理号':item.behavior==6?'退款':item.behavior==7?'下载资料':item.behavior==8?'初审通过':item.behavior==9?'律师通过':''}}</p>
              <FormItem label="时间：">
                <span>{{item.operateDate}}</span>
              </FormItem>
              <FormItem label="操作人：">
                <span>{{item.adminUserNickName}}</span>
              </FormItem>
              <FormItem label="备注：">
                <span>{{item.remark}}</span>
              </FormItem>
            </div>
          </Form>
          <p style="text-align:right;margin-top:10px;color:blue;cursor:pointer;"
             v-if="operationLog.length>3&&operationLogLen==3"
             @click="operationLogLen=operationLog.length">查看更多》</p>
        </Card>
      </div>
    </div>

    <Modal v-model="auditModal"
           title="审核资料">
      <p>
        <Input v-model="remark"
               type="textarea"
               placeholder="请输入驳回原因" />
      </p>
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="auditModal=false">取消</Button>
        <Button type="primary"
                @click="rowSureAudit">确认</Button>
      </p>
    </Modal>
    <Modal v-model="lawyerModal"
           title="选择代理律师">
      <Select @on-change="changeLawyer">
        <Option v-for="(v,i) in lawyerList"
                :key="i"
                :value="v.id">{{v.attorneyName}}</Option>
      </Select>
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="lawyerModal=false">取消</Button>
        <Button type="primary"
                @click="lawyerSureAudit">确认</Button>
      </p>
    </Modal>
    <Modal v-model="acceptInfoModal"
           title="录入受理信息">
      <p style="color:red;font-size:14px;">请核对律师信息后，再录入受理信息。</p>
      <p style="margin:10px 0;font-size:14px;">代理律师：{{attorneyInfo.attorneyName}}</p>
      <p>
        <span>受理号</span>
        <Input v-model="acceptObj.acceptNum"
               placeholder="请输入受理号"
               style="width:300px;margin-left:70px;" />
        <br>
        <span>获得受理号的日期</span>
        <DatePicker type="date"
                    placeholder="选择获得受理号的日期"
                    v-model="acceptObj.acceptTime"
                    :options="options"
                    style="margin-top:10px;width:300px;margin-left:10px;"></DatePicker>
      </p>
      <!-- <p style="margin:14px 0;">上传受理回执（选填）</p>
      <Upload :format="['jpg','pdf']"
              :action="workOrderFile"
              :before-upload="beforeUploadAccept1"
              :on-format-error="formatErrorHandler"
              :show-upload-list="false"
              :on-success="(res,file,fileList)=>{successHandlerAccept(res,file,fileList,'acceptReceipt')}"
              :on-remove="(file,fileList)=>{removeHandlerAccept (file,fileList,'acceptReceipt')}"
              style="accept-upload">
        <Button icon="ios-cloud-upload-outline">上传文件</Button>
      </Upload>
      <p v-if="acceptObj.acceptReceipt!=''"
         style="margin-top:10px;">
        <a :href="acceptObj.acceptReceipt"
           target="_blank">受理回执</a>
        <img src="@/assets/images/infoDetail/del.png"
             style="margin-left:10px;vertical-align: sub;"
             @click="removeHandlerAccept('','','acceptReceipt')"
             alt="">
      </p>

      <p style="margin:14px 0;">上传受理书（选填）</p>
      <Upload :format="['jpg','pdf']"
              :action="workOrderFile"
              :before-upload="beforeUploadAccept2"
              :on-format-error="formatErrorHandler"
              :show-upload-list="false"
              :on-success="(res,file,fileList)=>{successHandlerAccept(res,file,fileList,'acceptBook')}"
              :on-remove="(file,fileList)=>{removeHandlerAccept (file,fileList,'acceptBook')}"
              style="accept-upload">
        <Button icon="ios-cloud-upload-outline">上传文件</Button>
      </Upload>
      <p v-if="acceptObj.acceptBook!=''"
         style="margin-top:10px;">
        <a :href="acceptObj.acceptBook"
           target="_blank">受理书</a>
        <img src="@/assets/images/infoDetail/del.png"
             style="margin-left:10px;vertical-align: sub;"
             @click="removeHandlerAccept('','','acceptBook')"
             alt="">
      </p>
      <p>支持扩展名：.pdf .jpg，最多一个文件</p> -->
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="acceptInfoModal=false">取消</Button>
        <Button type="primary"
                @click="acceptSureAudit">确认</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import BrandDetail from './brandDetail'
import BreadInfoDetailsUS from './components/breadInfoDetailsUS'
import BreadInfoDetailsUSNo from './components/breadInfoDetailsUSno'
import BreadInfoDetailsEU from './components/breadInfoDetailsEU'
import BreadInfoDetailsGB from './components/breadInfoDetailsGB'
import BreadInfoDetailsJP from './components/breadInfoDetailsJP'
import BreadInfoDetailsOther from './components/BreadInfoDetailsOther'
import { trademarkDetailApi, workorderRejectApi, workorderAssignApi, getLawyerInfoApi, acceptInfoApi, firstAuditApi } from "@/api/iipto/breadInfoDetail";
import { batchMessageTrs } from '@/api/iipto/workOrder'
import { getToken } from '@/libs/util';
export default {
  props: ['servicesId', 'orderStatus', 'countryCode', 'categoryCount', 'productFunctionCode', 'serviceTemplatetype'],
  components: {
    BrandDetail,
    BreadInfoDetailsUS,
    BreadInfoDetailsEU,
    BreadInfoDetailsGB,
    BreadInfoDetailsJP,
    BreadInfoDetailsUSNo,
    BreadInfoDetailsOther
  },
  data() {
    return {
      contentStyleObj: {
        "min-height": ""
      },
      options: {
        disabledDate(date) {
          return (date > Date.now())
        }
      },
      formInfo: {
        applyType: '1',
        trademarkType: '1',
        trademarkNameEn: '',
        trademarkLogo: '',
        trademarkCategory1Num: '',
        trademarkCategory2Num: '',
        firstUseDate: '',
        firstBusinessUseDate: '',
        marketHref: '',
        applyCompanyEn: '',
        applyCountryEn: '',
        applyLastNameEn: '',
        applyNameEn: '',
        applyProvinceEn: '',
        applyCityEn: '',
        businessLicense: '',
        identityCardFront: '',
        identityCardReverse: '',
        otherSmallLanguagesFiles: '',
        applyProvinceZh: '',
        applyCityZh: ''
      },
      isEditor: false,
      workId: '',
      auditModal: false,
      lawyerModal: false,
      acceptInfoModal: false,
      isAudit: '1',
      remark: '',
      lawyerList: [],
      lawyerId: '',
      acceptObj: {
        acceptNum: '',
        acceptTime: '',
        acceptReceipt: '',
        acceptBook: ''
      },
      serverNo: '',
      progressBar: '',
      servicesInfo: {},
      orderInfo: [],
      orderAndServicesDetail: {},
      userInfo: {},
      operationLog: [],
      operationLogLen: 3,
      requestEnd: false,
      attorneyInfo: {},
      returnData: {}
    }
  },
  methods: {
    getHeight() {
      this.contentStyleObj["min-height"] = window.screen.height - 240 + "px";
    },
    goBack() {
      this.$emit('back')
    },
    //发送短信提醒
    sendMessage() {
      batchMessageTrs({ serviceId: this.servicesId }).then(res => {
        if (res.code == 0) {
          this.$Message.success('短信发送成功')
        }
      })
    },
    getLawyerList() {
      let data = {
        limit: 20,
        page: 1,
        isOpen: '1',
        countryCode: this.countryCode
      }
      getLawyerInfoApi(data).then(res => {
        if (res.code == 0) {
          this.lawyerList = res.data
        }
      })
    },
    beforeUploadAccept1() {
      const check = this.acceptObj.acceptReceipt
      let checks = false
      let self = this;
      if (check != '') {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
        checks = false;
      } else {
        checks = true
      }
      return checks
    },
    beforeUploadAccept2() {
      const check = this.acceptObj.acceptBook
      let checks = false
      let self = this;
      if (check != '') {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
        checks = false;
      } else {
        checks = true
      }
      return checks
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg,pdf格式的文件"
      });
    },
    formatErrorHandler2() {
      this.$Notice.warning({
        title: "文件格式错误",
        desc: "文件格式不正确, 请上传jpg,png,bpm格式的文件"
      });
    },
    removeHandler(i, item) {
      item.splice(i, 1)
    },
    successHandlerAccept(res, file, fileList, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: "警告",
          desc: "请尝试再次上传"
        });
        return false;
      }
      this.acceptObj[item] = res.data.fileUrl
    },
    removeHandlerAccept(file, fileList, item) {
      this.acceptObj[item] = ''
    },
    changeInfo(type) {
      this.isEditor = false
      this.editorAddress = true
    },
    //获取工单资料
    getDetailFun() {
      let data = {
        servicesId: this.servicesId
      }
      trademarkDetailApi(data).then(res => {
        if (res.code == 0) {
          if (JSON.stringify(res.data.trademarkWorkOrder) != '{}') {

            if (res.data.trademarkWorkOrder.operateLogs != '') {
              this.operationLog = JSON.parse(res.data.trademarkWorkOrder.operateLogs)
            }
            this.returnData = { ...res.data.trademarkWorkOrder }
            this.acceptObj = {
              acceptNum: this.returnData.acceptNum,
              acceptTime: this.returnData.acceptTime,
              acceptReceipt: this.returnData.acceptReceipt,
              acceptBook: this.returnData.acceptBook
            }
            if (this.acceptObj.acceptTime == '') {
              this.acceptObj.acceptTime = (new Date()).pattern("yyyy-MM-dd")
            }
          }
          if (JSON.stringify(res.data.services) != '{}') {
            this.workId = res.data.trademarkWorkOrder.id
            this.serverNo = res.data.services.serverNo
            this.progressBar = res.data.services.progressBar
            this.servicesInfo = res.data.services
          }
          if (res.data.orderProductList.length > 0) {
            this.orderInfo = res.data.orderProductList
          }
          if (JSON.stringify(res.data.user) != '{}') {
            this.userInfo = res.data.user
          }
          if (JSON.stringify(res.data.attorneyInfo) != '{}') {
            this.attorneyInfo = res.data.attorneyInfo
          }
          if (JSON.stringify(res.data.orderAndServicesDetailVo) != '{}') {
            this.orderAndServicesDetail = res.data.orderAndServicesDetailVo
          }
        }
      }).finally(() => {
        if (JSON.stringify(this.returnData) != '{}') {
          this.formInfo = { ...this.returnData }
        }
        this.formInfo.serviceTemplatetype = this.serviceTemplatetype
        this.requestEnd = true
      })
    },
    rowSureAudit() {
      let data = {
        workId: this.workId,
        remark: this.remark
      }
      workorderRejectApi(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('审核成功')
          this.auditModal = false
          this.getDetailFun()
        }
      })
    },
    changeLawyer(data) {
      this.lawyerId = data
    },
    lawyerSureAudit() {
      let data = {
        attorneyId: this.lawyerId,
        workId: this.workId
      }
      workorderAssignApi(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('提交成功')
          this.lawyerModal = false
          this.getDetailFun()
        }
      })
    },
    acceptSureAudit() {
      if (this.acceptObj.acceptNum == '') {
        this.$Message.error('请填写受理号')
        return
      }
      if (this.acceptObj.acceptTime == '') {
        this.$Message.error('请选择获得受理号的日期')
        return
      }
      this.$Modal.confirm({
        title: '',
        content: '请再次确认录入的受理信息无误后，点击确定',
        onOk: () => {
          let data = {
            workId: this.workId,
            acceptNum: this.acceptObj.acceptNum,
            acceptTime: this.formatDate(this.acceptObj.acceptTime, 'date'),
            // acceptReceipt: this.acceptObj.acceptReceipt,
            // acceptBook: this.acceptObj.acceptBook
          }
          acceptInfoApi(data).then(res => {
            this.$Message.success('提交成功')
            this.acceptInfoModal = false
            this.getDetailFun()
          })
        },
        onCancel: () => {
        }
      });
    },
    uploadInfo() {
      let self = this
      let formData = new FormData()
      // formData.append('trademarkWorkId', this.workId)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('get', this.baseUrl + '/trademark/console/workorder/management/zipdowload?trademarkWorkId=' + this.workId, true)
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        let fileName = ''
        if (oEvent.currentTarget.status == 200 && oEvent.currentTarget.readyState == 4) {
          fileName = self.serverNo + '.zip'
        } else {
          self.$Message.warning('文件内容缺失，请补全再下载！');
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
    uploadInfoExcel() {
      let self = this
      let formData = new FormData()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('get', this.baseUrl + '/trademark/console/workorder/management/downloadExcel?trademarkWorkId=' + this.workId, true)
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        let fileName = ''
        if (oEvent.currentTarget.status == 200 && oEvent.currentTarget.readyState == 4) {
          fileName = self.serverNo + '.zip'
        } else {
          self.$Message.warning('文件内容缺失，请补全再下载！');
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
    //初步审核通过
    firstAuditFunc() {
      this.$Modal.confirm({
        title: '确认审核通过？',
        okText: '确定',
        cancleText: '取消',
        onOk: () => {
          firstAuditApi({ workId: this.workId }).then(res => {
            if (res.code == 0) {
              this.$Message.success('操作成功')
              this.getDetailFun()
              if (this.countryCode == 'JP') {
                window.open('http://3z8a9c51gg.shhttp.cn/run_japan_trademark?id=' + this.servicesId)
              }
            }
          })
        },
      })
    }
  },
  mounted() {
    this.getHeight()
    this.getDetailFun()
    // this.getLawyerList()
    this.progressBar = this.orderStatus
    if (this.orderStatus == 1) {
      this.isEditor = false
    } else {
      this.isEditor = true
    }
  },
}
</script>
<style lang="less" scoped>
.back {
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;
}
.mainContent {
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  background: #fff;
  padding: 24px;
  margin-bottom: 44px;
  width: 100%;
}
.content {
  display: flex;
  .content-l {
    flex: 1;
  }
  .content-r {
    width: 250px;
    margin-left: 10px;
    /deep/ .ivu-form-item {
      margin-bottom: 0;
    }
    /deep/ .ivu-form-item-label {
      color: #000;
    }
    /deep/ .ivu-form-item-content {
      color: #666;
      span {
        white-space: break-spaces;
        display: block;
        max-width: 200px;
        word-break: break-all;
      }
    }
  }
}

.log-box {
  .log-title {
    color: #000;
    font-weight: 600;
  }
}
/deep/ .ivu-modal-body {
  .submit-tip-title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    .imgs {
      display: inline-block;
      width: 26px;
      height: 26px;
    }
  }
}

/deep/ .upload-logo .ivu-upload {
  width: 156px;
  height: 156px;
  display: inline-block;
}
/deep/ .ivu-form-item-content {
  width: 398px;
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
/deep/ .proof-box .upload-proof {
  width: 398px;
  height: 180px;
  background: #f4f7fc;
  border-radius: 8px;
  border: 1px dashed #cfcfcf;
  text-align: center;
  padding-top: 56px;
  margin-top: 7px;
  p {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #999999;
    margin-top: 8px;
  }
}
// /deep/ .ivu-upload-list {
//   margin-top: 62px;
//   text-align: left;
// }
/deep/ .ivu-modal-header {
  padding: 24px;
  background-color: #fff !important;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  border-radius: 4px;
}
</style>

