<template>
  <div class="detailWrapper">
    <div class="back">
      <p @click="goBack()" class="backBtn"><Icon type="md-arrow-back" />返回列表</p>
    </div>
    <div class="content">
      <div class="content-l">
        <Card>
          <p slot="title" class="declareFileBox">
            <span>申报资料</span>
            <span class="btnArea" v-if="detailInfo.status == 20">
              <Button @click="sendMessage">发送提醒</Button>
            </span>
            <span class="btnArea" v-if="detailInfo.status == 21">
              <Button @click="sendMessage" style="margin-right: 10px">发送提醒</Button>
              <Button type="primary" @click="caculateTax">计算税金</Button>
            </span>
            <span class="btnArea" v-if="detailInfo.status == 27">
              <!-- <Button type="primary" @click="submitDeclare">提交申报</Button> -->
              <Button type="primary" @click.once="downLoad">下载申报资料</Button>
            </span>
            <span class="btnArea" v-if="detailInfo.status == 25">
              <Button type="primary" @click.once="downLoad" ghost style="margin-right: 10px">下载申报资料</Button>
              <Button type="primary" v-show="hasAuthority('work_order_list11')" @click="markComplete">标记完成</Button>
            </span>
            <span class="btnArea" v-if="detailInfo.status == 22">
              <Button type="primary" @click.once="downLoad" ghost style="margin-right: 10px">下载申报资料</Button>
              <Button type="primary" @click="taxFileModal = true">上传缴税凭证</Button>
            </span>
          </p>
          <div class="basicInfo">
            <Form ref="companyInfo" :model="companyInfo" :label-width="120">
              <FormItem label="申报状态：">
                <span>{{ detailInfo.status == '20' ? '未开始' : detailInfo.status == '21' ? '待申报' : detailInfo.status == '27' ? '申报标记完成' : detailInfo.status == '22' ? '待缴纳税金' : detailInfo.status == '25' ? '申报完成' : detailInfo.status == '26' ? '申报驳回' : '' }}</span>
              </FormItem>
              <FormItem label="当前申报次数：">
                <span>{{ detailInfo.declareCout }}</span>
              </FormItem>
              <FormItem label="下一次申报周期：">
                <span>{{ detailInfo.nextPeriod }}</span>
              </FormItem>
              <!-- <FormItem label="申报回执：">
                  <Button v-if="detailInfo.status==24" type="primary" @click="uploadReceiptModal=true">点击上传</Button>
                  <a @click="previewBack">{{"申报回执"}}</a>
              </FormItem> -->
              <FormItem label="Gateway ID：">
                <span>{{ detailInfo.gatewayId }}</span>
              </FormItem>
              <FormItem label="密码：">
                <span>{{ detailInfo.gatewayPassword }}</span>
              </FormItem>
            </Form>
          </div>
          <div class="declareData">
            <p>申报数据：</p>
            <Form ref="declareInfo" :model="declareInfo" :label-width="120">
              <FormItem label="含税销售额：">
                <Input :disabled="detailInfo.status != 21" placeholder="请输入含税销售额" v-model="declareInfo.includTaxPrice" style="width: 220px" />
              </FormItem>
              <FormItem label="不含税销售额：">
                <Input :disabled="detailInfo.status != 21" placeholder="请输入不含税销售额" v-model="declareInfo.excludeTaxPrice" style="width: 220px" />
              </FormItem>
              <FormItem label="销项税额：">
                <Input :disabled="detailInfo.status != 21" placeholder="请输入抵扣税金" v-model="declareInfo.deductionPrice" style="width: 220px" />
              </FormItem>
              <FormItem label="抵扣总金额：">
                <Input :disabled="detailInfo.status != 21" placeholder="请输入抵扣税金" v-model="declareInfo.deductionPrice" style="width: 220px" />
              </FormItem>
              <FormItem label="最终缴纳税金：">
                <Input :disabled="detailInfo.status != 21" placeholder="请输入缴纳税金" v-model="declareInfo.allTaxPrice" style="width: 220px" />
              </FormItem>
              <FormItem label="税金缴纳凭证：" v-if="detailInfo.status == 25 || detailInfo.status == 27">
                <a @click="previewTax(declareInfo.taxCertificate)">{{ '缴税凭证' }}</a>
              </FormItem>
              <FormItem label="抵扣明细：">
                <!-- <span class="deductItem">抵扣类型：{{deductionInfo.deductionType == 1 ? '进口增值税抵扣' : deductionInfo.deductionType == 2 ? '发票抵扣' : '其他'}}</span>
                                <span class="deductItem">抵扣金额：{{deductionInfo.deductiontAmt || ''}}</span>
                                <span class="deductItem">单据日期：{{deductionInfo.billDate || ''}}</span>
                                <span v-if="deductionInfo.deductionFile" class="deductItem">抵扣文件：<a @click="previewDeduct(deductionInfo.deductionFile)">{{deductionInfo.fileOriginalName || '抵扣文件'}}</a></span>
                                <span v-if="!deductionInfo.deductionFile" class="deductItem">抵扣文件：{{"暂无"}}</span> -->
                <Table :data="deductionInfo" :columns="columns1">
                  <template slot="deductionType" slot-scope="{ row }">
                    <span>{{ row.deductionType == '1' ? '进口增值税抵扣' : row.deductionType == '2' ? '发票抵扣' : row.deductionType == '3' ? '其他' : '' }}</span>
                  </template>
                  <template slot="deductFile" slot-scope="{ row }">
                    <a :href="row.deductionFile" target="_blank">{{ row.fileOriginalName }}</a>
                  </template>
                </Table>
              </FormItem>
            </Form>
          </div>
        </Card>
        <Card style="margin-top: 10px">
          <p slot="title">历史申报记录</p>
          <Table :loading="tableLoading" :columns="columns" :data="tableData">
            <template slot="operate">
              <Button type="info">查看</Button>
            </template>
            <template slot="declareRule" slot-scope="{ row }">
              <span>{{ row.declareRule == '0' ? '目的国' : row.declareRule == '1' ? '发出国' : '' }}</span>
            </template>
            <template slot="status" slot-scope="{ row }">
              <span>{{ row.status == '20' ? '未开始' : row.status == '21' ? '待申报' : row.status == '22' ? '待缴纳税金' : row.status == '25' ? '申报完成' : row.status == '27' ? '申报驳回' : row.status == '27' ? '申报标记完成' : '' }}</span>
            </template>
          </Table>
          <!-- <Page
              @on-change="changePageHandler"
              :current="pageInfo.page"
              :total="listTotal"
              :page-size="pageInfo.pageSize"
              show-total
              show-elevator
          /> -->
        </Card>
      </div>
      <div class="content-r">
        <Card>
          <p slot="title">税号信息</p>
          <Form :label-width="100">
            <FormItem label="VAT税号：">
              <span>{{ detailInfo.vatTaxNumber }}</span>
            </FormItem>
            <FormItem label="税号下发日期：">
              <span>{{ detailInfo.vatTaxGrantDate }}</span>
            </FormItem>
            <FormItem label="税号生效日期：">
              <span>{{ detailInfo.vatTaxCommencementDate }}</span>
            </FormItem>
            <FormItem label="申报周期：">
              <span>{{ detailInfo.periodType == 0 ? '月报' : detailInfo.periodType == 1 ? '季报' : detailInfo.periodType == -1 ? '暂无' : '' }}</span>
            </FormItem>
            <FormItem label="申报国家：">
              <span>{{ detailInfo.countryNameZh }}</span>
            </FormItem>
            <FormItem label="VAT税号文件：">
              <span v-if="detailInfo.vatTaxNumberFile !== ''"
                ><a :href="detailInfo.vatTaxNumberFile" target="_blank">{{ 'VAT税号文件' }}</a></span
              >
              <span v-else>{{ '暂无' }}</span>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px">
          <p slot="title">服务信息</p>
          <Form :label-width="100">
            <FormItem label="工单号：">
              <span>{{ detailInfo.workNo }}</span>
            </FormItem>
            <FormItem label="申报状态：">
              <span>{{
                detailInfo.status == '20'
                  ? '未开始'
                  : detailInfo.status == '21'
                  ? '待申报'
                  : detailInfo.status == '27'
                  ? '申报标记完成'
                  : detailInfo.status == '22'
                  ? '待缴纳税金'
                  : detailInfo.status == '25'
                  ? '申报完成'
                  : detailInfo.status == '26'
                  ? '申报驳回'
                  : detailInfo.status == '27'
                  ? '申报标记完成'
                  : ''
              }}</span>
            </FormItem>
            <FormItem label="服务公司：">
              <span>{{ detailInfo.companyName }}</span>
            </FormItem>
            <FormItem label="服务名称：">
              <span>{{ detailInfo.productFunctionCode == '1' ? '税号注册' : detailInfo.productFunctionCode == '2' ? '税务申报' : detailInfo.productFunctionCode == '3' ? '税务补缴' : detailInfo.productFunctionCode == '4' ? '转代理' : '' }}</span>
            </FormItem>
            <FormItem label="国家：">
              <span>{{ detailInfo.countryNameZh }}</span>
            </FormItem>
            <FormItem label="创建时间：">
              <span>{{ detailInfo.createTime }}</span>
            </FormItem>
          </Form>
        </Card>
        <Card style="margin-top: 6px">
          <p slot="title">用户信息</p>
          <Form :label-width="100">
            <FormItem label="用户昵称：">
              <span>{{ detailInfo.userNickname }}</span>
            </FormItem>
            <FormItem label="手机号：">
              <span>{{ detailInfo.userMobile }}</span>
            </FormItem>
            <FormItem label="用户级别：">
              <span>{{ '' }}</span>
            </FormItem>
            <FormItem label="公司名称：">
              <span>{{ detailInfo.userCompanyName }}</span>
            </FormItem>
            <FormItem label="地址：">
              <span>{{ detailInfo.userAddress }}</span>
            </FormItem>
          </Form>
        </Card>
      </div>
      <Modal v-model="uploadReceiptModal" title="上传申报回执">
        <Upload ref="declareFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreDeclareUpload" :on-success="declareUploadSuccess" :on-remove="removeDeclare" style="width: 260px">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right: 20px" @click="uploadReceiptModal = false">取消</Button>
          <Button type="primary" @click="sureUpload">确认</Button>
        </p>
      </Modal>
      <Modal v-model="taxFileModal" title="上传缴税凭证">
        <Upload ref="taxFile" type="drag" :action="fileUpload" :data="{ prefix: '' }" :before-upload="beroreTaxUpload" :on-success="taxUploadSuccess" :on-remove="removetax" style="width: 260px">
          <div style="padding: 10px 0">
            <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
            <span>请拖拽文件到此区域上传或点击上传</span>
          </div>
        </Upload>
        <p slot="footer">
          <Button type="primary" ghost style="margin-right: 20px" @click="taxFileModal = false">取消</Button>
          <Button type="primary" @click="sureUploadTax">确认</Button>
        </p>
      </Modal>
    </div>
  </div>
