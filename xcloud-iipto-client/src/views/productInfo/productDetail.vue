<template>
  <div class="container clearfix">
    <div class="breadcrumb" v-if="PROCESS_ENV.NODE_PLA === 'kby'">
      <span v-if="pageFrom === 'pro'">
        <a href="/productservice" class="atext"> 产品服务 </a><img src="@/assets/images/common/toright.svg" class=""
      /></span>
      <span v-else
        ><a href="/" class="atext"> 首页 </a><img src="@/assets/images/common/torighthover.svg" class=""
      /></span>
      <span class="cur">购买详情</span>
    </div>
    <div class="left-box fl">
      <ProductIntro />
    </div>
    <div class="right-box fl">
      <div class="qr-box" v-if="PROCESS_ENV.NODE_PLA === 'kby'">
        <div class="title">随时随地查询商标</div>
        <div class="content-box">
          <img src="http://file.itaxs.com/pro/20210309/0298fdbe3efc413f8a5b3f394db2e236.png" alt="" />
          <div class="content-right">
            <p>扫码关注</p>
            <p style="font-size: 16px;">“跨标云”公众号</p>
            <p style="color: #666;">手机随时查询商标</p>
          </div>
        </div>
      </div>
      <div class="hot-service" :class="isFixed ? 'fixed' : ''">
        <div class="title">热门服务</div>
        <div v-for="(item, index) in productList" :key="index" @click="toDetail(item.id)" class="service-box">
          <div
            class="service-item"
            v-if="index < 6"
            v-sensors="{
              type: 'BrandServeView',
              event: 'click',
              getParams: () => brandServeView(item),
            }"
          >
            <img v-if="item.productImagePc != ''" :src="item.productImagePc" alt="" />
            <div class="content-right">
              <p class="service-title">{{ item.productName }}</p>
              <p class="service-price">
                <span>{{ item.currency }}</span>
                <span class="price">{{ basePriceHanle(item, 'servicePrice') }}</span>
              </p>
              <p class="old-price">原价{{ item.currency }}{{ basePriceHanle(item, 'originalPrice') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getProductInfoAPI, getProductDetailAPI, newProductInfoList } from '@/api/product/index';
import { addToCart, totalShoppingCart } from '@/api/shoppingCar/shoppingCar';
import countDow from '@/views/activity/315/components/countDow.vue';
import { publicAtivtyInfo } from '@/views/activity/315/mixins/actvityMixins.js';
import { actNode } from '@/views/activity/315/util/util.js';
import { getActProductDetailAPI } from '@/api/618activity/index';
import ProductIntro from './../../../xcloud-client-components-web/productInfo/productIntro.vue';
import componentsMixin from './../../../xcloud-client-components-web/mixin/componentsMixin';
import { cloneDeep, sortBy } from 'lodash';
import Cookies from 'js-cookie';
import { crossStationLogin } from '@/api/login/login';
import { getInfo1 } from '@/api/user/userModule';

export default {
  mixins: [publicAtivtyInfo, componentsMixin],
  data() {
    return {
      num: 1,
      productInfo: {},
      productId: '100724',
      isFixed: false,
      checkedProduct: -1,
      isOpen: false,
      buyMaxCategoryCount: 1,
      servicePrice: 0,
      serviceOldPrice: 0,
      productList: [],
      checkedProductSku: [],
      checkedSkuId: '',
      skuInfo: [],
      skuNameList: [],
      allSku: [],
      productAttributeNameCurr: '',
      catStust: false,
      active315: 0,
      actSign: 0,
      subsing: {
        stus: 0,
      },
      // 618活动
      // status618: this.$route.query.status || false,
      countDowTime: {
        hour: '00',
        minute: '00',
        second: '00',
      },
      buyLimit: this.$route.query.buyLimit || -1,
      status618: this.$route.query.status || false,
      pageFrom: this.$route.query.pagefrom || 'index',
    };
  },
  provide() {
    return {
      subsing: this.subsing,
    };
  },
  components: {
    countDow,
    ProductIntro,
  },
  computed: {
    statusText() {
      return this.activity618Status(this.status618);
    },
    /**
     * 活动状态
     */
    actNodeState: function() {
      return actNode(this.actInfoList, this.actSign) && actNode(this.actInfoList, this.actSign).type;
    },
    // 结束时间
    actEndTime: function() {
      return actNode(this.actInfoList, this.actSign) && actNode(this.actInfoList, this.actSign).endTime;
    },
    // 开始时间
    actStartTime: function() {
      return actNode(this.actInfoList, this.actSign) && actNode(this.actInfoList, this.actSign).startTime;
    },
    // 全局是否登录
    iflogin() {
      return this.$store.state.login.isLogin;
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.init();
      },
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
      if (val != '') {
        return JSON.parse(val)[0].imgUrl;
      } else {
        return '';
      }
    },
    /**
     *  判断是不是活动的商品
     */
    query315actGood() {
      this.catStust = this.$route.query.act || false;
      this.actSign = this.$route.query.sign;
      this.subsing.stus = this.actSign;
      if (this.catStust) {
        // eslint-disable-next-line one-var
        let atNodeList = [1646809200000, 1647327600000, 1647586800000];
        // eslint-disable-next-line no-unused-vars
        let data = null; // 三场活动
        atNodeList.forEach((item, index) => {
          data = this.currentAvtivy(item, item + 7200000, index);
        });
      }
    },
    /**
     * 315更新组件状态
     */
    getGoodMsg(data) {
      console.log('详情页收到通知更新节点', data);
      this.stopActivy();
      this.active315 = new Date().getTime();
      this.$forceUpdate();
    },
    // 神策商标服务详情页浏览
    brandServeView(item) {
      return {
        product_affilation_country: item.countryCode,
        brand_serve_page_source: '热门服务',
        brand_kind: item.productName,
        brand_serve_project: '一标一类',
        brand_original_price: item.baseStandardPrice,
        brand_current_price: item.basePrice,
        quantity_unit: item.unit === 1 ? '类' : '次',
      };
    },
    // 神策商标服务立即购买,加购点击
    clickBrandServeAddNowBuy() {
      return {
        brand_serve_kind: this.productInfo.productName,
        brand_serve_project: this.skuNameList[0],
        brand_original_price: this.serviceOldPrice,
        brand_current_price: this.servicePrice,
        quantity_unit: this.productInfo.unit === 1 ? '类' : '次',
        brand_buy_quantity: this.num,
      };
    },
    minus() {
      if (this.num > 1) {
        this.num--;
      }
    },
    add() {
      if (this.buyLimit == -1 || this.num < this.buyLimit) {
        this.num++;
      } else if (this.num === Number(this.buyLimit)) {
        this.$Message.info('温馨提示：您最多可购买' + this.buyLimit + '个商品');
      }
    },
    addCart() {
      if (this.checkedProductSku.length < this.productInfo.productAttributeGroupVOS.length) {
        this.$Message.info('请先选择完整商品属性');
        return;
      }
      if (this.productInfo.productAttributeGroupVOS.length === 0) {
        this.checkedSkuId = this.productInfo.productSkuVOList[0].skuId;
      }
      addToCart({
        count: this.num,
        productId: this.productId,
        productSkuId: this.checkedSkuId,
      }).then((res) => {
        if (res.code === 0) {
          this.$Message.success('已加入购物车');
          totalShoppingCart().then((res) => {
            this.$store.commit('saveCarNumStatue', res.data);
          });
        } else {
          this.$Message.error('加入购车车失败');
        }
      });
    },
    buyNow() {
      if (this.status618 && this.status618 != 4) return;
      if (this.checkedProductSku.length < this.productInfo.productAttributeGroupVOS.length) {
        this.$Message.info('请先选择完整商品属性');
        return;
      }
      if (this.productInfo.productAttributeGroupVOS.length === 0) {
        this.checkedSkuId = this.productInfo.productSkuVOList[0].skuId;
      }
      let buyProduct = { ...this.productInfo };
      buyProduct.price = this.servicePrice;
      buyProduct.productInfoAttributeGroupVOList = this.checkedProductSku;
      buyProduct.pcProductDetail = this.getImgUrl(this.productInfo.pcProductImgUrl);
      buyProduct.countryName = this.productInfo.countryInfo.countryNameZh;
      buyProduct.productSkuId = this.checkedSkuId;
      buyProduct.productAmount = this.num;
      buyProduct.serviceType = this.productInfo.productCategoryVo.functionCode;
      buyProduct.activityType = this.$route.query.activityType;
      buyProduct.marketingActivityId = this.$route.query.marketingActivityId;
      buyProduct.orderCancelTime = this.$route.query.orderCancelTime;
      localStorage.setItem('selectedList', JSON.stringify(buyProduct));

      if (this.iflogin) {
        this.goNextRouter();
      } else {
        // 未登录状态，标记proid,去登录页面跳回时，继续购买
        localStorage.setItem('productDeailId', location.search.split('=')[1] || '');
        let pageParams = {
          catStust: this.catStust,
          id: this.productId,
          status618: this.status618,
          from: 'buyNow',
          count: this.num,
          skuId: this.checkedSkuId,
          type: this.getProductType(),
          pageFrom: this.pageFrom,
        };
        localStorage.setItem('pageParams', JSON.stringify(pageParams));
        this.$router.push({ path: `/login` });
      }
    },
    getProductType() {
      var type = '';
      if (this.catStust) {
        // 315活动
        type = this.$route.query.type && 'pantent';
      } else if (this.status618 && this.status618 == 4) {
        type = 'act';
      } else if (!this.status618) {
        type = this.$route.query.type && 'pantent';
      }
      return type;
    },
    goNextRouter() {
      console.log(this.$data);
      if (this.catStust) {
        // 315活动
        this.$router.push({
          path: '/sureOrder',
          query: {
            id: this.productId,
            from: 'buyNow',
            count: this.num,
            skuId: this.checkedSkuId,
            catStus: this.catStust,
            type: this.$route.query.type && 'pantent',
            pageFrom: this.pageFrom,
          },
        });
      } else if (this.status618 && this.status618 == 4) {
        this.$router.push({
          path: '/sureOrder',
          query: {
            id: this.productId,
            from: 'buyNow',
            count: this.num,
            skuId: this.checkedSkuId,
            type: 'act',
            pageFrom: this.pageFrom,
          },
        });
      } else if (!this.status618) {
        this.$router.push({
          path: '/sureOrder',
          query: {
            id: this.productId,
            from: 'buyNow',
            count: this.num,
            skuId: this.checkedSkuId,
            type: this.$route.query.type && 'pantent',
            pageFrom: this.pageFrom,
          },
        });
      }
    },
    getProductFun() {
      let paramsData = {
        client: 'PC',
        size: 100,
        current: 1,
        productStatus: 'PENDED_PUBLISH',
      };
      newProductInfoList(paramsData).then((res) => {
        if (res.code === 0 && res.data.records.length > 0) {
          this.productList = [...res.data.records];
        }
      });
      // 默认调商品接口，如果是活动商品，则调用活动商品接口
      let queryApi;
      // if (this.status618) {
      //   queryApi = getActProductDetailAPI({ marketingActivityId: this.$route.query.marketingActivityId, productId: this.productId });
      // } else {
      //   // queryApi = getProductDetailAPI(this.productId);
      // }
      // queryApi.then((res) => {
      //   if (res.code === 0) {
      //     this.productInfo = res.data;
      //     this.servicePrice = res.data.basePrice;
      //     this.serviceOldPrice = res.data.baseStandardPrice;
      //     // 列出所有Sku及所需字段
      //     this.allSku = res.data.productSkuVOList.map((item) => {
      //       const { price, standardPrice, skuId, productAttributeRelationDtoList } = item;
      //       return {
      //         price,
      //         standardPrice,
      //         skuId,
      //         productAttributeIdArray: productAttributeRelationDtoList
      //           .map((o) => {
      //             return o.productAttributeId;
      //           })
      //           .sort(),
      //       };
      //     });
      //   }
      // });
    },
    listenerFunction(e) {
      document.addEventListener('scroll', this.handleScroll, true);
    },
    handleScroll() {
      if (window.pageYOffset > 250) {
        this.isFixed = true;
      }
      if (window.pageYOffset < 250) {
        this.isFixed = false;
      }
    },
    checkProductFun(item, i, index) {
      this.$set(this.productInfo.productAttributeGroupVOS[index], 'checkedProduct', i);
      // 查找当前分类下是否有属性是被添加
      const itemIndex = this.checkedProductSku.findIndex(
        (o) => o.productAttributeCategoryId === item.productAttributeCategoryId
      );
      if (itemIndex > -1) {
        this.checkedProductSku = this.checkedProductSku.filter(
          (o) => o.productAttributeCategoryId !== item.productAttributeCategoryId
        );
      }
      this.checkedProductSku.push(item);
      const checkedProductAttributeIdArray = this.checkedProductSku.map((o) => o.productAttributeId).sort();
      // 通过选中的productAttributeId组合匹配确定当前Sku
      const currentSku = this.allSku.find(
        (o) => o.productAttributeIdArray.toString() === checkedProductAttributeIdArray.toString()
      );
      if (currentSku) {
        this.checkedSkuId = currentSku.skuId;
        this.servicePrice = currentSku.price;
        this.serviceOldPrice = currentSku.standardPrice;
      }
    },
    toDetail(id) {
      this.$router.push({
        path: '/productDetail',
        query: { id },
      });
    },
    // 类目排序
    categorySortingFunc(vv) {
      // eslint-disable-next-line no-unused-vars
      let explainData = [
        {
          productAttributeCategoryId: 7136,
          productAttributeCategoryName: '类目1',
          productAttributeCode: '',
          productAttributeId: 8456,
          productAttributeName: '一标三类',
        },
        {
          productAttributeCategoryId: 7136,
          productAttributeCategoryName: '类目1',
          productAttributeCode: '',
          productAttributeId: 8456,
          productAttributeName: '一标五类',
        },
        {
          productAttributeCategoryId: 7136,
          productAttributeCategoryName: '类目1',
          productAttributeCode: '',
          productAttributeId: 8456,
          productAttributeName: '一标四类',
        },
        {
          productAttributeCategoryId: 7136,
          productAttributeCategoryName: '类目1',
          productAttributeCode: '',
          productAttributeId: 8456,
          productAttributeName: '一标一类',
        },
        {
          productAttributeCategoryId: 7136,
          productAttributeCategoryName: '类目1',
          productAttributeCode: '',
          productAttributeId: 8456,
          productAttributeName: '一标二类',
        },
        {
          productAttributeCategoryId: 7136,
          productAttributeCategoryName: '类目1',
          productAttributeCode: '',
          productAttributeId: 8456,
          productAttributeName: '一标六类',
        },
        {
          productAttributeCategoryId: 7136,
          productAttributeCategoryName: '类目1',
          productAttributeCode: '',
          productAttributeId: 8456,
          productAttributeName: '一标六类555',
        },
        {
          productAttributeCategoryId: 7136,
          productAttributeCategoryName: '类目1',
          productAttributeCode: '',
          productAttributeId: 8456,
          productAttributeName: '一标六类565',
        },
      ];
      let newsList = [...vv];
      newsList.map((item, index) => {
        switch (item.productAttributeName) {
          case '一标一类':
            this.$set(newsList[index], 'sort', 0);
            break;
          case '一标二类':
            this.$set(newsList[index], 'sort', 1);
            break;
          case '一标三类':
            this.$set(newsList[index], 'sort', 2);
            break;
          case '一标四类':
            this.$set(newsList[index], 'sort', 3);
            break;
          case '一标五类':
            this.$set(newsList[index], 'sort', 4);
            break;
          case '一标六类':
            this.$set(newsList[index], 'sort', 5);
            break;
          case '一标七类':
            this.$set(newsList[index], 'sort', 6);
            break;
          case '一标八类':
            this.$set(newsList[index], 'sort', 7);
            break;
          case '一标九类':
            this.$set(newsList[index], 'sort', 8);
            break;
          case '一标十类':
            this.$set(newsList[index], 'sort', 9);
            break;
          default:
            break;
        }
      });
      let compare = function(obj1, obj2) {
        var val1 = obj1.sort;
        var val2 = obj2.sort;
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
      return newsList.sort(compare);
    },
    countTime() {
      let startTime = this.$route.query.startTime; // 活动开始时间
      let endTime = this.$route.query.endTime; // 活动结束时间
      var date = new Date();
      var now = date.getTime();
      var endDate = new Date(startTime);
      var leftTime = 0; // 时间差
      if (this.status618 == 1) {
        endDate = new Date(startTime).getTime();
      } else if (this.status618 == 3 || this.status618 == 4) {
        endDate = new Date(endTime).getTime();
      }
      leftTime = endDate - now;
      let h = 0,
        m = 0,
        s = 0;
      // 递归每秒调用countTime方法，显示动态时间效果
      let timer = setTimeout(this.countTime, 1000);
      if (leftTime >= 0) {
        h = Math.floor(leftTime / 1000 / 60 / 60);
        m = Math.floor((leftTime / 1000 / 60) % 60);
        s = Math.floor((leftTime / 1000) % 60);
      } else {
        console.log('已开始');
        if (this.status618 == 4) {
          this.status618 = 2;
        } else if (this.status618 == 1) {
          this.status618 = 4;
        }
        clearInterval(timer);
      }
      this.countDowTime = {
        hour: h > 9 ? h : '0' + h,
        minute: m > 9 ? m : '0' + m,
        second: s > 9 ? s : '0' + s,
      };
    },
    activity618Status(val) {
      let btnText = '抢购中';
      switch (+val) {
        case 1:
          btnText = '活动未开始';
          break;
        case 2:
          btnText = '活动已结束';
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
    init() {
      if (this.$route.query.id !== undefined) {
        this.productId = this.$route.query.id;
      }
      this.getProductFun();
      // this.listenerFunction();
      // this.query315actGood();
      // this.countTime();
    },
    crossLogin(crossSessionId) {
      var enterpriseId = '';
      if (process.env.NODE_PLA === 'kby') {
        enterpriseId = '30';
      }
      if (process.env.NODE_PLA === 'wg') {
        enterpriseId = '49';
      }
      let obj = {
        enterpriseId: enterpriseId,
        sessionid: crossSessionId,
      };
      this.$Message.info('自动登录中,请勿操作');
      crossStationLogin(obj).then((res) => {
        if (res.code === 0) {
          this.$Message.success('登录成功');
          localStorage.setItem('token', res.data.token); // save local
          localStorage.setItem('sessionId', res.data.sessionId);

          Cookies.set('token', res.data.token);
          Cookies.set('sessionId', res.data.sessionId);

          // 单点登录后，消除crossSessionId
          const url = location.origin+ `/client/productDetail?id=${this.$route.query.id}&pagefrom=${this.$route.query.pagefrom}`;
          window.history.pushState({}, '', url);

          this.getUinfo();
          this.$store.commit('saveLogin', true);
          this.$util.getUserInegralMessage(this, '登录');
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    getUinfo() {
      // eslint-disable-next-line no-unused-vars
      let self = this;
      getInfo1()
        .then(
          (res) => {
            if (res.code === 0) {
              localStorage.setItem('objInfo', JSON.stringify(res.data));
              // 神策关联用户
              this.$sensors.login(res.data.userMobile, () => {
                this.$sensors.quick('autoTrack');
              });
            } else {
              this.$Message.error(res.message);
            }
          },
          (err) => {
            this.$Message.error(err.message);
          }
        )
        .finally(() => {});
    },
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.listenerFunction);
  },
  // 单点登录版本需求，跨标云、卖家成长的外观专利产品，直接跳到外观专利详情页,判定id，跳转到对应的id上去，并自动登录
  created() {
    console.log(this.$route.query.crossSessionId);
    let crossSessionId = this.$route.query.crossSessionId;
    if (crossSessionId) {
      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');

      Cookies.remove('token');
      Cookies.remove('sessionId');

      this.crossLogin(crossSessionId);
    }
  },
};
</script>
<style lang="less" scoped>
.actcount {
  position: relative;
  left: 22%;
  top: -26px;
  color: #ff6600;
}
.container {
  width: 1200px;
  min-height: 60vh;
  padding: 0;
  background: none !important;
  .left-box {
    width: 900px;
  }
  .top-info {
    width: 100%;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04), 0px -1px 8px 0px rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    position: relative;
    .activity-label {
      width: 90px;
      height: 90px;
      position: absolute;
      top: 14px;
      left: 11px;
    }
    .right-info {
      width: 496px;
      height: auto;
      display: inline-block;
      vertical-align: top;
      margin-left: 10px;
      .title {
        font-size: 26px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
      .sub-title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
        margin-top: 8px;
      }
      .service-info {
        margin-top: 6px;
        width: 100%;
        background-color: #eff9ff;
        padding: 10px 12px;
        font-size: 12px;
        font-family: PingFangSC;
        color: #666666;
        p {
          font-size: 14px;
          color: #333333;
          margin-bottom: 2px;
        }
        span {
          margin-top: 8px;
          display: inline-block;
          margin-right: 20px;
          img {
            vertical-align: middle;
          }
        }
      }
      .price-info {
        margin-left: 12px;
        font-size: 14px;
        color: #333333;
        margin-top: 10px;
        .price {
          font-size: 18px;
          color: #ff6600;
          .num {
            font-size: 24px;
            margin-left: -8px;
          }
        }
        .original-price {
          font-size: 14px;
          font-family: PingFangSC;
          color: #999999;
          margin-left: 8px;
          text-decoration: line-through;
        }
        .explain {
          font-size: 12px;
          font-family: PingFangSC;
          color: #999;
          margin-left: 8px;
        }
      }
      .service-type {
        margin-top: 14px;
        .type-title {
          font-size: 14px;
          font-size: 14px;
          font-family: PingFangSC;
          color: #333333;
          margin-left: 12px;
          width: 60px;
          display: inline-block;
        }
        .types-list {
          display: inline-block;
          vertical-align: top;
          width: 350px;
          margin-left: 12px;
          position: relative;
          img {
            position: absolute;
            right: 0;
            top: 10px;
            cursor: pointer;
          }
        }
        .types-list.open {
          height: auto;
          overflow: inherit;
        }
        .type-label {
          padding: 0 10px;
          height: 26px;
          border-radius: 2px;
          border: 1px solid #dddddd;
          display: inline-block;
          font-size: 14px;
          text-align: center;
          line-height: 26px;
          margin-right: 8px;
          color: #666;
          margin-bottom: 10px;
          position: relative;
          cursor: pointer;
          /deep/ .ivu-tooltip-inner {
            white-space: break-spaces;
          }
        }
        .type-label.active {
          color: #00a3ff;
          border-color: #00a3ff;
        }
        .type-label.active::after {
          content: '';
          display: inline-block;
          width: 18px;
          height: 18px;
          background: url('../../../src/assets/images/product/check.svg') no-repeat;
          right: 0;
          bottom: 0;
          position: absolute;
        }
      }
      .product-num {
        margin-top: 12px;
        margin-left: 12px;
        font-size: 14px;
        padding-bottom: 16px;
        border-bottom: 1px dashed #999;
        .changeNum {
          display: inline-block;
          margin-left: 14px;
          button {
            width: 26px;
            height: 26px;
            border: 1px solid #dddddd;
            background-color: #fff;
            cursor: pointer;
          }
          button:first-child {
            border-radius: 2px 0px 0px 2px;
            border-right: none;
          }
          button:last-child {
            border-radius: 0px 2px 2px 0px;
            border-left: none;
            margin-left: -4px;
          }
          .minus {
            background: #f8f8f8;
            color: #ccc;
          }
          input {
            width: 60px;
            height: 26px;
            border: 1px solid #dddddd;
            background-color: #fff;
            text-align: center;
            margin-left: -4px;
          }
        }
      }
      .buy {
        margin-top: 16px;
        padding-left: 11px;
        .addCartBtn {
          width: 108px;
          height: 34px;
          background: rgba(237, 248, 252, 1);
          border: 1px solid #00a3ff;
          border-radius: 2px;
          color: #00a3ff;
          font-size: 16px;
          margin-right: 15px;
          cursor: pointer;
          img {
            height: 12px;
            margin-right: 5px;
          }
        }
        .buyNowBtn {
          width: 108px;
          height: 34px;
          background: #00a3ff;
          border-radius: 2px;
          color: #ffffff;
          font-size: 16px;
          border: none;
          cursor: pointer;
        }
      }
    }
    .activity618 {
      .buy-btn {
        width: 108px;
        height: 34px;
        background: #00a3ff linear-gradient(180deg, #fb8f0a 0%, #f9490e 100%);
        border-radius: 2px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 34px;
        text-align: center;
        cursor: pointer;
        border: none;
      }
      .buy-btn.disabled-btn {
        cursor: no-drop;
        opacity: 0.5;
      }
      .down-time {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        .time-box {
          display: inline-block;
          width: 22px;
          height: 22px;
          background: #d8d8d8 linear-gradient(180deg, #fb8f0a 0%, #f9490e 100%);
          border-radius: 1px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 22px;
          vertical-align: middle;
          text-align: center;
        }
      }
    }
    .product-img {
      width: 350px;
      height: 328px;
    }
  }
  .service-introduce {
    width: 100%;
    margin-top: 20px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04), 0px -1px 8px 0px rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    padding-top: 24px;
    margin-bottom: 44px;
    & > img {
      width: 100%;
    }
    .title {
      font-size: 18px;
      font-family: PingFangSC;
      color: #00a3ff;
      text-align: center;
      margin-bottom: 24px;
      a {
        margin: 0 30px;
        color: #666;
        font-size: 16px;
      }
      a.active {
        color: #00a3ff;
      }
    }
    .box-title {
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      text-align: center;
      margin-bottom: 24px;
    }
    .why-box {
      width: 100%;
      background: #f7f8fc;
      padding: 28px 128px 34px 128px;
      .flex {
        flex-wrap: wrap;
        justify-content: space-between;
        div {
          width: 306px;
          height: 196px;
          background: #ffffff;
          box-shadow: 0px 2px 10px 0px #ebecef;
          border-radius: 2px;
          margin-top: 24px;
          text-align: center;
          padding: 27px 38px 22px 38px;
          .why-title {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            line-height: 22px;
            margin: 24px 0 12px 0;
          }
          .why-content {
            color: #999999;
            font-size: 12px;
            line-break: 20px;
          }
        }
      }
    }
    .need-box {
      padding: 28px 24px 35px 24px;
      .flex {
        flex-wrap: wrap;
        justify-content: space-between;
        div.flex {
          width: 369px;
          height: 200px;
          background: #ffffff;
          box-shadow: 0px 2px 10px 0px #ebecef;
          border-bottom: 4px solid #00a3ff;
          padding: 25px 40px 30px 50px;
          text-align: left;
          .need-title {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            margin-bottom: 10px;
          }
          .need-content {
            font-size: 12px;
            font-family: PingFangSC;
            color: #333333;
            line-height: 24px;
          }
        }
      }
    }

    .fllow-box {
      background: #f7f8fc;
      padding: 28px 0;
      text-align: center;
    }
    .why-choose-box {
      padding-top: 28px;
      text-align: center;
    }
    .question-box {
      margin-top: 19px;
      .question-content {
        padding: 0 24px 24px 24px;
        .content-box {
          margin-bottom: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid #ebebeb;
          span {
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #00a3ff;
            display: inline-block;
            margin-right: 18px;
            font-size: 18px;
            vertical-align: top;
          }
          p.question {
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            margin-bottom: 9px;
          }
          p.answer {
            font-size: 14px;
            font-family: PingFangSC;
            color: #999999;
          }
          .br-content {
            font-size: 14px;
            font-family: PingFangSC;
            color: #999999 !important;
            max-width: 790px;
            line-height: 26px;
          }
        }
      }
      .questionEU .content-box span {
        color: #055cf8;
      }
    }
  }
  #JP {
    .flex {
      div.flex {
        border-bottom: 4px solid #9681fb !important;
      }
    }
    .question-content {
      .content-box {
        span {
          color: #785ff4;
        }
      }
    }
  }
}
.container .right-box {
  margin-left: 20px;
  width: 280px;
  box-sizing: border-box;
  margin-bottom: 60px;
  .hot-service {
    width: 280px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04), 0px -1px 8px 0px rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    padding: 16px;
    .service-item {
      margin-top: 16px;
      cursor: pointer;
      // padding-bottom: 15px;
      // border-bottom: 1px dashed #999;
      img {
        width: 90px;
        height: 84px;
      }
      .content-right {
        display: inline-block;
        vertical-align: top;
        margin-left: 10px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        line-height: 28px;
        max-width: 142px;
        p.service-title {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          word-break: break-all;
        }
        p.service-price {
          color: #ff6600;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          .price {
            font-size: 16px;
          }
          span {
            margin: -2px;
            display: inline-block;
          }
        }
        p.old-price {
          font-size: 14px;
          font-family: PingFangSC;
          color: #999999;
          text-decoration: line-through;
        }
      }
    }
  }
}

.container .right-box .qr-box {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04), 0px -1px 8px 0px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
}

