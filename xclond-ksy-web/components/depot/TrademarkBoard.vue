<template>
  <div class="trademark-board">
    <div class="title">商标分类数据看板</div>
    <div class="section">
      <div class="header">
        <span>商标分类</span>
        <div class="top"></div>
        <a-select
          show-search
          placeholder="请选择分类"
          style="width: 200px"
          class="cateSelect"
          v-model="cate"
          allowClear
          @change="handleChange"
          v-if="isSelect"
        >
          <a-select-option :value="item.categoryNum" v-for="(item, index) in cateList" :key="index">
            {{ Number(item.categorySort) > 9 ? item.categorySort + "类 " : "0" + item.categorySort + "类 "
            }}{{ item.categoryName }}
          </a-select-option>
        </a-select>
      </div>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :loading="smallLoading"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
      >
        <div
          slot="name"
          slot-scope="text, record, index"
          :class="{ rang: true, rang1: index < 3 && listPage.current == 1 }"
        >
          <div>{{ 10 * Number(listPage.current - 1) + (index + 1) }}</div>
        </div>
        <div slot="categoryName" slot-scope="text, record">
          <div>
            {{ Number(record.categoryNum) > 9 ? record.categoryNum + "类 " : "0" + record.categoryNum + "类 "
            }}{{ record.categoryName }}
          </div>
        </div>
        <div slot="smallCategoryName" slot-scope="text, record" @mouseenter="viewTranslate(record)">
          <a-tooltip :overlayStyle="{ 'max-width': '560px' }">
            <template slot="title">
              <div class="translate-box">
                <div class="translate-box-top">{{ text }}</div>
                <div class="translate-box-bottom">
                  参考翻译：<span v-for="(trans, tIndex) in translateArr" :key="tIndex">{{
                    tIndex === translateArr.length - 1 ? trans.val : trans.val + "；"
                  }}</span>
                </div>
              </div>
            </template>
            <div class="des-content flex1 ellipsis">
              {{ text }}
            </div>
          </a-tooltip>
        </div>
      </a-table>
      <div class="pagination ksy-text-right ksy-mt-4" v-show="data.length">
        <a-pagination
          :current="Number(listPage.current) || 1"
          :total="Number(listPage.total) || 0"
          :pageSize="10"
          @change="change"
        />
      </div>
    </div>
  </div>
</template>

<script>
import trademark from "@/apis/trademark";
export default {
  data() {
    return {
      columns: [
        {
          title: "排名",
          dataIndex: "name",
          key: "name",
          width: 120,
          scopedSlots: { customRender: "name" },
        },
        {
          title: "大类",
          dataIndex: "categoryName",
          key: "categoryName",
          scopedSlots: { customRender: "categoryName" },
          width: 150,
        },
        {
          title: "小类",
          dataIndex: "smallCategoryName",
          key: "c",
          width: 400,
          scopedSlots: { customRender: "smallCategoryName" },
          ellipsis: true,
        },
        {
          title: "美标申请量",
          dataIndex: "number",
          key: "number",
          ellipsis: true,
          align: "center",
        },
      ],
      data: [],
      listPage: {
        current: 1,
        total: 1,
        size: 10,
      },
      cate: [],
      isSelect: false,
      translateArr: [],
    };
  },
  props: {
    cateList: {
      type: Array,
      default: [],
    },
    smallList: {
      type: Object,
      default: {},
    },
    cateSmall: {
      default: [],
    },
    smallLoading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    cateSmall(val) {
      this.cate = val ? val : [];
    },
    smallList(val) {
      this.listPage.current = val.current;
      this.listPage.total = val.total;
      this.data = val.records;
    },
  },
  mounted() {
    this.isSelect = true;
  },
  methods: {
    change(val) {
      let json = {
        page: val,
        categoryNum: this.cate.length == 0 ? "" : this.cate,
      };
      this.$emit("changeSmallPage", json);
    },
    handleChange(val) {
      let json = {
        page: 1,
        categoryNum: val ? val : "",
      };
      this.$emit("changeSmallPage", json);
    },
    async viewTranslate(item) {
      const translateArr = [];
      let categoryNames = [item.smallCategoryName];
      const params = { countryCode: "US", categoryNames: categoryNames, status: 1 };
      const res = await this.$axiosApi(trademark.getTranslationText.url, trademark.getTranslationText.methods, params);
      if (res.code === 0) {
        if (res.data.length > 0) {
          categoryNames.forEach((v) => {
            let temp = {
              key: v,
              val: "",
            };
            const cur = res.data.filter((tras) => tras.categoryNameEn.toLowerCase() === v.toLowerCase());
            if (cur.length) {
              temp.val = cur[0]?.categoryName;
              translateArr.push(temp);
            }
          });
          this.translateArr = translateArr.filter((trans) => trans.val);
        } else {
          this.translateArr = [];
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.trademark-board {
  .title {
    font-size: 24px;
    font-weight: 500;
    color: @textColor;
    border-left: 3px solid #3370ff;
    padding-left: 4px;
    line-height: 24px;
    margin-bottom: 20px;
    margin-top: 24px;
  }
  .section {
    background: #ffffff;
    margin: 20px 0 100px;
    padding: 16px;

    .header {
      overflow: hidden;
      margin-bottom: 20px;

      span {
        float: left;
        font-size: 18px;
        line-height: 26px;
        color: @textColor;
      }

      .top {
        width: 72px;
        height: 26px;
        background: url("@/assets/images/depot/top.svg") no-repeat;
        background-size: contain;
        float: left;
        margin-top: 6px;
      }

      .cateSelect {
        float: right;
      }
    }

    .rang {
      font-size: 14px;
      color: #919498;
      line-height: 22px;
      padding-left: 5px;
    }

    .rang1 {
      padding-left: 0;
      width: 22px;
      color: #ffffff;
      background: #ffae01;
      text-align: center;
    }
  }
  .translate {
    &-box {
      font-size: 12px;
      line-height: 20px;
      &-top {
        //.line-clamp(2);
        color: #303132;
      }
      &-bottom {
        border-top: 1px solid #f0f0f0;
        margin-top: 8px;
        color: #606266;
        //.line-clamp(2);
        padding-top: 8px;
      }
    }
  }
}
</style>
