<template>
  <div class="header-container" ref="searchBox">
    <!-- 查询条件 -->
    <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
      <el-form :model="listQuery" ref="searchForm" inline>
        <!-- <el-form-item prop="enterpriseIdList">
          <el-select style="width: 168px" v-model="listQuery.enterpriseIdList" placeholder="请选择公司主体" clearable multiple filterable>
            <el-option :value="-1" label="全部"></el-option>
            <el-option v-for="item in firmList" :value="item.id" :key="item.id" :label="item.name" :disabled="listQuery.enterpriseIdList.includes(-1)"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item prop="enterpriseIdList">
          <EnterpriseSelect v-model="listQuery" :width="168" showAllOption selectCurOption multiple clearable filterable />
        </el-form-item>

        <el-form-item prop="orderNo">
          <el-input v-model="listQuery.orderNo" placeholder="请输入销售订单号" clearable style="width: 168px" />
        </el-form-item>

        <el-form-item prop="userMobile">
          <el-input v-model="listQuery.userMobile" placeholder="请输入手机号" clearable style="width: 168px" />
        </el-form-item>
        <el-form-item prop="creatTime">
          <el-date-picker
            v-model="listQuery.creatTime"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="下单开始日期"
            end-placeholder="下单结束日期"
            style="width: 340px"
            align="right"
            clearable
            unlink-panels
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetSearchBox">重置</el-button>
          <el-button type="text" @click="handleMoreSearch">
            <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
            {{ moreSerch ? '收起' : '更多' }}筛选
          </el-button>
        </el-form-item>
        <slot name="btnGroup"></slot>

        <div class="more-search" v-show="moreSerch">
          <el-form-item prop="serviceCompanyName">
            <el-input v-model="listQuery.serviceCompanyName" placeholder="请输入服务公司名称" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item prop="opportunityNo">
            <el-input v-model="listQuery.opportunityNo" placeholder="请输入商机编号" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item prop="productCategoryId">
            <el-cascader
              ref="productCategory"
              style="width: 168px"
              clearable
              filterable
              placeholder="请选择商品分类"
              v-model="listQuery.productCategoryId"
              :options="serviceCascader"
              collapse-tags
              :props="{
                multiple: true,
                children: 'childrenProductCategory',
                value: 'id',
                label: 'categoryName',
              }"
            ></el-cascader>
          </el-form-item>
          <el-form-item prop="productName">
            <el-input v-model="listQuery.productName" placeholder="请输入商品名称" clearable style="width: 168px" />
          </el-form-item>

          <el-form-item prop="orderSource">
            <el-select style="width: 168px" v-model="listQuery.orderSource" placeholder="订单来源" clearable>
              <el-option v-for="item in orderSourceList" :value="item.dataCode" :key="item.baseDataId" :label="item.dataValue"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="orderTypeList">
            <el-select style="width: 168px" v-model="listQuery.orderTypeList" placeholder="订单类型" clearable multiple>
              <el-option v-for="item in orderList" :value="item.dataCode" :key="item.baseDataId" :label="item.dataValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="acceptAccountNo">
            <el-select style="width: 168px" v-model="listQuery.acceptAccountNo" clearable filterable placeholder="收款账户">
              <el-option-group style="width: 450px">
                <li class="option_title" style="background: #f6f8fa">
                  <span>银行账号</span>
                  <span>账户名称</span>
                  <span>开户银行</span>
                </li>

                <el-option v-for="(item, index) in bankAccountList" :key="index" :label="item.accountName" :value="item.bankAccount" class="option_title">
                  <span class="zt-mr-2">{{ item.bankAccount }}</span>
                  <span class="zt-mr-2">{{ item.accountName }}</span>
                  <span>{{ item.bankName }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item prop="isOrderPayment">
            <el-select style="width: 168px" v-model="listQuery.isOrderPayment" clearable placeholder="有无付款信息">
              <el-option :value="1" label="有"></el-option>
              <el-option :value="0" label="无"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="countryCodes">
            <el-select style="width: 168px" v-model="listQuery.countryCodes" placeholder="请选择国家" clearable multiple filterable>
              <el-option v-for="item in countrySelect" :value="item.countryCode" :key="item.id" :label="item.countryNameZh"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="payTime">
            <el-date-picker
              v-model="listQuery.payTime"
              type="daterange"
              range-separator="至"
              :start-placeholder="`${$util.isDemoAccount() ? '签约' : '付款'}开始日期`"
              :end-placeholder="`${$util.isDemoAccount() ? '签约' : '付款'}结束日期`"
              value-format="yyyy-MM-dd HH:mm:ss"
              unlink-panels
              :default-time="['00:00:00', '23:59:59']"
              style="width: 340px"
            ></el-date-picker>
          </el-form-item>

          <el-form-item prop="attributionId">
            <el-select style="width: 168px" clearable placeholder="选择销售" filterable v-model="listQuery.attributionId">
              <el-option-group>
                <li class="option_title" style="background: #f6f8fa">
                  <span>姓名</span>
                  <span>手机号</span>
                  <span>部门</span>
                </li>
                <el-option v-for="item in followList" :key="item.userId" :label="item.nickName" :value="item.userId" class="option_title">
                  <span class="zt-mr-2">{{ item.nickName }}</span>
                  <span class="zt-mr-2">{{ item.mobile }}</span>
                  <span>{{ item.departmentName }}</span>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item prop="paymentChannel">
            <el-select style="width: 168px" v-model="listQuery.paymentChannel" placeholder="支付方式" clearable>
              <el-option v-for="item in paymentChannelList" :value="item.dataCode" :key="item.baseDataId" :label="item.dataValue"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="paymentType">
            <el-select style="width: 168px" v-model="listQuery.paymentType" placeholder="付款类型" clearable>
              <el-option v-for="item in paymentTypeList" :value="item.dataCode" :key="item.baseDataId" :label="item.dataValue"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="orderStatus">
            <el-select style="width: 168px" v-model="listQuery.orderStatus" clearable filterable placeholder="订单状态">
              <el-option v-for="item in statusList" :value="item.dataCode" :key="item.baseDataId" :label="item.dataValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="invoiceStatus">
            <el-select style="width: 168px" v-model="listQuery.invoiceStatus" clearable filterable placeholder="是否申请开票">
              <el-option :value="1" label="已申请"></el-option>
              <el-option :value="0" label="未申请"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="contractStatus">
            <el-select style="width: 168px" v-model="listQuery.contractStatus" clearable filterable placeholder="合同状态">
              <el-option :value="item.dataCode" :label="item.dataValue" v-for="item in contractStatusList" :key="item.baseDataId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="renewFlag" v-if="!isRenewal">
            <el-select style="width: 168px" v-model="listQuery.renewFlag" clearable placeholder="是否续费">
              <el-option :value="1" label="有"></el-option>
              <el-option :value="0" label="无"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="paymentChannelKey">
            <el-select style="width: 168px" v-model="listQuery.paymentChannelKey" clearable multiple placeholder="支付渠道">
              <el-option :value="'MIDEA'" label="美的支付"></el-option>
              <el-option :value="'WEIXIN'" label="微信支付(直联)"></el-option>
              <el-option :value="'ALIPAY'" label="支付宝(直联)"></el-option>
              <el-option :value="'VIRTUAL'" label="虚拟支付"></el-option>
              <el-option :value="'LIANLIANPAY'" label="连连支付"></el-option>
              <el-option :value="'UNIONPAY'" label="银联(直联)"></el-option>
              <el-option :value="'WANLIHUI'" label="万里汇"></el-option>
              <el-option :value="'EBAY'" label="eBay"></el-option>
              <el-option :value="'AIRWALLEX'" label="空中云汇"></el-option>
              <el-option :value="'PAYPAL'" label="paypal"></el-option>
              <el-option :value="'PAYONEER'" label="P卡"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getBaseDataByDataType, getCountrySelectList, userList, getBankAccountList } from '@/api/newApi/common';
