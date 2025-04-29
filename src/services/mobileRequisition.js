import api from "../libs/api";

export default {

  get: (page, itemsPerPage, sortBy = '', sortOrder = '') => {
    return new Promise((resolve, reject) => {
      const queryParams = new URLSearchParams({
        page,
        itemsPerPage,
        sortBy,
        sortOrder,
      }).toString();
      
      api()
        .get(`/mobile-requisition?${queryParams}`)
        .then(({ status, data }) => {
          if (status === 200) {
            resolve(data);
          } else {
            throw new Error(`Failed with status: ${status}`);
          }
        })
        .catch((error) => reject(error));
    });
  },

  post: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post(`/mobile-requisition`, data)
            .then(({ status, data }) => {
              if (status === 201) resolve(data);
              throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
            .put(`/mobile-requisition/${id}`, data)
            .then(({ status, data }) => {
              if (status === 201) resolve(data);
              throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`/mobile-requisition/${id}`)
        .then(({ status, data }) => {
          if (status === 200) {
            resolve(data);
          }
        })
        .catch(error => reject(error));
    });
  },

  getMRDetails: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/mobile-requisition/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

}