import api from "../libs/api";

const sapService = {
  getSap: (page, itemsPerPage, sortBy = "", sortOrder = "") => {
    return new Promise((resolve, reject) => {
      const queryParams = new URLSearchParams({
        page,
        itemsPerPage,
        sortBy,
        sortOrder,
      }).toString();

      api()
        .get(`/sap-access-form?${queryParams}`)
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

  searchSap: (fields) => {
    return new Promise((resolve, reject) => {
      const filteredFields = Object.entries(fields).filter(
        ([key, value]) =>
          value !== undefined && value !== "" && typeof value !== "object"
      );
      const queryString = filteredFields
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");

      const url = `/sap-access-form-filters?${queryString}`;

      api()
        .get(url)
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

  postSapRequest: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post("sap-access-form", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(({ status, data }) => {
          if (status === 201) {
            resolve(data);
          }
        })
        .catch((error) => reject(error));
    });
  },

  getSapById: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/sap-access-form/${id}`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  updateSapForm: (id, data) => {
    // return new Promise((resolve, reject) => {
    //   api()
    //     .put(`sap-access-form/${id}`, data)
    //     .then(({ status, data }) => {
    //       if (status === 201) resolve(data);
    //       throw new Error(`Failed with status: ${status}`);
    //     })
    //     .catch((error) => reject(error));
    // });

     // for updating image specially for laravel api use x-www-form-urlencoded
    return new Promise((resolve, reject) => {
      api()
        .post(`sap-access-form/${id}?_method=PUT`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(({ status, data }) => {
          if (status === 201) {
            resolve(data);
          }
        })
        .catch((error) => reject(error));
    });
  },

  deleteCrf: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`crf/${id}`)
        .then(({ status, data }) => {
          if (status === 200) {
            resolve(data);
          }
        })
        .catch((error) => reject(error));
    });
  },
};
export default sapService;