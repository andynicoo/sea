<template>
  <div class="container">
    <div class="mainPage" v-if="!isDetailShow && !isShowInvoiceOrderDetail">
      <Form ref="searchForm" class="formContainer" :model="searchForm" inline>
        <FormItem>
          <Select
            clearable
            v-model="searchForm.inviteContentType"
            placeholder="请选择搜索类型"
          >
            <Option value="1">邀请人</Option>
            <Option value="2">跟进人</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input
            v-model="searchForm.inviteContent"
            clearable
            placeholder="请输入邀请人/跟进人"
            style="width:200px;"
          />
        </FormItem>
        <FormItem>
          <Select
            clearable
            v-model="searchForm.orderSource"
            placeholder="订单来源"
          >
            <Option value="0">PC网页端</Option>
            <Option value="1">微信小程序</Option>
            <Option value="2">H5端</Option>
            <Option value="5">后台录入</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker
            type="daterange"
            placement="bottom-end"
            @on-change="dateChange"
            :value="[this.searchForm.startTime, this.searchForm.endTime]"
            placeholder="订单创建时间"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker
            v-model="paymentDate"
            type="daterange"
            placement="bottom-end"
            @on-change="paymentDateChange"
            placeholder="付款时间"
            style="width: 200px"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Select
            clearable
            v-model="searchForm.countryCode"
            placeholder="税号国家"
          >
            <Option
              v-for="(item, index) in countryList"
              :value="item.countryCode"
              :key="index"
              >{{ item.countryNameZh }}</Option
            >
          </Select>
        </FormItem>
        <FormItem>
          <Select
            clearable
            v-model="searchForm.functionCode"
            style="width: 100px;"
            placeholder="全部商品"
          >
            <Option value="1">注册税号</Option>
            <Option value="2">税务申报</Option>
            <Option value="5">注册+申报</Option>
            <Option value="6">注销税号</Option>
            <Option value="7">税务稽查</Option>
            <Option value="16">授权代表</Option>
          </Select>
        </FormItem>

        <FormItem>
          <Select
            clearable
            v-model="searchForm.companyBody"
            placeholder="所属公司"
          >
            <Option
              v-for="(item, i) in parentCompanyList"
              :value="item.code"
              :key="i"
              >{{ item.value }}</Option
            >
          </Select>
        </FormItem>
        <FormItem>
          <Select
            clearable
            v-model="searchForm.paymentType"
            placeholder="付款类型"
          >
            <Option
              v-for="(item, i) in paymentTypeList"
              :value="item.code"
              :key="i"
            >
              {{ item.value }}
            </Option>
          </Select>
        </FormItem>

        <FormItem>
          <DatePicker
            v-model="searchForm.expectGatheringTime"
            type="date"
            placeholder="预计到账日期"
          ></DatePicker>
        </FormItem>

        <FormItem>
          <Input
            v-model="searchForm.searchContent"
            clearable
            placeholder="请输入手机号/订单号/服务公司"
            style="width:200px;"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchList" style="margin-right:5px;"
            >查询</Button
          >
          <Button type="primary" ghost @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="money">
        <Row class-name="statistical">
          <Col span="4">订单金额: {{ allOrderOldMoney }}</Col>
          <Col span="4">应付金额: {{ allOrderMoney }}</Col>
          <Col span="4">优惠金额: {{ allDiscAmount }}</Col>
          <Col span="4" v-if="searchForm.status == 2"
            >实付金额: {{ allAmountMoney }}</Col
          >
          <Col
            span="4"
            v-if="!(searchForm.countryCode || searchForm.functionCode)"
            >开票金额: {{ allInvoiceMoney }}</Col
          >
        </Row>
      </div>
      <div class="tableArea">
        <div class="tableAreaInline">
          <Tabs
            :value="searchForm.status"
            :animated="false"
            @on-click="tabsChange"
          >
            <TabPane label="全部订单" name="-1"></TabPane>
            <TabPane label="待审核" name="8"></TabPane>
            <TabPane label="待付款" name="0"></TabPane>
            <TabPane label="付款待确认" name="1"></TabPane>
            <TabPane label="已付款" name="2"></TabPane>
            <TabPane label="已取消" name="3"></TabPane>
            <TabPane label="部分付款" name="4"></TabPane>
            <TabPane label="部分退款" name="5"></TabPane>
            <TabPane label="全额退款" name="6"></TabPane>
            <TabPane label="订单驳回" name="10"></TabPane>
          </Tabs>
          <div>
            <Button
              @click="applyInvoice()"
              type="primary"
              style="margin-left:10px;"
              v-if="searchForm.status == 2"
              v-show="hasAuthority('order_applyInvoice')"
              >申请开票</Button
            >
            <Button
              @click="updatefollowuserFun"
              type="primary"
              style="margin-left:10px;"
              v-show="hasAuthority('order_list09')"
              >修改跟进人</Button
            >
            <Button
              type="primary"
              v-show="hasAuthority('order_list04')"
              @click="exportList"
              >导出Excel</Button
            >
          </div>
        </div>
        <Table
          border
          :loading="tableLoading"
          @on-selection-change="selectData"
          :columns="columns"
          :data="tableData"
        >
          <template slot="status" slot-scope="{ row }">
            <span>{{
              row.status == "0"
                ? "待付款"
                : row.status == "1"
                ? "付款待确认"
                : row.status == "2"
                ? "已付款"
                : row.status == "3"
                ? "已取消"
                : row.status == "4"
                ? "部分付款"
                : row.status == "5"
                ? "部分退款"
                : row.status == "6"
                ? "全额退款"
                : row.status == "8"
                ? "待审核"
                : row.status == "10"
                ? "订单驳回"
                : ""
            }}</span>
          </template>
          <div
            slot="operate"
            slot-scope="{ row, index }"
            style="padding:5px 0;"
          >
            <p
              class="btnClass"
              v-if="row.orderForm == 0"
              v-show="hasAuthority('order_list02')"
              @click="toDetail(row)"
            >
              查看
            </p>
            <p
              class="btnClass"
              v-if="row.orderForm == 1"
              v-show="hasAuthority('order_list02')"
              @click="toInvoiceDetail(row, index)"
            >
              查看
            </p>
            <p
              class="btnClass"
              v-if="
                row.orderForm == 0 &&
                  [2, 4, 5].includes(row.status) &&
                  Math.floor((row.amountMoney - row.invoicedMoney  - row.invoiceMoney - row.refundMoney) * 100)/100 > 0
              "
              v-show="hasAuthority('order_applyInvoice')"
              @click="applyInvoice(row, index)"
            >
              申请开票
            </p>
            <p
              class="btnClass"
              v-if="row.orderForm == 1 && [0, 1].includes(row.status)"
              v-show="hasAuthority('order_cancelApplyInvoice')"
              @click="cancelApplyInvoice(row, index)"
            >
              取消开票
            </p>
            <p
              class="btnClass"
              v-if="row.orderForm == 1 && row.status == 0"
              v-show="hasAuthority('order_uploadPayVoucher')"
              @click="openUploadPayVoucher(row, index)"
            >
              上传支付凭证
            </p>
            <p
              class="btnClass"
              v-if="row.status == 1 && row.orderSource != 5"
              v-show="hasAuthority('order_list01')"
              @click="confirm(row.id)"
            >
              确认到账
            </p>
          </div>
        </Table>
        <Page
          @on-change="changePageHandler"
          :current="pageInfo.page"
          :total="listTotal"
          :page-size="pageInfo.limit"
          show-total
          show-elevator
        />
      </div>
    </div>
    <Modal
      v-model="followModal"
      width="350px"
      class-name="distribution"
      title="修改跟进人"
      @on-ok="updateInviteFun"
    >
      <Select
        style="width:100%;"
        label-in-value
        filterable
        @on-change="changeInviteUser"
        v-model="followInfo.followUserId"
        clearable
        placeholder="跟进人"
      >
        <Option
          v-for="item in salesList"
          :value="item.userId"
          :key="item.nickName"
          >{{ item.nickName }}</Option
        >
      </Select>
    </Modal>
    <!-- 申请开票 -->
    <Modal
      class="modal"
      v-model="applyInvoiceModal"
      width="900"
      title="申请开票"
      label-position="right"
      cancelText
      :mask-closable="false"
      :closable="false"
    >
      <Table
        border
        :columns="applyInvoiceColumns"
        :data="applyInvoiceTableData"
      >
        <template slot="status" slot-scope="{ row }">
          <span>{{
            row.status == "0"
              ? "待付款"
              : row.status == "1"
              ? "付款待确认"
              : row.status == "2"
              ? "已付款"
              : row.status == "3"
              ? "已取消"
              : row.status == "4"
              ? "部分付款"
              : row.status == "5"
              ? "部分退款"
              : row.status == "6"
              ? "全额退款"
              : row.status == "8"
              ? "待审核"
              : row.status == "10"
              ? "订单驳回"
              : ""
          }}</span>
        </template>
        <template slot="operation" slot-scope="{ row, index }">
          <p class="btnClass redFont" @click="deleteApplyInvoice(row, index)">
            删除
          </p>
        </template>
      </Table>
      <Form
        ref="applyInvoiceModal"
        :model="applyInvoiceForm.invoiceDTO"
        :rules="ruleInline"
        style="margin-top:20px;"
        :label-width="110"
      >
        <FormItem label="客户账号：">
          <span>{{ applyInvoiceForm.userMobile }}</span>
        </FormItem>
        <FormItem label="企业名称：">
          <span>{{ applyInvoiceForm.companyName }}</span>
        </FormItem>
        <FormItem label="发票：" prop="invoiceType">
          <RadioGroup
            v-model="applyInvoiceForm.invoiceDTO.invoiceType"
            @on-change="invoiceTypeChange($event)"
          >
            <Radio label="1" style="margin-right:50px;">增值税普通发票</Radio>
            <Radio label="2" style="margin-right:50px;">增值税专用发票</Radio>
          </RadioGroup>
        </FormItem>
        <template
          v-if="
            applyInvoiceForm.invoiceDTO.invoiceType != 3 &&
              applyInvoiceForm.invoiceDTO.invoiceType
          "
        >
          <FormItem prop="subjectType" label="开票主体：">
            <RadioGroup
              v-model="applyInvoiceForm.invoiceDTO.subjectType"
              @on-change="subjectTypeChange($event)"
            >
              <Radio
                label="1"
                v-if="applyInvoiceForm.invoiceDTO.invoiceType == 1"
                >个人</Radio
              >
              <Radio label="2">公司</Radio>
            </RadioGroup>
          </FormItem>
          <!-- 增值税普通发票 -->
          <template v-if="applyInvoiceForm.invoiceDTO.invoiceType == 1">
            <!-- 个人 -->
            <template v-if="applyInvoiceForm.invoiceDTO.subjectType == 1">
              <FormItem prop="name" label="名字：">
                <Input
                  style="width:240px"
                  v-model="applyInvoiceForm.invoiceDTO.name"
                  placeholder="请输入名字"
                ></Input>
              </FormItem>
              <FormItem prop="idNumber" label="身份证号码：">
                <Input
                  style="width:240px"
                  v-model="applyInvoiceForm.invoiceDTO.idNumber"
                  placeholder="请输入身份证号码"
                ></Input>
              </FormItem>
            </template>
            <!-- 公司 -->
            <template v-if="applyInvoiceForm.invoiceDTO.subjectType == 2">
              <FormItem prop="companyName" label="公司名称：">
                <Input
                  style="width:240px"
                  v-model="applyInvoiceForm.invoiceDTO.companyName"
                  placeholder="请输入公司名称"
                ></Input>
              </FormItem>
              <FormItem prop="taxIdentificationNumber" label="纳税识别号：">
                <Input
                  style="width:240px"
                  v-model="applyInvoiceForm.invoiceDTO.taxIdentificationNumber"
                  placeholder="请输入纳税识别号"
                ></Input>
              </FormItem>
            </template>
          </template>
          <!-- 增值税专用发票 -->
          <template v-if="applyInvoiceForm.invoiceDTO.invoiceType == 2">
            <FormItem prop="companyName" label="公司名称：">
              <Input
                style="width:240px"
                v-model="applyInvoiceForm.invoiceDTO.companyName"
                placeholder="请输入公司名称"
              ></Input>
            </FormItem>
            <FormItem prop="taxIdentificationNumber" label="纳税识别号：">
              <Input
                style="width:240px"
                v-model="applyInvoiceForm.invoiceDTO.taxIdentificationNumber"
                placeholder="请输入纳税识别号"
              ></Input>
            </FormItem>
            <FormItem prop="companyAddress" label="公司地址：">
              <Input
                style="width:240px"
                v-model="applyInvoiceForm.invoiceDTO.companyAddress"
                placeholder="请输入公司地址"
              ></Input>
            </FormItem>
            <FormItem prop="companyTel" label="公司电话：">
              <Input
                style="width:240px"
                v-model="applyInvoiceForm.invoiceDTO.companyTel"
                placeholder="请输入公司电话"
              ></Input>
            </FormItem>
            <FormItem prop="openingBank" label="开户银行：">
              <Input
                style="width:240px"
                v-model="applyInvoiceForm.invoiceDTO.openingBank"
                placeholder="请输入开户银行"
              ></Input>
            </FormItem>
            <FormItem prop="bankAccount" label="开户账号：">
              <Input
                style="width:240px"
                v-model="applyInvoiceForm.invoiceDTO.bankAccount"
                placeholder="请输入开户账号"
              ></Input>
            </FormItem>
          </template>
        </template>
        <FormItem label="开票总金额：">
          <span>{{ applyInvoiceForm.invoiceTotalAmount }}元</span>
        </FormItem>
        <FormItem label="应付开票金额：">
          <span>{{ applyInvoiceForm.invoiceMoney }}元</span>
        </FormItem>
        <FormItem label="付款凭证：">
          <Upload
            ref="applyInvoiceUpload"
            :action="fileUpload"
            :default-file-list="applyInvoiceForm.defaultFileList"
            :data="{ prefix: '' }"
            :before-upload="
              file => {
                return beforeUpload(file);
              }
            "
            show-upload-list
            :on-success="
              (res, file, fileList) => {
                successHandler(res, file, fileList);
              }
            "
            :on-remove="
              (file, fileList) => {
                removeHandler(file, fileList);
              }
            "
            :format="['jpg', 'jpeg', 'png', 'gif']"
          >
            <div style="padding: 5px;">
              <Button type="primary" ghost>请上传</Button>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="applyInvoiceCancel">取消</Button>
        <Button
          type="primary"
          :loading="applyInvoiceLoading"
          @click="applyInvoiceConfirm"
          >申请开票</Button
        >
      </div>
    </Modal>
    <!-- 上传支付凭证 -->
    <Modal
      class="modal"
      v-model="uploadPayVoucherModal"
      width="400"
      title="上传支付凭证"
      label-position="right"
      cancelText
      :mask-closable="false"
      :closable="false"
    >
      <Upload
        type="drag"
        ref="uploadPayVoucher"
        :action="fileUpload"
        :data="{ prefix: '' }"
        :before-upload="
          file => {
            return PayVoucherBeforeUpload(file);
          }
        "
        show-upload-list
        :on-success="
          (res, file, fileList) => {
            PayVoucherSuccessHandler(res, file, fileList);
          }
        "
        :on-remove="
          (file, fileList) => {
            PayVoucherRemoveHandler(file, fileList);
          }
        "
        :format="['jpg', 'jpeg', 'png', 'pdf']"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>请拖拽文件到此区域或点击上传</p>
          <p class="hint">注：支持JPG、JPEG、PNG、PDF 格式上传</p>
        </div>
      </Upload>
      <div slot="footer">
        <Button type="default" @click="uploadPayVoucherCancel">取消</Button>
        <Button
          type="primary"
          :loading="uploadPayVoucherLoading"
          @click="uploadPayVoucherConfirm"
          >确定</Button
        >
      </div>
    </Modal>

    <OrderDetailNew
      v-if="isDetailShow && !isShowOldDetail"
      :id="detailId"
      :parentData="parentData"
      @back="getChildrenStatus()"
      @refresh="refreshList"
    ></OrderDetailNew>
    <OrderDetail
      v-if="isDetailShow && isShowOldDetail"
      :id="detailId"
      :parentData="parentData"
      @back="getChildrenStatus()"
      @refresh="refreshList"
    ></OrderDetail>
    <InvoiceOrderDetail
      v-if="isShowInvoiceOrderDetail"
      :rowData="parentData"
      @back="isShowInvoiceOrderDetail = false"
      @refresh="refreshList"
    ></InvoiceOrderDetail>
  </div>
