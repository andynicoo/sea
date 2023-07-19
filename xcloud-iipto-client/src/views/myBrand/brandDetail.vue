<template>
  <div class="container">
    <p class="title" @click="goBack" style="cursor: pointer">
      <img src="@/assets/images/infoDetail/jiantou-zuo.png" alt="" />商标信息
    </p>

    <div class="notice-box" v-if="tabs == 1 && judgment('status', [5, 9, 12, 15, 17])">
      <img src="@/assets/images/infoDetail/yellowTip.svg" alt="" />您有待处理的官方文件，
      <span @click="tabs = 2">立即处理<img src="@/assets/images/infoDetail/blueDeal.svg" alt=""/></span>
    </div>
    <div class="tab-box clearfix">
      <span class="tab-span" @click="tabs = 1" :class="tabs == 1 ? 'tab-active' : ''">商标信息</span>
      <span class="tab-span" @click="tabs = 2" :class="tabs == 2 ? 'tab-active' : ''">官方文件</span>
      <span class="tab-span" @click="tabs = 3" :class="tabs == 3 ? 'tab-active' : ''">我的文件</span>
    </div>
    <div style="display: flex; margin: 20px 0 -10px 0">
      <Button
        class="fill-btn"
        v-if="
          cureentNodeCode != 'NODE0033' &&
            cureentNodeCode != 'NODE0034' &&
            cureentNodeCode != 'NODE0035' &&
            (serciveInfo.verificationStatus == 0 || serciveInfo.verificationStatus == 3)
        "
        @click="fillVerificationCodeFunc"
        >{{ fillButtonText }}</Button
      >
      <Button class="fill-btn disabled" v-if="formInfo.acceptNum != '' && serciveInfo.verificationStatus == 1"
        >获取验证码中</Button
      >
      <!--平台审核-签署授权书和驳回: cureentNodeCode === 'NODE0035' && [4,6].includes(serciveInfo.progressBar) -->
      <Button
        v-if="tabs === 2 && cureentNodeCode === 'NODE0035' && [4, 6].includes(serciveInfo.serviceProgress)"
        class="fill-btn"
        @click="uploadAuthorization(true, { servicesId, cureentNodeCode })"
        >上传授权书</Button
      >
      <Update
        v-if="formInfo.acceptNum != '' && serciveInfo.verificationStatus == 1"
        :id="serciveInfo.amazonanswerFileListId"
      />
    </div>
    <div v-if="tabs == 1">
      <div class="sure-proof-box" v-if="serciveInfo.subNodeCode == 'NODE0042' && serciveInfo.evidenceType != 2">
        <p class="tip">
          *
          您购买的美国商标注册（顾问），使用证据已制作完成，请认真阅读下述信息，并点击下方的按钮【确认证据无误】或【证据有误，重做】。
        </p>
        <div class="sure-wrong">
          <span class="sure-box" @click="sureReject(5)">
            <Button type="primary" class="sure">确认证据无误</Button>
            <span class="down-time">{{ countDown }}</span>
          </span>
          <Button type="primary" class="wrong-box" @click="rejectModal = true">证据有误，重做</Button>
        </div>
      </div>
      <div class="brand-detail-info">
        <!-- 商标注册信息 -->
        <div>
          <h2 class="module-name"><b></b>商标注册信息</h2>
          <table class="data-preparation-list">
            <tr>
              <td class="upload-files-label">受理号</td>
              <td class="upload-files-item">
                <div>{{ this.serciveInfo.acceptNum || '暂无数据' }}</div>
              </td>
            </tr>
            <tr>
              <td class="upload-files-label">备案验证码</td>
              <td class="upload-files-item">
                <div>{{ this.serciveInfo.verificationCode || '暂无数据' }}</div>
              </td>
            </tr>
            <tr>
              <td class="upload-files-label">注册号</td>
              <td class="upload-files-item">
                <div>{{ this.serciveInfo.registerNo || '暂无数据' }}</div>
              </td>
            </tr>
          </table>
        </div>
        <DataPreviews
          :cureentNodeCode="cureentNodeCode"
          :servicesId="servicesId"
          :countryCode="serciveInfo.countryCode"
        ></DataPreviews>
      </div>
      <div class="button-box">
        <Button @click="goBack" class="back-button">返回</Button>
      </div>
    </div>
    <div v-if="tabs == 2">
      <div class="info-table" style="margin-top: 24px" v-if="fileList.length > 0 || modelAuthFlag">
        <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
          <tr class="header">
            <th style="width: 50px">序号</th>
            <th style="width: 290px">官方原文</th>
            <th style="width: 190px">官方翻译件</th>
            <th style="width: 200px">文件类型</th>
            <!-- <th style="width: 170px">状态</th> -->
            <th style="width: 170px">处理截止日期</th>
            <th style="width: 140px; border-right: none">操作</th>
          </tr>

          <tr v-for="(item, index) in fileList" :key="index">
            <td style="width: 68px">{{ index + 1 }}</td>
            <template v-if="item.fileType === 15">
              <td style="width: 210px">
                <a :href="item.authorizationTemplateFile" target="_blank" style="color: #00a3ff"
                  >授权书模板文件（点击下载）
                </a>
              </td>
              <td style="width: 190px">
                <a :href="item.authorizationExampleFile" target="_blank" style="color: #00a3ff"
                  >授权书示例文件（点击查看）</a
                >
              </td>
            </template>
            <template v-else>
              <!-- 官方原文 -->
              <td style="width: 210px">
                <a :href="replaceHttps(item.fileUrl)" target="_blank" style="color: #00a3ff"
                  >{{ initFileNameFunc(item.fileUrl) }}（可点击查看）
                </a>
              </td>
              <!-- 官方翻译件 -->
              <td style="width: 190px">
                <a
                  v-if="item.translateFileUrl"
                  :href="replaceHttps(item.translateFileUrl)"
                  target="_blank"
                  style="color: #00a3ff"
                  >{{ initFileNameFunc(item.translateFileUrl) }}（可点击查看）</a
                >
                <span v-else> - </span>
              </td>
            </template>
            <!-- 文件类型 -->
            <td style="width: 170px">
              {{ item.fileRemark || '无' }}
            </td>
            <!-- 状态 -->
            <!-- <td style="width: 170px">{{ setStatus(item.status) || '无' }}</td> -->
            <!-- 处理截止日期 -->
            <td style="width: 180px; padding: 0 6px" v-if="item.lastDealDate || item.officialExpirationDate">
              {{
                item.lastDealDate.slice(0, 10) || $moment(item.officialExpirationDate).format('YYYY-MM-DD') || '无'
              }}&nbsp;<Tooltip placement="top" max-width="500px" :content="getTimeTips(item)"
                ><Icon
                  size="16"
                  color="#F0B955"
                  type="ios-information-circle"
                  style="cursor: pointer; transform: rotate(180deg)"
              /></Tooltip>
            </td>
            <td v-else>-</td>
            <!-- 操作 -->
            <td class="handle-td" style="width: 170px; border-right: none">
              <template v-if="item.fileType !== 21 && item.fileType !== 22">
                <span v-if="+item.status === 15 && +item.fileType === 15">
                  <a @click="useReceptModal(item)" href="javascript:void(0);">上传授权书</a>
                </span>
                <span v-else-if="[5, 9, 17].includes(item.status)">
                  <a :disabled="isCancel" @click="useReceptModal(item)">答复审查意见</a>
                </span>
                <span v-else-if="[4, 12].includes(item.status)">
                  <a
                    v-if="[4, 12].includes(item.status)"
                    :disabled="isCancel"
                    @click="
                      userAbandonTeply.abandonTeplyModel = true;
                      setOaDetailInfo(item);
                    "
                  >
                    放弃答复
                  </a>
                </span>
                <a
                  :disabled="isCancel"
                  v-else-if="item.status == 11"
                  @click="
                    pauseModal = true;
                    stopLetterInfo = item;
                  "
                  >暂停信</a
                >
                <a
                  v-else-if="+item.fileType === 25 && ['NODE0139', 'NODE0140'].includes(cureentNodeCode)"
                  @click="toFillIn(item)"
                  >填写使用证据</a
                >
                <span v-else-if="!item.rejectReason.length">-</span>
                <span v-if="item.rejectReason.length && +item.fileType !== 25"
                  ><a :disabled="isCancel" @click="showReason(item, index)">驳回原因 </a>
                </span>
              </template>
              <template v-if="serciveInfo.productFunctionCode === 61 && (item.fileType === 21 || item.fileType === 22)">
                <a
                  v-if="serciveInfo.nodeCode === 'NODE0035'"
                  @click="handleSendData({ ...item, trademarkType: 1, workOrderId: serciveInfo.workOrderId })"
                  >下载资料</a
                >
                <a
                  v-if="
                    (serciveInfo.nodeCode === 'NODE0036' && serciveInfo.serviceProgress === 8) ||
                      (serciveInfo.nodeCode === 'NODE0037' && serciveInfo.serviceProgress === 8)
                  "
                  @click="handleSendData({ ...item, trademarkType: 2, workOrderId: serciveInfo.workOrderId })"
                  >下载资料</a
                >
              </template>
              <MadalCauseReject ref="reason" :info="item" @rePlay="rePlay" />
            </td>
          </tr>
          <!-- 商标注册授权书官方文件 -->
          <tr v-for="(item, index) in registrationAuthorizationList" :key="item.columnId">
            <td>{{ fileList.length + index + 1 }}</td>
            <td>
              <a v-if="item.sourceFileUrl" :href="item.sourceFileUrl" target="_blank" style="color: #00a3ff"
                >{{ item.keyLabel }}模板文件（点击下载） </a
              ><br />
              <a v-if="item.fileModelUrl" :href="item.fileModelUrl" target="_blank" style="color: #00a3ff"
                >{{ item.keyLabel }}示例文件（点击查看）
              </a>
            </td>
            <td>--</td>
            <td>{{ item.keyLabel }}</td>
            <td>--</td>
            <td>--</td>
          </tr>
        </table>
      </div>
      <div class="null-file" v-else>
        <img src="@/assets/images/infoDetail/no-file.svg" alt="" />
        <p class="first-p">暂无文件</p>
        <p>暂无文件，您可以过几天再来看看</p>
      </div>
    </div>
    <div v-if="tabs == 3">
      <div class="info-table" style="margin-top: 24px" v-if="answerFileList.length > 0 || userAuthFlag">
        <table style="width: 100%; text-align: center" cellpadding="0" cellspacing="0">
          <tr class="header">
            <th style="width: 68px">序号</th>
            <th style="width: 310px">文件</th>
            <th style="width: 170px">上传时间</th>
            <th style="width: 200px; border-right: none">备注</th>
          </tr>
          <tr v-for="(item, index) in answerFileList" :key="index">
            <td style="width: 68px">{{ index + 1 }}</td>
            <td style="width: 310px">
              <a
                :href="replaceHttps(item.fileType == 15 ? item.authorizationFile : item.answerFile)"
                target="_blank"
                style="color: #00a3ff"
                >{{ initFileNameFunc(item.fileType == 15 ? item.authorizationFile : item.answerFile) }}（可点击查看）</a
              >
            </td>
            <td style="width: 170px">
              {{
                item.fileType == 15
                  ? item.uploadAuthorizationFileTime.slice(0, 10)
                  : item.uploadAnswerFileTime.slice(0, 10) || '无'
              }}
            </td>
            <td style="width: 200px; border-right: none">
              {{ item.fileRemark }}
            </td>
          </tr>
          <!-- 商标注册授权书我的文件 -->
          <template v-if="userAuthFlag">
            <tr v-for="(item, index) in registrationAuthorizationList" :key="item.columnId">
              <td>{{ answerFileList.length + index + 1 }}</td>
              <td>
                <a
                  v-if="item.keyNameValue && JSON.stringify(item.keyNameValue) !== '{}'"
                  :href="item.keyNameValue"
                  target="_blank"
                  style="color: #00a3ff"
                  >{{ item.keyLabel }}（点击查看）
                </a>
              </td>
              <td>--</td>
              <td>--</td>
            </tr>
          </template>
        </table>
      </div>
      <div class="null-file" v-else>
        <img src="@/assets/images/infoDetail/no-file.svg" alt="" />
        <p class="first-p">暂无文件</p>
        <p>暂无文件，您还没上传材料</p>
      </div>
    </div>
    <Modal v-model="pauseModal">
      <div class="tipsModal-title">暂停信</div>
      <div class="modal-contnet">
        <div class="notice-content">
          <p class="title">暂停审查通知：</p>
          <p>{{ stopLetterInfo.interpretFileContent }}</p>
        </div>
        <div class="notice-content">
          <p class="title">操作方案：</p>
          <p>{{ stopLetterInfo.operateMethod }}</p>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" class="footer-btn" @click="pauseModal = false">知道了</Button>
      </div>
    </Modal>
    <Modal v-model="receptModal" :width="560">
      <div class="tipsModal-title">答复审查意见</div>
      <div class="modal-contnet" v-if="JSON.stringify(oaDetailInfo) != '{}'">
        <p class="recept-explain">
          注意：请于<span style="color: #00a3ff"> {{ oaDetailInfo.lastDealDate.slice(0, 10) }} </span
          >日内进行答复，逾期视为主动放弃处理
        </p>
        <div class="notice-content">
          <p class="title">官方翻译:</p>
          <span style="white-space: pre">{{ oaDetailInfo.interpretFileContent }}</span>
        </div>
        <div class="help-box" v-if="oaDetailInfo.hlepDocument">
          <span>帮助文档：</span>
          <div>
            <p v-for="(item, index) in JSON.parse(oaDetailInfo.hlepDocument)" :key="index">
              <a :href="item.fileUrl" target="_blank">{{ index + 1 }}、{{ item.oldFileName }}</a>
            </p>
          </div>
        </div>
        <div class="handle-box">
          <p class="title">处理流程：</p>
          <img src="@/assets/images/infoDetail/accetp-fllow.svg" alt="" />
          <div class="flex-between">
            <span>确认答复</span>
            <span>选择答复方案</span>
            <span>缴费（免费，则跳过）</span>
            <span>上传材料</span>
            <span style="margin-left: 8px">律师答复商标局</span>
          </div>
        </div>
        <div class="pay-explain">
          <p class="title">缴费说明：</p>
          <p class="content">
            您收到商标局驳回的审查意见，需要由律师撰文答复商标局，涉及答辩的商标申请，跨标云将会根据难易程度评定，需缴纳一定的官费或律师代理费用。
          </p>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" class="footer-btn" @click="sureReceptFunc">确认答复</Button>
      </div>
    </Modal>
    <Modal v-model="uploadModal" :width="560">
      <div class="tipsModal-title">上传材料</div>
      <div class="modal-contnet">
        <div class="notice-content">
          <p class="title">官方翻译:</p>
          <span style="white-space: pre">{{ oaDetailInfo.interpretFileContent }}</span>
        </div>
        <div class="notice-content">
          <p class="title">答复建议:</p>
          <span v-for="(item, index) in trademarkReplyPlanData" :key="index" style="white-space: pre">{{
            item.planInfo != '' ? JSON.parse(item.planInfo).replyStr : '暂无答复建议'
          }}</span>
        </div>
        <div>
          <p v-show="oaDetailInfo.rejectReason">驳回原因:{{ oaDetailInfo.rejectReason }}</p>
        </div>
        <div class="help-box" v-if="oaDetailInfo.hlepDocument">
          <span class="title">帮助文档：</span>
          <div>
            <p v-for="(item, index) in JSON.parse(oaDetailInfo.hlepDocument)" :key="index">
              <a :href="item.fileUrl" target="_blank">{{ index + 1 }}、{{ item.oldFileName }}</a>
            </p>
          </div>
        </div>
        <p class="tips">请将文件打包到一个压缩包后，再上传</p>
        <Upload
          class="upload-box"
          :max-size="30 * 1024"
          :before-upload="beforeUploadAccept"
          :on-format-error="formatErrorHandler"
          :on-success="
            (res, file, fileList) => {
              successHandler(res, file, fileList);
            }
          "
          :on-remove="
            (file, fileList) => {
              removeHandler(file, fileList);
            }
          "
          :format="['rar', 'zip']"
          :action="uploadUrl"
        >
          <div class="uploads"><img src="@/assets/images/infoDetail/upload.png" alt="" />上传文件</div>
        </Upload>
        <!-- 备注信息 -->
        <div class="remark-box">
          <p class="title">备注信息：</p>
          <Input
            type="textarea"
            v-model="receptRemark"
            placeholder="请输入备注信息,如果需要进行文字信息确认，可在此信息框中输入确认"
          ></Input>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" class="footer-btn" @click="sureReceptFileFunc">确认提交</Button>
      </div>
    </Modal>
    <Modal v-model="rejectModal">
      <div class="tipsModal-title">驳回原因</div>
      <div class="modal-contnet">
        <Select
          v-model="evidenceCustomerconfirm.trademarkWorkOrderStatus"
          style="height: 34px"
          placeholder="请选择驳回原因"
        >
          <Option value="使用证据错误，商标信息无误">使用证据错误，商标信息无误</Option>
          <Option value="商标名称、logo图错误/申请人错误/其他">商标名称、logo图错误/申请人错误/其他</Option>
        </Select>
        <Input
          v-model="evidenceCustomerconfirm.evidenceCustomerRejectInfo"
          type="textarea"
          :maxlength="500"
          :rows="8"
          style="margin-top: 20px"
          placeholder="输入详细内容
