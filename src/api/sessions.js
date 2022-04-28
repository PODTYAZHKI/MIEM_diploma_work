import { api } from "boot/axios";

export async function fetchSessions(device_id) {
  const url = `https://constructor.auditory.ru/lab/api/v1/devices/${device_id}/sessions`;
  return await api
    .get(url, { withCredentials: false })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export async function addSession(session, device_id) {
  const url = `https://constructor.auditory.ru/lab/api/v1/devices/${device_id}/sessions`;
  console.log(session);
  return await api
    .post(url, session)
    .then((res) => {
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export async function removeSession(standId, session) {
  return await api
    .delete(
      `https://constructor.auditory.ru/lab/api/v1/devices/${standId}/sessions/${session.id}`,
      session
    )
    .then((res) => {
      return true
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}
