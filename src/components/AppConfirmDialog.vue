<script setup lang="ts">
import { watch } from 'vue'
import { useDialog } from 'naive-ui'

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

const dialog = useDialog()
let dialogInstance: ReturnType<typeof dialog.warning> | null = null

const closeDialog = () => {
  emit('cancel')
  emit('update:visible', false)
}

watch(() => props.visible, (newVal: boolean) => {
  if (newVal) {
    dialogInstance = dialog.warning({
      title: props.title,
      content: props.message,
      positiveText: props.confirmText,
      negativeText: props.cancelText,
      maskClosable: true,
      onPositiveClick: () => {
        emit('confirm')
        emit('update:visible', false)
      },
      onNegativeClick: closeDialog,
      onMaskClick: closeDialog
    })
  } else if (dialogInstance) {
    dialogInstance.destroy()
    dialogInstance = null
  }
})
</script>

<template>
  <!-- This component only triggers the dialog via useDialog composable -->
</template>