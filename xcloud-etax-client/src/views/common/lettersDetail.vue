<template>
  <div>
    <div class="clearfix title_wait">
      <div class="back" @click="goBack()">
        <Icon type="md-arrow-back" />
        返回列表
      </div>
      <div class="tax_title">
        <span>信件详情</span>
        <Button type="primary" v-if="letterInfo.processStatus === 1" @click="dealwith()">已处理</Button>
      </div>
      <div class="letterContent">
        <Row>
          <Col span="3">
            <span class="title">英文公司名称：</span>
          </Col>
          <Col span="6">
            <span class="content en">{{ letterInfo.companyNameEn || "暂无" }}</span>
          </Col>
          <Col span="3">
            <span class="title">中文公司名称：</span>
          </Col>
          <Col span="6">
            <span class="content">{{ letterInfo.companyNameZh || "暂无" }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="3">
            <span class="title">VAT税号：</span>
          </Col>
          <Col span="6">
            <span class="content">{{ letterDetaiInfo.vatTaxNumber || "暂无" }}</span>
          </Col>
          <Col span="3">
            <span class="title">信件类型：</span>
          </Col>
          <Col span="6">
            <span class="content">
              {{ letterInfo.typeName }}
            </span>
          </Col>
        </Row>
        <Row>
          <Col span="3">
            <span class="title">信件接收时间：</span>
          </Col>
          <Col span="6">
            <span class="content" v-if="letterDetaiInfo.receiveTime">
              {{ letterDetaiInfo.receiveTime.slice(0, 10) || "暂无" }}
            </span>
          </Col>
          <Col span="3">
            <span class="title">状态：</span>
          </Col>
          <Col span="6">
            <span class="content">
              {{ processStatusList[letterDetaiInfo.processStatus] }}
            </span>
          </Col>
        </Row>
        <Row>
          <Col span="3">
            <span class="title">信件内容：</span>
          </Col>
          <Col span="18">
            <span class="content">{{ letterDetaiInfo.processSuggestions || "暂无" }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="3">
            <span class="title">信件文件：</span>
          </Col>
          <Col span="6">
            <span class="content">
              <div class="file">
                <a v-for="(item, index) in fileList" :key="index" :href="item.url" target="_blank">{{item.name}}</a>
              </div>
            </span>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import { detail, dispose } from "@/api/user/letters";
export default {
  props: ["letterInfo", "processStatusList"],
  data() {
    return {
      letterDetaiInfo: {},
      fileList: [],
    };
  },
  mounted() {
    this.detail();
  },
  methods: {
    dealwith() {
      this.$Modal.confirm({
        title: "温馨提示",
        content: "您是否确认处理完成",
        onOk: () => {
          dispose({
            id: this.letterInfo.id,
          }).then((res) => {
            if (res.code == 0) {
              this.$Message.success("处理成功");
              this.$emit("refresh");
            }
          });
        },
      });
    },
    detail() {
      detail(this.letterInfo.id)
        .then((res) => {
          if (res.code == 0) {
            this.letterDetaiInfo = res.data;
            let fileNames = this.letterDetaiInfo.fileNames.split(",");
            let letterFile = this.letterDetaiInfo.letterFile.split(",");
            letterFile.forEach((item, index) => {
              this.fileList.push({
                name: fileNames[index] || item,
                url: item,
              });
            });
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch((err) => console.log(err));
    },
    goBack() {
      this.$emit("back");
    },
  },
};
</script>

<style lang="less" scoped>
.headContent {
  height: 100px;
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
    font-family: "Microsoft Yahei", "PingFang SC", sans-serif;
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
.title_wait {
  margin: 0px 0 11px 0;
  border-bottom: 1px solid #f6f6f6;
  background: #ffffff;
  margin: 20px 10px -2px 24px;
  padding: 20px 30px;
  .back {
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .tax_title {
    color: #2c3e50;
    // font-weight: bold;
    font-size: 18px;
    line-height: 60px;
    border-bottom: 1px solid #f6f6f6;
    margin-bottom: 20px;
    cursor: pointer;
    span {
      color: #333333;
    }
    &::before {
      content: "";
      border-left: 2px solid #16ade9;
      width: 2px;
      height: 14px;
      padding-left: 10px;
    }
  }
}
/deep/ .letterContent {
  .ivu-row {
    padding: 10px 0px;
  }
  .title,
  .content {
    font-size: 14px;
    line-height: 20px;
    .file {
      a {
        margin-right: 20px;
      }
    }
  }
}
.cursor {
  cursor: pointer;
}
/deep/ .title_wait {
  .ivu-page {
    text-align: center;
    padding-top: 30px;
  }
  .ivu-btn {
    float: right;
    margin-top: 7px;
  }
  .ivu-icon {
    float: left;
    margin-top: 3px;
  }
}
</style>
