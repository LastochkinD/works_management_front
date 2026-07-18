<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWorkStore } from '@/stores/work'
import { useNotifications } from '@/composables/useNotifications'
import AppPageHeader from '@/components/AppPageHeader.vue'

const router = useRouter()
const route = useRoute()
const workStore = useWorkStore()
const { success, error } = useNotifications()

const isEdit = computed(() => !!route.params.id)
const workId = computed(() => route.params.id ? Number(route.params.id) : null)

const form = ref({
  code: '',
  name: ''
})

const rules = {
  code: [
    { required: true, message: 'Код обязателен', trigger: 'blur' },
    { max: 30, message: 'Максимум 30 символов', trigger: 'blur' }
  ],
  name: [
    { required: true, message: 'Наименование обязательно', trigger: 'blur' },
    { max: 255, message: 'Максимум 255 символов', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    if (isEdit.value && workId.value) {
      await workStore.update(workId.value, form.value)
      success('Работа успешно обновлена')
    } else {
      await workStore.create(form.value)
      success('Работа успешно создана')
    }
    router.push('/works')
  } catch (err: any) {
    error(err.message || 'Ошибка при сохранении работы')
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  if (isEdit.value && workId.value) {
    try {
      await workStore.fetchById(workId.value)
      if (workStore.currentWork) {
        form.value = {
          code: workStore.currentWork.code,
          name: workStore.currentWork.name
        }
      }
    } catch (err: any) {
      error('Работа не найдена')
      router.push('/works')
    }
  }
})
</script>

<template>
  <div class="work-form">
    <AppPageHeader 
      :title="isEdit ? 'Редактирование работы' : 'Создание работы'"
      :breadcrumbs="[
        { text: 'Главная', to: '/' },
        { text: 'Работы', to: '/works' },
        { text: isEdit ? 'Редактирование' : 'Создание' }
      ]"
    />

    <n-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <n-form-item label="Код" path="code">
        <n-input 
          v-model:value="form.code" 
          placeholder="Введите код работы" 
          maxlength="30"
          show-count
        />
      </n-form-item>

      <n-form-item label="Наименование" path="name">
        <n-input 
          v-model:value="form.name" 
          placeholder="Введите наименование работы" 
          maxlength="255"
          show-count
        />
      </n-form-item>

      <n-form-item>
        <n-button @click="handleCancel">Отмена</n-button>
        <n-button type="primary" @click="handleSubmit" :loading="workStore.loading">
          Сохранить
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped>
.work-form {
  padding: 20px;
  max-width: 600px;
}

.n-form-item + .n-form-item {
  margin-top: 20px;
}

.n-button + .n-button {
  margin-left: 12px;
}
</style>