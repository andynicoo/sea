<!-- 答复审查意见方案Item  -->
<template>

  <div>
    <div class="main" v-for="(item,idx) in infoList" :key="idx">
      <div class="p-herad">
        <span class="p-title">方案{{idx+1}}</span>
        <span class="p-delect">
          <el-button v-show="hideDele" type="primary" @click="deleteItem(item.id)" icon="el-icon-delete" circle></el-button>
        </span>
      </div>
      <div class="p-conten">
        <div class="p-proposal-hader">
          <div class="text">答复建议: {{seeBtnShow(item.planInfo.replyStr,item.planInfo)}}</div>
          <el-button v-show="item.planInfo.isSee " @click="seeProposal(item.planInfo.replyStr,idx)">查看</el-button>
        </div>
        <div>
          <div class="p-proposal">OA服务付费</div>
          <oa-table :list="item.planInfo.oaServiceList" :type="1" @updatePlanInfo="(val)=> updatePlanInfo(val,'oa',idx)"></oa-table>
        </div>
        <div>
          <div class="p-proposal">其他服务内容</div>
          <oa-table :list="item.planInfo.otherServiceList" :type="2" @updatePlanInfo="(val)=> updatePlanInfo(val,'other',idx)"></oa-table>
        </div>
      </div>

    </div>
    <look-proposaldetail v-if="isShowLook" :lookTranslateModal.sync="isShowLook" :text="currentText"></look-proposaldetail>
  </div>

</template>

<script>
import OaTable from './oaTable/index.vue';
import { getFileDetails, delById } from '@/api/newApi/intellectualProperty/trademark';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ProgrammeList',
  props: {
    hideDele: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      infoList: [],
      isShowLook: false,
      currentText: '',
    };
  },

  components: {
    OaTable,
    LookProposaldetail: () => import('./proposal/lookProposaldetail.vue'),
  },

  computed: {},
  created() {
    this.getList();
  },
  methods: {
    ...mapGetters(['getDelworkInfo']),
    async getList() {
      try {
        let { code, data } = await getFileDetails({ id: this.getDelworkInfo().id });
        if (code == 0) {
          let { planList } = data;
          this.infoList = planList
            .map((item) => {
              if (item.planInfo != '') {
                item.planInfo = JSON.parse(item.planInfo);
              }
              return item;
            })
            .filter((item) => item.planInfo != '');
        }
      } catch (error) {
      } finally {
        this.savePlanInfo(this.infoList);
      }
      // console.log('OA服务付费', this.infoList);
    },

    setRefName(key) {
      return 'proposaldetail' + key;
    },

    async delByIdFun(id) {
      let { message, code } = await delById(id);
      if (code == 0) {
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
        this.getList();
      } else {
        this.$message({
          type: 'err',
          message: message || '删除失败',
        });
      }
    },
    /**删除一条 */
    async deleteItem(id) {
      this.$confirm('确认删除此方案?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.delByIdFun(id);
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除',
          });
        });
    },

    /**显示查看按钮 */
    seeBtnShow(text, item) {
      console.log('textVal', text);
      console.log('textVal', text.length);
      if (text && text.length >= 36) {
        item.isSee = true;
      }
      return text;
    },

    seeProposal(data, idx) {
      this.isShowLook = true;
      this.currentText = data;
      console.log('currentText', this.isShowLook);
      // console.log(id,idx);
      // console.log('sing',this.$refs[(() => 'proposaldetail' + id)().toString()][idx]);
      // this.$refs[(() => 'proposaldetail' + id)().toString()][idx].setLookTranslateModalVal(true);
    },

    ...mapMutations(['savePlanInfo']),
    updatePlanInfo(newVal, key, idx) {
      let { otherServiceList, oaServiceList } = this.infoList[idx].planInfo;
      key == 'other'
        ? this.setNewPlanInfoListItem('otherServiceList', newVal, idx)
        : this.setNewPlanInfoListItem('oaServiceList', newVal, idx);
    },
    /**保存更新后的 PlanInfo */
    setNewPlanInfoListItem(objKey, newData, index) {
      try {
        let idx = this.infoList[index].planInfo[objKey].findIndex((item) => item.productSkuId == newData.productSkuId);
        if (idx != -1) this.infoList[index].planInfo[objKey][newData.key] = newData.value;
      } catch (error) {
        console.error('updatePlanInfoErr,setNewPlanInfoListItem function');
        this.savePlanInfo(this.infoList);
      } finally {
        this.savePlanInfo(this.infoList);
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.main {
  width: 100%;
  margin-top: 10px;
  border: 1px solid rgb(215, 215, 215);
}
.p-herad {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid;
  font-size: 18px;
  padding: 5px;
}
.p-conten {
  padding: 5px;
}
.p-proposal-hader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .text {
    display: inline-block;
    white-space: nowrap; //不换行
    overflow: hidden; //超出隐藏
    text-overflow: ellipsis; //变成...
  }
}
.p-modal {
}
</style>