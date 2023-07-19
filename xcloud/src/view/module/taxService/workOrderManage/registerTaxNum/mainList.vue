<template>
  <div class="registerTaxNum_wrapper">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem>
          <Input v-model="searchForm.searchContent"
                 clearable
                 placeholder="公司名称/手机号/服务号"
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
          <DatePicker v-model="date1"
                      type="daterange"
                      placement="bottom-end"
                      @on-change="dateChange1"
                      placeholder="审核时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.companyBody"
                  placeholder="归属公司">
            <Option value="1">跨税云</Option>
            <Option value="2">必胜道</Option>
            <Option value="3">卖家成长</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList('searchForm')"
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
          <TabPane label="待上传资料"
                   name="0"></TabPane>
          <TabPane label="待审核资料"
                   name="1"></TabPane>
          <TabPane label="注册中"
                   name="3"></TabPane>
          <TabPane label="注册完成"
                   name="4"></TabPane>
          <TabPane label="资料驳回"
                   name="8"></TabPane>
        </Tabs>
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData">
          <template slot="operate"
                    slot-scope="{ row }">
            <Button v-if="row.status == 0"
                    type="info"
                    @click="sendMessage(row)"
                    ghost>发送提醒</Button>

            <Button type="info"
                    ghost
                    @click="toDetail(row)">查看</Button>
          </template>
          <template slot="serviceName"
                    slot-scope="{ row }">
            <span>{{row.productFunctionCode == '1' ? "税号注册" : row.productFunctionCode == '2' ? "税务申报" : row.productFunctionCode == '3' ? "税务补缴" : row.productFunctionCode == '4' ? "转代理" : row.productFunctionCode == '5' ? "注册+申报" : ''}}</span>
          </template>
        </Table>
        <Page @on-change="changePageHandler"
              :current="pageInfo.page"
              :total="listTotal"
              :page-size="pageInfo.limit"
              show-total
              show-elevator />
      </div>
      <Modal v-model="auditModal"
             title="审核资料">
        <p>审核通过后开始提交注册</p>
        <p>
          <RadioGroup v-model="isAudit">
            <Radio label="1">
              <span>审核通过</span>
            </Radio>
            <Radio label="0">
              <span>资料不对，驳回</span>
            </Radio>
          </RadioGroup>
        </p>
        <p v-show="isAudit=='0'">
          <Input v-model="remark"
                 type="textarea"
                 placeholder="请输入驳回原因" />
        </p>
        <p slot="footer">
          <Button type="primary"
                  ghost
                  style="margin-right:20px;"
                  @click="auditModal=false">取消</Button>
          <Button type="primary"
                  @click="sureAudit">确认</Button>
        </p>
      </Modal>
    </div>
    <waitUpload v-if="isDetailShow"
                @back="isDetailShow=false"
                :id="detailId"
                :userId="userId"
                :progressBar="progressBar"
                @refresh="refreshList"></waitUpload>
  </div>
</template>
<script>
import waitUpload from "@/view/module/taxService/serviceRegManage/components/waitUpload";
import * as API from '@/api/taxService/regAndDeclare.js';
import { getTaxCountry } from '@/api/taxService/common.js';
export default {
  name: 'mainList',
  components: {
    waitUpload
  },
  data() {
    return {
      isDetailShow: false,
      searchForm: {
        status: -1,
        searchContent: '',
        startTime: '',
        endTime: '',
        auditTimeBegin:'',
        auditTimeEnd:'',
        countryCode: ''
      },
      date: '',
      date1:'',
      countryList: [],
      tableLoading: false,
      declareStatus: {
        0: '未购买',
        1: '正常',
        2: '待续费',
        3: '注销税号'
      },
      columns: [
        {
          title: '服务号',
          key: 'serverNo',
        },
        {
          title: '服务进度',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.progressBar])
          }
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 80
        },
        {
          title: '公司名称',
          key: 'companyName'
        },
        {
          title: '服务名称',
          slot: 'serviceName'
        },
        {
          title: '客户手机号',
          key: 'userMobile',
          width: 114
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '状态',
          render: (h, params) => {
            let self = this
            return h('span', self.declareStatus[params.row.status])
          }
        },
        {
          title: '归属公司',
          render: (h, params) => {
            let text = '';
            if(params.row.companyBody == '1'){
              text = '跨税云';
            }else if(params.row.companyBody == '2'){
              text = '必胜道';
            }else if(params.row.companyBody == '3'){
              text = '卖家成长';
            }
            return h('span', text)
          }
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      tableData: [],
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      auditModal: false,
      isAudit: '1',
      remark: '',
      workId: '',
      userId: '',
      progressStatus: {
        0: '待上传资料',
        1: '待审核资料',
        2: '待续费',
        3: '注册中',
        4: '注册完成',
        5: '待授权海牙认证',
        6: '海牙认证中',
        7: '待授权注册税号',
        8: "资料驳回",
        28: "待上传资料(转代理)",
        29: "转代理中",
        19: "未开始",
        20: "未开始(已开始报税)",
        21: "待提交报税资料",
        18: "申报中",
        22: "待缴纳税金",
        23: "待审核申报",
        24: "申报驳回",
        25: "申报完成（客户端完成）",
        26: "申报失败",
        27: "申报完成(整体完成)",
        31: "转代理资料待审核",
        32: "转代理资料驳回",
        33: "税金待审核",
        34: "缴税凭证被驳回",
        35: "待上传零申报凭证"
      },
    }
  },
  mounted() {
    this.getList();
    this.getCountryList()
  },
  methods: {
    //获取列表
    getList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo }
      API.getRegProductInfo(params).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
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
    searchList(type) {
      if (type === 'searchForm') {
        this.pageInfo.page = 1;
        this.searchForm.status = '-1';
      }
      this.getList();
    },
    //重置列表
    resetList() {
      this.searchForm = {
        status: '-1',
        searchContent: '',
        startTime: '',
        endTime: '',
        auditTimeBegin:'',
        auditTimeEnd:'',
        countryCode: ''
      }
      this.pageInfo = {
        limit: 10,
        page: 1,
      }
      this.date = "";
      this.date1 = ""
      this.getList()
    },
    //工单创建时间
    dateChange(date) {
      this.searchForm.startTime = date[0];
      this.searchForm.endTime = date[1];
    },
    //工单审核时间
    dateChange1(date1) {
      this.searchForm.auditTimeBegin = date1[0];
      this.searchForm.auditTimeEnd = date1[1];
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
      this.getList();
    },
    //查看详情
    toDetail(row) {
      this.isDetailShow = true;
      this.detailId = row.id;
      this.progressBar = row.progressBar
      this.userId = row.userId
    },
    //发送提醒
    sendMessage(rowData) {
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
      this.pageInfo.page = 1;
      this.searchForm.status = -1;
      // this.searchForm = {};
      // this.date = '';
      this.getList()
    },
    //审核操作
    handleAudit(rowData) {
      this.auditModal = true;
      this.workId = rowData.workId;
    },
    //确认审核
    sureAudit() {
      let params = {
        workId: this.workId,
        status: this.isAudit,
        remark: this.remark
      }
      if (this.isAudit == 1) {
        delete params.remark
      }
      API.handleAudit(params).then((res) => {
        console.log('审核操作res', res)
        if (res.code == 0) {
          this.$Message.success('审核成功')
          this.auditModal = false
          this.getList()
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
  }
}
</script>
<style lang="less" scoped>
</style>