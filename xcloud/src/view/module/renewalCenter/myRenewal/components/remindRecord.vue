<template>
  <div>
    <el-table :data="list" height="calc(100vh - 395px)">
      <el-table-column label="序号" width="80" align="center" fixed="left">
        <template slot-scope="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="sendModel" label="通知方式" width="120" align="center">
        <template slot-scope="{ row }">{{ row.sendModel | filterSendModel }}</template>
      </el-table-column>
      <el-table-column prop="sendType" label="通知对象" width="120" align="center">
        <template slot-scope="{ row }">{{ row.sendType | filterSendType }}</template>
      </el-table-column>
      <el-table-column prop="content" label="消息内容" min-width="120" align="center"> </el-table-column>
      <el-table-column prop="messageStatus" label="消息状态" width="120" align="center">
        <template slot-scope="{ row }">
          <!-- 通知方式为待办是显示  -->
          <span v-if="row.sendModel === 'PENDING'">{{ row.messageStatus | filterPendingStatus }}</span>
          <span v-else>{{ row.messageStatus | filterMessageStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发送时间" width="150" align="center"></el-table-column>
      <el-table-column prop="readTime" label="查看/处理时间" width="150" align="center"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50, 100]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { messageSenderRecord } from '@/api/newApi/renewalCenter/myRenewal.js';
export default {
  props: {
    serviceId: String,
  },
  data() {
    return {
      form: {
        current: 1,
        size: 10,
      },
      total: 0,
      list: [],
    };
  },
  filters: {
    filterPendingStatus(messageStatus) {
      switch (messageStatus) {
        case 'YES':
          return '已处理';
        case 'NO':
          return '未处理';
      }
    },
  },
  methods: {
    // 获取提醒记录
    getList() {
      messageSenderRecord({
        ...this.form,
        serviceId: this.serviceId,
        messageType: 'RENEWAL',
      }).then((res) => {
        this.total = Number(res.data.total);
        this.list = res.data.records;
      });
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
