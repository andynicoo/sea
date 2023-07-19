<template>
  <div>
    <div class="commontitle">EPR加类加品牌工作台</div>
    <div class="content">
      <div class="title">
        <span class="label">公司名称/服务号</span>
        <Input
          v-model="searchForm.searchKeyWord"
          clearable
          placeholder="请输入注册主体名称/服务号"
          style="width: 200px; margin-right: 32px"
        />
        <span class="label">国家</span>
        <Select
          v-model="searchForm.countryCode"
          placeholder="请选择国家"
          style="width: 180px; margin-right: 32px"
          clearable
        >
          <Option value="FR">法国</Option>
          <Option value="DE">德国</Option>
        </Select>

        <span class="label">业务分类</span>
        <Select
          v-model="searchForm.functionCode"
          placeholder="请选择业务分类"
          style="width: 180px; margin-right: 32px"
          clearable
        >
          <Option :value="106">WEEE加类加品牌</Option>
          <Option :value="107">德国电池法补规格补品牌</Option>
        </Select>

        <span class="label">工单号</span>
        <Input
          v-model="searchForm.workNo"
          clearable
          placeholder="请输入工单号"
          style="width: 200px; margin-right: 32px"
        />

        <Button type="primary" @click="handleSubmit" style="margin-left: 94px">搜索</Button>
        <Button @click="handleReset" style="margin-left: 10px">重置</Button>
        <p style="margin-top: 20px">
          <span class="label">服务状态</span>
          <RadioGroup v-model="searchForm.serviceStatus" @on-change="getList">
            <Radio v-for="(item, index) in statusList" :label="item.value" class="statusStyle" :key="index" border>
              {{ item.label }}
            </Radio>
          </RadioGroup>
        </p>
      </div>
      <div class="tabs-box">
        <div :class="statusIndex == 'undefined' ? 'active' : ''" @click="changeStatus('undefined')">全部</div>
        <div
          @click="changeStatus(node.nodeCode)"
          :class="statusIndex === node.nodeCode ? 'active' : ''"
          v-for="node in nodeList"
          :key="node.nodeId"
        >
          {{ node.nodeName }}
        </div>
      </div>
      <div class="table1">
        <Table
          :style="{ 'min-height': registerList.length == 0 ? '184px' : '' }"
          :no-data-text="'暂无处理事项'"
          :columns="columns"
          :data="registerList"
        >
          <template slot="operate" slot-scope="{ row }" style="color: #16ade9">
            <div>
              <div
                class="btF"
                v-if="row.cureentNodeCode != nodeEnum.WAIT_UPLOAD"
                @click.stop="toRegister(row)"
                style="color: #515b6e"
              >
                <img
                  src="@/assets/images/survey/detail.svg"
                  style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                />
                <span>查看</span>
              </div>

              <div
                v-if="row.serviceStatus == 1"
                style="display: flex; justify-items: center; justify-content: space-around"
              >
                <div
                  @click.stop="toRegister(row)"
                  class="btF"
                  style="color: #f79728"
                  v-if="row.cureentNodeCode == nodeEnum.WAIT_UPLOAD && row.progressBar == 1"
                >
                  <img
                    src="@/assets/images/survey/shangchuan1.svg"
                    style="width: 20px; position: relative; top: 4px; margin-right: 2px"
                  />
                  <span>提交资料</span>
                </div>

                <div class="btF" v-if="['NODE0066', 'NODE0065'].includes(row.cureentNodeCode)">
                  <template v-if="row.buy && row.functionCode == 106">
                    <img
                      src="@/assets/images/shoppingCar/gowuchelan.png"
                      style="width: 20px; position: relative; top: 6px; margin-right: 2px"
                    />
                    <span style="color: #5cc5f0" @click.stop="getProductInfo(row, 106, '德国WEEE注册')"
                      >加类加品牌</span
                    >
                  </template>

                  <Tooltip
                    placement="left"
                    content="已加类品，若需继续新增，请前往加类加品牌工作台最新工单操作"
                    v-if="!row.buy && row.functionCode == 106"
                  >
                    <img
                      src="@/assets/images/shoppingCar/gowuchelan.png"
                      style="width: 20px; position: relative; top: 6px; margin-right: 2px"
                    />
                    <span>加类加品牌</span>
                  </Tooltip>

                  <template v-if="row.buy && row.functionCode == 107">
                    <img
                      src="@/assets/images/shoppingCar/gowuchelan.png"
                      style="width: 20px; position: relative; top: 6px; margin-right: 2px"
                    />
                    <span style="color: #5cc5f0" @click.stop="getProductInfo(row, 107, '德国电池法注册')"
                      >补规格补品牌</span
                    >
                  </template>

                  <Tooltip
                    placement="left"
                    content="该工单已补规格补品牌，若需继续新增，请前往EPR补规格补品牌最新工单操作"
                    v-if="!row.buy && row.functionCode == 107"
                  >
                    <img
                      src="@/assets/images/shoppingCar/gowuchelan.png"
                      style="width: 20px; position: relative; top: 6px; margin-right: 2px"
                    />
                    <span>补规格补品牌</span>
                  </Tooltip>
                </div>

                <div @click.stop="toRegister(row)" class="btF" style="color: #ed3e3e" v-if="row.progressBar == 2">
                  <img
                    src="@/assets/images/survey/bohui1.svg"
                    style="width: 20px; position: relative; top: 4px; margin-right: 0px"
                  />
                  <span>查看驳回原因</span>
                </div>
              </div>
            </div>
          </template>
        </Table>
        <div style="margin-top: 30px; text-align: right">
          <Page :total="total" :page-size="searchForm.limit" :current="searchForm.page" @on-change="pageChange" />
        </div>
      </div>
    </div>
    <div style="height: 1px"></div>
  </div>
