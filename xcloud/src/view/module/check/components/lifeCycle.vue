<template>
  <div>
    <el-table :data="list" border v-loading="loading">
      <el-table-column width="200px" label="时间" prop=""></el-table-column>
      <el-table-column width="200px" label="操作人" prop=""></el-table-column>
      <el-table-column width="200px" label="行为" prop=""></el-table-column>
      <el-table-column width="200px" label="来源" prop=""></el-table-column>
      <el-table-column label="操作记录" prop=""></el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { lifeCycleList } from '@/api/newApi/check/check.js';
export default {
  props: {
    type: String,
    val: String,
  },
  data() {
    return {
      form: {
        current: 1,
        size: 10,
      },
      total: 0,
      loading: false,
      list: [],
    };
  },
  methods: {
    getList() {
      setTimeout(() => {
        this.loading = true;
      });
      lifeCycleList({
        ...this.form,
        type: this.type,
        value: this.val,
      })
        .then((res) => {
          if (res.code === 0) {
            this.total = res.data.total - 0;
            this.list = res.data.records;
          } else {
            this.resetData();
          }
        })
        .catch(() => {
          this.resetData();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetData() {
      this.page = 1;
      this.total = 0;
      this.list = [];
    },
    handleSizeChange(val) {
      this.form.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.current = val;
      this.getList();
    },
  },
};
</script>

<style></style>
