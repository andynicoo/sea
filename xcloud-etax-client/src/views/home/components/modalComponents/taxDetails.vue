<template>
  <div class="taxBox">
    <Modal v-model="detailModel"
           title="报税详情"
           footer-hide
           :mask-closable="false"
           width="860px"
           @on-visible-change="changeState">
      <p class="baseInfo1">税号信息</p>
      <div v-if="countryCode=='GB'">
        <Row>
          <Col span="12">公司名称：{{baseData.companyName}}</Col>
          <Col span="12">报税国家：{{baseData.countryNameZh}}</Col>
        </Row>
        <Row>
          <Col span="12">申报周期：{{baseData.periodType==0?'月报':baseData.periodType==1?'季报':baseData.periodType==-1?'暂无':''}}</Col>
          <Col span="12">VAT税号：{{baseData.vatTaxNumber}}</Col>
        </Row>
        <Row>
          <Col span="12">税号生效日期：{{baseData.taxEffectiveDate}}</Col>
          <Col span="12">税号下发日期：{{baseData.taxIssueDate}}</Col>
        </Row>
        <Row>
          <Col span="12">EORI号：{{baseData.eoriNumber}}</Col>
          <Col span="12">EORI文件：
          <span v-if="baseData.eoriNumberFile==''">暂无</span>
          <a :href="baseData.eoriNumberFile"
             v-else
             target="_blank">点击查看</a>
          </Col>
        </Row>
        <Row>
          <Col span="12">VAT税号文件：
          <span v-if="baseData.vatTaxNumberFile==''">暂无</span>
          <a :href="baseData.vatTaxNumberFile"
             v-else
             target="_blank">点击查看</a>
          </Col>
          <Col span="12">VAT证书：
          <span v-if="baseData.vatCertificate==''">暂无</span>
          <a :href="baseData.vatCertificate"
             v-else
             target="_blank">点击查看</a>
          </Col>
        </Row>
        <Row>
          <Col span="12">gateway ID：{{baseData.gatewayId}}</Col>
          <Col span="12">密码：{{baseData.gatewayPassword}}</Col>
        </Row>
      </div>
      <div v-else-if="countryCode=='DE'">
        <Row>
          <Col span="12">公司名称：{{baseData.companyName}}</Col>
          <Col span="12">报税国家：{{baseData.countryNameZh}}</Col>
        </Row>
        <Row>
          <Col span="12">申报周期：{{baseData.periodType==0?'月报':baseData.periodType==1?'季报':baseData.periodType==-1?'暂无':''}}</Col>
          <Col span="12">VAT税号：{{baseData.vatTaxNumber}}</Col>
        </Row>
        <Row>
          <Col span="12">税号生效日期：{{baseData.taxEffectiveDate}}</Col>
          <Col span="12">税号下发日期：{{baseData.taxIssueDate}}</Col>
        </Row>
        <Row>
          <Col span="12">EORI号：{{baseData.eoriNumber}}</Col>
          <Col span="12">EORI文件：
          <span v-if="baseData.eoriNumberFile==''">暂无</span>
          <a :href="baseData.eoriNumberFile"
             v-else
             target="_blank">点击查看</a>
          </Col>
        </Row>
        <Row>
          <Col span="12">VAT税号文件：
          <span v-if="baseData.vatTaxNumberFile==''">暂无</span>
          <a :href="baseData.vatTaxNumberFile"
             v-else
             target="_blank">点击查看</a>
          </Col>
          <Col span="12">VAT证书：
          <span v-if="baseData.vatCertificate==''">暂无</span>
          <a :href="baseData.vatCertificate"
             v-else
             target="_blank">点击查看</a>
          </Col>
          </Col>
        </Row>
        <Row>
          <Col span="12">DE欧盟证书：
          <span v-if="baseData.deEuCertificate==''">暂无</span>
          <a :href="baseData.deEuCertificate"
             v-else
             target="_blank">点击查看</a>
          </Col>
          <Col span="12">税务副本：
          <span v-if="baseData.vatTaxNumberCopyFile==''">暂无</span>
          <a :href="baseData.vatTaxNumberCopyFile"
             v-else
             target="_blank">点击查看</a>
          </Col>
        </Row>
      </div>
      <div v-else-if="countryCode=='IT'">
        <Row>
          <Col span="12">公司名称：{{baseData.companyName}}</Col>
          <Col span="12">报税国家：{{baseData.countryNameZh}}</Col>
        </Row>
        <Row>
          <Col span="12">申报周期：{{baseData.periodType==0?'月报':baseData.periodType==1?'季报':baseData.periodType==-1?'暂无':''}}</Col>
          <Col span="12">VAT税号：{{baseData.vatTaxNumber}}</Col>
        </Row>
        <Row>
          <Col span="12">税号生效日期：{{baseData.taxEffectiveDate}}</Col>
          <Col span="12">税号下发日期：{{baseData.taxIssueDate}}</Col>
        </Row>
        <Row>
          <Col span="12">EORI号：{{baseData.eoriNumber}}</Col>
          <Col span="12">EORI文件：
          <span v-if="baseData.eoriNumberFile==''">暂无</span>
          <a :href="baseData.eoriNumberFile"
             v-else
             target="_blank">点击查看</a>
          </Col>
        </Row>
        <Row>
          <Col span="12">VAT税号文件：
          <span v-if="baseData.vatTaxNumberFile==''">暂无</span>
          <a :href="baseData.vatTaxNumberFile"
             v-else
             target="_blank">点击查看</a>
          </Col>
          <Col span="12">VAT证书：
          <span v-if="baseData.vatCertificate==''">暂无</span>
          <a :href="baseData.vatCertificate"
             v-else
             target="_blank">点击查看</a>
          </Col>
        </Row>
        <!-- <Row>
                    <Col span="12">VAT税号证书（新）：
                        <span v-if="baseData.vatCertificateNew==''">暂无</span>
                        <a :href="baseData.vatCertificateNew" v-else target="_blank">点击查看</a>
                    </Col>
                </Row> -->
      </div>
      <div v-else>
        <Row>
          <Col span="12">公司名称：{{baseData.companyName}}</Col>
          <Col span="12">报税国家：{{baseData.countryNameZh}}</Col>
        </Row>
        <Row>
          <Col span="12">申报周期：{{baseData.periodType==0?'月报':baseData.periodType==1?'季报':baseData.periodType==-1?'暂无':''}}</Col>
          <Col span="12">VAT税号：{{baseData.vatTaxNumber}}</Col>
        </Row>
        <Row>
          <Col span="12">税号生效日期：{{baseData.taxEffectiveDate}}</Col>
          <Col span="12">税号下发日期：{{baseData.taxIssueDate}}</Col>
        </Row>
        <Row>
          <Col span="12">EORI号：{{baseData.eoriNumber}}</Col>
          <Col span="12">EORI文件：
          <span v-if="baseData.eoriNumberFile==''">暂无</span>
          <a :href="baseData.eoriNumberFile"
             v-else
             target="_blank">点击查看</a>
          </Col>
        </Row>
        <Row>
          <Col span="12">VAT税号文件：
          <span v-if="baseData.vatTaxNumberFile==''">暂无</span>
          <a :href="baseData.vatTaxNumberFile"
             v-else
             target="_blank">点击查看</a>
          </Col>
          <Col span="12">VAT证书：
          <span v-if="baseData.vatCertificate==''">暂无</span>
          <a :href="baseData.vatCertificate"
             v-else
             target="_blank">点击查看</a>
          </Col>
        </Row>
        <Row v-if="countryCode=='ES'">
          <!-- <Col span="12">海牙文件：
          <span v-if="baseData.hyFile==''">暂无</span>
          <a :href="baseData.hyFile"
             v-else
             target="_blank">点击查看</a>
          </Col> -->
        </Row>
      </div>
      <p class="baseInfo">报税记录</p>
      <Table :data="logData"
             :columns="logColumns"
             border>
        <template slot="operation"
                  slot-scope="{row}">
          <div style="cursor: pointer;color: #019DFA;"
               v-if="row.status > 21 && row.countryCode === 'GB'"
               @click="getLink(row)">查看申报回执</div>
          <div class="upload"
               @click="uploadFile(row)"
               v-if="row.status==21">提交申报数据</div>
          <div class="upload"
               @click="uploadFile(row)"
               v-else-if="row.status==22">上传缴税凭证</div>
          <div class="upload"
               @click="uploadFile(row)"
               v-else-if="row.status==34">重新上传缴税凭证</div>
          <div class="upload"
               @click="uploadFile(row)"
               v-else-if="row.status==35">上传零申报凭证</div>
          <div v-else-if="row.status==27 ">
            <div v-if="row.countryCode !=='GB' && row.status==27 && row.declareReceipt!==''">
              <p v-for="(v,i) in row.declareReceipt.split(';')"
                 :key="i">
                <a :href="v"
                   target="_blank">查看申报回执</a>
              </p>
            </div>
            <div v-if="row.countryCode=='SA'">
              <p v-if="row.invoiceReceipt!=''">
                <a :href="row.invoiceReceipt"
                   target="_blank">开具发票通知</a>
              </p>
              <p v-if="row.payLetterInvoiceReceipt!=''">
                <a :href="row.payLetterInvoiceReceipt"
                   target="_blank">纳税付款信件</a>
              </p>
              <p v-if="row.paySystemInvoiceReceipt!=''">
                <a :href="row.paySystemInvoiceReceipt"
                   target="_blank">纳税付款发票</a>
              </p>
              <p v-if="row.taxDeclareReceiveInformReceipt!=''">
                <a :href="row.taxDeclareReceiveInformReceipt"
                   target="_blank">申报接收通知</a>
              </p>
              <p v-if="row.taxDeclareBlankReceipt!=''">
                <a :href="row.taxDeclareBlankReceipt"
                   target="_blank">税务申请表</a>
              </p>
            </div>
            <div v-if="row.countryCode=='AE'">
              <p v-if="row.taxesReceipt!=''">
                <a :href="row.taxesReceipt"
                   target="_blank">税金收款回执</a>
              </p>
            </div>
            <a v-if="row.status==27 && row.debitReceipt!==''"
               :href="row.debitReceipt"
               target="_blank">查看扣款回执</a>
          </div>
          <!-- <div v-else>无</div> -->
        </template>
      </Table>
      <div class="footer">
        <Button type="primary"
                @click="changeState(false)">知道了</Button>
      </div>
    </Modal>
    <UploadBox v-if="upload"
               @changeState="changeStates"
               :workId="workId"
               :status="status"></UploadBox>
  </div>
