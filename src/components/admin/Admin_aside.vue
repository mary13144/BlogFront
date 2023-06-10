<script setup lang="ts">
import type {Admin_aside} from "@/types";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import {useDark} from "@vueuse/core";
import {useAdminStore, useLoginStore} from "@/stores";
import {onBeforeMount, reactive, ref} from "vue";
//响应式变量---------------------------------------------------------------------
const isDark = useDark()
const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()
const loginStore = useLoginStore()
const menu = ref()
let open = reactive([])
//函数---------------------------------------------------------------------------
//左侧导航栏数据
const asideAdminData = ref<Admin_aside[]>([
  {
    id: "1",
    icon: "iconfont icon-shouye",
    title: "首页",
    router: "home"
  },
  {
    id: "2",
    icon: "iconfont icon-gerenzhongxin",
    title: "个人中心",
    router: "user",
    children: [
      {
        id: "2-1",
        icon: "iconfont icon-wodexinxi_jibenxinxi",
        title: "我的信息",
        router: "user_info"
      },
      {
        id: "2-2",
        icon: "iconfont icon-wodefabu",
        title: "我的文章",
        router: "user_article"
      },
      {
        id: "2-3",
        icon: "iconfont icon-tianjiawenzhang",
        title: "添加文章",
        router: "add_article"
      },
      {
        id: "2-4",
        icon: "iconfont icon-wodeshoucang",
        title: "我的收藏",
        router: "user_collection"
      },
      {
        id: "2-5",
        icon: "iconfont icon-wodexiaoxi",
        title: "我的消息",
        router: "user_news"
      },
    ]
  },
  {
    id: "3",
    icon: "iconfont icon-tuwenxiangqing",
    title: "图文管理",
    router: "article",
    children: [
      {
        id: "3-1",
        icon: "iconfont icon-wenzhangguanli",
        title: "文章管理",
        router: "article_manage"
      },
      {
        id: "3-2",
        icon: "iconfont icon-tupianguanli1",
        title: "图片管理",
        router: "picture_manage"
      },
      {
        id: "3-3",
        icon: "iconfont icon-menu_plgl",
        title: "评论管理",
        router: "comment_manage"
      },
    ]
  },
  {
    id: "4",
    icon: "iconfont icon-yonghuguanli",
    title: "用户管理",
    router: "consumer",
    children: [
      {
        id: "4-1",
        icon: "iconfont icon-yonghuliebiao",
        title: "用户列表",
        router: "consumer_list"
      },
      {
        id: "4-2",
        icon: "iconfont icon-xiaoxiliebiao",
        title: "消息列表",
        router: "consumer_news"
      },
    ]
  },
  {
    id: "5",
    icon: "iconfont icon-xitong",
    title: "系统管理",
    router: "system",
    children: [
      {
        id: "5-1",
        icon: "iconfont icon-caidan",
        title: "导航栏管理",
        router: "system_menu"
      },
      {
        id: "5-2",
        icon: "iconfont icon-tuijian",
        title: "影视推荐",
        router: "video_recommend"
      },
      {
        id: "5-3",
        icon: "iconfont icon-xitongrizhi",
        title: "系统日志",
        router: "system_log"
      },
      {
        id: "5-4",
        icon: "iconfont icon-xiangmupeizhi",
        title: "项目配置",
        router: "setting",
        children: [
          {
            id: "5-4-1",
            icon: "iconfont icon-wangzhanshezhi",
            title: "系统信息",
            router: "system_web"
          },
          {
            id: "5-4-2",
            icon: "iconfont icon-youxiang",
            title: "邮箱配置",
            router: "system_email"
          },
          {
            id: "5-4-3",
            icon: "iconfont icon-yunshangchuan",
            title: "图片上传",
            router: "system_upload"
          },
          {
            id: "5-4-4",
            icon: "iconfont icon-qitapeizhi",
            title: "其他配置",
            router: "system_other"
          },
        ]
      },
    ]
  },
])

const menuHandler = (route: Admin_aside, parent: Admin_aside | undefined, upper_parent: Admin_aside | undefined) => {
  adminStore.addTab({title: route.title, name: route.router, parent: parent?.title, upper_parent: upper_parent?.title})
  router.push({
    name: route.router,
    query: {
      title: route.title
    }
  })
}

onBeforeRouteUpdate((to, from, next) => {
  loginStore.token.user.role != 2 && menu.value!.open(to.meta.index)
  next()
})
onBeforeMount(() => {
  open = route.meta.open
  if (loginStore.token.user.role == 2) {
    asideAdminData.value = [
      {
        id: "1",
        icon: "iconfont icon-shouye",
        title: "首页",
        router: "home"
      },
      {
        id: "2-1",
        icon: "iconfont icon-wodexinxi_jibenxinxi",
        title: "我的信息",
        router: "user_info"
      },
      {
        id: "2-4",
        icon: "iconfont icon-wodeshoucang",
        title: "我的收藏",
        router: "user_collection"
      },
      {
        id: "2-5",
        icon: "iconfont icon-wodexiaoxi",
        title: "我的消息",
        router: "user_news"
      },
    ]
  }
})
</script>

<template>
  <aside>
    <div class="logo">
      <img v-if="!isDark" src="/resources/image/logo.svg" alt="logo">
      <img v-else src="/resources/image/logoNight.svg" alt="logo">
    </div>
    <div class="menu">
      <el-menu
          ref="menu"
          :default-openeds="open"
          unique-opened
      >
        <template v-for="item in asideAdminData">
          <el-menu-item v-if="item.children == undefined" :index="item.id"
                        @click.self="menuHandler(item,undefined,undefined)">
            <template #title>
              <el-icon>
                <i :class="item.icon"></i>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
          </el-menu-item>
          <el-sub-menu v-else :index="item.id">
            <template #title>
              <el-icon>
                <i :class="item.icon"></i>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-menu-item v-if="subItem.children == undefined" :index="subItem.id"
                            @click="menuHandler(subItem,item,undefined)">
                <template #title>
                  <el-icon>
                    <i :class="subItem.icon"></i>
                  </el-icon>
                  <span>{{ subItem.title }}</span>
                </template>
              </el-menu-item>
              <el-sub-menu v-else :index="subItem.id">
                <template #title>
                  <el-icon>
                    <i :class="subItem.icon"></i>
                  </el-icon>
                  <span>{{ subItem.title }}</span>
                </template>
                <el-menu-item v-for="sub in subItem.children" :index="sub.id"
                              @click="menuHandler(sub,subItem,item)">
                  <template #title>
                    <el-icon>
                      <i :class="sub.icon"></i>
                    </el-icon>
                    <span>{{ sub.title }}</span>
                  </template>
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  </aside>
</template>

<style scoped lang="scss">
aside {
  width: 255px;
  height: 100%;
  background-color: var(--bg);

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90px;
    box-sizing: content-box;
    padding: 20px 0;

    img {
      height: 100%;
    }
  }

  .menu {
    width: 100%;
    color: var(--text);

    .el-menu {
      width: 100%;
      border-right: none;
      color: var(--text);

      .el-sub-menu {
        width: 100%;

        :deep(.el-sub-menu__title) {
          color: var(--text);
        }
      }

      .el-menu-item {
        width: 100%;
        color: var(--text);
      }
    }
  }
}
</style>