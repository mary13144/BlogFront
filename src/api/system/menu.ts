import {axiosRequest} from "@/service/axiosRequest";
import type {ImageBriefData, Menu, MenuData} from "@/types";

//查询menu菜单
export async function MenuQuery() {
	return await axiosRequest.get<Menu[]>("/menus", {})
}

//创建menu菜单
export async function MenuCreate(data: MenuData) {
	return await axiosRequest.post<string>("/menus", data, {})
}

//查询Banner信息
export async function MenuBanner() {
	return await axiosRequest.get<ImageBriefData[]>("/images/brief", {})
}

//更新menu
export async function MenuUpdate(data: MenuData) {
	return await axiosRequest.put<string>("/menus", data, {
		params: {
			id: data.id
		}
	})
}

//删除menu
export async function MenuDelete(id_list: number[]) {
	return await axiosRequest.delete("/menus", {
		data: {
			id_list: id_list
		}
	})
}