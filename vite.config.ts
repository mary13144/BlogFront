import {fileURLToPath, URL} from 'node:url'
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
// @ts-ignore
export default ({mode}) => {
	const env = loadEnv(mode, process.cwd())
	const baseUrl = env.VITE_API
	return defineConfig({
		envPrefix: ["VITE_"],
		plugins: [
			vue()
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
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