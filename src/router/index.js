import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'layout',
      component: () => import('../layouts/Layout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'customers',
          name: 'customer-list',
          component: () => import('../views/CustomerListView.vue'),
        },
        {
          path: 'customers/:id',
          name: 'customer-detail',
          component: () => import('../views/CustomerDetailView.vue'),
        },
        {
          path: 'customers/form',
          name: 'customer-form',
          component: () => import('../views/CustomerFormView.vue'),
        },
        {
          path: 'users',
          name: 'user-manage',
          component: () => import('../views/UserManageView.vue'),
        },
        {
          path: 'roles',
          name: 'role-manage',
          component: () => import('../views/RoleManageView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
        },
      ],
    },
  ],
})

// 全局前置守卫 - Vue Router 官方推荐写法（v4+ 支持返回值模式）
router.beforeEach((to, from) => {
  const isLoggedIn = !!localStorage.getItem('token')

  // 已登录状态下访问登录页，跳回来源页或首页
  if (to.path === '/login' && isLoggedIn) {
    return from.path !== '/login' ? from.path : '/'
  }

  // 未登录访问非登录页，跳转到登录页
  if (!isLoggedIn && to.path !== '/login') {
    return '/login'
  }

  return true
})

export default router
