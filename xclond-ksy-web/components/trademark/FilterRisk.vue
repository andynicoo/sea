<template>
  <a-spin :spinning="loading">
    <div class="filter-block flex flex-b" ref="block">
      <div class="flex1">
        <div class="filter-block-head">
          <div class="content">
            <h1>{{ target ? "商标注册统计图" : "注册风险图" }}</h1>
            <ul v-if="!target">
              <li v-for="(item, index) in headTitle" :key="index">
                <i :style="{ background: item.textColor }"></i
                ><span :style="{ color: item.textColor }">{{ item.title }}</span
                ><span>{{ item.tips }}</span>
              </li>
            </ul>
            <ul v-else>
              <li v-for="(item, index) in headTitleTarget" :key="index">
                <i :style="{ background: item.textColor, border: item.border }"></i>
                <span v-if="index === 0" :style="{ color: item.textColor, 'margin-left': 0 }">
                  在{{ item.num }}个类，已注册
                </span>
                <template v-else> 在{{ item.num }}个类，未注册，可注册 </template>
              </li>
            </ul>
          </div>
          <div v-if="!target" class="extends">
            不确定商品属于哪个分类？&nbsp;&nbsp;<nuxt-link to="/classificationquery">智能分类查询</nuxt-link>
          </div>
        </div>
        <div class="filter-block-content">
          <div class="filter-block-list" :class="{ 'filter-block-list-small': !target }" v-if="riskList.length">
            <a-tooltip
              v-for="(item, index) in riskList"
              :key="index"
              placement="top"
              overlayClassName="tipBox"
              :getPopupContainer="() => $refs.block"
            >
              <template slot="title">
                <div class="tip-inner">
                  <p v-if="!target">
                    {{ +item.categoryNum > 9 ? item.categoryNum : `0${item.categoryNum}` || "--" }}类
                    {{ item.categoryName || "--" }} {{ riskMap[item.riskScore].label }} {{ item.tradermarkNum }}近似
                  </p>
                  <p v-else>
                    {{ +item.name > 9 ? item.name : `0${item.name}` || "--" }}类 {{ item.nameZh || "--" }}
                    {{ +item.count === 0 ? `未注册（0）` : `已注册（${item.count}）` }}
                  </p>
                  <span @click="choose(index)" class="view">{{ target ? "选择" : "选择" }}</span>
                </div>
              </template>
              <div
                @click="choose(index)"
                class="item"
                :class="{ active: item.checked, 'item-small': !target }"
                :style="{
                  background: target ? (+item.count === 0 ? '#fff' : '#E7EEFF') : riskMap[item.riskScore].color,
                  border: target ? (+item.count === 0 ? '1px solid #EAEBEE' : '0') : '0',
                }"
              >
                {{ index + 1 }}
                <i class="icon-check"></i>
              </div>
            </a-tooltip>
          </div>
        </div>
      </div>
      <div v-if="!target" class="filter-block-extend">
        <p>
          风险报告 早检查<br />
          注册风险 早知道
        </p>
        <div @click="toRiskIndex" class="link-a">查近似风险报告</div>
        <!-- <nuxt-link :to="`/riskReport?name=${trade}`">查近似风险报告</nuxt-link> -->
      </div>
    </div>
  </a-spin>
