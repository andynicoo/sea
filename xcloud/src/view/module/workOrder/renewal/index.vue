<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <!-- <el-form-item label="搜索内容" prop="searchKeyword">
            <el-tooltip content="支持服务号/订单号/公司中文名称/公司英文名称搜索" placement="top">
              <el-input
                v-model="form.searchKeyword"
                placeholder="服务号/订单号"
                clearable
                style="width: 168px"
                size="small"
              />
            </el-tooltip>
          </el-form-item> -->
          <el-form-item label="续费服务号" prop="newServiceNo">
            <el-input v-model="form.newServiceNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="续费订单号" prop="newOrderNo">
            <el-input v-model="form.newOrderNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="原服务号" prop="oldServiceNo">
            <el-input v-model="form.oldServiceNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="原订单号" prop="oldOrderNo">
            <el-input v-model="form.oldOrderNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset"> 重置 </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <el-button size="small" type="primary" @click="_export" class="yellow-btn" v-show="hasAuthority('S1_1')">
                <i class="icon icon-export"></i>
                <span>导出</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="国家" prop="countryCode">
              <el-select style="width: 168px" v-model="form.countryCode" size="small" clearable filterable placeholder="请选择" @change="countryChange">
                <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务商" prop="supplierId">
              <el-select style="width: 168px" v-model="form.supplierId" size="small" clearable filterable placeholder="请选择">
                <el-option v-for="item in supplierList" :key="item.id" :value="item.id" :label="item.shortName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司中文名称" prop="companyNameZh">
              <el-input v-model="form.companyNameZh" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="公司英文名称" prop="companyNameEn">
              <el-input v-model="form.companyNameEn" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="客户手机号" prop="userMobile">
              <el-input v-model="form.userMobile" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="服务分类" prop="productFunctionCode">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.productFunctionCode">
                <el-option v-for="item in productCodeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务商编码" prop="supplierCode">
              <el-input v-model="form.supplierCode" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="订单创建时间" prop="createTime">
              <el-date-picker v-model="form.createTime" type="daterange" align="right" size="small" clearable unlink-panels start-placeholder="开始时间" end-placeholder="结束时间" range-separator="到" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" style="width: 340px">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <!-- <div class="table-container-title">
        <div>查询表格</div>
        
      </div> -->
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70" fixed="left">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="200" label="续费服务号" show-overflow-tooltip prop="newServiceNo">
          <template slot="header">
            续费服务号
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">
                VAT申报续费是在原服务上延长服务期，续费服务号与原服务号一致；<br />
                授权代表续费生成新的服务号，与原服务号不一致
              </div>
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务名称" show-overflow-tooltip prop="serviceName"></el-table-column>
        <el-table-column align="center" width="150" label="国家" show-overflow-tooltip prop="countryNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="服务商" show-overflow-tooltip prop="supplierName"></el-table-column>
        <el-table-column align="center" width="150" label="服务商编码" show-overflow-tooltip prop="supplierCode"></el-table-column>
        <el-table-column align="center" width="150" label="公司中文名称" show-overflow-tooltip prop="companyNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="公司英文名称" show-overflow-tooltip prop="companyNameEn"></el-table-column>
        <el-table-column align="center" width="150" label="客户手机号" show-overflow-tooltip prop="userMobile"></el-table-column>
        <el-table-column align="center" width="150" label="续费订单号" show-overflow-tooltip prop="newOrderNo"> </el-table-column>
        <el-table-column align="center" width="150" label="订单状态" show-overflow-tooltip prop="newOrderStatus">
          <template slot-scope="{ row }">
            {{ row.newOrderStatus | filterOrderStatus }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务金额（元）" sortable show-overflow-tooltip prop="productMoney">
          <template slot-scope="scope">{{ scope.row.productMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="优惠金额（元）" sortable show-overflow-tooltip prop="discountAmount">
          <template slot-scope="scope">{{ scope.row.discountAmount | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="实付金额（元）" sortable show-overflow-tooltip prop="amountMoney">
          <template slot-scope="scope">{{ scope.row.amountMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="订单创建时间" sortable show-overflow-tooltip prop="orderCreateTime">
          <template slot="header">
            订单创建时间
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">指续费订单的创建时间</div>
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务截止时间" sortable show-overflow-tooltip prop="expirationTime"></el-table-column>
        <el-table-column align="center" width="200" label="原服务号" show-overflow-tooltip prop="oldServiceNo"></el-table-column>
        <el-table-column align="center" width="150" label="原订单号" show-overflow-tooltip prop="oldOrderNo"></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getRenewalList, renewalExport } from '@/api/newApi/workOrder/renewal';
import { findSuppliers } from '@/api/newApi/processFields/processConfig.js';
import { getHandlerUserList } from '@/api/newApi/supplyChain/allocationRules.js';
import { getCountrySelectList } from '@/api/newApi/common';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  data() {
    return {
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        oldServiceNo: '',
        oldOrderNo: '',
        newServiceNo: '',
        newOrderNo: '',
        productFunctionCode: '',
        countryCode: '',
        supplierId: '',
        companyNameZh: '',
        companyNameEn: '',
        userMobile: '',
        supplierCode: '',
        createTime: [],
      },
      cacheKey: 'form',
      copyListQuery: {},
      exportForm: {},
      productCodeList: [
        { label: '转代理+申报', value: 2 },
        { label: '注册+申报', value: 5 },
        { label: '授权代表', value: 16 },
        { label: 'IOSS注册+申报', value: 23 },
      ],
      supplierList: [],
      countrySelectList: [],
      checkItem: {},
      tableLoading: false,
      searchFlag: false,
      statusList: [],
      remarkObj: {},
      moreSerch: false,
    };
  },
  mixins: [cacheQuery],
  watch: {
    'form.countryCode'(val) {
      if (val) {
        this.getSuppliers();
      } else {
        this.form.supplierId = '';
        this.supplierList = [];
      }
    },
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    this._getCountrySelectList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      [this.form.orderCreateTimeStart, this.form.orderCreateTimeEnd] = this.form.createTime && this.form.createTime.length ? this.form.createTime : ['', ''];
      this.setPageCache();
      let { createTime, ...formData } = this.form;
      getRenewalList(formData)
        .then((res) => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.exportForm = { ...this.form };
          this.tableLoading = false;
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: 'success',
              duration: 2000,
            });
            this.searchFlag = false;
          }
        })
        .catch((err) => {
          this.searchFlag = false;
        });
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    // 获取服务商列表
    getSuppliers() {
      getHandlerUserList({
        supplierType: 1,
        countryCode: this.form.countryCode,
        countryCodeList: [this.form.countryCode],
      }).then((res) => {
        this.supplierList = res.data;
      });
    },
    countryChange(val) {
      this.form.supplierId = '';
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.getList();
    },
    // 导出
    _export() {
      renewalExport(this.exportForm).then((res) => {
        this.$util.exportExcel(res);
      });
    },
    reset() {
      // if (this.$refs.searchForm) {
      //   this.$refs.searchForm.resetFields();
      // }
      this.supplierList = [];
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
</style>
