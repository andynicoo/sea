<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="70px">
          <el-form-item label="" prop="status">
            <el-select style="width: 200px" v-model="form.status" placeholder="请选择" filterable>
              <el-option :value="item.value" :label="item.label" v-for="item in statusList" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="time">
            <el-date-picker v-model="form.time" type="date" align="right" :clearable="false" value-format="yyyy-MM-dd" style="width: 200px"> </el-date-picker>
          </el-form-item>

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-form-item>
          <div class="header-btn-group" style="float: right">
            <el-button type="primary" @click="exportRecord">导出</el-button>
            <el-button type="primary" @click="delRecord" :disabled="!ids.length">删除</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table border :height="tableHeight" :data="list" v-loading="tableLoading" @selection-change="handleSelectionChange" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column type="selection" align="center" fixed="left" width="55"></el-table-column>
        <el-table-column align="center" width="200" label="服务号/税号/公司名" show-overflow-tooltip prop="countryNameZh">
          <template slot-scope="{ row }">
            {{ row | filterTitle }}
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="150" label="上传内容" show-overflow-tooltip prop="description"> </el-table-column>
        <el-table-column align="center" min-width="150" label="上传时间" show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column align="center" min-width="100" label="上传状态" show-overflow-tooltip prop="status">
          <template slot-scope="{ row }">
            <i :class="'el-icon-' + getIcon(row.status)"></i>
            {{ row.status | filterStatus(statusList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="失败原因" show-overflow-tooltip prop="failedReason"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50, 100]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getUploadAndDownloadRecordsList } from '@/api/newApi/workOrder/uploadAndDownloadRecords';
export default {
  props: {
    productFunctionCode: String,
  },
  data() {
    return {
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 10,
        type: 1, // 1:上传
        status: 3,
        time: '',
      },
      copyListQuery: {},
      statusList: [
        { label: '上传失败', value: 3, icon: 'error' },
        { label: '上传成功', value: 2, icon: 'success' },
      ],
      tableLoading: false,
      searchFlag: false,
      ids: [],
      initHeight: 140,
    };
  },
  filters: {
    filterTitle({ companyNameZh, serviceNo, vatTaxNumber }) {
      if (companyNameZh) {
        return companyNameZh;
      } else if (serviceNo) {
        return serviceNo;
      } else {
        return vatTaxNumber;
      }
    },
    filterStatus(status, statusList) {
      let temp = statusList.find((item) => item.value === status);
      return temp ? temp.label : status;
    },
  },
  mounted() {
    this.form.time = this.$util.getDefaultDate();
    this.copyListQuery = { ...this.form };
    this.getList();
  },
  methods: {
    getIcon(status) {
      let temp = this.statusList.find((item) => item.value === status);
      return temp ? temp.icon : '';
    },
    getList() {
      this.tableLoading = true;
      let { time, ...formData } = this.form;
      getUploadAndDownloadRecordsList({
        ...formData,
        createTimeStart: this.form.time + ' 00:00:00',
        createTimeEnd: this.form.time + ' 23:59:59',
        // productFunctionCode: this.productFunctionCode,
      })
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
          this.tableLoading = false;
          this.searchFlag = false;
        });
    },
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
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
    reset() {
      this.form = { ...this.copyListQuery };
    },
    exportRecord() {
      this.$emit('_export', {
        ref: 'uploadRecords',
        ids: this.ids,
      });
    },
    delRecord() {
      this.$emit('_del', {
        ref: 'uploadRecords',
        ids: this.ids,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.header-btn-group {
  text-align: right;
}
.header-container {
  padding-top: 0;
}
.el-icon-success {
  color: #67c23a;
}
.el-icon-error {
  color: #f56c6c !important;
}
</style>
