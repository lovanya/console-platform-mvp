<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="billing-app">
    <!-- keep-alive: preserve component state across /overview <-> /orders navigation -->
    <!-- max=10: keep up to 10 most recent route components cached (default is 1 = LIFO) -->
    <RouterView v-slot="{ Component }">
      <KeepAlive :include="['Overview', 'Orders']" :max="10">
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