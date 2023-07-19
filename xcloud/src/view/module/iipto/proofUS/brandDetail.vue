<template>
  <div class="container"
       v-if="JSON.stringify(formInfo)!='{}'">
    <p class="title">使用证据详情
    </p>
    <div v-if="tabs==1">
      <div class="details-box">
        <div class="box-title">商标信息</div>
        <div class="box-bottom">
          <Row>
            <Col :span="12">
            <p>
              <span class="left-item">商标类型：</span>
              <span class="right-item">{{formInfo.trademarkType==1?'纯文字':formInfo.trademarkType==2?'纯图形':formInfo.trademarkType==3?'图形+文字':''}}</span>
            </p>
            </Col>
            <Col :span="12">
            <p>
              <span class="left-item">商标名称：</span>
              <span class="right-item"
                    v-html="formInfo.trademarkNameEn"></span>
            </p>
            </Col>
            <Col :span="12">
            <p v-if="formInfo.trademarkType==2||formInfo.trademarkType==3">
              <span class="left-item">商标LOGO：</span>
              <a :href="formInfo.trademarkLogo"
                 target="_blank"
                 style="color:#00A3FF;font-size:14px;"><img src="@/assets/images/infoDetail/bianji.png"
                     alt=""
                     style="vertical-align: middle;">查看商标LOGO</a>
            </p>
            </Col>
            <Col :span="12"
                 v-if="formInfo.trademarkDescribe!=''&&formInfo.countryCode=='US'">
            <p>
              <span class="left-item">设计商标描述：</span>
              <span class="right-item"
                    v-html="formInfo.trademarkDescribe"></span>
            </p>
            </Col>
            <Col :span="12"
                 v-if="formInfo.countryCode=='GB'">
            <p>
              <span class="left-item">是否注册过欧盟商标：</span>
              <span class="right-item">{{formInfo.isRegisterEuTrademark==1?'否':formInfo.isRegisterEuTrademark==2?'是':''}}</span>
            </p>
            </Col>
            <Col :span="12"
                 v-if="formInfo.countryCode=='GB'&&formInfo.isRegisterEuTrademark==2">
            <p>
              <span class="left-item">欧盟商标的受理号：</span>
              <span class="right-item">{{formInfo.euAcceptNum}}</span>
            </p>
            </Col>
            <Col :span="12"
                 v-if="formInfo.countryCode=='GB'&&formInfo.isRegisterEuTrademark==2">
            <p>
              <span class="left-item">欧盟商标的申请日期：</span>
              <span class="right-item">{{formInfo.euAcceptTime.slice(0, 10)}}</span>
            </p>
            </Col>
          </Row>
        </div>

      </div>
      <div class="details-box">
        <div class="box-title">商品或服务分类信息</div>
        <div class="box-bottom"
             v-for="(categoryItem,categoryIndex) in trademarkCategoryList"
             :key="categoryIndex">
          <p>
            <span class="left-item">商标分类：</span>
            <span class="right-item">{{categoryItem.category1Num}}&nbsp;{{categoryItem.category1Name}}</span>
          </p>
          <p>
            <span class="left-item">商标小类名称：</span>
          </p>
          <div class="info-table">
            <table style="width: 100%;text-align: center"
                   cellpadding="0"
                   cellspacing="0">
              <tr class="header">
                <th style="width:68px;">序号</th>
                <th style="width:206px;">商标小类（中文）</th>
                <th style="width:428px;">商标小类（英文）</th>
                <th style="width:166px;border-right:none;"
                    v-if="formInfo.countryCode=='US'">指定关键词</th>
              </tr>
              <tr v-for="(item,index) in categoryItem.listTrademarkCategory2"
                  :key="index">
                <td style="width:68px;">{{index+1}}</td>
                <td style="width:206px;">{{item.category2Name}}</td>
                <td style="width:428px;">{{item.category2NameEn}}</td>
                <td style="width:166px;border-right:none;"
                    v-if="formInfo.countryCode=='US'">
                  <span v-if="item.keyword">{{item.keyword[0]}}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <!-- 美国商标使用证据 -->
      <div class="details-box"
           v-if="formInfo.firstUseDate!=''">
        <div class="box-title">商标使用证据</div>
        <div class="box-bottom">
          <Row>
            <Col :span="12">
            <p>
              <span class="left-item">首次使用日期：</span>
              <span class="right-item">{{formInfo.firstUseDate.slice(0, 10)}}</span>
            </p>
            </Col>
            <Col :span="12">
            <p>
              <span class="left-item">首次在商业上的使用日期：</span>
              <span class="right-item">{{formInfo.firstBusinessUseDate.slice(0, 10)}}</span>
            </p>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
            <div>
              <span class="left-item">产品图：</span>
              <div class="evidence-box">
                <p class="evidence"
                   v-for="(item,index) in usrProductImgList"
                   :key="index">
                  <a :href="item.fileUrl"
                     target="_blank">
                     <!-- <img src="@/assets/images/infoDetail/bainji-gary.svg"
                         alt=""> -->
                         {{item.fileName}}</a>
                </p>
              </div>
            </div>
            </Col>
            <Col :span="12">
            <div>
              <span class="left-item">订单详情截图：</span>
              <div class="evidence-box">
                <p class="evidence"
                   v-for="(item,index) in useEvidenceList"
                   :key="index">
                  <a :href="item.fileUrl"
                     target="_blank">
                     <!-- <img src="@/assets/images/infoDetail/bainji-gary.svg"
                         alt=""> -->
                         {{item.fileName}}</a>
                </p>
              </div>
            </div>
            </Col>
          </Row>
          <p>
            <span class="left-item">销售链接：</span>
          </p>
          <div class="info-table">
            <table style="width: 100%;text-align: center"
                   cellpadding="0"
                   cellspacing="0">
              <tr class="header">
                <th style="width:68px;">序号</th>
                <th style="width:402px;">销售链接</th>
                <th style="width:400px;border-right:none;">指定商标小类</th>
              </tr>
              <tr v-for="(item,index) in marketHrefList"
                  :key="index">
                <td style="width:68px;">{{index+1}}</td>
                <td style="width:402px;">
                  <p>{{item.marketHref}}</p>
                </td>
                <td style="width:400px;border-right:none;">
                  <p>
                    {{item.category2NameEn}}</p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <!-- <div class="details-box">
        <div class="box-title">申请人信息</div>
        <div class="box-bottom">
          <Row>
            <Col :span="12">
            </Col>
            <p>
              <span class="left-item">申请人类型：</span>
              <span class="right-item">{{formInfo.applyType==0?'个人':formInfo.applyType==1?'企业':''}}</span>
            </p>
            <Col :span="12">
            <p v-if="formInfo.applyType==0">
              <span class="left-item">姓名：</span>
              <span class="right-item">{{formInfo.applyLastNameEn}},&nbsp;{{formInfo.applyNameEn}}</span>
            </p>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
            <p v-if="formInfo.applyType==0">
              <span class="left-item">身份证人像面：</span>
              <span class="right-item item-box">
                <a :href="formInfo.identityCardFront"
                   target="_blank"
                   style="color:#666;"><img src="@/assets/images/infoDetail/bainji-gary.svg"
                       alt="">身份证人像面</a>
              </span>
            </p>
            </Col>
            <Col :span="12">
            <p v-if="formInfo.applyType==0">
              <span class="left-item">身份证国徽面：</span>
              <span class="right-item item-box">
                <a :href="formInfo.identityCardReverse"
                   target="_blank"
                   style="color:#666;"><img src="@/assets/images/infoDetail/bainji-gary.svg"
                       alt="">身份证国徽面</a>
              </span>
            </p>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
            <p v-if="formInfo.applyType==1">
              <span class="left-item">公司名称：</span>
              <span class="right-item">{{formInfo.applyCompanyEn}}</span>
            </p>
            </Col>
            <Col :span="12">
            <p v-if="formInfo.applyType==1">
              <span class="left-item">公司营业执照：</span>
              <span class="right-item item-box">
                <a :href="formInfo.businessLicense"
                   target="_blank"
                   style="color:#666;"><img src="@/assets/images/infoDetail/bainji-gary.svg"
                       alt="">公司营业执照</a>
              </span>
            </p>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
            <p>
              <span class="left-item">国家：</span>
              <span class="right-item">{{formInfo.applyCountryEn}}</span>
            </p>
            </Col>
            <Col :span="12">
            <p>
              <span class="left-item">城市：</span>
              <span class="right-item">{{formInfo.applyCityEn}},&nbsp;{{formInfo.applyProvinceEn}}</span>
            </p>
            </Col>
          </Row>
          <Row>
            <Col :span="12"
                 v-if="formInfo.countryCode=='US'||formInfo.countryCode=='GB'">
            <p>
              <span class="left-item">街道地址：</span>
              <span class="right-item">{{formInfo.applyStreetEn}}</span>
            </p>
            </Col>
            <Col :span="12">
            <p>
              <span class="left-item">详细地址：</span>
              <span class="right-item">{{formInfo.applyAddresEn}}</span>
            </p>
            </Col>
          </Row>
          <Row v-if="formInfo.countryCode=='US'">
            <Col :span="12">
            <p>
              <span class="left-item">邮政编码：</span>
              <span class="right-item">{{formInfo.applyPostNum}}</span>
            </p>
            </Col>
            <Col :span="12">
            <p>
              <span class="left-item">申请人邮箱：</span>
              <span class="right-item">{{formInfo.applyEmail}}</span>
            </p>
            </Col>
          </Row>
        </div>
      </div>
      <div class="details-box">
        <div class="box-title">申请人签名</div>
        <div class="box-bottom">
          <p>
            <img v-if="formInfo.signature !== '' && formInfo.signature !== undefined"
                 :src="formInfo.signature"
                 alt=""
                 style="width:300px;height:200px;">
          </p>
        </div>
      </div> -->
      <div class="button-box">
        <Button @click="goBack"
                class="back-button">返回</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { fileOaListApi, addFileOaApi, updateFileOaApi, delFileOaApi, translateOaApi, translatStopLettereApi, cancelStopLettereApi, rejectAnswerApi, passAnswerApi } from "@/api/iipto/breadInfoDetail";
