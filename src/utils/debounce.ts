//防抖
//@ts-ignore
import {NodeJS} from 'node:types';

type DebounceFn = (...args: any[]) => void; // 定义防抖函数类型别名

export function debounce(func: DebounceFn, delay: number): DebounceFn {
	let timeoutId: NodeJS.Timeout | undefined; // 定时器标识符，用于存储定时器的引用

	return function (...args: any[]) { // 返回一个新的函数作为防抖函数
		//@ts-ignore
		const context = this; // 保存函数执行时的上下文
		if (timeoutId) {
			clearTimeout(timeoutId); // 清除之前的定时器
		}
		timeoutId = setTimeout(() => { // 设置新的定时器
			func.apply(context, args); // 在指定的上下文中执行传入的函数，传递参数
		}, delay);
	};
}

