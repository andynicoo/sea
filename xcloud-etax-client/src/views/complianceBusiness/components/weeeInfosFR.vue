<template>
  <div class="main">
    <div class="productListTable">
      <Table border :columns="columns" :data="productInfos">
        <template slot-scope="{ row, index }" slot="deviceUse">
          <span v-if="isDetails">{{ row.deviceUse }}</span>
          <Select
            v-else
            v-model="row.deviceUse"
            :disabled="disabled"
            transfer
            clearable
            @on-change="(val) => (productInfos[index].deviceUse = val)"
          >
            <Option :value="item" v-for="item in deviceUseOptions" :key="item">{{ item }}</Option>
          </Select>
        </template>

        <!-- 一级分类 -->
        <template slot-scope="{ row, index }" slot="firstClass">
          <span v-if="isDetails">{{ row.firstClass }}</span>
          <Select
            v-else
            v-model="row.firstClass"
            :disabled="disabled"
            transfer
            clearable
            @on-change="(val) => (productInfos[index].firstClass = val)"
          >
            <Option :value="item.value" v-for="item in selectOptions" :key="item.value">{{ item.value }}</Option>
          </Select>
        </template>
        <!-- 二级分类 -->
        <!-- <template slot-scope="{ row, index }" slot="secondaryClass">
          <span v-if="isDetails">{{ row.secondaryClass }}</span>
          <Select
            v-else
            v-model="row.secondaryClass"
            :disabled="disabled"
            transfer
            clearable
            @on-change="(val) => (productInfos[index].secondaryClass = val)"
          >
            <Option :value="item.value" v-for="item in getSecondOptions(index)" :key="item.value">{{
              item.value
            }}</Option>
          </Select>
        </template> -->
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
      <p style="color: red">注：电池法产品信息项点击“查看示例”进行参考填写</p>
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
                  '设备用途'
                ),
              ]),
            ]);
          },
          slot: 'deviceUse',
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
                  '设备大类'
                ),
              ]),
            ]);
          },
          slot: 'firstClass',
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
                  '设备小类'
                ),
              ]),
            ]);
          },

          // render: (h, params) => {
          //   if (this.isDetails) {
          //     return h('span', params.row.secondaryClass);
          //   }
          //   return h('Input', {
          //     props: {
          //       value: params.row.secondaryClass,
          //       // size: 'small',
          //       maxlength: 500,
          //       disabled: this.disabled,
          //     },
          //     on: {
          //       input: (val) => {
          //         this.productInfos[params.index].secondaryClass = val;
          //       },
          //     },
          //   });
          // },

          align: 'center',
          slot: 'secondaryClass',
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
                  '设备重量（千克）'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.weight);
            }
            return h('Input', {
              props: {
                value: params.row.weight,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productInfos[params.index].weight = val;
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
                  '产品名称'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.prodName);
            }
            return h('Input', {
              props: {
                value: params.row.prodName,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productInfos[params.index].prodName = val;
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
                  '产品链接'
                ),
              ]),
            ]);
          },
          render: (h, params) => {
            if (this.isDetails) {
              return h('span', params.row.prodLink);
            }
            return h('Input', {
              props: {
                value: params.row.prodLink,
                // size: 'small',
                maxlength: 500,
                disabled: this.disabled,
              },
              on: {
                input: (val) => {
                  this.productInfos[params.index].prodLink = val;
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
      deviceUseOptions: [
        '家用类电子电器 Household EEE',
        '专业类电子电器 Professional EEE',
        '运动和娱乐设备 SLA',
        '热力DIY和园艺用品 DIYGA Th',
      ],
      selectOptions: [
        {
          value: '热交换器',
          secondOptions: [
            { value: '冰箱及冰柜' },
            { value: '整体式热交换设备，包括除湿器、空调、热力热水器' },
            { value: '分体式热泵和其他分体式温度交换设备（C&F），包括除湿器、空调、热水（可移动热力单体空调）' },
          ],
        },
        {
          value: '屏幕、显示器和设备，包括表面大于 100 cm² 的屏幕',
          secondOptions: [{ value: '显示器' }, { value: '笔记本电脑' }, { value: '平板电脑' }, { value: '电视机' }],
        },
        {
          value: '大型设备（任何外形尺寸大于50cm）',
          secondOptions: [
            { value: '洗衣机' },
            { value: '洗碗机' },
            { value: '烤箱/炉灶/组合洗衣机/干衣机' },
            { value: '热水器/锅炉 ' },
            { value: '电油汀' },
            { value: '可移动大型设备:电动自行车/三轮车/电动轮椅' },
            { value: '其他大型设备' },
          ],
        },
        {
          value: '小型设备（外形尺寸不超过50cm）',
          secondOptions: [
            { value: '咖啡机/水壶/茶壶' },
            { value: '吸尘器' },
            { value: '电钻/螺丝刀' },
            { value: '便携式游戏机' },
            { value: '电视游戏机' },
            { value: '微波炉' },
            { value: '带连接器的电缆' },
            { value: '其他小型设备（包括照明设备）' },
          ],
        },
        {
          value: '小型计算机和电信设备（所有外形尺寸小于或等于50cm）',
          secondOptions: [
            { value: 'GSM电话及智能手机' },
            { value: '台式机' },
            { value: '打印机' },
            { value: '打印墨盒' },
            { value: '配备连接器的电缆' },
            { value: '其他小型计算机和电信设备' },
          ],
        },
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
          let requiredKeys = ['deviceUse', 'firstClass', 'secondaryClass', 'weight', 'prodName', 'prodLink'];
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
    // getSecondOptions(index) {
    //   let temp = this.selectOptions.find((item) => item.value === this.productInfos[index].firstClass);
    //   return temp ? temp.secondOptions : [];
    // },
    remove(index) {
      if (this.disabled) return;
      this.productInfos.splice(index, 1);
    },
    addProduct() {
      if (this.disabled) return;
      this.productInfos.push({
        deviceUse: '',
        firstClass: '',
        secondaryClass: '',
        weight: '',
        prodName: '',
        prodLink: '',
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