.container .right-box .qr-box .content-box {
  margin-top: 18px;
}

.container .right-box .qr-box .content-box > img {
  width: 94px;
  height: 94px;
}

.container .right-box .qr-box .content-box .content-right {
  display: inline-block;
  vertical-align: top;
  margin-top: 6px;
  margin-left: 11px;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 28px;
}

.container .right-box .qr-box .content-box .content-right > p {
  line-height: 28px;
}

.container .right-box .adv-box {
  width: 370px;
  height: 270px;
  margin-top: 28px;
}

.container .right-box .adv-box > img {
  width: 100%;
  height: 100%;
}

.container .right-box .hot-box {
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04), 0px -1px 8px 0px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 20px;
  margin-top: 20px;
  background-color: #fff;
}

.container .right-box .hot-service.fixed {
  position: fixed;
  top: 90px;
  margin-top: 0;
  z-index: 99;
}

.container .right-box .title {
  font-size: 18px;
  font-family: SourceHanSansSC-Medium, SourceHanSansSC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 18px;
  margin-bottom: 18px;
}

.container .right-box .article-item {
  margin-top: 14px;
  display: block;
}

.container .right-box .main-img {
  width: 86px;
  height: 58px;
  overflow: hidden;
}

.container .right-box .main-img img {
  width: 100%;
  height: 100%;
}

.container .right-box .article-info {
  margin-left: 18px;
  color: #999;
  font-size: 14px;
  width: 196px;
  position: relative;
  height: 58px;
}
.container .right-box .article-item .article-info .article-title {
  font-size: 14px;
  font-family: 'SourceHanSansSC-Medium, SourceHanSansSC';
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  margin-top: 10px;
}
.container .right-box .article-item .article-info .article-content {
  font-size: 12px;
  font-family: PingFangSC;
  color: #999999;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  margin-top: 2px;
}

/deep/ .ivu-tooltip-inner {
  min-width: 304px;
}
.other-box {
  padding: 46px 0 40px 0;
  text-align: center;
  .buy-explain {
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .line1,
  .line2 {
    margin-top: 22px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
  .line2 {
    color: #db2c2c;
    margin-top: 4px;
  }
}
.breadcrumb {
  height: 30px;
  line-height: 30px;
  color: #00000090;
  margin-bottom: 10px;
  font-size: 16px;
  .cur {
    color: #00a3ff;
  }
  img {
    margin-top: -3px;
  }
}
</style>
