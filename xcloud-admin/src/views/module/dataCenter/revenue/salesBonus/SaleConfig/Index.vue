<template>
  <div class="cell">
    <div class="box-wrap">
      <div class="box-title">
        <span class="text2">时间维度：</span>
        <!-- <span class="edit-btn" @click="edit()"><EditOutlined /> 编辑</span> -->
      </div>
      <div class="main">
        <div class="flex-text">
          <div class="li">
            活动时间：
            <a-range-picker
              v-model:value="data.formModal.newActivityTimeList"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              show-time
            />
          </div>
        </div>
      </div>
    </div>
    <div class="box-wrap">
      <div class="box-title">
        <span class="text2">人数维度：</span>
        <span class="edit-btn" @click="openDrawer('people')"><EditOutlined /> 编辑</span>
      </div>
      <div class="main">
        <div class="flex-text">
          <div class="li">参与人数： {{ getUserNum(1) }} 人</div>
          <div class="li">复购人数： {{ getUserNum(2) }} 人</div>
          <div class="li">首购人数： {{ getUserNum(3) }} 人</div>
        </div>
      </div>
    </div>
  </div>

  <div class="cell-bg">
    <div class="cell-bg-title">奖金计算参数：</div>
    <div class="cell">
      <div class="box-wrap" style="padding-right: 0">
        <div class="box-title">
          <span class="text">奖金基数配置：</span>
          <span class="edit-btn" @click="openDrawer('bonus')"><EditOutlined /> 编辑</span>
        </div>
        <div class="main">
          <a-table
            size="small"
            :data-source="data.formModal.bonusRulesVOList || []"
            :pagination="false"
            :scroll="{ scrollToFirstRowOnChange: true, y: '200px' }"
            bordered
          >
            <a-table-column title="业绩下限【>=】" data-index="resultsOffline" />
            <a-table-column title="业绩上限【<】" data-index="resultsOnline" />
            <a-table-column title="奖金比例" data-index="bonusProportion" #default="{ record }">
              {{ record.bonusProportion }} %
            </a-table-column>
          </a-table>
        </div>
      </div>
      <div class="box-wrap" style="padding-left: 0">
        <div class="box-title">
          <span class="text">首购规格配置：</span>
          <span class="edit-btn" @click="openDrawer('firstpurchase')"><EditOutlined /> 编辑</span>
        </div>
        <div class="main">
          <div class="bg-grey">
            <div class="text-p" v-for="(li, index) of data.formModal.firstShopRuleVOList || []" :key="index">
              <span>首购个人平均业绩</span>
              <span>
                <template v-if="li.numericalValue === 'GreaterThan'"> 大于 </template>
                <template v-if="li.numericalValue === 'GreaterThanOrEqualTo'"> 大于等于 </template>
                <template v-if="li.numericalValue === 'LessThan'"> 小于 </template>
                <template v-if="li.numericalValue === 'LessThanOrEqualTo'"> 小于等于 </template>
                <template v-if="li.numericalValue === 'EqualTo'"> 等于 </template>
              </span>
              <span> {{ li.performance }} </span>
              <span> 则 按照 </span>
              <span>
                <template v-if="li.type === 'ActualPerformance'">实际业绩 </template>
                <template v-else-if="li.type === 'SetRideOrdersNum'">{{ li.performance }} * 订单量 </template>
              </span>
              <span>计算业绩</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cell">
      <div class="box-wrap" style="padding-right: 0">
        <div class="box-title">
          <span class="text">特殊翻倍规则：</span>
          <span class="edit-btn" @click="openDrawer('double')"><EditOutlined /> 编辑</span>
        </div>
        <div class="main">
          <a-table
            size="small"
            :data-source="data.formModal.specialDoubleVOList || []"
            :pagination="false"
            :scroll="{ scrollToFirstRowOnChange: true, y: '200px' }"
            bordered
          >
            <a-table-column title="业绩翻倍日期" data-index="performanceDoubleDate" #default="{ record }">
              {{ record.performanceDoubleDate.join(' 至 ') }}
            </a-table-column>
            <a-table-column title="倍数" data-index="multiple" />
          </a-table>
        </div>
      </div>
      <div class="box-wrap" style="padding-left: 0">
        <div class="box-title">
          <span class="text">页面备注编辑：</span>
          <span class="edit-btn" @click="openDrawer('remark')"><EditOutlined /> 编辑</span>
        </div>
        <div class="main">
          <div class="bg-grey">
            <div v-html="data.formModal.remark"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="sub-cell">
      <a-button type="primary" @click="submit()">保存配置</a-button>
    </div>
  </div>

  <PeopleDrawer ref="peopleDrawer" :list="data.formModal.personnelDimensionList" @submit="submitParams" />
  <BonusDrawer ref="bonusDrawer" :list="data.formModal.bonusRulesVOList" @submit="submitParams" />
  <FirstpurchaseDrawer ref="firstpurchaseDrawer" :list="data.formModal.firstShopRuleVOList" @submit="submitParams" />
  <DoubleDrawer
    ref="doubleDrawer"
    :list="data.formModal.specialDoubleVOList"
    :formModal="data.formModal"
    @submit="submitParams"
  />
  <RemarkDrawer ref="remarkDrawer" :remark="data.formModal.remark" @submit="submitParams" />
