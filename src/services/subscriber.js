import api from '../libs/api';

export default {

  getSubscribers: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/subscribers`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postSubscriber: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('/subscribers', data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateSubscriber: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/subscribers/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


}