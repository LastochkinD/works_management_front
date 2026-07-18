import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/works'
    },
    {
      path: '/works',
      name: 'works-list',
      component: () => import('../views/works/WorkList.vue')
    },
    {
      path: '/works/create',
      name: 'work-create',
      component: () => import('../views/works/WorkForm.vue')
    },
    {
      path: '/works/:id',
      name: 'work-edit',
      component: () => import('../views/works/WorkForm.vue')
    },
    {
      path: '/brands',
      name: 'brands-list',
      component: () => import('../views/brands/BrandList.vue')
    },
    {
      path: '/brands/create',
      name: 'brand-create',
      component: () => import('../views/brands/BrandForm.vue')
    },
    {
      path: '/brands/:id',
      name: 'brand-edit',
      component: () => import('../views/brands/BrandForm.vue')
    },
    {
      path: '/models',
      name: 'models-list',
      component: () => import('../views/models/ModelList.vue')
    },
    {
      path: '/models/create',
      name: 'model-create',
      component: () => import('../views/models/ModelForm.vue')
    },
    {
      path: '/models/:id',
      name: 'model-edit',
      component: () => import('../views/models/ModelForm.vue')
    },
    {
      path: '/generations',
      name: 'generations-list',
      component: () => import('../views/generations/GenerationList.vue')
    },
    {
      path: '/generations/create',
      name: 'generation-create',
      component: () => import('../views/generations/GenerationForm.vue')
    },
    {
      path: '/generations/:id',
      name: 'generation-edit',
      component: () => import('../views/generations/GenerationForm.vue')
    },
    {
      path: '/series',
      name: 'series-list',
      component: () => import('../views/series/SeriesList.vue')
    },
    {
      path: '/series/create',
      name: 'series-create',
      component: () => import('../views/series/SeriesForm.vue')
    },
    {
      path: '/series/:id',
      name: 'series-edit',
      component: () => import('../views/series/SeriesForm.vue')
    },
    {
      path: '/modifications',
      name: 'modifications-list',
      component: () => import('../views/modifications/ModificationList.vue')
    },
    {
      path: '/modifications/create',
      name: 'modification-create',
      component: () => import('../views/modifications/ModificationForm.vue')
    },
    {
      path: '/modifications/:id',
      name: 'modification-edit',
      component: () => import('../views/modifications/ModificationForm.vue')
    },
    {
      path: '/standards',
      name: 'standards-list',
      component: () => import('../views/standards/StandardList.vue')
    },
    {
      path: '/standards/create',
      name: 'standard-create',
      component: () => import('../views/standards/StandardForm.vue')
    },
    {
      path: '/standards/:id',
      name: 'standard-edit',
      component: () => import('../views/standards/StandardForm.vue')
    },
    {
      path: '/resolve',
      name: 'resolve',
      component: () => import('../views/ResolvePage.vue')
    }
  ],
})

export default router
