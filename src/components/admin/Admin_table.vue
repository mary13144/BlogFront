<script setup lang="ts">
import {TableColumn} from "@/types";
import {getFormatDateTime} from "@/utils/date";
import {ref} from "vue";
//响应式变量------------------------------------------------------------------
const index = ref<number>(1)
//接收父组件传递的数据----------------------------------------------------------
const props = defineProps<{
  columns: TableColumn[],
  data: any[],
  isLoading: boolean,
  srcList?: string[],
  mutiDelete?: boolean,
}>()
const emits = defineEmits(["deleteData", "updateShow", "mutiDeleteShow", "mutiChangeData"])
//函数------------------------------------------------------------------------
//编辑
const changeData = (data) => {
  emits("updateShow", data)
}
//删除
const deleteItem = async (id: number) => {
  emits("deleteData", id)
}
//多选
const handleSelectionChange = (selection: any[]) => {
  if (selection.length > 0 && !props.mutiDelete) {
    emits("mutiDeleteShow")
  } else if (selection.length == 0) {
    emits("mutiDeleteShow")
  }
  emits("mutiChangeData", selection)
}
const className = function () {
  return 'tableHead'
}

const preview = (start: number) => {
  index.value = start
}
</script>

<template>
  <div class="table_wrapper">
    <el-table v-loading="isLoading"
              element-loading-text="Loading"
              :data="props.data"
              style="width: 100%"
              size="large"
              :header-cell-class-name="className"
              @selection-change="handleSelectionChange"
              max-height="800px">
      <slot name="select"></slot>
      <el-table-column v-for="item in props.columns" :label="item.title" :prop="item.prop" align="center">
        <template #default="scope" v-if="item?.avatar == true ">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-avatar size="large" :src="scope.row.avatar"/>
          </div>
        </template>
        <template #default="scope" v-if="item?.img == true ">
          <div style="display: flex; align-items: center; justify-content: center">
            <el-image
                @click.self="preview(scope.$index)"
                :initial-index="index"
                style="width: 110px; height: 65px;border-radius: 8px"
                :src="scope.row.path"
                fit="cover"
                loading="lazy"
                lazy
                :preview-src-list="props.srcList!"
                preview-teleported
            />
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
  background-color: var(--tableheader) !important;
  color: #1D1D1D;
}
</style>