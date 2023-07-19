<template>
  <el-drawer :size="682" title="订单确认" :visible.sync="dialogvisible" center>
    <div slot="title" class="drawer-title-wrapper">
      <div class="drawer-title">服务信息</div>
      <span class="create-time-title">创建时间: {{ detailData.createTime }}</span>
    </div>

    <div class="product-wrap">
      <span class="product-info">{{ detailData.productName }}</span>
      |
      <span class="spec-info">{{ detailData.specsName }}</span>

      <!-- <el-tag type="success">注册完成</el-tag> -->

      <el-tag :type="nodeType" v-if="showVat">{{ serviceProgressName }}</el-tag>
      <el-tag :type="nodeType" v-else>{{ detailData.currentNode | filterNodeCode(nodeList) }}</el-tag>
      <!-- <el-tag :type="nodeType">{{ detailData.currentNode }}</el-tag> -->
    </div>

    <div class="order-wrap">
      <span class="order-info">订单号：{{ detailData.orderNo }}</span>
      <span class="work-info">服务号：{{ detailData.serviceNo }}</span>
    </div>

    <div class="tax-info" v-if="showVat">
      <el-descriptions :column="2" :labelStyle="{ color: '#666666' }" :contentStyle="{ color: '#333333' }">
        <el-descriptions-item label="国家">{{ detailData.country }}</el-descriptions-item>
        <el-descriptions-item label="税号">{{ detailData.taxNo }}</el-descriptions-item>
        <el-descriptions-item label="税号下发日期">{{ detailData.taxNoIssuedDate }}</el-descriptions-item>
        <el-descriptions-item label="税号生效日期">{{ detailData.taxNoTakeEffectDate }}</el-descriptions-item>
        <el-descriptions-item label="周期类型">{{ detailData.declarePeriod | filterPeriod }}</el-descriptions-item>
        <el-descriptions-item label="首次申报月份">{{ detailData.firstDeclareMonth }}</el-descriptions-item>
        <el-descriptions-item label="已申报月份">{{ detailData.declareMonth }}</el-descriptions-item>
        <el-descriptions-item label="服务截止月份">{{ detailData.serviceEndDate }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="tax-info" v-if="functionCode == 16">
      <el-descriptions :column="2" :labelStyle="{ color: '#666666' }" :contentStyle="{ color: '#333333' }">
        <el-descriptions-item label="国家">{{ detailData.country }}</el-descriptions-item>
        <el-descriptions-item label="公司名称">{{ detailData.companyName }}</el-descriptions-item>
        <el-descriptions-item label="城市">{{ detailData.city }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ detailData.telNumber }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ detailData.email }}</el-descriptions-item>
        <el-descriptions-item label="邮编">{{ detailData.postalCode }}</el-descriptions-item>
        <el-descriptions-item label="协议生效日期">{{ detailData.agreementTakeEffectDate }}</el-descriptions-item>
        <el-descriptions-item label="协议到期日期">{{ detailData.agreementEndDate }}</el-descriptions-item>
        <el-descriptions-item label="街道详细地址">{{ detailData.address }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="tax-info" v-if="functionCode == 61">
      <el-descriptions :column="2" :labelStyle="{ color: '#666666' }" :contentStyle="{ color: '#333333' }">
        <el-descriptions-item label="受理号">{{ detailData.acceptanceNo }}</el-descriptions-item>
        <el-descriptions-item label="商标类型">
          {{ detailData.trademarkType == 1 ? '纯文字' : detailData.trademarkType == 2 ? '纯图形' : detailData.trademarkType == 3 ? '图形+文字' : '' }}
        </el-descriptions-item>
        <el-descriptions-item label="受理日期">{{ detailData.acceptanceDate }}</el-descriptions-item>
        <el-descriptions-item label="商标名称">{{ detailData.trademarkName }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="tax-info" v-if="functionCode == 100">
      <el-descriptions :column="2" :labelStyle="{ color: '#666666' }" :contentStyle="{ color: '#333333' }">
        <el-descriptions-item label="律师">{{ detailData.lawyer }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ detailData.registerTime }}</el-descriptions-item>
        <el-descriptions-item label="建模绘图进度"> {{ modelingDrawProgress }}</el-descriptions-item>
        <el-descriptions-item label="授权书进度">{{ authorizationProgress }}</el-descriptions-item>
        <el-descriptions-item label="OA进度"> {{ oaProgress }}</el-descriptions-item>
      </el-descriptions>
    </div>

    <div class="tax-table" v-if="showVat">
      <p>
        <span class="declare-record-title">申报记录</span> <a class="download-font" v-if="detailData.taxCertificate" target="_blank" :href="detailData.taxCertificate"> <i class="el-icon-download"></i>下载税号证书</a>
      </p>

      <el-table border ref="table" max-height="300" :data="list" highlight-current-row element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <el-table-column align="center" label="序号" width="70" type="index">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="申报工单" prop="taxWorkNo"> </el-table-column>

        <el-table-column show-overflow-tooltip align="center" label="申报周期">
          <template slot-scope="scope"> {{ (scope.row.beginTime || '').split(' ')[0] }}~{{ (scope.row.endTime || '').split(' ')[0] }} </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip align="center" label="申报进度">
          <template slot-scope="scope">{{ scope.row.status | filterStatus }}</template>
        </el-table-column>

        <el-table-column x show-overflow-tooltip align="center" label="工单状态">
          <template slot-scope="scope">
            {{ scope.row.isSuppleDecl == true ? '补申报' : '正常' }}
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip align="center" label="操作">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" v-if="scope.row.countryCode == 'GB' && scope.row.status == '16' && scope.row.declareReceipt == ''" @click="downloadShuijinForms(scope.row.id)" class="el-icon-search" v-show="hasAuthority('M1_11')">查看</el-link>
            <el-link type="primary" :underline="false" v-else-if="scope.row.declareReceipt" @click="showReceiptImg(scope.row)" v-show="hasAuthority('M1_11')">下载回执</el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
      </div>
    </div>

    <div class="file-wrap" v-if="!showVat">
      <p class="file-title">文件信息</p>
      <div class="file-box">
        <!-- <div class="file-info" v-for="(item, index) in Object.keys(detailData.attachment)" :key="index">
          <img src="@/assets/images/home/PDF.png" />
          <div>
            <p>{{ item }}</p> 16
          
            <template v-if="functionCode == 31 && detailData.attachment[item]">
              <el-link target="_blank" class="down-font" v-for="(el, ind) in JSON.parse(detailData.attachment[item])" :key="ind" :href="el" type="primary"> 下载 <i class="el-icon-download"></i> </el-link>
            </template>
            <template v-if="(functionCode == 61 || functionCode == 100) && detailData.attachment[item]">
              <el-link target="_blank" class="down-font" :href="detailData.attachment[item]" type="primary"> 下载 <i class="el-icon-download"></i> </el-link>
            </template>
          </div>
        </div> -->

        <div class="file-info" v-for="(item, index) in detailData.attachmentHandle" :key="index">
          <img v-if="item.suffixStr == 'pdf'" src="@/assets/images/home/PDF.png" />
          <img v-else-if="item.suffixStr == 'doc' || item.suffixStr == 'docx'" src="@/assets/images/home/DOC.png" />
          <img v-else src="@/assets/images/home/unknown.png" />
          <div>
            <p>{{ item.fileName }}</p>

            <template v-if="item.type == 'arr'">
              <a target="_blank" class="down-font" v-for="(el, ind) in item.fileUrl" :key="ind" :href="el" type="primary"> 下载 <i class="el-icon-download"></i> </a>
            </template>
            <template v-if="item.type == 'str'">
              <a target="_blank" class="down-font" v-if="item.fileUrl" :href="item.fileUrl" type="primary"> 下载 <i class="el-icon-download"></i> </a>
            </template>
          </div>
        </div>
      </div>
    </div>
    <ShowReceiptDialog :showReceiptImgModel.sync="showReceiptImgModel" :imglist="imglist" :row="row"></ShowReceiptDialog>
  </el-drawer>
</template>

<script>
import { statusList } from './enumObj.js';
import { declarePage, downloadBritainReceipt } from '@/api/newApi/taxServices/taxNumDeclare.js';
import ShowReceiptDialog from '@/view/module/newTaxServices/taxNumDeclare/components/showReceiptDialog.vue';
import { progressBarList as modelingDrawProgressBarList } from '@/view/module/intellectualProperty/modelingAndDrawing/enumObj.js';
import { progressBarList as oaProgressBarList } from '@/view/module/intellectualProperty/OAAppearancePatent/enumObj.js';
import { progressBarList as authorizationProgressBarList } from '@/view/module/intellectualProperty/certificate/enumObj.js';

import { serviceNode } from '@/api/newApi/taxServices/serviceManage.js';
export default {
  props: {
    showDetailDrawer: Boolean,
    functionCode: String | Number,
    serviceProgressName: String,
    detailData: Object,
    serviceId: String,
  },
  components: {
    ShowReceiptDialog,
  },
  filters: {
    filterPaymentChannel(val) {
      return (list.find((item) => item.dataCode == val) || {}).dataValue;
    },
    filterNodeCode(val, list) {
      return (list.find((item) => item.nodeCode == val) || {}).nodeName;
    },
    filterStatus(status) {
      if (status < 10) {
        return '未开始';
      }
      let result = statusList.find((item) => item.value === status);
      return result ? result.label : '';
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.showDetailDrawer;
      },
      set(val) {
        this.$emit('update:showDetailDrawer', val);
      },
    },
    showVat() {
      return [1, 5, 23, 2].includes(this.functionCode);
    },
    nodeType() {
      if (this.showVat) {
        if (this.serviceProgressName.indexOf('完成') != -1) {
          return 'success';
        }
        return 'warning';
      }
      if (this.nodeList && this.nodeList.length) {
        if (this.detailData.currentNode == this.nodeList[this.nodeList.length - 1].nodeCode) {
          return 'success';
        }
      }
      return 'warning';
    },
    // 建模绘图进度
    modelingDrawProgress() {
      if (this.detailData.modelingDrawingProgress) {
        let temp = modelingDrawProgressBarList.find((item) => item.value === this.detailData.modelingDrawingProgress);
        return temp ? temp.label : '无流程';
      }
      return '无流程';
    },
    // OA进度
    oaProgress() {
      if (this.detailData.oaProgress) {
        let temp = oaProgressBarList.find((item) => item.value === this.detailData.oaProgress);
        return temp ? temp.label : '无流程';
      }
      return '无流程';
    },
    // 授权书进度
    authorizationProgress() {
      if (this.detailData.powerOfAttorneyProgress) {
        let temp = authorizationProgressBarList.find((item) => item.value === this.detailData.powerOfAttorneyProgress);
        return temp ? temp.label : '无流程';
      }
      return '无流程';
    },
  },
  watch: {
    showDetailDrawer(val) {
      if (val) {
        this.getServiceNode();
        this.handleAttachment();
        if (this.showVat) {
          this.getDeclarePage();
        }
      }
    },
  },
  data() {
    return {
      detail: {},
      list: [],
      showReceiptImgModel: false,
      imglist: [],
      nodeList: [],
      row: {},
      listTotal: 0,
      listQuery: {
        page: 1,
        limit: 20,
      },
    };
  },
  mounted() {},
  methods: {
    refundMethodChange(val) {
      if (val === 'COUPON') {
        this.refundForm.refundPoundage = 0;
        this.refundForm.refundMoney = -this.restPrice;
      }
    },
    getServiceNode() {
      serviceNode({ functionCode: this.functionCode })
        .then((res) => {
          if (res.code == 0) {
            console.log(res.data);
            this.nodeList = res.data;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 下载税金确认文件
    downloadShuijinForms(id) {
      this.$util.downFile(this.baseUrl + '/workorder/management/download/receipt?workId=' + id);
      // downloadBritainReceipt({ workId: id }).then((res) => {
      //   if (JSON.stringify(res.data) !== '{}') {
      //     this.$util.exporDdf(res);
      //   }
      // });
    },
    handleAttachment() {
      if (this.detailData.attachment) {
        var arr = [];
        Object.keys(this.detailData.attachment).forEach((item) => {
          if (this.detailData.attachment[item].indexOf('[') != -1) {
            const fileUrl = JSON.parse(this.detailData.attachment[item]);
            arr.push({
              fileUrl,
              type: 'arr',
              fileName: item,
              suffixStr: fileUrl[0].substr(fileUrl[0].lastIndexOf('.') + 1),
            });
          } else {
            const urlName = this.detailData.attachment[item];
            arr.push({
              fileUrl: urlName,
              type: 'str',
              fileName: item,
              suffixStr: urlName.substr(urlName.lastIndexOf('.') + 1),
            });
          }
        });
        console.log(arr);
        this.$set(this.detailData, 'attachmentHandle', arr);
      }
    },
    getInfos() {
      this.productName = this.refundList.reduce((pre, cur) => {
        return pre == '' ? pre + cur.productName : pre + ',' + cur.productName;
      }, '');

      this.paidMoney = this.refundList.reduce((pre, cur) => {
        return this.$util.accAdd(pre, cur.productPaidMoney);
      }, 0);
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getDeclarePage();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getDeclarePage();
    },
    // 查看回执
    showReceiptImg(row) {
      this.showReceiptImgModel = true;
      if (row.declareReceipt.indexOf(',') !== -1) {
        this.imglist = row.declareReceipt.split(',');
      } else if (row.declareReceipt.indexOf(';') !== -1) {
        this.imglist = row.declareReceipt.split(';');
      } else {
        this.imglist = [row.declareReceipt];
      }

      this.row = row;
    },

    // 申报记录
    getDeclarePage() {
      declarePage({
        serviceId: this.serviceId,
        isSearchStatus: '1',
        ...this.listQuery,
      }).then((res) => {
        if (res.code === 0) {
          res.data.records.map((item) => {
            item.receiptImg = item.declareReceipt !== '' ? item.declareReceipt.split(',') : [];
          });
          this.list = res.data.records;

          let effective = this.list.filter((item) => item.invalid == false);
          let failure = this.list.filter((item) => item.invalid == true);
          this.list = effective.concat(failure);
          this.listTotal = Number(res.data.total);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  margin: 20px 20px 20px 63px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}
.tag {
  margin-right: 15px;
}
.item-tip {
  width: 400px;
  margin-top: 10px;
}
.drawer-title-wrapper {
  height: 79px;
  padding-right: 28px;
  display: flex;
  align-items: center;
  .drawer-title {
    font-size: 16px;
    color: #333;
  }
}
::v-deep .el-drawer__header {
  padding: 0 30px;
  border-bottom: 1px solid #ddd;
}
/deep/ .el-drawer__body {
  padding: 0 40px;
  h2,
  .refund-blod {
    font-size: 22px;
    color: #333;
    margin-bottom: 10px;
    font-weight: 800;
    margin-right: 20px;
  }
}

// .drawer-title-wrapper /deep/.drawer-title {
//   font-size: 18px;
// }

/deep/ .el-drawer__header {
  margin-bottom: 10px !important;
}

.title {
  margin: 0 20px 10px 20px;
  font-size: 14px;
  color: black;
  &.bold {
    font-weight: bold;
    margin-bottom: 20px;
  }
}
.create-time-title {
  margin-left: 48px;
  font-size: 12px;
  color: #666;
}
/deep/ .el-drawer__close-btn {
  margin-right: 50px;
}
.product-info,
.spec-info {
  color: #333;
  font-size: 14px;
}
.product-wrap {
  margin-top: 15px;
}
.product-info {
  margin-right: 15px;
}
.spec-info {
  margin-left: 15px;
}

.order-wrap {
  margin-top: 16px;
}
.order-info,
.work-info {
  display: inline-block;
  padding: 5px 16px;
  background: #f5f8fb;
  margin-right: 16px;
  color: #000;
  font-size: 14px;
}
.file-title {
  font-size: 14px;
  color: #333;
  margin: 28px 0 16px;
}

.file-info {
  width: 289px;
  background: #f5f8fb;
  display: flex;
  margin: 0 24px 16px 0;
  img {
    margin: 20px;
  }
  p {
    margin-top: 20px;
    margin-bottom: 5px;
  }
  .down-font {
    color: #1890ff;
    margin-right: 10px;
  }
}
.file-box {
  display: flex;
}

.tax-info {
  margin-top: 28px;
  background: #f5f8fb;
  padding: 12px 22px;
}
/deep/ .el-descriptions__body {
  background: #f5f8fb;
}
/deep/.el-descriptions-item__cell {
  margin-bottom: 16px !important;
}
/deep/ .el-tag.el-tag--success {
  border-color: #52c41a;
  color: #3aa406;
  background: rgba(82, 196, 26, 0.2);
}

.el-tag {
  float: right;
  border-radius: 2px;
}
/deep/ .el-tag.el-tag--warning {
  color: #d47b00;
  border-color: #ffc100;
  background: rgba(255, 193, 0, 0.2);
}

.tax-table {
  margin-top: 28px;
  p {
    margin-bottom: 16px;
  }
}

.declare-record-title {
  margin-bottom: 16px;
  color: #333;
  font-size: 14px;
  font-weight: 800;
}

.download-font {
  float: right;
  cursor: pointer;
  color: #1890ff;
}
</style>
