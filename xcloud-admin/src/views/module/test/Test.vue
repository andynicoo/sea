<template>
  <div>
    <div id="echartsMain" style="width: 1200px; height: 600px; border: 1px solid red"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as echarts from 'echarts';

onMounted(() => {
  // getList();
  echarts.init((document as any).getElementById('echartsMain')).setOption({
    // title: {
    //   text: 'ECharts 入门示例',
    // },
    // tooltip: {},
    // xAxis: {
    //   data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
    // },
    // yAxis: {},
    legend: {
      bottom: 0,
      left: 'center',
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          initLayout: 'circular', //进行力引导布局前的初始化布局，初始化布局会影响到力引导的效果。
          repulsion: 500, //节点之间的斥力因子
          gravity: 0.01, //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
          edgeLength: 200, //边的两个节点之间的距离
          layoutAnimation: false, //因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。
          friction: 1, //这个参数能减缓节点的移动速度。取值范围 0 到 1。但是仍然是个试验性的参数
        },
        roam: true, //是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
        scaleLimit: {
          //滚轮缩放的极限控制，通过min, max最小和最大的缩放值，默认的缩放为1。
          min: 0.4,
          max: 2,
        },
        draggable: false, //节点是否可拖拽，只在使用力引导布局的时候有用。
        symbol: 'circle', //节点形状，'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'也可'image://url'设置节点图片
        symbolSize: 80, //节点大小
        symbolRotate: 0, //节点标记的旋转角度（而非弧度）。正值表示逆时针旋转。注意在 markLine 中当 symbol 为 'arrow' 时会忽略 symbolRotate 强制设置为切线的角度。
        symbolKeepAspect: true, //如果 symbol 是 path:// 的形式，是否在缩放时保持该图形的长宽比。
        edgeSymbol: ['circle', 'arrow'], //边两端的标记类型，可以是一个数组分别指定两端，也可以是单个统一指定。默认不显示标记，常见的可以设置为箭头
        edgeSymbolSize: [10, 12], //边两端的标记大小，可以是一个数组分别指定两端，也可以是单个统一指定。
        cursor: 'pointer', //鼠标悬浮时在图形元素上时鼠标的样式是什么。同 CSS 的 cursor。
        silent: false, //图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
        animation: true, //是否开启动画。true
        animationEasing: 'cubicOut', //初始动画的缓动效果。不同的缓动效果可以参考 缓动示例。
        autoCurveness: true, //针对节点之间存在多边的情况，自动计算各边曲率，默认不开启。
        animationDuration: function (idx: number) {
          // 初始动画的时长，支持回调函数，可以通过每个数据返回不同的时长实现更戏剧的初始动画效果： 越往后的数据时长越大 1000
          return idx * 200;
        },
        animationDelay: function (idx: number) {
          // 初始动画的延迟，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更戏剧的初始动画效果。 越往后的数据延迟越大 0
          return idx * 100;
        },
        itemStyle: {
          //图形样式。
          color: '#95dcb2',
          borderColor: 'red',
          borderWidth: 2,
          borderType: 'dashed', ////'solid' 'dashed' 'dotted' 自 v5.0.0 开始，也可以是 number 或者 number 数组，用以指定线条的 dash array，配合 dashOffset 可实现更灵活的虚线效果。
        },
        lineStyle: {
          //线的样式
          color: 'red',
          width: 2,
          type: 'solid',
          opacity: 0.8, //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
        },
        label: {
          //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
          show: true,
          position: 'inside', //标签的位置。 inside top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
          distance: 5,
          color: 'red',
          fontSize: 14,
          align: 'center',
          lineHeight: 18,
          width: 60,
          height: 60,
          overflow: 'breakAll',
          formatter: (params: any) => {
            const str = String(params.name);
            if (str && str.length > 8) {
              return str.substring(0, 8) + '...';
            } else {
              return str;
            }
          },
        },
        edgeLabel: {
          //边线上的文本标签，可用于说明一些数据信息，比如值，名称等。
          show: true,
          color: 'red',
          // position: 'middle', //middle
          // fontSize: 12,
          formatter: (params: any) => {
            return params.data.relation.name;
          },
        },
        emphasis: {
          // 高亮状态的图形样式。
          disabled: false, //是否关闭高亮状态。 false
          scale: 1.2, //是否开启高亮后节点的放大效果。从 5.3.2 版本开始支持 number，用以设置高亮放大倍数，默认放大 1.1 倍。
          focus: 'adjacency',
          itemStyle: {
            color: '#999',
            borderType: 'solid',
          },
        },
        blur: {
          // 淡出状态的图形样式。开启 emphasis.focus 后有效。
          itemStyle: {
            color: 'red',
            borderType: 'solid',
          },
        },

        selectedMode: false, //选中模式的配置，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，'series' 分别表示单选，多选以及选择整个系列。
        select: {
          //选中状态的图形样式。开启 selectedMode 后有效。
          itemStyle: {
            color: 'red',
            borderType: 'solid',
          },
        },
        categories: [
          //节点分类的类目，可选。
          {
            name: '公司',
            symbolOffset: [0, 0],
            autoCurveness: 1,
            symbolSize: 100,
          },
          {
            name: '个人',
            symbolOffset: [0, 0],
            autoCurveness: 1,
            symbolSize: 80,
          },
        ],

        nodes: [
          {
            id: '1',
            name: '辰海集团1',
            category: 1,
          },
          {
            id: '2',
            name: '辰海集团2',
            category: 0,
          },
          {
            id: '3',
            name: '辰海集团3',
            category: 0,
          },
          {
            id: '4',
            name: '辰海集团4',
            category: 0,
          },
          {
            id: '5',
            name: '辰海集团5',
            category: 0,
          },
          {
            id: '6',
            name: '辰海集团6',
            category: 0,
          },
          {
            id: '7',
            name: '辰海集团7',
            category: 0,
          },
        ],
        links: [
          {
            source: '1',
            target: '2',
            relation: {
              name: '关系1',
            },
          },
          {
            source: '1',
            target: '3',
            relation: {
              name: '关系2',
            },
          },
          {
            source: '1',
            target: '4',
            relation: {
              name: '关系4',
            },
          },
          {
            source: '1',
            target: '4',
            relation: {
              name: '关系5',
            },
          },
          {
            source: '2',
            target: '5',
            relation: {
              name: '关系5',
            },
          },
          {
            source: '2',
            target: '6',
            relation: {
              name: '关系5',
            },
          },
          {
            source: '2',
            target: '7',
            relation: {
              name: '关系5',
            },
          },
        ],
      },
    ],
  });
});
</script>

<style scoped lang="less"></style>
