<template>
  <!-- 参与活动 -->
  <div class="wrap" v-if="resData.status === 'haveBonus' || resData.status === 'exBonus' || resData.status === null">
    <div class="head-wrap">
      <div class="title-btn">
        <div class="welcome">
          <span class="hi-icon">
            <img src="@/assets/img/salesBonus/hi_icom.svg" />
          </span>
          <span>欢迎回来，{{ resData.name || '-' }}！</span>
        </div>
        <div class="btn">
          <a-space>
            <a-button class="bg-yellow" type="danger" @click="reportExplain()"> 报表说明 </a-button>
            <a-button
              type="primary"
              @click="saleConfigPage()"
              v-if="useButton('xcloudplat_workOrder_salesBonus_configure')"
            >
              数据源配置
            </a-button>
            <a-button
              type="primary"
              @click="detailedReportPage()"
              v-if="useButton('xcloudplat_workOrder_salesBonus_detailedReport')"
            >
              明细报表
            </a-button>
          </a-space>
        </div>
      </div>
      <div class="text-tips">
        <span class="bonus" v-if="resData.status === 'haveBonus'">
          您已参与奖金活动,已获得奖金 {{ resData.bonus || 0 }} 元
        </span>
        <span class="bonus" v-else-if="resData.status === 'exBonus'">
          您已参与奖金活动，获取奖金还需 {{ resData.differencePerformance || 0 }} 元业绩
        </span>
        <span class="cycle">活动周期: {{ resData.period }}</span>
        <span class="time"> <SyncOutlined class="time-icon" />更新时间：{{ resData.turnoverTime }}</span>
      </div>
    </div>
    <div class="data-box">
      <div class="li">
        <div class="img">
          <img src="@/assets/img/salesBonus/data_icon1.svg" />
        </div>
        <div class="cont">
          <div class="title-tips">当前总奖金额</div>
          <div class="num">
            <span class="num-max">{{ resData.currentTotalBonus || 0 }}</span>
            <span>元</span>
          </div>
          <div class="text-tips">当前奖金基数 {{ resData.bonusCardinalNumber || 0 }} %</div>
        </div>
      </div>
      <div class="li">
        <div class="img">
          <img src="@/assets/img/salesBonus/data_icon2.svg" />
        </div>
        <div class="cont">
          <div class="title-tips">奖金可参与分配人数</div>
          <div class="num">
            <span class="num-max">{{ resData.participatoryBonusPeople || 0 }}</span>
            <span>人</span>
          </div>
          <div class="text-tips">
            <span>环比昨日 </span>
            <span> {{ resData.yesterdayParticipatoryBonusPeople || 0 }} 人 </span>
            <span>
              <CaretUpOutlined style="color: red" v-if="resData.yesterdayParticipatoryBonusPeople > 0" />
              <CaretDownOutlined style="color: green" v-else-if="resData.yesterdayParticipatoryBonusPeople < 0" />
            </span>
          </div>
        </div>
      </div>
      <div class="li">
        <div class="img">
          <img src="@/assets/img/salesBonus/data_icon3.svg" />
        </div>
        <div class="cont">
          <div class="title-tips">参与分配奖金最低业绩线</div>
          <div class="num">
            <span class="num-max">{{ resData.currentAveragePerformance || 0 }}</span>
            <span>元</span>
          </div>
          <div class="text-tips">
            <span>环比昨日 </span>
            <span> {{ resData.yesterdayCurrentAveragePerformance || 0 }} 元 </span>
            <span>
              <CaretUpOutlined style="color: red" v-if="resData.yesterdayCurrentAveragePerformance > 0" />
              <CaretDownOutlined style="color: green" v-else-if="resData.yesterdayCurrentAveragePerformance < 0" />
            </span>
          </div>
        </div>
      </div>
      <div class="li">
        <div class="img">
          <img src="@/assets/img/salesBonus/data_icon4.svg" />
        </div>
        <div class="cont">
          <div class="title-tips">当前所得奖金</div>
          <template v-if="resData.status === 'exBonus'"> - </template>
          <template v-else>
            <div class="num">
              <span class="num-max">{{ resData.bonus || 0 }}</span>
              <span>元</span>
            </div>
            <div class="text-tips">
              <span>环比昨日 </span>
              <span> {{ resData.yesterdayBonus || 0 }} 元 </span>
              <span>
                <CaretUpOutlined style="color: red" v-if="resData.yesterdayBonus > 0" />
                <CaretDownOutlined style="color: green" v-else-if="resData.yesterdayBonus < 0" />
              </span>
            </div>
            <div class="text-tips">提升1名预计增加奖金 {{ resData.promoteBonus || 0 }} 元</div>
          </template>
        </div>
      </div>
      <div class="li">
        <div class="img">
          <img src="@/assets/img/salesBonus/data_icon5.svg" />
        </div>
        <div class="cont">
          <div class="title-tips">你的排名</div>
          <div class="num">
            <span class="num-max">{{ resData.ranking || 0 }}</span>
          </div>
          <div class="text-tips">
            <span>环比昨日 </span>
            <span> {{ resData.yesterdayRanking || 0 }} 名 </span>
            <span>
              <CaretUpOutlined style="color: red" v-if="resData.yesterdayRanking > 0" />
              <CaretDownOutlined style="color: green" v-else-if="resData.yesterdayRanking < 0" />
            </span>
          </div>
          <div class="text-tips">提升1名所需业绩 {{ resData.promotePerformance || 0 }} 元</div>
        </div>
      </div>
    </div>
    <div class="progress-wrap">
      <div class="progress-title">总奖金基数翻倍所需业绩 {{ resData.doublePerformanceShort || 0 }} 元</div>
      <div class="progress-main">
        <div class="progress-strip">
          <div class="progress-in" :style="{ width: (resData.schedule || 0) + '%' }">
            <a-tooltip
              :title="'当前进度 ' + (resData.schedule || 0) + ' %'"
              :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"
              color="#FFA500"
              :overlayStyle="{ zIndex: 1 }"
            >
              <div class="spot-icon"></div>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="echart-wrap">
      <div class="echart-title">
        <span>个人业绩趋势（近7日）</span>
        <span class="more-btn">
          <a-button type="primary" @click="openMore()">
            <AppstoreOutlined />
            <span>查看更多</span>
          </a-button>
        </span>
      </div>
      <div class="echart-main">
        <div ref="myChartRef" class="charts" style="height: 100%">图表</div>
      </div>
    </div>
    <ReportExplainModal ref="reportExplainModal" :remarkHtml="resData.remark" />
    <MoreView ref="moreView" :dataSource="resData.dataConversion || []" />
  </div>
  <!-- 未参与活动 -->
  <div class="not-participating" v-else-if="resData.status === 'unqualified'">
    <div class="cont">
      <img class="img" src="@/assets/img/salesBonus/not-participating-img.png" />
      <p class="tips-text">Hi，{{ resData.name || '-' }}，您尚未参与奖金活动</p>
      <p v-if="useButton('xcloudplat_workOrder_salesBonus_configure')">
        <a-button style="width: 110px; margin: 10px 0" type="primary" @click="saleConfigPage()"> 数据源配置 </a-button>
      </p>
      <p v-if="useButton('xcloudplat_workOrder_salesBonus_detailedReport')">
        <a-button style="width: 110px" type="primary" @click="detailedReportPage()"> 明细报表 </a-button>
      </p>
    </div>
  </div>
  <!-- 活动未开始 -->
  <div class="not-participating" v-else-if="resData.status === 'haveNotStarted'">
    <div class="cont">
      <img class="img" src="@/assets/img/salesBonus/not-participating-img.png" />
      <p class="tips-text">Hi，{{ resData.name || '-' }}，活动未开始</p>
      <p v-if="useButton('xcloudplat_workOrder_salesBonus_configure')">
        <a-button style="width: 110px; margin: 10px 0" type="primary" @click="saleConfigPage()"> 数据源配置 </a-button>
      </p>
      <p v-if="useButton('xcloudplat_workOrder_salesBonus_detailedReport')">
        <a-button style="width: 110px" type="primary" @click="detailedReportPage()"> 明细报表 </a-button>
      </p>
    </div>
  </div>
  <div v-else>加载中...</div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, onUnmounted, nextTick } from 'vue';
