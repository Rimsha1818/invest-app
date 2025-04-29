import api from '../libs/api';

export default {

  getCrfSettings: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/other-dependents`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateCrfSettings: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post(`/other-dependents`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

}