<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div>
        <!-- 查询条件 -->
        <div class="search-box">
          <el-form ref="searchForm" inline>
            <el-form-item label="发票类型" prop="type">
              <el-select style="width: 120px" size="small" v-model="listQuery.type" clearable>
                <el-option value="GENERAL" label="普通发票">普通发票</el-option>
                <el-option value="SPECIAL" label="增值税专用发票">增值税专用发票</el-option>
                <el-option value="NONE" label="不开票">不开票</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select style="width: 120px" size="small" v-model="listQuery.status" clearable>
                <el-option :value="0" label="启用">启用</el-option>
                <el-option :value="1" label="禁用">禁用</el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="_getTaxTableList" icon="el-icon-search">搜索</el-button>
              <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
            </el-form-item>

            <el-form-item style="float: right">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="small"
                v-show="hasAuthority('B1_4')"
                @click="showEditModal(null, false)"
              >
                新增开票
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table border ref="table" :data="data"  :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" label="编号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发票类型">
          <template slot-scope="scope">{{ getTaxType(scope.row.type) }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span class="text-success" v-if="scope.row.status == 0">
              <i class="icon icon-stuts-enable" style="margin: 0px; width: 10px"></i>
              启用
            </span>
            <span class="text-danger" v-else>
              <i class="icon icon-stuts-disable" style="margin: 0px; width: 10px"></i>
              禁用
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="税率">
          <template slot-scope="scope">{{ (scope.row.taxRate * 1000) / 10 }}%</template>
        </el-table-column>
        <el-table-column align="center" label="创建人" prop="createName"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" width="150"></el-table-column>
        <el-table-column align="center" label="修改人" prop="modifyName"></el-table-column>
        <el-table-column align="center" label="修改时间" prop="updateTime" width="150"></el-table-column>
        <el-table-column align="center" label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" class="icon" placement="top" v-show="hasAuthority('B1_5')">
              <el-link type="primary" :underline="false" @click="showEditModal(scope.row, true)">
                <img src="@/assets/images/zt-upgrade-1/edit.svg" />
              </el-link>
            </el-tooltip>
            <el-link
              type="primary"
              :underline="false"
              class="icon"
              @click="_changeDisableStatus(scope.row)"
              v-show="hasAuthority('B1_6')"
            >
              <el-tooltip content="启用状态" placement="top" v-show="scope.row.status == 1">
                <img src="@/assets/images/zt-upgrade-1/enable.svg" />
              </el-tooltip>
              <el-tooltip content="禁用状态" placement="top" v-show="scope.row.status == 0">
                <img src="@/assets/images/zt-upgrade-1/prohibit.svg" />
              </el-tooltip>
            </el-link>
            <!-- <el-link type="success" icon="el-icon-plus" :underline="false" @click="_changeDisableStatus(scope.row)">
              {{ scope.row.status == 0 ? "禁用" : "启用" }}
            </el-link> -->
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :title="edOradDigType ? '编辑开票' : '新增开票'"
        :visible.sync="dialogVisibleAddOrEdit"
        width="21%"
        :before-close="handleClose"
      >
        <div class="elorAdMain">
          <el-form label-position="right" label-width="100px" :model="addListForm" :rules="formRule" ref="addtaxform">
            <el-form-item label="企业名称">
              <span>{{ enterpriseName }}</span>
            </el-form-item>

            <el-form-item label="发票类型" prop="type">
              <el-select style="width: 200px" size="small" v-model="addListForm.type" clearable>
                <el-option value="GENERAL" label="普通发票">普通发票</el-option>
                <el-option value="SPECIAL" label="增值税专用发票">增值税专用发票</el-option>
                <el-option value="NONE" label="不开票">不开票</el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="税率" required prop="taxRate">
              <el-input-number
                style="width: 200px"
                v-model="addListForm.taxRate"
                :step="0.1"
                :min="0"
                :max="100"
                size="small"
              ></el-input-number>
              <!-- <span class="tipText">填写示例:6%</span> -->
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select style="width: 200px" size="small" v-model="addListForm.status">
                <el-option :value="0" label="启用">启用</el-option>
                <el-option :value="1" label="禁用">禁用</el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item>
              <el-button type="primary" size="small" @click="_addOrUpdateTax">保存</el-button>
              <el-button type="cancel" size="small" @click="back()">取消</el-button>
            </el-form-item> -->
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleAddOrEdit = false">取 消</el-button>
          <el-button type="primary" size="small" @click="_addOrUpdateTax">保存</el-button>
        </span>
      </el-dialog>
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
  </div>
</template>
<script>
import { getTaxTableList, changeTaxState } from "@/api/newApi/basementPaper/basementPaper.js";
import { addOrUpdateTax } from "@/api/newApi/basementPaper/basementPaper.js";
export default {
  data() {
    return {
      // 分页
      listTotal: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        status: "",
        type: "",
      },
      addListForm: {
        id: "",
        enterpriseId: "",
        status: 0,
        taxRate: "",
        type: 'NONE',
        enterpriseName: "",
      },
      service: "",
      formRule: {
        taxRate: [{ required: true, message: "请输入税率", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
      },
      edOradDigType: false,
      tableLoading: false,
      loading: false,
      //数据
      data: [],
      dialogVisibleAddOrEdit: false,
    };
  },
  created() {
    this._getTaxTableList();
    this.enterpriseName = this.$util.getLocalStorage("enterpriseName");
  },
  methods: {
    /**
     * 获取税率表
     */
    _getTaxTableList() {
      this.tableLoading = true;
      getTaxTableList(this.listQuery)
        .then((res) => {
          this.data = res.data.records;
          this.listTotal = parseInt(res.data.total);
          this.tableLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.tableLoading = false;
        });
    },
    handleClose(done) {
      done();
    },
    handleReset() {
      this.listQuery = {
        pageNo: 1,
        pageSize: 10,
        status: "",
        type: "",
      };
      this._getTaxTableList();
    },
    /**
     * 获取发票类型
     */
    getTaxType(type) {
      switch (type) {
        case 'GENERAL':
          return "普通发票";
        case 'SPECIAL':
          return "增值税专用发票";
        case 'NONE':
          return "不开票";
        default:
          break;
      }
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this._getTaxTableList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this._getTaxTableList();
    },

    /**
     * 编辑弹框
     */
    showEditModal(row, type) {
      this.dialogVisibleAddOrEdit = true;
      this.edOradDigType = type;
      if (type) {
        this.addListForm = {
          id: row.id,
          enterpriseId: row.enterpriseId,
          status: row.status,
          taxRate: (row.taxRate * 1000) / 10,
          type: row.type,
        };
      } else {
        this.addFormList = {
          id: "",
          enterpriseId: "",
          status: "",
          taxRate: "",
          type: "",
        };
      }
    },
    _addOrUpdateTax() {
      this.$refs["addtaxform"].validate((valid) => {
        if (valid) {
          this.loading = true;
          addOrUpdateTax(this.addListForm)
            .then((res) => {
              if (res.code == 0) {
                this.$message.success("操作成功");
                this._getTaxTableList();
                this.dialogVisibleAddOrEdit = false;
              }
              this.loading = false;
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
            });
        } else {
          this.$message.warning("请检查输入的数据");
          return false;
        }
      });
    },
    /**
     * 切换禁用启用
     */
    _changeDisableStatus(row) {
      let tips = `确认${row.status ? "启用" : "禁用"}么？`;
      this.$confirm(tips, "提示", {
        dangerouslyUseHTMLString: true,
        customClass: "custom-confirm",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          this.tableLoading = true;
          changeTaxState(row.id)
            .then((res) => {
              if (res.code == 0) {
                this.$message("操作成功");
                this._getTaxTableList();
              }
              this.tableLoading = false;
            })
            .catch((err) => {
              console.log(err);
              this.tableLoading = false;
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
</style>