参考示例：
1、首次使用日期应该是2021年05月01日；
2、产品图与注册的商标类目不符；"
        ></Input>
      </div>
      <div slot="footer" class="reject-fotter">
        <Button class="footer-cancel-btn" @click="rejectModal = false">取消</Button>
        <Button type="primary" class="footer-sure-btn" @click="sureReject()">确认</Button>
      </div>
    </Modal>
    <Modal v-model="userAbandonTeply.abandonTeplyModel" :width="410">
      <div class="tipsModal-title">放弃答复审查意见</div>
      <div class="modal-contnet">
        <div class="oaAbandontips">
          <img src="@/assets/images/common/yellowTip.png" />
          放弃答复审查意见后，有可能会导致商标注册失败
        </div>
        <Input
          class="oaAbandonTextarea"
          maxlength="200"
          show-word-limit
          v-model="userAbandonTeply.abandonOaText"
          type="textarea"
          :rows="4"
          placeholder="请输入拒绝答复的原因"
        />
      </div>

      <div slot="footer" class="reject-fotter">
        <Button class="footer-cancel-btn" @click="userAbandonTeply.abandonTeplyModel = false">取消</Button>
        <Button type="primary" class="footer-sure-btn" @click="aoAbandon()">确认</Button>
      </div>
    </Modal>
    <!-- 选择答复方案弹窗 -->
    <ReplyPlanModal
      v-if="replyPlanModal"
      :oaDetailInfo="oaDetailInfo"
      @changeState="closeReplyPlan"
      @answerFreeFunc="answerFreeFunc"
    ></ReplyPlanModal>
    <!-- 答复审查意见（未支付） -->
    <ModalAnswerPaid
      ref="answerPaid"
      :list="hasPaidPlanInfo.list"
      :playInfo="hasPaidPlanInfo.playInfo"
      :replyId="hasPaidPlanInfo.replyId"
      @update="getDetailFun"
    />
    <!-- 答复审查意见（已支付） -->
    <ModalAnswerNoPay ref="answerNoPay" @update="getDetailFun" />
    <!-- 答复意见上传授权书 -->
    <ModalUploadAuth ref="uploadAuth" @update="getDetailFun" />
    <!-- 商标注册上传授权书 -->
    <UploadAuthorizationLetter
      :currRow="currRow"
      @uploadAuthorization="uploadAuthorization"
      @getList="getDetailFun"
      v-if="uploadAuthorizationLetterVisiale"
    />
    <!-- 发送资料公共弹窗 -->
    <SendDataDialog
      :item="currentItem"
      :visible="sendDialogVisible"
      @cancel="sendDialogVisible = false"
      @fetch="getDetailFun()"
    />
  </div>
