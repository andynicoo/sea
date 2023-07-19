<template>
    <div class="container">
        <div class="top-box">
          <img class="top-bg" src="@/assets/images/prize618/bg-top.png" alt="">
          <div class="join-box" v-if="showJoin">
              <marquee class="join-content">
                  <span v-for="(v,i) in numList" :key="i">{{v}}参与了抽奖</span>
              </marquee>
          </div>
          <div class="right-box">
              <img src="@/assets/images/prize618/bag-btn.png" alt="" @click="ruleModal=true">
              <img src="@/assets/images/prize618/prize-btn.png" alt="" @click="showMyPrize">
              <div class="tip-content" v-if="tipShow">
                <p class="weight500">提示</p>
                <p>点击锦囊即可查看活动规则、奖品等信息</p>
                <div class="know-btn" @click="closeTip">我知道了</div>
              </div>
          </div>
        </div>
        <div class="bottom-bg">
            <div class="draw-box">
                 <scratch-card
                    class="draw-content"
                    elementId="elementId"
                    width="460px"
                    height="220px"
                    :moveRadius="moveRadius"
                    :ratio="0.4"
                    :clearCallback="clearCallbackUp"
                    :startCallback="startCallback"
                    coverColor="#fff"
                    :coverImg="coverImg"
                    :result="result"
                >
                </scratch-card>
                <p class="draw-text">{{drawText}}</p>
                <p class="prize-count">您今天还有{{prizeCount}}次抽奖机会</p>
            </div>
            <p class="bottom">活动最终解释权归跨税云所有</p>
        </div>
        <Modal v-model="ruleModal" width="500" class="rule-modal" :closable="false">
            <template #header>
            <img src="@/assets/images/prize618/rule-title.png" alt="">
            </template>
            <div class="rule-content">
                <p class="rule-title">活动奖品</p>
                <p>1.免单（以实际支付金额为准，最高2000元封顶）</p>
                <p>2. 豪华茶具</p>
                <p class="rule-title">抽奖/兑奖时间</p>
                <p>1.抽奖结束后平台会在7个工作日内联系您，免单奖励以返现方式，豪华茶具以邮寄方式兑奖。</p>
                <p class="rule-title">活动规则</p>
                <p>1. 2022年6月18日用户在跨税云下单且实际支付金额超过618元即可参与一次抽奖。</p>
                <p>2. 如若发现作弊或者恶意刷单行为，则取消参与资格。</p>
                <p>3. 活动最终解释权归跨税云所有。</p>
            </div>
            <template #footer>
            <img src="@/assets/images/prize618/rule-footer.png" style="cursor:pointer" alt="" @click="ruleModal=false">
            </template>
        </Modal>
        <Modal v-model="prizeModal" width="500" class="win-modal" :closable="false">
            <template #header>
            <img src="@/assets/images/prize618/win-title.png" alt="">
            </template>
            <div class="win-content" v-if="myPrizeLevel==1">
                <p class="prize-text">免单（以实际支付金额为准，最高2000元封顶）</p>
                <p>兑奖说明: 抽奖结束后，工作人员将在7个工作日内以现金的形式发放给您</p>
            </div>
            <div class="win-content" v-else-if="myPrizeLevel==2">
                <p class="prize-text">豪华茶具1套</p>
                <p>兑奖说明: 抽奖结束后，工作人员将在7个工作日内联系您确认并邮寄</p>
            </div>
            <div class="no-prize" v-else>
                <img src="@/assets/images/prize618/no-prize.png" alt="">
            </div>
            <template #footer>
                <div class="know-btn" @click="prizeModal=false">{{myPrizeLevel===3?'去抽奖':'我知道了'}}</div>
            <!-- <img src="@/assets/images/prize618/rule-footer.png" style="cursor:pointer" alt="" @click="prizeModal=false"> -->
            </template>
        </Modal>
        <Modal v-model="winningModal" :width="drawLevel==3?'566':'670'" class="winning-modal" :closable="false" footer-hide>
            <div :class="drawLevel!=3?'winning-content have-prize':'winning-content'">
                <p class="prize-text" v-if="drawLevel!=3">{{drawLevel==1?'免单':'豪华茶具一套'}}</p>
                <img class="prize-img" v-if="drawLevel==2" src="@/assets/images/prize618/prize-tea.png" alt="">
                <img class="prize-img" v-if="drawLevel==1" src="@/assets/images/prize618/prize-free.png" alt="">
                <div class="footer-box" >
                    <Button class="check-btn" v-if="drawLevel!=3" @click="winningModal=false;prizeModal=true">查看奖品</Button>
                    <Button :class="drawLevel!=3?'close-btn':'close-btn top506'" @click="winningModal=false">关闭</Button>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
