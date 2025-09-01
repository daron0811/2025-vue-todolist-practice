// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'//因為github page 或是靜態伺服器上，建議用#錨點類型
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '首頁' }, // 直接用字串
    },
    {
      path: '/signin',
      name: 'signin',
      component: HomeView,
      meta: { title: '首頁' }, // 直接用字串
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignUpView.vue'),
      meta: { title: '註冊' }, // 直接用字串
    },
    {
      path: '/todoList',
      name: 'todoList',
      component: () => import('../views/TodoListView.vue'),
      meta: { title: '您的代辦清單' }, // 直接用字串
      // children: [　//巢狀路由，有多少就繼續接下去
      //   {
      //     path: '/todoList',
      //     name: 'todoList',
      //     component: () => import('../views/TodoListView.vue'),
      //   }
      // ]
    },
    {
      //404頁面
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { title: '找不到網頁' }, // 直接用字串
    }
  ],
})

// 統一在每次導航後設定頁面標題
router.afterEach((to) => {
  const SITE_NAME = '線上代辦事項服務'
  const nearestWithTitle = [...to.matched].reverse().find(r => r.meta?.title)

  let title = SITE_NAME
  if (nearestWithTitle) {
    const raw = nearestWithTitle.meta.title
    title = typeof raw === 'function' ? raw(to) : raw
  }
  document.title = title ? `${SITE_NAME}｜${title}` : SITE_NAME
})

export default router
