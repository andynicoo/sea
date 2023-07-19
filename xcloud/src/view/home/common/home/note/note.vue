<template>
  <div class="note-main">
    <slot name="header" :data="{ pendingArr, processedArr }"></slot>
    <template>
      <div class="note-main-conten">
        <div v-if="currentList.length > 0">
          <div class="note-item" v-for="(item, index) in currentList" :key="index">
            <el-row class="title">
              <el-col :span="19"> {{ item.orderNo }} {{ item.wordNo }} </el-col>
              <el-col :span="5" class="right" v-if="item.status == 'PENDING'">
                <div class="pending-bts">
                  <el-button @click="$emit('openDrawer', { show: true, detailId: item.serviceOrderId, id: item.id })" type="primary"> 处理 </el-button>
                  <el-button plain @click="calerAgency(item)"> 清除 </el-button>
                </div>
                <div class="pending-tips">
                  {{ item.publishTime }}
                </div>
              </el-col>
              <el-col :span="5" class="time" v-else> {{ item.publishTime }} </el-col>
            </el-row>
            <el-row class="item-bg note-item-content">
              <el-col :span="24">
                <el-row class="content">
                  <el-col :span="24"> {{ item.content }}</el-col>
                </el-row>

                <div class="tag">
                  <div>
                    <el-tag class="item-tag" v-for="(tag, index) in tagList(item.handledName)" :key="index">{{ tag.position + ':' + tag.nickName }}({{ tag.isHandel ? '已处理' : '待处理' }})</el-tag>
                  </div>
                  <div class="item-sponsor">发起人:{{ item.publishName }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <Empty v-else slot="empty" class="empty" />
      </div>
    </template>
  </div>
</template>

<script>
import { getWorkPendingItem, deleteAgency } from '../../../../../api/home/service';

export default {
  name: 'Note',
  props: {
    type: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      pendingArr: [],
      processedArr: [],
    };
  },
  computed: {
    tagList() {
      return (json) => {
        if (json !== '') {
          return JSON.parse(json);
        } else {
          return [];
        }
      };
    },
    currentList() {
      return this.type ? this.pendingArr : this.processedArr;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async calerAgency(item) {
      let { id } = item;
      let { code } = await deleteAgency({ id });
      if (code == 0) {
        this.$message.success('清除成功');
        this.init();
      }
    },

    async init() {
      let {
        code,
        data: { records: noteData },
      } = await getWorkPendingItem({ size: -1 });
      const gorunpArr = (key, status) => noteData.filter((item) => item[key] == status);
      if (code == 0) {
        this.pendingArr = gorunpArr('status', 'PENDING');
        this.processedArr = gorunpArr('status', 'PROCESSED');
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
