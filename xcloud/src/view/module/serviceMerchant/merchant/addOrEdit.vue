<template>
  <div id="merchantEditContent" v-loading="loading" v-if="flag">
    <el-link :underline="false" type="info" @click="goBack" style="padding: 15px">
      <i class="el-icon-arrow-left"></i>
      返回列表
    </el-link>
    <el-steps :active="stepActive" simple>
      <el-step title="基础信息" icon="el-icon-edit"></el-step>
      <el-step title="PC网页" icon="el-icon-upload"></el-step>
      <el-step title="H5网页" icon="el-icon-upload"></el-step>
    </el-steps>

    <!-- v-show时富文本编辑器只加载一次 -->
    <div class="editAera" v-show="stepActive == 0">
      <baseinfo
        :baseForm.sync="publishFormData.baseForm"
        :baseInfo="dataList.baseInfo"
        :skuListIds="skuListIds"
        :skuItemList="skuItemList"
        :allCateGories="allCateGories"
        @nextStep="nextStep"
        @submitMerchant="submitMerchant"
      />
    </div>

    <div class="editAera" v-if="stepActive == 1">
      <imginfo
        :imgFrom.sync="publishFormData.pcForm"
        :imgInfo="dataList.pcInfo"
        @nextStep="nextStep"
        @submitMerchant="submitMerchant"
        :target="publishFormData.baseForm.target"
      />
    </div>

    <div class="editAera" v-if="stepActive == 2">
      <imginfo
        :imgFrom.sync="publishFormData.h5Form"
        :imgInfo="dataList.h5Info"
        @nextStep="nextStep"
        @submitMerchant="submitMerchant"
        :target="publishFormData.baseForm.target"
      />
    </div>
  </div>
</template>

