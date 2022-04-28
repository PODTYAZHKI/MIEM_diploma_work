<template>
  <q-page class="column" :class="[$q.screen.gt.xs ? 'q-ma-lg' : ['q-ml-xs', 'q-mr-xs', 'q-mt-lg', 'q-mb-lg', '']]">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Стенды" to="/stands" />
      <q-breadcrumbs-el :label="standData.name" />
    </q-breadcrumbs>
    <div v-if="standData.name">
      <h3 class="q-mt-none">Стенд «{{ standData.name }}»</h3>
    </div>
    <q-tabs class="text-primary">
      <q-route-tab name="sessions" icon="bookmark_border" label="Мои сессии"
        :to='`/stands/${route.params.groupId}/${route.params.standId}/sessions`' />
      <q-route-tab name="calendar" icon="group" label="Календарь"
        :to='`/stands/${route.params.groupId}/${route.params.standId}/calendar`' />
      <!-- <q-route-tab name="settings" icon="settings" label="Настройки" to='/sessions/settings' /> -->
    </q-tabs>

    <router-view />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchStand } from 'src/api/stands'
import { useRoute } from "vue-router";
const route = useRoute()
const standData = ref([])
async function init() {
  standData.value = await fetchStand(route.params.standId)
}
onMounted(init())
</script>
