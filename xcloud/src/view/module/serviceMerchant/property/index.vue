<template>
    <div v-loading="loading" class="app-container">
        <div class="header-container">
            <el-tabs v-model="activeName">
                <el-tab-pane
                    v-for="item in serverTabData"
                    :label="item.name"
                    :key="item.name"
                    :name="item.name"
                >
                    <tablecontent
                        :tabData="item"
                        :serverTypeProps.sync="serverTypeList"
                    />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import tablecontent from './tablecontent.vue'
import { getattributeCategory } from '@/api/newApi/servicemerchant/serviceMerchant.js'
export default {
    components: {
        tablecontent: tablecontent
    },
    data () {
        return {
            activeName: '服务类型',
            loading: false,
            serverTypeList: new Array(),
            serverTabData: [
                { name: '服务类型', id: 2, type: 1 },
                { name: '服务分类', id: 1, type: 1 }
            ]
        }
    },
    created () {
        this._getMerchantPropertyList()
    },
    methods: {
        _getMerchantPropertyList () {
            this.loading = true
            getattributeCategory().then(res => {
                const temp = res.data.records.map(t => {
                    return {
                        id: t.id,
                        name: t.attributeTypeName,
                        type: 2
                    }
                })
                this.serverTabData = this.serverTabData.concat(temp)
                this.loading = false
            }).catch(err => {
                this.loading = false
                console.log(err)
            })
        }
    }
}
</script>

<style lang='scss' scoped>
</style>