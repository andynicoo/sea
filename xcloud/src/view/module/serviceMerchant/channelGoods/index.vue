<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <el-form-item label="名称" prop="nickname" label-width="70px">
            <el-input v-model="form.nickname" placeholder="请输入" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="客户手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="状态" prop="status" label-width="70px">
            <el-select style="width: 168px" v-model="form.status" clearable>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="禁用" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可售商品数量">
            <el-input v-model="form.minCount" placeholder="请输入" clearable style="width: 90px" />
            -
            <el-input v-model="form.maxCount" placeholder="请输入" clearable style="width: 90px" />
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" icon="el-icon-search" @click="search">
              搜索
            </el-button>
            <el-button icon="el-icon-refrnesh" @click="reset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
      ref="table"
      border :data="list"
      v-loading="tableLoading"
      highlight-current-row
      :height="tableHeight"
      element-loading-spinner="icon loading"
      element-loading-text="拼命加载中">
       <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="center" label="名称">
          <template slot-scope="scope">{{ scope.row.nickname }}</template>
        </el-table-column>
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">{{ scope.row.mobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0"><span class="dot-danger"><span class="dot"></span></span>  禁用</span>
            <span v-else-if="scope.row.status == 1">
            <span class="dot-success"><span class="dot"></span></span>  启用
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="可销售商品数">
          <template slot-scope="scope">{{ scope.row.productCount || 0 }}</template>
        </el-table-column>
        <el-table-column align="center" label="累计订单数">
          <template slot-scope="scope">{{ scope.row.orderCount || 0 }}</template>
        </el-table-column>
        <el-table-column align="center" label="累计付款金额">
          <template slot-scope="scope">{{ scope.row.paymentAmount.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column align="center" width="100" label="操作" fixed="right">
          <template slot-scope="scope">
            <!-- <el-tooltip effect="dark" content="查看详情" placement="top">
              <el-link type="primary" :underline="false" @click="detail(scope.row.id)" class="icon icon-see" v-show="hasAuthority('C1_10')"></el-link>
            </el-tooltip> -->
            <el-tooltip effect="dark" content="配置渠道价" placement="top">
              <el-link type="primary" :underline="false" @click="edit(scope.row.userId)" class="icon icon-edit" v-show="hasAuthority('D1_30')"></el-link>
            </el-tooltip>
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
        :current-page.sync="form.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="form.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getList } from "@/api/newApi/channelGoods/channel";
import cacheQuery from '@/mixins/cacheQuery'
export default {
  mixins: [cacheQuery],
  data() {
    return {
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        mobile: "",
        nickname: "",
        status: 1,
        maxCount: "",
        minCount: ""
      },
      tableLoading: false,
      searchFlag: false,
      moreSerch: false,
      cacheKey:'form',
      copyListQuery: {},
    };
  },
  mounted() {
    this.copyListQuery = {...this.form}
    this.getPageCache()
    this.getList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      this.setPageCache()
      getList({...this.form, maxCount: Number(this.form.maxCount) || '', minCount: Number(this.form.minCount) || ''})
        .then(res => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: "success",
              duration: 2000
            });
            this.searchFlag = false;
          }
        })
        .catch(err => {
          this.searchFlag = false;
        });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    search() {
      this.searchFlag = true;
      this.form.page = 1;
      // [this.form.maxCount, this.form.minCount] = [Number(this.form.maxCount), Number(this.form.minCount)]
      if (this.moreSerch) {
        this.moreSerch = false;
      }
      this.getList();
    },
    edit(id) {
      this.$router.push({
        path: "/servicemerchant/channelGoods/detail",
        query: {
          id
        }
      });
    },
    detail(id) {
      this.$router.push({
        path: "/companyInfo/detail",
        query: {
          id
        }
      });
    },
    reset() {
      if (this.$refs.searchForm) {
        this.$refs.searchForm.resetFields();
        this.form = {...this.copyListQuery}
        this.removePageCache()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
</style>
