<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="120px">
          <el-form-item label="客户手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button icon="el-icon-refrnesh" @click="reset"> 重置 </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="success" @click="edit()" v-show="hasAuthority('C1_9')">
              <i class="icon icon-adds"></i>
              新增
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" border :data="list" v-loading="tableLoading" highlight-current-row :height="tableHeight" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70" fixed="left">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="客户手机号" show-overflow-tooltip prop="userMobile">
          <template slot-scope="{ row }">
            <span v-hidden>{{ row.userMobile }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="250" label="公司中文名称" show-overflow-tooltip prop="companyNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="联系人" show-overflow-tooltip prop="contactPerson"></el-table-column>
        <el-table-column align="center" width="150" label="联系方式" show-overflow-tooltip prop="companyTel"></el-table-column>
        <el-table-column align="center" width="250" label="公司中文地址" show-overflow-tooltip prop="companyAddressZh"></el-table-column>
        <el-table-column align="center" width="150" label="法人" show-overflow-tooltip prop="companyLegalPersonZh"></el-table-column>
        <el-table-column align="center" width="150" label="公司成立日期" show-overflow-tooltip prop="companyRegisterData">
          <template slot-scope="{ row }">{{ row.companyRegisterData.split(' ')[0] }}</template>
        </el-table-column>
        <el-table-column align="center" width="150" label="创建时间" show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column align="center" width="150" label="修改时间" show-overflow-tooltip prop="updateTime"></el-table-column>
        <el-table-column align="center" width="100" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top">
              <el-link type="primary" :underline="false" @click="detail(scope.row.id)" class="icon icon-see" v-show="hasAuthority('C1_10')"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link type="primary" :underline="false" @click="edit(scope.row.id)" class="icon icon-edit" v-show="hasAuthority('C1_11')"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getUserCompanyMaterialList } from '@/api/newApi/customer/companyInfo';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  mixins: [cacheQuery],
  data() {
    return {
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        mobile: '',
        companyName: '',
      },
      tableLoading: false,
      searchFlag: false,
      moreSerch: false,
      cacheKey: 'form',
      copyListQuery: {},
    };
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      this.setPageCache();
      getUserCompanyMaterialList(this.form)
        .then((res) => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: 'success',
              duration: 2000,
            });
            this.searchFlag = false;
          }
        })
        .catch((err) => {
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
      if (this.moreSerch) {
        this.moreSerch = false;
      }
      this.getList();
    },
    edit(id) {
      this.$router.push({
        path: '/companyInfo/addOrEdit',
        query: {
          id,
        },
      });
    },
    detail(id) {
      this.$router.push({
        path: '/companyInfo/detail',
        query: {
          id,
        },
      });
    },
    reset() {
      this.form = {
        page: 1,
        limit: 20,
        mobile: '',
        companyName: '',
      };
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
</style>
