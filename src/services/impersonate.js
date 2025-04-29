import api from '../libs/api';

export default {

  // getCrfSettings: () => {
  //   return new Promise((resolve, reject) => {
  //       api()
  //           .get(`/other-dependents`)
  //           .then(({ status, data }) => {
  //               if (status === 200) resolve(data.data);
  //               throw new Error(`Failed with status: ${status}`);
  //           })
  //           .catch(error => reject(error));
  //   });
  // },
  impersonateStop: () => {
    return new Promise((resolve, reject) => {
        api()
            .post(`/impersonate-stop`)
            .then(({ status, data }) => {
                if (status === 200 || status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },
  impersonateUser: (data) => {
    return new Promise((resolve, reject) => {
        api()
            .post(`/impersonate/${data.user_id}`, data)
            .then(({ status, data }) => {
                if (status === 200 || status === 201) resolve(data);
                throw new Error(`Failed with status: ${status}`);
            })
            .catch(error => reject(error));
    });
  },

}