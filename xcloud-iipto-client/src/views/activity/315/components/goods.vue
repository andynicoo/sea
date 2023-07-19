<!--  -->
<template>
  <div class="goods" :style="[backgroundStyle]" @click="goDetails(backgroundStyle.sign)">

    <div class="goodtext">
      <div class="goodName">{{backgroundStyle.goodName}}</div>
      <div class="goodIntroduce">{{backgroundStyle.introduce}} </div>
    </div>
    <span class="zhijiang">{{backgroundStyle.zhijiang}}</span>
    <span class="price">{{backgroundStyle.price}}</span>
    <div class="country">
      <img :src="backgroundStyle.country" alt="">
    </div>
    <div class="numGoods" :style="index == 1 ? 'left:72.5%':''">(仅限前{{backgroundStyle.goodNumers}}名)</div>

    <!-- 活动进行中 -->
    <template v-if="actNodeState == 1">
      <div class="purchase">
        <!-- {{ percent }} -->
        <Progress :percent="percent == 0 ? 100 : percent" :stroke-color="(setVale == 0|| actEndTime == timestamp) ? '#EEA593':'#F43406'" :stroke-width="20">
          <Icon type="checkmark-circled"></Icon>
          <!-- 销售量为0 显示 -->
          <span class="progressTips" v-if="quantitySold">正在疯抢</span>
          <!-- endTime == timestamp -->
          <!-- {{setVale}} -->
          <span class="progressTips" v-else-if="setVale == 0|| actEndTime == timestamp　">已抢光</span>
          <span class="progressTips" v-else>剩余{{ setVale }}个</span>
        </Progress>
      </div>
      <!--  -->
      <div v-if="setVale != 0 ||actEndTime == timestamp  ">
        <div class="instantSpike" @click.stop="goDetails(backgroundStyle.sign)">
          <div class="">
            <img src="@/assets/images/activity315/InstantSpike.png" width="184px">
          </div>
          <!-- {{startTime}} -->
          <count-dow ref="ctd" class="count" :currentTime="timestamp" :startTime="actStartTime" :endTime="actEndTime" v-on="$listeners"> </count-dow>
        </div>
      </div>
      <div v-else>
        <div class="instantSpike">
          <div class="">
            <img src="@/assets/images/activity315/yqg.png" width="184px">
          </div>
        </div>
      </div>
    </template>
    <!-- 活动已经结束 -->
    <template v-if="actNodeState == 2">
      <div class="purchase">
        <img src="@/assets/images/activity315/activityOver.png" width="183px" alt="">
      </div>
    </template>
    <!-- 活动未开始 -->
    <template v-if="actNodeState == 3">
      <div class="purchase" @click.stop="showPopup">
        <img src="@/assets/images/activity315/bigGift.png" width="183px" alt="">
      </div>
    </template>

  </div>

</template>

