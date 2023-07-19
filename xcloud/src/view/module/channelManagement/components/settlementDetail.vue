<template>
  <div class="chanelDetail">
    <div class="btnHeader">
      <div @click="back"
           class="back">
        返回
      </div>
      <div v-if="JSON.stringify(detailInfo) !== '{}'">
        <Button v-if="detailInfo.channelClearingList.status === 1"
                type="primary"
                @click="auditModel = true">审核</Button>
        <Button v-if="detailInfo.channelClearingList.status === 2"
                type="primary"
                @click="taxFileModal = true">上传结算凭证</Button>
      </div>
    </div>
    <Divider></Divider>
    <div class="fontW">
      渠道信息
    </div>
    <div class="basicInfoBox"
         v-if="JSON.stringify(detailInfo) !== '{}'">
      <Row class="rowItem">
        <Col span="4"
             class="right">渠道名称：</Col>
        <Col span="8">{{detailInfo.channel.channelName}}</Col>
        <Col span="4"
             class="right">渠道登录账号：</Col>
        <Col span="8">{{detailInfo.channel.adminUserName}}</Col>
      </Row>
      <Row class="rowItem">
        <Col span="4"
             class="right">联系人：</Col>
        <Col span="8">{{detailInfo.channel.adminUserNickName}}</Col>
        <Col span="4"
             class="right">联系电话：</Col>
        <Col span="8">{{detailInfo.channel.adminUserMobile}}</Col>
      </Row>
      <Row class="rowItem">
        <Col span="4"
             class="right">联系地址：</Col>
        <Col span="8">{{detailInfo.channel.address}}</Col>
        <Col span="4"
             class="right">渠道经理：</Col>
        <Col span="8">{{detailInfo.channel.channelManager}}</Col>
      </Row>
    </div>
    <Divider></Divider>
    <div class="fontW">
      银行账户
    </div>
    <div>
      <div class="basicInfoBox"
           v-if="JSON.stringify(detailInfo) !== '{}'">
        <Row class="rowItem">
          <Col span="4"
               class="right">账户名称：</Col>
          <Col span="8">{{detailInfo.channelClearingBank.bankAccount}}</Col>
          <Col span="4"
               class="right">开户银行：</Col>
          <Col span="8">{{detailInfo.channelClearingBank.openingBank}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4"
               class="right">银行账户：</Col>
          <Col span="8">{{detailInfo.channelClearingBank.bankAccountName}}</Col>
        </Row>
      </div>
    </div>
    <Divider></Divider>
    <div class="fontW">
      结算信息
    </div>
    <div class="list-content"
         v-if="JSON.stringify(detailInfo) !== '{}'">
      <Row class="rowItem">
        <Col span="4"
             class="right">申请人：</Col>
        <Col span="8">{{detailInfo.channelClearingList.proposerName}}</Col>
      </Row>
      <Row>
        <Col span="4"
             class="right">申请结算金额：</Col>
        <Col span="8">{{detailInfo.channelClearingList.clearingMoney}}</Col>
      </Row>
      <Row>
        <Col span="4"
             class="right">结算状态：</Col>
        <Col span="8">{{detailInfo.channelClearingList.status === 1 ? '待审核' : detailInfo.channelClearingList.status === 2 ? '结算中' : detailInfo.channelClearingList.status === 3 ? '已结算' : detailInfo.channelClearingList.status === 4 ? '审核不通过': ''}}</Col>
      </Row>
      <Row>
        <Col span="4"
             class="right">结算凭证：</Col>
        <Col span="8">
        <span v-if="detailInfo.channelClearingList.clearingCertificate">
          <a :href="detailInfo.channelClearingList.clearingCertificate"
             target="_blank">结算凭证</a>
        </span>
        <span v-else>
          暂无
        </span>
        </Col>
      </Row>
      <Row>
        <Col span="4"
             class="right">结算时间：</Col>
        <Col span="8">
        {{detailInfo.channelClearingList.clearingTime}}
        </Col>
      </Row>
      <Divider></Divider>
      <formComponents :tableLoading="tableLoading"
                      :tableData="detailInfo.listDetails"
                      :columns="columns"
                      :isShowPage="false">
        <div slot="title">
          <div class="fontW">
            结算明细
          </div>
        </div>
        <div slot="titleRight"
             class="right">
          <Button style="margin-right:10px;">导出excel</Button>
        </div>
      </formComponents>
    </div>
    <Modal v-model="auditModel"
           title="审核结算">
      <Form ref="auditForm"
            :model="auditForm"
            :rules="ruleForm">
        <FormItem prop="status">
          <RadioGroup v-model="auditForm.status">
            <Radio label="1">审核通过</Radio>
            <Radio label="2">审核不通过</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="remark"
                  v-if="auditForm.status === '2'">
          <Input v-model="auditForm.remark"
                 type="textarea"
                 :rows="4"
                 placeholder="请输入不通过原因（必填）" />
        </FormItem>
      </Form>
      <div slot="footer"
           style="text-align:center;">
        <Button type="primary"
                @click="audit('auditForm')">确定</Button>
      </div>
    </Modal>
    <Modal v-model="taxFileModal"
           title="上传结算凭证">
      <Upload ref="taxFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beroreTaxUpload"
              :on-success="taxUploadSuccess"
              :on-remove="removetax"
              :format="['jpg','jpeg','png','pdf']"
              :show-upload-list="false"
              style="width:260px">
        <div style="padding: 10px 0">
          <Icon type="ios-cloud-upload"
                size="30"
                style="color: #3399ff"></Icon>
          <span>请拖拽文件到此区域上传或点击上传</span>
        </div>
      </Upload>
      <div v-if="taxCertificate !==''"
           style="margin-top:10px;">
        <a :href="taxCertificate"
           target="_blank">结算凭证</a>
        <Icon type="ios-close-circle"
              @click.stop="removeHandler" />
      </div>
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="taxFileModal=false">取消</Button>
        <Button type="primary"
                @click="sureUploadTax">确认</Button>
      </p>
    </Modal>
  </div>
</template>

<script>
import formComponents from "./formComponents"
import { channelClearingListDetail, channelCheck, clearingcertificate } from "@/api/taxService/channel";
export default {
  props: ['id'],
  data() {
    return {
      detailInfo: {},
      tableLoading: false,
      detailModel: false,
      taxFileModal: false,
      fileUpload: this.workOrderFile,
      taxCertificate: '',
      columns: [
        {
          title: '订单号',
          key: 'orderNo',
          width: 120
        },
        {
          title: '服务号',
          key: 'servicesNo',
          minWidth: 50,
        },
        {
          title: 'VAT服务名称',
          key: 'productName',
          minWidth: 50,
        },
        {
          title: '国家',
          key: 'countryNameZh',
          minWidth: 50,
        },
        {
          title: '服务金额',
          key: 'price',
          minWidth: 50,
        },
        {
          title: '实付金额',
          key: 'amountMoney',
          minWidth: 50,
        },
        {
          title: '付款时间',
          key: 'paymentTime',
          minWidth: 50,
        },
        {
          title: '返佣方式',
          key: 'rebateMethod',
          minWidth: 50,
          render(h, params) {
            return h('span', params.row.rebateMethod == 1 ? '按比例返佣' : params.row.rebateMethod == 2 ? '按金额返佣' : '无需返佣')
          },
        },
        {
          title: '返佣值',
          key: 'rebateValue',
          minWidth: 50,
          render(h, params) {
            return h('span', params.row.rebateMethod == 1 ? params.row.rebateValue + '%' : params.row.rebateMethod == 2 ? params.row.rebateValue + '元' : '')
          },
        },
        {
          title: '结算收入',
          key: 'backMoney',
          minWidth: 50,
        }
      ],
      auditModel: false,
      auditForm: {
        status: '',
        remark: '',
        refundId: this.refundId
      },
      ruleForm: {
        status: [
          { required: true, message: '请审核', trigger: 'change' }
        ],
        remark: [
          { required: true, type: 'string', message: '请输入不通过原因', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    back() {
      this.$emit('back')
    },
    getList() {

    },
    getDetail() {
      channelClearingListDetail({
        id: this.id
      }).then(res => {
        if (res.code === 0) {
          this.detailInfo = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    audit() {
      if (this.auditForm.status === '2' && this.auditForm.remark === '') {
        this.$Message.error('请输入原因')
        return
      }
      channelCheck({
        checkType: this.auditForm.status,
        remark: this.auditForm.remark,
        id: this.detailInfo.channelClearingList.id
      }).then(res => {
        if (res.code === 0) {
          this.auditModel = false
          this.$Message.success('操作成功')
          this.getDetail()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    sureUploadTax() {
      clearingcertificate({
        clearingcertificate: this.taxCertificate,
        id: this.detailInfo.channelClearingList.id
      }).then(res => {
        if (res.code === 0) {
          this.taxFileModal = false
          this.$Message.success('上传成功')
          this.getDetail()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //缴税凭证上传之前
    beroreTaxUpload() {
      let self = this;
      const check = this.taxCertificate == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    //缴税凭证上传成功
    taxUploadSuccess(res, file, fileList) {
      console.log('res', res)
      this.taxCertificate = res.data.fileUrl
    },
    //移除缴税凭证
    removetax(file) {
      this.taxCertificate = ''
    },
    removeHandler() {
      this.taxCertificate = ''
    },
  },
  components: {
    formComponents
  }
}
</script>

<style lang="less" scoped>
.chanelDetail {
  min-height: 100vh;
  .back {
    cursor: pointer;
  }
  .btnHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .basicInfoBox {
    .rowItem {
      margin-bottom: 10px;
      font-size: 12px;
    }
  }
}
.box {
  // padding: 20px 40px;
  // border-bottom: 1px solid #e8eaec;
  .content {
    font-weight: bold;
    margin-bottom: 20px;
  }
}
.promote {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20px 0;
    background: #f2f2f2;
    margin: 20px 0px;
    .item {
      width: 20%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .num {
        font-weight: bold;
        font-size: 20px;
      }
    }
  }
}
.list-content {
  margin: 0px 0px 50px;
  /deep/ .ivu-row {
    margin: 10px 0px;
  }
}
.fontW {
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: -10px;
  font-size: 16px;
}
</style>