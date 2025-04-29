import api from '../libs/api';

export default {

  getDesignations: async (page = 1, itemsPerPage = 15) => {
    try {
      const { status, data } = await api().get(`/designations`, {
        params: { page, per_page: itemsPerPage },
      });
      if (status === 200) return data.data;
      throw new Error(`Failed with status: ${status}`, status);
    } catch (error) {
      throw error; // Re-throw to handle at a higher level if needed
    }
  },

  getAllDesignations: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/get-all-designations`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  postDesignation: (data) => {
  return new Promise((resolve, reject) => {
      api()
          .post('designations', data)
          .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},


updateDesignation: (id, data) => {
  return new Promise((resolve, reject) => {
      api()
          .put(`/designations/${id}`, data)
          .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

deleteDesignation: (id) => {
  return new Promise((resolve, reject) => {
      api()
          .delete(`/designations/${id}`)
          .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},


}