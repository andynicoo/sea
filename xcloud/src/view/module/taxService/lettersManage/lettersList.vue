<template>
  <div class="orderListWrapper">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem>
          <Input v-model="searchForm.companyName"
                 clearable
                 placeholder="公司中英文名称"
                 style="width:200px;" />
        </FormItem>
        <FormItem>
          <Input v-model="searchForm.vatNumber"
                 clearable
                 placeholder="VAT税号"
                 style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.letterType"
                  placeholder="信件类型">
            <Option value="-1">全部类型</Option>
            <Option value="1">罚款利息文件</Option>
            <Option value="2">滞纳金通知</Option>
            <Option value="3">催税罚款文件</Option>
            <Option value="4">罚款通知</Option>
            <Option value="5">税务稽查文件</Option>
            <Option value="6">退税文件</Option>
            <Option value="7">退税支票</Option>
            <Option value="8">C79</Option>
            <Option value="9">申报周期变更</Option>
            <Option value="11">税率文件 </Option>
            <Option value="12">催申报文件</Option>
            <Option value="13">调查问卷</Option>
            <Option value="10">其他</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.isDispose"
                  placeholder="处理状态">
            <Option value="-1">全部状态</Option>
            <Option value="1">待处理</Option>
            <Option value="2">不需要用户处理</Option>
            <Option value="3">处理完成</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.countryCode"
                  placeholder="所属国家">
            <Option value="-1">全部国家</Option>
            <Option :value="item.countryCode"
                    v-for="(item, index) in countryList"
                    :key="index">{{item.countryNameZh}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model="date"
                      type="daterange"
                      placement="bottom-end"
                      @on-change="dateChange"
                      placeholder="信件接受时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList"
                  style="margin-right:5px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="tableArea">
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData">
          <template slot="isDispose"
                    slot-scope="{ row }">
            <span>{{row.isDispose == '1' ? "待处理" : row.isDispose == '2' ? "不需要用户处理" : row.isDispose == '3' ? '处理完成' : '' }}</span>
          </template>
          <template slot="status"
                    slot-scope="{ row }">
            <span>{{row.status == '1' ? "未发送" : row.status == '2' ? "已发送" : '' }}</span>
          </template>
          <template slot="receptionTime"
                    slot-scope="{ row }">
            <span>{{row.receptionTime.slice(0, 10)}}</span>
          </template>
          <template slot="letterType"
                    slot-scope="{ row }">
            <span>{{row.letterType == '1' ? "罚款利息通知" : row.letterType == '2' ? "滞纳金通知" : row.letterType == '3' ? "催税罚款通知" : row.letterType == '4' ? "罚款通知" : row.letterType == '5' ? '税务稽查通知' : row.letterType == '6' ? '退税文件' : row.letterType == '7' ? '退税支票' : row.letterType == '8' ? 'C79' : row.letterType == '9' ? '申报周期变更': row.letterType == '11' ? '税率文件' : row.letterType == '12' ? '催申报文件' : row.letterType == '13' ? '调查问卷': '其它' }}</span>
          </template>
          <template slot="advice"
                    slot-scope="{ row }">
            <span class="cursor"
                  @click="toView(row)">【查看】</span>
          </template>
          <template slot="operate"
                    slot-scope="{ row }">
            <span class="cursor"
                  v-if="row.isDispose === 1 && row.status === 2"
                  @click="dealWithLetter(row)">【已处理】</span>
            <span class="cursor"
                  @click="toDetail(row.id)">【详情】</span>
            <span class="cursor"
                  v-if="row.status === 1"
                  @click="sendLetter(row)">【发送用户】</span>
          </template>
        </Table>
        <Page @on-change="changePageHandler"
              :current="pageInfo.page"
              :total="listTotal"
              :page-size="pageInfo.limit"
              show-total
              show-elevator />
      </div>
    </div>
    <lettersDetail v-if="isDetailShow"
                   :rowInfo='rowInfo'
                   @back="backFun"></lettersDetail>
  </div>
</template>
<script>
import * as API from '@/api/taxService/letters.js';
import lettersDetail from './components/lettersDetail'
import { getTaxCountry } from '@/api/taxService/common.js';
export default {
  name: 'orderList',
  data() {
    return {
      isDetailShow: false,
      searchForm: {
        companyName: '',
        vatNumber: '',
        letterType: '',
        receptionBeginTime: '',
        receptionEndTime: '',
        isDispose: -1,
        countryCode: ''
      },
      date: '',
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      tableLoading: false,
      detailId: '',
      countryList: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 50
        },
        {
          title: '公司中文名称',
          key: 'companyName',
          minWidth: 50,
        },
        {
          title: '公司英文名称',
          key: 'companyNameEn'
        },
        {
          title: '所属国家',
          key: 'countryNameZh'
        },
        {
          title: 'VAT税号',
          key: 'vatTaxNumber'
        },
        {
          title: '信件类型',
          slot: 'letterType'
        },
        {
          title: '信件接收时间',
          slot: 'receptionTime'
        },
        {
          title: '录入时间',
          key: 'updateTime'
        },
        {
          title: '处理状态',
          slot: 'isDispose'
        },
        {
          title: '处理建议',
          slot: 'advice'
        },
        {
          title: '是否发送用户',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      allAmountMoney: 0,
      allDiscAmount: 0,
      allOrderMoney: 0,
      allOrderOldMoney: 0,
      tableData: []
    }
  },
  components: {
    lettersDetail
  },
  mounted() {
    this.getLetterList();
    this.baseInfo()
  },
  methods: {
    //订单创建时间
    dateChange(date) {
      this.searchForm.receptionBeginTime = date[0];
      this.searchForm.receptionEndTime = date[1];
    },
    baseInfo() {
      API.baseInfo().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //获取列表
    getLetterList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      API.getLetterList(params).then((res) => {
        if (res.code == 0) {
          // console.log(res.data.records)
          this.tableLoading = false;
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$Message.warning(res.message);
          this.tableLoading = false
        }
      })
        .catch((err) => console.log(err))
    },
    //搜索列表
    searchList() {
      this.pageInfo.page = 1;
      this.getLetterList()
    },
    //重置列表
    resetList() {
      this.searchForm = {};
      this.date = "";
      this.pageInfo.page = 1;
      this.getLetterList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getLetterList()
    },
    //查看详情
    toDetail(row) {
      this.isDetailShow = true;
      this.rowInfo = row;
    },
    refreshList() {
      this.isDetailShow = false;
    },
    backFun() {
      this.isDetailShow = false
    },
    toView(row) {
      this.$Modal.info({
        title: '处理建议:',
        content: row.advise
      });
    },
    sendLetter(row) {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>是否发信给用户</p>',
        onOk: () => {
          API.sendLetter({
            id: row.id
          }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('发送成功');
              this.getLetterList()
            }
          })
        },
      });
    },
    dealWithLetter(row) {
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>是否处理该信件</p>',
        onOk: () => {
          API.dispose({
            id: row.id
          }).then((res) => {
            if (res.code == 0) {
              this.$Message.success('处理成功');
              this.getLetterList()
            }
          })
        },
      });
    },
  }
}
</script>
<style lang="less" scoped>
.orderListWrapper {
}
.money {
  .statistical {
    font-size: 14px;
    padding-bottom: 10px;
  }
}
.cursor {
  cursor: pointer;
}
</style>