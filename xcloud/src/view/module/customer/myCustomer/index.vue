<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline label-width="80px" :model="listQuery">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="listQuery.mobile" placeholder="请输入手机号" clearable style="width: 168px" />
        </el-form-item>
        <el-form-item label="客户ID" prop="crmAccountId">
          <el-input v-model="listQuery.crmAccountId" placeholder="请输入客户ID" clearable style="width: 168px" />
        </el-form-item>
        <el-form-item label="所属企业" prop="followUserId">
          <el-select v-model="listQuery.enterpriseId" placeholder="选择企业" @change="enterpriseChange">
            <el-option :value="item.id" :label="item.name" v-for="item in firmList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select style="width: 168px" v-model="listQuery.status" clearable>
            <el-option label="禁用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="锁定" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
          <el-button type="text" @click="handleMoreSearch">
            <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
            {{ moreSerch ? '收起' : '更多' }}筛选
          </el-button>
        </el-form-item>
        <div class="more-search" v-show="moreSerch">
          <el-form-item label="注册时间" label-width="80px">
            <el-date-picker v-model="listQuery.time" type="daterange" size="small" clearable unlink-panels range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" style="width: 300px"> </el-date-picker>
          </el-form-item>
          <el-form-item label="首次成交时间" label-width="100px">
            <el-date-picker
              v-model="listQuery.payTime"
              type="daterange"
              size="small"
              clearable
              :picker-options="dateOptions"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="[, '23:59:59']"
              style="width: 300px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="客户等级" prop="userLevel">
            <el-select style="width: 168px" v-model="listQuery.userLevel" clearable>
              <el-option :label="customLevel.label" :value="customLevel.value" v-for="customLevel in showCustomLevelList" :key="customLevel.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户生命周期" prop="custStatus" label-width="110px">
            <el-select style="width: 168px" v-model="listQuery.custStatus" clearable>
              <el-option :label="customLifeCycle.label" :value="customLifeCycle.value" v-for="customLifeCycle in customLifeCycleList" :key="customLifeCycle.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成交次数" prop="status">
            <el-input-number v-model="listQuery.minTradeQuantity" controls-position="right" :step="1" :min="0" :max="listQuery.maxTradeQuantity" size="small" placeholder="最少次数" step-strictly></el-input-number>
            至
            <el-input-number v-model="listQuery.maxTradeQuantity" controls-position="right" :step="1" :min="listQuery.minTradeQuantity" size="small" placeholder="最多次数" step-strictly></el-input-number>
          </el-form-item>
          <el-form-item label="累计消费金额" prop="status" label-width="110px">
            <el-input-number v-model="listQuery.minTotalConsum" controls-position="right" :step="1" :min="0" :max="listQuery.maxTotalConsum" size="small" placeholder="最低金额" step-strictly></el-input-number>
            至
            <el-input-number v-model="listQuery.maxTotalConsum" controls-position="right" :step="1" :min="listQuery.minTotalConsum" size="small" placeholder="最高金额" step-strictly></el-input-number>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" :data="list" v-loading="listLoading" :height="tableHeight" highlight-current-row border element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" label="客户ID" width="180">
          <template slot-scope="scope">{{ scope.row.crmAccountId }}</template>
        </el-table-column>
        <!-- <el-table-column align="center" label="用户昵称">
          <template slot-scope="scope">{{ scope.row.nickname }}</template>
        </el-table-column> -->
        <el-table-column align="center" label="手机号" width="150">
          <template slot-scope="scope">{{ scope.row.mobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="是否成交" width="150">
          <template slot-scope="scope">{{ scope.row.existDealt ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column align="center" label="客户等级" width="150" prop="userLevel">
          <template slot-scope="scope">
            {{ scope.row.userLevel | filterUserLevel(customLevelList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="客户生命周期" width="150" prop="custStatus">
          <template slot-scope="scope">
            {{ scope.row.custStatus | filterLifeCycle(customLifeCycleList) }}
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="邮箱">
          <template slot-scope="scope">{{ scope.row.email }}</template>
        </el-table-column> -->
        <el-table-column align="center" label="跟进人" width="150">
          <template slot-scope="scope">
            {{ scope.row.followUserName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="邀请人" width="150">
          <template slot-scope="scope">
            {{ scope.row.inviteUserName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属企业名称" width="180">
          <template slot-scope="scope">{{ scope.row.enterpriseId | getEnterpriseName(firmList) }}</template>
        </el-table-column>
        <el-table-column align="center" label="用户来源" width="150">
          <template slot-scope="scope">
            {{ scope.row.source | filterState }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册时间" width="150">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="首次成交时间" width="150" prop="startPayTime">
          <template slot-scope="scope">{{ scope.row.startPayTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">禁用</span>
            <span v-else-if="scope.row.status == 1">启用</span>
            <span v-else>锁定</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top">
              <el-link type="primary" :underline="false" @click="showDetailModal(scope.row)" class="icon icon-see" v-show="hasAuthority('C1_5')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="添加跟进记录" placement="top">
              <el-link type="primary" :underline="false" @click="handleClickSetting(scope.row)" v-if="scope.row.status == 1" class="icon icon-add" v-show="hasAuthority('C1_6')"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageIndex" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>

    <!-- 添加跟进记录 -->
    <el-dialog :visible.sync="followModal" width="350px" class-name="distribution" title="添加跟进记录">
      <div style="margin-bottom: 15px">
        <el-input v-model="content" type="textarea" :rows="4" placeholder="请输入内容" resize="none"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="followModal = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="updateInviteFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCustomerList, addRecord } from '@/api/newApi/customer/customerInfo.js';
import { getFirm } from '@/api/newApi/common.js';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  mixins: [cacheQuery],
  data() {
    return {
      dateOptions: {
        disabledDate(date) {
          return date > new Date().setHours(23, 59, 59);
        },
      },
      list: [],
      listLoading: false,
      // 分页
      listTotal: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        crmAccountId: '',
        mobile: '',
        status: '',
        registerStartTime: '',
        registerEndTime: '',
        userLevel: '',
        custStatus: '',
        payTime: [],
        time: [],
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
      },
      content: '', //跟进内容
      userId: '',
      enterpriseId: '',
      isAddEdit: false, //编辑/新增
      followModal: false, //跟进人弹窗
      inviteesModal: false, //邀请人弹窗
      searchFlag: false,
      cacheKey: 'listQuery',
      copyListQuery: {},
      userList: [],
      followList: [],
      firmList: [],
      // 客户等级列表
      customLevelList: [
        { label: '普通客户', value: 0 },
        { label: 'VIP客户', value: 1, hiddenCompanies: [29, 30] },
        { label: 'KA客户', value: 2 },
      ],
      // 客户生命周期
      customLifeCycleList: [
        { label: '提升期', value: 0 },
        { label: '维护期', value: 1 },
        { label: '衰退期', value: 2 },
        { label: '流失期', value: 3 },
        { label: '未成交客户', value: 4 },
      ],
    };
  },
  computed: {
    showCustomLevelList() {
      return this.customLevelList.filter((item) => !(item.hiddenCompanies || []).includes(this.listQuery.enterpriseId));
    },
  },
  created() {
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    this.listQuery.enterpriseId = Number(localStorage.getItem('enterpriseId'));
    this.queryData();
    this.getFirmList();
    // this.getUserList()
  },
  filters: {
    getEnterpriseName(val, firmList) {
      let firm = firmList.find((item) => item.id == val);
      return firm ? firm.name : val;
    },
    filterUserLevel(userLevel, customLevelList) {
      let level = customLevelList.find((item) => item.value === +userLevel);
      return level ? level.label : '-';
    },
    filterLifeCycle(custStatus, customLifeCycleList) {
      let lifeCycle = customLifeCycleList.find((item) => item.value === +custStatus);
      if (+custStatus === 4) {
        return '-';
      }
      return lifeCycle ? lifeCycle.label : '-';
    },
  },
  methods: {
    // 企业切换
    enterpriseChange(val) {
      if (this.listQuery.userLevel === 1 && [29, 30].includes(val)) {
        this.listQuery.userLevel = '';
      }
    },
    formatTime() {
      [this.listQuery.registerStartTime, this.listQuery.registerEndTime] = this.listQuery.time && this.listQuery.time.length ? this.listQuery.time : ['', ''];
      [this.listQuery.betweenStartPayTime, this.listQuery.endStartPayTime] = this.listQuery.payTime && this.listQuery.payTime.length ? this.listQuery.payTime : ['', ''];
    },
    /**
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.formatTime();
      let { time, payTime, ...query } = this.listQuery;
      this.setPageCache();
      getCustomerList({
        type: 1,
        ...query,
      })
        .then((res) => {
          // 延迟loading关闭
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.listTotal}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    search() {
      this.searchFlag = true;
      this.listQuery.pageIndex = 1;
      this.queryData();
    },
    getFirmList() {
      getFirm().then((res) => {
        if (res.code === 0) {
          this.firmList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.queryData();
    },
    /**
     * 搜索全部/清空时间分页为第一页
     */
    searchData() {
      this.listQuery.pageIndex = 1;
      this.queryData();
    },
    // 重置
    resetForm() {
      // this.$refs.searchForm.resetFields();
      this.listQuery = { ...this.copyListQuery };
      console.log(111, this.copyListQuery);
      this.removePageCache();
    },
    /**
     * 详情
     */
    showDetailModal(row) {
      this.$router.push({
        path: '/myCustomer/detail',
        query: { enterpriseId: row.enterpriseId, userId: row.userId, mobile: row.mobile },
      });
    },
    /**
     * 添加跟进记录
     */
    handleClickSetting(row) {
      this.followModal = true;
      this.userId = row.userId;
      this.enterpriseId = row.enterpriseId;
    },
    /**添加跟进保存 */
    updateInviteFun(row) {
      addRecord({
        content: this.content,
        userId: this.userId,
        enterpriseId: this.enterpriseId,
      }).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '添加成功',
          });
          this.queryData();
          this.followModal = false;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.app-container {
  .followPerson {
    text-align: center;
    padding: 10px;
    font-size: 14px;
  }
}
.followPerson {
  // text-align: center;
  padding: 10px;
  font-size: 14px;
}
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}
</style>
