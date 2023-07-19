<template>
  <div class="userDetail">
    <div class="back"
         @click="goBack()">返回</div>
    <Card>
      <p slot="title">基本信息</p>
      <div class="basicInfoBox">
        <Row class="rowItem">
          <Col span="4"
               class="right">用户ID：</Col>
          <Col span="4">{{userbaseInfo.userId || ''}}</Col>
          <Col span="4"
               class="right">用户昵称：</Col>
          <Col span="4">{{userbaseInfo.userNickname || '未填写'}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4"
               class="right">登陆账号：</Col>
          <Col span="4">{{userbaseInfo.userMobile || '未填写'}}</Col>
          <Col span="4"
               class="right">用户邮箱：</Col>
          <Col span="4">{{userbaseInfo.userEmail || '未填写'}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4"
               class="right">用户类型：</Col>
          <Col span="4">{{userbaseInfo.userType ==0?'普通用户':userbaseInfo.userType==1?'成交用户':userbaseInfo.userType==2?'渠道用户':userbaseInfo.userType==3?'推广用户':'暂无' }}
          <span style="color:#16ADE9;cursor:pointer;"
                @click="userLeavelBox=true">修改</span>
          </Col>
          <Col span="4"
               class="right">公司名称：</Col>
          <Col span="4">{{userbaseInfo.companyName || '未填写'}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4"
               class="right">用户来源：</Col>
          <Col span="4">{{userbaseInfo.source == 0 ? 'PC网页端' : userbaseInfo.source == 1 ? '微信小程序' : userbaseInfo.source == 3 ? '微信APP' : ''}}</Col>
          <Col span="4"
               class="right">地址：</Col>
          <Col span="4">{{userbaseInfo.province + userbaseInfo.city || '未填写'}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4"
               class="right">注册时间：</Col>
          <Col span="4">{{userbaseInfo.createTime || '未填写'}}</Col>
          <Col span="4"
               class="right">邀请来源：</Col>
          <Col span="4">{{userbaseInfo.inviteType === 1 ? '自然流量' : userbaseInfo.inviteType === 2 ? '客户端邀请': userbaseInfo.inviteType === 3 ? '后台业务员邀请' : userbaseInfo.inviteType === 4 ? '渠道推广' : userbaseInfo.inviteType === 6 ? '销售易' : '未填写'}}</Col>
        </Row>
        <Row class="rowItem">
          <Col span="4"
               class="right">跟进人：</Col>
          <Col span="4">{{userbaseInfo.followUserName || '未填写'}}</Col>
          <Col span="4"
               class="right">邀请人：</Col>
          <Col span="4">{{userbaseInfo.inviteUserName || '未填写'}}</Col>
        </Row>
      </div>
    </Card>
    <Card style="margin-top:10px;">
      <p slot="title">订单信息</p>
      <Table :data="data"
             :columns="columns"
             border>
        <template slot="operation"
                  slot-scope="{row}">
          <div @click="toDetail(row.id)">【详情】</div>
        </template>
      </Table>
    </Card>
    <Card style="margin-top:10px;"
          class-name="followMes">
      <p slot="title">跟进记录</p>
      <Button type="primary"
              slot="extra"
              @click="addFollowModel = true">+添加跟进</Button>
      <div class="box"
           v-for="(item, index) in userFollowerRecords"
           :key="index">
        <p class="content">{{item.remark}}</p>
        <p>
          <span class="time"
                style="margin-right:20px;">跟进时间：{{item.updateTime}}</span>
          <span class="name">创建人：{{item.followUserName}}</span>
        </p>
      </div>
    </Card>
    <Modal v-model="addFollowModel"
           title="添加跟进记录"
           @on-ok="addFollow">
      <Input v-model="addFollowContent"
             type="textarea"
             :autosize="{minRows: 2,maxRows: 5}"
             placeholder="请输入跟进的内容" />
    </Modal>
    <Modal v-model="userLeavelBox"
           title="用户级别"
           @on-ok="sureChangeUserLeavel">
      <p>当前级别：{{userbaseInfo.userType ==0?'普通用户':userbaseInfo.userType==1?'成交用户':userbaseInfo.userType==2?'渠道用户':'暂无'}}</p>
      <Select style="width:300px;"
              clearable
              v-model="userType"
              placeholder="用户级别">
        <Option value="0">普通用户</Option>
        <!-- <Option value="1">成交用户</Option> -->
        <Option value="2">渠道用户</Option>
        <!-- <Option value="3">推广用户</Option> -->
      </Select>
    </Modal>
  </div>
</template>
<script>
import { getOrderList } from '@/api/iipto/order'
import { getUsersDetail, addFollowRecord, updateUserType } from '@/api/iipto/user'
export default {
  name: 'userDetail',
  props: ['id', 'userMobile'],
  data() {
    return {
      addFollowModel: false,
      idNow: '',
      userbaseInfo: {}, // 基本信息
      searchInfo: {
        orderUserId: this.id,
        page: 1,
        limit: 10
      },
      addFollowContent: '',
      userFollowerRecords: [],
      data: [],
      columns: [
        {
          title: '订单号',
          key: 'orderNo'
        },
        {
          title: '订单金额',
          key: 'orderAllMoney'
        },
        {
          title: '优惠金额',
          key: 'discAmountMoney'
        },
        {
          title: '已付金额',
          key: 'amountAllMoney'
        },
        {
          title: '下单时间',
          key: 'createTime'
        },
        {
          title: '操作',
          slot: 'operation'
        }
      ],
      userLeavelBox: false,
      userType: ''
    }
  },
  methods: {
    addFollow() {
      if (this.addFollowContent === '') {
        this.$Message.success('请添加跟进记录')
        return
      }
      addFollowRecord({
        content: this.addFollowContent,
        userId: this.id
      }).then(res => {
        if (res.code === 0) {
          this.data = res.data.records
          this.getInfo(this.id)
        }
      })
    },
    goBack() {
      this.$emit('changeShow')
    },
    getInfo(id) {
      getUsersDetail({
        userId: id
      })
        .then(
          res => {
            if (res.code === 0) {
              this.userbaseInfo = res.data.userBasic
              this.userFollowerRecords = res.data.userFollowerRecords
            }
          },
          err => { }
        )
        .finally(() => { })
    },
    getData() {
      let data = {
        searchContent: this.userMobile,
        page: 1,
        limit: 20
      }
      getOrderList(data).then(res => {
        if (res.code === 0) {
          this.data = res.data.records
        }
      })
    },
    toDetail(id) {
      this.$router.push({
        path: '/iiptoOrderDetail',
        query: {
          id
        }
      })
    },
    sureChangeUserLeavel() {
      let data = {
        userId: this.id,
        userType: this.userType
      }
      updateUserType(data).then(res => {
        if (res.code == 0) {
          this.getInfo(this.id)
        }
      })
    }
  },
  mounted() {
    this.getInfo(this.id)
    this.getData()
  }
}
</script>
<style lang="less">
.userDetail {
  .back {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    cursor: pointer;
  }
  .basicInfoBox {
    .rowItem {
      margin-bottom: 10px;
    }
  }
}
.box {
  padding: 20px 40px;
  border-bottom: 1px solid #e8eaec;
  .content {
    font-weight: bold;
    margin-bottom: 20px;
  }
}
</style>
