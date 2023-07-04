import {axiosRequest} from "@/service/axiosRequest";
import type {CalenderDate, DataSum, WeekDate} from "@/types";

export async function ArticleCalendar() {
	return await axiosRequest.get<CalenderDate[]>("/articles/calender", {})
}

export async function WeekQuery() {
	return await axiosRequest.get<WeekDate>("/datas/login", {})
}

export async function AllDataSum() {
	return await axiosRequest.get<DataSum>("/datas/data", {})
}