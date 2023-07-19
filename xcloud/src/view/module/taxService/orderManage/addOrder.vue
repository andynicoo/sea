<template>
  <div class="addOrder">
    <!-- 基本信息 -->
    <div class="titleBlack">
      <p>
        <Icon type="md-bookmark" />
        <span class="title">基本信息</span>
      </p>
    </div>
    <Form
      class="addForm"
      ref="addForm"
      :model="addForm"
      :rules="ruleInline"
      :label-width="110"
    >
      <FormItem label="所属公司：" prop="companyBody">
        <Select
          v-model="addForm.companyBody"
          style="width:240px;"
          placeholder="请选择所属公司"
          @on-change="companyBodyChange($event)"
          filterable
          clearable
        >
          <Option
            v-for="(item, i) in parentCompanyList"
            :value="item.code"
            :key="i"
            >{{ item.value }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="付款类型：" prop="paymentType">
        <Select
          v-model="addForm.paymentType"
          style="width:240px;"
          placeholder="请选择付款类型"
          @on-change="paymentTypeChange($event)"
          clearable
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
      <Divider />
      <!-- 商品信息 -->
      <div class="titleBlack">
        <p>
          <Icon type="md-bookmark" />
          <span class="title">商品信息</span>
        </p>
        <Button type="primary" @click="addProductInfo">新增</Button>
      </div>
      <Table :columns="productColumns" :data="productInfo" border>
        <template slot="productInfo" slot-scope="{ index }">
          <Select
            clearable
            v-model="productInfo[index].countryCode"
            style="width:240px;margin-right:10px;"
            placeholder="服务国家"
            @on-change="countryCodeChange($event, index)"
            filterable
            clearable
          >
            <Option
              v-for="(item, i) in countryList"
              :value="item.code"
              :key="i"
              >{{ item.value }}</Option
            >
          </Select>
          <Select
            clearable
            v-model="productInfo[index].productId"
            style="width:240px;"
            placeholder="服务名称"
            @on-change="productChange($event, index)"
            filterable
            clearable
          >
            <Option
              v-for="(item, i) in productInfo[index].productList"
              :value="item.id"
              :key="i"
              >{{ item.productName }}</Option
            >
          </Select>
        </template>
        <template slot="quantity" slot-scope="{ index }">
          <InputNumber
            :max="5000"
            :min="0"
            :active-change="false"
            :precision="0"
            v-model="productInfo[index].quantity"
            @on-change="quantityChange($event, index)"
            clearable
          ></InputNumber>
        </template>
        <template slot="operation" slot-scope="{ row, index }">
          <span class="button" @click="deleteProductInfo(index)">删除</span>
        </template>
      </Table>
      <Divider />
      <!-- 费用信息 -->
      <div class="titleBlack">
        <p>
          <Icon type="md-bookmark" />
          <span class="title">费用信息</span>
        </p>
      </div>
      <Table class="costTable" :columns="costColumns" :data="costDTO" border>
        <template slot="discountedPrice" slot-scope="{ row, index }">
          <InputNumber
            :max="costDTO[index].totalAmount"
            :min="0"
            :active-change="false"
            :precision="2"
            v-model="costDTO[index].discountedPrice"
            @on-change="couponMoneyChange($event, index)"
            clearable
          ></InputNumber>
        </template>
        <template slot="invoiceAmount" slot-scope="{ row, index }">
          <span>{{ costDTO[index].invoiceAmount }}</span>
        </template>
      </Table>
      <Divider />
      <div class="titleBlack">
        <p>
          <Icon type="md-bookmark" />
          <span class="title">用户信息</span>
        </p>
      </div>
      <div class="userInfo">
        <FormItem label="客户手机号：" prop="userMobile">
          <Input
            v-model="addForm.userMobile"
            placeholder="请输入完整手机号关联公司"
            style="width: 240px;"
          >
            <!-- @keyup.enter="searchPhone()" -->
            <!-- <Icon type="ios-search" slot="suffix" @click="searchPhone()" /> -->
          </Input>
        </FormItem>
        <!-- <FormItem label="合同公司名称：" prop="companyName" :label-width="210">
          <Input
            placeholder="请输入合同公司名称"
            v-model="addForm.companyName"
            style="width: 240px;"
          />
        </FormItem> -->
      </div>
      <Divider />
      <!-- 发票信息 -->
      <div class="titleBlack">
        <p>
          <Icon type="md-bookmark" />
          <span class="title">发票信息</span>
        </p>
      </div>
      <Form
        class="invoiceDTO"
        ref="invoiceDTO"
        :model="invoiceDTO"
        :rules="ruleInline"
        :label-width="110"
      >
        <FormItem class="invoiceFirst" :label-width="0">
          <RadioGroup
            v-model="invoiceDTO.invoiceType"
            @on-change="invoiceTypeChange($event)"
          >
            <Radio
              label="3"
              style="margin-right:50px;"
              :disabled="addForm.paymentType == 3"
              >不开发票</Radio
            >
            <Radio
              label="1"
              style="margin-right:50px;"
              :disabled="addForm.paymentType == 3"
              >增值税普通发票</Radio
            >
            <Radio
              label="2"
              style="margin-right:50px;"
              :disabled="addForm.paymentType == 3"
              >增值税专用发票</Radio
            >
          </RadioGroup>
          <span
            >开票金额：<span style="color:red;">
              ￥{{ invoiceDTO.invoiceMoney }}</span
            ></span
          >
        </FormItem>
        <div class="invoiceRemark">
          <div class="left">备注：</div>
          <div class="right">
            <p>1. 申请开票需要加收增值税金额，税点为{{Math.floor(this.taxPoint * 100)}}%</p>
            <p>2. 建议消费满1000元开具发票</p>
          </div>
        </div>
        <div v-if="invoiceDTO.invoiceType != 3 && invoiceDTO.invoiceType">
          <FormItem prop="subjectType" label="开票主体：">
            <RadioGroup
              v-model="invoiceDTO.subjectType"
              @on-change="subjectTypeChange($event)"
            >
              <Radio label="1" v-if="invoiceDTO.invoiceType == 1">个人</Radio>
              <Radio label="2">公司</Radio>
            </RadioGroup>
          </FormItem>
          <!-- 增值税普通发票 -->
          <div v-if="invoiceDTO.invoiceType == 1">
            <!-- 个人 -->
            <div v-show="invoiceDTO.subjectType == 1">
              <FormItem prop="name" label="名字：">
                <Input
                  style="width:240px"
                  v-model="invoiceDTO.name"
                  placeholder="请输入名字"
                ></Input>
              </FormItem>
              <FormItem prop="idNumber" label="身份证号码：">
                <Input
                  style="width:240px"
                  v-model="invoiceDTO.idNumber"
                  placeholder="请输入身份证号码"
                ></Input>
              </FormItem>
            </div>
            <!-- 公司 -->
            <div v-show="invoiceDTO.subjectType == 2">
              <FormItem prop="companyName" label="公司名称：">
                <Input
                  style="width:240px"
                  v-model="invoiceDTO.companyName"
                  placeholder="请输入公司名称"
                ></Input>
              </FormItem>
              <FormItem prop="taxIdentificationNumber" label="纳税识别号：">
                <Input
                  style="width:240px"
                  v-model="invoiceDTO.taxIdentificationNumber"
                  placeholder="请输入纳税识别号"
                ></Input>
              </FormItem>
            </div>
          </div>
          <!-- 增值税专用发票 -->
          <div v-if="invoiceDTO.invoiceType == 2">
            <FormItem prop="companyName" label="公司名称：">
              <Input
                style="width:240px"
                v-model="invoiceDTO.companyName"
                placeholder="请输入公司名称"
              ></Input>
            </FormItem>
            <FormItem prop="taxIdentificationNumber" label="纳税识别号：">
              <Input
                style="width:240px"
                v-model="invoiceDTO.taxIdentificationNumber"
                placeholder="请输入纳税识别号"
              ></Input>
            </FormItem>
            <FormItem prop="companyAddress" label="公司地址：">
              <Input
                style="width:240px"
                v-model="invoiceDTO.companyAddress"
                placeholder="请输入公司地址"
              ></Input>
            </FormItem>
            <FormItem prop="companyTel" label="公司电话：">
              <Input
                style="width:240px"
                v-model="invoiceDTO.companyTel"
                placeholder="请输入公司电话"
              ></Input>
            </FormItem>
            <FormItem prop="openingBank" label="开户银行：">
              <Input
                style="width:240px"
                v-model="invoiceDTO.openingBank"
                placeholder="请输入开户银行"
              ></Input>
            </FormItem>
            <FormItem prop="bankAccount" label="开户账号：">
              <Input
                style="width:240px"
                v-model="invoiceDTO.bankAccount"
                placeholder="请输入开户账号"
              ></Input>
            </FormItem>
          </div>
        </div>
      </Form>
      <Divider />
      <!-- 款项信息 -->
      <div class="titleBlack">
        <p>
          <Icon type="md-bookmark" />
          <span class="title">款项信息</span>
        </p>
      </div>
      <div v-if="addForm.paymentType != 3">
        <Table :columns="paymentColumns" :data="paymentInfo" border>
          <template slot="paymentType" slot-scope="{ row, index }">
            {{
              paymentTypeList.find(
                item => paymentInfo[index].paymentType == item.code
              )
                ? paymentTypeList.find(
                    item => paymentInfo[index].paymentType == item.code
                  ).value
                : ""
            }}
          </template>
          <template slot="payer" slot-scope="{ row, index }">
            <Input v-model="paymentInfo[index].payer" clearable />
          </template>
          <template slot="amount" slot-scope="{ row, index }">
            <!-- 分期付款，则分期金额由操作人员填写，正常付款则自动带入订单金额 -->
            <div>
              <InputNumber
                :max="addForm.amount"
                :min="0"
                :active-change="false"
                v-if="addForm.paymentType == 2"
                v-model="paymentInfo[index].amount"
                @on-change="orderAmountChange($event)"
                clearable
              >
              </InputNumber>
              <span v-if="addForm.paymentType == 1">{{
                paymentInfo[index].amount
              }}</span>
            </div>
          </template>
          <!-- <template slot="tradeNo" slot-scope="{ row, index }">
            <Input v-model="paymentInfo[index].tradeNo" clearable />
          </template> -->
          <template slot="paymentAccount" slot-scope="{ row, index }">
            <Select
              v-model="paymentInfo[index].paymentAccount"
              placeholder="收款账户"
              label-in-value
              clearable
            >
              <Option
                v-for="(v, i) in paymentaccountList"
                :value="v.id"
                :key="i"
                >{{ v.accountName }}</Option
              >
            </Select>
          </template>
          <!-- <template slot="paymentChannel" slot-scope="{ row, index }">
            <Select
              v-model="paymentInfo[index].paymentChannel"
              placeholder="收款账户"
              label-in-value
              clearable
            >
              <Option value="1">微信</Option>
              <Option value="2">支付宝</Option>
              <Option value="3">银联</Option>
            </Select>
          </template> -->
          <template slot="payOrder" slot-scope="{ row, index }">
            <Upload
              ref="uplaodFile"
              :action="fileUpload"
              :default-file-list="paymentInfo[index].defaultFileList"
              :data="{ prefix: '' }"
              :before-upload="
                file => {
                  return beforeUpload(file, index);
                }
              "
              show-upload-list
              :on-success="
                (res, file, fileList) => {
                  successHandler(res, file, fileList, index);
                }
              "
              :on-remove="
                (file, fileList) => {
                  removeHandler(file, fileList, index);
                }
              "
              :format="['jpg', 'jpeg', 'png', 'gif']"
            >
              <div style="padding: 5px;">
                <Button type="primary" ghost>请上传</Button>
              </div>
            </Upload>
          </template>
          <template slot="paymentTime" slot-scope="{ row, index }">
            <Date-picker
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择付款时间"
              :value="paymentInfo[index].paymentTime"
              @on-change="handleChangeDate($event, index)"
            ></Date-picker>
          </template>
          <template slot="remark" slot-scope="{ row, index }">
            <Input v-model="paymentInfo[index].remark" clearable />
          </template>
        </Table>
        <div style="color: #e99d42;font-size: 12px;margin-top:5px;">
          温馨提示：财务将根据您填写的款项信息进行对账，不准确的信息会影响财务对账的效率或者审核不通过。请注意，打款时间请精确到时、分。
        </div>
      </div>
      <div v-if="addForm.paymentType == 3" class="billPayment">
        <FormItem
          prop="paymentDays"
          class="first"
          label="账期："
          :label-width="60"
        >
          <InputNumber
            :min="0"
            :active-change="false"
            :precision="0"
            v-model="addForm.paymentDays"
            @on-change="paymentsDaysChange($event)"
            style="margin-right:5px;"
            clearable
          ></InputNumber>
          <span>天</span>
        </FormItem>
        <FormItem
          prop="expectGatheringTimeRule"
          label="预计款项到账日期："
          :label-width="130"
        >
          <DatePicker
            v-model="addForm.expectGatheringTimeRule"
            @on-change="expectGatheringTimeChange($event)"
            type="date"
            format="yyyy-MM-dd"
            placeholder="请选择预计款项到账日期"
            style="width: 150px;margin-right:5px;"
          ></DatePicker>
          <span
            >(根据账期天数，以当前时间为基准，自动算出到账日期，可手动修改)</span
          >
        </FormItem>
      </div>

      <FormItem label="备注：" style="margin-top:20px;" :label-width="50">
        <Input
          v-model="addForm.remark"
          type="textarea"
          placeholder="请输入订单备注,最多500字符"
          :rows="4"
          :length="500"
        ></Input>
      </FormItem>
      <FormItem
        style="margin-top:20px;display:flex;justify-content: center;"
        :label-width="0"
      >
        <Button
          type="primary"
          :loading="submitLoading"
          style="margin-left: 20px"
          @click="submit"
          >提交</Button
        >
      </FormItem>
    </Form>
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/libs/util";
import { getTaxCountry } from "@/api/taxService/common.js";
import * as API from "@/api/orderManage/addOrder";
import * as math from "mathjs"
export default {
  data() {
    return {
      fileUpload: this.workOrderFile,
      parentCompanyList: [],
      paymentTypeList: [],
      countryList: [],
      addForm: {
        companyBody: "",
        paymentType: "",
        paymentDays: 0
      },
      invoiceDTO: {
        invoiceType:'3',
        invoiceMoney: "0.0"
      },
      ruleInline: {
        companyBody: [
          {
            required: true,
            message: "请选择所属公司。",
            trigger: "change"
          }
        ],
        paymentType: [
          {
            required: true,
            message: "请选择付款类型。",
            trigger: "change"
          }
        ],
        userMobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "change"
          }
        ],
        contractCompanyName: [
          {
            required: true,
            message: "请填写公司名称。",
            trigger: "blur"
          }
        ],
        // 发票相关
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
        ],
        paymentDays: [
          {
            required: true,
            message: "请填写账期。",
            trigger: "change",
            type: "number"
          }
        ],
        expectGatheringTimeRule: [
          {
            required: true,
            message: "请选择预计款项到账日期",
            trigger: "change",
            type: "date"
          }
        ],
        // 款项信息相关
        // tradeNo: [
        //   {
        //     required: true,
        //     message: "请填写付款流水号",
        //     trigger: "blur"
        //   }
        // ],
        paymentChannel: [
          {
            required: true,
            message: "请选择付款方式",
            trigger: "change"
          }
        ],
        paymentAccount: [
          {
            required: true,
            message: "请选择收款方",
            trigger: "change"
          }
        ],
        paymentTime: [
          {
            required: true,
            message: "请选择付款时间",
            trigger: "change",
            type: "date"
          }
        ],
        remark: [
          {
            required: true,
            message: "请填写备注",
            trigger: "blur"
          }
        ]
      },
      productColumns: [
        {
          title: "*商品信息",
          slot: "productInfo",
          align: "center",
          minWidth: 350
        },
        {
          title: "原价（￥）",
          key: "costPrice",
          align: "center"
        },
        // {
        //   title: "建议售价（￥）",
        //   key: "price",
        //   align: "center",
        //   className: "grayFont"
        // },
        {
          title: "*数量",
          slot: "quantity",
          align: "center"
        },
        {
          title: "小计",
          key: "amountMoney",
          align: "center"
        },
        {
          title: "操作",
          slot: "operation",
          align: "center"
        }
      ],
      productInfo: [
        {
          costPrice: "",
          quantity: 0,
          amountMoney: ""
        }
      ],
      costColumns: [
        {
          title: "服务总金额",
          key: "totalAmount",
          align: "center"
        },
        {
          title: "优惠金额（￥）",
          slot: "discountedPrice",
          align: "center"
        },
        {
          title: "应付总金额(￥)",
          key: "payableTotalAmount",
          align: "center"
        },
        {
          title: "发票金额（￥）",
          slot: "invoiceAmount",
          align: "center"
        },
        {
          title: "实付金额(￥)",
          key: "amountMoney",
          align: "center",
          className: "redFont"
        }
      ],
      costDTO: [
        {
          totalAmount: 0,
          invoiceAmount: 0,
          payableTotalAmount: 0,
          discountedPrice: 0,
          actualAmount: 0,
          amountMoney: 0
        }
      ],
      isFirstHint: true, //选择开票的第一次的时候给予提示
      paymentColumns: [
        {
          title: "付款方式",
          slot: "paymentType",
          align: "center"
        },
        {
          title: "*付款方",
          slot: "payer",
          align: "center"
        },
        {
          title: "订单金额",
          slot: "amount",
          align: "center"
        },
        {
          title: "开票金额",
          key: "invoiceMoney",
          align: "center"
        },
        // {
        //   title: "订单总金额",
        //   key: "orderTotalAmount",
        //   align: "center"
        // },
        // {
        //   title: "*付款流水号",
        //   slot: "tradeNo",
        //   align: "center"
        // },
        {
          title: "*付款方式",
          slot: "paymentChannel",
          align: "center"
        },
        {
          title: "*收款方",
          slot: "paymentAccount",
          align: "center"
        },
        {
          title: "*附件",
          slot: "payOrder",
          align: "center"
        },
        {
          title: "*付款时间",
          slot: "paymentTime",
          align: "center",
          minWidth: 40
        },
        {
          title: "*备注说明",
          slot: "remark",
          align: "center"
        }
        // {
        //   title: "是否开票",
        //   key: "markInvoice",
        //   align: "center"
        // }
      ],
      paymentInfo: [
        {
          paymentType: "",
          payer: "",
          amount: 0,
          invoiceMoney: "",
          payOrder: "",
          // tradeNo: "",
          paymentAccount: "",
          paymentChannel:'',
          paymentTime: "",
          remark: "",
          defaultFileList: []
        }
      ],
      submitLoading: false,
      paymentaccountList: [],
      unit: 100000000,
      generalTax:0,
      specialTax:0,
    };
  },
  computed:{
    taxPoint(){
      // 普通发票税点
      if(this.invoiceDTO.invoiceType && this.invoiceDTO.invoiceType == 1){
        return this.generalTax;
      };
      // 专用发票税点
      if(this.invoiceDTO.invoiceType && this.invoiceDTO.invoiceType == 2){
        return this.specialTax;
      }
      return 0;
    },
  },
  watch: {
    "addForm.paymentType"() {
      let arr = [
        {
          title: "付款方式",
          slot: "paymentType",
          align: "center"
        },
        {
          title: "*付款方",
          slot: "payer",
          align: "center"
        },
        {
          title:
            this.addForm.paymentType == 1
              ? "订单金额"
              : this.addForm.paymentType == 2
              ? "订单分期金额"
              : "",
          slot: "amount",
          align: "center"
        },
        {
          title: "开票金额",
          key: "invoiceMoney",
          align: "center"
        },
        // {
        //   title:
        //     this.addForm.paymentType == 1
        //       ? "订单总金额"
        //       : this.addForm.paymentType == 2
        //       ? "分期总金额"
        //       : "",
        //   key: "orderTotalAmount",
        //   align: "center"
        // },
        // {
        //   title: "*付款流水号",
        //   slot: "tradeNo",
        //   align: "center"
        // },
        {
          title: "*付款方式",
          slot: "paymentChannel",
          align: "center"
        },
        {
          title: "*收款方",
          slot: "paymentAccount",
          align: "center"
        },
        {
          title: "*附件",
          slot: "payOrder",
          align: "center"
        },
        {
          title: "*付款时间",
          slot: "paymentTime",
          align: "center",
          minWidth: 40
        },
        {
          title: "备注说明",
          slot: "remark",
          align: "center"
        }
        // {
        //   title: "是否开票",
        //   key: "markInvoice",
        //   align: "center"
        // }
      ];
      this.$set(this, "paymentColumns", arr);
    }
  },
  methods: {
    //获取所属公司下拉
    getCompanyList() {
      API.getCompanybody().then(res => {
        if (res.code == 0) {
          this.parentCompanyList = res.data;
        }
      });
    },
    //获取付款类型下拉
    getPaymenttypeList() {
      API.getPaymenttype().then(res => {
        if (res.code == 0) {
          this.paymentTypeList = res.data;
        }
      });
    },
    //获取订单款项收款方下拉
    getPaymentaccountList() {
      API.getPaymentaccount().then(res => {
        if (res.code == 0) {
          this.paymentaccountList = res.data;
        }
      });
    },
    //获取国家下拉
    getCountryList() {
      API.getCountry().then(res => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });
    },
    //根据国家获取商品列表
    listByCountryCodeList(countryCode, index) {
      let self = this;
      // 重置商品id，原价，售价
      self.$set(self.productInfo[index], "productId", "");
      self.$set(self.productInfo[index], "costPrice", "");
      self.$set(self.productInfo[index], "price", "");
      self.$set(self.productInfo[index], "quantity", 0);
      self.$set(self.productInfo[index], "amountMoney", "");
      if (countryCode) {
        let params = {
          countryCode
        };
        API.listByCountryCode(params).then(res => {
          if (res.code == 0) {
            self.$set(self.productInfo[index], "productList", res.data);
            // 计算服务总金额
            self.calcServiceTotalMoney();
          }
        });
      }
    },
    // 国家change
    countryCodeChange(val, index) {
      this.listByCountryCodeList(val, index);
    },
    // 服务change
    productChange(val, index) {
      let arr = JSON.parse(JSON.stringify(this.productInfo));
      if (val) {
        let obj = arr[index].productList.find(item => item.id == val);
        if (obj) {
          arr[index] = {
            ...this.productInfo[index],
            ...obj,
            costPrice: obj.costPrice,
            price: obj.price,
            quantity: 1,
            amountMoney: obj.costPrice
          };
          this.$set(this, "productInfo", arr);
          // 计算服务总金额
          this.calcServiceTotalMoney();
        }
      } else {
        arr[index].quantity = 1;
        arr[index].amountMoney = "";
        arr[index].costPrice = "";
        arr[index].price = "";
        this.$set(this, "productInfo", arr);
      }
    },
    // 所属公司change
    companyBodyChange(val){
      if(val){
        let params = {
          companyBody:val
        };
        API.getCompanyBodyTax(params).then(res=>{
          if (res.code == 0) {
            this.generalTax = res.data.generalTax;
            this.specialTax = res.data.specialTax;
          }
        })
      }else{
        this.generalTax = 0;
        this.specialTax = 0;
      }
    },
    // 付款类型变化
    paymentTypeChange(val) {
      //付款类型为正常付款时，重新计算订单金额，开票金额
      if (val == 1) {
        let arr = [
          {
            paymentType: val,
            payer: "",
            amount: 0,
            invoiceMoney: 0,
            payOrder: "",
            // tradeNo: "",
            paymentAccount: "",
            paymentChannel:'',
            paymentTime: "",
            remark: "",
            defaultFileList: []
          }
        ];
        this.$set(this, "paymentInfo", arr);
        this.removeHandler("", "", 0);
        this.costDTO[0].invoiceAmount = 0;
        this.calcOrderAmount();
      }
      // 付款类型为分期时，清空订单金额，开票金额
      if (val == 2) {
        let arr = [
          {
            paymentType: val,
            payer: "",
            amount: 0,
            invoiceMoney: 0,
            payOrder: "",
            // tradeNo: "",
            paymentAccount: "",
            paymentChannel:'',
            paymentTime: "",
            remark: "",
            defaultFileList: []
          }
        ];
        this.$set(this, "paymentInfo", arr);
        this.removeHandler("", "", 0);
        this.costDTO[0].invoiceAmount = 0;
        this.$set(this.invoiceDTO, "invoiceMoney", 0);
        this.calcOrderAmount();
      }
      // 付款类型为挂账时，不可开发票
      if (val == 3) {
        this.invoiceDTO.invoiceType = "3";
        this.$set(this, "paymentInfo", []);
        this.costDTO[0].invoiceAmount = 0;
        this.calcOrderAmount();
      }
    },
    // 新增商品信息
    addProductInfo() {
      this.productInfo.push({
        costPrice: "",
        quantity: 0,
        amountMoney: ""
      });
    },
    // 删除商品信息
    deleteProductInfo(index) {
      if (this.productInfo.length == 1) {
        this.$Message.warning("最少保留一条商品信息！");
        return;
      }
      this.productInfo.splice(index, 1);
      // 计算服务总金额
      this.calcServiceTotalMoney();
    },
    // 商品数量change
    quantityChange(val, index) {
      if (val && this.productInfo[index].costPrice) {
        this.productInfo[index].amountMoney = this.getToFixedTwo(
          this.productInfo[index].costPrice * this.productInfo[index].quantity
        );
        // 计算服务总金额
        this.calcServiceTotalMoney();
      }
    },
    // 计算服务总金额
    calcServiceTotalMoney() {
      // 过滤出商品信息中小计大于0的数据
      let allProductInfo = this.productInfo
        .filter(item => !!item.amountMoney && item.amountMoney > 0)
        .map(item => item.amountMoney);
      if (allProductInfo.length > 0) {
        this.costDTO[0].totalAmount = this.getToFixedTwo(
          allProductInfo.reduce((acc, cur) => (acc += cur), 0)
        );
        // 计算款项信息中订单金额
        this.calcOrderAmount();
        // 计算应付总金额
        this.calcPayableTotalMoney();
      }
    },
    //优惠价格change
    couponMoneyChange(val, index) {
      // 计算款项信息中订单金额
      this.calcOrderAmount();
      // 计算应付总金额
      this.calcPayableTotalMoney();
    },
    // 计算款项信息订单金额（订单金额 = 服务总金额- 优惠金额）
    calcOrderAmount() {
      this.addForm.amount = this.getToFixedTwo(
        (this.costDTO[0].totalAmount * this.unit -
          this.costDTO[0].discountedPrice * this.unit) /
          this.unit
      );
      if (this.addForm.paymentType == 1) {
        this.paymentInfo[0].amount = this.getToFixedTwo(
          (this.costDTO[0].totalAmount * this.unit -
            this.costDTO[0].discountedPrice * this.unit) /
            this.unit
        );
        this.calcInvoiceMoney();
      }
      if (this.addForm.paymentType == 2) {
        this.paymentInfo[0].amount = 0;
        this.calcInvoiceMoney();
      }
    },
    // 计算款项信息里的开票金额
    calcInvoiceMoney() {
      if (this.invoiceDTO.invoiceType && this.invoiceDTO.invoiceType != 3) {
        this.$set(
          this.paymentInfo[0],
          "invoiceMoney",
          this.getToFixedTwo(this.paymentInfo[0].amount * this.taxPoint)
        );
        // console.log(this.paymentInfo)
        this.$set(
          this.invoiceDTO,
          "invoiceMoney",
          this.getToFixedTwo(this.paymentInfo[0].amount * this.taxPoint)
        );
      } else {
        this.$set(this.paymentInfo[0], "invoiceMoney", 0);
        this.$set(this.invoiceDTO, "invoiceMoney", 0);
      }
      this.calcInvoiceAmount();
    },
    // 计算费用信息里的开票金额
    calcInvoiceAmount() {
      //直接取款项信息里的开票金额
      this.$set(
        this.costDTO[0],
        "invoiceAmount",
        this.paymentInfo[0].invoiceMoney
      );
      // 计算应付总金额
      this.calcPayableTotalMoney();
      // 计算实付金额
      this.calcActualAmount();
    },
    // 计算应付总金额(应付总金额 = 服务总金额 - 优惠金额 + 发票金额)
    calcPayableTotalMoney() {
      this.costDTO[0].payableTotalAmount = this.getToFixedTwo(
        (this.costDTO[0].totalAmount * this.unit -
          this.costDTO[0].discountedPrice * this.unit +
          this.costDTO[0].invoiceAmount * this.unit) /
          this.unit
      );
    },
    // 计算实付金额(实付金额 = 订单金额or订单分期金额 + 开票金额)
    calcActualAmount() {
      this.costDTO[0].actualAmount = this.getToFixedTwo(
        (this.paymentInfo[0].amount * this.unit +
          this.paymentInfo[0].invoiceMoney * this.unit) /
          this.unit
      );
      this.costDTO[0].amountMoney = 0;
    },
    // 款项信息中分期金额change
    orderAmountChange(val) {
      this.calcInvoiceMoney();
    },
    // 金额保留2位小数
    formatDecimal(num, decimal) {
      num = num.toString();
      let index = num.indexOf(".");
      if (index !== -1) {
        num = num.substring(0, decimal + index + 2);
      } else {
        num = num.substring(0);
      }
      
      return Number(Math.round(this.printFn(Number(num)*100))/100);
    },
    printFn(value){
        const precision = 14
        return Number(math.format(value,precision))
    },
    // 保留2位小数
    getToFixedTwo(val) {
      if (typeof val == "number") {
        return this.formatDecimal(val,2);
      } else {
        return val;
      }
    },
    // 搜索手机号
    searchPhone() {
      let self = this;
      // 未查询到东西
      this.$Modal.info({
        title: "查询反馈",
        content: `<p>系统未查询到【${self.addForm.userMobile}】对应的客户信息，</p><p>请您核实手机号码是否有误。</p><p>若输入无误，请让客户用该手机号先在客户端注册，</p><p>然后在进行录单。<a href="/register">点击去注册</a> </p>`
      });
    },
    // 开票change
    invoiceTypeChange(val) {
      let self = this;
      if (val != 3) {
        if (this.isFirstHint) {
          this.$Modal.confirm({
            title: "温馨提示",
            content: `<p>根据税务规定，开具发票只能主体一致，如果是个</p><p>人开票就用个人银行卡付款，公司开票就用公司对</p><p>公账户付款，暂只支持网银对公支付</p>`,
            onOk: () => {
              self.isFirstHint = false;
              // 增值税普通发票，默认选中个人，增值税专用发票默认选中公司
              self.$set(this.invoiceDTO, "subjectType", val);
              // 重新计算发票金额
              self.calcInvoiceMoney();
            },
            onCancel: () => {
              self.$set(this.invoiceDTO, "invoiceType", "3");
            }
          });
        } else {
          // 增值税普通发票，默认选中个人，增值税专用发票默认选中公司
          self.$set(this.invoiceDTO, "subjectType", val);
          // 重新计算发票金额
          self.calcInvoiceMoney();
        }
      } else {
        this.calcInvoiceMoney();
      }
    },
    // 开票主体change
    subjectTypeChange(val) {
      this.$set(this.invoiceDTO, "subjectType", val);
      // 如果选择个人，清空公司信息
      if (val == 1) {
        this.$set(this.invoiceDTO, "companyName", "");
        this.$set(this.invoiceDTO, "taxIdentificationNumber", "");
      }
      // 如果选择公司，清空个人信息
      if (val == 2) {
        this.$set(this.invoiceDTO, "name", "");
        this.$set(this.invoiceDTO, "idNumber", "");
      }
    },
    // 账期change
    paymentsDaysChange(val) {
      if (val) {
        let date = new Date(
          Math.floor(new Date().getTime() + val * 24 * 60 * 60 * 1000)
        );
        let y = date.getFullYear();
        let m =
          date.getMonth() + 1 > 9
            ? date.getMonth() + 1
            : "0" + (date.getMonth() + 1);
        let d = date.getDate();
        this.addForm.expectGatheringTimeRule = `${y}-${m}-${d}`;
        this.addForm.expectGatheringTime = `${y}-${m}-${d} 00:00:00`;
      } else {
        this.addForm.expectGatheringTimeRule = "";
        this.addForm.expectGatheringTime = "";
      }
    },
    // 挂账日期change
    expectGatheringTimeChange(val) {
      this.addForm.expectGatheringTime = val + "00:00:00";
    },
    //上传前确认
    beforeUpload(file, index) {
      this.fileObj = file;
      let self = this;
      const check = self.paymentInfo[index].paymentFile;
      if (check) {
        self.removeHandler("", "", 0);
      }
      return true;
    },
    // 上传成功
    successHandler(res, file, fileList, index) {
      let self = this;
      this.paymentInfo[index].paymentFile = res.data.fileUrl;
      this.paymentInfo[index].attachmentsName = file.name;
      // OCR识别支付宝或者微信图片付款时间
      let type = "";
      if (this.paymentInfo[index].paymentAccount == 1) {
        //支付宝
        type = "2";
      } else if (this.paymentInfo[index].paymentAccount == 2) {
        //微信
        type = "1";
      } else {
        return false;
      }
      let formData = new FormData();
      formData.append("file", this.fileObj);
      formData.append("type", type);
      const instance = axios.create({
        withCredentials: true, // 如果发送请求的时候需要带上token 验证之类的也可以写在这个对象里
        // ,'Content-Type': 'application/json;charset=UTF-8'
        headers: { Authorization: "Bearer " + getToken() } // 设置header信息
      });
      instance
        .post(this.baseUrl + "/etax/baiduOpenApi/autoImage", formData)
        .then(res => {
          if (res.status == 200) {
            if (!!res.data.data.tradeTime) {
              self.handleChangeDate(res.data.data.tradeTime, index);
            } else {
              self.handleChangeDate("", index);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 移除文件
    removeHandler(file, fileList, index) {
      this.paymentInfo[index].paymentFile = "";
      this.paymentInfo[index].attachmentsName = "";
      // this.paymentInfo[index].defaultFileList = [];
      if (this.$refs["uplaodFile"]) {
        this.$refs["uplaodFile"].clearFiles();
      }
    },
    // 付款时间
    handleChangeDate(val, index) {
      this.paymentInfo[index].paymentTime = val;
    },
    // 发票校验
    invoiceValidate() {
      // 增值税普通发票
      if (this.invoiceDTO.invoiceType == 1) {
        // 个人
        if (this.invoiceDTO.subjectType == 1) {
          if (!this.invoiceDTO.name) {
            this.$Message.warning("请填写发票个人名字!");
            return false;
          }
          if (!this.invoiceDTO.idNumber) {
            this.$Message.warning("请填写身份证号码!");
            return false;
          }
        }
        // 公司
        if (this.invoiceDTO.subjectType == 2) {
          if (!this.invoiceDTO.companyName) {
            this.$Message.warning("请填写公司名称!");
            return false;
          }
          if (!this.invoiceDTO.taxIdentificationNumber) {
            this.$Message.warning("请填写纳税识别号!");
            return false;
          }
        }
      }
      // 增值税专用发票
      if (this.invoiceDTO.invoiceType == 2) {
        if (!this.invoiceDTO.companyName) {
          this.$Message.warning("请填写公司名称!");
          return false;
        }
        if (!this.invoiceDTO.taxIdentificationNumber) {
          this.$Message.warning("请填写纳税识别号!");
          return false;
        }
        if (!this.invoiceDTO.companyAddress) {
          this.$Message.warning("请填写公司地址!");
          return false;
        }
        if (!this.invoiceDTO.companyTel) {
          this.$Message.warning("请填写公司电话!");
          return false;
        }
        if (!this.invoiceDTO.openingBank) {
          this.$Message.warning("请填写开户银行!");
          return false;
        }
        if (!this.invoiceDTO.bankAccount) {
          this.$Message.warning("请填写开户账号!");
          return false;
        }
      }
      return true;
    },
    // 提交
    submit() {
      let self = this;
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          // 商品信息校验
          if (
            self.productInfo.some(item => {
              return !item.countryCode || !item.quantity || !item.productId;
            })
          ) {
            self.$Message.warning("请填写完整的商品信息!");
            return false;
          }
          // 不能录入多条同样的商品
          let productIdArr = self.productInfo.map(item => item.productId);
          // 去重后的数组
          let noRepeatArr = Array.from(new Set(productIdArr));
          // 比较去重前后数组的长度是否一致，不一致则说明存在多条同样的商品
          if (productIdArr.length != noRepeatArr.length) {
            self.$Message.warning("商品信息不能存在多条同样的服务!");
            return false;
          }
          // 手机号校验
          if (!/^1[3456789]\d{9}$/.test(this.addForm.userMobile)) {
            this.$Message.warning("请输入正确的客户手机号码!");
            return false;
          }
          // 发票校验
          if (!self.invoiceDTO.invoiceType) {
            this.$Message.warning("请选择是否需要开票!");
            return false;
          }
          // 发票信息校验
          if (self.invoiceDTO.invoiceType != 3) {
            if (!self.invoiceValidate()) {
              return false;
            }
          }
          if (self.addForm.paymentType != 3) {
            // self.paymentInfo[0].paymentFile = "http://www.baidu.com";
            // self.paymentInfo[0].attachmentsName = "aaa.png";
            // 款项信息校验
            if (
              self.paymentInfo.some(item => {
                return (
                  !item.payer ||
                  // !item.tradeNo ||
                  !item.amount ||
                  !item.paymentAccount ||
                  !item.paymentChannel || 
                  !item.paymentFile ||
                  !item.paymentTime ||
                  !item.remark
                );
              })
            ) {
              self.$Message.warning("请填写完整的款项信息!");
              return false;
            }
          }
          // 提交数据
          let params = {
            orderBaseInfo: self.addForm,
            productInfo: self.productInfo,
            costDTO: self.costDTO[0],
            invoiceDTO: self.invoiceDTO,
            paymentInfo: self.paymentInfo
          };
          if (self.addForm.paymentType == 3) {
            delete params.paymentInfo;
          }
          self.submitLoading = true;
          API.addOrder(params)
            .then(res => {
              if (res.code == 0) {
                self.$Message.success("提交成功!");
                self.submitLoading = false;
                self.$router.push({
                  path: "/taxService/orderManage/orderList"
                });
              }
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              self.submitLoading = false;
            });
        }
      });
    },

    // 获取订单详情数据(数据回填)
    getOrderDetail() {
      let self = this;
      let params = {
        orderId: this.$route.query.orderId
      };
      API.orderDetail(params)
        .then(res => {
          if (res.code == 0) {
            self.addForm = res.data.orderBaseInfo;
            // 商品信息
            self.productInfo = JSON.parse(JSON.stringify(res.data.productInfo));
            let categoryId = self.productInfo[0].categoryId;
            if (categoryId) {
              // 回填商品信息数据
              let arr = this.categoryList.filter(
                item => item.code == categoryId
              );
              let serviceFlag = arr[0].serviceFlag;
              let productType = arr[0].productType;
              self.getProductList(categoryId);
              self.productInfo.forEach((item, i) => {
                item.serviceFlag = serviceFlag;
                item.productType = productType;
                item.remarkArr = [{ value: item.productRemark }];
                self.getAttrList(item.productId, i);
              });
            }
            // 商品信息统计
            this.totalData = {
              totalAmount: self.addForm.totalAmount,
              totalDiscAmount: self.addForm.totalDiscAmount,
              totalInvoiceAmount: self.addForm.totalInvoiceAmount,
              orderMoney: self.addForm.orderMoney
            };
            // 款项信息
            self.paymentInfo = res.data.paymentInfo;
            self.paymentInfo.forEach((el, i) => {
              el.paymentType = "" + el.paymentType;
              el.defaultFileList = [
                {
                  name: el.attachmentsName,
                  url: el.paymentFile
                }
              ];
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.getCompanyList();
    this.getPaymenttypeList();
    this.getPaymentaccountList();
    this.getCountryList();
  },
  mounted() {}
};
</script>

<style scoped lang="less">
.addOrder {
  background: #fff;
  padding: 15px;
}
.totalText {
  text-align: right;
}
.totalText {
  margin-top: 20px;
}
.titleBlack {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  margin-bottom: 20px;
  font-size: 20px;
  .title {
    font-size: 16px;
  }
}
.ivu-divider-horizontal {
  margin: 10px 0;
}
/deep/ .ivu-table-wrapper {
  overflow: visible;
}
.button {
  cursor: pointer;
  color: #2d8cf0;
}
.userInfo {
  border: 1px solid #e8eaec;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;
  /deep/ .ivu-form-item {
    margin-bottom: 0px !important;
  }
}
.invoiceFirst {
  margin: 0 !important;
}
.invoiceRemark {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  color: #e99d42;
  font-size: 12px;
  margin: 10px;
}
.billPayment {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .first {
    margin-right: 20px;
  }
}
.costTable {
  /deep/ .ivu-table-body {
    .redFont {
      color: red;
    }
  }
}
.addForm {
  /deep/ .grayFont {
    .ivu-table-cell {
      span {
        color: #aaa !important;
      }
    }
  }
}
</style>
