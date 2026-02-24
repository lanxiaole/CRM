import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { ElMessage } from 'element-plus'

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
            breadcrumb: '仪表盘',
            permission: 'dashboard:view',
          },
        },
        {
          path: 'customers',
          name: 'customer-list',
          component: () => import('../views/CustomerListView.vue'),
          meta: {
            breadcrumb: '客户列表',
            permission: 'customer:view',
          },
        },
        {
          path: 'customers/:id',
          name: 'customer-detail',
          component: () => import('../views/CustomerDetailView.vue'),
          meta: {
            breadcrumb: '客户详情',
            permission: 'customer:view',
          },
        },
        {
          path: 'customers/form',
          name: 'customer-form',
          component: () => import('../views/CustomerFormView.vue'),
          meta: {
            breadcrumb: '客户表单',
            permission: 'customer:view',
          },
        },
        {
          path: 'users',
          name: 'user-manage',
          component: () => import('../views/UserManageView.vue'),
          meta: {
            breadcrumb: '用户管理',
            permission: 'user:manage',
          },
        },
        {
          path: 'roles',
          name: 'role-manage',
          component: () => import('../views/RoleManageView.vue'),
          meta: {
            breadcrumb: '角色管理',
            permission: 'role:manage',
          },
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
          meta: {
            breadcrumb: '个人设置',
            permission: 'profile:view',
          },
        },
        {
          path: '403',
          name: 'forbidden',
          component: () => import('../views/ForbiddenView.vue'),
          meta: {
            breadcrumb: '无权限访问',
          },
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

// 全局路由守卫：权限校验
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 登录页直接放行
  if (to.path === '/login') {
    next()
    return
  }

  // 未登录跳转到登录页
  if (!userStore.isLoggedIn) {
    next('/login')
    return
  }

  // 初始化用户信息和权限
  userStore.initUserInfo()

  // 检查是否需要权限
  const requiredPermission = to.meta.permission
  if (requiredPermission) {
    // 检查用户是否有该权限
    if (userStore.permissions.includes(requiredPermission)) {
      next()
    } else {
      ElMessage.error('您没有权限访问该页面')
      next('/403')
    }
  } else {
    // 不需要权限的页面直接放行
    next()
  }
})

export default router
