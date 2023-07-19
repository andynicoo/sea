<template>
  <!-- 英国的计算税金 -->
  <div class="modalCount"
       :class="[isLogin == true&&nowPath!='/en/aboutComputed/' ? 'hasLogin' : 'notLogin']">
    <div class="step1">
      <p class="title"
         v-if="isLogin == true&&nowPath!='/en/aboutComputed/'">待提交申报资料</p>
      <p class="title"
         v-else>Calculate Taxes</p>
      <div class="notice">
        <p>Note：When you submit this VAT information you are making a legal declaration that the information is true and complete. A false declaration can result in prosecution.</p>
      </div>
      <div class="leftBox">
        <div v-if="isLogin == true&&nowPath!='/en/aboutComputed/'">
          <div class="tab-box">
            <span class="active-tab">税号信息</span>
            <span>注册信息</span>
          </div>
          <div class="tax-title">税号信息</div>
          <div class="taxNumber-box"
               v-if="JSON.stringify(taxNumInfo)!='{}'">
            <Row>
              <Col span="12">
              <span class="tax-info-name">公司中文名称</span>
              <span class="tax-info-value">{{taxNumInfo.companyNameZh}}</span>
              </Col>
              <Col span="12">
              <span class="tax-info-name">VAT税号</span>
              <span class="tax-info-value">{{taxNumInfo.vatTaxNumber}}</span>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <span class="tax-info-name">公司英文名称</span>
              <span class="tax-info-value">{{taxNumInfo.companyNameEn}}</span>
              </Col>
              <Col span="12">
              <span class="tax-info-name">税金到账截止日期</span>
              <span class="tax-info-value date-color"></span>
              </Col>
            </Row>
            <Row>
              <Col span="12">
              <span class="tax-info-name">申报区间</span>
              <span class="tax-info-value date-color">{{taxNumInfo.beginTime!=''?taxNumInfo.beginTime.slice(0,10):''}}至{{taxNumInfo.endTime!=''?taxNumInfo.endTime.slice(0,10):''}}</span>
              </Col>
            </Row>
          </div>
        </div>
        <div class="tax-title">Calculate Taxes</div>
        <Form ref="addFrom"
              :model="addFrom"
              :rules="ruleAddFrom"
              label-position='left'
              class="leftForm">
          <div class="topLeft">
            <Row>
              <Col :span="8">
              <FormItem label="Country:"
                        class="chooseCountry"
                        :label-width="120"
                        prop="countryCode"
                        v-if="addFrom.declareRule!=2">
                <Select v-model="addFrom.countryCode"
                        style="width: 200px;"
                        @on-change="changeCountry"
                        placeholder="Please Enter"
                        :disabled='isSelectCountry'>
                  <Option v-for="(item,index) in allcountryList"
                          :value="item.countryCode"
                          :key="index">{{ item.countryNameZh }}</Option>
                </Select>
              </FormItem>
              </Col>
              <Col :span="8">
              <FormItem label="Tax Rate:"
                        prop="taxRate"
                        :label-width="100"
                        v-if="addFrom.declareRule!=2">
                <Select v-model="addFrom.taxRate"
                        style="width: 200px;"
                        placeholder="Please Enter">
                  <Option v-for="(item,index) in taxRateList"
                          :value="String(item.taxRate)"
                          :key="index">{{ item.taxRate }}%</Option>
                </Select>
              </FormItem>
              </Col>
              <Col :span="8">
              <FormItem label="Tax Filing Cycle："
                        prop="periodType"
                        style="margin-bottom:margin-bottom: 5px;"
                        :label-width="170">
                <Select v-model="addFrom.periodType"
                        placeholder="Please Enter"
                        :disabled="isSelectCountry"
                        style="width:200px;">
                  <Option :value="item.status"
                          v-for="(item,index) in declareList"
                          :key="index">{{item.type}}</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="16">
              <div class=" tooltip">
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
              </div>
              <FormItem label="Tax Calculation Method:"
                        prop="declareRule"
                        :label-width="240">
                <RadioGroup v-model="addFrom.declareRule">
                  <Radio label="0">
                    <span style="float: right;margin-top: 3px;">Receiving Country</span>
                  </Radio>
                  <Radio label="1"
                         v-if="addFrom.countryCode!='SA'&&addFrom.countryCode!='AE'">
                    <span style="float: right;margin-top: 3px;">Country of Shipment</span>
                  </Radio>
                  <Radio label="2"
                         v-if="isSelectCountry">Zero tax</Radio>
                </RadioGroup>
              </FormItem>
              </Col>
              <Col :span="8">
              <FormItem label="Sales platform："
                        prop="salePlatformType"
                        :label-width="150"
                        v-if="addFrom.countryCode=='SA'&&addFrom.declareRule!='2'">
                <Select v-model="addFrom.salePlatformType"
                        placeholder="Please Enter"
                        style="width:200px;">
                  <Option :value="item.key"
                          v-for="(item,index) in salesListSA"
                          :key="index">{{item.value}}</Option>
                </Select>
              </FormItem>
              <FormItem label="Sales platform："
                        prop="salePlatformType"
                        :label-width="150"
                        v-if="addFrom.countryCode=='AE'&&addFrom.declareRule!='2'">
                <Select v-model="addFrom.salePlatformType"
                        placeholder="Please Enter"
                        style="width:200px;">
                  <Option :value="item.key"
                          v-for="(item,index) in salesListAE"
                          :key="index">{{item.value}}</Option>
                </Select>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="16">
              <FormItem label="Sales Data:"
                        :label-width="120"
                        prop="saleFileUrl"
                        v-if="addFrom.declareRule!='2'">
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
                          class="amzUpload btnfile">Upload Store Sales Data</Button>
                </Upload>
                <div class="howToGet"
                     @click="getContentModel = true">
                  How To Get？
                  <span class="line"></span>
                </div>
              </FormItem>
              </Col>
            </Row>
            <div class="flex-between countryList">
              <FormItem label="Countries Where VAT Has a Tax Number："
                        prop="tfnCountryCode">
                <CheckboxGroup v-model="addFrom.tfnCountryCode">
                  <Checkbox label="GB">
                    <img class="countryFlag"
                         src="../../../assets/images/common/GBflag.png"
                         alt="">
                    <span class="countryName">UK</span>
                  </Checkbox>
                  <Checkbox label="DE">
                    <img class="countryFlag"
                         src="../../../assets/images/common/DEflag.png"
                         alt="">
                    <span class="countryName">Germany</span>
                  </Checkbox>
                  <Checkbox label="FR">
                    <img class="countryFlag"
                         src="../../../assets/images/common/FGflag.png"
                         alt="">
                    <span class="countryName">Italy</span>
                  </Checkbox>
                  <Checkbox label="IT">
                    <img class="countryFlag"
                         src="../../../assets/images/common/ITflag.png"
                         alt="">
                    <span class="countryName">France</span>
                  </Checkbox>
                  <Checkbox label="ES">
                    <img class="countryFlag"
                         src="../../../assets/images/common/XBYflag.png"
                         alt="">
                    <span class="countryName">Spain</span>
                  </Checkbox>
                  <Checkbox label="CZ">
                    <img class="countryFlag"
                         src="../../../assets/images/common/JKflag.png"
                         alt="">
                    <span class="countryName">Czech</span>
                  </Checkbox>
                  <Checkbox label="PL">
                    <img class="countryFlag"
                         src="../../../assets/images/common/BLflag.png"
                         alt="">
                    <span class="countryName">Poland</span>
                  </Checkbox>
                </CheckboxGroup>
              </FormItem>
            </div>
            <div class="discountBox"
                 v-if="addFrom.declareRule!=2">
              <p class="discountTitle clearfix"> Deductions
                <span icon="ios-cloud-upload-outline"
                      class="addBtn fr amzUpload"
                      @click="addDiscount"><img src="../../../assets/images/common/addItem.png"
                       alt="">
                  <span>Add Deduction</span>
                </span>
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
                  <div class="uploadBox flex">
                    <Upload :action="fileUpload"
                            :data="{prefix:''}"
                            :on-success="(res,file,fileList)=>{handleSuccess(res,file,fileList,row)}"
                            :on-remove="(file,fileList)=>{handleRemoveFile (file,fileList,row)}"
                            :format="['pdf','jpg','png']"
                            :on-format-error="handleFormatErrors">
                      <Button icon="ios-cloud-upload-outline"
                              class="amzUpload btnfile"
                              style="margin-top: 10px;">Upload</Button>
                    </Upload>
                    <span class="close"
                          @click="deleteItem(row)">
                      <img src="@/assets/images/common/close.png"
                           alt="">
                    </span>
                  </div>
                </template>
              </Table>
            </div>
          </div>
        </Form>
      </div>
      <div class="btBox">
        <Button type="primary"
                @click="checkTax"
                v-if="addFrom.declareRule!=2">Calculate Taxes</Button>
        <Button @click="sureSubmit"
                v-if="servicesId!=undefined"
                style="margin-left:15px;">提交</Button>
        <Button @click="reset('addFrom')"
                icon="ios-refresh-circle-outline"
                v-if="servicesId==undefined"
                style="margin-left:15px;">Reset</Button>
      </div>
    </div>
    <div class="step2">
      <div class="step2_content">
        <p class="title">Tax Calculation Result</p>
        <div class="resultMoney">
          <Row>
            <Col span="6">
            <span>Tax Included Sales：</span>
            <span class="money">{{currencySign}}{{returnTaxData.includTaxAmtTotal}}</span>
            </Col>
            <Col span="6">
            <span>Sales Without Tax：</span>
            <span class="money">{{currencySign}}{{returnTaxData.excludeTaxAmtTotal}}</span>
            </Col>
            <Col span="6">
            <span>Output Tax：</span>
            <span class="money">{{currencySign}}{{returnTaxData.taxAmtTotal}}</span>
            </Col>
            <Col span="6">
            <span>Deduction Amount ：</span>
            <span class="money">{{currencySign}}{{returnTaxData.deductionAmt}}</span>
            </Col>
          </Row>
          <p class="finallyMoney">
            <span>
              Final Payment Amount：
            </span>
            <span class="red">
              {{currencySign}}{{returnTaxData.taxTotal}}
            </span>
          </p>
        </div>
        <div class="resultBox">
          <p class="jisuanshuijin clearfix">
            <span>Tax Details</span>
            <Button class="fr"
                    @click="downLoadTaxDetail"
                    v-if="(returnData.length>0||returnDataAE.length>0)&&isLogin == true&&nowPath!='/aboutComputed'">下载明细</Button>
          </p>
          <Table :data="returnData"
                 max-height="300"
                 :columns="returnColumns"
                 no-data-text="no data"
                 v-if="addFrom.countryCode!='SA'&&addFrom.countryCode!='AE'"></Table>
          <Table :data="returnDataAE"
                 max-height="300"
                 :columns="returnColumnsAE"
                 v-if="addFrom.countryCode=='AE'"></Table>
          <div v-if="returnData.length > 0 && addFrom.declareRule !== '2' && servicesId !== undefined">
            <div class="jiankong normal"
                 v-if="returnTaxData.status === 0 && returnDataSale.length > 0">
              <span class="JkTitle">
                远程销售额监控
              </span>
              <span class="status"
                    @click="getStatus()"><img src="../../../assets/images/common/blueStatus.png"
                     alt="">正常 >> </span>
            </div>
            <div class="jiankong unnormal"
                 v-if="returnTaxData.status === 1 && returnDataSale.length > 0">
              <span class="JkTitle">
                远程销售额监控
              </span>
              <span class="status"
                    @click="getStatus()"><img src="../../../assets/images/common/redStatus.png"
                     alt="">异常 >></span>
            </div>
          </div>
          <!-- <div style="background-color: #FFFFFF;" class="finalTaxPayment">
             <p class="canDiscount top">可抵扣总税金: <span class="red">{{currencySign}}{{deductionAmt}}</span></p>
             <p class="canDiscount bottom">最终缴纳税金: <span class="red">{{currencySign}}{{returnTaxData.taxTotal}}</span></p>
           </div> -->
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
    <Modal v-model="submitModal"
           :title="addFrom.declareRule=='2'?'是否确认零申报？':'请确认您的申报数据'"
           :width="616"
           class="submit-box">
      <div class="taxNumber-box"
           v-if="JSON.stringify(taxNumInfo)!='{}'">
        <Row>
          <Col span="12">
          <span class="tax-info-name">公司中文名称</span>
          <span class="tax-info-value">{{taxNumInfo.companyNameZh}}</span>
          </Col>
          <Col span="12">
          <span class="tax-info-name">VAT税号</span>
          <span class="tax-info-value">{{taxNumInfo.vatTaxNumber}}</span>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <span class="tax-info-name">公司英文名称</span>
          <span class="tax-info-value">{{taxNumInfo.companyNameEn}}</span>
          </Col>
          <Col span="12">
          <span class="tax-info-name">申报区间</span>
          <span class="tax-info-value date-color">{{taxNumInfo.beginTime!=''?taxNumInfo.beginTime.slice(0,10):''}}至{{taxNumInfo.endTime!=''?taxNumInfo.endTime.slice(0,10):''}}</span>
          </Col>
        </Row>
      </div>
      <Divider />
      <div class="submit-tip-box">
        <div class="content"
             v-if="addFrom.declareRule=='2'">
          <div class="subtitle">税局提示：</div>
          <p>当您提交此增值税信息至税局时，请确保该数据真实且 完整，如果数据错误或者不实，税局有权按规定进行处 罚。数据提交后无法更改.</p>
          <p>When you submit this VAT information you are making a legal declaration that the information is true and complete. A false declaration can result in prosecution. </p>
        </div>
        <div class="reportData-box"
             v-else>
          <p class="title">申报数据</p>
          <div class="sureData-box">
            <div class="row">
              <span>SSumme（含税销售额）</span>
              <span>{{currencySign}} &nbsp;&nbsp;&nbsp;&nbsp;{{returnTaxData.includTaxAmtTotal}}
              </span>
            </div>
            <div class="row">
              <span>Netto（不含税销售额）</span>
              <span>{{currencySign}} &nbsp;&nbsp;&nbsp;&nbsp;{{returnTaxData.excludeTaxAmtTotal}}
              </span>
            </div>
            <div class="row">
              <span>Umsatzsteuer（销项税额）</span>
              <span>{{currencySign}} &nbsp;&nbsp;&nbsp;&nbsp;{{returnTaxData.taxAmtTotal}}
              </span>
            </div>
            <div class="row">
              <span>Vorsteuer（抵扣金额）</span>
              <span>{{currencySign}} &nbsp;&nbsp;&nbsp;&nbsp;{{returnTaxData.deductionAmt}}
              </span>
            </div>
            <div class="row">
              <span>Guthaben（最终应缴税金）</span>
              <span>{{currencySign}} &nbsp;&nbsp;&nbsp;&nbsp;{{returnTaxData.taxTotal}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Divider class="submitModal-footer-line" />
      <div slot="footer">
        <Button class="footerBtClose"
                @click="submitModal=false">取消</Button>
        <Button class="footerBt"
                type="primary"
                @click="submit">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getProduct, getTaxRate, taxCountry, calculationTaxSale, submitTaxdate, submitTaxDiscount, calculationTaxSaleIndexPage, taxLogDetail } from "@/api/taxModule"
