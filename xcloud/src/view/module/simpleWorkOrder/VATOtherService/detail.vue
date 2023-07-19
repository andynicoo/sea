<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="ifBack">
        <i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>
        返回列表
      </el-link>
      <div class="header-block" v-if="serviceData.status != 9">
        <el-button :disabled="isCancel" size="small" type="primary" @click="isEdit = true" v-if="!isEdit && showEdit" v-show="hasAuthority(editKey)"> 编辑 </el-button>
        <template v-if="isEdit && showEdit">
          <el-button :disabled="isCancel" @click="(isEdit = false), getInfo()">取消</el-button>
          <el-button :disabled="isCancel" type="primary" @click="submit">保存</el-button>
        </template>
        <el-button :disabled="isCancel" type="primary" v-show="hasAuthority('Z1_20')" @click="rejectDialog = true" v-if="progressBar == progressBarObj.WAIT_REVIEW || progressBar == progressBarObj.PROCESSING"> 驳回 </el-button>
        <el-button :disabled="isCancel" type="primary" v-show="hasAuthority('Z1_21')" @click="submitAudit" v-if="progressBar == progressBarObj.WAIT_UPLOAD"> 提交审核 </el-button>
        <el-button :disabled="isCancel" type="primary" v-show="hasAuthority('Z1_22')" @click="submitServiceProvider" v-if="progressBar == progressBarObj.WAIT_REVIEW"> 提交服务商 </el-button>
        <el-button :disabled="isCancel" type="primary" v-show="hasAuthority('Z1_23')" @click="changeServiceProvider" v-if="progressBar != progressBarObj.CANCEL"> 修改服务商/律师 </el-button>
        <!-- 待处理 -->
        <template v-if="progressBar === progressBarObj.PENDING">
          <el-button :disabled="isCancel" size="small" type="primary" @click="addProgress" v-show="hasAuthority('Z1_16')"> 添加备注 </el-button>
          <!-- <el-button :disabled="isCancel" size="small" type="primary" @click="markProcessing" v-show="hasAuthority('Z1_17')">
            标记处理中
          </el-button> -->
        </template>
        <!-- 处理中 -->
        <template v-if="progressBar === progressBarObj.PROCESSING">
          <el-button :disabled="isCancel" size="small" type="primary" @click="addProgress" v-show="hasAuthority('Z1_16')"> 添加备注 </el-button>
          <el-button :disabled="isCancel" size="small" type="primary" @click="markComplete" v-show="hasAuthority('Z1_18')"> 标记完成 </el-button>
        </template>
      </div>
    </div>
    <div ref="searchBox" class="desc-block">
      <ul class="text-desc dis-flex">
        <li>
          <span class="text-title">国家：</span>
          <span class="text-info">{{ serviceData.countryNameZh }}</span>
        </li>
        <li>
          <span class="text-title">服务名称：</span>
          <span class="text-info">{{ serviceData.serviceName }}</span>
        </li>
        <li>
          <span class="text-title">服务号：</span>
          <span class="text-info">{{ serviceData.serviceNo }}</span>
        </li>
        <li>
          <span class="text-title">服务状态：</span>
          <span class="text-info">{{ serviceData.status | filterStatus }}</span>
        </li>
        <li>
          <span class="text-title">服务商/律师：</span>
          <span class="text-info">{{ serviceData.supplierName || serviceData.attorneyName }}</span>
        </li>
        <li>
          <span class="text-title">服务进度：</span>
          <span class="text-info">{{ progressBar | filterProgressBar }}</span>
        </li>
      </ul>
    </div>
    <div class="main-wrapper">
      <div class="app-container" :class="{ 'app-container-fold': fold }">
        <div class="header-container">
          <div class="header-block">
            <div class="block-title big-size">服务资料</div>
            <div class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</div>
          </div>
          <div class="el-form-wrapper" :style="{ height: tableHeight }">
            <div style="margin-bottom: 30px">
              <div style="margin-bottom: 20px">
                <el-form :model="form" :rules="rules" ref="form">
                  <el-form-item label="公司名称：" prop="companyNameZh">
                    <el-input placeholder="请输入公司名称" v-model="form.companyNameZh" style="width: 300px" :disabled="!isEdit"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="block-title big-size" style="margin-bottom: 20px">服务资料</div>
              <div class="serviceTable">
                <table>
                  <thead>
                    <tr>
                      <th>内容</th>
                      <th>上传文件</th>
                      <th>创建时间</th>
                      <th>创建人</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>资料要求</td>
                      <td>
                        <template v-if="workOrderInfo.referUrl">
                          <span v-for="(file, i) in referFile" :key="i" style="display: flex; align-items: center; margin-left: 20px">
                            <i class="el-icon-document"></i>
                            <el-link target="_blank" :href="file.url" type="primary" class="fileUrl" style="margin-right: 20px">
                              {{ file.name }}
                            </el-link>
                          </span>
                        </template>
                        <span style="color: darkgray" v-else>暂无</span>
                      </td>
                      <td>
                        <span v-if="serviceData.referTime">{{ serviceData.referTime }}</span>
                        <span style="color: darkgray" v-else>暂无</span>
                      </td>
                      <td>
                        <span v-if="workOrderInfo.referOperator">{{ workOrderInfo.referOperator }}</span>
                        <span style="color: darkgray" v-else>暂无</span>
                      </td>
                      <td>
                        <el-button size="small" type="text" @click="UploadDataListingDialog = true" v-show="hasAuthority('Z1_24')" v-if="progressBar == 1 && serviceData.status != 9">
                          <span>上传资料清单</span>
                        </el-button>
                        <template v-else>
                          <el-button type="text" size="small" @click="UploadDataListingDialog = true" v-show="hasAuthority('Z1_25')" v-if="progressBar == 5 && serviceData.status != 9">
                            <span>更改</span>
                          </el-button>
                          <el-button size="small" type="text" @click="materialDown(1)" v-show="hasAuthority('Z1_26')" :disabled="workOrderInfo.referUrl == ''">
                            <span>一键下载</span>
                          </el-button>
                        </template>
                      </td>
                    </tr>
                    <tr v-if="progressBar != 1">
                      <td>客户资料</td>
                      <td>
                        <template v-if="workOrderInfo.materialUrl">
                          <span v-for="(file, i) in materialFile" :key="i" style="display: flex; align-items: center; margin-left: 20px">
                            <i class="el-icon-document"></i>
                            <el-link target="_blank" :href="file.url" type="primary" class="fileUrl" style="margin-right: 20px">
                              {{ file.name }}
                            </el-link>
                          </span>
                        </template>
                        <span style="color: darkgray" v-else>暂无</span>
                      </td>
                      <td>
                        <span v-if="serviceData.submitMaterialTime">{{ serviceData.submitMaterialTime }}</span>
                        <span style="color: darkgray" v-else>暂无</span>
                      </td>
                      <td>
                        <span v-if="workOrderInfo.materialOperator">{{ workOrderInfo.materialOperator }}</span>
                        <span style="color: darkgray" v-else>暂无</span>
                      </td>
                      <td>
                        <el-button size="small" type="text" @click="(uploadCustomerDataDialog = true), (materialData = materialFile)" v-show="hasAuthority('Z1_27')" v-if="progressBar == 5 && serviceData.status != 9" :disabled="!isEdit">
                          <span>上传资料</span>
                        </el-button>
                        <el-button type="text" size="small" @click="materialDown(2)" v-show="hasAuthority('Z1_28')" v-else :disabled="workOrderInfo.materialUrl == ''">
                          <span>一键下载</span>
                        </el-button>
                      </td>
                    </tr>
                    <tr v-if="progressBar == 2 || progressBar == 3">
                      <td>服务回执</td>
                      <td>
                        <template v-if="workOrderInfo.receiptUrl">
                          <span v-for="(file, i) in receiptFile" :key="i" style="display: flex; align-items: center; margin-left: 20px">
                            <i class="el-icon-document"></i>
                            <el-link target="_blank" :href="file.url" type="primary" class="fileUrl" style="margin-right: 20px">
                              {{ file.name }}
                            </el-link>
                          </span>
                        </template>
                        <span style="color: darkgray" v-else>暂无</span>
                      </td>
                      <td>
                        <span v-if="workOrderInfo.receiptTime">{{ workOrderInfo.receiptTime }}</span>
                        <span style="color: darkgray" v-else>暂无</span>
                      </td>
                      <td>
                        <span v-if="workOrderInfo.receiptOperator">{{ workOrderInfo.receiptOperator }}</span>
                        <span style="color: darkgray" v-else>暂无</span>
                      </td>
                      <td>
                        <template v-if="serviceData.status != 9">
                          <el-button size="small" type="text" @click="uploadReceipt = true" v-show="hasAuthority('Z1_29')" v-if="!workOrderInfo.receiptUrl">
                            <span>上传回执</span>
                          </el-button>
                          <el-button type="text" size="small" @click="uploadReceipt = true" v-show="hasAuthority('Z1_30')" v-if="workOrderInfo.receiptUrl">
                            <span>更换回执</span>
                          </el-button>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <template v-if="info.progress && info.progress.length">
              <div class="block-title big-size" style="margin-bottom: 20px">
                备注记录
                <el-tooltip class="item" effect="dark" content="包含历史工单添加的进度记录" placement="right-start">
                  <i class="el-icon-question text-warning"></i>
                </el-tooltip>
              </div>
              <el-table border :data="info.progress">
                <el-table-column align="center" label="序号" width="70">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width="300" label="内容" show-overflow-tooltip prop="progressContent"></el-table-column>
                <el-table-column align="center" label="上传文件" show-overflow-tooltip prop="files">
                  <template slot-scope="{ row }">
                    <span v-for="(file, i) in row.files" :key="i" style="display: flex; align-items: center">
                      <i class="el-icon-document"></i>
                      <el-link target="_blank" :href="file.url" type="primary" class="fileUrl" style="margin-right: 20px">
                        {{ file.name }}
                      </el-link>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" show-overflow-tooltip prop="createTime"></el-table-column>
                <el-table-column align="center" label="创建人" show-overflow-tooltip prop="createName"></el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="{ row }">
                    <el-button size="small" type="text" v-show="hasAuthority('Z1_31')" @click="delRemark(row)">
                      <span>删除</span>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>
      </div>

      <div class="info-block-wrapper" :class="{ 'info-block-wrapper-fold': fold }">
        <el-tabs class="el-tabs" v-model="tabNav">
          <el-tab-pane name="all" label="全部"></el-tab-pane>
          <el-tab-pane name="serviceInfo" label="服务信息"></el-tab-pane>
          <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
        </el-tabs>
        <div class="info-block" :style="{ height: tableHeight }">
          <template v-if="info.serviceInfo && (tabNav === 'all' || tabNav === 'serviceInfo')">
            <div class="block-title">服务信息</div>
            <div class="info-block-item">
              <span class="info-block-title">订单号：</span>
              <span>{{ info.serviceInfo.orderNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务号：</span>
              <span>{{ info.serviceInfo.serviceNo }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">商品名称：</span>
              <span
                >{{ info.serviceInfo.serviceName }}<span v-if="info.serviceInfo.specName">({{ info.serviceInfo.specName }})</span></span
              >
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务进度：</span>
              <span style="color: orange">{{ progressBar | filterProgressBar }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">公司名称：</span>
              <span>{{ info.serviceInfo.companyNameZh }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务商/律师：</span>
              <span>{{ info.serviceInfo.supplierName || info.serviceInfo.attorneyName }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">服务单创建时间：</span>
              <span>{{ info.serviceInfo.createTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">上传资料清单时间：</span>
              <span>{{ info.serviceInfo.referTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">客户提交资料时间：</span>
              <span>{{ info.serviceInfo.submitMaterialTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">提交服务商时间：</span>
              <span>{{ info.serviceInfo.submitServiceTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">标记完成时间：</span>
              <span>{{ info.serviceInfo.completeTime }}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">驳回原因：</span>
              <span style="color: red; cursor: pointer" v-if="info.serviceInfo.rejectReason && progressBar == 5" @click="(checkRejectInfoDialog = true), (rejectReason = info.serviceInfo.rejectReason)"> 【查看】 </span>
            </div>
            <!-- <div class="info-block-item">
              <span class="info-block-title">供应链专员：</span>
              <span>{{info.serviceInfo.supplyChainName}}</span>
            </div>
            <div class="info-block-item">
              <span class="info-block-title">税务经理：</span>
              <span>{{info.serviceInfo.disposeName}}</span>
            </div> -->
          </template>
          <template v-if="tabNav === 'all' || tabNav === 'operationInfo'">
            <div class="block-title">操作记录</div>
            <el-timeline>
              <el-timeline-item v-for="(item, index) in info.records" :key="index + 'records'" placement="top" hide-timestamp>
                <div class="timeline-header">
                  <div>{{ item.createTime }}</div>
                  <div>{{ item.createName }}</div>
                </div>
                <div>{{ item.node }}</div>
                <div>{{ item.instruction }}</div>
              </el-timeline-item>
            </el-timeline>
          </template>
        </div>
      </div>
      <AddProgressDialog :addProgressDialog.sync="addProgressDialog" :id="id" @refresh="getInfo"></AddProgressDialog>
      <ChangeServiceProviderDialog :changeServiceProviderDialog.sync="changeServiceProviderDialog" :ids="ids" :countryName="countryName" :countryCode="countryCode" @refresh="getInfo"></ChangeServiceProviderDialog>
      <RejectDialog :rejectDialog.sync="rejectDialog" :serviceId="workId" :nodeCodeName="progressBar" @refresh="getInfo"></RejectDialog>
      <UploadDataListingDialog :UploadDataListingDialog.sync="UploadDataListingDialog" :ids="ids" @refresh="getInfo" :fileList="referFile"></UploadDataListingDialog>
      <UploadCustomerDataDialog :uploadCustomerDataDialog.sync="uploadCustomerDataDialog" @customerFile="customerFile" :fileList="materialData"></UploadCustomerDataDialog>
      <UploadReceipt :uploadReceipt.sync="uploadReceipt" :id="workId" @refresh="getInfo" :fileList="receiptFile"></UploadReceipt>
      <CheckRejectInfoDialog :checkRejectInfoDialog.sync="checkRejectInfoDialog" :rejectInfo="rejectReason" @refresh="getInfo"></CheckRejectInfoDialog>
    </div>
  </div>
</template>

<script>
import { progressBarObj, progressBarList } from './enumObj';
import * as comps from './components/index';
import { getSimpleWorkOrderInfo, changeStatus, simpleWorkOrderMaterialApi, materialDownApi, delRemarkById } from '@/api/newApi/simpleWorkOrder/otherService.js';
import { mapMutations } from 'vuex';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
export default {
  data() {
    return {
      id: this.$route.query.id || '0',
      workId: '',
      progressBar: '',
      info: {},
      form: {
        companyNameZh: '',
      },
      ruleValidate: {},
      progressBarObj: progressBarObj,
      addProgressDialog: false,
      tabNav: 'all',
      initHeight: 42,
      UploadDataListingDialog: false, // 上传资料清单弹框
      uploadCustomerDataDialog: false, // 上传客户资料弹框
      uploadReceipt: false, // 上传回执
      isEdit: false,
      changeServiceProviderDialog: false, // 更改供应商/律师弹框
      rejectDialog: false,
      rules: {
        companyNameZh: [{ required: true, message: '请填写公司名称', trigger: 'blur' }],
      },
      countryName: '',
      countryCode: '',
      customerDataFile: [],
      ids: [this.$route.query.id],
      checkRejectInfoDialog: false,
      serviceInfo: [],
      workOrderInfo: {},
      rejectReason: '',
      serviceData: {},
      materialData: [],
      fold: false,
    };
  },
  components: { ...comps },
  computed: {
    showEdit() {
      return [this.progressBarObj.WAIT_UPLOAD, this.progressBarObj.PROCESSING, this.progressBarObj.COMPLETE].includes(this.progressBar);
    },
    editKey() {
      return this.progressBar === this.progressBarObj.WAIT_UPLOAD ? 'Z1_19' : 'Z1_32';
    },
    referFile() {
      if (this.workOrderInfo.referUrl && this.workOrderInfo.referName) {
        return this.formatFile(this.workOrderInfo.referUrl, this.workOrderInfo.referName);
      } else {
        return [];
      }
    },
    materialFile() {
      if (this.workOrderInfo.materialUrl && this.workOrderInfo.materialName) {
        return this.formatFile(this.workOrderInfo.materialUrl, this.workOrderInfo.materialName);
      } else {
        return [];
      }
    },
    receiptFile() {
      if (this.workOrderInfo.receiptUrl && this.workOrderInfo.receiptName) {
        return this.formatFile(this.workOrderInfo.receiptUrl, this.workOrderInfo.receiptName);
      } else {
        return [];
      }
    },
  },
  mixins: [isServiceCancel],
  created() {
    this.getInfo();
  },
  filters: {
    filterProgressBar(progressBar) {
      let result = progressBarList.find((item) => item.value === progressBar);
      return result ? result.label : '';
    },
    filterStatus(status) {
      switch (status) {
        case 1:
          return '服务中';
        case 2:
          return '待续费';
        case 3:
          return '税号注销';
        case 4:
          return '已转出';
        case 9:
          return '已取消';
        case 11:
          return '取消中';
        case 10:
          return '封存';
      }
    },
  },
  methods: {
    getInfo() {
      getSimpleWorkOrderInfo(this.id).then((res) => {
        let progress = res.data.progress;
        if (progress && progress.length) {
          progress.forEach((item) => {
            item.files = [];
            if (!item.annexUrl) {
              return;
            }
            let fileUrls = (item.annexUrl || '').split(',');
            let fileNames = (item.annexName || '').split(',');
            for (let i = 0; i < fileUrls.length; i++) {
              item.files.push({
                url: fileUrls[i].replace('http:', 'https:'),
                name: fileNames[i],
              });
            }
          });
        }
        this.info = res.data;
        this.serviceInfo = res.data.records;
        this.progressBar = res.data.serviceInfo.progressBar;
        this.ifCancel(res.data.serviceInfo.status);
        this.workOrderInfo = res.data.workOrderInfo;
        this.workId = res.data.workOrderInfo.id;
        this.form.companyNameZh = res.data.serviceInfo.companyNameZh;
        this.serviceData = res.data.serviceInfo;
        this.countryName = this.serviceData.countryNameZh;
        this.countryCode = this.serviceData.countryCode;
      });
    },
    delRemark(row) {
      const that = this;
      this.$Modal.confirm({
        title: '确认删除？',
        onOk() {
          delRemarkById(row.id).then((res) => {
            console.log(res);
            if (res.code === 0) {
              that.getInfo();
              that.$Message.success('删除成功');
            }
          });
        },
      });
    },
    // 格式化文件
    formatFile(url, name) {
      let files = [];
      let fileUrls = (url || '').split(',');
      let fileNames = (name || '').split(',');
      for (let i = 0; i < fileUrls.length; i++) {
        files.push({
          url: fileUrls[i].replace('http:', 'https:'),
          name: fileNames[i],
        });
      }
      return files;
    },
    // 提交资料
    submit() {
      let data = {
        id: this.workId,
        companyNameZh: this.form.companyNameZh,
        materialName: this.customerDataFile.map((item) => item.name).join(','),
        materialUrl: this.customerDataFile.map((item) => item.url).join(','),
      };
      simpleWorkOrderMaterialApi(data).then((res) => {
        if (res.code === 0) {
          this.$message.success('保存成功！');
          this.isEdit = false;
          this.getInfo();
        }
      });
    },
    // 修改服务商/律师
    changeServiceProvider() {
      if (!this.workOrderInfo.disposeName && this.progressBar == 1) {
        this.$message.warning('该工单还未认领交付专员！');
        return;
      }
      this.changeServiceProviderDialog = true;
    },
    // 上传资料清单
    UploadDataListing() {
      this.UploadDataListingDialog = true;
    },
    // 上传客户资料
    uploadCustomerData() {
      this.uploadCustomerData = true;
    },
    // 下载资料清单
    materialDown(type) {
      let data = {
        id: this.id,
        materialType: type,
      };
      let fileName = '';
      if (type == 1) {
        fileName = fileName = `${this.info.serviceInfo.serviceName}_资料要求`;
      } else {
        fileName = `${this.info.serviceInfo.companyNameZh}_${this.info.serviceInfo.serviceName}_业务资料`;
      }
      materialDownApi(data).then((res) => {
        this.$util.exportFile(res, fileName);
      });
    },
    customerFile(file) {
      this.customerDataFile = file;
      this.workOrderInfo.materialUrl = file.map((item) => item.url).join(',');
      this.workOrderInfo.materialName = file.map((item) => item.name).join(',');
    },
    // 提交审核
    submitAudit() {
      if (!this.info.serviceInfo.companyNameZh) {
        this.$message.warning('请填写公司名称！');
        return;
      }
      if (!this.workOrderInfo.materialName) {
        this.$message.warning('请上传客户资料！');
        return;
      }
      this.$confirm('该工单是否提交审核？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        changeStatus({
          id: this.id,
          progressBar: this.progressBarObj.WAIT_UPLOAD,
          // next: true
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('提交成功');
            this.getInfo();
          }
        });
      });
    },
    // 提交服务商/律师
    submitServiceProvider() {
      this.$confirm('该工单是否提交服务商/律师？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        changeStatus({
          id: this.id,
          progressBar: this.progressBarObj.WAIT_REVIEW,
          // next: true
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('提交成功');
            this.getInfo();
          }
        });
      });
    },
    // 添加进度
    addProgress() {
      if (!this.workOrderInfo.disposeName && this.progressBar == 1) {
        this.$message.warning('该工单还未认领交付专员！');
        return;
      }
      this.addProgressDialog = true;
    },
    // 标记处理中
    // markProcessing() {
    //   if (!this.info.serviceInfo.disposeName) {
    //     this.$message.warning("该工单还未认领税务经理！");
    //     return;
    //   }
    //   this.$confirm("该工单是否标记处理中？", "提示", {
    //     customClass: "custom-confirm",
    //     confirmButtonText: "继续",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //     center: true
    //   }).then(() => {
    //     changeStatus({
    //       id: this.id,
    //       progressBar: this.progressBarObj.PROCESSING
    //     }).then(res => {
    //       if (res.code === 0) {
    //         this.$message.success("标记成功");
    //         this.getInfo();
    //       }
    //     });
    //   });
    // },
    // 标记完成
    markComplete() {
      this.$confirm('该工单是否标记完成？', '提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        changeStatus({
          id: this.id,
          progressBar: this.progressBarObj.PROCESSING,
          // next: true
        }).then((res) => {
          if (res.code === 0) {
            this.$message.success('标记成功');
            this.getInfo();
          }
        });
      });
    },
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/simpleWorkOrder/VATOtherService/index',
      });
    },
    ifBack() {
      if (this.isEdit) {
        this.$confirm('本页面如有填写资料，请先点击页面顶部的保存按钮保存资料，再离开', '温馨提示', {
          customClass: 'custom-confirm',
          confirmButtonText: '我已点保存按钮',
          cancelButtonText: '还没点保存按钮',
          type: 'warning',
          center: true,
        }).then(() => {
          this.back();
        });
      } else {
        this.back();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-table .el-table__header th {
  background-color: #fafafa !important;
}
.main-wrapper {
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
        overflow-y: auto;
        .title {
          font-size: 14px;
          color: #333;
          margin-bottom: 10px;
        }
      }
    }
  }
}

.serviceTable {
  table {
    border-collapse: collapse;
    width: 100%;
    background-color: #fafafa;
  }
  tr {
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    text-align: center;
  }
  th {
    font-size: 14px;
    font-weight: 400;
    color: #666;
    line-height: 14px;
  }
  td,
  th,
  tr {
    border: solid 1px #ebeef5;
  }
  td {
    background: #fff;
    font-size: 14px;
  }
}
.desc-block {
  background-color: #fff;
  margin: 0 10px;
  border-top: 1px solid #eeeeee;
  padding: 23px 0;
}
.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
  color: #666;
}
.fileUrl {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
