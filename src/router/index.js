import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import Login from "../views/Login";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/users',
        name: 'Users',
        component: () => import('../views/home/users/Users')
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('../views/home/roles/Roles')
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () => import('../views/home/roles/Rights')
      },
      {
        path: '/goods',
        name: 'Goods',
        component: () => import('../views/home/goods/Goods'),
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('../views/home/goods/Categories')
      },
      {
        path: '/Orders',
        name: 'orders',
        component: () => import('../views/home/orders/Orders')
      },
      {
        path: '/params',
        name: 'Params',
        component: () => import('../views/home/goods/Params')
      },
      {
        path: '/reports',
        name: 'Reports',
        component: () => import('../views/home/reports/Reports')
      },
      {
        path: '/addGoods',
        name: 'AddGoods',
        component: () => import('../views/home/goods/AddGoods')
      },
      {
        path: '/editGoods',
        name: 'EditGoods',
        component: () => import('../views/home/goods/EditGoods')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/showJson',
    name: 'UtilShowJson',
    component: () => import('../components/UtilShowJson')
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach(((to, from, next) => {
  let token = localStorage.getItem('token')
  if (token) {
    if (to.path == '/login') {
      next('/users')
      return
    }
  }
  if (to.path == '/login') {
    next()
  } else {
    if (token) {
      next();
    } else {
      next('/login')
    }
  }
}))
export default router
