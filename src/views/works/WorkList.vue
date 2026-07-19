<script setup lang="ts">
import { ref, onMounted, watch, h } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkStore } from '@/stores/work'
import { useNotifications } from '@/composables/useNotifications'
import AppPageHeader from '@/components/AppPageHeader.vue'
import AppConfirmDialog from '@/components/AppConfirmDialog.vue'
import AppActionButtons from '@/components/AppActionButtons.vue'

const router = useRouter()
const workStore = useWorkStore()
const { success, error } = useNotifications()

const searchCode = ref('')
const searchName = ref('')
const showConfirmDialog = ref(false)
const workToDelete = ref<number | null>(null)

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout> | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    workStore.fetchAll({
      code: searchCode.value || undefined,
      name: searchName.value || undefined,
      page: 1,
      pageSize: 50
    })
  }, 300)
}

const handleEdit = (id: number) => {
  router.push(`/works/${id}`)
}

const handleDelete = (id: number) => {
  workToDelete.value = id
  showConfirmDialog.value = true
}

const confirmDelete = async () => {
  if (workToDelete.value) {
    try {
      await workStore.remove(workToDelete.value)
      success('Работа успешно удалена')
    } catch (err: any) {
      error(err.message || 'Ошибка при удалении работы')
    }
    workToDelete.value = null
  }
}

const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: 'Код', key: 'code' },
  { title: 'Наименование', key: 'name' },
  { 
    title: 'Нормативы', 
    key: 'standards',
    render: (row: any) => row.standards?.length || 0
  },
  {
    title: 'Действия',
    key: 'actions',
    render: (row: any) => h(AppActionButtons, {
      buttons: [
        { type: 'primary' as const, text: 'Редактировать', onClick: () => handleEdit(row.id) },
        { type: 'error' as const, text: 'Удалить', onClick: () => handleDelete(row.id) }
      ]
    })
  }
]

// Type for DataTable pagination
interface DataTablePageParam {
  page: number
  pageSize: number
}

onMounted(() => {
  workStore.fetchAll({ page: 1, pageSize: 50 })
})
</script>

<template>
  <div class="work-list">
    <AppPageHeader 
      title="Работы" 
      :breadcrumbs="[{ text: 'Главная', to: '/' }, { text: 'Работы' }]"
    >
      <template #actions>
        <n-button type="primary" @click="router.push('/works/create')">
          <template #icon>
            <n-icon>
              <add-icon />
            </n-icon>
          </template>
          Добавить работу
        </n-button>
      </template>
    </AppPageHeader>

    <n-space class="filters" align="center">
      <n-input
        v-model:value="searchCode"
        placeholder="Поиск по коду"
        @input="debouncedSearch"
        clearable
      />
      <n-input
        v-model:value="searchName"
        placeholder="Поиск по наименованию"
        @input="debouncedSearch"
        clearable
      />
    </n-space>

<n-data-table
       :columns="columns"
       :data="workStore.works"
       :loading="workStore.loading"
       :pagination="{
         page: workStore.pagination.page,
         pageSize: workStore.pagination.pageSize,
         total: workStore.pagination.total,
         onChange: (page: number) => workStore.fetchAll({ page })
       }"
       style="width: 100%;"
     />

    <AppConfirmDialog
      v-model:visible="showConfirmDialog"
      title="Удаление работы"
      message="Вы уверены, что хотите удалить эту работу?"
      @confirm="confirmDelete"
      @cancel="workToDelete = null"
    />
  </div>
</template>

<style scoped>
.work-list {
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
}
</style>