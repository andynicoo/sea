<template>
  <div class="container" :class="{ new: currentActivity.newStyle }" id="page" ref="page" :style="containerStyle">
    <div class="big-banner">
      <img v-if="typeof currentActivity.bg.banner_big === 'string'" :src="currentActivity.bg.banner_big" alt="" />
      <template v-else>
        <img v-for="(img, index) in currentActivity.bg.banner_big" :src="img" :key="index" alt="" />
      </template>
    </div>
    <div class="active-rule-btn" @click="$refs['rules']._data.show = true">活动规则</div>
    <div class="active-main">
      <div class="active-content" v-if="activityList">
        <template v-for="box in activityList">
          <GoodsPanel :id="box.label" :key="box.label" v-if="box.data.activityProductList.length" :title="box.title">
            <div class="count-down-box">
              距离秒杀
              <TimeCount
                :startTime="box.data.startTime"
                :endTime="box.data.finishTime"
                :showDay="currentActivity.showDay"
              />
            </div>
            <GoodsTemplate
              @toDetail="toDetail($event, box.data)"
              :list="box.data.activityProductList"
              :is-row="box.isRow"
              :show-progress="box.data.showProgress"
            />
          </GoodsPanel>
        </template>
      </div>
      <div class="rule-box">
        <p class="title">活动规则</p>
        <div class="content">
          <p v-for="(rule, index) in currentActivity.rules" :key="index">
            {{ `${index + 1}、${rule}` }}{{ currentActivity.rules.length - index === 1 ? '。' : ';' }}
          </p>
        </div>
      </div>
    </div>
    <!-- 左边浮动按钮 -->
    <ActiveSlider @goAnchor="goAnchor" :addSlide="addSlide" :bg="currentActivity.bg.banner_slide" />
    <!-- 规则弹窗 -->
    <DialogRules :class="{ new: currentActivity.newStyle }" :rules="currentActivity.rules" ref="rules"> </DialogRules>
  </div>
</template>
<script>
import { GoodsList618 } from '@/api/activity/index';
import TimeCount from '@/components/Common/timeCount';
import GoodsTemplate from './components/goodsTemplate';
import GoodsPanel from './components/goodsPanel';
import ActiveSlider from './components/slider';
import DialogRules from './components/dialogRules';
import { ACTIVITY } from '@/libs/activityConfig.js';
export default {
  components: { TimeCount, GoodsTemplate, GoodsPanel, ActiveSlider, DialogRules },
  data() {
    return {
      couponList: null,
      ruleModal: false,
      rules: [
        '活动时间：2022年9月5日9：00-2022年9月10日24：00',
        '参与用户：跨税云平台所有注册用户',
        '由于商品属性，所有秒杀商品不退不换',
        '如发现有违规行为（如恶意刷单获取秒杀商品等违反活动公平性问题），跨税云活动组织方将取消相关订单，订单金额概不退还',
        '活动最终解释权归跨税云（深圳）科技有限公司所有',
      ],
      isBefor: true,
      activityList: {},
    };
  },
  computed: {
    currentActivity() {
      const type = this.$route.query.type || 'midAutumn'; // 默认中秋
      const { ACTIVITY_LIST } = ACTIVITY;
      return ACTIVITY_LIST.filter((v) => v.type === type)[0];
    },
    addSlide() {
      const { activityList } = this;
      let temp = {};
      let arr = [];
      if (Object.keys(activityList).length) {
        for (let key in activityList) {
          temp = {
            title: activityList[key].title,
            id: activityList[key].label,
          };
          arr.push(temp);
        }
      }
      return arr;
    },
    containerStyle() {
      return {
        'padding-top': this.currentActivity.top ? this.currentActivity.top : '777px',
        'background-color': this.currentActivity.bg.color,
      };
    },
  },
  methods: {
    goAnchor(selector) {
      document.getElementById(selector).scrollIntoView({
        behavior: 'smooth', // 平滑过渡
        block: 'start', // 上边框与视窗顶部平齐。默认值
      });
    },
    // 获取头图
    getImgUrl(val) {
      if (val) {
        return JSON.parse(val)[0].imgUrl;
      } else {
        return '';
      }
    },
    getActivityFunc() {
      GoodsList618(29).then((res) => {
        if (res.code === 0) {
          const {
            currentActivity: { typeData },
          } = this;
          if (!!res.data) {
            Object.keys(typeData).forEach((key) => {
              res.data.forEach((item) => {
                if (item.activityType === key) {
                  this[typeData[key]] = item;
                  let temp = {
                    data: item,
                    ...typeData[key],
                  };
                  this.$set(this.activityList, [typeData[key].label], temp);
                }
              });
            });
          }
        }
      });
    },
    // 按钮文字
    getStatusFunc(item) {
      let btnText = '';
      switch (item.status) {
        case 1:
          btnText = '即将开始';
          break;
        case 2:
          btnText = '已结束';
          break;
        case 3:
          btnText = '已售罄';
          break;
        case 4:
          btnText = '抢购中';
          break;
        default:
          break;
      }
      return btnText;
    },
    // 进度条
    initProgressFunc(v) {
      let num = 0;
      num = v.status === 1 ? 0 : v.status === 2 ? 100 : v.status === 3 ? 100 : v.status === 4 ? v.ratio : 0;
      return isNaN(num) ? 0 : num;
    },
    toDetail(data, list) {
      let timeTem = new Date().getTime();
      let startTimeTem = new Date(list.startTime).getTime();
      let endTimeTem = new Date(list.finishTime).getTime();
      // 距离开始或结束
      if (timeTem < startTimeTem) {
        this.isBefor = true;
      } else if (timeTem > startTimeTem && timeTem < endTimeTem) {
        this.isBefor = false;
      }
      let query = {
        id: data.productInfoId,
        from: 1,
        status: data.status,
        startTime: list.startTime.replaceAll('-', '/'),
        endTime: list.finishTime.replaceAll('-', '/'),
        activityType: list.activityType,
        marketingActivityId: list.marketingActivityId,
        buyLimit: data.buyLimit,
        isBefor: this.isBefor,
      };
      // 支持的支付方式
      window.localStorage.setItem('supportPayType', JSON.stringify(data.supportPayType));
      this.$router.push({
        name: 'serviceDetail',
        query,
      });
    },
    buyNow() {
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
        productAmount: 1, // 数量
      };
      localStorage.setItem('buyProductInfo', JSON.stringify(buyProduct));
      localStorage.setItem(this.couponList.marketingActivityId, this.couponList.activityProductList[0].supportPayType);
      window.location.href =
        '/sureOrder?id=' +
        this.couponList.activityProductList[0].productInfoId +
        '&from=buyNow&count=1&type=act&skuId=' +
        this.couponList.activityProductList[0].productInfoSkuId;
    },
  },
  created() {
    this.getActivityFunc(true);
  },
  mounted() {
    this.$store.dispatch('app/closeSidebar');
  },
};
</script>
<style lang="less" scoped>
@import './style.less';
</style>
