// 西班牙电池法
export const columnsEsBattProduct = [
  {
    title: '电池类别',
    key: 'batteryCategory',
    width: 150,
    align: 'center'
  },
  {
    title: '电池产品名称',
    key: 'productName',
    align: 'center'
  },
  {
    title: '电池单个重量',
    key: 'range',
    align: 'center'
  },
  {
    title: '计价单位',
    key: 'unit',
    align: 'center'
  },
  {
    title: '申报产品数量/重量',
    key: 'saleWeight',
    align: 'center'
  },
  {
    title: '申报费用(元)',
    key: 'saleWeightAmount',
    align: 'center'
  },
];


// 西班牙产品
export const productES = [
  {
    name: 'A类 纽扣电池',
    children: [
      {
        name: '锌空纽扣电池',
        children: [
          {
            name: '≤ 2 gr.',
            value: '件'
          },
          {
            name: '> 2 gr.',
            value: '公斤'
          }
        ]
      },
      {
        name: '氧化银纽扣电池',
        children: [
          {
            name: '≤ 3 gr.',
            value: '件'
          },
          {
            name: '> 3-12 gr.',
            value: '件'
          },
          {
            name: '> 12 gr.',
            value: '公斤'
          }
        ]
      },
      {
        name: '碱性纽扣电池',
        children: [
          {
            name: '< 5 gr.',
            value: '件'
          },
          {
            name: '> 5-7 gr.',
            value: '件'
          },
          {
            name: '> 7-8 gr.',
            value: '件'
          },
          {
            name: '> 8 gr.',
            value: '公斤'
          }
        ]
      },
      {
        name: '锂纽扣电池',
        children: [
          {
            name: '≤0,5 gr.',
            value: '公斤'
          },
          {
            name: '0, 51-2 gr.',
            value: '件'
          },
          {
            name: '> 2-7 gr.',
            value: '件'
          },
          {
            name: '> 7 gr.',
            value: '公斤'
          }
        ]
      },
      {
        name: '其他纽扣电池',
        children: [
          {
            name: '默认',
            value: '公斤'
          }
        ]
      }
    ]
  },
  {
    name: 'B类普通电池',
    children: [
      {
        name: '碱性普通电池',
        children: [
          {
            name: '≤ 20 gr.',
            value: '件'
          },
          {
            name: '> 20-50 gr.',
            value: '件'
          },
          {
            name: '51-170 gr.',
            value: '件'
          },
          {
            name: '> 171 gr.',
            value: '公斤'
          }
        ]
      },
      {
        name: '锌碳普通电池',
        children: [
          {
            name: '≤ 20 gr.',
            value: '件'
          },
          {
            name: '> 20-50 gr.',
            value: '件'
          },
          {
            name: '51-170 gr.',
            value: '件'
          },
          {
            name: '≥ 171 gr.',
            value: '公斤'
          }
        ]
      },
      {
        name: '锂普通电池AAA（不可充电）',
        children: [
          {
            name: '默认',
            value: '件'
          }
        ]
      },
      {
        name: '锂普通电池AA（不可充电）',
        children: [
          {
            name: '默认',
            value: '件'
          }
        ]
      },
      {
        name: '锂普通电池（不可充电）',
        children: [
          {
            name: '< 20 gr.',
            value: '件'
          },
          {
            name: '20-40 gr.',
            value: '件'
          },
          {
            name: '≥ 41 gr - 170 gr',
            value: '件'
          },
          {
            name: '> 170 gr',
            value: '公斤'
          }
        ]
      },
      {
        name: '其他普通电池',
        children: [
          {
            name: '默认',
            value: '公斤'
          }
        ]
      }
    ]
  },
  {
    name: 'C类蓄电池（非工业用、非汽车用）',
    children: [
      {
        name: '镍镉蓄电池',
        children: [
          {
            name: '< 20 gr.',
            value: '件',
          },
          {
            name: '> 20-50 gr.',
            value: '件',
          },
          {
            name: '51-170 gr.',
            value: '件',
          },
          {
            name: '171-380 gr.',
            value: '件',
          },
          {
            name: '381-499 gr.',
            value: '件',
          },
          {
            name: '500-999 gr.',
            value: '件',
          },
        ],
      },
      {
        name: '镍金属氢化物蓄电池',
        children: [
          {
            name: '< 20 gr.',
            value: '件',
          },
          {
            name: '> 20-50 gr.',
            value: '件',
          },
          {
            name: '51-170 gr.',
            value: '件',
          },
          {
            name: '171-380 gr.',
            value: '件',
          },
          {
            name: '381-499 gr.',
            value: '件',
          },
          {
            name: '500-999 gr.',
            value: '件',
          },
        ],
      },
      {
        name: '锂蓄电池（可充电）',
        children: [
          {
            name: '< 20 gr.',
            value: '件',
          },
          {
            name: '> 20-50 gr.',
            value: '件',
          },
          {
            name: '51-170 gr.',
            value: '件',
          },
          {
            name: '171 - 380 gr.',
            value: '件',
          },
          {
            name: '381 - 499 gr.',
            value: '件',
          },
          {
            name: '500 - 999 gr.',
            value: '件',
          },
        ],
      },
      {
        name: '铅酸蓄电池',
        children: [
          {
            name: '≤ 1 Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '其他蓄电池',
        children: [
          {
            name: '≤ 1 Kg.',
            value: '公斤',
          },
        ],
      },
    ],
  },
  {
    name: 'D类汽车电池',
    children: [
      {
        name: '铅酸汽车电池Nuevo mercado',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '铅酸汽车电池Reposición',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '锂离子汽车电池Nuevo mercado',
        children: [
          {
            name: '500-999 gr.',
            value: '件',
          },
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '锂离子汽车电池Reposición',
        children: [
          {
            name: '500-999 gr.',
            value: '件',
          },
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
    ],
  },
  {
    name: 'E类蓄电池和工业电池（含镉）',
    children: [
      {
        name: '工业镍镉Nuevo mercado',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '工业镍镉Reposición',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
    ],
  },
  {
    name: 'F类蓄电池和工业电池（含铅）',
    children: [
      {
        name: '工业铅酸Nuevo mercado',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '工业铅酸Reposición',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
    ],
  },
  {
    name: 'G类蓄电池和工业电池（无铅无镉）',
    children: [
      {
        name: '工业碱性Nuevo mercado',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '工业碱性Reposición',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '工业镍氢Nuevo mercado',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '工业镍氢Reposición',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '工业锂离子Nuevo mercado',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '工业锂离子Reposición',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '工业锂离子自动消耗固定式电池Nuevo mercado',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '工业锂离子自动消耗固定式电池Reposición',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '工业锂离子大型固定式电池Nuevo mercado',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '工业锂离子大型固定式电池Reposición',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
    ],
  },
  {
    name: 'H类其他工业类',
    children: [
      {
        name: '其他工业用电池Nuevo mercado',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
      {
        name: '其他工业用电池Reposición',
        children: [
          {
            name: '≥ 1Kg.',
            value: '公斤',
          },
        ],
      },
    ],
  },
];