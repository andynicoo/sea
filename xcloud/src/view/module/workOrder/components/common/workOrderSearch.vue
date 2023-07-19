<template>
  <!-- 查询 -->
  <div class="header-container" ref="searchBox">
    <!-- 查询条件 -->
    <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
      <el-form ref="searchForm" :model="searchForm" inline label-width="130px">
        <el-form-item label="订单号" prop="orderNo">
          <el-input :type="inputType" :rows="1" v-model="searchForm.orderNo" placeholder="请输入订单号" clearable style="width: 168px" />
        </el-form-item>
        <el-form-item label="服务号" prop="serviceNo">
          <el-input :type="inputType" :rows="1" v-model="searchForm.serviceNo" placeholder="请输入服务号" clearable style="width: 168px" />
        </el-form-item>
        <el-form-item style="margin-left: 20px">
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
          <el-button type="text" size="small" @click="handleMoreSearch">
            <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
            {{ moreSerch ? '收起' : '更多' }}筛选
          </el-button>
          <el-button type="primary" @click="batchSearchDialog = true" v-if="showBatchSearch">批量</el-button>
          <slot name="operator"></slot>
        </el-form-item>
        <el-form-item style="float: right">
          <slot name="rightBtn"></slot>
          <el-link type="primary" :underline="false" @click="toUploadAndDownloadRecords">上传/下载中心</el-link>
        </el-form-item>
        <div v-show="moreSerch">
          <el-form-item label="工单号" prop="workNo">
            <el-input :type="inputType" :rows="1" v-model="searchForm.workNo" placeholder="请输入工单号" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="手机号" prop="userMobile">
            <el-input :type="inputType" :rows="1" v-model="searchForm.userMobile" placeholder="请输入客户手机号" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="交付专员" prop="disposeId">
            <el-select style="width: 168px" v-model="searchForm.disposeId" placeholder="交付专员" clearable filterable>
              <el-option v-for="(item, index) in taxManagerList" :key="index" :value="item.userId" :label="item.nickName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客服" prop="customerId">
            <el-select style="width: 168px" v-model="searchForm.customerId" placeholder="客服" clearable filterable>
              <el-option v-for="(item, index) in commissionerList" :key="index" :value="item.userId" :label="item.nickName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家" prop="countryCode">
            <el-select style="width: 168px" v-model="searchForm.countryCode" placeholder="国家" filterable clearable>
              <el-option v-for="(item, index) in countryList" :key="index" :label="item.countryNameZh" :value="item.countryCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工单进度" prop="currentNodeCode">
            <el-select style="width: 168px" v-model="searchForm.currentNode" placeholder="工单进度" clearable filterable @change="changeProgressBar">
              <el-option v-for="(item, index) in progressList" :key="index" :label="item.nodeName" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工单状态" prop="status">
            <el-select style="width: 168px" v-model="searchForm.status" placeholder="工单状态" clearable filterable>
              <el-option v-for="(item, index) in statusList" :key="index" :label="item.value" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务商" prop="supplierId">
            <el-select style="width: 168px" v-model="searchForm.supplierId" placeholder="服务商" clearable filterable>
              <el-option v-for="(item, key) in supplierList" :key="key" :value="item.id" :label="item.shortName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品分类" prop="productCategory">
            <el-cascader
              style="width: 168px"
              clearable
              filterable
              v-model="searchForm.productCategory"
              :options="serviceCascader"
              :show-all-levels="false"
              :props="{
                children: 'childrenProductCategory',
                value: 'id',
                label: 'categoryName',
                emitPath: false,
              }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="公司名称" prop="companyName">
            <el-input :type="inputType" :rows="1" v-model="searchForm.companyName" placeholder="请输入公司名称" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item prop="createTime" label="工单生成时间">
            <el-date-picker
              v-model="searchForm.createTime"
              type="daterange"
              align="right"
              size="small"
              clearable
              unlink-panels
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              range-separator="到"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="[, '23:59:59']"
              style="width: 340px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="lastVerifyTime" label="资料审核通过时间">
            <el-date-picker
              v-model="searchForm.lastVerifyTime"
              type="daterange"
              align="right"
              size="small"
              clearable
              unlink-panels
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              range-separator="到"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="[, '23:59:59']"
              style="width: 340px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="sendProviderTime" label="资料提交办理时间">
            <el-date-picker
              v-model="searchForm.sendProviderTime"
              type="daterange"
              align="right"
              size="small"
              clearable
              unlink-panels
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              range-separator="到"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="[, '23:59:59']"
              style="width: 340px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="completeTime" label="工单完成时间">
            <el-date-picker
              v-model="searchForm.completeTime"
              type="daterange"
              align="right"
              size="small"
              clearable
              unlink-panels
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              range-separator="到"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="[, '23:59:59']"
              style="width: 340px"
            ></el-date-picker>
          </el-form-item>
          <slot name="searchItems"></slot>
        </div>
      </el-form>
    </div>
    <BatchSearchDialog :batchSearchDialog.sync="batchSearchDialog" :keyword="searchKeyword" :activeTab="activeTab" @getBatchSearchKey="getBatchSearchKey" />
  </div>
