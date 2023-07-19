<template>
  <transition name="transition-left">
    <div class="choose-company-wrapper" v-show="dialogvisible">
      <div class="title-wrapper">
        <div class="title">
          速选公司
          <el-tooltip class="item" effect="dark" content="只显示你所跟进客户手机号下的所有公司，可通过公司名和手机号快速搜索" placement="top-start">
            <i class="el-icon-question text-warning"></i>
          </el-tooltip>
        </div>
        <i class="el-icon-close" @click="dialogvisible = false"></i>
      </div>
      <div class="company-list-container">
        <div class="company-list-wrapper checked-list" v-show="checkedCount">
          <el-checkbox :value="checkAll" @change="handleCheckAllChange">已选（{{ checkedCount }}）</el-checkbox>
          <div class="checkbox-group">
            <el-checkbox-group v-model="checked" @change="handleCheckedChange">
              <el-checkbox v-for="city in checked" :label="city" :key="city.id">{{ city.companyName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <el-input class="search-input" suffix-icon="el-icon-search" v-model="searchKey" placeholder="输入公司名或手机号匹配公司"></el-input>
        <div class="company-list-wrapper">
          <el-checkbox :value="uncheckAll" @change="handleUncheckAllChange">未选（{{ uncheckedCount }}）</el-checkbox>
          <div class="checkbox-group">
            <el-checkbox-group v-model="unchecked" @change="handleUncheckedChange">
              <el-checkbox v-for="city in uncheckedList" :label="city" :key="city.id">{{ city.companyName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { listByCurrentAccount } from '@/api/newApi/renewalCenter/myRenewal.js';
export default {
  props: {
    chooseCompanyDialog: Boolean,
  },
  data() {
    return {
      checkAll: true,
      uncheckAll: false,
      checked: [],
      unchecked: [],
      list: [
        { id: 1, userMobile: '1', companyName: '9', label: 'a' },
        { id: 2, userMobile: '2', companyName: '9', label: 'b' },
        { id: 3, userMobile: '3', companyName: '9', label: 'c' },
        { id: 4, userMobile: '4', companyName: '9', label: 'd' },
        { id: 5, userMobile: '5', companyName: '9', label: 'e' },
      ],
      searchKey: '',
    };
  },
  watch: {
    checked(val) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.$emit('changeCompany', val);
      }, 800);
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.chooseCompanyDialog;
      },
      set(val) {
        this.$emit('update:chooseCompanyDialog', val);
      },
    },
    uncheckedList() {
      return this.list.filter((item) => !this.checked.includes(item)).filter((item) => item.userMobile.indexOf(this.searchKey) > -1 || item.companyName.indexOf(this.searchKey) > -1);
    },
    checkedCount() {
      return this.checked.length;
    },
    uncheckedCount() {
      return this.uncheckedList.length;
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      listByCurrentAccount().then((res) => {
        res.data.forEach((item, index) => {
          item.id = `${index + 1}`;
        });
        this.list = res.data;
      });
    },
    handleCheckAllChange(val) {
      this.checked = [];
      this.unchecked = [];
    },
    handleCheckedChange(val) {
      this.unchecked = [];
    },
    handleUncheckAllChange(val) {
      this.checked = this.checked.concat(this.uncheckedList);
    },
    handleUncheckedChange(val) {
      this.checked = [...new Set([...this.checked, ...val])];
    },
  },
};
</script>

<style lang="scss" scoped>
$wrapper-width: 252px;
.choose-company-wrapper {
  flex: 0 0 $wrapper-width;
  width: $wrapper-width;
  padding: 14px;
  height: calc(100vh - 128px);
  background-color: #f5f5f5;
  border: 8px solid #fff;
  border-right: none;
  margin-bottom: 5px;
  overflow: hidden;
  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
    font-size: 14px;
    color: #303132;
    font-weight: bold;
    .el-icon-close {
      cursor: pointer;
    }
  }
  .company-list-container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 214px);
    .company-list-wrapper {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      &.checked-list {
        max-height: calc(50vh - 139px);
        overflow: visible;
      }
      .checkbox-group {
        overflow: auto;
      }
    }
  }
  .search-input {
    margin: 10px 0 22px;
  }
}
.transition-left-enter-active {
  animation: transition-left-in 0.1s;
}
.transition-left-leave-active {
  animation: transition-left-in 0.1s reverse;
}
@keyframes transition-left-in {
  0% {
    opacity: 0;
    flex: 0;
    transform: translate(-100%, 0px);
  }
  100% {
    opacity: 1;
    flex: 0 0 $wrapper-width;
    transform: translate(0px, 0px);
  }
}

::v-deep .el-icon-search {
  line-height: 36px;
}
::v-deep .el-checkbox {
  display: block;
  font-weight: bold;
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 20px;
  }
  .el-checkbox__label {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
