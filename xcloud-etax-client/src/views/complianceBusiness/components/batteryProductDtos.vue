<template>
  <div class="main">
    <div class="productListTable">
      <Table border :columns="columns" :data="productList">
        <!-- 电池类型 -->
        <template slot-scope="{ row, index }" slot="batteryType">
          <span v-if="isDetails">{{ row.batteryType }}</span>
          <Select
            v-else
            v-model="row.batteryType"
            :disabled="disabled"
            transfer
            clearable
            @on-change="(val) => (productList[index].batteryType = val)"
          >
            <Option :value="item.value" v-for="item in batteryTypeList" :key="item.value">{{ item.value }}</Option>
          </Select>
        </template>
        <!-- 单位重量 -->
        <template slot-scope="{ row, index }" slot="unitWeight">
          <span v-if="isDetails">{{ row.unitWeight }}{{ row.batteryWeight }}</span>
          <template v-else>
            <Select
              v-model="row.unitWeight"
              :disabled="disabled"
              transfer
              clearable
              @on-change="
                (val) => (
                  (productList[index].unitWeight = val),
                  (productList[index].isCharge = ''),
                  (productList[index].materialType = '')
                )
              "
            >
              <Option :value="item.value" v-for="item in unitWeightList" :key="item.value">{{ item.value }}</Option>
            </Select>
            <InputNumber
              v-model="row.batteryWeight"
              :min="0.0"
              :active-change="false"
              :precision="2"
              style="width: 128px"
              placeholder="单个电池重量"
              :disabled="disabled"
              @on-blur="changeBatteryWeight(index, row.batteryWeight)"
              v-if="row.unitWeight == '1KG以上'"
            ></InputNumber>
          </template>
        </template>
        <!-- 是否可以充电 -->
        <template slot-scope="{ row, index }" slot="isCharge">
          <span v-if="isDetails">{{ row.isCharge }}</span>
          <Select
            v-else
            v-model="row.isCharge"
            :disabled="disabled"
            :placeholder="row.isCharge || '请选择'"
            transfer
            clearable
            @on-change="(val) => ((productList[index].materialType = ''), (productList[index].isCharge = val))"
          >
            <Option :value="item.value" v-for="item in getFormatList(row, 'isCharge')" :key="item.value">{{
              item.value
            }}</Option>
          </Select>
        </template>
        <!-- 材料类型 -->
        <template slot-scope="{ row, index }" slot="materialType">
          <span v-if="isDetails">{{ row.materialType }}</span>
          <Select
            v-else
            v-model="row.materialType"
            :disabled="disabled"
            :placeholder="row.materialType || '请选择'"
            transfer
            clearable
            @on-change="(val) => (productList[index].materialType = val)"
          >
            <Option :value="item.value" v-for="item in getFormatList(row, 'materialType')" :key="item.value">{{
              item.value
            }}</Option>
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
              v-if="productList.length > 1"
            />
          </Tooltip>
        </template>
      </Table>
      <p style="color: red" v-if="!isDetails">注：电池法产品信息项点击“查看示例”进行参考填写</p>
    </div>
  </div>
</template>

<script>
import { getBatteryList } from '@/api/taxModule.js';
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
                  '产品中文名称'
                ),
              ]),
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
                  '电池类型'
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
                  '单位重量'
                ),
              ]),
            ]);
          },
          slot: 'unitWeight',
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
                  '是否可以充电'
                ),
              ]),
            ]);
          },
          slot: 'isCharge',
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
                  '材料类型'
                ),
              ]),
            ]);
          },
          slot: 'materialType',
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
                  '年发货数量/个'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.yearDeliveryNum);
            }
            return h('Input', {
              props: {
                value: params.row.yearDeliveryNum,
                // size: 'small',
                type: 'number',
                min: 0,
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].yearDeliveryNum = val;
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
                  this.productList[params.index].batteryBrand = val;
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
      batteryTypeList: [{ value: '工业电池' }, { value: '汽车电池' }, { value: '便携式电池' }],
      unitWeightList: [],
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
          if (!verify.flag && !verify.isEmpty) {
            this.$emit('input', []);
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
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getBatteryList().then((res) => {
        this.unitWeightList = res.data;
      });
    },
    getFormatList(row, key) {
      if (key === 'isCharge') {
        return (this.unitWeightList.find((item) => item.value === row.unitWeight) || { children: [] }).children;
      } else if (key === 'materialType') {
        return (this.getFormatList(row, 'isCharge').find((item) => item.value === row.isCharge) || { children: [] })
          .children;
      }
    },
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
    changeBatteryWeight(i, val) {
      this.productList[i].batteryWeight = val;
    },
    remove(index) {
      if (this.disabled) return;
      this.productList.splice(index, 1);
    },
    addProduct() {
      if (this.disabled) return;
      this.productList.push({
        productName: '',
        batteryType: '',
        materialType: '',
        isCharge: '',
        unitWeight: '',
        yearDeliveryNum: '',
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
