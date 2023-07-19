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
              <el-option label="启用" :value="'ENABLE'"></el-option>
              <el-option label="禁用" :value="'DISABLE'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="success" @click="showAddModal({}, 'add')" v-show="hasAuthority('GC_1')">
              <i class="icon icon-adds"></i>
              新增
            </el-button>
            <el-button type="primary" icon="el-icon-arrow-down" @click="toggleRowExpansion"> 展开/折叠 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        ref="table"
        :data="list"
        style="width: 100%"
        border
        row-key="id"
        :expand-row-keys="foldList"
        :tree-props="{
          children: 'childrenProductCategory',
          hasChildren: 'hasChildren',
        }"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column align="center" label="序号" width="150">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品分类名称" width="300" prop="categoryName"></el-table-column>
        <el-table-column align="center" label="状态" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'ENABLE'">
              <span class="dot-success"><span class="dot"></span></span>启用
            </span>
            <span v-else>
              <span class="dot-danger"><span class="dot"></span></span>禁用
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" prop="createName"></el-table-column>
        <el-table-column align="center" label="创建时间" width="150" prop="createTime"></el-table-column>
        <el-table-column align="center" label="修改人" prop="updateName"></el-table-column>
        <el-table-column align="center" label="修改时间" width="150" prop="updateTime"></el-table-column>
        <el-table-column align="center" label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="新增子分类" placement="top">
              <el-link type="primary" class="icon icon-add" :underline="false" v-if="scope.row.parentId == 0" @click="addChild(scope.row, 'add')" v-show="hasAuthority('GC_1')"> </el-link>
            </el-tooltip>
            <!-- <el-tooltip effect="dark" content="生成规格" placement="top">
              <el-link type="primary" class="icon el-icon-folder-add" @click="addSpecs(scope.row)" :underline="false" v-show="hasAuthority('D1_15')" v-if="scope.row.parentId != 0">
              </el-link>
            </el-tooltip> -->
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link type="primary" class="icon icon-edit" @click="edit(scope.row)" :underline="false" v-show="hasAuthority('GC_1')"> </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="禁用" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-disable" v-if="scope.row.status == 'ENABLE'" @click="changeDisableStatus(scope.row)" v-show="hasAuthority('GC_2')">
                <!-- {{ scope.row.status === 1 ? "禁用" : "启用" }} -->
              </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="启用" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-use" v-if="scope.row.status != 'ENABLE'" @click="changeDisableStatus(scope.row)" v-show="hasAuthority('GC_2')"> </el-link>
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
            <el-tooltip effect="dark" content="新增属性" placement="top" v-if="scope.row.parentId != 0 && scope.row.status == 'ENABLE'">
              <el-link type="primary" class="icon icon-add" @click="addAttributeType(scope.row)" :underline="false" v-show="hasAuthority('GC_6')"> </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <!-- 服务分类新增编辑 -->
    <div class="dialog-container">
      <el-dialog title="新增/编辑" :visible.sync="addDialogVisible" width="392px" center @close="resetAddFields">
        <el-form :model="addForm" :rules="formRule" ref="addDialogForm" label-width="135px">
          <el-form-item label="商品分类名称" prop="categoryName">
            <el-input v-model="addForm.categoryName" placeholder="请输入商品分类名称" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="商品编码" prop="categoryName">
            <el-input v-model="addForm.code" placeholder="请输入商品编码" clearable style="width: 168px" :disabled="isEdit" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select style="width: 168px" v-model="addForm.status">
              <el-option label="启用" :value="'ENABLE'"></el-option>
              <el-option label="禁用" :value="'DISABLE'"></el-option>
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
    <el-dialog title="新增子分类" :visible.sync="childClassModel" width="485px" center @close="resetAddChildFields">
      <el-form :model="addChildForm" :rules="childFormRule" ref="childForm" label-width="135px" class="childClass-form">
        <el-form-item label="上级商品分类：">
          <el-input v-model="checkItem.parentName" style="width: 168px" disabled />
        </el-form-item>
        <el-form-item label="子分类名称：" v-if="checkItem.type == 'edit'" prop="categoryName">
          <el-input v-model="addChildForm.categoryName" style="width: 168px" />
        </el-form-item>
        <template v-else>
          <el-form-item
            v-for="(categoryName, index) in addChildForm.categoryNames"
            :label="'子分类名称' + (Number(index) + 1) + '：'"
            :key="categoryName.key"
            :prop="'categoryNames.' + index + '.value'"
            :rules="{
              required: true,
              message: '请输入子分类名称',
              trigger: 'blur',
            }"
          >
            <el-input v-model="categoryName.value" placeholder="请输入子分类名称" clearable style="width: 168px" />
            <i @click="categoryNameAdd(addChildForm.categoryNames)" class="el-icon-circle-plus categoryName-icon" v-if="index == addChildForm.categoryNames.length - 1"></i>
            <i @click="categoryNameDel(addChildForm.categoryNames, index)" class="el-icon-remove-outline categoryName-icon" v-if="index > 0 || addChildForm.categoryNames.length > 1"></i>
          </el-form-item>
        </template>
        <el-form-item label="状态" prop="status">
          <el-select style="width: 168px" v-model="addChildForm.status">
            <el-option label="启用" :value="'ENABLE'"></el-option>
            <el-option label="禁用" :value="'DISABLE'"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="业务分类" prop="functionCode">
          <el-select style="width: 168px" v-model="addChildForm.functionCode" filterable>
            <el-option :value="item.id" :label="item.name" v-for="item in functionCode" :key="item.id"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="buttonLoading" @click="sumitBtnAddChild">确 定</el-button>
        <el-button @click="childClassModel = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 服务属性新增 -->
    <el-dialog title="新增" :visible.sync="addAttributeTypeVisible" width="460px">
      <el-form :model="addAttributeTypeForm" :rules="addAttributeTypeFormRule" ref="refservice" label-width="135px">
        <el-form-item label="商品分类：" prop="productCategoryId">
          <el-cascader disabled v-model="addAttributeTypeForm.productCategoryId" :options="serviceCascader" :props="{ expandTrigger: 'hover' }" style="width: 228px"> </el-cascader>
        </el-form-item>
        <!-- <el-form-item label="商品属性名称：" prop="attributeTypeName">
          <el-input v-model.trim="addAttributeTypeForm.attributeTypeName" placeholder="请输入服务属性名称" clearable style="width: 228px" />
        </el-form-item> -->
        <el-form-item
          v-for="(categoryName, index) in addAttributeTypeForm.attributeTypeNameList"
          :label="'商品属性名称' + (Number(index) + 1) + '：'"
          :key="categoryName.key"
          :prop="'attributeTypeNameList.' + index + '.value'"
          :rules="{
            required: true,
            message: '请输入服务属性名称',
            trigger: 'blur',
          }"
        >
          <el-input v-model="categoryName.value" placeholder="请输入服务属性名称" clearable style="width: 228px" />
          <i @click="categoryNameAdd(addAttributeTypeForm.attributeTypeNameList)" class="el-icon-circle-plus categoryName-icon" v-if="index == addAttributeTypeForm.attributeTypeNameList.length - 1"></i>
          <i @click="categoryNameDel(addAttributeTypeForm.attributeTypeNameList, index)" class="el-icon-remove-outline categoryName-icon" v-if="index > 0 || addAttributeTypeForm.attributeTypeNameList.length > 1"></i>
        </el-form-item>
        <el-form-item label="状态：" prop="attributeTypeStatus">
          <el-select v-model="addAttributeTypeForm.attributeTypeStatus" placeholder="请选择" style="width: 228px" clearable>
            <el-option label="启用" :value="'ENABLE'"></el-option>
            <el-option label="禁用" :value="'DISABLE'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="buttonLoading" @click="addAttributeTypeOk">确 定</el-button>
        <el-button @click="addAttributeTypeVisible = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getGoodsCategory, saveProductCategory, saveCategoryChildren, getFunctionCode, goodsSpecs, saveProductAttribute } from '@/api/newApi/servicemerchant/goodsCenter.js';
