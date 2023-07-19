<template>
  <div class="container">
    <div class="bannerbox">
      <IndexBanner :adKey="'renewalservice_top_banner'" :height="90" />
    </div>
    <div class="commontitle">
      续费管理
      <img src="@/assets/images/common/icon-tips.svg" class="hand" @click="alterVisible = true" />
    </div>
    <div class="infoTb">
      <div class="clearfix title_wait">
        <div class="content">
          <div class="title">
            <span class="label">公司名称</span>
            <Input v-model="listQuery.companyNameZh" style="width: 180px" clearable placeholder="请输入公司名称" />
            <span class="label">国家</span>
            <Select v-model="listQuery.countryCode" placeholder="全部国家" filterable clearable style="width: 120px">
              <Option :value="item.countryCode" v-for="item in countryList" :key="item.id">
                {{ item.countryNameZh }}
              </Option>
            </Select>
            <span class="label">服务名称</span>
            <Select v-model="listQuery.funcode" placeholder="服务名称" filterable clearable style="width: 120px">
              <Option :value="item.value" v-for="item in productCodeList" :key="item.value">{{ item.label }}</Option>
            </Select>
            <span class="label">服务状态</span>
            <Select v-model="listQuery.status" placeholder="服务状态" filterable clearable style="width: 120px">
              <Option value="1">服务中</Option>
              <Option value="2">待续费</Option>
              <Option value="14">续费中</Option>
              <!-- <Option value="3">税号注销</Option>
              <Option value="4">已转出</Option>
              <Option value="5">已取消</Option> -->
            </Select>
            <span class="label">服务截止日期</span>
            <DatePicker
              v-model="expirationTime"
              @on-change="changeExpirationTime"
              clearable
              type="daterange"
              placeholder="请选择日期范围"
              style="width: 230px"
            />
            <Button type="primary" @click="handleSearch" class="searchBtn">搜索</Button>
            <Button @click="handleReset" class="resetBtn">重置</Button>
          </div>
          <div>
            <Row style="margin: 20px 0px">
              <Col style="padding: 4px 20px">剩余服务时间</Col>
              <Col>
                <div class="overtime">
                  <!-- <span :class="{ selected: selectAllTime }" @click="changeSelectAllTime">
                    全部
                    <Icon type="md-checkmark" />
                  </span> -->
                  <span
                    v-for="item in residualsList"
                    :key="item.value"
                    :class="{ selected: item.select }"
                    @click="changeSurplusType(item)"
                  >
                    {{ item.label }}
                    <Icon type="md-checkmark" />
                  </span>
                </div>
              </Col>
            </Row>
          </div>
          <div style="background: #ffe7c3; padding: 10px 10px">
            <Icon type="md-alert" color="#f59a23" size="18" />
            温馨提示：当您的申报商品未能及时续费且服务状态变为已失效时，您将不能直接续费原服务。若有需要，建议您尽早续费！
          </div>
        </div>
      </div>
      <div class>
        <div class="tbNull">
          <Table
            ref="tableRef"
            :columns="listColumns"
            :data="list"
            :loading="loading"
            @on-selection-change="selectChange"
            max-height="500"
          >
            <template slot="spec" slot-scope="{ row, index }">
              {{ row.productSpecName }}
              <a
                @click="showSpecModal(index, row)"
                v-if="
                  row.supportRenewProductSpecs.length > 1 &&
                  [3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108].includes(row.productFunctionCode)
                "
              >
                <Icon type="ios-create-outline" />

                修改
              </a>

              <p
                style="color: #ff5050"
                v-if="
                  row.supportRenewProductSpecs.length > 1 &&
                  [3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108].includes(row.productFunctionCode)
                "
              >
                若续费不同服务先请修改续费服务
              </p>
            </template>

            <!-- 折扣比例 -->
            <template slot="discount" slot-scope="{ row }">
              <span v-if="row.activityType === 1">
                <div
                  :style="{
                    color:
                      Number(row.activityType) >= 0.8 && Number(row.activityType) < 0.9
                        ? '#d9001b'
                        : Number(row.activityType) >= 0.9
                        ? '#f59a23'
                        : '',
                  }"
                >
                  {{ $util.accMul(row.activityContent, 10) }}折
                </div>
              </span>
              <span v-else-if="row.activityType === 2">￥{{ row.activityContent }}</span>
              <span v-else>无</span>
            </template>
            <!-- 折扣后价格 -->
            <template slot="price" slot-scope="{ row }">
              <span>
                <span style="color: #999; text-decoration: line-through" v-if="row.activityType">
                  ￥{{ $util.toDecimalRound(row.productPaymentMoney) }}
                </span>
                <span v-if="row._disabled && !row.showPrice">--</span>
                <span v-else-if="row.activityType === 1">
                  <div
                    :style="{
                      color:
                        Number(row.discount) >= 8 && Number(row.discount) < 9
                          ? '#d9001b'
                          : Number(row.discount) >= 9
                          ? '#f59a23'
                          : '',
                    }"
                  >
                    <!-- ￥{{ $util.toDecimalRound($util.accMul(row.productPaymentMoney, Number(row.discount) / 10)) }} -->
                    ￥{{ row.productPrice }}
                  </div>
                </span>
                <!-- <span v-if="row.activityType === 2">￥{{ $util.toDecimalRound(row.productPaymentMoney) }}</span> -->
                <span v-else>￥{{ row.productPrice }}</span>
              </span>
            </template>
            <!-- 操作 -->

            <template slot="operate" slot-scope="{ row }">
              <!-- <span v-if="row.status == 9" style="color: #2d8cf0; cursor: pointer" @click="toSureOrderPage([row])">
                购买转代理
              </span> -->
              <span>
                <span v-if="row.productFunctionCode === 16">请联系销售续费</span>

                <template
                  v-else-if="[3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108].includes(row.productFunctionCode)"
                >
                  <Tooltip v-if="row.flagRenewal && row.status == 14" placement="top" content="EPR业务最多只能续费1年">
                    <Button disabled style="color: #f59a23; cursor: pointer">
                      {{ row.renewLastTime ? row.renewLastTime.substr(0, 4) + '年' : '' }}续费
                    </Button>
                  </Tooltip>

                  <Tooltip
                    v-else-if="row.flagRenewal && row.status == 1"
                    placement="left"
                    :content="'明年续费还未开放，将于' + (row.renewBeginTime || '').substr(0, 10) + '之后开放'"
                  >
                    <Button disabled style="color: #f59a23; cursor: pointer">
                      {{ row.renewLastTime ? row.renewLastTime.substr(0, 4) + '年' : '' }}续费
                    </Button>
                  </Tooltip>

                  <Button
                    v-else-if="!(row.flagRenewal && row.status == 2)"
                    style="color: #f59a23; cursor: pointer"
                    @click="toSureOrderPage([row])"
                  >
                    {{ row.renewLastTime ? row.renewLastTime.substr(0, 4) + '年' : '' }}续费
                  </Button>
                </template>
                <template v-else>
                  <Button v-if="!row._disabled" style="color: #f59a23; cursor: pointer" @click="toSureOrderPage([row])">
                    续费
                  </Button>
                </template>
              </span>
            </template>
          </Table>
        </div>
        <div class="pay-box clearfix">
          <div class="service-left">
            <Checkbox v-model="selectAll" :disabled="!list.length" @on-change="changeCheckbox">全选</Checkbox>
            <span>
              已选
              <span style="font-weight: bold; color: #16ade9">{{ selectRows.length }}</span>
              个服务
            </span>
          </div>
          <div class="price-right">
            <Row style="align-items: center">
              <Col style="margin-right: 100px">
                <div>商品总价：￥{{ $util.toDecimalRound(totalPrice) }}</div>
                <div style="padding-left: 24px">优惠：￥{{ $util.toDecimalRound(discountPrice) }}</div>
                <div style="padding-left: 24px; color: red">应付：￥{{ $util.toDecimalRound(payPrice) }}</div>
              </Col>
              <Col>
                <Button type="primary" class="searchBtn" @click="toSureOrderPage(selectRows)">去付款</Button>
              </Col>
            </Row>
          </div>
        </div>
        <div class="pageSetion clearfix">
          <Page
            class="pagination"
            :current="listQuery.page"
            :total="listTotal"
            @on-change="changePageNo"
            @on-page-size-change="changePageSize"
            :page-size="listQuery.limit"
            show-sizer
            :page-size-opts="[10, 20, 30, 50]"
          />
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
import { renewalList } from '@/api/renewal/index.js';
import { baseInfo } from '@/api/shoppingCar/shoppingCar';
import { productInfo } from '@/api/shoppingCar/shoppingCar';
import IndexBanner from '@/components/IndexBanner/index';
import Alert from './components/alert.vue';

