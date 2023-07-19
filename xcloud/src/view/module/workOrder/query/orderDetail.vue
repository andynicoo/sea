<template>
  <div class="app-container">

    <div class="header-container">

      <el-link type="primary" :underline="false" @click="goBack" style="margin-bottom: 10px;">
        ＜返回列表
      </el-link>
     
      <div class="tittle" v-if="detailInfo.productFunctionCode == 5 || detailInfo.productFunctionCode == 23">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">注册工单信息</span>
      </div>

      <div class="tittle" v-if="detailInfo.productFunctionCode == 2 ">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">转代理工单信息</span>
      </div>
      <div class="salesOrderpayInfo" v-if="detailInfo.productFunctionCode == 5 || detailInfo.productFunctionCode == 2 || detailInfo.productFunctionCode == 23">

        <div class="el-table table-oneLine" style="width: 100%;">

          <div class="el-table__header-wrapper">
            <table  class="el-table__header" >
                <tr>
                  <th>
                    <div class="cell">服务进度</div>
                  </th>
                  <th>
                    <div class="cell">税号</div>
                  </th>
                  <th>
                    <div class="cell">税号生效日期</div>
                  </th>
                  <th>
                    <div class="cell">税号文件</div>
                  </th>
                  <th>
                    <div class="cell">公司名称</div>
                  </th>
                  <th>
                    <div class="cell">国家</div>
                  </th>
                  <th>
                    <div class="cell">处理人</div>
                  </th>
                  <th>
                    <div class="cell">服务截止时间</div>
                  </th>
                  <th>
                    <div class="cell">操作记录</div>
                  </th>
                </tr>
     
              <tbody>
                <tr class="el-table__row">
                  <td>
                    <div class="cell">{{detailInfo.rtWorkOrder.cureentNodeCode | filterProgressTaxBar}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.rtWorkOrder.vatTaxNumber}}</div>
                  </td>
                  <td>
                    <div class="cell">{{(detailInfo.rtWorkOrder.taxEffectiveDate || "").split(" ")[0] }}</div>
                  </td>
                  <td>
                    <div class="cell"><el-link type="primary" :underline="false" 
                        :href="detailInfo.rtWorkOrder.vatTaxNumberFile.replace('http://', 'https://')" target="_blank" v-if="detailInfo.rtWorkOrder.vatTaxNumberFile">
                        下载
                      </el-link>
                      <span class="text-info" v-else>暂无</span></div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.rtWorkOrder.companyNameZh}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.rtWorkOrder.countryNameZh}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.rtWorkOrder.handlerUserName}}</div>
                  </td>
                  <td>
                    <div class="cell">{{(detailInfo.rtWorkOrder.expirationTime || "").split(" ")[0]}}</div>
                  </td>
                  <td>
                    <div class="cell">
                      <el-link type="primary" :underline="false" @click="getOperate(detailInfo.serviceNo,2)">
                        查看
                      </el-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="tittle" v-if="detailInfo.productFunctionCode == 5 || detailInfo.productFunctionCode == 2 || detailInfo.productFunctionCode == 23">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">申报记录</span>
      </div>
      <div class="salesOrderpayInfo" v-if="detailInfo.productFunctionCode == 5 || detailInfo.productFunctionCode == 2 || detailInfo.productFunctionCode == 23">
        
        <el-table border :data="detailInfo.declareWorkOrders" v-loading="tableLoading" :max-height="260" class="table">
          <el-table-column align="center" label="公司名称" prop="companyNameZh" width="150"></el-table-column>
          
          <el-table-column align="center" label="申报进度" width="200px">
            <template slot-scope="scope">
              <span>{{ scope.row.status | filterProgressDecalreBar}}</span>
            </template>
          </el-table-column>
          
          <el-table-column align="center" label="申报周期" width="200">
            <template slot-scope="scope">

              {{(scope.row.beginTime || "").split(" ")[0]  }} - {{(scope.row.endTime || "").split(" ")[0]  }}
              
            </template>
          </el-table-column>
          <el-table-column align="center" label="税金" prop="allTaxPrice">
            <template slot-scope="scope">
             {{ scope.row.allTaxPrice | formatQianFenWei}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="税金确认单" prop="contractCompanyName">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false"  @click="downloadShuijinForms(scope.row.id)">
                  查看
                </el-link>
            </template>
          </el-table-column>
          <el-table-column align="center" label="缴费凭证" prop="contractCompanyName">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" 
                  :href="scope.row.taxCertificate.replace('http://', 'https://')" target="_blank" v-if="scope.row.taxCertificate">
                  查看
                </el-link>
                <span class="text-info" v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="回执" prop="declareReceipt">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" 
                v-if="scope.row.declareReceipt" @click="uploadTaxDeclareReceipt(scope.row)">
                  查看
                </el-link>
                <span class="text-info" v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="驳回详情" prop="rejectReason">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false"  v-if="scope.row.hasReject"
                 @click="checkRejectInfo(scope.row)">
                  查看
                </el-link>
                <span class="text-info" v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" prop="remark">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" v-if="scope.row.hasRemark" @click="seeRemark(scope.row)">
              查看</el-link>
              <span class="text-info" v-else>暂无</span>
            </template>
          </el-table-column>
          
        </el-table>
      </div>

      <p class="lian-title" v-if="detailInfo.productFunctionCode == 5 || detailInfo.productFunctionCode == 23">关联工单</p>
      <div class="tittle" v-if="detailInfo.productFunctionCode == 5 || detailInfo.productFunctionCode == 23">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">海牙认证工单信息</span>
      </div>
      <div class="salesOrderpayInfo" v-if="detailInfo.productFunctionCode == 5 || detailInfo.productFunctionCode == 23">
        <div class="el-table table-oneLine" style="width: 100%;" v-if="JSON.stringify(detailInfo.apostilleWorkOrder) != '{}'">

          <div class="el-table__header-wrapper">
            <table  class="el-table__header" >
                <tr>
                  <th>
                    <div class="cell">服务进度</div>
                  </th>
                  <th>
                    <div class="cell">海牙文件</div>
                  </th>
                  <th>
                    <div class="cell">公司名称</div>
                  </th>
                  <th>
                    <div class="cell">国家</div>
                  </th>
                  <th>
                    <div class="cell">处理人</div>
                  </th>
                  <th>
                    <div class="cell">海牙编号</div>
                  </th>
                  <th>
                    <div class="cell">操作记录</div>
                  </th>
                </tr>
     
              <tbody>
                <tr class="el-table__row">
                  <td>
                    <div class="cell">{{
                      detailInfo.apostilleWorkOrder.cureentNodeCode == 'NODE0028' ? '待上传资料' :
                      detailInfo.apostilleWorkOrder.cureentNodeCode == 'NODE0029' ? '待审核':
                      detailInfo.apostilleWorkOrder.cureentNodeCode == 'NODE0030' ? '待授权':
                      detailInfo.apostilleWorkOrder.cureentNodeCode == 'NODE0031' ? '海牙认证中': 
                      detailInfo.apostilleWorkOrder.cureentNodeCode == 'NODE0032' ? '认证完成': '' 
                      }}</div>
                  </td>
                  
                  <td>
                    <div class="cell">
                      <div class="cell"><el-link type="primary" :underline="false"
                        :href="detailInfo.apostilleWorkOrder.hyFile.replace('http://', 'https://')" target="_blank" v-if="detailInfo.apostilleWorkOrder.hyFile">
                        下载
                      </el-link>
                      <span class="text-info" v-else>暂无</span></div>
                    </div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.apostilleWorkOrder.companyNameZh}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.apostilleWorkOrder.countryNameZh}}</div>
                  </td>
                  
                  <td>
                    <div class="cell">{{detailInfo.apostilleWorkOrder.handlerUserName}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.apostilleWorkOrder.fileEncode}}</div>
                  </td>
                  <td>
                    <div class="cell"><el-link type="primary" :underline="false" @click="getOperate(detailInfo.apostilleWorkOrder.serviceNo,2)">
                        查看
                      </el-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="empty-box">
          暂无
        </div>
       
      </div>


      <div class="tittle" v-if="detailInfo.productFunctionCode == 16">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">授权代表工单信息</span>
      </div>
      <div class="salesOrderpayInfo" v-if="detailInfo.productFunctionCode == 16">
        <div class="el-table table-oneLine" style="width: 100%;">

          <div class="el-table__header-wrapper">
            <table  class="el-table__header" >
                <tr>
                  <th>
                    <div class="cell">服务进度</div>
                  </th>
                  <th>
                    <div class="cell">公司名称</div>
                  </th>
                  <th>
                    <div class="cell">国家</div>
                  </th>
                  <th>
                    <div class="cell">处理人</div>
                  </th>
                  <th>
                    <div class="cell">协议</div>
                  </th>
                  <th>
                    <div class="cell">证书</div>
                  </th>
                  <th>
                    <div class="cell">标签协议</div>
                  </th>
                  <th>
                    <div class="cell">协议生效日期</div>
                  </th>
                  <th>
                    <div class="cell">协议到期日期</div>
                  </th>
                  <th>
                    <div class="cell">操作记录</div>
                  </th>
                </tr>
     
              <tbody>
                <tr class="el-table__row">
                  <td>
                    <div class="cell">{{detailInfo.authorizedWorkOrder.cureentNodeCode | filterProgressEPRBar}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.authorizedWorkOrder.companyNameZh}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.authorizedWorkOrder.countryNameZh}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.authorizedWorkOrder.handlerUserName}}</div>
                  </td>
                  <td>
                    <div class="cell">
                      <el-link type="primary" :underline="false"
                        :href="detailInfo.authorizedWorkOrder.agreement.replace('http://', 'https://')" target="_blank" v-if="detailInfo.authorizedWorkOrder.agreement">
                        下载
                      </el-link>
                      <span class="text-info" v-else>暂无</span></div>
                  </td>
                  <td>
                    <div class="cell">
                      <el-link type="primary" :underline="false"
                        :href="detailInfo.authorizedWorkOrder.certificat.replace('http://', 'https://')" target="_blank" v-if="detailInfo.authorizedWorkOrder.certificat">
                        下载
                      </el-link>
                      <span class="text-info" v-else>暂无</span>
                    </div>
                  </td>
                  <td>
                    <div class="cell">
                      <el-link type="primary" :underline="false"
                        :href="detailInfo.authorizedWorkOrder.tagFile.replace('http://', 'https://')" target="_blank" v-if="detailInfo.authorizedWorkOrder.tagFile">
                        下载
                      </el-link>
                      <span class="text-info" v-else>暂无</span>
                    </div>
                  </td>
                  <td>
                    <div class="cell">{{ (detailInfo.authorizedWorkOrder.agreementBeginTime || "").split(" ")[0] }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ (detailInfo.authorizedWorkOrder.agreementEndTime || "").split(" ")[0] }}</div>
                  </td>
                  <td>
                    <div class="cell">
                      <el-link type="primary" :underline="false" @click="getOperate(detailInfo.serviceNo,2)">
                        查看
                      </el-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>


      <div class="tittle" v-if="detailInfo.productFunctionCode == 16">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">备案工单信息</span>
      </div>
      <div class="salesOrderpayInfo" v-if="detailInfo.productFunctionCode == 16">
        
        <el-table border :data="detailInfo.fillingWorkOrders" v-loading="tableLoading" :max-height="260" class="table" v-if="detailInfo.fillingWorkOrders.length">
          
          <el-table-column align="center" label="服务进度" prop="invoiceType" width="150">
            <template slot-scope="scope">
              {{ scope.row.status == 0 ? '待审核' :
                  scope.row.status == 1 ? '备案中':
                  scope.row.status == 2 ? '备案完成':
                  scope.row.status == 3 ? '备案驳回': '' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="备案工单号">
            <template slot-scope="scope">
              {{ scope.row.workNo }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="处理人" width="200" prop="orderMoney">
            <template slot-scope="scope">
              <span>{{ scope.row.handlerUserName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作记录" width="200" prop="orderMoney">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="getOperate(scope.row.workNo,3)">
                查看
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="empty-box">
          暂无
        </div>
      </div>

      


      <div class="tittle"  v-if="detailInfo.productFunctionCode == 6">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">注销工单信息</span>
      </div>
      <div class="salesOrderpayInfo"  v-if="detailInfo.productFunctionCode == 6">
        <div class="el-table table-oneLine" style="width: 100%;">

          <div class="el-table__header-wrapper">
            <table  class="el-table__header" >
                <tr>
                  <th>
                    <div class="cell">服务进度</div>
                  </th>
                  <th>
                    <div class="cell">注销回执</div>
                  </th>
                  <th>
                    <div class="cell">公司名称</div>
                  </th>
                  <th>
                    <div class="cell">国家</div>
                  </th>
                  <th>
                    <div class="cell">税号</div>
                  </th>
                  <th>
                    <div class="cell">处理人</div>
                  </th>
                  <th>
                    <div class="cell">操作记录</div>
                  </th>
                </tr>
     
              <tbody>
                <tr class="el-table__row">
                  <td>
                    <div class="cell">{{detailInfo.cureentNodeCode | filterProgressLogOutBar}}</div>
                  </td>
                  <td>
                    <div class="cell">
                      <el-link type="primary" :underline="false" 
                        :href="detailInfo.receiptFile.replace('http://', 'https://')" target="_blank" v-if="detailInfo.receiptFile">
                        下载
                      </el-link>
                      <span class="text-info" v-else>暂无</span></div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.companyNameZh}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.countryNameZh}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.vatTaxNumber}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.handlerUserName}}</div>
                  </td>
                  <td>
                    <div class="cell">
                      <el-link type="primary" :underline="false" @click="getOperate(detailInfo.serviceNo,2)">
                        查看
                      </el-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      
      </div>

      <div class="tittle"  v-if="detailInfo.productFunctionCode == 7 || detailInfo.productFunctionCode == 24">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">税务稽查/VAT退税工单信息</span>
      </div>
      <div class="salesOrderpayInfo"  v-if="detailInfo.productFunctionCode == 7 || detailInfo.productFunctionCode == 24">
        <div class="el-table table-oneLine" style="width: 100%;">

          <div class="el-table__header-wrapper">
            <table  class="el-table__header" >
                <tr>
                  <th>
                    <div class="cell">服务进度</div>
                  </th>
                  <th>
                    <div class="cell">服务名称</div>
                  </th>
                  <th>
                    <div class="cell">公司名称</div>
                  </th>
                  <th>
                    <div class="cell">国家</div>
                  </th>
                  <th>
                    <div class="cell">处理人</div>
                  </th>
                  <th>
                    <div class="cell">操作记录</div>
                  </th>
                </tr>
     
              <tbody>
                <tr class="el-table__row">
                  <td>
                    <div class="cell">{{detailInfo.cureentNodeCode | filterProgressTaxInspectBar}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.serviceName}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.companyNameZh}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.countryNameZh}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.handlerUserName}}</div>
                  </td>
                  <td>
                    <div class="cell">
                      <el-link type="primary" :underline="false" @click="getOperate(detailInfo.serviceNo,2)">
                        查看
                      </el-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
      </div>


      <div class="tittle" v-if="detailInfo.productFunctionCode == 20">
        <el-divider direction="vertical"></el-divider>
        <span class="text-info">极简工单信息</span>
      </div>
      <div class="salesOrderpayInfo" v-if="detailInfo.productFunctionCode == 20">
        <div class="el-table table-oneLine" style="width: 100%;">
          <div class="el-table__header-wrapper">
            <table  class="el-table__header" >
                <tr>
                  <th>
                    <div class="cell">服务进度</div>
                  </th>
                  <th>
                    <div class="cell">服务名称</div>
                  </th>
                  <th>
                    <div class="cell">公司名称</div>
                  </th>
                  <th>
                    <div class="cell">国家</div>
                  </th>
                  <th>
                    <div class="cell">处理人</div>
                  </th>
                  <th>
                    <div class="cell">操作记录</div>
                  </th>
                </tr>
     
              <tbody>
                <tr class="el-table__row">
                  <td>
                    <div class="cell">{{detailInfo.progressBar | filterProgressBar }}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.serviceName}}</div>
                  </td>
                  <td>
                    <div class="cell">{{detailInfo.companyNameZh}}</div>
                  </td>
                  <td>
                    <div class="cell">{{ detailInfo.countryNameZh }}</div>
                  </td>
                  <td>
                    <div class="cell">
                      {{ detailInfo.handlerUserName }}
                    </div>
                  </td>
                  <td>
                    <div class="cell">
                      <el-link type="primary" :underline="false" @click="seeOperate(detailInfo)">
                        查看
                      </el-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        
        
        
      </div>



    </div>

    <OperateModel :showLogDialog.sync="showLogDialog" :activities="operationLog" :productFunctionCode="detailInfo.productFunctionCode" />
    <!-- <CheckRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :serviceNo="taxWorkNo" /> -->
    <RemarkModel :seeRemarkModel.sync="seeRemarkModel" :listRemark="listRemark" />
    <ShowReceiptDialog :showReceiptImgModel.sync="showReceiptImgModel" :imglist="imglist"  />

    <RejectDetailDialog
      :rejectDetailDialog.sync="checkRejectInfoDialog"
      :serviceId="taxWorkNo"
      v-if="checkRejectInfoDialog"
      apiKey="taxNumDeclare"
    ></RejectDetailDialog>
  </div>
