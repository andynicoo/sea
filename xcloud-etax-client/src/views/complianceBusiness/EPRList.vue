<template>
  <div>
    <div class="commontitle">服务单管理</div>
    <div class="content">
      <div class="title">
        <span class="label">公司名称/服务号</span>
        <Input
          v-model="searchForm.keyword"
          clearable
          placeholder="请输入注册主体名称/服务号"
          style="width: 200px; margin-right: 32px"
        />
        <span class="label">国家</span>
        <Select
          v-model="searchForm.country"
          placeholder="请选择国家"
          style="width: 180px; margin-right: 32px"
          clearable
        >
          <Option value="FR">法国</Option>
          <Option value="DE">德国</Option>
          <Option value="AT">奥地利</Option>
          <Option value="ES">西班牙</Option>
        </Select>

        <Button type="primary" @click="handleSubmit" style="margin-left: 94px">搜索</Button>
        <Button @click="handleReset" style="margin-left: 10px">重置</Button>
        <p style="margin-top: 20px">
          <span class="label">服务状态</span>
          <RadioGroup v-model="searchForm.serviceStatus" @on-change="getList">
            <Radio v-for="(item, index) in statusList" :label="item.value" class="statusStyle" :key="index" border>
              {{ item.label }}
            </Radio>
          </RadioGroup>
        </p>
      </div>
      <div class="tabs-box">
        <div :class="statusIndex == 'undefined' ? 'active' : ''" @click="changeStatus('undefined')">全部</div>
        <div
          @click="changeStatus(node.nodeCode)"
          :class="statusIndex === node.nodeCode ? 'active' : ''"
          v-for="node in nodeList"
          :key="node.nodeId"
        >
          {{ node.nodeName }}
        </div>
      </div>
      <div class="table1">
        <Table
          :style="{ 'min-height': registerList.length == 0 ? '184px' : '' }"
          :no-data-text="'暂无处理事项'"
          :columns="columns"
          :data="registerList"
        >
          <template slot="operate" slot-scope="{ row }" style="color: #16ade9">
            <div>
              <div class="btF">
                <Button class="btF" type="text" @click="showUploadModal(row)" v-if="row.currentNodeCode == 'NODE0365'">
                  <img src="@/assets/images/survey/uploadYellow.png" alt />
                  上传缴费凭证
                </Button>
              </div>
              <div class="btF">
                <Button
                  class="btF upload-btn"
                  type="text"
                  @click="onlinePayTax(row)"
                  v-if="row.currentNodeCode == 'NODE0365' && (row.payStatus == 0 || row.payStatus == 1)"
                >
                  在线缴回收费
                </Button>

                <Button
                  class="btF upload-btn"
                  type="text"
                  @click="showPayProcessModal(row)"
                  v-if="
                    row.currentNodeCode == 'NODE0365' &&
                    row.paymentOrderNo &&
                    (row.payStatus == 2 || row.payStatus == 3)
                  "
                >
                  查看支付进度
                </Button>
              </div>

              <div
                class="btF"
                v-if="
                  (row.currentNodeCode == nodeEnum.WAIT_REVIEW ||
                    row.currentNodeCode == nodeEnum.REVIEWED ||
                    row.currentNodeCode == 'NODE0365' ||
                    row.currentNodeCode == 'NODE0366' ||
                    row.currentNodeCode == nodeEnum.AUTHORIZE_WAIT_CONFIRM ||
                    nodeEnum.REGISTERING.includes(row.currentNodeCode) ||
                    nodeEnum.REGISTER_COMPLETE.includes(row.currentNodeCode)) &&
                  row.progressBar == 1
                "
                @click.stop="toRegister(row)"
                style="color: #515b6e"
              >
                <img
                  src="@/assets/images/survey/detail.svg"
                  style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                />
                <span>查看</span>
              </div>

              <div v-if="row.serviceStatus == 1">
                <div
                  @click.stop="toRegister(row)"
                  class="btF"
                  style="color: #f79728"
                  v-if="row.currentNodeCode == nodeEnum.WAIT_UPLOAD && row.progressBar == 1"
                >
                  <img
                    src="@/assets/images/survey/shangchuan1.svg"
                    style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                  />
                  <span>提交资料</span>
                </div>

                <div
                  @click.stop="toRegister(row)"
                  class="btF"
                  style="color: #f79728"
                  v-if="row.currentNodeCode == nodeEnum.WAIT_AUTHORIZE && row.progressBar == 1"
                >
                  <img
                    src="@/assets/images/survey/shangchuan1.svg"
                    style="width: 20px; position: relative; top: 6px; margin-right: 2px"
                  />
                  <span>上传授权书</span>
                </div>

                <div
                  @click.stop="getProductInfo(row, 106, '德国WEEE注册')"
                  class="btF"
                  style="color: #5cc5f0"
                  v-if="
                    ['NODE0066', 'NODE0065', 'NODE0064', 'NODE0063'].includes(row.currentNodeCode) &&
                    !row.isBuy &&
                    row.serviceName.indexOf('德国WEEE注册') != -1
                  "
                >
                  <img
                    src="@/assets/images/shoppingCar/gowuchelan.png"
                    style="width: 20px; position: relative; top: 6px; margin-right: 2px"
                  />
                  <span>加类加品牌</span>
                </div>

                <Tooltip
                  placement="left"
                  content="已加类品，若需继续新增，请前往加类加品牌工作台最新工单操作"
                  v-if="
                    ['NODE0066', 'NODE0065', 'NODE0064', 'NODE0063'].includes(row.currentNodeCode) &&
                    row.isBuy &&
                    row.serviceName == '德国WEEE注册'
                  "
                >
                  <img
                    src="@/assets/images/shoppingCar/gowuchelan.png"
                    style="width: 20px; position: relative; top: 6px; margin-right: 2px"
                  />
                  <span>加类加品牌</span>
                </Tooltip>

                <div
                  @click.stop="getProductInfo(row, 107, '德国电池法注册')"
                  class="btF"
                  style="color: #5cc5f0"
                  v-if="
                    ['NODE0066', 'NODE0065', 'NODE0064', 'NODE0063'].includes(row.currentNodeCode) &&
                    !row.isBuy &&
                    row.serviceName.indexOf('德国电池法注册') != -1
                  "
                >
                  <img
                    src="@/assets/images/shoppingCar/gowuchelan.png"
                    style="width: 20px; position: relative; top: 6px; margin-right: 2px"
                  />
                  <span>补规格补品牌</span>
                </div>

                <Tooltip
                  placement="left"
                  content="该工单已补规格补品牌，若需继续新增，请前往EPR补规格补品牌最新工单操作"
                  v-if="
                    ['NODE0066', 'NODE0065', 'NODE0064', 'NODE0063'].includes(row.currentNodeCode) &&
                    row.isBuy &&
                    row.serviceName == '德国电池法注册'
                  "
                >
                  <img
                    src="@/assets/images/shoppingCar/gowuchelan.png"
                    style="width: 20px; position: relative; top: 6px; margin-right: 2px"
                  />
                  <span>补规格补品牌</span>
                </Tooltip>

                <div @click.stop="toRegister(row)" class="btF" style="color: #ed3e3e" v-if="row.progressBar == 2">
                  <img
                    src="@/assets/images/survey/bohui1.svg"
                    style="width: 20px; position: relative; top: 4px; margin-right: 0px"
                  />
                  <span>查看驳回原因</span>
                </div>

                <div
                  @click.stop="handleSendData(row)"
                  class="btF"
                  style="color: #5cc5f0; margin-top: 3px"
                  v-if="['NODE0065', 'NODE0265'].includes(row.currentNodeCode) && row.customerData"
                >
                  <a-icon type="file" style="font-size: 14px" /> 下载资料<span v-if="row.customerDataDownLoad"
                    >(已下载)</span
                  >
                </div>
              </div>

              <div v-if="row.serviceStatus === 14">
                <div
                  @click.stop="getProductInfo(row, 106, '德国WEEE注册')"
                  class="btF"
                  style="color: #5cc5f0"
                  v-if="
                    ['NODE0066'].includes(row.currentNodeCode) &&
                    !row.isBuy &&
                    row.serviceName.indexOf('德国WEEE注册') != -1
                  "
                >
                  <img
                    src="@/assets/images/shoppingCar/gowuchelan.png"
                    style="width: 20px; position: relative; top: 6px; margin-right: 2px"
                  />
                  <span>加类加品牌</span>
                </div>
              </div>
            </div>
          </template>
        </Table>
        <div style="margin-top: 30px; text-align: right">
          <Page :total="total" :page-size="searchForm.limit" :current="searchForm.page" @on-change="pageChange" />
        </div>
      </div>
    </div>
    <div style="height: 1px"></div>

    <Modal v-model="showPayTax" :width="850" class="online-pay-modal">
      <div slot="header">
        <span class="modal-title">在线缴纳回收费</span>
      </div>

      <div class="modal-tip">
        <p class="modal-foot-title">
          <Icon class="tip-icon" type="ios-alert" />
          温馨提示：
        </p>
        <p>
          1.
          关于官方回收费：是指境外回收机构收取的用户所应缴纳的EPR官方费用。官方确认收到款项后，才会继续处理您的后续服务。
        </p>
        <p>
          2. 关于支付方式：平台仅为您提供支付入口，不作为支付责任方，针对此官费无法出具任何形式的发票/INVOICE，请知晓。
        </p>
      </div>
      <div class="info-wrap">
        <p class="info-title">官方回收费信息</p>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">服务号：</span>
            <span class="tax-info-value">{{ detailData.serviceNo }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">服务名称：</span>
            <span class="tax-info-value">{{ detailData.serviceName }}</span>
          </Col>
        </Row>
        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">官费金额：</span>
            <span class="tax-info-value">€{{ detailData.bankPayInfosObj.officialFee }}EUR</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">备注：</span>
            <span class="tax-info-value"
              >{{ detailData.uinStr }} &nbsp;&nbsp; {{ detailData.bankPayInfosObj.invoiceNo }}</span
            >
          </Col>
        </Row>
        <p class="info-title">官方回收费信息</p>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">国际银行账号 IBAN：</span>
            <span class="tax-info-value">{{ detailData.bankPayInfosObj.ban }} </span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">银行识别码 BIC：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.bankIdentifierCode }}</span>
          </Col>
        </Row>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">银行名称 Dank Name：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.bankName }} </span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">账户名称 Account Name：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.accountName }}</span>
          </Col>
        </Row>
        <Row class="mb-15" v-if="officialBill">
          <Col span="24">
            <span class="tax-info-name">文件下载：</span>
            <span class="tax-info-value"> <a :href="officialBill" target="_blank">官方账单文件</a> </span>
          </Col>
        </Row>
      </div>

      <div class="pay-wrap">
        <p class="pay-wrap-title">选择支付方式：</p>

        <div :class="['lian-pay', payChannel == 'LIANLIANGLOBAL' ? 'active' : '']" @click="payLian">
          <img src="@/assets/images/sureOrder/lian.png" alt="" />
        </div>
      </div>

      <div slot="footer">
        <div class="footer-wrap">
          <span class="info-pay">应付回收费: €{{ detailData.bankPayInfosObj.officialFee }}EUR</span>
          <Button class="mr-15" type="primary" @click="goPay">去支付</Button>
        </div>
      </div>
    </Modal>

    <Modal v-model="showPayProcess" :width="850" class="online-pay-modal">
      <div slot="header">
        <span class="modal-title">查看支付进度</span>
      </div>

      <div class="modal-tip h-40">
        <p class="modal-foot-title">
          <Icon class="tip-icon" type="ios-alert" />
          温馨提示：在线支付平台将在缴纳时间3-7天内完成缴费，支付完成后请到对应平台下载回执凭证。
        </p>
      </div>
      <div class="info-wrap">
        <p class="info-title">官方回收费信息</p>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">服务号：</span>
            <span class="tax-info-value">{{ detailData.serviceNo }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">服务名称：</span>
            <span class="tax-info-value">{{ detailData.serviceName }}</span>
          </Col>
        </Row>
        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">官费金额：</span>
            <span class="tax-info-value">€{{ detailData.bankPayInfosObj.officialFee }}EUR</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">备注：</span>
            <span class="tax-info-value"
              >{{ detailData.uinStr }} &nbsp;&nbsp; {{ detailData.bankPayInfosObj.invoiceNo }}</span
            >
          </Col>
        </Row>
        <p class="info-title">官方回收费信息</p>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">国际银行账号 IBAN：</span>
            <span class="tax-info-value">{{ detailData.bankPayInfosObj.ban }} </span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">银行识别码 BIC：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.bankIdentifierCode }}</span>
          </Col>
        </Row>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">银行名称 Dank Name：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.bankName }} </span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">账户名称 Account Name：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.accountName }}</span>
          </Col>
        </Row>

        <p class="info-title">支付状态</p>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">支付状态： </span>
            <span class="tax-info-value"
              >{{
                detailData.payStatus === 1 || detailData.payStatus === 2
                  ? '支付中'
                  : detailData.payStatus === 3
                  ? '支付完成'
                  : ''
              }}

              <img class="refresh" @click="refreshPayProcess" src="@/assets/images/common/refreshBlue.png" alt="" />
            </span>
          </Col>
        </Row>
      </div>

      <div slot="footer">
        <Button class="mr-15" type="primary" @click="showPayProcess = false">我知道了</Button>
      </div>
    </Modal>

    <Modal v-model="showUpload" :width="850" class="online-pay-modal">
      <div slot="header">
        <span class="modal-title">上传缴费凭证</span>
      </div>

      <div class="modal-tip h-40">
        <p class="modal-foot-title">
          <Icon class="tip-icon" type="ios-alert" />
          温馨提示：在线支付平台将在缴纳时间3-7天内完成缴费，支付完成后请到对应平台下载回执凭证。
        </p>
      </div>
      <div class="info-wrap">
        <p class="info-title">官方回收费信息</p>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">服务号：</span>
            <span class="tax-info-value">{{ detailData.serviceNo }}</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">服务名称：</span>
            <span class="tax-info-value">{{ detailData.serviceName }}</span>
          </Col>
        </Row>
        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">官费金额：</span>
            <span class="tax-info-value">€{{ detailData.bankPayInfosObj.officialFee }}EUR</span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">备注：</span>
            <span class="tax-info-value"
              >{{ detailData.uinStr }} &nbsp;&nbsp; {{ detailData.bankPayInfosObj.invoiceNo }}</span
            >
          </Col>
        </Row>
        <p class="info-title">官方回收费信息</p>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">国际银行账号 IBAN：</span>
            <span class="tax-info-value">{{ detailData.bankPayInfosObj.ban }} </span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">银行识别码 BIC：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.bankIdentifierCode }}</span>
          </Col>
        </Row>

        <Row class="mb-15">
          <Col span="12">
            <span class="tax-info-name">银行名称 Dank Name：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.bankName }} </span>
          </Col>
          <Col span="12">
            <span class="tax-info-name">账户名称 Account Name：</span>
            <span class="tax-info-value"> {{ detailData.bankPayInfosObj.accountName }}</span>
          </Col>
        </Row>
        <Row class="mb-15" v-if="officialBill">
          <Col span="24">
            <span class="tax-info-name">文件下载：</span>
            <span class="tax-info-value"> <a :href="officialBill" target="_blank">官方账单文件</a> </span>
          </Col>
        </Row>
        <p class="online-pay-tips">注：付款请备注公司英文名及发票号，否则官方无法核对</p>
        <Upload
          :action="fileUpload"
          class="uploadBox"
          :format="['jpg', 'jpeg', 'png', 'pdf', '.rar', '.zip', '.doc', '.docx']"
          :on-success="
            (res, file, fileList) => {
              handleSuccess(res, file, fileList);
            }
          "
          :on-remove="
            (file, fileList) => {
              handleRemoveFile(file, fileList);
            }
          "
          :before-upload="handleBeforeUpload"
          :on-format-error="handleFormatError"
        >
          <div style="padding: 34px 0">
            <img src="@/assets/images/common/upload1.png" alt="" />
            <p style="color: #666">点击或将文件拖拽到这里上传</p>
            <p class="fileType-tip">支持扩展名：.rar .zip .doc .docx. jpeg .png .pdf .jpg...</p>
          </div>
        </Upload>
      </div>

      <div slot="footer">
        <Button class="mr-15" type="primary" @click="uploadFile">确认</Button>
      </div>
    </Modal>

    <!-- 发送资料公共弹窗 -->
    <SendDataDialog
      :item="currentItem"
      :visible="sendDialogVisible"
      @cancel="sendDialogVisible = false"
      @fetch="getList()"
    />
  </div>
