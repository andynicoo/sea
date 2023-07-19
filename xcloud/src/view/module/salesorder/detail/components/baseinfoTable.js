export default {
  name: 'BaseinfoTable',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    info: {
      type: Object,
      default: () => {},
    },
    thCalss: String,
    divCalss: String,
  },

  render(h) {
    const dom = (key) => {
      return this.list.map((element) => {
        let { lable, value, keyName } = element;
        return h(key == 'lable' ? 'th' : 'td', { class: [this.thCalss] }, [
          h(
            'div',
            {
              class: [this.divCalss],
            },
            [
              key == 'lable' ? lable : value,
              keyName === 'refundServiceMoney' && key == 'lable' ?
                <el-tooltip class="item" effect="dark" content="IOSS税号的国家表示其注册的国家" placement="top-start">
                  <div slot="content">
                    “退货金额”会在“应付金额”中进行抵扣<br/>
                    如“换货金额”大于“退货金额”则需客户补差价<br/>
                    小于“退货金额”则会退差价
                  </div>
                  <i class="el-icon-question text-warning"></i>
                </el-tooltip>
                :
                keyName === 'invoiceMoney' && key == 'lable' && this.info.invoiceStatus ?
                <el-tooltip class="item" effect="dark" content="实付金额中不包含发票金额，可在发票管理中查看开票详细"  placement="left-start">

                  <span>税额<i class="el-icon-question text-warning"></i></span>
                </el-tooltip>
                :''
            ]
          ),
        ]);
      });
    };
    return h('table', { class: ['el-table__header'] }, [h('tr', dom('lable')), h('tbody'), dom('value')]);
  },
};
