<template>
  <div style="min-width: 300px" class="">
    <div class="row items-center ">
      <q-img src="src/assets/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://ssl.gstatic.com/s2/profiles/images/silhouette200.png">
          </q-avatar>
          <div class="text-weight-bold">{{ fullName }}</div>
          <div>{{ isLecturer ? ruzDepartment : ruzGroup }}</div>
        </div>
      </q-img>
    </div>
  </div>
</template>
<script  setup>
import { ref, computed } from "vue";
import { useUserStore } from "stores/user";
const store = useUserStore()
const fullName = computed(() => store.userFullName);
const isLecturer = computed(() => store.isLecturer);
const ruzDepartment = computed(() => store.ruzDepartment);
const ruzGroup = computed(() => store.ruzGroup);

</script>
