<template>
  <div class="q-pt-md">
    <div class="row">
      <q-card class="my-card col-6 q-mr-md">

        <q-card-section>
          <div class="text-h6">Текущая сессия</div>
        </q-card-section>
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </q-card-section>
      </q-card>
      <q-card class="my-card col-grow">
        <q-card-section>
          <div class="text-h6">Следующая сессия</div>

        </q-card-section>
        <q-card-section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </q-card-section>
      </q-card>
    </div>
    <q-table title="Сессии" row-key="id" :columns="columns" :rows="sessionsData">
      <template v-slot:body-cell-controls="props">
        <q-td :props="props">
          <q-btn unelevated v-for="(i, index) in props.row.controls" :key="index" :color="i.color"
            @click="sesionActions(props.row, i.control)">
            <q-icon :name="i.control" />
          </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td key="status" :props="props">
          <div class="d-flex">
            <q-badge :color="props.row.statusInfo.color">
              {{ props.row.statusInfo.field }}
            </q-badge>
            <!-- v-if="props.row.statusInfo.field === 'Запускается' || props.row.statusInfo.field === 'Запущен'" -->
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchSessions, addSession, removeSession } from 'src/api/sessions'
import { useRoute } from 'vue-router';

import {
  QCalendar,
  addToDate,
  parseTimestamp,
  getDayTimeIdentifier,
  getDate,
  getDateTime,
  diffTimestamp,
  makeDateTime,
  isBetweenDates,
  today,
  parsed,
  parseDate,
  parseTime
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendar.sass'

import { useQuasar, date } from 'quasar'
const q = useQuasar()
const sessions = ref([])
const route = useRoute()

const columns = ref([
  {
    name: "id",
    label: "id",
    field: "id",
    align: "left",
    sortable: true,
  },
  // {
  //   name: "starts_at",
  //   label: "Время начала",
  //   field: "starts_at",
  //   align: "left",
  //   sortable: true,
  // },
  // {
  //   name: "ends_at",
  //   label: "Время окончания",
  //   field: "ends_at",
  //   align: "left",
  //   sortable: true,
  // },
  {
    name: "status",
    label: "Статус",
    field: "status",
    align: "left",
    sortable: true,
  },
  {
    name: "controls",
    label: "Управление",
    field: "controls",
    align: "left",
    sortable: true,
  },
])
function checkStatus(i) {
  switch (i.state) {
    case "CREATED":
      return {
        color: "green",
        field: "Создан",
      };
    case "QUEUED_FOR_START":
      return {
        color: "teal-2",
        field: "Ожидается запуск",
      };
    case "STARTING":
      return {
        color: "teal-4",
        field: "Запускается",
      };
    case "RUNNING":
      return {
        color: "teal-6",
        field: "Запущен",
      };
    case "QUEUED_FOR_STOP":
      return {
        color: "cyan-2",
        field: "Ожидается завершение",
      };
    case "STOPPING":
      return {
        color: "cyan-4",
        field: "Завершается",
      };
    case "FINISHED":
      return {
        color: "cyan-6",
        field: "Закончен",
      };
    case "QUEUED_FOR_CANCEL":
      return {
        color: "red-2",
        field: "Ожидается отмена",
      };
    case "CANCELLING":
      return {
        color: "red-4",
        field: "Отменяется",
      };
    case "CANCELLED":
      return {
        color: "red-6",
        field: "Отменён",
      };
  }
}

const deleteControl = ref({
  control: "edit",
  field: "Изменить",
  color: "grey-6",
})

function getControls(i) {
  if (i.state === "CREATED")
    return [
      {
        control: "edit",
        field: "Изменить",
        color: "grey-6",
      },
      {
        control: "delete",
        field: "Удалить",
        color: "red-6",
      },
    ];
  else if (i.state === "RUNNING")
    return [
      {
        control: "cancel",
        field: "Отменить",
        color: "red-6",
      },
    ];
}
async function sesionActions(session, i) {
  if (i === "edit") {
  } else if (i === "delete") {
    const result = await removeSession(route.params.standId, session);
    console.log('result', result)
    if (result) {
      q.notify({
        // position: this.notificationsPos,
        type: "positive",
        message: "Сессия удалена",
      });
      await init()
    }
  }
}
const sessionsData = ref([])
async function init() {
  sessionsData.value = []
  sessions.value = await fetchSessions(route.params.standId)
  console.log(sessions)
  if (!sessions.value) {
    console.error('Sessions error!!!')
  } else {
    for (let i of sessions.value) {
      let start = parseDate(new Date(i.starts_at));
      let end = parseDate(new Date(i.ends_at));
      sessionsData.value.push(i);
      sessionsData.value[sessionsData.value.length - 1].starts_at = start
      sessionsData.value[sessionsData.value.length - 1].ends_at = end
      sessionsData.value[sessionsData.value.length - 1].statusInfo = checkStatus(i)
      sessionsData.value[sessionsData.value.length - 1].controls = getControls(i)
    }
    console.log(sessionsData.value)
  }

}
onMounted(init())

</script>
