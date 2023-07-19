<template>
  <div class="container">
    <div class="stepH stepAE">
      <Form :model="editForm" class="formstyle inputHFlex" :rules="editFormRules" ref="editFormRef">
        <div class="title">公司信息</div>
        <div class="content">
          <Row>
            <Col :span="8">
              <FormItem label="VAT税号：" style="width: 450px" prop="vatTaxNum">
                <Input
                  v-model="editForm.vatTaxNum"
                  placeholder="请输入英国VAT税号"
                  :disabled="!isEdit"
                  @on-blur="searchVatInfo"
                  maxlength="100"
                ></Input>
                <div class="ivu-form-item-error-tip" v-if="editForm.vatTaxNumError">{{ editForm.vatTaxNumError }}</div>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem label="公司中文名称：" style="width: 300px" prop="companyNameZh">
                <Input v-model="editForm.companyNameZh" placeholder="公司中文名称" maxlength="100" disabled></Input>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem label="公司英文名称：" style="width: 300px" prop="companyNameEn">
                <Input v-model="editForm.companyNameEn" placeholder="公司英文名称" maxlength="100" disabled></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="8">
              <FormItem label="选择退税周期：" style="width: 300px" prop="refundMonth">
                <div style="display: flex; width: 300px">
                  <DatePicker
                    type="month"
                    v-model="editForm.startYearMon"
                    placeholder="退税开始月份"
                    :disabled="!isEdit"
                    @on-change="editForm.endYearMon = ''"
                    style="width: 130px; margin-right: 10px"
                  ></DatePicker>
                  <DatePicker
                    type="month"
                    v-model="editForm.endYearMon"
                    placeholder="退税结束月份"
                    :disabled="!isEdit || !editForm.startYearMon"
                    style="width: 130px"
                    :options="endYearMonOptions"
                  ></DatePicker>
                </div>
                <p style="font-size: 14px; font-weight: 400; color: #fbb73c; line-height: 18px; margin-top: 10px">
                  提示：退税开始月与截至月之间，跨度最长为3个月
                </p>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem label="退税金额：" style="width: 300px" prop="refundMoney">
                <Input
                  v-model="editForm.refundMoney"
                  placeholder="请输入退税金额（GBP）"
                  :disabled="!isEdit"
                  maxlength="20"
                >
                  <span slot="append">英镑</span>
                </Input>
                <p style="font-size: 14px; font-weight: 400; color: red; line-height: 18px; margin-top: 10px">
                  提示：最终退税金额由税局决定
                </p>
              </FormItem>
            </Col>
          </Row>
        </div>
        <div class="line"></div>
        <div class="title">退税账户<span style="font-size: 14px; color: red; margin-left: 20px">(P卡账户)</span></div>
        <div class="content">
          <Row>
            <Col :span="8">
              <FormItem label="Account Name：" style="width: 300px" prop="accountName">
                <Input v-model="editForm.accountName" placeholder="请输入Account Name" :disabled="!isEdit"></Input>
                <p style="font-size: 14px; font-weight: 400; color: #fbb73c; line-height: 18px; margin-top: 10px">
                  提示：英文名称，与注册税号时，填写的公司英文名称一致
                </p>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem label="Account number：" style="width: 300px" prop="accountNumber">
                <Input
                  v-model="editForm.accountNumber"
                  placeholder="请输入Account number"
                  :disabled="!isEdit"
                  maxlength="8"
                ></Input>
                <p style="font-size: 14px; font-weight: 400; color: red; line-height: 18px; margin-top: 10px">
                  提示：8位数字
                </p>
              </FormItem>
            </Col>
            <Col :span="8">
              <FormItem label="sort code：" style="width: 300px" prop="sortCode">
                <Input
                  v-model="editForm.sortCode"
                  placeholder="请输入sort code"
                  :disabled="!isEdit"
                  maxlength="6"
                ></Input>
                <p style="font-size: 14px; font-weight: 400; color: red; line-height: 18px; margin-top: 10px">
                  提示：6位数字
                </p>
              </FormItem>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
    <!-- 待提交资料以及资料驳回时候可以再次提交 -->
    <div class="clearfix newBt" v-if="status == 80 || status == 83">
      <div class="btn">
        <Button class="prev" @click="handleSave">保存</Button>
        <Button class="next" @click="handleSubmit">提交</Button>
      </div>
    </div>
  </div>
</template>

