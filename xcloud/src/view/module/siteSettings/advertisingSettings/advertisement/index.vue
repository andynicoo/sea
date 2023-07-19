<!-- 广告管理 -->
<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <SiteSettingsModularHader class="setting-hader">
          <template slot="left">
            <ELTabPane
              :tabData="[
                { key: 1, label: 'PC端', name: 'PC' },
                { key: 2, label: 'H5端', name: 'H5' },
                { key: 3, label: '小程序', name: 'applets' },
              ]"
              :value="terminalType"
              @change="(val) => ((terminalType = val), getList())"
            />
          </template>
          <el-button slot="right" type="primary" @click="clickAddAdvertisement">新增广告</el-button>
        </SiteSettingsModularHader>
        广告位置:
        <el-select class="input-list-width-160" @change="changeSelect" v-model="adPositionId" placeholder="请选择">
          <el-option v-for="item in advertisingLocationList" clearable filterable :key="item.key" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column label="广告名称" prop="name"> </el-table-column>
        <el-table-column align="center" label="广告图片" show-overflow-tooltip prop="picPath">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.picPath" fit="contain"></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="150" label="广告位" show-overflow-tooltip prop="adPosition.name"></el-table-column>
        <el-table-column align="center" min-width="150" label="广告链接" show-overflow-tooltip prop="url">
          <template slot-scope="scope">
            <el-link v-if="scope.row.url" :href="scope.row.url" target="_blank">{{ scope.row.url }}</el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="150" label="广告排序" show-overflow-tooltip prop="sort"></el-table-column>
        <el-table-column align="center" min-width="150" label="广告状态" show-overflow-tooltip prop="statusName">
          <template slot-scope="scope">
            <el-tag :type="scope.row.statusName == '已启用' ? 'success' : 'warning'">{{ scope.row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="广告展示时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.endAt">
              {{ scope.row.startAt }}
              <p>至</p>
              {{ scope.row.endAt }}
            </span>
            <span v-else>永久</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="150" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-link type="primary" :underline="false" @click="edit(scope.row)">
                <i class="icon icon-edit"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-link type="primary" :underline="false" @click="delect(scope.row.adId)">
                <i class="icon icon-del"></i>
                <!-- 删除 -->
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <addAdvertisment :title="isAdd ? '新增广告' : '编辑广告'" :show.sync="isShowAddAdvertisment" :moduleList="moduleListData" ref="addAdvertisment" v-if="isShowAddAdvertisment" />
  </div>
</template>
<script>
import SiteSettingsModularHader from '../../components/siteSettingsModularHader.vue';
import { moduleList } from './addAdvertisment/moduleList.js';
import ELTabPane from '@/components/WorkOrderComponents/tabPane';
import { getAddAdvertisingList, advertisingLocationGetList, selectAddAdvertisingItem, delectAdvertising } from '@/api/newApi/siteSettings/index.js';
import { moduleListMap } from '../../libs/setttingLibs.js';
export default {
  data() {
    return {
      terminalType: 'pc',
      adPositionId: -1,
      list: [],
      advertisingLocationList: [],
      tableLoading: false,
      selcectLoation: '',
      listQuery: {
        current: 1,
        size: 20,
      },
      isAdd: false,
      listTotal: 0,
      moduleListData: [],
      isShowAddAdvertisment: false,
      outTimeSign: false,
      isQuery: false,
      editId: undefined,
    };
  },

  watch: {
    adPositionId: function (val) {
      this.getList();
    },
  },

  components: {
    SiteSettingsModularHader,
    addAdvertisment: () => import('./addAdvertisment/fromCreate.vue'),
    ELTabPane,
  },

  created() {
    this.isQuery = true;
    this.getList();
  },

  methods: {
    getList() {
      clearTimeout(this.outTimeSign);
      this.tableLoading = true;
      this.getAddAdvertisingListApi();
      setTimeout(() => this.getAddAdvertisingListApi(), 500);
      this.advertisingLocationGetListApi();
    },

    /**获取广告位下拉列表数据 */
    async advertisingLocationGetListApi() {
      let { data } = await advertisingLocationGetList({ terminalType: this.terminalType, current: 1, size: 999 });
      let optionsList = data.records
        .filter((item) => !!item.status)
        .map((item) => ({
          value: item.adPositionId,
          label: item.name,
          key: item.key,
        }));
      this.advertisingLocationList = JSON.parse(JSON.stringify(optionsList));
      const moduleListData = moduleList();
      moduleListData[1].options = optionsList;
      this.$set(this, 'moduleListData', moduleListData);
      this.advertisingLocationList.unshift({ label: '全部', value: -1, key: -1 });
    },

    /**获取表格数据 */
    async getAddAdvertisingListApi() {
      this.outTimeSign = setTimeout(() => {
        this.tableLoading = false;
      }, 300);
      let parm = {
        ...{ terminalType: this.terminalType, ...this.listQuery },
        adPositionId: this.adPositionId,
      };
      if (this.adPositionId == -1) {
        delete parm.adPositionId;
      }
      let { code, data } = await getAddAdvertisingList(parm);
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

    delect(id) {
      this.$alert('是否确认删除', '提示', {
        confirmButtonText: '确定',
        callback: async (action) => {
          if (action == 'confirm') {
            let { code } = await delectAdvertising({ id });
            if (code == 0) this.$message.success('删除成功');
            this.getList();
          }
        },
      });
    },

    changeSelect(e) {
      console.log(e);
    },

    /**
     * 编辑弹窗
     * @param {*} row
     */
    async edit(row) {
      this.editId = row.adId;
      this.openTheDialog(false);
      let { data } = await selectAddAdvertisingItem({ id: row.adId });
      let moduleListData = moduleListMap(moduleList(), data);
      if (data.endAt && data.endAt.length > 0) {
        let timeControl = moduleListData[3];
        timeControl.value = 1;
        timeControl.control[0].rule[0].value = [data.startAt, data.endAt];
      }
      moduleListData[1].options = this.advertisingLocationList;
      this.$set(this, 'moduleListData', moduleListData);
      this.$refs.addAdvertisment.fileList.push({ url: data.picPath, name: data.picPath });
    },
    /*
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

    clickAddAdvertisement() {
      this.advertisingLocationGetListApi();
      this.openTheDialog();
    },

    /**
     * 打开新增 || 编辑 弹窗
     */
    openTheDialog(isAdd = true) {
      this.isShowAddAdvertisment = true;
      this.isAdd = isAdd;
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
/deep/ .from-create-select {
  width: 100px;
  display: node;
  border: 1px solid red;
}
</style>
