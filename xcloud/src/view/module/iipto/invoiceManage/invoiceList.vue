<template>
  <div class="invoiceList">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem>
          <Input v-model="searchForm.queryContent"
                 clearable
                 placeholder="请输入手机号/订单号/服务公司"
                 style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.status"
                  placeholder="开票状态">
            <!-- <Option value="1">待支付</Option> -->
            <Option value="2">待开票</Option>
            <Option value="3">已开票</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.orderBusinessSource"
                  placeholder="订单来源">
            <Option value="1">必胜道</Option>
            <Option value="2">卖家成长</Option>
            <Option value="3">跨标云</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model="date"
                      type="daterange"
                      placement="bottom-end"
                      @on-change="dateChange"
                      placeholder="申请时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList"
                  style="margin-right:5px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="tableArea">
        <!-- <Tabs :value="searchForm.paymentChannel" :animated="false" @on-click="tabsChange">
                    <TabPane label="全部" name="-1"></TabPane>
                    <TabPane label="待开票" name="1"></TabPane>
                    <TabPane label="已开票" name="2"></TabPane>
                </Tabs> -->
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData">
          <template slot="operate"
                    slot-scope="{ row }">
            <span class="operateBtn"
                  v-show="hasAuthority('view_invoice')"
                  @click="toDeatil(row)">【查看】</span>
            <span class="operateBtn"
                  v-show="hasAuthority('upload_invoice_list')"
                  v-if="row.status === 2"
                  @click="showInvoiceModal(row)">【上传发票】</span>
            <span class="operateBtn"
                  v-show="hasAuthority('upload_invoice_list')"
                  v-if="row.status === 4"
                  @click="cancelInvoice(row)">【取消开票】</span>
            <span class="operateBtn"
                  v-show="hasAuthority('upload_invoice_list')"
                  v-if="row.status === 6"
                  @click="showInvoiceModal(row)">【更新发票】</span>
          </template>
          <template slot="invoiceType"
                    slot-scope="{ row }">
            <span>{{row.invoiceType === 1 ? '增值税普通发票' : '增值税专用发票'}}({{row.subjectType === '1' ? '个人' : '公司'}})</span>
          </template>
          <template slot="status"
                    slot-scope="{ row }">
            <span>{{row.status === 1 ? "待支付" : row.status === 2 ? "待开票" : row.status === 3 ? "已开票": row.status === 4 ? "待取消开票": row.status === 5? "已取消开票": row.status === 6 ? "待更新开票" : '' }}</span>
          </template>
        </Table>
        <Page @on-change="changePageHandler"
              :current="pageInfo.page"
              :total="listTotal"
              :page-size="pageInfo.limit"
              show-total
              show-elevator />
      </div>
    </div>
    <invoiceDetail v-if="isDetailShow"
                   :id='detailId'
                   @back="isDetailShow=false"
                   @refresh="refreshList"></invoiceDetail>
    <Modal v-model="invoiceModal"
           title="上传发票">
      <Upload ref="taxFile"
              type="drag"
              :action="fileUpload"
              :data="{ prefix: '' }"
              :before-upload="beroreTaxUpload"
              :on-success="taxUploadSuccess"
              :on-remove="removetax"
              style="width:260px">
        <div style="padding: 10px 0">
          <Icon type="ios-cloud-upload"
                size="30"
                style="color: #3399ff"></Icon>
          <span>请拖拽文件到此区域上传或点击上传</span>
        </div>
      </Upload>
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="invoiceModal=false">取消</Button>
        <Button type="primary"
                @click="sureUploadTax"
                v-if="invioceStatus==2">确认</Button>
        <Button type="primary"
                @click="updateInvoice"
                v-if="invioceStatus==6">确认</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/iipto/invoice.js';
