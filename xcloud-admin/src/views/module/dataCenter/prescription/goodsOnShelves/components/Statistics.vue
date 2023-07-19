<template>
  <a-row class="cell-wrap" type="flex">
    <a-col flex="1" class="cell">
      <div class="title-top">机会点创建</div>
      <div class="num-max">200</div>
      <div class="text-flex">
        <div class="flex1">机会点处理数 15</div>
        <div class="flex1">处理时效：0h0min</div>
      </div>
    </a-col>
    <a-col flex="1" class="cell">
      <div class="title-top">需求创建数</div>
      <div class="num-max">200</div>
      <div class="text-flex">
        <div class="flex1">需求处理数 15</div>
        <div class="flex1">处理时效：0h0min</div>
      </div>
    </a-col>
    <a-col flex="1" class="cell">
      <div class="title-top">完成开发数</div>
      <div class="num-max">200</div>
      <div class="text-flex">
        <div class="flex1">完成开发时效：0h0min</div>
      </div>
    </a-col>
    <a-col flex="1" class="cell">
      <div class="title-top">完成上市数</div>
      <div class="num-max">200</div>
      <div class="text-flex"></div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { customerLeadAccountStatistics } from '@/api/customerManage/dataSource';

const statisticsInfo: any = ref({});

onMounted(() => {
  // getStatistics();
});

//获取统计
const getStatistics = () => {
  customerLeadAccountStatistics().then((res: any) => {
    statisticsInfo.value = res;
  });
};
</script>

<style scoped lang="less">
.cell-wrap {
  padding-bottom: 10px;
  .ant-col {
    background-color: #fff;
    box-shadow: -2px 0px 10px 0px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    margin: 10px 10px 0;
    text-align: center;
    padding: 10px 0;
    .title-top {
      line-height: 30px;
      font-size: 18px;
      font-weight: bold;
    }
    .num-max {
      line-height: 32px;
      font-size: 20px;
      font-weight: bold;
    }
    .text-flex {
      height: 22px;
      display: flex;
      .flex1 {
        flex: 1;
        font-size: 14px;
      }
    }
  }
}
</style>
