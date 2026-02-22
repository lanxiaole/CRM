import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import Layout from '../layouts/Layout.vue'
import DashboardView from '../views/DashboardView.vue'
import CustomerListView from '../views/CustomerListView.vue'
import CustomerDetailView from '../views/CustomerDetailView.vue'
import CustomerFormView from '../views/CustomerFormView.vue'
import UserManageView from '../views/UserManageView.vue'
import RoleManageView from '../views/RoleManageView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'customers',
          name: 'customer-list',
          component: CustomerListView,
        },
        {
          path: 'customers/:id',
          name: 'customer-detail',
          component: CustomerDetailView,
        },
        {
          path: 'customers/form',
          name: 'customer-form',
          component: CustomerFormView,
        },
        {
          path: 'users',
          name: 'user-manage',
          component: UserManageView,
        },
        {
          path: 'roles',
          name: 'role-manage',
          component: RoleManageView,
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
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
