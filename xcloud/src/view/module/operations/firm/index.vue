<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" >
        <el-form ref="searchForm" inline :model="listQuery">
          <el-form-item label="企业名称" prop="name">
            <el-input v-model="listQuery.name" placeholder="企业名称" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select style="width:168px" v-model="listQuery.status" clearable>
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="success" @click="addEditfirm" v-show="hasAuthority('A1_1')">
              <i class="icon icon-adds"></i>
              新增企业
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        border
        :data="list"
        ref="table"
        v-loading="listLoading"
        :height="tableHeight"
        highlight-current-row
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
      >
        <Empty slot="empty" />
        <el-table-column align="center" label="编号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="企业名称" prop="name"></el-table-column>
        <el-table-column align="center" label="纳税人类型" prop="taxpayerType">
          <template slot-scope="scope">
            {{ scope.row.taxpayerType== 'GENERAL' ? '一般纳税人' : scope.row.taxpayerType== 'SMALL' ?  '小规模纳税人' : ''}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="年应税销售额(万元)" prop="taxSaleYear"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">
              <span class="dot-danger"><span class="dot"></span></span>
              禁用
            </span>
            <span v-else>
              <span class="dot-success"><span class="dot"></span></span>
              启用
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" prop="createName"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top">
              <el-link
                type="primary"
                :underline="false"
                @click="showDetailModal(scope.row)"
                class="icon icon-see"
                v-show="hasAuthority('A1_2')"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link
                type="primary"
                :underline="false"
                @click="showEditModal(scope.row)"
                class="icon icon-edit"
                v-show="hasAuthority('A1_3')"
              ></el-link>
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
import { getList } from "@/api/newApi/operations/firm.js";
import cacheQuery from '@/mixins/cacheQuery'
export default {
  mixins: [cacheQuery],
  data() {
    return {
      list: [],
      // 分页
      listTotal: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        name: "",
        status: ""
      },
      listLoading: false,
      isAddEdit: false, //编辑/新增
      searchFlag: false,
      cacheKey:'listQuery',
      copyListQuery: {},
    };
  },
  created() {
    this.copyListQuery = {...this.listQuery}
    this.getPageCache()
    this.queryData();
  },
  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.setPageCache()
      getList({
        pageIndex: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        name: this.listQuery.name,
        status: this.listQuery.status
      })
        .then(res => {
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code == 0) {
            // 设置列表和总条数
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
    /**
     * 搜索全部/清空时间分页为第一页
     */
    search() {
      this.listQuery.pageNo = 1;
      this.searchFlag = true;
      this.queryData();
    },
    // 重置
    resetForm() {
      this.listQuery = {...this.copyListQuery}
      this.removePageCache()

      // this.$refs.searchForm.resetFields();
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.queryData();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.queryData();
    },

    /**
     * 编辑/
     */
    showEditModal(row, index) {
      window.localStorage.setItem("firmEdit", JSON.stringify(row));
      this.$router.push({
        name: "addEdit"
      });
    },
    addEditfirm() {
      window.localStorage.removeItem("firmEdit");
      this.$router.push({
        name: "addEdit"
      });
    },

    /**
     * 详情
     */
    showDetailModal(row) {
      this.$router.push({
        path: "/firm/detail",
        query: { id: row.id }
      });
    }
  }
};
</script>
<style scoped lang="less"></style>