</template>
<script>
import Cookie from "js-cookie";
export default {
  props: {
    riskList: {
      type: Array,
      default: () => [],
    },
    // 是否近似商标大类
    target: {
      type: Boolean,
      default: false,
    },
    targetNum: {
      type: Array,
      default: () => [0, 0],
    },
    name: String,
    loading: Boolean,
  },
  data() {
    return {
      riskColor: {
        0: "#48BB10",
        1: "#F7C11B",
        2: "#FF6263",
      },
      riskMap: {
        low: {
          label: "低风险",
          color: "#48BB10",
          textColor: "#48BB10",
        },
        medium: {
          label: "中风险",
          color: "#F7C11B",
          textColor: "#F7C11B",
        },
        high: {
          label: "高风险",
          color: "#FF6263",
          textColor: "#FF6263",
        },
      },
      chooseVal: [],
      trade: Cookie.get("trade"),
    };
  },
  computed: {
    targetMap() {
      return {
        register: {
          label: "已注册",
          color: "#E7EEFF",
          textColor: "#79A3FB",
          border: "none",
          num: this.targetNum[0],
        },
        unRegister: {
          label: "未注册",
          color: "#fff",
          textColor: "#fff",
          border: "1px solid #919498",
          num: this.targetNum[1],
        },
      };
    },
    headTitleTarget() {
      return Object.values(this.targetMap);
    },
    headTitle() {
      return [
        {
          color: this.riskMap.low.color,
          title: this.riskMap.low.label,
          textColor: this.riskMap.low.textColor,
          tips: "立即注册",
        },
        {
          color: this.riskMap.medium.color,
          title: this.riskMap.medium.label,
          textColor: this.riskMap.medium.textColor,
          tips: "尝试注册",
        },
        {
          color: this.riskMap.high.color,
          title: this.riskMap.high.label,
          textColor: this.riskMap.high.textColor,
          tips: "谨慎注册",
        },
      ];
    },
  },
  methods: {
    choose(index) {
      const list = this.riskList;
      list[index].checked = !list[index].checked;
      this.$emit("update:riskList", [...list]);
      this.$forceUpdate();
    },
    toRiskIndex() {
      if (this.name) {
        this.$router.push({
          path: "/riskReport",
          query: {
            name: this.name,
          },
        });
      } else {
        this.$message.error("请输入商标名");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.filter-block {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  background: white;
  padding: 16px 24px;
  padding-bottom: 16px;
  color: #606266;
  font-size: 12px;
  line-height: 20px;
  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .content {
      display: flex;
      align-items: center;
      ul,
      h1 {
        margin-bottom: 0;
      }
      h1 {
        font-size: 16px;
        font-weight: 500;
        color: #303132;
        line-height: 24px;
        margin-right: 24px;
      }
      ul {
        display: flex;
        align-items: center;
        li {
          display: flex;
          align-items: center;
          margin-right: 24px;
          i {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
          }
          span {
            margin-left: 8px;
            color: #c0c4cb;
          }
        }
      }
    }
  }
  &-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  &-list {
    display: grid;
    grid-column-gap: 6px;
    grid-row-gap: 6px;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fill, 40px);
    flex: 1;
    width: 0;
    &-small {
      grid-row-gap: 8px;
      grid-template-columns: repeat(auto-fill, 30px);
    }
    .item {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 42px;
      color: #606266;
      cursor: pointer;
      &-small {
        width: 30px;
        height: 32px;
        color: #fff;
        i {
          width: 11px !important;
          height: 10px !important;
          font-size: 10px !important;
        }
      }
      &.active {
        position: relative;
        border: 2px solid @primaryColor !important;
        box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        i {
          display: block;
        }
      }
      i {
        display: none;
        position: absolute;
        right: -1px;
        top: -1px;
        width: 12px;
        height: 12px;
        background: @primaryColor;
        border-radius: 0 0 0 4px;
        color: #fff;
      }
    }
  }
  &-extend {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 20px;
    margin-left: 16px;
    width: 268px;
    height: 116px;
    font-size: 14px;
    color: #919498;
    line-height: 22px;
    background: url(~@/assets/images/trademark/v230401/bg-report-small.png) no-repeat left top / 100% auto;
    p {
      margin-bottom: 8px;
    }
    .link-a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 130px;
      height: 32px;
      border-radius: 2px;
      background: @primaryColor;
      color: #fff;
      cursor: pointer;
      &:hover {
        color: #fff !important;
      }
    }
  }
  .tip-inner {
    white-space: nowrap;
    display: flex;
    align-items: center;
    p {
      margin: 0;
    }
    .view {
      color: @primaryColor;
      cursor: pointer;
      margin-left: 20px;
    }
  }
  /deep/ .ant-tooltip-inner {
    background: #fff;
    font-size: 12px;
    color: #303132;
  }
  /deep/ .ant-tooltip-placement-top .ant-tooltip-arrow:before {
    background: #fff;
    width: 16px;
    height: 16px;
    top: initial;
  }
  /deep/ .ant-tooltip-arrow {
    width: 20px;
    height: 20px;
  }
}
</style>
