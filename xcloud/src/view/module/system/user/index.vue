<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="pageInfo" inline>
          <el-form-item label="姓名" prop="nickName">
            <el-input
              size="small"
              type="text"
              clearable
              style="width: 168px"
              v-model="pageInfo.nickName"
              placeholder="请输入姓名"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input
              size="small"
              type="text"
              clearable
              style="width: 168px"
              v-model="pageInfo.mobile"
              placeholder="请输入手机号码"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select size="small" clearable style="width: 168px" v-model="pageInfo.status">
              <el-option label="正常" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
              <el-option label="锁定" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="search">查询</el-button>
            <el-button size="small" @click="handleResetForm">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button
              size="small"
              type="primary"
              @click="edit(0)"
              v-show="hasAuthority('systemUserAdd')"
            >
              <span>新增</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="table-container">
      <el-table border :data="data" v-loading="loading" ref="table" :height="tableHeight">
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="工号" prop="workNum"></el-table-column>
        <el-table-column align="center" label="姓名" prop="nickName"></el-table-column>
        <el-table-column align="center" label="手机号" prop="mobile"></el-table-column>
        <el-table-column align="center" label="邮箱" prop="email" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="部门" prop="departmentName" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="职位" prop="workPosition"></el-table-column>
        <el-table-column align="center" label="状态" prop="status" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <el-table-column align="center" width="230" label="操作" fixed="right">
          <template slot-scope="scope">
            <!-- <el-link
              type="primary"
              :underline="false"
              @click="detail(scope.row.id)"
            >
              查看
            </el-link> -->
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link
                type="primary"
                :underline="false"
                @click="edit(scope.row.userId)" 
                v-show="hasAuthority('systemUserEdit')"
                class="icon icon-edit"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="权限分配" placement="top">
              <el-link
                type="primary"
                :underline="false"
                v-if="scope.row.status === 1"
                @click="distributeRole(scope.row.userId, scope.row.companyId)"
                v-show="hasAuthority('systemUserAuthority')"
                class="icon icon-permission-assignment"
              ></el-link>
            </el-tooltip>

            <el-tooltip effect="dark" content="重置密码" placement="top">
              <el-link
                type="primary"
                :underline="false"
                v-if="scope.row.status === 1"
                @click="resetPassword(scope.row.userId)"
                v-show="hasAuthority('systemResetPsw')"
                icon="icon icon-refrnesh"
              ></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handlePageSize"
        @current-change="handlePage"
        :current-page.sync="pageInfo.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageInfo.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getUsers, setPassword } from '@/api/user'
import cacheQuery from '@/mixins/cacheQuery'
export default {
  name: 'SystemUser',
  mixins: [cacheQuery],
  data () {
    return {
      loading: false,
      total: 0,
      pageInfo: {
        page: 1,
        pageSize: 10,
        nickName: '',
        mobile: '',
        email: ''
      },
      formItem: {
        userId: '',
        userName: '',
        nickName: '',
        password: '',
        passwordConfirm: '',
        status: 1,
        companyId: '',
        email: '',
        mobile: '',
        userType: 'normal',
        userDesc: '',
        avatar: '',
        grantRoles: [],
        grantActions: [],
        grantMenus: [],
        expireTime: '',
        isExpired: false,
        departmentId: '',
        departmentName: '',
        parentUserId: '',
        parentUserName: ''
      },
      data: [],
      searchFlag: false,
      cacheKey:'pageInfo',
      copyListQuery: {},
    }
  },
  filters: {
    filterStatus (state) {
      switch (state) {
        case 0:
          return '禁用'
        case 1:
          return '正常'
        case 2:
          return '锁定'
      }
    }
  },
  created () {
    this.copyListQuery = {...this.pageInfo}
    this.getPageCache()
    this.handleSearch()
  },
  methods: {
    edit (userId) {
      this.$router.push({
        name: 'systemuserAddEdit',
        query: {
          userId
        }
      })
    },
    distributeRole (userId, companyId) {
      this.$router.push({
        name: 'systemuserDistributeRole',
        query: {
          userId,
          companyId
        }
      })
    },
    handleResetForm () {
      // this.$refs.searchForm.resetFields()
        this.pageInfo = {...this.copyListQuery}
        this.removePageCache()
        this.handleSearch()
    },
    handleSearch () {
      this.loading = true
      this.setPageCache()
      const { page, pageSize, nickName, mobile, status } = this.pageInfo
      let data = { ...this.pageInfo }
      if (status === '') {
        data = {
          page,
          pageSize,
          nickName,
          mobile
        }
      }
      getUsers(data)
        .then(res => {
          this.data = res.data.records
          this.total = parseInt(res.data.total)
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: 'success',
              duration: 2000
            })
            this.searchFlag = false
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    search () {
      this.pageInfo.page = 1
      this.searchFlag = true
      this.handleSearch()
    },
    handlePage (current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize (size) {
      this.pageInfo.limit = size
      this.handleSearch()
    },
    resetPassword (id) {
      this.$confirm('是否确定重置密码，重置后不可恢复！', '重置提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true
      }).then(() => {
        setPassword(id)
          .then(res => {
            if (res.code == 0) {
              this.$Message.success('重置成功，您的密码为123456')
            }
          })
          .catch(err => {
            this.$message.success(err.message)
          })
      })
    }
  }
}
</script>
