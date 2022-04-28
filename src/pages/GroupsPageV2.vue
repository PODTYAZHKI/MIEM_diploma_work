<template>
  <q-page class="column" :class="[$q.screen.gt.xs ? 'q-ma-lg' : ['q-ml-xs', 'q-mr-xs', 'q-mt-lg', 'q-mb-lg', '']]">

    <!-- <div class="row ">
      <q-card class="group-card" v-for="group in groupsList" :key="group.id">
        <q-card-section>
          <div class="text-h6">{{group.name}}</div>
        </q-card-section>
        <q-card-section>
          {{group.description}}
        </q-card-section>
      </q-card>
    </div> -->
    <q-inner-loading :showing="loading">
      <q-spinner-cube color="primary" size="4em" />
    </q-inner-loading>
    <div class="q-pa-md q-gutter-md" v-if="groupsList.length == 0 && !loading_error">
      <q-card class="q-pa-md text-center" flat bordered>
        <q-card-section>
          <div class="text-overline text-center">
            <q-icon name="info" class="text-grey" style="font-size: 4rem" />
          </div>
          <div class="text-h5 q-mt-sm q-mb-xs">Группы не найдены :(</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row justify-center" v-if="!loading && loading_error">
      <div class="col-md-6">
        <div class="q-pa-md q-gutter-md">
          <q-card class="q-pa-md text-center" flat bordered>
            <q-card-section>
              <div class="text-overline text-center">
                <q-icon name="warning" class="text-grey" style="font-size: 4rem" />
              </div>
              <div class="text-h5 q-mt-sm q-mb-xs">Ошибка</div>
              <p />
              Не удалось получить данные с сервера.
              <p />
              Попробуйте перезагрузить страницу или попробовать снова. Если
              проблема сохраняется длительное время, пожалуйста, обратитесь в
              техподдержку.<br />
            </q-card-section>
            <q-card-actions>
              <q-space />
              <q-btn color="primary" label="Попробовать ещё раз" icon="refresh" @click="init()" />
              <q-space />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
    <div class="row items-center q-gutter-lg" :class="[$q.screen.lt.md ? 'justify-center' : '']"
      v-if="groupsList.length > 0 && !loading">

      <q-card v-for="i in groupsList" :key="i.id" class="col cursor-pointer group-card" @click="$router.push(`/groups/${i.id}/users`)">
        <q-card-section class=" row justify-between">
          <div class="text-h6">{{ i.name }}</div>
          <!-- <div class="col-auto" v-if="canEdit">
            <q-btn color="grey-7" round flat icon="more_vert" @click="ripple = false">
              <q-menu cover auto-close anchor="top right" self="top left" @hide="ripple = true">
                <q-list v-if="canEdit">
                  <q-item clickable @click="optionsActions('изменить', i)">
                    <q-item-section>Изменить</q-item-section>
                  </q-item>
                  <q-item clickable @click="optionsActions('удалить', i)">
                    <q-item-section>Удалить</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div> -->
        </q-card-section>
        <q-separator inset />
        <q-card-section class="row wrap">
          <div>{{ i.description }}</div>
        </q-card-section>
      </q-card>

    </div>

  </q-page>
</template>



<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { api } from 'boot/axios';
// import groups from "api/groups";

const loading = ref(true)
const loading_error = ref(false)
const mockData = [
  {
    id: 1,
    name: 'Name',
    description: 'Description'
  },
  {
    id: 2,
    name: 'Name1',
    description: 'Description'
  },
  {
    id: 3,
    name: 'Name2',
    description: 'Description'
  },
  {
    id: 4,
    name: 'Name2',
    description: 'Description'
  },
  {
    id: 54,
    name: 'Name2',
    description: 'Description'
  },

]
const groupsList = ref([])
const fetchGroups = async () => {
  await api
    .get("https://constructor.auditory.ru/lab/api/v1/groups", {
      withCredentials: false,
    })
    .then((res) => {
      groupsList.value = res.data;
    });
}
const init = async () => {
  try {
    fetchGroups()
  } catch (e) {
    console.error("error", e);
    loading_error.value = true;
  }
  loading.value = false;
}
onMounted(init)
</script>

<style lang="scss" scoped>
.group-card {
  max-width: 290px;
  min-width: 250px;
  min-height: 118px;
  // height: 200px;
  // width: 300px;
}
</style>
