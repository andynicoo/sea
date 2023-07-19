<template>
  <div>
    <FormTitle value="PPOB" />
    <div class="pageContainer">
      <p class="title">税局邮件详情如下：</p>
      <img
        src="@/assets/images/survey/ppob.svg"
        alt=""
      />
      <p class="title">若您收到以上信息，请按照以下方式回复邮件：</p>
      <p class="title">回复邮件模板内容：</p>
      <div class="subtitle">
        <p>Dear sir or madam,</p>
        <p>
          The address in UK is working as our correspond address,not PPOB.And our PPOB is (写自己的经营地址，中国的即可)，
          please continue the process of my application for VAT registration.Thank you very much.
        </p>
        <p>Kindly regards</p>
      </div>
      <p class="bigTitle redTitle">另外还需补充资料：</p>
      <p class="title">中国地址证明 PPOB (与亚马逊后台经营地址一致）</p>
      <p class="title">1、公司地址租赁合同；</p>
      <p class="title">2、亚马逊后台经营地址信息；</p>
      <p class="title">3 公司经营地址水、电，电话费单据；</p>
      <p class="title">4、体现公司经营地址的采购发票或者合同；</p>
      <p class="title">或者其他足够的代表您真实在运营的相关的证明。</p>
      <p class="title">尽可能提供完成的地址证明材料，并汇总成一份PDF文档</p>
      <p class="title redTitle">将文档命名成：PPOB-公司英文名称</p>
      <p class="title">原邮件发送给税局，等待税局下号回复</p>
    </div>
  </div>
</template>

<script>
import FormTitle from "@/components/WorkOrderComponents/FormTitle";
export default {
  components: {
    FormTitle,
  },
};
</script>

<style lang="less" scoped>
.pageContainer {
  background: #fff;
  padding: 27px;
  .bigTitle {
    font-size: 25px;
    font-weight: bold;
  }
  .subtitle {
    background: #d8d8d8;
    padding: 10px;
    width: 70%;
    p {
      line-height: 19px;
      font-size: 14px;
    }
  }
  .title {
    margin: 10px 0;
    font-weight: bold;
    font-size: 16px;
  }
  .redTitle {
    color: red;
    margin: 10px 0;
  }
}
</style>
