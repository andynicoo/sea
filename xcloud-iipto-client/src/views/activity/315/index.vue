<!-- 315落地页 -->
<template>
  <div class="mainContent ">
    <center>
      <div class="main">
        <header>
          <img src="@/assets/images/activity315/315Header.svg" alt="">
        </header>
        <div class="middle" :key="goodSKey">
          <div class="activity">
            <template v-for=" (item,index) in barList">
              <Bar :item=item :sign="sign" :actInfo=actInfoData :index="index" @click.native="getIdx(index)" :key="index"> </Bar>
            </template>
          </div>
          <div class="commodity">
            <template v-for="(item,index) in bgStyleList">
              <GoosList :goodList="goodList" :actInfo=actInfoData :backgroundStyle="item" :sign='sign' @over_callback="getGoodMsg" :id=item.id :index=index :key="item.key" @showGitf="showGitf"></GoosList>
            </template>
          </div>
        </div>
        <footer>
          <div>
            <img src="@/assets/images/activity315/footer.svg" alt="">
          </div>
        </footer>
      </div>
    </center>
    <div v-show="bigGirgPopo" class="showBigGirg">
      <div class="coliseBtn" @click="coliseBtn">
        <img src="@/assets/images/activity315/coliseBtn.png" width="36px" alt="">
      </div>
      <div>
        <img src="@/assets/images/activity315/gitfPopo.svg" width="771px" alt="">
      </div>

    </div>
    <div v-show="bigGirgPopo" class="cover"></div>
  </div>

</template>

<script>
// import footer from '../../../components/common/footer.vue'
import GoosList from './components/goods.vue'
import Bar from './components/bar.vue'
import { getActivityList } from '@/api/315actvie/index.js'
import { publicAtivtyInfo } from './mixins/actvityMixins.js'
export default {
  mixins: [publicAtivtyInfo],
  components: { GoosList, Bar },
  data () {
    const backgroundRepeat = 'no-repeat'
    const backgroundPosition = 'center'
    const backgroundSize = 'contain'
    return {
      // isActivity: false,
      sign: 0,
      bigGirgPopo: false,
      bgStyleList: [ // 子组件样式  backgroundImage:'url(' + require('./images/xxx..jpg') + ')',
        {
          backgroundImage: 'url(' + require('../../../assets/images/activity315/middle/1.png') + ')',
          // country: require('@/assets/images/activity315/middle/us.png'),
          backgroundRepeat,
          backgroundPosition,
          backgroundSize,
          goodNumers: 300,
          goodName: '美国商标注册',
          introduce: '一个工作日内递交商标局，资深顾问全程专业服务',
          sign: 1,
          zhijiang: 200,
          price: 2299,
          key: 0
        },
        {
          backgroundImage: 'url(' + require('../../../assets/images/activity315/middle/2.png') + ')',
          // country: '@/assets/images/activity315/middle/us.png',
          // country: require('@/assets/images/activity315/middle/us.png'),
          backgroundRepeat,
          backgroundPosition,
          backgroundSize,
          goodNumers: 300,
          goodName: '美国商标注册(顾问）',
          introduce: '顾问一站式服务，省时省心省力',
          sign: 2,
          // id: 100730,
          zhijiang: 400,
          price: 2599,
          key: 1
        },
        {
          backgroundImage: 'url(' + require('../../../assets/images/activity315/middle/3.png') + ')',
          // country: '../../../assets/images/activity315/middle/ua.png',
          // country: require('@/assets/images/activity315/middle/ua.png'),
          backgroundRepeat,
          backgroundPosition,
          backgroundSize,
          goodNumers: 150,
          goodName: '英国商标注册',
          introduce: '影响全球的国家，商标注册高度开放，审核快捷',
          sign: 3,
          // id: 100737,
          zhijiang: 300,
          price: 2399,
          key: 2
        },
        {
          backgroundImage: 'url(' + require('../../../assets/images/activity315/middle/4.png') + ')',
          // country: '../../../assets/images/activity315/middle/yg.png',
          // country: require('@/assets/images/activity315/middle/yg.png'),
          backgroundRepeat,
          backgroundPosition,
          backgroundSize,
          goodNumers: 150,
          goodName: '欧盟商标注册',
          introduce: '一次注册，享受27个国家共同保护',
          sign: 4,
          // id: 100726,
          zhijiang: 400,
          price: 7999,
          key: 3
        }
      ],
      subsing: {
        stus: 0
      },
      goodList: [],
      goodSKey: 0,
      actInfoData: null,
      barList: [
        {
          time: '3月9日 15:00-17:00',
          state: 'KEY1',
          idx: 1
        },
        {
          time: '3月15日 15:00-18:00',
          state: 'KEY2',
          idx: 2
        },
        {
          time: '3月18日 15:00-17:00',
          state: 'KEY3',
          idx: 3
        }
      ]

    }
  },
  provide () {
    return {
      subsing: this.subsing
    }
  },

  mounted () {
    // this.getGoodMsg()
    console.log(1)
    // this.getActivityListAPi();
  },

  created () {
    this.currentDate()
    // console.log(2);
    this.setCreateSign()
  },

  methods: {
    showGitf (e) {
      this.bigGirgPopo = true
    },
    coliseBtn () {
      this.bigGirgPopo = false
    },

    setCreateSign () {
      let { node } = this.actInfoList.find(item => item.type == 1 || item.type == 3)
      this.sign = node
      this.getActivityListAPi(this.sign)
    },
    /**
     * 全局状态中心
    * 动态判断 当前时间 是否在活动期间
    *  * 判断活动状态 1 进行中 2 结束  3未开始
    *  活动日期对应 KEY1= 3/9 KEY2=3/15 KEY3=3/18
    */
    currentDate () {
      console.log('自动计算倒计时')
      let atNodeList = [1646809200000, 1647327600000, 1647586800000], data = null // 三场活动
      atNodeList.forEach((item, index) => { // 72
        data = this.currentAvtivy(item, item + 10800000, index)
      })
      this.actInfoData = data
      console.log(this.actInfoData)
      this.goodSKey = new Date().getTime()
    },
    /**
    * 获取子组件的消息
    */
    getGoodMsg (data) {
      // console.log("收到消息", data);

      console.log('收到通知更新节点', data)
      this.actInfoData = this.stopActivy()
      this.goodSKey = new Date().getTime()
      this.$forceUpdate()
    },
    /**
     * 事件中心
     */
    getIdx (idx) {
      this.sign = idx
      this.subsing.stus = idx
      this.setIGooodNums(idx)
      this.getActivityListAPi(idx)
    },
    /**
     * 点击goods 调整活动界面展示变化
     * day: 0 :1: 2 ;对应=> 9 15  18  三场活动
     */
    setIGooodNums (day) {
      let info = [ // num商品数量  id:id price:价格 , zj：直降
        [{ id: 1, num: 300, price: 2299, zj: 200 }, { id: 2, num: 400, price: 2599, zj: 400 }, { id: 3, num: 150, price: 2399, zj: 300 }, { id: 4, num: 150, price: 7999, zj: 400 }], // 9日商品
        [{ id: 1, num: 400, price: 2299, zj: 200 }, { id: 2, num: 600, price: 2599, zj: 400 }, { id: 3, num: 200, price: 2399, zj: 300 }, { id: 4, num: 200, price: 7999, zj: 400 }], // 15日商品
        [{ id: 1, num: 300, price: 2299, zj: 200 }, { id: 2, num: 300, price: 2599, zj: 400 }, { id: 3, num: 150, price: 2399, zj: 300 }, { id: 4, num: 150, price: 7999, zj: 400 }] // 18日商品
      ]
      let nowData = info[day]
      this.bgStyleList.forEach((item, index) => {
        let { id, num, price, zj } = nowData[index]
        if (item.sign == id) {
          item.goodNumers = num
          item.price = price
          item.zhijiang = zj
        }
      })
    },

    /**
 * 落地页接口
 */
    async getActivityListAPi (idx = 0) {
      let activityDate = idx == 0 ? '2022-03-09' : idx == 1 ? '2022-03-15' : '2022-03-18'
      let parm = {
        activityPlatform: 1, // 跨标云
        activityDate
      }
      let { message, extra: { list }, code, timestamp } = await getActivityList(parm)
      if (code == 0) {
        this.goodList = list.length > 0 ? this.setGoodList(list) : []
      } else {
        this.$message.error(message)
      }
    },
    /**
     * 后台数据 按照界面商品顺序重新排序
     */
    setGoodList (list) {
      let array = []
      list.forEach(element => {
        if (element.productId == 188 || element.productId == 101257) { // 美国商标排序
          array.splice(0, 0, element)
        } else if (element.productId == 315 || element.productId == 101258) { // 美国商标注册顾问
          array.splice(1, 0, element)
        } else if (element.productId == 184 || element.productId == 101259) { // 英国
          array.splice(2, 0, element)
        } else {
          array.splice(3, 0, element)
        }
      })
      return array
    }
  }

}

