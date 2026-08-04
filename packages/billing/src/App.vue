<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="billing-app">
    <!-- keep-alive: preserve component state across /overview <-> /orders navigation -->
    <RouterView v-slot="{ Component }">
      <KeepAlive :include="['Overview', 'Orders']">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </div>
</template>

<style scoped>
.billing-app {
  padding: 0;
}
</style>