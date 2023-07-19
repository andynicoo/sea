<template>
  <!-- 首页一键算税 -->
  <div class="modalCount notLogin">
    <div class="step1">
      <p class="title">计算税金</p>
      <div class="leftBox">
        <Form ref="addFrom"
              :model="addFrom"
              :rules="ruleAddFrom"
              label-position='left'
              class="leftForm">
          <div class="topLeft">
            <div class="flex">
              <FormItem label="选择国家:"
                        class="chooseCountry"
                        :label-width="120"
                        prop="countryCode"
                        v-if="addFrom.declareRule!=2">
                <Select v-model="addFrom.countryCode"
                        style="width: 200px;"
                        @on-change="changeCountry"
                        placeholder="请选择报税国家"
                        :disabled='isSelectCountry'>
                  <Option v-for="(item,index) in allcountryList"
                          :value="item.countryCode"
                          :key="index">{{ item.countryNameZh }}</Option>
                </Select>
              </FormItem>
              <FormItem label="税率:"
                        prop="taxRate"
                        :label-width="80"
                        v-if="addFrom.declareRule!=2">
                <Select v-model="addFrom.taxRate"
                        style="width: 200px;"
                        placeholder="请选择税率">
                  <Option v-for="(item,index) in taxRateList"
                          :value="String(item.taxRate)"
                          :key="index">{{ item.taxRate }}%</Option>
                </Select>
              </FormItem>
              <FormItem label="报税周期："
                        prop="periodType"
                        :label-width="120">
                <Select v-model="addFrom.periodType"
                        placeholder="请选择报税周期"
                        :disabled="isSelectCountry"
                        style="width:200px;">
                  <Option :value="item.status"
                          v-for="(item,index) in declareList"
                          :key="index">{{item.type}}</Option>
                </Select>
              </FormItem>
            </div>
            <div class="flex tooltip">
              <Tooltip max-width="300"
                       placement="right">
                <span class="tips-icon">?</span>
                <div slot="content"
                     class="info">
                  <p class="titleTip"> 说明</p>
                  <p class="ph">(1) 目的国原则：若目的国已注册 VAT,则需在目的国报税，若未注册，则可在发货国申报。 </p>
                  <p class="ph">(2) 发货国原则：在发货国家进行报税。</p>
                </div>
              </Tooltip>
              <FormItem label="计税方式:"
                        prop="declareRule"
                        :label-width="120">
                <RadioGroup v-model="addFrom.declareRule">
                  <Radio label="0">
                    <span style="float: right;margin-top: 3px;">目的国</span>
                  </Radio>
                  <Radio label="1">
                    <span style="float: right;margin-top: 3px;">发出国</span>
                  </Radio>
                  <Radio label="2"
                         v-if="isSelectCountry">零申报</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="亚马逊销售额文件:"
                        :label-width="190"
                        prop="saleFileUrl">
                <Upload ref="upload"
                        :action="fileUpload"
                        :data="{prefix:''}"
                        :on-success="(res,file,fileList)=>{handleAmzSuccess(res,file,fileList)}"
                        :on-remove="(file,fileList)=>{handleAmzRemoveFile (file,fileList)}"
                        :format="['xls','xlsx','csv','txt']"
                        :on-format-error="handleFormatError"
                        :before-upload="handleAmzBeforeUpload">
                  <Button icon="ios-cloud-upload-outline"
                          style="margin-top: 2px;"
                          class="amzUpload btnfile">请上传店铺销售文件</Button>
                </Upload>
                <div class="howToGet"
                     @click="getContentModel = true">
                  如何获取？
                  <span class="line"></span>
                </div>
              </FormItem>
              <FormItem style="width:185px;">
              </FormItem>
            </div>
            <div class="flex countryList">
              <FormItem style="display:flex;"
                        label="VAT国家（已注册）："
                        prop="tfnCountryCode">
                <CheckboxGroup v-model="addFrom.tfnCountryCode">
                  <Checkbox label="GB">
                    <img class="countryFlag"
                         src="../../../assets/images/common/GBflag.png"
                         alt="">
                    <span class="countryName">英国</span>
                  </Checkbox>
                  <Checkbox label="DE">
                    <img class="countryFlag"
                         src="../../../assets/images/common/DEflag.png"
                         alt="">
                    <span class="countryName">德国</span>
                  </Checkbox>
                  <Checkbox label="FR">
                    <img class="countryFlag"
                         src="../../../assets/images/common/FGflag.png"
                         alt="">
                    <span class="countryName">法国</span>
                  </Checkbox>
                  <Checkbox label="IT">
                    <img class="countryFlag"
                         src="../../../assets/images/common/ITflag.png"
                         alt="">
                    <span class="countryName">意大利</span>
                  </Checkbox>
                  <Checkbox label="ES">
                    <img class="countryFlag"
                         src="../../../assets/images/common/XBYflag.png"
                         alt="">
                    <span class="countryName">西班牙</span>
                  </Checkbox>
                  <Checkbox label="CZ">
                    <img class="countryFlag"
                         src="../../../assets/images/common/JKflag.png"
                         alt="">
                    <span class="countryName">捷克</span>
                  </Checkbox>
                  <Checkbox label="PL">
                    <img class="countryFlag"
                         src="../../../assets/images/common/BLflag.png"
                         alt="">
                    <span class="countryName">波兰</span>
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </div>
            <div class="discountBox"
                 v-if="addFrom.declareRule!=2">
              <p class="discountTitle clearfix"> 抵扣项 <span>（如有抵扣项，可进行上传）</span>
                <span icon="ios-cloud-upload-outline"
                      class="addBtn fr amzUpload"
                      @click="addDiscount"><img src="../../../assets/images/common/addItem.png"
                       alt=""><span>添加抵扣项</span></span>
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
                    <Button icon="ios-cloud-upload-outline"
                            class="amzUpload btnfile"
                            style="margin-top: 10px;">请上传抵扣凭证</Button>
                  </Upload>
                </template>
              </Table>
            </div>
          </div>
        </Form>
      </div>
      <div class="btBox">
        <Button type="primary"
                @click="checkTax"
                v-if="addFrom.declareRule!=2">核算税金</Button>
        <Button @click="submit"
                v-if="servicesId!=undefined"
                style="margin-left:15px;">提交</Button>
        <Button @click="reset('addFrom')"
                icon="ios-refresh-circle-outline"
                v-if="servicesId==undefined"
                style="margin-left:15px;">重置</Button>
      </div>
    </div>
    <div class="step2">
      <div class="step2_content">
        <p class="title">税金计算结果</p>
        <div class="resultBox">
          <Table :data="returnData"
                 max-height="300"
                 :columns="returnColumns"></Table>
          <!-- <div style="background-color: #FFFFFF;" class="finalTaxPayment">
             <p class="canDiscount top">可抵扣总税金: <span class="red">{{currencySign}}{{deductionAmt}}</span></p>
             <p class="canDiscount bottom">最终缴纳税金: <span class="red">{{currencySign}}{{returnTaxData.taxTotal}}</span></p>
           </div> -->
        </div>
        <div class="resultMoney">
          <Row>
            <Col span="6"><span>含税销售总额：</span><span class="money">{{currencySign}}{{returnTaxData.includTaxAmtTotal}}</span></Col>
            <Col span="6"><span>不含税销售总额：</span><span class="money">{{currencySign}}{{returnTaxData.excludeTaxAmtTotal}}</span></Col>
            <Col span="6"><span>销项税额：</span><span class="money">{{currencySign}}{{returnTaxData.includTaxAmtTotal}}</span></Col>
            <Col span="6"><span>抵扣金额：</span><span class="money">{{currencySign}}{{returnTaxData.deductionAmt}}</span></Col>
          </Row>
          <p class="finallyMoney">
            <span>最终缴纳金额</span><span class="red">{{currencySign}}{{returnTaxData.taxTotal}}</span>
          </p>
        </div>
      </div>
    </div>
    <div style="clear:both;"></div>
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
                <!-- <Checkbox v-model="countries">item.countryName</Checkbox> -->
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
    <Modal class-name="getContentModel"
           v-model="getContentModel">
      <div>
        <img style="width: 100%;"
             src="../../../assets/images/common/modelImg1.png"
             alt="">
      </div>
      <div slot="footer"
           style="text-align:center;">
        <Button style="margin-top:20px;"
                class="footerBt"
                type="primary"
                :loading="loadingget"
                @click="getContentModel = false">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getProduct, getTaxRate, taxCountry, calculationTax, submitTaxdate, submitTaxDiscount, calculationTaxSaleIndexPage } from "@/api/taxModule"
