<!-- 广告位管理 -->
<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <SiteSettingsModularHader class="setting-hader">
          <template slot="left">
            <TabPane
              :tabData="[
                { key: 1, label: 'PC端', name: 'PC' },
                { key: 2, label: 'H5端', name: 'H5' },
                { key: 3, label: '小程序', name: 'applets' },
              ]"
              :value="terminalType"
              @change="(val) => ((terminalType = val), getList())"
            />
          </template>
          <el-button slot="right" type="primary" @click="clickAdd">新增广告位</el-button>
        </SiteSettingsModularHader>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
        <el-table-column align="center" width="150" label="终端" show-overflow-tooltip prop="terminalType"></el-table-column>
        <el-table-column align="center" label="广告位标题" show-overflow-tooltip prop="name"></el-table-column>
        <el-table-column align="center" label="广告位key" show-overflow-tooltip prop="adKey"></el-table-column>
        <el-table-column align="center" label="广告位属性" show-overflow-tooltip prop="customs">
          <template slot-scope="{ row }">{{ row.customs == 0 ? '系统默认' : '自定义' }}</template>
        </el-table-column>
        <el-table-column align="center" label="更新时间" show-overflow-tooltip prop="updateTime"></el-table-column>
        <el-table-column align="center" label="广告位状态" show-overflow-tooltip prop="status">
          <template slot-scope="{ row }">{{ row.status == true ? '启用' : '禁用' }}</template>
        </el-table-column>
        <el-table-column align="center" min-width="70" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link type="primary" :underline="false" @click="editItem(scope.row.adPositionId)" class="icon icon-edit"></el-link>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-link type="primary" :underline="false" @click="delectItem(scope.row.adPositionId)" icon="icon icon-del">
                <!-- 删除 -->
              </el-link>
            </el-tooltip>

            <el-tooltip effect="dark" content="启用" placement="top" v-if="scope.row.status == false">
              <el-link type="primary" class="icon icon-use" :underline="false" @click="changeDisableStatus(scope.row)"> </el-link>
            </el-tooltip>

            <el-tooltip effect="dark" content="禁用" placement="top" v-else>
              <el-link type="primary" :underline="false" @click="changeDisableStatus(scope.row)" class="icon icon-disable"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <addAdvertisingSapce :title="isAdd ? '新增广告位' : '编辑广告位'" :isAdd="isAdd" :show.sync="isShowAddAdvertisment" :moduleList="moduleListData" v-if="isShowAddAdvertisment" />
  </div>
</template>
<script>
import SiteSettingsModularHader from '../../components/siteSettingsModularHader.vue';
import { moduleList } from './addAdvertisingSapce/moduleList.js';
import { moduleListMap } from '../../libs/setttingLibs.js';
import { advertisingLocationGetList, advertisingLocationDelect, advertisingLocationOpenOrClose, advertisingLocationGetByID } from '@/api/newApi/siteSettings/index.js';
import TabPane from '@/components/WorkOrderComponents/tabPane';
export default {
  data() {
    return {
      option: {
        location: [],
      },
      selectList: [],
      terminalType: 'pc',
      form: {},
      list: [],
      location: '',
      tableLoading: false,
      selcectLoation: '',
      listTotal: 0,
      listQuery: {
        current: 1,
        size: 20,
      },
      moduleListData: JSON.parse(JSON.stringify([...moduleList])),
      isShowAddAdvertisment: false,
      isQuery: false,
      editId: undefined,
    };
  },

  components: {
    SiteSettingsModularHader,
    addAdvertisingSapce: () => import('./addAdvertisingSapce/fromCreate.vue'),
    TabPane,
  },

  computed: {},

  created() {
    this.isisQuery = true;
    this.getList('pc');
  },
  methods: {
    getList() {
      clearTimeout(this.outTimeSign);
      this.tableLoading = true;
      this.advertisingLocationGetListApi();
    },

    async advertisingLocationGetListApi() {
      this.outTimeSign = setTimeout(() => {
        this.tableLoading = false;
      }, 300);
      let { code, data } = await advertisingLocationGetList({ terminalType: this.terminalType, ...this.listQuery });
      if (code == 0) {
        this.list = data.records;
        this.listTotal = Number(data.total);
        if (this.isisQuery) {
          this.$message({
            message: `搜索完成，为您搜索${this.listTotal}条结果`,
            type: 'success',
            duration: 2000,
          });
          this.isisQuery = false;
        }
      }
    },
    // 多选勾选
    handleSelectionChange(val) {
      this.selectList = val;
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

    /**新增广告 */
    clickAdd() {
      this.moduleListData = JSON.parse(JSON.stringify([...moduleList]));
      this.isAdd = true;
      this.isShowAddAdvertisment = true;
    },

    /*
     */
    async editItem(id) {
      this.editId = id;
      this.isAdd = false;
      this.isShowAddAdvertisment = true;
      let { code, data } = await advertisingLocationGetByID({ id });
      if (code == 0) this.moduleListData = moduleListMap(JSON.parse(JSON.stringify(moduleList)), data);
    },

    /**停用启用 */
    changeDisableStatus(row) {
      let statusText = row.status == 0 ? '禁用' : '启用';
      this.$confirm(`确定${statusText}广告位:${row.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(async () => {
          let { code } = await advertisingLocationOpenOrClose({ id: row.adPositionId });
          if (code == 0) {
            this.$message.success('操作成功');
            this.getList();
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `您已取消${statusText}`,
          });
        });
    },

    delectItem(id) {
      this.$alert('是否确认删除', '提示', {
        confirmButtonText: '确定',
        callback: async (val) => {
          if (val == 'confirm') {
            let { code } = await advertisingLocationDelect({ id });
            if (code == 0) {
              this.$message.success('删除成功');
              this.getList();
            }
          }
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.setting-hader {
  /deep/ .el-tabs__nav-wrap::after {
    background-color: transparent !important;
  }
  /deep/ .el-tabs__item {
    font-size: 16px;
  }
}
</style>