export default {
  props: {
    showTit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // 国家列表
      countryList: [],
      specVisible: false,
      specValue: '',
      specList: [],
      label: '',
      // 分页查询
      list: [],
      listTotal: 0,
      listQuery: {
        companyNameZh: '',
        countryCode: '',
        functionCodes: [],
        funcode: '',
        productFunctionCode: '',
        status: '',
        page: 1,
        limit: 10,
      },
      loading: false,
      expirationTime: [],
      residualsList: [
        { label: '全部', start: '', end: '', select: true },
        { label: '60-120天', start: 60, end: 120, select: false },
        { label: '30-60天', start: 30, end: 60, select: false },
        { label: '0-30天', start: 0, end: 30, select: false },
      ],
      productCodeList: [
        { label: 'VAT服务', value: '2,5' },
        { label: '授权代表服务', value: '16,23' },
        { label: 'EPR服务', value: '3101,3102,3103,3104,3105,3106,3107,3108' },
      ],
      // 剩余服务时间是否多选
      selectAllTime: [],
      countDownTime: 6,
      showRenewalDialog: false,
      listColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '公司名称',
          key: 'companyNameZh',
        },
        {
          title: '国家',
          key: 'countryNameZh',
        },
        {
          title: '服务名称',
          key: 'productFunctionCode',
          render: (h, { row, index }) => {
            const serviceMap = {
              1: '税号注册',
              2: '转代理+申报',
              3: '税务补缴',
              4: '转代理',
              5: '注册+申报',
              23: 'IOSS注册+申报',
              16: '授权代表',
            };

            return h(
              'span',
              [1, 2, 3, 4, 5, 23, 16].includes(row.productFunctionCode)
                ? serviceMap[row.productFunctionCode]
                : [3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108].includes(row.productFunctionCode)
                ? row.serviceName
                : ''
            );
          },
        },
        {
          title: '规格',
          slot: 'spec',
        },

        // {
        //   title: "税号",
        //   key: "vatTaxNumber",
        //   render: (h, { row, index }) => {
        //     return h("span", row.vatTaxNumber || row.iossNumber);
        //   },
        // },
        // {
        //   title: "申报周期",
        //   key: "periodType",
        //   render: (h, { row, index }) => {
        //     return h("span", row.periodType == 0 ? "月报" : row.periodType == 1 ? "季报" : "暂无");
        //   },
        // },
        {
          title: '服务截止日期/剩余天数',
          key: 'expirationTime',
          render: (h, { row, index }) => {
            let date = '';
            if (row.expirationTime) {
              date = row.expirationTime.substring(0, 10);
            }

            let text = '';
            let nowTime = new Date().setHours(0, 0, 0, 0);
            let endTime = new Date(row.expirationTime).setHours(0, 0, 0, 0);
            if (endTime > nowTime) {
              let ms = endTime - nowTime;
              let days = ms / (24 * 3600 * 1000);
              text = days + '天';
            } else if (nowTime === endTime) {
              text = '0天';
            } else {
              text = '已过期';
            }

            return h('span', `${date}(${text})`);
          },
        },
        // {
        //   title: '剩余服务时间',
        //   key: 'surplusTimes',
        //   render: (h, { row, index }) => {
        //     let text = '';
        //     let nowTime = new Date().setHours(0, 0, 0, 0);
        //     let endTime = new Date(row.expirationTime).setHours(0, 0, 0, 0);
        //     if (endTime > nowTime) {
        //       let ms = endTime - nowTime;
        //       let days = ms / (24 * 3600 * 1000);
        //       text = days + '天';
        //     } else if (nowTime === endTime) {
        //       text = '0天';
        //     } else {
        //       text = '已过期';
        //     }
        //     return h('span', text);
        //   },
        // },
        {
          title: '服务状态',
          key: 'status',
          render: (h, { row, index }) => {
            const statusMap = {
              1: '服务中',
              2: '待续费',
              3: '税号注销',
              4: '已转出',
              9: '已取消',
              11: '取消中',
              14: '续费中',
            };
            let nowTime = new Date().setHours(0, 0, 0, 0);
            let endTime = new Date(row.expirationTime).setHours(0, 0, 0, 0);

            if (
              [3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108].includes(
                row.productFunctionCode && row.status == 2 && nowTime === endTime
              )
            ) {
              const type = `请在${row.renewLastTime.substring(0, 10)}前续费，否则此UIN号将失效`;
              return h(
                'Tooltip',
                {
                  props: {
                    placement: 'top',
                    content: type,
                    maxWidth: '200px',
                  },
                },
                [
                  h('i', {
                    class: 'ivu-icon ivu-icon-ios-alert-outline',
                    style: {
                      'font-size': '16px',
                    },
                  }),
                ]
              );
            } else {
              return h('span', statusMap[row.status]);
            }
          },
        },
        {
          title: '优惠',
          slot: 'discount',
        },
        {
          title: '单价（元）',
          slot: 'price',
        },
        {
          title: '操作',
          slot: 'operate',
        },
      ],
      // 多选的列表
      selectAll: false, // 全选
      selectRows: [],
      rowIndex: null,
      totalPrice: 0, // 勾选商品的总价
      discountPrice: 0, // 优惠的金额
      payPrice: 0, // 应支付的金额

      // 所有商品信息
      productInfoList: [],
      bannerList: [],
      alterVisible: false,
      imgUrl: '',
      row: [],
    };
  },
  components: {
    IndexBanner,
    Alert,
  },
  mounted() {
    this.queryCountry();
    this.getList();
    // this.queryProductInfo();
  },
  methods: {
    /**
     * 全选剩余服务时间
     */
    // changeSelectAllTime() {
    //   if(!this.selectAllTime) {
    //     this.selectAllTime = true
    //     this.residualsList.forEach(item => {
    //       item.select = false
    //     })
    //   }
    // },
    /**
     * 剩余服务时间选择
     */
    changeSurplusType(item) {
      if (item.select) return;
      this.residualsList.map((item) => (item.select = false));
      item.select = true;
      this.listQuery.remainingTimeStart = item.start;
      this.listQuery.remainingTimeEnd = item.end;
      // if (this.listQuery.surplusType == item.type) return;
      // this.listQuery.surplusType = item.type;
      // this.isAll()wwwwwwwwwwwwwwwww22222222222222222222222222
      this.handleSearch();
    },
    // isAll() {
    //   this.selectAllTime = this.residualsList.every(item => item.select)
    //   if(this.selectAllTime) {
    //     this.residualsList.forEach(item => {
    //       item.select = false
    //     })
    //   }
    // },
    // 服务截止时间
    changeExpirationTime(val) {
      this.expirationTime = val;
    },
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
        this.list[this.rowIndex].supportRenewProductSpecs.find((item) => item.productSpecId == this.specValue) || {};
      this.$set(this.list[this.rowIndex], 'productSpecName', selSpec.productSpecName);
      this.$set(this.list[this.rowIndex], 'productSpecId', selSpec.productSpecId);
      this.$set(this.list[this.rowIndex], 'productOriginalPrice', selSpec.productOriginalPrice);
      this.$set(this.list[this.rowIndex], 'productPrice', selSpec.renewPrice);
      this.$set(this.list[this.rowIndex], 'productPaymentMoney', selSpec.renewPrice);
      this.specVisible = false;
    },
    /**
     * 点击查询
     */
    handleSearch() {
      this.listQuery.page = 1;
      this.getList();
    },
    /**
     * 重置
     */
    handleReset() {
      this.listQuery = {
        companyNameZh: '',
        countryCode: '',
        funcode: '',
        status: '',
        page: 1,
        limit: 10,
      };
      this.expirationTime = [];
      this.residualsList.map((item, index) => {
        item.select = index === 0;
      });
      this.getList();
    },
    /**
     * 查询国家列表
     */
    queryCountry() {
      baseInfo().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });
    },
    /**
     * 查询所有商品信息
     */
    queryProductInfo() {
      productInfo({ productType: 1 }).then((res) => {
        if (res.code === 0) {
          this.productInfoList = res.data;
        }
      });
    },
    /**
     * 获取列表
     */
    getList() {
      if (this.listQuery.funcode) {
        this.listQuery.functionCodes = this.listQuery.funcode.split(',').map((item) => Number(item));
      }
      let params = {
        ...this.listQuery,
        expirationTimeStart:
          this.expirationTime && this.expirationTime.length > 0 && this.expirationTime[0]
            ? this.expirationTime[0] + ' 00:00:00'
            : '',
        expirationTimeEnd:
          this.expirationTime && this.expirationTime.length > 0 && this.expirationTime[1]
            ? this.expirationTime[1] + ' 23:59:59'
            : '',
      };
      this.loading = true;
      renewalList(params).then((res) => {
        this.loading = false;
        if (res && res.code == 0) {
          let list = res.data.records;
          list.forEach((item) => {
            if (
              item.productFunctionCode === 16 ||
              // (item.supportRenewProductSpecs && item.supportRenewProductSpecs.length > 1) ||
              (item.flagRenewal && [3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108].includes(item.productFunctionCode))
            ) {
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
          });
          this.list = res.data.records;
          this.listTotal = Number(res.data.total);
        }
      });
    },
    /**
     * 分页
     */
    changePageNo(val) {
      this.listQuery.page = val;
      this.resetChange();
      // 重新查询列表
      this.getList();
    },
    changePageSize(val) {
      this.listQuery.limit = val;
      this.resetChange();
      // 重新查询列表
      this.getList();
    },
    // 重置选中
    resetChange() {
      // 重置全选，以及勾选的价格列表
      this.selectAll = false;
      this.selectRows = [];
      this.totalPrice = 0;
      this.discountPrice = 0;
      this.payPrice = 0;
    },
    /**
     * 多选列表
     */
    selectChange(rows) {
      this.selectRows = rows;
      console.log('选择的订单：', rows);
      this.selectAll = rows.length === this.list.filter((item) => !item._disabled).length;
      this.calcuRowsPrice();
    },
    // 多选后，计算对应的价格
    calcuRowsPrice() {
      this.totalPrice = 0;
      this.discountPrice = 0;
      this.payPrice = 0;
      this.selectRows.forEach((v) => {
        this.totalPrice += Number(v.productPaymentMoney);
        this.payPrice += Number(v.productPrice);
        this.discountPrice = this.$util.accSub(this.totalPrice, this.payPrice);
      });
    },
    // 底部的全选和反选
    changeCheckbox(val) {
      this.$refs.tableRef.selectAll(val);
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
      let list = rows.filter((item) => !item._disabled);
      if (!list.length) {
        this.$Message.warning('请至少选择一条数据');
        return;
      }
      const arr = list.map((item) => {
        if (
          item.supportRenewProductSpecs &&
          item.supportRenewProductSpecs.length > 1 &&
          [3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108].includes(item.productFunctionCode)
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
    // toSureOrderPage(rows) {
    //   if (!rows || rows.length == 0) {
    //     this.$Message.warning("请至少选择一条数据");
    //     return;
    //   }
    //   // 勾选的获取对应的商品信息加入到购物车
    //   let list = [];
    //   rows.forEach((v) => {
    //     let oneProduct = [];
    //     // 只要productFunctionCode是5的注册申报，付款时候订单页面都会是对应转代理的
    //     if (v.productFunctionCode == 5) {
    //       oneProduct = JSON.parse(
    //         JSON.stringify(
    //           this.productInfoList.filter((item) => item.productFunctionCode == 2 && v.countryCode == item.countryCode)[0]
    //         )
    //       );
    //     } else {
    //       oneProduct = JSON.parse(JSON.stringify(this.productInfoList.filter((item) => item.id == v.productFunctionCode)[0]));
    //     }

    //     let discount = 10;
    //     if (v.discount) {
    //       discount = Number(v.discount);
    //     }
    //     oneProduct.discount = discount;
    //     oneProduct.productAmount = 1;
    //     oneProduct.serviceId = v.id;
    //     oneProduct.productFunctionCode = v.productFunctionCode;
    //     list.push(oneProduct);
    //   });
    //   console.log("勾选的订单对应商品为：", list);
    //   if (!list || list.length == 0) {
    //     this.$Message.warning("根据订单未找到对应的服务商品");
    //     return;
    //   }
    //   // 对应的商品放入到本地中
    //   localStorage.setItem("selectedList", JSON.stringify(list));
    //   localStorage.setItem("productInfo", JSON.stringify(list));
    //   // 跳转到订单页面，并传入from是renewal，订单页面会计算折扣金额
    //   this.$router.push({
    //     path: "/sureOrder",
    //     query: {
    //       from: "renewal",
    //     },
    //   });
    // },
  },
};
</script>

<style lang="less" scoped>
.overtime {
  span {
    border: solid 1px #eee;
    display: inline-block;
    padding: 4px 20px;
    text-align: center;
    width: 110px;
    margin: 0px 6px;
    transition: all 0.2s;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      border: solid 1px #16ade9;
      color: #16ade9;
    }
    .ivu-icon {
      display: none;
      font-size: 12px;
      font-weight: bold;
      position: relative;
      top: -1px;
      color: currentColor;
    }
    &.selected {
      border: solid 1px #16ade9;
      color: #16ade9;
      .ivu-icon {
        display: inline-block;
      }
    }
  }
}
.textStyle {
  text-indent: 2em;
  line-height: 25px;
}
.pay-box {
  background: #f2f8fe;
  align-items: center;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  padding: 5px 20px;
  .service-left {
    flex: auto;
  }
  .price-right {
    flex: 0 1 auto;
  }
}
</style>
<style lang="less" scoped>
.country-list {
  display: flex;
  margin-top: 5px;
  .country-list-left {
    width: 140px;
  }
}
/deep/ .ivu-row {
  margin-top: 5px;
}
.tax-info-name {
  margin-right: 10px;
}
&/deep/ .ivu-select-dropdown-list {
  max-height: 300px !important;
  // overflow: auto;
}
.tabs-box {
  border-bottom: 1px solid #f6f6f6;
  padding-left: 24px;
  display: flex;
  div {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333;
    margin-right: 42px;
    padding-bottom: 6px;
    cursor: pointer;
    &.active {
      color: #1890ff;
      border-bottom: 2px solid #1890ff;
    }
    .huibiao {
      display: inline-block;
      background-color: #ff5050;
      color: #fff;
      font-size: 12px;
      text-align: center;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      // width: 24px;
      padding: 0 5px;
      margin-left: 4px;
    }
  }
}
.container {
  // max-width: 1292px;
  box-sizing: border-box;
  // padding: 0px 20px 15px 20px;
  // background: #fff;
  margin-bottom: 7px;
  border-radius: 2px;
  .headContent {
    height: 78px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 500;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      span {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
    }
  }
  & .title {
    color: #212121;
    // font-size: 18px;
    font-weight: bold;
    line-height: 56px;
  }
  .title_wait {
    margin: 0px 0 11px 0;
    .content {
      padding-top: 24px;
      .title {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        padding: 20px 24px 0;
        background-color: #ffffff;
        .label {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #666666;
          margin-right: 6px;
        }
      }
    }
    &/deep/ .ivu-form .ivu-form-item-label {
      font-weight: bold;
    }
    .tax-status {
      border-bottom: 1px solid rgba(153, 153, 153, 0.16);
      span.status-item {
        display: inline-block;
        width: 149px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: rgba(153, 153, 153, 0.1);
        border-radius: 4px 4px 0px 0px;
        border: 1px solid rgba(153, 153, 153, 0.16);
        color: #666;
        font-size: 14px;
        border-bottom: none;
        margin-right: 4px;
        cursor: pointer;
        .status-count {
          color: #ed3e3e;
        }
      }
      span.status-item.active {
        background: #ffffff;
        color: #2db7f5;
        .status-count {
          color: #2db7f5;
        }
      }
    }
  }
  & .line {
    border: 1px solid #f5f5f5;
    margin-bottom: 16px;
  }
  & .info {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .item {
      img {
        width: 102%;
        cursor: pointer;
      }
    }
    .item:nth-child(1) {
      margin-left: -5px;
    }
  }
  .infoTb {
    background-color: #fff;
    padding: 0px 27px;
    margin-top: 24px;
    margin-left: 24px;
    margin-right: 24px;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  //TabsNav 样式
  & /deep/ .ivu-tabs-bar {
    margin: 0px;
  }
  & /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
    border-color: #e6e6e6 !important;
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar {
    border-color: #f2f2f2;
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab {
    margin-right: 0px;
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab:nth-child(2n) {
    border-top-right-radius: 0px;
    background: rgba(247, 247, 247, 1);
  }
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab:nth-child(2n-1) {
    border-top-left-radius: 0px;
  }
  & /deep/ .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused:nth-child(2n-1),
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab-focused:nth-child(2n-1),
  & .ivu-tabs /deep/ .ivu-tabs-bar .ivu-tabs-tab-active:nth-child(2n-1) {
    border-left-color: #fff !important;
    font-weight: 400;
  }
  //表格样式
  &/deep/.ivu-table:before {
    background-color: #f2f2f200;
  }
  &/deep/.ivu-table:after {
    background-color: #f2f2f2;
  }
  & .ivu-tabs /deep/ .ivu-table-wrapper {
    margin-bottom: 11px;
    border-color: #f2f2f2;
  }

  & .ivu-tabs /deep/ .ivu-table-wrapper tr td {
    color: #16ade9;
    font-size: 12px;
  }
  & /deep/ .ivu-table-tip tr {
    height: 144px;
  }
  .pageSetion {
    text-align: right;
    margin-top: 24px;
    padding-bottom: 36px;
    .pagination {
      display: inline-block;
      // margin-right: 12px;
      line-height: 20px;
    }
    .totalNum {
      // position: absolute;
      // top: 2px;
      // right: 0px;
      font-size: 14px;
      color: #9a9ca1;
    }
    &/deep/.ivu-page-simple .ivu-page-simple-pager input {
      padding: 0;
      margin: 0;
    }
    &/deep/.ivu-page-simple-pager {
      margin-right: 0;
    }
  }
}
.container {
  &/deep/.ivu-tabs .ivu-table-wrapper .ivu-table-tip tr td {
    color: #9a9ca1;
  }
  .tbNull {
    // position: relative;
    /deep/ .ivu-table table {
      border-left: 1px solid #ebebebff;
    }
    &/deep/ td .ivu-table-cell {
      font-size: 12px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      color: #333333;
      .grey {
        color: #999999;
      }
      .red {
        color: #16ade9;
      }
      .blue {
        color: #16ade9;
      }
      .yellow {
        color: #f79728;
      }
      .orange {
        color: #fc9153;
      }
      .green {
        color: #5ab187;
      }
    }
    .operate {
      cursor: pointer;
      text-align: center;
      display: flex;
      font-weight: 500;
      justify-content: center;
      img {
        width: 11px;
        margin-right: 4px;
        margin-bottom: 2px;
      }
      &/deep/ .ivu-btn-text {
        width: 63px;
        color: #16ade9;
        font-size: 12px;
        padding: 0 5px;
        text-align: left;
        background: #fff;
        border-color: #16ade9;
        margin-right: 10px;
        display: inline-block;
        margin: 0px 20px;
        span {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        img {
          width: 18px;
          height: 18px;
        }
      }
      .btF {
        // min-width: 124px;
      }
      .btF.flex-center {
        // min-width: 124px;
        background: none;
        color: #f79728;
        border-color: #f79728;
        border: none;
        img {
          width: 18px;
          height: 18px;
        }
      }
      .red-button {
        color: #ed3e3e;
        border-color: #ed3e3e;
      }
      .upload-btn {
        border: none;
        border-color: #16ade9;
        color: #16ade9;
        background: none;
        img {
          width: 18px;
          height: 18px;
        }
      }
      .btR {
        min-width: 124px;
        background: #ed3e3e;
      }
    }
    /deep/ th .ivu-table-cell {
      font-size: 14px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    &/deep/ .ivu-table {
      color: #333333;
      font-size: 12px;
      td,
      th {
        border-bottom: 1px solid #e6e6e6;
        padding: 16px 0;
        text-align: center;
        // border-right: none;
        border-right: 1px solid #ebebebff;
      }
      th {
        color: #666666;
        font-weight: inherit;
        background: rgba(22, 173, 233, 0.2);
      }
    }
    &/deep/ .ivu-table-header {
      .ivu-table-cell {
        & > div div:nth-child(1) {
          font-weight: bold;
          font-size: 12px;
        }
        & > div div:nth-child(2) {
          // font-weight: bold;
          font-size: 10px;
        }
      }
    }
  }
  .activity-box,
  .activity-rule {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 999;
  }
  .invite-banner {
    cursor: pointer;
    width: 100%;
    height: 100%;
    position: relative;
    .inviteBox {
      position: absolute;
      left: 50%;
      margin-left: -370px;
      .bg {
        width: 100%;
        height: auto;
      }
      .btn {
        width: 143px;
        height: 29px;
        position: absolute;
        bottom: 13px;
        left: 50%;
        transform: translateX(-50%);
        background: url(../../../assets/images/survey/inviteBtn.png) no-repeat;
        background-size: contain;
        text-align: center;
        color: #ed3e3e;
        font-size: 14px;
        font-weight: 500;
        line-height: 29px;
      }
    }
    .close {
      z-index: 9999999;
      top: 140px;
      left: 50%;
      position: absolute;
      margin-left: 340px;
    }
  }
}
@media screen and (max-width: 1440px) {
  .container .info .info-item {
    padding-right: 16px;
  }
  .info-img {
    img {
      width: 100%;
    }
  }
  .info-right-wrapper {
    margin-left: 10px;
  }
}
.searchBtn {
  // margin-right: 12px;
  height: 32px;
  background-color: #16ade9;
  border: 1px solid rgba(230, 230, 230, 1);
  color: #ffffff;
  font-size: 12px;
  // margin-left: 10px;
  &/deep/ .ivu-icon {
    font-size: 17px;
    margin-top: 3px;
  }
  &/deep/ span {
    font-size: 12px;
    margin-bottom: 10px;
    float: right;
    margin-top: 6px;
  }
}
.resetBtn {
  font-size: 12px;
  font-family: 'MicrosoftYaHei';
  color: #999999;
  border: none;
  line-height: 12px;
  border: 1px solid #cccccc;
  &/deep/ .ivu-icon {
    font-size: 19px;
    margin-top: 2px;
  }
  &/deep/ span {
    font-size: 12px;
    margin-bottom: 10px;
    float: right;
    margin-top: 9px;
  }
}
.fr &/deep/.ivu-form-item {
  margin-bottom: 0;
}
.invit-title {
  font-size: 20px;
  font-weight: 500;
  color: #303033;
  text-align: center;
  margin-top: 22px;
}
.invit-content {
  margin-left: 20px;
  margin-top: 20px;
  padding-bottom: 30px;
  .invit-input {
    width: 480px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    background-color: #f0f0f0;
  }
  /deep/ .ivu-input {
    height: 40px;
    border-radius: 0;
    padding: 11px 14px;
  }
  .link-btn {
    display: inline-block;
    width: 88px;
    height: 40px;
    color: #fff;
    line-height: 40px;
    text-align: center;
    background-color: #16ade9;
    font-size: 14px;
    cursor: pointer;
  }
  .active-rule {
    width: 568px;
    margin-top: 15px;
    background-color: #faf7f8;
    padding: 18px 10px;
    color: #303033;

    .rule-title {
      font-size: 14px;
      font-size: 500;
      margin-top: 8px;
    }
    .rule-content {
      font-size: 12px;
      line-height: 24px;
    }
  }
}
@media screen and (min-width: 1882px) {
  .container .info .item:nth-child(1) {
    margin-left: -32px;
  }
}
.alertdiv {
  /deep/ .ant-modal-footer {
    div button:first-child {
      display: none;
    }
  }
}
/deep/.ivu-tooltip-inner {
  white-space: normal;
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
.img-wrap {
  width: 100px;
  height: 100px;
  margin-top: -30px;
}
</style>
