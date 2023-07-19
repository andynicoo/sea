<template>
  <div class="modalCount"
       :style="contentStyleObj">
    <div class="back"
         @click="goBack()">
      <Icon type="md-arrow-back" />返回上一页
    </div>
    <div class="step1">
      <p class="title">计算税金</p>
      <div class="leftBox">
        <Form ref="addFrom"
              :model="addFrom"
              :rules="ruleAddFrom"
              :label-width="120"
              class="leftForm">
          <div class="topLeft">
            <FormItem label="计税方式:"
                      prop="declareRule">
              <div class="taxType">
                <template>
                  <span :class="taxType==0?'active':''" @click="spanIndex(0)">目的国</span>
                  <span :class="taxType==1?'active':''" @click="spanIndex(1)" v-if="notBefore">发出国</span>
                  <span :class="taxType==2?'active':''" @click="spanIndex(2)">零申报</span>
                  <!-- <span :class="taxType==index?'active':'' "
                        v-for="(item,index) in taxTypes"
                        @click="spanIndex(item.value)"
                        :key="index">{{item.name}}</span> -->
                </template>
              </div>
            </FormItem>
            <FormItem label="选择国家:"
                      prop="countryCode"
                      style="max-width:308px;">
              <Select v-model="addFrom.countryCode"
                      :disabled="disabled"
                      @on-change="changeCountry"
                      placeholder="请选择报税国家">
                <Option v-for="(item,index) in allcountryList"
                        :value="item.countryCode"
                        :key="index">{{ item.countryNameZh }}</Option>
              </Select>
            </FormItem>
            <FormItem v-if="taxType!=2"
                      label="税率:"
                      prop="taxRate"
                      style="max-width:308px;">
              <Select v-model="addFrom.taxRate"
                      placeholder="税率">
                <Option v-for="(item,index) in taxRateList"
                        :value="String(item.taxRate)"
                        :key="index">{{ item.taxRate }}%</Option>
              </Select>
            </FormItem>
            <FormItem v-if="taxType!=2"
                      label="报税周期:"
                      prop="periodType"
                      style="max-width:308px;">
              <Select v-model="addFrom.periodType"
                      placeholder="税率">
                <Option v-for="(item,index) in declareList"
                        :value="String(item.status)"
                        :key="index">{{ item.type }}</Option>
              </Select>
            </FormItem>
            <FormItem v-if="taxType!=2"
                      class="haveCountry"
                      label="有税号国家:"
                      prop="tfnCountryCode">
              <span class="taxCountryBox"
                    v-for="(v,i) in checkedTaxCountry"
                    :key="i">{{v}}</span>
              <Button type="text"
                      @click="addCountry1"
                      v-if="typeNow!==2">+添加</Button>
            </FormItem>
            <FormItem label="销售平台："
                      prop="salePlatformType"
                      v-if="addFrom.countryCode=='SA'||addFrom.countryCode=='AE'">
              <Select v-model="addFrom.salePlatformType"
                      placeholder="请选择销售平台"
                      style="width:200px;">
                <Option :value="item.key"
                        v-for="(item,index) in salesList"
                        :key="index">{{item.value}}</Option>
              </Select>
            </FormItem>
            <FormItem label="是否有店铺:"
                      prop="isShop"
                      :label-width="130"
                      v-if="addFrom.countryCode=='SA'&&addFrom.declareRule=='2'">
              <RadioGroup v-model="addFrom.isShop">
                <Radio label="1">
                  <span style="float: right;margin-top: 3px;">是</span>
                </Radio>
                <Radio label="2">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="销售截图:"
                      prop="amx_file_url"
                      v-if="taxType === 2">
              <Upload ref="addFormUpload"
                      :action="fileUpload"
                      :data="{prefix:''}"
                      :on-success="(res,file,fileList)=>{handleAmzSuccess(res,file,fileList)}"
                      :on-remove="(file,fileList)=>{handleAmzRemoveFile (file,fileList)}"
                      :format="['pdf','jpg','png']"
                      :on-format-error="handleFormatErrors"
                      :before-upload="handleAmzBeforeUpload">
                <Button icon="ios-cloud-upload-outline"
                        class="amzUpload">上传销售截图</Button>
              </Upload>
            </FormItem>
            <FormItem v-else
                      label="亚马逊销售额文件:"
                      prop="amx_file_url">
              <Upload ref="addFormUpload"
                      :action="fileUpload"
                      :data="{prefix:''}"
                      :on-success="(res,file,fileList)=>{handleAmzSuccess(res,file,fileList)}"
                      :on-remove="(file,fileList)=>{handleAmzRemoveFile (file,fileList)}"
                      :format="['xls','xlsx','csv','txt']"
                      :on-format-error="handleFormatError"
                      :before-upload="handleAmzBeforeUpload">
                <Button icon="ios-cloud-upload-outline"
                        class="amzUpload">上传文件</Button>
              </Upload>
            </FormItem>
            <Row>
              <FormItem label="其它平台含税销售额"
                        v-if="taxType!=2">
                <Button class="amzUpload btnfile"
                        v-if="this.otherPlatformsFormObj.otherIncludTaxAmt ===''"
                        @click="otherPlatformsMadal = true">点击填写</Button>
                <div v-else
                     class="otherPlatformBox">
                  <!-- {{this.otherPlatformsForm.otherIncludTaxAmt}} -->
                  <span class="num">
                    {{otherPlatformsFormObj.otherIncludTaxAmt}}
                    <span class="link"
                          @click="otherPlatformsMadal = true">
                      <img src="../../../../assets/images/home/edit1.png"
                           style="margin-right: -2px;margin-left: 8px;"
                           alt="">
                      修改
                    </span>
                    <span class="link"
                          style="color:#B2B2B2;"
                          @click="clearOtherPlatformsInfo">
                      删除
                    </span>
                  </span>
                  <span class="link">
                    <a :href="otherPlatformsFormObj.otherSaleFileUrl"
                       target="_blank">
                      <img style="float: left;margin-right: 5px;margin-top: 2px;"
                           src="../../../../assets/images/home/linkIcon.png"
                           alt="">
                      {{otherPlatformsFormObj.origFileName}}
                    </a>
                  </span>
                </div>
              </FormItem>
            </Row>
          </div>
          <div class="discountBox "
               v-if="taxType!=2">
            <p class="discountTitle clearfix">抵扣项
              <span>（如有抵扣项，可进行上传）</span>

              <span class="addBtn fr"
                    @click="addDiscount">+添加</span>
            </p>
            <Table :data="discountData"
                   :columns="discountColumns"
                   border
                   class="table">
              <template slot="declareDate"
                        slot-scope="{row}">
                <Date-picker type="date"
                             :value="row.billDate"
                             @on-change="changeDate($event,row)"></Date-picker>
              </template>
              <template slot="uploadBox"
                        slot-scope="{row}">
                <Upload :action="fileUpload"
                        :data="{prefix:''}"
                        :on-success="(res,file,fileList)=>{handleSuccess(res,file,fileList,row)}"
                        :on-remove="(file,fileList)=>{handleRemoveFile (file,fileList,row)}"
                        :format="['pdf','jpg','png']"
                        :on-format-error="handleFormatErrors">
                  <Button icon="ios-cloud-upload-outline">上传</Button>
                </Upload>
              </template>
            </Table>
          </div>
        </Form>
      </div>
    </div>
    <div class="step2">
      <p class="title">计算结果</p>
      <div class="resultBox">
        <p>
          <span>含税销售总额：</span>
          <span>{{currencySign}}{{returnTaxData.includTaxAmtTotal}}</span>
        </p>
        <p>
          <span>不含税销售总额：</span>
          <span>{{currencySign}}{{returnTaxData.excludeTaxAmtTotal}}</span>
        </p>
        <p>
          <span>销项税额：</span>
          <span>{{currencySign}}{{returnTaxData.taxAmtTotal}}</span>
        </p>
        <p>
          <span>抵扣金额：</span>
          <span>{{currencySign}}{{returnTaxData.deductionAmt}}</span>
        </p>
        <p>最终缴纳税金:
          <span>{{currencySign}}{{returnTaxData.taxTotal}}</span>
        </p>
        <Table :data="returnData"
               max-height="500"
               :columns="returnColumns"
               v-if="addFrom.countryCode!='SA'&&addFrom.countryCode!='AE'"></Table>
        <Table :data="returnDataAE"
               max-height="500"
               :columns="returnColumnsAE"
               v-if="addFrom.countryCode=='AE'"></Table>
        <div v-if="returnDataSale.length > 0 && addFrom.declareRule !== 2">
          <div class="jiankong normal"
               v-if="returnTaxData.status === 0 && returnData.length > 0">
            <span class="JkTitle">
              远程销售额监控
            </span>
            <span class="status"
                  @click="getStatus()"><img src="../../../../assets/images/computedTax/blueStatus.png"
                   alt="">正常 >> </span>
          </div>
          <div class="jiankong unnormal"
               v-if="returnTaxData.status === 1 && returnData.length > 0">
            <span class="JkTitle">
              远程销售额监控
            </span>
            <span class="status"
                  @click="getStatus()"><img src="../../../../assets/images/computedTax/redStatus.png"
                   alt="">异常 >></span>
          </div>
        </div>
      </div>
    </div>
    <div style="clear:both;"></div>
    <div class="btBox">
      <Button type="primary"
              @click="checkTax"
              style="margin-right:10px"
              v-if="taxType!=2">核算税金</Button>
      <Button @click="submitDeclare">提交申报</Button>
      <!-- <Button @click="backToList">返回列表</Button> -->
    </div>
    <Modal v-model="modelAddCom"
           title="添加国家"
           :mask-closable="false">
      <Form ref="giveFrom"
            :model="giveFrom"
            :rules="ruleGiveFrom"
            :label-width="0">
        <FormItem label
                  prop="tfnCountryCode">
          <Row>
            <CheckboxGroup v-model="giveFrom.tfnCountryCode"
                           @on-change="countrys">
              <Checkbox v-for="(item,index) in allcountryList1"
                        :label="item.countryCode"
                        :key="index">
                <!-- <span>{{item.countryCode}}</span> -->
                <span>{{item.countryName}}</span>
              </Checkbox>
            </CheckboxGroup>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="footerBt"
                type="primary"
                :loading="loadingget"
                @click="giveok('giveFrom')">确认</Button>
      </div>
    </Modal>
    <Modal v-model="statusModel"
           width="1100"
           class-name="remoteSale"
           footer-hide>
      <div class="yuanchengxiaoshou">
        <Table :data="returnDataSale"
               max-height="500"
               :columns="returnColumnSale">
          <div slot="header"
               class="remoteSaleHeader">
            远程销售额监控
          </div>
          <div slot="footer"
               class="remoteSaleFooter">
            <span style="color:#ED3E3E;">特别说明：</span> 远程销售额监控是当您使用发出国算法进行报税，销售额达到发出国上限的的50%--70%时，建议您及时注册目的国税号使用目的国算法报税。因为根据欧洲VAT算税规定：一旦达到发出国销售额上限，将无法再以发出国进行报税。
          </div>
          <template slot="includTaxPriceTotal"
                    slot-scope="{ row }">
            <span :class="Number(row.includTaxPriceTotal) > Number(row.moneyLimit) ?'red':''">{{row.includTaxPriceTotal}}</span>
          </template>
        </Table>
      </div>
    </Modal>
    <Modal v-model="otherPlatformsMadal"
           title="其它平台含税销售额">
      <div class="promptBg">
        <p>
          <span>温馨提示：</span>
          如有其它平台需要VAT申报，请在此处填写含税销售额，含税销售额的计算方式可联系客服！(注意：填写的销售额币种为您需要申报的币种)
        </p>
      </div>
      <Form :label-width="120"
            ref="otherPlatforms"
            :model="otherPlatformsForm"
            :rules="otherPlatformsRules">
        <FormItem label="含税销售额"
                  prop="otherIncludTaxAmt">
          <Input placeholder="请输入含税销售额"
                 type="number"
                 v-model="otherPlatformsForm.otherIncludTaxAmt"
                 style="width:300px;"></Input>
        </FormItem>
        <FormItem label="其它平台含税销售文件"
                  prop="otherSaleFileUrl">
          <Upload :before-upload="handleAmzBeforeUploadPlatform"
                  :on-format-error="handleFormatErrors"
                  :on-success="(res,file,fileList)=>{handleAmzSuccessPlatform(res,file,fileList)}"
                  :on-remove="(file,fileList)=>{handleAmzRemoveFilePlatform (file,fileList)}"
                  :action="fileUpload"
                  ref="otherPlatformsUpload"
                  :data="{prefix:''}"
                  :format="['jpg','jpeg','png','gif','pdf','word','docx']">
            <Button style="width:300px;background: #16ADE9;color: #FFFFFF;"
                    icon="ios-cloud-upload-outline">点击上传</Button>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer"
           style="text-align: center;">
        <Button class="footerBt"
                style="width:100px;"
                type="primary"
                :loading="loadingget"
                @click="submitPlatformsForm('otherPlatforms')">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { submitDeclare, submitDeclareNew, uploadDeductInfo } from '@/api/taxService/workOrder.js'
