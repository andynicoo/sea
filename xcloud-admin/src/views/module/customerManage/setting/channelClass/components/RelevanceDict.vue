<template>
  <a-modal
    title="关联小类"
    width="900px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <div class="wrap">
      <div class="cell-wrap">
        <div class="cell">
          <div class="cell-title">线索大类</div>
          <div class="cell-select">
            <a-select
              class="select"
              v-model:value="data.largeActive"
              placeholder="请选择"
              showSearch
              optionFilterProp="label"
              @change="changeType"
            >
              <a-select-option v-for="(li, index) of data.list" :key="index" :value="li.dictId" :label="li.dictValue">
                {{ li.dictValue }}
              </a-select-option>
            </a-select>
          </div>
          <div class="cell-list">
            <div
              class="li"
              v-for="(li, index) of data.list"
              :key="index"
              :class="{ active: data.largeActive === li.dictId }"
              @click="clickDictLarge(li)"
              :title="li.dictValue"
            >
              {{ li.dictValue }}
            </div>
          </div>
        </div>
        <div class="cell" style="margin: 0 15px">
          <div class="cell-title">线索小类</div>
          <div class="cell-select">
            <a-select
              class="select"
              v-model:value="data.smallActive"
              placeholder="请选择"
              mode="multiple"
              optionFilterProp="dictValue"
              allowClear
              showSearch
              :maxTagCount="1"
              :max-tag-text-length="10"
              :fieldNames="{ label: 'dictValue', value: 'dictId' }"
              :options="data.smallList"
              @change="changeTypeSmall"
            />
          </div>
          <div class="cell-list">
            <template v-for="(li, index) of data.smallList">
              <div class="li" :key="index" :title="li.dictValue" v-if="!li.flagSelect" @click="clickDictSmall(li)">
                <span>{{ li.dictValue }}</span>
                <span class="btn"><PlusOutlined /></span>
              </div>
            </template>
          </div>
        </div>
        <div class="cell">
          <div class="cell-title">映射关系值</div>
          <div class="cell-select">
            <a-select
              class="select"
              v-model:value="data.smallActive"
              placeholder="请选择"
              mode="multiple"
              optionFilterProp="dictValue"
              allowClear
              showSearch
              :maxTagCount="1"
              :max-tag-text-length="10"
              :fieldNames="{ label: 'dictValue', value: 'dictId' }"
              :options="data.smallList"
              @change="changeTypeSmall"
            />
          </div>
          <div class="cell-list">
            <template v-for="(li, index) of data.smallList">
              <div class="li" :key="index" :title="li.dictValue" v-if="li.flagSelect" @click="clickDictSmall(li)">
                <span>{{ li.dictValue }}</span>
                <span class="btn"><CloseOutlined /></span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { getListData, updateleadSourceLargeOrSmall } from '@/api/customerManage/channelClass';

const emit = defineEmits(['submit']);
const showModal = ref<boolean>(false);

const data: any = reactive({
  largeActive: {},
  list: [],
  smallActive: [],
  smallList: [],
});

watch(showModal, newVal => {
  if (newVal) {
    getList();
  }
});

//提交
const submit = () => {
  const paramsArr: any = [];
  for (const li of data.list) {
    const arr = li.children
      .filter((v: { flagSelect: boolean }) => v.flagSelect)
      .map((v: any) => {
        return {
          dictKey: v.dictKey,
          // dictId: v.dictId,
          dictValue: v.dictValue,
        };
      });
    paramsArr.push({
      dictKey: li.dictKey,
      // dictId: li.dictId,
      dictValue: li.dictValue,
      children: arr,
    });
  }
  updateleadSourceLargeOrSmall(paramsArr).then((res: any) => {
    showModal.value = false;
    message.success('操作成功');
    emit('submit');
  });
};

//搜索
const getList = () => {
  getListData({
    code: 'leadSourceLarge',
    dictValue: null,
  }).then(res => {
    data.list = res;
    clickDictLarge(data.list[0]);
  });
};

//切换大类
const changeType = (val: string) => {
  const li = data.list.find((v: { dictId: string }) => v.dictId === val);
  if (li) {
    clickDictLarge(li);
  }
};

//点击选择大类
const clickDictLarge = (li: any) => {
  data.largeActive = li.dictId;
  data.smallList = li.children;
  data.smallActive = data.smallList
    .filter((v: { flagSelect: boolean }) => v.flagSelect)
    .map((v: { dictId: string }) => v.dictId);
};

//切换小类
const changeTypeSmall = (valArr: string) => {
  for (const li of data.smallList) {
    li.flagSelect = valArr.indexOf(li.dictId) === -1 ? false : true;
  }
};

//点击选择小类
const clickDictSmall = (li: any) => {
  li.flagSelect = !li.flagSelect;
  data.smallActive = data.smallList
    .filter((v: { flagSelect: boolean }) => v.flagSelect)
    .map((v: { dictId: string }) => v.dictId);
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 0 10px;
  .cell-wrap {
    display: flex;
    .cell {
      flex: 1;
      border: 1px solid #f1f1f1;
      border-radius: 4px;
      .cell-title {
        line-height: 36px;
        text-align: center;
        font-weight: bold;
        background-color: #f3f6f9;
      }
      .cell-select {
        height: 42px;
        padding: 5px 10px;
        .select {
          width: 250px;
        }
      }
      .cell-list {
        padding: 5px 10px;
        height: calc(100vh - 400px);
        overflow-y: auto;
        .li {
          position: relative;
          height: 30px;
          line-height: 30px;
          border: 1px solid #f1f1f1;
          margin: 6px 0;
          padding: 0 25px 0 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          /*限制在一个块元素显示的文本的行数*/
          -webkit-box-orient: vertical;
          cursor: pointer;
          .btn {
            position: absolute;
            right: 5px;
            top: 0;
          }
        }
        .li.active {
          background-color: #ccc;
          color: #1890ff;
        }
      }
    }
  }
}
</style>
