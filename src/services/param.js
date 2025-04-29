import api from '../libs/api';

export default {

  searchUsers: (query) => {
    return new Promise((resolve, reject) => {
      api()
        .get('/users-search', { // Make sure this matches your Laravel route
          params: { 
            query: query 
          }
        })
        .then(({ status, data }) => {
          if (status === 200) {
            resolve(data); // Assuming your API returns the user data directly
          } else {
            reject(new Error(`Failed with status: ${status}`));
          }
        })
        .catch(error => reject(error));
    });
  },
  getAllParams: (page, itemsPerPage, type, company_id) => {
    return new Promise((resolve, reject) => {
      const params = {
        page: page,
        itemsPerPage: itemsPerPage,
        type: type,
        company_id: company_id,
      };
  
      api()
        .get('/dependent-cruds', { params })
        .then(({ status, data }) => {
          if (status === 201) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch(error => reject(error));
    });
  },
  getParam: (type, company_id) => {
    return new Promise((resolve, reject) => {
      const params = {
        type: type,
        company_id: company_id,
      };
  
      api()
        .get('/dependent-cruds', { params })
        .then(({ status, data }) => {
          if (status === 201) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch(error => reject(error));
    });
  },

  getUsers: (query = '?all') => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/users${query}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },


  getCurrentUser: (id) => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/users/${id}`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  

  saveParam: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post('dependent-cruds', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(({ status, data }) => {
          if (status === 201 || status === 200 ) {
            resolve(data);
          } else if (status === 422) {
            reject(data);
          } else {
            reject("An error occurred");
          }
        })
        .catch(error => reject(error));
    });
  },

updateParam: (id, data) => {
  data.append('_method', 'PUT'); // Emulate PUT via POST

  return new Promise((resolve, reject) => {
    api()
      .post(`/dependent-cruds/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(({ status, data }) => {
        if (status === 201) resolve(data); // Use 200 status for update success
        else throw new Error(`Failed with status: ${status}`);
      })
      .catch((error) => reject(error));
  });
},

 
   deleteParam: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`/dependent-cruds/${id}`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },


}