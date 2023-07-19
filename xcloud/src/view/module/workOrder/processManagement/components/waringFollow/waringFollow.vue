<template>
  <el-drawer size="682px" title="预警配置" class="d-main" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
    <div slot="title" class="title">预警配置</div>
    <div class="d-content">
      <h3 style="margin-bottom: 20px">{{ detail.flowName }}</h3>
      <div class="heard">
        <el-row class="item">
          <el-col :span="8">主体:{{ detail.enterpriseName }}</el-col>
          <el-col :span="8">国家:{{ detail.countryNameCH }}</el-col>
          <el-col :span="8">供应商:{{ detail.serviceProviderName }}</el-col>
        </el-row>
        <el-row class="item">
          <el-col :span="8">总工单数:{{ followDetail.totalWorkOrder }}</el-col>
          <el-col :span="8">进行中的工单:{{ followDetail.progressWorkOrder }}</el-col>
          <el-col :span="8">备注:{{ followDetail.remarks }}</el-col>
        </el-row>
      </div>
      <el-row class="tips">
        <el-col :span="24">
          <el-alert title="可在此设置该流程每个节点的预警时效，如工单超过该时间则会自动预警" type="warning" :closable="false" show-icon> </el-alert>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7" class="select-title">预警值({{ disabled ? '已上线' : '正在编辑' }})</el-col>
        <el-col :span="5"></el-col>
        <el-col :span="12">
          <el-select style="width: 295px" @change="getNewVersion" v-model="version" placeholder="请选择"> <el-option v-for="(item, index) in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select
        ></el-col>
      </el-row>

      <el-table :data="columns" style="margin-top: 20px">
        <el-table-column prop="nodeName" label="节点名称" width="120">
          <template slot-scope="{ row }">
            {{ row.nodeName }}
          </template>
        </el-table-column>
        <el-table-column prop="time" label="节点预警时效">
          <template slot-scope="{ row }">
            <el-input :disabled="disabled" v-model="row.time"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="时效单位">
          <template slot-scope="{ row }">
            <el-select :disabled="disabled" v-model="row.unit" placeholder="请选择">
              <el-option label="小时" value="HOUR"></el-option>
              <el-option label="日" value="DAY"></el-option>
              <el-option label="周" value="WEEK"></el-option>
              <el-option label="月" value="MONTH"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 48px">
        <el-col :span="18"></el-col>
        <el-col :span="6">
          <el-button plain @click="drawer = false">取消</el-button>
          <el-button type="primary" v-if="!disabled" @click="save">发布预警</el-button>
          <el-button type="primary" v-else @click="edit">编辑</el-button>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script>
import { getWarnConfig, getProcessDetail, workOrderWarnConfigSave } from '@/api/newApi/processFields/processConfig';
export default {
  name: 'waringFollow',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      direction: 'rtl',
      form: {},
      columns: [],
      options: [],
      version: '',
      followDetail: {},
      disabled: false,
    };
  },
  computed: {
    drawer: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },

  created() {
    this.init();
  },
  methods: {
    handleClose(done) {
      this.drawer = false;
      done();
    },
    async init() {
      const { flowId } = this.detail;
      try {
        let { data: followDetail } = await getProcessDetail({ flowId });

        this.followDetail = followDetail;
        this.columns = followDetail.forwardNodes.map((item) => {
          return {
            nodeName: item.nodeName,
            nodeCode: item.nodeCode,
            time: '', //预警时效
            unit: '', //时间单位
          };
        });
        let { data } = await getWarnConfig({ flowId });
        this.source = data;
        if (Object.keys(data).length == 0) {
          this.options.push({ label: '版本1:' + this.$util.getDefaultDateTime(), value: this.$util.getDefaultDateTime(), status: 'ENABLE' });
        } else {
          this.columns = data.filter((item) => item.status == 'ENABLE')[0].workOrderWarnConfigDTOS;
          this.options = data.map((item, index) => ({ label: `版本${index + 1}+:${item.version}`, value: item.version, status: item.status }));
          this.disabled = true;
        }
        const optionsItem = this.options.filter((item) => item.status == 'ENABLE');
        if (optionsItem) this.version = optionsItem[0].value;
      } catch (error) {
        console.log(error);
        this.followDetail = {};
      }
    },

    getNewVersion(val) {
      let index = this.source.findIndex((item) => item.version == val);
      if (index != -1) {
        this.columns = this.source[index].workOrderWarnConfigDTOS;
      }
    },
    edit() {
      this.disabled = false;
      this.options.push({ label: '版本' + Number(this.options.length + 1) + ':' + this.$util.getDefaultDateTime(), value: this.$util.getDefaultDateTime() });
      const optionsItem = this.options.at(-1);
      if (optionsItem) this.version = optionsItem.value;
    },
    async save() {
      let { flowId, functionCode } = this.followDetail;
      const workOrderWarnConfigDTOS = this.columns;
      let params = {
        version: this.version,
        flowId,
        functionCode,
        workOrderWarnConfigDTOS,
      };
      let { code } = await workOrderWarnConfigSave(params);
      if (code == 0) {
        this.$message('发布成功');
        this.init();
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
