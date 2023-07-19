import moment from 'moment'
export default {
  data() {
    return {
      conditions1: [
        {
          key: 1,
          label: '按天'
        },
        {
          key: 2,
          label: '按周'
        },
        {
          key: 3,
          label: '按月'
        }
      ],
      conditions21: [
        {
          key: 1,
          label: '次日'
        },
        {
          key: 7,
          label: '7日'
        },
        {
          key: 14,
          label: '14日'
        },
        {
          key: 30,
          label: '30日'
        },
        {
          key: 60,
          label: '60日'
        }
      ],
      conditions22: [
        {
          key: 1,
          label: '次周'
        },
        {
          key: 8,
          label: '8周'
        },
        {
          key: 12,
          label: '12周'
        },
        {
          key: 24,
          label: '24周'
        }
      ],
      conditions23: [
        {
          key: 1,
          label: '次月'
        },
        {
          key: 6,
          label: '6月'
        },
        {
          key: 12,
          label: '12月'
        },
        {
          key: 24,
          label: '24月'
        }
      ],
      conditions3: [
        {
          key: 1,
          label: '留存'
        },
        {
          key: 2,
          label: '流失'
        }
      ],
      ranges: {
        今日: [moment(), moment()],
        昨日: [
          moment()
            .startOf('day')
            .subtract(1, 'days'),
          moment()
            .startOf('day')
            .subtract(1, 'days')
        ],
        本周: [moment().startOf('week'), moment()],
        上周: [
          moment()
            .startOf('week')
            .subtract('days', 7),
          moment()
            .startOf('week')
            .subtract('days', 1)
        ],
        本月: [moment().startOf('month'), moment()],
        上月: [
          moment()
            .month(moment().month() - 1)
            .startOf('month'),
          moment()
            .month(moment().month() - 1)
            .endOf('month')
        ],
        今年: [
          moment()
            .year(moment().year() - 1)
            .startOf('year'),
          moment()
        ],
        去年: [
          moment()
            .year(moment().year() - 1)
            .startOf('year'),
          moment()
            .year(moment().year() - 1)
            .endOf('year')
        ],
        过去7天: [
          moment()
            .startOf('day')
            .subtract(6, 'days'),
          moment().endOf('day')
        ],
        过去14天: [
          moment()
            .startOf('day')
            .subtract(14, 'days'),
          moment().endOf('day')
        ],
        过去30天: [
          moment()
            .startOf('day')
            .subtract(29, 'days'),
          moment().endOf('day')
        ],
        过去60天: [
          moment()
            .startOf('day')
            .subtract(59, 'days'),
          moment().endOf('day')
        ],
        过去90天: [
          moment()
            .startOf('day')
            .subtract(89, 'days'),
          moment().endOf('day')
        ],
        过去180天: [
          moment()
            .startOf('day')
            .subtract(179, 'days'),
          moment().endOf('day')
        ]
      },
      originColumns: [
        {
          title: '总体',
          width: 250,
          dataIndex: 'byValue',
          fixed: 'left',
          scopedSlots: { customRender: 'byValue' }
        },
        {
          title: '总人数',
          dataIndex: 'totalPeople',
          width: 150,
          customRender: (text) => {
            return <div class="text-maAccount" style="padding:0px 16px">{text}</div>
          },
          fixed: 'left'
        }
      ],
      columnsTemp: {
        title: 'xx',
        width: 200,
        dataIndex: 'xx',
        customRender: (text) => {
          return <div class="text-maAccount">{text}--22</div>
        }
      }
    }
  },
  mounted() {},
  methods: {}
}
