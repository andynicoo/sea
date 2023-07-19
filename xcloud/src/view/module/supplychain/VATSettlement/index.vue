<template>
  <div class="app-container" v-loading="exportLoading" element-loading-text="正在生成导出数据">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" :rules="rules" inline label-width="90px">
          <el-form-item label="所属企业" prop="enterpriseIdList">
            <el-select style="width: 168px" v-model="form.enterpriseIdList" size="small" filterable placeholder="请选择所属企业" @change="firmChange" multiple>
              <el-option v-for="(item, index) in firmList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button icon="el-icon-refresh" @click="reset" size="small"> 重置 </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <div class="header-btn-group">
              <el-button size="small" type="primary" :disabled="exportLoading" @click="_export" class="yellow-btn" v-show="hasAuthority('E1_36')">
                <i class="icon icon-export"></i>
                <span>服务商结算数据导出</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="业务类型" prop="productFunctionCode">
              <el-select style="width: 168px" v-model="form.productFunctionCode" size="small" filterable placeholder="请选择业务类型" @change="typeChange">
                <el-option v-for="item in workOrderTypeList" :key="item.value" :label="item.type" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select style="width: 168px" v-model="form.cureentNodeCode" size="small" filterable placeholder="请选择工单状态">
                <el-option label="全部工单状态" value=""></el-option>
                <el-option v-for="item in nodeCodeList" :key="item.nodeCode" :label="item.nodeName" :value="item.nodeCode"></el-option>
              </el-select>
              <el-select style="width: 190px" v-model="timeType" size="small" placeholder="请先选择业务类型" @change="typeChange">
                <el-option v-if="['31', '311'].includes(timeType)" label="EPR服务完成时间" value="31"></el-option>
                <el-option v-if="['31', '311'].includes(timeType)" label="提交服务商时间" value="311"></el-option>
                <template v-for="item in workOrderTypeList">
                  <el-option v-if="item.value != 31" :key="item.value" :label="item.timeTitle" :value="item.value" disabled></el-option>
                </template>
              </el-select>
              <el-date-picker v-model="form.completeTime" type="daterange" align="right" size="small" clearable unlink-panels start-placeholder="开始时间" end-placeholder="结束时间" range-separator="到" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" style="width: 340px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="国家">
              <el-select style="width: 168px" size="small" clearable v-model="form.countryCode" filterable @change="countryChange">
                <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品信息">
              <el-cascader v-model="form.productSkuId" :key="isResouceShow" :options="serviceList" :props="{ expandTrigger: 'hover', emitPath: false }" clearable filterable style="width: 168px"></el-cascader>
            </el-form-item>
            <el-form-item label="服务商信息">
              <el-select style="width: 168px" size="small" clearable v-model="form.supplierId" filterable>
                <el-option v-for="item in supplierList" :key="item.id" :value="item.id" :label="item.shortName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务状态">
              <el-select style="width: 168px" size="small" clearable v-model="form.status">
                <el-option :label="item.label" :value="item.value" v-for="item in statusList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-tooltip content="请输入多个税号信息，回车换行进行多个税号查询" placement="top">
              <el-form-item label="税号信息" prop="vatNumber">
                <el-input v-model="form.vatNumber" placeholder="请输入" type="textarea" clearable style="width: 228px" size="small" />
              </el-form-item>
            </el-tooltip>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="list" v-loading="tableLoading" :height="tableHeight" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <div slot="empty">
          <i class="icon icon-empty"></i>
          <template v-if="emptyTextType === 1">
            <div>暂无数据信息</div>
            <div>请选择需要进行服务商结算业务</div>
          </template>
          <template v-else-if="emptyTextType === 2">
            <div>暂未查询到相关数据，请确认筛选条件</div>
          </template>
        </div>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="所属企业" prop="enterpriseName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="销售订单号" prop="orderNo"></el-table-column>
        <el-table-column align="center" min-width="200" show-overflow-tooltip label="服务号" prop="serviceNo"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="商品名称" prop="productName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="订单总额" prop="orderAmountMoney"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="优惠金额" prop="orderDiscountMoney"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="服务实付金额" prop="amountMoney"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="业务类型" prop="serviceName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="国家" prop="countryNameZh"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="公司中文名称" prop="companyNameZh"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="公司英文名称" prop="companyNameEn"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="税号" prop="vatTaxNumber"></el-table-column>
        <!-- <el-table-column align="center" min-width="150" show-overflow-tooltip label="VAT下号/下证日期" prop="taxIssueDate"></el-table-column> -->
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="服务商" prop="supplierName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="服务商编码" prop="supplierAssignsServiceId"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip :label="tableTimeTitle" prop="supplierCompleteTime"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="工单状态" prop="nodeName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="服务状态" prop="serviceStatus"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="订单归属人" prop="attributionName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="下单时间" prop="orderCreateTime"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="备注" prop="orderRemark"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>
<script>
import { getSupplierList } from '@/api/newApi/supplyChain/serviceproviderManage.js';
import { getFirm, getCountrySelectList } from '@/api/newApi/common.js';
import { productInfoList } from '@/api/newApi/manuelorder/addOrder.js';
import { getVatList, exportExcel } from '@/api/newApi/supplyChain/VATSettlement.js';
import { findNodes } from '@/api/newApi/processFields/processConfig';
import cacheQuery from '@/mixins/cacheQuery';
import { getSimpleWorkOrderList } from '@/api/newApi/simpleWorkOrder/otherService.js';
import { settlementcenterSupplierList } from '@/api/newApi/workOrder/processConfiguration';
export default {
  data() {
    return {
      isResouceShow: 0,
      // 分页
      total: 0,
      form: {
        enterpriseIdList: [],
        productFunctionCode: '',
        cureentNodeCode: '',
        completeTime: [],
        countryCode: '',
        productSkuId: '',
        supplierId: '',
        status: '',
        vatNumber: '',
        limit: 20,
        page: 1,
      },
      rules: {
        enterpriseIdList: [{ required: true, message: '请选择所属企业', trigger: 'change' }],
        productFunctionCode: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
      },
      cacheKey: 'form',
      copyListQuery: {},
      copyForm: {},
      tableLoading: false,
      exportLoading: false,
      //数据
      list: [],
      countrySelectList: [],
      functionCode: [],
      serviceList: [],
      firmList: [],
      supplierList: [],
      statusList: [
        { label: '服务中', value: 1 },
        { label: '待续费', value: 2 },
        { label: '税号注销', value: 3 },
        { label: '已转出', value: 4 },
        { label: '已取消', value: 9 },
        { label: '封存', value: 10 },
        { label: '取消中', value: 11 },
      ],
      workOrderTypeList: [
        { value: '5', type: 'VAT注册', timeTitle: '注册税号下发时间' },
        { value: '2', type: 'VAT转代理', timeTitle: '转代理完成时间' },
        { value: '6', type: '税号注销', timeTitle: '税号注销完成时间' },
        { value: '7', type: '税务稽查', timeTitle: '税务稽查完成时间' },
        { value: '24', type: 'VAT退税', timeTitle: '退税完成时间' },
        { value: '31', type: 'EPR注册', timeTitle: 'EPR服务完成时间' },
        { value: '16', type: '英代/欧代', timeTitle: '协议生效时间' },
        { value: '20', type: '极简工单(其他服务)', timeTitle: '极简工单处理完成时间' },
        { value: '13', type: '海牙认证', timeTitle: '海牙认证完成时间' },
      ],
      simpleNodeList: [
        { nodeCode: '1', nodeName: '待处理' },
        { nodeCode: '2', nodeName: '处理中' },
        { nodeCode: '3', nodeName: '处理完成' },
        { nodeCode: '4', nodeName: '已取消' },
      ],
      nodeCodeList: [],
      searchFlag: false,
      timeType: '',
    };
  },
  mixins: [cacheQuery],
  computed: {
    emptyTextType() {
      if (!this.copyForm.productFunctionCode || !this.copyForm.enterpriseIdList || !this.copyForm.enterpriseIdList.length) {
        return 1;
      } else {
        return 2;
      }
    },
    tableTimeTitle() {
      let type = this.workOrderTypeList.find((item) => item.value === this.copyForm.productFunctionCode);
      if (this.timeType == '311') {
        return '提交服务商时间';
      }
      return type ? type.timeTitle : '请选择业务类型';
    },
  },
  watch: {
    'form.productFunctionCode'(newVal) {
      this.form.cureentNodeCode = '';
      this.nodeCodeList = [];
      if (newVal && newVal !== '20') {
        this.getNodeCodeList();
      } else if (newVal === '20') {
        getSimpleWorkOrderList().then((res) => {
          if (res.code === 0) {
            this.nodeCodeList = res.data.statistics.map((item) => ({
              nodeCode: item.progressBar,
              nodeName: item.progressBarName,
            }));
          }
        });
      }
    },
  },
  created() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    if (this.form.countryCode) {
      this.getService();
    }
    if (this.form.productFunctionCode) {
      this.timeType = this.form.productFunctionCode;
    }
    this.getfirmList();
    this._getCountrySelectList();
    this._getSupplierList();
  },
  methods: {
    //切换业务类型
    typeChange(val) {
      this.timeType = val;
    },
    getList() {
      this.tableLoading = true;
      this.form.startTime = '';
      this.form.endTime = '';
      this.form.submitServiceStartTime = '';
      this.form.submitServiceEndTime = '';
      if (this.timeType == '311') {
        [this.form.submitServiceStartTime, this.form.submitServiceEndTime] = this.form.completeTime && this.form.completeTime.length ? this.form.completeTime : ['', ''];
      } else {
        [this.form.startTime, this.form.endTime] = this.form.completeTime && this.form.completeTime.length ? this.form.completeTime : ['', ''];
      }
      let { completeTime, ...formData } = this.form;
      this.setPageCache();
      getVatList(this.$util.removePropertyOfNull(formData))
        .then((res) => {
          // 如果是极简工单，工单状态名要转换
          if (this.form.productFunctionCode === '20') {
            res.data.records.forEach((item) => {
              let node = this.nodeCodeList.find((n) => `${n.nodeCode}` === item.nodeName);
              item.nodeName = node ? node.nodeName : item.nodeName;
            });
          }
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          this.copyForm = { ...formData };
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
        });
    },
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
    // 更改企业
    firmChange() {},
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    // 修改国家
    countryChange() {
      this.form.productSkuId = '';
      this.$nextTick(() => {
        this.serviceList = [];
      });
      if (this.form.countryCode) {
        this.getService();
      }
    },
    getNodeCodeList() {
      findNodes({
        functionCode: this.form.productFunctionCode,
      }).then((res) => {
        if (res.code == 0) {
          this.nodeCodeList = res.data;
        }
      });
    },
    // 商品信息
    getService() {
      this.form.skuId = '';
      this.serviceList = [];
      this.isResouceShow++;
      productInfoList({
        size: 999,
        current: 1,
        productStatus: 'PENDED_PUBLISH',
        countryCode: this.form.countryCode,
        enterpriseId: this.form.enterpriseIdList[0],
      })
        .then((res) => {
          if (res.code == 0) {
            let data = res.data.records;
            this.serviceList = data.map((item) => {
              let specsAll = [];
              if (item.productInfoDTOList.length) {
                item.productInfoDTOList.forEach((goods) => {
                  specsAll.push(...this.goodsHandle(goods));
                });
              } else {
                specsAll.push(...this.goodsHandle(item));
              }
              return {
                label: item.productName,
                value: item.id,
                children: specsAll,
              };
            });
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    //处理商品数据
    goodsHandle(goods) {
      let specArray = [];
      goods.productSpecsDTOList.forEach((spec) => {
        specArray.push({ label: spec.specsName, value: spec.id });
      });
      return specArray;
    },
    // 获取服务商列表
    _getSupplierList() {
      settlementcenterSupplierList({
        status: 1,
      }).then((res) => {
        this.supplierList = res.data;
      });
    },
    search() {
      // 所属企业、业务类型必传
      // if(this.emptyTextType === 1) {
      //   return
      // }
      this.$refs.searchForm.validate((valid) => {
        if (valid) {
          this.searchFlag = true;
          this.form.page = 1;
          this.getList();
        } else {
          this.$message.warning('所属企业、业务类型必选');
        }
      });
    },
    reset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
      this.list = [];
      this.countryChange();
    },
    _export() {
      // 所属企业、业务类型必传
      if (this.emptyTextType === 1) {
        this.$message.warning('所属企业、业务类型必选');
        return;
      } else if (!this.form.completeTime || !this.form.completeTime.length) {
        this.$message.warning('请先选择时间范围，再进行数据导出');
        return;
      } else if (this.$util.isOverYear(this.form.completeTime)) {
        this.$message.warning('最多可导出一年内的数据');
        return;
      }
      this.exportLoading = true;
      let data = {
        ...this.$util.removePropertyOfNull(this.copyForm),
        page: -1,
        limit: -1,
      };
      exportExcel(data)
        .then((res) => {
          this.exportLoading = false;
          this.$message.success('数据导出完成');
          this.$util.exportExcel(res, 'VAT服务商结算信息');
        })
        .catch((e) => {
          this.exportLoading = false;
          this.$message.error('数据导出失败');
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
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/fixedSearch.scss';
::v-deep .el-table__empty-text {
  line-height: 30px;
}
</style>