</template>

<script>
import { getEPRNodes, addCategoryBrandList } from '@/api/taxModule';
// import { productInfo } from '@/api/shoppingCar/shoppingCar';
import { newProductInfo } from '@/api/shoppingCar/shoppingCar';
export default {
  data() {
    return {
      searchForm: {
        searchKeyWord: '',
        cureentNodeCode: '',
        countryCode: '',
        serviceStatus: '1',
        page: 1,
        limit: 10,
      },
      statusIndex: 'undefined',
      columns: [
        {
          title: '注册服务号',
          key: 'parentServiceNo',
          width: 170,
        },
        {
          title: '服务号',
          key: 'serviceNo',
          width: 170,
        },
        {
          title: '公司名称',
          key: 'companyNameZh',
          width: 180,
          tooltip: true,
          render(h, params) {
            let type = '暂未填写';
            if (params.row.shopNature == 2 && params.row.registrantName != '') {
              type = params.row.registrantName;
              return h(
                'Tooltip',
                {
                  props: {
                    placement: 'top',
                    content: type,
                    maxWidth: '200px',
                  },
                  style: {
                    cursor: 'pointer',
                    'white-space': 'nowrap',
                    overflow: 'hidden',
                    'text-overflow': 'ellipsis',
                    '-webkit-box-orient': 'vertical',
                  },
                },
                type
              );
            } else if (params.row.companyNameZh != '') {
              type = params.row.companyNameZh;
              return h(
                'Tooltip',
                {
                  props: {
                    placement: 'top',
                    content: type,
                    maxWidth: '200px',
                  },
                  style: {
                    cursor: 'pointer',
                    'white-space': 'nowrap',
                    overflow: 'hidden',
                    'text-overflow': 'ellipsis',
                    '-webkit-box-orient': 'vertical',
                  },
                },
                type
              );
            } else {
              return h(
                'span',
                {
                  style: {
                    color: '#999999',
                  },
                },
                type
              );
            }
          },
        },
        {
          title: '业务分类',
          key: 'functionCodeDesc',
          width: 170,
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 80,
        },
        {
          title: '服务名称',
          key: 'serviceName',
          minWidth: 90,
        },
        {
          title: '服务到期日期',
          key: 'expirationTime',
          render(h, params) {
            let endTime = params.row.expirationTime.slice(0, 10);
            return h('span', endTime);
          },
          width: 126,
        },
        {
          title: '服务进度',
          key: 'currentNodeStr',
          minWidth: 120,
        },
        {
          title: '操作',
          slot: 'operate',
          width: 200,
        },
      ],
      registerList: [],
      total: 0,
      nodeList: [
        {
          nodeCode: 'NODE0060',
          nodeName: '待上传资料',
        },
        {
          nodeCode: 'NODE0061',
          nodeName: '待审核资料',
        },
        {
          nodeCode: 'NODE0062',
          nodeName: '已审核',
        },
        {
          nodeCode: 'NODE0065',
          nodeName: '注册中',
        },
        {
          nodeCode: 'NODE0066',
          nodeName: '注册完成',
        },
      ],
      nodeEnum: {
        WAIT_UPLOAD: 'NODE0060', //待上传资料
        WAIT_REVIEW: 'NODE0061', //待审核资料
        REVIEWED: 'NODE0062', //已审核
        WAIT_AUTHORIZE: 'NODE0063', //待授权
        AUTHORIZE_WAIT_CONFIRM: 'NODE0064', //授权待确认
        REGISTERING: ['NODE0065', 'NODE0265'], //转代理中
        REGISTER_COMPLETE: ['NODE0066', 'NODE0266'], //转代理完成
      },
      statusList: [
        { label: '全部', value: '' },
        { label: '正常', value: '1' },
        { label: '取消中', value: '11' },
        { label: '已取消', value: '9' },
      ],
    };
  },
  methods: {
    handleSubmit() {
      this.searchForm.page = 1;
      this.getList();
    },
    handleReset() {
      this.searchForm = {
        searchKeyWord: '',
        cureentNodeCode: '',
        countryCode: '',
        page: 1,
        limit: 10,
        serviceStatus: '1',
      };
    },
    toRegister(row) {
      let path = '/complianceBusiness/addCategoryBrandDetails';
      this.$router.push({
        path,
        query: {
          status: row.cureentNodeCode,
          countryNameZh: row.country,
          serviceId: row.serviceId,
          serviceName: row.serviceName,
          serviceNo: row.serviceNo,
        },
      });
    },
    getProductInfo(row, functionCode, productName) {
      newProductInfo({
        functionCode,
        productName,
      }).then((res) => {
        if (res.data.records && res.data.records.length) {
          this.$router.push({
            path: '/serviceDetail',
            query: { id: res.data.records[0].id, serviceId: row.parentServiceId, serviceType: 'EPR' },
          });
        } else {
          this.$Message.error('暂无商品，请先添加商品!');
        }
      });
    },
    pageChange(page) {
      this.searchForm.page = page;
      this.getList();
    },
    changeStatus(nodeCode) {
      if (nodeCode == 'undefined') {
        this.searchForm.cureentNodeCode = '';
      } else {
        this.searchForm.cureentNodeCode = nodeCode;
      }
      this.statusIndex = nodeCode;
      this.searchForm.page = 1;
      this.getList();
    },
    getList() {
      addCategoryBrandList(this.searchForm).then((res) => {
        if (res.code == 0) {
          this.registerList = res.data.records;
          this.total = res.data.total - 0;
        }
      });
    },
    getNodes() {
      getEPRNodes().then((res) => {
        if (res.code === 0) {
          this.nodeList = res.data;
        }
      });
    },
  },
  created() {
    this.getList();
    // this.getNodes();
  },
};
</script>

