<template>
  <div class="app-container">
    <div class="el-page-header page-header" v-if="from != 'field-template'">
      <div class="el-page-header__left" @click="goback">
        <i class="el-icon-arrow-left"></i>
        <div class="el-page-header__title">返回列表</div>
      </div>
    </div>
    <!-- 表单 -->
    <div class="form-container">
      <!-- 应用属性 -->
      <!-- <h3>应用属性</h3> -->

      <Title class="t-class" titieName="应用属性"></Title>
      <el-form label-width="130px" ref="fieldFormRef" :model="fieldForm" :rules="fieldFormRules">
        <el-form-item label="所属模块" prop="moduleId">
          <el-select v-model="fieldForm.moduleId" :disabled="fieldForm.id != '' && fieldForm.id != undefined" placeholder="选择模块" clearable filterable style="width: 360px">
            <el-option :value="item.id" :label="item.moduleName" v-for="(item, index) in moduleList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!-- 只有从流程里点击进来配置专属的字段时候才显示 -->
        <el-form-item label="所属字段" prop="groupId" v-if="from == 'field-template' && selectedField">
          <el-select v-model="fieldForm.groupId" placeholder="选择所属字段" @change="changeGroup" clearable filterable style="width: 180px">
            <el-option :value="item.id" :label="item.keyLabel" v-for="(item, index) in groupList" :key="index"></el-option>
          </el-select>
          <el-select v-model="fieldForm.groupValue" multiple placeholder="选择所属字段值" clearable filterable style="width: 180px">
            <el-option :value="item.value" :label="item.label" v-for="(item, index) in groupValueList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段标题" prop="fieldLabel">
          <el-input v-model="fieldForm.fieldLabel" placeholder="例如：用户姓名" clearable style="width: 360px" />
        </el-form-item>
        <el-form-item label="系统key值" prop="fieldName" v-if="fieldForm.isSystem">
          <el-input v-model.trim="fieldForm.fieldName" :disabled="fieldForm.id != '' && fieldForm.id != undefined" placeholder="例如：userName" clearable style="width: 360px" />
          <span style="padding-left: 10px;display: block;">
            <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i>
            <span class="text-tips item-tip" style="padding: 10px 0"> 仅限录入字母或数字，首字母小写，且无空格或其他符号 </span>
          </span>
        </el-form-item>
        <el-form-item label="是否必填" prop="isRequired">
          <el-radio-group v-model="fieldForm.isRequired">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 控件属性 -->
        <!-- <h3></h3> -->
        <Title class="t-class" titieName="控件属性"></Title>
        <el-form-item label="控件类型" prop="fieldType">
          <el-select v-model="fieldForm.fieldType" placeholder="选择字段类型" clearable style="width: 360px">
            <el-option value="1" label="文本框"></el-option>
            <el-option value="6" label="文本域"></el-option>
            <el-option value="5" label="下拉框"></el-option>
            <el-option value="2" label="单选框"></el-option>
            <el-option value="3" label="复选框"></el-option>
            <el-option value="4" label="上传框"></el-option>
            <el-option value="8" label="日期选择"></el-option>
            <el-option value="9" label="日期范围选择"></el-option>
            <el-option value="10" label="无类型"></el-option>
          </el-select>
        </el-form-item>
        <!-- 组件属性 -->
        <div class="type-options">
          <!-- 文本框 -->
          <div v-if="fieldForm.fieldType == '1'">
            <el-form-item label="最大字符数">
              <el-input v-model="fieldForm.fieldOptions.maxlength" type="number" min="0" placeholder="输入内容最大字符数，默认：50个" oninput="value=value.replace(/[^\d]/g,'')" clearable style="width: 300px" />
            </el-form-item>
            <el-form-item label="输入限制">
              <el-select v-model="fieldForm.fieldOptions.regxtype" placeholder="选择限制，不选则控件可输入任意字符" clearable style="width: 300px">
                <el-option value="1" label="仅输入数字" />
                <el-option value="2" label="数字和两位小数" />
                <el-option value="3" label="仅输入邮箱" />
                <el-option value="4" label="仅输入手机号码" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否自动大写" prop="fieldOptions.uppercase" v-if="!fieldForm.fieldOptions.regxtype">
              <el-radio-group v-model="fieldForm.fieldOptions.uppercase">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
              <span style="padding-left: 10px;display: block;">
                <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i>
                <span class="text-tips item-tip" style="padding: 10px 0; background-color: #fff"> 自动大写仅规定录入的字符中字母在下载文件中填充为大写字母，不影响录入值在系统中的显示 </span>
              </span>
            </el-form-item>
            <el-form-item label="数字格式" v-if="fieldForm.fieldOptions.regxtype == 1 || fieldForm.fieldOptions.regxtype == 2">
              <el-select v-model="fieldForm.fieldOptions.digitalFormat" placeholder="选择限制，不选则控件则为无格式" clearable style="width: 300px">
                <el-option value disabled class="supplier-table-head">
                  <el-row>
                    <el-col :span="12">示例格式</el-col>
                    <el-col :span="12">格式名称</el-col>
                  </el-row>
                </el-option>
                <el-option class="supplier-table-td" :value="item.type" :label="item.name" v-for="item in digitalFormatList" :key="item.type">
                  <el-row>
                    <el-col :span="12">{{ item.format }}</el-col>
                    <el-col :span="12">{{ item.name }}</el-col>
                  </el-row>
                </el-option>
              </el-select>
              <span style="padding-left: 10px;display: block;">
                <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i>
                <span class="text-tips item-tip" style="padding: 10px 0; background-color: #fff"> 数字格式仅规定数字在下载文件中填充的格式，不影响其在系统中的显示 </span>
              </span>
            </el-form-item>
          </div>
          <!-- 文本域 -->
          <div v-if="fieldForm.fieldType == '6'">
            <el-form-item label="最大字符数">
              <el-input v-model.number="fieldForm.fieldOptions.maxlength" type="number" placeholder="输入内容最大字符数，默认：50个" clearable oninput="value=value.replace(/[^\d]/g,'')" style="width: 300px" />
            </el-form-item>
            <el-form-item label="文本域行数">
              <el-input v-model.number="fieldForm.fieldOptions.rows" type="number" placeholder="输入文本域行数，默认：4行" :min="0" :max="99" oninput="value=value.replace(/[^\d]/g,'')" clearable style="width: 300px" />
            </el-form-item>
          </div>
          <!-- 下拉框 -->
          <div v-if="fieldForm.fieldType == '5'">
            <el-form-item label="是否开启多选">
              <el-radio-group v-model="fieldForm.fieldOptions.multiple">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否可搜索">
              <el-radio-group v-model="fieldForm.fieldOptions.filterable">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="下拉类型">
              <el-radio-group v-model="fieldForm.fieldOptions.selecttype" @change="changeSelectType">
                <el-radio label="1">自定义选项</el-radio>
                <el-radio label="2">固有选项</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="自定义选项组" v-if="fieldForm.fieldOptions.selecttype == 1">
              <div v-for="(item, index) in fieldForm.fieldOptions.groups" :key="index" style="margin-bottom: 6px">
                <el-input v-model="item.label" placeholder="选项名称" style="width: 100px; margin-right: 10px" />
                <el-input v-model="item.value" placeholder="选项存储值（可以为数字，英文）" style="width: 200px; margin-right: 10px" />
                <el-button v-if="index == fieldForm.fieldOptions.groups.length - 1" type="success" @click="handleAddGroup" class="btn-custom">
                  <CustomBtn :image="addImage" words="新增" />
                </el-button>
                <el-button v-if="fieldForm.fieldOptions.groups.length > 1" type="danger" @click="handleRemoveGroup(index)" class="btn-custom">
                  <CustomBtn :image="delelctImage" words="删除" />
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="固有选项" v-if="fieldForm.fieldOptions.selecttype == 2">
              <el-select v-model="fieldForm.fieldOptions.selectfixed" value-key="selectKey" placeholder="选择固有选项" clearable filterable style="width: 300px">
                <el-option :value="item" :label="item.description" v-for="(item, index) in selectFixedList" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- 单选框组 -->
          <div v-if="fieldForm.fieldType == '2'">
            <el-form-item label="单选框组">
              <div v-for="(item, index) in fieldForm.fieldOptions.groups" :key="index" style="margin-bottom: 6px">
                <el-input v-model="item.label" placeholder="选项名称" style="width: 100px; margin-right: 10px" />
                <el-input v-model="item.value" placeholder="选项存储值（可以为数字，英文）" style="width: 200px; margin-right: 10px" />
                <el-button v-if="index == fieldForm.fieldOptions.groups.length - 1" type="success" @click="handleAddGroup" class="btn-custom">
                  <CustomBtn :image="addImage" words="新增" />
                </el-button>
                <el-button v-if="fieldForm.fieldOptions.groups.length > 1" type="danger" @click="handleRemoveGroup(index)" class="btn-custom">
                  <CustomBtn :image="delelctImage" words="删除" />
                </el-button>
              </div>
            </el-form-item>
          </div>
          <!-- 复选框组 -->
          <div v-if="fieldForm.fieldType == '3'">
            <el-form-item label="复选框组">
              <div v-for="(item, index) in fieldForm.fieldOptions.groups" :key="index" style="margin-bottom: 6px">
                <el-input v-model="item.label" placeholder="选项名称" style="width: 100px; margin-right: 10px" />
                <el-input v-model="item.value" placeholder="选项存储值（可以为数字，英文）" style="width: 200px; margin-right: 10px" />
                <el-button v-if="index == fieldForm.fieldOptions.groups.length - 1" type="success" @click="handleAddGroup" class="btn-custom">
                  <CustomBtn :image="addImage" words="新增" />
                </el-button>
                <el-button v-if="fieldForm.fieldOptions.groups.length > 1" type="danger" @click="handleRemoveGroup(index)" class="btn-custom">
                  <CustomBtn :image="delelctImage" words="删除" />
                </el-button>
              </div>
            </el-form-item>
          </div>
          <!-- 上传框 -->
          <div v-if="fieldForm.fieldType == '4'">
            <el-form-item label="上传文件格式">
              <el-checkbox-group v-model="fieldForm.fieldOptions.accepts">
                <el-checkbox label="jpg">jpg</el-checkbox>
                <el-checkbox label="jpeg">jpeg</el-checkbox>
                <el-checkbox label="png">png</el-checkbox>
                <el-checkbox label="pdf">pdf</el-checkbox>
                <el-checkbox label="doc">doc</el-checkbox>
                <el-checkbox label="docx">docx</el-checkbox>
                <el-checkbox label="xls">xls</el-checkbox>
                <el-checkbox label="xlsx">xlsx</el-checkbox>
                <el-checkbox label="ppt">ppt</el-checkbox>
                <el-checkbox label="pptx">pptx</el-checkbox>
                <el-checkbox label="cvs">cvs</el-checkbox>
                <el-checkbox label="txt">txt</el-checkbox>
                <el-checkbox label="zip">zip</el-checkbox>
                <el-checkbox label="rar">rar</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="上传最大个数">
              <el-input type="number" v-model="fieldForm.fieldOptions.limit" placeholder="输入上传文件最大个数，默认：1个" clearable :min="1" :max="99" oninput="value=value.replace(/[^\d]/g,'')" style="width: 300px" />
            </el-form-item>
          </div>
          <!-- 日期选择 -->
          <div v-if="fieldForm.fieldType == '8'">
            <el-form-item label="显示类型">
              <el-radio-group v-model="fieldForm.fieldOptions.datetype">
                <el-radio label="date">年月日（如：2021-10-30）</el-radio>
                <el-radio label="month">年月（如：2021-10）</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="日期格式" prop="fieldOptions.dateFormat">
              <el-select v-model="fieldForm.fieldOptions.dateFormat" value-key="selectKey" placeholder="请选择应用再文件钟的日期格式" clearable filterable style="width: 300px">
                <el-option :value="item.type" :label="item.format" v-for="(item, index) in dateFormatList" :key="index"></el-option>
              </el-select>
              <span style="padding-left: 10px;display: block;">
                <i class="el-icon-warning" style="color: #ff9900; padding-right: 12px"></i>
                <span class="text-tips item-tip" style="padding: 10px 0; background-color: #fff"> 日期格式仅规定日期在下载文件中填充的格式，不影响其在系统中的显示 </span>
              </span>
            </el-form-item>
          </div>
          <!-- 日期范围选择 -->
          <div v-if="fieldForm.fieldType == '9'">
            <el-form-item label="显示类型">
              <el-radio-group v-model="fieldForm.fieldOptions.datetype">
                <el-radio label="daterange" style="margin-bottom: 10px" >年月日范围（如：2021-10-01到2021-11-01）</el-radio>
                <el-radio label="monthrange">年月范围（如：2021-10到2021-11）</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>

        <!-- 附加信息 -->
        <el-form-item label="控件提示文案" v-if="fieldForm.fieldType == '1' || fieldForm.fieldType == '6' || fieldForm.fieldType == '5' || fieldForm.fieldType == '8'">
          <el-input v-model="fieldForm.fieldPlaceholder" placeholder="例如：请输入用户名" clearable style="width: 360px" />
        </el-form-item>
        <el-form-item label="控件注释文案">
          <el-input v-model="fieldForm.fieldTips" placeholder="例如：注：此处必须填写真实姓名" clearable style="width: 360px" />
        </el-form-item>
        <el-form-item label="示例文件">
          <el-upload class="upload-demo" :action="uploadUrl" :file-list="previewFileList" :on-success="previewUploadSuccess" :on-remove="previewUploadRemove" drag :limit="1" multiple>
            <img src="@/assets/images/zt-upgrade-1/upload.svg" alt="" />
            <div class="el-upload__text">
              <p class="">点击或将文件拖拽到这里上传</p>
              <em>支持：jpg、jpge、png、pdf</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="模板文件" v-if="fieldForm.fieldName === 'registrationAuthorization'">
          <el-upload class="upload-demo" :action="uploadUrl" :on-success="templateUploadSuccess" :on-remove="templateUploadRemove" :file-list="templateFileList" drag :limit="1" multiple>
            <img src="@/assets/images/zt-upgrade-1/upload.svg" alt="" />
            <div class="el-upload__text">
              <p>点击或将文件拖拽到这里上传</p>
              <em>支持：jpg、jpge、png、pdf</em>
            </div>
          </el-upload>
        </el-form-item>
        <!-- 自动识别图片内容 -->
        <el-form-item label="自动识别图片内容" v-if="['companyBusinessLicense','identityCardReverse','identityCardFront'].includes(fieldForm.fieldName)">
          <el-switch v-model="fieldForm.fieldOptions.automaticRecognition"> </el-switch>
        </el-form-item>
        <el-form-item v-if="from != 'field-template'">
          <el-button @click="goback()">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
