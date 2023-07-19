<template>
  <div>
    <ul class="product-pictures-ul">
      <li v-for="(item, index) in productPictures" :key="index">
        <a-icon type="close" class="del-pictures" @click="delPictures(index)" v-if="productPictures.length > 1" />
        <Select
          v-model="item.category2Num"
          placeholder="请选择已添加的小类"
          clearable
          @on-change="(val) => categoryChange(val, item)"
        >
          <Option v-for="item in subCategoryList" :value="item.category2Num" :key="item.category2Num"
            >{{ item.category2Name }} / {{ item.category2NameEn }}</Option
          >
        </Select>
        <br />
        <div class="antd-upload-box">
          <a-upload
            list-type="picture-card"
            :file-list="item.fileList"
            :before-upload="(file) => beforeUploadHandler2(file, item)"
            :remove="(e) => handleRemove(e, item)"
            @preview="handlePreview"
          >
            <div v-if="item.fileList.length < 7">
              <a-icon type="plus" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </li>
    </ul>
    <span class="add-pictures" @click="addPictures">添加更多</span>
  </div>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
import { uniqBy } from 'lodash';
import { upload2 } from '@/api/uploadReFile.js';
export default {
  props: {
    value: { type: String | Array },
    serviceInfo: {
      type: Object,
      default: {},
    },
  },
  watch: {
    '$store.state.app.categoryList': {
      handler(newVal) {
        this.subCategoryList = [];
        newVal.forEach((ele) => {
          this.subCategoryList.push(...ele.listTrademarkCategory2);
        });
        this.subCategoryList = uniqBy(this.subCategoryList, 'category2Num');
        let reg = /_|\r|\n|\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g;
        if (this.initFlag) {
          this.initFlag = false;
          this.productPictures = [];
          let category2NumArr = [];
          if (this.value && this.value.length) {
            console.log(this.value, 'this.value');
            this.value.forEach((item) => {
              this.subCategoryList.forEach((sub) => {
                let itemFileName = item.fileName.replace(reg, '').slice(0, -4);
                if (itemFileName[itemFileName.length - 1] == ')') {
                  itemFileName = itemFileName.slice(0, -3);
                }
                let subFileName = sub.category2NameEn.replace(reg, '');
                console.log(itemFileName, subFileName, itemFileName.includes(subFileName));
                if (itemFileName == subFileName) {
                  // if (item.fileName.includes(sub.category2NameEn.replace(/[\r\n]/g, ''))) {
                  category2NumArr.push({
                    category2Num: sub.category2Num,
                    category2NameEn: sub.category2NameEn,
                  });
                }
              });
            });
            category2NumArr = uniqBy(category2NumArr, 'category2Num');
            category2NumArr.forEach((item) => {
              let fileArr = [];
              this.value.forEach((pic) => {
                let picFileName = pic.fileName.replace(reg, '').slice(0, -4);
                if (picFileName[picFileName.length - 1] == ')') {
                  picFileName = picFileName.slice(0, -3);
                }
                let subFileName = item.category2NameEn.replace(reg, '');
                if (picFileName == subFileName) {
                  // if (pic.fileName.includes(item.category2NameEn.replace(/[\r\n]/g, ''))) {
                  fileArr.push({
                    uid: pic.fileUrl,
                    name: pic.fileName,
                    url: pic.fileUrl,
                  });
                }
              });
              this.productPictures.push({
                ...item,
                fileList: uniqBy(fileArr, 'url'),
              });
            });
          } else {
            this.productPictures.push({
              category2Num: '',
              fileList: [],
            });
          }
          this.$emit('input', this.productPictures);
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      initFlag: true,
      previewVisible: false,
      previewImage: '',
      productPictures: [],
      subCategoryList: [],
    };
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleRemove(fileList, item) {
      item.fileList = item.fileList.filter((ele) => ele.uid != fileList.uid);
    },
    // 上传产品图或销售链接
    beforeUploadHandler2(file, item) {
      if (!item.category2Num) {
        this.$Notice.warning({
          title: '请先选择商标小类，再上传订单详情截图',
        });
        return false;
      }

      let suffix = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (suffix !== 'jpg' && suffix !== 'pdf') {
        this.$Notice.warning({
          title: '文件格式错误',
          desc: '文件格式不正确, 请上传jpg,pdf格式的文件',
        });
        return false;
      }

      let reg = /\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g;

      let category2NameEn = this.subCategoryList.filter((sub) => sub.category2Num == item.category2Num)[0]
        .category2NameEn;
      let newName = category2NameEn.replace(/[\r\n]/g, '');

      let fileNameNo = 0;

      const uploadList = [...item.fileList];

      uploadList.map((item) => {
        let itemName = item.name;
        let itemSuffix = itemName.substring(itemName.lastIndexOf('.') + 1);

        if (
          itemSuffix === suffix &&
          (itemName.slice(0, itemName.length - 4) === newName ||
            itemName.slice(0, itemName.length - 7) === newName ||
            itemName.slice(0, itemName.length - 8) === newName)
        ) {
          fileNameNo++;
        }
      });

      newName = fileNameNo === 0 ? newName : `${newName}(${fileNameNo})`;

      const copyFile = new File([file], `${newName}.${suffix}`);
      this.uploadFile(copyFile, item);
      return false;
    },
    uploadFile(file, item) {
      const formdata = new FormData();
      formdata.append('file', file);
      upload2(formdata)
        .then((res) => {
          let obj = {
            uid: res.data.fileUrl,
            name: res.data.origFileName,
            url: res.data.fileUrl,
          };
          item.fileList.push(obj);
        })
        .catch(() => {
          this.$Notice.warning({
            title: '警告',
            desc: '上传文件失败',
          });
        });
    },

    //添加图片
    addPictures() {
      this.productPictures.push({
        category2Num: '',
        fileList: [],
      });
    },
    //切换链接
    categoryChange(val, item) {
      // if(val){
      //   this.subCategoryList.forEach(sub => {
      //     if(sub.category2Num == val){
      //       item.category2Name = sub.category2Name
      //       item.category2NameEn = sub.category2NameEn
      //       item.category2Num = sub.category2Num
      //     }
      //   })
      // }else{
      //   item.category2Name = ''
      //   item.category2NameEn = ''
      //   item.category2Num = ''
      // }
    },
    //删除图片
    delPictures(index) {
      if (this.productPictures.length > 1) {
        this.productPictures.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.product-pictures-ul {
  margin-bottom: 0;
  > li {
    background: #fafafa;
    width: 376px;
    padding: 16px;
    margin-bottom: 16px;
    position: relative;
    /deep/.ivu-select {
      margin-bottom: 13px;
    }
  }
  .del-pictures {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #c0c4cb;
    cursor: pointer;
    &:hover {
      color: #666;
    }
  }
}
.add-pictures {
  color: #3a7fff;
  cursor: pointer;
  position: relative;
  top: -15px;
}

.antd-upload-box {
  /deep/.ant-upload-list-picture-card-container,
  /deep/.ant-upload-list-picture-card .ant-upload-list-item,
  /deep/.ant-upload.ant-upload-select-picture-card {
    width: 80px;
    height: 80px;
  }
}
</style>
