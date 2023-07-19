<template>
    <div class="ItemBox">
        <div class="left">
            <img class="productImg" :src="img" alt="">
        </div>
        <div class="discountBox">
            <img class="discount" src="@/assets/images/activity/discount.png" alt="" />
            <div class="discountPrice">
                <div class="text">直降</div>
                <div class="price">{{discount}}</div>
            </div>
        </div>
        <div class="right">
            <div class="title">{{title}}</div>
            <div class="stroNum">{{detail}}  限量<span style="color:#EE2407">{{prodDetail.limitPurchase ? prodDetail.limitPurchase: ''}}</span>个</div>
            <div class="progresBox" v-if="status == 2">
                <span class="status" v-if="prodDetail.quantitySold ==0">正在疯抢</span> 
                <span class="status" v-if="prodDetail.limitPurchase && prodDetail.quantitySold !=0 && prodDetail.limitPurchase-prodDetail.quantitySold>0">剩余{{prodDetail.limitPurchase-prodDetail.quantitySold}}个</span> 
                <span class="status" v-if="prodDetail.limitPurchase && prodDetail.limitPurchase-prodDetail.quantitySold==0">已抢光</span> 
                <div :class="['progres', prodDetail.limitPurchase-prodDetail.quantitySold==0?'noProduct': '']"
                    :style="{width: prodDetail.limitPurchase-prodDetail.quantitySold>0 ? residue+'%' : ''}"
                >
                    <img v-if="prodDetail.limitPurchase && prodDetail.limitPurchase-prodDetail.quantitySold != 0" class="progImg" src="@/assets/images/activity/progImg.png" alt="">
                </div>
            </div>
            <div class="priceBox" v-if="status != 1 || startItem == 1">
            <!-- <div class="priceBox" v-if="status == 1 && startItem == 1"> -->
                <span>限时秒杀价:￥</span><span style="font-size: 30px">{{price}}</span><span>/年</span ><span class="sourcePrice">￥{{original}}/年</span>
            </div>
            <div class="btn" v-if="status == 1" @click="getService">点击抢秒杀机会+运营大礼包</div>
            <div class="btn" v-if="status == 2 && prodDetail.limitPurchase-prodDetail.quantitySold>0">
                <div class="text" @click="toShoppingDetail">立即秒杀</div>
                <div class="timer">
                    <p>{{hours>9? hours : `0${hours}`}}</p>
                    <p class="tip">:</p>
                    <p>{{mins>9? mins : `0${mins}`}}</p>
                    <p class="tip">:</p>
                    <p>{{seconds>9? seconds : `0${seconds}`}}</p>
                </div>
            </div>
            <div class="btn btnNoProduct" v-if="status == 2 && prodDetail.limitPurchase-prodDetail.quantitySold==0">已抢光</div>
            <div class="btn" v-if="status == 3">秒杀已结束</div>
        </div>
    </div>
</template>

<script>
    import { productDetail } from "@/api/activity/index";
    export default {
        props:['startItem','id','status','img','discount','title','detail','num','price','original','hours','mins','seconds','waiteActi','activityEnd'],
        data(){
            return {
                prodDetail: {},
                residue: '',
                agear:''
            }
        },
        watch: {
            startItem(value){
                // console.log('点击的item',value);
                this.agear = value
                switch (value) {
                    case 1:
                        this.getDetail(this.ActiveConfig.detailTime1)
                        break;
                    case 2:
                        this.getDetail(this.ActiveConfig.detailTime2)
                        break;
                    case 3:
                        this.getDetail(this.ActiveConfig.detailTime3)
                        break;
                }
            }
        },
        computed: {
            // startItem() {
            //     return this.startItem 
            // }
        },
        methods: {
            getService() {
                this.$emit('showPop')
            },
            toShoppingDetail() {
                this.$router.push({ path: "/serviceDetail", query: { id: this.id,from: 1 } });
            },
            getDetail(time) {
                let params = {
                    productId: this.id,
                    activityPlatform: 0,
                    activityDate: time
                }
                productDetail(params).then(res => {
                    // console.log('哦哦哦哦哦哦', res);
                    if(res.code == 0 && res.extra) {
                        this.prodDetail = res.extra.detail
                        this.residue= (this.prodDetail.limitPurchase-this.prodDetail.quantitySold)/this.prodDetail.limitPurchase*100
                    }
                })
            }
        },
        mounted(){
            this.getDetail(this.ActiveConfig.detailTime3)
        }
    }
</script>

<style lang="less" scoped>
.ItemBox{
    font-family: HarmonyOS Sans SC;
    box-sizing: border-box;
    width: 530px;
    height: 246px;
    background: #ffd7a1;
    border: 8px solid #fff;
    border-radius: 20px;
    position: relative;
    display: flex;
    .left{
        position: relative;
        margin: 25px 0 0 10px;
        .productImg{
            width: 182px;
            height: 180px;
            border-radius: 10px;
        }
    }
    .discountBox{
        position: absolute;
        top: -30px;
        left: 107px;
        .discountPrice{
            position: absolute;
            top: 70px;
            right: 28px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            font-weight: bold;
            .text{
                color: #fff;
            }
            .price{
                color: #FFEC8B;
                &::after{
                    content: '元';
                    color: #fff;
                }
            }
        }
    }
    .right{
        margin: 25px 0 0 40px;
        .title{
            font-size: 24px;
            font-weight: bold;
            color: #742502;
            line-height: 24px;
        }
        .stroNum{
            font-size: 16px;
            font-weight: bold;
            color: #882E06;
            line-height: 24px;
            margin: 12px 0;
        }
        .progresBox{
            width: 255px;
            height: 18px;
            background: #FF9A86;
            border-radius: 9px;
            font-size: 14px;
            color: #fff;
            display: flex;
            position: relative;
            // opacity: 0;
            .status{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%); 
                z-index: 999;
            }
            .progres{
                position: relative;
                height: 100%;
                // width: 75%;
                background: linear-gradient(90deg, #EE1515 0%, #FF5534 100%);
                border-radius: 9px;
                .progImg{
                    position: absolute;
                    top: 0;
                    right: 0;
                }
            }
            .noProduct{
                width: 100%;
                background: linear-gradient(-60deg, #BDBDBD 0%, #D8D8D8 100%);
            }
        }
        .priceBox{
            font-size: 13px;
            font-weight: bold;
            font-style: italic;
            color: #FE0000;
            .sourcePrice{
                text-decoration: line-through;
                font-size: 13px;
                font-weight: normal;
                color: #882E06;
                margin-left: 8px;
                font-weight: bold;
                line-height: 24px;
                font-style: italic;
            }
        }
        .btn{
            width: 254px;
            height: 40px;
            background: linear-gradient(0deg, #FF391E 0%, #FF7765 100%);
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            color: #FEFEFE;
            line-height: 24px;
            margin-top: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            overflow: hidden;
            .text{
                font-size: 16px;
                width: 50%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                letter-spacing: 3px;
                background: linear-gradient(0deg, #FF391E 0%, #FF7765 100%);
            }
            .timer{
                font-size: 16px;
                width: 48.5%;
                height: 90%;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #fff;
                color: #FF3D22;
                border-radius: 5px;
            }
        }
        .btnNoProduct{
            background: linear-gradient(0deg, #ff9a6f 0%, #ffaf87 100%);
            cursor: no-drop;
        }
    }
}
</style>