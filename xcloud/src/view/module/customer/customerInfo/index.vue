<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="header-container" ref="searchBox">
      <div
        :class="{
          'search-aera': true,
          'search-on': moreSerch,
          'search-off': !moreSerch,
        }"
      >
        <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
          <el-form ref="searchForm" inline label-width="80px" :model="listQuery">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="listQuery.mobile" placeholder="请输入手机号" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="是否会员">
              <el-select placeholder="请选择" style="width: 100px" v-model="listQuery.isMember">
                <el-option label="全部" :value="null"></el-option>
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户ID" prop="crmAccountId">
              <el-input v-model="listQuery.crmAccountId" placeholder="请输入客户ID" clearable style="width: 168px" />
            </el-form-item>
            <el-form-item label="所属企业" prop="enterpriseId">
              <el-select v-model="listQuery.enterpriseId" placeholder="选择企业" @change="enterpriseChange">
                <el-option :value="item.id" :label="item.name" v-for="item in firmList" :key="item.id"></el-option>
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
            <el-form-item style="float: right">
              <el-button type="primary" @click="showBatchFollowModal(null)"> 修改跟进人 </el-button>
            </el-form-item>
            <div class="more-search" v-show="moreSerch">
              <el-form-item label="跟进人" prop="followUserId">
                <el-select style="width: 168px" clearable placeholder="跟进人" filterable v-model="listQuery.followUserId">
                  <el-option-group>
                    <li class="option_title" style="background: #f6f8fa">
                      <span>姓名</span>
                      <span>手机号</span>
                      <span>部门</span>
                    </li>

                    <el-option v-for="(item, index) in filterFollowList" :key="index" :value="item.userId" class="option_title" :label="toStr(item.nickName, item.mobile)">
                      <span>{{ item.nickName }}</span>
                      &nbsp;
                      <span>{{ item.mobile }}</span>
                      &nbsp;
                      <span>{{ item.departmentName }}</span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="邀请人" prop="inviteUserId">
                <el-select style="width: 168px" v-model="listQuery.inviteUserId" clearable filterable>
                  <el-option-group>
                    <li class="option_title" style="background: #f6f8fa">
                      <span>姓名</span>
                      <span>手机号</span>
                      <span>部门</span>
                    </li>

                    <el-option v-for="item in filterFollowList" :key="item.userId" :label="toStr(item.nickName, item.mobile)" :value="item.userId" class="option_title">
                      <span>{{ item.nickName }} </span>&nbsp; <span>{{ item.mobile }} </span>&nbsp;
                      <span>{{ item.departmentName }}</span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select style="width: 168px" v-model="listQuery.status" clearable>
                  <el-option label="启用" value="1"></el-option>
                  <el-option label="禁用" value="0"></el-option>
                  <el-option label="锁定" value="2"></el-option>
                </el-select>
              </el-form-item>
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
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table :data="list" v-loading="listLoading" :height="tableHeight" element-loading-spinner="icon loading" row-key="userId" element-loading-text="拼命加载中" highlight-current-row border ref="table" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <Empty slot="empty" />
        <!-- <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column> -->
        <el-table-column align="center" label="客户ID" width="180">
          <template slot-scope="scope">{{ scope.row.crmAccountId }}</template>
        </el-table-column>
        <el-table-column align="center" label="手机号" width="180">
          <template slot-scope="scope">{{ scope.row.mobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="是否成交" width="80">
          <template slot-scope="scope">{{ scope.row.existDealt ? '是' : '否' }}</template>
        </el-table-column>
        <el-table-column align="center" label="客户等级" width="150" prop="userLevel">
          <template slot-scope="scope">
            {{ scope.row.userLevel | filterUserLevel(customLevelList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否会员" width="80">
          <template slot-scope="scope">{{ isMember(scope.row) }}</template>
        </el-table-column>
        <el-table-column align="center" label="客户生命周期" width="120" prop="custStatus">
          <template slot-scope="scope">
            {{ scope.row.custStatus | filterLifeCycle(customLifeCycleList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="客户来源" width="120" prop="source">
          <template slot-scope="scope">
            {{ sourceList[scope.row.source] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="跟进人" width="130">
          <template slot-scope="scope">
            {{ scope.row.followUserName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="邀请人" width="130">
          <template slot-scope="scope">
            {{ scope.row.inviteUserName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属企业名称" width="140">
          <template slot-scope="scope">{{ scope.row.enterpriseId | getEnterpriseName(firmList) }}</template>
        </el-table-column>
        <el-table-column align="center" label="注册时间" width="200">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="首次成交时间" width="150" prop="startPayTime">
          <template slot-scope="scope">{{ scope.row.startPayTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0"
              ><span class="dot-danger"><span class="dot"></span></span> 禁用</span
            >
            <span v-else-if="scope.row.status == 1">
              <span class="dot-success"><span class="dot"></span></span> 启用
            </span>
            <span v-else
              ><span class="dot-danger"><span class="dot"></span></span>锁定</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top">
              <el-link type="primary" :underline="false" @click="showDetailModal(scope.row)" class="icon icon-see" v-show="hasAuthority('C1_1')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改跟进人" placement="top">
              <el-link type="primary" :underline="false" @click="handleClickSetting(scope.row)" v-if="scope.row.status == 1" class="icon icon-follow" v-show="hasAuthority('C1_2')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改邀请人" placement="top">
              <el-link type="primary" :underline="false" @click="handleClickInvitees(scope.row)" v-if="scope.row.status == 1" class="icon icon-invite" v-show="hasAuthority('C1_3')"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container" style="position: relative">
      <p class="checked-num">
        已勾选 <span style="color: #1890ff">{{ multipleSelection.length }}</span> 条
      </p>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageIndex" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <!-- 修改跟进人 -->
    <el-dialog :visible.sync="followModal" width="500px" class-name="distribution" title="修改跟进人" @close="initFollowList">
      <el-form label-width="120px">
        <el-form-item>
          <span slot="label">当前 <span class="text-red">跟进人</span>： </span>
          {{ follwObj.followUserName }}
        </el-form-item>
        <el-form-item label="选择跟进人：">
          <el-select style="width: 300px" clearable placeholder="跟进人" filterable v-model="follwObj.followUserId" @change="selectName" @clear="initFollowList" remote :remote-method="dataFilter">
            <el-option-group>
              <li class="option_title" style="background: #f6f8fa">
                <span>姓名</span>
                <span>手机号</span>
                <span>部门</span>
              </li>

              <el-option v-for="(item, index) in followList" :key="index" :value="item.userId" class="option_title" :label="toStr(item.nickName, item.mobile)">
                <span>{{ item.nickName }}</span>
                &nbsp;
                <span>{{ item.mobile }}</span>
                &nbsp;
                <span>{{ item.departmentName }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="followModal = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="updatefollowFun">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改邀请人 -->
    <el-dialog :visible.sync="inviteesModal" width="500px" class-name="distribution" title="修改邀请人" @close="initFollowList">
      <el-form label-width="120px">
        <el-form-item>
          <span slot="label"> 当前<span class="text-red">邀请人</span>： </span>
          {{ follwObj.inviteUserName }}
        </el-form-item>
        <el-form-item label="选择邀请人：">
          <el-select style="width: 300px" clearable filterable placeholder="请选择邀请人" v-model="follwObj.inviteUserId" @change="selectInviteName" @clear="initFollowList" remote :remote-method="dataFilter">
            <el-option-group>
              <li class="option_title" style="background: #f6f8fa">
                <span>姓名</span>
                <span>手机号</span>
                <span>部门</span>
              </li>

              <el-option v-for="item in followList" :key="item.userId" :label="toStr(item.nickName, item.mobile)" :value="item.userId" class="option_title">
                <span>{{ item.nickName }}</span>
                &nbsp;
                <span>{{ item.mobile }}</span>
                &nbsp;
                <span>{{ item.departmentName }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inviteesModal = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="updateInviteFun">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量修改跟进人 -->
    <el-dialog :visible.sync="batchFollowModal" width="500px" class-name="distribution" title="批量修改跟进人" @close="initFollowList">
      <el-form label-width="120px">
        <el-form-item label="选择跟进人：">
          <el-select style="width: 300px" clearable placeholder="跟进人" filterable v-model="newUserId" @clear="initFollowList" remote :remote-method="dataFilter">
            <el-option-group>
              <li class="option_title" style="background: #f6f8fa">
                <span>姓名</span>
                <span>手机号</span>
                <span>部门</span>
              </li>

              <el-option v-for="(item, index) in followList" :key="index" :value="item.userId" class="option_title" :label="toStr(item.nickName, item.mobile)">
                <span>{{ item.nickName }}</span>
                &nbsp;
                <span>{{ item.mobile }}</span>
                &nbsp;
                <span>{{ item.departmentName }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchFollowModal = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="batchUpdateFollowFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCustomerList, userList, addFollowUser, batchEditFollowUser, addInviteUser } from '@/api/newApi/customer/customerInfo.js';
import { getFirm } from '@/api/newApi/common.js';
import store from '@/store';
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
      sourceList: {
        0: 'PC网页端',
        1: 'H5端',
        2: '微信小程序',
        5: '后台录入',
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
        followUserId: '',
        inviteUserId: '',
        registerStartTime: '',
        registerEndTime: '',
        userLevel: '',
        custStatus: '',
        payTime: [],
        time: [],
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
      },
      enterpriseId: '', //企业id
      userId: '', //用户id
      isAddEdit: false, //编辑/新增
      followModal: false, //跟进人弹窗
      batchFollowModal: false, // 批量修改跟进人弹窗
      followList: [],
      //跟进人/邀请人
      follwObj: {
        followUserName: '', //跟进人名称
        followUserId: '',
        selectFollowName: '',
        inviteUserName: '', //邀请人
        selectInviteName: '',
        inviteUserId: '',
        type: '',
      },
      totalCollect: new Date().getTime(),
      enterpriseName: '',
      inviteesModal: false, //邀请人弹窗
      searchFlag: false,
      menuId: '',
      cacheKey: 'listQuery',
      copyListQuery: {},
      allFollowList: [],
      filterFollowList: [],
      multipleSelection: [],
      newUserId: '', // 批量修改跟进人
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
    this.getUserList();
    this.getFirmList();
    this.enterpriseName = this.$util.getLocalStorage('enterpriseName');
    const menus = store.state.user.menus;
    const pathname = location.pathname.substr(1);
    const menu = menus.find((item) => item.path === pathname);
    this.menuId = menu.menuId;
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
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.formatTime();
      let { time, payTime, ...query } = this.listQuery;
      this.setPageCache();
      getCustomerList({
        type: 0,
        ...query,
      })
        .then((res) => {
          // 延迟loading关闭
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code == 0) {
            this.enterpriseId = this.listQuery.enterpriseId;
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    search() {
      this.searchFlag = true;
      this.listQuery.pageIndex = 1;
      this.queryData();
    },
    // 重置
    resetForm() {
      // this.$refs.searchForm.resetFields();
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.multipleSelection = [];
      this.listQuery.pageIndex = val;
      this.queryData();
    },
    searchData() {
      this.listQuery.pageIndex = 1;
      this.queryData();
    },
    initFollowList() {
      this.followList = this.allFollowList;
    },
    /** 修改跟进人/邀请人 过滤 */
    dataFilter(val) {
      if (val) {
        //val存在
        this.followList = this.allFollowList.filter((item) => {
          if (!!~item.nickName.indexOf(val.trim()) || !!~item.mobile.indexOf(val.trim()) || !!~item.departmentName.toUpperCase().indexOf(val.trim().toUpperCase())) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.followList = JSON.parse(JSON.stringify(this.allFollowList));
      }
    },
    //当用户昵称为空时默认
    toStr(str, mobile) {
      let data;
      if (str) {
        data = str;
      } else {
        data = mobile == '' || mobile == 'undefined' ? '暂无昵称' : mobile;
      }
      return data;
    },

    /**
     * 邀请人/跟进人下拉列表
     */
    getUserList() {
      userList({
        page: 1,
        limit: 100,
      }).then((res) => {
        if (res.code == 0) {
          this.followList = res.data;
          this.allFollowList = JSON.parse(JSON.stringify(res.data));
          this.filterFollowList = [{ userId: -1, nickName: '无跟进人' }, ...this.allFollowList];
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
    /**
     * 详情
     */
    showDetailModal(row) {
      this.$router.push({
        path: '/customer/detail',
        query: { enterpriseId: row.enterpriseId, userId: row.userId, mobile: row.mobile, menuId: this.menuId },
      });
    },
    /**获取跟进人名称 */
    selectName(vld) {
      let obj = {};
      obj = this.allFollowList.find((item) => {
        //这里的Data就是上面遍历的数据源
        return item.userId === vld; //筛选出匹配数据
      });
      this.follwObj.selectFollowName = obj ? obj.nickName : '';
    },
    /**批量获取跟进人名称 */
    // batchSelectName(vld) {
    //   let obj = {};
    //   obj = this.followList.find((item) => {
    //     //这里的Data就是上面遍历的数据源
    //     return item.userId === vld; //筛选出匹配数据
    //   });
    //   // this.follwObj.selectFollowName = obj.nickName;
    // },
    /**
     * 修改跟进人
     */
    handleClickSetting(row) {
      this.follwObj.followUserName = row.followUserName;
      this.followModal = true;
      this.enterpriseId = row.enterpriseId;
      this.userId = row.userId;
      this.follwObj.followUserId = '';
    },
    /**
     * 批量修改跟进人弹窗显示
     */
    showBatchFollowModal() {
      // if (this.$refs.table.selection)

      console.log(this.$refs.table.selection);
      if (!this.$refs.table.selection.length) {
        return this.$message({
          message: `请至少勾选一项`,
          type: 'error',
          duration: 2000,
        });
      }
      this.batchFollowModal = true;
    },
    getRowKeys(row) {
      console.log(row.userId);
      return row.userId;
    },

    batchUpdateFollowFun() {
      const userIdList = this.$refs.table.selection.map((item) => item.userId);
      const userIds = userIdList.join();
      batchEditFollowUser({
        userIds,
        newUserId: this.newUserId,
        enterpriseId: this.enterpriseId,
      }).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: '修改成功',
            type: 'success',
          });
          this.batchFollowModal = false;
          this.queryData();
        }
      });
    },
    /**修改跟进人保存 */
    updatefollowFun() {
      if (!this.follwObj.followUserId) {
        this.$message.warning('请选择跟进人');
        return;
      }
      addFollowUser({
        enterpriseId: this.enterpriseId,
        userId: this.userId,
        followUserId: this.follwObj.followUserId,
        followUserName: this.follwObj.selectFollowName,
      }).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: '修改成功',
            type: 'success',
          });
          this.followModal = false;
          this.queryData();
        }
      });
    },

    /**
     * 修改邀请人
     */
    handleClickInvitees(row) {
      this.enterpriseId = row.enterpriseId;
      this.userId = row.userId;
      this.follwObj.inviteUserName = row.inviteUserName;
      this.inviteesModal = true;
      this.follwObj.inviteUserId = '';
    },
    /**获取跟邀请人名称 */
    selectInviteName(vld) {
      let obj = {};
      obj = this.allFollowList.find((item) => {
        //这里的Data就是上面遍历的数据源
        return item.userId === vld; //筛选出匹配数据
      });
      this.follwObj.selectInviteName = obj ? obj.nickName : '';
    },
    /**修改邀请人保存 */
    updateInviteFun() {
      if (!this.follwObj.inviteUserId) {
        this.$message.warning('请选择邀请人');
        return;
      }
      addInviteUser({
        enterpriseId: this.enterpriseId,
        userId: this.userId,
        inviteUserId: this.follwObj.inviteUserId,
        inviteUserName: this.follwObj.selectInviteName,
      }).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: '修改成功',
            type: 'success',
          });
          this.inviteesModal = false;
          this.queryData();
        }
      });
    },
    // 是否是会员
    isMember(row) {
      let isMember = '';
      if (row.membershipCardId && row.vipEndTime == null) {
        isMember = '是';
      } else if (row.membershipCardId && row.vipEndTime) {
        if (this.judgeTime(row.vipEndTime)) {
          isMember = '是';
        } else {
          isMember = '否';
        }
      } else {
        isMember = '否';
      }
      return isMember;
    },
    judgeTime(time) {
      var strtime = time.replace('/-/g', '/'); //时间转换
      //时间
      var date1 = new Date(strtime);
      //现在时间
      var date2 = new Date();
      //判断时间是否过期
      return date1 < date2 ? false : true;
    },
  },
};
</script>
<style scoped lang="scss">
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
.checked-num {
  color: #666;
  position: absolute;
  bottom: 20px;
  left: 11px;
  font-size: 14px;
}
</style>
