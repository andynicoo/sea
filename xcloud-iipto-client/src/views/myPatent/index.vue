<template>
  <div class="mainContent">
    <div class="my-card ">
      <div class="title">
        <img src="@/assets/images/setting/settingIcon.svg" alt="" v-if="PROCESS_ENV.NODE_PLA==='kby'"/>
        <img src="@/assets/images/setting/settingIconwg.svg" alt="" v-if="PROCESS_ENV.NODE_PLA==='wg'" />
        <span class="title">我的专利</span>
        <!-- <span class="line"></span> -->
        <!-- <span class="status" :class="pageInfo.cureentNodeCode === item.cureentNodeCode ? 'active':''" v-for="(item,index) in statusList" :key="index" @click="handleStatusChange(item.cureentNodeCode)">{{item.text}}</span> -->
      </div>
      <div class="no-data" v-if="tableData.length===0">
        <img class="bg" src="@/assets/images/common/no-data.png" alt />
        <p>您还没有申请专利</p>
      </div>
      <div class="table" v-else>
         <table width="100%" cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <th width="240">专利</th>
              <th width="230">服务名称</th>
              <th width="100">国家</th>
              <th width="180">服务进度</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td class="order">
                <span>订单号：{{item.orderNo}}</span>
                <span>服务编号：{{item.serviceNo}}</span>
                <span>申请日期：{{item.createTime}}</span>
              </td>
              <td>{{item.serviceName}}</td>
              <td>美国</td>
              <td class="progress">{{ processMap[item.cureentNodeCode]}}</td>
              <td class="operate" align="center">
                <span v-if="item.cureentNodeCode ==='NODE0074'" @click="toFillInformation(item)"><img src="@/assets/images/common/edit.svg">填写资料</span>
                <span v-if="item.cureentNodeCode !=='NODE0074' && item.progressBar !== 2" @click="toDeital(item)">详情</span>
                <span v-if="item.progressBar === 2 && item.rejectReason" @click="reason = item.rejectReason; visible = true">驳回原因</span>
                <template v-if="item.productFunctionCode === 100 && item.flagCustomerData" >
                  <a
                    style="margin-top:8px;color: #00a3ff;"
                    @click="handleSendData({...item, trademarkType: 3, serviceId: item.id})"
                    v-if="(item.cureentNodeCode === 'NODE0076')"
                    ><a-icon type="file" /> 下载资料</a
                  >
                  <a
                    style="margin-top:8px;color: #00a3ff;"
                    @click="handleSendData({...item, trademarkType: 4, serviceId: item.id})"
                    v-if="(item.cureentNodeCode === 'NODE0077' && item.designPatentOaWorkOrder && item.designPatentOaWorkOrder.cureentNodeCode === 'NODE104-006')"
                    ><a-icon type="file" /> 下载资料</a
                  >
                </template>
              </td>
            </tr>
          </tbody>
         </table>
         <div class="pagination">
           <Page :current="pageInfo.page" :total="pageInfo.total" @on-change="handlePageChange" :page-size="pageInfo.limit" />
         </div>
      </div>
    </div>
    <Modal
      v-model="visible"
      width="400"
      title="驳回原因">
      <div class="reason">
        {{ reason }}
      </div>
      <div slot="footer">
        <Button type="primary" @click="visible = false">我知道了</Button>
      </div>
    </Modal>

    <!-- 发送资料公共弹窗 -->
    <SendDataDialog 
      :item="currentItem"
      :visible="sendDialogVisible" 
      @cancel="sendDialogVisible = false; "
      @fetch="getList()"
    />
  </div>
</template>

<script>
import '@/assets/style/common.less'
import SendDataDialog  from '../../../xcloud-client-components-web/module/components/sendDataDialog'
import { getPatentList } from '@/api/myPatent'
import Cookies from 'js-cookie';

