import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/',
    redirect: '/materials',
    component: () => import('@/views/home/HomeView.vue'),
    meta: { requiresAuth: true, title: '首页' },
    children: [
      {
        path: 'materials',
        name: 'Materials',
        component: () => import('@/views/home/MaterialsView.vue'),
        props: route => ({
          page: parseInt(route.query.page) || 1,
          pageSize: parseInt(route.query.pageSize) || 10,
          name: route.query.name || '',
          subject: route.query.subject || '',
          creator: route.query.creator || '',
          tags: route.query.tags ? route.query.tags.split(',') : []
        }),
        meta: { title: '学习资料' }
      },
      {
        path: 'subjects',
        name: 'Subjects',
        component: () => import('@/views/home/SubjectsView.vue'),
        meta: { title: '科目分类' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/home/ProfileView.vue'),
        meta: { title: '个人空间' }
      },
      {
        path: '/space/:spaceId',
        name: 'Space',
        component: () => import('@/views/home/space/SpaceView.vue'),
        meta: { requiresAuth: true, title: '空间详情' },
        children: [
          {
            path: 'folderList/:folderId',
            name: 'FolderList',
            component: () => import('@/views/home/space/FolderListView.vue'),
            props: true,
            meta: { title: '文件夹列表' }
          },
          {
            path: 'preview/:fileId',
            name: 'FilePreview',
            component: () => import('@/views/home/space/FilePreviewView.vue'),
            props: true,
            meta: { title: '文件预览' }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFoundView.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title
  if (to.name === 'Space' && !from.fullPath.includes('/space')) {
    store.commit('setOriginRoute', {
      name: from.name,
      params: from.params,
      query: from.query,
      hash: from.hash,
      fullPath: from.fullPath
    })
  }

  next()
})

export default router
