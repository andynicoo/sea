<template>
  <div class="main">
    <div class="productListTable">
      <Table border :columns="columns" :data="productList">
        <!-- 产品类别 -->
        <template slot-scope="{ row, index }" slot="productCategory">
          <span v-if="isDetails">{{ row.productCategory }}</span>
          <Select
            v-else
            v-model="row.productCategory"
            :disabled="disabled"
            transfer
            clearable
            @on-change="(val) => (productList[index].productCategory = val)"
          >
            <Option
              :value="item.value"
              v-for="item in isDE ? productCategoryListDE : productCategoryList"
              :key="item.value"
              >{{ item.value }}</Option
            >
          </Select>
        </template>
        <!-- 操作 -->
        <template slot-scope="{ row, index }" slot="action">
          <div v-if="isRemark">{{ row.isBuy ? '已续费' : '' }}</div>
          <Tooltip placement="top" content="添加信息栏" v-else-if="!disabled && !isDetails">
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
      <p v-if="!isDetails" style="color: red">注：WEEE产品类别明细点击“查看示例”</p>
    </div>
  </div>
</template>

<script>
import { boolean } from 'mathjs';
export default {
  props: ['value', 'disabled', 'isDetails', 'isRemark', 'countryCode'],
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
                  this.isDE ? '产品名称 (中文+英文)' : '产品名称（中/英文）'
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
                  '对应的品牌LOGO'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.productLogo);
            }
            return h('Input', {
              props: {
                value: params.row.productLogo,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].productLogo = val;
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
                  this.isDE ? '单边最大尺寸（厘米）' : '单边最大尺寸/cm'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.sideMaxSize);
            }
            return h('Input', {
              props: {
                value: params.row.sideMaxSize,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].sideMaxSize = val;
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
                  this.isDE ? '预估年投放量（千克）':'预计当年销售总量'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.saleWeight);
            }
            return h('Input', {
              props: {
                value: params.row.saleWeight,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productList[params.index].saleWeight = val;
                },
              },
            });
          },
          align: 'center',
          minWidth: 100,
        },
        {
          title: this.isRemark ? '备注' : '操作',
          slot: 'action',
          align: 'center',
          width: 100,
        },
      ],
      productList: [],
      productCategoryList: [
        { value: '热交换器' },
        { value: '显示屏或屏幕大于100平方厘米的显示设备' },
        { value: '照明设备' },
        { value: '大型电子设备（能收缩到最短距离的长度超过50cm）' },
        { value: '小型电子电器设备（能收缩到最短距离的长度不超过50cm）' },
        { value: '小型IT和电信设备（外部尺寸不超过50cm）' },
      ],
      productCategoryListDE: [
        { value: '温度交换设备' },
        { value: '显示屏' },
        { value: '气体放电灯' },
        { value: '非气体放电灯' },
        { value: '大型非光伏设备（收缩后的单边最大尺寸>50cm）' },
        { value: '小型非光伏设备（收缩后的单边最大尺寸≤50cm）' },
        { value: '小型IT和电信设备（收缩后的单边最大尺寸≤50cm）' },
        { value: '大型光伏设备（收缩后的单边最大尺寸>50cm）' },
        { value: '小型光伏设备（收缩后的单边最大尺寸≤50cm）' },
      ],
    };
  },
  computed: {
    isDE() {
      return this.countryCode === 'DE';
    },
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
  methods: {
    verifyEmpty(obj) {
      let arr = Object.values(obj);
      let flag = arr.every(function (item) {
        return item == '';
      });
      let isEmpty = arr.every(function (item) {
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
    addProduct() {
      if (this.disabled) return;
      this.productList.push({
        productCategory: '',
        productName: '',
        productLogo: '',
        sideMaxSize: '',
        saleWeight: '',
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
