<template>
  <div>
    <ul class="trademark-category-ul">
      <li v-for="(item, index) in trademarkCategoryList" :key="index">
        <div class="trademark-category">
          <span v-if="item.category1Name" @click="showDrawerCategory(index, 1)">编辑</span>
          <p v-if="item.category1Name" @click="showDrawerCategory(index, 1)">
            {{ item.category1Num }} {{ item.category1Name }}
          </p>
          <span v-if="!item.category1Name"><a-icon type="right" @click="showDrawerCategory(index, 1)"/></span>
          <p v-if="!item.category1Name" class="category-placeholder" @click="showDrawerCategory(index, 1)">
            请选择大类
          </p>
          <b
            v-if="item.listTrademarkCategory2 && item.listTrademarkCategory2.length && existSubclass"
            @click="showDrawerCategory(index, 2)"
            >编辑小类</b
          >
        </div>
        <a-table
          :scroll="{ y: 220 }"
          class="trademark-subcategory-table"
          rowKey="category2Num"
          :pagination="false"
          :columns="subCategoryColumns"
          :data-source="item.listTrademarkCategory2"
          v-if="item.listTrademarkCategory2 && item.listTrademarkCategory2.length && existSubclass"
        >
          <template slot="index" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </template>
          <template slot="categoryName" slot-scope="text, record">
            <span>{{ record.category2Name }}</span>
          </template>
          <template slot="categoryNameEn" slot-scope="text, record">
            <span>{{ record.category2NameEn }}</span>
          </template>
        </a-table>
        <div v-if="!existSubclass">
          <div>
            <span class="item-label red-tip from">商标小类名称：</span>
          </div>
          <!-- 多个小类,每个以英文逗号分开。&#10; 列子：Acids for etching enamels;Acrylate;Acetanil -->
          <Input
            type="textarea"
            :rows="3"
            :autosize="{ minRows: 4, maxRows: 7 }"
            :placeholder="placeholder"
            v-model="trademarkCategoryList[index].textareaubclass"
            class="textareaubclass"
          >
          </Input>
        </div>
        <div class="risk-box" v-if="item.riskClassifyList.length > 0 && serviceInfo.countryCode == 'US'">
          <p class="item-label red-tip from risk-title">含有风险小类，需指定关键词</p>
          <div class="tip-box">
            <img src="@/assets/images/infoDetail/tip.svg" alt="" />
            <p>
              <span class="color333">风险小类：</span
              >美国遵循国际尼斯分类，对其申请的商品/服务项目要求具体细化。例如：“计算机周边设备”该项商品在美国是<br />不能被接受，原因是范围太宽泛，需要进一步细化到“键盘、鼠标、扫描仪”等。
            </p>
          </div>
          <p style="color: #ED7B2F;font-size: 14px;margin: 10px 0 0 0;">风险小类被驳回机率较大，请慎重选择</p>
          <a-table
            class="trademark-subcategory-table"
            rowKey="category2NameEn"
            :pagination="false"
            :columns="riskClassCloumns"
            :data-source="item.riskClassifyList"
          >
            <template slot="categoryNameEn" slot-scope="text, record">
              <span>{{ record.category2NameEn }}</span>
            </template>
            <template slot="categoryKeyword" slot-scope="text, record">
              <a-input
                placeholder="请从风险小类{ }内指定一个关键词"
                v-model="record.keyword"
                class="category-keyword"
              />
            </template>
          </a-table>
        </div>
      </li>
    </ul>
    <a-drawer placement="right" :visible="categoryVisible" @close="onClose" :maskClosable="false" :width="720">
      <template slot="title">
        <span v-if="stepIndex == 1">选择商标大类</span>
        <span v-else
          >选择「<a class="a-text-color">{{ categoryCurrent[0].categoryName || categoryCurrent[0].category1Name }}</a
          >」商标小类</span
        >
      </template>
      <a-alert
        message="不确定要选择哪个分类？可尝试搜索竞争对手的商标，然后，查看它的商标详情中申请的分类。如果仍不确定要选择哪个分类，请咨询我们的客服人员。"
        type="info"
        show-icon
        v-if="stepIndex == 1"
      />
      <ul class="trademark-category-list" v-if="stepIndex == 1">
        <li
          :class="{ current: item.check }"
          v-for="item in firstClassList"
          :key="item.categoryNum"
          @click="categoryHandle(item)"
        >
          {{ item.categoryNum }} {{ item.categoryName }}
        </li>
      </ul>
      <dl class="trademark-subcategory trademark-subcategory-search-wrap" v-if="stepIndex == 2">
        <dt>
          <!-- v-model="item.searchtext" -->
          <a-input-search
            v-model="searchtext"
            class="trademark-subcategory-search"
            placeholder="请输入产品关键词小类中文或英文名称检索小类"
            @search="(val) => onSearch(val)"
          />
        </dt>
        <dd class="sub-category-list" v-if="subCategoryList.length">
          <div class="sub-category-table-wrap">
            <table class="sub-category-table">
              <tr>
                <th width="60">选择</th>
                <th>中文名称</th>
                <th>英文</th>
                <th v-if="serviceInfo.countryCode === 'JP'">日文</th>
                <th v-if="serviceInfo.countryCode === 'JP'">群组</th>
                <th v-if="serviceInfo.countryCode === 'KR'">韩文</th>
                <th v-if="serviceInfo.countryCode === 'DE'">德文</th>
              </tr>
              <tr v-for="item in subCategoryList" :key="item.id">
                <td>
                  <a-checkbox v-model="item.check" @change="(e) => changeSubCategory(e, item)"></a-checkbox>
                </td>
                <td>{{ item.categoryName || item.category2Name }}</td>
                <td>
                  <span v-if="serviceInfo.countryCode !== 'CN'">{{ item.categoryNameEn || item.category2NameEn }}</span>
                </td>
                <td v-if="serviceInfo.countryCode === 'JP'">{{ item.categoryNameJp }}</td>
                <td v-if="serviceInfo.countryCode === 'JP'">{{ item.similarGroup }}</td>
                <th v-if="['KR', 'DE'].includes(serviceInfo.countryCode)">{{ item.categoryNameMore }}</th>
              </tr>
            </table>
          </div>
          <a-pagination
            @change="paginationChange"
            v-model="pageInfo.page"
            :pageSize="pageInfo.limit"
            :total="pageInfo.total"
            show-less-items
          />
          <!-- <p v-for="item in subCategoryList" :key="item.id" @click="addSubCategory(item)">
            {{ item.categoryName || item.category2Name }}
            <span v-if="serviceInfo.countryCode !== 'CN'"> - {{ item.categoryNameEn || item.category2NameEn }}</span>
            <a-icon type="plus-square" />
          </p> -->
        </dd>
        <dd class="sub-category-list" v-else>
          <a-empty :image="simpleImage" />
        </dd>
      </dl>
      <dl class="trademark-subcategory" v-if="stepIndex == 2">
        <dt>
          <a-popconfirm
            placement="topRight"
            title="确定清空所有选中的商标类别吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="subcategoryEmptyOk"
            ><span class="subcategory-empty">清空</span></a-popconfirm
          >已选择 {{ subCategoryListCurr.length }}
        </dt>
        <dd class="sub-category-list" v-if="subCategoryListCurr.length">
          <div class="sub-category-table-wrap sub-category-table-wrap-current">
            <table class="sub-category-table">
              <tr v-for="item in subCategoryListCurr" :key="item.id">
                <td width="60">
                  <a-checkbox :checked="true" @change="(e) => changeSubCategory(e, item)"></a-checkbox>
                </td>
                <td>{{ item.categoryName || item.category2Name }}</td>
                <td>
                  <span v-if="serviceInfo.countryCode !== 'CN'">{{ item.categoryNameEn || item.category2NameEn }}</span>
                </td>
                <td v-if="serviceInfo.countryCode === 'JP'">{{ item.categoryNameJp }}</td>
                <td v-if="serviceInfo.countryCode === 'JP'">{{ item.similarGroup }}</td>
                <th v-if="['KR', 'DE'].includes(serviceInfo.countryCode)">{{ item.categoryNameMore }}</th>
              </tr>
            </table>
          </div>
          <!-- <p v-for="(item, index) in subCategoryListCurr" :key="index">
            <a-icon type="delete" @click="subCategoryListDel(item)" />{{ item.categoryName || item.category2Name }}
            <span v-if="serviceInfo.countryCode !== 'CN'"> - {{ item.categoryNameEn || item.category2NameEn }}</span>
          </p> -->
        </dd>
        <dd class="sub-category-list" v-else>
          <a-empty :image="simpleImage" />
        </dd>
      </dl>
      <div class="trademark-category-footer">
        <span class="dingtalk-box" onclick="easemobim.bind({configId: `16969a62-0320-44bd-b2e3-b1cae76fb523`})"
          ><img src="@/assets/images/common/dynamicForm/dingtalk.jpg" />询问客服</span
        >
        <template v-if="existSubclass">
          <a-button type="primary" @click="categoryNext(2)" v-if="stepIndex == 1">
            下一步
          </a-button>
          <a-button :style="{ marginRight: '8px' }" @click="categoryNext(1)" v-if="stepIndex == 2">
            上一步
          </a-button>
          <a-button type="primary" @click="trademarkCategoryOk" v-if="stepIndex == 2">
            提交
          </a-button>
        </template>
        <a-button v-else type="primary" @click="trademarkCategoryOk">
          提交
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue';
// import { signCode, refresh } from '@/api/taxRegister.js'
import { getOneCategoryApi, getSubclassApi, getPageSubCategoryApi } from '@/api/trademarkRegister/trademarkInfo';
import { cloneDeep } from 'lodash';
export default {
  props: {
    value: { type: Array },
    serviceInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      pageInfo: {
        page: 1,
        limit: 20,
        total: 0,
      },
      categoryVisible: false,
      categoryIndex: 0, //选中的分类下标
      trademarkCategoryList: [], //分类数据
      firstClassList: [], //大类列表
      stepIndex: 1,
      categoryCurrent: [],
      // subCategoryColumns: [
      //   {
      //     title: '小类',
      //     dataIndex: 'index',
      //     width: 70,
      //     scopedSlots: { customRender: 'index' },
      //   },
      //   {
      //     title: '中文',
      //     dataIndex: 'categoryName',
      //     scopedSlots: { customRender: 'categoryName' },
      //   },
      //   {
      //     title: '英文',
      //     dataIndex: 'categoryNameEn',
      //     scopedSlots: { customRender: 'categoryNameEn' },
      //   },
      // ],
      subCategoryList: [],
      subCategoryListCurr: [],
      searchtext: '',
      riskClassifyList: [],
      riskClassCloumns: [
        {
          title: '风险小类',
          dataIndex: 'category2NameEn',
          scopedSlots: { customRender: 'categoryNameEn' },
        },
        {
          title: '指定关键词',
          dataIndex: 'keyword',
          scopedSlots: { customRender: 'categoryKeyword' },
        },
      ],
      //是否有小类
      existSubclass: false,
      placeholder: '多个小类,每个以英文分号分开。\n列子：Acids for etching enamels;Acrylate;Acetanil',
    };
  },
  computed: {
    subCategoryColumns() {
      let col = [
        {
          title: '小类',
          dataIndex: 'index',
          width: 70,
          scopedSlots: { customRender: 'index' },
        },
        {
          title: '中文',
          dataIndex: 'categoryName',
          scopedSlots: { customRender: 'categoryName' },
        },
      ];
      let arr = [];
      if (this.serviceInfo.countryCode !== 'CN') {
        col.push({
          title: '英文',
          dataIndex: 'categoryNameEn',
          scopedSlots: { customRender: 'categoryNameEn' },
        });
      }
      if (this.serviceInfo.countryCode === 'JP') {
        arr = [
          {
            title: '商标小类（日文）',
            dataIndex: 'categoryNameJp',
          },
          {
            title: '类似群组',
            dataIndex: 'similarGroup',
          },
        ];
      } else if (this.serviceInfo.countryCode === 'KR') {
        arr = [
          {
            title: '商标小类（韩文）',
            dataIndex: 'categoryNameMore',
          },
        ];
      } else if (this.serviceInfo.countryCode === 'DE') {
        arr = [
          {
            title: '商标小类（德文）',
            dataIndex: 'categoryNameMore',
          },
        ];
      }
      return [...col, ...arr];
    },
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  },
  created() {
    this.existSubclass = this.serviceInfo.existSubclass;
    let oldVal = this.value ? JSON.parse(this.value) : '';
    //商标分类个数:一类一个，4类4个this.serviceInfo.trademarkCategoryCount
    for (let index = 0; index < this.serviceInfo.trademarkCategoryCount; index++) {
      let trademarkCategoryData = oldVal[index] || {
        category1Name: '',
        category1NameEn: '',
        category1Num: '',
        category1Price: 0,
        searchtext: '',
        listTrademarkCategory2: [],
        categoryNameJp: '',
        similarGroup: '',
      };
      let riskClassifyList = [];
      trademarkCategoryData.listTrademarkCategory2.map((item, index) => {
        if (item.category2NameEn && item.category2NameEn.indexOf('{') !== -1) {
          if (this.riskClassifyList.length < 2) {
            riskClassifyList.push(item);
          }
        }
      });
      this.trademarkCategoryList.push({ ...trademarkCategoryData, riskClassifyList });
    }

    this.$emit('input', this.trademarkCategoryList);
    setTimeout(() => {
      this.$store.dispatch('app/setCategoryList', this.trademarkCategoryList);
    }, 1000);

    getOneCategoryApi().then((res) => {
      if (res.code == 0) {
        this.firstClassList = res.data.map((item) => {
          return this.$set(item, 'check', false);
        });
        this.firstClassList = res.data;
      }
    });
  },
  methods: {
    //下一步上一步
    categoryNext(index) {
      if (index == 2) {
        if (this.categoryCurrent.length) {
          this.stepIndex = index;
        } else {
          this.$Message.info('请先选择商标分类');
        }
      } else {
        this.stepIndex = index;
      }
    },
    //切换分页
    paginationChange(page, pageSize) {
      console.log(page, pageSize);
      this.pageInfo.page = page;
      this.getPageSubCategory();
    },
    //获取小类分页
    getPageSubCategory() {
      let data = {
        countryCode: this.serviceInfo.countryCode,
        parentCategoryNum: this.categoryCurrent[0].categoryNum,
        searchName: this.searchtext,
        page: this.pageInfo.page,
        limit: this.pageInfo.limit,
      };
      getPageSubCategoryApi(data).then((res) => {
        if (res.code == 0) {
          this.pageInfo.total = Number(res.data.total);
          this.subCategoryList = res.data.records.map((item) => {
            let checkFlag = false;
            this.subCategoryListCurr.forEach((currItem) => {
              if (currItem.category2Num == item.categoryNum) {
                checkFlag = true;
              }
            });
            this.$set(item, 'check', checkFlag);
            return item;
          });
        }
      });
    },
    //查询小类
    onSearch() {
      // if (!val) {
      //   this.$Message.info('请先输入商标小类名称');
      //   return;
      // }
      this.pageInfo.page = 1;
      if (this.categoryCurrent.length) {
        this.getPageSubCategory();
      }
    },
    //清空小类
    subcategoryEmptyOk() {
      this.subCategoryListCurr = [];
      this.subCategoryList.forEach((sub) => {
        sub.check = false;
      });
    },
    //删除小类
    subCategoryListDel(item) {
      this.subCategoryListCurr = this.subCategoryListCurr.filter((sub) => {
        if (item.category2Num) {
          return sub.category2Num != item.category2Num;
        } else {
          return sub.category2Num != item.categoryNum;
        }
      });
      this.subCategoryList.forEach((sub) => {
        if (sub.categoryNum == item.category2Num) {
          sub.check = false;
        }
      });
    },
    //选择小类
    changeSubCategory(e, item) {
      item.check = e.target.checked;
      if (e.target.checked) {
        let obj = {
          category2Name: item.categoryName,
          category2NameEn: item.categoryNameEn,
          category2Num: item.categoryNum,
          categoryNameMore: item.categoryNameMore || '',
          keyword: [''],
          parentCategoryNum: item.parentCategoryNum,
          categoryNameJp: item.categoryNameJp,
          similarGroup: item.similarGroup,
        };
        this.subCategoryListCurr.push(obj);
      } else {
        this.subCategoryListDel(item);
      }
    },
    // addSubCategory(item) {
    //   let isExistence = this.subCategoryListCurr.filter((sub) => sub.category2Num == item.categoryNum);
    //   if (!isExistence.length) {
    //     let obj = {
    //       category2Name: item.categoryName,
    //       category2NameEn: item.categoryNameEn,
    //       category2Num: item.categoryNum,
    //       categoryNameMore: item.categoryNameMore || '',
    //       keyword: [''],
    //       parentCategoryNum: item.parentCategoryNum,
    //       categoryNameJp: item.categoryNameJp,
    //       similarGroup: item.similarGroup,
    //     };
    //     this.subCategoryListCurr.push(obj);
    //   }
    // },
    //选中大类
    categoryHandle(currItem, searchtext) {
      this.subCategoryList = [];
      this.subCategoryListCurr = [];
      this.searchtext = searchtext || '';
      this.firstClassList.forEach((item) => {
        item.check = false;
        if (item.categoryNum == currItem.categoryNum || item.categoryNum == currItem.category1Num) {
          item.check = true;
        }
      });
      this.categoryCurrent = this.firstClassList.filter((item) => item.check);
      this.onSearch();
    },
    //确定
    trademarkCategoryOk() {
      if (this.subCategoryListCurr) {
        let obj = {
          category1Name: this.categoryCurrent[0].categoryName,
          category1NameEn: this.categoryCurrent[0].categoryNameEn,
          category1Num: this.categoryCurrent[0].categoryNum,
          category1Price: 0,
          searchtext: this.searchtext,
          listTrademarkCategory2: cloneDeep(this.subCategoryListCurr),
        };
        let riskClassifyList = [];
        let isRisk = 0;
        this.subCategoryListCurr.map((item, index) => {
          if (item.category2NameEn && item.category2NameEn.indexOf('{') !== -1) {
            isRisk++;
            if (this.riskClassifyList.length < 2) {
              riskClassifyList.push(item);
            }
          }
        });
        if (isRisk > 2) {
          return this.$Message.info('风险小类最多只能选择2个');
        }
        if (this.subCategoryListCurr.length > 20) {
          return this.$Message.info('商标小类最多只能选择20个');
        }
        this.$set(this.trademarkCategoryList, this.categoryIndex, { ...obj, riskClassifyList });
        this.categoryVisible = false;
        // this.$store.dispatch('app/setCategoryList', this.trademarkCategoryList);
      } else {
        this.$Message.info('请先选择商标小类');
      }
    },
    showDrawerCategory(index, step) {
      //编辑回显
      this.categoryIndex = index;
      this.stepIndex = step;
      this.searchtext = this.trademarkCategoryList[index].searchtext;
      this.categoryHandle(this.trademarkCategoryList[index], this.searchtext);
      this.subCategoryListCurr = cloneDeep(this.trademarkCategoryList[index].listTrademarkCategory2);
      this.categoryVisible = true;
      // this.onSearch();
    },
    onClose() {
      this.categoryVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.trademark-category-ul {
  li {
    padding: 11px 16px;
    background: #fafafa;
    margin-bottom: 24px;
    min-width: 570px;
    .trademark-category {
      width: 280px;
      height: 32px;
      line-height: 32px;
      background: #ffffff;
      border-radius: 2px;
      border: 1px solid #d9d9d9;
      color: #303132;
      padding: 0 16px;
      position: relative;
      span {
        float: right;
        color: #3a7fff;
        cursor: pointer;
      }
      .anticon-right {
        color: #c1c1c1;
      }
      p {
        margin: 0;
      }
      .category-placeholder {
        color: #c1c1c1;
      }
      b {
        padding: 0 16px;
        height: 32px;
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #3a7fff;
        position: absolute;
        right: -110px;
        top: -1px;
        text-align: center;
        line-height: 32px;
        color: #3a7fff;
        font-weight: normal;
        cursor: pointer;
      }
    }
  }
}
.trademark-subcategory-table {
  width: 540px;
  border: 1px;
  margin-top: 11px;
  /deep/.ant-table-thead > tr > th {
    padding: 12px;
    background: #f7faff;
    border-bottom: 1px solid #f0f0f0;
  }
  /deep/.ant-table-tbody > tr > td {
    padding: 6px 12px;
    border-bottom: 1px solid #f0f0f0;
    line-height: 20px;
  }
  /deep/.ant-table-content {
    border: 1px solid #f0f0f0;
    background: #fff;
  }
}
.trademark-category-footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  /deep/.ant-btn {
    border-radius: 0;
  }
}

.trademark-category-list {
  flex-wrap: wrap;
  justify-content: space-between;
  width: 700px;
  margin-top: 32px;
  li {
    float: left;
    width: 110px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #d9d9d9;
    margin-right: 30px;
    margin-bottom: 24px;
    cursor: pointer;
  }
  .current {
    color: #3a7fff;
    border: 1px solid #3a7fff;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 26px;
      height: 26px;
      background: url('./../../../assets/images/common/dynamicForm/icon_current.png') no-repeat;
      background-size: cover;
    }
  }
}
.transfer-box {
  /deep/.ant-transfer-list {
    display: block;
    width: 100% !important;
  }
  /deep/.ant-transfer-operation {
    width: 100%;
    text-align: center;
    .ant-btn {
      transform: rotate(90deg);
      display: inline-block;
      margin: 14px 4px;
    }
  }
}
.trademark-subcategory {
  // border: 1px solid #d9d9d9;
  dt {
    // border-bottom: 1px solid #d9d9d9;
    padding-top: 8px;
    overflow: hidden;
  }
  dd {
    p {
      position: relative;
      margin: 5px 0 0;
      padding: 6px 30px 6px 16px;
      cursor: pointer;
    }
  }
  .sub-category-table-wrap {
    padding: 10px 0;
    overflow-y: auto;
    height: 400px;
    margin-bottom: 10px;
  }
  .sub-category-table-wrap-current {
    height: 260px;
  }
}
.sub-category-list {
  p:hover {
    background: rgba(58, 127, 255, 0.04);
    .anticon {
      display: block;
    }
  }
  .anticon {
    position: absolute;
    top: 10px;
    right: 10px;
    display: none;
    color: #c0c4cb;
  }
  /deep/.ant-empty {
    margin-top: 100px;
  }
}
.trademark-subcategory-search-wrap {
  border: none;
  dt {
    border: none;
    padding: 0;
  }
  .anticon-plus-square {
    float: right;
  }
}
.trademark-subcategory-search {
  /deep/.ant-input {
    border-radius: 0px;
  }
}
.subcategory-empty {
  float: right;
  color: #3a7fff;
  cursor: pointer;
}

.risk-box {
  margin-top: 24px;
  p {
    display: inline-block;
    vertical-align: top;
    margin-bottom: 0;
  }
  .tip-box {
    padding: 14px;
    background-color: #eff9ff;
    .color333 {
      color: #333;
    }
  }
  .subclass-table {
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin-top: 12px;
  }
}
.category-keyword {
  width: 300px;
}
.dingtalk-box {
  float: left;
  color: #3a7fff;
  margin-top: 8px;
  cursor: pointer;
  img {
    width: 16px;
    margin-right: 6px;
    position: relative;
    top: -1px;
  }
}
.a-text-color {
  color: #3370ff !important;
}
.sub-category-table {
  border: 1px solid #f0f0f0;
  width: 100%;
  th,
  td {
    border: 1px solid #f0f0f0;
    font-size: 12px;
    color: #303132;
    padding: 8px 8px 8px 16px;
  }
  th {
    background: #fafafa;
  }
}
.textareaubclass {
  width: 540px !important;
}
</style>
