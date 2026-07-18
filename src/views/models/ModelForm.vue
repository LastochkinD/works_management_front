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
const modelId = computed(() => route.params.id ? Number(route.params.id) : null)

const form = ref({
  brand_id: null as number | null,
  name: ''
})

const rules = {
  name: [
    { required: true, message: 'Наименование обязательно', trigger: 'blur' },
    { max: 255, message: 'Максимум 255 символов', trigger: 'blur' }
  ],
  brand_id: [
    { required: true, message: 'Выберите бренд', trigger: ['change', 'blur'] }
  ]
}

const brandOptions = computed(() => 
  hierarchyStore.brands.map(b => ({ label: b.name, value: b.id }))
)

const handleSubmit = async () => {
  try {
    if (!form.value.brand_id) {
      error('Выберите бренд')
      return
    }
    
    const brandData = { 
      name: form.value.name,
      brand_id: form.value.brand_id
    }
    
    if (isEdit.value && modelId.value) {
      const { models } = await import('@/api')
      await models.update(modelId.value, brandData)
      success('Модель успешно обновлена')
    } else {
      const { models } = await import('@/api')
      await models.create(brandData)
      success('Модель успешно создана')
    }
    router.push('/models')
  } catch (err: any) {
    error(err.message || 'Ошибка при сохранении модели')
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  await hierarchyStore.fetchBrands()
  
  if (isEdit.value && modelId.value) {
    const model = hierarchyStore.modelById(modelId.value)
    if (model) {
      form.value = {
        brand_id: model.brand_id,
        name: model.name
      }
    } else {
      error('Модель не найдена')
      router.push('/models')
    }
  }
})
</script>

<template>
  <div class="model-form">
    <AppPageHeader 
      :title="isEdit ? 'Редактирование модели' : 'Создание модели'"
      :breadcrumbs="[
        { text: 'Главная', to: '/' },
        { text: 'Модели', to: '/models' },
        { text: isEdit ? 'Редактирование' : 'Создание' }
      ]"
    />

    <n-form :model="form" :rules="rules" label-width="120px">
      <n-form-item label="Бренд" path="brand_id">
        <n-select
          v-model:value="form.brand_id"
          :options="brandOptions"
          placeholder="Выберите бренд"
          :disabled="isEdit"
        />
      </n-form-item>

      <n-form-item label="Наименование" path="name">
        <n-input 
          v-model:value="form.name" 
          placeholder="Введите наименование модели" 
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
.model-form {
  padding: 20px;
  max-width: 600px;
}
</style>