</template>

<script>


import { getQueryDetail, getOperateList } from "@/api/newApi/workOrder/serviceQuery";
import { progressBarList, progressTaxInspectList, progressLogOutBarList, progressEPRBarList, progressTaxBarList, progressDecalreBarList } from "./enumObj";
import { getBusinessLogListByNo } from "@/api/newApi/common.js";
import operateLog from"@/view/module/workOrder/mixin/operationLog";
import {
  seelistRemark
} from "@/api/newApi/taxServices/serviceManage.js";
// import CheckRejectInfoDialog from "@/view/module/workOrder/components/checkRejectInfoDialog";

import RejectDetailDialog from "@/view/module/newTaxServices/taxNumDeclare/components/rejectDetailDialog.vue";
import ShowReceiptDialog from "@/view/module/workOrder/yearManage/components/showReceiptDialog";
import OperateModel from './components/operateModel'
import RemarkModel from './components/remarkModel'

export default {
  components: {
    OperateModel,
    // CheckRejectInfoDialog,
    RejectDetailDialog,
    ShowReceiptDialog,
    RemarkModel
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
    },
    filterProgressBar(progressBar) {
      let result = progressBarList.find((item) => item.value === progressBar);
      return result ? result.label : "";
    },
    filterProgressTaxInspectBar(progressBar) {
      let result = progressTaxInspectList.find((item) => item.value === progressBar);
      return result ? result.label : "";
    },
    filterProgressLogOutBar(progressBar) {
      let result = progressLogOutBarList.find((item) => item.value === progressBar);
      return result ? result.label : "";
    },
    filterProgressEPRBar(progressBar) {
      let result = progressEPRBarList.find((item) => item.value === progressBar);
      return result ? result.label : "";
    },
    filterProgressTaxBar(progressBar) {
      let result = progressTaxBarList.find((item) => item.value === progressBar);
      return result ? result.label : "";
    },
    filterProgressDecalreBar(progressBar) {
      let result = progressDecalreBarList.find((item) => item.value === progressBar);
      return result ? result.label : "";
    }
  },
  mixins:[operateLog],
  data() {
    return {
      detailInfo: {
        rtWorkOrder: {},
        declareWorkOrders: [],
        apostilleWorkOrder: {},
      },
      checkRejectInfoDialog: false, //查看驳回
      orderPayments: [], //订单付款信息
      orderProducts: [], //订单服务信息
      refoundPayments: [], // 退款记录
      invoiceList: [],
      contractList: [],
      userInfoList: [],
      operationLog: [],
      showLogDialog: false,
      showReceiptImgModel: false,
      seeRemarkModel: false,
      imglist: [],
      taxWorkNo: '',
      listRemark: [],
      id: "",
      orderNo:"",
      tableLoading: false
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getDeatilData();
    // this.getOperationLog(this.id, 2)
  },
  methods: {
    //复制链接
    copyLink(row) {
      let _this = this;
      let clipboard = new this.clipboard('.cobyOrderSn');
      clipboard.on('success', function (e) {
        _this.$message.success('复制成功');
      });
      clipboard.on('error', function () {
        _this.$message.info('复制失败');
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
    },
    goBack() {
      this.$router.push({
        name: 'xcloudplat_query'
      });
    },
    /**
     * 查看备注
     */
    seeRemark(row) {
      seelistRemark({ serviceNo: row.taxWorkNo })
        .then((res) => {
          if (res.code == 0) {
            this.seeRemarkModel = true;
            this.listRemark = res.data;
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 查看回执
    showReceiptImg(row) {
      this.showReceiptImgModel = true;
      if (row.declareReceipt.indexOf(",") !== -1) {
        this.imglist = row.declareReceipt.split(",");
      } else if (row.declareReceipt.indexOf(";") !== -1) {
        this.imglist = row.declareReceipt.split(";");
      } else {
        this.imglist = [row.declareReceipt];
      }

      this.row = row;
    },
    uploadTaxDeclareReceipt(row) {
      if (row.declareReceipt.split(",").length > 1 || row.declareReceipt.split(";").length > 1) {
        if (row.declareReceipt.indexOf(",") != -1) {
          this.imglist = row.declareReceipt.split(",");
        } else if (row.declareReceipt.indexOf(";") != -1) {
          this.imglist = row.declareReceipt.split(";");
        }
        for (let i = 0; i < this.imglist.length; i++) {
          if (this.imglist[i].slice(0, 5) == "http:") {
            this.imglist[i] =
              this.imglist[i].slice(0, 4) + "s" + this.imglist[i].slice(4);
          }
        }
        this.showReceiptImgModel = true;
      } else if (row.declareReceipt.split(",").length == 1) {
        let url = row.declareReceipt;
        if (url.slice(0, 5) == "http:") url = url.slice(0, 4) + "s" + url.slice(4);
        window.open(url);
      }
    },
    // 下载税金确认文件
    downloadShuijinForms (id) {
      this.$util.downFile(this.baseUrl+`/workorder/management/download/confirm?workId=${id}`)
    },
    // 查看驳回详情
    checkRejectInfo(row) {
      this.checkRejectInfoDialog = true;
      this.taxWorkNo = row.taxWorkNo
      // this.serviceNo = row.serviceNo;
      // this.getListReject(row);
    },
    getDeatilData() {
      // this.detailInfo = null
      this.tableLoading = true
      getQueryDetail(this.id)
        .then((res) => {
          this.tableLoading = false
          if (res.code == 0) {
            this.detailInfo = res.data
            if (res.data.productFunctionCode == 5 || res.data.productFunctionCode == 2) {
              const list = res.data.declareWorkOrders
              const resultList = []
              if (list && list.length) {
                list.forEach((item) => {
                  resultList.push({
                    ...item,
                    companyNameZh: res.data.rtWorkOrder.companyNameZh,
                    cureentNodeCode: res.data.rtWorkOrder.cureentNodeCode
                  });
                });
              }
              this.detailInfo.declareWorkOrders = resultList
            } else if (res.data.productFunctionCode == 16) {
             if (this.detailInfo.authorizedWorkOrder && this.detailInfo.authorizedWorkOrder.agreement) {
               if (this.detailInfo.authorizedWorkOrder.agreement.indexOf('[') != -1) {
                 this.detailInfo.authorizedWorkOrder.agreement = JSON.parse(this.detailInfo.authorizedWorkOrder.agreement)[0]
               }
             }
            }
          }
        })
        .catch((err) => {
          console.log(err)
          this.tableLoading = false
           // 延迟loading关闭
          setTimeout(() => {
            this.$router.push({ path: "/workOrder/query/index" });
          }, 1000);
        });
    },
    // getOperationLog(businessNo, businessType) {
    //   getBusinessLogListByNo({
    //     businessNo,
    //     businessType,
    //   }).then((res) => {
    //     if (res.code === 0) {
    //       console.log(res.data)
    //       this.operationLog = res.data;
    //     }
    //   });
    // },
    getOperate(businessNo, type) {
      // this.getOperationLog(this.id, type)
      getBusinessLogListByNo({
        businessNo,
        businessType: type,
      }).then((res) => {
        if (res.code === 0) {
          if(res.data && res.data.length) {
            this.operationLog = res.data
            this.showLogDialog = true
          } else {
            this.$message.error('暂无操作记录')
          }
        }
      });
    },
    seeOperate(row) {
      getOperateList(row.workOrderId)
        .then((res) => {
          if(res.data && res.data.length) {
            this.operationLog = res.data
            this.showLogDialog = true
          } else {
            this.$message.error('暂无操作记录')
          }
        })
        .catch((err) => {
          console.log(err)
        });
    }
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
  margin-bottom: 20px;
  .table {
    width: auto;
  }
}
.tittle {
  padding: 0px 0px 10px 0px;
  font-size: 18px;
}

.orderInfo {
  .order {
    margin-bottom: 15px;
  }
}

/deep/ .el-table__header {
  width: 100%;
  text-align: left;
}

/deep/.el-table .el-table__header th {
  background: #EBF5FF !important;
}

/deep/.el-table__row td {
  padding: 14px 0;
}

.h-35 {
  height: 35px;
}

.empty-box {
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #999;
  font-size: 18px;
}
table {
  border-spacing: 0;
}

.table-oneLine {
  .el-table__header th, .el-table__row td {
    border-right: 1px solid #EBEEF5;
  }

  .el-table__header th:first-of-type, .el-table__row td:first-of-type {
    border-left: 1px solid #EBEEF5;
  }
}

.lian-title {
  font-size: 20px;
  font-weight: 800;
}
</style>