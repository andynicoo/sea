// 德国weee文案特殊处理
export const columnsHisotryBuyDE = [
  {
    title: '产品类别',
    key: 'productCategory',
    width: 350,
  },
  {
    title: '产品名称 (中文+英文)',
    key: 'productName',
  },
  {
    title: '对应的品牌LOGO',
    key: 'productLogo',
  },
  {
    title: '单边最大尺寸（厘米）',
    key: 'sideMaxSize',
  },
  {
    title: '预估年投放量（千克）',
    key: 'saleWeight',
  },
];

export const columnsHisotryBuy = [
  {
    title: '产品类别',
    key: 'productCategory',
    width: 350,
  },
  {
    title: '产品名称(中/英文)',
    key: 'productName',
  },
  {
    title: '对应的品牌LOGO',
    key: 'productLogo',
  },
  {
    title: '单边最大尺寸/cm',
    key: 'sideMaxSize',
  },
  {
    title: '预计当年销售总量(kg)',
    key: 'saleWeight',
  },
];

export const columnDetail = [
  {
    title: '明细数据',
    align: 'center',
    children: [
      {
        renderHeader: (h, params) => {
          return h('div', [
            h('p', [
              h(
                'span',
                {
                  style: {
                    color: '#333',
                    fontWeight: '600',
                  },
                },
                '产品类别'
              ),
            ]),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.productCategory);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '产品名称（中英文）'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.productName);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '对应的品牌LOGO'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.productLogo);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '单边最大尺寸'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.sideMaxSize);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '本月实际销售总量（吨）'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.saleWeightTon);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '当年实际销售总量（吨）'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.saleTotalWeight);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [h('span', '')]);
        },
        render: (h, params) => {
          return h('span', '');
        },
        align: 'center',
        minWidth: 100,
      },
    ],
  },
];
export const columnsSummary = [
  {
    title: '汇总数据',
    align: 'center',
    children: [
      {
        renderHeader: (h, params) => {
          return h('div', [
            h('p', [
              h(
                'span',
                {
                  style: {
                    color: '#333',
                    fontWeight: '600',
                  },
                },
                '产品类别'
              ),
            ]),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.productCategory);
        },
        align: 'center',
        key: 'category',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '本月实际销售总量（吨）'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.saleWeightTon);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '当年累计实际销售总量（吨）'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.saleTotalWeight);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '已购总量（吨）'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.totalPurchased);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '溢出总量（吨）超出已购产品包含的回收重量'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.excess);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '待补缴金额（元）'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.price);
        },
        align: 'center',
        key: 'price',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h('p', [
              h(
                'span',
                {
                  style: {
                    color: 'red',
                    marginRight: '3px',
                    fontWeight: '600',
                  },
                },
                '*'
              ),
              h(
                'span',
                {
                  style: {
                    color: '#333',
                    fontWeight: '600',
                  },
                },
                '补申报总量（吨）'
              ),
            ]),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.waitBuy);
        },
        align: 'center',
        minWidth: 100,
      },
    ],
  },
];

export const columnsProduct = [
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: 'red',
                marginRight: '3px',
                fontWeight: '600',
              },
            },
            '*'
          ),
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '产品类别'
          ),
        ]),
      ]);
    },
    slot: 'productCategory',
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: 'red',
                marginRight: '3px',
                fontWeight: '600',
              },
            },
            '*'
          ),
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '产品名称（中/英文）'
          ),
        ]),
      ]);
    },
    render: (h, params) => {
      return h('Input', {
        props: {
          value: params.row.productName,
          // size: 'small',
          maxlength: 100,
          disabled: true,
        },
      });
    },
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: 'red',
                marginRight: '3px',
                fontWeight: '600',
              },
            },
            '*'
          ),
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '对应的品牌LOGO'
          ),
        ]),
      ]);
    },
    render: (h, params) => {
      return h('Input', {
        props: {
          value: params.row.productLogo,
          // size: 'small',
          maxlength: 500,
          disabled: true,
        },
      });
    },
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: 'red',
                marginRight: '3px',
                fontWeight: '600',
              },
            },
            '*'
          ),
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '单边最大尺寸/cm'
          ),
        ]),
      ]);
    },
    render: (h, params) => {
      return h('Input', {
        props: {
          value: params.row.sideMaxSize,
          // size: 'small',
          maxlength: 500,
          disabled: true,
        },
      });
    },
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: 'red',
                marginRight: '3px',
                fontWeight: '600',
              },
            },
            '*'
          ),
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '实际本月销售总量（kg）'
          ),
        ]),
      ]);
    },
    slot: 'saleWeight',
    // render: (h, params) => {
    //   return h('Input', {
    //     props: {
    //       value: Number(params.row.saleWeight),
    //       min: 0,
    //       type: 'number',
    //       activeChange: false,
    //       precision: 2,
    //       disabled: this.disabled,
    //     },

    //     style: {
    //       width: '100%',
    //     },

    //     on: {
    //       input: (val) => {
    //         this.productList[params.index].saleWeight = val;
    //       },
    //     },
    //   });
    // },
    align: 'center',
    props: {min: 0},
    minWidth: 100,
  },
];

