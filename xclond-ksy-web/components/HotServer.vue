<template>
  <div class="hotserver" :class="hasBorder ? 'hasborder' : ''">
    <p class="tit">热门服务</p>
    <div class="list" v-if="hotServerList.length">
      <div class="item" v-for="(item, index) in hotServerList" :key="index" @click="handleServiceBuy(item)">
        <img
          v-lazy="require(`@/assets/images/countryFlag/hot/${getImgByCountryCode(item.countryCode, 2)}.png`)"
          :alt="item.productName"
        />
        <div class="text">
          <h3 class="ellipsis">{{ item.productName }}</h3>
          <p>{{item.currency}}{{ basePriceHanle(item, 'servicePrice') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import countryCode from "@/utils/countryCode.json";
import { getImgByCountryCode } from "@/utils/index";
import computedMixin from "@/mixins/computedMixin";
import { cloneDeep, sortBy } from "lodash";
export default {
  mixins: [computedMixin],
  data() {
    return {
      countryCode,
      getImgByCountryCode,
    };
  },
  props: {
    hasBorder: {
      type: Boolean,
      default: true,
    },
    hotServerList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters(["unitMap"]),
    ...mapState(["pageInfo"]),
  },
  mounted() {},
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
        let specsSelectedLen = attr.productSpecsDTOList.filter((item) => item.isRequired == 'IS_REQUIRED').length;
        if (!specsSelectedLen) {
          attr.productSpecsDTOList = sortBy(attr.productSpecsDTOList, 'servicePrice');
          attr.servicePrice = [attr.productSpecsDTOList[0].servicePrice];
          attr.originalPrice = [attr.productSpecsDTOList[0].originalPrice];
        } else {
          attr.productSpecsDTOList.forEach((spec) => {
            if (spec.isRequired == 'IS_REQUIRED') {
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
      if(data.id){
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
    handleServiceBuy(item) {
      this.$sensors.track("ClickVATServeNowBuy", {
        module_id: "",
        activity_kind: "",
        activity_label: "",
        serve_kind: "",
        VAT_serve_country: this.$getCountryNameByCode(item.countryCode, countryCode),
        VAT_serve_name: item.productName,
        VAT_current_price: item.basePrice,
        page_name: this.pageInfo.pageName,
      });
      const host = `${this.$store.state.host.detail_url}?id=${item.id}`;
      window.open(host);
    },
  },
};
</script>

<style lang="less" scoped>
.hotserver {
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  padding: 16px 26px;
  p.tit {
    font-size: 16px;
    font-weight: bold;
    color: @textColor;
    margin-bottom: 0.5em;
  }
  .list {
    border-top: 1px solid #e3e3e3;
    padding-top: 20px;
    .item {
      display: flex;
      margin-bottom: 16px;
      cursor: pointer;
      justify-content: space-between;
      img {
        width: 64px;
        height: 64px;
      }
      .text {
        margin-left: 16px;
        flex: 1;
        width: 0;
        h3 {
          font-size: 16px;
          color: @textColor;
          margin-bottom: 18px;
        }
        h3:hover {
          color: @primaryClick;
        }
        p {
          color: @priceColor;
          margin-bottom: 0;
          font-weight: 500;
        }
      }
    }
  }
}
.hasborder {
  border: 1px solid #dcdcdc;
}
</style>