<script>
import countDow from './countDow.vue';
import { publicAtivtyInfo } from "../mixins/actvityMixins.js"
import { actNode } from "../util/util.js"
export default {
  mixins: [publicAtivtyInfo],
  props: {
    backgroundStyle: Object,
    surplus: Number,
    index: Number,
    // id: Number,
    sign: { //用户点击的 标记 0 1 2
      type: Number,
      default: 0,
    },
    goodList: {
      type: Array,
      required: true
    },
    actInfo: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      limitPurchase: 0, //剩余商品个数
      dataList: [],
      stuatus: 3,
    };
  },
  watch: {
    sign(n, old) {
      let ctd = this.$refs.ctd
      if (ctd && ctd.subsing.stus == this.sign) {
        clearTimeout(ctd.timeOut)
      }
    },
  },
  computed: {
    /**
     * 商品已购买数量
     */
    setVale() {  //商品已购买数量                  商品总量                                          销售量
      let val = this.goodList.length > 0 ? this.goodList[this.index].limitPurchase - this.goodList[this.index].quantitySold : 0;
      return val;
    },
    /**
   * 商品是否有销售量
   */
    quantitySold() { //商品
      let val = this.goodList.length > 0 && this.goodList[this.index].quantitySold == 0 ? true : false;
      return val
    },
    /**
     * 活动状态
     */
    actNodeState: function () {
      // console.log("good活动状态", actNode(this.actInfo, this.sign).type);
      return actNode(this.actInfo, this.sign) && actNode(this.actInfo, this.sign).type;
    },
    // 结束时间
    actEndTime: function () {
      return actNode(this.actInfo, this.sign) && actNode(this.actInfo, this.sign).endTime;
    },
    // 开始时间
    actStartTime: function () {

      return actNode(this.actInfo, this.sign) && actNode(this.actInfo, this.sign).startTime;
    },
    /**
     * 
     */
    percent() {

      // console.log(this.index, this.goodList.length > 0 && ((this.goodList[this.index].quantitySold / this.goodList[this.index].limitPurchase) * 100));
      // console.log("quantitySold", this.goodList.length > 0 && this.goodList[this.index].quantitySold);
      // console.log("limitPurchase", this.goodList.length > 0 && this.goodList[this.index].limitPurchase);
      return this.goodList.length > 0 && (100 - ((this.goodList[this.index].quantitySold / this.goodList[this.index].limitPurchase) * 100));
    }
  },

  components: {
    countDow
  },

  methods: {
    goDetails(id) {
      // console.log(this.newDatalist[id].productId);
      if (this.goodList.length != 0) {
        if ((this.timestamp >= this.actStartTime && this.timestamp < this.actEndTime) && (this.setVale != 0 && this.actEndTime != this.timestamp)) {
          // debugger
          window.location.href = "/productDetail?id=" + this.goodList[this.index].productId + "&act=" + true + "&sign=" + this.sign;
        }
      } else {
        console.error("没有商品")
      }

    },
    showPopup() {
      this.$emit("showGitf", true);
    },


  }
}

</script>
<style lang='less' scoped>
.goods {
  width: 470px;
  height: 200px;
  position: relative;
  .goodtext {
    text-align: left;
    position: absolute;
    left: 35%;
    top: 28px;
    .goodName {
      font-size: 20px;
      font-family: Alibaba PuHuiTi;
      font-weight: 500;
      color: #e0240b;
    }
    .goodIntroduce {
      font-size: 13px;
      font-family: Alibaba PuHuiTi;
      font-weight: 400;
      color: #e0240b;
    }
  }
  .price {
    font-size: 25px;
    font-family: Alibaba PuHuiTi;
    font-weight: 400;
    position: relative;
    top: 41%;
    color: #e0240b;
    font-weight: 600;
  }
  .zhijiang {
    font-family: Alibaba PuHuiTi;
    font-weight: 400;
    position: relative;
    top: 17.8%;
    left: -36.2%;
    color: #fcfbe2;
    font-weight: 500;
  }
  .numGoods {
    position: absolute;
    left: 62.5%;
    top: 15.5%;
    color: #f86912;
    font-size: 15px;
    font-family: Alibaba PuHuiTi;
    font-weight: 550;
  }
  .purchase {
    position: absolute;
    // botton: 36px;
    width: 230px;
    top: 119px;
    left: 163px;
    text-align: left;
  }
  /deep/ .ivu-progress-inner {
    // text-align: left;
    background: #eea593;
  }
  .progressTips {
    font-size: 12px;
    font-family: Alibaba PuHuiTi;
    font-weight: 400;
    color: #fffcfc;
    width: 100px;
    position: absolute;
    left: 78px;
  }
  .instantSpike {
    position: absolute;
    // botton: 36px;
    top: 151px;
    left: 161px;
  }
  .country {
    position: absolute;
    left: 36.5px;
    top: 117px;
  }
  .count {
    position: absolute;
    left: 60%;
    top: 23%;
    font-size: 13px;
    font-weight: 400;
    color: #e0240b;
  }
}
</style>