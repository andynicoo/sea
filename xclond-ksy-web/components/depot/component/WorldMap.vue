<template>
  <div class="word-map">
    <div class="title">
      美标申请概况
      <a-popover :title="null">
        <template slot="content">
          <p class="ksy-mb-0">展示申请人来源地的申请情况</p>
        </template>
        <a-icon type="question-circle" class="icon-question" />
      </a-popover>
    </div>
    <div class="loading" v-if="loading">
      <a-spin size="large" />
    </div>
    <div ref="worldMap" style="width: 100%; height: 295px"></div>
  </div>
</template>

<script>
import worldMap from "@/libs/world.json";
import newMap from "@/libs/newMap.json";
export default {
  data() {
    return {};
  },
  props: {
    mapList: {
      type: Array,
      default: [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    mapList(val) {
      if (val.length > 0) {
        val.forEach((item) => {
          for (let name in newMap) {
            if (item.name == newMap[name]) {
              item.name = name;
              item.nameCh = newMap[name];
              item.value = Number(item.number);
            }
          }
        });
      }
      let option = {
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            let contry = "";
            let number = "";
            let total = "";
            let prenct = "";
            if (params.data) {
              contry = params.data.nameCh;
              number = Number(params.data.number);
              total = Number(params.data.total);
              prenct = parseFloat(((number / total) * 100).toFixed(2)) + "%";
            } else {
              contry = params.name;
            }

            return (
              contry +
              "<br/>" +
              "美标申请量" +
              ": " +
              number +
              "<br/>" +
              "全球申请量" +
              ": " +
              total +
              "<br/>" +
              "全球申请量占比" +
              ": " +
              prenct
            );
          },
        },
        series: [
          {
            name: "World Population (2023)",
            type: "map",
            mapType: "world",
            roam: true,
            zoom: 1.1,
            mapLocation: {
              y: 30,
            },
            itemStyle: {
              emphasis: { label: { show: true } },

              areaColor: "#7ec4ff",
              borderColor: "#FFFFFF",
              borderWidth: 0.5,
            },
            data: val,
          },
        ],
      };
      this.$echarts.registerMap("world", { geoJSON: worldMap });
      this.chart = this.$echarts.init(this.$refs.worldMap);
      this.chart.setOption(option, true);
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.word-map {
  padding: 16px;
  position: relative;
  .loading {
    z-index: 999;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding-top: 140px;
  }
  .title {
    font-size: 18px;
    color: #303132;
    line-height: 26px;
    display: flex;
  }
}
</style>
