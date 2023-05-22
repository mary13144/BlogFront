<template>
  <div class="blog_admin">
    <div class="left_wrapper">
      <Admin_aside/>
    </div>
    <div class="right_wrapper">
      <header>
        <div class="left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item to="/admin">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
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
      <admin_tabs></admin_tabs>
      <main>
        <router-view v-slot="{Component}">
          <transition name="fade" mode="out-in">
            <component :is="Component"/>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Theme from "@/components/Theme.vue";
import Admin_aside from "@/components/admin/Admin_aside.vue";
import UserItem from "@/components/User.vue";
import Admin_tabs from "@/components/admin/Admin_tabs.vue";
</script>

<style scoped lang="scss">
.blog_admin {
  width: 100%;
  display: flex;

  .left_wrapper {

  }

  .right_wrapper {
    width: calc(100% - 255px);
    height: 100vh;

    header {
      padding: 0 20px;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: var(--bg);
      color: var(--text);

      .left {
        :deep(.el-breadcrumb__inner) {
          color: var(--text);
        }
      }

      .right {
        display: flex;
        align-items: center;

        .icons {
          i {
            font-size: 25px;
            cursor: pointer;
            margin-right: 10px;
            color: var(--icon);
          }

          i:hover {
            color: var(--theme);
          }
        }

      }
    }


    main {
      height: calc(100vh - 90px);
      padding: 30px;
      background-color: var(--main_bg);
    }
  }
}

//过渡动画
.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.fade-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-active {
  transition: all 0.5s ease-out;
}

.fade-enter-active {
  transition: all 0.5s ease-in;
}
</style>