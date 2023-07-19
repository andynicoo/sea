<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <el-form-item label="服务号" prop="parentServiceNo">
            <el-input v-model="form.parentServiceNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="订单号" prop="orderNo">
            <el-input v-model="form.orderNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh-left" @click="reset"> 重置 </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <div v-show="moreSerch">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="国家" prop="countryCode">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.countryCode">
                <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务名称" prop="parentServiceName">
              <el-input v-model="form.parentServiceName" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="服务进度" prop="nodeCode">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.nodeCode">
                <el-option :value="item.nodeCode" :label="item.nodeName" v-for="item in tabs" :key="item.nodeCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务状态" prop="status">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.status">
                <el-option :value="item.value" :label="item.label" v-for="item in statusList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="建模绘图类型" prop="functionCode">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.functionCode">
                <el-option :value="item.value" :label="item.label" v-for="item in modelTypeList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务生成时间" prop="createTime">
              <el-date-picker
                v-model="form.createTime"
                type="daterange"
                align="right"
                size="small"
                clearable
                unlink-panels
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                range-separator="到"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="[, '23:59:59']"
                style="width: 340px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="处理人" prop="handleUserName">
              <el-input v-model="form.handleUserName" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="绘图类型" prop="drawingType">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.drawingType">
                <el-option :value="item.value" :label="item.label" v-for="item in drawingTypeList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-tabs ref="elTabs" v-model="tabNav" @tab-click="tabClick">
        <el-tab-pane name="-1" label="全部"></el-tab-pane>
        <el-tab-pane :label="item.nodeName" :name="item.nodeCode" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
      </el-tabs>
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column label="专利" min-width="300">
          <template slot-scope="scope">
            <p>订单号：{{ scope.row.orderNo }}</p>
            <p>服务编号：{{ scope.row.parentServiceNo }}</p>
            <p>服务名称：{{ scope.row.parentServiceName }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" width="150" label="国家" show-overflow-tooltip prop="countryNameZh"></el-table-column>
        <el-table-column align="center" width="150" label="服务进度" show-overflow-tooltip prop="cureentNodeCode">
          <template slot-scope="{ row }">{{ row.cureentNodeCode | filterNodeCode }}</template>
        </el-table-column>
        <el-table-column align="center" min-width="150" label="服务状态" show-overflow-tooltip prop="status">
          <template slot-scope="scope">{{ scope.row.status | filterStatus(statusList) }}</template>
        </el-table-column>
        <el-table-column align="center" min-width="150" label="建模绘图类型" show-overflow-tooltip prop="productFunctionCode">
          <template slot-scope="{ row }">{{ row.productFunctionCode | filterProductFunctionCode(modelTypeList) }}</template>
        </el-table-column>
        <el-table-column align="center" min-width="150" label="处理人" show-overflow-tooltip prop="handlerUserName">
          <template slot-scope="{ row }">
            <div v-for="(user, i) in row.handlerUserName" :key="i">{{ user }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="200px" label="服务生成时间" sortable show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column align="center" min-width="150" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top">
              <el-link type="primary" :underline="false" @click="detail(scope.row)" v-show="hasAuthority('M2_9')">
                <i class="icon icon-see"></i>
              </el-link>
            </el-tooltip>
            <!-- <el-tooltip content="上传3D文件" placement="top">
              <span>
                <el-link
                  type="primary"
                  :underline="false"
                  @click="uploadFileDialog = true"
                  v-if="[progressBarObj.MODELING, progressBarObj.DRAWING].includes(scope.row.nodeCode)"
                >
                  <i class="icon icon-publish"></i>
                </el-link>
              </span>
            </el-tooltip>
            <el-tooltip content="审核" placement="top">
              <span>
                <el-link
                  type="primary"
                  :underline="false"
                  @click="auditDialog = true"
                  v-if="[progressBarObj.AUDIT_MODEL, progressBarObj.AUDIT_DRAW].includes(scope.row.nodeCode)"
                >
                  <i class="icon icon-audit"></i>
                </el-link>
              </span>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <!-- <UploadFileDialog :uploadFileDialog.sync="uploadFileDialog" />
    <AuditDialog :auditDialog.sync="auditDialog" /> -->
  </div>
</template>

<script>
import { progressBarList, progressBarObj } from './enumObj';
import { modelList } from '@/api/newApi/intellectualProperty/modelingAndDrawing';
import { serviceNode } from '@/api/newApi/taxServices/serviceManage.js';
import { getCountrySelectList } from '@/api/newApi/common';
import * as comps from './components/index';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  data() {
    return {
      list: [],
      tabNav: '-1',
      tabs: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        parentServiceNo: '',
        orderNo: '',
        mobile: '',
        countryCode: '',
        parentServiceName: '',
        handleUserName: '',
        nodeCode: '',
        status: '',
        functionCode: '',
        drawingType: '',
        createTime: [],
      },
      cacheKey: 'form',
      copyListQuery: {},
      countrySelectList: [],
      tableLoading: false,
      searchFlag: false,
      statusList: [
        { label: '服务中', value: 1 },
        { label: '取消中', value: 11 },
        { label: '已取消', value: 9 },
      ],
      modelTypeList: [
        { label: '建模绘图', value: 103 },
        { label: '仅建模', value: 101 },
        { label: '仅绘图', value: 102 },
      ],
      progressBarObj: progressBarObj,
      moreSerch: false,
      auditDialog: false,
      uploadFileDialog: false,
      drawingTypeList: [
        { label: '线图', value: 1 },
        { label: '渲染', value: 2 },
        { label: '拍照', value: 3 },
        { label: '未知', value: 0 },
      ],
    };
  },
  mixins: [cacheQuery],
  filters: {
    filterStatus(status, statusList) {
      let result = statusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
    filterNodeCode(nodeCode) {
      let result = progressBarList.find((item) => item.value === nodeCode);
      return result ? result.label : '';
    },
    filterProductFunctionCode(functionCode, modelTypeList) {
      let result = modelTypeList.find((item) => item.value === functionCode);
      return result ? result.label : '';
    },
  },
  components: {
    ...comps,
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    this.getServiceNode();
    this._getCountrySelectList();
  },
  methods: {
    formatTime() {
      [this.form.createStartTime, this.form.createEndTime] = this.form.createTime && this.form.createTime.length ? this.form.createTime : ['', ''];
    },
    getList() {
      this.tableLoading = true;
      this.formatTime();
      this.setPageCache();
      let { createTime, ...formData } = this.form;
      modelList(this.$util.objTrim(formData))
        .then((res) => {
          res.data.pageData.records.forEach((item) => {
            item.handlerUserName = item.handlerUserName.split(',').filter((i) => i);
          });
          this.list = res.data.pageData.records;
          this.total = parseInt(res.data.pageData.total);
          this.tabNav = this.form.nodeCode === '' ? '-1' : this.form.nodeCode;
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
    getServiceNode() {
      serviceNode({ functionCode: this.$constant.MODEL_DRAW_FUNCTION_CODE })
        .then((res) => {
          if (res.code == 0) {
            this.tabs = res.data;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    tabClick() {
      this.form.nodeCode = this.tabNav === '-1' ? '' : this.tabNav;
      this.form.page = 1;
      this.getList();
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
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
      this.getList();
    },
    detail(row) {
      this.$router.push({
        path: '/modelingAndDrawing/detail',
        query: {
          serviceId: row.id,
        },
      });
    },
    reset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}
</style>
