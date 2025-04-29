import api from '../libs/api';

export default {

  getPermissions: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/permissions`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

}