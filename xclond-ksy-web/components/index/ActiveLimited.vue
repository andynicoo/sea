<template>
  <a-row :gutter="NODE_PLA === 'kby' ? 32 : 40" class="index-tabs-list" v-if="activeList.length">
    <a-col :span="6" v-for="(item, idx) in activeList" :key="`sub_${idx}`">
      <div
        class="index-tabs-list-item shadow-default shadow-hover"
        :class="{ 'index-tabs-list-item-kby': NODE_PLA === 'kby' }"
      >
        <a @click="handleButtonClick(item)" class="index-tabs-list-item-head">
          <img :src="require(`@/assets/images/countryFlag/${getImgByCountryCode(item.countryCode)}.svg`)" alt="" />
          <h4 class="ellipsis">{{ item.productName }}</h4>
        </a>
        <div class="index-tabs-list-item-content">
          <!-- 价格展示start -->
          <TwoPriceShow
            :unit="unitMap[item.unit]"
            :price="basePriceHanle(item, 'flashPrice')"
            :old-price="basePriceHanle(item, 'servicePrice')"
          />
          <!-- 价格展示end -->
          <!-- 进度条start -->
          <div class="progress-wrap" v-if="showProgress === 'IS_SHOW'">
            <span>已售{{ item.ratio }}%</span>
            <a-progress strokeColor="#E94E49" :showInfo="false" :percent="item.ratio" />
          </div>

          <!-- 进度条end -->
          <!-- 库存start -->
          <div class="inventory" v-if="item.initStock">库存剩余：{{ item.initStock }}</div>
          <!-- 库存end -->
          <!-- 活动倒计时start -->
          <TimeCount
            :startTime="item.productStartTime || item.parentInfo.startTime"
            :endTime="item.productFinishTime || item.parentInfo.finishTime"
          />
          <!-- 活动倒计时end -->
        </div>
        <a-button
          @click="handleButtonClick(item)"
          type="primary"
          class="index-tabs-list-item-button"
          :class="{ canHover: [4, 5].includes(item.status) }"
          :disabled="![4, 5].includes(item.status)"
          v-sensorsDire="{
            type: 'ClickVATServeNowBuy',
            event: 'click',
            getParams: () => ({
              module_id: '首页模块-1',
              // activity_kind: item.parentInfo.activityType,
              activity_kind: '限时秒杀',
              // activity_label: item.parentInfo.activityLable,
              activity_label: '',
              // serve_kind: item.categoryName,
              serve_kind: '',
              VAT_serve_country: $getCountryNameByCode(item.countryCode, countryCode),
              VAT_serve_name: item.productName,
              VAT_current_price: item.standardPrice,
              page_name: '首页',
            }),
          }"
        >
          {{ item.buttonText }}
        </a-button>
      </div>
    </a-col>
  </a-row>
