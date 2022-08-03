import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
// import store from '@/store/index'
// import request from "@/utils/request";

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
// app.use(store)
// app.config.globalProperties.$request = request
app.config.globalProperties.$globalData = {}
app.mount('#app')