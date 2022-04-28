<template>
  <q-page padding class="column">
    <q-inner-loading :showing="loading">
      <q-spinner-cube color="primary" size="4em" />
    </q-inner-loading>
    <div class="q-pa-md q-gutter-md" v-if="groupsList.length === 0 && !loading_error">
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
    <div  class="row items-center q-gutter-lg" v-if="groupsList.length > 0 && !loading">

        <q-card v-for="i in groupsList" :key="i.id" class="col cursor-pointer q-gutter-md"
          style="min-width: 300px; max-width: 300px; min-height: 128px; max-height: 128px;" :v-ripple="ripple"
          @click="goToGroupPage(i)">
          <q-card-section class="row no-wrap justify-between">
            <div class="text-h6">{{ i.name }}</div>
            <div class="col-auto" v-if="canEdit">
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
            </div>
          </q-card-section>
          <q-separator inset />
          <q-card-section>
            <div>{{ i.description }}</div>
          </q-card-section>
        </q-card>

    </div>
    <q-page-sticky v-if="!loading_error && canAdd" position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="buttonAdd()" />
    </q-page-sticky>

    <q-dialog v-model="showAdd" persistent>
      <q-card class="q-pa-md q-pb-none">
        <q-card-section class="row items-center q-mb-md">
          <div class="text-h6 q-mr-md">
            {{
                status === "add" ? "Создание новой группы" : "Изменение группы"
            }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input filled v-model="newGroup.name" :value="newGroup.name" label="Название *" lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Обязательное поле']" />
            <q-input filled v-model="newGroup.description" :value="newGroup.description" label="Описание" />
            <q-btn :label="status === 'add' ? 'Добавить' : 'Обновить'" type="submit" color="primary" />
            <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showWarning">
      <q-card class="q-pa-md">
        <q-card-section class="row items-center q-pa-none q-pb-xs">
          <div class="text-h6">
            Уверены, что хотите удалить группу({{ group.name }})?
          </div>
        </q-card-section>
        <q-card-section class="row justify-center">
          <q-btn color="primary" @click="removeGroup(group.id)" class="q-mr-md">Да</q-btn>
          <q-btn v-close-popup>Нет</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCard">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">{{ this.group.name }}</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div>{{ this.group.description }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list bordered separator v-if="standsList && standsList.length > 0">
            <q-item clickable v-ripple v-for="i in standsList" :key="i.id">
              <q-item-section>{{ i.name }}</q-item-section>
              <q-item-section>{{ i.description }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right" class="row items-end">
          <q-btn color="red" @click="showWarning = true">Удалить</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      ripple: true,
      getCardInfo: false,
      submited: false,
      groupsList: [],
      standsList: [],
      showAdd: false,
      showWarning: false,
      showCard: false,
      newGroup: {
        name: "",
        description: "",
      },
      status: "add",
      group: {
        name: "",
        description: "",
        id: null,
      },
      loading: true,
      loading_error: false,


      canEdit: true,
      canAdd: true,
    };
  },
  async mounted() {
    await this.init();
  },
  methods: {
    // openOptions() {
    //   this.ripple = false;
    //   if (!this.ripple) this.ripple = true
    // },
    async init() {
      try {
        await this.fetchGroups();
      } catch (e) {
        console.error("error", e);
        this.loading_error = true;
      }
      this.loading = false;
    },
    buttonAdd() {
      this.showAdd = true;
      this.status = "add";
      this.onReset();
    },
    optionsActions(i, group) {
      if (i === "изменить") {
        this.cardInfo(group, "update");
        this.showAdd = true;
        this.status = "update";
      } else if (i === "удалить") {
        this.showWarning = true;
        this.cardInfo(group);
      }
    },
    goToGroupPage(i) {
      if (this.ripple) this.$router.push(`/groups/${i.id}`);
    },

    cardInfo(i, status) {
      this.group.name = i.name;
      this.group.description = i.description;
      this.group.id = i.id;
      if (status === "update") {
        this.newGroup.name = i.name;
        this.newGroup.description = i.description;
        console.log("123");
      }
    },
    async fetchStands(id) {
      await this.$axios
        .get("https://constructor.auditory.ru/lab/api/v1/devices", {
          withCredentials: false,
        })
        .then((res) => {
          const allStands = res.data;
          this.standsList = allStands.filter((st) => st.group_id === id);
          console.log("standsList", this.standsList);
        });
    },
    async updateGroups() {
      await this.fetchGroups();
    },
    onSubmit() {
      if (this.status === "add") this.addGroup(this.newGroup);
      else {
        this.updateGroup(this.newGroup);
      }
    },
    onReset() {
      if (this.status === "update") {
        this.newGroup.name = this.group.name;
        this.newGroup.description = this.group.description;
        console.log(this.status);
      } else {
        this.newGroup.name = "";
        this.newGroup.description = "";
      }
    },
    async updateGroup(res) {
      const group = res;
      let response = await this.$axios
        .patch(
          `https://constructor.auditory.ru/lab/api/v1/groups/${this.group.id}`,
          group,
          {
            withCredentials: false,
          }
        )
        .then(() => {
          this.$q.notify({
            position: this.notificationsPos,
            type: "positive",
            message: "Группа обновлена",
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
        this.showAdd = false;
        this.updateGroups();
      }
    },
    async addGroup(res) {
      const group = res;
      let response = await this.$axios
        .post("https://constructor.auditory.ru/lab/api/v1/groups", group, {
          withCredentials: false,
        })
        .then(() => {
          this.$q.notify({
            position: this.notificationsPos,
            type: "positive",
            message: "Группа добавлена",
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
        this.showAdd = false;
        this.onReset();
        this.updateGroups();
      }
    },
    async removeGroup(id) {
      let response = await this.$axios
        .delete(`https://constructor.auditory.ru/lab/api/v1/groups/${id}`, {
          withCredentials: false,
        })
        .then((res) => {
          this.$q.notify({
            position: this.notificationsPos,
            type: "positive",
            message: "Группа удалена",
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
        this.updateGroups();
        this.showWarning = false;
        this.showCard = false;
      }
    },
    async fetchGroups() {
      await this.$axios
        .get("https://constructor.auditory.ru/lab/api/v1/groups", {
          withCredentials: false,
        })
        .then((res) => {
          this.groupsList = res.data;
        });
    },
  },
};
</script>
>