</template>

<script>
import SendDataDialog from '../../../xcloud-client-components-web/module/components/sendDataDialog';
import { getEPRNodes, EPRManageList, createOrderEpr, uploadPaymentVoucher } from '@/api/taxModule';
import { newProductInfo } from '@/api/shoppingCar/shoppingCar';
import { getPayProgress } from '@/api/taxBureauService/taxBureauService';

export default {
  components: {
    SendDataDialog,
  },
  data() {
    return {
      searchForm: {
        keyword: '',
        currentNode: '',
        country: '',
        serviceStatus: '1',
        page: 1,
        limit: 10,
      },
      fileUpload: this.ImgUrl,
      showPayTax: false,
      showPayProcess: false,
      showUpload: false,
      payChannel: '',
      statusIndex: 'undefined',
      columns: [
        {
          title: '服务号',
          key: 'serviceNo',
          width: 170,
        },
        {
          title: '公司名称',
          key: 'companyNameZh',
          width: 180,
          tooltip: true,
          render(h, params) {
            let type = '暂未填写';
            if (params.row.shopNature == 2 && params.row.registrantName != '') {
              type = params.row.registrantName;
              return h(
                'Tooltip',
                {
                  props: {
                    placement: 'top',
                    content: type,
                    maxWidth: '200px',
                  },
                  style: {
                    cursor: 'pointer',
                    'white-space': 'nowrap',
                    overflow: 'hidden',
                    'text-overflow': 'ellipsis',
                    '-webkit-box-orient': 'vertical',
                  },
                },
                type
              );
            } else if (params.row.companyNameZh != '') {
              type = params.row.companyNameZh;
              return h(
                'Tooltip',
                {
                  props: {
                    placement: 'top',
                    content: type,
                    maxWidth: '200px',
                  },
                  style: {
                    cursor: 'pointer',
                    'white-space': 'nowrap',
                    overflow: 'hidden',
                    'text-overflow': 'ellipsis',
                    '-webkit-box-orient': 'vertical',
                  },
                },
                type
              );
            } else {
              return h(
                'span',
                {
                  style: {
                    color: '#999999',
                  },
                },
                type
              );
            }
          },
        },
        {
          title: '国家',
          key: 'country',
          width: 80,
        },
        {
          title: '服务名称',
          key: 'serviceName',
          minWidth: 90,
        },
        {
          title: '服务到期日期',
          key: 'expirationTime',
          render(h, params) {
            let endTime = params.row.expirationTime.slice(0, 10);
            return h('span', endTime);
          },
          width: 126,
        },
        {
          title: '服务进度',
          key: 'currentNode',
          minWidth: 120,
        },
        {
          title: '操作',
          slot: 'operate',
          width: 300,
        },
      ],
      registerList: [],
      detailData: {
        bankPayInfosObj: {},
      },
      total: 0,
      nodeList: [],
      nodeEnum: {
        WAIT_UPLOAD: 'NODE0060', //待上传资料
        WAIT_REVIEW: 'NODE0061', //待审核资料
        REVIEWED: 'NODE0062', //已审核
        WAIT_AUTHORIZE: 'NODE0063', //待授权
        AUTHORIZE_WAIT_CONFIRM: 'NODE0064', //授权待确认
        REGISTERING: ['NODE0065', 'NODE0265'], //转代理中
        REGISTER_COMPLETE: ['NODE0066', 'NODE0266'], //转代理完成
      },
      statusList: [
        { label: '全部', value: '' },
        { label: '正常', value: '1' },
        { label: '续费中', value: '14' },
        { label: '取消中', value: '11' },
        { label: '已取消', value: '9' },
      ],
      fileList: [],
      currentItem: {},
      sendDialogVisible: false,
      officialBill: '',
    };
  },
  methods: {
    handleSubmit() {
      this.searchForm.page = 1;
      this.getList();
    },
    uploadFile() {
      if (!this.fileList.length) {
        this.$Message.error('请上传文件');
        return;
      }
      const voucherFiles = this.fileList.map((v) => v.response.data.fileUrl);

      uploadPaymentVoucher({
        serviceId: this.detailData.serviceId,
        voucherFiles,
      }).then((res) => {
        if (res.code === 0) {
          this.$Message.success('上传成功');
          this.getList();
          this.showUpload = false;
          this.fileList = [];
        }
      });
    },
    refreshPayProcess() {
      getPayProgress({
        payChannel: 'LIANLIANGLOBAL',
        workOrderId: this.detailData.eprId,
        thirdPaymentOauthId: this.detailData.thirdPaymentOauthId,
      })
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('获取支付进度成功');
            if (this.detailData.payStatus != res.data) {
              this.detailData.payStatus = res.data;
            }
            this.getList();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    payLian() {
      this.payChannel = 'LIANLIANGLOBAL';
    },
    async goPay() {
      if (!this.payChannel) {
        return this.$Message.error('请选择支付平台');
      }
      const params = {
        payChannel: this.payChannel,
        eprWorkOrderId: this.detailData.eprId,
      };
      createOrderEpr(params).then((res) => {
        if (res.code === 0) {
          this.showPayTax = false;
          this.getList();
          window.open(res.data.invoiceUrl);
        }
      });
    },
    onlinePayTax(row) {
      if (row.payStatus == 1) {
        window.open(row.payUrl);
        return;
      }
      this.showPayTax = true;
      this.detailData = row;
      this.billFilesHandle(row);
      if (row.bankPayInfos) {
        this.detailData.bankPayInfosObj = JSON.parse(row.bankPayInfos);
      }
    },
    getProductInfo(row, functionCode, productName) {
      newProductInfo({
        functionCode,
        productName,
      }).then((res) => {
        console.log(res.data.records);
        if (res.data.records && res.data.records.length) {
          console.log(res.data.records[0]);

          this.$router.push({
            path: '/serviceDetail',
            query: {
              id: res.data.records[0].id,
              serviceId: row.serviceId,
              serviceType: 'EPR',
            },
          });
        }
      });
    },
    handleReset() {
      this.searchForm = {
        keyword: '',
        currentNode: '',
        country: '',
        page: 1,
        limit: 10,
        serviceStatus: '1',
      };
    },
    handleSuccess(res, file, fileList) {
      this.fileList = fileList;
    },
    handleBeforeUpload() {
      const check = this.fileList.length == 0;
      // console.log(this.AmzFileList)
      if (!check) {
        this.$Notice.warning({
          title: '最多上传一个文件',
        });
      }
      return check;
    },
    handleRemoveFile(file, fileList) {
      this.fileList = fileList;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持.rar .zip .doc .docx. jpeg .png .pdf .jpg',
      });
    },
    toRegister(row) {
      let path = [31, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108].includes(row.functionCode)
        ? '/complianceBusiness/manageDetails'
        : '/complianceBusiness/EPRDetails';
      this.$router.push({
        path,
        query: {
          status: row.currentNodeCode,
          countryNameZh: row.country,
          serviceId: row.serviceId,
          serviceName: row.serviceName,
          serviceNo: row.serviceNo,
        },
      });
    },
    pageChange(page) {
      this.searchForm.page = page;
      this.getList();
    },
    changeStatus(nodeCode) {
      if (nodeCode == 'undefined') {
        this.searchForm.currentNode = '';
      } else {
        this.searchForm.currentNode = nodeCode;
      }
      this.statusIndex = nodeCode;
      this.searchForm.page = 1;
      this.getList();
    },
    showPayProcessModal(row) {
      this.showPayProcess = true;
      this.detailData = row;
      if (row.bankPayInfos) {
        this.detailData.bankPayInfosObj = JSON.parse(row.bankPayInfos);
      }
    },
    showUploadModal(row) {
      this.showUpload = true;
      this.detailData = row;
      this.billFilesHandle(row);
      if (row.bankPayInfos) {
        this.detailData.bankPayInfosObj = JSON.parse(row.bankPayInfos);
      }
    },
    //账单处理
    billFilesHandle(row) {
      if (row.billFiles) {
        let billFiles = JSON.parse(row.billFiles);
        if (billFiles.length) {
          this.officialBill = billFiles[0];
        } else {
          this.officialBill = '';
        }
      } else {
        this.officialBill = '';
      }
    },
    getList() {
      EPRManageList(this.searchForm).then((res) => {
        if (res.code == 0) {
          this.registerList = res.data.records;
          this.total = res.data.total - 0;
        }
      });
    },
    getNodes() {
      getEPRNodes().then((res) => {
        if (res.code === 0) {
          this.nodeList = res.data;
        }
      });
    },
    // 发送弹窗
    handleSendData(item) {
      this.sendDialogVisible = true;
      this.currentItem = item;
    },
  },
  created() {
    if (this.$route.query.currentNode) {
      this.searchForm.currentNode = this.$route.query.currentNode;
      this.statusIndex = this.$route.query.currentNode;
    }
    this.getList();
    this.getNodes();
  },
};
</script>

