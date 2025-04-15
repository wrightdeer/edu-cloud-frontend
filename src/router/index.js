import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/materials',
    component: () => import('@/views/home/HomeView.vue'),
    meta: { requiresAuth: true },
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
        })
      },
      {
        path: 'subjects',
        name: 'Subjects',
        component: () => import('@/views/home/SubjectsView.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/home/ProfileView.vue')
      },
      {
        path: '/space/:spaceId',
        component: () => import('@/views/home/space/SpaceView.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: 'folderList/:folderId',
            name: 'FolderList',
            component: () => import('@/views/home/space/FolderListView.vue'),
            props: true
          },
          {
            path: 'preview/:fileId',
            name: 'FilePreview',
            component: () => import('@/views/home/space/FilePreviewView.vue'),
            props: true
          }
        ]
      }
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFoundView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
