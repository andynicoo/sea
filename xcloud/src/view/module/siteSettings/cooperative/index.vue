<!-- 友情链接  -->
<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <SiteSettingsModularHader>
          <template slot="left">友情链接</template>
          <el-button slot="right" type="primary" @click="addCooperativeItem">新增友情链接</el-button>
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
        <el-table-column show-overflow-tooltip align="center" label="标题" prop="name"></el-table-column>
        <el-table-column align="center" label="跳转链接" prop="link">
          <template slot-scope="scope">
            <el-link v-if="scope.row.link" type="primary" :href="scope.row.link">{{ scope.row.link }}</el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="排序" prop="sort"></el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="是否开启" prop="status">
          <template slot-scope="scope">
            <!-- -->
            <el-tag> {{ scope.row.status == true ? '开启' : '关闭' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip align="center" label="操作人" prop="updateBy"></el-table-column>
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
    <AddCooperative
      :title="isAdd ? '新增友情链接' : '编辑友情链接'"
      :show.sync="isShowAddCooperative"
      :moduleList="moduleListData"
      v-if="isShowAddCooperative"
      @confirm="confirm"
    />
  </div>
</template>

<script>
import SiteSettingsModularHader from '../components/siteSettingsModularHader.vue';
import { moduleList } from './addCooperative/moduleList.js';
import { moduleListMap } from '../libs/setttingLibs.js';
import {
  getCooperativeList,
  selectCooperative,
  delectCooperative,
  addCooperative,
  editCooperative,
} from '@/api/newApi/siteSettings/index.js';
export default {
  data() {
    return {
      tableLoading: false,
      isShowAddCooperative: false,
      moduleListData: moduleList(),
      listQuery: {
        current: 1,
        size: 20,
        linkType:"0"
      },
      listTotal: 0,
      isAdd: true,
      list: [],
      outTimeSign: false,
      isQuery: false,
    };
  },

  components: {
    AddCooperative: () => import('../components/siteSettingsFromCreate.vue'),
    SiteSettingsModularHader,
  },

  created() {
    this.isQuery = true;
    this.getList();
  },
  methods: {
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

    getList() {
      clearTimeout(this.outTimeSign);
      this.tableLoading = true;
      this.getCooperativeListAPI();
    },

    /**获取表格数据 */
    async getCooperativeListAPI() {
      this.outTimeSign = setTimeout(() => {
        this.tableLoading = false;
      }, 300);

      let { code, data } = await getCooperativeList({ ...this.listQuery });
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

    /**add */
    addCooperativeItem() {
      this.moduleListData = moduleList();
      this.isShowAddCooperative = true;
    },

    /* delect */
    deleteRow(row) {
      this.$confirm(`确定${row.name}删除后不可恢复`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(async () => {
          let { code } = await delectCooperative({ id: row.yqLinkId });
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

    async edit(row) {
      this.isShowAddCooperative = true;
      this.isAdd = false;
      this.editID = row.yqLinkId;
      let { code, data } = await selectCooperative({ id: row.yqLinkId });
      if (code == 0) this.moduleListData = moduleListMap(moduleList(), data);
    },

    confirm(data) {
      data.submit(
        async (formData, fApi) => {
          let { testField, ...materialData } = formData;
          let { code } = this.isAdd
            ? await addCooperative(materialData)
            : await editCooperative(materialData, this.editID);

          if (code == 0) {
            this.$message.success('操作成功');
            this.isShowAddCooperative = false;
            this.getList();
          }
        },
        () => {
          this.$message.warning('请检查输入的数据');
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.table-image {
  width: 40px;
}
</style>
