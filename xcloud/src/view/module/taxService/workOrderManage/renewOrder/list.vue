<template>
    <div>
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
                  placeholder="续费国家">
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker type="daterange"
                      :value="[this.searchForm.createTimeBegin, this.searchForm.createTimeEnd]"
                      @on-change="searchFormDataChange"
                      placeholder="请选择时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList"
                  style="margin: 0 12px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <Tabs :value="searchForm.status"
              :animated="false"
              @on-click="tabsChange">
          <TabPane label="全部"
                   name="-1"></TabPane>
          <TabPane label="待确认"
                   name="0"></TabPane>
          <TabPane label="已确认"
                   name="1"></TabPane>
        </Tabs>
      <Table border
            :columns="columns"
            :data="tableData"
            @on-selection-change="selectChange">
        <template slot="operate"
                slot-scope="{ row }">
        <Button type="info"
                :disabled="row.status == 1?true:false"
                :style="{'background-color':row.status == 1?'#f6f6f6':'',color:row.status == 1?'#666':'#fff'}"
                @click="renewed(row)">已续费</Button>
        </template>
    </Table>
    <div style="margin-top:10px;margin-bottom:10px">
        <Button type="info" @click="batchRenew">批量续费</Button>
    </div>
    <Page @on-change="changePageHandler"
            @on-page-size-change="handlePageSize"
            :current="searchForm.page"
            :total="listTotal"
            :page-size="searchForm.limit"
            show-total
            show-elevator
            show-sizer />
    
    </div>
</template>

<script>
import { getTaxCountry } from '@/api/taxService/common.js';
import * as API from '@/api/taxService/renewOrder.js';
export default {
    data(){
        return {
            countryList:[],
            searchForm:{
                searchContent:'',
                status:'-1',
                countryCode:'',
                createTimeBegin:'',
                createTimeEnd:'',
                page:1,
                limit:10
            },
            columns:[
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '服务号',
                    key: 'serverNo',
                },
                {
                    title: '状态',
                    render: (h, params) => {
                        let self = this
                        let data = params.row.status == 0? '待确认':'已确认'
                        return h('span', data)
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
                    title: 'VAT税号',
                    key: 'vatTaxNumber'
                },
                {
                    title: '客户手机号',
                    key: 'userMobile',
                    width: 114
                },
                {
                    title: '续费金额',
                    key: 'renewalMoney'
                },
                {
                    title: '续费时间',
                    key: 'renewalDatetime'
                },
                {
                    title: '服务截止时间',
                    key: 'expirationTime',
                    width: 100,
                },
                {
                    title: '操作',
                    slot: 'operate'
                }
            ],
            tableData:[],
            selectList:[],
            listTotal:0
        }
    },
    methods:{
        getList(){
            let data = {...this.searchForm}
            if(data.status == '-1') data.status = ''
            API.getRenewOrderList(data).then(res=>{
                if(res.code == 0){
                    this.tableData = res.data.records
                    this.listTotal = res.data.total - 0
                    if(this.tableData.length!=0){
                        for(let i=0; i<this.tableData.length; i++){
                            if(this.tableData[i].status==1){
                                this.tableData[i]._disabled = true
                            }
                        } 
                    }
                }
            })
        },
        tabsChange(name) {
        // if(name == -1) name = ''
        // console.log(name)
        this.searchForm.page = 1
        this.searchForm.status = name;
        this.getList()
        },
        //批量续费
        batchRenew() {
        // console.log(this.selectList)
        if (this.selectList.length <= 0) {
            this.$Message.info('请先选中工单，再进行批量操作')
            return
        }
        let ids = ''
        this.selectList.map((item, index) => {
            ids += item.id + ','
        })
        let data = {
            ids,
        }
        this.$Modal.confirm({
                title: '批量续费确认',
                content: '你正在进行批量续费确认，是否继续?',
                onOk:()=>{
                    API.renewedMany(data).then(res=>{
                        if(res.code == 0){
                            this.$Message.success('批量续费成功')
                            this.selectList = []
                            this.getList();
                        }
                    })
                }
            });
        },
        handlePageSize(size) {
        this.searchForm.limit = size;
        this.getList();
        },
        changePageHandler(page) {
            this.searchForm.page = page;
            this.getList();
        },
        selectChange(val) {
            this.selectList = val
        },
        //单行已续费
        renewed(row){
            this.$Modal.confirm({
                title: '续费确认',
                content: '是否确认用户已续费？',
                onOk:()=>{
                    API.renewedOne({id:row.id}).then(res=>{
                        if(res.code == 0){
                            this.$Message.success('提交成功')
                            this.getList()
                        }
                    })
                }
            });
        },
        //获取税号国家下拉数据
        getCountryList() {
            getTaxCountry().then((res) => {
                if (res.code == 0) {
                this.countryList = res.data
                }
            })
        },
        searchFormDataChange(val) {
        this.searchForm.createTimeBegin = val[0]
        this.searchForm.createTimeEnd = val[1]
        },
        searchList(){
            this.searchForm.page = 1
            this.searchForm.limit = 10
            this.getList()
        },
        resetList(){
            this.searchForm = {
                searchContent:'',
                countryCode:'',
                status:'-1',
                createTimeBegin:'',
                createTimeEnd:'',
                page:1,
                limit:10
            }
        }
    },
    mounted(){
        this.getCountryList()
        this.getList()
    }
}
</script>

<style lang="less" scoped>
// <!-- div{
//     background-color: #999;
// } -->
</style>