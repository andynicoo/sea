<template>
  <Modal v-model="show" title="答复审查意见" width="592" :footer-hide="true" @on-cancel="resetAnswer">
    <div class="answer-box">
      <div class="answer-box-content">
        <div class="answer-box-tips-yellow" v-if="step < 4">
          <img src="./img/ta-done.svg" alt="" />请于
          <span>{{ $moment(oaDetailInfo.lastDealDate).format('YYYY-MM-DD') }}</span
          >日前答复，逾期视为主动放弃，会导致商标注册失败
        </div>
        <!-- 答复流程 -->
        <div class="answer-box-panel" v-if="step < 4">
          <div class="answer-box-h3">答复流程</div>
          <stepTemplateVue :step="step" />
        </div>
        <!-- 步骤 -->
        <keep-alive><component :is="stepCompMap[step]" :ref="`comp${step}`"/></keep-alive>
      </div>
      <BtnSlot>
        <Button
          type="default"
          v-if="btnGropMap[step - 1][0].prevBtn.show"
          @click="btnGropMap[step - 1][0].prevBtn.todo()"
          >{{ btnGropMap[step - 1][0].prevBtn.text || '上一步' }}</Button
        >
        <Button type="primary" @click="btnGropMap[step - 1][0].nextBtn.todo()">{{
          btnGropMap[step - 1][0].nextBtn.text || '下一步'
        }}</Button>
      </BtnSlot>
    </div>
  </Modal>
</template>
<script>
import stepTemplateVue from './stepTemplate.vue';
import BtnSlot from './btnSlot.vue';
import StepOne from './step/one.vue';
import StepTwo from './step/two.vue';
import StepThree from './step/three.vue';
import StepFour from './step/four.vue';
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {
      show: false,
      step: 1,
      stepCompMap: {
        1: 'StepOne',
        2: 'StepTwo',
        3: 'StepThree',
        4: 'StepFour',
      },
      btnGropMap: [
        // 步骤一
        [
          {
            prevBtn: {
              show: false,
              todo: () => {},
            },
            nextBtn: {
              show: true,
              todo: () => {
                this.step++;
              },
            },
          },
        ],
        // 步骤二
        [
          {
            prevBtn: {
              show: true,
              todo: () => {
                this.step--;
              },
            },
            nextBtn: {
              show: true,
              todo: () => {
                this.step++;
              },
            },
          },
        ],
        [
          {
            prevBtn: {
              show: true,
              todo: () => {
                this.step--;
              },
            },
            nextBtn: {
              show: true,
              todo: () => {
                this.saveInfo();
              },
            },
          },
        ],
        [
          {
            prevBtn: {
              show: true,
              text: '返回修改',
              todo: () => {
                this.step--;
              },
            },
            nextBtn: {
              show: false,
              text: '确认',
              todo: async () => {
                try {
                  this.show = false;
                  this.$Spin.show();
                  const choosePlanProduct = JSON.parse(this.choosePlan.planInfo).oaServiceList;
                  console.log('choosePlanProduct', choosePlanProduct);
                  if (choosePlanProduct.length) {
                    const res = await this.$refs['comp4'].createOrder();
                    const { data } = res;
                    if (data.orderNo !== '') {
                      // 有订单跳转到确认订单页面
                      this.$router.push({
                        path: '/sureOrder',
                        query: { id: data.id, type: 'oa' },
                      });
                    } else {
                      this.$emit('update');
                    }
                  } else {
                    await this.$refs['comp4'].submit();
                  }
                  this.$Spin.hide();
                  this.resetAnswer();
                  this.$emit('update');
                } catch (error) {
                  this.$Spin.hide();
                  this.resetAnswer();
                }
              },
            },
          },
        ],
      ],
    };
  },
  computed: {
    ...mapState({
      oaDetailInfo: (state) => state.newOa.oaDetailInfo,
      choosePlan: (state) => state.newOa.choosePlan,
    }),
  },
  components: { stepTemplateVue, BtnSlot, StepOne, StepTwo, StepThree, StepFour },
  methods: {
    ...mapMutations(['setUserAnswerInfo', 'setChoosePlan', 'setPlanActive']),
    next() {
      this.step++;
    },
    saveInfo() {
      this.$refs['comp3'].saveInfo();
      this.step++;
    },
    resetAnswer() {
      this.step = 1;
      this.setUserAnswerInfo(null);
      this.setChoosePlan(null);
      this.setPlanActive(0);
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-modal-body {
  padding: 14px 0 0;
}
/deep/ .answer-box-content {
  padding: 0 40px 24px;
}
.answer-box {
  font-size: 12px;
  color: #666666;
  line-height: 20px;
  &-tips {
    &-yellow {
      height: 38px;
      display: flex;
      align-items: center;
      background: #fffbe6;
      border-radius: 2px;
      border: 1px solid #ffe58f;
      font-size: 14px;
      color: #333333;
      padding: 0 14px;
      margin-bottom: 32px;
      span {
        color: #00a3ff;
      }
      img {
        width: 16px;
        margin-right: 6px;
      }
    }
  }
  &-panel {
    &:not(:last-child) {
      margin-bottom: 32px;
    }
  }
  &-h3 {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 16px;
    margin-bottom: 16px;
  }
  .box-1 {
    &-1 {
      background: #eff9ff;
      padding: 8px 16px;
      font-size: 12px;
      color: #666666;
      line-height: 20px;
      h3 {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        margin-bottom: 4px;
        line-height: 22px;
      }
    }
    &-2 {
      font-size: 14px;
      color: #666666;
      line-height: 22px;
      margin-top: 12px;
      a,
      span {
        color: #00a3ff;
      }
    }
  }
  .tips-text-yellow {
    font-size: 14px;
    color: #faad14;
    line-height: 22px;
  }
}
</style>
