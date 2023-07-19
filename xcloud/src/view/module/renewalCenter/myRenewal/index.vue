<template>
  <div class="main-wrapper">
    <ChooseCompanyDialog :chooseCompanyDialog.sync="chooseCompanyDialog" @changeCompany="changeCompany" />
    <div class="app-container">
      <div class="header-container" ref="searchBox">
        <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
          <div class="choose-company" @click="chooseCompanyDialog = !chooseCompanyDialog">
            <i class="fold-icon" :class="`el-icon-s-${chooseCompanyDialog ? '' : 'un'}fold`"></i>
            <span>速选公司</span>
          </div>
          <el-form :model="form" ref="searchForm" inline>
            <el-form-item prop="userMobile">
              <el-input v-model="form.userMobile" placeholder="请输入手机号" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="国家" prop="countryList">
              <el-select style="width: 168px" v-model="form.countryList" placeholder="请选择" clearable multiple filterable>
                <el-option v-for="item in countryList" :value="item.countryCode" :key="item.id" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务类型" prop="serviceType">
              <el-select style="width: 168px" v-model="form.serviceType" placeholder="请选择" clearable filterable>
                <el-option v-for="item in serviceTypeList" :value="item.dataCode" :key="item.baseDataId" :label="item.dataValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务状态" prop="serviceStatus">
              <el-select style="width: 190px" v-model="form.serviceStatus" placeholder="请选择" clearable multiple filterable>
                <el-option v-for="item in serviceStatusList" :value="item.value" :key="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
              <el-button @click="resetSearchBox" icon="el-icon-refresh">重置</el-button>
              <el-button type="text" @click="handleMoreSearch">
                <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
                {{ moreSerch ? '收起' : '更多' }}筛选
              </el-button>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" @click="toRenew" v-show="hasAuthority('S2_1')">去续费</el-button>
              <el-button type="primary" :underline="false" :loading="exportLoading" @click="exportFn" v-show="hasAuthority('S2_2')">导出</el-button>
            </el-form-item>
            <div class="more-search" v-show="moreSerch">
              <el-form-item label="服务截至日期" prop="expirationTime" clearable>
                <el-date-picker
                  v-model="form.expirationTime"
                  type="daterange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="服务截至开始时间"
                  end-placeholder="服务截至结束时间"
                  :default-time="['00:00:00', '23:59:59']"
                  style="width: 340px"
                  align="right"
                  clearable
                  unlink-panels
                ></el-date-picker>
              </el-form-item>
              <el-form-item prop="serviceNo">
                <el-input v-model="form.serviceNo" placeholder="请输入服务号" clearable style="width: 168px" />
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-container">
        <el-tabs ref="elTabs" v-model="activeName" @tab-click="getList">
          <el-tab-pane :label="`${item.label}(${item.num})`" :name="item.value" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
        </el-tabs>
        <el-table ref="table" :data="tableData" border @selection-change="handleSelectionChange" v-loading="loading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
          <Empty slot="empty" />
          <el-table-column type="selection" align="center" width="55" fixed="left" :selectable="(row) => !row.disabled"> </el-table-column>
          <el-table-column label="序号" width="80" align="center" fixed="left">
            <template slot-scope="{ $index }">{{ $index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="userMobile" label="客户手机号" width="120" align="center" fixed="left">
            <template slot-scope="{ row }">
              <span v-hidden>{{ row.userMobile }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="companyNameZh" label="服务公司" width="150" align="center" fixed="left"></el-table-column>
          <el-table-column prop="productName" label="续费商品" width="120" align="center" fixed="left">
            <template slot="header">
              续费商品
              <el-tooltip class="item" effect="dark" content="如无续费商品或选择置灰则表示该商品暂时无法续费" placement="top-start">
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
            <template slot-scope="{ row }">{{ row.productName || '-' }}</template>
          </el-table-column>
          <el-table-column prop="countryNameZh" label="国家" width="120" align="center"></el-table-column>
          <el-table-column prop="workCategoryName" label="服务类型" width="120" align="center"></el-table-column>
          <el-table-column prop="productSpecName" label="续费服务" width="120" align="center">
            <template slot-scope="{ row }">{{ row.productSpecName || '-' }}</template>
          </el-table-column>
          <el-table-column prop="serviceNo" label="服务号" width="200" align="center"></el-table-column>
          <el-table-column prop="expirationTime" label="服务截止日期" width="150" align="center">
            <template slot-scope="{ row }">{{ $util.formatDateTime(row.expirationTime) || '-' }}</template>
          </el-table-column>
          <el-table-column prop="expirationTime" label="剩余服务时间" width="120" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.expirationTime">{{ row.expirationTime | filterRestTime }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="服务状态" width="120" align="center">
            <template slot-scope="{ row }">{{ row.status | serviceStatus }}</template>
          </el-table-column>
          <el-table-column prop="activityType" label="折扣" width="120" align="center">
            <template slot-scope="{ row }">{{ row.activityType | filterDiscount(row.activityContent) }}</template>
          </el-table-column>
          <el-table-column prop="productPrice" label="当前销售价" width="120" align="center">
            <template slot="header">
              当前销售价
              <el-tooltip class="item" effect="dark" content="显示折后价" placement="top-start">
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
            <template slot-scope="{ row }">
              <span v-if="row.productPrice !== ''">￥{{ row.productPrice | formatQianFenWei }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="historyRenewOrderNum" label="历史续费订单" width="120" align="center">
            <template slot="header">
              历史续费订单
              <el-tooltip class="item" effect="dark" content="只显示已付款，分期付款和有过退款的续费订单" placement="top-start">
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="followUserName" label="客户归属人" width="120" align="center">
            <template slot-scope="{ row }">
              <p v-for="(item,index) in row.followUserName.split('，')" :key="index">{{ item }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="followTime" label="最近跟进时间" width="150" align="center">
            <template slot-scope="{ row }">{{ row.followTime || '-' }}</template>
          </el-table-column>
          <el-table-column prop="followContent" label="最近跟进记录" show-overflow-tooltip width="150" align="center" fixed="right">
            <template slot-scope="{ row }">
              <span v-if="row.followContent.length">
                <div class="follow-content">{{ row.followContent[0] }}</div>
                <el-tag v-if="row.followContent.length > 1">{{ row.followContent[1] }}</el-tag>
              </span>
              <el-link type="primary" :underline="false" v-else @click="renewalDetail(row)">跟进</el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="70" align="center" fixed="right">
            <template slot-scope="{ row }">
              <el-tooltip effect="dark" content="查看详情" placement="top" v-if="hasAuthority('S2_3')">
                <el-link type="primary" :underline="false" @click="renewalDetail(row)" class="icon icon-see"></el-link>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50, 100]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
      <RenewalConfirmDialog :renewalConfirmDialog.sync="renewalConfirmDialog" :list="selectionList" />
      <RenewalDetailDialog :renewalDetailDialog.sync="renewalDetailDialog" :serviceId="row.serviceId" :row="row" @refresh="getList" />
    </div>
  </div>
</template>

<script>
import { getCountrySelectList, getBaseDataByDataType } from '@/api/newApi/common.js';
import { renewalList, renewalStatistical, renewalCenterExport } from '@/api/newApi/renewalCenter/myRenewal.js';
import cacheQuery from '@/mixins/cacheQuery';
import * as comps from './components';
import { cloneDeep } from 'lodash';
export default {
  mixins: [cacheQuery],
  data() {
    return {
      tabs: [
        { value: 'TOTAL', min: '', max: '', label: '全部', num: 0 },
        { value: 'SEVEN_DAY_WITHIN', min: '0', max: '7', label: '7天内到期', num: 0 },
        { value: 'FIFTEEN_DAY_WITHIN', min: '0', max: '15', label: '15天内到期', num: 0 },
        { value: 'THIRTY_DAY_WITHIN', min: '0', max: '30', label: '30天内到期', num: 0 },
        { value: 'SIXTY_DAY_WITHIN', min: '0', max: '60', label: '60天内到期', num: 0 },
        { value: 'NINETY_DAY_WITHIN', min: '0', max: '90', label: '90天内到期', num: 0 },
        { value: 'NINETY_DAY_AFTER', min: '90', max: '', label: '90天以上', num: 0 },
      ],
      activeName: 'TOTAL',
      loading: false,
      tableData: [],
      total: 0,
      serviceCascader: [],
      form: {
        page: 1,
        limit: 20,
        userMobile: '',
        countryList: [],
        serviceType: '',
        serviceStatus: [1, 2],
        expirationTime: [],
        serviceNo: '',
        companyNameList: [],
      },
      copyForm: {},
      countryList: [],
      serviceTypeList: [],
      cacheKey: 'form',
      copyListQuery: {},
      serviceStatusList: [
        { label: '服务中', value: 1 },
        { label: '待续费', value: 2 },
        { label: '续费中', value: 14 },
        { label: '已取消', value: 9 },
        { label: '取消中', value: 11 },
        { label: '确认转出', value: 13 },
        { label: '转出代理', value: 4 },
        { label: '注销税号', value: 3 },
      ],
      selectionList: [],
      row: {},
      renewalConfirmDialog: false,
      renewalDetailDialog: false,
      chooseCompanyDialog: false,
      exportLoading: false,
    };
  },
  components: {
    ...comps,
  },
  created() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getServiceTypeList();
    this.getCountryList();
    this.getList();
  },
  methods: {
    // 去续费
    toRenew() {
      if (!this.selectionList.length) {
        this.$message.warning('请选择续费服务');
        return;
      }
      if (this.selectionList.some((item) => item.userMobile !== this.selectionList[0].userMobile)) {
        this.$message.warning('续费服务手机号需一致');
        return;
      }
      // 没有手机号、过期时间、续费商品 不能续费
      if (this.selectionList.some((item) => !item.userMobile || !item.expirationTime || !item.productId)) {
        this.$message.warning('当前服务不支持续费');
        return;
      }
      // 除服务中、待续费不支持续费
      if (this.selectionList.some((item) => ![1, 2].includes(item.status))) {
        this.$message.warning('当前服务不支持续费');
        return;
      }
      this.renewalConfirmDialog = true;
    },
    // 导出
    exportFn() {
      // if (!this.selectionList.length) {
      //   this.$message.warning('请选择续费服务');
      //   return;
      // }
      this.exportLoading = true;
      let params = cloneDeep(this.form);
      params.expirationTimeStart= this.form.expirationTime.length?this.form.expirationTime[0]:'';
      params.expirationTimeEnd= this.form.expirationTime.length?this.form.expirationTime[1]:'';
      renewalCenterExport(params).then((res) => {
        this.exportLoading = false;
        this.$util.exportExcel(res, '续费列表');
      }).catch(()=>{
        this.exportLoading = false;
      });
    },
    getFormData() {
      let { expirationTime, ...data } = this.form;
      let tab = this.tabs.find((t) => t.value === this.activeName);
      data.remainingTimeStart = tab ? tab.min : '';
      data.remainingTimeEnd = tab ? tab.max : '';
      data.expirationTimeStart = expirationTime && expirationTime.length ? expirationTime[0] : '';
      data.expirationTimeEnd = expirationTime && expirationTime.length ? expirationTime[1] : '';
      return data;
    },
    // 获取列表
    getList() {
      this.loading = true;
      this.setPageCache();
      renewalList(this.getFormData()).then((res) => {
        res.data.records.forEach((item) => {
          item.followContent = item.followContent.split(' ').filter((i) => i);
          item.productPrice = JSON.stringify(item.productPrice) !== '{}' ? item.productPrice : '';
          // 没有手机号、过期时间、续费商品， 除服务中、待续费不支持续费
          if (!item.userMobile || !item.expirationTime || !item.productId || ![1, 2].includes(item.status)) {
            item.disabled = true;
          } else {
            item.disabled = false;
          }
        });
        let result = res.data;
        this.tableData = result.records;
        this.total = parseInt(result.total);
        if (this.searchFlag) {
          this.$message({
            message: `搜索完成，为您搜索${this.total}条结果`,
            type: 'success',
            duration: 2000,
          });
          this.searchFlag = false;
        }
      }).finally(() => {
        this.loading = false;
      })
      this.getStatistical();
    },
    // 获取统计数据
    getStatistical() {
      renewalStatistical(this.getFormData()).then((res) => {
        let map = [];
        res.data.forEach((item) => {
          map[item.dayPeriod] = item.quantity;
        });
        this.tabs.forEach((tab) => {
          tab.num = map[tab.value] || 0;
        });
      });
    },
    /** 获取国家下拉框数据 */
    getCountryList() {
      getCountrySelectList().then((res) => {
        this.countryList = res.data;
      });
    },
    // 获取服务类型
    getServiceTypeList() {
      getBaseDataByDataType({
        dataType: 'WORK_CATEGORY_TYPE',
      }).then((res) => (this.serviceTypeList = res.data));
    },
    // 修改公司
    changeCompany(val) {
      this.form.companyNameList = val.map((item) => item.companyName);
      this.form.page = 1;
      this.getList();
    },
    handleSelectionChange(val) {
      this.selectionList = val;
    },
    // 分页
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
      this.getList();
    },
    resetSearchBox() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
    // 查看详情
    renewalDetail(row) {
      this.row = row;
      this.renewalDetailDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  align-items: center;
  // background-color: #fff;
  padding: 0 8px;
  .app-container {
    margin-left: -10px;
    overflow: hidden;
    .choose-company {
      height: 32px;
      line-height: 32px;
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      border-radius: 0 30px 30px 0;
      padding: 0 6px;
      margin-right: 32px;
      margin-left: -10px;
      position: absolute;
      z-index: 100;
      cursor: pointer;
      color: #303132;
      .fold-icon {
        margin-right: 8px;
      }
    }
    .follow-content {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
::v-deep .el-form {
  margin-left: 82px;
}
</style>
