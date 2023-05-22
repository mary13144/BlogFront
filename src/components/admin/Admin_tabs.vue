<script setup lang="ts">
import {useAdminStore} from "@/stores";
import {useRoute, useRouter} from "vue-router";
import type {Tab} from "@/types";
import {computed} from "vue";

const adminStore = useAdminStore()
const route = useRoute()
const router = useRouter()
const isDisable = computed(() => {
  return adminStore.tabList.length == 1
})
//函数--------------------------------------------------------------------
//判断是否是当前被选中的tab
const isActive = (path: string): string => {
  let res = "tabItem"
  if (path == route.name) {
    res += " active"
  }
  return res
}
//点击tab跳转对应页面
const skipView = (path: string) => {
  console.log("------------------")
  router.push({
    name: path
  })
  console.log("------------------")
}
//点击删除对应的tab
const deleteTab = (tab: Tab) => {
  let index = adminStore.removeTab(tab)
  //说明删除的是当前页面,跳转到前一个页面
  if (route.name == tab.name) {
    router.push({
      name: adminStore.tabList[index - 1].name
    })
  }
}
//删除所有tab
const deleteAll = () => {
  adminStore.removeAll()
  router.push({
    name: 'home'
  })
}

</script>

<template>
  <div class="tabs">
    <div @click="skipView(item.name)" :class="isActive(item.name)" v-for="(item,index) in adminStore.tabList"
         :key="index">
      {{ item.title }}
      <span v-if="item.name!='home'" @click.stop="deleteTab(item)" class="icon_remove">×</span>
    </div>
    <div @click="deleteAll" class="tabItem remove_all">
      全部关闭
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabs {
  height: 30px;
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
    background-color: var(--bg);
    border: 1px solid var(--border);
    font-size: 14px;
    padding: 4px 10px;
    color: var(--text);
    display: flex;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;

    &.active {
      background-color: var(--active);
      border: none;
      padding: 5px 10px;

      &::before {
        display: block;
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: white;
        margin-right: 5px;
      }
    }

    .icon_remove {
      display: block;
      width: 12px;
      height: 12px;
      line-height: 12px;
      text-align: center;
      margin-left: 10px;
      border-radius: 50%;

      &:hover {
        background-color: #f0eeee;
        opacity: 0.5;
      }
    }

    &.remove_all {
      margin-left: auto;

      &:hover {
        background-color: #F56C6C;
        color: #FFFFFF;
      }
    }

  }
}
</style>