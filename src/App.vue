<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <n-message-provider>
    <n-dialog-provider>
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
    </n-dialog-provider>
  </n-message-provider>
</template>

<style>
#app,
.n-layout {
  width: 100%;
  height: 100vh;
}

.n-layout-content {
  width: 100%;
}

.header {
  background-color: #409eff;
  padding: 16px 20px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.header-content h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.content {
  min-height: calc(100vh - 64px);
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
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