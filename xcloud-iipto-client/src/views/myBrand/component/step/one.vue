<template>
  <!-- 审查意见内容 -->
  <div>
    <div class="answer-box-panel">
      <div class="answer-box-h3">审查意见内容</div>
      <div class="box-1">
        <div class="box-1-1">
          <h3>官方翻译</h3>
          <p>{{ oaDetailInfo.interpretFileContent }}</p>
        </div>
        <div class="box-1-2 box-flex" v-if="oaDetailInfo.hlepDocument">
          审查意见详情：
          <a
            v-for="(link, index) in JSON.parse(oaDetailInfo.hlepDocument)"
            :key="index"
            :href="link.fileUrl"
            target="_blank"
            >{{ `${index + 1}、${link.oldFileName} （点击查看）` }}</a
          >
        </div>
      </div>
    </div>
    <!-- 驳回原因 -->
    <div class="answer-box-panel" v-if="oaDetailInfo.rejectReason">
      <div class="answer-box-h3">驳回原因</div>
      <div class="box-1">
        <div class="box-1-1">
          <p>{{ oaDetailInfo.rejectReason }}</p>
        </div>
        <div class="box-1-2" v-if="oaDetailInfo.rejectFile">
          驳回原因附件：<a :href="oaDetailInfo.rejectFile" target="_blank">审查意见内容.pdf</a>
        </div>
      </div>
    </div>
    <div class="tips-text-yellow">备注：请仔细阅读以上审查意见内容，再进行下一步</div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      oaDetailInfo: (state) => state.newOa.oaDetailInfo,
    }),
  },
};
</script>
<style lang="less" scoped>
.answer-box {
  font-size: 12px;
  color: #666666;
  line-height: 20px;
  &-tips {
    &-yellow {
      height: 38px;
      display: flex;
      align-items: center;
      background: #fffbe6;
      border-radius: 2px;
      border: 1px solid #ffe58f;
      font-size: 14px;
      color: #333333;
      padding: 0 14px;
      margin-bottom: 32px;
      span {
        color: #00a3ff;
      }
      img {
        width: 16px;
        margin-right: 6px;
      }
    }
  }
  &-panel {
    &:not(:last-child) {
      margin-bottom: 32px;
    }
  }
  &-h3 {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 16px;
    margin-bottom: 16px;
  }
  .box-1 {
    &-1 {
      background: #eff9ff;
      padding: 8px 16px;
      font-size: 12px;
      color: #666666;
      line-height: 20px;
      h3 {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        margin-bottom: 4px;
        line-height: 22px;
      }
    }
    &-2 {
      font-size: 14px;
      color: #666666;
      line-height: 22px;
      margin-top: 12px;
      a,
      span {
        color: #00a3ff;
      }
    }
  }
  .tips-text-yellow {
    font-size: 14px;
    color: #faad14;
    line-height: 22px;
  }
}
.box-flex {
  display: flex;
  justify-content: space-between;
  > a {
    flex: 1;
    width: 0;
  }
}
</style>
