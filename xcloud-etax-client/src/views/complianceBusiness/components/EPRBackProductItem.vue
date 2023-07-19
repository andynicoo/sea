<template>
  <div class="main">
    <div class="productListTable">
      <Table border :columns="columns" :data="productList">
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
                  'Product Name/产品名称'
                ),
              ]),
              h(
                'p',
                {
                  style: {
                    color: '#F13D23',
                    fontSize: '12px',
                    fontWeight: '500',
                  },
                },
                '（如：loudspeaker box/音响）'
              ),
              h(
                'p',
                {
                  style: {
                    color: '#FBB73C',
                    fontSize: '12px',
                    fontWeight: '500',
                  },
                },
                '注：产品名称，请中英文填写'
              ),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.productName);
            }
            return h('Input', {
              props: {
                value: params.row.productName,
                // size: 'small',
                maxlength: 100,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].productName = val;
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
                  'Unit number/回溯申报数量'
                ),
              ]),
              h(
                'p',
                {
                  style: {
                    color: '#FBB73C',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                  },
                },
                '注：请填写需要回溯申报的数量，回溯申报数量可参照历史销售数据，单位默认为“个”'
              ),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.unitNumber);
            }
            return h('Input', {
              props: {
                value: params.row.unitNumber,
                // size: 'small',
                maxlength: 100,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].unitNumber = val;
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
                  'Net weight/单位重量'
                ),
              ]),
              h(
                'p',
                {
                  style: {
                    color: '#FBB73C',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '500',
                  },
                },
                '注：请填写单个产品的重量，单位默认为“KG”'
              ),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.netWeight);
            }
            return h('Input', {
              props: {
                value: params.row.netWeight,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].netWeight = val;
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
          // console.log(this.productList);
        }
      },
      immediate: true,
    },
    productList: {
      handler() {
        console.log(this.productList);
        for (let i = 0; i < this.productList.length; i++) {
          let item = this.productList[i];
          let requiredList = ['productName', 'unitNumber', 'netWeight'];
          for (let j in item) {
            if (requiredList.includes(j) && item[j] === '') {
              this.$emit('input', []);
              return;
            }
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
    cancel() {
      this.productList = JSON.parse(JSON.stringify(this.OldproductList));
    },
    remove(index) {
      if (this.disabled) return;
      this.productList.splice(index, 1);
    },
    addProduct() {
      if (this.disabled) return;
      this.productList.push({
        productName: '',
        unitNumber: '',
        netWeight: '',
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
