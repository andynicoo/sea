<template>
  <div>
    <Modal v-model="replyPlanModal" width="700" @on-visible-change="changeState">
      <div class="tipsModal-title">选择答复方案</div>
      <Tabs :value="String(currently)" @on-click="changeTab">
        <TabPane v-for="(item, index) in trademarkReplyPlan" :label="'答复方案 ' + (index + 1)" :name="String(item.id)" :key="item.id">
          <div class="modal-contnet" v-if="currently == item.id">
            <div class="notice-content">
              <p class="title">答复建议：</p>
              <span style="white-space: pre">{{ item.planInfo.replyStr }}</span>
            </div>
            <div style="color:red"><Icon type="information-circled"></Icon>OA付费方案一旦选择将无法进行修改，请谨慎确认</div>
            <div class="service" v-show="!(item.planInfo.oaServiceList.length == 0 && item.planInfo.otherServiceList.length == 0)">
              <div class="title header">付费服务信息：</div>
              <div class="service-info">
                <template v-if="item.planInfo.oaServiceList.length > 0">
                  <span class="title">OA服务付费</span>
                  <Table border :columns="serviceFeeColumns" :data="item.planInfo.oaServiceList" style="margin:8px 0 20px 0"></Table>
                </template>
                <template v-if="item.planInfo.otherServiceList.length > 0">
                  <span class="title">使用证据服务</span>
                  <RadioGroup v-model="form.useEvidence" style="margin-left:20px">
                    <Radio label="1">顾问服务</Radio>
                    <Radio label="2">非顾问服务，自己提供</Radio>
                  </RadioGroup>
                  <Table border v-if="form.useEvidence != 2" :columns="useEvidenceColumns" :data="item.planInfo.otherServiceList" style="margin:8px 0 20px 0"></Table>
                </template>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
      <!-- <div style="padding:5px 24px 10px;">
        <p class="title">提示：</p>
        <p>
          选择顾问服务需支付使用证据服务费用,届时您需要确定服务内容以及确认成品效果 选择非顾问服务，自己 提供，需按答复建议进行操作，将使用证据文件信息与OA附件整理成同一个压缩文件上传至系统
        </p>
      </div> -->
      <div slot="footer" class="reject-fotter">
        <Button type="primary" @click="confirm" :loading="confirmLoading">选用该方案答复</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getOaReplyPlanAndEvidenceApi, ByOaReplyCreateOrderApi } from '@/api/breadInfoDetail';
