<script setup lang="ts">
import Admin_search from "@/components/admin/Admin_search.vue";
import Admin_table from "@/components/admin/Admin_table.vue";
import Admin_pages from "@/components/admin/Admin_pages.vue";
import type {Page, TableColumn, Video, VideoData} from "@/types";
import {onBeforeMount, reactive, ref} from "vue";
import {VideoCreate, VideoDelete, VideoQuery, VideoUpdate} from "@/api/system";
import {ElMessage, ElMessageBox} from "element-plus";
//固定参数---------------------------------------------------------------------
const columns: TableColumn[] = [
  {
    title: "ID",
    prop: "id",
  },
  {
    title: "影视名称",
    prop: "title",
  },
  {
    title: "影视图片",
    prop: "img",
  },
  {
    title: "链接",
    prop: "href",
  },
  {
    title: "是否显示",
    prop: "is_show",
  },
  {
    title: "创建时间",
    prop: "date",
  },
  {
    title: "操作",
    prop: "action",
  },
]
//响应式变量-------------------------------------------------------------------
const page = reactive<Page>({
  page_num: 1,
  page_size: 6,
})
const videoData = ref<Video[]>([])
const total = ref<number>(0)
const srcList = ref<string[]>([])
const isLoading = ref<boolean>(false)
//是否显示多选删除按钮
const mutiDelete = ref<boolean>(false)
//已选择影视推荐信息
const mutiSelection = ref<number[]>([])
//控制显示编辑模态框
const isShow = ref<boolean>(false)
//控制显示添加模态框
const isAdd = ref<boolean>(false)
//影视推荐更新数据
const videoUpdate = ref<VideoData>({
  id: 0,
  href: "",
  is_show: false,
  path: "",
  title: ""
})
//影视推荐添加数据
const videoCreate = ref<VideoData>({
  id: 0,
  href: "",
  is_show: false,
  path: "",
  title: ""
})
//form表单验证规则
const rules = {
  title: [
    {required: true, message: 'Please input video name', trigger: 'blur'},
    {min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur'},
  ],
  href: [
    {required: true, message: 'Please input video link', trigger: 'blur'},
  ],
  path: [
    {required: true, message: 'Please input video image path', trigger: 'blur'},
  ]
}

//函数------------------------------------------------------------------------
//加载影视推荐信息
const loadingData = async () => {
  let res = await VideoQuery(page)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  videoData.value = res.data.list
  total.value = res.data.count
  srcList.value = []
  for (const video of videoData.value) {
    srcList.value.push(video.path)
  }
}
//删除影视推荐信息
const deleteData = async (ids: number | number[]) => {
  let isDelete = await ElMessageBox.confirm(
      "你确认要删除所选影视推荐信息吗？",
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
  console.log(ids)
  let id_list: number[] = []
  if (typeof ids == "number") {
    id_list.push(ids)
  } else {
    for (const id of ids) {
      id_list.push(id)
    }
  }
  let res = await VideoDelete(id_list)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  page.page_num = 1
  await loadingData()
}
//更新影视推荐信息
const updateData = async () => {
  let res = await VideoUpdate(videoUpdate.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  await loadingData()
  videoUpdate.value = {id: 0, href: "", is_show: false, path: "", title: ""}
  isShow.value = false
}
//添加影视推荐信息
const createData = async () => {
  let res = await VideoCreate(videoCreate.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  await loadingData()
  videoCreate.value = {id: 0, href: "", is_show: false, path: "", title: ""}
  isAdd.value = false
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
//控制显示模态框
//控制显示编辑模版
const updateShow = (data: Video) => {
  isShow.value = true
  videoUpdate.value.title = data.title
  videoUpdate.value.href = data.href
  videoUpdate.value.path = data.path
  videoUpdate.value.is_show = data.is_show
  videoUpdate.value.id = data.id
}

//生命周期钩子函数---------------------------------------------------------------
onBeforeMount(() => {
  loadingData()
})
</script>

<template>
  <div class="bg">
    <div class="add_wrapper">
      <el-dialog
          v-model="isAdd"
          title="更新"
          width="25%"
          draggable
          align-center
      >
        <el-divider border-style="dashed" style="margin: 0 0 10px 0"/>
        <div class="addMain">
          <el-form
              :model="videoCreate"
              :rules="rules"
              size="default"
              label-width="100px"
              status-icon
          >
            <el-form-item label="影视名称：" prop="title">
              <el-input v-model="videoCreate.title"/>
            </el-form-item>
            <el-form-item label="观看链接：" prop="href">
              <el-input v-model="videoCreate.href"/>
            </el-form-item>
            <el-form-item label="图片地址：" prop="path">
              <el-input v-model="videoCreate.path"/>
            </el-form-item>
            <el-form-item label="是否显示：">
              <el-switch v-model="videoCreate.is_show"/>
            </el-form-item>
            <el-form-item label="图片预览：">
              <el-image :src="videoCreate.path" style="width: 120px"/>
            </el-form-item>
          </el-form>
        </div>
        <el-divider border-style="dashed" style="margin: 0 0 10px 0"/>
        <template #footer>
              <span class="dialog-footer">
                <el-button @click="isAdd = false" size="default">Cancel</el-button>
                <el-button type="primary" size="default" @click="createData">
                  OK
                </el-button>
              </span>
        </template>
      </el-dialog>
    </div>
    <div class="search_wrapper">
      <Admin_search :page="page" @loading-data="loadingData" @change-is-loading="changeIsLoading">
      </Admin_search>
    </div>
    <div class="button_wrapper">
      <el-button type="primary" size="large" @click="isAdd = true">添加</el-button>
      <el-button type="danger" v-show="mutiDelete" size="large" @click="deleteData(mutiSelection)">删除</el-button>
    </div>
    <div class="table_wrapper">
      <Admin_table
          :columns="columns"
          :data="videoData"
          :src-list="srcList"
          :is-loading="isLoading"
          :muti-delete="mutiDelete"
          @update-show="updateShow"
          @delete-data="deleteData"
          @muti-delete-show="mutiDeleteShow"
          @muti-change-data="mutiChangeData"
      >
        <template #select>
          <el-table-column type="selection"></el-table-column>
        </template>
        <div class="update">
          <el-dialog
              v-model="isShow"
              title="更新"
              width="25%"
              draggable
              align-center
          >
            <el-divider border-style="dashed" style="margin: 0 0 10px 0"/>
            <div class="updateMain">
              <el-form
                  :model="videoUpdate"
                  :rules="rules"
                  size="default"
                  status-icon
              >
                <el-form-item label="影视名称：" prop="title">
                  <el-input v-model="videoUpdate.title"/>
                </el-form-item>
                <el-form-item label="观看链接：" prop="href">
                  <el-input v-model="videoUpdate.href"/>
                </el-form-item>
                <el-form-item label="图片地址：" prop="path">
                  <el-input v-model="videoUpdate.path"/>
                </el-form-item>
                <el-form-item label="是否显示：">
                  <el-switch v-model="videoUpdate.is_show"/>
                </el-form-item>
                <el-form-item label="图片预览：">
                  <el-image :src="videoUpdate.path" style="width: 120px"/>
                </el-form-item>
              </el-form>
            </div>
            <el-divider border-style="dashed" style="margin: 0 0 10px 0"/>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="isShow = false" size="default">Cancel</el-button>
                <el-button type="primary" size="default" @click="updateData">
                  OK
                </el-button>
              </span>
            </template>
          </el-dialog>
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

  .add_wrapper {
    :deep(.el-dialog__body) {
      padding: 0;
    }

    .addMain {
      padding: 10px 40px;
    }
  }

  .button_wrapper {
    margin: 20px 0;
  }

  .table_wrapper {
    margin: 20px 0;

    .update {
      :deep(.el-dialog__body) {
        padding: 0;
      }

      .updateMain {
        padding: 10px 40px;
      }
    }
  }
}
</style>