<template>
  <el-drawer :size="460" :title="title" :visible.sync="drawerVisible">
    <div class="approval-tline-container flow-line-container">
      <div class="action-node-container">
        <div class="time-node action-node submit time-node-first" v-for="(item, index) in records" :key="index">
          <!-- <template  v-if="item.operationType != 'CONNECTOR'"> -->
            <div class="nodebox">
              <div class="nodebox-inner">
                <div class="nodebox-left">
                  <div class="ding-avatar-web node-avatar ding-avatar-web-small ding-avatar-web-square" :title="item.userid.indexOf('_') != -1 ? item.userid.substr(0, item.userid.indexOf('_')) : item.userid">
                    {{item.userid.indexOf('_') != -1 ? item.userid.substr(0, item.userid.indexOf('_')) : item.userid}}
                  </div>
                </div>
                <div class="nodebox-right">
                  <div class="node-fold-wrapper">
                    <div class="node-fold-head">
                      <div class="node-fold-name">
                        <div class="node-fold-desc">
                          {{item.operationType | filterType}}
                        </div>
                        <div class="node-fold-title">
                          <div>
                            <span v-if="item.operationResult != 'NONE'"> ({{item.operationResult == 'AGREE' ? '同意' : '拒绝'}}) </span>
                            </div>
                          </div>
                        </div>
                        <div class="node-fold-action">
                          <span class="node-fold-right-action">
                            <span>{{item.date}}</span>
                          </span>
                        </div>
                      </div>
                    <div class="node-fold-body" v-if="item.remark">
                      <div class="reasonWrapper">
                        <div class="reason">
                          <div class="comment-content">
                            <div>{{item.remark}}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="node-fold-body" v-if="item.attachments.length">
                      <div
                        type="primary" v-for="(file, index) in item.attachments" :key="index">
                        <span>{{file.fileName}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <!-- </template> -->
        </div>
        <template v-if="processInstance.status === 'RUNNING'">
          <div class="time-node action-node submit time-node-first" >
            <div class="nodebox">
              <div class="nodebox-inner">
                <div class="nodebox-left">
                  <div class="ding-avatar-web node-avatar ding-avatar-web-small ding-avatar-web-square lang">
                    {{ current }}
                  </div>
                </div>
                <div class="nodebox-right">
                  <div class="node-fold-wrapper">
                    <div class="node-fold-head">
                      <div class="node-fold-name">
                        <div class="node-fold-desc">当前处理人</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- <div class="time-node action-node agree"><div class="nodebox"><div class="nodebox-inner"><div class="nodebox-left"><img src="https://static.dingtalk.com/media/lADPDhYBTqoPDnTNAWXNAWQ_356_357.jpg_120x120q90.jpg?bizType=approve" class="ding-avatar-web node-avatar ding-avatar-web-small ding-avatar-web-square"></div><div class="nodebox-right"><div class="node-fold-wrapper"><div class="node-fold-head"><div class="node-fold-name"><div class="node-fold-desc">直接主管</div><div class="node-fold-title"><div>潘越 <span> (已同意) </span></div></div></div><div class="node-fold-action"><span class="node-fold-right-action"><span>05-11 09:55</span></span></div></div><div class="node-fold-body"></div><div class="view-sign"></div></div></div></div></div></div>
        <div class="time-node action-node agree"><div class="nodebox"><div class="nodebox-inner"><div class="nodebox-left"><img src="https://static.dingtalk.com/media/lADPDgQ91FyqmeTNBLzNBLw_1212_1212.jpg_120x120q90.jpg?bizType=approve" class="ding-avatar-web node-avatar ding-avatar-web-small ding-avatar-web-square"></div><div class="nodebox-right"><div class="node-fold-wrapper"><div class="node-fold-head"><div class="node-fold-name"><div class="node-fold-desc">行政经理</div><div class="node-fold-title"><div>陈婉聪 <span> (已同意) </span></div></div></div><div class="node-fold-action"><span class="node-fold-right-action"><span>05-11 09:59</span></span></div></div><div class="node-fold-body"></div><div class="view-sign"></div></div></div></div></div></div> -->
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { getDingDingApprovalDetail } from "@/api/newApi/orderManage/refundOrder";
export default {
  props: {
    dingDrawerVisible: Boolean,
    id: String,
    processInstanceId: String
  },
  data() {
    return {
      records: [],
      title: '',
      processInstance: {},
      current: ''
    };
  },
  filters: {
    filterType(type) {
      switch (type) {
        case 'EXECUTE_TASK_NORMAL':
          return ''
        case 'EXECUTE_TASK_AGENT':
          return '代理人执行任务'
        case 'APPEND_TASK_BEFORE':
          return '前加签任务'
        case 'APPEND_TASK_AFTER':
          return '后加签任务'
        case 'REDIRECT_TASK':
          return '转交任务'
        case 'START_PROCESS_INSTANCE':
          return '发起流程实例'
        case 'TERMINATE_PROCESS_INSTANCE':
          return '终止(撤销)流程实例'
        case 'FINISH_PROCESS_INSTANCE':
          return '结束流程实例'
        case 'ADD_REMARK':
          return '添加评论'
        case 'REDIRECT_PROCESS':
          return '审批退回'
        case 'PROCESS_CC':
          return '抄送'
        // case 'CONNECTOR':
        //   return '连接器'
        default:
          return ''
      }
    }
  },
  watch: {
    processInstanceId(val) {
      if(val) {
        getDingDingApprovalDetail({processInstanceId: val}).then((res) => {
          if (res.code === 0) {
            const { processInstance } = res.data.data
            this.processInstance = processInstance
            this.records = processInstance.operationRecords.filter(item => item.operationType !== 'CONNECTOR' && item.operationType !== 'PROCESS_CC')
            this.title = processInstance.title 
            this.current = processInstance.tasks.filter(item => item.taskStatus === 'RUNNING').map(o => o.userid.split('_')[0]).join(',')
          }
        });
      }
    },
  },
  computed: {
    drawerVisible: {
      get() {
        return this.dingDrawerVisible;
      },
      set(val) {
        this.$emit("update:dingDrawerVisible", val);
      },
    },
  },
  created() {},
  methods: {
    // download(file) {
    //   getFile({processInstanceId: 'RGogoi0PQNyhz-QWGsMYrA07671657184904',fileId: file.fileId }).then((res) => {
    //       if (res.code === 0) {
    //         console.log(res)
    //       }
            
    //     });
    // }
  },
};
</script>

<style  lang="scss" scoped>
.approval-tline-container {
  position: relative;
}
.action-node-container:before {
  content: '';
  position: absolute;
  top: 12px;
  bottom: 14px;
  z-index: 1;
  left: 22px;
  width: 3px;
  margin-left: 16px;
  background: rgba(80, 116, 154, 0.2);
}

.flow-line-container .time-node {
  padding: 16px 16px 0 16px;
}

.flow-line-container .time-node-first {
  padding-top: 0px;
}

.time-node {
  display: inline-block;
  position: relative;
  width: 100%;
}

.flow-line-container .action-node:first-child:before {
  top: 12px;
  height: 10px;
  bottom: 0;
}

.flow-line-container .action-node:first-child:before{
  display: block;
  content: '';
  position: absolute;
  z-index: 2;
  left: 22px;
  width: 3px;
  background: #fff;
  margin-left: 16px;
}

.flow-line-container .time-node-first .nodebox {
  margin-top: 12px;
}
.flow-line-container .nodebox {
  margin-bottom: 14px;
}

.nodebox {
  margin: 20px 0 0;
  position: relative;

  .nodebox-inner {
    border-radius: 5px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    font-size: 14px;
    line-height: 30px;
    position: relative;
    vertical-align: middle;

    .nodebox-left {
      position: relative;
      .node-avatar {
        display: block;
        margin-top: -5px;
        border: 4px solid #fff;
        position: relative;
        z-index: 10;
      }
      .node-avatar.lang{
        width: auto;
      }
    }

    .nodebox-right {
      margin-top: 2px;
      padding-left: 12px;
      flex: 1;

      .node-fold-head {
        position: relative;
        line-height: 1.6;
        min-height: 26px;
        display: flex;
        justify-content: space-between;

        .node-fold-name {
          display: flex;
          flex-direction: column;
          justify-content: center;

          .node-fold-desc {
            font-weight: 400;
            font-size: 14px;
            color: #171A1D;
            line-height: 22px;
          }
        }
      }

      .node-fold-title {
        font-weight: 400;
        font-size: 14px;
        color: rgba(23, 26, 29, 0.4);
        line-height: 22px;
      }
    }
  }
}

.node-fold-head .node-fold-action {
  min-width: 76px;
  text-align: right;
  font-size: 13px;
  color: rgba(25, 31, 37, 0.4);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.node-fold-head .node-fold-right-action {
  display: inline-block;
}

.reasonWrapper {
  display: flex;
  position: relative;
}

.reason {
  font-size: 15px;
  line-height: 22px;
  margin-top: 4px;
  color: rgba(25, 31, 37, 0.56);
  word-break: break-word;
  white-space: pre-wrap;
  margin-bottom: 6px;
  flex: 1;
    
}

.comment-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 8px 12px;
  border-radius: 6px;
  border-top-left-radius: 0px;
  background-color: #f2f2f7;
}
/deep/ .el-drawer__header {
  span {
    font-size: 16px;
    font-weight: 800;
    color: #333;
  }
}
.ding-avatar-web-square {
  background: #fff;

}
.ding-avatar-web{
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>