<template>
  <div class="box flex-center">
    <div class="left">
      <div class="icon flex-center">
        <img :src="propsData.img"
             alt="跨税云-VAT申报价格">
      </div>
    </div>
    <div class="right">
      <div class="title"
           v-if="index==0&&dIndex==0">
        {{$t('VATBox.GBregAndDec')}}
      </div>
      <div class="title"
           v-else-if="index==0&&dIndex==1">
        {{$t('VATBox.GBDec')}}
      </div>
      <div class="title"
           v-else-if="index==1&&dIndex==0">
        {{$t('VATBox.DEregAndDec')}}
      </div>
      <div class="title"
           v-else-if="index==1&&dIndex==1">
        {{$t('VATBox.DEDec')}}
      </div>
      <div class="title"
           v-else-if="index==2&&dIndex==0">
        {{$t('VATBox.ITregAndDec')}}
      </div>
      <div class="title"
           v-else-if="index==2&&dIndex==1">
        {{$t('VATBox.ITDec')}}
      </div>
      <div class="title"
           v-else-if="index==3&&dIndex==0">
        {{$t('VATBox.FRregAndDec')}}
      </div>
      <div class="title"
           v-else-if="index==3&&dIndex==1">
        {{$t('VATBox.FRDec')}}
      </div>
      <div class="title"
           v-else-if="index==4&&dIndex==0">
        {{$t('VATBox.ESregAndDec')}}
      </div>
      <div class="title"
           v-else-if="index==4&&dIndex==1">
        {{$t('VATBox.ESDec')}}
      </div>
      <div class="info">
        {{propsData.des}}
      </div>
      <div class="price">
        <span class="num">
          {{propsData.price}}
        </span>
        /年
      </div>
      <div class="buyButton"
           :class="{'primaryGray' : !propsData.canBuy}">
        立即购买
      </div>
    </div>
  </div>
</template>

<script>
import "@/styles/common.less";
export default {
  name: 'declarecard',
  props: {
    data: Object,
    index: Number,
    dIndex: Number
  },
  data: function () {
    return {
      propsData: this.data
    }
  },
  mounted() {
  }
}
</script>

<style lang="less" scoped>
.box {
  width: 584px;
  height: 297px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(232, 232, 232, 1);
  box-shadow: 0px 0px 27px 2px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  margin: 0px 15px 0px;
  &:nth-child(1) {
    margin-left: 0px;
  }
  .left {
    margin-right: 80px;
    .icon {
      width: 154px;
      height: 154px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 15px 1px rgba(0, 0, 0, 0.07);
      border-radius: 50%;
      img {
        width: 78px;
        height: 78px;
      }
    }
  }
  .right {
    text-align: left;
    max-height: 220px;
    .title {
      font-size: 24px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      margin-bottom: 15px;
    }
    .info {
      color: rgba(153, 153, 153, 1);
      font-size: 14px;
      margin-bottom: 40px;
      max-width: 230px;
    }
    .price {
      margin-bottom: 30px;
      color: #999999;
      .num {
        font-size: 24px;
        color: rgba(255, 120, 0, 1);
        font-weight: bold;
      }
    }
    .buyButton {
      display: none;
      width: 130px;
      height: 36px;
      background: rgba(22, 173, 233, 1);
      border-radius: 18px;
      text-align: center;
      line-height: 36px;
      font-size: 14px;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }
    .primaryGray {
      background: rgba(246, 248, 251, 0);
      border: 1px solid rgba(204, 204, 204, 1);
      color: rgba(204, 204, 204, 1);
    }
  }
}
</style>
