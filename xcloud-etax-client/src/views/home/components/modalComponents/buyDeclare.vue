<template>
  <div>
    <Modal v-model="modalShow"
           :title="titleType"
           :mask-closable="false"
           @on-visible-change="changeState"
           width="720"
           class="clearfix"
           footer-hide>
      <div class="clearfix"
           v-if="!isShowQrCode">
        <div class="stepGroup fl">
          <Steps :current="current"
                 direction="vertical">
            <Step :title="stepTitle"></Step>
            <Step title="购买服务"></Step>
          </Steps>
        </div>
        <div class="fl formContent">
          <div class="stepOne"
               v-if="current===0">
            <Form ref="formValidate"
                  :model="addCompanyFrom"
                  :label-width="84">
              <FormItem label="公司名称："
                        prop="companyName"
                        style="max-width:280px;">
                <Input v-model="addCompanyFrom.companyName"
                       placeholder="请输入需要报税的公司中文名称"
                       :maxlength="200"
                       v-if="sendType=='tax'"></Input>
                <auto-complete style="width: 280px"
                               ref="test"
                               v-model="model11"
                               filterable
                               allow-create
                               v-if="sendType=='declare'">
                  <i-option v-for="item in companyList"
                            :value="item"
                            :key="item">{{ item }}</i-option>
                </auto-complete>
                <p class="wramTips">温馨提示: 如个人开店，则填写个人姓名为公司名称</p>
              </FormItem>
              <FormItem label="报税国家："
                        prop="interest">
                <CheckboxGroup v-model="addCompanyFrom.interest"
                               @on-change="changeCountry">
                  <span v-for="(item,index) in countryList"
                        :key="index"
                        @click="tatol(item)">
                    <Checkbox :label="item.countryCode"
                              :disabled="item.status!==0">
                      <img :src="item.countryFlagUrl"
                           alt=""
                           class="countryImg">
                      {{item.countryNameZh}}
                    </Checkbox>
                  </span>
                </CheckboxGroup>
              </FormItem>
              <Button class="footerBt1"
                      type="primary"
                      :loading="loadEdit"
                      @click="next">下一步</Button>
            </Form>
          </div>
          <div class="stepTwo"
               v-if="current===1">
            <p class="littleStip"><img src="@/assets/images/common/complate.png"
                   alt=""> 添加完成，购买后即可开始报税</p>
            <div class="priceContent clearfix">
              <div class="priceBox fl"
                   v-for="(item,index) in productBoxList"
                   :key="index"
                   v-bind:class="item.ischeck===true?'blue':''">
                <div class="price">{{item.price}}<span>/年</span></div>
                <div class="productName">{{item.productName}}</div>
              </div>
            </div>
            <div class="payType clearfix">
              <span class="fl">支付方式：</span>
              <div class="fl typeBox"
                   v-for="(item,index) in payMethodArr"
                   :key="index"
                   :class="{'pay-item':true, 'active':item.active}"
                   @click="changeMethod(index)">
                <img :src="item.src"
                     alt />
                {{item.name}}
              </div>
            </div>
            <Select v-model="couponNum"
                    style="margin-top:14px;width:266px"
                    @on-change="changeDsicount"
                    placeholder="请选择优惠券"
                    clearable>
              <Option v-for="(v,i) in couponList"
                      :key="i"
                      :value="v.couponNum">满{{v.threAmount}}减{{v.discAmount}}</Option>
            </Select>
            <div class="coupon">
              <CheckboxGroup v-model="interest">
                <Checkbox class="checkBoxs"
                          label="1">同意并接受<span @click="showUser=true">《服务条款》</span></Checkbox>
              </CheckboxGroup>
            </div>
            <div class="payBox clearfix">
              <span>应付：</span>
              <span class="yellow yang">￥</span>
              <span class="yellow payPrice">{{totalPrice}}</span>
              <div class="buttoms">
                <Button class="footerBt2"
                        type="primary"
                        @click="addOrder('yes')">去付款</Button>
                <Button class="footerBt3"
                        @click="addOrder('no')">稍后付款</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <div id="qrcode"
         class="qrcode"
         v-if="isShowQrCode">
      <div class="qrcode-container">
        <div class="qrcode-title">
          商品详情： {{productName}}
          <div class="close"
               @click="toClose">返回</div>
        </div>
        <div class="price">
          待支付:
          <span>{{showPayPrice}}</span>元
        </div>
        <div class="price-name">收款方：跨税云（深圳）科技有限公司</div>
        <div class="qrcode-img">
          <div id="qrcode-content"></div>
          <div class="qrcode-content-text">
            <img style="margin-bottom: -3px;margin-right: 3px;"
                 src="@/assets/images/sureOrder/sao.png"
                 alt />使用【微信扫一扫】即可付款
          </div>
        </div>
      </div>
    </div>
    <userAgreement @changeState="changeStates"
                   v-if="showUser"></userAgreement>
    <unionPay :orderId="productId"
              @changeState="changeStateUp"
              v-if="unionType"></unionPay>
  </div>
