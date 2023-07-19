<template>
  <div class="tradeclass" :class="{ tradeclassnoul: classData.length > 1 }">
    <span v-if="classData.length > 1" class="size14 color6 selects">已选{{ classData.length }}类</span>
    <a-select v-model="classData" placeholder="请选择" mode="multiple" class="w136">
      <a-select-option :value="item.categoryName" v-for="item in bigClassData" :key="item.id">
        {{ item.categorySort }} {{ item.categoryName }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import trademark from "@/apis/trademark";

export default {
  data() {
    return {
      bigClassData: [],
      classData: [],
    };
  },
  mounted() {
    this.getBigClass();
  },
  watch: {
    classData: {
      handler(newVal, oldVal) {
        console.log(newVal);
        this.$bus.$emit("sendSelectClass", { classData: newVal });
      },
    },
  },
  methods: {
    // 获取大类
    async getBigClass() {
      let params = {
        limit: 50,
        page: 1,
        countryCode: "US",
      };
      let bigClass = await this.$axiosApi(trademark.categoryOneList.url, trademark.categoryOneList.methods, params);
      let { code, data } = bigClass;
      if (code === 0) {
        this.bigClassData = data;
      } else {
        this.$message.error("商标大类错误!");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.tradeclass {
  position: relative;
  .selects {
    position: absolute;
    top: 5px;
    left: 11px;
    z-index: 9;
  }
  .w136 {
    width: 136px;
  }
}
</style>
<style lang="less">
.tradeclassnoul {
  ul {
    display: none !important;
  }
}
</style>