import { baseInfoByCondition } from "@/api/taxModule";
export default {
  data() {
    return {
      // 所有销售报告类型
      servicesId: this.$route.query.servicesId,
      allsaleType: [],
      getContentModel: false, // 如何获取按钮 弹窗
      loadBtnAuto: false, // 自动计算loading
      loadClient: false, // 客户确认loading
      loadNext: false,
      stepIndex: 0, // 步骤
      giveFrom: {},
      ifE: false, // 是否英国
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
      social: ["facebook", "github"],
      modelAddCom: false,
      loadingget: false,
      loadingRemark: false,
      currency: "", // 货币单位
      defaultList: [],
      uploadList: [],
      imgName: "",
      visible: false,
      fileUpload: this.ImgUrl,
      // action
      addFrom: {
        countryCode: this.$route.query.countryCode,
        declareRule: 0,
        saleFileUrl: '',
        taxRate: '',
        tfnCountryCode: [],
        workNo: '',
        periodType: String(this.$route.query.periodType)
      },
      ruleAddFrom: {
        declareRule: { required: 'true', message: '请选择计税方式', trigger: 'change' },
        countryCode: { required: 'true', message: '请选择需要报税的国家', trigger: 'change' },
        taxRate: { required: 'true', message: '请选择税率', trigger: 'change' },
        saleFileUrl: { required: 'true', message: '请上传亚马逊销售额文件', trigger: 'change' },
        periodType: { required: 'true', message: '请选择报税周期', trigger: 'change' },
        tfnCountryCode: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "至少选择一个VAT国家",
            trigger: "change"
          }
        ]
      },
      allFacilitator: "",
      taxType: 0,
      // all country
      allcountryList: [],
      allcountryList1: [],
      taxTypes: [
        { value: 0, label: "目的国" },
        { value: 1, label: "发出国" }
        // { value: 2, name: "零申报" }
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
          title: '抵扣金额',
          render: (h, params) => {
            return h('Input', {
              props: {
                value: params.row.deductiontAmt,
                size: 'small',
                placeholder: this.addFrom.countryCode == "GB" ? "GBP" : "EUR"
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
          val: '其它',
          label: '3'
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
          }
        },
        {
          title: '发出国',
          key: 'departCode'
        },
        {
          title: '到货国',
          key: 'arrivalCode'
        },
        {
          title: '币种',
          key: 'currency'
        },
        {
          title: '汇率',
          key: 'rate'
        },
        {
          title: '含税销售额',
          render: (h, params) => {
            return h('span', this.currencySign + params.row.includTaxPrice)
          }
        },
      ],
      returnTaxData: {},
      rateList: {},
      taxTypeRadio: '',
      isLogin: false,
      isSelectCountry: false,
      declareList: [],
      nowPath: this.$route.path,
    };
  },
  created() {
    if (localStorage.getItem('sessionId') && localStorage.getItem('token')) {
      this.isLogin = true
    }
  },
  methods: {
    getInfo(countryCode) {
      //获取申报周期
      this.declareList = []
      baseInfoByCondition({ countryCode })
        .then(res => {
          if (res.code == 0) {
            this.vatNumberPrefix = res.data.vatNumberPrefix;
            this.vatNumberSuffixDigitLength =
              res.data.vatNumberSuffixDigitLength;
            let data = res.data
            if (data.monthPeriod === 0)
              this.declareList.push({ type: "月报", status: "0" });
            if (data.quarterPeriod === 0)
              this.declareList.push({ type: "季报", status: "1" });
            if (data.yearPeriod === 0)
              this.declareList.push({ type: "年报", status: "2" });
          }
        })
    },
    getBaseInfo() {
      const self = this
      this.allcountryList = []
      getProduct({ functionCode: 2 }).then(res => {
        if (res.code === 0) {
          res.data.map((v, i) => {
            if (v.status == 0) {
              self.allcountryList.push(v)
            }
          })
        }
      })
      getTaxRate().then(res => {
        if (res.code === 0) {
          // console.log(res.data)
          // this.taxRateList=res.data.GB[0]
          this.rateList = res.data
          this.changeCountry(this.$route.query.countryCode)
        }
      })
      taxCountry().then(res => {
        if (res.code === 0) {
          this.allcountryList1 = res.data
        }
      })
    },
    changeCountry(val) {
      let countryList = Object.getOwnPropertyNames(this.rateList)
      countryList.map((v, i) => {
        if (val === v) {
          this.taxRateList = this.rateList[val][0]
        }
      })
      if (val != undefined) {
        this.getInfo(val)
      }
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
    handleAmzRemoveFile() {
      this.addFrom.saleFileUrl = ''
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
      if (typeof row == 'number') {
        this.discountData[row].deductionFile = ''
        this.discountData[row].fileOriginalName = ''
        return
      }
      this.discountData[row._index].deductionFile = ''
      this.discountData[row._index].fileOriginalName = ''
    },
    //核算税金
    checkTax() {
      this.addFrom.deductionItems = this.discountData
      if (this.addFrom.countryCode == undefined) {
        this.$Message.info('请选择国家')
        return
      }
      if (this.addFrom.taxRate == '') {
        this.$Message.info('请选择税率')
        return
      }
      let data = { ...this.addFrom }
      if (this.addFrom.periodType === 'undefined') {
        data.periodType = -1
      }
      this.$refs['addFrom'].validate((valid) => {
        if (valid) {
          if (this.addFrom.saleFileUrl == '') {
            this.$Message.info('请上传亚马逊销售额文件')
            return
          }
          calculationTaxSaleIndexPage(this.addFrom).then(res => {
            if (res.code == 0) {
              this.currencySign = res.data.currencySign
              this.deductionAmt = res.data.deductionAmt
              this.returnData = res.data.saleCheckInfos
              this.returnTaxData = res.data
            }
          })
        }
      })
    },
    //提交申报数据
    submit() {
      const validate = this.verifyPaymentInsert(this.discountData)
      if (this.returnData.length == 0 && this.addFrom.declareRule != 2) {
        this.$Message.error("请先核算税金")
        return
      }
      let excludeTaxPrice = 0, includTaxPrice = 0
      this.returnData.map((v, i) => {
        excludeTaxPrice += v.excludeTaxAmt
        includTaxPrice += v.includTaxAmt
      })
      let params = {}
      if (this.addFrom.declareRule == 2) {
        params = {
          serviceId: this.servicesId,
          allTaxPrice: 0,
          deductionPrice: 0,
          excludeTaxPrice: 0,
          includTaxPrice: 0,
          listTaxDeductionItem: [],
          sellFile: '',
          declareRule: this.addFrom.declareRule,
          taxRate: this.addFrom.taxRate
        }
      } else {
        excludeTaxPrice = excludeTaxPrice.toFixed(2)
        includTaxPrice = includTaxPrice.toFixed(2)
        params = {
          serviceId: this.servicesId,
          allTaxPrice: this.returnTaxData.taxTotal,
          deductionPrice: this.deductionAmt,
          excludeTaxPrice,
          includTaxPrice,
          listTaxDeductionItem: [],
          sellFile: this.addFrom.saleFileUrl,
          declareRule: this.addFrom.declareRule,
          taxRate: this.addFrom.taxRate
        }
      }
      if (!validate.flag) {
        this.$Message.info('请填写完整抵扣项金额')
        return
      } else if (validate.flag && validate.isEmpty) {
        params.listTaxDeductionItem = []
      } else if (validate.flag && !validate.isEmpty) {
        params.listTaxDeductionItem = this.discountData
      }
      // console.log(params)
      // return
      submitTaxdate(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('提交成功')
          this.$router.push({ path: "/work" })
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
      arr.map(item => {
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
    // 重置
    reset(name) {
      this.discountData = [];
      this.returnTaxData = {}
      this.currencySign = ''
      this.deductionAmt = ''
      this.returnData = [];
      this.$refs['giveFrom'].resetFields()
      this.$refs[name].resetFields();
      this.checkedTaxCountry = [];
      this.$refs.upload.clearFiles();
      this.AmzFileList = [];
      this.addFrom.tfnCountryCode = [];
    }
  },
  mounted() {
    this.contentStyleObj.height = window.screen.height + "px";
    if (this.addFrom.countryCode != undefined) {
      this.isSelectCountry = true
      this.getInfo(this.addFrom.countryCode)
    }
    this.getBaseInfo()
  }
};
</script>
<style lang="less" scoped>
// @import '../../../assets/font/font.css';
.modalCount {
  background-color: #fff;
  .title {
    font-size: 16px;
    font-weight: 500;
    padding: 18px 0 18px 0;
    border-bottom: 1px solid #e6e6e6;
    color: #303033;
    font-family: "Microsoft Yahei", "PingFangSC-Medium,PingFang SC";
  }
  .step1,
  .step2 {
    padding-bottom: 20px;
  }
  .step1 {
    width: 100%;
  }
  .step2 {
    .resultBox {
      margin-top: 28px;
      min-height: 506px;
      padding: 30px;
      .finalTaxPayment {
        background-color: rgb(255, 255, 255);
        height: 110px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 24px 16px;
        margin-top: 30px;
        p {
          margin: 0px;
        }
        .top {
          font-size: 20px;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          .red {
            font-weight: bold;
            color: rgba(237, 62, 62, 1);
          }
          // margin-bottom: 20px;
        }
        .bottom {
          font-size: 22px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          margin-top: 5px;
          .red {
            font-size: 28px;
            font-family: NotoSansHans;
            font-weight: bold;
            color: rgba(237, 62, 62, 1);
          }
        }
      }
      .canDiscount {
        font-size: 12px;
        margin-top: 12px;
        color: #303033;
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
    // background-color: #fcf9fc;
    padding-top: 22px;
    border: 1px solid #eeeeee;
    // margin-top: 50px;
    .discountTitle {
      font-size: 16px;
      color: #303033;
      font-weight: 500;
      letter-spacing: 1px;
      span {
        font-family: sans-serif;
        font-size: 12px;
        font-weight: 400;
        color: #939399;
      }
      .addBtn {
        width: 120px;
        height: 33px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid #16ade9;
        color: #16ade9;
        text-align: center;
        display: inline-block;
        font-size: 14px;
        line-height: 32px;
        border-radius: 5px;
        cursor: pointer;
        span {
          color: #16ade9;
          font-size: 14px;
          margin-right: 5px;
          margin-top: 1px;
        }
        img {
          width: 18px;
          height: 18px;
          margin-top: 6px;
          float: left;
          margin-left: 10px;
        }
      }
    }
  }
  .amzUpload {
    color: #16ade9;
  }
  .amzUpload.btnfile {
    background: #ffffff;
    color: #16ade9;
    border: 1px solid #16ade9;
  }
  .btBox {
    text-align: center;
    margin: 30px;
  }
  .countryFlag {
    width: 26px;
    height: 28px;
    margin-left: 5px;
    margin-right: 3px;
  }
  .countryName {
    height: 17px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 18px;
  }
  .countryList {
    &/deep/ .ivu-form-item-content {
      .ivu-checkbox-group {
        display: flex;
        margin-top: 4px;
      }
      .ivu-checkbox {
        width: 16px;
        height: 16px;
        .ivu-checkbox-inner {
          width: 100%;
          height: 100%;
          margin-top: 1px;
          &::after {
            width: 5px;
            height: 12px;
            top: 0px;
            left: 5px;
          }
        }
      }
    }
  }
  margin-top: 16px;
  &/deep/ .ivu-form .ivu-form-item-label {
    color: #333333;
    font-size: 16px;
    letter-spacing: 1px;
    font-weight: bold;
    &::before {
      color: #f51313;
    }
  }
  &/deep/ .ivu-checkbox-wrapper {
    display: flex;
    align-items: center;
    margin-right: 30px;
  }
  .tooltip {
    position: relative;
    &/deep/ .ivu-tooltip {
      position: absolute;
      left: -20px;
      top: 11px;
      .tips-icon {
        width: 16px;
        height: 16px;
        background: #f79728;
        border-radius: 50%;
        color: #ffffff;
        display: block;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
      }
      .ivu-tooltip-content {
        .ivu-tooltip-arrow {
          background: #ffffff;
          border-right-color: #f79728;
          // border-top-color: #F79728;
          // border-left-color: #F79728;
          // border-bottom-color: #F79728;
        }
        .ivu-tooltip-inner {
          background: #feffe8;
          border-color: #feffe8;
          box-shadow: none;
          border: 1px solid #fae3a4;
          color: #666666;
          font-size: 16px;
        }
      }
    }
    .info {
      font-size: 14px;
      white-space: normal;
      width: 270px;
      height: 150px;
      .titleTip {
        width: 37px;
        height: 16px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 18px;
        margin: 5px 0px 10px 0px;
      }
      .ph {
        font-size: 14px;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 26px;
      }
    }
  }
  &/deep/ .ivu-form-item-content {
    .howToGet {
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 206px;
      width: 90px;
      height: 15px;
      font-size: 16px;
      font-weight: 400;
      color: #f79728;
      line-height: 14px;
      transform: translateY(-50%);
      .line {
        position: absolute;
        top: 17px;
        left: 0px;
        height: 1px;
        width: 73px;
        background: #f79728;
      }
    }
    .ivu-upload {
      .ivu-upload-list {
        position: absolute;
        width: 275px;
        top: 0px;
        left: 300px;
        margin-top: 0px;
        .ivu-upload-list-file {
          line-height: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 5px;
        }
      }
    }
  }
  &/deep/ .ivu-radio-wrapper {
    color: #333333;
  }
  &/deep/ .ivu-table th {
    background-color: #ecf0f6 !important;
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
  &/deep/ .ivu-radio {
    margin-top: 4px;
  }
  &/deep/ .ivu-table-cell {
    font-size: 16px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  &/deep/ .ivu-radio-checked {
    span {
      background-color: #ffffff !important;
      &:after {
        background-color: #019dfa !important;
        width: 8px;
        height: 8px;
        left: 3px;
        top: 3px;
      }
    }
  }
  &/deep/ .ivu-icon-ios-cloud-upload-outline:before {
    font-weight: bold;
    font-size: 17px;
  }
  &/deep/ .ivu-icon-ios-calculator-outline:before {
    font-size: 16px;
  }
  &/deep/ .ivu-radio-checked {
    span {
      background-color: #ffffff !important;
      &:after {
        background-color: #019dfa !important;
        width: 8px;
        height: 8px;
        left: 3px;
        top: 3px;
      }
    }
  }
}
&/deep/ .getContentModel {
  .ivu-modal-content {
    height: 560px;
    overflow-y: auto;
    border-radius: 13px !important;
    padding: 10px 20px;
    .ivu-modal-header {
      background: #ffffff !important;
      padding: 14px 0px;
      .ivu-modal-header-inner {
        color: #333333;
        &::before {
          content: "";
          border-left: 3px solid #16ade9;
          margin-right: 6px;
        }
      }
    }
    .ivu-modal-body {
      .modelTitle {
        font-size: 14px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 18px;
        margin: 15px 0px;
      }
    }
    .ivu-modal-close {
      i {
        font-size: 43px;
      }
    }
    .ivu-modal-footer {
      .footerBt {
        width: 100px;
        height: 37px;
      }
    }
  }
}
.hasLogin {
  padding-left: 24px;
  background: #f6f6f6;
  margin-top: 0px;
  .step1 {
    padding-bottom: 0px;
    .btBox {
      margin: 0px;
      background: #ffffff;
      padding: 15px;
      text-align: left;
    }
    .chooseCountry {
      margin: 0px 45px;
    }
  }
  .step1,
  .step2 {
    .title {
      margin-top: 15px;
      background: #ffffff;
      border-bottom: none;
      padding-left: 15px;
      &::before {
        content: "";
        border-left: 2px solid #16ade9;
        width: 2px;
        height: 9px;
        padding-left: 15px;
      }
    }
  }
  .leftBox {
    background: #ffffff;
    border: none;
    padding: 10px;
  }
  .topLeft {
    margin: 10px;
    &/deep/ .ivu-form-item {
      margin-bottom: 22px;
    }
  }
  &/deep/ .ivu-table-wrapper-with-border {
    border: none;
  }
  &/deep/ .ivu-table-border:after {
    width: 0px;
  }
  &/deep/ .ivu-table-border td,
  .ivu-table-border th {
    border: none;
  }
  .step2 {
    .resultBox {
      padding: 0px;
    }
  }
  &/deep/ .ivu-table td {
    background: #ffffff;
    border: none;
    padding-left: 20px;
    padding-top: 10px;
  }
  &/deep/ .ivu-table th {
    background: #eeeeee;
    border: none;
    padding-left: 20px;
  }
  &/deep/ .ivu-input {
    height: 32px;
  }
}
.notLogin {
  .step1 {
    max-width: 1200px;
    margin: auto;
    .title {
      text-align: center;
      color: #333333;
      font-size: 24px;
      border-color: #f0f0f0;
      padding: 18px 0 30px 0;
    }
  }
  .step2 {
    background: #f6f8fb;
    .title {
      text-align: center;
      color: #333333;
      font-size: 24px;
      border-bottom: 0px;
      padding: 25px 0px;
    }
    .resultBox {
      min-height: auto;
      margin-top: 0px;
      padding: 0px 30px 20px;
    }
    .step2_content {
      max-width: 1200px;
      margin: auto;
      // .title {
      //   font-size:18px;
      //   color: #333333;
      //   font-weight:bold;
      //   margin-bottom: 28px;
      // }
      .resultMoney {
        padding: 20px 0px;
        margin: 0px 30px;
        background: #ffffff;
        margin-top: 30px;
        .saleTitle {
          font-size: 18px;
          color: #666666;
        }
        span {
          padding-left: 30px;
          font-size: 17px;
          color: #333333;
        }
        span.money {
          padding-left: 0px;
        }
        .finallyMoney {
          margin-top: 13px;
          span {
            font-size: 17px;
            color: #333333;
          }
          .red {
            color: #ed3e3e;
            font-size: 22px;
            font-weight: bold;
          }
        }
      }
    }
  }

  .leftBox {
    border: none;
    .topLeft {
      margin: 30px 0px 20px 0px;
      .flex {
        justify-content: space-between;
        margin-bottom: 10px;
      }
    }
  }
  &/deep/ .amzUpload {
    background: #16ade9;
    color: #ffffff;
    font-size: 14px;
    border: none;
    .ivu-icon-ios-cloud-upload-outline:before {
      font-weight: bold;
    }
  }
  &/deep/ .addBtn {
    .ivu-icon-ios-calculator-outline:before {
      font-size: 16px;
    }
  }
  &/deep/ .ivu-table td {
    background: #ffffff;
    border: none;
    padding-left: 20px;
    padding-top: 10px;
  }
  &/deep/ .ivu-table th {
    background: #eeeeee;
    border: none;
    padding-left: 20px;
  }
  &/deep/ .ivu-input {
    height: 32px;
  }
  &/deep/ .ivu-table-wrapper-with-border {
    border: none;
  }
  &/deep/ .ivu-table-border:after {
    width: 0px;
  }
  &/deep/ .ivu-table:before {
    height: 0px;
  }
}
</style>
