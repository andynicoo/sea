<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <el-form-item label="工单类型" prop="productFunctionCode">
            <el-cascader placeholder="请选择" size="small" filterable v-model="form.productFunctionCode" @change="changeSupplier2" :options="functionCodeList"></el-cascader>
          </el-form-item>
          <el-form-item label="国家" prop="countryCode">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.countryCode" @change="changeSupplier">
              <el-option v-for="(item,index) in countrySelectList" :key="index" :value="item.countryCode" :label="item.countryNameZh"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="异常状态" prop="abnormalStatus">
            <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.abnormalStatus">
              <el-option v-for="(item, index) in abnormalReason" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">
              搜索
            </el-button>
            <el-button size="small" icon="el-icon-refresh" @click="reset">
              重置
            </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{moreSerch ? '收起' : '更多'}}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <div class="header-btn-group">
              <el-button type="primary" size="small" class="green-btn" @click="_export" v-show="hasAuthority('L2_11')">
                <i class="icon icon-export"></i>
                <span>导出</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="供应商" prop="supplierId">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.supplierId">
                <el-option v-for="(item,index) in supplierList" :key="index" :label="item.serviceProviderName" :value="item.serviceProviderId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字" prop="searchKeyword">
              <el-input v-model="form.searchKeyword" placeholder="服务号/公司中英文名称" clearable style="width: 188px" size="small" />
            </el-form-item>
            <el-form-item label-width="120px" label="提交供应商日期" prop="deadline">
              <el-date-picker v-model="form.deadline" type="daterange" :picker-options="endTime" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" clearable start-placeholder="日期开始" end-placeholder="日期结束">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column align="center" label="服务号" width="200" show-overflow-tooltip prop="serviceNo"></el-table-column>
        <el-table-column align="center" label="公司中文名称" width="200" show-overflow-tooltip prop="companyNameZh">
        </el-table-column>
        <el-table-column align="center" label="工单类型" show-overflow-tooltip>
          <template slot-scope="{row}">{{getMonitorTypeEnum(row.productFunctionCode)}}</template>
        </el-table-column>
        <el-table-column align="center" label="国家" show-overflow-tooltip prop="countryNameZh">
        </el-table-column>
        <el-table-column align="center" label="供应商" show-overflow-tooltip prop="supplierName"></el-table-column>
        <el-table-column align="center" label="异常状态" show-overflow-tooltip prop="abnormalStatus">
          <template slot-scope="{row}">{{row.abnormalStatus == -1 ?'未知': row.abnormalStatus == 1 ? '超时':'预警'}}</template>
        </el-table-column>
        <el-table-column align="center" sortable label="剩余交付天数" width="170" show-overflow-tooltip prop="surplusDeliverDay">
          <template slot="header">
            剩余交付天数
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">
                当监控区间的服务用时大于预警时效时，服务单进入预警工单，且异常状态为预警
              </div>
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" sortable label="超时天数 " show-overflow-tooltip prop="exceedDelivery">
          <template slot="header">
            超时天数
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">
                当监控区间的服务用时大于交付时效时，服务单异常状态由预警变为超时
              </div>
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="税务经理" show-overflow-tooltip prop="disposeName">
        </el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="去处理" placement="top" v-if="hasAuthority('L2_16') && scope.row.abnormalType !== '3'">
              <el-link type="primary" :underline="false" @click="detail(scope.row)">
                <i class="icon icon-processing"></i>
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[20, 50, 100, 200]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { abnormalList, abnormalListExport, findProcesses } from "@/api/newApi/limitData/supplyErrSingle"; //
import { supplyFunCodes, monitorTypeEnum } from "../../supplierPublic/enum.js";

