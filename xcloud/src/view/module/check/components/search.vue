<template>
  <div class="check-wrapper">
    <el-input placeholder="请输入手机号/订单号/服务号" ref="input" @focus="focus" @blur="blur" @input="input" @keyup.enter.native="check" v-model="val" clearable style="width: 300px">
      <slot slot="append" name="inputSlot"></slot>
    </el-input>
    <div v-show="!hiddenHistory">
      <HistoryList ref="historyList" :showHistory="showHistory" :historyKey="historyKey" :historyLength="5" @chooseHistoryItem="chooseItem" />
    </div>
    <CompanyList ref="companyist" :showCompany="showCompany" :historyKey="historyKey" :historyLength="5" :val="val" @chooseCompanyItem="chooseItem" />
  </div>
</template>

<script>
import HistoryList from '@/components/HistoryList';
import CompanyList from './companyList';
import { matchReg } from '../reg';
import { mapMutations } from 'vuex';
export default {
  props: {
    inputVal: String,
    hiddenHistory: Boolean,
  },
  data() {
    return {
      val: '',
      historyKey: 'checkHistoryList',
      showHistory: false,
      showCompany: false,
      type: '',
    };
  },
  components: {
    HistoryList,
    CompanyList,
  },
  watch: {
    inputVal(val) {
      this.$nextTick(() => {
        this.val = val;
      });
    },
  },
  computed: {
    isCompany() {
      return this.type === '5';
    },
  },
  methods: {
    focus() {
      this.showList();
    },
    blur() {
      setTimeout(() => {
        this.showHistory = false;
        this.showCompany = false;
      }, 300);
    },
    input() {
      this.showList();
    },
    showList() {
      this.matchRegFn();
      this.showHistory = !this.val || !this.isCompany;
      this.showCompany = !!(this.val && this.isCompany);
    },
    // 选择历史/公司
    chooseItem(val) {
      this.val = val;
      this.blur();
      this.matchRegFn();
      this.navigate();
    },
    check() {
      this.val = this.val.trim();
      if (!this.val) {
        this.$message.warning('请输入关键词');
        return;
      }
      this.matchRegFn();
      if (!this.type) {
        this.$message.warning('请输入正确格式');
        return;
      }
      if (this.type === '5') {
        setTimeout(() => {
          this.$refs.input.focus();
          this.showCompany = true;
        }, 300);
        return;
      }
      this.$refs.historyList.setHistoryList(this.val);
      this.navigate();
    },
    ...mapMutations(['setCheck']),
    navigate() {
      this.setCheck(true);
      this.setStorage();
      this.$emit('check', {
        val: this.val,
        type: this.type,
      });
      // this.$router.push({
      //   name: 'checkResult',
      //   params: {
      //     val: this.val,
      //     type: this.type,
      //   },
      // });
    },
    setStorage() {
      setTimeout(() => {
        localStorage.setItem(
          'checkObj',
          JSON.stringify({
            val: this.val,
            type: this.type,
          })
        );
      });
    },
    matchRegFn() {
      this.val = this.val.trim();
      this.type = matchReg(this.val);
    },
  },
};
</script>

<style lang="less" scoped>
.check-wrapper {
  margin-right: 20px;
  position: relative;
  .history-list,
  .company-list {
    width: 228px;
  }
}
.el-input-group__append button.el-button {
  background-color: #1890ff !important;
}
</style>
