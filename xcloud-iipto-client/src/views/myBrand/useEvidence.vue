<template>
  <div class="mainContent">
    <p class="title" @click="goBack" style="cursor:pointer;">
      <img src="@/assets/images/infoDetail/jiantou-zuo.png" alt="">使用证据信息
    </p>
  
    <ConfirmReject :marketHrefList="marketHrefList" :workflowColumns="workflowColumns" :trademarkCategoryList="trademarkCategoryList" :serciveInfo="serciveInfo" />
  </div>
</template>
<script>

import { evidenceDetailApi, answerOaApi, answerOaMaterialsApi, applyAmazonFilingCodeApi, materialsApi } from "@/api/breadInfoDetail";
import { updateNodeAPI } from "@/api/trademarkRegister/myBread";
import ConfirmReject from './component/ConfirmReject'
export default {
  components: {
    ConfirmReject
  },
  data() {
    return {
      // 'workflowColumns', 'trademarkCategoryList', 'serciveInfo'
      workflowColumns: [],
      trademarkCategoryList: [],
      serciveInfo: {},
      servicesId: '',
      cureentNodeCode: '',
      oaFileList: [],
      marketHrefList: []
    }
  },
  created() {
    // console.log(222)
    this.servicesId = this.$route.query.servicesId
    console.log(this.$route.query)
    this.cureentNodeCode = this.$route.query.cureentNodeCode
    this.getDetailFun()
  },
  computed: {

  },
  watch: {
  },
  methods: {
    //获取工单资料
    getDetailFun() {
      let data = {
        serviceId: this.servicesId,
        nodeCode: this.cureentNodeCode
      }
      evidenceDetailApi(data).then(res => {
        if (res.code == 0) {
          console.log(res.data)
          this.workflowColumns = res.data.workflowColumns
          this.serciveInfo = res.data.trademarkOrderServiceInfoVO
          this.oaFileList = res.data.fileOaWorkOrderList
          this.workOrderId = res.data.trademarkOrderServiceInfoVO.workOrderId
          this.workOrderNo = res.data.trademarkOrderServiceInfoVO.workOrderNo
        }
      }).finally(() => {
        this.initDataFunc()
      })
    },
    goBack() {
      this.$router.push('/myBrand')
    },
    getControlData(datalist) {
      let childList = datalist.filter(item => item.columnPid != ''),
        newData = datalist.filter(item => item.columnPid == ''), nowData = [...newData]
      newData.map(item => {
        childList.map(vv => {
          if (vv.columnPid == item.columnId && vv.columnOption.includes(item.keyNameValue)) {
            nowData.push(vv)
          }
        })
      })
      return nowData.sort((a, b) => {
        return a.sort - b.sort;
      });
    },
    //初始化工单资料
    initDataFunc() {
      let newArr = [...this.workflowColumns]; this.workflowColumns = []
      newArr.map(item => {
        let newItem = { ...item }
        item.columns = this.getControlData(item.columns)
        if (newItem.moduleName == '商标分类') {
          if (newItem.columns[0].keyNameValue != '') {
            this.trademarkCategoryList = JSON.parse(newItem.columns[0].keyNameValue)
          }
        }
        if (newItem.moduleName == '商标使用证据') {
          newItem.columns.map(vv => {
            if (vv.keyName == 'marketHref') {
              this.marketHrefList = JSON.parse(vv.keyNameValue)
            }
          })
        }
        this.workflowColumns.push(item)
      })
      this.fileList = []
      this.answerFileList = []
      this.oaFileList.map(item => {
        let obj = { ...item }
        obj.overdue = false
        if (new Date(item.officialExpirationDate) < new Date()) {
          obj.overdue = true
        }
        item.status != 3 && this.fileList.push(obj); //
        if (item.answerFile != '') {
          this.answerFileList.push(item)
        }
      })
    },
    sureCodeFunc() {
      this.$Modal.info({
        title: '',
        content: `<div class="submit-tip-box">
          <p class="submit-tip-title"><span class="imgs"></span><span>提示</span></p>
          <p class="tip-content">您申请的业务已递交成功，我们将会在7个工作日内完成处理。</p></div>`,
        okText: '确定',
        cancleText: '离开',
        onOk: () => {
          this.getDetailFun()
        },
      })
    },
    showReason(item) {
      this.$Modal.info({
        title: '驳回原因',
        content: `<p class="reson-box">${item.rejectReason}</p>`
      });
    },
  },

}
</script>
<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 964px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  margin-bottom: 44px;
  box-sizing: border-box;
  .title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 24px;
    padding-top: 20px;
  }
}
/deep/ .ivu-table-fixed-body {
  background-color: #fff;
}
/deep/ .ivu-poptip-inner {
  background: #464c59;
  box-shadow: 0px 4px 8px 0px rgba(51, 51, 51, 0.22),
    4px -4px 8px 0px rgba(0, 0, 0, 0.1);
}
/deep/ .ivu-poptip-body-content-inner {
  color: #fff;
}
/deep/ .ivu-poptip-popper {
  min-width: 70px;
}
/deep/ .ivu-poptip-popper[x-placement^="top"] .ivu-poptip-arrow:after {
  border-top-color: #464c59;
}
/deep/ .ivu-badge-count {
  right: 8px;
}
.list-remark-style {
  font-size: 14px;
  text-align: left;
  margin: 12px 0 0 12px;
  padding: 9px 12px;
  color: #333333;
  min-height: 38px;
  background: #f4f7fc;
  line-height: 20px;
  word-break: break-all;
}
</style>
