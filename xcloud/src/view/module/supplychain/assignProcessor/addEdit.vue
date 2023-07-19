<template>
  <div class="app-container">
    <div class="header-container" style="padding-left: 24px">
      <div class="back" @click="goBack()">
        <Icon type="ios-arrow-back" />
        返回列表
      </div>
      <el-form ref="refsaddHandler" :rules="ruleHandlerFrom" :model="addHandler" label-width="110px">
        <el-form-item label="工单类型" prop="serviceType">
          <el-cascader
            style="width: 300px"
            clearable
            filterable
            placeholder="请选择"
            v-model="addHandler.serviceType"
            :options="workCategoryCascader"
            @change="changeServiceType"
            :props="{
              expandTrigger: 'hover',
              children: 'workFunctionList',
              value: 'code',
              label: 'name',
              emitPath: false,
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品分类" prop="productCategoryId">
          <el-select v-model="addHandler.productCategoryId" placeholder="请选择" size="small" style="width: 300px" clearable filterable multiple>
            <el-option v-for="item in productCategoryArry" :key="item.productCategoryId" :value="item.productCategoryId" :label="item.productCategoryName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务国家" prop="countryCode">
          <el-select style="width: 300px" size="small" v-model="addHandler.countryCode" filterable>
            <el-option v-for="item in countrySelectList" :key="item.id" :value="item.countryCode" :label="item.countryNameZh"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="总基数" prop="baseNum">
          <el-input-number v-model="addHandler.baseNum" :min="0" :max="100" :precision="0" style="width: 300px" size="small" />
        </el-form-item>
        <el-form-item label="执行时间范围" prop="time">
          <el-date-picker v-model="addHandler.time" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 450px" align="right" size="small" unlink-panels @change="getTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <!-- <el-radio v-model="addHandler.status" :label="1">启用</el-radio>
          <el-radio v-model="addHandler.status" :label="2">禁用</el-radio> -->
          <el-select size="small" style="width: 300px" clearable v-model="addHandler.status">
            <el-option label="启用" :value="1">启用</el-option>
            <el-option label="禁用" :value="2">禁用</el-option>
          </el-select>
        </el-form-item>
        <el-tabs v-model="activeName" style="margin-bottom: 20px; width: 850px">
          <!-- 分配处理人部分 -->
          <el-tab-pane label="分配处理人" name="first">
            <div class="hander">
              <el-form-item class="btn">
                <!--  v-if="addHandler.serviceType == 61" -->
                <el-button size="small" type="success" icon="el-icon-document-add" @click="addHandlerType"> 新增处理人类型 </el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="deletHandler" v-if="Handlerlist.length > 1"> 删除处理人 </el-button>
              </el-form-item>
              <div class="table-container" v-for="(item, index) in Handlerlist" :key="index">
                <template>
                  <el-form-item label="处理人类型">
                    <!-- v-if="addHandler.serviceType == 61" -->
                    <el-select size="small" style="width: 300px" clearable filterable v-model="item.handleType" @change="filterHandlerType(item.handleType)">
                      <el-option v-for="item in HandlerTypeList" :key="item.productFunctionCode" :label="item.typeName" :value="item.type"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-table :data="item.handlerUserAddDTOList" border highlight-current-row stripe ref="table">
                    <el-table-column align="center" label="处理人">
                      <template slot-scope="scope">
                        <span v-if="scope.row.handlerUserName" @click="assignHandler(index, scope.$index)">
                          {{ scope.row.handlerUserName }}
                          <i class="el-icon-edit-outline text-blue"></i>
                        </span>
                        <el-link v-else type="primary" :underline="false" @click="assignHandler(index, scope.$index)"> 指派处理人 </el-link>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="所属部门">
                      <template slot-scope="scope">
                        <span>{{ scope.row.handlerUserDepartmentName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="分配百分比">
                      <template slot-scope="scope">
                        <el-input type="number" style="width: 150px" size="small" v-model="scope.row.percentage">
                          <span slot="append">%</span>
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                      <template slot-scope="scope">
                        <span class="el-icon-circle-plus" @click="addtabelHandler(index, scope.$index)"></span>
                        <span class="el-icon-remove" v-if="item.handlerUserAddDTOList.length > 1" @click="removeHandler(index, scope.$index)"></span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="tips">
                    <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i>
                    <span class="text-tips item-tip" style="padding: 10px 0"> 注意：分配比例只能填写大于0且小于等于100的正整数 </span>
                  </div>
                </template>
              </div>
            </div>
          </el-tab-pane>
          <!-- 指定客户部分 -->
          <el-tab-pane label="指定客户" name="second">
            <el-form inline ref="searchForm">
              <el-form-item label="">
                <el-input placeholder="请输入手机号/客户名称" clearable style="width: 220px" size="small" v-model="searchName" @clear="getOrigin" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
              </el-form-item>
              <el-button type="success" size="small" @click="bathModal = true">批量导入</el-button>
              <el-button type="success" size="small" @click="bathMove">批量移除</el-button>
            </el-form>
            <div style="line-height: 26px">可添加指定的客户进行自动分配工单</div>
            <el-table :data="customersSureData" border highlight-current-row stripe ref="table" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column align="center" label="序号" width="55">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="客户手机号" prop="userMobile"></el-table-column>
              <el-table-column align="center" label="公司中文名称" prop="companyNameZh"></el-table-column>
              <el-table-column align="center" label="公司英文名称" prop="companyNameEn"></el-table-column>
              <el-table-column align="center" label="客户创建时间" prop="customerCreateTime"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button @click="removeData(scope.$index)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-button type="primary" size="small" @click="submitBtn">确 定</el-button>
        <el-button size="small" @click="goBack()">取 消</el-button>
      </el-form>
    </div>
    <!-- 指派人弹窗 -->
    <el-dialog :visible.sync="handlerModal" class-name="distribution" title="指派处理人" width="400px">
      <el-form inline>
        <el-form-item label="归属人：" label-width="80px">
          <el-select style="width: 270px" clearable placeholder="跟进人" size="small" filterable @change="selectName" v-model="handlerUserId">
            <el-option-group>
              <li class="option_title" style="background: #f6f8fa">
                <span>姓名</span>
                <span>手机号</span>
                <span>部门</span>
              </li>

              <el-option v-for="item in followList" :key="item.userId" :label="item.nickName" :value="item.userId" class="option_title">
                <span>{{ item.nickName }}</span>
                &nbsp;
                <span>{{ item.mobile }}</span>
                &nbsp;
                <span>{{ item.departmentName }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="updateHandler" v-if="hasAuthority('E1_34')">确 定</el-button>
        <el-button @click="handlerModal = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 批量导入弹窗 -->
    <el-dialog :visible.sync="bathModal" title="批量导入" width="800px">
      <div class="temp">
        <p class="text">请按照数据模板的格式准备要导入的数据</p>
        <el-button type="primary" class="btn" @click="downLoadTemplate()">下载数据模板</el-button>
        <p class="temp-tips">注意事项：</p>
        <p class="temp-tips">1、模板中的表头名称不可更改，表头行不可删除</p>
        <p class="temp-tips">2、必填项不能为空</p>
      </div>
      <div class="upload-wrap">
        <p class="text">上传文件</p>
        <div class="upload-content">
          <el-upload
            drag
            class="upload-demo"
            :format="['xls', 'xlsx']"
            :file-list="helpFileList"
            :action="uploadUrl"
            :default-file-list="helpFileList"
            :before-upload="beforeUploadAccept"
            :on-format-error="formatErrorHandler"
            :headers="{ enterpriseId: enterpriseId }"
            :max-size="2048"
            ref="upload"
            :on-success="successHandlerAccept"
            :on-remove="
              (file, fileList) => {
                removeHandlerAccept(file, fileList);
              }
            "
            style="accept-upload"
          >
            <div class="text-tips">支持扩展名：xls或xlsx</div>
          </el-upload>
        </div>
        <div class="file-name">
          <div>{{ helpFileList.length == 0 ? '请上传文件...' : '' }}</div>
          <el-button v-if="helpFileList.length" size="small" @click="deleteFIle()">删除</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="sureBath" v-if="hasAuthority('E1_34')">确 定</el-button>
        <el-button @click="bathModal = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 匹配结果弹窗 -->
    <el-dialog :visible.sync="sureBathModal" title="匹配结果" width="800px" class-name="customer-distribution">
      <p class="text" style="margin-bottom: 10px">{{ '导入' + bathTotal + '条数据，共匹配' + bathResult + '条数据' }}</p>
      <div class="table-box" style="max-height: 400px; overflow-y: auto">
        <el-table :data="customersData" border highlight-current-row stripe ref="table" @selection-change="handleSelectionSureChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column align="center" label="序号" width="55">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="客户手机号" prop="userMobile"></el-table-column>
          <el-table-column align="center" label="公司中文名称" prop="companyNameZh"></el-table-column>
          <el-table-column align="center" label="公司英文名称" prop="companyNameEn"></el-table-column>
          <el-table-column align="center" label="客户创建时间" prop="customerCreateTime"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="sureBathCustomer" v-if="hasAuthority('E1_34')">确 定</el-button>
        <el-button @click="sureBathModal = false" size="small">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getCountrySelectList, userList } from '@/api/newApi/common.js';
import { mapMutations } from 'vuex';
import { addHandler, getHandlerUserType, getInfo, updateHandlerAllot, goodsCategory } from '@/api/newApi/supplyChain/assignProcessor.js';
import { workCategoryList } from '@/api/newApi/workOrder/typeConfig.js';
export default {
  data() {
    return {
      Handlerlist: [
        {
          handleType: '',
          handlerUserAddDTOList: [
            {
              handlerUserName: '',
              percentage: '',
              handlerUserDepartmentName: '',
            },
          ],
        },
      ],
      addHandler: {
        status: 1,
      },
      countrySelectList: [],
      followList: [],
      handerObj: {},
      HandlerTypeList: [],
      handlerUserId: '',
      workCategoryCascader: [],
      index: 0, //处理类型index
      indexflag: 0, //table index
      handlerModal: false,
      newlist: [],
      //校验
      ruleHandlerFrom: {
        serviceType: [{ required: true, message: '请选择对象类型', trigger: 'change' }],
        countryCode: [{ required: true, message: '请选择国家', trigger: 'blur' }],
        time: [
          {
            type: 'array',
            required: true,
            message: '请选择执行时间单范围',
            trigger: 'blur',
          },
        ],
        baseNum: [{ required: true, message: '请输入总基数', trigger: 'blur' }],
      },
      searchName: '',
      activeName: 'first',
      customersData: [],
      customersSureData: [],
      multipleSelection: [],
      bathModal: false,
      helpFileList: [],
      sureBathModal: false,
      sureMultipleSelection: [],
      uploadUrl: this.baseUrl + '/workorder/management/xcloudHandlerAllot/import_customer',
      enterpriseId: localStorage.getItem('enterpriseId'),
      bathTotal: 0,
      bathResult: 0,
      multipleSelectionIds: [],
      productCategoryArry: [],
      originCustomersSureData: [],
    };
  },
  created() {
    this.getUserList(); //处理人列表
    this.getCountryList(); //国家列表
    this.getWorkCategoryList();

    if (this.$route.query.id) {
      this.getDeail(); //数据回显
    }
  },
  methods: {
    getDeail() {
      getInfo({ xcloudHaxndlerAllotId: this.$route.query.id })
        .then((res) => {
          if (res.code == 0) {
            this.addHandler = {
              serviceType: res.data.serviceType + '',
              countryCode: res.data.countryCode,
              productCategoryId: res.data.productCategoryId ? res.data.productCategoryId.split(',') : [],
              baseNum: res.data.baseNum,
              status: res.data.status,
              time: [res.data.startDate, res.data.endDate],
              startDate: res.data.startDate,
              endDate: res.data.endDate,
            };
            this.getGoodsCategory(res.data.serviceType);
            this.newlist = res.data.xcloudHandlerAllotDetailsVOList;
            this.customersSureData = res.data.refUserList;
            this.originCustomersSureData = res.data.refUserList;
            this.Handlerlist = JSON.parse(JSON.stringify(this.newlist).replace(/handlerUserVOList/g, 'handlerUserAddDTOList'));
            this.getHandlerType(); //处理人类型
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    getWorkCategoryList() {
      workCategoryList().then((res) => {
        res.data.forEach((item, index) => {
          item.code = 'i' + index;
        });
        this.workCategoryCascader = res.data;
      });
    },
    /** 新增/编辑 提交保存 */
    submitBtn() {
      this.$refs.refsaddHandler.validate((valid) => {
        if (valid) {
          delete this.addHandler.time;
          this.tableData();
          if (this.$route.query.flag == 'update') {
            this.addHandler.id = this.$route.query.id;
            this.update(); //编辑
          } else {
            this.addfn(); //添加/复制
          }
        }
      });
    },
    //添加/复制功能  接口
    addfn() {
      let data = JSON.parse(JSON.stringify(this.addHandler));
      data.productCategoryId = data.productCategoryId.toString();
      addHandler(data)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('添加成功');
            setTimeout(() => {
              this.$router.push({
                path: '/supplychain/assignProcessor/index',
              });
            }, 300);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    //编辑接口
    update() {
      let data = JSON.parse(JSON.stringify(this.addHandler));
      data.productCategoryId = data.productCategoryId.toString();
      updateHandlerAllot(data)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('修改成功');
            setTimeout(() => {
              this.$router.push({
                path: '/supplychain/assignProcessor/index',
              });
            }, 300);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    tableData() {
      this.addHandler.xcloudHandlerAllotDetailsAddDTOList = this.Handlerlist;
      this.addHandler.refUserList = this.customersSureData;
    },
    getTime() {
      let time = this.$util.getEndTime(this.addHandler.time);
      this.addHandler.startDate = time[0];
      this.addHandler.endDate = time[1];
    },
    /**
     * 指派处理人弹窗
     */
    assignHandler(index, childIndex) {
      this.handlerModal = true;
      this.index = index;
      this.indexflag = childIndex;
    },
    /** 添加指派处理人 */
    addtabelHandler(index) {
      this.Handlerlist[index].handlerUserAddDTOList.push({
        handlerUserName: '',
        percentage: '',
        handlerUserDepartmentName: '',
      });
    },
    /** 删除指派处理人 */
    removeHandler(index, childIndex) {
      this.Handlerlist[index].handlerUserAddDTOList.splice(childIndex, 1);
    },
    /** 过滤掉已选择的处理类型 */
    filterHandlerType(handleType) {
      // this.HandlerTypeList = this.HandlerTypeList.filter(
      //   (item) => item.id !== handleType
      // );
    },
    selectName() {
      let category = this.followList.find((item) => item.userId === this.handlerUserId);
      console.log(category);
      this.handerObj = {
        handlerUserName: category.nickName,
        handlerUserId: category.userId,
        handlerUserDepartmentName: category.departmentName,
      };
    },
    // 服务类型改变时，下面的table也会变
    changeServiceType(val) {
      if (val) {
        this.getGoodsCategory(val);
        this.addHandler.productCategoryId = [];
      }
      this.getHandlerType();
      this.Handlerlist = [
        {
          handleType: '',
          handlerUserAddDTOList: [
            {
              handlerUserName: '',
              percentage: '',
              handlerUserDepartmentName: '',
            },
          ],
        },
      ];

      if (this.$route.query.id && this.addHandler.serviceType == 61) {
        this.Handlerlist = JSON.parse(JSON.stringify(this.newlist).replace(/handlerUserVOList/g, 'handlerUserAddDTOList'));
      }
    },
    getGoodsCategory(val) {
      goodsCategory({ type: val }).then((res) => {
        if (res.code == 0) {
          this.productCategoryArry = res.data;
        }
      });
    },
    updateHandler() {
      if (this.handlerUserId == '') {
        return this.$message.warning('请选择指派处理人');
      } else {
        this.$message.success('保存成功');
        this.handlerModal = false;
        this.handlerUserId = '';
        this.$set(this.Handlerlist[this.index].handlerUserAddDTOList, this.indexflag, this.handerObj);
      }
    },
    /**
     * 新增处理人类型
     */
    addHandlerType() {
      this.Handlerlist.push({
        handleType: '',
        handlerUserAddDTOList: [
          {
            handlerUserName: '',
            percentage: '',
            handlerUserDepartmentName: '',
          },
        ],
      });
    },
    /**
     * 删除处理类型
     */
    deletHandler() {
      this.Handlerlist.pop();
    },
    // 获取国家列表
    getCountryList() {
      return new Promise((resolve) => {
        getCountrySelectList().then((res) => {
          this.countrySelectList = res.data;
          resolve();
        });
      });
    },
    // 获取处理人列表
    getUserList() {
      userList().then((res) => {
        this.followList = res.data;
      });
    },
    // 获取处理人类型
    getHandlerType() {
      this.HandlerTypeList = [];
      getHandlerUserType({
        productFunctionCode: this.addHandler.serviceType,
      }).then((res) => {
        this.HandlerTypeList = res.data;
      });
    },
    ...mapMutations(['closeTag']),
    goBack() {
      this.closeTag(this.$route);
      this.$router.push({ path: '/supplychain/assignProcessor/index' });
    },
    search() {
      var preg = /^1[3456789][0-9]{9}$/;
      if (preg.test(this.searchName)) {
        let arry = this.customersSureData.filter((item) => {
          if (this.searchName == item.userMobile) return item;
        });
        if (arry.length > 0) {
          this.customersSureData = arry;
        } else {
          this.customersSureData = [];
        }
      } else {
        let arry = this.customersSureData.filter((item) => {
          if (this.searchName == item.companyNameZh) return item;
        });
        if (arry.length > 0) {
          this.customersSureData = arry;
        } else if (this.searchName == '') {
          this.customersSureData = this.originCustomersSureData;
        } else {
          this.customersSureData = [];
        }
      }
    },
    getOrigin() {
      this.customersSureData = this.originCustomersSureData;
    },
    bathMove() {
      if (this.multipleSelectionIds.length == 0) {
        this.$message.warning('请选择批量移除的指定客户');
      }
      this.customersSureData = this.customersSureData.filter((item) => {
        if (this.multipleSelectionIds.indexOf(item.id) < 0) return item;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelectionIds = val.map((item) => {
        return item.id;
      });
    },
    handleSelectionSureChange(val) {
      this.sureMultipleSelection = val;
      this.bathResult = val.length;
    },
    // 下载模板
    downLoadTemplate() {
      window.location.href = 'https://file.itaxs.com/dev/productcenter/20230217/40af56703ddf4e659303d38406e4a3e0.xls';
    },
    formatErrorHandler() {
      this.$message.warning('文件格式错误');
    },

    successHandlerAccept(res, file, fileList) {
      if (res.code !== 0) {
        this.$message.warning('请尝试再次上传');
        return false;
      }
      let obj = {
        name: file.name,
        url: file.response.data.fileUrl,
      };

      this.helpFileList.push(obj);
      this.customersData = res.data;
      this.bathTotal = res.data.length;
      // console.log('图片',this.helpFileList);
    },

    beforeUploadAccept(file) {
      if (file.name.indexOf('xls') > -1) {
        const check = this.helpFileList.length < 1;
        if (!check) {
          this.$message.warning('最多只可上传1个文件');
          return check;
        } else if (file.size > 2097152) {
          this.$message.warning('文件大小超过2M');
          return false;
        }
      } else {
        this.$message.warning('上传的文件格式不正确');
        return false;
      }
    },
    removeHandlerAccept(file, fileList) {
      this.helpFileList = [...fileList];
    },
    deleteFIle() {
      this.helpFileList = [];
    },
    sureBath() {
      this.sureBathModal = true;
    },
    sureBathCustomer() {
      if (this.sureMultipleSelection.length == 0) {
        this.$message.warning('请选择匹配的结果');
        return false;
      }
      let arry = [...this.customersSureData, ...this.sureMultipleSelection];
      this.customersSureData = this.getNewData(arry);
      let arryOrigin = [...this.originCustomersSureData, ...this.sureMultipleSelection];
      this.originCustomersSureData = this.getNewData(arryOrigin);
      this.sureBathModal = false;
      this.bathModal = false;
    },
    getNewData(oldArr) {
      let newIds = [];
      let newArry = [];
      for (let i = 0; i < oldArr.length; i++) {
        if (newIds.indexOf(oldArr[i].id) == -1) {
          newIds.push(oldArr[i].id);
          newArry.push(oldArr[i]);
        }
      }
      return newArry;
    },
    removeData(index) {
      this.customersSureData.splice(index, 1);
    },
  },
};
</script>
<style scoped lang="scss">
.back {
  margin: 15px;
  cursor: pointer;
}
.hander {
  position: relative;
  width: 900px;
  .btn {
    position: absolute;
    right: 40px;
    top: 8px;
    z-index: 99;
  }
}
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 3;
  }
}

.el-icon-circle-plus,
.el-icon-remove {
  vertical-align: middle;
  font-size: 26px;
  cursor: pointer;
}
.el-icon-circle-plus {
  color: #52c41a;
}
.el-icon-remove {
  color: #e72f23;
}
.el-icon-edit-outline {
  font-size: 20px;
}
.tips {
  margin: 20px 0;
}
.header-container {
  min-height: calc(100vh - 130px);
}
.temp {
  .text {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .btn {
    margin-bottom: 10px;
  }
  .temp-tips {
    font-size: 14px;
    color: #666;
    margin: 0;
    line-height: 22px;
  }
}
.upload-wrap {
  margin-top: 20px;
  .text {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .upload-content {
    .text-tips {
      line-height: 80px;
    }
  }
  .file-name {
    font-size: 16px;
  }
}
::v-deep .el-upload {
  .el-upload-dragger {
    height: 80px;
  }
}
</style>
