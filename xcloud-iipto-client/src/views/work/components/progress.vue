<template xlang="wxml">
  <div>
    <div class="table-content">
      <div class="order-heaer">
        <h3>进度查询</h3>
        <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-row :gutter="24">
            <a-col :span="4">
              <a-select
                v-model="speedForm.countryCode"
                allowClear
                show-search
                option-filter-prop="children"
                placeholder="所有国家"
              >
                <template #dropdownRender v-if="countryList.length == 0">
                  <div class="select-data">暂无数据</div>
                </template>
                <a-select-option :value="item.countryCode" :key="index" v-for="(item, index) in countryList">
                  {{ item.countryNameZh }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="4">
              <a-select
                v-model="speedForm.nodeServiceProgressName"
                allowClear
                show-search
                option-filter-prop="children"
                placeholder="所有进度"
                @change="handleChange"
              >
                <a-select-option value="">
                  全部
                </a-select-option>
                <a-select-option :value="v.nodeServiceProgressName" v-for="(v, i) in progressBarList" :key="i">
                  {{ v.nodeServiceProgressName }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="8">
              <a-input
                placeholder="请输入商标名称 / 服务号 / 订单号 关键字"
                v-model="speedForm.searchContent"
                clearable
              />
            </a-col>
            <a-col :span="6">
              <a-button type="primary" icon="search" @click="searchBtn"> 搜索 </a-button>
              <a-button icon="redo" style="margin-left:10px" @click="handleReset"> 重置 </a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-box">
        <a-table
          :columns="columns2"
          :data-source="speedList"
          :loading="tableSpeedLoading"
          :pagination="pagination"
          @change="handleTableChange"
          :rowKey="
            (record, index) => {
              return index;
            }
          "
          :locale="{ emptyText: '暂无数据' }"
        >
          <template slot="serviceProgressStr" slot-scope="text, record">
            <span style="color: #ED7B2F" v-if="record.serviceProgressStr == '待提交资料'">{{
              record.serviceProgressStr
            }}</span>
            <span style="color: #EF3325" v-else-if="record.serviceProgressStr == '资料被驳回'">{{
              record.serviceProgressStr
            }}</span>
            <span v-else>{{ record.serviceProgressStr }}</span>
          </template>
          <template slot="operate" slot-scope="text, record">
            <div class="operate">
              <div>
                <span @click="viewProgress(record)" style="color: #00A3FF">
                  查看进度
                </span>
              </div>
            </div>
          </template>
        </a-table>
      </div>
    </div>
    <a-modal
      v-model="progressModal"
      title="查看服务进度"
      cancelText="取消"
      okText="我知道了"
      :width="608"
      @ok="() => (progressModal = false)"
    >
      <div class="service-progress">
        <div class="service-box">
          <a-row>
            <a-col class="gutter-row" :span="12">
              <div class="gutter-box">
                {{ '服务商品： ' + serviceName }}
              </div>
            </a-col>
            <a-col class="gutter-row" :span="12">
              <div class="gutter-box">
                {{ '国家： ' + countryNameZh }}
              </div>
            </a-col>
            <a-col class="gutter-row" :span="12">
              <div class="gutter-box">
                {{ '服务号： ' + serviceNo }}
              </div>
            </a-col>
            <a-col class="gutter-row" :span="12">
              <div class="gutter-box">
                {{ '订单号： ' + orderNo }}
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="progress-box">
          <div
            :class="{
              item: true,
              'item-unprogress': item.trademarkServiceScheduleTimeList.length == 0,
              'item-bottom': item.trademarkServiceScheduleTimeList.length == 0,
            }"
            v-for="(item, index) in progressArry"
            :key="index"
          >
            <div class="item-name clearfix">
              <img
                src="@/assets/images/common/progress.svg"
                alt
                v-if="item.trademarkServiceScheduleTimeList.length > 0"
              />
              <img src="@/assets/images/common/unprogress.svg" alt v-else />
              <span>{{ item.nodeName }}</span>
            </div>
            <div class="item-time clearfix" v-for="(value, k) in item.trademarkServiceScheduleTimeList" :key="k">
              <span></span>
              <div class="time">{{ value.time }}</div>
              <div class="text">{{ value.businessName }}</div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { viewProgress, viewProgressList, getCacheCountryListApi } from '@/api/work/index';
export default {
  data: () => ({
    countryList: [],
    progressBarList: [
      { nodeCodeList: ['NODE0033'], nodeServiceProgressName: '待提交资料', progressBar: 1 },
      { nodeCodeList: ['NODE0033', 'NODE0034', 'NODE0035'], nodeServiceProgressName: '资料被驳回', progressBar: 2 },
      { nodeCodeList: ['NODE0034', 'NODE0035'], nodeServiceProgressName: '资料审核中', progressBar: 1 },
      { nodeCodeList: ['NODE0036', 'NODE0037'], nodeServiceProgressName: '审查期', progressBar: 0 },
      { nodeCodeList: ['NODE0038'], nodeServiceProgressName: '下发证书', progressBar: 0 },
    ],
    progressArry: [],
    speedForm: {
      limit: 10,
      page: 1,
    },
    ordersTime: '',
    submitDataTime: '',
    approvedLawyerTime: '',
    censorshipTime: '',
    deliveringCertificateTime: '',
    serviceName: '',
    countryNameZh: '',
    serviceNo: '',
    orderNo: '',
    progressList: [],
    speedTotal: 0,
    tableSpeedLoading: false,
    speedList: [],
    pagination: {
      pageSize: 10,
    },
    columns2: [
      {
        title: '服务名称',
        dataIndex: 'serviceName',
        key: 'serviceName',
        ellipsis: true,
        align: 'center',
        width: 200,
      },
      {
        title: '国家',
        dataIndex: 'countryNameZh',
        key: 'countryNameZh',
        ellipsis: true,
        align: 'center',
        width: 90,
      },
      {
        title: '服务号',
        dataIndex: 'serviceNo',
        key: 'serviceNo',
        ellipsis: true,
        align: 'center',
        width: 220,
      },
      {
        title: '当前服务进度',
        dataIndex: 'serviceProgressStr',
        scopedSlots: { customRender: 'serviceProgressStr' },
        align: 'center',
        key: 'serviceProgressStr',
      },
      {
        title: '操作',
        key: 'operate',
        scopedSlots: { customRender: 'operate' },
        align: 'center',
        width: 120,
      },
    ],
    progressModal: false,
    progressModalData: {},
    progressInfo: [],
    buttonType: 3,
  }),
  mounted() {
    this.getBaseInfoFunc();
    this.getWorkTodoProgressList();
  },
  methods: {
    speedPageSizeChangeHandler(pageSize) {
      this.speedForm.limit = pageSize;
      this.getWorkTodoProgressList();
    },
    speedChangePageHandler(page) {
      this.speedForm.page = page;
      this.getWorkTodoProgressList();
    },
    //获取基础数据
    getBaseInfoFunc() {
      getCacheCountryListApi().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });
    },
    //获取待办进度列表
    getWorkTodoProgressList() {
      this.tableSpeedLoading = true;
      let json = JSON.parse(JSON.stringify(this.speedForm));
      let data = this.getParmes(json);
      delete data['nodeServiceProgressName'];
      viewProgressList(data).then((res) => {
        if (res.code === 0) {
          this.speedList = res.data.records;
          this.speedTotal = Number(res.data.total);
          this.tableSpeedLoading = false;
          const pagination = { ...this.pagination };
          pagination.total = Number(res.data.total);
          this.pagination = pagination;
        }
      });
    },
    handleChange(val) {
      this.speedForm.nodeCodeList = '';
      this.speedForm.progressBar = '';
      if (val == '') return false;
      this.progressBarList.map((item) => {
        if (item.nodeServiceProgressName == val) {
          this.speedForm.nodeCodeList = item.nodeCodeList;
          if (item.progressBar) {
            this.speedForm.progressBar = item.progressBar;
          } else {
            this.speedForm.progressBar = '';
          }
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.speedForm.page = pagination.current;
      this.getWorkTodoProgressList();
    },
    getParmes(json) {
      for (name in json) {
        if (json[name] == '' || json[name] == undefined || json[name] == []) {
          delete json[name];
        }
      }
      return json;
    },
    searchBtn() {
      this.speedForm.page = 1;
      this.pagination.current = 1;
      this.getWorkTodoProgressList();
    },
    handleReset() {
      this.speedForm = {
        limit: 10,
        page: 1,
        total: 0,
        searchContent: '',
        progressBar: '',
        nodeCodeList: '',
      };
      this.getWorkTodoProgressList();
    },
    // 查看进度
    viewProgress(row) {
      this.progressModalData = row;
      viewProgress({ serviceNo: row.serviceNo }).then((res) => {
        if (res.code === 0) {
          this.progressModal = true;
          this.ordersTime = res.data.ordersTime;
          this.submitDataTime = res.data.submitDataTime;
          this.approvedLawyerTime = res.data.approvedLawyerTime;
          this.censorshipTime = res.data.censorshipTime;
          this.deliveringCertificateTime = res.data.deliveringCertificateTime;
          this.serviceName = res.data.serviceName;
          this.countryNameZh = res.data.countryNameZh;
          this.serviceNo = res.data.serviceNo;
          this.orderNo = res.data.orderNo;
          this.progressArry = res.data.trademarkServiceScheduleList;
        }
      });
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
    padding-top: 16px;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  h3 {
    font-size: 16px;
    font-weight: 400;
    line-height: 50px;
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
      // color: #16ade9;
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
  /deep/.ant-table-thead > tr > th {
    background: #d5f0ff;
  }
}
.service-progress {
  margin: 0 26px;
  .service-box {
    height: 86px;
    background: #f4f7fd;
    padding: 15px 20px;
    .service-header {
      margin-bottom: 16px;
      .service-name {
        float: left;
        font-size: 14px;
        font-weight: 600;
        color: #000000;
        line-height: 22px;
        margin-top: 2px;
      }
      .service {
        float: right;
      }
    }
    .gutter-box {
      font-size: 12px;
      color: #666666;
      line-height: 20px;
      margin-bottom: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .progress-box {
    margin-top: 35px;
    padding: 0 10px;
    .item {
      border-left: 2px solid #00a3ff;
      .item-name {
        padding-bottom: 20px;
        img {
          float: left;
          margin-left: -11px;
          margin-top: -1px;
        }
        span {
          float: left;
          margin-left: 35px;
          font-size: 14px;
          font-weight: 600;
          color: #333333;
          line-height: 18px;
        }
      }
      .item-time {
        padding-bottom: 14px;
        span {
          float: left;
          margin-left: -6px;
          margin-top: 5px;
          width: 10px;
          height: 10px;
          background: #00a3ff;
          border-radius: 5px;
        }
        div {
          float: left;
          font-size: 12px;
          color: #666666;
          line-height: 20px;
        }
        .time {
          margin-left: 40px;
        }
        .text {
          margin-left: 20px;
        }
      }
    }
    .item:last-of-type {
      .item-time:last-of-type {
        padding-bottom: 0;
        span {
          margin-top: 10px;
        }
      }
    }
    .item-unprogress {
      border-left: 2px solid #e1e1e1;
    }
    .item-bottom:last-of-type {
      .item-name {
        padding-bottom: 0;
      }
    }
  }
}
.select-data {
  text-align: center;
  line-height: 50px;
}
/deep/.ant-modal-content {
  .ant-modal-footer {
    border-top: none;
    padding-bottom: 32px;
  }
}
</style>
