<template>
  <q-page class="column" :class="[$q.screen.gt.xs ? 'q-ma-lg' : ['q-ml-xs', 'q-mr-xs', 'q-mt-lg', 'q-mb-lg', '']]">
    <!-- <q-breadcrumbs>
      <q-breadcrumbs-el label="Группы" to="/groups" />
      <q-breadcrumbs-el :label="groupData.name" />
    </q-breadcrumbs> -->
    <q-tabs v-model="tab" class="text-primary">
        <q-tab name="stands" icon="school" label="Стенды" />
        <q-tab name="users" icon="group" label="Участники" />
        <q-tab name="settings" icon="settings" label="Настройки" />
      </q-tabs>
  </q-page>
</template>
