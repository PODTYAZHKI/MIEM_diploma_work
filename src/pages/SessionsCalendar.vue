<template>
  <!-- <q-inner-loading :showing="loading">
    <q-spinner-cube color="primary" size="4em" />
  </q-inner-loading> -->
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
          locale="ru-RU" :weekdays="[1, 2, 3, 4, 5, 6, 0]" :hoverable="true" :interval-minutes="15" :interval-count="96"
          :interval-height="15" @click-head-day="onClickHeadDay" :short-weekday-label="true" :hour24-format="true"
          @change="onChange" @moved="onMoved"  @click-date="onClickDate" @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals" >
          <template #day-container="{ scope: { days } }">
            <template v-if="hasDate(days)">
              <div class="day-view-current-time-indicator" :style="style" />
              <div class="day-view-current-time-line" :style="style" />
            </template>
          </template>
          <!-- <template #head-day-event="{ scope: { timestamp } }">
            <div style="display: flex; justify-content: center; flex-wrap: wrap; padding: 2px;">
              <template v-for="event in eventsMap[timestamp.date]" :key="event.id">
                <q-badge v-if="!event.time" :class="badgeClasses(event, 'header')" :style="badgeStyles(event, 'header')"
                  style="width: 100%; cursor: pointer; height: 12px; font-size: 10px; margin: 1px;">
                  <span class="title q-calendar__ellipsis">
                    {{ event.title }}
                    <q-tooltip>{{ event.details }}</q-tooltip>
                  </span>
                </q-badge>
                <q-badge v-else :class="badgeClasses(event, 'header')" :style="badgeStyles(event, 'header')"
                  style="margin: 1px; width: 10px; max-width: 10px; height: 10px; max-height: 10px"
                  @click="scrollToEvent(event)">
                  <q-tooltip>{{ event.time + ' - ' + event.details }}</q-tooltip>
                </q-badge>
              </template>
            </div>
          </template> -->

          <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
            <template v-for="event in getEvents(timestamp.date)" :key="event.id">
              <!-- <div v-if="event.time !== undefined" class="my-event" :class="badgeClasses(event, 'body')"
                :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)">

              </div> -->
              <q-badge class='my-event justify-center ellipsis text-white full-width' :class='`bg-${event.bgcolor}`'
                :style='
                  badgeStyles(
                    event,
                    "body",
                    timeStartPos,
                    timeDurationHeight
                  )
                '>

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
import { useQuasar } from 'quasar'
import {
  QCalendar,
  addToDate,
  parseTimestamp,
  isBetweenDates,
  today,
  parsed,
  parseDate,
  parseTime
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendar.sass'

const selectedDate = ref(today())
const q = useQuasar()
const loading = ref(true)
const loading_error = ref(false)
const route = useRoute()

const calendar = ref(null)
const calendarMode = ref("day")
const calendarView = ref("week")


function onToday() {
  calendar.value.moveToToday()
}
function onPrev() {
  calendar.value.prev()
}
function onNext() {
  calendar.value.next()
}
function onClickHeadDay(data) {
  console.log('onClickHeadDay', data)
  selectedDate.value = data.scope.timestamp.date
  calendarView.value = "day"

}
const style = computed(() => {
  return {
    top: timeStartPos.value + 'px'
  }
})
let intervalId = null
const currentTime = ref(null),
  timeStartPos = ref(0),
  currentDate = ref(null)


function hasDate(days) {
  return currentDate.value
    ? days.find(day => day.date === currentDate.value)
    : false
}
async function init() {
  try {

    loading.value = false;
  } catch (e) {
    console.error("error", e);
    loading_error.value = true;
  }
}

function onClickInterval(data) {
  console.log('onClickInterval', data)
}









onMounted(() => {
  adjustCurrentTime(),
    // now, adjust the time every minute
    intervalId = setInterval(() => {
      adjustCurrentTime()
    }, 60000)
})
onBeforeUnmount(() => {
  clearInterval(intervalId)
})
function adjustCurrentTime() {
  const now = parseDate(new Date())
  currentDate.value = now.date
  currentTime.value = now.time
  timeStartPos.value = calendar.value.timeStartPos(currentTime.value, false)
}


// Calendar Events
const CURRENT_DAY = new Date()
function getCurrentDay(day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
  return tm.date
}

const eventsMap = computed(() => {
  const map = {}
  // this.events.forEach(event => (map[ event.date ] = map[ event.date ] || []).push(event))
  events.value.forEach(event => {
    if (!map[event.date]) {
      map[event.date] = []
    }
    map[event.date].push(event)
    console.log(event)
    if (event.days) {
      let timestamp = parseTimestamp(event.date)
      let days = event.days
      do {
        timestamp = addToDate(timestamp, { day: 1 })
        if (!map[timestamp.date]) {
          map[timestamp.date] = []
        }
        map[timestamp.date].push(event)
      } while (--days > 0)
    }
  })
  return map
})

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

function badgeStyles(event, type, timeStartPos = undefined, timeDurationHeight = undefined) {
  const s = {}
  if (timeStartPos && timeDurationHeight) {
    s.top = timeStartPos(event.time) + 'px'
    s.height = timeDurationHeight(event.duration) + 'px'
  }
  s['align-items'] = 'flex-start'
  return s
}

function getEvents(dt) {
  // get all events for the specified date
  return eventsMap.value[dt] || []
  // console.log('Events-old', events)
  // if (events.length === 1) {
  //   events[0].side = 'full'
  // }
  // else if (events.length === 2) {
  //   // this example does no more than 2 events per day
  //   // check if the two events overlap and if so, select
  //   // left or right side alignment to prevent overlap
  //   const startTime = addToDate(parsed(events[0].date), { minute: parseTime(events[0].time) })
  //   const endTime = addToDate(startTime, { minute: events[0].duration })
  //   const startTime2 = addToDate(parsed(events[1].date), { minute: parseTime(events[1].time) })
  //   const endTime2 = addToDate(startTime2, { minute: events[1].duration })
  //   if (isBetweenDates(startTime2, startTime, endTime, true) || isBetweenDates(endTime2, startTime, endTime, true)) {
  //     events[0].side = 'left'
  //     events[1].side = 'right'
  //   }
  //   else {
  //     events[0].side = 'full'
  //     events[1].side = 'full'
  //   }
  // }
  // console.log('Events', events)
  // return events
}

function scrollToEvent(event) {
  calendar.value.scrollToTime(event.time, 350)
}

const eventsExample = ref([
  {
    id: 5,
    title: 'Visit mom',
    details: 'Always a nice chat with mom',
    date: getCurrentDay(20),
    time: '17:00',
    duration: 90,
    bgcolor: 'grey',
    icon: 'fas fa-car'
  },
  {
    id: 6,
    title: 'Conference',
    details: 'Teaching Javascript 101',
    date: getCurrentDay(22),
    time: '08:00',
    duration: 540,
    bgcolor: 'blue',
    icon: 'fas fa-chalkboard-teacher'
  },
  {
    id: 7,
    title: 'Girlfriend',
    details: 'Meet GF for dinner at Swanky Restaurant',
    date: getCurrentDay(22),
    time: '19:00',
    duration: 180,
    bgcolor: 'teal',
    icon: 'fas fa-utensils'
  },
  {
    id: 8,
    title: 'Girlfriend',
    details: 'Meet GF for dinner at Swanky Restaurant',
    date: getCurrentDay(22),
    time: '19:00',
    duration: 180,
    bgcolor: 'red',
    icon: 'fas fa-utensils'
  }
])


</script>
<style lang="scss" scoped>
.day-view-current-time-indicator {
  position: absolute;
  left: -5px;
  height: 10px;
  width: 10px;
  margin-top: -4px;
  background-color: rgba(0, 0, 255, .5);
  border-radius: 50%;
}

.day-view-current-time-line {
  position: absolute;
  left: 5px;
  border-top: rgba(0, 0, 255, .5) 2px solid;
  width: calc(100% - 5px);
}

.q-dark,
.body--dark,
.q-calendar--dark .day-view-current-time-indicator {
  background-color: rgba(255, 255, 0, .85);
}

.day-view-current-time-line {
  border-top: red 2px solid;
}
</style>
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
