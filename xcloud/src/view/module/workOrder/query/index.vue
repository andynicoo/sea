<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
        <el-form ref="searchForm" :model="form" inline>
          <el-form-item label="" prop="mobile">
            <el-input v-model="form.mobiles" placeholder="手机号" clearable style="width: 168px" size="small">
              <el-tooltip content="批量查询" placement="top" slot="suffix">
                <i class="el-icon-edit el-input__icon" @click="showSearchModel('mobiles')"> </i>
              </el-tooltip>
            </el-input>
          </el-form-item>

          <el-form-item label="" prop="companyName">
            <el-input v-model.trim="form.companyName" placeholder="公司名称" clearable style="width: 228px" size="small" />
          </el-form-item>

          <el-form-item label="" prop="orderNo">
            <el-input v-model="form.orderNos" placeholder="订单号" clearable style="width: 168px" size="small">
              <el-tooltip content="批量查询" placement="top" slot="suffix">
                <i class="el-icon-edit el-input__icon" @click="showSearchModel('orderNos')"> </i>
              </el-tooltip>
            </el-input>
          </el-form-item>

          <el-form-item label="" prop="serviceNo">
            <el-input v-model="form.serviceNos" placeholder="服务号" clearable style="width: 228px" size="small">
              <el-tooltip content="批量查询" placement="top" slot="suffix">
                <i class="el-icon-edit el-input__icon" @click="showSearchModel('serviceNos')"> </i>
              </el-tooltip>
            </el-input>
          </el-form-item>

          <el-form-item style="margin-left: 20px">
            <el-button type="primary" size="small" icon="el-icon-search" :loading="tableLoading" @click="search"> 查一下 </el-button>
            <el-button icon="el-icon-refresh" @click="reset" size="small"> 重置 </el-button>
            <el-button type="text" size="small" @click="handleMoreSearch" v-if="activeName != '4'">
              <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
              {{ moreSerch ? '收起' : '' }}高级查询
            </el-button>
          </el-form-item>

          <div class="more-search" v-show="moreSerch">
            <template v-if="activeName == '2'">
              <el-form-item prop="orderDTO.sellUserId">
                <el-select style="width: 310px" clearable filterable v-model="form.orderDTO.sellUserId" placeholder="销售人员">
                  <el-option-group>
                    <li class="option_title" style="background: #f6f8fa">
                      <span>姓名</span>
                      <span>手机号</span>
                      <span>部门</span>
                    </li>

                    <el-option v-for="item in followList" :key="item.userId" :label="item.nickName" :value="item.userId" class="option_title">
                      <span>{{ item.nickName }}</span>
                      &nbsp;
                      <span>{{ item.mobile }}</span>
                      &nbsp;
                      <span>{{ item.departmentName }}</span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>

              <el-form-item prop="orderDTO.orderType">
                <el-select style="width: 150px" clearable v-model="form.orderDTO.orderType" placeholder="订单类型">
                  <el-option label="正常订单" :value="0"></el-option>
                  <el-option label="续费订单" :value="1"></el-option>
                  <el-option label="项目制订单" :value="2"></el-option>
                  <el-option label="溢价订单" :value="3"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="orderDTO.paymentChannel">
                <el-select style="width: 200px" clearable v-model="form.orderDTO.paymentChannel" placeholder="支付方式">
                  <el-option label="微信" :value="1"></el-option>
                  <el-option label="支付宝" :value="2"></el-option>
                  <el-option label="银联" :value="3"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="paymentType">
                <el-select style="width: 150px" clearable v-model="form.orderDTO.paymentType" placeholder="付款类型">
                  <el-option label="正常付款" :value="0"></el-option>
                  <el-option label="挂账付款" :value="1"></el-option>
                  <el-option label="分期付款" :value="2"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="orderSource">
                <el-select style="width: 150px" clearable v-model="form.orderDTO.orderSource" placeholder="订单来源">
                  <el-option label="PC端" :value="1"></el-option>
                  <el-option label="H5端" :value="2"></el-option>
                  <el-option label="手工录入" :value="3"></el-option>
                  <el-option label="渠道系统" :value="5"></el-option>
                </el-select>
              </el-form-item>

              <el-row>
                <el-form-item prop="orderTimeType">
                  <el-select style="width: 150px" clearable v-model="orderTimeType" placeholder="时间点">
                    <el-option label="下单时间" :value="1"></el-option>
                    <el-option label="付款时间" :value="2"></el-option>
                  </el-select>

                  <el-date-picker
                    v-model="createTime"
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
                    style="width: 240px"
                  ></el-date-picker>
                </el-form-item>
              </el-row>
            </template>

            <template v-if="activeName == '1' || activeName == '3'">
              <el-form-item prop="serviceDTO.productFunctionCode">
                <el-select style="width: 168px" placeholder="业务类型" v-model="form.serviceDTO.productFunctionCode" clearable filterable @change="getServiceProgress">
                  <el-option v-for="(item, index) in functionCodeList" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="serviceDTO.countryCode">
                <el-select style="width: 168px" v-model="form.serviceDTO.countryCode" placeholder="国家" clearable filterable>
                  <el-option v-for="item in countrySelect" :value="item.countryCode" :key="item.id" :label="item.countryNameZh"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="serviceDTO.taxNumber">
                <el-input v-model="form.serviceDTO.taxNumber" placeholder="税号" clearable style="width: 168px" size="small"> </el-input>
              </el-form-item>

              <el-form-item prop="serviceDTO.node">
                <el-select style="width: 168px" v-model="form.serviceDTO.nodeName" placeholder="服务进度" clearable filterable>
                  <el-option v-for="(item, index) in progressList" :key="index" :label="item.nodeName" :value="item.nodeName"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="serviceDTO.serviceStatus">
                <el-select style="width: 168px" v-model="form.serviceDTO.serviceStatus" placeholder="服务状态" clearable filterable>
                  <el-option v-for="(item, index) in statusList" :key="index" :label="item.value" :value="item.code"></el-option>
                </el-select>
              </el-form-item>

              <el-row>
                <el-form-item prop="timeType">
                  <el-select style="width: 150px" clearable v-model="form.serviceDTO.timeType" placeholder="时间点">
                    <el-option :label="item.lable" :value="item.value" v-for="(item, index) in filterTimeTypeList" :key="index"></el-option>
                  </el-select>

                  <el-date-picker
                    v-model="serviceTime"
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
                    style="width: 240px"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item prop="serviceExpirationTime" label="服务截止时间" v-if="showServiceExpirationTime">
                  <el-date-picker
                    v-model="serviceExpirationTime"
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
                    style="width: 240px"
                  ></el-date-picker>
                </el-form-item>
              </el-row>
            </template>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-tabs ref="elTabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.nodeName" :name="item.nodeCode"></el-tab-pane>
      </el-tabs>

      <!-- 综合信息 -->

      <el-table border :data="compositeInfoVOList" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight" v-show="activeName == '1'">
        <Empty slot="empty" />
        <el-table-column align="center" width="110" label="订单号" show-overflow-tooltip prop="orderNo"></el-table-column>
        <el-table-column align="center" label="订单状态" show-overflow-tooltip prop="orderStatus">
          <template slot-scope="scope">{{ scope.row.orderStatus | filterOrderStatus }}</template>
        </el-table-column>
        <el-table-column align="center" width="110" label="销售人员" show-overflow-tooltip prop="attributionName"> </el-table-column>
        <el-table-column align="center" width="150" label="服务名称" show-overflow-tooltip prop="serviceName"></el-table-column>
        <el-table-column align="center" label="国家" show-overflow-tooltip prop="countryNameZh"> </el-table-column>
        <el-table-column align="center" label="服务号" show-overflow-tooltip prop="serviceNo"> </el-table-column>
        <el-table-column align="center" label="公司名称" show-overflow-tooltip prop="companyNameZh"> </el-table-column>
        <el-table-column align="center" label="服务状态" show-overflow-tooltip prop="orderStatus">
          <template slot-scope="scope">{{ scope.row.status | filterStatus(statusList) }}</template>
        </el-table-column>
        <el-table-column align="center" label="服务进度" show-overflow-tooltip prop="cureentNodeName">
          <template slot-scope="scope">{{ scope.row.cureentNodeName }}</template>
        </el-table-column>
        <el-table-column align="center" width="90" label="客户手机号" show-overflow-tooltip prop="mobile"></el-table-column>
        <el-table-column align="center" label="处理人" prop="handlerUserName"> </el-table-column>
      </el-table>

      <!-- 订单信息 -->
      <el-table border :data="formatList" :span-method="objectSpanMethod" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight" v-show="activeName == '2'">
        <Empty slot="empty" />
        <el-table-column align="center" width="110" label="订单号" show-overflow-tooltip prop="orderNo"></el-table-column>
        <el-table-column align="center" width="150" label="下单时间" prop="createTime">
          <template slot-scope="scope"> {{ (scope.row.createTime || '').split(' ')[0] }}</template>
        </el-table-column>
        <el-table-column align="center" label="客户手机号" prop="userMobile"> </el-table-column>
        <el-table-column align="center" width="150" label="商品名称" show-overflow-tooltip prop="productProjectName"></el-table-column>
        <el-table-column align="center" label="国家" prop="countryName"> </el-table-column>
        <el-table-column align="center" label="商品金额" prop="productOldMoney">
          <template slot-scope="scope">{{ scope.row.productOldMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="优惠金额" prop="discAmountMoney">
          <template slot-scope="scope">{{ scope.row.discAmountMoney | formatQianFenWei }}</template>
        </el-table-column>
        <el-table-column align="center" label="应付金额" prop="orderMoney"></el-table-column>
        <el-table-column align="center" label="实付金额" prop="amountMoney">
          <template slot-scope="scope">{{ scope.row.amountMoney | formatQianFenWei }}</template>
        </el-table-column>

        <el-table-column align="center" label="订单来源" prop="orderSource">
          <template slot-scope="scope">{{ scope.row.orderSource == 1 ? 'PC网页端' : scope.row.orderSource == 2 ? 'H5端' : scope.row.orderSource == 3 ? '手工录入' : scope.row.orderSource == 4 ? '微信小程序' : scope.row.orderSource == 5 ? '渠道系统' : '' }} </template>
        </el-table-column>
        <el-table-column align="center" label="订单状态" prop="status">
          <template slot-scope="scope">{{ scope.row.status | filterOrderStatus }}</template>
        </el-table-column>
        <el-table-column align="center" label="订单类型" prop="orderType">
          <template slot-scope="scope">{{ scope.row.orderType == 0 ? '正常订单' : scope.row.orderType == 1 ? '续费订单' : scope.row.orderType == 2 ? '项目制订单' : scope.row.orderType == 3 ? '溢价订单' : '' }} </template>
        </el-table-column>
        <el-table-column align="center" label="销售人员" show-overflow-tooltip prop="attributionName"> </el-table-column>
        <el-table-column align="center" label="操作" prop="refundMoney">
          <template slot-scope="{ row }">
            <div>
              <el-link type="primary" v-show="hasAuthority('Q_1')" @click="showDetailModal(row)">订单详情</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 服务信息 -->
      <el-table border :data="selectServiceVOList" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight" v-show="activeName == '3'">
        <Empty slot="empty" />
        <el-table-column align="center" width="110" label="订单号" show-overflow-tooltip prop="orderNo"></el-table-column>
        <el-table-column align="center" width="150" label="服务号" show-overflow-tooltip prop="serviceNo"> </el-table-column>
        <el-table-column align="center" width="110" label="公司名称" show-overflow-tooltip prop="companyNameZh"> </el-table-column>
        <el-table-column align="center" label="服务名称" show-overflow-tooltip prop="serviceName"></el-table-column>
        <el-table-column align="center" label="国家" show-overflow-tooltip prop="countryNameZh"> </el-table-column>
        <el-table-column align="center" label="业务分类" show-overflow-tooltip prop="productFunctionCode">
          <template slot-scope="scope">{{ scope.row.productFunctionCode | filterProductFunction(functionCodeList) }}</template>
        </el-table-column>

        <el-table-column align="center" label="服务状态" show-overflow-tooltip prop="status">
          <template slot-scope="scope">{{ scope.row.status | filterStatus(statusList) }}</template>
        </el-table-column>
        <el-table-column align="center" label="服务进度" show-overflow-tooltip prop="orderSource">
          <template slot-scope="scope">{{ scope.row.cureentNodeName }}</template>
        </el-table-column>
        <el-table-column align="center" width="90" label="客户手机号" show-overflow-tooltip prop="mobile"></el-table-column>
        <el-table-column align="center" label="销售人员" prop="attributionName"> </el-table-column>
        <el-table-column align="center" label="处理人" prop="handlerUserName"> </el-table-column>
        <el-table-column align="center" label="服务截止时间" prop="expirationTime">
          <template slot-scope="scope">
            {{ (scope.row.expirationTime || '').split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" prop="refundMoney">
          <template slot-scope="{ row }">
            <div>
              <el-link type="primary" target="_blank" v-show="hasAuthority('Q_2')" @click="seeDetail(row)">查看工单</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 关联公司 -->
      <el-table border :data="joinCompanyNameList" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight" v-show="activeName == '4'">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" show-overflow-tooltip prop="orderNo">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="公司名称" show-overflow-tooltip prop="companyNameZh"> </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="form.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <BatchSearchModel :batchSearchDialog.sync="batchSearchDialog" :batchStr="batchStr" :type="type" :setBatchSearch="setBatchSearch" />
  </div>
</template>

<script>
import { getQueryList } from '@/api/newApi/workOrder/serviceQuery';
import { getFunctionCode } from '@/api/newApi/supplyChain/assignProcessor.js';
import { serviceStatus, getCountrySelectList, serviceProgress } from '@/api/newApi/common';
import cacheQuery from '@/mixins/cacheQuery';
import { userList } from '@/api/newApi/common.js';
import moment from 'moment';
import BatchSearchModel from './components/batchSearchModel';
export default {
  data() {
    return {
      followList: [],
      compositeInfoVOList: [],
      selectServiceVOList: [],
      joinCompanyNameList: [],
      tabs: [
        {
          nodeName: '综合信息',
          nodeCode: '1',
        },
        {
          nodeName: '订单信息',
          nodeCode: '2',
        },
        {
          nodeName: '服务信息',
          nodeCode: '3',
        },
        {
          nodeName: '关联公司',
          nodeCode: '4',
        },
      ],
      list: [],
      createTime: [],
      serviceExpirationTime: [],
      serviceTime: [],
      statusList: [],
      formatList: [],
      batchSearchDialog: false,
      type: '',
      total: 0,
      mobiles: '',
      orderNos: '',
      serviceNos: '',
      showServiceExpirationTime: false,
      orderTimeType: null,
      form: {
        page: 1,
        limit: 10,
        mobile: [],
        orderNo: [],
        companyName: '',
        mobiles: '',
        orderNos: '',
        serviceNos: '',
        serviceNo: [],
        orderDTO: {
          sellUserId: '',
          paymentType: '',
          paymentChannel: '',
          orderType: '',
          orderSource: '',
          orderStartTime: '',
          orderEndTime: '',
          orderStartTime: '',
          orderEndTime: '',
          paymentStartTime: '',
          paymentEndTime: '',
        },
        top: 1,
        serviceDTO: {
          handlerUserId: '',
          countryCode: '',
          node: '',
          nodeName: '',
          productFunctionCode: '',
          serviceExpirationEndTime: '',
          serviceExpirationStartTime: '',
          startTime: '',
          endTime: '',
          serviceStatus: '',
          taxNumber: '',
          timeType: null,
        },
      },
      functionCodeList: [],
      activeName: '1',
      copyListQuery: {},
      copyOrderDTO: {},
      copyServiceDTO: {},
      batchStr: '',
      createTime: [],
      countrySelect: [],
      cacheKey: 'form',
      progressList: [],
      tableLoading: false,
      searchFlag: false,
      moreSerch: false,
      regFlag: false,
      isOver100: false,
      filterTimeTypeList: [],
      timeTypeList: [
        {
          lable: '税号下发时间',
          value: 1,
          code: 5,
        },
        {
          lable: '转代理完成时间',
          value: 2,
          code: 2,
        },
        {
          lable: '税务稽查完成时间',
          value: 3,
          code: 7,
        },
        {
          lable: '退税完成时间',
          value: 4,
          code: 24,
        },
        {
          lable: 'EPR服务完成时间',
          value: 5,
          code: 31,
        },
        {
          lable: '授权代表协议生效时间',
          value: 6,
          code: 16,
        },
        {
          lable: '极简工单完成时间',
          value: 7,
          code: 20,
        },
        {
          lable: '海牙认证完成时间',
          value: 8,
          code: 13,
        },
        {
          lable: '授权代表协议到期时间',
          value: 9,
          code: 16,
        },
        {
          lable: '税号注销完成时间',
          value: 10,
          code: 6,
        },
      ],
    };
  },
  mixins: [cacheQuery],
  filters: {
    filterStatus(status, statusList) {
      let result = statusList.find((item) => item.code === status);
      return result ? result.value : '';
    },
    filterProductFunction(status, functionCodeList) {
      let result = functionCodeList.find((item) => item.id === status);
      return result ? result.name : '';
    },
    filterCureentNodeName(node, progressList) {
      let result = progressList.find((item) => item.id === node);
      return result ? result.value : '';
    },
    filterOrderStatus(orderStatus) {
      switch (orderStatus) {
        case 0:
          return '待付款';
        case 1:
          return '付款待确认';
        case 2:
          return '已付款';
        case 3:
          return '已取消';
        case 4:
          return '部分付款';
        case 5:
          return '部分退款';
        case 6:
          return '已退款';
        case 10:
          return '订单驳回';
        case 11:
          return '付款被驳回';
        case 12:
          return '待审核';
      }
    },
    filterOrderSource(orderSource) {
      switch (orderSource) {
        case 1:
          return 'PC网页端';
        case 2:
          return 'H5';
        case 3:
          return '手工录入';
        case 4:
          return '微信小程序';
      }
    },
    filterOrderType(orderType) {
      switch (orderType) {
        case 0:
          return '普通订单';
        case 1:
          return '续费订单';
      }
    },
  },
  components: {
    BatchSearchModel,
  },
  created() {
    this.copyListQuery = JSON.parse(JSON.stringify(this.form));
    this.copyOrderDTO = { ...this.form.orderDTO };
    this.copyServiceDTO = { ...this.form.serviceDTO };
    this.getPageCache();
    this.getServiceProgress();
    this.activeName = String(this.form.top);
    this.getList();
    this.getStatus();
    this.getCode();
    this.getUserList();
    this.getCountrySelectList();
  },
  methods: {
    showSearchModel(type) {
      this.batchSearchDialog = true;
      this.type = type;
      this.batchStr = this.form[type];
    },
    setBatchSearch(type, val) {
      this.form[type] = val;
      this.getList();
    },
    seeDetail(row) {
      this.$router.push({ name: 'queryOrderDetail', query: { id: row.id } });
    },
    /**
     * 详情
     */
    showDetailModal(row) {
      this.$router.push({ name: 'queryDetail', query: { id: row.id } });
    },
    /**
     * 获取国家下拉框数据
     */
    getCountrySelectList() {
      getCountrySelectList()
        .then((res) => {
          this.countrySelect = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    /**
     * 服务类型
     */
    getCode() {
      getFunctionCode().then((res) => {
        if (res.code === 0) {
          let result = res.data;
          for (let i in result) {
            this.functionCodeList.push({ id: i - 0, name: result[i] });
          }
        }
      });
    },
    /**
     *归属人下拉列表
     */
    getUserList() {
      userList({
        page: 1,
        limit: 100,
      }).then((res) => {
        if (res.code == 0) {
          this.followList = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //tabs切换时调用数据
    handleClick() {
      // if (this.activeName != -1) {
      //   this.listQuery.currentNodeCode = this.activeName;
      // } else {
      //   this.listQuery.currentNodeCode = "";
      // }
      // this.form.top = Number(this.activeName)
      this.form.orderDTO = { ...this.copyOrderDTO };
      this.form.serviceDTO = { ...this.copyServiceDTO };
      this.createTime = [];
      this.serviceExpirationTime = [];
      this.serviceTime = [];
      this.orderTimeType = null;
      this.form.page = 1;
      this.getList(true);
    },
    getStatus() {
      serviceStatus().then((res) => {
        this.statusList = res.data;
      });
    },
    // 列表查询服务进度列表
    getServiceProgress() {
      this.form.serviceDTO.nodeName = '';
      if (this.form.serviceDTO.productFunctionCode) {
        if (this.form.serviceDTO.productFunctionCode == 20) {
          this.progressList = [
            {
              nodeCode: '',
              nodeName: '待处理',
              nodeValue: 1,
            },
            {
              nodeCode: '',
              nodeName: '处理中',
              nodeValue: 2,
            },
            {
              nodeCode: '',
              nodeName: '已完成',
              nodeValue: 3,
            },
            {
              nodeCode: '',
              nodeName: '已取消',
              nodeValue: 4,
            },
            {
              nodeCode: '',
              nodeName: '待上传资料',
              nodeValue: 5,
            },
            {
              nodeCode: '',
              nodeName: '待审核',
              nodeValue: 6,
            },
          ];
        } else {
          serviceProgress({ functionCode: this.form.serviceDTO.productFunctionCode })
            .then((res) => {
              if (res.code == 0) {
                this.progressList = res.data;
              }
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        }

        this.filterTimeTypeList = this.timeTypeList.filter((item) => item.code == this.form.serviceDTO.productFunctionCode);
      } else {
        this.progressList = [];
        this.filterTimeTypeList = [];
      }
      if (this.filterTimeTypeList.length) {
        this.form.serviceDTO.timeType = this.filterTimeTypeList[0].value;
      } else {
        this.form.serviceDTO.timeType = '';
      }
      this.serviceTime = [];

      if ([5, 2, 31, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 16].includes(this.form.serviceDTO.productFunctionCode)) {
        this.showServiceExpirationTime = true;
      } else {
        this.showServiceExpirationTime = false;
        this.serviceExpirationTime = [];
      }
    },

    formatListData() {
      let list = [];
      this.list.forEach((item) => {
        item.orderProducts.forEach((infoList, i) => {
          list.push({
            ...infoList,
            ...item,
            rowspan: item.orderProducts.length,
            index: i,
          });
        });
      });
      this.formatList = list;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let combineList = ['orderNo'];
      if (combineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },
    getList(flag) {
      if (!flag) this.getSearchTime();
      this.getBatchSearch();
      if (this.form.serviceDTO.taxNumber && !this.form.serviceDTO.productFunctionCode) {
        return this.$message.warning('请选择业务类型!');
      }
      if (this.isOver100) {
        this.$message.error('单次批量查询支持100条数据');
        return;
      }
      if (this.regFlag) {
        return;
      }
      if ((this.form.mobile.length > 1 && this.form.orderNo.length > 1) || (this.form.mobile.length > 1 && this.form.serviceNo.length > 1) || (this.form.orderNo.length > 1 && this.form.serviceNo.length > 1)) {
        return this.$message.error('批量查询条件仅支持一种条件查询');
      }
      if (this.form.serviceDTO.nodeName) {
        const obj = this.progressList.find((item) => item.nodeName == this.form.serviceDTO.nodeName);
        this.form.serviceDTO.node = (obj || {}).nodeCode;
        this.form.serviceDTO.progressBar = (obj || {}).nodeValue;
      } else {
        this.form.serviceDTO.node = '';
        this.form.serviceDTO.progressBar = '';
      }
      this.form.top = Number(this.activeName);
      this.tableLoading = true;
      this.searchFlag = true;
      this.setPageCache();
      const req = JSON.parse(JSON.stringify(this.form));
      getQueryList(req)
        .then((res) => {
          this.tableLoading = false;
          if (req.top == 1) {
            if (res.data.compositeInfoVO && res.data.compositeInfoVO.records && res.data.compositeInfoVO.records.length) {
              this.compositeInfoVOList = res.data.compositeInfoVO.records;
              this.total = parseInt(res.data.compositeInfoVO.total);
            } else {
              this.compositeInfoVOList = [];
              this.total = 0;
            }
          } else if (req.top == 2) {
            if (res.data.orderVO && res.data.orderVO.records && res.data.orderVO.records.length) {
              this.list = res.data.orderVO.records;
              this.total = parseInt(res.data.orderVO.total);
              this.formatListData();
            } else {
              this.formatList = [];
              this.total = 0;
            }
          } else if (req.top == 3) {
            if (res.data.selectServiceVO && res.data.selectServiceVO.records && res.data.selectServiceVO.records.length) {
              this.selectServiceVOList = res.data.selectServiceVO.records;
              this.total = parseInt(res.data.selectServiceVO.total);
            } else {
              this.selectServiceVOList = [];
              this.total = 0;
            }
          } else if (req.top == 4) {
            if (res.data.joinCompanyName && res.data.joinCompanyName.records && res.data.joinCompanyName.records.length) {
              this.joinCompanyNameList = res.data.joinCompanyName.records;
              this.total = parseInt(res.data.joinCompanyName.total);
            } else {
              this.joinCompanyNameList = [];
              this.total = 0;
            }
          }

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
          this.tableLoading = false;
          this.joinCompanyNameList = [];
          this.compositeInfoVOList = [];
          this.formatList = [];
          this.selectServiceVOList = [];
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
      // if(JSON.stringify(this.form) === JSON.stringify(this.copyListQuery)) {
      //   if(this.formatList.length) {
      //     this.formatList = []
      //   }
      //   return
      // }

      this.form.page = 1;
      this.moreSerch = false;

      this.getList();
    },
    getBatchSearch() {
      this.regFlag = false;
      this.isOver100 = false;
      if (this.form.mobiles) {
        const res = this.getStrArray(this.form.mobiles.trim());
        if (res) {
          this.form.mobile = res;
        }
      } else {
        this.form.mobile = [];
      }
      if (this.form.orderNos) {
        const res = this.getStrArray(this.form.orderNos.trim());
        if (res) {
          this.form.orderNo = res;
        }
      } else {
        this.form.orderNo = [];
      }
      if (this.form.serviceNos) {
        const res = this.getStrArray(this.form.serviceNos.trim());
        if (res) {
          this.form.serviceNo = res;
        }
      } else {
        this.form.serviceNo = [];
      }
    },
    getSearchTime() {
      if (this.orderTimeType == 1) {
        [this.form.orderDTO.orderStartTime, this.form.orderDTO.orderEndTime] = this.createTime && this.createTime.length ? this.createTime : ['', ''];
        this.form.paymentStartTime = '';
        this.form.paymentEndTime = '';
      } else if (this.orderTimeType == 2) {
        [this.form.orderDTO.paymentStartTime, this.form.orderDTO.paymentEndTime] = this.createTime && this.createTime.length ? this.createTime : ['', ''];
        this.form.orderStartTime = '';
        this.form.orderEndTime = '';
      }
      [this.form.serviceDTO.serviceExpirationStartTime, this.form.serviceDTO.serviceExpirationEndTime] = this.serviceExpirationTime && this.serviceExpirationTime.length ? this.serviceExpirationTime : ['', ''];
      [this.form.serviceDTO.startTime, this.form.serviceDTO.endTime] = this.serviceTime && this.serviceTime.length ? this.serviceTime : ['', ''];
    },
    getStrArray(str) {
      const reg1 = /^[0-9a-zA-z]+(\/[0-9a-zA-z]+)*$/;
      const reg2 = /^[0-9a-zA-z]+(,[0-9a-zA-z]+)*$/;
      const reg3 = /^[0-9a-zA-z]+(\s[0-9a-zA-z]+)*$/;
      if (reg1.test(str)) {
        if (str.split('/').length > 100) {
          this.isOver100 = true;
        }
        return str.split('/');
      }
      if (reg2.test(str)) {
        if (str.split(',').length > 100) {
          this.isOver100 = true;
        }
        return str.split(',');
      }
      if (reg3.test(str)) {
        if (str.split(/\s+/).length > 100) {
          this.isOver100 = true;
        }
        return str.split(/\s+/);
      }

      this.regFlag = true;

      this.$Message.error('请输入正确的格式，用逗号换行空格或/分割');
      return null;
    },
    reset() {
      // if(this.$refs.searchForm) {
      //   this.$refs.searchForm.resetFields()
      // }
      // this.initCreateTime();
      this.removePageCache();
      this.createTime = [];
      this.serviceExpirationTime = [];
      this.serviceTime = [];
      this.orderTimeType = null;
      // this.mobiles = ''
      // this.orderNos = ''
      // this.serviceNos = ''
      this.form = JSON.parse(JSON.stringify(this.copyListQuery));
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
  line-height: 1;
  span {
    flex: 3;
  }
}
</style>
