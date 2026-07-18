<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useHierarchyStore } from '@/stores/hierarchy'
import type { Brand, Model, Generation, Series, Modification } from '@/api'

interface EntityValue {
  brand_id: number | null
  model_id: number | null
  generation_id: number | null
  series_id: number | null
  modification_id: number | null
}

const props = defineProps<{
  modelValue?: EntityValue
  allowEmpty?: boolean
  disabledLevels?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: EntityValue): void
}>()

const hierarchyStore = useHierarchyStore()

const internalValue = ref<EntityValue>({
  brand_id: null,
  model_id: null,
  generation_id: null,
  series_id: null,
  modification_id: null,
  ...props.modelValue
})

// Initialize brands on mount
hierarchyStore.fetchBrands()

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    Object.assign(internalValue.value, newVal)
  }
})

// Watch for brand changes - load models
watch(() => internalValue.value.brand_id, (newBrandId) => {
  if (newBrandId) {
    hierarchyStore.fetchModels(newBrandId)
  }
  if (!newBrandId || newBrandId !== internalValue.value.brand_id) {
    internalValue.value.model_id = null
    internalValue.value.generation_id = null
    internalValue.value.series_id = null
    internalValue.value.modification_id = null
  }
})

// Watch for model changes - load generations
watch(() => internalValue.value.model_id, (newModelId) => {
  if (newModelId) {
    hierarchyStore.fetchGenerations(newModelId)
  }
  if (!newModelId || newModelId !== internalValue.value.model_id) {
    internalValue.value.generation_id = null
    internalValue.value.series_id = null
    internalValue.value.modification_id = null
  }
})

// Watch for generation changes - load series
watch(() => internalValue.value.generation_id, (newGenerationId) => {
  if (newGenerationId) {
    hierarchyStore.fetchSeries(newGenerationId)
  }
  if (!newGenerationId || newGenerationId !== internalValue.value.generation_id) {
    internalValue.value.series_id = null
    internalValue.value.modification_id = null
  }
})

// Watch for series changes - load modifications
watch(() => internalValue.value.series_id, (newSeriesId) => {
  if (newSeriesId) {
    hierarchyStore.fetchModifications(newSeriesId)
  }
  if (!newSeriesId || newSeriesId !== internalValue.value.series_id) {
    internalValue.value.modification_id = null
  }
})

// Emit changes
watch(internalValue, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

const selectOptions = computed(() => {
  const options = {
    brands: [{ label: 'Все бренды', value: null }, ...hierarchyStore.brands.map(b => ({ label: b.name, value: b.id }))],
    models: props.allowEmpty 
      ? [{ label: 'Все модели', value: null }, ...hierarchyStore.models.map(m => ({ label: m.name, value: m.id }))]
      : hierarchyStore.models.map(m => ({ label: m.name, value: m.id })),
    generations: props.allowEmpty
      ? [{ label: 'Все поколения', value: null }, ...hierarchyStore.generations.map(g => ({ label: g.name, value: g.id }))]
      : hierarchyStore.generations.map(g => ({ label: g.name, value: g.id })),
    series: props.allowEmpty
      ? [{ label: 'Все серии', value: null }, ...hierarchyStore.series.map(s => ({ label: s.name, value: s.id }))]
      : hierarchyStore.series.map(s => ({ label: s.name, value: s.id })),
    modifications: props.allowEmpty
      ? [{ label: 'Все модификации', value: null }, ...hierarchyStore.modifications.map(m => ({ label: m.name, value: m.id }))]
      : hierarchyStore.modifications.map(m => ({ label: m.name, value: m.id }))
  }
  return options
})

const isLevelDisabled = (level: string) => {
  return props.disabledLevels?.includes(level) || false
}

const isLevelEnabled = (level: string) => {
  if (isLevelDisabled(level)) return false
  
  if (level === 'model' && !internalValue.value.brand_id) return false
  if (level === 'generation' && !internalValue.value.model_id) return false
  if (level === 'series' && !internalValue.value.generation_id) return false
  if (level === 'modification' && !internalValue.value.series_id) return false
  
  return true
}
</script>

<template>
  <div class="entity-selector">
    <n-select
      v-model:value="internalValue.brand_id"
      :options="selectOptions.brands"
      :disabled="isLevelDisabled('brand')"
      placeholder="Выберите бренд"
      clearable
    />
    
    <n-select
      v-model:value="internalValue.model_id"
      :options="selectOptions.models"
      :disabled="!isLevelEnabled('model')"
      placeholder="Выберите модель"
      clearable
    />
    
    <n-select
      v-model:value="internalValue.generation_id"
      :options="selectOptions.generations"
      :disabled="!isLevelEnabled('generation')"
      placeholder="Выберите поколение"
      clearable
    />
    
    <n-select
      v-model:value="internalValue.series_id"
      :options="selectOptions.series"
      :disabled="!isLevelEnabled('series')"
      placeholder="Выберите серию"
      clearable
    />
    
    <n-select
      v-model:value="internalValue.modification_id"
      :options="selectOptions.modifications"
      :disabled="!isLevelEnabled('modification')"
      placeholder="Выберите модификацию"
      clearable
    />
  </div>
</template>

<style scoped>
.entity-selector {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.entity-selector .n-select {
  min-width: 150px;
  flex: 1;
}
</style>