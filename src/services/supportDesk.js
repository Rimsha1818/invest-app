
import api from '../libs/api';

export default {

  getsupportDesk: (page, itemsPerPage, sortBy = '', sortOrder = '') => {
    return new Promise((resolve, reject) => {
      const queryParams = new URLSearchParams({
        page,
        itemsPerPage,
        sortBy,
        sortOrder,
      }).toString();
      
      api()
        .get(`/request-support-form?${queryParams}`)
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



searchSupportDesk: (fields) => {
  return new Promise((resolve, reject) => {
      const filteredFields = Object.entries(fields)
      .filter(([key, value]) => value !== undefined && value !== '' && typeof value !== 'object');
      const queryString = filteredFields
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');

      const url = `/request-support-form?${queryString}`;

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


  postSupportDesk: (data) => {
  return new Promise((resolve, reject) => {
    api()
      .post("request-support-form", data, {
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

  getSupportDeskById: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .get(`/request-support-form/${id}`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },


  getEquipmentsRequestById: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/crf/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  
  updateEquipmentRequest: (id, data) => {
  return new Promise((resolve, reject) => {
      api()
          .put(`crf/${id}`, data)
          .then(({ status, data }) => {
              if (status === 201) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
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
      .catch(error => reject(error));
  });
},
  

}