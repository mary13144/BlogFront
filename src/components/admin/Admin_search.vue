<script setup lang="ts">
import {ref} from 'vue'
import {Refresh, Search} from "@element-plus/icons-vue";
import type {Page} from "@/types";
import {ElMessage} from "element-plus";
//父组件传入的变量和函数-------------------------------------------------------------
const props = defineProps<{
  page: Page,
}>()
const emits = defineEmits(["loadingData", "changeIsLoading"])
//响应式变量------------------------------------------------------------------------
const inputValue = ref('')
//函数-----------------------------------------------------------------------------
const refreshData = async () => {
  emits("changeIsLoading")
  await emits("loadingData")
  setTimeout(() => {
    emits("changeIsLoading")
    ElMessage.success("刷新成功")
  }, 500)
}
const searchByKey = () => {
  props.page.keyword = inputValue.value.trim()
  props.page.page_num = 1
  emits("loadingData")
  ElMessage.success("搜索成功")
}
</script>

<template>
  <div class="search_wrapper">
    <div class="left">
      <el-input v-model="inputValue" placeholder="Please Input" style="width: 200px" size="large" clearable>
        <template #append>
          <el-button tag="div" size="large" @click="searchByKey">
            <el-icon>
              <Search/>
            </el-icon>
          </el-button>
        </template>
      </el-input>
      <slot></slot>
    </div>
    <div class="right">
      <el-button size="large" @click="refreshData">
        <el-icon size="large">
          <Refresh/>
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search_wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);

  .left {
    width: 40%;
    display: flex;
    justify-content: left;

    .el-input {
      margin-right: 20px;
    }

  }
}

</style>