<script setup lang="ts">
interface EntityProps {
  brand?: { id: number; name: string } | null
  model?: { id: number; name: string } | null
  generation?: { id: number; name: string } | null
  series?: { id: number; name: string } | null
  modification?: { id: number; name: string } | null
}

const props = defineProps<EntityProps>()

const entityChain = [
  props.brand,
  props.model,
  props.generation,
  props.series,
  props.modification
]
</script>

<template>
  <div class="entity-display">
    <span v-for="(entity, index) in entityChain" :key="index" class="entity-item">
      <span v-if="entity">{{ entity.name }}</span>
      <span v-else-if="index === 0 && !entity">Не выбрано</span>
      <span v-else-if="entity === null && index > 0" class="all-label">
        (Все {{ ['поколения', 'серии', 'модификации'][index - 1] }})
      </span>
      <span v-if="index < entityChain.length - 1" class="separator">→</span>
    </span>
  </div>
</template>

<style scoped>
.entity-display {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.entity-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.separator {
  color: #909399;
  margin: 0 4px;
}

.all-label {
  color: #909399;
  font-style: italic;
}
</style>