</template>

<script>
import { getCountrySelectList, getDisposelist, serviceStatus, serviceProgress } from '@/api/newApi/common.js';
import { getProductCategory } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import cacheQuery from '@/mixins/cacheQuery';
import { getUserListByRole, getSupplierList } from '@/api/newApi/common';
import BatchSearchDialog from '@/view/module/newTaxServices/taxNumDeclare/components/batchSearchDialog';
export default {
  props: {
    form: {
      type: Object,
      default: {},
    },
    functionCode: String,
    checkIds: Array,
    showBatchSearch: Boolean,
  },
  model: {
    prop: 'form',
    event: 'getForm',
  },
  data() {
    return {
      searchForm: {
        page: 1,
        limit: 20,
        orderNo: '',
        serviceNo: '',
        workNo: '',
        userMobile: '',
        handler: '',
        countryCode: '',
        currentNodeCode: '',
        currentNode: '',
        status: '',
        supplierId: '',
        productCategory: '',
        companyName: '',
        createTime: [],
        sendProviderTime: [],
        lastVerifyTime: [],
        completeTime: [],
      },
      cacheKey: 'searchForm',
      copyListQuery: {},
      countryList: [],
      statusList: [],
      progressList: [],
      supplierList: [],
      taxManagerList: [],
      commissionerList: [],
      serviceCascader: [],
      supplierListMap: new Map(),
      listLoading: false,
      searchKeyword: '',
      batchSearchDialog: false,
      keyList: ['orderNo', 'serviceNo', 'workNo', 'companyName', 'userMobile'],
      activeTab: '',
    };
  },
  components: {
    BatchSearchDialog,
  },
  watch: {
    form: {
      handler(val) {
        this.searchForm = Object.assign(this.searchForm, val);
        if (val.currentNodeCode) {
          this.searchForm.currentNode = val.currentNodeCode + '@' + (val.progressBar ? val.progressBar : '1');
        }
      },
      deep: true,
    },
    searchForm: {
      handler(val) {
        this.$emit('getForm', Object.assign({}, this.searchForm));
      },
      deep: true,
    },
    'searchForm.countryCode'(val) {
      if (val) {
        let supplierList = this.supplierListMap.get(val);
        if (supplierList) {
          this.supplierList = supplierList;
        } else {
          this.getSupplierList();
        }
      }
    },
  },
  mixins: [cacheQuery],
  computed: {
    inputType() {
      return this.showBatchSearch ? 'textarea' : 'text';
    },
  },
  mounted() {
    this.copyListQuery = { ...this.form, ...this.searchForm };
    this.getPageCache();
    for (let i = 0; i < this.keyList.length; i++) {
      let key = this.keyList[i];
      if (this.searchForm[key]) {
        this.searchKeyword = this.searchForm[key];
        this.activeTab = key;
        break;
      }
    }
    this.getCountryList();
    this.getSupplierList();
    this.getStatusList();
    this.getAllCategory();
    this.getManagerList();
    this.getCustomerList();
    this.getServiceProgress();
  },
  methods: {
    getBatchSearchKey(val, activeName) {
      this.resetSearKeyWord();
      this.searchKeyword = val;
      this.searchForm[activeName] = val;
      this.search();
    },
    resetSearKeyWord() {
      this.keyList.forEach((item) => {
        this.searchForm[item] = '';
      });
    },
    /** 获取国家下拉框数据 */
    getCountryList() {
      getCountrySelectList().then((res) => {
        this.countryList = res.data;
      });
    },
    /** 获取服务商列表 */
    getSupplierList() {
      let params = {
        supplierType: 1,
        countryCode: this.searchForm.countryCode,
        countryCodeList: [this.searchForm.countryCode],
      };
      if (this.functionCode == 5) {
        params.functionCodeColl = [5, 23];
      } else {
        params.functionCode = this.functionCode;
      }
      getSupplierList(params).then((res) => {
        this.supplierList = res.data;
      });
    },
    // 获取交付专员列表
    getManagerList() {
      getDisposelist({
        functionCode: this.functionCode,
      }).then((res) => {
        this.taxManagerList = res.data;
      });
    },
    // 获取客服
    getCustomerList() {
      getUserListByRole({
        roleCode: this.$constant.VAT_CUSTOMER_SERVICE,
      }).then((res) => {
        this.commissionerList = res.data;
      });
    },
    /**
     * 获取商品分类
     */
    getAllCategory() {
      getProductCategory({
        size: -1,
        status: 'ENABLE',
      }).then((res) => {
        if (res.code == 0) {
          let data = res.data.records.filter((item) => item.childrenProductCategory && item.childrenProductCategory.length);
          this.formatCategory(data);
          this.serviceCascader = data;
        }
      });
    },
    formatCategory(data) {
      data.forEach((item) => {
        if (item.childrenProductCategory && item.childrenProductCategory.length) {
          this.formatCategory(item.childrenProductCategory);
        } else {
          item.childrenProductCategory = void 0;
        }
      });
    },
    /** 获取所有服务状态 */
    getStatusList() {
      serviceStatus().then((res) => {
        if (res.code == 0) {
          this.statusList = res.data;
        }
      });
    },
    /** 列表查询服务进度列表 */
    getServiceProgress() {
      serviceProgress({ functionCode: this.functionCode }).then((res) => {
        if (res.code == 0) {
          res.data.forEach((item) => {
            item.key = item.nodeCode + '@' + item.nodeValue;
          });
          this.progressList = res.data;
        }
      });
    },
    /** 修改服务商 */
    changeSupplier() {
      this.searchForm.supplierId = '';
    },
    changeProgressBar() {
      let node = this.progressList.find((item) => this.searchForm.currentNode == item.nodeCode + '@' + item.nodeValue);
      if (!node) {
        this.searchForm.currentNodeCode = '';
        this.searchForm.progressBar = '';
      } else {
        this.searchForm.currentNodeCode = node.nodeCode;
        this.searchForm.progressBar = node.nodeValue;
      }
    },
    /** 搜索 */
    search() {
      this.searchForm.page = 1;
      this.mergeForm();
      setTimeout(() => {
        this.$parent.$refs.workOrderTable.getList();
      });
    },
    /** 重置 */
    reset() {
      this.searchForm = Object.assign({}, this.copyListQuery);
      this.mergeForm();
      this.removePageCache();
    },
    mergeForm() {
      this.$nextTick(() => {
        this.$parent.form = Object.assign({}, this.searchForm);
        this.$parent.$refs.workOrderTable.searchForm = this.$parent.form;
      });
    },
    toUploadAndDownloadRecords() {
      this.$router.push({
        path: '/workOrder/uploadAndDownloadRecords',
      });
    },
  },
};
</script>

<style></style>
