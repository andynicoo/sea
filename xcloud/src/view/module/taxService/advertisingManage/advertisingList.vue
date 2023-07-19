<template>
  <div class="invoiceList">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem>
          <Input v-model="searchForm.advertiseName"
                 clearable
                 placeholder="请输入广告位名称"
                 style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.channelType"
                  placeholder="系统渠道">
            <Option value="0">PC网页端</Option>
            <Option value="1">小程序</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList"
                  style="margin-right:5px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
        <FormItem style="float:right;">
          <Button type="primary"
                  @click="addAdvFun()"
                  style="margin-right:5px;">添加广告位</Button>
        </FormItem>
      </Form>
      <div class="tableArea">
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData">
          <template slot="operate"
                    slot-scope="{ row }">
            <span class="operateBtn"
                  @click="toDeatil(row)">【编辑】</span>
            <span class="operateBtn"
                  @click="removeAdv(row)">【删除】</span>
          </template>
          <template slot="advertiseType"
                    slot-scope="{ row }">
            <span>{{row.advertiseType == '0' ? '首页banner轮播' : row.advertiseType == '1' ? '关于我们banner': row.advertiseType == '2' ? '新手指引banner' :  row.advertiseType == '3' ? '优选服务banner' : row.advertiseType == '4' ? '邀请用户banner' : row.advertiseType == '5' ? '顶部banner轮播' : row.advertiseType == '6' ? '一键算税banner': row.advertiseType == '7' ? '税务资讯banner': row.advertiseType == '8' ? 'H5首页banner': row.advertiseType == '9' ? '工作台banner': ''}}</span>
          </template>
          <template slot="channelType"
                    slot-scope="{ row }">
            <span>{{row.channelType == '0' ? 'PC网页端' : row.channelType == '1' ? '小程序端': row.channelType == '2' ? 'H5页面' :  ''}}</span>
          </template>
          <template slot="advertiseStatus"
                    slot-scope="{ row ,index }">
            <i-switch :value="row.advertiseStatus"
                      @on-change="switchStatus(row,index)"
                      size="large">
              <span slot="open">启用</span>
              <span slot="close">禁用</span>
            </i-switch>
          </template>
        </Table>
        <Page @on-change="changePageHandler"
              :current="pageInfo.page"
              :total="listTotal"
              :page-size="pageInfo.limit"
              show-total
              show-elevator />
      </div>
    </div>
    <Modal v-model="advModal"
           :title="advTitle">
      <Form ref="addModalForm"
            :model="addForm"
            :rules="addformRules"
            :label-width="100"
            inline>
        <Row>
          <FormItem label="广告名称"
                    prop="advertiseName">
            <Input v-model="addForm.advertiseName"
                   clearable
                   placeholder="请输入广告位名称"
                   style="width:200px;" />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="系统渠道"
                    prop="channelType">
            <Select style="width:200px;"
                    clearable
                    v-model="addForm.channelType"
                    placeholder="系统渠道">
              <Option value="0">PC网页端</Option>
              <Option value="1">小程序</Option>
              <Option value="2">H5</Option>
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="广告类型"
                    prop="advertiseType">
            <Select clearable
                    style="width:200px;"
                    v-model="addForm.advertiseType"
                    placeholder="广告类型">
              <Option value="0"
                      v-if="addForm.channelType == '0'">首页banner轮播</Option>
              <Option value="1"
                      v-if="addForm.channelType == '0'">关于我们banner</Option>
              <Option value="2"
                      v-if="addForm.channelType == '0'">新手指引banner</Option>
              <Option value="3"
                      v-if="addForm.channelType == '0'">优选服务banner</Option>
              <Option value="4"
                      v-if="addForm.channelType == '0'">邀请用户banner</Option>
              <Option value="5"
                      v-if="addForm.channelType == '1'">顶部banner轮播</Option>
              <Option value="6"
                      v-if="addForm.channelType == '0'">一键算税banner</Option>
              <Option value="7"
                      v-if="addForm.channelType == '0'">税务资讯banner </Option>
              <Option value="8"
                      v-if="addForm.channelType == '2'">H5首页banner </Option>
              <Option value="9"
                      v-if="addForm.channelType == '0'">工作台banner </Option>
            </Select>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="排序"
                    prop="rank">
            <Input type="number"
                   v-model="addForm.rank"
                   clearable
                   placeholder="请输入序号"
                   style="width:200px;" />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="链接">
            <Input v-model="addForm.advertiseUrl"
                   clearable
                   placeholder="请输入广告位链接"
                   style="width:200px;" />
          </FormItem>
        </Row>
        <Row>
          <FormItem label="banner图片"
                    prop="advertiseBannerPicture">
            <Upload ref="taxFile"
                    type="drag"
                    :action="fileUpload"
                    :data="{ prefix: '' }"
                    :before-upload="beroreTaxUpload"
                    :on-success="taxUploadSuccess"
                    :on-remove="removetax"
                    :show-upload-list="false"
                    style="width:260px">
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload"
                      size="30"
                      style="color: #3399ff"></Icon>
                <span>请拖拽文件到此区域上传或点击上传</span>
              </div>
            </Upload>
            <div>
              备注：网页banner尺寸：1920*540；小程序banner尺寸：718*260
            </div>
            <div v-if="addForm.advertiseBannerPicture !==''">
              <a :href="addForm.advertiseBannerPicture"
                 target="_blank">banner图片</a>
              <Icon type="ios-close-circle"
                    @click.stop="removeHandler('','','advertiseBannerPicture')" />
            </div>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="是否开启"
                    prop="advertiseStatus">
            <i-switch v-model="addForm.advertiseStatus"
                      size="large"
                      @on-change="addSwitchStatus()">
              <span slot="open">启用</span>
              <span slot="close">禁用</span>
            </i-switch>
          </FormItem>
        </Row>
      </Form>
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="advModal=false">取消</Button>
        <Button type="primary"
                @click="sureUploadTax('addModalForm')">确认</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/taxService/adv.js';
