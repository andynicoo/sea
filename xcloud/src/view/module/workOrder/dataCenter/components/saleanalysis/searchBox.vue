<template>
  <div>
    <el-form
      class="search-box"
      ref="searchForm"
      :model="formModal"
      inline
      label-width="100px"
      @keydown.enter.native="search"
    >
      <el-form-item label="付款时间">
        <!-- <el-select v-model="formModal.timeType" placeholder="时间类型" class="time-type">
          <el-option :value="1" label="按天" ></el-option>
          <el-option :value="2" label="按周" ></el-option>
          <el-option :value="3" label="按月" ></el-option>
          <el-option :value="4" label="按季度" ></el-option>
          <el-option :value="5" label="按年" ></el-option>
        </el-select> -->
        <el-date-picker
          v-model="formModal.paymentTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="{
            disabledDate(time) {
              return time.getTime() > Date.now() || time.getTime() < 1420041600000;
            },
          }"
        />
        <!-- <el-date-picker
          v-else-if="formModal.timeType === 3 || formModal.timeType === 4 || formModal.timeType === 5"
          v-model="formModal.paymentTime"
          value-format="yyyy-MM-dd"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          unlink-panels
          :picker-options="{
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() < 1420041600000;
          }}"
        /> -->
      </el-form-item>
      <el-form-item label="统计维度">
        <el-select v-model="formModal.timeType" placeholder="统计维度" class="time-type">
          <el-option :value="1" label="按天"></el-option>
          <el-option :value="2" label="按周"></el-option>
          <el-option :value="3" label="按月"></el-option>
          <el-option :value="4" label="按季度"></el-option>
          <el-option :value="5" label="按年"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门">
        <el-cascader
          v-model="formModal.departmentIdList"
          :options="departmentList"
          collapse-tags
          filterable
          clearable
          :props="{
            multiple: true,
            emitPath: true,
            label: 'departmentName',
            value: 'departmentId',
            children: 'childXcloudOrgDepartmentListVO',
          }"
        />
      </el-form-item>
      <el-form-item label="人员">
        <el-select clearable v-model="formModal.attributionIdList" placeholder="人员" filterable multiple collapse-tags>
          <el-option
            v-for="(item, index) in userList"
            :key="index"
            :label="item.nickName"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类目">
        <el-cascader
          v-model="formModal.productCategoryId"
          :options="categoryList"
          collapse-tags
          filterable
          clearable
          :props="{ multiple: true, emitPath: true }"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品">
        <el-cascader
          v-model="formModal.productSkuIdList"
          :options="productList"
          collapse-tags
          filterable
          clearable
          :props="{
            multiple: true,
            emitPath: true,
          }"
        >
        </el-cascader>
        <!-- <el-select clearable v-model="formModal.productSkuIdList" placeholder="商品" filterable multiple collapse-tags>
          <el-option
            v-for="(item, index) in productList"
            :key="index"
            :value="item.productId"
            :label="item.productName"
          ></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="国家">
        <el-select clearable v-model="formModal.countryCodeList" placeholder="国家" filterable multiple collapse-tags>
          <el-option
            v-for="(item, index) in countryList"
            :value="item.countryCode"
            :label="item.countryNameZh"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务商">
        <el-select clearable v-model="formModal.supplierIdList" placeholder="服务商" filterable multiple collapse-tags>
          <el-option
            v-for="(item, index) in supplierList"
            :value="item.supplierId"
            :label="item.supplierName"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left: 20px">
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchSubmit()"> 搜索 </el-button>
        <el-button icon="el-icon-refresh" @click="resetForm()" size="small"> 重置 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment';
import { getCountrySelectList } from '@/api/newApi/common.js';
import { getSupplierAttorneyInfoList } from '@/api/newApi/workOrder/dataCenter.js';
import { getallcategory, getproductInfoList } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { getDepartmentTree } from '@/api/department.js';
import { getAllUsers } from '@/api/user';

export default {
  data() {
    return {
      formModal: {},
      departmentList: [], // 部门
      userList: [], // 人员
      categoryList: [], // 类目
      productList: [], // 商量
      countryList: [], // 国家
      supplierList: [], // 服务商
    };
  },
  mounted() {
    this.resetForm();
    this.searchSubmit();

    this.getDepartmentList();
    this.getUserList();
    this.getallcategory();
    this.getproductInfoList();
    this.getCountrySelectList();
    this.querySupplierList();
  },
  methods: {
    // 搜索提交
    searchSubmit() {
      this.$emit('searchSubmit', this.formModal);
    },
    // 重置
    resetForm() {
      this.formModal = {
        // limit: 10,
        // page: 1,
        type: 0, // 分页类型 0:所有 1:销售额趋势 2:部门销售排行 3:类目销售排行 4:国家销售分布 5:服务商销售排行 6:商品销售排行 7:人员销售排行
        timeType: 1, // 1:天 2:周 3:月 4:季度 5:年
        paymentTime: [
          moment(moment().startOf('day').subtract(6, 'days')).format('YYYY-MM-DD'),
          moment(moment().endOf('day')).format('YYYY-MM-DD'),
        ],
        // departmentIdList: [], // 部门
        // attributionIdList: [], // 订单跟进人列表
        // productCategoryId: [], // 类目ID列表
        // productSkuIdList: [], // 商品SKUID列表
        // countryCodeList: [], // 国家编码列表
        // supplierIdList: [], // 服务商列表
      };
    },

    // 获取部门列表
    getDepartmentList() {
      getDepartmentTree().then((res) => {
        if (res.code === 0) {
          this.departmentList = this.filterTree(res.data, 'childXcloudOrgDepartmentListVO');
        }
      });
    },
    // 获取人员
    getUserList() {
      getAllUsers().then((res) => {
        this.userList = res.data;
      });
    },
    // 获取所有商品类目和属性，级联选择器分类数据
    getallcategory() {
      getallcategory()
        .then((res) => {
          if (res.code === 0) {
            this.allCateGories = res.data;
            this.categoryList = this.getCategory(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取商品
    getproductInfoList() {
      getproductInfoList()
        .then((res) => {
          const list = res.data.records || [];
          this.productList = list.map((v) => {
            return {
              value: v.productId,
              label: v.productName,
              children: v.productSkuVOList.map((sku) => {
                return {
                  value: sku.skuId,
                  label: sku.skuName || v.productName,
                };
              }),
            };
          });
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 获取国家下拉框数据
    getCountrySelectList() {
      getCountrySelectList()
        .then((res) => {
          this.countryList = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 获取服务商和律师信息
    querySupplierList() {
      getSupplierAttorneyInfoList().then((res) => {
        if (res.code === 0) {
          this.supplierList = res.data;
        }
      });
    },
    // 过滤为空的子列表
    filterTree(data, childrenKey) {
      data = data.filter((item) => item.status === 1);
      data.forEach((item) => {
        if (item[childrenKey].length) {
          item[childrenKey] = this.filterTree(item[childrenKey], childrenKey);
        } else {
          item[childrenKey] = undefined;
        }
      });
      return data;
    },
    // 递归格式化所有商品类目和属性
    getCategory(arr) {
      return arr.map((res) => {
        const t = res.childrenProductCategoryVo;
        const obj = {
          label: res.categoryName,
          value: res.id,
        };
        t.length === 0
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
  },
};
</script>

<style lang="less" scoped>
.search-box {
  padding: 20px 0;
  .time-type {
    width: 120px;
    float: left;
    margin-right: 6px;
  }
}
</style>