<script>
// 引入api
import { taxNumInfo, refundSubmit, refundDetail } from "@/api/taxRefund/gbRefund";
export default {
  props: ["status", "servicesId", "productFunctionCode", "supplierId", "countryCode", "countryNameZh"],
  data() {
    return {
      isEdit: true,
      editForm: {
        vatTaxNum: "",
        vatTaxNumError: "", // 查询vat税号失败的错误提示文案
        companyNameZh: "",
        companyNameEn: "",
        startYearMon: "",
        endYearMon: "",
        refundMoney: "",
        accountName: "",
        accountNumber: "",
        sortCode: "",
      },
      editFormRules: {
        vatTaxNum: [
          {
            required: true,
            message: "请输入英国VAT税号",
            trigger: "blur",
          },
        ],
        companyNameZh: [
          {
            required: true,
            message: "请输入公司中文名称",
            trigger: "blur",
          },
        ],
        companyNameEn: [
          {
            required: true,
            message: "请输入公司英文名称",
            trigger: "blur",
          },
        ],
        refundMonth: [
          {
            validator: (rule, value, callback) => {
              if (this.editForm.startYearMon && this.editForm.endYearMon) {
                callback();
              } else {
                callback(new Error("请选择退税周期，跨度在三个月内"));
              }
            },
            trigger: "change",
          },
        ],
        refundMoney: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value != null && value != undefined) {
                if (!/(^[1-9][0-9]*$)|(^[1-9][0-9]*\.[0-9]{1,2}$)|(^0\.[0-9]{1,2}$)|(^0$)/.test(value)) {
                  callback(new Error("请输入正确的数字金额，最多保留两位小数"));
                } else {
                  callback();
                }
              } else {
                callback(new Error("请输入退税金额（GBP）"));
              }
            },
            trigger: "blur",
          },
        ],
        accountName: [
          {
            required: true,
            message: "请输入Account Name",
            trigger: "blur",
          },
        ],
        accountNumber: [
          {
            required: true,
            message: "请输入Account number",
            trigger: "blur",
          },
          {
            required: true,
            pattern: /^[0-9]{1,8}$/,
            message: "请输入数字类型",
            trigger: "blur",
          },
        ],
        sortCode: [
          {
            required: true,
            message: "请输入sort code",
            trigger: "blur",
          },
          {
            required: true,
            pattern: /^[0-9]{1,6}$/,
            message: "请输入数字类型",
            trigger: "blur",
          },
        ],
      },

      // 月份控制，结束日期只能在3个月内
      endYearMonOptions: {
        disabledDate: (date) => {
          if (this.editForm.startYearMon) {
            let startDate = new Date(this.editForm.startYearMon.valueOf());
            // 开始时间的3个月内允许选择
            let minMonth = startDate.setMonth(startDate.getMonth());
            let maxMonth = startDate.setMonth(startDate.getMonth() + 2);
            return date.getTime() < minMonth || date.getTime() > maxMonth;
          } else {
            return true;
          }
        },
      },
    };
  },
  watch: {},
  created() {
    // 只有在83和80下才能编辑
    if (this.status != 80 && this.status != 83) {
      this.isEdit = false;
    }
    this.getDetail();
  },
  mounted() {},
  methods: {
    /**
     * vat税号文本框失去焦点查询信息
     */
    searchVatInfo() {
      if (!this.editForm.vatTaxNum) {
        this.editForm.companyNameZh = "";
        this.editForm.companyNameEn = "";
        this.editForm.vatTaxNumError = "";
        return;
      }
      taxNumInfo({ taxNum: this.editForm.vatTaxNum, countryCode: this.countryCode, companyBody: 1 }).then((res) => {
        if (res.code == 0 && Object.keys(res.data).length > 0) {
          this.editForm.companyNameZh = res.data.companyNameZh;
          this.editForm.companyNameEn = res.data.companyNameEn;
          this.editForm.vatTaxNumError = "";
        } else {
          this.editForm.companyNameZh = "";
          this.editForm.companyNameEn = "";
          this.editForm.vatTaxNumError = "异常：系统查询到该税号不存在或不属于您，无法进行退税操作";
        }
      });
    },

    /**
     * 查询退税服务单详情
     */
    getDetail() {
      refundDetail({ serviceId: this.servicesId }).then((res) => {
        if (res.code == 0) {
          this.editForm = { ...this.editForm, ...res.data };
        }
      });
    },

    /**
     * 点击保存
     */
    handleSave() {
      this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          let params = { ...this.editForm };
          // 追加额外传参
          params.refundCurrUnit = "GBP";
          params.startYearMon = this.translateYearMon(this.editForm.startYearMon);
          params.endYearMon = this.translateYearMon(this.editForm.endYearMon);
          params.taxRefundInterval =
            this.translateYearMon(this.editForm.startYearMon) + "~" + this.translateYearMon(this.editForm.endYearMon);
          params.operation = 1;
          params.orderServicesId = this.servicesId;
          // 请求后台
          refundSubmit(params).then((res) => {
            if (res.code == 0) {
              this.$Message.success("保存成功");
            } else {
              this.$Message.error("资料填写有误");
            }
          });
        }
      });
    },
    /**
     * 点击提交
     */
    handleSubmit() {
      this.$refs.editFormRef.validate((valid) => {
        if (valid) {
          let params = { ...this.editForm };
          // 追加额外传参
          params.refundCurrUnit = "GBP";
          params.startYearMon = this.translateYearMon(this.editForm.startYearMon);
          params.endYearMon = this.translateYearMon(this.editForm.endYearMon);
          params.taxRefundInterval =
            this.translateYearMon(this.editForm.startYearMon) + "~" + this.translateYearMon(this.editForm.endYearMon);
          params.operation = 2;
          params.orderServicesId = this.servicesId;
          // 请求后台
          refundSubmit(params).then((res) => {
            if (res.code == 0) {
              // 检测税号区间冲突提示
              if (res.data && res.data.code == 1002) {
                this.$Modal.warning({
                  title: "提交异常提醒",
                  content: res.data.msg,
                });
              } else {
                this.$Message.success("提交成功");
                // 跳转到成功页面
                this.submitSuccess(new Date().getTime());
              }
            } else {
              this.$Message.error("资料填写有误");
            }
          });
        }
      });
    },
    // 转换日期
    translateYearMon(date) {
      return date.getFullYear() + "-" + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1));
    },
    /**
     * 提交成功后，到该页面
     */
    submitSuccess(timestamp) {
      this.$router.replace({
        path: "/submitSuccess",
        query: {
          countryCode: this.countryCode,
          countryNameZh: this.countryNameZh,
          timestamp: timestamp,
          productFunctionCode: this.productFunctionCode,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .ivu-row {
  width: 100%;
  margin-left: 0px;
}
.flex-direction {
  display: flex;
  flex-direction: column;
  align-items: baseline;
}
.stepH {
  background-color: #fff;
  padding: 0 24px;
  .tips-icon {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    display: inline-block;
    line-height: 17px;
    text-align: center;
    color: #ed3e3e;
    cursor: pointer;
    img {
      width: 100%;
      margin-top: 7px;
    }
  }
}
.container {
  .stepAE {
    width: 100% !important;
    padding: 0px;
    background-color: #fff;
    padding: 0 24px;
    /deep/ .ivu-radio-group {
      margin-top: 4px;
    }
    /deep/ .ivu-form {
      .ivu-form-item {
        margin-bottom: 15px;
      }
      .ivu-form-item-label {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        // float: none;
      }
      .ivu-form-item-content {
        width: 90%;
      }
    }
    /deep/ .ivu-input-wrapper {
      width: 100%;
    }
    /deep/ .ivu-select {
      width: 100%;
    }
    /deep/ .ivu-tooltip-popper {
      width: 200px;
    }
    /deep/ .ivu-date-picker {
      width: 100%;
    }
    // /deep/ .ivu-form-item {
    //   display: flex;
    //   flex-direction: column;
    //   align-items: flex-start;
    // }
    /deep/ textarea.ivu-input {
      margin-left: 0px;
    }
    .title {
      width: 100%;
      height: 40px;
      background: #d6e8fd;
      padding-left: 32px;
      font-size: 18px;
      height: 55px;
      line-height: 55px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #333333;
    }
    .line {
      background: #f6f5f8;
      height: 24px;
      width: 100%;
    }
    .content {
      width: 100%;
      background: #ffffff;
      padding: 24px 32px;
    }
    /deep/ .ivu-upload {
      width: 100%;
      cursor: pointer;
      .inner {
        width: 100%;
        height: 32px;
        background: #16ade9;
        border-radius: 2px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        img {
          width: 20px;
          height: 20px;
          margin-top: 0px;
        }
        .uplad-word {
          color: #ffffff;
        }
      }
    }
    .isEdit {
      .inner {
        background: #9999991f;
        .uplad-word {
          color: #666666;
        }
        img {
          display: none;
        }
      }
    }
    .out-img-box {
      .img-box {
        position: relative;
        text-align: center;
        .show-pdf {
          color: #16ade9;
        }
        button {
          width: 0px;
          padding: 0px;
          border: none;
          position: absolute;
          top: 8px;
          height: 0px;
          z-index: 1;
          margin-left: 3px;
          img.closeImg {
            width: 13px;
            height: 13px;
          }
        }
      }
    }
    .upload-tip {
      font-size: 12px;
      color: #cccccc;
      vertical-align: bottom;
      a {
        color: #16ade9;
      }
      img {
        width: 14px;
        height: 14px;
        margin-top: 9px;
        float: left;
      }
    }
  }
}
.requiredItem {
  /deep/ .ivu-form-item-label::before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
.newBt {
  text-align: center;
  margin: 20px 10px;
  // position: fixed;
  // bottom: 0px;
  // width: 100%;
  // left: 0px;
  // background: #ffffff;
  // padding: 20px;
  // box-shadow: 0px -1px 4px 0px rgba(0,0,0,0.04);
  // z-index: 11;
  & .btn {
    // text-align: center;
    & .next,
    & .prev {
      display: inline-block;
      width: 98px;
      height: 32px;
      background: #16ade9;
      border: 1px solid #16ade9;
      color: #313233;
      font-size: 14px;
      line-height: 33px;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }
    & .prev {
      background: #fff;
      border: 1px solid #16ade9;
      color: #16ade9;
      margin-right: 20px;
    }
    & .next {
      color: #ffffff;
      margin-right: 16px;
    }
  }
}
</style>
