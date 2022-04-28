<template>
  <q-page class="row justify-center items-center self-center" padding>
    <div class="q-pa-md q-gutter-md">
      <q-card class="q-pa-md" flat bordered>
        <q-card-section>
          <div class="text-overline text-center"><q-icon name="warning" class="text-red" style="font-size: 4rem;" /></div>
          <div class="text-h5 q-mt-sm q-mb-xs">Внутренняя ошибка</div>
          <p>
            Произошла внутренняя ошибка сервиса.<br>
            К сожалению, затронут один из важных компонентов, поэтому большая часть функционала может не работать.<br>
            Попробуйте перейти на главную страницу, нажав на кнопку ниже. Если это не помогло, подождите и попробуйте ещё раз.<br>
          </p>
        </q-card-section>

        <q-card-actions>
          <q-space />
          <q-btn
            color="primary"
            label="Попробовать ещё раз"
            icon="refresh"
            to="/"
          />
          <q-space />

        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
}
</script>
