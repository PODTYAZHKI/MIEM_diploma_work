<template>
  <div class="q-pt-md">

    <div class="row justify-start">
      <div class="q-pa-md q-gutter-sm row">
        <q-btn no-caps class="button" style="margin: 2px;" @click="calendarView = 'week'">
          &lt; Назад
        </q-btn>
        <q-btn no-caps class="button" style="margin: 2px;" @click="onPrev">
          &lt; {{ calendarView === 'week' ? 'Предыдущая' : 'Предыдущий' }}
        </q-btn>
        <q-btn no-caps class="button" style="margin: 2px;" @click="onToday">
          Сегодня
        </q-btn>
        <q-btn no-caps class="button" style="margin: 2px;" @click="onNext">
          {{ calendarView === 'week' ? 'Следующая' : 'Следующий' }} &gt;
        </q-btn>
      </div>
    </div>
    <div class="row justify-center">
      <div style="display: flex; width: 100%; height: 70vh;">
        <q-calendar ref="calendar" v-model="selectedDate" :mode="calendarMode" :view="calendarView" animated bordered
          locale="ru" :weekdays="[1, 2, 3, 4, 5, 6, 0]" :interval-minutes="30" :interval-count="48"
          :interval-height="30" @click-head-day="onClickHeadDay" time-clicks-clamped
          :selected-start-end-dates="startEndDates" @mousedown-time="onMouseDownTime" @mouseup-time="onMouseUpTime"
          @mousemove-time="onMouseMoveTime" @click-time="onClickTime" :short-weekday-label="true" :hour24-format="true"
          :disabled-before="disabledBefore">
          <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
            <template v-for='(event, index) in getEvents(timestamp.date)' :key='index'>
              <q-badge class='my-event justify-center ellipsis text-white full-width' :class='`bg-${event.color}`'
                :style='
                  badgeStyles(
                    event,
                    "body",
                    timeStartPos,
                    timeDurationHeight
                  )
                '>
                {{bageTitle(event, index)}}


                <q-menu v-if="event.tag === 'my' && event.show" v-model="event.isShow">
                  <q-card class="my-card">
                    <q-card-section class='row'>
                      <div class='text-h6'>Новый сеанс</div>
                      <q-space />
                      <q-btn icon='close' flat round dense @click='onReset' v-close-popup />
                    </q-card-section>
                    <q-card-section>
                      <q-form @submit='onSubmit' @reset='onReset' class='q-gutter-md'>
                        <div class='row'>
                          <div class='col'>

                            <q-input filled v-model='eventStart' outlined debounce="1000">
                              <template v-slot:append>
                                <q-icon name='event' class='cursor-pointer'>
                                  <q-popup-proxy ref='qDateProxy' transition-show='scale' transition-hide='scale'>
                                    <q-date v-model='eventStart' @input='() => qDateProxy.value[0].hide()'
                                      mask='DD MMM YYYY' debounce="1000">
                                    </q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>

                            <q-input filled v-model='eventEnd' outlined debounce="1000">
                              <template v-slot:append>
                                <q-icon name='event' class='cursor-pointer'>
                                  <q-popup-proxy ref='qDateProxy' transition-show='scale' transition-hide='scale'>
                                    <q-date v-model='eventEnd' @input='() => qDateProxy.value[1].hide()'
                                      mask='DD MMM YYYY' debounce="1000">
                                    </q-date>
                                  </q-popup-proxy>
                                </q-icon>
                              </template> -
                            </q-input>


                            <q-input filled v-model='eventStartTime' mask='##:##' outlined debounce="1000"
                              label='Начальное время сессии' @focus="() => { handle = true }"
                              @blur="() => { handle = false }">
                              <template v-slot:append>
                                <q-icon name='access_time' class='cursor-pointer'>
                                  <q-popup-proxy ref='qDateProxy' transition-show='scale' transition-hide='scale'>
                                    <q-time v-model='eventStartTime' @input='() => qDateProxy.value[2].hide()'
                                      mask='hh:mm' debounce="1000">
                                    </q-time>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>


                            <q-input filled v-model='eventEndTime' mask='##:##' outlined label='Конечное время сессии'
                              debounce="1000" @focus="() => { handle = true }" @blur="() => { handle = false }">
                              <template v-slot:append>
                                <q-icon name='access_time' class='cursor-pointer'>
                                  <q-popup-proxy ref='qDateProxy' transition-show='scale' transition-hide='scale'>
                                    <q-time v-model='eventEndTime' @input='() => qDateProxy.value[3].hide()'
                                      mask='hh:mm' debounce="1000">
                                    </q-time>
                                  </q-popup-proxy>
                                </q-icon>
                              </template>
                            </q-input>

                          </div>
                        </div>
                        <div align='right'>
                          <q-btn label='Добавить' type='submit' color='primary' />
                          <q-btn flat label='закрыть' color='primary' @click='onReset' v-close-popup />
                        </div>
                      </q-form>
                    </q-card-section>
                  </q-card>
                </q-menu>
              </q-badge>
            </template>
          </template>
        </q-calendar>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar, date } from 'quasar'
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
import { fetchSessions, addSession } from 'src/api/sessions'
import { set } from 'vue-demi';

