<template>
  <div class="main">
    <div class="productListTable">
      <div class="packingTable">
        <div class="heard">
          <p>申报产品信息</p>
          <p>（当年实际出货总重量）*</p>
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
            {{ productList.papier }}
          </span>
          <span class="name">Glas 玻璃</span>
          <span>
            {{ productList.glas }}
          </span>
        </div>
        <div class="body border-bottom">
          <span class="name">Kunststoffe 塑料</span>
          <span>
            {{ productList.kunststoffe }}
          </span>
          <span class="name">Getrankartonverpackungen 液体纸板包装</span>
          <span>
            {{ productList.liquidCardboard }}
          </span>
        </div>
        <div class="body border-bottom">
          <span class="name">Eisenmetalle 铁</span>
          <span>
            {{ productList.eisenmetalle }}
          </span>
          <span class="name">Sonstige Verbunde 其他混合包装</span>
          <span>
            {{ productList.sonstigeVerbunde }}
          </span>
        </div>
        <div class="body">
          <span class="name">Aluminium 铝</span>
          <span>
            {{ productList.aluminium }}
          </span>
          <span class="name">Sonstige Materialie 其他特殊材料（请注明）</span>
          <span>
            {{ productList.sonstigeMaterialie }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'disabled'],
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
            val[key] = val[key] == '' ? 0 : Number(val[key]);
          });
          this.productList = val;
        }
      },
      immediate: true,
    },
    productList: {
      handler() {
        let isEmpty = this.verifyEmpty(this.productList);
        if (isEmpty) {
          this.$emit('InputNumber', '');
          return;
        }
        this.$emit('InputNumber', this.productList);
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
  },
};
</script>

<style lang="less" scoped>
.main {
  padding: 0px !important;
}
/deep/ .ivu-InputNumber {
  font-size: 14px !important;
}
.productListTable {
  /deep/ .ivu-upload-select {
    width: 100px !important;
  }
}
/deep/ .ivu-InputNumber {
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
    background: rgba(22, 173, 233, 0.2);
  }
  .title {
    background: rgba(22, 173, 233, 0.2);
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
