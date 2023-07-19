<template>
  <div class="pop">
    <div class="top">
      <div class="av">
        <UserAvatar :avatar="infos.avatar" :width="40" />
      </div>
      <div class="nickname level-bg">
        <div style="display:flex;align-items: center;">
          {{ infos.nickname }}
          <img
            :src="vipInfo.name === '未开通会员' ? require('@/assets/images/user/level-0.png') : vipInfo.detail.icon"
            alt=""
            style="width: 24px;margin-left:6px;"
          />
          {{ vipInfo.name }}
        </div>
        <p>
          {{ infos.userMobile | stringHide }}
        </p>
        <div class="level">
          <span class="info-detail-level" :class="`bg-${infos.vipLevel}`"></span>
          <template v-if="Boolean(infos.integral)"> 可用积分:{{ infos.integral }} </template>
        </div>
        <div class="out" @click="$emit('out')">
          退出
        </div>
      </div>
    </div>
    <div class="down">
      <a-row>
        <a-col :span="8">
          <div class="item" @click="goPage('/orderList')">
            <img src="@/assets/images/common/pop-dd.svg" alt="" />
          </div>
          <span>我的订单</span>
        </a-col>
        <a-col :span="8" v-if="envpla==='ksy'">
          <div class="item" @click="goPage('/varletters')">
            <img src="@/assets/images/common/pop-xj.svg" alt="" />
          </div>
          <span>我的信件</span>
        </a-col>
        <a-col :span="8">
          <div class="item" @click="goPage('/user')">
            <img src="@/assets/images/common/pop-sz.svg" alt="" />
          </div>
          <span>账号设置</span>
        </a-col>
        <a-col :span="8" v-if="envpla==='ksy'">
          <a :href="homePageUrl + '/feedback'" target="_blank">
            <div class="item">
              <img src="@/assets/images/common/pop-fk.svg" alt="" />
            </div>
            <span>反馈建议</span>
          </a>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import UserAvatar from '@/components/Common/UserAvatar';
import { log } from 'mathjs';

export default {
  components: {
    UserAvatar,
  },
  data() {
    return {
      vipInfo: {},
    };
  },
  props: {
    infos: {
      type: Object,
      default: () => {},
    },
  },
  filters: {
    stringHide(str) {
      if (str) {
        return str.replace(str.substring(3, 7), '****');
      } else {
        return '';
      }
    },
  },
  methods: {
    goPage(val) {
      this.$router.push({ path: val });
    },
  },
  mounted() {
    this.vipInfo = {
      detail: JSON.parse(localStorage.getItem('vipInfo')),
      name: localStorage.getItem('vipName'),
    };
  },
};
</script>

<style lang="less" scoped>
.pop {
  width: 310px;
  height: 263px;
  background: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  .top {
    height: 90px;
    background: url('~@/assets/images/common/pop.png') no-repeat;
    padding: 16px;
    position: relative;
    .av {
      float: left;
    }
    .nickname {
      float: left;
      margin-left: 16px;
      height: 22px;
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #303132;
      line-height: 22px;
      p {
        height: 20px;
        font-size: 12px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
        line-height: 20px;
      }
      .level {
        height: 20px;
        font-size: 12px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #919498;
        line-height: 20px;
        margin-top: 2px;
      }
      .info-detail-level {
        width: 48px;
        height: 24px;
        display: block;
        float: left;
        margin-right: 5px;
      }
      .out {
        position: absolute;
        top: 14px;
        right: 27px;
        font-size: 12px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #919498;
        cursor: pointer;
      }
    }
  }
  .down {
    text-align: center;
    margin-top: 3px;

    span {
      font-size: 12px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #606266;
    }
    .item {
      width: 36px;
      height: 36px;
      background: #e8edff;
      box-shadow: 0px 2px 5px 0px rgba(83, 97, 255, 0.05);
      border-radius: 8px 8px 8px 8px;
      margin: 0 auto;
      margin-bottom: 3px;
      margin-top: 13px;
      cursor: pointer;
      img {
        margin-top: 5px;
      }
    }
  }
}

.level-bg(@n, @i: 1) when (@i =< @n) {
  .bg-@{i} {
    background: url('~@/assets/images/user/x-level-@{i}.svg') no-repeat center / 48px 24px;
  }
  .level-bg(@n, (@i + 1));
}
.level-bg(5);
</style>
