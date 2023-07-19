<template>
  <div class="app-container">
    <div class="back" @click="goBack()">
      <Icon type="ios-arrow-back" />
      返回列表
    </div>
    <el-alert class="mg-20" type="success" :closable="false" style="color: red">订单合同状态:{{ contractStatus }}</el-alert>
    <div>
      <Title class="mg-20" :titieName="'当前合同（' + currentContractName + '）'" />
      <el-table :data="currentTable" :span-method="objectSpanMethod" style="width: 100%">
        <el-table-column prop="contractName" label="合同名称" width="210">
          <template slot-scope="{ row }">
            <el-link type="primary" :underline="false" class="text-primary" :href="row.contractUrl" target="_blank" v-if="row.contractUrl">{{ row.contractName }}</el-link>
            <span v-else>{{ row.contractName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="childContractName" label="子合同名称" width="180"> </el-table-column>
        <el-table-column prop="childBestContractId" label="合同编号"> </el-table-column>
        <el-table-column prop="contractStatus" label="签署状态">
          <template slot-scope="scope">
            {{ CONTRACTEM.CONTRACTSTATUSTEXTEM[scope.row.contractStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="signType" label="签订方式">
          <template slot-scope="scope"> {{ scope.row.signType == CONTRACTEM.SIGNEM.ONLINE ? '线上' : scope.row.signType == CONTRACTEM.SIGNEM.OFFLINE ? '线下' : '特批不签' }}签订 </template>
        </el-table-column>
        <el-table-column prop="contractSubjectType" label="签订主体">
          <template slot-scope="scope"> {{ scope.row.contractSubjectType == CONTRACTEM.SUBJECTEM.PERSON ? '个人' : '企业' }}签订 </template>
        </el-table-column>
        <el-table-column label="主体信息">
          <template slot-scope="scope">
            <el-row> 公司名称:{{ scope.row.companyName }}</el-row>
            <el-row> 联系人:{{ scope.row.contactPerson }}</el-row>
            <el-row> 联系电话:{{ scope.row.contactPhone }}</el-row>
            <el-row> 联系地址:{{ scope.row.contactAddress }} </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" label="合同创建时间"> </el-table-column>
      </el-table>
      <Title class="mg-20" :titieName="'订单其他合同' + otherContractName" />
      <el-table :data="otherTable" style="width: 100%">
        <el-table-column prop="contractName" label="合同名称" width="180"> </el-table-column>
        <el-table-column prop="bestContractId" label="合同编号"> </el-table-column>
        <el-table-column prop="contractStatus" label="签署状态">
          <template slot-scope="scope">
            {{ CONTRACTEM.CONTRACTSTATUSTEXTEM[scope.row.contractStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" label="合同创建时间"> </el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <router-link :to="{ name: 'contractManageDetail', query: { contractId: scope.row.id } }">
              <el-tooltip effect="dark" content="查看详情" placement="top">
                <el-link type="primary" :underline="false" class="icon-see icon"></el-link>
              </el-tooltip>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Title from '@/components/title/index';
import { getContractDetail } from '@/api/newApi/orderManage/salesorder.js';
import { CONTRACTEM } from '@/libs/contractEM.js';
export default {
  components: { Title },
  data() {
    return {
      id: this.$route.query.contractId,
      tableData: [],
      currentTable: [],
      otherTable: [],
      CONTRACTEM: CONTRACTEM,
      mainKey: new Date().getTime(),
    };
  },
  computed: {
    /**取合同状态为订单 且  invalidStatus 未作废的 */
    contractStatus() {
      let obj = this.tableData && this.tableData.find((item) => !item.invalidStatus && item.contractType === 0);
      return obj ? CONTRACTEM.CONTRACTSTATUSTEXTEM[obj.contractStatus] : '未签署';
    },
    currentContractName() {
      return this.currentTable.length && this.currentTable[0].contractName;
    },
    otherContractName() {
      if (this.otherTable.length) {
        let contractName = this.otherTable[0].contractName.split('-');
        if (contractName.length >= 2) {
          return `(${contractName[1]})`;
        }
        return '';
      }
      return '';
    },
  },
  created() {
    this.getDeatilData();
  },
  watch: {
    $route: {
      handler: function () {
        location.reload();
      },
      // 深度观察监听
      deep: true,
    },
  },
  methods: {
    goBack() {
      this.$router.push('/contractManage/index');
    },
    async getDeatilData() {
      let { data } = await getContractDetail(this.id);
      let table = [];
      let temp = data.find((item) => item.id == this.id);
      let va = {
        ...temp,
        rowspan: 1,
        index: 0,
      };
      if (!temp.childContractList.length) {
        table.push(va);
      } else {
        temp.childContractList.forEach((childItem, i) => {
          let { contractName: childContractName, bestContractId: childBestContractId } = childItem;
          let child = { childContractName, childBestContractId };
          table.push({
            ...va,
            rowspan: temp.childContractList.length,
            index: i,
            ...child,
          });
        });
      }
      this.tableData = data;
      this.currentTable = table;
      this.otherTable = data.filter((item) => item.id != this.id);
    },
    objectSpanMethod({ row, column }) {
      let notCombineList = ['childContractName', 'childBestContractId'];
      if (!notCombineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  margin: 10px;
  padding: 35px;
  background: #ffffff;
  border-radius: 2px;
}
.mg-20 {
  margin: 20px 0px;
}

.back {
  font-size: 16px;
  cursor: pointer;
}
</style>
