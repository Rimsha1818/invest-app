import api from '../libs/api';

export default {

  getLocations: (page = 1, itemsPerPage = 15) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/locations`, {
          params: {
            page: page,
            per_page: itemsPerPage,
          },
        })
        .then(({ status, data }) => {
          if (status === 200) resolve(data.data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  getAllLocations: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-all-locations`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postLocation: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('/locations', data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
  
  updateLocation: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/locations/${id}`, data)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  deleteLocation: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .delete(`/locations/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
  
}