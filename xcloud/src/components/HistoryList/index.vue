<template>
  <div class="history-list" v-show="showHistory">
    <div class="history-list-title">搜索历史</div>
    <template v-if="list.length">
      <div class="history-list-item" v-for="(item, index) in list" :key="index" @click="chooseItem(item)">{{ item }}</div>
      <div class="history-list-clear" @click="clearHistory">清空搜索历史</div>
    </template>
    <div class="history-list-empty" v-else>暂无历史数据</div>
  </div>
</template>

<script>
export default {
  props: {
    showHistory: {
      type: Boolean,
    },
    historyKey: {
      type: String,
      required: true,
    },
    historyLength: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      list: [],
    };
  },
  watch: {
    showHistory(val) {
      if (val) {
        this.getList();
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      try {
        let list = JSON.parse(localStorage.getItem(this.historyKey));
        if (list && list.length) {
          this.list = list;
        }
      } catch (error) {}
    },
    chooseItem(val) {
      this.setHistoryList(val);
      this.$emit('chooseHistoryItem', val);
    },
    setHistoryList(val) {
      if (val === '') return;
      this.list.unshift(val);
      this.list = [...new Set(this.list)].slice(0, this.historyLength - 0);
      localStorage.setItem(this.historyKey, JSON.stringify(this.list));
    },
    clearHistory() {
      this.list = [];
      localStorage.removeItem(this.historyKey);
    },
  },
};
</script>

<style lang="less" scoped>
.history-list {
  position: absolute;
  top: 50px;
  z-index: 10000;
  width: 100%;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.12);
  cursor: auto;
  &-title {
    height: 35px;
    line-height: 35px;
    color: #999;
    padding: 0 12px;
  }
  &-item {
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    color: #333;
    padding: 0 12px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      background-color: #f5f5f5;
    }
  }
  &-empty {
    height: 32px;
    line-height: 32px;
    color: #999;
    text-align: center;
  }
  &-clear {
    height: 32px;
    line-height: 32px;
    color: #1890ff;
    padding: 0 12px;
    border-top: 1px solid #e5e7ec;
    cursor: pointer;
  }
}
</style>
