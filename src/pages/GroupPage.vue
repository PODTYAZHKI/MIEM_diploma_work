<template>
  <q-page padding>
    <q-inner-loading :showing="loading">
      <q-spinner-cube color="primary" size="4em" />
    </q-inner-loading>
    <div v-if="!loading">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Группы" to="/groups" />
        <q-breadcrumbs-el :label="groupData.name" />
      </q-breadcrumbs>

      <div v-if="groupData.name">
        <h3 class="q-mt-none">Группа «{{ groupData.name }}»</h3>
      </div>
      <!-- <div v-if="groupData.description">
        <div class="q-mt-none text-subtitle1">{{ groupData.description }}</div>
      </div> -->
      <q-tabs v-model="tab" class="text-primary">
        <q-tab name="stands" icon="school" label="Стенды" />
        <q-tab name="users" icon="group" label="Участники" />
        <q-tab name="settings" icon="settings" label="Настройки" />
      </q-tabs>
      <div class="q-gutter-sm q-mb-sm">
        <!-- <q-btn @click="$router.go(-1)">Назад</q-btn> -->
        <q-radio v-model="table" val="stands" label="Стенды" />
        <q-radio v-model="table" val="users" label="Участники" />
      </div>
      <q-table :title="table === 'stands' ? 'Стенды' : 'Участники'" row-key="name"
        :columns="table === 'stands' ? standsColumn : usersColumn"
        :data="table === 'stands' ? standsByGroup : usersData">
        <template v-slot:body="props" v-if="table === 'stands'">
          <q-tr :props="props" @dblclick="updateStandCard(props.row)" class="clickable">
            <q-td key="name" :props="props">
              <div>
                <!-- <q-btn icon="close" flat round dense v-if="canEdit" @click="removeStand(props.row.id)"/> -->
                {{ props.row.name || "-" }}
              </div>
            </q-td>
            <q-td key="description" :props="props" v-if="table === 'stands'">
              {{ props.row.description || "-" }}
            </q-td>
            <q-td key="access_type" :props="props" v-if="table === 'stands'">
              {{ props.row.access_type || "-" }}
            </q-td>
            <q-td key="host" :props="props" v-if="table === 'stands'">
              {{ props.row.host || "-" }}
            </q-td>
            <q-td key="port" :props="props" v-if="table === 'stands'">
              {{ props.row.port || "-" }}
            </q-td>
            <q-td key="created_at" :props="props" v-if="table === 'stands'">
              {{ displayTime(props.row.created_at) || "-" }}
            </q-td>
            <q-td key="updated_at" :props="props" v-if="table === 'stands'">
              {{ displayTime(props.row.updated_at) || "-" }}
            </q-td>
          </q-tr>
        </template>
        <template v-slot:body="props" v-else>
          <q-tr :props="props" class="clickable">
            <q-td key="full_name" :props="props">
              <q-btn icon="close" flat round dense v-if="canEdit" @click="removeUser(props.row.id)" />
              {{ props.row.full_name || "-" }}
            </q-td>

            <q-td key="email" :props="props">
              {{ props.row.email || "-" }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-page-sticky v-if="
        !loading_error &&
        ((canAddUsers && table === 'users') ||
          (canAddStands && table === 'stands'))
      " position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="primary" @click="buttonAdd()" />
      </q-page-sticky>
    </div>
    <q-dialog v-model="showAdd" persistent>
      <q-card class="q-pa-md q-pb-none">
        <q-card-section class="row items-center q-mb-md">
          <div class="text-h6 q-mr-md">
            {{
                status === "addStand"
                  ? "Добавление нового стенда"
                  : status === "addUsers"
                    ? "Добавление новых пользователей"
                    : "Изменение стенда"
            }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="table === 'stands'">
          <q-scroll-area style="height: 400px">
            <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              <!-- <q-select
              v-if="status === 'add'"
              outlined
              v-model="groupId"
              :options="groupsNames"
              label="Выберите группу"
              lazy-rules
              :rules="[(val) => val || 'Обязательное поле']"
            /> -->
              <q-input filled v-model="newStand.name" label="Название *" lazy-rules :rules="[
                (val) => (val && val.length > 0) || 'Обязательное поле',
              ]" />
              <q-input filled readonly v-model="newStand.access_type" disabled label="Тип стенда *" lazy-rules :rules="[
                (val) => (val && val.length > 0) || 'Обязательное поле',
              ]" />
              <q-input filled v-model="newStand.host" label="Хост *" lazy-rules :rules="[
                (val) => (val && val.length > 0) || 'Обязательное поле',
              ]" />
              <q-input filled v-model.number="newStand.port" label="Порт *" lazy-rules
                :rules="[(val) => val || 'Обязательное поле']" />
              <q-input filled v-model="newStand.username" label="Логин *" lazy-rules :rules="[
                (val) => (val && val.length > 0) || 'Обязательное поле',
              ]" />
              <q-input filled v-model="newStand.password" label="Пароль *" lazy-rules :rules="[
                (val) => (val && val.length > 0) || 'Обязательное поле',
              ]" />

              <q-toggle v-model="newStand.is_enabled" label="Стенд активен" />
              <q-toggle v-model="newStand.is_shared_user_enabled" label="Общий доступ активен" />
              <q-input v-if="newStand.is_shared_user_enabled" filled v-model="newStand.shared_user"
                label="Общий логин *" lazy-rules :rules="[
                  (val) => (val && val.length > 0) || 'Обязательное поле',
                ]" />
              <q-input v-if="newStand.is_shared_user_enabled" filled v-model="newStand.shared_password"
                label="Общий пароль *" lazy-rules :rules="[
                  (val) => (val && val.length > 0) || 'Обязательное поле',
                ]" />
            </q-form>
          </q-scroll-area>
        </q-card-section>

        <q-card-section v-else>
          <q-chip v-for="user in newUsers" :key="user.value" removable color="primary" text-color="white"
            @remove="removeNewUser(user)">
            {{ user.email }}
          </q-chip>
          <q-select option-value="email" option-label="full_name" v-model="findUser" use-input
            :input-debounce="debounce" label="Добавить пользователя или группу" :options="foundUsers" @filter="filterFn"
            ref="userInput" options-cover>
            <!-- <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>{{
                    scope.opt.description
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </template> -->
            <!-- <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Нет результатов
                </q-item-section>
              </q-item>
            </template> -->
          </q-select>
          <q-select :options="roleList" v-model="userRole"> </q-select>
          <!-- <q-select
            filled
            v-model="findUser"
            use-input
            use-chips
            multiple
            :input-debounce="debounce"

            :options="foundUsers"
            @filter="filterFn"
          /> -->
        </q-card-section>
        <q-card-actions>
          <q-btn type="submit" color="primary" @click="onSubmit()">
            {{ status === "updateStand" ? "Обновить" : "Добавить" }}
          </q-btn>
          <q-btn label="Сбросить" type="reset" color="primary" flat class="q-ml-sm" @click="onReset()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      userRole: {
        label: "Участник",
        value: "MEMBER",
      },
      roleList: [
        {
          label: "Участник",
          value: "MEMBER",
        },
        {
          label: "Редактор",
          value: "EDITOR",
        },
        {
          label: "Владелец",
          value: "OWNER",
        },
      ],
      GroupDataTest: {
        name: "test",
        description: "test",
      },
      debounce: 1500,

      foundUsers: [],
      canEdit: true,
      canAddUsers: true,
      canAddStands: true,
      emailSuffix: "@miem.hse.ru",
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
      newUsers: [],
      newUser: "",
      groupData: null,
      standsByGroup: [],

      table: "stands",
      standsColumn: [
        {
          name: "name",
          label: "Название стенда",
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "description",
          label: "Описание",
          field: "description",
          align: "left",
          sortable: true,
        },
        {
          name: "access_type",
          label: "Тип стенда",
          field: "access_type",
          align: "left",
          sortable: true,
        },
        {
          name: "host",
          label: "Хост",
          field: "host",
          align: "left",
          sortable: true,
        },
        {
          name: "port",
          label: "Порт",
          field: "port",
          align: "left",
          sortable: true,
        },
        {
          name: "created_at",
          label: "Создан",
          field: "created_at",
          align: "left",
          sortable: true,
        },
        {
          name: "updated_at",
          label: "Обновлён",
          field: "updated_at",
          align: "left",
          sortable: true,
        },
      ],
      standsData: [],
      usersColumn: [
        {
          name: "full_name",
          label: "ФИО",
          field: "full_name",
          align: "left",
          sortable: true,
        },
        {
          name: "email",
          label: "Почта",
          field: "email",
          align: "left",
          sortable: true,
        },
      ],
      usersData: [],
      loading: true,
      loading_error: false,
      showAdd: false,
      status: "addStand",
      usersList: [
        {
          name: "Сергей",
          surName: "Музычук",
          group: "БИВ182",
          email: "smmuzychuk@miem.hse.ru",
        },
      ],
    };
  },
  async mounted() {
    await this.init();
  },
  computed: {
    findUser: {
      get() {
        return this.newUser;
      },
      set(val) {
        this.newUser = val;
        this.addToChip();
      },
    },
  },
  methods: {
    async removeUser(i) {

      let response = await this.$axios
        .delete(`https://constructor.auditory.ru/lab/api/v1/groups/${this.$route.params.groupId}/users/${i}`, {
          withCredentials: false,
        })
        .then((res) => {
          this.$q.notify({
            position: this.notificationsPos,
            type: "positive",
            message: "Пользователь удален",
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
        this.fetchUsers();
        // this.showWarning = false;
      }
    },
    filterFn(val, update, abort) {
      setTimeout(() => {
        update(() => {
          this.foundUsers = [];
          if (val === "") {
          } else {
            this.getUsers(val);
          }
        });
      }, this.debounce);
    },
    async getUsers(i) {
      var url = `https://constructor.auditory.ru/lab/api/v1/users?query=${i}`;
      var users = [];
      // console.log(url)
      await this.$axios
        .get(url, {
          withCredentials: false,
        })
        .then((res) => {
          for (let i of res.data) {
            // users.push(i);
            users.push({
              created_at: i.created_at,
              email: i.email,
              full_name: i.full_name,
              user_id: i.id,
              is_admin: false,
              is_suspended: i.is_suspended,
            });
            // console.log(i);
          }
          this.foundUsers = users;
          console.log("foundUsers", this.foundUsers);
        });
    },
    async updateStandCard(i) {
      if (this.canEdit) {
        let username;
        let password;
        await this.$axios
          .get(`https://constructor.auditory.ru/lab/api/v1/devices/${i.id}`, {
            withCredentials: false,
          })
          .then((res) => {
            this.newStand.name = res.data.name;
            this.newStand.host = res.data.host;
            this.newStand.port = res.data.port;
            this.newStand.username = res.data.username;
            this.newStand.password = res.data.password;
            this.newStand.is_enabled = res.data.is_enabled;
            this.newStand.is_shared_user_enabled =
              res.data.is_shared_user_enabled;
            this.newStand.shared_user = res.data.shared_user;
            this.newStand.shared_password = res.data.shared_password;
          });
        console.log(i);
        this.showAdd = true;
        this.status = "updateStand";
      }
    },
    removeNewUser(user) {
      const index = this.newUsers.indexOf(user);
      console.log("index: " + index);
      this.newUsers.splice(index, 1);
      console.log("userArray", this.newUsers);
    },
    addToChip() {
      if (this.newUsers.indexOf(this.newUser) === -1) {
        this.newUsers.push(this.newUser);
        this.newUser = "";
        this.$nextTick(() => {
          const inputRef = this.$refs.userInput;
          inputRef.focus();
        });
      }
    },
    onReset() {
      if (this.status === "addUsers") {
        this.newUsers = [];
        this.newUser = "";
        this.emailSuffix = "@miem.hse.ru";
      } else if (this.status === "addStand") {
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
      }
    },
    async updateStand(res) {
      const stand = res;
      let response = await this.$axios
        .patch("https://constructor.auditory.ru/lab/api/v1/devices", stand, {
          withCredentials: false,
        })
        .then(() => {
          this.$q.notify({
            position: this.notificationsPos,
            type: "positive",
            message: "Стенд обновлён",
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
    onSubmit() {
      if (this.status === "addStand") {
        this.newStand["group_id"] = this.$route.params.groupId;
        this.newStand["is_session_limit_enabled"] = false;
        this.newStand["session_limit_count"] = 1;
        this.addStand(this.newStand);
      } else if (this.status === "addUsers") {
        console.log("users", this.newUsers);

        for (let i of this.newUsers) {
          i.role = this.userRole.value;
          i.expires_at = null;
          this.addUsers(i);
        }
      } else if (this.status === "updateStand") {
        this.updateStand(this.newStand);
      } else if (this.status === "updateUser") {
      }
    },
    buttonAdd() {
      this.showAdd = true;
      this.table === "stands"
        ? (this.status = "addStand")
        : (this.status = "addUsers");
      this.onReset();
      console.log("table", this.table);
      console.log("status", this.status);
    },

    async init() {
      try {
        await this.fetchGroupById();
        await this.fetchStandsByGroup();
        await this.fetchUsers();

        this.loading = false;
      } catch (e) {
        console.error("error", e);
        this.loading_error = true;
      }
    },
    getCalendarFromat(date, format) {
      if (format === "yyyy-mm-dd") {
        var d = date.split("/");
        var dd = d[0];
        var mm = d[1];
        var yyyy = d[2];
        return `${yyyy}-${mm}-${dd}`;
      }
      if (format === "dd/mm/yyyy") {
        var d = date.split("-");
        var yyyy = d[0];
        var mm = d[1];
        var dd = d[2];
        return `${dd}/${mm}/${yyyy}`;
      }
    },
    displayTime(d) {
      let date = new Date(Date.parse(d));
      var display = `${date.getDate() <= 10 ? "0" : ""}${date.getDate()}/${date.getMonth() + 1 <= 10 ? "0" : ""
        }${date.getMonth() + 1}/${date.getFullYear()} в ${date.getHours() <= 10 ? "0" : ""
        }${date.getHours()}:${date.getMinutes() <= 10 ? "0" : ""
        }${date.getMinutes()}`;
      console.log(display);
      return display;
    },
    async fetchGroupById() {
      console.log(this.$route.params.groupId);
      await this.$axios
        .get(
          `https://constructor.auditory.ru/lab/api/v1/groups/${this.$route.params.groupId}`,
          {
            withCredentials: false,
          }
        )
        .then((res) => {
          this.groupData = res.data;
        });
      console.log("groupData2", this.groupData);
    },
    async fetchStandsByGroup() {
      await this.$axios
        .get("https://constructor.auditory.ru/lab/api/v1/devices", {
          withCredentials: false,
        })
        .then((res) => {
          this.standsByGroup = res.data.filter((i) => {
            return i.group_id == this.$route.params.groupId;
          });
          // for (let i of res.data) {
          //   if (i.group_id == this.$route.params.groupId) {
          //     stands.push(
          //       {
          //         id: i.id,
          //         name: i.name,
          //         description: i.description,
          //         created_at: i.created_at,
          //         updated_at: i.updated_at,
          //         access_type: i.access_type,
          //         host: i.host,
          //         port: i.port,
          //       }
          //     )
          //   }
          // }
        });
    },
    async fetchUsers() {
      await this.$axios
        .get(
          `https://constructor.auditory.ru/lab/api/v1/groups/${this.$route.params.groupId}/users`,
          {
            withCredentials: false,
          }
        )
        .then((res) => {
          this.usersData = res.data;
        });
    },
    async updateStands() {
      await this.fetchGroupById();
      await this.fetchStandsByGroup();
    },
    async addUsers(res) {
      const user = res;
      let response = await this.$axios
        .post(
          `https://constructor.auditory.ru/lab/api/v1/groups/${this.$route.params.groupId}/users`,
          res,
          {
            withCredentials: false,
          }
        )
        .then(() => {
          this.$q.notify({
            position: this.notificationsPos,
            type: "positive",
            message: "Пользователь добавлен",
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
        this.fetchUsers();
      }
    },

    async addStand(res) {
      const stand = res;
      let response = await this.$axios
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
    async removeStand(id) {
      let response = await this.$axios
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
  },
};
</script>

<style>
</style>
