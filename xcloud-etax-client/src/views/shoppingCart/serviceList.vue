<template>
  <div class="container">
    <div class="bannerbox">
      <IndexBanner :adKey="'purchaseservices_top_banner'" v-if="envpla !== 'kqy'" />
    </div>
    <div class="tabsbox" ref="tabsbox">
      <!-- 跨税云 跨企云查询id不同 -->
      <div class="tab" :class="{ cur: curIndex === '1' }" @click="callback(envpla === 'ksy' ? '1' : '8')">全部服务</div>
      <div class="tab" :class="{ cur: curIndex === '2' }" @click="callback('2')" v-if="envpla === 'ksy'">VAT服务</div>
      <div class="tab" :class="{ cur: curIndex === '8' }" @click="callback('8')" v-if="envpla === 'kqy'">海外工商</div>
      <!-- <div class="tab" :class="{ cur: curIndex === '3' }" @click="callback('3')">
        EPR服务
      </div> -->
      <div class="tab" :class="{ cur: curIndex === '4' }" @click="callback('4')" v-if="envpla === 'ksy'">
        EPR/合规产品
      </div>
      <div class="tab" :class="{ cur: curIndex === '9' }" @click="callback('9')" v-if="envpla === 'ksy'">优惠套餐</div>
      <div class="tab link" @click="callback('5')" v-if="envpla === 'ksy'">
        <img src="@/assets/images/common/tab-sb.svg" class="menu-icon" />
        商标专利
      </div>
      <div class="tab link" @click="callback('6')">
        <img src="@/assets/images/common/tab-lq.svg" class="menu-icon" />
        领券中心
      </div>
      <div class="tab link" @click="callback('7')" v-if="envpla === 'ksy'">
        <img src="@/assets/images/common/tab-xf.svg" class="menu-icon" />
        续费服务
      </div>
    </div>

    <!-- 全部国家 -->
    <!-- {{ countryCode }} <br />
    {{ productListCountry.length }} -->
    <div class="countrylist" :class="{ fixed: $store.getters.scrollNum > 250 }" :style="{ width: `${tabsboxWidth}px` }">
      <div class="item-box" ref="countrylist">
        <div class="left">
          <span
            class="item"
            :class="{ 'item-active': !selectCountryCodes.length || selectCountryCodes.length === countryInfo.length }"
            @click="searchProductByAllCountry"
            >全部国家</span
          >
        </div>
        <div class="mid" :class="showMore ? '' : 'shou'">
          <!-- @click="currentItem(index, item)" -->
          <span
            class="item"
            v-for="(item, index) in productCountryAll"
            @click="searchProduct(item)"
            :class="{
              'item-active': selectCountryCodes.includes(item.countryCode),
            }"
            :key="index"
          >
            <span>{{ item.countryNameZh }}</span>
          </span>
        </div>
        <div class="right" v-if="curIndex === '1' || curIndex === '2'">
          <span v-if="showMore" @click="showMore = false"
            >收起
            <img src="@/assets/images/common/pro-shang.png" alt="" />
          </span>
          <span v-else @click="showMore = true"
            >展开
            <img src="@/assets/images/common/pro-xia.png" alt="" />
          </span>
        </div>
      </div>
    </div>
    <!-- 国家列表位置fixed的时候，添加div占位符，避免页面闪动 -->
    <div :style="{ height: `${countryListHight}px` }" v-if="$store.getters.scrollNum > 250"></div>

    <div class="content" style="min-height: 90px">
      <!-- VAT服务 -->
      <a-spin :spinning="productLoading">
        <div>
          <div class="countries" v-for="(v, i) in productListCountry" :key="i">
            <div class="countryTitle">
              <!-- <img :src="v.countryFlagUrl" alt="" /> -->
              {{ v.countryNameZh }}
            </div>
            <div class="serviceList">
              <template v-for="(item, index) in v.list">
                <HomeCard v-if="!ActiveConfig.producIdList.includes(item.id)" :key="index" :info="item" />
              </template>
            </div>
          </div>

          <div class="nodata" v-if="!originRecords.length">
            <img src="@/assets/images/common/emptyOrderList.svg" style="margin-top: 100px" alt="" />
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import ServiceItem from '@/views/common/shoppingCart/serviceItem';
import { zeroBuyStatusAPI } from '@/api/activity';
import { productInfo, newProductInfo, countryList, allCountryList } from '@/api/shoppingCar/shoppingCar';
import '@/styles/common.less';
import IndexBanner from '@/components/IndexBanner/index';
import HomeCard from './../../../xcloud-client-components-web/module/components/homeCard/index.vue';
import { cloneDeep, uniqBy } from 'lodash';
export default {
  data() {
    return {
      countryCode: [], // 国家code
      productList: [],
      countryInfo: [],
      curent: -1,
      activityType: '',
      btnFlag: false,
      scrollTop: 0,
      taxInspection: [],
      productListCountry: [],
      carouselVal: 0,
      setting: {
        autoplay: true,
        autoplaySpeed: 5000,
        dots: 'none',
        radiusDot: false,
        trigger: 'click',
        arrow: 'never',
      },
      listQuery: {
        // applySit: 1,
        // status: 1,
        // functionCodes: [2, 5, 6, 7, 13, 17, 23, 24, 16, 31, 32],
        // countryCodes: [],
        client: 'PC',
        size: 100,
        current: 1,
        productStatus: 'PENDED_PUBLISH',
        // 跨税云 跨企云查询id不同
        productCategoryIds:
          this.envpla === 'ksy' ? ['1588492024187269121', '1588492025906933762'] : ['1607561055083282434'],
        enterpriseId: this.envpla === 'ksy' ? '29' : '51',
        countryCodeList: [],
      },
      zeroProductList: [],
      curIndex: '1',
      productLoading: false,
      showMore: true,
      productCountryAll: [], //有商品的国家列表
      selectCountryCodes: [], // 选中的国家的codes
      originRecords: [], // 全部服务，原始结构
      countryListHight: 0,
      tabsboxWidth: 0,
    };
  },
  components: {
    ServiceItem,
    IndexBanner,
    HomeCard,
  },
  async created() {
    await this.getBaseInfo();
    await this.getProductInfo('first');
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop);
    // console.log(this.$refs.tabsbox.offsetWidth);
    this.tabsboxWidth = this.$refs.tabsbox.offsetWidth;
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollToTop);
  },
  methods: {
    async getBaseInfo() {
      let params = {
        // applySit: 1,
        // functionCodes: this.listQuery.functionCodes,
      };
      await allCountryList(params).then((res) => {
        this.countryCode = [];
        this.countryInfo = res.data;
        for (let i = 0; i < res.data.length; i++) {
          this.countryCode.push(res.data[i].countryCode);

          this.$nextTick(() => {
            this.countryListHight = this.$refs.countrylist.offsetHeight;
          });
        }
      });
    },
    async getProductInfo(type) {
      const self = this;
      this.productLoading = true;
      await newProductInfo(this.listQuery)
        .then((res) => {
          let arr = [];
          res.data.records.forEach((goods) => {
            //组合商品拆开按国家展示
            if (goods.productInfoDTOList.length) {
              let combinationCommodityHD = [];
              goods.productInfoDTOList.forEach((goodsSub) => {
                goods.countryCode = goodsSub.countryCode;
                combinationCommodityHD.push(goods);
              });
              arr.push(...uniqBy(combinationCommodityHD, 'countryCode'));
            } else {
              arr.push(goods);
            }
          });
          // let arr = res.data.records;
          this.originRecords = arr;
          arr.forEach((item) => {
            if (typeof item.productId == 'undefined') {
              item.productId = item.id;
            }
          });
          // 当第一次查询时保存到localStorage，此时查询的是所有服务
          if (type === 'first') localStorage.setItem('productInfo', JSON.stringify(arr));
          // console.log(this.zeroProductList)
          // 0元购活动关联商品信息
          let isBuyZero = self.zeroProductList.filter((item) => {
            return item.buy === true;
          });

          arr.map((item) => {
            item.oldUser = true;
            item.isBuyZero = isBuyZero.length > 0 ? true : false;
            self.zeroProductList.map((vv) => {
              // 0元购商品
              if (item.productId === vv.productId) {
                item.buy = vv.buy;
                item.empty = vv.empty;
                item.limit = vv.limit;
                item.oldUser = false;
              }
            });
          });
          this.productList = [];
          this.taxInspection = [];

          // 选择全部国家时，selectCountryCodes=[], 这时也要按国家来区别展示this.selectCountryCodes.length ? this.selectCountryCodes :
          let selectCountryCodesCopy = this.countryInfo;
          // console.log(selectCountryCodesCopy, this.selectCountryCodes, this.countryCode);

          selectCountryCodesCopy.map((item) => {
            let obj = {
              countryFlagUrl: '',
              countryNameZh: '',
              list: [],
            };
            arr.map((i, v) => {
              if (i.countryCode == item.countryCode) {
                // obj.countryFlagUrl = i.countryInfo.countryImgUrl;
                obj.countryNameZh = item.countryNameZh;
                obj.countryCode = item.countryCode;
                // i.functionCode = i.productCategoryVo.functionCode;
                // i.serviceType = i.productCategoryVo.functionCode;
                i.id = i.id;
                obj.list.push(i);
              }
            });
            if (obj.list.length > 0) {
              // self.$nextTick(() => {
              self.productList.push(obj);
              // });
            }
          });
          // self.$nextTick(() => {
          self.productList.map((item) => {
            item.list.map((pro) => {
              if (pro.pcProductImgUrl) {
                pro.productImgUrl = JSON.parse(pro.pcProductImgUrl)[0].imgUrl;
              }
            });
          });
          self.productListCountry = [];
          self.productListCountry = JSON.parse(JSON.stringify(self.productList));

          if (!this.listQuery.countryCodeList.length) {
            this.productCountryAll = cloneDeep(self.productList);
          }
        })
        .finally(() => {
          this.productLoading = false;
        });
    },
    getZeroProductList() {
      zeroBuyStatusAPI().then((res) => {
        if (res.code === 0) {
          if (JSON.stringify(res.data) !== '{}') this.zeroProductList = res.data;
        }
      });
    },
    currentItem(index, item) {
      this.curent = index;
      this.listQuery.countryCode = item === undefined ? '' : item.countryCode;
      this.getProductInfo();
    },
    searchProduct(item) {
      console.log(item, 9090);
      let { countryCode } = item;
      let isIncloudes = this.selectCountryCodes.includes(countryCode);
      if (isIncloudes) {
        this.selectCountryCodes = this.deleteItemInArray(this.selectCountryCodes, countryCode);
      } else {
        this.selectCountryCodes.push(countryCode);
      }

      this.listQuery.countryCodeList = this.selectCountryCodes;
      this.getProductInfo();
    },
    searchProductByAllCountry() {
      this.selectCountryCodes = [];
      this.listQuery.countryCodeList = [];
      this.getProductInfo();
    },

    deleteItemInArray(arr, val) {
      let ind = arr.indexOf(val);
      if (ind > -1) {
        arr.splice(ind, 1);
      }
      return arr;
    },
    async callback(key) {
      this.curIndex = key;
      this.listQuery.productCategoryIds = [];
      this.listQuery.countryCodeList = [];
      this.selectCountryCodes = [];
      this.listQuery.isCombinationProduct = undefined;
      this.curent = -1;
      switch (key) {
        case '1':
          this.listQuery.productCategoryIds = ['1588492024187269121', '1588492025906933762'];
          break;
        case '2':
          this.listQuery.productCategoryIds = ['1588492025906933762'];
          break;
        case '3':
          this.listQuery.productCategoryIds = ['1588492024187269121'];
          break;
        case '4':
          this.listQuery.productCategoryIds = ['1588492024187269121'];
          break;
        case '5':
          let url = this.homePageKBUrl;
          // window.location.href = url;
          window.open(url);
          break;
        case '6':
          this.$router.push({ path: `/receiveCoupon` });
          break;
        case '7':
          this.$router.push({ path: `/renewal` });
          break;
        case '8':
          this.listQuery.productCategoryIds = ['1607561055083282434'];
          break;
        case '9':
          this.listQuery.isCombinationProduct = 'IS_COMBINATION_PRODUCT';
          break;
        default:
          break;
      }
      await this.getBaseInfo();
      await this.getProductInfo();
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  // margin-left: 24px;
  // margin-top: 10px;
  padding-bottom: 24px;
  background: #f6f5f8;
  min-height: calc(100vh - 86px);
  .title {
    padding: 24px;
    background: #ffffff;
    font-size: 16px;
    font-size: 24px;
    font-family: 'Microsoft Yahei', PingFangSC-Semibold, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    border-radius: 10px;
    // margin-bottom: -20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f6f6f6;
    margin-top: 24px;
    .tab {
      margin-right: 44px;
      cursor: pointer;
    }
    .active {
      color: #16ade9;
    }
  }

  .countrylist {
    .item-box {
      background: #ffffff;
      border-bottom: 1px solid #f6f6f6;
      padding: 12px 19px;
      display: flex;
      margin: 16px 26px;
      position: relative;
      .left {
        width: 110px;
      }
      .mid {
        // width: 86%;
        width: calc(100% - 187px);
      }
      .shou {
        height: 40px;
        overflow: hidden;
      }
      .right {
        position: absolute;
        color: #1890ff;
        font-size: 14px;
        top: 22px;
        right: 47px;
        cursor: pointer;
        img {
          vertical-align: middle;
        }
      }
      .item {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        cursor: pointer;
        margin-right: 28px;
        padding: 4px 8px;
        border-radius: 2px;
        line-height: 40px;
        span {
          white-space: nowrap;
        }
      }
      .item-active {
        height: 30px;
        background: #f0f6ff;
        border-radius: 2px 2px 2px 2px;
        opacity: 1;
        color: #3a7fff;
      }
      .zero-label {
        vertical-align: middle;
        margin-left: -30px;
      }
    }
  }

  .content {
    margin: 16px 26px;

    .countries {
      // background: #ffffff;
      padding-bottom: 0px;
      // margin-top: 20px;
      // overflow-x: auto;
      padding-right: 0px;
      .countryTitle {
        height: 24px;
        background: #ffffff;
        margin-bottom: 15px;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        color: #000000;
        display: inline-flex;
        align-items: center;
        padding: 0px 12px;
        border-radius: 0px 15px 15px 0px;
        img {
          width: 24px;
          margin-right: 10px;
          margin-bottom: 2px;
        }
      }
      .serviceList {
        display: flex;
        flex-flow: wrap;
        // justify-content: space-between;
        // /deep/ .serviceItem:nth-child(7) {
        // border-right: none;
        // margin-top: 24px;
        // margin-right: 0;
        // }
      }
    }
  }
}
.tabsbox {
  height: 46px;
  line-height: 46px;
  background: #ffffff;
  font-weight: 400;
  color: #606266;
  font-size: 14px;
  padding: 0px 26px;
  .tab {
    display: inline-block;
    margin-right: 26px;
    cursor: pointer;
    img {
      vertical-align: middle;
    }
  }
  .cur {
    color: #3a7fff;
    border-bottom: 2px solid #3a7fff;
  }
  .link {
    color: #fc7032;
  }
}
.allbox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.nodata {
  text-align: center;
  width: 100%;
}
.fixed {
  position: fixed;
  top: 44px;
  z-index: 9999;
}
@media only screen and (min-width: 1930px) {
  .fixed {
    width: 90%;
  }
}
</style>
