<template>
  <q-item clickable tag="a" :to="link" :exact="exact" v-if="name != 'logout'" v-ripple :active="true"
    active-class="text-primary" class="settings">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label v-if="caption" caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-item v-else clickable tag="a" v-ripple:red
    class="exit">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label v-if="caption" caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      default: "",
    },

    visible: {
      type: Boolean,
      default: true,
    },

    exact: {
      type: Boolean,
      default: false,
    },

  },
});
</script>
<style lang="scss" scoped>
.settings:hover {
  color: $primary;

  // i {
  //   color: rgba(25, 118, 210, 0.7) !important;
  // }
}

.exit:hover {
  color: red !important;

  // i {
  //   color: rgba(255, 0, 0, 0.7) !important;
  // }
}
</style>


