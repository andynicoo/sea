<template>
  <div class="userAdmin">
    <Card v-if="!isDetail">
      <Form ref="searchForm" :model="searchForm" class :label-width="10" inline>
         <FormItem>
          用户搜索：
          <Input placeholder="请输入用户手机号" style="width:200px;" v-model="searchForm.mobile" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="getList('searchForm')">查询</Button>
          <Button @click="clearHandler" type="primary" ghost>重置</Button>
        </FormItem>
      </Form>
      <Table
        border
        :columns="columns"
        :data="data"
        :loading="tableLoading"
      >
        <template slot="source" slot-scope="{ row ,index }">
          <span>{{row.source == '0' ? 'PC网页端' : row.source == '1' ? '微信小程序' : row.source == '3' ? '微信APP端' : ''}}</span>
        </template>
        <template slot="operate" slot-scope="{ row ,index }">
          <Button type="primary" ghost @click="toDetail(row.userId)">查看</Button>
          <Button type="primary" ghost v-if="row.followUserId === '0'" @click="toDoClaim(row.userId)">认领</Button>
        </template>
      </Table>
    </Card>
    <Modal
        v-model="claim"
        width='350px'
        class-name='distribution'
        @on-ok="comfirm">
        <p class="title">是否确认认领</p>
    </Modal>
    <userDetail v-if="isDetail" :id="detailId" @changeShow='isDetail=false'></userDetail>
  </div> 
</template>
<script>
import {changeUserStatus, searchList, claim} from '@/api/taxService/user'
import userDetail from './components/userDetail'
export default {
  name: 'registerList',
  components: {
      userDetail
    },
  data () { 
    return {
      claim: false,
      columns: [
        {
          title: 'ID',
          key: 'userId',
          width: 60
        },
        {
          title: '用户昵称',
          key: 'userNickname',
          minWidth: 60,
        },
        {
          title: '手机号',
          key: 'userMobile',
          minWidth: 80
        },
        {
          title: '用户来源',
          slot: 'source',
          minWidth: 30,
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
          minWidth: 30,
        },
        {
          title: '跟进人',
          key: 'followUserName',
          minWidth: 30,
        },
        {
          title: '操作',
          slot: 'operate',
          minWidth: 80
        }
      ],
      data: [],
      searchForm: {
        mobile: '',
      },
      tableLoading: false,
      isDetail: false,
      detailId: '',
      userId: ''
    }
  },
  methods: {
    toDoClaim(id) {
      this.claim = true
      this.userId = id
    },
    toDetail (id) {
      this.isDetail = true;
      this.detailId = id;
    },
    getList () {
      searchList({
        userMobile: this.searchForm.mobile
      }).then(res => {
        this.data = res.data.records
      }).catch(error => {
        console.log(error)
      })
    },
    clearHandler () {
      this.searchForm = {}
      this.data = []
    },
    comfirm() {
      var that = this
      claim({
        userId: this.userId
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.$Message.success('认领成功')
          that.getList()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    cancal() {

    }
  },
  mounted () {
    
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
  &/deep/ .ivu-modal-footer{
    border-top: none;
    text-align: center;
  }
}
</style>
