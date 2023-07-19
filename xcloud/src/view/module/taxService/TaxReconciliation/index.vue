<template>
  <div class="userPromoteWrapper container">
    <div class="mainPage">
      <Form ref="searchForm" class="formContainer" :model="searchForm" inline>
        <FormItem>
          <Input v-model="searchForm.queryContent" clearable placeholder="公司名称/手机号/服务号" style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.countryCode" @on-change="countryChange" placeholder="税号国家">
            <Option v-for="(item,index) in countryList" :value="item.countryCode" :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.supplierId" placeholder="服务商" style="width:150px;">
            <Option v-for="(item,index) in facilitatorList" :value="item.id" :key="index">{{ item.shortName }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="searchForm.disposeId" clearable placeholder="税务经理">
            <Option v-for="(item,index) in taxManagerList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchList" style="margin-right:5px;">查询</Button>
          <Button type="primary" ghost @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="tab">
        <Button type="primary" @click="downExcel">导出Excel</Button>
      </div>
      <div class="tableArea">
        <Table border :loading="tableLoading" :columns="columns" :data="tableData">
          <template slot="remark" slot-scope="{ row }">
            <div class="button" @click="showRemark=row.remark,showAdd=true,type=4,remarkCreateTime=row.remarkCreateTime,remarkUserNickName=row.remarkUserNickName">
              【查看】
            </div>
          </template>
          <template slot="supplierName" slot-scope="{ row }">
            <div class="supplierName">
              <span>{{row.supplierName}}</span>
            </div>
          </template>
          <template slot="disposeName" slot-scope="{ row }">
            <div class="disposeName">
              <span v-if="row.disposeId">{{row.disposeName}}</span>
            </div>
          </template>
          <template slot="operate" slot-scope="{ row }">
            <div class="operation-box">
              <p class="button" @click="showAdd=true,type=1,id=row.id,remark=row.remark">{{row.remark==''?'【添加备注】':'【修改备注】'}}</p>
              <p class="button" @click="showAdd=true,type=2,id=row.id" v-if="row.arrivalAmountMoney==0">【填写税金】</p>
              <p class="button" @click="showAdd=true,type=3,id=row.id">【填写NRC】</p>
            </div>
          </template>
        </Table>
        <Page @on-change="changePageHandler" :current="pageInfo.page" :total="listTotal" :page-size="pageInfo.limit" show-total show-elevator />
      </div>
    </div>
    <Modal v-model="showAdd" :title="type==1?'添加备注':type==2?'填写税金':type==3?'填写NRC':type==4?'查看备注':''" :mask-closable="false">
      <Input type="textarea" v-model="remark" v-if="type==1"></Input>
      <div v-else-if="type==2">
        <Input style="width:300px;" placeholder="请输入到账金额" v-model="arrivalAmountMoney"></Input>EUR（欧元）
        <p style="color:#c9c9c9;margin:15px 0;">温馨提示：请确认到账的税金金额正确哦；</p>
        <DatePicker style="width: 300px" placeholder="到账日期" v-model="arrivalAmountDate" @on-change="chageDate"></DatePicker>
      </div>
      <Input type="textarea" v-model="rnc" v-else-if="type==3" placeholder="请输入NRC码"></Input>
      <div v-else-if="type==4">
        <p>{{showRemark==''?'无备注':showRemark}}</p>
        <p style="margin-top:8px;color:AAAAAA;">创建时间：{{remarkCreateTime}} 创建人：{{remarkUserNickName}}</p>
      </div>
      <div slot="footer">
        <Button v-if="type!=4" type="primary" @click="sureSubmit">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { getTaxCountry } from '@/api/taxService/common.js';
import * as API from '@/api/taxService/TaxReconciliation.js';
import { getToken } from '@/libs/util';
import facilitatorAndTax from '@/view/module/taxService/common/facilitatorAndTax.js';
export default {
  extends: facilitatorAndTax,
  data() {
    return {
      searchForm: {
        queryContent: '',
        countryCode: ''
      },
      date: '',
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      tableLoading: false,
      columns_showSupplierName: [
        {
          title: '服务号',
          key: 'serverNo'
        },
        {
          title: '公司名称',
          key: 'companyName',
        },
        {
          title: '公司英文名称',
          key: 'companyNameEn'
        },
        {
          title: '国家',
          key: 'countryNameZh'
        },
        {
          title: '服务商',
          slot: 'supplierName'
        },
        {
          title: '客户手机号',
          key: 'userMobile'
        },
        {
          title: '税号',
          key: 'vatTaxNumber'
        },
        {
          title: '申报周期',
          render: (h, params) => {
            let self = this
            // console.log(params.index,params.row.beginTime)
            let beginTime = params.row.beginTime !== ('' || undefined) ? params.row.beginTime.slice(0, 7) : '', endTime = params.row.endTime !== ('' || undefined) ? params.row.endTime.slice(0, 7) : '';
            return h('span', beginTime !== '' && endTime !== '' ? beginTime + '至' + endTime : '')
          }
        },
        {
          title: '不含税销售额',
          key: 'excludeTaxPrice'
        }, {
          title: '应缴税金',
          key: 'allTaxPrice'
        }, {
          title: '到账税金',
          key: 'arrivalAmountMoney'
        }, {
          title: '到账时间',
          key: 'arrivalAmountDate'
        }, {
          title: 'NRC',
          key: 'nrc'
        },
        {
          title: '备注信息',
          slot: 'remark',
          width: 90
        },
        {
          title: '税务经理',
          slot: 'disposeName',
        },
        {
          title: '操作',
          slot: 'operate',
          width: 120
        }
      ],
      columns_noShowSupplierName: [
        {
          title: '服务号',
          key: 'serverNo'
        },
        {
          title: '公司名称',
          key: 'companyName',
        },
        {
          title: '公司英文名称',
          key: 'companyNameEn'
        },
        {
          title: '国家',
          key: 'countryNameZh'
        },
        {
          title: '客户手机号',
          key: 'userMobile'
        },
        {
          title: '税号',
          key: 'vatTaxNumber'
        },
        {
          title: '申报周期',
          render: (h, params) => {
            let self = this
            // console.log(params.index,params.row.beginTime)
            let beginTime = params.row.beginTime !== ('' || undefined) ? params.row.beginTime.slice(0, 7) : '', endTime = params.row.endTime !== ('' || undefined) ? params.row.endTime.slice(0, 7) : '';
            return h('span', beginTime !== '' && endTime !== '' ? beginTime + '至' + endTime : '')
          }
        },
        {
          title: '不含税销售额',
          key: 'excludeTaxPrice'
        }, {
          title: '应缴税金',
          key: 'allTaxPrice'
        }, {
          title: '到账税金',
          key: 'arrivalAmountMoney'
        }, {
          title: '到账时间',
          key: 'arrivalAmountDate'
        }, {
          title: 'NRC',
          key: 'nrc'
        },
        {
          title: '备注信息',
          slot: 'remark',
          width: 90
        },
        {
          title: '税务经理',
          slot: 'disposeName',
        },
        {
          title: '操作',
          slot: 'operate',
          width: 120
        }
      ],
      tableData: [],
      countryList: [],
      showAdd: false,
      type: 0,
      remark: '',
      arrivalAmountMoney: '',
      arrivalAmountDate: '',
      rnc: '',
      id: '',
      showRemark: '',
      remarkCreateTime: '',
      remarkUserNickName: ''
    }

  },
  computed: {
    columns(){
      if(this.hasAuthority('TaxReconciliation_lookSupplier')){
        return this.columns_showSupplierName;
      }else{
        return this.columns_noShowSupplierName;
      }
    },
  },
  mounted() {
    this.getCountryList()
    this.getList();
  },
  methods: {
    //获取税号国家下拉数据
    getCountryList() {
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
    },
    //获取列表
    getList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      API.taxreconciliationListApi(params).then((res) => {
        if (res.code == 0) {
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
      this.getList()
    },
    //重置列表
    resetList() {
      this.searchForm = {}
      this.getList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getList()
    },
    chageDate(date) {
      this.arrivalAmountDate = date
    },
    downExcel() {
      let self = this;
      let formData = new FormData()
      // 获取时间戳
      let timestamp = new Date().getTime()
      let countryCode = this.searchForm.countryCode == undefined ? '' : this.searchForm.countryCode
      formData.append('queryContent', this.searchForm.queryContent)
      formData.append('countryCode', countryCode)
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('post', this.baseUrl + '/etax/derive/management/reconciliation/export/list', true)
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = timestamp + '.xlsx'
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    },
    sureSubmit() {
      if (this.type == 1) {
        if (this.remark == '') {
          this.$Message.info('请先填写备注')
          return
        }
        let data = {
          remark: this.remark,
          id: this.id
        }
        API.addRemarkApi(data).then(res => {
          if (res.code == 0) {
            this.$Message.success('填写成功')
            this.showAdd = false
            this.getList()
          }
        })
      } else if (this.type == 2) {
        if (this.arrivalAmountMoney == '') {
          this.$Message.info('请先填写税金')
          return
        }
        if (this.arrivalAmountDate == '') {
          this.$Message.info('请选择到账时间')
          return
        }
        let data = {
          arrivalAmountMoney: this.arrivalAmountMoney,
          arrivalAmountDate: this.arrivalAmountDate,
          id: this.id
        }
        API.addtaxesApi(data).then(res => {
          if (res.code == 0) {
            this.$Message.success('填写成功')
            this.showAdd = false
            this.getList()
          }
        })
      } else if (this.type === 3) {
        if (this.rnc == '') {
          this.$Message.info('请先填写NRC码')
          return
        }
        let data = {
          rnc: this.rnc,
          id: this.id
        }
        API.addNrcApi(data).then(res => {
          if (res.code == 0) {
            this.$Message.success('填写成功')
            this.showAdd = false
            this.getList()
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.userPromoteWrapper {
  /deep/ .ivu-table-wrapper {
    overflow: inherit;
  }
}
.operation-box {
  span {
    cursor: pointer;
  }
}
.container {
  background: #fff;
  padding: 15px;
  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 15px;
  }
  .button {
    color: #2d8cf0;
    cursor: pointer;
  }
}
.formContainer {
  background: #f8f8f8;
  padding: 20px 20px 0px 20px;
  margin-bottom: 20px;
}
.supplierName {
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    cursor: pointer;
    margin-left: 10px;
    font-size: 16px;
  }
}
.tab {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}
.modal {
  /deep/ .ivu-modal-header {
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        font-size: 16px;
        font-weight: 600;
      }
    }
    .closeBtn {
      font-size: 31px;
      cursor: pointer;
    }
  }
  /deep/ .ivu-transfer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .ivu-table-wrapper {
    overflow: visible;
  }
  .button {
    color: #2d8cf0;
    cursor: pointer;
  }
  .text {
    p {
      height: 40px;
      line-height: 40px;
    }
  }
}
.action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /deep/ .ivu-btn {
    margin: 5px 0;
  }
}
</style>