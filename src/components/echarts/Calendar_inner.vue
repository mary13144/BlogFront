<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted} from "vue";
import type {CalenderDate} from "@/types";

const props = defineProps<{
  theme: boolean,
  data: CalenderDate[],
  isTitle: boolean,
  height: number
}>()

const articleCalendar = async () => {
  let color = "#000000"
  let inRangeColor = [
    "#ebedf0", "#c6e48b", "#7bc96f", "#32af4a",
    "#1a792c", "#0f5e1e", "#0f491a", "#02340c"
  ]
  let borderColor = "#fff"
  let textColor = "#555555"
  if (!props.theme) {
    color = "#5a5a5a"
    textColor = "#f0eeee"
    inRangeColor = [
      "#404148", "#c6e48b", "#7bc96f", "#32af4a",
      "#1a792c", "#0f5e1e", "#0f491a", "#02340c"
    ]
    borderColor = "#222429"
  }
  let title = null
  if (props.isTitle) {
    title = {
      text: '文章日历',
      textStyle: {
        color: textColor
      },
      padding: [15, 5],
    }
  } else {
    top.value = 40
  }
  let chartDom = document.getElementById('calendar');
  if (!chartDom) {
    return
  }
  //@ts-ignore
  let myChart = echarts.init(chartDom, null, {locale: 'ZH'});

  let start = props.data[0].date
  let end = props.data[props.data.length - 1].date
  let time_interval = [start, end]
  const data = [];
  for (const item of props.data) {
    data.push([item.date, item.count])
  }
  let option = {
    title: title,
    tooltip: {
      padding: 10,
      backgroundColor: "#555",
      borderColor: "#777",
      borderWidth: 1,
      formatter: function (e) {
        e = e.value;
        return '<div style="font-size: 14px; color: white">' + e[0] + "：" + e[1] + "</div>"
      }
    },
    visualMap: {
      show: true,
      showLabel: true,
      categories: [0, 1, 2, 3, 4, 5, 6, 7],
      calculable: true,
      inRange: {
        symbol: "rect",
        color: inRangeColor
      },  // 对应上面的四个值
      itemWidth: 12,
      itemHeight: 12,
      orient: "horizontal",
      left: "center",
      bottom: 0,
      textStyle: {
        color: color
      }
    },
    calendar: {
      top: top.value,
      right: "center",
      bottom: 30,
      range: time_interval,  // 时间范围
      cellSize: [13, 13],
      splitLine: {show: !1},
      itemStyle: {color: "#196127", borderColor: borderColor, borderWidth: 2},
      yearLabel: {show: !1},
      monthLabel: {
        nameMap: "cn",
        fontSize: 11,
        color: color
      },
      dayLabel: {
        formatter: "{start}  1st",
        nameMap: "cn",
        fontSize: 11,
        color: color
      }
    },
    series: [
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        calendarIndex: 0,
        data: data,
      }
    ],
  };
  option && myChart.setOption(option);
  window.onresize = () => {
    myChart.resize();
  }
}

onMounted(() => {
  articleCalendar()
})
</script>

<template>
  <div id="calendar" :style="'height: '+props.height+'px'"></div>
</template>

<style scoped lang="scss">

</style>