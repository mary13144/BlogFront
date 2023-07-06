<script setup lang="ts">
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import type {Article, Article_Add, ImageBriefData, Page, Select, TableColumn} from "@/types";
import {ArticleQuery, ArticleQueryCategory, ArticleRemove, ArticleUpdate, TagArticle} from "@/api/imagetext";
import {ElMessage, ElMessageBox} from "element-plus";
import Admin_table from "@/components/admin/Admin_table.vue";
import Admin_pages from "@/components/admin/Admin_pages.vue";
import Admin_search from "@/components/admin/Admin_search.vue";
import Admin_drawer from "@/components/admin/Admin_drawer.vue";
import {MenuBanner} from "@/api/system";
import router from "@/router";
import {useAdminStore} from "@/stores";
//固定参数--------------------------------------------------------------------------
//表头
const columns: TableColumn[] = [
  {
    title: "文章标题",
    prop: "title",
  },
  {
    title: "文章分类",
    prop: "category",
  },
  {
    title: "文章简介",
    prop: "abstract",
  },
  {
    title: "作者",
    prop: "user_nick_name",
  },
  {
    title: "封面",
    prop: "img",
  },
  {
    title: "文章数据",
    prop: "data",
  },
  {
    title: "标签",
    prop: "tags",
  },
  {
    title: "发布时间",
    prop: "date",
  },
  {
    title: "操作",
    prop: "art_action",
  },
]
//响应式变量------------------------------------------------------------------------
const articleData = ref<Article[]>([])
const srcList = ref<string[]>([])
const total = ref<number>(0)
const page = reactive<Page>({
  page_num: 1,
  page_size: 6,
})
const tagSelect = ref<Select[]>([])
const categorySelect = ref<Select[]>([])
const imageBrief = ref<ImageBriefData[]>([])
const tag = ref<string>("")
const category = ref<string>("")
const articleUpdate = ref<Article_Add>({
  abstract: "",
  category: "",
  content: "",
  id: "",
  tags: [],
  title: "",
  banner_id: undefined,
})
const isShow = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const mutiDelete = ref<boolean>(false)
const mutiSelection = ref<string[]>([])
const adminStore = useAdminStore()
//函数-----------------------------------------------------------------------------
//加载表格数据
const loadingData = async () => {
  let res = await ArticleQuery(page, tag.value, category.value, true)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  articleData.value = res.data.list
  total.value = res.data.count
  srcList.value = []
  for (const article of articleData.value) {
    srcList.value.push(article.banner_url)
  }
}

const filterData = () => {
  page.page_num = 1
  loadingData()
}

const loadingTag = async () => {
  let res = await TagArticle()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  tagSelect.value = res.data
}
const loadingCategory = async () => {
  let res = await ArticleQueryCategory()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  categorySelect.value = res.data
}
const loadingImageBrief = async () => {
  let res = await MenuBanner()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  imageBrief.value = res.data
}
//删除文章
const deleteData = async (ids: string | string[]) => {
  let isDelete = await ElMessageBox.confirm(
      "你确认要删除所选图片吗？",
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
  let id_list: string[] = []
  if (typeof ids == "string") {
    id_list.push(ids)
  } else {
    for (const id of ids) {
      id_list.push(id)
    }
  }
  let res = await ArticleRemove(id_list)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  page.page_num = 1
  await loadingData()
}
//控制显示编辑模版
const updateShow = (data: Article) => {
  articleUpdate.value.id = data.id
  articleUpdate.value.title = data.title
  articleUpdate.value.abstract = data.abstract
  articleUpdate.value.category = data.category
  articleUpdate.value.banner_id = data.banner_id
  articleUpdate.value.tags = data.tags
  isShow.value = true
}
//更新文章信息
const confirmClick = async () => {
  let res = await ArticleUpdate(articleUpdate.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  await loadingData()
  articleUpdate.value = {
    abstract: "",
    category: "",
    content: "",
    id: "",
    tags: [],
    title: ""
  }
  isShow.value = false
}
const handlerClose = () => {
  isShow.value = false
}
//更新文章正文
const editorArticle = (id: string) => {
  router.push({
    name: "article_editor",
    params: {
      id: id
    }
  })
  adminStore.addTab({
    title: "编辑文章",
    name: `article_editor`,
    params: {
      id: id
    }
  })
}
//控制是否显示加载动画
const changeIsLoading = () => {
  isLoading.value = !isLoading.value
}
//控制是否显示多选删除按钮
const mutiDeleteShow = () => {
  mutiDelete.value = !mutiDelete.value
}
//改变选中数据
const mutiChangeData = (data: Article[]) => {
  mutiSelection.value = []
  for (const item of data) {
    mutiSelection.value.push(item.id)
  }
}

//声明周期钩子函数------------------------------------------------------------------------
onBeforeMount(() => {
  loadingData()
  loadingTag()
  loadingCategory()
  loadingImageBrief()
})
</script>

<template>
  <div class="bg">
    <div class="search_wrapper">
      <Admin_search :page="page" @loading-data="loadingData" @change-is-loading="changeIsLoading">
        <el-select v-model="tag" @change="filterData" clearable placeholder="Select" size="large">
          <el-option
              v-for="item in tagSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
        <el-select v-model="category" @change="filterData" clearable placeholder="Select" size="large"
                   style="margin-left: 10px">
          <el-option
              v-for="item in categorySelect"
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
      <Admin_table ref="multipleTable"
                   :columns="columns"
                   :data="articleData"
                   :is-loading="isLoading"
                   :src-list="srcList"
                   :muti-delete="mutiDelete"
                   @update-show="updateShow"
                   @delete-data="deleteData"
                   @muti-delete-show="mutiDeleteShow"
                   @muti-change-data="mutiChangeData"
                   @editor-article="editorArticle"
      >
        <template #select>
          <el-table-column type="selection"></el-table-column>
        </template>
        <div class="update">
          <Admin_drawer
              v-if="isShow"
              :is-show="isShow"
              :article="articleUpdate"
              :tag-select="tagSelect"
              :image-brief="imageBrief"
              :category-select="categorySelect"
              @confirmClick="confirmClick"
              @handlerClose="handlerClose"
          ></Admin_drawer>
        </div>
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


  .button_wrapper {
    height: 40px;
    margin: 20px 0;
  }

  .table_wrapper {
    margin: 20px 0;

    .update {

      &:deep(.el-dialog__body) {
        padding: 0;
      }

      .updateMain {
        padding: 10px 40px;
      }
    }
  }
}
</style>