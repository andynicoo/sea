<template>
<div class="container">
    <div class="top-box clearfix">
        <Form :model="searchForm" :label-width="0" inline class="fl">
            <FormItem  class="requiredItem">
                <DatePicker :value="searchForm.beginTime" type="date"  @on-change="changeDate($event,1)" style="width: 120px"></DatePicker>至
                <DatePicker :value="searchForm.endTime" @on-change="changeDate($event,2)" type="date" style="width: 120px"></DatePicker>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="search">搜索</Button>
            </FormItem>
        </Form>
        <Button type="primary" class="fr" @click="showChannelInfo(1)">新增渠道</Button>
    </div>
    <div class="container" >
        <div class="channel" v-for="(v,i) in newChannelList" :key="i">
            <p class="channel-title clearfix">推广渠道：{{v.channelName}}
                <Button class="fr" @click="showChannelInfo(2,v)">编辑</Button>
            </p>
            <Row type="flex" class="code-row-bg" v-for="(item,index) in v.listChannelPage" :key="index">
                <Col span="4"><p class="blue-num">{{item.pageName}}</p><Button label="small" class="cobyOrderSn" data-clipboard-action="copy" :data-clipboard-text="item.pageUrl+'?promteCode='+item.promteCode" @click="copyLink">复制链接</Button></Col>
                <Col span="4"><p>浏览量PV</p><p class="black-num">{{item.pvCount}}</p></Col>
                <Col span="4"><p>浏览用户UV</p><p class="black-num">{{item.uvCount}}</p></Col>
                <Col span="4"><p>注册用户数</p><p class="blue-num" @click="getRegUser(item.promteCode,1)">{{item.registerCount}}</p></Col>
                <Col span="4"><p>付费用户数</p><p class="blue-num" @click="getpaidUser(item.promteCode,1,0)">{{item.paidCount}}</p></Col>
            </Row>
        </div>
    </div>
    <Modal title="注册用户数" v-model="regBox">
        <Table :data="regData" :columns="regColumns" border :loading="regLoading"></Table>
        <Page
            @on-change="changePageHandlerReg"
            :current="pageInfo.page"
            :total="regListTotal"
            :page-size="pageInfo.limit"
            show-total
        />
    </Modal>
    <Modal title="付费用户数" v-model="payBox" @on-visible-change="modalState">
        <div style="margin-bottom:15px;">
            <DatePicker :value="searchPayForm.beginTime" type="date"  @on-change="changePayDate($event,1)" style="width: 120px" placeholder="付款时间"></DatePicker>至
            <DatePicker :value="searchPayForm.endTime" @on-change="changePayDate($event,2)" type="date" style="width: 120px;margin-right:10px;" placeholder="付款时间"></DatePicker>
            <Button type="primary" @click="getpaidUser(1,1)">搜索</Button>
        </div>
        <div style="margin-bottom:15px;">
            <span>订单金额：{{allSumOrderOldMoney}}</span>
            <span style="margin:0 12px;">优惠金额：{{allSumDiscAmount}}</span>
            <span>实付金额：{{allSumAmountMoney}}</span>
        </div>
        <Table :data="payData" :columns="payColumns" :loading="payLoading" border></Table>
        <Page
            @on-change="changePageHandler"
            :current="payPageInfo.page"
            :total="payListTotal"
            :page-size="payPageInfo.limit"
            show-total
        />
    </Modal>
    <Modal v-model="channelBox" title="新增渠道" footer-hide>
        <Form :model="channelAdd" :label-width="100">
            <FormItem  label="渠道名称：" :label-width="72">
                <Input v-model="channelAdd.channelName" clearable  style="width:338px;"/>
            </FormItem>
            <div class="link-box" v-for="(item,key) in listChannelPage" :key="key">
                <div class="clearfix">
                    <span class="fl">链接{{key+1}}：</span>
                    <Button class="fr" v-if="key>0&&id==-1" @click="delteLink(key)">删除</Button>
                </div>
                <formItem label="推广页面名称：">
                    <Input v-model="item.pageName" clearable  style="width:300px;"/>
                </formItem>
                <formItem label="链接：">
                    <Input v-model="item.pageUrl" clearable  style="width:300px;"/>
                </formItem>
            </div>
            <p class="addbtn" @click="addLink">+新增推广链接</p>
            <formItem>
                <Button type="primary" @click="submit">完成</Button>
            </formItem>
        </Form>
    </Modal>
