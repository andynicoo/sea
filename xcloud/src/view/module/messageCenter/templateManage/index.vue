<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <el-form-item label="信件类型" prop="type">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.ids">
              <el-option
                v-for="(item, key, index) in letterTypeList"
                :key="index"
                :label="key"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-form-item>
          <div class="header-btn-group" style="float: right">
            <el-button type="primary" size="small" @click="add()" icon="el-icon-message" v-if="hasAuthority('G2_9')">
              新增模板
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table
        border
        :data="list"
        v-loading="tableLoading"
        :height="tableHeight"
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
      >
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
          label="信件类型"
          show-overflow-tooltip
          prop="letterType"
        ></el-table-column>
        <el-table-column align="center" label="模板内容" show-overflow-tooltip prop="letterContent"></el-table-column>
        <el-table-column
          align="center"
          label="创建人"
          show-overflow-tooltip
          prop="createName"
          width="180"
        ></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          show-overflow-tooltip
          prop="createTime"
          width="200"
        ></el-table-column>
        <el-table-column align="center" width="200" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" v-if="hasAuthority('G2_10')">
              <el-link type="primary" :underline="false" @click="add(scope.row)" class="icon icon-edit"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" v-if="hasAuthority('G2_11')">
              <el-link type="primary" :underline="false" @click="del(scope.row.id)" class="icon icon-del"></el-link>
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
import {
  getLetterTemplatePageApi,
  getLetterTemplateListApi,
  delTemplateListApi
} from "@/api/newApi/messageCenter/letterManage";
import cacheQuery from "@/mixins/cacheQuery";
export default {
  data() {
    return {
      tableLoading: false,
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        delFlag: 0,
        ids: []
      },
      copyListQuery: {},
      letterTypeList: {},
      searchFlag: false,
      moreSerch: false
    };
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.form };
    this.getList();
    this.getLetterType();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      this.setPageCache();
      getLetterTemplatePageApi({ ...this.form, ids: this.form.ids == "" ? [] : this.form.ids })
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
    // 获取信件类型
    getLetterType() {
      getLetterTemplateListApi({ delFlag: "0" })
        .then(res => {
          if (res.code === 0) {
            this.letterTypeList = res.data;
          }
        })
        .catch(err => {});
    },
    // 发送信件
    add(row) {
      this.$router.push({
        name: "addLetterTemplate",
        params: {
          row
        }
      });
    },
    // 删除模板
    del(id) {
      this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delTemplateListApi({ id })
            .then(res => {
              if (res.code === 0) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getList();
              }
            })
            .catch(err => {});
        })
        .catch(() => {});
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
      this.moreSerch = false;
      this.getList();
    },
    reset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
</style>
