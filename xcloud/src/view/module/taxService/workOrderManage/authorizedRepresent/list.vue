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
                  style="width:100px;"
                  placeholder="授权国家">
            <Option value="GB" key="1">英国</Option>
            <Option value="EU" key="2">欧盟</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker type="daterange"
                      :value="[this.searchForm.createTimeBegin, this.searchForm.createTimeEnd]"
                      @on-change="searchFormDataChange($event,'createTimeBegin')"
                      placeholder="服务单创建时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker type="daterange"
                      :value="[this.searchForm.startCheckPassTime, this.searchForm.endCheckPassTime]"
                      @on-change="searchFormDataChange($event,'startCheckPassTime')"
                      placeholder="服务单审核通过时间"
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
                  style="margin: 0 12px;">查询</Button>
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
                   name="60"></TabPane>
          <TabPane label="待审核资料"
                   name="61"></TabPane>
          <TabPane label="已审核"
                   name="66"></TabPane>
          <TabPane label="待授权"
                   name="64"></TabPane>
          <TabPane label="注册中"
                   name="62"></TabPane>
          <TabPane label="注册完成"
                   name="65"></TabPane>
          <TabPane label="资料驳回"
                   name="63"></TabPane>
          <TabPane label="授权驳回"
                   name="67"></TabPane>
          <TabPane label="已取消" name="82"></TabPane>
        </Tabs>
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData">
          <template slot="operate"
                    slot-scope="{ row }">
            <Button type="info"
                    ghost
                    size="small"
                    v-show="hasAuthority('authorizedRepresent_detail')"
                    @click="toDetail(row)">查看</Button>
            <Button type="info"
                    ghost
                    style="margin-left:5px"
                    size="small"
                    v-show="hasAuthority('authorizedRepresent_authorizationRejection')"
                    v-if="row.progressBar == 62"
                    @click="refuseShouquan(row)">授权驳回</Button>
          </template>
          <template slot="refuseReason" slot-scope="{ row }">
            <span style="color:rgb(22, 173, 233);cursor:pointer;" @click="showRefuseReason(row)">查看</span>
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
    <Modal v-model="refuseShouquanModal" title="授权驳回">
      <Form ref="refuseForm" :model="refuseForm">
        <FormItem prop="refuseReason" label="驳回原因：">
          <Input v-model="refuseForm.refuseReason" type="textarea" :rows="4" placeholder="请输入驳回原因（必填）" />
        </FormItem>
      </Form>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" ghost @click="refuseShouquanModal=false">取消</Button>
        <Button type="primary" @click="sureRefuse">确定</Button>
      </div>
    </Modal>
    <Modal v-model="refuseReasonModal" title="驳回详情">
      <div v-if="refuseReasonList.length>0" :class="refuseReasonList.length>3?'overflow':''" style="padding-right: 15px;">
        <div class="remark-list" v-for="(item,index) in refuseReasonList" :key="index">
          <p>
            <span>驳回人：</span>
            <span>{{ item.refuseBy }}</span>
          </p>
          <p>
            <span>驳回原因：</span>
            <span>{{ item.refuseReason }}</span>
          </p>
          <p>
            <span>驳回时间：</span>
            <span>{{ item.refuseTime }}</span>
          </p>
        </div>
      </div>
      <div v-else style="text-align:center;font-size:30px;line-height:212px">
        当前服务单无驳回
      </div>
      <p slot="footer" style="text-align:center">
        <Button type="primary" ghost @click="refuseReasonModal=false">关闭</Button>
      </p>
    </Modal>
    <Details v-if="isDetailShow && detailObj!=null"
             :serviceId="serviceId"
             :detailObj="detailObj"
             @back="isDetailShow=false"
             @refresh="getList"></Details>
  </div>
