<template>
  <div class="mainContent trademarkMonitoring">
    <div class="my-card">
      <p class="title">
        <img src="@/assets/images/setting/settingIcon.svg" alt="" v-if="PROCESS_ENV.NODE_PLA === 'kby'" />
        <img src="@/assets/images/setting/settingIconwg.svg" alt="" v-if="PROCESS_ENV.NODE_PLA === 'wg'" />
        我的收藏
        <span class="tips">系统为您查询了美国注册状态，如需查询其他国家，请通过“查注册风险”查询</span>

        <span class="fr">
          <span
            class="time-sort"
            :class="{ 'sort-current': this.trademarkAiNameTimeSort === 'desc' }"
            @click="timeSort('desc')"
            >按时间倒序排列
          </span>
          <span
            class="time-sort"
            :class="{ 'sort-current': this.trademarkAiNameTimeSort === 'asc' }"
            @click="timeSort('asc')"
            >按时间正序排列
          </span>
        </span>
      </p>

      <div class="trademarkMonitoring-content">
        <div>
          <Item
            @update="timeSort(trademarkAiNameTimeSort)"
            v-for="(item, index) in list"
            :key="index"
            :item="item"
            :index="index + 1"
          />
        </div>
        <div class="pagination-box" v-if="list.length">
          <a-pagination
            v-model="pagePagination.current"
            :total="pagePagination.total"
            show-less-items
            @change="pageChagne"
          />
        </div>
        <a-empty class="empty" v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { mytrademarkRecord } from '@/api/trademarkName';
import Item from './Item.vue';

export default {
  data() {
    return {
      pagePagination: {
        current: 1,
        total: 0,
      },
      /** 取名时间排序 asc:升序 desc:降序 */
      trademarkAiNameTimeSort: 'desc',
      list: [],
    };
  },
  components: { Item },
  mounted() {
    this.getList();
  },
  methods: {
    //获取列表
    getList() {
      let parames = {
        page: this.pagePagination.current,
        limit: 10,
        trademarkAiNameTimeSort: this.trademarkAiNameTimeSort,
      };
      mytrademarkRecord(parames).then((res) => {
        const data = res.data;
        this.list = data.records || {};
        this.pagePagination.current = Number(data.current);
        this.pagePagination.total = Number(data.total);
      });
    },
    //切换分页
    pageChagne(page, pageSize) {
      this.pagePagination.current = page;
      this.getList();
    },

    //排序
    timeSort(type) {
      this.trademarkAiNameTimeSort = type;
      this.pagePagination.current = 1;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.trademarkMonitoring {
  background: none;
  box-shadow: none;
}
.trademarkMonitoring-header {
  font-size: 14px;
  background: #ffffff;
  padding: 24px;
  position: relative;
  > button {
    position: absolute;
    top: 24px;
    right: 24px;
  }
}
.trademarkMonitoring-content {
  > ul {
    margin-top: 10px;
  }
  background: #ffffff;
  /deep/.ivu-input,
  /deep/.ivu-select-selection {
    border-radius: 0;
  }
  .searchBtn,
  .resetBtn {
    line-height: 30px;
  }
  .resetBtn:hover,
  .resetBtn:focus {
    color: #3370ff;
    border-color: #3370ff;
  }
}
.trademarkMonitoring-header-title {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.6);
  line-height: 32px;
  img {
    width: 32px;
  }
  span {
    font-size: 24px;
    padding-left: 8px;
    position: relative;
    top: 3px;
  }
  .my-trademarkMonitoring {
    margin-right: 35px;
    color: rgba(0, 0, 0, 0.9);
    font-weight: bold;
    cursor: pointer;
    border-radius: 4px;
    padding: 0 8px;
    &:hover {
      background: #e8eefb;
    }
  }
  .my-trademarkMonitoring-update {
    cursor: pointer;
    border-radius: 4px;
    padding: 0 8px;
    &:hover {
      background: #e8eefb;
    }
  }
  .queryTypeCurr {
    background: #e8eefb;
    span {
      color: #3370ff;
    }
  }
}
.categoryList-box {
  margin: 6px 0 0;
  width: 105%;
  span {
    display: inline-block;
    width: 168px;
    height: 52px;
    line-height: 52px;
    margin-right: 14px;
    background: #f5f7fa;
    border-radius: 4px 4px 4px 4px;
    padding: 0px 20px;
    color: rgba(0, 0, 0, 0.9);
    margin-top: 14px;
    cursor: pointer;
    &:hover {
      background: #e8eefb;
    }
    b {
      float: right;
      font-size: 20px;
    }
  }
  .category-current {
    background: #e8eefb;
    b {
      color: #3370ff;
    }
  }
}
.time-sort {
  // float: right;
  margin-right: 20px;
  font-size: 14px;
  cursor: pointer;
}
.sort-current {
  color: #3370ff;
}
.trademark-info-list {
  min-height: 162px;
  display: flex;
  font-size: 14px;
  .trademark-info-con {
    h2 {
      line-height: 24px;
      span {
        vertical-align: top;
        display: inline-block;
        width: 52px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        background: rgba(178, 201, 255, 0.2);
        border-radius: 1px;
        font-size: 12px;
        color: #3370ff;
        margin-left: 32px;
      }
      .registration-fail {
        background: #fff1f0;
        color: #ff5f61;
      }
    }
    .bottom {
      .des {
        color: rgba(0, 0, 0, 0.6);
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        /*限制在一个块元素显示的文本的行数*/
        -webkit-box-orient: vertical;
        height: 28px;
        line-height: 28px;
        span {
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
    flex-grow: 2;
  }
  .trademark-info-operation {
    width: 110px;
    text-align: right;
    button {
      margin-top: 28px;
      &:hover {
        color: red;
        border-color: #d9d9d9;
      }
    }
    p {
      color: #3a7fff;
      margin-top: 13px;
      margin-right: 16px;
      cursor: pointer;
    }
  }
  .trademark-info-img {
    width: 133px;
    padding-right: 27px;
    span {
      display: flex;
      width: 108px;
      height: 108px;
      border-radius: 2px;
      border: 1px solid #d9d9d9;
      align-items: center;
      justify-content: center;
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
}
.pagination-box {
  text-align: right;
  border-top: 1px solid #f0f0f0;
  padding-top: 24px;
}
.empty {
  margin: 50px 0;
}

.mainContent {
  display: inline-block;
  width: 964px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  .my-card {
    .title {
      padding-bottom: 22px;
      font-size: 20px;
      font-weight: 500;
      border-bottom: 1px solid #ebebeb;
      .tips {
        font-size: 14px;
        color: #9a9ca1;
        font-weight: 400;
      }
      img {
        vertical-align: middle;
      }
    }
    form {
      margin-top: 24px;
    }
    .bt {
      width: 100px;
      height: 40px;
      border-radius: 5px;
    }
  }
}
.collect-item:last-child {
  border-bottom: 0;
}
</style>
