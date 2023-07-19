<template>
  <el-drawer title="添加商品" size="80%" :visible.sync="dialogvisible">
    <div slot="title" class="drawer-title-wrapper">
      <div class="drawer-title">添加商品</div>
    </div>
    <div class="container-wrapper">
      <div class="left-wrapper">
        <div class="container-wrapper-title">国家</div>
        <el-select clearable @change="changeCountry" style="width: 100%" v-model="countryCode" filterable>
          <el-option v-for="(item, index) in countrySelect" :key="index" :label="item.countryNameZh" :value="item.countryCode"></el-option>
        </el-select>
        <div class="country-list-wrapper">
          <div class="country-list-item country-list-item-title">最近选择</div>
          <div class="country-list-item" :class="countryCode === item.countryCode ? 'country-list-item-title' : ''" v-for="(item, index) in recentlyCountryList" :key="index" @click="changeCountry(item.countryCode)">{{ item.countryNameZh }}</div>
        </div>
      </div>
      <div class="center-wrapper">
        <div class="center-top">
          <div>商品</div>
          <el-select clearable style="width: 168px" @change="changeCategory" v-model="productCategoryId" filterable>
            <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.id"></el-option>
          </el-select>
        </div>
        <el-input v-model="keyword" style="width: 100%; margin-bottom: 16px" placeholder="输入商品信息"></el-input>
        <div class="product-list-wrapper">
          <div class="product-wrapper" v-for="product in filterProductList" :key="product.id">
            <div class="product-title-wrapper">
              <div class="product-title">{{ product.productName }}</div>
              <div class="product-price" v-if="product.choose">{{ product.currency }}{{ product.servicePrice }}</div>
              <el-button v-else @click="product.choose = true">选择</el-button>
            </div>
            <div class="product-desc" v-if="product.serviceContext">服务内容：{{ product.serviceContext }}</div>
            <div class="product-spec-wrapper" v-show="product.choose">
              <div v-for="item in product.attributeGroup" :key="item.productCode">
                <!-- 单商品属性展示购买 -->
                <template v-if="product.displayMethod == 'ATTR'">
                  <div v-show="product.attributeGroup.length > 1" class="product-spec-category">{{ item.productCategory }}：</div>
                  <div class="product-spec-item" v-for="record in item.records" :key="record.attributeTypeId">
                    <span class="product-spec-title">{{ record.attributeTypeName }}：</span>
                    <div class="product-spec-container">
                      <span class="product-spec" :class="recordSub.check ? 'product-spec-active' : ''" v-for="recordSub in record.productAttributeList" :key="recordSub.value" @click="attributeSelected(product, record.productAttributeList, recordSub.value)">{{ recordSub.label }}</span>
                    </div>
                  </div>
                </template>
                <!-- 单商品规格展示购买 -->
                <template v-else>
                  <div class="product-spec-item">
                    <span class="product-spec-title">{{ item.productCategory.split('/')[1] }}：</span>
                    <div class="product-spec-container">
                      <span class="product-spec" :class="recordSub.check ? 'product-spec-active' : ''" v-for="recordSub in item.productSpecsDTOList" :key="recordSub.id" @click="specsSelected(product, item.productSpecsDTOList, recordSub.id)">{{ recordSub.specsName }}</span>
                    </div>
                  </div>
                </template>
              </div>
              <div class="product-spec-btn">
                <el-button @click="product.choose = false">取消</el-button>
                <el-button @click="addProduct(product)">添加</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-wrapper">
        <div class="right-wrapper-top">
          <div class="choose-wrapper">
            <div>
              <span class="choose-label">已选（{{ selectedProduct.length }}）</span>
              <span class="choose-desc">至少选择一项</span>
            </div>
            <div class="clear" @click="clearProduct">清空</div>
          </div>
          <div class="selected-product-list">
            <div class="selected-product-item" v-for="(item, index) in selectedProduct" :key="index">
              <div class="selected-product-title-wrapper">
                <div class="selected-product-title">{{ item.productName }} X {{ item.quantity }}</div>
                <div class="selected-product-price">{{ item.currency }}{{ item.servicePrice }}</div>
              </div>
              <div class="selected-product-spec">服务项目：{{ item.specStr }}</div>
              <i class="selected-close-icon el-icon-close" @click="delProduct(index)"></i>
            </div>
          </div>
        </div>
        <div class="right-bottom-btn">
          <el-button @click="dialogvisible = false">取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { getCountrySelectList } from '@/api/newApi/common.js';
