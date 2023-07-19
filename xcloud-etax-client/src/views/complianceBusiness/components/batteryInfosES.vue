<template>
  <div class="main">
    <div class="productListTable">
      <Table border :columns="columns" :data="productInfos">
        <template slot-scope="{ row, index }" slot="batteryType">
          <span v-if="isDetails">{{ row.batteryType }}</span>
          <Select
            v-else
            v-model="row.batteryType"
            :disabled="disabled"
            transfer
            clearable
            @on-change="(val) => (productInfos[index].batteryType = val)"
          >
            <Option :value="item" v-for="item in batteryTypeOptions" :key="item">{{ item }}</Option>
          </Select>
        </template>

        <!-- 操作 -->
        <template slot-scope="{ row, index }" slot="action">
          <Tooltip placement="top" content="添加信息栏" v-if="!disabled && !isDetails">
            <img
              src="@/assets/images/compliance/add.svg"
              style="margin-right: 5px; cursor: pointer"
              @click="addProduct"
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
      </Table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'disabled', 'isDetails'],
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
                  '电池类别'
                ),
              ]),
            ]);
          },
          slot: 'batteryType',
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
                  '电池所在设备'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.device);
            }
            return h('Input', {
              props: {
                value: params.row.device,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productInfos[params.index].device = val;
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
                  '单位重量（克）'
                ),
              ]),
            ]);
          },

          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.unitWeight);
            }
            return h('InputNumber', {
              props: {
                value: params.row.unitWeight,
                // size: 'small',
                min: 0,
                precision: 2,
                width: 100,
                'active-change': false,
              },

              style: {
                width: '130px',
              },

              on: {
                'on-change': (val) => {
                  this.productList[params.index].unitWeight = val;
                },
              },
            });
          },
          align: 'center',
          // minWidth: 100,
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
                  '年发货数量（个）'
                ),
              ]),
            ]);
          },

          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.yearDeliveryNum);
            }

            return h('InputNumber', {
              props: {
                value: params.row.yearDeliveryNum,
                // size: 'small',
                min: 0,
                precision: 0,
                width: 100,
                'active-change': false,
              },

              style: {
                width: '130px',
              },

              on: {
                'on-change': (val) => {
                  this.productList[params.index].yearDeliveryNum = val;
                },
              },
            });
          },
          align: 'center',
          // minWidth: 100,
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
                  '电池品牌'
                ),
              ]),
            ]);
          },

          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.batteryBrand);
            }
            return h('Input', {
              props: {
                value: params.row.batteryBrand,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productInfos[params.index].batteryBrand = val;
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
      productInfos: [],
      batteryTypeOptions: [
        '纽扣电池 Pilas de botón',
        '碱性电池 Pilas de alcalina',
        '碳性电池 Pilas de salina',
        '锂电池 Pilas de litio',
        '锂离子电池 Batería de iones de litio',
        '蓄电池 Pilas acumuladores',
        '其他 Otros',
      ],
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length) {
          this.productInfos = val;
        }
      },
      immediate: true,
    },
    productInfos: {
      handler() {
        for (let i = 0; i < this.productInfos.length; i++) {
          let item = this.productInfos[i];
          let requiredKeys = ['batteryType', 'device', 'unitWeight', 'yearDeliveryNum', 'batteryBrand'];
          if (requiredKeys.some((key) => item[key] === '')) {
            this.$emit('input', []);
            return;
          }
        }
        if (!this.productInfos.length) this.addProduct();
        this.$emit('input', this.productInfos);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    remove(index) {
      if (this.disabled) return;
      this.productInfos.splice(index, 1);
    },
    addProduct() {
      if (this.disabled) return;
      this.productInfos.push({
        batteryType: '',
        device: '',
        unitWeight: 0,
        yearDeliveryNum: 0,
        batteryBrand: '',
      });
    },
  },
};
</script>

<style lang="less" scoped>
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
/deep/ .ivu-select {
  width: 130px !important;
  .ivu-select-selection {
    height: 32px !important;
    .ivu-select-placeholder,
    .ivu-select-selected-value {
      height: 32px !important;
      line-height: 32px !important;
      text-align: left;
    }
  }
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
