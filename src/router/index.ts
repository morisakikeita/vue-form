import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from "vue-router";

const routes:Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/contact',
        name: 'Contact',
        component: () => import('../views/Contact.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router