const selectedDate = ref(today())
const q = useQuasar()
const loading = ref(true)
const loading_error = ref(false)
const route = useRoute()

const calendar = ref(null)
const calendarMode = ref("day")
const calendarView = ref("week")

const disabledBefore = computed(() => {
  let ts = parseTimestamp(today())
  ts = addToDate(ts, { day: -1 })
  return ts.date
})

function onToday() {
  calendar.value.moveToToday()
}
function onPrev() {
  calendar.value.prev()
}
function onNext() {
  calendar.value.next()
}

function onClickTime(data) {
  let start =
    console.log('onClickTime', data.scope.timestamp.time)
}

function leftClick(e) {
  return e.button === 0
}

function bageTitle(event, index) {
  // var msg = ''
  if (!event.isMultiple && !event.field){
    return `${event.starts_at.time} - ${event.ends_at.time}`
  } else {
    return event.field
  }

}

const anchorTimestamp = ref(null),
  otherTimestamp = ref(null),
  mouseDown = ref(false),
  mobile = ref(false)

const startEndDates = computed(() => {
  const dates = []
  if (anchorDayTimeIdentifier.value !== false && otherDayTimeIdentifier.value !== false) {
    if (anchorDayTimeIdentifier.value <= otherDayTimeIdentifier.value) {
      dates.push(getDateTime(anchorTimestamp.value), getDateTime(otherTimestamp.value))
    }
    else {
      dates.push(getDateTime(otherTimestamp.value), getDateTime(anchorTimestamp.value))
    }
  }
  return dates
})

const anchorDayTimeIdentifier = computed(() => {
  if (anchorTimestamp.value !== null) {
    return getDayTimeIdentifier(anchorTimestamp.value)
  }
  return false
})

const otherDayTimeIdentifier = computed(() => {
  if (otherTimestamp.value !== null) {
    return getDayTimeIdentifier(otherTimestamp.value)
  }
  return false
})

function onMouseDownTime({ scope, event }) {
  console.log('onMouseDownTime', { scope, event })
  if (leftClick(event)) {
    if (mobile.value === true
      && anchorTimestamp.value !== null
      && otherTimestamp.value !== null
      && getDateTime(anchorTimestamp.value) === getDateTime(otherTimestamp.value)) {
      otherTimestamp.value = scope.timestamp
      mouseDown.value = false
      return
    }
    // mouse is down, start selection and capture current
    mouseDown.value = true
    anchorTimestamp.value = scope.timestamp
    otherTimestamp.value = scope.timestamp
  }
}

