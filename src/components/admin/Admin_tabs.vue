<script setup lang="ts">
import {useAdminStore} from "@/stores";
import {useRoute, useRouter} from "vue-router";
import type {Tab} from "@/types";

const adminStore = useAdminStore()
const route = useRoute()
const router = useRouter()
//函数--------------------------------------------------------------------
//点击tab跳转对应页面
const skipView = (item: Tab) => {
  if (item.name != 'home') {
    //面包屑
    let crumb: string[] = []
    if (item.upper_parent) {
      crumb.push(item.upper_parent)
    }
    if (item.parent) {
      crumb.push(item.parent)
    }
    crumb.push(item.title)
    adminStore.setCrumbs(crumb)
  }
  //路由跳转
  router.push({
    name: item.name,
    params: {
      ...item.params
    },
    query: {
      title: item.title
    }
  })
}
//点击删除对应的tab
const deleteTab = (tab: Tab) => {
  let index = adminStore.removeTab(tab)
  //说明删除的是当前页面,跳转到前一个页面
  if (route.name == tab.name) {
    let crumb: string[] = []
    if (adminStore.tabList[index - 1].upper_parent) {
      crumb.push(adminStore.tabList[index - 1].upper_parent!)
    }
    if (adminStore.tabList[index - 1].parent) {
      crumb.push(adminStore.tabList[index - 1].parent!)
    }
    crumb.push(adminStore.tabList[index - 1].title)
    adminStore.setCrumbs(crumb)
    router.push({
      name: adminStore.tabList[index - 1].name,
      params: {
        ...adminStore.tabList[index - 1].params
      },
      query: {
        title: adminStore.tabList[index - 1].title
      }
    })
  }
}
//删除所有tab
const deleteAll = () => {
  adminStore.removeAll()
  router.push({
    name: 'home',
    query: {
      title: "首页"
    }
  })
}

</script>

<template>
  <div class="tabs">
    <el-tag
        class="tabItem"
        v-for="(item,index) in adminStore.tabList"
        @click="skipView(item)"
        @close="deleteTab(item)"
        :closable="item.name!='home'"
        :effect="route.name == item.name?'dark':'light'"
        size="default"
        :key="index">
      {{ item.title }}
    </el-tag>
    <el-tag
        class="tabRemove"
        type="danger"
        effect="dark"
        size="default"
        @click="deleteAll">
      全部关闭
    </el-tag>
  </div>
</template>

<style scoped lang="scss">
.tabs {
  height: 30px;
  min-width: 1000px;
  width: 100%;
  background-color: var(--bg);
  border-width: 1px 0 1px 0;
  border-style: solid;
  border-color: var(--border);
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 0 20px;

  .tabItem {
    margin-right: 10px;
    cursor: pointer;
  }

  .tabRemove {
    margin-left: auto;
    cursor: pointer;
  }
}
</style>