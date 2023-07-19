<template>
  <div class="echart-wrap">
    <div class="echart-box">
      <div class="echart-title">
        <div class="text">
          <span>{{ titleList[echartType].title || '图表标题展示' }}</span>
          <span class="tips-title" v-if="titleList[echartType].tips">
            <el-tooltip class="item" effect="dark" :content="titleList[echartType].tips" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
        </div>
        <div class="type">
          <el-select v-model="type" placeholder="请选择" style="width: 180px" @change="setDataList">
            <el-option value="AmountRank" label="销售额"></el-option>
            <el-option value="ProductSalesRank" label="商品销量"></el-option>
          </el-select>
        </div>
        <div class="more">
          <el-button type="primary" @click="more()"> 更 多 </el-button>
        </div>
      </div>
      <div class="echart-cont">
        <div ref="myChart" class="charts" style="height: 100%"></div>
        <el-button
          v-if="(echartType === 'department' || echartType === 'category') && level !== 1"
          class="return-Back"
          type="primary"
          @click="returnBack()"
        >
          返 回
        </el-button>
      </div>
    </div>
    <saleMoreModal
      ref="saleMoreModal"
      :title="titleList[echartType].title"
      :formModal="formModal"
      :type="titleList[echartType].type"
      :keyStr="echartType + type"
    />
  </div>
</template>

<script>
import echarts from 'echarts';
import { on, off } from '@/libs/tools';
import saleMoreModal from './saleMoreModal.vue';
import { getAnalyzeList } from '@/api/newApi/workOrder/dataCenter.js';

