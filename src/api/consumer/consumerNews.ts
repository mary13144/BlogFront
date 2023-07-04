import {axiosRequest} from "@/service/axiosRequest";
import type {News, Page, PageData} from "@/types";

export async function MessageQuery(params: Page) {
	return await axiosRequest.get<PageData<News>>("/messages", {
		params: {
			...params
		}
	})
}