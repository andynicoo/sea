<template>
  <div class="container">
    <div class="headContent">
      <div class="bottom">消息&公告</div>
      <div class="tabTitle">
        <span :class="{ 'active-tab': activeTab == 1 }" @click="changeActive(1)">消息</span>
        <span :class="{ 'active-tab': activeTab == 2 }" @click="changeActive(2)">公告</span>
      </div>
    </div>
    <div class="mainPage">
      <Form ref="searchForm" :model="searchForm" inline>
        <FormItem label="标题：" style="width: 300px; padding-left: 20px">
          <Input v-model="searchForm.title" clearable placeholder="请输入标题名称" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Button icon="md-search" @click="searchList" style="margin-left: 20px; background: #18bdff; color: #fff">
            搜索
          </Button>
        </FormItem>
      </Form>
      <div class="tableArea">
        <Table :loading="tableLoading" :columns="columns" :data="tableData">
          <template slot="isRead" slot-scope="{ row }">
            <span :class="{ unread: row.isRead == '1' }">
              {{ row.isRead == '1' ? '未读' : row.isRead == '2' ? '已读' : '' }}
            </span>
          </template>
          <template slot="advice" slot-scope="{ row }">
            <span class="cursor" @click="toView(row)">【查看】</span>
          </template>
          <template slot="operate" slot-scope="{ row }">
            <!-- <span class="cursor" @click="toDetail(row.id)">查看详情</span> -->
            <div class="detail" @click="toDetail(row.id, row.isRead, row.msgType)">
              <img src="@/assets/images/common/xiangqing.png" alt="" />
              <div class="operateTitle">查看详情</div>
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
          style="margin-top: 20px; text-align: right"
        />
      </div>
    </div>
    <!-- <lettersDetail v-if="isDetailShow" :rowInfo="rowInfo" @back="backFun"></lettersDetail> -->
    <!-- 消息详情 -->
    <Modal
      v-model="isDetailShow"
      width="500"
      @on-cancel="
        isDetailShow = false;
        content = '';
        file = '';
      "
      :closable="false"
      :mask-closable="false"
    >
      <p slot="header" class="modalHeader">
        <span class="headerLine"></span>
        <span>消息详情</span>
      </p>
      <div class="content" style="padding-bottom: 15px; word-wrap: break-word; max-height: 600px; overflow: auto">
        <div v-html="content"></div>
        <template v-if="file && file != '无'">
          <p v-for="(v, i) in file.split(',')" :key="i">
            <a class="link" :href="v.slice(0, 5) == 'http:' ? v.slice(0, 4) + 's' + v.slice(4) : v" target="_blank">
              点击查看>
            </a>
          </p>
        </template>
      </div>
      <div slot="footer">
        <Button v-if="currMsgType === 'RENEWAL'" class="renew-immediately" @click="$router.push(`/renewal`)"
          >立即续费</Button
        >
        <Button
          style="margin-top: 30px"
          :disabled="isClose"
          type="info"
          @click="
            isDetailShow = false;
            content = '';
            file = '';
            getLetterList();
          "
        >
          {{ countdownText }}
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import lettersDetail from '@/views/common/stationLetterDetail';
import { stationLetterList, stationLetterDetail } from '@/api/stationLetter/stationLetter.js';
import { Base64 } from 'js-base64';
export default {
  name: 'orderList',
  data() {
    return {
      activeTab: 1,
      timer: null,
      timing: 5,
      countdownText: '关闭',
      isClose: false,
      isShow: true,
      isDetailShow: false,
      searchForm: {
        title: '',
        type: 1,
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
          width: 70,
          align: 'center',
        },
        {
          title: '标题',
          key: 'title',
          minWidth: 200,
          align: 'center',
        },
        {
          title: '消息类型',
          key: 'title',
          align: 'center',
          render(h, params) {
            let type = '系统消息';
            if (params.row.msgType == 'ORDER') {
              type = '订单提醒';
            } else if (params.row.msgType == 'RENEWAL') {
              type = '续费提醒';
            } else if (params.row.msgType == 'SERVICE') {
              type = '服务提醒';
            }
            return h('span', type);
          },
        },
        {
          title: '服务类型',
          key: 'functionCodeName',
          align: 'center',
        },
        {
          title: '是否已读',
          slot: 'isRead',
          align: 'center',
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
        },
        {
          title: '操作',
          slot: 'operate',
          align: 'center',
        },
      ],
      tableData: [],
      content: '',
      file: '',
      currMsgType: '',
    };
  },
  components: {
    lettersDetail,
  },
  mounted() {
    this.getLetterList();
    // this.baseInfo()
  },
  methods: {
    // tab切换
    changeActive(type) {
      this.activeTab = type;
      this.searchForm.type = type;
      this.pageInfo.page = 1;
      this.getLetterList();
    },
    baseInfo() {
      API.baseInfo()
        .then((res) => {
          if (res.code === 0) {
            this.countryList = res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //获取列表
    getLetterList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      stationLetterList(params)
        .then((res) => {
          if (res.code == 0) {
            this.listTotal = Number(res.data.total);
            this.tableData = res.data.records;
            this.$parent.$children[0].getStationLetter();
            this.tableLoading = false;
          } else {
            this.$Message.warning(res.message);
            this.tableLoading = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.tableLoading = false;
        });
    },
    //搜索列表
    searchList() {
      this.pageInfo.page = 1;
      this.getLetterList();
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.getLetterList();
    },
    //查看详情
    toDetail(row, isRead, msgType) {
      this.isDetailShow = true;
      this.rowInfo = row;
      this.currMsgType = msgType;
      stationLetterDetail(row).then((res) => {
        if (res.code === 0) {
          this.content = Base64.decode(res.data.content);
          this.fileNames = res.data.fileNames;
          this.file = res.data.files;
          if (isRead == 1) {
            let textLength = this.content.length;
            if (textLength < 200) {
              this.timing = 3;
            } else if (textLength < 500) {
              this.timing = 5;
            } else if (textLength > 500) {
              this.timing = 8;
            }
            this.resetTime(this.timing);
          }
        }
      });
    },
    resetTime() {
      this.setcountdownText();
      this.timer = setInterval(this.setcountdownText, 1000);
    },
    setcountdownText() {
      if (this.timing > 0) {
        this.isClose = true;
        this.timing--;
        this.countdownText = this.timing + 1 + 's后可关闭';
      } else {
        this.isClose = false;
        this.countdownText = '关闭';
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    // 新建
    addLetters() {
      this.isDetailShow = true;
    },
    refreshList() {
      this.isDetailShow = false;
    },
    backFun() {
      this.isDetailShow = false;
      this.getLetterList();
    },
    toView(row) {
      this.$Modal.info({
        title: '处理建议:',
        content: row.advise,
      });
    },
    sendLetter(row) {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>是否发信给用户</p>',
        onOk: () => {
          API.sendLetter({
            id: row.id,
          }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('发送成功');
              this.getLetterList();
            }
          });
        },
      });
    },
    dealWithLetter(row) {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>是否处理该信件</p>',
        onOk: () => {
          API.dispose({
            id: row.id,
          }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('处理成功');
              this.getLetterList();
            }
          });
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  .headContent {
    width: 100%;
    margin-left: -30px;
    height: 100px;
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 20px 32px 0px;
    .tabTitle {
      margin-top: 10px;
      margin-left: 25px;
      span {
        display: inline-block;
        font-size: 16px;
        font-weight: 500;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #333333;
        line-height: 40px;
        margin-right: 46px;
        cursor: pointer;
      }
      .active-tab {
        color: #1890ffff;
        border-bottom: 2px solid #1890ffff;
        font-weight: 500;
      }
    }
    .back {
      margin-left: 25px;
      margin-bottom: 14px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      cursor: pointer;
    }
    .top {
      margin-bottom: 14px;
    }
    .bottom {
      margin-left: 25px;
      font-size: 20px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 30px;
      }
    }
  }
  .mainPage {
    background: #ffffff;
    padding: 30px;
    margin: 20px 20px -10px 20px;
    // border-radius: 20px;
    & /deep/ .ivu-divider-horizontal {
      margin: 0;
    }
    .tableArea {
      margin-top: 24px;
    }
  }
  .title {
    font-size: 18px;
    font-weight: bold;
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
.detail {
  display: flex;
  justify-content: center;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  cursor: pointer;
}
.unread {
  font-weight: 400;
  color: #ffad36;
}
/deep/ .ivu-table-header thead tr th {
  background: #f6fdff;
  font-size: 12px;
  height: 44px;
  font-family: 'Microsoft Yahei', SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 12px;
  text-align: center;
}
/deep/ .ivu-table-border td {
  text-align: center;
  font-size: 12px;
  height: 44px;
  font-family: 'Microsoft Yahei', SourceHanSansSC-Regular, SourceHanSansSC;
  font-weight: 400;
  color: #666666;
  line-height: 12px;
  text-align: center;
}
.modalHeader {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .headerLine {
    display: inline-block;
    width: 3px;
    height: 17px;
    background: #18bdff;
    border-radius: 2px;
    margin-right: 10px;
  }
}
.renew-immediately {
  margin-top: 30px;
}
</style>
