<script setup lang="ts">
import {useAdminStore} from "@/stores";

const adminStore = useAdminStore()
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item to="/admin">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in adminStore.crumbList">{{ item }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="scss">
:deep(.el-breadcrumb__inner) {
  color: var(--text);
}
</style>