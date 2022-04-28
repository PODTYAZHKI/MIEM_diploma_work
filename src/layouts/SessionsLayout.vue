<template>
  <q-page class="column" :class="[$q.screen.gt.xs ? 'q-ma-lg' : ['q-ml-xs', 'q-mr-xs', 'q-mt-lg', 'q-mb-lg', '']]">
    <q-tabs class="text-primary">
      <q-route-tab name="sessions" icon="bookmark_border" label="Мои сессии" to='/sessions/my' />
      <q-route-tab name="calendar" icon="group" label="Календарь" to='/sessions/calendar' />
      <q-route-tab name="settings" icon="settings" label="Настройки"
        to='/sessions/settings' />
    </q-tabs>

    <router-view />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchGroup } from 'src/api/groups'
import { useRoute } from "vue-router";
const route = useRoute()
const groupData = ref([])
async function init() {
  groupData.value = await fetchGroup(route.params.groupId)
}
onMounted(init())
</script>
