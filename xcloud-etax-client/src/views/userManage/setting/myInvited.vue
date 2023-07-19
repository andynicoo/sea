<template>
  <div class="mainContent">
    <div class="my-card"
         :style="contentStyleObj">
      <p class="title">邀请的用户</p>
      <div class="topImg"
           @click="inviteBox=true">
        <img src="@/assets/images/user/invieBanner.png"
             alt="">
      </div>
      <Table style="min-height:184px;margin-top:10px"
             no-data-text="暂无邀请用户"
             border
             :columns="columns"
             :data="inviteList">
        <template slot="operate"
                  slot-scope="{ row }">
          <span @click="toRegister(row)"
                class="operate">去处理</span>
        </template>
      </Table>
      <div class="page-box">
        <Page :current="currentPage"
              :total="listTotal"
              @on-change="registerChangePageHandler"
              @on-page-size-change="registerPageSizeChangeHandler"
              :page-size="perPageCount"
              show-total />
      </div>
    </div>
    <Modal v-model="inviteBox"
           :mask-closable="false"
           footer-hide
           :width="640"
           class-name="vertical-center-modal">
      <p class="invit-title"
         slot="header">快速邀请朋友，一键报税！</p>
      <div class="invit-content">
        <p class="invit-input fl">{{shareLink}}</p>
        <p class="link-btn cobyOrderSn"
           data-clipboard-action="copy"
           :data-clipboard-text="shareLink"
           @click="copyLink">复制链接</p>
        <!-- <div class="active-rule">
                    <p class="rule-title">活动规则</p>
                    <p class="rule-content">一：邀请三个用户成功注册跨税云账号，即可免费注册一个英国税号；<br> 二：优惠券仅限本账号使用，不能转让；<br> 三：优惠券有效期限：30天；<br> 四：活动有效期：2020.3.19-2020.4.19；</p>
                </div> -->
      </div>
    </Modal>
  </div>
</template>
<script>
import { inviteUser } from "@/api/user/userModule";
export default {
  data() {
    return {
      contentStyleObj: {
        "min-height": ""
      },
      columns: [
        {
          title: "序号",
          align: 'center',
          type: "index",
        },
        {
          title: "用户昵称",
          align: 'center',
          render(h, params) {
            let userNickname = params.row.userNickname
            if (userNickname == '') {
              return h('span', '未填写')
            } else {
              return h('span', userNickname)
            }
          }
        },
        {
          title: "手机号",
          align: 'center',
          render(h, params) {
            let mobile = params.row.userMobile
            return h('span', mobile.slice(0, 7) + '****')
          }
        },
        {
          title: "注册时间",
          align: 'center',
          key: "createTime"
        }
      ],
      inviteList: [],
      perPageCount: 10,
      currentPage: 1,
      listTotal: 0,
      shareLink: '',
      inviteBox: false
    }
  },
  methods: {
    getHeight() {
      this.contentStyleObj["min-height"] = window.screen.height - 220 + "px";
    },
    getInviteList(page) {
      let data = {
        limit: this.perPageCount,
        page: this.currentPage
      }
      inviteUser(data).then(res => {
        if (res.code === 0) {
          this.inviteList = res.data.records
          this.listTotal = res.data.total - 0
        }
      })
    },
    registerChangePageHandler(current) {
      this.currentPage = current;
      this.getInviteList();
    },
    registerPageSizeChangeHandler(pageSize) {
      this.perPageCount = pageSize;
      this.getInviteList();
    },
    getUserService() {
      let userInfo = JSON.parse(localStorage.getItem('objInfo'))
      this.shareLink = this.shareUrl + "?invitedCode=" + userInfo.invitedCode;
    },
    copyLink() {
      let _this = this;
      let clipboard = new this.clipboard(".cobyOrderSn");
      clipboard.on('success', function () {
        _this.$Message.success("复制成功")
      });
      clipboard.on('error', function () {
        _this.$Message.info("复制失败")
      });
      setTimeout(() => {
        clipboard.destroy()
      }, 1000);
    },
  },
  created() {
    this.getHeight()
    this.getInviteList()
    this.getUserService()
  }
}
</script>
<style lang="less" scoped>
.mainContent {
  margin: 24px;
  .my-card {
    .title {
      font-size: 24px;
      font-weight: 500;
      color: #333;
      margin-bottom: 24px;
    }
    .topImg > img {
      width: 100%;
    }
  }
}
.page-box {
  text-align: center;
  margin: 25px 0 40px 0;
}
.vertical-center-modal .invit-title {
  text-align: center;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  font-size: 20px;
}
/deep/ .ivu-modal-header {
  background: #ffffff !important;
}

.invit-content {
  margin-left: 20px;
  margin-top: 20px;
  padding-bottom: 30px;
  .invit-input {
    width: 480px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding-left: 14px;
    background-color: #f0f0f0;
  }
  /deep/ .ivu-input {
    height: 40px;
    border-radius: 0;
    padding: 11px 14px;
  }
  .link-btn {
    display: inline-block;
    width: 88px;
    height: 40px;
    color: #fff;
    line-height: 40px;
    text-align: center;
    background-color: #16ade9;
    font-size: 14px;
    cursor: pointer;
  }
  .active-rule {
    width: 568px;
    margin-top: 15px;
    background-color: #faf7f8;
    padding: 18px 10px;
    color: #303033;
    .rule-title {
      font-size: 14px;
      font-size: 500;
      margin-top: 8px;
    }
    .rule-content {
      font-size: 12px;
      line-height: 24px;
    }
  }
}
</style>


