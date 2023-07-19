<template>
  <div class="app-container">
    <div class="header-container">
      <el-link :underline="false" @click="back"><i class="el-icon-arrow-left" style="margin-right: 6px;cursor: pointer;margin-bottom: 20px"></i>返回列表</el-link>
      <h1>{{form.title}}</h1>
      <div class="consulting-info">
        <div class="info"><i class="el-icon-view" style="margin-right: 4px"></i>{{form.record}}</div>
        <div class="info"><i class="el-icon-time" style="margin-right: 4px"></i>{{form.createTime}}</div>
        <div class="info"><i class="el-icon-user" style="margin-right: 4px"></i>{{form.author}}</div>
      </div>
      <div class="content" v-html="form.content" style="word-break: break-all"></div>
      <el-divider></el-divider>
      <div class="page-block">
        <el-link class="el-icon-arrow-left" type="primary" @click="trun('pre')">{{form.preTitle || '已经是第一篇了'}}</el-link>
        <el-link type="primary" @click="trun('next')">{{form.nextTitle || '已经是最后一篇了'}}<i class="el-icon-arrow-right el-icon--right"></i></el-link>
      </div>
    </div>
  </div>
</template>

<script>
import {getNewsDocumentAllInfo} from '@/api/newApi/consultingCenter/consultingManage'
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      id: this.$route.query.id || 0,
      form: {}
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getNewsDocumentAllInfo(this.id).then(res => {
        res.data.content = this.$Base64.decode(res.data.content)
        this.form = res.data
      })
    },
    trun(type) {
      if(type === 'pre' && this.form.preId) {
        this.id = this.form.preId
        this.getInfo()
      } else if(type === 'next' && this.form.nextId) {
        this.id = this.form.nextId
        this.getInfo()
      } else {
        this.$message.warning('没有更多了')
      }
    },
    ...mapMutations(["closeTag"]),
    back () {
      this.closeTag(this.$route)
      this.$router.push({
        path: '/consultingManage/consultingList/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .header-container {
    padding: 20px;
    .consulting-info {
      border-bottom: 1px solid #eee;
      padding: 20px 0;
      margin-bottom: 20px;
      display: flex;
      .info {
        font-size: 14px;
        margin-right: 20px;
      }
    }
    .content {
      height: calc(100vh - 415px);
      overflow-y: auto;
    }
    .page-block {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
    }
  }
}
</style>