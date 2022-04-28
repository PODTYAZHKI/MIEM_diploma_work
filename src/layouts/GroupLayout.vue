<template>
  <q-page class="column" :class="[$q.screen.gt.xs ? 'q-ma-lg' : ['q-ml-xs', 'q-mr-xs', 'q-mt-lg', 'q-mb-lg', '']]">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Группы" to="/groups" />
      <q-breadcrumbs-el :label="groupData.name" />
    </q-breadcrumbs>
    <div v-if="groupData.name">
      <h3 class="q-mt-none">Группа «{{ groupData.name }}»</h3>
    </div>
    <q-tabs class="text-primary">
      <q-route-tab name="stands" icon="school" label="Стенды" :to='`/groups/${$route.params.groupId}/stands`' />
      <q-route-tab name="users" icon="group" label="Участники" :to='`/groups/${$route.params.groupId}/users`' />
      <q-route-tab name="settings" icon="settings" label="Настройки"
        :to='`/groups/${$route.params.groupId}/settings`' />
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
