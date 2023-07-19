<template>
  <div class="tablediv">
    <div class="row">
      <h3>
        套餐介绍
      </h3>
      <p v-for="item in cloumn" :key="item">
        {{ item }}
      </p>
    </div>
    <div v-for="(item, index) in rebuildData" :key="item.name">
      <div
        v-show="
          (tableTitle.length && tableTitle[index] === curLevelName) ||
            (tableTitle.length && tableTitle[index] === nextLevelName)
        "
        class="row2"
      >
        <h3>
          {{ tableTitle.length ? tableTitle[index] : 'ss' }}
          <a-tag
            color="orange"
            v-if="tableTitle.length && tableTitle[index] === curLevelName"
          >
            升级前
          </a-tag>
          <a-tag
            color="orange"
            v-if="tableTitle.length && tableTitle[index] === nextLevelName"
          >
            升级后
          </a-tag>
        </h3>
        <p v-for="it in item" :key="it.name">
          <!-- limitCount==0，是不限制 -->
          <span v-show="it.limitCount !== 0">{{ it.limitCount }}</span>
          <span v-show="it.limitCount !== 0">{{ it.unit }} </span>
          <span v-show="it.limitCount === 0">
            {{ it.name === '聊聊工具' ? '独立付费' : '不限制' }}
          </span>
          <span v-show="it.dayUnit">/{{ it.dayUnit }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import member from '@/api/member'
export default {
  props: {
    curLevelName: String,
    nextLevelName: String
  },
  data() {
    return {
      originInfo: [], // 原始数据
      rebuildData: [],
      cloumn: [], // 套餐介绍列
      tableTitle: [],
      curLevel: '' // 当前等级
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getAllMemberInfo()
    })

    console.log(this.curLevelName, this.nextLevelName)
  },
  methods: {
    getAllMemberInfo() {
      console.log(this.curLevelName, this.nextLevelName)
      member
        .getMemberListinfo({})
        .then((res) => {
          this.$data.originInfo = res.data
        })
        .finally(() => {
          this.rebuildDataFun()
        })
    },
    rebuildDataFun() {
      console.log(this.curLevelName, this.nextLevelName)
      let data = cloneDeep(this.$data.originInfo)
      if (data.length) {
        let temp = data[0].configInfoList
        let pushTemp = []
        temp.map((item) => {
          pushTemp.push(item.name)
        })
        this.$data.cloumn = pushTemp

        data.map((item) => {
          console.log(item)
          this.$data.rebuildData.push(item.configInfoList)
          this.$data.tableTitle.push(item.name)
        })
      } else {
        this.$data.cloumn = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './tablediv';
</style>
