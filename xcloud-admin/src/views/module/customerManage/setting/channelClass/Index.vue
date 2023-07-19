<template>
  <div class="channel-class">
    <a-tabs v-model:activeKey="formModal.code" @change="getList()">
      <a-tab-pane key="leadSourceLarge" tab="线索大类"></a-tab-pane>
      <a-tab-pane key="leadSourceSmallList" tab="线索小类"></a-tab-pane>
    </a-tabs>
    <div class="search-wrap">
      <a-form ref="ruleFormRef" layout="inline" :model="formModal">
        <a-form-item label="关键字" name="dictValue">
          <a-input v-model:value="formModal.dictValue" placeholder="请输入" style="width: 240px" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="getList()">
              <SearchOutlined />
              <span>搜索</span>
            </a-button>
            <a-button type="primary" ghost @click="reset()">
              <SyncOutlined />
              <span>重置</span>
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
      <div class="btn-wrap">
        <a-space>
          <a-button
            type="primary"
            @click="relevanceDictFun()"
            v-show="formModal.code === 'leadSourceLarge'"
            v-if="useButton('xcloudplat_customer_setting_channelClass_relevance')"
          >
            关联小类
          </a-button>
          <a-button
            type="primary"
            @click="addDictFun()"
            v-if="useButton('xcloudplat_customer_setting_channelClass_add')"
          >
            新增
          </a-button>
        </a-space>
      </div>
    </div>
    <div class="list-wrap">
      <a-spin :spinning="loadding">
        <div class="class-li" v-for="(li, index) of list" :key="index">
          <div class="li-title">
            <span class="hd">{{ formModal.code === 'leadSourceLarge' ? '大类' : '小类' }}：</span>
            <span class="bd">{{ li.dictValue }}</span>
            <span
              class="icon-btn"
              @click="updateDictNameFun(li)"
              v-if="useButton('xcloudplat_customer_setting_channelClass_edit')"
            >
              <EditOutlined />
            </span>
          </div>
          <div class="li-item">
            <template v-if="formModal.code === 'leadSourceLarge'">
              <template v-for="(item, index) of li.children || []">
                <div class="item-span" v-if="item.flagSelect" :key="index" :title="item.dictValue">
                  <span class="hd">小类：</span>
                  <span class="bd">{{ item.dictValue }}</span>
                </div>
              </template>
            </template>
            <template v-else>
              <div class="item-span" v-for="(item, index) of li.children || []" :key="index" :title="item.dictValue">
                <span class="hd">大类：</span>
                <span class="bd">{{ item.dictValue }}</span>
              </div>
            </template>
          </div>
          <template v-if="formModal.code === 'leadSourceLarge'">
            <div class="data-none" v-if="li.children.filter(v => v.flagSelect).length === 0">暂无关联小类</div>
          </template>
          <template v-else>
            <div class="data-none" v-if="li.children.length === 0">暂无所属大类</div>
          </template>
        </div>
        <a-empty v-if="list.length === 0" />
      </a-spin>
    </div>
  </div>

  <RelevanceDict ref="relevanceDict" @submit="getList" />
  <AddDict ref="addDict" :code="formModal.code" @submit="getList" />
  <UpdateDictName ref="updateDictName" :record="data.record" @submit="getList" />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { SearchOutlined, SyncOutlined, EditOutlined } from '@ant-design/icons-vue';
import { useButton } from '@/utils/utils';
import { getListData } from '@/api/customerManage/channelClass';
import RelevanceDict from './components/RelevanceDict.vue';
import AddDict from './components/AddDict.vue';
import UpdateDictName from './components/UpdateDictName.vue';

const ruleFormRef = ref();
const loadding = ref(false);
const list = ref([]);
const formModal = ref({
  code: 'leadSourceLarge',
  dictValue: null,
});

const data = reactive({
  record: {},
});

onMounted(() => {
  getList();
});

//搜索
const getList = () => {
  loadding.value = true;
  getListData(formModal.value).then(res => {
    list.value = res || [];
    loadding.value = false;
  });
};

//重置
const reset = () => {
  ruleFormRef.value?.resetFields();
};

//关联小类
const relevanceDict = ref(null);
const relevanceDictFun = () => {
  relevanceDict.value.showModal = true;
};

//新增
const addDict = ref(null);
const addDictFun = () => {
  addDict.value.showModal = true;
};

//编辑名称
const updateDictName = ref(null);
const updateDictNameFun = record => {
  data.record = record;
  updateDictName.value.showModal = true;
};
</script>

<style scoped lang="less">
.channel-class {
  background-color: #fff;
  padding: 10px 15px;
  .search-wrap {
    position: relative;
    margin-bottom: 16px;
    .btn-wrap {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .list-wrap {
    height: calc(100vh - 250px);
    overflow-y: auto;
    .class-li {
      background-color: #f1f1f1;
      margin-bottom: 10px;
      padding: 10px;
      .li-title {
        line-height: 28px;
        margin-bottom: 6px;
        font-weight: bold;
        .icon-btn {
          color: #1890ff;
          margin-left: 10px;
          cursor: pointer;
        }
      }
      .li-item {
        overflow: hidden;
        .item-span {
          float: left;
          width: 150px;
          background-color: #fff;
          padding: 3px 8px;
          margin-right: 12px;
          margin-bottom: 8px;
          border-radius: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
      .hd {
        color: #999;
      }
      .bd {
      }
      .data-none {
        color: #999;
      }
    }
  }
}
</style>
