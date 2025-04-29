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
  getAllUsers: (page, itemsPerPage, searchQuery) => {
    return new Promise((resolve, reject) => {
      const params = {
        page: page,
        itemsPerPage: itemsPerPage,
        search: searchQuery,
        // all: 1,
      };
  
      api()
        .get('/users', { params })
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
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

  

  register: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post('register', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(({ status, data }) => {
          if (status === 201) {
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



}