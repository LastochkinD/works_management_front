<script setup lang="ts">
interface Props {
  level: 'global' | 'brand' | 'model' | 'generation' | 'series' | 'modification'
}

defineProps<Props>()

const levelConfig = {
  global: { label: 'Глобальный', color: '#909399' },
  brand: { label: 'Бренд', color: '#409eff' },
  model: { label: 'Модель', color: '#67c23a' },
  generation: { label: 'Поколение', color: '#e6a23c' },
  series: { label: 'Серия', color: '#f59e0b' },
  modification: { label: 'Модификация', color: '#f56c6c' }
}
</script>

<template>
  <span class="level-badge" :style="{ backgroundColor: levelConfig[level].color }">
    {{ levelConfig[level].label }}
  </span>
</template>

<style scoped>
.level-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: 500;
}
</style>