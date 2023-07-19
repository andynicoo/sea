<template>
  <!-- 德国年报 -->
  <div class="container">
    <div class="taxBox">
      <div @click="goBack" class="go-back">{{ '< 返回' }}</div>
      <div class="tax-title">提交申报（年报）</div>
      <div>
        <Row>
          <Col span="12">
            <span class="tax-info-name">公司中文名称</span>
            <span class="tax-info-value">{{ baseData.companyName }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">VAT税号</span>
            <span class="tax-info-value">{{ baseData.vatTaxNumber }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <span class="tax-info-name">公司英文名称</span>
            <span class="tax-info-value">{{ baseData.companyNameEn }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">年度申报时间/年</span>
            <span class="tax-info-value">{{ baseData.year }}年</span>
          </Col>
        </Row>
        <!-- 转代理+申报 -->
        <Row v-if="baseData.productFunctionCode == 2">
          <Col span="3">
            <span class="tax-info-name">申报区间</span>
            <!-- <span class="tax-info-value">{{baseData.time}}</span> -->
          </Col>
          <Col span="3">
            <DatePicker
              type="month"
              placeholder="开始时间"
              :options="options"
              style="width: 137px"
              :disabled="isDetails"
              v-model="kaishiTime"
              @on-change="kaishiTimeChange"
            ></DatePicker>
          </Col>
          <Col span="1">
            <span class="tax-info-value" style="position: relative; top: 6px; left: 13px">{{ '至' }}</span>
          </Col>
          <Col span="3">
            <DatePicker type="month" style="width: 137px" :value="baseData.endTime" disabled></DatePicker>
          </Col>
        </Row>
        <!-- 注册+申报 -->
        <Row v-else-if="baseData.productFunctionCode == 5">
          <Col span="12">
            <span class="tax-info-name">申报区间</span>
            <span class="tax-info-value">{{ baseData.time }}</span>
          </Col>
        </Row>
      </div>
      <div class="tax-title">过去一年的申报情况</div>
      <div class="last-year-box" v-if="!isDetails">
        <!-- <p v-if="baseData.productFunctionCode == 2">请上传
          <span class="red">{{kaishiTimeMonth + '至'+baseData.endTime}}</span>的申报数据及文件；
        </p>
        <p v-else-if="baseData.productFunctionCode == 5">请上传
          <span class="red">{{baseData.time}}月</span>的申报数据及文件；
        </p> -->
        <p class="red bold">温馨提示：</p>
        <div class="red">
          <!-- <span class="red">如有抵扣金额，请按实际情况填写（重要）</span>
          <span class="search-box"
                @click="explamModal=true"><img src="@/assets/images/common/searchImg.png"
                 alt="">查看示例</span> -->
          <p>（如果您之前线下提交过2022年的汇总年报，这里则不需要再重复提交）</p>
          <p>1.请正确填写2022年年报申报区间；</p>
          <p class="black">
            （若2022年5月才开始在我司申报，但税号生效日期是在2022年之前已经生效，2022年年报申报区间应填写2022-1-2022-12，并补充1-4月申报数据（上传申报回执和支付凭证，
          </p>
          <p class="black">
            正确填写申报金额），若税号生效日是2022年5月，2022年年报区间应从税号生效月份开始，即2022-5-2022-12）；
          </p>
          <p>2.请正确选择申报周期、申报月份/季度；</p>
          <p>
            3.不含税销售额、应缴纳金额和抵扣金额应和申报回执上的金额一致，请仔细核对，如存在差异请将金额修改成申报回执上的金额
          </p>
          <p>4.应缴金额=申报回执上83项；</p>
          <p>实缴金额=缴税凭证上的金额；</p>
          <p>
            （填写提示：实缴金额包含当期产生的滞纳金，例如：3月税金100，滞纳金1， 客户实际缴纳101，此处填写101
            按最终实际缴纳金额填写，未缴纳费用填写0）
          </p>
          <p>
            5.月报季报回执各项表示的内容（请触碰问号查看解释）,如果您的回执上面有其他项此处没有提示到的项目，请及时联系客户经理；
            <span class="tooltip" @click="showImg = true">
              <span class="tips-icon">?</span>
            </span>
          </p>
          <p>
            6.平台最终会以您填写的年报数据提交至税局申报，如因个人原因导致需要修正申报，需另购买税务服务且后果自行承担；
          </p>
          <p>7. 如申报过程中有疑问请咨询在线客服；</p>
        </div>
      </div>
      <div class="last-year-box" v-if="isDetails">
        申报回执
        <a style="color: #16ade9" target="_blank" :href="baseData.declareReceipt" v-if="baseData.declareReceipt != ''"
          >查看回执</a
        >
      </div>
      <p class="data-title">
        申报数据<span class="red" v-if="baseData.productFunctionCode == 2">（注：请先选择申报区间再填写申报数据）</span>
      </p>
      <Table :data="data" :columns="columns" border class="annalsDe-table" v-if="!isDetails">
        <template slot="declareReceptSlot" slot-scope="{ row }">
          <!-- :default-file-list="data[row._index].declareList" -->
          <!-- :on-remove="(file,fileList)=>{handleRemoveFile (file,fileList,row,'declareReceipt')}" -->
          <div @click="getTableIndex(row, 'declareReceipt')">
            <Upload
              :action="ImgUrl"
              :data="{ prefix: '' }"
              :on-success="
                (res, file, fileList) => {
                  handleSuccess(res, file, fileList, row, 'declareReceipt');
                }
              "
              :format="['pdf', 'jpg', 'png', 'jpeg', 'pdf']"
              :on-format-error="handleFormatErrors"
              :show-upload-list="false"
              :before-upload="
                (e) => {
                  return beforeUploadHandler(e, row, 'declareReceipt');
                }
              "
              class="upload-box"
            >
              <Button icon="ios-cloud-upload-outline" class="amzUpload btnfile" style="margin-top: 10px" size="small"
                >点击上传</Button
              >
            </Upload>
            <div v-if="data[row._index].declareReceipt">
              <a
                :href="
                  data[row._index].declareReceipt.slice(0, 5) == 'http:'
                    ? data[row._index].declareReceipt.slice(0, 4) + 's' + data[row._index].declareReceipt.slice(4)
                    : data[row._index].declareReceipt
                "
                target="_blank"
                style="font-size: 12px"
                >{{ '申报回执' }}</a
              >
              <Button class="deletBtn" type="text" ghost @click="handleRemoveFile(1, 1, row, 'declareReceipt')">
                <img class="closeImg" src="@/assets/images/common/activeCloseImg.png" alt="" />
              </Button>
            </div>
          </div>
        </template>
        <template slot="payReceptSlot" slot-scope="{ row }">
          <div @click="getTableIndex(row, 'payReceipt')">
            <!-- :default-file-list="data[row._index].payList" -->
            <!-- :on-remove="(file,fileList)=>{handleRemoveFile (file,fileList,row,'payReceipt')}" -->
            <Upload
              :action="ImgUrl"
              :data="{ prefix: '' }"
              :on-success="
                (res, file, fileList) => {
                  handleSuccess(res, file, fileList, row, 'payReceipt');
                }
              "
              :format="['pdf', 'jpg', 'png', 'jpeg', 'pdf']"
              :on-format-error="handleFormatErrors"
              :show-upload-list="false"
              :before-upload="
                (e) => {
                  return beforeUploadHandler(e, row, 'payReceipt');
                }
              "
              class="upload-box"
            >
              <Button icon="ios-cloud-upload-outline" class="amzUpload btnfile" style="margin-top: 10px" size="small"
                >点击上传</Button
              >
            </Upload>
            <div v-if="data[row._index].payReceipt">
              <a
                :href="
                  data[row._index].payReceipt.slice(0, 5) == 'http:'
                    ? data[row._index].payReceipt.slice(0, 4) + 's' + data[row._index].payReceipt.slice(4)
                    : data[row._index].payReceipt
                "
                target="_blank"
                style="font-size: 12px"
                >{{ '缴费凭证' }}</a
              >
              <Button class="deletBtn" type="text" ghost @click="handleRemoveFile(1, 1, row, 'payReceipt')">
                <img class="closeImg" src="@/assets/images/common/activeCloseImg.png" alt="" />
              </Button>
            </div>
          </div>
        </template>
        <template slot="fillDiscount" slot-scope="{ row }">
          <div
            @click="
              discountBox = true;
              dataIndex = row._index;
            "
            style="cursor: pointer"
          >
            填写
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Tooltip placement="top" content="添加信息栏">
            <img
              src="@/assets/images/compliance/add.svg"
              style="margin-right: 5px; cursor: pointer"
              @click="addProduct(index)"
            />
          </Tooltip>
          <Tooltip placement="top" content="删除信息栏" transfer>
            <img
              src="@/assets/images/compliance/cut.svg"
              @click="remove(index)"
              style="cursor: pointer"
              v-if="data.length > 1"
            />
          </Tooltip>
        </template>
      </Table>
      <Table v-if="isDetails" :data="data" :columns="detailColumns" border>
        <template slot="fillDiscount" slot-scope="{ row }">
          <div
            @click="
              discountBox = true;
              dataIndex = row._index;
            "
            style="cursor: pointer"
            class="link-box"
          >
            查看
          </div>
        </template>
        <template slot="declareReceptSlot" slot-scope="{ row }">
          <div class="link-box">
            <a v-if="row.declareReceipt != ''" :href="row.declareReceipt" target="_blank">查看</a>
            <span v-else>暂未上传</span>
          </div>
        </template>
        <template slot="payReceptSlot" slot-scope="{ row }">
          <div class="link-box">
            <a v-if="row.payReceipt != ''" :href="row.payReceipt" target="_blank">查看</a>
            <span v-else>暂未上传</span>
          </div>
        </template>
      </Table>
      <div class="collect-box clearfix">
        <span class="left">年度申报汇总</span>
        <div class="right">
          <Row>
            <Col span="8">不含税销售额累计：€ {{ returnTaxData.excludeTaxPrice }}</Col>
            <Col span="8">进项税金累计：€ {{ returnTaxData.deductionPrice }}</Col>
            <Col span="8">欧盟内免税收购项(递延清关)累计：€ {{ returnTaxData.otherEcAcqPrice }}</Col>
          </Row>
          <Row>
            <Col span="8">平台代扣代缴金额累计：€ {{ returnTaxData.agentAmt }}</Col>
            <Col span="8">应缴金额累计：€ {{ returnTaxData.allTaxPrice }}</Col>
            <Col span="8">实缴金额累计：€ {{ returnTaxData.paidTaxPrice }}</Col>
          </Row>
        </div>
      </div>
      <div class="button-box" v-if="!isDetails">
        <Button
          type="primary"
          @click="
            wenxinTip = true;
            subType = 1;
          "
          >提交申报</Button
        >
        <Button
          class="save-btn"
          @click="
            wenxinTip = true;
            subType = 2;
          "
          >保存</Button
        >
      </div>
    </div>
    <Modal v-model="discountBox" title="抵扣金额" :mask-closable="false">
      <Form :model="data[dataIndex]" :label-width="127">
        <FormItem label="发票抵扣">
          <Input
            v-model="data[dataIndex].invoiceDeductiontPrice"
            placeholder="请输入发票抵扣金额"
            style="width: 200px; margin-right: 10px"
          ></Input
          >EUR（欧元）
        </FormItem>
        <FormItem label="C88抵扣">
          <Input
            v-model="data[dataIndex].c88DeductiontPrice"
            placeholder="请输入C88抵扣"
            style="width: 200px; margin-right: 10px"
          ></Input
          >EUR（欧元）
        </FormItem>
        <FormItem label="B2B发票抵扣">
          <Input
            v-model="data[dataIndex].b2bDeductionPrice"
            placeholder="请输入B2B发票"
            style="width: 200px; margin-right: 10px"
          ></Input
          >EUR（欧元）
        </FormItem>
        <FormItem label="其他抵扣">
          <Input
            v-model="data[dataIndex].euDeductiontPrice"
            placeholder="请输入其他抵扣"
            style="width: 200px; margin-right: 10px"
          ></Input
          >EUR（欧元）
        </FormItem>
        <FormItem label="共享库存_采购">
          <Input
            v-model="data[dataIndex].comminglingBuySale"
            placeholder="请输入共享库存_采购"
            style="width: 200px; margin-right: 10px"
          ></Input
          >EUR（欧元）
        </FormItem>
      </Form>
      <div slot="footer" class="discount-footer">
        <Button type="primary" @click="discountFun">确认</Button>
      </div>
    </Modal>
    <Modal v-model="submitModal" title="请确认您的申报数据" :width="616" class="submit-box">
      <div class="taxNumber-box" v-if="JSON.stringify(taxNumInfo) != '{}'">
        <Row>
          <Col span="12">
            <span class="tax-info-name">公司中文名称</span>
            <span class="tax-info-value">{{ baseData.companyName }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">VAT税号</span>
            <span class="tax-info-value">{{ baseData.vatTaxNumber }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <span class="tax-info-name">公司英文名称</span>
            <span class="tax-info-value">{{ baseData.companyNameEn }}</span>
          </Col>
          <Col span="12" v-if="baseData.productFunctionCode == 2">
            <span class="tax-info-name">申报区间</span>
            <span class="tax-info-value">{{ kaishiTimeMonth + '至' + baseData.endTime }}</span>
          </Col>
          <Col span="12" v-else-if="baseData.productFunctionCode == 5">
            <span class="tax-info-name">申报区间</span>
            <span class="tax-info-value">{{ baseData.time }}</span>
          </Col>
        </Row>
      </div>
      <Divider />
      <div class="submit-tip-box">
        <div class="reportData-box">
          <p class="title">申报数据</p>
          <div class="sureData-box">
            <div class="row">
              <span>不含税销售额</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{ returnTaxData.excludeTaxPrice }} </span>
            </div>
            <div class="row">
              <span>进项税金累计</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{ returnTaxData.deductionPrice }} </span>
            </div>
            <div class="row">
              <span>欧盟内免税收购项(递延清关)累计</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{ returnTaxData.otherEcAcqPrice }} </span>
            </div>
            <div class="row">
              <span>最终应缴税金</span>
              <span>{{ currencySign }} &nbsp;&nbsp;&nbsp;&nbsp;{{ returnTaxData.allTaxPrice }} </span>
            </div>
          </div>
        </div>
      </div>
      <Divider class="submitModal-footer-line" />
      <div slot="footer">
        <Button class="footerBtClose" @click="submitModal = false">取消</Button>
        <Button class="footerBt" type="primary" @click="comfireSubmit">确认</Button>
      </div>
    </Modal>
    <Modal v-model="explamModal" width="690" class="example-modal">
      <img src="https://fdfs.itaxs.com/group1/M00/02/87/rBLKNV9KLwiAZu-WAAWuEumYXfU420.png" alt="" />
      <div slot="footer" class="explamModal-footer">
        <Button @click="explamModal = false" type="primary">确认</Button>
      </div>
    </Modal>
    <Modal v-model="wenxinTip" width="650" class="example-modal">
      <p class="red bold">温馨提示：</p>
      <div class="red">
        <p>（如果您之前线下提交过2022年的汇总年报，这里则不需要再重复提交）</p>
        <p>1.请正确填写2022年年报申报区间；</p>
        <p class="black">
          （若2022年5月才开始在我司申报，但税号生效日期是在2022年之前已经生效，2022年年报申报区间应填写2022-1-2022-12，并补充1-4月申报数据（上传申报回执和支付凭证，
        </p>
        <p class="black">
          正确填写申报金额），若税号生效日是2022年5月，2022年年报区间应从税号生效月份开始，即2022-5-2022-12）；
        </p>
        <p>2.请正确选择申报周期、申报月份/季度；</p>
        <p>
          3.不含税销售额、应缴纳金额和抵扣金额应和申报回执上的金额一致，请仔细核对，如存在差异请将金额修改成申报回执上的金额
        </p>
        <p>4.应缴金额=申报回执上83项；</p>
        <p>实缴金额=缴税凭证上的金额；</p>
        <p>
          （填写提示：实缴金额包含当期产生的滞纳金，例如：3月税金100，滞纳金1， 客户实际缴纳101，此处填写101
          按最终实际缴纳金额填写，未缴纳费用填写0）
        </p>
        <p>
          5.月报季报回执各项表示的内容（请触碰问号查看解释）,如果您的回执上面有其他项此处没有提示到的项目，请及时联系客户经理；
          <span class="tooltip" @click="showImg = true">
            <span class="tips-icon">?</span>
          </span>
        </p>
        <p>
          6.平台最终会以您填写的年报数据提交至税局申报，如因个人原因导致需要修正申报，需另购买税务服务且后果自行承担；
        </p>
        <p>7. 如申报过程中有疑问请咨询在线客服；</p>
      </div>
      <div slot="footer" class="explamModal-footer">
        <Button @click="saveData" v-if="subType == 2" type="primary">确认</Button>
        <Button @click="submitModalFun" v-if="subType == 1" type="primary">确认</Button>
      </div>
    </Modal>
    <Modal v-model="showImg" width="1200">
      <img
        style="width: 1140px"
        src="https://file.itaxs.com/pro/20230203/5b2b892fdf4b4ee4a068b2e61c56026e.png"
        alt=""
      />
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/annalsDE/index';
import * as math from 'mathjs';
import moment from 'moment';
export default {
  props: {
    workId: {
      type: String,
      default: '',
    },
    serviceId: {
      type: String,
      default: '',
    },
    baseData: {
      type: Object,
    },
    isDetails: {
      type: Boolean,
    },
    detailsReturnData: {
      type: Object,
    },
  },
  data() {
    return {
      explamModal: false,
      contentStyleObj: {
        height: '',
      },
      options: {
        disabledDate: (date) => {
          const { endTime } = this.baseData;
          const endDate = new Date(endTime);
          const startDate = new Date(moment(endDate).subtract(12, 'months').format('YYYY-MM'));
          return date > endDate || date < startDate;
        },
      },
      countryCode: 'DE',
      kaishiTimeMonth: '',
      kaishiTime: '',
      wenxinTip: false,
      subType: 0,
      data: [
        {
          declarePeriod: '',
          beginTime: '',
          endTime: '',
          declareReceipt: '',
          payReceipt: '',
          excludeTaxPrice: 0,
          allTaxPrice: 0,
          paidTaxPrice: 0,
          invoiceDeductiontPrice: 0,
          c88DeductiontPrice: 0,
          b2bDeductionPrice: 0,
          euDeductiontPrice: 0,
          comminglingBuySale: 0,
          declareList: [],
          payList: [],
          taxRate: 19,
          otherEcAcqPrice: 0,
          agentAmt: 0,
          b2bExcludeTaxPrice: 0,
          otherCountryNoTaxPrice: 0,
        },
      ],
      columns: [
        {
          align: 'center',
          type: 'index',
          title: '序号',
          fixed: 'left',
          width: 50,
        },
        {
          title: '申报周期',
          align: 'center',
          // fixed: 'left',
          width: 125,
          render: (h, params) => {
            return h(
              'i-select',
              {
                props: {
                  value: params.row.declarePeriod,
                  disabled: this.baseData.productFunctionCode == 2 && this.kaishiTime == '' ? true : false,
                },
                on: {
                  'on-change': (val) => {
                    let sectionStartTime = 1;
                    if (this.baseData.productFunctionCode == 2 && this.kaishiTime != '') {
                      sectionStartTime = this.kaishiTime.getMonth() + 1;
                    } else if (this.baseData.productFunctionCode == 5) {
                      let section = this.baseData.time;
                      sectionStartTime = section.split('-')[1].slice(0, 2) - 0;
                    }
                    this.data[params.row._index].declarePeriod = val;
                    let taxYear = this.baseData.year;
                    if (val == 0) {
                      if (params.row._index == 0) {
                        this.data[params.row._index].endTime = taxYear + '-' + sectionStartTime + '-01';
                        this.data[params.row._index].beginTime = taxYear + '-' + sectionStartTime + '-01';
                      }
                      if (params.row._index != 0 && params.row._index <= 11) {
                        let lastMonth = this.data[params.row._index - 1].endTime.split('-')[1] - 0;
                        this.data[params.row._index].endTime = taxYear + '-' + (lastMonth + 1) + '-01';
                        this.data[params.row._index].beginTime = taxYear + '-' + (lastMonth + 1) + '-01';
                      }
                    } else if (val == 1) {
                      if (params.row._index == 0) {
                        this.data[params.row._index].endTime = taxYear + '-' + (sectionStartTime + 2) + '-01';
                        this.data[params.row._index].beginTime = taxYear + '-' + sectionStartTime + '-01';
                      }
                      if (params.row._index != 0 && params.row._index < 11) {
                        let lastMonth = this.data[params.row._index - 1].endTime.split('-')[1] - 0;
                        this.data[params.row._index].endTime = taxYear + '-' + (lastMonth + 3) + '-01';
                        this.data[params.row._index].beginTime = taxYear + '-' + (lastMonth + 1) + '-01';
                      }
                    }
                    if (this.data[params.row._index].endTime != '') {
                      let date1 = new Date(this.data[params.row._index].endTime);
                      let date2 = new Date('2020-06-30');
                      if (date1.getTime() <= date2.getTime() || this.contrastDate(date1)) {
                        this.data[params.row._index].taxRate = 19;
                      } else {
                        this.data[params.row._index].taxRate = 16;
                      }
                    }
                  },
                },
              },
              [
                h(
                  'i-option',
                  {
                    props: {
                      value: 0,
                    },
                  },
                  '月度申报'
                ),
                h(
                  'i-option',
                  {
                    props: {
                      value: 1,
                    },
                  },
                  '季度申报'
                ),
              ]
            );
          },
        },
        {
          title: '申报月份/季度',
          align: 'center',
          // fixed: 'left',
          width: 190,
          render: (h, params) => {
            return h('div', [
              h('DatePicker', {
                props: {
                  value: params.row.beginTime,
                  type: 'month',
                  disabled: this.baseData.productFunctionCode == 2 && this.kaishiTime == '' ? true : false,
                  options: this.options,
                },
                on: {
                  'on-change': (val) => {
                    if (val != '') {
                      this.data[params.row._index].beginTime = val + '-01';
                      let taxYear = this.baseData.year;
                      let lastMonth = this.data[params.row._index].beginTime.split('-')[1] - 0;
                      if (this.data[params.row._index].declarePeriod == 0) {
                        if (params.row._index == 0) {
                          this.data[params.row._index].endTime = taxYear + '-' + lastMonth + '-01';
                        }
                        if (params.row._index != 0 && params.row._index <= 11) {
                          this.data[params.row._index].endTime = taxYear + '-' + lastMonth + '-01';
                        }
                      } else if (this.data[params.row._index].declarePeriod == 1) {
                        if (params.row._index < 11) {
                          this.data[params.row._index].endTime = taxYear + '-' + (lastMonth + 2) + '-01';
                        }
                      }
                      let date1 = new Date(this.data[params.row._index].endTime);
                      let date2 = new Date('2020-06-30');
                      if (date1.getTime() <= date2.getTime() || this.contrastDate(date1)) {
                        this.data[params.row._index].taxRate = 19;
                      } else {
                        this.data[params.row._index].taxRate = 16;
                      }
                    }
                  },
                },
              }),
              h('DatePicker', {
                props: {
                  value: params.row.endTime,
                  type: 'month',
                  disabled: true,
                },
              }),
            ]);
          },
        },
        {
          title: '不含税销售额（€）',
          align: 'center',
          width: 110,
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.excludeTaxPrice,
                  placeholder: '请输入整数',
                  type: 'number',
                },
                on: {
                  input: (val) => {
                    this.data[params.row._index].excludeTaxPrice = val;
                    this.returnTaxData.excludeTaxPrice = 0;
                    this.data.map((item) => {
                      this.returnTaxData.excludeTaxPrice = this.printFn(
                        Number(item.excludeTaxPrice) + this.returnTaxData.excludeTaxPrice
                      );
                    });
                  },
                },
              }),
            ]);
          },
        },
        {
          title: '欧盟内免税收购项金额（递延清关）',
          align: 'center',
          width: 110,
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.otherEcAcqPrice,
                  type: 'number',
                  placeholder: '请输入数字',
                },
                on: {
                  input: (val) => {
                    this.data[params.row._index].otherEcAcqPrice = val;
                    this.returnTaxData.otherEcAcqPrice = 0;
                    this.data.map((item) => {
                      this.returnTaxData.otherEcAcqPrice = this.printFn(
                        Number(item.otherEcAcqPrice) + this.returnTaxData.otherEcAcqPrice
                      );
                    });
                  },
                },
              }),
            ]);
          },
        },
        // {
        //   title: "平台代扣代缴",
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", [
        //       h("Input", {
        //         props: {
        //           value: params.row.agentAmt,
        //           type: "number",
        //           placeholder: "请输入数字",
        //         },
        //         on: {
        //           input: (val) => {
        //             this.data[params.row._index].agentAmt = val;
        //             this.returnTaxData.agentAmt = 0;
        //             this.data.map((item) => {
        //               this.returnTaxData.agentAmt = this.printFn(Number(item.agentAmt) + this.returnTaxData.agentAmt);
        //             });
        //           },
        //         },
        //       }),
        //     ]);
        //   },
        // },
        {
          align: 'center',
          width: 110,
          renderHeader(h, params) {
            return h(
              'tooltip',
              {
                props: {
                  transfer: true,
                  placement: 'top',
                  'max-width': '240',
                },
              },
              [
                h('span', [
                  h('span', '平台代扣代缴'),
                  h('Icon', {
                    props: {
                      type: 'md-help-circle',
                      color: '#c8c8c8',
                      size: '20',
                    },
                    class: { iconClass: true },
                  }),
                ]),
                h(
                  'div',
                  {
                    slot: 'content',
                  },
                  [h('p', '税局要求:此金额四舍五入取整数')]
                ),
              ]
            );
          },
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.agentAmt,
                  placeholder: '请输入整数',
                  type: 'number',
                },
                on: {
                  input: (val) => {
                    // this.data[params.row._index].agentAmt = val;
                    // this.returnTaxData.agentAmt = 0;
                    // this.data.map((item) => {
                    //   this.returnTaxData.agentAmt = this.printFn(Number(item.agentAmt) + this.returnTaxData.agentAmt);
                    // });
                    // this.totalCollect = new Date().getTime();
                  },
                  'on-blur': (e) => {
                    this.data[params.row._index].agentAmt = Math.round(e.target.value);
                    this.returnTaxData.agentAmt = 0;
                    this.data.map((item) => {
                      this.returnTaxData.agentAmt = this.printFn(Number(item.agentAmt) + this.returnTaxData.agentAmt);
                    });
                    this.totalCollect = new Date().getTime();
                  },
                },
              }),
            ]);
          },
        },
        {
          align: 'center',
          width: 110,
          renderHeader(h, params) {
            return h(
              'tooltip',
              {
                props: {
                  transfer: true,
                  placement: 'top',
                  'max-width': '240',
                },
              },
              [
                h('span', [
                  h('span', 'B2B不含税销售额（€）'),
                  h('Icon', {
                    props: {
                      type: 'md-help-circle',
                      color: '#c8c8c8',
                      size: '20',
                    },
                    class: { iconClass: true },
                  }),
                ]),
                h(
                  'div',
                  {
                    slot: 'content',
                  },
                  [h('p', '对应月报/季报回执41项数据')]
                ),
              ]
            );
          },
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.b2bExcludeTaxPrice,
                  placeholder: '请输入整数',
                  type: 'number',
                },
                on: {
                  'on-blur': (e) => {
                    this.$set(this.data[params.row._index], 'b2bExcludeTaxPrice', Math.round(e.target.value));
                    // this.returnTaxData.b2bExcludeTaxPrice = 0;
                    // this.data.map((item) => {
                    //   this.returnTaxData.b2bExcludeTaxPrice = this.printFn(
                    //     Number(item.b2bExcludeTaxPrice) + this.returnTaxData.b2bExcludeTaxPrice
                    //   );
                    // });
                  },
                },
              }),
            ]);
          },
        },
        {
          align: 'center',
          width: 110,
          renderHeader(h, params) {
            return h(
              'tooltip',
              {
                props: {
                  transfer: true,
                  placement: 'top',
                  'max-width': '240',
                },
              },
              [
                h('span', [
                  h('span', '45项数据（€）'),
                  h('Icon', {
                    props: {
                      type: 'md-help-circle',
                      color: '#c8c8c8',
                      size: '20',
                    },
                    class: { iconClass: true },
                  }),
                ]),
                h(
                  'div',
                  {
                    slot: 'content',
                  },
                  [h('p', '对应月报季报回执45项数据')]
                ),
              ]
            );
          },
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.otherCountryNoTaxPrice,
                  placeholder: '请输入整数',
                  type: 'number',
                },
                on: {
                  'on-blur': (e) => {
                    this.$set(this.data[params.row._index], 'otherCountryNoTaxPrice', Math.round(e.target.value));
                    // this.returnTaxData.otherCountryNoTaxPrice = 0;
                    // this.data.map((item) => {
                    //   this.returnTaxData.otherCountryNoTaxPrice = this.printFn(
                    //     Number(item.otherCountryNoTaxPrice) + this.returnTaxData.otherCountryNoTaxPrice
                    //   );
                    // });
                  },
                },
              }),
            ]);
          },
        },
        {
          title: '应缴金额（€）',
          align: 'center',
          width: 110,
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.allTaxPrice,
                  type: 'number',
                  placeholder: '请输入数字',
                },
                on: {
                  input: (val) => {
                    this.data[params.row._index].allTaxPrice = val;
                    this.data[params.row._index].paidTaxPrice = val >= 0 ? val : 0;
                    this.returnTaxData.allTaxPrice = 0;
                    this.returnTaxData.paidTaxPrice = 0;
                    this.data.map((item) => {
                      this.returnTaxData.allTaxPrice = this.printFn(
                        Number(item.allTaxPrice) + this.returnTaxData.allTaxPrice
                      );
                      this.returnTaxData.paidTaxPrice = this.printFn(
                        Number(item.paidTaxPrice) + this.returnTaxData.paidTaxPrice
                      );
                    });
                  },
                },
              }),
            ]);
          },
        },
        {
          title: '实缴金额（€）',
          align: 'center',
          width: 110,
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.paidTaxPrice,
                  type: 'number',
                  placeholder: '请输入数字',
                },
                on: {
                  input: (val) => {
                    this.data[params.row._index].paidTaxPrice = val >= 0 ? val : 0;
                    this.returnTaxData.paidTaxPrice = 0;
                    this.data.map((item) => {
                      this.returnTaxData.paidTaxPrice = this.printFn(
                        Number(item.paidTaxPrice) + this.returnTaxData.paidTaxPrice
                      );
                    });
                  },
                },
              }),
            ]);
          },
        },
        {
          title: '抵扣金额（选填）',
          align: 'center',
          width: 100,
          slot: 'fillDiscount',
        },
        {
          title: '税率',
          align: 'center',
          width: 100,
          render: (h, params) => {
            return h(
              'i-select',
              {
                props: {
                  value: params.row.taxRate,
                  disabled: true,
                },
                on: {
                  'on-change': (val) => {
                    this.data[params.row._index].taxRate = val;
                  },
                },
              },
              [
                h(
                  'i-option',
                  {
                    props: {
                      value: 16,
                    },
                  },
                  '16%'
                ),
                h(
                  'i-option',
                  {
                    props: {
                      value: 19,
                    },
                  },
                  '19%'
                ),
              ]
            );
          },
        },
        {
          title: '申报回执',
          align: 'center',
          slot: 'declareReceptSlot',
          width: 110,
        },
        {
          title: '缴费凭证',
          align: 'center',
          slot: 'payReceptSlot',
          width: 110,
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          width: 100,
        },
      ],
      discountBox: false,
      discountInfo: {
        invoice: '',
        addedValue: '',
        other: '',
      },
      submitModal: false,
      taxNumInfo: {
        companyNameZh: 'fafaa',
      },
      returnTaxData: {
        allTaxPrice: 0,
        paidTaxPrice: 0,
        deductionPrice: 0,
        excludeTaxPrice: 0,
        otherEcAcqPrice: 0,
        agentAmt: 0,
      },
      currencySign: '€',
      dataIndex: 0,
      uploadIndex: 0,
      uploadItem: '',
      detailColumns: [
        {
          align: 'center',
          title: '申报周期',
          render(h, params) {
            let declarePeriod = params.row.declarePeriod,
              status = declarePeriod == 0 ? '月度申报' : declarePeriod == 1 ? '季度申报' : '';
            return h('span', status);
          },
        },
        {
          title: '申报月份/季度',
          align: 'center',
          width: 180,
          render(h, params) {
            let beginTime = params.row.beginTime.slice(0, 7);
            let endTime = params.row.endTime.slice(0, 7);
            return h('span', beginTime + '至' + endTime);
          },
        },
        {
          title: '不含税销售额（€）',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.excludeTaxPrice + '€');
          },
        },
        {
          title: '欧盟内免税收购项金额（递延清关）',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.otherEcAcqPrice + '€');
          },
        },
        {
          title: '平台代扣代缴',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.agentAmt + '€');
          },
        },
        {
          title: 'B2B不含税销售额（€）',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.b2bExcludeTaxPrice + '€');
          },
        },
        {
          title: '45项数据（€）',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.otherCountryNoTaxPrice + '€');
          },
        },
        {
          title: '应缴金额（€）',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.allTaxPrice + '€');
          },
        },
        {
          title: '实缴金额（€）',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.paidTaxPrice + '€');
          },
        },
        {
          title: '抵扣金额（选填）',
          align: 'center',
          slot: 'fillDiscount',
        },
        {
          title: '税率',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.taxRate + '%');
          },
        },
        {
          title: '申报回执',
          align: 'center',
          slot: 'declareReceptSlot',
        },
        {
          title: '缴费凭证',
          align: 'center',
          slot: 'payReceptSlot',
        },
      ],
      showImg: false,
    };
  },
  mounted() {
    this.getDetailInfo();

    if (this.baseData.productFunctionCode == 2 && this.baseData.beginTime) {
      this.kaishiTime = this.baseData.beginTime;
      this.kaishiTimeMonth = this.translateDate(this.kaishiTime, 'm');
    } else if (this.baseData.productFunctionCode == 5) {
      this.kaishiTime = this.baseData.beginTime;
    }
    // console.log(this.baseData.beginTime)
  },
  methods: {
    /** 设置指定时间内的汇率 如 2021 时间内 汇率为19  [{ star: "2021-01-01", end: "2021-12-31" }] */
    contrastDate(date1) {
      let arr = [{ star: '2021-01-01', end: '2021-12-31' }];
      let val = false;
      for (let index = 0; index < arr.length; index++) {
        if (new Date(arr[index].star).getTime() > date1.getTime < new Date(arr[index].end).getTime()) val = true;
      }
      return val;
    },
    printFn(value) {
      const precision = 14;
      return Number(math.format(value, precision));
    },
    kaishiTimeChange(val) {
      this.kaishiTimeMonth = this.translateDate(this.kaishiTime, 'm');
      // this.kaishiTime = this.translateDate(this.kaishiTime,'d')
    },
    discountFun() {
      let discount = this.data[this.dataIndex];
      let map = {
        invoiceDeductiontPrice: '发票抵扣',
        c88DeductiontPrice: '增值税抵扣',
        b2bDeductionPrice: 'B2B抵扣',
        euDeductiontPrice: '其他抵扣',
        comminglingBuySale: '共享库存_采购',
      };
      let keys = Object.keys(map);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (String(Number(discount[key])) === 'NaN') {
          this.$Message.error(`${map[key]}金额输入不正确，只能是数字`);
          return;
        }
      }
      this.returnTaxData.deductionPrice = 0;
      this.data.map((item) => {
        // 抵扣金额累计（发票抵扣+C88抵扣+b2b抵扣+其他抵扣+共享库存_购买不含税销售额（取页面精确到2位数的数值）*0.19）
        let { invoiceDeductiontPrice, c88DeductiontPrice, b2bDeductionPrice, euDeductiontPrice, comminglingBuySale } =
          item;
        let val =
          Number(invoiceDeductiontPrice) +
          Number(c88DeductiontPrice) +
          Number(b2bDeductionPrice) +
          Number(euDeductiontPrice) +
          Number(comminglingBuySale) * 0.19;
        this.returnTaxData.deductionPrice += this.printFn(val);
      });
      this.returnTaxData.deductionPrice = this.$util.formatPrice(this.returnTaxData.deductionPrice);
      this.dataIndex = 0;
      this.discountBox = false;
    },
    //屏幕高度
    getHeight() {
      // debugger;
      this.contentStyleObj.height = window.screen.height + 'px';
    },
    addProduct(index) {
      let obj = {
        declarePeriod: '',
        beginTime: '',
        endTime: '',
        declareReceipt: '',
        payReceipt: '',
        excludeTaxPrice: 0,
        allTaxPrice: 0,
        paidTaxPrice: 0,
        invoiceDeductiontPrice: 0,
        c88DeductiontPrice: 0,
        b2bDeductionPrice: 0,
        euDeductiontPrice: 0,
        comminglingBuySale: 0,
        declareList: [],
        payList: [],
        taxRate: 19,
        agentAmt: 0,
        otherEcAcqPrice: 0,
        b2bExcludeTaxPrice: 0,
        otherCountryNoTaxPrice: 0,
      };
      this.data.splice(index + 1, 0, obj);
    },
    remove(index) {
      this.returnTaxData = {
        allTaxPrice: 0,
        paidTaxPrice: 0,
        deductionPrice: 0,
        excludeTaxPrice: 0,
        otherEcAcqPrice: 0,
        agentAmt: 0,
      };
      this.data.splice(index, 1);
      this.dataIndex = 0;
      this.data.map((item) => {
        this.returnTaxData.deductionPrice = this.printFn(
          Number(item.invoiceDeductiontPrice) + this.returnTaxData.deductionPrice
        );
        this.returnTaxData.deductionPrice = this.printFn(
          Number(item.c88DeductiontPrice) + this.returnTaxData.deductionPrice
        );
        this.returnTaxData.deductionPrice = this.printFn(
          Number(item.b2bDeductionPrice) + this.returnTaxData.deductionPrice
        );
        this.returnTaxData.deductionPrice = this.printFn(
          Number(item.euDeductiontPrice) + this.returnTaxData.deductionPrice
        );
        this.returnTaxData.deductionPrice = this.printFn(
          Number(item.comminglingBuySale) * 0.19 + this.returnTaxData.deductionPrice
        );
        this.returnTaxData.allTaxPrice = this.printFn(Number(item.allTaxPrice) + this.returnTaxData.allTaxPrice);
        this.returnTaxData.paidTaxPrice = this.printFn(Number(item.paidTaxPrice) + this.returnTaxData.paidTaxPrice);
        this.returnTaxData.excludeTaxPrice = this.printFn(
          Number(item.excludeTaxPrice) + this.returnTaxData.excludeTaxPrice
        );
        this.returnTaxData.otherEcAcqPrice = this.printFn(
          Number(item.otherEcAcqPrice) + this.returnTaxData.otherEcAcqPrice
        );
        this.returnTaxData.agentAmt = this.printFn(Number(item.agentAmt) + this.returnTaxData.agentAmt);
      });
      this.returnTaxData.deductionPrice = this.$util.formatPrice(this.returnTaxData.deductionPrice);
    },
    //返回列表页
    goBack() {
      this.$emit('back');
    },
    getDetailInfo() {
      let data = { workId: this.workId };
      API.deAnnalsApiDetail(data).then((res) => {
        if (res.code === 0) {
          if (res.data.length > 0) {
            let returnData = res.data;
            this.data = res.data;
            returnData.map((item, index) => {
              this.data[index].declareList = [];
              this.data[index].payList = [];
              if (item.payReceipt != '') {
                let obj = {
                  name: '缴纳凭证',
                  url: item.payReceipt,
                };
                this.data[index].payList.push(obj);
              }
              if (item.declareReceipt != '') {
                let obj = {
                  name: '申报回执',
                  url: item.declareReceipt,
                };
                this.data[index].declareList.push(obj);
              }
              this.returnTaxData.deductionPrice = this.printFn(
                Number(item.invoiceDeductiontPrice) + this.returnTaxData.deductionPrice
              );
              this.returnTaxData.deductionPrice = this.printFn(
                Number(item.c88DeductiontPrice) + this.returnTaxData.deductionPrice
              );
              this.returnTaxData.deductionPrice = this.printFn(
                Number(item.b2bDeductionPrice) + this.returnTaxData.deductionPrice
              );
              this.returnTaxData.deductionPrice = this.printFn(
                Number(item.euDeductiontPrice) + this.returnTaxData.deductionPrice
              );
              this.returnTaxData.deductionPrice = this.printFn(
                Number(item.comminglingBuySale) * 0.19 + this.returnTaxData.deductionPrice
              );
              this.returnTaxData.allTaxPrice = this.printFn(Number(item.allTaxPrice) + this.returnTaxData.allTaxPrice);
              this.returnTaxData.paidTaxPrice = this.printFn(
                Number(item.paidTaxPrice) + this.returnTaxData.paidTaxPrice
              );
              this.returnTaxData.excludeTaxPrice = this.printFn(
                Number(item.excludeTaxPrice) + this.returnTaxData.excludeTaxPrice
              );
              this.returnTaxData.otherEcAcqPrice = this.printFn(
                Number(item.otherEcAcqPrice) + this.returnTaxData.otherEcAcqPrice
              );
              this.returnTaxData.agentAmt = this.printFn(Number(item.agentAmt) + this.returnTaxData.agentAmt);
            });
            this.returnTaxData.deductionPrice = this.$util.formatPrice(this.returnTaxData.deductionPrice);
          }
        }
      });
    },
    handleSuccess(res, file, fileList, row, item) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: '警告',
          desc: '请尝试再次上传',
        });
        return false;
      }
      this.data[row._index][item] = res.data.fileUrl;
    },
    handleRemoveFile(file, fileList, row, item) {
      // console.log(row)
      this.data[row._index][item] = '';
      // console.log(this.data[row._index][item])
    },
    handleFormatErrors() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 请上传jpg, jpeg, png, gif,pdf格式的文件',
      });
    },
    getTableIndex(e, type) {
      this.uploadIndex = e._index;
      this.uploadItem = type;
    },
    beforeUploadHandler(e, row, item) {
      let check = this.data[row._index][item] ? true : false;

      if (check) {
        this.$Notice.warning({
          title: '最多只可上传1张图片',
        });
      }
      return !check;
    },
    //日期转换
    translateDate(date, type) {
      if (typeof date === 'object') {
        let newdata = '',
          year = date.getFullYear(),
          month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1),
          dates = date.getDate();
        newdata = year + '-' + month;
        if (type === 'm') {
          return newdata;
        } else if (type === 'd') {
          return newdata + '-01';
        } else {
          return newdata + '-01';
        }
      } else {
        return date;
      }
    },
    saveData() {
      for (let i = 0; i < this.data.length; i++) {
        let num1 = Number(this.data[i].excludeTaxPrice);
        if (num1 % 1 != 0 && this.data[i].excludeTaxPrice != '') {
          this.$Message.error('第' + (i + 1) + '行不含税销售额输入不正确，只能是整数');
          return;
        }
        let num2 = Number(this.data[i].allTaxPrice);
        if (String(num2) == 'NaN') {
          this.$Message.error('第' + (i + 1) + '行应缴金额输入不正确，只能是数字');
          return;
        }
        let num3 = Number(this.data[i].paidTaxPrice);
        if (String(num3) == 'NaN') {
          this.$Message.error('第' + (i + 1) + '行实缴金额输入不正确，只能是数字');
          return;
        }
      }
      let data = {
        declarationDTOList: this.data,
        serviceId: this.serviceId,
        workId: this.workId,
        beginTime: this.kaishiTime,
      };
      data.beginTime = this.translateDate(data.beginTime, 'm');
      API.deAnnalsSaveApi(data).then((res) => {
        if (res.code == 0) {
          this.$Message.success('保存成功');
          this.wenxinTip = false;
          this.goBack();
        }
      });
    },
    submitModalFun() {
      // this.verPrice()
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].allTaxPrice === '') {
          this.$Message.error('第' + (i + 1) + '行应缴金额不能为空');
          return;
        } else if (this.data[i].excludeTaxPrice === '') {
          this.$Message.error('第' + (i + 1) + '行不含税销售额不能为空');
          return;
        } else if (this.data[i].paidTaxPrice === '') {
          this.$Message.error('第' + (i + 1) + '行实缴金额不能为空');
          return;
        }
        let num1 = Number(this.data[i].excludeTaxPrice);
        if (num1 % 1 != 0) {
          this.$Message.error('第' + (i + 1) + '行不含税销售额输入不正确，只能是整数');
          return;
        }
        let num2 = Number(this.data[i].allTaxPrice);
        if (String(num2) == 'NaN') {
          this.$Message.error('第' + (i + 1) + '行应缴金额输入不正确，只能是数字');
          return;
        }
        let num3 = Number(this.data[i].paidTaxPrice);
        if (String(num3) == 'NaN') {
          this.$Message.error('第' + (i + 1) + '行实缴金额输入不正确，只能是数字');
          return;
        }
      }
      if (this.kaishiTime == '') {
        this.$Message.error('请先选择申报区间开始时间');
        return;
      }
      let data = {
        declarationDTOList: this.data,
        serviceId: this.serviceId,
        workId: this.workId,
        beginTime: this.kaishiTime,
      };
      data.beginTime = this.translateDate(data.beginTime, 'm');
      API.deAnnalsSubmitApi(data).then((res) => {
        if (res.code == 0) {
          this.wenxinTip = false;
          // this.returnTaxData = res.data
          this.submitModal = true;
        }
      });
    },
    comfireSubmit() {
      let data = {
        declarationDTOList: this.data,
        serviceId: this.serviceId,
        workId: this.workId,
      };
      API.deAnnalsSureSubmitApi(data).then((res) => {
        if (res.code == 0) {
          this.$Message.success('提交成功');
          this.goBack();
        }
      });
    },
    //德国提交年报
    goAnnalsDE(row) {
      let beginTime = row.beginTime.slice(0, 7);
      let endTime = row.endTime.slice(0, 7);
      let baseData = {
        companyName: this.detailInfo.companyName,
        vatTaxNumber: this.detailInfo.vatTaxNumber,
        companyNameEn: this.detailInfo.companyNameEn,
        year: row.year,
        time: beginTime + '至' + endTime,
      };
      this.$emit('showAnnalsModal', row.id, baseData);
    },
    //获取德国年报工单详情
    getDEyearDetailFun(row) {
      this.thatDEinfo = {
        year: row.year,
        beginTime: row.beginTime,
        endTime: row.endTime,
        declareReceipt: row.declareReceipt,
      };
      this.deYearDetail = true;
      let data = { workId: row.id };
      APIDE.deAnnalsApiDetail(data).then((res) => {
        if (res.code === 0) {
          this.deAnnalsData = res.data;
        }
      });
    },
    //提交验证不含税销售额和缴纳税金为必填
    verPrice() {
      let self = this;
      this.data.forEach((e, i) => {
        if (e.allTaxPrice === '') {
          this.$Message.error('第' + (i + 1) + '行应缴金额不能为空');
          return true;
        } else if (e.excludeTaxPrice === '') {
          this.$Message.error('第' + (i + 1) + '行不含税销售额不能为空');
          return true;
        } else if (e.paidTaxPrice === '') {
          this.$Message.error('第' + (i + 1) + '行实缴金额不能为空');
          return true;
        }
      });
    },
  },
  created() {
    this.getHeight();
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-table-cell {
  white-space: normal !important;
}
.deletBtn {
  padding: 0;
}
.closeImg {
  width: 11px;
  height: 11px;
}
.go-back {
  margin-bottom: 24px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}
a {
  color: #16ade9;
  font-size: 14px;
}
.red {
  color: #ed3e3e;
}
.black {
  color: #333;
}
.container {
  margin: 24px;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px 24px;
  .tax-title {
    margin: 0 0 24px 0;
    padding: 11px 24px;
    background-color: rgba(22, 173, 233, 0.2);
    font-size: 18px;
    font-family: 'Microsoft Yahei', 'PingFangSC-Medium,PingFang SC';
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }
  .last-year-box {
    background: rgba(22, 173, 233, 0.06);
    padding: 14px 32px;
    color: #333333;
    font-size: 16px;
    line-height: 28px;
    .search-box {
      color: #16ade9;
      cursor: pointer;
      img {
        width: 16px;
        vertical-align: text-top;
      }
    }
  }
}
.taxBox {
  font-size: 12px;
  .page-title {
    font-size: 24px;
    font-family: 'Microsoft Yahei', 'PingFangSC-Semibold,PingFang SC';
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 22px;
  }
}
.tax-info-name {
  display: inline-block;
  min-width: 118px;
  font-size: 16px;
  font-family: 'Microsoft Yahei', PingFangSC;
  color: rgba(102, 102, 102, 1);
  line-height: 16px;
  text-align: right;
  margin-right: 16px;
}
.tax-info-value {
  font-size: 16px;
  font-family: 'Microsoft Yahei', 'PingFangSC-Medium,PingFang SC';
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 18px;
  a {
    color: #16ade9;
  }
  img {
    vertical-align: middle;
    margin-right: 5px;
    width: 18px;
  }
}
.data-title {
  font-size: 16px;
  font-family: 'Microsoft Yahei', 'PingFangSC-Medium', 'PingFang SC';
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 16px;
  margin: 16px 0 10px 32px;
  &::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: 'Microsoft Yahei', 'SimSun';
    font-size: 14px;
    color: #ed4014;
  }
}
.collect-box {
  padding: 16px 20px;
  font-size: 16px;
  color: #333;
  font-weight: 500;
  border: 1px solid rgba(153, 153, 153, 0.19);
  border-top: none;
  .right {
    float: left;
    width: 100%;
    margin-left: 120px;
    margin-top: -22px;
  }
}
.button-box {
  margin-top: 32px;
  text-align: center;
  .save-btn {
    margin-left: 10px;
    color: #16ade9;
    border-radius: 3px;
    border: 1px solid rgba(22, 173, 233, 1);
  }
}
.discount-footer {
  text-align: center;
  padding-bottom: 28px;
  button {
    width: 308px;
  }
}
.submit-box {
  .tax-info-name {
    min-width: 66px;
    margin-right: 16px;
  }
  /deep/ .ivu-divider-horizontal {
    margin: 0;
  }
  /deep/ .submitModal-footer-line {
    margin: 24px 0 32px 0;
  }
}
.submit-tip-box {
  .content {
    background: #f4f4f4;
    border-radius: 10px;
    color: #ed3e3e;
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    .companyTax {
      margin: 15px 0px;
      background: #ffffff;
      padding: 20px 30px;
      &/deep/ .ivu-row {
        height: 50px;
      }
    }
    .tableBox {
      table {
        padding: 10px;
      }
    }
    .english {
      font-weight: bold;
      font-size: 12px;
      color: #666666;
      line-height: 13px;
      height: 100%;
      position: relative;
      margin-bottom: 29px;
      padding-top: 10px;
      text-align: left;
      .chinese {
        position: absolute;
        top: 28px;
        left: 0px;
      }
      .rightWord {
        font-size: 12px;
        color: rgba(22, 173, 233, 1);
        line-height: 13px;
        margin-left: 15px;
      }
    }
    .chinese {
      font-size: 12px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
    .tableBox {
      table {
        .header {
          background: #f6f6f6;
        }
      }
    }
  }
  .reportData-box {
    .title {
      font-size: 14px;
      font-family: 'Microsoft Yahei', 'PingFangSC-Medium,PingFang SC';
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
    .sureData-box {
      border: 1px solid #ebebeb;
      width: 474px;
      margin-left: 55px;
      .row {
        span {
          display: inline-block;
          padding: 12px 15px;
          font-size: 14px;
          font-family: 'Microsoft Yahei', 'PingFangSC-Medium,PingFang SC';
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          width: 266px;
        }
        :nth-child(1) {
          background-color: #d0effb;
          border-bottom: 1px solid #ebebeb;
          border-right: 1px solid #ebebeb;
        }
        :nth-child(2) {
          border-bottom: 1px solid #ebebeb;
          width: 200px;
        }
      }
    }
  }
}
&/deep/ .ivu-modal-header-inner {
  color: #303033 !important;
}
&/deep/.ivu-table th {
  background-color: #f2f2f2;
  font-weight: 400;
  font-family: 'MicrosoftYaHei';
}
&/deep/ .ivu-table {
  font-size: 12px;
  color: #626266;
}
&/deep/ .ivu-modal {
  width: 750px;
}
/deep/ .ivu-col-span-12 {
  line-height: 26px;
}
/deep/ .ivu-table th {
  background-color: #d1effb;
}
/deep/ .ivu-table th {
  border-bottom: none;
}
/deep/ .submitModal-footer-line {
  margin: 40px 0;
}
/deep/ .ivu-row {
  margin-bottom: 14px;
}
/deep/ .checkTax {
  vertical-align: middle;
  color: #16ade9;
  font-size: 14px;
  cursor: pointer;
  img {
    vertical-align: middle;
  }
}
.modal-title {
  font-size: 14px;
  font-family: 'Microsoft Yahei', PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
  line-height: 14px;
  margin-bottom: 24px;
}
.detailModal-footer-line {
  margin-top: 10px;
}
.upload-box {
  color: #16ade9;
  button {
    border-color: #16ade9;
    color: #16ade9;
    i {
      color: #16ade9;
    }
  }
}
/deep/ .ivu-table-wrapper {
  overflow: inherit;
}
.back {
  padding: 10px 5px;
  background-color: #e8eaec;
  margin-bottom: 5px;
  cursor: pointer;
  .backBtn {
    width: 200px;
    cursor: pointer;
  }
}
/deep/ .ivu-modal {
  max-height: 600px;
  overflow: auto;
}
.link-box {
  color: #16ade9;
  a {
    color: #16ade9;
  }
}
.explamModal-footer {
  text-align: center;
  margin: 30px;
}
.tooltip {
  .tips-icon {
    width: 16px;
    height: 16px;
    background: #f79728;
    border-radius: 50%;
    color: #ffffff;
    display: inline-block;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    line-height: 16px;
  }
}
.bold {
  font-weight: bold;
}
</style>