// 德国文案特殊处理
export const columnsProductDE = [
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: 'red',
                marginRight: '3px',
                fontWeight: '600',
              },
            },
            '*'
          ),
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '产品类别'
          ),
        ]),
      ]);
    },
    slot: 'productCategory',
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: 'red',
                marginRight: '3px',
                fontWeight: '600',
              },
            },
            '*'
          ),
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '产品名称 (中文+英文)'
          ),
        ]),
      ]);
    },
    render: (h, params) => {
      return h('Input', {
        props: {
          value: params.row.productName,
          // size: 'small',
          maxlength: 100,
          disabled: true,
        },
      });
    },
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: 'red',
                marginRight: '3px',
                fontWeight: '600',
              },
            },
            '*'
          ),
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '对应的品牌LOGO'
          ),
        ]),
      ]);
    },
    render: (h, params) => {
      return h('Input', {
        props: {
          value: params.row.productLogo,
          // size: 'small',
          maxlength: 500,
          disabled: true,
        },
      });
    },
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: 'red',
                marginRight: '3px',
                fontWeight: '600',
              },
            },
            '*'
          ),
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '单边最大尺寸（厘米）'
          ),
        ]),
      ]);
    },
    render: (h, params) => {
      return h('Input', {
        props: {
          value: params.row.sideMaxSize,
          // size: 'small',
          maxlength: 500,
          disabled: true,
        },
      });
    },
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: 'red',
                marginRight: '3px',
                fontWeight: '600',
              },
            },
            '*'
          ),
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '实际本月销售总量（kg）'
          ),
        ]),
      ]);
    },
    slot: 'saleWeight',
    // render: (h, params) => {
    //   return h('Input', {
    //     props: {
    //       value: Number(params.row.saleWeight),
    //       min: 0,
    //       type: 'number',
    //       activeChange: false,
    //       precision: 2,
    //       disabled: this.disabled,
    //     },

    //     style: {
    //       width: '100%',
    //     },

    //     on: {
    //       input: (val) => {
    //         this.productList[params.index].saleWeight = val;
    //       },
    //     },
    //   });
    // },
    align: 'center',
    props: {min: 0},
    minWidth: 100,
  },
];

export const columnBatDetail = [
  {
    // title: '明细数据',
    align: 'center',
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '申报电池产品信息'
          ),
        ]),
      ]);
    },
    children: [
      {
        renderHeader: (h, params) => {
          return h('div', [
            h('p', [
              h(
                'span',
                {
                  style: {
                    color: '#333',
                    fontWeight: '600',
                  },
                },
                '电池类型'
              ),
            ]),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.batteryType);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '材料类型'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.materialType);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '是否可以充电'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.isCharge);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '单位重量'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.unitWeight);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '单位重量(1KG以上电池需要填写)/KG'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.batteryWeight);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '当年实际发货数量/个'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.yearDeliveryNum);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [h('span', '电池品牌')]);
        },
        render: (h, params) => {
          return h('span', params.row.batteryBrand);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [h('span', '状态')]);
        },
        render: (h, params) => {
          return h('span', params.row.flagDeclare == 1 ? '已超出' : '已购');
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [h('span', '')]);
        },
        render: (h, params) => {
          return h('span', '');
        },
        align: 'center',
        minWidth: 100,
      },
    ],
  },
];

