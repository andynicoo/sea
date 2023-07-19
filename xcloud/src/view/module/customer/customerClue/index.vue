<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入" clearable style="width: 188px" size="small" />
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入" clearable style="width: 188px" size="small" />
          </el-form-item>
          <el-form-item label="应用来源" prop="app">
            <el-select
              style="width: 188px"
              v-model="form.enterpriseId"
              size="small"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option value="29" label="跨税云" />
              <el-option value="30" label="跨标云" />
              <el-option value="28" label="辰海云-商标" />
              <el-option value="40" label="辰海云-VAT" />
              <el-option value="39" label="财赋优" />
              <el-option value="45" label="卖旺云" />
              <el-option value="42" label="卖旺科技" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="平台来源" prop="platform">
            <el-select
              style="width: 188px"
              v-model="form.declareUserId"
              size="small"
              clearable
              filterable
              disabled
              placeholder="请选择"
            >
              <el-option value="1" label="店匠"></el-option>
              <el-option value="2" label="速卖通"></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset"> 重置 </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? "收起" : "更多" }}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <Export
                auth="C1_18"
                excelTitle="客户线索"
                :exportApi="excelList"
                :params="{ ...copyForm }"
                :ids="checkIds"
                :total="total"
              />
              <!-- <el-button size="small" type="primary" @click="batchPushCRM" class="yellow-btn"
                v-show="hasAuthority('C1_19')">
                <i class="icon icon-remind"></i>
                <span>批量推送</span>
              </el-button> -->
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <!-- <el-form-item label="推送CRM状态" prop="searchContent">
              <el-select
                style="width: 188px"
                v-model="form.declareUserId"
                size="small"
                clearable
                filterable
                disabled
                placeholder="请选择"
              >
                <el-option value="1" label="已推送"></el-option>
                <el-option value="2" label="未推送"></el-option>
                <el-option value="3" label="无需推送"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="创建时间" prop="deadline">
              <el-date-picker
                v-model="form.deadline"
                type="daterange"
                style="width: 340px"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                placement="bottom"
                :default-time="[, '23:59:59']"
                clearable
                start-placeholder="日期开始"
                end-placeholder="日期结束"
              >
              </el-date-picker>
            </el-form-item>
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
        element-loading-spinner="icon loading"
        element-loading-text="拼命加载中"
        @selection-change="handleSelectionChange"
        :height="tableHeight"
      >
        <Empty slot="empty" />
        <TableColumn type="selection" fixed="left" width="55" />
        <TableColumn label="手机号" width="130" prop="mobile" />
        <TableColumn label="名称" width="150" prop="name" />
        <TableColumn label="电子邮件" width="200" prop="email" />
        <TableColumn label="地址" width="200" prop="address" />
        <TableColumn label="平台来源" width="100" prop="platformDes" />
        <TableColumn label="应用来源" width="100" prop="applicationName" />
        <TableColumn label="创建时间" width="160" prop="createTime" />
        <TableColumn label="线索类型" width="80" prop="oldLeadDes" />
        <TableColumn label="推送CRM状态" width="130" prop="crmStatusDes" />
        <TableColumn label="推送时间/处理时间" width="160" prop="crmCreateTime" />
        <TableColumn label="接收人" width="100" prop="asdada" />
        <TableColumn label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="推送CRM" placement="top" v-show="hasAuthority('C1_20')" v-if="false">
              <el-link type="primary" :underline="false" @click="pushCRM([scope.row.id])">
                <i class="icon icon-out"></i>
              </el-link>
            </el-tooltip>
          </template>
        </TableColumn>
      </el-table>
    </div>
    <Dialog :dialogvisible.sync="checkDialog" @refresh="getList" :ids="ids"></Dialog>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.page"
        :page-sizes="$constant.WORKER_SERVER_PAGELIST"
        :page-size="form.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { excelList, getClueList } from "@/api/newApi/customer/customenrClue.js";
import Dialog from "./dialog";
import TableColumn from "./components/TableColumn";
import Export from "./components/Export";
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
        productFunctionCode: "",
        mobile: "",
        name: "",
        enterpriseId: "",
        declareUserId: "",
        abnormalType: "",
        deadline: [],
      },
      cacheKey: "form",
      copyListQuery: {},
      searchFlag: false,
      checkRemarkDialog: false,
      checkDialog: false,
      moreSerch: false,
      exportLoading: false,
      checkIds: [],
      checkItems: [],
      checkItem: {},
      ids: [],
      countrySelectList: [],
      copyForm: {},
    };
  },
  mixins: [cacheQuery],
  components: {
    Dialog,
    TableColumn,
    Export,
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
  },
  methods: {
    excelList,
    getList() {
      this.tableLoading = true;
      [this.form.createTimeStart, this.form.createTimeEnd] =
        this.form.deadline && this.form.deadline.length ? this.form.deadline : ["", ""];
      this.setPageCache();
      let { deadline, ...formData } = this.form;
      getClueList(formData)
        .then((res) => {
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          this.copyForm = {
            ...this.form,
            total: parseInt(res.data.total),
          };
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: "success",
              duration: 2000,
            });
            this.searchFlag = false;
          }

          // 更新时 过滤已推送的数据
          this.checkItems = this.checkItems.filter((v) => !v.phone);
        })
        .catch((err) => {
          this.tableLoading = false;
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
    reset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
    handleSelectionChange(val) {
      this.checkIds = val.map((item) => item.customerLeadId);
      this.checkItems = val;
    },
    // 批量推送
    batchPushCRM() {
      if (!this.checkIds.length) {
        this.$message.warning("请选择数据");
        return;
      }
      this.pushCRM(this.checkIds);
    },
    // 推送数据
    pushCRM(ids) {
      this.ids = ids;
      this.checkDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
</style>
