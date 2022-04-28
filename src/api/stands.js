import { api } from "boot/axios";
export async function fetchStand(standId) {
  return await api
    .get(`https://constructor.auditory.ru/lab/api/v1/devices/${standId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}


