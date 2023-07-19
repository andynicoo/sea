<template>
  <div>
    <Modal v-model="modalShow"
           :title="titleModel"
           :mask-closable="false"
           @on-visible-change="changeState"
           :footer-hide="true"
           width="800">
      <div v-if="infoType == 'tax'"
           class="infos-content">
        <div class="step">
          <div v-for="(item,index) in registerList"
               :key="index"
               class="rowLine clearfix">
            <p class="time">
              <span>{{item.created_at}}</span>
            </p>
            <img v-if="index==4"
                 src="@/assets/images/follow/2.png"
                 alt />
            <img v-if="index==3"
                 src="@/assets/images/follow/3.png"
                 alt />
            <img v-if="index==2"
                 src="@/assets/images/follow/two.png"
                 alt />
            <img v-if="index==1"
                 src="@/assets/images/follow/4.png"
                 alt />
            <img v-if="index==0"
                 src="@/assets/images/follow/dealing.png"
                 alt />
            <p class="infomation">
              <span class="titleName">{{item.sub_type=='reg'?'开始注册':item.sub_type=='tax_material'?'待上传注册资料':item.sub_type=='tax_ing'?'提交税局':item.sub_type=='tax_ed'?'注册完成':item.sub_type=='tax_submit_reg'?'税局办理中':''}}</span>
              <br />
              <span class="minute">{{item.sub_type=='reg'?'开始注册':item.sub_type=='tax_material'?'待上传注册资料':item.sub_type=='tax_ing'?'资料已提交，待税局审核':item.sub_type=='tax_ed'?'已下发税号文件':item.sub_type=='tax_submit_reg'?'已开始注册，正在办理中':''}}</span>
            </p>
            <p v-if="index!==registerList.length-1"
               class="sline"></p>
          </div>
        </div>
      </div>
      <div v-if="infoType == 'declare'">
        <p class="tips">基本信息:</p>
        <Table :columns="columns1"
               :data="data1"></Table>
        <p class="tips">报税记录</p>
        <Table :columns="columns2"
               :data="data2">
          <template slot="action"
                    slot-scope="{row}">
            <Button type="info"
                    ghost
                    size="small">上传缴税凭证</Button>
          </template>
        </Table>
        <div slot="footer">
          <Button class="footerBt1"
                  type="primary">知道了</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    infoType: {}
  },
  data() {
    return {
      titleModel: "注册税号详情",
      modalShow: true,
      current: 0,
      loadEdit: false,
      registerList: [
        {
          sub_type: "reg",
          created_at: "2020-01-14 14:52:00"
        },
        {
          sub_type: "tax_material",
          created_at: "2020-01-14 15:28:22"
        },
        {
          sub_type: "tax_ing",
          created_at: "2020-01-14 15:31:00"
        },
        {
          sub_type: "tax_submit_reg",
          created_at: "2020-01-14 15:31:21"
        },
        {
          sub_type: "tax_ed",
          created_at: "2020-01-14 15:31:44"
        }
      ],
      columns1: [
        {
          title: "公司名称",
          key: "name"
        },
        {
          title: "报税国家",
          key: "age"
        },
        {
          title: "申报周期",
          key: "address"
        },
        {
          title: "VAT税号",
          key: "name"
        },
        {
          title: "税号生效日期",
          key: "age"
        },
        {
          title: "首次报税日期",
          key: "address"
        }
      ],
      data1: [
        {
          name: "跨税云"
        }
      ],
      columns2: [
        {
          title: "报税次数",
          key: "num"
        },
        {
          title: "报税国家",
          key: "age"
        },
        {
          title: "状态",
          key: "address"
        },
        {
          title: "税率",
          key: "name"
        },
        {
          title: "申报规则",
          key: "age"
        },
        {
          title: "缴纳税金",
          key: "address"
        },
        {
          title: "操作",
          slot: "action"
        }
      ],
      data2: [{ num: 60 }]
    };
  },
  methods: {
    changeState(val) {
      let obj = {
        state: val
      };
      this.$emit("changeState", obj);
    },
    next() {
      if (this.current == 3) {
        this.current = 0;
      } else {
        this.current += 1;
      }
    }
  },
  created() {
    // console.log(this.infoType);
    if (this.infoType == "tax") this.titleModel = "注册税号详情";
    if (this.infoType == "declare") this.titleModel = "报税详情";
  }
};
</script>
<style lang="less" scoped>
&/deep/ .ivu-modal-body,
&/deep/ .ivu-table {
  font-size: 12px;
}
&/deep/ .footerBt1 {
  width: 90px;
  margin: 20px 0;
}

.infos-content {
  background-color: #fafafa;
  padding: 0 10px;
}
.step {
  // margin-bottom: 5px;
  .time {
    float: left;
    font-size: 12px;
    color: #9a9ca1;
    min-width: 110px;
    span {
      padding-right: 0px;
    }
  }

  img {
    float: left;
    margin: 0 12px 38px 24px;
    width: 20px;
    height: 20px;
  }
  .infomation {
    float: left;
    .minute {
      font-size: 12px;
      color: #606366;
      padding-right: 0;
    }
    .titleName {
      font-size: 14px;
      padding-right: 0;
    }
    .ivu-upload {
      display: inline-block;
    }
  }
  .rowLine {
    position: relative;
    .sline {
      position: absolute;
      width: 1px;
      background-color: #dadada;
      height: 40px;
      top: 18px;
      left: 144px;
    }
  }
}
.tips {
  color: #666666;
  font-size: 12px;
  margin: 23px 0 13px 0;
}
</style>