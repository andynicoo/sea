<!-- 查看答复审查意见信息 -->
<template>
  <!-- 审核 -->
  <el-dialog title='查看答复审查意见信息' :visible.sync="isShow" width="30%" center :before-close="handleClose">
    <div>
      <div class="em-info">
        <div v-if="info.rejectReason">
          <el-row>驳回原因:</el-row>
          <el-row style="margin-top:10px">{{info.rejectReason}}</el-row>
        </div>
        <div v-else>
          <el-row>驳回原因: 暂无</el-row>
        </div>
      </div>
      <div @click="isChenkHook(item)" class="item" v-for="(item,index) in list" :key="index">
        <el-row class="item-header">
          <el-col :span="20">答复建议:方案 {{index + 1}}</el-col>
          <el-col v-if="userisOptional && item.id == replyId" :span="4" class="hook">
            <img src='@/assets/images/intellectualProperty/upTriangle.svg'>
          </el-col>
          <el-col v-if="userisNoOptional" :span="4" class="hook">
            <img src='@/assets/images/intellectualProperty/upNotriangle.svg'>
          </el-col>
        </el-row>
        <el-row class="item-concent">答复建议:{{setRepalyStr(item.planInfo)}}</el-row>
      </div>
      <div>
        <el-row>请将请将文件打包到一个压缩包后，再进行上传:</el-row>
        <div style="text-align: center;">
          <upload-file class="re-upload" :drag="false" :onlyZip="true" :maxSize="100" :fileList.sync="filePath">
            <el-button type="primary">
              上传文件
            </el-button>
          </upload-file>
        </div>
      </div>
      <el-row class="tips">
        提示：仅支持大小不超过100MB的ZIP格式文件
      </el-row>
      <div class="em-reject">
        <el-row>
          备注信息：
        </el-row>
        <el-input type="textarea" placeholder="请输入备注信息，如果需要进行文字信息确认，可在此信息框中确认" v-model="rejectAnswerReason" maxlength="500" show-word-limit>
        </el-input>
      </div>
    </div>
    <p slot="footer">
      <el-button type="primary" @click="auditFunc">确认答复</el-button>
    </p>
  </el-dialog>
</template>

<script>
import * as API from '@/api/newApi/intellectualProperty/oa.js';
import UploadFile from '@/components/UploadFile/index';
import { mapGetters, mapMutations } from 'vuex';
import { newThrottle } from '@/libs/throttle';
export default {
  name: 'UploadReplyFile',
  props: {
    title: String,
    uploadRepalyShow: {
      type: Boolean,
      default: false,
    },
    lableList: {
      type: Array,
      default: () => [],
    },
  },
  inject: {
    tradeMarkGetData: {
      default: '',
    },
    oaWorkerInfo: {
      default: '',
    },
  },
  data() {
    return {
      rejectAnswerReason: '',
      isShow: false,
      filePath: [],
      isChenkHookVal: true,
      list: [],
      info: {},
      replyId: 0,
      delworkInfo: this.getDelworkInfo(),
    };
  },

  watch: {
    uploadRepalyShow: {
      handler(val) {
        this.isShow = val;
      },
      immediate: true,
    },
  },
  components: {
    UploadFile,
  },

  created() {
    this.getList();
  },
  computed: {
    /**用户可选 */
    userisOptional() {
      // console.log('this.delworkInfo.status', this.delworkInfo.status);
      return this.delworkInfo.status == 4 ? true : false;
    },

    /**用户不可选 */
    userisNoOptional() {
      // console.log('this.delworkInfo.status', this.delworkInfo.status);
      return this.delworkInfo.status == 5 || this.delworkInfo.status == 9 ? true : false;
    },
  },

  methods: {
    ...mapGetters(['getDelworkInfo']),

    async getList() {
      let { code, data } = await API.getOaReplyPlanAndEvidence(this.getDelworkInfo().id);
      if (code == 0) {
        this.list = data.trademarkReplyPlan;
        this.info = data;
      }
    },

    auditFunc: newThrottle('replaceMaterialsFun'),
    async replaceMaterialsFun() {
      if (this.delworkInfo.status == 4 && this.replyId == 0 && this.list.length > 0) {
        this.$message.error('请选择答复审查意见处理方案');
        return;
      }
      // debugger 
      if (this.filePath.length === 0 && this.rejectAnswerReason == '') {
        this.$message.error('必须上传一个文件或者填写备注信息');
        return;
      }
      let obj = {
        chooseService: 0,
        chooseSource: 2,
        fileUrl: this.fileFormat(this.filePath),
        replyId: this.replyId, //方案id
        oaFileId: this.getDelworkInfo().id, //文件id
        remark: this.rejectAnswerReason, //备注信息
      };
      let { data, code } = await API.replaceMaterials(obj);

      if (code == 0) this.successful();
    },

    setRepalyStr(data) {
      if (data == '') {
        return '暂无';
      } else {
        return JSON.parse(data).replyStr;
      }
    },
    fileFormat(file) {
      if (file !== undefined) {
        return file.map((item) => item.url).join(',');
      } else {
        return '';
      }
    },
    successful() {
      this.$message({ type: 'success', message: '操作成功' });
      'oaWorkerInfo' in this && this.oaWorkerInfo != '' ? this.oaWorkerInfo() : this.tradeMarkGetData();
      this.close();
    },
    handleClose(done) {
      done();
      this.$emit('update:uploadRepalyShow', false);
    },
    close() {
      this.isShow = false;
      this.$emit('update:uploadRepalyShow', false);
    },
    /**选择方案 */
    isChenkHook(item) {
      this.replyId = item.id;
    },
  },
};
</script>
<style lang='scss' scoped>
.em-info {
  background: rgb(239, 249, 255);
  margin: 5px 0px;
  padding: 10px 5px;
}
.em-radio {
  margin: 5px 0px;
}
.em-reject {
  margin-top: 20px;
}
.re-upload {
  /deep/ .el-upload {
    width: auto;
    height: 60px;
    border: 0px !important;
  }
}
.icon {
  color: #1890ff !important;
  // .sjx {
  //   width: 0px;
  //   height: 0px;
  //   border: 25px solid transparent;
  //   border-bottom-color: #1890ff;
  //   transform: rotateZ(134deg);
  //   z-index: -1;
  // }
}
.item-trans {
  width: 100%;
  height: auto;
  .icon {
    position: absolute;
    right: 0px;
  }
  position: relative;
}
.hook {
  text-align: end;
}
.item {
  margin: 15px 0px;
  border: 1px solid rgb(215, 215, 215);
  border-radius: 3px;

  .item-header {
    font-family: 'Arial Negreta', 'Arial Normal', Arial, sans-serif;
    font-weight: 700;
    font-style: normal;
    height: 52px;
    line-height: 40px;
    border-bottom: 1px solid rgb(215, 215, 215);
    padding: 5px;
    // display: grid;
    // grid-template-columns: 30% auto 33.33%;
  }
  .item-concent {
    padding: 5px;
    white-space: pre-wrap;
  }
}
</style>