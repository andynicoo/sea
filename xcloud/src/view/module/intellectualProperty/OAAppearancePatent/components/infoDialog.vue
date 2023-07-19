<template>
  <el-dialog
    title="查看OA"
    :visible.sync="dialogvisible"
    width="460px"
    center
  >
    <el-form
      :model="oaDetailWorkOrderVO"
      ref="form"
    >
      <el-form-item label="是否需要客户处理:" prop="status">
        {{oaDetailWorkOrderVO.processing === 1 ? '不需要' : '需要'}}
      </el-form-item>
      <span v-if="oaDetailWorkOrderVO.processing === 2">
        <el-form-item label="答复建议:" prop="status">
          {{oaDetailWorkOrderVO.processingSuggestion}}
        </el-form-item>
        <el-form-item label="客户截至日期:" prop="status">
          {{(oaDetailWorkOrderVO.lastDealDate || '').split(' ')[0]}}
        </el-form-item>
        <el-form-item label="审查意见翻译文件:" prop="status">
          <el-link type="primary" :underline="false" target="_blank" :href="replaceHttps(oaDetailWorkOrderVO.interpretFile)" v-if="oaDetailWorkOrderVO.interpretFile">答复OA帮助文档</el-link>
        </el-form-item>
        <el-form-item label="是否需要付费:" prop="status">
          {{oaDetailWorkOrderVO.isNeedPay === 1 ? '不需要' : '需要'}}
        </el-form-item>
        <el-form-item :label="oaDetailWorkOrderVO.productName + ':'" prop="status" v-if="oaDetailWorkOrderVO.isNeedPay === 2">
          ￥{{oaDetailWorkOrderVO.productMoney}}
        </el-form-item>
      </span>
      <span v-else>
        <el-form-item label="OA答复材料:" prop="status">
          <el-link
            type="primary"
            :underline="false"
            target="_blank"
            v-for="(item, index) in answerFileList"
            :href="item.url"
            :key="index"
          >
            {{item.name}}
            <span v-if="index !== answerFileList.length - 1">、</span>
          </el-link>
        </el-form-item>
        <el-form-item label="备注:" prop="status">
          {{oaDetailWorkOrderVO.processingSuggestion || '无'}}
        </el-form-item>
      </span>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    infoDialog: Boolean,
    oaDetailWorkOrderVO: Object
  },
  computed: {
    dialogvisible: {
      get() {
        return this.infoDialog;
      },
      set(val) {
        this.$emit("update:infoDialog", val);
      },
    },
    answerFileList() {
      return (this.oaDetailWorkOrderVO.answerFile || '').split(',').map(url => ({
        url: this.replaceHttps(url),
        name: this.$util.getNameByUrl(url)
      }))
    }
  },
};
</script>

<style></style>