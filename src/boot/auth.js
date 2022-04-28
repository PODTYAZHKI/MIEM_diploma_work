import {boot} from 'quasar/wrappers'
import {hasAuthToken} from 'src/utils/auth';
import { useUserStore } from 'src/stores/user';


export default boot(async ({router}) => {
  router.beforeEach((to, from, next) => {
      const store = useUserStore()
      // if (to.meta.ignoreAuth) {
      //   next();
      //   return;
      // }
      console.log('before')
      if (hasAuthToken() && !store.user.loggedIn) {
        // If the user is not logged in but has auth token
        try {
          console.log('auth')
          // then we try to get his info
          store.handleLogin();
        } catch (e) {
          console.error(e);
          if (e.response) {
            if (e.response.status >= 400 && e.response.status < 500) {
              // removeAuthToken();
              next({
                name: 'index'
              });
              // return;
            }
            if (e.response.status >= 500) {
              next({
                name: 'GlobalError'
              });
              // return;
            }
          }
        }
      }

      if (store.user.loggedIn) {
        // if (to.meta.anonymousOnly) {
        //   next({
        //     name: 'index'
        //   });
        //   // return;
        // }

      //   if (to.meta && to.meta.roles) {
      //     const hasRole = store.user.dynamicRoles.some(role => to.meta.roles.includes(role));
      //     if ((hasRole ^ (to.meta.excludeRoles ? 1 : 0)) ||
      //       to.meta.allowForUsers?.includes(store.state.user.data.id) ||
      //       to.meta.allowForRuzGroups?.includes(store.user.ruzGroup)) {
      //       next();
      //     } else {
      //       next(false);
      //     }
      //   } else {
      //     next();
      //   }
      // } else {
      //   if (!to.meta.anonymousOnly) {
      //     // if (hasAuthToken())
      //     //   removeAuthToken();
      //     next({name: 'Login'});
      //     return;
      //   }
        console.log('logged in')
        next();
      }
      next()
    }
  )
})
