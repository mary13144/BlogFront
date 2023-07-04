<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {MenuBrief} from "@/types";
import {GetMenuBrief} from "@/api/blog";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import Blog_user from "@/components/blog/Blog_user.vue";

const isShow = ref<boolean>(false)
const data = ref<MenuBrief[]>([])
const icons = ["icon-shouye", "icon-sousuoleimu"]
const router = useRouter()
const loadingData = async () => {
  let res = await GetMenuBrief()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  data.value = res.data
}

onMounted(() => {
  loadingData()
})
</script>

<template>
  <div class="blog_menu">
    <div :class="{'menu':true,'active':isShow,'notActive':!isShow}" @click="isShow = !isShow">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <el-drawer
        v-model="isShow"
        class="menu_body"
        direction="rtl"
        lock-scroll
        size="45%"
    >
      <div class="menu_item" v-for="(item,index) in data" @click="isShow = false">
        <router-link :to="{name:item.path,query:{
              id:item.id
            }}">
          <i :class="'iconfont '+icons[index]"></i>
          {{ item.title }}
        </router-link>
      </div>
      <Blog_user :is_article="false"/>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.blog_menu {
  display: flex;
  justify-content: left;
  align-items: center;
  cursor: pointer;
  height: 18px;
  width: 18px;

  .menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    position: relative;

    > div {
      height: 10%;
      background-color: var(--text);
    }
  }

  .active {
    > div {
      background-color: var(--theme);
      position: absolute;
      animation-fill-mode: forwards;
      animation-duration: 0.2s;

      &:first-child {
        animation-name: menuActive1;
      }

      &:nth-child(2) {
        animation-name: menuActive2;
      }

      &:last-child {
        animation-name: menuActive3;
      }
    }
  }

  .notActive {
    &:hover {
      > div:first-child {
        width: 75%;
        background-color: var(--theme);
      }

      > div:nth-child(2) {
        width: 100%;
        background-color: var(--theme);
      }

      > div:last-child {
        width: 50%;
        background-color: var(--theme);
      }
    }

    > div {
      transition: width .2s;
      animation-duration: 0.2s;

      &:first-child {
        width: 100%;
        animation-name: menuActive4;
      }

      &:nth-child(2) {
        width: 50%;
        animation-name: menuActive5;
      }

      &:last-child {
        width: 75%;
        animation-name: menuActive6;
      }
    }
  }

  :deep(.menu_body) {
    background-color: var(--bg);

    .menu_item {
      font-size: 20px;
      height: 40px;
      font-weight: bold;
      margin: 20px 40px;
      display: flex;
      align-items: center;

      a {
        color: var(--text_light);
        text-decoration: none;

        &:hover {
          color: var(--theme);
        }

        &.router-link-active {
          color: var(--theme);
        }
      }

      i {
        font-size: 25px;
      }
    }

    @include respond-to('phone') {
      width: 100% !important;
    }
  }
}

$top: 9px;
@keyframes menuActive1 {
  0% {
    width: 100%;
    top: $top;
  }
  to {
    width: 100%;
    top: $top;
    transform: rotateZ(225deg);
  }
}

@keyframes menuActive2 {
  0% {
    width: 100%;
    top: $top;
  }
  to {
    width: 0;
    top: $top;
  }
}

@keyframes menuActive3 {
  0% {
    width: 100%;
    top: $top;
  }
  to {
    width: 100%;
    top: $top;
    transform: rotateZ(315deg);
  }
}

@keyframes menuActive4 {
  from {
    width: 100%;
    top: $top;
    transform: rotateZ(225deg);
  }
  to {

  }
}

@keyframes menuActive5 {
  from {
    width: 0;
    top: $top;
  }
  to {

  }
}

@keyframes menuActive6 {
  from {
    width: 100%;
    top: $top;
    transform: rotateZ(315deg);
  }
  to {

  }
}
</style>