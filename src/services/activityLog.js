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
  getAllActivities: (page, itemsPerPage, searchQuery, form_id, user_id, key) => {
    return new Promise((resolve, reject) => {
      const params = {
        page: page,
        itemsPerPage: itemsPerPage,
        search: searchQuery,
        form_id: form_id,
      };
      if (user_id && user_id > 0) {
        params.user_id = user_id;
      }
      if (key && key > 0) {
        params.key = key;
      }
  
      api()
        .get('/activity-logs', { params })
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

  

  saveCompany: (data) => {
    return new Promise((resolve, reject) => {
      api()
        .post('companies', data, {
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

//   updateCompany: (id, data) => {
//   return new Promise((resolve, reject) => {
//     api()
//       .put(`/companies/${id}`,  data, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         })
//       .then(({ status, data }) => {
//         if (status === 201) resolve(data); // Update the success status check
//         else throw new Error(`Failed with status: ${status}`);
//       })
//       .catch((error) => reject(error));
//   });
// },
updateCompany: (id, data) => {
  data.append('_method', 'PUT'); // Emulate PUT via POST

  return new Promise((resolve, reject) => {
    api()
      .post(`/companies/${id}`, data, {
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

  // updateCompany: (id, data) => {
  //   return new Promise((resolve, reject) => {
  //     api()
  //       .put(`/companies/${id}`, data)
  //       .then(({ status, data }) => {
  //         if (status === 201) resolve(data);
  //         throw new Error(`Failed with status: ${status}`);
  //       })
  //       .catch((error) => reject(error));
  //   });
  // },
   deleteDepartment: (id) => {
    return new Promise((resolve, reject) => {
      api()
        .delete(`/companies/${id}`)
        .then(({ status, data }) => {
          if (status === 200) resolve(data);
          throw new Error(`Failed with status: ${status}`);
        })
        .catch((error) => reject(error));
    });
  },


}