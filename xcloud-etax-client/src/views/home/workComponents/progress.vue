<template xlang="wxml">
  <div>
    <div class="table-content">
      <h3>进度查询</h3>
      <div class="table-box">
        <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="公司名称">
                <a-input placeholder="公司名称" v-model="speedForm.companyName" clearable />
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item label="报税国家">
                <a-select v-model="speedForm.countryCode" allowClear show-search option-filter-prop="children">
                  <a-select-option :value="v.countryCode" v-for="(v, i) in countryList" :key="i">
                    {{ v.countryNameZh }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="服务名称">
                <a-select v-model="speedForm.functionCodes" mode="multiple" allowClear>
                  <a-select-option :value="v.code" v-for="(v, i) in serviceList" :key="i">
                    {{ v.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="5" style="padding-top: 4px">
              <a-button type="primary" icon="search" @click="searchBtn"> 搜索 </a-button>
              <a-button icon="redo" style="margin-left: 10px" @click="handleReset"> 重置 </a-button>
            </a-col>
          </a-row>
        </a-form>
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
          <template slot="operate" slot-scope="text, record">
            <div class="operate">
              <div>
                <!-- <span
                  v-if="
                    record.productFunctionCode == 5 ||
                      record.productFunctionCode == 2 ||
                      record.productFunctionCode == 23
                  "
                  @click="viewProgress(record)"
                  style="color: #515b6e"
                >
                  <a-icon type="profile" />
                  查看进度
                </span> -->
                <span @click.stop="toSubAgent(record)" style="color: #3a7fff"> 查看进度 </span>
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
          <div class="service-header clearfix">
            <div class="service-name">{{ progressModalData.serviceName }}</div>
            <a-button type="primary" class="service" @click.stop="subAgentButton(progressModalData, buttonType)">
              {{ buttonText[buttonType] }}
            </a-button>
          </div>
          <a-row>
            <a-col class="gutter-row" :span="12">
              <div class="gutter-box">
                {{ '服务类型： ' + progressModalData.serviceName }}
              </div>
            </a-col>
            <a-col class="gutter-row" :span="12">
              <div class="gutter-box">
                {{ '服务号： ' + progressModalData.serviceNo }}
              </div>
            </a-col>
            <a-col class="gutter-row" :span="12">
              <div class="gutter-box">
                {{ '公司名称： ' + progressModalData.companyNameZh }}
              </div>
            </a-col>
            <a-col class="gutter-row" :span="12">
              <div class="gutter-box">
                {{ '订单号： ' + progressModalData.id }}
              </div>
            </a-col>
          </a-row>
        </div>
        <div class="progress-box">
          <div
            :class="{ item: true, 'item-unprogress': item.status == 2, 'item-bottom': item.timeList.length == 0 }"
            v-for="(item, index) in progressArry"
            :key="index"
          >
            <div class="item-name clearfix">
              <img src="@/assets/images/survey/progress.png" alt v-if="item.status == 1" />
              <img src="@/assets/images/survey/unprogress.png" alt v-else />
              <span>{{ item.progressName }}</span>
            </div>
            <div class="item-time clearfix" v-for="(value, k) in item.timeList" :key="k">
              <span></span>
              <div class="time">{{ value.businessOperateTime }}</div>
              <div class="text">{{ value.businessOperateName }}</div>
              <div class="text">{{ value.businessNodeName }}</div>
              <div class="text">{{ value.businessOperateReason }}</div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { workTodoProgressList, viewSeviceProgress } from '@/api/home/home';
import { baseInfo } from '@/api/shoppingCar/shoppingCar';
import { progressData, currentCodeEnum } from './staticList';
export default {
  data: () => ({
    countryList: [],
    speedForm: {
      size: 10,
      current: 1,
      companyName: '',
      countryCode: '',
      functionCodes: [],
    },
    speedTotal: 0,
    tableSpeedLoading: false,
    speedList: [],
    pagination: {},
    columns2: [
      {
        title: '公司名称',
        dataIndex: 'companyNameZh',
        key: 'companyNameZh',
        ellipsis: true,
      },
      {
        title: '国家',
        dataIndex: 'countryNameZh',
        key: 'countryNameZh',
        ellipsis: true,
        width: 90,
      },
      {
        title: '服务名称',
        dataIndex: 'serviceName',
        key: 'serviceName',
        ellipsis: true,
        width: 200,
      },
      {
        title: '服务号',
        dataIndex: 'serviceNo',
        key: 'serviceNo',
        ellipsis: true,
        width: 220,
      },
      {
        title: '当前服务进度',
        dataIndex: 'serviceProgressName',
        key: 'serviceProgressName',
      },
      {
        title: '操作',
        key: 'operate',
        scopedSlots: { customRender: 'operate' },
        align: 'center',
        width: 120,
      },
    ],
    serviceList: [
      {
        code: 5,
        name: '注册+申报',
      },
      {
        code: 2,
        name: '转代理+申报',
      },
      {
        code: 23,
        name: 'IOSS注册+申报',
      },
      {
        code: 6,
        name: '税号注销',
      },
      {
        code: 7,
        name: '税务稽查',
      },
      {
        code: 24,
        name: 'VAT退税',
      },
      {
        code: 31,
        name: 'EPR注册',
      },
      {
        code: 32,
        name: 'EPR转代理',
      },
      {
        code: 106,
        name: '德国WEEE加类加品牌',
      },
      {
        code: 16,
        name: '授权代表',
      },
      {
        code: 13,
        name: '海牙认证',
      },
      {
        code: 20,
        name: '其他服务（极简工单）',
      },
    ],
    progressModal: false,
    progressModalData: {},
    progressArry: [
      {
        progressName: '服务待开始',
        status: 2,
        timeList: [],
      },
      {
        progressName: '提交资料',
        status: 2,
        timeList: [],
      },
      {
        progressName: '授权',
        status: 2,
        timeList: [],
      },
      {
        progressName: '服务受理中',
        status: 2,
        timeList: [],
      },
      {
        progressName: '服务完成',
        status: 2,
        timeList: [],
      },
    ],
    progressInfo: [],
    buttonType: 3,
    buttonText: {
      1: '待提交资料',
      2: '待授权',
      3: '查看详情',
    },
  }),
  mounted() {
    this.getCountry();
    this.getWorkTodoProgressList();
  },
  methods: {
    speedPageSizeChangeHandler(pageSize) {
      this.speedForm.size = pageSize;
      this.getWorkTodoProgressList();
    },
    speedChangePageHandler(page) {
      this.speedForm.current = page;
      this.getWorkTodoProgressList();
    },
    //获取国家
    getCountry() {
      baseInfo().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
    //获取待办进度列表
    getWorkTodoProgressList() {
      this.tableSpeedLoading = true;
      let data = this.getParmes(this.speedForm);
      workTodoProgressList(data).then((res) => {
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
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.speedForm.current = pagination.current;
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
      this.speedForm.current = 1;
      this.pagination.current = 1;
      this.getWorkTodoProgressList();
    },
    handleReset() {
      this.speedForm = {
        limit: 10,
        page: 1,
        total: 0,
        countryCode: '',
        functionCodes: [],
        tabNodeCode: '',
      };
      this.getWorkTodoProgressList();
    },
    // 查看进度
    viewProgress(row) {
      this.progressModalData = row;
      viewSeviceProgress({ businessNo: row.serviceNo, businessType: 2 }).then((res) => {
        if (res.code === 0) {
          this.progressModal = true;
          let data = res.data;
          data.reverse();
          let text = [
            ['下单成功', '待处理'],
            [
              '待提交资料',
              '待审核',
              '待审核资料',
              '待审核申报',
              '已审核',
              '待处理',
              '待提交资料（驳回）',
              '待上传资料',
            ],
            ['待授权'],
            ['注册中', '转代理中', '海牙认证中', '注销中', '退税中', '处理中', '申报对接完成'],
            ['注册完成', '转代理完成', '退税完成', '稽查完成', '注销完成', '认证完成', '处理完成', '已处理'],
          ];

          let length = data.length;
          this.progressArry[0].timeList = [];
          this.progressArry[1].timeList = [];
          this.progressArry[2].timeList = [];
          this.progressArry[3].timeList = [];
          this.progressArry[4].timeList = [];
          if (data[0].businessOperateName == '下单成功') {
            this.progressArry[0].timeList.push(data[0]);
            this.progressArry[0].status = 1;
          }
          if (data.length > 1) {
            let secondIndex = 1;
            let thirdIndex = 0;
            let fourIndex = 0;
            let fiveIndex = 0;
            let arry = [...data];
            data.forEach((value, index) => {
              if (text[2].indexOf(value.businessNodeName) > -1) {
                thirdIndex = index;
              }
              if (text[3].indexOf(value.businessNodeName) > -1) {
                fourIndex = index;
              }
              if (text[4].indexOf(value.businessNodeName) > -1) {
                fiveIndex = index;
              }
            });

            if (thirdIndex == 0 && fourIndex == 0 && fiveIndex == 0) {
              this.buttonType = 1;
              this.progressArry[1].status = 1;
              this.progressArry[2].status = 2;
              this.progressArry[3].status = 2;
              this.progressArry[4].status = 2;
              let progressArry1 = arry.slice(1, data.length);
              this.progressArry[1].timeList = progressArry1;
            }
            if (thirdIndex > 0 && fourIndex == 0 && fiveIndex == 0) {
              this.buttonType = 2;
              this.progressArry[1].status = 1;
              this.progressArry[2].status = 1;
              this.progressArry[3].status = 2;
              this.progressArry[4].status = 2;
              let progressArry1 = arry.slice(1, thirdIndex);
              let progressArry2 = arry.slice(thirdIndex, data.length);
              this.progressArry[1].timeList = progressArry1;
              this.progressArry[2].timeList = progressArry2;
            }
            if (thirdIndex > 0 && fourIndex > 0 && fiveIndex == 0) {
              this.buttonType = 3;
              this.progressArry[1].status = 1;
              this.progressArry[2].status = 1;
              this.progressArry[3].status = 1;
              this.progressArry[4].status = 2;
              let progressArry1 = arry.slice(1, thirdIndex);
              let progressArry2 = arry.slice(thirdIndex, fourIndex);
              let progressArry3 = arry.slice(fourIndex, data.length);
              this.progressArry[1].timeList = progressArry1;
              this.progressArry[2].timeList = progressArry2;
              this.progressArry[3].timeList = progressArry3;
            }
            if (thirdIndex > 0 && fourIndex > 0 && fiveIndex > 0) {
              this.buttonType = 3;
              this.progressArry[1].status = 1;
              this.progressArry[2].status = 1;
              this.progressArry[3].status = 1;
              this.progressArry[4].status = 1;
              let progressArry1 = arry.slice(1, thirdIndex);
              let progressArry2 = arry.slice(thirdIndex, fourIndex);
              let progressArry3 = arry.slice(fourIndex, fiveIndex);
              let progressArry4 = arry.slice(fiveIndex, data.length);
              this.progressArry[1].timeList = progressArry1;
              this.progressArry[2].timeList = progressArry2;
              this.progressArry[3].timeList = progressArry3;
              this.progressArry[4].timeList = progressArry4;
            }
          }
        }
      });
    },
    subAgentButton(row, type) {
      let functionCode = Number(row.productFunctionCode);
      let subJson = {
        serviceId: row.id,
        serviceNo: row.serviceNo,
        countryCode: row.countryCode,
        countryNameZh: row.countryNameZh,
        cureentNodeCode: row.cureentNodeCode,
      };
      console.log(row.productFunctionCode, 8989, type);
      if (type == 1) {
        switch (functionCode) {
          case 2:
            this.$router.push({
              path: '/turnToAgent',
              query: subJson,
            });
            break;
          case 5:
            this.$router.push({
              path: '/registerInfo',
              query: subJson,
            });
          case 23:
            this.$router.push({
              path: '/registerInfo',
              query: subJson,
            });
            break;
        }
      } else if (type == 2) {
        this.$router.push({
          path: '/turnToAgent',
          query: {
            serviceId: row.id,
            serviceNo: row.serviceNo,
            countryCode: row.countryCode,
            countryNameZh: row.countryNameZh,
            cureentNodeCode: row.cureentNodeCode,
          },
        });
      } else {
        this.toSubAgent(row);
      }
    },
    // 查看详情
    // 待提交资料
    compareDate(d1) {
      return new Date(d1.replace(/-/g, '\/')) > new Date('2023/07/06 22:30:00');
    },
    toSubAgent(row) {
      let functionCode = Number(row.productFunctionCode);
      let subJson = {
        id: row.workId,
        serviceId: row.id,
        serviceNo: row.serviceNo,
        countryCode: row.countryCode,
        countryNameZh: row.countryNameZh,
        cureentNodeCode: row.cureentNodeCode,
      };
      let detailsJosn = {
        status: row.cureentNodeCode,
        countryNameZh: row.countryNameZh,
        serviceId: row.id,
        serviceName: row.serviceName,
        serviceNo: row.serviceNo,
      };
      //OCR版本提交资料参数
      let newSubJson = {
        id: row.workId,
        serviceNo: row.serviceNo,
      };
      switch (functionCode) {
        case 2:
          if (row.countryCode === 'DE' && this.compareDate(row.flowCreateTime)) {
            this.$router.push({
              path: '/registrationInformation',
              query: newSubJson,
            });
          } else {
            this.$router.push({
              path: '/turnToAgent',
              query: subJson,
            });
          }
          break;
        case 5:
          if (row.countryCode === 'DE' && this.compareDate(row.flowCreateTime)) {
            //已完成'NODE8'
            if (row.cureentNodeCode === 'NODE8') {
              this.$router.push({
                path: '/registerInfo/vatNumberInfo',
                query: {
                  id: row.workId,
                },
              });
            } else {
              this.$router.push({
                path: '/registrationInformation',
                query: newSubJson,
              });
            }
          } else {
            this.$router.push({
              path: '/registerInfo',
              query: subJson,
            });
          }
          break;
        case 23:
          this.$router.push({
            path: '/registerInfo',
            query: subJson,
          });
          break;
        case 7:
          this.$router.push({
            path: '/taxInspection',
            query: subJson,
          });
          break;
        case 6:
          this.$router.push({
            path: '/cancelTaxNum',
            query: { ...subJson, status: row.progressBar },
          });
          break;
        case 13:
          this.$router.push({
            path: '/hagueInformation',
            query: {
              id: row.workId,
              status: row.progressBar,
              serviceId: row.id,
              serviceNo: row.serviceNo,
              productFunctionCode: row.productFunctionCode,
              supplierId: row.supplierId,
            },
          });
          break;
        case 24:
          this.$router.push({
            path: '/taxRefund',
            query: {
              id: row.workId,
              serviceId: row.id,
              countryCode: row.countryCode,
              cureentNodeCode: row.cureentNodeCode,
              progressBar: row.progressBar,
            },
          });
          break;
        case 31:
        case 3101:
        case 3102:
        case 3103:
        case 3104:
        case 3105:
        case 3106:
        case 3107:
        case 3108:
          this.$router.push({
            path: '/complianceBusiness/manageDetails',
            query: detailsJosn,
          });
          break;
        case 32:
          this.$router.push({
            path: '/complianceBusiness/EPRDetails',
            query: detailsJosn,
          });
          break;
        case 106:
          this.$router.push({
            path: '/complianceBusiness/addCategoryBrandDetails',
            query: detailsJosn,
          });
          break;
        case 107:
          this.$router.push({
            path: '/complianceBusiness/addCategoryBrandDetails',
            query: detailsJosn,
          });
          break;
        case 16:
          if (row.currentNodeCode == 'NODE0066') {
            this.$router.push({
              path: '/complianceBusiness/filingDetails',
              query: {
                status: row.currentNodeCode,
                countryNameZh: row.country,
                serviceId: row.id,
              },
            });
          } else {
            this.$router.push({
              path: '/complianceBusiness/manageDetails',
              query: detailsJosn,
            });
          }
          break;
        case 20:
          this.$router.push({
            path: '/otherServicesDetail',
            query: { id: row.id, progressBar: row.progressBar },
          });
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.table-content {
  background: #ffffff;
  margin-top: 24px;
  h3 {
    font-size: 16px;
    font-weight: 400;
    line-height: 50px;
    border-bottom: 1px #e9e9e9 solid;
    padding-left: 32px;
  }
  .table-box {
    padding: 0 32px;
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
}
.service-progress {
  margin: 0 26px;
  .service-box {
    height: 133px;
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
        }
        span {
          float: left;
          margin-left: 35px;
          font-size: 14px;
          font-weight: 600;
          color: #333333;
          line-height: 22px;
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
</style>
