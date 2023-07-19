<template>
    <div class="page container" id="page" ref='page'>
      <div class="top-box">
          <img class="top-bg" src="./images/bg-top.png" alt="">
          <img class="rule-button" src="@/assets/images/activity618/rule-btn.png" @click="ruleModal=true" alt="">
      </div>
      <div class="bottom-bg">
        <div class="box-bg" id="box-low" v-if="lowList.activityProductList && lowList.activityProductList.length">
          <div class="box-bg-head">
            <div class="box-bg-head-title">爆款低价</div>
          </div>
          <div class="box-bg-content">
            <div class="low-price-content">
              <div class="count-down-box">
                距离秒杀
                <TimeCount :startTime="lowList.startTime" :endTime="lowList.finishTime" />
              </div>
              <div class="service-box">
                <div class="service-box-item"  v-for="(v,i) in lowList.activityProductList" :key="i">
                  <div class="service-box-item-left">
                    <img class="main-img" :src="getImgUrl(v.pcProductImgUrl)" alt="">
                  </div>
                  <div class="service-box-item-content">
                    <div>
                      <p class="service-box-item-title line-clamp">{{v.productName}}</p>
                      <p class="service-box-item-describe line-clamp" v-if="false">
                        <span v-for="(item,index) in v.noSkuProductAttributeRelationVOList" :key="index">{{item}}</span>
                      </p>
                    </div>
                    <div class="service-box-item-footer">
                      <div class="service-box-item-price">
                        <div class="now-price">
                          ¥<span>{{v.flashPrice}}</span>
                        </div>
                        <span class="old-price">¥{{v.standardPrice}}</span>
                      </div>
                      <div class="service-box-item-buy">
                        <Button :class="v.status===4?'buy':'noBuy'" @click="toDetail(v)">{{getStatusFunc(v)}}</Button>
                        <div class="progress">
                          已售{{initProgressFunc(v)}}% <Progress :percent="initProgressFunc (v)" hide-info stroke-color="#FF2D3D" :stroke-width="10"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box-bg-footer"></div>
        </div>
        <div class="box-bg" id="box-limit" v-if="limitList.activityProductList && limitList.activityProductList.length">
          <div class="box-bg-head">
            <div class="box-bg-head-title">限时折扣商品区</div>
          </div>
          <div class="box-bg-content">
            <div class="low-price-content">
              <div class="count-down-box">
                距离秒杀
                <TimeCount :startTime="limitList.startTime" :endTime="limitList.finishTime" />
              </div>
              <div class="service-box">
                <div class="service-box-item"  v-for="(v,i) in limitList.activityProductList" :key="i">
                  <div class="service-box-item-left">
                    <img class="main-img" :src="getImgUrl(v.pcProductImgUrl)" alt="">
                  </div>
                  <div class="service-box-item-content">
                    <div>
                      <p class="service-box-item-title line-clamp">{{v.productName}}</p>
                      <p class="service-box-item-describe ellipsis" v-if="false">
                        <span v-for="(item,index) in v.noSkuProductAttributeRelationVOList" :key="index">{{item}}</span>
                      </p>
                    </div>
                    <div class="service-box-item-footer">
                      <div class="service-box-item-price">
                        <div class="now-price">
                          ¥<span>{{v.flashPrice}}</span>
                        </div>
                        <span class="old-price">¥{{v.standardPrice}}</span>
                      </div>
                      <div class="service-box-item-buy">
                        <Button :class="v.status===4?'buy':'noBuy'" @click="toDetail(v)">{{getStatusFunc(v)}}</Button>
                        <div class="progress">
                          已售{{initProgressFunc(v)}}% <Progress :percent="initProgressFunc (v)" hide-info stroke-color="#FF2D3D" :stroke-width="10"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box-bg-footer"></div>
        </div>
      </div>
      <div class="rule-box">
        <p class="title">活动规则</p>
        <div class="content">
          <p v-for="(rule, index) in rules" :key="index">{{ `${index+1}、${rule}` }}{{ rules.length - index === 1 ? '。' : ';' }}</p>
        </div>
      </div>
      <!-- 规则弹窗 -->
      <Modal v-model="ruleModal" width="500" class="rule-modal" :closable="false">
        <template #header>
          <img src="@/assets/images/activity618/rule-title.png" alt="">
        </template>
        <div class="rule-content">
          <p v-for="(rule, index) in rules" :key="index">{{ `${index+1}、${rule}` }}{{ rules.length - index === 1 ? '。' : ';' }}</p>
        </div>
        <template #footer>
          <img src="@/assets/images/activity618/rule-footer.png" style="cursor:pointer" alt="" @click="ruleModal=false">
        </template>
      </Modal>
      <!-- 左边浮动按钮 -->
      <div class="active-slider">
        <div class="active-slider-head"></div>
        <div class="active-slider-content">
          <div v-if="lowList.activityProductList && lowList.activityProductList.length" class="active-slider-item active-slider-item-hot" @click="goAnchor('box-low')">
            <div class="active-slider-item-text">爆款低价</div>
            <div class="active-slider-item-go"></div>
          </div>
          <div v-if="limitList.activityProductList && limitList.activityProductList.length" class="active-slider-item active-slider-item-hot" @click="goAnchor('box-limit')">
            <div class="active-slider-item-text">限时折扣</div>
            <div class="active-slider-item-go"></div>
          </div>
          <div class="active-slider-item">
            <div class="active-slider-item-icon"></div>
            <div class="active-slider-item-text">联系我们</div>
            <div class="active-slider-item-go"></div>
            <div class="active-slider-item-hide">
              <img src="../images/icon-code.png" alt="">
              <p>
                有任何问题<br />请联系客服
              </p>
            </div>
          </div>
          <div class="active-slider-item" @click="goAnchor('page')">
            <div class="active-slider-item-iconUp"></div>
            <div class="active-slider-item-text">返回顶部</div>
            <div class="active-slider-item-go"></div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { GoodsList618 } from "@/api/activity/index";
