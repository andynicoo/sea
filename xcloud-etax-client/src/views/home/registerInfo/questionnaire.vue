<template>
  <div>
    <FormTitle value="英国调查问卷" />
    <div class="tip">英国VAT特别说明：跟据英国税局要求，提交注册资料后一般会收到调查问卷，请留意邮箱，收到问卷调查后及时回复。</div>
    <div class="main">
      <p class="tips1">问卷调查回复模板复制：</p>
      <div class="tips2">
        <p class="tipsItem" style="margin-bottom: 10px">Dear sir or madam,</p>
        <p class="tipsItem">Please kindly refer to the attached information.</p>
        <p class="tipsItem">We understand and accept the risks of communicating by email.</p>
        <p class="tipsItem">
          Our company is a Chinese company and we are based in China. The nature of our company is NETP.
        </p>
        <p class="tipsItem" style="margin-bottom: 10px">
          Please have a check and proccess my VAT registration. Thanks a lot.
        </p>
        <p class="tipsItem">Kind regards,</p>
      </div>
      <div style="display: flex; align-items: center">
        <span style="margin-right: 10px; font-size: 16px">问卷资料下载</span>
        <div class="uploadBtn" style="color: #000" @click="download">
          <img src="@/assets/images/hague/kan.png" alt="" />
          证明材料
        </div>
      </div>
      <p class="tips1">根据您所填写资料生成，可作为问卷回复所提供证明材料参考，请在下载后做进一步检查。</p>
      <p class="tips1">
        邮件回复所需要提供的证明材料，需全部以附件形式提供（不得直接发送压缩包，文件须为PDF格式，保证清晰，所提供证明文件若为非英文版本则需提供对应的英文翻译件，文件需以所提供证明文件英文名称命名）。
      </p>
      <!-- <FormItem label="" prop="taxBureauMail" style="margintop: 20px">
        <p style="fontsize: 16px; fontweight: bold">
          <span style="color: red">*</span>
          请问您是否已经完成了税局的调查问卷，请根据您当前的实际情况进行勾选：
          <span style="fontsize: 12px; fontweight: normal; color: red">
            (若产生以下情形外的其他状况，请及时与线上客服/客户经理联系)
          </span>
        </p>
        <RadioGroup v-model="formLeft.taxBureauMail">
          <Radio :disabled="notChange" style="width: 800px" label="1">
            是，已收到税局调查问卷邮件，且已按要求在时限内回复
          </Radio>
          <Radio :disabled="notChange" style="width: 800px" label="2">
            否，不处理税局调查问卷相关事项，已知悉相关风险，并自行承担由此产生的后果，继续进行税号注册
          </Radio>
          <Radio :disabled="notChange" style="width: 800px" label="3">否，未收到税局调查问卷邮件，等待客服持续跟进</Radio>
        </RadioGroup>
      </FormItem> -->
    </div>
  </div>
</template>

<script>
import FormTitle from "@/components/WorkOrderComponents/FormTitle";
export default {
  props: {
    serviceId: String
  },
  components: {
    FormTitle,
  },
  methods: {
    download() {
      this.$util.downFile(this.baseUrl+`/workorder/client/vat/download/gb/${this.serviceId}`, '调查问卷', 'zip')
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  background-color: #fff;
  padding: 30px;
}
.tip {
  background-color: #fff1dd;
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
}
.tips1{
  font-size: 18px;
  font-weight: bold;
}
.tips2{
  background: rgb(216, 216, 216);
  padding: 20px;
  font-size: 16px;
  margin-top: 10px;
}
.uploadBtn{
  cursor: pointer;
  margin: 10px 0;
  border-radius: 5px;
  width: 130px;
  height: 40px;
  border: 1px solid rgb(165, 165, 165);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #cccccc;
  vertical-align: bottom;
  a {
    color: #000;
  }
  img {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    float: left;
  }
}
</style>