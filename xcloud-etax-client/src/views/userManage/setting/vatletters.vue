<template>
  <div style="min-height: calc(100vh - 60px)">
    <div class="clearfix title_wait" v-if="!isShowDetail">
      <div class="commontitle">
        VAT信件
      </div>
      <div class="content">
        <div class="flex title">
          <Form :model="letterForm" :label-width="0" inline ref="letterForm" style="width: 100%">
            <Row>
              <Col span="8">
                <FormItem label="公司名称：" :label-width="90" label-position="left" prop="likeName">
                  <Input v-model="letterForm.companyName" placeholder="请输入公司名称" style="width: 200px"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="VAT税号：" :label-width="90" label-position="left" prop="likeName">
                  <Input v-model="letterForm.vatTaxNumber" placeholder="请输入VAT税号" style="width: 200px"></Input>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="信件类型：" :label-width="90" label-position="left" prop="functionCode">
                  <Select clearable v-model="letterForm.type" placeholder="信件类型" style="width: 200px">
                    <Option :value="item" v-for="(item, key, index) in letterType" :key="index">{{ key }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="所属国家：" :label-width="90">
                  <Select clearable v-model="letterForm.taxCountryCode" placeholder="所属国家" style="width: 200px">
                    <Option :value="item.countryCode" v-for="(item, index) in countryList" :key="index">
                      {{ item.countryNameZh }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="处理状态：" :label-width="90" label-position="left" prop="functionCode">
                  <Select
                    clearable
                    v-model="letterForm.processStatus"
                    placeholder="请选择处理状态"
                    style="width: 200px"
                  >
                    <Option :value="key" v-for="(item, key, index) in processStatusList" :key="index">
                      {{ item }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="8">
                <Form-item>
                  <Button
                    type="primary"
                    style="margin-left: 10px"
                    icon="ios-search"
                    @click="searchLetterList"
                    class="searchBtn"
                  >
                    搜索
                  </Button>
                  <Button @click="resetList" icon="ios-refresh" class="resetBtn">重置</Button>
                </Form-item>
              </Col>
            </Row>
          </Form>
        </div>
        <Table border :columns="letterColumns" :data="letterData">
          <template slot="processStatus" slot-scope="{ row }">
            <span>
              {{ processStatusList[row.processStatus] }}
            </span>
          </template>
          <template slot="taxCountryCode" slot-scope="{ row }">
            <span>{{ allCountryList.find((item) => item.countryCode == row.taxCountryCode).countryNameZh }}</span>
          </template>
          <template slot="receiveTime" slot-scope="{ row }">
            <span>{{ row.receiveTime.slice(0, 10) }}</span>
          </template>
          <template slot="processSuggestions" slot-scope="{ row }">
            <span class="cursor processed" @click="toView(row)">
              <img src="@/assets/images/common/searchIcon.png" />
              查看
            </span>
          </template>
          <template slot="operate" slot-scope="{ row }">
            <span class="cursor" @click="toDetail(row)">查看</span>
            <span
              class="cursor"
              style="color: #02a7f0; margin-left: 10px"
              v-if="row.processStatus === 1"
              @click="dealWithLetter(row)"
            >
              已处理
            </span>
          </template>
        </Table>
        <Page
          @on-change="changePageHandler"
          :current="pageInfo.page"
          :total="listTotal"
          :page-size="pageInfo.limit"
          show-total
          show-elevator
        />
      </div>
    </div>
    <lettersDetail
      v-if="isShowDetail"
      @back="isShowDetail = false"
      @refresh="refresh"
      :letterInfo="letterInfo"
      :processStatusList="processStatusList"
    ></lettersDetail>
  </div>
</template>

<script>
import { baseInfo, countryListApi } from '@/api/shoppingCar/shoppingCar';
import { letterList, dispose, detail, getTemplateListApi } from '@/api/user/letters';
import lettersDetail from '@/views/common/lettersDetail';
import { log } from 'mathjs';
export default {
  data() {
    return {
      isShowDetail: false,
      countryList: [],
      allCountryList: [],
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      letterForm: {
        companyName: '',
        vatTaxNumber: '',
        type: [],
        processStatus: '',
        taxCountryCode: '',
      },
      letterData: [],
      letterColumns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          title: '公司中文名称',
          key: 'companyNameZh',
        },
        {
          title: '公司英文名称',
          key: 'companyNameEn',
        },
        {
          title: '所属国家',
          slot: 'taxCountryCode',
          width: 80,
        },
        {
          title: 'VAT税号',
          key: 'vatTaxNumber',
        },
        {
          title: '信件类型',
          key: 'typeName',
        },
        // {
        //   title: "信件接收时间",
        //   slot: "receiveTime",
        // },
        {
          title: '处理状态',
          slot: 'processStatus',
          width: 80,
        },
        {
          title: '信件内容',
          slot: 'processSuggestions',
        },
        {
          title: '操作',
          slot: 'operate',
        },
      ],
      letterType: {},
      processStatusList: {
        0: '无需处理',
        1: '待处理',
        // 2: "已处理",
        3: '处理完成',
      },
      letterInfo: {},
    };
  },
  components: {
    lettersDetail,
  },
  mounted() {
    this.baseInfo();
    this.getLetterList();
    this.getTemplateList();
  },
  methods: {
    baseInfo() {
      baseInfo()
        .then((res) => {
          if (res.code === 0) {
            this.countryList = res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      countryListApi()
        .then((res) => {
          if (res.code === 0) {
            this.allCountryList = res.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getLetterList() {
      let params = {
        ...this.letterForm,
        ...this.pageInfo,
        type: this.letterForm.type == '' || this.letterForm.type == null ? [] : this.letterForm.type.split(','),
      };
      letterList(params)
        .then((res) => {
          if (res.code == 0) {
            this.letterData = res.data.records;
            this.listTotal = Number(res.data.total);
          } else {
            // this.$Message.warning(res.message);
            this.tableLoading = false;
          }
        })
        .catch((err) => console.log(err));
    },
    getTemplateList() {
      getTemplateListApi({
        delFlag: '0',
      })
        .then((res) => {
          if (res.code === 0) {
            this.letterType = {};
            for (let key in res.data) {
              if (key.indexOf('辰海') == -1) {
                this.letterType[key] = res.data[key].toString();
              }
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    searchLetterList() {
      this.pageInfo.page = 1;
      this.getLetterList();
    },
    resetList() {
      this.letterForm = {
        companyName: '',
        vatTaxNumber: '',
        type: [],
        processStatus: '',
        taxCountryCode: '',
      };
      this.pageInfo.page = 1;
      this.getLetterList();
    },
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.getLetterList();
    },
    toView(row) {
      this.$Modal.info({
        title: '处理建议:',
        content: row.processSuggestions,
      });
    },
    dealWithLetter(row) {
      // this.$parent.$children[1].getLetterList();
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>是否处理该信件</p>',
        onOk: () => {
          dispose({
            id: row.id,
          }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('处理成功');
              // this.$store.dispatch("changxinjianCount");
              this.getLetterList();
            }
          });
        },
      });
    },
    toDetail(row) {
      this.isShowDetail = true;
      this.letterInfo = row;
    },
    refresh() {
      this.isShowDetail = false;
      this.getLetterList();
    },
  },
};
</script>

<style lang="less" scoped>
.headContent {
  height: 78px;
  background: #ffffff;
  box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
  padding: 20px 32px;
  .top {
    margin-bottom: 14px;
    .flink,
    .clink {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
    }
    .clink {
      color: rgba(0, 0, 0, 0.65);
      font-weight: 500;
    }
  }
  .bottom {
    font-size: 20px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
  }
}
.content {
  margin: 22px 24px;
  background: #ffffff;
  padding: 24px;
  min-height: calc(100vh - 205px);
}
.title_wait {
  border-bottom: 1px solid #f6f6f6;
  min-height: calc(100vh - 86px);
  // margin: 20px 10px -2px 24px;
  // padding: 20px;
}
/deep/ th .ivu-table-cell {
  font-size: 14px;
  font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
&/deep/ .ivu-table {
  color: #333333;
  font-size: 12px;
  td,
  th {
    border-bottom: 1px solid #e6e6e6;
    padding: 16px 0;
    text-align: center;
    // border-right: none;
    border-right: 1px solid #ebebebff;
  }
  th {
    color: #666666;
    font-weight: inherit;
    background: rgba(22, 173, 233, 0.2);
  }
}
.cursor {
  cursor: pointer;
}
.processed {
  color: #02a7f0;
  display: flex;
  justify-content: center;
}
/deep/ .title_wait {
  .ivu-page {
    text-align: center;
    padding-top: 30px;
  }
}
</style>
