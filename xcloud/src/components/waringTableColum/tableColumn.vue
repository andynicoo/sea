<template>
  <div class="main">
    <el-table-column align="center" label="预警" sortable width="200px" prop="warnValue" show-overflow-tooltip>
      <template slot="header">
        预警
        <el-tooltip class="item" effect="dark" content="显示该节点工单的停留时长，超过该节点规定的处理时间则会显示时间" placement="top-start">
          <i class="el-icon-question text-warning"></i>
        </el-tooltip>
      </template>
      <template slot-scope="{ row }">
        <div v-if="row.warnValue > 0">
          <el-tag v-if="row.warnValue > 1" type="warning" :color="setWaringColor(row)" effect="dark" style="color: black"> {{ row.warnValue }} 天 </el-tag>
          <span v-else> 24小时内 </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center" label="标签" sortable width="200px" prop="labelName" show-overflow-tooltip>
      <template slot="header">
        标签
        <el-tooltip class="item" effect="dark" content="显示工单的标签，可在工单配置>标签管理中 配置" placement="top-start">
          <i class="el-icon-question text-warning"></i>
        </el-tooltip>
      </template>
      <template slot-scope="{ row }">
        <el-tag v-if="row.labelName" effect="plain">
          {{ row.labelName }}
        </el-tag>
        <span v-else> </span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="跟进记录" width="200px" prop="trackTotal" show-overflow-tooltip>
      <template slot="header">
        跟进记录
        <el-tooltip class="item" effect="dark" content="显示整个订单的跟进记录，可在此跟进备注" placement="top-start">
          <i class="el-icon-question text-warning"></i>
        </el-tooltip>
      </template>
      <template slot-scope="{ row }"> <el-button @click="$emit('showFollow', row)" type="text" size="mini">跟进</el-button>({{ row.trackTotal || 0 }}) </template>
    </el-table-column>
  </div>
</template>

<script>
export default {
  name: 'WingTableColumn',

  data() {
    return {
      followShow: false,
    };
  },
  created() {},
  methods: {
    setWaringColor(row) {
      const { warnValue, warnDay } = row;
      const percent = warnValue / warnDay;
      let color = '';
      if (percent >= 1 && percent < 1.2) {
        color = '#E720141A';
      } else if (percent >= 1.2 && percent < 1.5) {
        color = '#E7201433';
      } else if (percent >= 1.5 && percent < 2) {
        color = '#E72014CC';
      } else {
        color = '#E72014CC';
      }
      //   case :
      //     color = '#E720141A';
      //     break;
      //   case :
      //     color = '#E7201433';
      //     break;
      //   case p:
      //     debugger;
      //     color = '#E7201480';
      //     break;
      //   case percent >= 2:
      //     color = '#E72014CC';
      //     break;
      // }
      // console.log('percent', percent);
      return color;
    },
  },
};
</script>

<style lang="scss" scoped></style>
