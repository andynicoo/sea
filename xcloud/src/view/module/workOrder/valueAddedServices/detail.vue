<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="back">
        <i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>
        返回列表
      </el-link>
      <div class="header-block">
        <div>
          <!-- 待处理 -->
          <template v-if="detail.status == statusObj.PENDING">
            <el-button size="small" type="primary" @click="noProcessingRequiredDialog = true" v-if="hasAuthority('A2_5')">无需处理</el-button>
            <el-button size="small" type="primary" @click="centerDialogVisible = true" v-if="hasAuthority('A2_6')">开始处理</el-button>
          </template>
          <!-- 处理中 -->
          <template v-if="detail.status == statusObj.PROCESSING">
            <el-button size="small" type="primary" @click="completeDialog = true" v-if="hasAuthority('A2_7')">处理完成</el-button>
          </template>
        </div>
      </div>
    </div>
    <div ref="searchBox" class="desc-block">
      <ul class="text-desc dis-flex">
        <li>
          <span class="text-title">国家：</span>
          <span class="text-info">{{ detail.countryNameZh }}</span>
        </li>
        <li>
          <span class="text-title">服务名称：</span>
          <span class="text-info">{{ applyTypeList[detail.applyType] }}</span>
        </li>
        <li>
          <span class="text-title">服务号：</span>
          <span class="text-info">{{ detail.serviceNo }}</span>
        </li>
        <li>
          <span class="text-title">服务状态：</span>
          <span class="text-info">{{ statusList[detail.status] }}</span>
        </li>
        <li>
          <span class="text-title">服务商：</span><span class="text-info"> {{ detailObj.shortName }}</span>
        </li>
        <li>
          <span class="text-title">服务进度：</span><span class="text-info"> {{ detailObj.status | filterStatus }}</span>
        </li>
      </ul>
    </div>
    <div class="main-wrapper">
      <div class="app-container" :class="{ 'app-container-fold': fold }">
        <div class="header-container">
          <div class="header-block">
            <div class="block-title big-size">增值服务资料</div>
            <div class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</div>
          </div>
          <div class="el-form-wrapper" :style="{ height: tableHeight }">
            <div class="tableData">
              <div class="row">
                <div class="title">服务类型</div>
                <div class="content">{{ applyTypeList[detailObj.applyType] }}</div>
                <div class="title">公司名称</div>
                <div class="content">{{ detailObj.companyNameZh }}</div>
              </div>
              <div class="row">
                <div class="title">服务国家</div>
                <div class="content">{{ detailObj.countryNameZh }}</div>
                <div class="title">备注</div>
                <div class="content">{{ detailObj.remark }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-block-wrapper" :class="{ 'info-block-wrapper-fold': fold }">
        <el-tabs class="el-tabs" v-model="tabNav">
          <el-tab-pane name="all" label="全部"></el-tab-pane>
          <el-tab-pane name="serviceInfo" label="服务信息"></el-tab-pane>
          <el-tab-pane name="userInfo" label="用户信息"></el-tab-pane>
          <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
        </el-tabs>
        <div class="info-block" :style="{ height: tableHeight }">
          <template v-if="tabNav === 'all' || tabNav === 'serviceInfo'">
            <div class="block-title">服务信息</div>
            <div class="info-block-item">
              <span class="info-block-title">订单编号：</span>
              <span>{{ detail.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务号：</span>
              <span>{{ detail.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">工单号：</span>
              <span>{{ detailObj.workNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">状态：</span>
              <span>{{ statusList[detail.status] }}</span>
            </div>
            <!-- <div class="info-block-item">
              <span class="info-block-title">服务公司：</span>
              <span>{{custUserInfoVo.enterprise && custUserInfoVo.enterprise.name}}</span>
            </div> -->
            <div class="info-block-item">
              <span class="info-block-title">服务名称：</span>
              <span>{{ applyTypeList[detail.applyType] }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">国家：</span>
              <span>{{ detail.countryNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">创建时间：</span>
              <span>{{ detail.createTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">订单备注：</span>
              <span>{{ detail.disposeResult }}</span>
            </div>
          </template>
          <template v-if="tabNav === 'all' || tabNav === 'userInfo'">
            <div class="block-title">用户信息</div>
            <div class="info-block-item">
              <span class="info-block-title">用户昵称：</span>
              <span>{{ detail.nickname }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">手机号：</span>
              <span>{{ detail.userMobile }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ detail.companyName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">地址：</span>
              <span></span>
            </div>
          </template>
          <OperationLog :activities="activities" v-if="tabNav === 'all' || tabNav === 'operationInfo'" />
        </div>
      </div>
      <NoProcessingRequiredDialog :noProcessingRequiredDialog.sync="noProcessingRequiredDialog" :id="detailObj.id" @goBack="getDetail"></NoProcessingRequiredDialog>
      <CompleteDialog :completeDialog.sync="completeDialog" :id="detailObj.id" @goBack="getDetail"></CompleteDialog>
      <!-- 开始处理 -->
      <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
        <div style="text-align: center; font-size: 20px">
          <span>是否开始处理</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { statusObj, statusList } from './enumObj';
import UploadFile from '@/components/UploadFile/index';
import * as comps from './components/index';
import OperationLog from '@/view/module/newTaxServices/components/OperationLog';
import operationLog from '@/view/module/workOrder/mixin/operationLog';
import { mapMutations } from 'vuex';
import { materialDispenseAPI, taxApplyServicesDetail, materialFinishAPI, materialOnDispenseAPI } from '@/api/newApi/workOrder/valueAddedServices.js';
export default {
  mixins: [operationLog],
  data() {
    return {
      detailObj: this.$route.params.detailObj,
      applyTypeList: {
        1: '英国低税率（保留）',
        9: '英国EORI申请',
        2: '德国EORI申请',
        3: '意大利EORI申请',
        4: '英代DOC申请',
        5: '欧代DOC申请',
        6: '西班牙EORI申请',
        7: '法国EORI申请',
        8: '捷克EORI申请',
      },
      tabNav: 'all',
      statusList: {
        1: '待处理',
        4: '处理中',
        5: '无需处理',
        6: '处理完成',
      },
      detail: {},
      centerDialogVisible: false,
      id: this.$route.params.id,
      status: this.$route.params.status,
      statusObj: statusObj,
      form: {},
      ruleValidate: {},
      noProcessingRequiredDialog: false,
      completeDialog: false,
      initHeight: 42,
      fold: false,
    };
  },
  filters: {
    filterStatus(status) {
      let result = statusList.find((item) => item.value == status);
      return result ? result.label : '';
    },
  },
  components: {
    UploadFile,
    ...comps,
    OperationLog,
  },
  mounted() {
    this.getOperationLog(this.detailObj.applyWorkNo, 3);
    this.getDetail();
    console.log(this.$route.params.detailObj);
  },
  methods: {
    //返回列表页
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/valueAddedServices/index',
      });
    },
    getDetail() {
      taxApplyServicesDetail({ id: this.detailObj.id }).then((res) => {
        if (res.code == 0) {
          this.detail = res.data;
        }
      });
    },

    // 开始处理
    submit() {
      let data = {
        id: this.detailObj.id,
      };
      materialDispenseAPI(data).then((res) => {
        if (res.code == 0) {
          this.centerDialogVisible = false;
          // this.$emit("back");
          this.getDetail();
        }
      });
    },
    // 注销失败
    refundFail() {
      this.$confirm('是否确认退税驳回？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.desc-block {
  background-color: #fff;
  margin: 0 10px;
  border-top: 1px solid #eeeeee;
  padding: 23px 0;
}
.tableData {
  width: 90%;
  margin-left: 30px;
  font-size: 14px;
  border: 1px solid #eeeeee;
  .row {
    display: flex;
    border: 1px solid #eeeeee;
    .title {
      flex: 3;
      padding-left: 20px;
      line-height: 20px;
      border-left: 1px solid #eeeeee;
      border-right: 1px solid #eeeeee;
      background: #fafafa;
    }
    .content {
      flex: 7;
      padding: 10px;
      line-height: 20px;
    }
  }
}
.main-wrapper {
  .back {
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    margin-bottom: 5px;
    cursor: pointer;
  }
  display: flex;
  .app-container {
    width: calc(100% - 410px);
    flex: 0 0 calc(100% - 410px);
    margin-top: 10px;
    transition: all 0.3s ease-in-out;
    &.app-container-fold {
      width: 100%;
      flex: 100%;
      margin-right: -5px;
    }
    .header-container {
      padding-left: 30px;
      padding-right: 30px;
      .header-block {
        display: flex;
        justify-content: space-between;
        padding-bottom: 18px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ebeef5;
        .fold {
          cursor: pointer;
          font-size: 14px;
        }
      }
      .el-form-wrapper {
        height: calc(100vh - 237px);
        overflow-y: auto;
      }
      .tip {
        color: rgb(221, 7, 7);
      }
      .download-block {
        padding: 20px 50px;
        .download-title {
          font-size: 14px;
          padding: 20px 0;
          &::before {
            content: '*';
            color: #f5222d;
            margin-right: 4px;
          }
        }
      }
    }
  }
  .box-card-wrapper {
    margin-top: 10px;
    max-height: calc(100vh - 140px);
    overflow-y: scroll;
    .box-card {
      flex: 1;
      margin-right: 10px;
      width: 300px;
      margin-bottom: 10px;
      .item {
        margin-bottom: 10px;
      }
      .timeline-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2px;
        color: #666;
      }
    }
  }
}
</style>
