import { createRouter, createWebHashHistory } from 'vue-router'
import SignPanel from '@/views/SignPanel.vue'
import LoginPanel from '@/views/LoginPanel.vue'

const routes = [
    {
        path: '/',
        name: 'LoginPanel',
        component: LoginPanel
    },
    {
        path: '/SignPanel',
        name: 'SignPanel',
        component: SignPanel
    }
]

const router = createRouter({
    //history模式：createWebHistory , hash模式：createWebHashHistory
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router
