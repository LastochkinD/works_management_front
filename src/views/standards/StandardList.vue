<script setup lang="ts">
import { ref, onMounted, computed, watch, h } from 'vue'
import { useRouter } from 'vue-router'
import { useStandardStore } from '@/stores/standard'
import { useWorkStore } from '@/stores/work'
import { useHierarchyStore } from '@/stores/hierarchy'
import { useNotifications } from '@/composables/useNotifications'
import AppPageHeader from '@/components/AppPageHeader.vue'
import AppLevelBadge from '@/components/AppLevelBadge.vue'
import AppActionButtons from '@/components/AppActionButtons.vue'

const router = useRouter()
const standardStore = useStandardStore()
const workStore = useWorkStore()
const hierarchyStore = useHierarchyStore()
const { success, error } = useNotifications()

const selectedWorkId = ref<number | null>(null)
const selectedBrandId = ref<number | null>(null)

const workOptions = computed(() => [
  { label: 'Все работы', value: null },
  ...workStore.works.map(w => ({ label: `${w.code} - ${w.name}`, value: w.id }))
])

const brandOptions = computed(() => [
  { label: 'Все бренды', value: null },
  ...hierarchyStore.brands.map(b => ({ label: b.name, value: b.id }))
])

onMounted(async () => {
  await workStore.fetchAll({ page: 1, pageSize: 100 })
  await hierarchyStore.fetchBrands()
  await standardStore.fetchAll()
})

const handleEdit = (id: number) => {
  router.push(`/standards/${id}`)
}

const handleDelete = async (id: number) => {
  try {
    await standardStore.remove(id)
    success('Норматив успешно удалён')
  } catch (err: any) {
    error(err.message || 'Ошибка при удалении норматива')
  }
}

const getLevelDescription = (standard: any) => {
  if (standard.modification_id) return 'Модификация'
  if (standard.series_id) return 'Серия'
  if (standard.generation_id) return 'Поколение'
  if (standard.model_id) return 'Модель'
  if (standard.brand_id) return 'Бренд'
  return 'Глобальный'
}

const getLevelType = (standard: any): 'global' | 'brand' | 'model' | 'generation' | 'series' | 'modification' => {
  if (standard.modification_id) return 'modification'
  if (standard.series_id) return 'series'
  if (standard.generation_id) return 'generation'
  if (standard.model_id) return 'model'
  if (standard.brand_id) return 'brand'
  return 'global'
}

const columns = [
  { 
    title: 'Работа', 
    key: 'work',
    render: (row: any) => `${row.work?.code} - ${row.work?.name}`
  },
  { 
    title: 'Уровень', 
    key: 'level',
    render: (row: any) => h(AppLevelBadge, { level: getLevelType(row) })
  },
  { 
    title: 'Описание уровня', 
    key: 'levelDesc',
    render: (row: any) => getLevelDescription(row)
  },
  { 
    title: 'Норматив (ч)', 
    key: 'value',
    render: (row: any) => row.value?.toFixed(2)
  },
  {
    title: 'Действия',
    key: 'actions',
    render: (row: any) => h(AppActionButtons, {
      buttons: [
        { type: 'default' as const, text: 'Редактировать', onClick: () => handleEdit(row.id) },
        { type: 'error' as const, text: 'Удалить', onClick: () => handleDelete(row.id) }
      ]
    })
  }
]
</script>

<template>
  <div class="standard-list">
    <AppPageHeader 
      title="Нормативы работ" 
      :breadcrumbs="[{ text: 'Главная', to: '/' }, { text: 'Нормативы' }]"
    >
      <template #actions>
        <n-button type="primary" @click="router.push('/standards/create')">
          Добавить норматив
        </n-button>
      </template>
    </AppPageHeader>

    <n-space class="filters" align="center">
      <n-select
        v-model:value="selectedWorkId"
        :options="workOptions"
        placeholder="Фильтр по работе"
        clearable
        style="min-width: 300px;"
      />
      <n-select
        v-model:value="selectedBrandId"
        :options="brandOptions"
        placeholder="Фильтр по бренду"
        clearable
        style="min-width: 200px;"
      />
    </n-space>

    <n-data-table
      :columns="columns"
      :data="standardStore.standards"
      :loading="standardStore.loading"
      :pagination="{
        page: standardStore.pagination.page,
        pageSize: standardStore.pagination.pageSize,
        total: standardStore.pagination.total
      }"
      v-if="standardStore.standards.length > 0"
    />
    <n-empty v-else description="Нет данных" style="margin-top: 40px;">
      <n-button size="small" @click="router.push('/standards/create')">
        Создать норматив
      </n-button>
    </n-empty>
  </div>
</template>

<style scoped>
.standard-list {
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
}
</style>