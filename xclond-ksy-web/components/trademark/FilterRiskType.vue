<template>
  <a-spin :spinning="loading">
    <div class="filter-block flex flex-b" ref="block">
      <div class="flex1">
        <div class="filter-block-head">
          <div class="content">
            <h1>大类统计图</h1>
            <ul>
              <li v-for="(item, index) in headTitleTarget" :key="index">
                <i :style="{ background: item.color, border: item.border }"></i>
                <template v-if="index===0">属于{{item.num}}个大类</template>
                <template v-else>
                  不属于{{item.num}}个大类
                </template>
              </li>
            </ul>
          </div>
        </div>
        <div class="filter-block-content">
          <div class="filter-block-list" v-if="riskList.length">
            <a-tooltip
              v-for="(item, index) in riskList"
              :key="index"
              placement="top"
              overlayClassName="tipBox"
              :getPopupContainer="() => $refs.block"
            >
              <template slot="title">
                <div class="tip-inner">
                  <p>
                    {{ +item.categoryNum > 9 ? item.categoryNum : `0${item.categoryNum}` }}类 {{ item.categoryName }}
                    {{
                      +item.tradeMarkCateGorytotal > 0
                        ? `包含${item.tradeMarkCateGorytotal}个相关小类`
                        : "不包含对应小类"
                    }}
                  </p>
                  <span v-if="+item.tradeMarkCateGorytotal > 0" @click="choose(item, index)" class="view">查看</span>
                </div>
              </template>
              <div
                @click="choose(item, index)"
                class="item"
                :class="{ active: item.check }"
                :style="{
                  background: +item.tradeMarkCateGorytotal === 0 ? '#fff' : '#E7EEFF',
                  border: +item.tradeMarkCateGorytotal === 0 ? '1px solid #EAEBEE' : '0',
                }"
              >
                {{ item.categoryNum }}
                <i class="icon-check"></i>
              </div>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script>
export default {
  props: {
    riskList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      chooseVal: [],
    };
  },
  computed: {
    targetNum() {
      let arr = [0, 0];
      if (this.riskList.length) {
        arr[0] = this.riskList.filter((item) => +item.tradeMarkCateGorytotal > 0).length;
        arr[1] = this.riskList.filter((item) => +item.tradeMarkCateGorytotal === 0).length;
      }
      return arr;
    },
    targetMap() {
      return {
        register: {
          label: "包含",
          color: "#E7EEFF",
          border: "none",
          num: this.targetNum[0],
        },
        unRegister: {
          label: "不包含",
          color: "#fff",
          border: "1px solid #919498",
          num: this.targetNum[1],
        },
      };
    },
    headTitleTarget() {
      return Object.values(this.targetMap);
    },
  },
  methods: {
    choose(item, index) {
      if (+item.tradeMarkCateGorytotal > 0) {
        const list = this.riskList;
        list[index].check = !list[index].check;
        this.$emit("update:riskList", [...list]);
        this.$forceUpdate();
      } else {
        return false;
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
    .item {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 42px;
      color: #606266;
      cursor: pointer;
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
    height: 178px;
    font-size: 14px;
    color: #919498;
    line-height: 22px;
    background: url(~@/assets/images/trademark/v230401/bg-report.png) no-repeat left top / cover;
    p {
      margin-bottom: 13px;
    }
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 130px;
      height: 32px;
      border-radius: 2px;
      background: @primaryColor;
      color: #fff;
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
