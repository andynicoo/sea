<template>
  <div class="app-container">
    <div class="header-container">
      <el-link :underline="false" @click="back">
        <i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>
        返回列表
      </el-link>
      <div class="title">基本信息</div>
      <el-form :model="formItem" ref="formRef" :rules="ruleValidate" label-width="100px">
        <el-form-item label="角色名称" prop="roleNames">
          <el-select filterable multiple size="small" v-model="formItem.roleNames" :disabled="!!id">
            <el-option
              :label="item.roleName"
              :value="item.roleName"
              v-for="item in roleList"
              :key="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="title">页面授权</div>
      <div class="table-container">
        <el-table
          border
          :data="list"
          ref="tableRef"
          v-loading="tableLoading"
          class="table"
          height="calc(100vh - 376px)"
        >
          <el-table-column align="center" label="序号" width="70">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="功能页面" width="150px" prop="menuId">
            <template slot-scope="scope">
              <el-cascader
                size="small"
                v-model="scope.row.menuId"
                filterable
                :props="{ label: 'menuName', value: 'menuId', children: 'subbaseMenuTreeList', emitPath: false }"
                :options="filterMenuTree"
              >
              </el-cascader>
            </template>
          </el-table-column>
          <el-table-column align="center" label="直接下属" prop="isSelectDirectSubordinate">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isSelectDirectSubordinate"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align="center" label="所有下属" prop="isSelectAllSubordinate">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isSelectAllSubordinate"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align="center" label="其他业务员" width="200px" prop="otherUserIds">
            <template slot-scope="scope">
              <div style="display: flex; align-items: center; flex-wrap: nowrap; justify-content: center">
                <div style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                  {{ scope.row.otherUserNames }}
                </div>
                <el-link @click="choseOtherUser(scope)"><i class="icon icon-claim-small"></i></el-link>
              </div>
              <!-- <el-select
                style="width: 150px"
                placeholder="请选择业务员"
                size="small"
                multiple
                filterable
                v-model="scope.row.otherUserIds"
              >
                <el-option-group>
                  <div class="option_title" style="background: #f6f8fa">
                    <span>姓名</span>
                    <span>手机号</span>
                    <span>部门</span>
                  </div>
                  <el-option
                    v-for="item in otherUserList"
                    :key="item.code"
                    :label="item.nickName"
                    :value="item.userId"
                    class="option_title"
                  >
                    <span>{{ item.nickName }} </span>&nbsp;
                    <span>{{ item.mobile }} </span>&nbsp;
                    <span>{{ item.departmentName }}</span>
                  </el-option>
                </el-option-group>
              </el-select> -->
            </template>
          </el-table-column>
          <el-table-column align="center" label="本部部门" prop="isSelectCurrentDepartment">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isSelectCurrentDepartment"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align="center" label="直属部门" prop="isSelectSubordinateDepartment">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isSelectSubordinateDepartment"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align="center" label="所有下级部门" prop="isSelectAllSubordinateDepartment">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isSelectAllSubordinateDepartment"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align="center" label="其他部门" width="200px" prop="otherDepartmentIds">
            <template slot-scope="scope">
              <el-cascader
                size="small"
                :ref="`department${scope.$index}`"
                :options="departmentList"
                :props="{
                  multiple: true,
                  label: 'departmentName',
                  value: 'departmentId',
                  children: 'childXcloudOrgDepartmentListVO',
                  emitPath: false,
                }"
                collapse-tags
                filterable
                v-model="scope.row.otherDepartmentIds"
              >
              </el-cascader>
            </template>
          </el-table-column>
          <el-table-column align="center" width="150" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="addLine"> 新增行 </el-link>
              <el-link type="primary" :underline="false" @click="delLine(scope.$index)"> 删除行 </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="btn-group">
        <el-button size="small" type="primary" :loading="btnLoading" @click="handleSubmit"> 确定 </el-button>
        <el-button size="small" @click="cancel"> 取消 </el-button>
      </div>
      <el-dialog
        title="选择业务员"
        :visible.sync="otherUserDialogVisible"
        width="460px"
        center
        @close="otherUserIds = []"
      >
        <el-select
          style="width: 400px"
          placeholder="请选择业务员"
          size="small"
          multiple
          filterable
          v-model="otherUserIds"
        >
          <el-option-group>
            <div class="option_title" style="background: #f6f8fa">
              <span>姓名</span>
              <span>手机号</span>
              <span>部门</span>
            </div>
            <el-option
              v-for="item in otherUserList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
              class="option_title"
            >
              <span>{{ item.nickName }} </span>&nbsp; <span>{{ item.mobile }} </span>&nbsp;
              <span>{{ item.departmentName }}</span>
            </el-option>
          </el-option-group>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="otherUserDialogVisible = false" size="small">取消</el-button>
          <el-button type="primary" size="small" @click="submitOtherUser">确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRolesEnabled } from "@/api/role.js";
