<template>
  <div>
    <Card>
      <Form ref="searchForm"
            :model="pageInfo"
            inline
            :label-width="80">
        <FormItem label="部门名称"
                  prop="departmentName">
          <Input type="text"
                 v-model="pageInfo.departmentName"
                 placeholder="请输入部门名称" />
        </FormItem>
        <FormItem label="部门编码"
                  prop="departmentCode">
          <Input type="text"
                 v-model="pageInfo.departmentCode"
                 placeholder="请输入部门编码" />
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="handleSearch(1)">查询</Button>&nbsp;
          <Button @click="handleResetForm('searchForm')">重置</Button>
        </FormItem>
      </Form>

      <div class="search-con search-con-top">
        <ButtonGroup>
          <Button :disabled="hasAuthority('systemDepartmentEdit')?false:true"
                  type="primary"
                  @click="handleModal(1,1)">
            <span>添加部门</span>
          </Button>
        </ButtonGroup>
      </div>

      <Table border
             :columns="columns"
             :data="data"
             :loading="loading">
        <template slot="status"
                  slot-scope="{ row }">
          <Badge v-if="row.status===1"
                 status="success"
                 text="正常" />
          <Badge v-else-if="row.status===2"
                 status="warning"
                 text="锁定" />
          <Badge v-else
                 status="error"
                 text="禁用" />
        </template>

        <template slot="checkDepartment"
                  slot-scope="{ row }">
          <span v-if="row.lowerCount>0"
                style="color:#2d8cf0;cursor:pointer;"
                @click="checkSub(row.departmentId)">查看</span>
          <span v-else>/</span>
        </template>
        <template slot="action"
                  slot-scope="{ row }">
          <a @click="handleModal(row,2)">【新增二级部门】</a>&nbsp;
          <a @click="handleModal(row,1,true)">【编辑】</a>&nbsp;
          <a @click="removeDepartmentFun(row)">【删除】</a>&nbsp;
        </template>
      </Table>
      <Page transfer
            :total="pageInfo.total"
            :current="pageInfo.page"
            :page-size="pageInfo.limit"
            show-elevator
            show-sizer
            show-total
            @on-change="handlePage"
            @on-page-size-change='handlePageSize'></Page>
    </Card>
    <Modal v-model="modalVisible"
           :title="modalTitle"
           width="50"
           @on-cancel="handleReset">
      <Form :model="formItem"
            ref="formItem"
            :label-width=120>
        <FormItem label="一级部门"
                  v-if="this.formItem.level==2">
          <span>{{topDepartment}}</span>
        </FormItem>
        <FormItem label="部门名称">
          <Input v-model="formItem.departmentName" />
        </FormItem>
        <FormItem label="部门编码">
          <Input v-model="formItem.departmentCode" />
        </FormItem>
        <FormItem label="状态">
          <i-switch :value="formItem.status"
                    @on-change="switchStatus($event)"
                    size="large">
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default"
                @click="handleReset">取消</Button>&nbsp;
        <Button type="primary"
                @click="handleSubmit"
                :loading="saving">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modalSubLevel"
           title="二级部门">
      <p>一级部门：{{topDepartment}}</p> 
      <Table :data="subData"
             :columns="subColumns"
             :loading="subDataLiading"
             border>
        <template slot="action"
                  slot-scope="{row}">
          <div>
            <a @click="handleModal(row,2,true)">【编辑】</a>
            <a @click="removeDepartmentFun(row)">【删除】</a>
          </div>
        </template>
      </Table>
    </Modal>

  </div>
</template>

<script>
import { addDepartment, getDepartmentList, removeDepartment, updateDepartment } from '@/api/organization'

