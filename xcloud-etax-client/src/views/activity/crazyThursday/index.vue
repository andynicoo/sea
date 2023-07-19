<template>
<div class="page" id="page" ref='page'>
    <div class="container">
        <div class="pageContiner" id="pageContiner">
            <div class="content">
                <div class="bodyBg">
                  <img src="./images/hold-bg.png" alt="">
                </div>
                <div class="discountBox" v-if="couponList.activityProductList && couponList.activityProductList.length">
                    <img src="@/assets/images/activity618/discountImg.png" alt="">
                    <div class="right">
                        <div class="titileBox">
                            <span class="extandTimes">10倍膨胀</span>
                            <span class="discountExtand">￥6.18元变￥61.8元</span>
                            <div class="gift">
                                附赠1999运营礼包
                            </div>
                        </div>
                        <div class="subTitle">
                            使用说明：优惠券购买时间为2022年6月16日9:00--2022年6月18日 12:00，2022年6月18日17:20分失效，每个ID限购1张
                        </div>
                        <div class="btnBox">
                            <div class="price">￥6.18元</div>
                            <div class="btnRight">
                                <span>已有{{partner}}人参与抢购</span>
                                <div class="btn" @click="buy(couponList.activityProductList[0])">立即抢购</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 低价秒杀 -->
                <div class="lowPrice" v-if="lowPriceList.length">
                    <img class="lowPriceImg" src="@/assets/images/activity618/lowPriceHeaderImg.png" alt="">
                    <TimeBox :hours="hours" :mins="mins" :seconds="seconds" :isBefor="isBefor" :over="over"/>
                    <div class="lowPriceItems">
                        <div class="items" v-for="( item, index) in lowPriceList" :key="index">
                            <GoodsItem :isFree="false" :isBegin="isBegin" :over="over" :itemdata="item" :startTime="startTime" :endTime="endTime" :activityType="2" :isBefor="isBefor"/>
                        </div>
                    </div>
                </div>
                <div id="vat" v-if="vatList.length"></div>
                <!-- vat -->
                <div class="lowPrice" ref="vat" v-if="vatList.length">
                    <img class="lowPriceImg" src="@/assets/images/activity618/vatHeaderImg.png" alt="">
                    <TimeBox :hours="hours" :mins="mins" :seconds="seconds" :isBefor="isBefor" :over="over"/>
                    <div class="lowPriceItems">
                        <div class="items" v-for="( item, index) in vatList" :key="index">
                            <GoodsItem :isFree="false" :isBegin="isBegin" :over="over" :itemdata="item" :startTime="startTime" :endTime="endTime" :activityType="3" :isBefor="isBefor"/>
                        </div>
                    </div>
                </div>
                <div id="compliance" v-if="erpList.length"></div>
                <!-- 合规 -->
                <div class="lowPrice" v-if="erpList.length">
                    <img class="lowPriceImg" src="@/assets/images/activity618/erpHeaderImg.png" alt="">
                    <TimeBox :hours="hours" :mins="mins" :seconds="seconds" :isBefor="isBefor" :over="over"/>
                    <div class="lowPriceItems">
                        <div class="items" v-for="( item, index) in erpList" :key="index">
                            <GoodsItem :isFree="false" :isBegin="isBegin" :over="over" :itemdata="item" :startTime="startTime" :endTime="endTime" :activityType="4" :isBefor="isBefor"/>
                        </div>
                    </div>
                </div>
                <!-- 规则 -->
                <div class="rules">
                    <div class="rules-title">活动规则</div>
                    <div class="rules-content">
                      <p v-for="(rule, r_index) in rules" :key="`r_${r_index}`">{{ `${r_index+1}、${rule}` }}{{ rules.length-r_index===1?'。':';' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 活动规则 -->
    <div class="ruleFolt" @click="modal = true">
        活动规则
    </div>
    <!-- 右边浮动按钮 -->
    <div  class="flotRight">
        <div class="flotBox">
            <div class="flotItem-wrap" v-if="lowPriceList.length">
              <div class="flotItem" @click="goAnchor('lowPrice')"><div class="hot-img"><img src="./images/hot.png" alt=""></div>爆款秒杀区
                <div class="img-hide">
                  <img src="@/assets/images/activity618/go.png" alt="">
                </div>
              </div>
            </div>
            <div class="flotItem-wrap" v-if="vatList.length">
              <div class="flotItem" @click="goAnchor('vat')">VAT秒杀区
                <div class="img-hide">
                  <img src="@/assets/images/activity618/go.png" alt="">
                </div>
              </div>
            </div>
            <div class="flotItem-wrap" v-if="erpList.length">
              <div class="flotItem" @click="goAnchor('compliance')">合规秒杀区
                <div class="img-hide">
                  <img src="@/assets/images/activity618/go.png" alt="">
                </div>
              </div>
            </div>
            <div class="flotItem-wrap">
              <div class="flotItem">联系我们
                <img class="callUs" src="@/assets/images/activity618/callUs.png" alt="">
              </div>
            </div>
            <div class="flotItem-wrap">
              <div class="flotItem"><img style="width: 10px;" src="./images/icon-phone.png" alt="">手机端
                <img class="callUs" src="@/assets/images/activity618/wx.png" alt="">
              </div>
            </div>
            <div class="flotItem-wrap">
              <div class="flotItem" @click="goAnchor('page')"><img style="width: 13px;" src="./images/icon-up.png" alt="">返回顶部
                <div class="img-hide">
                  <img src="@/assets/images/activity618/go.png" alt="">
                </div>
              </div>
            </div>
        </div>
    </div>
    <!-- 规则弹窗 -->
    <Modal
        title="对话框标题"
        v-model="modal"
        :closable="false"
        :mask-closable="false"
        width="500px"
        class-name="vertical-center-modal">
            <div class="modalBox">
                <img src="@/assets/images/activity618/ruleTopImg.png" alt="" class="headerImg">
                <div class="rules" style="width: 500px">
                  <p v-for="(m_rule, m_index) in rules" :key="`m_${m_index}`">{{ `${m_index+1}、${m_rule}` }}{{ rules.length-m_rule===1?'。':';' }}</p>
                </div>
                <img src="@/assets/images/activity618/ruleBtn.png" alt="" class="ruleBtn" @click="modal = false">
            </div>
        <div slot="footer">
        </div>
    </Modal>
</div>
</template>

<script>
  import moment from 'moment'
  import GoodsItem from './goodsItem.vue'
  import TimeBox from './timeBox.vue'
  import { GoodsList618, acviPartner } from "@/api/activity/index";
  export default {
      components: {
          GoodsItem,
          TimeBox
      },
      data() {
          return {
              modal: false,
              hours: '0',
              mins: '0',
              seconds: '0',
              // end:'2022/05/21 12:30:00',
              freeList: [], // 0元购
              lowPriceList: [], //低价秒杀
              vatList: [], //vat秒杀
              erpList: [], // 合规秒杀
              couponList: [],  //优惠券
              startTime: '',
              endTime: '',
              isBefor: true,
              activityEnd: false,
              over: false,
              partner: 0,
              isBegin: false,
              rules: [
                '活动时间：每周四00：00：00~23：59：59',
                '参与用户：跨税云平台内所有注册用户',
                '秒杀商品不可与跨税云其他优惠共享',
                '因商品属性特殊，所有秒杀商品均不允许退换',
                '如有恶意刷订单获取秒杀商品等违反活动公平性的违规行为，跨税云将取消违规订单，且金额概不退还',
                '最终解释权归跨税云（深圳）科技有限公司所有'
              ]
          }
      },
      created () {
      },
      mounted () {
          this.getGoodsList()
          this.getPartners()
      },
      methods: {
          getPartners() {
              acviPartner().then( res => {
                  if( res.code == 0 ) {
                      if( res.data ) {
                          this.partner = Number( res.data ) >= 1000 ? '999+' : Number( res.data )
                      }
                  }
              })
          },
          goAnchor(selector){
              document.getElementById(selector).scrollIntoView({
                  behavior: "smooth",  // 平滑过渡
                  block:    "start"  // 上边框与视窗顶部平齐。默认值
              });
          },
          // 倒计时处理
          getInterval() {
              let that = this
              this.timer = setInterval(() => {
                  let timeTem = new Date().getTime()
                  let startTimeTem = new Date(this.startTime).getTime()
                  let endTimeTem = new Date(this.endTime).getTime()
                  let endTmp = ''
                  // 距离开始或结束
                  if( timeTem < startTimeTem ) {
                      this.isBefor = true
                      this.isBegin = false
                      this.over = false
                      endTmp = this.startTime
                  } else if (timeTem > startTimeTem && timeTem < endTimeTem) {
                      this.isBefor = false
                      this.isBegin = true
                      this.over = false
                      endTmp = this.endTime
                  } else {
                      this.isBegin = false
                      this.over = true
                      return false
                  }
                  let start = moment(new Date());//获取开始时间
                  let end = moment(new Date(endTmp));//结束时间
                  let diff = end.diff(start);//时间差
                  this.hours = moment.duration(diff).days()*24+moment.duration(diff).hours()
                  this.mins = moment.duration(diff).minutes()
                  this.seconds = moment.duration(diff).seconds()
                  if(this.hours <= 0 && this.mins <= 0 && this.seconds <= 0) {
                      this.getGoodsList()
                      if(!this.isBefor) {
                          this.activityEnd = true
                          clearInterval(that.timer)
                      }
                  } else {
                      this.activityEnd = false
                  }
              }, 1000)
          },
          // 商品列表
          getGoodsList() {
              GoodsList618(29).then( res => {
                  if( res.code == 0 && res.data) {
                      let list = res.data.activityItems
                      // 状态: 1:未开始,2:已结束,3,已售罄,4立即购买,5新用户专享
                      //  活动类型(1零元购 2爆款低价秒杀 3VAT专区秒杀 4EPR专区秒杀 5优惠券)
                      list.map( item => {
                          switch ( item.activityType ) {
                              case '1': this.freeList = item.activityProductList

                                  break;
                              case '2': this.lowPriceList = item.activityProductList
                                        this.startTime = item.startTime.replaceAll('-', '/')
                                        this.endTime = item.finishTime.replaceAll('-', '/')
                                  break;
                              case '3': this.vatList = item.activityProductList

                                  break;
                              case '4': this.erpList = item.activityProductList

                                  break;
                              case '5': this.couponList = item

                                  break;
                          }
                      })
                      // this.startTime = list[0].startTime.replaceAll('-', '/')
                      // this.endTime = list[0].finishTime.replaceAll('-', '/')
                      if( this.startTime && this.endTime && !this.over ) {
                          this.getInterval()
                      }
                  }
              })
          },
          buy(data) {
              let query = {
                      id: data.productInfoId,
                      from: 1,
                      activityStatus: data.status,
                      startTime: this.couponList.startTime.replaceAll('-', '/'),
                      endTime: this.couponList.finishTime.replaceAll('-', '/'),
                      activityType: this.couponList.activityType,
                      marketingActivityId: data.marketingActivityId
                  }
              // 支持的支付方式
              window.localStorage.setItem('supportPayType', JSON.stringify(data.supportPayType))
              this.$router.push({
                  name: "serviceDetail",
                  query
              })
          }
      },
      // 离开页面清除定时
      beforeDestroy() {
          if(this.timer) {
              clearInterval(this.timer)
          }
      }
  }
</script>

<style lang="less" scoped>
.page{
    position: relative;
}
.container{
    background: #f3b075 url("./images/bgAc.png") no-repeat center top/100% auto;
    padding-bottom: 140px;
}
.header{
    position: absolute;
    min-width: 1040px;
    width: 100vw;
}
.pageContiner{
    min-width: 1040px;
    width: 100vw;
    min-height: 100vh;
    position: relative;
    .content{
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;
        .bodyBg{
            width: 100%;
            visibility: hidden;
            img {
              display: block;
              width: 100%;
            }
        }
        .discountBox{
            padding: 25px 54px;
            margin-top: -10px;
            width: 1040px;
            height: 198px;
            background: url("~@/assets/images/activity618/discount.png") no-repeat;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            img{
                width: 256px;
                height: 146px
            }
            .right{
                width: 100%;
                margin-left: 20px;
                .titileBox{
                    display: flex;
                    align-items: center;
                    .extandTimes{
                        font-size: 20px;
                        color: #995530;
                        font-weight: bold;
                        font-style: italic;
                    }
                    .discountExtand{
                        font-size: 30px;
                        color: #F62C2C;
                        font-style: italic;
                        font-weight: bold;
                        margin-right: 10px;
                    }
                    .gift{
                        width: 164px;
                        height: 26px;
                        position: relative;
                        background: url("~@/assets/images/activity618/discountGift.png") no-repeat;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 14px;
                        font-weight: 400;
                        font-style: italic;
                        color: #FFFFFF;
                        line-height: 15px;
                    }
                }
                .subTitle{
                    margin-top: 13px;
                    width: 452px;
                    height: 36px;
                    font-size: 14px;
                    font-family: HarmonyOS Sans SC;
                    font-weight: 400;
                    font-style: italic;
                    color: #AA6946;
                    line-height: 20px;
                }
                .btnBox{
                    width: 100%;
                    margin-top: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .price{
                        width: 145px;
                        font-size: 34px;
                        font-family: HarmonyOS Sans SC;
                        font-weight: bold;
                        font-style: italic;
                        color: #FA4F4F;
                        background: linear-gradient(180deg, #F62C2C 43.65234375%, #F96B6B 99.31640625%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        margin-left: -10px;
                    }
                    .btnRight{
                        display: flex;
                        align-items: flex-end;
                        span{
                            font-size: 14px;
                            font-weight: 400;
                            font-style: italic;
                            color: #AA6946;
                            line-height: 20px;
                        }
                        .btn{
                            cursor: pointer;
                            margin-left: 19px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 160px;
                            height: 41px;
                            background: linear-gradient(0deg, #F62C2C 21%, #FA7171 100%);
                            box-shadow: 0px 4px 0px 0px rgba(221, 200, 183, 0.56);
                            border-radius: 4px;
                            font-size: 14px;
                            font-weight: 500;
                            font-style: italic;
                            color: #FDFDFD;
                            line-height: 20px;
                        }
                    }
                }
            }
        }
        .noPay{
            position: relative;
            display: inline-block;
            width: 1040px;
            height: 420px;
            background: url("~@/assets/images/activity618/noPay.png") no-repeat;
        }
        .lowPrice{
            position: relative;
            width: 1040px;
            height: auto;
            // background: url(@/assets/images/activity618/lowPrice.png) no-repeat;
        }
        .vat{
            position: relative;
            width: 1040px;
            height: 1588px;
            background: url("~@/assets/images/activity618/vat1.png") no-repeat;
        }
        #compliance, #vat, #lowPrice, #noPay{
            height: 64px;
        }
        .compliance{
            position: relative;
            width: 1040px;
            height: 462px;
            background: url("~@/assets/images/activity618/compliance.png") no-repeat;
        }
        .rules{
            margin: 62px 0 0;
            padding: 0 20px;
            width: 1040px;
            &-title {
              font-size: 22px;
              font-weight: 500;
              color: #FEFEFE;
              line-height: 24px;
              margin-bottom: 20px;
            }
            p{
                font-size: 14px;
                line-height: 24px;
                font-weight: bold;
                color: #FEFEFE;
                margin-bottom: 17px;
            }
        }
    }
    .goodsItems{
        padding: 0 10px;
        margin-top: 120px;
        margin-left: 10px;
        width: calc(100% - 20px) ;
        height: 251px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
    }
    .seconedKill{
        margin-top: 170px;
    }
    .lowPriceImg{
        width: 1020px;
        margin-left: 10px;
    }
    .lowPriceItems{
        margin-top: -20px;
        padding: 90px 10px 20px 10px;
        margin-left: 10px;
        width: calc(100% - 20px) ;
        display: flex;
        // justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;

        background: #FEF5EE;
        border: 4px solid #FFDC87;
        border-top: none;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        // border-image: linear-gradient(0deg, #FFDC87, #FFD679) 10 10;
        box-shadow: inset 0px 0px 5px 3px rgba(217, 132, 66, 0.46);
        .items{
            margin-bottom: 29px;
            margin:0 13px 29px 14px;
        }
    }
    .alot{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        .items{
            margin-left: 20px;
            margin-right: 6px;
            margin-bottom: 29px;
        }
    }
    .timer{
        position: absolute;
        width: 100%;
        top: 115px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        color: #89441E;
        .time{
            // height: 30px;
            background: linear-gradient(0deg, #EA461E 0%, #FB7042 100%);
            border-radius: 5px;
            font-size: 18px;
            color: #fff;
            font-weight: bold;
            margin-left: 20px;
            padding: 3px;
        }
    }
}
.flotRight{
    width: 146px;
    padding-top: 94px;
    min-height: 150px;
    background: url("./images/tab_head.png") no-repeat center top/100% auto;
    position: fixed;
    top: 10vw;
    left: 28px;
    display: flex;
    justify-content: center;
    .flotBox{
        display: flex;
        width: 100%;
        justify-content:  flex-start;
        align-items: flex-start;
        flex-direction: column;
        position: relative;
        .flotItem-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 46px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background: url("./images/tab_one_bg.png") no-repeat center/cover;
          &:first-child {
            height: 34px;
            background: url("./images/tab_two_bg.png") no-repeat center/cover;
            .img-hide img{
              top: 4px;
            }
          }
        }
        .flotItem{
            cursor: pointer;
            position: relative;
            width: 100%;
            height: 34px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 21px;
            padding-left: 6px;
            text-shadow: 2px 2px 3px rgba(163, 0, 0, 0.55);
            .hot-img {
              position: absolute;
              width: 30px;
              left: 10px;
              top: 50%;
              transform: translateY(-50%);
              img {
                display: block;
                width: 100%;
              }
            }
            >img {
              margin-right: 3px;
            }
            .img-hide img{
                cursor: pointer;
                height: 28px;
                width: 28px;
                position: absolute;
                right: -8px;
                top: 3px;
                display: none;
            }
            .callUs{
                display: none;
                width: 134px;
                height: 148px;
                right: -140px;
                margin-top: 20px;
            }
            &:hover{
                .img-hide img{
                    display: block;
                }
                .callUs{
                    right: -140px;
                    position: absolute;
                    display: block;
                    cursor: pointer;
                }

            }
        }
    }
}
.ruleFolt{
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 8vw;
    right: 0;
    width: 148px;
    height: 40px;
    background: linear-gradient(0deg, #ED682C 0%, #FF8758 100%);
    border-radius: 20px 0px 0px 20px;
    font-size: 22px;
    font-weight: bold;
    color: #FEFEFE;
    line-height: 24px;
    cursor: pointer;
}
&/deep/ .ivu-modal-header {
    display: none;
}
&/deep/ .ivu-modal-body {
    padding: 0;
}
// ::-webkit-scrollbar{
//     width: 3px;
// }
.modalBox{
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .headerImg{
        width: 500px;
        height: 75px;
    }
    .rules{
        padding: 10px 20px;
        overflow: auto;
        p{
            // height: 15px;
            font-size: 14px;
            font-family: HarmonyOS Sans SC;
            font-weight: bold;
            margin-bottom: 18px;
            color: #B1776D;
            line-height: 24px;
        }
    }
    .ruleBtn{
        cursor: pointer;
    }
    ::-webkit-scrollbar{ /*滚动条整体样式*/
        width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
    ::-webkit-scrollbar-thumb{ /*滚动条里面小方块*/
        border-radius: 10px;
        background: #ffd2af;
    }
    ::-webkit-scrollbar-track{ /*滚动条里面轨道*/
        border-radius: 10px;
        background: #fcdfc8;
    }
}


</style>
