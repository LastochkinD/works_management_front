<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStandardStore } from '@/stores/standard'
import { useWorkStore } from '@/stores/work'
import { useHierarchyStore } from '@/stores/hierarchy'
import { useNotifications } from '@/composables/useNotifications'
import AppPageHeader from '@/components/AppPageHeader.vue'
import AppEntitySelector from '@/components/AppEntitySelector.vue'
import AppEntityDisplay from '@/components/AppEntityDisplay.vue'
import AppLevelBadge from '@/components/AppLevelBadge.vue'

const router = useRouter()
const standardStore = useStandardStore()
const workStore = useWorkStore()
const hierarchyStore = useHierarchyStore()
const { success, error } = useNotifications()

const selectedWorkId = ref<number | null>(null)
const entitySelection = ref({
  brand_id: null as number | null,
  model_id: null as number | null,
  generation_id: null as number | null,
  series_id: null as number | null,
  modification_id: null as number | null
})

const resolvedStandard = ref<any | null>(null)

const workOptions = computed(() => 
  workStore.works.map(w => ({ label: `${w.code} - ${w.name}`, value: w.id }))
)

const handleResolve = async () => {
  if (!selectedWorkId.value) {
    error('Выберите работу')
    return
  }

  try {
    const result = await standardStore.resolve({
      work_id: selectedWorkId.value,
      brand_id: entitySelection.value.brand_id || undefined,
      model_id: entitySelection.value.model_id || undefined,
      generation_id: entitySelection.value.generation_id || undefined,
      series_id: entitySelection.value.series_id || undefined,
      modification_id: entitySelection.value.modification_id || undefined
    })
    
    if (result && result.standard) {
      resolvedStandard.value = result.standard
    } else {
      resolvedStandard.value = null
    }
  } catch (err: any) {
    resolvedStandard.value = null
  }
}

const handleCreateStandard = () => {
  const query: any = { work_id: selectedWorkId.value }
  if (entitySelection.value.brand_id) query.brand_id = entitySelection.value.brand_id
  if (entitySelection.value.model_id) query.model_id = entitySelection.value.model_id
  if (entitySelection.value.generation_id) query.generation_id = entitySelection.value.generation_id
  if (entitySelection.value.series_id) query.series_id = entitySelection.value.series_id
  if (entitySelection.value.modification_id) query.modification_id = entitySelection.value.modification_id
  
  router.push({ path: '/standards/create', query })
}

const getLevelType = (standard: any): 'global' | 'brand' | 'model' | 'generation' | 'series' | 'modification' => {
  if (standard.modification_id) return 'modification'
  if (standard.series_id) return 'series'
  if (standard.generation_id) return 'generation'
  if (standard.model_id) return 'model'
  if (standard.brand_id) return 'brand'
  return 'global'
}

onMounted(async () => {
  await workStore.fetchAll({ page: 1, pageSize: 100 })
  await hierarchyStore.fetchBrands()
})
</script>

<template>
  <div class="resolve-page">
    <AppPageHeader 
      title="Проверка норматива" 
      :breadcrumbs="[{ text: 'Главная', to: '/' }, { text: 'Проверка норматива' }]"
    />

    <div class="search-section">
      <n-select
        v-model:value="selectedWorkId"
        :options="workOptions"
        placeholder="Выберите работу"
        style="max-width: 400px;"
      />

      <div class="entity-selector-section">
        <AppEntitySelector
          v-model:modelValue="entitySelection"
          :allowEmpty="true"
        />
      </div>

      <n-button type="primary" @click="handleResolve">
        Проверить
      </n-button>
    </div>

    <div v-if="resolvedStandard" class="result-section">
      <n-card class="result-card">
        <div class="result-header">
          <span class="work-info">
            {{ resolvedStandard.work?.code }} - {{ resolvedStandard.work?.name }}
          </span>
          <AppLevelBadge :level="getLevelType(resolvedStandard)" />
        </div>

        <div class="result-value">
          {{ resolvedStandard.value }} <span class="unit">ч</span>
        </div>

        <div class="entity-chain">
          <AppEntityDisplay
            :brand="resolvedStandard.brand"
            :model="resolvedStandard.model"
            :generation="resolvedStandard.generation"
            :series="resolvedStandard.series"
            :modification="resolvedStandard.modification"
          />
        </div>

        <n-button type="primary" @click="handleCreateStandard">
          Создать норматив
        </n-button>
      </n-card>
    </div>

    <n-empty v-else-if="resolvedStandard === null" description="Норматив не задан ни на одном уровне для данного автомобиля" style="margin-top: 40px;">
      <n-button size="small" @click="handleCreateStandard">
        Создать норматив
      </n-button>
    </n-empty>
  </div>
</template>

<style scoped>
.resolve-page {
  padding: 20px;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.entity-selector-section {
  margin-top: 10px;
}

.result-section {
  margin-top: 30px;
}

.result-card {
  padding: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.work-info {
  font-size: 16px;
  font-weight: 500;
}

.result-value {
  font-size: 48px;
  font-weight: 700;
  color: #409eff;
  margin: 20px 0;
}

.result-value .unit {
  font-size: 24px;
  color: #909399;
}

.entity-chain {
  margin: 20px 0;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>