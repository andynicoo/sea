<template>
  <div class="container">
    <div class="top-box">
      <img src="./images/big-banner.png" alt="">
    </div>
    <div class="join-box" v-if="showJoin">
      <marquee class="join-content">
        <span v-for="(v,i) in numList" :key="i">{{v}}参与了抽奖</span>
      </marquee>
    </div>
    <div class="right-box">
      <img src="./images/bg-rule.png" alt="" @click="ruleModal=true">
      <img src="./images/bg-prize.png" alt="" @click="showMyPrize">
      <div class="tip-content" v-if="tipShow">
        <p class="weight500">提示</p>
        <p>点击锦囊即可查看活动规则、奖品等信息</p>
        <div class="know-btn" @click="closeTip">我知道了</div>
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
      <p class="bottom">活动最终解释权归跨标云所有</p>
    </div>
    <Modal v-model="ruleModal" width="500" class="rule-modal" :closable="false">
      <template #header>
        <img src="@/assets/images/prize618/rule-title.png" alt="">
      </template>
      <div class="rule-content">
        <p v-for="(rule, index) in rules" :key="`rule_${index}`">{{ index+1 }}、{{ index===rules.length-1?rule+';':rule }}</p>
      </div>
      <template #footer>
        <img src="@/assets/images/prize618/rule-footer.png" style="cursor:pointer" alt="" @click="ruleModal=false">
      </template>
    </Modal>
    <Modal v-model="prizeModal" width="370" class="win-modal" :closable="false">
      <template #header>
        <img src="@/assets/images/prize618/win-title.png" alt="">
      </template>
      <div class="win-content" v-if="myPrizeLevel==1">
        <p class="prize-text">1000元美标立减金</p>
        <dl>
          <dt>使用说明：</dt>
          <dd>恭喜您获得1000元美标立减金，系统已以优惠 券形式发放至个人中心，优惠券适用于美国商 标商品购买，有效期至2022年9月30日24:00， 失效不予退换。</dd>
        </dl>
      </div>
      <div class="no-prize" v-else>
        <img src="@/assets/images/prize618/no-prize.png" alt="">
      </div>
      <template #footer>
        <div class="know-btn" @click="prizeModal=false">{{myPrizeLevel===3?'去抽奖':'我知道了'}}</div>
      </template>
    </Modal>
    <Modal v-model="winningModal" footer-hide class="modal-winner" :transfer="false" width="360">
      <div class="modal-winner-content">
        <img class="prize-img" v-if="+drawLevel===1" src="./images/bg-2.png" alt="">
        <img class="prize-img" v-if="+drawLevel===3 || !Object.keys(drawLevel).length" src="./images/bg-1.png" alt="">
      </div>
      <div class="modal-winner-footer">
        <Button class="btn btn-ok" v-if="+drawLevel!==3 && Object.keys(drawLevel).length" @click="winningModal=false;prizeModal=true">查看奖品</Button>
        <Button class="btn btn-close" @click="winningModal=false">关闭</Button>
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
      result: `<img src="` + require('./images/prize3.png') + `"
                alt=""
                 width="460"
                height="220"/>
            `,
      coverImg: require('./images/draw-tip.png'),
      prizeCount: 0,
      moveRadius: 0,
      myPrizeLevel: 3, // 我的奖品获取几等奖
      numList: [],
      drawLevel: 3, // 抽中几等奖 1代表免单，2代表茶具，3代表没中
      nowTimestamp: null,
      showJoin: true,
      rules: [
        '秒杀时间：2022年9与5日9:00-2022年9月10日24:00',
        '抽奖时间：2022年9月5日9:00-2022年9月8日24:00',
        '参与用户：跨标云平台所有注册用户',
        '所有在2022年9月5日9:00-2022年9月8日24:00下单美标的用户均可参与抽奖，奖品为1000元美标立减优惠券，优惠券有效期至2022年9月30日24:00，过期失效，不退不换',
        '由于商品属性，所有秒杀商品不退不换',
        '如发现有违规行为（如恶意刷单获取秒杀商品等违反活动公平性问题），跨标云活动组织方将取消相关订单，金额概不退还',
        '活动最终解释权归深圳市跨标云科技有限公司所有'
      ]
    }
  },
  computed: {
    drawText () {
      let text = ''
      let startTime = new Date('2022/08/18 15:00:00')
      let endTime = new Date('2022/09/19 00:00:00')
      if (this.nowTimestamp < startTime && new Date('2022/06/18 00:00:00') < this.nowTimestamp) {
        this.showJoin = false
        text = '刮奖未开始'
      }
      if (this.nowTimestamp > endTime) {
        text = '刮奖已结束'
      }
      return text
    }
  },
  mounted () {
    if (localStorage.getItem('tipShow618')) {
      this.tipShow = false
    } else {
      localStorage.setItem('tipShow618', true)
      this.tipShow = true
    }
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
          this.result = `<img src="` + require('./images/prize1.png') + `"
                alt=""
                 width="460"
                height="220"/>
            `
        } else if (this.drawLevel === 2) {
          this.result = `<img src="` + require('./images/prize2.png') + `"
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
        this.prizeCount = 20 || res.data
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
@import "./style.less";
</style>
