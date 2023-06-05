<script setup lang="ts">
import {ArrowDown} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import {useAdminStore, useLoginStore} from "@/stores";
import {onBeforeMount, reactive} from "vue";
import {Tab} from "@/types";
import {Logout} from "@/api/login";

const router = useRouter()
const adminStore = useAdminStore()
const loginStore = useLoginStore()

const dropDown = reactive([
  {
    title: "我的信息",
    name: "user_info",
    parent: "个人中心"
  },
  {
    title: "我的文章",
    name: "user_article",
    parent: "个人中心"
  },
  {
    title: "我的收藏",
    name: "user_collection",
    parent: "个人中心"
  },
  {
    title: "我的消息",
    name: "user_news",
    parent: "个人中心"
  },
])
const dropHandler = (item: Tab) => {
  router.push({
    name: item.name,
    query: {
      title: item.title
    }
  })
  adminStore.addTab(item)
}
const logout = async () => {
  let res = await Logout()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  loginStore.clear()
  await router.push({
    name: "login"
  })
}
onBeforeMount(() => {
  if (loginStore.token.user.role == 1 || loginStore.token.user.role == 3) {
    dropDown.push({
      name: "add_article",
      parent: "个人中心",
      title: "添加文章"
    })
  }
})
</script>

<template>
  <div class="user">
    <div class="avatar">
      <el-avatar
          :src="loginStore.token.user.avatar"/>
    </div>
    <div class="drop">
      <el-dropdown trigger="click" style="cursor: pointer">
                 <span class="el-dropdown-link">
									 {{ loginStore.token.user.nick_name }}
									 <el-icon class="el-icon--right">
										 <arrow-down/>
									 </el-icon>
								 </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="dropHandler(item)" v-for="item in dropDown">{{ item.title }}</el-dropdown-item>
            <el-dropdown-item @click="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user {
  display: flex;
  align-items: center;

  .avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;

    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }
  }
}
</style>