<template>
  <div class="main">
    <div class="productListTable">
      <Table border :columns="tableColumn" :data="productList">
        <!-- 产品类别 -->
        <template slot-scope="{ row, index }" slot="productCategory">
          <Select
            v-model="row.parentProductCategoryName"
            :disabled="disabled"
            transfer
            clearable
            @on-change="(val) => changeParentProductCategoryName(val, index)"
          >
            <Option :value="item.productCategoryZh" v-for="item in productCategoryList" :key="item.id">{{
              item.productCategoryZh
            }}</Option>
          </Select>
        </template>
        <template slot-scope="{ row, index }" slot="subProductCategory">
          <Select
            v-model="row.productCategoryId"
            :disabled="disabled"
            transfer
            clearable
            style="width: 200px"
            @on-change="(val) => changeProductCategoryId(val, index)"
          >
            <Option :value="item.id" v-for="item in subProductCategoryList[index]" :key="item.id"
              >{{ item.productCategoryZh }}
            </Option>
          </Select>
        </template>

        <template slot-scope="{ row, index }" slot="inPackageSlot">
          <InputNumber
            v-model="row.inPackageQuantity"
            :min="0.0"
            :active-change="false"
            :precision="0"
            style="width: 200px"
            :disabled="disabled"
            @on-change="(val) => (productList[index].inPackageQuantity = val)"
          ></InputNumber>
        </template>

        <!-- 操作 -->
        <template slot-scope="{ row, index }" slot="action">
          <Tooltip placement="top" content="添加信息栏" v-if="!disabled">
            <img
              src="@/assets/images/compliance/add.svg"
              style="margin-right: 5px; cursor: pointer"
              @click="addProduct"
            />
          </Tooltip>
          <Tooltip placement="top" content="删除信息栏" transfer v-if="!disabled">
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
import { declareProductCategory } from '@/api/epr.js';

export default {
  props: ['value', 'disabled', 'showInPackage', 'supplierCode'],
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
                  '产品系列'
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
                  '产品'
                ),
              ]),
            ]);
          },
          slot: 'subProductCategory',
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
                  '包装数量（最外层包装数CSU）'
                ),
                h(
                  'Tooltip',
                  {
                    props: {
                      content:
                        '①按组销售的3双袜子在1个销售包装内，应计算为1个CSU，3个CU；②1个装有1台计算机的纸箱(按箱销售)，应该计算1个CSU，同样也是1个CU。',
                      'max-width': 240,
                      placement: 'top',
                      transfer: true,
                    },
                  },
                  [
                    h('Icon', {
                      props: {
                        type: 'md-help-circle',
                        color: '#ffd75a',
                        size: '20',
                      },
                    }),
                  ]
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                value: params.row.outerPackageQuantity,
                // size: 'small',
                min: 0,
                precision: 0,
                disabled: this.disabled,
                width: 200,
              },

              style: {
                width: '200px',
              },

              on: {
                'on-change': (val) => {
                  this.productList[params.index].outerPackageQuantity = val;
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
                  '包装数量（最小包装数CU）'
                ),
                h(
                  'Tooltip',
                  {
                    props: {
                      content:
                        '①按组销售的3双袜子在1个销售包装内，应计算为1个CSU，3个CU；②1个装有1台计算机的纸箱(按箱销售)，应该计算1个CSU，同样也是1个CU。',
                      'max-width': 240,
                      placement: 'top',
                      transfer: true,
                    },
                  },
                  [
                    h('Icon', {
                      props: {
                        type: 'md-help-circle',
                        color: '#ffd75a',
                        size: '20',
                      },
                    }),
                  ]
                ),
              ]),
            ]);
          },

          align: 'center',
          key: 'inPackage',
          slot: 'inPackageSlot',
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
      productCategoryList: [],
      subProductCategoryList: {},
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length) {
          this.productList = val;
          // this.productList.forEach((item, index) => {
          //   this.changeParentProductCategoryName(item.parentProductCategoryName, index);
          // });
        } else {
          this.productList = [];
          this.addProduct();
        }
      },
      immediate: true,
    },
    productList: {
      handler() {
        // for (let i = 0; i < this.productList.length; i++) {
        //   let item = this.productList[i];
        //   let verify = this.verifyEmpty(item);
        //   if (!verify.flag && !verify.isEmpty) {
        //     console.log(111);
        //     this.$emit('input', []);
        //     return;
        //   }
        //   if (verify.flag) {
        //     console.log(22);
        //     this.$emit('input', []);
        //     return;
        //   }
        // }
        if (!this.productList.length) this.addProduct();
        this.$emit('inputValChange', this.productList);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getDeclareProductCategory();
  },
  computed: {
    tableColumn() {
      if (this.showInPackage) {
        return this.columns;
      }
      return this.columns.filter((item) => item.key != 'inPackage');
    },
  },
  methods: {
    verifyEmpty(obj) {
      let arr = Object.values(obj);
      let flag = arr.every(function (item) {
        return item === '' || item === null;
      });
      let isEmpty = arr.every(function (item) {
        return item !== '' && item !== null;
      });
      let params = {
        flag,
        isEmpty,
      };
      return params;
    },
    getDeclareProductCategory() {
      declareProductCategory({ countryCode: 'FR', supplierCode: this.supplierCode }).then((res) => {
        this.productCategoryList = res.data;
        if (!this.productCategoryList.length) return;
        this.productList.forEach((item, index) => {
          this.changeParentProductCategoryName(item.parentProductCategoryName, index, true);
        });
      });
    },
    changeParentProductCategoryName(val, index, flag) {
      this.productList[index].parentProductCategoryName = val;

      const eprDeclareProductCategoryPriceList = (
        this.productCategoryList.find((el) => el.productCategoryZh == val) || {}
      ).eprDeclareProductCategoryPriceList;
      this.$set(this.subProductCategoryList, index, eprDeclareProductCategoryPriceList);
      if (!flag) {
        this.productList[index].productCategoryId = '';
        this.productList[index].productCategoryName = '';
        this.productList[index].productCategoryCode = '';
      }
    },

    changeProductCategoryId(val, index) {
      this.productList[index].productCategoryId = val;
      const productObj = this.subProductCategoryList[index].find((el) => el.id == val) || {};
      this.productList[index].productCategoryName = productObj.productCategoryZh;
      this.productList[index].productCategoryCode = productObj.code;
    },

    remove(index) {
      if (this.disabled) return;
      this.productList.splice(index, 1);
    },
    addProduct() {
      if (this.disabled) return;
      this.productList.push({
        parentProductCategoryName: '',
        productCategoryId: '',
        productCategoryName: '',
        productCategoryCode: '',
        outerPackageQuantity: 0,
        inPackageQuantity: 0,
        overflowWeight: 0,
        payAmount: 0,
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
/deep/ .ivu-select-selection {
  width: 200px;
}
</style>
