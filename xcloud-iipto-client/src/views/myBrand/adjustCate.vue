<template>
  <div class="mainContent">
    <div class="title" @click="goMyBread">
      <img src="@/assets/images/infoDetail/jiantou-zuo.png" alt="">
      使用证据信息
    </div>
    <div class="container">
      <!-- 官方翻译内容 -->
      <div class="details-box">
        <div class="box-title">官方翻译内容</div>
        <div class="box-bottom">
          <p>{{serciveInfo.interpretFileContent || ''}}</p>
        </div>
      </div>
      <!-- 客户选择处理方案信息 -->
      <div class="details-box">
        <div class="box-title">客户选择处理方案信息</div>
        <div class="box-bottom">
          <p class="repaly-str">{{replyStr}}</p>
        </div>
      </div>

      <!-- 官方信息 -->
      <div class="details-box">
        <div class="box-title">官方信息</div>
        <div class="box-bottom">
          <p class="mb-10">官方原文信息:</p>
          <p class="mb-10" v-if="serciveInfo.fileUrl">
            <a :href="replaceHttps(serciveInfo.fileUrl)" target="_blank" style="color:#1890ff;">
              <img src="@/assets/images/infoDetail/bainji-blue.svg" alt="">{{initFileNameFunc(serciveInfo.fileUrl)}}
            </a>
          </p>
          <p class="mb-10">审查意见翻译文件:</p>
          <div v-if="setHlepDocument.length > 0">
            <p v-for="(item,index) in setHlepDocument" :key="index">
              <a :href="replaceHttps(item.fileUrl)" target="_blank" style="color:#1890ff;">
                <img src="@/assets/images/infoDetail/bainji-blue.svg" alt="">{{item.oldFileName}}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div class="details-box">
        <div v-if="trademarkCategoryList.length>0">
          <div class="box-title">{{trademarkCate.moduleName}}</div>
          <div class="box-bottom" v-for="(categoryItem,categoryIndex) in trademarkCategoryList" :key="categoryIndex">
            <p>
              <span class="left-item">商标分类：</span>
              <span class="right-item">{{categoryItem.category1Num}}&nbsp;{{categoryItem.category1Name}}</span>
            </p>
            <p>
              <span class="left-item">商标小类名称：</span>
            </p>
            <div class="info-table">
              <table style="width: 100%;text-align: center" cellpadding="0" cellspacing="0">
                <tr class="header">
                  <th style="width:68px;">序号</th>
                  <th style="width:206px;" v-show="!showCNItem(categoryItem.listTrademarkCategory2)">商标小类（中文）</th>
                  <th style="width:428px;">商标小类（英文） </th>
                  <th style="width:428px;" v-if="serciveInfo.countryCode=='JP'">商标小类（日文）</th>
                  <th style="width:428px;" v-if="serciveInfo.countryCode=='JP'">类似群组</th>
                  <th style="width:166px;" v-if="serciveInfo.countryCode=='US'">指定关键词</th>
                  <th style="width:166px;border-right:none;">操作</th>
                </tr>
                <tr v-show=" !(item.category2NameEn == '' || ( item.category2Name && item.category2Name == ''  ) )" v-for="(item,index) in categoryItem.listTrademarkCategory2" :key="index">
                  <td style="width:68px;">{{index+1}}</td>
                  <td style="width:206px;" v-show="item.category2Name">{{item.category2Name}}</td>
                  <td style="width:428px;">{{item.category2NameEn }}</td>
                  <td style="width:428px;" v-if="serciveInfo.countryCode=='JP'">{{item.categoryNameJp || "--"}}</td>
                  <td style="width:428px;" v-if="serciveInfo.countryCode=='JP'">{{item.categoryNameJp || "--"}}</td>
                  <td style="width:166px;" v-if="serciveInfo.countryCode=='US'">
                    <span v-if="item.keyword">{{item.keyword[0]}}</span>
                  </td>
                  <td style="width:166px;border-right:none;">
                    <span @click="deleteRow(item, index, categoryIndex)">删除</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="risk-box" v-if="riskClassifyList.length>0&&serciveInfo.countryCode=='US'">
        <p class="item-label red-tip from risk-title">含有风险小类，需指定关键词</p>
        <div class="tip-box">
          <img src="@/assets/images/infoDetail/tip.svg" alt="">
          <p>
            <span class="color333">风险小类：</span>美国遵循国际尼斯分类，对其申请的商品/服务项目要求具体细化。例如：“计算机周边设备”该项商品在美国是<br>不能被接受，原因是范围太宽泛，需要进一步细化到“键盘、鼠标、扫描仪”等。
          </p>
        </div>
        <Table border class="subclass-table" :data="riskClassifyList" :columns="riskClassCloumns">
        </Table>
      </div>
      <div class="btn-wrap" v-if="serciveInfo.countryCode=='US'">
        <Button @click="goMyBread">取消</Button>
        <Button @click="confirmSure" type="primary" style="margin-left: 5px;">确认</Button>
      </div>

    </div>

  </div>