</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 100%;
  height: 2227px;
  background: url("../../../assets/images/activity315/315bg.png") no-repeat
    center;
  background-size: cover;
  vertical-align: top;
  center {
    position: relative;
    .main {
      width: 1000px;
      margin-top: 529px;
      .middle {
        background: url("../../../assets/images/activity315/middleBG.svg")
          no-repeat center;
        background-size: contain;
        // width: 1000px;
        margin-top: 35px;
        height: 710px;
        padding: 117px 21px 0px 21px;
        .activity {
          // padding: 0px 0px 28px 0px;
          display: grid;
          grid-template-columns: repeat(3, 33.4%);
          font-size: 22px;
          font-family: HarmonyOS Sans SC;
          color: rgba(240, 69, 1, 1);
          border: 2px solid #f3ba36;
          border-radius: 12px;
        }
        .commodity {
          > div {
            // width: 475px;
            // height: 200px;
            position: relative;
            > .instantSpike {
              position: absolute;

              top: 151px;
              left: 163px;
            }
          }

          margin-top: 28px;
          display: inline-grid;
          grid-template-columns: repeat(2, 50%);
          justify-items: center;
          align-items: center;
          // width: 966px;
          grid-row-gap: 4px;
          grid-column-gap: 4px;
          width: 958px;
        }
      }
      header {
      }
      footer {
        margin-top: 35px;
        width: 1000.5px;
        // height: 100px;
      }
    }
  }
}
.showBigGirg {
  position: fixed;
  top: 0%;
  left: 28.5%;
  z-index: 1000;
  .coliseBtn {
    position: absolute;
    top: 5%;
    left: 85%;
  }
}

.cover {
  position: fixed;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.4);
  width: 100%; /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
  height: 100%;
  filter: alpha(opacity=60); /*设置透明度为60%*/
  opacity: 0.6; /*非IE浏览器下设置透明度为60%*/

  z-index: 999;
}
</style>
