export const routes = [
  {
    //登录
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },

  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/mainViews/Home.vue')
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('../views/mainViews/Menu.vue')
      },
      {
        path: 'shopbag',
        name: 'Shopbag',
        component: () => import('../views/mainViews/Shopbag.vue')
      },
      {
        path: 'my',
        name: 'My',
        component: () => import('../views/mainViews/My.vue')
      },
    ]
  },

  {
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/Detail.vue')
  },

  {
    path: '/pay',
    name: 'Pay',
    component: () => import('../views/Pay.vue')
  },

  {
    path: '/newAddress',
    name: 'NewAddress',
    component: () => import('../views/NewAddress.vue')
  },

  {
    path: '/address',
    name: 'Address',
    component: () => import('../views/Address.vue')
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/Account.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order.vue')
  },

  {
    path: '/like',
    name: 'Like',
    component: () => import('../views/Like.vue')
  },

  {
    path: '/secure',
    name: 'Secure',
    component: () => import('../views/Secure.vue')
  },

  {
    path: '/forgot',
    name: 'Forgot',
    component: () => import('../views/Forgot.vue')
  },

  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  
  {
    path: '*',
    redirect: {
      name: 'Home'
    }
  }
]