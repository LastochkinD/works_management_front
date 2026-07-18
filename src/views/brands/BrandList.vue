<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHierarchyStore } from '@/stores/hierarchy'
import { useNotifications } from '@/composables/useNotifications'
import AppPageHeader from '@/components/AppPageHeader.vue'
import AppConfirmDialog from '@/components/AppConfirmDialog.vue'
import { brands } from '@/api'

const router = useRouter()
const hierarchyStore = useHierarchyStore()
const { success, error } = useNotifications()

const showConfirmDialog = ref(false)
const brandToDelete = ref<number | null>(null)

const handleEdit = (id: number) => {
  router.push(`/brands/${id}`)
}

const handleModels = (id: number) => {
  router.push(`/models?brand_id=${id}`)
}

const handleDelete = (id: number) => {
  brandToDelete.value = id
  showConfirmDialog.value = true
}

const confirmDelete = async () => {
  if (brandToDelete.value) {
    try {
      await brands.remove(brandToDelete.value)
      success('Бренд успешно удалён')
      hierarchyStore.brands = hierarchyStore.brands.filter(b => b.id !== brandToDelete.value)
    } catch (err: any) {
      error(err.message || 'Ошибка при удалении бренда')
    }
    brandToDelete.value = null
  }
}

const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: 'Наименование', key: 'name' },
  { 
    title: 'Моделей', 
    key: 'modelCount',
    render: (row: any) => row.models?.length || 0
  },
  {
    title: 'Действия',
    key: 'actions',
    render: (row: any) => ({
      type: 'buttons',
      buttons: [
        { type: 'primary', text: 'Модели', onclick: () => handleModels(row.id) },
        { type: 'default', text: 'Редактировать', onclick: () => handleEdit(row.id) },
        { type: 'error', text: 'Удалить', onclick: () => handleDelete(row.id) }
      ]
    })
  }
]

onMounted(() => {
  hierarchyStore.fetchBrands()
})
</script>

<template>
  <div class="brand-list">
    <AppPageHeader 
      title="Бренды" 
      :breadcrumbs="[{ text: 'Главная', to: '/' }, { text: 'Бренды' }]"
    >
      <template #actions>
        <n-button type="primary" @click="router.push('/brands/create')">
          Добавить бренд
        </n-button>
      </template>
    </AppPageHeader>

    <n-data-table
      :columns="columns"
      :data="hierarchyStore.brands"
      :loading="hierarchyStore.loading"
    />

    <AppConfirmDialog
      v-model:visible="showConfirmDialog"
      title="Удаление бренда"
      message="Будут удалены все модели, поколения, серии, модификации и нормативы этого бренда. Продолжить?"
      @confirm="confirmDelete"
      @cancel="brandToDelete = null"
    />
  </div>
</template>

<style scoped>
.brand-list {
  padding: 20px;
}
</style>