import TimeCount from '@/components/Common/timeCount'
export default{
  components: {TimeCount},
  data () {
    return {
      // 爆款低价
      lowList: [],
      // 限时折扣
      limitList: [],
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
      countText: '开始',
      rules: [
        '活动时间：2022年8月27日9：00~8月31日24：00',
        '参与用户：跨税云平台所有注册用户',
        '由于商品属性，所有秒杀商品不退不换',
        '如发现有违规行为（如恶意刷单获取秒杀商品等违反活动公平性问题），跨税云活动组织方将取消相关订单，订单金额概不退还',
        '活动最终解释权归跨税云（深圳）科技有限公司所有'
      ]
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
      GoodsList618(29).then(res => {
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
              case '3': this.limitList = item
                break
            }
          })
        }
      })
    },
    // 按钮文字
    getStatusFunc (item) {
      let btnText = ''
      switch (item.status) {
        case 1:
          btnText = '即将开始'
          break
        case 2:
          btnText = '已结束'
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
    toDetail (data) {
      let query = {
        id: data.productInfoId,
        from: 1,
        activityStatus: data.status,
        startTime: this.limitList.startTime.replaceAll('-', '/'),
        endTime: this.limitList.finishTime.replaceAll('-', '/'),
        activityType: this.limitList.activityType,
        marketingActivityId: data.marketingActivityId
      }
      console.log('query', query);
      // 支持的支付方式
      window.localStorage.setItem('supportPayType', JSON.stringify(data.supportPayType))
      this.$router.push({
        name: "serviceDetail",
        query
      })
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
      localStorage.setItem('buyProductInfo', JSON.stringify(buyProduct))
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
@import "../font/font.less";
.container{
  width: 100%;
  position:relative;
  padding: 0 0 100px 0;
  background: linear-gradient(90deg, #F06D43 0%, #FFAE94 40%, #FFAE94 68%, #F06D43 100%);
  .top-box {
    position:relative;
    min-width: 1200px;
    margin-bottom: -60px;
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
  .box-bg {
    &:not(:last-child) {
      margin-bottom: 112px;
    }
    &-head {
      height: 65px;
      width: 100%;
      position: relative;
      background: url("../images/box-bg-1.png") no-repeat 0 center/1000px 100%;
      &-title {
        position: absolute;
        width: 460px;
        height: 74px;
        line-height: 74px;
        text-align: center;
        font-family: 'boxTitle';
        font-size: 42px;
        color: #fff;
        letter-spacing: 3px;
        text-shadow: 0px 4px 3px #DB1B01;
        left: 50%;
        bottom: 34px;
        transform: translateX(-50%);
        background: url("../images/box-bg-title.png") no-repeat center/100% auto;
      }
    }
    &-content {
      background: url("../images/box-bg-2.png") repeat-y 0 center/1001px auto;
    }
    &-footer {
      height: 30px;
      background: url("../images/box-bg-3.png") no-repeat 0 bottom/1000px 100%;
    }
  }
  .bottom-bg{
    position: relative;
    width: 1000px;
    margin: 0 auto;
    .low-price-content{
      width: 1000px;
      margin: 0 auto;
      .count-down-box{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        font-weight: 500;
        color: #8A4621;
        line-height: 32px;
        margin-bottom: 28px;
        .meClocker {
          margin-left: 17px;
          font-size: 24px;
          font-weight: 500;
          /deep/ .run-time {
            .timing {
              width: 36px;
              height: 36px;
              line-height: 36px;
              text-align: center;
              background: linear-gradient(180deg, #FB7042 0%, #ED4C23 100%);
              border-radius: 4px;
              font-size: 24px;
              font-weight: 500;
              color: #FFFFFF;
            }
          }
        }
        .time-box{
          width: 30px;
          height: 30px;
          background: linear-gradient(180deg, #FA7144, #E0240B);
          border-radius: 5px;
          line-height:30px;
          font-size: 16px;
          color: #fff;
          font-family: Alibaba PuHuiTi;
          font-weight: 500;
          text-align:center;
          display:inline-block;
          margin:0 8px;
        }
      }
    }
    .service-box {
      display: grid;
      justify-content: space-between;
      padding: 0 30px;
      grid-column-gap: 20px;
      grid-row-gap: 20px;
      grid-template-columns: repeat(4, 1fr);
      &-item {
        display: flex;
        width: 220px;
        height: 276px;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        color: #A45428;
        border-radius: 10px;
        line-height: 22px;
        background: #FEE7D6;
        border: 2px solid #FEC3A1;
        overflow: hidden;
        &-left {
          height: 124px;
          overflow: hidden;
          img {
            display: block;
            width: 100%;
            margin: 0 auto;
          }
        }
        &-content {
          flex: 1;
          height: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px;
        }
        &-title {
          font-size: 18px;
          font-weight: 500;
          color: #8A4621;
          line-height: 32px;
          margin-bottom: 5px;
        }
        &-price {
          .now-price {
            font-size: 18px;
            color: #FF323A;
            span {
              font-size: 28px;
            }
          }
          .old-price {
            font-size: 12px;
            text-decoration: line-through;
            color: rgba(164,84,40,0.6);
          }
        }
        &-footer {
          display: flex;
          justify-content: space-between;
        }
        &-buy {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          button {
            padding: 0;
            width: 92px;
            height: 26px;
            line-height: 26px;
            text-align: center;
            border: 0;
            color: #fff;
            font-size: 14px;
            font-weight: 500;
            background: linear-gradient(180deg, #FF7B5E 0%, #FF0022 100%);
            border-radius: 100px 100px 100px 100px;
            opacity: 1;
            &.noBuy {
              opacity: 0.5;
            }
          }
          .progress {
            display: flex;
            align-items: center;
            white-space: nowrap;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
            /deep/ .ivu-progress-inner {
              width: 60px;
              margin-left: 5px;
              background: #FFC4B6;
            }
          }
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
    .font24{
      font-size:24px !important;
    }
    .font14{
      font-size:14px !important;
    }
  }
  .rule-box{
    width: 1000px;
    margin: 80px auto 0;
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
/** 侧边栏重写 **/
.active-slider {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-head {
    width: 152px;
    height: 86px;
    background: url("../images/left-head-bg-seven.svg") no-repeat center/100% 100%;
  }
  &-item {
    width: 136px;
    height: 35px;
    line-height: 30px;
    text-align: center;
    background: linear-gradient(180deg, #FC7244 0%, #E7421A 100%);
    border: 2px solid #FFE794;
    margin-bottom: 10px;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 14px;
    color: #FFFFFF;
    &:not(:first-child):before {
      content: '';
      position: absolute;
      bottom: calc(100% + 2px);
      left: 50%;
      transform: translate(-50%, 0) skewX(45deg);
      width: 120px;
      height: 11px;
      background: #D41313;
    }
    &-text {
      display: inline-block;
      vertical-align: middle;
    }
    &-hot {
      &:after {
        content: '';
        position: absolute;
        width: 29px;
        height: 23px;
        left: 5px;
        top: 50%;
        transform: translateY(-50%);
        background: url("../images/icon-hot.png") no-repeat center/100% auto;
      }
    }
    &-iconUp {
      width: 13px;
      height: 14px;
      display: inline-block;
      vertical-align: middle;
      background: url("../images/icon-up.png") no-repeat center/100% 100%;
    }
    &-go {
      display: none;
      position: absolute;
      right: 0;
      top: 50%;
      width: 26px;
      height: 26px;
      background: url("../images/icon-go.png") no-repeat center/100% 100%;
      transform: translate(50%, -50%);
    }
    &-hide {
      display: none;
      position: absolute;
      width: 133px;
      height: 143px;
      top: 50%;
      padding: 10px 16px 10px 27px;
      transform: translateY(-50%);
      left: calc(100% + 10px);
      background: url("../images/icon-bg.png") no-repeat left center/100% auto;
      font-size: 12px;
      color: #666666;
      line-height: 14px;
      >img {
        display: block;
        width: 90px;
        margin-bottom: 3px;
      }
    }
    &:hover {
      .active-slider-item-go, .active-slider-item-hide {
        display: block;
      }
    }
  }
}
</style>