export const columnsBatSummary = [
  {
    // title: '汇总数据',
    align: 'center',
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '汇总数据'
          ),
        ]),
      ]);
    },
    children: [
      {
        renderHeader: (h, params) => {
          return h('div', [
            h('p', [
              h(
                'span',
                {
                  style: {
                    color: '#333',
                    fontWeight: '600',
                  },
                },
                '电池类型'
              ),
            ]),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.batteryType);
        },
        align: 'center',
        key: 'category',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '材料类型'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.materialType);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '是否可以充电'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.isCharge);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '单位重量'
            ),
          ]);
        },
        render: (h, params) => {
          return h('div', [
            h('span', params.row.unitWeight),
            h('span', params.row.unitWeight == '1KG以上' ? '/' : ''),
            h('span', params.row.batteryWeight),
          ]);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '当年实际发货数量/个'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.yearDeliveryNum);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '电池单价：小电池(元/个）大电池（元/kg)'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.batteryPrice);
        },
        align: 'center',
        key: 'batteryPrice',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h('p', [
              h(
                'span',
                {
                  style: {
                    color: 'red',
                    marginRight: '3px',
                    fontWeight: '600',
                  },
                },
                '*'
              ),
              h(
                'span',
                {
                  style: {
                    color: '#333',
                    fontWeight: '600',
                  },
                },
                '已购金额/元'
              ),
            ]),
          ]);
        },
        slot: 'buyAmount',
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h('p', [
              h(
                'span',
                {
                  style: {
                    color: 'red',
                    marginRight: '3px',
                    fontWeight: '600',
                  },
                },
                '*'
              ),
              h(
                'span',
                {
                  style: {
                    color: '#333',
                    fontWeight: '600',
                  },
                },
                '实需申报金额/元'
              ),
            ]),
          ]);
        },

        slot: 'declarePrice',
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h('p', [
              h(
                'span',
                {
                  style: {
                    color: 'red',
                    marginRight: '3px',
                    fontWeight: '600',
                  },
                },
                '*'
              ),
              h(
                'span',
                {
                  style: {
                    color: '#333',
                    fontWeight: '600',
                  },
                },
                '溢出需补缴金额/元'
              ),
            ]),
          ]);
        },
        slot: 'sumBeyondbuyDaAmount',
        align: 'center',
        minWidth: 100,
      },
    ],
  },
];

export const columnBatHisDetail = [
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '产品中文名称'
          ),
        ]),
      ]);
    },
    render: (h, params) => {
      return h('span', params.row.productName);
    },
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h('p', [
          h(
            'span',
            {
              style: {
                color: '#333',
                fontWeight: '600',
              },
            },
            '电池类型'
          ),
        ]),
      ]);
    },
    render: (h, params) => {
      return h('span', params.row.batteryType);
    },
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h(
          'span',
          {
            style: {
              color: '#333',
              fontWeight: '600',
            },
          },
          '材料类型'
        ),
      ]);
    },
    render: (h, params) => {
      return h('span', params.row.materialType);
    },
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h(
          'span',
          {
            style: {
              color: '#333',
              fontWeight: '600',
            },
          },
          '是否可以充电'
        ),
      ]);
    },
    render: (h, params) => {
      return h('span', params.row.isCharge);
    },
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [
        h(
          'span',
          {
            style: {
              color: '#333',
              fontWeight: '600',
            },
          },
          '单位重量'
        ),
      ]);
    },
    render: (h, params) => {
      return h('div', [
        h('span', params.row.unitWeight),
        h('span', params.row.unitWeight == '1KG以上' ? '/' : ''),
        ('span', params.row.batteryWeight),
      ]);
    },
    align: 'center',
    minWidth: 100,
  },

  {
    renderHeader: (h, params) => {
      return h('div', [
        h(
          'span',
          {
            style: {
              color: '#333',
              fontWeight: '600',
            },
          },
          '年实际发货数量/个'
        ),
      ]);
    },
    render: (h, params) => {
      return h('span', params.row.yearDeliveryNum);
    },
    align: 'center',
    minWidth: 100,
  },
  {
    renderHeader: (h, params) => {
      return h('div', [h('span', '电池品牌')]);
    },
    render: (h, params) => {
      return h('span', params.row.batteryBrand);
    },
    align: 'center',
    minWidth: 100,
  },
];

