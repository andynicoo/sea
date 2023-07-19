<template>
  <div>
      <div :style="contentStyleObj" v-if="status == 39 || status == 43">
        <div class="title" style="padding-bottom: 16px;">
          <span>上传海牙信息</span>
          <span class="line">（西班牙海牙认证）</span>
          <div class="ziliao" v-if="status == 43 && container1">
            <p style="width:892px;margin:0 auto;position:relative;">
              <img src="@/assets/images/hague/bohui1.svg">
              <span class="guding1" style="top:28px">提交时间：{{ infoForm.submitMaterialTime }}</span>
            </p>
            <div class="top-reason">
              <p>
                <img src="@/assets/images/common/reason.png">
                西班牙海牙认证资料被驳回（原因：
                <span>{{leftForm.remark}}</span>）
              </p>
            </div>
          </div>
        </div>
        <div class="container1" v-if="container1">
          <div class="xinxi">
              <p class="xuanze">请选择您需要做海牙认证的税号信息：</p>
              <p class="tishi commen">
                  <img src="@/assets/images/hague/Shape.png">
                  <span>温馨提示：目前海牙认证仅支持在平台购买过西班牙转代理服务的客户，如有疑问，可联系客服！</span>
              </p>
              <p class="commen">
                  <span class="content-left">认证国家：</span>
                  <span class="content-right">西班牙</span>
              </p>
              <p class="commen" style="position:relative">
                  <span class="content-left">公司名称：</span>
                  <span>
                      <!-- <Select v-model="companyName" style="width:300px" placeholder="请选择需要海牙认证的公司名称">
                          <Option v-for="item in companyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select> -->
                      <AutoComplete
                        v-model="leftForm.companyNameZh"
                        @on-change="handleSearch"
                        placeholder="请填写需要海牙认证的公司名称"
                        style="width:300px;">
                        <Option v-for="(item,index) in companyList" :value="item.companyNameZh" :key="index">{{ item.companyNameZh }}</Option>
                      </AutoComplete>
                  </span>
                  <br/>
                  <span class="dingwei" v-if="errorContent">请填写正确的公司名称</span>
              </p>
              <p class="commen">
                  <span class="content-left">公司英文名称：</span>
                  <span class="content-right">{{leftForm.companyNameEn || '暂无'}}</span>
              </p>
              <p class="commen">
                  <span class="content-left">VAT税号：</span>
                  <span class="content-right">{{leftForm.vatTaxNumber || '暂无'}}</span>
              </p>
          </div>
          <div class="files-example">
              <p class="beizhu">备注：以下资料下载打印后需要进行线下邮寄（法人签名及盖章、授权书需要盖骑缝章、建议彩色打印）；</p>

          <Row>
              <Col :span="12">
              <p>
                  <span class="xing">*</span>
                  <span class="shouquan">授权书：</span>
              <p class="dwimg">
                  <span style="margin-right: 24px;">
                      <a href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1ZiAbdA4AAsuRQ2eESA296.pdf"
                          style="color: #16ade9;"
                          target="_blank">
                          <img src="@/assets/images/hague/down.png">
                          查看示例
                      </a>
                  </span>
                  <span @click="esDownLoad('1')" style="color: #16ade9;">
                      <img src="@/assets/images/hague/kan.png">
                      点击下载
                  </span>
              </p>
              
              </p>
              </Col>
              <Col :span="12">
              <p>
                  <span class="xing">*</span>
                  <span class="shouquan">海牙中西语授权书：</span>
              <p class="dwimg">
                  <span style="margin-right: 24px;">
                      <a href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1cmAP8yUAA46SnMkOwE525.pdf"
                          style="color: #16ade9;"
                          target="_blank">
                          <img src="@/assets/images/hague/down.png">
                          查看示例
                      </a>
                  </span>
                  <span @click="esDownLoad('2')" style="color: #16ade9;">
                      <img src="@/assets/images/hague/kan.png">
                      点击下载
                  </span>
              </p>
              
              </p>
              </Col>
              <Col :span="12">
              <p style="margin-top: 18px;">
                  <span class="xing">*</span>
                  <span class="shouquan">OtorgaApodera_es_es 中文版：</span>
              
                <p class="dwimg">
                        <span style="margin-right: 24px;">
                            <a href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1eaAUNtyAAS_eQxSV9E201.pdf"
                                style="color: #16ade9;"
                                target="_blank">
                                <img src="@/assets/images/hague/down.png">
                                查看示例
                            </a>
                        </span>
                    <span @click="esDownLoad('3')" style="color: #16ade9;">
                        <img src="@/assets/images/hague/kan.png">
                        点击下载
                    </span>
                </p>
              
              </p>
              </Col>
              <Col :span="12">
                <p style="margin-top: 18px;">
                    <span class="xing">*</span>
                    <span class="shouquan">OtorgaApodera_es_es 西语版：</span>
                  <p class="dwimg">
                      <span style="margin-right: 24px;">
                          <a href="https://pre-fdfs.itaxs.com/group1/M00/00/CD/rBLKLV_R1g6AW77_AAJ9-6Djk6Y416.pdf"
                          style="color: #16ade9;"
                          target="_blank">
                          <img src="@/assets/images/hague/down.png">
                          查看示例
                          </a>
                      </span>
                      <span @click="esDownLoad('4')" style="color: #16ade9;">
                          <img src="@/assets/images/hague/kan.png">
                          点击下载
                      </span>
                  </p>
                </p>
              </Col>
          </Row>
              <p class="add-title"><span class="xing" style="margin-right: 3px;">*</span>寄送地址：</p>
              <p class="jisong">
                  <img src="@/assets/images/hague/Shape1.png" >
                  <span>备注：寄送资料后即可，平台收到后会立即处理；</span>
              </p>
              <div class="address-box">
                  <p class="info">
                      <span class="info-title">收件人：</span>
                      <span class="info-content">跨税云注册组</span>
                  </p>
                  <p class="info">
                      <span class="info-title">联系电话：</span>
                      <span class="info-content">15323756779</span>
                  </p>
                  <p class="info">
                      <span class="info-title">寄送地址：</span>
                      <span class="info-content">广东省深圳市龙岗区天安云谷2期4栋34楼</span>
                  </p>
                  <p class="info-remark">备注：1、寄送费用由寄方承担； 2、收到资料后即可递交税局，建议3天内邮寄哦</p>
              </div>
          </div>
          <p class="sub"><Button type="primary" style="width:98px;height:32px" @click="submit">提交</Button></p>
          <div class="liucheng">
              <p class="shuoming">海牙认证流程说明：</p>
              <img src="@/assets/images/hague/liucheng1.svg" style="margin-left:117px;">
          </div>
          <div style="height:24px"></div>
        </div>
        <div class="container2" v-if="container2">
          <p>
            <img src="@/assets/images/hague/chenggong.png">
          </p>
          <p class="success">提交海牙资料成功，已通知税务师进行审核！</p>
          <p class="time">提交时间：<span>{{ nowTime }}</span></p>
          <p class="anniu">
            <Button type="info" ghost style="width:142px;height:32px" @click="toUse">返回工作台</Button>
            <!-- <Button type="info" style="width:142px;height:32px;margin-left:12px" @click="toUse">去使用</Button> -->
          </p>
          <div class="erweima">
            <p>关注跨税云公众号，实时查看VAT进度；</p>
            <img src="@/assets/images/hague/erweima.jpg">
          </div>
        </div>
      </div>
      
      <div :style="contentStyleObj" v-if="status == 40 || status == 41 || status == 42 || status == 5">
        <div class="title" style="border:none">
          <span>详情</span>
          <span class="line">（西班牙海牙认证）</span>
          <div class="ziliao">
            <p style="width:892px;margin:0 auto;position:relative;">
              <img src="@/assets/images/hague/daishenhe1.svg" v-if="status == 40">
              <img src="@/assets/images/hague/dairenzheng.svg" v-if="status == 5">
              <img src="@/assets/images/hague/renzhengzhong1.svg" v-if="status == 41">
              <img src="@/assets/images/hague/renzhengwancheng1.svg" v-if="status == 42">
              <span class="guding1" v-if="status >= 40 || status == 5">提交时间：{{ infoForm.submitMaterialTime }}</span>
              <span class="guding2" v-if="status > 40 || status == 5">审核时间：{{ infoForm.submitHaiyaTime }}</span>
              <span class="guding3" v-if="status >= 41">提交时间：{{ infoForm.confirmHyTime }}</span>
              <span class="guding4" v-if="status == 42">完成时间：{{ infoForm.completeHaiyaTime }}</span>

            </p>
          </div>
          <div style="color:#1890FF">
            <Tabs value="name1">
              <TabPane label="认证资料" name="name1"></TabPane>
            </Tabs>
          </div>
          
        </div>
        <div class="main">
          <p class="base">基础信息</p>
          <p class="mt24">
            <span class="left">认证国家：</span>
            <span class="right">西班牙</span>
          </p>
          <p class="mt24">
            <span class="left">公司名称：</span>
            <span class="right">{{ infoForm.companyNameZh }}</span>
          </p>
          <p class="mt24">
            <span class="left">公司英文名称：</span>
            <span class="right">{{ infoForm.companyNameEn}}</span>
          </p>
          <p class="mt24">
            <span class="left">VAT税号：</span>
            <span class="right">{{ infoForm.vatTaxNumber }}</span>
          </p>
          <p class="mt24" v-if="status == 42">
            <span class="left">海牙认证：</span>
            <a :href="infoForm.hyFile" target="_blank" class="file" style="color:#FA5555">海牙文件</a>
          </p>
        </div>
      </div>
      <Spin size="large"
          fix
          v-if="spinShow">
      <Icon type="ios-loading"
            size=18
            class="demo-spin-icon-load"></Icon>
      <div class="loadingText">{{operateText}}</div>
      </Spin>
    <Modal v-model="tipsModal">
      <div class="tipsModal-title">温馨提示</div>
      <Divider style="margin:16px 0;" />
      <div class="tipsModal-contnet">
        <p class="tip-title">您的资料审核未通过，请按照以下指引修改...</p>
        <p>{{leftForm.remark}}</p>
      </div>
      <div slot="footer">
        <Button type="primary"
                @click="tipsModal=false">知道了</Button>
      </div>
    </Modal>
  </div>
  
