<template>
  <div class="container">
    <div class="search-box clearfix">
      <Form :label-width="0"
            inline
            class=" fl">
        <Input placeholder="手机号/昵称"
               v-model="searchContent"
               style="width:200px;margin-right:20px;" />
        <Button type="primary"
                @click="search(1)">搜索</Button>
      </Form>
      <Button type="primary"
              class="fr"
              @click="addList">+新增</Button>
    </div>
    <div class="container">
      <div class="channel"
           v-for="(v,i) in data"
           :key="i">
        <p class="channel-title clearfix">{{v.adminUserNickName}}：({{v.adminUserMobile}})
          <!-- <Button class="fr" @click="showChannelInfo(2,v)">编辑</Button> -->
        </p>
        <Row type="flex"
             class="code-row-bg"
             v-for="(item,index) in v.listChannelPage"
             :key="index">
          <Col span="4">
          <p class="blue-num">{{item.pageName}}</p>
          <Button label="small"
                  class="cobyOrderSn"
                  data-clipboard-action="copy"
                  :data-clipboard-text="item.pageUrl+'?promteCode='+item.promteCode"
                  @click="copyLink">复制链接</Button>
          </Col>
          <Col span="4">
          <p>浏览量PV</p>
          <p class="black-num">{{item.pvCount}}</p>
          </Col>
          <Col span="4">
          <p>浏览用户UV</p>
          <p class="black-num">{{item.uvCount}}</p>
          </Col>
          <Col span="4">
          <p>注册用户数</p>
          <p class="blue-num"
             @click="getRegUser(item.promteCode,1)">{{item.registerCount}}</p>
          </Col>
          <Col span="4">
          <p>付费用户数</p>
          <p class="blue-num"
             @click="getpaidUser(item.promteCode,1,0)">{{item.paidCount}}</p>
          </Col>
        </Row>
      </div>
    </div>
    <!-- <Page
            @on-change="changePageHandler"
            :current="pageInfo.page"
            :total="listTotal"
            :page-size="pageInfo.limit"
            show-total
        /> -->
    <Modal title="注册用户数"
           v-model="regBox">
      <Table :data="regData"
             :columns="regColumns"
             border
             :loading="regLoading"></Table>
      <Page @on-change="changePageHandlerReg"
            :current="pageInfo.page"
            :total="regListTotal"
            :page-size="pageInfo.limit"
            show-total />
    </Modal>
    <Modal title="付费用户数"
           v-model="payBox"
           @on-visible-change="modalState">
      <div style="margin-bottom:15px;">
        <DatePicker :value="searchForm.beginTime"
                    type="date"
                    @on-change="changeDate($event,1)"
                    style="width: 120px"
                    placeholder="付款时间"></DatePicker>至
        <DatePicker :value="searchForm.endTime"
                    @on-change="changeDate($event,2)"
                    type="date"
                    style="width: 120px;margin-right:10px;"
                    placeholder="付款时间"></DatePicker>
        <Button type="primary"
                @click="getpaidUser(1,1)">搜索</Button>
      </div>
      <div style="margin-bottom:15px;">
        <span>订单金额：{{allSumOrderOldMoney}}</span>
        <span style="margin:0 12px;">优惠金额：{{allSumDiscAmount}}</span>
        <span>实付金额：{{allSumAmountMoney}}</span>
      </div>
      <Table :data="payData"
             :columns="payColumns"
             :loading="payLoading"
             border></Table>
      <Page @on-change="changePageHandler"
            :current="payPageInfo.page"
            :total="payListTotal"
            :page-size="payPageInfo.limit"
            show-total />
    </Modal>
    <Modal v-model="channelBox"
           title="新增链接"
           footer-hide
           @on-visible-change="searchContent=''">
      <Form :model="channelAdd"
            :label-width="110">
        <FormItem label="推广人名字："
                  :label-width="100">
          <Input v-model="channelAdd.channelName"
                 clearable
                 style="width:338px;"
                 disabled/>
        </FormItem>
        <div class="link-box"
             v-for="(item,key) in listChannelPage"
             :key="key">
          <div class="clearfix">
            <span class="fl">链接信息：</span>
            <Button class="fr"
                    v-if="key>0&&id==-1"
                    @click="delteLink(key)">删除</Button>
          </div>
          <div class="link-box-info">
            <formItem label="链接名称：">
              <Input v-model="item.pageName"
                     clearable
                     style="width:300px;" />
            </formItem>
            <formItem label="网页链接：">
              <Input v-model="item.pageUrl"
                     clearable
                     style="width:300px;" />
            </formItem>
          </div>
        </div>
        <p class="addbtn"
           @click="addLink">+新增推广链接</p>
        <formItem>
          <Button type="primary"
                  @click="submit">完成</Button>
        </formItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/iipto/channel.js';
