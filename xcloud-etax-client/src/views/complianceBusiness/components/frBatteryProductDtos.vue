<template>
  <div class="main">
    <div class="productListTable">
      <Table border :columns="tableColumn" :data="productList">
        <!-- 产品类别 -->
        <template slot-scope="{ row, index }" slot="chargingType">
          <Select
            v-model="row.chargingId"
            :disabled="disabled"
            transfer
            clearable
            @on-change="(val) => changeChargingType(val, index)"
          >
            <Option :value="item.parentCate.id" v-for="item in productCategoryList" :key="item.parentCate.id">{{
              item.parentCate.cateNameZh
            }}</Option>
          </Select>
        </template>

        <!-- @on-change="(val) => changeProductCategoryId(val, index)" -->
        <template slot-scope="{ row, index }" slot="batteryType">
          <Select
            v-model="row.batteryTypeId"
            :disabled="disabled"
            transfer
            clearable
            @on-change="(val) => changeProductCategoryId(val, index)"
          >
            <Option :value="item.id" v-for="item in subProductCategoryList[index]" :key="item.id"
              >{{ item.cateNameZh }}
            </Option>
          </Select>
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
import { declareFrBattCategory } from '@/api/epr.js';

export default {
  props: ['value', 'disabled', 'showInPackage', 'supplierCode', 'supplierId'],
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
                  '生产商属性'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: params.row.manufacturerAttr,
                },
                on: {
                  'on-change': (event) => {
                    this.productList[params.index].manufacturerAttr = event;
                  },
                },
              },
              this.manufacturerAttrList.map((item) => {
                return h('Option', {
                  props: {
                    value: item,
                    label: item,
                  },
                });
              })
            );
          },
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
                  '电池是否和产品组合售卖'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: params.row.combination,
                },
                on: {
                  'on-change': (event) => {
                    this.productList[params.index].combination = event;
                  },
                },
              },
              this.boolList.map((item) => {
                return h('Option', {
                  props: {
                    value: item,
                    label: item,
                  },
                });
              })
            );
          },
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
                  '是否家用电池'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: params.row.household,
                },
                on: {
                  'on-change': (event) => {
                    this.productList[params.index].household = event;
                  },
                },
              },
              this.boolList.map((item) => {
                return h('Option', {
                  props: {
                    value: item,
                    label: item,
                  },
                });
              })
            );
          },
        },
        {
          title: '充电类型',
          slot: 'chargingType',
          align: 'center',
          // minWidth: 100,
        },
        {
          title: '电池类型',
          slot: 'batteryType',
          align: 'center',
          // minWidth: 100,
        },
        {
          title: '单个电池的重量(g)',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                value: params.row.weight,
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
                  this.productList[params.index].weight = val;
                },
              },
            });
          },
          align: 'center',
          // minWidth: 100,
        },
        {
          title: '单个产品所含电池数量',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                value: params.row.number,
                // size: 'small',
                min: 0,
                precision: 0,
                width: 100,
              },

              style: {
                width: '130px',
              },

              on: {
                'on-change': (val) => {
                  this.productList[params.index].number = val;
                },
              },
            });
          },
          align: 'center',
          // minWidth: 100,
        },
        {
          title: '产品数量',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                value: params.row.productNum,
                // size: 'small',
                min: 0,
                precision: 0,
                width: 100,
              },

              style: {
                width: '130px',
              },

              on: {
                'on-change': (val) => {
                  this.productList[params.index].productNum = val;
                },
              },
            });
          },
          align: 'center',
          // minWidth: 100,
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
      manufacturerAttrList: ['法国本地生产商', '跨境电商（远程售卖）', '从欧盟国家进口', '从非欧盟国家进口'],
      boolList: ['是', '否'],
      addFlag: false,
    };
  },
  watch: {
    value: {
      handler(val) {
        if (!JSON.parse(JSON.stringify(val)).length) {
          this.addFlag = true;
        }
        this.productList = val;
        if (val && val.length) {
          // this.productList = val;
        } else {
          // this.productList = [];
          this.addProduct();
        }
      },
      immediate: true,
    },
    productList: {
      handler() {
        if (!this.productList.length) this.addProduct();
        this.$emit('input', this.productList);
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
      declareFrBattCategory({ supplierId: this.supplierId }).then((res) => {
        this.productCategoryList = res.data;
        if (!this.productCategoryList.length) return;
        if (this.addFlag) return;
        this.productList.forEach((item, index) => {
          this.changeChargingType(item.chargingId, index, true);
        });
      });
    },
    changeChargingType(val, index, flag) {
      this.productList[index].chargingId = val;
      const productObj = this.productCategoryList.find((item) => item.parentCate.id == val) || {};
      this.productList[index].chargingType = productObj.parentCate.cateNameZh;
      const eprDeclareProductCategoryPriceList = productObj.subCate;
      this.$set(this.subProductCategoryList, index, eprDeclareProductCategoryPriceList);
      if (!flag) {
        this.productList[index].batteryType = '';
        this.productList[index].batteryTypeId = '';
      }
    },

    changeProductCategoryId(val, index) {
      this.productList[index].batteryTypeId = val;

      const productObj = this.subProductCategoryList[index].find((el) => el.id == val) || {};
      this.productList[index].batteryType = productObj.cateNameZh;
      this.productList[index].externalId = productObj.externalId;
    },

    remove(index) {
      if (this.disabled) return;
      this.productList.splice(index, 1);
    },
    addProduct() {
      if (this.disabled) return;
      this.productList.push({
        manufacturerAttr: '',
        combination: '',
        household: '',
        chargingType: '',
        batteryTypeId: '',
        chargingId: '',
        batteryType: '',
        externalId: '',
        weight: 0,
        number: 0,
        productNum: 0,
      });
    },
  },
};
</script>

<style lang="less" scoped>
// .main {
//   padding: 20px;
// }
/deep/ .ivu-table-wrapper {
  overflow: initial;
}
// /deep/ .ivu-input {
//   font-size: 14px !important;
// }
// /deep/ .ivu-input {
//   display: inline-block;
//   width: 100px !important;
//   height: 32px;
//   line-height: 1.5;
//   padding: 4px 7px;
//   font-size: 14px;
//   border: 1px solid #dcdee2;
//   border-radius: 4px;
//   color: #515a6e;
//   background-color: #fff;
//   background-image: none;
//   position: relative;
//   cursor: text;
//   transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
// }
// /deep/ .ivu-select {
//   width: 100px !important;
//   .ivu-select-selection {
//     height: 32px !important;
//     .ivu-select-placeholder,
//     .ivu-select-selected-value {
//       height: 32px !important;
//       line-height: 32px !important;
//       text-align: left;
//     }
//   }
// }
// /deep/ .ivu-table-header {
//   th {
//     font-weight: 600;
//     color: #333;
//   }
// }
// /deep/ .ivu-table {
//   td {
//     padding-top: 16px;
//     padding-bottom: 16px;
//   }
// }
// /deep/ .ivu-input {
//   width: 120px;
// }
// /deep/ .ivu-select-selection {
//   width: 100px;
// }
</style>
