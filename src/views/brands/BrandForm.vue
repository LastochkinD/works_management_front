<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHierarchyStore } from '@/stores/hierarchy'
import { useNotifications } from '@/composables/useNotifications'
import AppPageHeader from '@/components/AppPageHeader.vue'

const router = useRouter()
const route = useRoute()
const hierarchyStore = useHierarchyStore()
const { success, error } = useNotifications()

const isEdit = computed(() => !!route.params.id)
const brandId = computed(() => route.params.id ? Number(route.params.id) : null)

const form = ref({
  name: ''
})

const rules = {
  name: [
    { required: true, message: 'Наименование обязательно', trigger: 'blur' },
    { max: 255, message: 'Максимум 255 символов', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    const brandData = { name: form.value.name }
    
    if (isEdit.value && brandId.value) {
      // Update existing brand
      const updatedBrand = await hierarchyStore.brands.find(b => b.id === brandId.value)
      // Use direct API call for update
      const { brands } = await import('@/api')
      await brands.update(brandId.value, brandData)
      success('Бренд успешно обновлён')
    } else {
      // Create new brand
      const { brands } = await import('@/api')
      await brands.create(brandData)
      success('Бренд успешно создан')
    }
    router.push('/brands')
  } catch (err: any) {
    error(err.message || 'Ошибка при сохранении бренда')
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  if (isEdit.value && brandId.value) {
    const brand = hierarchyStore.brandById(brandId.value)
    if (brand) {
      form.value.name = brand.name
    } else {
      error('Бренд не найден')
      router.push('/brands')
    }
  }
})
</script>

<template>
  <div class="brand-form">
    <AppPageHeader 
      :title="isEdit ? 'Редактирование бренда' : 'Создание бренда'"
      :breadcrumbs="[
        { text: 'Главная', to: '/' },
        { text: 'Бренды', to: '/brands' },
        { text: isEdit ? 'Редактирование' : 'Создание' }
      ]"
    />

    <n-form :model="form" :rules="rules" label-width="120px">
      <n-form-item label="Наименование" path="name">
        <n-input 
          v-model:value="form.name" 
          placeholder="Введите наименование бренда" 
          maxlength="255"
          show-count
        />
      </n-form-item>

      <n-form-item>
        <n-button @click="handleCancel">Отмена</n-button>
        <n-button type="primary" @click="handleSubmit">
          Сохранить
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped>
.brand-form {
  padding: 20px;
  max-width: 600px;
}
</style>