import { getProductCategory } from '@/api/newApi/servicemerchant/serviceMerchant';
import cacheQuery from '@/mixins/cacheQuery';
import dayjs from 'dayjs';
import EnterpriseSelect from '@/components/enterprise-select'
export default {
  props: {
    isRenewal: Boolean,
  },
  components: { EnterpriseSelect },
  data() {
    let now = dayjs(new Date());
    let startCreatTime = now.subtract(30, 'day').format('YYYY-MM-DD') + ' 00:00:00';
    let endCreatTime = now.format('YYYY-MM-DD') + ' 23:59:59';
    return {
      listQuery: {
        page: 1,
        limit: 20,
        orderNo: '',
        userMobile: '',
        productCategoryId: '',
        productCategoryIds: [],
        productName: '',
        countryCodes: [],
        orderTypeList: [],
        enterpriseIdList: [],
        paymentChannel: '',
        attributionId: '',
        orderSource: '',
        paymentType: '',
        orderType: '',
        isOrderPayment: '',
        serviceCompanyName: '',
        opportunityNo: '',
        invoiceStatus: '',
        orderStatus: '',
        creatTime: [startCreatTime, endCreatTime],
        payTime: '',
        contractStatus: '', //合同状态（0：未签署，1：签署中，2：已签署，3：特批不签，4：线下签订）
        acceptAccountNum: '',
        paymentChannelKey: '', // 支付渠道 下拉选择：“美的支付、微信平台、支付宝平台、空中云汇、虚拟支付”；支持多选
      },
      cacheKey: 'listQuery',
      copyListQuery: {},
      orderSourceList: [],
      statusList: [],
      orderList: [],
      paymentChannelList: [],
      paymentTypeList: [],
      contractStatusList: [],
      firmList: [],
      followList: [],
      countrySelect: [],
      serviceCascader: [],
      bankAccountList: [],
      activeName: -1,
      enterpriseId: '',
      currentFrim: '', // 当前主体名
    };
  },
  mixins: [cacheQuery],
  created() {
    // this.enterpriseId = this.$util.getLocalStorage('enterpriseId');
  },
  async mounted() {
    this.copyListQuery = { ...this.listQuery };
    // await this.getFirmList();
    this.getPageCache();
    // this.listQuery.enterpriseIdList = [Number(this.enterpriseId)]; // 默认选中当前的公司主体
    this.$emit('queryData', this.getFormData());
    await this.getOptionList();
    this.getBankList();
    this.getCountrySelectList();
    this.getUserList();
    this.getService();
  },
  methods: {
    getOptionList() {
      return new Promise((resolve) => {
        let index = 0;
        const optMap = {
          orderSourceList: 'ORDER_SOURCE_TYPE',
          statusList: 'ORDER_STATUS_TYPE',
          orderList: 'ORDER_TYPE',
          paymentChannelList: 'PAYMENT_CHANNEL_TYPE',
          paymentTypeList: 'PAYMENT_TYPE',
          contractStatusList: 'ORDER_CONTRACT_STATUS_TYPE',
        };
        let keys = Object.keys(optMap);
        keys.map((item) => {
          getBaseDataByDataType({
            dataType: optMap[item],
          }).then((res) => {
            index += 1;
            if (res.code == 0) {
              this[item] = res.data;
            }
            if (index === keys.length) {
              resolve();
            }
          });
        });
      });
    },
    /**
     * 获取收款账户列表
     */
    getBankList() {
      getBankAccountList({
        enterpriseId: this.enterpriseId,
      }).then((res) => {
        if (res.code == 0) {
          this.bankAccountList = res.data;
        }
      });
    },
    /**
     * 获取国家下拉框数据
     */
    getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelect = res.data;
      });
    },
    /**
     *归属人下拉列表
     */
    getUserList() {
      userList({
        page: 1,
        limit: -1,
      }).then((res) => {
        if (res.code == 0) {
          this.followList = res.data;
        }
      });
    },
    /**
     * 获取服务分类列表
     */
    getService() {
      getProductCategory({
        page: 1,
        size: -1,
      }).then((res) => {
        if (res.code == 0) {
          this.formatCategory(res.data.records);
          this.serviceCascader = res.data.records;
        }
      });
    },
    formatCategory(data) {
      data.forEach((item) => {
        if (item.childrenProductCategory && item.childrenProductCategory.length) {
          this.formatCategory(item.childrenProductCategory);
        } else {
          item.childrenProductCategory = void 0;
        }
      });
    },
    getFormData() {
      this.setPageCache();
      let { creatTime, payTime, productCategoryId, ...newQuery } = this.listQuery;
      this.activeName = this.listQuery.orderStatus || '-1';
      return JSON.parse(
        JSON.stringify({
          listQuery: {
            ...newQuery,
            countryCodes: this.listQuery.countryCodes,
            createEndTime: this.listQuery.creatTime ? this.listQuery.creatTime[1] : '',
            createStartTime: this.listQuery.creatTime ? this.listQuery.creatTime[0] : '',
            paymentEndTime: this.listQuery.payTime ? this.listQuery.payTime[1] : '',
            paymentStartTime: this.listQuery.payTime ? this.listQuery.payTime[0] : '',
            productCategoryIds: this.$refs.productCategory.getCheckedNodes().map((n) => n.value),
            renewFlag: this.isRenewal ? 1 : this.listQuery.renewFlag,
          },
          activeName: this.activeName,
        })
      );
    },
    search() {
      this.$emit('search', this.getFormData());
    },
    resetSearchBox() {
      this.listQuery = { ...this.copyListQuery };
      this.listQuery.enterpriseIdList = [Number(this.$util.getLocalStorage('enterpriseId'))]; // 默认选中当前的公司主体
      this.removePageCache();
    },
    modifyEnterpriseIdList(val) {
      this.listQuery.enterpriseIdList = val;
    },
  },
};
</script>

<style></style>
