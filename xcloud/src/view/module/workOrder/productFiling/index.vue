<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="110px">
          <el-form-item label="搜索内容" prop="searchKeyword">
            <el-tooltip content="支持服务号/订单号/公司中文名称/公司英文名称搜索" placement="top">
              <el-input v-model="form.searchKeyword" placeholder="服务号/订单号" type="textarea" :rows="1" clearable style="width: 168px" size="small" />
            </el-tooltip>
          </el-form-item>
          <!-- <el-form-item label="服务号" prop="serviceNo">
            <el-input v-model="form.serviceNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item> -->
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh-left" @click="reset"> 重置 </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <el-button size="small" type="primary" @click="changeManager" class="green-btn" v-show="hasAuthority('Y1_1')">
                <i class="icon icon-change"></i>
                <span>修改交付专员</span>
              </el-button>
              <el-button type="success" icon="el-icon-edit" @click="batchChangeCustom" v-show="hasAuthority('Y1_8')"> 修改客服 </el-button>
            </div>
          </el-form-item>

          <div v-show="moreSerch">
            <el-form-item label="公司中文名称" prop="companyName" label-width="200">
              <el-input v-model="form.companyName" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="授权国家" prop="country">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable @change="countryChange" v-model="form.country">
                <el-option v-for="item in countrySelectList" :key="item.countryCode" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务进度" prop="serviceProcess">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.serviceProcess">
                <el-option v-for="item in progressBarList" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务状态" prop="status">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.status">
                <template v-for="item in statusList">
                  <el-option :value="item.value" :label="item.label" :key="item.value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="服务商" prop="supplierId">
              <el-select style="width: 168px" v-model="form.supplierId" size="small" clearable filterable placeholder="请选择">
                <el-option v-for="item in supplierList" :key="item.id" :value="item.id" :label="item.shortName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="自然人姓名" prop="naturalPerson">
              <el-input v-model="form.naturalPerson" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="客服" prop="customerId">
              <el-select style="width: 168px" v-model="form.customerId" placeholder="客服" clearable filterable>
                <el-option v-for="(item, index) in commissionerList" :key="index" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="createTime" label="服务创建时间">
              <el-date-picker
                v-model="form.createTime"
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
            <el-form-item prop="auditTime" label="审核时间">
              <el-date-picker
                v-model="form.auditTime"
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
            <el-form-item prop="completeTime" label="备案完成时间">
              <el-date-picker
                v-model="form.completeTime"
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
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <!-- <div class="table-container-title">
        <div>查询表格</div>
        
      </div> -->
      <el-tabs ref="elTabs" v-model="tabNav" @tab-click="tabClick">
        <el-tab-pane name="-1" label="全部"></el-tab-pane>
        <el-tab-pane :label="item.label" :name="item.value" v-for="(item, index) in progressBarList" :key="index"></el-tab-pane>
      </el-tabs>
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column type="selection" align="center" width="55" fixed="left"></el-table-column>
        <el-table-column align="center" width="200" label="服务号" show-overflow-tooltip prop="serviceNo"></el-table-column>
        <el-table-column align="center" width="200" label="备案工单号" show-overflow-tooltip prop="workNo"></el-table-column>
        <el-table-column align="center" width="150" label="服务进度" show-overflow-tooltip prop="statusLabel"></el-table-column>
        <el-table-column align="center" width="200" label="注册主体名称" show-overflow-tooltip prop="bodyName"></el-table-column>
        <el-table-column align="center" width="150" label="国家" show-overflow-tooltip prop="countryNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="协议生效日" sortable show-overflow-tooltip prop="agreementBeginTime"></el-table-column>
        <el-table-column align="center" width="150" label="协议到期日" sortable show-overflow-tooltip prop="agreementEndTime"></el-table-column>
        <el-table-column align="center" width="150" label="服务商" show-overflow-tooltip prop="supplierName"></el-table-column>
        <el-table-column align="center" label="驳回详情" show-overflow-tooltip prop="sender">
          <template slot-scope="scope">
            <el-link v-if="hasAuthority('Y1_2') && scope.row.existReject" @click="checkRejectInfo(scope.row)" type="primary"><i class="icon icon-search-small"></i>查看</el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          width="150"
          label="交付专员"
          show-overflow-tooltip
          prop="handlerName"
        >
          <template slot-scope="scope">{{ scope.row.handlerName || '-' }}</template>
        </el-table-column> -->
        <el-table-column align="center" label="状态" show-overflow-tooltip prop="status">
          <template slot-scope="scope">{{ scope.row.status | filterStatus(statusList) }}</template>
        </el-table-column>
        <el-table-column align="center" label="处理人" width="150">
          <template slot-scope="scope">
            <span style="white-space: pre-wrap">{{ scope.row.handler }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="客户手机号" show-overflow-tooltip prop="userMobile"></el-table-column>
        <el-table-column align="center" width="100" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top" v-show="hasAuthority('Y1_3')">
              <el-link type="primary" :underline="false" @click="detail(scope.row)">
                <i class="icon icon-see"></i>
                <!-- 查看 -->
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <ChangeManagerDialog :changeManagerDialog.sync="changeManagerDialog" :userList="managerList" :workIds="checkIds" @refresh="getList"></ChangeManagerDialog>
    <checkRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :serviceNo="checkItem.serviceNo" :workNo="checkItem.workNo" />
    <CustomerDialog :typeNum="3" :changeCustomerModel.sync="changeCustomerModel" :serviceIds="serviceIds" :commissionerList="commissionerList" :queryData="getList"></CustomerDialog>
  </div>
</template>

<script>
import { progressBarList, progressBarObj } from './enumObj';
import * as comps from './components/index';
import { getDisposelist } from '@/api/newApi/common.js';
import { getFilingList } from '@/api/newApi/workOrder/productFiling';
import { getHandlerUserList } from '@/api/newApi/supplyChain/allocationRules.js';
import cacheQuery from '@/mixins/cacheQuery';
import CustomerDialog from '@/view/module/newTaxServices/taxNumDeclare/components/customerDialog';
import { getUserListByRole } from '@/api/newApi/common';
export default {
  data() {
    return {
      list: [],
      tabNav: '-1',
      total: 0,
      form: {
        page: 1,
        limit: 20,
        companyName: '',
        mobile: '',
        serviceNo: '',
        country: '',
        serviceProcess: '',
        customerId: '',
        status: '',
        supplierId: '',
        naturalPerson: '',
        auditTime: [],
        completeTime: [],
        createTime: [],
        searchKeyword: '',
      },
      cacheKey: 'form',
      copyListQuery: {},
      exportForm: {},
      managerList: [],
      supplierList: [],
      serviceIds: [],
      changeCustomerModel: false,
      commissionerList: [],
      countrySelectList: [
        { countryCode: 'GB', countryNameZh: '英国' },
        { countryCode: 'EU', countryNameZh: '欧盟' },
      ],
      checkItem: {},
      tableLoading: false,
      searchFlag: false,
      changeManagerDialog: false,
      checkRejectInfoDialog: false,
      statusList: [
        { label: '服务中', value: 1 },
        { label: '已取消', value: 9 },
        { label: '取消中', value: 11 },
      ],
      progressBarList: progressBarList,
      progressBarObj: progressBarObj,
      remarkObj: {},
      checkIds: [],
      moreSerch: false,
    };
  },
  mixins: [cacheQuery],
  components: { ...comps, CustomerDialog },
  watch: {
    'form.country'(val) {
      if (val) {
        this.getSuppliers();
      } else {
        this.form.supplierId = '';
        this.supplierList = [];
      }
    },
  },
  filters: {
    filterStatus(status, statusList) {
      let result = statusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    this.getCustomerList();
    this.getManagerList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      this.formatTime();
      this.setPageCache();
      let { createTime, auditTime, completeTime, ...formData } = this.form;
      getFilingList(formData)
        .then((res) => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tabNav = this.form.serviceProcess === '' ? '-1' : this.form.serviceProcess;
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
    formatTime() {
      [this.form.completeStart, this.form.completeEnd] = this.form.completeTime && this.form.completeTime.length ? this.form.completeTime : ['', ''];
      [this.form.auditTimeStart, this.form.auditTimeEnd] = this.form.auditTime && this.form.auditTime.length ? this.form.auditTime : ['', ''];
      [this.form.beginTime, this.form.endTime] = this.form.createTime && this.form.createTime.length ? this.form.createTime : ['', ''];
    },
    batchChangeCustom() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      this.serviceIds = this.checkIds;
      this.changeCustomerModel = true;
    },
    // 获取客服
    getCustomerList() {
      getUserListByRole({
        roleCode: this.$constant.VAT_CUSTOMER_SERVICE,
      }).then((res) => {
        console.log(res);
        this.commissionerList = res.data;
      });
    },
    // 获取交付专员列表
    getManagerList() {
      getDisposelist({
        functionCode: this.$constant.AUTHORIZEDREPRESENT_FUNCTION_CODE,
      }).then((res) => {
        this.managerList = res.data;
      });
    },

    // 获取服务商列表
    getSuppliers() {
      getHandlerUserList({
        supplierType: 1,
        functionCode: this.$constant.AUTHORIZEDREPRESENT_FUNCTION_CODE,
        countryCode: this.form.country,
        countryCodeList: [this.form.country],
      }).then((res) => {
        this.supplierList = res.data;
      });
    },
    countryChange(val) {
      this.form.supplierId = '';
    },
    handleSelectionChange(val) {
      this.checkIds = val.map((item) => item.id);
    },
    tabClick() {
      this.form.serviceProcess = this.tabNav === '-1' ? '' : this.tabNav;
      if (this.tabNav === '-1') {
        this.form.status = '';
      } else {
        this.form.status = 1;
      }
      this.form.page = 1;
      this.getList();
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
    // 修改交付专员
    changeManager() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择数据');
        return;
      }
      this.changeManagerDialog = true;
    },
    // 查看驳回详情
    checkRejectInfo(row) {
      this.checkItem = row;
      this.checkRejectInfoDialog = true;
    },
    detail(row) {
      this.$router.push({
        path: '/productFiling/detail',
        query: {
          id: row.id,
          serviceId: row.serviceId,
        },
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
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}
</style>
