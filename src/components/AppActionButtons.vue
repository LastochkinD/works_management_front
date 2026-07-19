<script setup lang="ts">
interface ButtonConfig {
  type?: 'primary' | 'default' | 'error' | 'warning' | 'info' | 'success' | 'tertiary'
  text: string
  onClick: () => void
}

interface Props {
  buttons: ButtonConfig[]
}

defineProps<Props>()
</script>

<template>
  <n-space>
    <n-button
      v-for="button in buttons"
      :key="button.text"
      :type="button.type || 'default'"
      size="small"
      @click="button.onClick"
    >
      {{ button.text }}
    </n-button>
  </n-space>
</template>