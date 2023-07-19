<template>
  <div>
    <!-- 表格 -->
    <div class="table-container">
      <el-tabs ref="elTabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="-1"></el-tab-pane>
        <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.nodeName" :name="item.nodeCode"></el-tab-pane>
      </el-tabs>
      <el-table ref="table" border :data="list" :height="tableHeight" v-loading="listLoading" highlight-current-row @selection-change="handleSelectionChange" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
        <el-table-column align="center" label="服务对象" prop="serviceObj" width="150"></el-table-column>
        <el-table-column align="center" label="订单号" width="200px" prop="orderNo" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="服务号" width="200px" prop="serviceNo" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="工单号" width="200px" prop="workNo" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="服务名称" prop="serviceName" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="税号" width="200">
          <div slot-scope="{ row }">
            <div v-if="row.taxQualityDTO && JSON.stringify(row.taxQualityDTO) != '{}' && !isCountry(row.countryCode)">
              <div>
                <span class="show-tooltip">本土税号: </span>
                <span class="show-tooltip">{{ row.taxQualityDTO.taxNumber }}</span>
              </div>
              <div>
                <span class="show-tooltip">欧盟税号: </span>
                <span class="show-tooltip">{{ row.taxQualityDTO.taxNumberEu }}</span>
                <el-link type="primary" class="el-icon-edit show-tooltip-icon" @click="changeTaxNumberEu(row)"></el-link>
              </div>
            </div>
            <div v-else-if="row.taxQualityDTO && JSON.stringify(row.taxQualityDTO) != '{}' && isCountry(row.countryCode)">
              <div>
                <span class="show-tooltip">{{ row.taxQualityDTO.taxNumber }}</span>
              </div>
            </div>
            <div v-else>----</div>
          </div>
        </el-table-column>
        <el-table-column align="center" label="国家" prop="countryNameZh" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="服务商" prop="supplierName" width="150" show-overflow-tooltip>
          <span class="show-tooltip-wrapper" slot-scope="{ row }">
            <span class="show-tooltip">{{ row.supplierName }}</span>
            <el-link type="primary" class="el-icon-edit show-tooltip-icon" @click="changeServiceProvider(row)" v-if="[currentCodeEnum.NODE2, currentCodeEnum.NODE3, ''].includes(row.currentNodeCode)" v-show="hasAuthority('L1_3')"></el-link>
          </span>
        </el-table-column>
        <el-table-column align="center" label="工单状态" width="150">
          <template slot-scope="{ row }">
            {{ row.status | serviceStatus }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="工单进度" prop="currentNodeCode" width="150" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <p style="white-space: pre-wrap">{{ row.currentNodeCode | filterKey(currentCodeList) }} {{ row.progressBar === 2 ? '(被驳回)' : '' }}</p>
            <p v-if="row.existReject"><el-link type="primary" @click="rejectDetail(row)">(驳回原因)</el-link></p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="处理人" width="150">
          <template slot-scope="{ row }">
            <span style="white-space: pre-wrap">{{ row.handler }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" width="100">
          <template slot-scope="{ row }">
            <el-link type="primary" class="el-icon-search" :underline="false" @click="seeRemark(row)" v-if="row.existRemark" v-show="hasAuthority('L1_5')"> 查看 </el-link>
            <span v-else style="color: #999">-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单备注" prop="orderRemark" width="150" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column align="center" label="税号" prop="vatTaxNumber"></el-table-column> -->
        <slot name="tableItems">
          <!-- <WaringTableColum @showFollow="(val) => ((followItem = val), (showFollow = true))" /> -->
        </slot>
        <el-table-column align="center" label="操作" width="200px" fixed="right">
          <template slot-scope="{ row }">
            <slot name="operator" :row="row"></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="searchForm.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="searchForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <ChangeSupplierDialog :changeSupplierDialog.sync="changeSupplierDialog" :functionCode="checkedRow.functionCode" :checkedRow="checkedRow" @refresh="getList" />
    <ChangeTaxNumberEuDialog :changeTaxNumberEuDialog.sync="changeTaxNumberEuDialog" :functionCode="functionCode" :checkedRow="checkedRow" @refresh="getList" />
    <WorkOrderRemarkDialog v-if="workOrderRemarkDialog" :workOrderRemarkDialog.sync="workOrderRemarkDialog" :workNo="checkedRow.workNo" />
    <CheckRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :workNo="checkedRow.workNo" />
    <AddRemarkDialog :addRemarkDialog.sync="addRemarkDialog" :workNo="checkedRow.workNo" />
    <WaringDrawer v-if="showFollow" :visible.sync="showFollow" :detailId="followItem.id" />
  </div>
</template>

<script>
import { serviceNode } from '@/api/newApi/taxServices/serviceManage.js';
import { exportWorkerTax } from '@/api/newApi/taxServices/taxRegister.js';
import cacheQuery from '@/mixins/cacheQuery';
import { currentCodeList, currentCodeEnum } from '@/view/module/workOrder/map.js';
import WorkOrderRemarkDialog from '@/view/module/workOrder/components/workOrderRemarkDialog';
import AddRemarkDialog from '@/view/module/workOrder/components/addRemarkDialog';
import CheckRejectInfoDialog from '@/view/module/workOrder/components/checkRejectInfoDialog';
import ChangeSupplierDialog from '@/view/module/workOrder/components/changeSupplierDialog';
import WaringTableColum from '@/components/waringTableColum/tableColumn';
import ChangeTaxNumberEuDialog from '@/view/module/workOrder/components/changeTaxNumberEuDialog';
export default {
  props: {
    // 搜索条件
    form: {
      type: Object,
      default: {},
    },
    method: Function,
    functionCode: String,
  },
  components: {
    ChangeSupplierDialog,
    ChangeTaxNumberEuDialog,
    WorkOrderRemarkDialog,
    CheckRejectInfoDialog,
    AddRemarkDialog,
    WaringTableColum,
    WaringDrawer: () => import('../../../../../components/waringDrawer/waringDrawer.vue'),
  },
  data() {
    return {
      activeName: '-1',
      tabs: [],
      list: [],
      searchForm: {
        limit: 20,
      },
      cacheKey: 'searchForm',
      listLoading: false,
      total: 0,
      checkedRow: {},
      changeSupplierDialog: false,
      changeTaxNumberEuDialog: false,
      workOrderRemarkDialog: false,
      addRemarkDialog: false,
      checkRejectInfoDialog: false,
      currentCodeList,
      currentCodeEnum,
      showFollow: false,
      followItem: {},
    };
  },
  watch: {
    form: {
      handler(val) {
        this.searchForm = Object.assign({}, this.searchForm, val);
      },
      deep: true,
      immediate: true,
    },
  },
  mixins: [cacheQuery],
  mounted() {
    this.getPageCache();
    this.getList();
    this.getServiceNode();
  },
  methods: {
    formatTime() {
      [this.searchForm.createTimeFirst, this.searchForm.createTimeLast] = this.searchForm.createTime && this.searchForm.createTime.length ? this.searchForm.createTime : ['', ''];
      [this.searchForm.commitSupplierTimeFirst, this.searchForm.commitSupplierTimeLast] = this.searchForm.sendProviderTime && this.searchForm.sendProviderTime.length ? this.searchForm.sendProviderTime : ['', ''];
      [this.searchForm.auditTimeFirst, this.searchForm.auditTimeLast] = this.searchForm.lastVerifyTime && this.searchForm.lastVerifyTime.length ? this.searchForm.lastVerifyTime : ['', ''];
      [this.searchForm.completeTimeFirst, this.searchForm.completeTimeLast] = this.searchForm.completeTime && this.searchForm.completeTime.length ? this.searchForm.completeTime : ['', ''];
      this.mergeForm();
    },
    getFormatParams() {
      if (this.searchForm.currentNodeCode) {
        this.activeName = this.searchForm.currentNodeCode;
      } else {
        this.activeName = '-1';
      }
      this.formatTime(this.searchForm);
      let { nodeName, createTime, sendProviderTime, lastVerifyTime, completeTime, currentNode, ...params } = this.searchForm;
      return params;
    },
    /**
     * 查询列表
     */
    getList() {
      this.listLoading = true;
      this.setPageCache();
      this.method(this.getFormatParams())
        .then((res) => {
          if (res.code == 0) {
            this.list = res.data.records;
            this.total = Number(res.data.total);
            this.$emit('getListData', { form: this.searchForm, list: this.list });
          }
        })
        .finally((err) => {
          this.listLoading = false;
        });
    },
    //服务流程节点列表
    getServiceNode() {
      serviceNode({ functionCode: this.functionCode }).then((res) => {
        if (res.code == 0) {
          res.data.map((item) => {
            item.status = item.status.toString();
          });
          this.tabs = res.data;
        }
      });
    },
    handleClick() {
      this.searchForm.progressBar = '';
      if (this.activeName != -1) {
        this.searchForm.currentNodeCode = this.activeName;
        this.searchForm.status = 1;
      } else {
        this.searchForm.currentNodeCode = '';
        this.searchForm.status = '';
      }
      this.searchForm.page = 1;
      this.getList();
    },
    mergeForm() {
      this.$nextTick(() => {
        this.$parent.form = Object.assign({}, this.searchForm);
        this.$parent.$refs.workOrderSearch.searchForm = this.$parent.form;
      });
    },
    //多选勾选
    handleSelectionChange(val) {
      let checkIds = val.map((item) => item.id);
      this.$emit('handleSelectionChange', val, checkIds);
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.searchForm.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getList();
    },
    // 查看备注
    seeRemark(row) {
      this.checkedRow = row;
      this.workOrderRemarkDialog = true;
    },
    // 查看驳回原因
    rejectDetail(row) {
      this.checkedRow = row;
      this.checkRejectInfoDialog = true;
    },
    // 修改税号
    changeTaxNumberEu(row) {
      this.checkedRow = row;
      this.changeTaxNumberEuDialog = true;
    },
    // 修改服务商
    changeServiceProvider(row) {
      this.checkedRow = row;
      this.changeSupplierDialog = true;
    },
    // 导出
    exportData() {
      this.setPageCache();
      exportWorkerTax(this.getFormatParams())
        .then((res) => {
          this.$util.exportExcel(res, '失效税号名单');
        })
        .finally((e) => {
          this.exportLoading = false;
        });
    },
    isCountry(code) {
      let codeAary = ['SA', 'AE', 'JP', 'EU', 'GB'];
      let isShow = false;
      if (codeAary.indexOf(code) > -1) {
        isShow = true;
      }
      return isShow;
    },
  },
};
</script>

<style></style>
