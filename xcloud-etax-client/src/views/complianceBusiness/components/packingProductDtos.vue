<template>
  <div class="main">
    <div class="productListTable">
      <div class="packingTable">
        <div class="heard">
          <p>申报信息</p>
          <p>（预估当年出货总重量）*</p>
        </div>
        <div class="body title border-top">
          <span>Material type 材料类别</span>
          <span>重量 Kg</span>
          <span>Material type 材料类别</span>
          <span>重量 Kg</span>
        </div>
        <div class="body border-bottom border-top">
          <span class="name">Papier/Pappe/Karton 纸类包装：纸张/纸板/纸箱</span>
          <span>
            <!-- <Input v-model="productList.papier" clearable size="small" :disabled="disabled" /> -->
            <span v-if="isDetails">{{ productList.papier }}</span>
            <InputNumber
              v-else
              style="width: 150px"
              v-model="productList.papier"
              :precision="0"
              clearable
              :disabled="disabled"
            />
          </span>
          <span class="name">Glas 玻璃</span>
          <span>
            <!-- <Input v-model="productList.glas" clearable size="small" :disabled="disabled" /> -->
            <span v-if="isDetails">{{ productList.glas }}</span>
            <InputNumber
              v-else
              v-model="productList.glas"
              style="width: 150px"
              :precision="0"
              clearable
              :disabled="disabled"
            />
          </span>
        </div>
        <div class="body border-bottom">
          <span class="name">Kunststoffe 塑料</span>
          <span>
            <!-- <Input v-model="productList.kunststoffe" clearable size="small" :disabled="disabled" /> -->
            <span v-if="isDetails">{{ productList.kunststoffe }}</span>
            <InputNumber
              v-else
              v-model="productList.kunststoffe"
              :precision="0"
              clearable
              style="width: 150px"
              :disabled="disabled"
            />
          </span>

          <span class="name">Getrankartonverpackungen 液体纸板包装</span>
          <span>
            <!-- <Input v-model="productList.liquidCardboard" clearable size="small" :disabled="disabled" /> -->
            <span v-if="isDetails">{{ productList.liquidCardboard }}</span>
            <InputNumber
              v-else
              v-model="productList.liquidCardboard"
              :precision="0"
              clearable
              style="width: 150px"
              :disabled="disabled"
            />
          </span>
        </div>
        <div class="body border-bottom">
          <span class="name">Eisenmetalle 铁</span>
          <span>
            <!-- <Input v-model="productList.eisenmetalle" clearable size="small" :disabled="disabled" /> -->
            <span v-if="isDetails">{{ productList.eisenmetalle }}</span>
            <InputNumber
              v-else
              v-model="productList.eisenmetalle"
              :precision="0"
              clearable
              style="width: 150px"
              :disabled="disabled"
            />
          </span>
          <span class="name">Sonstige Verbunde 其他混合包装</span>
          <span>
            <!-- <Input v-model="productList.sonstigeVerbunde" clearable size="small" :disabled="disabled" /> -->
            <span v-if="isDetails">{{ productList.sonstigeVerbunde }}</span>
            <InputNumber
              v-else
              v-model="productList.sonstigeVerbunde"
              :precision="0"
              clearable
              style="width: 150px"
              :disabled="disabled"
            />
          </span>
        </div>
        <div class="body">
          <span class="name">Aluminium 铝</span>
          <span>
            <!-- <Input v-model="productList.aluminium" clearable size="small" :disabled="disabled" /> -->
            <span v-if="isDetails">{{ productList.aluminium }}</span>
            <InputNumber
              v-else
              v-model="productList.aluminium"
              :precision="0"
              clearable
              style="width: 150px"
              :disabled="disabled"
            />
          </span>
          <span class="name">Sonstige Materialie 其他特殊材料（请注明）</span>
          <span>
            <!-- <Input v-model="productList.sonstigeMaterialie" clearable size="small" :disabled="disabled" /> -->
            <span v-if="isDetails">{{ productList.sonstigeMaterialie }}</span>
            <InputNumber
              v-else
              v-model="productList.sonstigeMaterialie"
              :precision="0"
              clearable
              style="width: 150px"
              :disabled="disabled"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'disabled', 'isDetails'],
  data() {
    return {
      productList: {
        papier: 0,
        glas: 0,
        kunststoffe: 0,
        liquidCardboard: 0,
        eisenmetalle: 0,
        sonstigeVerbunde: 0,
        aluminium: 0,
        sonstigeMaterialie: 0,
      },
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          Object.keys(val).forEach((key) => {
            val[key] = val[key] == '' || isNaN(val[key]) ? 0 : Number(val[key]);
          });
          this.productList = { ...this.productList, ...val };
        }
      },
      immediate: true,
    },
    productList: {
      handler() {
        // let isEmpty = this.verifyEmpty(this.productList);
        // if (isEmpty) {
        //   this.$emit('input', 0);
        //   return;
        // }
        if (!this.isDetails) {
          this.$emit('input', this.handlerEmpty());
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    verifyEmpty(obj) {
      let arr = Object.values(obj);
      let isEmpty = arr.every((item) => item == '');
      return isEmpty;
    },
    handlerEmpty() {
      const obj = {};
      Object.keys(this.productList).forEach((key) => {
        obj[key] = this.productList[key] == null ? 0 : this.productList[key];
      });
      return obj;
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
.packingTable {
  width: 100%;
  text-align: center;
  border: 1px solid #ebeef5;
  .heard {
    height: 60px;
    background: #fafafa;
  }
  .title {
    background: #fafafa;
    color: #333333;
    font-size: 12px;
  }
  .body {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      .name {
        flex: 2;
      }
      flex: 1;
    }
  }
  .border-left {
    border-left: 1px solid #ebeef5;
  }
  .border-top {
    border-top: 1px solid #ebeef5;
  }
  .border-bottom {
    border-bottom: 1px solid #ebeef5;
  }
}
</style>
