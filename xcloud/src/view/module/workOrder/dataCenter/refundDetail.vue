<template>
  <div class="app-container" v-loading="exportLoading" element-loading-text="正在生成导出数据">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px" @keydown.enter.native="search">
          <el-form-item label="订单号 " prop="orderNo">
            <el-input v-model="form.orderNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="退款状态" prop="refundStatus">
            <el-select style="width: 168px" v-model="form.refundStatus" size="small" filterable clearable placeholder="请选择">
              <el-option :label="item.label" :value="item.value" v-for="item in refundStatusList" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" :loading="tableLoading" @click="search"> 搜索 </el-button>
            <el-button icon="el-icon-refresh" @click="reset" size="small"> 重置 </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group" v-show="hasAuthority('K2_4')">
              <el-button size="small" type="primary" :disabled="exportLoading" @click="_export" class="yellow-btn">
                <i class="icon icon-export"></i>
                <span>导出</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="申请时间" prop="applyTime">
              <el-date-picker v-model="form.applyTime" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="退款时间" prop="refundTime">
              <el-date-picker v-model="form.refundTime" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="选择国家" prop="countryCode">
              <el-select style="width: 168px" v-model="form.countryCode" size="small" clearable filterable multiple placeholder="请选择">
                <el-option v-for="item in countrySelectList" :key="item.countryCode" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品分类" prop="productCategoryId">
              <el-cascader
                ref="productCategory"
                style="width: 168px"
                clearable
                filterable
                v-model="form.productCategoryId"
                :options="serviceCascader"
                collapse-tags
                :props="{
                  multiple: true,
                  children: 'childrenProductCategoryVo',
                  value: 'id',
                  label: 'categoryName',
                }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="客户手机号" prop="userMobile">
              <el-input v-model="form.userMobile" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="所属企业" prop="enterpriseId">
              <el-select style="width: 168px" v-model="form.enterpriseId" size="small" filterable placeholder="请选择">
                <el-option v-for="(item, index) in firmList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择部门" prop="departmentIds">
              <el-cascader
                size="small"
                ref="department"
                :options="departmentList"
                :props="{
                  multiple: true,
                  label: 'departmentName',
                  value: 'departmentId',
                  children: 'childXcloudOrgDepartmentListVO',
                  emitPath: false,
                }"
                collapse-tags
                filterable
                clearable
                v-model="form.departmentIds"
                @change="departmentChange"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="跟进人" prop="attributionId">
              <el-select style="width: 168px" v-model="form.attributionId" size="small" filterable clearable placeholder="请选择">
                <el-option :label="item.nickName" :value="item.userId" v-for="item in userList" :key="item.userId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="付款类型" prop="paymentType">
              <el-select style="width: 168px" v-model="form.paymentType" size="small" filterable clearable placeholder="请选择">
                <el-option :label="item.label" :value="item.value" v-for="item in payWayList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单类型" prop="orderType">
              <el-select style="width: 168px" v-model="form.orderType" size="small" filterable clearable placeholder="请选择">
                <el-option :label="item.label" :value="item.value" v-for="item in orderTypeList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" border :data="list" v-loading="tableLoading" show-summary :summary-method="getSummaries" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" width="170" label="退款单号" show-overflow-tooltip prop="refundNo" fixed="left"></el-table-column>
        <el-table-column align="center" width="200" label="销售订单号" show-overflow-tooltip prop="orderNo"> </el-table-column>
        <el-table-column align="center" width="200" label="支付单号" show-overflow-tooltip prop="payOrderId"> </el-table-column>
        <el-table-column align="center" width="200" label="申请时间" sortable show-overflow-tooltip prop="createTime"> </el-table-column>
        <el-table-column align="center" width="200" label="申请人" sortable show-overflow-tooltip prop="applyName"> </el-table-column>
        <el-table-column align="center" width="200" label="申请人部门" sortable show-overflow-tooltip prop="applyDepartment"> </el-table-column>
        <el-table-column align="center" width="200" label="客户手机号" show-overflow-tooltip prop="userMobile">
          <template slot-scope="{ row }">{{ row.userMobile | filterMobile(hasAuthority('K2_5')) }}</template>
        </el-table-column>
        <el-table-column align="center" width="200" label="国家" show-overflow-tooltip prop="countryCodeNameZh"> </el-table-column>
        <el-table-column align="center" width="200" label="商品名称" show-overflow-tooltip prop="productName"> </el-table-column>
        <el-table-column align="center" width="200" label="服务金额（元）" sortable show-overflow-tooltip prop="orderMoney">
          <template slot-scope="scope">{{ scope.row.orderMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" width="200" label="商品分类" show-overflow-tooltip prop="productCategoryName"> </el-table-column>
        <el-table-column align="center" width="200" label="已付金额（元）" sortable show-overflow-tooltip prop="amountMoney">
          <template slot-scope="scope">{{ scope.row.amountMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" width="200" label="退款金额（元）" sortable show-overflow-tooltip prop="refundMoney">
          <template slot-scope="scope">{{ scope.row.refundMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" width="200" label="退款状态" show-overflow-tooltip prop="refundStatusName"> </el-table-column>
        <el-table-column align="center" width="200" label="付款类型" show-overflow-tooltip prop="paymentTypeName"> </el-table-column>
        <el-table-column align="center" width="200" label="订单类型" show-overflow-tooltip prop="orderTypeName"> </el-table-column>
        <el-table-column align="center" width="200" label="订单状态" show-overflow-tooltip prop="statusName"> </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { refundDetailPage, refundDetailTotal, refundDetailExport } from '@/api/newApi/dataCenter/refundDetail';
import { getFirm, getCountrySelectList, getFunctionCode } from '@/api/newApi/common.js';
import { getallcategory } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { getDepartmentTree } from '@/api/department.js';
import { getUsers } from '@/api/user';
export default {
  data() {
    return {
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        orderNo: '',
        refundStatus: '',
        countryCode: [],
        productCategoryId: [],
        attributionId: '',
        departmentIds: '',
        enterpriseId: '',
        userMobile: '',
        paymentType: '',
        orderType: '',
        applyTime: [],
        refundTime: [],
      },
      summariesData: {},
      refundStatusList: [
        { label: '待审核', value: 0 },
        { label: '待退款', value: 1 },
        { label: '已退款', value: 2 },
        { label: '审核不通过', value: 3 },
        { label: '已取消', value: 4 },
      ],
      payWayList: [
        { label: '正常付款', value: 0 },
        { label: '分期付款', value: 2 },
        { label: '挂账付款', value: 1 },
      ],
      orderTypeList: [
        { label: '正常订单', value: 0 },
        { label: '续费订单', value: 1 },
        { label: '项目制订单', value: 2 },
        { label: '溢价订单', value: 3 },
      ],
      departmentList: [],
      firmList: [],
      tableLoading: false,
      searchFlag: false,
      moreSerch: false,
      functionCode: [],
      countrySelectList: [],
      exportLoading: false,
      copyForm: {},
      serviceCascader: [],
      userList: [],
    };
  },
  filters: {
    filterMobile(mobile, isShowMobile) {
      if (isShowMobile || !mobile) {
        return mobile;
      } else {
        try {
          return mobile.substr(0, 3) + '****' + mobile.substr(7);
        } catch (error) {
          return mobile;
        }
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.getTime();
      await this.getfirmList();
      this.getDepartmentList();
      this._getCountrySelectList();
      this._getallcategory();
      this.getSummariesData();
      this.getList();
    },
    getTime() {
      let date = new Date();
      date.setDate(1);
      this.form.applyTime = this.$util.getEndTime([this.$util.formatDate(date), this.$util.formatDate(new Date())]);
    },
    formatParams() {
      [this.form.startTime, this.form.endTime] = this.form.applyTime && this.form.applyTime.length ? this.form.applyTime : ['', ''];
      [this.form.refundTimeStart, this.form.refundTimeEnd] = this.form.refundTime && this.form.refundTime.length ? this.form.refundTime : ['', ''];
      let { applyTime, refundTime, ...formData } = {
        ...this.form,
        productCategoryId: this.$refs.productCategory
          .getCheckedNodes()
          .map((n) => n.value)
          .join(','),
        countryCode: this.form.countryCode.join(','),
        departmentIds: this.$refs.department
          .getCheckedNodes()
          .map((n) => n.value)
          .join(','),
      };
      return this.$util.removePropertyOfNull(formData);
    },
    getList() {
      this.tableLoading = true;
      let { applyTime, ...formData } = this.formatParams();
      refundDetailPage(this.formatParams())
        .then((res) => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          this.copyForm = { ...this.formatParams() };
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
    // 获取其他部门列表
    getDepartmentList() {
      getDepartmentTree().then((res) => {
        if (res.code === 0) {
          this.departmentList = this.filterTree(res.data, 'childXcloudOrgDepartmentListVO');
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
    // // 更改部门
    departmentChange() {
      this.form.attributionId = '';
      this.form.userList = [];
      this._getUser();
    },
    // 获取跟进人列表
    _getUser() {
      getUsers({
        page: 1,
        limit: 9999,
        departmentIds: this.$refs.department
          .getCheckedNodes()
          .map((n) => n.value)
          .join(','),
      }).then((res) => {
        let data = res.data.records;
        data.forEach((item) => {
          if (item.status === 0) {
            item.nickName += '(禁用)';
          } else if (item.status === 2) {
            item.nickName += '(锁定)';
          }
        });
        this.userList = data;
      });
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    // 获取商品分类
    _getFunctionCode() {
      getFunctionCode().then((res) => {
        this.functionCode = res.data;
      });
    },
    /**
     * 获取所有商品类目和属性，级联选择器分类数据
     */
    _getallcategory() {
      getallcategory().then((res) => {
        if (res.code == 0) {
          this.formatCategory(res.data);
          this.serviceCascader = res.data;
        }
      });
    },
    formatCategory(data) {
      data.forEach((item) => {
        if (item.childrenProductCategoryVo && item.childrenProductCategoryVo.length) {
          this.formatCategory(item.childrenProductCategoryVo);
        } else {
          item.childrenProductCategoryVo = void 0;
        }
      });
    },
    getSummariesData() {
      refundDetailTotal(this.formatParams()).then((res) => {
        if (res.code === 0) {
          this.summariesData = res.data;
        }
      });
    },
    getSummaries(param) {
      const { columns } = param;
      let sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        let key = column.property;
        let formatQianFenWei = this.$options.filters['formatQianFenWei'];
        switch (key) {
          case 'orderMoney':
            return (sums[index] = formatQianFenWei(this.summariesData.orderMoney));
          case 'amountMoney':
            return (sums[index] = formatQianFenWei(this.summariesData.amountMoney));
          case 'refundMoney':
            return (sums[index] = formatQianFenWei(this.summariesData.refundMoney));
        }
      });
      return sums;
    },
    /**
     * 获取企业列表
     */
    getfirmList() {
      return new Promise((resolve) => {
        getFirm().then((res) => {
          if (res.code === 0) {
            this.firmList = res.data;
            if (res.data.length) {
              let enterprise = res.data.find((e) => e.id + '' === localStorage.getItem('enterpriseId'));
              this.form.enterpriseId = enterprise ? enterprise.id : res.data[0].id;
            }
          }
          resolve();
        });
      });
    },
    _export() {
      let { applyTime, refundTime } = this.form;
      let validTime = !((applyTime && applyTime.length) || (refundTime && refundTime.length));

      if (validTime) {
        this.$message.warning('请先确认时间范围，再进行数据导出');
        return;
      } else if (this.getTimeLong(refundTime, applyTime)) {
        this.$message.warning('最多可导出一年内的数据');
        return;
      }
      this.exportLoading = true;
      let data = {
        ...this.copyForm,
        enterPriseName: '',
      };
      let enterPrise = this.firmList.find((item) => item.id === this.copyForm.enterpriseId);
      if (enterPrise) {
        data.enterPriseName = enterPrise.name;
      }
      refundDetailExport(data)
        .then((res) => {
          this.exportLoading = false;
          this.$message.success('数据导出完成');
          this.$util.exportExcel(res, '退款明细');
        })
        .catch((e) => {
          this.exportLoading = false;
          this.$message.error('数据导出失败');
        });
    },

    getTimeLong(refundTime, applyTime) {
      if (refundTime || applyTime) {
        return applyTime ? this.$util.isOverYear(applyTime) : this.$util.isOverYear(refundTime);
      } else {
        return false;
      }
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
    async search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.getSummariesData();
      this.getList();
    },
    reset() {
      if (this.$refs.searchForm) {
        this.$refs.searchForm.resetFields();
      }
      if (this.firmList.length) {
        let enterprise = this.firmList.find((e) => e.id + '' === localStorage.getItem('enterpriseId'));
        this.form.enterpriseId = enterprise ? enterprise.id : this.firmList[0].id;
      }
      this.getTime();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
</style>