import { getProduct, getTaxRate, taxCountry, calculationTax, submitTaxdate, material, calculationTaxSale } from "@/api/taxService/taxModule.js"
export default {
  props: {
    workId: {
      type: String,
      default: ''
    },
    serviceId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 所有销售报告类型
      allsaleType: [],
      loadBtnAuto: false, // 自动计算loading
      loadClient: false, // 客户确认loading
      loadNext: false,
      stepIndex: 0, // 步骤
      giveFrom: {},
      ifE: false, // 是否英国
      disabled: false, // 下拉框是否可选
      ruleGiveFrom: {
        tfnCountryCode: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "至少选择一个国家",
            trigger: "change"
          }
        ]
      },
      contentStyleObj: {
        height: ""
      },
      otherPlatformsMadal: false,
      otherPlatformsForm: {
        otherSaleFileUrl: '',
        otherIncludTaxAmt: '',
        origFileName: ''
      },
      otherPlatformsFormObj: {
        otherSaleFileUrl: '',
        otherIncludTaxAmt: '',
        origFileName: ''
      },
      otherPlatformsRules: {
        otherIncludTaxAmt: [
          { required: 'true', message: '请输入含税销售额', trigger: 'change' }
        ],
        otherSaleFileUrl: [
          {
            required: 'true', message: '请上传其它平台含税销售文件', trigger: 'change'
          }
        ],
      },
      modelAddCom: false,
      loadingget: false,
      loadingRemark: false,
      currency: "", // 货币单位
      defaultList: [],
      uploadList: [],
      imgName: "",
      visible: false,
      fileUpload: this.workOrderFile,
      addFrom: {
        countryCode: '',
        declareRule: 0,
        saleFileUrl: '',
        taxRate: '',
        tfnCountryCode: [],
        workNo: this.$route.params.workNo
      },
      ruleAddFrom: {
        countryCode: { required: 'true', message: '请选择需要报税的国家', trigger: 'change' },
        taxRate: { required: 'true', message: '请选择税率', trigger: 'change' },
      },
      allFacilitator: "",
      taxType: 0,
      // all country
      allcountryList: [],
      allcountryList1: [],
      taxTypes: [
        { value: 0, name: "目的国" },
        { value: 1, name: "发出国" },
        { value: 2, name: "零申报" }
      ],
      // 核算税金
      typeNow: "",
      tableFiles: [{ fileList: '' }],
      taxRateList: [],
      checkedTaxCountry: [],
      AmzFileList: [],
      discountData: [{
        deductionType: '',
        billDate: '',
        deductiontAmt: '',
        deductionFile: '',//url
        fileOriginalName: ''//name
      }],
      discountColumns: [
        {
          width: '80px',
          title: '序号',
          render(h, params) {
            return h('span', params.row._index + 1)
          }
        },
        {
          title: '抵扣类型',
          render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: params.row.deductionType
                },
                on: {
                  'on-change': event => {
                    this.discountData[params.index].deductionType = event
                  }
                }
              },
              this.discountTypeList.map(item => {
                return h('Option', {
                  props: {
                    value: item.label,
                    label: item.val
                  }
                })
              })
            )
          }
        },
        {
          title: '单据日期',
          slot: 'declareDate'
        },
        {
          title: '抵扣金额（英镑）',
          render: (h, params) => {
            return h('Input', {
              props: {
                value: params.row.deductiontAmt,
                size: 'small',
                placeholder: 'GBP'
              },
              on: {
                input: val => {
                  this.discountData[params.index].deductiontAmt = val
                }
              }
            })
          }
        },
        {
          title: '上传凭证',
          slot: 'uploadBox'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('span', {
              style: {
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.discountData.splice(params.index, 1)
                }
              }
            }, '删除')
          }
        }
      ],
      discountTypeList: [
        {
          val: '进口增值税抵扣',
          label: '1'
        },
        {
          val: '发票抵扣',
          label: '2'
        },
        {
          val: '欧盟内采购',
          label: '3'
        },
        {
          val: 'B2B发票',
          label: '4'
        }
      ],
      currencySign: '',//税金币种符号
      deductionAmt: '',//可抵扣总金额
      returnData: [],
      returnColumns: [
        {
          title: '销售月份',
          render: (h, params) => {
            return h('span', params.row.month);
          },
          width: 120
        },
        {
          title: '发出国',
          key: 'departCode',
          width: 120
        },
        {
          title: '到货国',
          key: 'arrivalCode',
          width: 120
        },
        {
          title: '币种',
          key: 'currency',
          width: 120
        },
        {
          title: '汇率',
          key: 'rate',
          width: 120
        },
        {
          title: '含税销售额',
          render: (h, params) => {
            return h('span', this.currencySign + params.row.includTaxPrice)
          },
          width: 120
        },
      ],
      returnTaxData: {},
      status: this.$route.params.status,
      rateList: {},
      declareList: [],
      notBefore:true,
      statusModel: false, // 远程销售弹窗
      returnColumnSale: [  // 远程销售表头
        {
          title: '到货国',
          key: 'arrivalCode',
          width: 120
        },
        {
          title: '货币单位',
          key: 'currency',
          width: 120
        },
        {
          title: '1月',
          key: '01',
          width: 120
        },
        {
          title: '2月',
          key: '02',
          width: 120
        },
        {
          title: '3月',
          key: '03',
          width: 120
        },
        {
          title: '4月',
          key: '04',
          width: 120
        },
        {
          title: '5月',
          key: '05',
          width: 120
        },
        {
          title: '6月',
          key: '06',
          width: 120
        },
        {
          title: '7月',
          key: '07',
          width: 120
        },
        {
          title: '8月',
          key: '08',
          width: 120
        },
        {
          title: '9月',
          key: '09',
          width: 120
        },
        {
          title: '10月',
          key: '10',
          width: 120
        },
        {
          title: '11月',
          key: '11',
          width: 120
        },
        {
          title: '12月',
          key: '12',
          width: 120
        },
        {
          title: '含税销售额',
          slot: 'includTaxPriceTotal',
          width: 120
        },
        {
          title: '远程销售限额',
          key: 'moneyLimit',
          width: 120
        },
      ],
      remoteSaleCheckInfos: {}, // 计算税金 需要提交到后台
      returnDataSale: [], // 远程销售数据
      // 税局需要的
      needDisabled: false,
      declareInfo: {},
      salesList: [
        { key: '0', value: '亚马逊' },
        { key: '1', value: 'NOON' },
        { key: '2', value: 'Souq' },
      ],
      returnDataAE: [],
      returnColumnsAE: [
        {
          title: '序号',
          width: 60,
          type: 'index',
        },
        {
          title: '日期',
          key: 'moth',
          render(h, params) {
            let month = params.row.moth.slice(0, 9)
            return h('span', month)
          },
        },
        {
          title: '收货人',
          key: 'consignee'
        },
        {
          title: '辖区',
          key: 'city'
        },
        {
          title: '含税销售额',
          key: 'includTaxPrice'
        },
        {
          title: '不含税销售额',
          key: 'excludeTaxPrice'
        },
        {
          title: '税率',
          key: 'rate',
          render(h, params) {
            let rate = params.row.rate
            return h('span', rate + '%')
          },
        },
        {
          title: '应缴税金',
          key: 'allTaxPrice'
        },
      ],
    };
  },
  computed: {},
  methods: {
    getBaseInfo() {
      const self = this
      this.allcountryList = []
      getProduct().then(res => {
        if (res.code === 0) {
          this.allcountryList = res.data
        }
      })
      getTaxRate().then(res => {
        var that = this
        if (res.code === 0) {
          that.rateList = res.data
        }
      })
      taxCountry().then(res => {
        if (res.code === 0) {
          this.allcountryList1 = res.data
        }
      })
      // this.addFrom.countryCode = this.declareInfo.countryCode
      setTimeout(function () {
        self.getInfoForAuth(self, self.rateList, self.allcountryList)
      }, 200)
    },
    changeCountry(val) {
      let countryList = []
      countryList = Object.getOwnPropertyNames(this.rateList)
      this.declareList = []
      countryList.forEach((v, i) => {
        if (val === v) {
          this.taxRateList = this.rateList[val][0]
        }
      })
      const self = this
      self.allcountryList.map((value, index) => {
        if (value.countryCode == val) {
          if (value.monthPeriod === 0)
            self.declareList.push({ type: "月报", status: "0" });
          if (value.quarterPeriod === 0)
            self.declareList.push({ type: "季报", status: "1" });
          if (value.yearPeriod === 0)
            self.declareList.push({ type: "年报", status: "2" });
        }
      })
    },
    // tax type
    spanIndex(index) {
      this.taxType = index;
      this.addFrom.saleFileUrl = ''
      this.$refs.addFormUpload.clearFiles();
      this.AmzFileList = []
      this.addFrom.declareRule = this.taxType;
    },
    // 添加公司
    giveok(all) {
      let self = this;
      this.$refs[all].validate(valid => {
        if (valid) {
          const self = this
          this.checkedTaxCountry = []
          this.addFrom.tfnCountryCode.map((v, i) => {
            self.allcountryList1.map((val, index) => {
              if (v == val.countryCode) {
                self.checkedTaxCountry.push(val.countryName)
                // self.addFrom.tfnCountryCode.push(val.countryName)
              }
            })
          })
          self.modelAddCom = false;
        } else {
        }
      });
    },
    // 公司所有公司数据
    addCountry1() {
      this.modelAddCom = true;
    },
    // 所选公司
    countrys(arr) {
      this.addFrom.tfnCountryCode = arr;
    },
    // ymx file
    handleAmzSuccess(response, file, fileList) {
      this.addFrom.saleFileUrl = response.data.fileUrl;
      this.AmzFileList = fileList
    },
    handleAmzRemoveFile() {
      this.addFrom.saleFileUrl = ''
    },
    addDiscount() {
      let obj = {
        deductionType: '',
        billDate: '',
        deductiontAmt: '',
        deductionFile: '',//url
        fileOriginalName: ''//name
      }
      this.discountData.push(obj)
    },
    changeDate(date, row) {
      this.discountData[row._index].billDate = date + " 00:00:00"
    },
    handleSuccess(res, file, fileList, row) {
      this.discountData[row._index].deductionFile = res.data.fileUrl
      this.discountData[row._index].fileOriginalName = file.name
    },
    handleAmzBeforeUpload() {
      const check = this.AmzFileList.length < 1
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件'
        })
      }
      return check
    },
    handleBeforeUpload() {
      const check = this.tableFiles[0].fileList.length < 1
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件'
        })
      }
      return check
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持xls、xlsx、csv、txt'
      });
    },
    handleFormatErrors(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持jpg、png、pdf'
      });
    },
    handleRemoveFile(file, fileList, row) {
      // this.tableFiles[0].fileList = fileList
      this.discountData[row._index].deductionFile = ''
      this.discountData[row._index].fileOriginalName = ''
    },
    //核算税金
    checkTax() {
      this.addFrom.deductionItems = this.discountData
      if (this.addFrom.saleFileUrl === '' && this.otherPlatformsFormObj.otherSaleFileUrl === '') {
        this.$Message.info('请上传销售额文件')
        return
      }
      if (this.addFrom.taxRate == '') {
        this.$Message.info('请选择税率')
        return
      }

      this.addFrom.userId = this.declareInfo.userId
      this.addFrom.vatTaxNumber = this.declareInfo.vatTaxNumber
      this.addFrom.endTime = this.declareInfo.endTime
      this.addFrom.beginTime = this.declareInfo.beginTime
      this.addFrom.workId = this.declareInfo.id
      this.addFrom.servicesId = this.serviceId
      let data = { ...this.addFrom }
      data.otherIncludTaxAmt = this.otherPlatformsFormObj.otherIncludTaxAmt
      data.otherSaleFileUrl = this.otherPlatformsFormObj.otherSaleFileUrl
      calculationTaxSale(data).then(res => {
        if (res.code == 0) {
          window.localStorage.setItem('ceshi', JSON.stringify(res.data))
          this.currencySign = res.data.currencySign
          this.deductionAmt = res.data.deductionAmt
          this.remoteSaleCheckInfos = res.data.remoteSaleCheckInfos
          this.returnTaxData = res.data
          if (this.addFrom.countryCode != 'SA' && this.addFrom.countryCode != 'AE') {
            this.returnData = res.data.saleCheckInfos
            this.returnDataSale = res.data.saleCheckInfoVos
          }
          if (this.addFrom.countryCode == 'AE') {
            this.returnDataAE = res.data.aeSaleDateInfo
          }
        }
      })
    },
    //提交申报
    submitDeclare() {
      const validate = this.verifyPaymentInsert(this.discountData)
      if (this.addFrom.countryCode != 'SA' && this.addFrom.countryCode != 'AE') {
        if (this.returnData.length == 0 && this.addFrom.declareRule != 2) {
          this.$Message.error("请先核算税金")
          return
        }
      }
      // this.uploadDeductInfo()
      let params = {}

      if (this.taxType == 2) {
        params = {
          workId: this.workId,
          allTaxPrice: 0,
          deductionPrice: 0,
          excludeTaxPrice: 0,
          includTaxPrice: 0,
          listTaxDeductionItem: [],
          sellFile: this.addFrom.saleFileUrl,
          declareRule: this.taxType,
          taxRate: 0,
          serviceId: this.serviceId,
          remoteSaleCheckInfos: this.remoteSaleCheckInfos,
          taxAmtTotal: 0
        }
        if (this.addFrom.countryCode == 'SA') {
          params.isShop = this.addFrom.isShop
        }
      } else {
        params = {
          workId: this.workId,
          allTaxPrice: this.returnTaxData.taxTotal,
          deductionPrice: this.deductionAmt,
          excludeTaxPrice: this.returnTaxData.excludeTaxAmtTotal,
          taxAmtTotal: this.returnTaxData.taxAmtTotal,
          includTaxPrice: this.returnTaxData.includTaxAmtTotal,
          listTaxDeductionItem: [],
          sellFile: this.addFrom.saleFileUrl,
          declareRule: this.taxType,
          taxRate: this.addFrom.taxRate,
          serviceId: this.serviceId,
          remoteSaleCheckInfos: this.remoteSaleCheckInfos
        }
        if (this.addFrom.countryCode == 'AE') {
          params = {
            serviceId: this.serviceId,
            allTaxPrice: this.returnTaxData.taxTotal,
            taxAmtTotal: this.returnTaxData.taxAmtTotal,
            deductionPrice: this.deductionAmt,
            excludeTaxPrice: this.returnTaxData.excludeTaxAmtTotal,
            includTaxPrice: this.returnTaxData.includTaxAmtTotal,
            listTaxDeductionItem: [],
            sellFile: this.addFrom.saleFileUrl,
            declareRule: this.addFrom.declareRule,
            taxRate: this.addFrom.taxRate,
            remoteSaleCheckInfos: this.remoteSaleCheckInfos,
            aeSaleDataInfo: this.returnDataAE
          }
        }
      }
      if (this.taxType == 2 && params.sellFile === '') {
        this.$Message.error('请上传销售截图')
        return
      }
      if (!validate.flag) {
        this.$Message.info('请填写完整抵扣项金额')
        return
      } else if (validate.flag && validate.isEmpty) {
        params.listTaxDeductionItem = []
      } else if (validate.flag && !validate.isEmpty) {
        params.listTaxDeductionItem = this.discountData
      }
      params.otherIncludTaxAmt = this.otherPlatformsFormObj.otherIncludTaxAmt
      params.otherSaleFileUrl = this.otherPlatformsFormObj.otherSaleFileUrl
      if (this.declareInfo && this.declareInfo.countryCode === 'GB') {
        material(params).then((res) => {
          if (res.code == 0) {
            this.$Message.success('提交成功')
            this.$store.commit('getComfirmMessage', res.data)
            this.$store.commit('getAddFrom', params)
            if (this.taxType === 2) {
              this.$emit('zeroDeclareShow')
            } else {
              this.$emit('declareShow')
            }
          } else {
            // this.$Message.warning(res.message)
          }
        })
        return
      }
      submitDeclareNew(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('提交成功')
          this.$emit('refresh')
        } else {
          // this.$Message.warning(res.message)
        }
      })
    },
    // 验证抵扣项有没有值，如果没有传空对象，有则每一个字段都必填
    verifyPaymentInsert(obj) {
      let arr = Object.values(obj)
      // console.log(arr)
      let flag = false, isEmpty = false
      arr.forEach(item => {
        const values = this.getObjectValues(item)
        let nulls = 0,
          notNull = 0,
          allDiscountLength = 0
        values.map(val => {
          if (val == '') {
            nulls++
            // 判断款项信息全部为空，可以通过验证
            if (nulls == values.length || nulls === 0) {
              allDiscountLength++
              if (allDiscountLength == arr.length) {
                isEmpty = true
                flag = true
              } else {
                flag = false
              }
            } else {
              flag = false
            }
          } else {
            notNull++
            // 判断款项信息全部不为空,通过验证
            if (notNull === values.length) {
              flag = true
              isEmpty = false
            } else {
              flag = false
            }
          }
        })
      })
      let params = {
        flag,
        isEmpty
      }
      return params
    },
    getObjectValues(object) {
      let values = [];
      for (var property in object)
        values.push(object[property]);
      return values;
    },
    handleAmzSuccessPlatform(response, file, fileList) {
      this.otherPlatformsForm.origFileName = response.data.origFileName
      this.otherPlatformsForm.otherSaleFileUrl = response.data.fileUrl;
    },
    handleAmzRemoveFilePlatform() {
      this.otherPlatformsForm.otherSaleFileUrl = ''
    },
    handleAmzBeforeUploadPlatform() {
      const check = this.otherPlatformsForm.otherSaleFileUrl == ''
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件'
        })
      }
      return check
    },
    submitPlatformsForm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.otherPlatformsForm.otherIncludTaxAmt < 0) {
            this.$Message.error('请输入正确的含税销售额')
            return
          }
          this.otherPlatformsFormObj = this.otherPlatformsForm
          this.otherPlatformsMadal = false
        }
      })
    },
    //上传抵扣明细
    uploadDeductInfo() {
      let params = {
        serviceId: this.serviceId,
        taxDeductionItemList: this.discountData
      }
      uploadDeductInfo(params).then(res => {
        if (res.code == 0) {

        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    //返回列表
    backToList() {
      // this.$router.push({name:'declareList'})
    },
    //返回列表页
    goBack() {
      this.$emit('back')
    },
    // 获取英国申报信息、
    getInfoForAuth(that, rateList, allcountryList) {
      that.taxRateList = rateList[that.declareInfo.countryCode][0]
      that.disabled = true
      that.addFrom.countryCode = that.declareInfo.countryCode
      that.declareList = []
      allcountryList.map((value, index) => {
        if (value.countryCode === that.declareInfo.countryCode) {
          if (value.monthPeriod === 0)
            that.declareList.push({ type: "月报", status: "0" });
          if (value.quarterPeriod === 0)
            that.declareList.push({ type: "季报", status: "1" });
          if (value.yearPeriod === 0)
            that.declareList.push({ type: "年报", status: "2" });
        }
      })
      // that.addFrom.taxRate = rateList[that.declareInfo.countryCode][0]
      that.addFrom.periodType = that.declareList[0].status
    },
    // 远程销售弹窗
    getStatus() {
      this.statusModel = true
    },
    clearOtherPlatformsInfo() {
      this.otherPlatformsForm = {
        otherSaleFileUrl: '',
        otherIncludTaxAmt: '',
        origFileName: ''
      }
      this.otherPlatformsFormObj = {
        otherSaleFileUrl: '',
        otherIncludTaxAmt: '',
        origFileName: ''
      }
      this.$refs.otherPlatformsUpload.clearFiles()
    }
  },
  mounted() {
    this.declareInfo = this.$store.state.taxBureau.declareInfo
    if(this.declareInfo && this.declareInfo.countryCode=='GB' && parseInt(this.declareInfo.endTime.slice(0,4))>=2021) this.notBefore = false
    // console.log(this.declareInfo)
    this.contentStyleObj.height = window.screen.height + "px";
    this.getBaseInfo()
  }
};
</script>
<style lang="less" scoped>
.modalCount {
  background-color: #fff;
  margin: 20px;
  padding: 10px 12px;
  .title {
    font-size: 16px;
    font-weight: 500;
    padding: 18px 0 18px 0;
    border-bottom: 1px solid #e6e6e6;
    color: #303033;
    font-family: "PingFangSC-Medium,PingFang SC";
  }
  .taxType {
    span {
      border: 1px solid #e6e6e6;
      margin-right: 12px;
      padding: 12px;
      cursor: pointer;
      color: #303033;
    }
    .active {
      border: 1px solid #16ade9;
      color: #16ade9;
      background: url("../../../../assets/images/computedTax/checked.png")
        no-repeat;
      background-position: 47px 23px;
    }
  }
  .step1,
  .step2 {
    padding-bottom: 20px;
    float: left;
  }
  .step1 {
    width: 62%;
  }
  .step2 {
    width: 32%;
    margin-left: 3%;
    .resultBox {
      margin-top: 28px;
      border: 1px solid #d9d9d9;
      min-height: 506px;
      padding: 30px;
      .canDiscount {
        font-size: 12px;
        margin-top: 12px;
        color: #303033;
        span {
          margin-left: 50px;
        }
      }
      .jiankong {
        margin-top: 10px;
        display: flex;
        .JkTitle {
          font-size: 16px;
          font-weight: 500;
          margin-left: 33px;
          margin-right: 11px;
        }
      }
      .normal {
        cursor: pointer;
        span.status {
          display: flex;
          align-items: center;
          img {
            width: 18px;
            height: 13px;
            // margin-top: 3px;
          }
          color: #16ade9;
        }
      }
      .unnormal {
        cursor: pointer;
        span.status {
          display: flex;
          align-items: center;
          img {
            width: 18px;
            height: 13px;
            // margin-top: 3px;
          }
          color: #ed3e3e;
        }
      }
    }
  }
  .table {
    margin-top: 16px;
  }
  .leftBox {
    margin-top: 25px;
    width: 100%;
    border: 1px solid #d8d8d8;
    .haveCountry {
      .taxCountryBox {
        margin-right: 8px;
      }
      button {
        color: #16ade9;
        border: 1px solid #e6e6e6;
      }
    }
  }
  .topLeft {
    margin: 30px 0 20px 80px;
  }
  .discountBox {
    padding: 24px;
    background-color: #fcf9fc;
    padding-top: 22px;
    border-top: 1px solid #fafafa;
    .discountTitle {
      font-size: 16px;
      color: #303033;
      font-weight: 500;
      span {
        font-size: 12px;
        font-weight: 400;
        color: #939399;
      }
      .addBtn {
        width: 71px;
        height: 33px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(230, 230, 230, 1);
        color: #16ade9;
        text-align: center;
        display: inline-block;
        font-size: 12px;
        line-height: 33px;
        cursor: pointer;
      }
    }
  }
  .amzUpload {
    color: #16ade9;
  }
  .btBox {
    margin-left: 30px;
  }
  margin-top: 16px;
  &/deep/ .ivu-form .ivu-form-item-label {
    color: #666;
    font-size: 12px;
  }
  &/deep/ .ivu-table th {
    background-color: #f4f1f4;
    color: #626266;
    font-weight: 400;
  }
  &/deep/ .ivu-table-wrapper {
    overflow: initial;
  }
  &/deep/ .ivu-modal-footer {
    text-align: center;
    margin-top: 50px;
    border-top: 1px solid #e8eaec !important;
    padding-top: 15px !important;
  }
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
.remoteSaleHeader {
  text-align: center;
  font-size: 26px;
  color: #333333;
  padding: 10px;
  height: 60px;
  line-height: 30px;
}
.remoteSale {
  /deep/ .ivu-table-header {
    background: #ffffff !important;
  }
  /deep/ .ivu-modal-content {
    border-radius: 10px !important;
  }
  /deep/ .ivu-table:before {
    display: none !important;
  }
  /deep/ .ivu-table:after {
    display: none !important;
  }
}
/deep/ .remoteSale.ivu-table-wrapper {
  border: none !important;
}
.yuanchengxiaoshou {
  /deep/ .ivu-table td,
  .ivu-table th {
    border-right: 1px solid #e8eaec;
  }
  /deep/ .ivu-table-footer {
    height: 100px;
  }
  /deep/ .ivu-table-title {
    height: 60px !important;
  }
  .remoteSaleFooter {
    line-height: 22px;
    padding: 20px;
  }
  .red {
    color: rgb(237, 62, 62);
  }
  /deep/ .ivu-table-wrapper {
    border: none;
  }
  /deep/ .ivu-table:before,
  /deep/ .ivu-table:after {
    display: none;
  }
}
.otherPlatformBox {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 8px;
  img {
    width: 10px;
    height: 10px;
    cursor: pointer;
  }
  .num {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fa5555;
    line-height: 16px;
    margin-bottom: 7px;
  }
  .link {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #3e9dff;
    line-height: 12px;
    cursor: pointer;
    margin-top: 3px;
  }
}
.promptBg {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background: #fff1dd;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #666666ff;
  line-height: 17px;
  margin-bottom: 24px;
  span {
    color: #333333;
  }
}
</style>