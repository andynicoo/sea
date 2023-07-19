<template>
  <a-drawer v-model:visible="visible" class="custom-class" :width="800" placement="right" destroyOnClose>
    <template #title>
      <dl class="drawer-title">
        <dt>工单跟进</dt>
        <dd>
          <span>当前服务进度：{{ dataRecord.currentNodeCode }}</span>
          <span>服务状态：服务中</span>
          <span v-if="dataRecord.warnValue > 0"
            >超过 <span>{{ dataRecord.warnValue }}天</span>未处理</span
          >
        </dd>
      </dl>
    </template>
    <div class="dataRecord-info">
      <a-row :gutter="10">
        <a-col :span="8">订单号：{{ dataRecord.orderNo }}</a-col>
        <a-col :span="8">服务名称：{{ dataRecord.serviceName }}</a-col>
        <a-col :span="8">销售跟进人：{{ dataRecord.attributionName }}</a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="8">服务号：{{ dataRecord.serviceNo }}</a-col>
        <a-col :span="8">国家：{{ dataRecord.countryNameZh }}</a-col>
        <a-col :span="8"
          >客户等级：{{ dataRecord.userLevel == 1 ? 'vip客户' : dataRecord.userLevel == 0 ? '普通客户' : '' }}</a-col
        >
      </a-row>
      <a-row :gutter="10">
        <a-col :span="8">服务公司：{{ dataRecord.companyNameZh }}</a-col>
        <a-col :span="8" v-for="(item, index) in jsonHander(dataRecord.handler)" :key="index">{{ item }} </a-col>
      </a-row>
    </div>
    <h2 class="track-title">跟进记录</h2>
    <a-steps progress-dot :current="100" direction="vertical">
      <a-step class="track-step" v-for="item in data.activities" :key="item.id">
        <template #title>
          <span class="trackType">{{ trackTypeMap[item.trackType] ? trackTypeMap[item.trackType] : '订单备注' }}</span>
          {{ item.publishName }} {{ item.createTime }}
        </template>
        <template #description>
          <div>{{ item.content }}</div>
          <a-tag color="blue" class="my-el-tag" v-for="(tag, tagIdx) in setTag(item.handledName)" :key="tagIdx">
            {{ tag.position }}:{{ tag.nickName }}({{ tag.isHandel ? '已处理' : '未处理' }})</a-tag
          >
          <a-tag color="blue" class="enclosure" v-if="item.attachment">
            <a target="_blank" :href="item.attachment"> 附件:{{ item.attachment }} </a>
          </a-tag>
        </template>
      </a-step>
    </a-steps>
    <a-textarea
      class="formState-content"
      v-model:value="data.content"
      :rows="4"
      :maxlength="500"
      placeholder="请输入跟单备注信息"
    />
    <a-upload
      :action="`${data.baseUrl}/file/oss/upload`"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      @change="attachmentChange"
      class="attachment-upload"
    >
      上传附件
    </a-upload>
    <p class="origFileName" v-if="data.origFileName">
      {{ data.origFileName }} <delete-outlined @click="deleteAttachment" />
    </p>
    <div class="drawer-button">
      <a-button type="primary" ghost @click="visible = false">取消</a-button>
      <a-button type="primary" @click="saveFollowApi">提交备注</a-button>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { getWarningRecords, serviceWorkOrderDetail, saveFollow } from '@/api/management/vat';
import { message } from 'ant-design-vue';
import type { TrackRecordOV, trackTypeMapOV } from '@/types/myServices';
import { DeleteOutlined } from '@ant-design/icons-vue';

//传入参数
export interface FollowUpRecordsOV {
  activities: TrackRecordOV[];
  baseUrl: string;
  attachment: string;
  content: string;
  origFileName: string;
  deatailData: any;
}

interface PropsParamsOV {
  dataRecord: any;
}

