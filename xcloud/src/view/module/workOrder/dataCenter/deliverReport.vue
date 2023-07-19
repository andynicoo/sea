<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px" @keydown.enter.native="search">
          <el-form-item label="统计周期">
            <el-date-picker
              v-model="form.dateArr"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="{
                disabledDate(time) {
                  return time.getTime() > Date.now() || time.getTime() < 1646064000000;
                },
              }"
            />
          </el-form-item>
          <el-form-item label="业务类型">
            <el-cascader
              size="small"
              ref="department"
              :options="agingBusinessTypeList"
              :props="{
                label: 'value',
                value: 'key',
                children: 'childNode',
                emitPath: true,
              }"
              collapse-tags
              filterable
              v-model="form.businessType"
            />
          </el-form-item>

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm()" size="small">重置</el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <el-button size="small" type="primary" @click="searchTips()">
                <i class="icon icon-remind"></i>
                <span>规则说明</span>
              </el-button>
              <el-button
                v-show="hasAuthority('K2_9')"
                size="small"
                type="primary"
                :loading="exportLoading"
                @click="exportFile()"
                class="yellow-btn"
              >
                <i class="icon icon-export"></i>
                <span>导出Excel</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="部门">
              <el-cascader
                size="small"
                ref="department"
                :options="departmentList"
                :props="{
                  multiple: true,
                  label: 'departmentName',
                  value: 'departmentId',
                  children: 'childXcloudOrgDepartmentListVO',
                  emitPath: true,
                }"
                collapse-tags
                filterable
                clearable
                v-model="form.consoleDepIds"
              />
            </el-form-item>
            <el-form-item label="人员">
              <el-select clearable v-model="form.consoleUserIds" placeholder="人员" filterable multiple collapse-tags>
                <el-option v-for="(item, index) in userList" :key="index" :label="item.nickName" :value="item.userId" />
              </el-select>
            </el-form-item>
            <el-form-item label="国家">
              <el-select clearable v-model="form.countryCodes" placeholder="国家" filterable multiple collapse-tags>
                <el-option
                  v-for="(item, index) in countryList"
                  :value="item.countryCode"
                  :label="item.countryNameZh"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <div class="cell-wrap table-container-title">
        <div class="cell">
          <div class="tit">处理次数</div>
          <div class="num">{{ cellDataObj.disposeNum || 0 }}</div>
        </div>
        <div class="cell">
          <div class="tit">处理工单数</div>
          <div class="num">{{ cellDataObj.disposeWorkOrderNum || 0 }}</div>
        </div>
        <div class="cell">
          <div class="tit">人效</div>
          <div class="num">{{ cellDataObj.firstPersonEffect || 0 }}</div>
        </div>
        <div class="cell">
          <div class="tit">时效</div>
          <div class="num">{{ cellDataObj.disposeTimeTest || 0 }}</div>
        </div>
        <div class="cell">
          <div class="tit">平均通过率</div>
          <div class="num">{{ cellDataObj.averagePassRate || 0 }} %</div>
        </div>
        <div class="cell">
          <div class="tit">二次驳回率</div>
          <div class="num">{{ cellDataObj.secondRejectionRate || 0 }} %</div>
        </div>
      </div>

      <el-table
        ref="table"
        border
        :data="list"
        v-loading="tableLoading"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
        :height="tableHeight"
        :default-sort="{ prop: 'disposeTimeTest', order: 'descending' }"
      >
        <Empty slot="empty" />
        <el-table-column align="center" label="部门" show-overflow-tooltip prop="depName" />
        <el-table-column align="center" label="人员" show-overflow-tooltip prop="consoleUserName" />
        <el-table-column align="center" label="处理次数" show-overflow-tooltip prop="disposeNum" sortable />
        <el-table-column align="center" label="处理工单数" show-overflow-tooltip prop="disposeWorkOrderNum" sortable>
          <template slot-scope="scope">
            <el-link type="primary" @click="workOrdersModal(scope.row, 1)">
              {{ scope.row.disposeWorkOrderNum }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="工单时效"
          show-overflow-tooltip
          prop="disposeTimeTest"
          sortable
          sort-by="averageDisposeTime"
        />
        <el-table-column align="center" label="一次通过率" show-overflow-tooltip prop="passingRate" sortable>
          <template slot-scope="scope"> {{ scope.row.passingRate }} % </template>
        </el-table-column>
        <el-table-column align="center" label="二次驳回数" show-overflow-tooltip prop="secondRejectionNum" sortable>
          <template slot-scope="scope">
            <el-link type="primary" @click="workOrdersModal(scope.row, 2)">
              {{ scope.row.secondRejectionNum }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="二次驳回率" show-overflow-tooltip prop="secondRejectionRate" sortable>
          <template slot-scope="scope"> {{ scope.row.secondRejectionRate }} % </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="三次及以上驳回数"
          show-overflow-tooltip
          prop="threeRejectionNum"
          sortable
        >
          <template slot-scope="scope">
            <el-link type="primary" @click="workOrdersModal(scope.row, 3)">
              {{ scope.row.threeRejectionNum }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="三次及以上驳回率"
          show-overflow-tooltip
          prop="threeRejectionRate"
          sortable
        >
          <template slot-scope="scope"> {{ scope.row.threeRejectionRate }} % </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="规则说明" :visible.sync="visible" width="800px">
      <deliverRuleTips />
    </el-dialog>

    <workOrdersModal ref="workOrdersModal" :params="modalParams" />
  </div>
</template>

<script>
import deliverRuleTips from './components/deliverRuleTips.vue';
import workOrdersModal from './components/workOrdersModal.vue';
import moment from 'moment';
import { getCountrySelectList } from '@/api/newApi/common.js';
import { getDepartmentTree } from '@/api/department.js';
import { getAllUsers } from '@/api/user';
import {
  agingStatisticsList,
  agingStatisticsServiceNoExport,
  agingTreeList,
} from '@/api/newApi/workOrder/dataCenter.js';

export default {
  components: {
    deliverRuleTips,
    workOrdersModal,
  },
  data() {
    return {
      moreSerch: false,
      tableLoading: false,
      exportLoading: false,
      visible: false,
      page: {
        page: 1,
        limit: 20,
      },
      total: 0,
      form: {},
      cellDataObj: {},
      list: [],
      agingBusinessTypeList: [], //业务类型
      departmentList: [], // 部门
      userList: [], // 人员
      countryList: [], // 国家
      modalParams: {}, //工单详情请求参数
    };
  },
  mounted() {
    this.getAgingTreeList();
    this.getDepartmentList();
    this.getUserList();
    this.getCountrySelectList();

    this.resetForm();
    this.search();
  },
  methods: {
    // 搜索
    search() {
      this.page.page = 1;
      this.getList();
    },
    // 获取列表
    getList() {
      this.tableLoading = true;
      agingStatisticsList(Object.assign({}, this.page, this.getParams()))
        .then((res) => {
          this.tableLoading = false;
          if (res.code === 0) {
            const data = res.data || {};
            this.cellDataObj = data;
            if (data.agingStatisticsLists) {
              this.total = parseInt(data.agingStatisticsLists.total || 0);
              this.list = data.agingStatisticsLists.records || [];
            } else {
              this.total = 0;
              this.list = [];
            }
          }
        })
        .catch((e) => {
          this.tableLoading = false;
        });
    },
    // 导出文件
    exportFile() {
      this.exportLoading = true;
      agingStatisticsServiceNoExport(this.getParams())
        .then((res) => {
          this.exportLoading = false;
          this.$util.exportExcel(res, '交付时效');
        })
        .catch((e) => {
          this.exportLoading = false;
        });
    },
    // 筛选条件说明
    searchTips() {
      this.visible = true;
    },
    //工单数详情
    workOrdersModal(record, type) {
      this.modalParams = this.getParams();
      this.modalParams.type = type;
      this.modalParams.consoleDepIds = [record.consoleDepId];
      this.modalParams.consoleUserIds = [record.consoleUserId];
      this.$refs.workOrdersModal.showModal = true;
    },
    // 重置
    resetForm() {
      this.form = {
        dateArr: [
          moment(moment().startOf('day').subtract(6, 'days')).format('YYYY-MM-DD'),
          moment(moment().endOf('day')).format('YYYY-MM-DD'),
        ],
        startDate: null,
        endDate: null,
        businessType: ['5', 'vatFirstRegisterAging'], //业务类型
        consoleDepIds: [], // 部门
        consoleUserIds: [], // 人员
        countryCodes: [], // 国家
      };
    },
    //获取参数
    getParams() {
      let params = JSON.parse(JSON.stringify(this.form)) || {};
      if (params.dateArr && params.dateArr.length > 0) {
        params.startDate = params.dateArr[0] + ' 00:00:00';
        params.endDate = params.dateArr[1] + ' 23:59:59';
      }
      if (params.consoleDepIds && params.consoleDepIds.length > 0) {
        params.consoleDepIds = Array.from(new Set(params.consoleDepIds.join(',').split(',')));
      }
      if (params.businessType && params.businessType.length > 0) {
        params.functionCode = params.businessType[0];
        params.statisticalContent = params.businessType[1];
      }
      return params;
    },

    // 获取业务类型列表
    getAgingTreeList() {
      agingTreeList().then((res) => {
        this.agingBusinessTypeList = res.data || [];
      });
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
    //分页
    handleSizeChange(val) {
      this.page.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.page = val;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.cell-wrap {
  display: flex;
  background-color: #f2f2f2;
  border-bottom: 10px solid #fff;
  .cell {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    .tit {
      font-size: 18px;
      font-weight: bold;
      line-height: 34px;
    }
    .num {
      font-size: 26px;
      font-weight: bold;
      line-height: 44px;
    }
  }
}
</style>
