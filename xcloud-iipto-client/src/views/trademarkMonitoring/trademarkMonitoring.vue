<template>
  <div class="mainContent trademarkMonitoring">
    <dl class="trademarkMonitoring-header">
      <a-button type="primary" @click="goTrademark">
        新增商标
      </a-button>
      <dt class="trademarkMonitoring-header-title">
        <div><img src="@/assets/images/common/trademarkMonitoringIcon.png" /></div>
        <div class="my-trademarkMonitoring" :class="{ queryTypeCurr: queryType == 1 }" @click="queryTypeSearch(1)">
          我监测的商标<span>{{ monitTrademarkStatistics.monitTrademarkTotal }}</span>
        </div>
        <div
          class="my-trademarkMonitoring-update"
          :class="{ queryTypeCurr: queryType == 2 }"
          @click="queryTypeSearch(2)"
        >
          最近更新<span>{{ monitTrademarkStatistics.updateMonitTrademarkTotal }}</span>
        </div>
      </dt>
      <dd class="categoryList-box">
        <span
          :class="{ 'category-current': item.monitTrademarkCategoryNum == categoryNumber }"
          @click="categorySearch(item.monitTrademarkCategoryNum)"
          v-for="item in monitTrademarkStatistics.monitTrademarkCategoryStatisticsList"
          :key="item.monitTrademarkCategoryNum"
          >{{ item.monitTrademarkCategoryNum }} {{ item.monitTrademarkCategoryName
          }}<b>{{ item.monitTrademarkCategoryTotal }}</b></span
        >
      </dd>
    </dl>
    <div class="trademarkMonitoring-content">
      <span class="time-sort" :class="{ 'sort-current': this.updateDateType }" @click="timeSort('update')"
        >按更新时间排序
      </span>
      <span class="time-sort" :class="{ 'sort-current': this.monitDateType }" @click="timeSort('monit')"
        >按监测时间排序
      </span>
      <!-- <Form :model="formModal" :label-width="0" inline ref="formModal" style="width: 100%">
          <Row>
            <Col span="24">
              <FormItem>
                <Select v-model="formModal.queryCountryCodeList" clearable style="width: 100px" placeholder="所有国家">
                  <Option v-for="(li, index) of countryList" :key="index" :value="li.countryCode">
                    {{ li.countryName }}
                  </Option>
                </Select>
                <Select v-model="formModal.queryCategoryCodeList" clearable style="width: 130px" placeholder="所有类型">
                  <Option v-for="(li, index) of categoryList" :key="index" :value="li.categoryNum">
                    {{ li.categoryNum }} 类 （{{ li.categoryName }}）
                  </Option>
                </Select>
                <Input
                  v-model="formModal.queryTrademark"
                  placeholder=" 商标名称，支持6-10个英文字母"
                  style="width: 220px"
                ></Input>
                <a-button type="primary" style="margin-left: 10px" @click="search(1)" class="searchBtn">
                  查询
                </a-button>
                <a-button @click="search(1)" style="margin-left: 10px" class="resetBtn">重置</a-button>
              </FormItem>
            </Col>
          </Row>
        </Form> -->
      <a-spin :spinning="spinning">
        <ul>
          <li class="trademark-info-list" v-for="item in monitTrademarkList.records" :key="item.id">
            <div class="trademark-info-img">
              <span v-if="item.imageUrl"><img :src="item.imageUrl"/></span><span v-else>{{ item.similarRemark }}</span>
            </div>
            <div class="trademark-info-con">
              <h2>
                {{ item.similarRemark }}
                <span :class="{ 'registration-fail': ['Inactive', 'RegistrationFail'].includes(item.remarkStatus) }">{{
                  trademarkStatus[item.remarkStatus]
                }}</span>
              </h2>
              <div class="bottom">
                <a-row>
                  <a-col :span="8">
                    <div class="des">
                      <span>申请人:</span>
                      {{ item.ownerName }}
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="des">
                      <span>申请号:</span>
                      {{ item.remarkNumber }}
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="des">
                      <span>申请日期:</span>
                      {{ item.applyDate }}
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="des">
                      <span>大类:</span>
                      {{ item.resultClassNum[0] }}类 {{ item.resultClassNumName }}
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="des">
                      <span>注册号:</span>
                      {{ item.registrationNumber }}
                    </div>
                  </a-col>
                  <a-col :span="8">
                    <div class="des">
                      <span>下证日期:</span>
                      {{ item.registrationDate }}
                    </div>
                  </a-col>
                  <a-col :span="24">
                    <div class="des">
                      <span>小类:</span>
                      {{ JSON.parse(item.remarkSmallCategory)[0] }}
                    </div>
                  </a-col>
                </a-row>
              </div>
              <!-- <p>
              <span>申请人：{{ item.ownerName || '--' }}</span>
              <span>申请号：{{ item.remarkNumber || '--' }}</span>
              <span>申请日期：{{ item.remarkDate }}</span>
            </p>
            <p>
              <span>大类：{{ item.resultClassNum || '--' }}{{ item.resultClassNumName }}</span>
              <span>注册号：{{ item.registrationNumber || '--' }}</span>
              <span>下证日期：{{ item.remarkSmallCategory }}</span>
            </p>
            <p>
              <span> 小类：{{ item.remarkSmallCategory || '--' }} </span>
            </p> -->
            </div>
            <div class="trademark-info-operation">
              <a-button @click="monitTrademarkHandle(item)">取消监控</a-button>
              <p @click="goDetail(item)">查看详情</p>
            </div>
          </li>
        </ul>
      </a-spin>
      <div class="pagination-box" v-if="monitTrademarkList.records && monitTrademarkList.records.length">
        <a-pagination
          v-model="pagePagination.current"
          :total="pagePagination.total"
          show-less-items
          @change="pageChagne"
        />
      </div>
      <a-empty class="empty" v-if="monitTrademarkList.records && !monitTrademarkList.records.length && !spinning" />
    </div>
  </div>