</template>
<script>
import QRCode from "qrcodejs2";
import { getProduct, createOrder, getRegCompany } from "@/api/taxModule";
import { getChannelId, pay, pay1, payOrderReturn } from "@/api/sureOrder/sureOrder"
import userAgreement from '@/views/common/userAgreement'
import { coupponList } from '@/api/user/coupon.js'
import unionPay from './unionPay'
let Base64 = require("js-base64").Base64;
export default {
  components: {
    userAgreement,
    unionPay
  },
  props: {
    sendType: {}
  },
  data() {
    return {
      titleType: "我要报税",
      stepTitle: "添加报税公司",
      modalShow: true,
      current: 0,
      loadEdit: false,
      isShowQrCode: false,//微信二维码
      unionType: false,//银联支付
      addCompanyFrom: {
        companyName: ''
      },
      ruleAddFrom: [],
      checkindex: '',
      productBoxList: [],
      countryList: [],
      checkedCountry: [],
      totalPrice: 0,
      interest: ['1'],
      productId: '',
      orderNo: '',
      productName: '',
      showPayPrice: 0,
      payMethodArr: [
        {
          name: "微信支付",
          src: require("@/assets/images/sureOrder/wx-pay.png"),
          active: false,
          current: 1
        },
        {
          name: "支付宝",
          src: require("@/assets/images/sureOrder/zfb-pay.png"),
          active: true,
          current: 0
        },
        {
          name: "银联",
          src: require("@/assets/images/sureOrder/yl-pay.png"),
          active: false,
          current: 2
        }
      ],
      paysParams: [],
      mchIdNow: "1515011212",
      showUser: false,
      couponNum: '',
      couponList: [],
      originPrice: 0,//未使用优惠券之前的价格
      companyList: [],
      model11: '',    //绑定值，用来存储iview组件绑定的值，但我这种做法，在提交的时候，不是使用改值，该值更多是为了完成页面效果
    };
  },
  mounted() {
    this.getProducts()
    this.getPayId()
  },
  computed: {
    selectMethod() {
      return this.payMethodArr.filter(item => item.active)[0];
    },
  },
  methods: {
    getProducts() {
      const self = this
      let type = 2
      this.sendType == 'declare' ? type = 2 : type = 1
      getProduct({ functionCode: type }).then(res => {
        if (res.code === 0) {
          this.countryList = res.data
          res.data.map((v, i) => {
            let obj = {}
            if (v.status !== 1) {
              obj = {
                productName: v.countryNameZh + v.productName,
                price: v.price,
                ischeck: false,
                countryCode: v.countryCode,
                id: v.id
              }
              self.productBoxList.push(obj)
            }
          })
        }
      })
      let obj = {
        custAcno: "",
        endDate: "",
        limit: 20,
        page: 1,
        startDate: "",
        status: "0"
      }
      coupponList(obj).then(res => {
        if (res.code === 0) {
          this.couponList = res.data.records
        }
      })
    },
    getPayId() {
      let self = this;
      getChannelId()
        .then(
          res => {
            // console.log(res);/
            if (res.code == 0) {
              self.paysParams = res.data.records
            } else {
              this.$Message.warning(res.message);
            }
          },
          err => {
            this.$Message.warning(err.message);
          }
        )
        .catch(e => { });
    },
    changeState(val) {
      let obj = {
        state: val,
        refresh: true
      };
      this.$emit("changeState", obj);
    },
    changeStateUp(val) {
      this.unionType = val.state
      if (val.type) {
        this.changeState(false)
      }
    },
    changeCountry(item) {
      this.checkedCountry = item
    },
    tatol(item) {
      if (item.status == 1) {
        this.$Message.info('持续开发中，敬请期待！')
      }
    },
    next() {
      // console.log(this.model11)
      if (this.current == 0) {
        if (this.sendType == 'declare') {
          this.addCompanyFrom.companyName = this.model11
        }
        if (this.addCompanyFrom.companyName.trim() === '') {
          this.$Message.info("请填写公司名称")
          return
        }
        if (this.checkedCountry.length == 0) {
          this.$Message.info("请选择国家")
          return
        }
        this.current += 1
        const self = this
        self.productBoxList.map((i, v) => {
          self.checkedCountry.map((item, index) => {
            if (item === i.countryCode) {
              i.ischeck = true
              self.totalPrice += i.price
              self.originPrice += i.price
            }
          })
        })
      }
    },
    //获取当前登录用户所有的注册服务公司
    getCompany() {
      getRegCompany().then(res => {
        if (res.code === 0) {
          this.companyList = res.data
        }
      })
    },
    //选择商品
    changeProduct(item) {
      const self = this
      self.totalPrice = 0
      self.originPrice = 0
      if (item.ischeck) { item.ischeck = false }
      else if (!item.ischeck) item.ischeck = true
      this.productBoxList.map((item, index) => {
        if (item.ischeck) {
          self.totalPrice += item.price
          self.originPrice += item.price
        }
      })
    },
    changeDsicount(val) {
      const self = this
      let discountMon = 0
      this.totalPrice = this.originPrice
      if (val != undefined) {
        this.couponList.map((v, i) => {
          if (val === v.couponNum) {
            discountMon = v.discAmount
          }
        })
        if ((this.originPrice - discountMon) < 0) {
          this.$Message.info('该优惠券不符合使用条件')
        } else {
          this.totalPrice = this.originPrice - discountMon
        }
      } else {
        this.totalPric = this.originPrice
      }
    },
    // 改变支付方式的回调
    changeMethod(index) {
      let self = this;
      self.payMethodArr.forEach((element, idx) => {
        if (index == idx) {
          element.active = true;
        } else {
          element.active = false;
        }
      });
    },
    // 立即支付按钮的回调
    payHandler() {
      let self = this;
      //选定支付商户号
      self.paysParams.map((i, k) => {
        if (self.selectMethod.current == 0 && i.channelCode == "ALIPAY_PC") {
          self.mchIdNow = i.mchId;
        }
        if (self.selectMethod.current == 1 && i.channelCode == "WX_NATIVE") {
          self.mchIdNow = i.mchId;
        }
        // if (self.selectMethod.current == 2 && i.channelCode == "YOP_PC") {
        //   self.mchIdNow = i.mchId;
        // }
      });

      if (self.selectMethod.current != 2) {
        // console.log(self.totalPrice);
        let params = {
          // amount:1,
          amount: self.showPayPrice * 100,
          body: self.productName,
          channelCode:
            self.selectMethod.current == 0 ? "ALIPAY_PC" : "WX_NATIVE",
          mchId: self.mchIdNow,
          mchOrderNo: self.orderNo,
          subject: self.productName,
          productId: self.productId,
          notifyUrl:
            self.backUrl + "/etax/receive/orderPayResultNotify",
          returnUrl:
            window.location.href
              .split("/")
              .slice(0, 3)
              .join("/") +
            "/work"
        };
        pay(params).then(res => {
          if (res.code == 0) {
            // 微信支付获取二维码,支付宝直接做跳转
            self.selectMethod.current == 0
              ? self.aliPay(res)
              : self.getQrcode(
                self.orderNo,
                res,
                self.mchIdNow
              );
          }
        });
      } else {
        // debugger
        let params = {
          // amount:1,
          amount: self.showPayPrice * 100,
          body: self.productName,
          channelCode: "YOP_PC",
          // mchId: 10033308763,
          mchId: self.mchIdNow,
          mchOrderNo: self.orderNo,
          subject: self.productName,
          productId: self.productId,
          notifyUrl:
            self.backUrl + "/etax/receive/orderPayResultNotify",
          returnUrl:
            window.location.href
              .split("/")
              .slice(0, 3)
              .join("/") +
            "/work"
        };
        pay1(params).then(res => {
          if (res.code == 0) {
            self.bankPay(res.data);
          } else {
            self.$Message.warning(res.message);
          }
        });
      }
    },
    // 生成二维码
    qrcode(url) {
      // console.log(url)
      let qrcode = new QRCode("qrcode-content", {
        width: 200, // 设置宽度，单位像素
        height: 200, // 设置高度，单位像素
        text: url // 设置二维码内容或跳转地址
      });
    },
    // 支付宝支付
    aliPay(res) {
      // console.log(res.data.payUrl)
      let payForm = Base64.decode(res.data.payUrl);
      // console.log(payForm)
      let div = document.createElement("div"); // 创建div
      div.innerHTML = payForm; // 将返回的form 放入div
      document.body.appendChild(div);
      document.getElementsByName('punchout_form')[0].submit();
    },
    // 银联宝支付
    bankPay(res) {
      let payForm = Base64.decode(res.payUrl);
      window.location.href = payForm;
    },
    // 微信二维码
    async getQrcode(orderNo, res, mcid) {
      // console.log('微信支付')
      this.time = 60;
      clearInterval(this.timer);
      this.isShowQrCode = true;
      let code_url = res.data.codeUrl,
        payOrderId = res.data.payOrderId;
      await this.$nextTick(() => {
        document.getElementById("qrcode-content").innerHTML = "";
        this.qrcode(code_url);
      });
      // this.modalShow=false;
      document.getElementsByClassName('ivu-modal-wrap')[1].style.display = 'none'
      document.getElementsByClassName('ivu-modal-mask')[1].style.display = 'none'
      // console.log(document.getElementsByClassName('ivu-modal-mask'))
      this.timer = setInterval(() => {
        this.time--;
        if (this.time <= 0) {
          this.getQrcode(orderNo, res);
        }
        // 判断是否支付
        let params = {
          mchOrderNo: orderNo,
          payOrderId: payOrderId,
          mchId: mcid,
          sign: ""
        };
        payOrderReturn(params).then(result => {
          if (result.data.status > 1) {
            this.isShowQrCode = false;
            clearInterval(this.timer);
            setTimeout(() => {
              this.$Message.success('支付成功')
              this.$util.getUserInegralMessage(this, '消费')
              let obj = {
                state: false,
                refresh: true
              };
              this.$emit("changeState", obj);
              this.$router.push({
                path: "/work",
              });
            }, 1500);
          }
        });
      }, 3000);
    },
    toClose() {
      this.isShowQrCode = false;
      clearInterval(this.timer);
      let obj = {
        state: false
      };
      this.$emit("changeState", obj);
    },
    //下单
    addOrder(type) {
      const self = this
      let proList = []
      this.productBoxList.map((v, i) => {
        if (v.ischeck) {
          proList.push(v)
        }
      })
      if (proList.length < 1) {
        this.$Message.info('请选择服务')
        return
      }
      if (this.interest.length < 1) {
        this.$Message.info('请勾选服务条款')
        return
      }
      let orderDTO = {
        companyName: this.addCompanyFrom.companyName,
        couponNum: this.couponNum,
        orderSource: 0,
        products: []
      }
      self.productName = ''
      this.productBoxList.map((v, i) => {
        if (v.ischeck) {
          let obj = {
            produtId: v.id
          }
          self.productName = v.productName + ";"
          orderDTO.products.push(obj)
        }
      })
      // console.log(orderDTO)
      createOrder(orderDTO).then(res => {
        if (res.code === 0) {
          this.productId = res.data.id
          this.orderNo = res.data.orderNo
          this.showPayPrice = res.data.orderMoney
          if (type == 'yes') {
            if (this.showPayPrice == 0) {
              this.$Message.success('下单成功')
              this.$emit("changeState", { state: false, refresh: true });
            } else {
              if (self.selectMethod.current !== 2) {
                this.payHandler()
              } else {
                this.unionType = true
              }
            }
          } else {
            let obj = {
              state: false,
              refresh: true
            };
            this.$Message.success('下单成功')
            this.$emit("changeState", obj);
            this.$router.push({
              path: '/orderList'
            })
          }
        }
      })
    },
    changeStates(val) {
      this.showUser = val
    },
  },
  created() {
    // console.log(this.sendType);
    if (this.sendType == "declare") {
      this.titleType = "我要报税";
      this.stepTitle = "添加报税公司"
      this.getCompany()
    }
    if (this.sendType == "tax") {
      this.titleType = "注册VAT税号";
      this.stepTitle = "添加注册税号公司"
    }
  },
};
</script>
<style lang="less" scoped>
.footerBt1 {
  width: 90px;
  margin: 0 0 58px 80px;
}
&/deep/.ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner span,
.ivu-steps-item.ivu-steps-status-finish
  .ivu-steps-head-inner
  > .ivu-steps-icon {
  color: #2d8cf0 !important;
}
.stepGroup {
  border-right: 1px solid #f2f2f2;
  padding-right: 15px;
  min-height: 300px;
  width: 176px;
}
.stepOne {
  margin-left: 38px;
  //max-width: 380px;
  .wramTips {
    font-size: 12px;
    font-family: "MicrosoftYaHei";
    color: rgba(171, 171, 179, 1);
  }
  .countryImg {
    width: 20px;
    vertical-align: sub;
  }
}
.stepTwo {
  margin-left: 15px;
  max-width: 400px;
  margin-bottom: 20px;
  .littleStip {
    font-size: 12px;
    font-family: "MicrosoftYaHei";
    color: rgba(171, 171, 179, 1);
    line-height: 12px;
  }
  .priceContent {
    margin-top: 20px;
    color: #939399;
    .priceBox {
      width: 112px;
      height: 112px;
      border-radius: 4px;
      border: 1px solid rgba(212, 212, 212, 1);
      text-align: center;
      padding: 32px 12px;
      cursor: pointer;
      margin: 0 10px 10px 0;
      .price {
        font-size: 24px;
        font-family: "PingFangSC-Medium,PingFang SC";
        font-weight: 500;
        span {
          font-size: 12px;
        }
      }
      .productName {
        margin-top: 10px;
        font-size: 12px;
      }
    }
    .blue {
      border-color: #16ade9;
      color: #16ade9;
    }
  }
  .coupon {
    margin-top: 14px;
    .checkBoxs {
      display: block;
      font-size: 12px;
    }
    :nth-child(1) {
      color: #ababb3;
    }
    :nth-child(2) {
      color: #626266;
      margin-top: 10px;
      padding-bottom: 16px;
      span {
        color: #16ade9;
        cursor: pointer;
      }
    }
  }
  .payType {
    font-size: 12px;
    line-height: 32px;
    .typeBox {
      width: 94px;
      height: 32px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(215, 215, 215, 1);
      margin-left: 10px;
      cursor: pointer;
      & img {
        margin-bottom: -3px;
        padding-right: 3px;
        margin-left: 20px;
      }
    }
    & .active {
      border-color: #16ade9;
      background: url("../../../../assets/images/sureOrder/check.png") no-repeat;
      background-position: right bottom;
    }
  }
  .payBox {
    font-size: 12px;
    color: #626266;
    position: relative;
    width: 380px;
    .yellow {
      color: #fb7616;
    }
    .payPrice {
      font-size: 24px;
    }
    .yang {
      font-size: 14px;
    }
    .buttoms {
      position: absolute;
      right: 0;
      bottom: 0;
    }
    .footerBt2 {
      margin-right: 15px;
    }
  }
}
& #qrcode {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: #f5f6f7;
  z-index: 999;
}
& /deep/ .qrcode-container {
  position: relative;
  background: #fff;
  width: 49%;
  height: 72%;
  max-height: 550px;
  margin: 0 auto;
  margin-top: 59px;
  min-height: 548px;
  & /deep/ .qrcode-title {
    color: #313233;
    font-size: 16px;
    background: #f5f6f7;
    height: 40px;
    border-bottom: 5px solid #d8c7a1;
    & .close {
      float: right;
      width: 60px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #626466;
      font-size: 14px;
      background: #fff;
      cursor: pointer;
    }
  }
  & .price {
    margin-top: 99px;
    text-align: center;
    & span {
      color: #ff6652;
      font-size: 26px;
    }
  }
  & .price-name {
    color: #626466;
    font-size: 14px;
    text-align: center;
  }
  & .qrcode-img {
    text-align: center;
    width: 210px;
    padding: 5px;
    border: 1px solid rgba(221, 221, 221, 1);
    margin: 0 auto;
    margin-top: 25px;
  }
  & .qrcode-content-text {
    text-align: center;
    padding: 10px 0px 5px 0px;
  }
}
& .copy {
  color: #6e6e6e;
  font-size: 12px;
  text-align: center;
  margin-top: 80px;
}
.formContent {
  width: 500px;
}
&/deep/.ivu-checkbox-group-item {
  min-width: 100px;
}
&/deep/ .ivu-form-item {
  min-width: 358px !important;
  margin-top: 12px;
}
&/deep/ .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
  border-color: #fc9153;
  background-color: #fc9153;
}
&/deep/ .ivu-steps-head-inner {
  margin-left: 12px;
}
&/deep/.ivu-steps-item.ivu-steps-status-process .ivu-steps-title {
  color: #fc9153;
}
&/deep/ .ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner span,
.ivu-steps-item.ivu-steps-status-finish
  .ivu-steps-head-inner
  > .ivu-steps-icon {
  color: #fc9153 !important;
}
&/deep/.ivu-steps-item.ivu-steps-status-finish .ivu-steps-head-inner {
  border-color: #fc9153;
}
&/deep/.ivu-steps-item.ivu-steps-status-finish .ivu-steps-tail > i:after {
  background: #fc9153;
}
&/deep/ .ivu-steps-tail {
  left: 25px;
  height: 75px;
}
&/deep/ .ivu-modal-header-inner {
  font-weight: bold;
  font-size: 15px;
  margin-left: 10px;
}
&/deep/.ivu-steps .ivu-steps-title {
  font-size: 12px;
}
&/deep/.ivu-steps-item.ivu-steps-status-finish .ivu-steps-title {
  color: #fc9153;
}
&/deep/.ivu-steps-item {
  margin-top: 30px;
  margin-bottom: 30px;
}
/deep/ .v-transfer-dom {
  display: none;
}
</style>
