import api from './../libs/api';

export default {
  
register: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post('register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(({ status, data }) => {
                if (status === 200) resolve(data);
                throw new Error(`Register failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
},

login: (data) => {
  return new Promise((resolve, reject) => {
      api()
          .post('super-admin-login3032825', data)
          .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Login failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

forgotPassword: (data) => {
  return new Promise((resolve, reject) => {
      api()
          .post('password/forgot', data)
          .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Forgot Password failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

resetPassword: (token, data) => {
  return new Promise((resolve, reject) => {
      api()
          .put(`password/reset/${token}`, data)
          .then(({ status, data }) => {
              if (status === 200) resolve(data);
              throw new Error(`Reset Password failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

updatePassword: (id, data) => {
  return new Promise((resolve, reject) => {
      api()
          .put(`/update-password/${id}`, data)
          .then(({ status, data }) => {
              if (status === 201) resolve(data);
              throw new Error(`Update Password failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},

updateProfile: (id, data) => {
  return new Promise((resolve, reject) => {
      api()
          .put(`/users/${id}`, data)
          .then(({ status, data }) => {
              if (status === 201) resolve(data);
              throw new Error(`Update Profile failed with status: ${status}`);
          })
          .catch(error => reject(error));
  });
},


};