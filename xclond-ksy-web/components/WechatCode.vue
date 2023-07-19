<template>
  <div class="wechat" :class="hasBorder?'hasborder':''">
    <div class="text">
      <h2>{{ title }}</h2>
      <p>{{ desc }}</p>
    </div>
    <div class="code">
      <slot name="img">
        <img :src="codeType === 1 ? webInfo.gzhQrCode : webInfo.communityQrCode" alt="公众号" />
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    codeType: {
      type: Number,
      default() {
        return 1
      }
    },
    title: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    hasBorder: {
      type: Boolean,
      default: true,
    },
        webInfo: {
      type: Object,
      default: {
        communityQrCode: "",
        gzhQrCode: "",
      },
    },
  },
};
</script>

<style lang="less" scoped>
.wechat {
  height: 140px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  display: flex;
  padding: 16px 26px;
  .text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 10px;
    line-height: 1.5em;
    h2 {
      font-size: 16px;
      font-weight: bold;
      color: @textColor;
    }
    p {
      font-size: 13px;
      color: @textColor6;
      margin-bottom: 0;
    }
  }
  .code {
    width: 110px;
    img {
      width: 100%;
    }
  }
}
.hasborder {
  border: 1px solid #dcdcdc;
}
</style>