function onMouseUpTime({ scope, event }) {
  console.log('onMouseUpTime', { scope, event })
  if (mobile.value !== true && leftClick(event)) {
    // mouse is up, capture last and cancel selection
    otherTimestamp.value = addToDate(scope.timestamp, { minute: 29 })
    mouseDown.value = false
    newEvent(anchorTimestamp.value, otherTimestamp.value, 'my', 'blue')

  }
}

function onMouseMoveTime({ scope, event }) {
  if (mobile.value !== true && mouseDown.value === true) {
    otherTimestamp.value = scope.timestamp
  }
}

const events = ref([])
const eventsMap = computed(() => {
  const map = {}

  events.value.forEach(event => {

    if (event.isMultiple === false) {
      if (!map[event.starts_at.date]) {
        map[event.starts_at.date] = []
      }
      map[event.starts_at.date].push(event)

    } else {
      event.mulEvents.forEach(
        multipleEvent => {

          console.log(multipleEvent.starts_at.date)
          if (!map[multipleEvent.starts_at.date]) {
            map[multipleEvent.starts_at.date] = []
          }
          map[multipleEvent.starts_at.date].push(multipleEvent)
        }
      )
    }
  })
  return map
})
function getEvents(dt) {
  // get all events for the specified date
  return eventsMap.value[dt] || []
}
const sessionsList = ref(null)

function newDuration(i, j) {
  return diffTimestamp(i, j, true) / 60000
}
const handle = ref(false)
function newEvent(start, end, tag, color) {
  const multipleEvent = {}
  // if (diffTimestamp(end, otherTimestamp.value, true) === 0 && !handle.value) { end = addToDate(end, { minute: 29 }) }
  // const duration = diffTimestamp(anchorTimestamp.value, endTime, true) / 60000
  // if ((anchorTimestamp.value.date != end.date) || tag) {
  multipleEvent.isMultiple = true
  // multipleEvent.tag = 'my'
  multipleEvent.count = Math.round(diffTimestamp(start, end, true) / 86400000)
  console.log('duration:', multipleEvent.count)
  multipleEvent.mulEvents = []
  multipleEvent.mulEvents.push(
    {

      starts_at: start,
      ends_at: parseTimestamp(`${start.date} 23:59`),
      color: color,
      duration: newDuration(start, parseTimestamp(`${start.date} 23:59`)),
      tag: tag,
      isMultiple: true,
    }
  )
  if (multipleEvent.count === 0 && start.date != end.date) {
    multipleEvent.mulEvents.push(
      {
        starts_at: parseTimestamp(`${end.date} 00:00`),
        ends_at: end,
        color: color,
        duration: newDuration(start, parseTimestamp(`${start.date} 23:59`)),
        tag: tag,
        isMultiple: true,
      }
    )
    // } else {
    for (let i = 0; i < multipleEvent.count; i++) {
      var s = parseTimestamp(`${addToDate(start, { day: i + 1 }).date} 00:00`)
      var e = parseTimestamp(`${addToDate(start, { day: i + 1 }).date} 23:59`)
      multipleEvent.mulEvents.push(
        {
          starts_at: s,
          ends_at: e,
          color: tag,
          duration: newDuration(s, e),
          tag: color,
          isMultiple: true,
        }
      )
    }
    // }
    multipleEvent.mulEvents[multipleEvent.mulEvents.length - 1].ends_at = end
    multipleEvent.mulEvents[multipleEvent.mulEvents.length - 1].show = tag === 'my' ? true : false
    multipleEvent.mulEvents[multipleEvent.mulEvents.length - 1].isShow = tag === 'my' ? true : false
    multipleEvent.mulEvents[multipleEvent.mulEvents.length - 1].duration = newDuration(parseTimestamp(`${end.date} 00:00`), end)
    multipleEvent.mulEvents[multipleEvent.mulEvents.length - 1].eventStart = start
    multipleEvent.mulEvents[multipleEvent.mulEvents.length - 1].field = `${start.time}(${start.date})-${end.time}`
    if (events.value.length === sessionsList.value) {
      events.value.push(
        multipleEvent
      )
    } else {
      events.value[events.value.length - 1] = multipleEvent
    }
    console.log('events.value.length', events.value.length)

  } else {
    const duration = newDuration(start, end)
    console.log('events', events.value.length)
    console.log('sessionsList', sessionsList.value)
    if (events.value.length === sessionsList.value) {
      events.value.push(
        {
          isMultiple: false,
          tag: tag,
          starts_at: start,
          ends_at: end,
          color: color,
          duration: duration,
          show: true,
          isShow: true
        }
      )
    } else {
      events.value[events.value.length - 1] = {
        isMultiple: false,
        tag: tag,
        starts_at: start,
        ends_at: end,
        color: color,
        duration: duration,
        show: true,
        isShow: true
      }
    }
  }
  // anchorTimestamp.value = {}
  // otherTimestamp.value = {}
}
const qDateProxy = ref()
const { formatDate } = date
// const eventStart = computed({
//   get() {
//     // let d = date.formatDate(new Date(getDate(events.value[events.value.length - 1].starts_at), 'DD/MM/YYYY'))
//     // console.log(d)
//     // return date.formatDate(new Date(events.value[events.value.length - 1].starts_at.date, 'DD/MM/YYYY'))
//     return formatDate(new Date(events.value[events.value.length - 1].starts_at.date), "DD MMM YYYY")
//   },
//   set(val) {
//     console.log(val)
//     let d = formatDate(new Date(val), "YYYY-MM-DD")
//     console.log(d)
//     events.value[events.value.length - 1].starts_at.date = d
//   }
// })
// const newSession = ref({})
// const multipleEventInput = ref({ from: '2022/04/29', to: '2022/04/30' })
// computed({
//   get() {
//     return {
//       from: formatDate(new Date(events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].eventStart.date), "DD MMM YYYY"),
//       to: formatDate(new Date(events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].ends_at.date), "DD MMM YYYY")
//     }
//   },
//   set(val) {