export const columnsPackSummary = [
  {
    title: '汇总数据',
    align: 'center',
    children: [
      {
        renderHeader: (h, params) => {
          return h('div', [
            h('p', [
              h(
                'span',
                {
                  style: {
                    color: '#333',
                    fontWeight: '600',
                  },
                },
                'Material type 材料类别'
              ),
            ]),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.cateName);
        },
        align: 'center',
        key: 'category',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '当年实际出货总总量（Kg）'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.actualWeight);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '已购重量（Kg）'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.buyWeight);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '溢出重量（Kg）'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.overflowWeight);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '需补缴金额（元）'
            ),
          ]);
        },
        render: (h, params) => {
          const res = params.row.payAmount >= 0 ? params.row.payAmount : '待人工核算';
          return h('span', res);
        },
        align: 'center',
        minWidth: 100,
      },
      {
        renderHeader: (h, params) => {
          return h('div', [
            h(
              'span',
              {
                style: {
                  color: '#333',
                  fontWeight: '600',
                },
              },
              '补申报重量（Kg）'
            ),
          ]);
        },
        render: (h, params) => {
          return h('span', params.row.decalareWeight);
        },
        align: 'center',
        key: 'decalareWeight',
        minWidth: 100,
      },
    ],
  },
];

export const columnsFrPackSummary = [
  {
    title: '申报信息',
    align: 'center',
    children: [
      {
        title: '产品系列',
        key: 'parentProductCategoryName',
        minWidth: 100,
      },
      {
        title: '产品',
        key: 'productCategoryName',
        minWidth: 100,
      },
      {
        title: '包装数量（最外层包装数CSU）',
        key: 'outerPackageQuantity',
        minWidth: 100,
      },
      {
        title: '包装数量（最小包装数CU）',
        key: 'inPackageQuantity',
        minWidth: 100,
      },
      {
        title: '回收官费（欧元）',
        // key: 'payAmount',
        render: (h, params) => {
          const res = params.row.payAmount >= 0 ? params.row.payAmount : '待人工核算';
          return h('span', res);
        },
        minWidth: 100,
      },
    ],
  },
];

export const columnsFrPackSummaryNoInpack = [
  {
    title: '申报信息',
    align: 'center',
    children: [
      {
        title: '产品系列',
        key: 'parentProductCategoryName',
        minWidth: 100,
      },
      {
        title: '产品',
        key: 'productCategoryName',
        minWidth: 100,
      },
      {
        title: '包装数量（最外层包装数CSU）',
        key: 'outerPackageQuantity',
        minWidth: 100,
      },
      {
        title: '回收官费（欧元）',
        key: 'payAmount',
        minWidth: 100,
      },
    ],
  },
];

export const columnsFrBattSummary = [
  {
    title: '申报信息',
    align: 'center',
    children: [
      {
        title: '生成商属性',
        key: 'manufacturerAttr',
      },
      {
        title: '电池是否和产品组合售卖',
        key: 'combination',
      },
      {
        title: '是否家用电池',
        key: 'household',
      },
      {
        title: '充电类型',
        key: 'chargingType',
      },
      {
        title: '电池类型',
        key: 'batteryType',
      },
      {
        title: '单个电池的重量（g）',
        key: 'weight',
      },
      {
        title: '单个产品所含电池数量',
        key: 'number',
      },
      {
        title: '产品数量',
        key: 'productNum',
      },
      {
        title: '总费用（欧元）',
        key: 'amount',
        render: (h, params) => {
          const res = params.row.amount >= 0 ? params.row.amount : '待人工核算';
          return h('span', res);
        },
      },
    ],
  },
];

export const columnsFrColBattSummary = [
  {
    title: '申报信息',
    align: 'center',
    children: [
      {
        title: '产品种类',
        key: 'productType',
      },
      {
        title: '电池是否和产品组合售卖',
        key: 'combination',
      },
      {
        title: '充电类型',
        key: 'chargingType',
      },
      {
        title: '电池类型',
        key: 'batteryType',
      },
      {
        title: '单个电池的重量（g）',
        key: 'weight',
      },
      {
        title: '单个产品所含电池数量',
        key: 'number',
      },
      {
        title: '产品数量',
        key: 'productNum',
      },
      {
        title: '总费用（欧元）',
        key: 'amount',
        render: (h, params) => {
          const res = params.row.amount >= 0 ? params.row.amount : '待人工核算';
          return h('span', res);
        },
      },
    ],
  },
];
