<template>
  <div class="app-container">

    
    <div class="header-container">
      <el-link type="primary" :underline="false" @click="goBack" style="margin-bottom: 10px;">
        ＜返回列表
      </el-link>

      <div class="tittle">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">订单信息</span>
      </div>
      <div class="salesOrderpayInfo">
        

        <div class="orderInfo ">
          <div class="order">
            <span>
              订单号：
              <span>{{ detailInfo.orderNo }}</span>
              
            </span>
          </div>
          <div class="order">
            <span>
              订单状态：
              <span >
                <span >{{ detailInfo.status | filterOrderStatus }}</span>
              </span>
            </span>
          </div>
        </div>
        <Row class="basic-info first-info">
          <Col span="3">
            商品金额：
          </Col>
          <Col span="3">￥{{detailInfo.productOldMoney | formatQianFenWei}}元</Col>
          <Col span="3">
            开票状态：
          </Col>
          <Col span="3">{{ detailInfo.invoice | filterInvoiceType }}</Col>
          <Col span="3">
            订单归属人：
          </Col>
          <Col span="3" :title="detailInfo.attributionName">{{ detailInfo.attributionName }}</Col>
          <Col span="3">
            订单创建时间：
          </Col>
          <Col span="3">{{ (detailInfo.createTime || "").split(" ")[0] }}</Col>
        
        </Row>

        <Row class="basic-info">
          <Col span="3">
            优惠金额：
          </Col>
          <Col span="3">￥{{ (detailInfo.discAmount > 0 ? detailInfo.discAmount : 0) | formatQianFenWei }}元</Col>
          <Col span="3">
            开票金额：
          </Col>
          <Col span="3">￥{{ detailInfo.invoiceMoney | formatQianFenWei }}元</Col>
          <Col span="3">
            订单来源：
          </Col>
          <Col span="3">{{ detailInfo.orderSource | filterSource }}</Col>
          <Col span="3">
            服务应付金额：
          </Col>
          <Col span="3"> ￥{{ detailInfo.orderMoney | formatQianFenWei }} 元</Col>
        
        </Row>

        <Row class="basic-info">
          <Col span="3">
            含票应付金额：
          </Col>
          <Col span="3">￥{{ detailInfo.includeTaxOrderMoney | formatQianFenWei }} 元</Col>
          <Col span="3">
            订单类型：
          </Col>
          <Col span="3">{{
                  detailInfo.isCustom === 0
                    ? "正常订单"
                    : detailInfo.isCustom == 1
                    ? "续费订单"
                    : detailInfo.isCustom == 2
                    ? "项目制订单"
                    : detailInfo.isCustom == 3
                    ? "溢价订单"
                    : ""
                }}</Col>
          
        <Col span="3">
            实付金额：
          </Col>
          <Col span="3">￥{{ detailInfo.amountMoney | formatQianFenWei }} 元</Col>
          <Col span="3">
            付款类型：
          </Col>
          <Col span="3">{{
                  detailInfo.paymentType === 0
                    ? "正常付款"
                    : detailInfo.paymentType == 1
                    ? "挂账付款"
                    : detailInfo.paymentType == 2
                    ? "分期付款"
                    : ""
          
          }}</Col>

        </Row>

        
      </div>

      <div class="tittle">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">商品信息</span>
      </div>
      <div class="salesOrderpayInfo">

        <el-table border :data="orderProducts" v-loading="tableLoading" :max-height="260" class="table" v-if="orderProducts.length">
         
          <el-table-column align="center" label="商品名称" prop="productProjectName" width="120"></el-table-column>
          <el-table-column align="center" label="国家" prop="countryName"></el-table-column>
          <el-table-column align="center" label="商品金额">
            <template slot-scope="scope">
              {{ scope.row.productOldMoney | formatQianFenWei }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="优惠金额">
            <template slot-scope="scope">
              {{ scope.row.discAmountMoney | formatQianFenWei }}
            </template>
          </el-table-column>
          
          <el-table-column align="center" label="实付金额">
            <template slot-scope="scope">
              {{ scope.row.amountMoney | formatQianFenWei }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="数量" prop="quantity"></el-table-column>
          <el-table-column align="center" label="付款状态" prop="price">
            <template slot-scope="scope">
              {{ scope.row.status | filterOrderRefundStatus }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="服务公司名称" prop="serviceCompanyName" width="150"></el-table-column>
          <el-table-column align="center" label="服务号" prop="serviceNo" width="150"></el-table-column>
          <el-table-column align="center" label="服务状态" prop="serviceStatusName" width="150"></el-table-column>
          <el-table-column align="center" label="服务进度" prop="serviceProgressName" width="150"></el-table-column>
          
        </el-table>

        <div v-else class="empty-box">
          暂无
        </div>
      </div>

      <div class="tittle">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">合同信息</span>
      </div>
      <div class="salesOrderpayInfo">
        
        <el-table border :data="contractList" v-loading="tableLoading" :max-height="260" class="table">
          <el-table-column align="center" label="合同签订公司" prop="contractCompanyName" width="150"></el-table-column>
          
          <el-table-column align="center" label="合同状态" width="200px">
            <template slot-scope="scope">
              <span>{{ scope.row.contractStatus == 0 ? '未签署' :
                       scope.row.contractStatus == 1 ? '签署中':
                       scope.row.contractStatus == 2 ? '已签署':
                       scope.row.contractStatus == 3 ? '特批不签':
                       scope.row.contractStatus == 4 ? '线下签订' : ''}}</span>
            </template>
          </el-table-column>
          
          <el-table-column align="center" label="合同名称" width="200">
            <template slot-scope="scope">
              <el-link style="color:cornflowerblue" 
                :href="scope.row.contractUrl.replace('http://', 'https://')" target="_blank" v-if="scope.row.contractFileName">
                {{ scope.row.contractFileName }}
              </el-link>
              <span class="text-info" v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="合同签署链接" prop="payer">
            <template slot-scope="scope">
              <div v-if="scope.row.contractSignLink">
                <Button label="small" class="cobyOrderSn" data-clipboard-action="copy" 
                :data-clipboard-text="scope.row.contractSignLink" @click="copyLink">复制链接</Button>
              </div>
            </template>
          </el-table-column>
          
        </el-table>
      </div>

      <div class="tittle">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">用户信息</span>
      </div>
      <div class="salesOrderpayInfo">
        
        <el-table border :data="userInfoList" v-loading="tableLoading" :max-height="260" class="table">
          <el-table-column align="center" label="用户账户" prop="userMobile" width="150"></el-table-column>
          <el-table-column align="center" label="合同公司名称" prop="contractCompanyName">
          </el-table-column>
        
          
        </el-table>
      </div>


      <div class="tittle">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">款项信息</span>
      </div>
      <div class="salesOrderpayInfo">
        
        <el-table border :data="orderPayments" v-loading="tableLoading" :max-height="260" class="table" v-if="orderPayments.length">
          <el-table-column align="center" label="编号" width="70">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="付款日期" prop="paymentTime" width="150"></el-table-column>
          <el-table-column align="center" label="支付方式">
            <template slot-scope="scope">
              {{ scope.row.paymentChannel | filterPayment }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="实付金额" width="200px">
            <template slot="header">
              实付金额
              <el-tooltip class="item" effect="dark" :content="`开票金额￥${detailInfo.invoice.makeInvoiceMoney}在发票管理展示`" placement="top-start" v-if="detailInfo.invoice && detailInfo.invoice.id && detailInfo.invoice.status !== 4">
                <i class="el-icon-question text-warning"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span>￥{{ scope.row.amount | formatQianFenWei }}</span>
            </template>
          </el-table-column>
          
          <el-table-column align="center" label="付款凭证" width="200">
            <template slot-scope="scope" v-if="scope.row.paymentFile && scope.row.paymentFile.length">
              <el-image
                v-for="(img, i) in scope.row.paymentFile"
                :key="i"
                style="width: 85px; height:50px"
                :src="img"
                :preview-src-list="scope.row.paymentFile"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column align="center" label="付款方" prop="payer"></el-table-column>
          <el-table-column align="center" label="收款账户" prop="acceptAccountName" width="200"></el-table-column>
          <el-table-column align="center" label="交易流水" prop="tradeNo" width="150"></el-table-column>
          <el-table-column align="center" label="到账时间" prop="gatheringTime" width="150"></el-table-column>
          <el-table-column align="center" label="备注" prop="remark"></el-table-column>
          
        </el-table>

        <div v-else class="empty-box">
          暂无
        </div>
      </div>


      <div class="tittle">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">退款记录</span>
      </div>
      <div class="salesOrderpayInfo">
        
        <el-table border :data="refoundPayments" v-loading="tableLoading" :max-height="260" class="table" v-if="refoundPayments.length">
          
          <el-table-column align="center" label="退款订单号" prop="refundNo" width="150"></el-table-column>
          <el-table-column align="center" label="退款类型">
            <template slot-scope="scope">
              {{ scope.row.refundType == 1 ? '商品' : scope.row.refundType == 2 ? '发票' : '' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="退款商品" width="200px">
            <template slot-scope="scope">
              <span>{{ scope.row.refundProductName }}</span>
            </template>
          </el-table-column>
          
          <el-table-column align="center" label="商品金额" width="200" prop="orderMoney">
            <template slot-scope="scope">
              <span>￥{{ scope.row.orderMoney | formatQianFenWei }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="实付金额" prop="amountMoney">
            <template slot-scope="scope">
              <span>￥{{ scope.row.amountMoney | formatQianFenWei }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="退款手续费" prop="refundPoundage" width="200">
            <template slot-scope="scope">
              <span>￥{{ scope.row.refundPoundage | formatQianFenWei }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="实际退款金额" prop="refundMoney" width="150">
            <template slot-scope="scope">
              <span>￥{{ scope.row.refundMoney | formatQianFenWei }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="退款状态" prop="status" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.status | filterRefoundStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="申请人" prop="applyName"></el-table-column>
          <el-table-column align="center" label="申请时间" prop="createTime">
            <template slot-scope="scope">
              <span>{{ (scope.row.createTime|| "").split(" ")[0]  }}</span>
            </template>
          </el-table-column>
          
        </el-table>

        <div v-else class="empty-box">
          暂无
        </div>
      </div>

      <div class="tittle">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">开票记录</span>
      </div>
      <div class="salesOrderpayInfo">
        
        <el-table border :data="invoiceList" v-loading="tableLoading" :max-height="260" class="table" v-if="invoiceList.length">
          
          <el-table-column align="center" label="开票类型" prop="invoiceType">
            <template slot-scope="scope">
              {{ scope.row.invoiceType == 1 ? '增值税普通发票' : scope.row.invoiceType == 2 ? '增值税专用发票' : '' }}
              ({{
                scope.row.subjectType === 1 ? "个人" : scope.row.subjectType === 2 ? "公司" : ""
              }})
            </template>
          </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="开票金额" >
            <template slot-scope="scope">
              <span>￥{{ scope.row.makeInvoiceMoney | formatQianFenWei }}</span>
            </template>
          </el-table-column>
          
          <el-table-column align="center" label="税点" prop="taxPoint">
            
          </el-table-column>
          <el-table-column align="center" label="开票状态" prop="status">
            <template slot-scope="scope">
              <span>{{ scope.row.status |filterInvoiceListType }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="申请人" prop="createName"></el-table-column>
          <el-table-column align="center" label="申请时间" prop="applyTime"></el-table-column>
          
        </el-table>

        <div v-else class="empty-box">
          暂无
        </div>
      </div>


      <div class="tittle">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">操作记录</span>
      </div>
      <div class="salesOrderpayInfo">
        
        <el-table border :data="activities" v-loading="tableLoading" :max-height="260" class="table" v-if="activities.length">
          
          <el-table-column align="center" label="操作者" prop="invoiceType" width="150">
            <template slot-scope="scope">
              {{ scope.row.username|| scope.row.userMobile }}
            </template>
          </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="操作时间">
            <template slot-scope="scope">
              {{ scope.row.businessOperateTime }}
            </template>
          </el-table-column>
          
          
          <el-table-column align="center" label="操作动作" width="200" prop="orderMoney">
            <template slot-scope="scope">
              <span>{{ scope.row.businessOperateName }}</span>
            </template>
          </el-table-column>
         
          
        </el-table>
        <div v-else class="empty-box">
          暂无
        </div>
      </div>

    </div>
  </div>
</template>

<script>

import { getDeatils } from "@/api/newApi/orderManage/salesorder.js";
import operateLog from"@/view/module/workOrder/mixin/operationLog";
export default {
  components: {
  },
  filters: {
    filterInvoiceType(invoice) {
      if (invoice && invoice.id) {
        switch (invoice.status) {
          case 1:
            return '待开票';
          case 2:
            return '已开票';
          case 3:
            return '全部退款';
          case 4:
            return '已取消';
          case 5:
            return '退款中';
          case 6:
            return '待确认到账';
          case 7:
            return '部分退款';
          case 8:
            return '付款被驳回';
        }
      } else {
        return '未开票';
      }
    },
    filterInvoiceListType(invoice) {
      switch (invoice) {
        case 1:
          return '待开票';
        case 2:
          return '已开票';
        case 3:
          return '全部退款';
        case 4:
          return '已取消';
        case 5:
          return '退款中';
        case 6:
          return '待确认到账';
        case 7:
          return '部分退款';
        case 8:
          return '付款被驳回';
        default:
          '未开票';
      }
    }, 
    filterRefoundStatus(status) {
      switch (status) {
        case 0:
          return '待付款';
        case 1:
          return '付款待确认';
        case 2:
          return '已付款';
        case 3:
          return '已取消';
        case 4:
          return '部分付款';
        case 5:
          return '部分退款';
        case 6:
          return '已退款';
        case 10:
          return '付款驳回';
        case 11:
          return '付款被驳回';
        case 12:
          return '待审核';
      }
    }
  },
  mixins:[operateLog],
  data() {
    return {
      detailInfo: {
      },
      orderPayments: [], //订单付款信息
      orderProducts: [], //订单服务信息
      refoundPayments: [], // 退款记录
      invoiceList: [],
      contractList: [],
      userInfoList: [],
      id: "",
      orderNo:"",
      tableLoading: false
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getDeatilData();
  },
  methods: {
    goBack(){
      this.$router.push('/query/index')
    },
    //复制链接
    copyLink(row) {
      let _this = this;
      let clipboard = new this.clipboard('.cobyOrderSn');
      console.log('clipboard', clipboard);
      clipboard.on('success', function (e) {
        _this.$message.success('复制成功');
      });
      clipboard.on('error', function () {
        _this.$message.info('复制失败');
      });
      console.log('测试2');
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
    },
    goBack() {
      this.$router.push({
        name: 'xcloudplat_query'
      });
    },
    getDeatilData() {
      // this.detailInfo = null
      this.tableLoading = true
      getDeatils(this.id)
        .then((res) => {
          if (res.code == 0) {
            this.detailInfo = res.data;
            console.log(this.detailInfo)
            res.data.orderPayments.forEach(item => {
              item.paymentFile = (item.paymentFile || '').split(',').filter(i => i)
            })
            this.orderPayments = res.data.orderPayments;
            this.tableLoading = false
            this.orderProducts = res.data.orderProducts;
            this.refoundPayments = res.data.orderRefunds
            this.orderNo = res.data.orderNo
            this.contractList = [
              {
                contractCompanyName: res.data.contractCompanyName,
                contractSignLink: res.data.contractSignLink,
                contractStatus: res.data.contractStatus,
                contractUrl: res.data.contractUrl,
                contractFileName: res.data.contractFileName
              }
            ]
            this.invoiceList = res.data.invoiceList
            this.userInfoList = [{
              userMobile: res.data.userMobile,
              contractCompanyName: res.data.contractCompanyName
            }]
            this.getOperationLog(this.orderNo,1)
          }
        })
        .catch((err) => {
          console.log(err)
          // 延迟loading关闭
          setTimeout(() => {
            this.$router.push({ path: "/workOrder/query/index" });
          }, 1000);
        });
    },
  },
};
</script>

<style lang='scss' scoped>
.header-container {
  padding-left: 24px;
}

/deep/ .el-table .el-table__header th {
  background: #f6f6f6 !important;
}
.salesOrderpayInfo {
  border: 1px solid #eeeeee;
  padding: 30px;
  .table {
    width: auto;
  }
}
.tittle {
  padding: 24px 0px 10px 0px;
  font-size: 18px;
}

.orderInfo {
  .order {
    margin-bottom: 15px;
  }
}

.basic-info {
  /deep/ .ivu-col {
    border: 1px solid #d7d7d7;
    border-left: none;
    border-top: none;
    padding: 8px 0 8px 4px;
    min-height: 35px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /deep/ .ivu-col:first-of-type {
    border-left: 1px solid #d7d7d7;
  }

  
}

.first-info /deep/ .ivu-col {
  border-top: 1px solid #d7d7d7;
}

.empty-box {
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #999;
  font-size: 18px;
}
</style>