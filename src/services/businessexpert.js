import api from '../libs/api';

export default {

  getBusinessexpert: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/business-experts`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getAllBusinessexpert: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-all-business-experts`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postBusinessexpert: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('/business-experts', data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  updateBusinessexpert: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/business-experts/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  deleteBusinessexpert: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/business-experts/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

}