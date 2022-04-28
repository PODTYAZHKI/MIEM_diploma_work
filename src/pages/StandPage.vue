<template>
  <q-page padding>
    <q-inner-loading :showing="loading">
      <q-spinner-cube color="primary" size="4em" />
    </q-inner-loading>
    <div v-if="!loading">
      <div v-if="standData.name">
        <h3 class="q-mt-none">Стедн «{{ standData.name }}»</h3>
      </div>

      <div class="q-gutter-sm q-mb-sm">
        <q-btn @click="$router.go(-1)">Назад</q-btn>
        <q-radio v-model="table" val="stands" label="Стенды" />
        <q-radio v-model="table" val="users" label="Участники" />
      </div>
      <q-table
        :title="table === 'stands' ? 'Стенды' : 'Участники'"
        row-key="name"
        :columns="table === 'stands' ? standsColumn : usersColumn"
        :data="table === 'stands' ? standsByGroup : usersData"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="description" :props="props">
              {{ props.row.description || "-" }}
            </q-td>
            <q-td key="access_type" :props="props">
              {{ props.row.access_type }}
            </q-td>
            <q-td key="host" :props="props">
              {{ props.row.host }}
            </q-td>
            <q-td key="port" :props="props">
              {{ props.row.port }}
            </q-td>
            <q-td key="created_at" :props="props">
              {{ displayTime(props.row.created_at) }}
            </q-td>
            <q-td key="updated_at" :props="props">
              {{ displayTime(props.row.updated_at) }}
            </q-td>

            <!-- <q-td key="status" :props="props">
            <q-badge :color="props.row.statusInfo.color">
              {{ props.row.statusInfo.field }}
            </q-badge>
          </q-td> -->
            <!-- <q-td key="controls" :props="props" class="q-gutter-xs">
            <q-badge
              v-for="(i, index) in props.row.controls"
              :color="i.color"
              :key="index"
              class="cursor-pointer"
              @click="clickControl(props.row, i)"
            >
              {{ i.field }}
            </q-badge>
          </q-td> -->
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      groupData: null,
      standsByGroup: [],
      standData: [],
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
      usersColumn: [],
      usersData: [],
      loading: true,
      loading_error: false,
    };
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async init() {
      try {
        await this.fetchStand();

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
      return `${date.getDate() <= 10 ? "0" : ""}${date.getDate()}/${
        date.getMonth() + 1 <= 10 ? "0" : ""
      }${date.getMonth() + 1}/${date.getFullYear()} в ${
        date.getHours() <= 10 ? "0" : ""
      }${date.getHours()}:${
        date.getMinutes() <= 10 ? "0" : ""
      }${date.getMinutes()}`;
    },
    async fetchStand() {
      await this.$axios
        .get(`https://constructor.auditory.ru/lab/api/v1/devices/${this.$route.params.standId}`, {
          withCredentials: false,
        })
        .then((res) => {
          this.standData = res.data
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
  },
};
</script>

<style></style>
