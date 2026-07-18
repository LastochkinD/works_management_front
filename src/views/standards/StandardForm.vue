<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStandardStore } from '@/stores/standard'
import { useWorkStore } from '@/stores/work'
import { useHierarchyStore } from '@/stores/hierarchy'
import { useNotifications } from '@/composables/useNotifications'
import AppPageHeader from '@/components/AppPageHeader.vue'
import AppEntitySelector from '@/components/AppEntitySelector.vue'

const router = useRouter()
const route = useRoute()
const standardStore = useStandardStore()
const workStore = useWorkStore()
const hierarchyStore = useHierarchyStore()
const { success, error } = useNotifications()

const isEdit = computed(() => !!route.params.id)
const standardId = computed(() => route.params.id ? Number(route.params.id) : null)

const entitySelection = ref({
  brand_id: null as number | null,
  model_id: null as number | null,
  generation_id: null as number | null,
  series_id: null as number | null,
  modification_id: null as number | null
})

const form = ref({
  work_id: null as number | null,
  value: null as number | null
})

const rules = {
  work_id: [
    { required: true, message: 'Выберите работу', trigger: ['change', 'blur'] }
  ],
  value: [
    { required: true, message: 'Норматив обязателен', trigger: 'blur' }
  ]
}

const workOptions = computed(() => 
  workStore.works.map(w => ({ label: `${w.code} - ${w.name}`, value: w.id }))
)

const handleSubmit = async () => {
  try {
    if (!form.value.work_id) {
      error('Выберите работу')
      return
    }
    
    if (!form.value.value || form.value.value <= 0) {
      error('Норматив должен быть больше 0')
      return
    }

    const data: any = {
      work_id: form.value.work_id,
      value: form.value.value
    }

    // Add entity IDs if specified
    if (entitySelection.value.brand_id) data.brand_id = entitySelection.value.brand_id
    if (entitySelection.value.model_id) data.model_id = entitySelection.value.model_id
    if (entitySelection.value.generation_id) data.generation_id = entitySelection.value.generation_id
    if (entitySelection.value.series_id) data.series_id = entitySelection.value.series_id
    if (entitySelection.value.modification_id) data.modification_id = entitySelection.value.modification_id

    if (isEdit.value && standardId.value) {
      await standardStore.update(standardId.value, data)
      success('Норматив успешно обновлён')
    } else {
      await standardStore.create(data)
      success('Норматив успешно создан')
    }
    router.push('/standards')
  } catch (err: any) {
    error(err.message || 'Ошибка при сохранении норматива')
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  await workStore.fetchAll({ page: 1, pageSize: 100 })
  await hierarchyStore.fetchBrands()
  
  // Check for query params
  const workId = route.query.work_id ? Number(route.query.work_id) : null
  if (workId) {
    form.value.work_id = workId
  }
})
</script>

<template>
  <div class="standard-form">
    <AppPageHeader 
      :title="isEdit ? 'Редактирование норматива' : 'Создание норматива'"
      :breadcrumbs="[
        { text: 'Главная', to: '/' },
        { text: 'Нормативы', to: '/standards' },
        { text: isEdit ? 'Редактирование' : 'Создание' }
      ]"
    />

    <n-form :model="form" :rules="rules" label-width="120px">
      <n-form-item label="Работа" path="work_id">
        <n-select
          v-model:value="form.work_id"
          :options="workOptions"
          placeholder="Выберите работу"
        />
      </n-form-item>

      <n-form-item label="Автомобиль">
        <AppEntitySelector
          v-model:modelValue="entitySelection"
          :allowEmpty="true"
        />
      </n-form-item>

      <n-form-item label="Норматив (ч)" path="value">
        <n-input-number
          v-model:value="form.value"
          placeholder="Введите норматив"
          :precision="2"
          :min="0"
        />
      </n-form-item>

      <n-form-item>
        <n-button @click="handleCancel">Отмена</n-button>
        <n-button type="primary" @click="handleSubmit" :loading="standardStore.loading">
          Сохранить
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped>
.standard-form {
  padding: 20px;
  max-width: 800px;
}
</style>