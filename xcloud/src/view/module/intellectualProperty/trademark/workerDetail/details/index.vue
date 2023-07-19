<!-- 详情 -->
<template>
  <div class="details-box main">
    <!-- oa详情的文件信息显示 -->
    <div>
      <div class="details-box">
        <p class="file-info-title" v-if="isOaDetail">官方下发文件：</p>
        <div class="info-table" v-if="fileList.length > 0 || modelAuthFlag">
          <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
            <tr class="header">
              <th style="width: 50px">序号</th>
              <th style="width: 210px">官方原文</th>
              <th style="width: 210px">官方翻译件</th>
              <th style="width: 200px">文件类型</th>
              <th style="width: 170px">官方下发日期</th>
              <th style="width: 170px">客户截止日期</th>
              <th style="width: 140px; border-right: none">操作</th>
            </tr>
            <tr v-for="(item, index) in fileList" :key="index">
              <td style="width: 50px">{{ index + 1 }}</td>
              <td style="width: 210px">
                <a v-if="item.fileUrl" :href="replaceHttps(item.fileUrl)" target="_blank" style="color: #00a3ff">{{ initFileName(item.fileUrl) }}（可点击查看）</a>
                <span v-else>-</span>
              </td>
              <td style="width: 200px">
                <a v-if="item.translateFileUrl" :href="replaceHttps(item.translateFileUrl)" target="_blank" style="color: #00a3ff">{{ initFileName(item.translateFileUrl) }}（可点击查看）</a>
                <span v-else> - </span>
              </td>
              <td style="width: 200px">
                {{ item.fileRemark || '-' }}
              </td>
              <td style="width: 170px">{{ (item.officeDate || '').slice(0, 10) || '-' }}<br />{{ (item.officialExpirationDate || '').slice(0, 10) || '-' }}</td>
              <td style="width: 170px">
                {{ (item.lastDealDate || '').slice(0, 10) || '-' }}
                <p class="table-tip" v-if="item.overdue" style="word-break: keep-all; color: red">超过官方截止日期未处理</p>
              </td>
              <td style="width: 140px; border-right: none" class="operation-td">
                <!-- item.status == 14 或 8 为关闭oa的状态 -->
                <div v-if="item.fileType == 21">-</div>
                <!-- oa类型按钮 -->
                <div v-else-if="item.fileType == 3">
                  <!-- <el-link :disabled="isCancel" @click="clickTranslateFunc(item)" v-if="item.status == 3" type="primary" :underline="false" v-show="hasAuthority('U1_4')">翻译OA</el-link> -->
                  <div v-if="item.dispose === 1">
                    <el-link
                      type="primary"
                      :disabled="isCancel"
                      :underline="false"
                      @click="
                        lookTranslateModal = true;
                        clickTranslateInfo(item);
                      "
                      v-if="item.status != 3"
                      v-show="hasAuthority('U1_3')"
                      >查看翻译件</el-link
                    >
                  </div>
                  <div v-else>
                    <el-link
                      type="primary"
                      :disabled="isCancel"
                      :underline="false"
                      @click="
                        lookTranslateModal = true;
                        clickTranslateInfo(item);
                      "
                      v-if="item.status != 3"
                      v-show="hasAuthority('U1_3')"
                      >查看翻译件</el-link
                    >
                    <el-link :disabled="isCancel" type="primary" @click="clickTranslateFunc(item, 2)" :underline="false" v-if="item.status == 4">修改翻译件</el-link>
                  </div>
                  <div v-if="isShowCloseOABtn(item)">
                    <el-link :disabled="isCancel" type="primary" :underline="false" @click="deleteFileFunc(item)" v-show="hasAuthority('U1_8')">删除</el-link>
                  </div>
                  <!-- <div v-if="isShowCloseOABtn(item)">
                    <el-link :disabled="isCancel" type="primary" :underline="false" size="small" @click="openOAFUN(item)" v-show="hasAuthority('U1_11')">关闭OA</el-link>
                  </div> -->
                  <div v-if="item.status == 4 || item.status == 9 || item.status == 5">
                    <el-link @click="updateReplyFile(item)" :disabled="isCancel" type="primary" :underline="false" size="small">上传答复材料</el-link>
                  </div>
                  <el-link :disabled="isCancel" type="primary" :underline="false" v-if="item.status != 8 && item.status != 14" @click="changeFile(item)" v-show="hasAuthority('U1_7')">修改官文</el-link>
                </div>
                <div v-else>
                  <!-- 暂停信  -->
                  <div v-if="item.fileType == 7">
                    <el-link
                      :disabled="isCancel"
                      v-if="item.status == 10 || item.status == 11"
                      @click="
                        stopLetterModal = true;
                        oaFileId = item.id;
                        stopLetterInfo.interpretFileContent = item.interpretFileContent;
                        stopLetterInfo.operateMethod = item.operateMethod;
                      "
                      type="primary"
                      :underline="false"
                      v-show="hasAuthority('U1_5')"
                      >翻译暂停信</el-link
                    >
                    <el-link v-if="item.status == 11" @click="handleCancleStopLetter(item)" :disabled="isCancel" type="primary" :underline="false" v-show="hasAuthority('U1_6')">取消暂停</el-link>
                  </div>
                  <!-- 审查意见的答复函 -->
                  <div v-if="item.fileType == 4">
                    <div
                      @click="
                        lookModal = true;
                        lookModalInfo = item;
                      "
                      v-if="item.status != 3 && item.status != 1 && item.status != 10 && item.status != 11"
                    >
                      <el-link :disabled="isCancel" type="primary" :underline="false" v-show="hasAuthority('U1_3')">查看</el-link>
                    </div>
                  </div>
                  <div v-if="+item.fileType === 25">
                    <div>
                      <el-link :disabled="isCancel" type="primary" :underline="false" @click="viewNoa(item)" v-show="hasAuthority('U1_7')">查看</el-link>
                    </div>
                  </div>
                  <template>
                    <div v-if="showEditAndCancel(item)">
                      <div>
                        <el-link :disabled="isCancel" type="primary" :underline="false" @click="changeFile(item)" v-show="hasAuthority('U1_7')">修改</el-link>
                      </div>
                      <div>
                        <el-link :disabled="isCancel" type="primary" :underline="false" @click="deleteFileFunc(item)" v-show="hasAuthority('U1_8')">删除</el-link>
                      </div>
                    </div>
                  </template>
                </div>
              </td>
            </tr>
            <!-- 商标注册授权书官方文件 -->
            <tr v-for="(item, index) in registrationAuthorizationList" :key="item.columnId">
              <td>{{ fileList.length + index + 1 }}</td>
              <td>
                <a v-if="item.sourceFileUrl" :href="item.sourceFileUrl" target="_blank" style="color: #00a3ff">{{ item.keyLabel }}模板文件（点击下载） </a><br />
                <a v-if="item.fileModelUrl" :href="item.fileModelUrl" target="_blank" style="color: #00a3ff">{{ item.keyLabel }}示例文件（点击查看） </a>
              </td>
              <td>--</td>
              <td>{{ item.keyLabel }}</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
            </tr>
          </table>
        </div>
        <div class="table-bottom-tips" v-if="fileList.length > 0 || modelAuthFlag">
          <span>说明：</span>商标注册过程中，脚本会一直抓取各阶段公布的官方文件；默认是脚本自动执行，爬取官方文件和官方日期后，回传到系统指定商标的官方文件。 因某些客观因素，脚本未抓取到文件，可在系统点击【抓取官方文件】按钮，触发脚本代码，实现官方文件抓取，并回传到系统指定商标的官方文件。
          如脚本抓取异常，可点击【上传官方文件】上传指定文件。
        </div>
        <div class="null-file" v-else>
          <img src="@/assets/images/infoDetail/no-file.svg" alt="" />
          <p class="first-p">暂无文件</p>
          <p>请先上传后再查看</p>
        </div>
      </div>
    </div>
    <!-- 查看OA翻译 -->
    <detail-look-translate v-if="lookTranslateModal" :lookTranslateModal.sync="lookTranslateModal"></detail-look-translate>
    <!-- 查看OA翻译 -->
    <Modal v-model="lookModal" title="查看OA翻译">
      <Form :model="formTrans" label-position="left" :label-width="138" class="formTranslate">
        <FormItem label="是否需要客户处理：">
          <p>{{ lookModalInfo.dispose == 1 ? '无需处理' : lookModalInfo.dispose == 2 ? '需要处理' : '' }}</p>
        </FormItem>
        <FormItem label="" :label-width="0">
          <p class="label-title" style="word-break: break-all; white-space: pre-line; line-height: 1.2">{{ lookModalInfo.disposeRejectReason }}</p>
        </FormItem>
      </Form>
      <p slot="footer"></p>
    </Modal>
    <!-- 左侧  翻译OA -->
    <translation-file v-if="OAtranslateModal" :operateType="operateType" :oAtranslateModal.sync="OAtranslateModal" @noticeSuccess="translationSuccess" :serviceData="serviceData" :id="oaFileId" :helpFileList="helpFileList" :formTrans="formTrans"></translation-file>
    <!-- 翻译暂停信 -->
    <Modal v-model="stopLetterModal" title="翻译暂停信">
      <p class="ivu-form-item-label">翻译暂停信：</p>
      <Input v-model="stopLetterInfo.interpretFileContent" :maxlength="10000" :rows="6" show-word-limit type="textarea" placeholder="请输入暂停信翻译" />
      <p class="ivu-form-item-label" style="margin-top: 16px">操作方案：</p>
      <Input v-model="stopLetterInfo.operateMethod" :maxlength="10000" :rows="6" show-word-limit type="textarea" placeholder="请输入操作方案" />
      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="stopLetterModal = false">取消</el-button>
        <el-button type="primary" @click="saveTranslateStopLetter">确认</el-button>
      </p>
    </Modal>
    <!-- 上传官方文件 -->
    <uploadFileOa v-if="showUploadOaFile" :workOrderId="rowInfo.workOrderId || rowInfo.workId || workOrderInfo.workOrderId" :oaFileId="oaFileId" @cancelOa="cancelOa" :defaultFileList="defaultFileList" :defaultTranslateFileList="defaultTranslateFileList" :nowFileInfo="formFile"></uploadFileOa>
    <!-- 取消工单 -->
    <el-dialog class="closeOA" title="关闭OA" :visible.sync="closeOA.dialogCloseOA" width="30%">
      <div>如果答复审查意见所产生的关联订单未处于已取消或全部退款状态否则将无法关闭</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOA.dialogCloseOA = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOA">确 定</el-button>
      </span>
    </el-dialog>
    <upload-reply-file v-if="uploadReplyShow" :uploadRepalyShow.sync="uploadReplyShow"></upload-reply-file>
    <DialogViewNoa :info="noaInfo" ref="noa" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import * as API from '@/api/newApi/intellectualProperty/oa.js';
