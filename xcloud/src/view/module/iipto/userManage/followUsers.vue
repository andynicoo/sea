<template>
  <div class="userAdmin">
    <Card v-if="!isDetail">
      <Form ref="searchForm" :model="searchForm" class :label-width="10" inline>
        <!-- <FormItem label prop="source">
          <Select style="width:120px;" clearable v-model="searchForm.source" placeholder="用户来源">
            <Option
              v-for="(item,index)  in allResource"
              :value="item.name"
              :key="item.name"
            >{{item.value}}</Option>
          </Select>
        </FormItem> -->
        <FormItem label >
          <Select style="width:120px;" clearable v-model="searchForm.level" placeholder="用户级别">
            <Option value="0">潜在用户</Option>
            <Option value="1">成交用户</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model="searchForm.registerStartDate" @on-change="changeDate($event,1)" type="date" placeholder="注册时间" style="width: 120px"></DatePicker>至
          <DatePicker v-model="searchForm.registerEndDate" @on-change="changeDate($event,2)" type="date" placeholder="注册时间" style="width: 120px"></DatePicker>
        </FormItem>
         <FormItem>
          <Input placeholder="请输入用户手机号" style="width:200px;" v-model="searchForm.userMobile" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getList('searchForm')">查询</Button>
          <Button @click="clearHandler" type="primary" ghost>重置</Button>
        </FormItem>
      </Form>
      <Row type="flex" justify="end">
          <Col span="7" class-name="link">
            <div class="linkWord">
              <span>推广链接</span>
              <input type="text" :value="link" disabled>
            </div>
            <Button @click="getSalesmanChannel" type="primary" ghost>复制</Button>
         </Col>
      </Row>
      <Table
        border
        :columns="columns"
        :data="data"
        @on-selection-change="selectData"
        :loading="tableLoading"
      >
        <template slot="source" slot-scope="{ row ,index }">
          <span>{{row.source == '0' ? 'PC网页端' : row.source == '1' ? '微信小程序' : row.source == '3' ? '微信APP端' : ''}}</span>
        </template>
        <template slot="operate" slot-scope="{ row ,index }">
          <Button type="primary" ghost @click="toDetail(row.userId)">详情</Button>
          <Button type="primary" v-show="hasAuthority('user_list04')" ghost  @click="addRecords(row.userId)">添加跟进记录</Button>
        </template>
      </Table>
      <Page
        :total="listTotal"
        show-elevator
        show-sizer
        transfer
        :current="searchForm.pageIndex"
        :page-size="searchForm.pageSize"
        show-total
        @on-change="handlePage"
        @on-page-size-change="handlePageSize"
      />
    </Card>
    <userDetail v-if="isDetail" :id="detailId" @changeShow='isDetail=false'></userDetail>
    <Modal
      v-model="addRecordsModal"
      title="添加跟进记录"
      @on-ok="comfireRecords"
      @on-cancel="addRecordsModal = false"
    >
      <Input v-model="addFollowContent" type="textarea" placeholder="添加跟进记录" />
    </Modal>
  </div> 