</template>
<script>
import {
  trademarkDetailApi,
  answerOaApi,
  answerOaMaterialsApi,
  applyAmazonFilingCodeApi,
  getOaReplyPlanAndEvidenceApi,
} from '@/api/breadInfoDetail';
import SendDataDialog from '../../../xcloud-client-components-web/module/components/sendDataDialog';
import { updateNodeAPI } from '@/api/trademarkRegister/myBread';
import Update from './component/update.vue';
import MadalCauseReject from './component/modalCauseReject.vue';
import DataPreviews from '@/components/DynamicForm/dataPreviews.vue';
import isServiceCancel from '@/mixin/isServiceCancel';
import ModalAnswerPaid from './component/modalAnswerPaid.vue';
import ModalAnswerNoPay from './component/modalAnswerNoPay.vue';
import ModalUploadAuth from './component/modalUploadAuth.vue';
import { mapMutations, mapState } from 'vuex';
import moment from 'moment';

export default {
  props: {
    servicesId: [String, Number],
    cureentNodeCode: [String, Number],
    tabIndex: [String, Number],
    form: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ReplyPlanModal: () => import('./replyPlanModal'),
    Update,
    DataPreviews,
    MadalCauseReject,
    ModalAnswerPaid,
    ModalAnswerNoPay,
    ModalUploadAuth,
    SendDataDialog,
  },
  mixins: [isServiceCancel],
  data() {
    return {
      trademarkReplyPlanData: [],
      formInfo: {},
      useEvidenceList: [],
      usrProductImgList: [],
      marketHrefList: [],
      tabs: 1,
      serciveInfo: {},
      fileList: [],
      trademarkCategoryList: [],
      pauseModal: false,
      receptModal: false,
      uploadModal: false,
      replyPlanModal: false,
      oaDetailInfo: {},
      stopLetterInfo: {},
      helpContent: [],
      receptFile: '',
      receptRemark: '',
      answerFileList: [],
      fillButtonText: '申请备案验证码',
      workflowColumns: [],
      oaFileList: [],
      marketHrefList: [],
      workOrderId: '',
      workOrderNo: '',
      // 使用证据
      rejectModal: false,
      evidenceCustomerconfirm: {
        trademarkWorkOrderStatus: '',
        evidenceCustomerRejectInfo: '',
      },
      countDownTime: false,
      countDown: '',
      userAbandonTeply: {
        abandonTeplyModel: false, // 取消答复
        abandonOaText: '', // 用户取消答复oaText
      },
      hasPaidPlanInfo: {},
      detailItem: {},

      uploadAuthorizationLetterVisiale: false,
      currRow: '',
      registrationAuthorizationList: [],
      currentItem: {},
      sendDialogVisible: false,
    };
  },
  computed: {
    ...mapState({
      brandItem: (state) => state.breadcrumb.brandItem,
    }),
    modelAuthFlag() {
      //是否显示授权书模板文件
      return this.registrationAuthorizationList.length > 0 && this.serciveInfo.authFlag;
    },
    userAuthFlag() {
      //是否显示用户上传授权书
      if (this.serciveInfo.nodeCode === 'NODE0035') {
        return (
          this.registrationAuthorizationList.length > 0 &&
          ![1, 4].includes(this.serciveInfo.serviceProgress) &&
          this.serciveInfo.authFlag
        );
      }
      return this.registrationAuthorizationList.length > 0 && this.serciveInfo.authFlag;
    },
  },

  methods: {
    ...mapMutations(['setOaDetailInfo', 'setUserAnswerInfo', 'setUserOaPlan']),
    getTimeTips(item) {
      if (this.serciveInfo) {
        if (+this.serciveInfo.productFunctionCode === 62) {
          return '如果未在截止日期内宣誓，商标将会失效；如果您暂时不能提供证据，可联系专属客服申请延期提交使用证据，延期会产生额外的费用';
        } else {
          return `请在截止时间之前${
            item.fileType === 15 ? '上传授权书' : '提交答复材料'
          }，逾期未提交视为主动放弃答复，会直接导致商标注册失败`;
        }
      }
    },
    setStatus(data) {
      const stautsEM = [
        '正常', // 1
        '被驳回', // 2
        '待翻译OA', // 3
        '已翻译审查意见', // 4
        '待提交答复材料', // 5
        '平台审核', // 6
        '律师审核', // 7
        '已答复审查意见', // 8
        '答复材料有误', // 9
        '收到暂停信', // 10
        '已翻译暂停信', // 11
        '待客户付款', // 12
        '待上传OA文件', // 13
        '取消答复审查意见', // 14
        '待上传授权书', // 15
        '待授权确认', // 16
        '待上传材料', // 17
      ];
      return stautsEM[data - 1];
    },
    closeReplyPlan(val) {
      this.replyPlanModal = val;
    },
    /**
     * 用户取消答复oa
     */
    aoAbandon() {
      let text = this.userAbandonTeply.abandonOaText;
      if (text.length == 0) {
        this.$Message.warning('请先填写放弃答复的原因');
      } else {
        this.materialsApiFun(text);
      }
    },

    async clickUploadModal(item) {
      this.uploadModal = true;
      this.oaDetailInfo = item;
      let { code, data } = await getOaReplyPlanAndEvidenceApi(item.id);
      if (code == 0) this.trademarkReplyPlanData = data.trademarkReplyPlan;
    },

    /**
     * 取消答复
     */
    async materialsApiFun(operateReason) {
      try {
        let parms = {
          operateReason,
          serviceId: this.servicesId,
          workOaId: this.oaDetailInfo.id,
          workOrderId: this.workOrderId,
        };
        let { code, message } = await materialsApi(parms);
        if (code == 0) {
          this.$Message.success('成功取消答复');
          this.$forceUpdate();
        } else {
          this.$Message.error(message);
        }
        this.userAbandonTeply.abandonTeplyModel = false;
      } catch (error) {
        // this.$Message.error("放弃答复错误,请联系管理员");
      }
    },

    showCNItem(list) {
      return !!(list && list.findIndex((item) => item.category2Name) == -1);
    },
    /**
     * 查看文件状态
     * parms 字段名
     */
    judgment(parm, val) {
      let data = this.oaFileList && this.oaFileList.some((item) => val.includes(item[parm]));
      return data;
    },
    // 获取工单资料
    getDetailFun() {
      let data = {
        serviceId: this.servicesId,
        nodeCode: this.cureentNodeCode,
      };
      trademarkDetailApi(data)
        .then((res) => {
          if (res.code == 0) {
            this.registrationAuthorizationList = [];
            this.workflowColumns = res.data.workflowColumns;
            this.serciveInfo = res.data.trademarkOrderServiceInfoVO;
            this.ifCancel(res.data.trademarkOrderServiceInfoVO.status);
            this.oaFileList = res.data.fileOaWorkOrderList;
            this.workOrderId = res.data.trademarkOrderServiceInfoVO.workOrderId;
            this.workOrderNo = res.data.trademarkOrderServiceInfoVO.workOrderNo;
            this.registrationAuthorizationList = [];
            this.workflowColumns.forEach((modules) => {
              modules.columns.forEach((columns) => {
                //上传授权书 固定三个字段
                if (
                  ['registrationAuthorization', 'registrationAuthorization2', 'registrationAuthorization3'].includes(
                    columns.keyName
                  )
                ) {
                  this.registrationAuthorizationList.push(columns);
                }
              });
            });
          }
        })
        .finally(() => {
          this.initDataFunc();
          const { subNodeCode, subServiceProgress, evidenceType } = this.serciveInfo;
          if (
            (subNodeCode == 'NODE0041' && subServiceProgress == 1) ||
            (subNodeCode == 'NODE0042' && evidenceType != 2)
          ) {
            this.firstCountFun();
            this.countDownFun();
          }
        });
    },
    // 初始化工单资料
    initDataFunc() {
      let newArr = [...this.workflowColumns];
      this.workflowColumns = [];
      newArr.map((item) => {
        let newItem = { ...item };
        item.columns = this.getControlData(item.columns);
        if (newItem.moduleName == '商标分类') {
          if (newItem.columns[0].keyNameValue != '') {
            this.trademarkCategoryList = JSON.parse(newItem.columns[0].keyNameValue);
          }
        }
        if (newItem.moduleName == '商标使用证据') {
          newItem.columns.map((vv) => {
            if (vv.keyName == 'marketHref' && Object.keys(vv.keyNameValue).length > 0) {
              this.marketHrefList = JSON.parse(vv.keyNameValue);
            }
          });
        }
        this.workflowColumns.push(item);
      });
      this.fileList = [];
      this.answerFileList = [];
      this.oaFileList.map((item) => {
        let obj = { ...item };
        obj.overdue = false;
        if (new Date(item.officialExpirationDate) < new Date()) {
          obj.overdue = true;
        }
        this.fileList.push(obj); //
        if (item.fileType == 15) {
          item.authorizationFile != '' && this.answerFileList.push(item);
        } else {
          item.answerFile != '' && this.answerFileList.push(item);
        }
      });
    },
    // initoption数据
    initOptionFunc(data, label) {
      let obj = JSON.parse(data.replace(/\'/g, '"'));
      return obj[label];
    },
    getControlData(datalist) {
      let childList = datalist.filter((item) => item.columnPid != ''),
        newData = datalist.filter((item) => item.columnPid == ''),
        nowData = [...newData];
      newData.map((item) => {
        childList.map((vv) => {
          if (vv.columnPid == item.columnId && vv.columnOption.includes(item.keyNameValue)) {
            nowData.push(vv);
          }
        });
      });
      return nowData.sort((a, b) => {
        return a.sort - b.sort;
      });
    },
    // select回显
    selectReturnFunc(data) {
      let text = '',
        optionList = JSON.parse(data.info.replace(/\'/g, '"')).groups,
        selecd = optionList.filter((item) => {
          return item.value == data.keyNameValue;
        });
      if (selecd.length > 0) text = selecd[0].label;
      return text;
    },
    parseFileUrl(keyNameValue) {
      try {
        keyNameValue = JSON.parse(keyNameValue)[0];
      } catch (error) {
        if (keyNameValue && keyNameValue.length && typeof keyNameValue === 'object') {
          keyNameValue = keyNameValue[0];
        }
      }
      return keyNameValue;
    },
    goBack() {
      if (this.form == 'work') {
        this.$router.push('/work');
      } else {
        this.$emit('backPage', true);
      }
    },
    beforeUploadAccept(file) {
      const check = this.receptFile == '';
      const self = this;
      if (!check) {
        self.$Notice.warning({
          title: '最多只可上传1个文件',
        });
        return check;
      } else if (file.size > 2097152 * 15) {
        self.$Notice.warning({
          title: '文件大小超过30M',
        });
        return false;
      }
    },
    formatErrorHandler() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 只能上传zip、rar格式的文件',
      });
    },
    successHandler(res, file, fileList) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: '警告',
          desc: '请尝试再次上传',
        });
        return false;
      }
      this.receptFile = res.data.fileUrl;
    },
    removeHandler(i) {
      this.receptFile = '';
    },
    initFileNameFunc(fileName) {
      return fileName.slice(fileName.length - 36, fileName.length);
    },
    /**
     * 修复申请人证件bug
     * 重新转json数组
     */
    setColumns(data) {
      data.forEach((element) => {
        let keyName = element.keyName,
          keyNameValue = element.keyNameValue,
          inputType = element.inputType;
        if (keyName == 'useEvidence' || keyName == 'useProductImg') {
          if (!this.isJson(keyNameValue)) {
            element.keyNameValue = JSON.stringify(keyNameValue);
          }
        } else if (inputType == '4' && keyNameValue != '' && keyName != 'trademarkCategory') {
          if (this.isJson(keyNameValue)) {
            if (!Array.isArray(JSON.parse(keyNameValue))) {
              element.keyNameValue = JSON.stringify([JSON.parse(keyNameValue)]);
            }
          } else if (typeof keyNameValue === 'string') {
            if (keyNameValue.substr(0, 5) == 'http:') {
              element.keyNameValue = JSON.stringify([keyNameValue]);
            }
          } else {
          }
        }
      });
      return data;
    },

    /*
     判断 是不是json格式
    */
    isJson(data) {
      try {
        JSON.parse(data);
        return true;
      } catch (e) {
        return false;
      }
    },

    initFileNameFunc(fileName) {
      let newStr = fileName.substring(fileName.lastIndexOf('/') + 1);
      return newStr;
    },

    getOffVal(file) {
      return JSON.parse(file)[0];
    },
    sureReceptFunc() {
      let ble = this.OaReplyPlanAndEvidence;
      this.receptModal = false;

      if (ble && ble.length > 0) {
        this.replyPlanModal = true;
      } else {
        if (this.oaDetailInfo.isPay == 1 || this.oaDetailInfo.isPay == 3) {
          this.answerFreeFunc();
        } else if (this.oaDetailInfo.isPay == 2) {
          this.$router.push({
            path: '/sureOrder',
            query: { id: this.oaDetailInfo.orderId, type: 'oa' },
          });
        }
      }
    },
    answerFreeFunc() {
      answerOaApi({ oaFileId: this.oaDetailInfo.id }).then((res) => {
        if (res.code == 0) {
          this.receptModal = false;
          this.replyPlanModal = false;
          this.uploadModal = true;
          this.getDetailFun();
        }
      });
    },
    toFillIn(item) {
      const row = this.brandItem;
      // 待支付状态下判断当前是否超过宣誓截止日期
      if (this.cureentNodeCode === 'NODE0139') {
        const lastDealDate = moment(item.lastDealDate);
        const nowDate = moment();
        // 超时了
        if (lastDealDate.isBefore(nowDate)) {
          this.$Message.warning('已经超过宣誓截止时间，请联系客户经理或专属客服进行商标复活');
          return;
        }
      }
      this.$router.push({
        path: '/fillEvidence',
        query: {
          id: row.servicesId,
          progressBar: row.progressBar,
          nodeCode: row.cureentNodeCode,
          code: row.countryCode,
          countryNameZh: row.countryNameZh,
        },
      });
    },
    sureReceptFileFunc() {
      // 当receptFile和receptRemark都为空时，不做任何操作
      if (this.receptFile == '' && this.receptRemark == '') {
        this.$Message.error('请先上传材料或填写备注');
        return false;
      }
      let data = {
        oaFileId: this.oaDetailInfo.id,
        fileUrl: this.receptFile,
        remark: this.receptRemark,
        chooseSource: 1,
        replyId: this.oaDetailInfo.replyId,
      };
      this.$Modal.confirm({
        title: '',
        content: `<div class="submit-tip-box">
          <p class="submit-tip-title"><span class="imgs"></span><span>提示</span></p>
          <p class="tip-content">您上传的材料，将作为答复审查意见的依据。是否继续提交？</p></div>`,
        okText: '确定提交',
        cancleText: '取消',
        onOk: () => {
          answerOaMaterialsApi(data).then((res) => {
            if (res.code == 0) {
              this.$Message.success('操作成功');
              this.uploadModal = false;
              this.receptFile = '';
              this.getDetailFun();
            }
          });
        },
      });
    },
    fillVerificationCodeFunc() {
      this.$Modal.confirm({
        title: '',
        content: `<div class="submit-tip-box">
          <p class="submit-tip-title"><span class="imgs"></span><span>提示</span></p>
          <p class="tip-content">请确认已发送亚马逊品牌备案验证码邮件后，再点击申请。</p></div>`,
        okText: '继续申请',
        cancleText: '离开',
        onOk: () => {
          let requestData = {
            workOrderId: this.workOrderId,
            workOrderNo: this.workOrderNo,
          };
          applyAmazonFilingCodeApi(requestData).then((res) => {
            if (res.code == 0) {
              setTimeout(() => {
                this.sureCodeFunc();
              }, 500);
            }
          });
        },
      });
    },
    sureCodeFunc() {
      this.$Modal.info({
        title: '',
        content: `<div class="submit-tip-box">
          <p class="submit-tip-title"><span class="imgs"></span><span>提示</span></p>
          <p class="tip-content">您申请的业务已递交成功，我们将会在7个工作日内完成处理。</p></div>`,
        okText: '确定',
        cancleText: '离开',
        onOk: () => {
          this.getDetailFun();
        },
      });
    },
    // 使用证据操作
    sureReject(status) {
      if (!status && this.evidenceCustomerconfirm.trademarkWorkOrderStatus == '') {
        this.$Message.error('请选择驳回原因');
        return;
      }
      if (!status && this.evidenceCustomerconfirm.evidenceCustomerRejectInfo == '') {
        this.$Message.error('输入详细内容');
        return;
      }
      let operateLogoperateReason =
        this.evidenceCustomerconfirm.trademarkWorkOrderStatus +
        ';' +
        this.evidenceCustomerconfirm.evidenceCustomerRejectInfo;
      let paramsData = {
        json: { operateLogoperateReason },
        nodeCode: this.serciveInfo.subNodeCode,
        serviceId: this.serciveInfo.subServicesId,
        path: true,
      };
      if (!status) {
        paramsData.path = false;
      } else {
        paramsData.json = { operateLogoperateReason: '' };
      }
      console.log(paramsData);
      updateNodeAPI(paramsData).then((res) => {
        this.$Message.success('操作成功');
        this.countDownTime = false;
        this.rejectModal = false;
        this.getDetailFun();
      });
    },
    // 证据确认倒计时
    firstCountFun() {
      let startTime = Date.parse(new Date()),
        endTime = Date.parse(this.serciveInfo.evidenceSubmitDate) + 1000 * 60 * 60 * 24,
        downTime = Math.floor(endTime - startTime);

      if (downTime > 0) {
        this.countDownTime = true;
        var hours = Math.floor(downTime / (3600 * 1000));
        // 计算相差分钟数
        var leave2 = downTime % (3600 * 1000); // 计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));
        this.countDown = hours + ' : ' + minutes;
      }
    },
    countDownFun() {
      let that = this;
      let clearTime = setInterval(() => {
        let startTime = Date.parse(new Date()),
          endTime = Date.parse(that.serciveInfo.evidenceSubmitDate) + 1000 * 60 * 60 * 24,
          downTime = Math.floor(endTime - startTime);

        if (downTime > 0) {
          that.countDownTime = true;
          var hours = Math.floor(downTime / (3600 * 1000));
          // 计算相差分钟数
          var leave2 = downTime % (3600 * 1000); // 计算小时数后剩余的毫秒数
          var minutes = Math.floor(leave2 / (60 * 1000));
          that.countDown = hours + ' : ' + minutes;
        } else {
          clearInterval(clearTime);
          that.countDownTime = false;
        }
      }, 1000 * 60);
    },
    async handleReplyFile() {
      const res = await this.$refs['answerPaid'].getOaTrademarkReplyPlan(this.oaDetailInfo.id);
      const { code, data } = res;
      this.$refs['answerPaid']._data.show = true;
      if (code === 0) {
        if (Object.keys(data).length) {
          this.hasPaidPlanInfo = res.data;
          this.hasPaidPlanInfo = {
            replyId: res.data.id,
            list: JSON.parse(res.data.planInfo).oaServiceList || [],
            playInfo: JSON.parse(res.data.planInfo) || '',
          };
        }
        this.$refs['answerPaid']._data.show = true;
      }
    },
    showReason(item, index) {
      this.detailItem = item;
      this.oaDetailInfo = item;
      this.setOaDetailInfo(item);
      this.$refs['reason'][index]._data.show = true;
    },
    // 答复审查意见操作
    async useReceptModal(item) {
      const { status, isPay, fileType, answerFile } = item;
      this.oaDetailInfo = item;
      this.setOaDetailInfo(item);
      // 待选择答复方案
      if (+fileType !== 15) {
        if (+status === 5) {
          let { code, data } = await getOaReplyPlanAndEvidenceApi(item.id);
          this.$refs['answerNoPay']._data.show = true;
          this.OaReplyPlanAndEvidence = data.trademarkReplyPlan;
          this.setUserOaPlan(data.trademarkReplyPlan);
        } else if (+status === 17 || +status === 9) {
          // 上传材料
          this.handleReplyFile();
        }
      } else {
        if (+status === 15) {
          // 上传授权书
          this.$refs['uploadAuth']._data.show = true;
        }
      }
    },
    // 驳回重新上传
    rePlay(e) {
      this.useReceptModal(this.detailItem);
    },
    //显示商标注册上传授权书弹窗
    uploadAuthorization(flag, row) {
      console.log(row);
      this.currRow = row;
      this.uploadAuthorizationLetterVisiale = flag;
    },
    // 发送弹窗
    handleSendData(item) {
      this.sendDialogVisible = true;
      this.currentItem = item;
    },
  },
  mounted() {
    this.getDetailFun();
    if (this.tabIndex == 2) {
      this.tabs = this.tabIndex;
    }
  },
};
</script>
<style lang="less" scoped>
.container {
  background-color: #fff;
  padding: 24px;
  .title {
    padding-bottom: 16px;
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    img {
      vertical-align: middle;
    }
  }
  .fill-btn {
    width: 130px;
    height: 30px;
    background: #00a3ff;
    border-radius: 2px;
    color: #fff;
    margin: 0;
    margin-right: 20px;
  }
  .fill-btn.disabled {
    background: #c2c2c2;
    width: 116px;
  }
  .fill-btn.disabled:hover {
    color: #fff !important;
  }
  p {
    line-height: 30px;
  }
  .notice-box {
    margin-bottom: 14px;
    height: 36px;
    background: #fffbe6;
    border: 1px solid #ffe58f;
    padding: 0px 12px;
    line-height: 36px;
    color: #666666;
    span {
      color: #00a3ff;
      cursor: pointer;
    }
    img {
      vertical-align: text-top;
      margin: 0 4px;
    }
  }
  .tab-box {
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 10px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    span {
      margin-right: 32px;
      cursor: pointer;
    }
    span.tab-active {
      color: #00a3ff;
      border-bottom: 2px solid #00a3ff;
      padding-bottom: 10px;
    }
    .fr {
      span {
        margin-right: 0;
        margin-left: 14px;
      }
      span.blue-btn {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        padding: 8px 10px;
        background-color: #00a3ff;
      }
      span.white-btn {
        color: #00a3ff;
        padding: 8px 12px;
        border: 1px solid #00a3ff;
      }
    }
  }
  .details-box {
    margin-top: 24px;
    border: 1px solid #e9e9e9;
    .box-title {
      padding: 11px 24px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      background-color: #fafafa;
      border-bottom: 1px solid #e9e9e9;
    }
    .box-bottom {
      padding: 16px 24px;
    }
    .left-item {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      display: inline-block;
      vertical-align: text-bottom;
    }
    .right-item {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 500;
      color: #666666;
      line-height: 22px;
      max-width: 304px;
      display: inline-block;
      vertical-align: top;
      word-break: break-all;
    }
    .right-item.blue {
      color: #00a3ff;
    }
    p.right-item {
      overflow: inherit;
      white-space: break-spaces;
    }
    .evidence-box {
      display: inline-block;
      min-width: 320px;
      vertical-align: top;
      p {
        width: 366px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
      }
    }
    .evidence {
      img {
        vertical-align: middle;
      }
      a {
        color: #666666;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
    }
  }
  .button-box {
    border-top: 1px solid #ebebeb;
    padding-top: 32px;
    text-align: center;
  }
  .back-button {
    width: 88px;
    height: 32px;
    border-radius: 2px;
    background: #00a3ff;
    color: #ffffff;
  }
  .bread-logo {
    width: 106px;
    height: 106px;
    vertical-align: text-top;
  }
  .info-table {
    margin-top: 6px;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.15);
    font-size: 14px;
    box-sizing: border-box;
    margin-bottom: 10px;
    tr {
      td {
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        border-right: 1px solid rgba(0, 0, 0, 0.06);
        word-break: break-word;
        word-wrap: break-word;
      }
    }
    .header {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      th {
        padding: 8px 0;
        border-right: 1px solid rgba(0, 0, 0, 0.06);
      }
    }
    td {
      padding: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      .blue {
        color: #00a3ff;
        cursor: pointer;
      }
      .abandon {
        display: grid;
        grid-template-columns: repeat(2, 50%);
      }
    }
  }
  .null-file {
    text-align: center;
    margin-top: 16px;
    margin-bottom: 240px;
    .first-p {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      margin: 10px 0 8px 0;
    }
    p {
      font-size: 14px;
      font-family: PingFangSC;
      color: #666666;
    }
  }
}
.sure-proof-box {
  margin-top: 12px;
  .tip {
    font-weight: 400;
    color: #f03226;
    line-height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .sure-wrong {
    margin-top: 12px;
    span {
      display: inline-block;
    }
    .sure-box {
      cursor: pointer;
      width: 167px;
      height: 30px;
      border-radius: 2px;
      border: 1px solid #00a3ff;
      .sure {
        background: #00a3ff;
        color: #fff;
        text-align: center;
        line-height: 28px;
        width: 102px;
        height: 28px;
        padding: 0;
        border-radius: 2px;
      }
      .down-time {
        color: #00a3ff;
        text-align: center;
        width: 58px;
      }
    }
    .wrong-box {
      margin-left: 14px;
      border-radius: 2px;
      height: 30px;
    }
  }
}
.handle-td span {
  white-space: nowrap;
}
/deep/ .ivu-modal-content {
  border-radius: 4px;
}
/deep/ .ivu-modal-body {
  padding: 0;
}
/deep/ .tipsModal-title {
  padding: 24px;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  border-bottom: 1px solid #ddd;
}
/deep/ .ivu-modal-close {
  font-size: 14px;
  top: 16px;
}
/deep/ .ivu-modal-close .ivu-icon-ios-close {
  color: #333;
}
/deep/ .ivu-modal-footer {
  padding: 12px 18px 26px 18px;
}
/deep/ .modal-contnet {
  padding: 0 24px;
  margin-top: 12px;
  .title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    margin-bottom: 4px;
  }
  .remark-box {
    margin: 20px 0;
  }
  .recept-explain {
    font-size: 14px;
    font-family: PingFangSC;
    color: #333333;
    margin-bottom: 14px;
  }
  .oaAbandontips {
    display: flex;
    align-items: center; /*子元素垂直居中*/

    // justify-content: center; /*子元素水平居中*/
  }
  .oaAbandonTextarea {
    margin: 10px 0px 43px 0px;
  }
  .notice-content {
    padding: 12px 30px 12px 14px;
    background-color: #eff9ff;
    font-size: 12px;
    font-family: PingFangSC;
    color: #666666;
    line-height: 22px;
    max-height: 160px;
    overflow-y: scroll;
    margin-bottom: 16px;
    p {
      word-break: break-all;
    }
  }
  .help-box {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-top: 2px;
    margin-bottom: 18px;
    display: flex;
    & > div {
      max-width: 400px;
    }
    a {
      color: #00a3ff;
      font-weight: 400;
      margin-right: 16px;
      display: inline-block;
      word-break: break-all;
    }
  }
  .handle-box {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    img {
      width: 475px;
      margin-top: 14px;
      margin-left: 8px;
    }
    span {
      font-size: 12px;
    }
  }
  .pay-explain {
    margin: 18px 0 16px 0;
    .content {
      font-size: 12px;
      font-family: PingFangSC;
      color: #666666;
      line-height: 22px;
    }
  }
  .tips {
    font-size: 14px;
    font-family: PingFangSC;
    color: #333333;
    line-height: 20px;
    margin-bottom: 10px;
  }
  .upload-box {
    margin-bottom: 10px;
    .ivu-upload.ivu-upload-select {
      width: 236px;
      height: 32px;
      background: #00a3ff;
      border-radius: 2px;
      line-height: 32px;
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      cursor: pointer;
    }
    img {
      vertical-align: middle;
    }
    /deep/ .ivu-upload {
      width: 100%;
    }
    /deep/ .ivu-upload-list {
      width: 514px;
    }
    /deep/ .ivu-upload-list-file {
      padding: 0;
      text-align: left;
    }
    /deep/ .ivu-upload-list-file:hover {
      background-color: #fff;
    }
  }
}

