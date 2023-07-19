<template>
  <div class="app-container" v-loading="exportLoading" element-loading-text="正在生成导出数据">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" :rules="rules" inline label-width="80px">
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
              <el-button size="small" type="primary" :disabled="exportLoading" @click="_export" class="yellow-btn" v-show="hasAuthority('E1_35')">
                <i class="icon icon-export"></i>
                <span>律师结算数据导出</span>
              </el-button>
            </div>
          </el-form-item>
          <div class="more-search" v-show="moreSerch">
            <el-form-item label="业务类型" prop="businessType">
              <el-select style="width: 168px" v-model="form.businessType" size="small" filterable placeholder="请选择业务类型" @change="typeChange">
                <el-option v-for="item in workOrderTypeList" :key="item.value" :label="item.type" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select style="width: 168px" v-model="form.nodeCodeOrStatus" size="small" filterable placeholder="请选择工单状态" value-key="nodeServiceProgressName">
                <el-option label="全部工单状态" value=""></el-option>
                <span v-if="form.businessType === '1'">
                  <el-option v-for="(item, index) in nodeCodeList" :key="index" :label="item.nodeServiceProgressName" :value="item"></el-option>
                </span>
                <span v-if="form.businessType === '2'">
                  <el-option v-for="item in oaStatusList" :key="item.order" :label="item.statusDesc" :value="item.order"></el-option>
                </span>
                <span v-if="form.businessType === '3'">
                  <el-option v-for="item in simpleStatusList" :key="item.progressBar" :label="item.progressBarName" :value="item.progressBar"></el-option>
                </span>
              </el-select>
              <el-select style="width: 200px" v-model="timeType" size="small" placeholder="请先选择业务类型" @change="typeChange">
                <el-option v-if="['1', '11'].includes(timeType)" label="商标受理号录入时间" value="1"></el-option>
                <el-option v-if="['1', '11'].includes(timeType)" label="注册完成时间" value="11"></el-option>
                <template v-for="item in workOrderTypeList">
                  <el-option v-if="item.value != 1" :key="item.value" :label="item.timeTitle" :value="item.value" disabled></el-option>
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
            <el-form-item label="律师信息">
              <el-select style="width: 168px" size="small" clearable v-model="form.attorneyId" filterable @change="getService">
                <el-option v-for="item in layerList" :key="item.id" :value="item.id" :label="item.shortName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务状态">
              <el-select style="width: 168px" size="small" clearable v-model="form.serviceStatus">
                <el-option :label="item.label" :value="item.value" v-for="item in statusList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
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
            <div>请选择需要进行律师结算业务</div>
          </template>
          <template v-else-if="emptyTextType === 2">
            <div>暂未查询到相关数据，请确认筛选条件</div>
          </template>
        </div>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="所属企业" prop="enterpriseName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="收款主体" prop="openAccountName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="销售订单号" prop="orderNo"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="服务号" prop="serviceNo"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="商品名称" prop="serviceName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="商品规格" prop="skuAttributeTypeName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="订单总额" prop="orderAmountMoney"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="优惠金额" prop="orderDiscountMoney"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="服务实付金额" prop="amountMoney"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="业务类型" prop="businessTypeName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="国家" prop="countryNameZh"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="申请人信息" prop="applyName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="商标名称" prop="trademarkNameEn"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="商标类型" prop="trademarkTypeName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="受理号" prop="acceptNum"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="受理日期" prop="acceptTime"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="律师简称" prop="attorneyName"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="律师编码" prop="attorneyCode"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip :label="tableTimeTitle" prop="dataTime"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="工单状态" prop="serviceProgressStr"></el-table-column>
        <el-table-column align="center" min-width="150" show-overflow-tooltip label="服务状态" prop="serviceStatusStr"></el-table-column>
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
import { getLawyerList } from '@/api/newApi/supplyChain/lawyerManage.js';
import { getFirm, getCountrySelectList, getFunctionCode } from '@/api/newApi/common.js';
import { productInfoList } from '@/api/newApi/manuelorder/addOrder.js';
import { getCollectList, exportExcel } from '@/api/newApi/supplyChain/trademarkSettlement.js';
import { getAllServiceProgressAPI } from '@/api/newApi/intellectualProperty/trademark';
import { oaStatusListAPI } from '@/api/newApi/intellectualProperty/oa';
import { getSimpleWorkOrderList } from '@/api/newApi/simpleWorkOrder/otherService.js';
import cacheQuery from '@/mixins/cacheQuery';
import { settlementcenterSupplierList } from '@/api/newApi/workOrder/processConfiguration';
export default {
  data() {
    return {
      isResouceShow: 0,
      // 分页
      total: 0,
      form: {
        enterpriseIdList: [],
        businessType: '',
        nodeCodeOrStatus: '',
        nodeCode: '',
        progressBar: '',
        oaStatus: '',
        countryCode: '',
        productSkuId: '',
        attorneyId: '',
        serviceStatus: '',
        limit: 20,
        page: 1,
        completeTime: [],
      },
      rules: {
        enterpriseIdList: [{ required: true, message: '请选择所属企业', trigger: 'change' }],
        businessType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
      },
      cacheKey: 'form',
      copyListQuery: {},
      // 导出数据
      copyForm: {},
      tableLoading: false,
      exportLoading: false,
      //数据
      list: [],
      countrySelectList: [],
      functionCode: [],
      serviceList: [],
      firmList: [],
      layerList: [],
      statusList: [
        { label: '服务中', value: 1 },
        // {label: '待续费', value: 2},
        // {label: '税号注销', value: 3},
        // {label: '已转出', value: 4},
        { label: '已取消', value: 9 },
        { label: '封存', value: 10 },
        { label: '取消中', value: 11 },
      ],
      nodeCodeList: [],
      oaStatusList: [],
      simpleStatusList: [],
      workOrderTypeList: [
        { value: '1', completeTimeKey: 'accept', type: '商标注册', timeTitle: '商标受理号录入时间', tableTimeTitle: '商标受理号录入时间' },
        { value: '2', completeTimeKey: 'oaAttorneyCheck', type: 'OA文件', timeTitle: 'OA文件律师审核通过时间', tableTimeTitle: '律师审核通过时间' },
        { value: '3', completeTimeKey: 'simpleWorkOrder', type: '极简工单(其他服务)', timeTitle: '极简工单处理完成时间', tableTimeTitle: '极简工单处理完成时间' },
      ],
      searchFlag: false,
      timeType: '',
    };
  },
  mixins: [cacheQuery],
  computed: {
    emptyTextType() {
      if (!this.copyForm.businessType || !this.copyForm.enterpriseIdList || !this.copyForm.enterpriseIdList.length) {
        return 1;
      } else {
        return 2;
      }
    },
    tableTimeTitle() {
      let type = this.workOrderTypeList.find((item) => item.value === this.copyForm.businessType);
      if (this.timeType == '11') {
        return '注册完成时间';
      }
      return type ? type.tableTimeTitle : '请选择业务类型';
    },
  },
  watch: {
    'form.businessType'(newVal) {
      if (newVal) {
        this.nodeCodeOrStatusChange();
      } else {
        this.nodeCodeList = [];
        this.oaStatusList = [];
        this.simpleStatusList = [];
      }
    },
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    if (this.form.countryCode) {
      this.getService();
    }
    this.getPageCache();
    if (this.form.businessType) {
      this.timeType = this.form.businessType;
    }
    this.getfirmList();
    this._getCountrySelectList();
    this._getLawyerList();
  },
  methods: {
    //切换业务类型
    typeChange(val) {
      this.timeType = val;
    },
    getList() {
      this.tableLoading = true;
      let item = this.workOrderTypeList.find((item) => item.value === this.form.businessType);
      if (item) {
        this.workOrderTypeList.forEach((item) => {
          this.form[item.completeTimeKey + 'TimeStart'] = '';
          this.form[item.completeTimeKey + 'TimeEnd'] = '';
        });
        this.form.simpleWorkOrderTimeStart = '';
        this.form.simpleWorkOrderTimeEnd = '';
        if (this.timeType == '11') {
          [this.form.simpleWorkOrderTimeStart, this.form.simpleWorkOrderTimeEnd] = this.form.completeTime && this.form.completeTime.length ? this.form.completeTime : ['', ''];
        } else {
          let timeKey = item.completeTimeKey;
          [this.form[timeKey + 'TimeStart'], this.form[timeKey + 'TimeEnd']] = this.form.completeTime && this.form.completeTime.length ? this.form.completeTime : ['', ''];
        }
      }
      let { nodeCodeOrStatus, completeTime, ...formData } = this.form;
      if (formData.businessType === '1') {
        formData.nodeCode = nodeCodeOrStatus.nodeCode;
        formData.progressBar = nodeCodeOrStatus.nodeServiceProgress;
      } else if (formData.businessType === '2') {
        formData.oaStatus = nodeCodeOrStatus;
      } else if (formData.businessType === '3') {
        formData.progressBar = nodeCodeOrStatus;
      }
      this.setPageCache();
      getCollectList(this.$util.removePropertyOfNull(formData))
        .then((res) => {
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
    nodeCodeOrStatusChange() {
      this.form.nodeCodeOrStatus = '';
      this.form.nodeCode = '';
      this.form.progressBar = '';
      this.form.oaStatus = '';
      if (this.form.businessType === '1') {
        getAllServiceProgressAPI({
          functionCode: 61,
        }).then((res) => {
          if (res.code === 0) {
            this.nodeCodeList = res.data;
          }
        });
      } else if (this.form.businessType === '2') {
        oaStatusListAPI().then((res) => {
          if (res.code === 0) {
            this.oaStatusList = res.data;
          }
        });
      } else if (this.form.businessType === '3') {
        getSimpleWorkOrderList().then((res) => {
          if (res.code === 0) {
            this.simpleStatusList = res.data.statistics;
          }
        });
      }
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
    // 获取服务分类
    _getFunctionCode() {
      getFunctionCode().then((res) => {
        this.functionCode = res.data;
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
    // 商品信息
    getService() {
      this.form.productSkuId = '';
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
    /**
     * 获取默认图片 优先pc端
     */
    getImgSrc(pcImg, mobileImg) {
      let img1 = !pcImg || pcImg.length == 0 ? [] : JSON.parse(pcImg);
      let img2 = !mobileImg || mobileImg.length == 0 ? [] : JSON.parse(mobileImg);
      return (img1.length == 0 ? false : img1[0].imgUrl) || (img2.length == 0 ? '' : img2[0].imgUrl);
    },
    // 获取律师列表
    _getLawyerList() {
      settlementcenterSupplierList({
        status: 1,
      }).then((res) => {
        this.layerList = res.data;
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
      exportExcel(this.$util.removePropertyOfNull(this.copyForm))
        .then((res) => {
          this.exportLoading = false;
          this.$message.success('数据导出完成');
          this.$util.exportExcel(res, '商标律师结算信息');
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
