<!-- pc index page orderlist card coomponents -->
<template>
  <div class="serviceItem" :class="{ notShelves: info.status === 2 }">
    <div class="left">
      <img :src="info.productImagePc" @click.stop="toShoppingDetail(info)" alt="" width="100%" />
      <img class="zero-label" src="../../../assets/images/zeroLabel.png" alt="" v-if="info.activityType === 1" />
    </div>
    <div class="right">
      <div class="productName" @click.stop="toShoppingDetail(info)">
        {{ info.productName }}
      </div>
      <div class="flex-start" @click.stop="toShoppingDetail(info)">
        <div class="price">
          <span class="sign">{{ info.currency }}</span>
          <span v-if="type == 'channel'">{{ info.servicePrice }}</span>
          <span v-else>{{ basePriceHanle(info, 'servicePrice') }}</span>
          <span class="yuanprice">
            {{ basePriceHanle(info, 'originalPrice') }}
          </span>
        </div>
      </div>
      <div class="buy" v-if="activityStatus.showBuy">
        <button :disabled="info.status === 2" class="addCartBtn" @click.stop="add(info.productId)">
          <img src="../../../assets/images/addtocar.svg" class="menu-icon" />
        </button>
        <button type="primary" :disabled="info.status === 2" class="buyNowBtn" @click.stop="buyNow(info)">
          立即购买
        </button>
      </div>
      <div class="zero-show" v-else>{{ activityStatus.text }}</div>
    </div>
    <div v-if="enterpriseId == 42">
      <userAgreement @changeState="showUser = val" v-if="showUser" :functionCode="info.functionCode"></userAgreement>
    </div>
  </div>
</template>

<script>
import { addToCart, totalShoppingCart } from '../../../api/product/index';
import userAgreement from '@/views/common/userAgreement';
import { countSum } from '../../../utils/util';
import { cloneDeep, sortBy } from 'lodash';
export default {
  props: {
    info: {},
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showUser: false,
      enterpriseId: JSON.parse(localStorage.getItem('objInfo')).enterpriseId,
      // groupStatus: this.info.isCombinationProduct == 'IS_COMBINATION_PRODUCT',
    };
  },

  components: {
    userAgreement,
  },

  computed: {
    groupStatus() {
      return this.info.isCombinationProduct == 'IS_COMBINATION_PRODUCT';
    },
    activityStatus() {
      let obj = { showBuy: false };
      if (this.info.limit && this.info.empty) {
        obj.text = '已售罄';
      } else if (this.info.buy) {
        obj.text = '您已购买过';
      } else if (this.info.isBuyZero) {
        obj.text = '无购买0元商品资格';
      } else {
        obj.text = '新用户专享';
      }
      // 不是0元购活动商品、新用户没买过并且有库存
      if (this.info.activityType !== 1) {
        obj.showBuy = true;
      } else if (!this.info.oldUser && !this.info.buy && !this.info.empty && !this.info.isBuyZero) {
        obj.showBuy = true;
      }
      return obj;
    },

    useList() {
      const { productInfoDTOList, productSpecsDTOList } = this.info;
      this.info.currentList = this.groupStatus ? productInfoDTOList : productSpecsDTOList;
      return this.groupStatus
        ? productInfoDTOList
            .map((item) => item.productSpecsDTOList)
            .filter((item) => !!item)
            .flat()
        : productSpecsDTOList;
    },

    productData() {
      const { currentList, productName, productImageH5 } = this.info;
      let productPaymentMoney = 0;
      const list = currentList.map((pater) => {
        let { productSpecsDTOList, id: paterId } = pater;
        if (this.groupStatus) {
          const productSpecs = productSpecsDTOList.map((son) => {
            let { id, servicePrice: productSpecMoney, specsName: productSpecName } = son;
            productPaymentMoney = countSum([productPaymentMoney, productSpecMoney]);
            return { productSpecId: id, productSpecMoney, productSpecName };
          });
          return { quantity: 1, productId: paterId, productSpecs };
        } else {
          productPaymentMoney = countSum([productPaymentMoney, pater.servicePrice]);
          return { productSpecId: paterId, productSpecMoney: pater.servicePrice, productSpecName: pater.specsName };
        }
      });
      return {
        productId: this.info.id,
        quantity: 1,
        [this.groupStatus ? 'groupProducts' : 'productSpecs']: list,
        [this.groupStatus ? 'productSpecs' : 'groupProducts']: [],
        groupStatus: this.groupStatus,
        productName,
        productPaymentMoney,
        productImageH5,
        orderSource: this.enterpriseId == 42 ? 'CS' : 'PC',
      };
    },

    UseSets() {
      let useList = this.useList;
      let isDetailType =
        (useList && useList.findIndex((item) => item.isRequired == false || item.isRequired == 'NOT_REQUIRED') == -1) ||
        (useList && useList.length == 1);
      return {
        useList,
        isDetailType,
        productData: this.productData,
      };
    },
  },

  watch: {
    UseSets() {},
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
      // console.log('test');
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
        return countSum(priceAll);
      } else {
        let specsGroup = this.handleProductSpecs(productInfo).specsGroup;
        let priceAll = [];
        specsGroup.forEach((item) => {
          priceAll.push(...item[type]);
        });
        return countSum(priceAll);
      }
    },

    async add(id) {
      let { isDetailType } = this.UseSets;
      if (isDetailType) {
        let { code } = await addToCart(this.productData);
        if (code == 0) {
          if (this.$message) {
            this.$message.success('加入购物车成功');
          } else {
            this.$Message.success('加入购物车成功');
          }
          totalShoppingCart().then(({ data: quantity }) => this.$store.commit('saveCarNumStatue', quantity));
        }
      } else {
        this.$router.push({ path: '/serviceDetail', query: { id } });
      }
    },

    toShoppingDetail(info) {
      if (this.activityStatus.showBuy) this.$router.push({ path: '/serviceDetail', query: { id: info.productId } });
    },

    buyNow(data) {
      let { isDetailType } = this.UseSets;
      if (isDetailType) {
        let { quantity, productPaymentMoney: servicePriceSum } = this.productData;
        data[this.groupStatus ? 'productInfoDTOList' : 'productSpecsDTOList'].forEach((element) => {
          if (this.groupStatus) {
            element['productInfoDTOList'].forEach((element) => (element.check = true));
          } else {
            element.check = true;
          }
        });
        localStorage.setItem('selectedList', JSON.stringify([{ quantity, servicePriceSum, ...data }]));
        this.$router.push({
          path: '/sureOrder',
          query: {
            id: this.productId,
            from: 'buyNow',
            count: 1,
          },
        });
      } else {
        this.$router.push({ path: '/serviceDetail', query: { id: data.id } });
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import url(./index.less);
</style>