<style lang="less" scoped>
.statusStyle {
  width: 80px;
  margin-right: 10px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  border-radius: 5px !important;
}
/deep/ .ivu-radio {
  display: none;
}
/deep/ .ivu-table-tip {
  table {
    min-height: 184px;
    font-size: 12px;
  }
}
/deep/ .ivu-tooltip-rel {
  max-width: 150px;
  display: block;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // -webkit-box-orient: vertical;
}
/deep/ .ivu-table-row {
  th,
  td {
    text-align: center;
    font-size: 12px;
  }
}
/deep/ .ivu-table-header {
  th {
    text-align: center;
    font-weight: 600;
    color: #333;
    font-size: 12px;
  }
}
.head {
  background-color: #ffffff;
  padding: 12px 32px;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}
.content {
  border-radius: 4px;
  margin: 24px;
  min-height: 800px;
  background-color: #ffffff;
  .title {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 20px 24px 0;
    background-color: #ffffff;
    .label {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #666666;
      margin-right: 6px;
    }
  }
  .table1 {
    padding: 24px;
    .btF {
      cursor: pointer;
    }
  }
  .tabs-box {
    border-bottom: 1px solid #f6f6f6;
    padding-left: 24px;
    display: flex;
    margin-top: 20px;
    div {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333;
      margin-right: 42px;
      padding-bottom: 6px;
      cursor: pointer;
      &.active {
        color: #1890ff;
        border-bottom: 2px solid #1890ff;
      }
      .huibiao {
        display: inline-block;
        background-color: #ff5050;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        // width: 16px;
        padding: 0 5px;
        margin-left: 2px;
      }
    }
  }
}
/deep/ .ivu-tooltip-inner {
  white-space: break-spaces !important;
}
</style>
