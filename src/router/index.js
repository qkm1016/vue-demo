import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from '../vuerouter'
import Index from '../views/Index.vue'
// 1. 注册路由插件
Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import(/* webpackChunkName: "blog" */ '../views/Blog.vue')
  },
  {
    path: '/blog/:id',
    name: 'Blog',
    props: true,
    component: () => import(/* webpackChunkName: "blog" */ '../views/Blog.vue')
  },
  {
    path: '/photo',
    name: 'Photo',
    component: () => import(/* webpackChunkName: "photo" */ '../views/Photo.vue')
  }
]
// const routes = [
//   {
//     path: '/',
//     name: 'Layout',
//     component: () => import(/* webpackChunkName: "layout" */ '../components/Layout.vue'),
//     children: [
//       {
//         path: '/blog',
//         name: 'Blog',
//         component: () => import(/* webpackChunkName: "blog" */ '../views/Blog.vue')
//       },
//       {
//         path: '/blog/:id',
//         name: 'Blog',
//         props: true,
//         component: () => import(/* webpackChunkName: "blog" */ '../views/Blog.vue')
//       },
//       {
//         path: '/photo',
//         name: 'Photo',
//         component: () => import(/* webpackChunkName: "photo" */ '../views/Photo.vue')
//       }
//     ]
//   },
//   {
//     path: '/login',
//     name: 'Login',
//     component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue')
//   },
//   {
//     path: '*',
//     name: '404',
//     component: () => import(/* webpackChunkName: "Login" */ '../views/404.vue')
//   }
// ]
// 2. 创建 router 对象
// const router = new VueRouter({
//   path: '/',
//   component: () => import(/* webpackChunkName: "layout" */ '../components/Layout.vue'),
//   routes
// })
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
