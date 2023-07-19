<template>
  <div>
    <div class="header-container" v-if="deliveryList.length">
      <div class="header-block">
        <div class="block-title big-size">工单交付明细</div>
      </div>
      <div class="el-form-wrapper">
        <el-table ref="table" border :data="deliveryList" :max-height="500" element-loading-spinner="icon loading" element-loading-text="拼命加载中" highlight-current-row>
          <Empty slot="empty" />
          <el-table-column align="center" label="内容" min-width="150" prop="serviceName"></el-table-column>
          <el-table-column align="center" label="工单号" min-width="150" prop="serviceNo"> </el-table-column>
          <el-table-column align="center" label="工单类型" min-width="100" prop="serviceNo"> </el-table-column>
          <el-table-column align="center" label="工单进度" min-width="100" prop="nodeCodeName"> </el-table-column>
          <el-table-column align="center" label="工单状态" min-width="100" prop="serviceNo">
            <template slot-scope="scope">
              {{ scope.row.status | serviceStatus }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="服务商" min-width="150" prop="supplierName"> </el-table-column>
          <el-table-column align="center" label="工单创建时间" min-width="150" prop="createTime">
            <template slot-scope="scope">
              {{ (scope.row.createTime || '').split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="处理人" min-width="150" prop="nodeCodeName">
            <template slot-scope="{ row }">
              <p>交付专员：</p>
              <p>客服：</p>
              <p>销售：</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="150" prop="serviceNo">
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" @click="detail(scope.row)"> 查看 </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination background @current-change="(val) => handleCurrentChange(val, 'delivery')" :current-page.sync="deliveryForm.page" :page-size="deliveryForm.limit" layout="total, prev, pager, next, jumper" :total="deliveryTotal"></el-pagination>
      </div>
    </div>

    <div class="header-container" v-if="relationList.length">
      <div class="header-block">
        <div class="block-title big-size">关联工单</div>
      </div>
      <div class="el-form-wrapper">
        <el-table ref="table" border :data="relationList" element-loading-spinner="icon loading" element-loading-text="拼命加载中" highlight-current-row>
          <Empty slot="empty" />
          <el-table-column align="center" label="工单号" min-width="150" prop="serviceNo"> </el-table-column>
          <el-table-column align="center" label="所属订单" min-width="150" prop="serviceNo"> </el-table-column>
          <el-table-column align="center" label="工单类型" min-width="150" prop="serviceNo"> </el-table-column>
          <el-table-column align="center" label="工单进度" min-width="100" prop="nodeCodeName"> </el-table-column>
          <el-table-column align="center" label="工单状态" min-width="100" prop="serviceNo">
            <template slot-scope="{ row }">
              {{ row.status | serviceStatus }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="服务商" min-width="100" prop="supplierName"> </el-table-column>
          <el-table-column align="center" label="工单创建时间" min-width="150" prop="createTime">
            <template slot-scope="{ row }">
              {{ (row.createTime || '').split(' ')[0] }}
            </template>
          </el-table-column>
          <el-table-column label="处理人" min-width="150" prop="nodeCodeName">
            <template slot-scope="{ row }">
              <p>交付专员：</p>
              <p>客服：</p>
              <p>销售：</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="150" prop="serviceNo">
            <template slot-scope="{ row }">
              <el-link type="primary" :underline="false" @click="detail(row)"> 详情 </el-link>
              <el-link type="primary" :underline="false" @click="declareLog(row)"> 查看申报记录 </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination background @current-change="(val) => handleCurrentChange(val, 'relation')" :current-page.sync="relationForm.page" :page-size="relationForm.limit" layout="total, prev, pager, next, jumper" :total="relationTotal"></el-pagination>
      </div>
    </div>

    <!-- 查看申报记录 -->
    <el-dialog title="申报记录" :visible.sync="dialogvisible" width="800px" center>
      <el-table>
        <el-table-column label="周期工单编号"></el-table-column>
        <el-table-column label="申报进度"></el-table-column>
        <el-table-column label="申报周期"></el-table-column>
        <el-table-column label="服务商"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deliveryForm: {
        page: 1,
        limit: 10,
      },
      relationForm: {
        page: 1,
        limit: 10,
      },
      deliveryList: [{}],
      relationList: [{}],
      deliveryTotal: 0,
      relationTotal: 0,
      dialogvisible: false,
    };
  },
  mounted() {
    this.getDeliveryList();
    this.getRelationList();
  },
  methods: {
    detail(row) {},
    declareLog(row) {
      this.dialogvisible = true;
    },
    handleCurrentChange(val, type) {
      this[type + 'Form'].page = val;
      this.getList(type.slice(0, 1).toUpperCase() + type.slice(1));
    },
    getList(type) {
      this['get' + type + 'List']();
    },
    getDeliveryList() {},
    getRelationList() {},
  },
};
</script>

<style lang="less" scoped>
.header-container {
  padding-left: 30px;
  .header-block {
    display: flex;
    justify-content: space-between;
    padding-bottom: 18px;
    margin-bottom: 30px;
    border-bottom: 1px solid #ebeef5;
  }
}
.pagination-container {
  margin-top: 10px;
}
</style>