import scratchCard from 'lzy-scratch-card'
import {getTimesAPI, getDrawResultAPI, getDrawRecordAPI} from '@/api/activity/index'
export default {
  components: {
    scratchCard
  },
  data () {
    return {
      tipShow: true,
      ruleModal: false,
      prizeModal: false,
      winningModal: false,
      result: `<img src="` + require('@/assets/images/prize618/prize3.png') + `"
                alt=""
                 width="460"
                height="220"/>
            `,
      coverImg: require('@/assets/images/prize618/draw-tip.png'),
      prizeCount: 0,
      moveRadius: 0,
      myPrizeLevel: 3, // 我的奖品获取几等奖
      numList: [],
      drawLevel: 3, // 抽中几等奖 1代表免单，2代表茶具，3代表没中
      nowTimestamp: null,
      showJoin: true
    }
  },
  computed: {
    drawText () {
      let text = ''
      let startTime = new Date('2022/06/18 15:00:00')
      let endTime = new Date('2022/06/19 00:00:00')
      if (this.nowTimestamp < startTime && new Date('2022/06/18 00:00:00') < this.nowTimestamp) {
        this.showJoin = false
        text = '刮奖未开始'
      }
      if (this.nowTimestamp > endTime) {
        text = '刮奖未已结束'
      }
      return text
    }
  },
  mounted () {
    this.tipShow = !localStorage.getItem('tipShow618')
    this.getCounts()
    this.getMoblieNum()
  },
  methods: {
    closeTip () {
      this.tipShow = false
      localStorage.setItem('tipShow618', true)
    },
    startCallback () {
      if (this.prizeCount <= 0) return
      this.moveRadius = 20
      getDrawResultAPI().then(res => {
        this.drawLevel = res.data
        this.myPrizeLevel = res.data
        if (this.drawLevel === 1) {
          this.result = `<img src="` + require('@/assets/images/prize618/prize1.png') + `"
                alt=""
                 width="460"
                height="220"/>
            `
        } else if (this.drawLevel === 2) {
          this.result = `<img src="` + require('@/assets/images/prize618/prize2.png') + `"
                alt=""
                 width="460"
                height="220"/>
            `
        }
      })
    },
    clearCallbackUp () {
        this.winningModal = true
        this.getCounts()
    },
    // 获取我的奖品
    showMyPrize () {
      this.prizeModal = true
      getDrawRecordAPI().then(res => {
        if (JSON.stringify(res.data) !== '{}') {
          this.myPrizeLevel = res.data.luckLevel
        }
      })
    },
    // 获取抽奖次数
    getCounts () {
      getTimesAPI().then(res => {
        this.prizeCount = res.data
        this.nowTimestamp = res.timestamp
      })
    },
    getMoblieNum () {
      var numArray = new Array('139', '138', '137', '136', '135', '134', '159', '158', '157', '150', '151', '152', '188', '187', '182', '183', '184', '178', '130', '131', '132', '156', '155', '186', '185', '176', '133', '153', '189', '180', '181', '177') // 这是目前找到的除了数据卡外的手机卡前三位，类型是字符串数组
      var arraryLength = numArray.length // 获取数组长度，这样如果手机号前三位取值单位发生变化，在下一步求i的地方就不用修改随机数取值范围了
      for (var n = 0; n < 100; n++) {
        var i = parseInt(Math.random() * arraryLength) // 注意乘以的是上面numArray数组的长度，这样就可以取出数组中的随机一个数。random的取值范围是大于等于0.0，小于1.0，相乘后得到的就是0到（数组长度-1）的值。
        var num = numArray[i] + '****' // 取出随机的手机号前三位并赋值给num，手机号前三位是字符串类型的
        for (var j = 0; j < 4; j++) {
          num = num + Math.floor(Math.random() * 10) // num是字符串，后面的数字被当做字符串。所以变成两个字符串拼接了
        }
        this.numList.push(num)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.container{
    width: 100%;
    position:relative;
    min-width: 1200px;
    padding: 0;
   .top-box{
        position:relative;
        overflow: hidden;
        .top-bg{
            width: 100%;
        }
        .join-box{
            width: 100%;
            position: absolute;
            bottom: 88px;
            text-align: center;
            .join-content{
                width: 1068px;
                height: 54px;
                background: #6013BE;
                border: 3px solid #6C19D0;
                box-shadow: -5px -8px 7px 0px rgba(98, 32, 186, 0.17), 7px 7px 7px 0px rgba(98, 32, 186, 0.17);
                border-radius: 24px;
                padding: 18px 0 18px 38px;
                margin: auto;
                overflow: hidden;
                white-space: pre;
                span{
                    margin-right: 20px;
                    color: #fff;
                }
            }
        }
        .right-box{
            position: absolute;
            right: -6px;
            bottom: 58px;
            img{
                display: block;
                cursor: pointer;
                margin-bottom: 10px;
            }
            .tip-content{
                width: 230px;
                height: 152px;
                background: url('../../assets/images/prize618/tip-box.png') no-repeat;
                right: 150px;
                top: -10px;
                position: absolute;
                padding: 28px;
                p{
                    font-size: 14px;
                    font-family: Alibaba PuHuiTi;
                    font-weight: 400;
                    color: #70439F;
                    line-height: 20px;
                }
                .weight500{
                    margin-bottom: 6px;
                }
                .know-btn{
                    width: 90px;
                    height: 24px;
                    background: linear-gradient(0deg, #E64F3D 0%, #FB9699 100%);
                    border-radius: 12px;
                    cursor: pointer;
                    text-align: center;
                    line-height: 24px;
                    color: #FFFFFF;
                    margin-top: 14px;
                    margin-left: 80px;
                }
            }
        }
   }
   .weight500{
       font-weight: 500 !important;
   }
   .bottom-bg{
        background: url('../../assets/images/prize618/bg-bottom.png') no-repeat;
        width:100%;
        height: 992px;
        margin-top: -226px;
        padding-top: 200px;
        .draw-box{
            width: 952px;
            height: 618px;
            background: url('../../assets/images/prize618/prize-bg.png') no-repeat;
            margin: auto;
            position: relative;
            text-align: center;
            .draw-content{
                position: absolute;
                top: 182px;
                left: 260px;
            }
            .draw-text{
                font-size: 37px;
                font-family: Alibaba PuHuiTi;
                font-weight: 500;
                color: #F6505B;
                position: absolute;
                bottom: 264px;
                width: 100%;
                z-index: 99;
            }
            .prize-count{
                font-size: 37px;
                font-family: Alibaba PuHuiTi;
                font-weight: 500;
                color: #FFF0F1;
                position: absolute;
                bottom: 100px;
                width: 100%;
            }
        }
   }
   .bottom{
        font-size: 14px;
        font-family: Alibaba PuHuiTi;
        font-weight: 400;
        color: #B1776D;
        width: 100%;
        text-align: center;
        margin-top: 68px;
   }
}
.rule-content{
    .rule-title{
        margin: 15px 0 10px 0;
        font-weight: 500;
    }
}
// 活动奖品
.win-content{
    background-color: #fff;
    padding: 18px 12px;
    box-shadow: 0px 8px 8px 0px rgba(253, 144, 114, 0.06);
    border-radius: 10px;
    color: #F36335;
    font-family: Alibaba PuHuiTi;
    .prize-text{
        font-weight: 500;
        font-size: 16px;
    }
}
.win-modal{
    .no-prize{
        text-align: center;
    }
    .know-btn{
        width: 151px;
        height: 36px;
        border-image: linear-gradient(0deg, #FFD678, #FFEAAB) 10 10;
        background: linear-gradient(180deg, #FF794A 0%, #E53C15 100%);
        // box-shadow: -7px -9px 5px 0px rgba(217, 132, 66, 0.46), 7px 8px 6px 0px rgba(217, 132, 66, 0.53);
        box-shadow: -6px -9px 13px 0px rgba(217, 132, 66, 0.23), 4px 5px 6px 0px rgba(217, 132, 66, 0.24);
        border-radius: 18px;
        margin: auto;
        font-size: 16px;
        font-family: Alibaba PuHuiTi;
        font-weight: 500;
        color: #FEF3EA;
        cursor: pointer;
        line-height: 36px;
    }
}

// 中奖弹窗
.winning-content{
    width: 566px;
    height: 682px;
    background: url('../../assets/images/prize618/winning-none.png') no-repeat;
    text-align: center;
    .prize-text{
        padding-top: 220px;
        font-size: 36px;
        font-family: Alibaba PuHuiTi;
        font-weight: 500;
        color: #FFEFB0;
    }
    .prize-img{
        margin-top: 75px;
    }
    .footer-box{
        margin-top: 46px;
        display: flex;
        justify-content: center;
        button{
            width: 226px;
            height: 64px;
            border-radius: 10px;
            font-size: 30px;
        }
        .check-btn{
            background: #B23CC0;
            color: #FFEFB0;
            margin-right: 38px;
        }
        .close-btn{
            border: 3px solid #B23CC0;
            color: #B23CC0;
            background: transparent;
        }
        .close-btn.top506{
            margin-top: 506px;
        }
    }
}
// 中奖
.winning-content.have-prize{
    width: 670px;
    height: 699px;
    background: url('../../assets/images/prize618/winning.png') no-repeat;
    text-align: center;
}
/deep/ .ivu-modal-header{
    padding: 0;
    border-radius: 8px 8px 0 0;
}
/deep/ .ivu-modal-body{
    background: #FEF3EA;
    box-shadow: -6px -9px 13px 0px rgba(217, 132, 66, 0.23), 4px 5px 6px 0px rgba(217, 132, 66, 0.24);
}
/deep/ .ivu-modal-footer{
    background-color: #fef3ea;
    text-align:center;
    padding-top:30px;
    border-radius: 0 0 8px 8px;
}
/deep/ .ivu-modal-body{
    padding:20px 28px;
    background-color: #fef3ea;
    color: #B1776D;
    font-size:14px;
    line-height:24px;
    padding-bottom: 10px !important;
}
.winning-modal{
    /deep/ .ivu-modal-body{
        padding: 0;
        background: transparent;
        box-shadow:none;
    }
    /deep/ .ivu-modal-content{
        background-color: transparent;
        box-shadow:none;
    }
}
@media screen and (max-width: 1600px) {
    .join-box{
        bottom: 60px !important;
    }
}
</style>
