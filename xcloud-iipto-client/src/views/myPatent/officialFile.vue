<template>
  <div class="content">
    <table class="table" width="100%" cellspacing="0">
      <thead>
        <tr>
          <td>序号</td>
          <td>文件</td>
          <td>类型</td>
          <td>上传时间</td>
          <td>操作</td>
        </tr>
      </thead>
      <tbody v-if="allList.length">
        <tr v-for="(item, index) in allList" :key="index">
          <td>{{ index + 1 }}</td>
          <td>
            <a :href="item.officialFile" target="_blank" download>{{ fileTypeMap[item.fileType] }}</a>
          </td>
          <td>{{ fileTypeMap[item.fileType] }}</td>
          <td>{{ item.createTime }}</td>
          <td>
            <template
              v-if="item.fileType === 1 && (item.nodeCode === 'NODE104-003' || item.nodeCode === 'NODE104-002')"
            >
              <a
                :disabled="isCancel"
                @click="
                  quitVisible = true;
                  current = item;
                "
                >放弃答复</a
              >
              <a
                :disabled="isCancel"
                @click="
                  confirmVisible = true;
                  current = item;
                "
                >确认答复</a
              >
            </template>
            <template v-if="item.functionCode === 100">
              <a
                style="margin-top:8px;color: #00a3ff;"
                @click="handleSendData({...item, trademarkType: 3})"
                v-if="(item.cureentNodeCode === 'NODE0076')"
                ><a-icon type="file" /> 下载资料</a
              >
            </template>
            <template v-if="item.functionCode === 100">
              <a
                style="margin-top:8px;color: #00a3ff;"
                @click="handleSendData({...item, trademarkType: 4})"
                v-if="(item.cureentNodeCode === 'NODE0077' && designPatentOaWorkOrder && designPatentOaWorkOrder.cureentNodeCode === 'NODE104-006')"
                ><a-icon type="file" /> 下载资料</a
              >
            </template>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="6">
            <div class="empty">暂无数据</div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 放弃答复弹窗 -->
    <Modal width="420" v-model="quitVisible" title="放弃答复审查意见" @on-cancel="quitVisible = false">
      <div class="quit-content">
        <p><img src="@/assets/images/common/yellowTip.svg" />放弃答复审查意见后，有可能会导致专利申请失败</p>
        <Input
          class="textarea"
          v-model="quitReason"
          type="textarea"
          maxlength="200"
          :rows="4"
          placeholder="请输入放弃答复的原因"
        ></Input>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleQuit">确认</Button>
      </div>
    </Modal>

    <!-- 确认答复弹窗 -->
    <Modal width="560" v-model="confirmVisible" title="答复审查意见" @on-cancel="confirmVisible = false">
      <div class="confirm-content">
        <dl>
          <dt>温馨提示</dt>
          <dd>
            专利局已下发审查意见，需要您在{{
              current.lastDealDate
            }}前完成答复，逾期未答复将视主动放弃对官方审查意见的回复
          </dd>
          <dd class="background">
            <p><strong>答复建议</strong></p>
            <div class="note">{{ current.processingSuggestion }}</div>
          </dd>
          <dd>
            <p>
              答复审查意见帮助文档：<a :href="current.interpretFile" target="_blank"
                >参考文档.{{ current.interpretFile.replace(/.+\./, '') }}</a
              >
            </p>
          </dd>
          <template v-if="current.nodeCode === 'NODE104-002'">
            <dt>缴费说明</dt>
            <dd>此次审查意见，需要由律师撰文答复专利局，需要收取服务费</dd>
          </template>
          <template v-else>
            <dt>上传答复材料</dt>
            <dd>
              <Upload
                :action="uploadUrl"
                :format="['rar', 'zip']"
                :on-success="handleSuccess"
                :on-remove="handleRemoveFile"
                :before-upload="handleBeforeUpload"
                :on-format-error="handleFormatError"
              >
                <Button type="primary" icon="ios-cloud-upload-outline">上传文件</Button>
              </Upload>
              <p class="tips">注：请先将文件打包为压缩包后再上传，支持扩展名：rar、zip</p>
            </dd>
          </template>
        </dl>
      </div>
      <div slot="footer">
        <Button type="primary" @click="handleConfirm">确认</Button>
      </div>
    </Modal>

    <!-- 去付款弹窗 -->
    <Modal width="420" v-model="payVisible" title="提示" @on-ok="handleGoPay" @on-cancel="payVisible = false">
      <div class="quit-content">
        <p>请先在“个人中心-购买记录”中支付订单后再答复</p>
      </div>
    </Modal>

    <!-- 发送资料公共弹窗 -->
    <SendDataDialog 
      :item="currentItem"
      :visible="sendDialogVisible" 
      @cancel="sendDialogVisible = false; "
      @fetch="getListFun()"
    />
  </div>
</template>

