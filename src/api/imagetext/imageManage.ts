import type {Image, Page, PageData} from "@/types";
import axiosRequest from "@/service/axiosRequest";
// @ts-ignore
import {UploadUserFile} from "element-plus";

//图片查询api
export async function ImageQuery(params: Page, type: number | undefined) {
	return await axiosRequest.get<PageData<Image>>("/images", {
		params: {
			...params,
			type: type
		}
	})
}

//图片名称修改api
export async function ImageUpdate(id: number, name: string) {
	return await axiosRequest.put<string>("/images", {
		id: id,
		name: name,
	}, {})
}

//图片删除api
export async function ImageDelete(id_list: number[]) {
	return await axiosRequest.delete("/images", {
		data: {
			id_list: id_list
		}
	})

}