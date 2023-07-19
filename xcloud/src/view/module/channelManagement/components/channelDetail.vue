<template>
  <div class="chanelDetail">
    <div @click="back"
         class="back">
      返回
    </div>
    <div style="float:right;cursor:pointer;font-weight:bold;"
         @click="editInfo = true">
      【编辑渠道信息】
    </div>
    <Divider></Divider>
    <div class="basicInfoBox">
      <Row class="rowItem">
        <Col span="4"
             class="right">渠道名称：</Col>
        <Col span="8">{{chanelDetail.channelName || '暂无'}}</Col>
        <Col span="4"
             class="right">渠道登录账号：</Col>
        <Col span="8">{{chanelDetail.adminUserName || '暂无'}}</Col>
      </Row>
      <Row class="rowItem">
        <Col span="4"
             class="right">联系人：</Col>
        <Col span="8">{{chanelDetail.adminUserNickName || '暂无'}}</Col>
        <Col span="4"
             class="right">联系电话：</Col>
        <Col span="8">{{chanelDetail.adminUserMobile || '暂无'}}</Col>
      </Row>
      <Row class="rowItem">
        <Col span="4"
             class="right">联系地址：</Col>
        <Col span="8">{{chanelDetail.address || '暂无'}}</Col>
        <Col span="4"
             class="right">渠道经理：</Col>
        <Col span="8">{{chanelDetail.channelManager || '暂无'}}</Col>
      </Row>
    </div>
    <Divider></Divider>
    <div class="box">
      <div class="ruleBox">
        <Row v-for="(item, index) in chanelDetail.listChannelClearing"
             :key="index">
          <Col :span="2">
          <div class="countryNameEn">
            国家：<span style="font-weight:bold">{{item.countryNameEn}}</span>
          </div>
          </Col>
          <Col :span="7">
          <div class="inline">
            <div class="line-width">
              返佣方式:
            </div>
            <Select style="width:200px;"
                    :value="item.rebateMethod ? item.rebateMethod.toString(): ''"
                    disabled>
              <Option value="1">按比例返佣</Option>
              <Option value="2">按金额返佣</Option>
            </Select>
          </div>
          </Col>
          <Col :span="7">
          <div class="inline">
            <div class="line-width">
              返佣金额:
            </div>
            <Input style="margin-right:10px;width:200px;"
                   :value="item.rebateValue"
                   disabled
                   placeholder="返佣金额"></Input>
            <span v-if="item.rebateMethod == '1'">
              %
            </span>
            <span v-else>
              元
            </span>
          </div>
          </Col>
        </Row>
      </div>
    </div>
    <Divider></Divider>
    <div class="promote">
      <div class="header">
        <div class="fontW">
          推广情况
        </div>
        <div>
          <DatePicker type="daterange"
                      @on-change="promotion"
                      placement="bottom-end"
                      placeholder="Select date"
                      style="width: 200px;margin-right:20px;"></DatePicker>
          <Button type="primary"
                  @click="promotionSearch">查询</Button>
        </div>
      </div>
      <div class="content">
        <div class="item">
          <span class="num">{{promotionInfo.sumPvCount}}</span>
          <span class="type">浏览次数</span>
        </div>
        <div class="item">
          <span class="num">{{promotionInfo.sumUvCount}}</span>
          <span class="type">浏览用户数</span>
        </div>
        <div class="item"
             @click="usersModal('注册用户数', '注册时间', 1)">
          <span class="num">{{promotionInfo.sumRegisterCount}}</span>
          <span class="type">注册用户数</span>
        </div>
        <div class="item"
             @click="usersModal('成交用户数', '付款时间', 2)">
          <span class="num">{{promotionInfo.sumPaidCount}}</span>
          <span class="type">成交用户数</span>
        </div>
        <div class="item">
          <span class="num">{{promotionInfo.sumPayMoney}}</span>
          <span class="type">成交金额</span>
        </div>
      </div>
    </div>
    <div class="list-content">
      <formComponents @getList="getPromotionList"
                      :tableData="promotionTableData"
                      v-if="JSON.stringify(promotionData) !== '{}'"
                      :columns="promoteColumns"
                      :pageInfo="{
                        page: promotionPageInfo.page,
                        limit: promotionPageInfo.limit
                      }"
                      @on-selection-change="selection"
                      :listTotal="Number(promotionData.pageOrderClearingVo.total)">
        <div slot="title">
          推广服务数：{{promotionInfo.sumServiceCount}} 个 佣金总额：{{promotionInfo.sumBackMoney}} 元
        </div>
        <div slot="titleRight"
             class="right">
          <Button style="margin-right:10px;">导出excel</Button>
          <Button type="primary"
                  @click="apply">申请结算</Button>
        </div>
      </formComponents>
    </div>
    <div class="settlementList">
      <formComponents @getList="getSettlementList"
                      :tableData="settlementList"
                      :columns="settleColumns"
                      :isShowPage="false">
        <div slot="title">
          <div class="fontW">
            结算记录
          </div>
        </div>
      </formComponents>
    </div>
    <!-- 注册用户数和成交用户数 -->
    <Modal :title="titleName"
           width="800"
           v-model="usersModalStatus"
           @on-visible-change="usersModalStatusChange"
           @ok="usersModalStatus = false">
      <formComponents :tableData="userSearchForm.tableData"
                      :columns="userColumns"
                      @getList="getUserSearchList"
                      :pageInfo="{
                        pageIndex: Number(userSearchForm.pageIndex),
                        pageSize: Number(userSearchForm.pageSize),
                      }"
                      :listTotal="Number(userSearchData.total)">
        <div slot="title">
          <Form ref="userSearchForm"
                :model="userSearchForm"
                inline>
            <FormItem :label="timeType"
                      :label-width="60">
              <DatePicker type="date"
                          @on-change="startDate"
                          placeholder="开始日期"
                          style="width: 200px"></DatePicker>
              <span style="padding:0px 10px;">
                至
              </span>
              <DatePicker type="date"
                          @on-change="endDate"
                          placeholder="结束日期"
                          style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem>
              <Button type="primary"
                      style="margin-right:5px;"
                      @click="userSearchBtn()">查询</Button>
            </FormItem>
          </Form>
        </div>
        <div slot="footer"
             v-if="titleName === '注册用户数'">
          累计注册用户数：{{userSearchData.total}}
        </div>
      </formComponents>
      <div slot="footer"></div>
    </Modal>
    <!-- 申请结算 -->
    <Modal v-model="applyModal"
           title="申请结算"
           ok-text="提交申请"
           class-name="applyModal"
           @on-ok="applyComfirm">
      <p class="title">渠道信息 </p>
      <div class="content">
        <div>
          渠道名称：{{chanelDetail.channelName}}
        </div>
        <div>
          渠道账号：{{chanelDetail.adminUserName}}
        </div>
        <div>
          联系人：{{chanelDetail.adminUserNickName}}
        </div>
        <div>
          联系电话：{{chanelDetail.adminUserMobile}}
        </div>
      </div>
      <div class="footer">
        申请结算佣金：{{backMoney}} 元
      </div>
    </Modal>
    <!-- 修改渠道资料 -->
    <Modal v-model="editInfo"
           class="channelModal"
           title="修改渠道资料"
           ok-text="保存"
           width="850"
           class-name="editModal">
      <baseChannel v-if="editInfo"
                   @refreshDetail="refreshDetail"
                   :operateType="'edit'"
                   :chanelDetail="chanelDetail"></baseChannel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import formComponents from "./formComponents";
