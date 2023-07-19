<template>
  <div>
    <div class="app-container">
      <div class="header-container" ref="searchBox">
        <Form ref="searchForm" :model="pageInfo" inline :label-width="80">
          <FormItem label="角色名称" prop="roleName">
            <Input type="text" v-model="pageInfo.roleName" placeholder="请输入关键字" />
          </FormItem>
          <FormItem label="角色编码" prop="roleCode">
            <Input type="text" v-model="pageInfo.roleCode" placeholder="请输入关键字" />
          </FormItem>
          <FormItem :label-width="0">
            <el-button type="primary" icon="el-icon-search" @click="handleSearch(1)">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="handleResetForm('searchForm')">重置</el-button>
          </FormItem>
          <el-button style="float: right" type="success" size="small" icon="icon icon-square-add" @click="handleModal()" v-show="hasAuthority('A1_10')"> 添加 </el-button>
        </Form>
      </div>
      <div class="table-container">
        <el-table border ref="table" :data="data" :loading="loading" :height="tableHeight">
          <Empty slot="empty" />
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="roleName" align="center" label="角色名称"></el-table-column>
          <el-table-column prop="roleCode" align="center" label="角色标识"></el-table-column>
          <el-table-column align="center" label="状态" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1"> <i class="icon icon-stuts-enable"></i>启用 </span>
              <span v-else> <i class="icon icon-stuts-disable"></i>禁用 </span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" align="center" label="最后修改时间"></el-table-column>
          <el-table-column prop="roleDesc" align="center" label="描述"></el-table-column>
          <el-table-column align="center" label="操作" prop="action">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="编辑" placement="top">
                <el-link type="primary" :underline="false" class="icon icon-edit" v-show="scope.row.roleCode != 'all' && hasAuthority('A1_11')" @click="handleModal(scope.row)"> </el-link>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除角色" placement="top">
                <el-link type="primary" class="icon icon-del" :underline="false" v-show="hasAuthority('A1_12')" @click="handleClick('remove', scope.row)"> </el-link>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination background @size-change="handlePageSize" @current-change="handlePage" :current-page.sync="pageInfo.page" :page-sizes="[10, 20, 30, 50]" :page-size="pageInfo.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <Modal v-model="modalVisible" :title="modalTitle" width="1200px" footer-hide @on-cancel="handleReset">
      <div>
        <Tabs @on-click="handleTabClick" :value="current">
          <TabPane label="角色信息" name="form1">
            <Form v-show="current == 'form1'" ref="form1" :model="formItem" :rules="formItemRules" :label-width="100">
              <FormItem label="角色标识" prop="roleCode">
                <Input style="width: 200px" v-model="formItem.roleCode" placeholder="请输入内容"></Input>
              </FormItem>
              <FormItem label="角色名称" prop="roleName">
                <Input style="width: 200px" v-model="formItem.roleName" placeholder="请输入内容"></Input>
              </FormItem>
              <FormItem label="状态">
                <RadioGroup v-model="formItem.status" type="button">
                  <Radio label="0">禁用</Radio>
                  <Radio label="1">启用</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="描述">
                <Input style="width: 300px" v-model="formItem.roleDesc" :rows="4" type="textarea" placeholder="请输入内容"></Input>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane :disabled="!formItem.roleId" label="分配权限" name="form2">
            <Form v-show="current == 'form2'" ref="form2" :model="formItem" :rules="formItemRules" :label-width="60">
              <FormItem label="过期时间" prop="expireTime">
                <Badge v-if="formItem.isExpired" text="授权已过期">
                  <DatePicker v-model="formItem.expireTime" class="ivu-form-item-error" type="datetime" placeholder="设置有效期"></DatePicker>
                </Badge>
                <DatePicker v-else v-model="formItem.expireTime" type="datetime" placeholder="设置有效期"></DatePicker>
              </FormItem>
              <FormItem label="功能菜单" prop="grantMenus">
                <!-- <tree-table
                  ref="tree"
                  style="max-height:480px;overflow: auto"
                  expand-key="menuName"
                  :expand-type="false"
                  :is-fold="false"
                  :tree-type="true"
                  :selectable="true"
                  :columns="columns2"
                  :data="selectMenus">
                  <template slot="operation" slot-scope="scope">
                    <CheckboxGroup v-model="formItem.grantActions">
                      <Checkbox v-for="(item,index) in scope.row.actionList" :label="item.authorityId" v-bind:key="index">
                        <span :title="item.actionDesc">{{item.actionName}}</span>
                      </Checkbox>
                    </CheckboxGroup>
                  </template>
                </tree-table> -->
                <div class="tree-header">
                  <div>菜单</div>
                  <div>操作</div>
                </div>
                <el-tree class="tree" ref="tree" :data="selectMenus" show-checkbox node-key="authorityId" default-expand-all :expand-on-click-node="false" :default-checked-keys="checkList" @check="check" @check-change="checkChange">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ data.menuName }}</span>
                    <span>
                      <el-checkbox-group v-model="formItem.grantActions">
                        <el-checkbox :disabled="item.disabled" v-for="(item, index) in data.actionList" :label="item.authorityId" :key="index">
                          <span :title="item.actionDesc">{{ item.actionName }}</span>
                        </el-checkbox>
                      </el-checkbox-group>
                    </span>
                  </span>
                </el-tree>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane :disabled="!formItem.roleId" label="角色成员" name="form3">
            <Form v-show="current == 'form3'" ref="form3" :model="formItem" :rules="formItemRules">
              <FormItem prop="authorities">
                <Transfer :data="selectUsers" :list-style="{ width: '45%', height: '480px' }" :titles="['选择用户', '已选择用户']" :render-format="transferRender" :target-keys="formItem.userIds" @on-change="handleTransferChange" filterable> </Transfer>
              </FormItem>
            </Form>
          </TabPane>
        </Tabs>
        <div class="modalFooter">
          <Button style="margin-right: 20px" type="primary" @click="handleSubmit" :loading="saving">保存</Button>
          <Button type="default" @click="handleReset">取消</Button>&nbsp;
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getRoles, updateRole, addRole, removeRole, getRoleUsers, addRoleUsers } from '@/api/role';
import { getAllUsers } from '@/api/user';
import { getAuthorityMenu, getAuthorityRole, grantAuthorityRole } from '@/api/authority';
import { listConvertTree } from '@/libs/util';