</template>
<script>
import moment from "moment";
import { mapGetters } from "vuex";
import countryCode from "@/utils/countryCode.json";
import { getImgByCountryCode } from "@/utils/index";
import computedMixin from "@/mixins/computedMixin";
import { cloneDeep, sortBy } from "lodash";
const that = this;
export default {
  name: "ActiveLimited",
  mixins: [computedMixin],
  data() {
    return {
      countryCode,
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
    showProgress: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["unitMap"]),
    buttonTextMap() {
      return {
        1: "未开始",
        2: "已结束",
        3: "已售罄",
        4: "立即购买",
        5: "新用户专享",
      };
    },
    activeList() {
      let { list } = this;
      if (list?.length) {
        list.map((v) => {
          v.buttonText = this.buttonTextMap[v.status];
          return v;
        });
      }
      return list;
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
        let specsSelectedLen = attr.productSpecsDTOList.filter((item) => item.isRequired == "IS_REQUIRED").length;
        if (!specsSelectedLen) {
          attr.productSpecsDTOList = sortBy(attr.productSpecsDTOList, "flashPrice");
          attr.flashPrice = [attr.productSpecsDTOList[0].flashPrice];
          attr.servicePrice = [attr.productSpecsDTOList[0].servicePrice];
        } else {
          attr.productSpecsDTOList.forEach((spec) => {
            if (spec.isRequired == "IS_REQUIRED") {
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
    handleButtonClick(item) {
      console.log(item);
      const start = item.productStartTime || item.parentInfo.startTime;
      const end = item.productFinishTime || item.parentInfo.finishTime;
      let isBefor = null;
      let timeTem = new Date().getTime();
      let startTimeTem = new Date(start).getTime();
      let endTimeTem = new Date(end).getTime();
      if (timeTem < startTimeTem) {
        isBefor = true;
      } else if (timeTem > startTimeTem && timeTem < endTimeTem) {
        isBefor = false;
      }
      const queryKsy = {
        id: item.productInfoId,
        from: 1,
        status: item.status,
        startTime: moment(item.productStartTime || item.parentInfo.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(item.productFinishTime || item.parentInfo.finishTime).format("YYYY-MM-DD HH:mm:ss"),
        activityType: item.parentInfo.activityType,
        marketingActivityId: item.parentInfo.marketingActivityId,
        isBefor,
        buyLimit: item.parentInfo.buyLimit,
      };
      const queryKby = {
        id: item.productInfoId,
        status: item.status,
        startTime: moment(item.productStartTime || item.parentInfo.startTime).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(item.productFinishTime || item.parentInfo.finishTime).format("YYYY-MM-DD HH:mm:ss"),
        activityType: item.parentInfo.activityType,
        marketingActivityId: item.parentInfo.marketingActivityId,
        buyLimit: item.parentInfo.buyLimit,
      };
      const query = this.NODE_PLA === "kby" ? queryKby : queryKsy;
      const host = `${this.$store.state.host.detail_url}?${this.queryChuans(query)}`;
      window.open(host);
    },

    getButtonText(startTime, surplusStock) {
      if (new Date(startTime).getTime() - Date.now() > 0) {
        return "未开始";
      } else if (+surplusStock === 0) {
        return "已售罄";
      } else {
        return "立即购买";
      }
    },
    queryChuans(query) {
      let arr = Object.keys(query);
      let urlParams = "";
      arr.forEach((key, index) => {
        urlParams += `${key}=${query[key]}${index === arr.length - 1 ? "" : "&"}`;
      });
      return urlParams;
    },
  },
};
</script>
<style lang="less" scoped>
.index-tabs {
  &-list {
    &-item {
      max-height: 358px;
      min-height: 286px;
      border-radius: 4px 4px 4px 4px;
      background: #fff;
      top: 0;
      position: relative;
      .transition();
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &:hover {
        top: -10px;
        .canHover {
          background: linear-gradient(313deg, #3a7fff 0%, #65b1ff 100%);
          color: #fff;
        }
        .index-tabs-list-item-head {
          background: url("@/assets/images/index/tab-bg-active.svg") no-repeat 0 0 / cover;
        }
      }
      &-head {
        height: 120px;
        padding: 24px 0 0 24px;
        color: @textColor;
        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
        background: url("@/assets/images/index/tab-bg-default.svg") no-repeat 0 0 / cover;
        img {
          display: block;
          width: 64px;
          margin-bottom: 12px;
        }
      }
      /deep/ .ant-progress-inner {
        background: rgba(#e94e49, 0.2);
      }
      /deep/ .ant-progress-bg {
        background: #e94e49 !important;
      }
      &-content {
        padding: 20px 0 20px 24px;
        line-height: 22px;
        flex: 1;
        color: rgba(@textColor, 0.6);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .progress-wrap {
          height: 53px;
          display: flex;
          margin: 15px 0 4px;
          align-items: center;
          justify-content: space-between;
          margin-right: 44px;
          color: rgba(@textColor, 0.6);
          font-size: 14px;
          .ant-progress-line {
            flex: 1;
            margin-left: 4px;
          }
        }
        .inventory {
          margin-bottom: 20px;
        }
      }
      &-button {
        width: 100%;
        height: 48px;
        color: @primaryColor;
        background: #ffffff;
        font-size: 16px;
        font-weight: 600;
        border: 0;
        box-shadow: 0px -3px 6px -2px rgba(16, 68, 166, 0.12);
        &[disabled] {
          color: rgba(@primaryColor, 0.5);
        }
      }
      &-kby {
        background: linear-gradient(180deg, #f6faff 0%, #f9fbff 40%, #ffffff 100%);
        .meClocker {
          font-size: 12px;
        }
        .index-tabs-list-item-head {
          border: 2px solid #fff;
          border-bottom: 0;
          background: url("@/assets/images/index/kby/item-bg-1.png") no-repeat 0 0 / cover;
        }
        .index-tabs-list-item-content {
          border: 2px solid #fff;
          border-bottom: 0;
          border-top: 0;
        }
        .ant-btn-primary {
          text-shadow: none;
        }
        &:hover {
          .index-tabs-list-item-head {
            background: url("@/assets/images/index/kby/item-bg-1.png") no-repeat 0 0 / cover;
          }
          .index-tabs-list-item-button:not(:disabled) {
            background: linear-gradient(90deg, #04a1ff 0%, #2f77ff 100%);
          }
        }
      }
    }
  }
}
</style>