</template>
<script>
import {changeUserStatus, myList, salesmanChannel, addFollowRecord} from '@/api/iipto/user'
import { getToken } from '@/libs/util'
import userDetail from './components/userDetail'
export default {
  name: 'registerList',
  components: {
      userDetail
    },
  data () { 
    return {
      modelTitle: '',
      distribution: false,
      link: 'https://www.iipto.com/',
      columns: [
        {
          title: 'ID',
          key: 'userId',
          width: 70
        },
        {
          title: '用户昵称',
          key: 'nickname',
          minWidth: 70
        },
        {
          title: '手机号',
          key: 'mobile',
          minWidth: 80
        },
        {
          title: '用户来源',
          slot: 'source',
          minWidth: 30
          // render:(h,params) => {
          //   return h('span',params == 0 ? "PC网页端" : "其他")
          // }
        },
         {
          title: '注册时间',
          minWidth: 30,
          key:'createTime'
          // render:(h,params) => {
          //   return h('span',params == 0 ? "PC网页端" : "其他")
          // }
        },
        {
          title: '邀请人',
          key: 'inviteUserName',
          minWidth: 50,
        },
        {
          title: '跟进人',
          key: 'followUserName',
          minWidth: 50,
        },
        {
          title: '跟进记录',
          key: 'remark',
          minWidth: 80,
        },
        {
          title: '操作',
          slot: 'operate',
          minWidth: 80
        }
      ],
      data: [],
      allResource: [
        {
          name:'0',
          value:'PC网页端'
        },
        {
          name:'1',
          value:'微信小程序'
        }
      ],
      searchForm: {
        source: '',
        pageIndex: 1,
        pageSize: 10,
        registerEndDate: '',
        registerStartDate: '',
        userMobile: '',
        level: ''
      },
      searchstatecode: [1, 0],
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        source:'',
        status:''
      },
      listTotal:0,
      tableLoading: false,
      selectArr: [],
      selectUserArr: [],
      objUserArr: [],
      isDetail: false,
      detailId: '',
      addRecordsModal: false, // 跟进记录
      addFollowContent: ''   // 跟进记录内容
    }
  },
  methods: {
    getSalesmanChannel () {
      salesmanChannel().then(res => {
        if (res.code === 0) {
          if (res.data.promteCode === '' && res.data.pageUrl === '') {
            this.$Message.error('复制失败')
            return 
          }
          let url = res.data.pageUrl + '?promteCode=' + res.data.promteCode;
          let oInput = document.createElement('input');
          oInput.value = url;
          document.body.appendChild(oInput);
          oInput.select(); // 选择对象;
          document.execCommand("Copy"); // 执行浏览器复制命令
          this.$Message.success('复制成功')
          oInput.remove()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    toDetail (id) {
      this.isDetail = true;
      this.detailId = id;
    },
    getList (type) {
      if (type === 'searchForm') {
        this.searchForm.pageIndex = 1
      }
      this.tableLoading = true
      let obj = this.searchForm
      myList(obj)
        .then(
          res => {
            if (res.code === 0) {
              this.listTotal = parseInt(res.data.total)
              let arrlist = res.data.records
              let arrType = this.allResource
              arrlist.map(function (i, k) {
                if (i.status === 1) i.status = true
                if (i.status === 0) i.status = false
                arrType.map(function (j, d) {
                  if (i.source === j.name) i.source = j.value
                })
              })
              this.data = arrlist
              this.tableLoading = false
            }
          },
          err => {}
        )
        .finally(() => {})
    },
    switchStatus (isShow, index) {
      let objswitch = isShow
      console.log(objswitch)
      if (objswitch.status === false) objswitch.status = 0
      if (objswitch.status === true) objswitch.status = 1
      let obj = { ids: objswitch.userId, status: objswitch.status }
      this.changeStatus(obj)
    },
    changeStatus (obj) {
      changeUserStatus(obj)
        .then(
          res => {
            if (res.code === 0) {
              this.$Message.success('修改成功!')
              this.getList()
              this.selectArr = []
            }
          },
          err => {}
        )
        .catch((err) => { console.log(err) })
    },
    clearHandler () {
      this.searchForm = {
        source: '',
        status: '',
        level: '',
        pageIndex: 1,
        pageSize: 10,
        inviteType: '',
        followUserId: '',
        inviteContent: '',
        searchContent: '',
        registerEndDate: '',
        registerStartDate: ''
      }
      this.getList()
    },
    // 分页
    handlePage (page) {
      this.searchForm.pageIndex = page
      this.handleSearch()
    },
    handlePageSize (size) {
      this.searchForm.pageSize = size
      this.handleSearch()
    },
    handleSearch (page) {
      if (page) {
        this.searchForm.pageIndex = page
      }
      this.getList()
    },
    changeDate(date,type){
      if(type===1){
        this.searchForm.registerStartDate=date
      }else if(type===2){
        this.searchForm.registerEndDate=date
      }
    },
    //批量操作
    selectData (val) {
      let self = this
      // console.log(val);
      this.selectUserArr = val
      val.map(function (i, k) {
        self.selectArr.push(i.userId)
      })
    },
    switchUse () {
      // console.log(this.selectArr);
      if (this.selectArr.length === 0) {
        this.$Message.warning('请选择启用的用户')
      } else {
        let selectStr = this.selectArr.join(',')
        let obj = { ids: selectStr, status: 1 }
        this.changeStatus(obj)
      }
    },
    switchnoUse () {
      if (this.selectArr.length === 0) {
        this.$Message.warning('请选择要禁用的用户')
      } else {
        let selectStr = this.selectArr.join(',')
        let obj = { ids: selectStr, status: 0 }
        this.changeStatus(obj)
      }
    },
    // 导出列表
    exportList () {
      // console.log(this.searchForm);
      let params = this.searchForm
      let formData = new FormData()
      formData.append('searchContent', this.searchForm.searchContent)
      formData.append('source', this.searchForm.source)
      formData.append('status', this.searchForm.status)
      // console.log(params);
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/plat/user/list/export', true)
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = timestamp + '.xlsx'
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    },
    operationModel(type) {
      this.distribution = true
      switch (type) {
        case 1:
          this.modelTitle = '修改跟进人'
          break;
        case 2:
          this.modelTitle = '分配跟进人'
          break;
      }
    },
    // 添加跟进记录
    addRecords(id){
      this.addRecordsModal = true
      this.currentUserId = id
    },
    comfireRecords() {
      addFollowRecord({
        content: this.addFollowContent,
        userId: this.currentUserId
      }).then(res=>{
        if(res.code===0){ 
          this.$Message.success('跟进记录添加成功!')
          this.getList()
        }
      })
    },
  },
  mounted () {
    this.getList()
  }
}
</script>
<style lang="less">
.userAdmin {
  .ivu-form,
  .ivu-row-flex {
    button {
      margin-right: 10px;
    }
  }
  .ivu-table-wrapper {
    margin-top: 10px;
    .ivu-btn {
      margin-right: 5px;
    }
  }
  .link {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .linkWord {
      margin-right: 10px;
      padding: 5px;
      border: 1px solid #dcdee2;
      display: inline-block;
      font-size: 12px;
      input {
        border: none;
        margin-left: 5px;
        background: #ffffff;
      }
    }
  }
}
.distribution {
  .title {
    text-align: center;
    font-size: 14px;
    margin-bottom: 20px;
    .name {
      color: red;
    }
  }
}
</style>
