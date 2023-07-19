<template>
  <div class="container">
    <!-- <div class="bannerbox">
      <IndexBanner :adKey="'renewalservice_top_banner'" :height="90" />
    </div> -->
    <div class="commontitle">
      续费管理
      <img src="@/assets/images/common/icon-tips.svg" class="hand" @click="alterVisible = true" />
    </div>

    <div class="infoTb">
      <a-alert
        class="renewal-tips-info"
        message="温馨提示：当您的申报商品未能及时续费且服务状态变为已失效时，您将不能直接续费原服务。若有需要，建议您尽早续费！"
        type="info"
        closable
      />
      <div class="searchForm-box">
        <SearchForm :col-item="colItem" :form-model="searchParams" @submit="handleSearch" @reset="resetFields" />
      </div>
      <div class="renewal-content">
        <div class="remaining-service-time-box">
          <a-button @click="exportRrenewal" type="primary" class="export-renewal-list"
            ><img src="./../../../images/common/export-icon.png" />导出续费清单</a-button
          >
          剩余服务时间:<span
            v-for="item in residualsList"
            :key="item.value"
            :class="{ current: item.select }"
            @click="changeSurplusType(item)"
          >
            {{ item.label }}({{ item.quantity }})
          </span>
        </div>
        <a-table
          :columns="columns"
          :data-source="dataSource"
          rowKey="serviceId"
          :pagination="getPagination"
          @change="changePage"
          :loading="tableLoading"
          :row-selection="rowSelection"
        >
          <template slot="companyNameZh" slot-scope="text, record">
            {{ text }}
          </template>
          <!-- <template slot="productFunctionCode" slot-scope="text, record">
            <span v-if="productFunctionMap[text]">{{ productFunctionMap[text] }}</span>
            <span v-else-if="eprCode.includes(record.productFunctionCode)">
              {{ record.serviceName }}
            </span>
          </template> -->
          <template slot="spec" slot-scope="text, record, index">
            {{ record.productSpecName }}
            <a
              @click="showSpecModal(index, record)"
              v-if="record.supportRenewProductSpecs.length > 1 && eprCode.includes(record.productFunctionCode)"
            >
              <Icon type="ios-create-outline" />

              修改
            </a>

            <p
              style="color: #ff5050"
              v-if="record.supportRenewProductSpecs.length > 1 && eprCode.includes(row.productFunctionCode)"
            >
              若续费不同服务先请修改续费服务
            </p>
          </template>
          <template slot="status" slot-scope="text, record">
            {{ statusMap[text] }}
            <a-tooltip>
              <template slot="title"
                >请在{{ record.renewLastTime && record.renewLastTime.substring(0, 10) }}前续费，否则此UIN号将失效
              </template>
              <a-icon type="question-circle" v-if="statusText(record)"
            /></a-tooltip>
          </template>
          <template slot="expirationTime" slot-scope="text, record">
            <span class="expiration-time" v-html="timeHandle(record)"></span>
          </template>
          <template slot="price" slot-scope="text, record">
            <span>
              <span style="color: #999; text-decoration: line-through" v-if="record.activityType">
                ￥{{ $util.toDecimalRound(record.productPaymentMoney) }}
              </span>
              <span v-if="record._disabled && !record.showPrice">--</span>
              <span v-else>￥{{ record.productPrice }}</span>
              <img
                v-if="record.activityType === 1"
                class="discount-icon"
                src="./../../../images/common/discount-icon.png"
              />
              <br />
              <span v-if="record.activityType === 1" class="discount-tips">
                提前优惠<span>{{ $util.accMul(record.activityContent, 10) }}折</span>
              </span>
            </span>
          </template>
          <template slot="operate" slot-scope="text, record">
            <div>
              <span v-if="record.productFunctionCode === 16">请联系销售续费</span>
              <template v-else-if="eprCode.includes(record.productFunctionCode)">
                <a-tooltip v-if="record.flagRenewal && record.status == 14" placement="top">
                  <template slot="title">EPR业务最多只能续费1年</template>
                  <span> {{ record.renewLastTime ? record.renewLastTime.substr(0, 4) + '年' : '立即' }}续费 </span>
                </a-tooltip>

                <a-tooltip v-else-if="record.flagRenewal && record.status == 1" placement="left">
                  <template slot="title">
                    明年续费还未开放，将于{{ (record.renewBeginTime || '').substr(0, 10) }}之后开放
                  </template>
                  <span> {{ record.renewLastTime ? record.renewLastTime.substr(0, 4) + '年' : '立即' }}续费 </span>
                </a-tooltip>

                <span
                  class="renew-immediately"
                  v-else-if="!(record.flagRenewal && record.status == 2) && !record._disabled"
                  @click="toSureOrderPage([record])"
                >
                  {{ record.renewLastTime ? record.renewLastTime.substr(0, 4) + '年' : '立即' }}续费
                </span>
              </template>
              <template v-else>
                <span class="renew-immediately" v-if="!record._disabled" @click="toSureOrderPage([record])">
                  立即续费
                </span>
              </template>
            </div>
          </template>
        </a-table>
      </div>
      <div class="pay-box clearfix" :class="{ 'pay-box-width': isScroll }">
        <div class="service-left">
          <a-checkbox v-model="selectAll" :disabled="!dataSource.length" @change="changeCheckbox">全选</a-checkbox>
          <span class="selected-rows-num">
            已选
            <span style="color: #ff5f61">{{ selectedRows.length }}</span>
            个服务
          </span>
        </div>
        <div class="price-right">
          <div class="payPrice-box">
            应付：<span>￥{{ $util.toDecimalRound(payPrice) }}</span>
          </div>
          <div class="totalPrice-box">
            商品总价：￥{{ $util.toDecimalRound(totalPrice) }} 优惠：￥{{ $util.toDecimalRound(discountPrice) }}
          </div>
          <a-button type="primary" class="payPrice-btn" @click="toSureOrderPage(selectedRows)">去付款</a-button>
        </div>
      </div>
    </div>
    <Modal v-model="showRenewalDialog" :mask-closable="false" @on-cancel="clearTimer">
      <p slot="header" style="color: #f60; text-align: center">
        <Icon type="ios-information-circle"></Icon>
        <span>续费须知</span>
      </p>
      <!-- <p>告尊敬的客户：</p> -->
      <!-- <p style="text-indent: 2em">您的原英代/欧代服务1年期满后，原地址标签信息很大概率无法继续使用，续费后需要更换新标签。</p>
      <p style="text-indent: 2em">为避免影响到您店铺的正常运营和销售，例如“无法创建亚马逊物流仓入库欧盟/英国境内销售，产品面临被平台下架禁止销售等风险”，请您及时联系客户经理确认地址是否需要更换。</p>
      <p style="text-indent: 2em">请您提前做好计划避免因大批量印刷而产生不必要的亏损。</p>
      <p style="text-indent: 2em">另外，您续费的服务将生成新的服务号，服务资料将沿用原服务的资料信息，请您确认资料信息并提交（无需重新填写），若您的产品信息有更新，请更新后提交资料。</p> -->
      <p>续费须知</p>
      <p class="textStyle">1.续费时间：最迟到期前1个月确认续费</p>
      <p class="textStyle">2.续费成功所得资料：新协议/证书/标签（如有变动以最新政策为准）</p>
      <p class="textStyle">
        3.温馨提示：由于部分在使用地址，无法继续使用，请在续费前同客户经理确认，如继续点击续费，我司将默认获得许可，为您更换欧代/英代地址。
      </p>
      <div slot="footer" style="text-align: center; margin-top: 15px">
        <Button type="primary" :disabled="!!countDownTime" @click="renewalDialogConfirm">
          确认
          <span v-if="countDownTime > 0">（{{ countDownTime }}s）</span>
        </Button>
      </div>
    </Modal>

    <a-modal
      v-model="alterVisible"
      title="续费服务"
      @ok="alterVisible = false"
      width="580px"
      okText="知道了"
      destroyOnClose
      class="alertdiv"
    >
      <Alert />
    </a-modal>
    <a-modal
      class="spce-modal"
      v-model="specVisible"
      title="选择规格"
      width="580px"
      @ok="selSpec"
      okText="确定"
      cancelText="取消"
    >
      <div>
        <span class="vert-top">{{ label }}:</span>
        <a-radio-group v-model="specValue">
          <a-radio-button :value="item.productSpecId" v-for="item in specList" :key="item.productSpecId">
            {{ item.productSpecName }}
          </a-radio-button>
        </a-radio-group>
      </div>
      <img :src="imgUrl" class="img-wrap" />
    </a-modal>
  </div>
