<template>
  <div class="data-box">
    <div class="li">
      <div class="img">
        <img src="@/assets/img/salesBonus/data_icon1.svg" />
      </div>
      <div class="cont">
        <div class="num">{{ resData.currentTotalBonus || 0 }}</div>
        <div class="cont-tips">当前总奖金</div>
      </div>
    </div>
    <div class="li">
      <div class="img">
        <img src="@/assets/img/salesBonus/data_icon6.svg" />
      </div>
      <div class="cont">
        <div class="num">{{ resData.periodTotalPerformance || 0 }}</div>
        <div class="cont-tips">周期内总业绩</div>
      </div>
    </div>
    <div class="li">
      <div class="img">
        <img src="@/assets/img/salesBonus/data_icon7.svg" />
      </div>
      <div class="cont">
        <div class="num">{{ resData.currentAveragePerformance || 0 }}</div>
        <div class="cont-tips">当前平均业绩</div>
      </div>
    </div>
    <div class="li">
      <div class="img">
        <img src="@/assets/img/salesBonus/data_icon2.svg" />
      </div>
      <div class="cont">
        <div class="num">{{ resData.participatoryBonusPeople || 0 }}</div>
        <div class="cont-tips">可参与分配奖金人数</div>
      </div>
    </div>
    <div class="li">
      <div class="img">
        <img src="@/assets/img/salesBonus/data_icon8.svg" />
      </div>
      <div class="cont">
        <div class="num">{{ resData.participatoryTotalPerformance || 0 }}</div>
        <div class="cont-tips">参与分配人业绩汇总</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { selectSalesCommissionsSum } from '@/api/dataCenter/salesBonus';

const props = defineProps({
  params: {
    default: {},
  },
});
const resData: any = ref({});

//获取数据
const getList = () => {
  selectSalesCommissionsSum(props.params).then((res: any) => {
    resData.value = res || {};
  });
};

defineExpose({ getList });
</script>

<style scoped lang="less">
.data-box {
  display: flex;
  margin-bottom: 10px;
  .li {
    height: 100px;
    overflow: hidden;
    flex: 1;
    margin-left: 16px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    .img {
      width: 72px;
      height: 72px;
      margin: 14px;
    }
    .cont {
      flex: 1;
      .num {
        font-size: 30px;
        color: #333;
        font-weight: bold;
        line-height: 40px;
        margin: 10px 0;
      }
      .cont-tips {
        font-size: 14px;
        color: #666;
        line-height: 20px;
      }
    }
  }
  .li:first-child {
    margin-left: 0;
  }
}
</style>
