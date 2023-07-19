<template>
  <div class="collect-item flex tradecards">
    <div class="collect-item-img" :class="item.trademarkLogInfo">{{ item.trademarkName }}</div>
    <div class="collect-item-content">
      <div class="collect-item-content-left">
        <h4 class="ellipsis">{{ item.trademarkName }}</h4>
        <div class="inner-box" style="display: flex;">
          <div class="text-label" style="margin-right: 24px;">
            注册状态：<span>{{ statusMap[item.trademarkRegisterStatus] }}</span>
          </div>
          <div class="text-label">
            取名时间：<span>{{ item.trademarkAiNameTime }}</span>
          </div>
        </div>
        <div class="inner-box text-label">
          注册类目：<span>{{
            Object.values(item.trademarkCategoryInfo).length
              ? viewTrademarkCategoryInfo(item.trademarkCategoryInfo)
              : '--'
          }}</span>
        </div>
        <div class="inner-box text-label ellipsis" v-if="false">
          商标含义：<span>{{ item.description }}</span>
        </div>
      </div>
      <div class="collect-item-content-right">
        <div class="btn" @click="collectRemove">取消收藏</div>
        <div @click="toSearch" class="link">查注册风险</div>
      </div>
    </div>
  </div>
</template>
<script>
import $config from '@/config';
import Cookies from 'js-cookie';
import { mytrademarkCollectRemove } from '@/api/trademarkName';

let homePageUrl = $config.apiUrl.homePageUrl;
export default {
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    index: Number,
  },
  computed: {
    statusMap() {
      return {
        0: '未注册',
        1: '已注册',
      };
    },
  },
  methods: {
    viewTrademarkCategoryInfo(obj) {
      let arr = [];
      for (let k in obj) {
        if (obj[k]) {
          arr.push(`${k} ${obj[k]}`);
        }
      }
      return arr.join('；');
    },
    async collectRemove() {
      const res = await mytrademarkCollectRemove(this.item.trademarkAiNameNo);
      this.$message.success('操作成功');
      this.$emit('update');
    },
    toSearch() {
      // Cookies.set('trade', this.item.trademarkName);
      window.location.href = `${homePageUrl}fastResult/brandLike/?name=${this.item.trademarkName}`;
    },
  },
};
</script>
<style lang="less" scoped>
@import url('./card.less');
.collect {
  &-item {
    justify-content: space-between;
    align-items: flex-start;
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.4);
    min-height: 130px;
    background: #ffffff;
    padding: 16px 0 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 10px;
    &-img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 130px;
      height: 94px;
      overflow: hidden;
      background: #d76b65;
      border-radius: 4px;
      margin-right: 25px;
      font-size: 20px;
      word-break: break-all;
      padding: 0 10px;
      text-align: center;
      border: 1px solid #dcdcdc;
      img {
        display: block;
        width: 100%;
      }
    }
    &-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      width: 0;
      &-left {
        flex: 1;
        width: 0;
        h4 {
          font-size: 24px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.9);
          line-height: 32px;
          margin-bottom: 16px;
        }
        .text-label {
          min-width: 210px;
          span {
            color: rgba(0, 0, 0, 0.6);
          }
        }
        .inner-box {
          margin-bottom: 8px;
        }
      }
      &-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 32px;
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 88px;
          height: 32px;
          background: #ffffff;
          border-radius: 2px;
          border: 1px solid #d9d9d9;
          font-size: 14px;
          color: #919498;
          margin-bottom: 13px;
          cursor: pointer;
          &:hover {
            color: #3370ff;
            border-color: #3370ff;
          }
        }
        .link {
          cursor: pointer;
          font-size: 14px;
          color: #3a7fff;
          line-height: 22px;
          &:hover {
            color: #6694ff;
          }
        }
      }
    }
  }
}
</style>
