<template>
  <q-inner-loading :showing="loading">
    <q-spinner-cube color="primary" size="4em" />
  </q-inner-loading>
  <div class="q-pt-md" v-if="!loading">
    <q-table title="Участники" :rows="userData" :columns="usersColumn" row-key="name" separator="vertical">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn unelevated v-for='(i, index) in props.row.actions' :key='index' :color='i.color'
            @click='groupActions(props.row, i.field)'>
            <q-icon :name='i.icon' />
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="show()" />
    </q-page-sticky>
  </div>
  <q-dialog v-model="showAdd" persistent>
    <q-card class="q-pa-md q-pb-none">
      <q-card-section class="row items-center q-mb-md">
        <div class="text-h6 q-mr-md">
          Добавление новых пользователей
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-chip v-for="user in newUsers" :key="user.value" removable color="primary" text-color="white"
          @remove="removeNewUser(user)">
          {{ user.email }}
        </q-chip>
        <q-select option-value="email" option-label="full_name" v-model="findUser" :options="foundUsers"
          label="Добавить пользователя или группу" filled clearable use-input input-debounce="500" @filter="findUsers">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Нет результатов
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>{{ scope.opt.full_name }}</q-item-label>
                <q-item-label caption>{{
                    scope.opt.email
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select :options="roleList" v-model="userRole"> </q-select>

      </q-card-section>
      <q-card-actions>
        <q-btn type="submit" color="primary" @click="onSubmit()">
          Добавить
        </q-btn>
        <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" @click="onReset()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchUsers, searchUsers, addUsers, removeUser } from 'src/api/users'
import { useQuasar } from 'quasar'
const q = useQuasar()
const loading = ref(true)
const loading_error = ref(false)
const route = useRoute()
const userData = ref([])
async function init() {
  try {
    userData.value = await fetchUsers(route.params.groupId)
    for(let i of userData.value) {
      i.actions = [
        {
          field: 'delete',
          label: 'Удалить',
          icon: 'delete',
          color: 'red'
        }
      ]
    }
    loading.value = false;
  } catch (e) {
    console.error("error", e);
    loading_error.value = true;
  }
}
const showAdd = ref(false)
function show() {
  showAdd.value = true
}
const usersColumn = [

  {
    name: 'full_name',
    label: 'ФИО',
    field: 'full_name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'Почта',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Действия',
    field: 'actions',
    align: 'left',
    sortable: false,
  },
]
const foundUsers = ref([])
const foundUser = ref({})

function findUsers(val, update) {

  update(async () => {
    if (val != "") {
      foundUsers.value = []
      const r = await searchUsers(val)

      if (!r) {
        console.error("User search error!")
      } else {
        foundUsers.value = r
        console.log('response', foundUsers.value)
      }
    }
  })
}
const findUser = computed({
  get() {
    return newUser.value;
  },
  set(val) {
    newUser.value = val;
    addToChip();
  },
})
const newUsers = ref([])
const newUser = ref("")
function addToChip() {
  if (newUsers.value.indexOf(newUser.value) === -1) {
    newUsers.value.push(newUser.value);
    newUser.value = "";
  }
}
function removeNewUser(user) {
  const index = newUsers.value.indexOf(user);
  newUsers.value.splice(index, 1);
}

function onReset() {
  this.newUsers = [];
  this.newUser = "";
}
async function onSubmit() {
  for (let i of newUsers.value) {
    i.role = 'MEMBER'
    i.user_id = i.id
    delete i.id
    console.log('user',i)
    const result = await addUsers(i, route.params.groupId)
    if (result) {
      q.notify({
        // position: this.notificationsPos,
        type: "positive",
        message: "Пользователь добавлен",
      });
      await init()
    }
  }
}

async function groupActions(user, action) {
  if (action === 'delete') {
    const result = await removeUser(user.uid, route.params.groupId)
    if (result) {
      q.notify({
        // position: this.notificationsPos,
        type: "positive",
        message: "Пользователь удален",
      });
      await init()
    }
  }
}

onMounted(init())
</script>
