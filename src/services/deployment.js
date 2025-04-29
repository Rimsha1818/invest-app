import api from "../libs/api";

export default {
  getDeployment: (page, itemsPerPage, sortBy = "", sortOrder = "", request_title = "") => {
    return new Promise((resolve, reject) => {
      const queryParams = new URLSearchParams({
        page,
        itemsPerPage,
        sortBy,
        sortOrder,
        request_title,
      }).toString();

      api()
        .get(`/deployment-form?${queryParams}`)
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

  getDeploymentDetails: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/deployment-form/${id}`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data.data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },

  searchDeployment: (fields) => {
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

      const url = `/deployment-form-filters?${queryString}`;

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

  postDeployment: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post("deployment-form", data, {
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

  updateDeployment: (id, data) => {
    // for updating image specially for laravel api use x-www-form-urlencoded
    return new Promise((resolve, reject) => {
      api()
        .post(`deployment-form/${id}?_method=PUT`, data, {
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

  deleteDeployment: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`deployment-form/${id}`)
        .then(({ status, data }) => {
          if (status === 200) {
            resolve(data);
          }
        })
        .catch((error) => reject(error));
    });
  },

  deleteDeploymentCommentAttachment: (id) => {
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

  getDeploymentByTitle: (search = "") => {
    return new Promise((resolve, reject) => {
      const queryParams = new URLSearchParams({
        search,
      }).toString();

      api()
        .get(`/search-title?${queryParams}`)
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
  getDepByTitle_Form: (search = "", form_id = "") => {
    return new Promise((resolve, reject) => {
      const queryParams = new URLSearchParams({
        search,
        form_id,
      }).toString();

      api()
        .get(`/search-records-by-forms?${queryParams}`)
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

  updateDeploymentStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      api()
        .post(`deployment-status-update/${id}?_method=PUT`, status, {
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
};
