<script setup lang="ts">
import {reactive, ref} from "vue";
import type {Image, Page, PictureUpdate, Result, TableColumn} from "@/types";
import {ImageType} from "@/types";
import {ImageDelete, ImageQuery, ImageUpdate} from "@/api/imagetext";
import {ElMessage, UploadFile, UploadFiles, UploadUserFile} from "element-plus";
import Table from "@/components/admin/Admin_table.vue";
import Pages from "@/components/admin/Admin_pages.vue";
import SearchInput from "@/components/admin/Admin_search.vue";
import {Plus} from "@element-plus/icons-vue";
//token-----------------------------------------------------------------------------
const token = localStorage.getItem("token");

//固定参数--------------------------------------------------------------------------
//表头
const columns: TableColumn[] = [
  {
    title: "ID",
    prop: "ID",
  },
  {
    title: "图片名称",
    prop: "name",
  },
  {
    title: "图片",
    prop: "path",
    img: true
  },
  {
    title: "图片类型",
    prop: "image_type",
  },
  {
    title: "上传时间",
    prop: "CreateAt",
    date: true
  },
  {
    title: "操作",
    prop: "action",
    option: true
  },
]
//图片类型
const imageTypes = [
  {
    label: "本地",
    value: ImageType.Local,
  },
  {
    label: "七牛云",
    value: ImageType.QiNiu,
  }
]
//响应式变量------------------------------------------------------------------------
const imageData = ref<Image[]>([])
const srcList = ref<string[]>([])
const total = ref<number>(0)
const page = reactive<Page>({
  page_num: 1,
  page_size: 2,
})
const imageUpdate = ref<PictureUpdate>({
  id: 0,
  name: "",
  path: "",
})
const type = ref<number | undefined>(undefined)
const isShow = ref<boolean>(false)
const isLoading = ref<boolean>(false)
//是否显示多选删除按钮
const mutiDelete = ref<boolean>(false)
//已选择图片
const mutiSelection = ref<number[]>([])
//上传图片列表
const fileList = ref<UploadUserFile[]>([])
//是否显示上传图片模态框
const isUpload = ref<boolean>(false)
//预览上传图片
const dialogImageUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
//图片上传dom
const uploadRef = ref<UploadInstance>()
//上传是否完毕
const allUpload = ref<number>(0)
//函数-----------------------------------------------------------------------------
//加载图片数据
const loadingData = async () => {
  let res = await ImageQuery(page, type.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  imageData.value = res.data.list
  total.value = res.data.count
  srcList.value = []
  for (const image of imageData.value) {
    srcList.value.push(image.path)
  }
}
//更新图片名称
const updateData = async () => {
  let res = await ImageUpdate(imageUpdate.value.id, imageUpdate.value.name)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  await loadingData()
  isShow.value = false
}
//删除图片
const deleteData = async (ids: number | number[]) => {
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
  let id_list: number[] = []
  if (typeof ids == "number") {
    id_list.push(ids)
  } else {
    for (const id of ids) {
      id_list.push(id)
    }
  }
  let res = await ImageDelete(id_list)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  page.page_num = 1
  await loadingData()
}
//控制显示编辑模版
const updateShow = (data: Image) => {
  isShow.value = true
  imageUpdate.value.id = data.ID
  imageUpdate.value.name = data.name
  imageUpdate.value.path = data.path
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
const mutiChangeData = (data: Image[]) => {
  mutiSelection.value = []
  for (const item of data) {
    mutiSelection.value.push(item.ID)
  }
}
//上传文件模态框操作函数
const handleRemove = (file: UploadFile) => {
  console.log(fileList.value)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const handlerUpload = async () => {
  uploadRef.value!.submit()
}
//文件上传成功
const handlerSuccess = async (response: Result<string>, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  ElMessage.success(response.data[0].msg)
  allUpload.value += 1
  if (uploadFiles.length == allUpload.value) {
    setTimeout(async () => {
      page.page_num = 1
      page.keyword = ""
      type.value = undefined
      await loadingData()
      uploadRef.value!.clearFiles()
      isUpload.value = false
      allUpload.value = 0
    }, 1000)
  }
}
//文件上传失败
const handlerError = (error: Error) => {
  ElMessage.error(error.message)
}
//声明周期钩子函数------------------------------------------------------------------------
loadingData()
</script>

<template>
  <div class="bg">
    <div class="upload_wrapper">
      <el-dialog v-model="isUpload"
                 class="upload"
                 title="上传图片"
                 width="27%"
                 draggable
                 align-center>
        <el-divider border-style="dashed" style="margin: 0 0 10px 0"/>
        <el-upload action="/api/images"
                   :headers="{Authorization:'Bearer ' + token}"
                   name="images"
                   ref="uploadRef"
                   v-model:file-list="fileList"
                   list-type="picture-card"
                   :auto-upload="false"
                   multiple
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :on-success="handlerSuccess"
                   :on-error="handlerError"
        >
          <el-icon>
            <Plus/>
          </el-icon>
        </el-upload>
        <el-divider border-style="dashed" style="margin: 10px 0 0 0"/>
        <template #footer>
              <span class="dialog-footer">
                <el-button @click="isUpload = false" size="large">Cancel</el-button>
                <el-button type="primary" @click="handlerUpload" size="large">
                  OK
                </el-button>
              </span>
        </template>
      </el-dialog>
      <el-dialog v-model="dialogVisible" width="50%">
        <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%"/>
      </el-dialog>
    </div>
    <div class="search_wrapper">
      <SearchInput :page="page" @loading-data="loadingData" @change-is-loading="changeIsLoading">
        <el-select v-model="type" @change="loadingData" clearable placeholder="Select" size="large">
          <el-option
              v-for="item in imageTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </SearchInput>
    </div>
    <div class="button_wrapper">
      <el-button type="primary" size="large" @click="isUpload = true">添加</el-button>
      <el-button type="danger" v-show="mutiDelete" size="large" @click="deleteData(mutiSelection)">删除</el-button>
    </div>
    <div class="table_wrapper">
      <Table ref="multipleTable"
             :columns="columns"
             :data="imageData"
             :is-loading="isLoading"
             :src-list="srcList"
             :muti-delete="mutiDelete"
             :muti-selection="mutiSelection"
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
            <div class="updateMain">
              <div class="input">
                <span>
                  图片名称：
                </span>
                <el-input
                    v-model="imageUpdate.name"
                    clearable
                    placeholder="请输入图片名称"
                    size="large"
                    style="width: 70%"
                />
              </div>

              <div class="image">
                <span>
                  图片预览：
                </span>
                <el-image
                    style="width: 120px; height: 75px;border-radius: 8px"
                    :src="imageUpdate.path"
                    fit="cover"
                    loading="lazy"
                    lazy
                />
              </div>

            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="isShow = false">取消</el-button>
                <el-button type="primary" @click="updateData">
                  确认
                </el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </Table>
    </div>
    <div class="page_wrapper">
      <Pages :total="total" :page="page" @loading-data="loadingData"></Pages>
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

  .upload_wrapper {
    width: 100%;

    :deep(.upload .el-dialog__body) {
      padding: 10px 20px;
    }
  }

  .button_wrapper {
    margin: 20px 0;
  }

  .table_wrapper {
    margin: 20px 0;

    .update {
      .updateMain {
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .input {
          width: 80%;
          display: flex;
          align-items: center;

          span {
            font-weight: bold;
            margin-right: 10px;
          }
        }

        .image {
          width: 80%;
          display: flex;
          align-items: start;

          span {
            font-weight: bold;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>