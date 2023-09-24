import {createRouter, createWebHistory} from 'vue-router'
import auth from '@/middleware/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'PLogin',
            meta: {
                layout: 'auth'
            },
            beforeEnter: [auth],
            component: () => import('@/views/PLogin.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            meta: {
                layout: 'error'
            },
            component: () => import('@/layout/LError.vue')
        },
        {
            path: '/customers',
            meta: {
                layout: 'default'
            },
            name: 'PCustomers',
            beforeEnter: [auth],
            component: () => import('@/views/PCustomers.vue'),
        },
        {
            path: '/couriers',
            name: 'PCouriers',
            meta: {
                layout: 'default'
            },
            beforeEnter: [auth],
            component: () => import('@/views/PCouriers.vue')
        },
        {
            path: '/products',
            name: 'PProducts',
            meta: {
                layout: 'default'
            },
            beforeEnter: [auth],
            component: () => import('@/views/PProducts.vue')
        },
        {
            path: '/create',
            name: 'PCreate',
            meta: {
                layout: 'default'
            },
            beforeEnter: [auth],
            component: () => import('@/views/PCreate.vue')
        },
        {
            path: '/orders',
            name: 'POrders',
            meta: {
                layout: 'default'
            },
            beforeEnter: [auth],
            component: () => import('@/views/POrders.vue')
        },
        {
            path: '/stats',
            name: 'PStats',
            meta: {
                layout: 'default'
            },
            beforeEnter: [auth],
            component: () => import('@/views/PStats.vue')
        },
    ]
})

export default router