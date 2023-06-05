<script setup lang="ts">
import Admin_search from "@/components/admin/Admin_search.vue";
import Admin_table from "@/components/admin/Admin_table.vue";
import Admin_pages from "@/components/admin/Admin_pages.vue";
import type {Log, Page, TableColumn, Video} from "@/types";
import {LogTypes} from "@/types";
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {LogDelete, LogQuery} from "@/api/system";
//固定参数---------------------------------------------------------------------
const columns: TableColumn[] = [
  {
    title: "ID",
    prop: "id",
  },
  {
    title: "ip",
    prop: "ip",
  },
  {
    title: "地址",
    prop: "addr",
  },
  {
    title: "Level",
    prop: "level",
  },
  {
    title: "内容",
    prop: "content",
  },
  {
    title: "日志记录时间",
    prop: "date",
  },
  {
    title: "操作",
    prop: "delete",
  },
]
//日志类型
const logTypes = [
  {
    label: "debug",
    value: LogTypes.debug,
  },
  {
    label: "info",
    value: LogTypes.info,
  },
  {
    label: "warn",
    value: LogTypes.warn,
  },
  {
    label: "error",
    value: LogTypes.error,
  }
]
//响应式变量-------------------------------------------------------------------
const page = reactive<Page>({
  page_num: 1,
  page_size: 2,
})
const level = ref<number | undefined>(undefined)
const LogData = ref<Log[]>([])
const total = ref<number>(0)
const isLoading = ref<boolean>(false)
//是否显示多选删除按钮
const mutiDelete = ref<boolean>(false)
//已选择影视推荐信息
const mutiSelection = ref<number[]>([])


//函数------------------------------------------------------------------------
//加载日志信息
const loadingData = async () => {
  let res = await LogQuery(page, level.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  LogData.value = res.data.list
  total.value = res.data.count
}
//删除日志信息
const deleteData = async (ids: number | number[]) => {
  let isDelete = await ElMessageBox.confirm(
      "你确认要删除所日志信息吗？",
      "Warning",
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
  )
  if (isDelete.action == 'close' || isDelete.action == 'cancel') {
    return
  }
  let id_list: number[] = []
  if (typeof ids == "number") {
    id_list.push(ids)
  } else {
    for (const id of ids) {
      id_list.push(id)
    }
  }
  let res = await LogDelete(id_list)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  page.page_num = 1
  await loadingData()
}


//控制是否显示多选删除按钮
const mutiDeleteShow = () => {
  mutiDelete.value = !mutiDelete.value
}
//改变选中数据
const mutiChangeData = (data: Video[]) => {
  mutiSelection.value = []
  for (const item of data) {
    mutiSelection.value.push(item.id)
  }
}
//控制是否显示加载动画
const changeIsLoading = () => {
  isLoading.value = !isLoading.value
}


//生命周期钩子函数---------------------------------------------------------------
onMounted(() => {
  loadingData()
})
</script>

<template>
  <div class="bg">
    <div class="search_wrapper">
      <Admin_search :page="page" @loading-data="loadingData" @change-is-loading="changeIsLoading">
        <el-select v-model="level" @change="loadingData" clearable placeholder="Select" size="large">
          <el-option
              v-for="item in logTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </Admin_search>
    </div>
    <div class="button_wrapper">
      <el-button type="danger" v-show="mutiDelete" size="large" @click="deleteData(mutiSelection)">删除</el-button>
    </div>
    <div class="table_wrapper">
      <Admin_table
          :columns="columns"
          :data="LogData"
          :is-loading="isLoading"
          :muti-delete="mutiDelete"
          @delete-data="deleteData"
          @muti-delete-show="mutiDeleteShow"
          @muti-change-data="mutiChangeData"
      >
        <template #select>
          <el-table-column type="selection"></el-table-column>
        </template>
      </Admin_table>
    </div>
    <div class="page_wrapper">
      <Admin_pages :total="total" :page="page" @loading-data="loadingData"></Admin_pages>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  padding: 30px;
  border-radius: 15px;
  position: relative;
  overflow-y: auto;

  .button_wrapper {
    position: absolute;
    left: 30px;
    margin: 20px 0;
  }

  .table_wrapper {
    margin-top: 80px;
    margin-bottom: 20px;
  }
}
</style>