import { uniq } from 'lodash';
export default {
  data() {
    return {
      list: [],
      // 分页
      listTotal: 0,
      listQuery: {
        current: 1,
        size: 10,
        categoryName: '',
        status: '',
      },
      addDialogVisible: false,
      childClassModel: false, //子分类弹窗
      buttonLoading: false,
      addForm: {
        categoryName: '',
        code: '',
        status: '',
      },
      addChildForm: {
        categoryNames: [
          {
            value: '',
            key: Date.now(),
          },
        ],
        categoryName: '',
        functionCode: '',
        parentId: 0,
        status: '',
      },
      formRule: {
        categoryName: [{ required: true, message: '请输入商品分类名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
      childFormRule: {
        categoryName: [{ required: true, message: '请输入子分类名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        functionCode: [{ required: true, message: '请选择业务工单流程', trigger: 'change' }],
      },
      functionCode: [],
      searchFlag: false,
      checkItem: {},
      foldList: [],
      isEdit: false,

      //新增属性组
      serviceCascader: [],
      addAttributeTypeFormRule: {
        attributeTypeName: [{ required: true, message: '请输入服务属性名称', trigger: 'blur' }],
        attributeTypeStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
        class: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        attributeName: [{ required: true, message: '请输入属性值名称', trigger: 'blur' }],
      },
      addAttributeTypeVisible: false,
      addAttributeTypeForm: {
        attributeTypeName: '',
        attributeTypeNameList: [
          {
            value: '',
            key: Date.now(),
          },
        ],
        attributeTypeStatus: '',
      },
    };
  },
  created() {
    this._getFunctionCode();
    this.queryData();
  },
  methods: {
    //新增属性组弹窗
    addAttributeType(row) {
      console.log(row);
      this.addAttributeTypeForm.id = '';
      this.addAttributeTypeForm.attributeTypeName = '';
      this.addAttributeTypeForm.attributeTypeStatus = '';
      this.addAttributeTypeForm.productCategoryId = row.id;
      this.addAttributeTypeVisible = true;
    },
    /**
     * 新增属性组 提交添加
     */
    addAttributeTypeOk() {
      this.$refs.refservice.validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let attributeTypeNameList = this.addAttributeTypeForm.attributeTypeNameList.map((item) => item.value);
          if (attributeTypeNameList.length !== uniq(attributeTypeNameList).length) {
            this.buttonLoading = false;
            return this.$message.warning('属性名称不能重复！');
          }
          saveProductAttribute({
            ...this.addAttributeTypeForm,
            attributeTypeNameList,
            productCategoryId: Array.isArray(this.addAttributeTypeForm.productCategoryId) ? this.addAttributeTypeForm.productCategoryId[this.addAttributeTypeForm.productCategoryId.length - 1] : this.addAttributeTypeForm.productCategoryId,
          })
            .then((res) => {
              this.buttonLoading = false;
              this.$message.success('服务属性新增成功');
              this.addAttributeTypeVisible = false;
            })
            .catch((err) => {
              this.$message({
                type: 'error',
                message: err.message,
              });
              this.buttonLoading = false;
            });
        }
      });
    },
    /**
     * 获取所有商品类目和属性，级联选择器分类数据
     */
    _getallcategory() {
      getGoodsCategory({ current: 1, size: 100, status: 'ENABLE' })
        .then((res) => {
          if (res.code == 0) {
            let recordsHandle = res.data.records.filter((item) => {
              return item.childrenProductCategory && item.childrenProductCategory.length;
            });
            this.serviceCascader = this.getCategory(recordsHandle);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 递归格式化所有商品类目和属性
     */
    getCategory(arr) {
      return arr.map((res) => {
        const t = res.childrenProductCategory;
        const obj = {
          label: res.categoryName,
          value: res.id,
        };
        t.length == 0
          ? void 0
          : Object.defineProperty(obj, 'children', {
              enumerable: true,
              configurable: false,
              writable: false,
              value: this.getCategory(t),
            });
        return obj;
      });
    },
    //添加子分类
    categoryNameAdd(categoryNames) {
      categoryNames.push({
        value: '',
        key: Date.now(),
      });
    },
    //删除子分类
    categoryNameDel(categoryNames, index) {
      categoryNames.splice(index, 1);
    },
    /**
     * 查询列表
     */
    queryData() {
      let data = this.listQuery;
      for (let key in data) {
        if (data[key] === '') {
          delete data[key];
        }
      }
      getGoodsCategory(data)
        .then((res) => {
          this.listLoading = true;
          if (res.code == 0) {
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
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });

      this._getallcategory();
    },
    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryData();
    },
    reset() {
      this.listQuery = {
        current: 1,
        size: 10,
        categoryName: '',
        status: '',
      };
      this.queryData();
    },
    _getFunctionCode() {
      getFunctionCode().then((res) => {
        if (res.code === 0) {
          let result = res.data;
          for (name in result) {
            this.functionCode.push({ id: name, name: result[name] });
          }
        }
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.listQuery.current = val;
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
      if (type === 'edit') {
        this.isEdit = true;
        const { categoryName, status, code } = row;
        this.$nextTick(() => {
          this.addForm = {
            categoryName,
            code,
            status,
          };
        });
      } else {
        this.isEdit = false;
        this.addForm = {
          categoryName: '',
          code: '',
          status: '',
        };
      }
    },
    /**
     * 新增服务分类 提交
     */
    sumitBtnAdd() {
      this.$refs['addDialogForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let data = {
            ...this.addForm,
          };
          if (this.checkItem.type === 'edit') {
            data.id = this.checkItem.id;
          }
          saveProductCategory(data)
            .then((res) => {
              this.buttonLoading = false;
              this.addDialogVisible = false;
              this.queryData();
            })
            .catch((err) => {
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
      this.checkItem = row;
      // this.checkItem.type = type;
      this.$set(this.checkItem, 'type', type);
      console.log(this.checkItem, 'this.checkItem');
      if (type === 'edit') {
        this.checkItem.parentName = this.list.find((item) => item.id === this.checkItem.parentId).categoryName;
        const { categoryName, functionCode, parentId, status } = row;
        this.$nextTick(() => {
          this.addChildForm = {
            categoryNames: [
              {
                value: '',
                key: Date.now(),
              },
            ],
            categoryName,
            functionCode: functionCode.toString(),
            parentId,
            status,
          };
        });
      } else {
        this.checkItem.parentName = this.checkItem.categoryName;
      }
      this.$forceUpdate();
    },
    addSpecs(row) {
      goodsSpecs({ categoryId: row.id })
        .then((res) => {
          if (res.code == 0) {
            this.$message.success('生成规格成功');
          }
        })
        .catch((err) => {});
    },
    /** 新增子分类  提交*/
    sumitBtnAddChild() {
      this.$refs['childForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let data = {};
          if (this.checkItem.type === 'add') {
            let categoryNameList = this.addChildForm.categoryNames.map((item) => item.value);
            if (categoryNameList.length !== uniq(categoryNameList).length) {
              this.buttonLoading = false;
              return this.$message.warning('子类名称不能重复！');
            }
            data = {
              ...this.addChildForm,
              categoryNameList,
              parentId: this.checkItem.id,
            };
          } else {
            data = {
              ...this.addChildForm,
              id: this.checkItem.id,
            };
          }
          saveCategoryChildren(data)
            .then((res) => {
              this.buttonLoading = false;
              this.childClassModel = false;
              this.queryData();
            })
            .catch((err) => {
              this.buttonLoading = false;
            });
        }
      });
    },
    edit(row) {
      if (row.parentId == 0) {
        // 一级分类
        this.showAddModal(row, 'edit');
      } else {
        // 二级分类
        this.addChild(row, 'edit');
      }
    },
    /**
     * 切换禁用启用
     */
    changeDisableStatus(row) {
      let stauts = row.status == 'ENABLE' ? 'DISABLE' : 'ENABLE';
      let text = `是否确认${row.status == 'ENABLE' ? '禁用' : '启用'}?`;
      if (row.parentId == 0 && row.status == 'ENABLE') {
        text = '一级分类禁用会导致下级分类全部禁用，会导致相关商品下架，是否确定要禁用！';
      }
      this.$confirm(text, '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        if (row.parentId == 0) {
          saveProductCategory({
            id: row.id,
            status: stauts,
            categoryName: row.categoryName,
          }).then((res) => {
            if (res.code == 0) {
              this.$message.success('操作成功');
              this.queryData();
            }
          });
        } else {
          saveCategoryChildren({
            id: row.id,
            status: stauts,
            categoryName: row.categoryName,
            parentId: row.saveCategoryChildren,
            functionCode: row.functionCode,
          }).then((res) => {
            if (res.code == 0) {
              this.$message.success('操作成功');
              this.queryData();
            }
          });
        }
      });
    },
    // 切换展开/折叠
    toggleRowExpansion() {
      this.list.forEach((row) => {
        this.$refs.table.toggleRowExpansion(row, row.expanded);
      });
    },
    // 删除
    // _delTableData(id) {
    //   this.$confirm("确定删除？", "删除提示", {
    //     customClass: "custom-confirm",
    //     type: "warning",
    //     center: true
    //   }).then(() => {
    //     delProductCate({id}).then(res => {
    //       if (res.code === 0) {
    //         this.$message.success("操作成功");
    //         this.queryData();
    //       }
    //     });
    //   });
    // }
  },
};
</script>
<style scoped lang="less">
.childClass-form {
  max-height: 400px;
  overflow-y: auto;
}
.categoryName-icon {
  color: #1890ff;
  cursor: pointer;
  font-size: 18px;
  margin-left: 5px;
  position: relative;
  top: 2px;
}
</style>
