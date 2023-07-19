<template>
  <div>
    <el-table :data="list" border v-loading="loading">
      <el-table-column label="序号" min-width="50px">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="对象" prop="sendType" v-if="hasAuthority('Q2_32')">
        <template slot-scope="{ row }">
          {{ row.sendType | filterSendType }}
        </template>
      </el-table-column>
      <el-table-column label="所属主体" prop="enterpriseId" v-if="hasAuthority('Q2_33')">
        <template slot-scope="{ row }">
          {{ row.enterpriseId | filterKey(firmList, 'id', 'name') }}
        </template>
      </el-table-column>
      <el-table-column label="通知方式" prop="sendModel" v-if="hasAuthority('Q2_34')">
        <template slot-scope="{ row }">
          {{ row.sendModel | filterSendModel }}
        </template>
      </el-table-column>
      <el-table-column label="通知标题" prop="messageTitle" v-if="hasAuthority('Q2_35')"></el-table-column>
      <el-table-column label="消息内容" prop="content" v-if="hasAuthority('Q2_36')"></el-table-column>
      <el-table-column label="客户名称" prop="userName" v-if="hasAuthority('Q2_37')"></el-table-column>
      <el-table-column label="手机号" prop="userMobile" v-if="hasAuthority('Q2_38')"></el-table-column>
      <el-table-column label="发送时间" prop="createTime" v-if="hasAuthority('Q2_39')"></el-table-column>
      <el-table-column label="发送状态" prop="sendStatus" v-if="hasAuthority('Q2_40')">
        <template slot-scope="{ row }">
          {{ row.sendStatus | filterSendStatus }}
        </template>
      </el-table-column>
      <el-table-column label="消息状态" prop="messageStatus" v-if="hasAuthority('Q2_41')">
        <template slot-scope="{ row }">
          {{ row.messageStatus | filterMessageStatus }}
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { warnList } from '@/api/newApi/check/check.js';
export default {
  props: {
    type: String,
    val: String,
    firmList: Array,
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
    async getList() {
      setTimeout(() => {
        this.loading = true;
      });
      warnList({
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

<style lang="less" scoped>
.pagination-container {
  text-align: right;
  margin-top: 10px;
}
</style>
