<template>
  <div>
    <a-modal
      width="60%"
      :mask-closable="false"
      :keyboard="false"
      :z-index="9999999"
      :visible="visible"
      @cancel="visible = false"
    >
      <template #title>
        <p class="title">
          【 <span v-show="data.noticeType === 1">更新通知</span>
          <span v-show="data.noticeType === 2">活动通知</span>
          <span v-show="data.noticeType === 3">其他通知</span>】{{ data.noticeTitle || '-' }}
        </p>
        <p class="date">{{ data.updateTime || '-' }}</p>
      </template>

      <div
        class="content"
        v-html="data.noticeContent"
      />

      <template #footer>
        <a-button
          type="primary"
          @click="visible=false"
        >
          关闭
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
        visible: false
    }
  },
  watch: {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.title {
  line-height: 30px;
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #262424;
}
.date {
  line-height: 20px;
  color: #919191;
}
.content {
  max-height: 50vh;
  overflow: auto;
  padding-bottom: 30px;
  p {
    text-indent: 32px;
  }
}
</style>
