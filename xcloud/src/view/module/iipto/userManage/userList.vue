<template>
  <div class="userAdmin">
    <Card v-if="!isDetail">
      <Form ref="searchForm"
            :model="searchForm"
            class
            :label-width="10"
            inline>
        <!-- <FormItem label>
          <Select style="width:120px;"
                  clearable
                  v-model="searchForm.source"
                  placeholder="用户来源">
            <Option v-for="(item,index)  in allResource"
                    :value="item.name"
                    :key="item.name">{{item.value}}</Option>
          </Select>
        </FormItem> -->
        <FormItem label>
          <Select style="width:100px;"
                  clearable
                  v-model="searchForm.status"
                  placeholder="账户状态">
            <Option v-for="(item,index) in searchstatecode"
                    :value="item"
                    :key="index">{{item=== 0 ? '禁用' : '启用'}}</Option>
          </Select>
        </FormItem>
        <FormItem label>
          <Select style="width:120px;"
                  clearable
                  v-model="searchForm.userType"
                  placeholder="用户类型">
            <Option value="0">普通用户</Option>
            <Option value="2">渠道用户</Option>
          </Select>
        </FormItem>
        <FormItem label>
          <Select style="width:120px;"
                  clearable
                  v-model="searchForm.payFlag"
                  placeholder="是否付费">
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model="searchForm.registerStartDate"
                      @on-change="changeDate($event,1)"
                      type="date"
                      placeholder="注册时间"
                      style="width: 120px"></DatePicker>至
          <DatePicker v-model="searchForm.registerEndDate"
                      @on-change="changeDate($event,2)"
                      type="date"
                      placeholder="注册时间"
                      style="width: 120px"></DatePicker>
        </FormItem>
        <FormItem label>
          <Select style="width:120px;"
                  clearable
                  v-model="searchForm.inviteType"
                  placeholder="邀请来源">
            <Option value="1">自然流量</Option>
            <Option value="2">客户端邀请</Option>
            <Option value="3">后台业务员邀请</Option>
            <Option value="4">渠道推广</Option>
          </Select>
        </FormItem>
        <FormItem label>
          <Select style="width:120px;"
                  clearable
                  v-model="searchForm.followUserId"
                  placeholder="跟进人">
            <Option v-for="(item,index)  in salesList"
                    :value="item.userId"
                    :key="index">{{item.nickName}}</Option>
          </Select>
        </FormItem>
        <FormItem label>
          邀请人：
          <Input placeholder="请输入邀请人昵称/手机号"
                 style="width:200px;"
                 v-model="searchForm.inviteContent" />
        </FormItem>
        <FormItem>
          <Input placeholder="请输入手机号/用户ID/昵称"
                 style="width:200px;"
                 v-model="searchForm.searchContent" />
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="getList('searchForm')">查询</Button>
          <Button @click="clearHandler"
                  type="primary"
                  ghost>重置</Button>
        </FormItem>
      </Form>
      <!-- <Row type="flex" justify="space-between">
        <Col span="8">
          <Button type="primary" ghost @click="switchUse">批量启用</Button>
          <Button type="primary" ghost @click="switchnoUse">批量停用</Button>
        </Col>
        <Col span="1">
          <Button type="primary" @click="exportList">导出</Button>
        </Col>
      </Row> -->
      <Button type="primary"
              ghost
              v-show="hasAuthority('user_list01')"
              @click="operationModel(2)">分配跟进人</Button>
      <Button type="primary"
              ghost
              v-show="hasAuthority('user_list04')"
              @click="operationModel(3)"
              style="margin-left:8px">修改邀请人</Button>
      <Table ref="selection"
             border
             :columns="columns"
             :data="data"
             @on-selection-change="selectData"
             :loading="tableLoading"
             width="100%">
        <template slot="inviteUserName"
                  slot-scope="{ row ,index }">
          <span>{{row.inviteUserName !== '' ? row.inviteUserName : row.inviteUserMobile}}</span>
        </template>
        <template slot="status"
                  slot-scope="{ row ,index }">
          <i-switch v-model="row.status"
                    :value="row.status"
                    @on-change="switchStatus(row,index)"
                    size="large">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </template>
        <template slot="source"
                  slot-scope="{ row ,index }">
          <span>{{row.source == '0' ? 'PC网页端' : row.source == '1' ? '微信小程序' : row.source == '3' ? '微信APP端' : ''}}</span>
        </template>
        <template slot="operate"
                  slot-scope="{ row ,index }">
          <Button type="primary"
                  ghost
                  @click="toDetail(row.userId,row.mobile)">详情</Button>
          <Button type="primary"
                  ghost
                  v-show="hasAuthority('user_list02')"
                  v-if="row.followUserName !== ''"
                  @click="operationModel(1,row.followUserId,row.followUserName, row.userId)">修改跟进人</Button>
          <Button type="primary"
                  ghost
                  v-show="hasAuthority('user_list02')"
                  v-else
                  @click="operationModel(2,'','',row.userId)">分配跟进人</Button>
          <Button type="primary"
                  ghost
                  v-show="hasAuthority('user_list03')"
                  @click="addRecords(row.userId)">添加跟进记录</Button>
        </template>
      </Table>
      <Page :total="listTotal"
            show-elevator
            show-sizer
            transfer
            :current="searchForm.pageIndex"
            :page-size="searchForm.pageSize"
            show-total
            @on-change="handlePage"
            @on-page-size-change="handlePageSize" />
    </Card>
    <Modal v-model="distribution"
           width='350px'
           class-name='distribution'
           :title="modelTitle"
           @on-ok="updateFollowUserFun(modelTitle, followInfo.followUserId, followInfo.followUserName)">
      <p class="title"
         v-show="modelTitle === '分配跟进人'">请选择需要分配的跟进人员</p>
      <p class="title"
         v-show="modelTitle === '修改跟进人'">当前跟进人：
        <span class="name">{{currentFollower}}</span>
      </p>
      <Select style="width:100%;"
              @on-change="followInfoChange"
              v-model="followInfo.followUserId"
              clearable
              placeholder="跟进人">
        <Option v-for="(item,index)  in salesList"
                :value="item.userId"
                :key="index">{{item.nickName}}</Option>
      </Select>
    </Modal>
    <Modal v-model="inviteModal"
           width='350px'
           class-name='distribution'
           title="分配邀请人"
           @on-ok="updateInviteFun">
      <p class="title">分配邀请人</p>
      <Select style="width:100%;"
              label-in-value
              @on-change="changeInviteUser"
              v-model="followInfo.followUserId"
              clearable
              placeholder="跟进人">
        <Option v-for="(item,index)  in inviteUserList"
                :value="item.userId"
                :key="index">{{item.nickName}}</Option>
      </Select>
    </Modal>
    <Modal v-model="addRecordsModal"
           title="添加跟进记录"
           @on-ok="comfireRecords"
           @on-cancel="addRecordsModal = false">
      <Input v-model="addFollowContent"
             type="textarea"
             placeholder="添加跟进记录" />
    </Modal>
    <userDetail v-if="isDetail"
                :id="detailId"
                :userMobile="userMobile"
                @changeShow='isDetail=false'></userDetail>
  </div>
