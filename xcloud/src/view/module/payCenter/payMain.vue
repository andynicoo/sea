<template>
  <div class="payAdmin">
    <Card v-show="listModel">
      <Form ref="searchForm" :model="searchForm" class :label-width="70" inline>
        <FormItem label="主体名称">
          <Input style="width: 200px" clearable v-model="searchForm.subjectName" placeholder="请输入主体名称" />
        </FormItem>
        <FormItem label="创建时间">
          <DatePicker type="datetimerange" :options="dateOptions" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择创建时间" style="width: 280px" clearable :value="createTime" @on-change="changeCreateTime"></DatePicker>
        </FormItem>
        <FormItem label="状态：">
          <Select style="width: 200px" clearable v-model="searchForm.status" placeholder="请选择状态">
            <Option v-for="item in allocationType" :value="item.key" :key="item.key">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem :label-width="10">
          <Button type="primary" @click="searchList">查询</Button>
          <Button @click="clearHandler" type="primary" ghost>重置</Button>
          <Button type="primary" @click="changeAdd" v-show="hasAuthority('add_pay_main')">新增支付主体</Button>
        </FormItem>
      </Form>
      <Table border :columns="columns" :data="data" :loading="loadTable">
        <template slot="status" slot-scope="{ row }">
          <i-switch v-model="row.status" :value="row.status" :true-value="'ENABLE'" :false-value="'CLOSE'" @on-change="isHomeShowSwitch(row)" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
        <template slot="action" slot-scope="{ row }">
          <Button type="primary" ghost @click="editRoute(row)" v-show="hasAuthority('pay_route_config')">配置路由</Button>
          <Button type="primary" ghost @click="editPay(row)" v-show="hasAuthority('pay_main_edit')">编辑</Button>
        </template>
      </Table>
      <Page :total="pageInfo.total" show-elevator show-sizer transfer :current="pageInfo.page" :page-size="pageInfo.size" show-total @on-change="handlePage" @on-page-size-change="handlePageSize" />
      <Modal v-model="modalAll" title="新增支付主体" okText cancelText :mask-closable="false" :footer-hide="true" width="1000px">
        <Form ref="addAllFrom" :model="addAllFrom" :rules="ruleAllFrom" :label-width="100">
          <Row>
            <Col span="12">
              <FormItem label="主体名称" prop="subjectName">
                <Input v-model="addAllFrom.subjectName" :maxlength="30" placeholder="请输入商户名称" />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="状态" prop="status">
                <i-switch v-model="addAllFrom.status" :value="addAllFrom.status" :true-value="'ENABLE'" :false-value="'CLOSE'" size="large">
                  <span slot="open">启用</span>
                  <span slot="close">禁用</span>
                </i-switch>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <div v-for="(item, index) in formDynamic" :key="index">
              <FormItem :label="'支付公司'">
                <Row>
                  <Col span="6" style="margin-right: 10px">
                    <Select clearable v-model="item.channelKey" placeholder="请选择支付公司" @on-change="optionsChange($event, index)">
                      <Option :disabled="value.disabled" v-for="value in payCompanyArry" :value="value.key" :key="value.key">{{ value.name }}</Option>
                    </Select>
                  </Col>
                  <Col span="5" style="margin-right: 10px" v-for="(value, k) in item.paySubjectChannelParameterList" :key="k">
                    <Input type="text" v-model="value.payChannelParameterValue" :placeholder="value.payChannelParameterKey"></Input>
                  </Col>
                  <Col span="1" style="margin-right: 10px" v-if="index > 0">
                    <Button @click="handleRemove(index)" type="primary">删除</Button>
                  </Col>
                </Row>
              </FormItem>
            </div>
          </Row>
          <Row>
            <Col span="8">
              <FormItem>
                <Button type="dashed" long @click="handleAdd" icon="md-add">新增支付</Button>
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button type="primary" @click="addPay('addAllFrom')" :loading="loadEdit">提交</Button>
            <Button @click="modalAll = false" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </Modal>
      <Modal v-model="modalRoute" title="路由配置" okText cancelText :mask-closable="false" :footer-hide="true" width="1000px">
        <Form ref="addRouteFrom" :rules="ruleAllFrom" :label-width="100">
          <h3>基础信息</h3>
          <Row>
            <Col span="12">
              <FormItem label="主体名称" prop="name">
                <Input v-model="formRoute.subjectName" :maxlength="30" placeholder="请输入商户名称" disabled />
              </FormItem>
            </Col>
          </Row>
          <h3>支付方式</h3>
          <br />
          <Row>
            <Table border :columns="columnsRoute" :data="formRouteData" :loading="loadTableRoute">
              <template slot="paymentWayDTOList" slot-scope="{ row, index }">
                <CheckboxGroup v-model="row.checkArry" @on-change="optionsChangeCheck(row.checkArry, index)">
                  <Checkbox :label="value.wayKey" v-for="(value, index) in row.paymentWayDTOList" :key="index">{{ value.name }}</Checkbox>
                </CheckboxGroup>
              </template>
            </Table>
          </Row>
          <br />
          <FormItem>
            <Button type="primary" @click="addRoute" :loading="loadEdit">提交</Button>
            <Button @click="modalRoute = false" style="margin-left: 8px">取消</Button>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </div>
