<template>
  <div class="me-page-tips">
    <div class="tips">
      <p class="me-status-error">订购说明</p>
      <h3>
        马六甲ERP会员订购和套餐退订说明
      </h3>
      <table data-sort="sortDisabled" class="tiptable">
        <tbody>
          <tr class="firstRow">
            <td
              valign="top"
              rowspan="1"
              colspan="3"
              style="word-break: break-all;"
            >
              <p class="gold">适用对象：马六甲ERP所有注册用户</p>
            </td>
          </tr>
          <tr>
            <td width="139" valign="top" style="word-break: break-all;">
              服务及定价
            </td>
            <td width="725" valign="top" style="word-break: break-all;">
              <p>
                1、免费版
              </p>
              <p v-for="(item, index) in memberLevelList" :key="item.id">
                {{ index + 2 }}、{{ item.name }}/ ( {{ item.amount }}
                <span v-if="item.unit === 'YEAR'">年</span>
                <span v-else-if="item.unit === 'HALFYEAR'">半年</span>
                <span v-else-if="item.unit === 'SEASON'">季</span>
                <span v-else>月</span> )
              </p>
            </td>
            <td width="435" valign="top" style="word-break: break-all;">
              价格会根据相关活动做适当调整
            </td>
          </tr>
          <tr>
            <td
              width="139"
              valign="top"
              rowspan="2"
              colspan="1"
              style="word-break: break-all;"
            >
              订购
            </td>
            <td width="725" valign="top" style="word-break: break-all;">
              <p>
                1.订购功能：和客户所选套餐内容完全一致。
              </p>
              <p>
                支付后显示开始时间：（统一按支付当天北京时间0:00:00）
              </p>
              <p>
                例如9.1号15:00买的，开始时间即为：2021/9/1
                0:00:00，需注意不论用户在何时区都是以北京时间为准。
              </p>
              <p>
                支付后显示结束时间：（订单开始时间+时长+1天）
              </p>
              <p>
                例如9.1号买的30天，结束时间是2021/10/2
                0:00:00，9.1号的剩余时间视作赠送。
              </p>
            </td>
            <td width="435" valign="top" style="word-break: break-all;">
              包括新订单和续订订单，两者只是服务开始时间会不一样，新订单的服务开始时间以支付时间为准，续订订单的服务开始时间是上一订单中服务的结束时间。
            </td>
          </tr>
          <tr>
            <td width="139" valign="top" style="word-break: break-all;">
              <p>
                2、服务升级退费
              </p>
              <p>
                a、月套餐升级成为年套餐计费规则：用户购买并支付对应的年套餐后，原先支付的月套餐费用，按实际支付金额退还（视作赠送）；
              </p>
              <p>
                b、年套餐进阶升级计费规则：按原套餐剩余未使用月份（完整自然月）+已使用月份剩余天数的规则进行退费，新套餐升级后当天立即生效。
              </p>
              <p>
                例如：1月1日订购了年VIP-1套餐，2月10日升级为年VIP-2套餐，系统退回3-12月份的费用+2月剩余天数的实际费用，新套餐支付后立即生效。
              </p>
            </td>
            <td width="725" valign="top" style="word-break: break-all;">
              确认退费标准，按照原服务所在套餐实际支付的单价退费；即原来是9折的就按照9折退，95折就按照95折退。
            </td>
          </tr>
          <tr>
            <td width="139" valign="top" style="word-break: break-all;">
              退订
            </td>
            <td width="725" valign="top" style="word-break: break-all;">
              <p>
                (1)确认退费时长，按自然月退费，不足完整自然月的部分，不退。（注：月/季
                套餐不支持退订）
              </p>
              <p>
                (2)确认退费标准，按照实际支付价格扣除已使用月份数后退还剩余费用。
              </p>
            </td>
            <td width="435" valign="top" style="word-break: break-all;">
              确认退费标准，按照原服务所在套餐实际支付的单价退费；即原来是9折的就按照9折退，95折就按照95折退。
            </td>
          </tr>
          <tr>
            <td
              valign="top"
              rowspan="1"
              colspan="3"
              style="word-break: break-all;"
            >
              <p class="gold">
                用户订购所有套餐均需预先充值旺币，旺币：人民币=1:1，后续订购订单、退订订单仅涉及旺币增减，不涉及真实货币。
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    memberLevelList: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.me-page-tips {
  background-color: #f5f5f5;
  border-radius: 0 0 2px 2px;
  padding: 16px;
  h2 {
    font-size: 16px;
  }
  p {
    line-height: 30px;
  }
}
.tips {
  padding: 15px 0px 15px 0px;
  line-height: 30px;
  h4 {
    font-size: 25px;
  }
  h3 {
    font-size: 22px;
    padding-bottom: 15px;
    text-align: center;
  }
  .gold {
    color: #f59a23;
  }
  .tiptable {
    td,
    th {
      padding: 5px 10px;
      border: 1px solid #ddd;
      vertical-align: middle;
    }
  }
}
</style>