<style lang="less" scoped>
.statusStyle {
  width: 80px;
  margin-right: 10px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  border-radius: 5px !important;
}
/deep/ .ivu-radio {
  display: none;
}
/deep/ .ivu-table-tip {
  table {
    min-height: 184px;
    font-size: 12px;
  }
}
/deep/ .ivu-tooltip-rel {
  max-width: 150px;
  display: block;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // -webkit-box-orient: vertical;
}
/deep/ .ivu-table-row {
  th,
  td {
    text-align: center;
    font-size: 12px;
  }
}
/deep/ .ivu-table-header {
  th {
    text-align: center;
    font-weight: 600;
    color: #333;
    font-size: 12px;
  }
}
/deep/ .ivu-table-wrapper {
  overflow: inherit;
}
.head {
  background-color: #ffffff;
  padding: 12px 32px;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}
.content {
  border-radius: 4px;
  margin: 24px;
  min-height: 800px;
  background-color: #ffffff;
  .title {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 20px 24px 0;
    background-color: #ffffff;
    .label {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #666666;
      margin-right: 6px;
    }
  }
  .table1 {
    padding: 24px;
    .btF {
      cursor: pointer;
    }
  }
  .tabs-box {
    border-bottom: 1px solid #f6f6f6;
    padding-left: 24px;
    display: flex;
    margin-top: 20px;
    div {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333;
      margin-right: 42px;
      padding-bottom: 6px;
      cursor: pointer;
      &.active {
        color: #1890ff;
        border-bottom: 2px solid #1890ff;
      }
      .huibiao {
        display: inline-block;
        background-color: #ff5050;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        // width: 16px;
        padding: 0 5px;
        margin-left: 2px;
      }
    }
  }
}
/deep/ .ivu-tooltip-inner {
  white-space: break-spaces !important;
}