<script>
import '@/assets/style/common.less';
import SendDataDialog  from '../../../xcloud-client-components-web/module/components/sendDataDialog'
import { answerOa, quitAnswerOa } from '@/api/myPatent';
export default {
  props: {
    fileList: {
      type: Array,
    },
    designPatentWorkOrder: {
      type: Object,
    },
    serviceInfo: {
      type: Object
    },
    designPatentOaWorkOrder: {
      type: Object
    },
    isCancel: Boolean,
  },
  components:{
    SendDataDialog
  },
  data() {
    return {
      quitVisible: false,
      confirmVisible: false,
      payVisible: false,
      quitReason: '',
      fileTypeMap: {
        1: '审查意见OA官方文件',
        2: '授权书',
        3: '受理回执',
        4: '专利证书',
        5: '注册资料',
        6: 'OA答复材料'
      },
      current: {
        interpretFile: '',
      },
      oaFile: '',
      allList: [],
      currentItem: {},
      sendDialogVisible: false
    };
  },
  watch:{
    fileList:{
      handler(newVal) {
        this.allList = [...newVal]
        if(this.designPatentWorkOrder.customerOaReplyData){
          this.allList.push({
            officialFile: this.designPatentWorkOrder.customerOaReplyData,
            fileType: 6,
            createTime: this.designPatentWorkOrder.customerOaReplyDataTime,
            functionCode: this.serviceInfo.productFunctionCode,
            workId: this.designPatentWorkOrder.id,
            emailSend: this.designPatentWorkOrder.customerOaEmailSend,
            cureentNodeCode: this.serviceInfo.cureentNodeCode,
            countryCode: this.serviceInfo.countryCode,
            customerData:this.designPatentWorkOrder.customerOaReplyData,
          })
        }
        if(this.designPatentWorkOrder.customerRegisterData){
          this.allList.push({
            officialFile: this.designPatentWorkOrder.customerRegisterData,
            fileType: 5,
            createTime: this.designPatentWorkOrder.customerRegisterDataTime,
            functionCode: this.serviceInfo.productFunctionCode,
            workId: this.designPatentWorkOrder.id,
            emailSend: this.designPatentWorkOrder.customerRegisterEmailSend,
            cureentNodeCode: this.serviceInfo.cureentNodeCode,
            countryCode: this.serviceInfo.countryCode,
            customerData: this.designPatentWorkOrder.customerRegisterData,
          })
        }
      },
      deep: true
    }
  },
  methods: {
    // 上传文件成功
    handleSuccess(res, file, fileList) {
      this.oaFile = res.data.fileUrl;
    },
    // 清除文件
    handleRemoveFile() {
      this.oaFile = '';
    },
    // 上传前
    handleBeforeUpload() {
      const check = this.oaFile === '';
      if (!check) {
        this.$Message.warning('只能上传一个文件');
      }
      return check;
    },
    handleFormatError(file) {
      this.$Message.warning('文件类型错误，只支持.rar,.zip');
    },
    // 确认放弃答复
    handleQuit() {
      if (this.quitReason === '') {
        this.$Message.warning('请输入放弃答复的原因');
        return;
      }
      quitAnswerOa({
        workOrderId: this.current.id,
        unanswerResson: this.quitReason,
      }).then((res) => {
        if (res.code === 0) {
          this.$Message.success('放弃答复成功');
          this.quitVisible = false;
          this.$emit('onChange');
        }
      });
    },
    // 确认答复
    handleConfirm() {
      if (this.current.nodeCode === 'NODE104-002') {
        this.payVisible = true;
        this.confirmVisible = false;
        return;
      }
      if (this.oaFile === '') {
        this.$Message.warning('请先上传答复材料');
        return;
      }
      answerOa({
        workOrderId: this.current.id,
        fileStr: this.oaFile,
      }).then((res) => {
        if (res.code === 0) {
          this.$Message.success('答复资料上传成功，等待平台审核');
          this.confirmVisible = false;
          this.$emit('onChange');
        }
      });
    },
    // 去支付
    handleGoPay() {
      this.$router.push({
        path: '/myOrder',
      });
    },
    // 发送弹窗
    handleSendData(item) {
      this.sendDialogVisible = true
      this.currentItem = item
    }
  },
};
</script>
<style lang="less" scoped>
.content {
  a {
    color: #00a4ff;
    margin: 0 5px;
    &[disabled] {
      color: #ccc;
    }
  }
  .table {
    text-align: center;
    font-size: 14px;
    border-collapse: collapse;
    margin-top: 20px;
    thead {
      td {
        height: 44px;
        line-height: 44px;
        width: 23%;
        color: #333;
        font-weight: 700;
        border-top: solid 1px #e9e9e9;
        background: #fafafa;
      }
      td:first-child {
        width: 8%;
        border-left: solid 1px #e9e9e9;
      }
      td:last-child {
        border-right: solid 1px #e9e9e9;
      }
    }
    tbody {
      td {
        border: solid 1px #e9e9e9;
        padding: 16px 0;
      }
      .empty {
        padding: 190px 0;
        text-align: center;
      }
    }
  }
}
.quit-content {
  padding: 10px 10px 30px;
  p {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
    img {
      margin-right: 10px;
    }
  }
  div {
    margin-bottom: 10px;
  }
}
.confirm-content {
  padding: 0 10px 30px;
  dt {
    color: #333;
    font-weight: 700;
    margin: 15px 0 5px;
  }
  dd {
    font-size: 12px;
    .tips {
      color: #f60;
    }
  }
  dd.background {
    margin: 15px 0 10px;
    padding: 10px;
    background: #eff9ff;
    strong {
      font-weight: 700;
      font-size: 14px;
      color: #333;
    }
    .note {
      margin: 5px 0;
      line-height: 20px;
    }
  }
}
</style>
