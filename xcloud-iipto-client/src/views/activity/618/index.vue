<template>
    <div class="container" id="page" ref='page'>
      <HeaderPage></HeaderPage>
      <div class="top-box">
          <img class="top-bg" src="@/assets/images/activity618/bg-top.png" alt="">
          <img class="rule-button" src="@/assets/images/activity618/rule-btn.png" @click="ruleModal=true" alt="">
      </div>
      <div class="bottom-bg">
        <!-- <img class="bg-img" src="@/assets/images/activity618/bottom-bg.png" alt=""> -->
        <div class="coupon-box clearfix">
          <img src="@/assets/images/activity618/coupon-img.png" alt="" class="fl">
          <div class="fl">
            <div class="first-line">
              <span class="glob">10倍膨胀</span>
              <span class="red">￥6.18元变￥61.8元</span>
              <img src="@/assets/images/activity618/gift-label.png" alt="" class="label">
            </div>
            <div class="coupon-rule">使用说明：优惠券购买时间为2022年6月14日9:00--2022年6月18日 12:00，<br>2022年6月18日17:20分失效，每个ID限购1张,不支持退款</div>
            <div class="last-line clearfix">
              <span class="coupon-price">￥6.18元</span>
              <div class="fr">
                <span class="glob">已有{{joinNum}}人参与抢购</span>
                <div class="buy-btn" @click="buyNow">立即抢购</div>
              </div>
            </div>
          </div>
        </div>
        <div class="low-price-content">
          <div class="count-down-box">
            距离秒杀
            <span class="time-box">{{countDow.hour}}</span>时<span class="time-box">{{countDow.minute}}</span>分<span class="time-box">{{countDow.second}}</span>秒
            后{{countText}}
          </div>
          <div class="service-box clearfix">
            <div  v-for="(v,i) in lowList.activityProductList" :key="i">
              <div class="low-long-content clearfix" v-if="i===0">
              <img class="fl main-img" :src="getImgUrl(v.pcProductImgUrl)" alt="">
              <div class="fl right-content">
                <p class="service-title">{{v.productName}}</p>
                <p class="service-describe">
                  <span v-for="(item,index) in v.noSkuProductAttributeRelationVOList" :key="index">{{item}}</span>
                </p>
                <div class="buy-box">
                  <Button :class="v.status===4?'buy':''" @click="toDetail(v)">{{getStatusFunc(v)}}</Button>
                </div>
                <div class="price-box clearfix">
                  <span class="now-price">
                    <span>秒杀价：¥</span><span class="font44">{{v.flashPrice}}</span>
                  </span>
                  <span class="old-price">¥{{v.standardPrice}}/类</span>
                  <span class="progress fr" v-if="v.status!=2">
                    已售{{initProgressFunc (v) }}% <Progress :percent="initProgressFunc (v)" hide-info stroke-color="#F74747" :stroke-width="17"/>
                  </span>
                </div>
              </div>
              </div>
              <div class="low-short-content clearfix fl" v-if="i>0">
                <img class="fl main-img" :src="getImgUrl(v.pcProductImgUrl)" alt="">
                <div class="fl right-content">
                  <p class="service-title">{{v.productName}}</span></p>
                  <p class="service-describe">
                    <span v-for="(item,index) in v.noSkuProductAttributeRelationVOList" :key="index">{{item}}</span>
                  </p>
                  <div class="price-box">
                    <span class="now-price">
                      <span>秒杀价：¥</span><span class="font24">{{v.flashPrice}}</span>
                    </span>
                    <span class="old-price">¥{{v.standardPrice}}/类</span>
                  </div>
                  <div class="buy-box short-box clearfix">
                    <Button :class="v.status===4?'buy':''" @click="toDetail(v)">{{getStatusFunc(v)}}</Button>
                    <span class="progress fr"  v-if="v.status!=2">
                      已售{{initProgressFunc(v)}}% <Progress :percent="initProgressFunc (v) " hide-info stroke-color="#F74747" :stroke-width="10"/>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rule-box">
          <p class="title">活动规则</p>
          <div class="content">
            <p>1、活动时间：</p>
            <p class="one-sub">（1). 6.18元膨胀金预付时间：2022年6月14号9:00-2022年6月18号12:00；</p>
            <p class="one-sub">（2). 秒杀时间为：2022年6月18号15:00-17:00；</p>
            <p>2、参与用户：跨标云平台内所有注册用户；</p>
            <p>3、仅2022年6月18号15:00-17:00参与官网秒杀用户才可有机会获得抽奖机会;</p>
            <p>4、膨胀金有效期截至6月18日17:20前的秒杀时间段使用，预付膨胀金用户错过秒杀，过期未使用不予退还，可获赠运营礼包；</p>
            <p>5、由于商品属性，所有秒杀商品均不允许退换；</p>
            <p>6、秒杀商品需支付成功后才算秒杀成功，秒杀商品数量有限先到先得；</p>
            <p>7、秒杀商品暂不同跨标云的其他优惠共享；</p>
            <p>8、参与秒杀商品： 美国商标注册 一标一类、美国商标注册（顾问）一标一类、英国商标 一标一类、欧盟商标 一标一类、日本商标  一标一类； </p>
            <p>9、如被发现有违规行为（如恶意刷订单获取秒杀商品等违反活动公平性的问题），跨标云活动组织方将取消你的秒杀订单，订单金额概不退还；</p>
            <p>10、最终解释权归跨标云（深圳）科技有限公司所有。</p>
          </div>
        </div>
      </div>
      <Modal v-model="ruleModal" width="500" class="rule-modal" :closable="false">
        <template #header>
          <img src="@/assets/images/activity618/rule-title.png" alt="">
        </template>
        <div class="rule-content">
          <p>1、活动时间：</p>
          <p class="one-sub">（1). 6.18元膨胀金预付时间：2022年6月14号9:00-2022年6月18号12:00；</p>
          <p class="one-sub">（2). 秒杀时间为：2022年6月18号15:00-17:00；</p>
          <p>2、参与用户：跨标云平台内所有注册用户；</p>
          <p>3、仅2022年6月18号15:00-17:00参与官网秒杀用户才可有机会获得抽奖机会;</p>
          <p>4、膨胀金有效期截至6月18日17:20前的秒杀时间段使用，预付膨胀金用户错过秒杀，过期未使用不予退还，可获赠运营礼包；</p>
          <p>5、由于商品属性，所有秒杀商品均不允许退换；</p>
          <p>6、秒杀商品需支付成功后才算秒杀成功，秒杀商品数量有限先到先得；</p>
          <p>7、秒杀商品暂不同跨标云的其他优惠共享；</p>
          <p>8、参与秒杀商品： 美国商标注册 一标一类、美国商标注册（顾问）一标一类、英国商标 一标一类、欧盟商标 一标一类、日本商标  一标一类；</p>
          <p>9、如被发现有违规行为（如恶意刷订单获取秒杀商品等违反活动公平性的问题），跨标云活动组织方将取消你的秒杀订单，订单金额概不退还；</p>
          <p>10、最终解释权归跨标云（深圳）科技有限公司所有。</p>
        </div>
        <template #footer>
          <img src="@/assets/images/activity618/rule-footer.png" style="cursor:pointer" alt="" @click="ruleModal=false">
        </template>
      </Modal>
      <!-- 左边浮动按钮 -->
      <div  class="float-eft">
        <div class="float-box">
            <div class="float-item">联系我们
              <img src="@/assets/images/activity618/phone-code.png" alt="" class="contact-us">
            </div>
            <div class="float-item" ><img src="@/assets/images/activity618/phone.png" alt="" >手机端
              <img src="@/assets/images/activity618/h5-code.png" alt="" class="contact-us">
            </div>
            <div class="float-item" @click="goAnchor('page')">
               <img src="@/assets/images/activity618/to-top-icon.png" alt="" >返回顶部
            </div>
        </div>
    </div>
    </div>
