<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" inline>
          <el-form-item label="支付平台" prop="type">
            <el-select style="width: 200px" size="small" v-model="listQuery.channelKey" clearable>
              <el-option :value="item.key" :label="item.name" v-for="item in payCompanyArry" :key="item.key">{{ item.name }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select style="width: 200px" size="small" v-model="listQuery.status" clearable>
              <el-option value="" label="全部">全部</el-option>
              <el-option :value="true" label="启用">启用</el-option>
              <el-option :value="false" label="禁用">禁用</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="_getTaxTableList" icon="el-icon-search">搜索</el-button>
            <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
          </el-form-item>

          <el-form-item style="float: right">
            <el-button type="success" icon="el-icon-plus" size="small" v-show="hasAuthority('paymentpla_add')" @click="showEditModal(null, false)"> 新增 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table border ref="table" :data="data" :height="tableHeight" v-loading="tableLoading">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付平台">
          <template slot-scope="scope">{{ getNameByKey(scope.row.channelKey) }}</template>
        </el-table-column>
        <el-table-column align="center" label="收单费用" prop="createName">
          <template slot-scope="scope">{{ scope.row.acquiringBacktrackCost }} / {{ scope.row.acquiringCardCost }}</template>
        </el-table-column>
        <el-table-column align="center" label="退款费用" prop="refundCardCost">
          <template slot-scope="scope">{{ scope.row.refundBacktrackCost }} / {{ scope.row.refundCardCost }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建人" prop="createdBy"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createdTime" width="150"></el-table-column>
        <el-table-column align="center" label="修改人" prop="updatedBy"></el-table-column>
        <el-table-column align="center" label="修改时间" prop="updatedTime" width="150"></el-table-column>
        <el-table-column align="center" label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" class="icon" placement="top" v-show="hasAuthority('paymentpla_edit')">
              <el-link type="primary" :underline="false" @click="showEditModal(scope.row, true)">
                <img src="@/assets/images/zt-upgrade-1/edit.svg" />
              </el-link>
            </el-tooltip>
            <el-link type="primary" :underline="false" class="icon" @click="_changeDisableStatus(scope.row)">
              <el-tooltip content="禁用状态" placement="top" v-show="hasAuthority('paymentpla_unenable')" v-if="scope.row.status">
                <img src="@/assets/images/zt-upgrade-1/prohibit.svg" />
              </el-tooltip>
              <el-tooltip content="启用状态" placement="top" v-show="hasAuthority('paymentpla_enable')" v-else>
                <img src="@/assets/images/zt-upgrade-1/enable.svg" />
              </el-tooltip>
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="edOradDigType ? '编辑支付平台' : '新增支付平台'" :close-on-click-modal="false" :visible.sync="dialogVisibleAddOrEdit" width="21%" :before-close="handleClose">
        <div class="elorAdMain">
          <el-form label-position="right" label-width="100px" :model="addListForm" :rules="formRule" ref="addtaxform">
            <el-form-item label="支付平台" prop="channelKey">
              <el-select style="width: 200px" size="small" v-model="addListForm.channelKey" :disabled="edOradDigType">
                <el-option :value="item.key" :label="item.name" v-for="item in payCompanyArry" :key="item.key">{{ item.name }}</el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="收单费用">
              <div>
                <el-input-number style="width: 150px" v-model="addListForm.acquiringBacktrackCost" :precision="2" :min="0" size="small" controls-position="right"></el-input-number>
                原路退回
              </div>
              <div>
                <el-input-number style="width: 150px" v-model="addListForm.acquiringCardCost" :precision="2" :min="0" size="small" controls-position="right"></el-input-number>
                退回卡
              </div>
            </el-form-item>

            <el-form-item label="退款费用">
              <div>
                <el-input-number style="width: 150px" v-model="addListForm.refundBacktrackCost" :precision="2" :min="0" size="small" controls-position="right"></el-input-number>
                原路退回
              </div>
              <div>
                <el-input-number style="width: 150px" v-model="addListForm.refundCardCost" :precision="2" :min="0" size="small" controls-position="right"></el-input-number>
                退回卡
              </div>
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-radio v-model="addListForm.status" :label="true">启用</el-radio>
              <el-radio v-model="addListForm.status" :label="false">禁用</el-radio>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleAddOrEdit = false">取 消</el-button>
          <el-button type="primary" size="small" @click="_addOrUpdateTax" :loading="loading">保存</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
  </div>
</template>
<script>
import { getPayCompany, getPaymentList, updatePaymentChannel, addPaymentChannel } from '@/api/payCenter';
export default {
  data() {
    return {
      // 分页
      listTotal: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        status: '',
        channelKey: '',
      },
      addListForm: {
        // id: '',
        channelKey: '',
        acquiringBacktrackCost: 0,
        acquiringCardCost: 0,
        refundBacktrackCost: 0,
        refundCardCost: 0,
        status: true,
      },
      formRule: {
        channelKey: [{ required: true, message: '请选择支付平台', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
      },
      edOradDigType: false,
      tableLoading: false,
      //数据
      data: [],
      dialogVisibleAddOrEdit: false,
      payCompanyArry: [], // 支付平台
      loading: false, // 提交按钮
    };
  },
  async created() {
    await this.getCompanyList();
    this._getTaxTableList();
  },
  methods: {
    /**
     * 获取税率表
     */
    _getTaxTableList() {
      this.tableLoading = true;
      getPaymentList(this.listQuery)
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
        status: '',
        type: '',
      };
      this._getTaxTableList();
    },
    // 获取支付平台
    getCompanyList() {
      getPayCompany({ current: 1, size: 999 })
        .then(
          (res) => {
            this.payCompanyArry = res.data;
          },
          (err) => {}
        )
        .finally(() => {});
    },
    getNameByKey(key) {
      return this.payCompanyArry.find((item) => item.key === key)?.name || '';
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
          channelKey: row.channelKey,
          acquiringBacktrackCost: row.acquiringBacktrackCost,
          acquiringCardCost: row.acquiringCardCost,
          refundBacktrackCost: row.refundBacktrackCost,
          refundCardCost: row.refundCardCost,
          status: row.status,
        };
      } else {
        this.addListForm = {
          channelKey: '',
          acquiringBacktrackCost: 0,
          acquiringCardCost: 0,
          refundBacktrackCost: 0,
          refundCardCost: 0,
          status: true,
        };
      }
    },
    _addOrUpdateTax() {
      this.$refs['addtaxform'].validate((valid) => {
        if (valid) {
          this.loading = true;
          // 编辑
          if (this.edOradDigType) {
            updatePaymentChannel(this.addListForm)
              .then((res) => {
                if (res.code == 0) {
                  this.$message('操作成功');
                  this._getTaxTableList();
                  this.dialogVisibleAddOrEdit = false;
                  this.loading = false;
                }
              })
              .catch((err) => {
                console.log(err);
                this.loading = false;
              });
          } else {
            // 新增
            addPaymentChannel(this.addListForm)
              .then((res) => {
                if (res.code === 0) {
                  this.$message.success('操作成功');
                  this._getTaxTableList();
                  this.dialogVisibleAddOrEdit = false;
                  this.loading = false;
                }
              })
              .catch((err) => {
                console.log(err);
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 切换禁用启用
     */
    _changeDisableStatus(row) {
      let tips = `确认${row.status ? '禁用' : '启用'}么？`;
      this.$confirm(tips, '提示', {
        dangerouslyUseHTMLString: true,
        customClass: 'custom-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
          let params = row;
          params.status = !params.status;
          updatePaymentChannel(params)
            .then((res) => {
              if (res.code == 0) {
                this.$message('操作成功');
                this._getTaxTableList();
              }
            })
            .catch((err) => {
              console.log(err);
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
@import '@/styles/fixedSearch.scss';
</style>
