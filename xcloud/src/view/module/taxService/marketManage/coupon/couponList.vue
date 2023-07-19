<template>
  <div class="couponWrapper">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem>
          <Input v-model="searchForm.custAcno"
                 clearable
                 placeholder="用户手机号/优惠券码"
                 style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select v-model="searchForm.assignTo"
                  placeholder="发放人"
                  style="width: 130px">
            <Option v-for="(item, index) in publisherList"
                    :value="item.assignTo"
                    :key="index">{{item.assignName}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <DatePicker v-model="searchForm.createStartDate"
                      type="date"
                      @on-change="pickDate(1, $event)"
                      placeholder="选择开始时间"
                      style="width: 200px"></DatePicker>
          至
          <DatePicker v-model="searchForm.createEndtDate"
                      type="date"
                      @on-change="pickDate(2, $event)"
                      placeholder="选择结束时间"
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
      <div class="btnArea">
        <Button type="success"
                @click="addCouponModal=true">发放优惠券</Button>
        <p>
          <span class="item">优惠券总金额:
            <span>{{totalAmount.totalAmount}}</span>
          </span>
          <span class="item">优惠券数:
            <span>{{totalAmount.totalCount}}</span>
          </span>
          <span class="item">优惠券使用金额:
            <span>{{totalAmount.useAmount}}</span>
          </span>
        </p>
      </div>
      <div class="tableArea">
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData">
          <template slot="operate"
                    slot-scope="{ row }">
            <Button v-if="row.status === 0"
                    type="info"
                    @click="invalid(row.id)">作废</Button>
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
    <Modal v-model="addCouponModal"
           title="发放优惠券">
      <Form :label-width="120">
        <FormItem label="优惠券类型："
                  class="requiredItem">
          <Select v-model="addForm.couponType"
                  placeholder="请选择优惠类型"
                  style="width: 200px">
            <Option value="1">满减券</Option>
            <Option value="2">折扣券</Option>
            <Option value="14">免单券</Option>
          </Select>
        </FormItem>
        <FormItem label="折扣比例："
                  class="requiredItem"
                  v-if="addForm.couponType==2">
          <InputNumber :max="100"
                       :min="0"
                       v-model="addForm.discScale"></InputNumber>%
        </FormItem>
        <FormItem label="门槛金额："
                  class="requiredItem"
                  v-if="addForm.couponType==1 || addForm.couponType==14">
          <Input v-model="addForm.threAmount"
                 @on-blur="blur(1)"
                 placeholder="请输入门槛金额"
                 style="width:200px" />
          <span v-show="isTipsShow1"
                style="color:#EE113D;font-size:12px;">{{'只允许输入正数(保留两位小数)'}}</span>
        </FormItem>
        <FormItem label="优惠金额："
                  class="requiredItem"
                  v-if="addForm.couponType==1 || addForm.couponType==14">
          <Input v-model="addForm.discAmount"
                 @on-blur="blur(2)"
                 placeholder="请输入优惠金额"
                 style="width:200px" />
          <span v-show="isTipsShow2"
                style="color:#EE113D;font-size:12px;">{{'只允许输入正数(保留两位小数)'}}</span>
        </FormItem>
        <FormItem label="有效日期："
                  class="requiredItem">
          <DatePicker @on-change="changeDate"
                      :value="date"
                      v-model="date"
                      :options='optionsTime'
                      type="daterange"
                      placeholder="请选择优惠券有效日期"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="使用国家："
                  class="requiredItem">
          <Select v-model="countryCodeList"
                  multiple
                  placeholder="请选择可使用国家"
                  style="width: 200px">
            <Option value="ALL">{{"适用全部"}}</Option>
            <Option v-for="(item,index) in allcountryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem label="使用范围："
                  class="requiredItem">
          <Select v-model="addForm.functionCode"
                  placeholder="请选择可使用范围"
                  style="width: 200px">
            <Option value="0">适用所有</Option>
            <Option value="5">注册+申报</Option>
            <Option value="2">转代理+申报</Option>
            <Option value="6">税号注销</Option>
            <Option value="7">税务稽查</Option>
            <Option value="16">欧代/英代</Option>
          </Select>
        </FormItem>
        <FormItem label="发放数量："
                  class="requiredItem">
          <Input v-model="addForm.couponCount"
                 @on-blur="blur(3)"
                 placeholder="请输入发放数量"
                 style="width:200px" />
          <span v-show="isTipsShow3"
                style="color:#EE113D;font-size:12px;">{{'只允许输入正整数'}}</span>
        </FormItem>
        <FormItem label="用户手机号："
                  class="requiredItem">
          <Input type="textarea"
                 v-model="addForm.custAcno"
                 placeholder="请输入用户的登录账号，多个可用英文“;”隔开"
                 style="width:200px" />
        </FormItem>
        <FormItem label="备注：">
          <Input type="textarea"
                 v-model="addForm.remark"
                 placeholder="请输入用户的登录账号，多个可用英文“;”隔开"
                 style="width:200px" />
        </FormItem>
      </Form>
      <p slot="footer">
        <Button @click="cancelAdd">取消</Button>
        <Button type="primary"
                @click="sureAdd"
                :loading="sureLoading">确认发放</Button>
      </p>
    </Modal>
    <Modal title="是否作废"
           v-model="invalidModal"
           width="300">
      作废该优惠券
      <p slot="footer">
        <Button @click="invalidModal = false">取消</Button>
        <Button type="primary"
                @click="sureInvalid">确定</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/taxService/marketing.js';
import { getTaxCountry } from '@/api/taxService/common.js'
export default {
  data() {
    return {
      isDetailShow: false,
      searchForm: {
        custAcno: '',
        createStartDate: '',
        createEndtDate: '',
        status: '',
        remark: '',
        assignTo: ''
      },
      date: '',
      pageInfo: {
        limit: 10,
        page: 1,
      },
      sureLoading: false,
      listTotal: 0,
      tableLoading: false,
      detailId: '',
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 66
        },
        {
          title: '用户手机号',
          key: 'custAcno'
        },
        {
          title: '优惠券码',
          key: 'couponNum'
        },
        {
          title: '门槛金额',
          key: 'threAmount'
        },
        {
          title: '使用国家',
          key: 'countryName'
        },
        {
          title: '使用范围',
          render: (h, params) => {
            let self = this
            return h('span', self.functionCodeStatus[params.row.functionCode])
          }
        },
        {
          title: '优惠金额',
          render(h, params) {
            let discAmount = ''
            if (params.row.couponType == 1 || params.row.couponType == 8 || params.row.couponType == 9 || params.row.couponType == 10 || params.row.couponType == 11 || params.row.couponType == 12 || params.row.couponType == 13 || params.row.couponType == 14) {
              discAmount = params.row.discAmount+'元'
            } else if (params.row.couponType == 2) {
              discAmount = params.row.discScale+'折'
            }
            return h('span', discAmount)
          },
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '使用时间',
          key: 'conDate'
        },
        {
          title: '有效日期',
          key: 'seDate'
        },
        {
          title: '发放方式',
          render: (h, params) => {
            return h('span', params.row.assignType == 1 ? '人工发放' : params.row.assignType == 2 ? '系统发放' : '')
          }
        },
        {
          title: '发放人',
          key: 'assignName'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '状态',
          render: (h, params) => {
            return h('span', params.row.status == 0 ? '未使用' : params.row.status == 1 ? '已使用' : params.row.status == 2 ? '已失效' : params.row.status == 3 ? '已作废' : '')
          }
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      tableData: [],
      addCouponModal: false,
      addForm: {
        threAmount: '',
        discAmount: '',
        startDate: '',
        endDate: '',
        discScale: 0
      },
      allcountryList: [],//使用国家
      isTipsShow1: false,
      isTipsShow2: false,
      isTipsShow3: false,
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      functionCodeStatus: {
        0: '适用所有',
        1: '税号注册',
        2: '转代理+申报',
        3: '税务补缴',
        4: '转代理',
        5: '注册+申报'
      },
      publisherList: [], // 发布人列表
      totalAmount: {},
      countryCodeList: [],
      invalidModal: false, // 作废确认弹窗
      couponsId: '' // 优惠券ID
    }
  },
  mounted() {
    this.getList();
    this.getCountryList();
    this.getUsersList()
  },
  methods: {
    //  获取发放人列表
    getUsersList() {
      API.usersList().then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.publisherList = res.data
        } else {
          this.$Message.warning(res.message);
        }
      })
    },
    //获取国家list
    getCountryList() {
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.allcountryList = res.data;

        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    //获取列表
    getList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      API.getCouponList(params).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$Message.warning(res.message);
        }
      })
        .catch((err) => console.log(err))

      API.getCouponStatistics(params).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.totalAmount = res.data
        } else {
          this.$Message.warning(res.message);
        }
      })
        .catch((err) => console.log(err))
    },
    //搜索列表
    searchList() {
      this.pageInfo.page = 1;
      this.getList()
    },
    //重置列表
    resetList() {
      this.searchForm = {
        custAcno: '',
        createStartDate: '',
        createEndtDate: '',
        status: '',
        remark: '',
        assignTo: ''
      }
      this.getList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getList()
    },
    // 选择时间
    pickDate(type, obj) {
      switch (type) {
        case 1:
          this.searchForm.createStartDate = obj
          break;
        case 2:
          this.searchForm.createEndtDate = obj
          break;
      }
    },
    //作废按钮
    invalid(id) {
      this.invalidModal = true
      this.couponsId = id
    },
    // 确认作废
    sureInvalid() {
      API.obsolete({
        id: this.couponsId
      }).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.invalidModal = false
          this.$Message.success('优惠券作废成功')
          this.getList()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //确认发放优惠券
    sureAdd() {
      this.addForm.countryCode = this.countryCodeList.join(';') + ';'
      let num1 = Number(this.addForm.discAmount);
      let num2 = Number(this.addForm.threAmount);
      if (num1 > num2) {
        this.$Message.warning('优惠金额<=门槛金额!')
        return
      }
      if (this.addForm.custAcno.indexOf('；') !== -1) {
        this.addForm.custAcno = this.addForm.custAcno.replace('；', ';')
      }
      this.sureLoading = true
      API.addCoupon(this.addForm).then((res) => {
        if (res.code == 0) {
          this.$Message.success('优惠券发放成功');
          this.addForm = {};
          this.date = '';
          this.addCouponModal = false;
          this.getList();
        } else {
          this.$Message.warning(res.message)
        }
      }).finally(() => {
        this.sureLoading = false
      })
        .catch(err => console.log(err))

    },
    //取消发放
    cancelAdd() {
      this.addCouponModal = false;
      this.addForm = {};
      this.date = '';
      this.isTipsShow1 = false;
      this.isTipsShow2 = false;
      this.isTipsShow3 = false;
    },
    //选择优惠券有效日期
    changeDate(val) {
      this.addForm.startDate = val[0];
      this.addForm.endDate = val[1];
    },
    //门槛金额失焦
    blur(type) {
      // let reg = /^\d+(\.\d{2})?$/;
      let reg = /^(?!0+(?:\.0+)?$)\d+(?:\.\d{1,2})?$/;
      let reg1 = /^[0-9]*$/;
      if (type == 1) {
        if (!reg.test(this.addForm.threAmount)) {
          this.isTipsShow1 = true;
        } else if (this.addForm.threAmount.length == 0) {
          this.isTipsShow1 = false;
        } else {
          this.isTipsShow1 = false;
        }
      } else if (type == 2) {
        if (!reg.test(this.addForm.discAmount)) {
          this.isTipsShow2 = true;
        } else if (this.addForm.discAmount.length == 0) {
          this.isTipsShow2 = false;
        } else {
          this.isTipsShow2 = false;
        }
      } else if (type == 3) {
        if (!reg1.test(this.addForm.couponCount)) {
          this.isTipsShow3 = true;
        } else if (this.addForm.couponCount.length == 0) {
          this.isTipsShow3 = false;
        } else {
          this.isTipsShow3 = false;
        }
      }


    }
  }
}
</script>
<style lang="less" scoped>
.requiredItem {
  /deep/ .ivu-form-item-label::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
.couponWrapper {
  .btnArea {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    .item {
      margin: 0px 20px;
      font-size: 16px;
    }
  }
  /deep/ .ivu-form-item .tips {
    color: #ee113d;
    font-size: 12px;
  }
}
</style>