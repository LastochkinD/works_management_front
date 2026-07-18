<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <n-message-provider>
    <n-layout>
    <n-layout-header class="header">
      <div class="header-content">
        <h1>Управление нормативами автосервиса</h1>
        <n-space>
          <RouterLink to="/works">Работы</RouterLink>
          <RouterLink to="/brands">Бренды</RouterLink>
          <RouterLink to="/models">Модели</RouterLink>
          <RouterLink to="/generations">Поколения</RouterLink>
          <RouterLink to="/series">Серии</RouterLink>
          <RouterLink to="/modifications">Модификации</RouterLink>
          <RouterLink to="/standards">Нормативы</RouterLink>
          <RouterLink to="/resolve">Калькулятор</RouterLink>
        </n-space>
      </div>
    </n-layout-header>
    
    <n-layout-content class="content">
      <RouterView />
    </n-layout-content>
  </n-layout>
  </n-message-provider>
</template>

<style>
.header {
  background-color: #409eff;
  padding: 16px 20px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-content h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.content {
  min-height: calc(100vh - 64px);
}

a {
  color: white;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

a.router-link-active {
  font-weight: 600;
  text-decoration: underline;
}
</style>