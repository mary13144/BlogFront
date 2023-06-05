import type {Page, PageData, UserInfo, UserUpdateDate} from "@/types";
import axiosRequest from "@/service/axiosRequest";

//查询用户列表api
export async function ConsumerQuery(params: Page, role: undefined | number) {
	return await axiosRequest.get<PageData<UserInfo>>("/users", {
		params: {
			...params,
			role: role
		}
	})
}

//删除用户api
export async function ConsumerDelete(id: number) {
	return await axiosRequest.delete<string>("/users", {
		params: {
			id: id
		}
	})
}

//修改用户信息api
export async function ConsumerUpdate(data: UserUpdateDate) {
	return await axiosRequest.put<string>("/users/update", data, {})
}