export default {
  components: {
    saleMoreModal,
  },
  data() {
    return {
      myChart: null,
      type: 'AmountRank',
      dataList: [],
      parentIdObj: {},
      level: 1,
      titleList: {
        department: {
          type: 2,
          title: '部门销售排行',
          tips: '点击部门柱形，可查看下级部门销售排行数据',
        },
        category: {
          type: 3,
          title: '类目销售分布',
          tips: '点击类目环形，可查看下级类目销售排行数据',
        },
        country: {
          type: 4,
          title: '国家销售分布',
          tips: '默认展示销售额/商品销量前5的商品销售额/商品销量',
        },
        supplier: {
          type: 5,
          title: '服务商销售排行',
          tips: '默认展示销售额/商品销量前10的服务商销售额/商品销量',
        },
        productSku: {
          type: 6,
          title: '商品销售排行',
        },
        manageUser: {
          type: 7,
          title: '人员销售排行',
        },
      },
    };
  },
  props: {
    echartType: {
      type: String,
      default: '-',
    },
    dataObj: {
      default: () => {},
    },
    formModal: {
      default: () => {},
    },
  },
  watch: {
    dataObj(newVal) {
      this.$nextTick(() => {
        this.setDataList();
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.myChart = echarts.init(this.$refs.myChart);
      on(window, 'resize', this.resize);
      if (this.echartType === 'department' || this.echartType === 'category') {
        const that = this;
        this.myChart.on('click', function (params) {
          that.getList(that.dataList[params.dataIndex].groupByType, that.dataList[params.dataIndex].level + 1);
        });
      }
    });
  },
  methods: {
    // 获取数据
    getList(id, level) {
      const params = Object.assign({}, this.formModal, this.pageSize, { type: this.titleList[this.echartType].type });
      if (this.echartType === 'department') {
        if (level > 5 || !id || id === '0') {
          return false;
        }
        params.departmentLevel = level;
        params.parentDepartmentId = id;
      }
      if (this.echartType === 'category') {
        if (level > 2 || !id) {
          return false;
        }
        params.parentProductCategoryId = id;
      }
      getAnalyzeList(params).then((res) => {
        if (res.code === 0) {
          const key = this.echartType + this.type;
          try {
            if (res.data.orderSalesModelVOMap[key].records.length > 0) {
              this.dataList = JSON.parse(JSON.stringify(res.data.orderSalesModelVOMap[key].records || []));
              this.setEchartType();
              this.parentIdObj[level] = id;
              this.level = level;
            }
          } catch (err) {
            this.dataList = [];
            this.setEchartType();
            console.warn(key);
          }
        }
      });
    },
    // 返回
    returnBack() {
      if (this.level === 2) {
        this.level = 1;
        this.setDataList();
      } else {
        this.getList(this.parentIdObj[this.level - 1], this.level - 1);
      }
    },
    // 更多
    more() {
      this.$refs.saleMoreModal.showModal = true;
    },
    // 设置图表数据
    setDataList(val) {
      const key = this.echartType + this.type;
      try {
        this.dataList = JSON.parse(JSON.stringify(this.dataObj[key].records || []));
        this.setEchartType();
      } catch (err) {
        this.dataList = [];
        this.setEchartType();
        console.warn(key);
      }
    },
    // 根据类型渲染图表
    setEchartType() {
      switch (this.titleList[this.echartType].title) {
        case '部门销售排行':
          this.setEchartBar1();
          break;
        case '类目销售分布':
          this.setEchartPie(['38%', '70%']);
          break;
        case '国家销售分布':
          this.dataList = this.dataList.splice(0, 5); // 前5
          this.setEchartPie('50%');
          break;
        case '服务商销售排行':
          this.setEchartBar();
          break;
        case '商品销售排行':
          this.setEchartBar();
          break;
        case '人员销售排行':
          this.setEchartBar();
          break;
      }
    },
    // 渲染图表 Bar
    setEchartBar1() {
      this.myChart.setOption({
        color: ['#5B9BD5'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          top: 10,
          right: 30,
          bottom: 10,
          left: 10,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: this.dataList.map((v) => v.groupByTypeName),
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.1],
        },
        series: [
          {
            type: 'bar',
            barWidth: 20,
            data: this.dataList.map((v) => (this.type === 'AmountRank' ? v.amountMoney : v.productSales)),
          },
        ],
      });
    },
    // 渲染图表 pie
    setEchartPie(radius) {
      this.myChart.setOption({
        color: ['#5B9BD5', '#ED7D31', '#A5A5A5', '#FFC000', '#4472C4', '#70AD47', '#255E91'],
        tooltip: {
          trigger: 'item',
          formatter: this.type === 'AmountRank' ? '{b} : ￥{c} ({d}%)' : '{b} : {c} ({d}%)',
        },
        legend: {
          bottom: 10,
          left: 'center',
        },
        series: [
          {
            type: 'pie',
            radius: radius, // ['40%', '70%'],50%'
            data: this.dataList.map((v) => {
              return {
                value: this.type === 'AmountRank' ? v.amountMoney : v.productSales,
                name: v.groupByTypeName,
              };
            }),
            label: {
              formatter: this.type === 'AmountRank' ? '{b} : ￥{c} ({d}%)' : '{b} : {c} ({d}%)',
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      });
    },
    // 渲染图表 Bar
    setEchartBar() {
      this.dataList = this.dataList.reverse();
      this.myChart.setOption({
        color: ['#5B9BD5'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          top: 10,
          right: 30,
          bottom: 10,
          left: 10,
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.1],
        },
        yAxis: {
          type: 'category',
          data: this.dataList.map((v) => v.groupByTypeName),
        },
        series: [
          {
            type: 'bar',
            barWidth: 20,
            data: this.dataList.map((v) => (this.type === 'AmountRank' ? v.amountMoney : v.productSales)),
          },
        ],
      });
    },
    beforeDestroy() {
      off(window, 'resize', this.resize);
    },
    resize() {
      this.myChart.resize();
    },
  },
};
</script>

<style lang="less" scoped>
.echart-wrap {
  padding: 15px;
  .echart-box {
    .echart-title {
      line-height: 32px;
      display: flex;
      .text {
        flex: 2;
        font-size: 16px;
        font-weight: bold;
        padding-left: 10px;
        .tips-title {
          margin-left: 8px;
        }
      }
      .type {
        width: 180px;
        margin-right: 20px;
      }
      .more {
        width: 88px;
        button {
          width: 88px;
        }
      }
    }
    .echart-cont {
      position: relative;
      margin-top: 12px;
      height: 400px;
      padding: 4px;
      border: 1px solid #ccc;
      border-radius: 4px;
      .return-Back {
        position: absolute;
        right: 14px;
        top: 14px;
        width: 88px;
      }
    }
  }
}
</style>
