<template>
  <a-modal
    width="60%"
    :maskClosable="false"
    :keyboard="false"
    :visible="showModal"
    :zIndex="9999999"
    @cancel="setRead()"
  >
    <template #title>
      <!-- {{ showNewsList[curIndex].noticeTitle }}--- -->
      <p class="title">
        【<span
          v-show="
            showNewsList[curIndex] && showNewsList[curIndex].noticeType === 1
          "
          >更新通知</span
        >
        <span
          v-show="
            showNewsList[curIndex] && showNewsList[curIndex].noticeType === 2
          "
          >活动通知</span
        >
        <span
          v-show="
            showNewsList[curIndex] && showNewsList[curIndex].noticeType === 3
          "
          >其他通知</span
        >】{{
          (showNewsList[curIndex] && showNewsList[curIndex].noticeTitle) || '-'
        }}
      </p>
      <p class="date">
        {{ showNewsList[curIndex] && showNewsList[curIndex].publishTime }}
      </p>
    </template>

    <div
      class="content"
      v-html="
        showNewsList[curIndex] ? showNewsList[curIndex].noticeContent : ''
      "
    ></div>

    <template #footer>
      <a-button
        v-show="showNewsList.length > 1 && curIndex !== 0"
        @click="goNext(-1)"
      >
        上一页
      </a-button>
      <a-button
        v-show="showNewsList.length > 1 && curIndex + 1 !== showNewsList.length"
        @click="goNext(1)"
      >
        下一页
      </a-button>
      <a-button @click="setRead()" type="primary">
        {{ $t('common.close') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import Basic from '@/api/basic'
export default {
  props: {
    showNewsList: []
  },
  watch: {
    // showModal(val) {
    //   if (val) {
    //     this.$nextTick(() => {
    //       if (this.records.readed == 0) {
    //       this.setRead()
    //       }
    //     })
    //   }
    // }
  },
  data() {
    return {
      showModal: false,
      curIndex: 0
    }
  },
  methods: {
    //设置已读
    setRead() {
      let ids = []
      this.showNewsList.map((ele) => {
        ids.push(ele.id)
      })
      Basic.addMessageRead({
        ids: ids
      }).then(({ data }) => {
        this.$emit('readSubmit')
      })
      this.showModal = false
    },
    goNext(index) {
      const { noticeFrequency, id } = this.showNewsList[this.curIndex]
      // 消息通知类型如果是每次登陆时提示，记录该id,登陆只提示一次；兼容每次登陆弹出调整为每次刷新弹出
      if (noticeFrequency === 3) {
        sessionStorage.removeItem(id)
      }

      if (noticeFrequency === 2) {
        sessionStorage.setItem(id, true)
      }

      Basic.addMessageRead({
        ids: [id]
      })

      if (index === 1) {
        this.$data.curIndex++
      } else {
        this.$data.curIndex--
      }
    }
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
