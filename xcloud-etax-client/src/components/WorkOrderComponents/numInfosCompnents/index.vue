<template>
  <div class="main">
    <div class="productListTable">
      <Table border :columns="columns" :data="productList">
        <template slot-scope="{ row, index }" slot="action">
          <Tooltip placement="top" content="添加信息栏" v-if="!disabled && !isDetails">
            <img
              src="@/assets/images/compliance/add.svg"
              style="margin-right: 5px; cursor: pointer"
              @click="addProduct(index)"
            />
          </Tooltip>
          <Tooltip placement="top" content="删除信息栏" transfer v-if="!disabled && !isDetails">
            <img
              src="@/assets/images/compliance/cut.svg"
              @click="remove(index)"
              style="cursor: pointer"
              v-if="index != 0"
            />
          </Tooltip>
        </template>
        <template slot="taxDate" slot-scope="{ row, index }">
          <div>
            <DatePicker
              type="date"
              placement="top"
              v-model="row.payTime"
              @on-change="changeFinanceData($event, index)"
              placeholder="税号生效日期"
            ></DatePicker>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'countryNameZh', 'disabled', 'isDetails'],
  data() {
    return {
      columns: [
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
                  '税号所在国'
                ),
                h(
                  'p',
                  {
                    style: {
                      color: '#F13D23',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                    },
                  },
                  '(国家英文全拼,如France)'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.taxNumCountry);
            }
            return h('Input', {
              props: {
                value: params.row.taxNumCountry,
                // size: 'small',
                maxlength: 100,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].taxNumCountry = val;
                },
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
                  '税号'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.vatTaxNumber);
            }
            return h('Input', {
              props: {
                value: params.row.vatTaxNumber,
                // size: 'small',
                maxlength: 100,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].vatTaxNumber = val;
                },
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
                  '税号生效日期'
                ),
                h(
                  'p',
                  {
                    style: {
                      color: '#F13D23',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                    },
                  },
                  '年-月-日 ，例如2022-06-06'
                ),
              ]),
            ]);
          },
          // slot: "taxDate",
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.taxEffectiveDate);
            }
            return h('Input', {
              props: {
                value: params.row.taxEffectiveDate,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].taxEffectiveDate = val;
                },
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
                  '负责欧盟市场物流的公司或负责人名称'
                ),
                h(
                  'p',
                  {
                    style: {
                      color: '#F13D23',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                    },
                  },
                  '（英文,没有填N/A）'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.logisticsCompanyNameEn);
            }
            return h('Input', {
              props: {
                value: params.row.logisticsCompanyNameEn,

                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].logisticsCompanyNameEn = val;
                },
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
                      color: '#333',
                      fontWeight: '600',
                    },
                  },
                  '物流公司地址'
                ),
                h(
                  'p',
                  {
                    style: {
                      color: '#F13D23',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                    },
                  },
                  '（英文,没有填N/A）'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.logisticsCompanyAddressEn);
            }
            return h('Input', {
              props: {
                value: params.row.logisticsCompanyAddressEn,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].logisticsCompanyAddressEn = val;
                },
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
                      color: '#333',
                      fontWeight: '600',
                    },
                  },
                  '负责欧盟市场清关的公司或负责人名称'
                ),
                h(
                  'p',
                  {
                    style: {
                      color: '#F13D23',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                    },
                  },
                  '（英文,没有填N/A）'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.clearCompanyNameEn);
            }
            return h('Input', {
              props: {
                value: params.row.clearCompanyNameEn,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].clearCompanyNameEn = val;
                },
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
                      color: '#333',
                      fontWeight: '600',
                    },
                  },
                  '清关公司地址'
                ),
                h(
                  'p',
                  {
                    style: {
                      color: '#F13D23',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                    },
                  },
                  '（英文,没有填N/A）'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.clearCompanyAddressEn);
            }
            return h('Input', {
              props: {
                value: params.row.clearCompanyAddressEn,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].clearCompanyAddressEn = val;
                },
              },
            });
          },
          align: 'center',
          minWidth: 100,
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 100,
        },
      ],
      productList: [],
      OldproductList: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length) {
          this.productList = val;
        }
      },
      immediate: true,
    },
    productList: {
      handler() {
        for (let i = 0; i < this.productList.length; i++) {
          let item = this.productList[i];
          let verify = this.verifyEmpty(item);
          console.log('verify', verify);
          if (!verify.flag && !verify.isEmpty) {
            this.$emit('input');
            // this.$Message.warning("其他欧盟国家税号信息表资料填写不齐全,请补充信息");
            return;
          }
          if (verify.flag) {
            this.$emit('input', []);
            return;
          }
        }
        if (!this.productList.length) this.addProduct();
        this.$emit('input', this.productList);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    verifyEmpty(obj) {
      let arr = Object.values(obj);
      let flag = arr.every(function(item) {
        return item == '';
      });
      let isEmpty = arr.every(function(item) {
        return item != '';
      });
      let params = {
        flag,
        isEmpty,
      };
      return params;
    },
    remove(index) {
      if (this.disabled) return;
      this.productList.splice(index, 1);
    },
    addProduct(index) {
      if (this.productList.length > 3) {
        this.$Message.warning('最多只能添加四条');
        return;
      }
      if (this.disabled) return;
      this.productList.push({
        taxNumCountry: '',
        vatTaxNumber: '',
        taxEffectiveDate: '',
        logisticsCompanyNameEn: '',
        logisticsCompanyAddressEn: '',
        clearCompanyNameEn: '',
        clearCompanyAddressEn: '',
      });
    },

    changeFinanceData(val, i) {
      this.financeData[i][type] = val;
      // if (type == "payTime") {
      //   this.financeData[i][type] = val + " 00:00:00";
      // } else {

      // }
    },
  },
};
</script>

