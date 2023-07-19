<!-- 翻译OA组件 -->
<template>
  <div>
    <el-drawer :before-close="closeDrawer" :visible.sync="visible" title="翻译OA">
      <el-form :model="formTrans" label-position="left" label-width="140" style="padding:0 12px 10px 40px;">
        <el-form-item label="是否需要客户处理：">
          <el-radio-group v-model="formTrans.dispose">
            <el-radio :label="2">需要处理</el-radio>
            <el-radio :label="1">无需处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="无需处理的原因:" v-if="formTrans.dispose === 1">
          <el-input v-model="formTrans.disposeRejectReason" :maxlength="500" :rows="3" show-word-limit type="textarea" placeholder="输入无需客户处理的原因" />
        </el-form-item>
        <div v-else>
          <el-form-item label="翻译OA：">
            <el-input v-model="formTrans.interpretFileContent" :maxlength="500" :rows="3" show-word-limit type="textarea" placeholder="请输入OA翻译"></el-input>
          </el-form-item>
          <el-form-item label="客户截止日期：">
            <el-date-picker type="date" placeholder="选择客户截止日期" v-model="formTrans.customerExpiryDate" style="width:180px"></el-date-picker>
            <div class="tip-box" style="margin:12px 0 20px 0;">
              <i class="el-icon-warning text-warning"></i>注意：客户必须在官方截止日期内确认答复，否则，会被官方默认放弃申请<br>尽量在官方截止时间的基础上预留15天给至律师处理
            </div>
          </el-form-item>
          <!--  -->
          <el-form-item label="审查意见翻译文件">
            <el-upload :format="['jpg','pdf','doc','docx','xls','xlsx']" :file-list="helpFileList" :action="workOrderFile" :default-file-list="helpFileList" :before-upload="beforeUploadAccept" :on-format-error="formatErrorHandler" :max-size="2048" ref="upload" :on-success="successHandlerAccept" :on-remove="(file,fileList)=>{removeHandlerAccept (file,fileList)}" style="accept-upload">
              <i class="icon icon-file-upload"></i>
              <p>点击或将文件拖拽到这里上传</p>
              <p class="tip">支持扩展名： .doc .docx .pdf .jpg .xls .xlsx ，每个文件大小2M内，最多5个文件</p>
            </el-upload>
          </el-form-item>
          <div class="tip-box">
            <i class="el-icon-warning text-warning"></i>审查意见翻译文件将展示给客户，用于指引客户提供答复OA的材料
          </div>
        </div>
        <!-- 方案的列表 star -->
        <programme-list ref="myProgramme"></programme-list>

        <center style="margin-top:18px;">
          <el-button v-if="formTrans.dispose == 2" type="primary" @click="openAddSceme">新增处理方案</el-button>
          <el-form-item style="margin-top:18px;">
            <el-button style="margin-right:20px;" @click="close">取消</el-button>
            <el-button type="primary" @click="saveTranslate">确认</el-button>
          </el-form-item>
        </center>
      </el-form>
    </el-drawer>
    <add-schem-dialog :schemVisible.sync="isShwoschemDialog" v-if="schemReset " @planInfoObj="getPlanInfo"></add-schem-dialog>

  </div>
</template>

<script>
import ProgrammeList from '../sceme/index.vue';
import { mapGetters } from 'vuex';
import * as API from '@/api/newApi/intellectualProperty/oa.js';
export default {
  name: 'TranslationFile',
  components: {
    ProgrammeList,
    AddSchemDialog: () => import('./addSchemDialog/index.vue'),
  },
  //  inject: ['tradeMarkGetData'],
  props: {
    oAtranslateModal: {
      type: Boolean,
      default: false,
    },
    operateType: Number,
    formTrans: {
      type: Object,
      default: () => {},
    },
    id: {
      type: String,
      default: '',
    },
    helpFileList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: false,
      isShwoschemDialog: false, //答复审查意见处理方案 弹窗
      schemReset: true,
    };
  },
  watch: {
    oAtranslateModal: {
      handler(val) {
        this.visible = val;
      },
      immediate: true,
    },
  },

  computed: {},

  mounted() {
    console.log('组件数据', this.helpFileList);
  },

  methods: {
    ...mapGetters(['getNewPlanInfo']),
    /**获取用户选择的方案 */
    getPlanInfo(data) {
      this.resetSchemCom();
      setTimeout(() => this.$refs.myProgramme.getList(), 500);
    },

    resetSchemCom() {
      this.schemReset = false;
      this.$nextTick(() => {
        this.schemReset = true;
      });
    },

    openAddSceme() {
      this.isShwoschemDialog = true;
      this.resetSchemCom();
    },
    saveTranslate() {
      if (this.formTrans.dispose === 1) {
        if (this.formTrans.disposeRejectReason === undefined || this.formTrans.disposeRejectReason.trim() === '') {
          this.$Message.error('请输入无需客户处理的原因');
          return;
        }
        this.submitOAtranslation(this.formTrans);
        return;
      }
      if (this.formTrans.interpretFileContent == '' || this.formTrans.interpretFileContent == undefined) {
        this.$Message.error('请填写翻译资料');
        return;
      }

      if (!this.formTrans.customerExpiryDate) {
        this.$Message.error('请输入客户截止日期');
        return;
      }
      if (!this.formTrans.dispose) {
        this.$Message.error('请选择是否需要客户处理 ');
        return;
      }
      if (this.helpFileList.length === 0) {
        this.$Message.error('请上传审查意见翻译文件');
        return;
      }

      let paramsData = { ...this.formTrans };

      this.submitOAtranslation(paramsData);
    },

    formatErrorHandler() {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '文件格式不正确, 请上传指定格式的文件',
      });
    },

    successHandlerAccept(res, file, fileList) {
      let self = this;
      if (res.code !== 0) {
        self.$Notice.warning({
          title: '警告',
          desc: '请尝试再次上传',
        });
        return false;
      }
      let obj = {
        name: file.name,
        url: file.response.data.fileUrl,
      };
      this.helpFileList.push(obj);
      // console.log('图片',this.helpFileList);
    },

    beforeUploadAccept(file) {
      const check = this.helpFileList.length < 5;
      const self = this;
      if (!check) {
        self.$Notice.warning({
          title: '最多只可上传5个文件',
        });
        return check;
      } else if (file.size > 2097152) {
        self.$Notice.warning({
          title: '文件大小超过2M',
        });
        return false;
      }
    },

    removeHandlerAccept(file, fileList) {
      this.helpFileList = [...fileList];
    },

    submitOAtranslation(paramsData) {
      let data = { ...paramsData },
        self = this;
      data.customerExpiryDate = this.formatDate(data.customerExpiryDate, 'date');
      data.oaFileId = this.id;

      let helpData = [];
      this.helpFileList.map((item) => {
        let obj = {
          oldFileName: item.name,
          fileUrl: item.url,
        };
        helpData.push(obj);
      });
      data.helpDocument = JSON.stringify(helpData);
      data.planJson = JSON.stringify(this.getNewPlanInfo());
      data.operateType = this.operateType;
      API.translateOaAPI(data).then((res) => {
        if (res.code == 0) {
          this.OAtranslateModal = false;
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.close();
          this.$emit('noticeSuccess');
        }
      });
    },
    closeDrawer(done) {
      done();
      this.$emit('update:oAtranslateModal', false);
    },
    close() {
      this.visible = false;
      this.$emit('update:oAtranslateModal', false);
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