</template>

<script>
import { evidenceDetail } from "@/api/breadInfoDetail";
import { updateNodeAPI } from "@/api/trademarkRegister/myBread";
export default {
  components: {
    // ConfirmReject
  },
  data() {
    return {
      // 'workflowColumns', 'trademarkCategoryList', 'serciveInfo'
      workflowColumns: [],
      trademarkCategoryList: [],
      serciveInfo: {},
      servicesId: "",
      cureentNodeCode: "",
      checkTwoClassifyList: [],
      oaFileList: [],
      marketHrefList: [],
      replyStr: "",
      riskClassifyList: [],
      riskClassCloumns: [
        {
          title: "风险小类",
          align: "center",
          key: "category2NameEn",
        },
        {
          title: "指定关键词",
          align: "center",
          render: (h, params) => {
            return this.$createElement("div", [
              this.$createElement("Input", {
                props: {
                  value: params.row.keyword[0],
                  placeholder: "请从风险小类{ }内指定一个关键词",
                  maxlength: 40,
                },
                attrs: {
                  // ref: 'no',
                  class: "subClass",
                },
                on: {
                  input: (val) => {
                    this.riskClassifyList[params.row._index].keyword[0] = val;
                    this.checkTwoClassifyList.map((item) => {
                      if (item.category2Num == params.row.category2Num) {
                        item.keyword[0] = val;
                      }
                    });
                  },
                },
                ref: "getRiksInput",
                key: "getRiksInputKey" + this.getRiksInputKey,
              }),
            ]);
          },
        },
      ],
      trademarkCate: {},
      setHlepDocument: [],
      adjustCateIdxKey: Number(this.$route.query.adjustCateIdx),
    };
  },
  created() {
    this.servicesId = this.$route.query.servicesId;
    this.cureentNodeCode = this.$route.query.cureentNodeCode;
    this.getDetailFun();
  },

  methods: {
    //获取工单资料
    getDetailFun() {
      let data = {
        serviceId: this.servicesId,
        nodeCode: this.cureentNodeCode,
      };
      evidenceDetail(data)
        .then((res) => {
          if (res.code == 0) {
            this.workflowColumns = res.data.workflowColumns;
            this.serciveInfo = res.data.trademarkOrderServiceInfoVO;
            this.oaFileList = res.data.fileOaWorkOrderList;

            if (res.data.trademarkOrderServiceInfoVO.interpretFileUrl) {
              const val = JSON.parse(
                res.data.trademarkOrderServiceInfoVO.interpretFileUrl
              );
              this.setHlepDocument = val.length > 0 ? val : [];
            } else {
              this.setHlepDocument = [];
            }

            if (this.serciveInfo.plan && this.serciveInfo.plan.planInfo) {
              this.replyStr = (
                JSON.parse(this.serciveInfo.plan.planInfo) || {}
              ).replyStr;
            }
            this.workOrderId = res.data.trademarkOrderServiceInfoVO.workOrderId;
            this.workOrderNo = res.data.trademarkOrderServiceInfoVO.workOrderNo;
          }
        })
        .finally(() => {
          this.initDataFunc();
          this.initFormData();
        });
    },

    confirmSure() {
      let flag = true;
      this.riskClassifyList.forEach((item, i) => {
        if (!item.keyword[0]) {
          flag = false;
        }
      });
      if (!flag) {
        return this.$Message.error("请填写风险小类关键词");
      }
      let self = this;
      this.trademarkCategoryList.forEach((i, idx) => {
        i.listTrademarkCategory2 = i.listTrademarkCategory2.map(
          (item, index) => {
            if (
              index <= self.riskClassifyList.length - 1 &&
              item.category2Name == self.riskClassifyList[index].category2Name
            ) {
              return self.riskClassifyList[index];
            } else {
              return item;
            }
          }
        );
      });
      let requestData = {
        serviceId: this.servicesId,
        nodeCode: this.cureentNodeCode,
        path: true,
        json: {
          trademarkCategoryCorrection: JSON.stringify(
            this.trademarkCategoryList
          ),
        },
      };

      updateNodeAPI(requestData).then((res) => {
        if (res.code == 0) {
          this.getDetailFun();
          this.$Message.success("操作成功");
          this.goBack();
        }
      });
    },
    initFileNameFunc(fileName) {
      if (!fileName) return "";
      return fileName.slice(fileName.length - 36, fileName.length);
    },
    showCNItem(list) {
      return list && list.findIndex((item) => item.category2Name) == -1
        ? true
        : false;
    },
    // 初始化数据
    initFormData() {
      this.riskClassifyList = [];
      this.trademarkCategoryList.map((item, index) => {
        item.listTrademarkCategory2.map((vv, ii) => {
          if (vv.category2NameEn.indexOf("{") != -1) {
            let class2Obj = {
              category2Name: vv.category2Name,
              category2NameEn: vv.category2NameEn,
              category2Num: vv.category2Num,
              parentCategoryNum: vv.parentCategoryNum,
              keyword: vv.keyword || [""],
            };
            if (this.serciveInfo.countryCode == "JP") {
              class2Obj.categoryNameJp = vv.categoryNameJp;
              class2Obj.similarGroup = vv.similarGroup;
            }
            if (ii < 2) this.riskClassifyList.push(class2Obj);
          }
        });
      });
      this.checkTwoClassifyList =
        this.trademarkCategoryList[0].listTrademarkCategory2;
    },
    goMyBread() {
      this.$router.push("/myBrand");
    },
    getControlData(datalist) {
      let childList = datalist.filter((item) => item.columnPid != ""),
        newData = datalist.filter((item) => item.columnPid == ""),
        nowData = [...newData];
      newData.map((item) => {
        childList.map((vv) => {
          if (
            vv.columnPid == item.columnId &&
            vv.columnOption.includes(item.keyNameValue)
          ) {
            nowData.push(vv);
          }
        });
      });
      return nowData.sort((a, b) => {
        return a.sort - b.sort;
      });
    },
    deleteRow(row, index, categoryIndex) {
      this.$Modal.confirm({
        title: "提示",
        content:
          "<p>确认删除该条小类信息吗？删除后代表注册的商标不包含该条注册小类</p>",
        okText: "删除",
        onOk: () => {
          this.trademarkCategoryList[
            categoryIndex
          ].listTrademarkCategory2.splice(index, 1);
          var requestData = {
            json: {
              trademarkCategoryCorrection: JSON.stringify(
                this.trademarkCategoryList
              ),
            },
            serviceId: this.servicesId,
            nodeCode: this.cureentNodeCode,
          };
          this.initFormData();
          updateNodeAPI(requestData).then((res) => {
            if (res.code == 0) {
              this.$Message.success("操作成功");
              // this.getDetailFun();
            }
          });
        },
        onCancel: () => {
          this.$Message.info("点击了取消");
        },
      });
    },
    //初始化工单资料
    initDataFunc() {
      let newArr = [...this.workflowColumns];
      this.workflowColumns = [];
      newArr.map((item) => {
        let newItem = { ...item };
        item.columns = this.getControlData(item.columns);
        if (newItem.moduleName == "商标分类") {
          if (newItem.columns[0].keyNameValue != "") {
            this.trademarkCategoryList = JSON.parse(
              newItem.columns[0].keyNameValue
            );
            this.trademarkCate = newItem;
          }
        }
        if (newItem.moduleName == "商标使用证据") {
          newItem.columns.map((vv) => {
            if (
              vv.keyName == "marketHref" &&
              JSON.stringify(vv.keyNameValue) != "{}"
            ) {
              this.marketHrefList = JSON.parse(vv.keyNameValue);
            }
          });
        }
        this.workflowColumns.push(item);
      });
      this.fileList = [];
      this.answerFileList = [];
      this.oaFileList.map((item) => {
        let obj = { ...item };
        obj.overdue = false;
        if (new Date(item.officialExpirationDate) < new Date()) {
          obj.overdue = true;
        }
        item.status != 3 && this.fileList.push(obj); //
        if (item.answerFile != "") {
          this.answerFileList.push(item);
        }
      });
    },
    goBack() {
      this.$router.push("/myBrand");
    },
  },
  mounted() {
    // this.getDetailFun()
  },
};
</script>
<style lang="less" scoped>
@import "./component/detail.less";
.repaly-str {
  white-space: pre-wrap;
}
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
.item-label {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-right: 16px;
  span {
    font-size: 14px;
    font-family: PingFangSC;
    color: #999999;
  }
}
.tip-box {
  padding: 14px;
  background-color: #eff9ff;
  font-size: 14px;
  font-family: PingFangSC;
  color: #666;
  line-height: 22px;
  display: inline-block;
  width: 528px;
  vertical-align: top;
  margin-left: 32px;
  p {
    display: inline-block;
  }
  img {
    vertical-align: top;
    margin-top: 2px;
  }
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.45) !important;
  border-radius: 1px;
}
.risk-box {
  margin-top: 24px;
  .tip-box {
    margin: 8px 0 0 0;
    width: 832px;
    .color333 {
      color: #333;
    }
  }
  .subclass-table {
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin-top: 12px;
  }
}
.subclass-table {
  max-width: 838px;
  max-height: 181px;
  overflow-y: scroll;
  /deep/ th {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
}
.subclass-table::-webkit-scrollbar {
  width: 4px;
}
.subclass-table::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.45);
  border-radius: 1px;
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
.btn-wrap {
  margin-top: 20px;
  text-align: center;
}
/deep/ .ivu-table-overflowX {
  overflow-x: hidden;
}
</style>




