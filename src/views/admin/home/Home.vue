<script setup lang="ts">
import DataSum from "@/components/admin/Admin_dataSum.vue";
import Calendar from "@/components/echarts/Calender.vue";
import Week from "@/components/echarts/Week.vue";
import {onBeforeMount, reactive} from "vue";
import {AllDataSum} from "@/api/home";
import {ElMessage} from "element-plus";

const home_data = reactive({
  article_count: {
    title: "文章总数",
    data: 0,
    icon: "icon-wenzhangguanli",
  },
  user_count: {
    title: "用户总数",
    data: 0,
    icon: "icon-yonghuliebiao",
  },
  now_login_count: {
    title: "今日登陆",
    data: 0,
    icon: "icon-yonghudenglutongjigongju",
  },
  now_sign_count: {
    title: "今日注册",
    data: 0,
    icon: "icon-zhucehuise"
  }
})
const loadingData = async () => {
  let res = await AllDataSum()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  home_data.article_count.data = res.data.article_count
  home_data.user_count.data = res.data.user_count
  home_data.now_login_count.data = res.data.now_login_count
  home_data.now_sign_count.data = res.data.now_sign_count
}
onBeforeMount(() => {
  loadingData()
})
</script>

<template>
  <div class="home_wrapper">
    <div class="data_display">
      <DataSum :title="item.title" :icon="item.icon" :data="item.data" :key="index"
               v-for="(item,index) in home_data"></DataSum>
    </div>
    <div class="charts">
      <div class="left">
        <div class="article_calendar">
          <Calendar :is-title="true"/>
        </div>
      </div>
      <div class="right">
        <div class="login_week">
          <Week></Week>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home_wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  padding: 30px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .data_display {
    display: flex;
    justify-content: space-around;
  }

  .charts {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;

    .left {
      width: 47%;

      .article_calendar {
        background-color: var(--bg);
        padding: 10px 20px;
        border: 1px solid var(--border);
        border-radius: 15px;
      }
    }

    .right {
      width: 47%;

      .login_week {
        background-color: var(--bg);
        padding: 10px 20px;
        border: 1px solid var(--border);
        border-radius: 15px;
      }
    }
  }
}
</style>