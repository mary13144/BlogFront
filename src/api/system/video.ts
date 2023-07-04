import {axiosRequest} from "@/service/axiosRequest";
import type {Page, PageData, Video, VideoData} from "@/types";

//查询影视推荐信息
export async function VideoQuery(params: Page) {
	return await axiosRequest.get<PageData<Video>>("/videos", {
		params: {
			...params
		}
	})
}

//删除影视推荐信息
export async function VideoDelete(id_list: number[]) {
	return await axiosRequest.delete<string>("/videos", {
		data: {
			id_list: id_list
		}
	})
}

//更新影视推荐信息
export async function VideoUpdate(data: VideoData) {
	return await axiosRequest.put<string>("videos", data, {
		params: {
			id: data.id
		}
	})
}

//新增影视推荐信息
export async function VideoCreate(data: VideoData) {
	return await axiosRequest.post<string>("videos", data, {})
}