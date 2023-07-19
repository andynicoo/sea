<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="searchForm" :model="form" inline label-width="80px">
          <!-- <el-form-item label="时间范围" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="date"
              align="right"
              size="small"
              clearable
              unlink-panels
              placeholder="请选择"
              value-format="yyyy-MM-dd"
              style="width: 168px"
              >
            </el-date-picker>
          </el-form-item> -->
          <el-form-item label="统计对象" prop="statisticalObject">
            <el-select
              placeholder="请选择"
              size="small"
              style="width: 168px"
              filterable
              v-model="form.statisticalObject"
              @change="changeListType"
            >
              <el-option
                v-for="(item, index) in statisticalObjectList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据维度" prop="dataDimension">
            <el-select
              placeholder="请选择"
              size="small"
              style="width: 168px"
              filterable
              v-model="form.dataDimension"
              @change="changeListType"
            >
              <el-option
                v-for="item in dataDimensionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
          <el-form-item style="float: right;" v-show="hasAuthority('L2_6')">
            <div class="header-btn-group">
              <el-button
                type="primary"
                size="small"
                class="green-btn"
                @click="_export"
                :loading="exportLoading"
              >
                <i class="icon icon-export"></i>
                <span>导出</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="业务类型" prop="businessType">
              <el-select
                placeholder="请选择"
                size="small"
                style="width: 168px"
                filterable
                v-model="form.businessType"
                @change="changeSupplier"
              >
                <el-option
                  v-for="(item, index) in businessTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务号" prop="serviceNo" v-show="form.dataDimension === '2' && form.statisticalObject === '2'">
              <el-input v-model="form.serviceNo" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="税务经理" prop="disposeId" v-show="form.statisticalObject === '2'">
              <el-select style="width: 168px" v-model="form.disposeId" size="small" clearable filterable placeholder="请选择">
                <el-option
                  v-for="item in managerList"
                  :key="item.userId"
                  :value="item.userId"
                  :label="item.nickName"
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
            <el-form-item label="服务商" prop="supplierId" v-show="!(form.dataDimension === '2' && form.statisticalObject === '2')">
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
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <div class="table-container-title">
        <div>数据详情</div>
      </div>
      <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <!-- 服务商 -->
        <template v-if="listType === 1 || listType === 2">
          <el-table-column
            align="center"
            label="国家"
            width="300"
            show-overflow-tooltip
            key="countryNameZh1"
            prop="countryNameZh"
          ></el-table-column>
          <el-table-column
            align="center"
            label="服务商"
            width="300"
            show-overflow-tooltip
            key="supplierName1"
            prop="supplierName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="业务类型"
            width="300"
            show-overflow-tooltip
            key="serviceName1"
            prop="serviceName"
          >
          </el-table-column>
        </template>
        <!-- 税务经理 -->
        <template v-if="listType === 3 || listType === 4">
          <el-table-column
            align="center"
            label="税务经理"
            width="210"
            show-overflow-tooltip
            key="disposeName1"
            prop="disposeName"
          >
            <template slot-scope="{row}">{{copyForm.businessType === 5 ? row.declareUserName : row.disposeName}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="业务类型"
            width="210"
            show-overflow-tooltip
            key="serviceName2"
            prop="serviceName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="国家"
            width="210"
            show-overflow-tooltip
            key="countryNameZh2"
            prop="countryNameZh"
          >
          </el-table-column>
        </template>
        <!-- 服务商+处理次数 -->
        <template v-if="listType === 1">
          <el-table-column
            align="center"
            label="待提交数"
            show-overflow-tooltip
            key="notSubmittedQty"
            prop="notSubmittedQty"
          >
            <template slot="header">
              待提交数
              <el-tooltip class="item" effect="dark" content="待提交数：指客户提交资料后，税务经理未提交资料给服务商的工单数量；" placement="top-start">
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="已提交数"
            show-overflow-tooltip
            key="onSubmittedQty"
            prop="onSubmittedQty"
          >
            <template slot="header">
              已提交数
              <el-tooltip class="item" effect="dark" content="已提交数：指税务经理将业务所需资料提交给服务商的工单数量；" placement="top-start">
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="已完成数"
            show-overflow-tooltip
            key="completeQty"
            prop="completeQty"
          >
            <template slot="header">
              已完成数
              <el-tooltip class="item" effect="dark" content="已完成数：指完成交付的工单数量；" placement="top-start">
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>
        <!-- 服务商+处理时长 -->
        <template v-if="listType === 2">
          <el-table-column
            align="center"
            label="服务单号"
            width="210"
            show-overflow-tooltip
            key="serviceNo1"
            prop="serviceNo"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="税务经理"
            width="210"
            show-overflow-tooltip
            key="disposeName1"
            prop="disposeName"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="完成时长"
            show-overflow-tooltip
            key="completeTime"
            prop="completeTime"
          >
            <template slot="header">
              完成时长
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  税号注册交付完成时长=点击【录入税号】时间 - 点击【提交注册】时间<br/>
                  税务转代理交付完成时长=点击【完成转代理】时间 - 点击【提交转代理】时间<br/>
                  税务申报交付完成时长=点击【上传回执】时间 - 点击【提交申报】时间<br/>
                  海牙认证交付完成时长=点击【录入海牙信息】时间 - 点击【提交资料】时间<br>
                  授权代表交付完成时长=点击【录入英/欧代信息】时间 - 点击【提交注册】时间
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
            <template slot-scope="{row}">{{row.completeTime !== '' ? (row.completeTime + '天') : '-'}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="时效要求"
            show-overflow-tooltip
            key="durationTime"
            prop="durationTime"
          >
            <template slot="header">
              时效要求
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  当工单已提交资料给服务商，该工单时效要求取原来的时效要求；<br/>
                  当工单未提交资料给服务商，该工单时效要求取最新的时效要求；
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
            <template slot-scope="{row}">{{row.durationTime !== '' ? (row.durationTime + '周') : '-'}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="效率评估"
            show-overflow-tooltip
            key="efficientInfo"
            prop="efficientInfo"
          >
            <template slot="header">
              效率评估
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  当完成时长≤时效要求，效率评估为：正常；<br/>
                  当完成时长＞时效要求，效率评估为：超时完成
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>
        <!-- 税务经理+处理次数 -->
        <template v-if="listType === 3">
          <el-table-column
            align="center"
            label="服务商"
            width="210"
            show-overflow-tooltip
            key="supplierName2"
            prop="supplierName"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="待审核数"
            show-overflow-tooltip
            key="notAuditQty"
            prop="notAuditQty"
          >
            <template slot="header">
              待审核数
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  待审核数：指客户已提交资料待审核的工单数；<br/>
                  包含被驳回再次提交资料待审核的工单
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="已审核数"
            show-overflow-tooltip
            key="onAuditQty"
            prop="onAuditQty"
          >
            <template slot="header">
              已审核数
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  已审核数：指客户提交资料后被审核过的工单数；<br/>
                  包含审核通过的工单数+被驳回的工单数
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            label="审核授权数"
            show-overflow-tooltip
            key="auditAuthorizeQty"
            prop="auditAuthorizeQty"
          >
            <template slot="header">
              审核授权数
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  审核授权数：指客户提交授权后被审核过的工单数<br/>
                  包含审核通过的工单数+被驳回的工单数；
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column> -->
          <el-table-column
            align="center"
            label="提交服务商数"
            show-overflow-tooltip
            key="submitSupplierQty"
            prop="submitSupplierQty"
          >
            <template slot="header">
              提交服务商数
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  指税务经理将业务所需资料提交给服务商的工单数量；
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="完成工单数"
            show-overflow-tooltip
            key="completeWorkOrderQty"
            prop="completeWorkOrderQty"
          >
            <template slot="header">
              完成工单数
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  完成工单数：指税务经理跟进完成交付的工单数量；
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>
        <!-- 税务经理+处理时长 -->
        <template v-if="listType === 4">
          <el-table-column
            align="center"
            label="服务号"
            width="210"
            show-overflow-tooltip
            key="serviceNo2"
            prop="serviceNo"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="审核资料时长"
            show-overflow-tooltip
            key="auditMaterialTime"
            prop="auditMaterialTime"
          >
            <template slot="header">
              审核资料时长
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  审核资料时长= 税务经理审核通过的时间点- 客户提交资料的时间点
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
            <template slot-scope="{row}">{{row.auditMaterialTime !== '' ? (row.auditMaterialTime + 'h') : '-'}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="审核授权时长"
            show-overflow-tooltip
            key="auditAuthorizeTime"
            prop="auditAuthorizeTime"
          >
            <template slot="header">
              审核授权时长
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  审核授权时长= 税务经理审核通过的时间点- 客户上传(或邮寄)授权书的时间点
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
            <template slot-scope="{row}">{{row.auditAuthorizeTime !== '' ? (row.auditAuthorizeTime + 'h') : '-'}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="提交资料时长"
            show-overflow-tooltip
            key="submitMaterialTime"
            prop="submitMaterialTime"
          >
            <template slot="header">
              提交资料时长
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  提交资料时长= 税务经理将业务资料提交给服务商的时间点- 客户提交资料的时间点
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
            <template slot-scope="{row}">{{row.submitMaterialTime !== '' ? (row.submitMaterialTime + 'h') : '-'}}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="完成工单时长"
            show-overflow-tooltip
            key="completeWrokOrderTime"
            prop="completeWrokOrderTime"
          >
            <template slot="header">
              完成工单时长
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content">
                  完成工单时长= 业务工单完成交付的时间点- 客户提交资料的时间点
                </div>
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
            <template slot-scope="{row}">{{row.completeWrokOrderTime !== '' ? (row.completeWrokOrderTime + 'h') : '-'}}</template>
          </el-table-column>
        </template>
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
import {serviceDeliveryDataList, excelList} from '@/api/newApi/limitData/VATDeliverData'
import {getCountrySelectList, getDisposelist} from "@/api/newApi/common.js";
import {findSuppliers} from '@/api/newApi/processFields/processConfig.js'
export default {
  data() {
    return {
      tableLoading: false,
      list: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        statisticalObject: '1',
        dataDimension: '1',
        businessType: 1,
        countryCode: '',
        supplierId: '',
        disposeId: '',
        serviceNo: ''
      },
      copyForm: {},
      exportLoading: false,
      statisticalObjectList: [
        {label: '服务商', value: '1'},
        {label: '税务经理', value: '2'}
      ],
      dataDimensionList: [
        {label: '处理次数', value: '1'},
        {label: '处理时长', value: '2'}
      ],
      businessTypeList: [
        {label: '税号注册', value: 1, code: ['5']},
        {label: '税务转代理', value: 2, code: ['2']},
        {label: '海牙认证', value: 3, code: ['13']},
        {label: '税务申报', value: 5, code: ['2', '5', '23']},
        {label: '授权代表', value: 8, code: ['16']}
      ],
      statusList: [
        {name: '启用', value: 1},
        {name: '禁用', value: 2}
      ],
      searchFlag: false,
      moreSerch: false,
      countrySelectList: [],
      supplierList: [],
      managerList: []
    }
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 1:
          return '启用'
        case 2:
          return '禁用'
      }
    }
  },
  computed: {
    listType() {
      if (this.copyForm.statisticalObject === '1' && this.copyForm.dataDimension === '1') {
        // 服务商+处理次数
        return 1
      } else if (this.copyForm.statisticalObject === '1' && this.copyForm.dataDimension === '2') {
        // 服务商+处理时长
        return 2
      } else if (this.copyForm.statisticalObject === '2' && this.copyForm.dataDimension === '1') {
        // 税务经理+处理次数
        return 3
      } else if (this.copyForm.statisticalObject === '2' && this.copyForm.dataDimension === '2') {
        // 税务经理+处理时长
        return 4
      }
    }
  },
  mounted() {
    this.copyForm = {...this.form}
    this.getList()
    this._getCountrySelectList()
    this.getSuppliers()
    this.getManagerList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      serviceDeliveryDataList(this.form).then(res => {
        this.total = parseInt(res.data.total)
        this.tableLoading = false
        this.copyForm = {...this.form}
        this.list = res.data.records
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
        functionCodes: this.businessTypeList.find(item => item.value === this.form.businessType).code,
        countryCode: this.form.countryCode
      }).then(res => {
        this.supplierList = res.data.records
      })
    },
    // 获取税务经理列表
    getManagerList() {
      let codeList = this.businessTypeList.find(item => item.value === this.form.businessType).code
      getDisposelist({
        functionCode: codeList[0],
        functionCodes: codeList,
      }).then(res => {
        this.managerList = res.data;
      });
    },
    changeSupplier() {
      this.getSuppliers()
      this.getManagerList()
      this.form.supplierId = ''
      this.form.disposeId = ''
    },
    changeListType() {
      if(!(this.form.dataDimension === '2' && this.form.statisticalObject === '2')) {
        this.form.serviceNo = ''
      }
      if(this.form.statisticalObject !== '2') {
        this.form.disposeId = ''
      }
      if(this.form.dataDimension === '2' && this.form.statisticalObject === '2') {
        this.form.supplierId = ''
      }
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
      if(this.total) {
        this.$confirm(`当前选择${this.total}条数据 ，是否确认导出？`, "数据导出", {
          customClass: "custom-confirm",
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: "warning",
          center: true
        }).then(() => {
          this.exportLoading = true
          excelList(this.copyForm).then(res => {
            this.exportLoading = false
            this.$util.exportExcel(res, 'VAT交付数据')
          }).catch(e => {
            this.exportLoading = false
          })
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/fixedSearch.scss";
</style>