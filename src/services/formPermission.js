import api from '../libs/api';

export default {

  getPermissions: () => {
    return new Promise((resolve, reject) => {
        api()
            .get(`/form-permissions`)
            .then(({ status, data }) => {
                if (status === 200) resolve(data.data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

  postPermission: (data) => {
  return new Promise((resolve, reject) => {
      api()
          .post('/form-permissions', data)
          .then(({ status, data }) => {
              if (status === 201) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

updatePermission: (id, data) => {
  return new Promise((resolve, reject) => {
      api()
          .put(`/form-permissions/${id}`, data)
          .then(({ status, data }) => {
              if (status === 201) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

deletePermission: (id) => {
  return new Promise((resolve, reject) => {
      api()
          .delete(`/form-permissions/${id}`)
          .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

getAssignedPermission: (page = 1, itemsPerPage = 10) => {
  return new Promise((resolve, reject) => {
    api()
      .get(`/form-role-users?page=${page}&perPage=${itemsPerPage}`)
      .then(({ status, data }) => {
        if (status === 200) resolve(data.data);
        throw new Error(`Failed with status: ${status}`);
      })
      .catch(error => reject(error));
  });
},

postAssignedPermission: (data) => {
  return new Promise((resolve, reject) => {
      api()
          .post('/form-role-users', data)
          .then(({ status, data }) => {
              if (status === 201) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

updateAssignedPermission: (id, data) => {
  return new Promise((resolve, reject) => {
      api()
          .put(`/form-role-users/${id}`, data)
          .then(({ status, data }) => {
              if (status === 201) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

deleteAssignedPermission: (id) => {
  return new Promise((resolve, reject) => {
      api()
          .delete(`/form-role-users/${id}`)
          .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},


}