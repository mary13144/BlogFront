import {axiosRequest} from "@/service/axiosRequest";
import type {Comment, Page, PageData} from "@/types";

export async function CommentQuery(page: Page) {
	return await axiosRequest.get<PageData<Comment>>("/comments/list", {
		params: {
			...page
		}
	})
}

export async function CommentRemove(id: number) {
	return await axiosRequest.delete<string>("/comments", {
		params: {
			comment_id: id
		}
	})
}