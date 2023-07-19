<template>
  <div class="submitted-succeeded">
    <img src="./../../images/setting/submitted-success.png" />
    <h2>提交成功</h2>
    <p class="submitted-succeeded-tips">
      请留意短信提醒， 服务进度更新时我们会通过短信通知您（手机号：<span>{{ userMobile }}</span
      >）
    </p>
    <div class="submitted-succeeded-steps">
      <a-steps :current="1" size="small">
        <a-step v-for="(item, index) in stepsList" :key="index" :title="item.nodeName" />
      </a-steps>
      <ul class="submitted-info" v-if="trademarkInfo">
        <li>
          <span>商品名称</span>
          <p>{{ trademarkInfo.title }}</p>
        </li>
        <li>
          <span>商标类型</span>
          <p>{{ trademarkInfo.type }}</p>
        </li>
        <li>
          <span>商标名称</span>
          <img v-if="trademarkInfo.logo" class="trademarkInfo-logo" :src="trademarkInfo.logo[0]" />
          <p>{{ trademarkInfo.name }}</p>
        </li>
      </ul>
    </div>
    <div class="handle-box">
      <Button type="primary" @click="$router.push(backPath)">返回</Button>
    </div>
  </div>
</template>
<script>
import { getServiceWorkflowListNode } from './../../api/user/index';
export default {
  data() {
    return {
      workOrderList: [
        {
          title: '美国商标注册',
          id: '00220727103349305500',
        },
        {
          title: '塞浦路斯VAT注册+申报',
          id: '2347103349305500',
        },
      ],
      userMobile: JSON.parse(localStorage.getItem('objInfo')).userMobile,
      backPath: localStorage.backPath,
      workflowId: localStorage.workflowId,
      trademarkInfo: '',
      stepsList: [],
    };
  },
  created() {
    if (localStorage.trademarkInfo) {
      this.trademarkInfo = JSON.parse(localStorage.trademarkInfo);
    }
    getServiceWorkflowListNode(this.workflowId).then((res) => {
      this.stepsList = res.data;
    });
  },
  beforeDestroy() {
    localStorage.trademarkInfo = '';
  },
};
</script>
<style lang="less" scoped>
.submitted-succeeded {
  .handle-box {
    text-align: center;
    padding-bottom: 30px;
  }
  .ivu-btn-primary {
    min-width: 116px;
    height: 32px;
    background: #3a7fff;
    color: #ffffff;
    border-radius: 2px 2px 2px 2px;
  }
  .ivu-btn-ghost {
    margin-right: 24px;
    min-width: 116px;
    height: 32px;
    background: #ffffff;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #d9d9d9;
    color: #303132;
  }
  background: #fff;
  padding-top: 1px;
  margin: 24px;
  // text-align: center;
  min-height: calc(100vh - 110px);
  > img {
    display: block;
    width: 170px;
    margin: 70px auto 13px;
  }
  h2 {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
  > p {
    color: #919498;
    font-size: 14px;
    text-align: center;
  }
}

.submitted-succeeded-steps {
  margin: 32px auto;
  width: 846px;
  padding: 32px;
  background: #fafafa;
  /deep/ .ant-steps-item-finish .ant-steps-item-icon {
    border-color: #2d8cf0;
    background-color: #2d8cf0;
    > .ant-steps-icon {
      color: #fff;
    }
  }
  // /deep/ .ivu-steps-title {
  //   background: #fafafa;
  // }
  // /deep/ .ivu-steps .ivu-steps-head {
  //   background: #fafafa;
  // }
  // /deep/ .ivu-steps-status-finish {
  //   .ivu-steps-head-inner span,
  //   .ivu-steps-head-inner > .ivu-steps-icon {
  //     border-color: #2d8cf0;
  //     background-color: #2d8cf0;
  //     border-radius: 50%;
  //   }
  // }
}
.submitted-succeeded-tips {
  text-align: center;
  span {
    color: #fbb52c;
  }
}
.submitted-succeeded-tips2 {
  margin: 32px 0 0;
  font-size: 14px;
}
.submitted-info {
  margin-top: 32px;
  background: #fff;
  li {
    border: 1px solid #f0f0f0;
    display: flex;
    margin-bottom: -1px;
    font-size: 14px;
    span {
      background: #fafafa;
      min-width: 227px;
      padding: 16px;
      border-right: 1px solid #f0f0f0;
    }
    p {
      padding: 16px;
      margin-bottom: 0;
    }
  }
}
.trademarkInfo-logo {
  width: 120px;
  padding: 16px 0 16px 16px;
}
</style>
