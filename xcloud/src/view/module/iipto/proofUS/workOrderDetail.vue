<template>
  <div class="mainContent">
    <div class="content">
      <Card class="content-l">
        <Card>
          <span @click="goBack()" class="back">
            <Icon type="md-arrow-back" />返回列表
          </span>
          <div style="float:right;" v-if="progressBar==7">
            <Button type="primary" v-show="hasAuthority('btn_usdata_pass')" @click="auditFunc(5)">审核通过</Button>
            <Button type="primary" style="margin:0 8px;" v-show="hasAuthority('btn_usdata_reject')" @click="auditFunc(8)">驳回</Button>
          </div>
          <div style="float:right;" v-if="progressBar==8">
            <Button type="primary" v-show="hasAuthority('btn_usdata_add')" @click="isEditor=false">修改</Button>
          </div>
        </Card>
        <div v-if="!isEditor">
          <BreadInfoDetailsUS v-if="countryCode=='US' &&requestEnd" :formInfo="formInfo" :countryCode="countryCode" @backList="goBack()" :servicesId="servicesId"></BreadInfoDetailsUS>
        </div>
        <BrandDetail v-if="isEditor &&requestEnd" :orderId="servicesId" :resData="resData" @backPage="goBack()" @changeInfo="changeInfo"></BrandDetail>
      </Card>
      <div class="content-r">
        <Card v-if="orderInfo.length>0">
          <p slot="title">
            <span>订单信息</span>
          </p>
          <Form>
            <FormItem label="订单编号：">
              <span>{{orderInfo[0].orderNo}}</span>
            </FormItem>
            <FormItem label="服务编号：">
              <span>{{orderInfo[0].serverNo}}</span>
            </FormItem>
            <FormItem label="制作套餐：">
              <span>{{formInfo.evidenceComboName}}</span>
            </FormItem>
            <FormItem label="订单跟进人：">
              <span>{{resData.user.followUserName}}</span>
            </FormItem>
            <FormItem label="初审处理人：">
              <span>{{resData.firstCheckUserName}}</span>
            </FormItem>
            <FormItem label="证据录入：">
              <span>{{formInfo.evidenceSubmitUserName}}</span>
            </FormItem>
            <FormItem label="证据审核：">
              <span>{{formInfo.evidenceCheckUserName}}</span>
            </FormItem>
            <FormItem label="初审通过日期：">
              <span v-if="resData.firstCheckCompleteDate!=''">{{resData.firstCheckCompleteDate.slice(0,10)}}</span>
            </FormItem>
            <FormItem label="最新处理时间：">
              <span>{{formInfo.updateTime}}</span>
            </FormItem>
          </Form>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import BrandDetail from './brandDetail'
import BreadInfoDetailsUS from './components/breadInfoDetailsUS'
import { trademarkDetailApi, workorderRejectApi, workorderAssignApi, getLawyerInfoApi, acceptInfoApi } from "@/api/iipto/breadInfoDetail";
import { evidenceUpdateApi } from '@/api/iipto/proofUs'
import { getToken } from '@/libs/util';
export default {
  props: ['servicesId', 'orderStatus', 'countryCode', 'categoryCount'],
  components: {
    BrandDetail,
    BreadInfoDetailsUS,
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
        // trademarkLogo: require('@/assets/images/infoDetail/example1.png')
        trademarkLogo: '',
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
        applyCountryEn: 'China',
        applyLastNameEn: '',
        applyNameEn: '',
        applyProvinceEn: '',
        applyCityEn: ''
      },
      isEditor: false,
      serverNo: '',
      progressBar: '',
      servicesInfo: {},
      orderInfo: [],
      requestEnd: false,
      attorneyInfo: {},
      resData: {}
    }
  },
  methods: {
    getHeight() {
      this.contentStyleObj["min-height"] = window.screen.height - 240 + "px";
    },
    goBack() {
      this.$emit('back')
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
          this.resData = { ...res.data }
          if (JSON.stringify(res.data.trademarkWorkOrder) != '{}') {
            this.formInfo = res.data.trademarkWorkOrder
            let returnData = { ...res.data.trademarkWorkOrder }
          }
          if (JSON.stringify(res.data.services) != '{}') {
            this.serverNo = res.data.services.serverNo
            this.progressBar = res.data.services.progressBar
            this.servicesInfo = res.data.services
            this.categoryCount = res.data.services.categoryCount
          }
          if (res.data.orderProductList.length > 0) {
            this.orderInfo = res.data.orderProductList
          }
          if (JSON.stringify(res.data.attorneyInfo) != '{}') {
            this.attorneyInfo = res.data.attorneyInfo
          }
        }
      }).finally(() => {
        this.requestEnd = true
      })
    },
    auditFunc(status) {
      //审核通过staus流转到5律师审核，审核驳回流转到8证据被驳回
      let paramsData = {
        trademarkWorkOrderStatus: status,
        id: this.formInfo.id,
        servicesId: this.servicesId
      }
      this.updateFunc(paramsData)
    },
    updateFunc(paramsData) {
      evidenceUpdateApi(paramsData).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功')
          this.getDetailFun()
        }
      })
    }

  },
  mounted() {
    this.getHeight()
    this.getDetailFun()
    this.progressBar = this.orderStatus
    if (this.orderStatus == 6) {
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
        max-width: 210px;
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

