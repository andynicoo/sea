<template>
  <div class="qwrz" :class="{'kqybox': NODE_PLA='kqy'}">
    <h2 v-if="NODE_PLA === 'wg'">外观专利案例展示</h2>
    <h2 v-if="NODE_PLA === 'kqy'">欧洲自营资质</h2>
    <div class="content ksy-w1320" v-if="NODE_PLA === 'wg'">
      <a-row :gutter="[100, 40]">
        <a-col class="gutter-row" :span="6">
          <div class="item">
            <img src="~/assets/images/wg/wgzl1.png" alt="外观专利案例展示" />
          </div>
        </a-col>
        <a-col class="gutter-row" :span="6">
          <div class="item">
            <img src="~/assets/images/wg/wgzl2.png" alt="外观专利案例展示" />
          </div>
        </a-col>
        <a-col class="gutter-row" :span="6">
          <div class="item">
            <img src="~/assets/images/wg/wgzl3.png" alt="外观专利案例展示" />
          </div>
        </a-col>
        <a-col class="gutter-row" :span="6">
          <div class="item">
            <img src="~/assets/images/wg/wgzl4.png" alt="外观专利案例展示" />
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="content ksy-w1320" v-if="NODE_PLA === 'kqy'">
      <a-row :gutter="[100, 40]">
        <a-col class="gutter-row" :span="6">
          <div class="item">
            <img src="~/assets/images/kqy/wgzl1.png" alt="欧洲自营资质" />
          </div>
        </a-col>
        <a-col class="gutter-row" :span="6">
          <div class="item">
            <img src="~/assets/images/kqy/wgzl2.png" alt="欧洲自营资质" />
          </div>
        </a-col>
        <a-col class="gutter-row" :span="6">
          <div class="item">
            <img src="~/assets/images/kqy/wgzl3.png" alt="欧洲自营资质" />
          </div>
        </a-col>
        <a-col class="gutter-row" :span="6">
          <div class="item">
            <img src="~/assets/images/kqy/wgzl4.png" alt="欧洲自营资质" />
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
    };
  },
};
</script>

<style lang="less" scoped>
.qwrz {
  // max-width: 1920px;
  height: 570px;
  background: #ffffff;
  padding: 80px 0px;
  margin: 0 auto;
  h2 {
    color: @textColor;
    text-align: center;
    margin: 0 !important;
    font-size: 28px;
  }
  .content {
    margin: 0 auto;
    margin-top: 40px;
    .item {
      height: 217px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 0px rgba(16, 68, 166, 0.07);
      opacity: 1;
      text-align: center;
      img {
        width: 260px;
        height: 338px;
        border: 1px dashed #dcdcdc;
        padding: 2px;
      }
      h2 {
        font-size: 16px;
        color: @textColor;
      }
    }
  }
}
.kqybox{
  padding-top: 20px !important;
}
</style>
