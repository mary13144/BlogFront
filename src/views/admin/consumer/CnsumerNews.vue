<script setup lang="ts">
import Admin_search from "@/components/admin/Admin_search.vue";
import Admin_table from "@/components/admin/Admin_table.vue";
import Admin_pages from "@/components/admin/Admin_pages.vue";
import type {News, Page, TableColumn} from "@/types";
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {MessageQuery} from "@/api/consumer";
//固定参数---------------------------------------------------------------------
const columns: TableColumn[] = [
  {
    title: "ID",
    prop: "id",
  },
  {
    title: "发送人昵称",
    prop: "send_user_nick_name",
  },
  {
    title: "发送人头像",
    prop: "send_user_avatar",
    avatar: true
  },
  {
    title: "消息内容",
    prop: "content",
  },
  {
    title: "接收人昵称",
    prop: "rev_user_nick_name",
  },
  {
    title: "接收人头像",
    prop: "rev_user_avatar",
    avatar: true
  },
  {
    title: "是否已读",
    prop: "is_read",
  },
  {
    title: "发送时间",
    prop: "date",
  },
]

//响应式变量-------------------------------------------------------------------
const page = reactive<Page>({
  page_num: 1,
  page_size: 2,
})
const newsData = ref<News[]>([])
const total = ref<number>(0)
const isLoading = ref<boolean>(false)
//函数------------------------------------------------------------------------
//加载信息
const loadingData = async () => {
  let res = await MessageQuery(page)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  newsData.value = res.data.list
  total.value = res.data.count
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
      </Admin_search>
    </div>
    <div class="table_wrapper">
      <Admin_table
          :columns="columns"
          :data="newsData"
          :is-loading="isLoading"
      >
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
  overflow-y: auto;

  .table_wrapper {
    margin: 20px 0;
  }
}
</style>