export default {
  components: {
    SendDataDialog
  },
  data () {
    return {
      statusList: [
        {
          cureentNodeCode: '-1',
          text: '全部'
        },
        {
          cureentNodeCode: 'NODE0074',
          text: '待处理'
        }
      ],
      processMap: {
        'NODE0074': '待提交资料',
        'NODE0075': '初步审核',
        'NODE0076': '律师审核',
        'NODE0077': '审核期',
        'NODE0078': '注册成功',
        'NODE0079': '建模中',
        'NODE0080': '审核建模',
        'NODE0081': '客户确认建模',
        'NODE0082': '绘图中',
        'NODE0083': '审核绘图',
        'NODE0084': '客户确认绘图',
        'NODE0085': '已完成'
      },
      tableData: [],
      pageInfo: {
        page: 1,
        total: 0,
        limit: 10,
        cureentNodeCode: '-1'
      },
      visible: false,
      reason: '',
      currentItem: {},
      sendDialogVisible: false
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // 专利列表
    getList (params) {
      let data = { ...this.pageInfo }
      if (this.pageInfo.cureentNodeCode === '-1') {
        delete data.cureentNodeCode
      }
      getPatentList({
        ...data,
        ...params
      })
        .then((res) => {
          if (res.code === 0) {
            this.tableData = res.data.records
            this.pageInfo.page = Number(res.data.current)
            this.pageInfo.total = Number(res.data.total)
          }
        })
    },
    // 列表状态
    handleStatusChange (code) {
      this.pageInfo.cureentNodeCode = code
      this.getList()
    },
    // 改变分页
    handlePageChange (page) {
      this.pageInfo.page = page
      this.getList()
    },
    // 详情
    toDeital (item) {
      this.$router.push({
        path: `/myPatent/detail/${item.id}`
      })
    },
    // 添加资料
    toFillInformation (item) {
      this.$router.push({
        path: `/myPatent/fillInfomation/${item.id}`,
        query: {
          countryNameZh:item.countryNameZh,
        },
      })
    },
    goHome() {
      console.log(this.PROCESS_ENV.NODE_PLA)
      if(this.PROCESS_ENV.NODE_PLA==='kby'){
        let url = "";
        // if (this.invitedCode != null) {
        //   url = this.wgUrl + "productservice" + "?invitedCode=" + this.invitedCode;
        // } else if (this.promteCode != null) {
        //   url = this.wgUrl + "productservice" + "?promteCode=" + this.promteCode;
        // } else {
        //   url = this.wgUrl + "productservice";
        // }
        let crossSessionId= Cookies.get('sessionId');
        url = this.wgUrl + 'login?crossSessionId=' + crossSessionId;
        window.open(url);
      }else if(this.PROCESS_ENV.NODE_PLA==='wg') {
        console.log(this.PROCESS_ENV.NODE_ENV)
      }
    },
     // 发送弹窗
     handleSendData(item) {
      this.sendDialogVisible = true
      this.currentItem = item
    }
  }
}
</script>
<style lang="less" scoped>
  .mainContent {
    display: inline-block;
    width: 946px;
    vertical-align: top;
    box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
    .my-card {
      .title {
        padding-bottom: 22px;
        border-bottom: 1px solid #ebebeb;
        img {
          vertical-align: middle;
        }
        span.title {
          font-family: PingFangSC-Medium, PingFang SC;
          font-size: 20px;
          font-weight: 500;
          border: none;
        }
        span.line {
          width: 2px;
          height: 30px;
          background: #333333;
          opacity: 0.1;
          display: inline-block;
          margin: 0 16px;
          vertical-align: top;
        }
        span.status {
          display: inline-block;
          padding: 0 30px;
          font-size: 14px;
          text-align: center;
          background: #f1f1f1;
          border-radius: 16px;
          margin-right: 10px;
          cursor: pointer;
          height: 32px;
          line-height: 32px;
          color: #666;
        }
        span.status.active {
          background-color: #00a3ff;
          color: #fff;
        }
      }
      .no-data {
        margin: 56px auto;
        text-align: center;
        p {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          margin-top: 10px;
        }
      }
      .table{
        margin-top: 20px;
        th{
          background-color: #d5f0ff;
          line-height: 48px;
          font-size: 14px;
          text-align: center;
        }
        td{
          padding: 15px 10px;
          text-align: center;
          font-size: 14px;
          border-bottom: solid 1px rgba(153, 153, 153, 0.2);
        }
        td.order{
          display: flex;
          flex-direction: column;
          font-size: 12px;
          text-align: left;
          line-height: 30px;
        }
        td.progress{
          color: #f60;
        }
        td.operate{
          text-align: center;
          span{
            cursor: pointer;
            color: #00A3FF;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
              margin-right: 5px;
            }
          }
        }
      }
      .pagination{
        margin-top: 20px;
        text-align: center;
      }
    }
  }
  .reason{
    padding:10px 0 30px;
    word-break: break-all;
  }

  .no-data {
      margin: 56px auto;
      text-align: center;
      p {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        margin-top: 10px;
      }
      button {
        width: 126px;
        height: 32px;
        background: #00a3ff;
        margin-top: 12px;
        border: none;
        color: #fff;
        cursor: pointer;
      }
    }
</style>