import base_channel_addEdit from "./base_channel_addEdit"
import { baseinfo } from "@/api/taxService/order"
import { channelDetail, statistics, channelPayListApi, channelUserListApi, clearing, channelClearingList } from "@/api/taxService/channel";
export default {
  props: ['channelId'],
  data() {
    return {
      userSearchForm: {                 // 注册用户数和付费用户数
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 10,
        promteCode: '',
        tableData: [],
      },
      userSearchData: {},
      promotionTime: {                  // 推广时间
        beginTime: '',
        endTime: '',
        id: this.channelId,
        page: 1,
        limit: 10
      },
      promotionInfo: {                  // 推广情况
        sumPvCount: 0,
        sumUvCount: 0,
        sumRegisterCount: 0,
        sumPaidCount: 0,
        sumSettlementOrderMoney: 0,
        sumServiceCount: 0,
        sumBackMoney: 0
      },
      promotionPageInfo: {
        page: 1,
        limit: 10
      },
      promotionTableData: [],           // 推广情况表单 
      promotionData: {},
      ids: [],                          // 申请结算id列表 
      backMoney: 0,                     // 返佣金额
      timeType: '注册时间',
      tableLoading: false,
      applyModal: false,
      editInfo: false,
      usersModalStatus: false,
      titleName: '注册用户数',
      allSumAmountMoney: '',            // 支付用户订单总实付金额
      settlementList: [],               // 结算记录
      tableData: [],
      listTotal: 0,
      SettlementTableData: [],
      promoteColumns: [                 //推广列表表头
        {
          type: 'selection',
          width: 60,
          align: 'center',
        },
        {
          title: '订单号',
          key: 'orderNo',
          minWidth: 70,
        },
        {
          title: '服务号',
          key: 'serverNo',
          minWidth: 70,
        },
        {
          title: '用户账号',
          key: 'userMobile',
          minWidth: 70,
        },
        {
          title: 'VAT服务名称',
          key: 'productName',
          minWidth: 50,
        },
        {
          title: '国家',
          key: 'countryNameZh',
          minWidth: 50,
        },
        {
          title: '服务金额',
          key: 'price',
          minWidth: 50,
        },
        {
          title: '实付金额',
          key: 'amountMoney',
          minWidth: 50,
        },
        {
          title: '付款时间',
          key: 'paymentTime',
          minWidth: 80,
        },
        {
          title: '返佣方式',
          key: 'rebateMethod',
          minWidth: 50,
          render(h, params) {
            return h('span', params.row.rebateMethod == 1 ? '按比例返佣' : params.row.rebateMethod == 2 ? '按金额返佣' : '无需返佣')
          },
        },
        {
          title: '返佣值',
          key: 'rebateValue',
          minWidth: 50,
          render(h, params) {
            return h('span', params.row.rebateMethod == 1 ? params.row.rebateValue + '%' : params.row.rebateMethod == 2 ? params.row.rebateValue + '元' : '无需返佣')
          },
        },
        {
          title: '佣金',
          key: 'backMoney',
          minWidth: 50,
        },
        {
          title: '服务状态',
          key: 'progressBar',
          minWidth: 80,
          render(h, params) {
            return h('span', params.row.progressBar == 0 ? '上传资料' : params.row.progressBar == 1 ? '待审核资料' : params.row.progressBar == 3 ? '注册中' : params.row.progressBar == 4 ? '注册完成' : params.row.progressBar == 5 ? '待授权海牙认证' : params.row.progressBar == 6 ? '海牙认证中' : params.row.progressBar == 7 ? '待授权注册税号' : params.row.progressBar == 8 ? '资料驳回 ' : params.row.progressBar == 18 ? '申报中' : params.row.progressBar == 19 ? '未开始' : params.row.progressBar == 20 ? '未开始(已开始报税)' : params.row.progressBar == 21 ? '待提交申报资料 ' : params.row.progressBar == 22 ? '待缴纳税金' : params.row.progressBar == 25 ? '申报完成' : params.row.progressBar == 26 ? '申报失败' : params.row.progressBar == 27 ? '申报完成' : params.row.progressBar == 28 ? '待上传资料(转代理)' : params.row.progressBar == 29 ? '转代理中' : params.row.progressBar == 31 ? '待审核转代理资料' : params.row.progressBar == 32 ? '转代理资料驳回' : params.row.progressBar == 33 ? '缴税凭证待审核' : params.row.progressBar == 34 ? '缴税凭证被驳回' : params.row.progressBar == 35 ? '待上传零申报凭证' : params.row.progressBar == 36 ? '待授权海牙认证' : params.row.progressBar == 37 ? '待授权海牙认证中' : params.row.progressBar == 38 ? '待授权转代理' : params.row.progressBar == 51 ? '税号注销待上传资料' : params.row.progressBar == 52 ? '税号注销待审核' : params.row.progressBar == 53 ? '税号注销注销中' : params.row.progressBar == 54 ? '税号注销已完成' : params.row.progressBar == 55 ? '资料驳回' : params.row.progressBar == 56 ? '注销失败' : params.row.progressBar)
          },
        },
        {
          title: '是否结算',
          key: 'isRebate',
          minWidth: 50,
          render(h, params) {
            return h('span', params.row.isRebate == 1 ? '否' : params.row.isRebate == 2 ? '是' : params.row.isRebate == 3 ? '待结算' : '无需结算')
          },
        }
      ],
      settleColumns: [
        {
          title: '结算金额',
          key: 'clearingMoney',
          minWidth: 50,
        },
        {
          title: '状态',
          key: 'status',
          minWidth: 50,
          render(h, params) {
            return h('span', params.row.status == 1 ? '待审核' : params.row.status == 2 ? '结算中' : params.row.status == 3 ? '已结算' : params.row.status == 4 ? '审核不通过' : '')
          }
        }, {
          title: '申请结算时间',
          key: 'applyTime',
          minWidth: 50,
        }, {
          title: '实际结算时间',
          key: 'clearingTime',
          minWidth: 50,
        }
      ],
      userColumns: [],
      userData: [],
      chanelDetail: {},
      countryCodeList: []
    }
  },
  components: {
    formComponents,
    baseChannel: base_channel_addEdit
  },
  async created() {
    await this.getBaseInfo()
    await this.getDetail()
    this.promotionSearch()
    this.getchannelList()
  },
  methods: {
    back() {
      this.$emit('back')
    },
    refreshDetail() {
      this.editInfo = false
      this.getDetail()
    },
    getBaseInfo() {
      let that = this
      baseinfo().then(res => {
        if (res.code === 0) {
          this.countryCodeList = res.data.map(ele => {
            return {
              countryCode: ele.countryCode,
              countryNameEn: ele.countryNameEn,
              countryNameZh: ele.countryNameZh
            }
          })
        }
      })
    },
    getDetail() {
      channelDetail({
        id: this.channelId
      }).then(res => {
        if (res.code === 0) {
          this.chanelDetail = res.data
          // this.chanelDetail.listChannelClearing.splice(0, 1)
          if (this.countryCodeList.length > this.chanelDetail.listChannelClearing.length) {
            let lackArr = this.getDifferenceSetB(this.countryCodeList, this.chanelDetail.listChannelClearing, 'countryCode')
            this.chanelDetail.listChannelClearing = [...this.chanelDetail.listChannelClearing, ...lackArr]
          } else {
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 两个数组取差集
    getDifferenceSetB(arr1, arr2, typeName) {
      return Object.values(arr1.concat(arr2).reduce((acc, cur) => {
        if (acc[cur[typeName]] && acc[cur[typeName]][typeName] === cur[typeName]) {
          delete acc[cur[typeName]];
        } else {
          acc[cur[typeName]] = cur;
        }
        return acc;
      }, {}));
    },
    // 推广情况 时间选择
    promotion(val) {
      this.promotionTime.beginTime = val[0]
      this.promotionTime.endTime = val[1]
    },
    // 推广情况 查询
    promotionSearch() {
      statistics(this.promotionTime).then(res => {
        if (res.code === 0) {
          this.promotionData = res.data
          this.promotionInfo.sumPvCount = res.data.channelListStatisticsVo.sumPvCount
          this.promotionInfo.sumUvCount = res.data.channelListStatisticsVo.sumUvCount
          this.promotionInfo.sumRegisterCount = res.data.channelListStatisticsVo.sumRegisterCount
          this.promotionInfo.sumPaidCount = res.data.channelListStatisticsVo.sumPaidCount
          this.promotionInfo.sumSettlementOrderMoney = res.data.channelListStatisticsVo.sumSettlementOrderMoney
          this.userSearchForm.promteCode = res.data.channelListStatisticsVo.promteCode
          this.promotionInfo.sumServiceCount = res.data.channelListStatisticsVo.sumServiceCount
          this.promotionInfo.sumBackMoney = res.data.channelListStatisticsVo.sumBackMoney
          this.promotionInfo.sumPayMoney = res.data.channelListStatisticsVo.sumPayMoney
          if (res.data.pageOrderClearingVo.records.length > 0) {
            res.data.pageOrderClearingVo.records.forEach(element => {
              if (element.isRebate === 2 || element.isRebate === 0 || element.isRebate === 3) {
                element._disabled = true
              }
            })
          }
          this.promotionTableData = res.data.pageOrderClearingVo.records || []
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 推广情况 用户弹窗 状态变化时触发
    usersModalStatusChange(val) {
      if (val === false) {
        this.userSearchForm.beginTime = ''
        this.userSearchForm.endTime = ''
        this.userSearchForm.pageIndex = 1
        this.userSearchForm.tableData = []
      }
    },
    // 推广列表分页请求
    getPromotionList(pageInfo) {
      this.promotionTime.page = pageInfo.page
      this.promotionSearch()
    },
    // 推广情况 用户弹窗
    usersModal(titleName, time, type) {
      this.titleName = titleName
      this.timeType = time
      this.userSearchBtn()
    },
    //注册用户数
    getRegUserList() {
      channelUserListApi({
        pageIndex: this.userSearchForm.pageIndex,
        pageSize: this.userSearchForm.pageSize,
        promteCode: this.userSearchForm.promteCode,
        beginTime: this.userSearchForm.beginTime,
        endTime: this.userSearchForm.endTime,
      }).then(res => {
        if (res.code === 0) {
          this.usersModalStatus = true
          this.userColumns = [
            {
              title: '序号',
              type: 'index',
              width: 80
            },
            {
              title: '用户账号',
              key: 'userMobile',
            }, {
              title: '用户昵称',
              key: 'userNickname',
              render(h, params) {
                return h('span', params.row.userNickname !== '' ? params.row.userNickname : params.row.userMobile)
              },
            },
            {
              title: '注册时间',
              key: 'createTime',
            },
          ]
          this.userSearchData = res.data
          this.userSearchForm.tableData = res.data.records || []
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //付费用户数
    getPayUserList() {
      channelPayListApi({
        pageIndex: this.userSearchForm.pageIndex,
        pageSize: this.userSearchForm.pageSize,
        promteCode: this.userSearchForm.promteCode,
        beginTime: this.userSearchForm.beginTime,
        endTime: this.userSearchForm.endTime,
      }).then(res => {
        if (res.code === 0) {
          this.usersModalStatus = true
          this.userColumns = [
            {
              title: '用户账号',
              key: 'userMobile',
            }, {
              title: '用户昵称',
              key: 'userNickname',
              render(h, params) {
                return h('span', params.row.userNickname !== '' ? params.row.userNickname : params.row.userMobile)
              },
            },
            {
              title: '累计成交金额',
              key: 'sumAmountMoney',
            },
          ]
          this.allSumAmountMoney = res.data.allSumAmountMoney
          this.userSearchData = res.data.channelPayUser
          this.userSearchForm.tableData = res.data.channelPayUser.records || []
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 注册用户数和付费用户数 开始时间
    startDate(val) {
      this.userSearchForm.beginTime = val
    },
    // 注册用户数和付费用户数 结束时间
    endDate(val) {
      this.userSearchForm.endTime = val
    },
    // 注册用户数和付费用户数 查询按钮
    userSearchBtn() {
      if (this.titleName === '注册用户数') {
        this.getRegUserList()
      } else {
        this.getPayUserList()
      }
    },
    // 注册用户数和付费用户数 分页
    getUserSearchList(pageInfo) {
      this.userSearchForm.pageIndex = pageInfo.page
      this.userSearchBtn()
    },
    // 结算分页 请求
    getSettlementList(pageInfo) {

    },
    //获取结算列表
    getchannelList() {
      this.tableLoading = true;
      channelClearingList({
        limit: 100,
        page: 1,
        status: -1,
        searchContent: '',
        beginTime: '',
        endTime: '',
        channelId: this.channelId
      }).then((res) => {
        if (res.code == 0) {
          this.settlementList = res.data.records
        }
      })
        .catch((err) => console.log(err))
    },
    //多选
    selection(val) {
      this.ids = []
      this.backMoney = 0
      val.forEach(ele => {
        this.ids.push(ele.id)
        this.backMoney += ele.backMoney
      })
      this.backMoney = Math.floor(this.backMoney * 100) / 100
    },
    // 申请结算弹窗
    apply() {
      if (this.ids.length > 0) {
        this.applyModal = true
      }
    },
    // 申请结算
    applyComfirm() {
      clearing({
        channelId: this.channelId,
        ids: this.ids
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.$Message.success('申请结算成功')
          this.applyModal = false
          this.getDetail()
          this.promotionSearch()
          this.getchannelList()
        }
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>

<style lang="less" scoped>
.chanelDetail {
  min-height: 100vh;
  padding: 10px;
  .back {
    cursor: pointer;
    display: inline-block;
  }
  .basicInfoBox {
    padding-left: 30px;
    .rowItem {
      margin-bottom: 10px;
      font-size: 12px;
    }
  }
}
.box {
  .ruleBox {
    padding-left: 20px;
  }
  padding: 10px 0px;
  .countryNameEn {
    height: 30px;
    display: flex;
    align-items: center;
  }
  .content {
    font-weight: bold;
    margin-bottom: 20px;
  }
  /deep/ .ivu-row {
    margin-bottom: 20px;
  }
  .inline {
    display: flex;
    align-items: center;
    .line-width {
      width: 70px;
      // margin-left: 20px;
    }
  }
}
.promote {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20px 0;
    background: #f2f2f2;
    margin: 20px 0px;
    .item {
      width: 20%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      .num {
        font-weight: bold;
        font-size: 20px;
      }
    }
  }
}
.list-content {
  margin: 50px 0px;
  .right {
  }
}
.applyModal {
  .title {
    margin-bottom: 10px;
    font-weight: bold;
  }
  .content {
    padding: 10px;
    background: #f2f2f2;
    div {
      margin: 5px 0px;
    }
  }
  .footer {
    font-weight: bold;
    margin-top: 10px;
  }
}
.fontW {
  font-weight: bold;
}
.channelModal {
  /deep/ .ivu-modal-footer {
    border-top: none;
    padding: 0px;
  }
}
</style>