<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHierarchyStore } from '@/stores/hierarchy'
import { useNotifications } from '@/composables/useNotifications'
import AppPageHeader from '@/components/AppPageHeader.vue'
import { models, brands } from '@/api'

const router = useRouter()
const route = useRoute()
const hierarchyStore = useHierarchyStore()
const { success, error } = useNotifications()

const selectedBrandId = ref<number | null>(null)

// Initialize brands and models
onMounted(() => {
  hierarchyStore.fetchBrands()
  
  const brandId = route.query.brand_id ? Number(route.query.brand_id) : null
  if (brandId) {
    selectedBrandId.value = brandId
    hierarchyStore.fetchModels(brandId)
  }
})

watch(selectedBrandId, (newBrandId) => {
  if (newBrandId) {
    hierarchyStore.fetchModels(newBrandId)
  }
})

const handleEdit = (id: number) => {
  router.push(`/models/${id}`)
}

const handleGenerations = (id: number) => {
  router.push(`/generations?model_id=${id}`)
}

const handleDelete = async (id: number) => {
  try {
    await models.remove(id)
    success('Модель успешно удалена')
    hierarchyStore.models = hierarchyStore.models.filter(m => m.id !== id)
  } catch (err: any) {
    error(err.message || 'Ошибка при удалении модели')
  }
}

const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: 'Наименование', key: 'name' },
  { 
    title: 'Бренд', 
    key: 'brand',
    render: (row: any) => row.brand?.name || hierarchyStore.brandById(row.brand_id)?.name || '-'
  },
  { 
    title: 'Поколений', 
    key: 'generationCount',
    render: (row: any) => row.generations?.length || 0
  },
  {
    title: 'Действия',
    key: 'actions',
    render: (row: any) => ({
      type: 'buttons',
      buttons: [
        { type: 'primary', text: 'Поколения', onclick: () => handleGenerations(row.id) },
        { type: 'default', text: 'Редактировать', onclick: () => handleEdit(row.id) },
        { type: 'error', text: 'Удалить', onclick: () => handleDelete(row.id) }
      ]
    })
  }
]

const brandOptions = computed(() => [
  { label: 'Все бренды', value: null },
  ...hierarchyStore.brands.map(b => ({ label: b.name, value: b.id }))
])
</script>

<template>
  <div class="model-list">
    <AppPageHeader 
      title="Модели" 
      :breadcrumbs="[{ text: 'Главная', to: '/' }, { text: 'Модели' }]"
    >
      <template #actions>
        <n-button type="primary" @click="router.push('/models/create')">
          Добавить модель
        </n-button>
      </template>
    </AppPageHeader>

    <n-select
      v-model:value="selectedBrandId"
      :options="brandOptions"
      placeholder="Фильтр по бренду"
      clearable
      style="max-width: 300px; margin-bottom: 20px;"
    />

    <n-data-table
      :columns="columns"
      :data="hierarchyStore.models"
      :loading="hierarchyStore.loading"
      v-if="hierarchyStore.models.length > 0"
    />
    <n-empty v-else description="Нет данных" style="margin-top: 40px;">
      <n-button size="small" @click="router.push('/models/create')">
        Создать модель
      </n-button>
    </n-empty>
  </div>
</template>

<style scoped>
.model-list {
  padding: 20px;
}
</style>