<template>
  <div class="app-container">
    <div class="header-container" ref="searchBox">
      <!-- 搜索 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline label-width="100px">
          <el-form-item label="服务号" prop="serviceNo">
            <el-input v-model="form.serviceNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item label="订单号" prop="orderNo">
            <el-input v-model="form.orderNo" placeholder="请输入" clearable style="width: 168px" size="small" />
          </el-form-item>
          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
            <el-button size="small" icon="el-icon-refresh-left" @click="reset"> 重置 </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <el-button size="small" style="float: right" class="green-btn" @click="batchChangeHandlerLawyer" v-if="[progressBarObj.LAWYER_REVIEW, progressBarObj.REVIEW_PERIOD, progressBarObj.REGISTER_SUCCESS].includes(tabNav)" v-show="hasAuthority('M2_29')">
            <i class="icon icon-change"></i>修改律师
          </el-button>
          <div v-show="moreSerch">
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="国家" prop="countryCode">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.countryCode">
                <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务名称" prop="serviceName">
              <el-input v-model="form.serviceName" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="服务进度" prop="cureentNodeCode">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.cureentNodeCode">
                <el-option :value="item.nodeCode" :label="item.nodeName" v-for="item in tabs" :key="item.nodeCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务状态" prop="status">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.status">
                <el-option :value="item.value" :label="item.label" v-for="item in statusList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="服务生成时间" prop="createTime">
              <el-date-picker
                v-model="form.createTime"
                type="daterange"
                align="right"
                size="small"
                clearable
                unlink-panels
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                range-separator="到"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="[, '23:59:59']"
                style="width: 340px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="处理人" prop="handleUserName">
              <el-input v-model="form.handleUserName" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="快递单号" prop="courierNo">
              <el-input v-model="form.courierNo" placeholder="请输入" clearable style="width: 168px" size="small" />
            </el-form-item>
            <el-form-item label="建模绘图" prop="drawStatus" v-show="[progressBarObj.LAWYER_REVIEW, progressBarObj.REVIEW_PERIOD, progressBarObj.REGISTER_SUCCESS].includes(tabNav)">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.drawStatus">
                <el-option :value="1" label="已完成"></el-option>
                <el-option :value="2" label="服务中"></el-option>
                <el-option :value="3" label="无建模绘图"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否转代理" prop="isProxy">
              <el-select placeholder="请选择" size="small" style="width: 168px" clearable filterable v-model="form.isProxy">
                <el-option :value="true" label="是"></el-option>
                <el-option :value="false" label="否"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="flagCustomerData" label="发送注册资料" label-width="130px">
              <el-select style="width: 150px" placeholder="发送注册资料" v-model="form.flagCustomerData" clearable>
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="emailSend" label="客户发送邮件状态" label-width="130px">
              <el-select style="width: 140px" placeholder="客户发送邮件状态" v-model="form.emailSend" clearable>
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-tabs ref="elTabs" v-model="tabNav" @tab-click="tabClick">
        <el-tab-pane name="-1" label="全部"></el-tab-pane>
        <el-tab-pane :label="item.nodeName" :name="item.nodeCode" v-for="(item, index) in tabs" :key="index"></el-tab-pane>
      </el-tabs>
      <el-table border :data="list" v-loading="tableLoading" @selection-change="handleSelectionChange" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="专利" min-width="300">
          <template slot-scope="scope">
            <p>订单号：{{ scope.row.orderNo }}</p>
            <p>服务编号：{{ scope.row.serviceNo }}</p>
            <p>服务名称：{{ scope.row.serviceName }}</p>
          </template>
        </el-table-column>
        <!-- <WaringTableColum @showFollow="(val) => ((followItem = val), (showFollow = true))" /> -->
        <el-table-column align="center" min-width="150" label="国家" show-overflow-tooltip prop="countryNameZh"></el-table-column>
        <el-table-column align="center" min-width="150" label="服务进度" show-overflow-tooltip prop="cureentNodeCode">
          <template slot-scope="{ row }">{{ row.cureentNodeCode | filterNodeCode }}</template>
        </el-table-column>
        <el-table-column align="center" min-width="150" label="服务状态" show-overflow-tooltip prop="status">
          <template slot-scope="scope">{{ scope.row.status | filterStatus(statusList) }}</template>
        </el-table-column>
        <el-table-column align="center" min-width="150" label="处理人" show-overflow-tooltip prop="handlerUserName">
          <template slot-scope="{ row }">
            <div v-for="(user, i) in row.handlerUserName" :key="i">{{ user }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="200px" label="服务生成时间" sortable show-overflow-tooltip prop="createTime"></el-table-column>
        <el-table-column align="center" min-width="70" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top">
              <el-link type="primary" :underline="false" @click="detail(scope.row)" v-show="hasAuthority('M2_1')">
                <i class="icon icon-see"></i>
                <!-- 查看 -->
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="[10, 20, 30, 50]" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <HandleLawyer v-if="isHandleLawyer" :serviceIds="serviceIds" :countryCode="countryLawyer" :functionCode="handleLawyerFunctionCode" :showConsumed="tabNav !== progressBarObj.LAWYER_REVIEW" entry="appearancePatent" @cancelFunc="cancelFunc"></HandleLawyer>
  </div>
</template>

<script>
import { progressBarList, progressBarObj } from './enumObj';
import { patentList } from '@/api/newApi/intellectualProperty/appearancePatent';
import { serviceNode } from '@/api/newApi/taxServices/serviceManage.js';
import { getCountrySelectList } from '@/api/newApi/common';
import cacheQuery from '@/mixins/cacheQuery';
import HandleLawyer from '@/view/module/intellectualProperty/components/handleLawyer';
export default {
  data() {
    return {
      list: [],
      tabNav: '-1',
      tabs: [],
      total: 0,
      form: {
        page: 1,
        limit: 20,
        serviceNo: '',
        orderNo: '',
        mobile: '',
        countryCode: '',
        serviceName: '',
        cureentNodeCode: '',
        status: '',
        handleUserName: '',
        courierNo: '',
        drawStatus: '',
        isProxy: '',
        createTime: [],
      },
      cacheKey: 'form',
      copyListQuery: {},
      countrySelectList: [],
      tableLoading: false,
      searchFlag: false,
      statusList: [
        { label: '服务中', value: 1 },
        { label: '取消中', value: 11 },
        { label: '已取消', value: 9 },
      ],
      progressBarList,
      progressBarObj,
      moreSerch: false,
      selectList: [],
      serviceIds: '',
      countryLawyer: '',
      handleLawyerFunctionCode: '',
      isHandleLawyer: false,
    };
  },
  mixins: [cacheQuery],
  components: {
    HandleLawyer,
  },
  filters: {
    filterStatus(status, statusList) {
      let result = statusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
    filterNodeCode(nodeCode) {
      let result = progressBarList.find((item) => item.value === nodeCode);
      return result ? result.label : '';
    },
  },
  mounted() {
    this.copyListQuery = { ...this.form };
    this.getPageCache();
    this.getList();
    this.getServiceNode();
    this._getCountrySelectList();
  },
  methods: {
    formatTime() {
      [this.form.createStartTime, this.form.createEndTime] = this.form.createTime && this.form.createTime.length ? this.form.createTime : ['', ''];
    },
    getList() {
      this.tableLoading = true;
      this.formatTime();
      this.setPageCache();
      let { createTime, ...formData } = this.form;
      patentList(this.$util.objTrim(formData))
        .then((res) => {
          res.data.records.forEach((item) => {
            item.handlerUserName = item.handlerUserName.split(',').filter((i) => i);
          });
          this.list = res.data.records;
          this.total = parseInt(res.data.total);
          this.tableLoading = false;
          this.tabNav = this.form.cureentNodeCode === '' ? '-1' : this.form.cureentNodeCode;
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
          this.searchFlag = false;
        });
    },
    cancelFunc() {
      this.isHandleLawyer = false;
      this.getList();
    },
    getServiceNode() {
      serviceNode({ functionCode: this.$constant.APPEARANCE_FUNCTION_CODE })
        .then((res) => {
          if (res.code == 0) {
            this.tabs = res.data;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    tabClick() {
      this.form.cureentNodeCode = this.tabNav === '-1' ? '' : this.tabNav;
      this.form.page = 1;
      this.getList();
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    //选择table数据
    handleSelectionChange(val) {
      this.selectList = val;
    },
    batchChangeHandlerLawyer() {
      if (this.selectList.length == 0) {
        this.$Message.info('请先选择要操作的工单');
        return;
      }
      this.countryLawyer = this.selectList[0].countryCode;
      this.handleLawyerFunctionCode = this.selectList[0].productFunctionCode;
      let flag = true;
      this.serviceIds = this.selectList.map((item) => item.id).join(',');
      this.selectList.forEach((item, index) => {
        if (item.countryCode != this.countryLawyer || item.productFunctionCode != this.handleLawyerFunctionCode) {
          this.$Message.info('不符合批量操作要求，服务单商品对应的工单类型及国家需保持一致');
          flag = false;
        }
      });
      if (flag) this.isHandleLawyer = true;
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
    detail(row) {
      this.$router.push({
        path: '/appearancePatent/detail',
        query: {
          serviceId: row.id,
          productFunctionCode: row.productFunctionCode,
        },
      });
    },
    reset() {
      this.form = { ...this.copyListQuery };
      this.removePageCache();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}
</style>
