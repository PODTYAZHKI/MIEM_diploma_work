
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'index',
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: {title: 'Сервис Бронирования'}
      },
      {
        name: 'settings',
        path: '/settings',
        component: () => import('pages/SettingsPage.vue'),
        meta: {title: 'Сервис Бронирования'}
      },
      {
        name: 'stands',
        path: '/stands',
        component: () => import('pages/StandsPage.vue'),
        meta: {title: 'Мои стенды'},
      },
      {
        name: 'stand',
        path: '/stands/:groupId/:standId',
        component: () => import('layouts/StandLayout.vue'),
        children: [
          {
            name: 'standCalendar',
            path: '/stands/:groupId/:standId/calendar',
            component: () => import('pages/StandCalendar.vue'),
          },
          {
            name: 'standSessions',
            path: '/stands/:groupId/:standId/sessions',
            component: () => import('pages/StandSessions.vue'),
          },
        ]
      },
      {
        name: 'groups',
        path: '/groups',
        component: () => import('pages/GroupsPageV2.vue'),
        meta: {title: 'Мои группы'}
      },
      {
        name: 'group',
        path: '/groups/:groupId',
        component: () => import('layouts/GroupLayout.vue'),
        children: [
          {
            name: 'groupStands',
            path: '/groups/:groupId/stands',
            component: () => import('pages/GroupStands.vue'),
          },
          {
            name: 'groupUsers',
            path: '/groups/:groupId/users',
            component: () => import('pages/GroupUsers.vue'),
          },
          {
            name: 'groupSettings',
            path: '/groups/:groupId/settings',
            component: () => import('pages/GroupSettings.vue'),
          }
        ],
      },
      {
        name: 'sessions',
        path: '/sessions',
        component: () => import('layouts/SessionsLayout.vue'),
        meta: {title: 'Мои сессии'},
        children: [
          {
            name: 'sessionsMy',
            path: '/sessions/my',
            component: () => import('pages/SessionsMy.vue'),
          },
          {
            name: 'sessionsCalendar',
            path: '/sessions/calendar',
            component: () => import('pages/SessionsCalendar.vue'),
          }
        ]
      },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/GlobalError.vue')
  }
]

export default routes