</template>
<script>
import {getActivityListApi, getActJoinNumAPI} from '@/api/618activity/index'
import HeaderPage from '@/components/common/header'
export default{
  components: {HeaderPage},
  data () {
    return {
      lowList: [],
      couponList: [],
      ruleModal: false,
      startTime: '',
      endTime: '',
      countDow: {
        hour: '00',
        minute: '00',
        second: '00'
      },
      joinNum: 0,
      countText: '开始'
    }
  },
  methods: {
    goAnchor (selector) {
      document.getElementById(selector).scrollIntoView({
        behavior: 'smooth', // 平滑过渡
        block: 'start' // 上边框与视窗顶部平齐。默认值
      })
    },
    // 获取头图
    getImgUrl (val) {
      if (val) {
        return JSON.parse(val)[0].imgUrl
      } else {
        return ''
      }
    },
    getActivityFunc (isInit = false) {
      getActivityListApi(this.enterpriseId).then(res => {
        if (res.code === 0) {
          res.data.activityItems.map(item => {
            switch (item.activityType) {
              case '2':
                this.lowList = item
                this.startTime = item.startTime
                this.endTime = item.finishTime
                break
              case '5': this.couponList = item
                break
            }
          })
        }
      }).finally(() => {
        if (isInit) this.countTime()
      })
      getActJoinNumAPI().then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.joinNum = Number(res.data) > 1000 ? '999+' : Number(res.data)
          }
        }
      })
    },
    // 按钮文字
    getStatusFunc (item) {
      let btnText = ''
      switch (item.status) {
        case 1:
          btnText = '活动未开始'
          break
        case 2:
          btnText = '活动已结束'
          break
        case 3:
          btnText = '已售罄'
          break
        case 4:
          btnText = '抢购中'
          break
        default:
          break
      }
      return btnText
    },
    // 进度条
    initProgressFunc (v) {
      let num = 0
      num = v.status === 1 ? 0 : v.status === 2 ? 100 : v.status === 3 ? 100 : v.status === 4 ? v.ratio : 0
      return isNaN(num) ? 0 : num
    },
    countTime () {
      let that = this
      var date = new Date()
      var now = date.getTime()
      var endDate = new Date(this.startTime)// 设置截止时间
      if (now < endDate) {
        endDate = new Date(this.startTime.replace(/-/g, '/')).getTime()
        this.countText = '开始'
      } else {
        endDate = new Date(this.endTime.replace(/-/g, '/')).getTime()
        this.countText = '结束'
      }
      var leftTime = endDate - now // 时间差
      let h = 0, m = 0, s = 0
      console.log('startTime', this.startTime)
      // 递归每秒调用countTime方法，显示动态时间效果
      that.timer = setTimeout(this.countTime, 1000)
      if (leftTime >= 0) {
        h = Math.floor(leftTime / 1000 / 60 / 60)
        m = Math.floor(leftTime / 1000 / 60 % 60)
        s = Math.floor(leftTime / 1000 % 60)
      } else {
        console.log('已开始')
        this.getActivityFunc()
        clearInterval(that.timer)
      }
      this.countDow = {
        hour: h > 9 ? h : '0' + h,
        minute: m > 9 ? m : '0' + m,
        second: s > 9 ? s : '0' + s
      }
    },
    toDetail (v) {
      localStorage.setItem(this.lowList.marketingActivityId, v.supportPayType)
      window.location.href = '/productDetail?id=' + v.productInfoId + '&status=' + v.status + '&startTime=' + this.startTime + '&endTime=' + this.endTime + '&activityType=' + this.lowList.activityType + '&marketingActivityId=' + this.lowList.marketingActivityId + '&buyLimit=' + v.buyLimit + '&orderCancelTime=' + v.orderCancelTime
      // this.$router.push({
      //   path: 'productDetail',
      //   query: {
      //     id: v.productInfoId,
      //     status: v.status,
      //     startTime: this.startTime,
      //     endTime: this.endTime,
      //     activityType: this.lowList.activityType,
      //     marketingActivityId: this.lowList.marketingActivityId
      //   }
      // })
    },
    buyNow () {
      let buyProduct = {
        price: this.couponList.activityProductList[0].flashPrice,
        pcProductDetail: this.getImgUrl(this.couponList.activityProductList[0].pcProductImgUrl),
        productName: this.couponList.activityProductList[0].productName,
        productId: this.couponList.activityProductList[0].productInfoId,
        id: this.couponList.activityProductList[0].productInfoId,
        productSkuId: this.couponList.activityProductList[0].productInfoSkuId,
        pcProductImgUrl: this.couponList.activityProductList[0].pcProductImgUrl,
        countryName: '',
        productInfoAttributeGroupVOList: [],
        marketingActivityId: this.couponList.marketingActivityId,
        activityType: this.couponList.activityType,
        orderCancelTime: this.couponList.activityProductList[0].orderCancelTime,
        productAmount: 1 // 数量
      }
      localStorage.setItem('selectedList', JSON.stringify(buyProduct))
      localStorage.setItem(this.couponList.marketingActivityId, this.couponList.activityProductList[0].supportPayType)
      window.location.href = '/sureOrder?id=' + this.couponList.activityProductList[0].productInfoId + '&from=buyNow&count=1&type=act&skuId=' + this.couponList.activityProductList[0].productInfoSkuId
      // this.$router.push({
      //   path: 'sureOrder',
      //   query: {
      //     id: this.couponList.activityProductList[0].productInfoId,
      //     from: 'buyNow',
      //     count: 1,
      //     skuId: this.couponList.activityProductList[0].productInfoSkuId,
      //     type: 'act'
      //   }
      // })
    }
  },
  created () {
    this.getActivityFunc(true)
  },
  beforeDestroy () {
    if (this.timer) { // 如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer) // 关闭
    }
  }
}
</script>
<style lang="less" scoped>
.container{
  width: 100%;
  position:relative;
  padding: 70px 0 0 0;
  .top-box {
    position:relative;
    min-width: 1200px;
    .top-bg{
      width: 100%;
    }
    .rule-button{
      position:absolute;
      right:0;
      top:142px;
      cursor:pointer;
    }

  }
  .bottom-bg{
    min-width: 1200px;
    background: url('../../../assets/images/activity618/bottom-bg.png') no-repeat;
    width:100%;
    height: 1740px;
    margin-top:-226px;
    position:relative;
    padding-top: 48px;
    .coupon-box{
      background: url('../../../assets/images/activity618/coupon-bg.png') no-repeat;
      width: 1030px;
      height: 180px;
      margin: auto;
      position: relative;
      padding:18px 50px;
      div.fl{
        margin-left: 22px;
        min-width:650px;
        .first-line{
          font-style: italic;
          font-weight:bold;
          font-family: 'HarmonyOS_Sans_SC_Bold';
          .glob{
            color:#995530;
            font-size: 22px;
          }
          .red{
            color: #F73A3A;
            font-size: 30px;
            margin: 0 22px 0 16px;
          }
        }
        .coupon-rule{
          font-size: 14px;
          font-family: HarmonyOS Sans SC;
          font-weight: 400;
          font-style: italic;
          color: #AA6946;
          line-height: 20px;
          margin-top: 12px;
        }
        .last-line{
          margin-top: 18px;
          .coupon-price{
            font-size: 34px;
            font-family: HarmonyOS Sans SC;
            font-weight: bold;
            font-style: italic;
            color: #FA4F4F;
            line-height: 20px;
            text-shadow: 0px 4px 0px rgba(221, 200, 183, 0.56);
            background: linear-gradient(180deg, #F62C2C 43.65234375%, #F96B6B 99.31640625%);
            -webkit-background-clip: text;
          }
          .fr{
            margin-top:-8px;
            .glob{
              font-family: HarmonyOS Sans SC;
              font-weight: 400;
              font-style: italic;
              color: #AA6946;
            }
            .buy-btn{
              width: 160px;
              height: 40px;
              background: linear-gradient(0deg, #F62C2C 21%, #FA7171 100%);
              box-shadow: 0px 4px 0px 0px rgba(221, 200, 183, 0.56);
              border-radius: 4px;
              text-align: center;
              line-height: 40px;
              font-size: 22px;
              font-family: HarmonyOS Sans SC;
              font-weight: 400;
              font-style: italic;
              color: #FDFDFD;
              display:inline-block;
              margin-left:20px;
              cursor:pointer;
            }
          }
        }
      }
    }
    .low-price-content{
      width: 1190px;
      height: 890px;
      margin: 70px auto;
      background: url('../../../assets/images/activity618/low-price-out.png') no-repeat center;
      padding: 122px 30px 0 54px;
      .count-down-box{
        text-align:center;
        font-size: 22px;
        font-family: Alibaba PuHuiTi;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 15px;
        text-shadow: 0px 3px 3px rgba(0, 19, 135, 0.29);
        .time-box{
          width: 30px;
          height: 30px;
          background: linear-gradient(180deg, #FA7144, #E0240B);
          border-radius: 5px;
          line-height:30px;
          font-size: 16px;
          font-family: Alibaba PuHuiTi;
          font-weight: 500;
          text-align:center;
          display:inline-block;
          margin:0 8px;
        }
      }
      .service-box{
        margin-top:22px;
        .main-img{
          width: 140px;
          height: 140px;
          border-radius: 8px;
        }
        .low-long-content{
          background: url('../../../assets/images/activity618/low-big-bg.png') no-repeat center;
          height: 212px;
          width: 1080px;
          padding:35px 25px;
        }
        .right-content{
            margin-left: 34px;
            min-width:780px;
            .service-title{
              font-size: 24px;
              font-family: Alibaba PuHuiTi;
              font-weight: 500;
              color: #89441E;
              span{
                font-size:16px;
              }
            }
            .service-describe{
              font-size: 16px;
              font-family: Alibaba PuHuiTi;
              font-weight: 400;
              color: #89441E;
              margin-top:4px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .buy-box{
              text-align: right;
              button{
                width: 189px;
                height: 45px;
                background: linear-gradient(180deg, #FF803C, #E94029);
                border-radius: 22px;
                line-height:45px;
                font-size: 22px;
                font-family: Alibaba PuHuiTi;
                font-weight: 400;
                color: #FFFFFF;
                border: none;
                opacity: 0.4;
              }
              button.buy{
                opacity: 1;
              }
            }
            .price-box{
              .now-price{
                font-size: 18px;
                font-family: Alibaba PuHuiTi;
                font-weight: 400;
                color: #F01E02;
                display: inline-block;
                margin-top: -14px;
                .font44{
                  font-size:44px;
                  font-weight: bold;
                }
              }
              .old-price{
                font-size: 24px;
                font-family: Alibaba PuHuiTi;
                font-weight: 400;
                text-decoration: line-through;
                color: #DA9C6D;
                margin-left: 12px;
              }
              .progress{
                margin-left: 162px;
                font-size: 24px;
                font-family: HarmonyOS Sans SC;
                font-weight: 400;
                font-style: italic;
                color: #89441E;
                line-height: 42px;
                /deep/ .ivu-progress{
                  width:188px;
                  margin-left:9px;
                }

              }
            }
          }
          /deep/ .ivu-progress-inner{
            background-color: #fdd2cd;
          }
        .low-short-content{
          background: url('../../../assets/images/activity618/low-small-bg.png') no-repeat center;
          width: 530px;
          height: 210px;
          margin-top:20px;
          padding:32px 30px;
          .right-content{
            margin-left:16px;
            min-width:304px;
            max-width: 304px;
            .service-title{
              font-size:20px;
            }
            .service-describe{
              font-size:14px;
            }
            .price-box{
              font-size:14px;
              margin-top:12px;
              .old-price{
                font-size:14px
              }
            }

          }
        }
        .low-short-content:nth-child(2n){
          margin-right: 20px;
        }
        .buy-box.short-box{
          text-align: left;
          margin-top:10px;
          button{
            width: 120px;
            height: 28px;
            background: linear-gradient(180deg, #FF803C, #E94029);
            border-radius: 14px;
            font-size:14px;
            line-height:28px;
          }
          .progress{
            font-style: italic;
            color: #89441E;
            margin-left:30px;
            /deep/ .ivu-progress{
              width:90px;
            }
          }
        }
      }
    }
    .group-content{
      width: 1190px;
      height: 1240px;
      background: url('../../../assets/images/activity618/group-bg.png') no-repeat center;
      .service-box {
        .low-long-content{
          background: url('../../../assets/images/activity618/group-long-bg.png') no-repeat center;
          padding: 35px 46px;

          .right-content{
            min-width:440px;
            margin-left:20px;
            .service-title{
              font-size:20px;
            }
            .service-describe{
              font-size:14px;
            }
            .price-box{
              .now-price{
                font-size:14px;
              }
            }
            .buy-box.short-box .progress{
              margin-left: 50px;
            }
          }
        }
        .low-short-content{
          background: url('../../../assets/images/activity618/group-small-bg.png') no-repeat center;
          width: 530px;
          height: 367px;
          padding: 35px 84px;
          .right-content{
            margin-top: 24px;
            margin-left:0;
          }
        }
        .left-content{
          display:flex;
          .jia{
            color: #FF7553;
            font-weight:bold;
            font-size:18px;
            margin:0 10px;
            align-self:center;
          }
        }

      }
    }
    .font24{
      font-size:24px !important;
    }
    .font14{
      font-size:14px !important;
    }
    .rule-box{
      width:1200px;
      margin:auto;
      padding:0 55px;
      .title{
        font-size: 22px;
        font-family: HarmonyOS Sans SC;
        font-weight: bold;
        color: #FEFEFE;
      }
      .content{
        margin-top:20px;
        font-size: 14px;
        font-family: HarmonyOS Sans SC;
        font-weight: bold;
        color: #FEFEFE;
        line-height: 28px;
        letter-spacing: 1px;
        .one-sub{
          text-indent: 12px;
        }
        .two-sub{
          text-indent: 222px;
        }
      }
    }
  }
  .float-eft{
    position: fixed;
    left: 0;
    top: 202px;
    width: 202px;
    height: 298px;
    background: url('../../../assets/images/activity618/floating.png') no-repeat center;
    .float-box{
      padding-top: 92px;
      text-align: center;
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 21px;
      text-shadow: 2px 2px 3px rgba(163, 0, 0, 0.55);
      .float-item{
        position: relative;
        margin-top: 40px;
        cursor: pointer;
        img{
          vertical-align: middle;
          margin-right: 6px;
        }
        .contact-us{
          width: 176px;
          height: 162px;
          position: absolute;
          top: -74px;
          left: 198px;
          display: none;
        }
        &:hover{
          .contact-us{
            display: block;
          }
        }
      }
    }
  }
}
/deep/ .ivu-modal-header{
    padding:0;
    border-bottom:0;
    background-color:#fff;
  }
  /deep/ .ivu-modal-body{
    padding:20px 28px;
    background-color: #fef3ea;
    color: #B1776D;
    font-size:14px;
    line-height:24px;
  }
  /deep/ .ivu-modal-footer{
    background-color: #fef3ea;
    text-align:center;
    padding-top:20px;
  }
  .rule-content{
    .one-sub{
      text-indent: 12px;
    }
    .two-sub{
      text-indent: 48px;
    }
  }
  /deep/ .ivu-btn:hover{
    border-color: transparent;
  }
  /deep/ .ivu-modal-header{
    border-radius: 8px 8px 0 0;
  }
  /deep/ .ivu-modal-footer{
    border-radius: 0 0 8px 8px;
  }

</style>
