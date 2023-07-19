<template>
  <div class="app-container">
    <div class="header-container">
      <el-descriptions title="用户信息">
        <el-descriptions-item label="姓名">{{ info.nickName }}</el-descriptions-item>
        <el-descriptions-item label="账号">{{ info.userName }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ info.mobile }}</el-descriptions-item>
        <el-descriptions-item label="部门名称">{{ info.departmentName }}</el-descriptions-item>
      </el-descriptions>
      <el-tabs v-model="activeName" v-loading="saveDisabled">
        <el-tab-pane label="企业权限" name="first">
          <el-table ref="companyTable" class="table" :data="firmList" @selection-change="companySelectChange" height="calc(100vh - 350px)">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="name" label="企业名称列表"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="角色权限" name="second">
          <el-table ref="roleTable" class="table" :data="roleList" @select="selectRoleChange" @select-all="selectAllRoles" height="calc(100vh - 350px)">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="roleId" label="角色编码">
              <template slot="header">
                <div class="header-slot">
                  <span>角色编码</span>
                  <el-input class="header-input" size="mini" v-model="filterRoleId" clearable @input="filterRole" placeholder="过滤条件" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="roleName" label="名称">
              <template slot="header">
                <div class="header-slot">
                  <span>名称</span>
                  <el-input class="header-input" size="mini" v-model="filterRoleName" clearable @input="filterRole" placeholder="过滤条件" />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="分配权限" name="third">
          <div class="tree-header">
            <div style="flex: 1">菜单</div>
            <div style="flex: 2">操作</div>
          </div>
          <el-tree class="tree" ref="tree" :data="roleData" show-checkbox node-key="authorityId" default-expand-all :expand-on-click-node="false" :default-checked-keys="checkList" @check="check" @check-change="checkChange">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span style="flex: 1">{{ data.menuName }}</span>
              <span style="flex: 2">
                <el-checkbox-group v-model="formItem.grantActions">
                  <el-checkbox :disabled="item.disabled" v-for="(item, index) in data.actionList" :label="item.authorityId" :key="index">
                    <span :title="item.actionDesc">{{ item.actionName }}</span>
                  </el-checkbox>
                </el-checkbox-group>
              </span>
            </span>
          </el-tree>
        </el-tab-pane>
      </el-tabs>
      <div class="btn-group">
        <el-button size="small" type="default" @click="cancel">取消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit" :loading="saving" :disabled="saveDisabled">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { listConvertTree } from '@/libs/util';
