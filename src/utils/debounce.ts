//防抖
export function debounce(fn: Function, delay: number) {
	let timer: number;
	return function () {
		if (timer) clearTimeout(timer);
		timer = setTimeout(fn, delay);
	}
}