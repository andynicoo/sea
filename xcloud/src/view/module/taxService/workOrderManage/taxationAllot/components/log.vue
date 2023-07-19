<template>
  <div class="workOrderAdmin">
    <Poptip placement="top" width="350" :transfer="true" @on-popper-show="showOrderIndex(sendId)">
      <span class="button">{{btnText}}</span>
      <div class="api" slot="content">
        <Timeline v-if="!ifNone">
          <TimelineItem v-for="(item, index) in data" :key="index">
            <p class="time">{{ item.createName }}-{{ item.createTime }}</p>
            <div class="content">
              {{ item.operation }}
              <!-- <span v-if="item.remark">备注：{{ item.remark }}</span> -->
              <!-- <p v-if="item.files.length != 0">
                <template v-for="(item1, index1) in item.files.fileArr">
                  <p :key="index1">
                    <a class="hd" :key="index1" :href="item1.fileUrl" target="_blank">{{ item1.origFileName || "文件" + index1 + 1 }}</a>
                  </p>
                </template>
              </p> -->
            </div>
          </TimelineItem>
        </Timeline>
        <p v-else class="noData">暂无操作记录</p>
      </div>
    </Poptip>
  </div>
</template>
<script>
import * as API from "@/api/taxService/taxationAllot";
// import moment from "moment";
export default {
  name: 'log',
  props: {
    sendId: '',
    btnText: '',
  },
  data() {
    return {
      data: [],
      ifNone: false
    };
  },
  methods: {
    showOrderIndex(id) {
      this.getLog(id);
    },
    getLog(id) {
      let params = {
        id: id,
        logType: 'TICKET',
        subType: 'ALLOC',
      };
      API.getLog(params)
        .then(res => {
          if (res.code === 0) {
            if (res.data.length > 0) {
              console.log(res)
              // res.data.forEach(el => {
              //   if (el.createTime) {
              //     el.createTime = moment
              //       .unix(Number(el.createTime))
              //       .format("YYYY-MM-DD hh:mm:ss");
              //     el.files = el.files ? JSON.parse(el.files) : [];
              //   }
              // });
              this.data = res.data;
              this.ifNone = false;
            } else {
              this.ifNone = true;
            }
          } else {
            this.$Message.warning(res.message);
          }
        })
        .finally(() => { });
    }
  },
  mounted() { }
};
</script>
<style lang="less" scoped>
.api {
  padding-top: 16px;
}
.content {
  width: 240px;
  word-break: break-all;
  white-space: normal;
}
&/deep/ .ivu-timeline {
  max-height: 400px;
  min-height: 100px;
}
.noData {
  text-align: center;
  padding-bottom: 10px;
}
.imgU {
  margin-top: 5px;
  width: 100%;
}
.hd {
  padding-right: 10px;
}
.button {
  color: #2d8cf0;
  cursor: pointer;
}
</style>
