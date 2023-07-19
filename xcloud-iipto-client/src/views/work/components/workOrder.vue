/* rwer.vue */
<template xlang="wxml">
  <div :class="{ 'table-content': true, 'table-content-active': this.open }">
    <div class="clearfix order-heaer">
      <span class="fl">待办工单</span>
      <div class="fl tab">
        <a-tabs v-model="activeName" @change="handClick">
          <a-tab-pane
            v-for="item in tabList"
            :key="item.value"
            :tab="item.label + '(' + numArry[item.key] + ')'"
          ></a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="table-box">
      <a-table
        :columns="columns1"
        :data-source="workList"
        :loading="tableLoading"
        :pagination="pagination"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        @change="handleTableChange"
        :locale="{ emptyText: '暂无数据' }"
      >
        <template slot="operate" slot-scope="text, record">
          <div class="operate">
            <div>
              <span
                v-if="record.cureentNodeCode === 'NODE0035' && [4, 6].includes(record.progressBar)"
                @click.stop="uploadAuthorization(true, record)"
                class="btF upload-btn"
              >
                <!--平台审核-签署授权书和驳回: cureentNodeCode === 'NODE0035' && [4,6].includes(record.progressBar) -->
                上传授权书
              </span>
              <span v-else @click.stop="toJump(record)" class="btF upload-btn">
                {{ record.serviceProgressStr }}
              </span>
            </div>
          </div>
        </template>
      </a-table>
    </div>
    <UploadAuthorizationLetter
      :currRow="currRow"
      @uploadAuthorization="uploadAuthorization"
      @getList="getWorkTodoList"
      @getViewWorkNum="getViewWorkNum"
      v-if="uploadAuthorizationLetterVisiale"
    />
  </div>
</template>
<script>
import { viewBacklogList, viewWorkNum } from '@/api/work/index';
export default {
  props: ['open'],
  data: () => ({
    activeName: '1',
    tabList: [
      { label: '全部', value: '1', key: 'allNum' },
      { label: '待提交资料', value: '2', key: 'dataSubmittedNum' },
      { label: '待答复审查意见', value: '3', key: 'reviewNum' },
      { label: '待提交使用证据', value: '5', key: 'submitEvidenceNum' },
      { label: '待签署授权书', value: '4', key: 'uploadAuthNum' },
    ],
    numArry: {},
    workForm: {
      size: 10,
      current: 1,
      type: '1',
    },
    workTotal: 0,
    tableLoading: false,
    pagination: {},
    workList: [],
    columns1: [
      {
        title: '事项',
        dataIndex: 'matter',
        key: 'matter',
        ellipsis: true,
        align: 'center',
      },
      {
        title: '服务商品',
        dataIndex: 'serviceName',
        key: 'serviceName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '国家',
        dataIndex: 'countryNameZh',
        key: 'countryNameZh',
        align: 'center',
        ellipsis: true,
      },

      {
        title: '服务号',
        dataIndex: 'serviceNo',
        key: 'serviceNo',
        ellipsis: true,
        align: 'center',
        width: 200,
      },
      {
        title: '操作',
        key: 'operate',
        scopedSlots: { customRender: 'operate' },
        align: 'center',
        width: 250,
      },
    ],
    uploadAuthorizationLetterVisiale: false,
    currRow: '',
  }),
  watch: {
    open() {
      if (this.open) {
        this.setOpen();
      }
    },
  },
  mounted() {
    this.getWorkTodoList();
    this.getViewWorkNum();
  },
  methods: {
    setOpen() {
      this.timer = setTimeout(() => {
        this.$emit('close');
      }, 3000);
    },
    pageSizeChangeHandler(pageSize) {
      this.workForm.size = pageSize;
      this.getWorkTodoList();
    },
    changePageHandler(page) {
      this.workForm.current = page;
      this.getWorkTodoList();
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.workForm.current = pagination.current;
      this.getWorkTodoList();
    },
    //获取待办工单的列表
    getWorkTodoList() {
      this.tableLoading = true;
      let data = this.getParmes(this.workForm);
      viewBacklogList(data).then((res) => {
        if (res.code === 0) {
          this.workList = res.data.records;
          this.workTotal = Number(res.data.total);
          this.tableLoading = false;
          const pagination = { ...this.pagination };
          pagination.total = Number(res.data.total);
          this.pagination = pagination;
        }
      });
    },
    getViewWorkNum() {
      viewWorkNum({}).then((res) => {
        if (res.code === 0) {
          this.numArry = { ...res.data };
        }
      });
    },
    getParmes(json) {
      for (name in json) {
        if (json[name] == '' || json[name] == undefined || json[name] == []) {
          delete json[name];
        }
      }
      return json;
    },
    handClick() {
      this.workForm.type = this.activeName;
      this.workForm.current = 1;
      this.pagination.current = 1;
      this.getWorkTodoList();
    },
    toJump(row) {
      let code = row.cureentNodeCode;
      let subJson = {
        id: row.servicesId,
        progressBar: row.progressBar,
        nodeCode: row.cureentNodeCode,
        code: row.countryCode,
        form: 'work',
      };
      if (code == 'NODE0033') {
        this.$router.push({
          path: '/infoDetail',
          query: subJson,
        });
      } else if (code == 'NODE0037' || code == 'NODE0036') {
        this.$router.push({
          path: '/myBrand',
          query: { isShowDetail: 2, servicesId: row.servicesId, cureentNodeCode: row.cureentNodeCode, form: 'work' },
        });
      } else if (['NODE0139', 'NODE0140'].includes(code)) {
        this.$router.push({
          path: '/fillEvidence',
          query: {
            id: row.servicesId,
            progressBar: row.progressBar,
            nodeCode: row.cureentNodeCode,
            code: row.countryCode,
            countryNameZh: row.countryNameZh,
            from: 'work',
          },
        });
      }
    },
    //显示上传授权书弹窗
    uploadAuthorization(flag, row) {
      console.log(row);
      this.currRow = row;
      this.uploadAuthorizationLetterVisiale = flag;
    },
  },
};
</script>

