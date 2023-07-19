<template>
  <div
    class="goods-type-content"
    :class="{ 'goods-type-content-kby': NODE_PLA === 'kby' || NODE_PLA === 'kqy', 'goods-type-content-wg': NODE_PLA === 'wg' }"
    v-if="list.length"
  >
    <div class="goods-type-content-item" v-for="(item, index) in list" :key="index">
      <div class="goods-type-content-item-top">
        <div class="title">
          <a
            class="h4 ellipsis"
            :style="{ 'max-width': item.productInfoClientVo.tag ? '186px' : 'initial' }"
            :href="`${$store.state.host.detail_url}?id=${item.productId}&pagefrom=pro`"
            target="_blank"
            ><img
              style="width: 42px; margin-right: 6px"
              v-if="item.country && NODE_PLA === 'kby'"
              :src="require(`@/assets/images/countryFlag/${getImgByCountryCode(item.country)}.svg`)"
              alt="" />
            <img
              style="width: 42px; margin-right: 6px"
              v-if="item.country && NODE_PLA === 'wg'"
              :src="require(`@/assets/images/countryFlag/${getImgByCountryCode(item.country)}.svg`)"
              alt="" />
              <img
              style="width: 42px; margin-right: 6px"
              v-if="item.country && NODE_PLA === 'kqy'"
              :src="require(`@/assets/images/countryFlag/${getImgByCountryCode(item.country)}.svg`)"
              alt="" />
            <template v-if="item.tag">
              {{ item.productInfoClientVo.productName | stringSlice(5) }}
            </template>
            <template v-else>
              {{ item.productInfoClientVo.productName }}
            </template>
            <TipsTag
              v-if="item.tag"
              :tipsStyle="{ background: '#E94E49' }"
              :msg="item.tag"
          /></a>
        </div>
        <div class="content">
          <p class="ellipsis">{{ item.productInfoClientVo.serviceContext || "暂无介绍" }}</p>
          <!-- <p class="ellipsis">服务时效：{{ item.productInfoClientVo.serviceTimeliness || "暂无" }}</p> -->
        </div>
      </div>
      <div class="goods-type-content-item-center">
        <TwoPriceShow
          :price="basePriceHanle(item.productInfoClientVo, 'servicePrice')"
          :old-price="basePriceHanle(item.productInfoClientVo, 'originalPrice')"
          :currency="item.productInfoClientVo.currency"
        />
      </div>
      <a-button type="primary" class="goods-type-content-item-hide" @click="$emit('handleServiceBuy', item)"
        >立即购买</a-button
      >
    </div>
  </div>
</template>
<script>
import { getImgByCountryCode } from "@/utils/index";
import computedMixin from "@/mixins/computedMixin";
import { cloneDeep, sortBy } from "lodash";
export default {
  name: "ProductServiceTemplate",
  mixins: [computedMixin],
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      getImgByCountryCode,
    };
  },
  filters: {
    stringSlice(value, length) {
      value === undefined || value === null ? (value = "") : "";
      value.length > length ? (value = value.slice(0, length) + "...") : value;
      return value;
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
              servicePrice: [],
              originalPrice: [],
            });
          }
        } else {
          specsGroup.push({
            productCode: item.productCategoryId,
            productSpecsDTOList: goods.productSpecsDTOList.filter(
              (specs) => specs.productCategoryId == item.productCategoryId
            ),
            servicePrice: [],
            originalPrice: [],
          });
        }
      });
      specsGroup.forEach((attr) => {
        //如果没有必选默认选中第一个规格(价格最低)
        let specsSelectedLen = attr.productSpecsDTOList.filter((item) => item.isRequired == "IS_REQUIRED").length;
        if (!specsSelectedLen) {
          attr.productSpecsDTOList = sortBy(attr.productSpecsDTOList, "servicePrice");
          attr.servicePrice = [attr.productSpecsDTOList[0].servicePrice];
          attr.originalPrice = [attr.productSpecsDTOList[0].originalPrice];
        } else {
          attr.productSpecsDTOList.forEach((spec) => {
            if (spec.isRequired == "IS_REQUIRED") {
              attr.servicePrice.push(spec.servicePrice);
              attr.originalPrice.push(spec.originalPrice);
            }
          });
        }
      });
      goods.specsGroup = specsGroup;
      return goods;
    },
    basePriceHanle(data, type) {
      if (data.id) {
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
      }
    },
  },
  computed: {
    unitMap() {
      return {
        1: "年",
        2: "个",
        3: "次",
      };
    },
  },
};
</script>
<style lang="less" scoped>
.goods-type-content-wg {
  grid-template-columns: repeat(3, 311px) !important;
}
.goods-type {
  &-content {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(3, 334px);
    .h4 {
      margin-bottom: 0;
      color: @textColor;
    }
    &-item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 220px;
      background: #fff;
      color: rgba(@textColor, 0.6);
      font-size: 14px;
      line-height: 22px;
      border: 1px solid #e7e7e7;
      margin-top: -1px;
      margin-left: -1px;
      &:hover {
        box-shadow: 0 3px 16px -2px rgba(16, 68, 166, 0.12), 0px 6px 12px 1px rgba(0, 0, 0, 0.05),
          0 4px 6px -3px rgba(0, 0, 0, 0.02);
        .goods-type-content-item-center {
          margin-bottom: 0;
        }
        .goods-type-content-item-hide {
          display: block;
        }
      }
      &-top {
        margin: 32px 32px 0 32px;
        .title {
          display: flex;
          align-items: center;
          color: rgba(@textColor, 0.9);
          font-size: 20px;
          line-height: 28px;
          margin-bottom: 8px;
        }
        .content {
          p {
            margin-bottom: 4px;
          }
        }
      }
      &-center {
        margin-left: 32px;
        margin-bottom: 24px;
      }
      &-hide {
        display: none;
        height: 46px;
        overflow: hidden;
        border-radius: 0;
        border: 0;
        // margin-top: 12px;
        background: linear-gradient(313deg, #3a7fff 0%, #65b1ff 100%);
      }
    }
    &-kby {
      grid-template-columns: repeat(3, 310px);
    }
  }
}
</style>
