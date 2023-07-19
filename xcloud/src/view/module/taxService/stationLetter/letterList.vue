<template>
    <div class="orderListWrapper">
        <div class="mainPage"  v-if="!isDetailShow">
            <Form ref="searchForm" :model="searchForm" inline>
                <FormItem label="标题：" style="width:300px;padding-left:20px;">
                    <Input v-model="searchForm.title" clearable  placeholder="请输入标题名称" style="width:200px;"/>
                </FormItem>
                <FormItem label="创建时间：" style="width:300px;">
                    <DatePicker v-model="date" type="daterange" placement="bottom-end" @on-change="dateChange" placeholder="请选择时间" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="searchList" style="margin-right:5px;">搜素</Button>
                    <Button type="primary" ghost @click="resetList">重置</Button>
                    <Button type="primary" @click="addLetters" style="margin-left:20px;">新建信件</Button>
                </FormItem>
            </Form>
            <div class="tableArea">
                <Table
                border 
                :loading="tableLoading"
                :columns="columns"
                :data="tableData"
                >
                <template slot="isDispose" slot-scope="{ row }">
                    <span>{{row.isDispose == '1' ? "待处理" : row.isDispose == '2' ? "不需要用户处理" : row.isDispose == '3' ? '处理完成' : '' }}</span>
                </template>
                <template slot="status" slot-scope="{ row }">
                    <span>{{row.status == '1' ? "未发送" : row.status == '2' ? "已发送" : '' }}</span>
                </template>
                 <template slot="receptionTime" slot-scope="{ row }">
                    <span>{{row.receptionTime.slice(0, 10)}}</span>
                </template>
                <template slot="userMobiles" slot-scope="{ row }">
                    <span>{{row.userType === 1 ? '所有用户' : row.userMobiles}}</span>
                </template>
                <template slot="advice" slot-scope="{ row }"> 
                    <span class="cursor" @click="toView(row)">【查看】</span>
                </template>
                <template slot="operate" slot-scope="{ row }">
                    <span class="cursor" @click="toDetail(row)">【详情】</span>
                    <span class="cursor" v-if="row.status === 1" @click="send(row)">【立即发送】</span>
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
        <lettersDetail v-if="isDetailShow" :rowInfo='rowInfo' @refresh="refresh" @back="backFun"></lettersDetail>
    </div>
</template>
<script>
import * as API from '@/api/taxService/letters.js';
import lettersDetail from './letterDetail'
import { getTaxCountry } from '@/api/taxService/common.js';
export default {
    name: 'orderList',
    data() {
        return {
            isDetailShow: false,
            searchForm: {
                title: '',
                createBeginTime:'',
                createEndTime: '',
            },
            date: '',
            pageInfo: {
                limit: 10,
                page: 1,
            },
            listTotal: 0,
            tableLoading: false,
            detailId: '',
            countryList: [],
            columns: [
                {
                    title: '序号',
                    type: 'index',
                    width: 70
                },
                {
                    title: '标题',
                    key: 'title',
                    minWidth:200,
                },
                {
                    title: '用户手机号',
                    slot:'userMobiles'
                },
                {
                    title: '是否发送',
                    slot:'status'
                },
                {
                    title: '创建时间',
                    key: 'updateTime'
                },
                {
                    title: '操作',
                    slot: 'operate'
                }
            ],
            tableData:[],
            rowInfo: {}
        }
    },
    components: {
        lettersDetail
    },
    mounted() {
        this.getLetterList();
        this.baseInfo()
    },
    methods: {
        //订单创建时间
        dateChange(date) {
            this.searchForm.createBeginTime = date[0];
            this.searchForm.createEndTime = date[1];
        },
        baseInfo() {
            API.baseInfo().then((res)=> {
                if (res.code === 0) {
                    this.countryList = res.data
                }
            }).catch(error => {
                console.log(error)
            }) 
        },
        //获取列表
        getLetterList() {
            this.tableLoading = true;
            let params = {...this.searchForm, ...this.pageInfo};
            API.stationLetterList(params).then((res) => {
                if(res.code == 0) {
                    // console.log(res.data.records)
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
            this.getLetterList()
        },
        //重置列表
        resetList() {
            this.searchForm = {};
            this.date = "";
            this.pageInfo.page = 1;
            this.getLetterList()
        },
        //分页
        changePageHandler(page) {
            this.pageInfo.page = page
            this.getLetterList()
        },
        //查看详情
        toDetail(row) {
            this.isDetailShow = true;
            this.rowInfo = row;
        },
        // 新建
        addLetters() {
            this.isDetailShow = true;
            this.rowInfo = {}
        },
        refreshList() {
            this.isDetailShow = false;
        },
        backFun () {
            this.isDetailShow = false
        },
        refresh() {
            this.isDetailShow = false
            this.getLetterList()
        },
        toView(row) {
            this.$Modal.info({
                title: '处理建议:',
                content: row.advise
            });
        },
        sendLetter(row) {
            this.$Modal.confirm({
                title: '温馨提示',
                content: '<p>是否发信给用户</p>',
                onOk: () => {
                    API.sendLetter({
                        id: row.id
                    }).then((res) => {
                        if(res.code == 0) {
                            this.$Message.success('发送成功');
                            this.getLetterList()
                        }
                    })  
                },
            });
        },
        send(row) {
            this.$Modal.confirm({
                title: '发送站内信',
                content: '<p>是否确认发送站内信</p>',
                onOk: () => {
                    API.stationLetterSend({
                        id: row.id
                    }).then((res) => {
                        this.tableLoading = false;
                        if(res.code == 0) {
                            this.getLetterList()
                            this.$Message.success('发送成功');
                        }else {
                            this.$Message.warning(res.message);
                        }
                    })
                    .catch((err) => console.log(err))
                }
            });
        },
        dealWithLetter (row) {
            this.$Modal.confirm({
                title: '温馨提示',
                content: '<p>是否处理该信件</p>',
                onOk: () => {
                    API.dispose({
                        id: row.id
                    }).then((res) => {
                        if(res.code == 0) {
                            this.$Message.success('处理成功');
                            this.getLetterList()
                        }
                    })  
                },
            });
        },  
    }
}
</script>
<style lang="less" scoped>
    .orderListWrapper {
        background: #ffffff;
        .mainPage {
            padding: 20px;
        }
    }
    .money {
        .statistical {
            font-size: 14px;
            padding-bottom: 10px;
        }
    }
    .cursor {
        cursor: pointer;
    }
</style>