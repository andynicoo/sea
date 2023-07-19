<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="70px">
          <el-form-item label="工单号" prop="searchContent">
            <el-input v-model="form.searchContent" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="服务状态" prop="status">
            <el-select style="width: 168px" v-model="form.status" size="small" placeholder="请选择" clearable filterable>
              <el-option :value="item.value" :label="item.label" v-for="(item, key, index) in tabs" :key="index"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset" size="small">重置</el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <div class="header-btn-group" style="float: right">
            <el-button size="small" type="success" @click="changeManager" icon="el-icon-edit" v-if="hasAuthority('A2_1')">修改税务经理</el-button>
          </div>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="手机号" prop="userMobile">
              <el-input v-model="form.userMobile" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="公司名称" prop="companyNameZh">
              <el-input v-model="form.companyNameZh" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="国家" prop="countryCode">
              <el-select style="width: 168px" v-model="form.countryCode" size="small" placeholder="请选择" clearable filterable>
                <el-option :value="key" :label="item" v-for="(item, key, index) in countryList" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker
                v-model="form.createTime"
                type="daterange"
                align="right"
                size="small"
                clearable
                unlink-panels
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
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
      <el-tabs v-model="tabNav" @tab-click="tabClick" ref="elTabs">
        <el-tab-pane name="-1" label="全部"></el-tab-pane>
        <el-tab-pane :label="item.label" :name="item.value" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
      </el-tabs>
      <el-table border :height="tableHeight" :data="list" v-loading="tableLoading" @selection-change="handleSelectionChange" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column type="selection" align="center" fixed="left" width="55"></el-table-column>
        <el-table-column align="center" width="200" label="工单号" show-overflow-tooltip prop="applyWorkNo"></el-table-column>
        <el-table-column align="center" width="150" label="服务进度" show-overflow-tooltip prop="type">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="服务类型" show-overflow-tooltip prop="applyType">
          <template slot-scope="scope">{{ applyTypeList[scope.row.applyType] }}</template>
        </el-table-column>
        <el-table-column align="center" width="200" label="公司名称" show-overflow-tooltip prop="companyNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="国家" show-overflow-tooltip prop="countryNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="服务商" show-overflow-tooltip prop="shortName"></el-table-column>
        <el-table-column align="center" width="150" label="手机号" show-overflow-tooltip prop="userMobile"></el-table-column>
        <el-table-column align="center" width="150" label="税务经理" show-overflow-tooltip prop="disposeName">
          <template slot-scope="scope">{{ scope.row.disposeName || '-' }}</template>
        </el-table-column>
        <!-- <el-table-column align="center" label="备注" show-overflow-tooltip prop="remark">
          <template slot-scope="scope">
            <el-link v-if="scope.row.remark" @click="checkRemark(scope.row)" type="primary">查看</el-link>
            <el-link v-else type="primary">-</el-link>
          </template>
        </el-table-column> -->
        <el-table-column align="center" width="150" label="创建时间" show-overflow-tooltip prop="createTime" sortable></el-table-column>
        <el-table-column align="center" width="200" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top" v-show="hasAuthority('A2_2')">
              <el-link type="primary" :underline="false" @click="detail(scope.row)" class="icon icon-see"></el-link>
            </el-tooltip>
            <!-- <el-tooltip effect="dark" content="备注" placement="top" v-show="hasAuthority('A2_3')">
              <el-link type="primary" :underline="false" @click="addRemark(scope.row)" class="icon icon-remarks"></el-link>
            </el-tooltip> -->
            <el-tooltip effect="dark" content="无需处理" placement="top" v-show="hasAuthority('A2_4')">
              <el-link type="primary" :underline="false" @click="noHandle(scope.row)" v-if="scope.row.status == statusObj.PENDING" class="icon icon-noNeed"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <NoProcessingRequiredDialog :noProcessingRequiredDialog.sync="noProcessingRequiredDialog" :id="checkItem.id" @refresh="getList"></NoProcessingRequiredDialog>
    <ChangeManagerDialog :changeManagerDialog.sync="changeManagerDialog" :serviceIds="idColl" @refresh="getList"></ChangeManagerDialog>
    <CheckRemarkDialog :checkRemarkDialog.sync="checkRemarkDialog" :serviceNo="checkItem.applyWorkNo" @refresh="getList"></CheckRemarkDialog>
    <RemarkDialog :remarkDialog.sync="remarkDialog" :id="checkItem.id" @refresh="getList"></RemarkDialog>
  </div>
