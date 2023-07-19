<template>
  <el-form :model="fieldForm" ref="fieldForm" :rules="fieldFormRules" label-width="120px" class="preview-form">
    <!-- 渲染字段 -->
    <el-row>
      <!-- eslint-disable -->
      <template v-for="(field, fieldIndex) in fields">
        <!-- 文本框 -->
        <template v-if="field.inputType == 1">
          <el-col v-bind="grid">
            <el-form-item :label="field.keyLabel" label-width="130px" :prop="field.keyName" :class="{ 'is-required': field.isNeed }">
              <el-input v-model="fieldForm[field.keyName]" :placeholder="field.placeHolder" :maxlength="field.info.maxlength || 50" :disabled="isDisabled" clearable></el-input>
              <div v-if="field.remindMessage" class="text-warning">
                <i class="el-icon-warning"></i>
                {{ field.remindMessage }}
              </div>
              <div style="line-height: 18px">
                <el-link v-if="field.fileModelUrl" type="primary" :href="field.fileModelUrl" target="_blank">
                  查看示例
                </el-link>
                <el-link v-if="field.sourceFileUrl" type="primary" :href="field.sourceFileUrl" target="_blank">
                  下载模板
                </el-link>
              </div>
            </el-form-item>
          </el-col>
        </template>

        <!-- 文本域 -->
        <template v-if="field.inputType == 6">
          <el-col v-bind="grid">
            <el-form-item :label="field.keyLabel" :prop="field.keyName" :class="{ 'is-required': field.isNeed }">
              <el-input type="textarea" v-model="fieldForm[field.keyName]" :placeholder="field.placeHolder" :rows="field.info.rows || 4" :maxlength="field.info.maxlength || 500" :disabled="isDisabled" clearable></el-input>
              <div v-if="field.remindMessage" class="text-warning"> <i class="el-icon-warning"></i>{{ field.remindMessage }}</div>
              <div style="line-height: 18px">
                <el-link v-if="field.fileModelUrl" type="primary" :href="field.fileModelUrl" target="_blank">
                  查看示例
                </el-link>
                <el-link v-if="field.sourceFileUrl" type="primary" :href="field.sourceFileUrl" target="_blank">
                  下载模板
                </el-link>
              </div>
            </el-form-item>
          </el-col>
        </template>

        <!-- 下拉框 -->
        <template v-if="field.inputType == 5">
          <el-col v-bind="grid">
            <el-form-item :label="field.keyLabel" :prop="field.keyName" :class="{ 'is-required': field.isNeed }">
              <el-select v-model="fieldForm[field.keyName]" :placeholder="field.placeHolder" :multiple="field.info.multiple" :filterable="field.info.filterable" :disabled="isDisabled" clearable>
                <el-option :value="item.value" :label="item.label" v-for="(item, index) in field.info.groups"></el-option>
              </el-select>
              <div v-if="field.remindMessage" class="text-warning"> <i class="el-icon-warning"></i>{{ field.remindMessage }}</div>
              <div style="line-height: 18px">
                <el-link v-if="field.fileModelUrl" type="primary" :href="field.fileModelUrl" target="_blank">
                  查看示例
                </el-link>
                <el-link v-if="field.sourceFileUrl" type="primary" :href="field.sourceFileUrl" target="_blank">
                  下载模板
                </el-link>
              </div>
            </el-form-item>
          </el-col>
        </template>

        <!-- 单选框组 -->
        <template v-if="field.inputType == 2">
          <!-- 公司类型-单独判断 -->
          <el-col v-if="field.keyName == 'companyType'" :span="24">
            <el-form-item :label="field.keyLabel" :prop="field.keyName" :class="{ 'is-required': field.isNeed }">
              <el-radio-group v-model="fieldForm[field.keyName]" :disabled="isDisabled">
                <el-radio :label="item.value" v-for="(item, index) in field.info.groups">{{ item.label }}1212</el-radio>
              </el-radio-group>
              <div v-if="field.remindMessage" class="text-warning"> <i class="el-icon-warning"></i>{{ field.remindMessage }}</div>
              <div style="line-height: 18px">
                <el-link v-if="field.fileModelUrl" type="primary" :href="field.fileModelUrl" target="_blank">
                  查看示例
                </el-link>
                <el-link v-if="field.sourceFileUrl" type="primary" :href="field.sourceFileUrl" target="_blank">
                  下载模板
                </el-link>
              </div>
            </el-form-item>
          </el-col>
          <!-- 其他 -->
          <el-col v-else v-bind="grid">
            <el-form-item :label="field.keyLabel" :prop="field.keyName" :class="{ 'is-required': field.isNeed }">
              <el-radio-group v-model="fieldForm[field.keyName]" :disabled="isDisabled">
                <el-radio :label="item.value" v-for="(item, index) in field.info.groups">{{ item.label }}</el-radio>
              </el-radio-group>
              <div v-if="field.remindMessage" class="text-warning"> <i class="el-icon-warning"></i>{{ field.remindMessage }}</div>
              <div style="line-height: 18px">
                <el-link v-if="field.fileModelUrl" type="primary" :href="field.fileModelUrl" target="_blank">
                  查看示例
                </el-link>
                <el-link v-if="field.sourceFileUrl" type="primary" :href="field.sourceFileUrl" target="_blank">
                  下载模板
                </el-link>
              </div>
            </el-form-item>
          </el-col>
        </template>

        <!-- 复选框组 -->
        <template v-if="field.inputType == 3">
          <el-col v-bind="grid">
            <el-form-item :label="field.keyLabel" :prop="field.keyName" :class="{ 'is-required': field.isNeed }">
              <el-checkbox-group v-model="fieldForm[field.keyName]" :disabled="isDisabled">
                <el-checkbox :label="item.value" v-for="(item, index) in field.info.groups">
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
              <div v-if="field.remindMessage" class="text-warning">
                <i class="el-icon-warning"></i>
                {{ field.remindMessage }}
              </div>
              <div style="line-height: 18px">
                <el-link v-if="field.fileModelUrl" type="primary" :href="field.fileModelUrl" target="_blank">
                  查看示例
                </el-link>
                <el-link v-if="field.sourceFileUrl" type="primary" :href="field.sourceFileUrl" target="_blank">
                  下载模板
                </el-link>
              </div>
            </el-form-item>
          </el-col>
        </template>

        <!-- 上传框 -->
        <template v-if="field.inputType == 4">
          <el-col v-bind="grid">
            <el-form-item :label="field.keyLabel" :prop="field.keyName" :class="{ 'is-required': field.isNeed }">
              <el-upload :action="uploadUrl" :limit="field.info.limit" :disabled="isDisabled">
                <el-button :disabled="isDisabled" type="primary" icon="el-icon-upload">上传文件</el-button>
              </el-upload>
              <div v-if="field.remindMessage" class="text-warning"> <i class="el-icon-warning"></i>{{ field.remindMessage }}</div>
              <div style="line-height: 18px">
                <el-link v-if="field.fileModelUrl" type="primary" :href="field.fileModelUrl" target="_blank">
                  查看示例
                </el-link>
                <el-link v-if="field.sourceFileUrl" type="primary" :href="field.sourceFileUrl" target="_blank">
                  下载模板
                </el-link>
              </div>
            </el-form-item>
          </el-col>
        </template>

        <!-- 日期选择 -->
        <template v-if="field.inputType == 8">
          <el-col v-bind="grid">
            <el-form-item :label="field.keyLabel" :prop="field.keyName" :class="{ 'is-required': field.isNeed }">
              <el-date-picker v-model="fieldForm[field.keyName]" :type="field.info.datetype" :placeholder="field.placeHolder" :value-format="
                  field.info.datetype == 'date' ? 'yyyy-MM-dd' : field.info.datetype == 'month' ? 'yyyy-MM' : ''
                " :disabled="isDisabled" clearable></el-date-picker>
              <div v-if="field.remindMessage" class="text-warning"> <i class="el-icon-warning"></i>{{ field.remindMessage }}</div>
              <div style="line-height: 18px">
                <el-link v-if="field.fileModelUrl" type="primary" :href="field.fileModelUrl" target="_blank">
                  查看示例
                </el-link>
                <el-link v-if="field.sourceFileUrl" type="primary" :href="field.sourceFileUrl" target="_blank">
                  下载模板
                </el-link>
              </div>
            </el-form-item>
          </el-col>
        </template>

        <!-- 日期范围选择 -->
        <template v-if="field.inputType == 9">
          <el-col v-bind="grid">
            <el-form-item :label="field.keyLabel" :prop="field.keyName" :class="{ 'is-required': field.isNeed }">
              <el-date-picker v-model="fieldForm[field.keyName]" :type="field.info.datetype" :start-placeholder="
                  field.info.datetype == 'daterange'
                    ? '开始日期'
                    : field.info.datetype == 'monthrange'
                    ? '开始月份'
                    : ''
                " :end-placeholder="
                  field.info.datetype == 'daterange'
                    ? '结束日期'
                    : field.info.datetype == 'monthrange'
                    ? '结束月份'
                    : ''
                " :value-format="
                  field.info.datetype == 'daterange'
                    ? 'yyyy-MM-dd'
                    : field.info.datetype == 'monthrange'
                    ? 'yyyy-MM'
                    : ''
                " :disabled="isDisabled" clearable></el-date-picker>
              <div v-if="field.remindMessage" class="text-warning"> <i class="el-icon-warning"></i>{{ field.remindMessage }}</div>
              <div style="line-height: 18px">
                <el-link v-if="field.fileModelUrl" type="primary" :href="field.fileModelUrl" target="_blank">
                  查看示例
                </el-link>
                <el-link v-if="field.sourceFileUrl" type="primary" :href="field.sourceFileUrl" target="_blank">
                  下载模板
                </el-link>
              </div>
            </el-form-item>
          </el-col>
        </template>

        <!-- 无类型 -->
        <template v-if="field.inputType == 10">
          <el-col v-bind="grid">
            <el-form-item :label="field.keyLabel" :prop="field.keyName" :class="{ 'is-required': field.isNeed }">
              <div v-if="field.remindMessage" class="text-warning"> <i class="el-icon-warning"></i>{{ field.remindMessage }}</div>
              <div style="line-height: 18px">
                <el-link v-if="field.fileModelUrl" type="primary" :href="field.fileModelUrl" target="_blank">
                  查看示例
                </el-link>
                <el-link v-if="field.sourceFileUrl" type="primary" :href="field.sourceFileUrl" target="_blank">
                  下载模板
                </el-link>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </template>
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: "TemplateField",
  props: {
    fields: Array,
  },
  data() {
    return {
      // 栅格布局
      grid: {
        xl: 6,
        lg: 6,
        md: 12,
        sm: 12,
        xs: 24,
      },
      // 字段表单
      fieldForm: {},
      fieldFormRules: {
        companyType: [{ required: true, message: "请选择公司类型", trigger: "change" }],
        idCard: [{ required: true, message: "请输入身份证信息", trigger: "blur" }],
      },
      // 控制是否禁用，通常在编辑的状态下
      isDisabled: true,

      // 上传文件路径
      uploadUrl: this.baseUrl + "/file/oss/upload",
    };
  },
  created() {
    // 设置表单字段信息，根据字段类型不同，初始值也不同
    let fieldForm = {};
    this.fields.forEach((v) => {
      if (
        v.inputType == 1 ||
        v.inputType == 6 ||
        v.inputType == 5 ||
        v.inputType == 2 ||
        v.inputType == 4 ||
        v.inputType == 8
      ) {
        fieldForm[v.keyName] = "";
      } else if (v.inputType == 3 || v.inputType == 9) {
        fieldForm[v.keyName] = [];
      } else {
        fieldForm[v.keyName] = "";
      }
    });
    this.fieldForm = { ...fieldForm };
  },
};
</script>