import { SyncOutlined, CaretUpOutlined, CaretDownOutlined, AppstoreOutlined } from '@ant-design/icons-vue';
import { jumpPage, useButton } from '@/utils/utils';
import * as echarts from 'echarts';
import ReportExplainModal from './components/ReportExplainModal.vue';
import MoreView from './components/MoreView.vue';
import { selectMarketPersonalCenter } from '@/api/dataCenter/salesBonus';
import { decode } from 'js-base64';

const myChartRef: Ref = ref(null);
const resData: any = ref({});

onMounted(() => {
  getMainInfo();
});

//报表说明
const reportExplainModal: Ref = ref(null);
const reportExplain = () => {
  reportExplainModal.value.showModal = true;
};

//数据源配置
const saleConfigPage = () => {
  jumpPage('/dataCenter/revenue/salesBonus/saleConfig');
};

//明细报表
const detailedReportPage = () => {
  jumpPage('/dataCenter/revenue/salesBonus/detailedReport');
};

//更多
const moreView: Ref = ref(null);
const openMore = () => {
  moreView.value.showDrawer = true;
};

//获取配置信息
const getMainInfo = () => {
  selectMarketPersonalCenter({}).then((res: any) => {
    res.remark = decode(res.remark);
    resData.value = res || {};
    if (resData.value.status !== 'unqualified' && resData.value.status !== 'haveNotStarted') {
      nextTick(() => {
        setEchart((res.dataConversion || []).slice(-7));
      });
    }
  });
};

