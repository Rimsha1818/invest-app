import api from "../libs/api";

export default {

  getMakes: (page = 1, itemsPerPage = 15) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/makes`, {
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

  getAllMakes: () => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/get-all-makes`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data.data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  postMake: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post("/makes", data)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  updateMake: (id, data) => {
    return new Promise((resolve, reject) => {
      api()
        .put(`/makes/${id}`, data)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  deleteMake: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`/makes/${id}`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },
};
