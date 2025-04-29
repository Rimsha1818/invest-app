import api from "../libs/api";

export default {
  getScrf: (page, itemsPerPage, sortBy = "", sortOrder = "") => {
    return new Promise((resolve, reject) => {
      const queryParams = new URLSearchParams({
        page,
        itemsPerPage,
        sortBy,
        sortOrder,
      }).toString();

      api()
        .get(`/scrf?${queryParams}`)
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

  getScrfDetails: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/scrf/${id}`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data.data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  searchScrf: (fields) => {
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

      const url = `/scrf-filters?${queryString}`;

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

  postScrf: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post("scrf", data, {
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

  updateScrf: (id, data) => {
    // for updating image specially for laravel api use x-www-form-urlencoded
    return new Promise((resolve, reject) => {
      api()
        .post(`scrf/${id}?_method=PUT`, data, {
          headers: {
            "Content-Type": "x-www-form-urlencoded",
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

  deleteScrf: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`scrf/${id}`)
        .then(({ status, data }) => {
          if (status === 200) {
            resolve(data);
          }
        })
        .catch((error) => reject(error));
    });
  },

  deleteScrfCommentAttachment: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`attachments/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(({ status, data }) => {
          if (status === 200) {
            resolve(data);
          }
          console.log(data);
        })
        .catch((error) => reject(error));
    });
  },
};
