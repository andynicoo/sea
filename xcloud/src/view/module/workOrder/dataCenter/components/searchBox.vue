<template>
  <div class="searchit">
    <el-select class="me-mr2 w180" v-model="listQuery.enterpriseIds" placeholder="选择企业" clearable @change="getTotalView" multiple collapse-tags>
      <li class="selectAll"><el-checkbox v-model="checked" @change="selectAll">全部</el-checkbox></li>
      <!-- <el-button type="text" v-model="checked" @change="selectAll">全部</el-button> -->
      <el-option :value="item.id" :label="item.name" v-for="item in firmList" :key="item.id"></el-option>
    </el-select>
    <el-select class="me-mr2 w180" v-if="types === 1" v-model="listQuery.functionCode" placeholder="选择业务分类" clearable @change="getTotalView" multiple collapse-tags>
      <el-option :value="item.code" :label="item.name" v-for="item in productList" :key="item.code"></el-option>
    </el-select>
    <el-select class="me-mr2 w180" v-model="listQuery.countryCode" filterable clearable placeholder="选择国家" @change="getTotalView" multiple collapse-tags>
      <el-option :value="item.countryCode" :label="item.countryNameZh" v-for="item in countryList" :key="item.id"></el-option>
    </el-select>
    <el-button :type="dayIndex === 1 ? 'primary' : ''" @click="lately(7)">近7天</el-button>
    <el-button :type="dayIndex === 2 ? 'primary' : ''" @click="lately(30)" class="me-mr2">近30天</el-button>
    <el-date-picker class="w300" v-model="time" value-format="yyyy-MM-dd HH:mm:ss" :default-time="[, '23:59:59']" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTotalView"></el-date-picker>
  </div>
</template>

<script>
import moment from 'moment';
import { findProducts, saleView, totalView } from '@/api/newApi/processFields/processConfig';
import { getFirm } from '@/api/newApi/common.js';
export default {
  data() {
    return {
      checked: false,
      listQuery: {
        functionCode: '',
        countryCode: '',
        enterpriseIds: [],
        pageNo: 1,
        pageSize: 10,
      },
      // 商品，国家,账号
      productList: [],
      firmList: [],
      time: [moment(moment().startOf('day').subtract(6, 'days')).format('YYYY-MM-DD') + ' 00:00:00', moment(moment().endOf('day')).format('YYYY-MM-DD') + ' 23:59:59'],
      dayIndex: 1,
      tatalBrand: {},
    };
  },
  props: {
    types: {
      type: Number,
      default: () => 1,
      // 1 整体看板用，2 各业务销售额数据看板用
    },
    countryList: {
      type: Array,
      default: () => [],
    },
  },
  // watch: {
  //   countryList (newVal) {
  //     if (this.types === 2 && newVal.length) {
  //       this.listQuery.countryCode = newVal.map(item => item.countryCode)
  //       this.getTotalView(true)
  //     }
  //   }
  // },
  async mounted() {
    if (this.types === 1) {
      await this.queryProductList();
    }

    getFirm()
      .then((res) => {
        if (res.code === 0) {
          this.firmList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      })
      .finally(() => {
        if (this.firmList.length) {
          let enterprise = this.firmList.find((e) => e.id + '' === localStorage.getItem('enterpriseId'));
          this.listQuery.enterpriseIds = enterprise ? [enterprise.id] : [this.firmList[0].id];
        }
        this.getTotalView();
      });
  },
  methods: {
    /**
     * 查询商品列表
     */
    queryProductList() {
      findProducts().then((res) => {
        if (res.code === 0) {
          this.productList = res.data;
        }
      });
    },

    /**
     * 获取企业列表
     */
    getfirmList() {
      getFirm()
        .then((res) => {
          if (res.code === 0) {
            this.firmList = res.data;
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .finally(() => {
          // if (this.firmList.length) {
          //   this.listQuery.enterpriseIds = this.firmList[0].id
          // }
        });
    },
    // 全部
    selectAll() {
      this.listQuery.enterpriseIds = [];
      if (this.checked) {
        this.firmList.map((item) => {
          this.listQuery.enterpriseIds.push(item.id);
        });
      } else {
        this.listQuery.enterpriseIds = ['全部'];
      }
      this.getTotalView(this.listQuery.enterpriseIds);
    },
    getTotalView(val = []) {
      let tmp = '全部';
      if (val.length === this.firmList.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
      let params = {
        enterpriseIds: this.listQuery.enterpriseIds.filter((o) => o !== tmp),
        startTime: this.time[0],
        endTime: this.time[1],
        trendTypes: [1, 2, 3, 4, 5, 7, 8, 9],
        functionCodes: this.types === 1 ? this.listQuery.functionCode : [],
        countryCode: this.listQuery.countryCode,
      };
      // 获取整体看板总结数据
      if (this.types === 1) {
        totalView(params).then((res) => {
          if (res.code === 0) {
            this.tatalBrand = res.data;
            if (this.types === 1) {
              this.$emit('searchChange', this.tatalBrand);
            } else {
              this.$emit('searchChange2', this.tatalBrand);
            }
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        });
      } else {
        saleView(params).then((res) => {
          if (res.code === 0) {
            this.$emit('searchChange2', res.data);
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        });
      }
    },
    lately(val) {
      switch (val) {
        case 7:
          this.time = [moment(moment().startOf('day').subtract(6, 'days')).format('YYYY-MM-DD') + ' 00:00:00', moment(moment().endOf('day')).format('YYYY-MM-DD') + ' 23:59:59'];
          this.dayIndex = 1;
          break;
        case 30:
          this.time = [moment(moment().startOf('day').subtract(29, 'days')).format('YYYY-MM-DD') + ' 00:00:00', moment(moment().endOf('day')).format('YYYY-MM-DD') + ' 23:59:59'];
          this.dayIndex = 2;
          break;
      }
      this.getTotalView();
    },
    async change() {
      await this.getTotalView();
    },
  },
};
</script>

<style lang="scss" scoped>
.searchit {
  .w180 {
    max-width: 180px;
  }
  .w300 {
    max-width: 300px;
  }
}
.selectAll {
  display: inline-block;
  padding: 5px 10px;
  /deep/ .el-checkbox__input {
    display: none;
  }
}
</style>
