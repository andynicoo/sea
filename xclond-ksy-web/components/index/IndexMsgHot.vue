<template>
  <div class="index-msg-hot">
    <div class="ksy-w1320 center">
      <div class="index-msg-hot-head">热点资讯</div>
      <a-row :gutter="35" class="index-msg-hot-content">
        <a-col :span="8" v-for="(item, index) in list" :key="index">
          <nuxt-link tag="div" :to="`/news/${item.id}`" class="index-msg-hot-content-item">
            <div class="bg">
              <img v-lazy="item.mainPicUrl" :alt="item.title">
            </div>
            <div class="content">
              <div class="content-title ellipsis">{{ item.title }}</div>
              <div class="content-text">{{ item.summary }}</div>
              <div class="content-bottom">{{ moment(item.createTime).format('YYYY-MM-DD') }}<span style="margin-left: 24px;">来源：{{ item.author }}</span></div>
            </div>
          </nuxt-link>
        </a-col>
      </a-row>
      <div class="index-msg-hot-link">
        <nuxt-link to="/news"> 更多热点资讯 ></nuxt-link>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: 'IndexMsgHot',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    moment() {
      return moment();
    }
  }
}
</script>
<style lang="less" scoped>
.index-msg-hot {
  background: #fff;
  padding: 90px 0 0;
  font-size: 14px;
  color: #999999;
  line-height: 16px;
  margin-bottom: 40px;
  &-head {
    font-size: 28px;
    font-weight: 600;
    color: @textColor;
    line-height: 40px;
    margin-bottom: 40px;
    text-align: center;
  }
  &-content {
    &-item {
      top: 0;
      height: 420px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      .transition(0.4s);
      box-shadow: 0px 4px 14px 1px rgba(0,0,0,0.0500);
      &:hover {
        box-shadow: 0px 4px 14px 10px rgba(0,0,0,0.0500);
        top: -10px;
      }
      .bg {
        height: 234px;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
          height: 243px;
        }
      }
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 32px 32px 24px;
        &-title {
          font-size: 18px;
          font-weight: 500;
          color: @textColor;
          line-height: 26px;
        }
        &-text {
          .line-clamp(2);
          color: #666666;
          line-height: 22px;
        }
        &-bottom {
          color: #999;
        }
      }
    }
  }
  &-link {
    text-align: center;
    margin-top: 40px;
    a {
      color: @textColor;
    }
  }
}
</style>