import { getFirm } from '@/api/newApi/common.js';
import { getAllRoles } from '@/api/role';
import { getUserRoles, addUserRoles, getBaseUserInfo, getUserCompany, setUserCompany } from '@/api/user';
import { getAuthorityMenu, getAuthorityUser, grantAuthorityUser } from '@/api/authority';
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      activeName: 'first',
      info: {},
      initRoleData: [],
      roleData: [],
      userId: this.$route.query.userId || 0,
      formItem: {
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
        userCompanyList: [],
        grantRoles: [],
        grantActions: [],
        grantMenus: [],
        expireTime: '',
        isExpired: false,
        departmentId: '',
        departmentName: '',
        parentUserId: '',
        parentUserName: '',
      },
      saving: false,
      checkList: [],
      firmList: [],
      roleList: [],
      copyRoleList: [],
      filterRoleId: '',
      filterRoleName: '',
      checkedItems: new Map(),
      saveDisabled: true,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getfirmList();
      await this.getRoleList();
      this.getInfo();
      this.handleLoadUserGranted();
      this.handleLoadRoles();
      this.handleLoadCompany();
    },
    getInfo() {
      getBaseUserInfo({
        userId: this.userId,
      }).then((res) => {
        if (res.code === 0) {
          this.info = res.data;
        }
      });
    },
    // 获取企业列表
    getfirmList() {
      return new Promise((resolve) => {
        getFirm().then((res) => {
          if (res.code == 0) {
            res.data.forEach((item) => {
              item.id = item.id + '';
            });
            this.firmList = res.data;
            resolve();
          }
        });
      });
    },
    // 获取权限列表
    getRoleList() {
      return new Promise((resolve) => {
        getAllRoles().then((res) => {
          if (res.code === 0) {
            res.data = res.data.filter((item) => item.status === 1);
            this.roleList = res.data;
            this.copyRoleList = res.data;
            resolve();
          }
        });
      });
    },
    // 设置企业
    handleLoadCompany() {
      getUserCompany({
        userId: this.userId,
      }).then((res) => {
        if (res.code === 0) {
          this.formItem.userCompanyList = res.data.map((item) => item.enterpriseId).concat(this.$route.query.companyId ? [this.$route.query.companyId] : []);
          this.setCompanySelection();
        }
      });
    },
    // 设置企业选中
    setCompanySelection() {
      this.firmList
        .filter((item) => this.formItem.userCompanyList.includes(item.id))
        .forEach((row) => {
          this.$refs.companyTable.toggleRowSelection(row);
        });
    },
    // 设置角色
    handleLoadRoles() {
      getUserRoles(this.userId).then((res) => {
        if (res.code === 0) {
          this.formItem.grantRoles = res.data.map((item) => item.roleId);
          this.setSelection();
        }
      });
    },
    // 设置角色选中
    setSelection() {
      this.roleList
        .filter((item) => this.formItem.grantRoles.includes(item.roleId))
        .forEach((row) => {
          this.$refs.roleTable.toggleRowSelection(row);
        });
    },
    companySelectChange(selection) {
      this.formItem.userCompanyList = selection.map((item) => item.id);
    },
    // 获取并设置权限列表
    handleLoadUserGranted() {
      const p1 = getAuthorityMenu();
      const p2 = getAuthorityUser(this.userId);
      let roleAuthorites = [];
      Promise.all([p1, p2]).then((values) => {
        let res1 = values[0];
        let res2 = values[1];
        if (res1.code === 0 && res1.data) {
          let opt = {
            primaryKey: 'menuId',
            parentKey: 'parentId',
            startPid: '0',
          };
          if (res2.code === 0 && res2.data) {
            let menus = [];
            let actions = [];
            res2.data.map((item) => {
              if (item.owner === 'role') {
                roleAuthorites.push(item.authorityId);
              }
              // 菜单权限
              if (item.authority.indexOf('MENU_') !== -1 && !menus.includes(item.authorityId)) {
                menus.push(item.authorityId);
              }
              // 操作权限
              if (item.authority.indexOf('ACTION_') !== -1 && !actions.includes(item.authorityId)) {
                actions.push(item.authorityId);
              }
            });
            this.formItem.grantMenus = menus;
            this.formItem.grantActions = actions;
            // 时间
            if (res2.data.length) {
              this.formItem.expireTime = res2.data[0].expireTime;
              this.formItem.isExpired = res2.data[0].isExpired;
            }
          }
          let parentIds = [];
          let menuItems = [];
          res1.data.map((item) => {
            // 菜单选中
            if (this.formItem.grantMenus.includes(item.authorityId)) {
              item.checked = true;
              parentIds.push(item.parentId);
              menuItems.push(item);
              // 归属角色权限,禁止授权
              if (roleAuthorites.includes(item.authorityId)) {
                item.disabled = true;
              }
            }
            // 功能权限
            item.actionList.map((action) => {
              if (roleAuthorites.includes(action.authorityId)) {
                action.disabled = true;
              }
            });
          });
          parentIds = [...new Set(parentIds)];
          this.roleData = [];
          this.checkList = menuItems.filter((item) => !parentIds.some((i) => i === item.menuId)).map((item) => item.authorityId);
          this.initRoleData = [...res1.data];
          this.$nextTick(() => {
            this.roleData = listConvertTree(res1.data, opt);
          });
          this.saveDisabled = false;
        }
      });
    },
    // 过滤角色
    filterRole() {
      const grantRoles = [...this.formItem.grantRoles];
      this.roleList = this.copyRoleList.filter((item) => item.roleId.indexOf(this.filterRoleId) !== -1).filter((item) => item.roleName.indexOf(this.filterRoleName) !== -1);

      this.formItem.grantRoles = [...grantRoles];
      this.$nextTick(() => {
        this.setSelection();
      });
    },
    selectRoleChange(selection, row) {
      if (this.formItem.grantRoles.includes(row.roleId)) {
        // 取消选中
        this.formItem.grantRoles = this.formItem.grantRoles.filter((item) => item !== row.roleId);
      } else {
        // 选中
        this.formItem.grantRoles.push(row.roleId);
      }
    },
    selectAllRoles(selection) {
      let roles = this.roleList.map((item) => item.roleId);
      if (selection.length === 0) {
        // 取消全选
        this.formItem.grantRoles = this.formItem.grantRoles.filter((item) => !roles.includes(item));
      } else {
        // 全选
        this.formItem.grantRoles = [...new Set(this.formItem.grantRoles.concat(roles))];
      }
    },
    ...mapMutations(['closeTag']),
    cancel() {
      this.closeTag(this.$route);
      this.back();
    },
    back() {
      this.$router.push({
        path: '/system/user/index',
      });
    },
    handleSubmit() {
      if (!this.formItem.userCompanyList.length) {
        this.$message.warning('至少选择一个企业');
        return;
      }
      this.saving = true;
      Promise.all([this.saveFirm(), this.saveRole(), this.saveGrant()])
        .then((res) => {
          this.$message.success('保存成功');
          this.handleLoadUserGranted();
        })
        .finally((e) => {
          this.saving = false;
        });
    },
    // 复选框被点击时
    check(checkItem, checkObj) {
      // 父级选中子级
      if (checkObj.checkedKeys.includes(checkItem.authorityId) && checkItem.hasChild) {
        let list = [...this.checkedItems.values()].map((i) => i.ids).flat(Infinity);
        this.formItem.grantActions = [...new Set([...this.formItem.grantActions, ...list])];
      } else {
        this.checkedItems.clear();
      }
    },
    // 选项变化时
    checkChange(item, isChecked) {
      var _this = this;
      if (item.hasChild) {
        if (isChecked) {
          this.checkedItems.set(item.authorityId, {
            ids: item.actionList.map((i) => i.authorityId),
            item,
          });
          helper(item);
        }
      }
      let list = item.actionList.map((c) => c.authorityId);
      if (isChecked) {
        this.formItem.grantActions = [...new Set([...this.formItem.grantActions, ...list])];
      } else {
        this.formItem.grantActions = this.formItem.grantActions.filter((authorityId) => !list.includes(authorityId));
      }
      function helper(data) {
        data.children.forEach((c) => {
          _this.checkedItems.set(c.authorityId, {
            ids: c.actionList.map((i) => i.authorityId),
            item,
          });
          if (c.hasChild) {
            helper(c);
          }
        });
      }
    },
    // 保存修改企业权限
    saveFirm() {
      return new Promise((resolve) => {
        let data = this.firmList
          .filter((item) => this.formItem.userCompanyList.includes(item.id))
          .map((item) => ({
            enterpriseId: item.id,
            enterpriseName: item.name,
            userId: this.userId,
          }));
        setUserCompany({
          userEnterpriseUpdateDTOList: data,
        }).then((res) => {
          if (res.code === 0) {
            resolve();
          }
        });
      });
    },
    // 保存修改角色权限
    saveRole() {
      return new Promise((resolve) => {
        addUserRoles({
          userId: this.userId,
          grantRoles: this.formItem.grantRoles,
        }).then((res) => {
          if (res.code === 0) {
            resolve();
          }
        });
      });
    },
    // 保存修改分配权限
    saveGrant() {
      return new Promise((resolve) => {
        const authorityIds = this.getCheckedAuthorities();
        this.saving = true;
        grantAuthorityUser({
          userId: this.userId,
          expireTime: this.formItem.expireTime ? this.formItem.expireTime.pattern('yyyy-MM-dd HH:mm:ss') : '',
          authorityIds: authorityIds,
        }).then((res) => {
          if (res.code === 0) {
            resolve();
          }
        });
      });
    },
    getCheckedAuthorities() {
      const disabledMenus = this.initRoleData
        .filter((menu) => menu.disabled)
        .map((menu) => {
          const actionList = menu.actionList.filter((item) => item.disabled).map((m) => m.authorityId);
          return [menu.authorityId].concat(actionList);
        })
        .flat(Infinity);
      const menus = [...this.$refs.tree.getHalfCheckedKeys(), ...this.$refs.tree.getCheckedKeys()].concat(this.formItem.grantActions).filter((item) => !disabledMenus.includes(item));
      return menus;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tree-node__content {
  height: auto;
  padding: 12px 0;
  align-items: flex-start;
  border-bottom: 1px solid #eaeefb;
}
::v-deep .el-table::before {
  z-index: inherit;
}
::v-deep .el-tabs__nav-wrap::after {
  height: 1px;
}
.tree-header {
  width: 100%;
  height: 54px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  display: flex;
  align-items: center;
  background-color: #ebf5ff;
  & > div {
    flex: 1;
    margin-left: 65px;
  }
}
.table {
  .header-slot {
    padding: 10px 0;
    .header-input {
      margin-top: 10px;
    }
  }
}
.tree {
  max-height: calc(100vh - 405px) !important;
  overflow-y: auto;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  & > span {
    flex: 1;
    white-space: pre-wrap;
  }
}
.btn-group {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #fff;
}
</style>
