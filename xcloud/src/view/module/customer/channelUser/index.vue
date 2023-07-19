<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline label-width="60px" :model="listQuery">
        <el-form-item label="名称" prop="nickName">
          <el-input v-model="listQuery.nickName" placeholder="请输入名称" clearable style="width: 168px" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="listQuery.mobile" placeholder="请输入手机号" clearable style="width: 168px" />
        </el-form-item>
        <el-form-item label="注册时间" label-width="80px">
          <el-date-picker v-model="listQuery.time" type="daterange" size="small" clearable unlink-panels range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" style="width: 300px"> </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select style="width: 168px" v-model="listQuery.status" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="success" v-show="hasAuthority('C1_13')" @click="(showVisibleAddOrEdit = true), (isAddUser = true), (isDetail = false)">
            <i class="icon icon-adds"></i>
            新增渠道客户
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table :data="list" v-loading="listLoading" :height="tableHeight" element-loading-spinner="icon loading" element-loading-text="拼命加载中" highlight-current-row border ref="table">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" label="名称">
          <template slot-scope="scope">{{ scope.row.nickname }}</template>
        </el-table-column>
        <el-table-column align="center" label="手机号" width="150">
          <template slot-scope="{ row }">
            <span v-hidden>{{ row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属企业名称" width="150">
          <template slot-scope="scope">{{ enterpriseList.find((o) => o.id === scope.row.enterpriseId).name }}</template>
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
        <el-table-column align="center" label="注册时间" width="150">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
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
        <el-table-column align="center" label="子渠道数" width="150">
          <template slot-scope="scope">
            {{ scope.row.childNum }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="详情" placement="top">
              <el-link type="primary" :underline="false" @click="showDetailModal(scope.row, false, true)" class="icon icon-see" v-show="hasAuthority('C1_14')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link type="primary" :underline="false" @click="showDetailModal(scope.row, false, false)" class="icon icon-edit" v-show="hasAuthority('C1_15')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改跟进人" placement="top">
              <el-link type="primary" :underline="false" @click="handleClickSetting(scope.row)" v-if="scope.row.status == 1" class="icon icon-follow" v-show="hasAuthority('D1_31')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改邀请人" placement="top">
              <el-link type="primary" :underline="false" @click="handleClickInvitees(scope.row)" v-if="scope.row.status == 1" class="icon icon-invite" v-show="hasAuthority('C1_17')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="子渠道设置" placement="top">
              <el-link type="primary" :underline="false" @click="(showSonCustomer = true), (sonCustItem = scope.row)" v-if="scope.row.status == 1" class="icon icon-add" v-show="hasAuthority('C1_24')"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <!-- 修改跟进人 -->
    <el-dialog :visible.sync="followModal" width="500px" class-name="distribution" title="修改跟进人">
      <el-form label-width="120px">
        <el-form-item>
          <span slot="label">当前 <span class="text-red">跟进人</span>： </span>
          {{ follwObj.followUserName }}
        </el-form-item>
        <el-form-item label="选择跟进人：">
          <el-select style="width: 300px" clearable placeholder="跟进人" filterable v-model="follwObj.followUserId" @change="selectName" :filter-method="dataFilter">
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
    <el-dialog :visible.sync="inviteesModal" width="500px" class-name="distribution" title="修改邀请人">
      <el-form label-width="120px">
        <el-form-item>
          <span slot="label"> 当前<span class="text-red">邀请人</span>： </span>
          {{ follwObj.inviteUserName }}
        </el-form-item>
        <el-form-item label="选择邀请人：">
          <el-select style="width: 300px" clearable filterable placeholder="请选择邀请人" v-model="follwObj.inviteUserId" @change="selectInviteName" :filter-method="dataFilter">
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
    <!-- 新增渠道用户弹窗 -->
    <el-dialog :title="isAddUser ? '添加渠道客户' : isDetail ? '客户详情' : '编辑渠道客户'" :close-on-click-modal="false" :visible.sync="showVisibleAddOrEdit" width="660px" @close="reset">
      <div class="baseInfo">基础信息</div>

      <el-form :model="addFormList" :rules="formRule" label-width="100px" label-position="right" ref="addChannelUserForm">
        <div class="elorAdMain">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-if="isAddUser" v-model="addFormList.mobile" :disabled="isDetail" placeholder="手机号码" clearable style="width: 200px" size="small" />
            <span v-else>{{ addFormList.mobile }}</span>
          </el-form-item>
          <el-form-item label="登录密码" prop="password" v-if="isAddUser">
            <el-input autocomplete="new-password" v-model="addFormList.password" :disabled="isDetail" placeholder="登录密码" clearable show-password v-if="showPasswordInput" :type="passwordType" style="width: 200px" size="small" />
          </el-form-item>
          <el-form-item label="客户名称" prop="nickname">
            <el-input v-model="addFormList.nickname" :disabled="isDetail" placeholder="客户名称" clearable style="width: 200px" size="small" />
          </el-form-item>
          <el-form-item label="渠道类型" prop="userChannel">
            <el-select style="width: 200px" size="small" :disabled="isDetail" v-model="addFormList.userChannel">
              <el-option :value="3" label="线下渠道"></el-option>
              <el-option :value="2" label="线上渠道"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户类型" prop="userType">
            <el-select style="width: 200px" size="small" :disabled="isDetail" v-model="addFormList.userType">
              <el-option :value="1" label="个人"></el-option>
              <el-option :value="2" label="企业"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用" prop="status">
            <el-select style="width: 200px" size="small" :disabled="isDetail" v-model="addFormList.status">
              <el-option :value="1" label="启用"></el-option>
              <el-option :value="0" label="禁用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同" prop="contract">
            <UploadFileUrl :drag="false" :showTip="true" :disabled="isDetail" :fileList.sync="addFormList.contract" :maxSize="20">
              <el-link type="primary">点击上传</el-link>
            </UploadFileUrl>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addFormList.email" :disabled="isDetail" placeholder="邮箱" clearable style="width: 200px" size="small" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addFormList.remark" :disabled="isDetail" placeholder="备注" clearable :style="{ width: isAddUser ? '510px' : '100%' }" size="small" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="周期结算" prop="settlementCycle" style="width: 615px">
            <el-radio-group v-model="addFormList.settlementCycle">
              <el-radio label="">未开通</el-radio>
              <el-radio label="WEEK_SETTLEMENT">周结(每周一出上周账单)</el-radio>
              <el-radio label="MONTH_SETTLEMENT">月结(每月1号出上周月账单)</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="账单未结清支持周期结算" prop="settlementSupportBill" style="width: 615px">
            <el-radio-group v-model="addFormList.settlementSupportBill">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showVisibleAddOrEdit = false">取 消</el-button>
        <el-button :disabled="isDetail" @click="handleSubmit" type="primary">提交</el-button>
      </div>
    </el-dialog>
    <SonCustomer :visible.sync="showSonCustomer" :id="sonCustItem.userId" v-if="showSonCustomer" />
  </div>
</template>
<script>
import UploadFileUrl from '@/components/UploadFileUrl/index';
import UploadFile from '@/components/UploadFile/index';
import { userList, addFollowUser, addInviteUser } from '@/api/newApi/customer/customerInfo.js';
import { getList, addUser, uploadeUser } from '@/api/newApi/customer/channel.js';
import store from '@/store';
import cacheQuery from '@/mixins/cacheQuery';
const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
export default {
  mixins: [cacheQuery],
  data() {
    return {
      showSonCustomer: false,
      sonCustItem: {},
      list: [],
      listLoading: false,
      enterpriseList: JSON.parse(localStorage.getItem('enterpriseList')),
      // 分页
      listTotal: 0,
      listQuery: {
        nickName: '',
        pageNo: 1,
        pageSize: 20,
        mobile: '',
        status: '',
        time: [],
      },
      addFormList: {
        userId: '',
        mobile: '',
        password: '',
        nickname: '',
        userChannel: '',
        userType: '',
        status: '',
        contract: '',
        email: '',
        remark: '',
        createStartTime: '',
        createEndTime: '',
        settlementCycle: '',
        settlementSupportBill: 0,
      },
      enterpriseId: '', //企业id
      userId: '', //用户id
      isAddEdit: false, //编辑/新增
      followModal: false, //跟进人弹窗
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
      enterpriseName: '',
      inviteesModal: false, //邀请人弹窗
      searchFlag: false,
      menuId: '',
      cacheKey: 'listQuery',
      copyListQuery: {},
      showVisibleAddOrEdit: false,
      showPasswordInput: true,
      isDetail: true,
      isAddUser: true,
      formRule: {
        mobile: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号'));
              } else {
                callback();
              }
            },
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              console.log('哈哈哈哈哈', value);
              if (value.length > 20) {
                callback(new Error('密码长度至多设置为20位'));
              } else if (!value) {
                callback(new Error('请输入密码'));
              } else {
                callback();
              }
            },
          },
        ],
        nickname: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        userChannel: [{ required: true, message: '请输入渠道类型', trigger: 'blur' }],
        userType: [{ required: true, message: '请输入客户类型', trigger: 'blur' }],
        status: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
        email: [{ pattern: emailReg, message: '邮箱格式错误', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    this.queryData();
    this.getUserList();
    this.enterpriseName = this.$util.getLocalStorage('enterpriseName');
    const menus = store.state.user.menus;
    const pathname = location.pathname.substr(1);
    const menu = menus.find((item) => item.path === pathname);
    this.menuId = menu.menuId;
  },
  components: {
    UploadFileUrl,
    UploadFile,
    SonCustomer: () => import('./components/sonCustomer.vue'),
  },
  watch: {},
  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      [this.listQuery.createStartTime, this.listQuery.createEndTime] = this.listQuery.time && this.listQuery.time.length ? this.listQuery.time : ['', ''];
      this.setPageCache();
      getList({
        pageIndex: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        type: 0,
        mobile: this.listQuery.mobile,
        status: this.listQuery.status,
        nickName: this.listQuery.nickName,
        createStartTime: this.listQuery.createStartTime,
        createEndTime: this.listQuery.createEndTime,
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
      this.listQuery.pageNo = 1;
      this.queryData();
    },
    // 重置
    resetForm() {
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
      this.listQuery.pageNo = val;
      this.queryData();
    },
    searchData() {
      this.listQuery.pageNo = 1;
      this.queryData();
    },

    /** 修改跟进人/邀请人 过滤 */
    dataFilter(val) {
      if (val) {
        //val存在
        this.followList = this.followList.filter((item) => {
          if (!!~item.nickName.indexOf(val) || !!~item.mobile.indexOf(val) || !!~item.departmentName.toUpperCase().indexOf(val.toUpperCase())) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.getUserList();
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
    showDetailModal(row, isAddUser, isDetail) {
      this.showVisibleAddOrEdit = true;
      this.isAddUser = isAddUser;
      this.isDetail = isDetail;
      this.$nextTick(() => {
        this.addFormList = { ...row };
      });
    },
    /**获取跟进人名称 */
    selectName(vld) {
      let obj = {};
      obj = this.followList.find((item) => {
        //这里的Data就是上面遍历的数据源
        return item.userId === vld; //筛选出匹配数据
      });
      this.follwObj.selectFollowName = obj.nickName;
    },
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
      obj = this.followList.find((item) => {
        //这里的Data就是上面遍历的数据源
        return item.userId === vld; //筛选出匹配数据
      });
      this.follwObj.selectInviteName = obj.nickName;
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
    reset() {
      if (this.$refs.addChannelUserForm) {
        this.$refs.addChannelUserForm.resetFields();
      }
      this.addFormList.userId = '';
    },
    filterType(key, showKey) {
      let type = this.addFormList[key] === '' ? 'text' : 'password';
      if (type === 'text') {
        this[showKey] = false;
        this.$nextTick(() => {
          this[showKey] = true;
        });
      }
      return type;
    },
    // 用户增改信息提交
    handleSubmit() {
      this.$refs.addChannelUserForm.validate((valid) => {
        if (valid) {
          if (!this.addFormList.userId) {
            // 新增
            addUser(this.addFormList).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '提交成功',
                });
                this.showVisibleAddOrEdit = false;
                this.queryData();
              }
            });
          } else {
            // 编辑
            uploadeUser(this.addFormList).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '编辑成功',
                });
                this.showVisibleAddOrEdit = false;
                this.queryData();
              }
            });
          }
        }
      });
    },
  },
  computed: {
    passwordType() {
      return this.filterType('password', 'showPasswordInput');
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
.baseInfo {
  margin-bottom: 10px;
  margin-top: -15px;
  padding-left: 30px;
  font-size: 20px;
}
form {
  width: 100%;

  > .elorAdMain {
    display: grid;
    grid-template-columns: repeat(2, 50%);
  }
}
</style>