export default {
  data() {
    return {
      loading: false,
      saving: false,
      modalVisible: false,
      subDataLiading: false,
      modalTitle: '',
      pageInfo: {
        page: 1,
        pageSize: 10,
        departmentName: '',
        departmentCode: '',
        level: 1
      },
      formItem: {
        departmentCode: '',
        departmentName: '',
        level: '',
        status: true,
        parentId: ''
      },
      columns: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 60
        },
        {
          title: '一级部门名称',
          key: 'departmentName',
        },
        {
          title: '部门编码',
          key: 'departmentCode',
        },
        {
          title: '二级部门',
          slot: 'checkDepartment',
          align: 'center'
        },
        {
          title: '创建时间',
          key: 'createTime',
        },
        {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 150
        }
      ],
      data: [],
      topDepartment: '',
      topDepartmentId: '',
      isEditor: false,
      modalSubLevel: false,
      subData: [],
      subColumns: [
        {
          title: '部门名称',
          key: 'departmentName'
        },
        {
          title: '部门编码',
          key: 'departmentCode',
        },
        {
          title: '创建时间',
          key: 'createTime',
        },
        {
          title: '操作',
          slot: 'action',
          width: 150
        }
      ]
    }
  },
  methods: {
    handleModal(row, type, val) {
      this.modalVisible = true
      this.formItem.level = type
      this.isEditor = false
      this.topDepartmentId=''
      if (type == 1 && !val) {
        this.modalTitle = '添加一级部门'
      }
      if (type == 2 && !val) {
        this.modalTitle = '添加二级部门'
        this.topDepartment = row.departmentName
        this.topDepartmentId = row.departmentId
      }
      if (val) {
        this.formItem = row
        this.modalTitle = '编辑部门'
        this.isEditor = true
      }
    },
    handleResetForm(form) {
      this.$refs[form].resetFields()
    },
    handleReset() {
      this.modalVisible=false
      this.formItem = {
        departmentCode: '',
        departmentName: '',
        level: '',
        status: true,
        parentId: ''
      }
    },
    handleSubmit() {
      let data = { ...this.formItem }
      data.status = this.formItem.status ? 1 : 0
      if (this.topDepartmentId != '') {
        data.parentId = this.topDepartmentId
      }
      this.saving = true
      if (this.isEditor) {
        updateDepartment(data).then(res => {
          
          if (res.code == 0) {
            this.modalVisible = false
            if (this.modalSubLevel) {
              this.modalSubLevel = false
            }
            this.handleSearch(1)
            this.handleReset()
          }
        }).finally(()=>{
          this.saving = false
        })
      } else {
        addDepartment(data).then((res) => {
          if (res.code == 0) {
            this.modalVisible = false
            this.handleSearch(1)
          }
        }).finally(()=>{
          this.saving = false
        })
      }
    },
    handleSearch(page) {
      if (page) {
        this.pageInfo.page = page
      }
      this.loading = true
      getDepartmentList(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
        this.loading = false
      })
    },
    handlePage(current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize(size) {
      this.pageInfo.limit = size
      this.handleSearch()
    },
    switchStatus(val) {
      this.formItem.status = val
    },
    removeDepartmentFun(row) {
       this.$Modal.confirm({
        title: '是否确认删除',
        cancelText: '取消',
        okText: '确认',
        onOk: () => {
          setTimeout(() => {
            this.removeDepartmentFunction(row)
          }, 100);
        }
      })
    },
    removeDepartmentFunction(row){
      let data = {
        departmentId: row.departmentId
      }
      removeDepartment(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('删除成功')
          if(row.level==1){
            this.handleSearch()
          }else if(row.level==2){
            this.checkSub(this.topDepartmentId)
          }
        }
      })
    },
    checkSub(row) {
      this.modalSubLevel = true
      this.subDataLiading = true
      this.topDepartmentId=row
      let data = {
        parentId: row,
        level: 2,
        page: 1,
        pageSize: 10
      }
      getDepartmentList(data).then(res => {
        if (res.code === 0) {
          this.subData = res.data.records
        }
      }).finally(() => {
        this.subDataLiading = false
      })
    }
  },
  mounted: function () {
    this.handleSearch()
  }
}
</script>
