<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> {{ $q.screen.lt.md ? $route.meta.title : 'Сервис Бронирования' }} </q-toolbar-title>
        <Profile v-if="$q.screen.gt.sm ">
          <q-list bordered>
            <EssentialLink v-for="link in profileLinks" :key="link.title" v-bind="link" />
          </q-list>
        </Profile>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above  bordered :mini="miniDrwaer">
      <ProfileInfoComponent v-if="$q.screen.lt.md" />
      <q-list>
        <!-- <q-item-label header> Essential Links </q-item-label> -->

        <EssentialLink title="Главная" icon="home" link="/" exact />
        <q-separator v-if="$q.screen.lt.md" />
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />


      </q-list>
      <div v-if="$q.screen.lt.md">
        <q-separator />
        <q-list>
          <EssentialLink v-for="link in profileLinks" :key="link.title" v-bind="link" />
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script >
import { ref, computed, watch } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import Profile from "components/ProfileComponent.vue";
import ProfileInfoComponent from "components/ProfileInfoComponent.vue";
import { useQuasar } from 'quasar'
import { useUserStore } from "stores/user";
import { checkHasRole } from "src/utils/roles";
import {useRoute} from "vue-router";
// import {MainLink} from "components/models"

export default {
  components: {
    EssentialLink, Profile, ProfileInfoComponent
  },
  setup() {
    const mainLinksList = [
      {
        title: "Мои группы",
        icon: "groups",
        link: "/groups",
      },
      {
        title: "Мои стенды",
        icon: "school",
        link: "/stands",
      },
      {
        title: "Мои сессии",
        icon: "bookmark_border",
        link: "/sessions/my",
      },
    ];
    const profileLinks = [
      {
        name: 'settings',
        title: 'Настройки',
        link: '/settings',
        icon: 'manage_accounts'
      },
      {
        name: 'logout',
        title: 'Выйти',
        icon: 'logout'
      }
    ]
    const store = useUserStore();
    const q = useQuasar()

    const route = useRoute().path;

    const pageName = computed(()=>{
      let name = ""
      switch (route) {
        case '/groups':
          name = 'Мои группы';
          break
        case '/stands':
          name =  'Мои стенды';
          break
        case '/sessions':
          name = 'Мои сессии';
          break
        default:
          name = 'Сервис Бронирования'
          break
      }
      return name
    })
    const screen = q.screen.name
    const leftDrawerOpen = ref(false);
    const miniDrwaer = ref(true);
    function toggleLeftDrawer() {
      if (q.screen.lt.md) leftDrawerOpen.value = !leftDrawerOpen.value;
      miniDrwaer.value = !miniDrwaer.value;
    }
    return { linksList: mainLinksList, profileLinks, leftDrawerOpen, miniDrwaer, toggleLeftDrawer, q, pageName,  screen};
  },

  data() {
    return {};
  },
  props: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
