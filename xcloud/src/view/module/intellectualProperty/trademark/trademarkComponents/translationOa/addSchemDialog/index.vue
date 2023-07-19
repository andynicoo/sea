<!-- 添加答复审查意见方案 对话框-->
<template>
  <el-dialog title="答复审查意见处理方案" :visible.sync="isShow" width="30%" :before-close="handleClose">
    <!-- <span>这是一段信息</span> -->
    <el-row>答复建议:</el-row>
    <el-input class="answer-suggestions" type="textarea" :rows="2" placeholder="请输入答复建议" maxlength="500" show-word-limit v-model="textarea">
    </el-input>
    <el-row>OA服务付费:</el-row>
    <pay-service-item ref="gKey1" :goodType="goodTypes.gKey1"></pay-service-item>
    <!-- <el-row> 使用证据商品(如果不添加则默认为不涉及使用证据):</el-row>
    <template v-for="(idx,index) in addEvidenceGoods">
      <div :key="index" class="add-evdence-goods-item">
        <div class="delect-item">
          <i class="el-icon-circle-close" @click="deletPayServiceItem(index)"></i>
        </div>
        <pay-service-item ref="gKey2" :goodType="goodTypes.gKey2"></pay-service-item>
      </div>
    </template>
    <el-button @click.stop="clickAddEDGoods">添加商品</el-button> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