import invoiceDetail from './invoiceDetail'
import { getToken } from '@/libs/util'
export default {
  name: 'orderList',
  data() {
    return {
      isDetailShow: false,
      fileUpload: this.workOrderFile,
      invoiceModal: false,
      searchForm: {
        queryContent: '',
        applyTimeBeginTime: '',
        applyTimeEndTime: '',
        status: ''
      },
      date: '',
      countryList: [],
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      tableLoading: false,
      detailId: '',
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 50
        },
        {
          title: '订单号',
          key: 'orderNo',
          minWidth: 50,
        },
        {
          title: '申请时间',
          key: 'applyTime'
        },
        {
          title: '用户账号',
          key: 'userMobile'
        },
        {
          title: '开票类型',
          slot: 'invoiceType'
        },
        {
          title: '服务名称',
          key: 'productServiceName'
        },
        {
          title: '服务金额',
          key: 'productServiceMoney'
        },
        {
          title: '已付金额',
          key: 'amountMoney'
        },
        {
          title: '退款金额',
          key: 'refundMoney'
        },
        {
          title: '开票状态',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      totalOrderMoney: 0,
      totalamountMoney: 0,
      totaldiscAmount: 0,
      tableData: [],
      invoiceFile: '',
      id: '',
      invioceStatus: ''
    }
  },
  mounted() {
    this.getInvoiceList();
  },
  components: {
    invoiceDetail
  },
  methods: {
    //订单创建时间
    dateChange(date) {
      this.searchForm.applyTimeBeginTime = date[0];
      this.searchForm.applyTimeEndTime = date[1];
    },
    //获取列表
    getInvoiceList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      API.getInvoiceList(params).then((res) => {
        if (res.code == 0) {
          // console.log(res.data.records)
          this.tableLoading = false;
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$Message.warning(res.message);
          this.tableLoading = false
        }
      })
        .catch((err) => console.log(err))
    },
    //搜索列表
    searchList() {
      this.pageInfo.page = 1;
      this.getInvoiceList()
    },
    //选择tab状态
    tabsChange(name) {
      this.searchForm.status = name;
      this.getInvoiceList();
    },
    //重置列表
    resetList() {
      this.searchForm = {
        queryContent: '',
        applyTimeBeginTime: '',
        applyTimeEndTime: '',
        status: ''
      };
      this.date = "";
      this.pageInfo.page = 1;
      this.getInvoiceList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getInvoiceList()
    },
    //发票上传之前
    beroreTaxUpload() {
      let self = this;
      const check = self.invoiceFile == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    //发票上传成功
    taxUploadSuccess(res, file, fileList) {
      this.invoiceFile = res.data.fileUrl;
    },
    //移除发票
    removetax(res, file, fileList) {
      this.invoiceFile = '';
    },
    showInvoiceModal(row) {
      this.id = row.id
      this.invoiceModal = true
      this.invioceStatus = row.status
    },
    //取消开票
    cancelInvoice(row) {
      API.cancelInvoiceApi({ id: row.id }).then(res => {
        if (res.code == 0) {
          this.$Message.success('取消开票成功')
          this.getInvoiceList();
        }
      })
    },
    //更新发票
    updateInvoice() {
      if (this.invoiceFile === '') {
        this.$Message.error('请上传发票')
        return
      }
      API.updateInvoiceApi({
        id: this.id,
        invoiceFile: this.invoiceFile
      }).then(res => {
        if (res.code == 0) {
          this.invoiceModal = false
          this.$Message.success('发票上传成功')
          this.getInvoiceList();
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    //上传发票
    sureUploadTax() {
      if (this.invoiceFile === '') {
        this.$Message.error('请上传发票')
        return
      }
      API.uploadInvoice({
        id: this.id,
        invoiceFile: this.invoiceFile
      }).then(res => {
        if (res.code == 0) {
          this.invoiceModal = false
          this.$Message.success('发票上传成功')
          this.getInvoiceList();
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    toDeatil(row) {
      this.isDetailShow = true
      this.detailId = row.id
    },
    refreshList() {
      this.getInvoiceList();
    },
    exportList() {
      let formData = new FormData()
      formData.append('info', this.searchForm.info)
      formData.append('paymentChannel', this.searchForm.paymentChannel)
      formData.append('startTime', this.searchForm.startTime)
      formData.append('endTime', this.searchForm.endTime)
      formData.append('countryCode', this.searchForm.countryCode)
      formData.append('functionCode', this.searchForm.functionCode)
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/order/management/income/list/export', true)
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
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
  }
}
</script>
<style lang="less" scoped>
.invoiceList {
  .tableArea {
    .operateBtn {
      cursor: pointer;
    }
  }
}
</style>