<script setup lang="ts">
interface Breadcrumb {
  text: string
  to?: string
}

interface Props {
  title: string
  breadcrumbs?: Breadcrumb[]
}

defineProps<Props>()
</script>

<template>
  <div class="page-header">
    <div class="header-content">
      <n-breadcrumb v-if="breadcrumbs && breadcrumbs.length" class="breadcrumbs">
        <n-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index" :to="item.to">
          {{ item.text }}
        </n-breadcrumb-item>
      </n-breadcrumb>
      <h1 class="title">{{ title }}</h1>
    </div>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.breadcrumbs {
  margin-bottom: 4px;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>