//     newSession.value = {
//       from: val.from,
//       to: val.to
//     }
//     console.log(val)
//   }
// })
function newDateFormat(i) {
  console.log('format', i)
  const d = i.split(' ')[0]
  const m = i.split(' ')[1]
  const y = i.split(' ')[2]
  var month = ""
  switch (m) {
    case "Сен":
      month = "09"
      break;
    case "Окт":
      month = "10"
      break;
    case "Ноя":
      month = "10"
      break;
    case "Дек":
      month = "12"
      break;
    case "Янв":
      month = "01"
      break;
    case "Фев":
      month = "02"
      break;
    case "Мар":
      month = "03"
      break;
    case "Апр":
      month = "04"
      break;
    case "Май":
      month = "05"
      break;
    case "Июн":
      month = "06"
      break;
    case "Июл":
      month = "07"
      break;
    case "Авг":
      month = "08"
      break;
  }
  return `${y}-${month}-${d}`
}

const eventStart = computed({
  get() {
    return events.value[events.value.length - 1].isMultiple ? formatDate(new Date(events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].eventStart.date), "DD MMM YYYY") : formatDate(new Date(events.value[events.value.length - 1].starts_at.date), "DD MMM YYYY")
  },
  set(val) {
    if (val) {
      let d = formatDate(new Date(`${newDateFormat(val)}`), "YYYY-MM-DD")
      console.log(d)
      if (events.value[events.value.length - 1].isMultiple) {
        let start = parseTimestamp(`${d} ${events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].eventStart.time}`)
        let end = events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].ends_at
        console.log('start - end', start, end)
        newEvent(start, end, 'my', 'blue')
      } else {
        if (d !== events.value[events.value.length - 1].starts_at.date) {
          events.value[events.value.length - 1].starts_at = parseTimestamp(`${d} ${events.value[events.value.length - 1].starts_at.time}`)
          events.value[events.value.length - 1].ends_at = parseTimestamp(`${d} ${addToDate(events.value[events.value.length - 1].starts_at, { minute: 29 }).time}`)
          anchorTimestamp.value = events.value[events.value.length - 1].starts_at
          otherTimestamp.value = events.value[events.value.length - 1].ends_at
          // newEvent(events.value[events.value.length - 1].starts_at, events.value[events.value.length - 1].ends_at)
          console.log('newDate', events.value[events.value.length - 1])
        } else {
          events.value[events.value.length - 1].starts_at = parseTimestamp(`${d} ${events.value[events.value.length - 1].starts_at.time}`)
          events.value[events.value.length - 1].ends_at
        }

      }
    }

  }
})
const eventEnd = computed({
  get() {
    return events.value[events.value.length - 1].isMultiple ? formatDate(new Date(events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].ends_at.date), "DD MMM YYYY") : formatDate(new Date(events.value[events.value.length - 1].ends_at.date), "DD MMM YYYY")
  },
  set(val) {
    if (val) {
      let d = formatDate(`${newDateFormat(val)}`, "YYYY-MM-DD")
      if (events.value[events.value.length - 1].isMultiple) {
        newEvent(events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].eventStart, parseTimestamp(`${d} ${events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].ends_at.time}`), 'my', 'blue')

      } else {
        if (d !== events.value[events.value.length - 1].starts_at.date) {
          events.value[events.value.length - 1].isMultiple = true

          newEvent(
            events.value[events.value.length - 1].starts_at,
            events.value[events.value.length - 1].ends_at = parseTimestamp(`${d} ${events.value[events.value.length - 1].ends_at.time}`), 'my', 'blue'
          )
        }
        events.value[events.value.length - 1].ends_at = parseTimestamp(`${d} ${events.value[events.value.length - 1].ends_at.time}`)
      }
    }
  }
})
const eventStartTime = computed({
  get() {
    return events.value[events.value.length - 1].isMultiple ? events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].eventStart.time : events.value[events.value.length - 1].starts_at.time
  },
  set(val) {
    if (events.value[events.value.length - 1].isMultiple) {
      let start = parseTimestamp(`${events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].eventStart.date} ${val}`)
      let end = events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].ends_at
      newEvent(start, end, 'my', 'blue')
    } else {
      newEvent(
        events.value[events.value.length - 1].starts_at = parseTimestamp(`${events.value[events.value.length - 1].starts_at.date} ${val}`),
        events.value[events.value.length - 1].ends_at, 'my', 'blue'
      )
    }

  }
})
const eventEndTime = computed({
  get() {
    // console.log('mulEvents',events.value[events.value.length - 1].mulEvents[])
    return events.value[events.value.length - 1].isMultiple ? events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].ends_at.time : events.value[events.value.length - 1].ends_at.time
    // return '123'
  },
  set(val) {
    if (events.value[events.value.length - 1].isMultiple) {
      newEvent(events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].eventStart, parseTimestamp(`${events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].ends_at.date} ${val}`), 'my', 'blue')
    } else {
      newEvent(
        events.value[events.value.length - 1].starts_at,
        events.value[events.value.length - 1].ends_at = parseTimestamp(`${events.value[events.value.length - 1].ends_at.date} ${val}`), 'my', 'blue'
      )
    }
  }
})
// function startDate(d) {
//   // console.log(events.value[events.value.length - 1].starts_at.date.replaceAll("-", "/"))
//   return d >= events.value[events.value.length - 1].starts_at.date.replaceAll("-", "/")
// }
// function endDate(d) {
//   return (
//     d >= events.value[events.value.length - 1].starts_at.date.replaceAll("-", "/")
//   )
// }
function badgeStyles(event, type, timeStartPos = undefined, timeDurationHeight = undefined) {
  const s = {}
  if (timeStartPos && timeDurationHeight) {
    s.top = timeStartPos(event.starts_at.time) + 'px'
    s.height = timeDurationHeight(event.duration) + 'px'
  }
  s['align-items'] = 'flex-start'
  return s
}
function badgeClasses(event, type) {
  const isHeader = type === 'header'
  return {
    [`text-white bg-${event.bgcolor}`]: true,
    'full-width': !isHeader && (!event.side || event.side === 'full'),
    'left-side': !isHeader && event.side === 'left',
    'right-side': !isHeader && event.side === 'right',
    'rounded-border': true
  }
}

