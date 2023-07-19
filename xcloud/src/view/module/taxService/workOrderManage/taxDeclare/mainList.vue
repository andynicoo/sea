<template>
  <div class="taxDeclare_wrapper">
    <div class="mainPage"
         v-if="!isDetailShow && !taxModalShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem>
          <Input v-model="searchForm.searchContent"
                 clearable
                 placeholder="公司名称/手机号/VAT税号"
                 style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.countryCode"
                  placeholder="税号国家">
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model="date"
                      type="daterange"
                      placement="bottom-end"
                      @on-change="dateChange"
                      placeholder="创建时间"
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
        <Tabs :value="searchForm.status"
              :animated="false"
              @on-click="tabsChange">
          <TabPane label="全部"
                   name="-1"></TabPane>
          <TabPane label="未开始"
                   name="20"></TabPane>
          <TabPane label="待申报"
                   name="21"></TabPane>
          <TabPane label="待缴纳税金"
                   name="22"></TabPane>
          <TabPane label="申报完成"
                   name="25"></TabPane>
          <TabPane label="申报标记完成"
                   name="27"></TabPane>
          <TabPane label="申报驳回"
                   name="26"></TabPane>
        </Tabs>
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData">
          <template slot="operate"
                    slot-scope="{ row }">
            <Button ghost
                    v-if="row.status==20 || row.status == 21 || row.status ==22"
                    type="info"
                    @click="sendMessage(row)">发送提醒</Button>
            <Button ghost
                    type="info"
                    @click="toDetail(row.workId)">查看</Button>
          </template>
          <template slot="status"
                    slot-scope="{ row }">
            <span>{{row.status == '20' ? "未开始" : row.status == '21' ? "待申报" : row.status == '24' ? "申报中" : row.status == '22' ? "待缴纳税金" : row.status == '25' ? "申报完成" : row.status == '26' ? "申报驳回" : row.status == '27' ? "申报标记完成" : ""}}</span>
            <!-- <span>{{regiStatus[row.status]}}</span> -->
          </template>
          <template slot="serviceName"
                    slot-scope="{ row }">
            <span>{{row.productFunctionCode == '1' ? "税号注册" : row.productFunctionCode == '2' ? "税务申报" : row.productFunctionCode == '3' ? "税务补缴" : row.productFunctionCode == '4' ? "转代理" : ''}}</span>
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
    <detailInfo v-if="isDetailShow"
                @showTaxModal="showTaxModal"
                @back="isDetailShow=false"
                @refresh="refreshList"
                :id="detailId"></detailInfo>
    <taxModal v-if="taxModalShow"
              :serviceId='serviceId'
              :workId="computeId"
              @refresh="refreshList"></taxModal>
  </div>
</template>
<script>
import detailInfo from "./components/detailInfo";
import taxModal from './components/taxModal';
import * as API from '@/api/taxService/workOrder.js';
import { getTaxCountry } from '@/api/taxService/common.js';
export default {
  name: 'mainList',
  components: {
    detailInfo,
    taxModal
  },
  data() {
    return {
      regiStatus: {
        '20': '未开始',
        '21': '待申报',
        '24': '申报中',
        '25': '申报完成',
        '27': '申报标记完成',
        '22': '待缴纳税金'
      },
      isDetailShow: false,
      searchForm: {
        status: -1,
        searchContent: '',
        countryCode: '',
        startTime: '',
        endTime: ''
      },
      date: '',
      tableLoading: false,
      columns: [
        {
          title: '工单号',
          key: 'taxWorkNo',
          minWidth: 80,
        },
        {
          title: '公司名称',
          key: 'companyName'
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 80
        },
        {
          title: '申报次数',
          key: 'declareCout',
          width: 86
        },
        {
          title: '申报周期',
          key: 'beginToendTime'
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '服务名称',
          slot: 'serviceName'
        },
        {
          title: '客户手机号',
          key: 'userMobile'
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      tableData: [
        {
          orderNo: 'G1211343414141343',
          createTime: '2020-02-29',
          cn_name: '这是一个公司名称',
          service_name: '英国注册申报服务',
          service_amount: '299.0',
          pay_amount: '199.0',
          country: '英国',
          status: 2,
          id: 1
        }
      ],
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      countryList: [],
      workId: '',
      taxModalShow: false,
      computeId: '',
      serviceId: ''
    }
  },
  mounted() {
    this.getList()
    this.getCountryList()
  },
  methods: {
    //获取列表
    getList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo }
      API.getDeclareList(params).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
          this.workId = res.data.records.workId;
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    //获取税号国家下拉数据
    getCountryList() {
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
    },
    //搜索列表
    searchList() {
      this.pageInfo.page = 1;
      this.searchForm.status = '-1';
      this.getList()
    },
    //重置列表
    resetList() {
      this.searchForm = {}
      this.searchForm.status = '-1';
      this.date = "";
      this.getList()
    },
    //工单创建时间
    dateChange(date) {
      this.searchForm.startTime = date[0];
      this.searchForm.endTime = date[1];
    },
    //选择tab状态
    tabsChange(name) {
      this.searchForm.status = name;
      this.pageInfo.page = 1;
      this.getList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.getList()
    },
    //查看详情
    toDetail(id) {
      this.isDetailShow = true;
      this.detailId = id;
    },
    //发送提醒
    sendMessage(rowData) {
      // 20:未开始 21：待申报 22：待缴纳税金
      let params = {
        serviceId: rowData.id,
      }
      this.$Modal.confirm({
        title: '是否发送短信',
        content: '',
        onOk: () => {
          API.sendMessage(params).then(res => {
            if (res.code == 0) {
              this.$Message.success('发送提醒成功')
            } else {
              this.$Message.warning(res.message)
            }
          })
            .catch(err => console.log(err))
        },
        onCancel: () => {

        }
      });
    },
    refreshList() {
      this.isDetailShow = false;
      this.taxModalShow = false;
      this.pageInfo.page = 1;
      this.searchForm = {};
      this.date = '';
      this.searchForm.status = -1;
      this.getList()
    },
    showTaxModal(id, serviceId) {
      this.computeId = id;
      this.isDetailShow = false;
      this.taxModalShow = true;
      this.serviceId = serviceId;
    }
  }
}
</script>
<style lang="less" scoped>
.taxDeclare_wrapper {
}
</style>