<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <el-form-item label="国家" prop="countryCode">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.countryCode" @change="changeSupplier">
              <el-option v-for="item in countrySelectList" :key="item.countryCode" :value="item.countryCode" :label="item.countryNameZh"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务商" prop="supplierId">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.supplierId">
              <el-option v-for="item in supplierList" :key="item.supplierId" :label="item.shortName" :value="item.supplierId"></el-option>
            </el-select>
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
              <el-button type="primary" size="small" class="green-btn" @click="_export" v-show="hasAuthority('L2_11')">
                <i class="icon icon-export"></i>
                <span>导出</span>
              </el-button>
              <el-button size="small" type="primary" @click="batchRemind" class="yellow-btn" v-show="hasAuthority('L2_12')">
                <i class="icon icon-remind"></i>
                <span>批量提醒</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="申报经理" prop="declareUserId">
              <el-select style="width: 168px" v-model="form.declareUserId" size="small" clearable filterable placeholder="请选择">
                <el-option v-for="item in managerList" :key="item.userId" :value="item.userId" :label="item.nickName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="异常原因" prop="abnormalType">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.abnormalType">
                <el-option v-for="(item, index) in abnormalReason" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务主体" prop="searchContent">
              <el-input v-model="form.searchContent" placeholder="公司名称/服务号/手机号" clearable style="width: 188px" size="small" />
            </el-form-item>
            <el-form-item label="申报截止日期" prop="deadline">
              <el-date-picker v-model="form.deadline" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" clearable start-placeholder="日期开始" end-placeholder="日期结束"> </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column type="selection" align="center" fixed="left" width="55"> </el-table-column>
        <el-table-column align="center" label="服务号" width="200" show-overflow-tooltip prop="serviceNo"></el-table-column>
        <el-table-column align="center" label="服务商" width="150" show-overflow-tooltip prop="supplierName"></el-table-column>
        <el-table-column align="center" label="国家" width="150" show-overflow-tooltip prop="countryNameZh"> </el-table-column>
        <el-table-column align="center" label="公司名称" width="200" show-overflow-tooltip prop="companyNameZh"> </el-table-column>
        <el-table-column align="center" label="客户手机号" width="150" show-overflow-tooltip prop="userMobile"> </el-table-column>
        <el-table-column align="center" label="申报经理" width="150" show-overflow-tooltip prop="declareUserName"> </el-table-column>
        <el-table-column align="center" label="申报分类" width="150" show-overflow-tooltip prop="declarePeriod">
          <template slot-scope="{ row }">{{ row.declarePeriod | filterDeclarePeriod }}</template>
        </el-table-column>
        <el-table-column align="center" label="申报次数" width="150" show-overflow-tooltip prop="declareCount"> </el-table-column>
        <el-table-column align="center" label="申报周期" width="200" show-overflow-tooltip prop="createName">
          <template slot-scope="{ row }">{{ row.beginTime | filterTime(row.endTime) }}</template>
        </el-table-column>
        <el-table-column align="center" label="申报截止时间" width="150" show-overflow-tooltip prop="taxDeclarationDeadline">
          <template slot-scope="{ row }">{{ row.taxDeclarationDeadline | filterTime }}</template>
          <template slot="header">
            申报截止时间
            <el-tooltip class="item" effect="dark" content="公司要求在指定的时间内提交申报" placement="top-start">
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="缴费截止时间" width="150" show-overflow-tooltip prop="taxPaymentDeadline">
          <template slot-scope="{ row }">{{ row.taxPaymentDeadline | filterTime }}</template>
          <template slot="header">
            缴费截止时间
            <el-tooltip class="item" effect="dark" content="公司要求在指定的时间内提交申报税金" placement="top-start">
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="异常原因" width="150" show-overflow-tooltip prop="abnormalType">
          <template slot-scope="{ row }">{{ row.abnormalType | filterAbnormalType(abnormalReason) }}</template>
        </el-table-column>
        <el-table-column align="center" label="备注详情" width="150" prop="existRemark">
          <template slot-scope="scope">
            <el-link v-if="hasAuthority('L2_13') && scope.row.existRemark" @click="checkRemark(scope.row)" type="primary"><i class="icon icon-search-small"></i>查看</el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="备注" placement="top" v-show="hasAuthority('L2_14')">
              <el-link type="primary" :underline="false" @click="addRemark(scope.row)">
                <i class="icon icon-remarks"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="短信提醒" placement="top" v-if="hasAuthority('L2_15') && scope.row.abnormalType === '1'">
              <el-link type="primary" :underline="false" @click="remind(scope.row)">
                <i class="icon icon-receipt"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="去处理" placement="top" v-if="hasAuthority('L2_16') && scope.row.abnormalType !== '3'">
              <el-link type="primary" :underline="false" @click="detail(scope.row)">
                <i class="icon icon-processing"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="转出申报" placement="top" v-if="hasAuthority('L2_17') && scope.row.abnormalType === '1'">
              <el-link type="primary" :underline="false" @click="turnToOut(scope.row)">
                <i class="icon icon-out"></i>
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <CheckRemarkDialog :checkRemarkDialog.sync="checkRemarkDialog" :serviceNo="checkItem.serviceNo" @refresh="getList"></CheckRemarkDialog>
    <RemarkDialog :remarkDialog.sync="remarkDialog" :serviceNo="checkItem.serviceNo" @refresh="getList"></RemarkDialog>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { serviceOrderDeclareWarnList, excelList, smsBatch } from '@/api/newApi/limitData/declareAbnormalWorkorder';
