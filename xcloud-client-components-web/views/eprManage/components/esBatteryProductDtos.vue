<template>
  <div class="main">
    <div class="productListTable">
      <Table border :columns="columns" :data="productList">
        <template slot-scope="{ row, index }" slot="batteryCategory">
          <span v-if="isDetails">{{ row.batteryCategory }}</span>
          <Select
            v-else
            v-model="row.batteryCategory"
            :disabled="disabled"
            transfer
            @on-change="(val) => onSelect(val, index, 'batteryCategory')"
          >
            <Option :value="item.name" v-for="item in productCategoryList" :key="item.name">{{ item.name }}</Option>
          </Select>
        </template>

        <template slot-scope="{ row, index }" slot="productName">
          <span v-if="isDetails">{{ row.productName }}</span>
          <Select
            v-else
            v-model="row.productName"
            :disabled="disabled"
            transfer
            @on-change="(val) => onSelect(val, index, 'productName')"
          >
            <Option :value="item.name" v-for="item in secondCategoryList[index]" :key="item.name">{{
              item.name
            }}</Option>
          </Select>
        </template>

        <template slot-scope="{ row, index }" slot="range">
          <span v-if="isDetails">{{ row.range }}</span>
          <Select
            v-else
            v-model="row.range"
            :disabled="disabled"
            transfer
            @on-change="(val) => onSelect(val, index, 'range')"
          >
            <Option :value="item.name" v-for="item in thirdCategoryList[index]" :key="item.name">{{
              item.name
            }}</Option>
          </Select>
        </template>
        <template slot-scope="{ row }" slot="unit">
          <span v-if="isDetails">{{ row.unit }}</span>
          <span v-else>{{ row.unit || '自动计算' }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="saleWeight">
          <div>
            <span v-if="isDetails">{{ row.saleWeight }}</span>
            <InputNumber
              v-model="row.saleWeight"
              :min="0"
              :active-change="false"
              :precision="2"
              style="width: 150px"
              maxlength="20"
              :disabled="disabled"
              @on-change="(val) => onSelect(val, index, 'saleWeight')"
            />
          </div>
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
    </div>
  </div>
</template>

<script>
import { productES } from '../configES';
import _ from 'lodash';

// import moduleName from 'module';
export default {
  props: ['value', 'disabled', 'isDetails', 'isRemark'],
  data() {
    return {
      columns: [
        {
          renderHeader: (h, params) => {
            return (
              <div>
                <p>
                  <span style="color: red;margin-right: 3px;font-weight: 600">*</span>
                  <span style="color: #333;font-weight: 600">电池类别</span>
                </p>
              </div>
            );
          },
          slot: 'batteryCategory',
          align: 'center',
          minWidth: 100,
        },
        {
          renderHeader: (h, params) => {
            return (
              <div>
                <p>
                  <span style="color: red;margin-right: 3px;font-weight: 600">*</span>
                  <span style="color: #333;font-weight: 600">电池产品名称</span>
                </p>
              </div>
            );
          },
          slot: 'productName',
          align: 'center',
          minWidth: 100,
        },
        {
          renderHeader: (h, params) => {
            return (
              <div>
                <p>
                  <span style="color: red;margin-right: 3px;font-weight: 600">*</span>
                  <span style="color: #333;font-weight: 600">电池单个重量</span>
                </p>
              </div>
            );
          },
          slot: 'range',
          align: 'center',
          minWidth: 100,
        },
        {
          renderHeader: (h, params) => {
            return (
              <div>
                <p>
                  <span style="color: red;margin-right: 3px;font-weight: 600">*</span>
                  <span style="color: #333;font-weight: 600">计价单位</span>
                </p>
              </div>
            );
          },
          slot: 'unit',
          align: 'center',
          minWidth: 100,
        },
        {
          renderHeader: (h, params) => {
            return (
              <div>
                <p>
                  <span style="color: red;margin-right: 3px;font-weight: 600">*</span>
                  <span style="color: #333;font-weight: 600">申报产品数量/重量</span>
                </p>
              </div>
            );
          },
          slot: 'saleWeight',
          align: 'center',
          minWidth: 150,
        },
        {
          title: this.isRemark ? '备注' : '操作',
          slot: 'action',
          align: 'center',
          width: 100,
        },
      ],
      productList: [],
      productCategoryList: productES,
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val && val.length) {
          if(typeof val[0].saleWeight === 'string') {
            this.productList = [...val].map(item=> {
              return {
                ...item,
                saleWeight: parseFloat(item.saleWeight),
                rangeKey: item.batteryCategory + item.productName + item.range
              }
            });
          }
          
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
  computed: {
    secondCategoryList() {
      const list = [];
      this.productList.forEach((productItem) => {
        const selectedItem = this.productCategoryList.find((item) => item.name === productItem.batteryCategory);
        list.push(selectedItem?.children || []);
      });
      return list;
    },
    thirdCategoryList() {
      const list = [];
      this.productList.forEach((productItem, productIndex) => {
        const selectedItem = this.secondCategoryList[productIndex].find(
          (item) => item.name === productItem.productName
        );
        list.push(selectedItem?.children || []);
      });
      return list;
    },
  },
  methods: {
    verify() {
      return new Promise((resolve, reject) => {
        let flag = true;
        let msg = '';

        if (this.productList.find((item) => !item.range || item.saleWeight === '' || item.saleWeight == null)) {
          flag = false;
          msg = '请填写完整信息';
          return reject({ flag, msg })
        }

        const hasDuplicates = _.uniqBy(this.productList, 'rangeKey').length !== this.productList.length;
        if (hasDuplicates && this.productList.length > 1) {
          flag = false;
          msg = '数据重复, 请检查数据';
        }
        if (!flag) {
          this.$Message.error(msg);
          return reject({ flag, msg })
        }
        resolve()
      });
    },
    remove(index) {
      if (this.disabled) return;
      this.productList.splice(index, 1);
    },
    addProduct() {
      if (this.disabled) return;
      this.productList.push({
        batteryCategory: '',
        productName: '',
        range: '',
        unit: '',
        saleWeight: 0,
        rangeKey: '',
      });
    },
    onSelect(val, index, updateKey) {
      const currProduct = this.productList[index]
      currProduct[updateKey] = val;
      // 自动选择 单位
      if (updateKey === 'range') {
        currProduct.rangeKey = currProduct.batteryCategory + currProduct.productName + val
        const selectedItem = this.thirdCategoryList[index].find((thirdItem) => thirdItem.name === val);
        currProduct.unit = selectedItem?.value;
      }
      this.$set(this.productList, index, currProduct);
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