const props = defineProps<PropsParamsOV>();
const emit = defineEmits(['getList']);
const data: FollowUpRecordsOV = reactive({
  baseUrl: import.meta.env.VITE_APP_API,
  attachment: '',
  activities: [],
  content: '',
  origFileName: '',
  deatailData: {},
});
const visible = ref<boolean>(false);

//跟进类型
const trackTypeMap: trackTypeMapOV = {
  TRACK_REMARKS: '跟单备注',
  TRACK_REJECT: '工单驳回',
};

//处理人
const jsonHander = computed(() => {
  return (val: any) => {
    try {
      const strArr = val.split('\n');
      return strArr;
    } catch (error) {
      return [];
    }
  };
});
//处理字符串
const setTag = computed(() => {
  return (json: any) => {
    try {
      const arr = JSON.parse(json);
      return arr;
    } catch (error) {
      return [];
    }
  };
});
//获取跟进记录
const getRecord = async () => {
  const res: any = await getWarningRecords({
    serviceOrderId: props.dataRecord.id,
    size: -1,
  });
  data.activities = res.records;
};

// 上传附件
const attachmentChange = (fileData: any) => {
  if (fileData?.file?.response) {
    data.attachment = fileData.file.response.data.fileUrl;
    data.origFileName = fileData.file.response.data.origFileName;
  }
};
//上传限制
const beforeUpload = () => {
  if (data.attachment) {
    message.error('最多只可上传1个文件!');
  }
  return !data.attachment;
};
//删除上传文件
const deleteAttachment = () => {
  data.attachment = '';
  data.origFileName = '';
};

//初始化
const initDrawer = async () => {
  const res = await serviceWorkOrderDetail(props.dataRecord.id);
  data.deatailData = res;
  getRecord();
};

//提交备注
const saveFollowApi = async () => {
  const { serviceNo, workNo, orderNo, workId: serviceOrderId } = data.deatailData;
  try {
    await saveFollow({
      attachment: data.attachment,
      content: data.content,
      id: props.dataRecord.id,
      serviceProgress: props.dataRecord.currentNodeCode,
      serviceNo,
      workNo,
      orderNo,
      serviceOrderId,
      trackType: 'TRACK_REMARKS',
    });
    data.content = '';
    data.attachment = '';
    data.origFileName = '';
    getRecord();
    emit('getList');
  } catch (error) {
    message.error('异常');
  }
};

//监听弹窗是否显示
watch(
  () => visible,
  newValue => {
    if (newValue.value) {
      initDrawer();
    }
  },
  { deep: true }
);
//暴露方法
defineExpose({ visible });
</script>

<style scoped lang="less">
.drawer-title {
  display: flex;
  font-size: 16px;
  color: #333333;
  margin: 0;
  dt {
    margin: 2px 10px 0 0;
  }
  dd {
    margin: 3px 0 0;
    font-size: 12px;
    color: #666666;
    span {
      padding-right: 10px;
    }
  }
}
.dataRecord-info {
  color: #999999;
  background: #f5f8fb;
  padding: 12px 12px 2px;
  font-size: 12px;
  :deep(.ant-row) {
    margin-bottom: 10px;
  }
}
.track-step {
  :deep(.ant-steps-item-title) {
    width: 100%;
    font-size: 14px;
  }
  :deep(.ant-steps-item-description) {
    background: #f5f8fb;
    padding: 20px;
  }
}
.trackType {
  float: right;
}
.track-title {
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 10px;
}
.formState-content {
  margin-top: 20px;
}
.drawer-button {
  text-align: right;
  button {
    margin-left: 10px;
  }
}
.attachment-upload {
  ::v-deep .ant-upload {
    color: rgb(45, 140, 240);
    cursor: pointer;
    padding-top: 5px;
  }
}
.origFileName {
  color: #666;
  &:hover {
    background-color: #f6f8fa;
  }
  .anticon {
    position: relative;
    top: 2px;
    left: 5px;
  }
}
</style>
