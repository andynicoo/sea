<template>
  <div class="goods-type-content" v-if="list.length">
    <div class="goods-type-content-item" v-for="(item, index) in list" :key="index">
      <div class="goods-type-content-item-top">
        <div class="title">
          <h4
            class="ellipsis"
            :style="{ 'max-width': item.label ? '186px' : 'initial' }"
            @click="handleLinkDetail(item)"
          >
            <img
              style="width: 42px; margin-right: 6px"
              v-if="item.countryName && NODE_PLA === 'kby'"
              :src="require(`@/assets/images/countryFlag/${getImgByCountryCode(item.countryName)}.svg`)"
              alt=""
            />
            <img
              style="width: 42px; margin-right: 6px"
              v-if="item.countryName && NODE_PLA === 'wg'"
              :src="require(`@/assets/images/countryFlag/${getImgByCountryCode(item.countryName)}.svg`)"
              alt=""
            />
            <a-tooltip>
              <template slot="title">
                {{ item.productName }}
              </template>
              {{ item.productName }}
            </a-tooltip>
          </h4>
          <TipsTag v-if="item.label" :tipsStyle="{ background: '#E94E49' }" :msg="item.label" />
        </div>
        <div class="content">
          <p class="ellipsis">{{ item.productDescribe || "暂无介绍" }}</p>
          <!-- <p class="ellipsis">服务时效：{{ item.serviceTimeliness || "暂无" }}</p> -->
        </div>
      </div>
      <div class="goods-type-content-item-center">
        <TwoPriceShow
          :price="basePriceHanle(item.productInfoDTO, 'servicePrice')"
          :old-price="basePriceHanle(item.productInfoDTO, 'originalPrice')"
          :currency="item.productInfoDTO && item.productInfoDTO.currency"
        />
      </div>
      <a-button type="primary" class="goods-type-content-item-hide" @click="handleServiceBuy(item)">立即购买</a-button>
    </div>
  </div>
</template>
<script>
import { getImgByCountryCode } from "@/utils/index";
import { mapGetters } from "vuex";
import computedMixin from "@/mixins/computedMixin";
import { cloneDeep, sortBy } from "lodash";
export default {
  name: "IndexProductServiceTemplate",
  mixins: [computedMixin],
  data() {
    return {
      NODE_PLA: process.env.NODE_PLA,
      getImgByCountryCode,
    };
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    ...mapGetters(["unitMap"]),
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
      if (data && data.id) {
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
    handleLinkDetail(item) {
      const host = this.$store.state.host.detail_url + "?id=" + item.productId;
      window.open(host);
    },
    handleServiceBuy(item) {
      this.$sensors.track("ClickVATServeNowBuy", {
        module_id: "首页模块-2",
        activity_kind: "",
        activity_label: item.label,
        serve_kind: item.parentInfo.categoryTitle,
        VAT_serve_country: item.countryName,
        VAT_serve_name: item.productName,
        VAT_current_price: item.basePrice,
        page_name: "首页",
      });
      this.handleLinkDetail(item);
    },
  },
};
</script>
<style lang="less" scoped>
.goods-type {
  &-content {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(3, 334px);
    h4 {
      margin-bottom: 0;
      cursor: pointer;
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
          h4 {
            max-width: 150px;
          }
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
        height: 46px;
        display: none;
        overflow: hidden;
        border-radius: 0;
        border: 0;
        // margin-top: 12px;
        background: linear-gradient(313deg, #3a7fff 0%, #65b1ff 100%);
      }
    }
  }
}
</style>
