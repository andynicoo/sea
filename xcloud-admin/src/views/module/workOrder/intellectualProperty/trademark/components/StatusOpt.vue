<template>
  <div class="status-wrap">
    <a-tabs v-model:activeKey="nodeCode" @change="changeStatus">
      <a-tab-pane key="" tab="全部" />
      <a-tab-pane v-for="li of statusList" :key="li.nodeCode" :tab="li.nodeName" />
    </a-tabs>
    <div class="opt-wrap" v-if="rule[6].value === 'US'">
      <a-space>
        <a-button size="small" type="primary" ghost @click="clearCache()">清空缓存</a-button>
        <a-dropdown>
          <a-button size="small" type="primary" ghost v-if="nodeCode === 'NODE0035'">
            受理号查询并录入<DownOutlined />
          </a-button>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item v-for="(li, index) of data.lawyerList" :key="index" :name="li.name" :email="li.email">
                {{ li.name }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button
          size="small"
          type="primary"
          ghost
          @click="checkPythonRequestFun('/shoulihuizhiluru/', '3')"
          v-if="nodeCode === 'NODE0036'"
        >
          受理回执录入
        </a-button>
        <a-button
          size="small"
          type="primary"
          ghost
          @click="checkPythonRequestFun('/inputgonggao/', '4')"
          v-if="nodeCode === 'NODE0036'"
        >
          录入公告日期
        </a-button>
        <a-button
          size="small"
          type="primary"
          ghost
          @click="checkPythonRequestFun('/inputreviewcomment/', '2')"
          v-if="nodeCode === 'NODE0036' || nodeCode === 'NODE0037'"
        >
          审查意见OA原文
        </a-button>
        <a-button
          size="small"
          type="primary"
          ghost
          @click="checkPythonRequestFun('/inputregistrationnumber/', '5')"
          v-if="nodeCode === 'NODE0037'"
        >
          注册号-注册日期
        </a-button>
        <a-button
          size="small"
          type="primary"
          ghost
          @click="checkPythonRequestFun('/uploadtrademarkcertificate/', '6')"
          v-if="nodeCode === 'NODE0037'"
        >
          上传商标证书
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  findNodes,
  pythonLogApi,
  clearPythonCache,
  checkPythonRequest,
  executeScript,
} from '@/api/workOrder/intellectualProperty/trademark';
import { useStore } from '@/stores/store';
import type { INodeRecord } from '@/types/trademark';
import { message } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';

const nodeCode = ref('');
const statusList = ref<INodeRecord[]>([]);

const props = defineProps({
  rule: {
    type: Array<any>,
    default: () => [],
  },
});

const emit = defineEmits(['submitNodeCode']);

const data = reactive({
  pythonHost: 'https://py.itaxs.com',
  lawyerList: [
    {
      name: 'Francis律师',
      email: 'Jerome8966@outlook.com',
      key: 'maijiachengzhang123',
    },
    {
      name: '宋律师',
      email: 'jesus2022@163.com',
      key: 'g123456',
    },
    {
      name: 'X云兰迪律师',
      email: 'Riley_2107@outlook.com',
      key: '',
    },
    {
      name: 'X云王婧律师',
      email: 'sy18856936070@outlook.com',
      key: 'Kby123456',
    },
    {
      name: '兰迪SG',
      email: 'landinglawtrademark@outlook.com',
      key: 'Kby123456',
    },
  ],
});

onMounted(() => {
  findNodesFun();
  // pythonLogApiFun();
});

// 清空缓存
const clearCache = () => {
  clearPythonCache().then(() => {
    message.success('操作成功');
  });
};
// 受理号查询并录入
const handleMenuClick = (li: any) => {
  checkPythonRequestFun('/numberinput/', '1', { email_count: li.item.email });
};

//检查脚本是否正在在执行
const checkPythonRequestFun = (url: string, type: string, params?: any) => {
  checkPythonRequest({
    enterpriseid: useStore().enterprise.record.id,
    scriptType: type,
  }).then(res => {
    if (res) {
      if (type !== '1') {
        if (!props.rule[16].value) {
          message.error('请选择受理时间');
          return false;
        }
        params = {
          countryCode: props.rule[6].value,
          acceptStartTime: props.rule[16].value[0].split(' ')[0] + ' 00:00:00',
          acceptEndTime: props.rule[16].value[1].split(' ')[0] + ' 23:59:59',
          nodeServiceProgressName: statusList.value.find((v: { nodeCode: string }) => v.nodeCode === nodeCode.value)
            ?.nodeName,
        };
      }
      executeScriptFun(
        url,
        Object.assign(
          {
            enterpriseid: useStore().enterprise.record.id,
            authorization: encodeURI('Bearer ' + useStore().loginInfo.access_token),
          },
          params
        )
      );
    } else {
      message.success('脚本正在执行中...');
    }
  });
};

//执行脚本
const executeScriptFun = (url: string, params: any) => {
  executeScript(`${data.pythonHost + url}`, params).then((res: { code: number }) => {
    if (res.code === 200) {
      message.success('脚本已执行');
    }
  });
};

//改变状态
const changeStatus = () => {
  emit('submitNodeCode', nodeCode.value);
};

//获取状态
const findNodesFun = () => {
  findNodes({
    functionCode: 61,
  }).then((res: INodeRecord[]) => {
    statusList.value = res || [];
  });
};

//获取python查询日志
const pythonLogApiFun = () => {
  pythonLogApi().then((res: any) => {
    console.log(res);
  });
};
defineExpose({ nodeCode });
</script>

<style scoped lang="less">
.status-wrap {
  position: relative;
  .opt-wrap {
    position: absolute;
    right: 0;
    top: 10px;
    z-index: 1;
    text-align: right;
  }
}
</style>
