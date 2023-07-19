<template>
  <div class="detailWrapper clearfix">
    <div class="back">
      <p @click="goBack()" class="backBtn">
        <Icon type="md-arrow-back" />返回列表
      </p>
    </div>
    <div class="content">
      <!-- 左侧信息 -->
      <div class="content-l">
        <Card>
          <p slot="title" class="declareFileBox">
            <span>退税资料</span>
            <!-- 不同退税状态显示不同的按钮 -->
            <span>
              <!-- 待上传资料显示 -->
              <span class="btnArea" v-if="status == 80">
                <!-- 实际是和下面的提交按钮一个作用，提交资料信息，不是审核的按钮 -->
                <Button
                  type="primary"
                  v-show="hasAuthority('taxRefund_submitInfo')"
                  style="margin-right:8px;"
                  @click="handleSubmit"
                >
                  提交审核
                </Button>
              </span>
              <!-- 待审核显示 -->
              <span class="btnArea" v-if="status == 81">
                <Button
                  type="primary"
                  v-show="hasAuthority('taxRefund_submitAudit')"
                  style="margin-right:8px;"
                  @click="showPassRefundModal"
                >
                  审核
                </Button>
              </span>
              <!-- 退税中显示 -->
              <span class="btnArea" v-if="status == 86">
                <Button
                  v-show="hasAuthority('taxRefund_rejectInfo')"
                  type="primary"
                  style="margin-right:8px;"
                  @click="showTaxRejectModal"
                >
                  退税驳回
                </Button>
              </span>
            </span>
          </p>
          <Form
            ref="editFormRef"
            :model="editForm"
            :rules="editFormRules"
            :label-width="140"
          >
            <div class="basicInfo">
              <p>
                公司信息
                <!-- 待提交资料，待审核，资料驳回 显示修改按钮，再次修改表单 -->
                <span
                  style="float:right;"
                  v-if="status == 80 || status == 81 || status == 83"
                >
                  <Button type="text" @click="isEdit = true">修改</Button>
                </span>
              </p>

              <FormItem
                label="VAT税号："
                style="width:480px"
                prop="vatTaxNum"
                :error="editForm.vatTaxNumError"
              >
                <Input
                  v-model="editForm.vatTaxNum"
                  placeholder="请输入英国VAT税号"
                  :disabled="!isEdit"
                  @on-blur="searchVatInfo"
                ></Input>
              </FormItem>
              <FormItem
                label="公司中文名称："
                style="width: 480px"
                prop="companyNameZh"
              >
                <Input
                  v-model="editForm.companyNameZh"
                  placeholder="公司中文名称"
                  disabled
                ></Input>
              </FormItem>
              <FormItem
                label="公司英文名称："
                style="width: 480px"
                prop="companyNameEn"
              >
                <Input
                  v-model="editForm.companyNameEn"
                  placeholder="公司英文名称"
                  disabled
                ></Input>
              </FormItem>
              <FormItem
                label="退税周期："
                style="width: 480px"
                prop="refundMonth"
              >
                <div style="display: flex; width: 480px">
                  <DatePicker
                    type="month"
                    v-model="editForm.startYearMon"
                    placeholder="退税开始月份"
                    :disabled="!isEdit"
                    @on-change="editForm.endYearMon = ''"
                    style="width: 130px; margin-right: 10px"
                  ></DatePicker>
                  <span style="margin-right:8px;">到</span>
                  <DatePicker
                    type="month"
                    v-model="editForm.endYearMon"
                    placeholder="退税结束月份"
                    :disabled="!isEdit || !editForm.startYearMon"
                    style="width: 130px"
                    :options="endYearMonOptions"
                  ></DatePicker>
                </div>
              </FormItem>
              <FormItem
                label="退税金额："
                style="width: 480px"
                prop="refundMoney"
              >
                <Input
                  v-model="editForm.refundMoney"
                  placeholder="请输入退税金额（GBP）"
                  :disabled="!isEdit"
                >
                  <span slot="append">英镑</span>
                </Input>
              </FormItem>
            </div>
            <div class="declareData">
              <p>退款账户</p>
              <FormItem
                label="Account Name："
                style="width: 480px"
                prop="accountName"
              >
                <Input
                  v-model="editForm.accountName"
                  placeholder="请输入Account Name"
                  :disabled="!isEdit"
                ></Input>
              </FormItem>
              <FormItem
                label="Account number："
                class="requiredItem"
                style="width: 480px"
                prop="accountNumber"
              >
                <Input
                  v-model="editForm.accountNumber"
                  placeholder="请输入Account number"
                  :disabled="!isEdit"
                ></Input>
              </FormItem>
              <FormItem
                label="sort code："
                class="requiredItem"
                style="width: 480px"
                prop="sortCode"
              >
                <Input
                  v-model="editForm.sortCode"
                  placeholder="请输入sort code"
                  :disabled="!isEdit"
                ></Input>
              </FormItem>
            </div>
          </Form>
        </Card>
        <div class="submit-btn" v-if="isEdit">
          <Button
            v-if="
              serviceInfo.progressBar == 80 || serviceInfo.progressBar == 81
            "
            type="default"
            style="width:80px;margin-right:10px;"
            @click="handleSave"
          >
            保存
          </Button>
          <Button
            v-if="
              serviceInfo.progressBar == 80 || serviceInfo.progressBar == 83
            "
            type="primary"
            style="width:80px;"
            @click="handleSubmit"
          >
            提交
          </Button>
        </div>
      </div>

      <!-- 右侧信息 -->
      <div class="content-r">
        <Card>
          <p slot="title">服务信息</p>
          <Form :label-width="110">
            <FormItem label="订单号：">{{ serviceInfo.orderNo }}</FormItem>
            <FormItem label="服务号：">{{ serviceInfo.serverNo }}</FormItem>
            <FormItem label="服务状态：">
              {{
                serviceInfo.progressBar == 80
                  ? "待上传退税资料"
                  : serviceInfo.progressBar == 81
                  ? "退税待审核"
                  : serviceInfo.progressBar == 86
                  ? "退税中"
                  : serviceInfo.progressBar == 83
                  ? "退税资料驳回"
                  : serviceInfo.progressBar == 82
                  ? "退税已关闭"
                  : serviceInfo.progressBar == 85
                  ? "退税已完成"
                  : "暂无"
              }}
            </FormItem>
            <FormItem label="退税国家：">{{
              serviceInfo.countryNameZh
            }}</FormItem>
            <FormItem label="创建时间：">{{ serviceInfo.createTime }}</FormItem>
            <FormItem label="审核通过时间：">
              {{ serviceInfo.checkPassTime }}
            </FormItem>
            <FormItem label="退税截至时间：">
              {{ serviceInfo.expirationTime }}
            </FormItem>
            <FormItem label="退税完成时间：">
              {{ serviceInfo.completeTime }}
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;">
          <p slot="title">用户信息</p>
          <Form :label-width="110">
            <FormItem label="用户昵称：">{{ userInfo.userNickname }}</FormItem>
            <FormItem label="用户手机号：">
              {{ userInfo.userMobile }}
            </FormItem>
            <FormItem label="用户等级：">-</FormItem>
            <FormItem label="公司名称：">{{
              userInfo.userCompanyName
            }}</FormItem>
            <FormItem label="地址：">{{ userInfo.userAddress }}</FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px;" class="operationLogs">
          <p slot="title">操作记录</p>
          <div class="logsContent">
            <div v-for="(row, index) in operateRecords" :key="index">
              <div>
                <p class="itemTop">{{ row.instruction }}</p>
                <p>备注：{{ row.remark }}</p>
                <p class="itemBottom">
                  <span style="margin-right:10px;">
                    时间：{{ row.createTime }}
                  </span>
                  <span>
                    操作人：{{ row.adminUserNickName || row.adminUserMobile }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- 弹框信息 -->
    <!-- 退税驳回 -->
    <Modal v-model="taxRejectModal" title="退税驳回">
      <div>
        <div class="content-text">
          <div style="font-size:14px; margin-bottom:10px;">
            <font color="red">*</font> 驳回原因：
          </div>
          <Input
            v-model="rejectResultContent"
            type="textarea"
            :rows="4"
            :maxlength="500"
            show-word-limit
            placeholder="请输入退税驳回原因"
          />
        </div>
      </div>
      <div slot="footer">
        <Button type="default" size="large" @click="taxRejectModal = false">
          取消
        </Button>
        <Button type="primary" size="large" @click="handleSubmitReject">
          确定
        </Button>
      </div>
    </Modal>
    <!-- 审核操作，通过和不通过 -->
    <Modal v-model="passRefundModal" title="审核资料">
      <div>
        <div style="margin-bottom:20px;">
          <RadioGroup v-model="passRefundStatus">
            <Radio label="1">通过</Radio>
            <Radio label="2">资料不对，驳回</Radio>
          </RadioGroup>
        </div>
        <div class="content-text" v-if="passRefundStatus == 2">
          <div style="font-size:14px; margin-bottom:10px;">
            <font color="red">*</font> 驳回原因：
          </div>
          <Input
            v-model="rejectResultContent"
            type="textarea"
            :rows="4"
            :maxlength="500"
            show-word-limit
            placeholder="请输入退税驳回原因"
          />
        </div>
      </div>
      <div slot="footer">
        <Button type="default" size="large" @click="passRefundModal = false">
          取消
        </Button>
        <Button type="primary" size="large" @click="handleSubmitPass">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  refundDetail,
  refundSubmit,
  auditRefund,
  rejectRefund,
  taxNumInfo
} from "@/api/taxRefund/gbRefund";
export default {
  props: { status: Number, serviceId: String, countryCode: String },
  data() {
    return {
      // 是否可以编辑，服务单在某些状态下可以更改
      isEdit: false,
      // 编辑信息
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
        sortCode: ""
      },
      editFormRules: {
        vatTaxNum: [
          {
            required: true,
            message: "请输入英国VAT税号",
            trigger: ["blur", "change"]
          }
        ],
        companyNameZh: [
          {
            required: true,
            message: "请输入公司中文名称",
            trigger: "blur"
          }
        ],
        companyNameEn: [
          {
            required: true,
            message: "请输入公司英文名称",
            trigger: "blur"
          }
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
            trigger: "change"
          }
        ],
        refundMoney: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value != null && value != undefined) {
                if (
                  !/(^[1-9][0-9]*$)|(^[1-9][0-9]*\.[0-9]{1,2}$)|(^0\.[0-9]{1,2}$)|(^0$)/.test(
                    value
                  )
                ) {
                  callback(new Error("请输入正确的数字金额，最多保留两位小数"));
                } else {
                  callback();
                }
              } else {
                callback(new Error("请输入退税金额（GBP）"));
              }
            },
            trigger: "blur"
          }
        ],
        accountName: [
          {
            required: true,
            message: "请输入Account Name",
            trigger: "blur"
          }
        ],
        accountNumber: [
          {
            required: true,
            message: "请输入Account number",
            trigger: "blur"
          },
          {
            required: true,
            pattern: /^[0-9]{1,8}$/,
            message: "提示：8位数字",
            trigger: "blur"
          }
        ],
        sortCode: [
          {
            required: true,
            message: "请输入sort code",
            trigger: "blur"
          },
          {
            required: true,
            pattern: /^[0-9]{1,6}$/,
            message: "提示：6位数字",
            trigger: "blur"
          }
        ]
      },

      // 月份控制，结束日期只能在3个月内
      endYearMonOptions: {
        disabledDate: date => {
          if (this.editForm.startYearMon) {
            let startDate = new Date(this.editForm.startYearMon.valueOf());
            // 开始时间的3个月内允许选择
            let minMonth = startDate.setMonth(startDate.getMonth());
            let maxMonth = startDate.setMonth(startDate.getMonth() + 2);
            return date.getTime() < minMonth || date.getTime() > maxMonth;
          } else {
            return true;
          }
        }
      },

      // 服务信息
      serviceInfo: {},
      // 用户信息
      userInfo: {},
      // 操作记录
      operateRecords: [],

      // 退税驳回操作
      taxRejectModal: false,
      rejectResultContent: "", // 驳回原因

      // 资料审核操作
      passRefundModal: false,
      passRefundStatus: "" // 审核的状态，通过和驳回
    };
  },
  created() {
    this.getDetailInfo();
  },
  mounted() {},
  methods: {
    /**
     * 查询退税单详情，包括表单数据，右侧服务信息，用户信息，操作记录
     */
    getDetailInfo() {
      refundDetail({ serviceId: this.serviceId }).then(res => {
        if (res.code == 0) {
          // 退税信息
          this.editForm.vatTaxNum =
            res.data.vatTaxRefund.vatTaxNum || "16/9999/9999";
          this.editForm.companyNameZh = res.data.vatTaxRefund.companyNameZh;
          this.editForm.companyNameEn = res.data.vatTaxRefund.companyNameEn;
          this.editForm.startYearMon = res.data.vatTaxRefund.startYearMon;
          this.editForm.endYearMon = res.data.vatTaxRefund.endYearMon;
          this.editForm.refundMoney = res.data.vatTaxRefund.refundMoney;
          this.editForm.accountName = res.data.vatTaxRefund.accountName;
          this.editForm.accountNumber = res.data.vatTaxRefund.accountNumber;
          this.editForm.sortCode = res.data.vatTaxRefund.sortCode;

          // 服务信息
          this.serviceInfo = res.data.orderServices;
          this.serviceInfo.orderNo = res.data.orderNo;

          // 用户信息
          this.userInfo = res.data.orderServices;

          // 操作日志
          this.operateRecords = res.data.consoleOperationLogs;
        } else {
          this.$Message.warning("获取详情失败，请重新尝试");
        }
      });
    },

    /**
     * vat税号文本框失去焦点查询信息
     */
    searchVatInfo() {
      if (!this.editForm.vatTaxNum) {
        this.editForm.companyNameZh = "";
        this.editForm.companyNameEn = "";
        return;
      }
      taxNumInfo({
        taxNum: this.editForm.vatTaxNum,
        userId: this.serviceInfo.userId,
        countryCode: this.countryCode
      }).then(res => {
        if (res.code == 0 && Object.keys(res.data).length > 0) {
          this.editForm.companyNameZh = res.data.companyNameZh;
          this.editForm.companyNameEn = res.data.companyNameEn;
        } else {
          this.editForm.companyNameZh = "";
          this.editForm.companyNameEn = "";
          this.editForm.vatTaxNumError =
            "异常：系统查询到该税号不存在或不属于您，无法进行退税操作";
        }
      });
    },

    /**
     * 退税驳回提交原因
     */
    showTaxRejectModal() {
      this.taxRejectModal = true;
      this.rejectResultContent = "";
    },
    handleSubmitReject() {
      // 校验输入
      if (!this.rejectResultContent) {
        this.$Message.warning("请输入驳回原因");
        return;
      }
      // 请求后台接口
      rejectRefund({
        serviceId: this.serviceId,
        status: 2,
        remark: this.rejectResultContent
      }).then(res => {
        if (res.code == 0) {
          this.taxRejectModal = false;
          this.$Message.success("操作成功");
          this.goBack();
          this.$emit("refresh");
        } else {
          this.$Message.error("资料驳回操作失败，请重新尝试");
        }
      });
    },
    /**
     * 审核资料，通过和不通过
     */
    showPassRefundModal() {
      this.passRefundModal = true;
      this.passRefundStatus = "";
      this.rejectResultContent = "";
    },
    handleSubmitPass() {
      // 校验输入
      if (!this.passRefundStatus) {
        this.$Message.warning("请选择审核结果");
        return;
      }
      if (!this.rejectResultContent && this.passRefundStatus == 2) {
        this.$Message.warning("请输入驳回原因");
        return;
      }
      // 请求后台接口
      auditRefund({
        serviceId: this.serviceId,
        status: this.passRefundStatus,
        remark: this.rejectResultContent
      }).then(res => {
        if (res.code == 0) {
          this.passRefundModal = false;
          this.$Message.success("操作成功");
          this.goBack();
          this.$emit("refresh");
        } else {
          this.$Message.error("审核操作失败，请重新尝试");
        }
      });
    },

    /**
     * 点击保存
     */
    handleSave() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          let params = { ...this.editForm };
          // 追加额外传参
          params.refundCurrUnit = "GBP";
          params.startYearMon = this.translateYearMon(
            this.editForm.startYearMon
          );
          params.endYearMon = this.translateYearMon(this.editForm.endYearMon);
          params.taxRefundInterval =
            this.translateYearMon(this.editForm.startYearMon) +
            "~" +
            this.translateYearMon(this.editForm.endYearMon);
          params.operation = 1;
          params.orderServicesId = this.serviceId;
          // 请求后台
          refundSubmit(params).then(res => {
            if (res.code == 0) {
              this.$Message.success("保存成功");
              this.isEdit = false;
              this.$emit("refresh");
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
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          let params = { ...this.editForm };
          // 追加额外传参
          params.refundCurrUnit = "GBP";
          params.startYearMon = this.translateYearMon(
            this.editForm.startYearMon
          );
          params.endYearMon = this.translateYearMon(this.editForm.endYearMon);
          params.taxRefundInterval =
            this.translateYearMon(this.editForm.startYearMon) +
            "~" +
            this.translateYearMon(this.editForm.endYearMon);
          params.operation = 2;
          params.orderServicesId = this.serviceId;
          // 请求后台
          refundSubmit(params).then(res => {
            if (res.code == 0) {
              this.$Message.success("提交成功");
              this.goBack();
              this.$emit("refresh");
            } else if (code == 1002) {
              this.$Modal.warning({
                title: "提交异常提醒",
                content: res.message
              });
            } else {
              this.$Message.error("资料填写有误");
            }
          });
        }
      });
    },
    // 转换日期
    translateYearMon(date) {
      console.log(111, date);
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1))
      );
    },
    /**
     * 返回列表
     */
    goBack() {
      this.$emit("back");
    }
  }
};
</script>
<style lang="less" scoped>
.country-list {
  display: flex;
  font-size: 16px;
  margin-top: 5px;
  .country-list-left {
    width: 176px;
  }
}
.back {
  height: 30px;
  line-height: 30px;
  background-color: #fff;
  margin-bottom: 5px;
  .backBtn {
    width: 200px;
    cursor: pointer;
  }
}
.content {
  display: flex;

  .content-l {
    flex: 1;

    .declareFileBox {
      display: flex;
      justify-content: space-between;
      height: 40px;
      .span {
        display: inline-block;
        &:first-child {
          margin-right: 8px;
        }
      }
      .view {
        margin-right: 10px;
      }
    }
    .basicInfo {
      border-bottom: 1px solid #ddd;
      margin-bottom: 10px;
    }
    .declareData {
      margin-top: 20px;
    }
    .submit-btn {
      margin-top: 30px;
      text-align: center;
    }
  }
  .content-r {
    width: 360px;
    margin-left: 10px;
    /deep/ .ivu-form-item {
      margin-bottom: 0px;
    }
    .operationLogs {
      max-height: 400px;
      overflow-y: auto;
      .logsContent {
        font-size: 12px;
      }
      .itemTop {
        font-weight: bold;
      }
      .itemBottom {
        margin-bottom: 10px;
        border-bottom: 1px #f2f2f2 dashed;
        padding-bottom: 5px;
      }
    }
  }
}
::v-deep .ivu-card-head {
  padding: 4px 16px;
  p {
    height: 34px;
    line-height: 34px;
  }
}
&::v-deep .ivu-select-dropdown-list {
  max-height: 480px;
}
::v-deep .ivu-row {
  margin: 8px 0;
}
.wrap {
  word-break: break-all;
}
</style>
