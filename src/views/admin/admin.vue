<template>
  <div class="blog_admin">
    <Admin_aside/>
    <div class="main">
      <header>
        <div class="left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item to="/admin">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">个人中心</a></el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="right">
          <div class="icons">
            <i class="iconfont icon-shouye"></i>
            <Theme/>
          </div>
          <UserItem/>
        </div>
      </header>
      <div class="tabs"></div>
      <main>
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Theme from "@/components/Theme.vue";
import Admin_aside from "@/components/admin/Admin_aside.vue";
import UserItem from "@/components/UserItem.vue";
import {computed, inject} from "vue";

const isDark = inject("theme").isDark
const backgroundColor = computed(() => {
  return isDark.value ? "#1F2327" : "#F5F6FA"
})

const headerBackgroundColor = computed(() => {
  return isDark.value ? "#16191C" : "#FFFFFF"
})
</script>

<style scoped lang="scss">

.blog_admin {
  width: 100%;
  display: flex;

  .main {
    width: calc(100% - 255px);
    height: 100vh;

    header {
      padding: 0 20px;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: v-bind(headerBackgroundColor);

      .left {

      }

      .right {
        display: flex;
        align-items: center;

        .icons {
          i {
            font-size: 25px;
            cursor: pointer;
            margin-right: 10px;
          }

          i:hover {
            color: $mainColor;
          }
        }

      }
    }

    .tabs {
      height: 30px;
      border: 1px solid #f0eeee;

    }

    main {
      height: calc(100vh - 90px);
      padding: 30px;
      background-color: v-bind(backgroundColor);
    }
  }
}
</style>