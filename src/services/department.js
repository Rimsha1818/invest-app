import api from "../libs/api";

export default {

  getDepartments: (page = 1, itemsPerPage = 15) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/departments`, {
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


    getDepartmentUP: async (page = 1, itemsPerPage = 15) => {
    try {
      const { status, data } = await api().get(`/departments`, {
        params: { page, per_page: itemsPerPage },
      });
      if (status === 200) return data;
      throw new Error(`Failed with status: ${status}`, status);
    } catch (error) {
      throw error; // Re-throw to handle at a higher level if needed
    }
  },


  getAllDepartments: () => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/get-all-departments`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data.data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  postDepartment: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post("/departments", data)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  updateDepartment: (id, data) => {
    return new Promise((resolve, reject) => {
      api()
        .put(`/departments/${id}`, data)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  deleteDepartment: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`/departments/${id}`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },
};
