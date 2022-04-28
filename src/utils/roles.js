export function checkHasRole(user_roles, roles, reverse) {
  return user_roles.some(role => roles.includes(role)) ^ (reverse ? 1 : 0)
}