import * as trademarkAPI from '@/api/newApi/intellectualProperty/trademark';
import uploadFileOa from '../../../components/uploadFileOa';
import DetailLookTranslate from '../../trademarkComponents/detailLookTranslate/index';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
import { initFileNameFunc, workerFileType } from '../../../util.js';
import DialogViewNoa from '../../components/DialogViewNoa.vue';

export default {
  mixins: [isServiceCancel],
  components: {
    DialogViewNoa,
    uploadFileOa,
    DetailLookTranslate,
    TranslationFile: () => import('../../trademarkComponents/translationOa/index.vue'),
    UploadReplyFile: () => import('@/view/module/intellectualProperty/trademark/workerDetail/uploadReplyFile/index.vue'),
  },
  provide() {
    return {
      oaWorkerInfo: this.getList,
    };
  },
  props: {
    tabs: Number,
    oaFileList: Array,
    registrationAuthorizationList: Array,
  },
  computed: {
    modelAuthFlag() {
      //是否显示授权书模板文件
      return this.registrationAuthorizationList.length > 0 && this.workOrderInfo.authFlag;
    },
  },
  data() {
    return {
      isOaDetail: this.$route.query.isOaDetail,
      serviceId: this.$route.query.serviceId,
      nodeCode: this.$route.query.nodeCode,
      lookTranslateModal: false,
      lookModal: false,
      translateInfo: {},
      lookModalInfo: {},
      fileList: [],
      formTrans: {
        dispose: 2,
      },
      serviceData: [{}],
      rowInfo: {},
      showUploadOaFile: false,
      OAtranslateModal: false,
      stopLetterModal: false,
      closeOA: {
        dialogCloseOA: false,
        playTeply: undefined, //付款答复信息
      },
      stopLetterInfo: {
        interpretFileContent: '',
        operateMethod: '',
      },
      workOrderInfo: {},
      oaFileId: '',
      defaultTranslateFileList: [],
      uploadReplyShow: false,
      noaInfo: {},
    };
  },
  watch: {
    'formTrans.productMoney': function (newVal, oldVal) {
      //限制数字类型
      if (isNaN(newVal)) {
        this.$Message.error('请输入数字');
        return;
      }
    },
    oaFileList() {
      this.getList();
    },
  },

  created() {
    this.getList();
  },
  methods: {
    ...mapMutations(['saveWorkInfo']),
    viewNoa(item) {
      this.noaInfo = { ...item };
      this.$refs.noa.show();
    },
    // 修改、删除按钮的显示
    showEditAndCancel(item) {
      const check = !(this.nodeCode && this.nodeCode === 'NODE0038' && [9, 10, 11, 12].includes(item.fileType)) && item.fileType !== 25;
      return check;
    },
    initFileName: (val) => initFileNameFunc(val),
    clickTranslateFunc(item, type) {
      this.saveWorkInfo(item);
      this.OAtranslateModal = true;
      this.oaFileId = item.id;
      this.formTrans = {
        interpretFileContent: item.interpretFileContent,
        isNeedPay: item.isNeedPay,
        productMoney: item.productMoney,
        orderNo: item.orderNo,
        dispose: item.dispose,
        customerExpiryDate: item.lastDealDate,
      };
      // this.getProduct();
      this.helpFileList = [];
      if (item.hlepDocument != '[]' && item.hlepDocument != '') {
        let helpDocument = JSON.parse(item.hlepDocument);
        helpDocument.map((i) => {
          let obj = {
            name: i.oldFileName,
            url: i.fileUrl,
          };
          this.helpFileList.push(obj);
        });
      }
      this.operateType = type;
    },
    /**查看 */
    clickTranslateInfo(item) {
      this.translateInfo = item;
      this.saveWorkInfo(item);
    },

    updateReplyFile(item) {
      this.saveWorkInfo(item);
      this.uploadReplyShow = true;
    },

    isShowCloseOABtn(item) {
      let serviceProgress = [3, 4, 5, 9, 12];
      return Boolean(item && serviceProgress.find((i) => i == item.status));
    },
    /**
     * 打开oa工单
     */
    openOAFUN(data) {
      this.closeOAitem = data;
      this.closeOA.playTeply = undefined;
      this.closeOA.dialogCloseOA = true;
    },

    /**
     * 确认关闭OA工单
     */
    async handleCloseOA() {
      let prams = {
        serviceId: this.serviceId || this.$route.query.servicesId,
        workOrderId: this.workOrderInfo.workOrderId,
        workOaId: this.closeOAitem.id,
      };
      try {
        let { code, message } = await API.closeOaAPI(prams);
        if (code == 0) {
          this.$Message.success('取消工单成功');
          this.getList();
        } else {
          this.$Message.error(message);
        }
        this.closeOA.dialogCloseOA = false;
      } catch (error) {
        this.$Message.error(error);
      }
    },
    /**
     * 修改
     */
    changeFile(item) {
      console.log(item);
      this.oaFileId = item.id;
      this.formFile = {
        fileType: item.fileType,
        fileUrl: item.fileUrl,
        officialDate: item.officeDate,
        officialExpirationDate: item.officialExpirationDate,
        lastDealDate: item.lastDealDate,
        translateFileUrl: item.translateFileUrl,
      };
      this.defaultFileList = [];
      let file = {
        name: this.initFileName(item.fileUrl),
        url: item.fileUrl,
      };
      if ([9, 10, 11, 12].includes(item.fileType)) {
        this.defaultTranslateFileList = [
          {
            name: this.initFileName(item.translateFileUrl),
            url: item.translateFileUrl,
          },
        ];
      }
      this.defaultFileList.push(file);
      this.showUploadOaFile = true;
    },

    deleteFileFunc(item) {
      this.$confirm(setcontent(), '删除文件', {
        customClass: 'custom-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
          API.delFileOaAPI({ oaFileId: item.id }).then((res) => {
            if (res.code == 0) {
              this.$Message.info('删除成功');
              this.getList();
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });

      function setcontent() {
        let text = workerFileType(item.fileType);
        if (text == '审查意见（OA）') {
          return '如果答复审查意见所产生的关联订单未处于已取消或全部退款状态否则将无法关闭';
        } else {
          return `确认删除${text}吗？`;
        }
      }
    },

    saveTranslateStopLetter() {
      this.$confirm('请确认录入的信息是否无误？', '温馨提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
        .then(() => {
          let data = { ...this.stopLetterInfo };
          data.oaFileId = this.oaFileId;
          API.translateStopLetterAPI(data).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
              });
              this.getList();
              this.stopLetterModal = false;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleCancleStopLetter(item) {
      this.$confirm('取消暂停，商标将恢复正常审查状态。你确定吗？', '温馨提示', {
        customClass: 'custom-confirm',
        confirmButtonText: '保留暂停',
        cancelButtonText: '取消暂停',
        type: 'warning',
        center: true,
      })
        .then(() => {
          API.cancelLetterAPI({ oaFileId: item.id }).then((res) => {
            if (res.code == 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
              });
              this.getList();
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    cancelOa(val) {
      this.showUploadOaFile = false;
      this.getList();
    },

    /**上传翻译件成功 */
    translationSuccess() {
      this.getList();
    },
    async getList() {
      // 是国际商标详情还是OA
      let requsetData = undefined;
      if (this.isOaDetail) {
        requsetData = await API.oaWorkorderDetailAPI({ serviceId: this.serviceId });
      } else {
        requsetData = await trademarkAPI.workorderDetailAPI({
          // nodeCode: this.nodeCode,
          serviceId: this.serviceId,
        });
      }
      if (requsetData) {
        const {
          code,
          data: { fileOaWorkOrderList, trademarkOrderServiceInfoVO },
        } = requsetData;
        if (code == 0) {
          this.fileList = fileOaWorkOrderList;
          this.workOrderInfo = trademarkOrderServiceInfoVO;
          this.ifCancel(trademarkOrderServiceInfoVO.status);
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import url('../index.less');
.main {
  min-width: 950px;
}
</style>