</template>
<script>
import OrderDetailNew from "./components/OrderDetailNew";
import OrderDetail from "./components/OrderDetail";
import InvoiceOrderDetail from "./components/InvoiceOrderDetail";
import * as API from "@/api/taxService/order.js";
import * as APIOrder from "@/api/orderManage/addOrder";
import { roleusers } from "@/api/taxService/user";
import { getTaxCountry } from "@/api/taxService/common.js";
import { getToken } from "@/libs/util";
import * as math from "mathjs"
import { bignumber } from 'mathjs';
export default {
  name: "orderList",
  components: {
    OrderDetailNew,
    OrderDetail,
    InvoiceOrderDetail
  },
  data() {
    return {
      fileUpload: this.workOrderFile,
      // 上传支付凭证
      uploadPayVoucherModal: false,
      uploadPayVoucherLoading: false,
      uploadPayVoucherForm: {},
      // 确认到账
      applyInvoiceModal: false,
      applyInvoiceLoading: false,
      applyInvoiceForm: {
        invoiceDTO: {}
      },
      applyInvoiceColumns: [],
      applyInvoiceTableData: [],
      ruleInline: {
        invoiceType: [
          {
            required: true,
            message: "请选择发票类型。",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "请填写开票信息中姓名。",
            trigger: "blur"
          }
        ],
        idNumber: [
          {
            required: true,
            message: "请填写身份证号码",
            trigger: "blur"
          }
        ],
        companyName: [
          {
            required: true,
            message: "请填写公司名称。",
            trigger: "blur"
          }
        ],
        taxIdentificationNumber: [
          {
            required: true,
            message: "请填写纳税识别号。",
            trigger: "blur"
          }
        ],
        companyAddress: [
          {
            required: true,
            message: "请填写公司地址。",
            trigger: "blur"
          }
        ],
        companyTel: [
          {
            required: true,
            message: "请填写公司电话。",
            trigger: "blur"
          }
        ],
        openingBank: [
          {
            required: true,
            message: "请填写开户银行。",
            trigger: "blur"
          }
        ],
        bankAccount: [
          {
            required: true,
            message: "请填写开户账号。",
            trigger: "blur"
          }
        ]
      },
      isShowInvoiceOrderDetail: false,
      parentCompanyList: [],
      paymentTypeList: [],
      isDetailShow: false,
      isShowOldDetail: true,
      searchForm: {
        searchContent: "",
        inviteContent: "",
        orderSource: "",
        startTime: "",
        endTime: "",
        status: "-1",
        countryCode: "",
        functionCode: "",
        paymentStartTime: "",
        paymentEndTime: "",
        inviteContentType: ""
      },
      date: "",
      paymentDate: "",
      countryList: [],
      pageInfo: {
        limit: 10,
        page: 1
      },
      listTotal: 0,
      tableLoading: false,
      detailId: "",
      parentData: "",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          type: "index",
          width: 50
        },
        {
          title: "订单号",
          key: "orderNo",
          minWidth: 50
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "用户账号",
          key: "userMobile"
        },
        // {
        //     title: '公司名称',
        //     key: 'amountMoney'
        // },
        {
          title: "服务名称",
          // key: 'productNames',
          render(h, params) {
            let productNames = params.row.productNames.split(";");
            return h(
              "div",
              productNames.map(function(type) {
                return h("div", {}, type);
              })
            );
          }
        },
        {
          title: "服务金额",
          key: "orderOldMoney"
        },
        {
          title: "发票金额",
          key: "invoiceMoney"
        },
        {
          title: "应付金额",
          key: "orderMoney"
        },
        {
          title: "优惠金额",
          key: "discAmount"
        },
        {
          title: "实付金额",
          key: "amountMoney"
        },
        {
          title: "退款金额",
          key: "refundMoney"
        },
        {
          title: "订单来源",
          key: "orderSource",
          render: (h, params) => {
            return h(
              "span",
              params.row.orderSource == 0
                ? "PC网页端"
                : params.row.orderSource == 1
                ? "微信小程序"
                : params.row.orderSource == 2
                ? "H5端"
                : params.row.orderSource == 5
                ? "后台录入"
                : params.row.orderSource == 6
                ? "申请开票"
                : ""
            );
          }
        },
        {
          title: "订单状态",
          slot: "status"
        },
        {
          title: "邀请人",
          key: "inviteUserName"
        },
        {
          title: "订单归属",
          key: "followUserName"
        },
        {
          title: "操作",
          slot: "operate"
        }
      ],
      allAmountMoney: 0,
      allDiscAmount: 0,
      allOrderMoney: 0,
      allOrderOldMoney: 0,
      allInvoiceMoney: 0,
      tableData: [],
      value: "",
      salesList: [],
      followModal: false,
      inviteInfo: {},
      followInfo: {},
      selectArr: [],
      selectUserArr: [],
      taxPoint: 0
    };
  },
  created() {
    this.getCurrentMonthFirst();
  },
  mounted() {
    this.getOrderList();
    this.statisticsMoney();
    this.getCountryList();
    this.getRoleusers();
    this.getCompanyList();
    this.getPaymenttypeList();
  },
  methods: {
    // 子组件状态change
    getChildrenStatus() {
      this.isDetailShow = false;
      this.getOrderList();
    },
    // 金额保留2位小数
    formatDecimal(num, decimal) {
      num = num.toString();
      let index = num.indexOf(".");
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1);
      } else {
        num = num.substring(0);
      }
      return Number(parseFloat(num).toFixed(decimal));
    },
    // 保留2位小数
    getToFixedTwo(val) {
      if (typeof val == "number") {
        return Math.floor(val * 100)/100;
      } else {
        return val;
      }
    },
    //获取所属公司下拉
    getCompanyList() {
      APIOrder.getCompanybody().then(res => {
        if (res.code == 0) {
          this.parentCompanyList = res.data;
        }
      });
    },
    //获取付款类型下拉
    getPaymenttypeList() {
      APIOrder.getPaymenttype().then(res => {
        if (res.code == 0) {
          this.paymentTypeList = res.data;
        }
      });
    },
    // 申请开票
    applyInvoice(row, index) {
      // row有值表示单个申请开票
      let columns = [];
      if (row) {
        // 单条开票
        if (row.invoicedMoney >= row.amountMoney - row.refundMoney) {
          this.$Message.warning("该订单无剩余可开票金额！");
          return false;
        }
        if (row.status == 2) {
          columns = [
            {
              title: "订单号",
              key: "orderNo"
            },
            {
              title: "应付金额",
              key: "orderMoney"
            },
            {
              title: "实付金额",
              key: "amountMoney"
            },
            {
              title: "本次开票金额",
              key: "invoiceAmount",
              minWidth: 20
            },
            {
              title: "已开票金额",
              key: "invoicedMoney"
            },
            {
              title: "退款金额",
              key: "refundMoney"
            },
            {
              title: "订单状态",
              slot: "status"
            },
            {
              title: "操作",
              slot: "operation"
            }
          ];
        } else {
          columns = [
            {
              title: "订单号",
              key: "orderNo"
            },
            {
              title: "应付金额",
              key: "orderMoney"
            },
            {
              title: "实付金额",
              key: "amountMoney"
            },
            {
              title: "本次开票金额",
              key: "invoiceAmount",
              minWidth: 20
            },
            {
              title: "已开票金额",
              key: "invoicedMoney"
            },
            {
              title: "退款金额",
              key: "refundMoney"
            },
            {
              title: "订单状态",
              slot: "status"
            }
          ];
        }
        this.applyInvoiceColumns = columns;
      } else {
        /**
         * 1.仅已付款状态可批量申请开票
         * 2.仅同一个客户下的订单可以批量申请开票
         * 3.仅同一个所属公司的订单可以批量申请开票
         */
        let hintText = "";
        let flag = this.selectUserArr.some(item => {
          if (item.userId != this.selectUserArr[0].userId) {
            hintText = "批量申请开票只支持同一个客户的订单进行开票!";
            return true;
          }
          if (item.companyBody != this.selectUserArr[0].companyBody) {
            hintText = "批量申请开票只支持同一个所属公司的订单进行开票!";
            return true;
          }
          if (item.invoicedMoney >= item.amountMoney - item.refundMoney) {
            hintText = `订单号为${item.orderNo}的订单不支持开票`;
            return true;
          }
        });
        if (flag) {
          this.$Message.warning(hintText);
          return false;
        } else {
          columns = [
            {
              title: "订单号",
              key: "orderNo"
            },
            {
              title: "应付金额",
              key: "orderMoney"
            },
            {
              title: "实付金额",
              key: "amountMoney"
            },
            {
              title: "本次开票金额",
              key: "invoiceAmount",
              minWidth: 20
            },
            {
              title: "已开票金额",
              key: "invoicedMoney"
            },
            {
              title: "退款金额",
              key: "refundMoney"
            },
            {
              title: "订单状态",
              slot: "status"
            },
            {
              title: "操作",
              slot: "operation"
            }
          ];
          this.applyInvoiceColumns = columns;
        }
      }
      // 计算发票相关金额并设置applyInvoiceTableData
      this.calcInvoiceMoneyAll(row);
    },
    // 计算发票相关金额
    calcInvoiceMoneyAll(row) {
      if (row) {
        this.applyInvoiceTableData = [row];
        this.applyInvoiceForm = {
          invoiceDTO: {},
          ...row
        };
      } else {
        this.applyInvoiceTableData = JSON.parse(
          JSON.stringify(this.selectUserArr)
        );
      }
      this.applyInvoiceTableData.forEach(item => {
        item.invoiceAmount = math.chain(math.bignumber(item.amountMoney))
        .subtract(math.bignumber(item.invoicedMoney))
        .subtract(math.bignumber(item.invoiceMoney))
        .subtract(math.bignumber(item.refundMoney))
        .done()
        item.invoiceAmount = JSON.parse(JSON.stringify(item.invoiceAmount)).value
      });
      // 计算开票总金额(可开票金额 = 实付金额 - 已开票金额 -发票金额- 退款金额)
      this.applyInvoiceForm.invoiceTotalAmount = this.getToFixedTwo(
        this.applyInvoiceTableData.reduce(
          (acc, cur) => (acc += Number(cur.invoiceAmount)),
          0
        )
      );
      this.applyInvoiceForm.invoiceMoney = this.getToFixedTwo(
        this.applyInvoiceForm.invoiceTotalAmount * this.taxPoint
      );
      this.applyInvoiceModal = true;
    },
    // 删除部分开票订单
    deleteApplyInvoice(row, index) {
      if (this.applyInvoiceTableData.length == 1) {
        this.$Message.warning(
          "最少保留一条申请开票信息，如无需开票，取消开票即可！"
        );
        return false;
      }
      this.applyInvoiceTableData.splice(index, 1);
      // 更新开票金额和应付开票金额等数据
      this.applyInvoiceForm.invoiceTotalAmount = this.getToFixedTwo(
        this.applyInvoiceTableData.reduce(
          (acc, cur) => (acc += Number(cur.invoiceAmount)),
          0
        )
      );
      this.applyInvoiceForm.invoiceMoney = this.getToFixedTwo(
        this.applyInvoiceForm.invoiceTotalAmount * this.taxPoint
      );
    },
    // 开票change
    invoiceTypeChange(val) {
      // 增值税普通发票，默认选中个人，增值税专用发票默认选中公司
      this.$set(this.applyInvoiceForm.invoiceDTO, "subjectType", val);
      // 获取税点
      this.getCompanyBodyTax(val);
    },
    // 获取税点
    getCompanyBodyTax(invoiceType) {
      let params = {
        companyBody: this.applyInvoiceForm.companyBody
      };
      APIOrder.getCompanyBodyTax(params).then(res => {
        if (res.code == 0) {
          if (invoiceType == 1) {
            this.taxPoint = res.data.generalTax;
          } else if (invoiceType == 2) {
            this.taxPoint = res.data.specialTax;
          } else {
            this.taxPoint = 0;
          }
        }
        // 重新计算发票相关金额
        this.applyInvoiceForm.invoiceMoney = this.getToFixedTwo(
          this.applyInvoiceForm.invoiceTotalAmount * this.taxPoint
        );
      });
    },
    // 开票主体change
    subjectTypeChange(val) {
      this.$set(this.applyInvoiceForm.invoiceDTO, "subjectType", val);
    },
    // 上传凭证-start
    //上传前确认
    beforeUpload(file) {
      this.fileObj = file;
      const check = this.applyInvoiceForm.paymentProof;
      if (check) {
        this.removeHandler("", "", 0);
      }
      return true;
    },
    // 上传成功
    successHandler(res, file, fileList) {
      this.applyInvoiceForm.paymentProof = res.data.fileUrl;
      this.applyInvoiceForm.attachmentsName = file.name;
    },
    // 移除文件
    removeHandler(file, fileList) {
      this.applyInvoiceForm.paymentProof = "";
      this.applyInvoiceForm.attachmentsName = "";
      this.$refs["applyInvoiceUpload"].clearFiles();
    },
    // 上传凭证-end
    // 取消开票
    applyInvoiceCancel() {
      this.applyInvoiceModal = false;
      // 清空上传的文件
      this.removeHandler();
    },
    // 发票校验
    invoiceValidate() {
      // 增值税普通发票
      if (this.applyInvoiceForm.invoiceDTO.invoiceType == 1) {
        // 个人
        if (this.applyInvoiceForm.invoiceDTO.subjectType == 1) {
          if (!this.applyInvoiceForm.invoiceDTO.name) {
            this.$Message.warning("请填写发票个人名字!");
            return false;
          }
          if (!this.applyInvoiceForm.invoiceDTO.idNumber) {
            this.$Message.warning("请填写身份证号码!");
            return false;
          }
        }
        // 公司
        if (this.applyInvoiceForm.invoiceDTO.subjectType == 2) {
          if (!this.applyInvoiceForm.invoiceDTO.companyName) {
            this.$Message.warning("请填写公司名称!");
            return false;
          }
          if (!this.applyInvoiceForm.invoiceDTO.taxIdentificationNumber) {
            this.$Message.warning("请填写纳税识别号!");
            return false;
          }
        }
      }
      // 增值税专用发票
      if (this.applyInvoiceForm.invoiceDTO.invoiceType == 2) {
        if (!this.applyInvoiceForm.invoiceDTO.companyName) {
          this.$Message.warning("请填写公司名称!");
          return false;
        }
        if (!this.applyInvoiceForm.invoiceDTO.taxIdentificationNumber) {
          this.$Message.warning("请填写纳税识别号!");
          return false;
        }
        if (!this.applyInvoiceForm.invoiceDTO.companyAddress) {
          this.$Message.warning("请填写公司地址!");
          return false;
        }
        if (!this.applyInvoiceForm.invoiceDTO.companyTel) {
          this.$Message.warning("请填写公司电话!");
          return false;
        }
        if (!this.applyInvoiceForm.invoiceDTO.openingBank) {
          this.$Message.warning("请填写开户银行!");
          return false;
        }
        if (!this.applyInvoiceForm.invoiceDTO.bankAccount) {
          this.$Message.warning("请填写开户账号!");
          return false;
        }
      }
      return true;
    },
    // 确认开票
    applyInvoiceConfirm() {
      let self = this;
      // 发票校验
      if (!self.applyInvoiceForm.invoiceDTO.invoiceType) {
        this.$Message.warning("请选择开票类型!");
        return false;
      }
      // 发票信息校验
      if (self.applyInvoiceForm.invoiceDTO.invoiceType != 3) {
        if (!self.invoiceValidate()) {
          return false;
        }
      }
      let params = {
        ...self.applyInvoiceForm,
        orderDTOList: this.applyInvoiceTableData.map(item => {
          item.orderId = item.id;
          console.log(item.invoiceAmount)
          return item;
        })
      };
      let hintText = "";
      if (self.applyInvoiceForm.paymentProof) {
        hintText = "已提交申请，待确认付款中!";
      } else {
        hintText = `请提醒客户，及时将 ${this.applyInvoiceForm.invoiceMoney}元的开票金额转账至跨税云，以免影响开票进度!`;
      }
      self.applyInvoiceLoading = true;
      API.batchApplyInvoice(params)
        .then(res => {
          if (res.code == 0) {
            self.$Message.success(hintText);
            self.applyInvoiceLoading = false;
            self.applyInvoiceModal = false;
            self.getOrderList();
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          self.applyInvoiceLoading = false;
        });
    },
    // 取消开票
    cancelApplyInvoice(row) {
      this.$Modal.confirm({
        title: "确定取消开票？",
        loading: true,
        onOk: () => {
          let data = {
            orderId: row.id
          };
          API.cancelApplyInvoice(data)
            .then(res => {
              if (res.code == 0) {
                this.$Message.success("取消成功");
                this.getOrderList();
              } else {
                this.$Message.warning(res.message);
              }
            })
            .catch(err => console.log(err))
            .finally(() => {
              this.$Modal.remove();
            });
        }
      });
    },
    // 打开上传凭证窗口
    openUploadPayVoucher(row) {
      this.uploadPayVoucherModal = true;
      this.uploadPayVoucherForm.orderId = row.id;
    },
    // 取消上传支付凭证
    uploadPayVoucherCancel() {
      this.uploadPayVoucherModal = false;
      this.uploadPayVoucherForm = {};
      this.PayVoucherRemoveHandler("", "");
    },
    PayVoucherBeforeUpload(file) {
      this.fileObj = file;
      const check = this.uploadPayVoucherForm.invoiceFile;
      if (check) {
        this.PayVoucherRemoveHandler("", "");
      }
      return true;
    },
    // 上传成功
    PayVoucherSuccessHandler(res, file, fileList) {
      this.uploadPayVoucherForm.invoiceFile = res.data.fileUrl;
      // this.uploadPayVoucherForm.attachmentsName = file.name;
    },
    // 移除文件
    PayVoucherRemoveHandler(file, fileList) {
      this.uploadPayVoucherForm.invoiceFile = "";
      // this.uploadPayVoucherForm.attachmentsName = "";
      this.$refs["uploadPayVoucher"].clearFiles();
    },
    // 确定上传支付凭证
    uploadPayVoucherConfirm() {
      let params = {
        orderId: this.uploadPayVoucherForm.orderId,
        invoiceFile: this.uploadPayVoucherForm.invoiceFile
      };
      this.uploadPayVoucherLoading = true;
      API.orderInvoice(params)
        .then(res => {
          if (res.code == 0) {
            this.$Message.success("上传成功！");
            this.uploadPayVoucherModal = false;
            this.getOrderList();
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.uploadPayVoucherLoading = false;
        });
    },
    //订单创建时间
    dateChange(date) {
      this.searchForm.startTime = date[0];
      this.searchForm.endTime = date[1];
    },
    //订单付款时间
    paymentDateChange(date) {
      this.searchForm.paymentStartTime = date[0];
      this.searchForm.paymentEndTime = date[1];
    },
    //选择tab状态
    tabsChange(name) {
      this.searchForm.status = name;
      this.getOrderList();
      this.statisticsMoney();
    },
    //获取税号国家下拉数据
    getCountryList() {
      getTaxCountry().then(res => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });
    },
    //获取列表
    getOrderList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      API.getOrderList(params)
        .then(res => {
          if (res.code == 0) {
            this.tableLoading = false;
            this.tableData = res.data.records;
            this.listTotal = Number(res.data.total);
          } else {
            this.$Message.warning(res.message);
            this.tableLoading = false;
          }
        })
        .catch(err => console.log(err));
    },
    //搜索列表
    searchList() {
      this.pageInfo.page = 1;
      this.searchForm.status = "-1";
      this.getOrderList();
      this.statisticsMoney();
    },
    //重置列表
    resetList() {
      this.searchForm = {};
      this.date = "";
      this.pageInfo.page = 1;
      this.searchForm.status = "-1";

      this.getOrderList();
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.getOrderList();
    },
    //查看详情
    toDetail(row) {
      // 后台录入查看详情看新页面，其他看旧页面
      if (row.orderSource == 5) {
        this.isShowOldDetail = false;
        this.isDetailShow = true;
        this.detailId = row.id;
        this.parentData = {
          orderId: row.id
        };
      } else {
        this.isShowOldDetail = true;
        this.isDetailShow = true;
        this.detailId = row.id;
        this.parentData = {
          orderId: row.id
        };
      }
    },
    // 查看开票订单详情
    toInvoiceDetail(row) {
      this.parentData = {
        id: row.id,
        from: "orderList"
      };
      this.isShowInvoiceOrderDetail = true;
    },
    //确认到账操作
    confirm(id) {
      this.$Modal.confirm({
        title: "是否确认到账",
        loading: true, 
        render: h => {
          return h("DatePicker", {
            props: {
              value: this.value,
              placeholder: "请选择款项的实际到账日期"
            },
            on: {
              input: val => {
                this.value = val;
              }
            }
          });
        },
        onOk: () => {
          let data = {
            orderId: id,
            paymentTime: this.formatDate(this.value)
          };
          if (!this.value) {
            this.$Message.warning("请选择款项的实际到账日期！");
            return false;
          }
          API.sureAccount(data)
            .then(res => {
              if (res.code == 0) {
                this.$Message.success("确认成功");
                this.getOrderList();
              } else {
                this.$Message.warning(res.message);
              }
            })
            .catch(err => console.log(err))
            .finally(() => {
              this.value = "";
              this.$Modal.remove();
            });
        }
      });
    },
    refreshList() {
      this.isDetailShow = false;
      this.getOrderList();
    },
    // 根据条件查询统计订单金额
    statisticsMoney() {
      let params = { ...this.searchForm, ...this.pageInfo };
      API.statistics(params)
        .then(res => {
          if (res.code === 0) {
            this.allAmountMoney = res.data.allAmountMoney;
            this.allDiscAmount = res.data.allDiscAmount;
            this.allOrderMoney = res.data.allOrderMoney;
            this.allOrderOldMoney = res.data.allOrderOldMoney;
            this.allInvoiceMoney = res.data.allInvoiceMoney;
          }
        })
        .catch(err => console.log(err));
    },
    //导出Excel
    exportList() {
      let formData = new FormData();
      formData.append("searchContent", this.searchForm.searchContent);
      formData.append("status", this.searchForm.status);
      formData.append("orderSource", this.searchForm.orderSource);
      formData.append("startTime", this.searchForm.startTime);
      formData.append("endTime", this.searchForm.endTime);
      formData.append("countryCode", this.searchForm.countryCode);
      formData.append("functionCode", this.searchForm.functionCode);
      formData.append("inviteContent", this.searchForm.inviteContent);
      formData.append("paymentStartTime", this.searchForm.paymentStartTime);
      formData.append("paymentEndTime", this.searchForm.paymentEndTime);
      formData.append("inviteContentType", this.searchForm.inviteContentType);
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open(
        "post",
        this.baseUrl + "/etax/derive/management/order/export/list",
        true
      );
      // 设置请求token
      xmlResquest.setRequestHeader("Authorization", "Bearer " + getToken());
      xmlResquest.responseType = "blob";
      // 返回
      xmlResquest.onload = function(oEvent) {
        let content = xmlResquest.response;
        // 组装a标签
        let elink = document.createElement("a");
        // 设置下载文件名
        elink.download = timestamp + ".xlsx";
        elink.style.display = "none";

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
    },
    //批量操作
    selectData(val) {
      let self = this;
      this.selectUserArr = val;
      this.selectArr = [];
      val.map(function(i, k) {
        self.selectArr.push(i.id);
      });
    },
    //修改跟进人
    updatefollowuserFun() {
      if (this.selectArr.length === 0) {
        this.$Message.success("请选择订单");
        return;
      }
      this.followModal = true;
    },
    changeInviteUser(val) {
      if (val != undefined) {
        this.inviteInfo.userId = val.value;
        this.inviteInfo.userName = val.label;
      }
    },
    updateInviteFun() {
      if (JSON.stringify(this.inviteInfo) === "{}") {
        this.$Message.success("请选择邀请人");
        return;
      }
      this.inviteInfo.ids = this.selectArr.join(",");
      API.updatefollowuserAPI(this.inviteInfo).then(res => {
        this.selectArr = [];
        this.$Message.success("修改成功!");
        this.getOrderList();
      });
    },
    getRoleusers() {
      roleusers({
        roleCode: "sales_manager;channel_manager"
      })
        .then(res => {
          this.salesList = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    //时间格式转换
    formatDate(date) {
      if (typeof date === "object") {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        return y + "-" + m + "-" + d + " 00:00:00";
      } else {
        return date;
      }
    },
    getCurrentMonthFirst() {
      var date = new Date();
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      this.searchForm.startTime = date.getFullYear() + "-" + month + "-1";
      this.searchForm.endTime = date.getFullYear() + "-" + month + "-" + day;
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  background: #fff;
  padding: 15px;
  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 15px;
  }
  .button {
    color: #2d8cf0;
    cursor: pointer;
  }
}
.formContainer {
  background: #f8f8f8;
  padding: 20px 20px 0px 20px;
  margin-bottom: 20px;
}
.money {
  .statistical {
    padding-left: 17px;
    font-size: 14px;
    margin-bottom: 30px;
  }
}
/deep/ .tableAreaInline {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .ivu-tabs-bar {
    margin-bottom: 0px !important;
    border: none !important;
  }
  .ivu-btn-primary {
    height: 30px;
  }
  .ivu-tabs-ink-bar {
    display: none;
  }
}
/deep/ .tableArea {
  .ivu-table-cell {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}
.btnClass {
  cursor: pointer;
  color: #2d8cf0;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
}
.redFont {
  color: red;
}
.hint {
  text-align: center;
  color: #e99d42;
  font-size: 12px;
  line-height: 20px;
}
</style>
