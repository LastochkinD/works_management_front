<script setup lang="ts">
interface Props {
  visible: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Подтверждение',
  message: 'Вы уверены, что хотите выполнить это действие?',
  confirmText: 'Подтвердить',
  cancelText: 'Отмена'
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:visible', value: boolean): void
}>()

const handleConfirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<template>
  <n-dialog :show="props.visible" @update:show="handleCancel">
    <template #header>
      {{ title }}
    </template>
    <div class="confirm-content">
      {{ message }}
    </div>
    <template #action>
      <n-button @click="handleCancel">{{ cancelText }}</n-button>
      <n-button type="primary" @click="handleConfirm">{{ confirmText }}</n-button>
    </template>
  </n-dialog>
</template>

<style scoped>
.confirm-content {
  padding: 20px 0;
  min-width: 300px;
}
</style>