import { baseInfoByCondition } from "@/api/taxModule";
export default {
  data() {
    return {
      // 所有销售报告类型
      servicesId: this.$route.query.servicesId,
      vatTaxNumber: this.$route.query.vatTaxNumber,
      endTime: this.$route.query.endTime,
      allsaleType: [],
      loadBtnAuto: false, // 自动计算loading
      loadClient: false, // 客户确认loading
      getContentModel: false, // 如何获取按钮 弹窗
      loadNext: false,
      submitModal: false,//确认提交弹窗
      stepIndex: 0, // 步骤
      giveFrom: {},
      ifE: false, // 是否英国
      ruleGiveFrom: {
        tfnCountryCode: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "Choose at least one country",
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
        periodType: String(this.$route.query.periodType),
        salePlatformType: ''
      },
      ruleAddFrom: {
        declareRule: { required: 'true', message: 'Please choose the tax method', trigger: 'change' },
        countryCode: { required: 'true', message: 'Please select the country where tax is required', trigger: 'change' },
        taxRate: { required: 'true', message: 'Please select tax rate', trigger: 'change' },
        saleFileUrl: { required: 'true', message: 'Please upload the Amazon sales file', trigger: 'change' },
        salePlatformType: { required: 'true', message: 'Please select the sales platform', trigger: 'change' },
        periodType: { required: 'true', message: 'Please select the reporting period', trigger: 'change' }
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
      statusModel: false,  // 远程销售model
      returnDataSale: [], // 远程销售数据
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
      discountColumns: [
        {
          width: '80px',
          title: 'NO.',
          render(h, params) {
            return h('span', params.row._index + 1)
          },
        },
        {
          title: 'Deduction Type',
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
          title: 'Note Date',
          slot: 'declareDate'
        },
        {
          title: 'Deduction Amount',
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
          title: 'upload Files',
          slot: 'uploadBox'
        },
      ],
      discountTypeList: [
        {
          val: 'C79/88',
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
      deductionAmt: 0,//可抵扣总金额
      returnData: [],
      returnColumns: [
        {
          title: 'Sales Month',
          render: (h, params) => {
            return h('span', params.row.month);
          },
        },
        {
          title: 'Country of Shipment',
          key: 'departCode'
        },
        {
          title: 'Receiving Country',
          key: 'arrivalCode'
        },
        {
          title: 'Currency',
          key: 'currency'
        },
        {
          title: 'Exchange Rate',
          key: 'rate'
        },
        {
          title: 'Tax Included Sales',
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
      salesListAE: [
        { key: '0', value: '亚马逊' },
        { key: '1', value: 'NOON' },
      ],
      salesListSA: [
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
            let month = params.row.moth.slice(0, 10)
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
      taxNumInfo: {},
      postData: {}//提交的数据
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
      if (this.servicesId !== '' && this.servicesId !== undefined) {
        taxLogDetail({ servicesId: this.servicesId }).then(res => {
          if (res.code === 0) {
            this.taxNumInfo = res.data[0]
          }
        })
      }
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
          // console.log(this.checkedTaxCountry)
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
    deleteItem(row) {
      this.discountData.splice(row._index, 1);
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
          title: 'Upload a maximum of one file'
        })
      }
      return check
    },
    handleBeforeUpload() {
      const check = this.tableFiles[0].fileList.length < 1
      if (!check) {
        this.$Notice.warning({
          title: 'Upload a maximum of one file'
        })
      }
      return check
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: 'File type error',
        desc: 'Only supports XLS, XLSX, CSV, TXT'
      });
    },
    handleFormatErrors(file) {
      this.$Notice.warning({
        title: 'File type error',
        desc: 'Support JPG, PNG, PDF only'
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
        this.$Message.info('Please select country')
        return
      }
      if (this.addFrom.taxRate == '') {
        this.$Message.info('Please select tax rate')
        return
      }
      let data = { ...this.addFrom }
      if (this.addFrom.periodType === 'undefined') {
        data.periodType = -1
      }
      data.servicesId = this.servicesId
      data.vatTaxNumber = this.vatTaxNumber
      data.endTime = this.endTime
      this.$refs['addFrom'].validate((valid) => {
        if (valid) {
          if (this.addFrom.saleFileUrl == '') {
            this.$Message.info('Please upload the Amazon sales file')
            return
          }
          if (this.servicesId != undefined) {
            calculationTaxSale(data).then(res => {
              if (res.code == 0) {
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
          } else {
            calculationTaxSaleIndexPage(this.addFrom).then(res => {
              if (res.code == 0) {
                this.currencySign = res.data.currencySign
                this.deductionAmt = res.data.deductionAmt
                this.returnData = res.data.saleCheckInfos
                this.returnTaxData = res.data
              }
            })
          }
        }
      })
    },
    //提交申报数据
    sureSubmit() {
      const validate = this.verifyPaymentInsert(this.discountData)
      if (this.currencySign == '') {
        if (this.returnData.length == 0 && this.addFrom.declareRule != 2) {
          this.$Message.error("Please calculate the tax first")
          return
        }
      }
      // this.uploadDeductInfo()
      // let excludeTaxPrice=0,includTaxPrice=0
      // this.returnData.map((v,i)=>{
      //   excludeTaxPrice+=v.excludeTaxAmt
      //   includTaxPrice+=v.includTaxAmt
      // })
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
          taxRate: this.addFrom.taxRate,
          remoteSaleCheckInfos: this.remoteSaleCheckInfos,
          taxAmtTotal: this.returnTaxData.taxAmtTotal
        }
      } else {
        params = {
          serviceId: this.servicesId,
          allTaxPrice: this.returnTaxData.taxTotal,
          deductionPrice: this.deductionAmt,
          excludeTaxPrice: this.returnTaxData.excludeTaxAmtTotal,
          includTaxPrice: this.returnTaxData.includTaxAmtTotal,
          listTaxDeductionItem: [],
          sellFile: this.addFrom.saleFileUrl,
          declareRule: this.addFrom.declareRule,
          taxRate: this.addFrom.taxRate,
          remoteSaleCheckInfos: this.remoteSaleCheckInfos,
          taxAmtTotal: this.returnTaxData.taxAmtTotal
        }
        if (this.addFrom.countryCode == 'AE') {
          params = {
            serviceId: this.servicesId,
            allTaxPrice: this.returnTaxData.taxTotal,
            deductionPrice: this.deductionAmt,
            excludeTaxPrice: this.returnTaxData.excludeTaxAmtTotal,
            includTaxPrice: this.returnTaxData.includTaxAmtTotal,
            listTaxDeductionItem: [],
            sellFile: this.addFrom.saleFileUrl,
            declareRule: this.addFrom.declareRule,
            taxRate: this.addFrom.taxRate,
            remoteSaleCheckInfos: this.remoteSaleCheckInfos,
            aeSaleDataInfo: this.returnDataAE,
            remoteSaleCheckInfos: this.remoteSaleCheckInfos,
            taxAmtTotal: this.returnTaxData.taxAmtTotal
          }
        }
      }
      if (!validate.flag) {
        this.$Message.info('Please complete the amount of the deduction')
        return
      } else if (validate.flag && validate.isEmpty) {
        params.listTaxDeductionItem = []
      } else if (validate.flag && !validate.isEmpty) {
        params.listTaxDeductionItem = this.discountData
      }
      this.postData = { ...params }
      this.submitModal = true
    },
    submit() {
      submitTaxdate(this.postData).then((res) => {
        if (res.code == 0) {
          this.$Message.success('Submitted successfully')
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
      if (arr.length > 0) {
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
      } else {
        let params = {
          flag: true,
          isEmpty: true
        }
        return params
      }
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
    },
    // 远程销售弹窗
    getStatus() {
      this.statusModel = true
    },
    //下载税金明细
    downLoadTaxDetail() {
      let formData = new FormData()
      if (this.addFrom.countryCode != 'AE') {
        let taxSaleData = JSON.stringify(this.returnData)
        formData.append('taxSaleData', taxSaleData)
      } else {
        let taxAeData = JSON.stringify(this.returnDataAE)
        formData.append('taxAeData', taxAeData)
      }

      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/derive/client/calculation/export/list', true)
      // 设置请求token
      // xmlResquest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xmlResquest.setRequestHeader('token', localStorage.getItem('token'))
      xmlResquest.setRequestHeader('sessionId', localStorage.getItem('sessionId'))
      xmlResquest.responseType = 'blob'
      xmlResquest.getResponseHeader("Content-Disposition");

      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = timestamp + '.xlsx'
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
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
.modalCount {
  background-color: #fff;
  .title {
    font-size: 24px;
    font-family: "Microsoft Yahei", "PingFangSC-Semibold,PingFang SC";
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
  }
  .notice {
    height: 34px;
    font-size: 12px;
    font-family: "Microsoft Yahei", "PingFangSC";
    color: #333333;
    line-height: 17px;
    text-align: center;
    background-color: #fff;
    p {
      margin: auto;
      width: 596px;
    }
  }
  .step1,
  .step2 {
    padding-bottom: 20px;
  }
  .step1 {
    width: 100%;
    .tab-box {
      border-bottom: 1px solid #dddddd;
      span {
        display: inline-block;
        font-size: 16px;
        margin-right: 36px;
        color: #333333;
        cursor: pointer;
      }
      .active-tab {
        border-radius: 10px 10px 0 0;
        background-color: #16ade9;
        color: #fff;
        padding: 8px 24px;
      }
    }
    .tax-title {
      margin: 24px 0;
      padding: 11px 24px;
      background-color: rgba(22, 173, 233, 0.2);
      font-size: 18px;
      font-family: "Microsoft Yahei", "PingFangSC-Medium,PingFang SC";
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
  }
  .step2 {
    .resultBox {
      padding: 30px;
      .finalTaxPayment {
        background-color: rgb(255, 255, 255);
        height: 110px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 20px;
        // margin-top: 30px;
        p {
          margin: 0px;
        }
        .top {
          font-size: 12px;
          .red {
            color: #ed3e3e;
            font-weight: bold;
          }
          margin-bottom: 10px;
        }
        .bottom {
          .red {
            font-size: 23px;
            color: #ed3e3e;
            font-weight: bold;
          }
        }
        .canDiscount {
          font-size: 12px;
          margin-top: 12px;
          color: #303033;
          .top {
            margin-top: 0px !important;
          }
          .red {
          }
        }
        .canDiscount.top,
        .canDiscount.bottom {
          margin: 0px;
        }
      }
      tr {
        height: 50px;
      }
      th {
        background: #eeeeee;
        border: none;
        padding-left: 20px;
        text-align: left;
        .english {
          padding-top: 10px;
          height: 70px;
          line-height: 34px;
        }
      }
      .detail {
        background: #ffffff;
        td {
          padding-left: 20px;
          color: #333333;
        }
      }
      .finalTaxPayment {
        .english {
          padding: 0px;
          .chinese {
            top: 17px;
          }
          .red {
            font-size: 20px;
            font-weight: bold;
            color: rgba(237, 62, 62, 1);
            margin-left: 13px;
          }
        }
      }
    }
  }
  .table {
    // margin-top: 16px;
  }
  .yellow {
    color: #fdaa15;
    font-size: 12px;
  }
  .companyTax {
    margin: 15px 0px;
    background: #ffffff;
    padding: 20px 30px;
    &/deep/ .ivu-row {
      height: 50px;
    }
    .top {
    }
    .bottom {
    }
  }
  .english {
    font-weight: bold;
    font-size: 12px;
    color: #666666;
    line-height: 13px;
    height: 100%;
    position: relative;
    padding-top: 10px;
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
    font-size: 14px;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
  .leftBox {
    // margin-top: 25px;
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
    padding-top: 30px;
    border-top: 1px solid #eeeeee;
    .discountTitle {
      font-size: 16px;
      color: #303033;
      font-weight: 500;
      background: rgba(22, 173, 233, 0.2);
      height: 48px;
      line-height: 48px;
      color: #333333;
      padding: 0px 20px;
      span {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
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
        margin-top: 8px;
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
    .close {
      margin-left: 20px;
      margin-top: 7px;
      float: right;
      cursor: pointer;
      padding: 10px;
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
        margin-top: 3px;
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
  .submitTop {
    font-size: 13px;
    line-height: 12px;
    margin-top: 3px;
  }
  .submitBottom {
    font-size: 12px;
    line-height: 15px;
  }
  margin-top: 16px;
  &/deep/ .ivu-form .ivu-form-item-label {
    font-size: 16px;
    font-weight: bold;
    color: rgba(102, 102, 102, 1);
    // line-height:13px;
  }
  &/deep/ .ivu-checkbox-wrapper {
    display: flex;
    align-items: center;
    margin-right: 30px;
  }
  &/deep/ .ivu-radio-wrapper {
    color: #333333;
    .ivu-radio {
      margin-top: 5px;
    }
  }
  &/deep/ .ivu-table th {
    background-color: rgba(22, 173, 233, 0.2) !important;
    color: #666666;
    font-weight: 400;
    border-top: 1px solid rgba(153, 153, 153, 0.2);
  }
  &/deep/ .ivu-table td {
    &:last-child {
      border-right: 1px solid #e8eaec;
    }
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
  }
  &/deep/ .ivu-icon-ios-calculator-outline:before {
    font-size: 16px;
  }
  .tooltip {
    position: relative;
    &/deep/ .ivu-tooltip {
      position: absolute;
      left: 3px;
      top: 10px;
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
          border-right-color: #464c59;
          // border-top-color: #F79728;
          // border-left-color: #F79728;
          // border-bottom-color: #F79728;
        }
        .ivu-tooltip-inner {
          // background: #FEFFE8;
          // border-color: #FEFFE8;
          // box-shadow: none;
          // border: 1px solid #FAE3A4;
          color: #ffffff;
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
        color: #ffffff;
        line-height: 18px;
        margin: 5px 0px 10px 0px;
      }
      .ph {
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
        line-height: 26px;
      }
    }
  }
  &/deep/ .ivu-form-item-content {
    position: relative;
    .howToGet {
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 206px;
      width: 200px;
      margin-left: 10px;
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
        width: 90px;
        background: #f79728;
      }
    }
    .ivu-upload {
      .ivu-upload-list {
        position: absolute;
        width: 275px;
        top: 0px;
        left: 315px;
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
    .chineseTitle {
      position: absolute;
      top: 17px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
    }
    .lf1 {
      left: 0px;
    }
    .lf2 {
      left: 0px;
    }
    .lf3 {
      left: 0px;
    }
    .lf4 {
      left: 0px;
    }
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
      text-align: center;
    }
    .chooseCountry {
      // margin: 0px 45px;
    }
  }
  .step1 {
    .title {
      // margin-top: 15px;
      background: #ffffff;
      border-bottom: none;
      padding: 24px 0px 0px 24px;
      font-size: 24px;
      color: #333333;
    }
  }
  .step2 {
    margin-top: 15px;
    background: #ffffff;
    border-bottom: none;
    padding: 10px 30px 25px;
    .title {
      border-bottom: none;
      font-size: 18px;
    }
  }
  .leftBox {
    background: #ffffff;
    border: none;
    padding: 20px 25px;
  }
  .topLeft {
    .flex-between {
      padding-left: 25px;
    }
    margin: 10px;
    &/deep/ .ivu-form-item {
      //  margin-bottom: 15px;
    }
  }
  .step2_content {
    .resultMoney {
      background: #ffffff;
      span {
        // padding-left: 30px;
        font-size: 16px;
        color: #333333;
      }
      .jisuan {
        margin-bottom: 28px;
      }
      span.money {
        padding-left: 0px;
      }
      .finallyMoney {
        color: #333333;
        font-weight: 500;
        font-size: 18px;
        margin-top: 15px;
        margin-bottom: 30px;
        .red {
          color: #ed3e3e;
          font-size: 22px;
          font-weight: bold;
        }
      }
    }
  }
  &/deep/ .ivu-table-wrapper-with-border {
    border: none;
  }
  &/deep/ .ivu-table:before {
    height: 0px;
  }
  &/deep/ .ivu-table-border:after {
    width: 0px;
  }
  &/deep/ .ivu-table-border td,
  .ivu-table-border th {
    border: none;
  }
  &/deep/ .ivu-form-item-content {
    .ivu-upload {
      .ivu-upload-list {
        width: 145px;
      }
    }
  }
  .step2 {
    .resultBox {
      padding: 0px;
      .jisuanshuijin {
        margin-bottom: 20px;
        span {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
        }
      }
      .jiankong {
        margin-top: 10px;
        display: flex;
        .JkTitle {
          font-size: 16px;
          color: #333333;
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
            height: 16px;
            margin-top: 2px;
          }
          color: #16ade9;
        }
      }
      .unnormal {
        cursor: pointer;
        span.status {
          display: flex;
          img {
            width: 18px;
            height: 16px;
            margin-top: 2px;
          }
          color: #ed3e3e;
        }
      }
    }
  }
  &/deep/ .ivu-table td {
    background: #ffffff;
    border: 1px solid #e8eaec;
    border-top: none;
    padding-left: 20px;
    // padding-top: 10px;
    &:nth-child(2n) {
      border-left: none;
      border-right: none;
    }
  }
  &/deep/ .ivu-table th {
    background: #eeeeee;
    // border: none;
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
      font-weight: bold;
    }
  }
  .step2 {
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
      .jisuanshuijin {
        margin-bottom: 20px;
        span {
          font-size: 16px;
          color: #333333;
          font-weight: bold;
        }
      }
    }
    .step2_content {
      max-width: 1200px;
      margin: auto;
      border-top: 1px solid rgba(221, 221, 221, 0.5);
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
          // padding-left: 30px;
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
  .tooltip {
    .ivu-tooltip {
      left: 200px;
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
    border: 1px solid #e8eaec;
    border-top: none;
    padding-left: 20px;
    // padding-top: 10px;
    &:nth-child(2n) {
      border-left: none;
      border-right: none;
    }
  }
  &/deep/ .ivu-table th {
    background: #eeeeee;
    // border: none;
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
.remoteSaleHeader {
  text-align: center;
  font-size: 26px;
  color: #333333;
  padding: 10px;
  height: 60px;
  line-height: 30px;
}
.taxNumber-box {
  /deep/ .ivu-row {
    margin-bottom: 24px;
  }
  .tax-info-name {
    display: inline-block;
    min-width: 130px;
    font-size: 16px;
    font-family: "Microsoft Yahei", PingFangSC;
    color: rgba(102, 102, 102, 1);
    line-height: 16px;
    text-align: right;
    margin-right: 32px;
  }
  .tax-info-value {
    font-size: 16px;
    font-family: "Microsoft Yahei", "PingFangSC-Medium,PingFang SC";
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 18px;
  }
  .tax-info-value.date-color {
    color: #16ade9;
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
      font-family: "Microsoft Yahei", "PingFangSC-Medium,PingFang SC";
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
    .sureData-box {
      border: 1px solid #ebebeb;
      width: 454px;
      margin-left: 55px;
      .row {
        span {
          display: inline-block;
          padding: 12px 15px;
          font-size: 14px;
          font-family: "Microsoft Yahei", "PingFangSC-Medium,PingFang SC";
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          width: 224px;
        }
        :nth-child(1) {
          background-color: #d0effb;
          border-bottom: 1px solid #ebebeb;
          border-right: 1px solid #ebebeb;
        }
        :nth-child(2) {
          border-bottom: 1px solid #ebebeb;
        }
      }
    }
  }
}
.remoteSale {
  /deep/ .ivu-table-header {
    background: #ffffff !important;
  }
  /deep/ .ivu-modal-content {
    border-radius: 10px !important;
  }
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
      .footerBtClose {
        background-color: #fff;
        color: #999999;
      }
    }
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
</style>

