<template>
  <div class="wrap">
    <div class="search-wrap">
      <el-form ref="searchForm" inline label-width="100px" @keydown.enter.native="search">
        <el-form-item label="客户属性满足">
          <el-autocomplete :placeholder="inputPlaceholder[selectType]" v-model="recordVal.value" :trigger-on-focus="false" :fetch-suggestions="querySearch" @select="selectValue" class="input-with-select">
            <el-select v-model="selectType" slot="prepend" placeholder="请选择" class="type" @change="recordVal = {}">
              <el-option label="客户手机号" :value="3"></el-option>
              <el-option label="客户名称" :value="1"></el-option>
              <el-option label="企业客户名称" :value="2"></el-option>
            </el-select>
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search()" :disabled="!recordVal.nodeId">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetForm()" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="content-wrap">
      <div class="relation-graph">
        <div v-loading="loading" style="width: 90%; height: calc(100vh - 210px)">
          <SeeksRelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-expand="onNodeExpand" :on-node-click="onNodeClick" />
        </div>
      </div>
    </div>

    <transition name="el-zoom-in-right">
      <div class="modal-detail" v-if="showModal" v-loading="detailLoading">
        <div class="close-btn" @click="showModal = false"></div>
        <div class="close-btn-bg"></div>
        <template v-if="nodeDetailInfo.type === 1">
          <div class="title-name">
            <span class="name">{{ nodeDetailInfo.companyName || '-' }}</span>
            <div class="repurchase-label" v-if="nodeDetailInfo.ordersAmountMoney360DaysLevelSign">
              {{ nodeDetailInfo.ordersAmountMoney360DaysLevelSign || '-' }}
            </div>
            <div class="business-label" v-if="nodeDetailInfo.ordersCount360DaysCycleSign">
              {{ nodeDetailInfo.ordersCount360DaysCycleSign || '-' }}
            </div>
          </div>

          <div class="cell">
            <div class="row">
              <div class="col">
                <div class="hd">所在省份：</div>
                <div class="bd">{{ nodeDetailInfo.companyAddressEnProvice || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">所在市：</div>
                <div class="bd">{{ nodeDetailInfo.companyAddressEnCity || '-' }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="hd">人员规模：</div>
                <div class="bd">{{ nodeDetailInfo.companyPersonnelSizeStr || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">年销售额：</div>
                <div class="bd">{{ nodeDetailInfo.companyYearAmountStr || '-' }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="hd">在售平台：</div>
                <div class="bd">{{ nodeDetailInfo.shopSalePlatformName || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">主要出口国家：</div>
                <div class="bd">{{ nodeDetailInfo.mainSaleCountry || '-' }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="hd">含有客户：</div>
                <div class="bd">{{ nodeDetailInfo.clientCount || '-' }}</div>
              </div>
              <div class="col"></div>
            </div>
          </div>

          <div class="cell">
            <div class="row">
              <div class="col">
                <div class="hd">累计成交次数：</div>
                <div class="bd">{{ nodeDetailInfo.ordersTotal || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">累计成交额：</div>
                <div class="bd">{{ nodeDetailInfo.ordersAmountMoney || '-' }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="hd">累计退款次数：</div>
                <div class="bd">{{ nodeDetailInfo.ordersRefundCount || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">累计退款金额：</div>
                <div class="bd">{{ nodeDetailInfo.ordersRefundAmountMoney || '-' }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="hd">累计购买数量：</div>
                <div class="bd">{{ nodeDetailInfo.productCount || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">累计购买类目：</div>
                <div class="bd">{{ nodeDetailInfo.productCategoryTotal || '-' }}</div>
              </div>
            </div>
          </div>

          <div class="recent-tips">
            <span class="fl">近期成交情况</span>
            <span class="fr" style="font-weight: bold">
              最近一次成交距今：
              <template v-if="nodeDetailInfo.placeOrderDays || nodeDetailInfo.placeOrderDays == '0'">{{ nodeDetailInfo.placeOrderDays }}</template>
              <template v-else>-</template>
              天
            </span>
          </div>

          <div class="content">
            <div class="row title-table">
              <div class="col">周期</div>
              <div class="col">近90天</div>
              <div class="col">近180天</div>
              <div class="col">近360天</div>
              <div class="col">近720天</div>
            </div>
            <div class="row">
              <div class="col">成交次数</div>
              <div class="col">{{ nodeDetailInfo.ordersCountDays90 || '-' }}</div>
              <div class="col">{{ nodeDetailInfo.ordersCountDays180 || '-' }}</div>
              <div class="col">{{ nodeDetailInfo.ordersCountDays360 || '-' }}</div>
              <div class="col">{{ nodeDetailInfo.ordersCountDays720 || '-' }}</div>
            </div>
            <div class="row">
              <div class="col">成交额</div>
              <div class="col">¥ {{ nodeDetailInfo.ordersAmountMoneyDays90 || 0 }}</div>
              <div class="col">¥ {{ nodeDetailInfo.ordersAmountMoneyDays180 || 0 }}</div>
              <div class="col">¥ {{ nodeDetailInfo.ordersAmountMoneyDays360 || 0 }}</div>
              <div class="col">¥ {{ nodeDetailInfo.ordersAmountMoneyDays720 || 0 }}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="title-name">
            <span class="name">{{ nodeDetailInfo.nickName || '-' }}</span>
          </div>

          <div class="cell">
            <div class="row">
              <div class="col">
                <div class="hd">手机号：</div>
                <div class="bd">{{ nodeDetailInfo.userMobile || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">邮箱：</div>
                <div class="bd">{{ nodeDetailInfo.email || '-' }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="hd">微信号：</div>
                <div class="bd">{{ nodeDetailInfo.wxNumber || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">注册日期：</div>
                <div class="bd">{{ nodeDetailInfo.createTime || '-' }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="hd">职务：</div>
                <div class="bd">{{ nodeDetailInfo.workName || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">角色：</div>
                <div class="bd">{{ nodeDetailInfo.roleName || '-' }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="hd">线索来源：</div>
                <div class="bd">{{ nodeDetailInfo.clueSource || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">所属部门：</div>
                <div class="bd">{{ nodeDetailInfo.followDepartmentName || '-' }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="hd">跟进人：</div>
                <div class="bd">{{ nodeDetailInfo.followUserName || '-' }}</div>
              </div>
              <div class="col"></div>
            </div>
          </div>

          <div class="cell">
            <div class="row">
              <div class="col">
                <div class="hd">累计成交次数：</div>
                <div class="bd">{{ nodeDetailInfo.ordersTotal || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">累计成交额：</div>
                <div class="bd">{{ nodeDetailInfo.ordersAmountMoney || '-' }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="hd">累计退款次数：</div>
                <div class="bd">{{ nodeDetailInfo.ordersRefundCount || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">累计退款金额：</div>
                <div class="bd">{{ nodeDetailInfo.ordersRefundAmountMoney || '-' }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="hd">累计购买数量：</div>
                <div class="bd">{{ nodeDetailInfo.productCount || '-' }}</div>
              </div>
              <div class="col">
                <div class="hd">累计购买类目：</div>
                <div class="bd">{{ nodeDetailInfo.productCategoryTotal || '-' }}</div>
              </div>
            </div>
          </div>

          <div class="recent-tips">
            <span class="fl">近期成交情况</span>
            <span class="fr" style="font-weight: bold">
              最近一次成交距今：
              <template v-if="nodeDetailInfo.placeOrderDays || nodeDetailInfo.placeOrderDays == '0'">{{ nodeDetailInfo.placeOrderDays }}</template>
              <template v-else>-</template>
              天
            </span>
          </div>

          <div class="content">
            <div class="row title-table">
              <div class="col">周期</div>
              <div class="col">近90天</div>
              <div class="col">近180天</div>
              <div class="col">近360天</div>
              <div class="col">近720天</div>
            </div>
            <div class="row">
              <div class="col">成交次数</div>
              <div class="col">{{ nodeDetailInfo.ordersCountDays90 || '-' }}</div>
              <div class="col">{{ nodeDetailInfo.ordersCountDays180 || '-' }}</div>
              <div class="col">{{ nodeDetailInfo.ordersCountDays360 || '-' }}</div>
              <div class="col">{{ nodeDetailInfo.ordersCountDays720 || '-' }}</div>
            </div>
            <div class="row">
              <div class="col">成交额</div>
              <div class="col">¥ {{ nodeDetailInfo.ordersAmountMoneyDays90 || 0 }}</div>
              <div class="col">¥ {{ nodeDetailInfo.ordersAmountMoneyDays180 || 0 }}</div>
              <div class="col">¥ {{ nodeDetailInfo.ordersAmountMoneyDays360 || 0 }}</div>
              <div class="col">¥ {{ nodeDetailInfo.ordersAmountMoneyDays720 || 0 }}</div>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import SeeksRelationGraph from 'relation-graph';
import { queryinfo, relationList, getUserNodesInfo, getCompanyNodesInfo, selectOneIdInfo, updateOneIdInfo } from '@/api/newApi/workOrder/dataCenter.js';
export default {
  name: 'SeeksRelationGraphDemo',
  components: { SeeksRelationGraph },
  data() {
    return {
      selectType: 3,
      loading: false,
      detailLoading: false,
      showModal: false,
      recordVal: {
        value: '',
        nodeId: '',
        type: '',
      },
      nodesIdArr: [],
      linksIdArr: [],
      nodeDetailInfo: {},
      onEditName: false,
      inputPlaceholder: {
        1: '请输入客户名称',
        2: '请输入企业客户名称',
        3: '请输入客户手机号',
        4: '请输入OneID标识',
      },
      graphOptions: {
        defaultNodeBorderWidth: 0,
        defaultNodeColor: '#04B8AD',
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        allowShowMiniToolBar: false,
        defaultLineShape: 1,
        layouts: [
          {
            label: '中心',
            layoutName: 'center',
            distance_coefficient: 0.8,
          },
        ],
        defaultJunctionPoint: 'border',
      },
    };
  },
  created() {},
  mounted() {
    //this.setGraphData();
  },
  methods: {
    //选中搜索项
    selectValue(record) {
      this.recordVal = record;
      this.showModal = false;
    },
    //搜索
    search() {
      this.showModal = false;
      this.queryNodes(this.recordVal.nodeId, this.recordVal.type, true);
    },
    //重置
    resetForm() {
      this.recordVal = {};
      this.showModal = false;
      // this.$refs.seeksRelationGraph.refresh();
      this.$refs.seeksRelationGraph.setJsonData({
        nodes: [],
        links: [],
      });
    },
    //点击节点
    onNodeClick(nodeObject, $event) {
      const nodeInfo = nodeObject.data.record;
      let res = null;
      if (nodeInfo.type === 1) {
        res = getCompanyNodesInfo({
          nodeCompanyId: nodeInfo.id,
        });
      } else {
        res = getUserNodesInfo({
          nodeUserId: nodeInfo.id,
        });
      }
      this.detailLoading = true;
      res
        .then((res) => {
          this.detailLoading = false;
          if (res.code === 0 && res.data) {
            this.nodeDetailInfo = res.data || {};
            this.nodeDetailInfo.type = nodeInfo.type;
            this.showModal = true;
          }
        })
        .catch((e) => {
          this.detailLoading = false;
        });
    },
    //展开关闭
    onNodeExpand(node, e) {
      if (node.data.childrenLoaded) {
        console.log('这个节点的子节点已经加载过了');
        this.$refs.seeksRelationGraph.refresh();
        return false;
      }
      this.queryNodes(node.data.record.id, node.data.record.type, false);
      node.data.childrenLoaded = true;
    },
    //查询节点信息
    queryNodes(dataId, dataType, type = false) {
      // console.log(dataId);
      // console.log(dataType);
      if (!dataId) {
        return false;
      }
      relationList({
        dataId: dataId,
        dataType: dataType,
      }).then((res) => {
        if (res.code === 0 && res.data) {
          const data = res.data;
          this.appendJsonData(
            data.childNodes.map((v) => {
              return {
                id: v.dataId,
                text: v.dataName,
                type: v.dataType,
                link: v.relation,
                linkId: v.id,
              };
            }),
            {
              id: data.dataId,
              text: data.dataName,
              type: data.dataType,
            },
            type
          );
        } else {
          this.$message.error('搜索数据异常');
        }
      });
      // .catch((e) => {
      //   this.$message.error('搜索数据异常');
      // });
    },
    //设置关系图数据 li : id、text、type、link
    appendJsonData(nodesList = [], rootInfo = {}, reset = false) {
      if (reset) {
        this.$refs.seeksRelationGraph.setJsonData({
          nodes: [this.getNodeParams(rootInfo, true, true)],
          links: [],
        });
        this.nodesIdArr = [rootInfo.id];
        this.linksIdArr = [];
      }
      const graphJsonData = {
        nodes: [],
        links: [],
      };

      nodesList = nodesList.filter((v) => this.linksIdArr.indexOf(v.linkId) === -1);
      if (nodesList.length == 0) {
        this.$message.warning('没有关系数据');
        return false;
      }

      for (const li of nodesList) {
        if (this.nodesIdArr.indexOf(li.id) === -1) {
          graphJsonData.nodes.push(this.getNodeParams(li));
          this.nodesIdArr.push(li.id);
        }
        graphJsonData.links.push({
          from: li.type === 1 ? rootInfo.id : li.id,
          to: li.type === 1 ? li.id : rootInfo.id,
          text: li.link,
        });
        this.linksIdArr.push(li.linkId);
      }

      this.$refs.seeksRelationGraph.appendJsonData(graphJsonData, (seeksRGGraph) => {});
    },
    //获取节点数据
    getNodeParams(li = {}, expanded = false, childrenLoaded = false) {
      const companyImg =
        'data:image/png;base64,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';
      const userImg =
        'data:image/png;base64,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';

      const node = {
        id: li.id,
        text: li.text,
        expandHolderPosition: 'right',
        expanded: expanded,
        // html: `<div style='width:100px;height:100px;background: url(${companyImg}) '>sadfas</div>`,
        borderWidth: 0,
        data: {
          childrenLoaded: childrenLoaded,
          record: li,
        },
      };
      if (li.type === 1) {
        node.width = 165;
        node.height = 165;
        node.html = `
        <div style='width:165px;height:165px;background: url(${companyImg}) no-repeat; background-size: 100%; display:flex;align-items: center;'>
          <p style="width: 115px;margin: auto;text-align: center;color: #fff;word-wrap: break-word;word-break: break-all;">
            ${node.text || '-'}
          </p>
        </div>`;
      } else {
        node.width = 120;
        node.height = 120;
        node.html = `
        <div style='width:120px;height:120px;background: url(${userImg}) no-repeat; background-size: 100%; display:flex;align-items: center;'>
          <p style="width: 75px;margin: auto;text-align: center;color: #fff;word-wrap: break-word;word-break: break-all;">
            ${node.text || '-'}
          </p>
        </div>`;
      }
      return node;
    },
    //搜索关键字下拉选项
    querySearch(queryString, cb) {
      if (this.selectType === 1 && queryString && queryString.length < 2) {
        cb([]);
        return false;
      }
      if (this.selectType === 2 && queryString && queryString.length < 2) {
        cb([]);
        return false;
      }
      if (this.selectType === 3 && queryString && queryString.length < 8) {
        cb([]);
        return false;
      }
      queryinfo({
        type: this.selectType,
        queryTerm: queryString,
      })
        .then((res) => {
          if (res.code === 0 && res.data && res.data.length > 0) {
            const Arr = res.data.map((v) => {
              return {
                value: v.nodeName,
                nodeId: v.nodeId,
                type: v.type,
              };
            });
            cb(Arr);
          } else {
            cb([]);
          }
        })
        .catch((e) => {
          cb([]);
          return false;
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.wrap {
  margin: 0 10px;
  .search-wrap {
    background-color: #fff;
    padding: 19px 20px 0;
    margin-bottom: 15px;
    .input-with-select {
      width: 380px;
      .type {
        width: 130px;
      }
      .btn {
        width: 80px;
      }
    }
  }
  .content-wrap {
    display: flex;
    .relation-graph {
      flex: 1;
      background-color: #fff;
      overflow: hidden;
    }
  }
  .drawer-wrap {
    position: relative;
  }
  .modal-detail {
    position: fixed;
    z-index: 99999;
    right: 0;
    top: 0;
    bottom: 0;
    width: 620px;
    height: 100vh;
    box-shadow: -2px 0px 20px 0px rgba(0, 0, 0, 0.1);
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
    background-color: #fff;
    .close-btn {
      position: absolute;
      top: 50%;
      left: -56px;
      width: 56px;
      height: 230px;
      margin-top: -115px;
      background: url('data:image/png;base64,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')
        no-repeat;
      background-size: 56px 230px;
      cursor: pointer;
      z-index: 9;
    }
    .close-btn-bg {
      position: absolute;
      top: 50%;
      left: -20px;
      width: 20px;
      height: 230px;
      margin-top: -115px;
      background-color: #fff;
      z-index: 8;
    }
    .title-name {
      width: 100%;
      border-bottom: 1px solid #ddd;
      padding: 24px 30px;
      overflow: hidden;
      .name {
        float: left;
        line-height: 32px;
        font-size: 20px;
        font-weight: bold;
        color: #333;
      }

      .repurchase-label {
        float: right;
        position: relative;
        height: 32px;
        line-height: 32px;
        padding: 0 15px;
        background-color: #ffe8bf;
        color: #e29100;
        font-weight: bold;
        margin-left: 36px;
      }
      .repurchase-label::before {
        content: '';
        position: absolute;
        border: 16px solid transparent;
        border-right-width: 13px;
        top: 0px;
        left: -29px;
        border-right-color: #ffe8bf;
      }

      .business-label {
        float: right;
        position: relative;
        height: 32px;
        line-height: 32px;
        padding: 0 15px;
        background-color: #d2eaff;
        color: #1890ff;
        font-weight: bold;
        margin-left: 36px;
      }
      .business-label::before {
        content: '';
        position: absolute;
        border: 16px solid transparent;
        border-right-width: 13px;
        top: 0px;
        left: -29px;
        border-right-color: #d2eaff;
      }
    }
    .cell {
      margin: 36px 40px;
      padding: 30px 0;
      border: 1px solid #ddd;
      .row {
        display: flex;
        .col {
          flex: 1;
          display: flex;
          font-size: 14px;
          padding: 10px 0;
          .hd {
            flex: 1;
            text-align: right;
            color: #666;
          }
          .bd {
            flex: 1;
            color: #333;
          }
        }
      }
    }
    .recent-tips {
      font-size: 14px;
      color: #333;
      margin: 0 40px;
      line-height: 24px;
      overflow: hidden;
      .fl {
        float: left;
      }
      .fr {
        float: right;
      }
    }
    .content {
      border: 1px solid #ddd;
      margin: 20px 40px;
      font-size: 14px;
      line-height: 35px;
      text-align: center;
      .title-table {
        background-color: #f6f6f6;
      }
      .row {
        border-bottom: 1px solid #ddd;
        display: flex;
        .col {
          border-right: 1px solid #ddd;
          flex: 1;
        }
        .col:last-child {
          border-right: none;
        }
      }
      .row:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