import { getMenusTree } from "@/api/menu.js";
import { getDepartmentTree } from "@/api/department.js";
import { getUserNormal } from "@/api/user.js";
import { getPositionInfo, addPosition, updatePosition } from "@/api/position.js";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      id: this.$route.params.id || 0,
      formItem: {
        roleNames: [],
      },
      list: [],
      ruleValidate: {
        roleNames: [{ required: true, message: "请选择角色", trigger: "blur" }],
      },
      roleList: [],
      menuTree: [],
      departmentList: [],
      otherUserList: [],
      tableLoading: false,
      btnLoading: false,
      otherUserDialogVisible: false,
      otherUserIds: [],
      checkIndex: -1,
    };
  },
  computed: {
    filterMenuTree() {
      let menuIdList = this.list.map((item) => item.menuId).filter((item) => item);
      return this.filterCheckList([...this.menuTree], menuIdList);
    },
  },
  updated() {
    setTimeout(() => {
      if (this.$refs.tableRef) {
        this.$refs.tableRef.doLayout();
      }
    }, 200);
  },
  created() {
    this.init();
  },
  methods: {
    choseOtherUser(scope) {
      this.otherUserDialogVisible = true;
      this.checkIndex = scope.$index;
      this.otherUserIds = scope.row.otherUserIds;
    },
    submitOtherUser() {
      let item = this.list[this.checkIndex];
      item.otherUserIds = this.otherUserIds;
      item.otherUserNames = this.getUserNamesByIds(this.otherUserIds);
      this.$set(this.list, this.checkIndex, item);
      this.otherUserDialogVisible = false;
    },
    filterCheckList(menuTree, menuIdList) {
      menuTree.forEach((item) => {
        item.disabled = menuIdList.includes(item.menuId);
        if (item.subbaseMenuTreeList && item.subbaseMenuTreeList.length) {
          this.filterCheckList(item.subbaseMenuTreeList, menuIdList);
        }
      });
      return menuTree;
    },
    async init() {
      this.getRoleList();
      await this.getMenuTreeList();
      await this.getDepartmentList();
      await this.getOtherUserList();
      if (this.id) {
        this.getInfo();
      } else {
        this.addLine();
      }
    },
    getInfo() {
      this.tableLoading = true;
      getPositionInfo({
        roleId: this.id,
      }).then((res) => {
        if (res.code === 0) {
          let result = res.data;
          this.formItem.roleNames = result.roleName.split(",");
          this.list = result.subXcloudRoleDataPermissionInfoDTOList.map((item) => ({
            menuId: item.menuId,
            isSelectDirectSubordinate: Boolean(item.isSelectDirectSubordinate),
            isSelectAllSubordinate: Boolean(item.isSelectAllSubordinate),
            otherUserIds: item.otherUserIds.split(",").filter((i) => i !== ""),
            isSelectCurrentDepartment: Boolean(item.isSelectCurrentDepartment),
            isSelectSubordinateDepartment: Boolean(item.isSelectSubordinateDepartment),
            isSelectAllSubordinateDepartment: Boolean(item.isSelectAllSubordinateDepartment),
            otherDepartmentIds: item.otherDepartmentIds.split(",").filter((i) => i !== ""),
            id: item.id,
          }));
          this.list.forEach((item) => {
            this.$set(item, "otherUserNames", this.getUserNamesByIds(item.otherUserIds));
          });
          this.tableLoading = false;
        }
      });
    },
    getUserNamesByIds(ids) {
      return this.otherUserList
        .filter((user) => ids.includes(user.userId))
        .map((i) => i.nickName)
        .join(",");
    },
    // 获取角色名称列表
    getRoleList() {
      getRolesEnabled().then((res) => {
        if (res.code === 0) {
          this.roleList = res.data;
        }
      });
    },
    // 获取功能页面列表
    getMenuTreeList() {
      return new Promise((resolve) => {
        getMenusTree().then((res) => {
          if (res.code === 0) {
            this.menuTree = this.filterTree(res.data, "subbaseMenuTreeList");
            resolve();
          }
        });
      });
    },
    // 获取其他部门列表
    getDepartmentList() {
      return new Promise((resolve) => {
        getDepartmentTree().then((res) => {
          if (res.code === 0) {
            this.departmentList = this.filterTree(res.data, "childXcloudOrgDepartmentListVO");
            resolve();
          }
        });
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
    // 获取其他业务员列表
    getOtherUserList() {
      return new Promise((resolve) => {
        getUserNormal().then((res) => {
          if (res.code === 0) {
            this.otherUserList = res.data;
            resolve();
          }
        });
      });
    },
    // 提交
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.list.some((item) => !item.menuId)) {
            this.$message.error("请选择功能页面");
            return;
          }
          let list = this.list.map((item, index) => ({
            menuId: item.menuId,
            isSelectDirectSubordinate: item.isSelectDirectSubordinate - 0,
            isSelectAllSubordinate: item.isSelectAllSubordinate - 0,
            otherUserIds: item.otherUserIds.join(","),
            isSelectCurrentDepartment: item.isSelectCurrentDepartment - 0,
            isSelectSubordinateDepartment: item.isSelectSubordinateDepartment - 0,
            isSelectAllSubordinateDepartment: item.isSelectAllSubordinateDepartment - 0,
            otherDepartmentIds: this.$refs["department" + index]
              .getCheckedNodes()
              .map((n) => n.value)
              .join(","),
            id: this.id ? item.id || "" : undefined,
          }));
          this.btnLoading = true;
          if (this.id) {
            this._updatePosition({
              roleId: this.id,
              subXcloudRoleDataPermissionUpdateDTOList: list,
            });
          } else {
            this._addPosition({
              roleIds: this.roleList
                .filter((item) => this.formItem.roleNames.includes(item.roleName))
                .map((item) => item.roleId)
                .join(","),
              subXcloudRoleDataPermissionAddDTOList: list,
            });
          }
        }
      });
    },
    // 更新
    _updatePosition(data) {
      updatePosition(data).then((res) => {
        if (res.code === 0) {
          this.btnLoading = false;
          this.$message.success("修改成功");
          this.cancel();
        }
      });
    },
    // 新增
    _addPosition(data) {
      addPosition(data).then((res) => {
        if (res.code === 0) {
          this.btnLoading = false;
          this.$message.success("添加成功");
          this.cancel();
        }
      });
    },
    ...mapMutations(["closeTag"]),
    cancel() {
      this.list = [];
      this.roleList = [];
      this.menuTree = [];
      this.departmentList = [];
      this.otherUserList = [];
      this.closeTag(this.$route);
      this.back();
    },
    back() {
      this.$router.push({
        path: "/system/position/index",
      });
    },
    // 新增行
    addLine() {
      this.list.push({
        menuId: "",
        isSelectDirectSubordinate: false,
        isSelectAllSubordinate: false,
        otherUserIds: [],
        isSelectCurrentDepartment: false,
        isSelectSubordinateDepartment: false,
        isSelectAllSubordinateDepartment: false,
        otherDepartmentIds: [],
      });
    },
    // 删除行
    delLine(index) {
      if (this.list.length === 1) {
        this.$message.warning("不能再删除了！");
        return;
      }
      this.$confirm("是否确定删除！", "删除提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true,
      }).then(() => {
        this.list.splice(index, 1);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  padding: 10px;
  font-weight: bold;
}
.btn-group {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #eaeefb;
}
.option_title {
  width: 400px;
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}
</style>