</template>

<script>
import { statusObj, statusList } from './enumObj';
import * as comps from './components/index';
import Detail from './detail.vue';
import { taxApplyServicesListAPI, addRemarkAPI } from '@/api/newApi/workOrder/valueAddedServices.js';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  data() {
    return {
      detailObj: {},
      isDetailShow: false,
      countryList: {
        GB: '英国',
        DE: '德国',
        FR: '法国',
        IT: '意大利',
        ES: '西班牙',
        CZ: '捷克',
        EU: '欧盟',
      },
      applyTypeList: {
        1: '英国低税率（保留）',
        9: '英国EORI申请',
        2: '德国EORI申请',
        3: '意大利EORI申请',
        4: '英代DOC申请',
        5: '欧代DOC申请',
        6: '西班牙EORI申请',
        7: '法国EORI申请',
        8: '捷克EORI申请',
      },
      list: [],
      checkItem: '',
      tabNav: '-1',
      statusObj: statusObj,
      tabs: statusList,
      multipleSelection: [],
      total: 0,
      form: {
        searchContent: '',
        status: '',
        userMobile: '',
        companyNameZh: '',
        page: 1,
        limit: 20,
        numType: 1,
        countryCode: '',
        createTime: [],
      },
      cacheKey: 'form',
      copyListQuery: {},
      countrySelectList: [],
      tableLoading: false,
      searchFlag: false,
      checkRemarkDialog: false, // 查看备注弹窗显示
      remarkDialog: false, // 添加备注弹窗显示
      changeManagerDialog: false, // 修改税务经理弹框显示
      checkStatus: '',
      moreSerch: false,
      noProcessingRequiredDialog: false,
      idColl: [],
    };
  },
  mixins: [cacheQuery],
  components: { ...comps, Detail },
  filters: {
    filterStatus(status) {
      let result = statusList.find((item) => item.value == status);
      return result ? result.label : '';
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'valueAddedServicesDetail') {
      let status = statusList.find((item) => item.value === this.checkStatus);
      if (status) {
        to.meta.title = status.label;
      }
    }
    next();
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
  },
  methods: {
    noHandle(row) {
      this.checkItem = row;
      this.noProcessingRequiredDialog = true;
    },
    backList() {
      this.isDetailShow = false;
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      if (this.form.createTime && this.form.createTime.length) {
        [this.form.createStartTime, this.form.createEndTime] = this.form.createTime;
      } else {
        [this.form.createStartTime, this.form.createEndTime] = ['', ''];
      }
      this.setPageCache();
      let { createTime, ...formData } = this.form;
      taxApplyServicesListAPI(formData)
        .then((res) => {
          this.list = res.data.records;
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
          this.tableLoading = false;
          this.searchFlag = false;
        });
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    handleSelectionChange(val) {
      this.idColl = val.map((item) => item.id);
    },

    tabClick() {
      this.form.page = 1;
      if (this.form.createTime && this.form.createTime.length) {
        [this.form.createStartTime, this.form.createEndTime] = this.form.createTime;
      } else {
        [this.form.createStartTime, this.form.createEndTime] = ['', ''];
      }
      let data = {
        ...this.form,
      };
      data.status = this.tabNav === '-1' ? '' : this.tabNav;
      taxApplyServicesListAPI(data)
        .then((res) => {
          this.list = res.data.records;
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
          this.tableLoading = false;
          this.searchFlag = false;
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
      this.tabNav = '-1';
      this.searchFlag = true;
      this.form.page = 1;
      if (this.moreSerch) {
        this.moreSerch = false;
      }
      this.getList();
    },
    reset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
    // 修改税务经理
    changeManager() {
      if (!this.idColl.length) {
        this.$message.warning('请选择要操作的数据！');
        return;
      }
      this.changeManagerDialog = true;
    },

    // 详情弹窗
    detail(row) {
      this.detailObj = row;

      this.$router.push({
        path: '/valueAddedServices/detail',
        name: 'valueAddedServicesDetail',
        params: {
          detailObj: this.detailObj,
        },
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.header-btn-group {
  text-align: right;
}
</style>
