<template>
  <div>
    <Modal class="modalCount"
           v-model="modalInvoice"
           title="提交申报数据"
           :mask-closable="false"
           :footer-hide="true"
           @on-visible-change="changeState"
           width="1000">
      <div class="step1">
        <Form ref="addFrom"
              :model="addFrom"
              :rules="ruleAddFrom"
              :label-width="100">
          <FormItem label="计税方式"
                    prop="sal_tax_type">
            <Row>
              <Col span="8">
              <div class="taxType">
                <template v-if="typeNow!=2">
                  <span :class="taxType==index?'active':'' "
                        v-for="(item,index) in taxTypes"
                        @click="spanIndex(item.value)"
                        :key="index">{{item.name}}</span>
                </template>
                <template v-if="typeNow==2">
                  <span :class="taxType==index?'active':'' "
                        v-for="(item,index) in taxTypes"
                        :key="index">{{item.name}}</span>
                </template>
              </div>
              </Col>
            </Row>
          </FormItem>
          <FormItem class="haveCountry"
                    label="选择国家"
                    prop="tax_no_country">
            <Row>
              <Col span="8">
              <Select v-model="addFrom.tax_no_country"
                      multiple
                      placeholder="请选择报税国家">
                <Option v-for="(item,index) in allcountryList"
                        :value="item.value"
                        :key="index">{{ item.name }}</Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          <FormItem class="haveCountry"
                    label="税率"
                    prop>
            <Row>
              <Col span="8">
              <Select v-model="addFrom.tax_no_country"
                      multiple
                      placeholder="请选择税率">
                <Option v-for="(item,index) in taxRates"
                        :value="item.value"
                        :key="index">{{ item.name }}</Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          <FormItem class="haveCountry"
                    label="有税号国家"
                    prop="tax_no_country">
            <Row>
              <Col span="8">
              <Select v-model="addFrom.tax_no_country"
                      multiple
                      placeholder="请添加"
                      disabled>
                <Option v-for="(item,index) in allcountryList1"
                        :value="item.name"
                        :key="index">{{ item.value }}</Option>
              </Select>
              </Col>
              <Col span="6">
              <Button type="text"
                      @click="addCountry1"
                      v-if="typeNow!==2">添加</Button>
              </Col>
            </Row>
          </FormItem>
          <div v-if="taxType!==2">
            <FormItem v-if="addFrom.declare_type!==2"
                      label="亚马逊销售额文件"
                      prop="amx_file_url">
              <Row>
                <Col span="8">
                <Upload v-if="typeNow!==2"
                        :action="fileUpload"
                        :on-success="ymxFile"
                        :data="{prefix:''}">
                  <Button v-if="addFrom.sale_amx_url.url==''"
                          icon="ios-cloud-upload-outline">导入</Button>
                  <Button v-if="addFrom.sale_amx_url.url!=''"
                          icon="ios-cloud-upload-outline">已上传，点击重新上传</Button>
                </Upload>
                <a v-if="addFrom.sale_amx_url.url"
                   :href="addFrom.sale_amx_url.url"
                   target="_blank">{{addFrom.sale_amx_url.name||'亚马逊销售额文件'}}</a>
                </Col>
              </Row>
            </FormItem>
            <FormItem v-if="addFrom.declare_type!==2"
                      label="进口增值税抵扣金额"
                      prop="c79">
              <Row>
                <Col span="8">
                <Input v-model="addFrom.c79"
                       :disabled="typeNow==2">
                <span slot="prefix">{{currency}}</span>
                </Input>
                </Col>
                <Col span="8"
                     offset="1">
                <Upload :data="{prefix:''}"
                        :action="fileUpload"
                        :on-success="taxSuccess"
                        :before-upload="beforeTaxUpload">
                  <Button type="info"
                          ghost>上传文件</Button>
                </Upload>
                </Col>
              </Row>
            </FormItem>
            <FormItem v-if="addFrom.declare_type!==2"
                      label="发票抵扣"
                      prop="deduct_from">
              <Row>
                <Col span="8">
                <Input v-model="addFrom.deduct_from"
                       :disabled="typeNow==2">
                <span slot="prefix">{{currency}}</span>
                </Input>
                </Col>
                <Col span="8"
                     offset="1">
                <Upload :data="{prefix:''}"
                        :action="fileUpload"
                        :on-success="receiptSuccess"
                        :before-upload="beforeTaxUpload">
                  <Button type="info"
                          ghost>上传文件</Button>
                </Upload>
                </Col>
              </Row>
            </FormItem>
            <div class="resultInfo"
                 v-show="typeNow==2">
              <FormItem label="计算结果">
                <Row>
                  <Col span="8">
                  </Col>
                  <Col span="20">
                  <Table :columns="columns2"
                         :data="data2"
                         width="600"
                         border></Table>
                  </Col>
                </Row>
              </FormItem>
              <FormItem v-if="tax_money_url"
                        label="税金确认函">
                <Row>
                  <Col span="8">
                  </Col>
                  <Col span="20">
                  <a :href="tax_money_url"
                     target="_blank">税金确认函文件</a>
                  </Col>
                </Row>
              </FormItem>
              <FormItem v-if="return_receipt_url.url"
                        label="申报回执:"
                        prop="return_receipt_url">
                <Row>
                  <Col span="8">
                  </Col>
                  <Col span="10">
                  {{addFrom.return_receipt_url}}
                  <a :href="return_receipt_url"
                     target="_blank">{{return_receipt_url.name||'申报回执文件'}}</a>
                  </Col>
                  <Col span="6">
                  <a title="重新上传申报回执文件"
                     @click="reUpload">重新上传</a>
                  </Col>
                </Row>
              </FormItem>
              <FormItem v-if="pay_url.url"
                        label="支付凭证:">
                <Row>
                  <Col span="8">
                  </Col>
                  <Col span="20">
                  <a :href="pay_url.url"
                     target="_blank">{{pay_url.name||'支付凭证文件'}}</a>
                  </Col>
                </Row>
              </FormItem>
              <FormItem v-if="zero_file_url.url"
                        label="截图凭证">
                <Row>
                  <Col span="8">
                  </Col>
                  <Col span="20">
                  <a :href="zero_file_url.url"
                     target="_blank">{{zero_file_url.name||'零申报截图凭证文件'}}</a>
                  </Col>
                </Row>
              </FormItem>
              <FormItem v-if="sale_report_url.url"
                        label="销售报告">
                <Row>
                  <Col span="8">
                  </Col>
                  <Col span="20">
                  <a :href="sale_report_url.url"
                     target="_blank">{{sale_report_url.name||'销售报告文件'}}</a>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </div>
          <div v-if="taxType==2">
            <FormItem v-if="return_receipt_url.url"
                      label="申报回执"
                      prop="return_receipt_url">
              <Row>
                <Col span="8">
                </Col>
                <Col span="20">
                <a :href="return_receipt_url.url"
                   target="_blank">{{return_receipt_url.name||'申报回执文件'}}</a>
                </Col>
              </Row>
            </FormItem>
          </div>
          <FormItem>
            <Button v-if="typeNow!==2"
                    type="primary"
                    @click="save('addFrom')"
                    :loading="loadSave">核算税金</Button>
          </FormItem>
          <FormItem>
            <div>
              <p>计算结果</p>
              <div>
                <p>
                  含税销售额：
                  <span>€ 200.0</span>
                  销项税金：
                  <span>€ 200.0</span>
                </p>
                <p>
                  不含税销售额：
                  <span>€ 200.0</span>
                  抵扣金额：
                  <span>€ 200.0</span>
                </p>
                <p>
                  应缴税金：
                  <span>€ 200.0</span>
                </p>
              </div>
            </div>
          </FormItem>
          <Button v-if="typeNow!==2"
                  type="primary"
                  @click
                  :loading="loadSave">填充到右边</Button>
        </Form>
      </div>
      <div class="step2">
        <p>请填写本次需申报的数据：</p>
        <Form ref="giveAutoFrom"
              :model="giveAutoFrom"
              :rules="ruleAutoGiveFrom"
              :label-width="140">
          <FormItem label="含税销售额">
            <Input></Input>
          </FormItem>
          <FormItem label="不含税销售额">
            <Input></Input>
          </FormItem>
          <FormItem label="缴纳税金">
            <Input></Input>
          </FormItem>
        </Form>
        <div>
          <Button type="primary"
                  :loading="loadClient"
                  @click>提交申报</Button>
        </div>
      </div>
      <div style="clear:both;"></div>
    </Modal>
    <Modal v-model="modelAddCom"
           title="添加国家"
           :mask-closable="false"
           @on-cancel="cancel">
      <Form ref="giveFrom"
            :model="giveFrom"
            :rules="ruleGiveFrom"
            :label-width="0">
        <FormItem label
                  prop="tax_no_country">
          <Row>
            <CheckboxGroup v-model="giveFrom.tax_no_country"
                           @on-change="countrys">
              <Checkbox v-for="(item,index) in allcountryList1"
                        :label="item.name"
                        :key="index">
                <span>{{item.value}}</span>
              </Checkbox>
            </CheckboxGroup>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="footerBt"
                type="primary"
                size="small"
                long
                :loading="loadingget"
                @click="giveok('giveFrom')">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      modalInvoice: true,
      // 所有销售报告类型
      allsaleType: [],

      loadBtnAuto: false, // 自动计算loading
      loadClient: false, // 客户确认loading
      loadNext: false,

      stepIndex: 0, // 步骤
      giveFrom: {},
      ifE: false, // 是否英国
      ruleGiveFrom: {
        tax_no_country: [
          {
            required: true,
            type: "array",
            min: 1,
            message: "至少选择一个国家",
            trigger: "change"
          }
        ]
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
        sale_amx_url: {
          url: ""
        },
        sale_other_url: {
          url: ""
        },
        sale_zero_url: {
          url: ""
        }
      },
      ruleAddFrom: {
        other_inclu_sal: [
          {
            required: true,
            message: "不可为空",
            trigger: "blur"
          }
        ],
        c79: [
          {
            required: true,
            message: "不可为空",
            trigger: "blur"
          }
        ],
        deduct_from: [
          {
            required: true,
            message: "不可为空",
            trigger: "blur"
          }
        ],
        is_fanou: [
          {
            required: true,
            message: "不可为空",
            trigger: "change"
          }
        ],
        sale_type: [
          {
            required: true,
            message: "请先选择销售报告类型",
            trigger: "change"
          }
        ]
      },
      allFacilitator: "",
      reportCycle: [
        {
          key: 0,
          name: "月报"
        },
        {
          key: 1,
          name: "季报"
        },
        {
          key: 2,
          name: "年报"
        }
      ],
      actionMaking: true, // 生成/修改工单
      loadSave: false,
      taxType: 0,
      columns2: [
        {
          title: "含税销售额",
          key: "total_inclu_sal"
        },
        {
          title: "不含税销售额",
          key: "total_sal"
        },
        {
          title: "税金",
          key: "tax_money"
        }
      ],
      data2: [{ name: "45455" }],

      // all country
      allcountryList: [
        {
          name: "英国",
          value: "GB"
        },
        {
          name: "意大利",
          value: "YDL"
        }
      ],
      allcountryList1: [
        {
          name: "英国",
          value: "GB"
        },
        {
          name: "意大利",
          value: "YDL"
        }
      ],
      taxTypes: [
        { value: 0, name: "目的国" },
        { value: 1, name: "发出国" }
        // { value: 2, name: "零申报" }
      ],
      slList: [
        { value: "0", name: "6.5%" },
        { value: "1", name: "7.5%" }
      ],
      taxRates: [
        { value: "1", name: "标准" },
        { value: "2", name: "低税率" },
        { value: "3", name: "首年税率" }
      ],
      selects: [],
      columns1: [
        {
          title: "到货国",
          key: "state_name"
        },
        {
          title: "货币单位",
          key: "currency"
        },
        {
          title: "远程销售额限额",
          key: "money_limit"
        },
        {
          title: "超额日期",
          key: "over_date"
        },
        {
          title: "首月超出金额",
          key: "over_date_money"
        },
        {
          title: "备注",
          slot: "remarks",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.remarks,
                size: "small"
              },
              on: {
                input: val => {
                  this.data1[params.index].remarks = val;
                }
              }
            });
          }
        }
      ],
      data1: [],
      modelAutoCount: false,
      counts: "",
      giveAutoFrom: {},
      ruleAutoGiveFrom: {},

      // 核算税金
      modelResult: false,
      loadingresult: false,
      columns3: [
        {
          title: "含税销售额",
          slot: "total_inclu_sal"
        },
        {
          title: "不含税销售额",
          slot: "totaly_sal"
        },
        {
          title: "税金",
          slot: "total_tax_money_sal"
        }
      ],
      data3: [],

      tax_money_url: "",
      pay_url: "",
      return_receipt_url: "",
      zero_file_url: "",
      sale_report_url: "", // 销售报告
      typeNow: "",
      return_receipt_file_url: [], // 重新上传申报回执文件
      uploadModal: false,
      file_url: [],
      taxFileList: []
    };
  },
  computed: {
    ifE1: function () {
      return this.ifE;
    }
  },
  methods: {
    changeState(val) {
      let obj = {
        state: val
      };
      this.$emit("changeState", obj);
    },
    cancel() {
      this.addFrom.tax_no_country = [];
      this.giveFrom.tax_no_country = [];
    },
    // tax type
    spanIndex(index) {
      this.taxType = index;
      this.addFrom.sal_tax_type = this.taxType;
    },
    // 添加公司
    giveok(all) {
      let self = this;
      this.addFrom.record_id = this.sendId;
      this.$refs[all].validate(valid => {
        if (valid) {
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
      this.addFrom.tax_no_country = arr;
    },
    // 凭证图片限制
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件类型出错",
        desc: "文件 " + file.name + "必须为图片格式"
      });
    },
    // 增值税文件上传成功
    taxSuccess(response, file, fileList) {
      this.addFrom["c79_url"] = response.data;
    },
    // 发票抵扣上传成功
    receiptSuccess(response, file, fileList) {
      this.addFrom["deduct_from_url"] = response.data;
    },
    // 自动计算
    figureAuto() {
      let self = this;
      self.loadBtnAuto = true;
      this.addFrom.record_id = this.sendId;
      if (!this.addFrom.amx_file_url || this.addFrom.amx_file_url.url == "") {
        this.$Message.error("亚马逊销售文件必传");
        self.loadBtnAuto = false;
      } else if (!this.addFrom.is_fanou) {
        this.$Message.error("是否开通泛欧必选");
        self.loadBtnAuto = false;
      } else {
        let obj = {
          record_id: this.addFrom.record_id,
          sal_tax_type: this.addFrom.sal_tax_type,
          amx_file_url: this.addFrom.amx_file_url,
          is_fanou: this.addFrom.is_fanou,
          tax_no_country: this.addFrom.tax_no_country
        };
        if (this.addFrom.amx_file_url.url) {
          obj.amx_file_url.fileUrl = this.addFrom.amx_file_url.url;
          obj.amx_file_url.origFileName = this.addFrom.amx_file_url.name;
        }
        countAuto(obj)
          .then(
            res => {
              if (res.code === 0) {
                localStorage.setItem("preType", this.taxType);
                this.counts = res.data.taxCalc;
                this.data1 = res.data.distanceSales;
                this.modelAutoCount = true;
                self.loadBtnAuto = false;
              } else {
                this.$Message.error(res.message);
                self.loadBtnAuto = false;
              }
            },
            err => {
              self.loadBtnAuto = false;
            }
          )
          .finally(() => {
            self.loadBtnAuto = false;
          });
      }
    },
    // 核算税金
    save(all) {
      let self = this;
      self.loadSave = true;
      this.addFrom.record_id = this.sendId;
      let preTaxType = localStorage.getItem("preType");
      if (preTaxType) {
        if (this.taxType != preTaxType && this.taxType != 2) {
          self.$Message.warning("计税方式已改变，请先重新计算，再核算税金！");
          self.loadSave = false;
        } else {
          //   self.cherkMoney(all);
        }
      } else {
        // self.cherkMoney(all);
      }
    },
    // sumit
    cherkMoney(all) {
      let self = this;
      this.$refs[all].validate(valid => {
        if (valid) {
          this.addFrom.tax_inclu_sal = this.counts;
          if (this.taxType == 2 && !this.addFrom.zero_file_url.fileUrl) {
            self.$Message.warning("截图凭证不可为空");
          } else {
            let obj = {
              record_id: this.addFrom.record_id,
              sal_tax_type: this.addFrom.sal_tax_type,
              is_fanou: this.addFrom.is_fanou,
              tax_no_country: this.addFrom.tax_no_country,
              tax_rate_son: this.addFrom.tax_rate_son,
              other_inclu_sal: this.addFrom.other_inclu_sal,
              tax_inclu_sal: this.addFrom.tax_inclu_sal,
              c79: this.addFrom.c79,
              amx_file_url: this.addFrom.amx_file_url,
              other_file_url: this.addFrom.other_file_url,
              deduct_from: this.addFrom.deduct_from,
              zero_file_url: this.addFrom.zero_file_url,
              total_inclu_sal: this.addFrom.total_inclu_sal,
              sale_type: this.addFrom.sale_type,
              c79_url: this.addFrom.c79_url,
              deduct_from_url: this.addFrom.deduct_from_url
            };
            saveTax(obj)
              .then(
                res => {
                  self.data3 = [];
                  if (res.code == 0) {
                    self.$Message.success("保存成功");
                    self.data3.push(res.data);
                    self.modelResult = true;
                  } else {
                    self.$Message.error(res.message);
                  }
                },
                err => { }
              )
              .finally(() => { });
          }
        }
        self.loadSave = false;
      });
    },
    beforeTaxUpload() {
      const fileLength = this.taxFileList.length;
      if (fileLength > 3) {
        this.$Message.warning("最多只可上传3个文件");
      }
    },
    // 发票抵扣上传成功
    receiptSuccess(response, file, fileList) {
      this.addFrom["deduct_from_url"] = response.data;
    },
    // 截图凭证
    zeroFile(response, file, fileList) {
      this.addFrom.zero_file_url = file.response.data;
    },
    // other file
    otherFile(response, file, fileList) {
      this.addFrom.other_file_url = file.response.data;
    },
    // ymx file
    ymxFile(response, file, fileList) {
      // debugger
      this.addFrom.amx_file_url = file.response.data;
    }
  },
  mounted() {
    //   debugger
  }
};
</script>
<style lang="less" scoped>
.modalCount {
  .taxType {
    span {
      border: 1px solid #413535;
      margin-right: 5px;
      padding: 3px 7px;
      cursor: pointer;
    }
    .active {
      border: 1px solid #2d8cf0;
      color: #2d8cf0;
    }
  }
  .step1,
  .step2 {
    padding-bottom: 20px;
    width: 50%;
    float: left;
  }
}
</style>