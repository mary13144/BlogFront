<script setup lang="ts">
import {reactive, ref} from "vue";
import Admin_table from "@/components/admin/Admin_table.vue";
import Admin_pages from "@/components/admin/Admin_pages.vue";
import type {Page, TableColumn, UserInfo, UserUpdateDate} from "@/types";
import {UserPower} from "@/types";
import {ConsumerDelete, ConsumerQuery, ConsumerUpdate} from "@/api/consumer";
import {ElMessage} from "element-plus";
import Admin_search from "@/components/admin/Admin_search.vue";
//固定参数--------------------------------------------------------------------------
//用户列表表头
const columns: TableColumn[] = [
  {
    title: "ID",
    prop: "id",
  },
  {
    title: "昵称",
    prop: "nick_name",
  },
  {
    title: "头像",
    prop: "avatar",
    avatar: true
  },
  {
    title: "邮箱",
    prop: "email",
  },
  {
    title: "权限",
    prop: "role",
  },
  {
    title: "注册来源",
    prop: "sign_status",
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
    title: "注册时间",
    prop: "date",
  },
  {
    title: "操作",
    prop: "action",
  }
]
//权限列表
const powers = [
  {
    label: "管理员",
    value: UserPower.PermissionAdmin,
  },
  {
    label: "用户",
    value: UserPower.PermissionUser,
  },
  {
    label: "游客",
    value: UserPower.PermissionVisitor,
  },
  {
    label: "被禁用的用户",
    value: UserPower.PermissionDisableUser,
  },
]
//form表单验证规则
const rules = {
  nick_name: [
    {required: true, message: 'Please input nickname', trigger: 'blur'},
    {min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur'},
  ]
}
//响应式变量-------------------------------------------------------------------------
//控制更新用户模态框是否显示
const isShow = ref<boolean>(false)
//更新用户参数原有参数
const userUpdate = ref<UserUpdateDate>({
  user_id: 0,
  nick_name: "",
  role: 1,
})
//分页参数
const page = reactive<Page>({
  page_num: 1,
  page_size: 2,
})
const role = ref(undefined)
//加载用户列表数据
const userData = ref<UserInfo[]>([])
const total = ref<number>(0)
//加载动画
const isLoading = ref<boolean>(false)
//函数--------------------------------------------------------------------------------
//加载用户列表数据
const loadingData = async () => {
  let res = await ConsumerQuery(page, role.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  userData.value = res.data.list
  total.value = res.data.count
}
//更新展示用户信息
const updateShow = (data: UserInfo) => {
  isShow.value = true
  userUpdate.value.user_id = data.id
  userUpdate.value.nick_name = data.nick_name
  userUpdate.value.role = data.role
}
//更新用户信息
const updateData = async () => {
  switch (userUpdate.value.role) {
    case powers[0].label:
      userUpdate.value.role = powers[0].value
      break
    case powers[1].label:
      userUpdate.value.role = powers[1].value
      break
    case powers[2].label:
      userUpdate.value.role = powers[2].value
      break
    case powers[3].label:
      userUpdate.value.role = powers[3].value
      break
  }
  let res = await ConsumerUpdate(userUpdate.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  await loadingData()
  userUpdate.value = {nick_name: "", role: 1, user_id: 0}
  isShow.value = false
}
//删除用户
const deleteData = async (id: number) => {
  let isDelete = await ElMessageBox.confirm(
      "你确认要删除该用户吗？",
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
  let res = await ConsumerDelete(id)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  page.page_num = 1
  await loadingData()
}
//控制是否显示加载动画
const changeIsLoading = () => {
  isLoading.value = !isLoading.value
}
//声明周期钩子函数------------------------------------------------------------------------
loadingData()

</script>

<template>
  <div class="bg">
    <div class="search_wrapper">
      <Admin_search :page="page" @loading-data="loadingData" @change-is-loading="changeIsLoading">
        <el-select v-model="role" @change="loadingData" clearable placeholder="Select" size="large">
          <el-option
              v-for="item in powers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </Admin_search>
    </div>
    <div class="table_wrapper" v-loading="isLoading">
      <Admin_table :columns="columns" :data="userData" :is-loading="isLoading"
                   @update-show="updateShow"
                   @delete-data="deleteData">
        <div class="update">
          <el-dialog
              v-model="isShow"
              title="编辑"
              width="25%"
              draggable
              align-center
          >
            <el-divider border-style="dashed" style="margin: 0 0 10px 0"/>
            <div class="updateMain">
              <el-form
                  :model="userUpdate"
                  :rules="rules"
                  size="default"
                  label-width="80px"
                  status-icon
              >
                <el-form-item label="昵称：" prop="nick_name">
                  <el-input v-model="userUpdate.nick_name" clearable placeholder="请输入用户名"/>
                </el-form-item>
                <el-form-item label="权限：">
                  <el-select v-model="userUpdate.role" placeholder="Select" style="width: 100%">
                    <el-option
                        v-for="item in powers"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <el-divider border-style="dashed" style="margin: 0 0 10px 0"/>
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
      </Admin_table>
    </div>
    <div class="pages_wrapper">
      <Admin_pages :page="page" :total="total" @loading-data="loadingData"></Admin_pages>
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