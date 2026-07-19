<script setup lang="ts">
import { ref, onMounted, computed, watch, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHierarchyStore } from '@/stores/hierarchy'
import { useNotifications } from '@/composables/useNotifications'
import AppPageHeader from '@/components/AppPageHeader.vue'
import AppEntitySelector from '@/components/AppEntitySelector.vue'
import AppActionButtons from '@/components/AppActionButtons.vue'

const router = useRouter()
const route = useRoute()
const hierarchyStore = useHierarchyStore()
const { success, error } = useNotifications()

const entitySelection = ref({
  brand_id: null as number | null,
  model_id: null as number | null,
  generation_id: null as number | null,
  series_id: null as number | null,
  modification_id: null as number | null
})

// Initialize on mount
onMounted(async () => {
  await hierarchyStore.fetchBrands()
})

watch([() => entitySelection.value.brand_id, () => entitySelection.value.model_id], ([brandId, modelId]) => {
  if (modelId) {
    hierarchyStore.fetchGenerations(modelId)
  }
})

const handleEdit = (id: number) => {
  router.push(`/generations/${id}`)
}

const handleSeries = (id: number) => {
  router.push(`/series?generation_id=${id}`)
}

const handleDelete = async (id: number) => {
  try {
    const { generations } = await import('@/api')
    await generations.remove(id)
    success('Поколение успешно удалено')
    hierarchyStore.generations = hierarchyStore.generations.filter(g => g.id !== id)
  } catch (err: any) {
    error(err.message || 'Ошибка при удалении поколения')
  }
}

const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: 'Наименование', key: 'name' },
  { 
    title: 'Модель', 
    key: 'model',
    render: (row: any) => row.model?.name || '-'
  },
  { 
    title: 'Серий', 
    key: 'seriesCount',
    render: (row: any) => row.series?.length || 0
  },
  {
    title: 'Действия',
    key: 'actions',
    render: (row: any) => h(AppActionButtons, {
      buttons: [
        { type: 'primary' as const, text: 'Серии', onClick: () => handleSeries(row.id) },
        { type: 'default' as const, text: 'Редактировать', onClick: () => handleEdit(row.id) },
        { type: 'error' as const, text: 'Удалить', onClick: () => handleDelete(row.id) }
      ]
    })
  }
]
</script>

<template>
  <div class="generation-list">
    <AppPageHeader 
      title="Поколения" 
      :breadcrumbs="[{ text: 'Главная', to: '/' }, { text: 'Поколения' }]"
    >
      <template #actions>
        <n-button type="primary" @click="router.push('/generations/create')">
          Добавить поколение
        </n-button>
      </template>
    </AppPageHeader>

    <div class="filter-section">
      <AppEntitySelector
        v-model:modelValue="entitySelection"
        :allowEmpty="false"
        :disabledLevels="['generation', 'series', 'modification']"
      />
    </div>

    <n-data-table
      :columns="columns"
      :data="hierarchyStore.generations"
      :loading="hierarchyStore.loading"
      v-if="hierarchyStore.generations.length > 0"
    />
    <n-empty v-else description="Нет данных" style="margin-top: 40px;">
      <n-button size="small" @click="router.push('/generations/create')">
        Создать поколение
      </n-button>
    </n-empty>
  </div>
</template>

<style scoped>
.generation-list {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}
</style>