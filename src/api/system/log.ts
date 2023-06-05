import axiosRequest from "@/service/axiosRequest";
import type {Log, Page, PageData} from "@/types";

export async function LogQuery(params: Page, level: number | undefined) {
	return await axiosRequest.get<PageData<Log>>("/logs", {
		params: {
			...params,
			level: level
		}
	})
}

export async function LogDelete(id_list: number[]) {
	return await axiosRequest.delete<string>("/logs", {
		data: {
			id_list: id_list
		}
	})
}