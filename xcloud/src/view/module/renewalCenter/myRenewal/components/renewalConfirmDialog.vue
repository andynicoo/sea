<template>
  <el-dialog title="续费服务" :visible.sync="dialogvisible" width="1230px">
    <div class="tips" v-if="list.length">客户手机号{{ list[0].userMobile }}，你当前选择了 {{ list.length }} 个续费服务，预计售价 {{ totalPrice | formatQianFenWei }} 元，可点击“去录单”进行价格编辑和录单</div>
    <el-table :data="list" :max-height="500">
      <el-table-column label="序号" width="50" align="center" fixed="left">
        <template slot-scope="{ $index }">
          {{ $index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="companyNameZh" label="服务公司" width="150" align="center"></el-table-column>
      <el-table-column prop="productName" label="商品名称" width="120" align="center"></el-table-column>
      <el-table-column prop="countryNameZh" label="国家" width="120" align="center"></el-table-column>
      <el-table-column prop="productSpecName" label="服务项目" width="120" align="center"></el-table-column>
      <el-table-column prop="serviceNo" label="服务号" width="200" align="center"></el-table-column>
      <el-table-column prop="expirationTime" label="服务截止日期" width="120" align="center">
        <template slot-scope="{ row }">{{ $util.formatDateTime(row.expirationTime) || '-' }}</template>
      </el-table-column>
      <el-table-column prop="expirationTime" label="剩余服务时间" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.expirationTime | filterRestTime }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="服务状态" width="120" align="center">
        <template slot-scope="{ row }">
          {{ row.status | serviceStatus }}
        </template>
      </el-table-column>
      <el-table-column prop="activityType" label="折扣" width="120" align="center">
        <template slot-scope="{ row }">{{ row.activityType | filterDiscount(row.activityContent) }}</template>
      </el-table-column>
      <el-table-column prop="productPrice" label="销售价格" width="120" align="center">
        <template slot-scope="{ row }">￥{{ row.productPrice | formatQianFenWei }}</template>
      </el-table-column>
    </el-table>
    <div slot="footer" style="text-align: right">
      <el-button type="primary" @click="toRecord">去录单</el-button>
      <el-button type="default" @click="dialogvisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    renewalConfirmDialog: Boolean,
    list: Array,
  },

  data() {
    return {};
  },

  computed: {
    dialogvisible: {
      get() {
        return this.renewalConfirmDialog;
      },
      set(val) {
        this.$emit('update:renewalConfirmDialog', val);
      },
    },
    totalPrice() {
      return this.list.map((item) => item.productPrice).reduce((a, b) => this.$util.accAdd(a, b));
    },
  },
  methods: {
    toRecord() {
      localStorage.setItem('renewalList', JSON.stringify(this.list));
      this.$router.push({
        path: '/manuelorder/index',
        query: {
          userMobile: this.list[0].userMobile,
          type: 'renewal',
          userId: this.list[0].userId
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tips {
  margin-bottom: 10px;
}
</style>
