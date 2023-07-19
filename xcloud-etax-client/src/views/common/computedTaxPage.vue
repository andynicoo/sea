<template>
  <div class="layout ">
    <div class="container">
      <div class="bgContent">
        <div class="word">
          <p class="top">
            一键算税
            <p />
            <p class="bottom">
              One-click tax calculation
            </p>
        </div>

        <!-- <img src="../../assets/images/common/computedTaxBg.png" alt=""> -->
      </div>
      <div class="title">
        <div class="content">
          <a href="./">首页</a>
          <a href="">一键算税</a>
        </div>
      </div>
      <div>
        <ComputedPage></ComputedPage>
      </div>
      <footer class="flex-center footer">
        《跨税云用户隐私权政策》 ICP证:粤ICP备20016192号 Copyright Copyright @ 2022 跨税云
      </footer>
    </div>
  </div>
</template>

<script>
import ComputedPage from '@/views/home/computeTax/index.vue'
export default {
  components: {
    ComputedPage
  },
}
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  top: 60px;
  left: 0px;
  width: 100%;
  .bgContent {
    height: 350px;
    width: 100%;
    background: url(../../assets/images/common/computedTaxBg.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
    .word {
      height: 350px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p {
        color: #ffffff;
      }
      .top {
        font-size: 53px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        margin-bottom: 5px;
      }
      .bottom {
        font-size: 20px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
    }
    img {
      width: 100%;
      height: 350px;
    }
  }
  .title {
    background: #f6f8fb;
    .content {
      max-width: 1200px;
      margin: auto;
      height: 40px;
      line-height: 40px;
      a {
        color: #666666;
        margin: 0px 10px;
        &:hover {
          color: #019dfa;
        }
      }
    }
  }
  .footer {
    height: 54px;
    background: #010e1d;
    color: #cccccc;
  }
}
</style>