const customBtn = {
  props: {
    image: String,
    words: String,
  },
  template: "<div class='custoBtnStyle'> <img :src='image' width=12px height=12px/> <span class='text'>{{ words}}</span> </div> ",
};

import { findModules, findSelectFixeds, addFieldSystem, addFieldCustom, updateFieldCustom, getFieldDetail, findModuleRadios } from '@/api/newApi/processFields/fieldsConfig';
import title from '@/components/title/index';

import addImage from '@/assets/images/zt-upgrade-1/add.svg';
import delelctImage from '@/assets/images/zt-upgrade-1/trash2.svg';

export default {
  components: {
    Title: title,
    CustomBtn: customBtn,
  },
  props: {
    // 从模板配置中引入的，则隐藏掉顶部和底部按钮
    from: String,
    id: String,
    flowId: String,
    nodeId: String,
    selectedField: Object,
  },
  data() {
    return {
      // 所属模块列表
      moduleList: [],
      uploadUrl: this.baseUrl + '/file/oss/upload',
      addImage,
      delelctImage,
      // 所属字段分组列表
      groupList: [],
      // 所属字段的值列表
      groupValueList: [],

      // 字段配置
      fieldForm: {
        // 基础信息
        id: '',
        moduleId: '',
        groupId: '',
        groupValue: '',
        fieldLabel: '',
        fieldName: '',
        isSystem: false,
        fieldType: '',
        fieldPlaceholder: '',
        isRequired: false,
        // 字段属性
        fieldOptions: {
          automaticRecognition: false,
          // 文本框
          maxlength: '',
          regxtype: '',
          // 文本域
          rows: 4,
          // 下拉框
          multiple: false,
          filterable: false,
          selecttype: '1',
          selectfixed: '',
          // 上传框
          drag: false,
          limit: 1,
          accepts: ['jpg', 'jpeg', 'png', 'pdf'],
          // 日期
          datetype: '',
          // 数字格式
          digitalFormat: 'NUM_1',
          // 日期格式
          dateFormat: 'DATE_1',
          // 是否大写
          uppercase: false,
          // 选项组内容
          groups: [
            {
              label: '',
              value: '',
            },
          ],
        },

        // 其他信息
        fieldTips: '',
        previewFile: '',
        templateFile: '',
      },
      fieldFormRules: {
        moduleId: [{ required: true, message: '请选择所属模块', trigger: 'blur' }],
        fieldLabel: [{ required: true, message: '请输入字段标题', trigger: 'blur' }],
        fieldName: [
          { required: true, message: '请输入系统key值', trigger: 'blur' },
          {
            pattern: /^[A-Za-z]{1}[0-9A-Za-z]*$/,
            message: '只能输入数字和英文字母且首字母为小写',
            trigger: 'blur',
          },
        ],
        fieldType: [{ required: true, message: '请选择控件类型', trigger: 'blur' }],
        isRequired: [{ required: true, message: '请选择是否必填', trigger: 'blur' }],
        'fieldOptions.uppercase': [{ required: true, message: '请选择是否自动大写', trigger: 'change' }],
        'fieldOptions.dateFormat': [{ required: true, message: '请选择日期格式', trigger: 'change' }],
      },

      // 示例文件和模板文件列表
      previewFileList: [],
      templateFileList: [],

      // 下拉框固定选项的列表
      selectFixedList: [],
      digitalFormatList: [
        { type: 'NUM_1', format: '1000000', name: '无格式' },
        { type: 'NUM_2', format: '1000000.00', name: '2位小数' },
        { type: 'NUM_3', format: '1,000,000', name: '千分位' },
        { type: 'NUM_4', format: '1,000,000.00', name: '千分位+2位小数' },
        { type: 'NUM_5', format: '1.000.000,00', name: '德国格式' },
      ],
      dateFormatList: [
        { type: 'DATE_1', format: '31/01/2000' },
        { type: 'DATE_2', format: '2000年01月31日' },
        { type: 'DATE_3', format: 'A 31 de 01 de 2000' },
      ],
    };
  },
  created() {
    this.queryModuleList();
    // 从列表新增按钮
    if (this.$route.query && this.$route.query.from == 'add') {
      this.fieldForm.moduleId = this.$route.query.moduleId;
      this.fieldForm.isSystem = JSON.parse(this.$route.query.isSystem);
    }
    // 从列表编辑按钮
    if (this.$route.query && this.$route.query.from == 'edit') {
      this.fieldForm.id = this.$route.query.id;
      this.queryFieldDetail();
    }

    // 从字段模板配置而来
    if (this.from == 'field-template') {
      this.fieldForm.id = this.id;
      if (this.fieldForm.id) {
        // 设置模板字段值
        this.setFieldTemplate();
        // 查询模板关联字段列表
        this.getGroupFields();
      }
    }
  },
  methods: {
    goback() {
      this.$router.push({
        path: '/workOrder/fieldConfig/index',
        name: 'xcloudplat_workOrder_fieldConfig',
        params: {
          moduleId: this.fieldForm.moduleId,
        },
      });
    },

    /**
     * 查询所有模块列表
     */
    queryModuleList() {
      findModules().then((res) => {
        if (res.code == 0) {
          this.moduleList = res.data;
        }
      });
    },

    /**
     * 从节点模板点击的编辑，设置表单的数据
     */
    setFieldTemplate() {
      this.fieldForm.id = this.selectedField.id;
      this.fieldForm.moduleId = this.selectedField.moduleId;
      this.fieldForm.groupId = this.selectedField.columnPid;
      this.fieldForm.groupValue = this.selectedField.columnOption && this.selectedField.columnOption.split(',');
      this.fieldForm.fieldLabel = this.selectedField.keyLabel;
      this.fieldForm.fieldName = this.selectedField.keyName;
      this.fieldForm.isSystem = this.selectedField.isSys;
      this.fieldForm.fieldType = String(this.selectedField.inputType);
      this.fieldForm.fieldPlaceholder = this.selectedField.placeHolder;
      this.fieldForm.isRequired = this.selectedField.isNeed;
      this.fieldForm.fieldTips = this.selectedField.remindMessage;
      this.fieldForm.previewFile = this.selectedField.fileModelUrl;
      this.fieldForm.templateFile = this.selectedField.sourceFileUrl;
      this.fieldForm.fieldOptions = JSON.parse(this.selectedField.info);
      // 示例文件和模板文件列表
      if (this.selectedField.fileModelUrl) {
        this.previewFileList.push({
          name: this.getFileName(this.selectedField.fileModelUrl),
          url: this.selectedField.fileModelUrl,
        });
      }
      if (this.selectedField.sourceFileUrl) {
        this.templateFileList.push({
          name: this.getFileName(this.selectedField.sourceFileUrl),
          url: this.selectedField.sourceFileUrl,
        });
      }
      // 下拉选项是选择的固有选项
      if (this.fieldForm.fieldOptions && this.fieldForm.fieldOptions.selecttype == 2) {
        this.changeSelectType(2);
      }
    },
    /**
     * 查询分组字段列表
     */
    getGroupFields() {
      findModuleRadios({
        flowId: this.flowId,
        moduleId: this.fieldForm.moduleId,
        nodeId: this.nodeId,
        inputType: '2,3,5', // 查单选框和复选框的以及下拉框
      }).then((res) => {
        if (res.code == 0) {
          this.groupList = res.data;
          // 设置所属字段回显
          this.queryGroupValueList();
        }
      });
    },
    // 查询分组
    queryGroupValueList() {
      let field = this.groupList.filter((item) => item.id == this.fieldForm.groupId)[0] || {};
      if (field.info) {
        this.groupValueList = JSON.parse(field.info).groups;
      }
    },
    /**
     * 选择字段分组
     */
    changeGroup() {
      this.fieldForm.groupValue = [];
      this.groupValueList = [];
      let field = this.groupList.filter((item) => item.id == this.fieldForm.groupId)[0];
      if (field.info) {
        this.groupValueList = JSON.parse(field.info).groups;
      }
    },
    /**
     * 查询字段详情
     */
    queryFieldDetail() {
      getFieldDetail({ id: this.fieldForm.id }).then((res) => {
        if (res.code == 0) {
          this.fieldForm.id = res.data.id;
          this.fieldForm.moduleId = res.data.moduleId;
          this.fieldForm.groupId = res.data.columnPid;
          this.fieldForm.groupValue = res.data.columnOption && res.data.columnOption.split(',');
          this.fieldForm.fieldLabel = res.data.keyLabel;
          this.fieldForm.fieldName = res.data.keyName;
          this.fieldForm.isSystem = res.data.isSys;
          this.fieldForm.fieldType = String(res.data.inputType);
          this.fieldForm.fieldPlaceholder = res.data.placeHolder;
          this.fieldForm.isRequired = res.data.isNeed;
          this.fieldForm.fieldTips = res.data.remindMessage;
          this.fieldForm.previewFile = res.data.fileModelUrl;
          this.fieldForm.templateFile = res.data.sourceFileUrl;
          this.fieldForm.fieldOptions = JSON.parse(res.data.info);
          // 示例文件和模板文件列表
          if (res.data.fileModelUrl) {
            this.previewFileList.push({
              name: this.getFileName(res.data.fileModelUrl),
              url: res.data.fileModelUrl,
            });
          }
          if (res.data.sourceFileUrl) {
            this.templateFileList.push({
              name: this.getFileName(res.data.sourceFileUrl),
              url: res.data.sourceFileUrl,
            });
          }
          // 下拉选项是选择的固有选项
          if (this.fieldForm.fieldOptions && this.fieldForm.fieldOptions.selecttype == 2) {
            this.changeSelectType(2);
          }
        }
      });
    },
    // 获得文件名称
    getFileName(url) {
      if (!url) return '';
      return url.substring(url.lastIndexOf('/') + 1);
    },
    /**
     * 增加和移除选项组
     */
    handleAddGroup() {
      this.fieldForm.fieldOptions.groups.push({ label: '', value: '' });
    },
    handleRemoveGroup(index) {
      this.fieldForm.fieldOptions.groups.splice(index, 1);
    },

    /**
     * 下拉选项切换类型
     */
    changeSelectType(val) {
      // val == 2 是需要查固有选项列表
      if (val == 2) {
        findSelectFixeds().then((res) => {
          if (res.code == 0) {
            this.selectFixedList = res.data;
          }
        });
      }
    },
    /**
     * 示例文件
     */
    previewUploadSuccess(response, file, fileList) {
      this.fieldForm.previewFile = response.data.fileUrl;
      this.previewFileList.push({
        name: response.data.origFileName,
        url: response.data.fileUrl,
      });
    },
    previewUploadRemove() {
      this.fieldForm.previewFile = '';
      this.previewFileList = [];
    },
    /**
     * 模板文件
     */
    templateUploadSuccess(response, file, fileList) {
      this.fieldForm.templateFile = response.data.fileUrl;
      this.templateFileList.push({
        name: response.data.origFileName,
        url: response.data.fileUrl,
      });
    },
    templateUploadRemove() {
      this.fieldForm.templateFile = '';
      this.templateFileList = [];
    },

    /**
     * 提交表单
     */
    handleSubmit() {
      console.log(this.fieldForm);
      this.$refs.fieldFormRef.validate((valid) => {
        if (valid) {
          // 从节点字段模板而来的
          console.log(this.from,this.id,this.fieldForm.id)
          if (this.from == 'field-template') {
            if (this.id) {
              this.handleEditTemplate();
            } else {
              this.handleAddTemplate();
            }
          }
          // 从字段列表而来的
          else {
            if (this.fieldForm.id) {
              this.handleUpdate();
            } else {
              this.handleAdd();
            }
          }
        }
      });
    },
    // 编辑
    handleUpdate() {
      let params = {
        id: this.fieldForm.id,
        moduleId: this.fieldForm.moduleId,
        moduleName: this.moduleList.filter((item) => item.id == this.fieldForm.moduleId)[0].moduleName,
        keyLabel: this.fieldForm.fieldLabel,
        keyName: this.fieldForm.fieldName,
        isSys: this.fieldForm.isSystem,
        inputType: this.fieldForm.fieldType,
        placeHolder: this.fieldForm.fieldPlaceholder,
        isNeed: this.fieldForm.isRequired,
        remindMessage: this.fieldForm.fieldTips,
        fileModelUrl: this.fieldForm.previewFile,
        sourceFileUrl: this.fieldForm.templateFile,
        info: JSON.stringify(this.fieldForm.fieldOptions),
      };
      // 系统字段的新增接口调用
      updateFieldCustom(params).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '修改成功',
          });
          this.goback();
        }
      });
    },
    // 新增
    handleAdd() {
      let params = {
        moduleId: this.fieldForm.moduleId,
        moduleName: this.moduleList.filter((item) => item.id == this.fieldForm.moduleId)[0].moduleName,
        keyLabel: this.fieldForm.fieldLabel,
        keyName: this.fieldForm.fieldName,
        isSys: this.fieldForm.isSystem,
        inputType: this.fieldForm.fieldType,
        placeHolder: this.fieldForm.fieldPlaceholder,
        isNeed: this.fieldForm.isRequired,
        remindMessage: this.fieldForm.fieldTips,
        fileModelUrl: this.fieldForm.previewFile,
        sourceFileUrl: this.fieldForm.templateFile,
        info: JSON.stringify(this.fieldForm.fieldOptions),
      };
      // 系统字段的新增接口调用
      if (this.fieldForm.isSystem) {
        addFieldSystem(params).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '添加成功',
            });
            this.goback();
          }
        });
      }
      // 自定义字段的新增接口调用
      else {
        addFieldCustom(params).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '添加成功',
            });
            this.goback();
          }
        });
      }
    },

    // 编辑字段模板的信息
    handleEditTemplate() {
      let data = {
        id: this.fieldForm.id,
        moduleId: this.fieldForm.moduleId,
        moduleName: this.moduleList.filter((item) => item.id == this.fieldForm.moduleId)[0].moduleName,
        columnPid: this.fieldForm.groupId,
        columnOption: this.fieldForm.groupValue.join(','),
        keyLabel: this.fieldForm.fieldLabel,
        keyName: this.fieldForm.fieldName,
        isSys: this.fieldForm.isSystem,
        inputType: this.fieldForm.fieldType,
        placeHolder: this.fieldForm.fieldPlaceholder,
        isNeed: this.fieldForm.isRequired,
        remindMessage: this.fieldForm.fieldTips,
        fileModelUrl: this.fieldForm.previewFile,
        sourceFileUrl: this.fieldForm.templateFile,
        info: JSON.stringify(this.fieldForm.fieldOptions)
      };
      this.$emit('editTemplateField', data);
    },
    // 新增字段模板
    handleAddTemplate() {
      let params = {
        moduleId: this.fieldForm.moduleId,
        moduleName: this.moduleList.filter((item) => item.id == this.fieldForm.moduleId)[0].moduleName,
        keyLabel: this.fieldForm.fieldLabel,
        keyName: this.fieldForm.fieldName,
        isSys: this.fieldForm.isSystem,
        inputType: this.fieldForm.fieldType,
        placeHolder: this.fieldForm.fieldPlaceholder,
        isNeed: this.fieldForm.isRequired,
        remindMessage: this.fieldForm.fieldTips,
        fileModelUrl: this.fieldForm.previewFile,
        sourceFileUrl: this.fieldForm.templateFile,
        info: JSON.stringify(this.fieldForm.fieldOptions),
      };
      // 系统字段的新增接口调用
      if (this.fieldForm.isSystem) {
        addFieldSystem(params).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '添加成功',
            });
            // 如果有emit，则调用
            this.$emit('addTemplateField');
            
          }
        });
      }
      // 自定义字段的新增接口调用
      else {
        addFieldCustom(params).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '添加成功',
            });
            // 如果有emit，则调用
            this.$emit('addTemplateField');
            this.$emit('addFieldTitleSave',this.fieldForm.fieldLabel);
          }
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  height: 100%;
  position: relative;
  background: #fff;
  .page-header {
    background: #fff;
    margin-bottom: 30px;
    padding: 20px 0px 0px 24px;
    border-radius: 4px;
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    .el-page-header__left {
      align-items: center;
      .el-page-header__title {
        margin-left: 4px;
      }
    }
  }
  /deep/.el-upload-dragger {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  .el-upload-dragger .el-upload__text {
    margin-top: 10px;
  }
  .el-upload-dragger .el-upload__text p {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 0.85);
    line-height: 17px;
  }
  .el-upload-dragger .el-upload__text em {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 17px;
  }
  .form-container {
    background: #fff;
    padding: 0px 0px 0px 30px;
    border-radius: 4px;
    padding-bottom: 20px;
    .type-options {
      background: #f5f5f5;
      >div{
        padding: 20px 0 1px;
      }
    }
    .t-class {
      // margin-left: 14px;
      // padding: 30px 0px 40px 0px;
    }
  }
}
</style>
<style lang="less">
.page-header {
  .el-page-header__left::after {
    background: none;
  }
}
.custoBtnStyle {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-custom {
  height: 32px;
  .text {
    margin-left: 2px;
  }
}
</style>