</template>
<script>
import { getEScompany,subESFeil,getESXiangQing } from '@/api/hague/hague'
export default {
  data() {
    return {
      contentStyleObj:{
        'min-height':''
      },
      tipsModal:false,
      nowTime:'',
      spinShow: false,
      type: 1,
      servicesId: this.$route.query.servicesId,
      productFunctionCode: this.$route.query.productFunctionCode,
      supplierId: this.$route.query.supplierId,
      status: this.$route.query.status,
      errorContent:false,
      container1:true,
      container2:false,
      infoForm:{},
      leftForm:{
        companyNameZh:'',
        companyNameEn:'',
        vatTaxNumber:'',
        remark:'',
        transformProxyWorkOrderServiceId:''
      },
      companyList:[],
      infoList:[]
    }
  },
  methods: {
    toPay(){
      this.$router.replace('/serviceList')
    },
    toUse(){
      this.$router.replace('/work')
    },
    submit(){
      if(this.leftForm.companyNameZh == ''){
        this.$Message.error("请填写公司名称")
        return
      }
      if(this.leftForm.companyNameEn == '' || this.leftForm.vatTaxNumber == '' || this.errorContent){
        this.$Message.error("请填写正确的公司名称")
        return
      }
      this.leftForm.orderServicesId = this.servicesId
      console.log(this.leftForm)
      this.$Modal.confirm({
        title: '提示',
        content: '是否确认提交',
        onOk: () => {
          subESFeil(this.leftForm).then(res => {
            if (res.code == 0) {
              let date = new Date()
              let month = (date.getMonth() + 1)<10? '0'+ (date.getMonth()+1):date.getMonth()
              let day = date.getDate()<10? ('0' + date.getDate()):date.getDate()
              let hour = date.getHours()<10? ('0' + date.getHours()):date.getHours()
              let min = date.getMinutes()<10? ('0' + date.getMinutes()):date.getMinutes()
              this.nowTime = date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + min
              this.container2 = true
              this.container1 = false
              this.$Message.success('提交成功')
            }else{
              this.$Message.error(res.message)
            }
          })
        },
      });
      
    },
    getEScompanyList(){
      getEScompany().then(res=>{
        if(res.code == 0){
          this.infoList = res.data
          if(this.status == 39){
            this.companyList = this.infoList
          }else if(this.status == 43){
            this.companyList = this.infoList.filter(item=>item.companyNameZh.indexOf(this.leftForm.companyNameZh) != -1)
          }
          
        }
      })
    },
    getInfo(){
      getESXiangQing({servicesId:this.servicesId}).then(res=>{
        if(res.code == 0){
          this.infoForm = res.data
          this.infoForm.submitMaterialTime = this.infoForm.submitMaterialTime.slice(0,10)
          this.infoForm.submitHaiyaTime = this.infoForm.submitHaiyaTime.slice(0,10)
          this.infoForm.completeHaiyaTime = this.infoForm.completeHaiyaTime.slice(0,10)
          this.infoForm.confirmHyTime = this.infoForm.confirmHyTime.slice(0,10)
          if(this.status == 43){
            this.leftForm.companyNameZh = this.infoForm.companyNameZh
            this.leftForm.companyNameEn = this.infoForm.companyNameEn
            this.leftForm.vatTaxNumber = this.infoForm.vatTaxNumber
            this.leftForm.transformProxyWorkOrderServiceId = this.infoForm.transformProxyWorkOrderServiceId
            this.leftForm.remark = this.infoForm.remark
            this.tipsModal = true
            this.getEScompanyList()
          }
        }
      })
    },
    handleSearch(val){
      this.companyList = this.infoList.filter(item=>item.companyNameZh.indexOf(this.leftForm.companyNameZh) != -1)
      // console.log(this.companyList)
      if(this.companyList.length == 0){
        this.leftForm.companyNameEn = ''
        this.leftForm.vatTaxNumber = ''
        this.leftForm.transformProxyWorkOrderServiceId = ''
        // console.log('请填写正确的公司名称')
        this.errorContent = true
        return
      }
      this.errorContent = false
      let item = this.infoList.find(item=>item.companyNameZh == this.leftForm.companyNameZh)
      // console.log(item)
      if(item != undefined){
        this.leftForm.companyNameEn = item.companyNameEn
        this.leftForm.vatTaxNumber = item.vatTaxNumber
        this.leftForm.transformProxyWorkOrderServiceId = item.transformProxyWorkOrderServiceId
        // console.log(this.leftForm.transformProxyWorkOrderServiceId)
      }else{
        this.leftForm.companyNameEn = ''
        this.leftForm.vatTaxNumber = ''
        this.leftForm.transformProxyWorkOrderServiceId = ''
        this.errorContent = true
        if(this.leftForm.companyNameZh == ''){
          this.companyList = this.infoList
          this.errorContent = false
        }
      }
    },
    // 下载西班牙授权资料
    esDownLoad(fileType) {
      if(this.leftForm.companyNameZh == ''){
        this.$Message.error("请先填写公司名称")
        return
      }
      if(this.leftForm.companyNameEn == '' || this.leftForm.vatTaxNumber == '' || this.errorContent){
        this.$Message.error("请填写正确的公司名称")
        return
      }
      let self = this
      this.spinShow = true
      let text = ''
      switch(fileType){
        case '1': text = '授权书'
        break
        case '2': text = '海牙中西语授权书'
        break
        case '3': text = 'OtorgaApodera_es_es 中文版'
        break
        case '4': text = 'OtorgaApodera_es_es 西语版'
        break
        default: text = ''
      }
      this.operateText = '正在下载'+text+'，请稍后'
      let formData = new FormData()
      formData.append('servicesId', this.leftForm.transformProxyWorkOrderServiceId)
      formData.append('fileType', fileType)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/derive/client/download/authorization/es/transformproxy', true)
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
          self.spinShow = false
        } else {
          self.$Message.warning('下载出错！');
          self.spinShow = false
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
  created(){
    if(this.status>39 || this.status==5){
      this.getInfo()
    }else{
      this.getEScompanyList()
    }
  },
  mounted() {
      this.contentStyleObj['min-height'] = (window.screen.height - 60) + "px";
      
    }
}
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
/deep/ .ivu-select-dropdown-list{
  max-height: 200px;
}
.title {
    background-color: rgba(255, 255, 255, 1);
    font-size: 20px;
    font-weight: 600;
    border-bottom: 1px solid #e8e8e8;
    padding: 16px 32px 0 32px;
    
    .line {
      font-size: 14px;
      color:rgba(0, 0, 0, 0.65);
      font-weight: 400;
    }
    .ziliao{
      margin-top:19px;
      text-align:center;
      font-weight: 400;
      .top-reason{
        text-align: left;
        margin-top: 20px;
        padding: 11px 21px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        background: #FFF1DD;
        span{
          color: rgba(250, 85, 85, 1);
        }
        img {
          position: relative;
          top:3px;
        }
      }
      .guding1{
      font-size: 12px;
      font-family: PingFangSC;
      color: #666666;
      position: absolute;
      left:111px;
      top: 26px;
      }
      .guding2{
        font-size: 12px;
        font-family: PingFangSC;
        color: #666666;
        position: absolute;
        left:292px;
        top: 26px;
      }
      .guding3{
        font-size: 12px;
        font-family: PingFangSC;
        color: #666666;
        position: absolute;
        left:476px;
        top: 26px;
      }
      .guding4{
        font-size: 12px;
        font-family: PingFangSC;
        color: #666666;
        position: absolute;
        left:657px;
        top: 26px;
      }
    }
    
  }
.container1 {
    // height: 2000px;
  margin: 24px;
//   background-color: #fff;
  font-family: Source Han Sans SC;
  color: #333;
    .sub{
        text-align: center;
        margin-top: 24px;
        margin-bottom: 24px;
    }
  .xinxi{   
      
    background: #FFFFFF;
    border-radius: 4px;
    padding: 24px 0 24px 32px;
    .xuanze{
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
    }
    
    .commen{
        margin-bottom: 24px;
        .dingwei{
          position: absolute;
          font-size: 14px;
          color: rgb(237, 64, 20);
          left: 84px;
          top: 34px;
        }
        .content-left{
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        }
        .content-right{
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        }
    }
    .tishi{
        background-color: rgba(22, 173, 233, 0.19);
        font-size: 14px;
        font-family: PingFangSC;
        line-height: 26px;
        padding: 7px;
        margin-top: 10px;
        img{
            width: 18px;
            height: 18px;
            position: relative;
            top: 4px;
        }
        span{
            color: #333333;
        }
    }
  }
  
  .files-example {
    background: #FFFFFF;
    border-radius: 4px;
    padding: 24px 0 24px 32px;
    margin-top: 24px;
    .beizhu{
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #1890FF;
        margin-bottom: 24px;
    }
    .xing{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FA5555;
    }
    .dwimg{
        margin-top: 11px;
        img{
            position: relative;
            top: 4px;
        }
        span{        
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #16ADE9;
        }
    }
    .shouquan{
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
    }
    .jisong{
        background: #FFF1DD;
        font-size: 14px;
        font-family: PingFangSC;
        color: #333333;
        line-height: 40px;
        padding-left: 12px;
        img{
            position: relative;
            top:4px
        }
    }
    
      span {
        cursor: pointer;
      }
  }
  .add-title {
    margin: 30px 0 20px 0;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
  .address-box {
    // margin-left: 12px;
    padding: 24px 0 24px 0;
    .info {
      line-height: 26px;
      font-size: 16px;
      color: #666666;
      .info-title {
        color: rgba(0, 0, 0, 0.85);
        display: inline-block;
      }
      .info-content {
        color: #333333;
        font-weight: 600;
      }
    }
    .info-remark {    
        font-size: 14px;
        font-family: PingFangSC;
        color: #16ADE9;
        margin-top: 12px;
    }
  }
  .liucheng{
      background: #FFFFFF;
      border-radius: 4px;
      padding: 14px 32px 32px 32px;
      text-align: center;
      .shuoming{ 
        text-align: left;  
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 24px;
      }
  }
}
.container2 {
  min-height: 685px;
  margin: 24px;
  background-color: #FFFFFF;
  text-align: center;
  padding: 50px;
  .success{ 
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: #333333;
  margin-top: 25px;
  }
  .time{
    margin-top: 17px;
    font-size: 12px;
    font-family: PingFangSC;
    color: #333333;
  }
  .anniu{
    margin-top: 24px;
    font-size: 14px;
    font-family: PingFangSC;
    color: #16ADE9;
  }
  .erweima{
    margin: 32px auto;
    width: 730px;
    background: rgba(22, 173, 233, 0.1);
    padding: 24px;
    img{
      width: 140px;
      height: 134px;
    }
    p{  
      font-size: 14px;
      font-family: PingFangSC;
      color: #333333;
      margin-bottom: 12px;
    }
  }
}
.main{
  margin: 24px;
  border-radius: 4px;
  background: #FFFFFF;
  padding-bottom: 32px;
  .base{
    background: rgba(24, 144, 255, 0.19);
    border-radius: 4px 4px 0px 0px;
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 55px;
    padding-left: 32px;
  }
  .mt24{
    margin-top: 24px;
    padding-left: 32px;
    .left{
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
    }
    .right{ 
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    .file{     
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #16ADE9;
      cursor: pointer;
    }
  }
}
</style>


