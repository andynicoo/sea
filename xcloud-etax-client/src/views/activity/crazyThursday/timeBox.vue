<template>
    <div class="timer">
        <template v-if="over">
            <!-- 距离秒杀
            <span class="time">00</span> 时
            <span class="time">00</span> 分
            <span class="time">00</span> 秒 -->
            <span style="marginRight: 20px">距离秒杀</span>
            <span class="time">00</span><span>时</span>
            <span class="time">00</span><span>分</span>
            <span class="time">00</span><span>秒</span>
            <span style="marginLeft: 20px">后结束</span>
        </template>
        <template v-else>
            <span style="marginRight: 20px">距离秒杀</span>
            <span class="time">{{hours>9? hours : `0${hours}`}}</span><span style="marginLeft: 4px; marginRight: 10px">时</span>
            <span class="time">{{mins>9? mins : `0${mins}`}}</span><span style="marginLeft: 4px; marginRight: 10px">分</span>
            <span class="time">{{seconds>9? seconds : `0${seconds}`}}</span><span style="marginLeft: 4px;">秒</span>
            <span style="marginLeft: 20px">{{isBefor? '后开始' : '后结束'}}</span>
        </template>
    </div>
</template>

<script>
    export default {
        props: ['hours', 'mins', 'seconds','isBefor','over']
    }
</script>

<style lang="less" scoped>
    .timer{
        position: absolute;
        width: 100%;
        top: 115px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        color: #89441E;
        .time{
            // height: 30px;
            background: linear-gradient(0deg, #EA461E 0%, #FB7042 100%);
            border-radius: 5px;
            font-size: 18px;
            color: #fff;
            font-weight: bold;
            // margin-left: 20px;
            padding: 3px;
        }
    }
</style>