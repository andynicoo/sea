<template>
  <div>
    <ul class="sales-links-ul">
      <li v-for="(item, index) in salesLinks" :key="index">
        <a-icon type="close" class="del-links" @click="delLinks(index)" v-if="salesLinks.length > 1" />
        <Select
          v-model="item.category2Num"
          placeholder="请选择已添加的小类"
          clearable
          @on-change="(val) => linksChange(val, item)"
        >
          <Option v-for="item in subCategoryList" :value="item.category2Num" :key="item.category2Num"
            >{{ item.category2Name }} / {{ item.category2NameEn }}</Option
          >
        </Select>
        <br />
        <Input v-model="item.marketHref" placeholder="请输入销售链接" clearable></Input>
      </li>
    </ul>
    <span class="add-links" @click="addLinks">添加更多</span>
  </div>
</template>

<script>
import { uniqBy, cloneDeep } from 'lodash';
export default {
  props: {
    value: { type: String | Array },
    serviceInfo: {
      type: Object,
      default: {},
    },
  },
  watch: {
    '$store.state.app.categoryList': {
      handler(newVal) {
        this.subCategoryList = [];
        newVal.forEach((ele) => {
          this.subCategoryList.push(...ele.listTrademarkCategory2);
        });
        this.subCategoryList = uniqBy(this.subCategoryList, 'category2Num');
        if (this.initFlag) {
          this.initFlag = false;
          this.salesLinks = [];
          if (this.value) {
            JSON.parse(this.value).forEach((item) => {
              let category2Num = '';
              this.subCategoryList.forEach((sub) => {
                if (sub.category2NameEn == item.category2NameEn) {
                  category2Num = sub.category2Num;
                }
              });
              this.salesLinks.push({
                category2Name: item.category2Name,
                category2NameEn: item.category2NameEn,
                marketHref: item.marketHref,
                category2Num: category2Num,
              });
            });
          } else {
            this.salesLinks.push({
              category2Name: '',
              category2NameEn: '',
              marketHref: '',
              category2Num: '',
            });
          }
          this.$emit('input', this.salesLinks);
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      initFlag: true,
      salesLinks: [],
      subCategoryList: [],
    };
  },
  methods: {
    //添加链接
    addLinks() {
      this.salesLinks.push({
        category2Name: '',
        category2NameEn: '',
        marketHref: '',
        category2Num: '',
      });
      console.log(this.moduleListData, 123);
    },
    //切换链接
    linksChange(val, item) {
      if (val) {
        this.subCategoryList.forEach((sub) => {
          if (sub.category2Num == val) {
            item.category2Name = sub.category2Name;
            item.category2NameEn = sub.category2NameEn;
            item.category2Num = sub.category2Num;
          }
        });
      } else {
        item.category2Name = '';
        item.category2NameEn = '';
        item.category2Num = '';
      }
    },
    //删除链接
    delLinks(index) {
      if (this.salesLinks.length > 1) {
        this.salesLinks.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.sales-links-ul {
  margin-bottom: 0;
  > li {
    background: #fafafa;
    width: 376px;
    padding: 16px;
    margin-bottom: 16px;
    position: relative;
    /deep/.ivu-select {
      margin-bottom: 13px;
    }
  }
  .del-links {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #c0c4cb;
    cursor: pointer;
    &:hover {
      color: #666;
    }
  }
}
.add-links {
  color: #3a7fff;
  cursor: pointer;
  position: relative;
  top: -15px;
}
</style>
