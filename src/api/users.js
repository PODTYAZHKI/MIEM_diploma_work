import { api } from 'boot/axios';

export async function fetchUsers(groupId) {
  return await api
    .get(`https://constructor.auditory.ru/lab/api/v1/groups/${groupId}/users`, {
      withCredentials: false,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export async function searchUsers(i) {
  const url = `https://constructor.auditory.ru/lab/api/v1/users?query=${i}`;
  return await api
    .get(url, {
      withCredentials: false,
    })
    .then((res) => {
      console.log('res', res.data);

      return res.data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export async function addUsers(user, groupId) {
  const url = `https://constructor.auditory.ru/lab/api/v1/groups/${groupId}/users`;
  return await api
    .post(
      url,
      {
        withCredentials: false,
      },
      user
    )
    .then((res) => {
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export async function removeUser(id, groupId) {
  const url = `https://constructor.auditory.ru/lab/api/v1/groups/${groupId}/users/${id}`;
  return await api.delete(url, { withCredentials: false }).then((res)=>{
    return true
  }).catch((error) => {
    console.error(error);
    return false;
  })
}
