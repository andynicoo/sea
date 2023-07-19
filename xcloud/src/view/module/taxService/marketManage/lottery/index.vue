<template>
  <div>
    <Form ref="searchForm" :model="searchForm" inline>
        <FormItem>
            <Input v-model="searchForm.searchContent" clearable  placeholder="用户手机号/用户昵称" style="width:200px;"/>
        </FormItem>
        <FormItem>
            <DatePicker v-model="searchForm.startTime" type="date" @on-change="pickDate(1, $event)" placeholder="选择开始时间" style="width: 200px"></DatePicker>
            至
            <DatePicker v-model="searchForm.endTime" type="date" @on-change="pickDate(2, $event)" placeholder="选择结束时间" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="searchList" style="margin-right:5px;">搜索</Button>
        </FormItem>
    </Form>
    <Table :data="data" :columns="columns" border></Table>
    <Page
        @on-change="changePageHandler"
        @on-page-size-change="handlePageSize"
        :current="pageInfo.page"
        :total="listTotal"
        :page-size="pageInfo.limit"
        show-total
        show-elevator
        show-sizer
    />
  </div>
</template>
<script>
import * as API from '@/api/lottery';
export default {
  data(){
    return{
      searchForm:{
        searchContent:'',
        startTime:'',
        endTime:''
      },
      data:[],
      columns:[
        {
          type: 'index',
          title:'序号',
          width: 66
        },
        {
          title: '昵称',
          key: 'userNickname'
        },
        {
          title: '用户手机号',
          key: 'userMobile'
        },
        {
          title: '奖品名称',
          key: 'awardName'
        },
        {
          title: '兑奖状态',
          render(h,params) {
            let status=params.row.status,
            type=status==1?'待兑奖':status==2?'已兑奖':status==3?'已过期':''
            return h('span',type)
          },
        },
        {
          title: '注册时间',
          key: 'userRegisterTime'
        },
        {
          title: '中奖时间',
          key: 'updateTime'
        },
      ],
      pageInfo:{
        limit:10,
        page:1
      },
      listTotal:0
    }
  },
  methods: {
    // 选择时间
    pickDate(type, obj) {
        switch (type) {
            case 1:
              this.searchForm.startTime = obj
                break;
            case 2:
              this.searchForm.endTime = obj
                break;
        }    
    },
    searchList(){
      let data=Object.assign(this.searchForm,this.pageInfo)
      API.getPrizeList(data).then(res=>{
        if(res.code===0){
          this.data=res.data.records
          this.listTotal=res.data.total-0
        }
      })
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.searchList()
    },
    handlePageSize(size) {
      this.pageInfo.limit = size;
      this.searchList();
    },
  },
  created() {
    this.searchList()
  },
}
</script>