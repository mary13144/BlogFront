<script setup lang="ts">
import {ArrowDown} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";

const router = useRouter()
const dropHandler: Function = (command: string | number | object) => {
	if (command === "logout") {
		router.push({
			name: 'login'
		})
	}
}
</script>

<template>
	<div class="user">
		<div class="avatar">
			<el-avatar
					src="http://rtt8g9qfk.hn-bkt.clouddn.com/mwxBlog/20230428200056_beach-2089936.jpg"/>
		</div>
		<div class="drop">
			<el-dropdown trigger="click" style="cursor: pointer" @command="dropHandler">
                 <span class="el-dropdown-link">
									 admin
									 <el-icon class="el-icon--right">
										 <arrow-down/>
									 </el-icon>
								 </span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
						<el-dropdown-item command="usernews">我的消息</el-dropdown-item>
						<el-dropdown-item command="aritcles">文章列表</el-dropdown-item>
						<el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
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