import { serviceTransfer } from '@/api/newApi/taxServices/taxNumDeclare.js';
import CheckRemarkDialog from '@/view/module/workOrder/hyCertification/components/checkRemarkDialog';
import RemarkDialog from '@/view/module/workOrder/hyCertification/components/remarkDialog';
import { getCountrySelectList, getDisposelist } from '@/api/newApi/common.js';
import { findSuppliers } from '@/api/newApi/processFields/processConfig.js';
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
        productFunctionCode: '',
        countryCode: '',
        supplierId: '',
        searchContent: '',
        declareUserId: '',
        abnormalType: '',
        deadline: [],
      },
      cacheKey: 'form',
      copyListQuery: {},
      abnormalReason: [
        { label: '客户逾期未申报', value: '1' },
        { label: '客户逾期未缴费', value: '2' },
        // {label: '未生成申报区间', value: '3'},
        // {label: '逾期未回执', value: '4'}
      ],
      periodsList: [
        { label: '逾期1期', value: 1 },
        { label: '逾期2期', value: 2 },
        { label: '逾期2期以上', value: 3 },
      ],
      searchFlag: false,
      checkRemarkDialog: false,
      remarkDialog: false,
      moreSerch: false,
      exportLoading: false,
      checkIds: [],
      checkItems: [],
      checkItem: {},
      countrySelectList: [],
      supplierList: [],
      managerList: [],
      copyForm: {},
    };
  },
  mixins: [cacheQuery],
  filters: {
    filterDeclarePeriod(declarePeriod) {
      switch (declarePeriod) {
        case 0:
          return '月报';
        case 1:
          return '季报';
        case 2:
          return '年报';
      }
    },
    filterTime(beginTime, endTime) {
      let result = beginTime;
      if (endTime) {
        result += +'至' + endTime;
      }
      try {
        result = beginTime.split(' ')[0];
        if (endTime) {
          result += '至' + endTime.split(' ')[0];
        }
      } catch (error) {}
      return result;
    },
    filterAbnormalType(abnormalType, abnormalReason) {
      let item = abnormalReason.find((item) => item.value === abnormalType);
      return item ? item.label : '';
    },
  },
  components: {
    CheckRemarkDialog,
    RemarkDialog,
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getManagerList();
    this._getCountrySelectList();
    this.getSuppliers();
    this.getList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      [this.form.beginTime, this.form.endTime] = this.form.deadline && this.form.deadline.length ? this.form.deadline : ['', ''];
      this.setPageCache();
      let { deadline, ...formData } = this.form;
      serviceOrderDeclareWarnList(formData)
        .then((res) => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          this.copyForm = { ...this.form };
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
          this.tableLoading = false;
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
      findSuppliers({
        page: 1,
        limit: 9999,
        functionCodes: [2, 5],
        countryCode: this.form.countryCode,
      }).then((res) => {
        this.supplierList = res.data.records;
      });
    },
    // 获取税务经理列表
    getManagerList() {
      getDisposelist({
        functionCode: 2,
        functionCodes: '2,5',
      }).then((res) => {
        this.managerList = res.data;
      });
    },
    changeSupplier() {
      this.getSuppliers();
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
    reset() {
      // if(this.$refs.searchForm) {
      //   this.$refs.searchForm.resetFields()
      // }
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
    handleSelectionChange(val) {
      this.checkIds = val.map((item) => item.serviceId);
      this.checkItems = val;
    },
    _export() {
      this.$confirm(`当前选择${this.checkIds.length ? this.checkIds.length : this.total}条数据 ，是否确认导出？`, '数据导出', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.exportLoading = true;
        let data = {
          ...this.copyForm,
        };
        if (this.checkIds.length) {
          data.options = this.checkIds;
        }
        excelList(data)
          .then((res) => {
            this.exportLoading = false;
            this.$util.exportExcel(res, '申报异常工单');
          })
          .catch((e) => {
            this.exportLoading = false;
          });
      });
    },
    // 批量提醒
    batchRemind() {
      if (!this.checkIds.length) {
        this.$message.warning('请选择数据');
        return;
      }
      this.$confirm(`已选中${this.checkIds.length}个客户，确定是否给选中客户发送短信提醒？`, '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        smsBatch({
          msgDTOList: this.checkItems.map((item) => ({
            abnormalType: item.abnormalType,
            serviceId: item.serviceId,
          })),
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('提醒成功');
            this.getList();
          }
        });
      });
    },
    // 查看备注
    checkRemark(row) {
      this.checkItem = row;
      this.checkRemarkDialog = true;
    },
    // 添加备注
    addRemark(row) {
      this.checkItem = row;
      this.remarkDialog = true;
    },
    remind(row) {
      this.$confirm('是否发送短信提醒？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        smsBatch({
          msgDTOList: [
            {
              abnormalType: row.abnormalType,
              serviceId: row.serviceId,
            },
          ],
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('提醒成功');
            this.getList();
          }
        });
      });
    },
    // 去处理
    detail(row) {
      this.$router.push({
        path: '/newTaxServices/taxNumDeclare/detail',
        query: {
          workId: row.workId,
        },
      });
    },
    // 转出申报
    turnToOut(row) {
      this.$confirm('转出后该公司将不能在本平台继续报税，是否确认转出申报？', '转出确认', {
        customClass: 'custom-confirm',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        serviceTransfer(row.serviceId).then((res) => {
          if (res.code == 0) {
            this.$message.success('转出成功');
            this.getLst();
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
</style>
