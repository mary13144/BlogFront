import {fileURLToPath, URL} from 'node:url'
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import importToCDN from 'vite-plugin-cdn-import'
import {visualizer} from 'rollup-plugin-visualizer'
import viteImagemin from 'vite-plugin-imagemin'
// https://vitejs.dev/config/
// @ts-ignore
export default ({mode}) => {
	const env = loadEnv(mode, process.cwd())
	const baseUrl = env.VITE_API
	return defineConfig({
		envPrefix: ["VITE_"],
		plugins: [
			vue(),
			visualizer(),
			importToCDN({
				modules: [
					{
						name: 'vue',
						var: 'Vue',
						path: '//npm.elemecdn.com/vue@3.3.2/dist/vue.global.prod.js'
					},
					{
						name: 'vue-demi',//安装vue-demi并导入 因为pinia和Element_plus中有用vue依赖中的vue-demi
						var: 'VueDemi',
						path: '//npm.elemecdn.com/vue-demi@0.13.11/lib/index.iife.js'
					},
					{
						name: 'vue-router',
						var: 'VueRouter',
						path: '//npm.elemecdn.com/vue-router@4.2.4/dist/vue-router.global.prod.js'
					},
					{
						name: 'axios',
						var: 'axios',
						path: '//npm.elemecdn.com/axios@0.27.2/dist/axios.min.js',
					},
					{
						name: 'element-plus',
						var: 'ElementPlus',
						path: '//unpkg.com/element-plus',
						css: '//unpkg.com/element-plus/dist/index.css'
					},
					{
						name: 'pinia',
						var: 'Pinia',
						path: '//npm.elemecdn.com/pinia@2.1.4/dist/pinia.iife.prod.js',
					},

					{
						name: 'echarts',
						var: 'echarts',
						path: '//npm.elemecdn.com/echarts@5.4.2/dist/echarts.min.js',
					},
					{
						name: 'md-editor-v3',
						var: 'MdEditorV3',
						path: '//unpkg.com/md-editor-v3@4.2.1/lib/umd/index.js',
						css: '//unpkg.com/md-editor-v3@4.2.1/lib/style.css'
					}
				]
			}),
			viteImagemin({
				gifsicle: {
					optimizationLevel: 7,
					interlaced: false,
				},
				optipng: {
					optimizationLevel: 7,
				},
				mozjpeg: {
					quality: 20,
				},
				pngquant: {
					quality: [0.8, 0.9],
					speed: 4,
				},
				svgo: {
					plugins: [
						{
							name: 'removeViewBox',
						},
						{
							name: 'removeEmptyAttrs',
							active: false,
						},
					],
				},
			}),
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		build: {
			sourcemap: false, // 不生成 source map
			terserOptions: {
				compress: { // 打包时清除 console 和 debug 相关代码
					drop_console: true,
					drop_debugger: true,
				},
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					javascriptEnabled: true,
					additionalData: `@import "@/assets/styles/global.scss";`,
				},
			},
		},
		server: {
			proxy: {
				"/static": {
					target: baseUrl
				},
				"/api": {
					target: baseUrl
				}
			}
		}
	})

}