<template>
  <div class="reason-wrapper">
    <div class="reason-block" v-if="rejectDTO.reject">
      <div class="reason-title">驳回原因：</div>
      <div class="reason-content-wrapper">
        <div class="reason-content" v-for="(reason, index) in rejectList" :key="index">
          {{ index + 1 }}、{{ reason }}
        </div>
      </div>
    </div>
    <div class="reason-block" v-if="rejectDTO.annexList && rejectDTO.annexList.length">
      <div class="reason-title">截图说明：</div>
      <div>
        <viewer class="reason-img-viewer" :images="rejectDTO.annexList">
          <img class="reason-img" v-for="(src, index) in rejectDTO.annexList" :key="index" :src="src" />
        </viewer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rejectDTO: Object,
  },
  computed: {
    rejectList() {
      return this.rejectDTO.reject.split('\n');
    },
  },
};
</script>

<style lang="less" scoped>
.reason-wrapper {
  display: flex;
  font-size: 12px;
  padding: 11px 13px;
  background-color: #fff4f3;
  line-height: 20px;
  margin-top: 13px;
  max-width: 798px;
  margin-bottom: 16px;
  .reason-block {
    display: flex;
    color: rgba(0, 0, 0, 0.9);
    &:not(:first-child) {
      margin-left: 30px;
    }
    .reason-title {
      color: #e81e19;
      white-space: nowrap;
    }
    .reason-content-wrapper {
      display: flex;
      flex-direction: column;
    }
    .reason-img-viewer {
      display: flex;
      width: 140px;
      flex-wrap: wrap;
      .reason-img {
        width: 60px;
        height: 60px;
        margin-bottom: 8px;
        &:not(:last-child) {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
