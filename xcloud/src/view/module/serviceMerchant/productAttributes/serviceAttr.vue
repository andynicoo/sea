<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" >
        <el-form ref="searchForm" inline>
          <el-form-item label="服务属性名称">
            <el-input
              v-model="listQuery.productAttributeCategoryName"
              placeholder="请输入服务属性名称"
              clearable
              style="width: 168px"
              @change="queryData"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="listQuery.productAttributeCategoryStatus"
              placeholder="请选择"
              style="width: 168px"
              clearable
              @clear="queryData"
            >
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="success" @click="showAddModal" v-show="hasAuthority('D1_8')">
              <i class="icon icon-adds"></i>
              新增
            </el-button>
            <el-button
              type="primary"
              @click="toggleRowExpansion(true)"
              icon="el-icon-arrow-down"
              v-if="!openFlag"
            >
              展开
            </el-button>
            <el-button type="primary" @click="toggleRowExpansion(false)" icon="el-icon-arrow-up"  v-else>
              折叠
            </el-button>
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
          children: 'productAttributeVoList',
          hasChildren: 'hasChildren'
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
        <el-table-column align="center" label="是否定价属性" width="110">
          <template slot-scope="scope">
            {{ scope.row.attributeType == 1 ? "否" : "是" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="服务属性名称" width="300" prop="attributeTypeName"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.attributeTypeStatus == 1" >
              <span class="dot-success"><span class="dot"></span></span>启用
            </span>
            <span v-else >
              <span class="dot-danger"><span class="dot"></span></span>禁用
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品分类" width="300" prop="productCategoryName"></el-table-column>
        <el-table-column align="center" label="创建人" prop="createName" width="150"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" width="150"></el-table-column>
        <el-table-column align="center" label="修改人" prop="modifyName" width="150"></el-table-column>
        <el-table-column align="center" label="修改时间" prop="updateTime" width="150"></el-table-column>
        <el-table-column align="center" label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="新增属性值" placement="top">
            <el-link
              type="primary"
              class="icon icon-add"
              :underline="false"
              @click="addChild(scope.row)"
              v-if="scope.row.attributeTypeStatus == 1 && scope.row.statusFlag == true"
              v-show="hasAuthority('D1_9')"
            >
            </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top">
            <el-link
              type="primary"
              class="icon icon-edit"
              @click="showAddModal(scope.row)"
              :underline="false"
              v-if="scope.row.isSystemAttribute != 2"
              v-show="hasAuthority('D1_10')"
            >
            </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="禁用" placement="top">
              <el-link
                type="primary"
                class="icon icon-disable"
                :underline="false"
                @click="changeDisableStatus(scope.row)"
                v-if="scope.row.isSystemAttribute != 2 && scope.row.attributeTypeStatus == 1"
                v-show="hasAuthority('D1_11')"
              >
                <!-- {{ scope.row.attributeTypeStatus == 1 ? "禁用" : "启用" }} -->
              </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="启用" placement="top">
              <el-link
                type="primary"
                class="icon icon-use"
                :underline="false"
                @click="changeDisableStatus(scope.row)"
                v-if="scope.row.isSystemAttribute != 2 && scope.row.attributeTypeStatus != 1"
                v-show="hasAuthority('D1_12')"
              >
              </el-link>
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
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
      ></el-pagination>
    </div>

    <!-- 服务属性新增编辑 -->
    <div class="dialog-container">
      <el-dialog title="新增/编辑" :visible.sync="addDialogVisible" width="400px">
        <el-form :model="addForm" :rules="formRule" ref="refservice" label-width="135px">
          <el-form-item label="商品分类：" prop="productCategoryId">
            <el-cascader
              v-model="addForm.productCategoryId"
              :options="serviceCascader"
              :props="{ expandTrigger: 'hover' }"
              style="width:168px"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="服务属性名称：" prop="name">
            <el-input
              v-model="addForm.name"
              placeholder="请输入服务属性名称"
              clearable
              style="width: 168px"
            />
          </el-form-item>
          <el-form-item label="状态：" prop="attributeTypeStatus">
            <el-select style="width: 168px" v-model="addForm.attributeTypeStatus">
              <el-option :value="1" label="启用">启用</el-option>
              <el-option :value="2" label="禁用">禁用</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否定价属性：" required prop="attributeType">
            <el-radio-group v-model="addForm.attributeType" :disabled="addForm.id != ''">
              <el-radio :label="2">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="buttonLoading" @click="sumitBtnAdd">确 定</el-button>
          <el-button @click="addDialogVisible = false" size="small">取 消</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 新增子分类 -->
    <el-dialog title="新增属性值" :visible.sync="childClassModel" width="420px">
      <el-form :model="childForm" :rules="formRule" ref="refChildForm" label-width="135px">
        <el-form-item label=" 服务属性名称：">
          <el-input v-model="serviceName" clearable style="width: 200px"  disabled />
        </el-form-item>
        <el-form-item label="属性值名称：" prop="attributeName">
          <el-input
            v-model="childForm.attributeName"
            placeholder="请输入子分类名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="attributeStatus">
          <el-select style="width: 200px"  v-model="childForm.attributeStatus">
            <el-option :value="1" label="启用">启用</el-option>
            <el-option :value="2" label="禁用">禁用</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="解释说明：" prop="explains" v-if="checkItemAttributeType === 2">
          <el-input
            type="textarea"
            v-model="childForm.explains"
            placeholder="请输入对该属性值的解释说明"
            clearable
            :rows="4"
            :maxlength="500"
            show-word-limit
            style="width: 200px"
          />
          <div class="text-desc">注：解释说明会显示在客户端，便于客户理解该定价属性值的定义</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"  :loading="buttonLoading" @click="sumitBtnAddChild">确 定</el-button>
        <el-button @click="childClassModel = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  productAttribute,
  addProductAttribute,
  updateAttrStatus,
  addOrupdate,
  updateStatus,
  delProductAttr
} from "@/api/newApi/servicemerchant/productAttributes.js";
import { getallcategory } from "@/api/newApi/servicemerchant/serviceMerchant.js";
export default {
  data() {
    return {
      listLoading: false,
      list: [],
      // 分页
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 10,
        productAttributeCategoryName: "",
        productAttributeCategoryStatus: ""
      },
      addDialogVisible: false,
      childClassModel: false, //子分类弹窗
      buttonLoading: false,

      addForm: {
        name: "",
        attributeTypeStatus: 1,
        attributeType: 1
      },
      serviceName: "", //父级属性名称
      childForm: {
        attributeStatus: 1,
        attributeName: "",
        explains: ""
      },
      serviceCascader: [],
      productType: "",
      formRule: {
        name: [{ required: true, message: "请输入服务属性名称", trigger: "blur" }],
        attributeTypeStatus: [{ required: true, message: "请选择状态", trigger: "change" }],
        class: [{ required: true, message: "请选择商品分类", trigger: "change" }],
        attributeName: [{ required: true, message: "请输入属性值名称", trigger: "blur" }]
      },
      openFlag: false,
      checkItemAttributeType: 1,
      searchFlag: false
    };
  },
  created() {
    this.queryData();
    this._getallcategory();
  },
  methods: {
    /**
     * 获取所有商品类目和属性，级联选择器分类数据
     */
    _getallcategory() {
      getallcategory()
        .then(res => {
          if (res.code == 0) {
            this.serviceCascader = this.getCategory(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * 递归格式化所有商品类目和属性
     */

    getCategory(arr) {
      return arr.map(res => {
        const t = res.childrenProductCategoryVo;
        const obj = {
          label: res.categoryName,
          value: res.id
        };
        t.length == 0
          ? void 0
          : Object.defineProperty(obj, "children", {
              enumerable: true,
              configurable: false,
              writable: false,
              value: this.getCategory(t)
            });
        return obj;
      });
    },
    toggleRowExpansion(isExpansion) {
      this.list.forEach(item => {
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
      productAttribute(this.listQuery)
        .then(res => {
          // 延迟loading关闭
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            this.list.map(pro => {
              pro.statusFlag = true;
              pro.productAttributeVoList.map(item => {
                //子级
                item.attributeTypeName = item.attributeName;
                item.attributeTypeStatus = item.attributeStatus; //1-启用 2-禁用
                item.explains = item.explains
                item.attributeType = pro.attributeType;
                item.statusFlag = false;
              });
            });
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.listTotal}条结果`,
                type: "success",
                duration: 2000
              });
              this.searchFlag = false;
            }
          } else {
            this.$message({
              type: "error",
              message: res.message
            });
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
      this.checkItemAttributeType = row.attributeType
      this.childForm.attributeName = "";
      this.serviceName = row.attributeTypeName;
      this.childForm.attibuteTypeId = row.id;
      this.childForm.id = "";
      this.childForm.explains = "";
    },
    /** 新增子分类  提交*/
    sumitBtnAddChild() {
      this.$refs["refChildForm"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          addOrupdate(this.childForm)
            .then(res => {
              this.buttonLoading = false;
              if (res.code == 0) {
                this.$message.success("新增成功");
                this.childClassModel = false;
                this.queryData();
              }
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err.message
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
        console.log(row)
        if (row.statusFlag === true) {
          //一级属性弹窗
          this.addDialogVisible = true;
          this.addForm = {
            id: row.id,
            attributeTypeStatus: row.attributeTypeStatus,
            name: row.attributeTypeName,
            attributeType: row.attributeType,
            productCategoryId: row.productCategoryId
          };
        } else {
          this.childClassModel = true;
          this.checkItemAttributeType = row.attributeType
          this.childForm.id = row.id;
          this.childForm.attributeName = row.attributeName;
          this.childForm.explains = row.explains;
          this.serviceName = this.list.find(item => row.attibuteTypeId == item.id).attributeTypeName;

          this.childForm.attibuteTypeId = this.list.find(item => row.attibuteTypeId == item.id).id;
        }
      } else {
        this.addForm.name = "";
        this.addDialogVisible = true;
        this.addForm.attributeType = 1;
        this.addForm.attributeTypeStatus = 1;
        this.addForm.id = "";
        this.addForm.productCategoryId = "";
      }
    },
    /**
     * 新增服务属性 提交添加
     */
    sumitBtnAdd() {
      this.$refs.refservice.validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          addProductAttribute({
            ...this.addForm,
            productCategoryId:this.addForm.productCategoryId.length > 0? this.addForm.productCategoryId[this.addForm.productCategoryId.length - 1]: this.addForm.productCategoryId
            })
            .then(res => {
              this.buttonLoading = false;
              this.$message.success("新增服务成功");
              this.addDialogVisible = false;
              this.queryData();
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err.message
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
      let text = `是否确认${row.attributeTypeStatus === 1 ? "禁用" : "启用"}?`;
      if (row.statusFlag === true && row.attributeTypeStatus === 1) {
        text = "服务属性禁用会导致下级属性值全部禁用，是否确定要禁用！";
      }
      this.$confirm(text, "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        //一级属性启用/禁用
        if (row.statusFlag === true) {
          updateAttrStatus({ id: row.id })
            .then(res => {
              if (res.code == 0) {
                this.$message.success("操作成功");
                this.addDialogVisible = false;
                this.queryData();
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          //子类属性值启用/禁用
          updateStatus({ id: row.id })
            .then(res => {
              if (res.code == 0) {
                this.$message.success("操作成功");
                this.addDialogVisible = false;
                this.queryData();
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    /**
     * 删除
     */
    _delTableData(id, idType) {
      this.$confirm("确定删除？", "删除提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true
      }).then(() => {
        delProductAttr({
          id,
          idType
        }).then((res) => {
          if (res.code == 0) {
            this.$message.success("操作成功");
            this.queryData();
          }
        })
      })
    },
  }
};
</script>
<style scoped lang="less"></style>
