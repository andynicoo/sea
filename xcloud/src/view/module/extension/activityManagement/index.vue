<template>
  <div class="app-container">
    <!-- header -->
    <div class="header">
      <h2>营销玩法</h2>
      <span>吸粉、老客带新客，提高下单转化率</span>
    </div>
    <div class="main">
      <el-card class="box-card" v-for="(item, index) in carList" :key="index">
        <ActivityCar :textList="item.text" @click="(e) => toCreate(e, index)" />
      </el-card>
    </div>
  </div>
</template>
<script>
import ActivityCar from './components/activityCar.js';
export default {
  data() {
    return {
      carList: [
        {
          text: ['优惠券', '向客户发放优惠劵'], //文本数据
        },
        {
          text: ['秒杀活动', '快速抢购引导客户更多消费，提高转化率'], //文本数据
        },
        {
          text: ['积分商城', '让客户用积分兑换商品'], //文本数据
        },
        {
          text: ['幸运抽奖', '常见的转盘式抽奖玩法，趣味互动'], //文本数据
        },
        {
          text: ['拼团活动', '引导客户邀请朋友一起拼团购买，共享优惠'], //文本数据
        },
        {
          text: ['集赞助力', '吸粉，老客户带新客户，提高下单转化率'], //文本数据
        },
        {
          text: ['疯狂猜猜猜', '回答问题，按答题情况给奖励'], //文本数据
        },
        {
          text: ['砍价活动', '邀请好友砍价，裂变快速传播'], //文本数据
        },
        // {
        //   text: ['定金膨胀', '预售定金翻N倍，大促预热利器'], //文本数据
        // },
      ],
    };
  },
  components: {
    ActivityCar,
  },

  methods: {
    toCreate(evt, index) {
      const routerList = [
        {
          name: 'coupon',
          path: '/view/module/extension/activityManagement/coupon/index.vue',
        },
        {
          name: 'secondsKillActivity',
          path: '/extension/activityManagement/secondsKillActivity',
        },
        {
          name: 'integral',
          path: '/view/module/extension/activityManagement/integral/index.vue',
        },
        {
          name: 'draw',
          path: '/view/module/extension/activityManagement/draw/index.vue',
        },
        {
          name: 'together',
          path: '/view/module/extension/activityManagement/together/index.vue',
        },
        {
          name: 'praise',
          path: '/view/module/extension/activityManagement/praise/index.vue',
        },
        {
          name: 'guess',
          path: '/view/module/extension/activityManagement/guess/index.vue',
        },
        {
          name: 'presse',
          path: '/view/module/extension/activityManagement/presse/index.vue',
        },
        // {
        //   name: 'deposit',
        //   path: '/view/module/extension/activityManagement/deposit/index.vue',
        // },
      ];
      this.$router.push(routerList[index]);
    },
  },
};
</script>
<style scoped lang="scss">
.app-container {
  background: #fff;
  height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 20px;
  .header {
    margin-bottom: 20px;
    h2 {
      font-weight: bold;
      font-family: 'PingFangSC-Semibold', 'PingFang SC Semibold', 'PingFang SC';
      font-weight: 650;
      font-style: normal;
      font-size: 16px;
    }
    display: flex;
    align-items: flex-end;
    > span {
      font-size: 13px;
      letter-spacing: normal;
      color: #333333;
      margin-left: 8px;
      font-family: 'PingFangSC-Regular', 'PingFang SC';
      font-weight: 400;
    }
  }
  .main {
    display: flex;
    > div {
      margin-right: 20px;
    }
    .box-card {
      width: 200px;
      height: 200px;
    }
  }
  .card-main {
    text-align: center;
    display: grid;
    grid-template-rows: 50px 21px 45px 40px;
    overflow: hidden;
  }
}

.card-main-p {
  opacity: 0.4;
  font-family: 'PingFangSC-Regular', 'PingFang SC';
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  text-align: center;
}
</style>
