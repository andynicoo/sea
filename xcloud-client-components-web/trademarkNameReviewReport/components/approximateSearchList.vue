<template>
  <div class="container">
    <h4>2.1.1 同类别近似检索详情列表</h4>
    <div class="category">
      <span>选择大类：</span>
      <a-select @change="handleChangeCategory" class="select" :value="currentCategory.categoryNum" placeholder="选择大类">
        <a-select-option v-for="(item, index) in dataInfo.data" :key="index" :value="item.categoryNum">{{ item.title }}</a-select-option>
      </a-select>
    </div>
    <table-list :dataSource="dataSourceSimilar" :loading="loading" :columns="columnsSimilar" :title="`同类近似检索详情列表(${currentCategory.title ? currentCategory.title : '--'})`" />
    <h4>2.1.2 全类别近似检索结果详情列表</h4>
    <table-list :dataSource="dataSourceAll" :loading="loading" :columns="columnsAll" title="全类别近似检索结果" />
  </div>
</template>

<script>
import TableList from './tableList.vue';
import { columns } from './columns';
export default {
  props: {
    dataInfo: Object,
  },
  components: {
    TableList,
  },
  watch: {
    dataInfo: {
      handler(val) {
        let _category = val.data[0];
        if (_category) {
          this.currentCategory = _category;
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      loading: false,
      // 当前商标分类
      currentCategory: {
        trademarkSearchCheckResultList: [],
      },
    };
  },
  computed: {
    // 同类 数据源
    dataSourceSimilar() {
      const arr = this.currentCategory.trademarkSearchCheckResultList.filter((item) => item.typeName === '同类目检索情况');
      return this.getFiveTable(arr);
    },
    // 同类 列字段
    columnsSimilar() {
      let _columns = [...columns];
      _columns.splice(0, 2);
      return [
        {
          title: '检索维度',
          dataIndex: 'dimensionName',
          align: 'center',
          customRender: (value, _, index) => {
            return this.mergeSpan(_, index, 'dimensionName', this.dataSourceSimilar);
          },
        },
        {
          title: '检索项',
          dataIndex: 'queryItem',
          align: 'center',
          scopedSlots: { customRender: 'queryItem' },
          customRender: (value, _, index) => {
            return this.mergeSpan(_, index, 'queryItem', this.dataSourceSimilar);
          },
        },
        ..._columns,
      ].filter((item) => item.dataIndex !== 'categoryBig');
    },
    // 全类/跨类 数据源
    dataSourceAll() {
      const arr = this.currentCategory.trademarkSearchCheckResultList.filter((item) => item.typeName === '跨类目检索情况');
      return this.getFiveTable(arr);
    },
    // 全类/跨类 列字段
    columnsAll() {
      let _columns = [...columns];
      _columns.splice(0, 2);
      return [
        {
          title: '检索维度',
          dataIndex: 'dimensionName',
          align: 'center',
          customRender: (value, _, index) => {
            return this.mergeSpan(_, index, 'dimensionName', this.dataSourceAll);
          },
        },
        {
          title: '检索项',
          dataIndex: 'queryItem',
          scopedSlots: { customRender: 'queryItem' },
          align: 'center',
          customRender: (value, _, index) => {
            return this.mergeSpan(_, index, 'queryItem', this.dataSourceAll);
          },
        },
        ..._columns,
      ];
    },
  },
  methods: {
    // 迁移中台相关代码逻辑
    // 获取前五项
    getFiveTable(arr) {
      const result = arr.reduce((acc, obj) => {
        const temp = obj;
        if (obj.dimensionName === '整体检索') {
          const arr1 = arr.filter((item) => item.dimensionName === '整体检索').slice(0, 5);
          const typeCount = acc.filter((item) => item.dimensionName === obj.dimensionName).length;
          if (typeCount < 5) {
            acc.push(temp);
            arr1.length === typeCount + 1 ? (temp.isLast = true) : (temp.isLast = false);
          }
        } else {
          temp.isLast = true;
          const arr2 = arr.filter((item) => item.dimensionName !== '整体检索');
          if (arr2.length) {
            if (arr2[0].queryItem === obj.queryItem) {
              const arrFirstItem = arr.filter((item) => item.queryItem === obj.queryItem).slice(0, 5);
              const typeCount = acc.filter((item) => item.queryItem === obj.queryItem).length;
              if (typeCount < 5) {
                acc.push(temp);
                arrFirstItem.length === typeCount + 1 ? (temp.isLast = true) : (temp.isLast = false);
              }
            } else {
              if (!acc.find((item) => item.queryItem === obj.queryItem)) {
                temp.isLast = true;
                acc.push(temp);
              }
            }
          }
        }
        return acc;
      }, []);
      return result;
    },
    // 合并单元格
    mergeSpan(_, index, title, data) {
      const resArr = this.mergeSpanData(title, data);
      const sing = resArr.find((item) => item.startIndex === index);
      const url = `https://www.iipto.com/fastResult/brandLike?name=${_[title]}`;
      if (sing) {
        return {
          children:
            title === 'queryItem' ? (
              <a class="link" href={url} target="_blank">
                {_[title]}
              </a>
            ) : (
              _[title]
            ),
          attrs: {
            rowSpan: sing.spanNum,
          },
        };
      } else {
        return {
          children: _[title],
          attrs: {
            rowSpan: 0,
          },
        };
      }
    },
    // 合并单元格算法
    mergeSpanData(title, data) {
      let startIndex = 0;
      let spanNum = 0;

      const result = [];
      // 类型 维度
      let preVal = '';
      data.forEach((item, index) => {
        const currentVal = item[title];
        // 当前项与前一项相同. 则合并数加1, 第一次需要加2
        if (preVal === currentVal) {
          spanNum += 1;
          result.push({
            startIndex: index,
            spanNum: 0,
          });
          // 如果是最后一次则插入结果
          if (index === data.length - 1) {
            result.push({
              startIndex,
              spanNum,
            });
          }
        } else {
          // 当前项与前一项不同, 则插入累计结果
          if (index !== 0) {
            // 插入上一次的结果
            result.push({
              startIndex,
              spanNum,
            });
          }
          startIndex = index;
          spanNum = 1;
          preVal = currentVal;
          // 如果是最后一次则插入结果
          if (index === data.length - 1) {
            result.push({
              startIndex,
              spanNum,
            });
          }
        }
      });
      return result;
    },
    // 选择大类
    handleChangeCategory(val) {
      console.log(this.dataInfo);
      this.currentCategory = this.dataInfo.data.filter((item) => item.categoryNum === val)[0];
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
}
a.link {
  color: #00a3ff;
}
</style>
