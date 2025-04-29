import api from "../libs/api";

export default {

  getServices: (page = 1, itemsPerPage = 15) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/services`, {
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

  getTeams: (page = 1, itemsPerPage = 15) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/get-all-teams`, {
          // params: {
          //   page: page,
          //   per_page: itemsPerPage,
          // },
        })
        .then(({ status, data }) => {
          if (status === 200) resolve(data.data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  // getAllDepartments: () => {
  //   return new Promise((resolve, reject) => {
  //     api()
  //       .get(`/get-all-departments`)
  //       .then(({ status, data }) => {
  //         if (status === 200) resolve(data.data);
  //         throw new Error(`Failed with status: ${status}`);
  //       })
  //       .catch((error) => reject(error));
  //   });
  // },

  postService: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post("/services", data)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  updateService: (id, data) => {
    return new Promise((resolve, reject) => {
      api()
        .put(`/services/${id}`, data)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  deleteService: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`/services/${id}`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },
};
