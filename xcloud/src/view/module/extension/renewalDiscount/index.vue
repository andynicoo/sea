<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="80px">
          <el-form-item label="优惠名称" prop="renewalName">
            <el-input v-model="form.renewalName" placeholder="请输入优惠名称" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="业务分类" prop="functionCode">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable v-model="form.functionCode">
              <el-option v-for="item in functionCodeList" :key="item.value" :label="item.dataValue" :value="item.dataCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家" prop="countryCode">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.countryCode">
              <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable v-model="form.status">
              <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset"> 重置 </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <el-button type="primary" size="small" class="green-btn" @click="editRenewalDiscount()" v-show="hasAuthority('E2_16')">
                <i class="icon icon-square-add"></i>
                <span>新增</span>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="优惠名称" min-width="180px" show-overflow-tooltip prop="renewalName"></el-table-column>
        <el-table-column align="center" label="优惠形式" min-width="150px" show-overflow-tooltip prop="renewalMethod">
          <template slot-scope="scope">
            {{ scope.row.renewalMethod | filterRenewalMethod }}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="150px" label="提前天数" show-overflow-tooltip prop="createTime">
          <template slot-scope="scope"> {{ scope.row.beforeMinDay }} ~ {{ scope.row.beforeMaxDay }}天 </template>
        </el-table-column>
        <el-table-column align="center" min-width="100px" label="优惠力度" show-overflow-tooltip prop="renewalDiscount">
          <template slot-scope="scope"> {{ scope.row.renewalDiscount }}折 </template>
        </el-table-column>
        <el-table-column align="center" min-width="200px" label="适用业务分类" show-overflow-tooltip prop="functionCodeName"> </el-table-column>
        <el-table-column align="center" min-width="200px" label="适用国家" show-overflow-tooltip prop="countryNames"></el-table-column>
        <el-table-column align="center" min-width="100px" label="状态" show-overflow-tooltip prop="status">
          <template slot-scope="scope">
            {{ scope.row.status | filterStatus(statusList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="188" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-link type="primary" :underline="false" @click="editRenewalDiscount(scope.row.renewalOfferId)" v-show="hasAuthority('E2_17')">
                <i class="icon icon-edit"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip :content="scope.row.status === 1 ? '禁用' : '启用'" placement="top">
              <el-link type="primary" :underline="false" @click="disabledRenewalDiscount(scope.row)" v-if="hasAuthority('E2_18')">
                <i :class="['icon', scope.row.status === 1 ? 'icon-disable' : 'icon-use']"></i>
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getRenewalList, enableRenewal } from '@/api/newApi/extension/renewalDiscount';
import { getCountrySelectList, getBaseDataByDataType } from '@/api/newApi/common';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  data() {
    return {
      tableLoading: false,
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        renewalName: '',
        functionCode: '',
        countryCode: '',
        status: '',
      },
      cacheKey: 'form',
      copyListQuery: {},
      createTime: '',
      functionCodeList: [],
      statusList: [
        { label: '禁用', value: 0 },
        { label: '启用', value: 1 },
      ],
      searchFlag: false,
      countrySelectList: [],
    };
  },
  filters: {
    filterStatus(status, statusList) {
      let s = statusList.find((item) => item.value === status);
      return s ? s.label : status;
    },
    filterRenewalMethod(renewalMethod) {
      switch (renewalMethod) {
        case 1:
          return '按提前天数';
      }
    },
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    this._getCountrySelectList();
    this.getFunctionCodeList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      this.setPageCache();
      getRenewalList(this.form)
        .then((res) => {
          this.list = res.data.records;
          this.list.forEach((item) => {
            item.countryNames = item.renewalOfferCountryVOS.map((c) => c.countryName).join(',');
          });
          this.total = parseInt(res.data.total);
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
    // 获取业务类型
    getFunctionCodeList() {
      getBaseDataByDataType({
        dataType: this.$constant.dataType.FUNCTION_CODE_RENEWAL,
      }).then((res) => {
        res.data.forEach((item) => {
          item.dataCode = +item.dataCode;
        });
        this.functionCodeList = res.data;
      });
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
    reset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
    editRenewalDiscount(id) {
      let params = {
        path: '/extension/renewalDiscount/addOrEdit',
      };
      if (id) {
        params = {
          ...params,
          query: {
            id,
          },
        };
      }
      this.$router.push(params);
    },
    disabledRenewalDiscount(row) {
      this.$confirm(`确认${row.status === 1 ? '禁用' : '启用'}此续费优惠？`, '确认提醒', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.tableLoading = true;
        enableRenewal({
          renewalOfferId: row.renewalOfferId,
          type: 1 - row.status,
        })
          .then((res) => {
            if (res.code == 0) {
              this.$message('操作成功');
              this.getList();
            }
            this.tableLoading = false;
          })
          .catch((err) => {
            this.tableLoading = false;
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
</style>