import { getProductList, getProductCategory, getProductSpecsByAttribute } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { cloneDeep, sortBy } from 'lodash';
export default {
  props: {
    addProductDialog: Boolean,
    countrySelect: Array,
  },
  data() {
    return {
      keyword: '',
      countryCode: '',
      productCategoryId: '',
      recentlyCountryList: [],
      // countrySelect: [],
      categoryList: [],
      productList: [],
      selectedProduct: [],
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.addProductDialog;
      },
      set(val) {
        this.$emit('update:addProductDialog', val);
      },
    },
    filterProductList() {
      return this.productList.filter((item) => item.productName.indexOf(this.keyword) !== -1);
    },
  },
  mounted() {
    try {
      this.recentlyCountryList = JSON.parse(localStorage.getItem('recentlyCountryList')) || [];
    } catch (error) {}
    // this.getCountry();
    this.getCategoryList();
  },
  methods: {
    // getCountry() {
    //   getCountrySelectList().then((res) => {
    //     this.countrySelect = res.data;
    //   });
    // },
    // 获取商品分类
    getCategoryList() {
      getProductCategory({
        page: 1,
        size: -1,
      }).then((res) => {
        this.categoryList = res.data.records;
      });
    },
    loadList() {
      if (this.countryCode || this.productCategoryId) {
        this.getProductInfoList();
      } else {
        this.productList = [];
      }
    },
    changeCountry(val) {
      if (!val) {
        this.loadList();
        return;
      }
      this.countryCode = val;
      let index = this.recentlyCountryList.findIndex((item) => item.countryCode === val);
      let country = {};
      if (index > -1) {
        // country = this.recentlyCountryList.find((item) => item.countryCode === val);
        // this.recentlyCountryList.splice(index, 1);
      } else {
        country = this.countrySelect.find((item) => item.countryCode === val);
        this.recentlyCountryList.unshift({
          countryCode: country.countryCode,
          countryNameZh: country.countryNameZh,
        });
      }

      // 缓存十个国家
      // if (this.recentlyCountryList.length > 10) {
      //   this.recentlyCountryList = this.recentlyCountryList.splice(0, 10);
      // }
      localStorage.setItem('recentlyCountryList', JSON.stringify(this.recentlyCountryList));
      this.getProductInfoList();
    },
    // 获取商品信息
    getProductInfoList() {
      getProductList({
        size: -1,
        page: 1,
        isCombinationProduct: 'NOT_COMBINATION_PRODUCT', // 普通商品
        productStatus: 'PENDED_PUBLISH', // 上架商品
        client: 'OFFLINE',
        countryCode: this.countryCode,
        productCategoryId: this.productCategoryId,
      }).then((res) => {
        let data = res.data.records;
        data.forEach((item) => {
          item.specPrice = 0;
          item.choose = false;
          item.chooseSpec = [];
          item.fullAttributes = true;
          item.productSpecsDTOList.forEach((goods) => {
            //多选必买的规格
            if (item.displayMethod == 'SPEC' && (goods.isRequired == 'true' || goods.isRequired == 'IS_REQUIRED')) {
              this.$set(goods, 'check', true);
              item.chooseSpec.push(goods);
            } else {
              this.$set(goods, 'check', false);
            }
          });
          //属性展示
          if (item.displayMethod == 'ATTR' || item.isCombinationProduct == 'NOT_COMBINATION_PRODUCT') {
            this.handleProductAttr(item);
          }
          this.calculateServicePrice(item);
        });
        this.productList = data;
      });
    },
    //处理属性组
    handleProductAttr(goods) {
      goods.attributeGroup = [];
      //第一层
      goods.productInfoAttributeRelationDTOList.forEach((item) => {
        if (goods.attributeGroup.length) {
          let isAdd = true;
          goods.attributeGroup.forEach((attr) => {
            if (attr.productCode == item.subProductCategoryId) {
              isAdd = false;
            }
          });
          if (isAdd) {
            goods.attributeGroup.push({
              productCode: item.subProductCategoryId,
              productCategory: `${item.productCategoryName}/${item.subProductCategoryName}`,
              records: [],
              productSpecsDTOList: goods.productSpecsDTOList.filter((specs) => specs.productCategoryId == item.subProductCategoryId),
              requiredAttributesName: [],
            });
          }
        } else {
          goods.attributeGroup.push({
            productCode: item.subProductCategoryId,
            productCategory: `${item.productCategoryName}/${item.subProductCategoryName}`,
            records: [],
            productSpecsDTOList: goods.productSpecsDTOList.filter((specs) => specs.productCategoryId == item.subProductCategoryId),
            requiredAttributesName: [],
          });
        }
      });
      goods.attributeGroup.forEach((attr) => {
        //如果没有必选默认选中第一个规格(价格最低)
        let specsSelectedLen = attr.productSpecsDTOList.filter((item) => item.check).length;
        if (!specsSelectedLen && attr.productSpecsDTOList.length) {
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
      goods.attributeGroup.forEach((attr) => {
        goods.productInfoAttributeRelationDTOList.forEach((itemProps) => {
          let item = cloneDeep(itemProps);
          item.label = item.attributeName;
          item.value = item.productAttributeId;
          //attr.requiredAttributesName.includes(item.label)
          this.$set(item, 'check', !attr.records.find((p) => p.attributeTypeId === item.attributeTypeId && p.check) && attr.requiredAttributesName.includes(item.label));
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
    },
    //选择属性
    attributeSelected(product, productAttributeList, key) {
      productAttributeList.forEach((item) => {
        if (item.value == key) {
          item.check = !item.check;
        } else {
          item.check = false;
        }
      });

      let attrIdArrAll = [];
      product.fullAttributes = true;
      product.attributeGroup.forEach((item) => {
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
          product.fullAttributes = false;
        }
      });

      if (attrIdArrAll.length) {
        getProductSpecsByAttribute({ productAttributeIdList: attrIdArrAll, productInfoId: product.id }).then((res) => {
          let priceArr = [];
          let chooseSpec = [];
          product.productSpecsDTOList.forEach((spec) => {
            spec.check = false;
            res.data.forEach((item) => {
              if (item.id == spec.id) {
                spec.check = true;
                priceArr.push(spec.servicePrice);
                chooseSpec.push(item);
              }
            });
          });
          product.chooseSpec = chooseSpec;
          product.servicePrice = this.$util.countSum(priceArr);
        });
      } else {
        product.chooseSpec = [];
        product.servicePrice = 0;
        product.productSpecsDTOList.forEach((spec) => {
          spec.check = false;
        });
      }
    },
    //选择规格
    specsSelected(product, productSpecsDTOList, key) {
      productSpecsDTOList.forEach((item) => {
        if (!(item.isRequired == 'true' || item.isRequired == 'IS_REQUIRED')) {
          if (product.selector == 'SIMPLE_SELECT') {
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
      this.calculateServicePrice(product);
    },
    calculateServicePrice(product) {
      let priceArr = [];
      product.chooseSpec = [];
      product.productSpecsDTOList.forEach((item) => {
        if (item.check) {
          if (item.additionSpecId) {
            priceArr.push(item.servicePrice);
          } else {
            priceArr.push(item.servicePrice);
          }
          product.chooseSpec.push(item);
        }
      });
      product.servicePrice = this.$util.countSum(priceArr);
    },
    changeCategory() {
      this.loadList();
    },
    addProductValidate(product) {
      return new Promise((resolve) => {
        let isSpecSelected = true;
        let singleGoodsSelected = false;
        //单商品
        let productSpecsDTOList = product.productSpecsDTOList.filter((sub) => {
          return sub.check;
        });
        if (productSpecsDTOList.length) {
          isSpecSelected = false;
        }
        product.attributeGroup.forEach((category) => {
          let specLen = category.productSpecsDTOList.filter((sub) => {
            return sub.check;
          });
          if (!specLen.length) {
            singleGoodsSelected = true;
          }
        });
        if (isSpecSelected) {
          return this.$Message.warning('请先选择规格!');
        }
        if (singleGoodsSelected) {
          return this.$Message.warning('每组规格必须选择一个!');
        }
        if (!product.fullAttributes && product.displayMethod == 'ATTR') {
          return this.$Message.warning('请先选择完整商品属性!');
        }
        resolve();
      });
    },
    // 添加商品
    async addProduct(product) {
      await this.addProductValidate(product);
      let flag = false;
      this.selectedProduct.forEach((item) => {
        if (item.id === product.id && item.chooseSpec.map((spec) => spec.id).join(';') === product.chooseSpec.map((spec) => spec.id).join(';')) {
          item.quantity += 1;
          flag = true;
        }
      });
      if (flag) return;
      this.selectedProduct.push({
        quantity: 1,
        ...JSON.parse(JSON.stringify(product)),
        specStr: (product.chooseSpec || []).map((item) => item.specsName).join('；'),
      });
      console.log(this.selectedProduct);
    },
    // 删除商品
    delProduct(index) {
      this.selectedProduct.splice(index, 1);
    },
    // 清空商品
    clearProduct() {
      this.selectedProduct = [];
    },
    submit() {
      this.$emit('getSelectedProduct', JSON.parse(JSON.stringify(this.selectedProduct)));
      this.selectedProduct = [];
      this.dialogvisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-drawer__header {
  padding: 0 30px;
  margin-bottom: 0;
  border-bottom: 1px solid #ddd;
}
.drawer-title-wrapper {
  height: 82px;
  line-height: 82px;
  .drawer-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
}
.container-wrapper {
  display: flex;
  .container-wrapper-title {
    margin-bottom: 12px;
  }
  .left-wrapper {
    flex: 0 0 20%;
    padding: 32px 16px 32px 32px;
    height: calc(100vh - 85px);
    overflow: hidden;
    font-size: 14px;
    .country-list-wrapper {
      margin-top: 16px;
      height: calc(100vh - 210px);
      overflow: auto;
      .country-list-item-title {
        background-color: #f5faff;
      }
      .country-list-item {
        height: 46px;
        line-height: 46px;
        padding: 0 10px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        cursor: pointer;
      }
    }
  }
  .center-wrapper {
    flex: 0 0 45%;
    width: 45%;
    height: calc(100vh - 85px);
    overflow: hidden;
    padding: 32px 32px 0 16px;
    .center-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1px;
    }
    .product-list-wrapper {
      height: calc(100vh - 210px);
      overflow: auto;
      .product-wrapper {
        padding: 16px;
        margin-bottom: 24px;
        background-color: #fafafa;

        .product-title-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #333;
          .product-title {
            font-size: 14px;
          }
          .product-price {
            font-size: 20px;
            font-weight: bold;
          }
        }
        .product-desc {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 8px;
          font-size: 14px;
        }
        .product-spec-wrapper {
          margin-top: 16px;
          margin-top: 16px;
          border-top: 1px solid #e6e6e6;
          .product-spec-category {
            margin-top: 10px;
            font-weight: bold;
          }
          .product-spec-item {
            line-height: 42px;
            display: flex;
            .product-spec-title {
              white-space: nowrap;
            }
            .product-spec-container {
              .product-spec {
                line-height: 42px;
                display: inline-block;
                color: #999999;
                font-size: 14px;
                height: 26px;
                line-height: 26px;
                padding: 0 16px;
                border-radius: 70px;
                margin-left: 16px;
                background-color: #f0f2f5;
                cursor: pointer;
                &-active {
                  color: #fff;
                  background-color: #1890ff;
                }
              }
            }
          }
          .product-spec-btn {
            text-align: right;
            margin-top: 16px;
          }
        }
      }
    }
  }
  .right-wrapper {
    flex: 0 0 35%;
    height: calc(100vh - 85px);
    overflow: hidden;
    border-left: 1px solid rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: column;
    .right-wrapper-top {
      flex: 0 0 calc(100vh - 175px);
      height: calc(100vh - 175px);
      overflow: hidden;
      padding: 31px 32px 0px;
      .choose-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #666;
        font-size: 14px;
        margin-bottom: 14px;
        .choose-label {
          margin-right: 4px;
        }
        .choose-desc {
          font-size: 12px;
        }
        .clear {
          color: #1890ff;
          cursor: pointer;
        }
      }
      .selected-product-list {
        height: calc(100vh - 250px);
        overflow: auto;
        .selected-product-item {
          padding: 25px 25px 16px 16px;
          background-color: #fafafa;
          position: relative;
          margin-bottom: 18px;
          .selected-product-title-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2px;
            .selected-product-title {
              font-size: 14px;
              color: #333;
            }
            .selected-product-price {
              font-size: 20px;
              font-weight: bold;
              color: #e72014;
            }
          }
          .selected-product-spec {
            font-size: 12px;
            line-height: 20px;
            color: #666;
          }
          .selected-close-icon {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 12px;
            height: 12px;
            cursor: pointer;
          }
        }
      }
    }
    .right-bottom-btn {
      flex: 0 0 88px;
      height: 88px;
      padding: 20px 36px;
      text-align: right;
      // position: fixed;
      // bottom: 36px;
      // right: 36px;
    }
  }
}
</style>
