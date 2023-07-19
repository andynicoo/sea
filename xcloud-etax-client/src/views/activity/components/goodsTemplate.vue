<template>
  <div class="goods-template" :class="{ 'goods-template-row': isRow }">
    <div class="goods-item" v-for="(v, index) in list" :key="index">
      <div class="goods-banner">
        <img class="main-img" :src="v.activityProductImgUrl" alt="" />
      </div>
      <div class="goods-main">
        <div class="goods-title line-clamp">{{ v.productName }}</div>
        <div class="goods-desc ellipsis" v-if="false">
          商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称
        </div>
        <div class="goods-detail">
          <div class="goods-detail-top">
            <div class="goods-price">
              ￥<b>{{ basePriceHanle(v, 'flashPrice') }}</b>
            </div>
            <button :class="{ noBuy: v.status !== 4 }" @click="toDetail(v)">{{ getStatusFunc(v) }}</button>
          </div>
          <div class="goods-detail-bottom">
            <div class="goods-price-old">￥{{ basePriceHanle(v, 'servicePrice') }}</div>
            <div class="goods-detail-progress" v-if="showProgress === 'IS_SHOW'">
              已售{{ v.ratio }}%<Progress :percent="v.ratio" hide-info stroke-color="#FF2D3D" :stroke-width="10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import componentsMixin from './../../../../xcloud-client-components-web/mixin/componentsMixin';
import { cloneDeep, sortBy } from 'lodash';
export default {
  mixins: [componentsMixin],
  name: 'goodsTemplate',
  data() {
    return {};
  },
  props: {
    isRow: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
    showProgress: {
      type: String,
      default: '',
    },
  },
  methods: {
    //最低价处理
    handleProductSpecs(goods) {
      let specsGroup = [];
      goods.productSpecsDTOList.forEach((item) => {
        if (specsGroup.length) {
          let isAdd = true;
          specsGroup.forEach((attr) => {
            if (attr.productCode == item.productCategoryId) {
              isAdd = false;
            }
          });
          if (isAdd) {
            specsGroup.push({
              productCode: item.productCategoryId,
              productSpecsDTOList: goods.productSpecsDTOList.filter(
                (specs) => specs.productCategoryId == item.productCategoryId
              ),
              flashPrice: [],
              servicePrice: [],
            });
          }
        } else {
          specsGroup.push({
            productCode: item.productCategoryId,
            productSpecsDTOList: goods.productSpecsDTOList.filter(
              (specs) => specs.productCategoryId == item.productCategoryId
            ),
            flashPrice: [],
            servicePrice: [],
          });
        }
      });
      specsGroup.forEach((attr) => {
        //如果没有必选默认选中第一个规格(价格最低)
        let specsSelectedLen = attr.productSpecsDTOList.filter((item) => item.isRequired == 'IS_REQUIRED').length;
        if (!specsSelectedLen) {
          attr.productSpecsDTOList = sortBy(attr.productSpecsDTOList, 'flashPrice');
          attr.flashPrice = [attr.productSpecsDTOList[0].flashPrice];
          attr.servicePrice = [attr.productSpecsDTOList[0].servicePrice];
        } else {
          attr.productSpecsDTOList.forEach((spec) => {
            if (spec.isRequired == 'IS_REQUIRED') {
              attr.flashPrice.push(spec.flashPrice);
              attr.servicePrice.push(spec.servicePrice);
            }
          });
        }
      });
      goods.specsGroup = specsGroup;
      return goods;
    },
    basePriceHanle(data, type) {
      let productInfo = cloneDeep(data);
      if (productInfo.productInfoDTOList.length) {
        let priceAll = [];
        productInfo.productInfoDTOList.forEach((goods) => {
          let specsGroup = this.handleProductSpecs(goods).specsGroup;
          specsGroup.forEach((item) => {
            priceAll.push(...item[type]);
          });
        });
        return this.countSum(priceAll);
      } else {
        let specsGroup = this.handleProductSpecs(productInfo).specsGroup;
        let priceAll = [];
        specsGroup.forEach((item) => {
          priceAll.push(...item[type]);
        });
        return this.countSum(priceAll);
      }
    },
    // 获取头图
    getImgUrl(val) {
      if (val) {
        return JSON.parse(val)[0].imgUrl;
      } else {
        return '';
      }
    },
    // 按钮文字
    getStatusFunc(item) {
      let btnText = '';
      switch (item.status) {
        case 1:
          btnText = '即将开始';
          break;
        case 2:
          btnText = '已结束';
          break;
        case 3:
          btnText = '已售罄';
          break;
        case 4:
          btnText = '抢购中';
          break;
        default:
          break;
      }
      return btnText;
    },
    toDetail(v) {
      this.$emit('toDetail', v);
    },
  },
};
</script>
<style lang="less" scoped>
.goods {
  font-size: 14px;
  color: #a45428;
  line-height: 22px;
  &-template {
    display: grid;
    justify-content: space-between;
    grid-column-gap: 20px;
    grid-row-gap: 20px;
    grid-template-columns: repeat(4, 1fr);
    &-row {
      grid-template-columns: repeat(2, 1fr);
      .goods-item {
        flex-direction: row;
        align-items: center;
        padding: 20px;
        width: 460px;
        height: 190px;
        overflow: hidden;
        .goods-banner {
          width: 150px;
          height: 150px;
          background: #fee7d6;
          border-radius: 10px;
          overflow: hidden;
        }
        .goods-main {
          height: 150px;
          padding: 0;
          margin-left: 20px;
        }
      }
    }
  }
  &-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 2px solid #fec3a1;
    background: #fee7d6;
    border-radius: 10px;
    overflow: hidden;
    width: 220px;
    height: 276px;
  }
  &-banner {
    height: 124px;
    overflow: hidden;
    background: #fee7d6;
    img {
      display: block;
      width: 100%;
      height: auto;
    }
  }
  &-main {
    padding: 10px 15px;
    height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &-title {
    font-size: 18px;
    font-weight: 500;
    color: #8a4621;
    line-height: 32px;
  }
  &-detail {
    &-top,
    &-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &-progress {
      display: flex;
      align-items: center;
      white-space: nowrap;
      font-size: 12px;
      color: #8a4621;
      .ivu-progress {
        width: 80px;
        margin-left: 5px;
      }
      /deep/ .ivu-progress-inner {
        background: #ffc4b6;
      }
    }
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 92px;
      height: 26px;
      background: linear-gradient(180deg, #ff7b5e 0%, #ff0022 100%);
      border-radius: 100px;
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      border: 0;
      outline: none;
      margin: 0;
      &.noBuy {
        opacity: 0.5;
      }
    }
  }
  &-price {
    font-size: 18px;
    color: #ff323a;
    line-height: 26px;
    b {
      font-size: 28px;
      font-weight: 600;
    }
    &-old {
      font-size: 12px;
      color: rgba(164, 84, 40, 0.6);
      line-height: 20px;
      text-decoration: line-through;
    }
  }
}
.new {
  .goods-item {
    height: 326px;
    background: #ffffff;
    border: 7px solid #fff;
    .goods-banner {
      height: 164px;
    }
  }
  .goods-title {
    color: #1c1ab2;
  }
}
</style>
