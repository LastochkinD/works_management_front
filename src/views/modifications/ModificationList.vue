<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHierarchyStore } from '@/stores/hierarchy'
import { useNotifications } from '@/composables/useNotifications'
import AppPageHeader from '@/components/AppPageHeader.vue'
import AppEntitySelector from '@/components/AppEntitySelector.vue'

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

watch([() => entitySelection.value.brand_id, () => entitySelection.value.model_id, () => entitySelection.value.generation_id, () => entitySelection.value.series_id], ([,,, seriesId]) => {
  if (seriesId) {
    hierarchyStore.fetchModifications(seriesId)
  }
})

const handleEdit = (id: number) => {
  router.push(`/modifications/${id}`)
}

const handleDelete = async (id: number) => {
  try {
    const { modifications } = await import('@/api')
    await modifications.remove(id)
    success('Модификация успешно удалена')
    hierarchyStore.modifications = hierarchyStore.modifications.filter(m => m.id !== id)
  } catch (err: any) {
    error(err.message || 'Ошибка при удалении модификации')
  }
}

const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: 'Наименование', key: 'name' },
  { 
    title: 'Серия', 
    key: 'series',
    render: (row: any) => row.series?.name || '-'
  },
  {
    title: 'Действия',
    key: 'actions',
    render: (row: any) => ({
      type: 'buttons',
      buttons: [
        { type: 'default', text: 'Редактировать', onclick: () => handleEdit(row.id) },
        { type: 'error', text: 'Удалить', onclick: () => handleDelete(row.id) }
      ]
    })
  }
]
</script>

<template>
  <div class="modification-list">
    <AppPageHeader 
      title="Модификации" 
      :breadcrumbs="[{ text: 'Главная', to: '/' }, { text: 'Модификации' }]"
    >
      <template #actions>
        <n-button type="primary" @click="router.push('/modifications/create')">
          Добавить модификацию
        </n-button>
      </template>
    </AppPageHeader>

    <div class="filter-section">
      <AppEntitySelector
        v-model:modelValue="entitySelection"
        :allowEmpty="false"
        :disabledLevels="['modification']"
      />
    </div>

    <n-data-table
      :columns="columns"
      :data="hierarchyStore.modifications"
      :loading="hierarchyStore.loading"
      v-if="hierarchyStore.modifications.length > 0"
    />
    <n-empty v-else description="Нет данных" style="margin-top: 40px;">
      <n-button size="small" @click="router.push('/modifications/create')">
        Создать модификацию
      </n-button>
    </n-empty>
  </div>
</template>

<style scoped>
.modification-list {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
}
</style>