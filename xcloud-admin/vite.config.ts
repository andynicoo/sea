import { fileURLToPath, URL } from 'url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: loadEnv(mode, process.cwd()).VITE_APP_BASEURL,
    plugins: [
      vue(),
      qiankun('adminNewApp', { useDevMode: true }),
      Pages({
        dirs: 'src/views/module',
        extensions: ['vue'],
        exclude: ['**/components/**'],
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        imports: [
          'vue',
          'vue-router',
          { vue: ['defineModel'] },
          { dayjs: [['default', 'dayjs']] },
          { qs: [['default', 'qs']] },
          { from: '@form-create/ant-design-vue', imports: ['FormRule'], type: true },
          { from: 'ant-design-vue', imports: ['TableColumnsType'], type: true },
        ],
        eslintrc: {
          enabled: true,
        },
        dts: './src/types/auto-imports.d.ts',
        dirs: ['./src/components/page/', './src/composables'],
      }),
      Components({
        dts: './src/types/components.d.ts',
        resolvers: [AntDesignVueResolver()],
        globs: ['src/components/page'],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 8888,
      host: '0.0.0.0',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      // proxy: {
      //   '/api/xcloudtrademarkclient': {
      //     target: 'http://192.168.32.165:8080/',
      //     changeOrigin: true,
      //     rewrite: path => path.replace(/^\/api\/xcloudtrademarkclient/, ''),
      //   },
      // },
    },
  }
})
