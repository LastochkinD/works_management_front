<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHierarchyStore } from '@/stores/hierarchy'
import { useNotifications } from '@/composables/useNotifications'
import AppPageHeader from '@/components/AppPageHeader.vue'
import AppEntitySelector from '@/components/AppEntitySelector.vue'

interface EntityValue {
  brand_id: number | null
  model_id: number | null
  generation_id: number | null
  series_id: number | null
  modification_id: number | null
}

const router = useRouter()
const route = useRoute()
const hierarchyStore = useHierarchyStore()
const { success, error } = useNotifications()

const isEdit = computed(() => !!route.params.id)
const generationId = computed(() => route.params.id ? Number(route.params.id) : null)

const entitySelection = ref<EntityValue>({
  brand_id: null,
  model_id: null,
  generation_id: null,
  series_id: null,
  modification_id: null
})

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
    if (!entitySelection.value.model_id) {
      error('Выберите модель')
      return
    }
    
    const data = {
      ...form.value,
      model_id: entitySelection.value.model_id
    }
    
    if (isEdit.value && generationId.value) {
      const { generations } = await import('@/api')
      await generations.update(generationId.value, data)
      success('Поколение успешно обновлено')
    } else {
      const { generations } = await import('@/api')
      await generations.create(data)
      success('Поколение успешно создано')
    }
    router.push('/generations')
  } catch (err: any) {
    error(err.message || 'Ошибка при сохранении поколения')
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  await hierarchyStore.fetchBrands()
})
</script>

<template>
  <div class="generation-form">
    <AppPageHeader 
      :title="isEdit ? 'Редактирование поколения' : 'Создание поколения'"
      :breadcrumbs="[
        { text: 'Главная', to: '/' },
        { text: 'Поколения', to: '/generations' },
        { text: isEdit ? 'Редактирование' : 'Создание' }
      ]"
    />

    <n-form :model="form" :rules="rules" label-width="120px">
      <n-form-item label="Автомобиль" required>
        <AppEntitySelector
          v-model:modelValue="entitySelection"
          :allowEmpty="false"
          :disabledLevels="['generation', 'series', 'modification']"
        />
      </n-form-item>

      <n-form-item label="Наименование" path="name">
        <n-input 
          v-model:value="form.name" 
          placeholder="Введите наименование поколения" 
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
.generation-form {
  padding: 20px;
  max-width: 800px;
}
</style>