</div>
</template>
<script>
import * as API from '@/api/taxService/channel.js';
export default {
    data(){
        return{
            searchForm:{
                beginTime:'',
                endTime:''
            },
            searchPayForm:{
                beginTime:'',
                endTime:''
            },
            channelBox:false,
            regBox:false,
            payBox:false,
            regLoading:false,
            payLoading:false,
            channelAdd:{
                channelName:''
            },
            listChannelPage:[
                {
                    pageName:'',
                    pageUrl:''
                }
            ],
            regData:[],
            regColumns:[
                {title:'用户昵称',key:'userNickname'},
                {title:'用户手机号',key:'userMobile'},
                {title:'是否付费',render(h,params) {
                    let type=params.row.payFlag==0?'未付费':params.row.payFlag==1?'付费':''
                    return h('span',type)
                },},
                {title:'注册时间',key:'createTime'},
            ],
            pageInfo:{
                page:1,
                limit:10
            },
            payPageInfo:{
                page:1,
                limit:10
            },
            payData:[],
            payColumns:[
                {title:'用户昵称',key:'userNickname'},
                {title:'用户手机号',key:'userMobile'},
                {title:'订单金额',key:'sumOrderOldMoney'},
                {title:'优惠金额',key:'sumDiscAmount'},
                {title:'实付金额',key:'sumAmountMoney'},
            ],
            regListTotal: 0,
            payListTotal:0,
            channelList:[],
            newChannelList:[],
            regCode:'',
            id:'',
            allSumOrderOldMoney:'',
            allSumDiscAmount:'',
            allSumAmountMoney:''
        }
    },
    methods:{
        search(length){
            API.getChannelListApi(this.searchForm).then(res=>{
                if(res.code===0){
                    this.channelList=res.data
                    // console.log(this.channelList)
                }
            })
        },
        changeDate(date,type){
            if(type===1){
                this.searchForm.beginTime=date
            }else if(type===2){
                this.searchForm.endTime=date
            }
        },
        modalState(obj) {
            this.searchPayForm = {
                beginTime:'',
                endTime:''
            }
        },
        changePayDate(date,type){
            if(type===1){
                this.searchPayForm.beginTime=date
            }else if(type===2){
                this.searchPayForm.endTime=date
            }
        },
        //复制链接
        copyLink() {
            let _this = this;
            let clipboard = new this.clipboard(".cobyOrderSn");
            clipboard.on("success", function(e) {
                _this.$Message.success("复制成功");
            });
            clipboard.on("error", function() {
                _this.$Message.info("复制失败");
            });
            setTimeout(() => {
                clipboard.destroy();
            }, 1000);
        },
        delteLink(key){
            this.listChannelPage.splice(key,1)
        },
        addLink(){
            let data={
                pageName:'',
                pageUrl:''
            }
            this.listChannelPage.push(data)
        },
        submit(){
            this.channelAdd.listChannelPage=this.listChannelPage
            const data={...this.channelAdd}
            data.id=this.id
            API.addAhannelApi(data).then(res=>{
                if(res.code===0){
                    this.$Message.success('添加成功')
                    this.search(this.listChannelPage.length)
                    this.channelBox=false
                    // location.reload()
                }
            })
        },
        //新增或编辑
        showChannelInfo(type,info){
            // 新增type为1  编辑type为2
            this.channelBox=true
            // console.log(info)
            const self=this
            if(type==2){
                this.id=info.id
                this.channelAdd.channelName=info.channelName
                let data=[...info.listChannelPage]
                this.listChannelPage=[]
                data.forEach((item,index)=>{
                    let obj={
                        channelId:info.id,
                        id:item.pageId,
                        pageName:item.pageName,
                        pageUrl:item.pageUrl,
                        promteCode:item.promteCode
                    }
                    self.listChannelPage.push(obj)
                })
            }else{
                this.id==-1
            }
        },
        changePageHandler(page){
            this.getpaidUser(1,page)
        },
        changePageHandlerReg(page){
            this.getRegUser(1,page)
        },
        getRegUser(code,page){
            this.regBox=true
            this.regLoading=true
            if(code!=1){
                this.regCode=code
            }
            let data={...this.searchForm}
            data.promteCode=this.regCode
            data.pageSize=10
            data.pageIndex=page
            API.channelUserListApi(data).then(res=>{
                if(res.code===0){
                    this.regData=res.data.records
                    this.regListTotal=Number(res.data.total)
                    this.regLoading=false
                }
            })
        },
        getpaidUser(code,page,time){
            if(time===0){
                this.searchPayForm={
                    beginTime:'',
                    endTime:''
                }
            }
            this.payBox=true
            this.payLoading=true
            if(code!=1){
                this.regCode=code
            }
            let data={...this.searchPayForm}
            data.promteCode=this.regCode
            data.pageSize=10
            data.pageIndex=page
            API.channelPayListApi(data).then(res=>{
                if(res.code===0){
                    this.payData=res.data.channelPayUser.records
                    this.payListTotal=Number(res.data.channelPayUser.total)
                    this.payLoading=false
                    this.allSumOrderOldMoney=res.data.allSumOrderOldMoney
                    this.allSumDiscAmount=res.data.allSumDiscAmount
                    this.allSumAmountMoney=res.data.allSumAmountMoney
                }
            })
        }
    },
    created(){
        const time = new Date()
        let year=time.getFullYear()
        let month=time.getMonth()+1
        month=month>10?month:'0'+month
        let date=time.getDate()
        date=date>10?date:'0'+date
        this.searchForm.beginTime=year+'-'+month+'-'+'01'
        this.searchForm.endTime=year+'-'+month+'-'+date
    },
    mounted(){
        this.search()
    },
    watch:{
        channelList:{
            handler(newVal,oldVal){
                this.newChannelList=newVal
            },
            deep:true
        }
    }
}
</script>
<style lang="less" scoped>
.container{
    padding: 20px;
    background-color: #fff;
    .top-box{
        .fr{
            margin-right: 100px;
        }
    }
    .channel{
        width: 100%;
        background-color: #f2f2f2;
        padding: 12px;
        margin-bottom: 10px;
        .channel-title{
            font-size: 14px;
            font-weight: 700;
            color: #333;
            margin-bottom: 8px;
        }
        .black-num{
            color: #333;
            font-weight: 700;
        }
        .blue-num{
            color: #02A7F0;
            font-weight: 700;
            cursor: pointer;
        }
    }
}
.clearfix::after{
    display: block;
    line-height: 0px;
    content: '';
    clear: both;
}
.fl{
    float: left;
}
.fr{
    float: right;
    margin-right: 92px;
}
.addbtn{
    cursor: pointer;
    text-align: right;
    padding-right: 88px;
}
.code-row-bg{
    margin-bottom: 15px;
}
</style>


