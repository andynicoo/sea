export const columns = [
  {
    title: '检索维度',
    dataIndex: 'dimensionName',
    align: 'center',
  },
  {
    title: '检索项',
    dataIndex: 'queryItem',
    align: 'center',
  },
  {
    title: '近似商标',
    dataIndex: 'similarTm',
    align: 'center',
    scopedSlots: { customRender: 'similarTm' },
  },
  {
    title: '近似商标状态',
    dataIndex: 'similarTmStatus',
    align: 'center',
  },
  {
    title: '近似商标类别',
    dataIndex: 'categoryBig',
    ellipsis: true,
    align: 'center',
  },
  // {
  //   title: '相似度',
  //   dataIndex: 'similarTmSimilarity',
  //   align: 'center',
  //   customRender: (val) => val + '%',
  // },
  // {
  //   title: '受理号',
  //   dataIndex: 'remarkNumber',
  //   align: 'center',
  // },
  {
    title: '近似商标申请人',
    dataIndex: 'ownerName',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '近似商标小类',
    dataIndex: 'categorySmall',
    ellipsis: true,
    align: 'center',
  },
];
