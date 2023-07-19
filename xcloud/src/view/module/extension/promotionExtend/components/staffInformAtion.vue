<template>
  <div class="app-container">
    <div class="item">
      <Title class="title" titieName="基础信息"></Title>
      <el-form label-position="left" class="message">
        <el-form-item label="公司主体：">
          {{ enterprise }}
        </el-form-item>
        <el-form-item label="平台：">
          {{ platformType[info.platform] }}
        </el-form-item>
        <el-form-item label="创建人：">
          {{ info.createBy }}
        </el-form-item>
        <el-form-item label="创建时间：">
          {{ info.createTime }}
        </el-form-item>
        <el-form-item label="更新时间：">
          {{ info.updateTime }}
        </el-form-item>
        <el-form-item label="是否支持生成专属链接：">
          {{ info.flagPersonal ? '是' : '否' }}
        </el-form-item>
      </el-form>
    </div>

    <div class="item">
      <!-- <p class="title">链接信息</p> -->
      <Title class="title" titieName="链接信息"></Title>
      <el-table border class="table" :data="list" v-loading="listLoading" ref="table" :height="settableHeight">
        <el-table-column align="center" label="活动名称">
          <template slot-scope="scope">{{ scope.row.linkName }}</template>
        </el-table-column>
        <el-table-column align="center" label="链接地址">
          <template slot-scope="scope">{{ scope.row.linkUrl }}</template>
        </el-table-column>
        <el-table-column align="center" label="平台">
          <template slot-scope="scope">{{ platformType[scope.row.platform] }}</template>
        </el-table-column>
        <el-table-column align="center" label="浏览量PV">
          <template slot-scope="scope">{{ scope.row.pv }}</template>
        </el-table-column>
        <el-table-column align="center" label="浏览量UV">
          <template slot-scope="scope">{{ scope.row.uv }}</template>
        </el-table-column>
        <el-table-column align="center" label="注册用户数">
          <template slot-scope="scope">{{ scope.row.registerCount }}</template>
        </el-table-column>
        <el-table-column align="center" label="订单数">
          <template slot-scope="scope">{{ scope.row.orderCount }}</template>
        </el-table-column>
        <el-table-column align="center" label="订单转化金额">
          <template slot-scope="scope">{{ scope.row.orderSaleMoney }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="createLink(scope.row, 'code')" v-if="scope.row.platform == 'applets'"> 生成专属二维码
            </el-button>
            <el-button type="text" @click="createLink(scope.row, 'link')"
              v-if="scope.row.platform != 'applets' && scope.row.linkUrl"> 生成链接 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="生成二维码" :visible.sync="dialogCode" width="400px" center destroy-on-close>
      <div class="shareCode">
        <img :src="shareImg" alt="">
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogCode = false" size="small">取消</el-button> -->
        <el-button type="primary" size="small" @click="downLoadCdoe">下载推广码</el-button>
      </div>
    </el-dialog>
    <el-dialog title="复制专属链接" :visible.sync="dialogLink" width="400px" center destroy-on-close>
      <div>是否复制专属链接 ?</div>
      <div slot="footer" class="dialog-link">
        <el-button @click="dialogLink = false" size="small">取消</el-button>
        <el-button type="primary" size="small" class="cp-btn" data-clipboard-action="copy" :data-clipboard-text="link"
          @click="copyLink">复制</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <!-- <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal || 0"></el-pagination>
    </div> -->
  </div>
</template>
<script>
import Title from '@/components/title/index';
import { getFirm } from '@/api/newApi/common.js';
import { getShareCode, getLink, linkAddressPageList } from '@/api/newApi/extension/promotionExtend.js';
export default {
  props: {
    activeName: String,
  },
  components: {
    Title,
  },
  data() {
    return {
      // 分页
      list: [],
      listTotal: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        service: '',
        status: '',
        level: 1,
      },
      platformType: {
        'pc': 'pc端',
        'h5': 'H5',
        'applets': '小程序',
        'offline': '线下'
      },
      info: {},
      sourceData: {},
      firmList: [],
      shareImg: '',
      dialogCode: false,
      dialogLink: false,
      link: ''
    };
  },
  created() {
    this.getfirmList();
    try {
      let detailObj = JSON.parse(window.sessionStorage.getItem('staffEditObj'));
      this.info = detailObj;
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    this.getDetail();
  },
  computed: {
    settableHeight() {
      return this.tableHeight + 200;
    },
    enterprise() {
      let obj = this.firmList.find((item) => item.id == this.info.enterpriseId);
      let name = (obj && obj.name) || '';
      return name;
    },
  },
  watch: {
    // 被侦听的变量count
    activeName() {
      if (this.activeName == '链接管理') {
        this.getDetail();
      }
    },
  },
  methods: {
    /**
     * 获取详情
     */
    getDetail() {
      linkAddressPageList({
        page: 1,
        limit: 99,
        platform: [this.info.platform],
        linkName: this.info.linkName,
        enterpriseId: this.info.enterpriseId
      }).then((res) => {

        if (res.code == 0) {
          this.list = res.data.records.filter(item => {
            return item.linkName == this.info.linkName
          });
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },

    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getDetail();
      // this.publicDataPaging();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.getDetail();
      // this.publicDataPaging();
    },
    createCode(row) {
      this.dialogCode = true
      this.getCode()
    },
    createLink(row, type) {
      getLink({ linkAddressId: row.linkAddressId }).then((res) => {
        if (res.code == 0) {
          this.link = res.data.pageUrl + '?promteCode=' + res.data.promteCode
          if (type == 'code') {
            this.getCode(row, res.data)
          } else {
            this.dialogLink = true
          }
        }
      });
    },
    //复制链接
    copyLink() {
      let _this = this;
      let clipboard = new this.clipboard(".cp-btn");
      clipboard.on("success", function (e) {
        _this.$Message.success("复制成功");
        _this.dialogLink = false
      });
      clipboard.on("error", function () {
        _this.$Message.info("复制失败");
      });
      setTimeout(() => {
        clipboard.destroy();
      }, 1000);
    },
    getCode(row, res) {
      // localStorage.setItem('enterpriseList', JSON.stringify(this.firmList));
      let path = ''
      if (row.linkUrl.startsWith('pages')) {
        path = row.linkUrl + '?promteCode=' + res.promteCode;
      } else {
        path = 'pages/index/index?promteCode=' + res.promteCode
      }
      let envVersion = 'trial'
      if (process.env.VUE_APP_ENV) {
        envVersion = process.env.VUE_APP_ENV == 'production' ? 'release' : 'trial'
      }
      let parmes = {
        path: path,
        /** 业务标识 注意: 不可用"sign" */
        type: 'open',
        /** 小程序环境 'trial' | 'release'*/
        envVersion: envVersion,
        /** 是否自动使用颜色 */
        autoColor: true,
        /** 是否透明 */
        isHyaline: false,
        /** 宽度 */
        width: 400,
      }
      let enterpriseList = JSON.parse(localStorage.getItem('enterpriseList'));
      let list = enterpriseList.find((item) => item.id === this.info.enterpriseId);
      let data = { id: this.info.enterpriseId, code: list.code };
      getShareCode(parmes, data).then((res) => {
        if (res.code == 0) {
          this.dialogCode = true
          this.shareImg = res.data.img
        }
      });
    },
    downLoadCdoe() {
      this.downloadFile('下载推广码.png', this.shareImg);
    },
    downloadFile(fileName, content) {
      let aLink = document.createElement('a')
      let blob = this.base64ToBlob(content) // new Blob([content]);
      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)
      // aLink.dispatchEvent(evt);
      aLink.click()
    },
    // base64转blob
    base64ToBlob(code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1]) // 解码base64得到二进制字符串
      let rawLength = raw.length
      let uInt8Array = new Uint8Array(rawLength) // 创建8位无符号整数值的类型化数组
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i) // 数组接收二进制字符串
      }
      return new Blob([uInt8Array], { type: contentType })
    },

    /**
     * 前端自动分页设置
     */
    publicDataPaging(limit, page, source = this.sourceData) {
      let { code, data, message } = source;
      // console.log(11);
      if (code == 0) {
        let total = data.records.length;
        return this.setNewDetailObj(total);
      }
    },

    setNewDetailObj(total) {
      let { pageNo, pageSize } = this.listQuery,
        records = total == 0 ? [] : this.getNewList();
      let obj = {
        current: pageNo, //当前页
        pages: Math.ceil(total / pageSize), //总页数
        size: pageSize, // 每页数据量
        total: total, //总数据量
        records,
      };
      // console.log(obj);
      return obj;
    },
    /**
     * 返回新数据
     */
    getNewList() {
      let {
        sourceData: {
          data: { records },
        },
        listQuery: { pageNo, pageSize },
      } = this,
        beforeEnd = 0,
        beforeStart = 0,
        start = 0,
        end = 0;
      beforeEnd = pageNo * pageSize; //数组结束下标等于：第几页 * 数据量
      end = beforeEnd >= records.length ? records.length : beforeEnd; //数组结束值数组结束下标
      beforeStart = Math.abs((pageNo - 1) * pageSize); // 数组开始下标等于 总数量 - 已经展示过的数据
      start = beforeStart < 0 ? 0 : beforeStart; //数组起始下标
      // console.log("end11", end);
      // console.log("start", start);
      return records.slice(start, end);
    },

    /**
     * 获取企业列表
     */
    getfirmList() {
      getFirm().then((res) => {
        if (res.code == 0) {
          this.firmList = res.data;
        } else {
          this.$message({
            type: 'error',
            message: res.message,
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.app-container {
  padding-bottom: 20px;
}

.title {
  color: #333;
  font-size: 14px;
  font-weight: bold;
  padding: 15px 0;
}

.item {
  border: 1px solid #eeeeee;
  padding: 20px;

  .table {
    height: calc(624px - 205px);
  }

  .message {
    display: grid;
    grid-template-columns: repeat(4, 25%);
  }
}

.pagination-container {
  margin-top: 24px;
}

.flex-item {
  display: flex;
  justify-items: center;
  justify-content: center;
}

.shareCode {
  height: 300px;

  img {
    width: 300px;
    display: block;
    margin: 0 auto;
  }
}

.dialog-footer {
  text-align: center;
}</style>
