<template>
  <div class="company-list" v-show="showCompany">
    <div class="company-list-title">搜索公司相关数据</div>
    <div class="company-list-wrapper">
      <div class="company-list-wrapper-item" v-for="(item, index) in list" :key="index" @click="chooseItem(item)">
        <i class="el-icon-office-building"></i>
        <span v-html="$util.matchStrLight(item.serviceCompanyName, val)"></span>
      </div>
      <div class="company-list-wrapper-item" v-if="!list.length">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { getServiceCompanyList } from '@/api/newApi/check/check.js';
import debounce from 'lodash/debounce';
export default {
  props: {
    showCompany: {
      type: Boolean,
    },
    historyKey: String,
    historyLength: Number,
    val: String,
  },
  data() {
    return {
      list: [],
    };
  },
  watch: {
    showCompany(newVal) {
      if (newVal) {
        this.getList();
      }
    },
    val(newVal) {
      if (newVal) {
        this.getList();
      }
    },
  },
  methods: {
    getList: debounce(function () {
      if (this.list.length && this.list[0].serviceCompanyName === this.val) {
        return;
      }
      getServiceCompanyList({
        value: this.val,
      }).then((res) => {
        this.list = res.data;
      });
    }, 500),
    chooseItem(item) {
      this.setCompanyList(item.serviceCompanyName);
      this.$emit('chooseCompanyItem', item.serviceCompanyName);
    },
    setCompanyList(val) {
      if (val === '') return;
      try {
        let list = JSON.parse(localStorage.getItem(this.historyKey));
        list.unshift(val);
        list = [...new Set(list)].slice(0, this.historyLength - 0);
        localStorage.setItem(this.historyKey, JSON.stringify(list));
      } catch (error) {}
    },
  },
};
</script>

<style lang="less" scoped>
.company-list {
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
  &-wrapper {
    max-height: 192px;
    overflow-y: auto;
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
    &-clear {
      height: 32px;
      line-height: 32px;
      color: #1890ff;
      padding: 0 12px;
      border-top: 1px solid #e5e7ec;
      cursor: pointer;
    }
  }
}
</style>
