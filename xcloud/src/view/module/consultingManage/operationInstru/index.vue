<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="80px">
          <el-form-item label="文章标题" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入文章标题"
              clearable
              style="width: 168px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="分类名称" prop="categoryId">
            <el-select
              placeholder="请选择"
              size="small"
              style="width: 168px"
              clearable
              v-model="form.categoryId"
            >
              <el-option
                v-for="(item, index) in categoryList"
                :key="index"
                :label="item.categoryName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="enabled">
            <el-select
              placeholder="请选择"
              size="small"
              style="width: 168px"
              clearable
              v-model="form.enabled"
            >
              <el-option
                v-for="(item, index) in statusList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="search"
            >
              搜索
            </el-button>
            <el-button
              size="small"
              icon="el-icon-refresh"
              @click="reset"
            >
              重置
            </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <el-button
                type="primary"
                size="small"
                class="green-btn"
                @click="add"
                v-show="hasAuthority('H2_12')"
              >
                <i class="icon icon-square-add"></i>
                <span>新增</span>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="文章标题"
          width="180px"
          show-overflow-tooltip
          prop="title"
        ></el-table-column>
        <el-table-column
          align="center"
          label="分类名称"
          show-overflow-tooltip
          prop="categoryName"
        ></el-table-column>
        <el-table-column
          align="center"
          width="180"
          label="创建时间"
          show-overflow-tooltip
          prop="createTime"
        ></el-table-column>
        <el-table-column
          align="center"
          width="150"
          label="发布人"
          show-overflow-tooltip
          prop="createName"
        ></el-table-column>
        <el-table-column
          align="center"
          width="200"
          label="状态"
          show-overflow-tooltip
          prop="enabled"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.enabled === 0">
              <span class="dot-success"></span>
              已发布
            </span>
            <span v-if="scope.row.enabled === 1">
              <span class="dot-info"></span>
              未发布
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="188" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top">
              <el-link
                type="primary"
                :underline="false"
                @click="detail(scope.row.id)"
                v-show="hasAuthority('H2_13')"
              >
                <i class="icon icon-see"></i>
                <!-- 查看 -->
              </el-link>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-link
                type="primary"
                :underline="false"
                @click="edit(scope.row.id)"
                v-show="hasAuthority('H2_14')"
              >
                <i class="icon icon-edit"></i>
                <!-- 编辑 -->
              </el-link>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-link
                type="primary"
                :underline="false"
                @click="del(scope.row.id)"
                v-if="hasAuthority('H2_15') && scope.row.enabled === 1"
              >
                <i class="icon icon-del"></i>
                <!-- 删除 -->
              </el-link>
            </el-tooltip>
            <el-tooltip :content="scope.row.enabled === 0 ?'取消发布':'发布'" placement="top">
              <el-link
                type="primary"
                :underline="false"
                @click="disabled(scope.row)"
                v-show="hasAuthority('H2_16')"
              >
                <i class="icon" :class="scope.row.enabled === 0 ?'icon-square-close':'icon-publish'"></i>
                <!-- {{scope.row.enabled === 0 ? '取消' : ''}}发布 -->
              </el-link>
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
import {getCategoryByModuleType} from '@/api/newApi/consultingCenter/classifiManage'
import {getOperationDocumentList, delOperationDocument, disabledOperationDocument} from '@/api/newApi/consultingCenter/operationInstru'
import cacheQuery from '@/mixins/cacheQuery'
export default {
  data() {
    return {
      tableLoading: false,
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        categoryId: '',
        enabled: '',
        title: ''
      },
      cacheKey: 'form',
      copyListQuery: {},
      createTime: '',
      categoryList: [],
      statusList: [
        {name: '已发布', value: '0'},
        {name: '未发布', value: '1'}
      ],
      searchFlag: false,
    }
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 0:
          return '已发布'
        case 1:
          return '未发布'
      }
    }
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = {...this.form}
    this.getPageCache()
    this._getCategory()
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      this.setPageCache()
      getOperationDocumentList(this.form).then(res => {
        this.list = res.data.records
        this.total = parseInt(res.data.total)
        this.tableLoading = false
        if (this.searchFlag) {
          this.$message({
            message: `搜索完成，为您搜索${this.total}条结果`,
            type: "success",
            duration: 2000,
          })
          this.searchFlag = false
        }
      }).catch(err => {
        this.searchFlag = false
      })
    },
    _getCategory() {
      getCategoryByModuleType(1).then(res => {
        this.categoryList = res.data
      })
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.getList()
    },
    search() {
      this.searchFlag = true
      this.form.page = 1
      this.getList()
    },
    add() {
      this.$router.push({
        path: "/operationInstru/add"
      })
    },
    edit(id) {
      this.$router.push({
        path: "/operationInstru/add",
        query: {
          id
        }
      })
    },
    detail(id) {
      this.$router.push({
        path: "/operationInstru/detail",
        query: {
          id
        }
      })
    },
    del(id) {
      this.$confirm("确定删除？", "删除提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true
      }).then(() => {
        delOperationDocument(id).then((res) => {
          if (res.code === 0) {
            this.getList()
          }
        })
      })
    },
    disabled(row) {
      this.$confirm(`是否确认${row.enabled === 0 ? '取消' : ''}发布?`, "提示", {
        customClass: "custom-confirm",
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        center: true
      }).then(() => {
        this.tableLoading = true
        disabledOperationDocument(row.id, 1-row.enabled)
          .then((res) => {
            if (res.code == 0) {
              this.$message("操作成功")
              this.getList()
            }
            this.tableLoading = false
          })
          .catch((err) => {
            this.tableLoading = false
          })
      })
    },
    submit() {

    },
    reset() {
      // if(this.$refs.searchForm) {
      //   this.$refs.searchForm.resetFields()
      // }
      this.form = {...this.copyListQuery}
      this.removePageCache()
    },
    resetAddFields() {
      if(this.$refs.addDialogForm) {
        this.$refs.addDialogForm.resetFields()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
</style>