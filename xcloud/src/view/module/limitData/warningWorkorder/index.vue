<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="80px">
          <el-form-item label="业务类型" prop="productFunctionCode">
            <el-select
              placeholder="请选择"
              size="small"
              style="width: 168px"
              filterable
              v-model="form.productFunctionCode"
              @change="changeSupplier"
            >
              <el-option
                v-for="item in functionCodeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家" prop="countryCode">
            <el-select
              placeholder="请选择"
              size="small"
              style="width: 168px"
              clearable
              filterable
              v-model="form.countryCode"
              @change="changeSupplier"
            >
              <el-option
                v-for="item in countrySelectList"
                :key="item.countryCode"
                :value="item.countryCode"
                :label="item.countryNameZh"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="search"
            >
              搜索
            </el-button>
            <el-button
              size="small"
              icon="el-icon-refresh"
              @click="reset"
            >
              重置
            </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{moreSerch ? '收起' : '更多'}}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right;">
            <div class="header-btn-group">
              <el-button
                type="primary"
                size="small"
                class="yellow-btn"
                @click="_export"
                :loading="exportLoading"
                v-show="hasAuthority('L2_18')"
              >
                <i class="icon icon-export"></i>
                <span>导出</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="服务商" prop="supplierId">
              <el-select
                placeholder="请选择"
                size="small"
                style="width: 168px"
                clearable
                filterable
                v-model="form.supplierId"
              >
                <el-option
                  v-for="item in supplierList"
                  :key="item.supplierId"
                  :label="item.shortName"
                  :value="item.supplierId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="税务经理" prop="disposeId">
              <el-select style="width: 168px" v-model="form.disposeId" size="small" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in managerList"
                  :key="item.userId"
                  :value="item.userId"
                  :label="item.nickName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务号" prop="serviceNo">
              <el-input v-model="form.serviceNo" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="公司名称" prop="companyNameZh">
              <el-input v-model="form.companyNameZh" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="手机号" prop="userMobile">
              <el-input v-model="form.userMobile" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column
          align="center"
          label="服务号"
          width="200"
          show-overflow-tooltip
          prop="serviceNo"
        ></el-table-column>
        <el-table-column
          align="center"
          label="业务类型"
          width="150"
          show-overflow-tooltip
          prop="productFunctionCode"
        >
          <template slot-scope="{row}">{{row.productFunctionCode | filterFunctionCode}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="服务进度"
          width="150"
          show-overflow-tooltip
          prop="nodeCodeName"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="国家"
          width="150"
          show-overflow-tooltip
          prop="countryNameZh"
        >
          <template slot-scope="{row}">{{row.countryNameZh || '-'}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="服务商"
          width="150"
          show-overflow-tooltip
          prop="supplierName"
        >
          <template slot-scope="{row}">{{row.supplierName || '-'}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="公司名称"
          width="200"
          show-overflow-tooltip
          prop="companyNameZh"
        >
          <template slot-scope="{row}">{{row.companyNameZh || '-'}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="手机号"
          width="150"
          show-overflow-tooltip
          prop="userMobile"
        >
          <template slot-scope="{row}">{{row.userMobile || '-'}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="预期交付剩余时间"
          width="150"
          show-overflow-tooltip
          prop="surplusDeliverTime"
        >
          <template slot="header">
            预期交付剩余时间
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">
                距离交付剩余时间=约定交付时间-当前时间<br>
                时间取天，不足一天算一天
              </div>
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">{{row.surplusDeliverTime || '-'}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="预期交付时间"
          width="150"
          show-overflow-tooltip
          prop="expectDeliverTime"
        >
          <template slot="header">
            预期交付时间
            <el-tooltip class="item" effect="dark" content="预期交付时间=资料提交给服务商的时间点+交付时效" placement="top-start">
              <i class="el-icon-question text-warning"></i>
            </el-tooltip>
          </template>
          <template slot-scope="{row}">{{row.expectDeliverTime || '无'}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="税务经理"
          show-overflow-tooltip
          prop="disposeName"
        >
          <template slot-scope="{row}">{{row.disposeName || '-'}}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="备注详情"
          width="150"
          show-overflow-tooltip
          prop="existRemark"
        >
          <template slot-scope="scope">
            <el-link v-if="hasAuthority('L2_19') && scope.row.existRemark" @click="checkRemark(scope.row)" type="primary"><i class="icon icon-search-small"></i>查看</el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="150"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-tooltip content="备注" placement="top" v-show="hasAuthority('L2_20')">
              <el-link
                type="primary"
                :underline="false"
                @click="addRemark(scope.row)"
              >
                <i class="icon icon-remarks"></i>
              </el-link>
            </el-tooltip>
            <el-tooltip content="去处理" placement="top" v-show="hasAuthority('L2_21')">
              <el-link
                type="primary"
                :underline="false"
                @click="detail(scope.row)"
              >
                <i class="icon icon-processing"></i>
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <CheckRemarkDialog
      :checkRemarkDialog.sync="checkRemarkDialog"
      :serviceNo="checkItem.serviceNo"
      @refresh="getList"
    ></CheckRemarkDialog>
    <RemarkDialog :remarkDialog.sync="remarkDialog" :serviceNo="checkItem.serviceNo" @refresh="getList"></RemarkDialog>
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
import {serviceOrderWarnList, excelList} from '@/api/newApi/limitData/warningWorkorder'
import {getCountrySelectList, getDisposelist} from "@/api/newApi/common.js";
import {findSuppliers} from '@/api/newApi/processFields/processConfig.js'
import {functionCodeList} from './enum.js'
import CheckRemarkDialog from '@/view/module/workOrder/hyCertification/components/checkRemarkDialog'
import RemarkDialog from '@/view/module/workOrder/hyCertification/components/remarkDialog'
export default {
  data() {
    return {
      tableLoading: false,
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        productFunctionCode: functionCodeList[0].value,
        countryCode: '',
        supplierId: '',
        disposeId: '',
        serviceNo: '',
        companyNameZh: '',
        userMobile: ''
      },
      functionCodeList: functionCodeList,
      searchFlag: false,
      checkRemarkDialog: false,
      remarkDialog: false,
      moreSerch: false,
      exportLoading: false,
      checkItem: {},
      countrySelectList: [],
      supplierList: [],
      managerList: []
    }
  },
  filters: {
    filterFunctionCode(productFunctionCode) {
      let functionCodeItem = functionCodeList.find(item => item.value === productFunctionCode)
      return functionCodeItem ? functionCodeItem.label : ''
    }
  },
  components: {
    CheckRemarkDialog,
    RemarkDialog
  },
  mounted() {
    this.getManagerList()
    this._getCountrySelectList()
    this.getSuppliers()
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      serviceOrderWarnList(this.form).then(res => {
        this.list = res.data.records
        this.total = parseInt(res.data.total)
        this.tableLoading = false
        if (this.searchFlag) {
          this.$message({
            message: `搜索完成，为您搜索${this.total}条结果`,
            type: "success",
            duration: 2000,
          })
          this.searchFlag = false
        }
      }).catch((err) => {
        this.tableLoading = false
      })
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    // 获取服务商列表
    getSuppliers() {
      findSuppliers({
        page: 1,
        limit: 9999,
        functionCode: this.form.productFunctionCode,
        countryCode: this.form.countryCode
      }).then(res => {
        this.supplierList = res.data.records
      })
    },
    // 获取税务经理列表
    getManagerList() {
      getDisposelist({
        functionCode: this.form.productFunctionCode
      }).then(res => {
        this.managerList = res.data;
      });
    },
    changeSupplier() {
      this.getSuppliers()
      this.form.supplierId = ''
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.form.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.form.page = val
      this.getList()
    },
    search() {
      this.searchFlag = true
      this.form.page = 1
      this.getList()
    },
    reset() {
      if(this.$refs.searchForm) {
        this.$refs.searchForm.resetFields()
      }
    },
    _export() {
      this.$confirm(`当前选择${this.total}条数据 ，是否确认导出？`, "数据导出", {
        customClass: "custom-confirm",
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: "warning",
        center: true
      }).then(() => {
        this.exportLoading = true
        excelList(this.form).then(res => {
          this.exportLoading = false
          this.$util.exportExcel(res, '预警工单')
        }).catch(e => {
          this.exportLoading = false
        })
      });
    },
    // 查看备注
    checkRemark(row) {
      this.checkItem = row;
      this.checkRemarkDialog = true;
    },
    // 添加备注
    addRemark(row) {
      this.checkItem = row;
      this.remarkDialog = true;
    },
    detail(row) {
      switch(row.productFunctionCode) {
        case 5: // 税号注册
          this.$router.push({
            name: "taxRegisterInfo",
            query: { serviceId: row.serviceId, serviceNo: row.serviceNo }
          });
          break
        case 2: // 税务转代理
          this.$router.push({
            name: "taxInfo",
            query: { serviceId: row.serviceId, serviceNo: row.serviceNo }
          });
          break;
        case 13: // 海牙认证
          this.$router.push({
            path: "/hyCertification/detail",
            query: {
              serviceId: row.serviceId,
              serviceNo: row.serviceNo,
              userId: row.userId,
            },
          });
          break;
        case 16: // 授权代表
          this.$router.push({
            path: "/authorizedRepresent/detail",
            query: {
              serviceId: row.serviceId
            }
          });
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
</style>