<template>
  <div class="comp-info">
    <div class="comp-info-wrap">
      <div class="comp-info-left">
        <div class="info-img">
          <img src="@/assets/images/user/head.png" alt />
        </div>
        <div class="info-detail">
          <div class="info-detail-top">
            <h4>{{ info.userMobile | stringHide }}</h4>
            <div v-if="Boolean(info.vipLevel)" class="info-detail-level" :class="`bg-${info.vipLevel}`"></div>
          </div>
          <div class="info-detail-bottom">
            <span>总可用积分：</span>
            <template v-if="Boolean(info.integral)">
              <span>{{ info.integral }}</span>
              <i></i>
            </template>
          </div>
        </div>
      </div>
      <div class="comp-info-right" @click="$emit('out')">退出</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CompInfo',
  data() {
    return {}
  },
  props: {
    info: {
      type: Object,
      default: ()=> {}
    }
  },
  filters: {
    stringHide(str) {
      if(str) {
        return str.replace(str.substring(3,7), "****")
      }else {
        return ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.level-bg(@n, @i: 1) when (@i =< @n) {
  .bg-@{i} {
    background: url("~@/assets/images/user/x-level-@{i}.svg") no-repeat center / 48px 24px;
  }
  .level-bg(@n, (@i + 1));
}
.comp-info {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0,0,0,0.4);
  line-height: 22px;
  box-shadow: 0px 3px 16px -2px rgba(16,68,166,0.12), 0px 6px 12px 0px rgba(0,0,0,0.05), 0px 4px 6px -3px rgba(0,0,0,0.02);
  position: relative;
  cursor: initial;
  &:before {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    background: #fff;
    top: 0;
    right: 50px;
    transform: rotate(45deg) translate(0, -50%);
  }
  &-wrap {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
  }
  &-left {
    display: flex;
    justify-content: space-between;
    .info-img {
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 50%;
      margin-right: 10px;
      img {
        display: block;
        width: 100%;
        margin: 0 auto;
      }
    }
    .info-detail {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &-top {
        display: flex;
        align-items: center;
        h4 {
          font-size: 20px;
          font-weight: 500;
          color: rgba(0,0,0,0.6);
          line-height: 28px;
          margin-right: 4px;
        }
      }
      &-bottom {
        display: flex;
        align-items: center;
        i {
          display: block;
          width: 12px;
          height: 12px;
          margin-left: 4px;
          background: url("~@/assets/images/user/star.png") no-repeat center/cover;
        }
      }
      &-level {
        width: 48px;
        height: 24px;
      }
    }
  }
  &-right {
    cursor: pointer;
    margin-top: 4px;
  }
}
.level-bg(5);
</style>
