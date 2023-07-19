<template>
  <el-dialog width="490px" title="订单确认" :visible.sync="dialogvisible" append-to-body>
    <div>
      <p>辰海云商标、辰海云VAT对应的计算规则如下：</p>
      <span>1、若对应的服务工单已交付，原则上不能再退款，则“退款金额”为0；退款手续费等于商品的实付金额；</span><br />
      <span>2、若对应的服务工单未交付，退款手续费扣除规则如下：</span><br />
      <span class="two-indent"> 2.1、2022年5月1日之后支付成功的订单扣除手续费的规则：</span><br />
      <span class="four-indent"> a、普通客户自付款之日起15天内退款不扣除手续费，可全额退款；16-90天按照商品实付金额扣除10%手续费；91天及以上按照商品实付金额扣除20%手续费；</span><br />
      <span class="four-indent"> b、VIP和KA客户自付款之日起90天内不扣除手续费，可全额退款；91天及以上按照商品实付金额扣除10%手续费；</span><br />
      <span class="two-indent"> 2.2 、2021年7月1日-2022年4月30日支付成功的订单扣除手续费的规则：</span><br />
      <span class="four-indent"> a、普通客户自付款之日起30天内按照商品实付金额扣1.5%手续费；31-90天按照商品实付金额扣5%手续费；91-180天按照商品实付金额扣11.5%手续费；181天以上按照商品实付金额扣除21.5%手续费；</span><br />
      <span class="four-indent"> b、VIP和KA客户自付款之日起90天内不扣除手续费，可全额退款，91天及以上按照商品实付金额扣除10%手续费；</span><br />
      <span class="two-indent"> 2.3、2020年12月1日至 2021年6月30日支付成功的订单，统一按照商品实付金额扣除20%手续费；</span><br />
      <span class="two-indent"> 2.4、2020年11月30日之前支付成功的订单，不扣除任何手续费。</span><br /><br />

      <p>跨标云、跨税云对应的计算规则如下：</p>
      <span>1、若对应的服务工单已交付，原则上不能再退款，则“退款金额”为0；退款手续费等于商品的实付金额；</span><br />
      <span>2、若对应的服务工单未交付，退款手续费扣除规则如下：</span><br />
      <span class="two-indent"> 2.1、2022年5月1日之后支付成功的订单退款扣除手续费规则：</span><br />
      <span class="four-indent"> a、普通客户自付款之日起15天内退款不扣除手续费；16天-90天按照商品实付金额扣除10%手续费，91天及以上按照商品实付金额扣除20%手续费；</span><br />
      <span class="four-indent"> b、VIP和KA客户自付款之日起90天内不扣除手续费，91天及以上按照商品实付金额扣除10%手续费；</span><br />
      <span class="two-indent"> 2.2、2021年9月22日-2022年4月30日支付成功的订单扣除手续费规则：</span><br />
      <span class="four-indent"> a、确认到账日期算30天以内，按照商品实付金额扣1.5%手续费；</span><br />
      <span class="four-indent"> b、确认到账日期算31-90天，按照商品实付金额扣5%手续费；</span><br />
      <span class="four-indent"> c、确认到账日期算91-180天,按照商品实付金额扣11.5%手续费；</span><br />
      <span class="four-indent"> d、确认到账日期算181天及以上，按照商品实付金额扣除21.5%手续费；</span><br />
      <span class="two-indent">2.3、2021年9月21日之前支付成功的订单不扣除手续费。</span><br /><br />

      <p>卖旺科技对应的计算规则如下：</p>
      <span>1、若对应的服务工已交付，原则上不能再退款，则“退款金额”为0；退款手续费等于商品的实付金额；</span><br />
      <span>2、若对应的服务工单未交付，退款手续费扣除规则如下：</span><br />
      <span class="two-indent"> 2.1、2022年5月1日之后支付成功的订单退款扣除手续费规则：</span><br />
      <span class="four-indent"> a、普通客户自付款之日起15天内退款不扣除手续费；16天-90天按照商品实付金额扣除10%手续费，91天及以上按照商品实付金额扣除20%手续费；</span><br />
      <span class="four-indent"> b、VIP和KA客户自付款之日起90天内不扣除手续费，91天及以上按照商品实付金额扣除10%手续费；</span><br />
      <span class="two-indent"> 2.2、2022年4月30日之前支付成功的订单不扣除手续费。</span><br />
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    autoRefundRuleDialog: Boolean,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.autoRefundRuleDialog;
      },
      set(val) {
        this.$emit('update:autoRefundRuleDialog', val);
      },
    },
  },
};
</script>

<style></style>
