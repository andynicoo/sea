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

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm()" size="small">重置</el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
            <el-button size="small" type="text" @click="searchTips()">筛选条件说明</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group" v-show="hasAuthority('K2_8')">
              <el-button size="small" type="primary" :loading="exportLoading" @click="exportFile()" class="yellow-btn">
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
          </div>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <div class="cell-wrap">
        <div class="cell">
          <div class="tit">初审工单数</div>
          <div class="num">{{ cellDataObj.firstOrderNum || 0 }}</div>
          <div class="flex">
            <div class="li">人效: {{ cellDataObj.firstPersonEffect || 0 }}</div>
            <div class="li">时效: {{ cellDataObj.firstTimeTest || 0 }}</div>
          </div>
        </div>
        <div class="cell">
          <div class="tit">提交注册/转代理工单数</div>
          <div class="num">{{ cellDataObj.commitRegisteredSubAgentOrderNum || 0 }}</div>
          <div class="flex">
            <div class="li">人效: {{ cellDataObj.commitRegisteredSubAgentPersonEffect || 0 }}</div>
            <div class="li">时效: {{ cellDataObj.commitRegisteredSubAgentAgingTest || 0 }}</div>
          </div>
        </div>
        <div class="cell">
          <div class="tit">注册/转代理完成工单数</div>
          <div class="num">{{ cellDataObj.succeedRegisteredSubAgentOrderNum || 0 }}</div>
          <div class="flex">
            <div class="li">人效: {{ cellDataObj.succeedRegisteredSubAgentPersonEffect || 0 }}</div>
            <div class="li">时效: {{ cellDataObj.succeedRegisteredSubAgentAgingTest || 0 }}</div>
          </div>
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
        :default-sort="{ prop: 'firstOrderNum', order: 'descending' }"
      >
        <Empty slot="empty" />
        <el-table-column align="center" label="部门" show-overflow-tooltip prop="depName" />
        <el-table-column align="center" label="人员" show-overflow-tooltip prop="consoleUserName" />
        <el-table-column align="center" label="初审工单数" show-overflow-tooltip prop="firstOrderNum" sortable />
        <el-table-column
          align="center"
          label="初审工单时效"
          show-overflow-tooltip
          prop="firstTimeTest"
          sortable
          sort-by="firstTime"
        />
        <el-table-column
          align="center"
          label="提交注册/转代理工单数"
          show-overflow-tooltip
          prop="commitRegisteredSubAgentOrderNum"
          sortable
        />
        <el-table-column
          align="center"
          label="提交注册/转代理时效"
          show-overflow-tooltip
          prop="commitRegisteredSubAgentAgingTest"
          sortable
          sort-by="commitRegisteredSubAgentAging"
        />
        <el-table-column
          align="center"
          label="注册/转代理完成工单数"
          show-overflow-tooltip
          prop="succeedRegisteredSubAgentOrderNum"
          sortable
        />
        <el-table-column
          align="center"
          label="注册/转代理完成时效"
          show-overflow-tooltip
          prop="succeedRegisteredSubAgentAgingTest"
          sortable
          sort-by="succeedRegisteredSubAgentAging"
        />
      </el-table>
    </div>

    <el-dialog title="筛选条件说明" :visible.sync="visible" width="800px">
      <div class="explain-wrap">
        <p>1.统计周期：指工单具体工段的操作时间在所选时间范围的筛选</p>
        <p>* 例如：初审工单，指初审通过或者驳回时间在所选时间范围之内的工单</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import { getCountrySelectList } from '@/api/newApi/common.js';
import { getDepartmentTree } from '@/api/department.js';
import { getAllUsers } from '@/api/user';
import { vatAgingList, vatAgingListExport } from '@/api/newApi/workOrder/dataCenter.js';

export default {
  data() {
    return {
      moreSerch: false,
      tableLoading: false,
      exportLoading: false,
      visible: false,
      cellDataObj: {},
      list: [],
      form: {},
      countryList: [], // 国家
      departmentList: [], // 部门
      userList: [], // 人员
    };
  },
  mounted() {
    this.getCountrySelectList();
    this.getDepartmentList();
    this.getUserList();

    this.resetForm();
    this.search();
  },
  methods: {
    // 搜索
    search() {
      this.getList();
    },
    // 获取列表
    getList() {
      this.tableLoading = true;
      vatAgingList(this.getParams()).then((res) => {
        this.cellDataObj = res.data || {};
        this.list = res.data.reportVatDeliveryTimeListVos || [];
        this.tableLoading = false;
      });
    },
    // 导出文件
    exportFile() {
      this.exportLoading = true;
      vatAgingListExport(this.getParams())
        .then((res) => {
          this.exportLoading = false;
          this.$util.exportExcel(res, 'VAT交付时效');
        })
        .catch((e) => {
          this.exportLoading = false;
        });
    },
    // 筛选条件说明
    searchTips() {
      this.visible = true;
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
        countryCodes: [], // 国家
        consoleDepIds: [], // 部门
        consoleUserIds: [], // 人员
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
      return params;
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
  },
};
</script>

<style lang="less" scoped>
.cell-wrap {
  overflow: hidden;
  .cell {
    float: left;
    width: 360px;
    background-color: #f2f2f2;
    margin-bottom: 10px;
    margin-right: 40px;
    padding: 10px;
    text-align: center;
    .tit {
      font-size: 16px;
    }
    .num {
      font-size: 26px;
      line-height: 26px;
      font-weight: bold;
      line-height: 42px;
    }
    .flex {
      display: flex;
      font-size: 16px;
      line-height: 26px;
      .li {
        flex: 1;
      }
    }
  }
}
</style>