.online-pay-modal {
  /deep/ .ivu-modal-header {
    border-radius: 4px;
    padding: 0 16px;
    background: #fff !important;
    height: 64px;
    .modal-title {
      color: #333;
      font-size: 16px;
      font-weight: 800;
      line-height: 64px;
    }
  }
  .modal-tip {
    width: 769px;
    height: 120px;
    background: #fff5e6;
    border-radius: 4px 4px 0px 0px;
    margin: 8px 0 16px 24px;
    .modal-foot-title {
      line-height: 38px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      padding-left: 24px;
    }
  }

  .h-40 {
    height: 40px;
  }
  .tax-info-name[data-v-0a48ba9f] {
    display: inline-block;
    width: 100px;
    text-align: right;
    color: #666;
    font-size: 14px;
  }
  .tax-info-value {
    color: #333;
    font-size: 14px;
  }
  .pay-wrap-title {
    color: #333;
    font-size: 18px;
    margin: 20px 0 20px 24px;
    font-weight: 800;
    font-family: PingFangSC-Medium, PingFang SC;
    span {
      font-size: 14px;
      cursor: pointer;
      color: #57a3f3;
      font-weight: 200;
      margin-left: 5px;
    }
  }
  .tip-icon {
    color: #fe9a39;
    font-size: 16px;
    vertical-align: middle;
    margin-right: 5px;
  }
}