<style lang="less" scoped>
// /deep/ .ivu-table-wrapper {
//   position: relative;
//   overflow: auto !important;
// }
// .main {
//   padding: 20px;
// }
/deep/ .ivu-input {
  font-size: 14px !important;
}
.productListTable {
  /deep/ .ivu-upload-select {
    width: 100px !important;
  }
}
/deep/ .ivu-input {
  display: inline-block;
  width: 130px !important;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 14px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
/deep/ .ivu-table-header {
  th {
    font-weight: 600;
    color: #333;
  }
}
/deep/ .ivu-table {
  td {
    padding-top: 16px;
    padding-bottom: 16px;
  }
}
/deep/ .ivu-input {
  width: 120px;
}

/deep/ .ivu-upload {
  cursor: pointer;
  .inner {
    width: 100px !important;
    height: 32px;
    background: #16ade9 !important;
    border-radius: 2px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    img {
      width: 20px;
      height: 20px;
      margin-top: 0px;
    }
    .uplad-word {
      color: #ffffff;
    }
  }
}
.out-img-box {
  .img-box {
    position: relative;
    text-align: center;
    padding-top: 8px;
    width: 100%;
    .show-pdf {
      color: #16ade9;
    }
    button {
      width: 0px;
      padding: 0px;
      border: none;
      position: absolute;
      top: 8px;
      height: 0px;
      z-index: 1;
      margin-left: 3px;
      img.closeImg {
        width: 13px;
        height: 13px;
      }
    }
  }
}
.upload-tip {
  font-size: 14px;
  color: #cccccc;
  vertical-align: bottom;
  margin-right: 16px;
  a {
    color: #16ade9;
  }
  img {
    width: 16px;
    height: 16px;
    margin-top: 9px;
    float: left;
    margin-right: 3px;
  }
  display: inline-block;
}
.red-tip {
  margin: 20px 0;

  font-size: 14px;
  font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
  font-weight: 500;
  color: #1890ff;
  line-height: 20px;
}
.footer {
  margin-top: 20px;
  width: 100%;
  text-align: center;
}
.download {
  color: #02a7f0;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline-block;
}
</style>
