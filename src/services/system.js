import api from '../libs/api';

export default {

  getSystemSettings: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/settings`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateSystemSettings: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/settings`, data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

}