<template>
  <div class="me-pa-2">
    <div class="infomation">
      <div class="menu" :style="{ height: menuHeight }">
        <div class="tit" v-if="$route.query.type == 1">
          {{ $t('overView.guideToUse') }}
        </div>
        <div class="tit" v-if="$route.query.type == 2">
          {{ $t('overView.shopeeTrends') }}
        </div>
        <div>
          <ul>
            <li :class="{ cur: isGlobalSearch == true }">
              <span v-show="isGlobalSearch == true"></span>
              {{ $t('overView.allClass') }}
            </li>
            <li
              v-for="item in newTypeList"
              :key="item.name"
              :class="{
                cur: item.classifyId == classifyId && isGlobalSearch == false
              }"
              @click="trunRightNews(item)"
            >
              <span v-show="item.contentId == $route.query.newsId"></span>
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="infolist">
        <div class="search-form">
          <b>
            {{ name }}
          </b>
          <span class="span">
            <a-input-search
              :placeholder="$t('common.search')"
              v-model="searchVal"
              allowClear
              :enter-button="$t('overView.searchInput')"
              @search="handleSearch()"
            ></a-input-search>
          </span>
        </div>
        <div class="content">
          <template v-if="newList.length !== 0">
            <ul>
              <li
                v-for="item in newList"
                :key="item.contentId"
                @click="routerToNews(item)"
              >
                {{ item.title }}
                <!-- <span>{{ item.createTime }}</span> -->
              </li>
            </ul>
          </template>
          <template v-else>
            <div
              style="height: 500px; background: #fff; text-align: center; color: #999"
            >
              <img style="margin-top: 56px" src="@/assets/images/no-data.png" />
              <p>{{ $t('common.noData') }}</p>
            </div>
          </template>
          <!-- newList.length !== 0 -->
          <!-- {{ paginationData }} -->
          <div
            v-if="newList.length !== 0"
            class="center me-text-center me-mt-4"
          >
            <a-space>
              共有 {{ paginationData.total }} 条数据
              <a-pagination
                show-size-changer
                show-quick-jumper
                :default-current="paginationData.current"
                :total="paginationData.total"
                @showSizeChange="onShowSizeChange"
                @change="changePagination"
                :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
              />
            </a-space>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Basic from '@/api/basic'
export default {
  components: {},
  data() {
    return {
      paginationData: {},
      searchVal: '', // 搜索项
      newTypeList: [], // 左侧列表
      newList: [], // 右侧列表
      classifyId: 0, // 当前选中的查询分类，初始化时选择第一个，后面按选择查询的赋值
      name: '', // 当前选中的查询分类名称，初始化时选择第一个，后面按选择查询的赋值
      isGlobalSearch: false
    }
  },
  mounted() {
    this.getNewTypeList()
    // 初始化左侧列表后，请求右侧信息
    this.getNewList()
  },
  computed: {
    menuHeight() {
      return 88 + this.newTypeList.length * 40 + 'px'
    }
  },
  watch: {
    classifyId: function(val) {
      if (this.classifyId != 0) {
        //  this.getNewList()
      }
    }
  },
  methods: {
    // 搜索
    handleSearch() {
      this.isGlobalSearch = true
      if (this.searchVal == '' || this.searchVal == null) {
        this.getNewList('list')
      } else {
        // 有搜索内容，全局搜索
        this.getNewList('search')
      }
    },
    // changePagination(page) {
    //   this.paginationData = page
    //   this.getStoreList()
    // },
    getNewTypeList() {
      let params = {
        module: this.$route.query.type,
        size: 10,
        current: 1
      }
      Basic.getNewsTypeList(params).then((res) => {
        if (res.code == 0) {
          this.newTypeList = res.data
          // console.log(this.newTypeList);
          // 从首页来，选择第一个分类,否则按参数分类id进行cur
          if (this.$route.query.listId == -1) {
            this.newTypeList.length > 0
              ? (this.classifyId = this.newTypeList[0].classifyId)
              : ''
          } else {
            this.classifyId = this.$route.query.listId
          }

          this.newTypeList.length > 0
            ? (this.name = this.newTypeList[0].name)
            : (this.name = '')
          this.getNewList('list')
        }
      })
    },
    // 点击左侧列表，重置右方新闻
    trunRightNews(item) {
      this.isGlobalSearch = false
      this.classifyId = item.classifyId
      this.name = item.name
      this.getNewList('list')
    },
    // 初始化左侧列表后，请求右侧信息, val==list,列表搜索，val==search 搜索全局
    getNewList(val) {
      if (this.classifyId == 0) {
        return false
      }
      var params
      if (val == 'list') {
        this.searchVal = ''
        params = {
          module: this.$route.query.type,
          classifyId: this.classifyId,
          title: this.searchVal,
          size: this.paginationData.size,
          current: this.paginationData.current
        }
      } else {
        params = {
          module: this.$route.query.type,
          title: this.searchVal,
          size: this.paginationData.size,
          current: this.paginationData.current
        }
      }

      Basic.getNewsList(params).then(({ data }) => {
        // console.log(data)
        this.newList = data.records
        this.paginationData = this.getPageFromResp(data)
      })
    },
    //跳转到单个新闻
    routerToNews(item) {
      this.$router.push({
        path: `/information/info?type=${item.module}&listId=${item.classifyId}&newsId=${item.contentId}`
      })
    },
    changePagination(current, size) {
      this.$data.paginationData = {
        ...this.$data.paginationData,
        current: current,
        size: size
      }
      this.getNewList('list')
    },
    onShowSizeChange(current, pageSize) {
      this.paginationData.size = pageSize
      this.getNewList()
    }
  }
}
</script>
<style lang="scss" scoped>
.infomation {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  justify-content: space-between;
  .menu {
    width: 200px;
    background: #fff;
    margin-right: 20px;
    .tit {
      line-height: 35px;
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #1a1a1a;
      padding-left: 20px;
      border-bottom: 1px solid #efefef;
    }
    ul {
      padding-left: 0px;
      li {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #626466;
        line-height: 40px;
        cursor: pointer;
        padding-left: 23px;
        position: relative;
        background: #fff;
        span {
          display: none;
          position: absolute;
          height: 14px;
          width: 2px;
          background: #ff720d;
          top: 14px;
          left: 0px;
        }
      }
      li:hover {
        background: #fafafa;
      }
      li.cur {
        background: #fff4ed;
        color: #ff720d;
        span {
          display: block;
        }
      }
    }
  }
  .infolist {
    flex: 1;
    // max-width: 1200px;
    // width: 1200px;
    background: #fff;
    margin-left: 20px;
    margin: 0 auto;
    .search-form {
      display: flex;
      justify-content: flex-end;
      padding: 20px;
      b {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #1a1a1a;
        line-height: 22px;
        padding-left: 10px;
      }
      .search-wrap {
        padding-right: 5px;
      }

      .span {
        margin-left: auto;
        display: flex;
      }
      .searchint {
        height: 33px;
        width: 220px;
        // margin-right: auto;
      }
      .searchbtn {
        margin-left: 10px;
      }
    }
    .content {
      margin-bottom: 30px;
      ul {
        padding-left: 0px;
        li {
          line-height: 44px;
          height: 44px;
          background: #ffffff;
          border-bottom: 1px solid #ebebeb;
          padding-left: 24px;
          font-size: 14px;
          cursor: pointer;
          span {
            color: #9a9ca1;
            float: right;
            padding-right: 16px;
          }
        }
        li:hover {
          background: #fafafa;
        }
      }
    }
  }
}
</style>
