<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" inline>
          <el-form-item label="商标分类/子分类">
            <el-cascader clearable v-model="listQuery.productCategoryId" :options="serviceCascader" :props="{ expandTrigger: 'hover' }" style="width: 168px"></el-cascader>
          </el-form-item>
          <el-form-item label="商品属性名称">
            <el-input v-model="listQuery.attributeTypeName" placeholder="请输入服务属性名称" clearable style="width: 168px" @change="queryData" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="listQuery.attributeTypeStatus" placeholder="请选择" style="width: 168px" clearable @clear="queryData">
              <el-option label="启用" :value="'ENABLE'"></el-option>
              <el-option label="禁用" :value="'DISABLE'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
            <el-button type="cancel" @click="goBack"> 返回 </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button v-show="isNewModifications && hasAuthority('GC_8')" type="primary" :loading="isUpdateSpec" icon="el-icon-refresh" @click="updateSpecHandle">更新规格</el-button>
            <el-button type="success" @click="showAddModal" v-show="hasAuthority('GC_6')">
              <i class="icon icon-adds"></i>
              新增
            </el-button>
            <el-button type="primary" @click="toggleRowExpansion(true)" icon="el-icon-arrow-down" v-if="!openFlag"> 展开 </el-button>
            <el-button type="primary" @click="toggleRowExpansion(false)" icon="el-icon-arrow-up" v-else> 折叠 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        ref="table"
        v-loading="listLoading"
        :data="list"
        style="width: 100%"
        border
        :height="tableHeight"
        highlight-current-row
        row-key="id"
        :tree-props="{
          children: 'productAttributeList',
          hasChildren: 'hasChildren',
        }"
        :default-expand-all="false"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column align="center" label="序号" width="80">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品分类" width="300">
          <template slot-scope="scope"> {{ scope.row.productCategoryName || '-' }} / {{ scope.row.subProductCategoryName || '-' }} </template>
        </el-table-column>
        <el-table-column align="center" label="商品属性名称" width="300">
          <template slot-scope="scope">
            {{ scope.row.attributeTypeName ? scope.row.attributeTypeName : scope.row.attributeName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <div v-if="scope.row.attributeTypeName">
              <span v-if="scope.row.attributeTypeStatus == 'ENABLE'">
                <span class="dot-success"><span class="dot"></span></span>启用
              </span>
              <span v-else>
                <span class="dot-danger"><span class="dot"></span></span>禁用
              </span>
            </div>
            <div v-else>
              <span v-if="scope.row.attributeStatus == 'ENABLE'">
                <span class="dot-success"><span class="dot"></span></span>启用
              </span>
              <span v-else>
                <span class="dot-danger"><span class="dot"></span></span>禁用
              </span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="商品分类" width="300" prop="productCategoryName"></el-table-column>  -->
        <el-table-column align="center" label="创建人" prop="createName" width="150"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" width="150"></el-table-column>
        <el-table-column align="center" label="修改人" prop="updateName" width="150"></el-table-column>
        <el-table-column align="center" label="修改时间" prop="updateTime" width="150"></el-table-column>
        <el-table-column align="center" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="新增属性" placement="top">
              <el-link type="primary" class="icon icon-add" :underline="false" @click="addChild(scope.row)" v-if="scope.row.attributeTypeName" v-show="hasAuthority('GC_6')"> </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link type="primary" class="icon icon-edit" @click="showAddModal(scope.row)" :underline="false" v-show="hasAuthority('GC_6')"> </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="禁用" placement="top">
              <el-link type="primary" class="icon icon-disable" :underline="false" @click="changeDisableStatus(scope.row)" v-if="scope.row.attributeTypeStatus == 'ENABLE' || scope.row.attributeStatus == 'ENABLE'" v-show="hasAuthority('GC_7')"> </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="启用" placement="top">
              <el-link type="primary" class="icon icon-use" :underline="false" @click="changeDisableStatus(scope.row)" v-if="scope.row.attributeTypeStatus == 'DISABLE' || scope.row.attributeStatus == 'DISABLE'" v-show="hasAuthority('GC_7')"> </el-link>
            </el-tooltip>
            <!--
              （1）启用 状态下 显示：新增属性值 编辑  禁用
              （2）禁用状态下 显示 ：编辑 删除 启用
            -->
            <!-- <el-tooltip content="删除" placement="top">
              <el-link
                type="primary"
                :underline="false"
                @click="_delTableData(scope.row.id, scope.row.statusFlag ? 0 : 1)"
                icon="icon icon-del"
                v-show="hasAuthority('D1_33')"
              >
              </el-link>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>

    <!-- 服务属性新增编辑 -->
    <div class="dialog-container">
      <el-dialog title="新增/编辑" :visible.sync="addDialogVisible" width="400px">
        <el-form :model="addForm" :rules="formRule" ref="refservice" label-width="135px">
          <el-form-item label="商品分类：" prop="productCategoryId">
            <el-cascader :disabled="addForm.id ? true : false" v-model="addForm.productCategoryId" :options="serviceCascader" :props="{ expandTrigger: 'hover' }" style="width: 168px"> </el-cascader>
          </el-form-item>
          <el-form-item label="商品属性名称：" prop="attributeTypeName" v-if="addForm.id">
            <el-input v-model.trim="addForm.attributeTypeName" placeholder="请输入服务属性名称" clearable style="width: 168px" />
          </el-form-item>
          <template v-else>
            <el-form-item
              v-for="(attributeTypeName, index) in addForm.attributeTypeNameList"
              :label="'商品属性名称' + (Number(index) + 1) + '：'"
              :key="attributeTypeName.key"
              :prop="'attributeTypeNameList.' + index + '.value'"
              :rules="{
                required: true,
                message: '请输入服务属性名称',
                trigger: 'blur',
              }"
            >
              <el-input v-model="attributeTypeName.value" placeholder="请输入服务属性名称" clearable style="width: 168px" />
              <i @click="attributeAdd(addForm.attributeTypeNameList)" class="el-icon-circle-plus categoryName-icon" v-if="index == addForm.attributeTypeNameList.length - 1"></i>
              <i @click="attributeDel(addForm.attributeTypeNameList, index)" class="el-icon-remove-outline categoryName-icon" v-if="index > 0 || addForm.attributeTypeNameList.length > 1"></i>
            </el-form-item>
          </template>
          <el-form-item label="状态：" prop="attributeTypeStatus">
            <el-select v-model="addForm.attributeTypeStatus" placeholder="请选择" style="width: 168px" clearable>
              <el-option label="启用" :value="'ENABLE'"></el-option>
              <el-option label="禁用" :value="'DISABLE'"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="buttonLoading" @click="sumitBtnAdd">确 定</el-button>
          <el-button @click="addDialogVisible = false" size="small">取 消</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 新增/编辑属性值 -->
    <el-dialog title="新增/编辑属性值" :visible.sync="childClassModel" width="450px">
      <el-form :model="childForm" :rules="formRule" ref="refChildForm" label-width="135px">
        <el-form-item label=" 服务属性名称：">
          <el-input v-model="serviceName" clearable style="width: 200px" disabled />
        </el-form-item>
        <el-form-item label="属性值名称：" prop="attributeName" v-if="childForm.id">
          <el-input v-model.trim="childForm.attributeName" placeholder="请输入属性值名称" clearable style="width: 200px" />
        </el-form-item>
        <template v-else>
          <el-form-item
            v-for="(attributeName, index) in childForm.attributeNameList"
            :label="'商品属性名称' + (Number(index) + 1) + '：'"
            :key="attributeName.key"
            :prop="'attributeNameList.' + index + '.value'"
            :rules="{
              required: true,
              message: '请输入属性值名称',
              trigger: 'blur',
            }"
          >
            <el-input v-model="attributeName.value" placeholder="请输入属性值名称" clearable style="width: 200px" />
            <i @click="attributeAdd(childForm.attributeNameList)" class="el-icon-circle-plus categoryName-icon" v-if="index == childForm.attributeNameList.length - 1"></i>
            <i @click="attributeDel(childForm.attributeNameList, index)" class="el-icon-remove-outline categoryName-icon" v-if="index > 0 || childForm.attributeNameList.length > 1"></i>
          </el-form-item>
        </template>
        <el-form-item label="状态：" prop="attributeStatus">
          <el-select style="width: 200px" v-model="childForm.attributeStatus">
            <el-option label="启用" :value="'ENABLE'"></el-option>
            <el-option label="禁用" :value="'DISABLE'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="解释说明：" prop="explains" v-if="checkItemAttributeType === 2">
          <el-input type="textarea" v-model="childForm.explains" placeholder="请输入对该属性值的解释说明" clearable :rows="4" :maxlength="500" show-word-limit style="width: 200px" />
          <div class="text-desc">注：解释说明会显示在客户端，便于客户理解该定价属性值的定义</div>
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
import { productAttribute, addProductAttribute, updateAttrStatus, addOrupdate, updateStatus, delProductAttr } from '@/api/newApi/servicemerchant/productAttributes.js';
import { getallcategory } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { getGoodsAttribute, getGoodsCategory, saveProductAttribute, saveAttributeChildren, productAttributeCategoryQueryChanged, productCategoryGenerateSpecs } from '@/api/newApi/servicemerchant/goodsCenter.js';
import { uniq } from 'lodash';
export default {
  data() {
    return {
      listLoading: false,
      list: [],
      // 分页
      listTotal: 0,
      listQuery: {
        current: 1,
        size: 10,
        attributeTypeName: '',
        attributeTypeStatus: '',
        productCategoryId: '',
      },
      addDialogVisible: false,
      childClassModel: false, //子分类弹窗
      buttonLoading: false,

      addForm: {
        attributeTypeName: '',
        attributeTypeNameList: [
          {
            value: '',
            key: Date.now(),
          },
        ],
        productCategoryId: '',
        attributeTypeStatus: '',
      },
      serviceName: '', //父级属性名称
      childForm: {
        attributeStatus: '',
        attributeName: '',
        attributeNameList: [
          {
            value: '',
            key: Date.now(),
          },
        ],
      },
      serviceCascader: [],
      productType: '',
      formRule: {
        productCategoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        attributeTypeName: [{ required: true, message: '请输入服务属性名称', trigger: 'blur' }],
        attributeTypeStatus: [{ required: true, message: '请选择状态', trigger: 'change' }],
        class: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        attributeName: [{ required: true, message: '请输入属性值名称', trigger: 'blur' }],
      },
      openFlag: false,
      checkItemAttributeType: 1,
      searchFlag: false,
      isNewModifications: false,
      isUpdateSpec: false,
    };
  },
  created() {
    this.queryData();
    this._getallcategory();
    this.newModificationsHandle();
  },
  methods: {
    //添加属性
    attributeAdd(attribute) {
      attribute.push({
        value: '',
        key: Date.now(),
      });
    },
    //删除属性
    attributeDel(attribute, index) {
      attribute.splice(index, 1);
    },
    //是否有更新
    newModificationsHandle() {
      productAttributeCategoryQueryChanged().then((res) => {
        this.isNewModifications = res.data;
      });
    },
    //更新规格
    updateSpecHandle() {
      this.isUpdateSpec = true;
      productCategoryGenerateSpecs()
        .then((res) => {
          this.isUpdateSpec = false;
          if (res.code == 0) {
            this.isNewModifications = false;
            this.$message({
              message: `更新成功！`,
              type: 'success',
              duration: 2000,
            });
          }
        })
        .catch((err) => {
          this.isUpdateSpec = false;
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
    toggleRowExpansion(isExpansion) {
      this.list.forEach((item) => {
        this.$refs.table.toggleRowExpansion(item, isExpansion);
        this.openFlag = isExpansion;
      });
    },
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      let data = this.listQuery;
      for (let key in data) {
        if (data[key] === '') {
          delete data[key];
        }
      }
      if (this.$route.params.id) {
        data.productCategoryId = this.$route.params.id;
      }
      if (this.listQuery.productCategoryId) {
        data.productCategoryId = Array.isArray(this.listQuery.productCategoryId) ? this.listQuery.productCategoryId[this.listQuery.productCategoryId.length - 1] : this.listQuery.productCategoryId;
      }
      getGoodsAttribute(data)
        .then((res) => {
          this.listLoading = false;
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
        attributeTypeName: '',
        attributeTypeStatus: '',
      };
      this.queryData();
    },
    goBack() {
      this.$router.push('/serviceMerchant/channelGoods/goodsData');
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

    /** 新增子分类  二级*/
    addChild(row) {
      this.childClassModel = true;
      this.checkItemAttributeType = row.attributeType;
      this.childForm.id = '';
      this.childForm.attributeName = '';
      this.childForm.attributeNameList = [
        {
          value: '',
          key: Date.now(),
        },
      ];
      this.childForm.attributeStatus = 'ENABLE';
      this.serviceName = row.attributeTypeName;
      this.childForm.attibuteTypeId = row.id;
      this.childForm.productCategoryId = row.productCategoryId;
    },
    /** 新增子分类  提交*/
    sumitBtnAddChild() {
      this.$refs['refChildForm'].validate((valid) => {
        if (this.childForm.attributeName.includes('_')) {
          this.$message.warning('属性值名称不能输入"_"');
        } else if (valid) {
          this.buttonLoading = true;
          let attributeNameList = this.childForm.attributeNameList && this.childForm.attributeNameList.map((item) => item.value);
          if (attributeNameList.length !== uniq(attributeNameList).length) {
            this.buttonLoading = false;
            return this.$message.warning('属性值名称不能重复！');
          }
          saveAttributeChildren({
            ...this.childForm,
            attributeNameList,
          })
            .then((res) => {
              this.buttonLoading = false;
              if (res.code == 0) {
                this.$message.success('新增成功');
                this.childClassModel = false;
                this.queryData();
                this.newModificationsHandle();
              }
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
     * 编辑服务分类 一级/二级
     */
    showAddModal(row) {
      if (row.id) {
        if (row.attributeTypeName) {
          //一级属性弹窗
          this.addDialogVisible = true;
          this.addForm = {
            id: row.id,
            attributeTypeStatus: row.attributeTypeStatus,
            attributeTypeName: row.attributeTypeName,
            productCategoryId: row.productCategoryId,
          };
        } else {
          this.childClassModel = true;
          this.checkItemAttributeType = row.attributeType;
          this.childForm.id = row.id;
          this.childForm.productCategoryId = row.productCategoryId;
          this.childForm.attributeName = row.attributeName;
          this.childForm.attributeStatus = row.attributeStatus;
          this.serviceName = this.list.find((item) => row.attibuteTypeId == item.id).attributeTypeName;
          this.childForm.attibuteTypeId = this.list.find((item) => row.attibuteTypeId == item.id).id;
        }
      } else {
        this.addForm.id = '';
        this.addForm.attributeTypeName = '';
        this.addDialogVisible = true;
        this.addForm.attributeTypeStatus = '';
        this.addForm.productCategoryId = '';
        this.$set(this.addForm, 'attributeTypeNameList', [
          {
            value: '',
            key: Date.now(),
          },
        ]);
      }
    },
    /**
     * 新增服务属性 提交添加
     */
    sumitBtnAdd() {
      this.$refs.refservice.validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          let attributeTypeNameList = this.addForm.attributeTypeNameList && this.addForm.attributeTypeNameList.map((item) => item.value);
          if (attributeTypeNameList) {
            if (attributeTypeNameList.length !== uniq(attributeTypeNameList).length) {
              this.buttonLoading = false;
              return this.$message.warning('属性名称不能重复！');
            }
          }
          saveProductAttribute({
            ...this.addForm,
            attributeTypeNameList,
            productCategoryId: Array.isArray(this.addForm.productCategoryId) ? this.addForm.productCategoryId[this.addForm.productCategoryId.length - 1] : this.addForm.productCategoryId,
          })
            .then((res) => {
              this.buttonLoading = false;
              this.$message.success('新增服务成功');
              this.addDialogVisible = false;
              this.queryData();
              this.newModificationsHandle();
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
     * 切换禁用启用
     */
    changeDisableStatus(row) {
      let type = '';
      if (row.attributeTypeName) {
        type = row.attributeTypeStatus;
      } else {
        type = row.attributeStatus;
      }
      let stauts = type == 'ENABLE' ? 'DISABLE' : 'ENABLE';
      let text = `是否确认${type == 'ENABLE' ? '禁用' : '启用'}?`;
      if (row.attributeTypeName && type == 'ENABLE') {
        text = '服务属性禁用会导致下级属性值全部禁用，会导致相关商品下架，是否确定要禁用！';
      }

      this.$confirm(text, '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        //一级属性启用/禁用
        if (row.attributeTypeName) {
          saveProductAttribute({
            id: row.id,
            productCategoryId: row.productCategoryId,
            attributeTypeStatus: stauts,
            attributeTypeName: row.attributeTypeName,
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success('操作成功');
                this.addDialogVisible = false;
                this.queryData();
                this.newModificationsHandle();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          //子类属性值启用/禁用
          saveAttributeChildren({
            id: row.id,
            productCategoryId: row.productCategoryId,
            attributeStatus: stauts,
            attributeName: row.attributeName,
            attibuteTypeId: row.attibuteTypeId,
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success('操作成功');
                this.addDialogVisible = false;
                this.queryData();
                this.newModificationsHandle();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },

    /**
     * 删除
     */
    _delTableData(id, idType) {
      this.$confirm('确定删除？', '删除提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        delProductAttr({
          id,
          idType,
        }).then((res) => {
          if (res.code == 0) {
            this.$message.success('操作成功');
            this.queryData();
            this.newModificationsHandle();
          }
        });
      });
    },
  },
};
</script>
<style scoped lang="less">
.categoryName-icon {
  color: #1890ff;
  cursor: pointer;
  font-size: 18px;
  margin-left: 5px;
  position: relative;
  top: 2px;
}
</style>
