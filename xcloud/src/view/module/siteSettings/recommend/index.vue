<!-- 首页推荐  -->
<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <SiteSettingsModularHader>
          <template slot="left">首页推荐</template>
          <el-button slot="right" type="primary" @click="addService">新增服务</el-button>
        </SiteSettingsModularHader>
      </div>
    </div>
    <!-- table -->
    <div class="table-container">
      <el-table
        ref="table"
        border
        :data="list"
        :height="tableHeight"
        v-loading="tableLoading"
        highlight-current-row
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
      >
        <Empty slot="empty" />
        <el-table-column show-overflow-tooltip align="center" label="标题" prop="categoryTitle"></el-table-column>
        <el-table-column align="center" label="背景图" prop="backgroundImg">
          <template slot-scope="scope">
            <el-image
              width="100px"
              heigth="100px"
              class="table-image"
              v-if="scope.row.backgroundImg"
              :src="scope.row.backgroundImg"
              fit="cover"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="是否启用" prop="status">
          <template slot-scope="scope">
            {{ scope.row.status == true ? '启用' : '禁用' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="排序" prop="sort"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="操作人" prop="operateName"></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="250px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" class="" content="编辑" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-edit" @click="edit(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" class="" content="删除" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-del" @click="deleteRow(scope.row)"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- pagination -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.current"
        :page-sizes="$constant.WORKER_SERVER_PAGELIST"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
      ></el-pagination>
    </div>
    <ServiceComponent :title="isAdd ? '新增服务' : '编辑服务'" v-if="isShowAddService" :show.sync="isShowAddService" />
  </div>
</template>

<script>
import SiteSettingsModularHader from '../components/siteSettingsModularHader.vue';
import { getIndexRemcommendList, delectIndexRemcommend } from '@/api/newApi/siteSettings/index.js';
export default {
  provide() {
    return {
      highest: this,
    };
  },
  name: 'Recommend',
  data() {
    return {
      isShowAddService: false,
      listQuery: {
        current: 1,
        size: 20,
      },
      listTotal: 0,
      list: [],
      tableLoading: false,
      isAdd: true,
      outTimeSign: false,
      isQuery: false,
      editId: undefined,
    };
  },

  components: {
    ServiceComponent: () => import('./addServices/addService.vue'),
    SiteSettingsModularHader,
  },

  created() {
    this.isQuery = true;
    this.getList();
  },
  methods: {
    getList() {
      clearTimeout(this.outTimeSign);
      this.tableLoading = true;
      this.getIndexRemcommendListAPI();
    },

    /**获取表格数据 */
    async getIndexRemcommendListAPI() {
      this.outTimeSign = setTimeout(() => {
        this.tableLoading = false;
      }, 300);

      let { code, data } = await getIndexRemcommendList({ ...this.listQuery });
      if (code == 0) {
        this.list = data.records;
        this.listTotal = Number(data.total);
        if (this.isQuery) {
          this.$message({
            message: `搜索完成，为您搜索${this.listTotal}条结果`,
            type: 'success',
            duration: 2000,
          });
          this.isQuery = false;
        }
      }
    },

    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
    },

    handleCurrentChange(val) {
      this.listQuery.current = val;
      this.getList();
    },

    /**add */
    addService() {
      this.isShowAddService = true;
      this.isAdd = true;
    },

    /* delect */
    deleteRow(row) {
      this.$confirm(`确定${row.categoryTitle}删除后不可恢复`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(async () => {
          let { code } = await delectIndexRemcommend( row.id );
          if (code == 0) {
            this.$message.success('操作成功');
            this.getList();
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `您已取消删除`,
          });
        });
    },

    edit(row) {
      this.isShowAddService = true;
      this.isAdd = false;
      this.editId = row.id;
    },
  },
};
</script>
<style lang="less" scoped>
.table-image {
  width: 40px;
}
</style>
