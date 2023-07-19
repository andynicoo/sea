<template>
  <div class="detail">
    <span class="back"
          @click="back">
      <img src="@/assets/images/common/back.png"
           alt="">
      返回列表
    </span>
    <p class="title">
      消息详情
    </p>
    <div class="content">
      <div v-html="content"></div>
      <a v-if="file"
         :href="file"
         target="_blank">点击查看>></a>
    </div>
  </div>
</template>

<script>
import { stationLetterDetail } from '@/api/stationLetter/stationLetter.js'
export default {
  props: ['rowInfo'],
  data() {
    return {
      content: '',
      file: ''
    }
  },
  mounted() {
    this.DetailInfo()
  },
  methods: {
    back() {
      this.$emit('back')
    },
    DetailInfo() {
      stationLetterDetail({
        id: this.rowInfo
      }).then((res) => {
        if (res.code === 0) {
          this.content = decodeURIComponent(res.data.content)
          this.file = res.data.accessory
        }
      }).catch(error => {
        console.log(error)
      })
    },
  }
}
</script>

<style lang="less" scoped>
.detail {
  margin-top: -30px;
  .back {
    margin: 20px 0px;
    display: block;
    cursor: pointer;
    font-size: 14px;
    img {
      float: left;
      margin-top: 4px;
    }
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    height: 40px;
    background: rgba(22, 173, 233, 0.2);
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-left: 20px;
    span {
      font-size: 14px;
      font-weight: 400;
    }
  }
  .content {
    padding: 20px 20px 0px;
  }
}
</style>