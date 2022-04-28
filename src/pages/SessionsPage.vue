<template>
  <q-page padding>
    <q-inner-loading :showing='loading'>
      <q-spinner-cube color='primary' size='4em' />
    </q-inner-loading>
    <div
      class='q-pa-md q-gutter-md'
      v-if='sessionsList.length === 0 && !loading_error'
    >
      <q-card class='q-pa-md text-center' flat bordered>
        <q-card-section>
          <div class='text-overline text-center'>
            <q-icon name='info' class='text-grey' style='font-size: 4rem' />
          </div>
          <div class='text-h5 q-mt-sm q-mb-xs'>Сессии не найдены :(</div>
        </q-card-section>
      </q-card>
    </div>
    <div class='row justify-center' v-if='!loading && loading_error'>
      <div class='col-md-6'>
        <div class='q-pa-md q-gutter-md'>
          <q-card class='q-pa-md text-center' flat bordered>
            <q-card-section>
              <div class='text-overline text-center'>
                <q-icon
                  name='warning'
                  class='text-grey'
                  style='font-size: 4rem'
                />
              </div>
              <div class='text-h5 q-mt-sm q-mb-xs'>Ошибка</div>
              <p />
              Не удалось получить данные с сервера.
              <p />
              Попробуйте перезагрузить страницу или попробовать снова. Если
              проблема сохраняется длительное время, пожалуйста, обратитесь в
              техподдержку.<br />
            </q-card-section>
            <q-card-actions>
              <q-space />
              <q-btn
                color='primary'
                label='Попробовать ещё раз'
                icon='refresh'
                @click='init()'
              />
              <q-space />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
    <q-table
      v-if='sessionsList.length > 0 && !loading'
      title='Сессии'
      row-key='name'
      :columns='columns'
      :data='tableData'
    >
      <template v-slot:body='props'>
        <q-tr
          :props='props'
          @dblclick='showStandCard(props.row)'
          class='clickable'
        >
          <q-td key='stand' :props='props'>
            {{ props.row.stand.name }}
          </q-td>
          <q-td key='starts_at' :props='props'>
            {{ props.row.starts_at }}
          </q-td>
          <q-td key='ends_at' :props='props'>
            {{ props.row.ends_at }}
          </q-td>
          <q-td key='status' :props='props'>
            <div class='d-flex'>
              <q-badge :color='props.row.statusInfo.color'>
                {{ props.row.statusInfo.field }}
              </q-badge>
              <!-- v-if='props.row.statusInfo.field === 'Запускается' || props.row.statusInfo.field === 'Запущен'' -->
            </div>
          </q-td>
          <q-td key='controls' :props='props' class='q-gutter-xs'>
            <!--  -->
            <q-btn
              unelevated
              v-for='(i, index) in props.row.controls'
              :key='index'
              :color='i.color'
              @click='sesionActions(props.row, i.control)'
            >
              <q-icon :name='i.control' />
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-page-sticky
      v-if='!loading_error'
      position='bottom-right'
      :offset='[18, 18]'
    >
      <q-btn fab icon='add' color='primary' @click='initForm()' />
    </q-page-sticky>
    <q-dialog v-model='show' persistent>
      <q-card style='min-width: 500px'>
        <q-card-section class='row'>
          <div class='text-h6'>Новый сеанс</div>
          <q-space />
          <q-btn icon='close' flat round dense @click='onReset' v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-select
            outlined
            v-model='stand'
            :options='standsNames'
            label='Выберите стенд'
            :rules="[(val) => val || 'Обязательное поле']"
          />
        </q-card-section>
        <q-card-section v-show='stand'>
          <q-form @submit='onSubmit' @reset='onReset' class='q-gutter-md'>
            <div class='row'>
              <div class='col'>
                <div class='q-pa-md row'>
                  <q-input
                    filled
                    v-model='dateFromTo'
                    mask='##/##/####'
                    outlined
                    label='Начальная дата сессии'
                  >
                    <template v-slot:append>
                      <q-icon name='event' class='cursor-pointer'>
                        <q-popup-proxy
                          ref='qDateProxy'
                          transition-show='scale'
                          transition-hide='scale'
                        >
                          <q-date
                            v-model='dateFromTo'
                            @input='() => $refs.qDateProxy.hide()'
                            mask='DD/MM/YYYY'
                            :options='startDate'
                          ></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <q-input
                    filled
                    v-model='session.date_ends'
                    mask='##/##/####'
                    outlined
                    label='Конечная дата сессии'
                  >
                    <template v-slot:append>
                      <q-icon name='event' class='cursor-pointer'>
                        <q-popup-proxy
                          ref='qDateProxy'
                          transition-show='scale'
                          transition-hide='scale'
                        >
                          <q-date
                            v-model='session.date_ends'
                            @input='() => $refs.qDateProxy.hide()'
                            mask='DD/MM/YYYY'
                            :options='endDate'
                          ></q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-input
                    filled
                    v-model='timeFrom'
                    mask='##:##'
                    outlined
                    label='Начальное время сессии'
                  >
                    <template v-slot:append>
                      <q-icon name='access_time' class='cursor-pointer'>
                        <q-popup-proxy
                          ref='qDateProxy'
                          transition-show='scale'
                          transition-hide='scale'
                        >
                          <q-time
                            v-model='timeFrom'
                            @input='() => $refs.qDateProxy.hide()'
                            mask='hh:mm'
                          ></q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>

                  <q-input
                    filled
                    v-model='timeTo'
                    mask='##:##'
                    outlined
                    label='Конечное время сессии'
                  >
                    <template v-slot:append>
                      <q-icon name='access_time' class='cursor-pointer'>
                        <q-popup-proxy
                          ref='qDateProxy'
                          transition-show='scale'
                          transition-hide='scale'
                        >
                          <q-time
                            v-model='timeTo'
                            @input='() => $refs.qDateProxy.hide()'
                            mask='hh:mm'
                          ></q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>

              <div class='col'>
                <div class='row justify-center items-center'>
                  <q-btn flat label='Пред.' @click='calendarPrev' />
                  <q-separator vertical />
                  <q-btn flat label='След.' @click='calendarNext' />
                </div>
                <q-separator />
                <q-calendar
                  class='my-calendar'
                  ref='calendar'
                  view='day'
                  v-model='calendarDate'
                  @click:date2='onClickDate2'
                  locale='ru'
                  @click:time2='onClickTime2'
                  style='height: 400px'
                >
                  <template
                    #day-body='{  timeStartPos, timeDurationHeight }'
                  >
                    <template v-for='(event, index) in dayEvents' :key='index'>
                      <q-badge

                        class='my-event justify-center ellipsis text-white full-width'
                        :class='`bg-${event.color}`'
                        :style='
                          badgeStyles(
                            event,
                          "body",
                            timeStartPos,
                            timeDurationHeight
                          )
                        '
                      >
                      </q-badge>
                    </template>
                  </template>
                </q-calendar>
              </div>
            </div>
            <div align='right'>
              <q-btn label='Добавить' type='submit' color='primary' />
              <q-btn
                label='Сбросить'
                type='reset'
                color='primary'
                flat
                class='q-ml-sm'
              />
            </div>
          </q-form>
        </q-card-section>
        <q-card-section>
          <q-btn
            flat
            label='закрыть'
            color='primary'
            @click='onReset'
            v-close-popup
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model='showStand' persistent>
      <q-card class='q-pa-md q-pb-none'>
        <q-card-section class='row items-center q-mb-md'>
          <div class='text-h6 q-mr-md'>
            {{ newStand.name }}
          </div>
          <q-space />
          <q-btn icon='close' flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item v-if='newStand.description'>
              <q-item-section avatar>
                <q-icon color='primary' name='description' />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ newStand.description }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon
                  class='clickable'
                  color='primary'
                  name='monitor'
                  @click='
                    copyToClipboard1(
                      `${newStand.host}:${newStand.port}`,
                      "Хост:порт"
                    )
                  '
                />
              </q-item-section>
              <q-item-section>
                <q-item-label
                  >{{ newStand.host }}:{{ newStand.port }}</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon
                  color='primary'
                  name='person'
                  @click="copyToClipboard1(newStand.username, 'Логин')"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ newStand.username }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon
                  color='primary'
                  name='lock'
                  @click="copyToClipboard1(newStand.password, 'Пароль')"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ newStand.password }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { copyToClipboard } from 'quasar';
