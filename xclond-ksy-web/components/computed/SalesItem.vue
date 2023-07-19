<template>
  <div class="sales">
    <h2>添加销售项</h2>
    <!-- {{ items }}--{{ eclModal }} -->
    <div class="list" v-show="items.length">
      <div class="item" v-for="(item, index) in items" :key="index">
        <a-input placeholder="请输入对方税号" class="ksy-w200" v-model="items[index].taxNumber" />
        <a-input
          v-model="items[index].taxAmt"
          placeholder="请输入"
          v-positiveNumber="{ fixedNum: 2, maxNum: 1000000, minNum: 0 }"
          :suffix="countryIcon"
          class="ksy-w240"
        />
        <AliIcon type="shanjian" :size="15" @click.native="clearItem(index)" v-show="index !== 0" />
      </div>
    </div>
    <p class="addtext hand">
      <a-space>
        <AliIcon type="tianjia1" :size="24" @click.native="addItem" />
        <span class="ksy-ml-2" @click="addItem">添加抵扣项</span>
      </a-space>
    </p>
    <div class="calc" v-show="clacNub">
      总计：<span>{{ clacNub ? clacNub.toFixed(2) : "--" }}欧元</span>
    </div>
    <div class="ksy-text-center">
      <a-button type="primary" class="ksy-w100" @click="submit">确认</a-button>
      <a-button class="ksy-w100" @click="closeModal">取消</a-button>
    </div>
  </div>
</template>

<script>
import aboutComputedMix from "@/mixins/about-computed";
export default {
  mixins: [aboutComputedMix],
  data() {
    return {
      item: {
        taxNumber: "",
        taxAmt: null,
      },
      items: [],
      clacNub: null,
    };
  },
  props: {
    eclSaleItems: {
      type: Array,
      default: () => [],
    },
    eclPurchaseItems: {
      type: Array,
      default: () => [],
    },
    // 1销售项弹窗，2采购项弹窗
    eclModal: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    items: {
      handler(newVal, oldVal) {
        console.log(newVal);
        setTimeout(() => {
          this.calcItems();
        }, 200);
      },
      deep: true,
    },
  },
  mounted() {
    if (this.eclModal === 1) {
      this.items = this.eclSaleItems;
    } else {
      this.items = this.eclPurchaseItems;
    }

    if (!this.items.length) {
      this.items = [
        {
          taxNumber: "",
          taxAmt: null,
        },
      ];
    }
  },
  methods: {
    addItem() {
      this.items.push({
        taxNumber: "",
        taxAmt: null,
      });
    },
    clearItem(index) {
      console.log(index);
      this.$data.items.splice(index, 1);
    },
    retrunItems() {
      const { items } = this.$data;
      this.$emit("retrunItems", items);
    },
    calcItems() {
      let { items } = this.$data;
      var count = 0;
      items.map((ele) => {
        if (ele.taxAmt) {
          count += Number(ele.taxAmt);
        }
      });
      this.clacNub = count;
    },
    submit() {
      let { items } = this.$data;
      if (items.some((item) => item.taxNumber === "")) {
        this.$message.warning("税号不能为空！");
        return;
      }
      if (items.some((item) => item.taxAmt === "" || item.taxAmt === null)) {
        this.$message.warning("金额不能为空！");
        return;
      }
      this.$emit("retrunElcItems", {
        eclModal: this.eclModal,
        count: this.clacNub,
        items: this.items,
        close: false,
      });
    },
    closeModal() {
      this.$emit("retrunElcItems", {
        eclModal: null,
        count: null,
        items: null,
        close: true,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.sales {
  h2 {
    font-size: 16px;
    color: @textColor;
    margin-bottom: 24px;
  }
  .item {
    margin-bottom: 10px;
  }
  .addtext {
    color: @primaryColor;
    border-bottom: 1px solid #e3e3e3;
    padding-bottom: 15px;
  }
  .ksy-w240 {
    width: 240px;
  }
  .calc {
    font-size: 16px;
    color: @textColor6;
    margin-bottom: 20px;
    span {
      color: @textColor;
      font-weight: bold;
    }
  }
}
</style>
