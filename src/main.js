import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import MetaInfo from 'vue-meta-info'



// import store from '@/store/index'
// import request from "@/utils/request";

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.use(MetaInfo)
// app.use(store)
// app.config.globalProperties.$request = request
app.config.globalProperties.$globalData = {}
app.mount('#app')