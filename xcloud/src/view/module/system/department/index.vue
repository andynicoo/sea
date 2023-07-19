<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="80">
          <el-form-item label="部门名称" prop="departmentName">
            <el-input
              style="width: 168px"
              size="small"
              clearable
              type="text"
              v-model="form.departmentName"
              placeholder="请输入部门名称"
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
            <el-button type="primary" size="small" @click="addOrEdit(0, {}, 'add')" v-show="hasAuthority('A1_5')">新增</el-button>
            <el-button size="small" @click="toggleRowExpansion(list)">展开/折叠</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="table-container">
      <el-table
        border
        :data="list"
        v-loading="loading"
        ref="tableRef"
        style="width: 100%"
        :height="tableHeight"
        row-key="departmentId"
        :expand-row-keys="foldList"
        :tree-props="{ children: 'childXcloudOrgDepartmentListVO', hasChildren: 'hasChildren' }"
      >
        <Empty slot="empty" />
        <el-table-column align="center" label="序号">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="部门编码" prop="departmentCode"></el-table-column>
        <el-table-column align="center" label="钉钉部门编号" prop="deptId"></el-table-column>
        <el-table-column align="center" label="部门名称" prop="departmentName" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="状态" prop="status">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>
        <el-table-column align="center" label="部门负责人" prop="departmentManagerName"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" width="150px"></el-table-column>
        <el-table-column align="center" width="230" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link type="primary"
                :underline="false"
                class="icon icon-edit"
                v-show="hasAuthority('A1_6')"
                @click="addOrEdit(scope.row.level, scope.row, 'edit')">
              </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="新增下级" placement="top">
              <el-link
                type="primary"
                :underline="false"
                class="icon icon-addLowLeve"
                v-if="scope.row.status === 1"
                v-show="hasAuthority('A1_7')"
                @click="addOrEdit(scope.row.level, scope.row, 'add')"
              >
              </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="禁用" placement="top">
              <el-link
                type="primary"
                class="icon icon-disable"
                :underline="false"
                v-if="scope.row.status === 1"
                v-show="hasAuthority('A1_8')"
                @click="disabled(scope.row.departmentId)"
              >
              </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-link
                type="primary"
                class="icon icon-del"
                :underline="false"
                v-if="scope.row.status === 0"
                v-show="hasAuthority('A1_9')"
                @click="del(scope.row.departmentId)"
              >
            </el-link>
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
    <el-dialog :visible.sync="dialogVisible" title="新增编辑" width="460px" @close="resetForm">
      <el-form :model="addForm" ref="form" :rules="rules" label-width="120px">
        <el-form-item label="上级部门" prop="parentId" v-if="level !== 0">
          <el-select
            style="width: 200px"
            size="small"
            v-model="addForm.parentId"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in parentList"
              :key="item.departmentId"
              :value="item.departmentId"
              :label="item.departmentName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门编码" prop="departmentCode">
          <el-input
            v-model="addForm.departmentCode"
            placeholder="请输入部门编码"
            clearable
            style="width: 200px"
            size="small"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="departmentName">
          <el-input
            v-model="addForm.departmentName"
            placeholder="请输入部门名称"
            clearable
            style="width: 200px"
            size="small"
          />
        </el-form-item>
        <el-form-item label="部门负责人" prop="departmentManagerId">
          <el-select
            style="width: 200px"
            size="small"
            v-model="addForm.departmentManagerId"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :value="item.userId"
              :label="item.nickName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select style="width: 200px" size="small" v-model="addForm.status" placeholder="请选择">
            <el-option :value="1" label="启用"></el-option>
            <el-option :value="0" label="禁用"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSubmit">确 定</el-button>
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserNormal } from "@/api/user.js";
import {
  getDepartmentList,
  getParentDepartmentList,
  addDepartment,
  updateDepartment,
  disabledDepartment,
  delDepartment,
} from "@/api/department.js";

export default {
  data() {
    return {
      loading: false,
      dialogVisible: false,
      searchFlag: false,
      total: 0,
      form: {
        page: 1,
        limit: 10,
        departmentName: "",
        status: "",
      },
      addForm: {
        departmentCode: "",
        departmentManagerId: "",
        departmentName: "",
        parentId: "",
        status: 1,
      },
      list: [],
      rules: {
        parentId: [{ required: true, message: "请选择上级部门", trigger: "blur" }],
        departmentCode: [{ required: true, message: "请输入部门编码", trigger: "blur" }],
        departmentName: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        departmentManagerId: [{ required: true, message: "请选择部门负责人", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
      level: 0,
      parentList: [],
      userList: [],
      foldList: [],
      checkItem: {},
    };
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 0:
          return "禁用";
        case 1:
          return "启用";
      }
    },
  },
  created() {
    this.getList();
    this.getUserList();
  },
  methods: {
    resetForm() {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.checkItem.type === "add") {
            this.addDepart();
          } else {
            this.updateDepart();
          }
        }
      });
    },
    addDepart() {
      addDepartment({
        ...this.addForm,
        level: this.level + 1,
        parentId: this.level === 0 ? 0 : this.addForm.parentId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("添加成功");
          this.dialogVisible = false;
          this.getList();
        }
      });
    },
    updateDepart() {
      updateDepartment({
        ...this.addForm,
        departmentId: this.checkItem.departmentId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("修改成功");
          this.dialogVisible = false;
          this.getList();
        }
      });
    },
    // 获取角色列表
    getUserList() {
      getUserNormal().then((res) => {
        if (res.code === 0) {
          this.userList = res.data;
        }
      });
    },
    getList() {
      this.loading = true;
      getDepartmentList(this.form)
        .then((res) => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: "success",
              duration: 2000,
            });
            this.searchFlag = false;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      this.getList();
    },
    handlePage(current) {
      this.form.page = current;
      this.getList();
    },
    handlePageSize(size) {
      this.form.limit = size;
      this.getList();
    },
    addOrEdit(level, row, type) {
      this.level = level;
      this.checkItem = {
        ...row,
        type,
      };
      const { departmentCode, departmentId, departmentName, departmentManagerId, parentId, status } = row;
      this.dialogVisible = true;
      if (type === "edit") {
        this.$nextTick(() => {
          this.addForm = {
            departmentCode,
            departmentName,
            departmentManagerId,
            parentId,
            status,
          };
        });
        this.level = row.level - 1;
      } else if (this.level !== 0) {
        // 新增下级
        this.addForm.parentId = departmentId;
      }
      this.getParentList(this.level);
    },
    // 获取上级部门
    getParentList(level) {
      getParentDepartmentList({ level }).then((res) => {
        if (res.code === 0) {
          this.parentList = res.data;
        }
      });
    },
    // 切换展开/折叠
    toggleRowExpansion(list) {
      list.forEach((row) => {
        this.$refs.tableRef.toggleRowExpansion(row, row.expanded);
        if (row.childXcloudOrgDepartmentListVO.length) {
          this.toggleRowExpansion(row.childXcloudOrgDepartmentListVO);
        }
      });
    },
    disabled(id) {
      this.$confirm("是否确认禁用", "禁用提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true,
      }).then(() => {
        disabledDepartment({
          xcloudOrgDepartmentId: id,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success("禁用成功");
            this.getList();
          }
        });
      });
    },
    del(id) {
      this.$confirm("是否确认删除", "删除提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true,
      }).then(() => {
        delDepartment({
          xcloudOrgDepartmentId: id,
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success("删除成功");
            this.getList();
          }
        });
      });
    },
  },
};
</script>
