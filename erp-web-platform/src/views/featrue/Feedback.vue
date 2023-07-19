<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" title="意见反馈"> </a-page-header>
    <div class="feedback-page">
      <div class="feed-content">
        <div class="item">
          <div class="text">{{ $t('overView.title') }}:</div>
          <div class="input-box">
            <a-input v-model="title" />
          </div>
        </div>
        <div class="item">
          <div class="text">{{ $t('overView.content') }}:</div>
          <!-- 富文本容器 -->
          <div id="editor" style="width:100%"></div>
        </div>

        <p class="me-mt-2 me-mb-2">
          {{ $t('overView.feedbackStr') }}
        </p>
        <div class="btn-content me-mt-2">
          <a-button type="primary" @click="handleSubmitFeedback()">
            {{ $t('common.submit') }}
          </a-button>
          <a-button class="me-ml-2" @click="resetForm()">{{
            $t('common.reset')
          }}</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Member from '@/api/member'
import { isEmpty } from '@/util'
import E from 'wangeditor'
export default {
  data() {
    return {
      title: '',
      content: ''
    }
  },
  mounted() {
    this.initE()
  },

  methods: {
    initE() {
      this.content = new E('#editor')
      this.content.create()
    },

    resetForm() {
      this.title = ''
      this.content = ''
    },

    handleSubmitFeedback() {
      let html = document.querySelector('#editor').children[0].innerHTML
      let text = html.replace(/<\/?((?!img).)*?\/?>/g, '')

      if (isEmpty(this.title)) {
        this.errorAlert(this.$t('overView.titleAlert'))
        return
      }
      if (isEmpty(text)) {
        this.errorAlert(this.$t('overView.contentAlert'))
        return
      }
      let params = {
        content: html,
        title: this.title
      }
      Member.feedback(params).then((res) => {
        if (res.code == 0) {
          this.successAlert(this.$t('overView.submitSuccess'))
          this.resetForm()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.feedback-page {
  height: calc(100vh - 70px);
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  .feed-content {
    .item > .text {
      line-height: 40px;
      &::before {
        content: '*';
        color: red;
      }
    }
  }
}
</style>
