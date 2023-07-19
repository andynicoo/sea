export default {
  0: [
    {
      title: '卖家账号',
      dataIndex: 'createBy',
      scopedSlots: { customRender: 'createBy' }
    },
    {
      title: '供应商名称',
      dataIndex: 'forwarderName',
      scopedSlots: { customRender: 'forwarderName' }
    },
    {
      title: '订单信息',
      dataIndex: 'productName'
    },
    {
      title: '订单号',
      dataIndex: 'orderNo'
    },
    {
      title: '状态',
      dataIndex: 'orderStatus',
      scopedSlots: { customRender: 'orderStatus' }
    },
    {
      title: '创建时间',
      dataIndex: 'orderTime'
    },
    {
      title: '剩余支付时间',
      dataIndex: 'remainingTime'
    }
  ],
  1: [
    {
      title: '订单编号',
      dataIndex: 'orderNo'
    },
    {
      title: '卖家账号',
      dataIndex: 'createBy',
      scopedSlots: { customRender: 'createBy' }
    },
    {
      title: '供应商名称',
      dataIndex: 'forwarderName',
      scopedSlots: { customRender: 'forwarderName' }
    },
    {
      title: '订单信息',
      dataIndex: 'productName'
    },
    {
      title: '优惠金额',
      dataIndex: 'id',
      scopedSlots: { customRender: 'id' }
    },
    {
      title: '实际支付金额(旺币)',
      dataIndex: 'payAmount'
    },
    {
      title: '类型',
      dataIndex: 'orderType',
      scopedSlots: { customRender: 'orderType' }
    },
    {
      title: '业务ID',
      dataIndex: 'couponId',
      scopedSlots: { customRender: 'couponId' }
    },
    {
      title: '支付渠道',
      dataIndex: 'payChannel'
    },
    {
      title: '分销渠道号',
      dataIndex: 'distributionChannel'
    },
    {
      title: '状态',
      dataIndex: 'orderStatus',
      scopedSlots: { customRender: 'orderStatus' }
    },
    {
      title: '创建时间',
      dataIndex: 'orderTime'
    },
    {
      title: '支付时间',
      dataIndex: 'payTime'
    }
  ],
  3: [
    {
      title: '订单编号',
      dataIndex: 'orderNo'
    },
    {
      title: '卖家账号',
      dataIndex: 'createBy',
      scopedSlots: { customRender: 'createBy' }
    },
    {
      title: '供应商名称',
      dataIndex: 'forwarderName',
      scopedSlots: { customRender: 'forwarderName' }
    },
    {
      title: '订单信息',
      dataIndex: 'productName'
    },
    {
      title: '优惠金额',
      dataIndex: 'id',
      scopedSlots: { customRender: 'id' },
      width: 100
    },
    {
      title: '实际支付金额(旺币)',
      dataIndex: 'payAmount'
    },
    {
      title: '类型',
      dataIndex: 'orderType',
      scopedSlots: { customRender: 'orderType' }
    },
    {
      title: '可退金额(旺币)',
      dataIndex: 'totalRefundAmount',
      scopedSlots: { customRender: 'totalRefundAmount' }
    },
    {
      title: '状态',
      dataIndex: 'orderStatus',
      scopedSlots: { customRender: 'orderStatus' }
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'orderTime'
    // },
    // {
    //   title: '支付时间',
    //   dataIndex: 'payTime'
    // },
    {
      title: '退订时间',
      dataIndex: 'refundApplyTime'
    }

  ]
}
