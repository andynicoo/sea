<template>
  <div>
    <div class="new-product-intro">
      <img
        v-if="marketingActivityId"
        class="new-product-img"
        :src="newProductInfo.productImageMarketing || newProductInfo.productImagePc"
      />
      <img v-else class="new-product-img" :src="newProductInfo.productImagePc" />
      <dl class="new-product-info">
        <dt>{{ newProductInfo.productName }}</dt>
        <dd class="new-service-info" v-if="newProductInfo.serviceContext">
          <p>服务内容</p>
          <span v-for="(item, index) in newProductInfo.serviceContext.split(',')" :key="index">
            <img class="includeService" src="./../images/sureOrder/serviceIcon.svg" alt="" />
            <img class="includeServiceOrange" src="./../images/orangeTheme/includeService.svg" alt="" />
            {{ item }}
          </span>
        </dd>
        <!-- <dd v-if="[29, 40].includes(enterpriseId)">
          <span class="new-info-label new-info-specLabel">购买须知</span>
          <div>
            <span
              v-if="newProductInfo.productCategoryId == '1588492025906933762'"
              class="new-type-label new-user-agreement"
              @click="
                showAgreement = true;
                agreementType = 'VAT';
              "
              style="cursor: pointer"
              >{{ enterpriseId == '29' ? '《跨税云用户协议-VAT》' : '《卖家成长用户协议-VAT》' }}</span
            >
            <span
              v-if="newProductInfo.productCategoryId == '1588492024187269121'"
              class="new-type-label new-user-agreement"
              @click="
                showAgreement = true;
                agreementType = 'compliance';
              "
              style="cursor: pointer"
              >{{ enterpriseId == '29' ? '《跨税云用户协议-合规认证》' : '《卖家成长用户协议-合规认证》' }}</span
            >
          </div>
        </dd> -->
        <!-- <div class="purchaseInformation flex-start">
          购买须知
          <span @click="showAgreement = true; agreementType = 'VAT'" style="cursor: pointer" v-if="isVAT(DetailInfo.productCategoryVo.functionCode)">《跨税云用户协议-VAT》</span>
          <span @click="showAgreement = true; agreementType = 'compliance'" style="cursor: pointer" v-else>《跨税云用户协议-合规认证》</span>
        </div> -->
        <!-- <dd
          class="product-package-purchase"
          v-if="newProductInfo.productCombinationSpecsDTOList && newProductInfo.productCombinationSpecsDTOList.length"
        >
          <span class="new-info-label">套装购买</span>
          <div>
            <span @click="packageSelected(1)" class="new-type-label" :class="isPackageSelected == 1 ? 'new-active' : ''"
              >套装购买</span
            ><span
              :class="isPackageSelected == 2 ? 'new-active' : ''"
              @click="packageSelected(2)"
              class="new-type-label"
              >单买</span
            >
          </div>
        </dd> -->
        <!-- 组合商品 -->
        <template v-if="newProductInfo.isCombinationProduct == 'IS_COMBINATION_PRODUCT'">
          <dd
            v-for="(goods, index) in newProductInfo.productInfoDTOList"
            :key="index"
            class="product-attribute-group combination-product-list"
          >
            <div class="product-category-title">商品{{ index + 1 }}：{{ goods.productName }}</div>
            <div v-for="item in goods.specsGroup" :key="item.productCode" class="product-attribute-list">
              <span class="new-info-label new-info-specLabel">{{ item.productCategory }}</span>
              <div>
                <span
                  @click="specsSelected(item.productSpecsDTOList, recordSub.id)"
                  class="new-type-label"
                  v-for="recordSub in item.productSpecsDTOList"
                  :key="recordSub.id"
                  :class="recordSub.check || isPackageSelected == 1 ? 'new-active' : ''"
                >
                  {{ recordSub.specsName }}
                </span>
              </div>
            </div>
            <!-- <div class="product-attribute-list">
              <span class="new-info-label">服务项目</span>
              <div>
                <span @click="specsSelected(item.productSpecsDTOList, recordSub.id)" class="new-type-label" v-for="recordSub in item.productSpecsDTOList" :key="recordSub.id" :class="recordSub.check || combinationCommodityActivity ? 'new-active' : ''">
                  {{ recordSub.specsName }}
                </span>
              </div>
            </div> -->
          </dd>
        </template>
        <template v-else>
          <!-- 单商品属性展示购买 -->
          <template v-if="newProductInfo.displayMethod == 'ATTR'">
            <dd v-for="item in attributeGroup" :key="item.productCode" class="product-attribute-group">
              <div v-show="attributeGroup.length > 1" class="product-category-title">{{ item.productCategory }}：</div>
              <div v-for="record in item.records" :key="record.attributeTypeId" class="product-attribute-list">
                <span class="new-info-label">{{ record.attributeTypeName }}</span>
                <div>
                  <span
                    @click="attributeSelected(record.productAttributeList, recordSub.value)"
                    class="new-type-label"
                    v-for="recordSub in record.productAttributeList"
                    :key="recordSub.value"
                    :class="recordSub.check ? 'new-active' : ''"
                  >
                    {{ recordSub.label }}
                  </span>
                </div>
              </div>
            </dd>
          </template>
          <!-- 单商品规格展示购买 -->
          <template v-else>
            <dd v-for="item in attributeGroup" :key="item.productCode">
              <span class="new-info-label new-info-specLabel">{{ item.productCategory.split('/')[1] }}</span>
              <div>
                <span
                  @click="specsSelected(item.productSpecsDTOList, recordSub.id)"
                  class="new-type-label"
                  v-for="recordSub in item.productSpecsDTOList"
                  :key="recordSub.id"
                  :class="recordSub.check || isPackageSelected == 1 ? 'new-active' : ''"
                >
                  {{ recordSub.specsName }}
                </span>
              </div>
            </dd>
          </template>
          <!-- <dd v-else>
            <span class="new-info-label new-info-specLabel">服务项目</span>
            <div>
              <span @click="specsSelected(newProductInfo.productSpecsDTOList, recordSub.id)" class="new-type-label" v-for="recordSub in newProductInfo.productSpecsDTOList" :key="recordSub.id" :class="recordSub.check || isPackageSelected == 1 ? 'new-active' : ''">
                {{ recordSub.specsName }}
              </span>
            </div>
          </dd> -->
        </template>
        <dd
          class="add-additional-services"
          @click="addAdditionalServices"
          v-if="
            this.additionalSpec.length &&
            !showAdditional &&
            newProductInfo.displayMethod != 'ATTR' &&
            !marketingActivityId
          "
        >
          +服务项目不够?添加附加服务
        </dd>
        <!-- 附加规格 -->
        <template v-if="showAdditional && isPackageSelected != 1">
          <dd class="product-attribute-group" v-for="item in additionalSpec" :key="item.id">
            <div v-if="item.additionalSpecCurr.length" class="product-category-title">
              {{ item.additionSpecDTO.specsName }}-附加服务：
            </div>
            <dl v-if="item.additionalSpecCurr.length" class="additional-services-dl">
              <dt>
                <div class="additional-services-select">{{ item.additionSpecDTO.templateName }}</div>
                <div>件数</div>
                <div>操作</div>
              </dt>
              <dd v-for="(specCurr, index) in item.additionalSpecCurr" :key="index">
                <div class="additional-services-select">
                  <Select
                    v-model="specCurr.type"
                    @on-change="(id) => additionSpecTypeChange(id, specCurr, item.additionSpecDTO.specDetailDTOList)"
                  >
                    <Option v-for="spec in item.additionSpecDTO.specDetailDTOList" :key="spec.id" :value="spec.id">
                      {{ spec.specName }}
                    </Option>
                  </Select>
                </div>
                <div>
                  <InputNumber :precision="0" :max="10" :min="1" v-model="specCurr.num"></InputNumber>
                </div>
                <div class="additional-services-handle">
                  <span
                    v-if="
                      index == item.additionalSpecCurr.length - 1 &&
                      item.additionalSpecCurr.length < item.additionSpecDTO.specDetailDTOList.length
                    "
                    @click="servicesAdd(item.additionalSpecCurr)"
                  >
                    增加
                  </span>
                  <span @click="servicesDel(item.additionalSpecCurr, index)">删除</span>
                </div>
              </dd>
            </dl>
          </dd>
        </template>
        <dd v-if="newProductInfo.purchaseInstructions">
          <span class="new-info-label purchaseInstructions-label">购买须知</span>
          <div class="purchaseInstructions">
            <img src="./../images/common/tipsIcon.svg" />{{ newProductInfo.purchaseInstructions }}
          </div>
        </dd>
        <dd class="seckill" v-if="marketingActivityId && !activityEnd">
          <div class="left">
            <img src="./../images/activity/alarm_clock.svg" alt="" />
            <p>限时秒杀</p>
          </div>
          <div class="right">
            <div>{{ isBefor ? '距离开始' : '距离结束' }}</div>
            <p>{{ hours > 9 ? hours : `0${hours}` }}</p>
            <!-- <p v-if="hours<10">0{{hours}}</p> -->
            <p class="tip">:</p>
            <p>{{ mins > 9 ? mins : `0${mins}` }}</p>
            <p class="tip">:</p>
            <p>{{ seconds > 9 ? seconds : `0${seconds}` }}</p>
          </div>
        </dd>
        <dd>
          <span class="new-info-label">{{ marketingActivityId ? '秒杀价格' : '服务价格' }}</span>
          <div class="new-price" v-if="combinationCommodityActivity">
            {{ newProductInfo.currency }}
            <span class="new-num">{{ singlePurchasePrice || 0 }}</span>
          </div>
          <div class="new-price" v-else>
            {{ newProductInfo.currency }}
            <span class="new-num">{{ servicePriceSum || 0 }}</span>
          </div>
        </dd>
        <dd class="new-product-num">
          <span class="new-info-label">购买数量</span>
          <div class="new-change-num">
            <button @click="minus()" :class="num == 1 ? 'new-minus' : ''">-</button>
            <input type="text" v-model="num" disabled />
            <button class="new-add" @click="add()">+</button>
          </div>
        </dd>
      </dl>
      <div class="new-buy" v-if="marketingActivityId">
        <button
          :class="['new-buy-now', activityEnd || [4, 5].indexOf(activityStatus) < 0 ? 'btnDisable' : '']"
          style="
            width: 200px;
            height: 39px;
            background: linear-gradient(180deg, #ff9c9f 0%, #ff262b 100%);
            border-radius: 6px;
          "
          @click="buyNow()"
        >
          {{ activityStatusTex }}
        </button>
      </div>
      <div class="new-buy" v-else>
        <button class="new-add-car" @click="buyNow('addCart')" v-if="$route.query.serviceType != 'EPR'">
          加入购物车
        </button>
        <button class="new-buy-now" @click="buyNow()">立即购买</button>
      </div>
    </div>
    <div class="new-service-details">
      <p class="new-title">服务详情</p>
      <img :src="newProductInfo.productDetailsPc" alt="" style="width: 100%" />
    </div>
    <userAgreement29
      @changeState="changeStates"
      v-if="showAgreement && enterpriseId == 29"
      :agreementType="agreementType"
    ></userAgreement29>
    <userAgreement40
      @changeState="changeStates"
      v-if="showAgreement && enterpriseId == 40"
      :agreementType="agreementType"
    ></userAgreement40>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import userAgreement29 from './../sureOrder/components/userAgreement29.vue';
import userAgreement40 from './../sureOrder/components/userAgreement40.vue';
import {
  newProductInfoDetail,
  channelProductInfoDetail,
  addToCart,
  totalShoppingCart,
  getProductSpecsByAttribute,
  getProductSpecsByAttributeMarketing,
  marketingActivityProductDetail,
} from '../api/product/index';
import componentsMixin from '../mixin/componentsMixin';
import { cloneDeep, sortBy } from 'lodash';
import moment from 'moment';
export default {
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  mixins: [componentsMixin],
  data() {
    return {
      newProductInfo: {},
      num: 1,
      buyLimit: this.$route.query.buyLimit || -1,
      currentSpesc: '',
      productId: this.$route.query.id,
      marketingActivityId: this.$route.query.marketingActivityId,
      productSkuId: '',
      attributeGroup: [], //属性分组
      specificationsGroup: [], //规格分组
      additionalSpec: [],
      additionQuantityPrice: 0, //附加规格数量价
      additionLadderPrice: 0, //附加规格阶梯价
      additionalSpecVeri: false,
      showAdditional: false,
      isPackageSelected: 2,
      servicePrice: 0,
      pageFrom: this.$route.query.pagefrom || 'index',
      fullAttributes: true, //属性是否选哲完整
      catStust: false,
      status618: this.$route.query.status || false,
      combinationCommodityActivity: false, //做活动的组合商品
      activityEnd: true,
      hours: '',
      mins: '',
      seconds: '',
      timer: '',
      start: '',
      end: '',
      activityStatusTex: '', //活动状态文案
      activityStatus: '',
      activityType: this.$route.query.activityType,
      enterpriseId: '',
      agreementType: '',
      showAgreement: false, // 是否展示服务条款
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.enterpriseId = localStorage.getItem('objInfo') && JSON.parse(localStorage.getItem('objInfo')).enterpriseId;
        this.init();
      },
    },
    additionalSpec: {
      //计算附加规格总价
      handler(newName) {
        if (this.newProductInfo.displayMethod == 'ATTR') return false;
        this.additionalSpecVeri = false;
        let additionArr = [];
        newName.forEach((addition) => {
          addition.additionalSpecCurr.forEach((item) => {
            if (item.type && item.num) {
              additionArr.push(this.floatMultiply(item.num, item.price || 0));
            } else {
              this.additionalSpecVeri = true;
            }
          });
        });
        this.additionQuantityPrice = this.countSum(additionArr);
      },
      deep: true,
    },
  },
  components: {
    userAgreement29,
    userAgreement40,
  },
  computed: {
    servicePriceSum() {
      this.calculateTieredPricing();
      let servicePrice = this.countSum([this.servicePrice, this.additionQuantityPrice, this.additionLadderPrice]);
      if (servicePrice == 0) {
        servicePrice = this.basePriceHanle(this.newProductInfo, 'servicePrice');
      }
      if (this.type == 'channel') {
        if (this.newProductInfo.isCombinationProduct == 'IS_COMBINATION_PRODUCT') {
          servicePrice = this.newProductInfo.servicePrice;
        }
      }
      return this.floatMultiply(this.num, servicePrice || 0);
    },
    singlePurchasePrice() {
      return this.floatMultiply(this.num, this.newProductInfo.flashPrice || 0);
    },
    // 全局是否登录
    iflogin() {
      return this.$store.state.login.isLogin;
    },
  },
  created() {
    this.enterpriseId = localStorage.getItem('objInfo') && JSON.parse(localStorage.getItem('objInfo')).enterpriseId;
  },

  methods: {
    //用户协议
    changeStates(val) {
      this.showAgreement = val;
    },
    //最低价处理
    basePriceHanle(item, price) {
      if (item.productSpecsDTOList) {
        let requiredPrice = [];
        let allPrice = [];
        if (item.productInfoDTOList && item.productInfoDTOList.length) {
          item.productInfoDTOList.forEach((goods) => {
            goods.productSpecsDTOList.forEach((spec) => {
              allPrice.push(spec[price]);
              if (spec.isRequired == 'IS_REQUIRED') {
                requiredPrice.push(spec[price]);
              }
            });
          });
        } else {
          item.productSpecsDTOList.forEach((spec) => {
            allPrice.push(spec[price]);
            if (spec.isRequired == 'IS_REQUIRED') {
              requiredPrice.push(spec[price]);
            }
          });
        }
        if (requiredPrice.length) {
          return this.countSum(requiredPrice);
        } else {
          return allPrice.sort((a, b) => {
            return a - b;
          })[0];
        }
      }
    },
    //获取商品详情
    init() {
      if (this.$route.query.id !== undefined) {
        this.productId = this.$route.query.id;
      }
      if (this.$route.query.marketingActivityId !== undefined) {
        this.marketingActivityId = this.$route.query.marketingActivityId;
      } else {
        this.marketingActivityId = '';
      }
      this.activityType = this.$route.query.activityType;
      //活动商品
      if (this.activityType) {
        marketingActivityProductDetail({
          enterpriseId: localStorage.enterpriseid || JSON.parse(localStorage.getItem('objInfo')).enterpriseid,
          marketingActivityId: this.marketingActivityId,
          productInfoId: this.productId,
        }).then((res) => {
          this.productDataInit(res);
          if (res.data.isCombinationProduct == 'IS_COMBINATION_PRODUCT') {
            this.combinationCommodityActivity = true;
          }
          this.isStart();
          this.getStatus(this.$route.query.status);
        });
      } else {
        (this.enterpriseId == 42
          ? channelProductInfoDetail(this.productId)
          : newProductInfoDetail(this.productId || localStorage.productId)
        ).then((res) => {
          // 跨标云 卖家成长客户端的专利购买，要跳到辰智云详情页，如果跳过来的productid查询为空，就跳到辰智云官网产品服务
          if (!res.data.id && this.$route.query.target === 'czy') {
            let wgUrl = this.wgUrl;
            wgUrl = wgUrl.replace('client/', 'productservice');

            this.$Message.info('无对应id产品，将跳转到产品服务页面');
            setTimeout(() => {
              window.location.href = wgUrl;
            }, 3000);
          } else {
            this.productDataInit(res);
          }
        });
      }
    },
    //初始化商品数据
    productDataInit(res) {
      this.servicePrice = 0;
      this.num = 1;
      // //套装
      // if (res.data.productCombinationSpecsDTOList.length) {
      //   res.data.productCombinationSpecsDTOList.forEach((item) => {
      //     this.$set(item, 'check', false);
      //   });
      // }
      //组合商品
      if (res.data.isCombinationProduct == 'IS_COMBINATION_PRODUCT') {
        res.data.productInfoDTOList.forEach((goods) => {
          goods.productSpecsDTOList.forEach((item) => {
            if (this.marketingActivityId) item.servicePrice = item.flashPrice;
            if (item.isRequired == 'true' || item.isRequired == 'IS_REQUIRED') {
              this.$set(item, 'check', true);
            } else {
              this.$set(item, 'check', false);
            }
          });
        });
      } else {
        //单商品
        res.data.productSpecsDTOList.forEach((item) => {
          if (this.marketingActivityId) item.servicePrice = item.flashPrice;
          //多选必买的规格
          if (item.isRequired == 'true' || item.isRequired == 'IS_REQUIRED') {
            this.$set(item, 'check', true);
          } else {
            this.$set(item, 'check', false);
          }
        });
      }
      this.newProductInfo = res.data;
      //属性展示
      if (this.newProductInfo.displayMethod == 'ATTR' || res.data.isCombinationProduct == 'NOT_COMBINATION_PRODUCT') {
        this.handleProductAttr(this.newProductInfo.productInfoAttributeRelationDTOList);
      }
      //商品规格处理
      if (res.data.isCombinationProduct == 'IS_COMBINATION_PRODUCT') {
        this.newProductInfo.productInfoDTOList.forEach((goods) => {
          this.handleProductSpecs(goods);
        });
      } else {
        // this.handleProductSpecs(this.newProductInfo, this.newProductInfo.productInfoAttributeRelationDTOList);
      }
      console.log(this.newProductInfo, 'this.newProductInfo');
      //初始化计算价格可能商品有默认必选
      this.calculateServicePrice();
      this.initAdditionaliHandler();
    },
    //组合商品规格处理
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
              productCategory: item.productCategoryName,
              productSpecsDTOList: goods.productSpecsDTOList.filter(
                (specs) => specs.productCategoryId == item.productCategoryId
              ),
            });
          }
        } else {
          specsGroup.push({
            productCode: item.productCategoryId,
            productCategory: item.productCategoryName,
            productSpecsDTOList: goods.productSpecsDTOList.filter(
              (specs) => specs.productCategoryId == item.productCategoryId
            ),
          });
        }
      });
      specsGroup.forEach((attr) => {
        //如果没有必选默认选中第一个规格(价格最低)
        let specsSelectedLen = attr.productSpecsDTOList.filter((item) => item.check).length;
        if (!specsSelectedLen) {
          attr.productSpecsDTOList = sortBy(attr.productSpecsDTOList, 'servicePrice');
          attr.productSpecsDTOList[0].check = true;
        }
      });
      this.$set(goods, 'specsGroup', specsGroup);
    },
    //阶梯计价
    calculateTieredPricing() {
      if (this.newProductInfo.isCombinationProduct) {
        let priceArr = [];
        if (this.newProductInfo.isCombinationProduct == 'NOT_COMBINATION_PRODUCT') {
          this.newProductInfo.productSpecsDTOList.forEach((item) => {
            if (item.check && item.additionSpecId && item.additionSpecDTO.calcType == 'LADDER') {
              let sPrice = item.servicePrice;
              if (!this.marketingActivityId) {
                //活动不按阶梯计算
                item.additionSpecDTO.specDetailDTOList.forEach((ladder) => {
                  if (this.num >= ladder.specQuantityMin && this.num <= ladder.specQuantityMax) {
                    sPrice = ladder.specUnitPrice;
                  }
                });
              }
              priceArr.push(sPrice);
            }
          });
        } else {
          this.newProductInfo.productInfoDTOList.forEach((product) => {
            product.productSpecsDTOList.forEach((item) => {
              if (item.check && item.additionSpecId && item.additionSpecDTO.calcType == 'LADDER') {
                let sPrice = item.servicePrice;
                if (!this.marketingActivityId) {
                  //活动不按阶梯计算
                  item.additionSpecDTO.specDetailDTOList.forEach((ladder) => {
                    if (this.num >= ladder.specQuantityMin && this.num <= ladder.specQuantityMax) {
                      sPrice = ladder.specUnitPrice;
                    }
                  });
                }
                priceArr.push(sPrice);
              }
            });
          });
        }
        this.additionLadderPrice = this.countSum(priceArr);
      }
    },
    //计算服务价格
    calculateServicePrice() {
      let priceArr = [];
      if (this.newProductInfo.isCombinationProduct == 'NOT_COMBINATION_PRODUCT') {
        this.newProductInfo.productSpecsDTOList.forEach((item) => {
          if (item.check) {
            if (item.additionSpecId) {
              if (item.additionSpecDTO.calcType == 'QUANTITY') {
                priceArr.push(item.servicePrice);
              }
            } else {
              priceArr.push(item.servicePrice);
            }
          }
        });
      } else {
        this.newProductInfo.productInfoDTOList.forEach((product) => {
          product.productSpecsDTOList.forEach((item) => {
            if (item.check) {
              if (item.additionSpecId) {
                if (item.additionSpecDTO.calcType == 'QUANTITY') {
                  priceArr.push(item.servicePrice);
                }
              } else {
                priceArr.push(item.servicePrice);
              }
            }
          });
        });
      }
      this.servicePrice = this.countSum(priceArr);
      this.calculateTieredPricing();
    },
    //套装和单买
    packageSelected(type) {
      this.isPackageSelected = type;
      if (type == 1) {
        this.servicePrice = this.newProductInfo.productCombinationSpecsDTOList[0].servicePrice;
      } else {
        this.calculateServicePrice();
      }
    },
    //选择附加规格类型
    additionSpecTypeChange(id, specCurr, specDetailDTOList) {
      specDetailDTOList.forEach((item) => {
        if (item.id == id) {
          specCurr.price = item.specUnitPrice;
          specCurr.specName = item.specName;
        }
      });
    },
    //初始化附加规格
    initAdditionaliHandler() {
      this.additionalSpec = [];
      //组合商品
      if (this.newProductInfo.isCombinationProduct == 'IS_COMBINATION_PRODUCT') {
        this.newProductInfo.productInfoDTOList.forEach((product) => {
          this.initAdditionali(product.productSpecsDTOList);
        });
      } else {
        //单商品
        this.initAdditionali(this.newProductInfo.productSpecsDTOList);
      }
    },
    //初始化附加规格
    initAdditionali(productSpecsDTOList) {
      productSpecsDTOList.forEach((item) => {
        if (item.additionSpecId && item.check && item.additionSpecDTO.calcType == 'QUANTITY') {
          let itemHD = JSON.parse(JSON.stringify(item));
          this.$set(itemHD, 'additionalSpecCurr', [{ type: '', num: 1, price: 0 }]);
          this.additionalSpec.push(itemHD);
        }
      });
    },
    //附加服务新增一行
    servicesAdd(additionalSpecCurr) {
      additionalSpecCurr.push({ type: '', num: 1, price: 0 });
    },
    //附加服务删除一行
    servicesDel(additionalSpecCurr, index) {
      additionalSpecCurr.splice(index, 1);
      let isShow = false;
      this.additionalSpec.forEach((item) => {
        if (item.additionalSpecCurr.length) {
          isShow = true;
        }
      });
      this.showAdditional = isShow;
    },
    //添加附加规格
    addAdditionalServices() {
      this.showAdditional = true;
      this.additionalSpec.forEach((item) => {
        item.additionalSpecCurr = [{ type: '', num: 1, price: 0 }];
      });
    },
    //选择规格
    specsSelected(productSpecsDTOList, key) {
      if (this.isPackageSelected == 1) return false;
      productSpecsDTOList.forEach((item) => {
        if (!(item.isRequired == 'true' || item.isRequired == 'IS_REQUIRED')) {
          if (this.newProductInfo.selector == 'SIMPLE_SELECT') {
            if (item.id == key) {
              item.check = !item.check;
            } else {
              item.check = false;
            }
          } else {
            if (item.id == key) {
              item.check = !item.check;
            }
          }
        }
      });
      this.initAdditionaliHandler();
      this.calculateServicePrice();
    },
    //选择属性
    attributeSelected(productAttributeList, key) {
      productAttributeList.forEach((item) => {
        if (item.value == key) {
          item.check = !item.check;
        } else {
          item.check = false;
        }
      });

      let attrIdArrAll = [];
      this.fullAttributes = true;
      this.attributeGroup.forEach((item) => {
        let attrIdArr = [];
        item.records.forEach((record) => {
          record.productAttributeList.forEach((attr) => {
            if (attr.check) {
              attrIdArr.push(attr.productAttributeId);
            }
          });
        });
        //选择完整的属性才查规格
        if (attrIdArr.length == item.records.length) {
          attrIdArrAll.push(...attrIdArr);
        } else if (attrIdArr.length) {
          this.fullAttributes = false;
        }
      });

      if (attrIdArrAll.length) {
        if (this.marketingActivityId) {
          getProductSpecsByAttributeMarketing({
            productAttributeIdList: attrIdArrAll,
            productInfoId: this.productId,
            activityId: this.marketingActivityId,
            type: 'SECOND_KILL',
          }).then((res) => {
            this.getAttributePrice(res);
          });
        } else {
          getProductSpecsByAttribute({
            productAttributeIdList: attrIdArrAll,
            productInfoId: this.productId,
          }).then((res) => {
            this.getAttributePrice(res);
          });
        }
      } else {
        this.servicePrice = 0;
        this.newProductInfo.productSpecsDTOList.forEach((spec) => {
          spec.check = false;
        });
      }
    },
    //获取属性展示价格
    getAttributePrice(res) {
      let priceArr = [];
      this.newProductInfo.productSpecsDTOList.forEach((spec) => {
        spec.check = false;
        res.data.forEach((item) => {
          if (item.id == spec.id) {
            spec.check = true;
            if (this.marketingActivityId) {
              priceArr.push(spec.flashPrice);
            } else {
              priceArr.push(spec.servicePrice);
            }
          }
        });
      });
      this.servicePrice = this.countSum(priceArr);
    },
    //购买数量减
    minus() {
      if (this.num > 1) {
        this.num--;
      }
    },
    //购买数量加
    add() {
      if (this.buyLimit == -1 || this.num < this.buyLimit) {
        this.num++;
      } else if (this.num === Number(this.buyLimit)) {
        this.$Message.info('温馨提示：您最多可购买' + this.buyLimit + '个商品');
      }
    },
    //加入购物车
    addCart() {
      if (!this.currentSpesc) {
        this.$Message.info('请选择商品规格');
        return;
      }
      addToCart({
        count: this.num,
        productId: this.productId,
        productSkuId: this.currentSpesc.id,
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
    //选中的附加规格处理
    productSpecsHandle(specList) {
      specList.forEach((spec) => {
        this.additionalSpec.forEach((addSpec) => {
          if (addSpec.id == spec.id) {
            spec.additionalSpecCurr = addSpec.additionalSpecCurr;
          }
        });
      });
    },
    //立即购买,加入购物车
    buyNow(type) {
      // 跨标云 卖家成长客户端，在专利产品的购买详情页时，点击购买，跳到外观专利的购买详情去
      let pla = process.env.NODE_PLA;
      let patentProids = ['1600311229671739393', '1600312091223724033', '1600312062102671362'];

      let crossSessionId = Cookies.get('sessionId');
      if (pla === 'kby' && patentProids.includes(this.productId)) {
        window.location.href =
          this.wgUrl +
          'productDetail?id=' +
          this.productId +
          '&pagefrom=pro&target=czy' +
          '&crossSessionId=' +
          crossSessionId;
        return false;
      }

      // 非立即购买以及新用户专享状态活动商品不能提交购买
      if (this.marketingActivityId && [4, 5].indexOf(this.activityStatus) < 0) {
        return false;
      }
      let newProductInfoHD = cloneDeep(this.newProductInfo); //JSON.parse(JSON.stringify(this.newProductInfo));
      newProductInfoHD.productInfoAttributeRelationDTOList = [];
      let isSpecSelected = true;
      let singleGoodsSelected = false; //单商品每组分类规格必须选一个
      let isAdditionSpecSelected = false;
      if (this.marketingActivityId) {
        //活动组合商品默认全部选中
        if (newProductInfoHD.productInfoDTOList.length) {
          newProductInfoHD.productInfoDTOList.forEach((itemSub) => {
            itemSub.productSpecsDTOList.forEach((sub) => (sub.check = true));
          });
        }
      }
      //组合商品
      if (newProductInfoHD.productInfoDTOList.length) {
        newProductInfoHD.productInfoDTOList.forEach((itemSub) => {
          itemSub.productSpecsDTOList = itemSub.productSpecsDTOList.filter((sub) => {
            return sub.check;
          });
          if (itemSub.productSpecsDTOList.length) {
            isSpecSelected = false;
          }
          itemSub.specsGroup.forEach((category) => {
            let specLen = category.productSpecsDTOList.filter((sub) => {
              return sub.check;
            });
            if (!specLen.length) {
              singleGoodsSelected = true;
            }
          });
        });
        newProductInfoHD.productInfoDTOList.forEach((itemSub) => {
          this.productSpecsHandle(itemSub.productSpecsDTOList);
        });
      } else {
        //单商品
        newProductInfoHD.productSpecsDTOList = newProductInfoHD.productSpecsDTOList.filter((sub) => {
          return sub.check;
        });
        if (newProductInfoHD.productSpecsDTOList.length) {
          isSpecSelected = false;
        }
        this.attributeGroup.forEach((category) => {
          let specLen = category.productSpecsDTOList.filter((sub) => {
            return sub.check;
          });
          if (!specLen.length) {
            singleGoodsSelected = true;
          }
        });
        this.productSpecsHandle(newProductInfoHD.productSpecsDTOList);
      }
      newProductInfoHD.servicePriceSum = this.servicePriceSum;
      newProductInfoHD.quantity = this.num;
      newProductInfoHD.packageSelected = this.isPackageSelected;
      newProductInfoHD.marketingActivityId = this.marketingActivityId;
      newProductInfoHD.eprServiceId = this.$route.query.serviceId;
      if (this.marketingActivityId && newProductInfoHD.productInfoDTOList.length) {
        newProductInfoHD.servicePriceSum = this.singlePurchasePrice;
      }
      //套装不验证
      if (this.isPackageSelected != 1) {
        if (this.additionalSpec.length && this.showAdditional) {
          this.additionalSpec.forEach((item) => {
            item.additionalSpecCurr.forEach((addSpec) => {
              if (!addSpec.type || !addSpec.num) {
                isAdditionSpecSelected = true;
              }
            });
          });
        }
        if (isSpecSelected || isAdditionSpecSelected) {
          return this.$Message.info('请先选择规格!');
        }
        if (singleGoodsSelected) {
          return this.$Message.info('每组规格必须选择一个!');
        }
        if (!this.fullAttributes && this.newProductInfo.displayMethod == 'ATTR') {
          return this.$Message.info('请先选择完整商品属性!');
        }
      }
      if (type == 'addCart') {
        let paramsHandle = {
          groupStatus: false,
          groupProducts: [],
          quantity: this.num,
          productId: this.productId,
          productSpecs: [],
          ...(this.enterpriseId == 42 ? { orderSource: 'CS' } : {}),
        };
        if (newProductInfoHD.isCombinationProduct == 'IS_COMBINATION_PRODUCT') {
          paramsHandle.groupStatus = true;
          newProductInfoHD.productInfoDTOList.forEach((goods) => {
            let goodsObj = {
              quantity: this.num,
              productId: goods.id,
              productSpecs: [],
            };
            this.specsHanler(goods.productSpecsDTOList, goodsObj);
            if (goodsObj.productSpecs.length) {
              paramsHandle.groupProducts.push(goodsObj);
            }
          });
        } else {
          this.specsHanler(newProductInfoHD.productSpecsDTOList, paramsHandle);
        }
        addToCart(paramsHandle).then((res) => {
          if (res.code === 0) {
            this.$Message.success('已加入购物车');
            totalShoppingCart().then((res) => {
              this.$store.commit('saveCarNumStatue', res.data);
            });
          } else {
            this.$Message.error('加入购车车失败');
          }
        });
      } else {
        localStorage.setItem('selectedList', JSON.stringify(newProductInfoHD));
        if (this.iflogin) {
          this.goNextRouter();
        } else {
          // 未登录状态，标记proid,去登录页面跳回时，继续购买
          localStorage.setItem('productDeailId', location.search.split('=')[1] || '');
          let pageParams = {
            catStust: this.catStust,
            id: this.productId,
            from: 'buyNow',
            count: this.num,
            type: this.getProductType(),
            pageFrom: this.pageFrom,
          };
          localStorage.setItem('pageParams', JSON.stringify(pageParams));
          this.$router.push({ path: `/login` });
        }
      }
    },
    goNextRouter() {
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
      // }
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
    //规格参数处理
    specsHanler(productSpecsDTOList, itemObj) {
      productSpecsDTOList.forEach((spec) => {
        let additionHD = {
          productSpecId: spec.id,
        };
        // console.log(spec, 'spec');
        if (spec.additionalSpecCurr && spec.additionalSpecCurr[0] && spec.additionalSpecCurr[0].type) {
          additionHD.productAdditionSpecs = {
            productAdditionSpecId: spec.additionSpecDTO.id,
            productAdditionSpecCalcType: spec.additionSpecDTO.calcType,
            productAdditionSpecDetail:
              spec.additionalSpecCurr &&
              spec.additionalSpecCurr.map((item) => {
                return {
                  productAdditionSpecQuantity: item.num,
                  productAdditionSpecDetailId: item.type,
                };
              }),
          };
        } else if (spec.additionSpecId && spec.additionSpecDTO.calcType == 'LADDER') {
          additionHD.productAdditionSpecs = {
            productAdditionSpecId: spec.additionSpecDTO.id,
            productAdditionSpecCalcType: spec.additionSpecDTO.calcType,
          };
        }
        itemObj.productSpecs.push(additionHD);
      });
    },
    //处理属性组
    handleProductAttr(productInfoAttributeRelationDTOList) {
      this.attributeGroup = [];
      //第一层
      productInfoAttributeRelationDTOList.forEach((item) => {
        if (this.attributeGroup.length) {
          let isAdd = true;
          this.attributeGroup.forEach((attr) => {
            if (attr.productCode == item.subProductCategoryId) {
              isAdd = false;
            }
          });
          if (isAdd) {
            this.attributeGroup.push({
              productCode: item.subProductCategoryId,
              productCategory: `${item.productCategoryName}/${item.subProductCategoryName}`,
              records: [],
              productSpecsDTOList: this.newProductInfo.productSpecsDTOList.filter(
                (specs) => specs.productCategoryId == item.subProductCategoryId
              ),
              requiredAttributesName: [],
            });
          }
        } else {
          this.attributeGroup.push({
            productCode: item.subProductCategoryId,
            productCategory: `${item.productCategoryName}/${item.subProductCategoryName}`,
            records: [],
            productSpecsDTOList: this.newProductInfo.productSpecsDTOList.filter(
              (specs) => specs.productCategoryId == item.subProductCategoryId
            ),
            requiredAttributesName: [],
          });
        }
      });
      this.attributeGroup.forEach((attr) => {
        //如果没有必选默认选中第一个规格(价格最低)
        let specsSelectedLen = attr.productSpecsDTOList.filter((item) => item.check).length;
        if (!specsSelectedLen) {
          attr.productSpecsDTOList = sortBy(attr.productSpecsDTOList, 'servicePrice');
          attr.productSpecsDTOList[0].check = true;
        }
        attr.productSpecsDTOList.forEach((item) => {
          if (item.check) {
            let specNameArr = item.specsName.split('_').map((str) => str.replace(/(^\s*)|(\s*$)/g, ''));
            attr.requiredAttributesName.push(...specNameArr);
          }
        });
      });
      this.attributeGroup.forEach((attr) => {
        productInfoAttributeRelationDTOList.forEach((itemProps) => {
          let item = cloneDeep(itemProps);
          item.label = item.attributeName;
          item.value = item.productAttributeId;
          //attr.requiredAttributesName.includes(item.label)
          this.$set(item, 'check', attr.requiredAttributesName.includes(item.label));
          if (item.subProductCategoryId == attr.productCode) {
            if (attr.records.length) {
              let isAdd = true;
              attr.records.forEach((record) => {
                if (record.attributeTypeId == item.attributeTypeId) {
                  record.productAttributeList.push(item);
                  isAdd = false;
                }
              });
              if (isAdd) {
                item.productAttributeList = [cloneDeep(item)];
                attr.records.push(item);
              }
            } else {
              item.productAttributeList = [cloneDeep(item)];
              attr.records.push(item);
            }
          }
        });
        attr.records = sortBy(attr.records, 'sort');
      });
      console.log(this.attributeGroup, 'this.attributeGroup');
    },
    //活动记时
    getStatus(status) {
      this.activityStatusTex = '';
      let statusText = '';
      console.log(status, 'status');
      switch (status.toString()) {
        case '1':
          statusText = '未开始';

          break;
        case '2':
          statusText = '已结束';

          break;
        case '3':
          statusText = '已售罄';

          break;
        case '4':
          statusText = '立即抢购';

          break;
        case '5':
          statusText = '新用户专享';

          break;
      }
      this.activityStatusTex = statusText;
      this.activityStatus = Number(status);
    },
    isStart() {
      this.getInterval();
    },
    getInterval() {
      let that = this;
      let timer = setInterval(() => {
        let timeTem = new Date().getTime();
        let startTimeTem = new Date(this.$route.query.startTime).getTime();
        let endTmp = '';
        // 距离开始或结束
        if (timeTem < startTimeTem) {
          this.isBefor = true;
          endTmp = this.$route.query.startTime;
        } else {
          this.isBefor = false;
          endTmp = this.$route.query.endTime;
          // 未开始进入，但时间到了已开始了，更改为已开始
          if (this.$route.query.activityStatus == '1' && this.activityType != 1) {
            this.getStatus('4');
          }
        }
        let start = moment(new Date()); //获取开始时间
        let end = moment(new Date(endTmp)); //结束时间
        let diff = end.diff(start); //时间差
        this.hours = moment.duration(diff).days() * 24 + moment.duration(diff).hours();
        this.mins = moment.duration(diff).minutes();
        this.seconds = moment.duration(diff).seconds();
        if (this.hours <= 0 && this.mins <= 0 && this.seconds <= 0) {
          if (!this.isBefor) {
            this.activityEnd = true;
            clearInterval(this.timer);
            if (this.activityType != 1) {
              that.getStatus('2');
            }
          }
        } else {
          this.activityEnd = false;
        }
        this.timer = timer;
      }, 1000);
    },
  },
};
</script>
<style lang="less" scoped>
.new-product-intro {
  width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04), 0px -1px 8px 0px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.new-product-img {
  width: 350px;
  height: 328px;
  float: left;
}

.new-product-info {
  margin-left: 365px;

  > dt {
    font-size: 26px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-bottom: 20px;
    padding-left: 12px;
  }

  > dd {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .new-info-label {
    font-size: 14px;
    color: #333333;
    padding-left: 12px;
    min-width: 105px;
    flex-basis: 105px;
    padding-right: 5px;
  }

  .new-info-specLabel {
    margin-bottom: 10px;
  }

  .new-service-info {
    margin-top: 6px;
    background-color: #eff9ff;
    padding: 10px 12px;
    font-size: 12px;
    font-family: PingFangSC;
    color: #666666;
    display: block;

    p {
      font-size: 14px;
      color: #333333;
      margin-bottom: 2px;
    }

    span {
      margin-top: 8px;
      display: inline-block;
      margin-right: 20px;
    }
  }

  .new-product-num {
    padding-bottom: 16px;
    border-bottom: 1px dashed #999;

    button {
      width: 26px;
      height: 26px;
      border: 1px solid #dddddd;
      background-color: #fff;
      cursor: pointer;
    }

    input {
      width: 60px;
      height: 26px;
      border: 1px solid #dddddd;
      background-color: #fff;
      text-align: center;
      margin-left: -4px;
    }

    .new-add {
      margin-left: -5px;
    }

    .new-minus {
      background: #f8f8f8;
      color: #ccc;
    }
  }

  .new-price {
    font-size: 18px;
    color: #ff6600;
  }

  .new-num {
    font-size: 24px;
  }

  .new-type-label {
    padding: 5px 10px;

    border-radius: 2px;
    border: 1px solid #dddddd;
    display: inline-block;
    font-size: 14px;
    margin-right: 8px;
    color: #666;
    margin-bottom: 10px;
    position: relative;
    cursor: pointer;
  }
  .new-user-agreement {
    border: none;
    padding: 5px 0;
    color: #00a3ff;
  }
  .new-active {
    color: #00a3ff;
    border-color: #00a3ff;

    &::after {
      content: '';
      display: inline-block;
      width: 18px;
      height: 18px;
      background: url('https://file.itaxs.com/dev/productcenter/20221024/84d71e78566a4deaada1023a60ab154d.svg')
        no-repeat;
      right: 0;
      bottom: 0;
      position: absolute;
    }
  }
}

.new-buy {
  margin-top: 16px;
  margin-left: 365px;
}

.new-add-car {
  width: 108px;
  height: 34px;
  background: #edf8fc;
  border: 1px solid #00a3ff;
  border-radius: 2px;
  color: #00a3ff;
  font-size: 16px;
  margin-right: 15px;
  cursor: pointer;
}

.new-buy-now {
  width: 108px;
  height: 34px;
  background: #00a3ff;
  border-radius: 2px;
  color: #ffffff;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.new-service-details {
  width: 100%;
  margin-top: 20px;
  background: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.04), 0px -1px 8px 0px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 44px;

  .new-title {
    font-size: 18px;
    font-family: PingFangSC;
    color: #00a3ff;
    text-align: center;
    margin-bottom: 24px;
  }
}

//商品属性组
.product-attribute-group {
  display: block !important;
  margin-bottom: 0px !important;
  // width: 495px;
  .product-category-title {
    font-size: 14px;
    margin-bottom: 10px;
    margin-left: 12px;
    font-weight: bold;
    color: #333;
  }

  .product-attribute-list {
    display: flex;
    align-items: top;

    .new-info-label {
      margin-bottom: 10px;
      margin-top: 6px;
    }
  }
}

.combination-product-list {
  border-bottom: 1px dashed #ddd;
  margin-bottom: 10px !important;
}

.add-additional-services {
  width: 495px;
  border: 1px dashed #eee;
  padding: 8px;
  color: #00a3ff;
  display: block !important;
  text-align: center;
  cursor: pointer;
}

.additional-services-dl {
  width: 100%;

  dt {
    background-color: #eff9ff;
    padding: 10px 0;
  }

  dd,
  dt {
    margin: 5px 0;
    display: flex;
    align-items: center;

    > div {
      min-width: 135px;
      padding-left: 12px;
    }
    .additional-services-select {
      width: 200px;
      .ivu-select {
        width: 160px;
      }
    }
  }

  .additional-services-handle {
    span {
      color: #00a3ff;
      cursor: pointer;
      margin-right: 10px;
    }
  }
}

//套装购买
.product-package-purchase {
  .new-info-label {
    margin-bottom: 10px;
  }
}

//单买价
.single-purchase-price {
  margin-left: 10px;
  text-decoration: line-through;

  span {
    color: red;
  }
}

//活动记时
.seckill {
  width: 480px;
  height: 40px;
  background: linear-gradient(90deg, #ff585c 0%, #ff262b 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    p {
      margin-bottom: 0;
    }
  }
  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .left {
    width: 160px;
    // background: rgb(107, 184, 45);
    img {
      width: 19px;
      height: 19px;
      margin: 0 12px 0 30px;
    }
  }
  .right {
    width: 300px;
    height: 100%;
    // background: rgb(25, 124, 119);
    margin-right: 30px;
    div {
      margin-right: 11px;
    }
    p {
      width: 18px;
      height: 18px;
      font-size: 12px;
      // background: rgb(204, 21, 21);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 4px;
      background: #ff595d;
      margin-bottom: 0;
    }
    .tip {
      width: 4px;
      background: none;
    }
  }
}
.btnDisable {
  background: linear-gradient(0deg, #757574 0%, #cfcece 100%) !important;
  cursor: no-drop;
}
.user-agreement {
  color: #00a3ff;
  cursor: pointer;
}

//其它主题色
.orange-icon,
.includeServiceOrange {
  display: none;
}
.OrangeTheme {
  .blue-icon,
  .includeService {
    display: none;
  }
  .orange-icon,
  .includeServiceOrange {
    display: inline-block;
  }
  .new-service-details .new-title,
  .additional-services-dl .additional-services-handle span,
  .add-additional-services {
    color: #f6b417;
  }
  .new-product-info .new-active {
    color: #f7b416;
    border-color: #f7b416;
    &::after {
      background: url('./../images/orangeTheme/check.svg') no-repeat;
    }
  }
  .new-add-car {
    background: #fff;
    border: 1px solid #f7b416;
    color: #f7b416;
  }
  .new-buy-now {
    background: #f7b416;
  }
  .new-service-info {
    background-color: #fef9ef;
  }
}
.purchaseInstructions-label {
  font-weight: bold;
}
.purchaseInstructions {
  font-size: 14px;
  color: #333;
  img {
    width: 16px;
    margin-right: 5px;
    vertical-align: middle;
    position: relative;
    top: -2px;
  }
}
</style>
