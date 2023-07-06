<script setup lang="ts">
import Admin_table from "@/components/admin/Admin_table.vue";
import type {ImageBriefData, Menu, MenuData, TableColumn} from "@/types";
import {onBeforeMount, onMounted, ref} from "vue";
import {MenuBanner, MenuCreate, MenuDelete, MenuQuery, MenuUpdate} from "@/api/system";
import {ElMessage, ElMessageBox} from "element-plus";
//固定参数---------------------------------------------------------------------
const columns: TableColumn[] = [
  {
    title: "ID",
    prop: "id",
  },
  {
    title: "标题",
    prop: "title",
  },
  {
    title: "路径",
    prop: "path",
  },
  {
    title: "Slogan",
    prop: "slogan",
  },
  {
    title: "简介",
    prop: "strings",
  },
  {
    title: "Banner切换时间",
    prop: "banner_time",
  },
  {
    title: "序号",
    prop: "sort",
  },
  {
    title: "Banner",
    prop: "banners",
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
//form表单验证规则
const rules = {
  title: [
    {required: true, message: 'Please input video name', trigger: 'blur'},
    {min: 1, max: 10, message: 'Length should be 1 to 10', trigger: 'blur'},
  ],
  path: [
    {required: true, message: 'Please input menu path', trigger: 'blur'},
  ],
}
//响应式变量-------------------------------------------------------------------
const menuData = ref<Menu[]>([])
const imageBrief = ref<ImageBriefData[]>([])
const isLoading = ref<boolean>(false)
//是否显示多选删除按钮
const mutiDelete = ref<boolean>(false)
//已选择菜单信息
const mutiSelection = ref<number[]>([])
//控制显示编辑模态框
const isShow = ref<boolean>(false)
//控制显示添加模态框
const isAdd = ref<boolean>(false)
const abstract = ref<string>("")
const selectList = ref<number[]>([])
//menu信息更新数据
const menuUpdate = ref<MenuData>({
  id: 0,
  abstract: [],
  banner_time: 0,
  image_list: [],
  path: "",
  slogan: "",
  sort: 0,
  title: ""
})
//menu信息添加数据
const menuCreate = ref<MenuData>({
  id: 0,
  abstract: [],
  banner_time: 1,
  image_list: [],
  path: "",
  slogan: "",
  sort: 1,
  title: ""
})


//函数------------------------------------------------------------------------
//加载menu信息
const loadingData = async () => {
  let res = await MenuQuery()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  menuData.value = res.data
}
//删除menu信息
const deleteData = async (ids: number | number[]) => {
  let isDelete = await ElMessageBox.confirm(
      "你确认要删除所选导航栏吗？",
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
  let res = await MenuDelete(id_list)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  await loadingData()
}
//更新menu信息
const updateData = async () => {
  menuUpdate.value.abstract = abstract.value.split("\n")
  let res = await MenuUpdate(menuUpdate.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  await loadingData()
  menuUpdate.value = {
    id: 0,
    abstract: [],
    banner_time: 1,
    image_list: [],
    path: "",
    slogan: "",
    sort: 1,
    title: ""
  }
  isShow.value = false
  console.log(menuUpdate.value)
}
//添加menu信息
const createData = async () => {
  menuCreate.value.abstract = abstract.value.split("\n")
  let res = await MenuCreate(menuCreate.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  await loadingData()
  menuCreate.value = {
    abstract: [],
    banner_time: 1,
    id: 0,
    image_list: [],
    path: "",
    slogan: "",
    sort: 1,
    title: ""
  }
  isAdd.value = false
}
//控制是否显示多选删除按钮
const mutiDeleteShow = () => {
  mutiDelete.value = !mutiDelete.value
}
//改变选中数据
const mutiChangeData = (data: Menu[]) => {
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
const updateShow = (data: Menu) => {
  isShow.value = true
  menuUpdate.value.id = data.id
  menuUpdate.value.title = data.title
  menuUpdate.value.path = data.path
  menuUpdate.value.slogan = data.slogan
  abstract.value = ""
  for (const item of data.abstract) {
    abstract.value += item + '\n'
  }
  menuUpdate.value.banner_time = data.banner_time
  menuUpdate.value.sort = data.sort
  menuUpdate.value.image_list = []
  selectList.value = []
  for (let i = 0; i < data.banners.length; i++) {
    menuUpdate.value.image_list.push({
      image_id: data.banners[i].banner_id,
      sort: i
    })
    selectList.value.push(data.banners[i].banner_id)
  }
}
//控制添加menu信息模态框
const loadingImageBrief = async () => {
  let res = await MenuBanner()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  imageBrief.value = res.data
}

const selectChange = (val: any) => {
  menuCreate.value.image_list = []
  menuUpdate.value.image_list = []
  for (let i = 0; i < selectList.value.length; i++) {
    menuCreate.value.image_list.push({
      image_id: val[i],
      sort: i
    })
    menuUpdate.value.image_list.push({
      image_id: val[i],
      sort: i
    })
  }
}

const addShow = () => {
  isAdd.value = true
  selectList.value = []
  abstract.value = ""
}

//生命周期钩子函数---------------------------------------------------------------
onBeforeMount(()=>{
  loadingData()
  loadingImageBrief()
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
              :model="menuCreate"
              :rules="rules"
              size="default"
              label-width="120px"
              status-icon
          >
            <el-form-item label="标题：" prop="title">
              <el-input v-model.trim="menuCreate.title"/>
            </el-form-item>
            <el-form-item label="路径：" prop="path">
              <el-input v-model.trim="menuCreate.path"/>
            </el-form-item>
            <el-form-item label="Slogan：">
              <el-input v-model.trim="menuCreate.slogan"/>
            </el-form-item>
            <el-form-item label="简介：">
              <el-input v-model.lazy="abstract" type="textarea"/>
            </el-form-item>
            <el-form-item label="Banner时间：" required>
              <el-input-number v-model.number="menuCreate.banner_time" min="1" max="30"/>
            </el-form-item>
            <el-form-item label="序号：" required>
              <el-input-number v-model.number="menuCreate.sort" min="1"/>
            </el-form-item>
            <el-form-item label="Banners：">
              <el-select
                  multiple
                  style="width: 100%"
                  v-model="selectList"
                  @change="selectChange"
              >
                <el-option v-for="data in imageBrief" :key="data.id" :label="data.name" :value="data.id">
                  <div class="content" style="display:flex;align-items: center">
                    <el-image :src="data.path" style="height: 30px;border-radius: 5px;margin-right: 10px"/>
                    <el-text type="primary">{{ data.name }}</el-text>
                  </div>
                </el-option>
              </el-select>
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
    <div class="button_wrapper">
      <el-button type="primary" size="large" @click="addShow">添加</el-button>
      <el-button type="danger" v-show="mutiDelete" size="large" @click="deleteData(mutiSelection)">删除</el-button>
    </div>
    <div class="table_wrapper">
      <Admin_table
          :columns="columns"
          :data="menuData"
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
                  :model="menuUpdate"
                  :rules="rules"
                  size="default"
                  label-width="120px"
                  status-icon
              >
                <el-form-item label="标题：" prop="title">
                  <el-input v-model="menuUpdate.title"/>
                </el-form-item>
                <el-form-item label="路径：" prop="path">
                  <el-input v-model="menuUpdate.path"/>
                </el-form-item>
                <el-form-item label="Slogan：">
                  <el-input v-model="menuUpdate.slogan"/>
                </el-form-item>
                <el-form-item label="简介：">
                  <el-input v-model="abstract" type="textarea"/>
                </el-form-item>
                <el-form-item label="Banner时间：" required>
                  <el-input-number v-model="menuUpdate.banner_time" min="1" max="30"/>
                </el-form-item>
                <el-form-item label="序号：" required>
                  <el-input-number v-model="menuUpdate.sort" min="1"/>
                </el-form-item>
                <el-form-item label="Banners：">
                  <el-select
                      multiple
                      style="width: 100%"
                      v-model="selectList"
                      @change="selectChange"
                  >
                    <el-option v-for="data in imageBrief" :key="data.id" :label="data.name" :value="data.id">
                      <div class="content" style="display:flex;align-items: center">
                        <el-image :src="data.path" style="height: 30px;border-radius: 5px;margin-right: 10px"/>
                        <el-text type="primary">{{ data.name }}</el-text>
                      </div>
                    </el-option>
                  </el-select>
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