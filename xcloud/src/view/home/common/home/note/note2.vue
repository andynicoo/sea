<template>
  <div class="note-main">
    <div>
      <div>
        <div>
          <h3>
            代办事项
            <i v-if="!extendNote" class="el-icon-d-arrow-left arrow" @click="changeExtendNote(true)" />
            <i v-else class="el-icon-d-arrow-right arrow" @click="changeExtendNote(false)" />
          </h3>
        </div>
        <div style="margin-top: 12px">
          <span>
            <el-button style="border-right: none !important" class="home-pending-btn" @click="setSearchParams('PENDING')" :style="{ backgroundColor: isPending ? '#EBF5FF' : '' }" :plain="true">待处理({{ pendingArr.length }})</el-button>
          </span>
          <span>
            <el-button class="home-pending-btn" @click="setSearchParams('PROCESSED')" :plain="true" :style="{ backgroundColor: !isPending ? '#EBF5FF' : '' }">已处理</el-button>
          </span>
        </div>
      </div>
      <el-tabs style="margin-top: 6px" v-model="searchParams.label">
        <el-tab-pane :label="'全部 ' + `(${allList.length})`" name="all"></el-tab-pane>
        <el-tab-pane :label="item.title + ` (${item.value && item.value.filter((item) => (isPending ? item.status === 'PENDING' : item.status === 'PROCESSED')).length}) `" :name="item.title" class="tab-label" :key="item.title" v-for="item in tags"></el-tab-pane>
      </el-tabs>
      <div>
        <el-table ref="elTables" border :data="searchParams.label === 'all' ? allList : tagList" v-loading="tableLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="extendNote ? 'calc(100vh - 290px)' : 'calc(100vh - 535px)'">
          <Empty slot="empty" />
          <el-table-column align="center" width="120" label="待办类型" show-overflow-tooltip prop="publishName">
            <template slot-scope="scope">
              {{ typeMap.find((item) => item.key === scope.row.identification) ? typeMap.find((item) => item.key === scope.row.identification).type : '--' }}
            </template>
          </el-table-column>
          <el-table-column align="center" width="120" label="提醒标签" show-overflow-tooltip prop="workNo">
            <template slot-scope="scope">
              {{ typeMap.find((item) => item.key === scope.row.identification) ? typeMap.find((item) => item.key === scope.row.identification).label : '--' }}
            </template>
          </el-table-column>
          <el-table-column align="center" width="150" label="订单号" show-overflow-tooltip prop="orderNo"></el-table-column>
          <el-table-column align="center" width="180" label="服务号" show-overflow-tooltip prop="serviceNo"></el-table-column>
          <el-table-column align="left" label="消息内容" show-overflow-tooltip prop="content"></el-table-column>
          <el-table-column align="center" width="150" label="发送时间" show-overflow-tooltip prop="publishTime"></el-table-column>

          <el-table-column align="center" width="100" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="完成待办" placement="top">
                <el-link type="primary" :underline="false" @click="openDrawer(scope.row)">
                  <i class="el-icon-finished"></i>
                </el-link>
              </el-tooltip>
              <el-popconfirm placement="top" title="确认删除该条数据吗？" @confirm="calerAgency(scope.row)">
                <el-link slot="reference" type="danger" :underline="false">
                  <i class="el-icon-delete"></i>
                </el-link>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <WaringDrawerVue v-if="drawerParams.show" :id="drawerParams.id" :isComplete="true" :visible.sync="drawerParams.show" :detailId="drawerParams.detailId" />
  </div>
</template>

<script>
import { getWorkPendingItem, deleteAgency } from '@/api/home/service';
import WaringDrawerVue from '@/components/waringDrawer/waringDrawer.vue';

export default {
  name: 'Note',
  components: {
    WaringDrawerVue,
  },
  data() {
    return {
      extendNote: false,
      pendingArr: [],
      processedArr: [],
      tags: [],
      tableLoading: false,
      tableHeight: 400,
      list: [],
      searchParams: {
        status: 'PENDING',
        label: 'all',
        size: -1,
      },
      drawerParams: {
        show: false,
        detailId: '',
        id: '',
      },
      typeMap: [
        { key: 'TQTX', label: '续费提前提醒', type: '续费提醒' },
        { key: 'DQTX', label: '到期提醒', type: '续费提醒' },
        { key: 'GQTX', label: '过期提醒', type: '续费提醒' },
        { key: 'GDBZ', label: '跟单备注', type: '服务提醒' },
        { key: 'DDJDTX', label: '到达节点提醒', type: '服务提醒' },
        { key: 'JDCSTX', label: '节点超时提醒', type: '服务提醒' },
        { key: 'JDBHTX', label: '节点驳回提醒', type: '服务提醒' },
      ],
    };
  },
  computed: {
    isPending() {
      return this.searchParams.status === 'PENDING';
    },
    allList() {
      return this.isPending ? this.pendingArr : this.processedArr;
    },
    // 两个条件 tags 包含全部数据, 所以tags的数据需要再次处理.  续费提醒 && 是否是已处理
    tagList() {
      return this.searchParams.label === '续费提醒' ? this.tags[0].value.filter((item) => (this.isPending ? item.status === 'PENDING' : item.status === 'PROCESSED')) : this.tags[1].value.filter((item) => (this.isPending ? item.status === 'PENDING' : item.status === 'PROCESSED'));
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
        this.visible = false;
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
        // 续费提醒 TQTX, 到期提醒:DQTX,过期提醒：GQTX
        const key1 = this.typeMap.filter((item) => item.type === '续费提醒').map((item) => item.key);
        const tag1 = { title: '续费提醒', key: 'XFTX', value: noteData.filter((item) => key1.includes(item.identification)) };

        // 服务提醒: 跟单备注:GDBZ ,到达节点提醒:DDJDTX,节点超时提醒:JDCSTX,节点驳回提醒:JDBHTX
        const key2 = this.typeMap.filter((item) => item.type === '服务提醒').map((item) => item.key);
        const tag2 = { title: '服务提醒', key: 'FWTX', value: noteData.filter((item) => key2.includes(item.identification)) };
        this.tags = [tag1, tag2];
      }
    },

    setSearchParams(status) {
      this.searchParams.status = status;
    },
    openDrawer(item) {
      this.drawerParams.show = true;
      this.drawerParams.detailId = item.serviceOrderId;
      this.drawerParams.id = item.id;
    },
    changeExtendNote(v) {
      this.extendNote = v;
      this.$emit('extendNote', v);
    },
  },
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
