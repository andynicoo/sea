<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" inline>
          <el-form-item label="商品分类名称">
            <el-input v-model="listQuery.categoryName" placeholder="请输入商品分类名称" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="listQuery.status" placeholder="请选择" clearable style="width: 168px">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="success" @click="showAddModal({}, 'add')" v-show="hasAuthority('D1_13')">
              <i class="icon icon-adds"></i>
              新增
            </el-button>
            <el-button type="primary" icon="el-icon-arrow-down" @click="toggleRowExpansion">
              展开/折叠
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" :data="list" style="width: 100%" border :height="tableHeight" row-key="id" :expand-row-keys="foldList" :tree-props="{
          children: 'childrenProductCategoryVo',
          hasChildren: 'hasChildren'
        }" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <el-table-column align="center" label="序号" width="150">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品分类名称" width="300" prop="categoryName"></el-table-column>
        <el-table-column align="center" label="状态" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">
              <span class="dot-success"><span class="dot"></span></span>启用
            </span>
            <span v-else>
              <span class="dot-danger"><span class="dot"></span></span>禁用
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" prop="createName"></el-table-column>
        <el-table-column align="center" label="创建时间" width="150" prop="createTime"></el-table-column>
        <el-table-column align="center" label="修改人" prop="modifyName"></el-table-column>
        <el-table-column align="center" label="修改时间" width="150" prop="updateTime"></el-table-column>
        <el-table-column align="center" label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="新增子分类" placement="top">
              <el-link type="primary" class="icon icon-add" :underline="false" v-if="scope.row.isLeaf === 2" @click="addChild(scope.row, 'add')" v-show="hasAuthority('D1_14')">
              </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link type="primary" class="icon icon-edit" @click="edit(scope.row)" :underline="false" v-show="hasAuthority('D1_15')">
              </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="禁用" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-disable" v-if="scope.row.status === 1" @click="changeDisableStatus(scope.row)" v-show="hasAuthority('D1_16')">
                <!-- {{ scope.row.status === 1 ? "禁用" : "启用" }} -->
              </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="启用" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-use" v-if="scope.row.status != 1" @click="changeDisableStatus(scope.row)" v-show="hasAuthority('D1_17')">
              </el-link>
            </el-tooltip>
            <!-- <el-tooltip content="删除" placement="top">
              <el-link
                type="primary"
                :underline="false"
                @click="_delTableData(scope.row.id)"
                icon="icon icon-del"
                v-show="hasAuthority('D1_34')"
              >
              </el-link>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <!-- 服务分类新增编辑 -->
    <div class="dialog-container">
      <el-dialog title="新增/编辑" :visible.sync="addDialogVisible" width="392px" center @close="resetAddFields">
        <el-form :model="addForm" :rules="formRule" ref="addDialogForm" label-width="135px">
          <el-form-item label="商品分类名称" prop="categoryName">
            <el-input v-model="addForm.categoryName" placeholder="请输入商品分类名称" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select style="width: 168px" v-model="addForm.status">
              <el-option :value="1" label="启用">启用</el-option>
              <el-option :value="2" label="禁用">禁用</el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="buttonLoading" @click="sumitBtnAdd">确 定</el-button>
          <el-button @click="addDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 新增子分类 -->
    <el-dialog title="新增子分类" :visible.sync="childClassModel" width="385px" center @close="resetAddChildFields">
      <el-form :model="addChildForm" :rules="childFormRule" ref="childForm" label-width="135px">
        <el-form-item label="上级商品分类：">
          <el-input v-model="checkItem.parentName" style="width:168px" disabled />
        </el-form-item>
        <el-form-item label="子分类名称：" prop="categoryName">
          <el-input v-model="addChildForm.categoryName" placeholder="请输入子分类名称" clearable style="width: 168px" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select style="width: 168px" v-model="addChildForm.status">
            <el-option :value="1" label="启用">启用</el-option>
            <el-option :value="2" label="禁用">禁用</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务分类" prop="functionCode">
          <el-select style="width: 168px" v-model="addChildForm.functionCode" filterable>
            <el-option :value="item.id" :label="item.name" v-for="item in functionCode" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="buttonLoading" @click="sumitBtnAddChild">确 定</el-button>
        <el-button @click="childClassModel = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getProductAttrlist,
  getFunctionCode,
  categoryAddOrUpdate,
  updateCategoryStatus,
  delProductCate
} from "@/api/newApi/servicemerchant/productAttributes.js";
export default {
  data() {
    return {
      list: [],
      // 分页
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 10,
        categoryName: "",
        status: ""
      },
      addDialogVisible: false,
      childClassModel: false, //子分类弹窗
      buttonLoading: false,
      addForm: {
        categoryName: "",
        status: 1
      },
      addChildForm: {
        categoryName: "",
        functionCode: "",
        parentId: 0,
        status: 1
      },
      formRule: {
        categoryName: [{ required: true, message: "请输入商品分类名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      childFormRule: {
        categoryName: [{ required: true, message: "请输入子分类名称", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        functionCode: [{ required: true, message: "请选择业务工单流程", trigger: "change" }]
      },
      functionCode: [],
      searchFlag: false,
      checkItem: {},
      foldList: []
    };
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 1:
          return "启用";
        case 2:
          return "禁用";
      }
    }
  },
  created() {
    this._getFunctionCode();
    this.queryData();
  },
  methods: {
    /**
     * 查询列表
     */
    queryData() {
      getProductAttrlist(this.listQuery)
        .then(res => {
          this.listLoading = true;
          if (res.code == 0) {
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.listTotal}条结果`,
                type: "success",
                duration: 2000
              });
              this.searchFlag = false;
            }
          }
        })
        .catch(err => {
          this.listLoading = false;
        });
    },
    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryData();
    },
    _getFunctionCode() {
      getFunctionCode().then(res => {
        if (res.code === 0) {
          let result = res.data;
          for (let i in result) {
            this.functionCode.push({ id: i - 0, name: result[i] });
          }
        }
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryData();
    },
    resetAddFields() {
      if (this.$refs.addDialogForm) {
        this.$refs.addDialogForm.resetFields();
      }
    },
    /**
     * 新增服务分类 一级
     */
    showAddModal(row, type) {
      this.addDialogVisible = true;
      this.checkItem = row;
      this.checkItem.type = type;
      if (type === "edit") {
        const { categoryName, status } = row;
        this.$nextTick(() => {
          this.addForm = {
            categoryName,
            status
          };
        });
      }
    },
    /**
     * 新增服务分类 提交
     */
    sumitBtnAdd() {
      this.$refs["addDialogForm"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          let data = {
            ...this.addForm
          };
          if (this.checkItem.type === "edit") {
            data.id = this.checkItem.id;
          }
          categoryAddOrUpdate(data)
            .then(res => {
              this.buttonLoading = false;
              this.addDialogVisible = false;
              this.queryData();
            })
            .catch(err => {
              this.buttonLoading = false;
            });
        }
      });
    },
    resetAddChildFields() {
      if (this.$refs.childForm) {
        this.$refs.childForm.resetFields();
      }
    },
    /** 新增子分类  二级*/
    addChild(row, type) {
      this.childClassModel = true;
      this.$forceUpdate();
      this.checkItem = row;
      this.checkItem.type = type;
      if (type === "edit") {
        this.checkItem.parentName = this.list.find(item => item.id === this.checkItem.parentId).categoryName;
        const { categoryName, functionCode, parentId, status } = row;
        this.$nextTick(() => {
          this.addChildForm = {
            categoryName,
            functionCode,
            parentId,
            status
          };
        });
      } else {
        this.checkItem.parentName = this.checkItem.categoryName;
      }
    },
    /** 新增子分类  提交*/
    sumitBtnAddChild() {
      this.$refs["childForm"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          let data = {};
          if (this.checkItem.type === "add") {
            data = {
              ...this.addChildForm,
              parentId: this.checkItem.id
            };
          } else {
            data = {
              ...this.addChildForm,
              id: this.checkItem.id
            };
          }
          categoryAddOrUpdate(data)
            .then(res => {
              this.buttonLoading = false;
              this.childClassModel = false;
              this.queryData();
            })
            .catch(err => {
              this.buttonLoading = false;
            });
        }
      });
    },
    edit(row) {
      if (row.isLeaf === 2) {
        // 一级分类
        this.showAddModal(row, "edit");
      } else {
        // 二级分类
        this.addChild(row, "edit");
      }
    },
    /**
     * 切换禁用启用
     */
    changeDisableStatus(row) {
      let text = `是否确认${row.status === 1 ? "禁用" : "启用"}?`;
      if (row.isLeaf === 2 && row.status === 1) {
        text = "一级分类禁用会导致下级分类全部禁用，是否确定要禁用！";
      }
      this.$confirm(text, "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        updateCategoryStatus({
          id: row.id
        }).then(res => {
          if (res.code == 0) {
            this.$message.success("操作成功");
            this.queryData();
          }
        });
      });
    },
    // 切换展开/折叠
    toggleRowExpansion() {
      this.list.forEach(row => {
        this.$refs.table.toggleRowExpansion(row, row.expanded);
      });
    },
    // 删除
    _delTableData(id) {
      this.$confirm("确定删除？", "删除提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true
      }).then(() => {
        delProductCate({id}).then(res => {
          if (res.code === 0) {
            this.$message.success("操作成功");
            this.queryData();
          }
        });
      });
    }
  }
};
</script>
<style scoped lang="less"></style>