export default {
  data() {
    return {
      profile: this.$store.state.user,
      searchContent: '',
      listTotal: 0,
      pageInfo: {
        page: 1,
        limit: 10
      },
      searchForm: {
        beginTime: '',
        endTime: ''
      },
      searchPayForm: {
        beginTime: '',
        endTime: ''
      },
      regBox: false,
      payBox: false,
      regLoading: false,
      payLoading: false,
      regData: [],
      regColumns: [
        { title: '用户昵称', key: 'nickname' },
        { title: '用户手机号', key: 'mobile' },
        {          title: '是否付费', render(h, params) {
            let type = params.row.payFlag == 0 ? '未付费' : params.row.payFlag == 1 ? '付费' : ''
            return h('span', type)
          },        },
        { title: '注册时间', key: 'createTime' },
      ],
      payPageInfo: {
        page: 1,
        limit: 10
      },
      payData: [],
      payColumns: [
        { title: '用户昵称', key: 'userNickname' },
        { title: '用户手机号', key: 'userMobile' },
        { title: '订单金额', key: 'sumOrderOldMoney' },
        { title: '优惠金额', key: 'sumDiscAmount' },
        { title: '实付金额', key: 'sumAmountMoney' },
      ],
      data: [],
      regListTotal: 0,
      payListTotal: 0,
      allSumOrderOldMoney: '',
      allSumDiscAmount: '',
      allSumAmountMoney: '',
      channelBox: false,
      channelAdd: {
        channelName: ''
      },
      listChannelPage: [
        {
          pageName: '',
          pageUrl: ''
        }
      ],
      id: '',
    }
  },
  mounted() {
    this.search()
    // console.log(this.profile)
  },
  methods: {
    search(page, type) {
      const self = this
      API.personageListApi({ searchContent: this.searchContent }).then(res => {
        if (res.code == 0) {
          if (type == 0) {
            this.listChannelPage = res.data[0].listChannelPage
            this.listChannelPage.map((item, index) => {
              item.id = item.pageId
            })
          } else {
            this.data = res.data
          }
        }
      })
    },
    //复制链接
    copyLink() {
      let _this = this;
      let clipboard = new this.clipboard(".cobyOrderSn");
      clipboard.on("success", function (e) {
        _this.$Message.success("复制成功");
      });
      clipboard.on("error", function () {
        _this.$Message.info("复制失败");
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
    },
    changeDate(date, type) {
      if (type === 1) {
        this.searchForm.beginTime = date
      } else if (type === 2) {
        this.searchForm.endTime = date
      }
    },
    modalState(obj) {
      this.searchForm = {
        beginTime: '',
        endTime: ''
      }
    },
    changePageHandler(page) {
      this.getpaidUser(1, page)
    },
    changePageHandlerReg(page) {
      this.getRegUser(1, page)
    },
    getRegUser(code, page) {
      this.regBox = true
      this.regLoading = true
      if (code != 1) {
        this.regCode = code
      }
      let data = { ...this.searchForm }
      data.promteCode = this.regCode
      data.pageSize = 10
      data.pageIndex = page
      this.pageInfo.page=page
      console.log(page)
      API.channelUserListApi(data).then(res => {
        if (res.code === 0) {
          this.regData = res.data.records
          this.regListTotal = Number(res.data.total)
          this.regLoading = false
        }
      })
    },
    getpaidUser(code, page) {
      this.payBox = true
      this.payLoading = true
      if (code != 1) {
        this.regCode = code
      }
      let data = { ...this.searchForm }
      data.promteCode = this.regCode
      data.pageSize = 10
      data.pageIndex = page
      API.channelPayListApi(data).then(res => {
        if (res.code === 0) {
          this.payData = res.data.channelPayUser.records
          this.payListTotal = Number(res.data.channelPayUser.total)
          this.payLoading = false
          this.allSumOrderOldMoney = res.data.allSumOrderOldMoney
          this.allSumDiscAmount = res.data.allSumDiscAmount
          this.allSumAmountMoney = res.data.allSumAmountMoney
        }
      })
    },
    delteLink(key) {
      this.listChannelPage.splice(key, 1)
    },
    addLink() {
      let data = {
        pageName: '',
        pageUrl: ''
      }
      this.listChannelPage.push(data)
    },
    submit() {
      this.channelAdd.listChannelPage = this.listChannelPage
      // console.log(this.listChannelPage)
      const data = { ...this.channelAdd }
      data.id = this.id
      API.addPchannelApi(data).then(res => {
        if (res.code === 0) {
          this.$Message.success('添加成功')
          this.searchContent = ''
          this.search()
          this.channelBox = false
          // location.reload()
        }
      })
    },
    addList() {
      // this.id=info.id
      this.channelBox = true
      let userName = this.profile.userName != undefined ? this.profile.userName : ''
      let nickName = this.profile.nickName != undefined ? this.profile.nickName : ''
      this.channelAdd.channelName = nickName + userName
      this.searchContent = this.profile.userName
      this.search(1, 0)
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  padding: 10px;
  background-color: #fff;
  .search-box {
    padding: 15px;
    background-color: #f2f2f2;
    margin-bottom: 20px;
  }
}
.container {
  padding: 20px;
  background-color: #fff;
  .top-box {
    .fr {
      margin-right: 100px;
    }
  }
  .channel {
    width: 100%;
    background-color: #f2f2f2;
    padding: 12px;
    margin-bottom: 10px;
    .channel-title {
      font-size: 14px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
    }
    .black-num {
      color: #333;
      font-weight: 700;
    }
    .blue-num {
      color: #02a7f0;
      font-weight: 700;
      cursor: pointer;
    }
  }
}
.clearfix::after {
  display: block;
  line-height: 0px;
  content: '';
  clear: both;
}
.fl {
  float: left;
}
.fr {
  float: right;
  margin-right: 92px;
}
.addbtn {
  cursor: pointer;
  text-align: right;
  padding-right: 88px;
}
.code-row-bg {
  margin-bottom: 15px;
}
.link-box-info {
  background-color: #f2f2f2;
  padding: 15px 0 1px 0;
}
</style>