export default {
  name: 'SystemRole',
  data() {
    const validateEn = (rule, value, callback) => {
      let reg = /^[_a-zA-Z0-9]+$/;
      if (value === '') {
        callback(new Error('角色标识不能为空'));
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、下划线'));
      } else {
        callback();
      }
    };
    return {
      titles: ['选择接口', '已选择接口'],
      listStyle: {
        width: '240px',
        height: '500px',
      },
      loading: false,
      modalVisible: false,
      modalTitle: '',
      saving: false,
      current: 'form1',
      forms: ['form1', 'form2', 'form3'],
      checkList: [],
      selectApis: [],
      selectMenus: [],
      selectUsers: [],
      total: 0,
      pageInfo: {
        page: 1,
        pageSize: 10,
        nickName: '',
        mobile: '',
        email: '',
      },
      formItemRules: {
        roleCode: [{ required: true, validator: validateEn, trigger: 'blur' }],
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
      },
      formItem: {
        roleId: '',
        roleCode: '',
        roleName: '',
        path: '',
        status: 1,
        menuId: '',
        priority: 0,
        roleDesc: '',
        grantMenus: [],
        grantActions: [],
        expireTime: '',
        isExpired: false,
        userIds: [],
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '角色名称',
          key: 'roleName',
          width: 300,
        },
        {
          title: '角色标识',
          key: 'roleCode',
          width: 300,
        },
        {
          title: '状态',
          slot: 'status',
          key: 'status',
          width: 100,
          filters: [
            {
              label: '禁用',
              value: 0,
            },
            {
              label: '启用',
              value: 1,
            },
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 0) {
              return row.status === 0;
            } else if (value === 1) {
              return row.status === 1;
            }
          },
        },
        {
          title: '最后修改时间',
          key: 'updateTime',
          width: 200,
        },
        {
          title: '描述',
          key: 'roleDesc',
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 150,
        },
      ],
      columns2: [
        {
          title: '菜单',
          key: 'menuName',
          minWidth: '250px',
        },
        {
          title: '操作',
          type: 'template',
          template: 'operation',
          minWidth: '200px',
        },
      ],
      data: [],
      checkedItems: new Map(),
    };
  },
  methods: {
    handleModal(data) {
      if (data) {
        this.formItem = Object.assign({}, this.formItem, data);
      }
      if (this.current === this.forms[0]) {
        this.modalTitle = data ? '编辑角色 - ' + data.roleName : '添加角色';
        this.modalVisible = true;
      }
      if (this.current === this.forms[1]) {
        this.modalTitle = data ? '分配权限 - ' + data.roleName : '分配权限';
        this.handleLoadRoleGranted(this.formItem.roleId);
      }
      if (this.current === this.forms[2]) {
        this.modalTitle = data ? '角色成员 - ' + data.roleName : '角色成员';
        this.handleLoadRoleUsers(this.formItem.roleId);
      }
      this.formItem.status = this.formItem.status + '';
    },
    handleResetForm(form) {
      this.$refs[form].resetFields();
    },
    handleTabClick(name) {
      this.current = name;
      this.handleModal();
    },
    handleReset() {
      const newData = {
        roleId: '',
        roleCode: '',
        roleName: '',
        path: '',
        status: 1,
        menuId: '',
        priority: 0,
        roleDesc: '',
        grantMenus: [],
        grantActions: [],
        expireTime: '',
        isExpired: false,
        userIds: [],
      };
      this.formItem = newData;
      // 重置验证
      this.forms.map((form) => {
        this.handleResetForm(form);
      });
      this.current = this.forms[0];
      this.formItem.grantMenus = [];
      this.formItem.grantActions = [];
      this.modalVisible = false;
      this.saving = false;
    },
    handleSubmit() {
      if (this.current === this.forms[0]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true;
            if (this.formItem.roleId) {
              updateRole(this.formItem)
                .then((res) => {
                  if (res.code === 0) {
                    this.$Message.success('保存成功');
                    this.handleReset();
                    this.handleSearch();
                  }
                })
                .finally(() => {
                  this.saving = false;
                });
            } else {
              addRole(this.formItem)
                .then((res) => {
                  if (res.code === 0) {
                    this.$Message.success('保存成功');
                    this.handleReset();
                    this.handleSearch();
                  }
                })
                .finally(() => {
                  this.saving = false;
                });
            }
          }
        });
      }

      if (this.current === this.forms[1]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            const authorityIds = this.getCheckedAuthorities();
            this.saving = true;
            grantAuthorityRole({
              roleId: this.formItem.roleId,
              expireTime: this.formItem.expireTime ? this.formItem.expireTime.pattern('yyyy-MM-dd HH:mm:ss') : '',
              authorityIds: authorityIds,
            })
              .then((res) => {
                if (res.code === 0) {
                  this.$Message.success('授权成功');
                  this.handleReset();
                  this.handleSearch();
                }
              })
              .finally(() => {
                this.saving = false;
              });
          }
        });
      }

      if (this.current === this.forms[2]) {
        this.$refs[this.current].validate((valid) => {
          if (valid) {
            this.saving = true;
            addRoleUsers({
              roleId: this.formItem.roleId,
              userIds: this.formItem.userIds,
            })
              .then((res) => {
                if (res.code === 0) {
                  this.$Message.success('保存成功');
                  this.handleReset();
                  this.handleSearch();
                }
              })
              .finally(() => {
                this.saving = false;
              });
          }
        });
      }
    },
    // 当前选项变化时
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
    handleSearch(page) {
      if (page) {
        this.pageInfo.page = page;
      }
      this.loading = true;
      getRoles(this.pageInfo)
        .then((res) => {
          this.data = res.data.records;
          this.total = parseInt(res.data.total);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handlePage(current) {
      this.pageInfo.page = current;
      this.handleSearch();
    },
    handlePageSize(size) {
      this.pageInfo.limit = size;
      this.handleSearch();
    },
    handleRemove(data) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        onOk: () => {
          removeRole(data.roleId).then((res) => {
            if (res.code === 0) {
              this.pageInfo.page = 1;
              this.$Message.success('删除成功');
              this.handleSearch();
            }
          });
        },
      });
    },
    getCheckedAuthorities() {
      // const menus = this.$refs['tree'].getCheckedProp('authorityId')
      const menus = [...this.$refs.tree.getHalfCheckedKeys(), ...this.$refs.tree.getCheckedKeys()];
      return menus.concat(this.formItem.grantActions);
    },
    handleLoadRoleGranted(roleId) {
      if (!roleId) {
        return;
      }
      const that = this;
      const p1 = getAuthorityMenu();
      const p2 = getAuthorityRole(roleId);
      Promise.all([p1, p2]).then(function (values) {
        let res1 = values[0];
        let res2 = values[1];
        if (res1.code === 0 && res1.data) {
          let opt = {
            primaryKey: 'menuId',
            parentKey: 'parentId',
            startPid: '0',
          };
          if (res2.code === 0 && res2.data && res2.data.length > 0) {
            let menus = [];
            let actions = [];
            res2.data.map((item) => {
              // 菜单权限
              if (item.authority.indexOf('MENU_') !== -1 && !menus.includes(item.authorityId)) {
                menus.push(item.authorityId);
              }
              // 操作权限
              if (item.authority.indexOf('ACTION_') !== -1 && !actions.includes(item.authorityId)) {
                actions.push(item.authorityId);
              }
            });
            that.formItem.grantMenus = menus;
            that.formItem.grantActions = actions;
            // 时间
            if (res2.data.length > 0) {
              that.formItem.expireTime = res2.data[0].expireTime;
              that.formItem.isExpired = res2.data[0].isExpired;
            }
          }
          let parentIds = [];
          let menuItems = [];
          res1.data.map((item) => {
            // 菜单选中
            if (that.formItem.grantMenus.includes(item.authorityId)) {
              item._isChecked = true;
              item.checked = true;
              parentIds.push(item.parentId);
              menuItems.push(item);
            }
          });
          that.checkList = menuItems.filter((item) => !parentIds.some((i) => i === item.menuId)).map((item) => item.authorityId);
          that.selectMenus = listConvertTree(res1.data, opt);
        }
        that.modalVisible = true;
      });
    },
    handleLoadRoleUsers(roleId) {
      if (!roleId) {
        return;
      }
      const that = this;
      const p1 = getAllUsers();
      const p2 = getRoleUsers(roleId);
      Promise.all([p1, p2]).then(function (values) {
        let res1 = values[0];
        let res2 = values[1];
        if (res1.code === 0) {
          res1.data.map((item) => {
            item.key = item.userId;
            item.label = `${item.userName}(${item.nickName})`;
          });
          that.selectUsers = res1.data;
        }
        if (res2.code === 0) {
          let userIds = [];
          res2.data.map((item) => {
            if (!userIds.includes(item.userId)) {
              userIds.push(item.userId);
            }
          });
          that.formItem.userIds = userIds;
        }
        that.modalVisible = true;
      });
    },
    transferRender(item) {
      return `<span  title="${item.label}">${item.label}</span>`;
    },
    handleTransferChange(newTargetKeys, direction, moveKeys) {
      this.formItem.userIds = newTargetKeys;
    },
    handleClick(name, row) {
      switch (name) {
        case 'remove':
          this.handleRemove(row);
          break;
      }
    },
  },
  mounted: function () {
    this.handleSearch();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tree-node__content {
  height: auto;
  padding: 8px 0;
  align-items: flex-start;
  border-bottom: 1px solid #eaeefb;
}
::v-deep .el-tree {
  height: 300px;
  overflow-y: auto;
  .custom-tree-node {
    display: flex;
  }
}
::v-deep .el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  margin-left: 200px;
}
.tree-header {
  width: 100%;
  height: 54px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  & > div {
    flex: 1;
    margin-left: 65px;
  }
}
.modalFooter {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
</style>
