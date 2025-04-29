import api from '../libs/api';

export default {

  getForms: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/forms`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
  

  getFormDetails: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .post(`/get-form-details?form_id=${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  getFormSetupFields: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/setup-fields`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

 getFormSetupFieldsById: (id) => {
    return new Promise((resolve, reject) => {
        api().get(`forms/${id}`).then(({ status, data }) => {
            if (status === 200) resolve(data);
            throw new Error(`Failed with status: ${status}`);
        }).catch(error => reject(error));
    });
},

serviceDesk: (id, page, itemsPerPage, sortBy, sortOrder) => {
  return new Promise((resolve, reject) => {
      api().get(
        `service-desk?form_id=${id}&page=${page}&perPage=${itemsPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    ).then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
      }).catch(error => reject(error));
  });
},

search: (formId, fields) => {
  return new Promise((resolve, reject) => {
      const filteredFields = Object.entries(fields)
          .filter(([key, value]) => value !== undefined && value !== '' && typeof value !== 'object');
      const queryString = filteredFields
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
      const url = `/service-desk?${queryString}`;

      console.log(url);

      api()
          .get(url)
          .then(({ status, data }) => {
              if (status === 200) {
                  resolve(data);
              } else {
                  throw new Error(`Failed with status: ${status}`);
              }
          })
          .catch(error => reject(error));
  });
},


getServiceDeskAllTask: (id) => {
  return new Promise((resolve, reject) => {
      api().get(`service-desk?form_id=${id}`).then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
      }).catch(error => reject(error));
  });
},

updateFormSetupFields: (id, data) => {
    return new Promise((resolve, reject) => {
        api()
        .put(`/forms/${id}`, data)
        .then(({ status, data }) => {
                if (status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

supportServiceDesk: (id, page, itemsPerPage, sortBy, sortOrder) => {
  return new Promise((resolve, reject) => {
      api().get(
        `request-support-desk`
    ).then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
      }).catch(error => reject(error));
  });
},

supportDesksearch: (formId, fields) => {
  return new Promise((resolve, reject) => {
      const filteredFields = Object.entries(fields)
          .filter(([key, value]) => value !== undefined && value !== '' && typeof value !== 'object');
      const queryString = filteredFields
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
      const url = `/request-support-desk?${queryString}`;

      console.log(url);

      api()
          .get(url)
          .then(({ status, data }) => {
              if (status === 200) {
                  resolve(data);
              } else {
                  throw new Error(`Failed with status: ${status}`);
              }
          })
          .catch(error => reject(error));
  });
},

}