<script>
import baseinfo from './baseInfo.vue';
import imginfo from './imgInfo.vue';
import { addproductInfo, getallcategory } from '@/api/newApi/servicemerchant/serviceMerchant.js';
export default {
  components: {
    baseinfo,
    imginfo,
  },
  data() {
    return {
      skuListIds: [],
      skuItemList: [],
      stepActive: 0,
      loading: false,
      /******
       * 在父组件中获取所有子组件需要的列表数据
       *  from to
       * -1 返回上个路由
       * 0 基础信息
       * 1 PC
       * 2 H5
       * 3 提交保存
       *
       *
       * 从上级路由表页面带过来
       */
      dataList: {
        baseInfo: {
          from: -1,
          to: 1,
          type: [],
          country: [],
          content: [],
          item: [],
          unit: [],
          currency: [],
          target: [],
          state: [],
        },
        pcInfo: {
          from: 0,
          to: 2,
        },
        h5Info: {
          from: 1,
          to: 3,
        },
      },
      /*****
       * 提交表单的双向绑定数据,新增就默认,编辑就从表里面带过来
       */
      publishFormData: {
        baseForm: {
          id: '',
          type: '',
          list: new Array(),
          name: '',
          country: '',
          content: new Array(),
          item: new Array(),
          signalOriginalPrice: '',
          signalSalePrice: '',
          baseJoinSkuIds: new Array(),
          price: [
            {
              skuId: '',
              fullname: '',
              original: '',
              list: [],
              sale: '',
              joinSkuIds: [],
            },
          ],
          order: '',
          unit: '',
          target: new Array(),
          state: new Array(),
          functionCode: '',
          // R标信息
          trademarkInfo: {
            trademarkStructure: '',
            trademarkName: '',
            trademarkRegisteredNo: '',
            trademarkImage: '',
            trademarkRegisterInfo: '',
            categoryIds: [],
            trademarkEffectTime: '',
            trademarkInvalidTime: '',
            certificateRegType: '',
            referenceUse: '',
            amazoneFilingHis: '',
            platformFilingHis: '',
            authOtherUseHis: '',
            brandInterpretation: '',
            regNationalAdvantages: '',
          },
          // 卖家信息
          sellerInfo: {
            sellerMobile: '',
            transferorType: 1,
            companyName: '',
            companyLegalPerson: '',
            countryId: '',
            trademarkName: '',
            emailWechat: '',
            companyLicense: '',
            transferorName: '',
            identityNumber: '',
            provinceId: '',
            cityId: '',
            addressDetail: '',
            identityCardFront: '',
            identityCardReverse: '',
            userId: '',
          },
        },
        pcForm: {
          flag: 1,
          imgUrl: [
            {
              imgUrl: '',
              sort: 0,
            },
          ],
          mutilText: '',
          isNeed: null,
        },
        h5Form: {
          flag: 2,
          imgUrl: [
            {
              imgUrl: '',
              sort: 0,
            },
          ],
          mutilText: '',
          isNeed: null,
        },
      },
      allCateGories: [],
      serviceCascader: [],
      // 数据初始化完成标志
      flag: false,
    };
  },
  watch: {
    'publishFormData.baseForm.target': function (newval) {
      this.publishFormData.pcForm.isNeed = newval.indexOf(1) != -1 || newval.indexOf(3) != -1;
      this.publishFormData.h5Form.isNeed = newval.indexOf(2) != -1;
    },
  },
  async created() {
    const temp = this.$route.params;
    this.allCateGories = temp.allCateGories;
    if (!temp.countrySelect) {
      this.back();
    }
    await this._getallcategory();
    this.dataList = {
      baseInfo: {
        from: -1,
        to: 1,
        type: this.serviceCascader,
        content: [],
        item: [],
        country: temp.countrySelect,
        unit: temp.unitSelect,
        currency: temp.currencySelect,
        target: temp.saleTargetSelect,
        state: temp.stateSelect,
      },
      pcInfo: {
        from: 0,
        to: 2,
        isNeed: false,
      },
      h5Info: {
        from: 1,
        to: 3,
        isNeed: false,
      },
    };

    if (!temp.rowData) {
    } else {
      const row = temp.rowData;
      if (row.productSkuVOList.length) {
        row.productSkuVOList[0].productAttributeRelationDtoList.forEach((item) => {
          this.skuListIds.push(item.productAttributeCategoryId);
        });
        row.productSkuVOList.forEach((sl) => {
          sl.productAttributeRelationDtoList.forEach((p, i) => {
            if (!this.skuItemList[i]) {
              this.skuItemList[i] = [];
            }
            this.skuItemList[i].push(
              `${p.productAttributeName}-${p.productAttributeId}-${p.productAttributeCategoryId}`
            );
          });
        });
        this.skuItemList = this.skuItemList.map((s) => [...new Set(s)]);
      }
      this.getEcho(row);
    }
    this.flag = true;
  },
  methods: {
    /**
     * 获取所有商品类目和属性
     */
    _getallcategory() {
      return new Promise((resolve) => {
        getallcategory().then((res) => {
          if (res.code == 0) {
            this.serviceCascader = this.getCategory(res.data);
            resolve();
          }
        });
      });
    },
    /**
     * 递归格式化所有商品类目和属性
     */

    getCategory(arr) {
      return arr.map((res) => {
        const t = res.childrenProductCategoryVo;
        const obj = {
          label: res.categoryName,
          value: res.id,
        };
        t.length == 0
          ? void 0
          : Object.defineProperty(obj, 'children', {
              enumerable: true,
              configurable: false,
              writable: false,
              value: this.getCategory(t),
            });
        return obj;
      });
    },
    getEcho(row) {
      this.publishFormData = {
        baseForm: {
          id: row.productId,
          list: row.productSkuVOList.map((res) => {
            try {
              return res.skuAttributeId == '[]' ? '' : JSON.parse(res.skuAttributeId);
            } catch (error) {}
          }),
          type: [
            row.productCategoryVo.parentProductCategoryVo ? row.productCategoryVo.parentProductCategoryVo.id : '',
            row.productCategoryVo.id ? row.productCategoryVo.id : '',
          ],
          name: row.productName,
          country: row.countryCode,
          baseGpmRate: JSON.stringify(row.baseGpmRate) == '{}' ? null : row.baseGpmRate,
          baseMinPrice: JSON.stringify(row.baseMinPrice) == '{}' ? null : row.baseMinPrice,
          productDescribe: row.productDescribe,
          serviceTimeliness: row.serviceTimeliness,
          baseRangeMaxPrice: JSON.stringify(row.baseRangeMaxPrice) == '{}' ? null : row.baseRangeMaxPrice,
          baseRangeMinPrice: JSON.stringify(row.baseRangeMinPrice) == '{}' ? null : row.baseRangeMinPrice,
          //这里的非sku属性 本来是想做成二维的 checkbox绑定二维数组 但是现在决定按一维的来做 如果新增非sku属性不能填写属性的type名
          content: !row.noSkuAttributeId
            ? []
            : JSON.parse(row.noSkuAttributeId).map((res) => {
                return `${res.productAttributeId}-${res.productAttributeCategoryId}`;
              }),
          item: !row.productSkuVOList
            ? []
            : row.productSkuVOList.map((res) => {
                return res.productAttributeRelationDtoList
                  .map((item) => {
                    return `${item.productAttributeName}-${item.productAttributeId}-${item.productAttributeCategoryId}`;
                  })
                  .join(',');
              }),
          signalOriginalPrice: row.baseStandardPrice,
          signalSalePrice: row.basePrice,
          price: row.productSkuVOList.map((res) => {
            return {
              skuId: res.skuId,
              original: res.standardPrice,
              sale: res.price,
              fullname: res.productAttributeRelationDtoList.map((item) => {
                return item.productAttributeName;
              }),
              // .join("-"),
              list: res.productAttributeRelationDtoList,
              joinSkuIds: res.joinSkuIds,
              renewSkuId: res.renewSkuId,
              gpmRate: JSON.stringify(res.gpmRate) == '{}' ? null : res.gpmRate,
              minPrice: JSON.stringify(res.minPrice) == '{}' ? null : res.minPrice,
              rangeMaxPrice: JSON.stringify(res.rangeMaxPrice) == '{}' ? null : res.rangeMaxPrice,
              rangeMinPrice: JSON.stringify(res.rangeMinPrice) == '{}' ? null : res.rangeMinPrice,
            };
          }),

          order: row.sort,
          unit: row.unit,
          currency: row.currency,
          target: !row.applySit ? [] : JSON.parse(row.applySit),
          state: row.status,
          // R标新增
          trademarkInfo: row.trademarkInfo,
          sellerInfo: row.sellerInfo,
          functionCode: '',
        },
        pcForm: {
          flag: 0,
          imgUrl: !row.pcProductImgUrl ? this.publishFormData.pcForm.imgUrl : JSON.parse(row.pcProductImgUrl),
          mutilText: row.pcProductDetail,
          isNeed: false,
        },
        h5Form: {
          flag: 1,
          imgUrl: !row.mobileProductImgUrl ? this.publishFormData.h5Form.imgUrl : JSON.parse(row.mobileProductImgUrl),
          mutilText: row.mobileProductDetail,
          isNeed: false,
        },
      };
    },
    goBack() {
      this.$router.push('/serviceMerchant/merchant/index');
    },
    nextStep(active) {
      if (active == -1) {
        this.back();
      } else if (active == 3) {
        this.$confirm('确认操作?', '提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
          .then(() => {
            this.submitMerchant();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.stepActive = active;
      }
    },
    back() {
      this.$router.push({
        path: '/serviceMerchant/merchant/index',
      });
    },
    submitMerchant() {
      const baseForm = this.publishFormData.baseForm;
      const pcForm = this.publishFormData.pcForm;
      const h5Form = this.publishFormData.h5Form;
      let params = {
        productId: baseForm.id,
        productCategoryId: baseForm.type[baseForm.type.length - 1],
        productDescribe: baseForm.productDescribe,
        serviceTimeliness: baseForm.serviceTimeliness,
        productName: baseForm.name,
        countryCode: baseForm.country,
        noSkuProductAttributeRelationDtoList: baseForm.content,
        baseGpmRate: baseForm.baseGpmRate,
        baseMinPrice: baseForm.baseMinPrice,
        baseRangeMaxPrice: baseForm.baseRangeMaxPrice,
        baseRangeMinPrice: baseForm.baseRangeMinPrice,
        basePrice: baseForm.signalSalePrice,
        baseStandardPrice: baseForm.signalOriginalPrice,
        baseJoinSkuIds: baseForm.baseJoinSkuIds ? baseForm.baseJoinSkuIds : [],
        sort: baseForm.order,
        unit: baseForm.unit,
        currency: baseForm.currency,
        status: baseForm.state,
        applySitArr: baseForm.target,
        pcProductDetail: !pcForm.mutilText ? '' : pcForm.mutilText,
        pcProductImgDtoList: !pcForm.imgUrl[0].imgUrl ? [] : pcForm.imgUrl,
        mobileProductDetail: !h5Form.mutilText ? '' : h5Form.mutilText,
        mobileProductImgDtoList: !h5Form.imgUrl[0].imgUrl ? [] : h5Form.imgUrl,
      };
      if (baseForm.renewSkuId) {
        params.renewSkuId = baseForm.renewSkuId;
      }
      if (baseForm.price.length > 0) {
        params.productSkuDtoList = baseForm.price.map((p) => {
          return {
            price: p.sale,
            standardPrice: p.original,
            skuId: p.skuId,
            productAttributeRelationDtoList: p.list,
            joinSkuIds: p.joinSkuIds ? p.joinSkuIds : [],
            renewSkuId: p.renewSkuId ? p.renewSkuId : '',
            gpmRate: p.gpmRate,
            minPrice: p.minPrice,
            rangeMaxPrice: p.rangeMaxPrice,
            rangeMinPrice: p.rangeMinPrice,
          };
        });
      }
      if (baseForm.functionCode == 65) {
        params = {
          ...params,
          trademarkInfo: baseForm.trademarkInfo,
          sellerInfo: baseForm.sellerInfo,
        };
      }

      this.loading = true;
      addproductInfo(params)
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('操作成功');
            this.back();
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss">
#merchantEditContent {
  padding: 10px;
  margin: 10px;
  background-color: #fff;
  min-height: 700px;
  .el-steps {
    padding: 10px 5%;
    .el-step__title {
      font-size: 12px;
    }
  }
  .editAera {
    margin: 20px;
  }
}
</style>