import { addTrademarkReplyPlan } from '@/api/newApi/intellectualProperty/trademark';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'AddSchemDialog',
  props: {
    schemVisible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PayServiceItem: () => import('./payService/index.vue'),
  },
  data() {
    return {
      addEvidenceGoods: [],
      textarea: '',
      isShow: false,
      goodTypes: {
        gKey1: 'OA',
        gKey2: 'EVIDENCE',
      },
      planInfo: {
        replyStr: this.textarea, //答复建议
        oaServiceList: [], //oa方案
        otherServiceList: [], //使用证据方案
      },
    };
  },
  beforeDestroy() {
    this.resetTreatmentSchemeList();
  },
  computed: {},
  watch: {
    schemVisible: {
      handler(val) {
        this.isShow = val;
      },
      immediate: true,
    },
  },

  computed: {},

  methods: {
    ...mapGetters(['getDelworkInfo']),
    ...mapMutations(['resetTreatmentSchemeList', 'deleteTreatmentSchemeLItem']),
    handleClose(done) {
      done();
      this.$emit('update:schemVisible', false);
    },

    close() {
      this.isShow = false;
      this.$emit('update:schemVisible', false);
    },

    /**添加一条使用证据商品: */
    clickAddEDGoods() {
      this.addEvidenceGoods.push({});
    },
    /**删除一条指定的使用证据商品 */
    deletPayServiceItem(index) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.addEvidenceGoods.splice(index, 1);
          console.log('addEvidenceGoods', this.addEvidenceGoods);
          this.deleteTreatmentSchemeLItem(index);
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },

    submit() {
      this.getUserSchemeType();
      if (this.submitVerification()) return;
      if (this.textarea == '') {
        this.$message({
          type: 'warning',
          message: '答复建议为必填项',
        });
        return;
      }
      if (this.planInfo.otherServiceList == [] && this.planInfo.oaServiceList == []) {
        this.usreNoChoiceScheme();
      } else {
        this.userChoiceScheme();
      }
    },

    /**用户没有选择一种方案 */
    usreNoChoiceScheme() {
      this.$confirm('是否确认不选择任何方案么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then((_) => {
          self.saveProgramme();
          self.$emit('planInfoObj', {});
        })
        .catch((_) => {});
      this.close();
    },
    /**用户选择了至少一种方案 */
    userChoiceScheme() {
      this.$confirm('确认采用此方案？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then((_) => {
          this.saveProgramme(this.setParm());
          this.$emit('planInfoObj', {});
        })
        .catch((_) => {});
      this.close();
    },

    /** 更具 用户选择 oa方案 校验 选择服务 提示补全选择方案 */
    submitVerification() {
      let result = true,
        self = this;
      function errTips(message = '请将方案填写完整') {
        self.$message({
          type: 'success',
          message: message,
        });
        return false;
      }
      let { oaServiceList, otherServiceList } = this.planInfo;
      this.filterNullOtherService(otherServiceList).forEach((item) => {
        result = 'skuId' in item || errTips();
      });
      return !result;
    },
    /**判断使用证据是否选择服务 */
    checkOtherServiceList(otherServiceList) {
      let ble = true;
      this.filterNullOtherService(otherServiceList).forEach((element) => {
        ble = !element.productSkuId && false;
      });
      return ble;
    },
    /**过滤 null 使用证据商品 */
    filterNullOtherService(list) {
      let newList = [];
      for (let i = 0; i < list.length; i++) {
        if (Object.keys(list[i]).length != 0) {
          newList.push(list[i]);
        }
      }
      return newList;
    },
    /**判断用户选择哪种类型  两种 选其一 || 未选择 || 全选 */
    getUserSchemeType() {
      let { gKey1, gKey2 } = this.$refs,
        condition = JSON.stringify(gKey1.serviceData);
      if (gKey2 != undefined && condition != '{}') {
        //用户全选两种付费方案
        this.planInfo = this.setPlaninfo();
      } else if (gKey2 == undefined && condition != '{}') {
        //单选 OA
        this.planInfo.oaServiceList = this.setPlaninfo().oaServiceList;
      } else if (gke2 !== undefined && condition == '{}') {
        //单选Other
        this.planInfo.otherServiceList = this.setPlaninfo().otherServiceList;
      }
    },

    /**设置保存方案参数 */
    setParm() {
      let { serviceId, workId, id } = this.getDelworkInfo();
      this.planInfo.replyStr = this.textarea;
      this.planInfo.oaServiceList = this.planInfo.oaServiceList
        .filter((item) => Object.keys(item).length > 0)
        .map((item) => {
          item.evidenceComboName = item.oaServiceName + '-' + item.evidenceComboName;
          return item;
        }); //过滤空的方法
      this.planInfo.otherServiceList = this.planInfo.otherServiceList
        .filter((item) => Object.keys(item).length > 0)
        .map((item) => {
          item.evidenceComboName = item.otherServiceName + '-' + item.evidenceComboName;
          return item;
        });
      // console.log('提交的方案', this.planInfo);
      return {
        planInfo: JSON.stringify(this.planInfo),
        serviceId,
        workId,
        oaFileId: id,
      };
    },

    /** 返回 用户选择的付费方案 */
    setPlaninfo() {
      let { gKey1, gKey2 } = this.$refs;
      let oaServiceList = JSON.parse(JSON.stringify([...gKey1.serviceData]));
      let otherServiceList = [];
      if (gKey2) {
        this.$refs.gKey2.forEach((item) => {
          otherServiceList.push(...item.serviceData);
        });
      }

      let planInfo = {
        replyStr: this.textarea, //答复建议
        oaServiceList, //oa方案
        otherServiceList: JSON.parse(JSON.stringify(otherServiceList)), //使用证据方案
      };
      return planInfo;
    },

    /**保存用户付费方案 */
    async saveProgramme(parm) {
      console.log('保存用户付费方案', parm);
      let { code, data } = addTrademarkReplyPlan(parm);
      console.log(data);
    },
  },
};
</script>
<style lang='less' scoped>
.add-evdence-goods-item {
  position: relative;
  .delect-item {
    position: absolute;
    right: 0%;
    top: 0px;
    width: 100px;
    text-align: right;
    z-index: 2;
    > i {
      font-size: 20px;
    }
  }

  > div {
    z-index: 1;
  }
}
.answer-suggestions {
  margin-bottom: 20px;
}
</style>