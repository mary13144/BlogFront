<script setup lang="ts">
import {TableColumn} from "@/types";
import {getFormatDateTime} from "@/utils/date";
import {computed, inject} from "vue";
//主题-----------------------------------------------------------------------
const isDark = inject("theme").isDark
const backgroundColor = computed(() => {
  return isDark.value ? "#a6a9ad" : "#409EFF"
})
//响应式变量------------------------------------------------------------------

//接收父组件传递的数据----------------------------------------------------------
const props = defineProps<{
  columns: TableColumn[],
  data: any[],
  isShow: boolean
}>()
const emits = defineEmits(["deleteData", "updateShow"])
const isLoading = inject("loading").isloading
//函数------------------------------------------------------------------------
//编辑
const changeData = (data) => {
  emits("updateShow", data)
}
//删除
const deleteItem = async (id: number) => {
  emits("deleteData", id)
}
const className = function () {
  return 'tableHead'
}
</script>

<template>
  <div class="table_wrapper">
    <el-table v-loading="isLoading" element-loading-text="Loading" :data="props.data" style="width: 100%" size="large"
              :header-cell-class-name="className"
              max-height="800px">
      <el-table-column v-for="item in props.columns" :label="item.title" :prop="item.prop" align="center">
        <template #default="scope" v-if="item?.img == true ">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-avatar size="large" :src="scope.row.avatar"/>
          </div>
        </template>
        <template #default="scope" v-if="item?.date == true">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-tag size="large">{{ getFormatDateTime(scope.row.CreatedAt) }}</el-tag>
          </div>
        </template>
        <template #default="scope" v-if="item.prop == 'action' ">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-button @click="changeData(scope.row)" type="primary" plain>编辑</el-button>
            <el-button @click="deleteItem(scope.row.ID)" type="danger" plain>删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <slot></slot>
  </div>
</template>

<style lang="scss">
.tableHead {
  background-color: v-bind(backgroundColor) !important;
  color: #1D1D1D;
}
</style>