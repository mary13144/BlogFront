import axiosRequest from "@/service/axiosRequest";
import type {Menu, MenuBrief} from "@/types";

export async function GetMenuDetail(id: number) {
	return await axiosRequest.get<Menu>("/menus/detail", {
		params: {
			id: id
		}
	})
}

export async function GetMenuBrief() {
	return await axiosRequest.get<MenuBrief[]>("/menus/brief", {})
}