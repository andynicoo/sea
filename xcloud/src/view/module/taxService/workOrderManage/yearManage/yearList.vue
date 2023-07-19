<template>
    <div>
        <div v-if="!showDEannals">
            <div class="title1">
                <span class="label">公司名称/税号</span>
                <Input v-model="pageData.inputStr" clearable placeholder="请输入公司名称/税号" style="width: 200px;margin-right:32px" />
                <span class="label">审核状态</span>
                <Select v-model="pageData.auditStatus" clearable style="width:170px;margin-right:32px" placeholder="请选择审核状态">
                  <Option :value="'0'">{{'未审核'}}</Option>
                  <Option :value="'1'">{{'已审核'}}</Option>
                  <Option :value="'2'">{{'被驳回'}}</Option>
                </Select>
                <!-- <span class="label">国家</span>
                <Select v-model="pageData.countryCode" clearable style="width:170px;margin-right:32px" placeholder="请选择国家">
                  <Option v-for="(item,index) in countryList" :value="item.countryCode" :key="index">{{ item.countryNameZh }}</Option>
                </Select> -->
                <span class="label">报税状态</span>
                <Select v-model="pageData.status" clearable style="width:170px;margin-right:32px" placeholder="请选择报税状态">
                  <Option :value="'21'">{{'待提交报税资料'}}</Option>
                  <Option :value="'27'">{{'申报完成'}}</Option>
                </Select>
                <br/>
                <br/>
                <br/>
                <span class="label">年度申报时间（年）</span>
                <DatePicker type="year" v-model="pageData.year" placeholder="请选择年度申报时间" style="width: 200px"></DatePicker>
                
                <Button type="primary" @click="handleSubmit" style="margin-left: 94px">搜索</Button>
                <Button @click="handleReset" style="margin-left: 10px">重置</Button>
            </div>
            <div class="table">
                <Table :data="annalsDeData"
                        :columns="annalsDeColumns"
                        border
                        style="margin-bottom:40px;margin-top:40px;">
                    <template slot="operation"
                            slot-scope="{row}">
                    <div class="operation-box">
                        <span v-if="row.status==21"
                            style="cursor:pointer;color:#F79728"
                            @click="goAnnalsDE(row,false)">
                         【提交申报】
                        </span>
                        <span v-if="row.status==27&&row.declareReceipt!=''">
                        <a :href="row.declareReceipt"
                            target="_blank">【查看回执】</a>
                        </span>
                        <span @click="getDEyearDetailFun(row)"
                            style="cursor:pointer;color:#16ADE9;margin-left:5px">【详情】</span>
                    </div>
                    </template>
                </Table>
                <div>
                    <Page class="pagination"
                        :current="pageData.page"
                        :total="total"
                        @on-change="registerChangePageHandler"
                        :page-size="pageData.limit" />
                </div>
            </div>
        </div>
        <annalsDE v-if="showDEannals"
                    :workId="workId"
                    :serviceId="serviceId"
                    :baseData="baseDataDe"
                    :detailsReturnData="detailsReturnData"
                    @back="goBack"></annalsDE>
    <Modal title="年报详情" v-model="deYearDetail" width="1000" footer-hide>
      <Row>
        <Col span="12">
        <span class="tax-info-name">公司英文名称：</span>
        <span class="tax-info-value">{{thatDEinfo.companyNameEn}}</span>
        </Col>
        <Col span="12">
        <span class="tax-info-name">VAT税号：</span>
        <span class="tax-info-value">{{thatDEinfo.vatTaxNumber}}</span>
        </Col>
      </Row>
      <Row style="margin-top:10px;">
        <Col span="12">
        <span class="tax-info-name">年度申报时间/年：</span>
        <span class="tax-info-value">{{thatDEinfo.year}}年</span>
        </Col>
        <Col span="12">
        <span class="tax-info-name">申报区间：</span>
        <span class="tax-info-value">{{thatDEinfo.beginTime}}至{{thatDEinfo.endTime}}</span>
        </Col>
      </Row>
      <Divider />
      <p>申报回执：
        <a target="_blank" :href="thatDEinfo.declareReceipt" v-if="thatDEinfo.declareReceipt!=''">查看</a>
      </p>
      <p style="margin:10px 0;">申报数据：</p>
      <Table :data="deAnnalsData" :columns="deAnnalsColumns" border>
        <template slot="fillDiscount" slot-scope="{row}">
          <div @click="discountBox = true;dataIndex=row._index" style="cursor:pointer;">查看</div>
        </template>
        <template slot="declareReceipt" slot-scope="{row}">
          <div>
            <span v-if="row.declareReceipt==''">暂无</span>
            <a v-else :href="row.declareReceipt" target="_blank">查看</a>
          </div>
        </template>
        <template slot="payReceipt" slot-scope="{row}">
          <div>
            <span v-if="row.payReceipt==''">暂无</span>
            <a v-else :href="row.payReceipt" target="_blank">查看</a>
          </div>
        </template>
      </Table>
    </Modal>
    </div>
