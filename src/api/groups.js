import { api } from 'boot/axios';

export async function fetchGroups() {
  return api.get(
    `https://constructor.auditory.ru/lab/api/v1/groups`,
    {
      withCredentials: false,
    }
  ).then((res) => {
    return res.data;
  }).catch((error) => {
    console.error(error);
    return false
  })
}

export async function fetchGroup(groupId) {

  return api.get(
    `https://constructor.auditory.ru/lab/api/v1/groups/${groupId}`,
    {
      withCredentials: false,
    }
  ).then((res) => {
    return res.data;
  }).catch((error) => {
    console.error(error);
    return false
  })
}

