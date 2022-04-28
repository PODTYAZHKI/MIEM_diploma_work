<template>
  <q-page padding class="column">
    <q-inner-loading :showing="loading">
      <q-spinner-cube color="primary" size="4em" />
    </q-inner-loading>
    <div class="q-pa-md q-gutter-md" v-if="standsList.length === 0 && !loading_error">
      <q-card class="q-pa-md text-center" flat bordered>
        <q-card-section>
          <div class="text-overline text-center">
            <q-icon name="info" class="text-grey" style="font-size: 4rem" />
          </div>
          <div class="text-h5 q-mt-sm q-mb-xs">Стенды не найдены :(</div>
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
    <div v-if="standsList.length > 0 && !loading">
      <div>
        <span class="row q-gutter-lg">
          <q-card v-for="i in standsList" :key="i.name" class="col-grow cursor-pointer" style="min-width: 600px"
             @click="$router.push(`/stands/${i.group_id}/${i.id}/calendar`)">
            <q-card-section class="full-width">
                  <div class="text-h6 row justify-between items-center">
                    {{ i.name }}
                    <div class="row no-wrap items-center">
                      <div class="col-auto">
                        <q-btn color="grey-7" round flat icon="more_vert" @click="ripple = false">
                          <q-menu cover auto-close anchor="top right" self="top left" @hide="ripple = true">
                            <q-list>
                              <q-item clickable @click="optionsActions('изменить', i)">
                                <q-item-section>Изменить</q-item-section>
                              </q-item>
                              <q-item clickable @click="optionsActions('удалить', i)">
                                <q-item-section>Удалить</q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-btn>
                        <!-- <q-btn color="grey-7" round flat icon="edit">
            </q-btn> -->
                      </div>
                      <q-avatar size="xs" :color="getColor(i.group_id)" class="q-ml-xs">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          <strong>Группа: </strong>
                          {{ groupTooltip(i.group_id) }}
                        </q-tooltip>
                      </q-avatar>
                    </div>
                  </div>
                  <!-- <div class="text-subtitle2">{{ i.description }}</div> -->
                </q-card-section>
          </q-card>
        </span>
      </div>
    </div>
    <q-page-sticky v-if="!loading_error" position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="buttonAdd()" />
    </q-page-sticky>
    <q-dialog v-model="showAdd" persistent>
      <q-card>
        <q-card-section class="row">
          <div class="text-h6">
            {{
                status === "add" ? "Создание нового стенда" : "Измененеи стенда"
            }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-select v-if="status === 'add'" outlined v-model="groupId" :options="groupsNames" label="Выберите группу"
              lazy-rules :rules="[(val) => val || 'Обязательное поле']" />
            <q-input filled v-model="newStand.name" label="Название *" lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Обязательное поле']" />
            <q-input filled readonly v-model="newStand.access_type" disabled label="Тип стенда *" lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Обязательное поле']" />
            <q-input filled v-model="newStand.host" label="Хост *" lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Обязательное поле']" />
            <q-input filled v-model.number="newStand.port" label="Порт *" lazy-rules
              :rules="[(val) => val || 'Обязательное поле']" />
            <q-input filled v-model="newStand.username" label="Логин *" lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Обязательное поле']" />
            <q-input filled v-model="newStand.password" label="Пароль *" lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Обязательное поле']" />

            <q-toggle v-model="newStand.is_enabled" label="Стенд активен" />
            <q-toggle v-model="newStand.is_shared_user_enabled" label="Общий доступ активен" />
            <q-input v-if="newStand.is_shared_user_enabled" filled v-model="newStand.shared_user" label="Общий логин *"
              lazy-rules :rules="[(val) => (val && val.length > 0) || 'Обязательное поле']" />
            <q-input v-if="newStand.is_shared_user_enabled" filled v-model="newStand.shared_password"
              label="Общий пароль *" lazy-rules :rules="[(val) => (val && val.length > 0) || 'Обязательное поле']" />

            <div>
              <q-btn label="Добавить" type="submit" color="primary" />
              <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>

        <!-- <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions> -->
      </q-card>
    </q-dialog>

    <q-dialog v-model="showWarning">
      <q-card class="q-pa-md">
        <q-card-section class="row items-center q-pa-none q-pb-xs">
          <div class="text-h6">
            Уверены, что хотите удалить стенд({{ stand.name }})?
          </div>
        </q-card-section>
        <q-card-section class="row justify-center">
          <q-btn color="primary" @click="removeStand(stand.id)" class="q-mr-md">Да</q-btn>
          <q-btn v-close-popup>Нет</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { fetchGroups } from 'src/api/groups'
import {api} from 'boot/axios'
export default {
  data() {api
    return {
      ripple: true,
      getCardInfo: false,
      showWarning: false,
      showAdd: false,
      groupId: null,
      groupsList: [],
      groupsNames: [],
      standsList: [],
      status: "add",
      newStand: {
        name: "",
        access_type: "ONVIF",
        host: "",
        port: null,
        username: "",
        password: "",
        is_enabled: true,
        is_shared_user_enabled: true,
        shared_user: "",
        shared_password: "",
      },
      stand: {
        id: null,
        name: "",
        access_type: "ONVIF",
        host: "",
        port: null,
        username: "",
        password: "",
        is_enabled: true,
        is_shared_user_enabled: true,
        shared_user: "",
        shared_password: "",
      },
      colors: ["primary", "orange", "black", "green"],
      loading: true,
      loading_error: false,
    };
  },

  async mounted() {
    await this.init();
  },
  methods: {
    buttonAdd() {
      this.showAdd = true;
      this.status = "add";
      this.onReset();
    },
    optionsActions(i, stand) {
      if (i === "изменить") {
        this.cardInfo(stand, "update");
        this.showAdd = true;
        this.status = "update";
      } else if (i === "удалить") {
        this.showWarning = true;
        this.cardInfo(stand);
      }
    },
    goToStandPage(i) {
      // if (this.ripple) this.$router.push(`/stands/${i.group_id}/${i.id}`);
    },
    cardInfo(i, status) {
      this.stand.id = i.id;
      this.stand.name = i.name;
      this.stand.host = i.host;
      this.stand.port = i.port;
      this.stand.username = i.username;
      this.stand.password = i.password;
      this.stand.is_enabled = i.is_enabled;
      this.stand.is_shared_user_enabled = i.is_shared_user_enabled;
      this.stand.shared_user = i.shared_user;
      this.stand.shared_password = i.shared_password;
      if (status === "update") {
        // this.newStand.id = i.id;
        this.newStand.name = i.name;
        this.newStand.host = i.host;
        this.newStand.port = i.port;
        this.newStand.username = i.username;
        this.newStand.password = i.password;
        this.newStand.is_enabled = i.is_enabled;
        this.newStand.is_shared_user_enabled = i.is_shared_user_enabled;
        this.newStand.shared_user = i.shared_user;
        this.newStand.shared_password = i.shared_password;
      }
    },
    async init() {
      try {
        await this.fetchGroups();
        await this.fetchStands();
      } catch (e) {
        console.error("error", e);
        this.loading_error = true;
      }
      this.loading = false;
    },
    getColor(i) {
      for (let j of this.groupsList) {
        if (j.id === i) return j.color;
      }
    },
    groupTooltip(i) {
      for (let j of this.groupsList) {
        if (j.id === i) return j.name;
      }
    },
    async updateStands() {
      await this.fetchGroups();
      await this.fetchStands();
    },
    async removeStand(id) {
      let response = await api
        .delete(`https://constructor.auditory.ru/lab/api/v1/devices/${id}`, {
          withCredentials: false,
        })
        .then((res) => {
          this.$q.notify({
            position: this.notificationsPos,
            type: "positive",
            message: "Стенд удален",
          });
          return true;
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            position: this.notificationsPos,
            icon: "warning",
            type: "negative",
            multiLine: true,
            message: "Возникла ошибка!",
          });
        });
      console.log("response", response);
      if (response) {
        this.updateStands();
        this.showWarning = false;
      }
    },
    async addStand(res) {
      const stand = res;
      let response = await api
        .post("https://constructor.auditory.ru/lab/api/v1/devices", stand, {
          withCredentials: false,
        })
        .then(() => {
          this.$q.notify({
            position: this.notificationsPos,
            type: "positive",
            message: "Стенд добавлен",
          });
          return true;
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            position: this.notificationsPos,
            icon: "warning",
            type: "negative",
            multiLine: true,
            message: "Возникла ошибка!",
          });
        });
      if (response) {
        this.showAdd = false;
        this.onReset();
        this.updateStands();
      }
    },
    async fetchStands() {
      await api
        .get("https://constructor.auditory.ru/lab/api/v1/devices", {
          withCredentials: false,
        })
        .then((res) => {
          this.standsList = res.data;
          console.log("standsList", this.standsList);
        });
    },
    async fetchGroups() {
      // Получить список групп и если есть только одна доступная группа, то this.groupId = res.data.id (example),
      // иначе - в this.options добавляем все названия доступных групп
      const result = await fetchGroups()
      if (!result) {

      } else {
        this.groupsList = result
        if (this.groupsList.length === 1) {
          // this.groupId = this.groupsList[0].id;
          this.groupsNames.push({
            label: this.groupsList[0].name,
            value: this.groupsList[0].id,
          });
          this.groupsList[0].color = "primary";
        } else
          for (let i of result) {
            this.groupsNames.push({
              label: i.name,
              value: i.id,
            });
            i.color = this.colors.pop();
          }
      }
      // await api
      //   .get("https://constructor.auditory.ru/lab/api/v1/groups", {
      //     withCredentials: false,
      //   })
      //   .then((res) => {
      //     this.groupsList = res.data;
      //     if (res.data.length === 1) {
      //       // this.groupId = this.groupsList[0].id;
      //       this.groupsNames.push({
      //         label: this.groupsList[0].name,
      //         value: this.groupsList[0].id,
      //       });
      //       this.groupsList[0].color = "primary";
      //     } else
      //       for (let i of this.groupsList) {
      //         this.groupsNames.push({
      //           label: i.name,
      //           value: i.id,
      //         });
      //         i.color = this.colors.pop();
      //       }
      //     console.log("groupsList", this.groupsList);
      //     console.log("groupsNames", this.groupsNames);
      //   });
    },

    onSubmit() {
      this.newStand["group_id"] = this.groupId.value;
      this.newStand["is_session_limit_enabled"] = false;
      this.newStand["session_limit_count"] = 1;
      this.addStand(this.newStand);
    },

    onReset() {
      this.newStand.id = null;
      this.newStand.name = "";
      this.newStand.host = "";
      this.newStand.port = null;
      this.newStand.username = "";
      this.newStand.password = "";
      this.newStand.is_enabled = true;
      this.newStand.is_shared_user_enabled = true;
      this.newStand.shared_user = "";
      this.newStand.shared_password = "";
    },
  },
};
</script>
<style lang="" scoped></style>