export default {
  props: {
    oaDetailInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      replyPlanModal: true,
      trademarkReplyPlan: [],
      planInfo: [],
      selectRows: [],
      currentId: '',
      currently: '',
      confirmLoading: false,
      form: {
        useEvidence: null,
      },
      serviceFeeColumns: [
        {
          title: '服务',
          key: 'evidenceComboName',
          align: 'center',
        },
        {
          title: '国家',
          key: 'oaCountry',
          align: 'center',
          width: '150px',
        },
        {
          title: '售价',
          key: 'oaPrice',
          align: 'center',
          width: '150px',
        },
      ],
      replyId: undefined,
      useEvidenceColumns: [
        {
          title: '选择',
          width: 60,
          align: 'center',
          render: (h, params) => {
            // 实现单选
            let id = params.row._index;
            let flag = false;
            if (this.currentId === id) {
              flag = true;
            } else {
              flag = false;
            }
            return h('Radio', {
              props: {
                value: flag,
              },
              on: {
                'on-change': () => {
                  this.currentId = id;
                  this.selectChange(params.row);
                },
              },
            });
          },
        },
        {
          title: '服务',
          key: 'evidenceComboName',
          align: 'center',
        },
        {
          title: '国家',
          key: 'otherCountry',
          align: 'center',
          width: '150px',
        },
        {
          title: '售价',
          key: 'otherPrice',
          align: 'center',
          width: '150px',
        },
      ],
    };
  },

  created() {
    this.getOaReplyPlanAndEvidence();
  },
  methods: {
    // 获取答复方案
    getOaReplyPlanAndEvidence() {
      getOaReplyPlanAndEvidenceApi(this.oaDetailInfo.id).then((res) => {
        if (res.code == 0) {
          this.trademarkReplyPlan = res.data.trademarkReplyPlan;
          // 解析planInfo
          this.trademarkReplyPlan.forEach((item) => {
            item.planInfo = JSON.parse(item.planInfo);
          });
          // 如果有值，默认选择第一条
          if (this.trademarkReplyPlan && this.trademarkReplyPlan.length > 0) {
            this.currently = this.trademarkReplyPlan[0].id;
            this.replyId = this.trademarkReplyPlan[0].id;
          }
        }
      });
    },
    // 选用该方案答复
    confirm() {
      console.log(this.currently, 'this.currently');
      // 根据但前tab选中的方案匹配对应的planInfo
      this.planInfo = this.trademarkReplyPlan.find((item) => item.id == this.currently).planInfo;
      console.log(this.planInfo.otherServiceList, 'this.planInfo.otherServiceList');
      if (this.planInfo.otherServiceList.length > 0) {
        if (!this.form.useEvidence) {
          this.$Message.error('请选择是否为我司提供或自己提供!');
          return;
        }
        if (this.form.useEvidence == 1 && this.selectRows.length == 0) {
          this.$Message.error('请选择使用证据服务!');
          return;
        }
      }
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>OA付费方案一旦选择将无法进行修改，请谨慎确认</p>',
        onOk: () => {
          this.ByOaReplyCreateOrder();
        },
      });
    },
    // 根据OA方案创建订单
    ByOaReplyCreateOrder() {
      this.confirmLoading = true;
      let orderInfo = {
        replyStr: this.planInfo.replyStr,
      };
      if (this.planInfo.oaServiceList.length > 0) {
        orderInfo.oaServiceList = this.planInfo.oaServiceList;
      }
      // 如果是我司提供，需要传otherServiceList中当前选择的那条服务否则不传
      if (this.form.useEvidence == 1) {
        orderInfo.otherServiceList = this.selectRows;
      }
      let params = {
        oaId: this.oaDetailInfo.id,
        planJson: JSON.stringify(orderInfo),
        replyId: this.replyId,
      };
      ByOaReplyCreateOrderApi(params)
        .then((res) => {
          if (res.code == 0) {
            let data = res.data;
            // resultCode处理结果，0、可支付 1、不需要支付(购买成功了)
            if (data.resultCode === 1 || (data.resultCode === 0 && data.orderNo == '')) {
              this.$emit('answerFreeFunc');
            } else if (data.resultCode === 0 && data.orderNo != '') {
              this.$router.push({
                path: '/sureOrder',
                query: { id: data.id, type: 'oa' },
              });
            }
          }
        })
        .catch((err) => {
          this.$Message.error(err);
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    // 切换tab时清空已选数据
    changeTab(val) {
      this.currently = val;
      this.replyId = val;
      // this.selectRows = [];
      this.form.useEvidence = null;
      this.currentId = '';
    },
    // 当前选中的数据
    selectChange(val) {
      // console.log(val);
      this.selectRows = [val];
      // this.selectRows.push(val)
    },
    handleRowClick(row, index) {
      this.currentId = index;
    },
    changeState(val) {
      this.$emit('changeState', val);
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .modal-contnet {
  padding: 10px 20px;
  max-height: 800px;
  overflow-y: auto;
  .notice-content {
    padding: 12px 20px 12px 14px;
    background-color: #eff9ff;
    font-size: 12px;
    font-family: PingFangSC;
    color: #666666;
    line-height: 22px;
    margin-bottom: 16px;
  }
  .service {
    border: 1px solid #f1f0f2;
    border-radius: 4px;
    .header {
      padding: 12px 30px 12px 14px;
      background: #fafafc;
      border-bottom: 1px solid #f1f0f2;
    }
    .service-info {
      padding: 12px 30px 12px 14px;
    }
  }
}
.title {
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  line-height: 22px;
}
/deep/ .tipsModal-title {
  padding: 20px;
  font-size: 16px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #333333;
  border-bottom: 1px solid #ddd;
}
/deep/ .ivu-modal-body {
  padding: 0;
}
/deep/ .ivu-tabs-bar {
  margin: 10px 20px;
}
/deep/ .ivu-table-header thead tr th {
  background: #fafafc;
}
/deep/ .ivu-modal-footer {
  padding: 12px 18px 26px 18px;
}
</style>
