<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="80">
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              style="width: 168px"
              size="small"
              type="text"
              clearable
              v-model="form.roleName"
              placeholder="请输入角色名称"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select style="width: 168px" size="small" v-model="form.status" clearable placeholder="请选择">
              <el-option :value="1" label="启用"></el-option>
              <el-option :value="0" label="禁用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search">搜索</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" size="small" @click="addOrEdit(0)" v-show="hasAuthority('A1_13')">
              新增
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
        <el-table-column
          align="center"
          label="角色名称"
          prop="roleName"
          width="150px"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column align="center" label="功能页面" prop="menuName" width="150px"></el-table-column>
        <el-table-column align="center" label="直接下属" prop="isSelectDirectSubordinate">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row.isSelectDirectSubordinate | filterCheck"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所有下属" prop="isSelectAllSubordinate">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row.isSelectAllSubordinate | filterCheck"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" label="其他业务员" prop="otherUserNames" width="150px"></el-table-column>
        <el-table-column align="center" label="本部部门" prop="isSelectCurrentDepartment">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row.isSelectCurrentDepartment | filterCheck"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" label="直属部门" prop="isSelectSubordinateDepartment">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row.isSelectSubordinateDepartment | filterCheck"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所有下级部门" prop="isSelectAllSubordinateDepartment">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row.isSelectAllSubordinateDepartment | filterCheck"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" label="其他部门" prop="otherDepartmentNames" width="150px"></el-table-column>
        <el-table-column align="center" label="状态" prop="status" width="150px">
          <template slot-scope="scope">
            {{ scope.row.status | filterStatus }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" prop="createName" width="150px"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" width="150px"></el-table-column>
        <el-table-column align="center" label="修改人" prop="modifyName" width="150px"></el-table-column>
        <el-table-column align="center" label="修改时间" prop="updateTime" width="150px"></el-table-column>
        <el-table-column align="center" width="150" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link
                type="primary"
                :underline="false"
                @click="addOrEdit(scope.row.roleId)"
                v-show="hasAuthority('A1_14')"
                class="icon icon-edit"
              ></el-link>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :content="(1 - scope.row.status) | filterStatus"
              placement="top"
              v-if="hasAuthority('A1_15')"
            >
              <el-link
                type="primary"
                :underline="false"
                @click="disabled(scope.row.id, scope.row.status)"
                class="icon icon-disable"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-link
                type="primary"
                :underline="false"
                v-if="scope.row.status === 0"
                v-show="hasAuthority('A1_16')"
                @click="del(scope.row.id)"
                class="icon icon-del"
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
        :current-page.sync="form.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="form.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getPosition, disabledPosition, delPosition } from '@/api/position.js'
import cacheQuery from '@/mixins/cacheQuery'
export default {
  mixins: [cacheQuery],
  data () {
    return {
      loading: false,
      searchFlag: false,
      total: 0,
      form: {
        page: 1,
        limit: 10,
        roleName: '',
        status: ''
      },
      data: [],
      cacheKey:'form',
      copyListQuery: {},
    }
  },
  filters: {
    filterStatus (status) {
      switch (status) {
        case 0:
          return '禁用'
        case 1:
          return '启用'
      }
    },
    filterCheck (check) {
      switch (check) {
        case 1:
          return true
        case 0:
          return false
      }
    }
  },
  created () {
    this.copyListQuery = {...this.form}
    this.getPageCache()
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      this.setPageCache()
      getPosition(this.form)
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
      this.searchFlag = true
      this.form.page = 1
      this.getList()
    },
    handlePage (current) {
      this.form.page = current
      this.getList()
    },
    handlePageSize (size) {
      this.form.limit = size
      this.getList()
    },
    addOrEdit (id) {
      this.$router.push({
        name: 'systempositionAddEdit',
        params: {
          id
        }
      })
    },
    disabled (id, status) {
      this.$confirm(`是否确认${status === 0 ? '启用' : '禁用'}`, '提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true
      }).then(() => {
        disabledPosition({
          xcloudRoleDataPermissionId: id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('禁用成功')
            this.getList()
          }
        })
      })
    },
    del (id) {
      this.$confirm('是否确认删除', '删除提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true
      }).then(() => {
        delPosition({
          xcloudRoleDataPermissionId: id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      })
    }
  }
}
</script>