import QCalendar from '@quasar/quasar-ui-qcalendar';
import { date } from 'quasar';
export default {
  data() {
    return {
      showStand: false,
      session: {},
      newEvent: {
        starts_at: '',
        ends_at: '',
        duration: null,
        color: '',
      },
      loading: true,
      loading_error: false,
      events: [],
      eventsLength: 0,
      dayEvents: [],
      showDateTimeScrollerEnd: false,
      sessionsList: [],
      sessionsListByDevice: [],

      standId: null,
      standsNames: [],
      standsList: [],

      groupList: [],
      groupsNames: [],
      groupId: null,

      newSession: {
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        reservation_in_day: true,
        is_time_choose: false,
      },
      newStand: {},
      newSessionRequest: {
        starts_at: '',
        ends_at: '',
        device_id: '',
      },
      splitterModel: 50,
      show: false,
      tableData: [],
      columns: [
        {
          name: 'stand',
          label: 'Название стенда',
          field: 'stand',
          align: 'left',
          sortable: true,
        },
        {
          name: 'starts_at',
          label: 'Время начала',
          field: 'starts_at',
          align: 'left',
          sortable: true,
        },
        {
          name: 'ends_at',
          label: 'Время окончания',
          field: 'ends_at',
          align: 'left',
          sortable: true,
        },
        {
          name: 'status',
          label: 'Статус',
          field: 'status',
          align: 'left',
          sortable: true,
        },
        {
          name: 'controls',
          label: 'Управление',
          field: 'controls',
          align: 'left',
          sortable: true,
        },
      ],
    };
  },
  async mounted() {
    await this.init();
  },
  computed: {
    stand: {
      get() {
        return this.standId;
      },
      set(val) {
        this.standId = val;
        this.fetchSessionsByDevice(this.standId.value);
      },
    },
    dateFromTo: {
      get() {
        return this.session.date_starts;
      },
      set(val) {
        this.session.date_starts = date.formatDate(new Date(val), 'DD/MM/YYYY');
        this.session.date_ends = date.formatDate(new Date(val), 'DD/MM/YYYY');
        this.clearTime();
      },
    },
    timeFrom: {
      get() {
        return this.session.time_starts;
      },
      set(val) {
        console.log('time', val);
        this.session.time_starts = val;
        // this.newEvent.starts_at = QCalendar.parsed(
        //   this.getCalendarFromat(this.newSession.startDate, 'yyyy-mm-dd') +
        //     ' ' +
        //     val
        // );
        // this.setDuration(this.newEvent.ends_at, this.newEvent.starts_at);
      },
    },
    timeTo: {
      get() {
        return this.session.time_ends;
      },
      set(val) {
        this.session.time_ends = val;
        // this.newEvent.ends_at = QCalendar.parsed(
        //   this.getCalendarFromat(this.newSession.endDate, 'yyyy-mm-dd') +
        //     ' ' +
        //     val
        // );
        // this.newEvent.duration = this.setDuration(
        //   this.newEvent.ends_at,
        //   this.newEvent.starts_at
        // );
        // if(this.newEvent.starts_at != '') {
        //   setTimeout(() => {
        //     this.checkSession()
        // }, 3000)
        // }
      },
    },
    calendarDate: {
      get() {
        // return this.getCalendarFromat(this.newSession.startDate, 'yyyy-mm-dd');
        console.log('date', this.session.date_starts);
        console.log(
          'Calendar',
          date.formatDate(new Date(this.session.date_starts), 'YYYY-MM-DD')
        );
        return date.formatDate(
          new Date(this.session.date_starts),
          'YYYY-DD-MM'
        );
      },
      set(val) {
        console.log('val', val);
        this.session.date_starts = date.formatDate(new Date(val), 'DD/MM/YYYY');
        this.session.date_ends = date.formatDate(new Date(val), 'DD/MM/YYYY');

        this.clearTime();
        this.getEvents();
      },
    },
  },
  methods: {
    async showStandCard(i) {
      await this.$axios
        .get(
          `https://constructor.auditory.ru/lab/api/v1/devices/${i.stand.id}`,
          {
            withCredentials: false,
          }
        )
        .then((res) => {
          console.log(res.data);
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
          this.newStand.access_type = res.data.access_type;
        });
      console.log(this.newStand);
      this.showStand = true;
      // this.status = 'updateStand';
    },
    initForm(i) {
      this.show = true;
      if (i) {
        console.log(i);
      } else {
        this.session = {
          starts_at: null,
          ends_at: null,

          date_starts: date.formatDate(Date.now(), 'DD/MM/YYYY'),
          date_ends: date.formatDate(Date.now(), 'DD/MM/YYYY'),
          time_starts: null,
          time_ends: null,
        };
      }
    },
    async sesionActions(session, i) {
      if (i === 'edit') {
      } else if (i === 'delete') {
        await this.removeSession(session);
      }
    },
    copyToClipboard1(i, name) {
      console.log(i);
      copyToClipboard(i)
        .then(() => {
          this.$q.notify({
            position: this.notificationsPos,
            type: 'positive',
            message: `${name} скопирован`,
          });
        })
        .catch(() => {
          this.$q.notify({
            position: this.notificationsPos,
            icon: 'warning',
            type: 'negative',
            multiLine: true,
            message: 'Возникла ошибка!',
          });
        });
    },
    showStandInfo(i) {
      console.log('session', i);
    },
    async fetchSessionInfo(session) {
      if (!session.fetchCredentials) {
        console.log('Fetching session');
        await this.$axios
          .get(
            `https://constructor.auditory.ru/lab/api/v1/devices/${session.stand.id}/sessions/${session.id}`,
            {
              withCredentials: false,
            }
          )
          .then((res) => {
            session.credentials = res.data.credentials;
            console.log('session.credentials', session.credentials);
          });
      }
      session.fetchCredentials = true;
    },
    async init() {
      try {
        await this.fetchGroups();
        await this.fetchStands();
        await this.fetchSessions();
      } catch (e) {
        console.error('error', e);
        this.loading_error = true;
      }
      this.loading = false;
    },
    checkStatus(i) {
      switch (i.state) {
        case 'CREATED':
          return {
            color: 'green',
            field: 'Создан',
          };
        case 'QUEUED_FOR_START':
          return {
            color: 'teal-2',
            field: 'Ожидается запуск',
          };
        case 'STARTING':
          return {
            color: 'teal-4',
            field: 'Запускается',
          };
        case 'RUNNING':
          return {
            color: 'teal-6',
            field: 'Запущен',
          };
        case 'QUEUED_FOR_STOP':
          return {
            color: 'cyan-2',
            field: 'Ожидается завершение',
          };
        case 'STOPPING':
          return {
            color: 'cyan-4',
            field: 'Завершается',
          };
        case 'FINISHED':
          return {
            color: 'cyan-6',
            field: 'Закончен',
          };
        case 'QUEUED_FOR_CANCEL':
          return {
            color: 'red-2',
            field: 'Ожидается отмена',
          };
        case 'CANCELLING':
          return {
            color: 'red-4',
            field: 'Отменяется',
          };
        case 'CANCELLED':
          return {
            color: 'red-6',
            field: 'Отменён',
          };
      }
    },
    getControls(i) {
      if (i.state === 'CREATED')
        return [
          {
            control: 'edit',
            field: 'Изменить',
            color: 'grey-6',
          },
          {
            control: 'delete',
            field: 'Удалить',
            color: 'red-6',
          },
        ];
      else if (i.state === 'RUNNING')
        return [
          {
            control: 'cancel',
            field: 'Отменить',
            color: 'red-6',
          },
        ];
    },
    clickControl(session, i) {
      if (i.control === 'delete') this.removeSession(session);
      else console.log('123');
    },
    getEvents() {
      let dayEvents = [];
      if (this.events.length > 0) {
        this.events.forEach((value, i) => {
          if (i < this.events.length) {
            if (value.starts_at.date.slice(0, 10) === this.calendarDate) {
              dayEvents.push(value);
            }
          }
        });
        this.dayEvents = dayEvents;
        console.log('dayEvents:', this.dayEvents);
      }
    },
    calendarNext() {
      this.$refs.calendar.next();
      this.clearTime();
    },
    calendarPrev() {
      this.$refs.calendar.prev();
      this.clearTime();
    },

    async checkSession() {
      console.log('session', this.session.starts_at, this.session.ends_at);
      let r = false
      await this.$axios
        .get(
          `https://constructor.auditory.ru/lab/api/v1/devices/${this.standId.value}/availability`,
          {
            params: {
              device_id: this.standId.value,
              start: this.session.starts_at,
              end: this.session.ends_at,
            },
          }
        )
        .then((res) => {
          console.log(' ress', res.data.is_interval_available)
          if (res.data.is_interval_available === true) {

            r = true};
        });
      return r;
    },
    async removeSession(session) {
      var response = await this.$axios
        .delete(
          `https://constructor.auditory.ru/lab/api/v1/devices/${session.stand.id}/sessions/${session.id}`,
          session,
          {
            withCredentials: false,
          }
        )
        .then(() => {
          this.$q.notify({
            position: this.notificationsPos,
            type: 'positive',
            message: 'Сессия удалена',
          });
          return true;
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            position: this.notificationsPos,
            icon: 'warning',
            type: 'negative',
            multiLine: true,
            message: 'Возникла ошибка!',
          });
        });
      if (response) {
        this.updateSessions();
      }
    },
    async addSession(res) {
      const session = res;
      var response = await this.$axios
        .post(
          `https://constructor.auditory.ru/lab/api/v1/devices/${session.device_id}/sessions`,
          session,
          {
            withCredentials: false,
          }
        )
        .then(() => {
          this.$q.notify({
            position: this.notificationsPos,
            type: 'positive',
            message: 'Сессия добавлена',
          });
          return true;
        })
        .catch((err) => {
          console.log(err);
          this.$q.notify({
            position: this.notificationsPos,
            icon: 'warning',
            type: 'negative',
            multiLine: true,
            message: 'Возникла ошибка!',
          });
        });
      if (response) {
        console.log('true')
        this.show = false;
        this.onReset();
        this.updateSessions();
      }
    },
    checkTime(t) {
      console.log('dayEvents', this.dayEvents);
      for (let i of this.dayEvents) {
        let start = new Date(i.starts_at.date + ' ' + i.starts_at.time);
        let end = new Date(i.ends_at.date + ' ' + i.ends_at.time);
        let time = new Date(t.date.slice(0, 10) + ' ' + t.time);
        if (start <= time && time <= end) {
          return false;
        } else return true;
      }
    },
    onClickTime2(d) {
      console.log('event', d);
      // this.clearTime();
      this.fetchSessionsByDevice(this.standId.value);
      let newEventStart = d.scope.timestamp;
      this.newSession.is_time_choose = true;

      if (this.checkTime(newEventStart) || this.dayEvents.length === 0) {
        console.log('свободно');
        this.newEvent.starts_at = QCalendar.parsed(
          d.scope.timestamp.date + ' ' + d.scope.timestamp.hour
        );
        console.log('minute', d.scope.timestamp.minute);
        this.newEvent.ends_at = QCalendar.parsed(
          d.scope.timestamp.date + ' ' + d.scope.timestamp.hour + ':' + 59
        );
        this.session.time_starts = this.newEvent.starts_at.time;
        this.session.time_ends = this.newEvent.ends_at.time;

        this.newEvent.duration = this.setDuration(
          this.newEvent.ends_at,
          this.newEvent.starts_at
        );
        console.log('duration', this.newEvent.duration);
        this.newEvent.color = 'primary';
        this.events.push(this.newEvent);
        this.getEvents();
      } else {
        console.log('Время забронированно');
      }
      console.log('newEvent', this.newEvent);
      // this.events[this.eventsLength][ends_at] = QCalendar.parsed(d.scope.timestamp.date + ' ' + d.scope.timestamp.hour+1);
      // this.events.unshift(`click:time2: ${JSON.stringify(data)}`)
    },
    setDuration(to, from) {
      var dateTo = new Date(
        new Date(to.date.slice(0, 11)).setHours(to.hour, to.minute)
      );
      var dateFrom = new Date(
        new Date(from.date.slice(0, 11)).setHours(from.hour, from.minute)
      );
      var dif = dateTo - dateFrom;
      return Math.floor(dif / 60000);
    },
    startDate(d) {
      console.log(
        date.formatDate(new Date(this.session.date_starts), 'YYYY/MM/DD')
      );
      return (
        d >= date.formatDate(new Date(this.session.date_starts), 'YYYY/MM/DD')
      );
    },
    endDate(d) {
      return (
        d >= date.formatDate(new Date(this.session.date_ends), 'YYYY/MM/DD')
      );
    },
    startTime(d) {
      return d;
    },
    endTime(d) {
      return d >= this.session.time_starts;
    },
    onClickDate2() {
      this.session.date_starts = this.getCurrentDate();
      this.session.date_ends = this.getCurrentDate();
      this.clearTime();
    },
    clearTime() {
      this.session.time_starts = '';
      this.session.time_ends = '';
      this.newEvent.starts_at = '';
      this.newEvent.ends_at = '';
      if (this.events.length > this.eventsLength) this.events.pop();
    },

    getCurrentStand(id) {
      for (let i of this.standsList) {
        console.log('stands');
        if (i.id === id)
          return {
            name: i.name,
            id: i.id,
            host: i.host,
            port: i.port,
            description: i.description,
          };
      }
    },
    displayTime(d) {
      let date = new Date(Date.parse(d));
      return `${date.getDate() <= 10 ? '0' : ''}${date.getDate()}/${
        date.getMonth() + 1 <= 10 ? '0' : ''
      }${date.getMonth() + 1}/${date.getFullYear()} в ${
        date.getHours() <= 10 ? '0' : ''
      }${date.getHours()}:${
        date.getMinutes() <= 10 ? '0' : ''
      }${date.getMinutes()}`;
    },
    async fetchSessionsByDevice(id) {
      await this.$axios
        .get(
          `https://constructor.auditory.ru/lab/api/v1/devices/${id}/sessions`,
          {
            withCredentials: false,
          }
        )
        .then((res) => {
          this.sessionsListByDevice = res.data;
          let events = [];
          for (let i of this.sessionsListByDevice) {
            let start = QCalendar.parseDate(new Date(i.starts_at));
            let end = QCalendar.parseDate(new Date(i.ends_at));
            events.push({
              starts_at: start,
              ends_at: end,
              duration: this.setDuration(end, start),
              color: 'red',
            });
          }
          this.eventsLength = events.length;
          this.events = events;
          this.getEvents();
        });
    },
    async fetchSessions() {
      var sessions = [];
      await this.$axios
        .get('https://constructor.auditory.ru/lab/api/v1/sessions', {
          withCredentials: false,
        })
        .then((res) => {
          this.sessionsList = res.data;
          console.log('session', res.data);
          for (let i of this.sessionsList) {
            let s = this.getCurrentStand(i.device_id);
            console.log(s);
            sessions.push({
              stand: s,
              // starts_at: this.displayTime(i.starts_at),
              starts_at: `${date.formatDate(
                new Date(i.starts_at),
                'DD/MM/YYYY'
              )} в ${date.formatDate(new Date(i.starts_at), 'HH:mm')}`,
              ends_at: `${date.formatDate(
                new Date(i.ends_at),
                'DD/MM/YYYY'
              )} в ${date.formatDate(new Date(i.ends_at), 'HH:mm')}`,
              status: i.state,
              statusInfo: this.checkStatus(i),
              controls: this.getControls(i),
              id: i.id,
              fetchCredentials: false,
              credentials: {
                username: '',
                password: '',
              },
            });
          }
          this.tableData = sessions;
          console.log('tableData', this.tableData);
        });
    },
    checkDate(val) {
      return Quasar.utils.date.isValid(val) || 'Invalid date.';
    },
    getCurrentDate() {
      var today = new Date();
      console.log('today', today.toLocaleDateString('ru'));
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      var today = dd + '/' + mm + '/' + yyyy;
      console.log(today);
      return today;

      // this.newSession.from = today;
    },
    async fetchGroups() {
      let groups = [];
      await this.$axios
        .get('https://constructor.auditory.ru/lab/api/v1/groups', {
          withCredentials: false,
        })
        .then((res) => {
          this.groupsList = res.data;
          if (res.data.length === 1) {
            groups.push({
              label: this.groupsList[0].name,
              value: this.groupsList[0].id,
            });
          } else
            for (let i of this.groupsList) {
              groups.push({
                label: i.name,
                value: i.id,
              });
            }
          this.groupsNames = groups;
          console.log('groupsList', this.groupsList);
          console.log('groupsNames', this.groupsNames);
        });
    },
    async fetchStands() {
      let stands = [];
      await this.$axios
        .get('https://constructor.auditory.ru/lab/api/v1/devices', {
          withCredentials: false,
        })
        .then((res) => {
          this.standsList = res.data;
          console.log('standsList', this.standsList);
          if (res.data.length === 1) {
            stands.push({
              label: this.standsList[0].name,
              value: this.standsList[0].id,
            });
          } else
            for (let i of this.standsList) {
              stands.push({
                label: i.name,
                value: i.id,
              });
            }
          this.standsNames = stands;
          console.log('standsList', this.standsList);
          console.log('standsNames', this.standsNames);
        });
    },
    async updateSessions() {
      await this.fetchSessions();
      await this.fetchGroups();
      await this.fetchStands();
    },
    async onSubmit() {
      this.session.device_id = this.standId.value;
      // this.newSessionRequest.starts_at = new Date(
      //   new Date(this.newEvent.starts_at.date.slice(0, 11)).setHours(
      //     this.newEvent.starts_at.hour,
      //     this.newEvent.starts_at.minute
      //   )
      // ).toISOString();
      // this.newSessionRequest.ends_at = new Date(
      //   new Date(this.newEvent.ends_at.date.slice(0, 11)).setHours(
      //     this.newEvent.ends_at.hour,
      //     this.newEvent.ends_at.minute
      //   )
      // ).toISOString();
      this.session.starts_at = date.formatDate(
        new Date(this.session.date_starts + ' ' + this.session.time_starts),
        'YYYY-MM-DDTHH:mm:ss.SSSZ'
      );
      this.session.ends_at = date.formatDate(
        new Date(this.session.date_ends + ' ' + this.session.time_ends),
        'YYYY-MM-DDTHH:mm:ss.SSSZ'
      );
      console.log('session', this.session);
      let availability = await this.checkSession();
      console.log('availability', availability);
      if (availability === true) {
        this.addSession(this.session);
      }
    },

    onReset() {
      this.session.device_id = null;
      this.session.starts_at = '';
      this.session.ends_at = '';
      this.newSession.startDate = this.getCurrentDate();
      this.newSession.endDate = this.getCurrentDate();
      this.newSession.reservation_in_day = true;
      this.clearTime();
      this.standId = null;
    },
    badgeStyles(event, type, timeStartPos, timeDurationHeight) {
      const s = {};
      if (timeStartPos) {
        // don't clamp position to 0px
        s.top = timeStartPos(event.starts_at.time, false) + 'px';
        s.position = 'absolute';
        s.width = '100%';
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(event.duration) + 'px';
      }
      s['align-items'] = 'flex-start';
      return s;
    },
  },
};
</script>

<style lang='scss'>
.my-calendar {
  position: relative;
}
.q-calendar-daily__day:hover {
  background: rgba(0, 0, 255, 0.1);
}

.q-calendar-daily__day-interval:hover {
  background: rgba(0, 0, 255, 0.1);
}
.q-calendar-daily__day-interval--section:hover {
  background: rgba(0, 0, 255, 0.1);
}

.my-event {
  width: 100%;
  position: absolute;
  font-size: 12px;
}

.full-width {
  left: 0;
  width: 100%;
}
</style>
