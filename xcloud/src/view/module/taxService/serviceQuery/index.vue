<template>
    <div class="container">
        <div v-if="!showDetail">
            <Form ref="searchForm" :model="searchForm" inline :label-width="100">
                <FormItem label="客户手机号：">
                    <Input v-model="searchForm.userMobile" clearable  style="width:115px;"/>
                </FormItem>
                <FormItem label="订单号：">
                    <Input v-model="searchForm.orderNo" clearable  style="width:200px;"/>
                </FormItem>
                <FormItem label="服务号：">
                    <Input v-model="searchForm.serviceNo" clearable  style="width:200px;"/>
                </FormItem>
                <FormItem label="订单状态：">
                    <Select v-model="searchForm.status" clearable style="width:120px;">
                        <Option value="0">待付款</Option>
                        <Option value="1">已付款待确认</Option>
                        <Option value="2">已付款</Option>
                        <Option value="3">已取消</Option>
                    </Select>
                </FormItem>
                <FormItem label="国家：">
                    <Select v-model="searchForm.countryCode" clearable style="width:120px;">
                        <Option
                            v-for="(item,index) in countryList"
                            :value="item.countryCode"
                            :key="index"
                            >{{ item.countryNameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品服务：">
                    <Select v-model="searchForm.functionCode" clearable style="width:120px;">
                        <Option value="1">税号注册</Option>
                        <Option value="2">转代理申报</Option>
                        <!-- <Option value="3">税务补缴</Option> -->
                        <!-- <Option value="4">转代理</Option> -->
                        <Option value="5">注册＋申报</Option>
                    </Select>
                </FormItem>
                <FormItem label="订单创建时间：" class="requiredItem">
                    <DatePicker @on-change="changeDate" type="daterange" :value="date" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem :label-width="0">
                    <Button type="primary" @click="searchList" style="margin-right:5px;">查询</Button>
                    <Button type="primary" ghost @click="resetList">重置</Button>
                </FormItem>
            </Form>
            <p>查询结果</p>
            <Table :data="data" :columns="columns" border>
                <template slot="operation" slot-scope="{row}">
                    <div>
                        <!-- <Button v-show="hasAuthority('service_query01')" @click="checkDetail(row)">查看更多</Button> -->
                        <Button @click="checkDetail(row)">查看更多</Button>
                    </div>
                </template>
            </Table>
        </div>
        <serviceDetail v-if="showDetail" :orderId="orderId" :userId="userId" @back="showDetail=false"></serviceDetail>
    </div>
</template>
<script>
import serviceDetail from './components/serviceDetail'
import { getTaxCountry } from '@/api/taxService/common.js';
import * as API from '@/api/taxService/serviceQuery.js';
import * as API1 from '@/api/home/service.js';
export default {
    components:{
        serviceDetail
    },
    data(){
        return{
            searchForm:{
                startTime:'',
                endTime:'',
                userMobile:'',
                orderNo:'',
                serviceNo:'',
                status:'',
                countryCode:'',
                functionCode:'',
                limit:10,
                page:1
            },
            countryList: [],
            showDetail:false,
            data:[],
            columns:[
                {title:'订单号',key:'orderNo'},
                {title:'用户账号',key:'userMobile'},
                {title:'服务名称',key:'productNames'},
                {title:'创建时间',key:'createTime'},
                {title:'服务金额',key:'orderOldMoney'},
                {title:'优惠金额',key:'discAmount'},
                {title:'实付金额',key:'orderMoney'},
                {title:'订单来源',key:'orderSource',render(h,params) {
                    const orderSource=params.row.orderSource
                    let source=orderSource==0?'PC网页端':''
                    return h('span',source)
                },},
                {title:'订单状态',render(h,params) {
                    const status=params.row.status
                    let orderStatus=status==0?'待付款':status==1?'待确认付款':status==2?'已付款':status==3?'已取消':''
                    return h('span',orderStatus)
                },},
                {title:'操作',slot:'operation'},
            ],
            date:[],
            formValidate:{},
            orderId:'',
            userId:'',
            searchContent:this.$route.params.searchContent
        }
    },
    methods:{
        //获取税号国家下拉数据
        getCountryList() {
            getTaxCountry().then((res) => {
                if(res.code == 0) {
                    this.countryList = res.data
                }
            })
        },
        changeDate(date){
            this.searchForm.startTime=date[0]
            this.searchForm.endTime=date[1]
        },
        searchList(){
            API.serviceListApi(this.searchForm).then(res=>{
                if(res.code===0){
                    this.data=res.data.records
                }
            })
        },
        resetList(){
            this.searchForm={
                startTime:'',
                endTime:'',
                userMobile:'',
                orderNo:'',
                serviceNo:'',
                status:'',
                countryCode:'',
                functionCode:'',
            }
            this.date=[]
        },
        checkDetail(row){
            this.orderId=row.id
            this.userId=row.userId
            this.showDetail=true
        }
    },
    mounted(){
        this.getCountryList()
        console.log(this.searchContent)
        if(this.searchContent!=undefined){
          let data={
            searchContent:this.searchContent,
            page:1,
            limit:50
          }
          API1.serviceOrderListAPI(data).then(res=>{
            if(res.code===0){
              this.data=res.data.records
            }
          })
        }
    }
}
</script>
<style scoped lang="less">
.container{
    padding: 10px;
    background-color: #fff;
}
</style>

