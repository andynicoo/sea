<template>
  <div class="container">
    <div class="content">
      <Row>
        <div class="departmentContent">
          <div class="title">
            部门数据统计
          </div>
          <div class="content">
            <DatePicker type="year"
                        :value="currentYear"
                        @on-change="businessYearDateChange"
                        placeholder="选择年月"
                        style="width: 100px;margin-right:10px;"></DatePicker>
            <Button type="primary"
                    @click="getBusinessData"
                    style="margin-left:10px;">查询</Button>
            <div class="tableContent">
              <Table :columns="businessDataColums"
                     style="margin-top:20px;"
                     :data="businessData">
              </Table>
            </div>
            <!-- <Page @on-change="changePageHandler"
                  style="text-align:center;margin-top:30px;"
                  :current="businessDataObj.page"
                  :total="listTotal"
                  :page-size="businessDataObj.limit"
                  show-total
                  show-elevator /> -->
          </div>
        </div>
      </Row>
    </div>
    <Modal v-model="editModal"
           :title="madalTitle">
      <Form v-model="targetForm">
        <Row v-for="(item, index) in formList"
             :key="index">
          <div class="flex madalContent">
            <div class="name">
              {{item.userNickName}}
            </div>
            <div class="content">
              <Input placeholder="请输入税号数"
                     v-model="targetForm[index].targetTaxVatService"
                     style="width: 200px;margin-bottom:10px;" />
              <Input placeholder="请输入销售额"
                     v-model="targetForm[index].targetPayAmount"
                     style="width: 200px;" />
            </div>
          </div>
        </Row>
      </Form>
      <p slot="footer">
        <Button type="primary"
                ghost
                @click="editModal=false">取消</Button>
        <Button type="primary"
                @click="submit">确认</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import {
  targetSummary,
  saveOrUpdate
} from '@/api/taxService/overView'
import echarts from 'echarts'
export default {
  name: '',
  props: {},
  data() {
    return {
      businessDataObj: {
        year: '',
      },
      editModal: false,
      madalTitle: '',
      targetForm: {},
      formList: [],
      businessData: [],
      businessDataColums: [
        {
          title: '人员/月份',
          width: 150,
          key: 'userNickName'
        },
        {
          title: '销售目标总计',
          width: 150,
          render: (h, params) => {
            let data = [h('p', {
              style: {
                'marginBottom': "5px"
              },
            }, [
              h('span', '税号数：'),
              h('span', params.row.targetTaxVatServiceTotal),
            ]),
            h('p', [
              h('span', '销售额：'),
              h('span', params.row.targetPayAmountTotal),
            ])]
            if (params.row.targetPayAmountTotal !== 0 && params.row.targetTaxVatServiceTotal !== 0) {
              return h('div', data)
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '1月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('01')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', data['01'].targetTaxVatService),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['01'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '2月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('02')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', data['02'].targetTaxVatService),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['02'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '3月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('03')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', data['03'].targetTaxVatService),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['03'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '4月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('04')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', data['04'].targetTaxVatService),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['04'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '5月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('05')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', data['05'].targetTaxVatService),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['05'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '6月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('06')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', data['06'].targetTaxVatService),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['06'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '7月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('07')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', data['07'].targetTaxVatService),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['07'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '8月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('08')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', data['08'].targetTaxVatService),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['08'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '9月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('09')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', 111),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['09'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '10月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('10')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', data['10'].targetTaxVatService),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['10'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '11月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('11')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', data['11'].targetTaxVatService),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['11'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        },
        {
          title: '12月',
          width: 150,
          renderHeader: (h, params) => {
            let indexMonth = Number(params.column.title.replace('月', ''))
            let edit = h('span', [
              h('Icon', {
                props: {
                  type: 'ios-create-outline'
                },
                style: {
                  fontSize: '12px',
                  marginLeft: '3px',
                  float: 'right',
                  marginTop: '1px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                },
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }),
            ])
            if (indexMonth >= this.currentMonth) {
              return h('div', [
                h('span', params.column.title),
                edit])
            } else {
              return h('div', [
                h('span', params.column.title)
              ])
            }
          },
          render: (h, params) => {
            let data = JSON.parse(JSON.stringify(params.row.monthData))
            if (data.hasOwnProperty('12')) {
              return h('div', [h('p', {
                style: {
                  'marginBottom': "5px"
                },
              }, [
                h('span', '税号数：'),
                h('span', data['12'].targetTaxVatService),
              ]),
              h('p', [
                h('span', '销售额：'),
                h('span', data['12'].targetPayAmount),
              ])])
            } else {
              return h('div', '-')
            }
          }
        }
      ],
      monthList: function () {
        let list = []
        for (let index = 1; index < 13; index++) {
          let obj = {
            month: index.toString(),
            monthLabel: index + '月'
          }
          list.push(obj)
        }
        return list
      }(),
      currentYear: function (params) {
        let oDay = new Date();
        let year = oDay.getFullYear(); //当前年份
        return year.toString()
      }(),
      currentMonth: function (params) {
        let oDay = new Date();
        let month = oDay.getMonth() + 1; //当前月份
        return month.toString()
      }(),
    }
  },
  methods: {
    getBusinessData() {
      targetSummary(this.businessDataObj).then(res => {
        if (res.code === 0) {
          this.businessData = res.data
        }
      })
    },
    businessYearDateChange(val) {
      this.businessDataObj.year = val
    },
    edit(row) {
      this.editModal = true
      this.madalTitle = `设定${row.column.title}销售目标`
      let num = Number(row.column.title.replace('月', ''))
      if (num < 10) {
        num = '0' + num
      }
      let list = []
      list = this.businessData.filter((ele) => {
        return ele.userNickName !== '总计'
      })
      let arr = []
      arr = list.map((ele) => {
        let id = ''
        let targetTaxVatService = ''
        let targetPayAmount = ''
        if (ele.monthData.hasOwnProperty(num)) {
          id = ele.monthData[num].id
          targetTaxVatService = ele.monthData[num].targetTaxVatService
          targetPayAmount = ele.monthData[num].targetPayAmount
        }
        return {
          userNickName: ele.userNickName,
          userId: ele.userId,
          targetTaxVatService: targetTaxVatService || 0,
          targetPayAmount: targetPayAmount || 0,
          id: id,
          year: this.currentYear,
          month: num.toString(),
        }
      })
      this.formList = this.targetForm = arr
    },
    submit() {
      let data = JSON.stringify(this.targetForm)
      let targetFormData = {
        saleTargetDtoList: this.targetForm
      }
      this.$Modal.confirm({
        title: '提示',
        content: '是否保存该数据',
        onOk: () => {
          saveOrUpdate(targetFormData).then(res => {
            if (res.code === 0) {
              this.editModal = false
              this.$Message.success('保存成功')
              this.getBusinessData()
            }
          })
        },
      });
    }
  },
  mounted() {

  },
  created() {
    this.businessDataObj.year = this.currentYear
    this.getBusinessData()
  },
}
</script>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  padding: 10px;
}
/deep/ .ivu-table td {
  font-size: 14px;
  font-family: PingFangSC;
  color: #333333;
  line-height: 14px;
}
/deep/ .ivu-table th {
  font-weight: bold;
}
.content {
  text-align: left;
  .content-title {
    padding: 14px;
    background: #ffffff;
    border-bottom: 1px solid #e8eaec;
    margin-bottom: 14px;
    .timepicker {
      float: right;
    }
  }
  .tableContent {
    /deep/ .ivu-input {
      padding: 2px 7px;
      height: 20px;
      margin-top: 3px;
    }
  }
  .departmentContent {
    background: #ffffff;
    /deep/ .ivu-table th {
      background-color: #16ade933;
      text-align: center;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: #333333;
      line-height: 14px;
    }
    /deep/ .ivu-table td {
      text-align: center;
      font-family: PingFangSC;
      color: #333333;
      line-height: 14px;
      border: 1px solid #dddddd;
      border-right: none;
      border-bottom: none;
    }
    .title {
      border-bottom: 1px solid #dddddd;
      padding: 20px 24px;
      font-size: 18px;
      font-family: SourceHanSansSC-Medium, SourceHanSansSC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
    .content {
      padding: 20px 24px;
    }
  }
}
.flex {
  display: flex;
  align-items: center;
}
.madalContent {
  margin-bottom: 20px;
  .name {
    margin-right: 20px;
    font-size: 16px;
    text-align: right;
    width: 100px;
  }
  .content {
    display: flex;
    flex-direction: column;
  }
}
#chart,
#myChart {
  width: 100%;
  height: 100px;
  margin: auto;
  top: -10px;
}

#search,
#search1 {
  height: 100px;
}

#pie {
  height: 300px;
}

#sale,
#scan {
  height: 300px;
}
</style>
