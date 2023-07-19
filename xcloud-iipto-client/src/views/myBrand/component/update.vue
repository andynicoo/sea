<template>
  <div>
    <Button type="primary" @click="onOpen">查看进度</Button>
    <Modal v-model="pauseModal" @on-cancel="onClose" width="600" footer-hide class="update-modal">
      <div class="tipsModal-title">查看进度</div>
      <div style="overflow: hidden">
        <div class="modal-contnet">
          <div class="no-data" v-if="recordList.length == 0">
            <img src="https://fdfs.itaxs.com/group1/M00/04/9B/rBLKNV_HhkiAdyssAABP3OKB26c631.png" alt="" />
            <p>暂无数据</p>
          </div>
          <div v-else class="item" v-for="item in recordList" :key="item.id">
            <span>{{ item.createTime }}</span>
            <span>{{ item.recordText }}</span>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getAmazonRecord } from '@/api/trademarkRegister/myBread'
export default {
  data () {
    return {
      pauseModal: false,
      recordList: []
    }
  },
  props: {
    id: String
  },
  methods: {
    onOpen () {
      this.pauseModal = true
      this.getList()
    },
    onClose () {
      this.pauseModal = false
    },
    async getList () {
      const params = {
        id: this.id,
        recordType: 2
      }
      let { code, data } = await getAmazonRecord(params)
      if (code === 0) this.recordList = data
    }
  }
}
</script>

<style lang="less" scoped>

.update-modal  {
  .ivu-modal-body {
    overflow: hidden;
  }
  .modal-contnet {
  position: relative;
  height: 350px;
  overflow: auto;
  padding: 20px 0;
  margin-bottom: 20px;
  .item {
    padding: 10px 0;
    display: flex;

    span:nth-child(1) {
      color: #999;
      margin-right: 15px;
      flex-shrink: 0;
    }
  }
}
}

.no-data {
  text-align: center;
}

</style>
