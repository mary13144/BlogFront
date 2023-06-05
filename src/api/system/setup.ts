import axiosRequest from "@/service/axiosRequest";

export async function SetupQuery<T>(name: string) {
	return await axiosRequest.get<T>("/settings", {
		params: {
			name: name
		}
	})
}

export async function SetupUpdate<T>(name: string, data: T) {
	return await axiosRequest.put<string>("/settings", data, {
		params: {
			name: name
		}
	})
}