</template>
<script>
import Details from './components/details'
import * as API from '@/api/taxService/compliance.js';
import { getTaxCountry } from '@/api/taxService/common.js';
export default {
  name: 'mainList',
  components: {
    Details
  },
  data() {
    return {
      detailObj:null,
      isDetailShow: false,
      refuseForm:{
        refuseReason:'',
        serviceId:'',
        status:'67'
      },
      refuseShouquanModal:false,
      refuseReasonModal:false,
      refuseReasonList:[],
      searchForm: {
        status: '-1',
        searchContent: '',
        countryCode: '',
        createTimeBegin:'',
        startCheckPassTime:'',
        createTimeEnd:'',
        endCheckPassTime:'',
        productClass:'2'
      },
      tableLoading: false,
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
          title: '服务类型',
          key: 'productFunctionCode',
          render(h, params) {
            let serviceName = '', code = params.row.productFunctionCode;
            serviceName = code == 16 ? '授权代表' : ''
            return h('span', serviceName)
          },
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
          title: '创建时间',
          key:'createTime'
        },
        {
          title: '审核通过时间',
          key:'checkPassTime'
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
          title: '客户手机号',
          key: 'userMobile',
          width: 114
        },
        {
          title: '跟进人',
          key: 'taxFollowUserName'
        },
        {
          title: '驳回原因',
          slot: 'refuseReason',
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
      workId: '',
      progressBar: '',
      serviceId: '',
      progressStatus: {
        60: '待上传资料',
        61: '待审核',
        62: '注册中',
        63: '资料驳回',
        64: '待授权',
        65: '注册完成',
        66: '已审核',
        67: '授权驳回',
      },
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    showRefuseReason(row){
      API.deniedList({serverNo:row.serverNo}).then(res=>{
        if(res.code == 0){
          this.refuseReasonList = res.data
          this.refuseReasonModal = true
        }
      })
    },
    refuseShouquan(row){
      this.refuseForm={
        refuseReason:'',
        serviceId:row.id,
        status:'67'
      }
      this.refuseShouquanModal = true
    },
    sureRefuse(){
      if(this.refuseForm.refuseReason == ''){
        this.$Message.error('驳回原因不能为空')
        return
      }
      API.denied(this.refuseForm).then(res=>{
        if(res.code == 0){
          this.$Message.success('提交成功')
          this.refuseShouquanModal = false
          this.getList()
        }
      })
    },
    //获取列表
    getList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo }
      if(params.status == -1) params.status = ''
      API.getComplianceList(params).then((res) => {
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
    searchFormDataChange(val,type) {
        if(type == 'createTimeBegin'){
          this.searchForm.createTimeBegin = val[0]
          this.searchForm.createTimeEnd = val[1]
        }else if(type == 'startCheckPassTime'){
          this.searchForm.startCheckPassTime = val[0]
          this.searchForm.endCheckPassTime = val[1]
        }
        
    },
    //获取税号国家下拉数据
    // getCountryList() {
    //   getTaxCountry().then((res) => {
    //     if (res.code == 0) {
    //       this.countryList = res.data
    //     }
    //   })
    // },
    //搜索列表
    searchList(type) {
      this.pageInfo.page = 1;
      this.searchForm.status = '-1';
      this.getList();
    },
    //重置列表
    resetList() {
      this.searchForm = {
        status: '-1',
        searchContent: '',
        countryCode: '',
        createTimeBegin:'',
        startCheckPassTime:'',
        createTimeEnd:'',
        endCheckPassTime:'',
        productClass:'2'
      },
        this.pageInfo = {
          limit: 10,
          page: 1,
        },
      this.getList()
    },
    //选择tab状态
    tabsChange(name) {
      // if(name == -1) name = ''
      this.pageInfo.page = 1;
      this.searchForm.status = name;
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
      this.detailObj = row
      this.serviceId = row.id;
    },
  }
}
</script>
<style lang="less" scoped>
.remark-list{
  position: relative;
  font-size: 14px;
  border-bottom: 1px solid #666;
  margin-bottom: 20px;
  padding-bottom: 10px;
  word-break: break-all;
  white-space: pre-wrap;
  p{
    width: 90%;
  }
  .delet{
    position: absolute;
    color: red;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    top: 0;
    right: 0;
  }
}
</style>