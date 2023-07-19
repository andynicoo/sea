<template>
  <el-dialog title="查看OA翻译" :visible.sync="isShow" width="30%" center :before-close="handleClose">
    <div>
      <el-row class="row">
        <el-col :span="3">翻译OA:</el-col>
        <el-col :span="20">{{conten.interpretFileContent}}</el-col>
      </el-row>
      <el-row class="row">
        客户答复截止日期: {{conten.lastDealDate}}
      </el-row>
      <el-row class="row">
        审查意见翻译文件:
        <div v-if="setHlepDocument.length > 0">
          <el-row v-for="(item,index) in setHlepDocument" :key="index">
            <a :href="replaceHttps(item.fileUrl)" target="_blank" style="color:#1890ff;">
              <img src="@/assets/images/infoDetail/bainji-blue.svg" alt="">{{item.oldFileName}}
            </a>
          </el-row>
        </div>
        <div v-else> -- </div>
      </el-row>
      <div>OA处理方案：</div>
      <!-- 方案的列表 star -->
      <programme-list :key="createProgramme" :hideDele="false"></programme-list>

    </div>

  </el-dialog>
</template>

<script>
import ProgrammeList from '../sceme/index.vue';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'DetailLookTranslate',
  props: {
    lookTranslateModal: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ProgrammeList,
  },
  watch: {
    lookTranslateModal: {
      handler(val) {
        this.isShow = val;
      },
      immediate: true,
    },
  },
  computed: {
    setHlepDocument() {
      if (this.conten.hlepDocument) {
        const val = JSON.parse(this.conten.hlepDocument);
        return val.length > 0 ? val : [];
      } else {
        return [];
      }
    },
  },
  data() {
    return {
      isShow: false,
      createProgramme: new Date().getTime(),
      conten: {
        interpretFileContent: '',
        officialExpirationDate: '',
        hlepDocument: undefined,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    ...mapGetters(['getDelworkInfo']),
    handleClose(done) {
      done();
      this.$emit('update:lookTranslateModal');
    },
    getList() {
      this.conten = { ...this.getDelworkInfo() };
    },
  },
};
</script>
<style lang='scss' scoped>
.row {
  margin-bottom: 15px;
  white-space: pre-wrap;
}
</style>