</template>

<script>
import { annalsDetailDElist } from "@/api/taxService/annalsDE";
import { getTaxCountry } from '@/api/taxService/common.js';
import * as APIDE from '@/api/taxService/annalsDE.js';
import annalsDE from '../../components/annalsDE';
export default {
    components:{
        annalsDE
    },
    data(){
        return{
            annalsDeColumns: [
                {
                    title: '年度申报时间（年）',
                    align: 'center',
                    key: 'year'
                },
                {
                    title: '公司名称',
                    align: 'center',
                    key: 'companyNameZh'
                },
                {
                    title: '国家',
                    align: 'center',
                    key: 'countryNameZh'
                },
                {
                title: '业务名称',
                align: 'center',
                render(h, params) {
                    let status = params.row.productFunctionCode
                    return h('span',status==2?'转代理+申报':'注册+申报')
                }
                },
                {
                    title: '年度申报区间',
                    align: 'center',
                    render(h, params) {
                        return h('span',params.row.corridor || '暂无')
                    },
                },
                {
                title: '审核状态',
                align: 'center',
                render(h, params) {
                    let status = params.row.auditStatus
                    return h('span',status==0?'未审核':status==1?'已审核':status==2?'被驳回':'')
                }
                },
                {
                title: '进度',
                align: 'center',
                render(h, params) {
                    let status = params.row.status
                    if (status == 21) {
                    return h('div', [
                        h('span', {
                        style: {
                            color: '#F79728'
                        }
                        }, '待申报'),
                    ]);
                    }
                    if (status == 27) {
                    return h('div', [
                        h('span', {
                        style: {
                            color: '#16ADE9'
                        }
                        }, '申报完成'),
                    ]);
                    }
                },
                },
                {
                title: '操作',
                align: 'center',
                slot: 'operation'
                },
            ],
            deAnnalsColumns: [
                {
                title: '申报周期',
                align: 'center',
                render(h, params) {
                    let declarePeriod = params.row.declarePeriod
                    return h('span', declarePeriod == 0 ? '月报' : declarePeriod == 1 ? '季报' : declarePeriod == 2 ? '年报' : '')
                },
                },
                {
                title: '申报月份/季度',
                align: 'center',
                render(h, params) {
                    let beginTime = params.row.beginTime.slice(0, 7)
                    let endTime = params.row.endTime.slice(0, 7)
                    return h('span', beginTime + '至' + endTime)
                },
                },
                {
                title: '不含税销售额（欧元）',
                align: 'center',
                key: 'excludeTaxPrice'
                },
                {
                title: '缴税金额（欧元）',
                align: 'center',
                key: 'allTaxPrice'
                },
                {
                title: '抵扣金额（选填）',
                align: 'center',
                slot: 'fillDiscount'
                },
                {
                title: '税率',
                align: 'center',
                render(h, params) {
                    return h('span', params.row.taxRate + '%')
                },
                },
                {
                title: '申报回执',
                align: 'center',
                slot: 'declareReceipt'
                },
                {
                title: '缴费凭证',
                align: 'center',
                slot: 'payReceipt'
                },
            ],
            countryList:[],
            showDEannals:false,
            workId:'',
            baseDataDe: {},
            annalsDeData:[],
            detailsReturnData: {},
            pageData:{
                auditStatus:'',
                countryCode:'',
                status:'',
                year:'',
                inputStr:'',
                page:1,
                limit:10
            },
            total:0,
            serviceId:'',
            deYearDetail: false,
            deAnnalsData: [],
            thatDEinfo:{}
        }
    },
    methods:{
        handleReset(){
            this.pageData={
                auditStatus:'',
                countryCode:'',
                year:'',
                status:'',
                inputStr:'',
                page:1,
                limit:10
            }
        },
        handleSubmit(){
            this.pageData.page = 1
            this.pageData.limit = 10
            if(typeof this.pageData.year === 'object' && this.pageData.year){
                this.pageData.year = this.pageData.year.getFullYear()+''
            }
            this.getDEannals();
        },
        //获取税号国家下拉数据
        getCountryList() {
        getTaxCountry().then((res) => {
            if (res.code == 0) {
            this.countryList = res.data
            }
        })
        },
        //获取德国年报工单详情
        getDEyearDetailFun(row) {
        this.thatDEinfo = {
            year: row.year,
            beginTime: row.beginTime,
            endTime: row.endTime,
            declareReceipt: row.declareReceipt,
            companyNameEn: row.companyNameEn,
            vatTaxNumber: row.vatTaxNumber,
        }
        this.deYearDetail = true
        let data = { workId: row.id }
        APIDE.deAnnalsApiDetail(data).then(res => {
            if (res.code === 0) {
            this.deAnnalsData = res.data
            }
        })
        },
        registerChangePageHandler(page) {
            this.pageData.page = page;
            this.getDEannals();
        },
        goBack() {
        this.showDEannals = false
        this.getDEannals()
        },
        getDEannals() {
            annalsDetailDElist(this.pageData).then(res => {
                if (res.code === 0) {
                this.annalsDeData = res.data.records
                this.total = res.data.total-0
                }
            })
        },
        goAnnalsDE(row, type) {
            this.showDEannals = true
            this.workId = row.id
            this.serviceId = row.orderServicesId
            let beginTime = ''
            if(row.productFunctionCode == 5 || (row.productFunctionCode == 2 && row.beginTime)){
                beginTime = row.beginTime.slice(0, 7)
            }
            let endTime = row.endTime.slice(0, 7)
            this.baseDataDe = {
                companyName: row.companyNameZh,
                companyNameEn: row.companyNameEn,
                vatTaxNumber: row.vatTaxNumber,
                year: row.year,
                time: beginTime + '至' + endTime,
                beginTime:beginTime,
                endTime:endTime,
                productFunctionCode:row.productFunctionCode,
                declareReceipt: row.declareReceipt
            }
            this.detailsReturnData = {
                excludeTaxPrice: row.excludeTaxPrice,
                deductionPrice: row.deductionPrice,
                allTaxPrice: row.allTaxPrice
            }
        },
    },
    created(){
        this.getDEannals()
        this.getCountryList()
    }
}
</script>

<style scoped lang="less">
.title1{
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 20px 60px 24px;
    background-color: #FFFFFF;
    .label{
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #666666;
        margin-right: 6px;
    }
}
.title{
    height: 78px;
    background: #ffffff;
    -webkit-box-shadow: 0px 1px 4px 0px rgb(0 21 41 / 12%);
    box-shadow: 0px 1px 4px 0px rgb(0 21 41 / 12%);
    padding: 20px 32px;
    font-size: 20px;
    font-family: "Microsoft Yahei", PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
}
.table{
    margin-top: 24px;
    overflow: hidden;
    background: #ffffff;
    padding: 0 24px 40px 24px;
}
</style>