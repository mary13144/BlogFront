import {axiosRequest} from "@/service/axiosRequest";
import type {
	Article,
	EmailUpdate,
	News,
	Page,
	PageData,
	PwdUpdate,
	UserMessage,
	UserPersonalInfo,
	UserUpdateInfo
} from "@/types";

//个人信息查询
export async function UserQuery() {
	return await axiosRequest.get<UserPersonalInfo>("/users/info", {})
}

//个人信息修改
export async function UserUpdate(data: UserUpdateInfo) {
	return await axiosRequest.put<string>("/users/info", data, {})
}

//改绑邮箱
export async function UserEmail(data: EmailUpdate, flag: boolean) {
	return await axiosRequest.post<string>("/users/email", {
		...data,
		flag: flag
	}, {})
}

//修改密码
export async function UserPwd(data: PwdUpdate) {
	return await axiosRequest.put<string>("/users/password", data, {})
}

//我的收藏
export async function UserCollection(page: Page, tag: string, category: string,) {
	return await axiosRequest.get<PageData<Article>>("/articles/collection", {
		params: {
			...page,
			tag: tag,
			category: category,
		}
	})
}


//移除收藏
export async function UserRemoveCollection(id_list: string[]) {
	return await axiosRequest.delete<PageData<Article>>("/articles/collection", {
		data: {
			id_list: id_list
		}
	})
}

//我的消息
export async function NewsQuery() {
	return await axiosRequest.get<UserMessage[]>("/messages/list", {})
}

//消息历史记录
export async function NewsHistory(id: number) {
	return await axiosRequest.post<News[]>("/messages/history", {
		user_id: id
	}, {})
}
