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

        <template slot-scope="{ row, index }" slot="inPackageSlot">
          <InputNumber
            v-model="row.inPackageQuantity"
            :min="0.0"
            :active-change="false"
            :precision="0"
            style="width: 100px"
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
                  '产品种类'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            return h(
              'Select',
              {
                props: {
                  value: params.row.productType,
                },
                on: {
                  'on-change': (event) => {
                    this.productList[params.index].productType = event;
                  },
                },
              },
              this.productTypeList.map((item) => {
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
                disabled: params.row.weightDisable,
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
      productTypeList: [
        'Car equipment - 车载设备',
        'Computer/IT - 计算机/IT',
        'Cooking - 烹饪',
        'DIY',
        'Hearing care - 听力保健',
        'Hi-fi- 高保真音响',
        'Lighting - 灯光',
        'Medical - 医疗',
        'Other - 其他',
        'Personal care - 个人护理',
        'Phone - 电话',
        'Camera Equipment - 摄像设备',
        'Safety / Security - 安全保障',
        'Equipment - 设备',
        'Sports Equipment - 体育器材',
        'Power Tools - 电动工具',
        'Toys - 玩具',
      ],
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
        this.productList[index].weight = 0;
      }
    },

    changeProductCategoryId(val, index) {
      this.productList[index].batteryTypeId = val;

      const productObj = this.subProductCategoryList[index].find((el) => el.id == val) || {};
      this.productList[index].batteryType = productObj.cateNameZh;
      this.productList[index].externalId = productObj.externalId;
      if (productObj.unitNumber) {
        this.productList[index].weight = productObj.unitNumber;
        this.productList[index].weightDisable = true;
      } else {
        if (JSON.stringify(productObj) != '{}') this.productList[index].weightDisable = false;
      }
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
        weightDisable: true,
        weight: 0,
        number: 0,
        productNum: 0,
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-table-wrapper {
  overflow: initial;
}
</style>
