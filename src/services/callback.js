import api from "../libs/api";

export default {

  getCallbacks: async (page = 1, itemsPerPage = 15) => {
    try {
      const { status, data } = await api().get(`/callbacks`, {
        params: { page, per_page: itemsPerPage },
      });
      if (status === 200) return data;
      throw new Error(`Failed with status: ${status}`, status);
    } catch (error) {
      throw error; 
    }
  },

  postCallback: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post("/callbacks", data)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  updateCallback: (id, data) => {
    return new Promise((resolve, reject) => {
      api()
        .put(`/callbacks/${id}`, data)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  deleteCallback: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`/callbacks/${id}`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },
};
