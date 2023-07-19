<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <el-form-item label="VAT税号" prop="vatTaxNumber">
            <el-input
              v-model="form.vatTaxNumber"
              placeholder="请输入VAT税号"
              clearable
              style="width: 168px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="信件类型" prop="type">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.type">
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
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? "收起" : "更多" }}筛选
            </el-button>
          </el-form-item>
          <div class="header-btn-group" style="float: right">
            <el-button type="primary" size="small" @click="add(0)" icon="el-icon-message" v-if="hasAuthority('G2_1')">
              发送信件
            </el-button>
          </div>
          <!-- 折叠部分 -->
          <div v-show="moreSerch">
            <el-col :span="24">
              <el-form-item label="处理状态" prop="processStatus">
                <el-select
                  placeholder="请选择"
                  size="small"
                  style="width: 168px"
                  clearable
                  filterable
                  v-model="form.processStatus"
                >
                  <el-option
                    v-for="(item, index) in stateList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item align="center" label="国家" prop="taxCountryCode">
                <el-select
                  placeholder="请选择"
                  size="small"
                  style="width: 168px"
                  clearable
                  v-model="form.taxCountryCode"
                  filterable
                >
                  <el-option
                    v-for="item in countrySelectList"
                    :key="item.id"
                    :value="item.countryCode"
                    :label="item.countryNameZh"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户手机号" prop="taxUserMobile">
                <el-input
                  v-model="form.taxUserMobile"
                  placeholder="请输入客户手机号"
                  clearable
                  style="width: 168px"
                  size="small"
                />
              </el-form-item>
              <el-form-item label="客户公司名称" prop="companyNameZh">
                <el-input
                  v-model="form.companyNameZh"
                  placeholder="请输入客户公司名称"
                  clearable
                  style="width: 168px"
                  size="small"
                />
              </el-form-item>
              <el-form-item label="发送时间">
                <el-date-picker
                  v-model="form.sendTime"
                  type="daterange"
                  align="right"
                  size="small"
                  clearable
                  unlink-panels
                  range-separator="到"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  style="width: 340px"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <!-- <h2 class="table-container-title">
        <div>查询表格</div>
        <div class="header-btn-group">
          <el-button type="primary" size="small" @click="add(0)" icon="el-icon-message">发送信件</el-button>
        </div>
      </h2> -->
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
          width="150"
          label="VAT税号"
          show-overflow-tooltip
          prop="vatTaxNumber"
        ></el-table-column>
        <el-table-column
          align="center"
          width="150"
          label="客户手机号"
          show-overflow-tooltip
          prop="taxUserMobile"
        ></el-table-column>
        <el-table-column
          align="center"
          width="100"
          label="国家"
          show-overflow-tooltip
          prop="taxCountry"
        ></el-table-column>
        <el-table-column
          align="center"
          width="150"
          label="信件类型"
          show-overflow-tooltip
          prop="typeName"
        ></el-table-column>
        <!-- <el-table-column
          align="center"
          width="150"
          label="信件接收时间"
          show-overflow-tooltip
          prop="receiveTime"
          sortable
        >
          <template slot-scope="{ row }">{{ row.receiveTime.split(" ")[0] }}</template>
        </el-table-column> -->
        <el-table-column
          align="center"
          width="250"
          label="信件内容"
          show-overflow-tooltip
          prop="processSuggestions"
        ></el-table-column>
        <el-table-column align="center" width="100" label="处理状态" show-overflow-tooltip prop="processStatus">
          <template slot-scope="scope">{{ scope.row.processStatus | filterStatus }}</template>
        </el-table-column>
        <!-- <el-table-column align="center" width="150" label="是否发送用户" show-overflow-tooltip prop="isSend">
          <template slot-scope="scope">{{ scope.row.isSend | filterIsSend }}</template>
        </el-table-column> -->
        <el-table-column align="center" width="150" label="是否已读" show-overflow-tooltip prop="isRead">
          <template slot-scope="scope">{{ scope.row.isRead | filterIsRead }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          width="150"
          label="信件发送时间"
          show-overflow-tooltip
          prop="sendTime"
          sortable
        ></el-table-column>
        <el-table-column
          align="center"
          width="150"
          label="发送人"
          show-overflow-tooltip
          prop="sender"
        ></el-table-column>
        <el-table-column align="center" width="200" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看详情" placement="top" v-if="hasAuthority('G2_2')">
              <el-link type="primary" :underline="false" @click="detail(scope.row)" class="icon icon-see"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="编辑" placement="top" v-if="hasAuthority('G2_3')">
              <el-link
                type="primary"
                :underline="false"
                @click="add(scope.row.id)"
                v-if="scope.row.isSend === 0"
                class="icon icon-edit"
              ></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="处理完成" placement="top" v-if="hasAuthority('G2_4')">
              <el-link
                type="primary"
                :underline="false"
                @click="deal(scope.row.id)"
                v-if="scope.row.processStatus === 2"
                class="icon icon-complete"
              ></el-link>
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
  getStationLetterList,
  dealStationLetter,
  getLetterTemplateListApi
} from "@/api/newApi/messageCenter/letterManage";
import { getCountrySelectList } from "@/api/newApi/common.js";
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
        processStatus: "",
        taxCountryCode: "",
        type: [],
        vatTaxNumber: "",
        sendTime: [],
        taxUserMobile: "",
        companyNameZh: ""
      },
      cacheKey: "form",
      copyListQuery: {},
      countrySelectList: [],
      letterTypeList: {},
      stateList: [
        { value: 0, name: "无需处理" },
        { value: 1, name: "待处理" },
        // {value: 2, name: '已处理'},
        { value: 3, name: "处理完成" }
      ],
      searchFlag: false,
      moreSerch: false
    };
  },
  filters: {
    filterIsRead(isRead) {
      switch (isRead) {
        case 0:
          return "未读";
        case 1:
          return "已读";
      }
    },
    filterIsSend(isSend) {
      switch (isSend) {
        case 0:
          return "未发送";
        case 1:
          return "已发送";
      }
    },
    filterStatus(status) {
      switch (status) {
        case 0:
          return "无需处理";
        case 1:
          return "待处理";
        case 2:
          return "已处理";
        case 3:
          return "处理完成";
      }
    }
  },
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    this._getCountrySelectList();
    this.getLetterType();
  },
  methods: {
    getList() {
      this.tableLoading = true;
      if (this.form.sendTime && this.form.sendTime.length) {
        [this.form.createTimeStart, this.form.createTimeEnd] = this.form.sendTime;
      } else {
        [this.form.createTimeStart, this.form.createTimeEnd] = ["", ""];
      }
      this.setPageCache();
      let { sendTime, ...formData } = this.form;
      getStationLetterList({ ...formData, type: this.form.type == "" ? [] : this.form.type })
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
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then(res => {
        this.countrySelectList = res.data;
      });
    },
    // 发送信件
    add(id) {
      this.$router.push({
        name: "letterManageAdd",
        params: {
          id
        }
      });
    },
    detail(row) {
      this.$router.push({
        name: "letterManageDetail",
        params: {
          rowData: row
        }
      });
    },
    deal(id) {
      this.$confirm("是否确认客户已处理完成信件！", "提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true
      }).then(() => {
        dealStationLetter(id).then(res => {
          if (res.code === 0) {
            this.$message.success("发送成功");
            this.getList();
          }
        });
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
      this.moreSerch = false;
      this.getList();
    },
    reset() {
      // if (this.$refs.searchForm) {
      //   this.$refs.searchForm.resetFields();
      // }
      this.form = { ...this.copyListQuery };
      this.removePageCache();
      // this.sendTime = [];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
</style>
