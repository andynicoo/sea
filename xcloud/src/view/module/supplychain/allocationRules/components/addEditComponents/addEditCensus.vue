  <!-- (分配统计)右侧展示统计表格 table -->
 <template>
  <div class="main"  v-show="isShow">
    <div>*此处仅统计当前分配中的供应商数据，历史完整统计数据见详情页</div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="realName" label="供应商">
      </el-table-column>
      <el-table-column prop="todayHandleCount" label="当日分配数">
      </el-table-column>
      <el-table-column prop="monthHandleCount" label="当月分配数">
      </el-table-column>
      <el-table-column prop="yearHandleCount" label="当年分配数">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import eaitMixins from '../../util/eaitMixins.js'
export default {
  name: 'addEditCensus',
  mixins: [eaitMixins],
  props: {
    tabkey: {
      //当前点击的tab Key
      type: [Number, String],
      default: "1",
    },
    comKey: {
      //组件的key
      type: [Number, String],
      default: "1",
    },
    tableData:{
      type:Array,
      default:()=>[]
    }
  },
  data() {
    return {
    
    }
  },
}
</script>

<style lang='scss' scoped>
.main {
  padding: 55px;
}
</style>