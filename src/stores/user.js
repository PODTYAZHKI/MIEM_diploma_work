import { defineStore } from 'pinia';
import { api } from 'boot/axios';


// type CreateMutable<T> = { -readonly [P in keyof T]: CreateMutable<T[P]> };

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      loggedIn: false,
      data: {},
      dynamicRoles: [],
      sharedInfoToken: '',
    }
  }),
  actions: {
    async handleLogin() {
      const useResponse = await api.get(
        `${process.env.AUTH_API}/users/me`,
        { withCredentials: true }
      );
      this.user.data = useResponse.data;
      const rolesResponse = await api.get(
        `${process.env.AUTH_API}/users/me/dynamic-roles`,
        { withCredentials: true }
      );
      this.user.dynamicRoles = rolesResponse.data;
      const sharedInfoTokenResponse = await api.get(
        `${process.env.AUTH_API}/users/me/shared-info-token`,
        { withCredentials: true }
      );
      this.user.sharedInfoToken = sharedInfoTokenResponse.data;
      this.user.loggedIn = true;
    },
  },
  getters: {
    userHSEEmail(state) {
      return state.user.data?.['hse_email'];
    },
    userGoogleEmail(state) {
      return state.user.data?.['google_email'];
    },

    userFullName(state) {
      return state.user.data?.['name']?.['full_name'];
    },

    userNameAbbr(state) {
      const fn = state.user.data?.['name']?.[
        'first_name'
      ]?.[0];
      const ln = state.user.data?.['name']?.[
        'last_name'
      ]?.[0];
      return fn + ln;
    },

    thumbnailPhotoUrl(state) {
      return state.user.data?.['google_data']?.['thumbnailPhotoUrl'];
    },

    isStudent(state) {
      return state.user.dynamicRoles?.includes('STUDENT');
    },

    isLecturer(state) {
      return state.user.dynamicRoles?.includes('LECTURER');
    },

    isSuperAdmin(state) {
      const roles = state.user.data?.['roles'];
      return roles.includes('SUPER_ADMIN') ?? false;
    },

    isDeveloper(state) {
      const roles = state.user.data?.['roles'];
      return roles.includes('DEVELOPER') ?? false;
    },
    ruzGroup(state) {
      return state.user.data?.['ruz_data']?.['group'];
    },
    ruzDepartment(state) {
      return state.user.data?.['ruz_data']?.['department'];
    },

    roles(state) {
      return state.user.data?.['roles'] ?? [];
    },

    dynamicRoles(state) {
      return state.user.dynamicRoles ?? [];
    },

    authToken(state) {
      return state.user.data?.['auth_token'] ;
    },
  },
});