const endTime = computed({
  get() {
    return events.value[events.value.length - 1].ends_at.time
  },
  set(val) {
    events.value[events.value.length - 1].ends_at = parsed(events.value[events.value.length - 1].ends_at.date + ' ' + val)
    // events.value[events.value.length - 1].ends_at.time = val
    events.value[events.value.length - 1].duration = newDuration(events.value[events.value.length - 1].starts_at, events.value[events.value.length - 1].ends_at)
  }
})

function onClickHeadDay(data) {
  console.log('onClickHeadDay', data)
  selectedDate.value = data.scope.timestamp.date
  calendarView.value = "day"

}

const session = ref({
  starts_at: "",
  ends_at: ""
})

async function onSubmit() {
  if (events.value[events.value.length - 1].isMultiple) {
    session.value.starts_at = formatDate(makeDateTime(addToDate(events.value[events.value.length - 1].mulEvents[0].starts_at, { hour: '-3' })), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    session.value.ends_at = formatDate(makeDateTime(addToDate(events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].ends_at, { hour: '-3' })), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    // session.value.starts_at = formatDate(makeDateTime(events.value[events.value.length - 1].mulEvents[0].starts_at), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    // session.value.ends_at = formatDate(makeDateTime(events.value[events.value.length - 1].mulEvents[events.value[events.value.length - 1].mulEvents.length - 1].ends_at), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
  } else {

    session.value.starts_at = formatDate(makeDateTime(addToDate(events.value[events.value.length - 1].starts_at, { hour: '-3' })), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    session.value.ends_at = formatDate(makeDateTime(addToDate(events.value[events.value.length - 1].ends_at, { hour: '-3' })), 'YYYY-MM-DDTHH:mm:ss.SSSZ')
  }
  console.log(session.value)
  const result = await addSession(session.value, route.params.standId)
  console.log('result', result)
  if (result) {
    clearTime()

    q.notify({
      // position: this.notificationsPos,
      type: "positive",
      message: "Сессия добавлена",
    });

    await init()
  }

}

function clearTime() {
  if (events.value.length > sessionsList.value) {
    console.log('pop')
    events.value.pop()
  }
}

function onReset() {

  session.value.starts_at = ''
  session.value.ends_at = ''
  clearTime()
}
function checkMultiple(start, end) {
  if (start.date === end.date) return false
  else return true
}

async function init() {
  const sessions = await fetchSessions(route.params.standId)
  console.log(sessions)

  if (!sessions) {
    console.error('Sessions error!!!')
  } else {
    for (let i of sessions) {
      let start = parseDate(new Date(i.starts_at));
      let end = parseDate(new Date(i.ends_at));
      if (checkMultiple(start, end)) {
        newEvent(start, end, '!my', 'red')

      } else {

        events.value.push({
          starts_at: start,
          ends_at: end,
          duration: newDuration(start, end),
          color: 'red',
          tag: '!my',
          isMultiple: false
        });
      }

    }
    // events.value.push(events.value[0])

    sessionsList.value = events.value.length
    console.log(sessionsList.value)
  }
}
onMounted(init())
</script>
<style lang="sass" scoped>
.my-event
  position: absolute
  font-size: 12px
  justify-content: center
  margin: 0 1px
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.full-width
  left: 0
  width: calc(100% - 2px)

.left-side
  left: 0
  width: calc(50% - 3px)

.right-side
  left: 50%
  width: calc(50% - 3px)

.rounded-border
  border-radius: 2px
</style>