import { formatDate } from '@/libs/tools.js';
import { iiptoFileType } from '@/libs/iipto.js';
export default {
  props: ['orderId', 'resData'],
  data() {
    return {
      formInfo: {},
      useEvidenceList: [],
      usrProductImgList: [],
      marketHrefList: [],
      status: '',
      marketColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          align: 'center',
          title: '销售链接',
          key: 'marketHref'
        },
        {
          align: 'center',
          title: '指定商标小类',
          key: 'category2NameEn'
        },
      ],
      tabs: 1,
      fileList: [],
      trademarkCategoryList: [],
    }
  },
  methods: {
    //获取工单资料
    getDetailFun() {
      if (JSON.stringify(this.resData) != '{}') {
        if (JSON.stringify(this.resData.trademarkWorkOrder) != '{}') {
          this.formInfo = { ...this.resData.trademarkWorkOrder }
          if (this.resData.trademarkWorkOrder.useEvidence != '') {
            this.useEvidenceList = JSON.parse(this.resData.trademarkWorkOrder.useEvidence)
          }
          if (this.resData.trademarkWorkOrder.useProductImg != '') {
            this.usrProductImgList = JSON.parse(this.resData.trademarkWorkOrder.useProductImg)
          }
          if (this.resData.trademarkWorkOrder.marketHref != '') {
            this.marketHrefList = JSON.parse(this.resData.trademarkWorkOrder.marketHref)
          }
          this.formInfo.trademarkCategory1Str = ''
          this.formInfo.trademarkCategory2Str = []
          if (this.formInfo.trademarkCategory !== '') {
            this.trademarkCategoryList = JSON.parse(this.formInfo.trademarkCategory)
          }
        }
        this.status = this.resData.services.progressBar
      }
    },
    goBack() {
      this.$emit('backPage', true)
    },
    initFileNameFunc(fileName) {
      return fileName.slice(fileName.length - 36, fileName.length)
    },
  },
  mounted() {
    this.getDetailFun()
  },
}
</script>
<style lang="less" scoped>
.container {
  background-color: #fff;
  padding: 24px;
  .title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    img {
      vertical-align: middle;
    }
  }
  p {
    line-height: 30px;
  }
  .details-box {
    margin-top: 24px;
    border: 1px solid #e9e9e9;
    .box-title {
      padding: 11px 24px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      background-color: #fafafa;
      border-bottom: 1px solid #e9e9e9;
    }
    .box-bottom {
      padding: 16px 24px;
    }
    .left-item {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
    }
    .right-item {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 500;
      color: #666666;
      line-height: 22px;
      max-width: 75%;
      word-break: break-all;
    }
    .ellipsis {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      vertical-align: sub;
    }

    .evidence-box {
      display: inline-block;
      vertical-align: top;
      width: 100%;
      p {
        word-break: break-word;
        padding-right: 20px;
      }
      p:hover a{
        color: #00a3ff;
      }
    }
    .evidence {
      img {
        vertical-align: middle;
      }
      a {
        color: #666666;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
  }
  .button-box {
    border-top: 1px solid #ebebeb;
    padding-top: 32px;
  }
  .back-button {
    width: 60px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #00a3ff;
    color: #00a3ff;
    margin-left: 15px;
  }
  .bread-logo {
    width: 106px;
    height: 106px;
    vertical-align: text-top;
  }
  .info-table {
    margin-top: 6px;
    // width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.15);
    font-size: 14px;
    box-sizing: border-box;
    tr {
      td {
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        border-right: 1px solid rgba(0, 0, 0, 0.06);
        word-break: break-word;
      }
    }
    .header {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      th {
        padding: 8px 0;
        border-right: 1px solid rgba(0, 0, 0, 0.06);
      }
    }
    td {
      padding: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }
  }
  .tab-box {
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 10px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    span {
      margin-right: 32px;
      cursor: pointer;
    }
    span.tab-active {
      color: #00a3ff;
      border-bottom: 2px solid #00a3ff;
      padding-bottom: 10px;
    }
  }
  .null-file {
    text-align: center;
    margin-top: 16px;
    margin-bottom: 240px;
    .first-p {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      margin: 10px 0 8px 0;
    }
    p {
      font-size: 14px;
      font-family: PingFangSC;
      color: #666666;
    }
  }
  .operation-td {
    div {
      cursor: pointer;
      color: #00a3ff;
      min-width: 60px;
    }
  }
  .table-bottom-tips {
    margin: 24px;
    span {
      color: #333;
      font-size: 700;
    }
  }
  /deep/ .ivu-poptip-inner {
    white-space: break-spaces;
  }
  /deep/ .ivu-poptip-body {
    margin-top: -20px;
  }
  /deep/ .ivu-poptip-popper {
    min-width: 315px;
    font-size: 14px;
  }
}
/deep/ .ivu-form-item-label {
  color: #333;
  font-size: 14px;
  padding: 10px 12px 8px 0;
}
/deep/ .formTranslate .ivu-form-item {
  margin-bottom: 10px;
}
.formTranslate p {
  word-break: break-all;
}
.label-title {
  color: #333;
  margin-bottom: -12px;
}
</style>