</template>
<script>
import * as API from '@/api/taxService/workOrder.js';
import { getToken } from '@/libs/util';

export default {
  props: ['id'],
  data() {
    return {
      fileUpload: this.workOrderFile,
      isCompanyInfoEdit: false,
      companyInfo: {
        cn_name: '布莱恩',
        en_name: 'brain',
        cn_address: '光浩国际中心',
        en_address: 'sadiyago',
        code: '123123213213123',
        createTime: '2020-03-02',
      },
      tableLoading: false,
      pageInfo: {
        page: 1,
        pageSize: 10,
      },
      listTotal: 10,
      columns: [
        {
          title: '报税次数',
          key: 'declareCout',
        },
        {
          title: '申报区间',
          key: 'beginToendTime',
        },
        {
          title: '状态',
          slot: 'status',
        },
        {
          title: '税率',
          key: 'taxRate',
        },
        {
          title: '申报规则',
          slot: 'declareRule',
          // render:(h,params) => {
          //     return h('span',)
          // }
        },
        {
          title: '缴纳税金',
          key: 'allTaxPrice',
        },
        // {
        //     title: '操作',
        //     slot: 'operate'
        // }
      ],
      isTaxModalShow: false,
      tableData: [], //申报历史
      detailInfo: {},
      taxCertificate: '', //税金缴纳凭证
      declareInfo: {}, //申报数据
      declareReceipt: '', //申报回执
      uploadReceiptModal: false,
      taxFileModal: false, //缴税凭证弹窗
      deductionInfo: [], //抵扣明细,
      serviceId: '',
      columns1: [
        {
          title: '抵扣类型',
          slot: 'deductionType',
        },
        {
          title: '抵扣金额',
          key: 'deductiontAmt',
        },
        {
          title: '单据日期',
          key: 'billDate',
        },
        {
          title: '抵扣文件',
          slot: 'deductFile',
        },
      ],
    };
  },
  created() {
    this.getDetailInfo();
  },
  methods: {
    //获取详情信息
    getDetailInfo() {
      API.getDeclareDetail({ workId: this.id })
        .then((res) => {
          if (res.code == 0) {
            this.detailInfo = res.data;
            this.tableData = res.data.taxWorkOrderHistoryList;
            this.declareInfo = res.data.taxWorkOrderMaterial;
            this.deductionInfo = res.data.deductionDetailList;
            this.serviceId = res.data.orderServicesId;
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch((err) => console.log(err));
    },
    //返回列表页
    goBack() {
      this.$emit('back');
    },
    //发送提醒
    sendMessage() {
      let params = {
        serviceId: this.detailInfo.id,
      };
      this.$Modal.confirm({
        title: '是否发送短信',
        content: '',
        onOk: () => {
          API.sendMessage(params)
            .then((res) => {
              if (res.code == 0) {
                this.$Message.success('发送提醒成功');
              } else {
                this.$Message.warning(res.message);
              }
            })
            .catch((err) => console.log(err));
        },
        onCancel: () => {},
      });
    },
    //计算税金
    caculateTax() {
      this.$emit('showTaxModal', this.id, this.serviceId);
      //     this.$router.push({
      //     name: 'computeTax',
      //     params: {
      //         workNo:this.detailInfo.workNo,
      //         workId: this.id,
      //         status: this.detailInfo.status
      //         }
      //   })
    },

    //分页
    changePageHandler(page) {},
    //税金缴纳凭证上传之前
    beforeLiceseUpload(file, fileList) {},
    //税金缴纳凭证上传成功
    licenseUploadSuccess(res, file, fileList) {
      this.taxCertificate = file.response.data.fileUrl;
    },
    //移除税金缴纳凭证
    removeLicenseFile(file, fileList) {
      this.taxCertificate = '';
    },
    //下载申报资料
    downLoad() {
      let formData = new FormData();
      formData.append('workId', this.id);
      // 获取时间戳
      let timestamp = new Date().getTime();
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest();
      xmlResquest.open('post', this.baseUrl + '/etax/workorder/management/tax/down/material', true);
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken());
      xmlResquest.responseType = 'blob';
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response;
        // 组装a标签
        let elink = document.createElement('a');
        // 设置下载文件名
        elink.download = timestamp + '.xlsx';
        elink.style.display = 'none';

        let blob = new Blob([content]);
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      };
      xmlResquest.send(formData);
      // API.downLoadDeclareFile({workId: this.id}).then((res) => {
      //     if(res.code == 0) {
      //         // window.open(res.data.fileUrl)
      //     }else {
      //         this.$Message.warning(res.message)
      //     }
      // })
      // .catch(err => console.log(err))
      // API.downLoadDeclareFile({workId: this.id}).then(res => {
      // const content = res
      // const blob = new Blob([content])
      // let timestamp = new Date().getTime()
      // let fileName = timestamp + '.xlsx'

      // if ('download' in document.createElement('a')) { // 非IE下载
      //     const elink = document.createElement('a')
      //     elink.download = fileName
      //     elink.style.display = 'none'
      //     elink.href = URL.createObjectURL(blob)
      //     document.body.appendChild(elink)
      //     elink.click()
      //     URL.revokeObjectURL(elink.href) // 释放URL 对象
      //     document.body.removeChild(elink)
      // }
      // else { // IE10+下载
      //     navigator.msSaveBlob(blob, fileName)
      // }

      // let blob = new Blob([res], {type: "application/vnd.ms-excel"});  // res就是接口返回的文件流了
      // let objectUrl = URL.createObjectURL(blob);
      // window.location.href = objectUrl;

      //    })
      //     .catch(err => console.log(err))
    },
    //申报回执上传之前
    beroreDeclareUpload() {},
    //申报回执上传成功
    declareUploadSuccess(res, file, fileList) {
      this.declareReceipt = file.response.data.fileUrl;
    },
    //移除申报回执
    removeDeclare(file) {
      this.declareReceipt = '';
    },
    //缴税凭证上传之前
    beroreTaxUpload() {},
    //缴税凭证上传成功
    taxUploadSuccess(res, file, fileList) {
      this.taxCertificate = file.response.data.fileUrl;
    },
    //移除缴税凭证
    removetax(file) {
      this.taxCertificate = '';
    },
    //预览申报回执
    previewBack() {
      window.open(this.declareInfo.declareReceipt);
    },
    //预览税金缴纳凭证
    previewTax(url) {
      window.open(url);
    },
    //预览抵扣文件
    previewDeduct(url) {
      window.open(url);
    },
    //确认上传申报回执
    sureUpload() {
      let params = {
        declareReceipt: this.declareReceipt,
        workId: this.id,
      };
      API.uploadDeclare(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('申报回执上传成功');
          (this.uploadReceiptModal = false), this.getDetailInfo();
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    //确认上传缴税凭证
    sureUploadTax() {
      let params = {
        certificateUrl: this.taxCertificate,
        workId: this.id,
        servicesId: this.detailInfo.orderServicesId,
      };
      API.uploadTax(params).then((res) => {
        if (res.code == 0) {
          this.$Message.success('缴税凭证上传成功');
          (this.taxFileModal = false), this.$emit('refresh');
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    //标记完成
    markComplete() {
      API.markComplete({ workId: this.id }).then((res) => {
        if (res.code == 0) {
          this.$Message.success('已标记');
          this.$emit('refresh');
        } else {
          this.$Message.warning(resmessage);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
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
      .span {
        display: inline-block;
        &:first-child {
          margin-right: 8px;
        }
      }
    }
    .basicInfo {
      border-bottom: 1px solid #666;
      margin-bottom: 10px;
    }
    .deductItem {
      display: block;
    }
  }
  .content-r {
    width: 300px;
    margin-left: 10px;
  }
}
.requiredItem {
  /deep/ .ivu-form-item-label::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
/deep/ .ivu-card-head {
  padding: 4px 16px;
  p {
    height: 34px;
    line-height: 34px;
  }
}
</style>
