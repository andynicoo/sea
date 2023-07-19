<template>
  <div>
    <!-- 查询 -->
    <!-- 查询条件 -->
    <div
      class="header-container search-box"
      style="margin: 0; padding: 0; height: 50px"
    >
      <el-form ref="searchForm" inline label-width="80px" :height="600">
        <!-- <el-form-item label="服务类型">
                        <el-input
                            v-model="listQuery.service"
                            placeholder="服务类型"
                            clearable
                            style="width: 168px"
                            size="small"
                        />
                    </el-form-item>

                    <el-form-item label="状态">
                        <el-select
                            style="width: 120px"
                            size="small"
                            v-model="listQuery.status"
                        >
                            <el-option value="1" label="启用">启用</el-option>
                            <el-option value="2" label="禁用">禁用</el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" size="small">搜索</el-button>
                    </el-form-item> -->

        <el-form-item style="float: right">
          <el-button
            type="success"
            icon="el-icon-plus"
            @click="showAddModal(null)"
            size="small"
          >
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        border
        :data="tabledata"
        v-loading="tableLoading"
        max-height="700"
        highlight-current-row
      >
        <el-table-column align="center" label="编号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="tabData.name == '服务分类'"
          align="center"
          label="服务类型名称"
          :key="1"
          prop="parentName"
        >
        </el-table-column>
        <el-table-column
          align="center"
          :label="`${tabData.name}名称`"
          prop="name"
        >
        </el-table-column>
        <el-table-column
          v-if="tabData.type == 2"
          align="center"
          :label="`${tabData.name}编码`"
          prop="code"
          :key="6"
        >
        </el-table-column>

        <el-table-column
          v-if="tabData.name == '服务分类'"
          align="center"
          label="OA流程"
          :key="2"
          prop="functionCode"
        >
          <template slot-scope="scope">
            {{ getfunctionCode(scope.row.functionCode) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span class="text-success" v-if="scope.row.state == 1"> 启用 </span>
            <span class="text-danger" v-else> 禁用 </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" prop="createName">
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime">
        </el-table-column>
        <el-table-column align="center" label="修改人" prop="modifyName">
        </el-table-column>
        <el-table-column align="center" label="修改时间" prop="updateTime">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="showAddModal(scope.row)"
              :underline="false"
            >
              编辑
            </el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="changeDisableStatus(scope.row)"
            >
              {{ scope.row.state == 1 ? "禁用" : "启用" }}
            </el-link>
            <el-link
              type="info"
              :underline="false"
              @click="_delTableData(scope.row.id)"
            >
              删除
            </el-link>
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
        :current-page.sync="listQuery.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
      ></el-pagination>
    </div>

    <!-- 新增编辑弹窗 -->
    <div class="dialog-container">
      <el-dialog
        title="新增/编辑"
        :visible.sync="addDialogVisible"
        width="30%"
        center
      >
        <el-form
          :model="addFormList"
          :rules="formRule"
          ref="addDialogForm"
          label-width="120px"
        >
          <el-form-item
            v-if="tabData.name == '服务分类'"
            label="服务类型"
            prop="parentId"
            :key="3"
          >
            <el-select
              style="width: 200px"
              size="small"
              v-model="addFormList.parentId"
              filterable
            >
              <el-option
                v-for="item in serverTypeProps"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="`${tabData.name}名称`" prop="name">
            <el-input
              v-model="addFormList.name"
              :placeholder="`${tabData.name}名称`"
              clearable
              style="width: 200px"
              size="small"
            />
          </el-form-item>

          <el-form-item
            v-if="tabData.type == 2"
            :label="`${tabData.name}编码`"
            prop="code"
          >
            <el-input
              v-model="addFormList.code"
              :placeholder="`${tabData.name}编码`"
              clearable
              style="width: 200px"
              size="small"
            />
          </el-form-item>

          <el-form-item label="状态" prop="state">
            <el-select
              style="width: 200px"
              size="small"
              v-model="addFormList.state"
            >
              <el-option :value="1" label="启用">启用</el-option>
              <el-option :value="2" label="禁用">禁用</el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="是否为叶子节点"
            prop="isLeaf"
            v-if="tabData.name == '服务分类'"
            :key="7"
          >
            <el-radio v-model="addFormList.isLeaf" :label="1">是</el-radio>
            <el-radio v-model="addFormList.isLeaf" :label="2" disabled
              >否</el-radio
            >
          </el-form-item>

          <el-form-item
            v-if="tabData.name == '服务分类'"
            label="OA工单流程"
            prop="parentId"
            :key="4"
          >
            <el-select
              style="width: 200px"
              size="small"
              v-model="addFormList.functionCode"
              filterable
            >
              <el-option
                v-for="item in oalist"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            :loading="buttonLoading"
            @click="_addTableData()"
            >确 定</el-button
          >
          <el-button @click="addDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getCategorylist,
  getproductAttributelist,
  updateCategoryStatus,
  updateproductAttributeStatus,
  removeCategoryStatus,
  removeproductAttributeStatus,
  getCategoryOA,
  addOrUpdatecategory,
  addOrupdateproductAttribute,
} from "@/api/newApi/servicemerchant/serviceMerchant.js";
import staticList from "../staticList";
export default {
  props: {
    tabData: { type: Object },
    serverTypeProps: { type: Array },
  },
  data() {
    return {
      // 分页
      listTotal: 0,
      addDialogVisible: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
      },
      addFormList: {
        id: "",
        name: "",
        state: 1,
        parentId: "",
        isLeaf: "",
        code: "",
        functionCode: "",
      },
      formRule: {
        parentId: [{ required: true, message: "请选择类型", trigger: "blur" }],
        code: [{ required: true, message: "请选择类型", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        state: [{ required: true, message: "请选择状态", trigger: "blur" }],
        functionCode: [
          { required: true, message: "请输入编码", trigger: "blur" },
        ],
      },

      tableLoading: false,
      buttonLoading: false,

      //数据
      tabledata: [],
      //后端要求前段写死
      oalist: staticList.oalistArray,
    };
  },
  watch: {
    tabData(newVal) {
      if (newVal.id) {
        this._getMerchantDataList();
      }
    },
  },
  created() {
    this.addFormList.isLeaf = this.tabData.name == "服务分类" ? 1 : 2; //是否为叶子类目1-是 2-否
    this.addFormList.functionCode = this.tabData.name == "服务分类" ? 2 : ""; //服务分类给一个默认值
    this._getMerchantDataList();
    // if (this.tabData.name == '服务分类') {
    //     this._getSelectList()
    // }
  },
  methods: {
    // _getSelectList () {
    //     getCategoryOA()
    //         .then(res => {
    //             console.log(res)
    //             this.oalist = res.data
    //         }).catch(err => {
    //             console.log(err);
    //         })
    // },
    /**
     * 获取表数据
     */
    _getMerchantDataList() {
      this.tableLoading = true;
      if (this.tabData.type === 1) {
        getCategorylist(this.tabData.id)
          .then((res) => {
            this.tableLoading = false;
            this.tabledata = res.data.map((t) => {
              return {
                id: t.id,
                parentId: !t.parentId ? "" : t.parentId,
                isLeaf: !t.isLeaf ? "" : t.isLeaf,
                name: t.categoryName,
                functionCode: !t.functionCode ? "" : t.functionCode,
                enterpriseId: t.enterpriseId,
                parentName: t.parentName,
                state: t.status,
                createName: t.createName,
                createTime: t.createTime,
                modifyName: t.modifyName,
                updateTime: t.updateTime,
              };
            });
            if (this.tabData.name == "服务类型") {
              this.$emit("update:serverTypeProps", this.tabledata);
            }
            this.listTotal = res.data.length;
          })
          .catch((err) => {
            this.tableLoading = false;
            console.log(err);
          });
      } else if (this.tabData.type === 2) {
        getproductAttributelist(
          this.tabData.id,
          this.listQuery.pageNo,
          this.listQuery.pageSize
        )
          .then((res) => {
            this.tableLoading = false;
            this.tabledata = res.data.records.map((t) => {
              return {
                id: t.id,
                parentId: t.parentId,
                name: t.attributeName,
                code: t.attributeCode,
                attributeCode: t.attributeCode,
                enterpriseId: t.enterpriseId,
                state: t.attributeStatus,
                createName: t.createName,
                createTime: t.createTime,
                modifyName: t.modifyName,
                updateTime: t.updateTime,
              };
            });
            this.listTotal = parseInt(res.data.total);
          })
          .catch((err) => {
            this.tableLoading = false;
            console.log(err);
          });
      }
    },

    /**
     * 新增或修改
     */
    _addTableData() {
      this.$refs["addDialogForm"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;

          if (this.tabData.type === 1) {
            addOrUpdatecategory(this.addFormList)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("操作成功");
                  this.addDialogVisible = false;
                  this._getMerchantDataList();
                }

                this.buttonLoading = false;
              })
              .catch((err) => {
                this.buttonLoading = false;
                console.log(err);
              });
          } else if (this.tabData.type === 2) {
            addOrupdateproductAttribute(this.addFormList)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("操作成功");
                  this.addDialogVisible = false;
                  this._getMerchantDataList();
                }

                this.buttonLoading = false;
              })
              .catch((err) => {
                this.buttonLoading = false;
                console.log(err);
              });
          }
        } else {
          this.$message.error("请检查输入的数据");
          return false;
        }
      });
    },

    /**
     * 删除
     */
    _delTableData(id) {
      this.$confirm("确认操作?", "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.tableLoading = true;

          if (this.tabData.type === 1) {
            removeCategoryStatus(id)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("操作成功");
                  this._getMerchantDataList();
                }
                this.tableLoading = false;
              })
              .catch((err) => {
                console.log(err);
                this.tableLoading = false;
              });
          } else if (this.tabData.type === 2) {
            removeproductAttributeStatus(id)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("操作成功");
                  this._getMerchantDataList();
                }
                this.tableLoading = false;
              })
              .catch((err) => {
                console.log(err);
                this.tableLoading = false;
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getfunctionCode(code) {
      let name = "";
      if (!code) {
        return name;
      }
      this.oalist.some((res) => {
        if (res.id == code) {
          name = res.name;
          return true;
        }
      });
      return name;
    },

    /**
     * 切换禁用启用
     */
    changeDisableStatus(row) {
      this.$confirm("确认操作?", "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.tableLoading = true;
          if (this.tabData.type === 1) {
            updateCategoryStatus(row.id)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("操作成功");
                  this.addDialogVisible = false;
                  this._getMerchantDataList();
                }
                this.tableLoading = false;
              })
              .catch((err) => {
                console.log(err);
                this.tableLoading = false;
              });
          } else if (this.tabData.type === 2) {
            updateproductAttributeStatus(row.id)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("操作成功");
                  this.addDialogVisible = false;
                  this._getMerchantDataList();
                }
                this.tableLoading = false;
              })
              .catch((err) => {
                console.log(err);
                this.tableLoading = false;
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this._getMerchantDataList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this._getMerchantDataList();
    },
    /**
     * 新增
     */
    showAddModal(row) {
      if (this.tabData.type === 1) {
        this.addFormList = {
          id: !row ? "" : row.id,
          name: !row ? "" : row.name,
          parentId: !row ? "" : row.parentId,
          functionCode: !row ? this.addFormList.functionCode : row.functionCode,
          state: !row ? this.addFormList.state : row.state,
          code: !row ? "" : row.code,
          isLeaf: this.addFormList.isLeaf,
        };
      } else if (this.tabData.type === 2) {
        this.addFormList = {
          id: !row ? "" : row.id,
          name: !row ? "" : row.name,
          parentId: this.tabData.id,
          state: !row ? this.addFormList.state : row.state,
          code: !row ? "" : row.code,
        };
      }
      this.addDialogVisible = true;
    },
  },
};
</script>
<style scoped lang="less">
</style>
