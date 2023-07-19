<template>
    <div>
        <div v-if="!showDetail">
            <Form ref="searchForm" :model="searchForm" inline>
                <FormItem>
                    <Input v-model="searchForm.likeName" clearable  placeholder="服务名称" style="width:200px;"/>
                </FormItem>
                <FormItem>
                    <Select clearable v-model="searchForm.countryCode" placeholder="全部国家">
                        <Option
                            v-for="(item,index) in countryList"
                            :value="item.countryCode"
                            :key="index"
                            >{{ item.countryNameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="searchList('searchForm')" style="margin-right:5px;">查询</Button>
                    <Button type="primary" ghost @click="resetList">重置</Button>
                </FormItem>
            </Form>
            <Table :data="data" :columns="columns" border>
                <template slot="functionCode" slot-scope="{row}">
                    <span>{{row.functionCode === 1 ? '注册税号' : row.functionCode === 2 ? '转代理+申报' : row.functionCode === 5 ? '注册+申报' : row.functionCode === 6 ? '注销税号' : ''}}</span>
                </template>
                <template slot="mainBanner" slot-scope="{row}">
                    <img :src="row.productImgUrl" class="mainImg">
                </template>
                <template slot="isStart" slot-scope="{row,index}">
                    <div>
                        <i-switch
                                v-model="row.status==0? true : false"
                                :value="row.status"
                                @on-change="switchStatus(row,index)"
                                size="large"
                            >
                            </i-switch>
                    </div>
                </template>
                <template slot="productType" slot-scope="{row}">
                    <span>{{row.productType === 1 ? 'PC端' : row.productType === 2 ? '小程序端' : ''}}</span>
                </template>
            </Table>
            <Page
                @on-change="changePageHandler"
                :current="searchForm.page"
                :total="listTotal"
                :page-size="searchForm.limit"
                show-total
                show-elevator
            />
        </div>
        <goodsDetail v-if="showDetail" :id="id" @refresh="returnList"></goodsDetail>
    </div>
</template>
<script>
import { getTaxCountry } from '@/api/taxService/common.js';
import * as API from '@/api/goodsManage/goodsApi.js';
import goodsDetail from './goodsDetail'
export default {
    components:{
        goodsDetail
    },
    data(){
        return{
            searchForm:{
                page:1,
                limit:10,
            },
            listTotal:0,
            countryList:[],
            data:[],
            columns:[
                {
                    title:'序号',
                    render(h,params) {
                        return h('span',params.row._index+1)
                    },
                    width:80
                },
                {
                    title:'商品服务图',
                    slot:'mainBanner'
                },
                {
                    title:'产品类型',
                    slot:'productType'
                },
                {
                    title:'服务名称',
                    key:'productName'
                },
                {
                    title:'服务类型',
                    slot:'functionCode'
                },
                {
                    title:'服务内容',
                    key:'productContent'
                },
                {
                    title:'服务国家',
                    key:'countryNameZh'
                },
                {
                    title:'服务费用',
                    key:'price'
                },
                {
                    title:'状态',
                    // slot:'isStart'
                    render(h,params) {
                        return h('span',params.row.status==0?'已上架':params.row.status==1?'已下架':params.row.status==2?'未上架':'未知状态')
                    },
                },
                {
                    title:'操作',
                    render:(h,params)=> {
                        return h('Button',{
                            on:{
                                click:()=>{
                                    this.showDetail=true
                                    this.id=params.row.id
                                }
                            }
                        },'编辑')
                    },
                },
            ],
            showDetail:false,
            id:''
        }
    },
    mounted(){
        this.getCountryList()
        this.searchList()
    },
    methods: {
         //获取税号国家下拉数据
        getCountryList() {
            getTaxCountry().then((res) => {
                if(res.code == 0) {
                    this.countryList = res.data
                }
            })
        },
        searchList(type){
            if (type === 'searchForm') {
                this.searchForm.page = 1
            }
            API.getGoodsList(this.searchForm).then(res=>{
                if(res.code===0){
                    if(res.data.records.length>0){
                        this.data=res.data.records
                        this.listTotal=res.data.total-0
                    }else{
                        this.$Message.info('无搜索结果')
                    }
                }
            })
        },
        resetList(){
            this.searchForm={
                page:1,
                limit:10,
                likeName:'',
                countryCode:''
            }
            this.searchList()
        },
        returnList(){
            this.showDetail=false
            this.searchList()
        },
        changePageHandler(page){
            this.searchForm.page=page
            this.searchList()
        },
        switchStatus(row,index){
            let objswitch = {...row}
            objswitch.status=objswitch.status==true?0:1
      
            API.updateGoodsDetail(objswitch).then(res=>{
                if(res.code===0){
                    this.$Message.success('修改成功')
                    this.searchList()
                }
            })
        },
    },
}
</script>
<style lang="less">
.mainImg{
    width: 100px;
    height: 60px;
}
</style>