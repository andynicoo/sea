<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="form" :model="form" inline label-width="80px">
          <el-form-item label="时间">
            <el-date-picker v-model="form.sendTime" type="daterange" align="right" size="small" clearable unlink-panels start-placeholder="开始时间" end-placeholder="结束时间" range-separator="到" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" style="width: 340px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="所属主体">
            <el-select v-model="form.enterpriseId" filterable placeholder="请选择所属企业">
              <el-option v-for="(item, index) in firmList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px" class="right">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <div v-show="moreSerch">
            <el-form-item label="短信类型">
              <el-select v-model="form.templateType" clearable placeholder="请选择">
                <el-option :value="item.value" :label="item.label" v-for="item in templateTypeList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input placeholder="请输入" clearable style="width: 168px" v-model="form.mobile" />
            </el-form-item>
            <el-form-item label="发送状态">
              <el-select v-model="form.status" clearable placeholder="请选择">
                <el-option :value="status.value" :label="status.label" v-for="status in statusList" :key="status.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="公司名称">
              <el-input placeholder="请输入" clearable style="width: 168px" v-model="form.companyName" />
            </el-form-item> -->
            <!-- </div> -->
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" label="主体" width="150px" show-overflow-tooltip prop="enterpriseId">
          <template slot-scope="{ row }">
            {{ row.enterpriseId | filterEnterpriseId(firmList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="短信签名" width="150px" show-overflow-tooltip prop="signName"></el-table-column>
        <el-table-column align="center" label="短信类型" width="150px" show-overflow-tooltip prop="templateType">
          <template slot-scope="{ row }">
            {{ row.templateType | filterValue(templateTypeList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号码" width="150px" show-overflow-tooltip prop="mobile">
          <template slot-scope="{ row }">
            <span v-hidden>
              {{ row.mobile }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="短信内容" min-width="200px" show-overflow-tooltip prop="content">
          <template slot-scope="{ row }">
            <span @click="copySms" class="hand target" :data-clipboard-text="row.content">
              {{ row.content }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发送状态" width="150px" show-overflow-tooltip prop="status">
          <template slot-scope="{ row }">
            <i :class="'el-icon-' + getIcon(row.status)"></i>
            {{ row.status | filterValue(statusList) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发送时间" width="200px" show-overflow-tooltip prop="sendDate"></el-table-column>
        <el-table-column align="center" label="接收时间" width="200px" show-overflow-tooltip prop="receiveDate"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50, 100]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { smsList } from '@/api/newApi/publicJournal/smsQuery';
import cacheQuery from '@/mixins/cacheQuery';
import { getFirm } from '@/api/newApi/common.js';
export default {
  data() {
    return {
      total: 0,
      list: [],
      form: {
        page: 1,
        limit: 20,
        sendTime: [],
        enterpriseId: '',
        templateType: '',
        mobile: '',
        status: '',
      },
      statusList: [
        { label: '正在处理', value: 0, icon: 'loading' },
        { label: '发送成功', value: 1, icon: 'success' },
        { label: '发送失败', value: 2, icon: 'error' },
        { label: '等待回执', value: 3, icon: 'loading' },
      ],
      templateTypeList: [
        { label: '验证码', value: 1 },
        { label: '短信通知', value: 2 },
      ],
      cacheKey: 'form',
      copyListQuery: {},
      tableLoading: false,
      searchFlag: false,
      firmList: [],
    };
  },
  mixins: [cacheQuery],
  filters: {
    filterValue(value, list) {
      let temp = list.find((item) => item.value === value);
      return temp ? temp.label : value;
    },
    filterEnterpriseId(enterpriseId, enterpriseList) {
      let temp = enterpriseList.find((item) => item.id === enterpriseId);
      return temp ? temp.name : enterpriseId;
    },
  },
  mounted() {
    this.getfirmList();
    this.copyListQuery = { ...this.form };
    this.getPageCache();

    let enterpriseId = this.$util.getLocalStorage('enterpriseId');
    this.form.enterpriseId = Number(enterpriseId); // 默认选中当前的公司主体
    this.getList();
  },
  methods: {
    /**
     * 获取企业列表
     */
    getfirmList() {
      getFirm().then((res) => {
        if (res.code === 0) {
          this.firmList = res.data;
        }
      });
    },
    getIcon(status) {
      let temp = this.statusList.find((item) => item.value === status);
      return temp ? temp.icon : '';
    },
    getList() {
      this.tableLoading = true;
      if (this.form.sendTime && this.form.sendTime.length) {
        [this.form.startSendDate, this.form.endSendDate] = this.form.sendTime;
      } else {
        [this.form.startSendDate, this.form.endSendDate] = ['', ''];
      }
      this.setPageCache();
      let { sendTime, ...formData } = this.form;
      smsList(formData).then((res) => {
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
      });
    },
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
      this.removePageCache();
    },
    copySms() {
      this.$util.copyLink('.target', '已复制短信');
    }
  },
};
</script>
<style lang="scss" scoped>
.el-icon-success {
  color: #67c23a;
}
.el-icon-error {
  color: #f56c6c !important;
}
</style>
