import api from '../libs/api';

export default {

  getWithoutWfs: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/without-workflows`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },



  updateWithoutWfs: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/without-workflows/${id}`, data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  deleteWithoutWfs: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/without-workflows/${id}`)
            .then(({ status, data }) => {
                if (status === 201 || status === 200 || status === 204) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postWithoutWfs: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('without-workflows', data)
            .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
  

}