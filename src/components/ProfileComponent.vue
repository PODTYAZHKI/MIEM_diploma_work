<template>
  <!-- <q-chip color="purple"> -->
  <!-- <q-avatar color="red" text-color="white" class="cursor-pointer">{{ nameAbbr }}
    <q-menu transition-show="flip-right" transition-hide="flip-left" anchor="top left" self="top right">
      <q-list bordered>
        <q-item >
          <q-item-section avatar>
            <q-avatar color="red" text-color="white" class="cursor-pointer">{{ nameAbbr }}</q-avatar>
          </q-item-section>
          <q-item-section>{{fullName}}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-avatar> -->
  <q-btn round flat>
    <q-avatar v-if="!thumbnailPhotoUrl" color="pink" text-color="white">{{ nameAbbr }}</q-avatar>
    <q-avatar v-else><img alt="Аватарка" :src="thumbnailPhotoUrl" /></q-avatar>
    <q-menu>
      <ProfileInfoComponent />
      <slot></slot>
    </q-menu>
  </q-btn>

  <!-- <q-chip color="red" text-color="white">{{ fullName }}</q-chip> -->
  <!-- </q-chip> -->

</template>
<script>
import { ref, computed } from "vue";
import { useUserStore } from "stores/user";
import ProfileInfoComponent from "components/ProfileInfoComponent.vue";
export default {
  components: { ProfileInfoComponent },
  setup() {
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
    const nameAbbr = computed(() => store.userNameAbbr);

    const thumbnailPhotoUrl = computed(
      () =>store.thumbnailPhotoUrl
    );

    return { nameAbbr, thumbnailPhotoUrl, profileLinks }
  }
}
</script>

<style lang="scss">
</style>