import { getCountrySelectList } from "@/api/newApi/common.js"; //国家列表
import { filterCountry } from "../../supplierPublic/supplieUtil.js";
import { detailEnum } from "./supplyEeeSingle";
import cacheQuery from "@/mixins/cacheQuery";
// import { log } from "console";
// import { supplyFunCodes} from "../../";
export default {
  mixins: [cacheQuery],
  data() {
    return {
      tableLoading: false,
      functionCodeList: supplyFunCodes,
      form: {
        abnormalStatus: "", //异常状态
        countryCode: "", //国家编码
        searchKeyword: "", //关键字
        supplierId: "", //服务商id(律师id)
        productFunctionCode: [0, 5],
        page: 1,
        limit: 100,
        deadline: [],
      },

      endTime: {
        disabledDate(time) {
          return time.getTime() > Date.now() + 86400000;
        },
      },
      supplierList: [],
      abnormalReason: [
        { label: "预警", value: "0" },
        { label: "超时", value: "1" },
      ],
      countrySelectList: [],
      selectList: [], //表格勾选数
      list: [], //初始化返回数据
      total: 0,
      exportLoading: false,
    };
  },

  components: {},
  created() {
    this.copyListQuery = { ...this.form };
    this._getCountrySelectList();
    this.getSuppliers();
    this.getList();
  },
  methods: {
    /**设置请求值 */
    setPram() {
      let parm = { ...this.form };
      parm.productFunctionCode = this.filterSupplyFunCodes(this.form.productFunctionCode);
      if (parm.abnormalStatus == "") parm.abnormalStatus == null;
      delete parm.deadline;
      parm = this.emptySetNull(parm);
      parm.monitorEndTime = this.form.deadline[1];
      parm.monitorStartTime = this.form.deadline[0];
      return parm;
    },
    /** 工单类型 */
    getMonitorTypeEnum(key) {
      return monitorTypeEnum.find((item) => key == item.id).section;
    },
    /**空字符串 转 null */
    emptySetNull(parm) {
      Object.keys(parm).forEach((item) => {
        if (parm[item] === "") parm[item] = null;
      });
      return parm;
    },
    /**根据下拉列表找到对应的 productFunctionCode */
    filterSupplyFunCodes(position) {
      let sign = supplyFunCodes[position[0]].children.find((item) => item.value == [position[1]]).value;

      return sign;
    },
    async getList() {
      try {
        this.tableLoading = true;
        let parm = this.setPram();
        console.log(parm);
        let {
          data: { records, total },
          code,
        } = await abnormalList(parm);
        if (code == 0) {
          this.list = records;
          this.total = parseInt(total);
          this.tableLoading = false;
          this.copyForm = { ...this.form };
          if (this.searchFlag) {
            this.$message({
              message: `搜索完成，为您搜索${this.total}条结果`,
              type: "success",
              duration: 2000,
            });
            this.searchFlag = false;
          }
        }
      } catch (err) {
        this.tableLoading = false;
      }
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        // let countryArr = filterCountry(res.data);
        this.countrySelectList = res.data;
      });
    },

    changeSupplier() {
      this.getSuppliers();
      this.form.supplierId = "";
    },
    changeSupplier2() {
      this.getSuppliers();
      this.form.supplierId = "";
    },

    /** 获取服务商列表 */
    getSuppliers() {
      findProcesses({
        functionCode: this.form.productFunctionCode[1],
        countryCode: this.form.countryCode,
        status: "4",
        limit: 999,
        page: 1,
      }).then((res) => {
        this.supplierList = res.data.records;
      });
    },
    //多选勾选
    handleSelectionChange(val) {
      this.selectList = val;
    },
    /**导出 */
    _export() {
      this.$confirm(`当前共计${this.total}条数据 ，是否确认导出？`, "数据导出", {
        customClass: "custom-confirm",
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      }).then(() => {
        this.exportLoading = true;
        let data = this.setPram();
        data.size = this.total;
        abnormalListExport(data)
          .then((res) => {
            console.log("11111111111111111供应商异常工单", res);
            this.exportLoading = false;
            this.$util.exportExcel(res, "供应商异常工单");
          })
          .catch((e) => {
            this.exportLoading = false;
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
      this.getList();
    },
    reset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },

    /** 去处理 */
    detail(row) {
      console.log(row);
      this.$router.push({
        name: detailEnum.find((item) => item.key == row.productFunctionCode).path,
        query: {
          serviceId: row.serviceId,
          serviceNo: row.serviceNo,
          orderNo: row.orderNo,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
</style>