//设置图表
const setEchart = (list = []) => {
  const myChart = echarts.init(myChartRef.value);
  myChart.setOption({
    color: ['#2076F2'],
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      containLabel: true,
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    xAxis: {
      type: 'category',
      // boundaryGap: false,
      data: list.map((v: any) => v.date),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}',
      },
    },
    series: [
      {
        name: '个人业绩',
        data: list.map((v: any) => v.value),
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(24,144,255,0.27)',
            },
            {
              offset: 1,
              color: 'rgba(24,144,255,0)',
            },
          ]),
        },
      },
    ],
  });
  window.onresize = () => {
    myChart.resize();
  };
};

onUnmounted(() => {
  window.onresize = null;
});
</script>

<style scoped lang="less">
.wrap {
  .head-wrap {
    padding: 20px;
    background-color: #fff;
    .title-btn {
      height: 32px;
      line-height: 32px;
      display: flex;
      .welcome {
        flex: 1;
        font-size: 16px;
        color: #333;
        font-weight: bold;
        .hi-icon {
          float: left;
          img {
            width: 24px;
            height: 24px;
            float: left;
            margin: 4px;
          }
        }
      }
      .btn {
        flex: 1;
        text-align: right;
      }
    }
    .text-tips {
      height: 24px;
      line-height: 24px;
      margin-top: 20px;
      font-size: 14px;
      .bonus {
        font-size: 16px;
        color: #333;
        font-weight: bold;
      }
      .cycle {
        color: #666;
        margin-left: 30px;
        padding-left: 30px;
        border-left: 1px solid rgba(0, 0, 0, 0.06);
      }
      .time {
        color: #999;
        float: right;
        .time-icon {
          font-size: 12px;
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }
  }
  .data-box {
    padding: 24px 16px;
    margin-top: 24px;
    background-color: #fff;
    display: flex;
    .li {
      flex: 1;
      display: flex;
      padding: 0 16px;
      border-left: 1px solid rgba(0, 0, 0, 0.06);
      .img {
        width: 72px;
        height: 72px;
        img {
          width: 100%;
        }
      }
      .cont {
        flex: 1;
        margin-left: 20px;
        .title-tips {
          line-height: 24px;
          font-size: 14px;
          color: #666;
        }
        .num {
          font-size: 14px;
          color: #333;
          font-weight: 400;
          margin-bottom: 8px;
          .num-max {
            font-size: 30px;
            margin-right: 8px;
          }
        }
        .text-tips {
          line-height: 24px;
          font-size: 14px;
          color: #333;
        }
      }
    }
    .li:first-child {
      border-left: 0;
    }
  }
  .progress-wrap {
    margin-top: 24px;
    background-color: #fff;
    padding: 0 20px;
    .progress-title {
      height: 56px;
      line-height: 56px;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }
    .progress-main {
      padding: 8px 0 28px;
      .progress-strip {
        height: 18px;
        background: #e9f4ff;
        border-radius: 100px;
        .progress-in {
          position: relative;
          height: 18px;
          width: auto;
          background: linear-gradient(
            180deg,
            #49a8ff 0%,
            #0588ff 46%,
            #0588ff 56%,
            #0588ff 67%,
            #44a6ff 100%,
            #44a6ff 100%
          );
          border-radius: 100px;
          .spot-icon {
            position: absolute;
            right: -14px;
            top: -5px;
            width: 28px;
            height: 28px;
            z-index: 1;
            cursor: pointer;
            background: url('@/assets/img/salesBonus/progress_spot.png') no-repeat;
          }
        }
      }
    }
  }
  .echart-wrap {
    margin-top: 24px;
    background-color: #fff;
    padding: 0 20px;
    .echart-title {
      height: 56px;
      line-height: 56px;
      color: #000;
      font-size: 14px;
      font-weight: 400;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      .more-btn {
        float: right;
      }
    }
    .echart-main {
      height: 400px;
      padding: 20px;
    }
  }
}
.not-participating {
  background-color: #fff;
  height: calc(100vh - 90px);
  text-align: center;
  padding-top: 34vh;
  .cont {
    img {
      margin-bottom: 10px;
    }
    .tips-text {
      font-size: 16px;
      color: #666;
      font-weight: 400;
    }
  }
}
</style>
