<template>
  <div class="container">
    <div class="category">
      <span>选择大类：</span>
      <a-select
        @change="handleChangeCategory"
        class="select"
        :value="currentCategory.categoryNum"
        placeholder="选择大类"
      >
        <a-select-option v-for="(item, index) in categoryFilterList" :key="index" :value="item.categoryNum"
          >{{ item.categoryNum }}类 {{ item.categoryName }}</a-select-option
        >
      </a-select>
    </div>
    <h4>2.1.1 同类别近似检索详情</h4>
    <div class="img-list" v-if="likeImgList.length">
      <img
        v-for="(item, index) in likeImgList"
        :key="index"
        :src="`data:image/jpeg;base64,${item.base64_url}`"
        width="100%"
      />
    </div>
    <h4>2.1.2 全类别近似检索结果详情</h4>
    <div class="img-list" v-if="diffImgList.length">
      <img
        v-for="(item, index) in diffImgList"
        :key="index"
        :src="`data:image/jpeg;base64,${item.base64_url}`"
        width="100%"
      />
    </div>
  </div>
</template>

<script>
import { getAllCategoryList } from '../../api/report';
export default {
  props: {
    dataInfo: Object,
  },
  data() {
    return {
      categoryList: [],
      likeImgList: [],
      diffImgList: [],
      currentCategory: {},
      categoryFilterList: [],
    };
  },
  watch: {
    dataInfo() {
      if (this.dataInfo) {
        this.categoryFilterList = this.categoryList.filter((j) =>
          this.dataInfo.comData.some((k) => j.categoryNum === k.type)
        );
        this.currentCategory = this.categoryFilterList[0] || {};
        this.likeImgList = this.dataInfo.comData.filter((o) => o.type === this.currentCategory.categoryNum)[0].data;
        this.diffImgList = this.dataInfo.allData;
      }
    },
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    // 获取商标类别
    getCategoryList() {
      getAllCategoryList().then((res) => {
        if (res.code === 0) {
          this.categoryList = res.data;
        }
      });
    },
    // 切换分类
    handleChangeCategory(val) {
      this.currentCategory = this.categoryList.filter((o) => o.categoryNum === val)[0] || {};
      this.likeImgList = this.dataInfo.comData.filter((o) => o.type === val)[0].data;
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  .category {
    margin-bottom: 12px;
    .select {
      width: 150px;
    }
  }
  h4 {
    font-size: 16px;
    margin: 30px 0 16px;
    font-weight: 700;
  }
  .img-list {
    img {
      margin-bottom: 15px;
      padding: 10px;
      border-radius: 20px;
      border: 1px solid #dcdcdc;
    }
  }
}
</style>
