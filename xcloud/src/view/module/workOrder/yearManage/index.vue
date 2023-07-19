<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <div
        :class="{
          'search-aera': true,
          'search-on': moreSerch,
          'search-off': !moreSerch,
        }"
      >
        <div class="search-box">
          <el-form ref="searchForm" inline label-width="110px">
            <el-form-item label="公司中文名称">
              <el-input v-model="pageData.companyNameZh" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="公司英文名称">
              <el-input v-model="pageData.companyNameEn" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 5px">
              <el-button type="primary" @click="handleSubmit" icon="el-icon-search">搜索</el-button>
              <el-button type="default" @click="handleReset" icon="el-icon-refresh">重置</el-button>
              <el-button type="text" @click="handleMoreSearch">
                <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
                {{ moreSerch ? '收起' : '更多' }}筛选
              </el-button>
              <el-dropdown @command="(c) => this[c]()" style="margin-left: 20px">
                <el-button type="primary">功能按钮<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="sendMessage">短信提醒</el-dropdown-item>
                  <!-- TODO hasAuthority -->
                  <!-- <el-dropdown-item command="batchDownload" v-if="searchData.status === '27'" v-show="hasAuthority('SQ_1')">下载回执</el-dropdown-item> -->
                  <!-- TODO hasAuthority -->
                  <!-- <el-dropdown-item command="batchUploadReceipt" v-if="searchData.status === '21'" v-show="hasAuthority('SQ_1')">上传申报回执</el-dropdown-item> -->
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
            <el-form-item style="float: right">
              <el-link type="primary" :underline="false" @click="toUploadAndDownloadRecords">上传/下载中心</el-link>
              <!-- <Button type="primary" style="float: right; margin-right: 8px; margin-left: 10px" @click="sendMessage">短信提醒</Button> -->
            </el-form-item>
            <div class="more-search" v-show="moreSerch">
              <el-form-item label="服务进度">
                <el-select style="width: 150px" v-model="pageData.status" clearable placeholder="请选择" filterable>
                  <el-option :value="key" :label="item" v-for="(item, key, index) in statusList" :key="index"></el-option>
                </el-select>
                <el-form-item label="税号">
                  <el-input v-model="pageData.vatTaxNum" placeholder="请输入"></el-input>
                </el-form-item>
              </el-form-item>
              <el-form-item label="年度申报时间">
                <el-date-picker style="width: 160px" v-model="pageData.year" type="year" placeholder="请选择"></el-date-picker>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="table-container">
      <el-table :data="annalsDeData" border v-loading="listLoading" @selection-change="handleSelectionChange" :height="tableHeight" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column align="center" label="年度申报时间(年)" sortable>
          <template slot-scope="{ row }">{{ row.year }}</template>
        </el-table-column>
        <el-table-column align="center" label="公司名称" prop="supplierId">
          <template slot-scope="{ row }">{{ row.companyNameZh }}</template>
        </el-table-column>
        <el-table-column align="center" label="国家">
          <template slot-scope="{ row }">{{ row.countryNameZh }}</template>
        </el-table-column>
        <el-table-column align="center" label="业务名称">
          <template slot-scope="{ row }">{{ row.productFunctionCode == 2 ? '转代理+申报' : '注册+申报' }}</template>
        </el-table-column>
        <el-table-column align="center" label="年度申报区间" sortable>
          <template slot-scope="{ row }">{{ row.corridor }}</template>
        </el-table-column>
        <!-- <el-table-column align="center" label="审核状态">
          <template slot-scope="{ row }">{{ auditStatusList[row.auditStatus] }}</template>
        </el-table-column> -->
        <el-table-column align="center" label="进度">
          <template slot-scope="{ row }">{{ statusList[row.status] }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150" fixed="right">
          <template slot-scope="{ row }">
            <el-tooltip effect="dark" content="查看详情" placement="top" v-if="hasAuthority('R1_1')">
              <el-link type="primary" :underline="false" @click="getDEyearDetailFun(row)" class="icon icon-see"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="线下申报" placement="top" v-if="row.status == 21 && (row.countryCode == 'DE' || row.countryCode == 'GB') && hasAuthority('R1_6')">
              <el-link type="primary" :underline="false" @click="onlineDeclare(row)">
                <img src="@/assets/images/iipto-common/offlineDeclare.svg" />
              </el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="提交申报" placement="top" v-if="row.status == 21" v-show="hasAuthority('R1_2')">
              <el-link type="primary" :underline="false" @click="goAnnalsDE(row)" class="icon icon-submitted"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看回执" placement="top" v-if="row.status == 27 && row.declareReceipt != '' && !row.declMethod" v-show="hasAuthority('R1_3')">
              <el-link type="primary" :underline="false" class="icon icon-receipt" target="_blank" :href="row.declareReceipt"></el-link>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看回执" placement="top" v-if="row.status == 27 && row.declareReceipt != '' && row.declMethod" v-show="hasAuthority('R1_3')">
              <el-link type="primary" :underline="false" class="icon icon-receipt" target="_blank" @click="showDeclareReceipt(row)"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="changePageSize" @current-change="registerChangePageHandler" :current-page.sync="pageData.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="pageData.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <OfflineDeclareDialog :isYearManage="true" :id="id" :offlineDeclareDialog.sync="offlineDeclareDialog" :getserviceDetail="getDEannals" />
    <ShowReceiptDialog :showReceiptImgModel.sync="showReceiptImgModel" :imglist="imglist" />
    <BatchDownloadDialog :batchDownloadDialog.sync="batchDownloadDialog" :selectionList="selectionList" />
    <BatchUploadReceiptDialog :batchUploadReceiptDialog.sync="batchUploadReceiptDialog" :selectionList="selectionList" />
  </div>
</template>

<script>
import { getOrderYearListAPI, OrderYearDetailAPI, taxWorkOrderYearTaxYearSms } from '@/api/newApi/workOrder/annualReport';
import annalsDE from './components/annalsDE.vue';
import OfflineDeclareDialog from '@/view/module/newTaxServices/taxNumDeclare/components/offlineDeclareDialog';
import ShowReceiptDialog from './components/showReceiptDialog';
import * as comps from './components/index.js';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  components: {
    annalsDE,
    OfflineDeclareDialog,
    ShowReceiptDialog,
    ...comps,
  },
  data() {
    return {
      dataDeclare: {},
      moreSerch: false,
      discountBox: false,
      listLoading: false,
      searchFlag: false,
      offlineDeclareDialog: false,
      showReceiptImgModel: false,
      imglist: [],
      deAnnalsColumns: [
        {
          title: '申报周期',
          align: 'center',
          render(h, params) {
            let declarePeriod = params.row.declarePeriod;
            return h('span', declarePeriod == 0 ? '月报' : declarePeriod == 1 ? '季报' : declarePeriod == 2 ? '年报' : '');
          },
        },
        {
          title: '申报月份/季度',
          align: 'center',
          render(h, params) {
            let beginTime = params.row.beginTime.slice(0, 7);
            let endTime = params.row.endTime.slice(0, 7);
            return h('span', beginTime + '至' + endTime);
          },
        },
        {
          title: '不含税销售额（欧元）',
          align: 'center',
          key: 'excludeTaxPrice',
        },
        {
          title: '缴税金额（欧元）',
          align: 'center',
          key: 'allTaxPrice',
        },
        {
          title: '抵扣金额（选填）',
          align: 'center',
          slot: 'fillDiscount',
        },
        {
          title: '税率',
          align: 'center',
          render(h, params) {
            return h('span', params.row.taxRate + '%');
          },
        },
        {
          title: '申报回执',
          align: 'center',
          slot: 'declareReceipt',
        },
        {
          title: '缴费凭证',
          align: 'center',
          slot: 'payReceipt',
        },
      ],
      showDEannals: false,
      workId: '',
      id: '',
      baseDataDe: {},
      annalsDeData: [],
      detailsReturnData: {},
      pageData: {
        auditStatus: '',
        countryCode: '',
        status: '',
        year: '',
        // inputStr: "",
        companyNameZh: '',
        companyNameEn: '',
        vatTaxNum: '',
        page: 1,
        limit: 20,
      },
      searchData: {},
      cacheKey: 'pageData',
      copyListQuery: {},
      total: 0,
      serviceId: '',
      deYearDetail: false,
      deAnnalsData: [],
      thatDEinfo: {},
      auditStatusList: {
        0: '未审核',
        1: '已审核',
        // 2: "被驳回",
      },
      statusList: {
        21: '待提交申报',
        27: '申报完成',
      },
      selectionList: [],
      batchDownloadDialog: false,
      batchUploadReceiptDialog: false,
    };
  },
  mixins: [cacheQuery],
  methods: {
    /**拼接选中的ID */
    splicingSelectionIds(list) {
      let str = '';
      list.forEach((element, index) => {
        str += element.id + (index == list.length - 1 ? '' : ',');
      });
      return str;
    },
    showDeclareReceipt(row) {
      this.imglist = row.declareReceipt.split(',');
      this.showReceiptImgModel = true;
    },
    /**勾选条件判断 并返回 选中的ID */
    setMsgWorkID() {
      let result = !this.selectionList || this.selectionList.length == 0 ? '' : this.selectionList.find((item) => item.status != 21) ? this.$message({ type: 'error', message: '服务进度不一致，仅支持给带提交申报工单发送短信' }) : this.splicingSelectionIds(this.selectionList);

      if (typeof result !== 'object') return result;
    },
    onlineDeclare(row) {
      this.id = row.id;
      this.offlineDeclareDialog = true;
    },
    async sendMessage() {
      let workIds = this.setMsgWorkID();
      if (workIds === undefined) return;
      let { code } = await taxWorkOrderYearTaxYearSms(!workIds ? {} : { workIds });
      if (code == 0) this.$message({ type: 'success', message: '短信成功已发送' });
    },
    handleReset() {
      this.pageData = { ...this.copyListQuery };
      this.removePageCache();
    },
    handleSubmit() {
      this.searchFlag = true;
      this.pageData.page = 1;
      this.pageData.limit = 10;
      if (typeof this.pageData.year === 'object' && this.pageData.year) {
        this.pageData.year = this.pageData.year.getFullYear() + '';
      }
      this.getDEannals();
    },

    //获取德国年报工单详情
    getDEyearDetailFun(row) {
      this.$router.push({
        path: '/workOrder/yearManage/deYearDetail',
        name: 'deYearDetail',
        query: {
          id: row.id,
          year: row.year,
          beginTime: row.beginTime.slice(0, 7),
          endTime: row.endTime.slice(0, 7),
          declareReceipt: row.declareReceipt,
          companyNameEn: row.companyNameEn,
          companyNameZh: row.companyNameZh,
          vatTaxNumber: row.vatTaxNumber,
          declMethod: row.declMethod ? '1' : '0',
          sellOfflineFile: row.sellOfflineFile,
        },
      });
    },
    registerChangePageHandler(page) {
      this.pageData.page = page;
      this.getDEannals();
    },
    changePageSize(val) {
      this.pageData.limit = val;
      this.getDEannals();
    },
    goBack() {
      this.showDEannals = false;
      this.getDEannals();
    },
    getDEannals() {
      this.listLoading = true;
      this.setPageCache();
      getOrderYearListAPI(this.pageData)
        .then((res) => {
          if (res.code === 0) {
            this.listLoading = false;
            this.annalsDeData = res.data.records;
            this.total = res.data.total - 0;
            this.searchData = { ...this.pageData };
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.total}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }
          }
        })
        .catch((err) => {
          this.listLoading = false;
          this.searchFlag = false;
        });
    },

    handleSelectionChange(val) {
      this.selectionList = val;
    },
    goAnnalsDE(row, type) {
      this.showDEannals = true;
      this.workId = row.id;
      this.serviceId = row.serviceId;
      let beginTime = '';
      if (row.productFunctionCode == 5 || (row.productFunctionCode == 2 && row.beginTime)) {
        beginTime = row.beginTime.slice(0, 7);
      }
      let endTime = row.endTime.slice(0, 7);
      this.baseDataDe = {
        companyName: row.companyNameZh,
        companyNameEn: row.companyNameEn,
        vatTaxNumber: row.vatTaxNumber,
        year: row.year,
        time: beginTime + '至' + endTime,
        beginTime: beginTime,
        endTime: endTime,
        productFunctionCode: row.productFunctionCode,
        declareReceipt: row.declareReceipt,
      };
      this.detailsReturnData = {
        excludeTaxPrice: row.excludeTaxPrice,
        deductionPrice: row.deductionPrice,
        allTaxPrice: row.allTaxPrice,
        paidTaxPrice: row.paidTaxPrice || 0, //实缴金额累计
        otherEcAcqPrice: row.otherEcAcqPrice || 0, //【欧盟内免税收购项(递延清关)累计】
        agentAmt: row.agentAmt || 0, //【平台代扣代缴金额累计】
      };
      this.$router.push({
        path: '/workOrder/yearManage/components/annalsDE',
        name: 'annalsDE',
        query: {
          workId: row.id,
          serviceId: row.serviceId,
          baseDataDe: JSON.stringify(this.baseDataDe),
          // detailsReturnData: this.detailsReturnData,
        },
      });
    },
    batchDownload() {
      if (!this.selectionList.length) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      this.batchDownloadDialog = true;
    },
    batchUploadReceipt() {
      this.batchUploadReceiptDialog = true;
    },
    toUploadAndDownloadRecords() {
      this.$router.push({
        path: '/workOrder/uploadAndDownloadRecords',
      });
    },
  },
  created() {
    this.copyListQuery = { ...this.pageData };
    this.getPageCache();
    this.getDEannals();
  },
};
</script>

<style scoped lang="scss"></style>