.pay-wrap {
  overflow: hidden;
  .active {
    border: 1px solid #16ade9;
    background: url('../../assets/images/sureOrder/check-pay.png') no-repeat;
    background-position: right bottom;
  }
}
.lian-pay,
.air-pay {
  border: 1px solid #eee;
  float: left;
  width: 192px;
  height: 50px;
  background: #f8f8f8;
  border-radius: 4px;
}

.lian-pay {
  margin-left: 24px;
  padding: 16px 0 0 16px;
}
.air-pay {
  margin-left: 46px;
  padding: 16px 0 0 33px;
}
.air-pay img {
  width: 126px;
}
.lian-pay img {
  width: 160px;
}

.info-wrap {
  padding: 0 20px;
}

img.refresh {
  width: 20px;
  height: 20px;
  margin-left: 10px;
  vertical-align: middle;
  cursor: pointer;
}

.info-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin-bottom: 20px;
}

.mb-15 {
  margin-bottom: 15px;
}

.info-pay {
  color: #d9001b;
  margin-right: 10px;
  font-size: 16px;
}

.uploadBox /deep/ .ivu-upload.ivu-upload-select {
  border: 1px dashed #dcdee2;
  text-align: center;
  margin-bottom: 10px;
  width: 380px;
  height: 195px;
  margin-left: 202px;
}
/deep/ .ivu-upload-list {
  width: 380px;
  margin-left: 102px;
}
.online-pay-tips {
  color: #f00;
  margin-bottom: 10px;
}
</style>
