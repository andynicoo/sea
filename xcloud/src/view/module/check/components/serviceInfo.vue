<template>
  <div>
    <el-table :data="list" border :span-method="objectSpanMethod" v-loading="loading" :cell-class-name="cellClassName">
      <el-table-column label="订单号" prop="orderNo" min-width="80px" v-if="hasAuthority('Q2_24')">
        <template slot-scope="{ row }">
          {{ row.orderNo }}
          <el-tag v-if="row.flagRenew === 1">续费</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所属主体" prop="enterpriseId" min-width="80px" v-if="hasAuthority('Q2_44')">
        <template slot-scope="{ row }">
          {{ row.enterpriseId | filterKey(firmList, 'id', 'name') }}
        </template>
      </el-table-column>
      <el-table-column label="订单创建时间" prop="orderCreateTime" min-width="100px" v-if="hasAuthority('Q2_25')">
        <template slot-scope="{ row }">
          {{ row.orderCreateTime || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="服务号" prop="serviceNo" min-width="120px" v-if="hasAuthority('Q2_23')">
        <template slot-scope="{ row }">
          {{ row.serviceNo || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="productName" v-if="hasAuthority('Q2_20')">
        <template slot-scope="{ row }">
          {{ row.productName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="服务生成时间" prop="serviceCreateTime" min-width="100px" v-if="hasAuthority('Q2_27')">
        <template slot-scope="{ row }">
          {{ row.serviceCreateTime || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="工单号/服务ID" prop="workNo" min-width="160px" v-if="hasAuthority('Q2_19')">
        <template slot-scope="{ row }">
          <el-link type="primary" :underline="false" @click="workOrderDetail(row)" v-if="row.workNo || row.productFunctionCode === 20"> {{ row.productFunctionCode === 20 ? row.serviceId : row.workNo }} </el-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="商品规格名称" prop="specsName" v-if="hasAuthority('Q2_21')">
        <template slot-scope="{ row }">
          {{ row.specsName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="服务状态" prop="status" v-if="hasAuthority('Q2_22')">
        <template slot-scope="{ row }">
          <span class="text-tips">{{ row.status | serviceStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务商/律师" prop="supplierName" v-if="hasAuthority('Q2_26')">
        <template slot-scope="{ row }">
          {{ row.supplierName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="当前业务节点" prop="cureentNodeName" min-width="80px" v-if="hasAuthority('Q2_42')">
        <template slot-scope="{ row }">
          {{ row.cureentNodeName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="订单归属人" prop="attributionName" v-if="hasAuthority('Q2_29')">
        <template slot-scope="{ row }">
          {{ row.attributionName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="交付处理人" prop="handlerUserName" v-if="hasAuthority('Q2_30')">
        <template slot-scope="{ row }">
          {{ row.handlerUserName || '-' }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="工单耗时" min-width="110px" v-if="hasAuthority('Q2_28')">
        <template slot-scope="{ row }">
          <span>{{ formatTime(row.workCreateTime, row.endTime) }}</span>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { workOrderGroupList } from '@/api/newApi/check/check.js';
import { mapMutations } from 'vuex';
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
    formatTime(beginTime, endTime) {
      return this.$util.formatTimeDiff(beginTime, endTime);
    },
    ...mapMutations(['addTag']),
    getList() {
      setTimeout(() => {
        this.loading = true;
      });
      workOrderGroupList({
        ...this.form,
        type: this.type,
        value: this.val,
      })
        .then((res) => {
          if (res.code === 0) {
            this.total = res.data.total - 0;
            this.formatListData(res.data.records);
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
    formatListData(data) {
      let list = [];
      data.forEach((item) => {
        item.workOrderServiceDataGroupByOrderNoVoS.forEach((infoList, i) => {
          list.push({
            ...item,
            ...infoList,
            rowspan: item.workOrderServiceDataGroupByOrderNoVoS.length,
            index: i,
          });
        });
      });
      this.list = list;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let combineList = ['orderCreateTime', 'orderNo', 'enterpriseId'];
      if (combineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (row.serviceNo === this.val && column.property === 'serviceNo') {
        return 'hight-light';
      }
    },
    workOrderDetail(row) {
      if (!this.hasAuthority('Q2_31')) return;
      let r = null;
      switch (row.productFunctionCode) {
        case 1: // VAT申报
          // TODO 新申报上线后需修改跳转路径
          this.$router.push({
            name: 'taxNumDeclareDetail',
            query: {
              id: row.serviceId,
            },
          });
          break;
        case 6: // 税号注销
          r = {
            path: '/logoutTaxNum/detail',
            query: {
              workOrderId: row.workOrderId,
              userId: row.userId,
              serviceNo: row.serviceNo,
            },
          };
          break;
        case 7: // 税务稽查
          r = {
            path: '/taxInspection/detail',
            query: {
              workOrderId: row.workOrderId,
              userId: row.userId,
              serviceNo: row.serviceNo,
            },
          };
          break;
        case 2: // 税务转代理
          r = {
            name: 'taxInfo',
            query: {
              workOrderId: row.workOrderId,
              serviceNo: row.serviceNo,
            },
          };
          break;
        case 24: // VAT退税
          r = {
            path: '/taxRefund/detail',
            query: {
              workOrderId: row.workOrderId,
              userId: row.userId,
              serviceNo: row.serviceNo,
            },
          };
          break;
        case 5: // 税号注册
        case 23:
          r = {
            name: 'taxRegisterInfo',
            query: {
              workOrderId: row.workOrderId,
              serviceNo: row.serviceNo,
            },
          };
          break;
        case 13: // 海牙认证
          r = {
            path: '/hyCertification/detail',
            query: {
              workOrderId: row.workOrderId,
              serviceNo: row.serviceNo,
              userId: row.userId,
            },
          };
          break;
        case 101: // 建模绘图
        case 102:
        case 103:
          r = {
            path: '/modelingAndDrawing/detail',
            query: {
              serviceId: row.serviceId,
            },
          };
          break;
        case 100: // 国际外观专利
          if (row.typeCode === 100) {
            // 国际外观专利

            r = {
              path: '/appearancePatent/detail',
              query: {
                serviceId: row.serviceId,
                productFunctionCode: row.productFunctionCode,
              },
            };
          } else if (row.typeCode === 104) {
            // 外观专利OA
            r = {
              path: '/OAAppearancePatent/detail',
              query: {
                workOrderId: row.workOrderId,
              },
            };
          } else if (row.typeCode === 105) {
            // 外观专利授权书
            r = {
              path: '/certificate/detail',
              query: {
                workOrderId: row.workOrderId,
              },
            };
          }
          break;
        case 104: // 外观专利OA
          r = {
            path: '/OAAppearancePatent/detail',
            query: {
              workOrderId: row.workOrderId,
            },
          };
          break;
        case 105: // 外观专利授权书
          r = {
            path: '/certificate/detail',
            query: {
              workOrderId: row.workOrderId,
            },
          };
          break;
        case 61: // 国际商标注册
          if (row.typeCode === -17) {
            r = {
              path: '/oa/detail',
              query: {
                isOaDetail: true,
                serviceId: row.serviceId,
              },
            };
          } else {
            r = {
              path: '/trademark/detail',
              query: {
                nodeCode: row.cureentNodeCode,
                serviceId: row.serviceId,
              },
            };
          }
          break;
        case 31: // EPR注册
          // EPR申报
          if (row.typeCode === -18) {
            r = {
              path: '/EPRDeclare/detail',
              query: {
                workNo: row.workNo,
                workId: row.workOrderId,
              },
            };
          } else {
            r = {
              path: '/EPRManage/detail',
              query: {
                serviceId: row.serviceId,
                serviceNo: row.serviceNo,
                nodeCode: row.cureentNodeCode,
              },
            };
          }
          break;
        case 32: // EPR转代理
          r = {
            path: '/EPRTaxServices/detail',
            query: {
              serviceId: row.serviceId,
              serviceNo: row.serviceNo,
            },
          };
          break;
        case 106: // EPR加类加品牌
        case 107:
          r = {
            path: '/addCategoryBrand/detail',
            query: {
              serviceId: row.serviceId,
              serviceNo: row.serviceNo,
              nodeCode: row.cureentNodeCode,
            },
          };
          break;
        case 16: // 授权代表
          r = {
            path: '/authorizedRepresent/detail',
            query: {
              serviceId: row.serviceId,
            },
          };
          break;
        case 20: // 极简工单
          r = {
            path: '/VATOtherService/detail',
            query: {
              id: row.serviceId,
            },
          };
          break;
      }

      if (r) {
        this.$router.push(r);
      }
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
::v-deep .hight-light {
  background-color: #c5effd !important;
}
</style>