</template>

<script>
import {
  selectTrademarkCheckList,
  selectPassingRate,
  queryCountry,
  queryCategory,
  getMonitTrademarkStatistics,
  monitTrademarkList,
  monitTrademark,
  getDepthQuery,
} from '@/api/trademarkName';

export default {
  components: {},
  data() {
    return {
      formModal: {
        shopName: '',
      },
      pagePagination: {
        current: 1,
        total: 0,
      },
      countryList: [],
      categoryList: [],
      monitTrademarkStatistics: {},
      monitTrademarkList: [],
      trademarkStatus: {
        AnnouncementPeriod: '公告期',
        AuditPeriod: '审核期',
        Active: '已注册',
        Inactive: '已失效',
        Pending: '注册中',
        RegistrationFail: '注册异常',
      },
      monitDateType: false,
      updateDateType: true,
      queryType: '',
      categoryNumber: '',
      spinning: false,
    };
  },
  mounted() {
    this.queryCountryFun();
    this.queryCategoryFun();
    this.getList();
  },
  methods: {
    //取消监测
    monitTrademarkHandle(item) {
      let params = {
        action: 1,
        countryCode: item.resultOrigin,
        remarkNumber: item.remarkNumber,
        trademarkCategoryNum: item.resultClassNum[0],
      };
      let pageChange = false;
      if (this.monitTrademarkList.records.length == 1) {
        pageChange = true;
      }
      monitTrademark(params).then((res) => {
        this.$message.success('操作成功！');
        if (this.pagePagination.total == 1) {
          this.categoryNumber = '';
        }
        if (pageChange && this.pagePagination.current > 1) {
          this.pagePagination.current = this.pagePagination.current - 1;
        }
        this.getList();
      });
    },
    //监测商标统计
    getMonitTrademark() {
      getMonitTrademarkStatistics({}).then((res) => {
        this.monitTrademarkStatistics = res.data || {};
      });
    },
    //获取国家
    queryCountryFun() {
      queryCountry({}).then((res) => {
        this.countryList = res.data || [];
      });
    },
    //获取分类
    queryCategoryFun() {
      queryCategory({}).then((res) => {
        this.categoryList = res.data || [];
      });
    },
    //获取列表
    getList() {
      this.spinning= true;
      let parames = {
        pageIndex: this.pagePagination.current,
        pageSize: 10,
        queryType: this.queryType,
        categoryNumber: this.categoryNumber,
        monitDateType: this.monitDateType ? 0 : '',
        updateDateType: this.updateDateType ? 0 : '',
      };
      monitTrademarkList(parames).then((res) => {
        this.monitTrademarkList = res.data || {};
        this.pagePagination.current = Number(this.monitTrademarkList.current);
        this.pagePagination.total = Number(this.monitTrademarkList.total);
        this.spinning= false;
      });
      this.getMonitTrademark();
    },
    //切换分页
    pageChagne(page, pageSize) {
      this.pagePagination.current = page;
      this.getList();
      console.log(page, pageSize);
    },
    //查看详情
    goDetail(item) {
      window.location.href = `${location.origin}/trademarkdetails?countryCode=${item.resultOrigin}&id=${item.remarkNumber}&anchor=box1`;
    },
    //新增商标
    goTrademark() {
      window.location.href = location.origin + '/trademarkquery';
    },
    //排序
    timeSort(type) {
      if (type == 'monit') {
        this.updateDateType = false;
        this.monitDateType = true;
      } else {
        this.monitDateType = false;
        this.updateDateType = true;
      }
      this.pagePagination.current = 1;
      this.getList();
    },
    //全部和最近更新
    queryTypeSearch(type) {
      if (this.queryType == type) {
        this.queryType = '';
      } else {
        this.queryType = type;
      }
      this.categoryNumber = '';
      this.pagePagination.current = 1;
      this.getList();
    },
    //大类筛选
    categorySearch(num) {
      this.queryType = '';
      if (this.categoryNumber == num) {
        this.categoryNumber = '';
      } else {
        this.categoryNumber = num;
      }

      this.pagePagination.current = 1;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.trademarkMonitoring {
  background: none;
  box-shadow: none;
}
.trademarkMonitoring-header {
  font-size: 14px;
  background: #ffffff;
  padding: 24px;
  position: relative;
  > button {
    position: absolute;
    top: 24px;
    right: 24px;
  }
}
.trademarkMonitoring-content {
  > ul {
    margin-top: 10px;
  }
  background: #ffffff;
  margin-top: 25px;
  padding: 24px;
  /deep/.ivu-input,
  /deep/.ivu-select-selection {
    border-radius: 0;
  }
  .searchBtn,
  .resetBtn {
    line-height: 30px;
  }
  .resetBtn:hover,
  .resetBtn:focus {
    color: #3370ff;
    border-color: #3370ff;
  }
}
.trademarkMonitoring-header-title {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.6);
  line-height: 32px;
  img {
    width: 32px;
  }
  span {
    font-size: 24px;
    padding-left: 8px;
    position: relative;
    top: 3px;
  }
  .my-trademarkMonitoring {
    margin-right: 35px;
    color: rgba(0, 0, 0, 0.9);
    font-weight: bold;
    cursor: pointer;
    border-radius: 4px;
    padding: 0 8px;
    &:hover {
      background: #e8eefb;
    }
  }
  .my-trademarkMonitoring-update {
    cursor: pointer;
    border-radius: 4px;
    padding: 0 8px;
    &:hover {
      background: #e8eefb;
    }
  }
  .queryTypeCurr {
    background: #e8eefb;
    span {
      color: #3370ff;
    }
  }
}
.categoryList-box {
  margin: 6px 0 0;
  width: 105%;
  span {
    display: inline-block;
    width: 168px;
    height: 52px;
    line-height: 52px;
    margin-right: 14px;
    background: #f5f7fa;
    border-radius: 4px 4px 4px 4px;
    padding: 0px 20px;
    color: rgba(0, 0, 0, 0.9);
    margin-top: 14px;
    cursor: pointer;
    &:hover {
      background: #e8eefb;
    }
    b {
      float: right;
      font-size: 20px;
    }
  }
  .category-current {
    background: #e8eefb;
    b {
      color: #3370ff;
    }
  }
}
.time-sort {
  // float: right;
  margin-right: 24px;
  font-size: 14px;
  cursor: pointer;
}
.sort-current {
  color: #3370ff;
}
.trademark-info-list {
  border-top: 1px solid #f0f0f0;
  padding-top: 22px;
  min-height: 162px;
  display: flex;
  font-size: 14px;
  .trademark-info-con {
    h2 {
      line-height: 24px;
      span {
        vertical-align: top;
        display: inline-block;
        width: 52px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        background: rgba(178, 201, 255, 0.2);
        border-radius: 1px;
        font-size: 12px;
        color: #3370ff;
        margin-left: 32px;
      }
      .registration-fail {
        background: #fff1f0;
        color: #ff5f61;
      }
    }
    .bottom {
      .des {
        color: rgba(0, 0, 0, 0.6);
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        /*限制在一个块元素显示的文本的行数*/
        -webkit-box-orient: vertical;
        height: 28px;
        line-height: 28px;
        span {
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
    flex-grow: 2;
  }
  .trademark-info-operation {
    width: 110px;
    text-align: right;
    button {
      margin-top: 28px;
      &:hover {
        color: red;
        border-color: #d9d9d9;
      }
    }
    p {
      color: #3a7fff;
      margin-top: 13px;
      margin-right: 16px;
      cursor: pointer;
    }
  }
  .trademark-info-img {
    width: 133px;
    padding-right: 27px;
    span {
      display: flex;
      width: 108px;
      height: 108px;
      border-radius: 2px;
      border: 1px solid #d9d9d9;
      align-items: center;
      justify-content: center;
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
.pagination-box {
  text-align: right;
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
}
.empty {
  margin: 50px 0;
}
</style>
