<script setup lang="ts">
import * as echarts from "echarts";
import {onMounted} from "vue";
import type {WeekDate} from "@/types";

const props = defineProps<{
  data: WeekDate,
  height: number,
  theme: boolean
}>()

function week() {
  // 时间数组
  let date = props.data.date_list
  // 登录数据
  let login_seven = props.data.login_data
  // 注册的数据
  let sign_seven = props.data.sign_data

  // 线段的颜色
  let bg = "#f0eeee"
  // 文字的颜色
  let textColor = "#555555"
  // 主题的颜色
  let themeColor = ['#73c0de', '#2184fc']
  if (!props.theme) {
    bg = "#404148"
    textColor = "#f0eeee"
    themeColor = ['#fac858', '#ee6666']
  }

  let chartDom = document.getElementById('week')!;
  let myChart = echarts.init(chartDom);
  let option;
  option = {
    // 左上角文字
    title: {
      text: '七日用户活跃',
      textStyle: {
        color: textColor
      },
      padding: [15, 20],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    // 图例
    legend: {
      data: ['登录', '注册'],
      padding: [20, 20],
      textStyle: {
        color: textColor
      }
    },
    toolbox: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis:
        {
          type: 'category',
          boundaryGap: false,
          data: date,
          axisLine: {
            lineStyle: {
              // color: "red"
            }
          },
          splitLine: {
            // show: true
          }
        }
    ,
    yAxis:
        {
          type: 'value',
          axisLine: {},
          splitLine: {
            show: true,
            lineStyle: {
              color: bg
            }
          }
        }
    ,
    series: [
      {
        name: '登录',
        type: 'line',
        areaStyle: {},
        smooth: true,//设置折线图平滑
        emphasis: {
          focus: 'series'
        },
        data: login_seven,
      },
      {
        name: '注册',
        type: 'line',
        smooth: true,//设置折线图平滑
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: sign_seven,
      },
    ],
    color: themeColor
  };

  option && myChart.setOption(option);
}

onMounted(() => {
  week()
})
</script>

<template>
  <div id="week" :style="'height: '+props.height+'px'"></div>
</template>

<style scoped lang="scss">

</style>