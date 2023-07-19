<template>
  <div>
    <Form :model="addChannel"
          ref="channelForm"
          :label-width="120"
          :rules="channelRule">
      <FormItem label="渠道名称："
                prop="channelName">
        <Input v-model="addChannel.channelName"
               style="width:300px;"
               placeholder="请输入渠道名称"></Input>
      </FormItem>
      <FormItem label="渠道登录账号："
                prop="adminUserName">
        <Input v-model="addChannel.adminUserName"
               :disabled="this.operateType === 'edit'"
               style="width:300px;"
               placeholder="  请输入渠道登录账号"></Input>
      </FormItem>
      <FormItem label="联系人："
                prop="adminUserNickName">
        <Input v-model="addChannel.adminUserNickName"
               style="width:300px;"
               placeholder=" 请输入联系人"></Input>
      </FormItem>
      <FormItem label="联系电话："
                prop="adminUserMobile">
        <Input v-model="addChannel.adminUserMobile"
               style="width:300px;"
               placeholder="  请输入联系电话"></Input>
      </FormItem>
      <FormItem label="联系地址（选填）：">
        <Input v-model="addChannel.address"
               style="width:300px;"
               type="textarea"
               :autosize="{minRows: 2,maxRows: 5}"
               placeholder="请输入联系地址"></Input>
      </FormItem>
      <FormItem label="结算规则："
                style="margin-bottom:0px;"
                v-model="addChannel.mapChannelClearing">
        <div class="boxContent">
          <div class="ruleBox">
            <Row v-for="(item, index) in addChannel.mapChannelClearing"
                 :key="index">
              <Col :span="3">
              <div>
                国家：<span style="font-weight:bold">
                  <span>
                    {{item.countryNameEn}}
                  </span>
                </span>
              </div>
              </Col>
              <Col :span="10">
              <div class="inline">
                <div class="line-width">
                  返佣方式:
                </div>
                <Select v-model="item.rebateMethod"
                        @on-select="rebateMethod(index, $event)"
                        style="width:200px;">
                  <Option value="1">按比例返佣</Option>
                  <Option value="2">按金额返佣</Option>
                </Select>
              </div>
              </Col>
              <Col :span="10">
              <div class="inline">
                <div class="line-width">
                  返佣金额:
                </div>
                <Input style="margin-right:10px;width:200px;"
                       v-model="item.rebateValue"
                       placeholder="返佣金额"></Input>
                <span v-if="item.rebateMethod == '1'">
                  %
                </span>
                <span v-else>
                  元
                </span>
              </div>
              </Col>
            </Row>
          </div>
        </div>
      </FormItem>
      <FormItem label="渠道经理："
                prop="channelManagerUserId">
        <Select v-model="addChannel.channelManagerUserId"
                @on-change="changeManager"
                style="width:300px;">
          <Option :value="item.userId"
                  v-for="(item,index) in roleusersList"
                  :key="index">{{item.nickName}}</Option>
        </Select>
      </FormItem>
      <FormItem class="btnBox">
        <Button type="primary"
                @click="handleSubmit('channelForm')"
                style="width:200px;">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { roleusers } from "@/api/taxService/user"