</template>
<script>
import { changeUserStatus, getUsersList, updateFollowUsers, changeStatus, roleusers, addFollowRecord, updateInviteUser } from '@/api/iipto/user'
import { getToken } from '@/libs/util'
import userDetail from './components/userDetail'
export default {
  name: 'registerList',
  components: {
    userDetail
  },
  data() {
    return {
      modelTitle: '',
      distribution: false,
      salesList: [],
      salesListUserId: '',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          key: 'userId',
          width: 60
        },
        {
          title: '用户昵称',
          key: 'nickname',
          minWidth: 60,
        },
        {
          title: '手机号',
          key: 'mobile',
          minWidth: 60
        },
        {
          title: '是否付费',
          key: 'payFlag',
          minWidth: 30,
          render: (h, params) => {
            return h('span', params.row.payFlag === 0 ? "否" : "是")
          }
        },
        {
          title: '用户类型',
          key: 'userType',
          minWidth: 30,
          render: (h, params) => {
            return h('span', params.row.userType === 0 ? "普通用户" : params.row.userType === 1 ? "成交用户" : params.row.userType === 2 ? "渠道用户" : params.row.userType === 3 ? "推广用户" : '')
          }
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
          key: 'createTime'
        },
        {
          title: '邀请人',
          slot: 'inviteUserName',
          minWidth: 30,
        },
        {
          title: '跟进人',
          key: 'followUserName',
          minWidth: 30
        },
        {
          title: '跟进记录',
          key: 'remark',
          minWidth: 80,
        },
        {
          title: '邀请来源',
          key: 'inviteType',
          minWidth: 50,
          render: (h, params) => {
            return h('span', params.row.inviteType == 1 ? "自然流量" : params.row.inviteType == 2 ? "客户端邀请" : params.row.inviteType == 3 ? "后台业务员邀请" : params.row.inviteType == 4 ? "渠道推广" : params.row.inviteType == 5 ? "后台分配" : `${params.row.inviteType}其他`)
          }
        },
        {
          title: '账户状态',
          slot: 'status',
          minWidth: 30
        },
        {
          title: '操作',
          slot: 'operate',
          minWidth: 80,
        }
      ],
      data: [],
      allResource: [
        {
          name: '0',
          value: 'PC网页端'
        },
        {
          name: '1',
          value: '微信小程序'
        }
      ],
      searchForm: {
        source: '',
        payFlag: '',
        status: '',
        userType: '',
        pageIndex: 1,
        pageSize: 10,
        inviteType: '',
        followUserId: '',
        inviteContent: '',
        searchContent: '',
        registerEndDate: '',
        registerStartDate: ''
      },
      searchstatecode: [1, 0],
      listTotal: 0,
      tableLoading: false,
      selectArr: [],
      selectUserArr: [],
      objUserArr: [],
      isDetail: false,
      detailId: '',
      userId: '',
      followInfo: {
        followUserId: '',
        followUserName: '',
        id: ''
      },
      addRecordsModal: false, // 跟进记录
      currentFollower: '',    // 当前跟进人,
      addFollowContent: '',   // 跟进记录内容
      inviteModal: false,
      inviteUserList: [],
      inviteInfo: {
        ids: '',
        userId: '',
        userName: ''
      },
      userMobile: ''
    }
  },
  methods: {
    toDetail(id, userMobile) {
      this.isDetail = true;
      this.detailId = id;
      // this.userId = userId
      this.userMobile = userMobile
    },
    formatDate(date, type) {
      if (typeof date === "object") {
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        let d = date.getDate();
        d = d < 10 ? "0" + d : d;
        if (type == "month") {
          return y + "-" + m;
        } else if (type == "date") return y + "-" + m + "-" + d + ' 00:00:00';
      } else {
        return date;
      }
    },
    getList(type) {
      if (type === 'searchForm') {
        this.searchForm.pageIndex = 1
      }
      this.tableLoading = true
      this.searchForm.registerStartDate = this.formatDate(this.searchForm.registerStartDate, 'date')
      this.searchForm.registerEndDate = this.formatDate(this.searchForm.registerEndDate, 'date')
      getUsersList(this.searchForm)
        .then(
          res => {
            // console.log(res)
            if (res.code === 0) {
              this.listTotal = parseInt(res.data.total)
              let arrlist = res.data.records
              arrlist.map(function (i, k) {
                if (i.status === 1) i.status = true
                if (i.status === 0) i.status = false
              })
              this.data = arrlist
              this.tableLoading = false
            }
          },
          err => { }
        )
        .finally(() => { })
    },
    getRoleusers() {
      roleusers({
        roleCode: 'director_seo;director_media;director_user;sales_manager;channel_manager;director_operations'
      }).then(res => {
        this.salesList = res.data
      }).catch(error => {
        console.log(error)
      })
      roleusers({
        roleCode: 'director_seo;director_media;director_user;sales_manager;channel_manager;director_operations'
      }).then(res => {
        this.inviteUserList = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    switchStatus(isShow, index) {
      let objswitch = isShow
      console.log(objswitch)
      if (objswitch.status === false) objswitch.status = 0
      if (objswitch.status === true) objswitch.status = 1
      let obj = { ids: objswitch.userId, status: objswitch.status }
      this.changeStatus(obj)
    },
    changeStatus(obj) {
      changeStatus(obj)
        .then(
          res => {
            if (res.code === 0) {
              this.$Message.success('修改成功!')
              this.getList()
              this.selectArr = []
            }
          },
          err => { }
        )
        .catch((err) => { console.log(err) })
    },
    clearHandler() {
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
    handlePage(page) {
      this.searchForm.pageIndex = page
      this.handleSearch()
    },
    handlePageSize(size) {
      this.searchForm.pageSize = size
      this.handleSearch()
    },
    handleSearch(page) {
      if (page) {
        this.searchForm.pageIndex = page
      }
      this.getList()
    },
    changeDate(date, type) {
      if (type === 1) {
        this.searchForm.registerStartDate = date
      } else if (type === 2) {
        this.searchForm.registerEndDate = date
      }
    },
    //批量操作
    selectData(val) {
      let self = this
      this.selectUserArr = val
      this.selectArr = []
      // console.log(this.selectUserArr)
      val.map(function (i, k) {
        self.selectArr.push(i.userId)
      })
      // console.log(self.selectArr.join(','))
    },
    switchUse() {
      // console.log(this.selectArr);
      if (this.selectArr.length === 0) {
        this.$Message.warning('请选择启用的用户')
      } else {
        let selectStr = this.selectArr.join(',')
        let obj = { ids: selectStr, status: 1 }
        this.changeStatus(obj)
      }
    },
    switchnoUse() {
      if (this.selectArr.length === 0) {
        this.$Message.warning('请选择要禁用的用户')
      } else {
        let selectStr = this.selectArr.join(',')
        let obj = { ids: selectStr, status: 0 }
        this.changeStatus(obj)
      }
    },
    // 导出列表
    exportList() {
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
    followInfoChange(obj) {
      var that = this
      this.followInfo.followUserId = obj
      for (let index = 0; index < this.salesList.length; index++) {
        const element = this.salesList[index];
        if (element.userId === obj) {
          this.followInfo.followUserName = element.nickName
        }
      }
    },
    operationModel(type, followUserId, followUserName, userid) {
      switch (type) {
        case 1:
          if (followUserName === '') {
            this.$Message.success('请先分配跟进人')
            return
          }
          this.distribution = true
          this.modelTitle = '修改跟进人'
          this.currentFollower = followUserName
          this.followInfo.followUserId = followUserId
          this.followInfo.followUserName = followUserName
          this.followInfo.id = userid
          break;
        case 2:
          if (userid !== '' && userid !== undefined) {
            this.selectArr.push(userid)
          }
          if (this.selectArr.length === 0) {
            this.$Message.success('请选择用户')
            return
          }
          this.followInfo = {}
          this.distribution = true
          this.modelTitle = '分配跟进人'
          break;
        case 3:
          if (this.selectArr.length === 0) {
            this.$Message.success('请选择用户')
            return
          }
          this.inviteModal = true
      }
    },
    // 添加跟进记录
    addRecords(id) {
      this.addRecordsModal = true
      this.currentUserId = id
    },
    comfireRecords() {
      addFollowRecord({
        content: this.addFollowContent,
        userId: this.currentUserId
      }).then(res => {
        if (res.code === 0) {
          this.$Message.success('跟进记录添加成功!')
          this.getList()
        }
      })
    },
    updateFollowUserFun(modelTitle) {
      if (JSON.stringify(this.followInfo) === "{}") {
        this.$Message.success('请选择跟进人')
        return
      }
      var ids = ''
      modelTitle === '修改跟进人' ? ids = this.followInfo.id : ids = this.selectArr.join(',')
      updateFollowUsers({
        ids: ids,
        userName: this.followInfo.followUserName,
        userId: this.followInfo.followUserId
      }).then(res => {
        if (res.code === 0) {
          this.selectArr = []
          this.$Message.success('修改成功!')
          this.getList()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    changeInviteUser(val) {
      if (val != undefined) {
        this.inviteInfo.userId = val.value
        this.inviteInfo.userName = val.label
      }
    },
    updateInviteFun() {
      if (JSON.stringify(this.inviteInfo) === "{}") {
        this.$Message.success('请选择邀请人')
        return
      }
      this.inviteInfo.ids = this.selectArr.join(',')
      updateInviteUser(this.inviteInfo).then(res => {
        this.selectArr = []
        this.$Message.success('修改成功!')
        this.getList()
      })
    }
  },
  mounted() {
    this.getList()
    this.getRoleusers()
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
}
</style>
