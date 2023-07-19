<template>
  <div>
    <el-timeline class="timeline">
      <el-timeline-item placement="top" v-for="item in list" :key="item.renewFollowRecordId">
        <div class="timeline-title">
          <span class="timeline-name">{{ item.followUserName }}</span>
          <span class="timeline-num">（{{ item.followUserNo }}）</span>
          <span class="timeline-time">{{ item.createTime }}</span>
        </div>
        <div class="timeline-content-wrapper">
          <div class="timeline-content">
            {{ item.followContent }}
          </div>
          <div class="timeline-content-tag-wrapper">
            <span class="timeline-content-tag" v-for="(tag, index) in item.followLabel" :key="index">{{ tag }}</span>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    <div class="submit-wrapper">
      <div class="submit-input-wrapper">
        <el-input type="textarea" :maxlength="199" v-model="followContent" placeholder="请填写续费跟进内容" resize="none"></el-input>
        <div class="submit-tag-wrapper">
          <span class="submit-tag-title">选择标签</span>
          <el-checkbox-group v-model="followLabel" :max="1" size="mini">
            <el-checkbox-button v-for="(label, index) in labelList" :key="index" :label="label"></el-checkbox-button>
          </el-checkbox-group>
        </div>
      </div>
      <div class="submit-btn" @click="addFollow">提交</div>
    </div>
  </div>
</template>

<script>
import { renewalFollowList, renewalFollowSave, renewalFollowLabel } from '@/api/newApi/renewalCenter/myRenewal.js';
export default {
  props: {
    serviceId: String,
  },
  data() {
    return {
      labelList: [],
      followContent: '',
      followLabel: [],
      list: [],
    };
  },
  mounted() {
    this.getLabel();
  },
  methods: {
    // 获取跟进记录
    getList() {
      renewalFollowList(this.serviceId).then((res) => {
        res.data.forEach((item) => {
          item.followLabel = item.followLabel.split(',').filter((i) => i);
        });
        this.list = res.data;
      });
    },
    // 获取标签列表
    getLabel() {
      renewalFollowLabel().then((res) => {
        this.labelList = res.data;
      });
    },
    // 提交跟进记录
    addFollow() {
      let followContent = this.followContent.trim();
      if (followContent === '') {
        this.$message.warning('请填写跟进内容');
        return;
      }
      if (followContent.length < 4) {
        this.$message.warning('必须填写超4个字符');
        return;
      }
      renewalFollowSave({
        serviceId: this.serviceId,
        followContent,
        followLabel: this.followLabel.join(','),
      }).then((res) => {
        if (res.code === 0) {
          this.followContent = '';
          this.followLabel = [];
          this.getList();
          this.$emit('refresh');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.timeline {
  height: calc(100vh - 480px);
  overflow-y: scroll;
}
.timeline-title {
  margin-bottom: 8px;
  .timeline-name {
    color: #333333;
    font-weight: bold;
  }
  .timeline-num {
    color: #919498;
  }
  .timeline-time {
    color: #333333;
    margin-left: 24px;
  }
}
.timeline-content-wrapper {
  padding: 8px 16px;
  background-color: #f5f8fb;
  .timeline-content {
    font-size: 14px;
    color: #666;
    line-height: 22px;
  }
  .timeline-content-tag-wrapper {
    margin-top: 8px;
    display: flex;
    align-items: center;
    .timeline-content-tag {
      font-size: 12px;
      margin-right: 16px;
      line-height: 20px;
      padding: 1px 8px;
      border: 1px solid #d9d9d9;
      background-color: #fafafa;
      margin-right: 8px;
    }
  }
}
.submit-wrapper {
  display: flex;
  align-items: center;
  margin-top: 14px;
  .submit-input-wrapper {
    flex: 1;
    padding: 12px 23px;
    background-color: #f2f2f2;
    font-size: 12px;
    color: #919498;
    .submit-tag-wrapper {
      margin-top: 8px;
      display: flex;
      .submit-tag-title {
        margin-right: 16px;
        white-space: nowrap;
      }
    }
  }
  .submit-btn {
    background-color: #3a7fff;
    font-size: 16px;
    text-align: center;
    color: #fff;
    margin-left: 24px;
    align-self: stretch;
    padding: 0 25px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}
::v-deep .el-timeline-item__content {
  margin-top: -14px;
}
::v-deep .el-textarea .el-textarea__inner {
  background-color: #f2f2f2;
  padding: 0;
  border: none;
  font-size: 16px;
  &:focus {
    border: none;
  }
}
::v-deep .el-checkbox-button {
  margin-right: 16px;
  .el-checkbox-button__inner {
    line-height: 20px;
    padding: 1px 8px;
    border: 1px solid #d9d9d9;
    box-shadow: none;
  }
  &.is-checked {
    .el-checkbox-button__inner {
      background-color: #f0f5ff;
      color: #549bff;
      border-color: #adc6ff;
    }
  }
}
</style>
