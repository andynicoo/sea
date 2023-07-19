<!-- 付费服务item  -->
<template>
  <el-table border :data="serviceData" style="margin-bottom: 20px">
    <el-table-column label="服务">
      <template slot-scope="{ row, $index }">
        <div style="padding: 8px 0">
          <el-select v-model="row.productId" filterable clearable @change="changeService($event, $index)" placeholder="选择服务" style="margin-bottom: 10px">
            <el-option v-for="item in serviceList" :key="item.id" :value="item.id" :label="item.productName" :disabled="item.disabled"></el-option>
          </el-select>
          <el-select v-model="row.skuId" filterable clearable @change="changeServiceItem($event, $index)" placeholder="选择服务项目">
            <el-option v-for="(item, index) in serviceItemList" :key="index" :value="item.id" :label="item.specsName" :disabled="item.disabled"></el-option>
          </el-select>
        </div>
      </template>
    </el-table-column>
    <div v-if="goodType == 'OA'">
      <el-table-column align="center" label="国家" prop="oaCountry"> </el-table-column>
      <el-table-column align="center" label="售价" prop="oaPrice"> </el-table-column>
    </div>
    <div v-if="goodType != 'OA'">
      <el-table-column align="center" label="国家" prop="otherCountry"> </el-table-column>
      <el-table-column align="center" label="售价" prop="otherPrice"> </el-table-column>
    </div>
  </el-table>
</template>

<script>
import * as API from '@/api/newApi/intellectualProperty/oa.js'; //oa类型商品
import { getproductInfoList } from '@/api/newApi/servicemerchant/serviceMerchant.js'; // 使用证据商品
import { productListAPI } from '@/api/newApi/intellectualProperty/oa.js';
import { mapMutations, mapActions, mapGetters } from 'vuex';
export default {
  name: 'PayServiceItem',
  components: {},
  props: {
    goodType: String,
  },
  data() {
    return {
      goodTypes: { OA: 1, EVIDENCE: 2 },
      serviceList: [],
      serviceData: [{}],
      serviceItemList: [],
      countryCode: this.getDelworkInfo().countryCode,
    };
  },

  computed: {},

  created() {
    this.getList();
  },
  methods: {
    ...mapMutations(['saveTreatmentSchemeList']),
    ...mapGetters(['getTreatmentSchemeList', 'getDelworkInfo']),
    getList() {
      let val = Object.keys(this.goodTypes).findIndex((item) => item.toString() == this.goodType);
      val + 1 == 1 ? this.getProduct() : this.getTranslateOa();
    },
    // 选择OA商品
    changeService(val, index) {
      this.serviceData = [];
      this.serviceItemList = [];

      if (val == '') {
        this.serviceData = [{}];
        return;
      }
      let obj = {};
      this.serviceList.map((item) => {
        if (val == item.id) {
          obj = this.setOtherOrOA(item);
          if (this.getTreatmentSchemeList().length > 0) {
            this.serviceItemList = item.productSpecsDTOList.map((item) => {
              if (this.getTreatmentSchemeList().findIndex((i) => i.productSkuId == item.id) != -1) item.disabled = true;
              return item;
            });
          } else {
            this.serviceItemList = item.productSpecsDTOList;
          }

          this.serviceData.push(obj);
        }
      });
    },

    setOtherOrOA(obj) {
      let newObj = {};
      newObj.productId = obj.id;
      if (this.goodType == 'OA') {
        newObj.oaServiceName = obj.productName;
        newObj.oaCountry = obj.countryCodeName;
      } else {
        newObj.otherServiceName = obj.productName;
        newObj.otherCountry = obj.countryCodeName;
      }
      return newObj;
    },
    changeServiceItem(val, index) {
      if (val == undefined) return;
      let newData = this.serviceData[0];
      this.serviceData = [];
      this.serviceItemList.forEach((item) => {
        if (val == item.id) {
          if (this.goodType == 'OA') {
            newData.oaPrice = item.servicePrice;
          } else {
            newData.otherPrice = item.servicePrice;
          }
          newData.evidenceComboName = item.specsName;
          newData.productSkuId = item.id;
        }
      });
      this.serviceData.push(newData);
      this.saveTreatmentSchemeList(newData);
    },

    // 获取OA商品
    getProduct() {
      let data = { functionCode: 200, isCombinationProduct: 'NOT_COMBINATION_PRODUCT' };
      productListAPI(data).then((res) => {
        if (res.code == 0) {
          this.serviceList = res.data.records;
        }
      });
    },

    /**
     * 使用证据商品
     */
    async getTranslateOa() {
      let { data, code } = await productListAPI({
        functionCode: 63,
        isCombinationProduct: 'NOT_COMBINATION_PRODUCT',
      });

      if (code == 0) this.serviceList = data.records;
    },
  },
};
</script>
<style lang="scss" scoped></style>
