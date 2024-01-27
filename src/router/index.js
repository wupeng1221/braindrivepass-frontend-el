import Vue from 'vue'
import VueRouter from 'vue-router'

// 解决重复点击报错bug
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'outer_occupation',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login_view.vue')
    }, {
        path: '/forget_password',
        name: 'forget_password',
        component: () => import('@/views/forget_password.vue')
    }, {
        path: '/user_registry',
        name: 'UserRegistry',
        component: () => import('@/views/user_registry.vue')
    }, {
        path: '/menu',
        name: '',
        redirect: '/order',
        component: () => import('@/views/inner/layout_view.vue'),
        children: [
            {
                path: '/order',
                name: '顺序练习',
                component: () => import('@/views/inner/order_view.vue')
            }, {
                path: '/random',
                name: '随机练习',
                component: () => import('@/views/inner/random_view.vue')
            }, {
                path: '/exam',
                name: '模拟考试',
                component: () => import('@/views/inner/exam_view.vue')
            }, {
                path: '/stats',
                name: '考试记录',
                component: () => import('@/views/inner/exam_stats.vue')
            }, {
                path: '/wrong',
                name: '错题页',
                component: () => import('@/views/inner/wrong_view/wrong_layout.vue'),
                children: [
                    {
                        path: '/wrong/empty',
                        name: '无错题记录',
                        component: () => import('@/views/inner/wrong_view/wrong_empty.vue')
                    }, {
                        path: '/wrong/not_empty',
                        name: '错题记录',
                        component: () => import('@/views/inner/wrong_view/wrong_not_empty.vue')
                    }
                ]
            }, {
                path: '/fav',
                name: '收藏页',
                component: () => import('@/views/inner/fav_view/fav_layout.vue'),
                children: [
                    {
                        path: '/fav/empty',
                        name: '无收藏记录',
                        component: () => import('@/views/inner/fav_view/fav_empty.vue')
                    }, {
                        path: '/fav/not_empty',
                        name: '收藏记录',
                        component: () => import('@/views/inner/fav_view/fav_not_empty.vue')
                    }
                ]
            },

        ]
    }, {
        path: "/400",
        name: "400",
        component: () => import('@/views/status/400_page.vue')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/status/404_page.vue')
    }, {
        path: '/401',
        name: '401',
        component: () => import('@/views/status/401_page.vue')
    }, {
        path: '/500',
        name: '500',
        component: () => import('@/views/status/500_page.vue')
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/fav' && (from.path === '/fav/empty' || from.path === '/fav/not_empty') ||
        to.path === '/wrong' && (from.path === '/wrong/empty' || from.path === '/wrong/not_empty')) {
        next(false)
    } else {
        next();
    }
});

export default router