</template>
<script>
import {
  renewalList,
  renewalStatistical,
  companyStatistical,
  renewalExport,
  renewalCountry,
} from '@comp/api/renewal/index.js';

// import IndexBanner from '@/components/IndexBanner/index';
import Alert from './components/alert.vue';
import SearchForm from '@comp/module/components/searchForm';
import tableMixins from '@comp/mixin/tableMixins';
import { sumBy, sortBy } from 'lodash';
import moment from 'moment';
export default {
  mixins: [tableMixins],
  props: {
    showTit: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    dataSource: {
      handler(nv, ov) {
        this.$nextTick(() => {
          var div = document.querySelector('.main-container');
          if (div.scrollHeight > div.clientHeight || div.scrollWidth > div.clientWidth) {
            // div有滚动条
            this.isScroll = true;
          } else {
            // div没有滚动条
            this.isScroll = false;
          }
        });
      },
    },
  },
  computed: {
    colItem({ countryList, productCodeList, companyList }) {
      //搜索配置
      return [
        {
          itemType: 'select',
          label: '公司',
          key: 'companyNameList',
          itemProp: {
            style: 'width:180px',
            mode: 'multiple',
            maxTagCount: 1,
          },
          itemData: companyList,
        },
        {
          itemType: 'select',
          label: '国家',
          key: 'countryList',
          itemProp: {
            style: 'width:180px',
            mode: 'multiple',
          },
          itemData: countryList,
        },
        {
          itemType: 'select',
          label: '服务',
          key: 'serviceType',
          itemProp: {
            style: 'width:180px',
          },
          itemData: productCodeList,
        },
        {
          itemType: 'select',
          label: '状态',
          key: 'serviceStatus',
          itemProp: {
            style: 'width:180px',
            mode: 'multiple',
          },
          itemData: [
            {
              label: '服务中',
              value: '1',
            },
            {
              label: '待续费(已过期 ) ',
              value: '2',
            },
            {
              label: '续费中',
              value: '14',
            },
          ],
        },
        {
          itemType: 'rengePicker',
          label: '截止日期',
          key: 'expirationTime',
          itemProp: {
            style: 'width:212px',
          },
        },
      ];
    },
  },
  data() {
    return {
      //erp服务
      eprCode: [3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108],
      // 国家列表
      countryList: [],
      specVisible: false,
      specValue: '',
      specList: [],
      label: '',
      // 截止时间
      remainingTimeStart: '',
      remainingTimeEnd: '',
      residualsListMap: {
        TOTAL: {
          label: '全部',
          index: 0,
        },
        THIRTY_DAY_WITHIN: {
          label: '30天内',
          start: '0',
          end: '30',
          index: 1,
        },
        THIRTY_FIFTYNINE: {
          label: '30-59天',
          start: '30',
          end: '59',
          index: 2,
        },
        SIXTY_EIGHTYNINE: {
          label: '60-89天',
          start: '60',
          end: '89',
          index: 3,
        },
        NINETY_DAY_AFTER: {
          label: '90天以上',
          start: '90',
          end: '',
          index: 4,
        },
        EXPIRED: {
          label: '已过期',
          index: 5,
        },
      },
      residualsList: [],
      productCodeList: [
        { label: 'VAT服务', value: 'VAT' },
        { label: '合规服务', value: 'COMPLIANCE' },
        // { label: 'EPR服务', value: 'EPR' },
      ],
      // 剩余服务时间是否多选
      selectAllTime: [],
      countDownTime: 6,
      showRenewalDialog: false,

      columns: [
        {
          title: '公司名称',
          dataIndex: 'companyNameZh',
          scopedSlots: { customRender: 'companyNameZh' },
        },
        {
          title: '国家',
          dataIndex: 'countryNameZh',
          width: 100,
        },
        {
          title: '续费服务',
          dataIndex: 'workCategoryName',
          width: 200,
        },
        {
          title: '规格',
          dataIndex: 'spec',
          scopedSlots: { customRender: 'spec' },
        },
        {
          title: '服务状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: 100,
        },

        {
          title: '服务截止日期/剩余天数',
          dataIndex: 'expirationTime',
          scopedSlots: { customRender: 'expirationTime' },
        },
        {
          title: '续费价格(元)',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' },
        },
        {
          title: '操作',
          dataIndex: 'operate',
          scopedSlots: { customRender: 'operate' },
        },
      ],
      // 多选的列表
      rowIndex: null,
      row: [],
      selectAll: false, // 全选
      totalPrice: 0, // 勾选商品的总价
      discountPrice: 0, // 优惠的金额
      payPrice: 0, // 应支付的金额

      // 所有商品信息
      bannerList: [],
      alterVisible: false,

      //表单搜索参数
      searchParams: {
        companyNameZh: '',
        countryCode: '',
        productFunctionCode: '',
        expirationTime: [],
        serviceStatus: [],
      },
      productFunctionMap: {
        1: '税号注册',
        2: '转代理+申报',
        3: '税务补缴',
        4: '转代理',
        5: '注册+申报',
        23: 'IOSS注册+申报',
        16: '授权代表',
      },
      statusMap: {
        1: '服务中',
        2: '待续费',
        3: '税号注销',
        4: '已转出',
        9: '已取消',
        11: '取消中',
        14: '续费中',
      },
      isScroll: true, //是否有滚动条
      imgUrl: '',
      companyList: [
        { label: '阿里巴巴公司', value: '阿里巴巴公司', sum: 5 },
        { label: '腾讯计算机公司', value: '腾讯计算机公司', sum: 0 },
      ],
    };
  },
  components: {
    // IndexBanner,
    Alert,
    SearchForm,
  },
  mounted() {
    this.queryCountry();
    //列表统计
    // renewalStatistical().then((res) => {
    //   res.data.forEach((item) => {
    //     this.residualsList.push({
    //       ...item,
    //       label: `${this.residualsListMap[item.dayPeriod].label}`,
    //       select: this.residualsListMap[item.dayPeriod].index ? false : true,
    //       index: this.residualsListMap[item.dayPeriod].index,
    //       start: this.residualsListMap[item.dayPeriod].start,
    //       end: this.residualsListMap[item.dayPeriod].end,
    //     });
    //   });
    //   this.residualsList = sortBy(this.residualsList, 'index');
    //   if (this.$route.query.type) {
    //     this.residualsList.forEach((item) => {
    //       if (item.dayPeriod === this.$route.query.type) {
    //         this.changeSurplusType(item);
    //       }
    //     });
    //   }
    // });
    //公司列表
    companyStatistical().then((res) => {
      console.log(res);
      this.companyList = [];
      res.data.forEach((item) => {
        this.companyList.push({ label: item.companyName, value: item.companyName, sum: item.num });
      });
    });
  },
  methods: {
    //行选择事件
    onSelectChange(selectedRowKeys, selectedRows) {
      this.$data.selectedRowKeys = selectedRowKeys;
      this.$data.selectedRows = selectedRows;
      console.log('选择的订单：', selectedRows);
      this.selectAll = selectedRows.length === this.dataSource.filter((item) => !item._disabled).length;
      this.calcuRowsPrice();
    },
    getCheckboxProps(record) {
      return {
        props: {
          disabled: record._disabled, // Column configuration not to be checked
          name: record.serviceId,
        },
      };
    },
    /**
     * 剩余服务时间选择
     */
    changeSurplusType(item) {
      if (item.select) return;
      this.residualsList.map((item) => (item.select = false));
      item.select = true;
      this.remainingTimeStart = item.start;
      this.remainingTimeEnd = item.end;
      if (item.dayPeriod === 'EXPIRED') {
        this.dayPeriod = 'EXPIRED';
        this.searchParams.serviceStatus = [];
      } else {
        this.dayPeriod = '';
      }
      this.handleSearch();
    },

    /**
     * 点击查询
     */
    handleSearch() {
      this.paginationData.current = 1;
      this.loadData();
    },
    /**
     * 重置
     */
    resetFields() {
      this.dayPeriod = '';
      this.searchParams = {
        companyNameZh: '',
        countryCode: '',
        productFunctionCode: '',
        expirationTime: [],
        serviceStatus: [],
      };
      this.paginationData = {
        size: '10',
        current: 1,
        total: 0,
      };
      this.residualsList.map((item, index) => {
        item.select = index === 0;
      });
      this.loadData();
    },
    /**
     * 查询国家列表
     */
    queryCountry() {
      renewalCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data.map((item) => {
            return { label: item.countryNameZh, value: item.countryCode };
          });
        }
      });
    },
    //列表统计
    getCountNum() {
      let expirationTime = this.searchParams.expirationTime;
      let expirationTimeStart = '';
      let expirationTimeEnd = '';
      if (expirationTime && expirationTime.length > 0) {
        expirationTimeStart = expirationTime[0] + ' 00:00:00';
        expirationTimeEnd = expirationTime[1] + ' 23:59:59';
      }
      let params = {
        ...this.searchParams,
        expirationTimeStart,
        expirationTimeEnd,
      };
      renewalStatistical({
        ...params,
      }).then((res) => {
        if (this.residualsList.length) {
          res.data.forEach((item) => {
            this.residualsList.forEach((residuals) => {
              if (residuals.dayPeriod == item.dayPeriod) {
                residuals.quantity = item.quantity;
              }
            });
          });
        } else {
          res.data.forEach((item) => {
            this.residualsList.push({
              ...item,
              label: `${this.residualsListMap[item.dayPeriod].label}`,
              select: this.residualsListMap[item.dayPeriod].index ? false : true,
              index: this.residualsListMap[item.dayPeriod].index,
              start: this.residualsListMap[item.dayPeriod].start,
              end: this.residualsListMap[item.dayPeriod].end,
            });
          });
          this.residualsList = sortBy(this.residualsList, 'index');
          if (this.$route.query.type) {
            this.residualsList.forEach((item) => {
              if (item.dayPeriod === this.$route.query.type) {
                this.changeSurplusType(item);
              }
            });
          }
        }
      });
    },
    /**
     * 获取列表
     */
    getTableData() {
      let expirationTime = this.searchParams.expirationTime;
      let expirationTimeStart = '';
      let expirationTimeEnd = '';
      if (expirationTime && expirationTime.length > 0) {
        expirationTimeStart = expirationTime[0] + ' 00:00:00';
        expirationTimeEnd = expirationTime[1] + ' 23:59:59';
      }
      let params = {
        ...this.searchParams,
        expirationTimeStart,
        expirationTimeEnd,
        remainingTimeStart: this.remainingTimeStart,
        remainingTimeEnd: this.remainingTimeEnd,
      };
      if (this.dayPeriod) {
        //已过期status传2
        params.serviceStatus = [2];
      }
      this.tableLoading = true;
      this.currParams = params;
      return renewalList({
        ...params,
        limit: this.paginationData.size,
        page: this.paginationData.current,
      });
    },
    //获取数据后处理函数
    getTableDataAfter() {
      this.dataSource.forEach((item) => {
        if (item.productFunctionCode === 16 || (item.flagRenewal && this.eprCode.includes(item.productFunctionCode))) {
          item.showPrice = true;
          item._disabled = true;
        }
        if (typeof item.productPaymentMoney !== 'number') {
          item.productPaymentMoney = 0;
          item.activityType = 0;
          item._disabled = true;
          if (item.productFunctionCode === 16) {
            item.showPrice = false;
          }
        }
        if (typeof item.productPrice !== 'number') {
          item.productPrice = item.productPaymentMoney;
          item.activityType = 0;
        }
        //productid是空 就不让勾选续费哈 这种是没配置续费商品
        if (!item.productId) {
          item._disabled = true;
        }
      });
      this.onSelectChange([], []);
    },

    // 多选后，计算对应的价格
    calcuRowsPrice() {
      this.totalPrice = 0;
      this.discountPrice = 0;
      this.payPrice = 0;
      this.selectedRows.forEach((v) => {
        this.totalPrice += Number(v.productPaymentMoney);
        this.payPrice += Number(v.productPrice);
        this.discountPrice = this.$util.accSub(this.totalPrice, this.payPrice);
      });
    },
    // 底部的全选和反选
    changeCheckbox(e) {
      // this.$refs.tableRef.selectAll(val);
      let selectedRowKeys = [];
      let selectedRows = [];
      if (e.target.checked) {
        this.dataSource.forEach((item) => {
          if (!item._disabled) {
            selectedRowKeys.push(item.serviceId);
            selectedRows.push(item);
          }
        });
        this.onSelectChange(selectedRowKeys, selectedRows);
      } else {
        this.onSelectChange([], []);
      }
    },

    /**
     * 倒计时
     */
    countDown() {
      this.countDownTime = 6;
      this.clearTimer();
      this.timer = setInterval(() => {
        this.countDownTime -= 1;
        if (this.countDownTime <= 0) {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    /**
     * 清除计时器
     */
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    /**
     * 显示续费须知
     */
    showRenewal() {
      this.countDown();
      this.showRenewalDialog = true;
    },
    /**
     * 续费须知确认
     */
    renewalDialogConfirm() {
      this.showRenewalDialog = false;
      this.routerToSure();
    },
    // toSureOrder(row) {
    //   if (row.supportRenewProductSpecs && row.supportRenewProductSpecs.length > 1) {
    //     this.specVisible = true;
    //     this.specValue = row.productSpecId;
    //     this.row = [row];
    //     this.specList = row.supportRenewProductSpecs;
    //     this.label = row.productName;
    //   } else {
    //     this.toSureOrderPage([row]);
    //   }
    // },
    /**
     * 续费，购买转代理，去支付，统一跳转到订单支付页面
     */
    toSureOrderPage(rows) {
      console.log(rows, 'rows');
      let list = rows.filter((item) => !item._disabled);
      if (!list.length) {
        this.$Message.warning('请至少选择一条数据');
        return;
      }
      const arr = list.map((item) => {
        if (
          item.supportRenewProductSpecs &&
          item.supportRenewProductSpecs.length > 1 &&
          this.eprCode.includes(item.productFunctionCode)
        ) {
          return {
            ...item,
            supportRenewProductSpecs:
              item.supportRenewProductSpecs.filter((el) => el.productSpecId == item.productSpecId) || {},
          };
        } else {
          return { ...item };
        }
      });
      console.log(arr, 'arrarr');
      localStorage.setItem('selectedList', JSON.stringify(arr));
      if (rows.some((item) => item.productFunctionCode === 16)) {
        this.showRenewal();
      } else {
        this.routerToSure();
      }
    },
    routerToSure() {
      this.$router.push({
        path: '/sureOrder',
        query: {
          from: 'renewal',
        },
      });
    },

    //时间处理
    timeHandle(row) {
      let html = '';
      let text = '';
      if (row.expirationTime) {
        html = row.expirationTime.substring(0, 10);
      }
      let nowTime = new Date().setHours(0, 0, 0, 0);
      let endTime = new Date(row.expirationTime).setHours(0, 0, 0, 0);
      if (endTime > nowTime) {
        let ms = endTime - nowTime;
        let days = ms / (24 * 3600 * 1000);
        if (days > 119) {
          text = `<b class="tag-grey">剩${days}天</b>`;
        } else if (days > 44) {
          text = `<b class="tag-blue">剩${days}天</b>`;
        } else if (days > 0) {
          text = `<b class="tag-orange">剩${days}天</b>`;
        }
      } else if (nowTime === endTime) {
        text = '<b class="tag-expired">剩0天</b>';
      } else {
        text = '<b class="tag-expired">已过期</b>';
      }
      if (text) {
        html += text;
      }
      return html;
    },
    //修改规格
    showSpecModal(ind, row) {
      this.rowIndex = ind;
      this.specVisible = true;
      this.specValue = row.productSpecId;
      this.imgUrl = row.pcProductImgUrl;

      this.specList = row.supportRenewProductSpecs;
      this.label = row.productName;
    },
    selSpec() {
      const selSpec =
        this.dataSource[this.rowIndex].supportRenewProductSpecs.find((item) => item.productSpecId == this.specValue) ||
        {};
      this.$set(this.dataSource[this.rowIndex], 'productSpecName', selSpec.productSpecName);
      this.$set(this.dataSource[this.rowIndex], 'productSpecId', selSpec.productSpecId);
      this.$set(this.dataSource[this.rowIndex], 'productOriginalPrice', selSpec.productOriginalPrice);
      this.$set(this.dataSource[this.rowIndex], 'productPrice', selSpec.renewPrice);
      this.$set(this.dataSource[this.rowIndex], 'productPaymentMoney', selSpec.renewPrice);
      this.specVisible = false;
    },
    //导出数据
    exportRrenewal() {
      let expirationTime = this.searchParams.expirationTime;
      let expirationTimeStart = '';
      let expirationTimeEnd = '';
      if (expirationTime && expirationTime.length > 0) {
        expirationTimeStart = expirationTime[0] + ' 00:00:00';
        expirationTimeEnd = expirationTime[1] + ' 23:59:59';
      }
      let params = {
        ...this.searchParams,
        expirationTimeStart,
        expirationTimeEnd,
        remainingTimeStart: this.remainingTimeStart,
        remainingTimeEnd: this.remainingTimeEnd,
        limit: this.paginationData.size,
        page: this.paginationData.current,
      };
      // if (this.selectedRowKeys.length) {serviceIds: this.selectedRowKeys,
      renewalExport({ ...params }).then((res) => {
        this.$util.fileStreamDownload(res, '续费清单_' + moment(new Date()).format('YYYY-MM-DD'));
      });
      // } else {
      //   this.$message.warning('请选择需要导出的数据！');
      // }
    },
    //状态文本处理
    statusText(row) {
      let nowTime = new Date().setHours(0, 0, 0, 0);
      let endTime = new Date(row.expirationTime).setHours(0, 0, 0, 0);

      if (this.eprCode.includes(row.productFunctionCode && row.status == 2 && nowTime === endTime)) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.commontitle {
  padding-top: 16px;
  padding-bottom: 16px;
}

.textStyle {
  text-indent: 2em;
  line-height: 25px;
}
.pay-box {
  position: fixed;
  bottom: 0;
  right: 24px;
  background: #ffffff;
  border-radius: 20px 20px 0px 0px;
  align-items: center;
  width: calc(100% - 304px);
  display: flex;
  flex-wrap: nowrap;
  padding: 5px 20px 5px 40px;
  min-height: 74px;
  .service-left {
    flex: auto;
  }
  .price-right {
    flex: 0 1 auto;
    position: relative;
    padding-right: 124px;
  }
}
.pay-box-width {
  right: 32px;
  width: calc(100% - 312px);
}

.container {
  // max-width: 1292px;
  box-sizing: border-box;
  // padding: 0px 20px 15px 20px;
  // background: #fff;
  margin-bottom: 7px;
  border-radius: 2px;
  .infoTb {
    margin-top: 16px;
    margin-left: 24px;
    margin-right: 24px;
    padding-bottom: 90px;
  }
}

.alertdiv {
  /deep/ .ant-modal-footer {
    div button:first-child {
      display: none;
    }
  }
}

.isCollapsed {
  .pay-box {
    width: calc(100% - 121px);
  }
}

//续费提示
.renewal-tips-info {
  border-radius: 2px;
  background: #f0f6ff;
  border: 1px solid #cce1ff;
}
.searchForm-box {
  background: #fff;
  margin: 16px 0;
  padding: 24px;
}
.renewal-content {
  background: #fff;
  padding: 0 24px;
  min-height: calc(100vh - 428px);
}
.remaining-service-time-box {
  border-bottom: 1px solid #f0f0f0;
  min-height: 55px;
  line-height: 55px;
  span {
    color: #303132;
    display: inline-block;
    font-size: 14px;
    height: 54px;
    line-height: 54px;
    margin-left: 24px;
    border-bottom: 2px solid #fff;
    cursor: pointer;
  }
  .current {
    color: #3a7fff;
    border-bottom: 2px solid #3a7fff;
  }
  margin-bottom: 16px;
}
.expiration-time {
  /deep/ b {
    display: inline-block;
    font-weight: normal;
    background: #fff7e6;
    border-radius: 2px;
    font-size: 12px;
    color: #fa8c16;
    padding: 2px 5px;
    margin-left: 5px;
  }
  /deep/ .tag-expired {
    color: #fe714f;
    background: none;
  }
  /deep/ .tag-blue {
    color: #1890ff;
    background: #e6f7ff;
  }
  /deep/ .tag-grey {
    color: #919498;
    background: #f5f5f5;
  }
}
.renew-immediately {
  cursor: pointer;
  color: #3a7fff;
}
.discount-tips {
  color: #919498;
  span {
    color: #ff5f61;
  }
}
.discount-icon {
  width: 18px;
  position: relative;
  top: 3px;
}
.export-renewal-list {
  float: right;
  margin-top: 12px;
  img {
    width: 16px;
    position: relative;
    top: 3px;
    margin-right: 2px;
  }
}
.payPrice-box {
  color: #ff4839;
  span {
    font-size: 24px;
  }
}
.totalPrice-box {
  color: #919498;
}
.selected-rows-num {
  font-size: 14px;
  color: #606266;
}
.payPrice-btn {
  position: absolute;
  top: 5px;
  right: 20px;
  width: 80px;
  height: 36px;
  background: linear-gradient(313deg, #faad14 0%, #fac714 100%);
  border-radius: 2px;
  border: none;
  font-size: 16px;
}

.spce-modal {
  .vert-top {
    vertical-align: top;
    width: 130px;
    display: inline-block;
  }
  /deep/.ant-radio-group {
    width: 350px;
    margin-left: 15px;
  }
  /deep/.ant-radio-button-wrapper:first-child {
    border-radius: 20px;
  }
  /deep/.ant-radio-button-wrapper {
    border-radius: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
    border-left: 1px solid #d9d9d9;
  }
  /deep/.ant-radio-button-wrapper:not(:first-child)::before {
    width: 0;
  }
  /deep/.ant-radio-button-wrapper:last-child {
    border-radius: 20px;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    border-left: 1px solid #1890ff;
    color: #fff;
    background: #1890ff;
  }
}

.seller-growth-vat {
  .pay-box {
    width: calc(100% - 248px);
  }
  .renewal-content {
    min-height: calc(100vh - 435px);
  }
  .remaining-service-time-box .current {
    color: #f6b417;
    border-bottom: 2px solid #f6b417;
  }
}
.renewed-years {
  color: #919498;
}
.img-wrap {
  width: 100px;
  height: 100px;
  margin-top: -30px;
}
</style>