<style lang="less" scoped>
.table-content {
  background: #ffffff;
  margin-top: 24px;
  .order-heaer {
    margin: 0 24px;
    border-bottom: 1px #e9e9e9 solid;
    padding-top: 26px;
    margin-bottom: 20px;
    span {
      font-size: 16px;
      font-weight: 500;
      line-height: 34px;
      margin-right: 20px;
    }
  }
  .table-box {
    padding: 0 24px;
  }
  .pageSetion {
    text-align: left;
    margin-top: 36px;
    padding-bottom: 36px;
    margin-left: 24px;
  }
  .operate {
    cursor: pointer;
    text-align: center;
    font-weight: 500;
    padding-top: 2px;
    img {
      width: 11px;
      margin-bottom: 2px;
    }
    .btF {
      min-width: 124px;
    }
    .btF.flex-center {
      // display: inline-block;
      min-width: 124px;
      // background: #ffffff;
      color: #f79728;
      border-color: #f79728;
      img {
        width: 18px;
        // height: 18px;
      }
    }
    .red-button {
      color: #ed3e3e;
      border-color: #ed3e3e;
    }
    .upload-btn {
      // margin-right: 10px;
      // border-color: #16ade9;
      color: #00a3ff;
      // background-color: #fff;
      img {
        width: 18px;
        // height: 18px;
      }
    }
    .btR {
      min-width: 124px;
      background: #ed3e3e;
    }
  }
  // /deep/.ant-table-content {
  //   height: 563px !important;
  // }
  /deep/.ant-tabs-bar {
    border-bottom: none;
  }
  /deep/.ant-tabs-ink-bar {
    opacity: 0;
  }
  /deep/.ant-tabs-tab {
    background: #f1f1f1;
    border-radius: 16px;
    padding: 6px 16px;
  }
  /deep/.ant-tabs-tab:hover {
    color: #fff;
    background: #00a3ff;
    border-radius: 16px;
    padding: 6px 16px;
  }
  /deep/.ant-tabs-tab-active {
    color: #fff;
    background: #00a3ff;
    border-radius: 16px;
    padding: 6px 16px;
  }
  /deep/.ant-table-thead > tr > th {
    background: #d5f0ff;
  }
}
.table-content-active {
  box-shadow: 0px 8px 8px 0px rgba(0, 0, 0, 0.05), 0px -8px 8px 0px rgba(0, 0, 0, 0.05),
    -8px 0px 8px 0px rgba(0, 0, 0, 0.05), 8px 0px 8px 0px rgba(0, 0, 0, 0.05);
}
</style>
