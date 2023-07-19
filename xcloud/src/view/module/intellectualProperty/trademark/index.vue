<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox" v-if="!isShowDetail">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="listQuery" inline label-width="90px">
          <el-form-item prop="searchNo" label="综合搜索">
            <el-input v-model="listQuery.searchNo" style="width: 220px" clearable placeholder="可搜索服务号/订单号/受理号"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="手机号">
            <el-input v-model="listQuery.mobile" style="width: 168px" clearable placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="refreshTable('', 1)" icon="el-icon-search">查询</el-button>
            <el-button icon="el-icon-refresh-left" size="small" @click="resetSearchBox()">重置</el-button>
            <el-button type="text" size="small" @click="handleMoreSearch">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '更多' }}筛选
            </el-button>
          </el-form-item>
          <el-button type="warning" size="small" style="float: right; margin-left: 10px" class="yellow-btn" @click="exportOrderFunc()" v-show="hasAuthority('T1_2')"> <i class="icon icon-export"></i>导出 </el-button>
          <el-button size="small" style="float: right" class="green-btn" @click="batchChangeHandlerFunc()" v-show="hasAuthority('T1_1')"> <i class="icon icon-change"></i>批量修改处理人 </el-button>
          <el-button size="small" style="float: right" class="green-btn" @click="batchChangeHandlerLawyer()" v-show="hasAuthority('T1_20') && ['NODE0033', 'NODE0034', 'NODE0035', 'NODE0036', 'NODE0037', 'NODE0038'].includes(listQuery.nodeCode)">
            <i class="icon icon-change"></i>批量修改律师
          </el-button>
          <el-button style="float: right" v-show="hasAuthority('T1_4')" @click="sealed(2)"><i class="icon icon-unSeal"></i>取消封存</el-button>
          <el-button style="float: right" type="primary" v-show="hasAuthority('T1_3')" @click="sealed(1)"> <i class="icon icon-seal"></i>封存工单 </el-button>
          <div v-show="moreSerch">
            <el-form-item prop="applyName" label="申请人">
              <el-input v-model="listQuery.applyName" style="width: 168px" clearable placeholder="申请人"></el-input>
            </el-form-item>
            <el-form-item prop="trademarkNameEn" label="商标名称">
              <el-input v-model="listQuery.trademarkNameEn" style="width: 168px" clearable placeholder="商标名称"></el-input>
            </el-form-item>
            <el-form-item prop="countryCode" style="margin-bottom: 6px" label="国家">
              <el-select clearable filterable v-model="listQuery.countryCode" style="width: 168px" placeholder="国家">
                <el-option v-for="item in countrySelect" :value="item.countryCode" :key="item.id" :label="item.countryNameZh"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="serviceName" label="服务名称">
              <el-input v-model="listQuery.serviceName" style="width: 168px" placeholder="服务名称" clearable size="small"></el-input>
            </el-form-item>
            <el-form-item prop="nodeServiceProgressName" label="注册进度">
              <el-select style="width: 168px" placeholder="注册进度" v-model="listQuery.nodeServiceProgressName" clearable @change="changeStatus">
                <el-option :label="v.nodeServiceProgressName" :value="v.nodeServiceProgressName" v-for="(v, i) in serviceStatusList" :key="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="servicesStatus" label="服务状态">
              <el-select placeholder="服务状态" v-model="listQuery.servicesStatus" clearable style="width: 168px">
                <el-option label="服务中" :value="1"></el-option>
                <el-option label="已取消" :value="9"></el-option>
                <el-option label="封存" :value="10"></el-option>
                <el-option label="取消中" :value="11"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="handleUserName" label="处理人">
              <el-input v-model="listQuery.handleUserName" style="width: 168px" placeholder="处理人" clearable></el-input>
            </el-form-item>
            <el-form-item prop="orderSource" label="渠道来源">
              <el-select style="width: 168px" placeholder="渠道来源" v-model="listQuery.orderSource" clearable>
                <el-option label="PC网页端" :value="1"></el-option>
                <el-option label="H5" :value="2"></el-option>
                <el-option label="录入订单" :value="3"></el-option>
                <el-option label="微信小程序" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="attorneyId" label="律师">
              <el-select style="width: 168px" placeholder="律师" v-model="listQuery.attorneyId" clearable filterable>
                <el-option :label="listQuery.allLawyers" value=""></el-option>
                <el-option :label="v.shortName" :value="v.id" v-for="(v, i) in filterLawyerList(lawyerList)" :key="i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单归属人" prop="attributionId">
              <el-select style="width: 168px" clearable placeholder="选择跟进人" filterable v-model.trim="listQuery.attributionId" :filter-method="onFilter">
                <el-option-group>
                  <li class="option_title" style="background: #f6f8fa">
                    <span>姓名</span>
                    <span>手机号</span>
                    <span>部门</span>
                  </li>
                  <el-option v-for="item in followListCopy" :key="item.userId" :label="item.nickName" :value="item.userId" class="option_title">
                    <span>{{ item.nickName }}</span>
                    &nbsp;
                    <span>{{ item.mobile }}</span>
                    &nbsp;
                    <span>{{ item.departmentName }}</span>
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker v-model="creatTime" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" start-placeholder="创建日期开始" end-placeholder="创建日期结束"></el-date-picker>
            </el-form-item>
            <el-form-item label="修改时间">
              <el-date-picker v-model="updateTime" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" start-placeholder="修改日期开始" end-placeholder="修改日期结束"></el-date-picker>
            </el-form-item>
            <el-form-item label="受理时间">
              <el-date-picker v-model="acceptTime" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" start-placeholder="受理日期开始" end-placeholder="受理日期结束"></el-date-picker>
            </el-form-item>
            <el-form-item label="是否转代理">
              <el-select placeholder="是否转代理" v-model="listQuery.isProxy" clearable style="width: 168px">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="平台审核时间" label-width="120px">
              <el-date-picker v-model="platformAuditTime" type="daterange" style="width: 340px" range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" start-placeholder="平台审核时间开始" end-placeholder="平台审核时间结束"></el-date-picker>
            </el-form-item>
            <el-form-item prop="flagCustomerData" label="发送注册资料" label-width="130px">
              <el-select style="width: 150px" placeholder="发送注册资料" v-model="listQuery.flagCustomerData" clearable>
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="emailSend" label="客户发送邮件状态" label-width="130px">
              <el-select style="width: 140px" placeholder="客户发送邮件状态" v-model="listQuery.emailSend" clearable>
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="vowExpireFlag" label="意向宣誓是否有效" label-width="130px">
              <el-select clearable="" style="width: 140px" v-model="listQuery.vowExpireFlag">
                <el-option label="已失效" :value="true"></el-option>
                <el-option label="未失效" :value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="twoStatusNameList" style="margin-bottom: 6px" label="商标状态">
              <el-select clearable filterable v-model="listQuery.twoStatusNameList" multiple style="width: 168px" placeholder="商标状态">
                <el-option v-for="item in trademarkStatusTwoList" :value="item" :key="item" :label="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="isUploadAcceptReceipt" label="是否有受理号未下回执" label-width="160px">
              <el-select clearable style="width: 140px" v-model="listQuery.isUploadAcceptReceipt">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container" v-if="!isShowDetail">
      <el-tabs ref="elTabs" v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane label="全部" name="-1"></el-tab-pane>
        <el-tab-pane v-for="(item, index) in tablist" :key="index" :label="item.nodeName" :name="item.nodeCode"></el-tab-pane>
      </el-tabs>
      <!-- 标业务内嵌脚本操作 跨标云、辰海云商标、卖旺云 -->
      <div class="operate" v-if="(enterpriseId === '30' || enterpriseId === '28' || enterpriseId === '45') && listQuery.countryCode === 'US'">
        <el-popover class="search-btn" placement="top" width="300" trigger="hover" :content="pythoLog">
          <el-button slot="reference" type="text">数据查询</el-button>
        </el-popover>
        <el-button slot="reference" size="mini" @click="clearCache">清空缓存</el-button>
        <el-dropdown @command="acceptanceQuery" v-if="listQuery.nodeCode === 'NODE0035'">
          <el-button size="mini">受理号查询并录入<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in lawyersList" :key="index" :command="item">{{ item.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" @click="acceptanceReceipt" v-if="listQuery.nodeCode === 'NODE0036'">受理回执录入</el-button>
        <el-button size="mini" @click="announcementEntry" v-if="listQuery.nodeCode === 'NODE0036'">录入公告日期</el-button>
        <el-button size="mini" @click="reviewOpinion" v-if="listQuery.nodeCode === 'NODE0036' || listQuery.nodeCode === 'NODE0037'">审查意见OA原文</el-button>
        <el-button size="mini" @click="registrationNum" v-if="listQuery.nodeCode === 'NODE0037'">注册号-注册日期</el-button>
        <el-button size="mini" @click="uploadCertificate" v-if="listQuery.nodeCode === 'NODE0037'">上传商标证书</el-button>
      </div>

      <el-table border :data="tableData" v-loading="tableLoading" @selection-change="handleSelectionChange" @sort-change="sortChange" ref="table" :height="tableHeight" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="商标" width="220">
          <template slot-scope="scope">
            <p>订单号：{{ scope.row.orderNo }}</p>
            <p>服务编号：{{ scope.row.serviceNo }}</p>
            <p>商标名称：<span v-html="scope.row.trademarkNameEn"></span></p>
            <p>服务名称：{{ scope.row.serviceName }}</p>
          </template>
        </el-table-column>
        <!-- <WaringTableColum @showFollow="(val) => ((followItem = val), (showFollow = true))" /> -->
        <el-table-column align="center" label="国家" prop="countryNameZh"></el-table-column>
        <el-table-column align="center" label="申请人" prop="applyName" width="160"></el-table-column>
        <el-table-column align="center" label="注册进度" prop="serviceProgressStr" width="130"></el-table-column>
        <el-table-column align="center" label="服务状态" prop="serviceStatusStr" width="120"></el-table-column>

        <el-table-column label="受理号/日期" prop="acceptTime" sortable="custom" width="150">
          <template slot-scope="scope">
            <p>受理号：{{ scope.row.acceptNum }}</p>
            <p>日期：{{ scope.row.acceptTime }}</p>
          </template>
        </el-table-column>
        <el-table-column label="服务截止日期" prop="cutOffTime" width="150">
          <template slot-scope="scope">
            <p>{{ cutOffTimeFilter(scope.row) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="商标状态" prop="twoStatusName" width="120" />
        <el-table-column label="状态日期" prop="statusDate" sortable="custom" width="150" />
        <el-table-column label="订单归属人" prop="attributionName" width="120" />
        <el-table-column align="center" label="修改时间" prop="updateTime" sortable="custom" width="130"></el-table-column>
        <el-table-column align="center" label="下载资料时间" prop="newDownloadTime" sortable="custom" width="130"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" sortable="custom" width="130"></el-table-column>
        <el-table-column align="center" label="处理人" prop="refundMoney" width="200">
          <template slot-scope="{ row }">
            <div v-if="row.workorderHandlerList && row.workorderHandlerList.length > 0">
              <p style="margin-bottom: 4px" v-for="(item, index) in row.workorderHandlerList" :key="index">
                {{ item.handleTypeName }}：
                <span>{{ item.handlerUserName }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="处理律师" prop="attorneyName" width="150"></el-table-column>
        <el-table-column align="center" label="订单备注" show-overflow-tooltip prop="orderRemark">
          <template slot-scope="scope">
            <el-link
              v-if="hasAuthority('T1_21') && scope.row.orderRemark"
              @click="
                orderRemark = scope.row.orderRemark;
                checkOrderRemarkDialog = true;
              "
              type="primary"
              ><i class="icon icon-search-small"></i>查看</el-link
            >
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="核名通过率" prop="trademarkRate" width="150">
          <template slot-scope="{ row }">
            <div v-if="row.trademarkSearchRecordWorkRelWorkOrderList.length === 0">--</div>
            <!-- 核名记录为一条时, 初核、复核、终核报告结果展示 -->
            <div v-if="row.trademarkSearchRecordWorkRelWorkOrderList.length === 1">
              <span v-for="(item, index) in row.trademarkSearchRecordWorkRelWorkOrderList[0].trademarkSearchRecordReportVOList" :key="index"> {{ getPassRateResult(item) }}<br /> </span>
            </div>
            <!-- 核名记录多条时，公共弹窗 -->
            <el-link type="primary" v-if="row.trademarkSearchRecordWorkRelWorkOrderList.length > 1" @click="handleTrademarkRow(row)">查看所有核名记录</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="核名记录状态" prop="trademarkStatus" width="150">
          <template slot-scope="{ row }">
            <span v-if="row.trademarkSearchRecordWorkRelWorkOrderList.length === 0">--</span>
            <!-- 核名记录为一条时，判断并显示核名状态 -->
            <div v-if="row.trademarkSearchRecordWorkRelWorkOrderList.length === 1">
              {{ trademarkStatusMap[row.trademarkSearchRecordWorkRelWorkOrderList[0].recordStatus] }} <br />
              <el-link type="primary" v-if="row.trademarkSearchRecordWorkRelWorkOrderList[0].recordStatus === 'CONFIRM_WAIT_AUDIT'" @click="goTrademarkRecordDetailPage(row)">(去审核)</el-link>
              <el-link type="primary" v-else @click="goTrademarkRecordDetailPage(row)">(去查看)</el-link>
            </div>
            <!-- 核名记录多条时，公共弹窗 -->
            <el-link type="primary" v-if="row.trademarkSearchRecordWorkRelWorkOrderList.length > 1" @click="handleTrademarkRow(row)">查看所有核名记录状态</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否关联核名记录" prop="trademarkRelation" width="150">
          <template slot-scope="{ row }">
            <span v-if="row.associationType === 'ALL'">已关联</span>
            <span v-if="row.associationType === 'PART'">部分关联<br /><el-link type="primary" @click="handleTrademarkRow(row)" v-if="row.workOrderId !== 0">(去关联)</el-link></span>
            <span v-if="row.associationType === 'ZERO'">未关联<br /><el-link type="primary" @click="handleTrademarkRow(row)" v-if="row.workOrderId !== 0">(去关联)</el-link></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <!-- 查看 -->
            <el-tooltip content="查看" placement="top" v-show="hasAuthority('T1_15')">
              <el-link type="primary" :underline="false" @click="showDetailModal(scope.row)">
                <img src="@/assets/icons/icon_see.svg" alt="" />
              </el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container" v-if="!isShowDetail">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <HandleUser v-if="isHandler" :type="useServiceType" :rowInfo="rowInfo" :serviceIds="serviceIds" @cancelFunc="handleCancel"></HandleUser>
    <HandleLawyer v-if="isHandleLawyer" :serviceIds="serviceIds" :countryCode="countryLawyer" :functionCode="handleLawyerFunctionCode" :showConsumed="!['NODE0033', 'NODE0034', 'NODE0035'].includes(listQuery.nodeCode)" @cancelFunc="handleCancelLawyer"></HandleLawyer>
    <CheckOrderRemarkDialog :checkOrderRemarkDialog.sync="checkOrderRemarkDialog" :orderRemark="orderRemark" />
    <WaringDrawer v-if="showFollow" :visible.sync="showFollow" :detailId="followItem.workOrderId" />

    <!-- 核名记录关联弹窗 -->
    <TrademarkRecordModal :visible.sync="trademarkRecordModalVisible" :row="trademarkRow" @change="refreshTable()" />
  </div>
</template>
<script>
import workOrderDetail from './details';
import HandleUser from '../components/handleUser';
import HandleLawyer from '../components/handleLawyer';
import { getCountrySelectList, userList } from '@/api/newApi/common.js';
import { findNodes, clearPythonCache } from '@/api/newApi/processFields/processConfig';
import * as API from '@/api/newApi/intellectualProperty/trademark';
import { newSupplierList } from '@/api/newApi/workOrder/processConfiguration';
import axios from 'axios';
import { getToken } from '@/libs/util';
import store from '@/store';
import { setSearchVal, getSearchVal, getSearchTime, removeSearchVal } from '../handleSearch';
import CheckOrderRemarkDialog from '@/view/module/workOrder/components/checkOrderRemarkDialog';
import { isEmpty } from 'lodash';
import WaringTableColum from '@/components/waringTableColum/tableColumn';
import dayjs from 'dayjs';
import Trademark from '../../workOrder/dataCenter/trademark.vue';
import TrademarkRecordModal from './components/TrademarkRecordModal.vue';
import { trademarkStatusMap, reportTypeMap, lawyersList } from './enumeratedList';
const pythonHost = 'https://py.itaxs.com'; // python 脚本接口地址

export default {
  components: {
    workOrderDetail,
    HandleUser,
    HandleLawyer,
    CheckOrderRemarkDialog,
    WaringTableColum,
    WaringDrawer: () => import('@/components/waringDrawer/waringDrawer.vue'),
    Trademark,
    TrademarkRecordModal,
  },
  data() {
    return {
      activeName: '-1',
      tablist: [],
      countrySelect: [],
      followList: [],
      followListCopy: [],
      trademarkStatusTwoList: [],
      // 分页
      listTotal: 0,
      moreSerch: false,
      tableData: [],
      listQuery: {
        searchNo: '',
        serviceNo: '',
        servicesStatus: 1,
        orderNo: '',
        mobile: '',
        applyName: '',
        acceptNum: '',
        serviceName: '',
        countryCode: '',
        trademarkNameEn: '',
        paymentChannel: '',
        attributionId: '',
        orderSource: '',
        paymentType: '',
        page: 1,
        limit: 10,
        nodeServiceProgressName: '',
        handleUserName: '',
        workOrderType: '',
        attorneyId: '',
        evidenNodeServiceProgressName: '',
        isProxy: '',
        allLawyers: '全部律师',
        // 是否宣誓过期
        vowExpireFlag: '',
        // 是否有受理号未下回执
        isUploadAcceptReceipt: '',
        // 商标二级状态
        twoStatusNameList: [],
      },
      creatTime: '',
      updateTime: '',
      acceptTime: '',
      platformAuditTime: '',
      enterpriseId: '',
      tableLoading: false,
      selectList: [],
      isShowDetail: false,
      rowInfo: {},
      serviceStatusList: [],
      isHandler: false,
      serviceIds: '',
      pagePath: this.$route.name,
      countryLawyer: '',
      isHandleLawyer: false,
      evidenceList: [], //使用证据
      handleLawyerFunctionCode: '61',
      lawyerList: [],
      checkOrderRemarkDialog: false,
      orderRemark: '',
      lawyersList,
      pythoLog: '',
      showFollow: false,
      followItem: {},
      useServiceType: null,
      reportTypeMap,
      trademarkRecordModalVisible: false,
      trademarkRow: {},
      trademarkStatusMap,
    };
  },
  created() {
    this.enterpriseId = this.$util.getLocalStorage('enterpriseId');
    if (getSearchVal(this.pagePath) != null) {
      this.listQuery = getSearchVal(this.pagePath);
      this.activeName = this.listQuery.nodeCode || '-1';
    }
    if (getSearchTime(this.pagePath) != null) {
      let searchTime = getSearchTime(this.pagePath);
      this.creatTime = searchTime.creatTime;
      this.updateTime = searchTime.updateTime;
      this.acceptTime = searchTime.acceptTime;
      this.platformAuditTime = searchTime.platformAuditTime;
    }
    this.getUserList();
    this.getCountrySelectList(); //获取国家列表
    this.getTrademarkStatusTwoList(); //获取二级商标状态
    this.getNodesFunc();
    this.refreshTable();
    if (this.enterpriseId === '30' || this.enterpriseId === '28' || this.enterpriseId === '45') {
      this.getPythonLog();
    }
  },
  methods: {
    filterLawyerList(LawyerList) {
      if (LawyerList.length) {
        return LawyerList.filter((item) => item.id && item.shortName && item.shortName !== ' ');
      } else {
        return [];
      }
    },
    cutOffTimeFilter(row) {
      let date = '-';
      try {
        let d = dayjs(row.acceptTime || row.createTime);
        if (d.year() >= 2022) {
          date = d.add(12, 'month').format('YYYY-MM-DD HH:mm:ss');
        } else {
          date = d.add(18, 'month').format('YYYY-MM-DD HH:mm:ss');
        }
      } catch (error) {
        console.error(error);
      }
      return date;
    },
    onFilter(v = '') {
      const inputVal = v.replace(/^\s+|\s+$/gm, '');
      this.followListCopy = this.followList.filter((item) => item.nickName.includes(inputVal));
    },
    // 获取归属人
    getUserList() {
      userList({
        page: 1,
        limit: 100,
      }).then((res) => {
        if (res.code == 0) {
          this.followList = res.data;
          this.followListCopy = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //获取工单节点
    getNodesFunc() {
      findNodes({ functionCode: 62 }).then((res) => {
        if (res.code == 0) {
          this.tablist = res.data;
        }
      });
      // 获取注册进度筛选项
      API.getAllServiceProgressAPI({ functionCode: 62 }).then((res) => {
        if (res.code == 0) {
          this.serviceStatusList = res.data;
        }
      });
      /**
       * 获取使用证据
       */
      API.getAllServiceProgressAPI({ functionCode: 63 }).then((res) => {
        if (res.code == 0) {
          this.evidenceList = res.data;
          this.setEvidence();
          this._getorderlist();
        }
      });
    },
    async getLawyerList(countryCode) {
      let { code, data } = await newSupplierList({ supplierType: 2, functionCode: '61', countryCode });
      code == 0 && (this.lawyerList = data);
    },
    // 封存工单or取消封存
    sealed(type) {
      if (this.selectList.length == 0) {
        this.$Message.info('请先选择服务');
        return;
      }
      let serviceIds = this.selectList.map((item) => item.servicesId).join(',');
      API.changeSealedAPI({ serviceIds, type }).then((res) => {
        if (res.code == 0) {
          this.$Message.success('操作成功');
          this.refreshTable();
        }
      });
    },
    // 注册动态变更联动tab
    changeStatus(val) {
      if (val == '') {
        this.listQuery.progressBar = '';
        this.listQuery.nodeCode = '';
        this.activeName = '';
        return;
      }
      this.serviceStatusList.map((item) => {
        if (item.nodeServiceProgressName == val) {
          this.listQuery.progressBar = item.nodeServiceProgress;
          this.listQuery.nodeCode = item.nodeCode;
          this.activeName = item.nodeCode;
        }
      });
    },
    // 修改时间排序
    sortChange(column, key, order) {
      let type = '';
      if (column.order == 'descending' && column.prop == 'acceptTime') {
        type = 4;
      } else if (column.order == 'ascending' && column.prop == 'acceptTime') {
        type = 3;
      } else if (column.order == 'descending' && column.prop == 'updateTime') {
        type = 6;
      } else if (column.order == 'ascending' && column.prop == 'updateTime') {
        type = 5;
      } else if (column.order == 'descending' && column.prop == 'createTime') {
        type = 2;
      } else if (column.order == 'ascending' && column.prop == 'createTime') {
        type = 1;
      } else if (column.order == 'ascending' && column.prop == 'statusDate') {
        type = 7;
      } else if (column.order == 'descending' && column.prop == 'statusDate') {
        type = 8;
      }
      this.refreshTable(type);
    },
    refreshTable(sortNum, page) {
      let { nodeCode, ...newQuery } = this.listQuery;
      if (this.activeName == '-1') {
        this.listQuery = newQuery;
        this.activeName = '-1';
      } else {
        this.listQuery.nodeCode = nodeCode;
        this.activeName = this.listQuery.nodeCode;
      }
      this.listQuery.createEndTime = this.creatTime ? this.$util.formatDate(this.creatTime[1]) : '';
      this.listQuery.createStartTime = this.creatTime ? this.$util.formatDate(this.creatTime[0]) : '';
      this.listQuery.updateEndTime = this.updateTime ? this.$util.formatDate(this.updateTime[1]) : '';
      this.listQuery.updateStartTime = this.updateTime ? this.$util.formatDate(this.updateTime[0]) : '';
      this.listQuery.acceptEndTime = this.acceptTime ? this.$util.formatDate(this.acceptTime[1]) : '';
      this.listQuery.acceptStartTime = this.acceptTime ? this.$util.formatDate(this.acceptTime[0]) : '';
      this.listQuery.platformAuditEndDate = this.platformAuditTime ? this.$util.formatDate(this.platformAuditTime[1]) : '';
      this.listQuery.platformAuditStartDate = this.platformAuditTime ? this.$util.formatDate(this.platformAuditTime[0]) : '';
      if (sortNum) this.listQuery.sortType = sortNum;
      if (page) this.listQuery.page = page;
      let searchTime = {
        creatTime: this.creatTime,
        updateTime: this.updateTime,
        acceptTime: this.acceptTime,
        platformAuditTime: this.platformAuditTime,
      };
      setSearchVal(this.pagePath, JSON.stringify(this.listQuery), JSON.stringify(searchTime));
      this._getorderlist();
    },
    //切换tab状态时请求列表
    tabHandleClick() {
      let { nodeCode, ...newQuery } = this.listQuery;
      this.listQuery.progressBar = '';
      if (this.activeName == '-1') {
        this.listQuery = newQuery;
        this.changeStatus('');
      } else {
        this.listQuery.nodeCode = this.activeName;
      }
      this.listQuery.nodeServiceProgressName = '';
      // 选中注册进度
      this.serviceStatusList.find((item) => {
        if (item.nodeCode == this.activeName) {
          this.listQuery.nodeServiceProgressName = item.nodeServiceProgressName;
          // this.changeStatus(item.nodeServiceProgressName);
        }
        return item.nodeCode == this.activeName;
      });
      this.refreshTable(1);
    },

    /**
     * 设置使用证据参数
     */
    setEvidence() {
      let { evidenNodeServiceProgressName } = this.listQuery;
      let item = this.evidenceList && this.evidenceList.find((i) => i.nodeServiceProgressName == evidenNodeServiceProgressName);
      if (item) {
        let { nodeCode, nodeServiceProgress, nodeServiceProgressName } = item;
        this.listQuery.evidenceNodeCode = nodeCode;
        this.listQuery.evidenceProgressBar = nodeServiceProgress;
        this.listQuery.evidenNodeServiceProgressName = nodeServiceProgressName;
      } else {
        if (this.listQuery.evidenceNodeCode) this.listQuery.evidenceNodeCode = '';
        if (this.listQuery.evidenceProgressBar) this.listQuery.evidenceProgressBar = '';
      }
    },

    _getorderlist() {
      this.tableLoading = true;
      this.setEvidence();
      API.workorderListAPI(this.listQuery)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.data.records;
            this.listTotal = parseInt(res.data.total);
          } else {
            this.tableData = [];
            this.listTotal = 0;
          }
          this.tableLoading = false;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    /**
     * 获取国家下拉框数据
     */
    getCountrySelectList() {
      getCountrySelectList()
        .then((res) => {
          this.countrySelect = res.data;
          console.log('国家');
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.refreshTable('', 1);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.refreshTable();
    },

    /**
     * 详情
     */
    showDetailModal(row) {
      this.$router.push({
        path: '/trademark/detail',
        query: {
          nodeCode: row.nodeCode,
          serviceId: row.servicesId,
          servicesStatus: row.serviceStatus,
        },
      });
    },

    resetSearchBox() {
      this.$refs.searchForm.resetFields();
      this.acceptTime = '';
      this.platformAuditTime = '';
      this.creatTime = '';
      this.updateTime = '';
      (this.listQuery = {
        searchNo: '',
        serviceNo: '',
        servicesStatus: 1,
        orderNo: '',
        mobile: '',
        applyName: '',
        acceptNum: '',
        serviceName: '',
        countryCode: '',
        trademarkNameEn: '',
        paymentChannel: '',
        attributionId: '',
        orderSource: '',
        paymentType: '',
        page: 1,
        limit: 10,
        nodeServiceProgressName: '',
        handleUserName: '',
        attorneyId: '',
        allLawyers: '全部律师',
      }),
        removeSearchVal(this.pagePath);
    },
    setIds() {
      let ids = '';
      this.selectList.forEach((item) => {
        ids += item.servicesId + ',';
      });
      return ids;
    },
    //选择table数据
    handleSelectionChange(val) {
      this.selectList = val;
    },
    //点击批量修改
    batchChangeHandlerFunc() {
      if (this.selectList.length == 0) {
        this.$Message.info('请先选择服务');
        return;
      }
      const productFunctionCodeArr = this.selectList.map((item) => item.productFunctionCode);
      if (productFunctionCodeArr.includes('61') && productFunctionCodeArr.includes('62')) {
        this.$Message.error('工单类型不一致，不支持批量修改处理人');
        return;
      } else {
        this.useServiceType = this.selectList[0].productFunctionCode;
      }
      this.serviceIds = this.selectList.map((item) => item.servicesId).join(',');
      this.isHandler = true;
    },
    // 批量修改律师
    batchChangeHandlerLawyer() {
      console.log('批量修改律师');
      if (this.selectList.length == 0) {
        this.$Message.info('请先选择要操作的工单');
        return;
      }
      const uaniqProductFunctionCodeArr = [...new Set(this.selectList.map((item) => item.productFunctionCode))];
      this.countryLawyer = this.selectList[0].countryCode;
      this.handleLawyerFunctionCode = this.selectList[0].productFunctionCode;
      this.serviceIds = this.selectList.map((item) => item.servicesId).join(',');
      for (let i = 0; i < this.selectList.length; i++) {
        const item = this.selectList[i];
        if (item.countryCode != this.countryLawyer || item.productFunctionCode != this.handleLawyerFunctionCode || uaniqProductFunctionCodeArr.length > 1) {
          this.$Message.info('不符合批量操作要求，服务单商品对应的工单类型及国家需保持一致');
          return;
        }
      }
      this.isHandleLawyer = true;
    },
    /**
     * 导出
     */
    exportOrderFunc() {
      // API.importListAPI(this.listQuery).then(res=>{})
      let params = { ...this.listQuery };
      const menus = store.state.user.menus;
      const pathname = location.pathname.substr(1);
      const menu = menus.find((item) => item.path === pathname);
      const ids = this.setIds() || '';
      params.ids = ids;
      axios({
        url: this.baseUrl + '/workorder/management/trademark/workorder/importList',
        data: params,
        method: 'post',
        headers: {
          Authorization: 'Bearer ' + getToken(),
          enterpriseId: localStorage.getItem('enterpriseId'),
          menuId: menu.menuId,
        },
        responseType: 'blob',
      }).then((res) => {
        if (res.data) {
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel;charset=utf-8',
          });
          const link = document.createElement('a');
          const href = window.URL.createObjectURL(blob); //创建下载的链接
          link.href = href;
          link.download = '工单列表导出.xls'; //下载后文件名
          document.body.appendChild(link);
          link.click(); //点击下载
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        } else {
          this.$Message.error('导出文件失败');
        }
        this.exportLoading = false;
      });
    },
    handleCancel(val) {
      this.isHandler = false;
      if (val) this.refreshTable();
    },
    handleCancelLawyer(val) {
      this.isHandleLawyer = false;
      if (val) this.refreshTable();
    },

    // 执行脚本前提示
    getScriptValidate() {
      const { countryCode, acceptEndTime, acceptStartTime, nodeServiceProgressName } = this.listQuery;
      if (!countryCode || !acceptEndTime || !acceptStartTime || !nodeServiceProgressName) {
        this.$Message.warning('请先确认国家、注册进度、受理时间筛选项');
        return false;
      }
      if (!this.tableData.length) {
        this.$Message.warning('暂无可用数据');
        return false;
      }
      return true;
    },

    // 获取Python脚本查询日志
    getPythonLog() {
      API.pythonLogApi().then((res) => {
        if (res.code === 0) {
          this.pythoLog = isEmpty(res.data) ? '暂无数据' : res.data;
        }
      });
    },

    // 脚本接口调用状态限制
    checkPythonRequest(data) {
      const { url, scriptType } = data;
      API.checkPythonRequest({
        enterpriseid: localStorage.getItem('enterpriseId'),
        scriptType,
      }).then((res) => {
        if (res.data) {
          this.executeScript(url);
        } else {
          this.$Message.warning('脚本正在执行中...');
        }
      });
    },

    // 脚本接口公共方法
    executeScript(url) {
      if (!this.getScriptValidate()) {
        return;
      }
      const { countryCode, acceptEndTime, acceptStartTime, nodeServiceProgressName } = this.listQuery;
      const params = {
        countryCode,
        acceptEndTime,
        acceptStartTime,
        nodeServiceProgressName,
        enterpriseid: localStorage.getItem('enterpriseId'),
        authorization: encodeURI('Bearer ' + getToken()),
      };
      axios({
        url,
        params,
        method: 'get',
      }).then((res) => {
        if (res.data.code === 200) {
          this.$Message.success('脚本已执行');
        }
      });
    },

    // 受理回执录入
    acceptanceReceipt() {
      this.checkPythonRequest({
        url: `${pythonHost}/shoulihuizhiluru/`,
        scriptType: '3',
      });
    },

    // 公告录入
    announcementEntry() {
      this.checkPythonRequest({
        url: `${pythonHost}/inputgonggao/`,
        scriptType: '4',
      });
    },

    // 注册号-注册日期
    registrationNum() {
      this.checkPythonRequest({
        url: `${pythonHost}/inputregistrationnumber/`,
        scriptType: '5',
      });
    },

    // 审查意见
    reviewOpinion() {
      this.checkPythonRequest({
        url: `${pythonHost}/inputreviewcomment/`,
        scriptType: '2',
      });
    },

    // 上传商标证书
    uploadCertificate() {
      this.checkPythonRequest({
        url: `${pythonHost}/uploadtrademarkcertificate/`,
        scriptType: '6',
      });
    },

    // 受理号查询并录入
    acceptanceQuery(item) {
      const { countryCode, nodeServiceProgressName } = this.listQuery;
      if (!countryCode || !nodeServiceProgressName) {
        this.$Message.warning('请先确认国家、注册进度筛选项');
        return false;
      }
      if (!this.tableData.length) {
        this.$Message.warning('暂无可用数据');
        return false;
      }
      const params = {
        email_count: item.email,
        enterpriseid: localStorage.getItem('enterpriseId'),
        authorization: encodeURI('Bearer ' + getToken()),
      };

      API.checkPythonRequest({
        enterpriseid: localStorage.getItem('enterpriseId'),
        scriptType: '1',
      }).then((res) => {
        if (res.data) {
          axios({
            url: `${pythonHost}/numberinput/`,
            params,
            method: 'get',
          }).then((res) => {
            if (res.data.code === 200) {
              this.$Message.success('脚本已执行');
            }
          });
        } else {
          this.$Message.warning('脚本正在执行中...');
        }
      });
    },

    // 清空缓存
    clearCache() {
      clearPythonCache().then((res) => {
        if (res.code == 0) {
          this.$message.success('操作成功');
        }
      });
    },
    // 获取商标二级状态
    getTrademarkStatusTwoList() {
      API.getTrademarkStatusTwoList({ countryCode: 'US' }).then((res) => {
        if (res.code == 0) {
          this.trademarkStatusTwoList = res.data;
        }
      });
    },
    // 获取列表项
    handleTrademarkRow(row) {
      this.trademarkRow = row;
      this.trademarkRecordModalVisible = true;
    },
    // 跳转到核名详情页
    goTrademarkRecordDetailPage(row) {
      const { id, recordNo } = row.trademarkSearchRecordWorkRelWorkOrderList[0];
      this.$router.push(`/adminNewApp/workOrder/intellectualProperty/trademarkNameReviewRecord/details?id=${id}&recordNo=${recordNo}`);
    },
    // 通过率
    getPassRateResult(item) {
      if (!item.reportType) {
        return '--';
      } else {
        let str = !item.checkPassRate && !item.checkResult ? '无修改建议' : `${item.checkPassRate}，${item.checkResult}`;
        return `${reportTypeMap[item.reportType] || '--'}: ${str}`;
      }
    },
  },
  watch: {
    'listQuery.countryCode': {
      handler: function (val) {
        this.getLawyerList(val);
      },
      immediate: true,
    },
  },
};
</script>
<style scoped lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
.app-container {
  height: 100%;
  position: relative;
}
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  line-height: 1;
  span {
    flex: 3;
  }
}
.operate {
  .search-btn {
    margin-right: 10px;
  }
  text-align: right;
  margin-top: -53px;
  margin-bottom: 30px;
  position: relative;
  /deep/ .el-dropdown {
    margin-right: 10px;
  }
}
.table-container {
  /deep/ .el-link {
    font-size: 12px;
  }
}
</style>
