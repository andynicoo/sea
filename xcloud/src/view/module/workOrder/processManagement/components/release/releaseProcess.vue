<!--  -->
<template>
  <el-dialog title="流程更新" :visible.sync="dialogvisible" width="488px" :before-close="handleClose">
    <el-row class="title"> 你要发布的流程 </el-row>
    <div class="main">
      <el-row> 流程名称:{{ detailData.flowName }} </el-row>
      <el-row> 业务类型: {{ releaseData.destination || (detailData.flowName && detailData.flowName.split('-')[1]) }}</el-row>
      <el-row> 公司主体:{{ releaseData.enterpriseName }} </el-row>
      <el-row> 服务国家: {{ releaseData.countryNameCH }}</el-row>
      <el-row> 供应商: {{ releaseData.serviceProviderName || releaseData.supplierName }}</el-row>
      <el-row> 备注: {{ detailData.remarks }}</el-row>
    </div>
    <template v-if="tableData.length > 0">
      <el-row class="title"> 即将停用的流程 </el-row>
      <el-row class="title"> 发布成功后会停用原始流程，不影响历史数据 </el-row>
      <el-table :data="tableData" border>
        <!-- <el-table-column align="center" label="序号" width="70">
          <template slot-scope="{ row, $index }">
            {{ listQuery.pageSize * (listQuery.pageNo - 1) + $index + 1 }}
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="流程名称">
          <template slot-scope="{ row }">{{ row.flowName }}</template>
        </el-table-column>
        <el-table-column align="center" label="公司主体">
          <template slot-scope="{ row }">{{ row.functionName }}</template>
        </el-table-column>
        <el-table-column align="center" label="服务国家">
          <template slot-scope="{ row }">{{ row.countryNameCH }}</template>
        </el-table-column>
        <el-table-column align="center" label="服务商">
          <template slot-scope="{ row }">{{ row.serviceProviderName }}</template>
        </el-table-column>
        <el-table-column align="center" label="流程状态">
          <template slot-scope="{ row }">
            {{ row.status == 0 ? '待配置资料' : row.status == 1 ? '待审核' : row.status == 3 ? '审核驳回' : row.status == 4 ? '已发布' : row.status == 5 ? '已停用' : '' }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="备注" width="150">
          <template slot-scope="{ row }">{{ row.remarks }}</template>
        </el-table-column>
        <el-table-column align="center" label="发布时间" width="150">
          <template slot-scope="{ row }">{{ row.createTime }}</template>
        </el-table-column>
      </el-table>
    </template>
    <span slot="footer" class="dialog-footer">
      <router-link class="ml-10" :to="{ path: '/processPreview', query: { fid: releaseData.flowId } }">
        <el-button type="primary" v-if="tableData.length == 0">预览</el-button>
      </router-link>
      <el-button type="primary" @click="onSubmit">确认发布</el-button>
      <el-button @click="dialogvisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getProcessDetail, getServiceWorkflow, auditProcess, findCountrys, newfindProcesses } from '@/api/newApi/processFields/processConfig';
export default {
  name: 'ReleaseProcess',
  props: {
    visible: Boolean,
    releaseData: {
      typeof: Object,
      default: () => {},
    },
  },
  data() {
    return {
      detailData: {},
      tableData: [],
      countryList: [],
      supplierList: [],
    };
  },
  async created() {
    try {
      let { data } = await getProcessDetail({ flowId: this.releaseData.flowId });
      let { data: tableData } = await getServiceWorkflow({ flowId: this.releaseData.flowId });
      this.detailData = data;
      this.tableData = tableData;
      findCountrys().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });

      newfindProcesses({
        // page: 1,
        // limit: 9999,
      }).then((res) => {
        if (res.code == 0) {
          this.supplierList = res.data.records;
        }
      });
    } catch (error) {}
  },
  computed: {
    dialogvisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },

    setCountryList() {
      return (data) => {
        return data && data.length > 0
          ? data
              .map((item) => {
                let obj = countryList.find((countryItem) => countryItem.countryCode == item);
                return obj.countryNameZh;
              })
              .filter((item) => !!item)
              .toString()
          : '';
      };
    },

    setSupperName() {
      return (data) => {
        return data && data.length > 0
          ? data
              .map((item) => {
                let obj = countryList.find((countryItem) => countryItem.countryCode == item);
                return obj.countryNameZh;
              })
              .filter((item) => !!item)
              .toString()
          : '';
      };
    },
  },

  methods: {
    async onSubmit() {
      let params = { flowId: this.releaseData.flowId, operation: 1 };
      let { code } = await auditProcess(params);
      if (code == 0) {
        this.$message.success('发布成功');
        this.dialogvisible = false;
        this.$parent.queryProcessDetail();
        this.$parent.search();
      } else {
        this.$message.error('操作失败');
      }
    },
    preview() {},
    handleClose(done) {
      done();
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  padding: 0px 15px;
  background-color: rgba(242, 242, 242, 1);
}

.copy-tips {
  font-size: 12px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
}

.title {
  font-size: 14px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 600;
  color: #333333;
  padding: 22px 0px 24px 0px;
  text-align: right;
}
.ml-10 {
  margin-right: 10px;
}
</style>
