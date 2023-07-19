export function setBainfoTableOneList(info, self) {
  const { formatQianFenWei } = self.$options.filters;
  return [
    {
      lable: '销售订单号',
      value: info.orderNo + `${info.paymentBatchNo ? '批' : ''}`,
    },
    {
      lable: '客户手机号',
      value: info.userMobile,
    },
    {
      lable: '销售人员',
      value: info.attributionName,
    },
    {
      lable: '订单金额',
      value: '￥' + formatQianFenWei(info.orderMoney) + '元',
    },
    {
      lable: '优惠金额',
      value: '￥' + formatQianFenWei(info.discountMoney > 0 ? info.discountMoney : 0) + '元',
    },
    {
      lable: '换货金额',
      value: '￥' + formatQianFenWei(info.exchangeMoney) + '元',
      hidden: info.orderTypeEn !== 'EXCHANGE',
    },
    {
      lable: '应付金额',
      value: '￥' + formatQianFenWei(info.orderPaymentMoney) + '元',
    },
    {
      lable: '实付金额',
      value: `￥${formatQianFenWei(info.orderPaidMoney)}元`,
    },
    {
      lable: '剩余尾款',
      value: '￥' + formatQianFenWei(info.unPaidMoney) + '元',
    },
  ].filter((item) => !item.hidden);
}

export function setBainfoTableTowList(info, self) {
  const { formatQianFenWei, filterSource, filterPaymentType, filterName } = self.$options.filters;

  return [
    {
      lable: '订单来源',
      value: info.orderSource,
    },
    {
      lable: '付款类型',
      value: info.paymentType,
    },
    {
      lable: '客户成功',
      value: info.customerSuccessName,
    },
    {
      lable: '订单类型',
      value: info.orderType,
    },
    {
      lable: '是否申请开票',
      value: info.invoiceStatus ? '已申请' : '未申请',
    },
    {
      lable: '合同状态',
      value: info.contractStatus,
    },
    {
      lable: '是否续费',
      value: info.renewFlag ? '是' : '否',
    },
    {
      lable: '订单备注',
      value: info.remark,
    },
    {
      lable: '退货金额（抵扣）',
      value: '￥' + formatQianFenWei(info.refundServiceMoney) + '元',
      hidden: info.orderTypeEn !== 'EXCHANGE',
      keyName: 'refundServiceMoney',
    },
    {
      label: info.invoiceStatus ? '开票金额' : '',
      value: info.invoiceStatus ? '￥' + formatQianFenWei(info.invoiceMoney) + '元' : '',
      hidden: !info.invoiceStatus,
      keyName: 'invoiceMoney',
    },
  ].filter((item) => !item.hidden);
}
