<template>
  <div class="step-box-two">
    <h2>选择答复方案</h2>
    <div
      @click="choose(index)"
      v-for="(item, index) in list"
      :key="index"
      class="step-box-two-panel"
      :class="{ checked: planActive === index }"
    >
      <h3>答复建议{{ index + 1 }}</h3>
      <p class="text">{{ JSON.parse(item.planInfo).replyStr }}</p>
      <Table border :columns="serviceFeeColumns" :data="JSON.parse(item.planInfo).oaServiceList"></Table>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {
      serviceFeeColumns: [
        {
          title: '服务',
          key: 'evidenceComboName',
          align: 'center',
        },
        {
          title: '国家',
          key: 'oaCountry',
          align: 'center',
          width: '150px',
        },
        {
          title: '售价',
          key: 'oaPrice',
          align: 'center',
          width: '150px',
        },
      ],
      active: 0,
    };
  },
  computed: {
    ...mapState({
      list: (state) => state.newOa.userOaPlan,
      choosePlan: (state) => state.newOa.choosePlan,
      planActive: (state) => state.newOa.planActive,
    }),
  },
  methods: {
    ...mapMutations(['setChoosePlan', 'setPlanActive']),
    choose(index) {
      this.setChoosePlan(this.list[index]);
      this.setPlanActive(index);
    },
  },
  mounted() {
    if (this.list.length && !this.choosePlan) {
      this.choose(0);
    }
  },
  activated() {
    if (!this.choosePlan) {
      this.setChoosePlan(this.list[0]);
      this.setPlanActive(0);
    }
  },
};
</script>
<style lang="less" scoped>
.step-box-two {
  h2 {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    margin-bottom: 16px;
  }
  &-panel {
    border: 1px solid #c6ddea;
    font-size: 12px;
    color: #666666;
    line-height: 20px;
    padding: 12px 20px 28px;
    position: relative;
    margin-bottom: 16px;
    cursor: pointer;
    &::after {
      content: '';
      width: 32px;
      height: 31px;
      position: absolute;
      bottom: -2px;
      right: -1px;
      background: url(../img/check-d.svg) no-repeat left top / 100% auto;
    }
    &.checked {
      border-color: #00a3ff;
      &::after {
        background: url(../img/check-a.svg) no-repeat left top / 100% auto;
      }
    }
  }
}
/deep/ .ivu-table-header thead tr th {
  background: #f1f1f1;
}
</style>
