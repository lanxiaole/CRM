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
          meta: {
            breadcrumb: '仪表盘'
          }
        },
        {
          path: 'customers',
          name: 'customer-list',
          component: () => import('../views/CustomerListView.vue'),
          meta: {
            breadcrumb: '客户列表'
          }
        },
        {
          path: 'customers/:id',
          name: 'customer-detail',
          component: () => import('../views/CustomerDetailView.vue'),
          meta: {
            breadcrumb: '客户详情'
          }
        },
        {
          path: 'customers/form',
          name: 'customer-form',
          component: () => import('../views/CustomerFormView.vue'),
          meta: {
            breadcrumb: '客户表单'
          }
        },
        {
          path: 'users',
          name: 'user-manage',
          component: () => import('../views/UserManageView.vue'),
          meta: {
            breadcrumb: '用户管理'
          }
        },
        {
          path: 'roles',
          name: 'role-manage',
          component: () => import('../views/RoleManageView.vue'),
          meta: {
            breadcrumb: '角色管理'
          }
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
          meta: {
            breadcrumb: '个人设置'
          }
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

// 全局前置守卫
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
