<template>
  <div class="orderDetails">
    <div class="goBack" @click="goBack">
      <Card>返回列表</Card>
    </div>
    <div class="banner">
      <span>订单状态：{{ statusList[addForm.status] }}</span>
      <p>
        <template v-if="currentStatus">
          <Button
            type="default"
            style="margin-right: 10px"
            @click="cancelEdit()"
            >取消</Button
          >
          <Button
            type="primary"
            :loading="submitLoading"
            style="margin-right: 10px"
            @click="submit()"
            >保存</Button
          >
        </template>
        <template v-if="!currentStatus">
          <Button
            @click="cancelOrder"
            v-if="addForm.status == 8 || addForm.status == 1"
            v-show="hasAuthority('orderDetails_cancelOrder')"
            style="margin-right: 10px"
            type="primary"
            >取消订单</Button
          >
          <Button
            v-if="addForm.status == 8 || addForm.status == 10"
            @click="currentStatus = true"
            v-show="hasAuthority('orderDetails_edit')"
            type="primary"
            style="margin-right:10px;"
            >修改</Button
          >
          <Button
            @click="checkOrder"
            v-if="addForm.status == 8"
            v-show="hasAuthority('orderDetails_check')"
            type="primary"
            >审核订单</Button
          >
        </template>
      </p>
    </div>
    <!-- 订单信息 -->
    <div class="titleBlack">
      <p>
        <Icon type="md-bookmark" />
        <span class="title">订单信息</span>
      </p>
    </div>
    <table class="orderInfoTable">
      <tbody>
        <tr>
          <td style="background:#f8f8f8;width:20%;">订单号</td>
          <td style="width:30%;">{{ addForm.orderNo }}</td>
          <td style="background:#f8f8f8;width:20%;">订单来源</td>
          <td style="width:30%;">
            {{
              ["PC网页端", "小程序", "H5端", "", "", "后台录入"][
                addForm.orderSource
              ]
            }}
          </td>
        </tr>
        <tr>
          <td style="background:#f8f8f8;width:20%;">创建时间</td>
          <td style="width:30%;">{{ addForm.createTime }}</td>
          <td style="background:#f8f8f8;width:20%;">创建人</td>
          <td style="width:30%;">{{ addForm.createName }}</td>
        </tr>
      </tbody>
    </table>
    <Form
      class="addForm"
      ref="addForm"
      :model="addForm"
      :rules="ruleInline"
      :label-width="110"
    >
      <FormItem label="所属公司：" prop="companyBody">
        <Select
          :disabled="!currentStatus"
          v-model="addForm.companyBody"
          @on-change="companyBodyChange($event)"
          style="width:240px;"
          placeholder="请选择所属公司"
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
          :disabled="!currentStatus"
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
        <Button type="primary" @click="addProductInfo" v-if="currentStatus"
          >新增</Button
        >
        <Button
          v-if="addForm.status === 2 || addForm.status === 5"
          type="primary"
          @click="requestRefund"
          >申请退款</Button
        >
      </div>
      <Table :columns="productColumns" :data="productInfo" border v-if="addForm.status == 8 || addForm.status == 10">
        <template slot="productInfo" slot-scope="{ index }">
          <div v-if="currentStatus">
            <Select
              clearable
              v-model="productInfo[index].countryCode"
              style="width:240px;margin-right:10px;"
              placeholder="服务国家"
              @on-change="countryCodeChange($event, index)"
              :disabled="!currentStatus"
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
              :disabled="!currentStatus"
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
          </div>
          <div v-if="!currentStatus">
            {{ productInfo[index].countryNameZh
            }}{{ productInfo[index].productName }}
          </div>
        </template>
        <template slot="quantity" slot-scope="{ index }">
          <div v-if="currentStatus">
            <InputNumber
              :max="5000"
              :min="0"
              :active-change="false"
              :precision="2"
              v-model="productInfo[index].quantity"
              @on-change="quantityChange($event, index)"
              :disabled="!currentStatus"
              clearable
            ></InputNumber>
          </div>
          <div v-if="!currentStatus">{{ productInfo[index].quantity }}</div>
        </template>
        <template slot="operation" slot-scope="{ row, index }">
          <p
            class="button"
            v-if="currentStatus"
            @click="deleteProductInfo(index)"
          >
            删除
          </p>
          <Poptip
            placement="right"
            width="400"
            v-if="addForm.status != 8 && addForm.status != 10"
          >
            <p class="button" @click="getOrderProductInfo(row)">
              【订单详情】
            </p>
            <div slot="content">
              <table class="defindTable">
                <thead>
                  <tr>
                    <th style="padding:10px;">服务单号</th>
                    <th style="padding:10px;">服务状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in orderProductInfo">
                    <td style="padding:10px;">{{ item.serverNo }}</td>
                    <td style="padding:10px;">
                      {{ workOrderStatus[item.progressBar] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Poptip>
        </template>
      </Table>
      <Table :columns="productSeparateColumns" @on-selection-change="selectData" :data="orderBuyProductList" border v-if="!(addForm.status == 8 || addForm.status == 10)">
        <template slot="productInfo" slot-scope="{ index }">
          <div>
            {{ orderBuyProductList[index].countryNameZh
            }}{{ orderBuyProductList[index].productName }}
          </div>
        </template>
        <template slot="quantity" slot-scope="{ index }">
          <div v-if="currentStatus">
            <InputNumber
              :max="5000"
              :min="0"
              :active-change="false"
              :precision="2"
              v-model="orderBuyProductList[index].quantity"
              @on-change="quantityChange($event, index)"
              :disabled="!currentStatus"
              clearable
            ></InputNumber>
          </div>
          <div v-if="!currentStatus">{{ orderBuyProductList[index].quantity }}</div>
        </template>
        <template slot="progressBar" slot-scope="{ row, index }">
          <p>{{ workOrderStatus[orderBuyProductList[index].progressBar] }}</p>
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
          <div v-if="currentStatus">
            <InputNumber
              :max="costDTO[index].totalAmount"
              :min="0"
              :active-change="false"
              :precision="0"
              v-model="costDTO[index].discountedPrice"
              @on-change="couponMoneyChange($event, index)"
              clearable
            ></InputNumber>
          </div>
          <div v-if="!currentStatus">{{ costDTO[index].discountedPrice }}</div>
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
        <p v-if="currentStatus">
          <span class="btnClass" @click="openEditUserModal">【编辑用户】</span>
        </p>
      </div>
      <table class="orderInfoTable">
        <tbody>
          <tr>
            <td style="background:#f8f8f8;">用户账号</td>
            <td style="background:#f8f8f8;">合同公司名称</td>
          </tr>
          <tr>
            <td>{{ addForm.userMobile }}</td>
            <td>{{ addForm.companyName }}</td>
          </tr>
        </tbody>
      </table>
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
              :disabled="!currentStatus || addForm.paymentType == 3"
              >不开发票</Radio
            >
            <Radio
              label="1"
              style="margin-right:50px;"
              :disabled="!currentStatus || addForm.paymentType == 3"
              >增值税普通发票</Radio
            >
            <Radio
              label="2"
              style="margin-right:50px;"
              :disabled="!currentStatus || addForm.paymentType == 3"
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
            <p>
              1. 申请开票需要加收增值税金额，税点为{{
                Math.floor(this.taxPoint * 100)
              }}%
            </p>
            <p>2. 建议消费满1000元开具发票</p>
          </div>
        </div>
        <div v-if="invoiceDTO.invoiceType != 3 && invoiceDTO.invoiceType">
          <FormItem prop="subjectType" label="开票主体：">
            <RadioGroup
              v-model="invoiceDTO.subjectType"
              @on-change="subjectTypeChange($event)"
            >
              <Radio
                label="1"
                :disabled="!currentStatus"
                v-if="invoiceDTO.invoiceType == 1"
                >个人</Radio
              >
              <Radio label="2" :disabled="!currentStatus">公司</Radio>
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
                  :disabled="!currentStatus"
                  placeholder="请输入名字"
                ></Input>
              </FormItem>
              <FormItem prop="idNumber" label="身份证号码：">
                <Input
                  style="width:240px"
                  v-model="invoiceDTO.idNumber"
                  :disabled="!currentStatus"
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
                  :disabled="!currentStatus"
                  placeholder="请输入公司名称"
                ></Input>
              </FormItem>
              <FormItem prop="taxIdentificationNumber" label="纳税识别号：">
                <Input
                  style="width:240px"
                  :disabled="!currentStatus"
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
                :disabled="!currentStatus"
                placeholder="请输入公司名称"
              ></Input>
            </FormItem>
            <FormItem prop="taxIdentificationNumber" label="纳税识别号：">
              <Input
                style="width:240px"
                v-model="invoiceDTO.taxIdentificationNumber"
                :disabled="!currentStatus"
                placeholder="请输入纳税识别号"
              ></Input>
            </FormItem>
            <FormItem prop="companyAddress" label="公司地址：">
              <Input
                style="width:240px"
                v-model="invoiceDTO.companyAddress"
                :disabled="!currentStatus"
                placeholder="请输入公司地址"
              ></Input>
            </FormItem>
            <FormItem prop="companyTel" label="公司电话：">
              <Input
                style="width:240px"
                v-model="invoiceDTO.companyTel"
                :disabled="!currentStatus"
                placeholder="请输入公司电话"
              ></Input>
            </FormItem>
            <FormItem prop="openingBank" label="开户银行：">
              <Input
                style="width:240px"
                v-model="invoiceDTO.openingBank"
                :disabled="!currentStatus"
                placeholder="请输入开户银行"
              ></Input>
            </FormItem>
            <FormItem prop="bankAccount" label="开户账号：">
              <Input
                style="width:240px"
                v-model="invoiceDTO.bankAccount"
                :disabled="!currentStatus"
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
        <p>
          <span
            v-if="
              !currentStatus &&
              (addForm.status != 2 || addForm.status != 3) && 
              (addForm.paymentType == 2 || (addForm.paymentType == 3 && addForm.status != 8 && addForm.status != 10))
            "
            class="btnClass"
            @click="openAddOrderPaymentsModal('add')"
            v-show="hasAuthority('orderDetails_addOrEditOrderPayment')"
            >【登记款项】</span
          >
          <span
            v-if="currentStatus && addForm.paymentType == 2"
            class="btnClass"
            @click="addPaymentInfo()"
            ><Icon type="md-add" />新增</span
          >
        </p>
      </div>
      <div
        v-if="
          addForm.paymentType != 3 ||
            (addForm.paymentType == 3 && paymentInfo.length > 0)
        "
      >
        <Table
          :columns="paymentColumns"
          :data="paymentInfo"
          border
          class="paymentTable"
        >
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
          <div slot="payer" slot-scope="{ row, index }">
            <Input
              v-if="currentStatus"
              v-model="paymentInfo[index].payer"
              clearable
            />
            <span v-if="!currentStatus">{{ paymentInfo[index].payer }}</span>
          </div>
          <template slot="amount" slot-scope="{ row, index }">
            <!-- 分期付款，则分期金额由操作人员填写，正常付款则自动带入订单金额 -->
            <div v-if="currentStatus">
              <InputNumber
                :max="addForm.amount"
                :min="0"
                :active-change="false"
                v-if="paymentInfo[index].paymentType == 2"
                v-model="paymentInfo[index].amount"
                @on-change="orderAmountChange($event)"
                clearable
              >
              </InputNumber>
              <span v-if="paymentInfo[index].paymentType == 1"
                >￥{{ paymentInfo[index].amount }}</span
              >
            </div>
            <div v-if="!currentStatus">￥{{ paymentInfo[index].amount }}</div>
          </template>
          <!-- <template slot="tradeNo" slot-scope="{ row, index }">
            <Input
              v-if="currentStatus"
              v-model="paymentInfo[index].tradeNo"
              clearable
            />
            <span v-if="!currentStatus">{{ paymentInfo[index].tradeNo }}</span>
          </template> -->
          <template slot="paymentAccount" slot-scope="{ row, index }">
            <Select
              v-model="paymentInfo[index].paymentAccount"
              placeholder="收款账户"
              label-in-value
              clearable
              v-if="currentStatus"
            >
              <Option
                v-for="(v, i) in paymentaccountList"
                :value="v.id"
                :key="i"
                >{{ v.accountName }}</Option
              >
            </Select>
            <span v-if="!currentStatus">{{
              paymentaccountList.find(
                item => item.id == paymentInfo[index].paymentAccount
              )
                ? paymentaccountList.find(
                    item => item.id == paymentInfo[index].paymentAccount
                  ).accountName
                : ""
            }}</span>
          </template>
          <!-- <template slot="paymentChannel" slot-scope="{ row, index }">
            <Select
              v-model="paymentInfo[index].paymentChannel"
              placeholder="付款方式"
              label-in-value
              clearable
              v-if="currentStatus"
            >
              <Option value="1">微信</Option>
              <Option value="2">支付宝</Option>
              <Option value="3">银联</Option>
            </Select>
            <span v-if="!currentStatus && paymentInfo[index].paymentChannel == 1">微信</span>
            <span v-if="!currentStatus && paymentInfo[index].paymentChannel == 2">支付宝</span>
            <span v-if="!currentStatus && paymentInfo[index].paymentChannel == 3">银联</span>
          </template> -->
          <template slot="payOrder" slot-scope="{ row, index }">
            <Upload
              ref="uplaodFile"
              v-if="currentStatus"
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
            <a
              v-if="!currentStatus"
              :href="paymentInfo[index].paymentFile"
              target="_blank"
              >{{ paymentInfo[index].attachmentsName }}</a
            >
          </template>
          <template slot="paymentTime" slot-scope="{ row, index }">
            <Date-picker
              v-if="currentStatus"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择付款时间"
              :value="paymentInfo[index].paymentTime"
              @on-change="handleChangeDate($event, index)"
            ></Date-picker>
            <span v-if="!currentStatus">{{
              paymentInfo[index].paymentTime
            }}</span>
          </template>
          <template slot="remark" slot-scope="{ row, index }">
            <Input
              v-if="currentStatus"
              v-model="paymentInfo[index].remark"
              clearable
            />
            <span v-if="!currentStatus">{{ paymentInfo[index].remark }}</span>
          </template>
          <template slot="operation" slot-scope="{ row, index }">
            <p v-if="paymentInfo[index].reconciliationStatus == 1">已确认到账</p>
            <!-- 已对账和编辑状态不显示修改按钮 -->
            <p
              class="btnClass"
              v-if="
                !currentStatus &&
                  paymentInfo[index].reconciliationStatus != 1 &&
                  (
                    (addForm.status == 8 || addForm.status == 10) || 
                      ((addForm.status == 1 || addForm.status == 4) && paymentInfo[index].reconciliationStatus == 2)
                  )
              "
              v-show="hasAuthority('orderDetails_edit')"
              @click="openAddOrderPaymentsModal('edit', index)"
            >
              修改
            </p>
            <!-- 已对账不显示删除按钮 -->
            <p
              class="btnClass redFont"
              v-if="currentStatus"
              @click="deletePaymentInfo(row, index)"
            >
              删除
            </p>
            <p
              class="btnClass redFont"
              v-if="
                !currentStatus &&
                  paymentInfo[index].paymentType == 2 &&
                  paymentInfo[index].reconciliationStatus != 1 &&
                  (
                    (addForm.status == 8 || addForm.status == 10) || 
                      ((addForm.status == 1 || addForm.status == 4) && paymentInfo[index].reconciliationStatus == 2)
                  )
              "
              v-show="hasAuthority('orderDetails_deleteOrderPayment')"
              @click="deletePaymentInfo(row, index)"
            >
              删除
            </p>
            <!-- 已对账和审核前都不显示确认到账按钮 -->
            <p
              class="btnClass"
              v-if="
                !currentStatus &&
                  (addForm.status == 1 || addForm.status == 4) &&
                  paymentInfo[index].reconciliationStatus == 0
              "
              v-show="hasAuthority('orderDetails_ConfirmOrderPayment')"
              @click="openConfirmPaymentInfoModal(row, index)"
            >
              确认到账
            </p>
            <p
              class="btnClass"
              v-if="
                !currentStatus &&
                  (addForm.status == 1 || addForm.status == 4) &&
                  paymentInfo[index].reconciliationStatus == 0
              "
              v-show="hasAuthority('orderDetails_paymentReject')"
              @click="openPaymentRejectModal(row, index)"
            >
              款项驳回
            </p>
          </template>
        </Table>
        <div style="color: #e99d42;font-size: 12px;margin-top:5px;">
          温馨提示：财务将根据您填写的款项信息进行对账，不准确的信息会影响财务对账的效率或者审核不通过。请注意，打款时间请精确到时、分。<br />
          如果开票金额不为0，则本次付款金额 =
          订单分期金额+开票金额，否则审核不会通过
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
            :disabled="!currentStatus"
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
            :disabled="!currentStatus"
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
          :disabled="!currentStatus"
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
      </FormItem>
      <Divider />
      <!-- 日志记录 -->
      <div class="titleBlack">
        <p>
          <Icon type="md-bookmark" />
          <span class="title">日志记录</span>
        </p>
      </div>
      <Table class="costTable" :columns="logColumns" :data="logData" border>
        
      </Table>
    </Form>
    <!-- 审核订单 -->
    <Modal
      class="modal"
      v-model="orderVerifyModal"
      width="400"
      title="审核订单"
      label-position="right"
      cancelText
      :mask-closable="false"
      :closable="false"
    >
      <Form ref="attrModal" :model="orderVerifyForm" :label-width="100">
        <FormItem label="商品审核：">
          <RadioGroup v-model="orderVerifyForm.status">
            <Radio label="1">审核通过</Radio>
            <Radio label="0">审核不通过</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="理由：" v-if="orderVerifyForm.status == 0">
          <Input
            v-model="orderVerifyForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入审核不通过的理由"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="orderVerifyCancel">取消</Button>
        <Button
          type="primary"
          :loading="orderVerifyLoading"
          @click="orderVerifyConfirm"
          >确定</Button
        >
      </div>
    </Modal>
    <!-- 款项驳回 -->
    <Modal
      class="modal"
      v-model="paymentRejectModal"
      width="400"
      title="款项驳回"
      label-position="right"
      cancelText
      :mask-closable="false"
      :closable="false"
    >
      <Form ref="attrModal" :model="paymentRejectForm">
        <FormItem>
          <Input
            v-model="paymentRejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入驳回原因"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="paymentRejectCancel">取消</Button>
        <Button
          type="primary"
          :loading="paymentRejectLoading"
          @click="paymentRejectConfirm"
          >确定</Button
        >
      </div>
    </Modal>
    <!-- 取消订单 -->
    <Modal
      class="modal"
      v-model="cancelOrderModal"
      width="400"
      title="取消订单"
      label-position="right"
      cancelText
      :mask-closable="false"
      :closable="false"
    >
      <p class="boldFont">确定要取消当前订单吗？</p>
      <p class="yellowFont">提示：订单取消后，服务单也将被取消</p>
      <div slot="footer">
        <Button type="default" @click="cancelOrderCancel">取消</Button>
        <Button
          type="primary"
          :loading="cancelOrderLoading"
          @click="cancelOrderConfirm"
          >确定</Button
        >
      </div>
    </Modal>
    <!-- 编辑用户 -->
    <Modal
      class="modal"
      v-model="editUserModal"
      width="400"
      title="修改用户信息"
      cancelText
      :mask-closable="false"
      label-position="right"
      :closable="false"
    >
      <Form
        ref="attrModal"
        :model="editUserForm"
        :rules="ruleInline"
        :label-width="110"
      >
        <FormItem label="客户手机号：" prop="userMobile">
          <Input
            v-model="editUserForm.userMobile"
            placeholder="请输入完整手机号关联公司"
            style="width: 240px;"
          >
          </Input>
        </FormItem>
        <FormItem label="合同公司名称：" prop="companyName">
          <Input
            placeholder="请输入合同公司名称"
            v-model="editUserForm.companyName"
            style="width: 240px;"
          />
        </FormItem>
        <FormItem label="保留开票信息：" prop="isKeepOldInvoiceInfo">
          <RadioGroup v-model="editUserForm.isKeepOldInvoiceInfo">
            <Radio label="1">是</Radio>
            <Radio label="2">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="editUserCancel">取消</Button>
        <Button
          type="primary"
          :loading="editUserLoading"
          @click="editUserConfirm"
          >确定</Button
        >
      </div>
    </Modal>
    <!-- 确认到账 -->
    <Modal
      class="modal"
      v-model="confirmPaymentInfoModal"
      width="400"
      :title="`是否确认到账` + confirmPaymentInfoForm.confirmAmount + '元？'"
      label-position="right"
      cancelText
      :mask-closable="false"
      :closable="false"
    >
      <Form ref="attrModal" :model="confirmPaymentInfoForm" :label-width="100">
        <FormItem label="到账时间：">
          <Date-picker
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择到账时间"
            :value="confirmPaymentInfoForm.paymentTime"
            @on-change="confirmPaymentTimeChange($event, index)"
          ></Date-picker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="confirmPaymentInfoCancel">取消</Button>
        <Button
          type="primary"
          :loading="confirmPaymentInfoLoading"
          @click="confirmPaymentInfoConfirm"
          >确定</Button
        >
      </div>
    </Modal>
    <!-- 登记款项 -->
    <Modal
      class="modal"
      v-model="addOrderPaymentsModal"
      width="500"
      :title="addOrderPaymentsForm.title"
      cancelText
      :mask-closable="false"
      :closable="false"
    >
      <Form
        ref="addOrderPayments"
        :model="addOrderPaymentsForm"
        :rules="addOrderPaymentsRule"
        label-position="right"
        :label-width="100"
      >
        <FormItem label="付款方式" prop="paymentType">
          <span v-if="addForm.paymentType != 3">
            {{
              paymentTypeList.find(item => addForm.paymentType == item.code)
                ? paymentTypeList.find(item => addForm.paymentType == item.code)
                    .value
                : ""
            }}
          </span>
          <Select
            v-if="addForm.paymentType == 3"
            v-model="addOrderPaymentsForm.paymentType"
            @on-change="addOrderPaymentsPaymentTypeChange($event)"
            style="width:240px;"
            placeholder="请选择付款方式"
            clearable
          >
            <Option
              v-for="(item, i) in paymentTypeList"
              :value="item.code"
              :disabled="
                item.code == 3 ||
                  (paymentInfo.length > 0 &&
                    paymentInfo.some(el => el.paymentType != item.code))
              "
              :key="i"
            >
              {{ item.value }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="付款方" prop="payer">
          <Input
            v-model="addOrderPaymentsForm.payer"
            placeholder="请输入付款方"
            style="width:240px;"
            clearable
          />
        </FormItem>
        <FormItem
          label="订单金额"
          prop="amount"
          v-if="addOrderPaymentsForm.paymentType == 1"
        >
          <!-- <InputNumber
            v-model="addOrderPaymentsForm.amount"
            placeholder="请输入订单金额"
            style="width:240px;"
            clearable
          >
          </InputNumber> -->
          <span>{{ addOrderPaymentsForm.amount }}</span>
        </FormItem>
        <FormItem
          label="订单分期金额"
          prop="amount"
          v-if="addOrderPaymentsForm.paymentType == 2"
        >
          <InputNumber
            :active-change="false"
            :min="0"
            v-model="addOrderPaymentsForm.amount"
            @on-change="calcAddOrderPaymentsInvoiceAmount()"
            style="width:240px;"
            placeholder="请输入订单分期金额"
            clearable
          >
          </InputNumber>
          <span>（不含开票金额）</span>
        </FormItem>
        <div
          v-if="
            invoiceDTO.invoiceType != 3 &&
            ((addOrderPaymentsForm.title == '修改款项' && addOrderPaymentsForm.inputType == 0) ||
            (addOrderPaymentsForm.title == '登记款项' && (addForm.status == 8 || addForm.status == 10)))
          "
        >
          <FormItem label="是否开票" prop="invoiceStatus">
            <RadioGroup
              v-model="addOrderPaymentsForm.invoiceStatus"
              @on-change="calcAddOrderPaymentsInvoiceAmount()"
            >
              <Radio label="1" style="margin-right:10px;">是</Radio>
              <Radio label="2">否</Radio>
            </RadioGroup>
            <p class="hint">
              如果选择是，则本次付款金额 = 订单金额+发票金额，否则审核可能不通过
            </p>
          </FormItem>
          <FormItem label="开票金额" prop="invoiceMoney">
            <span>{{ addOrderPaymentsForm.invoiceMoney }}</span>
          </FormItem>
        </div>
        <!-- <FormItem label="付款流水号" prop="tradeNo">
          <Input
            v-model="addOrderPaymentsForm.tradeNo"
            style="width:240px;"
            clearable
          />
        </FormItem> -->
        <!-- <FormItem label="付款方式" prop="paymentChannel">
          <Select
            v-model="addOrderPaymentsForm.paymentChannel"
            placeholder="请选择付款方式"
            style="width:240px;"
            label-in-value
            clearable
          >
            <Option value="1">微信</Option>
            <Option value="2">支付宝</Option>
            <Option value="3">银联</Option>
          </Select>
        </FormItem> -->
        <FormItem label="收款方" prop="paymentAccount">
          <Select
            v-model="addOrderPaymentsForm.paymentAccount"
            placeholder="请选择收款方"
            style="width:240px;"
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
        </FormItem>
        <FormItem label="附件" prop="paymentFile">
          <Upload
            ref="AddOrderPaymentsUpload"
            :action="fileUpload"
            :default-file-list="addOrderPaymentsForm.defaultFileList"
            :data="{ prefix: '' }"
            :before-upload="
              file => {
                return beforeUploadAddOrderPayments(file);
              }
            "
            show-upload-list
            :on-success="
              (res, file, fileList) => {
                successHandlerAddOrderPayments(res, file, fileList);
              }
            "
            :on-remove="
              (file, fileList) => {
                removeHandlerAddOrderPayments(file, fileList);
              }
            "
            :format="['jpg', 'jpeg', 'png', 'gif']"
          >
            <div style="padding: 5px;">
              <Button type="primary" ghost>请上传</Button>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="打款时间" prop="paymentTimeRule">
          <Date-picker
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择付款时间"
            :value="addOrderPaymentsForm.paymentTime"
            @on-change="handleChangeDateAddOrderPayments($event)"
          ></Date-picker>
        </FormItem>
        <FormItem label="备注说明" prop="remark">
          <Input
            v-model="addOrderPaymentsForm.remark"
            style="width:240px;"
            placeholder="请输入备注说明"
            clearable
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click="addOrderPaymentsCancel()">取消</Button>
        <Button
          type="primary"
          :loading="addOrderPaymentsLoading"
          @click="addOrderPaymentsConfirm()"
          >确定</Button
        >
      </div>
    </Modal>
    <!-- 申请退款 -->
    <Modal
      title="申请退款"
      v-model="refundModal"
      class-name="refundModal"
      footer-hide
    >
      <Form
        :model="formLeft"
        ref="formLeft"
        label-position="left"
        :label-width="100"
        :rules="ruleForm"
      >
        <FormItem label="退款的服务：" prop="serviceName" :label-width="200">
          <Input
            v-model="formLeft.serviceName"
            type="textarea"
            disabled="disabled"
          ></Input>
        </FormItem>
        <FormItem
          label="退款金额（最多可退款金额）："
          class="money"
          prop="refundMoney"
          :label-width="250"
        >
          <Input
            v-model="formLeft.refundMoney"
            :disabled="true"
            placeholder="请输入需退款金额"
            type="number"
          ></Input
          >元
        </FormItem>
        <FormItem
          label="退款银行："
          prop="refundBank"
          :label-width="200"
        >
          <Input
            v-model="formLeft.refundBank"
            placeholder="请输入银行名称"
          ></Input>
        </FormItem>
        <FormItem
          label="退款账户："
          prop="refundAccount"
          :label-width="200"
        >
          <Input
            v-model="formLeft.refundAccount"
            placeholder="请输入银行卡号"
          ></Input>
        </FormItem>
        <FormItem
          label="收款人/公司："
          prop="refundPayee"
          :label-width="200"
        >
          <Input
            v-model="formLeft.refundPayee"
            placeholder="请输入收款人/公司全名"
          ></Input>
        </FormItem>
        <FormItem label="退款原因：" prop="refundReason" :label-width="200">
          <Input
            v-model="formLeft.refundReason"
            type="textarea"
            placeholder="请输入退款原因"
          ></Input>
        </FormItem>
        <FormItem style="text-align:center;">
          <Button type="primary" @click="submitApplication('formLeft')"
            >提交申请</Button
          >
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
import { getToken } from "@/libs/util";
import { getTaxCountry } from "@/api/taxService/common.js";
import * as API from "@/api/orderManage/addOrder";
import * as math from "mathjs"
export default {
  props: ["parentData"],
  data() {
    return {
      refundModal:false,
      ruleForm: {
        // refundMoney: [
        //     { required: true, trigger: "blur", message: "请填写最多可退款金额" },
        // ],
        refundBank: [
          { required: true, trigger: "blur", message: "请填写退款银行" }
        ],
        refundAccount: [
          { required: true, trigger: "blur", message: "请填写退款账户" }
        ],
        refundPayee: [
          { required: true, trigger: "blur", message: "请填写收款人/公司" }
        ],
        refundReason: [
          { required: true, trigger: "blur", message: "请填写退款原因" }
        ],
      },
      ModalData: [],
      formLeft:{},
      submitApplicationLoading:false,
      formLeftInvoiceMoney:0,
      // 服务状态
      workOrderStatus: {
        "0": "待上传注册资料",
        "1": "待审核",
        "3": "注册中",
        "4": "注册完成",
        "5": "待海牙认证",
        "6": "海牙认证中",
        "7": "待授权注册税号",
        "8": "资料驳回",
        "18": "申报中",
        "19": "未开始",
        "20": "未开始(已开始报税)",
        "21": "待提交申报",
        "22": "待缴纳税金",
        "23": "待审核申报",
        "24": "申报驳回",
        "25": "申报完成",
        "26": "申报失败",
        "27": "申报（标记）完成",
        "28": "待上传资料",
        "29": "转代理中",
        "31": "转代理资料待审核",
        "32": "转代理资料驳回",
        "33": "待审核税金",
        "34": "缴税凭证被驳回",
        "35": "待上传零申报凭证",
        "36": "待授权海牙认证",
        "37": "海牙认证中",
        "38": "待授权转代理",

        "39": "待上传资料",
        "40": "待审核",
        "41": "海牙认证中",
        "42": "认证完成",
        "43": "资料驳回",

        "51": "待上传资料",
        "52": "待审核",
        "53": "注销中",
        "54": "已完成",
        "55": "资料驳回",
        "56": "注销失败",

        "60": "待上传资料",
        "61": "待审核资料",
        "62": "注册中",
        "63": "资料驳回",
        "64": "注册中",
        "65": "资料驳回",
        "66": "已审核",
        "67": "授权驳回"
      },
      // 订单状态
      statusList: [
        "待付款",
        "付款待确认",
        "已付款",
        "已取消",
        "部分付款",
        "部分退款",
        "全额退款",
        "",
        "待审核",
        "",
        "审核驳回"
      ],
      currentStatus: false, //为false表示不可编辑状态，为true表示可以编辑
      // 审核订单
      orderVerifyModal: false,
      orderVerifyLoading: false,
      orderVerifyForm: {},
      // 取消订单
      cancelOrderModal: false,
      cancelOrderLoading: false,
      // 款项驳回
      paymentRejectModal:false,
      paymentRejectLoading:false,
      paymentRejectForm:{},
      // 编辑用户
      editUserModal: false,
      editUserLoading: false,
      editUserForm: {},
      // 确认到账
      confirmPaymentInfoModal: false,
      confirmPaymentInfoLoading: false,
      confirmPaymentInfoForm: {},
      // 登记款项
      addOrderPaymentsModal: false,
      addOrderPaymentsLoading: false,
      addOrderPaymentsForm: {
        amount: 0,
        paymentTimeRule: "111"
      },
      addOrderPaymentsRule: {
        paymentType: [
          {
            required: true,
            message: "请选择付款方式",
            trigger: "change"
          }
        ],
        payer: [
          {
            required: true,
            message: "请输入付款方",
            trigger: "blur"
          }
        ],
        amount: [
          {
            required: true,
            message: `请输入订单金额/订单分期金额`,
            trigger: "blur",
            type: "number"
          }
        ],
        paymentFile: [
          {
            required: true,
            message: "请上传支付凭证",
            trigger: "change"
          }
        ],
        invoiceStatus: [
          {
            required: true,
            message: "请选择是否开票",
            trigger: "change"
          }
        ],
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
            trigger: "change",
          }
        ],
        paymentAccount: [
          {
            required: true,
            message: "请选择收款方",
            trigger: "change",
            type: "number"
          }
        ],
        paymentTimeRule: [
          {
            required: true,
            message: "请选择付款时间",
            trigger: "blur"
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

      fileUpload: this.workOrderFile,
      parentCompanyList: [],
      paymentTypeList: [],
      countryList: [],
      addForm: {
        companyBody: "",
        paymentType: ""
      },
      invoiceDTO: {
        invoiceMoney: "0.0"
      },
      invoiceTypeArr: ["增值税普通发票", "增值税专用发票", "不开发票"],
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
            message: "请输入完整手机号。",
            trigger: "blur"
          }
        ],
        contractCompanyName: [
          {
            required: true,
            message: "请填写公司名称。",
            trigger: "blur"
          }
        ],
        isKeepOldInvoiceInfo: [
          {
            required: true,
            message: "请选择是否保留原开票信息。",
            trigger: "change"
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
            trigger: "change",
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
          key: "price",
          align: "center"
        },
        // {
        //   title: "建议售价（￥）",
        //   key: "costPrice",
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
          price: "",
          quantity: 0,
          amountMoney: ""
        }
      ],
      productSeparateColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "商品信息",
          slot: "productInfo",
          align: "center",
          minWidth: 350
        },
        {
          title: "原价（￥）",
          key: "price",
          align: "center"
        },
        {
          title: "优惠金额（￥）",
          key: "discAmount",
          align: "center",
          // className: "grayFont"
        },
        {
          title: "实际价格（￥）",
          key: "firmPrice",
          align: "center",
          // className: "grayFont"
        },
        {
          title: "服务单号",
          key: "serverNo",
          align: "center"
        },
        {
          title: "服务单状态",
          slot: "progressBar",
          align: "center"
        }
      ],
      orderBuyProductList: [],
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
      unit: 100000000,
      isFirstHint: true, //选择开票的第一次的时候给予提示
      paymentColumns: [
        {
          title: "付款方式",
          slot: "paymentType",
          align: "center"
        },
        {
          title: "付款方",
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
          align: "center",
          render: (h, params) => {
            return h("div", "￥" + params.row.invoiceMoney);
          }
        },
        // {
        //   title: "付款流水号",
        //   slot: "tradeNo",
        //   align: "center"
        // },
        {
          title: "付款方式",
          slot: "paymentChannel",
          align: "center"
        },
        {
          title: "收款方",
          slot: "paymentAccount",
          align: "center"
        },
        {
          title: "附件",
          slot: "payOrder",
          align: "center"
        },
        {
          title: "付款时间",
          slot: "paymentTime",
          align: "center",
          minWidth: 40
        },
        {
          title: "备注说明",
          slot: "remark",
          align: "center"
        },
        {
          title: "操作",
          slot: "operation",
          align: "center"
        }
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
          paymentTime: "",
          remark: "",
          defaultFileList: []
        }
      ],
      submitLoading: false,
      paymentaccountList: [],
      initData: {},
      editUserModal: false,
      orderProductInfo: [],
      generalTax: 0,
      specialTax: 0,
      logColumns:[
        {
          title: "序号",
          type: 'index',
          align: "center",
          width: 80,
        },
        {
          title: "内容",
          key: "operation",
          align: "center"
        },
        {
          title: "操作时间",
          key: "updateTime",
          align: "center"
        },
        {
          title: "操作人",
          key: "createName",
          align: "center"
        },
      ],
      logData:[],
    };
  },
  computed: {
    taxPoint() {
      // 普通发票税点
      if (this.invoiceDTO.invoiceType && this.invoiceDTO.invoiceType == 1) {
        return this.generalTax;
      }
      // 专用发票税点
      if (this.invoiceDTO.invoiceType && this.invoiceDTO.invoiceType == 2) {
        return this.specialTax;
      }
      return 0;
    }
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
          title: "付款方",
          slot: "payer",
          align: "center"
        },
        {
          title:
            this.addForm.paymentType == 1
              ? "订单金额"
              : this.addForm.paymentType == 2
              ? "订单分期金额"
              : "订单/订单分期金额",
          slot: "amount",
          align: "center"
        },
        {
          title: "开票金额",
          key: "invoiceMoney",
          align: "center",
          render: (h, params) => {
            return h("div", "￥" + params.row.invoiceMoney);
          }
        },
        // {
        //   title: "付款流水号",
        //   slot: "tradeNo",
        //   align: "center"
        // },
        {
          title: "付款方式",
          slot: "paymentChannel",
          align: "center"
        },
        {
          title: "收款方",
          slot: "paymentAccount",
          align: "center"
        },
        {
          title: "附件",
          slot: "payOrder",
          align: "center"
        },
        {
          title: "付款时间",
          slot: "paymentTime",
          align: "center",
          minWidth: 40
        },
        {
          title: "备注说明",
          slot: "remark",
          align: "center"
        },
        {
          title: "操作",
          slot: "operation",
          align: "center"
        }
      ];
      this.$set(this, "paymentColumns", arr);
    }
    // currentStatus(nVal, Oval) {
    //   let arr;
    //   if (!nVal) {
    //     arr = [
    //       {
    //         title: "*商品信息",
    //         slot: "productInfo",
    //         align: "center",
    //         minWidth: 350
    //       },
    //       {
    //         title: "原价（￥）",
    //         key: "price",
    //         align: "center"
    //       },
    //       {
    //         title: "建议售价（￥）",
    //         key: "costPrice",
    //         align: "center",
    //         className: "grayFont"
    //       },
    //       {
    //         title: "*数量",
    //         slot: "quantity",
    //         align: "center"
    //       },
    //       {
    //         title: "小计",
    //         key: "amountMoney",
    //         align: "center"
    //       }
    //     ];
    //   } else {
    //     arr = [
    //       {
    //         title: "*商品信息",
    //         slot: "productInfo",
    //         align: "center",
    //         minWidth: 350
    //       },
    //       {
    //         title: "原价（￥）",
    //         key: "price",
    //         align: "center"
    //       },
    //       {
    //         title: "建议售价（￥）",
    //         key: "costPrice",
    //         align: "center"
    //       },
    //       {
    //         title: "*数量",
    //         slot: "quantity",
    //         align: "center"
    //       },
    //       {
    //         title: "小计",
    //         key: "amountMoney",
    //         align: "center"
    //       },
    //       {
    //         title: "操作",
    //         slot: "operation",
    //         align: "center"
    //       }
    //     ];
    //   }
    //   this.$set(this, "productColumns", arr);
    // }
  },
  methods: {
    printFn(value){
        const precision = 14
        return Number(math.format(value,precision))
    },
    //勾选
    selectData(val) {
      this.ModalData = val;
    },
    // 申请退款
    requestRefund() {
      this.formLeft = {
        serviceName: '',
        refundMoney: 0,
        orderProductIds: '',
      }
      if (this.ModalData.length === 0) {
        this.$Message.warning('请选择要退款的服务单！')
        return
      }
      for (let index = 0; index < this.ModalData.length; index++) {
        const element = this.ModalData[index];
        this.formLeft.orderProductIds += element.orderProductId + ','
        this.formLeft.serviceName += element.productName + ';  '
        this.formLeft.refundMoney += Number(element.refundMoney);
      }
      if(this.ModalData.length != this.orderBuyProductList.filter(item=>!item._disabled).length){
        this.formLeft.refundMoney = Math.floor(this.printFn(this.formLeft.refundMoney * 100)) / 100
      }else{
        this.formLeft.refundMoney = Math.floor(this.printFn((this.printFn(Number(this.formLeft.refundMoney) + Number(this.formLeftInvoiceMoney))) * 100)) / 100
      };
      this.formLeft.orderProductIds = this.formLeft.orderProductIds.substr(0, this.formLeft.orderProductIds.length - 1)
      this.formLeft.orderId = this.addForm.id
      this.refundModal = true
    },
    // 提交申请
    submitApplication(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.submitApplicationLoading = true;
          API.addByBackstage(this.formLeft).then(res => {
            if (res.code === 0) {
              this.$Message.success('申请退款成功');
              this.refundModal = false
              this.getOrderDetail()
            }
          }).catch(error => {
            console.log(error)
          })
          .finally(()=>{
            this.submitApplicationLoading = false;
          })
        } else {
          this.$Message.error('请填写完整资料');
        }
      })
    },
    //返回列表
    goBack() {
      this.$emit("back");
    },
    // 获取日志列表
    getLogList(){
      API.logList({
        logType:'ETAX_ORDER',
        recordId:this.parentData.orderId,
      }).then(res => {
        if (res.code == 0) {
          this.logData = res.data;
        }
      });
    },
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
      self.$set(self.productInfo[index], "price", "");
      self.$set(self.productInfo[index], "costPrice", "");
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
    // 获取订单商品详情
    getOrderProductInfo(row) {
      let params = {
        orderId: row.orderId,
        productId: row.productId
      };
      API.getOrderProductInfo(params).then(res => {
        if (res.code == 0) {
          this.orderProductInfo = res.data;
        }
      });
    },
    // 开启编辑状态
    openEditStatus() {},
    // 开启审核订单弹窗
    checkOrder() {
      this.orderVerifyModal = true;
    },
    // 审核订单-取消
    orderVerifyCancel() {
      this.orderVerifyModal = false;
      this.orderVerifyForm = {};
    },
    // 审核订单-确定
    orderVerifyConfirm() {
      let self = this;
      if (this.orderVerifyForm.status == undefined) {
        this.$Message.warning("请选择是否通过！");
        return;
      }
      if (this.orderVerifyForm.status == "0" && !this.orderVerifyForm.remark) {
        this.$Message.warning("请输入审核不通过的理由！");
        return;
      }
      let params = {
        orderId: this.parentData.orderId,
        status: Number(this.orderVerifyForm.status),
        remark: this.orderVerifyForm.remark
      };
      if (this.orderVerifyForm.status == 1) {
        delete params.remark;
      }
      this.orderVerifyLoading = true;
      API.checkOrder(params)
        .then(res => {
          if (res.code == 0) {
            self.$Message.success("审核完成！");
            self.orderVerifyModal = false;
            self.orderVerifyForm = {};
            self.getOrderDetail();
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          self.orderVerifyLoading = false;
        });
    },
    // 取消订单
    cancelOrder(){
      this.cancelOrderModal = true;
    },
    // 取消订单-取消
    cancelOrderCancel() {
      this.cancelOrderModal = false;
    },
    // 取消订单-确定
    cancelOrderConfirm() {
      let self = this;
      let params = {
        orderId: this.parentData.orderId,
      };
      this.cancelOrderLoading = true;
      API.cancelOrder(params)
        .then(res => {
          if (res.code == 0) {
            self.$Message.success("订单已取消！");
            self.cancelOrderModal = false;
            self.getOrderDetail();
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          self.cancelOrderLoading = false;
        });
    },
    // 开启编辑用户弹窗
    openEditUserModal() {
      this.editUserModal = true;
      this.editUserForm = {
        userMobile: this.addForm.userMobile,
        companyName: this.addForm.companyName
      };
    },
    // 编辑用户-取消
    editUserCancel() {
      this.editUserModal = false;
      this.editUserForm = {};
    },
    // 编辑用户-确定
    editUserConfirm() {
      let self = this;
      if (!this.editUserForm.userMobile) {
        this.$Message.warning("请输入正确的客户手机号码！");
        return;
      }
      // 手机号校验
      if (!/^1[3456789]\d{9}$/.test(this.editUserForm.userMobile)) {
        this.$Message.warning("请输入正确的客户手机号码!");
        return false;
      }
      if (!this.editUserForm.companyName) {
        this.$Message.warning("请输入合同公司名称！");
        return;
      }
      if (!this.editUserForm.isKeepOldInvoiceInfo) {
        this.$Message.warning("请选择是否保留开票信息！");
        return;
      }
      if (
        (this.editUserForm.userMobile !=
          this.initData.orderBaseInfo.userMobile ||
          this.editUserForm.companyName !=
            this.initData.orderBaseInfo.companyName) &&
        this.invoiceDTO.invoiceType
      ) {
        // let params = {
        //   userMobile: self.editUserForm.userMobile
        // };
        // self.editUserLoading = true;
        // // 校验用户手机号合法性
        // API.cheakOrderUserMobile(params)
        //   .then(res => {
        //     if (res.code == 0) {
        //       self.editUserModal = false;
        //       self.editUserLoading = false;
        if (self.editUserForm.isKeepOldInvoiceInfo == 2) {
          self.$Modal.confirm({
            title: "温馨提示",
            content: `<p>系统检测到您修改了用户信息，</p><p>且选择不保留原开票信息，原开票信息将被清</p><p>空，确定不保留原开票信息吗？</p>`,
            onOk: () => {
              // 修改用户信息并重置发票信息
              self.$set(
                self.addForm,
                "userMobile",
                self.editUserForm.userMobile
              );
              self.$set(
                self.addForm,
                "companyName",
                self.editUserForm.companyName
              );
              self.$set(self, "invoiceDTO", { invoiceMoney: "0.0" });
              self.calcInvoiceMoney();
              self.editUserModal = false;
            },
            onCancel: () => {
              self.editUserModal = false;
              self.editUserForm = {};
            }
          });
        } else {
          // 选择保留原开票信息则只修改用户信息
          self.$set(self.addForm, "userMobile", self.editUserForm.userMobile);
          self.$set(self.addForm, "companyName", self.editUserForm.companyName);
          self.editUserModal = false;
        }
        // }
        // })
        // .catch(err => {
        //   console.log(err);
        // })
        // .finally(() => {
        //   self.editUserLoading = false;
        // });
      } else {
        self.$Message.info("用户信息没有发生变化！");
      }
    },
    // 开启登记款项弹窗
    openAddOrderPaymentsModal(type, index) {
      if (type == "add") {
        // 正常和分期登记款项，付款方式 == addForm.paymentType
        if (this.addForm.paymentType != 3) {
          this.$set(
            this.addOrderPaymentsForm,
            "paymentType",
            this.addForm.paymentType
          );
          this.$set(this.addOrderPaymentsForm, "title", "登记款项");
          if (this.addForm.paymentType == 1) {
            this.$set(
              this.addOrderPaymentsForm,
              "amount",
              this.costDTO[0].payableTotalAmount
            );
          }
        } else {
          this.$set(this.addOrderPaymentsForm, "title", "登记款项");
        }
        // 登记款项需清空上一次打开上传的文件
        if (this.$refs["AddOrderPaymentsUpload"]) {
          this.removeHandlerAddOrderPayments();
        }
      }
      if (type == "edit") {
        this.addOrderPaymentsForm = JSON.parse(
          JSON.stringify(this.paymentInfo[index])
        );
        this.addOrderPaymentsForm.title = "修改款项";
        this.addOrderPaymentsForm.paymentTimeRule = "111";
        this.addOrderPaymentsForm.paymentAccount = Number(
          this.addOrderPaymentsForm.paymentAccount
        );
        this.addOrderPaymentsForm.paymentChannel = "" + this.addOrderPaymentsForm.paymentChannel;
        this.addOrderPaymentsForm.paymentType =
          "" + this.paymentInfo[index].paymentType;
        if (this.addForm.paymentType == 1) {
          this.addOrderPaymentsForm.amount = this.paymentInfo[index].amount;
        }
      }
      this.addOrderPaymentsModal = true;
    },
    // 登记款项选择付款方式
    addOrderPaymentsPaymentTypeChange(val) {
      if (val == 1) {
        this.$set(
          this.addOrderPaymentsForm,
          "amount",
          this.costDTO[0].payableTotalAmount
        );
      } else {
        this.$set(this.addOrderPaymentsForm, "amount", 0);
      }
    },
    // 登记款项-取消
    addOrderPaymentsCancel() {
      this.addOrderPaymentsModal = false;
      this.addOrderPaymentsForm = {
        amount: 0
      };
    },
    // 登记款项-确定
    addOrderPaymentsConfirm() {
      let self = this;
      // 校验
      let obj = this.addOrderPaymentsForm;
      if (
        !obj.payer ||
        // !obj.tradeNo ||
        !obj.paymentAccount ||
        !obj.paymentChannel ||
        !obj.paymentFile ||
        !obj.paymentTime ||
        !obj.remark ||
        !obj.amount
      ) {
        self.$Message.warning("请登记完整的款项信息!");
        return false;
      }
      if (
        this.invoiceDTO.invoiceType != 3 &&
            ((this.addOrderPaymentsForm.title == '修改款项' && this.addOrderPaymentsForm.inputType == 0) ||
            (this.addOrderPaymentsForm.title == '登记款项' && (this.addForm.status == 8 || this.addForm.status == 10)))
      ) {
        if (!this.addOrderPaymentsForm.invoiceStatus) {
          self.$Message.warning("请选择是否开票!");
          return false;
        }
      }
      // 提交数据
      let params = {
        ...obj,
        orderId: this.parentData.orderId
      };
      self.addOrderPaymentsLoading = true;
      API.addOrUpOrderPayments(params)
        .then(res => {
          if (res.code == 0) {
            self.$Message.success("保存成功!");
            self.addOrderPaymentsLoading = false;
            self.addOrderPaymentsModal = false;
            self.addOrderPaymentsForm = {
              amount: 0
            };
            self.getOrderDetail();
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          self.addOrderPaymentsLoading = false;
        });
    },
    // 登记款项中分期金额change和开票change
    calcAddOrderPaymentsInvoiceAmount() {
      if (this.addOrderPaymentsForm.invoiceStatus == 1) {
        if (this.addOrderPaymentsForm.amount) {
          this.addOrderPaymentsForm.invoiceMoney = Number((math.chain(math.bignumber(this.addOrderPaymentsForm.amount)).multiply(math.bignumber(this.taxPoint)).done())).toFixed(2);
        }
      } else {
        this.addOrderPaymentsForm.invoiceMoney = 0;
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
            price: obj.price,
            costPrice: obj.costPrice,
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
        arr[index].price = "";
        arr[index].costPrice = "";
        this.$set(this, "productInfo", arr);
      }
    },
    // 获取税点
    getCompanyBodyTax(val) {
      // 获取税点
      if (val) {
        let params = {
          companyBody: val
        };
        API.getCompanyBodyTax(params).then(res => {
          if (res.code == 0) {
            this.generalTax = res.data.generalTax;
            this.specialTax = res.data.specialTax;
          }
        });
      } else {
        this.generalTax = 0;
        this.specialTax = 0;
      }
    },
    // 所属公司change
    companyBodyChange(val) {
      let self = this;
      this.getCompanyBodyTax(val);
      // 切换提示
      // if (val != this.initData.orderBaseInfo.companyBody) {
      this.$Modal.confirm({
        title: "重要提醒",
        content: `<p>更改归属公司，订单录入的款项信息将</p><p>会被清除，需要重新添加款项信息，</p><p>确定要更改归属公司吗？</p>`,
        onOk: () => {
          // 重置款项信息
          self.paymentInfo = [
            {
              paymentType: this.addForm.paymentType,
              payer: "",
              amount: 0,
              invoiceMoney: "",
              payOrder: "",
              // tradeNo: "",
              paymentAccount: "",
              paymentChannel: "",
              paymentTime: "",
              remark: "",
              paymentFile: "",
              defaultFileList: []
            }
          ];
          self.removeHandler("", "", 0);
          // 重新计算订单金额及开票金额
          self.calcOrderAmount();
        },
        onCancel: () => {
          self.$set(
            self.addForm,
            "companyBody",
            this.initData.orderBaseInfo.companyBody
          );
        }
      });
      // };
    },
    // 付款类型变化(需清空原来的款项信息，重新登记)
    paymentTypeChange(val) {
      let arr = [];
      let self = this;
      this.$Modal.confirm({
        title: "重要提醒",
        content: `<p>更改付款方式，订单录入的款项信息将</p><p>会被清除，需要重新添加款项信息，</p><p>确定要更改付款方式吗？</p>`,
        onOk: () => {
          //付款类型为正常付款时，重新计算订单金额，开票金额
          if (val == 1) {
            arr = [
              {
                paymentType: val,
                payer: "",
                amount: 0,
                invoiceMoney: 0,
                payOrder: "",
                // tradeNo: "",
                paymentAccount: "",
                paymentChannel: "",
                paymentTime: "",
                remark: "",
                paymentFile: "",
                defaultFileList: []
              }
            ];
            this.$set(this, "paymentInfo", arr);
            this.removeHandler("", "", 0);
            this.costDTO[0].invoiceAmount = 0;
            this.$set(this.invoiceDTO, "invoiceMoney", 0);
            this.calcOrderAmount();
          }
          // 付款类型为分期时，清空订单金额，开票金额
          if (val == 2) {
            arr = [
              {
                paymentType: val,
                payer: "",
                amount: 0,
                invoiceMoney: 0,
                payOrder: "",
                // tradeNo: "",
                paymentChannel: "",
                paymentAccount: "",
                paymentTime: "",
                remark: "",
                paymentFile: "",
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
            this.$set(this, "paymentInfo", []);
            this.costDTO[0].invoiceAmount = 0;
            this.$set(this.invoiceDTO, "invoiceMoney", 0);
            this.calcOrderAmount();
          }
        },
        onCancel: () => {
          self.$set(
            self.addForm,
            "paymentType",
            "" + this.initData.orderBaseInfo.paymentType
          );
        }
      });
    },
    // 新增商品信息
    addProductInfo() {
      this.productInfo.push({
        price: "",
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
      if (val && this.productInfo[index].price) {
        this.productInfo[index].amountMoney = this.getToFixedTwo(
          this.productInfo[index].price * this.productInfo[index].quantity
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
      let addFormAmount =
        (this.costDTO[0].totalAmount * this.unit -
          this.costDTO[0].discountedPrice * this.unit) /
        this.unit;
      this.addForm.amount = this.getToFixedTwo(addFormAmount);
      // 正常付款，计算得出
      // 分期，由操作人手动填写
      // 挂账（登记款项时可选择其他付款方式，进行编辑会出现款项信息）
      let amount =
        (this.costDTO[0].totalAmount * this.unit -
          this.costDTO[0].discountedPrice * this.unit) /
        this.unit;
      this.paymentInfo.forEach(item => {
        if (item.paymentType == 1) {
          item.amount = this.getToFixedTwo(amount);
        } else {
          item.amount = 0;
        }
      });
      this.calcInvoiceMoney();
    },
    // 计算款项信息里的开票金额
    calcInvoiceMoney() {
      if (this.invoiceDTO.invoiceType && this.invoiceDTO.invoiceType != 3) {
        let arr = JSON.parse(JSON.stringify(this.paymentInfo));
        this.addForm.invoiceMoneyTotal = 0;
        arr.forEach(item => {
          item.invoiceMoney = this.getToFixedTwo(item.amount * this.taxPoint);
          this.addForm.invoiceMoneyTotal = this.getToFixedTwo(
            (this.addForm.invoiceMoneyTotal * this.unit +
              item.invoiceMoney * this.unit) /
              this.unit
          );
        });
        this.$set(this, "paymentInfo", arr);
        this.$set(
          this.invoiceDTO,
          "invoiceMoney",
          this.addForm.invoiceMoneyTotal
        );
      } else {
        let arr = JSON.parse(JSON.stringify(this.paymentInfo));
        this.addForm.invoiceMoneyTotal = 0;
        arr.forEach(item => {
          item.invoiceMoney = 0;
        });
        this.$set(this.invoiceDTO, "invoiceMoney", 0);
        this.$set(this, "paymentInfo", arr);
      }
      this.calcInvoiceAmount();
    },
    // 计算费用信息里的开票金额
    calcInvoiceAmount() {
      //直接取款项信息里的开票金额
      this.$set(
        this.costDTO[0],
        "invoiceAmount",
        this.addForm.invoiceMoneyTotal
      );
      // 计算应付总金额
      this.calcPayableTotalMoney();
      // 计算实付金额
      this.calcActualAmount();
    },
    // 计算应付总金额(应付总金额 = 服务总金额 - 优惠金额 + 发票金额)
    calcPayableTotalMoney() {
      let payableTotalAmount =
        (this.costDTO[0].totalAmount * this.unit -
          this.costDTO[0].discountedPrice * this.unit +
          this.costDTO[0].invoiceAmount * this.unit) /
        this.unit;
      this.costDTO[0].payableTotalAmount = this.getToFixedTwo(
        payableTotalAmount
      );
    },
    // 计算实付金额(实付金额 = 订单金额or订单分期金额 + 开票金额)
    calcActualAmount() {
      //不做任何修改，直接从接口里取数据
      let amount = this.getToFixedTwo(
        this.paymentInfo.reduce((acc, cur) => (acc += cur.amount), 0)
      );
      let actualAmount =
        (amount * this.unit + this.addForm.invoiceMoneyTotal * this.unit) /
        this.unit;
      this.costDTO[0].actualAmount = this.getToFixedTwo(actualAmount);
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
        num = num.substring(0, decimal + index + 1);
      } else {
        num = num.substring(0);
      }
      return Number(parseFloat(num).toFixed(decimal));
    },
    // 保留2位小数
    getToFixedTwo(val) {
      if (typeof val == "number") {
        return this.formatDecimal(val, 2);
      } else {
        return val;
      }
    },
    // 新增款项信息
    addPaymentInfo() {
      this.paymentInfo.push({
        paymentType: "2",
        payer: "",
        amount: 0,
        invoiceMoney: "",
        payOrder: "",
        // tradeNo: "",
        paymentChannel: "",
        paymentAccount: "",
        paymentTime: "",
        remark: "",
        defaultFileList: []
      });
    },
    // 删除款项信息
    deletePaymentInfo(row, index) {
      let self = this;
      // 编辑状态，删除对应行款项信息，并重新计算开票金额
      if (this.currentStatus == true) {
        if (this.paymentInfo.length <= 1) {
          this.$Message.warning("至少需要保留一条款项信息！");
          return false;
        } else {
          this.paymentInfo.splice(index, 1);
          // 重新计算开票金额
          this.calcInvoiceMoney();
        }
      } else {
        // 非编辑状态，调用接口删除并重新请求详情数据
        this.$Modal.confirm({
          title: "删除提醒",
          content: `确定要删除该付款付款记录吗？`,
          "ok-text": "删除",
          onOk: () => {
            let params = {
              id: row.id
            };
            API.deletePayments(params)
              .then(res => {
                if (res.code == 0) {
                  self.$Message.success("删除成功！");
                  self.getOrderDetail();
                }
              })
              .catch(err => {});
          },
          onCancel: () => {}
        });
      }
    },
    // 开启确认到账弹窗
    openConfirmPaymentInfoModal(row, index) {
      this.confirmPaymentInfoForm.confirmAmount =
        (row.amount * this.unit + row.invoiceMoney * this.unit) / this.unit;
      this.confirmPaymentInfoForm.paymentId = row.id;
      this.confirmPaymentInfoModal = true;
    },
    // 确认到账时间
    confirmPaymentTimeChange(val, index) {
      this.confirmPaymentInfoForm.paymentTime = val;
    },
    // 取消确认到账
    confirmPaymentInfoCancel() {
      this.confirmPaymentInfoModal = false;
    },
    // 确认到账
    confirmPaymentInfoConfirm() {
      let self = this;
      if (!this.confirmPaymentInfoForm.paymentTime) {
        this.$Message.warning("请选择到账时间");
        return false;
      }
      let params = {
        orderId: this.parentData.orderId,
        ...this.confirmPaymentInfoForm
      };
      this.confirmPaymentInfoLoading = true;
      API.gatheringOrder(params)
        .then(res => {
          if (res.code == 0) {
            self.$Message.success("确认成功！");
            self.getOrderDetail();
            self.confirmPaymentInfoLoading = false;
            self.confirmPaymentInfoModal = false;
            self.confirmPaymentInfoForm = {};
          }
        })
        .finally(() => {
          self.confirmPaymentInfoLoading = false;
        });
    },
    // 开启款项驳回弹窗
    openPaymentRejectModal(row,index){
      this.paymentRejectForm.paymentId = row.id;
      this.paymentRejectModal = true;
    },
    // 取消款项驳回
    paymentRejectCancel() {
      this.paymentRejectModal = false;
    },
    // 款项驳回
    paymentRejectConfirm() {
      let self = this;
      let params = {
        orderId: this.parentData.orderId,
        ...this.paymentRejectForm
      };
      if (!this.paymentRejectForm.reason) {
        this.$Message.warning("请填写驳回原因！");
        return false;
      }
      this.paymentRejectLoading = true;
      API.rejectPayment(params)
        .then(res => {
          if (res.code == 0) {
            self.$Message.success("驳回成功！");
            self.getOrderDetail();
            self.paymentRejectLoading = false;
            self.paymentRejectModal = false;
            self.paymentRejectForm = {};
          }
        })
        .finally(() => {
          self.paymentRejectLoading = false;
        });
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
    // 登记款项-start
    //上传前确认
    beforeUploadAddOrderPayments(file) {
      this.fileObj = file;
      const check = this.addOrderPaymentsForm.paymentFile;
      if (check) {
        this.removeHandlerAddOrderPayments("", "", 0);
      }
      return true;
    },
    // 上传成功
    successHandlerAddOrderPayments(res, file, fileList) {
      let self = this;
      this.addOrderPaymentsForm.paymentFile = res.data.fileUrl;
      this.addOrderPaymentsForm.attachmentsName = file.name;
      // OCR识别支付宝或者微信图片付款时间
      let type = "";
      if (this.addOrderPaymentsForm.paymentAccount == 1) {
        //支付宝
        type = "2";
      } else if (this.addOrderPaymentsForm.paymentAccount == 2) {
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
              self.handleChangeDateAddOrderPayments(res.data.data.tradeTime);
            } else {
              self.handleChangeDateAddOrderPayments("");
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 移除文件
    removeHandlerAddOrderPayments(file, fileList) {
      this.addOrderPaymentsForm.defaultFileList = [];
      this.addOrderPaymentsForm.paymentFile = "";
      this.addOrderPaymentsForm.attachmentsName = "";
      this.$refs["AddOrderPaymentsUpload"].clearFiles();
    },
    // 付款时间
    handleChangeDateAddOrderPayments(val) {
      this.addOrderPaymentsForm.paymentTime = val;
      this.addOrderPaymentsForm.paymentTimeRule = val;
    },
    // 登记款项-end
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
    // 取消编辑
    cancelEdit() {
      this.currentStatus = false;
      this.getOrderDetail();
    },
    // 保存
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
          // self.paymentInfo.forEach(item => {
          //   item.paymentFile = "http://www.baidu.com";
          //   item.attachmentsName = "aaa.png";
          // });
          if (self.paymentInfo.length > 0) {
            // 款项信息校验
            if (
              self.paymentInfo.some(item => {
                return (
                  !item.payer ||
                  // !item.tradeNo ||
                  !item.amount ||
                  !item.paymentChannel ||
                  !item.paymentAccount ||
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
          if (self.paymentInfo.length == 0) {
            delete params.paymentInfo;
          }
          self.submitLoading = true;
          API.addOrder(params)
            .then(res => {
              if (res.code == 0) {
                self.$Message.success("保存成功!");
                self.submitLoading = false;
                self.currentStatus = false;
                self.getOrderDetail();
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
        orderId: this.parentData.orderId
      };
      API.orderDetail(params)
        .then(res => {
          if (res.code == 0) {
            //保留一份初始数据
            this.initData = JSON.parse(JSON.stringify(res.data));
            // 基础信息
            if (JSON.stringify(res.data.orderBaseInfo) != "{}") {
              this.addForm = res.data.orderBaseInfo;
              this.addForm.companyBody =
                "" + res.data.orderBaseInfo.companyBody;
              this.addForm.paymentType =
                "" + res.data.orderBaseInfo.paymentType;
              this.addForm.expectGatheringTimeRule = res.data.orderBaseInfo.expectGatheringTime.split(
                " "
              )[0];
              // 获取税点
              this.getCompanyBodyTax(this.addForm.companyBody);
            }
            // 商品信息
            if (JSON.stringify(res.data.productInfo) != "{}") {
              this.productInfo = res.data.productInfo;
              this.orderBuyProductList = res.data.orderBuyProductList;
              this.orderBuyProductList.forEach(item=>{
                if(!(item.status == 3 && item.refundMoney > 0)){
                  item._disabled = true;
                }else{
                  item._disabled = false;
                }
              })
              this.formLeftInvoiceMoney = res.data.invoiceMoney;
              this.productInfo.forEach((item, index) => {
                let params = {
                  countryCode: item.countryCode
                };
                API.listByCountryCode(params).then(res => {
                  if (res.code == 0) {
                    self.$set(self.productInfo[index], "productList", res.data);
                  }
                });
              });
            }
            // 费用信息
            if (JSON.stringify(res.data.costDTO) != "{}") {
              this.costDTO = [res.data.costDTO];
            }
            // 款项信息
            if (JSON.stringify(res.data.paymentInfo) != "{}") {
              this.paymentInfo = res.data.paymentInfo;
              this.paymentInfo.forEach(item => {
                item.defaultFileList = [
                  {
                    name: item.attachmentsName,
                    url: item.paymentFile
                  }
                ];
              });
            } else {
              this.paymentInfo = [];
            }
            // 发票信息
            if (JSON.stringify(res.data.invoiceDTO) != "{}") {
              this.invoiceDTO = res.data.invoiceDTO;
              this.invoiceDTO.invoiceType =
                "" + res.data.invoiceDTO.invoiceType;
              this.invoiceDTO.subjectType =
                "" + res.data.invoiceDTO.subjectType;
              this.invoiceDTO.invoiceMoney = res.data.costDTO.invoiceAmount;
            } else {
              this.invoiceDTO.invoiceType = "3";
              this.invoiceDTO.invoiceMoney = "0.0";
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
        .then(()=>{
          self.getLogList();
        })
    }
  },
  created() {
    this.getCompanyList();
    this.getPaymenttypeList();
    this.getPaymentaccountList();
    this.getCountryList();
    this.getLogList();
  },
  mounted() {
    this.getOrderDetail();
  }
};
</script>

<style scoped lang="less">
.goBack {
  height: 40px;
  line-height: 40px;
  margin-bottom: 20px;
  cursor: pointer;
  /deep/ .ivu-card {
    height: 100%;
  }
  /deep/ .ivu-card-body {
    padding: 0 15px;
  }
}
.banner {
  background: #f8f8f8;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: red;
  margin-bottom: 30px;
}
.orderDetails {
  background: #fff;
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
.orderInfoTable {
  width: 100%;
  text-align: center;
  padding: 0;
  border: 1px solid #ddd;
  border-collapse: collapse;
  margin-bottom: 20px;
  td {
    border: 1px solid #ddd;
    height: 48px;
    line-height: 48px;
  }
}
.modal {
  /deep/ .ivu-table-wrapper {
    overflow: visible !important;
  }
}
.btnClass {
  cursor: pointer;
  color: #009dd9;
  font-size: 14px;
}
.paymentTable {
  /deep/ .btnClass {
    cursor: pointer;
    color: #009dd9;
    font-size: 14px;
  }
  /deep/ .redFont {
    color: red;
  }
}
.hint {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  color: #e99d42;
  font-size: 12px;
  line-height: 20px;
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
.defindTable {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e8eaec;
  td,
  th {
    display: inline-block;
    width: 50%;
    line-height: 30px;
    border-collapse: collapse;
  }
}
/deep/ .refundModal {
  .ivu-form-item {
    display: flex;
    flex-direction: column;
  }
  .ivu-form-item-content {
    margin-left: 0px !important;
  }
  .money {
    .ivu-form-item-content {
      display: inherit;
    }
  }
}
.boldFont{
  font-size: 16px;
  font-weight: 600;
  line-height: 50px;
}
.yellowFont{
  color: #e99d42;
  font-size: 12px;
}
</style>
