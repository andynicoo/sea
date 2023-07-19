<template>
    <div id="helpDocumentContent">
        <el-row class="title">
            <el-col>
                <strong>产品介绍</strong>
            </el-col>
        </el-row>
        <el-row
            type="flex"
            align="middle"
            v-for="item in productList"
            :key="item.id"
        >
            <el-col :offset="1" :span="3">
                <p class="name">{{ item.name }}</p>
            </el-col>
            <el-col :span="2">
                <el-link type="primary" :underline="false" :href="item.url"
                    >下载</el-link
                >
            </el-col>
        </el-row>
        <el-row class="title">
            <el-col>
                <strong>操作指引</strong>
            </el-col>
        </el-row>
        <el-row
            type="flex"
            align="middle"
            v-for="item in optionalList"
            :key="item.id"
        >
            <el-col :offset="1" :span="3">
                <p class="name">{{ item.name }}</p>
            </el-col>
            <el-col :span="2">
                <el-link :href="item.url" :underline="false" type="primary"
                    >下载</el-link
                >
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            productList: [
                {
                    id: 1,
                    name: '英德法意西VAT',
                    url: 'https://zhongyaooss1.oss-cn-beijing.aliyuncs.com/%E6%96%B0%E5%BB%BA%20DOCX%20%E6%96%87%E6%A1%A3.docx?Expires=1628231391&OSSAccessKeyId=TMP.3KeK9DZQxivEcjayJ8feMXetJAfsNtFHwpqRGyK2BjevV6NyzX81ufyaZMSZcNQgpMKRbPQAjfMWgxV3xnTX5UN9R7MjmY&Signature=O5oUDkFOJ2%2BtBBtNI5j%2F7jF0BQM%3D'
                },
                {
                    id: 2,
                    name: '沙特阿联酋VAT',
                    url: 'https://zhongyaooss1.oss-cn-beijing.aliyuncs.com/%E6%96%B0%E5%BB%BA%20DOCX%20%E6%96%87%E6%A1%A3.docx?Expires=1628231391&OSSAccessKeyId=TMP.3KeK9DZQxivEcjayJ8feMXetJAfsNtFHwpqRGyK2BjevV6NyzX81ufyaZMSZcNQgpMKRbPQAjfMWgxV3xnTX5UN9R7MjmY&Signature=O5oUDkFOJ2%2BtBBtNI5j%2F7jF0BQM%3D'
                },
                {
                    id: 3,
                    name: '奥地利VAT',
                    url: 'https://zhongyaooss1.oss-cn-beijing.aliyuncs.com/%E6%96%B0%E5%BB%BA%20DOCX%20%E6%96%87%E6%A1%A3.docx?Expires=1628231391&OSSAccessKeyId=TMP.3KeK9DZQxivEcjayJ8feMXetJAfsNtFHwpqRGyK2BjevV6NyzX81ufyaZMSZcNQgpMKRbPQAjfMWgxV3xnTX5UN9R7MjmY&Signature=O5oUDkFOJ2%2BtBBtNI5j%2F7jF0BQM%3D'
                }
            ],
            optionalList: [
                {
                    id: 4,
                    name: '英德法意西VAT',
                    url: 'https://zhongyaooss1.oss-cn-beijing.aliyuncs.com/%E6%96%B0%E5%BB%BA%20DOCX%20%E6%96%87%E6%A1%A3.docx?Expires=1628231391&OSSAccessKeyId=TMP.3KeK9DZQxivEcjayJ8feMXetJAfsNtFHwpqRGyK2BjevV6NyzX81ufyaZMSZcNQgpMKRbPQAjfMWgxV3xnTX5UN9R7MjmY&Signature=O5oUDkFOJ2%2BtBBtNI5j%2F7jF0BQM%3D'
                },
                {
                    id: 5,
                    name: '沙特阿联酋VAT',
                    url: 'https://zhongyaooss1.oss-cn-beijing.aliyuncs.com/%E6%96%B0%E5%BB%BA%20DOCX%20%E6%96%87%E6%A1%A3.docx?Expires=1628231391&OSSAccessKeyId=TMP.3KeK9DZQxivEcjayJ8feMXetJAfsNtFHwpqRGyK2BjevV6NyzX81ufyaZMSZcNQgpMKRbPQAjfMWgxV3xnTX5UN9R7MjmY&Signature=O5oUDkFOJ2%2BtBBtNI5j%2F7jF0BQM%3D'
                },
                {
                    id: 6,
                    name: '奥地利VAT',
                    url: 'https://zhongyaooss1.oss-cn-beijing.aliyuncs.com/%E6%96%B0%E5%BB%BA%20DOCX%20%E6%96%87%E6%A1%A3.docx?Expires=1628231391&OSSAccessKeyId=TMP.3KeK9DZQxivEcjayJ8feMXetJAfsNtFHwpqRGyK2BjevV6NyzX81ufyaZMSZcNQgpMKRbPQAjfMWgxV3xnTX5UN9R7MjmY&Signature=O5oUDkFOJ2%2BtBBtNI5j%2F7jF0BQM%3D'
                }
            ]
        }
    },
    methods: {
        handleClick () { return }
    },
}
</script>

<style lang="scss" scoped>
#helpDocumentContent {
    height: calc(100vh - 220px);
    overflow-y: auto;
    .name {
        font-size: 14px;
        margin:10px;
    }
    .title {
        margin: 20px;
        font-size: 18px;
        font-weight: bold;
    }
}
</style>