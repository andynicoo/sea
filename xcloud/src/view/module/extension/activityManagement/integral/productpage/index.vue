<!--  -->
<template>
  <div>
    <div class="header-container" ref="searchBox">
      <el-form inline ref="searchForm">
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" clearable style="width: 220px" size="small" v-model="listQuery.goodsName" @clear="queryData" />
        </el-form-item>
        <el-form-item label="兑换类型">
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.goodsType">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="实物商品" :value="1"></el-option>
            <el-option label="优惠券" :value="2"></el-option>
            <el-option label="会员卡" :value="3"></el-option>
            <el-option label="虚拟商品" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.status">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="开启" :value="1"></el-option>
            <el-option label="关闭" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search" :loading="listLoading">搜索</el-button>
          <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--表格  -->
    <div class="table-container">
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="商品名称" width="200">
          <template slot-scope="scope">{{ scope.row.goodsName }}</template>
        </el-table-column>
        <el-table-column align="center" label="商品分类" width="200">
          <template slot-scope="scope">{{ scope.row.integralGoodsCategoryVO.categoryName }}</template>
        </el-table-column>
        <el-table-column align="center" label="兑换类型" width="200">
          <template slot-scope="scope">
            {{ goodsType[scope.row.goodsType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="兑换积分" width="200">
          <template slot-scope="scope">{{ scope.row.integralPrice }}</template>
        </el-table-column>
        <el-table-column align="center" label="已兑换/总库存" width="200">
          <template slot-scope="scope"
            >{{ scope.row.goodsStock - scope.row.surplusStock }}/ {{ scope.row.goodsStock }}
            <el-tooltip content="编辑" class="icon" placement="top">
              <el-link type="primary" :underline="false" @click="editStock(scope.row)">
                <i class="icon icon-edit"></i>
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品状态">
          <template slot-scope="scope">
            <el-switch :disabled="scope.row.switching" v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="(status) => statusChange(status, scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序">
          <template slot-scope="scope">
            {{ scope.row.sort }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" v-show="hasAuthority('E2_27')" class="icon" placement="top">
              <el-link type="primary" :underline="false" @click="goProductDetail(scope.row, 1)">
                <i class="icon icon-edit"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="删除" v-show="hasAuthority('E2_28')" class="icon" placement="top">
              <el-link type="primary" :underline="false" @click="deleteCouponAPI(scope.row)">
                <i class="icon icon-del"></i>
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <el-dialog title="编辑库存" :visible.sync="dialogVisible" width="400px" center destroy-on-close>
      <el-form ref="editForms" inline style="margin-bottom: 10px" :rules="formRules" :model="editForm">
        <el-form-item label="增加库存" prop="num">
          <el-input-number v-model="editForm.num" controls-position="right" placeholder="" style="width: 200px" clearable :min="stockMin" :max="999" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getIntegralList, updateIntegralGoods, deleteGoods, addStock } from '@/api/newApi/extension/coupon.js';
export default {
  data() {
    return {
      list: [],
      // 分页
      listTotal: 0,
      initHeight: 65,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        goodsName: '',
        goodsType: null, // 商品类型 1实物商品 2优惠卷
        status: null, // 状态 0禁用 1启用
      },
      searchFlag: false,
      dialogVisible: false,
      editForm: {},
      stockMin: 1,
      goodsType: {
        1: '实物商品',
        2: '优惠券',
        3: '会员卡',
        4: '虚拟商品',
      },
      formRules: {
        num: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
      },
    };
  },

  created() {
    this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
    this.queryData();
  },

  methods: {
    // 更新商品状态
    async statusChange(val, row) {
      console.log(val, row);
      const enterpriseId = localStorage.getItem('enterpriseId');
      let data = {
        enterpriseId: enterpriseId,
        ...row,
      };
      this.$set(row, 'switching', true);
      await updateIntegralGoods(data)
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '状态调整成功',
            });
            // this.queryData();
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch(() => {
          this.$set(row, 'status', row.status === 0 ? 1 : 0);
          this.$set(row, 'switching', false);
        });
      this.$set(row, 'switching', false);
    },

    goProductDetail(row, type) {
      this.$router.push({ path: '/extension/activityManagement/integral/addEdit', query: { type, goodsId: row.goodsId } });
    },

    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
      let param = JSON.parse(JSON.stringify(this.listQuery));
      if (param.couponType == 0) delete param.couponType;
      if (param.status == -1) param.status = null;
      param.surplusStockFlag = false;
      getIntegralList(param)
        .then((res) => {
          this.listLoading = false;
          if (res.code == 0) {
            // 设置列表和总条数
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
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },

    async search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      await this.queryData();
    },

    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        goodsName: '',
        goodsType: null, // 商品类型 1实物商品 2优惠卷
        status: null, // 状态 0禁用 1启用
      };
      this.search();
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

    /**
     * 搜索全部/清空时间分页为第一页
     */
    searchData() {
      this.listQuery.pageNo = 1;
      this.queryData();
    },

    /** 删除 */
    deleteCouponAPI(row) {
      this.$confirm(`确定删除产品:${row.goodsName}?`, '删除产品', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        deleteGoods({ goodsId: row.goodsId }).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '产品删除成功',
            });
            this.queryData();
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        });
      });
    },
    editStock(row) {
      this.dialogVisible = true;
      this.stockMin = 1;
      this.editForm.num = 1;
      this.editForm.id = row.goodsId;
    },
    sure() {
      this.$refs.editForms.validate((valid) => {
        if (valid) {
          let data = this.editForm;
          addStock(data).then((res) => {
            if (res.code == 0) {
              this.dialogVisible = false;
              this.queryData();
            } else {
              this.$message({
                type: 'error',
                message: res.message,
              });
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
