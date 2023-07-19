<template>
    <div class="goodsItemBox" @click="toShoppingDetail(itemdata)">
        <img v-if="isFree" src="@/assets/images/activity618/free.png" alt="" class="freeImg">
        <img :src="getImg(itemdata.pcProductImgUrl)" alt="" class="goodsImg">
        <div class="goodsInfo">
            <div :class="[isFree? 'freeGoodsTitle': 'goodsTitle']">{{itemdata.productName}}</div>
            <div :class="[isFree? 'freeGoodsSubTitle': 'goodsSubTitle']"></div>
            <div class="priceBox" v-if="isFree">
                <div class="free">免费</div>
                <div :class="['btn', [4,5].indexOf(status) > -1  ? 'allowBuy': 'isDisabled']" @click="toShoppingDetail(itemdata)">
                    {{getStatus(itemdata.status)}}
                </div>
            </div>
            <div class="priceBox noFress" v-if="!isFree">
                <div class="price">￥{{itemdata.flashPrice}}</div>
                <div :class="['btn', [4,5].indexOf(status) > -1 ? 'allowBuy': 'isDisabled']" @click="toShoppingDetail(itemdata)">
                    {{getStatus(itemdata.status)}}
                </div>
            </div>
            <div class="goodsProgress" v-if="!isFree">
                <div class="oldPrice">￥{{itemdata.standardPrice}}</div>
                <div class="progress">
                    <span>已售{{itemdata.ratio}}%</span>
                    <div class="progressBox">
                        <div class="sealed" :style="{ width: Math.floor(itemdata.ratio) + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            isFree: {
                type: Boolean,
                default: false
            },
            itemdata: {
                type: Object,
                default: {}
            },
            startTime: {
                type: String,
                default: ''
            },
            endTime: {
                type: String,
                default: ''
            },
            activityType: {
                type: Number
            },
            isBefor: {
                type:Boolean
            },
            isBegin: {
                type:Boolean
            },
            over: {
                type:Boolean
            }
        },
        data(){
            return {
                isDisabled: true,
                status: ''
            }
        },
        methods: {
            getImg(img) {
                return JSON.parse(img) ? JSON.parse(img)[0].imgUrl : ''
            },
            getStatus( status ) {
                let statusText =  ''
                switch (status) {
                    case 1: statusText = this.isBegin ? this.changeStatus(4 ,'立即抢购') : this.changeStatus(1 ,'未开始')
                        
                        break;
                    case 2: statusText = this.changeStatus(2 ,'已结束')
                        
                        break;
                    case 3: statusText = this.changeStatus(3 ,'已售罄')
                        
                        break;
                    case 4: statusText = this.over ?  this.changeStatus(2 ,'已结束') : this.changeStatus(4 ,'立即抢购')
                        
                        break;
                    case 5: statusText = this.changeStatus(5 ,'新用户专享')
                        
                        break;
                }
                return statusText
            },
            changeStatus(status, tex) {
                this.status = status
                return tex
            },
            // 跳转详情
            toShoppingDetail(data) {
                // 支持的支付方式
                window.localStorage.setItem('supportPayType', JSON.stringify(data.supportPayType))
                this.$router.push({
                    name: "serviceDetail",
                    query: { 
                        id: data.productInfoId,
                        from: 1,
                        activityStatus: data.status,
                        startTime: this.startTime,
                        endTime: this.endTime,
                        activityType: this.activityType,
                        marketingActivityId: data.marketingActivityId,
                        isBefor: this.isBefor,
                        buyLimit: data.buyLimit
                    }
                });
            },
        },
    }
</script>

<style lang="less" scoped>
.goodsItemBox{
    cursor: pointer;
    position: relative;
    width: 221px;
    height: 251px;
    background: #FEE7D6;
    border: 1px solid #FEC19F;
    border-radius: 10px;
    font-family: HarmonyOS Sans SC;
    // overflow: hidden;
    .freeImg{
        position: absolute;
        top: -7px;
        left: -7px;
    }
    .goodsImg{
        display: inline-block;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        width: 219px;
        height: 124px;
    }
    .goodsInfo{
        padding: 11px 16px;
        .goodsTitle{
            height: 48px;
            font-size: 18px;
            font-weight: 500;
            color: #89441E;
            display: -webkit-box;
            text-overflow: ellipsis;
            overflow: hidden;
            -webkit-line-clamp: 2; // 设置两行文字溢出
            -webkit-box-orient: vertical;
        }
        .freeGoodsTitle{
            height: 48px;
            font-size: 18px;
            font-weight: 500;
            color: #89441E;
            display: -webkit-box;
            text-overflow: ellipsis;
            overflow: hidden;
            -webkit-line-clamp: 2; // 设置两行文字溢出
            -webkit-box-orient: vertical;
        }
        .freeGoodsSubTitle{
            display: inline-block;
            margin: 5px 0;
            font-size: 12px;
            font-weight: 400;
            color: #995530;
        }
        .goodsSubTitle{
            margin: 5px 0;
            font-size: 12px;
            font-weight: 400;
            color: #995530;
        }
        .priceBox{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .free{
                width: 55px;
                height: 27px;
                font-size: 22px;
                font-weight: bold;
                font-style: italic;
                color: #FA4F4F;
                line-height: 27px;
                // text-shadow: 0px 4px 0px rgba(221, 200, 183, 0.56);
                background: linear-gradient(180deg, #F62C2C, #F96B6B 99.31640625%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .price{
                margin-left: -5px;
                width: 65px;
                // height: 17px;
                font-size: 20px;
                font-weight: bold;
                font-style: italic;
                color: #FA4F4F;
                line-height: 20px;
                // text-shadow: 0px 4px 0px rgba(221, 200, 183, 0.56);
                background: linear-gradient(180deg, #F62C2C, #F96B6B 99.31640625%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .btn{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 112px;
                height: 28px;
                // background: linear-gradient(0deg, #F62C2C 21%, #FA7171 100%);
                box-shadow: 0px 4px 0px 0px rgba(221, 200, 183, 0.56);
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
                font-style: italic;
                color: #FDFDFD;
                line-height: 20px;
                cursor: pointer;
            }
        }
        .noFress{
            .price{
                width: 50%;
            }
            .btn{
                width: 100px;
            }
        }
    }
    .goodsProgress{
        margin-top: 2px;
        display: flex;
        justify-content: space-between;
        .oldPrice{
            font-size: 12px;
            font-weight: 400;
            font-style: italic;
            text-decoration: line-through;
            color: #DA9C6D;
            line-height: 20px;
        }
        .progress{
            width: auto;
            display: flex;
            align-items: center;
            font-size: 12px;
            font-weight: 400;
            font-style: italic;
            color: #89441E;
            .progressBox{
                width: 70px;
                height: 8px;
                background: #fdc7b9;
                border-radius: 4px;
                margin-left: 10px;
                .sealed{
                    width: 100%;
                    height: 8px;
                    background: #f74747;
                    border-radius: 4px;
                }
            }
        }
    }
}
.isDisabled{
    background: linear-gradient(0deg, #F62C2C 21%, #FA7171 100%);
    opacity: 0.5;
}
.allowBuy{
    background: linear-gradient(0deg, #F62C2C 21%, #FA7171 100%);
}
</style>