</template>
<script>
import { taxLogDetail, taxInfo } from '@/api/taxModule'
import { isAuthorized, taxBureauGetWay, authorizeCallback, retrievalVAT, forms } from "@/api/taxBureauService/taxBureauService";
import UploadBox from './uploadPay'
export default {
  props: {
    workNumber: '',
    serviceId: '',
    countryCode: ''
  },
  components: {
    UploadBox
  },
  data() {
    return {
      detailModel: true,
      baseData: {},
      logData: [],
      logColumns: [
        {
          title: '报税次数',
          width: '80',
          render(h, params) {
            return h('span', params.index + 1)
          }
        },
        {
          title: '申报区间',
          render(h, params) {
            let beginTime = params.row.beginTime.slice(0, 7), endTime = params.row.endTime.slice(0, 7);
            return h('span', beginTime + '至' + endTime)
          }
        },
        {
          title: '状态',
          render(h, params) {
            let num = params.row.status, status = ''
            switch (num) {
              case 18:
                status = "申报中";
                break;
              case 19:
                status = "未开始";
                break;
              case 20:
                status = "未开始";
                break;
              case 21:
                status = "待申报";
                break;
              case 22:
                status = "待缴纳税金";
                break;
              case 24:
                status = "申报中";
                break;
              case 25:
                status = "申报完成";
                break;
              case 26:
                status = "申报失败";
                break;
              case 27:
                status = "申报完成";
                break;
              case 28:
                status = "未开始";
                break;
              case 27:
                status = "转代理中";
                break;
              case 33:
                status = "缴税凭证待审核";
                break;
              case 34:
                status = "缴税凭证被驳回";
                break;
              case 35:
                status = "待上传零申报凭证";
                break;
              case 36:
                status = "待授权海牙认证";
                break;
              case 37:
                status = "海牙认证中";
                break;
              case 38:
                status = "待授权转代理";
                break;
            }
            return h('span', status)
          }
        },
        {
          title: '税率',
          width: '',
          render(h, params) {
            return h('span', params.row.taxRate + '%')
          }
        },
        {
          title: '申报规则',
          render(h, params) {
            let num = params.row.declareRule, status = ''
            switch (num) {
              case 0:
                status = "目的国";
                break;
              case 1:
                status = "发出国";
                break;
              case 2:
                status = "零申报";
                break;
            }
            return h('span', status)
          }
        },
        {
          title: '缴纳税金',
          width: '',
          key: 'allTaxPrice'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          width: '',
          slot: 'operation'
        },
      ],
      upload: false,
      fileUpload: this.ImgUrl,
      fileList: [],
      workId: '',
      status: '',
      formsData: ''
    }
  },
  methods: {
    getLink(row) {
      if (row.status > 21) {
        forms({
          // servicesId: row.orderServicesId,
          workOrderId: row.id
        }).then(res => {
          if (res.code === 0) {
            window.open(res.data)
          }
        })
      }
    },
    changeState(val) {
      let obj = {
        state: val
      };
      this.$emit("changeState", obj);
    },
    handleSuccess(res, file, fileList, row) {
      this.fileList = fileList
    },
    handleBeforeUpload() {
      const check = this.fileList.length < 2
      if (!check) {
        this.$Notice.warning({
          title: '最多上传两张图片'
        })
      }
      return check
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持jpg、jpeg、png'
      });
    },
    handleRemoveFile(file, fileList, row) {
      this.fileList = fileList
    },
    getInfo() {
      var that = this
      taxLogDetail({ servicesId: this.serviceId }).then(res => {
        if (res.code === 0) {
          this.logData = res.data
        }
      })
      taxInfo({ id: this.serviceId }).then(res => {
        if (res.code === 0) {
          that.baseData = res.data
        }
      })
    },
    changeStates(obj) {
      this.upload = obj.state
    },
    uploadFile(row) {
      this.status = row.status
      if (row.status == 21) {
        if (row.countryCode === 'GB') {
          this.authorization(row)
        } else {
          this.$router.push({
            path: "/computedTax",
            query: {
              servicesId: row.orderServicesId,
              countryCode: row.countryCode,
              periodType: row.declarePeriod,
              vatTaxNumber: row.vatTaxNumber,
              endTime: row.endTime,
            }
          });
        }

      } else if (row.status == 22 || row.status == 34 || row.status == 35) {
        this.upload = true
        this.workId = row.id
      }
    },
    authorization(row) {
      var that = this
      var vatTaxNumber = row.vatTaxNumber
      isAuthorized({
        vatTaxNumber: vatTaxNumber,
        // serviceId: row.orderServicesId
        workOrderId: row.id
      }).then(res => {
        if (res.data) {
          that.$emit('needVatObligations', row)
          that.changeState(false)
        } else {
          // that.taxBureauGetWayFun(row)
          that.$Message.error("您还没授权，请联系客服进行授权");
        }
      })
        .catch((error) => {
          console.log(error)
        })
    },
    // 税局getway授权
    taxBureauGetWayFun(row) {
      taxBureauGetWay({
        vatTaxNumber: row.vatTaxNumber,
        serviceId: row.id
      }).then(res => {
        localStorage.setItem('allowAuthorized', Boolean(true))
        window.location.href = res.data;
      }).catch(error => {
        console.log(error)
      })
    },
  },
  mounted() {
    this.getInfo()
  }
}
</script>
<style lang="less" scoped>
.taxBox {
  font-size: 12px;
}
.baseInfo {
  margin: 22px 0 12px 0;
}
.baseInfo1 {
  margin-bottom: 12px;
}
.upload {
  font-size: 12px;
  color: #019dfa;
  cursor: pointer;
}
.footer {
  text-align: center;
  padding: 26px 0;
}
.uploadFile {
  text-align: center;
  .uploadBtn {
    width: 350px;
  }
}
&/deep/ .ivu-modal-header-inner {
  color: #303033 !important;
}
&/deep/.ivu-table th {
  background-color: #f2f2f2;
  font-weight: 400;
  font-family: "MicrosoftYaHei";
}
&/deep/ .ivu-table {
  font-size: 12px;
  color: #626266;
}
&/deep/ .ivu-modal {
  width: 750px;
}
/deep/ .ivu-col-span-12 {
  line-height: 26px;
}
</style>