export default {
  name: 'orderList',
  data() {
    return {
      isDetailShow: false,
      fileUpload: this.workOrderFile,
      advModal: false,
      searchForm: {
        advertiseName: '',
        channelType: ''
      },
      addForm: {
        advertiseName: '',
        channelType: '',
        advertiseStatus: true,
        advertiseBannerPicture: '',
        advertiseUrl: '',
        rank: '',
        advertiseType: ''
      },
      date: '',
      countryList: [],
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      tableLoading: false,
      advTitle: '新增广告位',
      detailId: '',
      addformRules: {
        advertiseName: [
          { required: true, message: '广告名称不能为空', trigger: 'blur' }
        ],
        channelType: [
          { required: true, message: '系统类型不能为空', trigger: 'blur' }
        ],
        advertiseType: [
          { required: true, message: '广告类型不能为空', trigger: 'blur' }
        ],
        rank: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ],
        advertiseUrl: [
          { required: true, message: '链接不能为空', trigger: 'blur' }
        ],
        advertiseBannerPicture: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        advertiseStatus: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
        ]
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 50
        },
        {
          title: '广告名称',
          key: 'advertiseName',
          minWidth: 50,
        },
        {
          title: '广告类型',
          slot: 'advertiseType'
        },
        {
          title: '广告链接',
          key: 'advertiseUrl'
        },
        {
          title: '系统渠道',
          slot: 'channelType'
        },
        {
          title: '是否开启',
          slot: 'advertiseStatus'
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      totalOrderMoney: 0,
      totalamountMoney: 0,
      totaldiscAmount: 0,
      tableData: [],
      id: '',
    }
  },
  mounted() {
    this.getAdvList();
  },
  components: {
  },
  methods: {
    //获取列表
    getAdvList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      API.getAdvList(params).then((res) => {
        if (res.code == 0) {
          this.tableLoading = false;
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
          this.tableData.forEach(element => {
            if (element.advertiseStatus === 1) element.advertiseStatus = false
            if (element.advertiseStatus === 0) element.advertiseStatus = true
            element.advertiseType = element.advertiseType.toString()
            element.channelType = element.channelType.toString()
          });
        } else {
          this.$Message.warning(res.message);
          this.tableLoading = false
        }
      })
        .catch((err) => console.log(err))
    },
    //搜索列表
    searchList() {
      this.pageInfo.page = 1;
      this.getAdvList()
    },
    //添加广告弹窗
    addAdvFun() {
      this.advTitle = '新增广告位'
      this.$refs['addModalForm'].resetFields()
      this.addForm = {
        advertiseName: '',
        channelType: '',
        advertiseStatus: true,
        advertiseBannerPicture: '',
        advertiseUrl: '',
        rank: '',
        advertiseType: ''
      }
      this.advModal = true
    },
    addSwitchStatus() {

    },
    switchStatus(val) {
      this.addForm = val
      if (this.addForm.advertiseStatus === false) this.addForm.advertiseStatus = 0
      if (this.addForm.advertiseStatus === true) this.addForm.advertiseStatus = 1
      API.addSaveOrUpdate(this.addForm).then(res => {
        if (res.code === 0) {
          this.$Message.success('广告操作成功')
          this.advModal = false
          this.getAdvList()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //重置列表
    resetList() {
      this.searchForm = {
        advertiseName: '',
        channelType: ''
      };
      this.date = "";
      this.pageInfo.page = 1;
      this.getAdvList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getAdvList()
    },
    //上传之前
    beroreTaxUpload() {
      let self = this;
      const check = self.addForm.advertiseBannerPicture == "";
      if (!check) {
        self.$Notice.warning({
          title: "最多只可上传1个文件"
        });
      }
      return check;
    },
    //上传成功
    taxUploadSuccess(res, file, fileList) {
      this.addForm.advertiseBannerPicture = res.data.fileUrl;
    },
    //移除图片
    removetax(res, file, fileList) {
      this.addForm.advertiseBannerPicture = '';
    },
    removeHandler(file, fileList, item) {
      this.addForm[item] = "";
    },
    // 删除广告
    removeAdv(row) {
      this.id = row.id
      this.$Modal.confirm({
        title: '温馨提醒',
        content: '<p>是否删除该广告</p>',
        onOk: () => {
          API.removeAdv({
            id: row.id
          }).then(res => {
            if (res.code === 0) {
              this.$Message.success('广告删除成功')
              this.getAdvList()
            }
          })
        }
      });
    },
    sureUploadTax() {
      if (this.addForm.advertiseName == '') {
        this.$Message.info('广告名称不能为空')
        return
      }
      if (this.addForm.channelType === '') {
        this.$Message.info('系统类型不能为空')
        return
      }
      if (this.addForm.advertiseType === '') {
        this.$Message.info('广告类型不能为空')
        return
      }
      if (this.addForm.rank === '' || this.addForm.rank < 0) {
        this.$Message.info('排序输入有误')
        return
      }
      // if (this.addForm.advertiseUrl === '') {
      //   this.$Message.info('广告链接不能为空')
      //   return
      // }
      if (this.addForm.advertiseBannerPicture === '') {
        this.$Message.info('图片不能为空')
        return
      }
      if (this.addForm.advertiseStatus === false) this.addForm.advertiseStatus = 1
      if (this.addForm.advertiseStatus === true) this.addForm.advertiseStatus = 0
      API.addSaveOrUpdate(this.addForm).then(res => {
        if (res.code === 0) {
          this.$Message.success('广告操作成功')
          this.advModal = false
          this.getAdvList()
        }
      }).catch(err => {
        console.log(err)
      })

    },
    toDeatil(row) {
      this.advTitle = '编辑广告位'
      this.$refs['addModalForm'].resetFields()
      API.advDetail({
        id: row.id
      }).then(res => {
        if (res.code === 0) {
          res.data.advertiseType = res.data.advertiseType.toString()
          res.data.channelType = res.data.channelType.toString()
          this.addForm = res.data
          if (this.addForm.advertiseStatus === 1) this.addForm.advertiseStatus = false
          if (this.addForm.advertiseStatus === 0) this.addForm.advertiseStatus = true
          this.advModal = true
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.invoiceList {
  .tableArea {
    .operateBtn {
      cursor: pointer;
    }
  }
}
</style>