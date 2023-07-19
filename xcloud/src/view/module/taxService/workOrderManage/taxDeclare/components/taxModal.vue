<template>
  <div class="modalCount"
       :style="contentStyleObj">
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
                  <span :class="taxType==index?'active':'' "
                        v-for="(item,index) in taxTypes"
                        @click="spanIndex(item.value)"
                        :key="index">{{item.name}}</span>
                </template>
                <!-- <template v-if="typeNow==2">
                  <span
                    :class="taxType==index?'active':'' "
                    v-for="(item,index) in taxTypes"
                    :key="index"
                  >{{item.name}}</span>
                </template> -->
              </div>
            </FormItem>
            <FormItem label="选择国家:"
                      prop="countryCode"
                      style="max-width:308px;">
              <Select v-model="addFrom.countryCode"
                      @on-change="changeCountry"
                      placeholder="请选择报税国家">
                <Option v-for="(item,index) in allcountryList"
                        :value="item.countryCode"
                        :key="index">{{ item.countryNameZh }}</Option>
              </Select>
            </FormItem>
            <FormItem label="税率:"
                      prop="taxRate"
                      style="max-width:308px;">
              <Select v-model="addFrom.taxRate"
                      placeholder="税率">
                <Option v-for="(item,index) in taxRateList"
                        :value="String(item.taxRate)"
                        :key="index">{{ item.taxRate }}%</Option>
              </Select>
            </FormItem>
            <FormItem class="haveCountry"
                      label="有税号国家:"
                      prop="tfnCountryCode">
              <span class="taxCountryBox"
                    v-for="(v,i) in checkedTaxCountry"
                    :key="i">{{v}}</span>
              <Button type="text"
                      @click="addCountry1"
                      v-if="typeNow!==2">+添加</Button>
            </FormItem>
            <FormItem label="亚马逊销售额文件:"
                      prop="amx_file_url">
              <Upload :action="fileUpload"
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
          </div>
          <div class="discountBox ">
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
        <Table :data="returnData"
               :columns="returnColumns"></Table>
        <!-- <p class="canDiscount">可抵扣金额: <span>{{currencySign}}{{returnTaxData.deductionAmt}}</span></p> -->
        <p class="canDiscount">最终缴纳税金:
          <span>{{currencySign}}{{returnTaxData.taxTotal}}</span>
        </p>
        <p class="canDiscount">可抵扣总税金:
          <span>{{currencySign}}{{deductionAmt}}</span>
        </p>
      </div>
    </div>
    <div style="clear:both;"></div>
    <div class="btBox">
      <Button type="primary"
              @click="checkTax"
              style="margin-right:10px">核算税金</Button>
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
  </div>
</template>
<script>
import { submitDeclare, uploadDeductInfo } from '@/api/taxService/workOrder.js'
import { getProduct, getTaxRate, taxCountry, calculationTax, submitTaxdate } from "@/api/taxService/taxModule.js"
export default {
  props: ['workId', 'serviceId'],
  data() {
    return {
      // 所有销售报告类型
      servicesId: this.$route.query.servicesId,
      allsaleType: [],
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
        { value: 1, name: "发出国" }
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
          title: '月份',
          render: (h, params) => {
            return h('span', params.row.month)
          }
        },
        {
          title: '含税销售额',
          render: (h, params) => {
            return h('span', this.currencySign + params.row.includTaxAmt)
          }
        },
        {
          title: '不含税销售额',
          render: (h, params) => {
            return h('span', this.currencySign + params.row.excludeTaxAmt)
          }
        },
        {
          title: '销项应缴税金',
          render: (h, params) => {
            return h('span', this.currencySign + params.row.taxAmt)
          }
        },
        // {
        //   title:'可抵扣金额',
        //   render:(h,params)=>{
        //     return h('span',this.currencySign+params.row.excludeTaxAmt)
        //   }
        // }
      ],
      returnTaxData: {},
      status: this.$route.params.status,
      rateList: {}
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
        //  if(res.code===0){
        //   res.data.map((v,i)=>{
        //     if(v.status==0){
        //       self.allcountryList.push(v)
        //     }
        //   })
        // }
      })
      getTaxRate().then(res => {
        if (res.code === 0) {
          // this.taxRateList=res.data.GB[0]
          this.rateList = res.data
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
      countryList.forEach((v, i) => {
        if (val === v) {
          this.taxRateList = this.rateList[val][0]
        }
      })
    },
    // tax type
    spanIndex(index) {
      this.taxType = index;
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
      if (this.addFrom.saleFileUrl == '') {
        this.$Message.info('请上传亚马逊销售额文件')
        return
      }
      if (this.addFrom.taxRate == '') {
        this.$Message.info('请选择税率')
        return
      }
      // this.addFrom.deductionItems=this.discountData
      calculationTax(this.addFrom).then(res => {
        if (res.code == 0) {
          this.currencySign = res.data.currencySign
          this.deductionAmt = res.data.deductionAmt
          this.returnData = res.data.taxInfoVo
          this.returnTaxData = res.data
        }
      })
    },
    //提交申报数据
    submit() {
      if (this.returnData.length == 0) {
        this.$Message.error("请先核算税金")
        return
      }
      let excludeTaxPrice = 0, includTaxPrice = 0
      this.returnData.map((v, i) => {
        excludeTaxPrice += v.excludeTaxAmt
        includTaxPrice += v.includTaxAmt
      })

      let obj = {
        allTaxPrice: this.returnTaxData.taxTotal,
        declareRule: this.addFrom.declareRule,
        deductionPrice: this.deductionAmt,
        excludeTaxPrice,
        includTaxPrice,
        servicesId: this.servicesId,
        taxRate: this.addFrom.taxRate
      }
      submitTaxdate(obj).then(res => {
        this.$router.push({
          path: "/work"
        })
        if (res.code === 0) {

        }
      })
    },
    //提交申报
    submitDeclare() {
      if (this.returnData.length == 0) {
        this.$Message.error("请先核算税金")
        return
      }
      this.uploadDeductInfo()
      let excludeTaxPrice = 0, includTaxPrice = 0
      this.returnData.map((v, i) => {
        excludeTaxPrice += v.excludeTaxAmt
        includTaxPrice += v.includTaxAmt
      })
      excludeTaxPrice = excludeTaxPrice.toFixed(2)
      includTaxPrice = includTaxPrice.toFixed(2)
      let params = {
        workId: this.workId,
        allTaxPrice: this.returnTaxData.taxTotal,
        deductionPrice: this.deductionAmt,
        excludeTaxPrice,
        includTaxPrice,
      }
      submitDeclare(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('提交成功')
          this.$emit('refresh')
        } else {
          this.$Message.warning(res.message)
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
    }

  },
  mounted() {
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
    font-family: 'PingFangSC-Medium,PingFang SC';
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
      background: url('../../../../../../assets/images/computedTax/checked.png')
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
</style>