.footer-btn {
  border-radius: 0;
  width: 92px;
  height: 38px;
}
::-webkit-scrollbar {
  width: 2px;
  height: 6px;
}

/* 滚动条有滑块的轨道部分 */
::-webkit-scrollbar-track-piece {
  background-color: transparent;
  border-radius: 5px;
}

/* 滚动条滑块(竖向:vertical 横向:horizontal) */
::-webkit-scrollbar-thumb {
  cursor: pointer;
  background-color: #00a3ff;
}

/* 滚动条滑块hover */
::-webkit-scrollbar-thumb:hover {
  background-color: #999999;
}

/* 同时有垂直和水平滚动条时交汇的部分 */
::-webkit-scrollbar-corner {
  display: block; /* 修复交汇时出现的白块 */
}

.brand-detail-info {
  /deep/.data-previews {
    .module-name {
      margin-top: 20px;
    }
    .information-tips,
    .module-name span {
      display: none;
    }
  }
}

.module-name {
  font-size: 16px;
  color: #303132;
  margin-top: 20px;
  span {
    float: right;
    font-size: 14px;
    color: #3a7fff;
    cursor: pointer;
  }
  b {
    display: inline-block;
    width: 2px;
    height: 15px;
    background: #3a7fff;
    margin-right: 8px;
    position: relative;
    top: 2px;
  }
}
.data-preparation-list {
  margin-top: 24px;
  width: 100%;
  td {
    border: 1px solid #f0f0f0;
    padding: 10px 32px;
  }
  .upload-files-label {
    background: #fafafa;
    width: 264px;
  }
  .upload-files-item {
    padding: 0;
    > div {
      padding: 10px 32px;
    }
    span {
      display: inline-block;
      height: 22px;
      line-height: 22px;
      padding: 0 30px;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
      &:hover {
        color: #3a7fff;
        cursor: pointer;
      }
    }
    span:last-child {
      border: none;
    }
  }
}
</style>

<style>
.submit-tip-title {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
  margin-left: -40px;
}
.submit-tip-title .imgs {
  display: inline-block;
  width: 26px;
  height: 26px;
  background-image: url('../../assets/images/infoDetail/Shape.svg');
  vertical-align: middle;
  margin-right: 14px;
}
.submit-tip-box .tip-content {
  color: #333;
}
.ivu-modal-confirm-footer .ivu-btn.ivu-btn-text {
  padding: 5px 16px;
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid #999999;
}
.ivu-modal-confirm-footer .ivu-btn-primary {
  padding: 5px 16px;
  background: #00a3ff;
  border-radius: 2px;
  color: #ffffff;
}
.reson-box {
  word-break: break-all;
}
.item-box a {
  display: inline-block;
}
</style>