</template>

<script setup lang="ts">
import { ref, reactive, type Ref, onMounted } from 'vue';
import { EditOutlined } from '@ant-design/icons-vue';
import PeopleDrawer from './components/PeopleDrawer.vue';
import BonusDrawer from './components/BonusDrawer.vue';
import FirstpurchaseDrawer from './components/FirstpurchaseDrawer.vue';
import DoubleDrawer from './components/DoubleDrawer.vue';
import RemarkDrawer from './components/RemarkDrawer.vue';
import { selectSalesCommissionsConfig, addSalesCommissionsConfig } from '@/api/dataCenter/salesBonus';
import { message, Modal } from 'ant-design-vue';
import { decode, encode } from 'js-base64';
import { onBeforeRouteLeave } from 'vue-router';

const data: any = reactive({
  copyData: {},
  formModal: {},
});

onMounted(() => {
  getConfigInfo();
});

onBeforeRouteLeave((to: any, from: any, next: any) => {
  if (data.copyData !== JSON.stringify(data.formModal)) {
    Modal.confirm({
      title: '提示',
      content: '当前配置未保存，离开将会丢失所有配置',
      onOk() {
        if (to.path) {
          next();
        } else {
          next('/login');
        }
      },
      onCancel() {
        next(from);
      },
    });
  } else {
    next();
  }
});

//提交
const submit = () => {
  if (!data.formModal.newActivityTimeList) {
    message.error('请选择活动时间');
    return false;
  }
  if (data.formModal.personnelDimensionList && data.formModal.personnelDimensionList.length === 0) {
    message.error('请选择人数维度');
    return false;
  }

  addSalesCommissionsConfig(
    Object.assign({}, data.formModal, {
      remark: encode(data.formModal.remark),
    })
  ).then((res: any) => {
    message.success('保存成功');
    getConfigInfo();
  });
};

//获取配置信息
const getConfigInfo = () => {
  selectSalesCommissionsConfig({}).then((res: any) => {
    res.remark = decode(res.remark);
    data.formModal = res;
    data.copyData = JSON.stringify(data.formModal);
  });
};

//提交子项参数
const submitParams = (obj: { keyStr: string; value: Array<any> }) => {
  data.formModal[obj.keyStr] = obj.value;
};

//打开弹窗
const peopleDrawer: Ref = ref(null);
const bonusDrawer: Ref = ref(null);
const firstpurchaseDrawer: Ref = ref(null);
const doubleDrawer: Ref = ref(null);
const remarkDrawer: Ref = ref(null);
const openDrawer = (type: string) => {
  if (type === 'people') {
    peopleDrawer.value.showDrawer = true;
  } else if (type === 'bonus') {
    bonusDrawer.value.showDrawer = true;
  } else if (type === 'firstpurchase') {
    firstpurchaseDrawer.value.showDrawer = true;
  } else if (type === 'double') {
    doubleDrawer.value.showDrawer = true;
  } else if (type === 'remark') {
    remarkDrawer.value.showDrawer = true;
  }
};

//过滤人数维度显示
const getUserNum = (type: number) => {
  if (data.formModal.personnelDimensionList && data.formModal.personnelDimensionList.length > 0) {
    if (type === 1) {
      return data.formModal.personnelDimensionList.length;
    } else if (type === 2) {
      return data.formModal.personnelDimensionList.filter((v: any) => v.teamTypeName === '复购').length;
    } else if (type === 3) {
      return data.formModal.personnelDimensionList.filter((v: any) => v.teamTypeName !== '复购').length;
    }
  } else {
    return 0;
  }
};
</script>

<style scoped lang="less">
.cell {
  display: flex;
  margin-bottom: 24px;
  .box-wrap:first-child {
    margin-left: 0;
  }
  .box-wrap {
    flex: 1;
    padding: 18px 15px;
    background-color: #fff;
    margin-left: 24px;
    .box-title {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      margin-bottom: 10px;
      .text {
        color: #666;
        margin-left: 15px;
        font-weight: 500;
      }
      .text2 {
        font-size: 16px;
        color: #333;
      }
      .edit-btn {
        float: right;
        color: #1890ff;
        padding: 0 10px;
        cursor: pointer;
        margin-right: 20px;
        .anticon {
          margin-right: 5px;
        }
      }
    }
    .main {
      &:deep(.ant-table-tbody .ant-table-cell) {
        color: #666;
      }
      &:deep(.ant-picker-range input) {
        color: #666;
      }
      .flex-text {
        display: flex;
        font-size: 14px;
        color: #666;
        .li {
          flex: 1;
        }
      }
      .bg-grey {
        background-color: #f8f8f8;
        font-size: 14px;
        color: #666;
        height: 240px;
        overflow-y: auto;
        padding: 24px 15px;
        word-break: break-all;
        .text-p {
          line-height: 30px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
.cell-bg {
  background-color: #fff;
  .cell-bg-title {
    font-size: 16px;
    color: #333;
    font-weight: 500;
    line-height: 22px;
    padding: 28px 15px 0;
  }
  .sub-cell {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 14px 0;
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
