<template>
    <div class="userPromoteWrapper">
        <div class="mainPage"  v-if="!isDetailShow">
            <Form ref="searchForm" :model="searchForm" inline>
                <FormItem>
                    <Input v-model="searchForm.searchContent" clearable  placeholder="请输入手机号" style="width:200px;"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="searchList" style="margin-right:5px;">查询</Button>
                    <Button type="primary" ghost @click="resetList">重置</Button>
                </FormItem>
            </Form>
            <div class="tableArea">
                <Table
                border 
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                >
                <template slot="operate" slot-scope="{ row }">
                    <div class="operation">
                        <Poptip width="440" placement="left" title="邀请的用户">
                            <Button type="info" ghost @click="toLook(row.userId,1)">查看</Button>
                            <div slot="content">
                                <Table :data="detailData" :columns="detailColumns"></Table>
                                <Page
                                    @on-change="changePageHandler1"
                                    :current="pageInfo1.page"
                                    :total="listTotal1"
                                    :page-size="pageInfo1.limit"
                                    show-total
                                    show-elevator
                                />
                            </div>
                        </Poptip>
                    </div>
                </template>
                <template slot="payCount" slot-scope="{ row }">
                    <div class="operation">
                        <Poptip width="440" placement="left" title="付费用户">
                            <Button type="info" ghost @click="toLook1(row.userId,1)">{{row.payCount}}</Button>
                            <div slot="content">
                                <Table :data="detailData1" :columns="payColumns"></Table>
                                <Page
                                    @on-change="changePageHandler2"
                                    :current="pageInfo2.page"
                                    :total="listTotal2"
                                    :page-size="pageInfo2.limit"
                                    show-total
                                    show-elevator
                                />
                            </div>
                        </Poptip>
                    </div>
                </template>
                </Table>
                <Page
                    @on-change="changePageHandler"
                    :current="pageInfo.page"
                    :total="listTotal"
                    :page-size="pageInfo.limit"
                    show-total
                    show-elevator
                />
            </div>
        </div>
    </div>
</template>
<script>
import * as API from '@/api/taxService/marketing.js';
export default {
    data() {
        return {
            isDetailShow: false,
            searchForm: {
                searchContent: '',
            },
            date: '',
            pageInfo: {
                limit: 10,
                page: 1,
            },
            listTotal: 0,
            pageInfo1: {
                limit: 5,
                page: 1,
            },
            listTotal1: 0,
            pageInfo2: {
                limit: 5,
                page: 1,
            },
            listTotal2: 0,
            tableLoading: false,
            detailId: '',
            columns: [
                    {
                        type: 'index',
                        title:'序号',
                        width: 66
                    },
                    {
                        title: '昵称',
                        key: 'userNickname',
                    },
                    {
                        title: '手机号',
                        key: 'userMobile'
                    },
                    {
                        title: '邀请用户数',
                        key:'inviteCount'
                    },
                    {
                        title: '付费用户数',
                        slot:'payCount'
                    },
                    {
                        title: '网页链接PV',
                        key: 'pcHrefPv'
                    },
                    {
                        title: '移动端链接PV',
                        key: 'mobileHrefPv'
                    },
                    {
                        title: '操作',
                        slot: 'operate'
                    }
                ],
                tableData:[],
                detailData:[],//查看数据
                detailColumns:[
                    {
                        title:'用户昵称',
                        key:'userNickname'
                    },
                    {
                        title:'用户手机号',
                        key:'userMobile'
                    },
                    {
                        title:'注册时间',
                        key:'createTime',
                        minWidth: 40,
                    }
                ],
                detailData1:[],
                payColumns:[
                    {
                        title:'用户昵称',
                        key:'userNickname'
                    },
                    {
                        title:'用户手机号',
                        key:'userMobile'
                    },
                    {
                        title:'购买总金额',
                        key:'orderOldMoney',
                    },
                    {
                        title:'优惠总金额',
                        key:'discAmount',
                    },
                    {
                        title:'实付总金额',
                        key:'orderMoney',
                    }
                ],
                payId:'',
                inviteId: '',
        }

    },
    mounted() {
        this.getList();
    },
    methods: {
        //获取列表
        getList() {
            this.tableLoading = true;
            let params = {...this.searchForm, ...this.pageInfo};
            API.getUserPromoteList(params).then((res) => {
                if(res.code == 0) {
                    this.tableLoading = false;
                    this.tableData = res.data.records;
                    this.listTotal = Number(res.data.total);
                }else {
                    this.$Message.warning(res.message);
                    this.tableLoading = false
                }
            })
            .catch((err) => console.log(err))
        },
        //搜索列表
        searchList() {
            this.pageInfo.page = 1;
            this.getList()
        },
        //重置列表
        resetList() {
            this.searchForm = {}
            this.getList()
        },
        //分页
        changePageHandler(page) {
            this.pageInfo.page = page
            this.getList()
        },
        //邀请用户分页
        changePageHandler1(page) {
            this.pageInfo1.page = page
            this.toLook(this.inviteId)
        },
        //付费用户分页
        changePageHandler2(page) {
            this.pageInfo2.page = page
            this.toLook1(this.payId)
        },
        //查看邀请的用户
        toLook(id,page) {
            this.inviteId = id;
            let params = {
                limit:5,
                page:this.pageInfo1.page,
                userId:id
            }
            if(page==1){
               params.page=page 
            }
            API.getLogs(params).then((res) => {
                if(res.code == 0) {
                    this.detailData = res.data.records
                    this.listTotal1 = Number(res.data.total)
                }else {
                    this.$Message.warning(res.data)
                }
            })
            .catch(err => console.log(err))
        },
        //查看付费用户
        toLook1(id,page) {
            this.payId = id;
            let params = {
                limit:5,
                page:this.pageInfo2.page,
                userId:id
            }
            if(page==1){
               params.page=page 
            }
            API.payUserList(params).then((res) => {
                if(res.code == 0) {
                    this.detailData1 = res.data.records
                    this.listTotal2 = Number(res.data.total)
                }else {
                    this.$Message.warning(res.data)
                }
            })
            .catch(err => console.log(err))
        },


    }
}
</script>
<style lang="less" scoped>
    .userPromoteWrapper {
        /deep/ .ivu-table-wrapper {
            overflow: inherit;
        }
    }
</style>