import { baseinfo } from "@/api/taxService/order"
import { addChannel } from "@/api/taxService/channel"
export default {
  props: {
    chanelDetail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    operateType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      formRuleData: [],
      roleusersList: [],
      addChannel: {
        channelManager: '',
        channelName: '',
        adminUserName: '',
        adminUserNickName: '',
        adminUserMobile: '',
        channelManagerUserId: '',
        address: '',
        id: '',
        mapChannelClearing: {}
      },
      countryCodeList: [],
      channelRule: {
        channelName: [
          { required: true, message: '渠道名称不能为空', trigger: 'blur' }
        ],
        adminUserName: [
          { required: true, message: '渠道登录账号不能为空', trigger: 'blur' }
        ],
        adminUserNickName: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        adminUserMobile: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        channelManagerUserId: [
          { required: true, message: '渠道跟进经理名称不能为空', trigger: 'change' }
        ],
      }
    }
  },
  created() {
    this.getRoleusers()
    this.baseinfoFun()
  },
  methods: {
    baseinfoFun() {
      let that = this
      var obj = {}
      if (JSON.stringify(this.chanelDetail) === '{}') {
        baseinfo().then(res => {
          if (res.code === 0) {
            res.data.forEach(element => {
              var key = element.countryCode;
              obj[key] = {
                countryCode: element.countryCode,
                countryNameEn: element.countryNameEn,
                countryNameZh: element.countryNameZh,
                rebateValue: '',
                rebateMethod: ''
              };
            })
            this.$set(this.addChannel, 'mapChannelClearing', obj)
          }
        })
      } else {
        this.chanelDetail.listChannelClearing.forEach((ele) => {
          obj[ele.countryCode] = {
            countryCode: ele.countryCode,
            countryNameEn: ele.countryNameEn,
            countryNameZh: ele.countryNameZh,
            rebateValue: ele.rebateValue,
            rebateMethod: ele.rebateMethod ? ele.rebateMethod.toString() : ''
          };
        })
        this.addChannel = JSON.parse(JSON.stringify(this.chanelDetail))
        delete this.addChannel.listChannelClearing
        this.$set(this.addChannel, 'mapChannelClearing', obj)
      }
    },
    getRoleusers() {
      roleusers({
        roleCode: 'channel_manager'
      }).then(res => {
        if (res.code === 0) {
          this.roleusersList = res.data
        }
      })
    },
    changeManager(val) {
      this.roleusersList.forEach(element => {
        if (element.userId === val) {
          this.addChannel.channelManager = element.nickName
        }
      })
    },
    rebateMethod(index, val) {
      this.$set(this.addChannel.mapChannelClearing[index], 'rebateMethod', val)
    },
    postChannelInfo(info, operateType) {
      let content = ''
      operateType === 'edit' ? content = '是否保存该渠道' : content = '是否添加该渠道'
      this.$Modal.confirm({
        title: '温馨提示',
        content: content,
        onOk: () => {
          addChannel(info).then(res => {
            if (res.code === 0) {
              if (operateType === 'edit') {
                this.$emit('refreshDetail')
              } else {
                this.$emit('channelInfo')
              }
              this.$Message.success('操作成功')
            }
          }).catch(error => {
            console.log(error)
          })
        },
      });
    },
    handleSubmit(name) {
      let isAllempty, isAllnumber, isAllnormal = false
      isAllnormal = Object.values(this.addChannel.mapChannelClearing).some(element => {
        return element.rebateMethod === '1' && Number(element.rebateValue) > 100
      })
      isAllempty = Object.values(this.addChannel.mapChannelClearing).every(function (item, index, array) {
        return item.rebateMethod !== '' && item.rebateValue !== ''
      })
      isAllnumber = Object.values(this.addChannel.mapChannelClearing).every(function (item, index, array) {
        return /^\d+(\.\d+)?$/.test(item.rebateValue)
      })
      if (!isAllempty) {
        this.$Message.error('请正确输入每个国家的结算规则')
        return
      }
      if (isAllnormal) {
        this.$Message.error('返佣比例不能超过100%')
        return
      }
      if (!isAllnumber) {
        this.$Message.error('返佣金额不能为非数字')
        return
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.postChannelInfo(this.addChannel, this.operateType)
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.boxContent {
  max-width: 800px;
  .ruleBox {
    /deep/ .ivu-row {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
    /deep/ .ivu-col {
    }
    .inline {
      display: flex;
      align-items: center;
      .line-width {
        width: 80px;
      }
    }
  }
}
.btnBox {
  &/deep/ .ivu-form-item-content {
    margin-left: 0px !important;
    text-align: center;
    margin-top: 30px;
  }
}
</style>