<template>
  <el-dialog title="正在对接税局进行数据传输" center :visible.sync="dialogvisible" width="600px" @close="reset">
    <div class="main-wrapper">
      <template v-if="[statusObj.SUBMIT, statusObj.WAIT].includes(status)">
        <template v-if="status === statusObj.SUBMIT">
          <div class="time">预计等待 {{ time }}s</div>
          <div class="tip1">请等待传输结果</div>
        </template>
        <template v-if="status === statusObj.WAIT">
          <div class="wait-tip">系统繁忙，请退出等待</div>
          <div class="wait-tip">若30min仍未获取申报结果，请联系产品经理</div>
        </template>
        <el-button class="btn back-btn" @click="back">返回</el-button>
        <div class="tip2">若等待结果过程中离开此页，请在申报工单详情页-申报记录查看传输结果</div>
      </template>
      <template v-if="status === statusObj.FAIL">
        <el-result icon="error" title="申报失败">
          <template slot="subTitle">
            <span class="text-tips">{{ failReason }}</span>
          </template>
          <template slot="extra">
            <div class="declare-info">
              <p>公司名称：{{ companyName }}</p>
              <p>申报国家：{{ countryName }}</p>
              <p>申报区间：{{ beginTime }} 至 {{ endTime }}</p>
              <p>申报时间：{{ submitTime }}</p>
            </div>
            <el-button @click="back">返回</el-button>
            <el-button type="primary" @click="back">重新提交</el-button>
          </template>
        </el-result>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import { TaxBureauStatus } from '@/api/newApi/taxServices/taxNumDeclare.js';
const statusObj = {
  SUBMIT: 'SUBMIT',
  WAIT: 'WAIT',
  FAIL: 'FAIL',
};
export default {
  props: {
    id: String,
    submitConfirmDialog: Boolean,
    productFunctionCode: Number,
    companyName: String,
    countryName: String,
    beginTime: String,
    endTime: String,
    submitTime: String,
    countryCode: String,
  },
  data() {
    return {
      statusObj,
      status: statusObj.SUBMIT,
      totalTime: 30,
      time: 0,
      percent: 0,
      stop: false,
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.submitConfirmDialog;
      },
      set(val) {
        this.$emit('update:submitConfirmDialog', val);
      },
    },
  },
  watch: {
    dialogvisible(val) {
      if (val) {
        this.time = this.totalTime;
        this.timeDown();
        this.getStatus();
      }
    },
  },
  methods: {
    getStatus() {
      this.timer = setTimeout(() => {
        TaxBureauStatus({
          id: this.id,
        }).then((res) => {
          if (res.code === 0) {
            this.status = res.data.responseStatus === 'WAIT' ? 'SUBMIT' : res.data.responseStatus;
            if (this.status === 'SUCCESS') {
              this.$message.success('提交成功');
              this.dialogvisible = false;
              this.$emit('refresh');
              this.back();
            }
            if (['SUCCESS', 'FAIL'].includes(this.status)) {
              this.failReason = res.data.responseMessage;
              if (this.timer) {
                clearInterval(this.timer);
              }
            }
            if (['', 'SUBMIT'].includes(this.status) && !this.stop) {
              this.getStatus();
            }
          }
        });
      }, 4000);
    },
    timeDown() {
      let timer = setInterval(() => {
        if (this.status !== 'SUBMIT') {
          clearInterval(timer);
        }
        if (this.time > 0) {
          this.time -= 1;
          this.percent = ((this.totalTime - this.time) / this.totalTime) * 100;
        } else {
          clearInterval(timer);
          this.stop = true;
          this.status = statusObj.WAIT;
        }
      }, 1000);
    },
    back() {
      this.dialogvisible = false;
    },
    reset() {
      this.status = statusObj.SUBMIT;
    },
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style lang="less" scoped>
.main-wrapper {
  text-align: center;
  .time {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .tip1 {
    margin-bottom: 10px;
  }
  .wait-tip {
    color: red;
    margin-bottom: 10px;
  }
  .btn {
    margin-top: 50px;
    margin-bottom: 10px;
  }
  .declare-info {
    text-align: left;
    line-height: 30px;
    margin-bottom: 20px;
  }
}
</style>
