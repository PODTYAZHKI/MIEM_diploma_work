import {Cookies} from 'quasar'

const auth_cookie_name = 'gc_auth_token';

export function hasAuthToken() {
  return Cookies.has(auth_cookie_name)
}

export function getAuthToken() {
  return Cookies.get(auth_cookie_name);
}

export function removeAuthToken(){
  return Cookies.remove(auth_cookie_name);
}
