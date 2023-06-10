<script setup lang="ts">
import User from "@/components/User.vue";
import Theme from "@/components/Theme.vue";
import {useBlogStore, useLoginStore} from "@/stores";
import {computed, onMounted, ref, watch} from "vue";
import {debounce} from "@/utils/debounce";
import type {MenuBrief} from "@/types";
import {GetMenuBrief} from "@/api/blog";
import {ElMessage} from "element-plus";

const loginStore = useLoginStore()
const blogStore = useBlogStore()
const isLogin = computed(() => {
  return loginStore.token.user.role == 0
})
const isShow = ref<boolean>(true)
const nav_show = ref<boolean>(false)
const oldScrollTop = ref<number>(0)
const data = ref<MenuBrief[]>([])
const icons = ["icon-shouye", "icon-sousuoleimu"]
const loadingData = async () => {
  let res = await GetMenuBrief()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  data.value = res.data
}
const scrollHandler = debounce(() => {
  const scrollTop = document.body.scrollTop ||
      document.documentElement.scrollTop;
  nav_show.value = scrollTop >= 600;
  isShow.value = !(nav_show.value && scrollTop > oldScrollTop.value);
  oldScrollTop.value = scrollTop
}, 10)
watch(() => blogStore.is_show, () => {
  nav_show.value = blogStore.is_show
  if (blogStore.is_show) {
    window.removeEventListener("scroll", scrollHandler)
  } else {
    window.addEventListener("scroll", scrollHandler)
  }
})
onMounted(() => {
  loadingData()
  window.addEventListener("scroll", scrollHandler)
})
</script>

<template>
  <Transition
      enter-active-class="animate__animated animate__slideInDown animate__faster"
      leave-active-class="animate__animated animate__slideOutUp animate__faster"
  >
    <div v-show="isShow" :class="{nav_container:true,nav_show:nav_show}">
      <div class="left">
        <div class="slogan_wrapper">
          <div class="slogan">
            Thomas的小站
          </div>
        </div>
      </div>
      <div class="right">
        <nav class="right_nav">
          <div class="nav_item" v-for="(item,index) in data">
            <router-link :to="{name:item.path,query:{
              id:item.id
            }}">
              <i :class="'iconfont '+icons[index]"></i>
              {{ item.title }}
            </router-link>
          </div>
          <a href="#">
            <i class="iconfont icon-sousuo" style="font-size: 30px"></i>
          </a>

        </nav>
        <div class="login_wrapper">
          <div class="login" v-if="isLogin">
            <router-link :to="{name:'login',query:{redirect_url:$route.path}}" class="login_link">
              登陆
            </router-link>
          </div>
          <div v-if="!isLogin" class="user_wrapper">
            <User :is-avatar="false" id="user"/>
          </div>
          <div class="theme_wrapper">
            <Theme class="theme"/>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.nav_container {
  position: fixed;
  z-index: 999;
  top: 0;
  width: 100%;
  height: 60px;
  padding: 0 80px;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFFFFF;

  a {
    color: #FFFFFF;

    &:hover {
      color: var(--theme);
    }

    &.router-link-active {
      color: var(--theme);
    }
  }

  .left {
    .slogan_wrapper {
      padding: 5px;
      cursor: pointer;
      transition-duration: .2s;

      .slogan {
        line-height: 18px;
        font-size: 18px;
        font-weight: bold;
      }

      &:hover {
        transform: scale(1.1);
      }
    }

  }

  .right {
    justify-items: flex-end;
    display: flex;

    .right_nav {
      display: flex;
      align-items: center;
      margin-right: 40px;

      .nav_item {
        font-weight: bold;
        letter-spacing: 0.05rem;
        padding: 0.25rem 1rem 0.25rem 0.5rem;
        position: relative;

        &:after {
          content: "";
          position: absolute;
          border-bottom: 2px solid var(--theme);
          left: 51%;
          right: 51%;
          bottom: 0;
          transition: all .2s;
        }

        &:hover:after {
          left: 0;
          right: 0;
        }
      }

      a {
        display: flex;
        align-items: center;
        text-decoration: none;

        i {
          font-size: 20px;
          margin-right: 5px;
        }
      }
    }

    .login_wrapper {
      display: flex;
      align-items: center;
      font-weight: bold;

      .login {
        margin-right: 1rem;

        a {
          text-decoration: none;
        }
      }

      .user_wrapper {
        margin-right: 1rem;

        :deep(.el-dropdown-link) {
          color: #FFFFFF;
        }
      }

      .theme_wrapper {
        .theme {
          font-size: 25px;
        }
      }
    }

  }

  @include respond-to('pad') {
    .right {
      display: none;
    }
  }
  @include respond-to('phone') {
    .right {
      display: none;
    }
  }
}

.nav_show {
  background-color: var(--bg);
  box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
  color: var(--text);

  a {
    color: var(--text);
  }

  #user {
    :deep(.el-dropdown-link) {
      color: var(--text);
    }
  }
}
</style>