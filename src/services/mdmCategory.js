import api from "../libs/api";

export default {

  getMdmCat: (page = 1, itemsPerPage = 15) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/mdm_categories`, {
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

  getAllDepartments: () => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/get-all-mdm_categories`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data.data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  postMdmCat: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post("/mdm_categories", data)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  updateMdmCat: (id, data) => {
    return new Promise((resolve, reject) => {
      api()
        .put(`/mdm_categories/${id}`, data)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  deleteMdmCat: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`/mdm_categories/${id}`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },
};