</template>
<script>
import { getPayMainList, getPayWay, addPayMain, editPayMainWay, getPayCompany, getPayRoute, updatedPaySubject, getPayInfo } from '@/api/payCenter';
export default {
  data() {
    return {
      allocationType: [
        { key: 'ENABLE', name: '启用' },
        { key: 'CLOSE', name: '停用' },
      ],
      index: 1,
      formDynamic: [
        {
          channelName: '',
          channelKey: '',
          paySubjectChannelParameterList: [],
        },
      ],
      userName: this.$store.state.user.userName,
      nickName: this.$store.state.user.nickName,
      formRoute: {},
      formRouteData: [],
      dateOptions: {
        shortcuts: [
          {
            text: '近一周',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            },
          },
          {
            text: '近一个月',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            },
          },
          {
            text: '近三个月',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            },
          },
        ],
      },
      listModel: true,
      listInfo: {},
      loadTable: false,
      loadTableRoute: false,
      modalAll: false,
      modalRoute: false,
      loadEdit: false,
      addAllFrom: {
        status: 'ENABLE',
      },
      ruleAllFrom: {
        subjectName: [
          {
            required: true,
            message: '主体名称不能为空',
            trigger: 'blur',
          },
        ],
        status: {
          required: true,
          message: '请选择状态',
          trigger: 'change',
        },
      },
      columns: [
        {
          title: '主体名称',
          key: 'subjectName',
        },
        {
          title: '已对接的支付公司',
          key: 'subjectChannelNames',
        },

        {
          title: '状态',
          key: 'status',
          slot: 'status',
        },
        {
          title: '创建人',
          key: 'createdBy',
        },
        {
          title: '创建时间',
          key: 'createdTime',
          sortable: true,
          minWidth: 70,
        },
        {
          title: '更新人',
          key: 'updatedBy',
        },
        {
          title: '更新时间',
          key: 'updatedTime',
          sortable: true,
          minWidth: 70,
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 100,
        },
      ],
      columnsRoute: [
        {
          title: '支付公司',
          key: 'channelName',
          width: 120,
        },
        {
          title: '支付方式',
          // align: 'center',
          key: 'paymentWayDTOList',
          slot: 'paymentWayDTOList',
        },
      ],
      data: [],
      searchForm: {},
      searchstatecode: [1, 0],
      pageInfo: {
        total: 0,
        current: 1,
        size: 10,
      },
      createTime: '',
      selectobj: '',

      selects: [],
      editId: '',
      payCompanyArry: [],
      payWayArry: [
        { id: '1', name: '微信扫码' },
        { id: '0', name: '微信小程序' },
        { id: '3', name: '微信H5' },
      ],
      isEdit: false,
      isEditRoute: false,
    };
  },
  methods: {
    getList() {
      this.loadTable = true;
      let obj = this.searchForm;
      let data = { ...this.pageInfo, ...obj };
      getPayMainList(data)
        .then(
          (res) => {
            if (res.code == 0) {
              this.pageInfo.total = parseInt(res.data.total);
              this.data = res.data.records;
              this.loadTable = false;
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    // 创建时间
    changeCreateTime(time) {
      // 结束时时分秒是 00:00:00 则改为23:59:59
      let endTime = time[1];
      if (endTime.includes('00:00:00')) {
        endTime = endTime.replace('00:00:00', '23:59:59');
      }
      const dateTime = [time[0], endTime];
      this.searchForm.startCreatedTime = dateTime[0];
      this.searchForm.endCreatedTime = dateTime[1];
      this.createTime = dateTime;
    },
    optionsChange(el, index) {
      if (!el) {
        this.$set(this.formDynamic, index, {
          channelName: '',
          channelKey: '',
          paySubjectChannelParameterList: [],
        });
        this.updatedPayCompanyArry();
      } else {
        let selectObj = this.selectCompany(el);
        let json = JSON.parse(selectObj.parameter);
        let arry = [];
        for (name in json) {
          arry.push({
            payChannelParameterKey: name,
            payChannelParameterValue: '',
          });
        }
        this.$set(this.formDynamic, index, {
          channelName: selectObj.name,
          channelKey: el,
          paySubjectChannelParameterList: arry,
        });
        this.updatedPayCompanyArry();
      }
    },
    selectCompany(el) {
      let company = this.payCompanyArry.filter((item) => item.key == el);
      return company[0];
    },
    handleRemove(index) {
      if (index == 0) {
        return false;
      }
      this.formDynamic.splice(index, 1);
      this.updatedPayCompanyArry();
    },
    handleAdd() {
      let length = this.payCompanyArry.length;
      if (this.formDynamic.length == length) {
        this.$Message.info('最多添加' + length + '条');
        return false;
      }
      this.formDynamic.push({
        channelName: '',
        channelKey: '',
        paySubjectChannelParameterList: [],
      });
      this.updatedPayCompanyArry();
    },
    isHomeShowSwitch(row) {
      updatedPaySubject({ paySubjectId: row.paySubjectId, status: row.status, userName: this.nickName })
        .then(
          (res) => {
            if (res.code == 0) {
              this.$Message.success('修改成功');

              this.getList();
            } else {
              this.$Message.success(res.message);
            }
          },
          (err) => {
            console.log(err);
          }
        )
        .finally(() => {});
    },
    addPay(all) {
      this.$refs[all].validate((valid) => {
        if (valid) {
          let obj = this.addAllFrom;
          let json = {
            paySubjectChannelList: this.formDynamic,
          };
          let payJson = json.paySubjectChannelList;
          for (let i in payJson) {
            if (payJson[i].channelKey == '') {
              this.$Message.info('请填写信息');
              return false;
            }
            for (let k in payJson[i].paySubjectChannelParameterList) {
              let value = payJson[i].paySubjectChannelParameterList[k].payChannelParameterValue;
              if (value == '') {
                this.$Message.info('请填写信息');
                return false;
              }
            }
          }
          let data = { ...this.addAllFrom, ...json };
          data.userName = this.nickName;
          if (this.isEdit) {
            this.editPayCenterMain(data);
          } else {
            this.addPayCenterMain(data);
          }
        }
      });
    },
    addPayCenterMain(obj) {
      addPayMain(obj)
        .then(
          (res) => {
            if (res.code == 0) {
              let data = res.data;
              this.modalAll = false;
              this.modalRoute = true;
              this.getList();
              this.formRoute = {
                subjectName: data.subjectName,
                paySubjectId: data.paySubjectId,
              };
              this.payRoute({ paySubjectId: data.paySubjectId });
            } else {
              this.$Message.success(res.message);
            }
          },
          (err) => {
            console.log(err);
          }
        )
        .finally(() => {});
    },
    editPayCenterMain(obj) {
      updatedPaySubject(obj)
        .then(
          (res) => {
            if (res.code == 0) {
              this.$Message.success('修改成功');
              this.modalAll = false;
              this.getList();
            } else {
              this.$Message.success(res.message);
            }
          },
          (err) => {
            console.log(err);
          }
        )
        .finally(() => {});
    },
    addRoute() {
      let payArry = [];
      this.formRouteData.forEach((item) => {
        let checkArry = item.checkArry;
        item.paymentWayDTOList.forEach((value) => {
          if (checkArry.indexOf(value.wayKey) > -1) {
            payArry.push({
              payChannelId: item.paySubjectChannelId,
              payWayName: value.name,
              payWayKey: value.wayKey,
              payWayId: value.payWayId,
            });
          }
        });
      });
      editPayMainWay({ payWayVOList: payArry, userName: this.nickName, paySubjectId: this.formRoute.paySubjectId })
        .then(
          (res) => {
            this.modalRoute = false;
            this.getList();
          },
          (err) => {}
        )
        .finally(() => {});
    },
    optionsChangeCheck(arry, index) {
      this.formRouteData[index].checkArry = arry;
    },
    changeAdd() {
      this.addAllFrom = {
        status: 'ENABLE',
      };
      this.formDynamic = [
        {
          channelName: '',
          channelKey: '',
          paySubjectChannelParameterList: [],
        },
      ];
      this.payCompanyArry.forEach((item) => {
        item.disabled = false;
      });
      this.modalAll = true;
      this.isEdit = false;
      this.isEditRoute = false;
    },
    editPay(row) {
      this.modalAll = true;
      this.isEdit = true;
      this.addAllFrom = {
        subjectName: row.subjectName,
        status: row.status,
        paySubjectId: row.paySubjectId,
      };
      getPayInfo({ paySubjectId: row.paySubjectId })
        .then(
          (res) => {
            this.formDynamic = res.data.paySubjectChannelList;
            this.updatedPayCompanyArry();
          },
          (err) => {}
        )
        .finally(() => {});
    },
    updatedPayCompanyArry() {
      let selectPayArry = this.formDynamic.map((item) => {
        if (item.channelKey) {
          return item.channelKey;
        }
      });
      this.payCompanyArry.forEach((item) => {
        if (selectPayArry.indexOf(item.key) > -1) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    },
    editRoute(row) {
      this.modalRoute = true;
      this.isEditRoute = true;
      this.formRoute = {
        paySubjectId: row.paySubjectId,
        subjectName: row.subjectName,
      };
      this.payRoute({ paySubjectId: row.paySubjectId });
    },
    payRoute(obj) {
      this.loadTableRoute = true;
      getPayRoute(obj)
        .then(
          (res) => {
            // console.log(res);
            if (res.code == 0) {
              this.loadTableRoute = false;
              let data = res.data;
              data.forEach((item) => {
                let checkArry = [];
                item.paymentWayDTOList.forEach((value) => {
                  if (this.isEditRoute) {
                    if (value.isSelectd) {
                      checkArry.push(value.wayKey);
                    }
                  } else {
                    checkArry.push(value.wayKey);
                  }
                });
                item.checkArry = checkArry;
              });
              this.formRouteData = data;
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    getCompanyList() {
      getPayCompany({})
        .then(
          (res) => {
            let data = res.data;
            data.forEach((item) => {
              item.disabled = false;
            });
            this.payCompanyArry = data;
          },
          (err) => {}
        )
        .finally(() => {});
    },
    getWayList() {
      getPayWay({})
        .then(
          (res) => {
            //this.payCompanyArry = res
          },
          (err) => {}
        )
        .finally(() => {});
    },
    searchList() {
      this.pageInfo.current = 1;
      this.getList();
    },
    clearHandler() {
      this.searchForm = {};
      this.createTime = '';
      this.getList();
    },
    // 分页
    handlePage(current) {
      this.pageInfo.current = current;
      this.handleSearch();
    },
    handlePageSize(size) {
      this.pageInfo.size = size;
      this.handleSearch();
    },
    handleSearch(page) {
      if (page) {
        this.pageInfo.current = page;
      }
      this.loading = true;
      this.getList();
    },
  },
  mounted() {
    this.getList();
    this.getCompanyList();
  },
};
</script>
<style lang="less">
.payAdmin {
  .ivu-form,
  .ivu-row-flex {
    button {
      margin-right: 10px;
    }
  }
  .ivu-row {
    margin: 10px;
  }
  .ivu-table-wrapper {
    margin-top: 10px;
    button {
      margin-right: 10px;
    }
    .spanHd {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        margin-right: 5px;
      }
    }
  }
}
.ivu-modal-footer {
  text-align: center;
  .footerBt {
    width: 150px;
    height: 40px;
    font-size: 15px;
  }
}
</style>
