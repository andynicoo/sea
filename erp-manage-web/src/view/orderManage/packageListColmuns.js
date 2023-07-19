export default {
  1: [
    {
      title: '虾皮订单号',
      dataIndex: 'platformOrderNo'
    },
    {
      title: '代打包时间',
      dataIndex: 'createTime'
    },
    {
      title: '货代商名称',
      dataIndex: 'forwarderName'
    },
    {
      title: '仓库名称',
      dataIndex: 'warehouseName'
    },
    {
      title: '出库总费用',
      dataIndex: 'packTotalFee'
    },
    {
      title: '出库时间',
      dataIndex: 'deliveredTime'
    },
    {
      title: '卖家手机号',
      dataIndex: 'memberTel'
    },
    {
      title: '用户来源',
      dataIndex: 'source'
    },
    {
      title: '邀请编号',
      dataIndex: 'invitationCode'
    },
    {
      title: '是否渠道客户',
      dataIndex: 'isInvita',
      scopedSlots: { customRender: 'isInvita' }
    }
  ],
  2: [
    {
      title: '虾皮订单号',
      dataIndex: 'platformOrderNo'
    },
    {
      title: '代打包时间',
      dataIndex: 'createTime'
    },
    {
      title: '货代商名称',
      dataIndex: 'forwarderName'
    },
    {
      title: '仓库名称',
      dataIndex: 'warehouseName'
    },
    {
      title: '卖家手机号',
      dataIndex: 'memberTel'
    },
    {
      title: '用户来源',
      dataIndex: 'source'
    },
    {
      title: '邀请编号',
      dataIndex: 'invitationCode'
    },
    {
      title: '是否渠道客户',
      dataIndex: 'isInvita',
      scopedSlots: { customRender: 'isInvita' }
    }
  ]
}
