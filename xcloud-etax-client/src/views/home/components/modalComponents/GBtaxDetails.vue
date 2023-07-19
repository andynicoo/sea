<template>
  <div class="taxBox">
    <Modal
      v-model="detailModel"
      title="报税详情/Details"
      footer-hide
      :mask-closable="false"
      width="660px"
      @on-visible-change="changeState"
    >
      <p class="baseInfo1">基本信息/Basic information</p>
      <Table :data="baseData" :columns="baseColumns" border></Table>
      <p class="baseInfo">报税记录/Declaration record</p>
      <Table :data="logData" :columns="logColumns" border>
        <template slot="operation" slot-scope="{ row }">
          <div v-if="row.status == 'F'" @click="checkLook(row)" class="check">查看</div>
        </template>
      </Table>
      <div class="footer">
        <Button type="primary" @click="changeState(false)">知道了/Back</Button>
      </div>
    </Modal>
    <SubmitDeclareGb
      v-if="showBox"
      :comfirmMessage="confirmDeclareGBBox"
      :currencySign="currencySign"
      @changeState="declareGBState"
      :taxRate="sureTaxRate"
      :declareLog="logData"
      :detailInfo="detailInfo"
    ></SubmitDeclareGb>
  </div>
</template>
<script>
import { taxLogDetail, taxInfo } from '@/api/taxModule';
import SubmitDeclareGb from '@/components/AuthorizationModal/SubmitDeclareGb';
import { searchTaxLog, searchTaxLogDetail } from '@/api/taxBureauService/taxBureauService';
export default {
  props: {
    workNumber: '',
    serviceId: '',
    vatTaxNumber: '',
  },
  components: {
    SubmitDeclareGb,
  },
  data() {
    return {
      detailModel: true,
      showBox: false,
      baseData: [],
      baseColumns: [
        {
          renderHeader: (h, params) => {
            let arr = ['Company name', '公司名称'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          width: '',
          key: 'companyName',
        },
        {
          renderHeader: (h, params) => {
            let arr = ['Country to declare tax', '报税国家'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          width: '',
          key: 'countryNameZh',
        },
        {
          // title:'申报周期',
          renderHeader: (h, params) => {
            let arr = ['Declaration period', '申报周期'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          width: '',
          render(h, params) {
            let type = '';
            if (params.row.periodType == 0) {
              type = '月报';
            } else if (params.row.periodType == 1) {
              type = '季报';
            }
            return h('span', type);
          },
        },
        {
          renderHeader: (h, params) => {
            let arr = ['VAT number', 'VAT税号'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          // title:'VAT税号',
          width: '',
          key: 'vatTaxNumber',
        },
        {
          renderHeader: (h, params) => {
            let arr = ['VAT effective date', '税号生效日期'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          // title:'税号生效日期',
          width: '',
          key: 'taxEffectiveDate',
        },
        {
          renderHeader: (h, params) => {
            let arr = ['First declaration date', '首次报税日期'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          // title:'首次报税日期',
          width: '',
          key: 'firstDeclareTime',
        },
      ],
      detailInfo: {},
      logData: [],
      logColumns: [
        {
          renderHeader: (h, params) => {
            let arr = ['Serial number', '报税次数'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          // title:'报税次数',
          width: '80',
          render(h, params) {
            return h('span', params.row._index + 1);
          },
        },
        {
          renderHeader: (h, params) => {
            let arr = ['For the period', '申报区间'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          // title:'申报区间',
          render(h, params) {
            let beginTime = params.row.start.slice(0, 7),
              endTime = params.row.end.slice(0, 7);
            return h('span', beginTime + '至' + endTime);
          },
        },
        {
          // title:'状态',
          renderHeader: (h, params) => {
            let arr = ['Status', '状态'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          render(h, params) {
            let num = params.row.status,
              status = '';
            switch (num) {
              case 'O':
                status = '未申报';
                break;
              case 'F':
                status = '已申报';
                break;
            }
            return h('span', status);
          },
        },
        {
          // title:'税率',
          renderHeader: (h, params) => {
            let arr = ['Tax rate', '税率'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          width: '',
          render(h, params) {
            return h('span', params.row.taxRate + '%');
          },
        },
        {
          // title:'申报规则',
          renderHeader: (h, params) => {
            let arr = ['Tax calculation way', '申报规则'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          render(h, params) {
            let num = params.row.declareRule,
              status = '';
            switch (num) {
              case 0:
                status = '目的国';
                break;
              case 1:
                status = '发出国';
                break;
              case 1:
                status = '零申报';
                break;
            }
            return h('span', status);
          },
        },
        {
          renderHeader: (h, params) => {
            let arr = ['Tax payable', '缴纳税金'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          // title:'缴纳税金',
          width: '',
          key: 'netVatDue',
        },
        {
          renderHeader: (h, params) => {
            let arr = ['Operation', '操作'];
            return h(
              'div',
              arr.map((v) => {
                return h('div', v);
              })
            );
          },
          // title:'操作',
          width: '',
          slot: 'operation',
        },
      ],
      upload: false,
      fileUpload: this.ImgUrl,
      fileList: [],
      workId: '',
      confirmDeclareGBBox: {},
      currencySign: '',
      sureTaxRate: '',
    };
  },
  methods: {
    changeState(val) {
      let obj = {
        state: val,
        type: 'GB',
      };
      this.$emit('changeState', obj);
    },
    handleSuccess(res, file, fileList, row) {
      this.fileList = fileList;
    },
    handleBeforeUpload() {
      const check = this.fileList.length < 2;
      if (!check) {
        this.$Notice.warning({
          title: '最多上传两张图片',
        });
      }
      return check;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件类型错误',
        desc: '只支持jpg、jpeg、png',
      });
    },
    handleRemoveFile(file, fileList, row) {
      this.fileList = fileList;
    },
    getInfo() {
      searchTaxLog({ vatTaxNumber: this.vatTaxNumber }).then((res) => {
        if (res.code === 0) {
          this.logData = res.data;
        }
      });
      taxInfo({ id: this.serviceId }).then((res) => {
        if (res.code === 0) {
          this.baseData.push(res.data);
        }
      });
    },
    changeStates(obj) {
      // console.log(obj)
      this.upload = obj.state;
    },
    uploadFile(row) {
      this.upload = true;
      this.workId = row.id;
    },
    declareGBState(obj) {
      this.showBox = false;
    },
    checkLook(row) {
      this.detailInfo = row;
      this.detailInfo.companyName = this.baseData[0].companyName;
      let params = {
        periodKey: row.periodKey,
        vatTaxNumber: row.vatTaxNumber,
        serviceId: this.serviceId,
      };
      searchTaxLogDetail(params).then((res) => {
        if (res.code === 0) {
          this.confirmDeclareGBBox = res.data;
          this.showBox = true;
          // this.changeState(false)
        }
      });
    },
  },
  mounted() {
    this.getInfo();
  },
};
</script>
<style lang="less" scoped>
.taxBox {
  font-size: 12px;
}
.baseInfo {
  margin: 22px 0 12px 0;
}
.baseInfo1 {
  margin-bottom: 12px;
}
.upload {
  font-size: 12px;
  color: #019dfa;
  cursor: pointer;
}
.footer {
  text-align: center;
  padding: 26px 0;
}
.uploadFile {
  text-align: center;
  .uploadBtn {
    width: 350px;
  }
}
&/deep/ .ivu-modal-header-inner {
  color: #303033 !important;
}
&/deep/.ivu-table th {
  background-color: #f2f2f2;
  font-weight: 400;
  font-family: 'MicrosoftYaHei';
}
&/deep/ .ivu-table {
  font-size: 12px;
  color: #626266;
}
&/deep/ .ivu-modal {
  width: 750px;
}
.check {
  cursor: pointer;
  color: #019dfa;
}
</style>
